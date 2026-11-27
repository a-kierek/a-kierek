function collectObjectivePickup(item){
 item.taken=true;
 playPickup();
 if(gameSession.graphicsDemo)return;

 const progress=++gameSession.player.collected;
 UI.count.textContent=progress;
 const total=gameSession.GOAL;
 gameSession.flashUntil=gameSession.elapsed+(gameSession.level===1?.3:.22);
 if(gameSession.level===1){
  if(!gameSession.awake&&gameSession.wakeAt===Infinity){
   gameSession.wakeAt=gameSession.elapsed+5;
   showToast('⚡ BATTERY FOUND · SOMETHING WOKE UP',4);
  }else showToast(`⚡ FOUND BATTERIES ${progress}/${total}`);
  if(progress>=total){
   UI.goal.textContent='FIND THE GREEN EXIT';
   showToast('✓ POWER RESTORED · ESCAPE!',5);
   playUnlock();
  }
  return;
 }

 const model=objectivePickupModel(item);
 const label=model==='card'?'▣ CARD':model==='battery'?'⚡ BATTERY':gameSession.level===4?'FOOD':gameSession.level===10?'DOWODY':gameSession.level===5?'✧ FOUND':'✦ CORE';
 showToast(`${label} ${progress}/${total}`,2.9);
 addNoise(item.x,item.y,gameSession.level===3?8:5,'zbieranie');
}

const interactionLabels={
 push:'PUSH OBJECT',lockedExit:'CHECK EXIT',safeDoor:'OPEN / CLOSE ROOM',slot:'PLAY FOR 1 COIN',
 secret:'CHECK LOOSE PANEL',door:'OPEN / CHECK GATE',hide:'HIDE',unhide:'WYJDZ',stairs:'TAKE STAIRS',repair:'REPAIR REACTOR'
};
const REACTOR_HOLD_SECONDS=5.75;
function needsInteractionHold(target){
 return target?.type==='repair'||(target?.type==='panel'&&/reactor|reaktor/i.test(target.title||''));
}
function showInteractionHint(target,fallback='AKTYWUJ PANEL'){
 gameSession.interactReady=target;
 const hint=$('interactHint');
 hint.style.display=target?'block':'none';
 hint.classList.toggle('pickup-hint',target?.type==='pickup');
 if(!target)return;
 const hold=needsInteractionHold(target);
 const label=target.type==='pickup'||hold?(target.title||interactionLabels[target.type]):interactionLabels[target.type]||fallback;
 const elapsed=gameSession.interactionHold?.ref===target.ref?gameSession.interactionHold?.elapsed:0;
 const holdText=elapsed>0?' · '+Math.floor(100*elapsed/REACTOR_HOLD_SECONDS)+'%':' · 5.75 S';
 hint.textContent=(hold?'HOLD [ E ] ': '[ E ] ')+label+(hold?holdText:'');
}

function updateInteractionHold(dt){
 const hold=gameSession.interactionHold;
 if(!hold)return;
 const target=gameSession.interactReady;
 if(gameSession.state!=='playing'||target?.ref!==hold.ref||!needsInteractionHold(target)){
  gameSession.interactionHold=null;
  return;
 }
 hold.elapsed+=dt;
 if(hold.elapsed+1e-9<REACTOR_HOLD_SECONDS){showInteractionHint(target);return;}
 gameSession.interactionHold=null;
 if(target.type==='repair')finishHardEmergency();
 else activatePanel(target.ref);
 showInteractionHint(findInteractable());
}

function updateBase(dt){gameSession.elapsed+=dt;gameSession.clock+=dt;UI.clock.textContent=formatTime(gameSession.clock);if(gameSession.elapsed>gameSession.toastTimeout)UI.toast.classList.remove('visible');if(!gameSession.awake&&gameSession.elapsed>=gameSession.wakeAt){gameSession.awake=true;showToast('⚠ IT HEARS YOU. KEEP MOVING.',4);playSting()}
 updateLevel1Tutorial();
 const dirX=Math.cos(gameSession.player.a),dirY=Math.sin(gameSession.player.a),sX=-dirY,sY=dirX;
 let forward=(keys['KeyW']||keys['ArrowUp']?1:0)-(keys['KeyS']||keys['ArrowDown']?1:0)-touchY;
 let strafe=(keys['KeyD']?1:0)-(keys['KeyA']?1:0)+touchX;
 if(keys['ArrowLeft'])gameSession.player.a-=dt*2.4;if(keys['ArrowRight'])gameSession.player.a+=dt*2.4;
 let len=Math.hypot(forward,strafe);gameSession.player.moving=len>.07;
 gameSession.crouching=!!(keys['ControlLeft']||keys['ControlRight']||keys['KeyC']||touchCrouch);const sprint=!gameSession.crouching&&(keys['ShiftLeft']||keys['ShiftRight']||touchRun)&&len>.07&&gameSession.player.stamina>3;
 let speed=(gameSession.crouching?1.35:(sprint?4.15:2.55))*(gameSession.elapsed<(gameSession.player.energySlowUntil||0)?.55:1);
 if(sprint)gameSession.player.stamina=Math.max(0,gameSession.player.stamina-dt*30);else gameSession.player.stamina=Math.min(staminaMax(),gameSession.player.stamina+dt*19);
 UI.stamina.style.width=staminaWidth();
 if(gameSession.player.moving){let t=dt*speed/Math.max(1,len);move(gameSession.player,(forward*dirX+strafe*sX)*t,(forward*dirY+strafe*sY)*t,.22);gameSession.walkPhase+=dt*(sprint?14:9);}else gameSession.walkPhase*=Math.max(0,1-dt*7);
 if(gameSession.player.a>PI)gameSession.player.a-=TAU;if(gameSession.player.a<-PI)gameSession.player.a+=TAU;
 updateCoinCounter();updateSeen();
 showInteractionHint(findInteractable(),'UZYJ');
 if(applyHazardsAndRegen(dt))return;
 if(gameSession.awake){updateGuard(gameSession.cat,dt,0);let distance=Math.hypot(gameSession.cat.x-gameSession.player.x,gameSession.cat.y-gameSession.player.y);gameSession.nearCat=distance;UI.danger.style.opacity=distance<5?String(clamp((5-distance)/2,0,1)):'0';if(distance<.67&&!isSafeRoomProtected()&&lineOfSight(gameSession.cat.x,gameSession.cat.y,gameSession.player.x,gameSession.player.y)&&lose())return;
 }else{gameSession.nearCat=Infinity;UI.danger.style.opacity=0}
 // Admin-spawned guards on Level 1 must use the same simulation as their sprites.
 for(let i=0;i<gameSession.guards.length;i++){const g=gameSession.guards[i];updateGuard(g,dt,i+1);const d=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y);gameSession.nearCat=Math.min(gameSession.nearCat,d);if(d<.66&&!isSafeRoomProtected()&&lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y)&&lose(g.id))return;}
 if(gameSession.guards.length)UI.danger.style.opacity=gameSession.nearCat<5?String(clamp((5-gameSession.nearCat)/2,0,1)):'0';
 if(gameSession.player.collected===gameSession.GOAL&&Math.hypot(gameSession.player.x-(gameSession.exitCell.x+.5),gameSession.player.y-(gameSession.exitCell.y+.5))<1.52&&lineOfSight(gameSession.player.x,gameSession.player.y,gameSession.exitCell.x+.5,gameSession.exitCell.y+.5,{allowTargetTile:true})){playDoorMovement(true);win();return}
 let target=gameSession.player.collected===gameSession.GOAL?{x:gameSession.exitCell.x+.5,y:gameSession.exitCell.y+.5}:gameSession.fuses.filter(f=>!f.taken).sort((a,b)=>Math.hypot(gameSession.player.x-a.x,gameSession.player.y-a.y)-Math.hypot(gameSession.player.x-b.x,gameSession.player.y-b.y))[0];
 if(target){let dx=target.x-gameSession.player.x,dy=target.y-gameSession.player.y;let angle=Math.atan2(dy,dx)-gameSession.player.a;while(angle>PI)angle-=TAU;while(angle<-PI)angle+=TAU;UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;let meters=Math.hypot(dx,dy);UI.signal.innerHTML=`<strong>${gameSession.player.collected===gameSession.GOAL?'EXIT':'ELECTRIC SIGNAL'}</strong> · ${Math.round(meters)} m`}
 if(gameSession.mapOn&&Math.floor(gameSession.elapsed*5)!==Math.floor((gameSession.elapsed-dt)*5))drawMap();
}

function collectBonusPickup(item){
 item.taken=true;
 const quantity=item.quantity||1;
 if(item.type==='coin'){
  gameSession.player.coins=(gameSession.player.coins||0)+quantity;
  gameSession.stats.coins=(gameSession.stats.coins||0)+quantity;
  updateCoinCounter();
 }else if(item.type==='key')gameSession.keysOwned.add(item.id);
 else if(item.type==='hardSlow'){gameSession.player.slowCharges=(gameSession.player.slowCharges||0)+quantity;ensureInventory().slow=gameSession.player.slowCharges;}
 else if(item.type==='hardFreeze'){gameSession.player.freezeCharges=(gameSession.player.freezeCharges||0)+quantity;ensureInventory().freeze=gameSession.player.freezeCharges;}
 else if(item.type==='stamina'){ensureInventory().energy.push({energySprite:item.energySprite||0,fakeMonster:!!item.fakeMonster});}
 else if(item.type==='shield')ensureInventory().shield+=quantity;
 if(item.type==='coin')playCoinPickup();else playPickup();
 showToast('PICKED UP: '+item.name+(quantity>1?' +'+quantity:''),2.5);
 updateInventoryUI();
}

function findInteractable(){
  if(gameSession.player.hidden)return{type:'unhide',title:'LEAVE HIDING PLACE'};
  const all=[];
  const {x,y}=gameSession.player;
  for(const item of gameSession.fuses){
    if(item.taken||Math.hypot(item.x-x,item.y-y)>=1.1)continue;
    const model=objectivePickupModel(item);
    const label=model==='battery'?'BATTERY':model==='card'?'CARD':renderStage()===3?'CORE':renderStage()===4?'FOOD':'ITEM';
    all.push({type:'pickup',ref:item,x:item.x,y:item.y,title:'PICK UP '+label,objective:true});
  }
  for(const item of gameSession.bonusItems){
    if(item.taken||Math.hypot(item.x-x,item.y-y)>=1.1)continue;
    all.push({type:'pickup',ref:item,x:item.x,y:item.y,title:'PICK UP '+(item.name||item.type).toUpperCase()});
  }
  for(const prop of gameSession.props){
   if(prop.pushable&&Math.hypot(prop.x-x,prop.y-y)<.95){
    all.push({type:'push',ref:prop,x:prop.x,y:prop.y,title:'PUSH OBJECT'});
   }
  }
  for(let d of gameSession.doors)if(!d.open)all.push({type:'door',ref:d,x:d.x+.5,y:d.y+.5,title:d.title});
  const exit=gameSession.exitCell;
  if(gameSession.world[exit.y]?.[exit.x]===3&&
     (gameSession.player.collected!==gameSession.GOAL||gameSession.terminals.some(t=>!t.used))){
    all.push({type:'lockedExit',x:exit.x+.5,y:exit.y+.5,title:'EXIT LOCKED'});
  }
  for(const room of bossRushRooms())all.push({type:'safeDoor',ref:room,x:room.doorX+.5,y:room.doorY+.5,title:'SAFE ROOM DOOR'});
  for(let o of gameSession.interactables)if(o.type==='hide'||o.type==='stairs'||o.type==='slot'||!o.used)all.push({type:o.type,ref:o,x:o.x,y:o.y,title:o.title});
  all.sort((a,b)=>Math.hypot(gameSession.player.x-a.x,gameSession.player.y-a.y)-Math.hypot(gameSession.player.x-b.x,gameSession.player.y-b.y));
  return all.find(o=>{
    const gate=o.type==='door'||o.type==='lockedExit';
    const range=o.type==='pickup'?1.1:gate?1.65:1.4;
    return Math.hypot(gameSession.player.x-o.x,gameSession.player.y-o.y)<range&&
      lineOfSight(gameSession.player.x,gameSession.player.y,o.x,o.y,{allowTargetTile:gate||o.type==='safeDoor'||o.type==='secret'||o.type==='push'||!!o.ref?.attachment,allowTargetFurniture:['slot','panel','repair'].includes(o.type)});
  })||null;
}

function interact(){
  if(gameSession.state!=='playing')return;
  const target=findInteractable();
  if(target?.type==='pickup'){
    if(target.objective)collectObjectivePickup(target.ref);
    else collectBonusPickup(target.ref);
    if(!gameSession.graphicsDemo&&gameSession.level!==1)updateObjectiveFacility();
    showInteractionHint(findInteractable());
    return;
  }
  if(gameSession.graphicsDemo){
    if(toggleGraphicsDemoDoor())playDoorMovement(gameSession.safeRoom.open);
    return;
  }
  if(target?.type==='push'){pushRoomProp(target.ref);return;}
  if(target?.type==='safeDoor'){safeRoomInteraction(target.ref);return;}
  if(target?.type==='slot'){slotMachineSpin(target.ref);return;}
  if(target?.type==='lockedExit'){
    createGameSample('doorLocked',.32);showToast('EXIT LOCKED · COMPLETE THE OBJECTIVE',2.4);return;
  }
  if(gameSession.level===1)return;
  if(!target){showToast('NOTHING TO INTERACT WITH',1.4);return}
  const o=target.ref;
  if(needsInteractionHold(target)){
    gameSession.interactionHold={ref:o,elapsed:0};
    showInteractionHint(target);
    return;
  }
  if(target.type==='unhide'){gameSession.player.hidden=false;showToast('YOU LEFT HIDING',1.6);return}
  if(target.type==='hide'){gameSession.player.hidden=true;gameSession.player.flash=false;showToast('HIDDEN · PRESS E TO LEAVE',2.5);return}
  if(target.type==='secret'){
    if(o.used)return;
    o.used=true;o.gate.open=true;
    gameSession.world[o.gate.y][o.gate.x]=0;
    markWorldChanged();playDoorMovement(true);
    showToast('SECRET PASSAGE OPEN',2.8);
    return;
  }
  if(target.type==='stairs'){
    // Stairwells only teleport after the power network connects the decks.
    if(!o.roomStairs&&!gameSession.terminals.some(t=>t.id==='reactor2'&&t.used)){showToast('STAIRS LOCKED · REACTOR II OFFLINE',2.8);return}
    if(gameSession.world[Math.floor(o.dest.y)]?.[Math.floor(o.dest.x)]!==0){showToast('UPPER FLOOR BLOCKED',2);return}
    gameSession.player.x=o.dest.x;gameSession.player.y=o.dest.y;gameSession.cameraFloor=o.dest.floor??(gameSession.player.y>40?2:1);
    gameSession.resetInterpolation();
    gameSession.flashUntil=gameSession.elapsed+.5;showToast('ACCESS TO SECTION '+(gameSession.cameraFloor===2?'B':'A'),2.5);playUnlock();return;
  }
  if(target.type==='door'){
    const why=o.bossGate?'Complete the current sector':requirementReason(o);
    if(why){createGameSample('doorLocked',.32);showToast('⛔ '+why.toUpperCase(),3);return}
    o.open=true;gameSession.world[o.y][o.x]=0;markWorldChanged();gameSession.stats.doors++;addNoise(o.x+.5,o.y+.5,11,'brama');
    playDoorMovement(true);showToast('✓ OPENED: '+o.title,2.8);updateObjectiveFacility();return;
  }
  if(target.type==='panel')activatePanel(o);
}

function activatePanel(o){
 if(o.used)return;
 if(gameSession.level===3){
   const next=gameSession.terminals.filter(t=>t.used).length+1;
   if(o.order!==next){gameSession.alarmTimer=9;addNoise(o.x,o.y,14,'alarm');createGameSample('reactorWrongOrder',.48);showToast(`⚠ WRONG ORDER! REACTOR ${next} MUST BE FIRST`,3.4);return}
 }
 o.used=true;gameSession.stats.panels++;addNoise(o.x,o.y,gameSession.level===3?15:10,'urzadzenie');
 playUnlock();showToast('✓ ACTIVATED: '+o.title,3.2);
 if(gameSession.level===3&&gameSession.stats.panels===gameSession.terminals.length)playWin();
 updateObjectiveFacility();return;
}

function updateObjectiveFacility(){
 if(gameSession.level===12){if(gameSession.bossRush)updateBossRushHUD();return;}
 const panels=gameSession.terminals.filter(t=>t.used).length,total=gameSession.terminals.length;
 UI.goal.textContent=gameSession.player.collected===gameSession.GOAL&&panels===total?'REACH THE GREEN EXIT':gameSession.level===2?`CARDS ${gameSession.player.collected}/${gameSession.GOAL} · PANELS ${panels}/${total}`:gameSession.level===4?`FOOD ${gameSession.player.collected}/${gameSession.GOAL} · DZWIGNIE ${panels}/${total}`:gameSession.level===10?`SEKTOR 05 · ITEMS ${gameSession.player.collected}/${gameSession.GOAL} · PANELS ${panels}/${total}`:isHardMode()?`HARD ${hardStage()} · ${gameSession.player.collected}/${gameSession.GOAL} · PANELS ${panels}/${total}`:gameSession.level===5?`ARTIFACTS ${gameSession.player.collected}/${gameSession.GOAL} · EXIT`: `CORES ${gameSession.player.collected}/${gameSession.GOAL} · REACTORS ${panels}/${total}`;
 const html=`<span class="icon-label">${uiIcon('key')} ${gameSession.keysOwned.size}</span><span class="icon-label">${uiIcon('door')} GATES ${gameSession.doors.filter(d=>d.open).length}/${gameSession.doors.length}</span>`;
 if($('missionDetails').dataset.stats!==String(gameSession.keysOwned.size)+':'+gameSession.doors.filter(d=>d.open).length){ $('missionDetails').dataset.stats=String(gameSession.keysOwned.size)+':'+gameSession.doors.filter(d=>d.open).length; $('missionDetails').innerHTML=html; }
}

function updateFacility(dt,finalMode){
  gameSession.elapsed+=dt;gameSession.clock+=dt;gameSession.guardCallCooldown=Math.max(0,gameSession.guardCallCooldown-dt);
  UI.clock.textContent=formatTime(gameSession.clock);if(gameSession.elapsed>gameSession.toastTimeout)UI.toast.classList.remove('visible');
  if(finalMode){
    gameSession.eventTimer-=dt;if(gameSession.eventTimer<=0){triggerFinalEvent();gameSession.eventTimer=48+rnd()*30}
    if(gameSession.eventState){gameSession.eventState.time-=dt;if(gameSession.eventState.time<=0){gameSession.eventState=null;showToast('SYSTEMS RETURNED TO NORMAL',2.7)}}
  }
  const dirX=Math.cos(gameSession.player.a),dirY=Math.sin(gameSession.player.a),sX=-dirY,sY=dirX;
  let forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchY;
  let strafe=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchX;
  if(keys.ArrowLeft)gameSession.player.a-=dt*2.4;if(keys.ArrowRight)gameSession.player.a+=dt*2.4;
  let len=Math.hypot(forward,strafe);
  gameSession.player.moving=len>.07&&!gameSession.player.hidden;
  gameSession.crouching=!!(keys.ControlLeft||keys.ControlRight||keys.KeyC||touchCrouch||gameSession.player.hidden);
  let sprint=!gameSession.crouching&&(keys.ShiftLeft||keys.ShiftRight||touchRun)&&gameSession.player.moving&&gameSession.player.stamina>3;
  let speed=(gameSession.crouching?1.28:sprint?3.95:2.45)*(isHardMode()&&hardPulseActive()?.62:1)*(gameSession.elapsed<(gameSession.player.energySlowUntil||0)?.55:1);
  gameSession.player.stamina=clamp(gameSession.player.stamina+(sprint?-22:(gameSession.eventState?.kind==='pressure'?8:18))*dt,0,staminaMax());
  UI.stamina.style.width=staminaWidth();
  if(gameSession.player.moving){
    let t=dt*speed/Math.max(1,len);move(gameSession.player,(forward*dirX+strafe*sX)*t,(forward*dirY+strafe*sY)*t,.22);
    let previousPhase=gameSession.walkPhase;gameSession.walkPhase+=dt*(sprint?14:gameSession.crouching?4:9);
    if(Math.floor(previousPhase/PI)!==Math.floor(gameSession.walkPhase/PI)){
      if(sprint||!gameSession.crouching&&finalMode){addNoise(gameSession.player.x,gameSession.player.y,sprint?(finalMode?12:9):2.7,'kroki')}
    }
  }else gameSession.walkPhase*=Math.max(0,1-dt*7);
  if(gameSession.player.a>PI)gameSession.player.a-=TAU;if(gameSession.player.a<-PI)gameSession.player.a+=TAU;
  updateCoinCounter();updateSeen();if(applyHazardsAndRegen(dt))return;
  gameSession.noiseEvents=gameSession.noiseEvents.filter(e=>e.expiry>gameSession.elapsed);
  showInteractionHint(findInteractable());
  gameSession.guardSight=Math.max(0,gameSession.guardSight-dt);gameSession.guardNoise=Math.max(0,gameSession.guardNoise-dt);
  let closest=Infinity;
  for(let i=0;i<gameSession.guards.length;i++){
    let g=gameSession.guards[i];
    if(gameSession.level===12&&gameSession.bossRush&&g.rushSector!==gameSession.bossRush.stage)continue;
    updateGuard(g,dt,i);
    let d=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y);closest=Math.min(closest,d);
    if(d<(g.sizeMultiplier&&g.sizeMultiplier<1?.49:.66)&&!isSafeRoomProtected()&&lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y)&&lose(g.id))return;
  }
  gameSession.nearCat=closest;UI.danger.style.opacity=closest<5?String(clamp((5-closest)/3,0,1)):'0';
  const chasing=gameSession.guards.some(g=>g.state==='chase');
  const stealthText=gameSession.player.hidden?'HIDDEN · PRESS E':chasing?'DETECTED · RUN!':gameSession.guards.some(g=>g.state==='search'||g.state==='suspicious')?'ENEMIES ARE SEARCHING':gameSession.crouching?'SKRADASZ SIE':'UNDETECTED';
 if($('stealthStatus').dataset.stealth!==stealthText){$('stealthStatus').dataset.stealth=stealthText;setUIIconText($('stealthStatus'),chasing?'warning':'eye',stealthText);}
  $('stealthStatus').style.color=chasing?'#ff847b':'#a4eadb';
  updateObjectiveFacility();
  const complete=gameSession.player.collected===gameSession.GOAL&&gameSession.terminals.every(t=>t.used);
  if(complete&&Math.hypot(gameSession.player.x-(gameSession.exitCell.x+.5),gameSession.player.y-(gameSession.exitCell.y+.5))<1.65&&lineOfSight(gameSession.player.x,gameSession.player.y,gameSession.exitCell.x+.5,gameSession.exitCell.y+.5,{allowTargetTile:true})){playDoorMovement(true);win();return}
  let targets=gameSession.hardEmergency&&isHardMode()?[gameSession.hardEmergency]:[...gameSession.fuses.filter(f=>!f.taken),...gameSession.terminals.filter(t=>!t.used)];
  if(!targets.length)targets=[{x:gameSession.exitCell.x+.5,y:gameSession.exitCell.y+.5}];
  targets.sort((a,b)=>Math.hypot(gameSession.player.x-a.x,gameSession.player.y-a.y)-Math.hypot(gameSession.player.x-b.x,gameSession.player.y-b.y));
  const target=targets[0];
  if(target){let dx=target.x-gameSession.player.x,dy=target.y-gameSession.player.y,angle=Math.atan2(dy,dx)-gameSession.player.a;
    while(angle>PI)angle-=TAU;while(angle<-PI)angle+=TAU;
    UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;
    UI.signal.innerHTML=`<strong>${complete?'EXIT':'TARGET INDICATOR'}</strong> · ${Math.round(Math.hypot(dx,dy))} m`;
  }
  if(finalMode){
    let newFloor=gameSession.player.y>=41?2:1;
    if(newFloor!==gameSession.cameraFloor){gameSession.cameraFloor=newFloor;showToast('STREFA '+(newFloor===2?'PODZIEMNA B':'GORNA A'),2.4)}
    $('eventTag').textContent=gameSession.eventState?'⚠ '+gameSession.eventState.label:'STREFA '+(gameSession.cameraFloor===2?'B / PODZIEMIA':'A / OBSERWATORIUM');
  }else $('eventTag').textContent=gameSession.level===10?'SEKTOR 05 · CHRUM & NIEZNAJOMY':gameSession.level===4?'CHRUM SECTOR · UWAZAJ NA SZARZE':isHardMode()?'HARD · SEED '+(hardSeed>>>0):gameSession.level===5?'PROCEDURALNY · SEED '+(proceduralSeed>>>0):'GLEBOKOSC -02 / KOMPLEKS';
  if(gameSession.mapOn&&Math.floor(gameSession.elapsed*5)!==Math.floor((gameSession.elapsed-dt)*5))drawMap();
}

function triggerFinalEvent(){
  const list=[
    {kind:'blackout',time:12,label:'ZANIK ZASILANIA'},
    {kind:'pressure',time:13,label:'SKOK CISNIENIA'},
    {kind:'siren',time:9,label:'ALARM SIRENS'},
    {kind:'fog',time:15,label:'AWARIA WENTYLACJI'}
  ];gameSession.eventState={...list[Math.floor(rnd()*list.length)]};
  if(typeof createGameSample==='function')createGameSample('metalCrack',.32);
  if(gameSession.eventState.kind==='siren'){
    let t=gameSession.terminals[Math.floor(rnd()*gameSession.terminals.length)];addNoise(t.x,t.y,22,'syrena');gameSession.alarmTimer=9;
    createGameSample('eventSiren',.38);
  }
  if(gameSession.eventState.kind==='blackout')createGameSample('eventBlackout',.38);
  if(gameSession.eventState.kind==='pressure')for(let g of gameSession.guards){g.patrolTarget=null;g.pathTimer=0}
  showToast('⚠ WYDARZENIE: '+gameSession.eventState.label,4);
}
