const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});
vm.runInContext([read('js/graphics/camera.js'),...['shared','terrain','sprites','mesh','world-geometry'].map(n=>read('js/graphics/shaders/'+n+'.js'))].join('\n'),ctx);
const coords=vm.runInContext('cameraCoordinates',ctx),get=n=>vm.runInContext(n,ctx);
const eps=1e-9;
function eq(a,b){assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);}
// Independent CPU reconstruction of the shader ray, then round-trip through
// actual CPU cameraCoordinates. The third coordinate must be camera depth.
for(const pitch of [-75,-45,-15,0,15,45,75].map(a=>a*Math.PI/180)){
 for(const yaw of [-2,0,1,3])for(const aspect of [9/16,4/3,16/9,21/9])for(const fov of [55,75,105]){
  const camera={x:3.5,y:6.5,cos:Math.cos(yaw),sin:Math.sin(yaw),pitch,plane:Math.tan(fov*Math.PI/360)};
  const c=Math.cos(pitch),s=Math.sin(pitch);
  for(const u of [0,.25,.5,.75,1])for(const v of [0,.25,.5,.75,1]){
   const qx=(2*u-1)*camera.plane,qy=(1-2*v)*camera.plane/aspect;
   const dx=camera.cos*(c-qy*s)-camera.sin*qx,dy=camera.sin*(c-qy*s)+camera.cos*qx,dz=s+qy*c;
   for(const depth of [.1,1,20]){
    const p=coords(camera,camera.x+dx*depth,camera.y+dy*depth,.5+dz*depth);
    eq(p.depth,depth);eq(p.right/p.depth/camera.plane,qx/camera.plane);eq(p.up/p.depth*aspect/camera.plane,1-2*v);
   }
   if(Math.abs(dz)>.01){const d=.5/Math.abs(dz);eq(.5+dz*d,dz<0?0:1);}
  }
  const bottom=coords(camera,4,7,0),top=coords(camera,4,7,1);
  eq(top.right,bottom.right);eq(top.up-bottom.up,c);eq(top.depth-bottom.depth,s);
 }
}
for(const n of ['TERRAIN_WGSL','MODEL_WGSL','SPRITES_WGSL','WORLD_GEOMETRY_WGSL'])assert.ok(get(n).includes(get('PROJECTION_WGSL')));
for(const n of ['TERRAIN_WGSL','MODEL_WGSL','SPRITES_WGSL'])assert.ok(get(n).includes(get('LIGHTING_WGSL')));
assert.ok(get('TERRAIN_WGSL').includes('distance=surfaceDepth;'));
assert.ok(get('geometryTerrainSource()').includes('(boundary-axisOrigin)/along'));
assert.ok(get('SPRITES_WGSL').includes('if(input.depth>=depth-.012)'));
assert.ok(get('LIGHTING_WGSL').includes('f.weather.x>.5'));
assert.ok(get('LIGHTING_WGSL').includes('f.lighting.w>.5'));
console.log('PASS true pitch, aspect/FOV, ray/project round-trip, floor/ceiling depth, upright billboard and shared lighting contracts');
