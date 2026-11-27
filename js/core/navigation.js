function bfsDistances(sx,sy){let dist=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(-1)),q=[[sx,sy]],head=0;dist[sy][sx]=0;while(head<q.length){let [x,y]=q[head++];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy;if(nx<=0||ny<=0||nx>=gameSession.N-1||ny>=gameSession.N-1||gameSession.world[ny][nx]!==0||dist[ny][nx]>=0)continue;dist[ny][nx]=dist[y][x]+1;q.push([nx,ny])}}return dist}

// Generation BFS above intentionally uses tiles only. Runtime collision, sight
// and navigation share the actual furniture footprint (not floored positions).
function solidFurniture(){return typeof gameSession.safeRoomFurniture==='undefined'?[]:gameSession.safeRoomFurniture;}
function solidBox(b){return b.material===1||b.material===3||b.material===4||b.material===SAFE_ROOM_WALL_MATERIAL;}
function overlapsBox(x,y,r,b){
 const dx=Math.max(0,Math.abs(x-b.x)-b.w*.5),dy=Math.max(0,Math.abs(y-b.y)-b.d*.5);
 return dx*dx+dy*dy<=r*r;
}

// Tile 5 stays a reservation for generation. At runtime the same tile is
// open around its indexed footprint, including when a mesh spans its edge.
let objectCollisions=null;
function prepareObjectCollisions(){
 const {world,N,worldRevision}=gameSession;
 if(objectCollisions?.world===world&&objectCollisions.size===N&&objectCollisions.revision===worldRevision)return objectCollisions;
 const cells=new Map(),reserved=new Set(),shapes=[];
 for(const prop of gameSession.props||[]){
  if(prop.type!=='rock'&&!(prop.type==='decor'&&prop.solid))continue;
  const spec=DECOR_FOOTPRINTS[prop.type==='rock'?'rock':prop.model];
  if(!spec)continue;
  const tileX=prop.cellX??Math.floor(prop.x),tileY=prop.cellY??Math.floor(prop.y);
  if(world[tileY]?.[tileX]!==5)continue;
  const side=spec.side&&Math.abs(prop.tilt||0)>1;
  const source=side?spec.side:spec.floor;
  const scale=prop.size||1,angle=(prop.type==='rock'?prop.phase:prop.yaw)||0;
  const cos=Math.cos(angle)*scale,sin=Math.sin(angle)*scale;
  const reflected=side&&prop.tilt>0,p=[];
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(let i=0;i<source.length;i+=2){
   const j=reflected?source.length-2-i:i;
   const u=source[j],v=source[j+1]*(reflected?-1:1);
   const x=prop.x+u*cos-v*sin,y=prop.y+u*sin+v*cos;
   p.push([x,y]);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
  }
  const shape={edges:p.map(([x,y],i)=>{
   const next=p[(i+1)%p.length];
   return {x,y,dx:next[0]-x,dy:next[1]-y};
  }),minX,minY,maxX,maxY};
  reserved.add(tileY*N+tileX);shapes.push(shape);
  for(let y=Math.max(0,Math.floor(minY));y<=Math.min(N-1,Math.floor(maxY));y++){
   for(let x=Math.max(0,Math.floor(minX));x<=Math.min(N-1,Math.floor(maxX));x++){
    const id=y*N+x;
    if(!cells.has(id))cells.set(id,[]);
    cells.get(id).push(shape);
   }
  }
 }
 objectCollisions={world,size:N,revision:worldRevision,cells,reserved,shapes};
 return objectCollisions;
}
function tileBlocked(x,y,objects){
 if(x<0||y<0||x>=objects.size||y>=objects.size)return true;
 const tile=objects.world[y]?.[x];
 return tile!==0&&tile!==THIN_SAFE_ROOM_TILE&&(tile!==5||!objects.reserved.has(y*objects.size+x));
}
function distanceToSegmentSquared(x,y,ax,ay,dx,dy){
 const length=dx*dx+dy*dy;
 const t=length?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/length)):0;
 return (x-ax-t*dx)**2+(y-ay-t*dy)**2;
}
function footprintOverlaps(shape,x,y,r){
 if(x+r<shape.minX||x-r>shape.maxX||y+r<shape.minY||y-r>shape.maxY)return false;
 let inside=true;
 for(const e of shape.edges){
  if(e.dx*(y-e.y)-e.dy*(x-e.x)<0)inside=false;
  if(r&&distanceToSegmentSquared(x,y,e.x,e.y,e.dx,e.dy)<=r*r)return true;
 }
 return inside;
}
function footprintHitsSegment(shape,ax,ay,bx,by,r=0){
 if(Math.max(ax,bx)+r<shape.minX||Math.min(ax,bx)-r>shape.maxX||
    Math.max(ay,by)+r<shape.minY||Math.min(ay,by)-r>shape.maxY)return false;
 const dx=bx-ax,dy=by-ay;
 let lo=0,hi=1;
 for(const e of shape.edges){
  if(r&&distanceToSegmentSquared(e.x,e.y,ax,ay,dx,dy)<=r*r)return true;
  const start=e.dx*(ay-e.y)-e.dy*(ax-e.x);
  const delta=e.dx*dy-e.dy*dx;
  if(Math.abs(delta)<1e-10){if(start<0)lo=Infinity;}
  else if(delta>0)lo=Math.max(lo,-start/delta);
  else hi=Math.min(hi,-start/delta);
  if(lo>hi&&!r)return false;
 }
 return lo<=hi||(r>0&&(footprintOverlaps(shape,ax,ay,r)||footprintOverlaps(shape,bx,by,r)));
}
function isWall(x,y){return !freeAt(x,y,0);}
function freeAt(x,y,r=.23){
 if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(r)||r<0)return false;
 const objects=prepareObjectCollisions();
 const left=Math.floor(x-r),right=Math.floor(x+r),top=Math.floor(y-r),bottom=Math.floor(y+r);
 for(let ty=top;ty<=bottom;ty++)for(let tx=left;tx<=right;tx++){
  if(tileBlocked(tx,ty,objects))return false;
  const shapes=objects.cells.get(ty*objects.size+tx);
  if(shapes?.some(shape=>footprintOverlaps(shape,x,y,r)))return false;
 }
 return !solidFurniture().some(b=>solidBox(b)&&overlapsBox(x,y,r,b));
}
function move(obj,dx,dy,r){
 // Subdivide large movements so a short frame stall cannot tunnel through furniture.
 const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.15));
 for(let i=0;i<steps;i++){
  if(freeAt(obj.x+dx/steps,obj.y,r))obj.x+=dx/steps;
  if(freeAt(obj.x,obj.y+dy/steps,r))obj.y+=dy/steps;
 }
}

let seenCache=null,seenX=-1,seenY=-1;
function updateSeen(){let px=Math.floor(gameSession.player.x),py=Math.floor(gameSession.player.y);if(seenCache===gameSession.seen&&px===seenX&&py===seenY)return;seenCache=gameSession.seen;seenX=px;seenY=py;for(let y=Math.max(0,py-5);y<=Math.min(gameSession.N-1,py+5);y++)for(let x=Math.max(0,px-5);x<=Math.min(gameSession.N-1,px+5);x++){if(Math.hypot(x-px,y-py)<5.1)gameSession.seen[y][x]=true}}

// Slab intersection for a segment and a furniture AABB.
function segmentHitsBox(ax,ay,bx,by,b,pad=0){
 let lo=0,hi=1;
 for(const [a,d,c,h] of [[ax,bx-ax,b.x,b.w*.5+pad],[ay,by-ay,b.y,b.d*.5+pad]]){
  if(Math.abs(d)<1e-12){if(a<c-h||a>c+h)return false;continue;}
  let t1=(c-h-a)/d,t2=(c+h-a)/d;
  if(t1>t2)[t1,t2]=[t2,t1];
  lo=Math.max(lo,t1);hi=Math.min(hi,t2);if(lo>hi)return false;
 }
 return true;
}
// Cache static furniture obstacles per map. Wall/door tiles are always live.
let navFurnitureSource=null,navFurnitureCount=-1,navColliderSource=null,navBlocked=null,navEdges=null;
const NAV_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function prepareObstacleNav(objects){
 const boxes=solidFurniture();
 if(navFurnitureSource===boxes&&navFurnitureCount===boxes.length&&navColliderSource===objects)return;
 navFurnitureSource=boxes;navFurnitureCount=boxes.length;navColliderSource=objects;
 navBlocked=new Uint8Array(gameSession.N*gameSession.N);navEdges=new Uint8Array(gameSession.N*gameSession.N);
 for(const b of boxes){
  if(!solidBox(b))continue;
  for(let y=Math.max(0,Math.floor(b.y-b.d/2-2));y<=Math.min(gameSession.N-1,Math.floor(b.y+b.d/2+2));y++){
   for(let x=Math.max(0,Math.floor(b.x-b.w/2-2));x<=Math.min(gameSession.N-1,Math.floor(b.x+b.w/2+2));x++){
    const idx=y*gameSession.N+x;
    if(overlapsBox(x+.5,y+.5,.23,b))navBlocked[idx]=1;
    for(let k=0;k<4;k++){const [dx,dy]=NAV_DIRS[k];if(segmentHitsBox(x+.5,y+.5,x+.5+dx,y+.5+dy,b,.23))navEdges[idx]|=1<<k;}
   }
  }
 }
 for(const shape of objects.shapes){
  for(let y=Math.max(0,Math.floor(shape.minY-2));y<=Math.min(objects.size-1,Math.floor(shape.maxY+2));y++){
   for(let x=Math.max(0,Math.floor(shape.minX-2));x<=Math.min(objects.size-1,Math.floor(shape.maxX+2));x++){
    const idx=y*objects.size+x;
    if(footprintOverlaps(shape,x+.5,y+.5,.23))navBlocked[idx]=1;
    for(let k=0;k<4;k++){
     const [dx,dy]=NAV_DIRS[k];
     if(footprintHitsSegment(shape,x+.5,y+.5,x+.5+dx,y+.5+dy,.23))navEdges[idx]|=1<<k;
    }
   }
  }
 }
}
// Reuse typed workspaces instead of allocating and clearing two N*N arrays per search.
let navWork=null;
function searchNav(sx,sy,tx,ty,maxDistance=Infinity,origin=null){
 const objects=prepareObjectCollisions();
 if(![sx,sy,tx,ty].every(Number.isInteger)||tileBlocked(sx,sy,objects)||tileBlocked(tx,ty,objects)||(sx===tx&&sy===ty))return null;
 prepareObstacleNav(objects);
 const start=sy*gameSession.N+sx,target=ty*gameSession.N+tx;
 if(navBlocked[target])return null;
 // A guard can be beside a mesh in its reserved tile even when the grid
 // center is occupied. Connect its real position to the first waypoint.
 const fractionalStart=origin&&objects.reserved.has(start);
 if(!navWork||navWork.size!==gameSession.N*gameSession.N)navWork={size:gameSession.N*gameSession.N,q:new Int32Array(gameSession.N*gameSession.N),prev:new Int32Array(gameSession.N*gameSession.N),dist:new Int32Array(gameSession.N*gameSession.N),stamp:new Uint32Array(gameSession.N*gameSession.N),epoch:0};
 const {q,prev,dist,stamp}=navWork;
 let epoch=navWork.epoch=(navWork.epoch+1)>>>0;
 if(!epoch){stamp.fill(0);epoch=navWork.epoch=1;}
 let head=0,tail=1;q[0]=start;stamp[start]=epoch;prev[start]=start;dist[start]=0;
 while(head<tail){
  const here=q[head++];if(here===target)return {start,target,prev,distance:dist[here]};
  if(dist[here]>=maxDistance)continue;
  const x=here%gameSession.N,y=Math.floor(here/gameSession.N);
  for(let k=0;k<4;k++){
   const [dx,dy]=NAV_DIRS[k],nx=x+dx,ny=y+dy,idx=ny*gameSession.N+nx;
   if(tileBlocked(nx,ny,objects)||stamp[idx]===epoch||navBlocked[idx])continue;
   if(here===start&&fractionalStart){
    const horizontal=nx+.5-origin.x,vertical=ny+.5-origin.y;
    const steps=Math.max(1,Math.ceil(Math.hypot(horizontal,vertical)/.15));
    let clear=true;
    for(let step=1;clear&&step<=steps;step++)clear=freeAt(origin.x+horizontal*step/steps,origin.y+vertical*step/steps,.23);
    if(!clear)continue;
   }else if(navEdges[here]&(1<<k))continue;
   stamp[idx]=epoch;prev[idx]=here;dist[idx]=dist[here]+1;q[tail++]=idx;
  }
 }
 return null;
}
function findPath(sx,sy,tx,ty,origin=null){
 const found=searchNav(sx,sy,tx,ty,Infinity,origin);if(!found)return [];
 const {start,target,prev}=found,path=[];
 for(let v=target;v!==start;v=prev[v])path.push({x:v%gameSession.N+.5,y:Math.floor(v/gameSession.N)+.5});
 return path.reverse();
}
function navPathDistance(sx,sy,tx,ty,maxDistance=Infinity,origin=null){
 const found=searchNav(sx,sy,tx,ty,Math.floor(maxDistance),origin);
 return found&&found.distance<=maxDistance?found.distance:Infinity;
}
// Grid DDA: visit every crossed cell, including diagonal corner contacts.
// Only the actual target gate/exit tile may be ignored for an interaction.
function lineOfSight(ax,ay,bx,by,options={}){
 if(![ax,ay,bx,by].every(Number.isFinite))return false;
 let x=Math.floor(ax),y=Math.floor(ay),tx=Math.floor(bx),ty=Math.floor(by);
 const dx=bx-ax,dy=by-ay,sx=Math.sign(dx),sy=Math.sign(dy);
 const objects=prepareObjectCollisions();
 const blocked=(xx,yy)=>{
  if(options.allowTargetTile&&xx===tx&&yy===ty)return false;
  return (objects.world[yy]?.[xx]!==POOL_TILE&&tileBlocked(xx,yy,objects))||objects.cells.get(yy*objects.size+xx)?.some(shape=>footprintHitsSegment(shape,ax,ay,bx,by));
 };
 if(blocked(x,y))return false;
 const deltaX=sx?1/Math.abs(dx):Infinity,deltaY=sy?1/Math.abs(dy):Infinity;
 let nextX=sx?(sx>0?x+1-ax:ax-x)*deltaX:Infinity,nextY=sy?(sy>0?y+1-ay:ay-y)*deltaY:Infinity;
 while(x!==tx||y!==ty){
  if(x===tx)nextX=Infinity;if(y===ty)nextY=Infinity;
  if(Math.abs(nextX-nextY)<1e-10){if(blocked(x+sx,y)||blocked(x,y+sy))return false;x+=sx;y+=sy;nextX+=deltaX;nextY+=deltaY;}
  else if(nextX<nextY){x+=sx;nextX+=deltaX;}
  else{y+=sy;nextY+=deltaY;}
  if(blocked(x,y))return false;
 }
 for(const b of solidFurniture()){
  if(!solidBox(b))continue;
  if(options.allowTargetFurniture&&b.material===1&&Math.abs(b.x-bx)<.001&&Math.abs(b.y-by)<.001)continue;
  if(segmentHitsBox(ax,ay,bx,by,b))return false;
 }
 return true;
}
