// Initialize assets, renderer, saves and menu after all definitions are loaded.
'use strict';
if(window.CatroomsStartupError)throw new Error('Startup aborted after an earlier script error');
if(window.CatroomsScriptsReady!==true||typeof bossRushVisible!=='function'||typeof bossRushCompleted!=='function'||typeof resetBossRush!=='function'||typeof modeFor!=='function'||typeof customGameConfig!=='object'||typeof resetCustomGame!=='function'||typeof readCustomGameForm!=='function'||typeof customGameLineup!=='function')throw new Error('Incomplete game scripts: engine bundle or required mode missing. Extract the full current ZIP and restart the server.');
document.querySelectorAll('.catImage').forEach(i=>i.src=CAT_PNG);
catImg.src=CAT_PNG;
preloadGameSounds();
$('startBtn').disabled=true;
// The separate procedural-mode menu button was removed; custom games remain available.
if($('proceduralBtn'))$('proceduralBtn').disabled=true;
pigImg.src=PIG_PNG;strangerImg.src=STRANGER_PNG;
foodImg.src=FOOD_PNG;
slowDeviceImg.src=SLOW_DEVICE_PNG;freezeDeviceImg.src=FREEZE_DEVICE_PNG;

$('level2Btn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[2]:unlocked2)openDossier(2)});
$('finalBtn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[3]:unlocked3)openDossier(3)});
$('dossierPlay').addEventListener('click',()=>transit(()=>begin(dossierLevel===5?(selectedDifficulty==='hard'?11:10):dossierLevel),dossierLevel===3?'NONE DROGI POWROTNEJ':'DOORS CLOSE BEHIND YOU'));
$('dossierBack').addEventListener('click',()=>setState('menu'));
$('pauseMenuBtn').addEventListener('click',()=>{stopHum();setState('menu');refreshLevelButton()});
$('dossierPortraitCat').src=CAT_PNG;
$('dossierPortraitWatcher').src=PERSON_B_PNG;
$('dossierPortraitListener').src=PERSON_A_PNG;
if($('dossierPortraitPig'))$('dossierPortraitPig').src=PIG_PNG;
$('dossierPortraitStranger').src=STRANGER_PNG;
window.addEventListener('resize',resize);
document.addEventListener('contextmenu',e=>e.preventDefault());
unlocked2=progressRead("catroomsUnlocked2")==="1";
unlocked3=progressRead("catroomsUnlocked3")==="1";
chooseDifficulty(selectedDifficulty);
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
 const fill=$('loadingFill'),status=$('loadingStatus');
 window.CatroomsLoadingProgress=(pct,message)=>{if(fill)fill.style.width=pct+'%';if(status)status.textContent=message;};
 try {
   if(fill)fill.style.width='30%';if(status)status.textContent='LOADING TEXTURES AND 3D MODELS...';
   await initGraphics();renderBackendStatus();
   $('startBtn').disabled=false;if($('proceduralBtn'))$('proceduralBtn').disabled=false;
   resize();reset();setState('menu');updateTutorialVisibility();window.CatroomsPixelMenu.onReady();
   unlockMenuMusic();
   const retryMenuAudio=()=>{if(gameSession.state==='menu'&&bgTracks.menu?.paused)unlockMenuMusic();};
   document.addEventListener('pointerdown',retryMenuAudio,{capture:true});
   document.addEventListener('keydown',retryMenuAudio,{capture:true});
   if(fill)fill.style.width='100%';if(status)status.textContent='READY';
   const overlay=$('loadingScreen');if(overlay){overlay.classList.add('finished');setTimeout(()=>overlay.remove(),650);}
   resetSimulationClock();requestAnimationFrame(tick);
 } catch(error){
   console.error('Graphics startup failure:',error);
   window.CatroomsGraphicsStatus={backend:'error',error:String(error)};renderBackendStatus();
   if(status)status.textContent='WEBGPU ERROR: '+String(error?.message||error);
   if(fill)fill.style.width='100%';
   const overlay=$('loadingScreen');if(overlay)overlay.classList.add('load-failed');
   const notice=document.createElement('div');notice.id='graphicsFailure';
   notice.textContent='Unable to start graphics: '+error.message;
   notice.style.cssText='position:fixed;inset:auto 20px 20px;z-index:999;color:#fff;background:#622;padding:12px';
   document.body.appendChild(notice);
 }
})();
