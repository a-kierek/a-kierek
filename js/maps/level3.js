function createFinalWorld(){
 const [lo,mid,hi]=carveFriendlyLayout(57,882971);
 gameSession.GOAL=8;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
 for(const [id,x,y] of [['core1',hi,lo],['core2',lo,hi],['core3',hi,hi],['core4',mid,mid],['core5',lo,mid],['core6',hi,mid],['core7',mid,lo],['core8',mid,hi]])addCard(id,x+.5,y+.5);
 addControl('reactor1',mid+.5,lo+2.5,'REACTOR I · POWER',1);
 addControl('reactor2',lo+.5,lo+.5,'REACTOR II · PRESSURE',2);
 addControl('reactor3',mid+.5,hi-1.5,'REACTOR III · INSULATION',3);
 addControl('reactor4',hi+.5,lo+2.5,'REACTOR IV · COOLING',4);
 for(const [i,x,y] of [['fA',lo,mid],['fB',hi,mid],['fC',mid,hi]])addPickup(i,x+1.5,y+1.5,'stamina','ENERGY DRINK',1);
 for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2],[mid+2,mid+2]])addLocker(x+.5,y+.5);
 addGate('f-shortcut',mid,lo+6,'EMERGENCY PASSAGE',{cards:2},'Collect two cores');
 addGate('f-rescue',mid,hi-6,'MAINTENANCE THRESHOLD',{panel:'reactor2'},'Activate the second reactor');
 addGate('f-core',hi-5,mid,'COOLING CORRIDOR',{panel:'reactor4'},'Activate the fourth reactor');
 gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
 scatterEnvironmentalProps(28,12,[...gameSession.fuses,...gameSession.terminals]);
 scatterEnergyDrinks(3);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel3(){
 document.body.classList.remove('level2','pig-level','procedural-level');document.body.classList.add('final-level');
 createFinalWorld();commonFacilityReset();
 gameSession.guards=[makeGuard(6.5,31.5,'cat'),makeGuard(36.5,6.5,'watcher'),makeGuard(32.5,31.5,'listener')];
 gameSession.guards[0].a=-PI/2;gameSession.guards[1].a=PI;gameSession.guards[2].a=0;gameSession.cat=gameSession.guards[0];
}

