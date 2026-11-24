function createFinalWorld(){
 const [lo,mid,hi]=carveFriendlyLayout(57,882971);
 GOAL=8;doors=[];fuses=[];terminals=[];interactables=[];bonusItems=[];props=[];decoys=[];
 for(const [id,x,y] of [['core1',hi,lo],['core2',lo,hi],['core3',hi,hi],['core4',mid,mid],['core5',lo,mid],['core6',hi,mid],['core7',mid,lo],['core8',mid,hi]])addCard(id,x+.5,y+.5);
 addControl('reactor1',mid+.5,lo+.5,'REAKTOR I · ZASILANIE',1);
 addControl('reactor2',lo+.5,lo+.5,'REAKTOR II · CISNIENIE',2);
 addControl('reactor3',mid+.5,hi+.5,'REAKTOR III · IZOLACJA',3);
 addControl('reactor4',hi+.5,lo+.5,'REAKTOR IV · CHLODZENIE',4);
 for(const [i,x,y] of [['fA',lo,mid],['fB',hi,mid],['fC',mid,hi]])addPickup(i,x+1.5,y+1.5,'decoy','SYGNALIZATOR',2);
 for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2],[mid+2,mid+2]])addLocker(x+.5,y+.5);
 addGate('f-shortcut',mid,lo+6,'PRZEJSCIE AWARYJNE',{cards:2},'Zdobadz dwa rdzenie');
 addGate('f-rescue',mid,hi-6,'PROG SERWISOWY',{panel:'reactor2'},'Uruchom drugi reaktor');
 addGate('f-core',hi-5,mid,'KORYTARZ CHLODNI',{panel:'reactor4'},'Uruchom czwarty reaktor');
 exitCell={x:hi-3,y:hi};world[hi][hi-3]=3;
 scatterEnvironmentalProps(28,12,[...fuses,...terminals]);
 scatterEnergyDrinks(3);
 seen=Array.from({length:N},()=>Array(N).fill(false));
}

function resetLevel3(){
 document.body.classList.remove('level2','pig-level','procedural-level');document.body.classList.add('final-level');
 createFinalWorld();commonFacilityReset();
 guards=[makeGuard(6.5,31.5,'cat'),makeGuard(36.5,6.5,'watcher'),makeGuard(32.5,31.5,'listener')];
 guards[0].a=-PI/2;guards[1].a=PI;guards[2].a=0;cat=guards[0];
}

