// THE CATROOMS / WebGPU scene renderer.
// This is a real GPU ray-caster: WGSL draws walls, floor, ceiling and ground decals.
// Characters and sprite items use a GPU instanced billboard pass; imported GLBs use
// a separate textured triangular-mesh pass, with wall and mesh depth testing.




// Meshes are preprocessed from the supplied GLB files; no Babylon/Three required.
const MODEL_SLOT_ALBEDO_PNG='assets/models/slot-albedo.webp';
const MODEL_ROCK_ALBEDO='assets/models/rock-albedo.webp';


const GPU_SPRITE_SIZE=256;
const GPU_WALL_W=128;
const GPU_WALL_H=256;
const GPU_TILE_SIZE=64;
const GPU_MAX_DECALS=256;
const GPU_MAX_SPRITES=256;
const MESH_POSE_COUNTS={slot:4,campfire:4,tree:4,rock:64,door:16,decor:64,pickup:32,shield:16,drink:24,terminal:24};
const WORLD_ITEM_KINDS={battery:6,card:7,shield:8,drink:9,terminal:10};
const WORLD_ITEM_TILTS={
 battery:[0,0,Math.PI/2,-Math.PI/2],card:[0],shield:[0,0,Math.PI],drink:[0,0,Math.PI/2,-Math.PI/2],terminal:[0]
};
const WORLD_ITEM_SCALE={battery:.62,card:.72,shield:1,drink:1,terminal:1};
function bonusPickupModel(item){return item.type==='shield'?'shield':item.type==='stamina'?'drink':null;}
function worldItemPool(model){return model==='battery'||model==='card'?'pickup':model;}
// The order of the atlas is a single contract for upload and projection.
function spriteLayerSources(){return [catImg,pigImg,personBImg,personAImg,fuseImg,keycardImg,foodImg,terminalImg,lockerArt,stairArt,staminaArt,shieldArt,extraPickupArt,coopAvatarArt,slowDeviceImg,freezeDeviceImg,...energyDrinkImgs,hardRockArt,coinSprite,slotMachineSprite,strangerImg];}
const SPRITE_LAYER=Object.freeze({cat:0,pig:1,watcher:2,listener:3,terminal:7,hide:8,stairs:9,stamina:10,shield:11,key:12,coopAvatar:13,hardSlow:14,hardFreeze:15,rock:21,coin:22,slot:23,stranger:24});
const SPRITE_ENEMY_KINDS=new Set(['cat','pig','watcher','listener','stranger']);

class CatroomsWebGPURenderer {
  constructor(device,context,format,post=null){
    this.device=device;this.context=context;this.format=format;this.post=post;this.sceneFormat=post?'rgba16float':format;
    this.frameBuffer=device.createBuffer({size:RENDER_FRAME.bytes,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    this.mapBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalCellsBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalDataBuffer=device.createBuffer({size:GPU_MAX_DECALS*16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.spriteBuffer=device.createBuffer({size:GPU_MAX_SPRITES*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.furnitureBuffer=device.createBuffer({size:64*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.wallTexture=device.createTexture({size:[GPU_WALL_W,GPU_WALL_H,12],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.floorTexture=device.createTexture({size:[GPU_TILE_SIZE,GPU_TILE_SIZE,8],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.decalTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,2],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.spriteTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,25],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.sampler=device.createSampler({magFilter:'linear',minFilter:'linear',mipmapFilter:'linear',addressModeU:'repeat',addressModeV:'repeat'});
    this.spriteSampler=device.createSampler({magFilter:'linear',minFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    this.terrainShader=device.createShaderModule({label:'Catrooms terrain WGSL',code:TERRAIN_WGSL});
    this.spriteShader=device.createShaderModule({label:'Catrooms sprite WGSL',code:SPRITES_WGSL});
    this.meshShader=device.createShaderModule({label:'Catrooms imported GLB mesh WGSL',code:MODEL_WGSL});
    this.terrainPipeline=device.createRenderPipeline({label:'Catrooms walls and floor',layout:'auto',vertex:{module:this.terrainShader,entryPoint:'vert'},fragment:{module:this.terrainShader,entryPoint:'fragment',targets:[{format:this.sceneFormat},{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
    this.spritePipeline=device.createRenderPipeline({label:'Catrooms transparent billboards',layout:'auto',vertex:{module:this.spriteShader,entryPoint:'vertex'},fragment:{module:this.spriteShader,entryPoint:'fragment',targets:[{format:this.sceneFormat,blend:{color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'},depthStencil:{format:'depth24plus',depthWriteEnabled:false,depthCompare:'less'}});
    this.meshPipeline=device.createRenderPipeline({label:'Catrooms static GLB geometry',layout:'auto',
      vertex:{module:this.meshShader,entryPoint:'vertex',buffers:[{arrayStride:44,stepMode:'vertex',attributes:[
        {shaderLocation:0,offset:0,format:'float32x3'},
        {shaderLocation:1,offset:12,format:'float32x3'},
        {shaderLocation:2,offset:24,format:'float32x2'},
        {shaderLocation:3,offset:32,format:'float32x3'}]}]},
      fragment:{module:this.meshShader,entryPoint:'fragment',targets:[{format:this.sceneFormat}]},
      primitive:{topology:'triangle-list',cullMode:'none'},
      depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less'}});
    this.modelMeshes={};
    this.rushPoseBuffers={};
    for(const [kind,count] of Object.entries(MESH_POSE_COUNTS)){
      this.rushPoseBuffers[kind]=Array.from({length:count},()=>device.createBuffer({
        size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));
    }
    this.surfaceDetails=null;this.surfaceDetailError=null;this.hdMaterials=null;this.hdEnabled=false;this.hdError=null;this.materialRevision=0;
    this.lastWidth=0;this.lastHeight=0;this.needsRender=true;this.pendingFrames=0;
    this.frameData=new Float32Array(RENDER_FRAME.floats);this.lightingEnabled=true;this.wallShadowsEnabled=true;this.flashlightEnabled=true;this.flashlightState=null;
    this.softShadowsEnabled=false;this.modelShadowsEnabled=false;
    this.tilesData=new Uint32Array(128*128);this.gpuTilesData=new Uint32Array(128*128);this.mapSource=null;this.mapRevision=-1;this.mapSize=0;
    this.furnitureData=new Float32Array(64*8);this.furnitureSource=null;this.furnitureLength=-1;this.furnitureCount=0;
    this.decalGridData=new Uint32Array(128*128);this.decalData=new Float32Array(GPU_MAX_DECALS*4);this.decalScratch=new Float32Array(GPU_MAX_DECALS*4);this.decalCount=-1;this.decalWorld=null;
    this.spriteData=new Float32Array(GPU_MAX_SPRITES*8);
    this.spriteDiagnostics=[];this.stats={mapUploads:0,furnitureUploads:0,decalUploads:0,staticBytes:0,frames:0,triangles:0,sprites:0};
    this.poseCache=new Map();this.doorAnimations=new WeakMap();this.doorLayout=[];
  }
  uploadCanvasLayer(texture,source,width,height,layer){
    const off=document.createElement('canvas');off.width=width;off.height=height;
    const g=off.getContext('2d');g.clearRect(0,0,width,height);
    g.drawImage(source,0,0,width,height);
    this.device.queue.copyExternalImageToTexture({source:off},{texture,origin:[0,0,layer]},[width,height,1]);
  }
  async buildTextures(){
    const images=spriteLayerSources();
    // complete alone does not guarantee a decoded image. Never silently replace an enemy with a pickup.
    const required=new Map([[0,'Marmur'],[1,'Chrum'],[2,'Blysk'],[3,'Szept'],[24,'Nieznajomy']]);
    const resolved=await Promise.all(images.map(async (img,i)=>{
      if(!(img instanceof HTMLImageElement))return img;
      try{await img.decode();if(img.naturalWidth&&img.naturalHeight)return img;}catch(e){}
      if(required.has(i)){
        const retry=new Image();retry.src=img.src;
        try{await retry.decode();if(retry.naturalWidth&&retry.naturalHeight)return retry;}catch(e){}
        throw new Error('Enemy texture failed: '+required.get(i));
      }
      return img.fallback||extraPickupArt;
    }));
    this.spriteAspects=resolved.map(img=>(img.naturalWidth||img.width||1)/(img.naturalHeight||img.height||1));
    this.loadedSpriteLayers=resolved.map((img,i)=>({layer:i,width:img.naturalWidth||img.width,height:img.naturalHeight||img.height}));
    await Promise.all(SAFE_ROOM_POSTER_IMAGES.map(async img=>{if(!img.complete){try{await img.decode();}catch(e){/* draw fallback poster */}}}));
    const walls=[wallTexture,metalTexture,finalWallTexture,pigWallTexture,doorOpenTexture,doorTexture,doorShutImg];
    await Promise.all(HD_WALL_PATHS.slice(0,2).map(async (path,i)=>{
      try{walls[i]=await loadHdAlbedo(path,512,1024);}catch{/* Keep the procedural fallback when offline assets are damaged. */}
    }));
    walls.forEach((tex,i)=>this.uploadCanvasLayer(this.wallTexture,tex,GPU_WALL_W,GPU_WALL_H,i));
    SAFE_ROOM_POSTER_IMAGES.forEach((img,index)=>{const off=document.createElement('canvas');off.width=GPU_WALL_W;off.height=GPU_WALL_H;const g=off.getContext('2d');g.fillStyle='#080506';g.fillRect(0,0,off.width,off.height);if(img&&img.complete&&img.naturalWidth){const ratio=Math.max(off.width/img.naturalWidth,off.height/img.naturalHeight);const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;g.drawImage(img,(off.width-w)/2,(off.height-h)/2,w,h)}else{g.fillStyle='#7b5a4b';g.fillRect(0,0,off.width,off.height)}this.device.queue.copyExternalImageToTexture({source:off},{texture:this.wallTexture,origin:[0,0,7+index]},[off.width,off.height,1]);});
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
    if(hazardArt instanceof HTMLImageElement){try{await hazardArt.decode();}catch(e){}}
    this.uploadCanvasLayer(this.decalTexture,hazardArt.naturalWidth?hazardArt:(hazardArt.fallback||hazardArt),GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,1);
    resolved.forEach((source,i)=>this.uploadCanvasLayer(this.spriteTexture,source,GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,i));
  }
  async buildModels(){
    this.modelShadows=new CatroomsModelShadows(this.device);
    const shadowData=[];
    for(const kind of ['campfire','slot','tree','rock','door',...Object.keys(WORLD_ITEM_KINDS),...Object.keys(DECOR_MODELS)]){
      const mesh=await AssetManager.mesh(kind);
      const vertexBuffer=this.device.createBuffer({size:mesh.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
      const indexBuffer=this.device.createBuffer({size:mesh.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});
      this.device.queue.writeBuffer(vertexBuffer,0,mesh.vertexData);
      this.device.queue.writeBuffer(indexBuffer,0,mesh.indexData);
      this.modelMeshes[kind]={vertexBuffer,indexBuffer,indexCount:mesh.indices};
      if(WORLD_ITEM_TILTS[kind]){
        const vertices=new Float32Array(mesh.vertexData.buffer,mesh.vertexData.byteOffset,mesh.vertices*11);
        this.modelMeshes[kind].groundPoses=WORLD_ITEM_TILTS[kind].map(tilt=>{
          const c=Math.cos(tilt),s=Math.sin(tilt);
          let bottom=Infinity;
          for(let i=0;i<vertices.length;i+=11)bottom=Math.min(bottom,vertices[i+1]*s+vertices[i+2]*c);
          return {c,s,z:-bottom*WORLD_ITEM_SCALE[kind]};
        });
      }
      if(kind!=='campfire'&&!WORLD_ITEM_KINDS[kind])this.modelShadows.meshes[kind]=addShadowMesh(shadowData,mesh);
    }
    this.modelShadows.initialize(shadowData);
    this.meshAlbedoTextures={};
    await Promise.all(Object.entries({slot:MODEL_SLOT_ALBEDO_PNG,rock:MODEL_ROCK_ALBEDO,decor:DECOR_ALBEDO,pickup:MODEL_BATTERY_ALBEDO,shield:MODEL_SHIELD_ALBEDO,drink:MODEL_DRINK_ALBEDO,terminal:MODEL_TERMINAL_ALBEDO}).map(async ([kind,src])=>{
      const image=new Image();
      image.src=src;
      await image.decode();
      const size=[image.naturalWidth,image.naturalHeight];
      const texture=this.device.createTexture({size,format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
      this.device.queue.copyExternalImageToTexture({source:image},{texture},[...size,1]);
      this.meshAlbedoTextures[kind]=texture;
    }));
  }
  toggleHdMaterials(){
    if(!this.hdMaterials)return false;
    this.hdEnabled=!this.hdEnabled;this.materialRevision++;this.needsRender=true;
    this.terrainBind=this.device.createBindGroup({layout:this.terrainPipeline.getBindGroupLayout(0),entries:this.terrainBindings()});
    return this.hdEnabled;
  }
  terrainBindings(){return [
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:{buffer:this.mapBuffer}},
      {binding:2,resource:(this.hdEnabled?this.hdMaterials.wall:this.wallTexture).createView({dimension:'2d-array'})},{binding:3,resource:this.sampler},
      {binding:4,resource:(this.hdEnabled?this.hdMaterials.floor:this.floorTexture).createView({dimension:'2d-array'})},{binding:5,resource:this.sampler},
      {binding:6,resource:{buffer:this.decalCellsBuffer}},{binding:7,resource:{buffer:this.decalDataBuffer}},
      {binding:8,resource:this.decalTexture.createView({dimension:'2d-array'})},{binding:9,resource:this.spriteSampler},
      {binding:10,resource:{buffer:this.furnitureBuffer}},
      {binding:12,resource:(this.hdEnabled&&this.surfaceDetails?this.surfaceDetails:this.wallTexture).createView({dimension:'2d-array'})},
      {binding:13,resource:{buffer:this.modelShadows.buffer}}
    ];}
  resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.35)*gameSettings.quality;
    // Apply a single uniform scale to both dimensions. Independent width/height
    // clamps warped the image when pitch changed, especially on mobile.
    const scale=Math.min(dpr*.90,1700/Math.max(1,innerWidth),1000/Math.max(1,innerHeight));
    W=Math.max(1,Math.round(innerWidth*scale));
    H=Math.max(1,Math.round(innerHeight*scale));
    if(W===this.lastWidth && H===this.lastHeight)return;
    this.lastWidth=W;this.lastHeight=H;this.needsRender=true;
    C.width=W;C.height=H;
    this.context.configure({device:this.device,format:this.format,alphaMode:'opaque'});
    this.post?.resize(W,H);
    if(this.distanceTexture)this.distanceTexture.destroy();
    this.distanceTexture=this.device.createTexture({size:[W,H],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
    if(this.meshDepthTexture)this.meshDepthTexture.destroy();
    this.meshDepthTexture=this.device.createTexture({size:[W,H],format:'depth24plus',usage:GPUTextureUsage.RENDER_ATTACHMENT});
    this.terrainBind=this.device.createBindGroup({layout:this.terrainPipeline.getBindGroupLayout(0),entries:this.terrainBindings()});
    this.spriteBind=this.device.createBindGroup({layout:this.spritePipeline.getBindGroupLayout(0),entries:[
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:this.distanceTexture.createView()},
      {binding:2,resource:this.spriteTexture.createView({dimension:'2d-array'})},{binding:3,resource:this.spriteSampler},
      {binding:4,resource:{buffer:this.spriteBuffer}},{binding:5,resource:{buffer:this.mapBuffer}},
      {binding:6,resource:{buffer:this.modelShadows.buffer}}
    ]});
    this.rushMeshBinds={};
    for(const [kind,buffers] of Object.entries(this.rushPoseBuffers)){
      const albedo=(this.meshAlbedoTextures[kind]??this.meshAlbedoTextures.slot).createView();
      this.rushMeshBinds[kind]=buffers.map(buffer=>this.device.createBindGroup({
        layout:this.meshPipeline.getBindGroupLayout(0),entries:[
          {binding:0,resource:{buffer:this.frameBuffer}},
          {binding:1,resource:{buffer}},
          {binding:2,resource:albedo},
          {binding:3,resource:this.spriteSampler},
          {binding:4,resource:this.distanceTexture.createView()},{binding:5,resource:{buffer:this.mapBuffer}},
          {binding:6,resource:{buffer:this.modelShadows.buffer}}
        ]}));
    }
  }
  collectSprites(camera=captureRenderCamera()){
    const sprites=[];
    for(const f of gameSession.fuses)if(!f.taken&&!objectivePickupModel(f))sprites.push({kind:'fuse',x:f.x,y:f.y,phase:f.phase||0});
    if(gameSession.level===1&&gameSession.awake){const p=gameSession.renderPosition(gameSession.cat);sprites.push({kind:'cat',x:p.x,y:p.y,frozen:!!gameSession.cat.frozen});}
    for(const a of coop.avatarSprites())sprites.push({kind:'coopAvatar',x:a.x,y:a.y});
    for(const item of gameSession.bonusItems){
      if(!item.taken&&!bonusPickupModel(item))sprites.push({kind:item.type,x:item.x,y:item.y,phase:item.phase});
    }
    for(const guard of gameSession.guards){
      const p=gameSession.renderPosition(guard);
      sprites.push({kind:guard.kind,x:p.x,y:p.y,phase:guard.x,variant:guard.variant||'classic',frozen:!!guard.frozen,size:guard.sizeMultiplier||1});
    }
    for(const item of gameSession.interactables)if(item.type==='hide'||item.type==='stairs')sprites.push({kind:item.type,x:item.x,y:item.y});
    const fuseLayer=renderStage()===1?4:renderStage()===4?6:5;
    const scales={cat:1.19,pig:1.07,watcher:1.38,listener:1.38,fuse:renderStage()===4?.76:.58,terminal:.73,hide:.9,stairs:.78,stamina:.43,shield:.43,key:.42,coopAvatar:.94,hardSlow:.54,hardFreeze:.58,rock:.89,coin:.43,slot:.86,stranger:1.36};
    const sourceAspect=this.spriteAspects||(this.spriteAspects=spriteLayerSources().map(img=>(img.naturalWidth||img.width||1)/(img.naturalHeight||img.height||1)));
    camera=resolveRenderCamera(camera);
    const order=[];this.spriteDiagnostics=[];
    for(const s of sprites){
      const diag=SPRITE_ENEMY_KINDS.has(s.kind)?{kind:s.kind,x:s.x,y:s.y,reason:'pending'}:null;
      if(diag)this.spriteDiagnostics.push(diag);
      const layer=s.kind==='stamina'?16+Math.max(0,Math.min(4,s.energySprite||0)):s.kind==='fuse'?fuseLayer:SPRITE_LAYER[s.kind];
      if(layer==null){if(diag)diag.reason='unknown layer';continue;}
      if(diag)diag.layer=layer;
      const height=scales[s.kind]*(s.size||1),width=height*sourceAspect[layer];
      const bob=(s.kind==='fuse'?(.07+Math.sin(gameSession.elapsed*2.2+(s.phase||0))*.08):s.kind==='cat'?Math.sin(gameSession.elapsed*8)*.03:0);
      const vertical=(s.kind==='fuse'?bob:s.kind==='stamina'||s.kind==='shield'||s.kind==='key'||s.kind==='hardSlow'||s.kind==='hardFreeze'?.15:0);
      const center=cameraCoordinates(camera,s.x,s.y,vertical+height*.5),ty=center.depth;
      if(diag)diag.depth=ty;
      const radius=Math.hypot(width,height)*.5;
      if(!Number.isFinite(ty)||ty+radius<=RENDER_DEPTH.spriteNear||ty-radius>RENDER_DEPTH.spriteFar){if(diag)diag.reason='outside depth range';continue;}
      const hPlane=camera.plane,vPlane=hPlane*H/W;
      if(Math.abs(center.right)>ty*hPlane+radius*Math.hypot(1,hPlane)||Math.abs(center.up)>ty*vPlane+radius*Math.hypot(1,vPlane)){if(diag)diag.reason='offscreen';continue;}
      const left=center.right,top=center.up;
      if(diag)diag.reason='projected';
      order.push({kind:s.kind,diag,layer,ty,left,top,width,height,variant:({red:1,green:2,yellow:3,gray:4,pink:5})[s.variant]||0,frozen:s.frozen?1:0});
    }
    // Preserve enemies first when the atlas instance budget is exhausted, then nearest pickups.
    if(order.length>GPU_MAX_SPRITES){
      order.sort((a,b)=>Number(SPRITE_ENEMY_KINDS.has(b.kind))-Number(SPRITE_ENEMY_KINDS.has(a.kind))||a.ty-b.ty);
      for(let i=GPU_MAX_SPRITES;i<order.length;i++)if(order[i].diag)order[i].diag.reason='sprite budget';
      order.length=GPU_MAX_SPRITES;
    }
    order.sort((a,b)=>b.ty-a.ty); // alpha compositing remains back-to-front
    const data=this.spriteData||(this.spriteData=new Float32Array(GPU_MAX_SPRITES*8));
    for(let i=0;i<order.length;i++){
      const s=order[i],o=i*8;
      data[o]=s.left;data[o+1]=s.top;data[o+2]=s.width;data[o+3]=s.height;data[o+4]=s.layer;data[o+5]=s.ty;data[o+6]=s.variant;data[o+7]=s.frozen;
      if(s.diag)s.diag.reason='submitted (GPU occlusion not measured)';
    }
    return data.subarray(0,order.length*8);
  }
  syncStaticBuffers(scene=gameSession){
    const upload=(buffer,data)=>{this.device.queue.writeBuffer(buffer,0,data);this.stats.staticBytes+=data.byteLength;};
    if(this.mapSource!==scene.world||this.mapRevision!==scene.worldRevision||this.mapSize!==scene.N||this.roomRevision!==scene.roomLayout?.revision){
      this.tilesData.fill(0);
      for(let y=0;y<scene.N;y++)for(let x=0;x<scene.N;x++){
        const tile=scene.world[y][x];
        this.tilesData[y*128+x]=tile===THIN_SAFE_ROOM_TILE?0:tile;
      }
      this.doorLayout=scene===gameSession?this.makeDoorLayout(scene):[];
      for(const d of this.doorLayout)this.tilesData[d.y*128+d.x]=0;
      // Low byte = visible terrain, bit 8 = opaque model door. Keep the CPU
      // geometry map unchanged; only the GPU visibility map carries the flag.
      this.gpuTilesData.set(this.tilesData);
      const fields=scene.roomLayout?.fields;
      if(fields)for(let y=0;y<scene.N;y++)for(let x=0;x<scene.N;x++)this.gpuTilesData[y*128+x]|=fields[y*scene.N+x];
      for(const d of this.doorLayout){
        const tile=scene.world[d.y][d.x];
        if(tile===3||tile===4)this.gpuTilesData[d.y*128+d.x]|=256;
      }
      upload(this.mapBuffer,this.gpuTilesData);this.stats.mapUploads++;this.mapSource=scene.world;this.mapRevision=scene.worldRevision;this.mapSize=scene.N;this.roomRevision=scene.roomLayout?.revision;
    }
    const furniture=scene.safeRoomFurniture;
    if(this.furnitureSource!==furniture||this.furnitureLength!==furniture.length){
      this.furnitureData.fill(0);let i=0;
      for(const o of furniture){if(o.collisionOnly||i>=64)continue;
        this.furnitureData.set([o.x-o.w/2,o.y-o.d/2,o.z-o.h/2,o.material,o.x+o.w/2,o.y+o.d/2,o.z+o.h/2,0],i++*8);
      }
      this.furnitureCount=i;upload(this.furnitureBuffer,this.furnitureData);this.stats.furnitureUploads++;this.furnitureSource=furniture;this.furnitureLength=furniture.length;
    }
    // Register each decal across its full footprint, including across tile edges.
    // Three 9-bit indices fit in one storage word, with zero reserved for no decal.
    let count=0;
    const addDecal=(p,size,type)=>{
      if(count<GPU_MAX_DECALS)this.decalScratch.set([p.x,p.y,size,type],count++*4);
    };
    for(const p of scene.props){
      if(p.type==='hazard')addDecal(p,p.size||.75,1);
      else if(p.type==='decor'&&p.solid)addDecal(p,Math.min(.72,(p.radius??DECOR_MODELS[p.model].radius)*1.65+.12),2);
    }
    for(const item of scene.fuses||[])if(!item.taken&&objectivePickupModel(item))addDecal(item,.48,3);
    for(const item of scene.bonusItems||[])if(!item.taken&&!item.attachment&&bonusPickupModel(item))addDecal(item,.42,3);
    let changed=this.decalWorld!==scene.world||this.decalCount!==count;
    for(let i=0;!changed&&i<count*4;i++)if(this.decalScratch[i]!==this.decalData[i])changed=true;
    if(changed){
      this.decalGridData.fill(0);this.decalData.fill(0);this.decalData.set(this.decalScratch.subarray(0,count*4));
      for(let i=0;i<count;i++){
        const [x,y,size,type]=this.decalData.subarray(i*4,i*4+4);
        const radius=Math.max(.1,size*.67);
        for(let row=Math.max(0,Math.floor(y-radius));row<=Math.min(scene.N-1,Math.floor(y+radius));row++){
          for(let col=Math.max(0,Math.floor(x-radius));col<=Math.min(scene.N-1,Math.floor(x+radius));col++){
            const key=row*128+col,packed=this.decalGridData[key];
            let shift=0;
            while(shift<27&&((packed>>>shift)&511)!==0)shift+=9;
            if(shift<27)this.decalGridData[key]=packed|((i+1)<<shift);
            // Keep dangerous puddles visible even when several effects share a cell.
            else if(type===1)this.decalGridData[key]=(packed&0x3ffff)|((i+1)<<18);
          }
        }
      }
      upload(this.decalCellsBuffer,this.decalGridData);upload(this.decalDataBuffer,this.decalData);this.stats.decalUploads++;this.decalCount=count;this.decalWorld=scene.world;
    }
  }
  makeDoorLayout(scene){
    // The model replaces only Yellow Corridors doors. Other sectors retain their old textures.
    const yellow=scene.level!==12&&renderStage()===1;
    const doors=[];
    const rooms=scene.level===12?(scene.rushSafeRooms||[]).filter(r=>r.rushSector===1):yellow&&scene.safeRoom?[scene.safeRoom]:[];
    for(const room of rooms){
      const x=room.doorX,y=room.doorY;
      const dx=room.centerX-(x+.5),dy=room.centerY-(y+.5);
      // Local +Y points into the room; local +X is the hinge edge.
      const yaw=Math.abs(dx)>Math.abs(dy)?(dx>0?-Math.PI/2:Math.PI/2):(dy>0?0:Math.PI);
      doors.push({x,y,yaw,room});
    }
    if(yellow){
      const e=scene.exitCell;
      if(e&&scene.world[e.y]?.[e.x]===3){
        for(const [dx,dy,yaw] of [[0,-1,0],[0,1,Math.PI],[-1,0,-Math.PI/2],[1,0,Math.PI/2]]){
          if(scene.world[e.y+dy]?.[e.x+dx]===0)doors.push({x:e.x,y:e.y,yaw,exit:true,dx,dy});
        }
      }
    }
    return doors;
  }
  doorPoses(camera,caster=false){
    const out=[];
    for(const d of this.doorLayout){
      const visible=caster?Math.hypot(d.x+.5-camera.x,d.y+.5-camera.y)<SHADOW_RECEIVER_RANGE+13:this.modelInView(d.x+.5,d.y+.5,1.7,camera);
      const yaw=d.yaw,c=Math.cos(yaw),s=Math.sin(yaw);
      if(d.exit){
        if(!visible)continue;
        const ready=gameSession.player.collected>=gameSession.GOAL&&gameSession.terminals.every(t=>t.used);
        out.push([d.x+.5-d.dx*.33,d.y+.5-d.dy*.33,0,.92,c,s,4,ready?1:0]);continue;
      }
      const target=d.room.open?1:0,now=gameSession.elapsed;
      let a=this.doorAnimations.get(d.room);
      if(!a){a={target,start:target,time:now};this.doorAnimations.set(d.room,a);}
      const fraction=()=>a.start+(a.target-a.start)*Math.min(1,Math.max(0,(now-a.time)/.24));
      let f=fraction();if(a.target!==target){a.start=f;a.target=target;a.time=now;}
      if(!visible)continue;
      const angle=yaw-f*Math.PI/2,ca=Math.cos(angle),sa=Math.sin(angle);
      // Hold the hinge in place while the imported leaf rotates into the room.
      out.push([d.x+.5+.51*(c-ca),d.y+.5+.51*(s-sa),0,1,ca,sa,4,0]);
    }
    return out.slice(0,16);
  }
  modelInView(x,y,radius=1.2,camera=captureRenderCamera()){
    // Conservative horizontal bounding circle: no geometry is culled while it intersects the frustum.
    camera=resolveRenderCamera(camera);
    const dx=x-camera.x,dy=y-camera.y,{cos,sin,plane}=camera;
    const horizontal=dx*cos+dy*sin,side=Math.abs(-dx*sin+dy*cos);
    // Conservative vertical extent for tall meshes, including ceiling decor.
    const depth=horizontal*Math.cos(camera.pitch),bound=radius+Math.abs(Math.sin(camera.pitch))*2;
    return depth+bound>=RENDER_DEPTH.near&&side<=depth*plane+bound*Math.hypot(1,plane);
  }
  visibleRocks(camera=captureRenderCamera()){
    return gameSession.props.filter(p=>p.type==='rock'&&this.modelInView(p.x,p.y,1,camera)).slice(0,64);
  }
  visibleDecor(camera=captureRenderCamera()){
    // One shared texture/bind layout; distance/frustum culling and a bounded pool.
    // All nearby objects are retained before distant ones, regardless of type.
    return gameSession.props.filter(p=>p.type==='decor'&&Math.hypot(p.x-camera.x,p.y-camera.y)<28&&this.modelInView(p.x,p.y,(p.radius??DECOR_MODELS[p.model].radius)+.1,camera))
      .sort((a,b)=>Math.hypot(a.x-camera.x,a.y-camera.y)-Math.hypot(b.x-camera.x,b.y-camera.y)).slice(0,64);
  }
  visiblePickups(camera){
    const visible=[];
    const add=(item,model,active=false)=>{
      if(!model||!this.modelMeshes[model]||Math.hypot(item.x-camera.x,item.y-camera.y)>28||
        !this.modelInView(item.x,item.y,model==='terminal'?.65:.35,camera))return;
      visible.push({item,model,active,pool:worldItemPool(model)});
    };
    for(const item of gameSession.fuses)if(!item.taken)add(item,objectivePickupModel(item));
    for(const item of gameSession.bonusItems)if(!item.taken)add(item,bonusPickupModel(item));
    for(const item of gameSession.terminals)add(item,'terminal');
    for(const item of gameSession.emergencyReactors||[])add(item,'terminal',gameSession.hardEmergency?.reactor===item);
    const counts={};
    visible.sort((a,b)=>Math.hypot(a.item.x-camera.x,a.item.y-camera.y)-Math.hypot(b.item.x-camera.x,b.item.y-camera.y));
    return visible.filter(entry=>{
      const {pool}=entry;
      entry.index=counts[pool]??0;
      counts[pool]=entry.index+1;
      return entry.index<MESH_POSE_COUNTS[pool];
    });
  }
  worldItemPose({item,model,active}){
    const poses=this.modelMeshes[model].groundPoses;
    const phase=item.phase||0;
    const {c,s,z}=poses[Math.floor(phase*1000)%poses.length];
    const yaw=model==='terminal'?(item.yaw??Math.PI):phase;
    return [item.x,item.y,z+(item.z||0),WORLD_ITEM_SCALE[model],Math.cos(yaw),Math.sin(yaw),WORLD_ITEM_KINDS[model],
      active?2:item.used?1:0,c,s,0,0];
  }
  roomPose(room,kind){
    if(kind==='campfire')return [room.fireX,room.fireY,0,.68,1,0,0,0];
    const slot=kind==='slot';
    const yaw=(slot?room.machineYaw:room.treeYaw)||0;
    return [slot?room.machineX:room.treeX,slot?room.machineY:room.treeY,0,slot?.78:.64,Math.cos(yaw),Math.sin(yaw),slot?1:2,0];
  }
  rockPose(rock){
    const angle=rock.phase||0;
    return [rock.x,rock.y,0,rock.size||1,Math.cos(angle),Math.sin(angle),3,0];
  }
  decorPose(prop){
    const tilt=prop.tilt||0;
    return [prop.x,prop.y,prop.z,prop.size,Math.cos(prop.yaw),Math.sin(prop.yaw),5,prop.stage,Math.cos(tilt),Math.sin(tilt),0,0];
  }
  syncShadowCasters(camera,rooms){
    // Keep casters beyond the receiver range and include off-screen props.
    // Quantizing the center avoids rebuilding the tree on each camera move.
    const x=Math.floor(camera.x/2)*2+1,y=Math.floor(camera.y/2)*2+1;
    const squared=(pose)=>(pose[0]-x)**2+(pose[1]-y)**2;
    const casters=[];
    const add=(model,pose)=>{
      if(Number.isFinite(pose[0])&&Number.isFinite(pose[1])&&squared(pose)<25**2)casters.push({model,pose});
    };
    for(const room of rooms)for(const kind of ['slot','tree'])add(kind,this.roomPose(room,kind));
    for(const pose of this.doorPoses(camera,true))add('door',pose);
    for(const prop of gameSession.props){
      if(prop.type==='decor')add(prop.model,this.decorPose(prop));
      else if(prop.type==='rock')add('rock',this.rockPose(prop));
    }
    if(casters.length>SHADOW_INSTANCE_LIMIT){
      casters.sort((a,b)=>squared(a.pose)-squared(b.pose));
      casters.length=SHADOW_INSTANCE_LIMIT;
    }
    this.modelShadows.sync(casters);
  }
  writePose(kind,index,values){
    if(values.length===8)values=[...values,1,0,0,0];
    const key=kind+index,old=this.poseCache.get(key);
    if(old&&values.every((v,i)=>v===old[i]))return;
    this.device.queue.writeBuffer(this.rushPoseBuffers[kind][index],0,new Float32Array(values));
    this.poseCache.set(key,values);
  }
  encodeTerrain(encoder,colorView){
    const geometry=this.worldGeometry?.enabled?this.worldGeometry:null;
    if(geometry)geometry.encode(encoder);
    const terrain=encoder.beginRenderPass({colorAttachments:[
      {view:colorView,loadOp:'clear',storeOp:'store',clearValue:{r:.07,g:.07,b:.05,a:1}},
      {view:this.distanceTexture.createView(),loadOp:'clear',storeOp:'store',clearValue:{r:1,g:0,b:0,a:1}}
    ]});
    terrain.setPipeline(geometry?geometry.resolvePipeline:this.terrainPipeline);
    terrain.setBindGroup(0,geometry?geometry.resolveBind:this.terrainBind);
    terrain.draw(6);terrain.end();
    this.stats.wallTriangles=geometry?geometry.wallVertexCount/3:0;
    this.stats.planeTriangles=geometry?geometry.planeVertexCount/3:0;
  }
  encodePost(encoder,output,scene,time){
    if(!this.post)return;
    if(this.postScene!==scene){
      this.postScene=scene;
      this.post.reset=true;this.post.lastTime=null;
    }
    this.post.encode(encoder,output,true,time??performance.now());
  }
  renderMenu(time){
    if(!this.lastWidth)return;
    if(!this.menuScene){const N=49,world=Array.from({length:N},()=>Array(N).fill(1));
      for(let x=1;x<N-1;x++)for(let y=19;y<=23;y++)world[y][x]=0;
      for(let x=5;x<N-4;x+=8)for(let y=14;y<=28;y++)for(let xx=x;xx<x+3;xx++)world[y][xx]=0;
      this.menuScene={N,world,worldRevision:-1,props:[],safeRoomFurniture:[]};}
    this.needsRender=false;this.stats.frames++;this.stats.triangles=0;this.stats.sprites=0;this.stats.wallTriangles=0;this.stats.planeTriangles=0;this.syncStaticBuffers(this.menuScene);
    const t=time/1000, phase=(t*.55)%36;
    const frame=this.frameData;
    frame.set([4+phase,21.5+Math.sin(t*.55)*.18,Math.sin(t*.35)*.035,t],RENDER_FRAME.player);
    frame.set([W,H,this.menuScene.N,1],RENDER_FRAME.viewport);
    frame.set([0,0,0,-1],RENDER_FRAME.progress);
    frame.set([1,1,100,0],RENDER_FRAME.visuals);
    frame.set([0,0,0,.035],RENDER_FRAME.weather);
    frame.set([Math.tan(75*Math.PI/360),0,0,0],RENDER_FRAME.camera);
    frame.set([this.lightingEnabled?(this.wallShadowsEnabled?2:1):0,0,0,0],RENDER_FRAME.lighting);
    frame.fill(0,RENDER_FRAME.flashlight);
    frame[RENDER_FRAME.shadows]=Number(this.softShadowsEnabled);
    this.flashlightState=null;
    this.device.queue.writeBuffer(this.frameBuffer,0,frame);
    const encoder=this.device.createCommandEncoder({label:'Menu corridor'});
    const output=this.context.getCurrentTexture().createView();
    this.encodeTerrain(encoder,this.post?this.post.scene.createView():output);
    this.encodePost(encoder,output,this.menuScene,time);
    this.device.queue.submit([encoder.finish()]);
  }
  render(){
    if(!this.lastWidth)return;
    this.needsRender=false;this.stats.frames++;this.stats.triangles=0;
    this.syncStaticBuffers();
    const frame=this.frameData,camera=captureRenderCamera();
    frame.set([camera.x,camera.y,camera.angle,gameSession.elapsed],RENDER_FRAME.player);
    frame.set([W,H,gameSession.N,gameSession.level===12?12:renderStage()],RENDER_FRAME.viewport);
    frame.set([gameSession.player.collected||0,gameSession.GOAL,gameSession.terminals.filter(t=>t.used).length,gameSession.terminals.length],RENDER_FRAME.progress);
    frame.set([gameSession.player.flash?1:0,(gameSession.player.hp??100)/100,gameSession.nearCat<0?100:gameSession.nearCat,Math.max(0,gameSession.flashUntil-gameSession.elapsed)],RENDER_FRAME.visuals);
    frame.set([gameSession.level===3&&gameSession.eventState?.kind==='blackout'?1:0,gameSession.level===3&&gameSession.eventState?.kind==='fog'?1:0,rageMode?1:0,camera.pitch],RENDER_FRAME.weather);
    frame.set([camera.plane,isHardMode()?1:0,isHardMode()&&gameSession.guards.some(g=>g.state==='chase'&&!g.frozen)?1:0,this.furnitureCount],RENDER_FRAME.camera);
    const lightRooms=gameSession.level===12?bossRushRooms():gameSession.safeRoom?[gameSession.safeRoom]:[];
    let fire=null,fireDistance=144;
    for(const room of lightRooms){
      const distance=(camera.x-room.fireX)**2+(camera.y-room.fireY)**2;
      if(distance<fireDistance){fire=room;fireDistance=distance;}
    }
    this.flashlightState=sampleFlashlight(this.flashlightState,gameSession.player,camera,gameSession.elapsed,gameSession.walkPhase||0);
    frame.set([this.flashlightState.yaw,this.flashlightState.pitch,this.flashlightState.intensity,this.flashlightEnabled?1:0],RENDER_FRAME.flashlight);
    frame.set([this.lightingEnabled?(this.wallShadowsEnabled?2:1):0,fire?.fireX||0,fire?.fireY||0,fire?1:0],RENDER_FRAME.lighting);
    const castsFromModels=this.modelShadows&&this.modelShadowsEnabled&&
      (this.lightingEnabled||(this.flashlightEnabled&&this.flashlightState.intensity>.001));
    if(castsFromModels)this.syncShadowCasters(camera,lightRooms);
    frame[RENDER_FRAME.shadows]=Number(this.softShadowsEnabled);
    frame[RENDER_FRAME.shadows+1]=castsFromModels?this.modelShadows.count:0;
    this.device.queue.writeBuffer(this.frameBuffer,0,frame);
    const sprites=this.collectSprites(camera);this.stats.sprites=sprites.length/8;
    if(sprites.length)this.device.queue.writeBuffer(this.spriteBuffer,0,sprites);
    const encoder=this.device.createCommandEncoder({label:'Catrooms WebGPU frame'});
    const output=this.context.getCurrentTexture().createView();
    const colorView=this.post?this.post.scene.createView():output;
    this.encodeTerrain(encoder,colorView);
    // Actual indexed triangles imported from the supplied GLBs, fixed in world
    // coordinates. No billboard rotation, and fragments hide behind walls.
    const rooms=[];
    if(gameSession.level!==12&&gameSession.safeRoom&&Math.hypot(camera.x-gameSession.safeRoom.centerX,camera.y-gameSession.safeRoom.centerY)<23)rooms.push(gameSession.safeRoom);
    if(gameSession.level===12)rooms.push(...bossRushRooms().filter(r=>Math.hypot(camera.x-r.centerX,camera.y-r.centerY)<23).slice(0,3));
    const rocks=this.visibleRocks(camera);
    const doors=this.doorPoses(camera);
    const decor=this.visibleDecor(camera);
    const pickups=this.visiblePickups(camera);
    const drawMeshes=!!((rooms.length||rocks.length||doors.length||decor.length||pickups.length)&&this.modelMeshes.slot&&this.modelMeshes.campfire&&this.modelMeshes.tree&&this.modelMeshes.rock&&this.modelMeshes.door);
    if(drawMeshes){
      for(let i=0;i<rooms.length;i++)for(const kind of ['slot','campfire','tree']){
        const pose=this.roomPose(rooms[i],kind);
        if(Number.isFinite(pose[0])&&Number.isFinite(pose[1]))this.writePose(kind,i,pose);
      }
      for(let i=0;i<rocks.length;i++)this.writePose('rock',i,this.rockPose(rocks[i]));
      for(let i=0;i<doors.length;i++)this.writePose('door',i,doors[i]);
      for(let i=0;i<decor.length;i++)this.writePose('decor',i,this.decorPose(decor[i]));
      for(const entry of pickups)this.writePose(entry.pool,entry.index,this.worldItemPose(entry));
      const meshPass=encoder.beginRenderPass({label:'Imported world meshes',
        colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}],
        depthStencilAttachment:{view:this.meshDepthTexture.createView(),depthLoadOp:'clear',depthClearValue:1,depthStoreOp:'store'}});
      meshPass.setPipeline(this.meshPipeline);
      for(let i=0;i<rooms.length;i++)for(const kind of ['slot','campfire','tree']){
        const room=rooms[i],x=kind==='slot'?room.machineX:kind==='tree'?room.treeX:room.fireX,y=kind==='slot'?room.machineY:kind==='tree'?room.treeY:room.fireY;
        if(kind==='tree'&&(!Number.isFinite(x)||!Number.isFinite(y)))continue;
        if(!this.modelInView(x,y,1.2,camera))continue;
        const mesh=this.modelMeshes[kind];
        meshPass.setBindGroup(0,this.rushMeshBinds[kind][i]);
        meshPass.setVertexBuffer(0,mesh.vertexBuffer);
        meshPass.setIndexBuffer(mesh.indexBuffer,'uint32');
        meshPass.drawIndexed(mesh.indexCount);this.stats.triangles+=mesh.indexCount/3;
      }
      const rockMesh=this.modelMeshes.rock;
      if(rocks.length){meshPass.setVertexBuffer(0,rockMesh.vertexBuffer);meshPass.setIndexBuffer(rockMesh.indexBuffer,'uint32');
        for(let i=0;i<rocks.length;i++){meshPass.setBindGroup(0,this.rushMeshBinds.rock[i]);meshPass.drawIndexed(rockMesh.indexCount);this.stats.triangles+=rockMesh.indexCount/3;}}
      if(doors.length){const m=this.modelMeshes.door;meshPass.setVertexBuffer(0,m.vertexBuffer);meshPass.setIndexBuffer(m.indexBuffer,'uint32');
        for(let i=0;i<doors.length;i++){meshPass.setBindGroup(0,this.rushMeshBinds.door[i]);meshPass.drawIndexed(m.indexCount);this.stats.triangles+=m.indexCount/3;}}
      // Group by mesh without changing per-instance pose indices.
      let meshKind=null;
      for(const {p,i} of decor.map((p,i)=>({p,i})).sort((a,b)=>a.p.model.localeCompare(b.p.model))){
        const m=this.modelMeshes[p.model];
        if(meshKind!==p.model){meshPass.setVertexBuffer(0,m.vertexBuffer);meshPass.setIndexBuffer(m.indexBuffer,'uint32');meshKind=p.model;}
        meshPass.setBindGroup(0,this.rushMeshBinds.decor[i]);meshPass.drawIndexed(m.indexCount);this.stats.triangles+=m.indexCount/3;
      }
      for(const {index,model,pool} of pickups){
        const mesh=this.modelMeshes[model];
        meshPass.setBindGroup(0,this.rushMeshBinds[pool][index]);
        meshPass.setVertexBuffer(0,mesh.vertexBuffer);
        meshPass.setIndexBuffer(mesh.indexBuffer,'uint32');
        meshPass.drawIndexed(mesh.indexCount);this.stats.triangles+=mesh.indexCount/3;
      }
      meshPass.end();
    }
    if(sprites.length){
      const pass=encoder.beginRenderPass({colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}],
        depthStencilAttachment:{view:this.meshDepthTexture.createView(),depthLoadOp:drawMeshes?'load':'clear',depthClearValue:1,depthStoreOp:'discard'}});
      pass.setPipeline(this.spritePipeline);pass.setBindGroup(0,this.spriteBind);pass.draw(6,sprites.length/8);pass.end();
    }
    this.encodePost(encoder,output,gameSession.world);
    this.device.queue.submit([encoder.finish()]);
  }
}

let gpuRenderer=null;
window.CatroomsGraphicsStatus={backend:'initializing',error:null};
async function initGraphics(){
 if(!navigator.gpu)throw new Error('This version requires WebGPU. Open it in an up-to-date Chrome or Edge with WebGPU enabled.');
 window.CatroomsLoadingProgress?.(42,'CHECKING GRAPHICS ADAPTER...');
 const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
 if(!adapter)throw new Error('No WebGPU adapter was found.');
 const device=await adapter.requestDevice();
 const format=navigator.gpu.getPreferredCanvasFormat();
 device.pushErrorScope('validation');
 let post=null,postError=null;
 try{post=new CatroomsPostProcessing(device,format);const report=await post.shader.getCompilationInfo();const errors=report.messages.filter(m=>m.type==='error');if(errors.length)throw Error(errors.map(m=>m.message).join('; '));}catch(e){postError=String(e.message||e);post=null;}
 const postValidation=await device.popErrorScope();if(postValidation){postError=postValidation.message;post=null;}
 if(postError)console.warn('CP08 post-processing disabled:',postError);
 device.pushErrorScope('validation');
 const renderer=new CatroomsWebGPURenderer(device,null,format,post);
 window.CatroomsLoadingProgress?.(56,'COMPILING WEBGPU SHADERS...');
 const reports=await Promise.all([renderer.terrainShader.getCompilationInfo(),renderer.spriteShader.getCompilationInfo(),renderer.meshShader.getCompilationInfo()]);
 const errors=reports.flatMap(r=>r.messages.filter(m=>m.type==='error').map(m=>m.message));
 const validation=await device.popErrorScope();if(validation)errors.push(validation.message);
 if(errors.length)throw new Error('WebGPU shader error: '+errors.join('; '));
 renderer.worldGeometry=new WorldGeometryExperiment(renderer);
 try{await renderer.worldGeometry.initialize();}catch(e){renderer.worldGeometry.error=String(e.message||e);renderer.worldGeometry.available=false;}
 if(renderer.worldGeometry.error)console.warn('CP10 geometry disabled:',renderer.worldGeometry.error);
 window.CatroomsLoadingProgress?.(69,'DECODING TEXTURES...');
 await renderer.buildTextures();
 window.CatroomsLoadingProgress?.(76,'LOADING HD MATERIALS...');
 try{renderer.hdMaterials=await buildHdMaterials(renderer);renderer.hdEnabled=true;}catch(e){renderer.hdError=String(e.message||e);console.warn('CP04 HD disabled:',renderer.hdError);}
 if(renderer.hdMaterials){try{renderer.surfaceDetails=await buildSurfaceDetails(renderer);}catch(e){renderer.surfaceDetailError=String(e.message||e);console.warn('CP11 surface details disabled:',renderer.surfaceDetailError);}}
 window.CatroomsLoadingProgress?.(85,'LOADING 3D MODELS...');
 await renderer.buildModels();
 const context=C.getContext('webgpu');
 if(!context)throw new Error('WebGPU context unavailable');
 renderer.context=context;gpuRenderer=renderer;
 window.CatroomsGraphicsPreferences?.apply();window.CatroomsSettings?.sync();
 window.CatroomsGraphicsStatus={backend:'webgpu',error:null};
 window.CatroomsPostFX={get available(){return !!renderer.post},get enabled(){return !!renderer.post?.enabled},get passes(){return renderer.post?.passes||0},get error(){return postError}};
 window.CatroomsFlashlight={get enabled(){return renderer.flashlightEnabled},get intensity(){return renderer.flashlightState?.intensity||0}};
 window.CatroomsLighting={get enabled(){return renderer.lightingEnabled},get wallShadows(){return renderer.wallShadowsEnabled},get softShadows(){return renderer.softShadowsEnabled},get modelShadows(){return renderer.modelShadowsEnabled},get activeWallShadows(){return renderer.lightingEnabled&&renderer.wallShadowsEnabled}};
 window.CatroomsPBR={get available(){return !!renderer.surfaceDetails},get enabled(){return !!renderer.surfaceDetails&&renderer.hdEnabled},get error(){return renderer.surfaceDetailError}};
 window.CatroomsMaterials={get available(){return !!renderer.hdMaterials},get enabled(){return renderer.hdEnabled},get error(){return renderer.hdError},get wallSize(){return renderer.hdEnabled?[512,1024]:[128,256]},get floorSize(){return renderer.hdEnabled?[512,512]:[64,64]}};
 window.CatroomsTerrainExperiment={get available(){return renderer.worldGeometry.available},get enabled(){return renderer.worldGeometry.enabled},get error(){return renderer.worldGeometry.error},get wallTriangles(){return renderer.stats.wallTriangles||0},get planeTriangles(){return renderer.stats.planeTriangles||0}};
 device.lost.then(info=>{
  // Ignore notifications from a device that is no longer current.
  if(gpuRenderer!==renderer)return;
  gpuRenderer=null;
  window.CatroomsGraphicsStatus={backend:'webgpu-lost',error:info.message||'Graphics device lost'};
  if(gameSession.state==='playing')pause();
  renderBackendStatus();
  const notice=document.createElement('div');notice.id='graphicsFailure';notice.setAttribute('role','alert');
  notice.style.cssText='position:fixed;inset:auto 20px 20px;z-index:99999;color:#fff;background:#622;padding:12px';
  notice.textContent='WebGPU device lost. Reload the game to restore graphics. Unsaved round progress will be lost. ';
  const button=document.createElement('button');button.textContent='RELOAD';button.onclick=()=>location.reload();notice.appendChild(button);document.body.appendChild(notice);
 });
}
function renderBackendStatus(){
  const el=$('rendererMode');if(!el)return;
  el.textContent=window.CatroomsGraphicsStatus.backend==='webgpu'?'WebGPU · GPU RAYCAST':'WebGPU REQUIRED';
  el.title=window.CatroomsGraphicsStatus.error||'WebGPU';
}
function resize(){if(gpuRenderer)gpuRenderer.resize();}
function render(){
 const renderer=gpuRenderer;
 if(!renderer?.lastWidth||renderer.pendingFrames>=2)return false;
 if(gameSession.state==='menu'){
  if($('pixelSplash').hidden)return false;
  renderer.renderMenu(performance.now());
 }else renderer.render();
 // Keep simulation responsive while a slow adapter finishes its queued work.
 const queue=renderer.device.queue;
 if(queue.onSubmittedWorkDone){
  renderer.pendingFrames++;
  const finished=()=>{renderer.pendingFrames--;};
  queue.onSubmittedWorkDone().then(finished,finished);
 }
 return true;
}


// Nonpersistent, opt-in during gameplay. No changes to save data or game rules.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F8'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer?.worldGeometry)return;
 event.preventDefault();
 const experiment=gpuRenderer.worldGeometry;
 if(!experiment.available){showToast('3D WORLD UNAVAILABLE · CLASSIC RENDERER ACTIVE',3);return;}
 experiment.toggle();window.CatroomsGraphicsPreferences?.capture();
 showToast(experiment.enabled?'3D WORLD GEOMETRY · F8 TO RETURN':'CLASSIC RAYCAST · F8 TO COMPARE',3);
});

// F9 is independent of the F8 wall geometry experiment.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F9'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();
 if(!gpuRenderer.hdMaterials){showToast('HD MATERIALS UNAVAILABLE · CLASSIC ACTIVE',3);return;}
 gpuRenderer.toggleHdMaterials();window.CatroomsGraphicsPreferences?.capture();showToast(gpuRenderer.hdEnabled?(gpuRenderer.surfaceDetails?'HD + PBR · F9 TO COMPARE':'HD MATERIALS · F9 TO COMPARE'):'CLASSIC MATERIALS · F9 TO COMPARE',3);
});

// F10 compares CP05 local lighting without changing game rules or F8/F9.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F10'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.lightingEnabled=!gpuRenderer.lightingEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(gpuRenderer.lightingEnabled?'LIGHTING 2.0 · F10 TO COMPARE':'CLASSIC LIGHTING · F10 TO COMPARE',3);
});

// F7 compares the wall-visibility term independently of F8/F9/F10.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F7'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.wallShadowsEnabled=!gpuRenderer.wallShadowsEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(!gpuRenderer.lightingEnabled?'WALL SHADOWS '+(gpuRenderer.wallShadowsEnabled?'ON':'OFF')+' · ENABLE LIGHTING WITH F10':gpuRenderer.wallShadowsEnabled?'WALL SHADOWS ON · F7 TO COMPARE':'WALL SHADOWS OFF · F7 TO COMPARE',3);
});

// F6 compares the physical beam with the original screen-wide lighting.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F6'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.flashlightEnabled=!gpuRenderer.flashlightEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(gpuRenderer.flashlightEnabled?'FLASHLIGHT 2.0 · F6 TO COMPARE':'CLASSIC FLASHLIGHT · F6 TO COMPARE',3);
});

// F4 compares CP08 with the unprocessed scene. No settings or saves are changed.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F4'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();const p=gpuRenderer.post;if(!p){showToast('POST FX UNAVAILABLE',3);return;}
 p.enabled=!p.enabled;p.reset=true;p.lastTime=null;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(p.enabled?'HDR & BLOOM · F4 TO COMPARE':'CLASSIC COLOR · F4 TO COMPARE',3);
});
