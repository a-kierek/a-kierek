// Unit tests for the new engine contracts. No legacy global aliases in this context.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx=vm.createContext({console,atob,fetch:async()=>({ok:false,status:404}),setTimeout:()=>0,clearTimeout:()=>{}});
const run=code=>vm.runInContext(code,ctx);
for(const file of ['session','loop','modes','assets'])run(read('js/engine/'+file+'.js'));
function test(label,fn){fn();console.log('PASS '+label);}
test('54 migrated session fields, fresh references and retained mode/progress flags',()=>{
 run(`gameSession.level=12;gameSession.state='paused';gameSession.runCheated=true;gameSession.runTestEntry=true;gameSession.hardEmergency={time:1};gameSession.safeRoom={};gameSession.player={x:5,y:8,coins:9};gameSession.keysOwned.add('old');gameSession.guards.push({});let oldWorld=gameSession.world,oldPlayer=gameSession.player,oldGeneration=gameSession.generation,oldRevision=gameSession.worldRevision;gameSession.resetRound()`);
 assert.equal(run('gameSession.level===12&&gameSession.state==="paused"&&gameSession.runCheated&&gameSession.runTestEntry'),true);
 assert.equal(run('gameSession.player!==oldPlayer&&gameSession.world!==oldWorld&&gameSession.generation===oldGeneration+1&&gameSession.worldRevision===oldRevision+1'),true);
 assert.equal(run('gameSession.hardEmergency===null&&gameSession.safeRoom===null&&gameSession.guards.length===0&&gameSession.keysOwned.size===0&&gameSession.clock===0'),true);
});
test('fixed-step equality at 5, 10, 30, 60, 144 and 240 FPS',()=>{
 for(const fps of [5,10,30,60,144,240]){
  const result=run(`(()=>{const clock=new FixedStepClock();let time=0;for(let i=0;i<${fps};i++)clock.advance(1/${fps},()=>true,dt=>time+=dt);return [clock.ticks,time,clock.alpha]})()`);
  assert.equal(result[0],60);assert.ok(Math.abs(result[1]-1)<1e-9);assert.ok(result[2]<1e-7);
 }
});
test('stall bound, pause and mid-tick termination discard remainder',()=>{
 const result=run(`(()=>{const clock=new FixedStepClock();let active=true;clock.advance(2,()=>active,()=>{});const ticks=clock.ticks,dropped=clock.droppedSeconds;clock.advance(.1,()=>active,()=>{active=false});clock.advance(100,()=>active,()=>{throw Error('paused')});return [ticks,dropped,clock.ticks,clock.alpha]})()`);
 assert.equal(result[0],15);assert.equal(result[1],1.75);assert.equal(result[2],16);assert.equal(result[3],0);
});
test('visual interpolation does not modify collision coordinates; teleport and pause snap',()=>{
 run(`gameSession.state='playing';gameSession.player={x:2,y:3};gameSession.beginStep();gameSession.player.x=2.1;gameSession.endStep();gameSession.renderAlpha=.5;`);
 assert.ok(Math.abs(run('gameSession.renderPosition(gameSession.player).x')-2.05)<1e-9);assert.equal(run('gameSession.player.x'),2.1);
 run('gameSession.player.x=30');assert.equal(run('gameSession.renderPosition(gameSession.player).x'),30);
 run('gameSession.beginStep();gameSession.player.x=30.1;gameSession.endStep();gameSession.state="paused"');assert.equal(run('gameSession.renderPosition(gameSession.player).x'),30.1);
});
test('mode registry and entry mapping preserve all IDs and room policies',()=>{
 assert.equal(run('Object.keys(modeDefinitions).length'),13);
 for(const [target,diff,id] of [[1,'normal',1],[1,'hard',6],[4,'hard',9],[10,'normal',10],[11,'normal',11],[12,'normal',12],[13,'hard',13],[5,'normal',5]])assert.equal(run(`resolveRunEntry(${target},'${diff}').id`),id);
 assert.equal(run('modeFor(12).roomPolicy'), 'owned');assert.equal(run('modeFor(13).roomPolicy'),'optional');assert.equal(run('resolveRunEntry(99,"normal")'),null);
});
test('named timers replace or cancel stale callbacks even if scheduler fires them',()=>{
 const result=run(`(()=>{const callbacks=[],log=[];const timers=new SessionTimers(fn=>{callbacks.push(fn);return callbacks.length-1},()=>{});timers.defer('death',930,()=>log.push('old'));timers.defer('death',930,()=>log.push('new'));callbacks[0]();callbacks[1]();callbacks[1]();timers.defer('transition',700,()=>log.push('cancelled'));timers.clear('transition');callbacks[2]();return log.join(',')})()`);
 assert.equal(result,'new');
});
(async()=>{
 const bytes=fs.readFileSync(path.join(root,'assets/models/campfire-optimized.mesh'));
 const encoded='data:application/octet-stream;base64,'+bytes.toString('base64');ctx.encoded=encoded;
 const mesh=await run(`AssetManager.binary(encoded).then(b=>AssetManager.parseMesh(b,'campfire'))`);
 assert.equal(mesh.indices,1832*3);assert.equal(mesh.vertexData.byteLength+mesh.indexData.byteLength+12,bytes.length);
 await assert.rejects(run(`AssetManager.binary('assets/missing.mesh')`),/HTTP 404/);
 assert.throws(()=>run(`AssetManager.parseMesh(new Uint8Array(3),'invalid')`),/Invalid model/);
 ctx.fetch=async()=>({ok:true,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)});
 const fetched=await run(`AssetManager.binary('assets/models/campfire-optimized.mesh').then(b=>AssetManager.parseMesh(b,'campfire'))`);
 assert.equal(fetched.indices,mesh.indices);assert.deepEqual(Buffer.from(fetched.vertexData),Buffer.from(mesh.vertexData));
 console.log('PASS offline and HTTP binary loading, identical bytes, malformed/missing asset handling');
})().catch(err=>{console.error(err);process.exitCode=1;});
