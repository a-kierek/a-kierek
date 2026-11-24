// Actual layout defined in maps/navigable.js; separate file for level-specific setup.
function createLevel2World(){
  const [lo,mid,hi]=carveFriendlyLayout(49,304792);
  GOAL=6;doors=[];fuses=[];terminals=[];interactables=[];bonusItems=[];props=[];decoys=[];
  for(const [id,x,y] of [['blue',hi,lo],['green',lo,hi],['red',hi,hi],['yellow',mid,mid],['cyan',lo,mid],['amber',hi,mid]])addCard(id,x+.5,y+.5);
  addControl('power',mid+.5,lo+.5,'PANEL ZASILANIA');
  addControl('pump',mid+.5,hi+.5,'POMPA ODWADNIAJACA');
  addControl('filters',lo+.5,lo+.5,'FILTRY GLOWNE');
  addPickup('decoy2a',lo+.5,mid+.5,'decoy','WABIK',2);
  addPickup('decoy2b',hi+.5,mid+.5,'decoy','WABIK',2);
  for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2]])addLocker(x+.5,y+.5);
  addGate('shortcut2a',mid,lo+5,'SKROT A',{cards:1},'Zdobadz jedna karte');
  addGate('shortcut2b',mid,hi-5,'SKROT B',{panel:'power'},'Wlacz panel zasilania');
  addGate('shortcut2c',lo+5,mid,'SERWIS C',{panel:'filters'},'Wlacz filtry glowne');
  exitCell={x:hi-3,y:hi};world[hi][hi-3]=3;
  scatterEnvironmentalProps(24,10,[...fuses,...terminals]);
  scatterEnergyDrinks(3);
  seen=Array.from({length:N},()=>Array(N).fill(false));
}

function resetLevel2(){
 document.body.classList.add('level2');document.body.classList.remove('final-level','pig-level','procedural-level');
 createLevel2World();commonFacilityReset();
 guards=[makeGuard(27.5,5.5,'watcher'),makeGuard(6.5,27.5,'listener')];
 guards[0].a=PI;guards[1].a=-PI/2;cat=guards[0];
}

