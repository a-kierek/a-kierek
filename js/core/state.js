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
let hardSeed=0;
// Default custom settings exist before the mode registry or menu is initialized.
let customGameConfig={stage:1,size:65,difficulty:'normal',safeRooms:true,enemies:['cat']};

const isHardMode=()=>gameSession.level>=6&&gameSession.level<=9||gameSession.level===11||gameSession.level===12||(gameSession.level===13&&customGameConfig?.difficulty==='hard');
const hardStage=()=>gameSession.level===13?(customGameConfig?.stage||1):gameSession.level===12?(gameSession.bossRush?.stage||1):gameSession.level===11?5:isHardMode()?gameSession.level-5:0;
const renderStage=()=>gameSession.level===13?(customGameConfig?.stage||1):gameSession.level===12?(gameSession.bossRush?.stage||1):gameSession.level===10?5:isHardMode()?hardStage():gameSession.level;

const BLOOD_DECAL_PNG='assets/decals/blood-realistic.png';
const strangerImg=new Image();
const pigImg=new Image();
const catImg=new Image();
const foodImg=new Image();
const C=document.getElementById('game');
const $=id=>document.getElementById(id);
const UI={hud:$('hud'),start:$('start'),pause:$('pause'),ending:$('ending'),count:$('count'),clock:$('clock'),goal:$('goal'),bearing:$('bearing'),signal:$('signalText'),stamina:$('staminaFill'),toast:$('toast'),danger:$('danger'),map:$('mapPanel'),mapCanvas:$('mapCanvas'),mobile:$('mobile'),hpFill:$('hpFill'),hpValue:$('hpValue'),tip:$('tipDesktop')};
const SAFE_ROOM_POSTER_SRCS=['assets/posters/poster1.webp','assets/posters/poster2.webp','assets/posters/poster3.webp','assets/posters/poster4.webp','assets/posters/poster5.webp'];
const SAFE_ROOM_POSTER_IMAGES=SAFE_ROOM_POSTER_SRCS.map(src=>{const img=new Image();img.src=src;return img});
function staminaMax(){return gameSession.player?.maxStamina||100}
function staminaWidth(){return ((gameSession.player?.stamina||0)/Math.max(1,staminaMax())*100)+'%'}

function markWorldChanged(){gameSession.worldRevision++;}
const PI=Math.PI,TAU=2*PI;
let unlocked2=false;
let W=720,H=400,floorTexture,ceilingTexture,wallTexture,doorTexture,doorOpenTexture,fuseImg;
let metalTexture,metalFloor,metalCeil,terminalImg,keycardImg,doorShutImg,personAImg=new Image(),personBImg=new Image();
let muted=false,audioCtx=null,ambientNodes=[],noiseBuffer=null,keys={},touchX=0,touchY=0,touchRun=false,isCoarse=matchMedia('(pointer:coarse)').matches,seed=48131;
let rageMode=false;
let unlocked3=false,dossierLevel=2;
const progressRead=(k,d='')=>{try{return localStorage.getItem(k)??d}catch(e){return d}};
const progressWrite=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(e){}};
// Corrupt or obsolete localStorage values must never enter simulation/audio.
function readNumber(key,fallback,min=-Infinity,max=Infinity){
 const raw=progressRead(key,String(fallback));
 const value=raw.trim()===''?NaN:Number(raw);
 return Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
}
function readBestTime(level){return readNumber('catroomsBest'+level,0,0);}
// A genuine HARD campaign clear unlocks the mode naturally. The developer
// command `unlock all` also grants its own persistent menu unlock token.
const bossRushCompleted=()=>progressRead('catroomsBossRushUnlocked','0')==='1'||
  [1,2,3,4,5].every(n=>
    progressRead('catroomsHardCompleted'+n,'0')==='1'||
    readBestTime(n===5?11:n+5)>0);
// Boss Rush is a standalone HARD challenge: keep its entry visible even when
// NORMAL is selected in the difficulty toggle.
function bossRushVisible(){return bossRushCompleted();}
const hardUnlocked={2:progressRead('catroomsHardUnlocked2','0')==='1',3:progressRead('catroomsHardUnlocked3','0')==='1',4:progressRead('catroomsHardUnlocked4','0')==='1',5:progressRead('catroomsHardUnlocked5','0')==='1'};
let unlocked5=progressRead('catroomsUnlocked5','0')==='1';
let selectedDifficulty=progressRead('catroomsDifficulty','normal')==='hard'?'hard':'normal';
let playerNickname=progressRead('catroomsNickname','PLAYER').trim().slice(0,22)||'PLAYER';
let tutorialCompleted=progressRead('catroomsTutorialDone')==='1',controlsHintsTouched=progressRead('catroomsControlsTouched','0')==='1',showControlHints=progressRead('catroomsShowControls',tutorialCompleted?'0':'1')==='1',tutorialStep=0,tutorialSeen=false;
function rnd(){seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296}

// Randomness used when generating seeded maps; ordinary campaign loot keeps its random rolls.
function mapRandom(){return gameSession.level===5||gameSession.level===12||gameSession.level===13||isHardMode()?rnd():Math.random();}

function clamp(x,a,b){return Math.max(a,Math.min(b,x))}

function formatTime(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}

// Local, version-safe player preferences. No network dependency.
const gameSettings={
 fov:readNumber('catroomsCfgFov',75,60,110),
 mouseSensitivity:readNumber('catroomsCfgMouse',1,0.3,2.5),
 touchSensitivity:readNumber('catroomsMobileLookSensitivity',1,0.55,1.9),
 master:readNumber('catroomsCfgMaster',100,0,100),
 effects:readNumber('catroomsCfgEffects',100,0,100),
 voices:readNumber('catroomsCfgVoices',100,0,100),
 ambient:readNumber('catroomsCfgAmbient',100,0,100),
 jumpscare:readNumber('catroomsCfgJumpscare',100,0,100),
 quality:[.5,.7,.85,1,1.2].includes(Number(progressRead('catroomsCfgQuality','1')))?Number(progressRead('catroomsCfgQuality','1')):1,
 showFPS:progressRead('catroomsCfgFPS','1')==='1'
};
function cameraPlaneScale(){return Math.tan(gameSettings.fov*PI/360);}


// Horizontal yaw wraps freely. Vertical look stops at +/-75 degrees.
const LOOK_PITCH_LIMIT=Math.PI*75/180;
let rearPeek=false;
const cameraViewAngle=()=>((gameSession.player?.a||0)+(rearPeek?PI:0));
function setCameraLook(yawDelta,pitchDelta){
 if(!gameSession.player||gameSession.state!=='playing')return;
 if(!Number.isFinite(yawDelta)||!Number.isFinite(pitchDelta))return;
 yawDelta=clamp(yawDelta,-.28,.28);pitchDelta=clamp(pitchDelta,-.21,.21);
 gameSession.player.a=((gameSession.player.a+yawDelta+PI)%TAU+TAU)%TAU-PI;
 gameSession.player.pitch=clamp((gameSession.player.pitch||0)+pitchDelta,-LOOK_PITCH_LIMIT,LOOK_PITCH_LIMIT);
}
function viewPitchOffset(){
 // Physical pitch in radians, not a screen-space horizon shift.
 return clamp(gameSession.player?.pitch||0,-LOOK_PITCH_LIMIT,LOOK_PITCH_LIMIT);
}
