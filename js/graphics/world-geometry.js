// Build only wall faces adjacent to walkable/render-empty cells. The exact
// uploaded render tiles are authoritative (including animated-door openings
// and tile 5, which is a collision-only decoration, not a visible wall).
function buildWorldWallVertices(tiles,size,stride=128){
 if(!Number.isInteger(size)||size<1||size>stride||tiles.length<size*stride)throw Error('Invalid wall grid');
 const data=[];
 const tile=(x,y)=>x<0||y<0||x>=size||y>=size?1:tiles[y*stride+x];
 const open=(x,y)=>{const t=tile(x,y);return t===0||t===5;};
 const face=(ax,ay,bx,by,cx,cy,side)=>{
  for(const [x,y,z] of [[ax,ay,0],[bx,by,0],[ax,ay,1],[ax,ay,1],[bx,by,0],[bx,by,1]])data.push(x,y,z,cx,cy,side);
 };
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(open(x,y)){
  if(!open(x-1,y))face(x,y,x,y+1,x-1,y,0);
  if(!open(x+1,y))face(x+1,y,x+1,y+1,x+1,y,0);
  if(!open(x,y-1))face(x,y,x+1,y,x,y-1,1);
  if(!open(x,y+1))face(x,y+1,x+1,y+1,x,y+1,1);
 }
 return new Float32Array(data);
}
// A plane tag needs no per-cell material data. Merge adjacent plane quads
// into rectangles while preserving holes, collision-only cells and winding.
function buildWorldSurfaceMesh(tiles,size,stride=128){
 const walls=buildWorldWallVertices(tiles,size,stride);
 const open=new Uint8Array(size*size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const tile=tiles[y*stride+x];
  open[y*size+x]=Number(tile===0||tile===5);
 }
 const planes=[];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  if(!open[y*size+x])continue;
  let right=x+1;
  while(right<size&&open[y*size+right])right++;
  let bottom=y+1;
  rows:for(;bottom<size;bottom++){
   for(let column=x;column<right;column++)if(!open[bottom*size+column])break rows;
  }
  for(let row=y;row<bottom;row++)open.fill(0,row*size+x,row*size+right);
  const corners=[[x,y],[right,y],[x,bottom],[right,bottom]];
  for(const i of [0,1,2,2,1,3])planes.push(...corners[i],0,x,y,2);
  for(const i of [0,2,1,1,2,3])planes.push(...corners[i],1,x,y,3);
 }
 const vertices=new Float32Array(walls.length+planes.length);
 vertices.set(walls);vertices.set(planes,walls.length);
 return {vertices,wallVertices:walls.length/6,planeVertices:planes.length/6};
}
class WorldGeometryExperiment {
 constructor(renderer){this.renderer=renderer;this.device=renderer.device;this.enabled=false;this.available=false;this.error=null;this.uploadRevision=-1;this.vertexCount=0;this.wallVertexCount=0;this.planeVertexCount=0;this.width=0;this.height=0;this.materialRevision=-1;}
 async initialize(){
  const r=this.renderer,d=this.device;
  d.pushErrorScope('validation');
  try{
   this.shader=d.createShaderModule({label:'CP10 world surface geometry',code:WORLD_GEOMETRY_WGSL});
   this.resolveShader=d.createShaderModule({label:'CP10 geometry surface resolve',code:geometryTerrainSource()});
   this.pipeline=d.createRenderPipeline({label:'CP10 raster surface hits',layout:'auto',vertex:{module:this.shader,entryPoint:'vertex',buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'}]}]},fragment:{module:this.shader,entryPoint:'fragment',targets:[{format:'rgba16float'}]},primitive:{topology:'triangle-list',cullMode:'none'},depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less'}});
   this.resolvePipeline=d.createRenderPipeline({label:'CP10 geometry terrain resolve',layout:'auto',vertex:{module:this.resolveShader,entryPoint:'vert'},fragment:{module:this.resolveShader,entryPoint:'fragment',targets:[{format:r.sceneFormat},{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
   this.frameBind=d.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.frameBuffer}}]});
   const reports=await Promise.all([this.shader.getCompilationInfo(),this.resolveShader.getCompilationInfo()]);
   const errors=reports.flatMap(report=>report.messages.filter(m=>m.type==='error').map(m=>m.message));
   if(errors.length)throw Error(errors.join('; '));
  }catch(e){this.error=String(e.message||e);}
  const validation=await d.popErrorScope();if(validation)this.error=validation.message;
  this.available=!this.error;
 }
 toggle(){if(!this.available)return false;this.enabled=!this.enabled;this.renderer.needsRender=true;return this.enabled;}
 prepare(){
  const r=this.renderer,d=this.device;
  if(this.uploadRevision!==r.stats.mapUploads){
   const {vertices,wallVertices,planeVertices}=buildWorldSurfaceMesh(r.tilesData,r.mapSize);
   const newBuffer=d.createBuffer({label:'CP10 static world triangles',size:Math.max(24,vertices.byteLength),usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
   if(vertices.length)d.queue.writeBuffer(newBuffer,0,vertices);
   if(this.vertexBuffer)this.vertexBuffer.destroy();
   this.vertexBuffer=newBuffer;this.vertexCount=vertices.length/6;this.wallVertexCount=wallVertices;this.planeVertexCount=planeVertices;this.uploadRevision=r.stats.mapUploads;
  }
  if(this.width!==r.lastWidth||this.height!==r.lastHeight){
   if(this.hits)this.hits.destroy();
   this.hits=d.createTexture({label:'CP10 surface hit buffer',size:[r.lastWidth,r.lastHeight],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
   this.width=r.lastWidth;this.height=r.lastHeight;this.materialRevision=-1;
  }
  if(this.materialRevision!==r.materialRevision){
   this.resolveBind=d.createBindGroup({layout:this.resolvePipeline.getBindGroupLayout(0),entries:[...r.terrainBindings(),{binding:11,resource:this.hits.createView()}]});
   this.materialRevision=r.materialRevision;
  }
 }
 encode(encoder){
  this.prepare();
  const pass=encoder.beginRenderPass({label:'CP10 rasterized world geometry',colorAttachments:[{view:this.hits.createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:0}}],depthStencilAttachment:{view:this.renderer.meshDepthTexture.createView(),depthLoadOp:'clear',depthClearValue:1,depthStoreOp:'discard'}});
  pass.setPipeline(this.pipeline);pass.setBindGroup(0,this.frameBind);pass.setVertexBuffer(0,this.vertexBuffer);pass.draw(this.vertexCount);pass.end();
 }
}
