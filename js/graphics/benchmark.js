const GRAPHICS_BENCHMARK_POSES=Object.freeze([
 [3.9,11.55,.04,-.13,true], [5.7,11.6,.08,-.24,true],
 [8.4,11.45,.37,-.1,false], [10.8,11.46,-.12,.19,true],
 [12.8,11.48,.17,-.12,true], [14.45,12.6,.93,-.15,true],
 [16.45,14.42,.55,-.25,false], [18.3,17.55,2.79,-.2,true],
 [21.4,12.5,-.38,-.13,true], [24.45,10.41,-1.6,-.08,true],
 [25.6,12.5,.71,.18,false], [28.2,11.46,3.06,-.12,true]
]);
const GRAPHICS_TARGET_MS=1000/60;

function summarizeGraphicsFrames(frames){
 const sorted=[...frames].sort((a,b)=>a-b);
 const mean=frames.reduce((total,value)=>total+value,0)/frames.length;
 return {fps:1000/mean,p90:sorted[Math.ceil(sorted.length*.9)-1]};
}

function recommendGraphicsPreset(results){
 // Higher-quality entries come later. Reserve headroom for gameplay and UI.
 return results.findLast(result=>result.p90<=GRAPHICS_TARGET_MS&&result.fps>=65)?.preset||results[0].preset;
}

class CatroomsGraphicsBenchmark {
 constructor(){this.running=false;this.results=[];}
 cancel(){this.controller?.abort();}
 async run(renderer,presets,configure,notify){
  if(this.running||!renderer?.device.queue.onSubmittedWorkDone||document.hidden)throw Error('Benchmark requires an active WebGPU tab.');
  this.running=true;
  this.controller=new AbortController();
  const {signal}=this.controller;
  const cancelIfHidden=()=>{if(document.hidden)this.cancel();};
  document.addEventListener('visibilitychange',cancelIfHidden);
  const scene=populateGraphicsDemo(new GameSession());
  scene.state='playing';
  const renderPose=(pose,index)=>{
   const [x,y,a,pitch,flash]=pose;
   Object.assign(scene.player,{x,y,a,pitch,flash});
   scene.elapsed=index*.13;
   const session=gameSession,peek=rearPeek;
   gameSession=scene;rearPeek=false;
   try{renderer.render();}finally{gameSession=session;rearPeek=peek;}
  };
  const results=[];
  try{
   for(const preset of presets){
    signal.throwIfAborted();
    if(gpuRenderer!==renderer)throw Error('Graphics device changed during the benchmark.');
    configure(preset);
    notify(preset,results.length+1,presets.length);
    const samples=[];
    // Warm up pipeline compilation and buffers, then measure completed renders
    // for the same camera path, resolution formula and effects as gameplay.
    for(let i=-3;i<GRAPHICS_BENCHMARK_POSES.length;i++){
     await new Promise(resolve=>setTimeout(resolve,0));
     signal.throwIfAborted();
     const start=performance.now();
     renderPose(GRAPHICS_BENCHMARK_POSES[Math.max(0,i)],Math.max(0,i));
     await renderer.device.queue.onSubmittedWorkDone();
     if(i>=0)samples.push(Math.max(.01,performance.now()-start));
    }
    results.push({preset,width:renderer.lastWidth,height:renderer.lastHeight,...summarizeGraphicsFrames(samples)});
   }
   signal.throwIfAborted();
   if(gpuRenderer!==renderer)throw Error('Graphics device changed during the benchmark.');
   this.results=results;
   return {results,recommended:recommendGraphicsPreset(results)};
  }finally{
   this.running=false;
   this.controller=null;
   document.removeEventListener('visibilitychange',cancelIfHidden);
   if(gpuRenderer===renderer){
    renderer.flashlightState=null;
    if(renderer.post){renderer.post.reset=true;renderer.post.lastTime=null;}
    renderer.needsRender=true;
   }
  }
 }
}

window.CatroomsGraphicsBench=new CatroomsGraphicsBenchmark();
