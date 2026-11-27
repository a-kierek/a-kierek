// Browsers can reject pointer lock synchronously or as a promise. A denied
// request must not abort the round; clicking the game surface can retry.
function requestGamePointerLock(){try{C.requestPointerLock?.()?.catch?.(()=>{});}catch(error){/* no user activation or unsupported */}}
function graphicsReadyForPlay(){const backend=window.CatroomsGraphicsStatus?.backend;return !backend||backend==='webgpu';}
function showToast(s,d=2.5){
 const icon= /TOKSYCZ|RADIOAKTYW|HP/.test(s)?'toxic':/UWAGA|WYKRY|ALARM|RAGE|ZLA|ZAGROZ|CHRU/.test(s)?'warning':/KARTA|BATER|PRZEDMIOT|KARM|RDZEN|ZNALEZ/.test(s)?'battery':/EXIT|UCIEKAJ|OTWART/.test(s)?'exit':/SAMOUCZEK/.test(s)?'info':'signal';
 UI.toast.replaceChildren(makeUIIcon(icon),document.createTextNode(String(s).replace(/^[⚡🔥🌽🐖🎧🔒☣⚠⛔🔑☠🌐⚙▦♫◷▣✦✧◈⛨⌘⌂↻▶✓●]+\s*/u,'')));
 UI.toast.classList.add('visible');gameSession.toastTimeout=gameSession.elapsed+d}


function clearModeClasses(){document.body.classList.remove('boss-rush-level','level2','final-level','pig-level','procedural-level','hard-level','hard-stage-1','hard-stage-2','hard-stage-3','hard-stage-4','hard-stage-5','hard-detected','sector-five','custom-level');}

function setState(next){
 const previous=gameSession.state;
 if(previous!==next&&typeof profileCheckpoint==='function')profileCheckpoint();
 if(previous!==next){
  resetSimulationClock();
  if(previous==='playing'){keys={};resetMobileInputs();}
  if(previous==='jumpscare'){sessionTimers.clear('death');$('jump').classList.remove('show');}
 }
 if(next==='menu')cancelTransition();
 if(next!=='playing')stopGameSounds();
 if(next==='menu')stopLossScream();
 gameSession.state=next;document.body.classList.toggle('graphics-demo',gameSession.graphicsDemo&&next!=='menu');document.body.classList.toggle('menu-scene',next==='menu');if(typeof updateRoundInterface==='function')updateRoundInterface(next);UI.hud.classList.toggle('show',next==='playing');
 if(typeof syncBackgroundTracks==='function')syncBackgroundTracks(0);
 updateTutorialVisibility();
 UI.start.classList.toggle('hidden',next!=='menu');UI.pause.classList.toggle('hidden',next!=='paused');
 UI.ending.classList.toggle('hidden',next!=='end');$('dossier').classList.toggle('hidden',next!=='dossier');
 UI.mobile.classList.toggle('playing',next==='playing');
 if(next!=='playing'){rearPeek=false;endMapHold();}
 if(next==='menu'){clearModeClasses();if(previous!=='menu')window.CatroomsPixelMenu?.backToTitle();}
 if(next!=='playing'&&document.pointerLockElement===C)document.exitPointerLock?.();
}

function openDossier(n){
 if(n>=2&&n<=5){begin(n===5?(selectedDifficulty==='hard'?11:10):n);return;} // Go straight into the level, no descriptive dossier.
 if((n===2&&!(selectedDifficulty==='hard'?hardUnlocked[2]:unlocked2))||(n===3&&!(selectedDifficulty==='hard'?hardUnlocked[3]:unlocked3))||(n===4&&!(selectedDifficulty==='hard'?hardUnlocked[4]:unlocked4))||(n===5&&!(selectedDifficulty==='hard'?hardUnlocked[5]:unlocked5)))return;
 dossierLevel=n;
 const t={2:['AKTA 02 / FLOODED COMPLEX','YOU ARE <em>NOT ALONE.</em>','Meet two enemies. Collect 6 cards, activate 3 panels and avoid toxic spills.','6 KART · 3 PANELS · DLUGI SZLAK'],
 3:['AKTA 03 / BLOODY ZONE','WSZYSCY <em>CZEKAJA.</em>','Three stalkers, eight cores and four reactors to activate in order.','8 CORES · 4 REACTORS · ROZLEGLY OBIEKT'],
 4:['AKTA 04 / CHRUM SECTOR','DO NOT <em>OINK.</em>','CHRUM patrols the bigger barn. Collect 7 food cans, activate 3 levers and avoid acid.','7 PUSZEK KARMY · 3 DZWIGNIE · 1 CHRUM'],
 5:['AKTA 05 / LAST ENCOUNTER','DWA <em>ZAGROZENIA.</em>','CHRUM and Nieznajomy hunt in this sector. Find resources, activate three panels and escape.','8 ITEMS · 3 PANELS · CHRUM + NIEZNAJOMY']};
 const [k,heading,description,mission]=t[n];
 const h=selectedDifficulty==='hard';
 const displayDescription=h?'HARD CAMPAIGN / larger procedural levels, advanced AI, champions, rocks and timed 45-second emergencies. '+description:description;
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
 const next=(isHardMode()?hardStage():gameSession.level)+1;if(next>5)return;
 const open=selectedDifficulty==='hard'?!!hardUnlocked[next]:next===2?unlocked2:next===3?unlocked3:next===4?unlocked4:unlocked5;
 if(!open)return;
 transit(()=>openDossier(next),'ODKODOWANO '+(selectedDifficulty==='hard'?'HARD ':'LEVEL ')+next);
}

let transitionExecuting=false;
function cancelTransition(){sessionTimers.clear('transition');sessionTimers.clear('transition-close');$('transition').classList.remove('active');}
function transit(fn,message){
 cancelTransition();const t=$('transition'),generation=gameSession.generation,phase=gameSession.state;
 $('transitionText').textContent=message;t.classList.add('active');
 sessionTimers.defer('transition',700,()=>{
  if(gameSession.generation!==generation||gameSession.state!==phase){cancelTransition();return;}
  transitionExecuting=true;
  try{fn();}finally{transitionExecuting=false;sessionTimers.defer('transition-close',400,()=>t.classList.remove('active'));}
 });
}

function begin(targetLevel=1,{testRun=false}={}){
 if(!graphicsReadyForPlay())return false;
 const entry=resolveRunEntry(targetLevel,selectedDifficulty,targetLevel===13?customGameConfig.stage||1:1);
 if(!entry)return false;
 const {id,stage,hard}=entry;
 if(id===12&&!bossRushCompleted()&&!testRun)return false;
 if(id!==13&&stage>=2&&stage<=5){
  const unlocked=hard?!!hardUnlocked[stage]:stage===2?unlocked2:stage===3?unlocked3:stage===4?unlocked4:unlocked5;
  if(!unlocked&&!testRun)return false;
 }
 if(!transitionExecuting)cancelTransition();
 if(typeof unlockMenuMusic==='function')unlockMenuMusic();
 if(typeof profileCheckpoint==='function')profileCheckpoint();
 stopGameSounds();stopLossScream();stopHum();resetRage();prepareRun();
 gameSession.runCheated=testRun;gameSession.runTestEntry=testRun;gameSession.level=id;
 if(id===13&&Number.isInteger(customGameConfig.fixedSeed))requestedSeed=customGameConfig.fixedSeed;
 reset();
 if(gameSession.level===13)gameSession.runCheated=true;
 gameSession.hardSlowUntil=0;gameSession.hardPulseUntil=0;
 if(!isHardMode()){gameSession.player.inventory={energy:[],slow:0,freeze:0};gameSession.player.slowCharges=0;gameSession.player.freezeCharges=0;}
 if(id===13&&typeof applyCustomOptions==='function')applyCustomOptions();
 if(typeof profileRunStarted==='function')profileRunStarted();
 $('seedChip').style.display=gameSession.level>=5?'block':'none';
 $('missionDetails').style.display=gameSession.level===1?'none':'block';
 $('eventTag').style.display=gameSession.level===1?'none':'block';
 for(const id of ['hardSlowBtn','hardFreezeBtn'])$(id).hidden=true;
 $('activeInventory').classList.toggle('hard-equipped',isHardMode());
 updateInventoryUI();
 gameSession.player.pitch=0;rearPeek=false;touchCrouch=false;keys={};resetMobileInputs();
 $('crouchBtn').classList.remove('pressed');$('crouchBtn').textContent='SNEAK';
 setState('playing');setMapVisibility(true);mapClockVisible=false;$('mapClock').hidden=true;if($('mapRunDetails'))$('mapRunDetails').hidden=true;updateTutorialVisibility();resetSimulationClock();initAudio();playSting(false);
 if(!isCoarse)requestGamePointerLock();
 return true;
}
function pause(){if(gameSession.state!=='playing')return;setState('paused');if(coop.role==='host'&&coop.active)coop.send({type:'pause',paused:true});if(coop.role==='guest')coop.send({type:'input',data:{forward:0,strafe:0,angle:gameSession.player.a,pitch:gameSession.player.pitch||0,sprint:0,crouch:0,flash:Number(!!gameSession.player.flash)}});}

function resume(){if(gameSession.state!=='paused'||!graphicsReadyForPlay()||window.CatroomsGraphicsBench?.running)return;if(coop.role==='guest'&&coop.hostPaused){showToast('WAIT FOR THE HOST TO RESUME',2);return;}setState('playing');if(coop.role==='host'&&coop.active)coop.send({type:'pause',paused:false});resetSimulationClock();if(!isCoarse)requestGamePointerLock();}

function finish(good){
 if(gameSession.state!=='playing'&&gameSession.state!=='jumpscare')return;
 const previousBest=readBestTime(gameSession.level);
 if(typeof profileRunFinished==='function')profileRunFinished(good);
 if(good&&qualifiesForProgress()){
  if(gameSession.level===12)progressWrite('catroomsBossRushWon','1');
  if(isHardMode()&&gameSession.level!==12&&gameSession.level!==13&&!gameSession.runCheated){const stage=hardStage();progressWrite('catroomsHardCompleted'+stage,'1');}
  if(isHardMode()&&gameSession.level!==12&&gameSession.level!==13&&hardStage()<5){const next=hardStage()+1;hardUnlocked[next]=true;progressWrite('catroomsHardUnlocked'+next,'1');}
  if(gameSession.level===1){unlocked2=true;progressWrite('catroomsUnlocked2','1');tutorialCompleted=true;progressWrite('catroomsTutorialDone','1');if(!controlsHintsTouched){showControlHints=false;progressWrite('catroomsShowControls','0');}updateTutorialVisibility();}
  if(gameSession.level===2){unlocked3=true;progressWrite('catroomsUnlocked3','1')}
  if(gameSession.level===3){unlocked4=true;progressWrite('catroomsUnlocked4','1')}
  if(gameSession.level===4){unlocked5=true;progressWrite('catroomsUnlocked5','1')}
 }
 streakResult(good);setState('end');refreshLevelButton();
 const actor=ACTORS[gameSession.deathBy]||ACTORS.cat;
 $('endCard').classList.toggle('deathPanel',!good);
 $('endFace').src=good?(gameSession.level===4||gameSession.level===10?PIG_PNG:gameSession.level===2?PERSON_A_PNG:CAT_PNG):actor.image;
 $('endFace').alt=good?'Zwyciestwo':'Enemy: '+actor.name;
 $('endKicker').textContent=good&&!qualifiesForProgress()?'TEST / NO CAMPAIGN PROGRESS':good?(gameSession.level===12?'BOSS RUSH UKONCZONY':isHardMode()?'HARD LEVEL '+hardStage()+' UKONCZONY':gameSession.level===5?'TRYB PROCEDURALNY UKONCZONY':gameSession.level===10?'SECTOR 05 COMPLETED':gameSession.level===4?'SECTOR 05 UNLOCKED':gameSession.level===3?'LEVEL 4 UNLOCKED!':'NEW LEVEL UNLOCKED!'):'LAST MOMENTS RECORDED';
 $('endTitle').innerHTML=good?(gameSession.level===12?'BOSS RUSH <em>UKONCZONY!</em>':isHardMode()?'HARD <em>SURVIVED!</em>':gameSession.level===5?'RUNDA <em>WYGRANA!</em>':gameSession.level===4?'YOU ESCAPED <em>CHRUM!</em>':'ZONE <em>DISCOVERED!</em>'):gameSession.deathBy==='meltdown'?'REACTOR <em>FAILURE.</em>':gameSession.deathBy==='hazard'?'HP SPADLO DO <em>ZERA.</em>':'YOU WERE <em>CAUGHT.</em>';
 $('endDesc').textContent=good&&!qualifiesForProgress()?'Round completed. Test and custom games do not change campaign progress.':good?(gameSession.level===12?'You survived five sectors and eighteen bosses without HP regeneration.':isHardMode()?'You completed stage '+hardStage()+' of the HARD campaign. The next sector is now available.':gameSession.level===5?'You survived a random layout, collected items and found the exit.':gameSession.level===10?'You escaped CHRUM and Nieznajomy in Sector 05. NORMAL completed.':gameSession.level===4?'You left CHRUM behind. The fifth sector is unlocked.':gameSession.level===1?'You finished the tutorial and unlocked the campaign':'You completed Level '+gameSession.level+'. The next zone is unlocked.'):gameSession.deathBy==='meltdown'?'You failed to repair the reactor in 45 seconds.':gameSession.deathBy==='hazard'?'Toxic liquid depleted your HP. Avoid radioactive puddles.':`DEFEATED BY: ${actor.name} · ${actor.alias}. Try another path and stay out of sight.`;
 $('endKiller').innerHTML=good?'':uiIcon('skull')+' '+(gameSession.deathBy==='hazard'?'TOKSYCZNY PLYN · 50 HP obrazen co 5 sekund':actor.name.toUpperCase()+' · '+actor.skill);
 $('endKiller').style.display=good?'none':'block';
 $('endCard').style.setProperty('--killer-accent',good?'#bde8b3':actor.color);
 $('nextBtn').style.display=good&&qualifiesForProgress()&&gameSession.level!==12&&gameSession.level!==13&&(isHardMode()?hardStage()<5:(gameSession.level<4||gameSession.level===4))?'inline-block':'none';
 setUIIconText($('nextBtn'),'play',(isHardMode()?'HARD ':'LEVEL ')+(isHardMode()?hardStage()+1:gameSession.level+1)+' · DALEJ');
 $('endTime').textContent='TIME '+formatTime(gameSession.clock);
 setUIIconText($('endItems'),gameSession.level===1?'battery':gameSession.level===4?'feed':isHardMode()?'skull':gameSession.level===5?'spark':'archive',gameSession.player.collected+'/'+gameSession.GOAL);
 let best=readBestTime(gameSession.level);
 if(good&&qualifiesForProgress()&&(!best||gameSession.clock<best)){best=gameSession.clock;progressWrite('catroomsBest'+gameSession.level,best)}
 $('bestTime').textContent=!qualifiesForProgress()?'TEST / BEZ REKORDU':best?'REKORD '+formatTime(best):'';
 if(typeof renderRoundSummary==='function')renderRoundSummary(good,previousBest);
 if(coop.role==='host')coop.roundEnd(good,gameSession.deathBy);else if(coop.role==='guest')coop.guestEnd();
 stopHum();
}

function win(){if(gameSession.state==='playing'){playWin();finish(true)}}

function lose(killerId='cat'){
 if(gameSession.state!=='playing'||damageBlocked(killerId))return false;
 gameSession.deathBy=ACTORS[killerId]?killerId:'cat';setState('jumpscare');const actor=ACTORS[gameSession.deathBy];
 $('jump').querySelector('img').src=actor.image;
 $('jump').style.background=gameSession.deathBy==='watcher'?'#032732':gameSession.deathBy==='listener'?'#42111f':gameSession.deathBy==='pig'?'#54301e':gameSession.deathBy==='hazard'?'#1d4720':'#4c0909';
 $('jumpName').textContent=(gameSession.deathBy==='hazard'?'WYKONCZYL CIE: ':'CAUGHT BY: ')+actor.name;
 UI.hud.classList.remove('show');UI.mobile.classList.remove('playing');$('jump').classList.add('show');
 stopGameSounds();stopHum();playLossScream();if(document.pointerLockElement===C)document.exitPointerLock?.();
 const generation=gameSession.generation;
 sessionTimers.defer('death',930,()=>{if(gameSession.generation===generation&&gameSession.state==='jumpscare'){ $('jump').classList.remove('show');finish(false); }});
 return true;
}

let mapClockVisible=false,mapHoldTimer=null;
function setMapVisibility(visible){gameSession.mapOn=!!visible;UI.map.classList.toggle('visible',gameSession.mapOn);if(gameSession.mapOn)drawMap();}
function toggleMap(){
 if(gameSession.state!=='playing')return;
 setMapVisibility(true);
 mapClockVisible=!mapClockVisible;
 const clockEl=$('mapClock');if(clockEl){clockEl.hidden=!mapClockVisible;clockEl.textContent=formatTime(gameSession.clock);}
 const details=$('mapRunDetails');if(details)details.hidden=!mapClockVisible;
 if(typeof syncDetectionHUD==='function')syncDetectionHUD();
}
function beginMapHold(){
 if(gameSession.state!=='playing')return;
 toggleMap();
 clearTimeout(mapHoldTimer);
 mapHoldTimer=setTimeout(()=>{if(keys.KeyM&&gameSession.state==='playing'){UI.map.classList.add('expanded');}},170);
}
function endMapHold(){clearTimeout(mapHoldTimer);mapHoldTimer=null;UI.map.classList.remove('expanded');}


function refreshLevelButton(){
 const rushBtn=$('bossRushBtn');if(rushBtn)rushBtn.hidden=!bossRushVisible();
 const hard=selectedDifficulty==='hard';
 const availability={2:hard?hardUnlocked[2]:unlocked2,3:hard?hardUnlocked[3]:unlocked3,4:hard?hardUnlocked[4]:unlocked4,5:hard?hardUnlocked[5]:unlocked5};
 const names={1:'YELLOW CORRIDORS',2:'FLOODED COMPLEX',3:'BLOODY ZONE',4:'CHRUM SECTOR',5:'LAST ENCOUNTER'};
 for(const [n,id] of [[2,'level2Btn'],[3,'finalBtn'],[4,'pigLevelBtn'],[5,'level5Btn']]){
  const b=$(id);b.disabled=!availability[n];
  b.textContent=availability[n]?names[n]:names[n]+' · LOCKED';
 }
 const count=1+Number(availability[2])+Number(availability[3])+Number(availability[4])+Number(availability[5]);
 $('progressText').textContent=(hard?'HARD · ':'')+'UNLOCKED '+count+'/5 LEVELS';
 for(let k=1;k<=5;k++){
  const best=readBestTime(hard?(k===5?11:k+5):(k===5?10:k));
  const el=$('record'+k);if(el)el.textContent=best?names[k]+': '+formatTime(best):names[k]+': NO RECORD';
 }
 streakRender();if(typeof syncSectorSelection==='function')syncSectorSelection();
}

function toggleRage(){
 if(gameSession.state!=='playing')return;if(coop.role==='guest'){showToast('RAGE MODE MOZE WLACZYC TYLKO HOST',2);return;}
 rageMode=!rageMode;
 document.body.classList.toggle('rage-active',rageMode);
 setUIIconText($('rageMobile'),'skull',rageMode?'DISABLE RAGE':'RAGE');
 showToast(rageMode?'☠ RAGE MODE: ENEMIESIE SA BARDZIEJ CZUJNI!':'RAGE MODE WYLACZONY',3);
 if(rageMode){playSting();if(gameSession.level===1&&!gameSession.awake){gameSession.awake=true;gameSession.wakeAt=0}}
}

function resetRage(){rageMode=false;document.body.classList.remove('rage-active');setUIIconText($('rageMobile'),'skull','RAGE')}
