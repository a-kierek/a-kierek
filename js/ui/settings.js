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
  if(state==='playing')pause();
  sync();
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  const closeBtn=byId('settingsCloseBtn');if(closeBtn)closeBtn.focus();
 }
 function hide(){
  panel.classList.remove('open');panel.setAttribute('aria-hidden','true');
  if(state==='paused'&&byId('settingsPauseBtn'))byId('settingsPauseBtn').focus();
  else if(state==='menu'&&byId('pixelNavSettings'))byId('pixelNavSettings').focus();
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
  changeQuality(1);
  gameSettings.showFPS=true;progressWrite('catroomsCfgFPS','1');
  setControlsHintsPreference(false);
  refreshAudioMix();sync();
 }
 for(const id of ['settingsDefaultsBtn','menuSettingsDefaultsBtn']){const el=byId(id);if(el)el.addEventListener('click',resetDefaults);}
 sync();
 window.CatroomsSettings={open:show,close:hide,sync};
})();
