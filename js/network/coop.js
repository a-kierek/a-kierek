// Feature switch: matchmaking and networking are intentionally paused.
// Set to true during future multiplayer development. All sources remain intact.
const COOP_ENABLED=false;
// THE CATROOMS / CO-OP: one browser-host authoritative game, Node WebSocket room relay.
// GitHub Pages is only static hosting; hosting from another device needs HTTPS/WSS tunnel.
const coop={
 role:'solo',ws:null,room:'',self:'',players:[],remotes:new Map(),status:'offline',
 inputTimer:0,snapshotTimer:0,round:0,active:false,received:false,lastLocalHp:100,
 lastUpdate:0, server:'',pendingLevel:0,hostPaused:false,
 send(data){if(this.ws?.readyState===WebSocket.OPEN){this.ws.send(JSON.stringify(data));return true}return false},
 log(message,error=false){const el=$('coopStatus');if(el){el.textContent=message;el.classList.toggle('coop-error',!!error)}},
 openLobby(){if(!COOP_ENABLED)return;if(state==='playing'&&this.role==='solo')pause();else if(this.role==='solo'&&state!=='menu')setState('menu');$('coopLobby').classList.add('open');$('coopLobby').setAttribute('aria-hidden','false');this.refresh();},
 closeLobby(){ $('coopLobby').classList.remove('open');$('coopLobby').setAttribute('aria-hidden','true');},
 refresh(){
  $('coopRoomDisplay').textContent=this.room||'------';
  $('coopRoleDisplay').textContent=this.role==='host'?'HOST':this.role==='guest'?'GRACZ':'BRAK POLACZENIA';
  $('coopCreate').disabled=this.role!=='solo';$('coopJoin').disabled=this.role!=='solo';
  $('coopLaunch').disabled=this.role!=='host'||this.active;
  $('coopLeave').disabled=this.role==='solo';
  $('coopCodeCopy').disabled=!this.room;
  const el=$('coopRoster');el.textContent='';
  for(const p of this.players){const li=document.createElement('div');li.className='coop-person';li.textContent=(p.id===this.self?'● ':'○ ')+p.name+(p.id==='host'?' · HOST':'');el.append(li)}
  if(!this.players.length){const li=document.createElement('div');li.textContent='Brak graczy. Utworz pokoj albo dolacz.';el.append(li)}
  $('coopHud').textContent=this.role==='solo'?'':`CO-OP · ${this.room} · ${this.players.length}/4`;
  $('coopHud').style.display=this.role==='solo'?'none':'block';
 },
 defaultUrl(){if(location.protocol==='file:'||!location.host)return 'ws://localhost:8765/ws';return (location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws'},
 connect(type){
  if(!COOP_ENABLED)return;
  if(this.role!=='solo'||this.ws?.readyState===WebSocket.CONNECTING)return;
  const raw=$('coopServerUrl').value.trim()||this.defaultUrl();let url;
  try{url=new URL(raw);if(!['ws:','wss:'].includes(url.protocol))throw Error('Scheme');if(location.protocol==='https:'&&url.protocol!=='wss:')throw Error('HTTPS wymaga adresu wss:// (lub uzyj serwera LAN przez http).');}
  catch(e){this.log('Nieprawidlowy adres serwera: '+e.message,true);return;}
  const code=$('coopCodeInput').value.trim().toUpperCase();
  if(type==='join'&&!/^[A-Z2-9]{6}$/.test(code)){this.log('Wpisz szescioliterowy kod pokoju.',true);return;}
  const name=$('coopName').value.trim().slice(0,22)||'Gracz';progressWrite('catroomsCoopName',name);
  progressWrite('catroomsCoopServer',url.toString());this.server=url.toString();this.log('Laczenie z '+url.host+'...');
  let ws;
  try{ws=new WebSocket(url.toString())}catch(e){this.log('Nie udalo sie otworzyc polaczenia: '+e.message,true);return;}
  this.ws=ws;
  ws.onopen=()=>this.send({type,name,code});
  ws.onerror=()=>this.log('Blad polaczenia. Sprawdz adres, tunel i czy serwer hosta dziala.',true);
  ws.onclose=()=>{if(this.ws!==ws)return;this.ws=null;this.handleDisconnect();};
  ws.onmessage=event=>{let data;try{data=JSON.parse(event.data)}catch(e){return}this.onMessage(data)};
 },
 handleDisconnect(){const wasPlaying=this.active;this.role='solo';this.self='';this.room='';this.players=[];this.remotes.clear();this.active=false;this.received=false;this.hostPaused=false;this.refresh();
  if(wasPlaying){stopHum();stopGameSounds();setState('menu');this.openLobby();}
  this.log('Rozlaczono z serwerem. Sprawdz polaczenie hosta.',true);
 },
 leave(){const ws=this.ws;this.ws=null;if(ws){try{ws.send(JSON.stringify({type:'leave'}));ws.close()}catch(e){}}
  const inGame=this.active;this.role='solo';this.room='';this.self='';this.players=[];this.remotes.clear();this.active=false;this.received=false;this.hostPaused=false;
  if(inGame){stopHum();stopGameSounds();setState('menu');}
  this.log('Opusciles pokoj.');this.refresh();},
 onMessage(msg){if(!msg||typeof msg.type!=='string')return;
  if(msg.type==='error'){this.log(msg.message||'Blad serwera.',true);return;}
  if(msg.type==='created'||msg.type==='joined'){
    this.room=msg.code;this.self=msg.id;this.role=msg.type==='created'?'host':'guest';this.log(this.role==='host'?'Pokoj utworzony. Udostepnij kod i rozpocznij runde.':'Polaczono! Poczekaj na rozpoczecie rundy przez hosta.');this.refresh();return;
  }
  if(msg.type==='roster'){this.players=Array.isArray(msg.players)?msg.players.slice(0,4):[];if(this.role==='host'){
    for(const p of this.players){if(p.id==='host')continue;if(!this.remotes.has(p.id))this.remotes.set(p.id,this.makeRemote(p));else this.remotes.get(p.id).name=p.name;}
    for(const id of this.remotes.keys())if(!this.players.some(p=>p.id===id))this.remotes.delete(id);
  }this.refresh();return;}
  if(msg.type==='peer-left'){this.remotes.delete(msg.id);this.log('Jeden z graczy wyszedl z pokoju.');this.refresh();return;}
  if(msg.type==='host-left'){this.log('Host zamknal pokoj.',true);this.leave();this.openLobby();return;}
  if(msg.type==='start'){this.pendingLevel=msg.level;this.active=true;this.hostPaused=false;this.received=false;this.log('Host uruchamia poziom '+msg.level+'...');return;}
  if(msg.type==='input'&&this.role==='host'){
    const p=this.remotes.get(msg.id);if(!p||!msg.data)return;
    p.input=msg.data;p.lastInput=performance.now();p.a=msg.data.angle;p.pitch=msg.data.pitch;p.flash=msg.data.flash;
    p.crouching=msg.data.crouch;return;
  }
  if(msg.type==='action'&&this.role==='host'){this.handleAction(msg.id,msg.action);return;}
  if(msg.type==='snapshot'&&this.role==='guest'&&msg.frame){this.applySnapshot(msg.frame);return;}
  if(msg.type==='pause'&&this.role==='guest'){
    this.hostPaused=!!msg.paused;
    if(this.hostPaused&&state==='playing')setState('paused');
    if(!this.hostPaused&&state==='paused')resume();
    this.log(this.hostPaused?'Host zatrzymal rozgrywke.':'Host wznowil rozgrywke.');return;
  }
  if(msg.type==='round-end'&&this.role==='guest'){
    this.active=false;this.received=false;deathBy=msg.killer||'cat';if(state==='playing'||state==='paused')finish(!!msg.win);this.log('Runda zakonczona. Host moze uruchomic kolejna.');return;
  }
  if(msg.type==='chat'){$('coopLastChat').textContent=String(msg.from||'Gracz')+': '+String(msg.text||'');return;}
 },
 makeRemote(info){return {id:info.id,name:info.name,x:3.5,y:3.5,a:0,pitch:0,stamina:100,hp:100,flash:true,hidden:false,decoys:1,shieldUntil:0,lastHazardHit:-999,lastDamageAt:-999,regenBucket:0,moving:false,crouching:false,lastInput:0,lastNoise:0,input:null,collected:0}},
 start(){if(!COOP_ENABLED)return;if(this.role!=='host'||this.active)return;const next=Number($('coopLevel').value)||1;if(next<1||next>5)return;
  if(!this.send({type:'start',level:next}))return;
  this.active=true;this.hostPaused=false;this.round++;this.received=true;this.snapshotTimer=0;
  unlocked2=unlocked3=unlocked4=true;
  if(next===5)requestedSeed=null;
  this.closeLobby();begin(next);
  for(const p of this.remotes.values()){Object.assign(p,this.makeRemote(p),{id:p.id,name:p.name});this.placeRemote(p);}
  this.log('Gra CO-OP trwa · '+this.room);this.broadcastSnapshot();this.refresh();
 },
 placeRemote(p){const sx=Math.floor(player.x),sy=Math.floor(player.y);const cells=[];for(let yy=Math.max(1,sy-6);yy<Math.min(N-1,sy+7);yy++)for(let xx=Math.max(1,sx-6);xx<Math.min(N-1,sx+7);xx++)if(world[yy]?.[xx]===0&&freeAt(xx+.5,yy+.5,.24))cells.push({x:xx+.5,y:yy+.5,d:Math.hypot(xx-sx,yy-sy)});
  cells.sort((a,b)=>a.d-b.d);const used=Array.from(this.remotes.values()).filter(q=>q!==p&&q.x!=null);
  const pos=cells.find(c=>c.d>=1.2&&used.every(q=>Math.hypot(q.x-c.x,q.y-c.y)>1))||cells[0];
  p.x=pos?.x??player.x;p.y=pos?.y??player.y;p.a=player.a;p.pitch=player.pitch||0;p.stamina=100;p.hp=100;
 },
 hostFrame(dt){if(this.role!=='host'||!this.active||state!=='playing')return;
  for(const p of this.remotes.values()){const input=p.input;if(!input||performance.now()-p.lastInput>1300){p.moving=false;if(this.remoteHazard(p,dt))return;continue;}
    const forward=input.forward,strafe=input.strafe,len=Math.min(1,Math.hypot(forward,strafe));p.moving=len>.08;
    const sprint=!!input.sprint&&!input.crouch&&len>.08&&p.stamina>3;p.sprinting=sprint;
    const speed=input.crouch?1.28:sprint?3.95:2.45;
    p.stamina=clamp(p.stamina+(sprint?-33:18)*dt,0,100);
    if(p.moving){const dirX=Math.cos(p.a),dirY=Math.sin(p.a);const dx=(forward*dirX-strafe*dirY)*dt*speed/Math.max(1,len),dy=(forward*dirY+strafe*dirX)*dt*speed/Math.max(1,len);move(p,dx,dy,.22);
     if(sprint&&elapsed-p.lastNoise>.6){addNoise(p.x,p.y,level===3?12:9,'kroki coop');p.lastNoise=elapsed;}}
    if(this.remotePickups(p))updateObjectiveFacility();
    if(this.remoteHazard(p,dt))return;
  }
  if(player.collected===GOAL&&terminals.every(t=>t.used)&&[...this.remotes.values()].some(p=>Math.hypot(p.x-(exitCell.x+.5),p.y-(exitCell.y+.5))<1.55)){win();return;}
  const enemies=level===1?(awake?[cat]:[]):guards;
  for(const g of enemies)for(const p of this.remotes.values())if(Math.hypot(p.x-g.x,p.y-g.y)<.66&&lineOfSight(p.x,p.y,g.x,g.y)){lose(g.id||g.kind||'cat');return;}
  this.snapshotTimer+=dt;if(this.snapshotTimer>.10){this.snapshotTimer=0;this.broadcastSnapshot();}
 },
 remotePickups(p){let changed=false;
  for(const f of fuses){if(f.taken||Math.hypot(p.x-f.x,p.y-f.y)>.66)continue;f.taken=true;player.collected++;changed=true;playPickup();
   if(level===1){if(!awake&&wakeAt===Infinity){wakeAt=elapsed+5;showToast('CO-OP · MARMUR SIE BUDZI!',3);}if(player.collected>=GOAL){UI.goal.textContent='ODNAJDZ ZIELONE WYJSCIE';playUnlock();}}
   else{addNoise(f.x,f.y,6,'zbieranie coop');}
  }
  for(const item of bonusItems){if(item.taken||Math.hypot(p.x-item.x,p.y-item.y)>.67)continue;item.taken=true;changed=true;playPickup();
   if(item.type==='key')keysOwned.add(item.id);if(item.type==='decoy')p.decoys+=item.quantity||1;if(item.type==='stamina')p.stamina=100;if(item.type==='shield')p.shieldUntil=elapsed+12;
  }
  if(changed){UI.count.textContent=player.collected;showToast('CO-OP · DRUGI GRACZ ZEBRAL PRZEDMIOT',2)}return changed;
 },
 remoteHazard(p,dt){const h=props.find(q=>q.type==='hazard'&&Math.hypot(p.x-q.x,p.y-q.y)<.7);
  if(h&&elapsed-p.lastHazardHit>=5){p.lastHazardHit=elapsed;p.lastDamageAt=elapsed;p.regenBucket=0;p.hp=Math.max(0,p.hp-50);if(p.hp<=0){lose('hazard');return true;}}
  if(p.hp<100&&elapsed-p.lastDamageAt>=2){p.regenBucket+=dt;while(p.regenBucket>=2&&p.hp<100){p.regenBucket-=2;p.hp=Math.min(100,p.hp+10);}}
  return false;
 },
 handleAction(id,action){if(this.role!=='host'||state!=='playing')return;const p=this.remotes.get(id);if(!p)return;const hostPlayer=player;
  try{p.collected=player.collected;player=p;
    if(action==='interact'&&level>1)interact();
    else if(action==='decoy'&&level>1)throwDecoy();
  }catch(e){console.warn('Remote action:',e)}finally{player=hostPlayer;}
 },
 broadcastSnapshot(){if(this.role!=='host'||!this.active)return;
  const avatars=[{id:'host',name:this.players.find(p=>p.id==='host')?.name||'Host',...this.avatarData(player)},...Array.from(this.remotes.values()).map(p=>({id:p.id,name:p.name,...this.avatarData(p)}))];
  const frame={round:this.round,level,N,GOAL,proceduralSeed:level===5?(proceduralSeed>>>0):null,world,exitCell,elapsed,clock,awake,cat:cat?this.guardData(cat):null,guards:guards.map(g=>this.guardData(g)),fuses:fuses.map(f=>({id:f.id,x:f.x,y:f.y,taken:f.taken,phase:f.phase})),
    terminals:terminals.map(t=>({id:t.id,x:t.x,y:t.y,type:'panel',title:t.title,used:t.used,order:t.order})),doors:doors.map(d=>({...d})),props,bonusItems,interactables:interactables.filter(x=>x.type!=='panel'),decoys,playerCount:player.collected,avatars,goal:GOAL,objective:UI.goal.textContent,eventState,winStreak};
  this.send({type:'snapshot',frame});
 },
 guardData(g){return {id:g.id,kind:g.kind,x:g.x,y:g.y,a:g.a,state:g.state}},
 avatarData(p){return {x:p.x,y:p.y,a:p.a,pitch:p.pitch||0,hp:p.hp??100,stamina:p.stamina??100,flash:p.flash!==false,hidden:!!p.hidden,moving:!!p.moving,decoys:p.decoys??0}},
 applySnapshot(f){
  if(!this.active||!Number.isInteger(f.level)||!Array.isArray(f.world)||!Array.isArray(f.avatars)||f.world.length>64)return;
  const newRound=!this.received||level!==f.level;
  if(newRound){
    this.received=true;this.pendingLevel=f.level;
    unlocked2=unlocked3=unlocked4=true;
    if(f.level===5)requestedSeed=f.proceduralSeed||null;
    this.closeLobby();begin(f.level);
    this.lastLocalHp=100;
  }
  N=f.N;GOAL=f.GOAL;world=f.world;exitCell=f.exitCell;if(f.level===5){proceduralSeed=f.proceduralSeed>>>0;$('seedText').textContent=String(proceduralSeed);$('eventTag').textContent='SEED '+proceduralSeed;}elapsed=f.elapsed;clock=f.clock;awake=!!f.awake;
  if(seen.length!==N)seen=Array.from({length:N},()=>Array(N).fill(false));
  const local=f.avatars.find(x=>x.id===this.self);
  if(local){const before=player.hp??100;if(newRound){player.a=local.a;player.pitch=local.pitch;}
    // Keep local camera heading responsive; authoritative position reconciles smoothly.
    player.x+=clamp(local.x-player.x,-3,3)*.40;player.y+=clamp(local.y-player.y,-3,3)*.40;
    if(Math.hypot(local.x-player.x,local.y-player.y)>3){player.x=local.x;player.y=local.y;}
    player.hp=local.hp;player.stamina=local.stamina;player.flash=local.flash;player.hidden=local.hidden;player.decoys=local.decoys??player.decoys;
    if(player.hp<before)playHurt();refreshHpHud();UI.stamina.style.width=player.stamina+'%';
  }
  this.remoteViews=f.avatars.filter(x=>x.id!==this.self);
  // Preserve guard object identity: active 3D sound references must track moving enemies.
  const oldGuards=guards;
  guards=f.guards.map((g,i)=>{const old=oldGuards[i];if(old&&old.kind===g.kind){Object.assign(old,g);return old}return g});
  if(f.cat){if(cat&&cat.kind===f.cat.kind)Object.assign(cat,f.cat);else cat=f.cat;}
  fuses=f.fuses;terminals=f.terminals;doors=f.doors;props=f.props;bonusItems=f.bonusItems;interactables=[...f.interactables,...terminals];decoys=f.decoys||[];player.collected=f.playerCount;
  UI.count.textContent=String(player.collected);$('required').textContent=String(GOAL);UI.clock.textContent=formatTime(clock);
  if(f.objective)UI.goal.textContent=f.objective;
  eventState=f.eventState;updateSeen();
  const enemies=level===1?(awake?[cat]:[]):guards;
  nearCat=enemies.reduce((distance,g)=>Math.min(distance,Math.hypot(g.x-player.x,g.y-player.y)),Infinity);
  UI.danger.style.opacity=nearCat<5?String(clamp((5-nearCat)/3,0,1)):'0';
  const chasing=enemies.some(g=>g.state==='chase');
  $('stealthStatus').textContent=player.hidden?'● UKRYTY · WCISNIJ E':chasing?'● WYKRYTO · UCIEKAJ!':'● CO-OP · '+(player.moving?'W RUCHU':'NIEWYKRYTY');
  $('stealthStatus').style.color=chasing?'#ff847b':'#a4eadb';
  if(level>=2){updateObjectiveFacility();interactReady=findInteractable();$('interactHint').style.display=interactReady?'block':'none';if(interactReady)$('interactHint').textContent='[ E ] '+interactReady.title;}
  const complete=player.collected===GOAL&&terminals.every(t=>t.used);
  const targets=complete?[{x:exitCell.x+.5,y:exitCell.y+.5}]:[...fuses.filter(x=>!x.taken),...terminals.filter(t=>!t.used)];
  targets.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
  if(targets[0]){const t=targets[0],angle=Math.atan2(t.y-player.y,t.x-player.x)-player.a;UI.bearing.style.transform=`rotate(${angle*180/PI}deg)`;UI.signal.textContent='CEL · '+Math.round(Math.hypot(t.x-player.x,t.y-player.y))+' m';}
  this.log('W grze · pokoj '+this.room);
 },
 guestFrame(dt){if(this.role!=='guest'||!this.active||!this.received||state!=='playing')return;
  const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchY;
  const strafe=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchX;
  const crouch=!!(keys.ControlLeft||keys.ControlRight||keys.KeyC||touchCrouch),sprint=!!(keys.ShiftLeft||keys.ShiftRight||touchRun);
  const input={forward:clamp(forward,-1,1),strafe:clamp(strafe,-1,1),angle:player.a,pitch:player.pitch||0,sprint:Number(sprint),crouch:Number(crouch),flash:Number(player.flash!==false)};
  player.moving=Math.hypot(input.forward,input.strafe)>.08;
  if(player.moving){let len=Math.max(1,Math.hypot(input.forward,input.strafe));let speed=crouch?1.28:sprint?3.95:2.45;move(player,(input.forward*Math.cos(player.a)-input.strafe*Math.sin(player.a))*dt*speed/len,(input.forward*Math.sin(player.a)+input.strafe*Math.cos(player.a))*dt*speed/len,.22);walkPhase+=dt*(sprint?14:9);}
  this.inputTimer+=dt;if(this.inputTimer>=.06){this.inputTimer=0;this.send({type:'input',data:input});}
  if(mapOn&&Math.floor(elapsed*5)!==Math.floor((elapsed-dt)*5))drawMap();
 },
 avatarSprites(){if(this.role==='solo'||!this.active)return[];if(this.role==='host')return Array.from(this.remotes.values()).filter(p=>p.x!=null&&p.y!=null);return this.remoteViews||[];},
 sendAction(action){if(this.role==='guest')return this.send({type:'action',action});return false;},
 roundEnd(win,killer){if(this.role!=='host'||!this.active)return;this.active=false;this.send({type:'round-end',win,killer});this.refresh();},
 guestEnd(){if(this.role!=='guest')return;this.active=false;this.received=false;this.log('Czekaj na kolejny start hosta.');this.refresh();}
};
(function coopUI(){
 $('coopServerUrl').value=progressRead('catroomsCoopServer',coop.defaultUrl());
 $('coopName').value=progressRead('catroomsCoopName','Gracz');
 $('coopOpenBtn').addEventListener('click',()=>coop.openLobby());
 $('coopLobbyClose').addEventListener('click',()=>coop.closeLobby());
 $('coopCreate').addEventListener('click',()=>coop.connect('create'));
 $('coopJoin').addEventListener('click',()=>coop.connect('join'));
 $('coopLeave').addEventListener('click',()=>coop.leave());
 $('coopLaunch').addEventListener('click',()=>coop.start());
 $('coopCodeCopy').addEventListener('click',async()=>{if(coop.room){try{await navigator.clipboard.writeText(coop.room);coop.log('Skopiowano kod pokoju.')}catch(e){coop.log('Kod pokoju: '+coop.room)}}});
 $('coopChatSend').addEventListener('click',()=>{const input=$('coopChatInput');const text=input.value.trim();if(text){coop.send({type:'chat',text});input.value='';}});
 for(const id of ['pauseMenuBtn','menuBtn','againBtn','nextBtn'])$(id).addEventListener('click',e=>{
  if(coop.role==='solo')return;
  e.stopImmediatePropagation();e.preventDefault();
  if(id==='againBtn'&&coop.role==='host'){coop.start();return;}
  if(id==='nextBtn'&&coop.role==='host'){$('coopLevel').value=String(Math.min(5,level+1));coop.start();return;}
  stopHum();stopGameSounds();setState('menu');coop.openLobby();
 },true);
 for(const id of ['level2Btn','finalBtn','pigLevelBtn','proceduralBtn','dossierPlay'])$(id).addEventListener('click',e=>{if(coop.role!=='solo'){e.preventDefault();e.stopImmediatePropagation();coop.openLobby();}},true);
 coop.refresh();
})();
