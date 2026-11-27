// Shared, human-readable layout for campaign levels 2, 3 and 4.
// Three wide north/south and east/west routes make a connected grid with loops.
function carveFriendlyLayout(size, mapSeed) {
  gameSession.N=size; seed=mapSeed;
  gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
  const hubs=[4,Math.floor(gameSession.N/2),gameSession.N-5];
  const rect=(x,y,w,h)=>{
    for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)
      for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++) gameSession.world[yy][xx]=0;
  };
  // Continuous broad corridors with no unavoidable locked branches.
  for(const x of hubs)rect(x-1,2,3,gameSession.N-4);
  for(const y of hubs)rect(2,y-1,gameSession.N-4,3);
  for(let yi=0;yi<2;yi++)for(let xi=0;xi<2;xi++){
    const cx=Math.round((hubs[xi]+hubs[xi+1])/2);
    const cy=Math.round((hubs[yi]+hubs[yi+1])/2);
    const w=7+Math.floor(rnd()*3),h=7+Math.floor(rnd()*3);
    rect(cx-Math.floor(w/2),cy-Math.floor(h/2),w,h);
    rect(cx-1,hubs[yi],3,cy-hubs[yi]+1);
    rect(cx-1,cy,3,hubs[yi+1]-cy+1);
    rect(hubs[xi],cy-1,cx-hubs[xi]+1,3);
    rect(cx,cy-1,hubs[xi+1]-cx+1,3);
    // Decorative columns away from main room exits.
    if(w>=8&&h>=8&&rnd()>.45){
      const px=cx+2,py=cy+2;if(gameSession.world[py]?.[px]===0)gameSession.world[py][px]=1;
    }
  }
  // Sightline landmarks: a few optional shortcuts and double-width passages.
  for(let i=0;i<8;i++){
    const x=6+Math.floor(rnd()*(gameSession.N-12)),y=6+Math.floor(rnd()*(gameSession.N-12));
    if(gameSession.world[y][x]===0)rect(x,y,2,2);
  }
  return hubs;
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
