// SOURCE: js/ui/icons.js
/* THE CATROOMS : vector icon system. No icon fonts or network dependencies.
   Every icon is a tiny, accessible decorative SVG, shared by menus,
   mobile controls, HUD, pop-ups, and gameplay-generated labels. */
const CatroomIconPaths = Object.freeze({
  battery: '<path d="M68.08 39.9V12.09c0-3.36 1.38-6.37 3.55-8.54C73.82 1.36 76.87 0 80.17 0h97.66c3.32 0 6.37 1.39 8.53 3.56 2.17 2.17 3.56 5.21 3.56 8.53V39.9h29.59c21.17 0 38.49 17.34 38.49 38.49v394.62c0 21.18-17.31 38.49-38.49 38.49H38.49C17.33 511.5 0 494.15 0 473.01V78.39C0 57.2 17.3 39.9 38.49 39.9h29.59zM48.5 446.7V104.69c0-8.56 7.12-15.57 15.57-15.57h129.86c8.45 0 15.57 7.13 15.57 15.57V446.7c0 8.45-7 15.57-15.57 15.57H64.07c-8.57 0-15.57-7-15.57-15.57zm61.05-147.04H83.34c-5.56-.02-8.72-6.23-5.71-10.74l73.17-117.39c3.94-6.44 14.12-2.63 12.63 4.93l-19.94 76.18 31.08-.52c5.37-.1 8.69 5.72 6.03 10.33l-72.23 117.37c-3.81 6.32-13.68 2.93-12.72-4.46l13.9-75.7zM216.74 65.33H41.26c-8.68 0-15.82 7.15-15.82 15.82v389.09c0 8.7 7.12 15.82 15.82 15.82h175.48c8.67 0 15.82-7.15 15.82-15.82V81.15c0-8.68-7.11-15.82-15.82-15.82z" fill="currentColor" stroke="none" transform="translate(6.45 1) scale(.043)"/>',
  flame: '<path d="M12 22c-4.5 0-7-2.9-7-6.5 0-2.7 1.6-4.7 3-6 .2 2.2 1 3 1.8 3.3C10 8.7 13.9 4.6 15 2c.5 3.2 1.4 4.2 2.8 6.1 1.5 2.1 2.2 4.1 2.2 7.4 0 3.6-2.7 6.5-8 6.5z"/><path d="M12.4 21c-2.1 0-3.2-1.1-3.2-2.9 0-1.5 1.1-2.7 2.2-4.6.6 1.6 3.4 2.9 3.4 4.6 0 1.8-.8 2.9-2.4 2.9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  sound: '<path d="M4 10v4h4l5 4V6l-5 4H4zM17 9c1 1 1.5 2 1.5 3s-.5 2-1.5 3M19.5 6c2 1.7 3 3.8 3 6s-1 4.3-3 6"/>',
  mute: '<path d="M4 10v4h4l5 4V6l-5 4H4zM17 9l5 6m0-6l-5 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M9.7 2.7l.7 2.1a7.5 7.5 0 0 1 3.2 0l.7-2.1 3 1.6-.8 2.1c.8.7 1.5 1.5 2 2.5l2.2-.2.8 3.2-2.1 1a7.8 7.8 0 0 1-.8 3l1.5 1.8-2.4 2.4-1.8-1.5c-1 .6-2 .9-3 1l-1 2.1-3.2-.8.2-2.2c-1-.5-1.8-1.2-2.5-2l-2.1.8-1.6-3 .2-2.3a7.5 7.5 0 0 1 0-3.1l-.2-2.3 3-1.6 2.1.8a9 9 0 0 1 2.5-2z" transform="translate(0 -1) scale(.95)"/>',
  alert: '<path d="M12 3L2 21h20L12 3z"/><path d="M12 9v5M12 17v.5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3M12 15v2"/>',
  unlock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0M12 15v2"/>',
  pig: '<path d="M4.5 9V5l4 2a9 9 0 0 1 7 0l4-2v4c1.5 1.7 2 3.7 2 5.5a9.5 9.5 0 0 1-19 0c0-2 .7-3.8 2-5.5z"/><ellipse cx="12" cy="16" rx="4.3" ry="3"/><path d="M10.4 16h.1m3 0h.1M8 12h.1m8 0h.1" stroke-width="2.6"/>',
  headphones: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM17 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3z"/>',
  play: '<path d="M8 4l12 8-12 8V4z"/>',
  refresh: '<path d="M20 8a8 8 0 1 0 1 7M20 3v5h-5"/>',
  home: '<path d="M3 11.5L12 4l9 7.5M5.5 10.5V21h13V10.5M10 21v-7h4v7"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
  file: '<path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6M9 16h6"/>',
  reticle: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
  spark: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
  toxic: '<circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="12" r="9"/><path d="M12 9.8l-3-5M14 12h5.5M10 13l-3 5.4"/>',
  key: '<circle cx="8" cy="14.5" r="4"/><path d="M11.4 11l8-8 2 2-3 3 1.5 1.5-2.5 2.5-1.5-1.5-2.5 2.5"/>',
  door: '<path d="M6 3h12v18H6zM6 3l9 2v14l-9 2z"/><path d="M12 12h.1" stroke-width="2.5"/>',
  up: '<path d="M12 20V4M5 11l7-7 7 7"/>',
  right: '<path d="M4 12h16M13 5l7 7-7 7"/>',
  left: '<path d="M20 12H4M11 5l-7 7 7 7"/>',
  horizontal: '<path d="M2 12h20M7 7l-5 5 5 5M17 7l5 5-5 5"/>',
  vertical: '<path d="M12 2v20M7 7l5-5 5 5M7 17l5 5 5-5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  flashlight: '<path d="M7 3h10l-2 6-2 3v9h-2v-9L9 9zM5 1v2M12 1v2M19 1v2"/>',
  run: '<circle cx="15.5" cy="4" r="2"/><path d="M11 9l4 1 2 5M11 9l-3 4-4 1M13 10l-2 5-4 6M11 15l5 2 4 4"/>',
  sneak: '<circle cx="13" cy="5" r="2"/><path d="M10 9l4 2-2 4-5 2M14 11l5 1M12 15l4 5M7 17l-3 3M3 22h18"/>',
  hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v7c0 4-3 6-7 6-3 0-5-1-6-3l-3-5c-.5-1.4.7-2.5 2-2 1 .2 1.5 1 2 1.5z"/>',
  wifi: '<path d="M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0M12 21h.1"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  check: '<path d="M4 12l5.5 5.5L20 6"/>',
  skull: '<path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5.2 4 6v4h8v-4c2.5-.8 4-3 4-6a8 8 0 0 0-8-8z"/><path d="M9 11h.1m6 0h.1" stroke-width="2.6"/><path d="M10 17v3M14 17v3"/>',
  signal: '<path d="M3 20h2v-4H3zM8 20h2v-8H8zM13 20h2V8h-2zM18 20h2V4h-2z"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7v.5"/>',
  shield: '<path d="M12 2l8 3v6c0 6-3.5 9-8 11-4.5-2-8-5-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M16.5 7.5l-2 7-7 2 2-7z"/>',
  droplet: '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z"/><path d="M9 16c0 1.5 1 2.5 2.5 3"/>',
  monitor: '<rect x="3" y="4" width="18" height="14" rx="1.6"/><path d="M9 21h6M12 18v3M7 9h5M7 12h9"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  chevron: '<path d="M7 10l5 5 5-5"/>',
  exit: '<path d="M4 3h10v18H4zM14 12h8M18 8l4 4-4 4M11 12h.1"/>',
  heart: '<path d="M20.8 9.5c0 4.7-8.8 11-8.8 11S3.2 14.2 3.2 9.5a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6z"/>',
  mouse: '<rect x="7" y="2" width="10" height="20" rx="5"/><path d="M12 2v8"/>',
  warning: '<path d="M12 2l10 18H2L12 2z"/><path d="M12 9v5M12 17v.5"/>',
  feed: '<rect x="7" y="4" width="10" height="16" rx="1.5"/><path d="M7 7h10M7 17h10M10 11h4"/>',
  archive: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 8h16M8 13h8M8 17h4"/>'
});
const _iconAliases=Object.freeze({
 '⚡':'battery','🔥':'flame','🌽':'feed','🐖':'pig','🎧':'headphones',
 '🔒':'lock','🔓':'unlock','☣':'toxic','⚠':'warning','⛔':'alert',
 '🔑':'key','☠':'skull','🌐':'wifi','⚙':'settings','▦':'map',
 '♫':'sound','♪̸':'mute','◷':'clock','▣':'archive','✦':'spark',
 '✧':'spark','◈':'archive','⛨':'door','⌘':'terminal','⌂':'home',
 '↻':'refresh','↔':'horizontal','↕':'vertical','↑':'up',
 '←':'left','→':'right','▶':'play','✓':'check','✕':'close',
 '☀':'flashlight','Ⅱ':'pause','⊕':'plus','●':'dot'
});
const _iconTokenPattern=new RegExp(Object.keys(_iconAliases).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
const SVG_NS='http://www.w3.org/2000/svg';
function makeUIIcon(id,klass=''){
 const svg=document.createElementNS(SVG_NS,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
 svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.classList.add('ui-icon');
 if(klass)svg.classList.add(klass);
 svg.innerHTML=CatroomIconPaths[id]||CatroomIconPaths.info;
 return svg;
}
function uiIcon(id,klass='') {return makeUIIcon(id,klass).outerHTML;}
function setUIIcon(el,id){
 if(!el)return;
 el.replaceChildren(makeUIIcon(id));
 el.dataset.uiIcon=id;
}
function setUIIconText(el,id,txt){
 if(!el)return;
 el.replaceChildren(makeUIIcon(id),document.createTextNode(String(txt)));
 el.dataset.uiIcon=id;
}
function _iconizeText(node){
 if(!node || !node.parentNode || node.parentNode.closest('svg,script,style,textarea,option,code,pre'))return;
 const v=node.nodeValue;
 if(!v || !_iconTokenPattern.test(v)){_iconTokenPattern.lastIndex=0;return;}
 _iconTokenPattern.lastIndex=0;
 const fragment=document.createDocumentFragment();let last=0,m;
 while((m=_iconTokenPattern.exec(v))){
  if(m.index>last)fragment.append(document.createTextNode(v.slice(last,m.index)));
  fragment.append(makeUIIcon(_iconAliases[m[0]]));last=m.index+m[0].length;
 }
 if(last<v.length)fragment.append(document.createTextNode(v.slice(last)));
 node.replaceWith(fragment);
}
function iconizeUI(root){
 if(root.nodeType===Node.TEXT_NODE){_iconizeText(root);return;}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE&&root.closest('svg,script,style,textarea,option,code,pre'))return;
 if(root.matches?.('[data-icon]')){
  const icon=root.getAttribute('data-icon');root.replaceChildren(makeUIIcon(icon));return;
 }
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes)_iconizeText(n);
 for(const el of root.querySelectorAll?.('[data-icon]')||[])el.replaceChildren(makeUIIcon(el.getAttribute('data-icon')));
}
iconizeUI(document.body);
const catroomsIconObserver=new MutationObserver(records=>{
 for(const r of records){
  if(r.type==='characterData')_iconizeText(r.target);
  else for(const n of r.addedNodes)iconizeUI(n);
 }
});
catroomsIconObserver.observe(document.body,{childList:true,characterData:true,subtree:true});

;
// SOURCE: js/engine/session.js
// Single owner of mutable run state. Persistent preferences and GPU resources stay outside.
class GameSession {
 constructor(){
  this.level=1;this.state='menu';this.worldRevision=0;
  this.runCheated=false;this.runTestEntry=false;this.generation=0;
  this.resetRound();
 }
 resetRound(){
  this.generation++;this.worldRevision++;
  this.resetInterpolation();
  this.hardSlowUntil=0;
  this.hardPulseUntil=0;
  this.hardPulseNext=0;
  this.hardEmergency=null;
  this.hardNextEmergency=75;
  this.hardRocks=[];
  this.N=35;
  this.GOAL=5;
  this.guards=[];
  this.terminals=[];
  this.props=[];
  this.doors=[];
  this.interactReady=null;
  this.crouching=false;
  this.alarmTimer=0;
  this.guardSight=0;
  this.guardNoise=0;
  this.world=[];
  this.fuses=[];
  this.exitCell={x:0,y:0};
  this.seen=[];
  this.player={};
  this.cat={};
  this.clock=0;
  this.elapsed=0;
  this.walkPhase=0;
  this.awake=false;
  this.wakeAt=Infinity;
  this.catPath=[];
  this.pathTimer=0;
  this.nearCat=0;
  this.alertUntil=0;
  this.toastTimeout=0;
  this.flashUntil=0;
  this.mapOn=false;
  this.keysOwned=new Set();
  this.bonusItems=[];
  this.interactables=[];
  this.noiseEvents=[];
  this.eventTimer=0;
  this.eventState=null;
  this.deathBy='cat';
  this.cameraFloor=1;
  this.stats={doors:0,noises:0,panels:0};
  this.guardCallCooldown=0;
  this.bossRush=null;
  this.rushSafeRooms=[];
  this.safeRoom=null;
  this.safeRoomFurniture=[];
 }
 // Snap on pause, restart, or teleport. Rendering never modifies gameplay coordinates.
 resetInterpolation(){this.poses=new WeakMap();this.renderAlpha=1;}
 forEachActor(fn){
  fn(this.player);
  if(this.level===1&&this.awake)fn(this.cat);
  for(const guard of this.guards)fn(guard);
 }
 beginStep(){
  this.forEachActor(actor=>{
   if(!actor||!Number.isFinite(actor.x)||!Number.isFinite(actor.y))return;
   let p=this.poses.get(actor);
   if(!p){p={};this.poses.set(actor,p);}
   p.prevX=actor.x;p.prevY=actor.y;p.x=actor.x;p.y=actor.y;
  });
 }
 endStep(){
  this.forEachActor(actor=>{
   const p=this.poses.get(actor);if(p){p.x=actor.x;p.y=actor.y;}
  });
 }
 renderPosition(actor){
  const p=this.poses.get(actor);
  if(this.state!=='playing'||!p||p.x!==actor.x||p.y!==actor.y||Math.hypot(p.x-p.prevX,p.y-p.prevY)>.35)return actor;
  const a=this.renderAlpha;
  return {x:p.prevX+(p.x-p.prevX)*a,y:p.prevY+(p.y-p.prevY)*a};
 }
}
const gameSession=new GameSession();

// Named timer channels: replacements cancel older callbacks, including stale jumpscares.
class SessionTimers {
 constructor(schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id)){
  this.schedule=schedule;this.cancel=cancel;this.pending=new Map();
 }
 clear(name){const item=this.pending.get(name);if(item){this.pending.delete(name);this.cancel(item.id);}}
 defer(name,ms,fn){
  this.clear(name);const item={id:null};this.pending.set(name,item);
  item.id=this.schedule(()=>{if(this.pending.get(name)!==item)return;this.pending.delete(name);fn();},ms);
 }
}
const sessionTimers=new SessionTimers();

;
// SOURCE: js/core/state.js
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

;
// SOURCE: js/characters/actors.js
// Character definitions. Each portrait and gameplay sprite lives in assets/characters.
const ACTORS={
  cat:{id:'cat',name:'MARMUR',alias:'Kot z Level 1',image:CAT_PNG,img:catImg,skill:'Silent tracker. Remembers your last position.',risk:'HIGH',color:'#d8b4a0'},
  watcher:{id:'watcher',name:'BLYSK',alias:'Obserwator',image:PERSON_B_PNG,img:personBImg,skill:'Szerokie pole widzenia. Patroluje punkty obserwacyjne.',risk:'VERY HIGH',color:'#9ee5f5'},
  listener:{id:'listener',name:'SZEPT',alias:'Nasluchiwacz',image:PERSON_A_PNG,img:personAImg,skill:'Slyszy kroki zza zakretow. Bada zrodla halasu.',risk:'VERY HIGH',color:'#ef9e99'},
  stranger:{id:'stranger',name:'NIEZNAJOMY',alias:'Figure from the photograph / Sector 05',image:STRANGER_PNG,img:strangerImg,skill:'Tracks movement and reacts quickly to noise.',risk:'EKSTREMALNE',color:'#b2b8c6'},
  pig:{id:'pig',name:'CHRUM',alias:'Pig from sector 4',image:PIG_PNG,img:pigImg,skill:'Slyszy kroki i szarzuje, gdy Cie zobaczy.',risk:'HIGH',color:'#dfac9a'},
  meltdown:{id:'meltdown',name:'REACTOR FAILURE',alias:'The machine was not repaired in 45 seconds.',image:PERSON_B_PNG,img:personBImg,skill:'POWER FAILURE · TIME EXPIRED',risk:'KRYTYCZNE',color:'#d74e41'},
  hazard:{id:'hazard',name:'TOKSYCZNY PLYN',alias:'radioaktywna ciecz',image:PIG_PNG,img:pigImg,skill:'The liquid burned you. Avoid green puddles.',risk:'SRODOWISKOWE',color:'#8ad95c'}
};

;
// SOURCE: js/core/navigation.js
function bfsDistances(sx,sy){let dist=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(-1)),q=[[sx,sy]],head=0;dist[sy][sx]=0;while(head<q.length){let [x,y]=q[head++];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy;if(nx<=0||ny<=0||nx>=gameSession.N-1||ny>=gameSession.N-1||gameSession.world[ny][nx]!==0||dist[ny][nx]>=0)continue;dist[ny][nx]=dist[y][x]+1;q.push([nx,ny])}}return dist}

// Generation BFS above intentionally uses tiles only. Runtime collision, sight
// and navigation share the actual furniture footprint (not floored positions).
function solidFurniture(){return typeof gameSession.safeRoomFurniture==='undefined'?[]:gameSession.safeRoomFurniture;}
function solidBox(b){return b.material===1||b.material===3||b.material===4;}
function overlapsBox(x,y,r,b){return Math.abs(x-b.x)<b.w*.5+.14+r&&Math.abs(y-b.y)<b.d*.5+.14+r;}
function tileBlocked(x,y){return x<0||y<0||x>=gameSession.N||y>=gameSession.N||gameSession.world[y]?.[x]!==0;}
function isWall(x,y){return !freeAt(x,y,0);}
function freeAt(x,y,r=.23){
 if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(r)||r<0)return false;
 for(let ty=Math.floor(y-r);ty<=Math.floor(y+r);ty++)for(let tx=Math.floor(x-r);tx<=Math.floor(x+r);tx++)if(tileBlocked(tx,ty))return false;
 return !solidFurniture().some(b=>solidBox(b)&&overlapsBox(x,y,r,b));
}
function move(obj,dx,dy,r){
 // Subdivide large movements so a short frame stall cannot tunnel through furniture.
 const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.15));
 for(let i=0;i<steps;i++){
  if(freeAt(obj.x+dx/steps,obj.y,r))obj.x+=dx/steps;
  if(freeAt(obj.x,obj.y+dy/steps,r))obj.y+=dy/steps;
 }
}

let seenCache=null,seenX=-1,seenY=-1;
function updateSeen(){let px=Math.floor(gameSession.player.x),py=Math.floor(gameSession.player.y);if(seenCache===gameSession.seen&&px===seenX&&py===seenY)return;seenCache=gameSession.seen;seenX=px;seenY=py;for(let y=Math.max(0,py-5);y<=Math.min(gameSession.N-1,py+5);y++)for(let x=Math.max(0,px-5);x<=Math.min(gameSession.N-1,px+5);x++){if(Math.hypot(x-px,y-py)<5.1)gameSession.seen[y][x]=true}}

// Slab intersection for a segment and a furniture AABB.
function segmentHitsBox(ax,ay,bx,by,b,pad=0){
 let lo=0,hi=1;
 for(const [a,d,c,h] of [[ax,bx-ax,b.x,b.w*.5+.14+pad],[ay,by-ay,b.y,b.d*.5+.14+pad]]){
  if(Math.abs(d)<1e-12){if(a<c-h||a>c+h)return false;continue;}
  let t1=(c-h-a)/d,t2=(c+h-a)/d;
  if(t1>t2)[t1,t2]=[t2,t1];
  lo=Math.max(lo,t1);hi=Math.min(hi,t2);if(lo>hi)return false;
 }
 return true;
}
// Cache static furniture obstacles per map. Wall/door tiles are always live.
let navFurnitureSource=null,navFurnitureCount=-1,navSize=0,navBlocked=null,navEdges=null;
const NAV_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function prepareFurnitureNav(){
 const boxes=solidFurniture();
 if(navFurnitureSource===boxes&&navFurnitureCount===boxes.length&&navSize===gameSession.N)return;
 navFurnitureSource=boxes;navFurnitureCount=boxes.length;navSize=gameSession.N;
 navBlocked=new Uint8Array(gameSession.N*gameSession.N);navEdges=new Uint8Array(gameSession.N*gameSession.N);
 for(const b of boxes){
  if(!solidBox(b))continue;
  for(let y=Math.max(0,Math.floor(b.y-b.d/2-2));y<=Math.min(gameSession.N-1,Math.floor(b.y+b.d/2+2));y++){
   for(let x=Math.max(0,Math.floor(b.x-b.w/2-2));x<=Math.min(gameSession.N-1,Math.floor(b.x+b.w/2+2));x++){
    const idx=y*gameSession.N+x;
    if(overlapsBox(x+.5,y+.5,.23,b))navBlocked[idx]=1;
    for(let k=0;k<4;k++){const [dx,dy]=NAV_DIRS[k];if(segmentHitsBox(x+.5,y+.5,x+.5+dx,y+.5+dy,b,.23))navEdges[idx]|=1<<k;}
   }
  }
 }
}
// Reuse typed workspaces instead of allocating and clearing two N*N arrays per search.
let navWork=null;
function searchNav(sx,sy,tx,ty,maxDistance=Infinity){
 if(![sx,sy,tx,ty].every(Number.isInteger)||tileBlocked(sx,sy)||tileBlocked(tx,ty)||(sx===tx&&sy===ty))return null;
 prepareFurnitureNav();
 const start=sy*gameSession.N+sx,target=ty*gameSession.N+tx;
 if(navBlocked[target])return null;
 if(!navWork||navWork.size!==gameSession.N*gameSession.N)navWork={size:gameSession.N*gameSession.N,q:new Int32Array(gameSession.N*gameSession.N),prev:new Int32Array(gameSession.N*gameSession.N),dist:new Int32Array(gameSession.N*gameSession.N),stamp:new Uint32Array(gameSession.N*gameSession.N),epoch:0};
 const {q,prev,dist,stamp}=navWork;
 let epoch=navWork.epoch=(navWork.epoch+1)>>>0;
 if(!epoch){stamp.fill(0);epoch=navWork.epoch=1;}
 let head=0,tail=1;q[0]=start;stamp[start]=epoch;prev[start]=start;dist[start]=0;
 while(head<tail){
  const here=q[head++];if(here===target)return {start,target,prev,distance:dist[here]};
  if(dist[here]>=maxDistance)continue;
  const x=here%gameSession.N,y=Math.floor(here/gameSession.N);
  for(let k=0;k<4;k++){
   const [dx,dy]=NAV_DIRS[k],nx=x+dx,ny=y+dy,idx=ny*gameSession.N+nx;
   if(tileBlocked(nx,ny)||stamp[idx]===epoch||navBlocked[idx]||(navEdges[here]&(1<<k)))continue;
   stamp[idx]=epoch;prev[idx]=here;dist[idx]=dist[here]+1;q[tail++]=idx;
  }
 }
 return null;
}
function findPath(sx,sy,tx,ty){
 const found=searchNav(sx,sy,tx,ty);if(!found)return [];
 const {start,target,prev}=found,path=[];
 for(let v=target;v!==start;v=prev[v])path.push({x:v%gameSession.N+.5,y:Math.floor(v/gameSession.N)+.5});
 return path.reverse();
}
function navPathDistance(sx,sy,tx,ty,maxDistance=Infinity){
 const found=searchNav(sx,sy,tx,ty,Math.floor(maxDistance));
 return found&&found.distance<=maxDistance?found.distance:Infinity;
}
// Grid DDA: visit every crossed cell, including diagonal corner contacts.
// Only the actual target gate/exit tile may be ignored for an interaction.
function lineOfSight(ax,ay,bx,by,options={}){
 if(![ax,ay,bx,by].every(Number.isFinite))return false;
 let x=Math.floor(ax),y=Math.floor(ay),tx=Math.floor(bx),ty=Math.floor(by);
 const dx=bx-ax,dy=by-ay,sx=Math.sign(dx),sy=Math.sign(dy);
 const blocked=(xx,yy)=>!(options.allowTargetTile&&xx===tx&&yy===ty)&&tileBlocked(xx,yy);
 if(blocked(x,y))return false;
 const deltaX=sx?1/Math.abs(dx):Infinity,deltaY=sy?1/Math.abs(dy):Infinity;
 let nextX=sx?(sx>0?x+1-ax:ax-x)*deltaX:Infinity,nextY=sy?(sy>0?y+1-ay:ay-y)*deltaY:Infinity;
 while(x!==tx||y!==ty){
  if(x===tx)nextX=Infinity;if(y===ty)nextY=Infinity;
  if(Math.abs(nextX-nextY)<1e-10){if(blocked(x+sx,y)||blocked(x,y+sy))return false;x+=sx;y+=sy;nextX+=deltaX;nextY+=deltaY;}
  else if(nextX<nextY){x+=sx;nextX+=deltaX;}
  else{y+=sy;nextY+=deltaY;}
  if(blocked(x,y))return false;
 }
 for(const b of solidFurniture()){
  if(!solidBox(b))continue;
  if(options.allowTargetFurniture&&b.material===1&&Math.abs(b.x-bx)<.001&&Math.abs(b.y-by)<.001)continue;
  if(segmentHitsBox(ax,ay,bx,by,b))return false;
 }
 return true;
}

;
// SOURCE: js/maps/level1.js
function buildMap(){gameSession.N=51;gameSession.GOAL=7;seed=19472;gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));let stack=[[1,1]];gameSession.world[1][1]=0;while(stack.length){let [x,y]=stack[stack.length-1];let steps=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>rnd()-.5);let next=steps.find(([dx,dy])=>{let nx=x+dx,ny=y+dy;return nx>0&&ny>0&&nx<gameSession.N-1&&ny<gameSession.N-1&&gameSession.world[ny][nx]===1});if(!next){stack.pop();continue}let [dx,dy]=next;gameSession.world[y+dy/2][x+dx/2]=0;gameSession.world[y+dy][x+dx]=0;stack.push([x+dx,y+dy])}
 for(let k=0;k<54;k++){let x=2+Math.floor(rnd()*(gameSession.N-7)),y=2+Math.floor(rnd()*(gameSession.N-7)),rw=2+Math.floor(rnd()*5),rh=2+Math.floor(rnd()*5);for(let j=y;j<Math.min(gameSession.N-1,y+rh);j++)for(let i=x;i<Math.min(gameSession.N-1,x+rw);i++)gameSession.world[j][i]=0}
 for(let k=0;k<120;k++){let x=2+Math.floor(rnd()*(gameSession.N-4)),y=2+Math.floor(rnd()*(gameSession.N-4));if(gameSession.world[y][x]===1&&((gameSession.world[y][x-1]===0&&gameSession.world[y][x+1]===0)||(gameSession.world[y-1][x]===0&&gameSession.world[y+1][x]===0)))gameSession.world[y][x]=0}
 for(let y=1;y<5;y++)for(let x=1;x<5;x++)gameSession.world[y][x]=0;
 let dist=bfsDistances(2,2),max=-1,far={x:gameSession.N-4,y:gameSession.N-4};for(let y=1;y<gameSession.N-1;y++)for(let x=1;x<gameSession.N-1;x++){if(gameSession.world[y][x]===0&&dist[y][x]>max){max=dist[y][x];far={x,y}}}gameSession.exitCell=far;gameSession.world[far.y][far.x]=3;
 let candidates=[];for(let y=1;y<gameSession.N-1;y++)for(let x=1;x<gameSession.N-1;x++)if(gameSession.world[y][x]===0&&dist[y][x]>12){candidates.push({x,y,d:dist[y][x]})}candidates.sort((a,b)=>b.d-a.d);gameSession.fuses=[];
 for(let s=0;s<gameSession.GOAL;s++){let possible=candidates.filter(c=>gameSession.fuses.every(f=>Math.hypot(c.x-f.x,c.y-f.y)>9)&&Math.hypot(c.x-2,c.y-2)>11);if(!possible.length)possible=candidates.filter(c=>gameSession.fuses.every(f=>Math.hypot(c.x-f.x,c.y-f.y)>6));let idx=Math.min(possible.length-1,Math.floor(possible.length*(.05+s*.12+rnd()*.08)));let p=possible[Math.max(0,idx)];gameSession.fuses.push({x:p.x+.5,y:p.y+.5,taken:false,phase:rnd()*TAU})}
 scatterEnvironmentalProps(18,8,gameSession.fuses);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetBase(){if(gameSession.level===2){resetLevel2();return}document.body.classList.remove("level2");gameSession.GOAL=7;gameSession.guards=[];gameSession.terminals=[];gameSession.props=[];gameSession.doors=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.crouching=false;buildMap();gameSession.player={x:2.5,y:2.5,a:.6,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hp:100,maxHp:100};let distances=bfsDistances(2,2),opts=[];for(let y=1;y<gameSession.N-1;y++)for(let x=1;x<gameSession.N-1;x++)if(distances[y][x]>35&&gameSession.world[y][x]===0)opts.push({x,y,d:distances[y][x]});opts.sort((a,b)=>b.d-a.d);let cp=opts[Math.floor(opts.length*.15)]||{x:30,y:30};gameSession.cat=makeGuard(cp.x+.5,cp.y+.5,"cat");gameSession.elapsed=0;gameSession.clock=0;gameSession.awake=false;gameSession.wakeAt=Infinity;gameSession.catPath=[];gameSession.pathTimer=0;gameSession.walkPhase=0;gameSession.nearCat=0;gameSession.alertUntil=0;gameSession.toastTimeout=0;gameSession.flashUntil=0;gameSession.mapOn=false;UI.map.classList.remove('visible');UI.count.textContent='0';$('required').textContent=String(gameSession.GOAL);setUIIcon(document.querySelector('.chip .gem'),'battery');$('levelLabel').textContent='LEVEL 1 / YELLOW CORRIDORS';UI.goal.textContent='TUTORIAL · FIND 7 BATTERIES';UI.clock.textContent='00:00';UI.stamina.style.width=staminaWidth();UI.danger.style.opacity=0;UI.toast.classList.remove('visible');$('stealthStatus').textContent='● UNDETECTED';$('interactHint').style.display='none';primeHealth();setupLevel1Tutorial();updateSeen();updateTutorialVisibility()}

;
// SOURCE: js/maps/shared.js
function addGate(id,x,y,title,requires,hint){
  gameSession.world[y][x]=4;gameSession.doors.push({id,x,y,title,requires,hint,open:false});
}

function addPickup(id,x,y,type,name,quantity=1){
  gameSession.world[Math.floor(y)][Math.floor(x)]=0;
  const entry={id,x,y,type,name,quantity,taken:false,phase:rnd()*6};
  if(type==='stamina'){entry.energySprite=Math.floor(mapRandom()*ENERGY_DRINK_PNGS.length);entry.fakeMonster=false;}
  gameSession.bonusItems.push(entry);
}

function prepareEnergyDrinkLottery(){
 const drinks=gameSession.bonusItems.filter(item=>item.type==='stamina');
 for(const item of drinks)item.fakeMonster=false;
 if(drinks.length)drinks[Math.floor(mapRandom()*drinks.length)].fakeMonster=true;
}

function scatterEnergyDrinks(count=3){
 const distances=bfsDistances(3,3), candidates=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||distances[y][x]<7||Math.hypot(x-gameSession.exitCell.x,y-gameSession.exitCell.y)<3.5)continue;
  if([...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems].some(q=>Math.hypot(q.x-x-.5,q.y-y-.5)<3.2))continue;
  candidates.push({x,y,d:distances[y][x]});
 }
 candidates.sort(()=>rnd()-.5);
 const picked=[];
 for(const q of candidates){
  if(picked.every(p=>Math.hypot(p.x-q.x,p.y-q.y)>=7))picked.push(q);
  if(picked.length===count)break;
 }
 picked.forEach((q,i)=>addPickup('energy-'+i,q.x+.5,q.y+.5,'stamina','ENERGY DRINK'));
 prepareEnergyDrinkLottery();
}

function addCard(id,x,y){gameSession.world[Math.floor(y)][Math.floor(x)]=0;gameSession.fuses.push({id,x,y,taken:false,phase:rnd()*TAU})}

function addControl(id,x,y,title,order=0){gameSession.world[Math.floor(y)][Math.floor(x)]=0;let item={id,x,y,type:'panel',title,used:false,order};gameSession.interactables.push(item);gameSession.terminals.push(item)}

function addLocker(x,y){gameSession.world[Math.floor(y)][Math.floor(x)]=0;gameSession.interactables.push({id:'hide-'+x+'-'+y,x,y,type:'hide',title:'LOCKER / HIDING PLACE'})}


function floorSlots(){
  const out=[];
  for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++)if(gameSession.world[y][x]===0)out.push({x,y});
  return out;
}

function scatterEnvironmentalProps(bloodCount,hazardCount,avoid=[]){
  const chosen=[];
  const blocked=[{x:Math.floor(gameSession.player.x||3.5),y:Math.floor(gameSession.player.y||3.5)},{x:gameSession.exitCell.x,y:gameSession.exitCell.y},...avoid.map(p=>({x:Math.floor(p.x),y:Math.floor(p.y)}))];
  const cells=floorSlots().sort(()=>rnd()-.5);
  function okay(c){
    if(blocked.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<3.2))return false;
    if(chosen.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<2.4))return false;
    return true;
  }
  for(const c of cells){if(chosen.length>=bloodCount+hazardCount)break;if(!okay(c))continue;chosen.push(c)}
  chosen.forEach((c,i)=>gameSession.props.push({type:i<hazardCount?'hazard':'blood',x:c.x+.5+(rnd()-.5)*.18,y:c.y+.5+(rnd()-.5)*.18,phase:rnd()*TAU,size:((i<hazardCount)?.68:.74)+rnd()*.12}));
}

function refreshHpHud(){
  if(!UI.hpFill||!UI.hpValue||!gameSession.player) return;
  const hp=clamp(gameSession.player.hp??100,0,100);
  UI.hpFill.style.width=hp+'%';
  UI.hpValue.textContent=Math.round(hp)+' / 100';
}

function primeHealth(){
  gameSession.player.hp=100;gameSession.player.lastHazardHit=-999;gameSession.player.lastDamageAt=-999;gameSession.player.regenBucket=0;refreshHpHud();
}

function updateTutorialVisibility(){
  if(!UI.tip)return;
  const visible=false; // Gameplay hints removed; controls remain in main menu and settings.
  UI.tip.style.display=visible?'block':'none';
}

function setControlsHintsPreference(value){
  showControlHints=!!value;controlsHintsTouched=true;
  progressWrite('catroomsShowControls',showControlHints?'1':'0');
  progressWrite('catroomsControlsTouched','1');
  for(const id of ['controlsHintToggle','controlsHintTogglePause','settingControls','menuSettingControls']){const el=$(id);if(el)el.checked=showControlHints}
  updateTutorialVisibility();
}

function setupLevel1Tutorial(){
  tutorialStep=tutorialCompleted?999:0;
  tutorialSeen=!tutorialCompleted;
}

function updateLevel1Tutorial(){
  // Kontrolki dostepne wylacznie w menu/ustawieniach, bez komunikatow klawiszy podczas rozgrywki.
  return;
  if(tutorialCompleted||gameSession.level!==1)return;
  if(tutorialStep===0){showToast('SAMOUCZEK · WASD: ruch, MYSZ: obrot, SHIFT: bieg, CTRL: skradanie.',5);tutorialStep=1;return}
  if(tutorialStep===1&&gameSession.elapsed>8){showToast('FOLLOW THE ARROW AND COLLECT BATTERIES. F TOGGLES FLASHLIGHT, M OPENS MAP.',5);tutorialStep=2;return}
  if(tutorialStep===2&&gameSession.player.collected>=1){showToast('GOOD. COLLECT ALL ITEMS, THEN FIND THE GREEN EXIT.',4.5);tutorialStep=3;return}
  if(tutorialStep===3&&gameSession.awake){showToast('MARMUR IS AWAKE. RUN AND AVOID DEAD ENDS.',5);tutorialStep=4;return}
  if(tutorialStep===4&&gameSession.player.collected>=gameSession.GOAL){showToast('THE EXIT IS OPEN. REACH THE GREEN DOOR.',4.5);tutorialStep=5;return}
}

// Shields protect against contact and toxic damage for 12 simulation seconds.
// Reactor meltdown remains a failed objective, not ordinary damage.
function damageBlocked(cause){
 if(!godMode&&(cause==='meltdown'||gameSession.elapsed>=(gameSession.player.shieldUntil||0)))return false;
 if(gameSession.elapsed>lastShieldToast+2){showToast(godMode?'ADMIN GOD MODE · NIEWRAZLIWOSC':'SHIELD · DAMAGE BLOCKED',1.8);lastShieldToast=gameSession.elapsed;}
 return true;
}
function applyHazardsAndRegen(dt){
  const hazards=gameSession.props.filter(p=>p.type==='hazard'&&(!p.expires||p.expires>gameSession.elapsed));
  const touching=hazards.find(h=>Math.hypot(gameSession.player.x-h.x,gameSession.player.y-h.y)<.7);
  if(touching && gameSession.elapsed-(gameSession.player.lastHazardHit??-999)>=5){
    if(!damageBlocked('hazard')){
    gameSession.player.lastHazardHit=gameSession.elapsed;gameSession.player.lastDamageAt=gameSession.elapsed;gameSession.player.regenBucket=0;
    gameSession.player.hp=Math.max(0,(gameSession.player.hp??100)-50);refreshHpHud();playHurt();
    showToast('☣ TOKSYCZNY PLYN · -50 HP',2.8);
    if(gameSession.player.hp<=0&&lose('hazard'))return true;
    }
  }
  if(gameSession.level!==12&&(gameSession.player.hp??100)<100){
    // First healing tick after two seconds without a hit, then 10 HP every two seconds.
    gameSession.player.regenBucket=(gameSession.player.regenBucket||0)+dt;
    if(gameSession.elapsed-(gameSession.player.lastDamageAt??-999)>=2){
      while(gameSession.player.regenBucket>=2 && gameSession.player.hp<100){gameSession.player.regenBucket-=2;gameSession.player.hp=Math.min(100,gameSession.player.hp+10);refreshHpHud();}
    }
  }
  return false;
}

function chooseSpawnView(){
  let longest=-1,best=0;
  for(let i=0;i<64;i++){
    let a=TAU*i/64,d=.22;
    for(;d<17;d+=.17)if(isWall(gameSession.player.x+Math.cos(a)*d,gameSession.player.y+Math.sin(a)*d))break;
    if(d>longest){longest=d;best=a}
  }
  gameSession.player.a=best;
}

function commonFacilityReset(){
  gameSession.player={x:3.5,y:3.5,a:.32,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hidden:false,hp:100,maxHp:100};
  gameSession.keysOwned=new Set();gameSession.noiseEvents=[];gameSession.crouching=false;gameSession.eventTimer=43;gameSession.eventState=null;gameSession.cameraFloor=1;gameSession.stats={doors:0,noises:0,panels:0};
  gameSession.elapsed=0;gameSession.clock=0;gameSession.awake=true;gameSession.wakeAt=0;gameSession.walkPhase=0;gameSession.nearCat=Infinity;gameSession.alertUntil=0;gameSession.toastTimeout=0;gameSession.flashUntil=0;gameSession.mapOn=false;gameSession.guardSight=0;gameSession.guardNoise=0;gameSession.alarmTimer=0;gameSession.interactReady=null;gameSession.guardCallCooldown=0;
  UI.map.classList.remove('visible');UI.count.textContent='0';$('required').textContent=gameSession.GOAL;
  setUIIcon(document.querySelector('.chip .gem'),gameSession.level===2?'archive':'spark');
  $('levelLabel').textContent=gameSession.level===2?'LEVEL 2 / FLOODED COMPLEX':'FINAL LEVEL / BLOODY ZONE';
  UI.clock.textContent='00:00';UI.stamina.style.width=staminaWidth();UI.danger.style.opacity=0;UI.toast.classList.remove('visible');
  $('interactHint').style.display='none';$('stealthStatus').textContent='● UNDETECTED';$('missionDetails').style.display='block';
  primeHealth();chooseSpawnView();updateSeen();updateObjectiveFacility();updateTutorialVisibility();
}

function requirementReason(g){
  const req=g.requires||{};
  if(req.key&&!gameSession.keysOwned.has(req.key))return g.hint;
  if(req.item&&!gameSession.fuses.some(f=>f.id===req.item&&f.taken))return g.hint;
  if(req.panel&&!gameSession.terminals.some(t=>t.id===req.panel&&t.used))return g.hint;
  if(req.cards!=null&&gameSession.player.collected<req.cards)return g.hint;
  if(req.panels!=null&&gameSession.terminals.filter(t=>t.used).length<req.panels)return g.hint;
  return '';
}

;
// SOURCE: js/maps/level2.js
// Actual layout defined in maps/navigable.js; separate file for level-specific setup.
function createLevel2World(){
  const [lo,mid,hi]=carveFriendlyLayout(49,304792);
  gameSession.GOAL=6;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  for(const [id,x,y] of [['blue',hi,lo],['green',lo,hi],['red',hi,hi],['yellow',mid,mid],['cyan',lo,mid],['amber',hi,mid]])addCard(id,x+.5,y+.5);
  addControl('power',mid+.5,lo+.5,'POWER CONTROL');
  addControl('pump',mid+.5,hi+.5,'DRAINAGE PUMP');
  addControl('filters',lo+.5,lo+.5,'MAIN FILTERS');
  addPickup('decoy2a',lo+.5,mid+.5,'stamina','ENERGY DRINK',1);
  addPickup('decoy2b',hi+.5,mid+.5,'stamina','ENERGY DRINK',1);
  for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2]])addLocker(x+.5,y+.5);
  addGate('shortcut2a',mid,lo+5,'SHORTCUT A',{cards:1},'Collect one card');
  addGate('shortcut2b',mid,hi-5,'SHORTCUT B',{panel:'power'},'Activate the power panel');
  addGate('shortcut2c',lo+5,mid,'MAINTENANCE C',{panel:'filters'},'Activate the main filters');
  gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
  scatterEnvironmentalProps(24,10,[...gameSession.fuses,...gameSession.terminals]);
  scatterEnergyDrinks(3);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel2(){
 document.body.classList.add('level2');document.body.classList.remove('final-level','pig-level','procedural-level');
 createLevel2World();commonFacilityReset();
 gameSession.guards=[makeGuard(27.5,5.5,'watcher'),makeGuard(6.5,27.5,'listener')];
 gameSession.guards[0].a=PI;gameSession.guards[1].a=-PI/2;gameSession.cat=gameSession.guards[0];
}


;
// SOURCE: js/maps/level3.js
function createFinalWorld(){
 const [lo,mid,hi]=carveFriendlyLayout(57,882971);
 gameSession.GOAL=8;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
 for(const [id,x,y] of [['core1',hi,lo],['core2',lo,hi],['core3',hi,hi],['core4',mid,mid],['core5',lo,mid],['core6',hi,mid],['core7',mid,lo],['core8',mid,hi]])addCard(id,x+.5,y+.5);
 addControl('reactor1',mid+.5,lo+.5,'REACTOR I · POWER',1);
 addControl('reactor2',lo+.5,lo+.5,'REACTOR II · PRESSURE',2);
 addControl('reactor3',mid+.5,hi+.5,'REACTOR III · INSULATION',3);
 addControl('reactor4',hi+.5,lo+.5,'REACTOR IV · COOLING',4);
 for(const [i,x,y] of [['fA',lo,mid],['fB',hi,mid],['fC',mid,hi]])addPickup(i,x+1.5,y+1.5,'stamina','ENERGY DRINK',1);
 for(const [x,y] of [[lo+1,lo+2],[hi-1,lo+2],[lo+1,hi-2],[hi-1,hi-2],[mid+2,mid+2]])addLocker(x+.5,y+.5);
 addGate('f-shortcut',mid,lo+6,'EMERGENCY PASSAGE',{cards:2},'Collect two cores');
 addGate('f-rescue',mid,hi-6,'MAINTENANCE THRESHOLD',{panel:'reactor2'},'Activate the second reactor');
 addGate('f-core',hi-5,mid,'COOLING CORRIDOR',{panel:'reactor4'},'Activate the fourth reactor');
 gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
 scatterEnvironmentalProps(28,12,[...gameSession.fuses,...gameSession.terminals]);
 scatterEnergyDrinks(3);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel3(){
 document.body.classList.remove('level2','pig-level','procedural-level');document.body.classList.add('final-level');
 createFinalWorld();commonFacilityReset();
 gameSession.guards=[makeGuard(6.5,31.5,'cat'),makeGuard(36.5,6.5,'watcher'),makeGuard(32.5,31.5,'listener')];
 gameSession.guards[0].a=-PI/2;gameSession.guards[1].a=PI;gameSession.guards[2].a=0;gameSession.cat=gameSession.guards[0];
}


;
// SOURCE: js/maps/navigable.js
// Shared, human-readable layout for campaign levels 2, 3 and 4.
// Three wide north/south and east/west routes make a connected grid with loops.
function carveFriendlyLayout(size, mapSeed) {
  gameSession.N=size; seed=mapSeed;
  gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
  const hubs=[4,Math.floor(gameSession.N/2),gameSession.N-5];
  const rect=(x,y,w,h)=>{
    for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)
      for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++) gameSession.world[yy][xx]=0;
  };
  // Continuous broad corridors with no unavoidable locked branches.
  for(const x of hubs)rect(x-1,2,3,gameSession.N-4);
  for(const y of hubs)rect(2,y-1,gameSession.N-4,3);
  for(let yi=0;yi<2;yi++)for(let xi=0;xi<2;xi++){
    const cx=Math.round((hubs[xi]+hubs[xi+1])/2);
    const cy=Math.round((hubs[yi]+hubs[yi+1])/2);
    const w=7+Math.floor(rnd()*3),h=7+Math.floor(rnd()*3);
    rect(cx-Math.floor(w/2),cy-Math.floor(h/2),w,h);
    rect(cx-1,hubs[yi],3,cy-hubs[yi]+1);
    rect(cx-1,cy,3,hubs[yi+1]-cy+1);
    rect(hubs[xi],cy-1,cx-hubs[xi]+1,3);
    rect(cx,cy-1,hubs[xi+1]-cx+1,3);
    // Decorative columns away from main room exits.
    if(w>=8&&h>=8&&rnd()>.45){
      const px=cx+2,py=cy+2;if(gameSession.world[py]?.[px]===0)gameSession.world[py][px]=1;
    }
  }
  // Sightline landmarks: a few optional shortcuts and double-width passages.
  for(let i=0;i<8;i++){
    const x=6+Math.floor(rnd()*(gameSession.N-12)),y=6+Math.floor(rnd()*(gameSession.N-12));
    if(gameSession.world[y][x]===0)rect(x,y,2,2);
  }
  return hubs;
}


function createPigWorld(){
  const [lo,mid,hi]=carveFriendlyLayout(53,923401);
  gameSession.GOAL=7;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  [['feed1',hi,lo],['feed2',lo,hi],['feed3',hi,hi],['feed4',mid,mid],['feed5',lo,mid],['feed6',hi,mid],['feed7',mid,hi]]
    .forEach(([id,x,y])=>addCard(id,x+.5,y+.5));
  addControl('barn',mid+.5,lo+.5,'GATE LEVER');
  addControl('vent',mid+.5,hi+.5,'BARN VENTILATION');
  addControl('mixer',lo+.5,lo+.5,'FEED MIXER');
  for(const [x,y] of [[hi,mid],[lo,lo],[mid,mid+4]])
    addPickup('bacon-'+x+'-'+y,x+.5,y+.5,'stamina','ENERGY DRINK',1);
  for(const [x,y] of [[lo+2,lo+2],[hi-2,lo+2],[lo+2,hi-2]])addLocker(x+.5,y+.5);
  addGate('pen',mid,lo+6,'BARN GATE',{panel:'barn'},'Pull the gate lever');
  addGate('feedcorridor',lo+5,mid,'FEED GATE',{panel:'mixer'},'Start the feed mixer');
  gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
  scatterEnvironmentalProps(22,11,[...gameSession.fuses,...gameSession.terminals]);
  scatterEnergyDrinks(3);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}

function resetLevel4(){
  document.body.classList.remove('level2','final-level');
  document.body.classList.add('pig-level');
  createPigWorld();commonFacilityReset();
  $('levelLabel').textContent='LEVEL 4 / CHRUM SECTOR';
  setUIIcon(document.querySelector('.chip .gem'),'feed');
  gameSession.guards=[makeGuard(gameSession.N-5.5,5.5,'pig',{x0:1,y0:1,x1:gameSession.N-2,y1:gameSession.N-2})];
  gameSession.guards[0].a=PI;gameSession.cat=gameSession.guards[0];
  showToast('YOU HEAR GRUNTING IN THE DISTANCE...',4);
}

;
// SOURCE: js/maps/level5.js
// Sector 05 is a separate campaign chapter, not the normal procedural mode.
// Includes CHRUM and an independent stranger pursuer using the user's photo sprite.
function createLevel5World(){
  const [lo,mid,hi]=carveFriendlyLayout(61,514271);
  gameSession.GOAL=8;gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  for(const [id,x,y] of [
    ['sector5-a',hi,lo],['sector5-b',lo,hi],['sector5-c',hi,hi],
    ['sector5-d',mid,mid],['sector5-e',lo,mid],['sector5-f',hi,mid],
    ['sector5-g',mid,lo],['sector5-h',mid,hi]
  ])addCard(id,x+.5,y+.5);
  addControl('sector5-generator',mid+.5,lo+.5,'EMERGENCY GENERATOR');
  addControl('sector5-antenna',lo+.5,lo+.5,'ALARM ANTENNA');
  addControl('sector5-vent',mid+.5,hi+.5,'SECTOR VENTILATION');
  for(const [i,x,y] of [['a',lo,mid],['b',hi,mid],['c',mid,hi]])
    addPickup('sector5-decoy-'+i,x+1.5,y+1.5,'stamina','ENERGY DRINK',1);
  for(const [x,y] of [[lo+2,lo+2],[hi-2,lo+2],[lo+2,hi-2],[hi-2,hi-2]])addLocker(x+.5,y+.5);
  // The gates occupy secondary corridors; key objectives stay on the open grid.
  addGate('s5-maintenance',mid,lo+6,'SERWIS',{panel:'sector5-generator'},'Start the generator');
  addGate('s5-vent',mid,hi-6,'VENTILATION SHAFT',{panel:'sector5-vent'},'Start ventilation');
  gameSession.exitCell={x:hi-3,y:hi};gameSession.world[hi][hi-3]=3;
  scatterEnvironmentalProps(29,13,[...gameSession.fuses,...gameSession.terminals]);
  scatterEnergyDrinks(4);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
}
function resetLevel5(){
  document.body.classList.remove('level2','final-level','procedural-level','hard-level','hard-detected');
  document.body.classList.add('pig-level','sector-five');
  createLevel5World();commonFacilityReset();
  gameSession.guards=[makeGuard(gameSession.N-6.5,5.5,'pig'),makeGuard(6.5,gameSession.N-7.5,'stranger')];
  gameSession.guards[0].a=Math.PI;gameSession.guards[1].a=-Math.PI/2;
  gameSession.cat=gameSession.guards[0];
  $('levelLabel').textContent='SEKTOR 05 / LAST ENCOUNTER';
  setUIIcon(document.querySelector('.chip .gem'),'feed');
  $('eventTag').textContent='CHRUM + NIEZNAJOMY';
  updateObjectiveFacility();
  showToast('SEKTOR 05 · TWO THREATS DETECTED',4);
}

;
// SOURCE: js/characters/ai.js
// Never spawn a guard in a wall or on an isolated side of a locked door.
// Reachability is checked from the player entrance with the current live map.
function safeGuardSpawn(x,y){
 if(gameSession.level===12){
   const xx=Math.floor(x),yy=Math.floor(y);
   if(freeAt(xx+.5,yy+.5,.23))return{x:xx+.5,y:yy+.5};
   for(let radius=1;radius<12;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)
     if(freeAt(xx+dx+.5,yy+dy+.5,.23))return{x:xx+dx+.5,y:yy+dy+.5};
 }
 const start=(isHardMode()||gameSession.level===13)?7:gameSession.level===5?6:gameSession.level===1?2:3;
 const dist=bfsDistances(start,start);
 let best=null,bestScore=Infinity;
 for(let yy=1;yy<gameSession.N-1;yy++)for(let xx=1;xx<gameSession.N-1;xx++){
   if(gameSession.world[yy]?.[xx]!==0||dist[yy][xx]<0||dist[yy][xx]<6)continue;
   const cx=xx+.5,cy=yy+.5;
   if(!freeAt(cx,cy,.24))continue;
   const score=Math.hypot(x-cx,y-cy)+(.002*dist[yy][xx]);
   if(score<bestScore){best={x:cx,y:cy};bestScore=score}
 }
 return best||{x:3.5,y:3.5};
}

function makeGuard(x,y,kind,territory=null){
  const spawn=safeGuardSpawn(x,y);x=spawn.x;y=spawn.y;
  return {id:kind,kind,x,y,territory,stuckTime:0,a:rnd()*TAU,state:'patrol',memory:null,heard:null,investigate:null,patrolTarget:null,path:[],pathTimer:0,alert:0,searchTimer:0,listenTimer:0,lastSeen:-100,wasSeeing:false,patrolFail:0,searchStep:0};
}

function randomPatrolPoint(g){
  if(!g||!g.x)return{x:3.5,y:3.5};
  let points=[];
  let a=g.territory||{x0:1,y0:1,x1:gameSession.N-2,y1:gameSession.N-2};
  for(let attempts=0;attempts<70;attempts++){
    let x=Math.floor(a.x0+rnd()*(a.x1-a.x0+1)),y=Math.floor(a.y0+rnd()*(a.y1-a.y0+1));
    if(!freeAt(x+.5,y+.5,.23)||Math.hypot(g.x-x-.5,g.y-y-.5)<3.5)continue;
    if(lineOfSight(g.x,g.y,x+.5,y+.5)||Number.isFinite(navPathDistance(Math.floor(g.x),Math.floor(g.y),x,y))){return{x:x+.5,y:y+.5}}
  }
  return{x:g.x,y:g.y};
}

function addNoise(x,y,radius,type='urzadzenie'){
  gameSession.noiseEvents.push({x,y,radius,expiry:gameSession.elapsed+2.4,type});gameSession.stats.noises++;
  if(gameSession.noiseEvents.length>25)gameSession.noiseEvents.shift();
}

function audibleDistance(g,x,y,maxDistance){
 const d=Math.hypot(g.x-x,g.y-y);
 if(d>maxDistance)return Infinity;
 if(lineOfSight(g.x,g.y,x,y))return d;
 return navPathDistance(Math.floor(g.x),Math.floor(g.y),Math.floor(x),Math.floor(y),maxDistance);
}

function updateGuard(g,dt,idx=0){
  if(!freeAt(g.x,g.y,.23)){
    const safe=safeGuardSpawn(g.x,g.y);g.x=safe.x;g.y=safe.y;
    g.path=[];g.pathTimer=0;g.patrolTarget=null;g.stuckTime=0;
  }
  if(g.frozen){g.state='frozen';return {sees:false,distance:Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y)};}
  const prey=coop.role==='host'&&coop.active ? [gameSession.player,...coop.remotes.values()].filter(p=>p&&p.x!=null).sort((a,b)=>Math.hypot(g.x-a.x,g.y-a.y)-Math.hypot(g.x-b.x,g.y-b.y))[0]||gameSession.player : gameSession.player;
  const preyCrouching=prey===gameSession.player?gameSession.crouching:!!prey.crouching;
  const distance=Math.hypot(g.x-prey.x,g.y-prey.y);
  const range=(g.kind==='watcher'?11.4:g.kind==='listener'?6.4:g.kind==='pig'?7.7:g.kind==='stranger'?10.2:8.3)*1.48*(rageMode?(gameSession.level===3?1.85:1.45):1)*(gameSession.eventState?.kind==='blackout'?.67:1)*(g.hardEnhanced?1.57:1);
  const fov=(g.kind==='watcher'?1.48:g.kind==='listener'?1.9:g.kind==='pig'?2.25:g.kind==='stranger'?2.0:2.0)*(rageMode?1.2:1)*(g.hardEnhanced?1.31:1);
  const angle=Math.atan2(prey.y-g.y,prey.x-g.x);
  const facing=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)))<fov;
  let sees=g.variant==='gray'&&isHardMode()?true:distance<range&&facing&&lineOfSight(g.x,g.y,prey.x,prey.y);
  if(prey.hidden&&distance>1.1&&g.variant!=='gray')sees=false;
  if(preyCrouching&&distance>3.3&&g.state!=='chase'&&g.kind!=='watcher'&&g.variant!=='gray')sees=false;
  if(!prey.flash&&!rageMode&&distance>5&&g.kind!=='watcher'&&g.state!=='chase'&&g.variant!=='gray')sees=false;
  const protectedPrey=prey===gameSession.player&&isSafeRoomProtected();
  if(protectedPrey)sees=false;
  if(protectedPrey&&!g.preyProtected){g.memory=null;g.investigate=null;g.heard=null;g.patrolTarget=null;g.path=[];g.pathTimer=0;g.state='patrol';}
  g.preyProtected=protectedPrey;
  if(sees){
    if(g.state!=='chase')g.pathTimer=0;
    g.state='chase';
    const lead=g.hardEnhanced&&prey.moving?Math.min(2.8,distance*.21):0;
    const px=prey.x+Math.cos(prey.a||0)*lead,py=prey.y+Math.sin(prey.a||0)*lead;
    g.memory=lead&&freeAt(px,py,.24)?{x:px,y:py}:{x:prey.x,y:prey.y};g.alert=g.hardEnhanced?12:rageMode?(gameSession.level===3?13:9):5.5;g.searchTimer=0;g.lastSeen=gameSession.elapsed;
    if(gameSession.level===3&&!g.wasSeeing&&gameSession.guardCallCooldown<=0){
      gameSession.guardCallCooldown=5.5;
      for(let ally of gameSession.guards)if(ally!==g&&Math.hypot(g.x-ally.x,g.y-ally.y)<(rageMode?29:18)){
        if(ally.state!=='chase'){ally.state='suspicious';ally.investigate={x:g.memory.x,y:g.memory.y};ally.searchTimer=9;ally.pathTimer=0}
      }
      addNoise(g.x,g.y,9,'ostrzezenie');
    }
  }else{
    g.listenTimer=(g.listenTimer||0)-dt;
    if(g.listenTimer<=0){
      g.listenTimer=.42+idx*.09;
      let best=null,score=Infinity;
      // Preserve Level 1's footstep hearing, with path-aware attenuation.
      if(!protectedPrey&&gameSession.level===1&&prey.moving&&!preyCrouching){
        const running=prey===gameSession.player?(keys.ShiftLeft||keys.ShiftRight||touchRun):!!prey.sprinting;
        const radius=(running?9.3:3.3)*(rageMode?1.5:1);
        const noiseDist=audibleDistance(g,prey.x,prey.y,radius);
        if(noiseDist<radius){best={x:prey.x,y:prey.y};score=noiseDist}
      }
      for(let e of gameSession.noiseEvents){
        if(e.expiry<gameSession.elapsed||protectedPrey&&bossRushRooms().some(r=>!r.open&&e.x>=r.left+1&&e.x<r.left+r.side-1&&e.y>=r.top+1&&e.y<r.top+r.side-1))continue;
        let mult=(g.kind==='listener'?1.55:g.kind==='pig'?1.35:1)*1.20*(rageMode?(gameSession.level===3?1.9:1.5):1)*(g.hardEnhanced?1.57:1);
        let distanceSound=audibleDistance(g,e.x,e.y,e.radius*mult);
        if(distanceSound<e.radius*mult&&distanceSound<score){best=e;score=distanceSound}
      }
      if(best&&g.state!=='chase'){
        g.heard={x:best.x,y:best.y};
        // Repeated footsteps update the destination, not the listening countdown.
        if(g.state==='suspicious'){
          if(!g.investigate||Math.hypot(g.investigate.x-best.x,g.investigate.y-best.y)>1)g.pathTimer=0;
          g.investigate=g.heard;
        }else if(g.state!=='listen'){g.state='listen';g.alert=rageMode?1.8:1.1;g.pathTimer=0;}
      }
    }
    if(g.state==='chase'){g.alert-=dt;if(g.alert<=0){g.state='search';g.investigate=g.memory;g.searchTimer=g.hardEnhanced?17:rageMode?(gameSession.level===3?19:13):8;g.pathTimer=0}}
    else if(g.state==='listen'){g.alert-=dt;if(g.alert<=0){g.state='suspicious';g.investigate=g.heard;g.pathTimer=0}}
    else if(g.state==='search'){
      g.searchTimer-=dt;
      if(g.searchTimer<=0){g.state='patrol';g.memory=null;g.investigate=null;g.patrolTarget=null}
    }
  }
  g.wasSeeing=sees;
  let target=null;
  if(g.state==='chase')target=g.memory;
  else if(g.state==='suspicious'||g.state==='search')target=g.investigate;
  else if(g.state==='patrol'){
    if(!g.patrolTarget||Math.hypot(g.x-g.patrolTarget.x,g.y-g.patrolTarget.y)<.72)g.patrolTarget=randomPatrolPoint(g);
    target=g.patrolTarget;
  }else if(g.state==='listen'){g.a+=dt*.9;}
  if(target&&Math.hypot(g.x-target.x,g.y-target.y)<.7&&g.state!=='chase'){
    if(g.state==='suspicious'){g.state='search';g.searchTimer=rageMode?14:7;g.investigate=randomPatrolPoint(g);target=g.investigate;}
    else if(g.state==='search'){g.investigate=randomPatrolPoint(g);target=g.investigate;}
    else if(g.state==='patrol'){g.patrolTarget=randomPatrolPoint(g);target=g.patrolTarget;}
    g.pathTimer=0;
  }
  g.pathTimer-=dt;
  if(target&&g.pathTimer<=0){
    g.path=findPath(Math.floor(g.x),Math.floor(g.y),Math.floor(target.x),Math.floor(target.y));
    g.pathTimer=(g.hardEnhanced?.19:rageMode?.25:.52)+idx*.025;
    if(!g.path.length&&Math.hypot(g.x-target.x,g.y-target.y)>1.4&&g.state==='patrol')g.patrolTarget=null;
  }
  if(!target)g.path=[];
  let waypoint=g.path[0];if(waypoint&&Math.hypot(g.x-waypoint.x,g.y-waypoint.y)<.27){g.path.shift();waypoint=g.path[0]}
  if(target&&lineOfSight(g.x,g.y,target.x,target.y)&&(Math.hypot(g.x-target.x,g.y-target.y)<1.8||(!waypoint&&g.state==='chase')))waypoint=target;
  // A blocked/empty patrol must not permanently lock the field of view.
  if((!waypoint||Math.hypot(g.x-waypoint.x,g.y-waypoint.y)<=.02)&&(g.state==='patrol'||g.state==='search'||g.state==='suspicious'))g.a=(g.a+dt*1.2)%TAU;
  if(waypoint){
    let dx=waypoint.x-g.x,dy=waypoint.y-g.y,len=Math.hypot(dx,dy);
    if(len>.02){
      let speed=(g.kind==='cat'?1.64:g.kind==='watcher'?1.65:g.kind==='pig'?1.53:g.kind==='stranger'?1.78:1.5)*(g.state==='chase'?(g.kind==='pig'?1.83:1.40):g.state==='search'?1.14:1)*(rageMode?(gameSession.level===3?1.39:1.2):1)*(g.speedMultiplier||1)*(hardSlowActive()?.52:1);
      let step=Math.min(dt*speed,len),beforeX=g.x,beforeY=g.y;move(g,dx/len*step,dy/len*step,.23);
      g.a=Math.atan2(dy,dx);
      if(Math.hypot(g.x-beforeX,g.y-beforeY)<step*.08)g.stuckTime=(g.stuckTime||0)+dt;
      else g.stuckTime=0;
      if(g.stuckTime>2){g.pathTimer=0;g.path=[];g.patrolTarget=null;g.stuckTime=0;
        if(g.state==='patrol')g.patrolTarget=randomPatrolPoint(g);
      }
    }
  }
  if(sees)gameSession.guardSight=Math.max(gameSession.guardSight,1.2);
  return{sees,distance};
}

;
// SOURCE: js/gameplay/campaign.js
function pickup(){for(let f of gameSession.fuses){if(f.taken)continue;if(Math.hypot(gameSession.player.x-f.x,gameSession.player.y-f.y)<.64&&lineOfSight(gameSession.player.x,gameSession.player.y,f.x,f.y)){f.taken=true;gameSession.player.collected++;UI.count.textContent=gameSession.player.collected;playPickup();gameSession.flashUntil=gameSession.elapsed+.3;if(!gameSession.awake&&gameSession.wakeAt===Infinity){gameSession.wakeAt=gameSession.elapsed+5;showToast('⚡ BATTERY FOUND · SOMETHING WOKE UP',4)}else showToast('⚡ FOUND BATTERIES '+gameSession.player.collected+'/'+gameSession.GOAL);if(gameSession.player.collected>=gameSession.GOAL){UI.goal.textContent='FIND THE GREEN EXIT';showToast('✓ POWER RESTORED · ESCAPE!',5);playUnlock()}}}}

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
 pickup();pickupCoins();updateCoinCounter();updateSeen();
 gameSession.interactReady=findInteractable();$('interactHint').style.display=gameSession.interactReady?'block':'none';
 if(gameSession.interactReady)$('interactHint').textContent='[ E ] '+(gameSession.interactReady.type==='safeDoor'?'OPEN / CLOSE ROOM':gameSession.interactReady.type==='slot'?'PLAY FOR 1 COIN':'UZYJ');
 if(applyHazardsAndRegen(dt))return;
 if(gameSession.awake){updateGuard(gameSession.cat,dt,0);let distance=Math.hypot(gameSession.cat.x-gameSession.player.x,gameSession.cat.y-gameSession.player.y);gameSession.nearCat=distance;UI.danger.style.opacity=distance<5?String(clamp((5-distance)/2,0,1)):'0';if(distance<.67&&!isSafeRoomProtected()&&lineOfSight(gameSession.cat.x,gameSession.cat.y,gameSession.player.x,gameSession.player.y)&&lose())return;
 }else{gameSession.nearCat=Infinity;UI.danger.style.opacity=0}
 // Admin-spawned guards on Level 1 must use the same simulation as their sprites.
 for(let i=0;i<gameSession.guards.length;i++){const g=gameSession.guards[i];updateGuard(g,dt,i+1);const d=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y);gameSession.nearCat=Math.min(gameSession.nearCat,d);if(d<.66&&!isSafeRoomProtected()&&lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y)&&lose(g.id))return;}
 if(gameSession.guards.length)UI.danger.style.opacity=gameSession.nearCat<5?String(clamp((5-gameSession.nearCat)/2,0,1)):'0';
 if(gameSession.player.collected===gameSession.GOAL&&Math.hypot(gameSession.player.x-(gameSession.exitCell.x+.5),gameSession.player.y-(gameSession.exitCell.y+.5))<1.52&&lineOfSight(gameSession.player.x,gameSession.player.y,gameSession.exitCell.x+.5,gameSession.exitCell.y+.5,{allowTargetTile:true})){win();return}
 let target=gameSession.player.collected===gameSession.GOAL?{x:gameSession.exitCell.x+.5,y:gameSession.exitCell.y+.5}:gameSession.fuses.filter(f=>!f.taken).sort((a,b)=>Math.hypot(gameSession.player.x-a.x,gameSession.player.y-a.y)-Math.hypot(gameSession.player.x-b.x,gameSession.player.y-b.y))[0];
 if(target){let dx=target.x-gameSession.player.x,dy=target.y-gameSession.player.y;let angle=Math.atan2(dy,dx)-gameSession.player.a;while(angle>PI)angle-=TAU;while(angle<-PI)angle+=TAU;UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;let meters=Math.hypot(dx,dy);UI.signal.innerHTML=`<strong>${gameSession.player.collected===gameSession.GOAL?'EXIT':'ELECTRIC SIGNAL'}</strong> · ${Math.round(meters)} m`}
 if(gameSession.mapOn&&Math.floor(gameSession.elapsed*5)!==Math.floor((gameSession.elapsed-dt)*5))drawMap();
}

function pickupFacility(){
  for(let f of gameSession.fuses){
    if(f.taken||Math.hypot(gameSession.player.x-f.x,gameSession.player.y-f.y)>.66||!lineOfSight(gameSession.player.x,gameSession.player.y,f.x,f.y))continue;
    f.taken=true;gameSession.player.collected++;UI.count.textContent=gameSession.player.collected;playPickup();gameSession.flashUntil=gameSession.elapsed+.22;
    showToast(gameSession.level===2?`▣ CARD ${gameSession.player.collected}/${gameSession.GOAL}`:gameSession.level===4?`FOOD ${gameSession.player.collected}/${gameSession.GOAL}`:gameSession.level===10?`DOWODY ${gameSession.player.collected}/${gameSession.GOAL}`:gameSession.level===5?`✧ FOUND ${gameSession.player.collected}/${gameSession.GOAL}`:`✦ CORE ${gameSession.player.collected}/${gameSession.GOAL}`,2.9);
    addNoise(f.x,f.y,gameSession.level===3?8:5,'zbieranie');
  }
  for(let item of gameSession.bonusItems){
    if(item.taken||Math.hypot(gameSession.player.x-item.x,gameSession.player.y-item.y)>.67||!lineOfSight(gameSession.player.x,gameSession.player.y,item.x,item.y))continue;
    item.taken=true;
    if(item.type==='coin'){gameSession.player.coins=(gameSession.player.coins||0)+1;updateCoinCounter();}
    else if(item.type==='key')gameSession.keysOwned.add(item.id);
    else if(item.type==='hardSlow'){gameSession.player.slowCharges=(gameSession.player.slowCharges||0)+item.quantity;ensureInventory().slow=gameSession.player.slowCharges;}
    else if(item.type==='hardFreeze'){gameSession.player.freezeCharges=(gameSession.player.freezeCharges||0)+item.quantity;ensureInventory().freeze=gameSession.player.freezeCharges;}
    else if(item.type==='stamina'){ensureInventory().energy.push({energySprite:item.energySprite||0,fakeMonster:!!item.fakeMonster});}
    else if(item.type==='shield')gameSession.player.shieldUntil=gameSession.elapsed+12;
    if(item.type==='coin')playCoinPickup();else playPickup();
    showToast('PICKED UP: '+item.name+(item.type==='shield'?' · 12 SEC':item.quantity>1?' +'+item.quantity:''),2.5);
    updateInventoryUI();
  }
}

function findInteractable(){
  if(gameSession.player.hidden)return{type:'unhide',title:'LEAVE HIDING PLACE'};
  const all=[];
  for(let d of gameSession.doors)if(!d.open&&!d.bossGate)all.push({type:'door',ref:d,x:d.x+.5,y:d.y+.5,title:d.title});
  for(const room of bossRushRooms())all.push({type:'safeDoor',ref:room,x:room.doorX+.5,y:room.doorY+.5,title:'SAFE ROOM DOOR'});
  for(let o of gameSession.interactables)if(o.type==='hide'||o.type==='stairs'||o.type==='slot'||!o.used)all.push({type:o.type,ref:o,x:o.x,y:o.y,title:o.title});
  all.sort((a,b)=>Math.hypot(gameSession.player.x-a.x,gameSession.player.y-a.y)-Math.hypot(gameSession.player.x-b.x,gameSession.player.y-b.y));
  return all.find(o=>Math.hypot(gameSession.player.x-o.x,gameSession.player.y-o.y)<(o.type==='door'?1.65:1.4)&&lineOfSight(gameSession.player.x,gameSession.player.y,o.x,o.y,{allowTargetTile:o.type==='door'||o.type==='safeDoor',allowTargetFurniture:o.type==='slot'}))||null;
}

function interact(){
  if(gameSession.state!=='playing')return;
  const safeTarget=findInteractable();
  if(safeTarget?.type==='safeDoor'){safeRoomInteraction(safeTarget.ref);return;}
  if(safeTarget?.type==='slot'){slotMachineSpin(safeTarget.ref);return;}
  if(gameSession.level===1)return;
  const target=findInteractable();if(!target){showToast('NOTHING TO INTERACT WITH',1.4);return}
  const o=target.ref;
  if(target.type==='repair'&&isHardMode()){finishHardEmergency();return}
  if(target.type==='unhide'){gameSession.player.hidden=false;showToast('YOU LEFT HIDING',1.6);return}
  if(target.type==='hide'){gameSession.player.hidden=true;gameSession.player.flash=false;showToast('HIDDEN · PRESS E TO LEAVE',2.5);return}
  if(target.type==='stairs'){
    // Stairwells only teleport after the power network connects the decks.
    if(!gameSession.terminals.some(t=>t.id==='reactor2'&&t.used)){showToast('STAIRS LOCKED · REACTOR II OFFLINE',2.8);return}
    if(gameSession.world[Math.floor(o.dest.y)]?.[Math.floor(o.dest.x)]!==0){showToast('UPPER FLOOR BLOCKED',2);return}
    gameSession.player.x=o.dest.x;gameSession.player.y=o.dest.y;gameSession.cameraFloor=gameSession.player.y>40?2:1;
    gameSession.flashUntil=gameSession.elapsed+.5;showToast('ACCESS TO SECTION '+(gameSession.cameraFloor===2?'B':'A'),2.5);playUnlock();return;
  }
  if(target.type==='door'){
    let why=requirementReason(o);
    if(why){sound(130,.17,'square',.09,-40);showToast('⛔ '+why.toUpperCase(),3);return}
    o.open=true;gameSession.world[o.y][o.x]=0;markWorldChanged();gameSession.stats.doors++;addNoise(o.x+.5,o.y+.5,11,'brama');
    playUnlock();showToast('✓ OPENED: '+o.title,2.8);updateObjectiveFacility();return;
  }
  if(target.type==='panel'){
    if(o.used)return;
    if(gameSession.level===3){
      const next=gameSession.terminals.filter(t=>t.used).length+1;
      if(o.order!==next){gameSession.alarmTimer=9;addNoise(o.x,o.y,14,'alarm');playScare();showToast(`⚠ WRONG ORDER! REACTOR ${next} MUST BE FIRST`,3.4);return}
    }
    o.used=true;gameSession.stats.panels++;addNoise(o.x,o.y,gameSession.level===3?15:10,'urzadzenie');
    playUnlock();showToast('✓ ACTIVATED: '+o.title,3.2);
    if(gameSession.level===3&&gameSession.stats.panels===gameSession.terminals.length)playWin();
    updateObjectiveFacility();return;
  }
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
  pickupFacility();updateCoinCounter();updateSeen();if(applyHazardsAndRegen(dt))return;
  gameSession.noiseEvents=gameSession.noiseEvents.filter(e=>e.expiry>gameSession.elapsed);
  gameSession.interactReady=findInteractable();
  $('interactHint').style.display=gameSession.interactReady?'block':'none';
  if(gameSession.interactReady)$('interactHint').textContent='[ E ] '+(gameSession.interactReady.type==='slot'?'PLAY FOR 1 COIN':gameSession.interactReady.type==='safeDoor'?'OPEN / CLOSE ROOM':gameSession.interactReady.type==='door'?'OPEN / CHECK GATE':gameSession.interactReady.type==='hide'?'HIDE':gameSession.interactReady.type==='unhide'?'WYJDZ':gameSession.interactReady.type==='stairs'?'TAKE STAIRS':gameSession.interactReady.type==='repair'?'REPAIR REACTOR / 45 SECONDS':'AKTYWUJ PANEL');
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
  if(complete&&Math.hypot(gameSession.player.x-(gameSession.exitCell.x+.5),gameSession.player.y-(gameSession.exitCell.y+.5))<1.65&&lineOfSight(gameSession.player.x,gameSession.player.y,gameSession.exitCell.x+.5,gameSession.exitCell.y+.5,{allowTargetTile:true})){win();return}
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
    sound(310,.8,'sawtooth',.12,-150);
  }
  if(gameSession.eventState.kind==='blackout')sound(68,1.1,'sawtooth',.15,-40);
  if(gameSession.eventState.kind==='pressure')for(let g of gameSession.guards){g.patrolTarget=null;g.pathTimer=0}
  showToast('⚠ WYDARZENIE: '+gameSession.eventState.label,4);
}

;
// SOURCE: js/graphics/textures.js

function createPigFood(){let cv=document.createElement('canvas');cv.width=140;cv.height=190;let g=cv.getContext('2d');g.fillStyle='#f7e56a';g.fillRect(26,24,88,132);g.fillStyle='#2b90d9';g.fillRect(30,48,80,88);g.fillStyle='#fff';g.fillRect(42,66,56,40);g.fillStyle='#5b3fd1';g.font='bold 18px sans-serif';g.fillText('PUFFI',43,93);g.fillStyle='#f2c32c';g.fillRect(40,118,60,18);return spriteFromSource(FOOD_PNG,cv)}
function createBloodArt(){let c=document.createElement('canvas');c.width=150;c.height=110;let g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);for(let i=0;i<7;i++){g.fillStyle=i?`rgba(108,0,0,${.18+.09*i})`:'rgba(150,18,10,.9)';g.beginPath();g.ellipse(76+(rnd()-.5)*18,58+(rnd()-.5)*14,44-i*4,26-i*2,rnd()*TAU,0,TAU);g.fill()}g.fillStyle='rgba(95,0,0,.75)';for(let i=0;i<6;i++){g.beginPath();g.arc(22+i*18,70+(rnd()-.5)*12,4+rnd()*7,0,TAU);g.fill()}return c}
function createHazardArt(){let c=document.createElement('canvas');c.width=150;c.height=110;let g=c.getContext('2d');const grad=g.createRadialGradient(74,55,10,75,56,58);grad.addColorStop(0,'rgba(193,255,59,.95)');grad.addColorStop(.45,'rgba(77,235,89,.9)');grad.addColorStop(.75,'rgba(33,161,91,.82)');grad.addColorStop(1,'rgba(18,83,54,.15)');g.fillStyle=grad;g.beginPath();g.ellipse(75,56,52,30,.1,0,TAU);g.fill();g.strokeStyle='rgba(220,255,160,.7)';g.lineWidth=3;g.beginPath();g.moveTo(55,55);g.lineTo(71,38);g.lineTo(66,53);g.lineTo(87,53);g.lineTo(78,74);g.lineTo(82,60);g.lineTo(62,60);g.closePath();g.stroke();return c}


function spriteFromSource(src,fallback){let img=new Image();img.src=src;img.fallback=fallback;return img}
function createTexture(){let canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;let g=canvas.getContext('2d');g.fillStyle='#c5b67c';g.fillRect(0,0,128,256);let lg=g.createLinearGradient(0,0,128,0);lg.addColorStop(0,'#756e45');lg.addColorStop(.04,'#a89b63');lg.addColorStop(.15,'#cfc08c');lg.addColorStop(.7,'#c3b57f');lg.addColorStop(.98,'#a79a65');lg.addColorStop(1,'#756e45');g.fillStyle=lg;g.fillRect(0,0,128,256);
  // Old floral wallpaper, vertical pinstripes and accumulated water damage.
  for(let x=4;x<128;x+=18){g.fillStyle='#f6ebad24';g.fillRect(x,0,3,224);g.fillStyle='#675d3440';g.fillRect(x+4,0,1,224);for(let y=12;y<205;y+=32){g.fillStyle='#726c3840';g.beginPath();g.ellipse(x+8,y,3,6,0,0,TAU);g.fill();g.fillStyle='#f1e1a034';g.fillRect(x+7,y-7,1,3)}}
  for(let i=0;i<1500;i++){let x=rnd()*128,y=rnd()*255;g.fillStyle=i%3===0?'#433a1e16':'#fff5c214';g.fillRect(x,y,1+rnd()*3,1+rnd()*3)}
  for(let i=0;i<28;i++){g.fillStyle='#5a543720';let x=rnd()*128,y=rnd()*212;g.beginPath();g.ellipse(x,y,3+rnd()*19,1+rnd()*10,Math.sin(i),0,TAU);g.fill()}
  g.fillStyle='#ddc48c';g.fillRect(0,0,128,9);g.fillStyle='#918055';g.fillRect(0,7,128,3);g.fillStyle='#6a603e';g.fillRect(0,220,128,36);g.fillStyle='#e4d099';g.fillRect(0,218,128,7);g.fillStyle='#8e7b50';g.fillRect(0,226,128,3);g.fillStyle='#3d3825';g.fillRect(0,253,128,3);return canvas}

function createDoor(open){let cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');g.fillStyle='#bfb17b';g.fillRect(0,0,128,256);g.fillStyle='#6b6140';g.fillRect(8,6,112,250);g.fillStyle='#282c24';g.fillRect(17,20,94,232);g.fillStyle=open?'#0a3a24':'#3b3226';g.fillRect(24,39,80,204);g.strokeStyle=open?'#96ef7f':'#d5b773';g.lineWidth=3;g.strokeRect(24,39,80,204);g.fillStyle='#171b15';g.fillRect(30,92,68,140);g.strokeStyle='#76785d';g.lineWidth=1;g.strokeRect(31,93,66,138);g.fillStyle=open?'#83fc96':'#ffb852';g.shadowBlur=15;g.shadowColor=open?'#3bff63':'#ffd154';g.fillRect(35,43,58,30);g.shadowBlur=0;g.fillStyle='#191e14';g.font='bold 18px monospace';g.textAlign='center';g.fillText(open?'EXIT':'LOCK',64,64);g.fillStyle='#cfc9ae';g.fillRect(86,154,5,10);g.fillStyle=open?'#b1ffaa':'#d45b40';g.beginPath();g.arc(64,16,4,0,TAU);g.fill();return cv}

function createFuse(){let cv=document.createElement('canvas');cv.width=128;cv.height=160;let g=cv.getContext('2d');g.shadowColor='#f9db5b';g.shadowBlur=22;g.fillStyle='#f3b735';g.beginPath();g.roundRect(40,24,48,108,12);g.fill();g.shadowBlur=0;let gr=g.createLinearGradient(40,0,88,0);gr.addColorStop(0,'#8f541c');gr.addColorStop(.28,'#fff2aa');gr.addColorStop(.65,'#e9ae34');gr.addColorStop(1,'#774718');g.fillStyle=gr;g.fillRect(43,40,42,76);g.fillStyle='#a3e7ca';g.fillRect(45,20,38,20);g.fillRect(45,115,38,20);g.fillStyle='#283d37';g.fillRect(48,24,32,5);g.fillRect(48,124,32,5);g.fillStyle='#fff9c9';g.beginPath();g.moveTo(68,44);g.lineTo(50,83);g.lineTo(64,83);g.lineTo(55,111);g.lineTo(80,70);g.lineTo(65,70);g.closePath();g.fill();g.strokeStyle='#fef4b8';g.lineWidth=2;g.beginPath();g.moveTo(23,73);g.lineTo(31,65);g.moveTo(94,70);g.lineTo(105,59);g.moveTo(24,102);g.lineTo(31,107);g.stroke();return spriteFromSource(BATTERY_PNG,cv)}

function makeBackgroundTextures(){floorTexture=new Uint8Array(64*64*3);ceilingTexture=new Uint8Array(64*64*3);for(let y=0;y<64;y++)for(let x=0;x<64;x++){let i=(y*64+x)*3,r=rnd()*18,stitch=((x+2*y)%11===0)?5:0;floorTexture[i]=100+r-stitch;floorTexture[i+1]=91+r*.75-stitch;floorTexture[i+2]=67+r*.47-stitch;let v=rnd()*15;ceilingTexture[i]=157+v;ceilingTexture[i+1]=150+v*.83;ceilingTexture[i+2]=112+v*.5}}

function createMetalTexture(){let cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');g.fillStyle='#344d5b';g.fillRect(0,0,128,256);let grad=g.createLinearGradient(0,0,128,0);grad.addColorStop(0,'#182e3b');grad.addColorStop(.16,'#53717d');grad.addColorStop(.52,'#344b58');grad.addColorStop(.9,'#426373');grad.addColorStop(1,'#152d3a');g.fillStyle=grad;g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=32){g.fillStyle='#112b39';g.fillRect(x,0,3,256);g.fillStyle='#75929a50';g.fillRect(x+4,0,1,256)}
 for(let y=0;y<256;y+=48){g.fillStyle='#132c36';g.fillRect(0,y,128,4);g.fillStyle='#78929c55';g.fillRect(0,y+5,128,2)}
 for(let i=0;i<380;i++){g.fillStyle=i%2?'#b1d5d312':'#000b171b';g.fillRect(rnd()*128,rnd()*256,rnd()*5+1,rnd()*9+1)}
 g.fillStyle='#ac693c';g.fillRect(0,202,128,3);g.fillStyle='#152a36';g.fillRect(0,247,128,9);return cv}

function createSecurityDoor(){let cv=createDoor(false),g=cv.getContext('2d');g.fillStyle='#163d49';g.fillRect(25,39,79,204);g.strokeStyle='#7bcbcd';g.lineWidth=3;g.strokeRect(25,39,79,204);g.fillStyle='#b9594c';g.fillRect(38,52,55,24);g.fillStyle='#fff1d5';g.font='bold 14px monospace';g.textAlign='center';g.fillText('SEALED',65,69);return cv}

function createTerminal(){let cv=document.createElement('canvas');cv.width=128;cv.height=170;let g=cv.getContext('2d');g.fillStyle='#172b37';g.fillRect(30,42,68,110);g.fillStyle='#6f9ba4';g.fillRect(24,30,80,82);g.fillStyle='#061c29';g.fillRect(30,35,68,68);g.fillStyle='#65fff0';g.shadowBlur=14;g.shadowColor='#64ffef';g.fillRect(37,45,54,4);g.fillRect(37,57,32,3);g.fillRect(37,67,44,3);g.fillRect(37,79,38,3);g.shadowBlur=0;g.fillStyle='#e86f58';g.fillRect(57,123,15,10);g.fillStyle='#597783';g.fillRect(44,152,40,14);return cv}

function createKeycard(){let cv=document.createElement('canvas');cv.width=128;cv.height=160;let g=cv.getContext('2d');g.save();g.translate(64,80);g.rotate(-.18);g.fillStyle='#e8a956';g.shadowColor='#ffb977';g.shadowBlur=22;g.fillRect(-38,-22,76,48);g.shadowBlur=0;g.fillStyle='#0d3243';g.fillRect(-33,-17,66,38);g.fillStyle='#a7e5e4';g.fillRect(-26,-11,24,8);g.fillStyle='#e8a956';g.fillRect(-26,6,54,4);g.fillRect(-26,14,30,3);g.restore();return spriteFromSource(CARD_PNG,cv)}

function createLockerArt(){let c=document.createElement('canvas');c.width=110;c.height=210;let g=c.getContext('2d');g.fillStyle='#0c1a27';g.fillRect(15,8,82,198);g.fillStyle='#56717b';g.fillRect(20,12,70,186);g.fillStyle='#182d38';g.fillRect(26,19,58,170);g.fillStyle='#87abb4';g.fillRect(30,32,50,7);for(let y=53;y<83;y+=10)g.fillRect(36,y,38,3);g.fillStyle='#bacacf';g.fillRect(68,106,5,24);g.fillStyle='#19313d';g.fillRect(16,198,82,6);return c}

function createStairArt(){let c=document.createElement('canvas');c.width=120;c.height=190;let g=c.getContext('2d');g.fillStyle='#242633';g.fillRect(10,25,100,158);g.fillStyle='#ad7f66';for(let i=0;i<7;i++)g.fillRect(18+i*4,156-i*17,84-i*7,13);g.fillStyle='#eec78e';g.font='bold 17px monospace';g.fillText('STAIRS',24,38);return c}

function createPickupArt(color,label){let c=document.createElement('canvas');c.width=110;c.height=140;let g=c.getContext('2d');g.shadowBlur=24;g.shadowColor=color;g.fillStyle=color;g.fillRect(28,25,53,87);g.shadowBlur=0;g.strokeStyle='#fff2d6';g.lineWidth=3;g.strokeRect(32,28,45,80);g.fillStyle='#14242c';g.fillRect(40,49,28,24);g.fillStyle='#fff5da';g.font='bold 13px monospace';g.fillText(label,42,66);return c}

function createFinalWall(){
 const cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');
 let bg=g.createLinearGradient(0,0,128,256);bg.addColorStop(0,'#4d334b');bg.addColorStop(1,'#181b31');g.fillStyle=bg;g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=32){g.fillStyle='#131324';g.fillRect(x,0,5,256);g.fillStyle='#86677877';g.fillRect(x+6,0,2,256)}
 for(let y=0;y<256;y+=64){g.fillStyle='#10101f';g.fillRect(0,y,128,6);g.fillStyle='#935b66';g.fillRect(0,y+7,128,2)}
 for(let i=0;i<60;i++){g.fillStyle=i%2?'#b7746450':'#8057762e';g.fillRect(rnd()*128,rnd()*256,1+rnd()*4,4+rnd()*24)}
 g.fillStyle='#dc8550';g.fillRect(0,180,128,7);g.fillStyle='#ae434d';g.fillRect(0,187,128,4);
 g.strokeStyle='#db7d64';g.lineWidth=2;g.strokeRect(5,6,118,244);return cv
}

function createPigWall(){
 const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');
 g.fillStyle='#715349';g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=21){g.fillStyle=x%2?'#785c50':'#695044';g.fillRect(x,0,19,256);g.fillStyle='#271d1c';g.fillRect(x+19,0,2,256);}
 for(let y=8;y<250;y+=54){g.fillStyle='#302421';g.fillRect(0,y,128,3);g.fillStyle='#96715f';g.fillRect(0,y+4,128,1);}
 for(let i=0;i<50;i++){g.fillStyle='#16120d30';g.fillRect(rnd()*128,rnd()*256,2+rnd()*5,5+rnd()*16)}
 g.fillStyle='#ba7e5c';g.fillRect(0,236,128,8);return c;
}

function createCoopAvatarArt(){
 const c=document.createElement('canvas');c.width=130;c.height=185;const g=c.getContext('2d');
 g.fillStyle='#17373b';g.strokeStyle='#75e9d4';g.lineWidth=4;
 g.beginPath();g.ellipse(65,53,32,38,0,0,TAU);g.fill();g.stroke();
 g.fillStyle='#95fff0';g.fillRect(37,49,56,13);g.fillStyle='#223845';g.fillRect(40,51,50,9);
 g.fillStyle='#2e716f';g.beginPath();g.moveTo(29,94);g.lineTo(100,94);g.lineTo(117,175);g.lineTo(12,175);g.closePath();g.fill();g.stroke();
 g.fillStyle='#d3ffe2';g.fillRect(46,114,38,9);g.fillStyle='#63cdc2';g.fillRect(57,134,16,23);return c;
}

;
// SOURCE: js/graphics/art-assets.js
// Shared sprite artwork and wall-texture initialization, no Canvas2D scene renderer.
const coopAvatarArt=createCoopAvatarArt();
const lockerArt=createLockerArt(),stairArt=createStairArt(),extraPickupArt=createPickupArt('#eba976','K');
const finalWallTexture=createFinalWall();
const staminaArt=createPickupArt('#a5ea8e','S'),shieldArt=createPickupArt('#85c9ff','+'),pigWallTexture=createPigWall(),pigFoodArt=createPigFood(),bloodArt=spriteFromSource(BLOOD_DECAL_PNG,createBloodArt()),hazardArt=spriteFromSource('assets/decals/plasm_3.png',createHazardArt());

// Atlas slot 21 remains reserved so enemy and item layers never shift.
const hardRockArt=extraPickupArt;

;
// SOURCE: js/graphics/collectibles.js

const coinSprite = new Image();coinSprite.src=COIN_PNG;
function makeSlotMachineSprite(){
 const canvas=document.createElement('canvas');canvas.width=150;canvas.height=200;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#050505';ctx.fillRect(14,20,122,175);
 ctx.fillStyle='#6d2723';ctx.fillRect(20,24,108,163);
 ctx.fillStyle='#1b1111';ctx.fillRect(30,39,88,111);
 ctx.strokeStyle='#d7a34b';ctx.lineWidth=5;ctx.strokeRect(30,39,88,111);
 ctx.fillStyle='#dfc377';ctx.font='bold 39px serif';ctx.fillText('777',36,98);
 ctx.fillStyle='#ecb46c';ctx.fillRect(35,115,78,11);
 ctx.fillStyle='#dabe70';ctx.font='bold 15px monospace';ctx.fillText('1 GROSZ',32,166);
 ctx.fillStyle='#8c8b8b';ctx.fillRect(132,64,9,55);
 ctx.beginPath();ctx.arc(136,60,11,0,Math.PI*2);ctx.fillStyle='#ca2727';ctx.fill();
 ctx.fillStyle='#2e1712';ctx.fillRect(28,183,93,10);
 return canvas;
}
const slotMachineSprite=makeSlotMachineSprite();

;
// SOURCE: js/graphics/model-data.js
// ALPHA3_OPTIMIZED: manifest of binary CRM2 assets. Offline builder embeds these paths as data URLs.
const CATROOMS_MODEL_MESHES=Object.freeze({
 tree:'assets/models/tree-optimized.mesh',
 campfire:'assets/models/campfire-optimized.mesh',
 slot:'assets/models/slot-optimized.mesh',
 rock:'assets/models/rock-optimized.mesh',
 door:'assets/models/door-optimized.mesh',
});

;
// SOURCE: js/graphics/decor-data.js
// Generated by tools/import_decor.py. World units in tiles.
const DECOR_MODELS=Object.freeze({
 box:Object.freeze({stage:1,placement:'floor',radius:0.37144,height:0.52000,depth:0.33311,triangles:2260,mesh:'assets/models/decor/box.mesh'}),
 cabinet:Object.freeze({stage:1,placement:'floor',radius:0.28232,height:0.90000,depth:0.25084,triangles:676,mesh:'assets/models/decor/cabinet.mesh'}),
 desk:Object.freeze({stage:1,placement:'floor',radius:0.42526,height:0.64000,depth:0.39657,triangles:4912,mesh:'assets/models/decor/desk.mesh'}),
 yellowClock:Object.freeze({stage:1,placement:'wall',radius:0.14017,height:0.28000,depth:0.00693,triangles:252,mesh:'assets/models/decor/yellowClock.mesh'}),
 bench:Object.freeze({stage:2,placement:'floor',radius:0.44000,height:0.41092,depth:0.15469,triangles:788,mesh:'assets/models/decor/bench.mesh'}),
 lifebuoy:Object.freeze({stage:2,placement:'wall',radius:0.21500,height:0.43000,depth:0.03982,triangles:2600,mesh:'assets/models/decor/lifebuoy.mesh'}),
 pipe:Object.freeze({stage:2,placement:'floor',radius:0.22854,height:0.90000,depth:0.10717,triangles:12980,mesh:'assets/models/decor/pipe.mesh'}),
 pump:Object.freeze({stage:2,placement:'floor',radius:0.43000,height:0.55418,depth:0.20900,triangles:28899,mesh:'assets/models/decor/pump.mesh'}),
 barrel:Object.freeze({stage:3,placement:'floor',radius:0.22995,height:0.68000,depth:0.22995,triangles:1404,mesh:'assets/models/decor/barrel.mesh'}),
 metalTable:Object.freeze({stage:3,placement:'floor',radius:0.44000,height:0.37513,depth:0.39957,triangles:656,mesh:'assets/models/decor/metalTable.mesh'}),
 camera:Object.freeze({stage:4,placement:'wall',radius:0.11359,height:0.28000,depth:0.08500,triangles:9984,mesh:'assets/models/decor/camera.mesh'}),
 crt:Object.freeze({stage:4,placement:'floor',radius:0.37670,height:0.56000,depth:0.25200,triangles:140,mesh:'assets/models/decor/crt.mesh'}),
 mannequin:Object.freeze({stage:5,placement:'floor',radius:0.13196,height:0.91000,depth:0.07083,triangles:2842,mesh:'assets/models/decor/mannequin.mesh'}),
 lastClock:Object.freeze({stage:5,placement:'wall',radius:0.21336,height:0.36000,depth:0.08500,triangles:2754,mesh:'assets/models/decor/lastClock.mesh'}),
});
const DECOR_ALBEDO='assets/models/decor/albedo.webp';

;
// SOURCE: js/engine/assets.js
// Network builds load binary mesh files; the standalone build uses the same loader
// with embedded data URLs, without depending on network fetch or file:// XHR.
class AssetManager {
 static async binary(source){
  if(typeof source!=='string')throw new TypeError('Invalid asset URL');
  if(source.startsWith('data:application/octet-stream;base64,')){
   const text=atob(source.slice(source.indexOf(',')+1)),bytes=new Uint8Array(text.length);
   for(let i=0;i<text.length;i++)bytes[i]=text.charCodeAt(i);
   return bytes;
  }
  const response=await fetch(source);
  if(!response.ok)throw new Error('Asset load failed: '+source+' (HTTP '+response.status+')');
  return new Uint8Array(await response.arrayBuffer());
 }
 static parseMesh(bytes,kind){
  if(bytes.byteLength<12||bytes[0]!==67||bytes[1]!==82||bytes[2]!==77||bytes[3]!==50)throw new Error('Invalid model format: '+kind);
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const vertices=view.getUint32(4,true),indices=view.getUint32(8,true),offset=12,vLen=vertices*44,iLen=indices*4;
  if(!vertices||!indices||indices%3||offset+vLen+iLen!==bytes.byteLength)throw new Error('Damaged model '+kind);
  return {vertices,indices,vertexData:bytes.subarray(offset,offset+vLen),indexData:bytes.subarray(offset+vLen)};
 }
 static async mesh(kind){return this.parseMesh(await this.binary(CATROOMS_MODEL_MESHES[kind]??DECOR_MODELS[kind]?.mesh),kind);}
}

;
// SOURCE: js/graphics/materials.js
// CP04: separate albedo library, shared by classic and raster terrain paths.
const HD_WALL_PATHS=Object.freeze(['assets/materials/yellow-wall.png','assets/materials/flood-wall.png','assets/materials/industrial-wall.png','assets/materials/chrum-wall.png']);
const HD_FLOOR_PATHS=Object.freeze(['assets/materials/yellow-floor.png','assets/materials/yellow-ceiling.png','assets/materials/flood-floor.png','assets/materials/flood-ceiling.png','assets/materials/industrial-floor.png','assets/materials/industrial-ceiling.png','assets/materials/chrum-floor.png','assets/materials/chrum-ceiling.png']);
const HD_WALL_SIZE=Object.freeze([512,1024,12]);
const HD_FLOOR_SIZE=Object.freeze([512,512,8]);
function materialMipSizes(w,h){
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1)throw Error('Invalid material dimensions');
 const levels=[];while(true){levels.push([w,h]);if(w===1&&h===1)return levels;w=Math.max(1,Math.floor(w/2));h=Math.max(1,Math.floor(h/2));}
}
function materialCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function uploadMaterialMips(device,texture,source,w,h,layer,cover=false){
 let previous=source;
 for(const [mip,[mw,mh]] of materialMipSizes(w,h).entries()){
  const c=materialCanvas(mw,mh),g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  if(mip===0&&cover){g.fillStyle='#080506';g.fillRect(0,0,mw,mh);const sw=source.naturalWidth||source.width,sh=source.naturalHeight||source.height;const s=Math.max(mw/sw,mh/sh);g.drawImage(source,(mw-sw*s)/2,(mh-sh*s)/2,sw*s,sh*s);}
  else g.drawImage(previous,0,0,mw,mh);
  device.queue.copyExternalImageToTexture({source:c},{texture,mipLevel:mip,origin:[0,0,layer]},[mw,mh,1]);
  previous=c;
 }
}
async function loadHdAlbedo(path,w,h){const img=new Image();img.src=path;await img.decode();if(img.naturalWidth!==w||img.naturalHeight!==h)throw Error('Invalid HD material dimensions');return img;}
async function buildHdMaterials(renderer){
 const d=renderer.device;
 let wall,floor;
 d.pushErrorScope('out-of-memory');d.pushErrorScope('validation');
 let failure=null;
 try{
  const [walls,floors]=await Promise.all([Promise.all(HD_WALL_PATHS.map(p=>loadHdAlbedo(p,512,1024))),Promise.all(HD_FLOOR_PATHS.map(p=>loadHdAlbedo(p,512,512)))]);
  const create=(size,label)=>d.createTexture({label,size,mipLevelCount:materialMipSizes(size[0],size[1]).length,format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
  wall=create(HD_WALL_SIZE,'CP04 HD wall albedo');floor=create(HD_FLOOR_SIZE,'CP04 HD floor albedo');
  [...walls,doorOpenTexture,doorTexture,doorShutImg].forEach((source,i)=>uploadMaterialMips(d,wall,source,512,1024,i));
  for(let i=0;i<5;i++){
   const img=SAFE_ROOM_POSTER_IMAGES[i];let source=img;
   if(!img?.naturalWidth){source=materialCanvas(1,1);const g=source.getContext('2d');g.fillStyle='#7b5a4b';g.fillRect(0,0,1,1);}
   uploadMaterialMips(d,wall,source,512,1024,7+i,true);
  }
  floors.forEach((source,i)=>uploadMaterialMips(d,floor,source,512,512,i));
  await d.queue.onSubmittedWorkDone?.();
 }catch(e){failure=String(e.message||e);}
 const validation=await d.popErrorScope(),memory=await d.popErrorScope();
 failure=failure||validation?.message||memory?.message;
 if(failure){wall?.destroy();floor?.destroy();throw Error(failure);}
 return {wall,floor};
}

;
// SOURCE: js/graphics/camera.js
// Capture the render camera once, independently from simulation/collision state.
// Pitch is a true rotation in radians; horizontal FOV defines both axes.
function captureRenderCamera(position=gameSession.renderPosition(gameSession.player)){
 const angle=cameraViewAngle(),plane=cameraPlaneScale(),pitch=viewPitchOffset();
 return {x:position.x??2.5,y:position.y??2.5,angle,plane,pitch,
  cos:Math.cos(angle),sin:Math.sin(angle)};
}
// Some debug and test callers supply only a position; retain that API.
function resolveRenderCamera(camera){
 return camera.angle!==undefined&&camera.plane!==undefined&&camera.pitch!==undefined&&camera.cos!==undefined&&camera.sin!==undefined?camera:captureRenderCamera(camera);
}

// Camera-space right, up and forward; mirrors the shared WGSL transform.
function cameraCoordinates(camera,x,y,z){
 const dx=x-camera.x,dy=y-camera.y,forward=dx*camera.cos+dy*camera.sin;
 const c=Math.cos(camera.pitch),s=Math.sin(camera.pitch),height=z-.5;
 return {right:-dx*camera.sin+dy*camera.cos,up:height*c-forward*s,depth:forward*c+height*s};
}

// Visual-only spotlight state. Never changes player.flash or enemy detection.
function sampleFlashlight(previous,player,camera,elapsed,walkPhase){
 const target=player.flash&&!player.hidden?1:0;
 const reset=!previous||previous.player!==player||elapsed<previous.elapsed;
 const dt=reset?0:Math.max(0,Math.min(.1,elapsed-previous.elapsed));
 const ease=1-Math.exp(-dt*14);
 const intensity=reset?target:previous.intensity+(target-previous.intensity)*ease;
 const swayTarget=player.moving&&!player.hidden?1:0;
 const sway=reset?swayTarget:previous.sway+(swayTarget-previous.sway)*ease;
 return {player,elapsed,intensity,sway,yaw:camera.angle+Math.sin(walkPhase*.5)*.018*sway,pitch:camera.pitch+Math.cos(walkPhase)*.012*sway};
}

;
// SOURCE: js/graphics/shaders/shared.js
// Shared frame ABI and depth conventions for the hybrid WebGPU renderer.
// Keep forward distance (world units) separate from projected GPU depth [0,1].
const RENDER_FRAME=Object.freeze({floats:32,bytes:128,player:0,viewport:4,progress:8,visuals:12,weather:16,camera:20,lighting:24,flashlight:28});
const RENDER_DEPTH=Object.freeze({near:.04,far:140,wallScale:256,spriteNear:.16,spriteFar:125});
const FRAME_WGSL=/* wgsl */ `
struct SceneFrame {
 player:vec4f,
 viewport:vec4f,
 progress:vec4f,
 visuals:vec4f,
 weather:vec4f,
 camera:vec4f,
 lighting:vec4f,
 flashlight:vec4f, // yaw, pitch, intensity, new beam enabled
};
`;
const DEPTH_WGSL=/* wgsl */ `
const VIEW_NEAR:f32=${RENDER_DEPTH.near};
const VIEW_FAR:f32=${RENDER_DEPTH.far}.0;
const WALL_DEPTH_SCALE:f32=${RENDER_DEPTH.wallScale}.0;
`;

// All passes use the same right-handed camera basis, horizontal FOV and depth.
const PROJECTION_WGSL=/* wgsl */ `
fn cameraCoords(point:vec3f,f:SceneFrame)->vec3f {
 let dir=vec2f(cos(f.player.z),sin(f.player.z));
 let delta=point.xy-f.player.xy;
 let forward=dot(delta,dir);
 let h=point.z-.5;
 let c=cos(f.weather.w);let s=sin(f.weather.w);
 return vec3f(dot(delta,vec2f(-dir.y,dir.x)),h*c-forward*s,forward*c+h*s);
}
fn cameraClip(p:vec3f,f:SceneFrame)->vec4f {
 let scale=1./max(.05,f.camera.x);
 return vec4f(p.x*scale,p.y*scale*f.viewport.x/f.viewport.y,
 VIEW_FAR/(VIEW_FAR-VIEW_NEAR)*p.z-VIEW_NEAR*VIEW_FAR/(VIEW_FAR-VIEW_NEAR),p.z);
}
fn worldRay(uv:vec2f,f:SceneFrame)->vec3f {
 let dir=vec2f(cos(f.player.z),sin(f.player.z));
 let q=vec2f((uv.x*2.-1.)*f.camera.x,(1.-uv.y*2.)*f.camera.x*f.viewport.y/f.viewport.x);
 let c=cos(f.weather.w);let s=sin(f.weather.w);
 return vec3f(dir*(c-q.y*s)+vec2f(-dir.y,dir.x)*q.x,s+q.y*c);
}
fn planeDepth(ray:vec3f)->f32 {return min(VIEW_FAR,.5/max(abs(ray.z),.000001));}
`;
// First lighting experiment: a bounded local fixture grid and optional campfire.
// CP06: bounded grid visibility for full-height walls. Roughness remains scalar.
const LIGHTING_WGSL=/* wgsl */ `
fn shadowSolid(cell:vec2i,size:i32)->bool {
 if(any(cell<vec2i(0))||any(cell>=vec2i(size))){return true;}
 let tile=worldTiles[u32(cell.y)*128u+u32(cell.x)];
 // The upper bits flag a closed mesh door hidden from terrain rendering.
 return tile!=0u&&tile!=5u;
}
// Trace only the finite segment toward the light, not the entire map.
// A small forward bias avoids re-hitting the shaded wall itself, including
// the half-float depth reconstruction in the experimental raster pass.
fn wallLightVisible(p:vec2f,source:vec2f,size:i32)->bool {
 let segment=source-p;let span=length(segment);
 let targetCell=vec2i(floor(source));
 if(shadowSolid(targetCell,size)){return false;}
 if(span<.0001){return true;}
 let start=p+segment*min(.5,.06/span);
 let ray=source-start;
 var cell=vec2i(floor(start));
 if(shadowSolid(cell,size)){return false;}
 let gridStep=vec2i(select(1,-1,ray.x<0.),select(1,-1,ray.y<0.));
 let delta=vec2f(1.)/max(abs(ray),vec2f(.000001));
 let boundary=vec2f(cell)+vec2f(select(1.,0.,ray.x<0.),select(1.,0.,ray.y<0.));
 var nextCross=abs(boundary-start)*delta;
 // A parallel axis has no crossing, even when starting exactly on a grid line.
 nextCross=select(nextCross,vec2f(1e20),abs(ray)<vec2f(.000001));
 for(var i:i32=0;i<24;i++){
  if(all(cell==targetCell)){return true;}
  // Endpoint can be on a grid edge/corner (e.g. a centered campfire).
  // Never advance past the source or demand reaching floor(source) from
  // every direction; at t=1 the open segment is already fully traversed.
  if(min(nextCross.x,nextCross.y)>=1.-.000001){return true;}
  if(abs(nextCross.x-nextCross.y)<.00001){
   if(shadowSolid(cell+vec2i(gridStep.x,0),size)||shadowSolid(cell+vec2i(0,gridStep.y),size)){return false;}
   cell+=gridStep;nextCross+=delta;
  }else if(nextCross.x<nextCross.y){cell.x+=gridStep.x;nextCross.x+=delta.x;}
  else{cell.y+=gridStep.y;nextCross.y+=delta.y;}
  if(shadowSolid(cell,size)){return false;}
 }
 return false;
}
fn pointContribution(p:vec3f,n:vec3f,eye:vec3f,rough:f32,source:vec3f,tint:vec3f,power:f32,f:SceneFrame)->vec3f {
 let delta=source-p;let d2=max(dot(delta,delta),.025);
 let l=delta*inverseSqrt(d2);
 let diffuse=max(0.,dot(n,l));
 let hv=l+eye;let halfway=hv*inverseSqrt(max(dot(hv,hv),.00001));
 let spec=pow(max(0.,dot(n,halfway)),mix(64.,8.,rough))*(1.-rough)*.20;
 var visibility=1.;
 if(f.lighting.x>1.5){
  // Limit each ray to nine cells and skip unlit faces before any grid loads.
  if(diffuse+spec<.0001||d2>=81.){return vec3f(0.);}
  if(!wallLightVisible(p.xy,source.xy,i32(f.viewport.z))){return vec3f(0.);}
  visibility=1.-smoothstep(49.,81.,d2);
 }
 return tint*(diffuse+spec)*power*visibility/(1.+d2*1.35);
}
fn sceneLight(p:vec3f,n:vec3f,rough:f32,f:SceneFrame)->vec3f {
 let eyeDelta=vec3f(f.player.xy,.5)-p;
 let eye=eyeDelta*inverseSqrt(max(dot(eyeDelta,eyeDelta),.00001));
 var tint=vec3f(1.,.91,.70);
 var sector=f.viewport.w;
 if(sector==12.){sector=f32(clamp(i32(floor((p.x-4.)/23.))+1,1,5));}
 if(sector==2.){tint=vec3f(.57,.85,1.);}
 else if(sector==3.){tint=vec3f(1.,.40,.27);}
 else if(sector==4.){tint=vec3f(1.,.76,.48);}
 else if(sector==5.||sector==6.){tint=vec3f(.86,.51,1.);}
 let grid=floor((p.xy-vec2f(2.5,1.45))/vec2f(5.,4.));
 var light=vec3f(.33,.33,.35);
 for(var y:i32=0;y<2;y++){for(var x:i32=0;x<2;x++){
  let cell=grid+vec2f(f32(x),f32(y));
  let pos=cell*vec2f(5.,4.)+vec2f(2.5,1.45);
  let phase=dot(cell,vec2f(12.37,8.91));
  let flicker=.91+.09*sin(f.player.w*9.+phase)-.22*step(.985,sin(f.player.w*2.3+phase));
  let power=select(2.1,.12,f.weather.x>.5)*flicker;
  light+=pointContribution(p,n,eye,rough,vec3f(pos,.97),tint,power,f);
 }}
 if(f.lighting.w>.5){
  let flicker=1.1+.22*sin(f.player.w*13.)+.16*sin(f.player.w*23.);
  light+=pointContribution(p,n,eye,rough,vec3f(f.lighting.yz,.30),vec3f(1.,.48,.15),flicker*2.8,f);
 }
 return light;
}
// Camera-mounted spotlight, separate from F10's environmental lighting.
fn flashlightLight(p:vec3f,n:vec3f,f:SceneFrame)->vec3f {
 if(f.flashlight.w<.5||f.flashlight.z<.001){return vec3f(0.);}
 let source=vec3f(f.player.xy,.5);
 let delta=p-source;
 let d2=dot(delta,delta);
 if(d2<.0001||d2>=121.){return vec3f(0.);}
 let l=delta*inverseSqrt(d2);
 let direction=vec3f(cos(f.flashlight.x)*cos(f.flashlight.y),sin(f.flashlight.x)*cos(f.flashlight.y),sin(f.flashlight.y));
 let beam=smoothstep(.9063,.9781,dot(l,direction)); // 25° outer, 12° inner
 let diffuse=max(0.,dot(n,-l));
 if(beam*diffuse<.0001){return vec3f(0.);}
 if(!wallLightVisible(p.xy,source.xy,i32(f.viewport.z))){return vec3f(0.);}
 let rangeFade=1.-smoothstep(64.,121.,d2);
 return vec3f(1.,.94,.79)*f.flashlight.z*beam*diffuse*rangeFade*2.8/(1.+d2*.11);
}
fn surfaceLighting(p:vec3f,n:vec3f,rough:f32,classic:vec3f,f:SceneFrame)->vec3f {
 var ambient=classic;
 if(f.lighting.x>.5){ambient=sceneLight(p,n,rough,f);}
 if(f.flashlight.w>.5){
  ambient*=select(.76,.20,f.weather.x>.5);
  ambient+=flashlightLight(p,n,f);
 }
 return ambient;
}
`;

;
// SOURCE: js/graphics/shaders/terrain.js
// WebGPU shader source: terrain
const TERRAIN_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
${LIGHTING_WGSL}
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var<storage,read> worldTiles:array<u32>;
@group(0) @binding(2) var wallTex:texture_2d_array<f32>;
@group(0) @binding(3) var wallSampler:sampler;
@group(0) @binding(4) var floorTex:texture_2d_array<f32>;
@group(0) @binding(5) var floorSampler:sampler;
@group(0) @binding(6) var<storage,read> decalCells:array<u32>;
@group(0) @binding(7) var<storage,read> decalData:array<vec4f>;
@group(0) @binding(8) var decalTex:texture_2d_array<f32>;
@group(0) @binding(9) var decalSampler:sampler;
struct RoomBox{ lower:vec4f,upper:vec4f };
@group(0) @binding(10) var<storage,read> roomObjects:array<RoomBox>;

struct PixelOut {
 @location(0) color:vec4f,
 @location(1) distance:vec4f,
};
@vertex fn vert(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 let p=array<vec2f,6>(vec2f(-1.,-1.),vec2f(1.,-1.),vec2f(-1.,1.),
                      vec2f(-1.,1.),vec2f(1.,-1.),vec2f(1.,1.));
 return vec4f(p[i],0.,1.);
}
fn tileAt(x:i32,y:i32)->u32 {
 if(x<0 || y<0 || x>=i32(frame.viewport.z) || y>=i32(frame.viewport.z)){return 1u;}
 let tile=worldTiles[u32(y)*128u+u32(x)] & 255u;return select(tile,0u,tile==5u);
}
fn sectorLevel(worldX:f32)->f32 {
 if(frame.viewport.w==12.){
   return f32(clamp(i32(floor((worldX-4.)/23.))+1,1,5));
 }
 return frame.viewport.w;
}
fn levelWall(level:f32)->i32 {
 if(level==2.){return 1;}
 if(level==3. || level==5. || level==6.){return 2;}
 if(level==4.){return 3;}
 return 0;
}
fn floorLayers(level:f32)->i32 {
 if(level==2.){return 2;}
 if(level==3. || level==5. || level==6.){return 4;}
 if(level==4.){return 6;}
 return 0;
}
fn sceneryAt(pixel:vec2f,ray:vec3f)->vec4f {
 let isFloor=ray.z<0.;
 let rd=planeDepth(ray);
 return scenerySurface(ray,isFloor,rd);
}
fn scenerySurface(ray:vec3f,isFloor:bool,rd:f32)->vec4f {
 let worldPt=frame.player.xy+ray.xy*rd;
 let sector=sectorLevel(worldPt.x);
 let layer=floorLayers(sector)+select(1,0,isFloor);
 let uv=fract(worldPt);
 // Conservative screen footprint, using the unwrapped floor coordinates.
 let floorFootprint=rd*2.*frame.camera.x/frame.viewport.x*(1.+length(ray.xy)/max(.015,abs(ray.z)));
 let floorLod=clamp(log2(max(1.,floorFootprint*f32(textureDimensions(floorTex,0).x))),0.,f32(textureNumLevels(floorTex)-1u));
 var color=textureSampleLevel(floorTex,floorSampler,uv,layer,floorLod).rgb;
 var c=color;
 if(sector==2.){
   if(isFloor){ c=vec3f(0.075+c.r*.20,0.15+c.g*.45,0.19+c.b*.50); }
   else {c=vec3f(.17+c.r*.36,.26+c.g*.44,.30+c.b*.46);}
 } else if(sector==3. || sector==5. || sector==6.){
   if(isFloor){c=vec3f(.15+c.r*.43,.083+c.g*.27,.12+c.b*.35);}
   else{c=vec3f(.19+c.r*.42,.10+c.g*.23,.18+c.b*.35);}
 } else if(sector==4.) {
   if(isFloor){c=vec3f(.22+c.r*.48,.13+c.g*.27,.12+c.b*.20);}
   else{c=vec3f(.3+c.r*.45,.23+c.g*.33,.17+c.b*.21);}
 }
 if(frame.lighting.x>.5||frame.flashlight.w>.5){
   let n=vec3f(0.,0.,select(-1.,1.,isFloor));
   let rough=select(.86,.32,sector==2.&&isFloor);
   c*=surfaceLighting(vec3f(worldPt,select(1.,0.,isFloor)),n,rough,vec3f(1.),frame);
 }
 // Keep the familiar tiled floors, grout seams and rectangular fluorescent lights.
 let seams=uv.x<.017 || uv.y<.017;
 if(seams){c*=.80;}
 if(!isFloor){
   let cell=vec2i(floor(worldPt));
   if((cell.x+100)%5==2 && (cell.y+100)%4==1 && uv.x>.19 && uv.x<.82 && uv.y>.22 && uv.y<.68){
     c=mix(c,vec3f(1.,.95,.73),select(.75,.05,frame.flashlight.w>.5&&frame.weather.x>.5));
   }
 } else {
   let cell=vec2i(floor(worldPt));
   if(cell.x>=0 && cell.y>=0 && cell.x<i32(frame.viewport.z) && cell.y<i32(frame.viewport.z)) {
     let id=decalCells[u32(cell.y)*128u+u32(cell.x)];
     if(id>0u && id<=256u){
       let d=decalData[id-1u];
       let radius=max(.1,d.z*.67);
       let local=(worldPt-d.xy)/(radius*2.)+.5;
       if(all(local>=vec2f(0.)) && all(local<=vec2f(1.))){
         if(d.w>1.5){
           let shadow=1.-smoothstep(.14,.50,length(local-.5));
           c*=1.-.38*shadow;
         }else{
           let decal=textureSampleLevel(decalTex,decalSampler,local,i32(d.w),0.);
           let fade=smoothstep(.0,.12,local.x)*smoothstep(.0,.12,local.y)*
             smoothstep(.0,.12,1.-local.x)*smoothstep(.0,.12,1.-local.y);
           let alpha=decal.a*fade*select(.80,.92,d.w>.5);
           if(d.w>.5){c=mix(c,decal.rgb*.90,clamp(alpha,0.,1.));}
           else{c=mix(c,c*decal.rgb*1.15,clamp(alpha,0.,1.));}
         }
       }
     }
   }
 }
 let fog=clamp((rd-2.)/29.,0.,.90);
 return vec4f(mix(c,vec3f(.10,.105,.09),fog),1.);
}
@fragment fn fragment(@builtin(position) pixel:vec4f)->PixelOut {
 let uv=pixel.xy/frame.viewport.xy;
 let ray3=worldRay(uv,frame);
 let ray=ray3.xy;
 let surfaceDepth=planeDepth(ray3);
 var cell=vec2i(floor(frame.player.xy));
 let delta=vec2f(1.)/max(abs(ray),vec2f(.00001));
 let gridStep=vec2i(select(1,-1,ray.x<0.),select(1,-1,ray.y<0.));
 var tMax=vec2f(0.);
 if(ray.x<0.){tMax.x=(frame.player.x-f32(cell.x))*delta.x;}
 else{tMax.x=(f32(cell.x)+1.-frame.player.x)*delta.x;}
 if(ray.y<0.){tMax.y=(frame.player.y-f32(cell.y))*delta.y;}
 else{tMax.y=(f32(cell.y)+1.-frame.player.y)*delta.y;}
 var side=0;
 var hit=1u;
 for(var i:i32=0;i<190;i++){
   if(tMax.x<tMax.y){tMax.x+=delta.x;cell.x+=gridStep.x;side=0;}
   else{tMax.y+=delta.y;cell.y+=gridStep.y;side=1;}
   hit=tileAt(cell.x,cell.y);
   if(hit!=0u){break;}
   if(min(tMax.x,tMax.y)>surfaceDepth){break;}
 }
 var distance=max(VIEW_NEAR,select(tMax.y-delta.y,tMax.x-delta.x,side==0));
 let hasWall=hit!=0u && distance<=surfaceDepth;
 let wallPoint=vec3f(frame.player.xy,.5)+ray3*distance;
 let wallV=clamp(1.-wallPoint.z,0.,1.);
 let wallH=frame.viewport.x/(2.*frame.camera.x*distance);
 var result=vec4f(0.);
 if(hasWall){
   var texX=select(frame.player.x+distance*ray.x,frame.player.y+distance*ray.y,side==0);
   texX=fract(texX);
   if((side==0 && ray.x>0.) || (side==1 && ray.y<0.)){texX=1.-texX;}
   var layer=levelWall(sectorLevel(f32(cell.x)));
   if(hit==8u){
     // Safe-room walls: damp dark brick, rust streaks, tiled grout.
     let uvWall=vec2f(texX,wallV);
     let row=floor(uvWall.y*6.);
     let brick=fract(uvWall.x*4.+select(0.,.5,u32(row)%2u==1u));
     let mortar=step(brick,.035)+step(fract(uvWall.y*6.),.055);
     let fleck=fract(sin(dot(vec2f(f32(cell.x),f32(cell.y))+uvWall*17.,vec2f(31.17,77.9)))*12345.);
     var c=vec3f(.18,.19,.16)*(1.+fleck*.22);
     c*=1.-min(1.,mortar)*.35;
     c*=1.-pow(max(0.,sin(uvWall.x*47.+f32(cell.y)*.7)),18.)*uvWall.y*.32;
     result=vec4f(c,1.);
   }else{
     if(hit==3u){layer=select(5,4,frame.progress.x>=frame.progress.y && frame.progress.z>=frame.progress.w);}
     else if(hit==4u){layer=6;}
     let wallSize=vec2f(textureDimensions(wallTex,0));
     let wallFootprint=max(wallSize.y/wallH,wallSize.x*distance*2.*frame.camera.x/(frame.viewport.x*max(.12,abs(select(ray.y,ray.x,side==0)))));
     let wallLod=clamp(log2(max(1.,wallFootprint)),0.,f32(textureNumLevels(wallTex)-1u));
     result=textureSampleLevel(wallTex,wallSampler,vec2f(texX,wallV),layer,wallLod);
   }
   if(frame.camera.y>.5){
     let wallUV=vec2f(texX,wallV);
     let scratches=pow(abs(sin(texX*130.+f32(cell.y)*4.7)),19.)*.075;
     let grime=sin(wallUV.y*29.+f32(cell.x)*.6)*sin(texX*61.+f32(cell.y)*2.3)*.13;
     let drip=pow(max(0.,sin(texX*79.+f32(cell.x)*3.)),35.)*wallUV.y*.25;
     let c=result.rgb*vec3f(.73,.69,.64)*(1.-scratches+grime-drip);
     result=vec4f(c,1.);
   }
   if(frame.lighting.x>.5||frame.flashlight.w>.5){
     let normal=select(vec3f(0.,-sign(ray.y),0.),vec3f(-sign(ray.x),0.,0.),side==0);
     let rough=select(.84,.40,layer==1||layer==2||hit==3u||hit==4u);
     result=vec4f(result.rgb*surfaceLighting(wallPoint,normal,rough,vec3f(1.),frame),1.);
   }
   let fog=clamp((distance-1.5)/32.,0.,.88);
   result=vec4f(mix(result.rgb,vec3f(.10,.10,.09),fog),1.);
   if(side==1){result=vec4f(result.rgb*.83,1.);}
 }else{
   result=sceneryAt(pixel.xy,ray3);
   distance=surfaceDepth;
 }
 // Static 3D boxes are ray-traced against the actual wall distance. These
 // objects stay put when the camera turns, unlike screen-facing billboards.
 let origin3=vec3f(frame.player.xy,.5);
 var best=distance;
 var furnitureHit=false;
 var furnitureColor=vec3f(0.);
 let inv=vec3f(1.)/select(ray3,vec3f(.000001),abs(ray3)<vec3f(.000001));
 for(var k:u32=0u;k<min(u32(frame.camera.w),64u);k=k+1u){
   let object=roomObjects[k];
   let t0=(object.lower.xyz-origin3)*inv;
   let t1=(object.upper.xyz-origin3)*inv;
   let tNear=max(max(min(t0.x,t1.x),min(t0.y,t1.y)),min(t0.z,t1.z));
   let tFar=min(min(max(t0.x,t1.x),max(t0.y,t1.y)),max(t0.z,t1.z));
   if(tNear>.02&&tNear<tFar&&tNear<best){
     let local=(origin3+ray3*tNear-object.lower.xyz)/max(object.upper.xyz-object.lower.xyz,vec3f(.0001));
     let face=max(abs(ray3.x),abs(ray3.y));
     let typ=i32(object.lower.w);
     var col=vec3f(.30,.23,.18);
     if(typ==1){ // solid metal slot-machine cabinet
       col=vec3f(.24,.067,.055);
       if(local.z>.82){col=vec3f(.63,.44,.20);}
       if(fract(local.z*11.)<.10){col*=1.45;}
     }else if(typ==2){ // front panel and 777 reels
       col=vec3f(.12,.09,.07);
       if(local.z>.18&&local.z<.87){
         let section=fract(local.x*3.);
         col=select(vec3f(.75,.63,.34),vec3f(.16,.10,.08),section<.10||section>.91);
         if(abs(fract(local.z*4.)-.49)<.12){col=vec3f(.13,.07,.06);}
       }
     }else if(typ==3||typ==4){ // chair seat, backrest and legs
       col=vec3f(.24,.13,.07)*(1.+fract(sin(local.x*37.+local.y*14.)*72.)*.18);
     }else if(typ==5){ // fire-ring of dark rocks
       col=vec3f(.18,.18,.16)*(1.+fract(sin(local.x*32.+local.y*31.)*44.)*.16);
       if(local.x>.20&&local.x<.80&&local.y>.20&&local.y<.80){col=vec3f(.54,.17,.07);}
     }else if(typ==6){ // volumetric flame block with flicker
       let flicker=.65+.35*sin(frame.player.w*17.+local.x*15.);
       col=mix(vec3f(.63,.09,.02),vec3f(1.,.77,.18),local.z)*flicker;
       if(local.z>.70){col*=.60;}
     }else if(typ>=7&&typ<=11){ // photo posters on the wall
       let uv=vec2f(clamp(local.x,0.,1.),1.-clamp(local.z,0.,1.));
       let tex=textureSampleLevel(wallTex,wallSampler,uv,typ,0.);
       col=mix(vec3f(.08,.06,.05),tex.rgb,smoothstep(0.0,0.05,min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y))));
     }
     let sideShade=select(.79,1.,local.z<.04||local.z>.96);
     furnitureColor=col*sideShade;
     if((frame.lighting.x>.5||frame.flashlight.w>.5)&&typ!=6){
       let faceDist=min(local,1.-local);
       var n=vec3f(0.,0.,select(-1.,1.,local.z>.5));
       if(faceDist.x<=faceDist.y&&faceDist.x<=faceDist.z){n=vec3f(select(-1.,1.,local.x>.5),0.,0.);}
       else if(faceDist.y<=faceDist.z){n=vec3f(0.,select(-1.,1.,local.y>.5),0.);}
       furnitureColor*=surfaceLighting(origin3+ray3*tNear,n,.68,vec3f(1.),frame);
     }
     best=tNear;
     furnitureHit=true;
   }
 }
 if(furnitureHit){
   let haze=clamp((best-1.5)/32.,0.,.88);
   result=vec4f(mix(furnitureColor,vec3f(.10,.10,.09),haze),1.);
   distance=best;
 }
 let center=uv-vec2f(.5,.52);
 let vignette=clamp(length(center*vec2f(1.15,1.02))*.96,0.,1.);
 var shade=1.-vignette*.47;
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){shade*=.67;}
 if(frame.flashlight.w<.5&&frame.weather.x>.5){shade*=.26;}
 let flicker=1.+.018*sin(frame.player.w*19.)-.012*sin(frame.player.w*7.3);
 var color=result.rgb*shade*flicker;
 if(frame.progress.w<0.){let dip=select(1.,.68,sin(frame.player.w*2.7)>.94 && sin(frame.player.w*25.)>.15);color*=dip;}
 if(frame.weather.y>.5){color=mix(color,vec3f(.27,.23,.28),.19);}
 if(frame.weather.z>.5){color=mix(color,vec3f(.24,.08,.07),.16);}
 if(frame.visuals.z<4.){color=mix(color,vec3f(.6,.08,.055),clamp((4.-frame.visuals.z)/4.*.18,0.,.18));}
 if(frame.camera.y>.5){color*=vec3f(.91,.85,.80);}
 if(frame.camera.z>.5){
   let peripheral=clamp(length((uv-vec2f(.5,.5))*vec2f(1.30,1.0))/.68,0.,1.);
   let pulse=.65+.35*sin(frame.player.w*7.8);
   color=mix(color,vec3f(.38,.025,.019),clamp(peripheral*.30*pulse,0.,.4));
 }
 if(frame.visuals.w>0.){color=mix(color,vec3f(1.,.89,.63),frame.visuals.w*.40);}
 // Subtle grain, dithered at the subpixel level, without the blocky CPU rays.
 let grain=fract(sin(dot(pixel.xy+vec2f(frame.player.w*97.,frame.player.w*33.),vec2f(12.9898,78.233)))*43758.5453);
 color+=vec3f((grain-.5)*.018);
 var out:PixelOut;
 out.color=vec4f(max(color,vec3f(0.)),1.);
 out.distance=vec4f(clamp(distance/WALL_DEPTH_SCALE,0.,1.),0.,0.,1.);
 return out;
}
`;

;
// SOURCE: js/graphics/shaders/sprites.js
// WebGPU shader source: sprites
const SPRITES_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(5) var<storage,read> worldTiles:array<u32>;
${LIGHTING_WGSL}
struct Sprite { rect:vec4f, data:vec4f };
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var wallDistance:texture_2d<f32>;
@group(0) @binding(2) var images:texture_2d_array<f32>;
@group(0) @binding(3) var imageSampler:sampler;
@group(0) @binding(4) var<storage,read> sprites:array<Sprite>;
struct VOut{
 @builtin(position) position:vec4f,
 @location(0) uv:vec2f,
 @location(1) @interpolate(flat) data:vec4f,
 @location(2) depth:f32,
};
@vertex fn vertex(@builtin(vertex_index) index:u32,@builtin(instance_index) instance:u32)->VOut {
 let v=array<vec2f,6>(vec2f(0.,0.),vec2f(1.,0.),vec2f(0.,1.),
                       vec2f(0.,1.),vec2f(1.,0.),vec2f(1.,1.));
 let unit=v[index];
 let item=sprites[instance];
 // Upright world billboard. rect.xy is the center in camera coordinates.
 let vertical=(.5-unit.y)*item.rect.w;
 let coords=vec3f(item.rect.x+(unit.x-.5)*item.rect.z,
 item.rect.y+vertical*cos(frame.weather.w),item.data.y+vertical*sin(frame.weather.w));
 var out:VOut;
 out.position=cameraClip(coords,frame);
 out.depth=coords.z;
 out.uv=unit;
 out.data=item.data;
 return out;
}
@fragment fn fragment(input:VOut)->@location(0) vec4f {
 let p=vec2i(floor(input.position.xy));
 if(any(p<vec2i(0)) || any(p>=vec2i(frame.viewport.xy))){discard;}
 let depth=textureLoad(wallDistance,p,0).r*WALL_DEPTH_SCALE;
 if(input.depth>=depth-.012){discard;}
 let c=textureSampleLevel(images,imageSampler,input.uv,i32(input.data.x),0.);
 if(c.a<.025){discard;}
 let fog=clamp((input.depth-8.)/36.,0.,.72);
 let alpha=c.a*(1.-fog*.48);
 var rgb=mix(c.rgb,vec3f(.10,.10,.09),fog);
 // Input z = variant index: 0 classic, 1 red, 2 green, 3 yellow, 4 gray, 5 pink.
 if(input.data.z>0.5 && input.data.z<1.5){rgb=mix(rgb,vec3f(.90,.09,.075),.56);}
 else if(input.data.z<2.5 && input.data.z>1.5){rgb=mix(rgb,vec3f(.12,.81,.18),.50);}
 else if(input.data.z<3.5 && input.data.z>2.5){rgb=mix(rgb,vec3f(.91,.79,.13),.49);}
 else if(input.data.z<4.5 && input.data.z>3.5){rgb=mix(rgb,vec3f(.50,.51,.54),.80);}
 else if(input.data.z<5.5 && input.data.z>4.5){rgb=mix(rgb,vec3f(.97,.31,.64),.58);}
 if(input.data.w>.5){rgb=mix(rgb,vec3f(.55,.86,1.),.78);rgb+=vec3f(.07,.11,.14)*sin(input.position.y*.16+frame.player.w*2.);}

 if(frame.lighting.x>.5||frame.flashlight.w>.5){
   let point=vec3f(frame.player.xy,.5)+worldRay(input.position.xy/frame.viewport.xy,frame)*input.depth;
   let normal=vec3f(-cos(frame.player.z),-sin(frame.player.z),0.);
   rgb*=surfaceLighting(point,normal,.85,vec3f(1.),frame);
 }
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){rgb*=.66;}
 if(frame.flashlight.w<.5&&frame.weather.x>.5){rgb*=.35;}
 return vec4f(rgb,alpha);
}
`;

;
// SOURCE: js/graphics/shaders/mesh.js
// WebGPU shader source: mesh
const MODEL_WGSL = /* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(5) var<storage,read> worldTiles:array<u32>;
${LIGHTING_WGSL}
struct ModelPose { world:vec4f, rotation:vec4f, tilt:vec4f };
fn tiltModel(v:vec3f)->vec3f {return vec3f(v.x,v.y*pose.tilt.x-v.z*pose.tilt.y,v.y*pose.tilt.y+v.z*pose.tilt.x);}
@group(0) @binding(0) var<uniform> frame:SceneFrame;
@group(0) @binding(1) var<uniform> pose:ModelPose;
@group(0) @binding(2) var slotAlbedo:texture_2d<f32>;
@group(0) @binding(3) var albedoSampler:sampler;
@group(0) @binding(4) var wallDistance:texture_2d<f32>;
struct MeshVertexOut {
 @builtin(position) position:vec4f,
 @location(0) normal:vec3f,
 @location(1) uv:vec2f,
 @location(2) tint:vec3f,
 @location(3) depth:f32,
 @location(4) @interpolate(flat) kind:u32,
 @location(5) @interpolate(flat) unlocked:f32,
 @location(6) localHeight:f32,
 @location(7) worldPoint:vec3f,
};
@vertex fn vertex(
 @location(0) inPos:vec3f,
 @location(1) inNormal:vec3f,
 @location(2) inUV:vec2f,
 @location(3) inColor:vec3f
)->MeshVertexOut {
 let local=tiltModel(inPos);
 let rotated=vec3f(local.x*pose.rotation.x-local.y*pose.rotation.y,
                   local.x*pose.rotation.y+local.y*pose.rotation.x,local.z);
 let point=pose.world.xyz+rotated*pose.world.w;
 let coords=cameraCoords(point,frame);
 let depth=coords.z;
 var result:MeshVertexOut;
 result.position=cameraClip(coords,frame);
 result.worldPoint=point;
 let n=tiltModel(inNormal);
 result.normal=normalize(vec3f(n.x*pose.rotation.x-n.y*pose.rotation.y,
    n.x*pose.rotation.y+n.y*pose.rotation.x,n.z));
 result.uv=vec2f(inUV.x,1.-inUV.y);
 result.tint=inColor;
 result.depth=depth;
 result.kind=u32(pose.rotation.z);
 result.unlocked=pose.rotation.w;
 result.localHeight=select(inPos.z,point.z,abs(pose.tilt.y)>.5);
 return result;
}
@fragment fn fragment(input:MeshVertexOut)->@location(0) vec4f {
 let pixel=vec2i(floor(input.position.xy));
 if(any(pixel<vec2i(0))||any(pixel>=vec2i(frame.viewport.xy))){discard;}
 let wall=textureLoad(wallDistance,pixel,0).r*WALL_DEPTH_SCALE;
 if(input.depth>wall-.025){discard;}
 var base=input.tint;
 if(input.kind==1u||input.kind==3u||input.kind==5u){
   base*=textureSampleLevel(slotAlbedo,albedoSampler,input.uv,0.).rgb;
 }
 if(input.kind==4u){base=mix(base,vec3f(.82,.74,.50),.45);} if(input.kind==4u&&input.unlocked>.5){base=mix(base,vec3f(.28,.72,.38),.72);}
 var light=clamp(.46+.47*dot(normalize(input.normal),normalize(vec3f(.40,-.15,.88))),.30,1.);
 if(input.kind==0u&&input.tint.r>.85){
    // Ember and flame parts keep their original low-poly mesh geometry.
    light=1.05+.14*sin(frame.player.w*13.+input.uv.x*10.);
 }
 // Environmental meshes use their original material atlas, with soft overhead
 // shading, restrained specular and a little occlusion toward their bases.
 if(input.kind==5u){
   let normal=normalize(input.normal);
   let key=normalize(vec3f(.38,-.25,.89));
   let diffuse=max(0.,dot(normal,key));
   let ground=0.78+0.22*smoothstep(0.,.28,input.localHeight);
   let sector=input.unlocked;
   var tint=vec3f(1.,.94,.78);
   if(sector==2.){tint=vec3f(.76,.93,1.);}
   else if(sector==3.){tint=vec3f(1.,.79,.73);}
   else if(sector==4.){tint=vec3f(.94,.83,.73);}
   else if(sector==5.){tint=vec3f(.91,.84,.88);}
   base*=mix(vec3f(1.),tint,.32);
   light=(.54+.40*diffuse+.06*max(0.,normal.z))*ground;
   let eye=normalize(vec3f(-cos(frame.player.z),-sin(frame.player.z),.18));
   let halfVec=normalize(key+eye);
   base+=vec3f(.06,.055,.045)*pow(max(0.,dot(normal,halfVec)),12.);
 }
 var rgb=base*light;
 if((frame.lighting.x>.5||frame.flashlight.w>.5)&&!(input.kind==0u&&input.tint.r>.85)){
   rgb=base*surfaceLighting(input.worldPoint,normalize(input.normal),.65,vec3f(light),frame);
 }
 let fog=clamp((input.depth-2.)/34.,0.,.78);
 rgb=mix(rgb,vec3f(.10,.10,.09),fog);
 if(frame.flashlight.w<.5&&frame.visuals.x<.5){rgb*=.68;}
 return vec4f(rgb,1.);
}
`;

;
// SOURCE: js/graphics/shaders/world-geometry.js
// Rasterize the nearest world surface: forward depth, cell, surface tag.
const WORLD_GEOMETRY_WGSL=/* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(0) var<uniform> frame:SceneFrame;
struct WallVertex {
 @builtin(position) position:vec4f,
 @location(0) depth:f32,
 @location(1) @interpolate(flat) cell:vec3f,
};
@vertex fn vertex(@location(0) point:vec3f,@location(1) cell:vec3f)->WallVertex {
 let coords=cameraCoords(point,frame);
 let depth=coords.z;
 var out:WallVertex;
 out.position=cameraClip(coords,frame);
 out.depth=depth;out.cell=cell;
 return out;
}
@fragment fn fragment(input:WallVertex)->@location(0) vec4f {
 return vec4f(max(VIEW_NEAR,input.depth),input.cell);
}
`;
// Reuse all the established surface materials and gameplay screen effects.
// The alternate fragment has no grid traversal loop; rasterized surfaces
// determine visibility. Evaluate exact horizontal plane depth for shading
// instead of reconstructing UVs from quantized half-float depth.
function geometryTerrainSource(){
 const start=TERRAIN_WGSL.indexOf(' var cell=vec2i(floor(frame.player.xy));');
 const end=TERRAIN_WGSL.indexOf(' let wallPoint=',start);
 if(start<0||end<0)throw Error('Terrain shader contract changed');
 const source='@group(0) @binding(11) var geometryHits:texture_2d<f32>;\n'+
 TERRAIN_WGSL.slice(0,start)+` let rasterHit=textureLoad(geometryHits,vec2i(pixel.xy),0);
 let hasSurface=rasterHit.x>0.;
 let hasWall=hasSurface && rasterHit.w<1.5 && rasterHit.x<=surfaceDepth+max(.002,surfaceDepth*.0005);
 let hasPlane=hasSurface && rasterHit.w>=1.5;
 let cell=vec2i(rasterHit.yz);
 let side=i32(rasterHit.w);
 let hit=tileAt(cell.x,cell.y);
 var distance=select(WALL_DEPTH_SCALE,rasterHit.x,hasWall);
`+TERRAIN_WGSL.slice(end);
 const oldResolve='result=sceneryAt(pixel.xy,ray3);\n   distance=surfaceDepth;';
 if(!source.includes(oldResolve))throw Error('Terrain surface resolve contract changed');
 return source.replace(oldResolve,`if(hasPlane){
     let isFloor=rasterHit.w<2.5;
     // Raster tag selects the actual visible quad; use exact depth for
     // stable material coordinates, lighting and sprite occlusion.
     distance=planeDepth(ray3);
     result=scenerySurface(ray3,isFloor,distance);
   }else{
     // Preserve the classic distant fog/near clip fallback when no triangle
     // covers the pixel (including views beyond VIEW_FAR).
     result=sceneryAt(pixel.xy,ray3);
     distance=surfaceDepth;
   }`);
}

;
// SOURCE: js/graphics/world-geometry.js
// Build only wall faces adjacent to walkable/render-empty cells. The exact
// uploaded render tiles are authoritative (including animated-door openings
// and tile 5, which is a collision-only decoration, not a visible wall).
function buildWorldWallVertices(tiles,size,stride=128){
 if(!Number.isInteger(size)||size<1||size>stride||tiles.length<size*stride)throw Error('Invalid wall grid');
 const data=[];
 const tile=(x,y)=>x<0||y<0||x>=size||y>=size?1:tiles[y*stride+x];
 const open=(x,y)=>{const t=tile(x,y);return t===0||t===5;};
 const face=(ax,ay,bx,by,cx,cy,side)=>{
  for(const [x,y,z] of [[ax,ay,0],[bx,by,0],[ax,ay,1],[ax,ay,1],[bx,by,0],[bx,by,1]])data.push(x,y,z,cx,cy,side);
 };
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(open(x,y)){
  if(!open(x-1,y))face(x,y,x,y+1,x-1,y,0);
  if(!open(x+1,y))face(x+1,y,x+1,y+1,x+1,y,0);
  if(!open(x,y-1))face(x,y,x+1,y,x,y-1,1);
  if(!open(x,y+1))face(x,y+1,x+1,y+1,x,y+1,1);
 }
 return new Float32Array(data);
}
// Surface tags: 0/1 wall axes, 2 floor, 3 ceiling. Each open cell
// owns both horizontal quads; collision-only decorations still have floors.
function buildWorldSurfaceMesh(tiles,size,stride=128){
 const walls=buildWorldWallVertices(tiles,size,stride);
 let cells=0;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(tiles[y*stride+x]===0||tiles[y*stride+x]===5)cells++;
 const vertices=new Float32Array(walls.length+cells*12*6);
 vertices.set(walls);let offset=walls.length;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const t=tiles[y*stride+x];if(t!==0&&t!==5)continue;
  for(let z=0;z<=1;z++){
   // Opposite winding for inward floor (+Z) and ceiling (-Z).
   const corners=z?[[0,0],[0,1],[1,0],[1,0],[0,1],[1,1]]:[[0,0],[1,0],[0,1],[0,1],[1,0],[1,1]];
   for(const [dx,dy] of corners){vertices.set([x+dx,y+dy,z,x,y,2+z],offset);offset+=6;}
  }
 }
 return {vertices,wallVertices:walls.length/6,planeVertices:cells*12};
}
class WorldGeometryExperiment {
 constructor(renderer){this.renderer=renderer;this.device=renderer.device;this.enabled=false;this.available=false;this.error=null;this.uploadRevision=-1;this.vertexCount=0;this.wallVertexCount=0;this.planeVertexCount=0;this.width=0;this.height=0;this.materialRevision=-1;}
 async initialize(){
  const r=this.renderer,d=this.device;
  d.pushErrorScope('validation');
  try{
   this.shader=d.createShaderModule({label:'CP10 world surface geometry',code:WORLD_GEOMETRY_WGSL});
   this.resolveShader=d.createShaderModule({label:'CP10 geometry surface resolve',code:geometryTerrainSource()});
   this.pipeline=d.createRenderPipeline({label:'CP10 raster surface hits',layout:'auto',vertex:{module:this.shader,entryPoint:'vertex',buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'}]}]},fragment:{module:this.shader,entryPoint:'fragment',targets:[{format:'rgba16float'}]},primitive:{topology:'triangle-list',cullMode:'none'},depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less'}});
   this.resolvePipeline=d.createRenderPipeline({label:'CP10 geometry terrain resolve',layout:'auto',vertex:{module:this.resolveShader,entryPoint:'vert'},fragment:{module:this.resolveShader,entryPoint:'fragment',targets:[{format:r.sceneFormat},{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
   this.frameBind=d.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r.frameBuffer}}]});
   const reports=await Promise.all([this.shader.getCompilationInfo(),this.resolveShader.getCompilationInfo()]);
   const errors=reports.flatMap(report=>report.messages.filter(m=>m.type==='error').map(m=>m.message));
   if(errors.length)throw Error(errors.join('; '));
  }catch(e){this.error=String(e.message||e);}
  const validation=await d.popErrorScope();if(validation)this.error=validation.message;
  this.available=!this.error;
 }
 toggle(){if(!this.available)return false;this.enabled=!this.enabled;this.renderer.needsRender=true;return this.enabled;}
 prepare(){
  const r=this.renderer,d=this.device;
  if(this.uploadRevision!==r.stats.mapUploads){
   const {vertices,wallVertices,planeVertices}=buildWorldSurfaceMesh(r.tilesData,r.mapSize);
   const newBuffer=d.createBuffer({label:'CP10 static world triangles',size:Math.max(24,vertices.byteLength),usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
   if(vertices.length)d.queue.writeBuffer(newBuffer,0,vertices);
   if(this.vertexBuffer)this.vertexBuffer.destroy();
   this.vertexBuffer=newBuffer;this.vertexCount=vertices.length/6;this.wallVertexCount=wallVertices;this.planeVertexCount=planeVertices;this.uploadRevision=r.stats.mapUploads;
  }
  if(this.width!==r.lastWidth||this.height!==r.lastHeight){
   if(this.hits)this.hits.destroy();
   this.hits=d.createTexture({label:'CP10 surface hit buffer',size:[r.lastWidth,r.lastHeight],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
   this.width=r.lastWidth;this.height=r.lastHeight;this.materialRevision=-1;
  }
  if(this.materialRevision!==r.materialRevision){
   this.resolveBind=d.createBindGroup({layout:this.resolvePipeline.getBindGroupLayout(0),entries:[...r.terrainBindings(),{binding:11,resource:this.hits.createView()}]});
   this.materialRevision=r.materialRevision;
  }
 }
 encode(encoder){
  this.prepare();
  const pass=encoder.beginRenderPass({label:'CP10 rasterized world geometry',colorAttachments:[{view:this.hits.createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:0}}],depthStencilAttachment:{view:this.renderer.meshDepthTexture.createView(),depthLoadOp:'clear',depthClearValue:1,depthStoreOp:'discard'}});
  pass.setPipeline(this.pipeline);pass.setBindGroup(0,this.frameBind);pass.setVertexBuffer(0,this.vertexBuffer);pass.draw(this.vertexCount);pass.end();
 }
}

;
// SOURCE: js/graphics/post-processing.js
// CP08: floating-point scene desired, temporal exposure and quarter-size bloom.
// Legacy scene shaders still use approximate display-space lighting; this is
// internal HDR, not an HDR monitor output or a fully linear PBR pipeline.
const POST_WGSL=`
struct Params { dt:f32, fxOn:f32, reset:f32, pad:f32 }
@group(0) @binding(0) var source:texture_2d<f32>;
@group(0) @binding(1) var auxiliary:texture_2d<f32>;
@group(0) @binding(2) var linearSampler:sampler;
@group(0) @binding(3) var<uniform> params:Params;
struct VertexOut { @builtin(position) position:vec4f, @location(0) uv:vec2f }
@vertex fn vertex(@builtin(vertex_index) i:u32)->VertexOut {
 var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));
 var out:VertexOut; out.position=vec4f(p[i],0.,1.);out.uv=p[i]*vec2f(.5,-.5)+vec2f(.5);return out;
}
fn luma(c:vec3f)->f32{return dot(max(c,vec3f(0.)),vec3f(.2126,.7152,.0722));}
@fragment fn exposure()->@location(0) vec4f {
 let size=vec2i(textureDimensions(source,0));
 var sum=0.;
 for(var y=0;y<8;y++){for(var x=0;x<8;x++){
   let uv=(vec2f(f32(x),f32(y))+vec2f(.5))/8.;
   let pixel=min(vec2i(uv*vec2f(size)),size-vec2i(1));
   sum+=log(max(.035,luma(textureLoad(source,pixel,0).rgb)));
 }}
 let desired=clamp(.30/exp(sum/64.),.80,1.42);
 let previous=select(textureLoad(auxiliary,vec2i(0),0).r,1.,params.reset>.5);
 let rate=select(.75,2.5,desired<previous);
 let value=mix(previous,desired,1.-exp(-rate*params.dt));
 return vec4f(value,0.,0.,1.);
}
@fragment fn extract(input:VertexOut)->@location(0) vec4f {
 let pixelStep=1./vec2f(textureDimensions(source,0));
 var c=vec3f(0.);
 for(var y=-1;y<=1;y++){for(var x=-1;x<=1;x++){
   let sampleColor=max(textureSampleLevel(source,linearSampler,input.uv+vec2f(f32(x),f32(y))*pixelStep*1.5,0.).rgb,vec3f(0.));
   let peak=max(max(sampleColor.r,sampleColor.g),sampleColor.b);
   c+=sampleColor*(smoothstep(.74,1.25,peak)*.8);
 }}
 return vec4f(c/9.,1.);
}
@fragment fn blur(input:VertexOut)->@location(0) vec4f {
 let pixelStep=1./vec2f(textureDimensions(source,0));
 var c=vec3f(0.);
 for(var y=-2;y<=2;y++){for(var x=-2;x<=2;x++){
   let w=f32(3-abs(x))*f32(3-abs(y));
   c+=textureSampleLevel(source,linearSampler,input.uv+vec2f(f32(x),f32(y))*pixelStep,0.).rgb*w;
 }}
 return vec4f(c/81.,1.);
}
@group(0) @binding(4) var bloomTexture:texture_2d<f32>;
fn shoulder(x:vec3f)->vec3f {
 let c=max(x,vec3f(0.));
 return min(c,vec3f(.68))+vec3f(.32)*(vec3f(1.)-exp(-max(c-vec3f(.68),vec3f(0.))/.32));
}
@fragment fn composite(input:VertexOut)->@location(0) vec4f {
 let c=textureSampleLevel(source,linearSampler,input.uv,0.).rgb;
 if(params.fxOn<.5){return vec4f(clamp(c,vec3f(0.),vec3f(1.)),1.);}
 let exposureValue=textureLoad(auxiliary,vec2i(0),0).r;
 let bloom=textureSampleLevel(bloomTexture,linearSampler,input.uv,0.).rgb;
 return vec4f(shoulder((c+bloom*.19)*exposureValue),1.);
}
`;
class CatroomsPostProcessing {
 constructor(device,format){
  this.device=device;this.enabled=true;this.reset=true;this.lastTime=null;this.index=0;this.passes=0;
  this.shader=device.createShaderModule({label:'CP08 post-processing',code:POST_WGSL});
  const pipeline=(entry,target)=>device.createRenderPipeline({label:'CP08 '+entry,layout:'auto',vertex:{module:this.shader,entryPoint:'vertex'},fragment:{module:this.shader,entryPoint:entry,targets:[{format:target}]},primitive:{topology:'triangle-list'}});
  this.exposurePipeline=pipeline('exposure','rgba16float');this.extractPipeline=pipeline('extract','rgba16float');this.blurPipeline=pipeline('blur','rgba16float');this.compositePipeline=pipeline('composite',format);
  this.params=device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
  this.sampler=device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
 }
 resize(w,h){
  const d=this.device;
  for(const tex of this.textures||[])tex.destroy();
  const texture=(label,width,height)=>d.createTexture({label:'CP08 '+label,size:[width,height],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
  this.scene=texture('HDR scene',w,h);this.bloomWidth=Math.max(1,Math.ceil(w/4));this.bloomHeight=Math.max(1,Math.ceil(h/4));
  this.bright=texture('bright',this.bloomWidth,this.bloomHeight);this.blurred=texture('blurred',this.bloomWidth,this.bloomHeight);
  this.history=[texture('exposure A',1,1),texture('exposure B',1,1)];
  this.textures=[this.scene,this.bright,this.blurred,...this.history];this.index=0;this.reset=true;this.lastTime=null;
  const tex=(binding,t)=>({binding,resource:t.createView()});const sampler={binding:2,resource:this.sampler};const params={binding:3,resource:{buffer:this.params}};
  const bind=(p,entries)=>d.createBindGroup({layout:p.getBindGroupLayout(0),entries});
  this.exposureBinds=this.history.map(t=>bind(this.exposurePipeline,[tex(0,this.scene),tex(1,t),params]));
  this.extractBind=bind(this.extractPipeline,[tex(0,this.scene),sampler]);this.blurBind=bind(this.blurPipeline,[tex(0,this.bright),sampler]);
  this.compositeBinds=this.history.map(t=>bind(this.compositePipeline,[tex(0,this.scene),tex(1,t),sampler,params,tex(4,this.blurred)]));
 }
 encode(encoder,output,active,time){
  active=!!active&&this.enabled;
  const dt=this.lastTime===null?1/60:Math.max(0,Math.min(.1,(time-this.lastTime)/1000));
  this.lastTime=active?time:null;
  this.device.queue.writeBuffer(this.params,0,new Float32Array([dt,+active,+this.reset,0]));
  const pass=(pipeline,bind,view)=>{const p=encoder.beginRenderPass({colorAttachments:[{view,loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});p.setPipeline(pipeline);p.setBindGroup(0,bind);p.draw(3);p.end();this.passes++;};
  this.passes=0;
  if(active){
   const next=1-this.index;
   pass(this.exposurePipeline,this.exposureBinds[this.index],this.history[next].createView());this.index=next;
   pass(this.extractPipeline,this.extractBind,this.bright.createView());pass(this.blurPipeline,this.blurBind,this.blurred.createView());this.reset=false;
  }else this.reset=true;
  pass(this.compositePipeline,this.compositeBinds[this.index],output);
 }
}

;
// SOURCE: js/graphics/webgpu.js
// THE CATROOMS / WebGPU scene renderer.
// This is a real GPU ray-caster: WGSL draws walls, floor, ceiling and ground decals.
// Characters and pickups use a GPU instanced billboard pass; imported GLBs use
// a separate textured triangular-mesh pass, with wall and mesh depth testing.




// Meshes are preprocessed from the supplied GLB files; no Babylon/Three required.
const MODEL_SLOT_ALBEDO_PNG='assets/models/slot-albedo.webp';
const MODEL_ROCK_ALBEDO='assets/models/rock-albedo.webp';


const GPU_SPRITE_SIZE=256;
const GPU_WALL_W=128;
const GPU_WALL_H=256;
const GPU_TILE_SIZE=64;
const GPU_MAX_DECALS=256;
const GPU_MAX_SPRITES=256;
// The order of the atlas is a single contract for upload and projection.
function spriteLayerSources(){return [catImg,pigImg,personBImg,personAImg,fuseImg,keycardImg,foodImg,terminalImg,lockerArt,stairArt,staminaArt,shieldArt,extraPickupArt,coopAvatarArt,slowDeviceImg,freezeDeviceImg,...energyDrinkImgs,hardRockArt,coinSprite,slotMachineSprite,strangerImg];}
const SPRITE_LAYER=Object.freeze({cat:0,pig:1,watcher:2,listener:3,terminal:7,hide:8,stairs:9,stamina:10,shield:11,key:12,coopAvatar:13,hardSlow:14,hardFreeze:15,rock:21,coin:22,slot:23,stranger:24});
const SPRITE_ENEMY_KINDS=new Set(['cat','pig','watcher','listener','stranger']);

class CatroomsWebGPURenderer {
  constructor(device,context,format,post=null){
    this.device=device;this.context=context;this.format=format;this.post=post;this.sceneFormat=post?'rgba16float':format;
    this.frameBuffer=device.createBuffer({size:RENDER_FRAME.bytes,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    this.mapBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalCellsBuffer=device.createBuffer({size:128*128*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.decalDataBuffer=device.createBuffer({size:GPU_MAX_DECALS*16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.spriteBuffer=device.createBuffer({size:GPU_MAX_SPRITES*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.furnitureBuffer=device.createBuffer({size:64*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
    this.wallTexture=device.createTexture({size:[GPU_WALL_W,GPU_WALL_H,12],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.floorTexture=device.createTexture({size:[GPU_TILE_SIZE,GPU_TILE_SIZE,8],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.decalTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,2],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.spriteTexture=device.createTexture({size:[GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,25],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.sampler=device.createSampler({magFilter:'linear',minFilter:'linear',mipmapFilter:'linear',addressModeU:'repeat',addressModeV:'repeat'});
    this.spriteSampler=device.createSampler({magFilter:'linear',minFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    this.terrainShader=device.createShaderModule({label:'Catrooms terrain WGSL',code:TERRAIN_WGSL});
    this.spriteShader=device.createShaderModule({label:'Catrooms sprite WGSL',code:SPRITES_WGSL});
    this.meshShader=device.createShaderModule({label:'Catrooms imported GLB mesh WGSL',code:MODEL_WGSL});
    this.terrainPipeline=device.createRenderPipeline({label:'Catrooms walls and floor',layout:'auto',vertex:{module:this.terrainShader,entryPoint:'vert'},fragment:{module:this.terrainShader,entryPoint:'fragment',targets:[{format:this.sceneFormat},{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
    this.spritePipeline=device.createRenderPipeline({label:'Catrooms transparent billboards',layout:'auto',vertex:{module:this.spriteShader,entryPoint:'vertex'},fragment:{module:this.spriteShader,entryPoint:'fragment',targets:[{format:this.sceneFormat,blend:{color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'},depthStencil:{format:'depth24plus',depthWriteEnabled:false,depthCompare:'less'}});
    this.meshPipeline=device.createRenderPipeline({label:'Catrooms static GLB geometry',layout:'auto',
      vertex:{module:this.meshShader,entryPoint:'vertex',buffers:[{arrayStride:44,stepMode:'vertex',attributes:[
        {shaderLocation:0,offset:0,format:'float32x3'},
        {shaderLocation:1,offset:12,format:'float32x3'},
        {shaderLocation:2,offset:24,format:'float32x2'},
        {shaderLocation:3,offset:32,format:'float32x3'}]}]},
      fragment:{module:this.meshShader,entryPoint:'fragment',targets:[{format:this.sceneFormat}]},
      primitive:{topology:'triangle-list',cullMode:'none'},
      depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less'}});
    this.modelMeshes={};
    this.rushPoseBuffers={slot:[],campfire:[],tree:[],rock:[],door:[],decor:[]};
    for(const kind of ['slot','campfire','tree','rock','door','decor'])for(let index=0;index<(kind==='rock'||kind==='decor'?64:kind==='door'?16:4);index++)this.rushPoseBuffers[kind].push(device.createBuffer({
      size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));
    this.hdMaterials=null;this.hdEnabled=false;this.hdError=null;this.materialRevision=0;
    this.lastWidth=0;this.lastHeight=0;this.needsRender=true;
    this.frameData=new Float32Array(RENDER_FRAME.floats);this.lightingEnabled=true;this.wallShadowsEnabled=true;this.flashlightEnabled=true;this.flashlightState=null;
    this.tilesData=new Uint32Array(128*128);this.gpuTilesData=new Uint32Array(128*128);this.mapSource=null;this.mapRevision=-1;this.mapSize=0;
    this.furnitureData=new Float32Array(64*8);this.furnitureSource=null;this.furnitureLength=-1;this.furnitureCount=0;
    this.decalGridData=new Uint32Array(128*128);this.decalData=new Float32Array(GPU_MAX_DECALS*4);this.decalScratch=new Float32Array(GPU_MAX_DECALS*4);this.decalCount=-1;this.decalWorld=null;
    this.spriteData=new Float32Array(GPU_MAX_SPRITES*8);
    this.spriteDiagnostics=[];this.stats={mapUploads:0,furnitureUploads:0,decalUploads:0,staticBytes:0,frames:0,triangles:0,sprites:0};
    this.poseCache=new Map();this.doorAnimations=new WeakMap();this.doorLayout=[];
  }
  uploadCanvasLayer(texture,source,width,height,layer){
    const off=document.createElement('canvas');off.width=width;off.height=height;
    const g=off.getContext('2d');g.clearRect(0,0,width,height);
    g.drawImage(source,0,0,width,height);
    this.device.queue.copyExternalImageToTexture({source:off},{texture,origin:[0,0,layer]},[width,height,1]);
  }
  async buildTextures(){
    const images=spriteLayerSources();
    // complete alone does not guarantee a decoded image. Never silently replace an enemy with a pickup.
    const required=new Map([[0,'Marmur'],[1,'Chrum'],[2,'Blysk'],[3,'Szept'],[24,'Nieznajomy']]);
    const resolved=await Promise.all(images.map(async (img,i)=>{
      if(!(img instanceof HTMLImageElement))return img;
      try{await img.decode();if(img.naturalWidth&&img.naturalHeight)return img;}catch(e){}
      if(required.has(i)){
        const retry=new Image();retry.src=img.src;
        try{await retry.decode();if(retry.naturalWidth&&retry.naturalHeight)return retry;}catch(e){}
        throw new Error('Enemy texture failed: '+required.get(i));
      }
      return img.fallback||extraPickupArt;
    }));
    this.spriteAspects=resolved.map(img=>(img.naturalWidth||img.width||1)/(img.naturalHeight||img.height||1));
    this.loadedSpriteLayers=resolved.map((img,i)=>({layer:i,width:img.naturalWidth||img.width,height:img.naturalHeight||img.height}));
    await Promise.all(SAFE_ROOM_POSTER_IMAGES.map(async img=>{if(!img.complete){try{await img.decode();}catch(e){/* draw fallback poster */}}}));
    const walls=[wallTexture,metalTexture,finalWallTexture,pigWallTexture,doorOpenTexture,doorTexture,doorShutImg];
    walls.forEach((tex,i)=>this.uploadCanvasLayer(this.wallTexture,tex,GPU_WALL_W,GPU_WALL_H,i));
    SAFE_ROOM_POSTER_IMAGES.forEach((img,index)=>{const off=document.createElement('canvas');off.width=GPU_WALL_W;off.height=GPU_WALL_H;const g=off.getContext('2d');g.fillStyle='#080506';g.fillRect(0,0,off.width,off.height);if(img&&img.complete&&img.naturalWidth){const ratio=Math.max(off.width/img.naturalWidth,off.height/img.naturalHeight);const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;g.drawImage(img,(off.width-w)/2,(off.height-h)/2,w,h)}else{g.fillStyle='#7b5a4b';g.fillRect(0,0,off.width,off.height)}this.device.queue.copyExternalImageToTexture({source:off},{texture:this.wallTexture,origin:[0,0,7+index]},[off.width,off.height,1]);});
    const tmp=document.createElement('canvas');tmp.width=GPU_TILE_SIZE;tmp.height=GPU_TILE_SIZE;const g=tmp.getContext('2d');
    for(let i=0;i<8;i++){
      let pixels=g.createImageData(GPU_TILE_SIZE,GPU_TILE_SIZE);
      const isCeiling=i%2===1;
      const a=isCeiling?ceilingTexture:floorTexture;
      for(let z=0;z<GPU_TILE_SIZE*GPU_TILE_SIZE;z++){
        const p=z*3,o=z*4;
        pixels.data[o]=a[p];pixels.data[o+1]=a[p+1];pixels.data[o+2]=a[p+2];pixels.data[o+3]=255;
      }
      g.putImageData(pixels,0,0);
      this.device.queue.copyExternalImageToTexture({source:tmp},{texture:this.floorTexture,origin:[0,0,i]},[GPU_TILE_SIZE,GPU_TILE_SIZE,1]);
    }
    if(bloodArt instanceof HTMLImageElement && !bloodArt.complete){try{await bloodArt.decode();}catch(e){}}
    this.uploadCanvasLayer(this.decalTexture,bloodArt.naturalWidth?bloodArt:(bloodArt.fallback||bloodArt),GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,0);
    if(hazardArt instanceof HTMLImageElement){try{await hazardArt.decode();}catch(e){}}
    this.uploadCanvasLayer(this.decalTexture,hazardArt.naturalWidth?hazardArt:(hazardArt.fallback||hazardArt),GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,1);
    resolved.forEach((source,i)=>this.uploadCanvasLayer(this.spriteTexture,source,GPU_SPRITE_SIZE,GPU_SPRITE_SIZE,i));
  }
  async buildModels(){
    for(const kind of ['campfire','slot','tree','rock','door',...Object.keys(DECOR_MODELS)]){
      const mesh=await AssetManager.mesh(kind);
      const vertexBuffer=this.device.createBuffer({size:mesh.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
      const indexBuffer=this.device.createBuffer({size:mesh.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});
      this.device.queue.writeBuffer(vertexBuffer,0,mesh.vertexData);
      this.device.queue.writeBuffer(indexBuffer,0,mesh.indexData);
      this.modelMeshes[kind]={vertexBuffer,indexBuffer,indexCount:mesh.indices};
    }
    const albedoImage=new Image();albedoImage.src=MODEL_SLOT_ALBEDO_PNG;
    await albedoImage.decode();
    this.modelAlbedoTexture=this.device.createTexture({size:[albedoImage.naturalWidth,albedoImage.naturalHeight],
      format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.device.queue.copyExternalImageToTexture({source:albedoImage},
      {texture:this.modelAlbedoTexture},[albedoImage.naturalWidth,albedoImage.naturalHeight,1]);
    const rockImage=new Image();rockImage.src=MODEL_ROCK_ALBEDO;await rockImage.decode();
    this.rockAlbedoTexture=this.device.createTexture({size:[rockImage.naturalWidth,rockImage.naturalHeight],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.device.queue.copyExternalImageToTexture({source:rockImage},{texture:this.rockAlbedoTexture},[rockImage.naturalWidth,rockImage.naturalHeight,1]);
    const decorImage=new Image();decorImage.src=DECOR_ALBEDO;await decorImage.decode();
    this.decorAlbedoTexture=this.device.createTexture({size:[decorImage.naturalWidth,decorImage.naturalHeight],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    this.device.queue.copyExternalImageToTexture({source:decorImage},{texture:this.decorAlbedoTexture},[decorImage.naturalWidth,decorImage.naturalHeight,1]);
  }
  toggleHdMaterials(){
    if(!this.hdMaterials)return false;
    this.hdEnabled=!this.hdEnabled;this.materialRevision++;this.needsRender=true;
    this.terrainBind=this.device.createBindGroup({layout:this.terrainPipeline.getBindGroupLayout(0),entries:this.terrainBindings()});
    return this.hdEnabled;
  }
  terrainBindings(){return [
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:{buffer:this.mapBuffer}},
      {binding:2,resource:(this.hdEnabled?this.hdMaterials.wall:this.wallTexture).createView({dimension:'2d-array'})},{binding:3,resource:this.sampler},
      {binding:4,resource:(this.hdEnabled?this.hdMaterials.floor:this.floorTexture).createView({dimension:'2d-array'})},{binding:5,resource:this.sampler},
      {binding:6,resource:{buffer:this.decalCellsBuffer}},{binding:7,resource:{buffer:this.decalDataBuffer}},
      {binding:8,resource:this.decalTexture.createView({dimension:'2d-array'})},{binding:9,resource:this.spriteSampler},
      {binding:10,resource:{buffer:this.furnitureBuffer}}
    ];}
  resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.35)*gameSettings.quality;
    // Apply a single uniform scale to both dimensions. Independent width/height
    // clamps warped the image when pitch changed, especially on mobile.
    const scale=Math.min(dpr*.90,1700/Math.max(1,innerWidth),1000/Math.max(1,innerHeight));
    W=Math.max(1,Math.round(innerWidth*scale));
    H=Math.max(1,Math.round(innerHeight*scale));
    if(W===this.lastWidth && H===this.lastHeight)return;
    this.lastWidth=W;this.lastHeight=H;this.needsRender=true;
    C.width=W;C.height=H;
    this.context.configure({device:this.device,format:this.format,alphaMode:'opaque'});
    this.post?.resize(W,H);
    if(this.distanceTexture)this.distanceTexture.destroy();
    this.distanceTexture=this.device.createTexture({size:[W,H],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
    if(this.meshDepthTexture)this.meshDepthTexture.destroy();
    this.meshDepthTexture=this.device.createTexture({size:[W,H],format:'depth24plus',usage:GPUTextureUsage.RENDER_ATTACHMENT});
    this.terrainBind=this.device.createBindGroup({layout:this.terrainPipeline.getBindGroupLayout(0),entries:this.terrainBindings()});
    this.spriteBind=this.device.createBindGroup({layout:this.spritePipeline.getBindGroupLayout(0),entries:[
      {binding:0,resource:{buffer:this.frameBuffer}},{binding:1,resource:this.distanceTexture.createView()},
      {binding:2,resource:this.spriteTexture.createView({dimension:'2d-array'})},{binding:3,resource:this.spriteSampler},
      {binding:4,resource:{buffer:this.spriteBuffer}},{binding:5,resource:{buffer:this.mapBuffer}}
    ]});
    this.rushMeshBinds={slot:[],campfire:[],tree:[],rock:[],door:[],decor:[]};
    for(const kind of ['slot','campfire','tree','rock','door','decor'])for(let index=0;index<this.rushPoseBuffers[kind].length;index++)this.rushMeshBinds[kind].push(this.device.createBindGroup({
      layout:this.meshPipeline.getBindGroupLayout(0),entries:[
        {binding:0,resource:{buffer:this.frameBuffer}},
        {binding:1,resource:{buffer:this.rushPoseBuffers[kind][index]}},
        {binding:2,resource:(kind==='decor'?this.decorAlbedoTexture:kind==='rock'?this.rockAlbedoTexture:this.modelAlbedoTexture).createView()},
        {binding:3,resource:this.spriteSampler},
        {binding:4,resource:this.distanceTexture.createView()},{binding:5,resource:{buffer:this.mapBuffer}}
      ]}));
  }
  collectSprites(camera=captureRenderCamera()){
    const sprites=[];
    for(const f of gameSession.fuses)if(!f.taken)sprites.push({kind:'fuse',x:f.x,y:f.y,phase:f.phase||0});
    if(gameSession.level===1&&gameSession.awake){const p=gameSession.renderPosition(gameSession.cat);sprites.push({kind:'cat',x:p.x,y:p.y,frozen:!!gameSession.cat.frozen});}
    for(const a of coop.avatarSprites())sprites.push({kind:'coopAvatar',x:a.x,y:a.y});
    for(const item of gameSession.bonusItems)if(!item.taken&&item.type==='coin')sprites.push({kind:'coin',x:item.x,y:item.y});
    // Slot machine is static 3D world geometry, never a camera-facing sprite.
    for(const guard of gameSession.guards){const p=gameSession.renderPosition(guard);sprites.push({kind:guard.kind,x:p.x,y:p.y,phase:guard.x,variant:guard.variant||'classic',frozen:!!guard.frozen,size:guard.sizeMultiplier||1});}
    if(gameSession.level>=2){
      for(const t of gameSession.terminals)sprites.push({kind:'terminal',x:t.x,y:t.y});
      for(const item of gameSession.interactables)if(item.type==='hide'||item.type==='stairs')sprites.push({kind:item.type,x:item.x,y:item.y});
      for(const item of gameSession.bonusItems)if(!item.taken&&item.type!=='coin')sprites.push({kind:item.type,x:item.x,y:item.y,phase:item.phase,energySprite:item.energySprite});
      if(isHardMode()&&gameSession.hardEmergency)sprites.push({kind:'terminal',x:gameSession.hardEmergency.x,y:gameSession.hardEmergency.y});
    }
    const fuseLayer=renderStage()===1?4:renderStage()===4?6:5;
    const scales={cat:1.19,pig:1.07,watcher:1.38,listener:1.38,fuse:renderStage()===4?.76:.58,terminal:.73,hide:.9,stairs:.78,stamina:.43,shield:.43,key:.42,coopAvatar:.94,hardSlow:.54,hardFreeze:.58,rock:.89,coin:.43,slot:.86,stranger:1.36};
    const sourceAspect=this.spriteAspects||(this.spriteAspects=spriteLayerSources().map(img=>(img.naturalWidth||img.width||1)/(img.naturalHeight||img.height||1)));
    camera=resolveRenderCamera(camera);
    const order=[];this.spriteDiagnostics=[];
    for(const s of sprites){
      const diag=SPRITE_ENEMY_KINDS.has(s.kind)?{kind:s.kind,x:s.x,y:s.y,reason:'pending'}:null;
      if(diag)this.spriteDiagnostics.push(diag);
      const layer=s.kind==='stamina'?16+Math.max(0,Math.min(4,s.energySprite||0)):s.kind==='fuse'?fuseLayer:SPRITE_LAYER[s.kind];
      if(layer==null){if(diag)diag.reason='unknown layer';continue;}
      if(diag)diag.layer=layer;
      const height=scales[s.kind]*(s.size||1),width=height*sourceAspect[layer];
      const bob=(s.kind==='fuse'?(.07+Math.sin(gameSession.elapsed*2.2+(s.phase||0))*.08):s.kind==='cat'?Math.sin(gameSession.elapsed*8)*.03:0);
      const vertical=(s.kind==='fuse'?bob:s.kind==='stamina'||s.kind==='shield'||s.kind==='key'||s.kind==='hardSlow'||s.kind==='hardFreeze'?.15:0);
      const center=cameraCoordinates(camera,s.x,s.y,vertical+height*.5),ty=center.depth;
      if(diag)diag.depth=ty;
      const radius=Math.hypot(width,height)*.5;
      if(!Number.isFinite(ty)||ty+radius<=RENDER_DEPTH.spriteNear||ty-radius>RENDER_DEPTH.spriteFar){if(diag)diag.reason='outside depth range';continue;}
      const hPlane=camera.plane,vPlane=hPlane*H/W;
      if(Math.abs(center.right)>ty*hPlane+radius*Math.hypot(1,hPlane)||Math.abs(center.up)>ty*vPlane+radius*Math.hypot(1,vPlane)){if(diag)diag.reason='offscreen';continue;}
      const left=center.right,top=center.up;
      if(diag)diag.reason='projected';
      order.push({kind:s.kind,diag,layer,ty,left,top,width,height,variant:({red:1,green:2,yellow:3,gray:4,pink:5})[s.variant]||0,frozen:s.frozen?1:0});
    }
    // Preserve enemies first when the atlas instance budget is exhausted, then nearest pickups.
    if(order.length>GPU_MAX_SPRITES){
      order.sort((a,b)=>Number(SPRITE_ENEMY_KINDS.has(b.kind))-Number(SPRITE_ENEMY_KINDS.has(a.kind))||a.ty-b.ty);
      for(let i=GPU_MAX_SPRITES;i<order.length;i++)if(order[i].diag)order[i].diag.reason='sprite budget';
      order.length=GPU_MAX_SPRITES;
    }
    order.sort((a,b)=>b.ty-a.ty); // alpha compositing remains back-to-front
    const data=this.spriteData||(this.spriteData=new Float32Array(GPU_MAX_SPRITES*8));
    for(let i=0;i<order.length;i++){
      const s=order[i],o=i*8;
      data[o]=s.left;data[o+1]=s.top;data[o+2]=s.width;data[o+3]=s.height;data[o+4]=s.layer;data[o+5]=s.ty;data[o+6]=s.variant;data[o+7]=s.frozen;
      if(s.diag)s.diag.reason='submitted (GPU occlusion not measured)';
    }
    return data.subarray(0,order.length*8);
  }
  syncStaticBuffers(scene=gameSession){
    const upload=(buffer,data)=>{this.device.queue.writeBuffer(buffer,0,data);this.stats.staticBytes+=data.byteLength;};
    if(this.mapSource!==scene.world||this.mapRevision!==scene.worldRevision||this.mapSize!==scene.N){
      this.tilesData.fill(0);
      for(let y=0;y<scene.N;y++)for(let x=0;x<scene.N;x++)this.tilesData[y*128+x]=scene.world[y][x];
      this.doorLayout=scene===gameSession?this.makeDoorLayout(scene):[];
      for(const d of this.doorLayout)this.tilesData[d.y*128+d.x]=0;
      // Low byte = visible terrain, bit 8 = opaque model door. Keep the CPU
      // geometry map unchanged; only the GPU visibility map carries the flag.
      this.gpuTilesData.set(this.tilesData);
      for(const d of this.doorLayout){
        const tile=scene.world[d.y][d.x];
        if(tile===3||tile===4)this.gpuTilesData[d.y*128+d.x]|=256;
      }
      upload(this.mapBuffer,this.gpuTilesData);this.stats.mapUploads++;this.mapSource=scene.world;this.mapRevision=scene.worldRevision;this.mapSize=scene.N;
    }
    const furniture=scene.safeRoomFurniture;
    if(this.furnitureSource!==furniture||this.furnitureLength!==furniture.length){
      this.furnitureData.fill(0);let i=0;
      for(const o of furniture){if(o.collisionOnly||i>=64)continue;
        this.furnitureData.set([o.x-o.w/2,o.y-o.d/2,o.z-o.h/2,o.material,o.x+o.w/2,o.y+o.d/2,o.z+o.h/2,0],i++*8);
      }
      this.furnitureCount=i;upload(this.furnitureBuffer,this.furnitureData);this.stats.furnitureUploads++;this.furnitureSource=furniture;this.furnitureLength=furniture.length;
    }
    // Trail arrays may be replaced each update even when the hazard content stays identical.
    let count=0;
    for(const p of scene.props){
      if((p.type!=='hazard'&&!(p.type==='decor'&&p.solid))||count>=GPU_MAX_DECALS)continue;
      const x=Math.floor(p.x),y=Math.floor(p.y);if(x<0||y<0||x>=scene.N||y>=scene.N)continue;
      this.decalScratch.set([p.x,p.y,p.type==='decor'?Math.min(.72,(p.radius??DECOR_MODELS[p.model].radius)*1.65+.12):p.size||.75,p.type==='decor'?2:1],count++*4);
    }
    let changed=this.decalWorld!==scene.world||this.decalCount!==count;
    for(let i=0;!changed&&i<count*4;i++)if(this.decalScratch[i]!==this.decalData[i])changed=true;
    if(changed){
      this.decalGridData.fill(0);this.decalData.fill(0);this.decalData.set(this.decalScratch.subarray(0,count*4));
      for(let i=0;i<count;i++){const x=Math.floor(this.decalData[i*4]),y=Math.floor(this.decalData[i*4+1]);this.decalGridData[y*128+x]=i+1;}
      upload(this.decalCellsBuffer,this.decalGridData);upload(this.decalDataBuffer,this.decalData);this.stats.decalUploads++;this.decalCount=count;this.decalWorld=scene.world;
    }
  }
  makeDoorLayout(scene){
    // The model replaces only Yellow Corridors doors. Other sectors retain their old textures.
    const yellow=scene.level!==12&&renderStage()===1;
    const doors=[];
    const rooms=scene.level===12?(scene.rushSafeRooms||[]).filter(r=>r.rushSector===1):yellow&&scene.safeRoom?[scene.safeRoom]:[];
    for(const room of rooms){
      const x=room.doorX,y=room.doorY;
      const dx=room.centerX-(x+.5),dy=room.centerY-(y+.5);
      // Local +Y points into the room; local +X is the hinge edge.
      const yaw=Math.abs(dx)>Math.abs(dy)?(dx>0?-Math.PI/2:Math.PI/2):(dy>0?0:Math.PI);
      doors.push({x,y,yaw,room});
    }
    if(yellow){
      const e=scene.exitCell;
      if(e&&scene.world[e.y]?.[e.x]===3){
        for(const [dx,dy,yaw] of [[0,-1,0],[0,1,Math.PI],[-1,0,-Math.PI/2],[1,0,Math.PI/2]]){
          if(scene.world[e.y+dy]?.[e.x+dx]===0)doors.push({x:e.x,y:e.y,yaw,exit:true,dx,dy});
        }
      }
    }
    return doors;
  }
  doorPoses(camera){
    const out=[];
    for(const d of this.doorLayout){
      const visible=this.modelInView(d.x+.5,d.y+.5,1.7,camera);
      const yaw=d.yaw,c=Math.cos(yaw),s=Math.sin(yaw);
      if(d.exit){
        if(!visible)continue;
        const ready=gameSession.player.collected>=gameSession.GOAL&&gameSession.terminals.every(t=>t.used);
        out.push([d.x+.5-d.dx*.33,d.y+.5-d.dy*.33,0,.92,c,s,4,ready?1:0]);continue;
      }
      const target=d.room.open?1:0,now=gameSession.elapsed;
      let a=this.doorAnimations.get(d.room);
      if(!a){a={target,start:target,time:now};this.doorAnimations.set(d.room,a);}
      const fraction=()=>a.start+(a.target-a.start)*Math.min(1,Math.max(0,(now-a.time)/.24));
      let f=fraction();if(a.target!==target){a.start=f;a.target=target;a.time=now;}
      if(!visible)continue;
      const angle=yaw-f*Math.PI/2,ca=Math.cos(angle),sa=Math.sin(angle);
      // Hold the hinge in place while the imported leaf rotates into the room.
      out.push([d.x+.5+.51*(c-ca),d.y+.5+.51*(s-sa),0,1,ca,sa,4,0]);
    }
    return out.slice(0,16);
  }
  modelInView(x,y,radius=1.2,camera=captureRenderCamera()){
    // Conservative horizontal bounding circle: no geometry is culled while it intersects the frustum.
    camera=resolveRenderCamera(camera);
    const dx=x-camera.x,dy=y-camera.y,{cos,sin,plane}=camera;
    const horizontal=dx*cos+dy*sin,side=Math.abs(-dx*sin+dy*cos);
    // Conservative vertical extent for tall meshes, including ceiling decor.
    const depth=horizontal*Math.cos(camera.pitch),bound=radius+Math.abs(Math.sin(camera.pitch))*2;
    return depth+bound>=RENDER_DEPTH.near&&side<=depth*plane+bound*Math.hypot(1,plane);
  }
  visibleRocks(camera=captureRenderCamera()){
    return gameSession.props.filter(p=>p.type==='rock'&&this.modelInView(p.x,p.y,1,camera)).slice(0,64);
  }
  visibleDecor(camera=captureRenderCamera()){
    // One shared texture/bind layout; distance/frustum culling and a bounded pool.
    // All nearby objects are retained before distant ones, regardless of type.
    return gameSession.props.filter(p=>p.type==='decor'&&Math.hypot(p.x-camera.x,p.y-camera.y)<28&&this.modelInView(p.x,p.y,(p.radius??DECOR_MODELS[p.model].radius)+.1,camera))
      .sort((a,b)=>Math.hypot(a.x-camera.x,a.y-camera.y)-Math.hypot(b.x-camera.x,b.y-camera.y)).slice(0,64);
  }
  writePose(kind,index,values){
    if(values.length===8)values=[...values,1,0,0,0];
    const key=kind+index,old=this.poseCache.get(key);
    if(old&&values.every((v,i)=>v===old[i]))return;
    this.device.queue.writeBuffer(this.rushPoseBuffers[kind][index],0,new Float32Array(values));
    this.poseCache.set(key,values);
  }
  renderMenu(time){
    if(!this.lastWidth)return;
    if(!this.menuScene){const N=49,world=Array.from({length:N},()=>Array(N).fill(1));
      for(let x=1;x<N-1;x++)for(let y=19;y<=23;y++)world[y][x]=0;
      for(let x=5;x<N-4;x+=8)for(let y=14;y<=28;y++)for(let xx=x;xx<x+3;xx++)world[y][xx]=0;
      this.menuScene={N,world,worldRevision:-1,props:[],safeRoomFurniture:[]};}
    this.needsRender=false;this.stats.frames++;this.stats.triangles=0;this.stats.sprites=0;this.syncStaticBuffers(this.menuScene);
    const t=time/1000, phase=(t*.55)%36;
    const frame=this.frameData;frame.set([4+phase,21.5+Math.sin(t*.55)*.18,Math.sin(t*.35)*.035,t],RENDER_FRAME.player);
    frame.set([W,H,this.menuScene.N,1],RENDER_FRAME.viewport);frame.set([0,0,0,-1],RENDER_FRAME.progress);frame.set([1,1,100,0],RENDER_FRAME.visuals);frame.set([0,0,0,0],RENDER_FRAME.weather);frame.set([Math.tan(75*Math.PI/360),0,0,0],RENDER_FRAME.camera);frame.set([0,0,0,0],RENDER_FRAME.lighting);frame.set([0,0,0,0],RENDER_FRAME.flashlight);this.flashlightState=null;
    this.device.queue.writeBuffer(this.frameBuffer,0,frame);
    const encoder=this.device.createCommandEncoder({label:'Menu corridor'});
    const output=this.context.getCurrentTexture().createView();
    const pass=encoder.beginRenderPass({colorAttachments:[{view:this.post?this.post.scene.createView():output,loadOp:'clear',storeOp:'store',clearValue:{r:.05,g:.04,b:.03,a:1}},{view:this.distanceTexture.createView(),loadOp:'clear',storeOp:'store',clearValue:{r:1,g:0,b:0,a:1}}]});
    pass.setPipeline(this.terrainPipeline);pass.setBindGroup(0,this.terrainBind);pass.draw(6);pass.end();this.post?.encode(encoder,output,false,time);this.device.queue.submit([encoder.finish()]);
  }
  render(){
    if(!this.lastWidth)return;
    this.needsRender=false;this.stats.frames++;this.stats.triangles=0;
    this.syncStaticBuffers();
    const frame=this.frameData,camera=captureRenderCamera();
    frame.set([camera.x,camera.y,camera.angle,gameSession.elapsed],RENDER_FRAME.player);
    frame.set([W,H,gameSession.N,gameSession.level===12?12:renderStage()],RENDER_FRAME.viewport);
    frame.set([gameSession.player.collected||0,gameSession.GOAL,gameSession.terminals.filter(t=>t.used).length,gameSession.terminals.length],RENDER_FRAME.progress);
    frame.set([gameSession.player.flash?1:0,(gameSession.player.hp??100)/100,gameSession.nearCat<0?100:gameSession.nearCat,Math.max(0,gameSession.flashUntil-gameSession.elapsed)],RENDER_FRAME.visuals);
    frame.set([gameSession.level===3&&gameSession.eventState?.kind==='blackout'?1:0,gameSession.level===3&&gameSession.eventState?.kind==='fog'?1:0,rageMode?1:0,camera.pitch],RENDER_FRAME.weather);
    frame.set([camera.plane,isHardMode()?1:0,isHardMode()&&gameSession.guards.some(g=>g.state==='chase'&&!g.frozen)?1:0,this.furnitureCount],RENDER_FRAME.camera);
    const lightRooms=gameSession.level===12?bossRushRooms():gameSession.safeRoom?[gameSession.safeRoom]:[];
    const fire=lightRooms.filter(r=>Number.isFinite(r.fireX)&&Number.isFinite(r.fireY)).sort((a,b)=>Math.hypot(camera.x-a.fireX,camera.y-a.fireY)-Math.hypot(camera.x-b.fireX,camera.y-b.fireY))[0];
    this.flashlightState=sampleFlashlight(this.flashlightState,gameSession.player,camera,gameSession.elapsed,gameSession.walkPhase||0);
    frame.set([this.flashlightState.yaw,this.flashlightState.pitch,this.flashlightState.intensity,this.flashlightEnabled?1:0],RENDER_FRAME.flashlight);
    frame.set([this.lightingEnabled?(this.wallShadowsEnabled?2:1):0,fire?.fireX||0,fire?.fireY||0,fire&&Math.hypot(camera.x-fire.fireX,camera.y-fire.fireY)<12?1:0],RENDER_FRAME.lighting);
    this.device.queue.writeBuffer(this.frameBuffer,0,frame);
    const sprites=this.collectSprites(camera);this.stats.sprites=sprites.length/8;
    if(sprites.length)this.device.queue.writeBuffer(this.spriteBuffer,0,sprites);
    const encoder=this.device.createCommandEncoder({label:'Catrooms WebGPU frame'});
    const output=this.context.getCurrentTexture().createView();
    const colorView=this.post?this.post.scene.createView():output;
    const depthView=this.distanceTexture.createView();
    const geometry=this.worldGeometry?.enabled?this.worldGeometry:null;
    if(geometry)geometry.encode(encoder);
    const terrain=encoder.beginRenderPass({colorAttachments:[
      {view:colorView,loadOp:'clear',storeOp:'store',clearValue:{r:.07,g:.07,b:.05,a:1}},
      {view:depthView,loadOp:'clear',storeOp:'store',clearValue:{r:1,g:0,b:0,a:1}}
    ]});
    terrain.setPipeline(geometry?geometry.resolvePipeline:this.terrainPipeline);terrain.setBindGroup(0,geometry?geometry.resolveBind:this.terrainBind);terrain.draw(6);terrain.end();
    this.stats.wallTriangles=geometry?geometry.wallVertexCount/3:0;
    this.stats.planeTriangles=geometry?geometry.planeVertexCount/3:0;
    // Actual indexed triangles imported from the supplied GLBs, fixed in world
    // coordinates. No billboard rotation, and fragments hide behind walls.
    const rooms=[];
    if(gameSession.level!==12&&gameSession.safeRoom&&Math.hypot(camera.x-gameSession.safeRoom.centerX,camera.y-gameSession.safeRoom.centerY)<23)rooms.push(gameSession.safeRoom);
    if(gameSession.level===12)rooms.push(...bossRushRooms().filter(r=>Math.hypot(camera.x-r.centerX,camera.y-r.centerY)<23).slice(0,3));
    const rocks=this.visibleRocks(camera);
    const doors=this.doorPoses(camera);
    const decor=this.visibleDecor(camera);
    const drawMeshes=!!((rooms.length||rocks.length||doors.length||decor.length)&&this.modelMeshes.slot&&this.modelMeshes.campfire&&this.modelMeshes.tree&&this.modelMeshes.rock&&this.modelMeshes.door);
    if(drawMeshes){
      for(let i=0;i<rooms.length;i++){
        const room=rooms[i];
        this.writePose('slot',i,[
          room.machineX,room.machineY,0,.78,Math.cos(room.machineYaw||0),Math.sin(room.machineYaw||0),1,0]);
        this.writePose('campfire',i,[
          room.fireX,room.fireY,0,.68,1,0,0,0]);
        if(Number.isFinite(room.treeX)&&Number.isFinite(room.treeY))this.writePose('tree',i,[
          room.treeX,room.treeY,0,.64,Math.cos(room.treeYaw||0),Math.sin(room.treeYaw||0),2,0]);
      }
      for(let i=0;i<rocks.length;i++){const r=rocks[i],angle=r.phase||0;this.writePose('rock',i,[r.x,r.y,0,r.size||1,Math.cos(angle),Math.sin(angle),3,0]);}
      for(let i=0;i<doors.length;i++)this.writePose('door',i,doors[i]);
      for(let i=0;i<decor.length;i++){const p=decor[i];this.writePose('decor',i,[p.x,p.y,p.z,p.size,Math.cos(p.yaw),Math.sin(p.yaw),5,p.stage,Math.cos(p.tilt||0),Math.sin(p.tilt||0),0,0]);}
      const meshPass=encoder.beginRenderPass({label:'Imported world meshes',
        colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}],
        depthStencilAttachment:{view:this.meshDepthTexture.createView(),depthLoadOp:'clear',depthClearValue:1,depthStoreOp:'store'}});
      meshPass.setPipeline(this.meshPipeline);
      for(let i=0;i<rooms.length;i++)for(const kind of ['slot','campfire','tree']){
        const room=rooms[i],x=kind==='slot'?room.machineX:kind==='tree'?room.treeX:room.fireX,y=kind==='slot'?room.machineY:kind==='tree'?room.treeY:room.fireY;
        if(kind==='tree'&&(!Number.isFinite(x)||!Number.isFinite(y)))continue;
        if(!this.modelInView(x,y,1.2,camera))continue;
        const mesh=this.modelMeshes[kind];
        meshPass.setBindGroup(0,this.rushMeshBinds[kind][i]);
        meshPass.setVertexBuffer(0,mesh.vertexBuffer);
        meshPass.setIndexBuffer(mesh.indexBuffer,'uint32');
        meshPass.drawIndexed(mesh.indexCount);this.stats.triangles+=mesh.indexCount/3;
      }
      const rockMesh=this.modelMeshes.rock;
      if(rocks.length){meshPass.setVertexBuffer(0,rockMesh.vertexBuffer);meshPass.setIndexBuffer(rockMesh.indexBuffer,'uint32');
        for(let i=0;i<rocks.length;i++){meshPass.setBindGroup(0,this.rushMeshBinds.rock[i]);meshPass.drawIndexed(rockMesh.indexCount);this.stats.triangles+=rockMesh.indexCount/3;}}
      if(doors.length){const m=this.modelMeshes.door;meshPass.setVertexBuffer(0,m.vertexBuffer);meshPass.setIndexBuffer(m.indexBuffer,'uint32');
        for(let i=0;i<doors.length;i++){meshPass.setBindGroup(0,this.rushMeshBinds.door[i]);meshPass.drawIndexed(m.indexCount);this.stats.triangles+=m.indexCount/3;}}
      // Group by mesh without changing per-instance pose indices.
      let meshKind=null;
      for(const {p,i} of decor.map((p,i)=>({p,i})).sort((a,b)=>a.p.model.localeCompare(b.p.model))){
        const m=this.modelMeshes[p.model];
        if(meshKind!==p.model){meshPass.setVertexBuffer(0,m.vertexBuffer);meshPass.setIndexBuffer(m.indexBuffer,'uint32');meshKind=p.model;}
        meshPass.setBindGroup(0,this.rushMeshBinds.decor[i]);meshPass.drawIndexed(m.indexCount);this.stats.triangles+=m.indexCount/3;
      }
      meshPass.end();
    }
    if(sprites.length){
      const pass=encoder.beginRenderPass({colorAttachments:[{view:colorView,loadOp:'load',storeOp:'store'}],
        depthStencilAttachment:{view:this.meshDepthTexture.createView(),depthLoadOp:drawMeshes?'load':'clear',depthClearValue:1,depthStoreOp:'discard'}});
      pass.setPipeline(this.spritePipeline);pass.setBindGroup(0,this.spriteBind);pass.draw(6,sprites.length/8);pass.end();
    }
    this.post?.encode(encoder,output,true,performance.now());
    this.device.queue.submit([encoder.finish()]);
  }
}

let gpuRenderer=null;
window.CatroomsGraphicsStatus={backend:'initializing',error:null};
async function initGraphics(){
 if(!navigator.gpu)throw new Error('This version requires WebGPU. Open it in an up-to-date Chrome or Edge with WebGPU enabled.');
 window.CatroomsLoadingProgress?.(42,'CHECKING GRAPHICS ADAPTER...');
 const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
 if(!adapter)throw new Error('No WebGPU adapter was found.');
 const device=await adapter.requestDevice();
 const format=navigator.gpu.getPreferredCanvasFormat();
 device.pushErrorScope('validation');
 let post=null,postError=null;
 try{post=new CatroomsPostProcessing(device,format);const report=await post.shader.getCompilationInfo();const errors=report.messages.filter(m=>m.type==='error');if(errors.length)throw Error(errors.map(m=>m.message).join('; '));}catch(e){postError=String(e.message||e);post=null;}
 const postValidation=await device.popErrorScope();if(postValidation){postError=postValidation.message;post=null;}
 if(postError)console.warn('CP08 post-processing disabled:',postError);
 device.pushErrorScope('validation');
 const renderer=new CatroomsWebGPURenderer(device,null,format,post);
 window.CatroomsLoadingProgress?.(56,'COMPILING WEBGPU SHADERS...');
 const reports=await Promise.all([renderer.terrainShader.getCompilationInfo(),renderer.spriteShader.getCompilationInfo(),renderer.meshShader.getCompilationInfo()]);
 const errors=reports.flatMap(r=>r.messages.filter(m=>m.type==='error').map(m=>m.message));
 const validation=await device.popErrorScope();if(validation)errors.push(validation.message);
 if(errors.length)throw new Error('WebGPU shader error: '+errors.join('; '));
 renderer.worldGeometry=new WorldGeometryExperiment(renderer);
 try{await renderer.worldGeometry.initialize();}catch(e){renderer.worldGeometry.error=String(e.message||e);renderer.worldGeometry.available=false;}
 if(renderer.worldGeometry.error)console.warn('CP10 geometry disabled:',renderer.worldGeometry.error);
 window.CatroomsLoadingProgress?.(69,'DECODING TEXTURES...');
 await renderer.buildTextures();
 window.CatroomsLoadingProgress?.(76,'LOADING HD MATERIALS...');
 try{renderer.hdMaterials=await buildHdMaterials(renderer);renderer.hdEnabled=true;}catch(e){renderer.hdError=String(e.message||e);console.warn('CP04 HD disabled:',renderer.hdError);}
 window.CatroomsLoadingProgress?.(85,'LOADING 3D MODELS...');
 await renderer.buildModels();
 const context=C.getContext('webgpu');
 if(!context)throw new Error('WebGPU context unavailable');
 renderer.context=context;gpuRenderer=renderer;
 window.CatroomsGraphicsPreferences?.apply();window.CatroomsSettings?.sync();
 window.CatroomsGraphicsStatus={backend:'webgpu',error:null};
 window.CatroomsPostFX={get available(){return !!renderer.post},get enabled(){return !!renderer.post?.enabled},get passes(){return renderer.post?.passes||0},get error(){return postError}};
 window.CatroomsFlashlight={get enabled(){return renderer.flashlightEnabled},get intensity(){return renderer.flashlightState?.intensity||0}};
 window.CatroomsLighting={get enabled(){return renderer.lightingEnabled},get wallShadows(){return renderer.wallShadowsEnabled},get activeWallShadows(){return renderer.lightingEnabled&&renderer.wallShadowsEnabled}};
 window.CatroomsMaterials={get available(){return !!renderer.hdMaterials},get enabled(){return renderer.hdEnabled},get error(){return renderer.hdError},get wallSize(){return renderer.hdEnabled?[512,1024]:[128,256]},get floorSize(){return renderer.hdEnabled?[512,512]:[64,64]}};
 window.CatroomsTerrainExperiment={get available(){return renderer.worldGeometry.available},get enabled(){return renderer.worldGeometry.enabled},get error(){return renderer.worldGeometry.error},get wallTriangles(){return renderer.stats.wallTriangles||0},get planeTriangles(){return renderer.stats.planeTriangles||0}};
 device.lost.then(info=>{
  // Ignore notifications from a device that is no longer current.
  if(gpuRenderer!==renderer)return;
  gpuRenderer=null;
  window.CatroomsGraphicsStatus={backend:'webgpu-lost',error:info.message||'Graphics device lost'};
  if(gameSession.state==='playing')pause();
  renderBackendStatus();
  const notice=document.createElement('div');notice.id='graphicsFailure';notice.setAttribute('role','alert');
  notice.style.cssText='position:fixed;inset:auto 20px 20px;z-index:99999;color:#fff;background:#622;padding:12px';
  notice.textContent='WebGPU device lost. Reload the game to restore graphics. Unsaved round progress will be lost. ';
  const button=document.createElement('button');button.textContent='RELOAD';button.onclick=()=>location.reload();notice.appendChild(button);document.body.appendChild(notice);
 });
}
function renderBackendStatus(){
  const el=$('rendererMode');if(!el)return;
  el.textContent=window.CatroomsGraphicsStatus.backend==='webgpu'?'WebGPU · GPU RAYCAST':'WebGPU REQUIRED';
  el.title=window.CatroomsGraphicsStatus.error||'WebGPU';
}
function resize(){if(gpuRenderer)gpuRenderer.resize();}
function render(){if(gpuRenderer){if(gameSession.state==='menu'){if(!$('pixelSplash').hidden)gpuRenderer.renderMenu(performance.now());}else gpuRenderer.render();}}


// Nonpersistent, opt-in during gameplay. No changes to save data or game rules.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F8'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer?.worldGeometry)return;
 event.preventDefault();
 const experiment=gpuRenderer.worldGeometry;
 if(!experiment.available){showToast('3D WORLD UNAVAILABLE · CLASSIC RENDERER ACTIVE',3);return;}
 experiment.toggle();window.CatroomsGraphicsPreferences?.capture();
 showToast(experiment.enabled?'EXPERIMENTAL 3D WORLD · F8 TO RETURN':'CLASSIC RAYCAST · F8 TO COMPARE',3);
});

// F9 is independent of the F8 wall geometry experiment.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F9'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();
 if(!gpuRenderer.hdMaterials){showToast('HD MATERIALS UNAVAILABLE · CLASSIC ACTIVE',3);return;}
 gpuRenderer.toggleHdMaterials();window.CatroomsGraphicsPreferences?.capture();showToast(gpuRenderer.hdEnabled?'HD MATERIALS · F9 TO COMPARE':'CLASSIC MATERIALS · F9 TO COMPARE',3);
});

// F10 compares CP05 local lighting without changing game rules or F8/F9.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F10'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.lightingEnabled=!gpuRenderer.lightingEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(gpuRenderer.lightingEnabled?'LIGHTING 2.0 · F10 TO COMPARE':'CLASSIC LIGHTING · F10 TO COMPARE',3);
});

// F7 compares the wall-visibility term independently of F8/F9/F10.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F7'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.wallShadowsEnabled=!gpuRenderer.wallShadowsEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(!gpuRenderer.lightingEnabled?'WALL SHADOWS '+(gpuRenderer.wallShadowsEnabled?'ON':'OFF')+' · ENABLE LIGHTING WITH F10':gpuRenderer.wallShadowsEnabled?'WALL SHADOWS ON · F7 TO COMPARE':'WALL SHADOWS OFF · F7 TO COMPARE',3);
});

// F6 compares the physical beam with the original screen-wide lighting.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F6'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();gpuRenderer.flashlightEnabled=!gpuRenderer.flashlightEnabled;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(gpuRenderer.flashlightEnabled?'FLASHLIGHT 2.0 · F6 TO COMPARE':'CLASSIC FLASHLIGHT · F6 TO COMPARE',3);
});

// F4 compares CP08 with the unprocessed scene. No settings or saves are changed.
if(typeof window.addEventListener==='function')window.addEventListener('keydown',event=>{
 if(event.code!=='F4'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||gameSession.state!=='playing'||!gpuRenderer)return;
 event.preventDefault();const p=gpuRenderer.post;if(!p){showToast('POST FX UNAVAILABLE',3);return;}
 p.enabled=!p.enabled;p.reset=true;p.lastTime=null;gpuRenderer.needsRender=true;window.CatroomsGraphicsPreferences?.capture();
 showToast(p.enabled?'HDR & BLOOM · F4 TO COMPARE':'CLASSIC COLOR · F4 TO COMPARE',3);
});

;
// SOURCE: js/graphics/minimap.js
// Dedicated 2D map overlay. The 3D world continues to use WebGPU exclusively.
function drawMap(){
 const canvas=UI.mapCanvas;if(!canvas||!Array.isArray(gameSession.world)||!gameSession.world.length)return;
 const g=canvas.getContext('2d');if(!g)return;
 const resolution=gameSession.N>=80?440:320;
 if(canvas.width!==resolution||canvas.height!==resolution){canvas.width=resolution;canvas.height=resolution;}
 const ts=resolution/gameSession.N;
 g.clearRect(0,0,resolution,resolution);
 g.fillStyle='#090d0b';g.fillRect(0,0,resolution,resolution);
 for(let y=0;y<gameSession.N;y++)for(let x=0;x<gameSession.N;x++){
  if(!gameSession.seen[y]?.[x])continue;
  const cell=gameSession.world[y][x];
  g.fillStyle=cell===5?'#77705f':cell===1?'#52564c':cell===3?'#a0dbab':cell===4?'#b75c42':isHardMode()?'#27302c':'#29362f';
  g.fillRect(x*ts,y*ts,Math.ceil(ts),Math.ceil(ts));
 }
 function pin(x,y,color,radius=.32){
  if(!gameSession.seen[Math.floor(y)]?.[Math.floor(x)])return;
  g.fillStyle=color;g.beginPath();g.arc((x+.02)*ts,(y+.02)*ts,Math.max(1.7,ts*radius),0,Math.PI*2);g.fill();
 }
 for(const f of gameSession.fuses)if(!f.taken)pin(f.x,f.y,'#edc879',.28);
 for(const b of gameSession.bonusItems)if(!b.taken)pin(b.x,b.y,b.type==='coin'?'#e9c05a':b.type==='stamina'?'#a9edb5':b.type==='hardFreeze'?'#82d8fa':b.type==='hardSlow'?'#dcb0ef':'#a6b8d0',.23);
 for(const s of gameSession.interactables)if(s.type==='slot')pin(s.x,s.y,'#f2bf58',.4);
 for(const t of gameSession.terminals)pin(t.x,t.y,t.used?'#4fca7d':'#ecc38d',.29);
 if(isHardMode()&&gameSession.hardEmergency)pin(gameSession.hardEmergency.x,gameSession.hardEmergency.y,'#f64539',.48);
 for(const p of gameSession.props)if(p.type==='hazard'&&(!p.expires||p.expires>gameSession.elapsed))pin(p.x,p.y,'#63b963',.19);
 if(gameSession.player.collected===gameSession.GOAL&&gameSession.terminals.every(t=>t.used)){
  g.fillStyle='#8bf0b8';g.fillRect(gameSession.exitCell.x*ts,gameSession.exitCell.y*ts,Math.ceil(ts),Math.ceil(ts));
 }
 const px=gameSession.player.x*ts,py=gameSession.player.y*ts;
 g.fillStyle='#fff1ca';g.beginPath();g.arc(px,py,Math.max(2.8,ts*.4),0,Math.PI*2);g.fill();
 g.strokeStyle='#fff1ca';g.lineWidth=Math.max(1.2,ts*.17);
 g.beginPath();g.moveTo(px,py);g.lineTo(px+Math.cos(gameSession.player.a)*Math.max(7,ts*1.7),py+Math.sin(gameSession.player.a)*Math.max(7,ts*1.7));g.stroke();
}

;
// SOURCE: js/audio/sound.js
// THE CATROOMS - sound effects and distance-aware character voices.
// All samples are user-provided, kept under assets/audio/ and also embedded in the standalone build.
// BLYSK (watcher) and SZEPT (listener) use the supplied voice lines with distance attenuation.
const SFX_FILES = {
  pickup: 'assets/audio/battery-charge.wav',
  metalCrack: 'assets/audio/metal-crack.mp3',
  coinPickup: 'assets/audio/coin-pickup.mp3',
  coinSlot: 'assets/audio/coin-slot.wav',
  safeMusic: 'assets/audio/safe-room/lift-music.mp3',
  safeCrackle: 'assets/audio/safe-room/campfire-crackle.mp3',
  steps: 'assets/audio/roblox-walking.mp3',
  pigOink: 'assets/audio/pig-oink.mp3',
  pigGrunt: 'assets/audio/pig-grunt.mp3',
  pigSqueal: 'assets/audio/pig-squeal.mp3',
  beast: 'assets/audio/angry-beast.mp3',
  catAngry: 'assets/audio/angry-cat.mp3',
  catVeryAngry: 'assets/audio/very-angry-cat.mp3',
  hurt: 'assets/audio/steve-old-hurt.mp3',
  szeptJadymy: 'assets/audio/voices/szept-jadymy-na-imielin.mp3',
  szeptNieLubi: 'assets/audio/voices/szept-nie-lubi-imielina.mp3',
  szeptVamos: 'assets/audio/voices/szept-vamos-polska.mp3',
  blyskOni: 'assets/audio/voices/blysk-oni-gadaja.mp3',
  blyskKurwy: 'assets/audio/voices/blysk-kurwy.mp3',
  blyskPijany: 'assets/audio/voices/blysk-pijany.mp3',
  appearScream: 'assets/audio/jumpscares/appear-scream-loud.wav',
  hardHeartbeat:'assets/audio/hard/heartbeat.mp3',
  hardSqueal:'assets/audio/hard/pig-squeal-horror.mp3',
  menuMusic:'assets/audio/music/menu-ambient.mp3',
  gameMusic:'assets/audio/music/game-ambient.mp3',
  chaseMusic:'assets/audio/music/chase-trailer.mp3'
};
const VOICE_LINES = Object.freeze({
  listener: ['szeptJadymy', 'szeptNieLubi', 'szeptVamos'],
  watcher: ['blyskOni', 'blyskKurwy', 'blyskPijany']
});
const sfxTemplates = Object.create(null);
const activeEnemySounds = [];
let walkingAudio = null, walkingPlaying = false, lossScreamAudio = null, hardHeartbeatAudio = null, hardHeartbeatPlaying = false;
const safeRoomTracks={music:null,fire:null};
const bgTracks={menu:null,game:null,chase:null};
let menuMusicUnlocked=false;
const activeOneShots=new Set();
function audioCategory(id){
 if(id==='appearScream')return 'jumpscare';
 if(id.startsWith('szept')||id.startsWith('blysk'))return 'voices';
 return 'effects';
}
function audioMix(category){
 if(muted)return 0;
 return (gameSettings.master/100)*(gameSettings[category]/100);
}
function refreshAudioMix(){
 for(const a of activeOneShots)a.volume=clamp((a._baseVolume||0)*audioMix(a._category||'effects'),0,1);
 for(const s of activeEnemySounds)s.audio.volume=clamp(s.currentVolume*audioMix(s.category||'effects'),0,1);
 if(walkingAudio)walkingAudio.volume=clamp((walkingAudio._baseVolume||0)*audioMix('effects'),0,1);
 if(hardHeartbeatAudio)hardHeartbeatAudio.volume=clamp((hardHeartbeatAudio._baseVolume||0)*audioMix('effects'),0,1);
 if(lossScreamAudio)lossScreamAudio.volume=clamp((lossScreamAudio._baseVolume||0)*audioMix('jumpscare'),0,1);
 for(const [kind,track] of Object.entries(safeRoomTracks))if(track){
   track.volume=clamp((track._baseVolume||0)*audioMix(kind==='music'?'ambient':'effects'),0,1);
 }
 for(const [id,a] of Object.entries(bgTracks))if(a)a.volume=clamp((a._baseVolume||0)*audioMix(id==='chase'?'effects':'ambient'),0,1);
 for(const node of ambientNodes)node.gain.gain.value=node.baseGain*audioMix('ambient');
}


// HTMLMediaElement playback works both in an offline ZIP opened as file://
// and in the self-contained HTML build (where these URLs become data: URIs).
function preloadGameSounds() {
  for (const [id, url] of Object.entries(SFX_FILES)) {
    if (sfxTemplates[id]) continue;
    const audio = new Audio();
    audio.preload = ['menuMusic','gameMusic','chaseMusic','safeMusic','safeCrackle'].includes(id)?'none':'auto';
    audio.src = url;
    sfxTemplates[id] = audio;
  }
}

function createGameSample(id, volume = 0.5, rate = 1) {
  if (muted || !sfxTemplates[id]) return null;
  const sound = sfxTemplates[id].cloneNode(true);
  sound._baseVolume=volume;
  sound._category=audioCategory(id);
  sound.volume=clamp(volume*audioMix(sound._category),0,1);
  activeOneShots.add(sound);
  sound.addEventListener('ended',()=>activeOneShots.delete(sound),{once:true});
  sound.addEventListener('error',()=>activeOneShots.delete(sound),{once:true});
  sound.playbackRate = rate;
  sound.preload = 'auto';
  // A failed asset never breaks the gameplay loop.
  const attempt = sound.play();
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => activeOneShots.delete(sound));
  return sound;
}

function stopEnemySounds() {
  for (const entry of activeEnemySounds) {
    entry.audio.pause();
    activeOneShots.delete(entry.audio);
    entry.audio.removeAttribute('src');
    entry.audio.load();
  }
  activeEnemySounds.length = 0;
}

function stopLossScream() {
  if (lossScreamAudio) {
    lossScreamAudio.pause();
    activeOneShots.delete(lossScreamAudio);
    lossScreamAudio.currentTime = 0;
    lossScreamAudio = null;
  }
}

// Played ONLY by lose(), never on alarms/panels. The supplied clip was
// normalized +10 dB with ~3 dB headroom: loud, but not hard clipped.
function playLossScream() {
  stopLossScream();
  if (muted) return;
  lossScreamAudio = createGameSample('appearScream', 1, 1);
  // The earlier synthesized scare remains available for non-death scripted events.
  if (!lossScreamAudio) playScare();
}

function stopWalkingSound() {
  if (walkingAudio) walkingAudio.pause();
  walkingPlaying = false;
}

function stopGameSounds() {
 for(const id of ['game','chase'])if(bgTracks[id])bgTracks[id].pause();
  stopSafeRoomTracks();
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}
  stopEnemySounds();
  stopWalkingSound();
}

function initAudio() {
  if (muted) return;
  preloadGameSounds();
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const b = audioCtx.createBuffer(1, audioCtx.sampleRate * .4, audioCtx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
      noiseBuffer = b;
    }
    audioCtx.resume();
    if (ambientNodes.length) return;
    for (const freq of (gameSession.level === 3 ? [47.5, 71.5, 95.2] : gameSession.level === 2 ? [41.2, 82.5, 125.1] : [59.9, 119.7, 60.3])) {
      const o = audioCtx.createOscillator(), gain = audioCtx.createGain(), filter = audioCtx.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = freq;
      filter.type = 'lowpass'; filter.frequency.value = 200;
      const baseGain=gameSession.level === 3 ? (freq < 60 ? .026 : .013) : gameSession.level === 2 ? (freq < 50 ? .023 : .012) : (freq < 60 ? .018 : .01);
      gain.gain.value=baseGain*audioMix('ambient');
      o.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); o.start();
      ambientNodes.push({o,gain,baseGain});
    }
  } catch (e) { /* Browser may block WebAudio until another gesture. MP3/WAV still work. */ }
}

function stopHum() { for (const n of ambientNodes) { try { n.o.stop(); } catch (e) {} } ambientNodes = []; }

// Existing synthesized cues remain for door unlocks, wins, and the original events.
// No new jumpscare files or jumpscare triggers have been added.
function sound(freq = 320, dur = .13, type = 'sine', volume = .11, slide = 0) {
  if (muted || !audioCtx) return;
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(35, freq + slide), t + dur);
  g.gain.setValueAtTime(Math.max(.0001,volume*audioMix('effects')), t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + dur + .01);
}

function syncWalkingAudio() {
  if (gameSession.state !== 'playing' || muted || !gameSession.player.moving || gameSession.player.hidden) {
    stopWalkingSound(); return;
  }
  if (!walkingAudio) {
    if (!sfxTemplates.steps) return;
    walkingAudio = sfxTemplates.steps.cloneNode(true);
    walkingAudio.loop = true;
    walkingAudio.preload = 'auto';
  }
  const running = !gameSession.crouching && !!(keys.ShiftLeft || keys.ShiftRight || touchRun);
  walkingAudio.playbackRate = gameSession.crouching ? .72 : running ? 1.42 : 1;
  walkingAudio._baseVolume = gameSession.crouching ? .16 : running ? .33 : .26;
  walkingAudio.volume = clamp(walkingAudio._baseVolume*audioMix('effects'),0,1);
  if (!walkingPlaying) {
    walkingPlaying = true;
    const attempt = walkingAudio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => { walkingPlaying = false; });
  }
}

function playPickup() {
  if (!createGameSample('pickup', .16)) sound(430, .18, 'triangle', .06, 260);
}
function playHurt(){ if(!createGameSample('hurt', .72, 1)) sound(180,.22,'square',.18,-70); }
function playUnlock() { sound(380, .6, 'sawtooth', .08, 500); }
function playSting(loud = true) { sound(loud ? 110 : 220, loud ? .8 : .2, 'sawtooth', loud ? .12 : .03, loud ? -60 : -30); }
function playScare() { sound(85, .8, 'sawtooth', .27, 800); sound(48, .65, 'square', .20, 240); }
function playWin() { sound(550, .25, 'triangle', .16, 200); setTimeout(() => sound(740, .4, 'triangle', .15, 300), 130); }

// Volume falls smoothly from near distance to silence beyond maxRange;
// a wall between player and monster dampens the sound further.
function enemyAudibility(monster, maxRange = 19) {
  const dx = monster.x - gameSession.player.x, dy = monster.y - gameSession.player.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= maxRange) return 0;
  const normalized = clamp((maxRange - dist) / (maxRange - 1.5), 0, 1);
  let gain = Math.pow(normalized, 1.65);
  if (dist > 3 && !lineOfSight(monster.x, monster.y, gameSession.player.x, gameSession.player.y)) gain *= .57;
  return clamp(gain, 0, 1);
}

function playEnemySample(id, monster, volume, rate, maxRange = 19, isVoice = false) {
  if (!monster || muted || gameSession.state !== 'playing') return false;
  if (isVoice && activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended)) return false;
  const audibility = enemyAudibility(monster, maxRange);
  if (audibility < .012 || activeEnemySounds.length >= 8) return false;
  const audio = createGameSample(id, Math.min(.95, volume * audibility), rate);
  if (!audio) return false;
  activeEnemySounds.push({audio,monster,volume,maxRange,currentVolume:volume*audibility,category:audioCategory(id),isVoice});
  return true;
}

function updateEnemyAudio(dt) {
  if (muted || gameSession.state !== 'playing') { stopGameSounds(); return; }
  for (let i = activeEnemySounds.length - 1; i >= 0; i--) {
    const s = activeEnemySounds[i];
    if (s.audio.ended || s.audio.error) { s.audio.pause(); activeOneShots.delete(s.audio); activeEnemySounds.splice(i, 1); continue; }
    const target = s.volume * enemyAudibility(s.monster, s.maxRange);
    s.currentVolume += (target - s.currentVolume) * Math.min(1, dt * 8);
    s.audio.volume = clamp(s.currentVolume*audioMix(s.category||'effects'),0,1);
    if (target <= .0001 && s.currentVolume < .003) {
      s.audio.pause(); activeOneShots.delete(s.audio); activeEnemySounds.splice(i, 1);
    }
  }
  const monsters = gameSession.level === 1 ? [...(gameSession.awake ? [gameSession.cat] : []),...gameSession.guards] : gameSession.guards;
  for (const monster of monsters) {
    const lines = VOICE_LINES[monster.kind];
    if (lines) {
      // The three lines of each character play in a shuffled starting order,
      // then rotate. No doubling up while a longer line is still playing.
      if (monster._voiceCursor === undefined) monster._voiceCursor = Math.floor(Math.random() * lines.length);
      if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = gameSession.elapsed + 1.5 + Math.random() * 3;
      if (gameSession.elapsed >= monster._nextVoiceAt) {
        const voiceId = lines[monster._voiceCursor % lines.length];
        const playing = activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended);
        if (!playing) {
          if (playEnemySample(voiceId, monster, monster.kind === 'listener' ? .64 : .67, 1, 23, true)) {
            monster._voiceCursor++;
            monster._nextVoiceAt = gameSession.elapsed + (monster.state === 'chase' ? 8.5 : 13) + Math.random() * 3.5;
          } else {
            // Retest soon after the player approaches the sound's radius.
            monster._nextVoiceAt = gameSession.elapsed + 2;
          }
        }
      }
      continue;
    }
    if (monster.kind !== 'cat' && monster.kind !== 'pig') continue;
    const chasing = monster.state === 'chase';
    if (monster._soundChasing !== chasing) {
      monster._soundChasing = chasing;
      if (chasing) {
        // One original angry-beast recording, differently pitched for each creature.
        if(isHardMode()&&monster.kind==='pig')playEnemySample('hardSqueal',monster,.68,1.0,32);
        playEnemySample('beast', monster, monster.kind === 'pig' ? .72 : .52,
          monster.kind === 'pig' ? .73 : 1.16, 22);
        monster._nextVoiceAt = gameSession.elapsed + (monster.kind === 'pig' ? 2.3 : 3.0);
      }
    }
    if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = gameSession.elapsed + 1.5 + Math.random() * 2.8;
    if (gameSession.elapsed < monster._nextVoiceAt) continue;
    if (monster.kind === 'pig') {
      // Low grunts/oinks while patrolling; piercing squeal when hunting.
      if (chasing) playEnemySample('pigSqueal', monster, .61, .85, 18);
      else playEnemySample(Math.random() < .55 ? 'pigGrunt' : 'pigOink', monster, .57, .92, 15);
    } else {
      playEnemySample(chasing ? 'catVeryAngry' : 'catAngry', monster,
        chasing ? .58 : .41, chasing ? 1.06 : 1.12, chasing ? 19 : 14);
    }
    monster._nextVoiceAt = gameSession.elapsed + (chasing ? 5.2 : 7.4) + Math.random() * 2.6;
  }
}

// Kept as an API for old level scripts, now uses the supplied pig recording.
function playPigSnort(monster) {
  if (monster && monster.kind === 'pig') playEnemySample('pigGrunt', monster, .54, .86, 15);
}


function syncHardHeartbeat(){
 const active=isHardMode()&&(gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||!!gameSession.hardEmergency);
 if(!active||muted||gameSession.state!=='playing'){
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}return;
 }
 if(!hardHeartbeatAudio){
  if(!sfxTemplates.hardHeartbeat)return;
  hardHeartbeatAudio=sfxTemplates.hardHeartbeat.cloneNode(true);
  hardHeartbeatAudio.loop=true;hardHeartbeatAudio.preload='auto';
 }
 const chase=gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage));
 hardHeartbeatAudio._baseVolume=chase?.24:.15;
 hardHeartbeatAudio.volume=clamp(hardHeartbeatAudio._baseVolume*audioMix('effects'),0,1);
 if(!hardHeartbeatPlaying){
  hardHeartbeatPlaying=true;
  const attempt=hardHeartbeatAudio.play();
  attempt?.catch?.(()=>{hardHeartbeatPlaying=false});
 }
}


// Localized, continuous safe-room ambience. The lift tune can be heard inside
// the room; the crackle is strongest by the imported campfire mesh. Outside a
// locked room both are practically inaudible. No persistent audio after pause.
function stopSafeRoomTracks(){
  for(const track of Object.values(safeRoomTracks))if(track)track.pause();
}
function syncSafeRoomAudio(dt){
  const room=bossRushNearestRoom();
  if(!room||gameSession.state!=='playing'||muted){stopSafeRoomTracks();return;}
  const inside=gameSession.player.x>room.left&&gameSession.player.x<room.left+room.side-1&&gameSession.player.y>room.top&&gameSession.player.y<room.top+room.side-1;
  const doorDist=Math.hypot(gameSession.player.x-room.doorX-.5,gameSession.player.y-room.doorY-.5);
  const fireDist=Math.hypot(gameSession.player.x-room.fireX,gameSession.player.y-room.fireY);
  const musicTarget=inside?.20:room.open?.055*Math.max(0,1-doorDist/7):0;
  let fireTarget=.51*Math.pow(Math.max(0,1-fireDist/10),1.5);
  if(!inside&&!room.open)fireTarget*=.08;
  if(!inside&&room.open)fireTarget*=.55;
  for(const [kind,id,target,category] of [['music','safeMusic',musicTarget,'ambient'],['fire','safeCrackle',fireTarget,'effects']]){
    let track=safeRoomTracks[kind];
    if(!track&&target>.002&&sfxTemplates[id]){
      track=sfxTemplates[id].cloneNode(true);
      track.loop=true;track.preload='auto';track._baseVolume=0;
      safeRoomTracks[kind]=track;
    }
    if(!track)continue;
    track._baseVolume+=(target-track._baseVolume)*Math.min(1,dt*4);
    track.volume=clamp(track._baseVolume*audioMix(category),0,1);
    if(track._baseVolume>.004&&track.paused){
      const task=track.play();task?.catch?.(()=>{});
    }else if(track._baseVolume<.003&&!track.paused)track.pause();
  }
}

function syncGameAudio(dt) {
  syncBackgroundTracks(dt);
  if (gameSession.state !== 'playing' || muted) { stopGameSounds(); return; }
  syncWalkingAudio();
  updateEnemyAudio(dt);
  syncHardHeartbeat();
  syncSafeRoomAudio(dt);
}

function playCoinPickup(){createGameSample('coinPickup',.16,1);}
function playCoinSlot(){createGameSample('coinSlot',.49,1);}


function unlockMenuMusic(){
 menuMusicUnlocked=true;preloadGameSounds();
 for(const track of Object.values(bgTracks))if(track)track._autoplayBlocked=false;
 syncBackgroundTracks(.16);
}
function syncBackgroundTracks(dt=.04){
 if(!menuMusicUnlocked)return;
 const chase=gameSession.state==='playing'&&(gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&g.variant!=='gray'&&
   (gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||(gameSession.level===1&&gameSession.awake&&gameSession.cat?.state==='chase'));
 const targets={
  menu:gameSession.state==='menu'?.25:0,
  game:gameSession.state==='playing'?(chase?.055:.23):0,
  chase:chase?.35:0
 };
 for(const [id,key,category] of [['menu','menuMusic','ambient'],['game','gameMusic','ambient'],['chase','chaseMusic','effects']]){
   let a=bgTracks[id];
   if(!a&&sfxTemplates[key]&&!muted&&targets[id]>.002){
     a=sfxTemplates[key].cloneNode(true);a.loop=true;a.preload='auto';a._baseVolume=0;
     bgTracks[id]=a;
   }
   if(!a)continue;
   const target=muted?0:targets[id];
   a._baseVolume+=(target-a._baseVolume)*Math.min(1,Math.max(dt,.016)*3.3);
   a.volume=clamp(a._baseVolume*audioMix(category),0,1);
   if(target>.002&&a.paused&&!a._playPending&&!a._autoplayBlocked){
     a._playPending=true;
     try{Promise.resolve(a.play()).catch(()=>{a._autoplayBlocked=true;}).finally(()=>{a._playPending=false;});}
     catch(e){a._playPending=false;a._autoplayBlocked=true;}
   }
   if(target<=.002&&a._baseVolume<.008&&!a.paused)a.pause();
 }
}

;
// SOURCE: js/progression/streak.js
// Persistent runs. Admin-modified victories do not qualify for the win streak.
let winStreak=Math.floor(readNumber('catroomsWinStreak',0,0,Number.MAX_SAFE_INTEGER-1));
let bestStreak=Math.max(winStreak,Math.floor(readNumber('catroomsBestStreak',0,0,Number.MAX_SAFE_INTEGER)));
let unlocked4=progressRead('catroomsUnlocked4')==='1';
function streakRender(){
  $('streakCount').textContent=winStreak;
  $('menuStreak').textContent=winStreak;
  $('menuBestStreak').textContent=bestStreak;
  setUIIconText($('endStreak'),'flame','WIN STREAK: '+winStreak+' · REKORD: '+bestStreak);
}
function qualifiesForProgress(){return !gameSession.runCheated&&gameSession.level!==13;}
function streakResult(good){
  if(!qualifiesForProgress())return;
  if(good){winStreak=Math.min(Number.MAX_SAFE_INTEGER,winStreak+1);bestStreak=Math.max(bestStreak,winStreak)}
  if(!good)winStreak=0;
  progressWrite('catroomsWinStreak',winStreak);
  progressWrite('catroomsBestStreak',bestStreak);
  streakRender();
}
function prepareRun(){gameSession.runCheated=false;godMode=false;lastShieldToast=-100;streakRender()}

;
// SOURCE: js/gameplay/procedural.js
// Fully isolated procedural mode, using seeded rooms, a connected corridor graph,
// randomized enemy casts, pickup locations, consumables and escape positions.
let proceduralSeed=0,requestedSeed=null;
function dungeonBuild(runSeed){
  seed=runSeed|0;
  gameSession.N=49;gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
  const centers=[6,18,30,42],segments=[];
  const carve=(x,y,w,h)=>{for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++)gameSession.world[yy][xx]=0};
  for(let yi=0;yi<4;yi++)for(let xi=0;xi<4;xi++){
    const x=centers[xi],y=centers[yi],w=5+Math.floor(rnd()*4),h=5+Math.floor(rnd()*4);
    carve(x-Math.floor(w/2),y-Math.floor(h/2),w,h);
  }
  // Randomized spanning tree ensures ALL rooms are connected on every seed.
  const visited=new Set(['0,0']),stack=[[0,0]],connections=new Set();
  const edge=(a,b)=>[a.join(','),b.join(',')].sort().join('::');
  while(stack.length){
    const [x,y]=stack.at(-1),neighbors=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([u,v])=>u>=0&&u<4&&v>=0&&v<4&&!visited.has(`${u},${v}`));
    if(!neighbors.length){stack.pop();continue}
    const next=neighbors[Math.floor(rnd()*neighbors.length)];
    connections.add(edge([x,y],next));visited.add(next.join(','));stack.push(next);
  }
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
    if(x<3&&(rnd()<.47||connections.has(edge([x,y],[x+1,y]))))segments.push([x,y,x+1,y]);
    if(y<3&&(rnd()<.47||connections.has(edge([x,y],[x,y+1]))))segments.push([x,y,x,y+1]);
  }
  for(const [x,y,u,v] of segments){
    const sx=centers[x],sy=centers[y],ex=centers[u],ey=centers[v];
    if(x===u)carve(sx-1,Math.min(sy,ey),3,Math.abs(ey-sy)+1);
    else carve(Math.min(sx,ex),sy-1,Math.abs(ex-sx)+1,3);
  }
  return centers;
}
function dungeonEmptyCells(fromX=5,fromY=5){
  const dist=bfsDistances(fromX,fromY),out=[];
  for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
    if(gameSession.world[y][x]===0&&dist[y][x]>=0)out.push({x,y,d:dist[y][x]});
  }
  return out;
}
function chooseFarCells(cells,num,minDist,exclude=[]){
  const selected=[];
  const candidates=cells.filter(c=>c.d>5).sort(()=>rnd()-.5);
  for(const c of candidates){
    if([...selected,...exclude].every(p=>Math.hypot(c.x-p.x,c.y-p.y)>=minDist))selected.push(c);
    if(selected.length>=num)break;
  }
  if(selected.length<num){for(const c of cells){if([...selected,...exclude].every(p=>Math.hypot(c.x-p.x,c.y-p.y)>=3))selected.push(c);if(selected.length>=num)break}}
  return selected;
}
function resetProcedural(){
  document.body.classList.remove('level2','final-level','pig-level');
  document.body.classList.add('procedural-level');
  // Browser crypto is available in normal deployments; this fallback also works offline.
  proceduralSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
  requestedSeed=null;
  dungeonBuild(proceduralSeed);
  gameSession.GOAL=6+Math.floor(rnd()*3);
  gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];
  const spawn={x:6,y:6},cells=dungeonEmptyCells(spawn.x,spawn.y);
  // An exit is a wall until the player finishes the objectives. Placing it on
  // an articulation cell can cut the dungeon in half, so test the connectivity
  // of all remaining rooms with the exit temporarily closed.
  const ordered=cells.slice().sort((a,b)=>b.d-a.d);
  let exit=null;
  for(const candidate of ordered){
    if(Math.hypot(candidate.x-spawn.x,candidate.y-spawn.y)<10)continue;
    gameSession.world[candidate.y][candidate.x]=3;
    const remaining=bfsDistances(spawn.x,spawn.y);
    gameSession.world[candidate.y][candidate.x]=0;
    if(cells.every(p=>(p.x===candidate.x&&p.y===candidate.y)||remaining[p.y][p.x]>=0)){
      exit=candidate;break;
    }
  }
  exit=exit||ordered[0];
  gameSession.exitCell={x:exit.x,y:exit.y};
  const items=chooseFarCells(cells,gameSession.GOAL,6,[spawn,gameSession.exitCell]);
  for(let i=0;i<items.length;i++)addCard('random-'+i,items[i].x+.5,items[i].y+.5);
  // Zero broken seeds: add any missing objectives in reachable cells.
  if(gameSession.fuses.length<gameSession.GOAL){for(const p of cells){if(gameSession.fuses.length>=gameSession.GOAL)break;if(p.d>8&&!gameSession.fuses.some(f=>Math.hypot(f.x-p.x,f.y-p.y)<2))addCard('extra-'+gameSession.fuses.length,p.x+.5,p.y+.5)}}
  const consumables=chooseFarCells(cells,7,4,[spawn,gameSession.exitCell,...items]);
  const types=['stamina','shield'];
  consumables.forEach((p,i)=>{
    const type=i<2?'stamina':types[Math.floor(rnd()*types.length)];
    addPickup('loot-'+i,p.x+.5,p.y+.5,type,
      type==='stamina'?'ENERGY DRINK':'PROTECTIVE SHIELD',1);
  });
  prepareEnergyDrinkLottery();
  const spawns=chooseFarCells(cells,3+Math.floor(rnd()*2),7,[spawn,...items,gameSession.exitCell]);
  const kinds=['cat','pig','watcher','listener'];
  gameSession.guards=spawns.map((p,i)=>makeGuard(p.x+.5,p.y+.5,kinds[Math.floor(rnd()*kinds.length)]));
  // Randomized pickup positions and enemy archetypes share one reproducible seed.
  gameSession.world[gameSession.exitCell.y][gameSession.exitCell.x]=3;
  scatterEnvironmentalProps(24,10,[...gameSession.fuses,spawn]);
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
  commonFacilityReset();
  gameSession.player.x=spawn.x+.5;gameSession.player.y=spawn.y+.5;chooseSpawnView();updateSeen();
  $('levelLabel').textContent='TRYB PROCEDURALNY / RANDOM ZONE';
  setUIIcon(document.querySelector('.chip .gem'),'spark');
  $('seedChip').style.display='block';$('seedText').textContent=String(proceduralSeed>>>0);
  $('eventTag').textContent='SEED '+(proceduralSeed>>>0);
  gameSession.cat=gameSession.guards[0]||makeGuard(30.5,30.5,'pig');
  gameSession.player.shieldUntil=0;
  updateObjectiveFacility();
  showToast(`NEW ZONE · ${gameSession.GOAL} ITEMS · ${gameSession.guards.length} ENEMIES`,3.8);
}

;
// SOURCE: js/gameplay/hard.js
// HARD / seed-reproducible connected procedural labyrinth, with dangerous dead ends.
// Server-independent: this mode is solo-only until the dormant CO-OP is reenabled.
const HARD_VARIANTS=['red','green','yellow','gray','classic','pink'];
function hardGenerateMap(runSeed,stage=1){
 seed=runSeed|0;gameSession.N=gameSession.level===13?customGameConfig.size:([0,65,73,81,89,97][stage]||65);
 gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
 const n=stage<3?5:6;const step=Math.floor((gameSession.N-14)/(n-1));const centers=Array.from({length:n},(_,i)=>7+i*step),edges=[];
 const carve=(x,y,w,h)=>{for(let yy=Math.max(1,y);yy<Math.min(gameSession.N-1,y+h);yy++)for(let xx=Math.max(1,x);xx<Math.min(gameSession.N-1,x+w);xx++)gameSession.world[yy][xx]=0};
 // Every room connects through a deterministic random spanning tree.
 for(const y of centers)for(const x of centers){const w=5+Math.floor(rnd()*5),h=5+Math.floor(rnd()*5);carve(x-(w>>1),y-(h>>1),w,h)}
 const visited=new Set(['0,0']),stack=[[0,0]],links=new Set();
 const edge=(a,b)=>[a.join(','),b.join(',')].sort().join('::');
 while(stack.length){
   const [x,y]=stack.at(-1);
   const options=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&b>=0&&a<n&&b<n&&!visited.has(a+','+b));
   if(!options.length){stack.pop();continue}
   const next=options[Math.floor(rnd()*options.length)];links.add(edge([x,y],next));visited.add(next.join(','));stack.push(next);
 }
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
   if(x<n-1&&(links.has(edge([x,y],[x+1,y]))||rnd()<.12))edges.push([x,y,x+1,y]);
   if(y<n-1&&(links.has(edge([x,y],[x,y+1]))||rnd()<.12))edges.push([x,y,x,y+1]);
 }
 for(const [x,y,xx,yy] of edges){
   const ax=centers[x],ay=centers[y],bx=centers[xx],by=centers[yy];
   if(ax===bx)carve(ax-1,Math.min(ay,by),3,Math.abs(by-ay)+1);
   else carve(Math.min(ax,bx),ay-1,Math.abs(bx-ax)+1,3);
 }
 // Side branches terminate in dead ends; do NOT disconnect the main graph.
 let branches=0;
 for(let i=0;i<1100&&branches<34;i++){
   const x=3+Math.floor(rnd()*(gameSession.N-6)),y=3+Math.floor(rnd()*(gameSession.N-6));
   if(gameSession.world[y][x]!==0)continue;
   const dirs=[[1,0],[-1,0],[0,1],[0,-1]], [dx,dy]=dirs[Math.floor(rnd()*dirs.length)];
   const sx=-dy,sy=dx,len=2+Math.floor(rnd()*5),path=[];
   let valid=true;
   for(let d=1;d<=len;d++){
     const xx=x+dx*d,yy=y+dy*d;
     // Each branch must have walls on both sides, guaranteeing a dead end.
     if(xx<=2||yy<=2||xx>=gameSession.N-3||yy>=gameSession.N-3||gameSession.world[yy][xx]!==1||gameSession.world[yy+sy][xx+sx]!==1||gameSession.world[yy-sy][xx-sx]!==1){valid=false;break}
     path.push([xx,yy]);
   }
   if(valid){for(const [xx,yy] of path)gameSession.world[yy][xx]=0;branches++;}
 }
 carve(5,5,5,5); // guaranteed starting room
}

// Keep the same enemy cast for each HARD campaign stage, but roll champion
// variants afresh for EVERY run, from the run's procedural seed.
// Up to ONE enemy may be ordinary (40% chance per run), with no champion perks.
// HARD 1 always contains exactly two Marmurs, so it excludes the pink split.
const HARD_STAGE_ENEMIES={
 1:['cat','cat'],
 2:['watcher','listener','watcher'],
 3:['cat','watcher','listener','cat'],
 4:['pig','pig','pig'],
 5:['pig','stranger']
};
const HARD_CHAMPION_VARIANTS=['red','green','yellow','gray','pink'];
const HARD_ORDINARY_CHANCE=.40;
const HARD_STAGE_NAMES=['','YELLOW CORRIDORS','FLOODED COMPLEX','BLOODY ZONE','CHRUM SECTOR','LAST ENCOUNTER'];
function rollHardChampionLineup(stage){
 const kinds=HARD_STAGE_ENEMIES[stage]||HARD_STAGE_ENEMIES[1];
 const variants=stage===1?HARD_CHAMPION_VARIANTS.filter(v=>v!=='pink'):HARD_CHAMPION_VARIANTS;
 const ordinaryIndex=rnd()<HARD_ORDINARY_CHANCE?Math.floor(rnd()*kinds.length):-1;
 return kinds.map((kind,i)=>[kind,i===ordinaryIndex?'classic':variants[Math.floor(rnd()*variants.length)]]);
}
function assignChampion(g,variant){
 g.variant=variant;g.isChampion=variant!=='classic';
 g.hardEnhanced=variant!=='pink'&&variant!=='classic';
 g.sizeMultiplier=variant==='pink'?.58:1;
 g.speedMultiplier=variant==='red'?1.34:variant==='gray'?.68:variant==='pink'?.85:1;
 g.nextTrail=0;g.nextPulse=30+rnd()*60;
 return g;
}
function scatterHardRocks(spawn,desired){
 const avoid=[spawn,{x:gameSession.exitCell.x,y:gameSession.exitCell.y},...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards];
 const candidates=dungeonEmptyCells(spawn.x,spawn.y).filter(c=>c.d>9&&
   [[1,0],[-1,0],[0,1],[0,-1]].every(([dx,dy])=>gameSession.world[c.y+dy]?.[c.x+dx]===0) &&
   (()=>{let localOpen=0;for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)if(gameSession.world[c.y+oy]?.[c.x+ox]===0)localOpen++;return localOpen>=8;})() &&
   avoid.every(p=>Math.hypot((p.x||0)-c.x-.5,(p.y||0)-c.y-.5)>2.3));
 // Deterministic shuffle, while keeping the guaranteed route to every objective.
 candidates.sort(()=>rnd()-.5);
 const important=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards];
 let placed=0;
 for(const c of candidates){
   if(placed>=desired)break;
   if(gameSession.hardRocks.some(r=>Math.hypot(r.x-c.x-.5,r.y-c.y-.5)<2.5))continue;
   gameSession.world[c.y][c.x]=5;const d=bfsDistances(spawn.x,spawn.y);
   const pass=important.every(q=>d[Math.floor(q.y)]?.[Math.floor(q.x)]>=0)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>d[gameSession.exitCell.y+dy]?.[gameSession.exitCell.x+dx]>=0);
   if(!pass){gameSession.world[c.y][c.x]=0;continue;}
   const rock={type:'rock',x:c.x+.5,y:c.y+.5,phase:rnd()*TAU,size:.58+rnd()*.10};
   gameSession.hardRocks.push(rock);gameSession.props.push(rock);placed++;
 }
}
function resetHard(){
 const stage=hardStage()||1;
 document.body.classList.remove('level2','final-level','pig-level','procedural-level','hard-detected');
 document.body.classList.add('hard-level','hard-stage-'+stage);
 for(let i=1;i<=4;i++)if(i!==stage)document.body.classList.remove('hard-stage-'+i);
 hardSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
 requestedSeed=null;hardGenerateMap(hardSeed,stage);
 const spawn={x:7,y:7},cells=dungeonEmptyCells(spawn.x,spawn.y);
 gameSession.GOAL=[0,8,9,10,9,11][stage];
 gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];gameSession.hardRocks=[];
 // Portal is not allowed to split routes between the player and objectives.
 const candidates=cells.slice().sort((a,b)=>b.d-a.d);
 let exit=candidates.find(c=>c.d>35&&gameSession.world[c.y][c.x]===0&&
    (gameSession.world[c.y+1]?.[c.x]===0||gameSession.world[c.y-1]?.[c.x]===0))||candidates[0];
 for(const c of candidates){
  if(c.d<36)break;gameSession.world[c.y][c.x]=3;
  const d=bfsDistances(spawn.x,spawn.y);gameSession.world[c.y][c.x]=0;
  if(cells.every(q=>q===c||(q.x===c.x&&q.y===c.y)||d[q.y][q.x]>=0)){exit=c;break;}
 }
 gameSession.exitCell={x:exit.x,y:exit.y};
 const usable=cells.filter(c=>c.x!==exit.x||c.y!==exit.y);
 const targets=chooseFarCells(usable,gameSession.GOAL,stage===1?7:9,[spawn,exit]);
 for(let i=0;i<gameSession.GOAL;i++){
   const q=targets[i]||usable.find(c=>c.d>8&&!gameSession.fuses.some(f=>Math.hypot(c.x+.5-f.x,c.y+.5-f.y)<3));
   if(q)addCard('hard-'+stage+'-target-'+i,q.x+.5,q.y+.5);
 }
 const panelCount=[0,0,2,3,3,4][stage];
 const panelCells=chooseFarCells(usable,panelCount,11,[spawn,exit,...targets]);
 panelCells.forEach((q,i)=>addControl('hard-panel-'+i,q.x+.5,q.y+.5,
   (stage===4?'DZWIGNIA':'REAKTOR')+' / '+(i+1),i+1));
 const consumables=chooseFarCells(usable,12,5,[spawn,exit,...targets,...panelCells]);
 for(let i=0;i<consumables.length;i++){
   const q=consumables[i],type=['stamina','stamina','shield'][i%3];
   addPickup('hard-'+stage+'-loot-'+i,q.x+.5,q.y+.5,type,
    type==='stamina'?'ENERGY DRINK':'SHIELD',1);
 }
 prepareEnergyDrinkLottery();
 const specials=chooseFarCells(usable,4,9,[spawn,exit,...targets,...panelCells,...consumables]);
 for(let i=0;i<3;i++)if(specials[i])addPickup('hard-slow-'+i,specials[i].x+.5,specials[i].y+.5,'hardSlow','SLOW DEVICE');
 if(specials[3])addPickup('hard-freeze',specials[3].x+.5,specials[3].y+.5,'hardFreeze','FREEZE DEVICE');
 // Roll every variant again at each run start (also on replay).
 // On HARD 1 no pink split: precisely two Marmurs stay on the map.
 gameSession.guards=[];
 const lineup=gameSession.level===13?customGameLineup():rollHardChampionLineup(stage);
 const spawnCells=chooseFarCells(usable,lineup.length+2,12,[spawn,exit,...targets]);
 for(let i=0;i<lineup.length;i++){
   const [kind,variant]=lineup[i],q=spawnCells[i]||usable.find(c=>c.d>18+i*2)||usable[0];
   const pairs=variant==='pink'?2:1;
   for(let copy=0;copy<pairs;copy++){
     const nearby=copy?usable.find(c=>Math.hypot(c.x-q.x,c.y-q.y)>3&&Math.hypot(c.x-q.x,c.y-q.y)<7&&
                         gameSession.guards.every(g=>Math.hypot(c.x+.5-g.x,c.y+.5-g.y)>2)):q;
     const target=nearby||q;
     gameSession.guards.push(assignChampion(makeGuard(target.x+.5,target.y+.5,kind),variant));
   }
 }
 gameSession.world[exit.y][exit.x]=3;
 // Rocks are solid, block AI routes, and never isolate an objective.
 scatterHardRocks(spawn,gameSession.level===13&&customGameConfig.difficulty==='normal'?12:[0,26,34,41,50,54][stage]);
 scatterEnvironmentalProps(16+stage*4,9+stage*2,[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,spawn]);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
 commonFacilityReset();
 gameSession.player.x=spawn.x+.5;gameSession.player.y=spawn.y+.5;
 gameSession.player.inventory={energy:[],slow:0,freeze:0};gameSession.player.slowCharges=0;gameSession.player.freezeCharges=0;
 gameSession.hardSlowUntil=0;gameSession.hardPulseUntil=0;gameSession.hardPulseNext=0;gameSession.hardEmergency=null;gameSession.hardNextEmergency=68+rnd()*24;
 chooseSpawnView();updateSeen();
 $('levelLabel').textContent=gameSession.level===13?'CUSTOM GAME / '+HARD_STAGE_NAMES[stage]:'HARD '+stage+' / '+HARD_STAGE_NAMES[stage];
 $('seedChip').style.display='block';$('seedText').textContent=String(hardSeed>>>0);
 $('eventTag').textContent='HARD '+stage+' · SEED '+(hardSeed>>>0);
 setUIIcon(document.querySelector('.chip .gem'),stage===1?'battery':stage===4?'feed':'skull');
 gameSession.cat=gameSession.guards[0];gameSession.player.shieldUntil=0;updateObjectiveFacility();
 $('hardEmergency').hidden=true;document.body.classList.remove('hard-detected');
 updateInventoryUI();
 // The player discovers enemy variants through play, not a stage briefing.
}
function hardSlowActive(){return gameSession.elapsed<gameSession.hardSlowUntil}
function yellowCanSeePlayer(g){
 const distance=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y);
 const angle=Math.atan2(gameSession.player.y-g.y,gameSession.player.x-g.x);
 const delta=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)));
 return !g.frozen&&!gameSession.player.hidden&&distance<=22&&delta<2.35&&lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y);
}
function hardPulseActive(){return isHardMode()&&gameSession.elapsed<gameSession.hardPulseUntil&&gameSession.guards.some(g=>g.variant==='yellow'&&yellowCanSeePlayer(g))}
function useHardSlow(){
 if(gameSession.state!=='playing')return;
 if((gameSession.player.slowCharges||0)<1){showToast('NO SLOW DEVICE IN INVENTORY',1.7);return}
 gameSession.player.slowCharges--;gameSession.player.inventory.slow=gameSession.player.slowCharges;gameSession.hardSlowUntil=Math.max(gameSession.hardSlowUntil,gameSession.elapsed)+30;
 showToast('MONSTERS SLOWED · 30 SECONDS',3);playUnlock();updateInventoryUI();
}
function useHardFreeze(){
 if(gameSession.state!=='playing')return;
 if((gameSession.player.freezeCharges||0)<1){showToast('NO FREEZE DEVICE IN INVENTORY',1.7);return}
 const targets=gameSession.level===1?[gameSession.cat]:gameSession.guards;
 const available=targets.filter(g=>g&&!g.frozen&&Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y)<15&&lineOfSight(gameSession.player.x,gameSession.player.y,g.x,g.y));
 available.sort((a,b)=>Math.hypot(a.x-gameSession.player.x,a.y-gameSession.player.y)-Math.hypot(b.x-gameSession.player.x,b.y-gameSession.player.y));
 const target=available[0];
 if(!target){showToast('STWOR MUSI BYC WIDOCZNY, DO 15 M',2.8);return}
 gameSession.player.freezeCharges--;gameSession.player.inventory.freeze=gameSession.player.freezeCharges;target.frozen=true;target.path=[];target.state='frozen';
 showToast('STWOR ZAMROZONY · DOTYK NADAL ZABIJA',3.5);playUnlock();updateInventoryUI();
}
function triggerHardEmergency(){
 const sx=Math.floor(gameSession.player.x),sy=Math.floor(gameSession.player.y),dist=bfsDistances(sx,sy);
 const options=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||dist[y][x]<7||dist[y][x]>20)continue;
  if(gameSession.fuses.some(f=>!f.taken&&Math.hypot(f.x-x-.5,f.y-y-.5)<2))continue;
  if(gameSession.terminals.some(t=>Math.hypot(t.x-x-.5,t.y-y-.5)<2))continue;
  if(gameSession.hardRocks.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2))continue;
  options.push({x,y,d:dist[y][x]});
 }
 options.sort((a,b)=>Math.abs(a.d-13)-Math.abs(b.d-13));
 const q=options[Math.min(options.length-1,Math.floor(rnd()*Math.min(12,options.length)))]||{x:sx,y:sy};
 gameSession.hardEmergency={x:q.x+.5,y:q.y+.5,time:45};
 gameSession.interactables.push({id:'hard-repair',x:gameSession.hardEmergency.x,y:gameSession.hardEmergency.y,type:'repair',title:'REPAIR THE EMERGENCY REACTOR',used:false});
 $('hardEmergency').hidden=false;
 showToast('ALARM · REPAIR REACTOR IN 45 SECONDS',4);
 addNoise(gameSession.hardEmergency.x,gameSession.hardEmergency.y,20,'alarm');playSting();if(typeof createGameSample==='function')createGameSample('metalCrack',.40);
}
function finishHardEmergency(){
 gameSession.hardEmergency=null;gameSession.interactables=gameSession.interactables.filter(o=>o.id!=='hard-repair');
 gameSession.hardNextEmergency=gameSession.elapsed+72+rnd()*48;
 $('hardEmergency').hidden=true;showToast('REACTOR REPAIRED · EMERGENCY RESOLVED',3);playUnlock();
}
function updateHard(dt){
 updateFacility(dt,false);
 if(gameSession.state!=='playing')return;
 if(!gameSession.hardEmergency&&gameSession.elapsed>=gameSession.hardNextEmergency)triggerHardEmergency();
 if(gameSession.hardEmergency){
  gameSession.hardEmergency.time-=dt;
  $('hardEmergencyTime').textContent='00:'+String(Math.max(0,Math.ceil(gameSession.hardEmergency.time))).padStart(2,'0');
  $('hardEmergencyDistance').textContent='DO PANELU: '+Math.round(Math.hypot(gameSession.player.x-gameSession.hardEmergency.x,gameSession.player.y-gameSession.hardEmergency.y))+' M · E';
  if(gameSession.hardEmergency.time<=0){lose('meltdown');return;}
 }
 for(const g of gameSession.guards){
  if(g.frozen)continue;
  if(g.variant==='green'&&gameSession.elapsed>=(g.nextTrail||0)){
   g.nextTrail=gameSession.elapsed+3.6;
   if(gameSession.props.filter(p=>p.type==='hazard'&&p.hardTrail).length<70)
     gameSession.props.push({type:'hazard',hardTrail:true,x:g.x,y:g.y,phase:gameSession.elapsed,size:.80,expires:gameSession.elapsed+28});
  }
  if(g.variant==='yellow'&&gameSession.elapsed>=g.nextPulse&&yellowCanSeePlayer(g)){
   g.nextPulse=gameSession.elapsed+30+rnd()*60;gameSession.hardPulseUntil=gameSession.elapsed+7;
   showToast('ZOLTA ANOMALIA · ZWOLNIONO PLAYERA',3);
   sound(170,.4,'sawtooth',.09,-80);
  }
 }
 gameSession.props=gameSession.props.filter(p=>!p.expires||p.expires>gameSession.elapsed);
 const detected=gameSession.guards.some(g=>g.state==='chase'&&!g.frozen);
 document.body.classList.toggle('hard-detected',detected);
 $('eventTag').textContent=gameSession.hardEmergency?'FAILURE · REPAIR REQUIRED':
   detected?'HARD · MOVEMENT DETECTED':hardSlowActive()?'ENEMIES SLOWED':'HARD '+hardStage()+' · '+HARD_STAGE_NAMES[hardStage()];
}

;
// SOURCE: js/gameplay/inventory.js
// Usable inventory: items remain in the player's possession until explicitly activated.
function ensureInventory(){
 if(!gameSession.player.inventory)gameSession.player.inventory={energy:[],slow:0,freeze:0};
 return gameSession.player.inventory;
}
function updateInventoryUI(){
 const inv=ensureInventory();
 const counters={inventoryDrinkCount:inv.energy.length,inventorySlowCount:gameSession.player.slowCharges||0,inventoryFreezeCount:gameSession.player.freezeCharges||0};
 for(const [id,v] of Object.entries(counters)){const e=$(id);if(e)e.textContent=String(v)}
 const drink=$('inventoryDrinkSprite');
 if(drink&&inv.energy.length)drink.src=ENERGY_DRINK_PNGS[inv.energy[0].energySprite||0];
 for(const [id,n] of [['inventoryDrink',inv.energy.length],['inventorySlow',gameSession.player.slowCharges||0],['inventoryFreeze',gameSession.player.freezeCharges||0]]){
  const e=$(id);if(e){e.disabled=n<1;e.setAttribute('aria-label',id+' · '+n+' szt.')}
 }
 const root=$('activeInventory');if(root)root.classList.toggle('inv-empty',!inv.energy.length&&!inv.slow&&!inv.freeze);
}
function useEnergyDrink(){
 if(gameSession.state!=='playing')return;
 const item=ensureInventory().energy.shift();
 if(!item){showToast('NO ENERGY DRINKS',1.6);return}
 if(item.fakeMonster){
  gameSession.player.energySlowUntil=gameSession.elapsed+2.75;
  showToast('FAKE MONSTER · SPADEK PREDKOSCI NA 2.75 SEKUND',4);
  playSting();
 }else{
  gameSession.player.stamina=Math.min(staminaMax(),(gameSession.player.stamina||0)+85);
  UI.stamina.style.width=staminaWidth();
  showToast('ENERGY DRINK USED · STAMINA RESTORED',2.4);playPickup();
 }
 updateInventoryUI();
}
for(const [id,fn] of [['inventoryDrink',useEnergyDrink],['inventorySlow',useHardSlow],['inventoryFreeze',useHardFreeze]]){
 const button=$(id);if(button)button.addEventListener('click',fn);
}
window.addEventListener('keydown',e=>{
 if(gameSession.state!=='playing'||e.repeat||e.target?.matches?.('input,textarea,select'))return;
 if(e.code==='Digit1')useEnergyDrink();
 if(e.code==='Digit2'||e.code==='KeyZ')useHardSlow();
 if(e.code==='Digit3'||e.code==='KeyX')useHardFreeze();
});

;
// SOURCE: js/network/coop.js
// Solo-only adapter. Original CO-OP implementation is in the developer archive.
const COOP_ENABLED=false;
const coop=Object.freeze({
 role:'solo',active:false,hostPaused:false,remotes:new Map(),
 openLobby(){},send(){return false;},sendAction(){return false;},
 guestFrame(){},hostFrame(){},roundEnd(){},guestEnd(){},avatarSprites(){return [];}
});

;
// SOURCE: js/gameplay/safe-room.js
// One sealed safe room and one coin-operated slot machine per map.
// Local in-game currency only: a spin costs one collectible grosz.

 // Static, GPU-raycast boxes. Each entry: center, dimensions, material. 
const SLOT_REWARD_WEIGHTS=Object.freeze({freeze:15,slow:35,none:50});

function isSafeRoomProtected(){
 return Boolean(gameSession.player&&bossRushRooms().some(room=>!room.open&&
  Math.floor(gameSession.player.x)>=room.left+1&&Math.floor(gameSession.player.x)<=room.left+room.side-2&&
  Math.floor(gameSession.player.y)>=room.top+1&&Math.floor(gameSession.player.y)<=room.top+room.side-2));
}
function pickSafeRoomPosterMaterials(count=3){const pool=[7,8,9,10,11];for(let i=pool.length-1;i>0;i--){const j=Math.floor(mapRandom()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,count)}

function safeRoomMachinePlacement(room){
 const side=room.side;
 const offset=1.12;
 if(room.doorY===room.top){
  return {machineX:room.centerX,machineY:room.top+side-offset,machineYaw:Math.PI,wall:'south'};
 }
 if(room.doorY===room.top+side-1){
  return {machineX:room.centerX,machineY:room.top+offset,machineYaw:0,wall:'north'};
 }
 if(room.doorX===room.left){
  return {machineX:room.left+side-offset,machineY:room.centerY,machineYaw:Math.PI/2,wall:'east'};
 }
 return {machineX:room.left+offset,machineY:room.centerY,machineYaw:-Math.PI/2,wall:'west'};
}

function updateCoinCounter(){
 const el=document.getElementById('coinHudValue');if(el)el.textContent=String(gameSession.player.coins||0);
 const label=document.getElementById('safeRoomLabel');if(label)label.classList.toggle('visible',isSafeRoomProtected());
}
function setupSafeRoomAndCoins(){
 gameSession.safeRoom=null;gameSession.safeRoomFurniture=[];
 if(!Array.isArray(gameSession.bonusItems))gameSession.bonusItems=[];
 if(!Array.isArray(gameSession.interactables))gameSession.interactables=[];
 gameSession.player.coins=0;
 const spawn={x:Math.floor(gameSession.player.x),y:Math.floor(gameSession.player.y)};
 const dist=bfsDistances(spawn.x,spawn.y);
 const important=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards,...(gameSession.level===1&&gameSession.cat?.x!=null?[gameSession.cat]:[]),...gameSession.props.filter(p=>p.type==='hazard'),
   {x:gameSession.exitCell.x+.5,y:gameSession.exitCell.y+.5},{x:gameSession.player.x,y:gameSession.player.y}];
 // Normal procedural mode has a dense connected 4x4 room lattice. Searching
 // exclusively for an unused 9x9 rectangle can fail on some seeds, which was
 // why the slot machine sometimes disappeared entirely. Build a guaranteed
 // 9x9 side annex outside the original eastern boundary instead. The corridor
 // starts at an already reachable floor tile; it only removes old wall cells.
 let annex=null;
 if(gameSession.level===5 && gameSession.N+14<=126){
   const oldN=gameSession.N;
   const usable=[];
   for(let y=6;y<oldN-7;y++)for(let x=3;x<oldN-2;x++){
     if(gameSession.world[y][x]===0&&dist[y][x]>=8)usable.push({x,y,d:dist[y][x]});
   }
   usable.sort((a,b)=>b.x-a.x||Math.abs(a.d-22)-Math.abs(b.d-22));
   const anchor=usable[0];
   if(anchor){
     const side=9, extra=14;
     for(const row of gameSession.world)for(let i=0;i<extra;i++)row.push(1);
     for(let i=0;i<extra;i++)gameSession.world.push(Array(oldN+extra).fill(1));
     gameSession.N=oldN+extra;
     const top=anchor.y-4,left=oldN+3,doorX=left,doorY=anchor.y;
     for(let x=anchor.x+1;x<doorX;x++)gameSession.world[doorY][x]=0;
     gameSession.seen=Array.from({length:gameSession.N},(_,y)=>Array.from({length:gameSession.N},(_,x)=>gameSession.seen[y]?.[x]||false));
     annex={left,top,side,doorX,doorY,centerX:left+side/2,centerY:top+side/2,distance:anchor.d+doorX-anchor.x};
   }
 }
 // The room shares only one controlled entry with the reachable corridors.
 const directions=[{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
 let choices=annex?[annex]:[];
 if(!choices.length)for(const side of [11,9,7,5]){
  choices=[];
  for(let top=2;top+side<gameSession.N-2;top++)for(let left=2;left+side<gameSession.N-2;left++){
   let allWall=true;
   for(let y=top;y<top+side&&allWall;y++)for(let x=left;x<left+side;x++){
    if(gameSession.world[y]?.[x]!==1){allWall=false;break}
   }
   if(!allWall)continue;
   for(const direction of directions){
    const dx=direction.dx,dy=direction.dy;
    const doorX=left+(dx===0?Math.floor(side/2):dx<0?0:side-1);
    const doorY=top+(dy===0?Math.floor(side/2):dy<0?0:side-1);
    const outsideX=doorX+dx,outsideY=doorY+dy;
    const dd=dist[outsideY]?.[outsideX]??-1;
    if(gameSession.world[outsideY]?.[outsideX]!==0||dd<6)continue;
    const centerX=left+side/2,centerY=top+side/2;
    if(important.some(p=>Math.hypot(p.x-centerX,p.y-centerY)<side/2+1))continue;
    choices.push({left,top,side,doorX,doorY,centerX,centerY,distance:dd});
   }
  }
  if(choices.length)break;
 }
 // Fallback: wall off an open 5x5 patch while verifying every old objective
 // remains reachable. Never use a patch that would strand any item or enemy.
 if(!choices.length){
  for(const side of [9,7,5]){
   for(let top=2;top+side<gameSession.N-2;top++)for(let left=2;left+side<gameSession.N-2;left++){
    const cx=left+side/2,cy=top+side/2;
    if(important.some(p=>Math.hypot(p.x-cx,p.y-cy)<side/2+1.25))continue;
    for(const {dx,dy} of directions){
     const doorX=left+(dx===0?side>>1:dx<0?0:side-1);
     const doorY=top+(dy===0?side>>1:dy<0?0:side-1);
     const outsideX=doorX+dx,outsideY=doorY+dy;
     if(gameSession.world[outsideY]?.[outsideX]!==0||dist[outsideY]?.[outsideX]<6)continue;
     const backup=[];
     for(let y=top;y<top+side;y++)for(let x=left;x<left+side;x++){
      backup.push([x,y,gameSession.world[y][x]]);
      gameSession.world[y][x]=(x===left||x===left+side-1||y===top||y===top+side-1)?1:0;
     }
     gameSession.world[doorY][doorX]=4;
     const after=bfsDistances(spawn.x,spawn.y);
     const accessible=important.every(p=>{
       const px=Math.floor(p.x),py=Math.floor(p.y);
       if(after[py]?.[px]>=0)return true;
       if(gameSession.world[py]?.[px]===3)return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>after[py+dy]?.[px+dx]>=0);
       return false;
     });
     for(const [x,y,old] of backup)gameSession.world[y][x]=old;
     if(accessible)choices.push({left,top,side,doorX,doorY,centerX:cx,centerY:cy,distance:dist[outsideY][outsideX]});
    }
   }
   if(choices.length)break;
  }
 }
 if(choices.length){
  choices.sort((a,b)=>Math.abs(a.distance-20)-Math.abs(b.distance-20));
  const room=choices[Math.floor(mapRandom()*Math.min(12,choices.length))];
  for(let y=room.top;y<room.top+room.side;y++)for(let x=room.left;x<room.left+room.side;x++){
   gameSession.world[y][x]=(x===room.left||y===room.top||x===room.left+room.side-1||y===room.top+room.side-1)?8:0;
  }
  gameSession.world[room.doorY][room.doorX]=4;
  const machine=safeRoomMachinePlacement(room);
  const machineX=machine.machineX,machineY=machine.machineY;
  const fireX=room.side>=7?room.centerX+.5:room.left+room.side-1.65;
  const fireY=room.side>=7?room.centerY+.5:room.top+room.side-1.65;
  // Meshes use the exact GLB topology, UVs and colours, not rotating sprites.
  // Only a simplified cabinet bounding box remains for physical collisions.
  gameSession.safeRoom={...room,open:false,machineX,machineY,machineYaw:machine.machineYaw,fireX,fireY,treeX:null,treeY:null,treeYaw:0};
  gameSession.interactables.push({id:'slot-machine',type:'slot',title:'SLOT MACHINE · 1 COIN',x:machineX,y:machineY,used:false});
  const put=(x,y,z,w,d,h,material,collisionOnly=false)=>gameSession.safeRoomFurniture.push({x,y,z,w,d,h,material,collisionOnly});
  put(machineX,machineY,.39,.69,.50,.78,1,true);
  // The imported campfire GLB replaces the previous firepit/flame cubes.
  // Flat posters attached to room walls; no billboard rotation.
  const posterAxis=(room.doorY===room.top||room.doorY===room.top+room.side-1)?'vertical':'horizontal';
  const posterMaterials=pickSafeRoomPosterMaterials(3);
  const posterSizes=[[.70,.50],[.72,.56],[.68,.48]];
  const posterPlacements=posterAxis==='vertical'
   ?[
     {x:room.left+1.03,y:room.top+1.55,vertical:true},
     {x:room.left+1.03,y:room.top+room.side-1.55,vertical:true},
     {x:room.left+room.side-1.03,y:room.centerY,vertical:true}
    ]
   :[
     {x:room.left+1.55,y:room.top+1.03,vertical:false},
     {x:room.left+room.side-1.55,y:room.top+1.03,vertical:false},
     {x:room.centerX,y:room.top+room.side-1.03,vertical:false}
    ];
  posterMaterials.forEach((material,index)=>{const [w,h]=posterSizes[index]||[.70,.50];const cfg=posterPlacements[index];if(!cfg)return;put(cfg.x,cfg.y,.58,cfg.vertical?.028:w,cfg.vertical?w:.028,h,material)});
 }
 // 5–12 coins scattered over walkable, reachable floor cells. Excludes the
 // exit, room, players, opponents, and required pickups.
 const reachable=bfsDistances(spawn.x,spawn.y);
 const available=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||reachable[y][x]<5)continue;
  if(gameSession.safeRoom&&x>=gameSession.safeRoom.left&&x<gameSession.safeRoom.left+gameSession.safeRoom.side&&y>=gameSession.safeRoom.top&&y<gameSession.safeRoom.top+gameSession.safeRoom.side)continue;
  if(important.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.1))continue;
  available.push({x,y});
 }
 for(let i=available.length-1;i>0;i--){const j=Math.floor(mapRandom()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
 const coinCount=5+Math.floor(mapRandom()*8);
 let n=0;
 for(const cell of available){
  if(n>=coinCount)break;
  if(gameSession.bonusItems.some(q=>q.type==='coin'&&Math.hypot(q.x-cell.x-.5,q.y-cell.y-.5)<3))continue;
  gameSession.bonusItems.push({id:'coin-'+n,type:'coin',name:'1 Coin',x:cell.x+.5,y:cell.y+.5,taken:false,quantity:1,phase:mapRandom()*Math.PI*2});n++;
 }
 updateCoinCounter();
}
function pickupCoins(){
 if(!gameSession.player)return;
 let acquired=0;
 for(const coin of gameSession.bonusItems){
  if(coin.type==='coin'&&!coin.taken&&Math.hypot(coin.x-gameSession.player.x,coin.y-gameSession.player.y)<.69&&lineOfSight(gameSession.player.x,gameSession.player.y,coin.x,coin.y)){
   coin.taken=true;acquired++;gameSession.stats.coins=(gameSession.stats.coins||0)+1;gameSession.player.coins=(gameSession.player.coins||0)+1;
  }
 }
 if(acquired){playCoinPickup();showToast('FOUND '+acquired+' GROSZ'+(acquired===1?'':'E'),2);updateCoinCounter();}
}
function safeRoomInteraction(room){
 if(gameSession.state!=='playing'||!bossRushRooms().includes(room)||!lineOfSight(gameSession.player.x,gameSession.player.y,room.doorX+.5,room.doorY+.5,{allowTargetTile:true}))return false;
 const doorDistance=Math.hypot(gameSession.player.x-room.doorX-.5,gameSession.player.y-room.doorY-.5);
 if(doorDistance<1.7){
  if(room.open&&[gameSession.player,...gameSession.guards,...(gameSession.level===1&&gameSession.awake?[gameSession.cat]:[])].some(p=>Math.abs(p.x-room.doorX-.5)<.5+.23&&Math.abs(p.y-room.doorY-.5)<.5+.23)){
    showToast('DOOR BLOCKED · CLEAR THE ENTRY',2.2);return true;
  }
  room.open=!room.open;
  gameSession.world[room.doorY][room.doorX]=room.open?0:4;markWorldChanged();
  playUnlock();showToast(room.open?'SAFE ROOM OPENED':'SAFE ROOM DOOR CLOSED',2.6);
  updateCoinCounter();return true;
 }
 return false;
}
function slotMachineSpin(slot){
 if(gameSession.state!=='playing'||!bossRushRooms().length)return;
 if(!slot||slot.type!=='slot'||!gameSession.interactables.includes(slot)||Math.hypot(gameSession.player.x-slot.x,gameSession.player.y-slot.y)>=1.45||!lineOfSight(gameSession.player.x,gameSession.player.y,slot.x,slot.y,{allowTargetFurniture:true}))return;
 if((gameSession.player.coins||0)<1){showToast('NO COINS · NEED 1',2.5);return;}
 gameSession.player.coins--;updateCoinCounter();playCoinSlot();
 // Independent draw on every paid interaction, exact 15/35/50 bands.
 const roll=Math.random()*100;
 if(roll<15){
  gameSession.player.freezeCharges=(gameSession.player.freezeCharges||0)+1;ensureInventory().freeze=gameSession.player.freezeCharges;
  showToast('777 · WYGRANA: FREEZE DEVICE',3);playWin();
 }else if(roll<50){
  gameSession.player.slowCharges=(gameSession.player.slowCharges||0)+1;ensureInventory().slow=gameSession.player.slowCharges;
  showToast('777 · WYGRANA: SLOW DEVICE',3);playUnlock();
 }else{showToast('NO PRIZE · LOST 1 COIN',2.5);sound(145,.18,'square',.09,-80)}
 updateInventoryUI();
}

;
// SOURCE: js/gameplay/boss-rush.js
// Boss Rush: five physically connected HARD sectors, with one-way progression.
// The WebGPU map buffer is 128x128, so this 121x121 map stays within that limit.
// Every canonical stage cast is doubled, with independent HARD AI and randomly
// assigned champion variants. The player clears objectives, not invincible bosses.
const BOSS_RUSH_LEVEL=12;
const BOSS_RUSH_SIZE=121;
const BOSS_RUSH_STAGE_LEFT=[0,4,27,50,73,96];
const BOSS_RUSH_STAGE_NAMES=['','YELLOW CORRIDORS','FLOODED COMPLEX','BLOODY ZONE','CHRUM SECTOR','LAST ENCOUNTER'];
const BOSS_RUSH_CAST={
  1:['cat','cat'],
  2:['watcher','watcher','listener','listener'],
  3:['cat','cat','watcher','watcher','listener','listener'],
  4:['pig','pig'],
  5:['pig','pig','stranger','stranger']
};
const BOSS_RUSH_GOALS=[0,4,5,6,4,6];
const BOSS_RUSH_PANELS=[0,0,1,2,1,2];


function bossRushArea(x){return Math.max(1,Math.min(5,Math.floor((x-4)/23)+1));}
function bossRushRooms(){return gameSession.level===BOSS_RUSH_LEVEL?gameSession.rushSafeRooms:(gameSession.safeRoom?[gameSession.safeRoom]:[]);}
function bossRushNearestRoom(){
 const rooms=bossRushRooms();
 return rooms.reduce((a,b)=>!a||Math.hypot(gameSession.player.x-b.centerX,gameSession.player.y-b.centerY)<Math.hypot(gameSession.player.x-a.centerX,gameSession.player.y-a.centerY)?b:a,null);
}
function bossRushCarve(x0,y0,w,h){
 for(let y=Math.max(1,y0);y<Math.min(gameSession.N-1,y0+h);y++)for(let x=Math.max(1,x0);x<Math.min(gameSession.N-1,x0+w);x++)gameSession.world[y][x]=0;
}
function bossRushSafeRoom(stage){
 const left=BOSS_RUSH_STAGE_LEFT[stage]+7,top=96,side=11;
 for(let y=top;y<top+side;y++)for(let x=left;x<left+side;x++)
   gameSession.world[y][x]=(x===left||y===top||x===left+side-1||y===top+side-1)?8:0;
 const doorX=left+5,doorY=top;
 bossRushCarve(doorX,84,1,12);
 gameSession.world[doorY][doorX]=4;
 const machineX=left+5.5,machineY=top+side-2.12;
 const room={left,top,side,doorX,doorY,centerX:left+side/2,centerY:top+side/2,
  machineX,machineY,machineYaw:Math.PI,fireX:left+7.5,fireY:top+5.2,treeX:null,treeY:null,treeYaw:0,open:false,rushSector:stage};
 gameSession.rushSafeRooms.push(room);
 gameSession.interactables.push({id:'rush-slot-'+stage,type:'slot',title:'SLOT MACHINE / 1 COIN',x:machineX,y:machineY,used:false,rushSector:stage});
 const add=(x,y,z,w,d,h,material,collisionOnly=false)=>gameSession.safeRoomFurniture.push({x,y,z,w,d,h,material,collisionOnly});
 add(machineX,machineY,.39,.69,.50,.78,1,true);
 const posterMaterials=pickSafeRoomPosterMaterials(3);
 [[left+1.03,top+2.0,.028,.52],[left+1.03,top+side-2.0,.028,.56],[left+side-1.03,top+5.5,.028,.50]].forEach((cfg,index)=>add(cfg[0],cfg[1],.56,cfg[2],.028,cfg[3],posterMaterials[index]));
 return room;
}
function bossRushGenerateMap(){
 gameSession.N=BOSS_RUSH_SIZE;
 gameSession.world=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(1));
 const makeRoom=(cx,cy,w,h)=>bossRushCarve(cx-(w>>1),cy-(h>>1),w,h);
 for(let stage=1;stage<=5;stage++){
  const L=BOSS_RUSH_STAGE_LEFT[stage];
  // Two parallel corridors plus rooms and cross-passages, including dead ends.
  bossRushCarve(L+5,11,2,80);
  bossRushCarve(L+15,11,2,80);
  for(const y of [18,39,60,82]){
    bossRushCarve(L+4,y-1,15,3);
    makeRoom(L+11,y,11+(Math.floor(rnd()*3)*2),9);
  }
  for(const [i,y] of [27,49,72].entries()){
    if((stage+i)%2===0){bossRushCarve(L+3,y,4,2);makeRoom(L+4,y,5,5)}
    else{bossRushCarve(L+16,y,5,2);makeRoom(L+18,y,5,5)}
  }
  // Guaranteed connections from gate approach to the vertical corridors.
  bossRushCarve(L+5,60,14,2);
 }
 for(let stage=1;stage<5;stage++){
  const end=BOSS_RUSH_STAGE_LEFT[stage]+22;
  // The single gate is the only traversable connection between sectors.
  bossRushCarve(end-5,60,11,1);
  gameSession.world[60][end]=4;
 }
 // The fifth green exit is accessible only once ALL sections are complete.
 gameSession.exitCell={x:113,y:85};bossRushCarve(112,82,4,6);gameSession.world[85][113]=3;
}
function bossRushFreeCells(stage){
 const L=BOSS_RUSH_STAGE_LEFT[stage];
 const arr=[];
 for(let y=12;y<93;y++)for(let x=L+3;x<L+20;x++)
  if(gameSession.world[y]?.[x]===0)arr.push({x,y});
 return arr;
}
function bossRushPlaceObjectives(stage){
 const cells=bossRushFreeCells(stage).filter(c=>c.y>22&&c.y<91&&Math.hypot(c.x-9,c.y-18)>9);
 for(let i=cells.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
 const chosen=[];
 const place=(spacing)=>{
  const q=cells.find(c=>chosen.every(p=>Math.hypot(c.x-p.x,c.y-p.y)>spacing)&&
    Math.abs(c.x-(BOSS_RUSH_STAGE_LEFT[stage]+11))<8);
  if(!q)return null;
  chosen.push(q);cells.splice(cells.indexOf(q),1);return q;
 };
 for(let i=0;i<BOSS_RUSH_GOALS[stage];i++){
  const c=place(4)||cells.shift();
  if(c){addCard('rush-'+stage+'-item-'+i,c.x+.5,c.y+.5);gameSession.fuses.at(-1).rushSector=stage;}
 }
 for(let i=0;i<BOSS_RUSH_PANELS[stage];i++){
  const c=place(6)||cells.shift();
  if(c){addControl('rush-'+stage+'-panel-'+i,c.x+.5,c.y+.5,'STEROWNIK SEKCJI '+stage);gameSession.terminals.at(-1).rushSector=stage;}
 }
 // Local coins and consumables; NO natural freeze-device pickups anywhere.
 for(let i=0;i<7;i++){
  const c=place(2.5)||cells.shift();if(!c)break;
  if(i<5)gameSession.bonusItems.push({id:'rush-coin-'+stage+'-'+i,type:'coin',name:'1 GROSZ',x:c.x+.5,y:c.y+.5,taken:false,quantity:1,phase:rnd()*TAU});
  else addPickup('rush-drink-'+stage+'-'+i,c.x+.5,c.y+.5,'stamina','ENERGY DRINK');
 }
 for(let i=0;i<4;i++){
  const c=place(2)||cells.shift();if(!c)continue;
  if(i===0)addPickup('rush-slow-'+stage,c.x+.5,c.y+.5,'hardSlow','SLOW DEVICE');
  else if(i===1)addPickup('rush-energy-'+stage,c.x+.5,c.y+.5,'stamina','ENERGY DRINK',1);
  else gameSession.props.push({type:'blood',x:c.x+.5,y:c.y+.5,phase:rnd()*TAU,size:.8});
 }
}
function bossRushSpawn(stage){
 const kinds=BOSS_RUSH_CAST[stage];const L=BOSS_RUSH_STAGE_LEFT[stage];
 for(let i=0;i<kinds.length;i++){
  const x=L+(i%2===0?6.5:16.5),y=31+Math.floor(i/2)*19;
  // CLASSIC is still an enhanced HARD opponent; no pink splitting in Boss Rush,
  // so the number of physical bosses is exactly twice the original cast.
  const variants=['red','green','yellow','gray','classic'];
  const variant=variants[Math.floor(rnd()*variants.length)];
  const g=assignChampion(makeGuard(x,y,kinds[i],{x0:L+3,y0:11,x1:L+19,y1:90}),variant);
  g.hardEnhanced=true;g.rushSector=stage;g.rushBoss=true;
  gameSession.guards.push(g);
 }
}
function bossRushScatterRocks(stage){
 const L=BOSS_RUSH_STAGE_LEFT[stage];
 const reserved=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards].filter(o=>o.rushSector===stage||o.x>=L&&o.x<L+21);
 const spots=[];
 for(let y=13;y<90;y++)for(let x=L+3;x<L+20;x++){
  if(gameSession.world[y][x]!==0||[17,18,39,40,60,61,82,83].includes(y))continue;
  if(reserved.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.0))continue;
  // Avoid the two primary longitudinal corridors and any tight chokepoints.
  if([L+5,L+6,L+15,L+16].includes(x))continue;
  const orth=[[1,0],[-1,0],[0,1],[0,-1]];
  if(orth.some(([dx,dy])=>gameSession.world[y+dy]?.[x+dx]!==0))continue;
  let localOpen=0;for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)if(gameSession.world[y+oy]?.[x+ox]===0)localOpen++;
  if(localOpen<8)continue;
  spots.push({x,y});
 }
 for(let i=spots.length-1;i>0;i--){let j=Math.floor(rnd()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]];}
 let count=0;
 for(const p of spots){
  if(count>=7)break;
  if(gameSession.hardRocks.some(r=>Math.hypot(r.x-p.x-.5,r.y-p.y-.5)<3))continue;
  gameSession.world[p.y][p.x]=5;
  const d=bfsDistances(7,18);
  const exitsConnected=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>d[gameSession.exitCell.y+dy]?.[gameSession.exitCell.x+dx]>=0);
  const reservedConnected=reserved.every(q=>d[Math.floor(q.y)]?.[Math.floor(q.x)]>=0);
  if(!exitsConnected||!reservedConnected){gameSession.world[p.y][p.x]=0;continue;}
  const rock={type:'rock',x:p.x+.5,y:p.y+.5,size:.58+rnd()*.10,phase:rnd()*TAU};
  gameSession.hardRocks.push(rock);gameSession.props.push(rock);count++;
 }
}
function resetBossRush(){
 // Five sectors on one persistent map, not five separate scene loads.
 document.body.classList.remove('level2','final-level','pig-level','procedural-level','sector-five');
 document.body.classList.add('hard-level','boss-rush-level');
 gameSession.bossRush=null;
 const runSeed=requestedSeed!=null?(requestedSeed|0):((Date.now()^Math.floor(Math.random()*2147483647))|0);
 requestedSeed=null;seed=runSeed;
 bossRushGenerateMap();
 gameSession.doors=[];gameSession.fuses=[];gameSession.terminals=[];gameSession.interactables=[];gameSession.bonusItems=[];gameSession.props=[];gameSession.guards=[];gameSession.hardRocks=[];
 gameSession.safeRoom=null;gameSession.safeRoomFurniture=[];gameSession.rushSafeRooms=[];
 gameSession.GOAL=BOSS_RUSH_GOALS.reduce((a,b)=>a+b,0);
 const stageProgress=[];
 // Safe rooms exist only in sectors 1, 3, 5.
 for(let stage=1;stage<=5;stage++){
  bossRushPlaceObjectives(stage);
  if(stage===1||stage===3||stage===5)bossRushSafeRoom(stage);
  stageProgress.push({stage,items:BOSS_RUSH_GOALS[stage],panels:BOSS_RUSH_PANELS[stage],cleared:false});
 }
 prepareEnergyDrinkLottery();
 // Position player at the entrance before creating enemy AI.
 gameSession.player={x:9.5,y:18.5,a:0,pitch:0,stamina:isHardMode()?150:100,maxStamina:isHardMode()?150:100,collected:0,moving:false,flash:true,hidden:false,hp:100,maxHp:100};
 for(let stage=1;stage<=5;stage++)bossRushSpawn(stage);
 for(let stage=1;stage<=5;stage++)bossRushScatterRocks(stage);
 gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(false));
 commonFacilityReset();
 gameSession.player.x=9.5;gameSession.player.y=18.5;
 gameSession.player.inventory={energy:[],slow:0,freeze:0};gameSession.player.slowCharges=0;gameSession.player.freezeCharges=0;gameSession.player.coins=0;
 gameSession.player.shieldUntil=0;
 gameSession.safeRoom=gameSession.rushSafeRooms[0];
 gameSession.bossRush={stage:1,progress:stageProgress,doors:[26,49,72,95].map((x,i)=>({id:'boss-gate-'+(i+1),x,y:60,stage:i+1,open:false})),seed:runSeed>>>0};
 for(const gate of gameSession.bossRush.doors)gameSession.doors.push({id:gate.id,x:gate.x,y:gate.y,open:false,requires:{},title:'SECTION GATE '+(gate.stage+1),bossGate:true});
 gameSession.hardSlowUntil=0;gameSession.hardPulseUntil=0;gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;
 chooseSpawnView();updateSeen();
 $('seedChip').style.display='block';$('seedText').textContent=String(gameSession.bossRush.seed);
 $('levelLabel').textContent='BOSS RUSH / YELLOW CORRIDORS';
 $('hardEmergency').hidden=true;
 $('eventTag').textContent='BOSS RUSH · SEKCJA 1/5';
 updateInventoryUI();updateCoinCounter();updateBossRushHUD();
 showToast('BOSS RUSH · 5 SEKCJI · 18 BOSSOW · NO HP REGENERATION',5);
}
function bossRushStageComplete(stage){
 return gameSession.fuses.filter(f=>f.rushSector===stage).every(f=>f.taken)&&
    gameSession.terminals.filter(t=>t.rushSector===stage).every(t=>t.used);
}
function updateBossRushHUD(){
 if(!gameSession.bossRush)return;
 const s=gameSession.bossRush.stage;
 const all=gameSession.fuses.filter(f=>f.rushSector===s),owned=all.filter(f=>f.taken).length;
 const panels=gameSession.terminals.filter(t=>t.rushSector===s),active=panels.filter(t=>t.used).length;
 UI.goal.textContent='SEKCJA '+s+'/5 · '+owned+'/'+all.length+' · PANELS '+active+'/'+panels.length;
 $('eventTag').textContent='BOSS RUSH · '+BOSS_RUSH_STAGE_NAMES[s]+' · BEZ REGENERACJI';
}
function updateBossRush(dt){
 // Reuse the proven facility gameplay and collision/interactions, but only
 // activate enemies inside the current stage (the remaining casts stay put).
 updateFacility(dt,false);
 if(gameSession.state!=='playing'||!gameSession.bossRush)return;
 const old=gameSession.bossRush.stage;
 const actual=bossRushArea(gameSession.player.x);
 gameSession.bossRush.stage=Math.max(old,actual);
 if(actual!==old){
  $('levelLabel').textContent='BOSS RUSH / '+BOSS_RUSH_STAGE_NAMES[gameSession.bossRush.stage];
  showToast('SEKCJA '+gameSession.bossRush.stage+'/5 · '+BOSS_RUSH_STAGE_NAMES[gameSession.bossRush.stage],4);
  playUnlock();
 }
 const s=gameSession.bossRush.stage;
 if(s<5&&bossRushStageComplete(s)&&!gameSession.bossRush.progress[s-1].cleared){
  gameSession.bossRush.progress[s-1].cleared=true;
  const gate=gameSession.bossRush.doors[s-1];gate.open=true;gameSession.world[gate.y][gate.x]=0;markWorldChanged();
  const door=gameSession.doors.find(d=>d.id===gate.id);if(door)door.open=true;
  playUnlock();showToast('SEKCJA '+s+' COMPLETE · GATE OPENED '+(s+1),4);
 }
 for(const g of gameSession.guards){
  if(g.rushSector!==s||g.frozen)continue;
  if(g.variant==='green'&&gameSession.elapsed>=(g.nextTrail||0)){
   g.nextTrail=gameSession.elapsed+4;
   if(gameSession.props.filter(p=>p.type==='hazard'&&p.hardTrail).length<50)
      gameSession.props.push({type:'hazard',hardTrail:true,x:g.x,y:g.y,size:.74,expires:gameSession.elapsed+25});
  }
  if(g.variant==='yellow'&&gameSession.elapsed>=g.nextPulse&&yellowCanSeePlayer(g)){
   g.nextPulse=gameSession.elapsed+30+rnd()*60;gameSession.hardPulseUntil=gameSession.elapsed+7;
   showToast('YELLOW ANOMALY · SLOWED',3);
  }
 }
 gameSession.props=gameSession.props.filter(p=>!p.expires||p.expires>gameSession.elapsed);
 document.body.classList.toggle('hard-detected',gameSession.guards.some(g=>g.rushSector===s&&g.state==='chase'&&!g.frozen));
 updateBossRushHUD();
}

;
// SOURCE: js/gameplay/custom-mode.js
// Custom solo game, no campaign progress/achievements granted.
// Reuses the proven connected HARD dungeon generator and enemy AI.
function readCustomGameForm(){
 const requestedStage=Number($('customTheme').value);
 const stage=[1,2,3,4,5].includes(requestedStage)?requestedStage:1;
 const size=[49,65,81,97,121].includes(Number($('customSize').value))?Number($('customSize').value):65;
 const difficulty=$('customDifficulty').value==='hard'?'hard':'normal';
 const safeRooms=$('customSafeRooms').checked;
 const enemies=[];
 for(const input of document.querySelectorAll('#customEnemyGrid select[data-enemy]')){
  if(!['cat','watcher','listener','pig','stranger'].includes(input.dataset.enemy))continue;
  const n=Math.floor(clamp(Number(input.value)||0,0,3));
  for(let i=0;i<n;i++)enemies.push(input.dataset.enemy);
 }
 const rawSeed=$('customSeed')?.value?.trim();const fixedSeed=rawSeed&&Number.isInteger(Number(rawSeed))&&Number(rawSeed)>=0&&Number(rawSeed)<=4294967295?Number(rawSeed):null;
 customGameConfig={stage,size,difficulty,safeRooms,enemies:enemies.slice(0,12),fixedSeed,drinks:Math.floor(clamp(Number($('customDrinks')?.value)||0,0,3)),loot:$('customLoot')?.checked!==false,dark:!!$('customDark')?.checked,emergencies:$('customEmergency')?.checked!==false};
 if(!customGameConfig.enemies.length)customGameConfig.enemies=['cat'];
 return customGameConfig;
}
function customGameLineup(){
 const c=customGameConfig;
 if(c.difficulty==='normal')return c.enemies.map(kind=>[kind,'classic']);
 const variants=HARD_CHAMPION_VARIANTS;
 const ordinaryIndex=rnd()<.4?Math.floor(rnd()*c.enemies.length):-1;
 return c.enemies.map((kind,i)=>[kind,i===ordinaryIndex?'classic':variants[Math.floor(rnd()*variants.length)]]);
}
function resetCustomGame(){
 resetHard();
 document.body.classList.toggle('hard-level',customGameConfig.difficulty==='hard');
 document.body.classList.add('custom-level');
 if(customGameConfig.difficulty==='normal'){
  gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;
  $('hardEmergency').hidden=true;
 }
 $('levelLabel').textContent='CUSTOM GAME / '+HARD_STAGE_NAMES[customGameConfig.stage];
 $('eventTag').textContent='CUSTOM GAME · '+customGameConfig.size+' x '+customGameConfig.size;
}

function applyCustomOptions(){
 const c=customGameConfig,p=gameSession.player;
 if(c.loot===false)gameSession.bonusItems=gameSession.bonusItems.filter(x=>x.type==='coin'||x.type==='key');
 if(c.dark)p.flash=false;
 if(c.emergencies===false){gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;}
 for(let i=0;i<(c.drinks||0);i++)ensureInventory().energy.push({energySprite:0,fakeMonster:false});
}

;
// SOURCE: js/gameplay/decor.js
// Environment props are generated after the map, objectives and safe rooms.
// A floor prop occupies exactly one existing floor tile (5 = solid mesh tile).
// Preserve connectivity constructively: every incident edge of the removed
// tile must have a replacement path in its eight-cell ring. By induction,
// adding any number of these props cannot disconnect any original component.
const DECOR_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function decorFloorAllowed(world,x,y){
 if(world[y]?.[x]!==0)return false;
 const open=(xx,yy)=>world[yy]?.[xx]===0;
 const neighbors=DECOR_DIRS.map(([dx,dy])=>[x+dx,y+dy]).filter(([xx,yy])=>open(xx,yy));
 if(neighbors.length<3)return false;
 let count=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))count++;
 if(count<7)return false; // never a single-width corridor or narrow corner
 const seen=new Set(),queue=[neighbors[0]];seen.add(neighbors[0].join(','));
 for(let i=0;i<queue.length;i++)for(const [dx,dy] of DECOR_DIRS){
  const nx=queue[i][0]+dx,ny=queue[i][1]+dy,key=nx+','+ny;
  if(Math.abs(nx-x)>1||Math.abs(ny-y)>1||(nx===x&&ny===y)||!open(nx,ny)||seen.has(key))continue;
  seen.add(key);queue.push([nx,ny]);
 }
 return neighbors.every(p=>seen.has(p.join(',')));
}
function decorModelsFor(stage){return Object.keys(DECOR_MODELS).filter(k=>stage===5||DECOR_MODELS[k].stage===stage);}
// Smaller loose props stay inside the existing collision tile, even on their side.
// Imported box/CRT meshes have symmetric local Y extents and a floor origin.
function looseDecorPose(kind,spec,random){
 const size=(kind==='box'?.48:.55)+random()*.12;
 const yaw=random()*Math.PI*2;
 const tilt=random()<.38?(random()<.5?-1:1)*Math.PI/2:0;
 const z=tilt?spec.depth*size:0;
 const radius=(tilt?Math.hypot(spec.radius,spec.height):spec.radius)*size;
 const jitter=Math.max(0,.44-radius);
 return {size,yaw,tilt,z,dx:(random()*2-1)*jitter,dy:(random()*2-1)*jitter,radius};
}
function scatterLevelDecor(){
 const s=gameSession,world=s.world,N=s.N;
 // Independent random stream: decor must not change enemy or loot RNG.
 let decorSeed=(seed^0x5f3759df^s.level)|0;
 const random=()=>{decorSeed=(Math.imul(decorSeed,1664525)+1013904223)|0;return (decorSeed>>>0)/4294967296;};
 let poseSeed=(decorSeed^0x6d2b79f5)|0;
 const poseRandom=()=>{poseSeed=(Math.imul(poseSeed,1664525)+1013904223)|0;return (poseSeed>>>0)/4294967296;};
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const rooms=s.level===12?s.rushSafeRooms:s.safeRoom?[s.safeRoom]:[];
 const reserved=[s.player,...s.guards,...s.fuses,...s.terminals,...s.interactables,...s.bonusItems,...s.props.filter(p=>p.type==='hazard'||p.type==='rock'),...(s.level===1?[s.cat]:[]),{x:s.exitCell.x+.5,y:s.exitCell.y+.5},...s.doors.map(d=>({x:d.x+.5,y:d.y+.5})),...rooms.map(r=>({x:r.doorX+.5,y:r.doorY+.5}))].filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y));
 const inRoom=(x,y)=>rooms.some(r=>x>=r.left-1&&x<=r.left+r.side&&y>=r.top-1&&y<=r.top+r.side);
 const placed=[];
 for(const stage of s.level===12?[1,2,3,4,5]:[renderStage()]){
  const cells=[];
  for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
   if(world[y][x]!==0||inRoom(x,y)||(s.level===12&&bossRushArea(x)!==stage))continue;
   if(reserved.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.0))continue;
   // Gates, exits and safe-room approaches must never be occupied.
   if(DECOR_DIRS.some(([dx,dy])=>[3,4,8].includes(world[y+dy]?.[x+dx])))continue;
   cells.push({x,y});
  }
  shuffle(cells);
  const keys=decorModelsFor(stage),plan=[];
  // Give each supplied model a chance before repeats. Last Encounter mixes
  // the old sectors with its own, giving its native objects extra weight.
  for(let pass=0;pass<(stage===5?1:3);pass++)plan.push(...shuffle(keys.slice()));
  if(stage===5){plan.push('mannequin','lastClock','mannequin','lastClock');if(s.level!==12)plan.push(...shuffle(keys.slice()));}
  if(stage!==5&&s.level!==12&&N>=65)plan.push(...shuffle(keys.slice()));
  for(const kind of plan){
   const spec=DECOR_MODELS[kind];if(!spec)continue;
   if(spec.triangles>8000&&placed.filter(p=>p.model===kind&&p.stage===stage).length>=2)continue;
   const isWall=spec.placement==='wall';
   let selected=null;
   for(const cell of cells){
    const {x,y}=cell;if(world[y][x]!==0)continue;
    if(placed.some(p=>Math.hypot(p.cellX-x,p.cellY-y)<2.6))continue;
    const walls=DECOR_DIRS.filter(([dx,dy])=>world[y+dy]?.[x+dx]===1);
    if(isWall){if(!walls.length)continue;selected={...cell,wall:walls[Math.floor(random()*walls.length)]};break;}
    if(!decorFloorAllowed(world,x,y))continue;
    selected=cell;break;
   }
   if(!selected)continue; // safe skip, never force a prop into a passage
   const {x,y,wall}=selected;let px=x+.5,py=y+.5,z=0,yaw=Math.floor(random()*4)*Math.PI/2;
   let size=1,tilt=0,radius=spec.radius; // converter bounds each floor object within its collision tile
   if(isWall){const [dx,dy]=wall;const offset=.5-spec.depth-.035;px+=dx*offset;py+=dy*offset;z=kind==='camera'?1-spec.height-.025:.78-spec.height/2;yaw=Math.atan2(-dx,dy);}
   else {
    world[y][x]=5;
    if(kind==='box'||kind==='crt'){
     const pose=looseDecorPose(kind,spec,poseRandom);
     px+=pose.dx;py+=pose.dy;z=pose.z;yaw=pose.yaw;size=pose.size;tilt=pose.tilt;radius=pose.radius;
    }
   }
   const prop={type:'decor',model:kind,x:px,y:py,z,yaw,size,tilt,radius,stage,cellX:x,cellY:y,solid:!isWall};
   placed.push(prop);s.props.push(prop);
  }
 }
 s.worldRevision++;
 return placed;
}

;
// SOURCE: js/engine/modes.js
// Mode IDs remain compatible with existing save keys, seeds and developer commands.
// Reset and simulation strategy are selected from the same registry.
const modeDefinition=(name,generate,step,roomPolicy='shared')=>Object.freeze({name,generate,step,roomPolicy});
const normalFacilityStep=dt=>updateFacility(dt,false);
const hardModeDefinition=modeDefinition('hard',()=>resetHard(),dt=>updateHard(dt));
const modeDefinitions=Object.freeze({
 1:modeDefinition('normal-1',()=>resetBase(),dt=>updateBase(dt)),
 2:modeDefinition('normal-2',()=>resetLevel2(),normalFacilityStep),
 3:modeDefinition('normal-3',()=>resetLevel3(),dt=>updateFacility(dt,true)),
 4:modeDefinition('normal-4',()=>resetLevel4(),normalFacilityStep),
 5:modeDefinition('procedural',()=>resetProcedural(),normalFacilityStep),
 6:hardModeDefinition,7:hardModeDefinition,8:hardModeDefinition,9:hardModeDefinition,
 10:modeDefinition('normal-5',()=>resetLevel5(),normalFacilityStep),11:hardModeDefinition,
 12:modeDefinition('boss-rush',()=>resetBossRush(),dt=>updateBossRush(dt),'owned'),
 13:modeDefinition('custom',()=>resetCustomGame(),dt=>{if(isHardMode())updateHard(dt);else normalFacilityStep(dt);},'optional')
});
function modeFor(id){const mode=modeDefinitions[id];if(!mode)throw new RangeError('Unknown game mode '+id);return mode;}
function resolveRunEntry(target,difficulty,customStage=1){
 if(!Number.isInteger(target)||target<1||target>13)return null;
 const stage=target===13?customStage:target===12?0:target===10||target===11?5:target>=6&&target<=9?target-5:target;
 const hard=target===12||target===11||(target>=6&&target<=9)||(difficulty==='hard'&&stage>=1&&stage<=4);
 const id=target===13||target===12?target:hard?(stage===5?11:stage+5):target;
 return {id,stage,hard};
}
function reset(){
 gameSession.resetRound();
 sessionTimers.clear('death');$('jump').classList.remove('show');
 resetSimulationClock();
 clearModeClasses();$('hardEmergency').hidden=true;
 // Avoid stale UI diff caches when returning to a mode with the same counters.
 delete $('missionDetails').dataset.stats;delete $('stealthStatus').dataset.stealth;
 const mode=modeFor(gameSession.level);mode.generate();
 if(mode.roomPolicy==='owned'){scatterLevelDecor();return;}
 if(mode.roomPolicy==='optional'&&!customGameConfig.safeRooms){gameSession.player.coins=0;updateCoinCounter();scatterLevelDecor();return;}
 setupSafeRoomAndCoins();
 if(mode.roomPolicy==='optional'){
  for(let attempt=0;attempt<7&&!gameSession.safeRoom;attempt++){
   gameSession.safeRoomFurniture=[];mode.generate();setupSafeRoomAndCoins();
  }
  if(!gameSession.safeRoom)showToast('COULD NOT PLACE SAFE ROOM: CHOOSE A LARGER MAP',3);
 }
 scatterLevelDecor();
}
function update(dt){modeFor(gameSession.level).step(dt);}

;
// SOURCE: js/engine/loop.js
// Fixed 60 Hz simulation with bounded catch-up and render-only interpolation.
class FixedStepClock {
 constructor(hz=60,maxFrame=.25){
  this.step=1/hz;this.maxFrame=maxFrame;this.accumulator=0;this.ticks=0;this.droppedSeconds=0;
 }
 reset(){this.accumulator=0;}
 advance(dt,active,step){
  if(!active()){this.reset();return 0;}
  if(!Number.isFinite(dt)||dt<=0)return 0;
  const accepted=Math.min(this.maxFrame,dt);this.droppedSeconds+=dt-accepted;this.accumulator+=accepted;
  let count=0;
  while(this.accumulator+1e-10>=this.step&&active()){
   this.accumulator=Math.max(0,this.accumulator-this.step);
   count++;this.ticks++;step(this.step);
  }
  if(!active())this.reset();
  return count;
 }
 get alpha(){return Math.min(1,Math.max(0,this.accumulator/this.step));}
}
const simulationClock=new FixedStepClock();
let lastTime=0,fpsWindowStart=0,fpsWindowFrames=0,lastRenderTime=-Infinity,lastRenderState=null;
function resetSimulationClock(){simulationClock.reset();gameSession.resetInterpolation();lastTime=performance.now();}
function advanceSimulation(dt){
 simulationClock.advance(dt,()=>gameSession.state==='playing',step=>{
  gameSession.beginStep();
  if(coop.role==='guest')coop.guestFrame(step);else{update(step);if(gameSession.state==='playing')coop.hostFrame(step);}
  if(gameSession.state==='playing')gameSession.endStep();
 });
 gameSession.renderAlpha=simulationClock.alpha;
}
function tick(time){
 requestAnimationFrame(tick);
 if(!fpsWindowStart)fpsWindowStart=time;
 if(time-fpsWindowStart>=650){const fps=Math.round(fpsWindowFrames*1000/(time-fpsWindowStart));const el=$('fpsCounter');if(el)el.textContent=fps+' FPS';fpsWindowStart=time;fpsWindowFrames=0;}
 const dt=Math.max(0,(time-lastTime)/1000);lastTime=time;
 advanceSimulation(dt);if(gameSession.state==='playing'&&typeof profilePeriodicCheckpoint==='function')profilePeriodicCheckpoint();syncGameAudio(Math.min(.25,dt));
 if(typeof syncDecorativeHUD==='function')syncDecorativeHUD(time);
 if(typeof syncDetectionHUD==='function')syncDetectionHUD();
 if(gameSession.state==='playing'&&$('mapClock'))$('mapClock').textContent=formatTime(gameSession.clock);
 if(gameSession.state==='menu')gameSession.elapsed+=Math.min(.25,dt)*.25;
 const changed=lastRenderState!==gameSession.state,requested=typeof gpuRenderer!=='undefined'&&gpuRenderer?.needsRender;
 if(gameSession.state==='playing'&&(changed||!gameSettings.fpsLimit||time-lastRenderTime>=1000/gameSettings.fpsLimit-.5)||gameSession.state==='menu'&&(changed||requested||time-lastRenderTime>=1000/24)||gameSession.state==='paused'&&(changed||requested)){
  render();lastRenderTime=time;fpsWindowFrames++;
 }
 lastRenderState=gameSession.state;
}

;
// SOURCE: js/ui/interface.js
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
 gameSession.state=next;document.body.classList.toggle('menu-scene',next==='menu');if(typeof updateRoundInterface==='function')updateRoundInterface(next);UI.hud.classList.toggle('show',next==='playing');
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

function resume(){if(gameSession.state!=='paused'||!graphicsReadyForPlay())return;if(coop.role==='guest'&&coop.hostPaused){showToast('WAIT FOR THE HOST TO RESUME',2);return;}setState('playing');if(coop.role==='host'&&coop.active)coop.send({type:'pause',paused:false});resetSimulationClock();if(!isCoarse)requestGamePointerLock();}

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

;
// SOURCE: js/ui/settings.js
// One settings system for menu, pause and HUD. Main-menu settings are now scrollable inline.
(function setupSettings(){
 const byId=id=>document.getElementById(id);
 const panel=byId('settingsPanel');
 const rangeSpec={
  fov:{prop:'fov',key:'catroomsCfgFov',format:v=>String(Math.round(v))+'°',normalize:v=>Math.round(v),ids:['settingFov','menuSettingFov']},
  mouse:{prop:'mouseSensitivity',key:'catroomsCfgMouse',format:v=>Number(v).toFixed(2)+'×',ids:['settingMouse','menuSettingMouse']},
  touch:{prop:'touchSensitivity',key:'catroomsMobileLookSensitivity',format:v=>Number(v).toFixed(2)+'×',ids:['settingTouch','menuSettingTouch']},
  master:{prop:'master',key:'catroomsCfgMaster',format:v=>Math.round(v)+'%',ids:['settingMaster','menuSettingMaster']},
  effects:{prop:'effects',key:'catroomsCfgEffects',format:v=>Math.round(v)+'%',ids:['settingEffects','menuSettingEffects']},
  voices:{prop:'voices',key:'catroomsCfgVoices',format:v=>Math.round(v)+'%',ids:['settingVoices','menuSettingVoices']},
  ambient:{prop:'ambient',key:'catroomsCfgAmbient',format:v=>Math.round(v)+'%',ids:['settingAmbient','menuSettingAmbient']},
  jumpscare:{prop:'jumpscare',key:'catroomsCfgJumpscare',format:v=>Math.round(v)+'%',ids:['settingJumpscare','menuSettingJumpscare']}
 };
 const keys=['hd','lighting','shadows','geometry','flashlight','post'];
 const defaults={hd:true,lighting:true,shadows:true,geometry:false,flashlight:true,post:true};
 const presets={potato:[.5,false,false,false,false,false,false],low:[.7,false,true,false,false,true,false],medium:[.85,true,true,false,false,true,true],high:[1,true,true,true,false,true,true],ultra:[1.2,true,true,true,true,true,true]};
 let prefs={...defaults};try{const saved=JSON.parse(progressRead('catroomsGfx09','{}'));for(const k of keys)if(typeof saved?.[k]==='boolean')prefs[k]=saved[k];}catch(e){}
 gameSettings.fpsLimit=Number(progressRead('catroomsGfxLimit','0'));if(![0,30,60,120,144,165,240].includes(gameSettings.fpsLimit))gameSettings.fpsLimit=0;
 const ids=suffix=>['setting'+suffix,'menuSetting'+suffix];
 function saveGraphics(){progressWrite('catroomsGfx09',JSON.stringify(prefs));}
 function applyGraphics(){const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;if(!r)return;
  if(r.hdMaterials&&r.hdEnabled!==prefs.hd){if(r.terrainBind)r.toggleHdMaterials();else r.hdEnabled=prefs.hd;}
  r.lightingEnabled=prefs.lighting;r.wallShadowsEnabled=prefs.shadows;r.flashlightEnabled=prefs.flashlight;
  if(r.worldGeometry?.available&&r.worldGeometry.enabled!==prefs.geometry)r.worldGeometry.toggle();
  if(r.post&&r.post.enabled!==prefs.post){r.post.enabled=prefs.post;r.post.reset=true;r.post.lastTime=null;}
  r.needsRender=true;
 }
 function syncGraphics(){const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;
  for(const k of keys)forEachExisting(ids('Gfx'+k),el=>{el.checked=prefs[k];el.disabled=!!r&&((k==='hd'&&!r.hdMaterials)||(k==='geometry'&&!r.worldGeometry?.available)||(k==='post'&&!r.post));});
  const match=Object.keys(presets).find(k=>presets[k][0]===gameSettings.quality&&keys.every((key,i)=>prefs[key]===presets[k][i+1]))||'custom';
  forEachExisting(ids('Preset'),el=>el.value=match);forEachExisting(ids('Limit'),el=>el.value=String(gameSettings.fpsLimit));
 }
 for(const k of keys)forEachExisting(ids('Gfx'+k),el=>el.addEventListener('change',()=>{prefs[k]=el.checked;saveGraphics();applyGraphics();sync();}));
 forEachExisting(ids('Preset'),el=>el.addEventListener('change',()=>{const p=presets[el.value];if(!p)return;keys.forEach((k,i)=>prefs[k]=p[i+1]);saveGraphics();applyGraphics();changeQuality(p[0]);}));
 forEachExisting(ids('Limit'),el=>el.addEventListener('change',()=>{gameSettings.fpsLimit=Number(el.value);progressWrite('catroomsGfxLimit',String(gameSettings.fpsLimit));sync();}));
 function captureGraphics(){const r=gpuRenderer;if(!r)return;if(r.hdMaterials)prefs.hd=r.hdEnabled;if(r.worldGeometry?.available)prefs.geometry=r.worldGeometry.enabled;if(r.post)prefs.post=r.post.enabled;prefs.lighting=r.lightingEnabled;prefs.shadows=r.wallShadowsEnabled;prefs.flashlight=r.flashlightEnabled;saveGraphics();sync();}
 window.CatroomsGraphicsPreferences={apply:applyGraphics,capture:captureGraphics};
 const qualityIds=['settingQuality','menuSettingQuality'];
 const fpsIds=['settingFPS','menuSettingFPS'];
 const controlsIds=['settingControls','menuSettingControls'];
 function forEachExisting(ids,callback){
  for(const id of ids){const el=byId(id);if(el)callback(el,id);} 
 }
 function updateOutputs(ids,text){
  for(const id of ids){const out=byId(id+'Out');if(out)out.textContent=text;}
 }
 function sync(){
  syncGraphics();
  for(const spec of Object.values(rangeSpec)){
   const value=gameSettings[spec.prop];
   forEachExisting(spec.ids,input=>{input.value=String(value);});
   updateOutputs(spec.ids,spec.format(value));
  }
  forEachExisting(qualityIds,el=>{el.value=String(gameSettings.quality);});
  forEachExisting(fpsIds,el=>{el.checked=!!gameSettings.showFPS;});
  forEachExisting(controlsIds,el=>{el.checked=!!showControlHints;});
  const fps=byId('fpsCounter');if(fps)fps.style.display=gameSettings.showFPS?'block':'none';
 }
 function changeQuality(value){
  gameSettings.quality=value;progressWrite('catroomsCfgQuality',String(value));
  if(typeof resize==='function'&&window.CatroomsGraphicsStatus?.backend!=='initializing')resize();
  sync();
 }
 for(const spec of Object.values(rangeSpec)){
  forEachExisting(spec.ids,input=>{
   input.addEventListener('input',()=>{
    gameSettings[spec.prop]=spec.normalize?spec.normalize(Number(input.value)):Number(input.value);
    if(spec.prop==='fov'&&typeof gpuRenderer!=='undefined'&&gpuRenderer)gpuRenderer.needsRender=true;
    progressWrite(spec.key,String(gameSettings[spec.prop]));
    updateOutputs(spec.ids,spec.format(gameSettings[spec.prop]));
    if(['master','effects','voices','ambient','jumpscare'].includes(spec.prop))refreshAudioMix();
   });
  });
 }
 forEachExisting(qualityIds,el=>el.addEventListener('change',e=>changeQuality(Number(e.target.value))));
 forEachExisting(fpsIds,el=>el.addEventListener('change',e=>{
  gameSettings.showFPS=e.target.checked;progressWrite('catroomsCfgFPS',e.target.checked?'1':'0');sync();
 }));
 forEachExisting(controlsIds,el=>el.addEventListener('change',e=>setControlsHintsPreference(e.target.checked)));
 function show(){
  if(gameSession.state==='playing')pause();
  sync();
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  const closeBtn=byId('settingsCloseBtn');if(closeBtn)closeBtn.focus();
 }
 function hide(){
  panel.classList.remove('open');panel.setAttribute('aria-hidden','true');
  if(gameSession.state==='paused'&&byId('settingsPauseBtn'))byId('settingsPauseBtn').focus();
  else if(gameSession.state==='menu'&&byId('pixelNavSettings'))byId('pixelNavSettings').focus();
 }
 for(const id of ['settingsMenuBtn','settingsPauseBtn','settingsHudBtn']){const el=byId(id);if(el)el.addEventListener('click',show);}
 for(const id of ['settingsCloseBtn','settingsDoneBtn']){const el=byId(id);if(el)el.addEventListener('click',hide);}
 if(panel)panel.addEventListener('click',e=>{if(e.target===panel)hide();});
 document.addEventListener('keydown',e=>{
  if(panel?.classList.contains('open')&&e.code==='Escape'){
   e.preventDefault();e.stopImmediatePropagation();hide();
  }
 },true);
 function resetDefaults(){
  const defaults={fov:75,mouseSensitivity:1,touchSensitivity:1,master:100,effects:100,voices:100,ambient:100,jumpscare:100};
  for(const spec of Object.values(rangeSpec)){
    gameSettings[spec.prop]=defaults[spec.prop];
    progressWrite(spec.key,defaults[spec.prop]);
  }
  prefs={...defaults};saveGraphics();applyGraphics();gameSettings.fpsLimit=0;progressWrite('catroomsGfxLimit','0');
  changeQuality(1);
  gameSettings.showFPS=true;progressWrite('catroomsCfgFPS','1');
  setControlsHintsPreference(false);
  refreshAudioMix();sync();
 }
 for(const id of ['settingsDefaultsBtn','menuSettingsDefaultsBtn']){const el=byId(id);if(el)el.addEventListener('click',resetDefaults);}
 sync();
 window.CatroomsSettings={open:show,close:hide,sync};
})();

;
// SOURCE: js/ui/player-profile.js
// Local player identity and NORMAL/HARD menu switch. No networking required.
function updatePlayerNickname(name){
 playerNickname=String(name||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,22)||'PLAYER';
 progressWrite('catroomsNickname',playerNickname);
 if($('playerNameTag'))$('playerNameTag').textContent=playerNickname;
}
function chooseDifficulty(mode){
 selectedDifficulty=mode==='hard'?'hard':'normal';
 progressWrite('catroomsDifficulty',selectedDifficulty);
 $('difficultyNormal').setAttribute('aria-pressed',String(selectedDifficulty==='normal'));
 $('difficultyHard').setAttribute('aria-pressed',String(selectedDifficulty==='hard'));
 $('start').classList.toggle('hard-selected',selectedDifficulty==='hard');
 if($('startBtn'))$('startBtn').textContent='YELLOW CORRIDORS';
 if(typeof refreshLevelButton==='function')refreshLevelButton();
 if(selectedDifficulty==='hard'){
  $('difficultyInfo').textContent='Hard: the same levels, larger procedural maps, champions, emergencies and more aggressive AI.';
 }else{
  $('difficultyInfo').textContent='Normal: standard campaign and classic enemies.';
 }
}
$('playerNameInput').value=playerNickname;
$('playerNameTag').textContent=playerNickname;
$('playerNameInput').addEventListener('input',e=>updatePlayerNickname(e.target.value));
$('difficultyNormal').addEventListener('click',()=>chooseDifficulty('normal'));
$('difficultyHard').addEventListener('click',()=>chooseDifficulty('hard'));
// Initial difficulty is applied by boot.js after every game script has loaded.

;
// SOURCE: js/ui/controls.js
// Mouse, keyboard and touch controls
personAImg.src=PERSON_A_PNG;
personBImg.src=PERSON_B_PNG;
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.repeat)return;if(e.code==='Escape'){if(gameSession.state==='playing')pause();else if(gameSession.state==='paused')resume()}if(gameSession.state==='playing'){if(e.code==='KeyM')beginMapHold();if(e.code==='KeyV')rearPeek=true;if(e.code==='KeyE'){if(coop.role==='guest')coop.sendAction('interact');else interact();}if(e.code==='KeyF'){gameSession.player.flash=!gameSession.player.flash;showToast(gameSession.player.flash?'FLASHLIGHT ON':'FLASHLIGHT OFF',1)} }});
window.addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyM')endMapHold();if(e.code==='KeyV')rearPeek=false;});
window.addEventListener('blur',()=>{keys={};rearPeek=false;endMapHold(true);if(gameSession.state==='playing'&&!isCoarse)pause()});
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
 if(gameSession.state!=='playing')return;
 touchCrouch=!touchCrouch;
 const el=$('crouchBtn');el.classList.toggle('pressed',touchCrouch);
 el.setAttribute('aria-pressed',String(touchCrouch));
 el.textContent=touchCrouch?'CICHO ✓':'SNEAK';
}
$('interactBtn').addEventListener('click',()=>{if(coop.role==='guest')coop.sendAction('interact');else interact();});
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

;
// SOURCE: js/ui/profile-162.js
// Local activity statistics, deliberately separate from legacy campaign progress.
const PROFILE_KEY='catroomsActivity_v1';
const sectorNames=['','Yellow Corridors','Flooded Complex','Bloody Zone','Chrum Sector','Last Encounter'];
const campaignIds=[1,2,3,4,10,6,7,8,9,11,12];
function readProfile(){let p;try{p=JSON.parse(progressRead(PROFILE_KEY,'{}'))}catch{p={}};p=p&&typeof p==='object'?p:{};const n=k=>Number.isFinite(p[k])?Math.max(0,p[k]):0;return {seconds:n('seconds'),deaths:n('deaths'),coins:n('coins'),wins:n('wins'),last:campaignIds.includes(p.last)?p.last:0};}
let profile=readProfile(),profileRun=null;
function saveProfile(){progressWrite(PROFILE_KEY,JSON.stringify(profile));}
function profileRunStarted(){profileRun={generation:gameSession.generation,seconds:0,coins:0,finished:false};if(qualifiesForProgress()&&campaignIds.includes(gameSession.level)){profile.last=gameSession.level;saveProfile();}}
function profileEligible(){return profileRun&&profileRun.generation===gameSession.generation&&!gameSession.runTestEntry&&(qualifiesForProgress()||gameSession.level===13)&&!godMode;}
function profileCheckpoint(){if(!profileEligible())return;const time=Math.max(0,gameSession.clock||0),coins=Math.max(0,gameSession.stats.coins||0);profile.seconds+=Math.max(0,time-profileRun.seconds);profile.coins+=Math.max(0,coins-profileRun.coins);profileRun.seconds=time;profileRun.coins=coins;saveProfile();}
function profileRunFinished(good){if(!profileEligible()||profileRun.finished)return;profileCheckpoint();profileRun.finished=true;if(good){if(qualifiesForProgress())profile.wins++;}else profile.deaths++;saveProfile();}
function profilePeriodicCheckpoint(){if(profileRun&&gameSession.clock-profileRun.seconds>=15)profileCheckpoint();}
window.addEventListener('pagehide',()=>profileCheckpoint());
function completedCampaignIds(){return campaignIds.filter(id=>readBestTime(id)>0||(id===12&&progressRead('catroomsBossRushWon')==='1')||(id>=6&&id<=9&&progressRead('catroomsHardCompleted'+(id-5))==='1')||(id===11&&progressRead('catroomsHardCompleted5')==='1'));}
function unlockedCampaignIds(){return [1,6,...[2,3,4,5].filter(n=>({2:unlocked2,3:unlocked3,4:unlocked4,5:unlocked5})[n]).map(n=>n===5?10:n),...[2,3,4,5].filter(n=>hardUnlocked[n]).map(n=>n===5?11:n+5),...(bossRushVisible()?[12]:[])];}
function campaignName(id){return id===12?'Boss Rush':(id>=6&&id<=9||id===11?'HARD / ':'NORMAL / ')+sectorNames[id===10||id===11?5:id>=6?id-5:id];}
function continueCampaign(){const id=unlockedCampaignIds().includes(profile.last)?profile.last:1;chooseDifficulty(id>=6&&id<=9||id===11?'hard':'normal');startSectorTransition(id);}
function profileRows(el,entries){el.replaceChildren(...entries.map(([label,value])=>{const row=document.createElement('div');row.className='profile-row';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=label;b.textContent=value;row.append(a,b);return row;}));}
function renderPlayerProfile(){const completed=completedCampaignIds();profileRows($('profileStats'),[['PLAY TIME',formatTime(profile.seconds)],['DEATHS',profile.deaths],['COINS COLLECTED',profile.coins],['SECTORS COMPLETED',completed.length+' / 11'],['CAMPAIGN WINS',profile.wins],['BEST STREAK',bestStreak]]);profileRows($('profileRecords'),campaignIds.map(id=>[campaignName(id),readBestTime(id)>0?formatTime(readBestTime(id)):'—']));const achievements=[['First escape',completed.length>0],['Normal campaign',[1,2,3,4,10].every(id=>completed.includes(id))],['Hard survivor',[6,7,8,9,11].every(id=>completed.includes(id))],['Boss Rush survivor',completed.includes(12)],['Coin collector',profile.coins>=25],['Triple streak',bestStreak>=3]];profileRows($('profileAchievements'),achievements.map(([n,v])=>[n,v?'UNLOCKED':'LOCKED']));profileRows($('profileUnlocks'),campaignIds.map(id=>[campaignName(id),unlockedCampaignIds().includes(id)?'AVAILABLE':'LOCKED']));}
function exploredPercent(){let total=0,seen=0;for(let y=0;y<gameSession.N;y++)for(let x=0;x<gameSession.N;x++){const cell=gameSession.world[y]?.[x];if(cell===1||cell==null)continue;total++;if(gameSession.seen[y]?.[x])seen++;}return total?Math.round(100*seen/total):0;}
function renderRoundSummary(good,previousBest){const eligible=qualifiesForProgress();$('endCard').classList.toggle('victoryPanel',good);$('endKicker').textContent=good?'SECTOR COMPLETE':'RUN TERMINATED';$('endTitle').textContent=good?'VICTORY':gameSession.deathBy==='meltdown'?'REACTOR FAILURE':gameSession.deathBy==='hazard'?'TOXIC EXPOSURE':'YOU WERE CAUGHT';$('endDesc').textContent=good?(eligible?'You made it out.':'Custom or test round completed. Campaign progress unchanged.'):gameSession.deathBy==='meltdown'?'The reactor was not repaired in time.':gameSession.deathBy==='hazard'?'Toxic liquid depleted your health.':'Caught by '+(ACTORS[gameSession.deathBy]?.name||'an enemy')+'.';$('endKiller').textContent=good?'':gameSession.deathBy==='meltdown'?'CAUSE / REACTOR FAILURE':gameSession.deathBy==='hazard'?'CAUSE / TOXIC LIQUID':'ENEMY / '+(ACTORS[gameSession.deathBy]?.name||'UNKNOWN');$('endTime').textContent='TIME / '+formatTime(gameSession.clock);$('endItems').textContent='ITEMS / '+gameSession.player.collected+' / '+gameSession.GOAL;$('endExplored').textContent='MAP EXPLORED / '+exploredPercent()+'%';$('endCoins').textContent='COINS / '+(gameSession.stats.coins||0);$('endRecord').textContent=good&&eligible&&(!previousBest||gameSession.clock<previousBest)?'NEW PERSONAL RECORD':'';if(good&&eligible&&gameSession.level!==12&&gameSession.level!==5){const stage=renderStage();if(stage<5){profile.last=isHardMode()?(stage===4?11:stage+6):(stage===4?10:stage+1);saveProfile();}}$('bestTime').textContent=eligible&&readBestTime(gameSession.level)?'BEST / '+formatTime(readBestTime(gameSession.level)):'';$('againBtn').textContent='RESTART';$('nextBtn').textContent='NEXT SECTOR';$('menuBtn').textContent='RETURN TO MENU';}
function updateRoundInterface(state){if(state==='paused'){const stage=renderStage(),n=gameSession.player.collected,total=gameSession.GOAL,panels=gameSession.terminals.filter(t=>t.used).length,panelTotal=gameSession.terminals.length;const objective=n>=total?(panels>=panelTotal?'Reach the exit':'Activate panels'):'Collect '+(['','batteries','cards','cores','food','items'][stage]||'items');$('pauseObjective').textContent=objective+' · '+n+' / '+total+(panelTotal?' · Panels '+panels+' / '+panelTotal:'');$('pauseTime').textContent='ROUND TIME / '+formatTime(gameSession.clock);}if(state==='menu'){renderPlayerProfile();$('continueCampaign').disabled=false;}}
function restartCurrentRound(){const id=gameSession.level,opts={testRun:gameSession.runTestEntry};if(id!==13&&id!==12)chooseDifficulty(isHardMode()?'hard':'normal');begin(id,opts);}
$('pauseRestartBtn').addEventListener('click',restartCurrentRound);
// Older restart handler is replaced before it can run, including from the death screen.
$('againBtn').addEventListener('click',e=>{e.stopImmediatePropagation();restartCurrentRound();},true);

;
// SOURCE: js/ui/pixel-menu.js
// Landing menu + level selection. Legacy engine-facing IDs are preserved.
let selectedSector=1;
const sectorButtonIds=['','startBtn','level2Btn','finalBtn','pigLevelBtn','level5Btn'];
const descriptions=['','The beginning of the nightmare. Find the batteries and escape.','A flooded facility. Collect cards and activate the panels.','A hostile zone of cores, reactors and dangerous encounters.','CHRUM is waiting. Collect food and reach the exit.','The final encounter: two threats and one way out.'];
function chosenSectorId(){return selectedSector===12?12:selectedDifficulty==='hard'?(selectedSector===5?11:selectedSector+5):selectedSector===5?10:selectedSector;}
function syncSectorSelection(){const b=$(selectedSector===12?'bossRushBtn':sectorButtonIds[selectedSector]);if(!b||b.hidden){selectedSector=1;return syncSectorSelection();}for(const id of [...sectorButtonIds.slice(1),'bossRushBtn']){$(id).classList.toggle('sector-selected',$(id)===b);$(id).setAttribute('aria-pressed',String($(id)===b));}const open=selectedSector===12?bossRushVisible():!b.disabled;$('sectorNumber').textContent=selectedSector===12?'EX / CHALLENGE':'SECTOR '+String(selectedSector).padStart(2,'0');$('sectorName').textContent=selectedSector===12?'BOSS RUSH':sectorNames[selectedSector].toUpperCase();$('sectorDescription').textContent=selectedSector===12?'Five sectors. Eighteen bosses. One run.':descriptions[selectedSector];$('sectorAccess').textContent=open?'AVAILABLE':'LOCKED · COMPLETE PREVIOUS SECTOR';$('enterSector').disabled=!open;$('difficultySwitcher').hidden=selectedSector===12;}
function startSectorTransition(id){if(!graphicsReadyForPlay()||$('transition').classList.contains('active'))return;transit(()=>begin(id),'GENERATING LABYRINTH...');}
(function setupPixelMenu(){
 const splash=$('pixelSplash'),hub=$('pixelHub'),start=$('pixelPressStart');
 const panels={play:$('pixelPlayPanel'),settings:$('pixelSettingsPanel'),player:$('pixelPlayerPanel'),custom:$('pixelCustomPanel'),credits:$('pixelCreditsPanel')};
 const tabs={play:$('pixelNavPlay'),settings:$('pixelNavSettings'),player:$('pixelNavPlayer'),custom:$('pixelNavCustom'),credits:$('pixelNavCredits')};
 const sound=new Audio('assets/audio/menu-beep.mp3');sound.preload='auto';let lastBeep=-Infinity;
 function beep(){const now=performance.now();if(muted||now-lastBeep<85)return;lastBeep=now;sound.pause();sound.currentTime=0;sound.volume=.11*(gameSettings.master/100)*(gameSettings.effects/100);sound.play().catch(()=>{});}
 function select(name){if(!panels[name])return;for(const [key,panel] of Object.entries(panels)){panel.hidden=key!==name;tabs[key].classList.toggle('selected',key===name);if(key===name)tabs[key].setAttribute('aria-current','page');else tabs[key].removeAttribute('aria-current');}$('pixelLiveStatus').textContent={play:'SELECT LEVEL',settings:'SETTINGS',player:'PLAYER PROFILE',custom:'CUSTOM GAME',credits:'CREDITS'}[name];if(name==='play')syncSectorSelection();if(name==='player')renderPlayerProfile();}
 const notes=$('releaseNotes'),notesButton=$('releaseNotesOpen'),notesClose=$('releaseNotesClose'),notesKey='catroomsReleaseNotesSeen_1.6.2.4';let notesSeen=progressRead(notesKey,'0')==='1';
 function showNotes(){notes.hidden=false;notesButton.hidden=true;hub.inert=true;splash.inert=true;notesClose.focus();}
 function closeNotes(){notes.hidden=true;notesSeen=true;progressWrite(notesKey,'1');notesButton.hidden=false;hub.inert=false;splash.inert=false;notesButton.focus();}
 function onReady(){if(!notesSeen)showNotes();else notesButton.hidden=false;}
 notesButton.hidden=!notesSeen;notesButton.addEventListener('click',showNotes);notesClose.addEventListener('click',closeNotes);notes.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();e.stopPropagation();if(e.key==='Escape')closeNotes();else notesClose.focus();}});
 function open(name='play'){unlockMenuMusic();splash.hidden=true;hub.hidden=false;select(name);}
 function backToTitle(){hub.hidden=true;splash.hidden=false;if(typeof gpuRenderer!=='undefined'&&gpuRenderer)gpuRenderer.needsRender=true;}
 $('pixelBackToTitle').addEventListener('click',backToTitle);$('hubBack').addEventListener('click',backToTitle);start.addEventListener('click',()=>open('play'));$('continueCampaign').addEventListener('click',continueCampaign);
 for(const b of splash.querySelectorAll('[data-menu]'))b.addEventListener('click',()=>open(b.dataset.menu));
 for(const [name,button] of Object.entries(tabs))button.addEventListener('click',()=>select(name));
 for(const n of [1,2,3,4,5,12]){const b=$(n===12?'bossRushBtn':sectorButtonIds[n]);b.addEventListener('click',e=>{e.stopImmediatePropagation();selectedSector=n;syncSectorSelection();beep();},true);}
 for(const id of ['difficultyNormal','difficultyHard'])$(id).addEventListener('click',syncSectorSelection);
 $('enterSector').addEventListener('click',()=>startSectorTransition(chosenSectorId()));
 // Preserve the existing custom form handler's validation, but present loading before generation.
 $('customStartBtn').addEventListener('click',e=>{e.stopImmediatePropagation();readCustomGameForm();startSectorTransition(13);},true);
 $('start').addEventListener('click',e=>{if(e.target.closest('button,select'))beep();});
 const blood=$('pixelBloodDecals');if(blood){const hand=new Image();hand.src='assets/ui/menu-blood-handprint.png';hand.alt='';blood.appendChild(hand);}
 window.CatroomsPixelMenu={open,select,backToTitle,onReady};
})();
// User-named presets store only validated form inputs, never code or DOM markup.
(function customPresets(){
 const key='catroomsCustomPresets_v1',fields=['customTheme','customSize','customDifficulty','customSeed','customSafeRooms','customDrinks','customLoot','customDark','customEmergency'];
 function load(){try{const a=JSON.parse(progressRead(key,'[]'));return Array.isArray(a)?a.filter(x=>x&&typeof x.name==='string'&&x.name.length<=32&&x.values&&typeof x.values==='object').slice(0,20):[]}catch{return[]}}
 let entries=load();const list=$('presetList'),msg=$('presetMessage');
 function refresh(name=''){list.replaceChildren(new Option('Choose preset',''),...entries.map(x=>new Option(x.name,x.name)));list.value=name;}
 function snapshot(){const values={};for(const id of fields){const e=$(id);values[id]=e.type==='checkbox'?e.checked:e.value;}values.enemies=Object.fromEntries([...$('customEnemyGrid').querySelectorAll('select')].map(e=>[e.dataset.enemy,e.value]));return values;}
 function store(){progressWrite(key,JSON.stringify(entries));}
 $('presetSave').addEventListener('click',()=>{const name=$('presetName').value.trim().slice(0,32);if(!name){msg.textContent='Enter a preset name.';return;}const i=entries.findIndex(x=>x.name===name);if(i<0&&entries.length>=20){msg.textContent='Maximum 20 presets.';return;}const entry={name,values:snapshot()};if(i<0)entries.push(entry);else entries[i]=entry;store();refresh(name);msg.textContent='Preset saved.';});
 $('presetLoad').addEventListener('click',()=>{const entry=entries.find(x=>x.name===list.value);if(!entry)return;for(const id of fields){const e=$(id),v=entry.values[id];if(e.type==='checkbox'){if(typeof v==='boolean')e.checked=v;}else if(e.tagName==='SELECT'){if([...e.options].some(o=>o.value===String(v)))e.value=String(v);}else if(typeof v==='string')e.value=v;}for(const e of $('customEnemyGrid').querySelectorAll('select')){const v=entry.values.enemies?.[e.dataset.enemy];if(['0','1','2','3'].includes(String(v)))e.value=String(v);}$('presetName').value=entry.name;msg.textContent='Preset loaded.';});
 $('presetDelete').addEventListener('click',()=>{if(!list.value)return;entries=entries.filter(x=>x.name!==list.value);store();refresh();msg.textContent='Preset deleted.';});refresh();
})();

;
// SOURCE: js/admin/console.js
// Offline developer console: NOT a server permission system.
// Open with F2 or ` (backquote), type 'help' for a command reference.
let godMode=false,lastShieldToast=-100,adminOpen=false,adminResume=false;
const adminPanel=$('adminConsole'),adminLogPanel=$('adminLog'),adminInput=$('adminInput');

function adminPrint(message){
 const line=document.createElement('div');line.textContent=String(message);
 adminLogPanel.appendChild(line);adminLogPanel.scrollTop=adminLogPanel.scrollHeight;
 if(adminLogPanel.children.length>75)adminLogPanel.firstElementChild.remove();
}
function adminToggle(force){
 const open=typeof force==='boolean'?force:!adminOpen;
 if(open===adminOpen)return;
 if(open){
  adminResume=gameSession.state==='playing';if(adminResume)pause();
  adminPanel.classList.add('open');adminOpen=true;
  adminInput.focus();adminInput.select();
 }else{
  adminOpen=false;adminPanel.classList.remove('open');adminInput.blur();
  if(adminResume&&gameSession.state==='paused')resume();adminResume=false;
 }
}
function adminUsed(){gameSession.runCheated=true;if(typeof gpuRenderer!=='undefined'&&gpuRenderer)gpuRenderer.needsRender=true;}
function adminRun(text){
 const args=text.trim().split(/\s+/),cmd=(args.shift()||'').toLowerCase(),arg=args[0]?.toLowerCase();
 if(!cmd)return;
 if(coop.role==='guest'){adminPrint('Komendy administratora sa dostepne wylacznie u hosta.');return;}
 adminPrint('> '+text);
 const commands={
  help:'help · status · ai · sprites · perf · engine · bossrush [SEED] (test) · god on/off · heal · reveal · give all · open doors · enemies clear · spawn pig · level 1..11 · hard 1..5 · unlock all · coins ILE · tp safe/exit · seed LICZBA · hardseed SEED [ETAP] · streak reset · rage',
  status:`Level ${gameSession.level} | stan ${gameSession.state} | przedmioty ${gameSession.player.collected||0}/${gameSession.GOAL} | wrogowie ${gameSession.guards.length} | seria ${winStreak} (rekord ${bestStreak}) | grosze ${gameSession.player.coins||0} | bezpieczny pokoj ${gameSession.safeRoom?'TAK':'NONE'} | seed ${(gameSession.level===12?gameSession.bossRush?.seed:isHardMode()||gameSession.level===13?hardSeed:proceduralSeed)>>>0} | tarcza ${Math.max(0,Math.ceil((gameSession.player.shieldUntil||0)-gameSession.elapsed))} s`
 };
 if(cmd==='help'||cmd==='status'){adminPrint(commands[cmd]);return}
 if(cmd==='engine'){
  adminPrint(JSON.stringify({generation:gameSession.generation,mode:modeFor(gameSession.level).name,level:gameSession.level,state:gameSession.state,hz:Math.round(1/simulationClock.step),totalTicks:simulationClock.ticks,droppedSeconds:Number(simulationClock.droppedSeconds.toFixed(3)),alpha:Number(simulationClock.alpha.toFixed(3)),clock:Number(gameSession.clock.toFixed(3))}));return;
 }
 if(cmd==='perf'){
  const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;
  if(!r){adminPrint('Renderer not ready');return;}
  adminPrint(JSON.stringify(r.stats));return;
 }
 if(cmd==='sprites'){
  const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;
  if(!r){adminPrint('Renderer not ready');return;}
  r.collectSprites();adminPrint('Chrum atlas layer: '+JSON.stringify(r.loadedSpriteLayers?.[1]));
  for(const d of r.spriteDiagnostics)adminPrint(`${d.kind} | layer ${d.layer??'-'} | depth ${d.depth.toFixed(2)} | ${d.reason}`);
  return;
 }
 if(cmd==='ai'){
  adminPrint(`Player: (${gameSession.player.x?.toFixed(2)}, ${gameSession.player.y?.toFixed(2)}) | flash ${!!gameSession.player.flash} | crouch ${!!gameSession.crouching} | hidden ${!!gameSession.player.hidden} | safe ${isSafeRoomProtected()}`);
  const enemies=gameSession.level===1?[...(gameSession.awake?[gameSession.cat]:[]),...gameSession.guards]:gameSession.guards;
  enemies.filter(g=>g&&Number.isFinite(g.x)).forEach((g,i)=>{
   const d=Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y),angle=Math.atan2(gameSession.player.y-g.y,gameSession.player.x-g.x),delta=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)));
   adminPrint(`#${i+1} ${g.kind} / ${g.variant||'classic'} | ${g.state} | ${d.toFixed(2)} m | angle ${(delta*180/PI).toFixed(0)} deg | LOS ${lineOfSight(g.x,g.y,gameSession.player.x,gameSession.player.y)} | path ${g.path?.length||0} | frozen ${!!g.frozen}${gameSession.level===12?' | sector '+g.rushSector:''}`);
  });return;
 }
 if(cmd==='bossrush'){if(arg!=null&&!Number.isFinite(+arg)){adminPrint('Usage: bossrush [SEED]');return;}if(arg!=null)requestedSeed=(+arg)|0;adminToggle(false);begin(12,{testRun:true});adminPrint('BOSS RUSH (RUNDA TESTOWA)');return;}
 if(cmd==='god'){
  if(!['on','off'].includes(arg)){adminPrint('Usage: god on | god off');return}
  godMode=arg==='on';adminUsed();adminPrint('Niezniszczalnosc: '+(godMode?'WLACZONA':'WYLACZONA'));return;
 }
 if(cmd==='heal'){gameSession.player.stamina=staminaMax();UI.stamina.style.width=staminaWidth();adminUsed();adminPrint('Wytrzymalosc uzupelniona.');return}
 if(cmd==='reveal'||cmd==='map'){
  gameSession.seen=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(true));gameSession.mapOn=true;UI.map.classList.add('visible');drawMap();adminUsed();adminPrint('Odkryto mape.');return;
 }
 if(cmd==='give'&&arg==='all'){
  for(const f of gameSession.fuses)f.taken=true;gameSession.player.collected=gameSession.GOAL;UI.count.textContent=gameSession.GOAL;
  for(const t of gameSession.terminals)t.used=true;updateObjectiveFacility();adminUsed();
  adminPrint('Przedmioty i panele zaliczone. Idz do wyjscia.');return;
 }
 if(cmd==='open'&&arg==='doors'){
  for(const d of gameSession.doors){d.open=true;gameSession.world[d.y][d.x]=0}markWorldChanged();
  adminUsed();adminPrint('Wszystkie bramy otwarte.');return;
 }
 if(cmd==='enemies'&&arg==='clear'){
  gameSession.guards=[];gameSession.awake=false;gameSession.nearCat=Infinity;adminUsed();adminPrint('Usunieto przeciwnikow.');return;
 }
 if(cmd==='spawn'&&arg==='pig'){
  const points=[];for(let y=1;y<gameSession.N-1;y++)for(let x=1;x<gameSession.N-1;x++){
   if(gameSession.world[y][x]===0&&Math.hypot(gameSession.player.x-x-.5,gameSession.player.y-y-.5)>4&&Math.hypot(gameSession.player.x-x-.5,gameSession.player.y-y-.5)<8)points.push({x:x+.5,y:y+.5})
  }
  const p=points[Math.floor(Math.random()*points.length)];if(!p){adminPrint('Brak wolnego pola.');return}
  gameSession.guards.push(makeGuard(p.x,p.y,'pig'));adminUsed();adminPrint('CHRUM pojawil sie na mapie.');return;
 }
 if(cmd==='unlock'&&arg==='all'){
  unlocked2=unlocked3=unlocked4=unlocked5=true;
  for(let k=2;k<=5;k++){progressWrite('catroomsUnlocked'+k,'1');hardUnlocked[k]=true;progressWrite('catroomsHardUnlocked'+k,'1');}
  // Level access is not the same as completion. Grant Boss Rush explicitly so
  // `unlock all` really includes the final secret mode and survives reloads.
  progressWrite('catroomsBossRushUnlocked','1');
  refreshLevelButton();adminUsed();
  adminPrint('Unlocked NORMAL 1-5, HARD 1-5 and BOSS RUSH. Available under PLAY.');
  if(gameSession.state==='menu')setState('menu');
  return;
 }
 if(cmd==='level'||cmd==='hard'){
  const target=Number(arg);
  const n=cmd==='hard'?(target===5?11:target+5):target;
  if(!Number.isInteger(target)||(cmd==='hard'&&(target<1||target>5))||(cmd==='level'&&(n<1||n>11))){adminPrint('Usage: level 1..11 | hard 1..5');return}
  adminToggle(false);begin(n,{testRun:true});adminPrint('Uruchomiono '+(n===11?'HARD 5':n>=6&&n<=9?'HARD '+(n-5):n===10?'SEKTOR 05':'Level '+n)+' (runda testowa).');return;
 }
 if(cmd==='coins'){
  const amount=Number(arg);if(!Number.isInteger(amount)||amount<0||amount>999){adminPrint('Usage: coins 10 (0..999)');return}
  gameSession.player.coins=amount;updateCoinCounter();adminUsed();adminPrint('Grosze: '+amount);return;
 }
 if(cmd==='tp'&&arg==='safe'){
  if(!gameSession.safeRoom){adminPrint('No safe room on this map.');return}
  gameSession.player.x=gameSession.safeRoom.centerX;gameSession.player.y=gameSession.safeRoom.centerY;adminUsed();updateCoinCounter();adminPrint('Teleported to the safe room.');return;
 }
 if(cmd==='tp'&&arg==='exit'){
  gameSession.player.x=gameSession.exitCell.x+.5;gameSession.player.y=gameSession.exitCell.y+.5;
  adminUsed();adminPrint('Teleported near the exit.');return;
 }
 if(cmd==='seed'){
  if(arg==null||!Number.isFinite(+arg)){adminPrint('Usage: seed 123456');return}
  requestedSeed=(+arg)|0;adminToggle(false);begin(5,{testRun:true});
  adminPrint('Wczytano proceduralny seed '+(proceduralSeed>>>0)+'.');return;
 }
 if(cmd==='hardseed'){
  if(arg==null||!Number.isFinite(+arg)){adminPrint('Usage: hardseed 123456');return}
  const stage=args[1]==null?1:Number(args[1]);if(!Number.isInteger(stage)||stage<1||stage>5){adminPrint('Usage: hardseed 123456 [1..5]');return}
  requestedSeed=(+arg)|0;adminToggle(false);begin(stage===5?11:stage+5,{testRun:true});
  adminPrint('Wczytano HARD etap '+stage+' · seed '+(hardSeed>>>0)+'.');return;
 }
 if(cmd==='streak'&&arg==='reset'){
  winStreak=0;progressWrite('catroomsWinStreak','0');streakRender();adminUsed();adminPrint('Current streak reset. Best record kept.');return;
 }
 if(cmd==='rage'){
  if(gameSession.state==='paused'){adminPrint('Rage mode has been removed.');return}
  toggleRage();adminUsed();return;
 }
 adminPrint('Unknown command. Type help.');
}

document.addEventListener('keydown',e=>{
 if(e.code==='F2'||e.code==='Backquote'&&e.target!==adminInput){
  e.preventDefault();e.stopImmediatePropagation();adminToggle();return;
 }
 if(adminOpen){
  if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();adminToggle(false);return}
  // Never pass movement/interaction keys into the game while typing commands.
  if(e.target===adminInput)e.stopImmediatePropagation();
 }
},true);
$('adminForm').addEventListener('submit',e=>{e.preventDefault();const v=adminInput.value;adminInput.value='';adminRun(v)});
$('adminClose').addEventListener('click',()=>adminToggle(false));

$('adminMenuBtn').addEventListener('click',()=>adminToggle(true));


;
// SOURCE: js/ui/macabre-hud.js
// Decorative survival-HUD mirror. Does not change the game state or controls.
const syncDecorativeHUD=(()=>{
 const count=document.getElementById('fieldItemCount');
 const zone=document.getElementById('fieldZone'),action=document.getElementById('fieldActionText');
 let last='',lastUpdate=-Infinity;
 function mirror(time=performance.now()){
  if(gameSession.state!=='playing'||time-lastUpdate<280)return;lastUpdate=time;
  try{
   const n=Number(document.getElementById('count')?.textContent||0);
   const total=Number(document.getElementById('required')?.textContent||7);
   const l=renderStage();
   const val=n+' / '+total;
   const ready=typeof gameSession.interactReady!=='undefined'?gameSession.interactReady:null;
   const act=l===1?'COLLECT BATTERIES':ready?'E / '+(ready.title||'UZYJ'):'E / CHECK SURROUNDINGS';
   const panels=gameSession.terminals.filter(t=>t.used).length,totalPanels=gameSession.terminals.length;
   const target=l===1?'batteries':l===2?'cards':l===3?'cores':l===4?'food':'items';
   const objective=n>=total?(panels>=totalPanels?'Reach the exit':'Activate panels · '+panels+' / '+totalPanels):'Collect '+target+(totalPanels?' · '+panels+'/'+totalPanels+' panels':'');
   const next=val+'|'+l+'|'+act+'|'+objective;
   if(next===last)return;last=next;
   if(count)count.textContent=val;const title=$('hudObjectiveText'),bar=$('hudObjectiveProgress');if(title)title.textContent=objective;if(bar)bar.style.setProperty('--progress',String(Math.max(0,Math.min(100,total>0?n/total*100:0)))+'%');
   if(zone)zone.textContent=l===5?'RANDOM ZONE':'SEKTOR 0'+l;
   if(action)action.textContent=act;
  }catch(e){/* HUD decoration must never interrupt gameplay. */}
 }
 return mirror;
})();

// One-second rising-edge detection indicator, independent of rendering FPS.
const syncDetectionHUD=(()=>{
 let generation=-1,wasDetected=false,until=0;
 return ()=>{
  const el=$('detectionWarning');if(!el)return;
  if(generation!==gameSession.generation){generation=gameSession.generation;wasDetected=false;until=0;}
  if(gameSession.state!=='playing'){el.hidden=true;return;}
  const active=g=>g&&g.state==='chase'&&!g.frozen&&g.variant!=='gray';
  const detected=!gameSession.player.hidden&&(gameSession.guards.some(g=>active(g)&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||(gameSession.level===1&&gameSession.awake&&active(gameSession.cat)));
  if(detected&&!wasDetected)until=gameSession.elapsed+1;
  wasDetected=detected;el.hidden=gameSession.elapsed>=until;
  const details=$('mapRunDetails');if(details&&!details.hidden){
   const level=$('levelLabel').textContent,status=gameSession.player.hidden?'HIDDEN':detected?'DETECTED':gameSession.guards.some(g=>g.state==='search'||g.state==='suspicious')?'SEARCHING':'UNDETECTED';
   if($('mapLevelDetails').textContent!==level)$('mapLevelDetails').textContent=level;
   if($('mapDetectionDetails').textContent!==status)$('mapDetectionDetails').textContent=status;
  }
 };
})();

;
window.CatroomsScriptsReady = true;
