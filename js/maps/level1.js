function buildMap(){
 seed=19472;
 const layout=startRoomLayout(51,seed);
 const centers=roomCenters(3,47,5);
 buildRoomRegion(layout,1,centers,centers);
 const candidates=dungeonEmptyCells(2,2);
 const exit=chooseRoomExit(candidates,2,2);
 gameSession.exitCell={x:exit.x,y:exit.y};
 const available=candidates.filter(p=>p!==exit);
 const objectives=chooseFarCells(available,gameSession.GOAL,8,[{x:2,y:2},exit]);
 for(let i=0;i<objectives.length;i++){
  const {x,y}=objectives[i];
  gameSession.fuses.push({x:x+.5,y:y+.5,taken:false,phase:rnd()*TAU});
 }
 gameSession.world[exit.y][exit.x]=3;
 scatterEnvironmentalProps(18,8,gameSession.fuses);
 gameSession.seen=gameSession.world.map(row=>row.map(()=>false));
}

function resetBase(){if(gameSession.level===2){resetLevel2();return}document.body.classList.remove("level2");gameSession.GOAL=7;gameSession.guards=[];gameSession.terminals=[];gameSession.props=[];gameSession.doors=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.fuses=[];gameSession.crouching=false;buildMap();gameSession.player={x:2.5,y:2.5,a:.6,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hp:100,maxHp:100};let distances=bfsDistances(2,2),opts=[];for(let y=1;y<gameSession.N-1;y++)for(let x=1;x<gameSession.N-1;x++)if(distances[y][x]>35&&gameSession.world[y][x]===0)opts.push({x,y,d:distances[y][x]});opts.sort((a,b)=>b.d-a.d);let cp=opts[Math.floor(opts.length*.15)]||{x:30,y:30};gameSession.cat=makeGuard(cp.x+.5,cp.y+.5,"cat");gameSession.elapsed=0;gameSession.clock=0;gameSession.awake=false;gameSession.wakeAt=Infinity;gameSession.catPath=[];gameSession.pathTimer=0;gameSession.walkPhase=0;gameSession.nearCat=0;gameSession.alertUntil=0;gameSession.toastTimeout=0;gameSession.flashUntil=0;gameSession.mapOn=false;UI.map.classList.remove('visible');UI.count.textContent='0';$('required').textContent=String(gameSession.GOAL);setUIIcon(document.querySelector('.chip .gem'),'battery');$('levelLabel').textContent='LEVEL 1 / YELLOW CORRIDORS';UI.goal.textContent='TUTORIAL · FIND 7 BATTERIES';UI.clock.textContent='00:00';UI.stamina.style.width=staminaWidth();UI.danger.style.opacity=0;UI.toast.classList.remove('visible');$('stealthStatus').textContent='● UNDETECTED';$('interactHint').style.display='none';primeHealth();setupLevel1Tutorial();updateSeen();updateTutorialVisibility()}
