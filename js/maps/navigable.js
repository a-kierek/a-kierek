// Mission coordinates use the three authored anchor rows and columns.
function carveFriendlyLayout(size,mapSeed){
 seed=mapSeed;
 const layout=startRoomLayout(size,mapSeed);
 const centers=roomCenters(4,size-5,5);
 buildRoomRegion(layout,renderStage(),centers,centers,{campaign:true});
 return [centers[0],centers[2],centers[4]];
}

function createPigWorld(){
  const [lo,mid,hi]=carveFriendlyLayout(53,923401);
  gameSession.GOAL=7;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  [['feed1',hi,lo],['feed2',lo,hi],['feed3',hi,hi],['feed4',mid,mid],['feed5',lo,mid],['feed6',hi,mid],['feed7',mid,hi]]
    .forEach(([id,x,y])=>addCard(id,x+.5,y+.5));
  addControl('barn',mid+.5,lo+.5,'GATE LEVER');
  addControl('vent',mid+.5,hi+.5,'BARN VENTILATION');
  addControl('mixer',lo+.5,lo+.5,'FEED MIXER');
  for(const [x,y] of [[hi,mid+1],[lo+1,lo],[mid,mid+4]])
    addPickup('bacon-'+x+'-'+y,x+.5,y+.5,'stamina','ENERGY DRINK',1);
  for(const [x,y] of [[lo+2,lo+2],[hi-2,lo+2],[lo+2,hi-2]])addLocker(x+.5,y+.5);
  addGate('pen',mid,lo+6,'BARN GATE',{panel:'barn'},'Pull the gate lever');
  addGate('feedcorridor',lo+5,mid,'FEED GATE',{panel:'mixer'},'Start the feed mixer');
  gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
  scatterEnvironmentalProps(22,11,[...gameSession.fuses,...gameSession.terminals]);
  scatterEnergyDrinks(3);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel4(){
  document.body.classList.remove('level2','final-level');
  document.body.classList.add('pig-level');
  createPigWorld();commonFacilityReset();
  $('levelLabel').textContent='LEVEL 4 / CHRUM SECTOR';
  setUIIcon(document.querySelector('.chip .gem'),'feed');
  gameSession.guards=[makeGuard(gameSession.N-5.5,5.5,'pig',{x0:1,y0:1,x1:gameSession.N-2,y1:gameSession.N-2})];
  gameSession.guards[0].a=PI;gameSession.cat=gameSession.guards[0];
  showToast('YOU HEAR GRUNTING IN THE DISTANCE...',4);
}
