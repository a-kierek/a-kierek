const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const renderer=read('js/graphics/webgpu.js');
const method=renderer.slice(renderer.indexOf('  collectSprites('),renderer.indexOf('  syncStaticBuffers(',renderer.indexOf('  collectSprites(')));
const ctx=vm.createContext({});
vm.runInContext(`const img={width:256,height:256};
const catImg=img,pigImg=img,personBImg=img,personAImg=img,fuseImg=img,keycardImg=img,foodImg=img,terminalImg=img,lockerArt=img,stairArt=img,staminaArt=img,shieldArt=img,extraPickupArt=img,coopAvatarArt=img,slowDeviceImg=img,freezeDeviceImg=img,energyDrinkImgs=[img,img,img,img,img],hardRockArt=img,coinSprite=img,slotMachineSprite=img,strangerImg=img;
let level=2,awake=false,cat={},fuses=[],guards=[],terminals=[],interactables=[],bonusItems=[],props=[],hardEmergency=null;
const W=800,H=600,GPU_MAX_SPRITES=256,player={x:0,y:0},elapsed=0;
const renderStage=()=>level,cameraViewAngle=()=>0,cameraPlaneScale=()=>.66,viewPitchOffset=()=>0,isHardMode=()=>false;
${read('js/network/coop.js')}
${read('js/graphics/camera.js')}
${read('js/graphics/shaders/shared.js')}
${renderer.slice(renderer.indexOf("function spriteLayerSources()"),renderer.indexOf("class CatroomsWebGPURenderer"))}
const gameSession={renderPosition:actor=>actor,get level(){return level},set level(v){level=v},get awake(){return awake},set awake(v){awake=v},get cat(){return cat},set cat(v){cat=v},get fuses(){return fuses},set fuses(v){fuses=v},get guards(){return guards},set guards(v){guards=v},get terminals(){return terminals},set terminals(v){terminals=v},get interactables(){return interactables},set interactables(v){interactables=v},get bonusItems(){return bonusItems},set bonusItems(v){bonusItems=v},get props(){return props},set props(v){props=v},get hardEmergency(){return hardEmergency},set hardEmergency(v){hardEmergency=v},get player(){return player},set player(v){player=v},get elapsed(){return elapsed},set elapsed(v){elapsed=v}};
const r={${method}};`,ctx);
const run=src=>vm.runInContext(src,ctx);
assert.equal(run('coop.role'),'solo');assert.equal(run('coop.send({})'),false);assert.equal(run('coop.avatarSprites().length'),0);
for(const level of [1,2,12,13]){
 assert.equal(run(`level=${level};bonusItems=[{type:'coin',x:3,y:0}];r.collectSprites().length`),8);
 assert.equal(run('r.collectSprites()[4]'),22);
}
for(let i=0;i<5;i++)assert.equal(run(`level=2;bonusItems=[{type:'stamina',energySprite:${i},x:3,y:0}];r.collectSprites()[4]`),16+i);
for(const [type,index] of [['shield',11],['key',12],['hardSlow',14],['hardFreeze',15]])assert.equal(run(`bonusItems=[{type:'${type}',x:3,y:0}];r.collectSprites()[4]`),index);
assert.equal(run(`bonusItems=[];guards=[{kind:'stranger',x:3,y:0}];r.collectSprites()[4]`),24);
assert.equal(run(`guards=[];props=[{type:'rock',x:3,y:0}];r.collectSprites().length`),0);
assert.match(renderer,/GPU_SPRITE_SIZE,25\]/);
assert.doesNotMatch(renderer,/\bdecoyArt\b|\bdecoy:/);
console.log('PASS: solo adapter, one coin per item in 4 modes, energy variants, shield/key/devices, stranger/rock, texture layer count.');
