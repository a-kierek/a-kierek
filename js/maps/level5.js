// Sector 05 is a separate campaign chapter, not the normal procedural mode.
// Includes CHRUM and an independent stranger pursuer using the user's photo sprite.
function createLevel5World(){
  const [lo,mid,hi]=carveFriendlyLayout(61,514271);
  GOAL=8;doors=[];fuses=[];terminals=[];interactables=[];bonusItems=[];props=[];decoys=[];
  for(const [id,x,y] of [
    ['sector5-a',hi,lo],['sector5-b',lo,hi],['sector5-c',hi,hi],
    ['sector5-d',mid,mid],['sector5-e',lo,mid],['sector5-f',hi,mid],
    ['sector5-g',mid,lo],['sector5-h',mid,hi]
  ])addCard(id,x+.5,y+.5);
  addControl('sector5-generator',mid+.5,lo+.5,'GENERATOR AWARYJNY');
  addControl('sector5-antenna',lo+.5,lo+.5,'ANTENA ALARMOWA');
  addControl('sector5-vent',mid+.5,hi+.5,'WENTYLACJA SEKTORA');
  for(const [i,x,y] of [['a',lo,mid],['b',hi,mid],['c',mid,hi]])
    addPickup('sector5-decoy-'+i,x+1.5,y+1.5,'decoy','WABIK +2',2);
  for(const [x,y] of [[lo+2,lo+2],[hi-2,lo+2],[lo+2,hi-2],[hi-2,hi-2]])addLocker(x+.5,y+.5);
  // The gates occupy secondary corridors; key objectives stay on the open grid.
  addGate('s5-maintenance',mid,lo+6,'SERWIS',{panel:'sector5-generator'},'Uruchom generator');
  addGate('s5-vent',mid,hi-6,'SZYB WENTYLACJI',{panel:'sector5-vent'},'Uruchom wentylacje');
  exitCell={x:hi-3,y:hi};world[hi][hi-3]=3;
  scatterEnvironmentalProps(29,13,[...fuses,...terminals]);
  scatterEnergyDrinks(4);
  seen=Array.from({length:N},()=>Array(N).fill(false));
}
function resetLevel5(){
  document.body.classList.remove('level2','final-level','procedural-level','hard-level','hard-detected');
  document.body.classList.add('pig-level','sector-five');
  createLevel5World();commonFacilityReset();
  guards=[makeGuard(N-6.5,5.5,'pig'),makeGuard(6.5,N-7.5,'stranger')];
  guards[0].a=Math.PI;guards[1].a=-Math.PI/2;
  cat=guards[0];
  $('levelLabel').textContent='SEKTOR 05 / OSTATNIE SPOTKANIE';
  setUIIcon(document.querySelector('.chip .gem'),'feed');
  $('eventTag').textContent='CHRUM + NIEZNAJOMY';
  updateObjectiveFacility();
  showToast('SEKTOR 05 · WYKRYTO DWA ZAGROZENIA',4);
}
