// Shared frame ABI and depth conventions for the hybrid WebGPU renderer.
// Keep forward distance (world units) separate from projected GPU depth [0,1].
const RENDER_FRAME=Object.freeze({floats:32,bytes:128,player:0,viewport:4,progress:8,visuals:12,weather:16,camera:20,lighting:24,flashlight:28});
const RENDER_DEPTH=Object.freeze({near:.04,far:140,wallScale:256,spriteNear:.16,spriteFar:125});
const FRAME_WGSL=/* wgsl */ `
struct SceneFrame {
 player:vec4f,
 viewport:vec4f,
 progress:vec4f,
 visuals:vec4f,
 weather:vec4f,
 camera:vec4f,
 lighting:vec4f,
 flashlight:vec4f, // yaw, pitch, intensity, new beam enabled
};
`;
const DEPTH_WGSL=/* wgsl */ `
const VIEW_NEAR:f32=${RENDER_DEPTH.near};
const VIEW_FAR:f32=${RENDER_DEPTH.far}.0;
const WALL_DEPTH_SCALE:f32=${RENDER_DEPTH.wallScale}.0;
`;

// All passes use the same right-handed camera basis, horizontal FOV and depth.
const PROJECTION_WGSL=/* wgsl */ `
fn cameraCoords(point:vec3f,f:SceneFrame)->vec3f {
 let dir=vec2f(cos(f.player.z),sin(f.player.z));
 let delta=point.xy-f.player.xy;
 let forward=dot(delta,dir);
 let h=point.z-.5;
 let c=cos(f.weather.w);let s=sin(f.weather.w);
 return vec3f(dot(delta,vec2f(-dir.y,dir.x)),h*c-forward*s,forward*c+h*s);
}
fn cameraClip(p:vec3f,f:SceneFrame)->vec4f {
 let scale=1./max(.05,f.camera.x);
 return vec4f(p.x*scale,p.y*scale*f.viewport.x/f.viewport.y,
 VIEW_FAR/(VIEW_FAR-VIEW_NEAR)*p.z-VIEW_NEAR*VIEW_FAR/(VIEW_FAR-VIEW_NEAR),p.z);
}
fn worldRay(uv:vec2f,f:SceneFrame)->vec3f {
 let dir=vec2f(cos(f.player.z),sin(f.player.z));
 let q=vec2f((uv.x*2.-1.)*f.camera.x,(1.-uv.y*2.)*f.camera.x*f.viewport.y/f.viewport.x);
 let c=cos(f.weather.w);let s=sin(f.weather.w);
 return vec3f(dir*(c-q.y*s)+vec2f(-dir.y,dir.x)*q.x,s+q.y*c);
}
fn planeDepth(ray:vec3f)->f32 {return min(VIEW_FAR,.5/max(abs(ray.z),.000001));}
`;
// First lighting experiment: a bounded local fixture grid and optional campfire.
// CP06: bounded grid visibility for full-height walls. Roughness remains scalar.
const LIGHTING_WGSL=/* wgsl */ `
fn shadowSolid(cell:vec2i,size:i32)->bool {
 if(any(cell<vec2i(0))||any(cell>=vec2i(size))){return true;}
 let tile=worldTiles[u32(cell.y)*128u+u32(cell.x)];
 // The upper bits flag a closed mesh door hidden from terrain rendering.
 return tile!=0u&&tile!=5u;
}
// Trace only the finite segment toward the light, not the entire map.
// A small forward bias avoids re-hitting the shaded wall itself, including
// the half-float depth reconstruction in the experimental raster pass.
fn wallLightVisible(p:vec2f,source:vec2f,size:i32)->bool {
 let segment=source-p;let span=length(segment);
 let targetCell=vec2i(floor(source));
 if(shadowSolid(targetCell,size)){return false;}
 if(span<.0001){return true;}
 let start=p+segment*min(.5,.06/span);
 let ray=source-start;
 var cell=vec2i(floor(start));
 if(shadowSolid(cell,size)){return false;}
 let gridStep=vec2i(select(1,-1,ray.x<0.),select(1,-1,ray.y<0.));
 let delta=vec2f(1.)/max(abs(ray),vec2f(.000001));
 let boundary=vec2f(cell)+vec2f(select(1.,0.,ray.x<0.),select(1.,0.,ray.y<0.));
 var nextCross=abs(boundary-start)*delta;
 // A parallel axis has no crossing, even when starting exactly on a grid line.
 nextCross=select(nextCross,vec2f(1e20),abs(ray)<vec2f(.000001));
 for(var i:i32=0;i<24;i++){
  if(all(cell==targetCell)){return true;}
  // Endpoint can be on a grid edge/corner (e.g. a centered campfire).
  // Never advance past the source or demand reaching floor(source) from
  // every direction; at t=1 the open segment is already fully traversed.
  if(min(nextCross.x,nextCross.y)>=1.-.000001){return true;}
  if(abs(nextCross.x-nextCross.y)<.00001){
   if(shadowSolid(cell+vec2i(gridStep.x,0),size)||shadowSolid(cell+vec2i(0,gridStep.y),size)){return false;}
   cell+=gridStep;nextCross+=delta;
  }else if(nextCross.x<nextCross.y){cell.x+=gridStep.x;nextCross.x+=delta.x;}
  else{cell.y+=gridStep.y;nextCross.y+=delta.y;}
  if(shadowSolid(cell,size)){return false;}
 }
 return false;
}
fn pointContribution(p:vec3f,n:vec3f,eye:vec3f,rough:f32,source:vec3f,tint:vec3f,power:f32,f:SceneFrame)->vec3f {
 let delta=source-p;let d2=max(dot(delta,delta),.025);
 let l=delta*inverseSqrt(d2);
 let diffuse=max(0.,dot(n,l));
 let hv=l+eye;let halfway=hv*inverseSqrt(max(dot(hv,hv),.00001));
 let spec=pow(max(0.,dot(n,halfway)),mix(64.,8.,rough))*(1.-rough)*.20;
 var visibility=1.;
 if(f.lighting.x>1.5){
  // Limit each ray to nine cells and skip unlit faces before any grid loads.
  if(diffuse+spec<.0001||d2>=81.){return vec3f(0.);}
  if(!wallLightVisible(p.xy,source.xy,i32(f.viewport.z))){return vec3f(0.);}
  visibility=1.-smoothstep(49.,81.,d2);
 }
 return tint*(diffuse+spec)*power*visibility/(1.+d2*1.35);
}
fn sceneLight(p:vec3f,n:vec3f,rough:f32,f:SceneFrame)->vec3f {
 let eyeDelta=vec3f(f.player.xy,.5)-p;
 let eye=eyeDelta*inverseSqrt(max(dot(eyeDelta,eyeDelta),.00001));
 var tint=vec3f(1.,.91,.70);
 var sector=f.viewport.w;
 if(sector==12.){sector=f32(clamp(i32(floor((p.x-4.)/23.))+1,1,5));}
 if(sector==2.){tint=vec3f(.57,.85,1.);}
 else if(sector==3.){tint=vec3f(1.,.40,.27);}
 else if(sector==4.){tint=vec3f(1.,.76,.48);}
 else if(sector==5.||sector==6.){tint=vec3f(.86,.51,1.);}
 let grid=floor((p.xy-vec2f(2.5,1.45))/vec2f(5.,4.));
 var light=vec3f(.33,.33,.35);
 for(var y:i32=0;y<2;y++){for(var x:i32=0;x<2;x++){
  let cell=grid+vec2f(f32(x),f32(y));
  let pos=cell*vec2f(5.,4.)+vec2f(2.5,1.45);
  let phase=dot(cell,vec2f(12.37,8.91));
  let flicker=.91+.09*sin(f.player.w*9.+phase)-.22*step(.985,sin(f.player.w*2.3+phase));
  let power=select(2.1,.12,f.weather.x>.5)*flicker;
  light+=pointContribution(p,n,eye,rough,vec3f(pos,.97),tint,power,f);
 }}
 if(f.lighting.w>.5){
  let flicker=1.1+.22*sin(f.player.w*13.)+.16*sin(f.player.w*23.);
  light+=pointContribution(p,n,eye,rough,vec3f(f.lighting.yz,.30),vec3f(1.,.48,.15),flicker*2.8,f);
 }
 return light;
}
// Camera-mounted spotlight, separate from F10's environmental lighting.
fn flashlightLight(p:vec3f,n:vec3f,f:SceneFrame)->vec3f {
 if(f.flashlight.w<.5||f.flashlight.z<.001){return vec3f(0.);}
 let source=vec3f(f.player.xy,.5);
 let delta=p-source;
 let d2=dot(delta,delta);
 if(d2<.0001||d2>=121.){return vec3f(0.);}
 let l=delta*inverseSqrt(d2);
 let direction=vec3f(cos(f.flashlight.x)*cos(f.flashlight.y),sin(f.flashlight.x)*cos(f.flashlight.y),sin(f.flashlight.y));
 let beam=smoothstep(.9063,.9781,dot(l,direction)); // 25° outer, 12° inner
 let diffuse=max(0.,dot(n,-l));
 if(beam*diffuse<.0001){return vec3f(0.);}
 if(!wallLightVisible(p.xy,source.xy,i32(f.viewport.z))){return vec3f(0.);}
 let rangeFade=1.-smoothstep(64.,121.,d2);
 return vec3f(1.,.94,.79)*f.flashlight.z*beam*diffuse*rangeFade*2.8/(1.+d2*.11);
}
fn surfaceLighting(p:vec3f,n:vec3f,rough:f32,classic:vec3f,f:SceneFrame)->vec3f {
 var ambient=classic;
 if(f.lighting.x>.5){ambient=sceneLight(p,n,rough,f);}
 if(f.flashlight.w>.5){
  ambient*=select(.76,.20,f.weather.x>.5);
  ambient+=flashlightLight(p,n,f);
 }
 return ambient;
}
`;
