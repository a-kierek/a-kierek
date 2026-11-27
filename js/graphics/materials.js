// CP04: separate albedo library, shared by classic and raster terrain paths.
const HD_WALL_PATHS=Object.freeze(['assets/materials/yellow-wall.png','assets/materials/flood-wall.png','assets/materials/industrial-wall.png','assets/materials/chrum-wall.png']);
const HD_FLOOR_PATHS=Object.freeze(['assets/materials/yellow-floor.png','assets/materials/yellow-ceiling.png','assets/materials/flood-floor.png','assets/materials/flood-ceiling.png','assets/materials/industrial-floor.png','assets/materials/industrial-ceiling.png','assets/materials/chrum-floor.png','assets/materials/chrum-ceiling.png']);
const HD_WALL_SIZE=Object.freeze([512,1024,12]);
const HD_FLOOR_SIZE=Object.freeze([512,512,8]);
function materialMipSizes(w,h){
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1)throw Error('Invalid material dimensions');
 const levels=[];while(true){levels.push([w,h]);if(w===1&&h===1)return levels;w=Math.max(1,Math.floor(w/2));h=Math.max(1,Math.floor(h/2));}
}
function materialCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function uploadMaterialMips(device,texture,source,w,h,layer,cover=false){
 let previous=source;
 for(const [mip,[mw,mh]] of materialMipSizes(w,h).entries()){
  const c=materialCanvas(mw,mh),g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  if(mip===0&&cover){g.fillStyle='#080506';g.fillRect(0,0,mw,mh);const sw=source.naturalWidth||source.width,sh=source.naturalHeight||source.height;const s=Math.max(mw/sw,mh/sh);g.drawImage(source,(mw-sw*s)/2,(mh-sh*s)/2,sw*s,sh*s);}
  else g.drawImage(previous,0,0,mw,mh);
  device.queue.copyExternalImageToTexture({source:c},{texture,mipLevel:mip,origin:[0,0,layer]},[mw,mh,1]);
  previous=c;
 }
}
async function loadHdAlbedo(path,w,h){const img=new Image();img.src=path;await img.decode();if(img.naturalWidth!==w||img.naturalHeight!==h)throw Error('Invalid HD material dimensions');return img;}
async function buildHdMaterials(renderer){
 const d=renderer.device;
 let wall,floor;
 d.pushErrorScope('out-of-memory');d.pushErrorScope('validation');
 let failure=null;
 try{
  const [walls,floors]=await Promise.all([Promise.all(HD_WALL_PATHS.map(p=>loadHdAlbedo(p,512,1024))),Promise.all(HD_FLOOR_PATHS.map(p=>loadHdAlbedo(p,512,512)))]);
  const create=(size,label)=>d.createTexture({label,size,mipLevelCount:materialMipSizes(size[0],size[1]).length,format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
  wall=create(HD_WALL_SIZE,'CP04 HD wall albedo');floor=create(HD_FLOOR_SIZE,'CP04 HD floor albedo');
  [...walls,doorOpenTexture,doorTexture,doorShutImg].forEach((source,i)=>uploadMaterialMips(d,wall,source,512,1024,i));
  for(let i=0;i<5;i++){
   const img=SAFE_ROOM_POSTER_IMAGES[i];let source=img;
   if(!img?.naturalWidth){source=materialCanvas(1,1);const g=source.getContext('2d');g.fillStyle='#7b5a4b';g.fillRect(0,0,1,1);}
   uploadMaterialMips(d,wall,source,512,1024,7+i,true);
  }
  floors.forEach((source,i)=>uploadMaterialMips(d,floor,source,512,512,i));
  await d.queue.onSubmittedWorkDone?.();
 }catch(e){failure=String(e.message||e);}
 const validation=await d.popErrorScope(),memory=await d.popErrorScope();
 failure=failure||validation?.message||memory?.message;
 if(failure){wall?.destroy();floor?.destroy();throw Error(failure);}
 return {wall,floor};
}
