function bfsDistances(sx,sy){let dist=Array.from({length:N},()=>Array(N).fill(-1)),q=[[sx,sy]],head=0;dist[sy][sx]=0;while(head<q.length){let [x,y]=q[head++];for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy;if(nx<=0||ny<=0||nx>=N-1||ny>=N-1||world[ny][nx]!==0||dist[ny][nx]>=0)continue;dist[ny][nx]=dist[y][x]+1;q.push([nx,ny])}}return dist}

function isWall(x,y){
 if(x<0||y<0||x>=N||y>=N||world[Math.floor(y)]?.[Math.floor(x)]!==0)return true;
 // Tall 3D furniture has collision; the firepit is low and can be walked around.
 if(typeof safeRoomFurniture!=='undefined')for(const b of safeRoomFurniture){
  if(b.material!==1&&b.material!==3&&b.material!==4)continue;
  if(Math.abs(x-b.x)<b.w*.5+.14&&Math.abs(y-b.y)<b.d*.5+.14)return true;
 }
 return false;
}

function freeAt(x,y,r=.23){return !isWall(Math.floor(x-r),Math.floor(y-r))&&!isWall(Math.floor(x+r),Math.floor(y-r))&&!isWall(Math.floor(x-r),Math.floor(y+r))&&!isWall(Math.floor(x+r),Math.floor(y+r))}

function move(obj,dx,dy,r){if(freeAt(obj.x+dx,obj.y,r))obj.x+=dx;if(freeAt(obj.x,obj.y+dy,r))obj.y+=dy}

function updateSeen(){let px=Math.floor(player.x),py=Math.floor(player.y);for(let y=Math.max(0,py-5);y<=Math.min(N-1,py+5);y++)for(let x=Math.max(0,px-5);x<=Math.min(N-1,px+5);x++){if(Math.hypot(x-px,y-py)<5.1)seen[y][x]=true}}

function findPath(sx,sy,tx,ty){if(sx===tx&&sy===ty)return [];let q=[[sx,sy]],head=0,prev=new Int32Array(N*N).fill(-1),start=sy*N+sx,target=ty*N+tx;prev[start]=start;while(head<q.length){let [x,y]=q[head++],here=y*N+x;if(here===target)break;for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,idx=ny*N+nx;if(nx<=0||ny<=0||nx>=N-1||ny>=N-1||world[ny][nx]!==0||prev[idx]>=0)continue;prev[idx]=here;q.push([nx,ny])}}if(prev[target]<0)return [];let path=[],v=target;while(v!==start&&path.length<N*N){path.push({x:v%N+.5,y:Math.floor(v/N)+.5});v=prev[v]}return path.reverse()}

function lineOfSight(ax,ay,bx,by){let d=Math.hypot(bx-ax,by-ay),steps=Math.ceil(d*6);for(let i=1;i<steps;i++){let t=i/steps;if(isWall(Math.floor(ax+(bx-ax)*t),Math.floor(ay+(by-ay)*t)))return false}return true}
