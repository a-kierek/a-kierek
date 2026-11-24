// Initialize assets, renderer, saves and menu after all definitions are loaded.
'use strict';
document.querySelectorAll('.catImage').forEach(i=>i.src=CAT_PNG);
catImg.src=CAT_PNG;
preloadGameSounds();
$('startBtn').disabled=true;
$('proceduralBtn').disabled=true;
pigImg.src=PIG_PNG;strangerImg.src=STRANGER_PNG;
foodImg.src=FOOD_PNG;
slowDeviceImg.src=SLOW_DEVICE_PNG;freezeDeviceImg.src=FREEZE_DEVICE_PNG;

window.addEventListener('keydown',e=>{if(e.repeat||state!=='playing')return;if(e.code==='KeyQ'){if(coop.role==='guest')coop.sendAction('decoy');else throwDecoy()}});
$('decoyBtn').addEventListener('click',()=>{if(coop.role==='guest')coop.sendAction('decoy');else throwDecoy();});
$('level2Btn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[2]:unlocked2)openDossier(2)});
$('finalBtn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[3]:unlocked3)openDossier(3)});
$('dossierPlay').addEventListener('click',()=>transit(()=>begin(dossierLevel===5?(selectedDifficulty==='hard'?11:10):dossierLevel),dossierLevel===3?'BRAK DROGI POWROTNEJ':'DRZWI ZOSTAJA ZAMKNIETE'));
$('dossierBack').addEventListener('click',()=>setState('menu'));
$('pauseMenuBtn').addEventListener('click',()=>{stopHum();setState('menu');refreshLevelButton()});
$('dossierPortraitCat').src=CAT_PNG;
$('dossierPortraitWatcher').src=PERSON_B_PNG;
$('dossierPortraitListener').src=PERSON_A_PNG;
if($('dossierPortraitPig'))$('dossierPortraitPig').src=PIG_PNG;
$('dossierPortraitStranger').src=STRANGER_PNG;
unlocked3=progressRead('catroomsUnlocked3')==='1';
refreshLevelButton();
window.addEventListener('resize',resize);
document.addEventListener('contextmenu',e=>e.preventDefault());
unlocked2=progressRead("catroomsUnlocked2")==="1";
unlocked3=progressRead("catroomsUnlocked3")==="1";
refreshLevelButton();
metalTexture=createMetalTexture();
terminalImg=createTerminal();
keycardImg=createKeycard();
doorShutImg=createSecurityDoor();
wallTexture=createTexture();
doorTexture=createDoor(false);
doorOpenTexture=createDoor(true);
fuseImg=createFuse();
makeBackgroundTextures();
// Only choose a context after WebGPU has been negotiated. Acquiring Canvas2D
// first would permanently prevent WebGPU on this canvas.
(async function bootGraphics(){
 try {
   await initGraphics();renderBackendStatus();
   $('startBtn').disabled=false;$('proceduralBtn').disabled=false;
   resize();reset();setState('menu');updateTutorialVisibility();
   lastTime=performance.now();requestAnimationFrame(tick);
 } catch(error){
   console.error('Graphics startup failure:',error);
   window.CatroomsGraphicsStatus={backend:'error',error:String(error)};renderBackendStatus();
   const notice=document.createElement('div');notice.id='graphicsFailure';
   notice.textContent='Nie udalo sie uruchomic grafiki: '+error.message;
   notice.style.cssText='position:fixed;inset:auto 20px 20px;z-index:999;color:#fff;background:#622;padding:12px';
   document.body.appendChild(notice);
 }
})();
