const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});vm.runInContext(['shared','terrain','mesh','sprites','world-geometry'].map(n=>read('js/graphics/shaders/'+n+'.js')).join('\n'),ctx);
for(const shader of ['TERRAIN_WGSL','MODEL_WGSL','SPRITES_WGSL','geometryTerrainSource()']){
 const source=vm.runInContext(shader,ctx);
 assert.equal((source.match(/var<storage,read> worldTiles:array<u32>/g)||[]).length,1);
 assert.match(source,/wallLightVisible\(p.xy,source.xy,size\)/);
 assert.match(source,/tile!=0u&&tile!=5u/);
 assert.match(source,/i<24/);assert.match(source,/min\(nextCross.x,nextCross.y\)>=1.-.000001/);
}
// CPU translation of the bounded WGSL traversal; compare against independent
// segment/AABB intersection on randomized maps, plus boundary/corner cases.
const N=16,grid=Array.from({length:N},()=>Array(N).fill(0));
const solid=(x,y)=>x<0||y<0||x>=N||y>=N||![0,5].includes(grid[y][x]);
const startOf=(p,q)=>{const d=q.map((v,i)=>v-p[i]),span=Math.hypot(...d);return span<.0001?q:p.map((v,i)=>v+d[i]*Math.min(.5,.06/span));};
function visible(p,q){
 const target=q.map(Math.floor);if(solid(...target))return false;
 if(Math.hypot(q[0]-p[0],q[1]-p[1])<.0001)return true;
 const start=startOf(p,q),ray=q.map((v,i)=>v-start[i]),cell=start.map(Math.floor);
 if(solid(...cell))return false;
 const step=ray.map(v=>v<0?-1:1),delta=ray.map(v=>1/Math.max(Math.abs(v),.000001));
 const next=cell.map((v,i)=>Math.abs(ray[i])<.000001?1e20:Math.abs(v+(step[i]>0?1:0)-start[i])*delta[i]);
 for(let k=0;k<24;k++){
  if(cell.every((v,i)=>v===target[i]))return true;
  if(Math.min(...next)>=1-.000001)return true;
  if(Math.abs(next[0]-next[1])<.00001){if(solid(cell[0]+step[0],cell[1])||solid(cell[0],cell[1]+step[1]))return false;for(let i=0;i<2;i++){cell[i]+=step[i];next[i]+=delta[i];}}
  else{const i=next[0]<next[1]?0:1;cell[i]+=step[i];next[i]+=delta[i];}
  if(solid(...cell))return false;
 }
 return false;
}
function reference(p,q){
 const a=startOf(p,q);if(solid(...a.map(Math.floor))||solid(...q.map(Math.floor)))return false;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(solid(x,y)){
  let lo=0,hi=1;
  for(const [i,b] of [[0,x],[1,y]]){const d=q[i]-a[i];if(Math.abs(d)<1e-10){if(a[i]<b||a[i]>b+1){lo=2;break;}}else{const t=(b-a[i])/d,u=(b+1-a[i])/d;lo=Math.max(lo,Math.min(t,u));hi=Math.min(hi,Math.max(t,u));}}
  if(lo<=hi)return false;
 }
 return true;
}
assert.equal(visible([1.5,2.5],[7.5,2.5]),true);grid[2][4]=1;assert.equal(visible([1.5,2.5],[7.5,2.5]),false);
grid[2][4]=5;assert.equal(visible([1.5,2.5],[7.5,2.5]),true);grid[2][4]=4;assert.equal(visible([1.5,2.5],[7.5,2.5]),false);
assert.equal(visible([4,2.5],[1.5,2.5]),true);assert.equal(visible([4,2.5],[7.5,2.5]),false);
assert.equal(visible([2.5,2.5],[-.5,2.5]),false);assert.equal(visible([2.5,2.5],[2.5,2.5]),true);
grid[2][4]=0;grid[1][2]=1;assert.equal(visible([1.5,1.5],[3.5,3.5]),false);
// Exact integer campfire coordinates: all quadrants must agree.
for(const row of grid)row.fill(0);
for(const source of [[8,8],[8,8.5],[8.5,8]]){
 for(let i=0;i<360;i++){
  const a=i*Math.PI/180,p=[source[0]+2.5*Math.cos(a),source[1]+2.5*Math.sin(a)];
  assert.equal(visible(p,source),true,`unoccluded source ${source}, angle ${i}`);
 }
}
// Mesh door flag is invisible to terrain but opaque to both light systems.
grid[8][7]=256;assert.equal(visible([6.5,8.5],[9.5,8.5]),false);
grid[8][7]=0;assert.equal(visible([6.5,8.5],[9.5,8.5]),true);
let seed=12345;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
for(let k=0;k<2500;k++){
 for(const row of grid)for(let x=0;x<N;x++)row[x]=rnd()<.19?1:0;
 const p=[.1+rnd()*15.8,.1+rnd()*15.8],q=[.1+rnd()*15.8,.1+rnd()*15.8];
 if(Math.hypot(p[0]-q[0],p[1]-q[1])>=9)continue;
 assert.equal(visible(p,q),reference(p,q),`${p} -> ${q}`);
}
const renderer=read('js/graphics/webgpu.js');assert.match(renderer,/wallShadowsEnabled\?2:1/);assert.match(renderer,/event.code!=='F7'/);assert.equal((renderer.match(/binding:5,resource:\{buffer:this.mapBuffer\}/g)||[]).length,2);
console.log('PASS bounded wall visibility, corner blocking, wall bias, transparent collision tile, randomized segment/AABB comparison, shared map bindings');
