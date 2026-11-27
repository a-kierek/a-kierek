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

