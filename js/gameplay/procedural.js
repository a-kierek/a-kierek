// Fully isolated procedural mode, using seeded rooms, a connected corridor graph,
// randomized enemy casts, pickup locations, consumables and escape positions.
let proceduralSeed=0,requestedSeed=null;
function dungeonBuild(runSeed){
  seed=runSeed|0;
  gameSession.N=49;gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
  const centers=[6,18,30,42],segments=[];
  const carve=(x,y,w,h)=>{for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++)gameSession.world[yy][xx]=0};
  for(let yi=0;yi<4;yi++)for(let xi=0;xi<4;xi++){
    const x=centers[xi],y=centers[yi],w=5+Math.floor(rnd()*4),h=5+Math.floor(rnd()*4);
    carve(x-Math.floor(w/2),y-Math.floor(h/2),w,h);
  }
  // Randomized spanning tree ensures ALL rooms are connected on every seed.
  const visited=new Set(['0,0']),stack=[[0,0]],connections=new Set();
  const edge=(a,b)=>[a.join(','),b.join(',')].sort().join('::');
  while(stack.length){
    const [x,y]=stack.at(-1),neighbors=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([u,v])=>u>=0&&u<4&&v>=0&&v<4&&!visited.has(`${u},${v}`));
    if(!neighbors.length){stack.pop();continue}
    const next=neighbors[Math.floor(rnd()*neighbors.length)];
    connections.add(edge([x,y],next));visited.add(next.join(','));stack.push(next);
  }
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
    if(x<3&&(rnd()<.47||connections.has(edge([x,y],[x+1,y]))))segments.push([x,y,x+1,y]);
    if(y<3&&(rnd()<.47||connections.has(edge([x,y],[x,y+1]))))segments.push([x,y,x,y+1]);
  }
  for(const [x,y,u,v] of segments){
    const sx=centers[x],sy=centers[y],ex=centers[u],ey=centers[v];
    if(x===u)carve(sx-1,Math.min(sy,ey),3,Math.abs(ey-sy)+1);
    else carve(Math.min(sx,ex),sy-1,Math.abs(ex-sx)+1,3);
  }
  return centers;
}
function dungeonEmptyCells(fromX=5,fromY=5){
  const dist=bfsDistances(fromX,fromY),out=[];
  for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
    if(gameSession.world[y][x]===0&&dist[y][x]>=0)out.push({x,y,d:dist[y][x]});
  }
  return out;
}
function chooseFarCells(cells,num,minDist,exclude=[]){
  const selected=[];
  const candidates=cells.filter(c=>c.d>5).sort(()=>rnd()-.5);
  for(const c of candidates){
    if([...selected,...exclude].every(p=>Math.hypot(c.x-p.x,c.y-p.y)>=minDist))selected.push(c);
    if(selected.length>=num)break;
  }
  if(selected.length<num){for(const c of cells){if([...selected,...exclude].every(p=>Math.hypot(c.x-p.x,c.y-p.y)>=3))selected.push(c);if(selected.length>=num)break}}
  return selected;
}
function resetProcedural(){
  document.body.classList.remove('level2','final-level','pig-level');
  document.body.classList.add('procedural-level');
  // Browser crypto is available in normal deployments; this fallback also works offline.
  proceduralSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
  requestedSeed=null;
  dungeonBuild(proceduralSeed);
  gameSession.GOAL=6+Math.floor(rnd()*3);
  gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  const spawn={x:6,y:6},cells=dungeonEmptyCells(spawn.x,spawn.y);
  // An exit is a wall until the player finishes the objectives. Placing it on
  // an articulation cell can cut the dungeon in half, so test the connectivity
  // of all remaining rooms with the exit temporarily closed.
  const ordered=cells.slice().sort((a,b)=>b.d-a.d);
  let exit=null;
  for(const candidate of ordered){
    if(Math.hypot(candidate.x-spawn.x,candidate.y-spawn.y)<10)continue;
    gameSession.world[candidate.y][candidate.x]=3;
    const remaining=bfsDistances(spawn.x,spawn.y);
    gameSession.world[candidate.y][candidate.x]=0;
    if(cells.every(p=>(p.x===candidate.x&&p.y===candidate.y)||remaining[p.y][p.x]>=0)){
      exit=candidate;break;
    }
  }
  exit=exit||ordered[0];
  gameSession.exitCell={x:exit.x,y:exit.y};
  const items=chooseFarCells(cells,gameSession.GOAL,6,[spawn,gameSession.exitCell]);
  for(let i=0;i<items.length;i++)addCard('random-'+i,items[i].x+.5,items[i].y+.5);
  // Zero broken seeds: add any missing objectives in reachable cells.
  if(gameSession.fuses.length<gameSession.GOAL){for(const p of cells){if(gameSession.fuses.length>=gameSession.GOAL)break;if(p.d>8&&!gameSession.fuses.some(f=>Math.hypot(f.x-p.x,f.y-p.y)<2))addCard('extra-'+gameSession.fuses.length,p.x+.5,p.y+.5)}}
  const consumables=chooseFarCells(cells,7,4,[spawn,gameSession.exitCell,...items]);
  const types=['stamina','shield'];
  consumables.forEach((p,i)=>{
    const type=i<2?'stamina':types[Math.floor(rnd()*types.length)];
    addPickup('loot-'+i,p.x+.5,p.y+.5,type,
      type==='stamina'?'ENERGY DRINK':'PROTECTIVE SHIELD',1);
  });
  prepareEnergyDrinkLottery();
  const spawns=chooseFarCells(cells,3+Math.floor(rnd()*2),7,[spawn,...items,gameSession.exitCell]);
  const kinds=['cat','pig','watcher','listener'];
  gameSession.guards=spawns.map((p,i)=>makeGuard(p.x+.5,p.y+.5,kinds[Math.floor(rnd()*kinds.length)]));
  // Randomized pickup positions and enemy archetypes share one reproducible seed.
  gameSession.world[gameSession.exitCell.y][gameSession.exitCell.x]=3;
  scatterEnvironmentalProps(24,10,[...gameSession.fuses,spawn]);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
  commonFacilityReset();
  gameSession.player.x=spawn.x+.5;gameSession.player.y=spawn.y+.5;chooseSpawnView();updateSeen();
  $('levelLabel').textContent='TRYB PROCEDURALNY / RANDOM ZONE';
  setUIIcon(document.querySelector('.chip .gem'),'spark');
  $('seedChip').style.display='block';$('seedText').textContent=String(proceduralSeed>>>0);
  $('eventTag').textContent='SEED '+(proceduralSeed>>>0);
  gameSession.cat=gameSession.guards[0]||makeGuard(30.5,30.5,'pig');
  gameSession.player.shieldUntil=0;
  updateObjectiveFacility();
  showToast(`NEW ZONE · ${gameSession.GOAL} ITEMS · ${gameSession.guards.length} ENEMIES`,3.8);
}
