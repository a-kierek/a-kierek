// Room identity and links are retained after generation. Tiles describe
// physical clearance, while the graph describes room access and dependencies.
function roomAt(x,y,scene=gameSession){
 const layout=scene.roomLayout;
 const col=Math.floor(x),row=Math.floor(y);
 if(!layout?.cells||!Number.isInteger(col)||!Number.isInteger(row)||
    col<0||row<0||col>=scene.N||row>=scene.N)return null;
 return layout.rooms[layout.cells[row*scene.N+col]-1]??null;
}

function attachRoomLink(layout,a,b,type,kind,from,to,gate=null){
 const edge={id:layout.connections.length+1,a:a.id,b:b.id,type,kind,from,to};
 if(gate)edge.gate=gate;
 layout.connections.push(edge);
 a.links.push(edge.id);
 b.links.push(edge.id);
 return edge;
}

function nearestLayoutRoom(layout,x,y,eligible=()=>true){
 let nearest=null,best=Infinity;
 for(const room of layout.rooms){
  if(!eligible(room))continue;
  const distance=Math.abs(x-room.x)+Math.abs(y-room.y);
  if(distance<best){nearest=room;best=distance;}
 }
 return nearest;
}

function addRoomDeck(){
 const s=gameSession,layout=s.roomLayout;
 if(!layout||![2,3,7,8].includes(s.level)||s.N+9>127)return;
 const occupied=[...s.fuses,...s.terminals,...s.bonusItems,...s.interactables,
  ...s.emergencyReactors,...s.guards,s.player];
 const sx=Math.floor(s.player.x),sy=Math.floor(s.player.y);
 const distances=bfsDistances(sx,sy);
 const eligible=layout.rooms.filter(room=>distances[room.y]?.[room.x]>12&&
  s.world[room.y][room.x]===0&&occupied.every(o=>Math.hypot(o.x-room.x-.5,o.y-room.y-.5)>2));
 const parent=eligible[Math.floor(eligible.length/2)];
 if(!parent)return;

 const oldSize=s.N;
 s.N+=9;
 for(const row of s.world)row.push(...Array(9).fill(1));
 for(let i=oldSize;i<s.N;i++)s.world.push(Array(s.N).fill(1));
 s.seen=Array.from({length:s.N},(_,y)=>Array.from({length:s.N},(_,x)=>s.seen[y]?.[x]||false));
 const floor=2,sector=parent.sector;
 const zone={id:sector+'-deck',sector,name:'Maintenance Deck',rooms:[]};
 layout.zones.push(zone);
 const random=roomRandom(layout.seed^0x3e312e01);
 const col=oldSize+3;
 const deck=createRoom(layout,{sector,zone,template:sector===2?'filtration':'workshop',
  x:col,y:12,maxW:5,maxH:7,floor,rectangular:true},random);
 const secret=createRoom(layout,{sector,zone,template:'secret',
  x:col,y:23,maxW:5,maxH:5,floor,rectangular:true},random);
 connectRooms(layout,deck,secret,'secret',1);
 const passage=layout.connections.at(-1);
 const gx=col,gy=18;
 const seal={x:gx,y:gy,open:false};
 passage.type='hidden_passage';
 passage.gate=seal;
 s.world[gy][gx]=1;
 s.interactables.push({id:'room-secret',type:'secret',x:gx+.5,y:gy+.5,
  title:'CHECK THE LOOSE PANEL',gate:seal,used:false});
 const ground={x:parent.x+.5,y:parent.y+.5};
 const upper={x:deck.x+.5,y:deck.y+.5};
 for(const [id,from,to,level] of [['room-stairs-up',ground,upper,2],['room-stairs-down',upper,ground,1]]){
  s.interactables.push({id,type:'stairs',title:level===2?'MAINTENANCE DECK':'GROUND FLOOR',
   ...from,dest:{...to,floor:level},roomStairs:true,used:false});
 }
 attachRoomLink(layout,parent,deck,'stairs','exploration',ground,upper);
 s.bonusItems.push({id:'room-secret-shield',type:'shield',name:'SHIELD',x:secret.x+.5,y:secret.y+.5,
  quantity:1,taken:false,phase:random()*Math.PI*2});
 layout.floorCount=2;
}

function registerSafeRoom(layout,safe){
 const sector=safe.rushSector||renderStage();
 const zone={id:'safe-'+sector,sector,name:'Safe Room',rooms:[]};
 layout.zones.push(zone);
 const parent=nearestLayoutRoom(layout,safe.doorX,safe.doorY,room=>room.sector===sector&&room.floor===1);
 const id=layout.rooms.length+1;
 const room={id,template:'safe',name:'Safe Room',categories:ROOM_TEMPLATES.safe[1],sector,
  zone:zone.id,floor:1,rotation:0,seed:layout.seed^id,x:Math.floor(safe.centerX),y:Math.floor(safe.centerY),
  w:safe.side-2,h:safe.side-2,shape:'rectangle',decor:[],lighting:'fluorescent',
  acoustic:'carpet',height:0,condition:'protected',links:[],objects:[],visited:false,powered:true};
 layout.rooms.push(room);zone.rooms.push(id);
 if(parent)attachRoomLink(layout,parent,room,'safe_door','exploration',
  {x:safe.doorX,y:safe.doorY},{x:room.x,y:room.y},safe);
}

function registerRoomGate(layout,gate){
 if(gate.bossGate){
  const left=bossRushArea(gate.x),right=left+1;
  const a=nearestLayoutRoom(layout,gate.x,gate.y,r=>r.sector===left);
  const b=nearestLayoutRoom(layout,gate.x,gate.y,r=>r.sector===right);
  if(a&&b)attachRoomLink(layout,a,b,'sector_gate','locked',{x:gate.x-1,y:gate.y},{x:gate.x+1,y:gate.y},gate);
  return;
 }
 for(const edge of layout.connections){
  if(edge.type!=='corridor')continue;
  const {from,to}=edge;
  if(gate.x>=Math.min(from.x,to.x)&&gate.x<=Math.max(from.x,to.x)&&
     gate.y>=Math.min(from.y,to.y)&&gate.y<=Math.max(from.y,to.y)){
   edge.type='locked_door';edge.kind='locked';edge.gate=gate;
   return;
  }
 }
}

function indexRoomLayout(){
 const s=gameSession,layout=s.roomLayout;
 if(!layout)return;
 layout.cells=new Uint16Array(s.N*s.N);
 layout.fields=new Uint32Array(s.N*s.N);
 for(const room of layout.rooms){
  const xRadius=room.w>>1,yRadius=room.h>>1;
  for(let y=room.y-yRadius;y<=room.y+yRadius;y++)for(let x=room.x-xRadius;x<=room.x+xRadius;x++){
   if(![0,3,4,5].includes(s.world[y]?.[x]))continue;
   const index=y*s.N+x;
   layout.cells[index]=room.id;
   const condition=room.condition==='damp'?1:room.condition==='damaged'?2:0;
   layout.fields[index]=(room.height<<9)|(ROOM_LIGHTS[room.lighting]<<12)|(condition<<15);
  }
 }
 // Modelled doors and stair landings need a full-height frame.
 for(const object of [...s.doors,...s.interactables.filter(o=>o.type==='stairs')]){
  const x=Math.floor(object.x),y=Math.floor(object.y);
  if(y>=0&&x>=0&&x<s.N&&y<s.N)layout.fields[y*s.N+x]&=~(7<<9);
 }
 layout.revision++;
}

function prepareRoomLayout(){
 const s=gameSession,layout=s.roomLayout;
 if(!layout)return;
 for(const safe of bossRushRooms())registerSafeRoom(layout,safe);
 addRoomDeck();
 for(const gate of s.doors)registerRoomGate(layout,gate);
 const control=s.terminals.find(t=>['power','reactor1','sector5-generator','hard-panel-0'].includes(t.id));
 layout.systems={power:{control,active:!control}};
 layout.sectors=[...new Set(layout.rooms.map(room=>room.sector))].map(id=>{
  const rooms=layout.rooms.filter(room=>room.sector===id);
  return {id,zones:layout.zones.filter(zone=>zone.sector===id).map(zone=>zone.id),
   floors:[...new Set(rooms.map(room=>room.floor))].map(number=>({
    number,rooms:rooms.filter(room=>room.floor===number).map(room=>room.id)
   }))};
 });
 indexRoomLayout();
}

function validateRoomLayout(scene=gameSession){
 const layout=scene.roomLayout;
 const missing=[];
 if(!layout?.rooms.length)return ['Missing room layout'];
 const linked=new Set([1]),queue=[1];
 for(let i=0;i<queue.length;i++){
  for(const id of layout.rooms[queue[i]-1].links){
   const edge=layout.connections[id-1];
   const next=edge.a===queue[i]?edge.b:edge.a;
   if(!linked.has(next)){linked.add(next);queue.push(next);}
  }
 }
 if(linked.size!==layout.rooms.length)missing.push('Disconnected room graph');
 const size=scene.N;
 const seen=new Uint8Array(size*size);
 const pending=new Int32Array(size*size);
 const stairs=new Map(scene.interactables.filter(o=>o.type==='stairs'&&o.roomStairs)
  .map(o=>[Math.floor(o.y)*size+Math.floor(o.x),o.dest]));
 const gates=new Map(scene.doors.map(o=>[o.y*size+o.x,o]));
 const permits=new Set(),items=new Set(),panels=new Set(),keys=new Set();
 const reach=(x,y)=>x>=0&&y>=0&&x<size&&y<size&&seen[y*size+x]!==0;
 const adjacent=(x,y)=>ROOM_DIRS.some(([dx,dy])=>reach(x+dx,y+dy));
 const reachable=object=>reach(Math.floor(object.x),Math.floor(object.y));
 const visit=(x,y)=>{
  if(x<0||y<0||x>=size||y>=size)return;
  const index=y*size+x,tile=scene.world[y][x];
  if(seen[index]||(![0,5].includes(tile)&&!permits.has(index)))return;
  seen[index]=1;pending[tail++]=index;
 };
 let tail=0,head=0;
 visit(Math.floor(scene.player.x),Math.floor(scene.player.y));
 while(true){
  for(;head<tail;head++){
   const index=pending[head],x=index%size,y=Math.floor(index/size);
   for(const [dx,dy] of ROOM_DIRS)visit(x+dx,y+dy);
   const destination=stairs.get(index);
   if(destination)visit(Math.floor(destination.x),Math.floor(destination.y));
  }
  for(const item of scene.fuses)if(reachable(item))items.add(item);
  for(const item of scene.bonusItems)if(item.type==='key'&&reachable(item))keys.add(item.id);
  for(const object of scene.terminals){
   if(reachable(object)&&(scene.level!==3||object.order<=panels.size+1))panels.add(object);
  }
  const before=tail;
  for(const [index,gate] of gates){
   if(permits.has(index)||!adjacent(gate.x,gate.y))continue;
   const req=gate.requires||{};
   if(gate.bossGate){
    const sector=bossRushArea(gate.x);
    if(scene.fuses.some(o=>o.rushSector===sector&&!items.has(o))||
       scene.terminals.some(o=>o.rushSector===sector&&!panels.has(o)))continue;
   }
   if((req.cards??0)>items.size||(req.panels??0)>panels.size||
      (req.key&&!keys.has(req.key))||(req.item&&![...items].some(o=>o.id===req.item))||
      (req.panel&&![...panels].some(o=>o.id===req.panel)))continue;
   permits.add(index);visit(gate.x,gate.y);
  }
  if(tail===before)break;
 }
 for(const item of [...scene.fuses,...scene.terminals]){
  if(!reachable(item))missing.push('Unreachable objective '+(item.id||item.x+','+item.y));
 }
 if(!adjacent(scene.exitCell.x,scene.exitCell.y))missing.push('Unreachable sector exit');
 return missing;
}

function finishRoomLayout(){
 const s=gameSession,layout=s.roomLayout;
 if(!layout)return;
 indexRoomLayout();
 furnishRoomSurfaces(s);
 for(const object of [...s.props,...s.fuses,...s.terminals,...s.bonusItems,...s.interactables,...s.emergencyReactors]){
  const room=roomAt(object.x,object.y);
  if(room)room.objects.push(object);
 }
 for(const object of s.interactables){
  if(!object.roomStairs)continue;
  const room=roomAt(object.x,object.y),destination=roomAt(object.dest.x,object.dest.y);
  if(room&&destination)object.title=destination.name;
 }
 layout.issues=validateRoomLayout(s);
 if(layout.issues.length)throw Error(layout.issues.join('; '));
}

function updateRoomEnvironment(){
 const s=gameSession,layout=s.roomLayout;
 if(!layout)return;
 const room=roomAt(s.player.x,s.player.y);
 let started=false;
 if(room&&s.currentRoom!==room){
  s.cameraFloor=room.floor;
  if(!room.visited&&room.categories.includes('ANOMALOUS')){
   room.event='lighting-failure';room.eventUntil=s.elapsed+4;
   started=true;
  }
  room.visited=true;
 }
 s.currentRoom=room;
 const outage=s.hardEmergency?roomAt(s.hardEmergency.x,s.hardEmergency.y)?.zone:null;
 const mains=layout.systems.power.control?.used??true;
 if(!started&&layout.outage===outage&&layout.mains===mains&&s.elapsed<(layout.nextRoomEvent??Infinity))return;
 layout.outage=outage;
 layout.mains=mains;
 layout.systems.power.active=mains;
 layout.nextRoomEvent=Infinity;
 let changed=false;
 for(const candidate of layout.rooms){
  const active=candidate.event==='lighting-failure'&&s.elapsed<candidate.eventUntil;
  if(active)layout.nextRoomEvent=Math.min(layout.nextRoomEvent,candidate.eventUntil);
  else candidate.event=null;
  const powered=!active&&candidate.zone!==outage&&(mains||!candidate.categories.includes('TECHNICAL'));
  const light=powered?ROOM_LIGHTS[candidate.lighting]:active?ROOM_LIGHTS.dark:ROOM_LIGHTS.emergency;
  if(light!==candidate.light){candidate.light=light;changed=true;}
  candidate.powered=powered;
 }
 if(!changed)return;
 for(let index=0;index<layout.cells.length;index++){
  const target=layout.rooms[layout.cells[index]-1];
  if(target)layout.fields[index]=(layout.fields[index]&~(7<<12))|(target.light<<12);
 }
 layout.revision++;
}

const ROOM_OBJECTS={
 box:{type:'PHYSICS',pushable:true,surface:true},
 barrel:{type:'PHYSICS',pushable:true},desk:{type:'STATIC',surface:true},
 metalTable:{type:'STATIC',surface:true},pump:{type:'SYSTEM'},pipe:{type:'SYSTEM'},
 cabinet:{type:'STATIC'},camera:{type:'DECORATIVE'},mannequin:{type:'ANOMALOUS'}
};

function furnishRoomSurfaces(scene){
 const random=roomRandom(scene.roomLayout.seed^0x56c3ec41);
 let total=0;
 for(const prop of scene.props){
  if(prop.type!=='decor')continue;
  const rules=ROOM_OBJECTS[prop.model];
  prop.objectType=rules?.type??'DECORATIVE';
  prop.pushable=!!rules?.pushable;
  if(total>=2||!rules?.surface||prop.tilt||random()>.38)continue;
  const height=DECOR_MODELS[prop.model].height*prop.size;
  const item={id:'room-surface-'+total,type:'stamina',name:'ENERGY DRINK',
   x:prop.x,y:prop.y,z:height,phase:random()*Math.PI*2,taken:false,quantity:1,attachment:true};
  prop.attachments=[item];
  scene.bonusItems.push(item);
  total++;
 }
}

function pushRoomProp(prop){
 const s=gameSession,p=s.player;
 const dx=prop.x-p.x,dy=prop.y-p.y;
 const x=prop.cellX+(Math.abs(dx)>=Math.abs(dy)?Math.sign(dx):0);
 const y=prop.cellY+(Math.abs(dx)<Math.abs(dy)?Math.sign(dy):0);
 const occupied=[s.player,...s.guards,...s.fuses,...s.terminals,...s.interactables,...s.emergencyReactors,...s.bonusItems];
 if((x===prop.cellX&&y===prop.cellY)||!decorFloorAllowed(s.world,x,y,true)||
    occupied.some(o=>!o.attachment&&!o.taken&&Math.hypot(o.x-x-.5,o.y-y-.5)<1.0)){
  showToast('OBJECT BLOCKED',1.35);return false;
 }
 const original=roomAt(prop.x,prop.y);
 const shiftX=x-prop.cellX,shiftY=y-prop.cellY;
 s.world[prop.cellY][prop.cellX]=0;
 s.world[y][x]=5;
 prop.x+=shiftX;prop.y+=shiftY;prop.cellX=x;prop.cellY=y;
 const destination=roomAt(prop.x,prop.y);
 for(const item of [prop,...(prop.attachments||[])]){
  if(item!==prop){item.x+=shiftX;item.y+=shiftY;}
  if(original!==destination){
   if(original)original.objects=original.objects.filter(o=>o!==item);
   if(destination)destination.objects.push(item);
  }
 }
 markWorldChanged();addNoise(prop.x,prop.y,6,'furniture');
 return true;
}
