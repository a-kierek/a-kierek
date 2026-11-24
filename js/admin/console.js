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
  adminResume=state==='playing';if(adminResume)pause();
  adminPanel.classList.add('open');adminOpen=true;
  adminInput.focus();adminInput.select();
 }else{
  adminOpen=false;adminPanel.classList.remove('open');adminInput.blur();
  if(adminResume&&state==='paused')resume();adminResume=false;
 }
}
function adminUsed(){runCheated=true}
function adminRun(text){
 const args=text.trim().split(/\s+/),cmd=(args.shift()||'').toLowerCase(),arg=args[0]?.toLowerCase();
 if(!cmd)return;
 if(coop.role==='guest'){adminPrint('Komendy administratora sa dostepne wylacznie u hosta.');return;}
 adminPrint('> '+text);
 const commands={
  help:'help · status · god on/off · heal · reveal · give all · open doors · enemies clear · spawn pig · level 1..11 · hard 1..5 · unlock all · coins ILE · tp safe/exit · seed LICZBA · hardseed SEED [ETAP] · streak reset · rage',
  status:`Level ${level} | stan ${state} | przedmioty ${player.collected||0}/${GOAL} | wrogowie ${guards.length} | seria ${winStreak} (rekord ${bestStreak}) | grosze ${player.coins||0} | bezpieczny pokoj ${safeRoom?'TAK':'BRAK'} | seed ${(isHardMode()?hardSeed:proceduralSeed)>>>0}`
 };
 if(cmd==='help'||cmd==='status'){adminPrint(commands[cmd]);return}
 if(cmd==='god'){
  if(!['on','off'].includes(arg)){adminPrint('Uzycie: god on | god off');return}
  godMode=arg==='on';adminUsed();adminPrint('Niezniszczalnosc: '+(godMode?'WLACZONA':'WYLACZONA'));return;
 }
 if(cmd==='heal'){player.stamina=100;UI.stamina.style.width='100%';adminUsed();adminPrint('Wytrzymalosc uzupelniona.');return}
 if(cmd==='reveal'||cmd==='map'){
  seen=Array.from({length:N},()=>Array(N).fill(true));mapOn=true;UI.map.classList.add('visible');drawMap();adminUsed();adminPrint('Odkryto mape.');return;
 }
 if(cmd==='give'&&arg==='all'){
  for(const f of fuses)f.taken=true;player.collected=GOAL;UI.count.textContent=GOAL;
  for(const t of terminals)t.used=true;updateObjectiveFacility();adminUsed();
  adminPrint('Przedmioty i panele zaliczone. Idz do wyjscia.');return;
 }
 if(cmd==='open'&&arg==='doors'){
  for(const d of doors){d.open=true;world[d.y][d.x]=0}
  adminUsed();adminPrint('Wszystkie bramy otwarte.');return;
 }
 if(cmd==='enemies'&&arg==='clear'){
  guards=[];awake=false;nearCat=Infinity;adminUsed();adminPrint('Usunieto przeciwnikow.');return;
 }
 if(cmd==='spawn'&&arg==='pig'){
  const points=[];for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
   if(world[y][x]===0&&Math.hypot(player.x-x-.5,player.y-y-.5)>4&&Math.hypot(player.x-x-.5,player.y-y-.5)<8)points.push({x:x+.5,y:y+.5})
  }
  const p=points[Math.floor(Math.random()*points.length)];if(!p){adminPrint('Brak wolnego pola.');return}
  guards.push(makeGuard(p.x,p.y,'pig'));adminUsed();adminPrint('CHRUM pojawil sie na mapie.');return;
 }
 if(cmd==='unlock'&&arg==='all'){
  unlocked2=unlocked3=unlocked4=unlocked5=true;
  for(let k=2;k<=5;k++){progressWrite('catroomsUnlocked'+k,'1');hardUnlocked[k]=true;progressWrite('catroomsHardUnlocked'+k,'1');}
  refreshLevelButton();adminUsed();adminPrint('Odblokowano NORMAL i HARD: poziomy 2, 3, 4 i 5.');
  if(state==='menu')setState('menu');
  return;
 }
 if(cmd==='level'||cmd==='hard'){
  const target=Number(arg);
  const n=cmd==='hard'?(target===5?11:target+5):target;
  if(!Number.isInteger(target)||(cmd==='hard'&&(target<1||target>5))||(cmd==='level'&&(n<1||n>11))){adminPrint('Uzycie: level 1..11 | hard 1..5');return}
  unlocked2=unlocked3=unlocked4=unlocked5=true;for(let k=2;k<=5;k++)hardUnlocked[k]=true;
  adminToggle(false);begin(n);adminUsed();adminPrint('Uruchomiono '+(n===11?'HARD 5':n>=6&&n<=9?'HARD '+(n-5):n===10?'SEKTOR 05':'Level '+n)+' (runda testowa).');return;
 }
 if(cmd==='coins'){
  const amount=Number(arg);if(!Number.isInteger(amount)||amount<0||amount>999){adminPrint('Uzycie: coins 10 (0..999)');return}
  player.coins=amount;updateCoinCounter();adminUsed();adminPrint('Grosze: '+amount);return;
 }
 if(cmd==='tp'&&arg==='safe'){
  if(!safeRoom){adminPrint('Brak bezpiecznego pokoju na mapie.');return}
  player.x=safeRoom.centerX;player.y=safeRoom.centerY;adminUsed();updateCoinCounter();adminPrint('Przeniesiono do bezpiecznego pokoju.');return;
 }
 if(cmd==='tp'&&arg==='exit'){
  player.x=exitCell.x+.5;player.y=exitCell.y+.5;
  adminUsed();adminPrint('Przeniesiono pod wyjscie.');return;
 }
 if(cmd==='seed'){
  if(arg==null||!Number.isFinite(+arg)){adminPrint('Uzycie: seed 123456');return}
  requestedSeed=(+arg)|0;adminToggle(false);begin(5);adminUsed();
  adminPrint('Wczytano proceduralny seed '+(proceduralSeed>>>0)+'.');return;
 }
 if(cmd==='hardseed'){
  if(arg==null||!Number.isFinite(+arg)){adminPrint('Uzycie: hardseed 123456');return}
  const stage=args[1]==null?1:Number(args[1]);if(!Number.isInteger(stage)||stage<1||stage>5){adminPrint('Uzycie: hardseed 123456 [1..5]');return}
  requestedSeed=(+arg)|0;for(let k=2;k<=5;k++)hardUnlocked[k]=true;adminToggle(false);begin(stage===5?11:stage+5);adminUsed();
  adminPrint('Wczytano HARD etap '+stage+' · seed '+(hardSeed>>>0)+'.');return;
 }
 if(cmd==='streak'&&arg==='reset'){
  winStreak=0;progressWrite('catroomsWinStreak','0');streakRender();adminUsed();adminPrint('Wyzerowano biezaca serie. Rekord zachowany.');return;
 }
 if(cmd==='rage'){
  if(state==='paused'){adminPrint('Wlacz / wylacz rage po zamknieciu konsoli (R).');return}
  toggleRage();adminUsed();return;
 }
 adminPrint('Nieznana komenda. Wpisz help.');
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
$('adminPauseBtn').addEventListener('click',()=>adminToggle(true));
