function pickup(){for(let f of fuses){if(f.taken)continue;if(Math.hypot(player.x-f.x,player.y-f.y)<.64){f.taken=true;player.collected++;UI.count.textContent=player.collected;playPickup();flashUntil=elapsed+.3;if(!awake&&wakeAt===Infinity){wakeAt=elapsed+5;showToast('⚡ BEZPIECZNIK ZDOBYTY · COS SIE OBUDZILO',4)}else showToast('⚡ ZNALEZIONO BATERIE '+player.collected+'/'+GOAL);if(player.collected>=GOAL){UI.goal.textContent='ODNAJDZ ZIELONE WYJSCIE';showToast('✓ ZASILANIE PRZYWROCONE · UCIEKAJ!',5);playUnlock()}}}}

function updateBase(dt){if(level===2){updateLevel2(dt);return}elapsed+=dt;clock+=dt;UI.clock.textContent=formatTime(clock);if(elapsed>toastTimeout)UI.toast.classList.remove('visible');if(!awake&&elapsed>=wakeAt){awake=true;showToast('⚠ ON CIE SLYSZY. NIE ZATRZYMUJ SIE.',4);playSting()}
 updateLevel1Tutorial();
 const dirX=Math.cos(player.a),dirY=Math.sin(player.a),sX=-dirY,sY=dirX;
 let forward=(keys['KeyW']||keys['ArrowUp']?1:0)-(keys['KeyS']||keys['ArrowDown']?1:0)-touchY;
 let strafe=(keys['KeyD']?1:0)-(keys['KeyA']?1:0)+touchX;
 if(keys['ArrowLeft'])player.a-=dt*2.4;if(keys['ArrowRight'])player.a+=dt*2.4;
 let len=Math.hypot(forward,strafe);player.moving=len>.07;
 crouching=!!(keys['ControlLeft']||keys['ControlRight']||keys['KeyC']||touchCrouch);const sprint=!crouching&&(keys['ShiftLeft']||keys['ShiftRight']||touchRun)&&len>.07&&player.stamina>3;
 let speed=(crouching?1.35:(sprint?4.15:2.55))*(elapsed<(player.energySlowUntil||0)?.55:1);
 if(sprint)player.stamina=Math.max(0,player.stamina-dt*30);else player.stamina=Math.min(100,player.stamina+dt*19);
 UI.stamina.style.width=player.stamina+'%';
 if(player.moving){let t=dt*speed/Math.max(1,len);move(player,(forward*dirX+strafe*sX)*t,(forward*dirY+strafe*sY)*t,.22);walkPhase+=dt*(sprint?14:9);if(Math.floor(walkPhase/PI)!==Math.floor((walkPhase-dt*(sprint?14:9))/PI))playStep(sprint)}else walkPhase*=Math.max(0,1-dt*7);
 if(player.a>PI)player.a-=TAU;if(player.a<-PI)player.a+=TAU;
 pickup();pickupCoins();updateCoinCounter();updateSeen();
 interactReady=findInteractable();$('interactHint').style.display=interactReady?'block':'none';
 if(interactReady)$('interactHint').textContent='[ E ] '+(interactReady.type==='safeDoor'?'OTWORZ / ZAMKNIJ POKOJ':interactReady.type==='slot'?'ZAGRAJ ZA 1 GROSZ':'UZYJ');
 if(applyHazardsAndRegen(dt))return;
 if(awake){updateGuard(cat,dt,0);let distance=Math.hypot(cat.x-player.x,cat.y-player.y);nearCat=distance;UI.danger.style.opacity=distance<5?String(clamp((5-distance)/2,0,1)):'0';if(distance<.67&&!isSafeRoomProtected()){lose();return}
 }else{nearCat=Infinity;UI.danger.style.opacity=0}
 if(player.collected===GOAL&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<1.52){win();return}
 let target=player.collected===GOAL?{x:exitCell.x+.5,y:exitCell.y+.5}:fuses.filter(f=>!f.taken).sort((a,b)=>Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y))[0];
 if(target){let dx=target.x-player.x,dy=target.y-player.y;let angle=Math.atan2(dy,dx)-player.a;while(angle>PI)angle-=TAU;while(angle<-PI)angle+=TAU;UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;let meters=Math.hypot(dx,dy);UI.signal.innerHTML=`<strong>${player.collected===GOAL?'WYJSCIE':'SYGNAL ELEKTRYCZNY'}</strong> · ${Math.round(meters)} m`}
 if(mapOn&&Math.floor(elapsed*5)!==Math.floor((elapsed-dt)*5))drawMap();
}

function pickupFacility(){
  for(let f of fuses){
    if(f.taken||Math.hypot(player.x-f.x,player.y-f.y)>.66)continue;
    f.taken=true;player.collected++;UI.count.textContent=player.collected;playPickup();flashUntil=elapsed+.22;
    showToast(level===2?`▣ KARTA ${player.collected}/${GOAL}`:level===4?`KARMA ${player.collected}/${GOAL}`:level===10?`DOWODY ${player.collected}/${GOAL}`:level===5?`✧ ZNALEZIONO ${player.collected}/${GOAL}`:`✦ RDZEN ${player.collected}/${GOAL}`,2.9);
    addNoise(f.x,f.y,level===3?8:5,'zbieranie');
  }
  for(let item of bonusItems){
    if(item.taken||Math.hypot(player.x-item.x,player.y-item.y)>.67)continue;
    item.taken=true;
    if(item.type==='coin'){player.coins=(player.coins||0)+1;updateCoinCounter();}
    else if(item.type==='key')keysOwned.add(item.id);
    else if(item.type==='decoy')player.decoys+=item.quantity;
    else if(item.type==='hardSlow'){player.slowCharges=(player.slowCharges||0)+item.quantity;ensureInventory().slow=player.slowCharges;}
    else if(item.type==='hardFreeze'){player.freezeCharges=(player.freezeCharges||0)+item.quantity;ensureInventory().freeze=player.freezeCharges;}
    else if(item.type==='stamina'){ensureInventory().energy.push({energySprite:item.energySprite||0,fakeMonster:!!item.fakeMonster});}
    else if(item.type==='shield')player.shieldUntil=elapsed+12;
    if(item.type==='coin')playCoinPickup();else playPickup();
    showToast('ZEBRANO: '+item.name+(item.quantity>1?' +'+item.quantity:''),2.5);
    updateInventoryUI();
  }
}

function findInteractable(){
  if(player.hidden)return{type:'unhide',title:'WYJDZ ZE SCHOWKA'};
  const all=[];
  for(let d of doors)if(!d.open)all.push({type:'door',ref:d,x:d.x+.5,y:d.y+.5,title:d.title});
  if(safeRoom)all.push({type:'safeDoor',x:safeRoom.doorX+.5,y:safeRoom.doorY+.5,title:'DRZWI POKOJU BEZPIECZNEGO'});
  for(let o of interactables)if(o.type==='hide'||o.type==='stairs'||o.type==='slot'||!o.used)all.push({type:o.type,ref:o,x:o.x,y:o.y,title:o.title});
  all.sort((a,b)=>Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y));
  const hit=all.find(o=>Math.hypot(player.x-o.x,player.y-o.y)<(o.type==='door'?1.65:1.4));
  if(!hit)return null;
  // Interact through the gate from either side but not from behind unrelated walls.
  return hit;
}

function interact(){
  if(state!=='playing')return;
  const safeTarget=findInteractable();
  if(safeTarget?.type==='safeDoor'){safeRoomInteraction();return;}
  if(safeTarget?.type==='slot'){slotMachineSpin();return;}
  if(level===1)return;
  const target=findInteractable();if(!target){showToast('BRAK URZADZEN W ZASIEGU',1.4);return}
  const o=target.ref;
  if(target.type==='repair'&&isHardMode()){finishHardEmergency();return}
  if(target.type==='unhide'){player.hidden=false;showToast('WYSZEDLES Z UKRYCIA',1.6);return}
  if(target.type==='hide'){player.hidden=true;player.flash=false;showToast('SCHOWALES SIE · E ABY WYJSC',2.5);return}
  if(target.type==='stairs'){
    // Stairwells only teleport after the power network connects the decks.
    if(!terminals.some(t=>t.id==='reactor2'&&t.used)){showToast('SCHODY ZAMKNIETE · REAKTOR II NIEAKTYWNY',2.8);return}
    if(world[Math.floor(o.dest.y)]?.[Math.floor(o.dest.x)]!==0){showToast('DRUGIE PIETRO ZABLOKOWANE',2);return}
    player.x=o.dest.x;player.y=o.dest.y;cameraFloor=player.y>40?2:1;
    flashUntil=elapsed+.5;showToast('PRZEJSCIE DO SEKCJI '+(cameraFloor===2?'B':'A'),2.5);playUnlock();return;
  }
  if(target.type==='door'){
    let why=requirementReason(o);
    if(why){sound(130,.17,'square',.09,-40);showToast('⛔ '+why.toUpperCase(),3);return}
    o.open=true;world[o.y][o.x]=0;stats.doors++;addNoise(o.x+.5,o.y+.5,11,'brama');
    playUnlock();showToast('✓ OTWARTO: '+o.title,2.8);updateObjectiveFacility();return;
  }
  if(target.type==='panel'){
    if(o.used)return;
    if(level===3){
      const next=terminals.filter(t=>t.used).length+1;
      if(o.order!==next){alarmTimer=9;addNoise(o.x,o.y,14,'alarm');playScare();showToast(`⚠ ZLA KOLEJNOSC! REAKTOR ${next} MUSI BYC PIERWSZY`,3.4);return}
    }
    o.used=true;stats.panels++;addNoise(o.x,o.y,level===3?15:10,'urzadzenie');
    playUnlock();showToast('✓ AKTYWOWANO: '+o.title,3.2);
    if(level===3&&stats.panels===terminals.length)playWin();
    updateObjectiveFacility();return;
  }
}

function throwDecoy(){
  if(state!=='playing'||level===1||player.hidden)return;
  if(player.decoys<=0){showToast('BRAK ODWRACACZY UWAGI · SZUKAJ ZASOBOW',2.5);return}
  let px=player.x,py=player.y;for(let d=.25;d<=3.9;d+=.2){let x=player.x+Math.cos(player.a)*d,y=player.y+Math.sin(player.a)*d;
    if(!freeAt(x,y,.17))break;px=x;py=y;
  }
  player.decoys--;decoys.push({x:px,y:py,born:elapsed,nextPulse:elapsed+1.1});addNoise(px,py,isHardMode()?31:level===3?23:18,'wabik');
  sound(490,.18,'square',.1,-130);showToast('◈ RZUCONO WABIK · Q',2.2);updateObjectiveFacility();
}

function updateObjectiveFacility(){
 const panels=terminals.filter(t=>t.used).length,total=terminals.length;
 UI.goal.textContent=player.collected===GOAL&&panels===total?'DOTRZYJ DO ZIELONEGO WYJSCIA':level===2?`KARTY ${player.collected}/${GOAL} · PANELE ${panels}/${total}`:level===4?`KARMA ${player.collected}/${GOAL} · DZWIGNIE ${panels}/${total}`:level===10?`SEKTOR 05 · PRZEDMIOTY ${player.collected}/${GOAL} · PANELE ${panels}/${total}`:isHardMode()?`HARD ${hardStage()} · ${player.collected}/${GOAL} · PANELE ${panels}/${total}`:level===5?`ARTEFAKTY ${player.collected}/${GOAL} · WYJSCIE`: `RDZENIE ${player.collected}/${GOAL} · REAKTORY ${panels}/${total}`;
 const html=`<span class="icon-label">${uiIcon('key')} ${keysOwned.size}</span><span class="icon-label">${uiIcon('door')} BRAMY ${doors.filter(d=>d.open).length}/${doors.length}</span><span class="icon-label">${uiIcon('decoy')} WABIKI ${player.decoys||0}</span>`;
 if($('missionDetails').dataset.stats!==String(keysOwned.size)+':'+doors.filter(d=>d.open).length+':'+(player.decoys||0)){ $('missionDetails').dataset.stats=String(keysOwned.size)+':'+doors.filter(d=>d.open).length+':'+(player.decoys||0); $('missionDetails').innerHTML=html; }
}

function updateFacility(dt,finalMode){
  elapsed+=dt;clock+=dt;guardCallCooldown=Math.max(0,guardCallCooldown-dt);
  UI.clock.textContent=formatTime(clock);if(elapsed>toastTimeout)UI.toast.classList.remove('visible');
  if(finalMode){
    eventTimer-=dt;if(eventTimer<=0){triggerFinalEvent();eventTimer=48+rnd()*30}
    if(eventState){eventState.time-=dt;if(eventState.time<=0){eventState=null;showToast('SYSTEMY POWRACAJA DO NORMALNEJ PRACY',2.7)}}
  }
  const dirX=Math.cos(player.a),dirY=Math.sin(player.a),sX=-dirY,sY=dirX;
  let forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchY;
  let strafe=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchX;
  if(keys.ArrowLeft)player.a-=dt*2.4;if(keys.ArrowRight)player.a+=dt*2.4;
  let len=Math.hypot(forward,strafe);
  player.moving=len>.07&&!player.hidden;
  crouching=!!(keys.ControlLeft||keys.ControlRight||keys.KeyC||touchCrouch||player.hidden);
  let sprint=!crouching&&(keys.ShiftLeft||keys.ShiftRight||touchRun)&&player.moving&&player.stamina>3;
  let speed=(crouching?1.28:sprint?3.95:2.45)*(isHardMode()&&hardPulseActive()?.62:1)*(elapsed<(player.energySlowUntil||0)?.55:1);
  player.stamina=clamp(player.stamina+(sprint?-33:(eventState?.kind==='pressure'?8:18))*dt,0,100);
  UI.stamina.style.width=player.stamina+'%';
  if(player.moving){
    let t=dt*speed/Math.max(1,len);move(player,(forward*dirX+strafe*sX)*t,(forward*dirY+strafe*sY)*t,.22);
    let previousPhase=walkPhase;walkPhase+=dt*(sprint?14:crouching?4:9);
    if(Math.floor(previousPhase/PI)!==Math.floor(walkPhase/PI)){
      playStep(sprint);
      if(sprint||!crouching&&finalMode){addNoise(player.x,player.y,sprint?(finalMode?12:9):2.7,'kroki')}
    }
  }else walkPhase*=Math.max(0,1-dt*7);
  if(player.a>PI)player.a-=TAU;if(player.a<-PI)player.a+=TAU;
  pickupFacility();updateCoinCounter();updateSeen();if(applyHazardsAndRegen(dt))return;
  noiseEvents=noiseEvents.filter(e=>e.expiry>elapsed);
  decoys=decoys.filter(e=>elapsed-e.born<12);
  for(const d of decoys){if(elapsed>=(d.nextPulse||0)){addNoise(d.x,d.y,isHardMode()?32:25,'wabik');d.nextPulse=elapsed+1.15;}}
  interactReady=findInteractable();
  $('interactHint').style.display=interactReady?'block':'none';
  if(interactReady)$('interactHint').textContent='[ E ] '+(interactReady.type==='slot'?'ZAGRAJ ZA 1 GROSZ':interactReady.type==='safeDoor'?'OTWORZ / ZAMKNIJ POKOJ':interactReady.type==='door'?'OTWORZ / SPRAWDZ BRAME':interactReady.type==='hide'?'SCHOWAJ SIE':interactReady.type==='unhide'?'WYJDZ':interactReady.type==='stairs'?'WEJDZ NA SCHODY':interactReady.type==='repair'?'NAPRAW REAKTOR / 45 SEKUND':'AKTYWUJ PANEL');
  guardSight=Math.max(0,guardSight-dt);guardNoise=Math.max(0,guardNoise-dt);
  let closest=Infinity;
  for(let i=0;i<guards.length;i++){
    let g=guards[i];updateGuard(g,dt,i);
    let d=Math.hypot(g.x-player.x,g.y-player.y);closest=Math.min(closest,d);
    if(d<(g.sizeMultiplier&&g.sizeMultiplier<1?.49:.66)&&!isSafeRoomProtected()&&lineOfSight(g.x,g.y,player.x,player.y)){lose(g.id);return}
  }
  nearCat=closest;UI.danger.style.opacity=closest<5?String(clamp((5-closest)/3,0,1)):'0';
  const chasing=guards.some(g=>g.state==='chase');
  const stealthText=player.hidden?'UKRYTY · WCISNIJ E':chasing?'WYKRYTO · UCIEKAJ!':guards.some(g=>g.state==='search'||g.state==='suspicious')?'PRZECIWNICY PRZESZUKUJA':crouching?'SKRADASZ SIE':'NIEWYKRYTY';
 if($('stealthStatus').dataset.stealth!==stealthText){$('stealthStatus').dataset.stealth=stealthText;setUIIconText($('stealthStatus'),chasing?'warning':'eye',stealthText);}
  $('stealthStatus').style.color=chasing?'#ff847b':'#a4eadb';
  updateObjectiveFacility();
  const complete=player.collected===GOAL&&terminals.every(t=>t.used);
  if(complete&&Math.hypot(player.x-(exitCell.x+.5),player.y-(exitCell.y+.5))<1.65){win();return}
  let targets=hardEmergency&&isHardMode()?[hardEmergency]:[...fuses.filter(f=>!f.taken),...terminals.filter(t=>!t.used)];
  if(!targets.length)targets=[{x:exitCell.x+.5,y:exitCell.y+.5}];
  targets.sort((a,b)=>Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y));
  const target=targets[0];
  if(target){let dx=target.x-player.x,dy=target.y-player.y,angle=Math.atan2(dy,dx)-player.a;
    while(angle>PI)angle-=TAU;while(angle<-PI)angle+=TAU;
    UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;
    UI.signal.innerHTML=`<strong>${complete?'WYJSCIE':'WSKAZNIK CELU'}</strong> · ${Math.round(Math.hypot(dx,dy))} m`;
  }
  if(finalMode){
    let newFloor=player.y>=41?2:1;
    if(newFloor!==cameraFloor){cameraFloor=newFloor;showToast('STREFA '+(newFloor===2?'PODZIEMNA B':'GORNA A'),2.4)}
    $('eventTag').textContent=eventState?'⚠ '+eventState.label:'STREFA '+(cameraFloor===2?'B / PODZIEMIA':'A / OBSERWATORIUM');
  }else $('eventTag').textContent=level===10?'SEKTOR 05 · CHRUM I NIEZNAJOMY':level===4?'SEKTOR CHRUM · UWAZAJ NA SZARZE':isHardMode()?'HARD · SEED '+(hardSeed>>>0):level===5?'PROCEDURALNY · SEED '+(proceduralSeed>>>0):'GLEBOKOSC -02 / KOMPLEKS';
  if(mapOn&&Math.floor(elapsed*5)!==Math.floor((elapsed-dt)*5))drawMap();
}

function triggerFinalEvent(){
  const list=[
    {kind:'blackout',time:12,label:'ZANIK ZASILANIA'},
    {kind:'pressure',time:13,label:'SKOK CISNIENIA'},
    {kind:'siren',time:9,label:'SYRENY ALARMOWE'},
    {kind:'fog',time:15,label:'AWARIA WENTYLACJI'}
  ];eventState={...list[Math.floor(rnd()*list.length)]};
  if(eventState.kind==='siren'){
    let t=terminals[Math.floor(rnd()*terminals.length)];addNoise(t.x,t.y,22,'syrena');alarmTimer=9;
    sound(310,.8,'sawtooth',.12,-150);
  }
  if(eventState.kind==='blackout')sound(68,1.1,'sawtooth',.15,-40);
  if(eventState.kind==='pressure')for(let g of guards){g.patrolTarget=null;g.pathTimer=0}
  showToast('⚠ WYDARZENIE: '+eventState.label,4);
}
