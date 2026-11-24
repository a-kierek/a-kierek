function addGate(id,x,y,title,requires,hint){
  world[y][x]=4;doors.push({id,x,y,title,requires,hint,open:false});
}

function addPickup(id,x,y,type,name,quantity=1){
  world[Math.floor(y)][Math.floor(x)]=0;
  const entry={id,x,y,type,name,quantity,taken:false,phase:rnd()*6};
  if(type==='stamina'){entry.energySprite=Math.floor(Math.random()*ENERGY_DRINK_PNGS.length);entry.fakeMonster=false;}
  bonusItems.push(entry);
}

function prepareEnergyDrinkLottery(){
 const drinks=bonusItems.filter(item=>item.type==='stamina');
 for(const item of drinks)item.fakeMonster=false;
 if(drinks.length)drinks[Math.floor(Math.random()*drinks.length)].fakeMonster=true;
}

function scatterEnergyDrinks(count=3){
 const distances=bfsDistances(3,3), candidates=[];
 for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){
  if(world[y][x]!==0||distances[y][x]<7||Math.hypot(x-exitCell.x,y-exitCell.y)<3.5)continue;
  if([...fuses,...terminals,...bonusItems].some(q=>Math.hypot(q.x-x-.5,q.y-y-.5)<3.2))continue;
  candidates.push({x,y,d:distances[y][x]});
 }
 candidates.sort(()=>rnd()-.5);
 const picked=[];
 for(const q of candidates){
  if(picked.every(p=>Math.hypot(p.x-q.x,p.y-q.y)>=7))picked.push(q);
  if(picked.length===count)break;
 }
 picked.forEach((q,i)=>addPickup('energy-'+i,q.x+.5,q.y+.5,'stamina','NAPOJ ENERGII'));
 prepareEnergyDrinkLottery();
}

function addCard(id,x,y){world[Math.floor(y)][Math.floor(x)]=0;fuses.push({id,x,y,taken:false,phase:rnd()*TAU})}

function addControl(id,x,y,title,order=0){world[Math.floor(y)][Math.floor(x)]=0;let item={id,x,y,type:'panel',title,used:false,order};interactables.push(item);terminals.push(item)}

function addLocker(x,y){world[Math.floor(y)][Math.floor(x)]=0;interactables.push({id:'hide-'+x+'-'+y,x,y,type:'hide',title:'SZAFKA / SCHOWEK'})}


function floorSlots(){
  const out=[];
  for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++)if(world[y][x]===0)out.push({x,y});
  return out;
}

function scatterEnvironmentalProps(bloodCount,hazardCount,avoid=[]){
  const chosen=[];
  const blocked=[{x:Math.floor(player.x||3.5),y:Math.floor(player.y||3.5)},{x:exitCell.x,y:exitCell.y},...avoid.map(p=>({x:Math.floor(p.x),y:Math.floor(p.y)}))];
  const cells=floorSlots().sort(()=>rnd()-.5);
  function okay(c){
    if(blocked.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<3.2))return false;
    if(chosen.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<2.4))return false;
    return true;
  }
  for(const c of cells){if(chosen.length>=bloodCount+hazardCount)break;if(!okay(c))continue;chosen.push(c)}
  chosen.forEach((c,i)=>props.push({type:i<hazardCount?'hazard':'blood',x:c.x+.5+(rnd()-.5)*.18,y:c.y+.5+(rnd()-.5)*.18,phase:rnd()*TAU,size:((i<hazardCount)?.68:.74)+rnd()*.12}));
}

function refreshHpHud(){
  if(!UI.hpFill||!UI.hpValue||!player) return;
  const hp=clamp(player.hp??100,0,100);
  UI.hpFill.style.width=hp+'%';
  UI.hpValue.textContent=Math.round(hp)+' / 100';
}

function primeHealth(){
  player.hp=100;player.lastHazardHit=-999;player.lastDamageAt=-999;player.regenBucket=0;refreshHpHud();
}

function updateTutorialVisibility(){
  if(!UI.tip)return;
  const visible=false; // Gameplay hints removed; controls remain in main menu and settings.
  UI.tip.style.display=visible?'block':'none';
}

function setControlsHintsPreference(value){
  showControlHints=!!value;controlsHintsTouched=true;
  progressWrite('catroomsShowControls',showControlHints?'1':'0');
  progressWrite('catroomsControlsTouched','1');
  for(const id of ['controlsHintToggle','controlsHintTogglePause','settingControls','menuSettingControls']){const el=$(id);if(el)el.checked=showControlHints}
  updateTutorialVisibility();
}

function setupLevel1Tutorial(){
  tutorialStep=tutorialCompleted?999:0;
  tutorialSeen=!tutorialCompleted;
}

function updateLevel1Tutorial(){
  // Kontrolki dostepne wylacznie w menu/ustawieniach, bez komunikatow klawiszy podczas rozgrywki.
  return;
  if(tutorialCompleted||level!==1)return;
  if(tutorialStep===0){showToast('SAMOUCZEK · WASD: ruch, MYSZ: obrot, SHIFT: bieg, CTRL: skradanie.',5);tutorialStep=1;return}
  if(tutorialStep===1&&elapsed>8){showToast('PODAZAJ ZA STRZALKA I ZBIERAJ BATERIE. F wlacza latarke, M pokazuje mape.',5);tutorialStep=2;return}
  if(tutorialStep===2&&player.collected>=1){showToast('DOBRZE. ZBIERZ WSZYSTKIE PRZEDMIOTY, A POTEM SZUKAJ ZIELONEGO WYJSCIA.',4.5);tutorialStep=3;return}
  if(tutorialStep===3&&awake){showToast('MARMUR SIE OBUDZIL. Uciekaj, uzywaj sprintu i nie wpadaj na slepe zaulki.',5);tutorialStep=4;return}
  if(tutorialStep===4&&player.collected>=GOAL){showToast('WYJSCIE JEST JUZ OTWARTE. DOTRZYJ DO ZIELONYCH DRZWI.',4.5);tutorialStep=5;return}
}

function applyHazardsAndRegen(dt){
  const hazards=props.filter(p=>p.type==='hazard'&&(!p.expires||p.expires>elapsed));
  const touching=hazards.find(h=>Math.hypot(player.x-h.x,player.y-h.y)<.7);
  if(touching && elapsed-(player.lastHazardHit??-999)>=5){
    player.lastHazardHit=elapsed;player.lastDamageAt=elapsed;player.regenBucket=0;
    player.hp=Math.max(0,(player.hp??100)-50);refreshHpHud();playHurt();
    showToast('☣ TOKSYCZNY PLYN · -50 HP',2.8);
    if(player.hp<=0){lose('hazard');return true;}
  }
  if((player.hp??100)<100){
    // First healing tick after two seconds without a hit, then 10 HP every two seconds.
    player.regenBucket=(player.regenBucket||0)+dt;
    if(elapsed-(player.lastDamageAt??-999)>=2){
      while(player.regenBucket>=2 && player.hp<100){player.regenBucket-=2;player.hp=Math.min(100,player.hp+10);refreshHpHud();}
    }
  }
  return false;
}

function chooseSpawnView(){
  let longest=-1,best=0;
  for(let i=0;i<64;i++){
    let a=TAU*i/64,d=.22;
    for(;d<17;d+=.17)if(isWall(Math.floor(player.x+Math.cos(a)*d),Math.floor(player.y+Math.sin(a)*d)))break;
    if(d>longest){longest=d;best=a}
  }
  player.a=best;
}

function commonFacilityReset(){
  player={x:3.5,y:3.5,a:.32,stamina:100,collected:0,moving:false,flash:true,hidden:false,decoys:1,hp:100,maxHp:100};
  keysOwned=new Set();noiseEvents=[];decoys=[];crouching=false;eventTimer=43;eventState=null;cameraFloor=1;stats={doors:0,noises:0,panels:0};
  elapsed=0;clock=0;awake=true;wakeAt=0;walkPhase=0;nearCat=Infinity;alertUntil=0;toastTimeout=0;flashUntil=0;mapOn=false;guardSight=0;guardNoise=0;alarmTimer=0;interactReady=null;guardCallCooldown=0;
  UI.map.classList.remove('visible');UI.count.textContent='0';$('required').textContent=GOAL;
  setUIIcon(document.querySelector('.chip .gem'),level===2?'archive':'spark');
  $('levelLabel').textContent=level===2?'LEVEL 2 / ZALANY KOMPLEKS':'FINAL LEVEL / CZERWONA STREFA';
  UI.clock.textContent='00:00';UI.stamina.style.width='100%';UI.danger.style.opacity=0;UI.toast.classList.remove('visible');
  $('interactHint').style.display='none';$('stealthStatus').textContent='● NIEWYKRYTY';$('missionDetails').style.display='block';
  primeHealth();chooseSpawnView();updateSeen();updateObjectiveFacility();updateTutorialVisibility();
}

function requirementReason(g){
  const req=g.requires||{};
  if(req.key&&!keysOwned.has(req.key))return g.hint;
  if(req.item&&!fuses.some(f=>f.id===req.item&&f.taken))return g.hint;
  if(req.panel&&!terminals.some(t=>t.id===req.panel&&t.used))return g.hint;
  if(req.cards!=null&&player.collected<req.cards)return g.hint;
  if(req.panels!=null&&terminals.filter(t=>t.used).length<req.panels)return g.hint;
  return '';
}
