// Mouse, keyboard and touch controls
personAImg.src=PERSON_A_PNG;
personBImg.src=PERSON_B_PNG;
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.repeat)return;if(e.code==='Escape'){if(state==='playing')pause();else if(state==='paused')resume()}if(state==='playing'){if(e.code==='KeyM')toggleMap();if(e.code==='KeyR')toggleRage();if(e.code==='KeyE'){if(coop.role==='guest')coop.sendAction('interact');else interact();}if(e.code==='KeyF'){player.flash=!player.flash;showToast(player.flash?'LATARKA WLACZONA':'LATARKA WYLACZONA',1)} }});
window.addEventListener('keyup',e=>{keys[e.code]=false});
window.addEventListener('blur',()=>{keys={};if(state==='playing'&&!isCoarse)pause()});
// Mouse-look: unrestricted yaw, clamped pitch (no upside-down camera).
document.addEventListener('mousemove',e=>{
 if(state==='playing' && document.pointerLockElement===C)
   setCameraLook(e.movementX*.0028*gameSettings.mouseSensitivity,-e.movementY*.00235*gameSettings.mouseSensitivity);
});
document.addEventListener('pointerlockchange',()=>{});
C.addEventListener('click',()=>{
 if(state==='playing'&&!isCoarse&&document.pointerLockElement!==C)C.requestPointerLock?.();
});
$('rageMobile').addEventListener('click',toggleRage);
$('startBtn').addEventListener('click',()=>{if(coop.role!=='solo'){coop.openLobby();return;}begin(1)});
$('nextBtn').addEventListener('click',()=>transitionToLevel2());
$('menuBtn').addEventListener('click',()=>{setState('menu');refreshLevelButton()});
$('resumeBtn').addEventListener('click',resume);
$('againBtn').addEventListener('click',()=>begin(level));
$('mapToggle').addEventListener('click',toggleMap);
$('soundToggle').addEventListener('click',()=>{muted=!muted;setUIIcon($('soundToggle'),muted?'mute':'sound');$('soundToggle').setAttribute('aria-label',muted?'Wlacz dzwiek':'Wycisz dzwiek');if(muted){stopHum();stopGameSounds();stopLossScream()}else initAudio()});
// Mobile: two simultaneous fingers. Left thumb for movement; right thumb for camera.
let touchCrouch=false;
// Touch sensitivity is controlled by gameSettings.touchSensitivity.
function resetMobileInputs(){
 touchX=0;touchY=0;touchRun=false;joyId=null;lookId=null;
 if(stick)stick.style.transform='translate(0px,0px)';
 $('runBtn').classList.remove('pressed');
}
function toggleMobileCrouch(){
 if(state!=='playing')return;
 touchCrouch=!touchCrouch;
 const el=$('crouchBtn');el.classList.toggle('pressed',touchCrouch);
 el.setAttribute('aria-pressed',String(touchCrouch));
 el.textContent=touchCrouch?'CICHO ✓':'CICHO';
}
$('interactBtn').addEventListener('click',()=>{if(coop.role==='guest')coop.sendAction('interact');else interact();});
$('crouchBtn').addEventListener('click',toggleMobileCrouch);
$('flashMobileBtn').addEventListener('click',()=>{
 if(state!=='playing')return;
 player.flash=!player.flash;showToast(player.flash?'LATARKA WLACZONA':'LATARKA WYLACZONA',1.5);
 $('flashMobileBtn').setAttribute('aria-pressed',String(!!player.flash));
});
$('pauseMobileBtn').addEventListener('click',()=>{if(state==='playing')pause()});

const pad=$('pad'),stick=$('stick'),lookZone=$('lookZone');
let joyId=null,lookId=null,lookLastX=0,lookLastY=0;
pad.addEventListener('pointerdown',e=>{
 if(state!=='playing'||joyId!==null)return;
 e.preventDefault();e.stopPropagation();joyId=e.pointerId;
 pad.setPointerCapture(e.pointerId);moveJoy(e);
});
pad.addEventListener('pointermove',e=>{if(e.pointerId===joyId){e.preventDefault();moveJoy(e)}});
function stopJoy(e){
 if(e.pointerId!==joyId)return;
 joyId=null;touchX=0;touchY=0;stick.style.transform='translate(0px,0px)';
}
pad.addEventListener('pointerup',stopJoy);pad.addEventListener('pointercancel',stopJoy);
pad.addEventListener('lostpointercapture',stopJoy);
function moveJoy(e){
 const box=pad.getBoundingClientRect();
 const dx=e.clientX-(box.left+box.width/2),dy=e.clientY-(box.top+box.height/2);
 const limit=box.width*.36,len=Math.hypot(dx,dy),ratio=len>limit?limit/len:1;
 const x=dx*ratio,y=dy*ratio;
 // Dead zone prevents idle drift while keeping full analog speed.
 let nx=x/limit,ny=y/limit;
 if(Math.hypot(nx,ny)<.085){nx=0;ny=0;}
 touchX=nx;touchY=ny;stick.style.transform=`translate(${x}px,${y}px)`;
}
function startLook(e){
 if(!isCoarse||state!=='playing'||lookId!==null)return;
 e.preventDefault();e.stopPropagation();
 lookId=e.pointerId;lookLastX=e.clientX;lookLastY=e.clientY;
 e.currentTarget.setPointerCapture(e.pointerId);
}
function moveLook(e){
 if(e.pointerId!==lookId)return;
 e.preventDefault();
 const dx=e.clientX-lookLastX,dy=e.clientY-lookLastY;
 lookLastX=e.clientX;lookLastY=e.clientY;
 setCameraLook(dx*.005*gameSettings.touchSensitivity,-dy*.0043*gameSettings.touchSensitivity);
}
function stopLook(e){if(e.pointerId===lookId)lookId=null;}
for(const surface of [lookZone,C]){
 surface.addEventListener('pointerdown',startLook);
 surface.addEventListener('pointermove',moveLook);
 surface.addEventListener('pointerup',stopLook);
 surface.addEventListener('pointercancel',stopLook);
 surface.addEventListener('lostpointercapture',stopLook);
}
const runButton=$('runBtn');
runButton.addEventListener('pointerdown',e=>{
 if(state!=='playing')return;e.preventDefault();
 touchRun=true;runButton.classList.add('pressed');runButton.setPointerCapture(e.pointerId);
});
function stopRun(){touchRun=false;runButton.classList.remove('pressed');}
for(const ev of ['pointerup','pointercancel','lostpointercapture'])runButton.addEventListener(ev,stopRun);
window.addEventListener('blur',resetMobileInputs);

$('pigLevelBtn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[4]:unlocked4)openDossier(4)});
$('level5Btn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[5]:unlocked5)openDossier(5)});
$('proceduralBtn').addEventListener('click',()=>begin(5));

for(const id of ['controlsHintToggle','controlsHintTogglePause']){const el=$(id);if(el){el.checked=showControlHints;el.addEventListener('change',e=>setControlsHintsPreference(e.target.checked));}}

$('hardSlowBtn').addEventListener('click',()=>useHardSlow());
$('hardFreezeBtn').addEventListener('click',()=>useHardFreeze());
