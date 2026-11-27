const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});const run=s=>vm.runInContext(s,ctx);
run(['js/graphics/shaders/shared.js','js/graphics/shaders/terrain.js','js/graphics/shaders/world-geometry.js','js/graphics/world-geometry.js'].map(read).join('\n'));
function verify(tiles,n,stride){
 ctx.tiles=tiles;ctx.n=n;ctx.stride=stride;
 const mesh=run('buildWorldSurfaceMesh(tiles,n,stride)');
 const v=mesh.vertices, open=(x,y)=>x>=0&&y>=0&&x<n&&y<n&&[0,5].includes(tiles[y*stride+x]);
 let cells=0,walls=0;const counts=new Map();
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(open(x,y)){
  cells++;walls+=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>!open(x+dx,y+dy)).length;
 }
 assert.equal(mesh.wallVertices,walls*6);assert.equal(mesh.planeVertices,cells*12);assert.equal(v.length,(walls*6+cells*12)*6);
 const old=run('buildWorldWallVertices(tiles,n,stride)');assert.deepEqual(Array.from(v.subarray(0,old.length)),Array.from(old));
 for(let i=mesh.wallVertices*6;i<v.length;i+=18){
  const [x,y,z,cx,cy,tag]=v.slice(i,i+6);assert.ok(open(cx,cy));assert.ok(tag===2||tag===3);assert.equal(z,tag-2);
  for(let k=0;k<3;k++){const o=i+k*6;assert.equal(v[o+2],z);assert.equal(v[o+3],cx);assert.equal(v[o+4],cy);assert.equal(v[o+5],tag);assert.ok(v[o]>=cx&&v[o]<=cx+1&&v[o+1]>=cy&&v[o+1]<=cy+1);}
  const cross=(v[i+6]-x)*(v[i+13]-y)-(v[i+7]-y)*(v[i+12]-x);assert.equal(cross,tag===2?1:-1);
  const key=`${cx},${cy},${tag}`;counts.set(key,(counts.get(key)||0)+1);
 }
 assert.equal(counts.size,cells*2);for(const k of counts.values())assert.equal(k,2);
}
const t=new Uint32Array(8*8).fill(1);t[9]=0;t[10]=5;t[11]=3;t[17]=4;t[18]=0;verify(t,5,8);t[11]=0;verify(t,5,8);t.fill(1);verify(t,8,8);t.fill(0);verify(t,8,8);
let seed=7331;for(let i=0;i<48;i++){for(let k=0;k<t.length;k++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;t[k]=[0,1,3,4,5,8][seed%6];}verify(t,8,8);}
const shader=run('geometryTerrainSource()');assert.ok(shader.includes('rasterHit.w<1.5'));assert.ok(shader.includes('rasterHit.w>=1.5'));assert.ok(shader.includes('let isFloor=rasterHit.w<2.5'));assert.ok(shader.includes('distance=planeDepth(ray3)'));assert.ok(shader.includes('result=scenerySurface(ray3,isFloor,distance)'));assert.ok(shader.includes('result=sceneryAt(pixel.xy,ray3)'));
assert.ok(!run('TERRAIN_WGSL').includes('hasPlane'));
console.log('PASS 52 world-surface grids: wall preservation, floor/ceiling coverage, winding, tags, collision-only cells, door revisions and shader resolve');
