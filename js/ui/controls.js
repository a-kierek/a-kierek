// Mouse, keyboard and touch controls
personAImg.src=PERSON_A_PNG;
personBImg.src=PERSON_B_PNG;
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.repeat)return;if(e.code==='Escape'){if(gameSession.state==='playing')pause();else if(gameSession.state==='paused')resume()}if(gameSession.state==='playing'){if(e.code==='KeyM')beginMapHold();if(e.code==='KeyV')rearPeek=true;if(e.code==='KeyE'){if(coop.role==='guest')coop.sendAction('interact');else interact();}if(e.code==='KeyF'){gameSession.player.flash=!gameSession.player.flash;showToast(gameSession.player.flash?'FLASHLIGHT ON':'FLASHLIGHT OFF',1)} }});
window.addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyM')endMapHold();if(e.code==='KeyE')gameSession.interactionHold=null;if(e.code==='KeyV')rearPeek=false;});
window.addEventListener('blur',()=>{keys={};gameSession.interactionHold=null;rearPeek=false;endMapHold(true);if(gameSession.state==='playing'&&!isCoarse)pause()});
// Mouse-look: unrestricted yaw, clamped pitch (no upside-down camera).
let pointerLockBegan=-10000;
document.addEventListener('mousemove',e=>{
 if(gameSession.state!=='playing'||document.pointerLockElement!==C)return;
 // Some browsers inject a large fake delta when pointer lock starts/returns.
 if(performance.now()-pointerLockBegan<120)return;
 const dx=e.movementX,dy=e.movementY;
 if(!Number.isFinite(dx)||!Number.isFinite(dy)||Math.abs(dx)>260||Math.abs(dy)>260)return;
 setCameraLook(clamp(dx,-85,85)*.0028*gameSettings.mouseSensitivity,-clamp(dy,-85,85)*.00235*gameSettings.mouseSensitivity);
});
document.addEventListener('pointerlockchange',()=>{pointerLockBegan=performance.now();});
window.addEventListener('wheel',e=>{
 if(gameSession.state!=='playing'||gameSession.graphicsDemo||UI.map.classList.contains('expanded')||!e.deltaY||e.ctrlKey)return;
 e.preventDefault();
 selectInventorySlot(gameSession.inventorySlot+Math.sign(e.deltaY));
},{passive:false});
C.addEventListener('mousedown',e=>{
 if(e.button!==2||gameSession.state!=='playing'||UI.map.classList.contains('expanded'))return;
 e.preventDefault();useSelectedItem();
});
C.addEventListener('contextmenu',e=>{if(gameSession.state==='playing')e.preventDefault();});
C.addEventListener('click',()=>{
 if(gameSession.state==='playing'&&!isCoarse&&document.pointerLockElement!==C)requestGamePointerLock();
});
$('rageMobile').addEventListener('click',()=>{});
$('startBtn').addEventListener('click',()=>{if(coop.role!=='solo'){coop.openLobby();return;}begin(1)});
$('nextBtn').addEventListener('click',()=>transitionToLevel2());
$('menuBtn').addEventListener('click',()=>{setState('menu');refreshLevelButton()});
$('resumeBtn').addEventListener('click',resume);
$('againBtn').addEventListener('click',()=>begin(gameSession.level,{testRun:gameSession.runTestEntry}));
$('mapToggle').addEventListener('click',toggleMap);
$('miniMapButton').addEventListener('click',toggleMap);
$('soundToggle').addEventListener('click',()=>{muted=!muted;setUIIcon($('soundToggle'),muted?'mute':'sound');$('soundToggle').setAttribute('aria-label',muted?'Wlacz dzwiek':'Wycisz dzwiek');if(muted){stopGameSounds();stopLossScream()}else unlockMenuMusic();refreshAudioMix()});
// Mobile: two simultaneous fingers. Left thumb for movement; right thumb for camera.
let touchCrouch=false;
// Touch sensitivity is controlled by gameSettings.touchSensitivity.
function resetMobileInputs(){
 touchX=0;touchY=0;touchRun=false;joyId=null;lookId=null;
 if(stick)stick.style.transform='translate(0px,0px)';
 $('runBtn').classList.remove('pressed');
}
function toggleMobileCrouch(){
 if(gameSession.state!=='playing')return;
 touchCrouch=!touchCrouch;
 const el=$('crouchBtn');el.classList.toggle('pressed',touchCrouch);
 el.setAttribute('aria-pressed',String(touchCrouch));
 el.textContent=touchCrouch?'CICHO ✓':'SNEAK';
}
const interactButton=$('interactBtn');
let interactPointer=null;
function pressInteract(){if(coop.role==='guest')coop.sendAction('interact');else interact();}
interactButton.addEventListener('pointerdown',e=>{
 if(interactPointer!==null||gameSession.state!=='playing'||e.button!==0)return;
 interactPointer=e.pointerId;
 interactButton.setPointerCapture(e.pointerId);
 pressInteract();
});
function releaseInteract(e){
 if(interactPointer!==e.pointerId)return;
 interactPointer=null;gameSession.interactionHold=null;
}
for(const type of ['pointerup','pointercancel','lostpointercapture'])interactButton.addEventListener(type,releaseInteract);
interactButton.addEventListener('click',e=>{if(e.detail===0&&gameSession.state==='playing'&&!needsInteractionHold(findInteractable()))pressInteract();});
$('crouchBtn').addEventListener('click',toggleMobileCrouch);
$('flashMobileBtn').addEventListener('click',()=>{
 if(gameSession.state!=='playing')return;
 gameSession.player.flash=!gameSession.player.flash;showToast(gameSession.player.flash?'FLASHLIGHT ON':'FLASHLIGHT OFF',1.5);
 $('flashMobileBtn').setAttribute('aria-pressed',String(!!gameSession.player.flash));
});
$('pauseMobileBtn').addEventListener('click',()=>{if(gameSession.state==='playing')pause()});

const pad=$('pad'),stick=$('stick'),lookZone=$('lookZone');
let joyId=null,lookId=null,lookLastX=0,lookLastY=0;
pad.addEventListener('pointerdown',e=>{
 if(gameSession.state!=='playing'||joyId!==null)return;
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
 if(!isCoarse||gameSession.state!=='playing'||lookId!==null)return;
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
 if(gameSession.state!=='playing')return;e.preventDefault();
 touchRun=true;runButton.classList.add('pressed');runButton.setPointerCapture(e.pointerId);
});
function stopRun(){touchRun=false;runButton.classList.remove('pressed');}
for(const ev of ['pointerup','pointercancel','lostpointercapture'])runButton.addEventListener(ev,stopRun);
window.addEventListener('blur',resetMobileInputs);

$('pigLevelBtn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[4]:unlocked4)openDossier(4)});
$('level5Btn').addEventListener('click',()=>{if(selectedDifficulty==='hard'?hardUnlocked[5]:unlocked5)openDossier(5)});
if($('proceduralBtn'))$('proceduralBtn').addEventListener('click',()=>begin(5));
$('bossRushBtn').addEventListener('click',()=>{if(bossRushVisible())begin(12);});
$('customStartBtn').addEventListener('click',()=>{readCustomGameForm();begin(13);});

for(const id of ['controlsHintToggle','controlsHintTogglePause']){const el=$(id);if(el){el.checked=showControlHints;el.addEventListener('change',e=>setControlsHintsPreference(e.target.checked));}}

$('hardSlowBtn').addEventListener('click',()=>useHardSlow());
$('hardFreezeBtn').addEventListener('click',()=>useHardFreeze());

// Mobile hold-to-peek: view only, does not invert movement or enemy perception.
for(const eventName of ['pointerdown'])$('rearPeekMobile').addEventListener(eventName,e=>{
 if(gameSession.state!=='playing')return;
 e.preventDefault();rearPeek=true;
 e.currentTarget.setPointerCapture?.(e.pointerId);
});
for(const eventName of ['pointerup','pointercancel','lostpointercapture'])$('rearPeekMobile').addEventListener(eventName,()=>{rearPeek=false;});
