const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});vm.runInContext(['js/graphics/camera.js','js/graphics/decor-data.js','js/gameplay/decor.js',...['shared','terrain','sprites','mesh','world-geometry'].map(n=>'js/graphics/shaders/'+n+'.js')].map(read).join('\n'),ctx);
const get=n=>vm.runInContext(n,ctx),pose=get('looseDecorPose'),specs=get('DECOR_MODELS'),sample=get('sampleFlashlight');
let seed=12345;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)|0)>>>0)/4294967296;
for(const kind of ['box','crt']){
 const b=fs.readFileSync(path.join(root,specs[kind].mesh)),n=b.readUInt32LE(4);
 let sideways=0,upright=0;
 for(let i=0;i<300;i++){
  const p=pose(kind,specs[kind],rng);let minZ=Infinity;
  assert.ok(p.size>=.48&&p.size<=.67);if(p.tilt)sideways++;else upright++;
  for(let j=0;j<n;j++){
   const x=b.readFloatLE(12+j*44),y=b.readFloatLE(16+j*44),z=b.readFloatLE(20+j*44);
   const ry=y*Math.cos(p.tilt)-z*Math.sin(p.tilt),rz=y*Math.sin(p.tilt)+z*Math.cos(p.tilt);
   const xx=p.dx+p.size*(x*Math.cos(p.yaw)-ry*Math.sin(p.yaw));
   const yy=p.dy+p.size*(x*Math.sin(p.yaw)+ry*Math.cos(p.yaw));
   const zz=p.z+p.size*rz;
   assert.ok(Math.abs(xx)<.45&&Math.abs(yy)<.45&&zz>=-.00001&&zz<1,`${kind}: ${xx},${yy},${zz}`);minZ=Math.min(minZ,zz);
  }
  assert.ok(Math.abs(minZ)<.00001,`${kind} floating: ${minZ}`);
 }
 assert.ok(sideways>80&&upright>100);
 console.log(`PASS ${kind}: ${sideways} tipped, ${upright} upright; actual mesh vertices stay on floor and within tile`);
}
const player={flash:true,moving:false},camera={angle:1,pitch:.8};let state=sample(null,player,camera,0,0);
assert.equal(state.intensity,1);assert.equal(state.yaw,1);assert.equal(state.pitch,.8);
player.flash=false;state=sample(state,player,camera,.05,0);assert.ok(state.intensity>0&&state.intensity<1);
for(let i=2;i<=20;i++)state=sample(state,player,camera,i*.05,0);assert.ok(state.intensity<.00001);
player.flash=true;player.moving=true;state=sample(state,player,camera,1.05,2);assert.ok(state.intensity>0&&state.intensity<1&&state.yaw!==1&&Math.abs(state.yaw-1)<.019);
assert.equal(sample(state,{flash:false},camera,0,0).intensity,0);
assert.equal(sample(state,{flash:true,hidden:true},camera,0,0).intensity,0);
for(const name of ['TERRAIN_WGSL','MODEL_WGSL','SPRITES_WGSL']){
 assert.ok(get(name).includes('fn flashlightLight('));assert.ok(get(name).includes('surfaceLighting('));
}
assert.ok(get('geometryTerrainSource()').includes('surfaceLighting(wallPoint'));
assert.match(get('LIGHTING_WGSL'),/wallLightVisible\(p.xy,source.xy/);
assert.match(get('MODEL_WGSL'),/tiltModel\(inNormal\)/);
console.log('PASS spotlight visual state, smooth switching, camera pitch/sway and shared shader contracts');
