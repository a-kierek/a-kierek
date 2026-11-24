// Shared, human-readable layout for campaign levels 2, 3 and 4.
// Three wide north/south and east/west routes make a connected grid with loops.
function carveFriendlyLayout(size, mapSeed) {
  N=size; seed=mapSeed;
  world=Array.from({length:N},()=>Array(N).fill(1));
  const hubs=[4,Math.floor(N/2),N-5];
  const rect=(x,y,w,h)=>{
    for(let yy=Math.max(1,y);yy<Math.min(N-1,y+h);yy++)
      for(let xx=Math.max(1,x);xx<Math.min(N-1,x+w);xx++) world[yy][xx]=0;
  };
  // Continuous broad corridors with no unavoidable locked branches.
  for(const x of hubs)rect(x-1,2,3,N-4);
  for(const y of hubs)rect(2,y-1,N-4,3);
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
      const px=cx+2,py=cy+2;if(world[py]?.[px]===0)world[py][px]=1;
    }
  }
  // Sightline landmarks: a few optional shortcuts and double-width passages.
  for(let i=0;i<8;i++){
    const x=6+Math.floor(rnd()*(N-12)),y=6+Math.floor(rnd()*(N-12));
    if(world[y][x]===0)rect(x,y,2,2);
  }
  return hubs;
}


function createPigWorld(){
  const [lo,mid,hi]=carveFriendlyLayout(53,923401);
  GOAL=7;doors=[];fuses=[];terminals=[];interactables=[];bonusItems=[];props=[];decoys=[];
  [['feed1',hi,lo],['feed2',lo,hi],['feed3',hi,hi],['feed4',mid,mid],['feed5',lo,mid],['feed6',hi,mid],['feed7',mid,hi]]
    .forEach(([id,x,y])=>addCard(id,x+.5,y+.5));
  addControl('barn',mid+.5,lo+.5,'DZWIGNIA WROTA');
  addControl('vent',mid+.5,hi+.5,'WENTYLACJA CHLEWNI');
  addControl('mixer',lo+.5,lo+.5,'MIESZALNIK PASZY');
  for(const [x,y] of [[hi,mid],[lo,lo],[mid,mid+4]])
    addPickup('bacon-'+x+'-'+y,x+.5,y+.5,'decoy','KARMNIK · WABIK',2);
  for(const [x,y] of [[lo+2,lo+2],[hi-2,lo+2],[lo+2,hi-2]])addLocker(x+.5,y+.5);
  addGate('pen',mid,lo+6,'WROTA CHLEWNI',{panel:'barn'},'Pociagnij dzwignie wrot');
  addGate('feedcorridor',lo+5,mid,'BRAMA PASZOWA',{panel:'mixer'},'Uruchom mieszalnik paszy');
  exitCell={x:hi-3,y:hi};world[hi][hi-3]=3;
  scatterEnvironmentalProps(22,11,[...fuses,...terminals]);
  scatterEnergyDrinks(3);
  seen=Array.from({length:N},()=>Array(N).fill(false));
}

function resetLevel4(){
  document.body.classList.remove('level2','final-level');
  document.body.classList.add('pig-level');
  createPigWorld();commonFacilityReset();
  $('levelLabel').textContent='LEVEL 4 / SEKTOR CHRUM';
  setUIIcon(document.querySelector('.chip .gem'),'feed');
  guards=[makeGuard(N-5.5,5.5,'pig',{x0:1,y0:1,x1:N-2,y1:N-2})];
  guards[0].a=PI;cat=guards[0];
  showToast('SLYSZYSZ CHRUMKANIE W ODDALI...',4);
}
