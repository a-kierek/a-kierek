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
