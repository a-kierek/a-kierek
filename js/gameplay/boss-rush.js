// Boss Rush: five physically connected HARD sectors, with one-way progression.
// The WebGPU map buffer is 128x128, so this 121x121 map stays within that limit.
// Every canonical stage cast is doubled, with independent HARD AI and randomly
// assigned champion variants. The player clears objectives, not invincible bosses.
const BOSS_RUSH_LEVEL=12;
const BOSS_RUSH_SIZE=121;
const BOSS_RUSH_STAGE_LEFT=[0,4,27,50,73,96];
const BOSS_RUSH_STAGE_NAMES=['','YELLOW CORRIDORS','FLOODED COMPLEX','BLOODY ZONE','CHRUM SECTOR','LAST ENCOUNTER'];
const BOSS_RUSH_CAST={
  1:['cat','cat'],
  2:['watcher','watcher','listener','listener'],
  3:['cat','cat','watcher','watcher','listener','listener'],
  4:['pig','pig'],
  5:['pig','pig','stranger','stranger']
};
const BOSS_RUSH_GOALS=[0,4,5,6,4,6];
const BOSS_RUSH_PANELS=[0,0,1,2,1,2];


function bossRushArea(x){return Math.max(1,Math.min(5,Math.floor((x-4)/23)+1));}
function bossRushRooms(){return gameSession.level===BOSS_RUSH_LEVEL?gameSession.rushSafeRooms:(gameSession.safeRoom?[gameSession.safeRoom]:[]);}
function bossRushNearestRoom(){
 const rooms=bossRushRooms();
 return rooms.reduce((a,b)=>!a||Math.hypot(gameSession.player.x-b.centerX,gameSession.player.y-b.centerY)<Math.hypot(gameSession.player.x-a.centerX,gameSession.player.y-a.centerY)?b:a,null);
}
function bossRushCarve(x0,y0,w,h){
 for(let y=Math.max(1,y0);y<Math.min(gameSession.N-1,y0+h);y++)for(let x=Math.max(1,x0);x<Math.min(gameSession.N-1,x0+w);x++)gameSession.world[y][x]=0;
}
function bossRushSafeRoom(stage){
 const left=BOSS_RUSH_STAGE_LEFT[stage]+7,top=96,side=11;
 for(let y=top;y<top+side;y++)for(let x=left;x<left+side;x++)
   gameSession.world[y][x]=(x===left||y===top||x===left+side-1||y===top+side-1)?8:0;
 const doorX=left+5,doorY=top;
 bossRushCarve(doorX,84,1,12);
 gameSession.world[doorY][doorX]=4;
 const machineX=left+5.5,machineY=top+side-2.12;
 const room={left,top,side,doorX,doorY,centerX:left+side/2,centerY:top+side/2,
  machineX,machineY,machineYaw:Math.PI,fireX:left+7.5,fireY:top+5.2,treeX:null,treeY:null,treeYaw:0,open:false,rushSector:stage};
 gameSession.rushSafeRooms.push(room);
 gameSession.interactables.push({id:'rush-slot-'+stage,type:'slot',title:'SLOT MACHINE / 1 COIN',x:machineX,y:machineY,used:false,rushSector:stage});
 const add=(x,y,z,w,d,h,material,collisionOnly=false)=>gameSession.safeRoomFurniture.push({x,y,z,w,d,h,material,collisionOnly});
 add(machineX,machineY,.39,.69,.50,.78,1,true);
 const posterMaterials=pickSafeRoomPosterMaterials(3);
 [[left+1.03,top+2.0,.028,.52],[left+1.03,top+side-2.0,.028,.56],[left+side-1.03,top+5.5,.028,.50]].forEach((cfg,index)=>add(cfg[0],cfg[1],.56,cfg[2],.70,cfg[3],posterMaterials[index]));
 return room;
}
function bossRushGenerateMap(){
 gameSession.N=BOSS_RUSH_SIZE;
 gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
 const makeRoom=(cx,cy,w,h)=>bossRushCarve(cx-(w>>1),cy-(h>>1),w,h);
 for(let stage=1;stage<=5;stage++){
  const L=BOSS_RUSH_STAGE_LEFT[stage];
  // Two parallel corridors plus rooms and cross-passages, including dead ends.
  bossRushCarve(L+5,11,2,80);
  bossRushCarve(L+15,11,2,80);
  for(const y of [18,39,60,82]){
    bossRushCarve(L+4,y-1,15,3);
    makeRoom(L+11,y,11+(Math.floor(rnd()*3)*2),9);
  }
  for(const [i,y] of [27,49,72].entries()){
    if((stage+i)%2===0){bossRushCarve(L+3,y,4,2);makeRoom(L+4,y,5,5)}
    else{bossRushCarve(L+16,y,5,2);makeRoom(L+18,y,5,5)}
  }
  // Guaranteed connections from gate approach to the vertical corridors.
  bossRushCarve(L+5,60,14,2);
 }
 for(let stage=1;stage<5;stage++){
  const end=BOSS_RUSH_STAGE_LEFT[stage]+22;
  // The single gate is the only traversable connection between sectors.
  bossRushCarve(end-5,60,11,1);
  gameSession.world[60][end]=4;
 }
 // The fifth green exit is accessible only once ALL sections are complete.
 gameSession.exitCell={x:113,y:85};bossRushCarve(112,82,4,6);gameSession.world[85][113]=3;
}
function bossRushFreeCells(stage){
 const L=BOSS_RUSH_STAGE_LEFT[stage];
 const arr=[];
 for(let y=12;y<93;y++)for(let x=L+3;x<L+20;x++)
  if(gameSession.world[y]?.[x]===0)arr.push({x,y});
 return arr;
}
function bossRushPlaceObjectives(stage){
 const cells=bossRushFreeCells(stage).filter(c=>c.y>22&&c.y<91&&Math.hypot(c.x-9,c.y-18)>9);
 for(let i=cells.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
 const chosen=[];
 const place=(spacing)=>{
  const q=cells.find(c=>chosen.every(p=>Math.hypot(c.x-p.x,c.y-p.y)>spacing)&&
    Math.abs(c.x-(BOSS_RUSH_STAGE_LEFT[stage]+11))<8);
  if(!q)return null;
  chosen.push(q);cells.splice(cells.indexOf(q),1);return q;
 };
 for(let i=0;i<BOSS_RUSH_GOALS[stage];i++){
  const c=place(4)||cells.shift();
  if(c){addCard('rush-'+stage+'-item-'+i,c.x+.5,c.y+.5);gameSession.fuses.at(-1).rushSector=stage;}
 }
 for(let i=0;i<BOSS_RUSH_PANELS[stage];i++){
  const c=place(6)||cells.shift();
  if(c){addControl('rush-'+stage+'-panel-'+i,c.x+.5,c.y+.5,'STEROWNIK SEKCJI '+stage);gameSession.terminals.at(-1).rushSector=stage;}
 }
 // Local coins and consumables; NO natural freeze-device pickups anywhere.
 for(let i=0;i<7;i++){
  const c=place(2.5)||cells.shift();if(!c)break;
  if(i<5)gameSession.bonusItems.push({id:'rush-coin-'+stage+'-'+i,type:'coin',name:'1 GROSZ',x:c.x+.5,y:c.y+.5,taken:false,quantity:1,phase:rnd()*TAU});
  else addPickup('rush-drink-'+stage+'-'+i,c.x+.5,c.y+.5,'stamina','ENERGY DRINK');
 }
 for(let i=0;i<4;i++){
  const c=place(2)||cells.shift();if(!c)continue;
  if(i===0)addPickup('rush-slow-'+stage,c.x+.5,c.y+.5,'hardSlow','SLOW DEVICE');
  else if(i===1)addPickup('rush-energy-'+stage,c.x+.5,c.y+.5,'stamina','ENERGY DRINK',1);
  else gameSession.props.push({type:'blood',x:c.x+.5,y:c.y+.5,phase:rnd()*TAU,size:.8});
 }
}
function bossRushSpawn(stage){
 const kinds=BOSS_RUSH_CAST[stage];const L=BOSS_RUSH_STAGE_LEFT[stage];
 for(let i=0;i<kinds.length;i++){
  const x=L+(i%2===0?6.5:16.5),y=31+Math.floor(i/2)*19;
  // CLASSIC is still an enhanced HARD opponent; no pink splitting in Boss Rush,
  // so the number of physical bosses is exactly twice the original cast.
  const variants=['red','green','yellow','gray','classic'];
  const variant=variants[Math.floor(rnd()*variants.length)];
  const g=assignChampion(makeGuard(x,y,kinds[i],{x0:L+3,y0:11,x1:L+19,y1:90}),variant);
  g.hardEnhanced=true;g.rushSector=stage;g.rushBoss=true;
  gameSession.guards.push(g);
 }
}
function bossRushScatterRocks(stage){
 const L=BOSS_RUSH_STAGE_LEFT[stage];
 const reserved=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards].filter(o=>o.rushSector===stage||o.x>=L&&o.x<L+21);
 const spots=[];
 for(let y=13;y<90;y++)for(let x=L+3;x<L+20;x++){
  if(gameSession.world[y][x]!==0||[17,18,39,40,60,61,82,83].includes(y))continue;
  if(reserved.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.0))continue;
  // Avoid the two primary longitudinal corridors and any tight chokepoints.
  if([L+5,L+6,L+15,L+16].includes(x))continue;
  const orth=[[1,0],[-1,0],[0,1],[0,-1]];
  if(orth.some(([dx,dy])=>gameSession.world[y+dy]?.[x+dx]!==0))continue;
  let localOpen=0;for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)if(gameSession.world[y+oy]?.[x+ox]===0)localOpen++;
  if(localOpen<8)continue;
  spots.push({x,y});
 }
 for(let i=spots.length-1;i>0;i--){let j=Math.floor(rnd()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]];}
 let count=0;
 for(const p of spots){
  if(count>=7)break;
  if(gameSession.hardRocks.some(r=>Math.hypot(r.x-p.x-.5,r.y-p.y-.5)<3))continue;
  gameSession.world[p.y][p.x]=5;
  const d=bfsDistances(7,18);
  const exitsConnected=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>d[gameSession.exitCell.y+dy]?.[gameSession.exitCell.x+dx]>=0);
  const reservedConnected=reserved.every(q=>d[Math.floor(q.y)]?.[Math.floor(q.x)]>=0);
  if(!exitsConnected||!reservedConnected){gameSession.world[p.y][p.x]=0;continue;}
  const rock={type:'rock',x:p.x+.5,y:p.y+.5,size:.58+rnd()*.10,phase:rnd()*TAU};
  gameSession.hardRocks.push(rock);gameSession.props.push(rock);count++;
 }
}
function resetBossRush(){
 // Five sectors on one persistent map, not five separate scene loads.
 document.body.classList.remove('level2','final-level','pig-level','procedural-level','sector-five');
 document.body.classList.add('hard-level','boss-rush-level');
 gameSession.bossRush=null;
 const runSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
 requestedSeed=null;seed=runSeed;
 bossRushGenerateMap();
 gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];gameSession.guards=[];gameSession.hardRocks=[];
 gameSession.safeRoom=null;gameSession.safeRoomFurniture=[];gameSession.rushSafeRooms=[];
 gameSession.GOAL=BOSS_RUSH_GOALS.reduce((a,b)=>a+b,0);
 const stageProgress=[];
 // Safe rooms exist only in sectors 1, 3, 5.
 for(let stage=1;stage<=5;stage++){
  bossRushPlaceObjectives(stage);
  if(stage===1||stage===3||stage===5)bossRushSafeRoom(stage);
  stageProgress.push({stage,items:BOSS_RUSH_GOALS[stage],panels:BOSS_RUSH_PANELS[stage],cleared:false});
 }
 prepareEnergyDrinkLottery();
 // Position player at the entrance before creating enemy AI.
 gameSession.player={x:9.5,y:18.5,a:0,pitch:0,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hidden:false,hp:100,maxHp:100};
 for(let stage=1;stage<=5;stage++)bossRushSpawn(stage);
 for(let stage=1;stage<=5;stage++)bossRushScatterRocks(stage);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
 commonFacilityReset();
 gameSession.player.x=9.5;gameSession.player.y=18.5;
 gameSession.player.inventory={energy:[],slow:0,freeze:0};gameSession.player.slowCharges=0;gameSession.player.freezeCharges=0;gameSession.player.coins=0;
 gameSession.player.shieldUntil=0;
 gameSession.safeRoom=gameSession.rushSafeRooms[0];
 gameSession.bossRush={stage:1,progress:stageProgress,doors:[26,49,72,95].map((x,i)=>({id:'boss-gate-'+(i+1),x,y:60,stage:i+1,open:false})),seed:runSeed>>>0};
 for(const gate of gameSession.bossRush.doors)gameSession.doors.push({id:gate.id,x:gate.x,y:gate.y,open:false,requires:{},title:'SECTION GATE '+(gate.stage+1),bossGate:true});
 gameSession.hardSlowUntil=0;gameSession.hardPulseUntil=0;gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;
 chooseSpawnView();updateSeen();
 $('seedChip').style.display='block';$('seedText').textContent=String(gameSession.bossRush.seed);
 $('levelLabel').textContent='BOSS RUSH / YELLOW CORRIDORS';
 $('hardEmergency').hidden=true;
 $('eventTag').textContent='BOSS RUSH · SEKCJA 1/5';
 updateInventoryUI();updateCoinCounter();updateBossRushHUD();
 showToast('BOSS RUSH · 5 SEKCJI · 18 BOSSOW · NO HP REGENERATION',5);
}
function bossRushStageComplete(stage){
 return gameSession.fuses.filter(f=>f.rushSector===stage).every(f=>f.taken)&&
    gameSession.terminals.filter(t=>t.rushSector===stage).every(t=>t.used);
}
function updateBossRushHUD(){
 if(!gameSession.bossRush)return;
 const s=gameSession.bossRush.stage;
 const all=gameSession.fuses.filter(f=>f.rushSector===s),owned=all.filter(f=>f.taken).length;
 const panels=gameSession.terminals.filter(t=>t.rushSector===s),active=panels.filter(t=>t.used).length;
 UI.goal.textContent='SEKCJA '+s+'/5 · '+owned+'/'+all.length+' · PANELS '+active+'/'+panels.length;
 $('eventTag').textContent='BOSS RUSH · '+BOSS_RUSH_STAGE_NAMES[s]+' · BEZ REGENERACJI';
}
function updateBossRush(dt){
 // Reuse the proven facility gameplay and collision/interactions, but only
 // activate enemies inside the current stage (the remaining casts stay put).
 updateFacility(dt,false);
 if(gameSession.state!=='playing'||!gameSession.bossRush)return;
 const old=gameSession.bossRush.stage;
 const actual=bossRushArea(gameSession.player.x);
 gameSession.bossRush.stage=Math.max(old,actual);
 if(actual!==old){
  $('levelLabel').textContent='BOSS RUSH / '+BOSS_RUSH_STAGE_NAMES[gameSession.bossRush.stage];
  showToast('SEKCJA '+gameSession.bossRush.stage+'/5 · '+BOSS_RUSH_STAGE_NAMES[gameSession.bossRush.stage],4);
  playUnlock();
 }
 const s=gameSession.bossRush.stage;
 if(s<5&&bossRushStageComplete(s)&&!gameSession.bossRush.progress[s-1].cleared){
  gameSession.bossRush.progress[s-1].cleared=true;
  const gate=gameSession.bossRush.doors[s-1];gate.open=true;gameSession.world[gate.y][gate.x]=0;markWorldChanged();
  const door=gameSession.doors.find(d=>d.id===gate.id);if(door)door.open=true;
  playUnlock();showToast('SEKCJA '+s+' COMPLETE · GATE OPENED '+(s+1),4);
 }
 for(const g of gameSession.guards){
  if(g.rushSector!==s||g.frozen)continue;
  if(g.variant==='green'&&gameSession.elapsed>=(g.nextTrail||0)){
   g.nextTrail=gameSession.elapsed+4;
   if(gameSession.props.filter(p=>p.type==='hazard'&&p.hardTrail).length<50)
      gameSession.props.push({type:'hazard',hardTrail:true,x:g.x,y:g.y,size:.74,expires:gameSession.elapsed+25});
  }
  if(g.variant==='yellow'&&gameSession.elapsed>=g.nextPulse&&yellowCanSeePlayer(g)){
   g.nextPulse=gameSession.elapsed+30+rnd()*60;gameSession.hardPulseUntil=gameSession.elapsed+7;
   showToast('YELLOW ANOMALY · SLOWED',3);
  }
 }
 gameSession.props=gameSession.props.filter(p=>!p.expires||p.expires>gameSession.elapsed);
 document.body.classList.toggle('hard-detected',gameSession.guards.some(g=>g.rushSector===s&&g.state==='chase'&&!g.frozen));
 updateBossRushHUD();
}
