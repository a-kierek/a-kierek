// Single owner of mutable run state. Persistent preferences and GPU resources stay outside.
class GameSession {
 constructor(){
  this.level=1;this.state='menu';this.worldRevision=0;
  this.runCheated=false;this.runTestEntry=false;this.generation=0;
  this.resetRound();
 }
 resetRound(){
  this.generation++;this.worldRevision++;
  this.graphicsDemo=false;
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
let gameSession=new GameSession();

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
