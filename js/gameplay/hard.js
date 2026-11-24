// HARD / seed-reproducible connected procedural labyrinth, with dangerous dead ends.
// Server-independent: this mode is solo-only until the dormant CO-OP is reenabled.
const HARD_VARIANTS=['red','green','yellow','gray','classic','pink'];
function hardGenerateMap(runSeed,stage=1){
 seed=runSeed|0;N=[0,65,73,81,89,97][stage]||65;
 world=Array.from({length:N},()=>Array(N).fill(1));
 const n=stage<3?5:6;const step=Math.floor((N-14)/(n-1));const centers=Array.from({length:n},(_,i)=>7+i*step),edges=[];
 const carve=(x,y,w,h)=>{for(let yy=Math.max(1,y);yy<Math.min(N-1,y+h);yy++)for(let xx=Math.max(1,x);xx<Math.min(N-1,x+w);xx++)world[yy][xx]=0};
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
   const x=3+Math.floor(rnd()*(N-6)),y=3+Math.floor(rnd()*(N-6));
   if(world[y][x]!==0)continue;
   const dirs=[[1,0],[-1,0],[0,1],[0,-1]], [dx,dy]=dirs[Math.floor(rnd()*dirs.length)];
   const sx=-dy,sy=dx,len=2+Math.floor(rnd()*5),path=[];
   let valid=true;
   for(let d=1;d<=len;d++){
     const xx=x+dx*d,yy=y+dy*d;
     // Each branch must have walls on both sides, guaranteeing a dead end.
     if(xx<=2||yy<=2||xx>=N-3||yy>=N-3||world[yy][xx]!==1||world[yy+sy][xx+sx]!==1||world[yy-sy][xx-sx]!==1){valid=false;break}
     path.push([xx,yy]);
   }
   if(valid){for(const [xx,yy] of path)world[yy][xx]=0;branches++;}
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
const HARD_STAGE_NAMES=['','ZOLTE KORYTARZE','ZALANY KOMPLEKS','CZERWONA STREFA','SEKTOR CHRUM','OSTATNIE SPOTKANIE'];
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
 g.speedMultiplier=variant==='red'?1.52:variant==='gray'?.68:variant==='pink'?.85:1;
 g.nextTrail=0;g.nextPulse=30+rnd()*60;
 return g;
}
function scatterHardRocks(spawn,desired){
 const avoid=[spawn,{x:exitCell.x,y:exitCell.y},...fuses,...terminals,...bonusItems,...guards];
 const candidates=dungeonEmptyCells(spawn.x,spawn.y).filter(c=>c.d>9&&
   [[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>world[c.y+dy]?.[c.x+dx]===0).length>=3 &&
   avoid.every(p=>Math.hypot((p.x||0)-c.x-.5,(p.y||0)-c.y-.5)>2.3));
 // Deterministic shuffle, while keeping the guaranteed route to every objective.
 candidates.sort(()=>rnd()-.5);
 const important=[...fuses,...terminals,...bonusItems,...guards];
 let placed=0;
 for(const c of candidates){
   if(placed>=desired)break;
   if(hardRocks.some(r=>Math.hypot(r.x-c.x-.5,r.y-c.y-.5)<2.5))continue;
   world[c.y][c.x]=5;const d=bfsDistances(spawn.x,spawn.y);
   const pass=important.every(q=>d[Math.floor(q.y)]?.[Math.floor(q.x)]>=0)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>d[exitCell.y+dy]?.[exitCell.x+dx]>=0);
   if(!pass){world[c.y][c.x]=0;continue;}
   const rock={type:'rock',x:c.x+.5,y:c.y+.5,phase:rnd()*TAU,size:.69+rnd()*.18};
   hardRocks.push(rock);props.push(rock);placed++;
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
 GOAL=[0,8,9,10,9,11][stage];
 doors=[];fuses=[];terminals=[];interactables=[];bonusItems=[];props=[];decoys=[];hardRocks=[];
 // Portal is not allowed to split routes between the player and objectives.
 const candidates=cells.slice().sort((a,b)=>b.d-a.d);
 let exit=candidates.find(c=>c.d>35&&world[c.y][c.x]===0&&
    (world[c.y+1]?.[c.x]===0||world[c.y-1]?.[c.x]===0))||candidates[0];
 for(const c of candidates){
  if(c.d<36)break;world[c.y][c.x]=3;
  const d=bfsDistances(spawn.x,spawn.y);world[c.y][c.x]=0;
  if(cells.every(q=>q===c||(q.x===c.x&&q.y===c.y)||d[q.y][q.x]>=0)){exit=c;break;}
 }
 exitCell={x:exit.x,y:exit.y};
 const usable=cells.filter(c=>c.x!==exit.x||c.y!==exit.y);
 const targets=chooseFarCells(usable,GOAL,stage===1?7:9,[spawn,exit]);
 for(let i=0;i<GOAL;i++){
   const q=targets[i]||usable.find(c=>c.d>8&&!fuses.some(f=>Math.hypot(c.x+.5-f.x,c.y+.5-f.y)<3));
   if(q)addCard('hard-'+stage+'-target-'+i,q.x+.5,q.y+.5);
 }
 const panelCount=[0,0,2,3,3,4][stage];
 const panelCells=chooseFarCells(usable,panelCount,11,[spawn,exit,...targets]);
 panelCells.forEach((q,i)=>addControl('hard-panel-'+i,q.x+.5,q.y+.5,
   (stage===4?'DZWIGNIA':'REAKTOR')+' / '+(i+1),i+1));
 const consumables=chooseFarCells(usable,12,5,[spawn,exit,...targets,...panelCells]);
 for(let i=0;i<consumables.length;i++){
   const q=consumables[i],type=['stamina','decoy','shield'][i%3];
   addPickup('hard-'+stage+'-loot-'+i,q.x+.5,q.y+.5,type,
    type==='stamina'?'NAPOJ ENERGII':type==='decoy'?'WABIK +2':'TARCZA',type==='decoy'?2:1);
 }
 prepareEnergyDrinkLottery();
 const specials=chooseFarCells(usable,4,9,[spawn,exit,...targets,...panelCells,...consumables]);
 for(let i=0;i<3;i++)if(specials[i])addPickup('hard-slow-'+i,specials[i].x+.5,specials[i].y+.5,'hardSlow','SPOWALNIACZ');
 if(specials[3])addPickup('hard-freeze',specials[3].x+.5,specials[3].y+.5,'hardFreeze','ZAMRAZACZ');
 // Roll every variant again at each run start (also on replay).
 // On HARD 1 no pink split: precisely two Marmurs stay on the map.
 guards=[];
 const lineup=rollHardChampionLineup(stage);
 const spawnCells=chooseFarCells(usable,lineup.length+2,12,[spawn,exit,...targets]);
 for(let i=0;i<lineup.length;i++){
   const [kind,variant]=lineup[i],q=spawnCells[i]||usable.find(c=>c.d>18+i*2)||usable[0];
   const pairs=variant==='pink'?2:1;
   for(let copy=0;copy<pairs;copy++){
     const nearby=copy?usable.find(c=>Math.hypot(c.x-q.x,c.y-q.y)>3&&Math.hypot(c.x-q.x,c.y-q.y)<7&&
                         guards.every(g=>Math.hypot(c.x+.5-g.x,c.y+.5-g.y)>2)):q;
     const target=nearby||q;
     guards.push(assignChampion(makeGuard(target.x+.5,target.y+.5,kind),variant));
   }
 }
 world[exit.y][exit.x]=3;
 // Rocks are solid, block AI routes, and never isolate an objective.
 scatterHardRocks(spawn,[0,26,34,41,50,54][stage]);
 scatterEnvironmentalProps(16+stage*4,9+stage*2,[...fuses,...terminals,...bonusItems,spawn]);
 seen=Array.from({length:N},()=>Array(N).fill(false));
 commonFacilityReset();
 player.x=spawn.x+.5;player.y=spawn.y+.5;player.decoys=2;
 player.inventory={energy:[],slow:0,freeze:0};player.slowCharges=0;player.freezeCharges=0;
 hardSlowUntil=0;hardPulseUntil=0;hardPulseNext=0;hardEmergency=null;hardNextEmergency=68+rnd()*24;
 chooseSpawnView();updateSeen();
 $('levelLabel').textContent='HARD '+stage+' / '+HARD_STAGE_NAMES[stage];
 $('seedChip').style.display='block';$('seedText').textContent=String(hardSeed>>>0);
 $('eventTag').textContent='HARD '+stage+' · SEED '+(hardSeed>>>0);
 setUIIcon(document.querySelector('.chip .gem'),stage===1?'battery':stage===4?'feed':'skull');
 cat=guards[0];player.shieldUntil=0;updateObjectiveFacility();
 $('hardEmergency').hidden=true;document.body.classList.remove('hard-detected');
 updateInventoryUI();
 showToast('HARD '+stage+' · '+HARD_STAGE_NAMES[stage]+' · LOSOWE CHAMPIONY',4.0);
}
function hardSlowActive(){return elapsed<hardSlowUntil}
function yellowCanSeePlayer(g){
 const distance=Math.hypot(g.x-player.x,g.y-player.y);
 const angle=Math.atan2(player.y-g.y,player.x-g.x);
 const delta=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)));
 return !g.frozen&&!player.hidden&&distance<=22&&delta<2.35&&lineOfSight(g.x,g.y,player.x,player.y);
}
function hardPulseActive(){return isHardMode()&&elapsed<hardPulseUntil&&guards.some(g=>g.variant==='yellow'&&yellowCanSeePlayer(g))}
function useHardSlow(){
 if(state!=='playing')return;
 if((player.slowCharges||0)<1){showToast('BRAK SPOWALNIACZA W EKWIPUNKU',1.7);return}
 player.slowCharges--;player.inventory.slow=player.slowCharges;hardSlowUntil=Math.max(hardSlowUntil,elapsed)+30;
 showToast('SPOWOLNIENIE POTWOROW · 30 SEKUND',3);playUnlock();updateInventoryUI();
}
function useHardFreeze(){
 if(state!=='playing')return;
 if((player.freezeCharges||0)<1){showToast('BRAK ZAMRAZACZA W EKWIPUNKU',1.7);return}
 const targets=level===1?[cat]:guards;
 const available=targets.filter(g=>g&&!g.frozen&&Math.hypot(g.x-player.x,g.y-player.y)<15&&lineOfSight(player.x,player.y,g.x,g.y));
 available.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
 const target=available[0];
 if(!target){showToast('STWOR MUSI BYC WIDOCZNY, DO 15 M',2.8);return}
 player.freezeCharges--;player.inventory.freeze=player.freezeCharges;target.frozen=true;target.path=[];target.state='frozen';
 showToast('STWOR ZAMROZONY · DOTYK NADAL ZABIJA',3.5);playUnlock();updateInventoryUI();
}
function triggerHardEmergency(){
 const sx=Math.floor(player.x),sy=Math.floor(player.y),dist=bfsDistances(sx,sy);
 const options=[];
 for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){
  if(world[y][x]!==0||dist[y][x]<7||dist[y][x]>20)continue;
  if(fuses.some(f=>!f.taken&&Math.hypot(f.x-x-.5,f.y-y-.5)<2))continue;
  if(terminals.some(t=>Math.hypot(t.x-x-.5,t.y-y-.5)<2))continue;
  if(hardRocks.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2))continue;
  options.push({x,y,d:dist[y][x]});
 }
 options.sort((a,b)=>Math.abs(a.d-13)-Math.abs(b.d-13));
 const q=options[Math.min(options.length-1,Math.floor(rnd()*Math.min(12,options.length)))]||{x:sx,y:sy};
 hardEmergency={x:q.x+.5,y:q.y+.5,time:45};
 interactables.push({id:'hard-repair',x:hardEmergency.x,y:hardEmergency.y,type:'repair',title:'NAPRAW AWARYJNY REAKTOR',used:false});
 $('hardEmergency').hidden=false;
 showToast('ALARM · NAPRAW REAKTOR W CIAGU 45 SEKUND',4);
 addNoise(hardEmergency.x,hardEmergency.y,20,'alarm');playSting();
}
function finishHardEmergency(){
 hardEmergency=null;interactables=interactables.filter(o=>o.id!=='hard-repair');
 hardNextEmergency=elapsed+72+rnd()*48;
 $('hardEmergency').hidden=true;showToast('REAKTOR NAPRAWIONY · AWARIA OPANOWANA',3);playUnlock();
}
function updateHard(dt){
 updateFacility(dt,false);
 if(state!=='playing')return;
 if(!hardEmergency&&elapsed>=hardNextEmergency)triggerHardEmergency();
 if(hardEmergency){
  hardEmergency.time-=dt;
  $('hardEmergencyTime').textContent='00:'+String(Math.max(0,Math.ceil(hardEmergency.time))).padStart(2,'0');
  $('hardEmergencyDistance').textContent='DO PANELU: '+Math.round(Math.hypot(player.x-hardEmergency.x,player.y-hardEmergency.y))+' M · E';
  if(hardEmergency.time<=0){lose('meltdown');return;}
 }
 for(const g of guards){
  if(g.frozen)continue;
  if(g.variant==='green'&&elapsed>=(g.nextTrail||0)){
   g.nextTrail=elapsed+3.6;
   if(props.filter(p=>p.type==='hazard'&&p.hardTrail).length<70)
     props.push({type:'hazard',hardTrail:true,x:g.x,y:g.y,phase:elapsed,size:.80,expires:elapsed+28});
  }
  if(g.variant==='yellow'&&elapsed>=g.nextPulse&&yellowCanSeePlayer(g)){
   g.nextPulse=elapsed+30+rnd()*60;hardPulseUntil=elapsed+7;
   showToast('ZOLTA ANOMALIA · ZWOLNIONO GRACZA',3);
   sound(170,.4,'sawtooth',.09,-80);
  }
 }
 props=props.filter(p=>!p.expires||p.expires>elapsed);
 const detected=guards.some(g=>g.state==='chase'&&!g.frozen);
 document.body.classList.toggle('hard-detected',detected);
 $('eventTag').textContent=hardEmergency?'AWARIA · NAPRAWA WYMAGANA':
   detected?'HARD · WYKRYTO RUCH':hardSlowActive()?'SPOWOLNIONO STWORY':'HARD '+hardStage()+' · '+HARD_STAGE_NAMES[hardStage()];
}
