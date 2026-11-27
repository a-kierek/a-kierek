const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});const run=s=>vm.runInContext(s,ctx);
run(['js/graphics/shaders/shared.js','js/graphics/shaders/terrain.js','js/graphics/shaders/world-geometry.js','js/graphics/world-geometry.js'].map(read).join('\n'));
function verify(tiles,n,stride){
 ctx.tiles=tiles;ctx.n=n;ctx.stride=stride;
 const mesh=run('buildWorldSurfaceMesh(tiles,n,stride)');
 const v=mesh.vertices, open=(x,y)=>x>=0&&y>=0&&x<n&&y<n&&[0,5].includes(tiles[y*stride+x]);
 let cells=0,walls=0;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(open(x,y)){
  cells++;walls+=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>!open(x+dx,y+dy)).length;
 }
 assert.equal(mesh.wallVertices,walls*6);assert.ok(mesh.planeVertices<=cells*12);
 assert.equal(v.length,(mesh.wallVertices+mesh.planeVertices)*6);
 const old=run('buildWorldWallVertices(tiles,n,stride)');assert.deepEqual(Array.from(v.subarray(0,old.length)),Array.from(old));
 for(const tag of [2,3]){
  const covered=new Set();
  for(let base=mesh.wallVertices*6;base<v.length;base+=36){
   if(v[base+5]!==tag)continue;
   const xs=[],ys=[];
   for(let k=0;k<6;k++){
    const offset=base+k*6;
    assert.equal(v[offset+2],tag-2);assert.equal(v[offset+5],tag);
    xs.push(v[offset]);ys.push(v[offset+1]);
   }
   const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
   for(let k=0;k<6;k+=3){
    const cross=(xs[k+1]-xs[k])*(ys[k+2]-ys[k])-(ys[k+1]-ys[k])*(xs[k+2]-xs[k]);
    assert.equal(cross,(right-left)*(bottom-top)*(tag===2?1:-1));
   }
   for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
    const key=y*n+x;assert.ok(open(x,y)&&!covered.has(key));covered.add(key);
   }
  }
  assert.equal(covered.size,cells);
 }
 if(cells===n*n)assert.equal(mesh.planeVertices,12);

}
const t=new Uint32Array(8*8).fill(1);t[9]=0;t[10]=5;t[11]=3;t[17]=4;t[18]=0;verify(t,5,8);t[11]=0;verify(t,5,8);t.fill(1);verify(t,8,8);t.fill(0);verify(t,8,8);
let seed=7331;for(let i=0;i<48;i++){for(let k=0;k<t.length;k++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;t[k]=[0,1,3,4,5,8][seed%6];}verify(t,8,8);}
// Two adjacent cells with different ceilings require two roof planes and a
// vertical face across the height discontinuity.
const pair=new Uint32Array(16).fill(1); pair[5]=pair[6]=0;
const fields=pair.slice(); fields[5]=1<<9; fields[6]=4<<9;
ctx.pair=pair;ctx.fields=fields;
const varied=run('buildWorldSurfaceMesh(pair,4,4,fields)');
assert.equal(varied.wallVertices,7*6);
assert.equal(varied.planeVertices,3*6);
const roofHeights=[];
for(let i=varied.wallVertices*6;i<varied.vertices.length;i+=36){
 if(varied.vertices[i+5]===3)roofHeights.push(varied.vertices[i+2].toFixed(2));
}
assert.deepEqual(roofHeights,['0.84','1.22']);
const shader=run('geometryTerrainSource()');assert.ok(shader.includes('rasterHit.w<1.5'));assert.ok(shader.includes('rasterHit.w>=1.5'));assert.ok(shader.includes('let isFloor=rasterHit.w<2.5'));assert.ok(shader.includes('roomCeiling(cell,i32(frame.viewport.z))'));assert.ok(shader.includes('result=scenerySurface(ray3,isFloor,distance)'));assert.ok(shader.includes('result=sceneryAt(pixel.xy,ray3)'));
assert.ok(!run('TERRAIN_WGSL').includes('hasPlane'));
console.log('PASS 52 world-surface grids: wall preservation, merged floor/ceiling coverage, winding, tags, collision-only cells, door revisions and shader resolve');
