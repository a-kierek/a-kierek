// WebGPU shader source: mesh
const MODEL_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(5) var<storage,read> worldTiles:array<u32>;
${LIGHTING_WGSL}
struct ModelPose { world:vec4f, rotation:vec4f, tilt:vec4f };
fn tiltModel(v:vec3f)->vec3f {return vec3f(v.x,v.y*pose.tilt.x-v.z*pose.tilt.y,v.y*pose.tilt.y+v.z*pose.tilt.x);}
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
 @location(5) @interpolate(flat) unlocked:f32,
 @location(6) localHeight:f32,
 @location(7) worldPoint:vec3f,
};
@vertex fn vertex(
 @location(0) inPos:vec3f,
 @location(1) inNormal:vec3f,
 @location(2) inUV:vec2f,
 @location(3) inColor:vec3f
)->MeshVertexOut {
 let local=tiltModel(inPos);
 let rotated=vec3f(local.x*pose.rotation.x-local.y*pose.rotation.y,
                   local.x*pose.rotation.y+local.y*pose.rotation.x,local.z);
 let point=pose.world.xyz+rotated*pose.world.w;
 let coords=cameraCoords(point,frame);
 let depth=coords.z;
 var result:MeshVertexOut;
 result.position=cameraClip(coords,frame);
 result.worldPoint=point;
 let n=tiltModel(inNormal);
 result.normal=normalize(vec3f(n.x*pose.rotation.x-n.y*pose.rotation.y,
    n.x*pose.rotation.y+n.y*pose.rotation.x,n.z));
 result.uv=vec2f(inUV.x,1.-inUV.y);
 result.tint=inColor;
 result.depth=depth;
 result.kind=u32(pose.rotation.z);
 result.unlocked=pose.rotation.w;
 result.localHeight=select(inPos.z,point.z,abs(pose.tilt.y)>.5);
 return result;
}
@fragment fn fragment(input:MeshVertexOut)->@location(0) vec4f {
 let pixel=vec2i(floor(input.position.xy));
 if(any(pixel<vec2i(0))||any(pixel>=vec2i(frame.viewport.xy))){discard;}
 let wall=textureLoad(wallDistance,pixel,0).r*WALL_DEPTH_SCALE;
 if(input.depth>wall-.025){discard;}
 var base=input.tint;
 if(input.kind==1u||input.kind==3u||input.kind==5u){
   base*=textureSampleLevel(slotAlbedo,albedoSampler,input.uv,0.).rgb;
 }
 if(input.kind==4u){base=mix(base,vec3f(.82,.74,.50),.45);} if(input.kind==4u&&input.unlocked>.5){base=mix(base,vec3f(.28,.72,.38),.72);}
 var light=clamp(.46+.47*dot(normalize(input.normal),normalize(vec3f(.40,-.15,.88))),.30,1.);
 if(input.kind==0u&&input.tint.r>.85){
    // Ember and flame parts keep their original low-poly mesh geometry.
    light=1.05+.14*sin(frame.player.w*13.+input.uv.x*10.);
 }
 // Environmental meshes use their original material atlas, with soft overhead
 // shading, restrained specular and a little occlusion toward their bases.
 if(input.kind==5u){
   let normal=normalize(input.normal);
   let key=normalize(vec3f(.38,-.25,.89));
   let diffuse=max(0.,dot(normal,key));
   let ground=0.78+0.22*smoothstep(0.,.28,input.localHeight);
   let sector=input.unlocked;
   var tint=vec3f(1.,.94,.78);
   if(sector==2.){tint=vec3f(.76,.93,1.);}
   else if(sector==3.){tint=vec3f(1.,.79,.73);}
   else if(sector==4.){tint=vec3f(.94,.83,.73);}
   else if(sector==5.){tint=vec3f(.91,.84,.88);}
   base*=mix(vec3f(1.),tint,.32);
   light=(.54+.40*diffuse+.06*max(0.,normal.z))*ground;
   let eye=normalize(vec3f(-cos(frame.player.z),-sin(frame.player.z),.18));
   let halfVec=normalize(key+eye);
   base+=vec3f(.06,.055,.045)*pow(max(0.,dot(normal,halfVec)),12.);
 }
 var rgb=base*light;
 if((frame.lighting.x>.5||frame.flashlight.w>.5)&&!(input.kind==0u&&input.tint.r>.85)){
   rgb=base*surfaceLighting(input.worldPoint,normalize(input.normal),.65,vec3f(light),frame);
 }
 let fog=clamp((input.depth-2.)/34.,0.,.78);
 rgb=mix(rgb,vec3f(.10,.10,.09),fog);
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){rgb*=.68;}
 return vec4f(rgb,1.);
}
`;
