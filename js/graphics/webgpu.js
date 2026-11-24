// THE CATROOMS / WebGPU scene renderer.
// This is a real GPU ray-caster: WGSL draws walls, floor, ceiling and ground decals.
// Characters and pickups use a GPU instanced billboard pass; imported GLBs use
// a separate textured triangular-mesh pass, with wall and mesh depth testing.
const TERRAIN_WGSL = /* wgsl */ `
struct SceneFrame {
 player:vec4f,      // xy position, heading, clock
 viewport:vec4f,    // width,height,map size,level
 progress:vec4f,    // items owned, goal, panel count, total panels
 visuals:vec4f,     // flashlight, health fraction, nearby enemy, pickup flash
 weather:vec4f,     // blackout, fog, rage, pitch horizon offset
 camera:vec4f,      // horizontal camera plane scale (FOV)
};
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var<storage,read> worldTiles:array<u32>;
@group(0) @binding(2) var wallTex:texture_2d_array<f32>;
@group(0) @binding(3) var wallSampler:sampler;
@group(0) @binding(4) var floorTex:texture_2d_array<f32>;
@group(0) @binding(5) var floorSampler:sampler;
@group(0) @binding(6) var<storage,read> decalCells:array<u32>;
@group(0) @binding(7) var<storage,read> decalData:array<vec4f>;
@group(0) @binding(8) var decalTex:texture_2d_array<f32>;
@group(0) @binding(9) var decalSampler:sampler;
struct RoomBox{ lower:vec4f,upper:vec4f };
@group(0) @binding(10) var<storage,read> roomObjects:array<RoomBox>;

struct PixelOut {
 @location(0) color:vec4f,
 @location(1) distance:vec4f,
};
@vertex fn vert(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 let p=array<vec2f,6>(vec2f(-1.,-1.),vec2f(1.,-1.),vec2f(-1.,1.),
                      vec2f(-1.,1.),vec2f(1.,-1.),vec2f(1.,1.));
 return vec4f(p[i],0.,1.);
}
fn tileAt(x:i32,y:i32)->u32 {
 if(x<0 || y<0 || x>=i32(frame.viewport.z) || y>=i32(frame.viewport.z)){return 1u;}
 let tile=worldTiles[u32(y)*128u+u32(x)];return select(tile,0u,tile==5u);
}
fn levelWall()->i32 {
 if(frame.viewport.w==2.){return 1;}
 if(frame.viewport.w==3. || frame.viewport.w==5. || frame.viewport.w==6.){return 2;}
 if(frame.viewport.w==4.){return 3;}
 return 0;
}
fn floorLayers()->i32 {
 if(frame.viewport.w==2.){return 2;}
 if(frame.viewport.w==3. || frame.viewport.w==5. || frame.viewport.w==6.){return 4;}
 if(frame.viewport.w==4.){return 6;}
 return 0;
}
fn sceneryAt(frag:vec2f,ray:vec2f)->vec4f {
 let h=frame.viewport.y;
 let horizon=h*(.5+frame.weather.w);
 let isFloor=frag.y>=horizon;
 let rd=h*.52/max(0.5,abs(frag.y-horizon));
 let worldPt=frame.player.xy+ray*rd;
 let layer=floorLayers()+select(1,0,isFloor);
 let uv=fract(worldPt);
 var color=textureSampleLevel(floorTex,floorSampler,uv,layer,0.).rgb;
 var c=color;
 if(frame.viewport.w==2.){
   if(isFloor){ c=vec3f(0.075+c.r*.20,0.15+c.g*.45,0.19+c.b*.50); }
   else {c=vec3f(.17+c.r*.36,.26+c.g*.44,.30+c.b*.46);}
 } else if(frame.viewport.w==3. || frame.viewport.w==5. || frame.viewport.w==6.){
   if(isFloor){c=vec3f(.15+c.r*.43,.083+c.g*.27,.12+c.b*.35);}
   else{c=vec3f(.19+c.r*.42,.10+c.g*.23,.18+c.b*.35);}
 } else if(frame.viewport.w==4.) {
   if(isFloor){c=vec3f(.22+c.r*.48,.13+c.g*.27,.12+c.b*.20);}
   else{c=vec3f(.3+c.r*.45,.23+c.g*.33,.17+c.b*.21);}
 }
 // Keep the familiar tiled floors, grout seams and rectangular fluorescent lights.
 let seams=uv.x<.017 || uv.y<.017;
 if(seams){c*=.80;}
 if(!isFloor){
   let cell=vec2i(floor(worldPt));
   if((cell.x+100)%5==2 && (cell.y+100)%4==1 && uv.x>.19 && uv.x<.82 && uv.y>.22 && uv.y<.68){
     c=mix(c,vec3f(1.,.95,.73),.75);
   }
 } else {
   let cell=vec2i(floor(worldPt));
   if(cell.x>=0 && cell.y>=0 && cell.x<i32(frame.viewport.z) && cell.y<i32(frame.viewport.z)) {
     let id=decalCells[u32(cell.y)*128u+u32(cell.x)];
     if(id>0u && id<=256u){
       let d=decalData[id-1u];
       let radius=max(.1,d.z*.67);
       let local=(worldPt-d.xy)/(radius*2.)+.5;
       if(all(local>=vec2f(0.)) && all(local<=vec2f(1.))){
         let decal=textureSampleLevel(decalTex,decalSampler,local,i32(d.w),0.);
         let fade=smoothstep(.0,.12,local.x)*smoothstep(.0,.12,local.y)*
           smoothstep(.0,.12,1.-local.x)*smoothstep(.0,.12,1.-local.y);
         let alpha=decal.a*fade*select(.80,.92,d.w>.5);
         c=mix(c,c*decal.rgb*1.15,clamp(alpha,0.,1.));
         if(d.w>.5){c+=decal.rgb*alpha*.12;}
       }
     }
   }
 }
 let fog=clamp((rd-2.)/29.,0.,.90);
 return vec4f(mix(c,vec3f(.10,.105,.09),fog),1.);
}
@fragment fn fragment(@builtin(position) pixel:vec4f)->PixelOut {
 let uv=pixel.xy/frame.viewport.xy;
 let dx=cos(frame.player.z);let dy=sin(frame.player.z);
 let plane=vec2f(-dy,dx)*frame.camera.x;
 let ray=vec2f(dx,dy)+plane*(uv.x*2.-1.);
 var cell=vec2i(floor(frame.player.xy));
 let delta=vec2f(1.)/max(abs(ray),vec2f(.00001));
 let gridStep=vec2i(select(1,-1,ray.x<0.),select(1,-1,ray.y<0.));
 var tMax=vec2f(0.);
 if(ray.x<0.){tMax.x=(frame.player.x-f32(cell.x))*delta.x;}
 else{tMax.x=(f32(cell.x)+1.-frame.player.x)*delta.x;}
 if(ray.y<0.){tMax.y=(frame.player.y-f32(cell.y))*delta.y;}
 else{tMax.y=(f32(cell.y)+1.-frame.player.y)*delta.y;}
 var side=0;
 var hit=1u;
 for(var i:i32=0;i<190;i++){
   if(tMax.x<tMax.y){tMax.x+=delta.x;cell.x+=gridStep.x;side=0;}
   else{tMax.y+=delta.y;cell.y+=gridStep.y;side=1;}
   hit=tileAt(cell.x,cell.y);
   if(hit!=0u){break;}
 }
 var distance:f32;
 if(side==0){distance=(f32(cell.x)-frame.player.x+(1.-f32(gridStep.x))*.5)/select(ray.x,.00001,abs(ray.x)<.00001);}
 else {distance=(f32(cell.y)-frame.player.y+(1.-f32(gridStep.y))*.5)/select(ray.y,.00001,abs(ray.y)<.00001);}
 distance=max(.09,abs(distance));
 let wallH=frame.viewport.y/distance;
 let top=(frame.viewport.y-wallH)*.5+frame.viewport.y*frame.weather.w;
 var result=vec4f(0.);
 if(pixel.y>=top && pixel.y<=top+wallH){
   var texX=select(frame.player.x+distance*ray.x,frame.player.y+distance*ray.y,side==0);
   texX=fract(texX);
   if((side==0 && ray.x>0.) || (side==1 && ray.y<0.)){texX=1.-texX;}
   var layer=levelWall();
   if(hit==8u){
     // Safe-room walls: damp dark brick, rust streaks, tiled grout.
     let uvWall=vec2f(texX,clamp((pixel.y-top)/wallH,0.,1.));
     let row=floor(uvWall.y*6.);
     let brick=fract(uvWall.x*4.+select(0.,.5,u32(row)%2u==1u));
     let mortar=step(brick,.035)+step(fract(uvWall.y*6.),.055);
     let fleck=fract(sin(dot(vec2f(f32(cell.x),f32(cell.y))+uvWall*17.,vec2f(31.17,77.9)))*12345.);
     var c=vec3f(.18,.19,.16)*(1.+fleck*.22);
     c*=1.-min(1.,mortar)*.35;
     c*=1.-pow(max(0.,sin(uvWall.x*47.+f32(cell.y)*.7)),18.)*uvWall.y*.32;
     result=vec4f(c,1.);
   }else{
     if(hit==3u){layer=select(5,4,frame.progress.x>=frame.progress.y && frame.progress.z>=frame.progress.w);}
     else if(hit==4u){layer=6;}
     result=textureSampleLevel(wallTex,wallSampler,vec2f(texX,clamp((pixel.y-top)/wallH,0.,1.)),layer,0.);
   }
   if(frame.camera.y>.5){
     let wallUV=vec2f(texX,clamp((pixel.y-top)/wallH,0.,1.));
     let scratches=pow(abs(sin(texX*130.+f32(cell.y)*4.7)),19.)*.075;
     let grime=sin(wallUV.y*29.+f32(cell.x)*.6)*sin(texX*61.+f32(cell.y)*2.3)*.13;
     let drip=pow(max(0.,sin(texX*79.+f32(cell.x)*3.)),35.)*wallUV.y*.25;
     let c=result.rgb*vec3f(.73,.69,.64)*(1.-scratches+grime-drip);
     result=vec4f(c,1.);
   }
   let fog=clamp((distance-1.5)/32.,0.,.88);
   result=vec4f(mix(result.rgb,vec3f(.10,.10,.09),fog),1.);
   if(side==1){result=vec4f(result.rgb*.83,1.);}
 }else{
   result=sceneryAt(pixel.xy,ray);
 }
 // Static 3D boxes are ray-traced against the actual wall distance. These
 // objects stay put when the camera turns, unlike screen-facing billboards.
 let horizon=frame.viewport.y*(.5+frame.weather.w);
 let ray3=vec3f(ray,(horizon-pixel.y)/frame.viewport.y);
 let origin3=vec3f(frame.player.xy,.5);
 var best=distance;
 var furnitureHit=false;
 var furnitureColor=vec3f(0.);
 for(var k:u32=0u;k<min(u32(frame.camera.w),64u);k=k+1u){
   let object=roomObjects[k];
   let inv=vec3f(1.)/select(ray3,vec3f(.000001),abs(ray3)<vec3f(.000001));
   let t0=(object.lower.xyz-origin3)*inv;
   let t1=(object.upper.xyz-origin3)*inv;
   let tNear=max(max(min(t0.x,t1.x),min(t0.y,t1.y)),min(t0.z,t1.z));
   let tFar=min(min(max(t0.x,t1.x),max(t0.y,t1.y)),max(t0.z,t1.z));
   if(tNear>.02&&tNear<tFar&&tNear<best){
     let local=(origin3+ray3*tNear-object.lower.xyz)/max(object.upper.xyz-object.lower.xyz,vec3f(.0001));
     let face=max(abs(ray3.x),abs(ray3.y));
     let typ=i32(object.lower.w);
     var col=vec3f(.30,.23,.18);
     if(typ==1){ // solid metal slot-machine cabinet
       col=vec3f(.24,.067,.055);
       if(local.z>.82){col=vec3f(.63,.44,.20);}
       if(fract(local.z*11.)<.10){col*=1.45;}
     }else if(typ==2){ // front panel and 777 reels
       col=vec3f(.12,.09,.07);
       if(local.z>.18&&local.z<.87){
         let section=fract(local.x*3.);
         col=select(vec3f(.75,.63,.34),vec3f(.16,.10,.08),section<.10||section>.91);
         if(abs(fract(local.z*4.)-.49)<.12){col=vec3f(.13,.07,.06);}
       }
     }else if(typ==3||typ==4){ // chair seat, backrest and legs
       col=vec3f(.24,.13,.07)*(1.+fract(sin(local.x*37.+local.y*14.)*72.)*.18);
     }else if(typ==5){ // fire-ring of dark rocks
       col=vec3f(.18,.18,.16)*(1.+fract(sin(local.x*32.+local.y*31.)*44.)*.16);
       if(local.x>.20&&local.x<.80&&local.y>.20&&local.y<.80){col=vec3f(.54,.17,.07);}
     }else if(typ==6){ // volumetric flame block with flicker
       let flicker=.65+.35*sin(frame.player.w*17.+local.x*15.);
       col=mix(vec3f(.63,.09,.02),vec3f(1.,.77,.18),local.z)*flicker;
       if(local.z>.70){col*=.60;}
     }else if(typ==7||typ==8){ // fixed warning posters on the wall
       col=select(vec3f(.16,.32,.29),vec3f(.51,.12,.10),typ==7);
       let stripe=fract(local.z*8.);
       if(stripe>.27&&stripe<.35){col=vec3f(.93,.80,.54);}
       if(local.x<.08||local.x>.92||local.z<.08||local.z>.92){col=vec3f(.08,.06,.05);}
     }
     let sideShade=select(.79,1.,local.z<.04||local.z>.96);
     furnitureColor=col*sideShade;
     best=tNear;
     furnitureHit=true;
   }
 }
 if(furnitureHit){
   let haze=clamp((best-1.5)/32.,0.,.88);
   result=vec4f(mix(furnitureColor,vec3f(.10,.10,.09),haze),1.);
   distance=best;
 }
 let center=uv-vec2f(.5,.52);
 let vignette=clamp(length(center*vec2f(1.15,1.02))*.96,0.,1.);
 var shade=1.-vignette*.47;
 if(frame.visuals.x<.5){shade*=.67;}
 if(frame.weather.x>.5){shade*=.26;}
 let flicker=1.+.018*sin(frame.player.w*19.)-.012*sin(frame.player.w*7.3);
 var color=result.rgb*shade*flicker;
 if(frame.weather.y>.5){color=mix(color,vec3f(.27,.23,.28),.19);}
 if(frame.weather.z>.5){color=mix(color,vec3f(.24,.08,.07),.16);}
 if(frame.visuals.z<4.){color=mix(color,vec3f(.6,.08,.055),clamp((4.-frame.visuals.z)/4.*.18,0.,.18));}
 if(frame.camera.y>.5){color*=vec3f(.91,.85,.80);}
 if(frame.camera.z>.5){
   let peripheral=clamp(length((uv-vec2f(.5,.5))*vec2f(1.30,1.0))/.68,0.,1.);
   let pulse=.65+.35*sin(frame.player.w*7.8);
   color=mix(color,vec3f(.38,.025,.019),clamp(peripheral*.30*pulse,0.,.4));
 }
 if(frame.visuals.w>0.){color=mix(color,vec3f(1.,.89,.63),frame.visuals.w*.40);}
 // Subtle grain, dithered at the subpixel level, without the blocky CPU rays.
 let grain=fract(sin(dot(pixel.xy+vec2f(frame.player.w*97.,frame.player.w*33.),vec2f(12.9898,78.233)))*43758.5453);
 color+=vec3f((grain-.5)*.018);
 var out:PixelOut;
 out.color=vec4f(clamp(color,vec3f(0.),vec3f(1.)),1.);
 out.distance=vec4f(clamp(distance/256.,0.,1.),0.,0.,1.);
 return out;
}
`;

const SPRITES_WGSL = /* wgsl */ `
struct Frame { player:vec4f, viewport:vec4f, progress:vec4f,visuals:vec4f,weather:vec4f };
struct Sprite { rect:vec4f, data:vec4f };
@group(0) @binding(0) var<uniform> frame:Frame;
@group(0) @binding(1) var wallDistance:texture_2d<f32>;
@group(0) @binding(2) var images:texture_2d_array<f32>;
@group(0) @binding(3) var imageSampler:sampler;
@group(0) @binding(4) var<storage,read> sprites:array<Sprite>;
struct VOut{
 @builtin(position) position:vec4f,
 @location(0) uv:vec2f,
 @location(1) data:vec4f,
};
@vertex fn vertex(@builtin(vertex_index) index:u32,@builtin(instance_index) instance:u32)->VOut {
 let v=array<vec2f,6>(vec2f(0.,0.),vec2f(1.,0.),vec2f(0.,1.),
                       vec2f(0.,1.),vec2f(1.,0.),vec2f(1.,1.));
 let unit=v[index];
 let item=sprites[instance];
 let pos=item.rect.xy+unit*item.rect.zw;
 var out:VOut;
 out.position=vec4f(pos/frame.viewport.xy*vec2f(2.,-2.)+vec2f(-1.,1.),0.,1.);
 out.uv=unit;
 out.data=item.data;
 return out;
}
@fragment fn fragment(input:VOut)->@location(0) vec4f {
 let p=vec2i(floor(input.position.xy));
 if(any(p<vec2i(0)) || any(p>=vec2i(frame.viewport.xy))){discard;}
 let depth=textureLoad(wallDistance,p,0).r*256.;
 if(input.data.y>=depth-.065){discard;}
 let c=textureSampleLevel(images,imageSampler,input.uv,i32(input.data.x),0.);
 if(c.a<.025){discard;}
 let fog=clamp((input.data.y-8.)/36.,0.,.72);
 let alpha=c.a*(1.-fog*.48);
 var rgb=mix(c.rgb,vec3f(.10,.10,.09),fog);
 // Input z = variant index: 0 classic, 1 red, 2 green, 3 yellow, 4 gray, 5 pink.
 if(input.data.z>0.5 && input.data.z<1.5){rgb=mix(rgb,vec3f(.90,.09,.075),.56);}
 else if(input.data.z<2.5 && input.data.z>1.5){rgb=mix(rgb,vec3f(.12,.81,.18),.50);}
 else if(input.data.z<3.5 && input.data.z>2.5){rgb=mix(rgb,vec3f(.91,.79,.13),.49);}
 else if(input.data.z<4.5 && input.data.z>3.5){rgb=mix(rgb,vec3f(.50,.51,.54),.80);}
 else if(input.data.z<5.5 && input.data.z>4.5){rgb=mix(rgb,vec3f(.97,.31,.64),.58);}
 if(input.data.w>.5){rgb=mix(rgb,vec3f(.55,.86,1.),.78);rgb+=vec3f(.07,.11,.14)*sin(input.position.y*.16+frame.player.w*2.);}

 if(frame.visuals.x<.5){rgb*=.66;}
 if(frame.weather.x>.5){rgb*=.35;}
 return vec4f(rgb,alpha);
}
`;

// Meshes are preprocessed from the supplied GLB files; no Babylon/Three required.
const MODEL_SLOT_ALBEDO_PNG='assets/models/slot-albedo.webp';
const MODEL_WGSL = /* wgsl */ `
struct SceneFrame {
 player:vec4f,
 viewport:vec4f,
 progress:vec4f,
 visuals:vec4f,
 weather:vec4f,
 camera:vec4f,
};
struct ModelPose { world:vec4f, rotation:vec4f };
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var<uniform> pose:ModelPose;
@group(0) @binding(2) var slotAlbedo:texture_2d<f32>;
@group(0) @binding(3) var albedoSampler:sampler;
@group(0) @binding(4) var wallDistance:texture_2d<f32>;
struct MeshVertexOut {
 @builtin(position) position:vec4f,
 @location(0) normal:vec3f,
 @location(1) uv:vec2f,
 @location(2) tint:vec3f,
 @location(3) depth:f32,
 @location(4) @interpolate(flat) kind:u32,
};
@vertex fn vertex(
 @location(0) inPos:vec3f,
 @location(1) inNormal:vec3f,
 @location(2) inUV:vec2f,
 @location(3) inColor:vec3f
)->MeshVertexOut {
 let rotated=vec3f(inPos.x*pose.rotation.x-inPos.y*pose.rotation.y,
                   inPos.x*pose.rotation.y+inPos.y*pose.rotation.x,inPos.z);
 let point=pose.world.xyz+rotated*pose.world.w;
 let direction=vec2f(cos(frame.player.z),sin(frame.player.z));
 let right=vec2f(-direction.y,direction.x);
 let delta=point.xy-frame.player.xy;
 let depth=dot(delta,direction);
 let horizontal=dot(delta,right);
 let near=0.04;
 let far=140.0;
 var result:MeshVertexOut;
 result.position=vec4f(horizontal/max(.05,frame.camera.x),
   (point.z-.5)*2.-2.*frame.weather.w*depth,
   (far/(far-near))*depth-near*far/(far-near),depth);
 result.normal=normalize(vec3f(inNormal.x*pose.rotation.x-inNormal.y*pose.rotation.y,
    inNormal.x*pose.rotation.y+inNormal.y*pose.rotation.x,inNormal.z));
 result.uv=vec2f(inUV.x,1.-inUV.y);
 result.tint=inColor;
 result.depth=depth;
 result.kind=u32(pose.rotation.z);
 return result;
}
@fragment fn fragment(input:MeshVertexOut)->@location(0) vec4f {
 let pixel=vec2i(floor(input.position.xy));
 if(any(pixel<vec2i(0))||any(pixel>=vec2i(frame.viewport.xy))){discard;}
 let wall=textureLoad(wallDistance,pixel,0).r*256.;
 if(input.depth>wall-.025){discard;}
 var base=input.tint;
 if(input.kind==1u){
   base*=textureSampleLevel(slotAlbedo,albedoSampler,input.uv,0.).rgb;
 }
 var light=clamp(.46+.47*dot(normalize(input.normal),normalize(vec3f(.40,-.15,.88))),.30,1.);
 if(input.kind==0u&&input.tint.r>.85){
    // Ember and flame parts keep their original low-poly mesh geometry.
    light=1.05+.14*sin(frame.player.w*13.+input.uv.x*10.);
 }
 var rgb=base*light;
 let fog=clamp((input.depth-2.)/34.,0.,.78);
 rgb=mix(rgb,vec3f(.10,.10,.09),fog);
 if(frame.visuals.x<.5){rgb*=.68;}
 return vec4f(rgb,1.);
}
`;

const GPU_SPRITE_SIZE=256;
const GPU_WALL_W=128;
const GPU_WALL_H=256;
const GPU_TILE_SIZE=64;
const GPU_MAX_DECALS=256;
const GPU_MAX_SPRITES=256;

class CatroomsWebGPURenderer {
  constructor(device,context,format){
    this.device=device;this.context=context;this.format=format;
    this.frameBuffer=device.createBuffer({size:96,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    this.mapBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalCellsBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalDataBuffer=device.createBuffer({size:GPU_MAX_DECALS*16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.spriteBuffer=device.createBuffer({size:GPU_MAX_SPRITES*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.furnitureBuffer=device.createBuffer({size:64*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.wallTexture=device.createTexture({size:[GPU_WALL_W,GPU_WALL_H,7],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.floorTexture=device.createTexture({size:[GPU_TILE_SIZE,GPU_TILE_SIZE,8],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.decalTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,2],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.spriteTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,26],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.sampler=device.createSampler({magFilter:'linear',minFilter:'linear',mipmapFilter:'linear',addressModeU:'repeat',addressModeV:'repeat'});
    this.spriteSampler=device.createSampler({magFilter:'linear',minFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    this.terrainShader=device.createShaderModule({label:'Catrooms terrain WGSL',code:TERRAIN_WGSL});
    this.spriteShader=device.createShaderModule({label:'Catrooms sprite WGSL',code:SPRITES_WGSL});
    this.meshShader=device.createShaderModule({label:'Catrooms imported GLB mesh WGSL',code:MODEL_WGSL});
    this.terrainPipeline=device.createRenderPipeline({label:'Catrooms walls and floor',layout:'auto',vertex:{module:this.terrainShader,entryPoint:'vert'},fragment:{module:this.terrainShader,entryPoint:'fragment',targets:[{format:this.format},{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
    this.spritePipeline=device.createRenderPipeline({label:'Catrooms transparent billboards',layout:'auto',vertex:{module:this.spriteShader,entryPoint:'vertex'},fragment:{module:this.spriteShader,entryPoint:'fragment',targets:[{format:this.format,blend:{color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
    this.meshPipeline=device.createRenderPipeline({label:'Catrooms static GLB geometry',layout:'auto',
      vertex:{module:this.meshShader,entryPoint:'vertex',buffers:[{arrayStride:44,stepMode:'vertex',attributes:[
        {shaderLocation:0,offset:0,format:'float32x3'},
        {shaderLocation:1,offset:12,format:'float32x3'},
        {shaderLocation:2,offset:24,format:'float32x2'},
        {shaderLocation:3,offset:32,format:'float32x3'}]}]},
      fragment:{module:this.meshShader,entryPoint:'fragment',targets:[{format:this.format}]},
      primitive:{topology:'triangle-list',cullMode:'none'},
      depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less'}});
    this.modelPoseBuffers={};this.modelMeshes={};
    for(const type of ['campfire','slot'])this.modelPoseBuffers[type]=device.createBuffer({
      size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    this.lastWidth=0;this.lastHeight=0;
  }
  uploadCanvasLayer(texture,source,width,height,layer){
    const off=document.createElement('canvas');off.width=width;off.height=height;
    const g=off.getContext('2d');g.clearRect(0,0,width,height);
    g.drawImage(source,0,0,width,height);
    this.device.queue.copyExternalImageToTexture({source:off},{texture,origin:[0,0,layer]},[width,height,1]);
  }
  async buildTextures(){
    const images=[catImg,pigImg,personBImg,personAImg,fuseImg,keycardImg,foodImg,terminalImg,lockerArt,stairArt,staminaArt,shieldArt,extraPickupArt,decoyArt,coopAvatarArt,slowDeviceImg,freezeDeviceImg,...energyDrinkImgs,hardRockArt,coinSprite,slotMachineSprite,strangerImg];
    await Promise.all(images.map(async img=>{if(img instanceof HTMLImageElement && !img.complete){try{await img.decode();}catch(e){/* fallback art below */}}}));
    const walls=[wallTexture,metalTexture,finalWallTexture,pigWallTexture,doorOpenTexture,doorTexture,doorShutImg];
    walls.forEach((tex,i)=>this.uploadCanvasLayer(this.wallTexture,tex,GPU_WALL_W,GPU_WALL_H,i));
    const tmp=document.createElement('canvas');tmp.width=GPU_TILE_SIZE;tmp.height=GPU_TILE_SIZE;const g=tmp.getContext('2d');
    for(let i=0;i<8;i++){
      let pixels=g.createImageData(GPU_TILE_SIZE,GPU_TILE_SIZE);
      const isCeiling=i%2===1;
      const a=isCeiling?ceilingTexture:floorTexture;
      for(let z=0;z<GPU_TILE_SIZE*GPU_TILE_SIZE;z++){
        const p=z*3,o=z*4;
        pixels.data[o]=a[p];pixels.data[o+1]=a[p+1];pixels.data[o+2]=a[p+2];pixels.data[o+3]=255;
      }
      g.putImageData(pixels,0,0);
      this.device.queue.copyExternalImageToTexture({source:tmp},{texture:this.floorTexture,origin:[0,0,i]},[GPU_TILE_SIZE,GPU_TILE_SIZE,1]);
    }
    if(bloodArt instanceof HTMLImageElement && !bloodArt.complete){try{await bloodArt.decode();}catch(e){}}
    this.uploadCanvasLayer(this.decalTexture,bloodArt.naturalWidth?bloodArt:(bloodArt.fallback||bloodArt),GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,0);
    this.uploadCanvasLayer(this.decalTexture,hazardArt,GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,1);
    images.forEach((img,i)=>{
      let source=img;
      if(img instanceof HTMLImageElement && !img.naturalWidth){source=img.fallback||extraPickupArt;}
      this.uploadCanvasLayer(this.spriteTexture,source,GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,i);
    });
  }
  async buildModels(){
    const decodeBase64=value=>{
      const decoded=atob(value),bytes=new Uint8Array(decoded.length);
      for(let i=0;i<decoded.length;i++)bytes[i]=decoded.charCodeAt(i);
      return bytes;
    };
    for(const kind of ['campfire','slot']){
      const bytes=decodeBase64(CATROOMS_MODEL_MESHES[kind]);
      const view=new DataView(bytes.buffer);
      if(String.fromCharCode(...bytes.subarray(0,4))!=='CRM2')throw new Error('Bledny format modelu: '+kind);
      const vertices=view.getUint32(4,true),indices=view.getUint32(8,true);
      const offset=12,vLen=vertices*44,iLen=indices*4;
      if(offset+vLen+iLen!==bytes.length)throw new Error('Uszkodzony model '+kind);
      const vertexBuffer=this.device.createBuffer({size:vLen,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
      const indexBuffer=this.device.createBuffer({size:iLen,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});
      this.device.queue.writeBuffer(vertexBuffer,0,bytes.subarray(offset,offset+vLen));
      this.device.queue.writeBuffer(indexBuffer,0,bytes.subarray(offset+vLen));
      this.modelMeshes[kind]={vertexBuffer,indexBuffer,indexCount:indices};
    }
    const albedoImage=new Image();albedoImage.src=MODEL_SLOT_ALBEDO_PNG;
    await albedoImage.decode();
    this.modelAlbedoTexture=this.device.createTexture({size:[albedoImage.naturalWidth,albedoImage.naturalHeight],
      format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.device.queue.copyExternalImageToTexture({source:albedoImage},
      {texture:this.modelAlbedoTexture},[albedoImage.naturalWidth,albedoImage.naturalHeight,1]);
  }
  resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.35)*gameSettings.quality;
    // Apply a single uniform scale to both dimensions. Independent width/height
    // clamps warped the image when pitch changed, especially on mobile.
    const scale=Math.min(dpr*.90,1700/Math.max(1,innerWidth),1000/Math.max(1,innerHeight));
    W=Math.max(1,Math.round(innerWidth*scale));
    H=Math.max(1,Math.round(innerHeight*scale));
    if(W===this.lastWidth && H===this.lastHeight)return;
    this.lastWidth=W;this.lastHeight=H;
    C.width=W;C.height=H;
    this.context.configure({device:this.device,format:this.format,alphaMode:'opaque'});
    if(this.distanceTexture)this.distanceTexture.destroy();
    this.distanceTexture=this.device.createTexture({size:[W,H],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
    if(this.meshDepthTexture)this.meshDepthTexture.destroy();
    this.meshDepthTexture=this.device.createTexture({size:[W,H],format:'depth24plus',usage:GPUTextureUsage.RENDER_ATTACHMENT});
    this.terrainBind=this.device.createBindGroup({layout:this.terrainPipeline.getBindGroupLayout(0),entries:[
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:{buffer:this.mapBuffer}},
      {binding:2,resource:this.wallTexture.createView({dimension:'2d-array'})},{binding:3,resource:this.sampler},
      {binding:4,resource:this.floorTexture.createView({dimension:'2d-array'})},{binding:5,resource:this.sampler},
      {binding:6,resource:{buffer:this.decalCellsBuffer}},{binding:7,resource:{buffer:this.decalDataBuffer}},
      {binding:8,resource:this.decalTexture.createView({dimension:'2d-array'})},{binding:9,resource:this.spriteSampler},
      {binding:10,resource:{buffer:this.furnitureBuffer}}
    ]});
    this.spriteBind=this.device.createBindGroup({layout:this.spritePipeline.getBindGroupLayout(0),entries:[
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:this.distanceTexture.createView()},
      {binding:2,resource:this.spriteTexture.createView({dimension:'2d-array'})},{binding:3,resource:this.spriteSampler},
      {binding:4,resource:{buffer:this.spriteBuffer}}
    ]});
    this.meshBinds={};
    for(const kind of ['campfire','slot'])this.meshBinds[kind]=this.device.createBindGroup({
      layout:this.meshPipeline.getBindGroupLayout(0),entries:[
        {binding:0,resource:{buffer:this.frameBuffer}},
        {binding:1,resource:{buffer:this.modelPoseBuffers[kind]}},
        {binding:2,resource:this.modelAlbedoTexture.createView()},
        {binding:3,resource:this.spriteSampler},
        {binding:4,resource:this.distanceTexture.createView()}
      ]});
  }
  collectSprites(){
    const sprites=[];
    for(const f of fuses)if(!f.taken)sprites.push({kind:'fuse',x:f.x,y:f.y,phase:f.phase||0});
    if(level===1&&awake)sprites.push({kind:'cat',x:cat.x,y:cat.y,frozen:!!cat.frozen});
    for(const a of coop.avatarSprites())sprites.push({kind:'coopAvatar',x:a.x,y:a.y});
    for(const item of bonusItems)if(!item.taken&&item.type==='coin')sprites.push({kind:'coin',x:item.x,y:item.y});
    // Slot machine is static 3D world geometry, never a camera-facing sprite.
    if(level>=2){
      for(const guard of guards)sprites.push({kind:guard.kind,x:guard.x,y:guard.y,phase:guard.x,variant:guard.variant||'classic',frozen:!!guard.frozen,size:guard.sizeMultiplier||1});
      for(const t of terminals)sprites.push({kind:'terminal',x:t.x,y:t.y});
      for(const item of interactables)if(item.type==='hide'||item.type==='stairs')sprites.push({kind:item.type,x:item.x,y:item.y});
      for(const item of bonusItems)if(!item.taken)sprites.push({kind:item.type,x:item.x,y:item.y,phase:item.phase,energySprite:item.energySprite});
      for(const item of decoys)sprites.push({kind:'decoy',x:item.x,y:item.y});
      for(const rock of props)if(rock.type==='rock')sprites.push({kind:'rock',x:rock.x,y:rock.y,size:rock.size||1});
      if(isHardMode()&&hardEmergency)sprites.push({kind:'terminal',x:hardEmergency.x,y:hardEmergency.y});
    }
    const layers={cat:0,pig:1,watcher:2,listener:3,fuse:renderStage()===1?4:renderStage()===4?6:5,terminal:7,hide:8,stairs:9,stamina:10,shield:11,key:12,decoy:13,coopAvatar:14,hardSlow:15,hardFreeze:16,rock:22,coin:23,slot:24,stranger:25};
    const scales={cat:1.19,pig:1.07,watcher:1.38,listener:1.38,fuse:renderStage()===4?.76:.58,terminal:.73,hide:.9,stairs:.78,stamina:.43,shield:.43,key:.42,decoy:.4,coopAvatar:.94,hardSlow:.54,hardFreeze:.58,rock:.89,coin:.43,slot:.86,stranger:1.36};
    const sourceAspect=[catImg,pigImg,personBImg,personAImg,fuseImg,keycardImg,foodImg,terminalImg,lockerArt,stairArt,staminaArt,shieldArt,extraPickupArt,decoyArt,coopAvatarArt,slowDeviceImg,freezeDeviceImg,...energyDrinkImgs,hardRockArt,coinSprite,slotMachineSprite,strangerImg].map(img=>(img.naturalWidth||img.width||1)/(img.naturalHeight||img.height||1));
    const dirX=Math.cos(player.a),dirY=Math.sin(player.a),planeX=-dirY*cameraPlaneScale(),planeY=dirX*cameraPlaneScale(),inv=1/(planeX*dirY-dirX*planeY);
    const order=[];
    for(const s of sprites){
      const vx=s.x-player.x,vy=s.y-player.y;
      const tx=inv*(dirY*vx-dirX*vy),ty=inv*(-planeY*vx+planeX*vy);
      if(ty<=.16||ty>125)continue;
      const layer=s.kind==='stamina'?17+(s.energySprite||0):layers[s.kind];if(layer==null)continue;
      const scale=scales[s.kind]*(s.size||1);
      const center=W*.5*(1+tx/ty),height=H/ty*scale,width=height*sourceAspect[layer];
      const bob=(s.kind==='fuse'?(.07+Math.sin(elapsed*2.2+(s.phase||0))*.08):s.kind==='cat'?Math.sin(elapsed*8)*.03:0);
      const vertical=(s.kind==='fuse'?bob:s.kind==='decoy'?.13:s.kind==='stamina'||s.kind==='shield'||s.kind==='key'||s.kind==='hardSlow'||s.kind==='hardFreeze'?.15:0);
      const bottom=H*.5+H*viewPitchOffset()+H/(2*ty)-vertical*H/ty;
      const left=center-width*.5,top=bottom-height;
      if(left>W||left+width<0||top>H||bottom<0)continue;
      order.push({layer,ty,left,top,width,height,variant:({red:1,green:2,yellow:3,gray:4,pink:5})[s.variant]||0,frozen:s.frozen?1:0});
    }
    order.sort((a,b)=>b.ty-a.ty);
    const data=new Float32Array(Math.min(order.length,GPU_MAX_SPRITES)*8);
    for(let i=0;i<data.length/8;i++){
      const s=order[i];data.set([s.left,s.top,s.width,s.height,s.layer,s.ty,s.variant,s.frozen],i*8);
    }
    return data;
  }
  render(){
    if(!this.lastWidth)return;
    const frame=new Float32Array(24);
    frame.set([player.x||2.5,player.y||2.5,player.a||0,elapsed],0);
    frame.set([W,H,N,renderStage()],4);
    frame.set([player.collected||0,GOAL,terminals.filter(t=>t.used).length,terminals.length],8);
    frame.set([player.flash?1:0,(player.hp??100)/100,nearCat<0?100:nearCat,Math.max(0,flashUntil-elapsed)],12);
    frame.set([level===3&&eventState?.kind==='blackout'?1:0,level===3&&eventState?.kind==='fog'?1:0,rageMode?1:0,viewPitchOffset()],16);
    const visibleFurniture=typeof safeRoomFurniture==='undefined'?[]:safeRoomFurniture.filter(o=>!o.collisionOnly);
    frame.set([cameraPlaneScale(),isHardMode()?1:0,isHardMode()&&guards.some(g=>g.state==='chase'&&!g.frozen)?1:0,Math.min(64,visibleFurniture.length)],20);
    this.device.queue.writeBuffer(this.frameBuffer,0,frame);
    const objects=new Float32Array(64*8);
    visibleFurniture.slice(0,64).forEach((o,i)=>{
      objects.set([o.x-o.w/2,o.y-o.d/2,o.z-o.h/2,o.material,o.x+o.w/2,o.y+o.d/2,o.z+o.h/2,0],i*8);
    });
    this.device.queue.writeBuffer(this.furnitureBuffer,0,objects);
    const tiles=new Uint32Array(128*128);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++)tiles[y*128+x]=world[y][x];
    this.device.queue.writeBuffer(this.mapBuffer,0,tiles);
    const decalGrid=new Uint32Array(128*128),decals=new Float32Array(GPU_MAX_DECALS*4);
    let count=0;
    for(const p of props){
      if(p.type!=='hazard'||count>=GPU_MAX_DECALS)continue;
      const x=Math.floor(p.x),y=Math.floor(p.y);
      if(x<0||y<0||x>=N||y>=N)continue;
      const isHazard=p.type==='hazard';
      decalGrid[y*128+x]=count+1;
      decals.set([p.x,p.y,p.size||.75,isHazard?1:0],count*4);
      count++;
    }
    this.device.queue.writeBuffer(this.decalCellsBuffer,0,decalGrid);
    this.device.queue.writeBuffer(this.decalDataBuffer,0,decals);
    const sprites=this.collectSprites();
    if(sprites.length)this.device.queue.writeBuffer(this.spriteBuffer,0,sprites);
    const encoder=this.device.createCommandEncoder({label:'Catrooms WebGPU frame'});
    const colorView=this.context.getCurrentTexture().createView();
    const depthView=this.distanceTexture.createView();
    const terrain=encoder.beginRenderPass({colorAttachments:[
      {view:colorView,loadOp:'clear',storeOp:'store',clearValue:{r:.07,g:.07,b:.05,a:1}},
      {view:depthView,loadOp:'clear',storeOp:'store',clearValue:{r:1,g:0,b:0,a:1}}
    ]});
    terrain.setPipeline(this.terrainPipeline);terrain.setBindGroup(0,this.terrainBind);terrain.draw(6);terrain.end();
    // Actual indexed triangles imported from the supplied GLBs, fixed in world
    // coordinates. No billboard rotation, and fragments hide behind walls.
    if(safeRoom&&this.modelMeshes.slot&&this.modelMeshes.campfire&&
       Math.hypot(player.x-safeRoom.centerX,player.y-safeRoom.centerY)<25){
      const poses={
        slot:[safeRoom.machineX,safeRoom.machineY,0,1,
          Math.cos(safeRoom.machineYaw),Math.sin(safeRoom.machineYaw),1,0],
        campfire:[safeRoom.fireX,safeRoom.fireY,0,1,1,0,0,0]
      };
      for(const kind of ['slot','campfire'])this.device.queue.writeBuffer(this.modelPoseBuffers[kind],0,new Float32Array(poses[kind]));
      const meshPass=encoder.beginRenderPass({label:'Imported campfire + slot meshes',
        colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}],
        depthStencilAttachment:{view:this.meshDepthTexture.createView(),depthLoadOp:'clear',depthClearValue:1,depthStoreOp:'store'}});
      meshPass.setPipeline(this.meshPipeline);
      for(const kind of ['slot','campfire']){
        const mesh=this.modelMeshes[kind];
        meshPass.setBindGroup(0,this.meshBinds[kind]);
        meshPass.setVertexBuffer(0,mesh.vertexBuffer);
        meshPass.setIndexBuffer(mesh.indexBuffer,'uint32');
        meshPass.drawIndexed(mesh.indexCount);
      }
      meshPass.end();
    }
    if(sprites.length){
      const pass=encoder.beginRenderPass({colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}]});
      pass.setPipeline(this.spritePipeline);pass.setBindGroup(0,this.spriteBind);pass.draw(6,sprites.length/8);pass.end();
    }
    this.device.queue.submit([encoder.finish()]);
  }
}

let gpuRenderer=null;
window.CatroomsGraphicsStatus={backend:'initializing',error:null};
async function initGraphics(){
 if(!navigator.gpu)throw new Error('Ta wersja wymaga WebGPU. Otworz gre w aktualnym Chrome lub Edge z wlaczonym WebGPU.');
 const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
 if(!adapter)throw new Error('Nie wykryto adaptera WebGPU.');
 const device=await adapter.requestDevice();
 const format=navigator.gpu.getPreferredCanvasFormat();
 device.pushErrorScope('validation');
 const renderer=new CatroomsWebGPURenderer(device,null,format);
 const reports=await Promise.all([renderer.terrainShader.getCompilationInfo(),renderer.spriteShader.getCompilationInfo(),renderer.meshShader.getCompilationInfo()]);
 const errors=reports.flatMap(r=>r.messages.filter(m=>m.type==='error').map(m=>m.message));
 const validation=await device.popErrorScope();if(validation)errors.push(validation.message);
 if(errors.length)throw new Error('Blad shaderow WebGPU: '+errors.join('; '));
 await renderer.buildTextures();
 await renderer.buildModels();
 const context=C.getContext('webgpu');
 if(!context)throw new Error('Brak kontekstu WebGPU');
 renderer.context=context;gpuRenderer=renderer;
 window.CatroomsGraphicsStatus={backend:'webgpu',error:null};
 device.lost.then(info=>{window.CatroomsGraphicsStatus={backend:'webgpu-lost',error:info.message};if(state==='playing')pause();});
}
function renderBackendStatus(){
  const el=$('rendererMode');if(!el)return;
  el.textContent=window.CatroomsGraphicsStatus.backend==='webgpu'?'WebGPU · GPU RAYCAST':'WebGPU WYMAGANE';
  el.title=window.CatroomsGraphicsStatus.error||'WebGPU';
}
function resize(){if(gpuRenderer)gpuRenderer.resize();}
function render(){if(gpuRenderer)gpuRenderer.render();}
