// Compact, stackless bounding-volume trees. Each node stores two vec4s:
// lower.xyz / escape index, upper.xyz / leaf payload. Branch children are
// contiguous; a rejected node jumps directly beyond its entire subtree.
const SHADOW_INSTANCE_LIMIT=96;
const SHADOW_STATIC_START=SHADOW_INSTANCE_LIMIT*6;
const SHADOW_RECEIVER_RANGE=11;

function shadowTree(items, data, base, leafSize, writeLeaf){
 const root=data.length/4+base;
 const lower=[Infinity,Infinity,Infinity],upper=[-Infinity,-Infinity,-Infinity];
 for(const item of items)for(let axis=0;axis<3;axis++){
  lower[axis]=Math.min(lower[axis],item.lower[axis]);
  upper[axis]=Math.max(upper[axis],item.upper[axis]);
 }
 const offset=data.length;
 data.push(...lower,0,...upper,0);
 if(items.length<=leafSize){
  data[offset+7]=writeLeaf(items,data);
 }else{
  let axis=0;
  for(let i=1;i<3;i++)if(upper[i]-lower[i]>upper[axis]-lower[axis])axis=i;
  items.sort((a,b)=>(a.lower[axis]+a.upper[axis])-(b.lower[axis]+b.upper[axis]));
  const mid=items.length>>1;
  shadowTree(items.slice(0,mid),data,base,leafSize,writeLeaf);
  shadowTree(items.slice(mid),data,base,leafSize,writeLeaf);
 }
 data[offset+3]=data.length/4+base;
 return {root,lower,upper};
}

function addShadowMesh(data,mesh){
 const vertices=new DataView(mesh.vertexData.buffer,mesh.vertexData.byteOffset,mesh.vertexData.byteLength);
 const indices=new DataView(mesh.indexData.buffer,mesh.indexData.byteOffset,mesh.indexData.byteLength);
 const points=Array.from({length:mesh.vertices},(_,i)=>[0,4,8].map(o=>vertices.getFloat32(i*44+o,true)));
 const triangles=[];
 for(let i=0;i<mesh.indices;i+=3){
  const a=points[indices.getUint32(i*4,true)];
  const b=points[indices.getUint32(i*4+4,true)];
  const c=points[indices.getUint32(i*4+8,true)];
  triangles.push({a,b,c,lower:a.map((v,j)=>Math.min(v,b[j],c[j])),upper:a.map((v,j)=>Math.max(v,b[j],c[j]))});
 }
 return shadowTree(triangles,data,SHADOW_STATIC_START,4,(items,out)=>{
  for(const {a,b,c} of items)out.push(...a,0,...b,0,...c,0);
  return items.length;
 });
}

function shadowInstance(mesh,pose){
 const [x,y,z,scale,cos,sin,,,tiltCos=1,tiltSin=0]=pose;
 const {lower,upper,root}=mesh;
 const middle=lower.map((v,i)=>(v+upper[i])*.5);
 const half=lower.map((v,i)=>(upper[i]-v)*.5);
 const axes=[[cos,-sin*tiltCos,sin*tiltSin],[sin,cos*tiltCos,-cos*tiltSin],[0,tiltSin,tiltCos]];
 const center=axes.map((axis,i)=>[x,y,z][i]+scale*axis.reduce((s,v,k)=>s+v*middle[k],0));
 const extent=axes.map(axis=>scale*axis.reduce((s,v,k)=>s+Math.abs(v)*half[k],0)+.0001);
 return {root,pose:[x,y,z,scale,cos,sin,tiltCos,tiltSin],
  lower:center.map((v,i)=>v-extent[i]),upper:center.map((v,i)=>v+extent[i])};
}

class CatroomsModelShadows {
 constructor(device){
  this.device=device;
  this.meshes={};
  this.previous=[];
  this.count=0;
 }
 initialize(data){
  this.buffer=this.device.createBuffer({label:'Catrooms shadow BVHs',
   size:(SHADOW_STATIC_START*4+data.length)*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});
  this.device.queue.writeBuffer(this.buffer,SHADOW_STATIC_START*16,new Float32Array(data));
 }
 sync(casters){
  const items=casters.filter(c=>this.meshes[c.model]);
  if(items.length===this.previous.length&&items.every((c,i)=>c.model===this.previous[i].model&&c.pose.every((v,j)=>v===this.previous[i].pose[j])))return;
  this.previous=items;
  this.count=items.length;
  if(!this.count)return;
  const data=[];
  shadowTree(items.map(({model,pose})=>shadowInstance(this.meshes[model],pose)),data,0,1,([item],out)=>{
   out.push(...item.pose);
   return item.root;
  });
  this.device.queue.writeBuffer(this.buffer,0,new Float32Array(data));
 }
}
