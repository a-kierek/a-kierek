// WebGPU shader source: sprites
const SPRITES_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(5) var<storage,read> worldTiles:array<u32>;
@group(0) @binding(6) var<storage,read> shadowData:array<vec4f>;
${LIGHTING_WGSL}
struct Sprite { rect:vec4f, data:vec4f };
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var wallDistance:texture_2d<f32>;
@group(0) @binding(2) var images:texture_2d_array<f32>;
@group(0) @binding(3) var imageSampler:sampler;
@group(0) @binding(4) var<storage,read> sprites:array<Sprite>;
struct VOut{
 @builtin(position) position:vec4f,
 @location(0) uv:vec2f,
 @location(1) @interpolate(flat) data:vec4f,
 @location(2) depth:f32,
};
@vertex fn vertex(@builtin(vertex_index) index:u32,@builtin(instance_index) instance:u32)->VOut {
 let v=array<vec2f,6>(vec2f(0.,0.),vec2f(1.,0.),vec2f(0.,1.),
                       vec2f(0.,1.),vec2f(1.,0.),vec2f(1.,1.));
 let unit=v[index];
 let item=sprites[instance];
 // Upright world billboard. rect.xy is the center in camera coordinates.
 let vertical=(.5-unit.y)*item.rect.w;
 let coords=vec3f(item.rect.x+(unit.x-.5)*item.rect.z,
 item.rect.y+vertical*cos(frame.weather.w),item.data.y+vertical*sin(frame.weather.w));
 var out:VOut;
 out.position=cameraClip(coords,frame);
 out.depth=coords.z;
 out.uv=unit;
 out.data=item.data;
 return out;
}
@fragment fn fragment(input:VOut)->@location(0) vec4f {
 let p=vec2i(floor(input.position.xy));
 if(any(p<vec2i(0)) || any(p>=vec2i(frame.viewport.xy))){discard;}
 let depth=textureLoad(wallDistance,p,0).r*WALL_DEPTH_SCALE;
 if(input.depth>=depth-.012){discard;}
 let c=textureSampleLevel(images,imageSampler,input.uv,i32(input.data.x),0.);
 if(c.a<.025){discard;}
 let fog=clamp((input.depth-8.)/36.,0.,.72);
 let alpha=c.a*(1.-fog*.48);
 var rgb=mix(c.rgb,vec3f(.10,.10,.09),fog);
 // Input z = variant index: 0 classic, 1 red, 2 green, 3 yellow, 4 gray, 5 pink.
 if(input.data.z>0.5 && input.data.z<1.5){rgb=mix(rgb,vec3f(.90,.09,.075),.56);}
 else if(input.data.z<2.5 && input.data.z>1.5){rgb=mix(rgb,vec3f(.12,.81,.18),.50);}
 else if(input.data.z<3.5 && input.data.z>2.5){rgb=mix(rgb,vec3f(.91,.79,.13),.49);}
 else if(input.data.z<4.5 && input.data.z>3.5){rgb=mix(rgb,vec3f(.50,.51,.54),.80);}
 else if(input.data.z<5.5 && input.data.z>4.5){rgb=mix(rgb,vec3f(.97,.31,.64),.58);}
 if(input.data.w>.5){rgb=mix(rgb,vec3f(.55,.86,1.),.78);rgb+=vec3f(.07,.11,.14)*sin(input.position.y*.16+frame.player.w*2.);}

 if(frame.lighting.x>.5||frame.flashlight.w>.5){
   let point=vec3f(frame.player.xy,.5)+worldRay(input.position.xy/frame.viewport.xy,frame)*input.depth;
   let normal=vec3f(-cos(frame.player.z),-sin(frame.player.z),0.);
   rgb*=surfaceLighting(point,normal,.85,vec3f(1.),frame);
 }
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){rgb*=.66;}
 if(frame.flashlight.w<.5&&frame.weather.x>.5){rgb*=.35;}
 return vec4f(rgb,alpha);
}
`;
