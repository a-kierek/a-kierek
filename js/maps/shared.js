function addGate(id,x,y,title,requires,hint){
  gameSession.world[y][x]=4;gameSession.doors.push({id,x,y,title,requires,hint,open:false});
}

function addPickup(id,x,y,type,name,quantity=1){
  gameSession.world[Math.floor(y)][Math.floor(x)]=0;
  const entry={id,x,y,type,name,quantity,taken:false,phase:rnd()*6};
  if(type==='stamina'){entry.energySprite=Math.floor(mapRandom()*ENERGY_DRINK_PNGS.length);entry.fakeMonster=false;}
  gameSession.bonusItems.push(entry);
}

function prepareEnergyDrinkLottery(){
 const drinks=gameSession.bonusItems.filter(item=>item.type==='stamina');
 for(const item of drinks)item.fakeMonster=false;
 if(drinks.length)drinks[Math.floor(mapRandom()*drinks.length)].fakeMonster=true;
}

function scatterEnergyDrinks(count=3){
 const distances=bfsDistances(3,3), candidates=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||distances[y][x]<7||Math.hypot(x-gameSession.exitCell.x,y-gameSession.exitCell.y)<3.5)continue;
  if([...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems].some(q=>Math.hypot(q.x-x-.5,q.y-y-.5)<3.2))continue;
  candidates.push({x,y,d:distances[y][x]});
 }
 candidates.sort(()=>rnd()-.5);
 const picked=[];
 for(const q of candidates){
  if(picked.every(p=>Math.hypot(p.x-q.x,p.y-q.y)>=7))picked.push(q);
  if(picked.length===count)break;
 }
 picked.forEach((q,i)=>addPickup('energy-'+i,q.x+.5,q.y+.5,'stamina','ENERGY DRINK'));
 prepareEnergyDrinkLottery();
}

function addCard(id,x,y){gameSession.world[Math.floor(y)][Math.floor(x)]=0;gameSession.fuses.push({id,x,y,taken:false,phase:rnd()*TAU})}

function addControl(id,x,y,title,order=0){gameSession.world[Math.floor(y)][Math.floor(x)]=0;let item={id,x,y,type:'panel',title,used:false,order};gameSession.interactables.push(item);gameSession.terminals.push(item)}

function addLocker(x,y){gameSession.world[Math.floor(y)][Math.floor(x)]=0;gameSession.interactables.push({id:'hide-'+x+'-'+y,x,y,type:'hide',title:'LOCKER / HIDING PLACE'})}


function floorSlots(){
  const out=[];
  for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++)if(gameSession.world[y][x]===0)out.push({x,y});
  return out;
}

function scatterEnvironmentalProps(bloodCount,hazardCount,avoid=[]){
  const chosen=[];
  const blocked=[{x:Math.floor(gameSession.player.x||3.5),y:Math.floor(gameSession.player.y||3.5)},{x:gameSession.exitCell.x,y:gameSession.exitCell.y},...avoid.map(p=>({x:Math.floor(p.x),y:Math.floor(p.y)}))];
  const cells=floorSlots().sort(()=>rnd()-.5);
  function okay(c){
    if(blocked.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<3.2))return false;
    if(chosen.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<2.4))return false;
    return true;
  }
  for(const c of cells){if(chosen.length>=bloodCount+hazardCount)break;if(!okay(c))continue;chosen.push(c)}
  chosen.forEach((c,i)=>gameSession.props.push({type:i<hazardCount?'hazard':'blood',x:c.x+.5+(rnd()-.5)*.18,y:c.y+.5+(rnd()-.5)*.18,phase:rnd()*TAU,size:((i<hazardCount)?.68:.74)+rnd()*.12}));
}

function refreshHpHud(){
  if(!UI.hpFill||!UI.hpValue||!gameSession.player) return;
  const hp=clamp(gameSession.player.hp??100,0,100);
  UI.hpFill.style.width=hp+'%';
  UI.hpValue.textContent=Math.round(hp)+' / 100';
}

function primeHealth(){
  gameSession.player.hp=100;gameSession.player.lastHazardHit=-999;gameSession.player.lastDamageAt=-999;gameSession.player.regenBucket=0;refreshHpHud();
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
  if(tutorialCompleted||gameSession.level!==1)return;
  if(tutorialStep===0){showToast('SAMOUCZEK · WASD: ruch, MYSZ: obrot, SHIFT: bieg, CTRL: skradanie.',5);tutorialStep=1;return}
  if(tutorialStep===1&&gameSession.elapsed>8){showToast('FOLLOW THE ARROW AND COLLECT BATTERIES. F TOGGLES FLASHLIGHT, M OPENS MAP.',5);tutorialStep=2;return}
  if(tutorialStep===2&&gameSession.player.collected>=1){showToast('GOOD. COLLECT ALL ITEMS, THEN FIND THE GREEN EXIT.',4.5);tutorialStep=3;return}
  if(tutorialStep===3&&gameSession.awake){showToast('MARMUR IS AWAKE. RUN AND AVOID DEAD ENDS.',5);tutorialStep=4;return}
  if(tutorialStep===4&&gameSession.player.collected>=gameSession.GOAL){showToast('THE EXIT IS OPEN. REACH THE GREEN DOOR.',4.5);tutorialStep=5;return}
}

// Shields protect against contact and toxic damage for 12 simulation seconds.
// Reactor meltdown remains a failed objective, not ordinary damage.
function damageBlocked(cause){
 if(!godMode&&(cause==='meltdown'||gameSession.elapsed>=(gameSession.player.shieldUntil||0)))return false;
 if(gameSession.elapsed>lastShieldToast+2){showToast(godMode?'ADMIN GOD MODE · NIEWRAZLIWOSC':'SHIELD · DAMAGE BLOCKED',1.8);lastShieldToast=gameSession.elapsed;}
 return true;
}
function applyHazardsAndRegen(dt){
  const hazards=gameSession.props.filter(p=>p.type==='hazard'&&(!p.expires||p.expires>gameSession.elapsed));
  const touching=hazards.find(h=>Math.hypot(gameSession.player.x-h.x,gameSession.player.y-h.y)<.7);
  if(touching && gameSession.elapsed-(gameSession.player.lastHazardHit??-999)>=5){
    if(!damageBlocked('hazard')){
    gameSession.player.lastHazardHit=gameSession.elapsed;gameSession.player.lastDamageAt=gameSession.elapsed;gameSession.player.regenBucket=0;
    gameSession.player.hp=Math.max(0,(gameSession.player.hp??100)-50);refreshHpHud();playHurt();
    showToast('☣ TOKSYCZNY PLYN · -50 HP',2.8);
    if(gameSession.player.hp<=0&&lose('hazard'))return true;
    }
  }
  if(gameSession.level!==12&&(gameSession.player.hp??100)<100){
    // First healing tick after two seconds without a hit, then 10 HP every two seconds.
    gameSession.player.regenBucket=(gameSession.player.regenBucket||0)+dt;
    if(gameSession.elapsed-(gameSession.player.lastDamageAt??-999)>=2){
      while(gameSession.player.regenBucket>=2 && gameSession.player.hp<100){gameSession.player.regenBucket-=2;gameSession.player.hp=Math.min(100,gameSession.player.hp+10);refreshHpHud();}
    }
  }
  return false;
}

function chooseSpawnView(){
  let longest=-1,best=0;
  for(let i=0;i<64;i++){
    let a=TAU*i/64,d=.22;
    for(;d<17;d+=.17)if(isWall(gameSession.player.x+Math.cos(a)*d,gameSession.player.y+Math.sin(a)*d))break;
    if(d>longest){longest=d;best=a}
  }
  gameSession.player.a=best;
}

function commonFacilityReset(){
  gameSession.player={x:3.5,y:3.5,a:.32,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hidden:false,hp:100,maxHp:100};
  gameSession.keysOwned=new Set();gameSession.noiseEvents=[];gameSession.crouching=false;gameSession.eventTimer=43;gameSession.eventState=null;gameSession.cameraFloor=1;gameSession.stats={doors:0,noises:0,panels:0};
  gameSession.elapsed=0;gameSession.clock=0;gameSession.awake=true;gameSession.wakeAt=0;gameSession.walkPhase=0;gameSession.nearCat=Infinity;gameSession.alertUntil=0;gameSession.toastTimeout=0;gameSession.flashUntil=0;gameSession.mapOn=false;gameSession.guardSight=0;gameSession.guardNoise=0;gameSession.alarmTimer=0;gameSession.interactReady=null;gameSession.guardCallCooldown=0;
  UI.map.classList.remove('visible');UI.count.textContent='0';$('required').textContent=gameSession.GOAL;
  setUIIcon(document.querySelector('.chip .gem'),gameSession.level===2?'archive':'spark');
  $('levelLabel').textContent=gameSession.level===2?'LEVEL 2 / FLOODED COMPLEX':'FINAL LEVEL / BLOODY ZONE';
  UI.clock.textContent='00:00';UI.stamina.style.width=staminaWidth();UI.danger.style.opacity=0;UI.toast.classList.remove('visible');
  $('interactHint').style.display='none';$('stealthStatus').textContent='● UNDETECTED';$('missionDetails').style.display='block';
  primeHealth();chooseSpawnView();updateSeen();updateObjectiveFacility();updateTutorialVisibility();
}

function requirementReason(g){
  const req=g.requires||{};
  if(req.key&&!gameSession.keysOwned.has(req.key))return g.hint;
  if(req.item&&!gameSession.fuses.some(f=>f.id===req.item&&f.taken))return g.hint;
  if(req.panel&&!gameSession.terminals.some(t=>t.id===req.panel&&t.used))return g.hint;
  if(req.cards!=null&&gameSession.player.collected<req.cards)return g.hint;
  if(req.panels!=null&&gameSession.terminals.filter(t=>t.used).length<req.panels)return g.hint;
  return '';
}
