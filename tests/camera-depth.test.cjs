const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx=vm.createContext({});const run=s=>vm.runInContext(s,ctx);
run(`let yaw=0,plane=.66,pitch=0,calls=[0,0,0];const player={x:2.5,y:3.5};
const gameSession={player,renderPosition:p=>({...p})};
const cameraViewAngle=()=>{calls[0]++;return yaw},cameraPlaneScale=()=>{calls[1]++;return plane},viewPitchOffset=()=>{calls[2]++;return pitch};
${read('js/graphics/camera.js')}
${['shared','terrain','sprites','mesh'].map(n=>read('js/graphics/shaders/'+n+'.js')).join('\n')}`);
assert.equal(run('RENDER_FRAME.bytes'),128);assert.equal(run('RENDER_FRAME.floats*4'),128);
assert.equal(run('Object.values(RENDER_FRAME).slice(2).join(",")'),'0,4,8,12,16,20,24,28');
for(const n of ['TERRAIN_WGSL','SPRITES_WGSL','MODEL_WGSL']){
 assert.equal(run(`${n}.includes(FRAME_WGSL)&&${n}.includes(DEPTH_WGSL)`),true);
 assert.match(run(n),/var<uniform> frame:SceneFrame/);
}
assert.match(run('TERRAIN_WGSL'),/distance\/WALL_DEPTH_SCALE/);
for(const n of ['SPRITES_WGSL','MODEL_WGSL'])assert.match(run(n),/\.r\*WALL_DEPTH_SCALE/);
run('let snapshot=captureRenderCamera();yaw=2;plane=.9;pitch=.2;');
assert.equal(run('resolveRenderCamera(snapshot)===snapshot'),true);
assert.equal(run('snapshot.angle'),0);assert.equal(run('snapshot.pitch'),0);assert.equal(run('calls.join(",")'),'1,1,1');
assert.equal(run('resolveRenderCamera(player).angle'),2);
for(const a of [-Math.PI,-1,0,1,Math.PI,2*Math.PI])for(const p of [.36,.66,1.3]){
 const q=run(`yaw=${a};plane=${p};pitch=.3;captureRenderCamera()`);
 assert.equal(q.cos,Math.cos(a));assert.equal(q.sin,Math.sin(a));assert.equal(q.plane,p);assert.equal(q.pitch,.3);
 const px=-q.sin*p,py=q.cos*p,inv=1/(px*q.sin-q.cos*py);
 const dx=3,dy=4,depth=inv*(-py*dx+px*dy);
 assert.ok(Math.abs(depth-(dx*q.cos+dy*q.sin))<1e-12);
}
const d=run('RENDER_DEPTH');
for(const depth of [d.near,.16,1,10,125,d.far]){
 const sprite=d.far/(d.far-d.near)-d.near*d.far/((d.far-d.near)*depth);
 const mesh=((d.far/(d.far-d.near))*depth-d.near*d.far/(d.far-d.near))/depth;
 assert.ok(Math.abs(sprite-mesh)<1e-12);assert.ok(sprite>=-1e-12&&sprite<=1+1e-12);
 assert.equal(depth/d.wallScale*d.wallScale,depth);
}
console.log('PASS shared frame ABI, snapshot consistency, FOV/yaw and matching sprite/mesh depth');
