// Design the sector with rooms first. The tile grid remains the authoritative
// collision map for movement, ray casts, physics and the offline renderer.
const ROOM_DIRS = [[1,0],[-1,0],[0,1],[0,-1]];

function roomRandom(initialSeed){
 let state=initialSeed|0;
 return ()=>{
  state=(state+0x6d2b79f5)|0;
  let n=Math.imul(state^(state>>>15),state|1);
  n^=n+Math.imul(n^(n>>>7),n|61);
  return ((n^(n>>>14))>>>0)/4294967296;
 };
}

function startRoomLayout(size,runSeed){
 gameSession.N=size;
 gameSession.world=Array.from({length:size},()=>Array(size).fill(1));
 gameSession.roomLayout={seed:runSeed>>>0,rooms:[],connections:[],zones:[],floorCount:1,revision:0};
 return gameSession.roomLayout;
}

function roomCenters(first,last,count){
 return Array.from({length:count},(_,i)=>Math.round(first+(last-first)*i/(count-1)));
}

function openRoomCell(x,y){
 if(x>0&&y>0&&x<gameSession.N-1&&y<gameSession.N-1)gameSession.world[y][x]=0;
}

function roomShapeCell(shape,x,y,xRadius,yRadius){
 const dx=x/xRadius,dy=y/yRadius;
 if(shape==='l')return !(dx>.35&&dy>.35);
 if(shape==='t')return dy<-.24||Math.abs(dx)<.55||Math.abs(dy)<.16;
 if(shape==='u')return !(Math.abs(dx)<.54&&dy>.28);
 if(shape==='oval')return dx*dx+dy*dy<=1;
 if(shape==='polygon')return Math.abs(dx)+Math.abs(dy)<=1.5;
 if(shape==='courtyard')return !(Math.abs(x)===2&&Math.abs(y)===2);
 return true;
}

function createRoom(layout,options,random){
 const {sector,zone,template,x,y,maxW,maxH,floor=1,rectangular=false}=options;
 const [name,categories,widths,lengths,shapes,decor,lighting,acoustic]=ROOM_TEMPLATES[template];
 const dimension=([min,max],cap)=>{
  const length=Math.min(cap,min+Math.floor(random()*(max-min+1)));
  return Math.max(5,length%2?length:length-1);
 };
 const w=dimension(widths,maxW),h=dimension(lengths,maxH);
 const xr=w>>1,yr=h>>1,rotation=Math.floor(random()*4);
 const shape=rectangular?'rectangle':shapes[Math.floor(random()*shapes.length)];
 const id=layout.rooms.length+1;
 const room={
  id,template,name,categories,sector,zone:zone.id,floor,rotation:rotation*90,
  seed:Math.floor(random()*4294967296),x,y,w,h,shape,decor,lighting,acoustic,
  height:rectangular?2:Math.floor(random()*5),condition:random()<.27?'damaged':sector===2?'damp':'abandoned',
  links:[],objects:[],visited:false,powered:true
 };
 for(let dy=-yr;dy<=yr;dy++)for(let dx=-xr;dx<=xr;dx++){
  // Continuous centre lanes keep all registered connectors inside this room,
  // even when the corners use a cut-out or rotated template.
  const axes=rotation%2?[dy,dx,yr,xr]:[dx,dy,xr,yr];
  if(rotation>=2){axes[0]*=-1;axes[1]*=-1;}
  if(Math.abs(dx)<=1||Math.abs(dy)<=1||roomShapeCell(shape,...axes))openRoomCell(x+dx,y+dy);
 }
 if(['empty','reactor','reservoir','conference'].includes(template)&&w>=9&&h>=7){
  for(const side of [-1,1]){
   const col=x+side*3,row=y-2;
   if(gameSession.world[row]?.[col]===0)gameSession.world[row][col]=1;
  }
 }
 layout.rooms.push(room);
 zone.rooms.push(id);
 return room;
}

function connectRooms(layout,a,b,kind,width=3){
 const horizontal=a.y===b.y;
 const sign=horizontal?Math.sign(b.x-a.x):Math.sign(b.y-a.y);
 const point=(room,step)=>({
  x:room.x+(horizontal?step*(room.w>>1):0),
  y:room.y+(horizontal?0:step*(room.h>>1)),
  direction:horizontal?[step,0]:[0,step],width,height:Math.min(1,ROOM_CEILING_HEIGHTS[a.height],ROOM_CEILING_HEIGHTS[b.height]),type:'corridor'
 });
 const from=point(a,sign),to=point(b,-sign);
 for(let x=Math.min(from.x,to.x);x<=Math.max(from.x,to.x);x++)
  for(let y=Math.min(from.y,to.y);y<=Math.max(from.y,to.y);y++)
   for(let lane=0;lane<width;lane++)openRoomCell(x+(horizontal?0:lane-Math.floor(width/2)),y+(horizontal?lane-Math.floor(width/2):0));
 const edge={id:layout.connections.length+1,a:a.id,b:b.id,kind,type:'corridor',from,to};
 layout.connections.push(edge);
 a.links.push(edge.id);
 b.links.push(edge.id);
}

function buildRoomRegion(layout,sector,xs,ys,{campaign=false}={}){
 const random=roomRandom(layout.seed^Math.imul(sector,0x9e3779b9));
 const definitions=ROOM_SECTORS[sector]??ROOM_SECTORS[5];
 const zones=definitions.map(([name,library],index)=>{
  const zone={id:sector+'-'+index,sector,name,rooms:[],library};
  layout.zones.push(zone);
  return zone;
 });
 const spacing=centers=>Math.min(...centers.slice(1).map((c,i)=>c-centers[i]));
 const maxW=Math.min(spacing(xs)-2,2*Math.min(xs[0]-1,gameSession.N-2-xs.at(-1))+1);
 const maxH=Math.min(spacing(ys)-2,2*Math.min(ys[0]-1,gameSession.N-2-ys.at(-1))+1);
 const rooms=ys.map((y,row)=>xs.map((x,col)=>{
  const zone=zones[Math.floor(row*zones.length/ys.length)];
  const pool=sector===2&&row===1&&col===1;
  const template=pool?'pool':col===0&&row===0?zone.library[0]:
   zone.library[Math.floor(random()*zone.library.length)];
  return createRoom(layout,{sector,zone,x,y,template,maxW,maxH,rectangular:pool||campaign&&row%2===0&&col%2===0},random);
 }));
 const all=rooms.flat();
 const options=[];
 for(let row=0;row<ys.length;row++)for(let col=0;col<xs.length;col++){
  if(col+1<xs.length)options.push([rooms[row][col],rooms[row][col+1],campaign&&row%2===0]);
  if(row+1<ys.length)options.push([rooms[row][col],rooms[row+1][col],campaign&&col%2===0]);
 }
 // Build a spanning tree, then add cross-connections for alternate routes.
 // Campaign anchor rows/columns also carry the authored objective gates.
 const parents=Object.fromEntries(all.map(room=>[room.id,room.id]));
 function root(id){while(id!==parents[id])id=parents[id];return id;}
 const remaining=[];
 const ordered=options.map(option=>({option,order:random()})).sort((a,b)=>a.order-b.order);
 for(const {option:[a,b,required]} of ordered){
  const u=root(a.id),v=root(b.id);
  if(u!==v||required){
   connectRooms(layout,a,b,'main');
   parents[v]=u;
  }else remaining.push([a,b]);
 }
 for(const [a,b] of remaining)if(random()<.55)connectRooms(layout,a,b,'alternate');
 const pool=all.find(room=>room.template==='pool');
 if(pool)installPoolBasin(pool);
 return rooms;
}

function chooseRoomExit(cells,x,y){
 const candidates=cells.slice().sort((a,b)=>b.d-a.d);
 for(const cell of candidates){
  gameSession.world[cell.y][cell.x]=3;
  const distances=bfsDistances(x,y);
  gameSession.world[cell.y][cell.x]=0;
  if(cells.every(c=>c===cell||distances[c.y][c.x]>=0))return cell;
 }
 throw Error('The room layout has no reachable exit');
}

function installPoolBasin(room){
 const width=3,length=Math.min(5,room.h-2);
 const left=room.x-(width>>1),top=room.y-(length>>1);
 room.basin={left,top,width,length,bottom:POOL_BOTTOM_Z,water:POOL_WATER_Z};
 for(let y=top;y<top+length;y++)for(let x=left;x<left+width;x++)gameSession.world[y][x]=POOL_TILE;
}
