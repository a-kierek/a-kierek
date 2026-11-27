// Network builds load binary mesh files; the standalone build uses the same loader
// with embedded data URLs, without depending on network fetch or file:// XHR.
class AssetManager {
 static async binary(source){
  if(typeof source!=='string')throw new TypeError('Invalid asset URL');
  if(source.startsWith('data:application/octet-stream;base64,')){
   const text=atob(source.slice(source.indexOf(',')+1)),bytes=new Uint8Array(text.length);
   for(let i=0;i<text.length;i++)bytes[i]=text.charCodeAt(i);
   return bytes;
  }
  const response=await fetch(source);
  if(!response.ok)throw new Error('Asset load failed: '+source+' (HTTP '+response.status+')');
  return new Uint8Array(await response.arrayBuffer());
 }
 static parseMesh(bytes,kind){
  if(bytes.byteLength<12||bytes[0]!==67||bytes[1]!==82||bytes[2]!==77||bytes[3]!==50)throw new Error('Invalid model format: '+kind);
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const vertices=view.getUint32(4,true),indices=view.getUint32(8,true),offset=12,vLen=vertices*44,iLen=indices*4;
  if(!vertices||!indices||indices%3||offset+vLen+iLen!==bytes.byteLength)throw new Error('Damaged model '+kind);
  return {vertices,indices,vertexData:bytes.subarray(offset,offset+vLen),indexData:bytes.subarray(offset+vLen)};
 }
 static async mesh(kind){return this.parseMesh(await this.binary(CATROOMS_MODEL_MESHES[kind]??DECOR_MODELS[kind]?.mesh),kind);}
}
