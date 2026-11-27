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
