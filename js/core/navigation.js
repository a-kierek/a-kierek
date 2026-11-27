function bfsDistances(sx,sy){let dist=Array.from({length:gameSession.N},()=>Array(gameSession.N).fill(-1)),q=[[sx,sy]],head=0;dist[sy][sx]=0;while(head<q.length){let [x,y]=q[head++];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy;if(nx<=0||ny<=0||nx>=gameSession.N-1||ny>=gameSession.N-1||gameSession.world[ny][nx]!==0||dist[ny][nx]>=0)continue;dist[ny][nx]=dist[y][x]+1;q.push([nx,ny])}}return dist}

// Generation BFS above intentionally uses tiles only. Runtime collision, sight
// and navigation share the actual furniture footprint (not floored positions).
function solidFurniture(){return typeof gameSession.safeRoomFurniture==='undefined'?[]:gameSession.safeRoomFurniture;}
function solidBox(b){return b.material===1||b.material===3||b.material===4;}
function overlapsBox(x,y,r,b){return Math.abs(x-b.x)<b.w*.5+.14+r&&Math.abs(y-b.y)<b.d*.5+.14+r;}
function tileBlocked(x,y){return x<0||y<0||x>=gameSession.N||y>=gameSession.N||gameSession.world[y]?.[x]!==0;}
function isWall(x,y){return !freeAt(x,y,0);}
function freeAt(x,y,r=.23){
 if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(r)||r<0)return false;
 for(let ty=Math.floor(y-r);ty<=Math.floor(y+r);ty++)for(let tx=Math.floor(x-r);tx<=Math.floor(x+r);tx++)if(tileBlocked(tx,ty))return false;
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
 for(const [a,d,c,h] of [[ax,bx-ax,b.x,b.w*.5+.14+pad],[ay,by-ay,b.y,b.d*.5+.14+pad]]){
  if(Math.abs(d)<1e-12){if(a<c-h||a>c+h)return false;continue;}
  let t1=(c-h-a)/d,t2=(c+h-a)/d;
  if(t1>t2)[t1,t2]=[t2,t1];
  lo=Math.max(lo,t1);hi=Math.min(hi,t2);if(lo>hi)return false;
 }
 return true;
}
// Cache static furniture obstacles per map. Wall/door tiles are always live.
let navFurnitureSource=null,navFurnitureCount=-1,navSize=0,navBlocked=null,navEdges=null;
const NAV_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function prepareFurnitureNav(){
 const boxes=solidFurniture();
 if(navFurnitureSource===boxes&&navFurnitureCount===boxes.length&&navSize===gameSession.N)return;
 navFurnitureSource=boxes;navFurnitureCount=boxes.length;navSize=gameSession.N;
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
}
// Reuse typed workspaces instead of allocating and clearing two N*N arrays per search.
let navWork=null;
function searchNav(sx,sy,tx,ty,maxDistance=Infinity){
 if(![sx,sy,tx,ty].every(Number.isInteger)||tileBlocked(sx,sy)||tileBlocked(tx,ty)||(sx===tx&&sy===ty))return null;
 prepareFurnitureNav();
 const start=sy*gameSession.N+sx,target=ty*gameSession.N+tx;
 if(navBlocked[target])return null;
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
   if(tileBlocked(nx,ny)||stamp[idx]===epoch||navBlocked[idx]||(navEdges[here]&(1<<k)))continue;
   stamp[idx]=epoch;prev[idx]=here;dist[idx]=dist[here]+1;q[tail++]=idx;
  }
 }
 return null;
}
function findPath(sx,sy,tx,ty){
 const found=searchNav(sx,sy,tx,ty);if(!found)return [];
 const {start,target,prev}=found,path=[];
 for(let v=target;v!==start;v=prev[v])path.push({x:v%gameSession.N+.5,y:Math.floor(v/gameSession.N)+.5});
 return path.reverse();
}
function navPathDistance(sx,sy,tx,ty,maxDistance=Infinity){
 const found=searchNav(sx,sy,tx,ty,Math.floor(maxDistance));
 return found&&found.distance<=maxDistance?found.distance:Infinity;
}
// Grid DDA: visit every crossed cell, including diagonal corner contacts.
// Only the actual target gate/exit tile may be ignored for an interaction.
function lineOfSight(ax,ay,bx,by,options={}){
 if(![ax,ay,bx,by].every(Number.isFinite))return false;
 let x=Math.floor(ax),y=Math.floor(ay),tx=Math.floor(bx),ty=Math.floor(by);
 const dx=bx-ax,dy=by-ay,sx=Math.sign(dx),sy=Math.sign(dy);
 const blocked=(xx,yy)=>!(options.allowTargetTile&&xx===tx&&yy===ty)&&tileBlocked(xx,yy);
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
