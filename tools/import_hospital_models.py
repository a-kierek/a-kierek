#!/usr/bin/env python3
"""Import the supplied slot_machine.glb and hospital_door.glb into CRM2.
Usage: python tools/import_hospital_models.py /path/slot_machine.glb /path/hospital_door.glb
Only base color is used by the lightweight runtime shader; glass is opaque tinted.
"""
from pathlib import Path
import sys, struct, json, io
import numpy as np
import trimesh
from PIL import Image
out=Path(__file__).resolve().parents[1]/'assets/models'
def convert(src,kind,size):
    scene=trimesh.load(str(src),force='scene',process=False)
    verts=[]; faces=[]; offset=0
    for node in sorted(scene.graph.nodes_geometry):
        tf,name=scene.graph.get(node); m=scene.geometry[name]
        p=np.asarray(m.vertices)@tf[:3,:3].T+tf[:3,3]
        n=np.asarray(m.vertex_normals)@np.linalg.inv(tf[:3,:3]);
        # glTF Y-up -> engine Z-up. Slot front points into the room at yaw 0.
        signs=np.array([1,1,1] if kind=='slot' else [1,-1,1]);p=p[:,[0,2,1]]*signs;n=n[:,[0,2,1]]*signs
        uv=getattr(m.visual,'uv',None);uv=np.asarray(uv) if uv is not None else np.zeros((len(p),2))
        if uv.shape!=(len(p),2):uv=np.zeros((len(p),2))
        mat=m.visual.material
        color=np.ones(3) if kind=='slot' else np.asarray(mat.baseColorFactor[:3],dtype=float)/255.
        if kind=='door' and 'Glasses' in name:color=np.array([.35,.47,.49])
        verts.append(np.concatenate([p,n,uv,np.tile(color,(len(p),1))],axis=1));faces.append(np.asarray(m.faces)+offset);offset+=len(p)
    v=np.concatenate(verts);f=np.concatenate(faces);lo=v[:,:3].min(0);hi=v[:,:3].max(0);scale=np.array(size)/(hi-lo)
    v[:,:3]=(v[:,:3]-[(lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]])*scale
    v[:,3:6]/=scale;v[:,3:6]/=np.maximum(np.linalg.norm(v[:,3:6],axis=1,keepdims=True),1e-8)
    (out/f'{kind}-optimized.mesh').write_bytes(struct.pack('<4sII',b'CRM2',len(v),f.size)+v.astype('<f4').tobytes()+f.astype('<u4').tobytes())
    print(kind,len(v),'vertices',len(f),'triangles','bounds',np.ptp(v[:,:3],axis=0))
    if kind=='slot':
        raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+jl]);data=raw[28+jl:]
        image=doc['images'][doc['textures'][doc['materials'][0]['pbrMetallicRoughness']['baseColorTexture']['index']]['source']];view=doc['bufferViews'][image['bufferView']];start=view.get('byteOffset',0)
        im=Image.open(io.BytesIO(data[start:start+view['byteLength']])).convert('RGB');im.thumbnail((1024,1024));im.save(out/'slot-albedo.webp',quality=90,method=5);print('slot albedo',im.size)
convert(Path(sys.argv[1]),'slot',[.85,.67,.95]);convert(Path(sys.argv[2]),'door',[1.04,.16,1.0])
