function showToast(s,d=2.5){
 const icon= /TOKSYCZ|RADIOAKTYW|HP/.test(s)?'toxic':/UWAGA|WYKRY|ALARM|RAGE|ZLA|ZAGROZ|CHRU/.test(s)?'warning':/KARTA|BATER|PRZEDMIOT|KARM|RDZEN|ZNALEZ/.test(s)?'battery':/WYJSCIE|UCIEKAJ|OTWART/.test(s)?'exit':/SAMOUCZEK/.test(s)?'info':'signal';
 UI.toast.replaceChildren(makeUIIcon(icon),document.createTextNode(String(s).replace(/^[⚡🔥🌽🐖🎧🔒☣⚠⛔🔑☠🌐⚙▦♫◷▣✦✧◈⛨⌘⌂↻▶✓●]+\s*/u,'')));
 UI.toast.classList.add('visible');toastTimeout=elapsed+d}


function setState(next){
 if(next!=='playing')stopGameSounds();
 if(next==='menu')stopLossScream();
 state=next;UI.hud.classList.toggle('show',next==='playing');
 updateTutorialVisibility();
 UI.start.classList.toggle('hidden',next!=='menu');UI.pause.classList.toggle('hidden',next!=='paused');
 UI.ending.classList.toggle('hidden',next!=='end');$('dossier').classList.toggle('hidden',next!=='dossier');
 UI.mobile.classList.toggle('playing',next==='playing');
 if(next==='menu')document.body.classList.remove('level2','final-level','pig-level','procedural-level','hard-level','hard-stage-1','hard-stage-2','hard-stage-3','hard-stage-4','hard-stage-5','hard-detected','sector-five');
 if(next!=='playing'&&document.pointerLockElement===C)document.exitPointerLock?.();
}

function openDossier(n){
 if((n===2&&!(selectedDifficulty==='hard'?hardUnlocked[2]:unlocked2))||(n===3&&!(selectedDifficulty==='hard'?hardUnlocked[3]:unlocked3))||(n===4&&!(selectedDifficulty==='hard'?hardUnlocked[4]:unlocked4))||(n===5&&!(selectedDifficulty==='hard'?hardUnlocked[5]:unlocked5)))return;
 dossierLevel=n;
 const t={2:['AKTA 02 / ZALANY KOMPLEKS','NIE JESTES <em>SAM.</em>','Poznaj dwoch wrogow. Zdobadz 6 kart, aktywuj 3 panele i omijaj toksyczne rozlewiska.','6 KART · 3 PANELE · DLUGI SZLAK'],
 3:['AKTA 03 / CZERWONA STREFA','WSZYSCY <em>CZEKAJA.</em>','Trzech przesladowcow, osiem rdzeni i cztery reaktory, ktore musisz uruchomic po kolei.','8 RDZENI · 4 REAKTORY · ROZLEGLY OBIEKT'],
 4:['AKTA 04 / SEKTOR CHRUM','NIE <em>CHRUMKAJ.</em>','Swinia CHRUM patroluje wieksza chlewnie. Zbierz 7 puszek karmy, aktywuj 3 dzwignie i unikaj zracego plynu.','7 PUSZEK KARMY · 3 DZWIGNIE · 1 CHRUM'],
 5:['AKTA 05 / OSTATNIE SPOTKANIE','DWA <em>ZAGROZENIA.</em>','W nowym sektorze poluja CHRUM oraz Nieznajomy ze zdjecia. Zbierz wymagane zasoby, uruchom trzy panele i uciekaj.','8 PRZEDMIOTOW · 3 PANELE · CHRUM + NIEZNAJOMY']};
 const [k,heading,description,mission]=t[n];
 const h=selectedDifficulty==='hard';
 const displayDescription=h?'KAMPANIA HARD / wiekszy proceduralny poziom, zaawansowane AI, championy, skaly i 45-sekundowe awarie. '+description:description;
 $('dossierKicker').textContent=h?'HARD / '+k:k;$('dossierTitle').innerHTML=heading;$('dossierDesc').textContent=displayDescription;
 $('dossierMission').textContent=mission;$('dossierLevelName').textContent=(h?'HARD ':'LEVEL ')+n;
 $('dossier').classList.toggle('final-theme',n>=3);
 const dossierCat=$('dossierCat'),dossierWatcher=$('dossierWatcher'),dossierListener=$('dossierListener'),dossierPig=$('dossierPig');
 if(dossierCat)dossierCat.classList.toggle('absent',n!==3);
 $('dossierStranger').classList.toggle('absent',n!==5);
 if(dossierWatcher)dossierWatcher.classList.toggle('absent',n>=4);
 if(dossierListener)dossierListener.classList.toggle('absent',n>=4);
 if(dossierPig)dossierPig.classList.toggle('absent',n!==4&&n!==5);
 setState('dossier');
}

function transitionToLevel2(){
 const next=(isHardMode()?hardStage():level)+1;if(next>5)return;
 const open=selectedDifficulty==='hard'?!!hardUnlocked[next]:next===2?unlocked2:next===3?unlocked3:next===4?unlocked4:unlocked5;
 if(!open)return;
 transit(()=>openDossier(next),'ODKODOWANO '+(selectedDifficulty==='hard'?'HARD ':'LEVEL ')+next);
}

function transit(fn,message){
 const t=$('transition');$('transitionText').textContent=message;t.classList.add('active');
 setTimeout(()=>{fn();setTimeout(()=>t.classList.remove('active'),400)},700);
}

function begin(targetLevel=1){
 stopGameSounds();stopLossScream();
 const stage=targetLevel===10||targetLevel===11?5:targetLevel>=6&&targetLevel<=9?targetLevel-5:targetLevel;
 const goHard=targetLevel===11||(targetLevel>=6&&targetLevel<=9)||(selectedDifficulty==='hard'&&stage>=1&&stage<=4);
 if(stage>=2&&stage<=5){
  const unlocked=goHard?!!hardUnlocked[stage]:stage===2?unlocked2:stage===3?unlocked3:stage===4?unlocked4:unlocked5;
  if(!unlocked)return;
 }
 stopHum();resetRage();prepareRun();level=goHard?(stage===5?11:stage+5):targetLevel;
 if(isHardMode())resetHard();
 else if(level===5)resetProcedural();
 else if(level===10)resetLevel5();
 else if(level===4)resetLevel4();
 else if(level===3)resetLevel3();
 else if(level===2)resetLevel2();
 else {document.body.classList.remove('level2','final-level','pig-level','procedural-level');resetBase()}
 setupSafeRoomAndCoins();
 hardSlowUntil=0;hardPulseUntil=0;
 if(!isHardMode()){player.inventory={energy:[],slow:0,freeze:0};player.slowCharges=0;player.freezeCharges=0;}
 $('seedChip').style.display=level>=5?'block':'none';
 $('missionDetails').style.display=level===1?'none':'block';
 $('eventTag').style.display=level===1?'none':'block';
 $('decoyBtn').style.display=level===1?'none':'';
 for(const id of ['hardSlowBtn','hardFreezeBtn'])$(id).hidden=true;
 $('activeInventory').classList.toggle('hard-equipped',isHardMode());
 updateInventoryUI();
 player.pitch=0;touchCrouch=false;resetMobileInputs();
 $('crouchBtn').classList.remove('pressed');$('crouchBtn').textContent='CICHO';
 started=true;setState('playing');updateTutorialVisibility();lastTime=performance.now();initAudio();playSting(false);
 if(!isCoarse){const lock=C.requestPointerLock?.();lock?.catch?.(()=>{});}
}
function reset(){
 if(isHardMode())resetHard();else if(level===5)resetProcedural();else if(level===10)resetLevel5();else if(level===4)resetLevel4();
 else if(level===3)resetLevel3();else if(level===2)resetLevel2();else resetBase();
 setupSafeRoomAndCoins();
}
function update(dt){if(level===3)updateFacility(dt,true);else if(isHardMode())updateHard(dt);else if(level>=2)updateFacility(dt,false);else updateBase(dt)}

function pause(){if(state!=='playing')return;setState('paused');if(coop.role==='host'&&coop.active)coop.send({type:'pause',paused:true});if(coop.role==='guest')coop.send({type:'input',data:{forward:0,strafe:0,angle:player.a,pitch:player.pitch||0,sprint:0,crouch:0,flash:Number(!!player.flash)}});}

function resume(){if(state!=='paused')return;if(coop.role==='guest'&&coop.hostPaused){showToast('POCZEKAJ, AZ HOST WZNOWI GRE',2);return;}setState('playing');if(coop.role==='host'&&coop.active)coop.send({type:'pause',paused:false});lastTime=performance.now();if(!isCoarse){const lock=C.requestPointerLock?.();lock?.catch?.(()=>{});}}

function finish(good){
 if(good){
  if(isHardMode()&&hardStage()<5){const next=hardStage()+1;hardUnlocked[next]=true;progressWrite('catroomsHardUnlocked'+next,'1');}
  if(level===1){unlocked2=true;progressWrite('catroomsUnlocked2','1');tutorialCompleted=true;progressWrite('catroomsTutorialDone','1');if(!controlsHintsTouched){showControlHints=false;progressWrite('catroomsShowControls','0');}updateTutorialVisibility();}
  if(level===2){unlocked3=true;progressWrite('catroomsUnlocked3','1')}
  if(level===3){unlocked4=true;progressWrite('catroomsUnlocked4','1')}
  if(level===4){unlocked5=true;progressWrite('catroomsUnlocked5','1')}
 }
 streakResult(good);setState('end');refreshLevelButton();
 const actor=ACTORS[deathBy]||ACTORS.cat;
 $('endCard').classList.toggle('deathPanel',!good);
 $('endFace').src=good?(level===4||level===10?PIG_PNG:level===2?PERSON_A_PNG:CAT_PNG):actor.image;
 $('endFace').alt=good?'Zwyciestwo':'Przeciwnik: '+actor.name;
 $('endKicker').textContent=good?(isHardMode()?'HARD LEVEL '+hardStage()+' UKONCZONY':level===5?'TRYB PROCEDURALNY UKONCZONY':level===10?'SEKTOR 05 UKONCZONY':level===4?'SEKTOR 05 ODBLOKOWANY':level===3?'LEVEL 4 ODBLOKOWANY!':'NOWY POZIOM ODBLOKOWANY!'):'ZAPIS OSTATNICH SEKUND';
 $('endTitle').innerHTML=good?(isHardMode()?'HARD <em>PRZETRWANY!</em>':level===5?'RUNDA <em>WYGRANA!</em>':level===4?'UCIEKLES <em>CHRUMOWI!</em>':'STREFA <em>ODKRYTA!</em>'):deathBy==='meltdown'?'AWARIA <em>REAKTORA.</em>':deathBy==='hazard'?'HP SPADLO DO <em>ZERA.</em>':'ZLAPAL <em>CIE.</em>';
 $('endDesc').textContent=good?(isHardMode()?'Ukonczyles etap '+hardStage()+' kampanii HARD. Nastepny sektor odblokowano, jesli jest dostepny.':level===5?'Udalo Ci sie przetrwac losowy uklad, zebrac przedmioty i znalezc wyjscie.':level===10?'CHRUM i Nieznajomy pozostali w sektorze 05. Ukonczyles kampanie NORMAL.':level===4?'Swinia CHRUM zostala z tylu. Odkryles piaty sektor.':level===1?'Ukonczyles samouczek i odblokowales dalsza kampanie':'Ukonczyles Level '+level+'. Odblokowano kolejna strefe.'):deathBy==='meltdown'?'Nie naprawiles reaktora w ciagu 45 sekund.':deathBy==='hazard'?'TOKSYCZNY PLYN wypalil cale Twoje HP. Unikaj radioaktywnych kaluz i poczekaj na regeneracje.':`POKONAL CIE: ${actor.name} · ${actor.alias}. Sprobuj innej drogi i uzyj wabikow.`;
 $('endKiller').innerHTML=good?'':uiIcon('skull')+' '+(deathBy==='hazard'?'TOKSYCZNY PLYN · 50 HP obrazen co 5 sekund':actor.name.toUpperCase()+' · '+actor.skill);
 $('endKiller').style.display=good?'none':'block';
 $('endCard').style.setProperty('--killer-accent',good?'#bde8b3':actor.color);
 $('nextBtn').style.display=good&&(isHardMode()?hardStage()<5:(level<4||level===4))?'inline-block':'none';
 setUIIconText($('nextBtn'),'play',(isHardMode()?'HARD ':'LEVEL ')+(isHardMode()?hardStage()+1:level+1)+' · DALEJ');
 $('endTime').textContent='CZAS '+formatTime(clock);
 setUIIconText($('endItems'),level===1?'battery':level===4?'feed':isHardMode()?'skull':level===5?'spark':'archive',player.collected+'/'+GOAL);
 let best=+progressRead('catroomsBest'+level,'0')||0;
 if(good&&!runCheated&&(!best||clock<best)){best=clock;progressWrite('catroomsBest'+level,best)}
 $('bestTime').textContent=best?'REKORD '+formatTime(best):runCheated?'ADMIN / BEZ REKORDU':'';
 if(coop.role==='host')coop.roundEnd(good,deathBy);else if(coop.role==='guest')coop.guestEnd();
 stopHum();
}

function win(){playWin();finish(true)}

function lose(killerId='cat'){
 if(godMode){
  if(elapsed>lastShieldToast+2){showToast('ADMIN GOD MODE · NIEWRAZLIWOSC',1.8);lastShieldToast=elapsed}
  return;
 }
 deathBy=ACTORS[killerId]?killerId:'cat';state='jumpscare';const actor=ACTORS[deathBy];
 $('jump').querySelector('img').src=actor.image;
 $('jump').style.background=deathBy==='watcher'?'#032732':deathBy==='listener'?'#42111f':deathBy==='pig'?'#54301e':deathBy==='hazard'?'#1d4720':'#4c0909';
 $('jumpName').textContent=(deathBy==='hazard'?'WYKONCZYL CIE: ':'ZLAPAL CIE: ')+actor.name;
 UI.hud.classList.remove('show');UI.mobile.classList.remove('playing');$('jump').classList.add('show');
 stopGameSounds();stopHum();playLossScream();if(document.pointerLockElement===C)document.exitPointerLock?.();
 setTimeout(()=>{$('jump').classList.remove('show');if(state==='jumpscare')finish(false)},930);
}

let fpsWindowStart=0,fpsWindowFrames=0;
function tick(time){requestAnimationFrame(tick);
 if(!fpsWindowStart)fpsWindowStart=time;
 fpsWindowFrames++;
 if(time-fpsWindowStart>=650){const fps=Math.round(fpsWindowFrames*1000/(time-fpsWindowStart));const el=$('fpsCounter');if(el)el.textContent=fps+' FPS';fpsWindowStart=time;fpsWindowFrames=0;}
 let dt=Math.max(0,Math.min(.045,(time-lastTime)/1000||.016));lastTime=time;if(state==='playing'){if(coop.role==='guest'){coop.guestFrame(dt)}else{update(dt);coop.hostFrame(dt)}}syncGameAudio(dt);if(state==='playing'||state==='menu'||state==='paused'){render()}if(state==='menu')elapsed+=dt*.25}

function toggleMap(){mapOn=!mapOn;UI.map.classList.toggle('visible',mapOn);if(mapOn)drawMap()}

function refreshLevelButton(){
 const hard=selectedDifficulty==='hard';
 const availability={2:hard?hardUnlocked[2]:unlocked2,3:hard?hardUnlocked[3]:unlocked3,4:hard?hardUnlocked[4]:unlocked4,5:hard?hardUnlocked[5]:unlocked5};
 const names={1:'ZOLTE KORYTARZE',2:'ZALANY KOMPLEKS',3:'CZERWONA STREFA',4:'SEKTOR CHRUM',5:'OSTATNIE SPOTKANIE'};
 for(const [n,id] of [[2,'level2Btn'],[3,'finalBtn'],[4,'pigLevelBtn'],[5,'level5Btn']]){
  const b=$(id);b.disabled=!availability[n];
  b.textContent=availability[n]?names[n]:names[n]+' · ZABLOKOWANE';
 }
 const count=1+Number(availability[2])+Number(availability[3])+Number(availability[4])+Number(availability[5]);
 $('progressText').textContent=(hard?'HARD · ':'')+'ODKRYTO '+count+'/5 POZIOMOW';
 for(let k=1;k<=5;k++){
  const best=+progressRead('catroomsBest'+(hard?(k===5?11:k+5):(k===5?10:k)),'0');
  const el=$('record'+k);if(el)el.textContent=best?names[k]+': '+formatTime(best):names[k]+': BRAK REKORDU';
 }
 streakRender();
}

function toggleRage(){
 if(state!=='playing')return;if(coop.role==='guest'){showToast('RAGE MODE MOZE WLACZYC TYLKO HOST',2);return;}
 rageMode=!rageMode;
 document.body.classList.toggle('rage-active',rageMode);
 setUIIconText($('rageMobile'),'skull',rageMode?'WYLACZ RAGE':'RAGE');
 showToast(rageMode?'☠ RAGE MODE: WROGOWIE SA BARDZIEJ CZUJNI!':'RAGE MODE WYLACZONY',3);
 if(rageMode){playSting();if(level===1&&!awake){awake=true;wakeAt=0}}
}

function resetRage(){rageMode=false;document.body.classList.remove('rage-active');setUIIconText($('rageMobile'),'skull','RAGE')}
