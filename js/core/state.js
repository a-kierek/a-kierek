// Shared game state, storage and numeric helpers
const CAT_PNG='assets/characters/marmur.png';
const PERSON_A_PNG='assets/characters/szept.png';
const PERSON_B_PNG='assets/characters/blysk.png';
const PIG_PNG='assets/characters/chrum.png';
const STRANGER_PNG='assets/characters/nowy-przeciwnik.png';
const BATTERY_PNG='assets/items/battery.png';
const CARD_PNG='assets/items/card.png';
const FOOD_PNG='assets/items/puffi.png';
const COIN_PNG='assets/items/grosz.png';
const SLOW_DEVICE_PNG='assets/items/slow-device.png';
const FREEZE_DEVICE_PNG='assets/items/freeze-device.png';
const ENERGY_DRINK_PNGS=[
 'assets/items/energy-classic.png','assets/items/energy-berry.png',
 'assets/items/energy-peach.png','assets/items/energy-ultra.png',
 'assets/items/energy-green.png'
];
const energyDrinkImgs=ENERGY_DRINK_PNGS.map(src=>{const img=new Image();img.src=src;return img});
const slowDeviceImg=new Image(),freezeDeviceImg=new Image();
let hardSeed=0,hardSlowUntil=0,hardPulseUntil=0,hardPulseNext=0;
let hardEmergency=null,hardNextEmergency=75,hardRocks=[];
const isHardMode=()=>level>=6&&level<=9||level===11;
const hardStage=()=>level===11?5:isHardMode()?level-5:0;
const renderStage=()=>level===10?5:isHardMode()?hardStage():level;

const BLOOD_DECAL_PNG='assets/decals/blood-realistic.png';
const strangerImg=new Image();
const pigImg=new Image();
const catImg=new Image();
const foodImg=new Image();
const C=document.getElementById('game');
let ctx=null;
const $=id=>document.getElementById(id);
const UI={hud:$('hud'),start:$('start'),pause:$('pause'),ending:$('ending'),count:$('count'),clock:$('clock'),goal:$('goal'),bearing:$('bearing'),signal:$('signalText'),stamina:$('staminaFill'),toast:$('toast'),danger:$('danger'),map:$('mapPanel'),mapCanvas:$('mapCanvas'),mobile:$('mobile'),hpFill:$('hpFill'),hpValue:$('hpValue'),tip:$('tipDesktop')};
const PI=Math.PI,TAU=2*PI;
let N=35,GOAL=5,level=1,unlocked2=false;
let W=720,H=400,imageData,frameBuffer,zBuffer,floorTexture,ceilingTexture,wallTexture,doorTexture,doorOpenTexture,fuseImg;
let guards=[],terminals=[],props=[],level2Items=[],doors=[],interactReady=null,crouching=false,alarmTimer=0,guardSight=0,guardNoise=0,metalTexture,metalFloor,metalCeil,terminalImg,keycardImg,doorShutImg,personAImg=new Image(),personBImg=new Image();
let world=[],fuses=[],exitCell={x:0,y:0},seen=[],player={},cat={},state='menu',clock=0,elapsed=0,walkPhase=0,awake=false,wakeAt=Infinity,catPath=[],pathTimer=0,started=false,now=0,nearCat=0,alertUntil=0,toastTimeout=0,flashUntil=0,mapOn=false,muted=false,audioCtx=null,ambientNodes=[],noiseBuffer=null,keys={},touchX=0,touchY=0,touchRun=false,isCoarse=matchMedia('(pointer:coarse)').matches,requestPause=false,lastTime=0,seed=48131;
let rageMode=false;
let unlocked3=false,keysOwned=new Set(),bonusItems=[],interactables=[],noiseEvents=[],decoys=[],eventTimer=0,eventState=null,deathBy='cat',cameraFloor=1,stats={doors:0,noises:0,panels:0},dossierLevel=2,guardCallCooldown=0;
const progressRead=(k,d='')=>{try{return localStorage.getItem(k)??d}catch(e){return d}};
const progressWrite=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(e){}};
const hardUnlocked={2:progressRead('catroomsHardUnlocked2','0')==='1',3:progressRead('catroomsHardUnlocked3','0')==='1',4:progressRead('catroomsHardUnlocked4','0')==='1',5:progressRead('catroomsHardUnlocked5','0')==='1'};
let unlocked5=progressRead('catroomsUnlocked5','0')==='1';
let selectedDifficulty=progressRead('catroomsDifficulty','normal')==='hard'?'hard':'normal';
let playerNickname=progressRead('catroomsNickname','GRACZ').trim().slice(0,22)||'GRACZ';
let tutorialCompleted=progressRead('catroomsTutorialDone')==='1',controlsHintsTouched=progressRead('catroomsControlsTouched','0')==='1',showControlHints=progressRead('catroomsShowControls',tutorialCompleted?'0':'1')==='1',tutorialStep=0,tutorialSeen=false;
function rnd(){seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296}

function clamp(x,a,b){return Math.max(a,Math.min(b,x))}

function formatTime(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}

// Local, version-safe player preferences. No network dependency.
const gameSettings={
 fov:clamp(Number(progressRead('catroomsCfgFov','75'))||75,60,110),
 mouseSensitivity:clamp(Number(progressRead('catroomsCfgMouse','1'))||1,.3,2.5),
 touchSensitivity:clamp(Number(progressRead('catroomsMobileLookSensitivity','1'))||1,.55,1.9),
 master:clamp(Number(progressRead('catroomsCfgMaster','100')),0,100),
 effects:clamp(Number(progressRead('catroomsCfgEffects','100')),0,100),
 voices:clamp(Number(progressRead('catroomsCfgVoices','100')),0,100),
 ambient:clamp(Number(progressRead('catroomsCfgAmbient','100')),0,100),
 jumpscare:clamp(Number(progressRead('catroomsCfgJumpscare','100')),0,100),
 quality:[.7,1,1.2].includes(Number(progressRead('catroomsCfgQuality','1')))?Number(progressRead('catroomsCfgQuality','1')):1,
 showFPS:progressRead('catroomsCfgFPS','1')==='1'
};
function cameraPlaneScale(){return Math.tan(gameSettings.fov*PI/360);}


// Horizontal yaw wraps freely. Vertical look stops at +/-75 degrees.
const LOOK_PITCH_LIMIT=Math.PI*75/180;
function setCameraLook(yawDelta,pitchDelta){
 if(!player||state!=='playing')return;
 player.a=((player.a+yawDelta+PI)%TAU+TAU)%TAU-PI;
 player.pitch=clamp((player.pitch||0)+pitchDelta,-LOOK_PITCH_LIMIT,LOOK_PITCH_LIMIT);
}
function viewPitchOffset(){
 // Bound projection offset while preserving +/-75° look. Tangent at 75° was
 // shifting the horizon multiple screen heights and magnifying floor geometry.
 return Math.sin(clamp(player.pitch||0,-LOOK_PITCH_LIMIT,LOOK_PITCH_LIMIT))*.58;
}
