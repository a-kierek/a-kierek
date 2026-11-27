"""Optional real Chromium DOM/input/asset smoke test with MOCK GPU. Not a shader or FPS test.
Run after building standalone: python tests/browser_smoke.py [chromium executable].
Requires Python playwright and Chromium; does not navigate to external sites.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import sys
root=Path(__file__).resolve().parents[1]
html=(root.parent/'THE_CATROOMS_V1_8_BETA.html').read_text()
shim=r'''<script>
const noGpuOp=()=>{};
let synthAttempts=0;
const failAudioSynthesis=function(){synthAttempts++;throw Error('Unexpected audio synthesis');};
Object.defineProperty(window,'AudioContext',{value:failAudioSynthesis,configurable:true});
Object.defineProperty(window,'webkitAudioContext',{value:failAudioSynthesis,configurable:true});
const mockTexture=()=>({createView:()=>({}),destroy:noGpuOp});
const mockPipeline=()=>({getBindGroupLayout:()=>({})});
const mockPass=()=>({setPipeline:noGpuOp,setBindGroup:noGpuOp,draw:noGpuOp,end:noGpuOp,setVertexBuffer:noGpuOp,setIndexBuffer:noGpuOp,drawIndexed:noGpuOp});
let resolveMockGpuLoss;
const mockDevice={createBuffer:()=>({destroy:noGpuOp}),createTexture:mockTexture,createSampler:()=>({}),createShaderModule:()=>({getCompilationInfo:async()=>({messages:[]})}),createRenderPipeline:mockPipeline,createBindGroup:()=>({}),pushErrorScope:noGpuOp,popErrorScope:async()=>null,queue:{writeBuffer:noGpuOp,copyExternalImageToTexture:noGpuOp,submit:noGpuOp,onSubmittedWorkDone:async()=>{}},createCommandEncoder:()=>({beginRenderPass:mockPass,finish:()=>({})}),lost:new Promise(resolve=>{resolveMockGpuLoss=resolve})};
Object.defineProperty(navigator,'gpu',{value:{requestAdapter:async()=>({requestDevice:async()=>mockDevice}),getPreferredCanvasFormat:()=> 'rgba8unorm'},configurable:true});
if(!globalThis.GPUBufferUsage)globalThis.GPUBufferUsage={UNIFORM:1,STORAGE:2,COPY_DST:4,VERTEX:8,INDEX:16};
if(!globalThis.GPUTextureUsage)globalThis.GPUTextureUsage={TEXTURE_BINDING:1,COPY_DST:2,RENDER_ATTACHMENT:4};
const originalGetContext=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgpu'?{configure:noGpuOp,getCurrentTexture:mockTexture}:originalGetContext.call(this,type,...args);};
HTMLCanvasElement.prototype.requestPointerLock=function(){};
</script>'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=sys.argv[1] if len(sys.argv)>1 else '/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'],timeout=10000)
 page=b.new_page(viewport={'width':640,'height':480});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 # Use a fresh DOM; the managed browser blocks direct file/HTTP navigation.
 page.set_content(html.replace('<head>','<head>'+shim+"<script>Object.defineProperty(window,'localStorage',{value:{data:new Map(),getItem(k){return this.data.get(k)??null},setItem(k,v){this.data.set(k,String(v))},removeItem(k){this.data.delete(k)}},configurable:true});</script>",1),wait_until='load',timeout=30000)
 page.wait_for_function("window.CatroomsGraphicsStatus?.backend==='webgpu' && typeof gameSession!=='undefined' && gameSession.world.length>0",timeout=15000)
 assert page.evaluate("window.CatroomsScriptsReady===true && !window.CatroomsStartupError && typeof bossRushVisible==='function' && typeof resetBossRush==='function'")
 assert page.evaluate("!document.getElementById('loadingScreen')?.classList.contains('load-failed')")
 assert page.evaluate("gpuRenderer.modelMeshes.pig===undefined && Object.keys(gpuRenderer.modelMeshes).length===24+Object.keys(ROOM_MODELS).length && ['door','rock','battery','card','terminal','shield','drink'].every(kind=>gpuRenderer.modelMeshes[kind]?.indexCount>0)")
 assert page.evaluate("gpuRenderer.loadedSpriteLayers[1].width>0 && gpuRenderer.loadedSpriteLayers[1].height>0")
 assert page.evaluate("$('bossRushBtn').hidden===!bossRushVisible()")
 # New v1.8.0-beta release UI and title music checks.
 assert page.evaluate("!$('pixelSplash').hidden && menuMusicUnlocked && bgTracks.menu?.loop===true")
 assert page.evaluate("$('versionBadge').closest('#start')!==null && $('pixelBloodDecals').querySelectorAll('img').length===1")
 assert page.evaluate("$('startBtn').textContent==='YELLOW CORRIDORS'&&$('bossRushBtn').textContent==='BOSS RUSH'")
 assert page.evaluate("$('fieldInventory').querySelector('img').naturalWidth>0 && $('detectionWarning').querySelector('img').naturalWidth>0")
 page.wait_for_function("!$('releaseNotes').hidden")
 assert page.evaluate("$('pixelHub').inert && $('pixelSplash').inert")
 page.evaluate("$('releaseNotesClose').click();$('pixelPressStart').click()")
 assert page.evaluate("$('releaseNotes').hidden && !$('releaseNotesOpen').hidden && progressRead('catroomsReleaseNotesSeen_1.8.0-beta')==='1' && !$('pixelHub').inert")
 page.evaluate("$('releaseNotesOpen').click()")
 assert page.evaluate("!$('releaseNotes').hidden")
 page.evaluate("$('releaseNotesClose').click();$('hubBack').click()")
 page.wait_for_timeout(150)
 assert page.evaluate("gpuRenderer.menuScene && gpuRenderer.mapSource===gpuRenderer.menuScene.world && gameSession.world!==gpuRenderer.menuScene.world")
 page.evaluate("window.menuPlayerBefore=JSON.stringify(gameSession.player);window.menuMapBefore=gameSession.world")
 page.wait_for_timeout(250)
 assert page.evaluate("JSON.stringify(gameSession.player)===menuPlayerBefore && gameSession.world===menuMapBefore")
 page.evaluate("$('pixelPressStart').click()")
 print('PASS title music, isolated engine-rendered menu scene, notes and level selector')
 assert page.evaluate("""(()=>{
  const before=progressRead('catroomsBest1');
  $('graphicsDemoBtn').click();
  if(!gameSession.graphicsDemo||gameSession.state!=='playing'||qualifiesForProgress())return false;
  pause();$('settingsPauseBtn').click();
  $('settingPreset').value='ultra';$('settingPreset').dispatchEvent(new Event('change'));
  if(!gpuRenderer.softShadowsEnabled||!gpuRenderer.modelShadowsEnabled||!gpuRenderer.worldGeometry.enabled)return false;
  $('settingsDefaultsBtn').click();
  if(gpuRenderer.softShadowsEnabled||gpuRenderer.modelShadowsEnabled||gpuRenderer.worldGeometry.enabled||!gpuRenderer.wallShadowsEnabled||!gpuRenderer.hdEnabled)return false;
  $('settingsDoneBtn').click();$('pauseRestartBtn').click();
  if(!gameSession.graphicsDemo||gameSession.state!=='playing'||before!==progressRead('catroomsBest1'))return false;
  setState('menu');$('pixelPressStart').click();
  return true;
 })()""")
 print('PASS offline graphics demo, restart isolation, Ultra toggles and graphics defaults')
 page.evaluate("$('pixelNavSettings').click();$('menuSettingPreset').value='auto';$('menuSettingPreset').dispatchEvent(new Event('change'));")
 page.wait_for_function("!CatroomsGraphicsBench.running && $('menuSettingBenchResults').querySelectorAll('li').length===5")
 assert page.evaluate("$('menuSettingPreset').value==='auto' && $('settingPreset').value==='auto' && !!progressRead('catroomsGfxAuto')")
 page.evaluate("$('menuSettingBenchmark').click();$('graphicsBenchCancel').click()")
 page.wait_for_function("!CatroomsGraphicsBench.running && $('menuSettingBenchResults').textContent==='Benchmark cancelled.'")
 assert page.evaluate("$('menuSettingPreset').value==='auto' && !!progressRead('catroomsGfxAuto')")
 page.evaluate("$('menuSettingsDefaultsBtn').click();$('pixelNavPlay').click()")
 print('PASS offline AUTO selection, five-preset benchmark, persistence and cancellation (mock WebGPU queue)')

 # Position the camera toward a nearby floor model to exercise the decor draw path.
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const p=gameSession.props.find(p=>p.type==='decor'&&p.solid);if(!p)return false;
 const candidates=[[1,0],[-1,0],[0,1],[0,-1]];const step=candidates.find(([dx,dy])=>gameSession.world[p.cellY+dy]?.[p.cellX+dx]===0);if(!step)return false;
 gameSession.player.x=p.x+step[0];gameSession.player.y=p.y+step[1];gameSession.player.a=Math.atan2(-step[1],-step[0]);gameSession.resetInterpolation();gpuRenderer.render();const submitted=gpuRenderer.visibleDecor().some(q=>q===p)&&gpuRenderer.stats.triangles>=DECOR_MODELS[p.model].triangles;
 setState('menu');return submitted;})()""")
 print('PASS environment model render submission and shared shadow buffer')
 assert page.evaluate("""(()=>{
  for(const [level,model] of [[1,'battery'],[2,'card']]){
   begin(level,{testRun:true});
   const s=gameSession,item=s.fuses[0],player=s.player;
   Object.assign(player,{x:item.x,y:item.y,a:0,pitch:-.75});
   update(0);
   if(item.taken||player.collected!==0)return false;
   if($('interactHint').textContent!=='[ E ] PICK UP '+model.toUpperCase())return false;
   s.resetInterpolation();
   const visible=()=>gpuRenderer.visiblePickups(captureRenderCamera()).some(p=>p.item===item&&p.model===model);
   if(!visible())return false;
   gpuRenderer.render();
   if(gpuRenderer.stats.triangles<gpuRenderer.modelMeshes[model].indexCount/3)return false;
   if(level===1)window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyE'}));
   else $('interactBtn').click();
   if(!item.taken||player.collected!==1||visible()||Number(UI.count.textContent)!==1)return false;
   if(level===1&&s.wakeAt!==s.elapsed+5)return false;
   setState('menu');
  }
  return true;
 })()""")
 print('PASS 3D floor pickups, E and touch interaction, objective count and enemy wake timer')
 result=page.evaluate("""()=>{
   begin(3,{testRun:true});
   const s=gameSession,player=s.player;
   s.guards=[];s.props=[];s.bonusItems=[];s.safeRoom=null;s.safeRoomFurniture=[];
   const reactor=s.terminals[0];
   const key=(event,code)=>window.dispatchEvent(new KeyboardEvent(event,{code}));
   Object.assign(player,{x:reactor.x-.8,y:reactor.y});
   key('keydown','KeyE');
   updateInteractionHold(5.5);
   const requiredHold=!reactor.used&&s.interactionHold?.elapsed===5.5;
   key('keyup','KeyE');
   updateInteractionHold(.3);
   const released=!reactor.used&&!s.interactionHold;
   key('keydown','KeyE');
   updateInteractionHold(5.75);
   key('keyup','KeyE');
   const activated=reactor.used;
   const shield={type:'shield',name:'SHIELD',x:player.x,y:player.y};
   s.bonusItems=[shield];
   update(0);
   const untouched=!shield.taken&&!ensureInventory().shield;
   key('keydown','KeyE');key('keyup','KeyE');
   const stored=shield.taken&&ensureInventory().shield===1&&!damageBlocked('hazard');
   UI.map.classList.remove('expanded');
   window.dispatchEvent(new WheelEvent('wheel',{deltaY:-100,cancelable:true}));
   const selected=s.inventorySlot===3&&$('inventoryShield').getAttribute('aria-pressed')==='true';
   key('keydown','Digit1');key('keyup','Digit1');
   const noHotkey=ensureInventory().shield===1;
   C.dispatchEvent(new MouseEvent('mousedown',{button:2,bubbles:true,cancelable:true}));
   const used=ensureInventory().shield===0&&player.shieldUntil===s.elapsed+12&&damageBlocked('hazard');
   setState('menu');
   return {requiredHold,released,activated,untouched,stored,selected,noHotkey,used};
 }""")
 assert all(result.values()),result
 print('PASS deferred shield use, scroll/RMB inventory, and continuous reactor hold')

 assert page.evaluate("""(()=>{begin(1,{testRun:true});const exp=gpuRenderer.worldGeometry;
 if(!exp.available||exp.enabled)return false;
 window.dispatchEvent(new KeyboardEvent('keydown',{code:'F8'}));gpuRenderer.render();
 if(!exp.enabled||gpuRenderer.stats.wallTriangles<=0||gpuRenderer.stats.planeTriangles<=0)return false;
 const buf=exp.vertexBuffer;gpuRenderer.render();if(buf!==exp.vertexBuffer)return false;
 markWorldChanged();gpuRenderer.render();if(buf===exp.vertexBuffer)return false;
 window.dispatchEvent(new KeyboardEvent('keydown',{code:'F8'}));gpuRenderer.render();
 const ok=!exp.enabled&&gpuRenderer.stats.wallTriangles===0&&gpuRenderer.stats.planeTriangles===0;setState('menu');return ok;})()""")
 print('PASS opt-in raster world surfaces, cached geometry, map revision and classic fallback')
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const r=gpuRenderer,exp=r.worldGeometry;
 if(!window.CatroomsMaterials.available||!r.hdEnabled||!window.CatroomsPBR.enabled)return false;
 const key=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code}));
 key('F8');r.render();const buf=exp.vertexBuffer,bind=exp.resolveBind;
 key('F9');r.render();if(r.hdEnabled||window.CatroomsPBR.enabled||!exp.enabled||exp.resolveBind===bind||exp.vertexBuffer!==buf)return false;
 key('F9');r.render();if(!r.hdEnabled||!window.CatroomsPBR.enabled||!exp.enabled)return false;
 key('F8');r.render();key('F9');r.render();if(r.hdEnabled||exp.enabled)return false;
 key('F9');r.render();const ok=r.hdEnabled&&!exp.enabled;setState('menu');return ok;})()""")
 print('PASS HD albedo + PBR detail decoding and F8/F9 independent toggles, bind refresh')
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const r=gpuRenderer;const key=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,cancelable:true}));
 const old=r.lightingEnabled;key('F10');r.render();if(r.lightingEnabled===old||r.frameData[RENDER_FRAME.lighting]!==(!old?(r.wallShadowsEnabled?2:1):0))return false;
 key('F10');gameSession.player.pitch=1.1;r.render();const up=Math.abs(r.frameData[RENDER_FRAME.weather+3]-1.1)<1e-6;
 gameSession.player.pitch=-1.1;r.render();const down=Math.abs(r.frameData[RENDER_FRAME.weather+3]+1.1)<1e-6;
 gameSession.player.pitch=0;setState('menu');return up&&down&&r.lightingEnabled===old;})()""")
 print('PASS F10 local lighting toggle and real pitch frame data (mock GPU)')
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const r=gpuRenderer;const key=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,cancelable:true}));
 r.render();if(!r.wallShadowsEnabled||r.frameData[RENDER_FRAME.lighting]!==2)return false;
 key('F7');r.render();if(r.wallShadowsEnabled||r.frameData[RENDER_FRAME.lighting]!==1)return false;
 key('F8');r.render();key('F7');r.render();if(!r.worldGeometry.enabled||r.frameData[RENDER_FRAME.lighting]!==2)return false;
 key('F10');r.render();if(r.frameData[RENDER_FRAME.lighting]!==0||!r.wallShadowsEnabled)return false;
 key('F10');key('F8');r.render();const ok=window.CatroomsLighting.activeWallShadows&&r.frameData[RENDER_FRAME.lighting]===2&&!r.worldGeometry.enabled;setState('menu');return ok;})()""")
 print('PASS F7 wall-shadow switch, F8 geometry and F10 lighting modes (mock GPU)')
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const r=gpuRenderer;const key=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,cancelable:true}));
 gameSession.player.flash=true;r.flashlightState=null;r.render();if(!r.flashlightEnabled||r.frameData[RENDER_FRAME.flashlight+2]!==1)return false;
 key('F6');r.render();if(r.flashlightEnabled||r.frameData[RENDER_FRAME.flashlight+3]!==0)return false;
 key('F8');key('F10');key('F6');r.render();if(!r.flashlightEnabled||!r.worldGeometry.enabled||r.lightingEnabled)return false;
 gameSession.player.flash=false;r.flashlightState=null;r.render();if(r.frameData[RENDER_FRAME.flashlight+2]!==0)return false;
 key('F8');key('F10');setState('menu');return true;})()""")
 print('PASS F6 flashlight, flash toggle and independence from F8/F10 (mock GPU)')
 assert page.evaluate("""(()=>{begin(1,{testRun:true});const r=gpuRenderer,p=r.post;const key=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,cancelable:true}));
 if(!window.CatroomsPostFX.available||!p.enabled||r.sceneFormat!=='rgba16float')return false;
 r.render();const old=p.index;if(p.passes!==4)return false;r.render();if(old===p.index)return false;
 key('F4');r.render();if(p.enabled||p.passes!==1||!p.reset)return false;
 key('F8');key('F4');r.render();if(!p.enabled||p.passes!==4||!r.worldGeometry.enabled)return false;
 key('F8');const tex=p.scene;p.resize(321,241);if(p.scene===tex||p.bloomWidth!==81||p.bloomHeight!==61||!p.reset)return false;
 p.resize(r.lastWidth,r.lastHeight);r.render();setState('menu');r.renderMenu(performance.now());const active=p.passes===4&&!p.reset&&r.frameData[RENDER_FRAME.lighting]===2&&CatroomsPBR.enabled;
 r.lightingEnabled=false;p.enabled=false;r.renderMenu(performance.now());
 const bypass=p.passes===1&&p.reset&&r.frameData[RENDER_FRAME.lighting]===0;
 r.lightingEnabled=true;p.enabled=true;
 return active&&bypass;})()""")
 print('PASS CP08 post-processing, F4/F8, history, resize, PBR lighting and menu HDR preferences (mock GPU)')
 # Simulate an existing saved HARD campaign in another fresh document.
 saved=b.new_page(viewport={'width':640,'height':480});saved.on('pageerror',lambda e:errors.append(str(e)))
 storage="<script>Object.defineProperty(window,'localStorage',{value:new MapStorage(),configurable:true});function MapStorage(){const data=new Map([['catroomsBossRushUnlocked','1'],['catroomsDifficulty','hard'],['catroomsCfgMaster','broken'],['catroomsCfgEffects','NaN'],['catroomsCfgAmbient',''],['catroomsCfgMouse','Infinity'],['catroomsBestStreak','Infinity'],['catroomsWinStreak','-5'],['catroomsBest6','Infinity']]);this.getItem=k=>data.get(k)??null;this.setItem=(k,v)=>data.set(k,String(v));this.removeItem=k=>data.delete(k);}</script>"
 saved.set_content(html.replace('<head>','<head>'+shim+storage,1),wait_until='load',timeout=30000)
 saved.wait_for_function("window.CatroomsGraphicsStatus?.backend==='webgpu' && gameSession.world.length>0",timeout=15000)
 assert saved.evaluate("!window.CatroomsStartupError && selectedDifficulty==='hard' && bossRushVisible()&&!$('bossRushBtn').hidden")
 assert saved.evaluate("gameSettings.master===100&&gameSettings.effects===100&&gameSettings.ambient===100&&gameSettings.mouseSensitivity===1&&winStreak===0&&bestStreak===0&&readBestTime(6)===0")
 print('PASS malformed saved settings, streak and records recover to safe values')
 saved.close()
 page.evaluate("chooseDifficulty('normal')")
 # Exercise actual menu listeners, not just begin() directly.
 page.evaluate("$('startBtn').click()")
 assert page.evaluate("gameSession.state==='menu' && selectedSector===1")
 page.evaluate("$('enterSector').click()")
 page.wait_for_function("gameSession.state==='playing' && gameSession.level===1")
 page.evaluate("setState('menu');CatroomsPixelMenu.open('custom');$('customSize').value='49';$('customSeed').value='12345';$('customDrinks').value='2';$('customDark').checked=true;$('customLoot').checked=false;$('presetName').value='Test preset';$('presetSave').click();$('customSize').value='65';$('presetLoad').click()")
 assert page.evaluate("$('customSize').value==='49' && $('customSeed').value==='12345' && $('customDrinks').value==='2'")
 page.evaluate("$('customStartBtn').click()")
 page.wait_for_function("gameSession.state==='playing' && gameSession.level===13")
 assert page.evaluate("gameSession.N===49 && gameSession.player.inventory.energy.length===2 && !gameSession.player.flash && hardSeed===12345 && gameSession.bonusItems.every(x=>x.type==='coin'||x.type==='key')")
 page.evaluate("pause()")
 assert page.evaluate("$('pauseTime').textContent.includes('ROUND TIME') && $('pauseObjective').textContent.length>0")
 page.evaluate("$('pauseRestartBtn').click()")
 assert page.evaluate("gameSession.state==='playing'&&gameSession.level===13&&hardSeed===12345")
 page.evaluate("setState('menu');progressWrite('catroomsBossRushUnlocked','1');refreshLevelButton();CatroomsPixelMenu.open('play');$('bossRushBtn').click();$('enterSector').click()")
 page.wait_for_function("gameSession.state==='playing' && gameSession.level===12")
 page.evaluate("setState('menu');begin(1);gameSession.clock=42;gameSession.stats.coins=3;finish(true);CatroomsPixelMenu.select('player')")
 assert page.evaluate("profile.seconds>=42 && profile.coins>=3 && profile.wins>=1 && $('endTitle').textContent==='VICTORY' && $('endRecord').textContent==='NEW PERSONAL RECORD' && $('endExplored').textContent.includes('%')")
 page.evaluate("setState('menu');begin(1);gameSession.clock=10;gameSession.deathBy='pig';finish(false)")
 assert page.evaluate("profile.deaths>=1 && $('endKiller').textContent.includes('CHRUM')")
 page.evaluate("setState('menu')")
 print('PASS selected-sector entry, custom presets/options, pause restart, profile totals and end screens')
 # Test the warning with controlled clock/guards, without depending on random AI movement.
 page.evaluate("begin(6,{testRun:true});godMode=true;gameSession.guards=[{state:'patrol',variant:'classic'}];gameSession.elapsed=10;syncDetectionHUD();gameSession.guards[0].state='chase';syncDetectionHUD();")
 assert page.evaluate("!$('detectionWarning').hidden && $('mapRunDetails').hidden && getComputedStyle($('stealthStatus')).display==='none' && getComputedStyle($('eventTag')).display==='none'")
 assert page.evaluate("$('versionBadge').getBoundingClientRect().width===0")
 page.evaluate("gameSession.elapsed=11.01;syncDetectionHUD();toggleMap();")
 assert page.evaluate("$('detectionWarning').hidden && !$('mapRunDetails').hidden && $('mapDetectionDetails').textContent==='DETECTED' && $('mapLevelDetails').textContent.includes('YELLOW CORRIDORS')")
 page.evaluate("toggleMap();gameSession.guards[0].state='patrol';syncDetectionHUD();gameSession.guards[0].state='chase';syncDetectionHUD();")
 assert page.evaluate("!$('detectionWarning').hidden && $('mapRunDetails').hidden")
 page.evaluate("setState('menu')")
 print('PASS M toggles details, one-second detection pulse, re-detection and no gameplay version strip')
 print('PASS actual menu Start, Custom and unlocked Boss Rush click handlers')
 print('PASS cold and saved HARD/unlocked Boss Rush startup')
 assert page.evaluate("""synthAttempts===0 &&
  ['pickup','hurt','appearScream','menuMusic'].every(key=>sfxTemplates[key].src.startsWith('data:audio/')) &&
  Object.entries(REPLACEMENT_SFX_FILES).every(([id,url])=>url===null?!sfxTemplates[id]:url.startsWith('data:audio/')&&!!sfxTemplates[id])""")
 print('PASS recorded audio and optional replacements load offline without JS audio synthesis')
 print('PASS full standalone DOM startup, real image decode and model loading (mock GPU)')
 for level in [1,2,3,4,5,6,7,8,9,10,11,12,13]:
  result=page.evaluate('n=>{requestedSeed=12345;begin(n,{testRun:true});godMode=true;return {state:gameSession.state,level:gameSession.level,size:gameSession.world.length};}',level)
  assert result['state']=='playing' and result['level']==level and result['size']>0, result
  page.wait_for_function("gameSession.clock>0",timeout=6500)
  page.evaluate('pause()')
  assert page.evaluate("gameSession.state==='paused'")
  page.evaluate("setState('menu')")
 print('PASS 13 mode starts, rendered-frame calls, pause and return to menu')
 result=page.evaluate("""()=>{
   const ids=['doorOpen','doorClose','doorLocked','humFlooded','repairKeypad','repairMetal','beepBeep'];
   const embedded=ids.every(id=>sfxTemplates[id]?.src.startsWith('data:audio/mpeg;base64,'));
   const realSample=createGameSample,heard=[];
   createGameSample=(id,...args)=>{
     if(ids.includes(id))heard.push(id);
     return realSample(id,...args);
   };
   const next=(x,y,matches)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{
     Object.assign(gameSession.player,{x:x+.5+dx,y:y+.5+dy});
     return freeAt(gameSession.player.x,gameSession.player.y,.22)&&matches(findInteractable());
   });
   const repair=()=>{
     const {x,y}=gameSession.player;
     gameSession.hardEmergency={x,y,time:45};
     gameSession.interactables=[{type:'repair',id:'hard-repair',x,y}];
     interact();
     updateInteractionHold(REACTOR_HOLD_SECONDS);
     return repairKeypadAudio;
   };
   try{
     begin(2,{testRun:true});
     const track=bgTracks.hum;
     const water=!!track&&track.loop&&track.src===sfxTemplates.humFlooded.src;
     pause();const waterPauses=track?.paused;
     resume();
     const gate=gameSession.doors.find(d=>d.requires?.cards===1);
     if(!gate||!next(gate.x,gate.y,t=>t?.ref===gate))throw Error('Missing gate approach');
     interact();
     const locked=!gate.open&&heard.at(-1)==='doorLocked';
     gameSession.player.collected=1;
     interact();
     const opened=gate.open&&heard.at(-1)==='doorOpen';
     const room=gameSession.safeRoom;
     if(!room||!next(room.doorX,room.doorY,t=>t?.ref===room))throw Error('Missing safe-room approach');
     interact();interact();
     const closed=!room.open&&heard.slice(-2).join(',')==='doorOpen,doorClose';
     const exit=gameSession.exitCell;
     if(!next(exit.x,exit.y,t=>t?.type==='lockedExit'))throw Error('Missing locked exit approach');
     interact();
     const lockedExit=heard.at(-1)==='doorLocked';
     begin(6,{testRun:true});
     const onlyFlooded=!bgTracks.hum||bgTracks.hum.src!==sfxTemplates.humFlooded.src;
     heard.length=0;
     const first=repair();
     const beforeBeep=heard.join(',')==='repairKeypad,repairMetal'&&!gameSession.hardEmergency;
     first.dispatchEvent(new Event('ended'));
     const sequence=heard.join(',')==='repairKeypad,repairMetal,beepBeep';
     const second=repair();
     pause();second.dispatchEvent(new Event('ended'));
     const cancelled=heard.filter(id=>id==='beepBeep').length===1;
     resume();
     gameSession.guards=[{state:'patrol',variant:'classic'}];
     syncDetectionHUD();
     gameSession.guards[0].state='chase';syncDetectionHUD();syncDetectionHUD();
     const detected=heard.filter(id=>id==='beepBeep').length===2;
     return {embedded,water,waterPauses,locked,opened,closed,lockedExit,onlyFlooded,beforeBeep,sequence,cancelled,detected};
   }finally{
     createGameSample=realSample;
     setState('menu');
   }
 }""")
 assert all(result.values()),result
 print('PASS Flooded Complex ambience, door cues, ordered reactor repair and one detection sample per alert')

 # Test the real E interaction and renderer-only tile override, not just the model loader.
 result=page.evaluate("""()=>{
   begin(1,{testRun:true});godMode=true;gameSession.guards=[];gameSession.awake=false;
   const r=gameSession.safeRoom;if(!r)throw Error('Yellow Corridors has no safe room');
   const x=r.doorX,y=r.doorY,dx=Math.sign(r.centerX-x-.5),dy=Math.sign(r.centerY-y-.5);
   // Select the actual outside passage (side or corner-independent).
   const outside=[[1,0],[-1,0],[0,1],[0,-1]].find(([a,b])=>gameSession.world[y+b]?.[x+a]===0 && Math.hypot(x+.5+a-r.centerX,y+.5+b-r.centerY)>Math.hypot(x+.5-r.centerX,y+.5-r.centerY));
   if(!outside)throw Error('Missing safe room approach');
   const [ox,oy]=outside;Object.assign(gameSession.player,{x:x+.5+ox,y:y+.5+oy,a:Math.atan2(-oy,-ox)});
   gameSession.elapsed=10;gpuRenderer.syncStaticBuffers();
   const d=gpuRenderer.doorLayout.find(q=>q.room===r);if(!d)throw Error('Missing door layout');
   const closed=gpuRenderer.doorPoses(gameSession.player).find(q=>q[6]===4&&Math.hypot(q[0]-x-.5,q[1]-y-.5)<.001);
   if(!closed)throw Error('Closed door pose missing');
   const blocked=gameSession.world[y][x]===4&&!freeAt(x+.5,y+.5)&&gpuRenderer.tilesData[y*128+x]===0&&gpuRenderer.gpuTilesData[y*128+x]===256;
   const opened=safeRoomInteraction(r)&&r.open&&gameSession.world[y][x]===0&&freeAt(x+.5,y+.5);
   gpuRenderer.syncStaticBuffers();const openLight=gpuRenderer.gpuTilesData[y*128+x]===0;gpuRenderer.doorPoses(gameSession.player);gameSession.elapsed=10.3;
   const swung=gpuRenderer.doorPoses(gameSession.player).some(q=>q[6]===4&&Math.abs(q[4]*closed[4]+q[5]*closed[5])<.001&&Math.hypot(q[0]-x-.5,q[1]-y-.5)<1);
   gameSession.player.x=x+.5;gameSession.player.y=y+.5;safeRoomInteraction(r);const cannotCrush=r.open;
   gameSession.player.x=x+.5+ox;gameSession.player.y=y+.5+oy;safeRoomInteraction(r);const reclosed=!r.open&&gameSession.world[y][x]===4&&!freeAt(x+.5,y+.5);
   gpuRenderer.syncStaticBuffers();const closedLight=gpuRenderer.gpuTilesData[y*128+x]===256;
   const slot=gameSession.interactables.find(q=>q.type==='slot');
   const spot=[[0,1],[0,-1],[1,0],[-1,0]].map(([a,b])=>({x:slot.x+a*1.15,y:slot.y+b*1.15})).find(p=>freeAt(p.x,p.y)&&lineOfSight(p.x,p.y,slot.x,slot.y,{allowTargetFurniture:true}));
   if(!spot)throw Error('Slot not reachable');Object.assign(gameSession.player,spot);gameSession.player.coins=2;slotMachineSpin(slot);const slotWorks=gameSession.player.coins===1;
   const exit=gameSession.exitCell;const exitModel=gpuRenderer.doorLayout.some(q=>q.exit)&&gameSession.world[exit.y][exit.x]===3;
   begin(2,{testRun:true});gpuRenderer.syncStaticBuffers();const otherSector=gpuRenderer.doorLayout.length===0;
   return {blocked,opened,swung,cannotCrush,reclosed,openLight,closedLight,slotWorks,exitModel,otherSector};
 }""")
 assert all(result.values()),result
 print('PASS Yellow Corridors imported door hinge animation, closed/open collision, blocked closure, exit model, unchanged other sectors and slot interaction')
 page.evaluate("setState('menu')")

 page.set_viewport_size({'width':1280,'height':720})
 page.evaluate("begin(6,{testRun:true});godMode=true")
 page.wait_for_timeout(200)
 assert page.evaluate("['hpWrap','staminaWrap','fieldInventory'].every(id=>getComputedStyle($(id)).backgroundImage==='none' && getComputedStyle($(id)).boxShadow==='none') && getComputedStyle(document.querySelector('#hud .objective')).backgroundImage==='none'")
 page.evaluate("pause()")
 assert page.evaluate("$('pauseCard').getBoundingClientRect().width<=471 && $('pauseCard').getBoundingClientRect().height<670")
 page.set_viewport_size({'width':375,'height':667});page.evaluate("setState('menu');CatroomsPixelMenu.open('custom')")
 page.wait_for_timeout(100)
 assert page.evaluate("$('pixelCustomPanel').getBoundingClientRect().width<=375 && document.querySelector('.pixel-panel-area').scrollHeight>document.querySelector('.pixel-panel-area').clientHeight")
 page.set_viewport_size({'width':640,'height':480})
 print('PASS desktop HUD and pause layout, mobile custom panel scroll')
 page.evaluate('begin(4,{testRun:true});godMode=false;lose("pig");')
 assert page.evaluate("gameSession.state==='jumpscare'")
 page.evaluate('begin(1,{testRun:true});godMode=true;')
 page.wait_for_timeout(1100)
 assert page.evaluate("gameSession.state==='playing' && !$('jump').classList.contains('show')")
 page.evaluate('pause()');clock=page.evaluate('gameSession.clock')
 page.wait_for_timeout(150);assert page.evaluate('gameSession.clock')==clock
 page.evaluate('resume()');page.wait_for_timeout(100);assert page.evaluate('gameSession.clock')>clock
 page.evaluate("transit(()=>begin(4,{testRun:true}),'TEST');setState('menu')")
 page.wait_for_timeout(800);assert page.evaluate("gameSession.state==='menu' && !$('transition').classList.contains('active')")
 # Pointer lock may fail with/without a promise, depending on browser and activation.
 page.evaluate("C.requestPointerLock=()=>{throw Error('Denied')};begin(1,{testRun:true})")
 assert page.evaluate("gameSession.state==='playing'")
 page.evaluate("C.requestPointerLock=()=>Promise.reject(Error('Denied'));pause();resume();C.click()")
 page.wait_for_timeout(100)
 assert page.evaluate("gameSession.state==='playing'")
 print('PASS sync and async pointer-lock rejection does not abort a round')
 page.evaluate("resolveMockGpuLoss({message:'Simulated device loss'})")
 page.wait_for_function("window.CatroomsGraphicsStatus.backend==='webgpu-lost'")
 assert page.evaluate("gpuRenderer===null&&gameSession.state==='paused'&&!!$('graphicsFailure')")
 page.evaluate("resume();begin(1,{testRun:true})")
 assert page.evaluate("gameSession.state==='paused'&&gpuRenderer===null")
 print('PASS simulated WebGPU loss stops renderer, pauses game, blocks resume and offers reload')
 assert not errors,errors
 print('PASS restart during jumpscare, paused clock, cancelled transition and no page errors')
 b.close()
