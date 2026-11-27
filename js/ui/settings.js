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
 const keys=['hd','lighting','shadows','geometry','flashlight','post','soft','models'];
 const graphicsDefaults={hd:true,lighting:true,shadows:true,geometry:false,flashlight:true,post:true,soft:false,models:false};
 const presets={
  potato:{quality:.5,flags:{hd:false,lighting:false,shadows:false,geometry:false,flashlight:false,post:false,soft:false,models:false}},
  low:{quality:.7,flags:{hd:false,lighting:true,shadows:false,geometry:false,flashlight:true,post:false,soft:false,models:false}},
  medium:{quality:.85,flags:{...graphicsDefaults,shadows:false}},
  high:{quality:1,flags:{...graphicsDefaults}},
  ultra:{quality:1.2,flags:{...graphicsDefaults,geometry:true,soft:true,models:true}}
 };
 let prefs={...graphicsDefaults};
 try{const saved=JSON.parse(progressRead('catroomsGfx09','{}'));for(const k of keys)if(typeof saved?.[k]==='boolean')prefs[k]=saved[k];}catch(e){}
 let autoPreset=progressRead('catroomsGfxAuto','');
 const savedAuto=Object.hasOwn(presets,autoPreset)?presets[autoPreset]:null;
 if(!savedAuto||savedAuto.quality!==gameSettings.quality||keys.some(key=>savedAuto.flags[key]!==prefs[key]))autoPreset='';
 const bench=window.CatroomsGraphicsBench,benchDialog=byId('graphicsBenchDialog');
 gameSettings.fpsLimit=Number(progressRead('catroomsGfxLimit','0'));
 if(![0,30,60,120,144,165,240].includes(gameSettings.fpsLimit))gameSettings.fpsLimit=0;
 const ids=suffix=>['setting'+suffix,'menuSetting'+suffix];
 function saveGraphics(){progressWrite('catroomsGfx09',JSON.stringify(prefs));progressWrite('catroomsGfxAuto',autoPreset);}
 function applyGraphics(flags=prefs){
  const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;
  if(!r)return;
  if(r.hdMaterials&&r.hdEnabled!==flags.hd){if(r.terrainBind)r.toggleHdMaterials();else r.hdEnabled=flags.hd;}
  r.lightingEnabled=flags.lighting;r.wallShadowsEnabled=flags.shadows;r.flashlightEnabled=flags.flashlight;
  r.softShadowsEnabled=flags.soft;r.modelShadowsEnabled=flags.models;
  if(r.worldGeometry?.available&&r.worldGeometry.enabled!==flags.geometry)r.worldGeometry.toggle();
  if(r.post&&r.post.enabled!==flags.post){r.post.enabled=flags.post;r.post.reset=true;r.post.lastTime=null;}
  r.needsRender=true;
 }
 function syncGraphics(){
  const r=typeof gpuRenderer!=='undefined'?gpuRenderer:null;
  for(const k of keys)forEachExisting(ids('Gfx'+k),el=>{
   el.checked=prefs[k];
   el.disabled=!!r&&((k==='hd'&&!r.hdMaterials)||(k==='geometry'&&!r.worldGeometry?.available)||(k==='post'&&!r.post));
  });
  const match=Object.keys(presets).find(k=>presets[k].quality===gameSettings.quality&&keys.every(key=>prefs[key]===presets[k].flags[key]))||'custom';
  forEachExisting(ids('Preset'),el=>el.value=autoPreset?'auto':match);
  forEachExisting(ids('Limit'),el=>el.value=String(gameSettings.fpsLimit));
  forEachExisting(ids('AutoStatus'),el=>el.textContent=autoPreset?'AUTO selected '+autoPreset.toUpperCase()+'.':'');
  forEachExisting(ids('Benchmark'),el=>el.disabled=!r||!r.device.queue.onSubmittedWorkDone);
 }
 function selectPreset(name,automatic=false){
  const preset=presets[name];
  prefs={...preset.flags};autoPreset=automatic?name:'';saveGraphics();
  applyGraphics();changeQuality(preset.quality);
 }
 function renderBenchmarkResults(results,recommended){
  forEachExisting(ids('BenchResults'),el=>{
   el.replaceChildren();
   const title=document.createElement('p');
   title.textContent='Recommended preset · '+recommended.toUpperCase();
   const list=document.createElement('ul');
   for(const result of results){
    const item=document.createElement('li');
    item.textContent=result.preset.toUpperCase()+' · '+result.width+' × '+result.height+' · '+result.fps.toFixed(1)+' estimated FPS · '+result.p90.toFixed(1)+' ms p90';
    list.append(item);
   }
   el.append(title,list);
  });
 }
 async function runBenchmark(automatic){
  if(bench.running)return;
  const renderer=gpuRenderer;
  if(!renderer?.device.queue.onSubmittedWorkDone||document.hidden){sync();return;}
  const originalQuality=gameSettings.quality;
  const status=byId('graphicsBenchProgress'),cancel=byId('graphicsBenchCancel');
  cancel.disabled=false;
  benchDialog.showModal();
  let outcome=null;
  try{
   const names=Object.keys(presets);
   outcome=await bench.run(renderer,names,name=>{
    gameSettings.quality=presets[name].quality;
    applyGraphics(presets[name].flags);renderer.resize();
   },(name,index,total)=>{status.textContent='Testing '+name.toUpperCase()+' · '+index+' / '+total;});
   renderBenchmarkResults(outcome.results,outcome.recommended);
  }catch(error){
   forEachExisting(ids('BenchResults'),el=>el.textContent=error.name==='AbortError'?'Benchmark cancelled.':'Benchmark stopped. '+error.message);
  }finally{
   gameSettings.quality=originalQuality;
   benchDialog.close();
   if(automatic&&outcome)selectPreset(outcome.recommended,true);
   else{applyGraphics();resize();sync();}
   resetSimulationClock();
  }
 }
 benchDialog?.addEventListener('cancel',event=>{event.preventDefault();bench.cancel();});
 byId('graphicsBenchCancel')?.addEventListener('click',event=>{
  bench.cancel();event.target.disabled=true;byId('graphicsBenchProgress').textContent='Stopping benchmark…';
 });
 for(const k of keys)forEachExisting(ids('Gfx'+k),el=>el.addEventListener('change',()=>{
  prefs[k]=el.checked;autoPreset='';saveGraphics();applyGraphics();sync();
 }));
 forEachExisting(ids('Preset'),el=>el.addEventListener('change',()=>{
  if(el.value==='auto')runBenchmark(true);
  else if(Object.hasOwn(presets,el.value))selectPreset(el.value);
  else{autoPreset='';saveGraphics();sync();}
 }));
 forEachExisting(ids('Benchmark'),el=>el.addEventListener('click',()=>runBenchmark(false)));
 forEachExisting(ids('Limit'),el=>el.addEventListener('change',()=>{gameSettings.fpsLimit=Number(el.value);progressWrite('catroomsGfxLimit',String(gameSettings.fpsLimit));sync();}));
 function captureGraphics(){
  const r=gpuRenderer;if(!r)return;
  if(r.hdMaterials)prefs.hd=r.hdEnabled;
  if(r.worldGeometry?.available)prefs.geometry=r.worldGeometry.enabled;
  if(r.post)prefs.post=r.post.enabled;
  Object.assign(prefs,{lighting:r.lightingEnabled,shadows:r.wallShadowsEnabled,flashlight:r.flashlightEnabled,soft:r.softShadowsEnabled,models:r.modelShadowsEnabled});
  autoPreset='';saveGraphics();sync();
 }
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
 forEachExisting(qualityIds,el=>el.addEventListener('change',e=>{
  autoPreset='';saveGraphics();changeQuality(Number(e.target.value));
 }));
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
  if(e.code==='Escape'&&bench.running){
   e.preventDefault();e.stopImmediatePropagation();bench.cancel();return;
  }
  if(panel?.classList.contains('open')&&e.code==='Escape'){
   e.preventDefault();e.stopImmediatePropagation();hide();
  }
 },true);
 function resetDefaults(){
  const inputDefaults={fov:75,mouseSensitivity:1,touchSensitivity:1,master:100,effects:100,voices:100,ambient:100,jumpscare:100};
  for(const spec of Object.values(rangeSpec)){
    gameSettings[spec.prop]=inputDefaults[spec.prop];
    progressWrite(spec.key,inputDefaults[spec.prop]);
  }
  prefs={...graphicsDefaults};autoPreset='';saveGraphics();applyGraphics();gameSettings.fpsLimit=0;progressWrite('catroomsGfxLimit','0');
  changeQuality(1);
  gameSettings.showFPS=true;progressWrite('catroomsCfgFPS','1');
  setControlsHintsPreference(false);
  refreshAudioMix();sync();
 }
 for(const id of ['settingsDefaultsBtn','menuSettingsDefaultsBtn']){const el=byId(id);if(el)el.addEventListener('click',resetDefaults);}
 sync();
 window.CatroomsSettings={open:show,close:hide,sync};
})();
