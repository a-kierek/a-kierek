// Actual renderer methods with a recording WebGPU mock; no claim of WGSL/hardware validation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx=vm.createContext({console});
const run=s=>vm.runInContext(s,ctx,{timeout:30000});
run(`
let decodeCalls=[], uploads=[];
class HTMLImageElement{constructor(w=256,h=256){this.naturalWidth=w;this.naturalHeight=h;this.complete=true;this.src='test';} async decode(){decodeCalls.push(this.src);if(this.fail)throw Error('decode');}}
const Image=HTMLImageElement;
const art={width:256,height:256};
const catImg=new Image(520,492),pigImg=new Image(445,274),personBImg=new Image(336,500),personAImg=new Image(340,247),strangerImg=new Image(713,818);
pigImg.src='chrum.png';
const fuseImg=art,keycardImg=art,foodImg=art,terminalImg=art,lockerArt=art,stairArt=art,staminaArt=art,shieldArt=art,extraPickupArt=art,coopAvatarArt=art,slowDeviceImg=art,freezeDeviceImg=art,energyDrinkImgs=[art,art,art,art,art],hardRockArt=art,coinSprite=art,slotMachineSprite=art;
const GPUBufferUsage={UNIFORM:1,STORAGE:2,COPY_DST:4,VERTEX:8,INDEX:16};const GPUTextureUsage={TEXTURE_BINDING:1,COPY_DST:2,RENDER_ATTACHMENT:4};
const device={createBuffer:()=>({}),createTexture:()=>({}),createSampler:()=>({}),createShaderModule:()=>({}),createRenderPipeline:()=>({}),queue:{writeBuffer:(buffer,offset,data)=>uploads.push({buffer,data:Array.from(data)}),copyExternalImageToTexture:()=>{}}};
const document={createElement:()=>({width:1,height:1,getContext:()=>({fillRect(){},strokeRect(){},clearRect(){},drawImage(){},createImageData(w,h){return {data:new Uint8Array(w*h*4)}},putImageData(){}})})};
const wallTexture=art,metalTexture=art,finalWallTexture=art,pigWallTexture=art,doorOpenTexture=art,doorTexture=art,doorShutImg=art,SAFE_ROOM_POSTER_IMAGES=[],bloodArt=art,hazardArt=art,floorTexture=new Uint8Array(64*64*3),ceilingTexture=floorTexture;
let level=4,awake=false,cat={},fuses=[],guards=[],terminals=[],interactables=[],bonusItems=[],props=[],hardEmergency=null;
let W=800,H=600,N=9,world=Array.from({length:N},(_,y)=>Array.from({length:N},(_,x)=>x===0||y===0||x===N-1||y===N-1?1:0)),worldRevision=0,safeRoomFurniture=[],seen=[];
let player={x:2.5,y:3.5},elapsed=0;
const renderStage=()=>level,cameraViewAngle=()=>0,cameraPlaneScale=()=>.66,viewPitchOffset=()=>0,isHardMode=()=>false;
const coop={avatarSprites:()=>[]},window={};
const THIN_SAFE_ROOM_TILE=9,SAFE_ROOM_WALL_MATERIAL=12;
const gameSession={renderPosition:actor=>actor,get level(){return level},set level(v){level=v},get awake(){return awake},set awake(v){awake=v},get cat(){return cat},set cat(v){cat=v},get fuses(){return fuses},set fuses(v){fuses=v},get guards(){return guards},set guards(v){guards=v},get terminals(){return terminals},set terminals(v){terminals=v},get interactables(){return interactables},set interactables(v){interactables=v},get bonusItems(){return bonusItems},set bonusItems(v){bonusItems=v},get props(){return props},set props(v){props=v},get hardEmergency(){return hardEmergency},set hardEmergency(v){hardEmergency=v},get N(){return N},set N(v){N=v},get world(){return world},set world(v){world=v},get worldRevision(){return worldRevision},set worldRevision(v){worldRevision=v},get safeRoomFurniture(){return safeRoomFurniture},set safeRoomFurniture(v){safeRoomFurniture=v},get seen(){return seen},set seen(v){seen=v},get player(){return player},set player(v){player=v},get elapsed(){return elapsed},set elapsed(v){elapsed=v}};
${read('js/graphics/decor-data.js')}
${read('js/graphics/materials.js')}
${read('js/graphics/camera.js')}
${JSON.parse(read('tools/script-order.json')).filter(p=>p.startsWith('js/graphics/shaders/')).map(read).join('\n')}
${read('js/graphics/webgpu.js')}
${read('js/core/navigation.js')}
const r=new CatroomsWebGPURenderer(device,null,'rgba8unorm');
`);
function test(label,fn){fn();console.log('PASS '+label);}
(async()=>{
 await run(`r.uploadCanvasLayer=(texture,source,w,h,layer)=>{if(texture===r.spriteTexture)uploads.push({layer,source})};r.buildTextures()`);
 test('Chrum decoded even when complete and uploaded to layer 1 with correct aspect',()=>{
   assert.equal(run(`decodeCalls.includes('chrum.png')`),true);
   assert.equal(run(`uploads.some(u=>u.layer===1&&u.source===pigImg)`),true);
   assert.equal(run('r.spriteAspects[1]'),445/274);
 });
 test('Chrum projected in normal, hard, custom, Boss Rush and admin Level 1',()=>{
   for(const level of [1,4,9,10,11,12,13]){
     assert.equal(run(`level=${level};guards=[{kind:'pig',x:5.5,y:3.5}];r.collectSprites()[4]`),1);
     assert.equal(run(`r.spriteDiagnostics[0].reason.startsWith('submitted')`),true);
   }
 });
 test('enemy prioritized under sprite pressure, nearest pickups retained, back-to-front compositing',()=>{
   run(`level=4;guards=[{kind:'pig',x:6,y:3.5}];bonusItems=Array.from({length:350},(_,i)=>({type:'coin',x:3.5+i/30,y:3.5}));let collected=r.collectSprites();`);
   assert.equal(run('collected.length'),256*8);
   assert.equal(run('Array.from({length:256},(_,i)=>collected[i*8+4]).includes(1)'),true);
   assert.equal(run('Array.from({length:255},(_,i)=>collected[i*8+5]>=collected[(i+1)*8+5]).every(Boolean)'),true);
 });
 test('static GPU uploads only when map/furniture/hazard content changes',()=>{
   run('uploads=[];r.syncStaticBuffers()');assert.equal(run('uploads.length'),4);assert.equal(run('r.stats.staticBytes'),137216);
   run('r.syncStaticBuffers()');assert.equal(run('uploads.length'),4);
   run('world[3][4]=4;worldRevision++;r.syncStaticBuffers()');assert.equal(run('uploads.length'),5);assert.equal(run('r.tilesData[3*128+4]'),4);
   run('world[3][4]=0;worldRevision++;r.syncStaticBuffers()');assert.equal(run('uploads.length'),6);assert.equal(run('r.tilesData[3*128+4]'),0);
   run('props=[{type:"hazard",x:3.5,y:3.5,size:.8}];r.syncStaticBuffers()');assert.equal(run('uploads.length'),8);assert.equal(run('r.decalGridData[3*128+3]'),1);
   assert.equal(run('r.decalGridData[3*128+4]'),1,'hazard also indexed on the next tile');
   run('props=props.slice();r.syncStaticBuffers()');assert.equal(run('uploads.length'),8);
   run('props=[];r.syncStaticBuffers()');assert.equal(run('uploads.length'),10);assert.equal(run('r.decalGridData[3*128+3]'),0);
   run('safeRoomFurniture.push({x:3,y:3,z:.5,w:1,d:1,h:1,material:1});r.syncStaticBuffers()');assert.equal(run('uploads.length'),11);assert.equal(run('r.furnitureCount'),1);
   run('world=world.map(row=>row.slice());r.syncStaticBuffers()');assert.equal(run('uploads.length'),14);
 });
 test('closed modeled doors retain GPU shadow flag without terrain geometry',()=>{
   run('r.makeDoorLayout=()=>[{x:4,y:3}];world[3][4]=4;worldRevision++;r.syncStaticBuffers()');
   assert.equal(run('r.tilesData[3*128+4]'),0);assert.equal(run('r.gpuTilesData[3*128+4]'),256);
   assert.equal(run('uploads[uploads.length-1].data[3*128+4]'),256);
   run('world[3][4]=0;worldRevision++;r.syncStaticBuffers()');assert.equal(run('r.gpuTilesData[3*128+4]'),0);
   run('world[3][4]=3;worldRevision++;r.syncStaticBuffers()');assert.equal(run('r.gpuTilesData[3*128+4]'),256);
   run('world[3][4]=0;worldRevision++;delete r.makeDoorLayout;r.syncStaticBuffers()');
 });
 test('mesh pose caching and conservative frustum',()=>{
   run('uploads=[];r.writePose("slot",0,[1,2,0,1,1,0,1,0]);r.writePose("slot",0,[1,2,0,1,1,0,1,0]);');assert.equal(run('uploads.length'),1);
   run('r.writePose("slot",0,[2,2,0,1,1,0,1,0])');assert.equal(run('uploads.length'),2);
   assert.equal(run('r.modelInView(5,3.5)'),true);assert.equal(run('r.modelInView(-5,3.5)'),false);assert.equal(run('r.modelInView(2.5,3.5)'),true);
 });
 test('rocks use a world-mesh pose and never enter the sprite list',()=>{
   run(`level=6;guards=[];bonusItems=[];props=[{type:'rock',x:5.5,y:3.5},{type:'rock',x:-5,y:3.5},{type:'hazard',x:5.5,y:3.5}];`);
   assert.equal(run('r.collectSprites().length'),0);assert.equal(run('r.visibleRocks().length'),1);assert.equal(run('r.rushPoseBuffers.rock.length'),64);
 });
 test('decor uses solid world cells, bounded visibility, shadow cache and mesh draws',()=>{
   run(`level=4;guards=[];bonusItems=[];safeRoomFurniture=[];world[3][4]=5;worldRevision++;props=[{type:'decor',model:'box',x:4.5,y:3.5,z:0,yaw:0,size:1,stage:1,solid:true},{type:'decor',model:'yellowClock',x:5.5,y:3.5,z:.6,yaw:0,size:1,stage:1,solid:false},{type:'decor',model:'box',x:99,y:3.5,z:0,yaw:0,size:1,stage:1,solid:true}];r.syncStaticBuffers();`);
   assert.equal(run('r.visibleDecor().length'),2);assert.equal(run('r.collectSprites().length'),0);assert.equal(run('freeAt(4.5,3.5)'),false);
   assert.equal(run('r.decalData[3]'),2);assert.ok(run('r.decalGridData[3*128+4]>0'));
   run(`let drawn=[];const rageMode=false;const mockPass={setPipeline(){},setBindGroup(){},setVertexBuffer(){},setIndexBuffer(){},draw(){},drawIndexed(n){drawn.push(n)},end(){}};
     device.createCommandEncoder=()=>({beginRenderPass:()=>mockPass,finish:()=>({})});device.queue.submit=()=>{};
     r.context={getCurrentTexture:()=>({createView:()=>({})})};r.distanceTexture=r.meshDepthTexture={createView:()=>({})};r.lastWidth=800;
     for(const k of ['slot','campfire','tree','rock','door',...Object.keys(DECOR_MODELS)])r.modelMeshes[k]={vertexBuffer:{},indexBuffer:{},indexCount:(DECOR_MODELS[k]?.triangles||1)*3};
     r.rushMeshBinds={decor:Array(64).fill({})};r.render();`);
   assert.deepEqual(Array.from(run('drawn')).sort((a,b)=>a-b),[252*3,2260*3]);assert.equal(run('r.stats.triangles'),2512);run('world[3][4]=0;worldRevision++;props=[];');
 });
 test('path workspace reused, bounded hearing and live walls preserved',()=>{
   run('safeRoomFurniture=[];let route=findPath(2,3,6,3),work=navWork;');assert.equal(run('route.length'),4);
   assert.equal(run('navPathDistance(2,3,6,3,3)'),Infinity);assert.equal(run('navPathDistance(2,3,6,3,4)'),4);
   assert.equal(run('navWork===work'),true);assert.equal(run('world[3][4]=4;findPath(2,3,6,3).length'),6);
   assert.equal(run('navWork.epoch=0xffffffff;findPath(2,3,6,3).length'),6);assert.equal(run('navWork.epoch'),1);
 });
 console.log('All Alpha 3 performance regression groups passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
