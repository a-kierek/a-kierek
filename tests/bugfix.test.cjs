// Real gameplay scripts, mocked DOM/audio only; no GPU required.
const assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm'), path=require('node:path');
const root=path.resolve(__dirname,'..');
const elements=new Map(),storage=new Map();
const noop=()=>{};
function element(){return {style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},dataset:{},setAttribute:noop,addEventListener:noop,replaceChildren:noop,querySelector:()=>element(),children:[],textContent:''};}
const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
const ctx=vm.createContext({console,Image:class{},document:{getElementById:get,querySelector:get,body:element(),createTextNode:s=>s,addEventListener:noop},window:{addEventListener:noop},matchMedia:()=>({matches:true}),localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},performance:{now:()=>1000},setTimeout:noop,clearTimeout:noop});
const run=s=>vm.runInContext(s,ctx,{timeout:180000});
run(`let godMode=false,lastShieldToast=-100,touchCrouch=false;
const noop=()=>{};
const setUIIcon=noop,setUIIconText=noop,makeUIIcon=noop,uiIcon=()=>'',stopGameSounds=noop,stopLossScream=noop,playWin=noop,playLossScream=noop,playSting=noop,playHurt=noop,playPickup=noop,playUnlock=noop,playDoorMovement=noop,playReactorRepair=noop,playCoinPickup=noop,playCoinSlot=noop,createGameSample=noop,resetMobileInputs=noop,drawMap=noop;
`);
const scripts=['engine/session','core/state','characters/actors','core/navigation','maps/room-templates','maps/room-system','maps/room-runtime','maps/level1','maps/shared','maps/level2','maps/level3','maps/navigable','maps/level5','characters/ai','gameplay/campaign','progression/streak','gameplay/procedural','gameplay/hard','gameplay/inventory','network/coop','gameplay/safe-room','gameplay/boss-rush','gameplay/custom-mode','graphics/room-model-data','graphics/decor-data','graphics/shaders/shared','graphics/world-geometry','gameplay/decor','engine/modes','engine/loop','ui/interface'];
for(const f of scripts)vm.runInContext(fs.readFileSync(path.join(root,'js',f+'.js'),'utf8'),ctx,{filename:f+'.js'});
// Legacy names are test-only views of the actual session object, for Alpha 2/3 fixtures.
for(const field of ["state", "level", "clock", "elapsed", "worldRevision", "runCheated", "runTestEntry", "world", "player", "guards", "fuses", "doors", "terminals", "props", "bonusItems", "interactables", "seen", "exitCell", "safeRoom", "safeRoomFurniture", "rushSafeRooms", "bossRush", "N", "GOAL", "deathBy", "crouching", "noiseEvents", "eventState", "hardEmergency", "hardRocks", "cat", "walkPhase", "awake", "wakeAt", "nearCat", "alertUntil", "toastTimeout", "flashUntil", "mapOn", "keysOwned", "eventTimer", "cameraFloor", "stats", "guardCallCooldown", "interactReady", "alarmTimer", "guardSight", "guardNoise", "hardSlowUntil", "hardPulseUntil", "hardPulseNext", "hardNextEmergency", "catPath", "pathTimer"])run(`Object.defineProperty(globalThis,'${field}',{get:()=>gameSession.${field},set:v=>{gameSession.${field}=v},configurable:true})`);
function check(name,fn){fn();console.log('PASS '+name);}
const fixture=`N=9;world=Array.from({length:N},(_,y)=>Array.from({length:N},(_,x)=>x===0||y===0||x===N-1||y===N-1?1:0));safeRoomFurniture=[];safeRoom=null;rushSafeRooms=[];level=2;player={x:2.5,y:2.5,hp:100,shieldUntil:0};state='playing';doors=[];guards=[];interactables=[];props=[];elapsed=0;godMode=false;`;
check('fractional cabinet collision, clear nearby floor, movement cannot tunnel',()=>{
 run(fixture+`safeRoomFurniture=[{x:3.5,y:3.5,w:.69,d:.5,material:1}];`);
 assert.equal(run('freeAt(3.5,3.5)'),false);assert.equal(run('freeAt(2.5,3.5)'),true);
 assert.equal(run('lineOfSight(2.5,3.5,4.5,3.5)'),false);
 assert.equal(run('lineOfSight(2.5,2.5,4.5,2.5)'),true);
 assert.equal(run('player.x=2.5;player.y=3.5;move(player,3,0,.22);player.x<3'),true);
});
check('path detours around furniture and reflects live gate changes',()=>{
 assert.equal(run('findPath(2,3,4,3).length'),4);
 assert.equal(run('findPath(2,3,3,3).length'),0);
 assert.equal(run('findPath(-1,3,4,3).length'),0);
 run(fixture+`for(let y=1;y<N-1;y++)world[y][3]=1;world[3][3]=4;`);
 assert.equal(run('findPath(2,3,4,3).length'),0);
 assert.equal(run('world[3][3]=0;findPath(2,3,4,3).length'),2);
});
check('model footprints leave free space around props and block movement and sight across the mesh',()=>{
 run(fixture+`world[3][4]=5;world[4][4]=1;
  const wallBench=wallFloorDecorPose('bench',DECOR_MODELS.bench,[0,1]);
  props=[{type:'decor',model:'bench',x:4.5,y:3.5+wallBench.dy,yaw:wallBench.yaw,solid:true,cellX:4,cellY:3}];
  worldRevision++;`);
 assert.equal(run('freeAt(4.5,3.35,.22)'),true);
 assert.equal(run('freeAt(4.5,3.82,0)'),false);
 assert.equal(run('lineOfSight(3.4,3.35,5.6,3.35)'),true);
 assert.equal(run('lineOfSight(3.4,3.82,5.6,3.82)'),false);
 assert.equal(run('findPath(4,3,3,3,{x:4.5,y:3.35}).length'),1);
 assert.equal(run('player={x:4.5,y:2.7};move(player,0,1.4,.22);player.y<3.5'),true);
 run(fixture+`world[3][4]=5;props=[{type:'rock',x:4.5,y:3.5,size:.62,phase:1.2}];worldRevision++;`);
 assert.equal(run('freeAt(4.01,3.01,0)'),true);
 assert.equal(run('freeAt(4.5,3.5,0)'),false);
 assert.equal(run('props=[];worldRevision++;freeAt(4.01,3.01,0)'),false);
});
check('diagonal walls and interaction target exceptions',()=>{
 run(fixture+`player={x:2.8,y:2.8};world[2][3]=1;world[3][2]=1;interactables=[{type:'panel',x:3.5,y:3.5}];`);
 assert.equal(run('findInteractable()'),null);
 run(fixture+`player.x=2.5;player.y=3.5;world[3][3]=4;doors=[{x:3,y:3,open:false}];`);
 assert.equal(run('findInteractable().type'),'door');
 run(fixture+`player.x=2.5;player.y=3.5;safeRoomFurniture=[{x:3.5,y:3.5,w:.69,d:.5,material:1}];interactables=[{type:'slot',x:3.5,y:3.5}];`);
 assert.equal(run('findInteractable().type'),'slot');
});
check('objective pickups require reach and clear sight, and keep their sector type',()=>{
 run(fixture+`player={x:2.8,y:2.8,collected:0};world[2][3]=1;world[3][2]=1;
  fuses=[{x:3.2,y:3.2}];GOAL=2;terminals=[];noiseEvents=[];`);
 assert.equal(run('interact();Boolean(fuses[0].taken)'),false);
 assert.equal(run('world[2][3]=0;world[3][2]=0;findInteractable().title'),'PICK UP CARD');
 assert.equal(run('player.x=5;findInteractable()'),null);
 assert.equal(run('player.x=2.8;player.collected'),0);
 assert.equal(run('interact();interact();player.collected'),1);
 assert.equal(run('fuses[0].taken && UI.count.textContent===1'),true);
 assert.equal(run(`level=12;bossRush={stage:2};objectivePickupModel({rushSector:1})`),'battery');
 assert.equal(run('objectivePickupModel({rushSector:3})'),null);
 run(fixture+`level=3;fuses=[{x:2.5,y:2.5}];player.collected=0;`);
 assert.equal(run('findInteractable().title'),'PICK UP CORE');
 assert.equal(run('interact();player.collected'),1);
});
check('emergency selects a preplaced reactor and scales the deadline with its route',()=>{
 run('level=6;requestedSeed=2405;reset();state="playing";');
 assert.ok(run('gameSession.emergencyReactors.length>=4'));
 const valid=run(`const reactorMap=gameSession.emergencyReactors;triggerHardEmergency();
  const activeReactor=gameSession.hardEmergency;
  const stepsToReactor=bfsDistances(Math.floor(player.x),Math.floor(player.y))[Math.floor(activeReactor.y)][Math.floor(activeReactor.x)];
  reactorMap.includes(activeReactor.reactor)&&stepsToReactor>=8&&activeReactor.time===Math.ceil(45+REACTOR_HOLD_SECONDS+stepsToReactor/2.3)`);
 assert.equal(valid,true);
 run('finishHardEmergency();gameSession.emergencyReactors=[{x:player.x,y:player.y}];triggerHardEmergency()');
 assert.equal(run('gameSession.hardEmergency'),null);
});
check('Yellow safe-room walls match the door thickness in collision and sight',()=>{
 run(fixture+`safeRoom={left:2,top:2,side:5,doorX:4,doorY:2,open:false};
 for(let y=2;y<7;y++)for(let x=2;x<7;x++)if(x===2||x===6||y===2||y===6)world[y][x]=8;
 world[2][4]=4;installThinSafeRoomWalls(safeRoom);markWorldChanged();`);
 assert.equal(run('world[3][2]'),9);
 assert.equal(run('freeAt(2.78,3.5,.12)&&!freeAt(2.5,3.5,0)'),true);
 assert.equal(run('lineOfSight(1.5,3.5,3.5,3.5)'),false);
 assert.equal(run('safeRoomFurniture.every(w=>Math.min(w.w,w.d)===SAFE_ROOM_WALL_THICKNESS)'),true);
 assert.equal(run('world[2][4]=0;lineOfSight(4.5,1.5,4.5,3.5)'),true);
});
check('shield and god mode, toxic damage, exact expiry, meltdown exception',()=>{
 run(fixture+`props=[{type:'hazard',x:2.5,y:2.5}];player.shieldUntil=12;elapsed=11.99;`);
 assert.equal(run('lose("cat")'),false);assert.equal(run('applyHazardsAndRegen(.02);player.hp'),100);
 assert.equal(run('damageBlocked("meltdown")'),false);
 assert.equal(run('elapsed=12;applyHazardsAndRegen(.02);player.hp'),50);
 assert.equal(run('godMode=true;elapsed=18;applyHazardsAndRegen(.02);player.hp'),50);
 assert.equal(run('godMode=false;elapsed=18;applyHazardsAndRegen(.02)'),true);
 assert.equal(run('state'),'jumpscare');
});
check('safe room cannot close on player or enemy; exact target selected',()=>{
 run(fixture+`safeRoom={left:3,top:2,side:5,doorX:3,doorY:3,open:true};player.x=2.9;player.y=3.5;`);
 assert.equal(run('safeRoomInteraction(safeRoom);safeRoom.open'),true);
 assert.equal(run('player.x=2.3;guards=[{x:3.4,y:3.5}];safeRoomInteraction(safeRoom);safeRoom.open'),true);
 assert.equal(run('guards=[];safeRoomInteraction(safeRoom);safeRoom.open'),false);
 assert.equal(run('world[3][3]'),4);
});
check('admin/custom results do not modify progression, ordinary results do',()=>{
 storage.clear();run(fixture+`winStreak=4;bestStreak=5;level=13;runCheated=false;streakResult(false);`);
 assert.equal(run('winStreak'),4);assert.equal(storage.size,0);
 run(`level=1;runCheated=true;finish(true)`);assert.equal(storage.size,0);assert.equal(run('unlocked2'),false);
 run(`state='playing';level=12;finish(true)`);assert.equal(storage.size,0);
 run(`state='playing';level=6;finish(true)`);assert.equal(storage.size,0);
 run(`state='playing';level=1;runCheated=false;clock=10;finish(true)`);assert.equal(storage.get('catroomsUnlocked2'),'1');assert.equal(storage.get('catroomsWinStreak'),'5');
 const size=storage.size;run('finish(true)');assert.equal(storage.size,size);assert.equal(run('winStreak'),5);
});
check('substeps preserve elapsed time at 10 FPS and stop when state changes',()=>{
 run(`let originalUpdate=update,steps=[];update=dt=>steps.push(dt);state='playing';resetSimulationClock();advanceSimulation(.1);`);
 assert.equal(run('steps.length'),6);assert.ok(Math.abs(run('steps.reduce((a,b)=>a+b,0)')-.1)<1e-9);
 assert.equal(run('steps.every(x=>Math.abs(x-1/60)<1e-10)'),true);
 run(`steps=[];update=dt=>{steps.push(dt);state='end'};state='playing';advanceSimulation(.1);`);
 assert.equal(run('steps.length'),1);run('update=originalUpdate');
});
check('protected room does not reset patrol every update',()=>{
 run(fixture+`safeRoom={left:1,top:1,side:5,doorX:1,doorY:3,open:false};player.x=3.5;player.y=3.5;player.flash=true;let testGuard={kind:'cat',id:'cat',x:7.5,y:6.5,a:0,state:'chase',path:[],pathTimer:0,listenTimer:10,patrolTarget:null};noiseEvents=[];crouching=false;rageMode=false;eventState=null;updateGuard(testGuard,.01);testGuard.patrolTarget={x:7.5,y:2.5};testGuard.pathTimer=10;let savedPatrol=testGuard.patrolTarget;updateGuard(testGuard,.01);`);
 assert.equal(run('testGuard.preyProtected&&testGuard.state==="patrol"&&testGuard.patrolTarget===savedPatrol'),true);
});
check('real map resets: NORMAL, procedural, HARD, Boss Rush and custom',()=>{
 for(const l of [1,2,3,4,5,6,7,8,9,10,11,12,13]){
  run(`level=${l};requestedSeed=12345;reset();`);
  assert.equal(run('world.length===N&&world.every(r=>r.length===N)'),true,`map ${l}`);
  assert.equal(run('freeAt(player.x,player.y,.22)'),true,`spawn ${l}`);
  assert.equal(run('fuses.length===GOAL'),true,`goal ${l}`);
  assert.equal(run("props.some(p=>p.type==='rock')"),false,`rocks ${l}`);
  if(l>=6&&l<=11&&l!==10)assert.ok(run('gameSession.emergencyReactors.length>=4'),`reactor spawns ${l}`);
  run(`state='playing';godMode=true;update(.016);godMode=false;`);
  assert.equal(run('state'), 'playing',`first update ${l}`);
  if(l===12){assert.equal(run('rushSafeRooms.length'),3);assert.equal(run('safeRoomFurniture.filter(o=>o.material===SAFE_ROOM_WALL_MATERIAL).length'),5);assert.equal(run('interactables.filter(o=>o.type==="slot").length'),3);assert.equal(run('bonusItems.filter(o=>o.type==="coin").length'),25);assert.equal(run('bossRush.seed'),12345);}
  else assert.equal(run('rushSafeRooms.length'),0);
 }
 run(`customGameConfig.safeRooms=false;level=13;requestedSeed=12345;reset();`);
 assert.equal(run('safeRoomFurniture.every(o=>o.collisionOnly)'),true);assert.equal(run('safeRoom'),null);assert.equal(run('player.coins'),0);
});
check('room graph validates prerequisites, themes, and two-way maintenance stairs',()=>{
 run(`level=2;reset();state='playing';`);
 assert.equal(run('gameSession.roomLayout.issues.length'),0);
 assert.equal(run('gameSession.roomLayout.floorCount'),2);
 assert.ok(run('gameSession.roomLayout.rooms.some(r=>r.shape!=="rectangle")'));
 assert.ok(run('gameSession.roomLayout.connections.some(c=>c.kind==="alternate")'));
 assert.ok(run('gameSession.roomLayout.connections.some(c=>c.type==="hidden_passage"&&!c.gate.open)'));
 run(`const betaStairs=interactables.find(o=>o.id==="room-stairs-up");player.x=betaStairs.x;player.y=betaStairs.y;interact();updateRoomEnvironment();`);
 assert.equal(run('gameSession.currentRoom.floor'),2);
 run('interact();updateRoomEnvironment()');
 assert.equal(run('gameSession.currentRoom.floor'),1);
 assert.equal(run(`interact();
  const secretLink=gameSession.roomLayout.connections.find(c=>c.type==="hidden_passage");
  player.x=secretLink.gate.x+.5;player.y=secretLink.gate.y-.5;
  const sealed=world[secretLink.gate.y][secretLink.gate.x]===1;
  interact();sealed&&secretLink.gate.open&&world[secretLink.gate.y][secretLink.gate.x]===0`),true);
});
check('Flooded Complex has a fitted basin and a continuous walkway',()=>{
 for(const level of [2,7,12,13]){
  run(`gameSession.level=${level};customGameConfig.stage=2;requestedSeed=12345;reset();`);
  assert.equal(run(`(()=>{
   const room=gameSession.roomLayout.rooms.find(r=>r.template==='pool');
   const {left,top,width,length,bottom,water}=room.basin;
   return bottom<water&&water<0&&world[top][left]===POOL_TILE&&
    !freeAt(left+.5,top+.5,.22)&&freeAt(left-.5,top+.5,.22)&&
    lineOfSight(left-.5,top+.5,left+width+.5,top+.5)&&
    props.some(p=>p.basin&&p.model===(length===5?'poolFive':'poolThree'))&&validateRoomLayout().length===0;
  })()`),true);
 }
 run("customGameConfig.stage=1");
});
check('same seed reproduces map, rooms, furniture, loot and initial enemies',()=>{
 const snapshot=`JSON.stringify({world,fuses,bonusItems,interactables,safeRoomFurniture,guards,rooms:bossRushRooms(),props,reactors:gameSession.emergencyReactors})`;
 for(const l of [1,2,5,6,12]){run(`level=${l};requestedSeed=54321;reset();`);const a=run(snapshot);run(`player.x=20;player.y=20;requestedSeed=54321;reset();`);assert.equal(run(snapshot),a,`seed ${l}`);}
});
// Real map generation regression: remove only our prop tiles, then compare
// every original connected component, including locked gates treated as open.
check('decor preserves components, avoids objectives and covers themed models',()=>{
 const report=run(`(()=>{
  const stats={runs:0,models:0,min:Infinity,max:0,byStage:{},missing:[]};
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  function components(grid){const n=grid.length,ids=new Int32Array(n*n);let id=0;
   for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const start=y*n+x;if(ids[start]||![0,4].includes(grid[y][x]))continue;
    ids[start]=++id;const q=[start];
    for(let h=0;h<q.length;h++){const p=q[h];for(const [dx,dy] of dirs){const xx=p%n+dx,yy=Math.floor(p/n)+dy,j=yy*n+xx;if(xx<0||xx>=n||yy<0||yy>=n||ids[j]||![0,4].includes(grid[yy][xx]))continue;ids[j]=id;q.push(j);}}
   }return ids;
  }
  const scenarios=[];
  for(const l of [1,2,3,4,5,10])scenarios.push([l,12345,1,65,true]);
  for(const l of [6,7,8,9,11,12])for(const k of [0,1,2,7,42,12345,54321,987654321,-1,-2147483648])scenarios.push([l,k,1,65,true]);
  for(const stage of [1,2,3,4,5])for(const size of [49,81,121])for(const rooms of [true,false])scenarios.push([13,42+stage,stage,size,rooms]);
  for(const [l,k,stage,size,rooms] of scenarios){
   gameSession.level=l;customGameConfig.stage=stage;customGameConfig.size=size;customGameConfig.safeRooms=rooms;requestedSeed=k;reset();
   const s=gameSession,p=s.props.filter(x=>x.type==='decor'&&!x.basin&&!x.surface&&!x.landing&&!x.gate);const baseline=s.world.map(r=>r.slice());
   const occupied=new Set();
   for(const o of p){const key=o.cellX+','+o.cellY,spec=DECOR_MODELS[o.model];
    if(occupied.has(key))throw Error('overlap '+key);occupied.add(key);
    if(!spec||!decorModelsFor(o.stage).includes(o.model))throw Error('wrong theme');
    if(s.level===12&&bossRushArea(o.cellX)!==o.stage)throw Error('wrong sector');
    if(o.solid){if(s.world[o.cellY][o.cellX]!==5||spec.radius>.45)throw Error('bad solid');baseline[o.cellY][o.cellX]=0;}
    else{if(s.world[o.cellY][o.cellX]!==0||o.z<0||o.z+spec.height>ROOM_CEILING_HEIGHTS[roomAt(o.x,o.y)?.height??0]+.001)throw Error('bad wall fixture');}
    if(o.model==='bench'||o.model==='pipe'){const dx=Math.round(-Math.sin(o.yaw)),dy=Math.round(Math.cos(o.yaw));if(s.world[o.cellY+dy]?.[o.cellX+dx]!==1)throw Error('missing backing wall');const contact=(o.x-o.cellX-.5)*dx+(o.y-o.cellY-.5)*dy+spec.depth;if(Math.abs(contact-(o.model==='pipe'?.5:.485))>1e-6||!o.solid)throw Error('incorrect wall contact');}
    if([s.player,...s.fuses,...s.terminals,...s.bonusItems.filter(a=>!a.attachment),...s.guards,...s.interactables].some(a=>Math.hypot(a.x-o.cellX-.5,a.y-o.cellY-.5)<1.999))throw Error('reserved item overlap');
    stats.byStage[o.stage]=(stats.byStage[o.stage]||0)+1;
   }
   const a=components(baseline),b=components(s.world),mapping=new Map();
   for(let i=0;i<a.length;i++)if(b[i]){if(mapping.has(a[i])&&mapping.get(a[i])!==b[i])throw Error('disconnected route '+l+' seed '+k);mapping.set(a[i],b[i]);}
   if(!freeAt(s.player.x,s.player.y,.22))throw Error('blocked spawn');
   if(!p.length)throw Error('no decorations '+l+' seed '+k);
   const pools=s.level===12?[1,2,3,4,5]:[renderStage()];
   for(const theme of pools){const found=new Set(p.filter(o=>o.stage===theme).map(o=>o.model));const absent=decorModelsFor(theme).filter(x=>!found.has(x));if(absent.length)stats.missing.push({l,k,theme,absent});}
   stats.runs++;stats.models+=p.length;stats.min=Math.min(stats.min,p.length);stats.max=Math.max(stats.max,p.length);
  }
  return stats;
 })()`);
 console.log('DECOR REPORT '+JSON.stringify(report));
 assert.equal(report.runs,96);assert.ok(report.models>0);
});
// AI hotfix: keep the same sight range, stealth rules and chase speed.
const pigFixture=fixture+`level=4;player={x:4.5,y:4.5,flash:true,hidden:false,moving:false};crouching=false;rageMode=false;eventState=null;noiseEvents=[];hardSlowUntil=0;let pigTest;`;
check('Chrum keeps chase target within contact distance',()=>{
 run(pigFixture+`pigTest={kind:'pig',x:3.82,y:4.5,a:0,state:'patrol',path:[],pathTimer:0,listenTimer:0};updateGuard(pigTest,.02);`);
 assert.equal(run('pigTest.state'), 'chase');assert.ok(run('pigTest.x>3.82'));
});
check('Chrum investigates sustained noise instead of listening forever',()=>{
 run(`player.x=2.5;player.y=4.5;player.flash=false;crouching=true;pigTest={kind:'pig',x:6.5,y:4.5,a:0,state:'patrol',path:[],pathTimer:0,listenTimer:0};`);
 run(`for(let i=0;i<100;i++){elapsed+=.02;noiseEvents=[{x:player.x,y:player.y,radius:9,expiry:elapsed+2}];updateGuard(pigTest,.02);}`);
 assert.ok(run('pigTest.x<6.4'));assert.notEqual(run('pigTest.state'),'listen');
});
check('idle guard rotates rather than staring permanently in one direction',()=>{
 run(`player.x=2.5;player.y=4.5;player.flash=true;crouching=false;noiseEvents=[];pigTest={kind:'pig',x:6.5,y:4.5,a:0,state:'patrol',path:[],pathTimer:0,listenTimer:0,territory:{x0:6,x1:6,y0:4,y1:4}};`);
 run(`for(let i=0;i<100;i++)updateGuard(pigTest,.02);`);
 assert.equal(run('pigTest.state'),'chase');
});
check('suspicious guard searches instead of dropping target on arrival',()=>{
 run(`player.x=2.5;player.y=4.5;player.flash=false;crouching=true;noiseEvents=[];pigTest={kind:'pig',x:6.5,y:4.5,a:0,state:'suspicious',investigate:{x:6.6,y:4.5},path:[],pathTimer:0,listenTimer:10};updateGuard(pigTest,.02);`);
 assert.equal(run('pigTest.state'),'search');assert.ok(run('!!pigTest.investigate'));
});
check('custom normal spawn uses actual dungeon entrance',()=>{
 run(`level=13;customGameConfig.difficulty='normal';N=15;world=Array.from({length:N},(_,y)=>Array.from({length:N},(_,x)=>y===7&&x>=7&&x<=13?0:1));let customSpawn=safeGuardSpawn(13.5,7.5);`);
 assert.equal(run('customSpawn.x'),13.5);assert.equal(run('customSpawn.y'),7.5);
});
console.log('All Alpha 2 logic regression groups passed.');

check('Alpha 3 render cadence: playing every frame, menu capped, pause redraw only on request',()=>{
 run(`let renderCount=0;const requestAnimationFrame=noop;let gpuRenderer={needsRender:false};const render=()=>{renderCount++;gpuRenderer.needsRender=false;return true};const syncGameAudio=noop;state='menu';lastTime=0;lastRenderState=null;lastRenderTime=-Infinity;`);
 run('tick(10);tick(20);tick(40);tick(60)');assert.equal(run('renderCount'),2);
 run("state='paused';tick(70);tick(80);tick(90)");assert.equal(run('renderCount'),3);
 run('gpuRenderer.needsRender=true;tick(100);tick(110)');assert.equal(run('renderCount'),4);
 run("state='playing';update=noop;tick(120);tick(130)");assert.equal(run('renderCount'),6);
});

check('FPS cap tracks the requested cadence across refresh rates',()=>{
 run("gameSettings.fpsLimit=120;renderCount=0;lastRenderState=null;for(let i=0;i<144;i++)tick(200+i*1000/144);");
 assert.ok(Math.abs(run('renderCount')-120)<=1);
 run("gameSettings.fpsLimit=30;renderCount=0;for(let i=0;i<60;i++)tick(1200+i*1000/60);");
 assert.ok(Math.abs(run('renderCount')-30)<=1);
});
