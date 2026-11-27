// CP08: floating-point scene desired, temporal exposure and quarter-size bloom.
// Legacy scene shaders still use approximate display-space lighting; this is
// internal HDR, not an HDR monitor output or a fully linear PBR pipeline.
const POST_WGSL=`
struct Params { dt:f32, fxOn:f32, reset:f32, pad:f32 }
@group(0) @binding(0) var source:texture_2d<f32>;
@group(0) @binding(1) var auxiliary:texture_2d<f32>;
@group(0) @binding(2) var linearSampler:sampler;
@group(0) @binding(3) var<uniform> params:Params;
struct VertexOut { @builtin(position) position:vec4f, @location(0) uv:vec2f }
@vertex fn vertex(@builtin(vertex_index) i:u32)->VertexOut {
 var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));
 var out:VertexOut; out.position=vec4f(p[i],0.,1.);out.uv=p[i]*vec2f(.5,-.5)+vec2f(.5);return out;
}
fn luma(c:vec3f)->f32{return dot(max(c,vec3f(0.)),vec3f(.2126,.7152,.0722));}
@fragment fn exposure()->@location(0) vec4f {
 let size=vec2i(textureDimensions(source,0));
 var sum=0.;
 for(var y=0;y<8;y++){for(var x=0;x<8;x++){
   let uv=(vec2f(f32(x),f32(y))+vec2f(.5))/8.;
   let pixel=min(vec2i(uv*vec2f(size)),size-vec2i(1));
   sum+=log(max(.035,luma(textureLoad(source,pixel,0).rgb)));
 }}
 let desired=clamp(.30/exp(sum/64.),.80,1.42);
 let previous=select(textureLoad(auxiliary,vec2i(0),0).r,1.,params.reset>.5);
 let rate=select(.75,2.5,desired<previous);
 let value=mix(previous,desired,1.-exp(-rate*params.dt));
 return vec4f(value,0.,0.,1.);
}
@fragment fn extract(input:VertexOut)->@location(0) vec4f {
 let pixelStep=1./vec2f(textureDimensions(source,0));
 var c=vec3f(0.);
 for(var y=-1;y<=1;y++){for(var x=-1;x<=1;x++){
   let sampleColor=max(textureSampleLevel(source,linearSampler,input.uv+vec2f(f32(x),f32(y))*pixelStep*1.5,0.).rgb,vec3f(0.));
   let peak=max(max(sampleColor.r,sampleColor.g),sampleColor.b);
   c+=sampleColor*(smoothstep(.74,1.25,peak)*.8);
 }}
 return vec4f(c/9.,1.);
}
@fragment fn blur(input:VertexOut)->@location(0) vec4f {
 let pixelStep=1./vec2f(textureDimensions(source,0));
 var c=vec3f(0.);
 for(var y=-2;y<=2;y++){for(var x=-2;x<=2;x++){
   let w=f32(3-abs(x))*f32(3-abs(y));
   c+=textureSampleLevel(source,linearSampler,input.uv+vec2f(f32(x),f32(y))*pixelStep,0.).rgb*w;
 }}
 return vec4f(c/81.,1.);
}
@group(0) @binding(4) var bloomTexture:texture_2d<f32>;
fn shoulder(x:vec3f)->vec3f {
 let c=max(x,vec3f(0.));
 return min(c,vec3f(.68))+vec3f(.32)*(vec3f(1.)-exp(-max(c-vec3f(.68),vec3f(0.))/.32));
}
@fragment fn composite(input:VertexOut)->@location(0) vec4f {
 let c=textureSampleLevel(source,linearSampler,input.uv,0.).rgb;
 if(params.fxOn<.5){return vec4f(clamp(c,vec3f(0.),vec3f(1.)),1.);}
 let exposureValue=textureLoad(auxiliary,vec2i(0),0).r;
 let bloom=textureSampleLevel(bloomTexture,linearSampler,input.uv,0.).rgb;
 return vec4f(shoulder((c+bloom*.19)*exposureValue),1.);
}
`;
class CatroomsPostProcessing {
 constructor(device,format){
  this.device=device;this.enabled=true;this.reset=true;this.lastTime=null;this.index=0;this.passes=0;
  this.shader=device.createShaderModule({label:'CP08 post-processing',code:POST_WGSL});
  const pipeline=(entry,target)=>device.createRenderPipeline({label:'CP08 '+entry,layout:'auto',vertex:{module:this.shader,entryPoint:'vertex'},fragment:{module:this.shader,entryPoint:entry,targets:[{format:target}]},primitive:{topology:'triangle-list'}});
  this.exposurePipeline=pipeline('exposure','rgba16float');this.extractPipeline=pipeline('extract','rgba16float');this.blurPipeline=pipeline('blur','rgba16float');this.compositePipeline=pipeline('composite',format);
  this.params=device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
  this.sampler=device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
 }
 resize(w,h){
  const d=this.device;
  for(const tex of this.textures||[])tex.destroy();
  const texture=(label,width,height)=>d.createTexture({label:'CP08 '+label,size:[width,height],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
  this.scene=texture('HDR scene',w,h);this.bloomWidth=Math.max(1,Math.ceil(w/4));this.bloomHeight=Math.max(1,Math.ceil(h/4));
  this.bright=texture('bright',this.bloomWidth,this.bloomHeight);this.blurred=texture('blurred',this.bloomWidth,this.bloomHeight);
  this.history=[texture('exposure A',1,1),texture('exposure B',1,1)];
  this.textures=[this.scene,this.bright,this.blurred,...this.history];this.index=0;this.reset=true;this.lastTime=null;
  const tex=(binding,t)=>({binding,resource:t.createView()});const sampler={binding:2,resource:this.sampler};const params={binding:3,resource:{buffer:this.params}};
  const bind=(p,entries)=>d.createBindGroup({layout:p.getBindGroupLayout(0),entries});
  this.exposureBinds=this.history.map(t=>bind(this.exposurePipeline,[tex(0,this.scene),tex(1,t),params]));
  this.extractBind=bind(this.extractPipeline,[tex(0,this.scene),sampler]);this.blurBind=bind(this.blurPipeline,[tex(0,this.bright),sampler]);
  this.compositeBinds=this.history.map(t=>bind(this.compositePipeline,[tex(0,this.scene),tex(1,t),sampler,params,tex(4,this.blurred)]));
 }
 encode(encoder,output,active,time){
  active=!!active&&this.enabled;
  const dt=this.lastTime===null?1/60:Math.max(0,Math.min(.1,(time-this.lastTime)/1000));
  this.lastTime=active?time:null;
  this.device.queue.writeBuffer(this.params,0,new Float32Array([dt,+active,+this.reset,0]));
  const pass=(pipeline,bind,view)=>{const p=encoder.beginRenderPass({colorAttachments:[{view,loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});p.setPipeline(pipeline);p.setBindGroup(0,bind);p.draw(3);p.end();this.passes++;};
  this.passes=0;
  if(active){
   const next=1-this.index;
   pass(this.exposurePipeline,this.exposureBinds[this.index],this.history[next].createView());this.index=next;
   pass(this.extractPipeline,this.extractBind,this.bright.createView());pass(this.blurPipeline,this.blurBind,this.blurred.createView());this.reset=false;
  }else this.reset=true;
  pass(this.compositePipeline,this.compositeBinds[this.index],output);
 }
}
