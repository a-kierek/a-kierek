// WebGPU shader source: terrain
const TERRAIN_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
${LIGHTING_WGSL}
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
 let tile=worldTiles[u32(y)*128u+u32(x)] & 255u;return select(tile,0u,tile==5u);
}
fn sectorLevel(worldX:f32)->f32 {
 if(frame.viewport.w==12.){
   return f32(clamp(i32(floor((worldX-4.)/23.))+1,1,5));
 }
 return frame.viewport.w;
}
fn levelWall(level:f32)->i32 {
 if(level==2.){return 1;}
 if(level==3. || level==5. || level==6.){return 2;}
 if(level==4.){return 3;}
 return 0;
}
fn floorLayers(level:f32)->i32 {
 if(level==2.){return 2;}
 if(level==3. || level==5. || level==6.){return 4;}
 if(level==4.){return 6;}
 return 0;
}
// CP11: packed tangent-space normals and dielectric GGX. The geometric normal
// remains authoritative for light visibility; relief never changes geometry.
@group(0) @binding(12) var detailTex:texture_2d_array<f32>;
@group(0) @binding(13) var<storage,read> shadowData:array<vec4f>;
fn detailAvailable()->bool {return textureDimensions(detailTex,0).x==512u;}
struct SurfaceDetail { normal:vec3f, roughness:f32 };
fn readSurfaceDetail(uv:vec2f,layer:i32,lod:f32,n:vec3f,t:vec3f,b:vec3f)->SurfaceDetail {
 let sampledDetail=textureSampleLevel(detailTex,wallSampler,uv,layer,clamp(lod,0.,9.)).rgb;
 let xy=(sampledDetail.xy*255.-128.)/127.;
 let z=sqrt(max(.001,1.-dot(xy,xy)));
 return SurfaceDetail(normalize(n*z+t*xy.x+b*xy.y),clamp(sampledDetail.z,.16,.96));
}
fn cp11BRDF(base:vec3f,n:vec3f,eye:vec3f,l:vec3f,rough:f32)->vec3f {
 let nl=max(dot(n,l),0.);let nv=max(dot(n,eye),.001);
 if(nl<=0.){return vec3f(0.);}
 let halfSum=eye+l;let h=halfSum*inverseSqrt(max(dot(halfSum,halfSum),.00001));
 let nh=max(dot(n,h),0.);let vh=clamp(dot(eye,h),0.,1.);
 let a=rough*rough;let a2=a*a;
 let q=nh*nh*(a2-1.)+1.;let d=a2/max(3.14159265*q*q,.000001);
 let k=(rough+1.)*(rough+1.)*.125;
 let g=(nv/(nv*(1.-k)+k))*(nl/(nl*(1.-k)+k));
 let fresnel=.04+.96*pow(1.-vh,5.);
 let spec=d*g*fresnel/max(4.*nv*nl,.001);
 return ((1.-fresnel)*base+vec3f(min(spec*3.14159265,4.)))*nl;
}
fn cp11Point(p:vec3f,geom:vec3f,material:SurfaceDetail,base:vec3f,eye:vec3f,source:vec3f,tint:vec3f,power:f32)->vec3f {
 let delta=source-p;let d2=max(dot(delta,delta),.025);let l=delta*inverseSqrt(d2);
 if(dot(geom,l)<=0.||dot(material.normal,l)<=0.||d2>=81.){return vec3f(0.);}
 let walls=frame.lighting.x>1.5;
 let visibility=lightVisibility(p,source,frame,walls,.28)*select(1.,1.-smoothstep(49.,81.,d2),walls);
 if(visibility<=.0001){return vec3f(0.);}
 return tint*cp11BRDF(base,material.normal,eye,l,material.roughness)*power*visibility/(1.+d2*1.35);
}
fn cp11Shade(color:vec3f,p:vec3f,geom:vec3f,material:SurfaceDetail)->vec3f {
 // Approximate linear-light material shading, then return to the current
 // renderer's legacy display-referred color convention before fog/post FX.
 let base=pow(max(color,vec3f(0.)),vec3f(2.2));
 let eyeDelta=vec3f(frame.player.xy,.5)-p;
 let eye=eyeDelta*inverseSqrt(max(dot(eyeDelta,eyeDelta),.00001));
 var light=base;
 if(frame.lighting.x>.5){
  let sector=sectorLevel(p.x);var tint=vec3f(1.,.91,.70);
  if(sector==2.){tint=vec3f(.57,.85,1.);}
  else if(sector==3.){tint=vec3f(1.,.40,.27);}
  else if(sector==4.){tint=vec3f(1.,.76,.48);}
  else if(sector==5.||sector==6.){tint=vec3f(.86,.51,1.);}
  let grid=fixtureGrid(p.xy);
  light=base*vec3f(.16,.16,.18);
  for(var y:i32=-1;y<=2;y++){for(var x:i32=-1;x<=2;x++){
   let cell=grid+vec2f(f32(x),f32(y));let pos=cell*vec2f(5.,4.)+vec2f(2.5,1.45);
   let source=vec3f(pos,.97);let weight=fixtureWeight(p,source);
   if(weight<=0.||(frame.lighting.x>1.5&&shadowSolid(vec2i(floor(pos)),i32(frame.viewport.z)))){continue;}
   let phase=dot(cell,vec2f(12.37,8.91));
   let flicker=.91+.09*sin(frame.player.w*9.+phase)-.22*step(.985,sin(frame.player.w*2.3+phase));
   light+=cp11Point(p,geom,material,base,eye,source,tint,select(2.1,.12,frame.weather.x>.5)*flicker*weight);
  }}
  if(frame.lighting.w>.5){
   let flicker=1.1+.22*sin(frame.player.w*13.)+.16*sin(frame.player.w*23.);
   light+=cp11Point(p,geom,material,base,eye,vec3f(frame.lighting.yz,.30),vec3f(1.,.48,.15),flicker*2.8);
  }
 }
 if(frame.flashlight.w>.5){
  light*=select(.58,.05,frame.weather.x>.5);
  let source=vec3f(frame.player.xy,.5);let delta=source-p;let d2=dot(delta,delta);
  if(frame.flashlight.z>.001&&d2>.0001&&d2<121.){
   let l=delta*inverseSqrt(d2);
   let direction=vec3f(cos(frame.flashlight.x)*cos(frame.flashlight.y),sin(frame.flashlight.x)*cos(frame.flashlight.y),sin(frame.flashlight.y));
   let beam=smoothstep(.9063,.9781,dot(-l,direction));
   if(beam>.0001&&dot(geom,l)>0.&&dot(material.normal,l)>0.){
    light+=vec3f(1.,.94,.79)*cp11BRDF(base,material.normal,eye,l,material.roughness)*frame.flashlight.z*beam*lightVisibility(p,source,frame,true,.12)*(1.-smoothstep(64.,121.,d2))*2.8/(1.+d2*.11);
   }
  }
 }
 return pow(max(light,vec3f(0.)),vec3f(1./2.2));
}

fn sceneryAt(pixel:vec2f,ray:vec3f)->vec4f {
 let isFloor=ray.z<0.;
 let rd=planeDepth(ray);
 return scenerySurface(ray,isFloor,rd);
}
fn scenerySurface(ray:vec3f,isFloor:bool,rd:f32)->vec4f {
 let worldPt=frame.player.xy+ray.xy*rd;
 let sector=sectorLevel(worldPt.x);
 let layer=floorLayers(sector)+select(1,0,isFloor);
 let uv=fract(worldPt);
 // Conservative screen footprint, using the unwrapped floor coordinates.
 let floorFootprint=rd*2.*frame.camera.x/frame.viewport.x*(1.+length(ray.xy)/max(.015,abs(ray.z)));
 let floorLod=clamp(log2(max(1.,floorFootprint*f32(textureDimensions(floorTex,0).x))),0.,f32(textureNumLevels(floorTex)-1u));
 var color=textureSampleLevel(floorTex,floorSampler,uv,layer,floorLod).rgb;
 var c=color;
 if(sector==2.){
   if(isFloor){ c=vec3f(0.075+c.r*.20,0.15+c.g*.45,0.19+c.b*.50); }
   else {c=vec3f(.17+c.r*.36,.26+c.g*.44,.30+c.b*.46);}
 } else if(sector==3. || sector==5. || sector==6.){
   if(isFloor){c=vec3f(.15+c.r*.43,.083+c.g*.27,.12+c.b*.35);}
   else{c=vec3f(.19+c.r*.42,.10+c.g*.23,.18+c.b*.35);}
 } else if(sector==4.) {
   if(isFloor){c=vec3f(.22+c.r*.48,.13+c.g*.27,.12+c.b*.20);}
   else{c=vec3f(.3+c.r*.45,.23+c.g*.33,.17+c.b*.21);}
 }
 if(frame.lighting.x>.5||frame.flashlight.w>.5){
   let n=vec3f(0.,0.,select(-1.,1.,isFloor));
   let rough=select(.86,.32,sector==2.&&isFloor);
   let point=vec3f(worldPt,select(1.,0.,isFloor));
   if(detailAvailable()){
     let material=readSurfaceDetail(uv,layer+4,floorLod,n,vec3f(1.,0.,0.),vec3f(0.,1.,0.));
     c=cp11Shade(c,point,n,material);
   }else{c*=surfaceLighting(point,n,rough,vec3f(1.),frame);}
 }
 // Keep the familiar tiled floors, grout seams and rectangular fluorescent lights.
 let seams=uv.x<.017 || uv.y<.017;
 if(seams){c*=.80;}
 if(!isFloor){
   let cell=vec2i(floor(worldPt));
   if((cell.x+100)%5==2 && (cell.y+100)%4==1 && uv.x>.19 && uv.x<.82 && uv.y>.22 && uv.y<.68){
     c=mix(c,vec3f(1.,.95,.73),select(.75,.05,frame.flashlight.w>.5&&frame.weather.x>.5));
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
         if(d.w>1.5){
           let shadow=1.-smoothstep(.14,.50,length(local-.5));
           c*=1.-.38*shadow;
         }else{
           let decal=textureSampleLevel(decalTex,decalSampler,local,i32(d.w),0.);
           let fade=smoothstep(.0,.12,local.x)*smoothstep(.0,.12,local.y)*
             smoothstep(.0,.12,1.-local.x)*smoothstep(.0,.12,1.-local.y);
           let alpha=decal.a*fade*select(.80,.92,d.w>.5);
           if(d.w>.5){c=mix(c,decal.rgb*.90,clamp(alpha,0.,1.));}
           else{c=mix(c,c*decal.rgb*1.15,clamp(alpha,0.,1.));}
         }
       }
     }
   }
 }
 let fog=clamp((rd-2.)/29.,0.,.90);
 return vec4f(mix(c,vec3f(.10,.105,.09),fog),1.);
}
@fragment fn fragment(@builtin(position) pixel:vec4f)->PixelOut {
 let uv=pixel.xy/frame.viewport.xy;
 let ray3=worldRay(uv,frame);
 let ray=ray3.xy;
 let surfaceDepth=planeDepth(ray3);
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
   if(min(tMax.x,tMax.y)>surfaceDepth){break;}
 }
 var distance=max(VIEW_NEAR,select(tMax.y-delta.y,tMax.x-delta.x,side==0));
 let hasWall=hit!=0u && distance<=surfaceDepth;
 let wallPoint=vec3f(frame.player.xy,.5)+ray3*distance;
 let wallV=clamp(1.-wallPoint.z,0.,1.);
 let wallH=frame.viewport.x/(2.*frame.camera.x*distance);
 var result=vec4f(0.);
 if(hasWall){
   var texX=select(frame.player.x+distance*ray.x,frame.player.y+distance*ray.y,side==0);
   texX=fract(texX);
   if((side==0 && ray.x>0.) || (side==1 && ray.y<0.)){texX=1.-texX;}
   var layer=levelWall(sectorLevel(f32(cell.x)));
   var detailLod=0.;
   if(hit==8u){
     // Safe-room walls: damp dark brick, rust streaks, tiled grout.
     let uvWall=vec2f(texX,wallV);
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
     let wallSize=vec2f(textureDimensions(wallTex,0));
     let wallFootprint=max(wallSize.y/wallH,wallSize.x*distance*2.*frame.camera.x/(frame.viewport.x*max(.12,abs(select(ray.y,ray.x,side==0)))));
     let wallLod=clamp(log2(max(1.,wallFootprint)),0.,f32(textureNumLevels(wallTex)-1u));
     detailLod=wallLod-1.;
     result=textureSampleLevel(wallTex,wallSampler,vec2f(texX,wallV),layer,wallLod);
   }
   if(frame.camera.y>.5){
     let wallUV=vec2f(texX,wallV);
     let scratches=pow(abs(sin(texX*130.+f32(cell.y)*4.7)),19.)*.075;
     let grime=sin(wallUV.y*29.+f32(cell.x)*.6)*sin(texX*61.+f32(cell.y)*2.3)*.13;
     let drip=pow(max(0.,sin(texX*79.+f32(cell.x)*3.)),35.)*wallUV.y*.25;
     let c=result.rgb*vec3f(.73,.69,.64)*(1.-scratches+grime-drip);
     result=vec4f(c,1.);
   }
   if(frame.lighting.x>.5||frame.flashlight.w>.5){
     let normal=select(vec3f(0.,-sign(ray.y),0.),vec3f(-sign(ray.x),0.,0.),side==0);
     let rough=select(.84,.40,layer==1||layer==2||hit==3u||hit==4u);
     if(detailAvailable()&&hit!=8u&&layer<4){
       let tangent=vec3f(-normal.y,normal.x,0.);
       let material=readSurfaceDetail(vec2f(texX,wallV),layer,detailLod,normal,tangent,vec3f(0.,0.,-1.));
       result=vec4f(cp11Shade(result.rgb,wallPoint,normal,material),1.);
     }else{result=vec4f(result.rgb*surfaceLighting(wallPoint,normal,rough,vec3f(1.),frame),1.);}
   }
   let fog=clamp((distance-1.5)/32.,0.,.88);
   result=vec4f(mix(result.rgb,vec3f(.10,.10,.09),fog),1.);
   if(side==1){result=vec4f(result.rgb*.83,1.);}
 }else{
   result=sceneryAt(pixel.xy,ray3);
   distance=surfaceDepth;
 }
 // Static 3D boxes are ray-traced against the actual wall distance. These
 // objects stay put when the camera turns, unlike screen-facing billboards.
 let origin3=vec3f(frame.player.xy,.5);
 var best=distance;
 var furnitureHit=false;
 var furnitureColor=vec3f(0.);
 let inv=vec3f(1.)/select(ray3,vec3f(.000001),abs(ray3)<vec3f(.000001));
 for(var k:u32=0u;k<min(u32(frame.camera.w),64u);k=k+1u){
   let object=roomObjects[k];
   let t0=(object.lower.xyz-origin3)*inv;
   let t1=(object.upper.xyz-origin3)*inv;
   let tNear=max(max(min(t0.x,t1.x),min(t0.y,t1.y)),min(t0.z,t1.z));
   let tFar=min(min(max(t0.x,t1.x),max(t0.y,t1.y)),max(t0.z,t1.z));
   if(tNear>.02&&tNear<tFar&&tNear<best){
     let local=(origin3+ray3*tNear-object.lower.xyz)/max(object.upper.xyz-object.lower.xyz,vec3f(.0001));
     // The slab entry axis identifies the actual hit face, even for a very thin poster.
     let entry=min(t0,t1);
     let faceX=entry.x>=entry.y&&entry.x>=entry.z;
     let faceY=!faceX&&entry.y>=entry.z;
     var n=vec3f(0.,0.,select(1.,-1.,ray3.z>0.));
     if(faceX){n=vec3f(select(1.,-1.,ray3.x>0.),0.,0.);}
     else if(faceY){n=vec3f(0.,select(1.,-1.,ray3.y>0.),0.);}
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
     }else if(typ>=7&&typ<=11){ // photo posters on the wall
       let extent=object.upper.xyz-object.lower.xyz;
       let vertical=extent.x<extent.y;
       col=vec3f(.08,.06,.05); // edges are frame, never stretched photo
       if((vertical&&faceX)||(!vertical&&faceY)){
         let u=select(select(1.-local.x,local.x,n.y>0.),select(1.-local.y,local.y,n.x<0.),vertical);
         let uv=vec2f(clamp(u,0.,1.),1.-clamp(local.z,0.,1.));
         let tex=textureSampleLevel(wallTex,wallSampler,uv,typ,0.);
         col=mix(col,tex.rgb,smoothstep(0.0,0.05,min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y))));
       }
     }
     let sideShade=select(.79,1.,local.z<.04||local.z>.96);
     furnitureColor=col*sideShade;
     if((frame.lighting.x>.5||frame.flashlight.w>.5)&&typ!=6){
       furnitureColor*=surfaceLighting(origin3+ray3*tNear,n,.68,vec3f(1.),frame);
     }
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
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){shade*=.67;}
 if(frame.flashlight.w<.5&&frame.weather.x>.5){shade*=.26;}
 let flicker=1.+.018*sin(frame.player.w*19.)-.012*sin(frame.player.w*7.3);
 var color=result.rgb*shade*flicker;
 if(frame.progress.w<0.){let dip=select(1.,.68,sin(frame.player.w*2.7)>.94 && sin(frame.player.w*25.)>.15);color*=dip;}
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
 out.color=vec4f(max(color,vec3f(0.)),1.);
 out.distance=vec4f(clamp(distance/WALL_DEPTH_SCALE,0.,1.),0.,0.,1.);
 return out;
}
`;
