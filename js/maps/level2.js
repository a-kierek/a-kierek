// Actual layout defined in maps/navigable.js; separate file for level-specific setup.
function createLevel2World(){
  const [lo,mid,hi]=carveFriendlyLayout(49,304792);
  gameSession.GOAL=6;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  for(const [id,x,y] of [['blue',hi,lo],['green',lo,hi],['red',hi,hi],['yellow',mid,mid],['cyan',lo,mid],['amber',hi,mid]])addCard(id,x+.5,y+.5);
  addControl('power',mid+.5,lo+.5,'POWER CONTROL');
  addControl('pump',mid+.5,hi+.5,'DRAINAGE PUMP');
  addControl('filters',lo+.5,lo+.5,'MAIN FILTERS');
  addPickup('decoy2a',lo+.5,mid+1.5,'stamina','ENERGY DRINK',1);
  addPickup('decoy2b',hi+.5,mid+1.5,'stamina','ENERGY DRINK',1);
  for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2]])addLocker(x+.5,y+.5);
  addGate('shortcut2a',mid,lo+5,'SHORTCUT A',{cards:1},'Collect one card');
  addGate('shortcut2b',mid,hi-5,'SHORTCUT B',{panel:'power'},'Activate the power panel');
  addGate('shortcut2c',lo+5,mid,'MAINTENANCE C',{panel:'filters'},'Activate the main filters');
  gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
  scatterEnvironmentalProps(24,10,[...gameSession.fuses,...gameSession.terminals]);
  scatterEnergyDrinks(3);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel2(){
 document.body.classList.add('level2');document.body.classList.remove('final-level','pig-level','procedural-level');
 createLevel2World();commonFacilityReset();
 gameSession.guards=[makeGuard(27.5,5.5,'watcher'),makeGuard(6.5,27.5,'listener')];
 gameSession.guards[0].a=PI;gameSession.guards[1].a=-PI/2;gameSession.cat=gameSession.guards[0];
}

