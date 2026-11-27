const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});vm.runInContext(['js/graphics/decor-data.js','js/gameplay/decor.js',...['shared','terrain','world-geometry'].map(n=>'js/graphics/shaders/'+n+'.js')].map(read).join('\n'),ctx);
const get=n=>vm.runInContext(n,ctx),pose=get('wallFloorDecorPose'),specs=get('DECOR_MODELS');
function weight(d2){const t=Math.max(0,Math.min(1,(d2-36)/28));return 1-t*t*(3-2*t);}
function sum(x,y,z,window){const gx=Math.floor((x-2.5)/5),gy=Math.floor((y-1.45)/4);let total=0;
 for(let j=window?-1:-4;j<=(window?2:4);j++)for(let i=window?-1:-4;i<=(window?2:4);i++){
 const d2=(x-((gx+i)*5+2.5))**2+(y-((gy+j)*4+1.45))**2+(z-.97)**2;
 total+=weight(d2)/(1+d2*1.35);}
 return total;}
let cases=0;for(const z of [0,.5,1])for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++)for(const e of [-.000001,0,.000001,.25,.9]){
 const x=i*5+2.5+e,y=j*4+1.45-e;
 assert.ok(Math.abs(sum(x,y,z,true)-sum(x,y,z,false))<1e-10);
 assert.ok(Math.abs(sum(x-1e-6,y,z,true)-sum(x+1e-6,y,z,true))<1e-5);
 assert.ok(Math.abs(sum(x,y-1e-6,z,true)-sum(x,y+1e-6,z,true))<1e-5);cases++;
}
for(const name of ['TERRAIN_WGSL','geometryTerrainSource()']){const s=get(name);assert.ok(s.includes('fixtureWeight(p,source)'));assert.ok(s.includes('let vertical=extent.x<extent.y;'));assert.ok(s.includes('if((vertical&&faceX)||(!vertical&&faceY))'));assert.ok(s.includes('let entry=min(t0,t1);'));}
console.log(`PASS ${cases} lamp-window continuity cases, both axes and all heights, compared to full-grid reference`);
for(const kind of ['bench','pipe']){
 const b=fs.readFileSync(path.join(root,specs[kind].mesh)),n=b.readUInt32LE(4);
 for(const dir of [[1,0],[-1,0],[0,1],[0,-1]]){const p=pose(kind,specs[kind],dir);let contact=-Infinity,minZ=Infinity,left=Infinity,right=Infinity,flange=0,baseContact=-Infinity;
 for(let j=0;j<n;j++){const x=b.readFloatLE(12+j*44),y=b.readFloatLE(16+j*44),z=b.readFloatLE(20+j*44);const xx=p.dx+x*Math.cos(p.yaw)-y*Math.sin(p.yaw),yy=p.dy+x*Math.sin(p.yaw)+y*Math.cos(p.yaw);assert.ok(Math.abs(xx)<=.50001&&Math.abs(yy)<=.50001&&z>=-.00001&&z<=1);const along=xx*dir[0]+yy*dir[1];
  contact=Math.max(contact,along);
  if(kind==='pipe'){
   if(z<.02)baseContact=Math.max(baseContact,along);
   const nx=b.readFloatLE(24+j*44),ny=b.readFloatLE(28+j*44);
   const facing=(nx*Math.cos(p.yaw)-ny*Math.sin(p.yaw))*dir[0]+(nx*Math.sin(p.yaw)+ny*Math.cos(p.yaw))*dir[1];
   if(z>.68&&along>.49999&&facing>.95)flange++;
  }
  minZ=Math.min(minZ,z);if(x<-.25)left=Math.min(left,z);if(x>.25)right=Math.min(right,z);}
 assert.ok(Math.abs(minZ)<1e-5);if(kind==='bench'){assert.ok(left<1e-5);assert.ok(right<1e-5);}else{assert.ok(flange>=3,'upper flange must face and touch the wall');assert.ok(baseContact<.35,'floor base must stay away from the wall');}
 assert.ok(Math.abs(contact-(kind==='pipe'?.5:.485))<1e-5,`${kind} ${dir}: ${contact}`);
 }
}
console.log('PASS bench and pipe actual mesh vertices, four wall orientations, grounded bench and wall-facing pipe flange');
