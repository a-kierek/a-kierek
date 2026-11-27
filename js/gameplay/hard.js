// HARD / seed-reproducible connected procedural labyrinth, with dangerous dead ends.
// Server-independent: this mode is solo-only until the dormant CO-OP is reenabled.
const HARD_VARIANTS=['red','green','yellow','gray','classic','pink'];
function hardGenerateMap(runSeed,stage=1){
 seed=runSeed|0;gameSession.N=gameSession.level===13?customGameConfig.size:([0,65,73,81,89,97][stage]||65);
 gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
 const n=stage<3?5:6;const step=Math.floor((gameSession.N-14)/(n-1));const centers=Array.from({length:n},(_,i)=>7+i*step),edges=[];
 const carve=(x,y,w,h)=>{for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++)gameSession.world[yy][xx]=0};
 // Every room connects through a deterministic random spanning tree.
 for(const y of centers)for(const x of centers){const w=5+Math.floor(rnd()*5),h=5+Math.floor(rnd()*5);carve(x-(w>>1),y-(h>>1),w,h)}
 const visited=new Set(['0,0']),stack=[[0,0]],links=new Set();
 const edge=(a,b)=>[a.join(','),b.join(',')].sort().join('::');
 while(stack.length){
   const [x,y]=stack.at(-1);
   const options=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&b>=0&&a<n&&b<n&&!visited.has(a+','+b));
   if(!options.length){stack.pop();continue}
   const next=options[Math.floor(rnd()*options.length)];links.add(edge([x,y],next));visited.add(next.join(','));stack.push(next);
 }
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
   if(x<n-1&&(links.has(edge([x,y],[x+1,y]))||rnd()<.12))edges.push([x,y,x+1,y]);
   if(y<n-1&&(links.has(edge([x,y],[x,y+1]))||rnd()<.12))edges.push([x,y,x,y+1]);
 }
 for(const [x,y,xx,yy] of edges){
   const ax=centers[x],ay=centers[y],bx=centers[xx],by=centers[yy];
   if(ax===bx)carve(ax-1,Math.min(ay,by),3,Math.abs(by-ay)+1);
   else carve(Math.min(ax,bx),ay-1,Math.abs(bx-ax)+1,3);
 }
 // Side branches terminate in dead ends; do NOT disconnect the main graph.
 let branches=0;
 for(let i=0;i<1100&&branches<34;i++){
   const x=3+Math.floor(rnd()*(gameSession.N-6)),y=3+Math.floor(rnd()*(gameSession.N-6));
   if(gameSession.world[y][x]!==0)continue;
   const dirs=[[1,0],[-1,0],[0,1],[0,-1]], [dx,dy]=dirs[Math.floor(rnd()*dirs.length)];
   const sx=-dy,sy=dx,len=2+Math.floor(rnd()*5),path=[];
   let valid=true;
   for(let d=1;d<=len;d++){
     const xx=x+dx*d,yy=y+dy*d;
     // Each branch must have walls on both sides, guaranteeing a dead end.
     if(xx<=2||yy<=2||xx>=gameSession.N-3||yy>=gameSession.N-3||gameSession.world[yy][xx]!==1||gameSession.world[yy+sy][xx+sx]!==1||gameSession.world[yy-sy][xx-sx]!==1){valid=false;break}
     path.push([xx,yy]);
   }
   if(valid){for(const [xx,yy] of path)gameSession.world[yy][xx]=0;branches++;}
 }
 carve(5,5,5,5); // guaranteed starting room
}

// Keep the same enemy cast for each HARD campaign stage, but roll champion
// variants afresh for EVERY run, from the run's procedural seed.
// Up to ONE enemy may be ordinary (40% chance per run), with no champion perks.
// HARD 1 always contains exactly two Marmurs, so it excludes the pink split.
const HARD_STAGE_ENEMIES={
 1:['cat','cat'],
 2:['watcher','listener','watcher'],
 3:['cat','watcher','listener','cat'],
 4:['pig','pig','pig'],
 5:['pig','stranger']
};
const HARD_CHAMPION_VARIANTS=['red','green','yellow','gray','pink'];
const HARD_ORDINARY_CHANCE=.40;
const HARD_STAGE_NAMES=['','YELLOW CORRIDORS','FLOODED COMPLEX','BLOODY ZONE','CHRUM SECTOR','LAST ENCOUNTER'];
function rollHardChampionLineup(stage){
 const kinds=HARD_STAGE_ENEMIES[stage]||HARD_STAGE_ENEMIES[1];
 const variants=stage===1?HARD_CHAMPION_VARIANTS.filter(v=>v!=='pink'):HARD_CHAMPION_VARIANTS;
 const ordinaryIndex=rnd()<HARD_ORDINARY_CHANCE?Math.floor(rnd()*kinds.length):-1;
 return kinds.map((kind,i)=>[kind,i===ordinaryIndex?'classic':variants[Math.floor(rnd()*variants.length)]]);
}
function assignChampion(g,variant){
 g.variant=variant;g.isChampion=variant!=='classic';
 g.hardEnhanced=variant!=='pink'&&variant!=='classic';
 g.sizeMultiplier=variant==='pink'?.58:1;
 g.speedMultiplier=variant==='red'?1.34:variant==='gray'?.68:variant==='pink'?.85:1;
 g.nextTrail=0;g.nextPulse=30+rnd()*60;
 return g;
}
function scatterHardRocks(spawn,desired){
 const avoid=[spawn,{x:gameSession.exitCell.x,y:gameSession.exitCell.y},...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards];
 const candidates=dungeonEmptyCells(spawn.x,spawn.y).filter(c=>c.d>9&&
   [[1,0],[-1,0],[0,1],[0,-1]].every(([dx,dy])=>gameSession.world[c.y+dy]?.[c.x+dx]===0) &&
   (()=>{let localOpen=0;for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)if(gameSession.world[c.y+oy]?.[c.x+ox]===0)localOpen++;return localOpen>=8;})() &&
   avoid.every(p=>Math.hypot((p.x||0)-c.x-.5,(p.y||0)-c.y-.5)>2.3));
 // Deterministic shuffle, while keeping the guaranteed route to every objective.
 candidates.sort(()=>rnd()-.5);
 const important=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards];
 let placed=0;
 for(const c of candidates){
   if(placed>=desired)break;
   if(gameSession.hardRocks.some(r=>Math.hypot(r.x-c.x-.5,r.y-c.y-.5)<2.5))continue;
   gameSession.world[c.y][c.x]=5;const d=bfsDistances(spawn.x,spawn.y);
   const pass=important.every(q=>d[Math.floor(q.y)]?.[Math.floor(q.x)]>=0)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>d[gameSession.exitCell.y+dy]?.[gameSession.exitCell.x+dx]>=0);
   if(!pass){gameSession.world[c.y][c.x]=0;continue;}
   const rock={type:'rock',x:c.x+.5,y:c.y+.5,phase:rnd()*TAU,size:.58+rnd()*.10};
   gameSession.hardRocks.push(rock);gameSession.props.push(rock);placed++;
 }
}
function resetHard(){
 const stage=hardStage()||1;
 document.body.classList.remove('level2','final-level','pig-level','procedural-level','hard-detected');
 document.body.classList.add('hard-level','hard-stage-'+stage);
 for(let i=1;i<=4;i++)if(i!==stage)document.body.classList.remove('hard-stage-'+i);
 hardSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
 requestedSeed=null;hardGenerateMap(hardSeed,stage);
 const spawn={x:7,y:7},cells=dungeonEmptyCells(spawn.x,spawn.y);
 gameSession.GOAL=[0,8,9,10,9,11][stage];
 gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];gameSession.hardRocks=[];
 // Portal is not allowed to split routes between the player and objectives.
 const candidates=cells.slice().sort((a,b)=>b.d-a.d);
 let exit=candidates.find(c=>c.d>35&&gameSession.world[c.y][c.x]===0&&
    (gameSession.world[c.y+1]?.[c.x]===0||gameSession.world[c.y-1]?.[c.x]===0))||candidates[0];
 for(const c of candidates){
  if(c.d<36)break;gameSession.world[c.y][c.x]=3;
  const d=bfsDistances(spawn.x,spawn.y);gameSession.world[c.y][c.x]=0;
  if(cells.every(q=>q===c||(q.x===c.x&&q.y===c.y)||d[q.y][q.x]>=0)){exit=c;break;}
 }
 gameSession.exitCell={x:exit.x,y:exit.y};
 const usable=cells.filter(c=>c.x!==exit.x||c.y!==exit.y);
 const targets=chooseFarCells(usable,gameSession.GOAL,stage===1?7:9,[spawn,exit]);
 for(let i=0;i<gameSession.GOAL;i++){
   const q=targets[i]||usable.find(c=>c.d>8&&!gameSession.fuses.some(f=>Math.hypot(c.x+.5-f.x,c.y+.5-f.y)<3));
   if(q)addCard('hard-'+stage+'-target-'+i,q.x+.5,q.y+.5);
 }
 const panelCount=[0,0,2,3,3,4][stage];
 const panelCells=chooseFarCells(usable,panelCount,11,[spawn,exit,...targets]);
 panelCells.forEach((q,i)=>addControl('hard-panel-'+i,q.x+.5,q.y+.5,
   (stage===4?'DZWIGNIA':'REAKTOR')+' / '+(i+1),i+1));
 const consumables=chooseFarCells(usable,12,5,[spawn,exit,...targets,...panelCells]);
 for(let i=0;i<consumables.length;i++){
   const q=consumables[i],type=['stamina','stamina','shield'][i%3];
   addPickup('hard-'+stage+'-loot-'+i,q.x+.5,q.y+.5,type,
    type==='stamina'?'ENERGY DRINK':'SHIELD',1);
 }
 prepareEnergyDrinkLottery();
 const specials=chooseFarCells(usable,4,9,[spawn,exit,...targets,...panelCells,...consumables]);
 for(let i=0;i<3;i++)if(specials[i])addPickup('hard-slow-'+i,specials[i].x+.5,specials[i].y+.5,'hardSlow','SLOW DEVICE');
 if(specials[3])addPickup('hard-freeze',specials[3].x+.5,specials[3].y+.5,'hardFreeze','FREEZE DEVICE');
 // Roll every variant again at each run start (also on replay).
 // On HARD 1 no pink split: precisely two Marmurs stay on the map.
 gameSession.guards=[];
 const lineup=gameSession.level===13?customGameLineup():rollHardChampionLineup(stage);
 const spawnCells=chooseFarCells(usable,lineup.length+2,12,[spawn,exit,...targets]);
 for(let i=0;i<lineup.length;i++){
   const [kind,variant]=lineup[i],q=spawnCells[i]||usable.find(c=>c.d>18+i*2)||usable[0];
   const pairs=variant==='pink'?2:1;
   for(let copy=0;copy<pairs;copy++){
     const nearby=copy?usable.find(c=>Math.hypot(c.x-q.x,c.y-q.y)>3&&Math.hypot(c.x-q.x,c.y-q.y)<7&&
                         gameSession.guards.every(g=>Math.hypot(c.x+.5-g.x,c.y+.5-g.y)>2)):q;
     const target=nearby||q;
     gameSession.guards.push(assignChampion(makeGuard(target.x+.5,target.y+.5,kind),variant));
   }
 }
 gameSession.world[exit.y][exit.x]=3;
 // Rocks are solid, block AI routes, and never isolate an objective.
 scatterHardRocks(spawn,gameSession.level===13&&customGameConfig.difficulty==='normal'?12:[0,26,34,41,50,54][stage]);
 scatterEnvironmentalProps(16+stage*4,9+stage*2,[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,spawn]);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
 commonFacilityReset();
 gameSession.player.x=spawn.x+.5;gameSession.player.y=spawn.y+.5;
 gameSession.player.inventory={energy:[],slow:0,freeze:0};gameSession.player.slowCharges=0;gameSession.player.freezeCharges=0;
 gameSession.hardSlowUntil=0;gameSession.hardPulseUntil=0;gameSession.hardPulseNext=0;gameSession.hardEmergency=null;gameSession.hardNextEmergency=68+rnd()*24;
 chooseSpawnView();updateSeen();
 $('levelLabel').textContent=gameSession.level===13?'CUSTOM GAME / '+HARD_STAGE_NAMES[stage]:'HARD '+stage+' / '+HARD_STAGE_NAMES[stage];
 $('seedChip').style.display='block';$('seedText').textContent=String(hardSeed>>>0);
 $('eventTag').textContent='HARD '+stage+' · SEED '+(hardSeed>>>0);
 setUIIcon(document.querySelector('.chip .gem'),stage===1?'battery':stage===4?'feed':'skull');
 gameSession.cat=gameSession.guards[0];gameSession.player.shieldUntil=0;updateObjectiveFacility();
 $('hardEmergency').hidden=true;document.body.classList.remove('hard-detected');
 updateInventoryUI();
 // The player discovers enemy variants through play, not a stage briefing.
}
function hardSlowActive(){return gameSession.elapsed<gameSession.hardSlowUntil}
function yellowCanSeePlayer(g){
 const distance=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y);
 const angle=Math.atan2(gameSession.player.y-g.y,gameSession.player.x-g.x);
 const delta=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)));
 return !g.frozen&&!gameSession.player.hidden&&distance<=22&&delta<2.35&&lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y);
}
function hardPulseActive(){return isHardMode()&&gameSession.elapsed<gameSession.hardPulseUntil&&gameSession.guards.some(g=>g.variant==='yellow'&&yellowCanSeePlayer(g))}
function useHardSlow(){
 if(gameSession.state!=='playing')return;
 if((gameSession.player.slowCharges||0)<1){showToast('NO SLOW DEVICE IN INVENTORY',1.7);return}
 gameSession.player.slowCharges--;gameSession.player.inventory.slow=gameSession.player.slowCharges;gameSession.hardSlowUntil=Math.max(gameSession.hardSlowUntil,gameSession.elapsed)+30;
 showToast('MONSTERS SLOWED · 30 SECONDS',3);playUnlock();updateInventoryUI();
}
function useHardFreeze(){
 if(gameSession.state!=='playing')return;
 if((gameSession.player.freezeCharges||0)<1){showToast('NO FREEZE DEVICE IN INVENTORY',1.7);return}
 const targets=gameSession.level===1?[gameSession.cat]:gameSession.guards;
 const available=targets.filter(g=>g&&!g.frozen&&Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y)<15&&lineOfSight(gameSession.player.x,gameSession.player.y,g.x,g.y));
 available.sort((a,b)=>Math.hypot(a.x-gameSession.player.x,a.y-gameSession.player.y)-Math.hypot(b.x-gameSession.player.x,b.y-gameSession.player.y));
 const target=available[0];
 if(!target){showToast('STWOR MUSI BYC WIDOCZNY, DO 15 M',2.8);return}
 gameSession.player.freezeCharges--;gameSession.player.inventory.freeze=gameSession.player.freezeCharges;target.frozen=true;target.path=[];target.state='frozen';
 showToast('STWOR ZAMROZONY · DOTYK NADAL ZABIJA',3.5);playUnlock();updateInventoryUI();
}
function triggerHardEmergency(){
 const sx=Math.floor(gameSession.player.x),sy=Math.floor(gameSession.player.y),dist=bfsDistances(sx,sy);
 const options=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||dist[y][x]<7||dist[y][x]>20)continue;
  if(gameSession.fuses.some(f=>!f.taken&&Math.hypot(f.x-x-.5,f.y-y-.5)<2))continue;
  if(gameSession.terminals.some(t=>Math.hypot(t.x-x-.5,t.y-y-.5)<2))continue;
  if(gameSession.hardRocks.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2))continue;
  options.push({x,y,d:dist[y][x]});
 }
 options.sort((a,b)=>Math.abs(a.d-13)-Math.abs(b.d-13));
 const q=options[Math.min(options.length-1,Math.floor(rnd()*Math.min(12,options.length)))]||{x:sx,y:sy};
 gameSession.hardEmergency={x:q.x+.5,y:q.y+.5,time:45};
 gameSession.interactables.push({id:'hard-repair',x:gameSession.hardEmergency.x,y:gameSession.hardEmergency.y,type:'repair',title:'REPAIR THE EMERGENCY REACTOR',used:false});
 $('hardEmergency').hidden=false;
 showToast('ALARM · REPAIR REACTOR IN 45 SECONDS',4);
 addNoise(gameSession.hardEmergency.x,gameSession.hardEmergency.y,20,'alarm');playSting();if(typeof createGameSample==='function')createGameSample('metalCrack',.40);
}
function finishHardEmergency(){
 gameSession.hardEmergency=null;gameSession.interactables=gameSession.interactables.filter(o=>o.id!=='hard-repair');
 gameSession.hardNextEmergency=gameSession.elapsed+72+rnd()*48;
 $('hardEmergency').hidden=true;showToast('REACTOR REPAIRED · EMERGENCY RESOLVED',3);playUnlock();
}
function updateHard(dt){
 updateFacility(dt,false);
 if(gameSession.state!=='playing')return;
 if(!gameSession.hardEmergency&&gameSession.elapsed>=gameSession.hardNextEmergency)triggerHardEmergency();
 if(gameSession.hardEmergency){
  gameSession.hardEmergency.time-=dt;
  $('hardEmergencyTime').textContent='00:'+String(Math.max(0,Math.ceil(gameSession.hardEmergency.time))).padStart(2,'0');
  $('hardEmergencyDistance').textContent='DO PANELU: '+Math.round(Math.hypot(gameSession.player.x-gameSession.hardEmergency.x,gameSession.player.y-gameSession.hardEmergency.y))+' M · E';
  if(gameSession.hardEmergency.time<=0){lose('meltdown');return;}
 }
 for(const g of gameSession.guards){
  if(g.frozen)continue;
  if(g.variant==='green'&&gameSession.elapsed>=(g.nextTrail||0)){
   g.nextTrail=gameSession.elapsed+3.6;
   if(gameSession.props.filter(p=>p.type==='hazard'&&p.hardTrail).length<70)
     gameSession.props.push({type:'hazard',hardTrail:true,x:g.x,y:g.y,phase:gameSession.elapsed,size:.80,expires:gameSession.elapsed+28});
  }
  if(g.variant==='yellow'&&gameSession.elapsed>=g.nextPulse&&yellowCanSeePlayer(g)){
   g.nextPulse=gameSession.elapsed+30+rnd()*60;gameSession.hardPulseUntil=gameSession.elapsed+7;
   showToast('ZOLTA ANOMALIA · ZWOLNIONO PLAYERA',3);
   createGameSample('yellowPulse',.34);
  }
 }
 gameSession.props=gameSession.props.filter(p=>!p.expires||p.expires>gameSession.elapsed);
 const detected=gameSession.guards.some(g=>g.state==='chase'&&!g.frozen);
 document.body.classList.toggle('hard-detected',detected);
 $('eventTag').textContent=gameSession.hardEmergency?'FAILURE · REPAIR REQUIRED':
   detected?'HARD · MOVEMENT DETECTED':hardSlowActive()?'ENEMIES SLOWED':'HARD '+hardStage()+' · '+HARD_STAGE_NAMES[hardStage()];
}
