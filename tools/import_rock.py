#!/usr/bin/env python3
"""Convert the user's original rock.glb to the renderer's CRM2 and albedo assets.
Usage: python tools/import_rock.py /path/to/rock.glb
Dependencies: numpy, trimesh, Pillow. The source GLB stays outside the runtime ZIP.
"""
from pathlib import Path
import sys, struct, json, io
import numpy as np
import trimesh
from PIL import Image
src=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'assets/models'
raw=src.read_bytes();jl=struct.unpack_from('<I',raw,12)[0]
doc=json.loads(raw[20:20+jl]);data=raw[28+jl:]
scene=trimesh.load(str(src),force='scene',process=False)
vertices=[];faces=[];offset=0
for node in scene.graph.nodes_geometry:
    tf,name=scene.graph.get(node);m=scene.geometry[name]
    p=np.asarray(m.vertices)@tf[:3,:3].T+tf[:3,3]
    n=np.asarray(m.vertex_normals)@np.linalg.inv(tf[:3,:3]);n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-8)
    # Y-up glTF to the game's Z-up right-handed coordinate system.
    p=p[:,[0,2,1]]*np.array([1,-1,1]);n=n[:,[0,2,1]]*np.array([1,-1,1]);uv=np.asarray(m.visual.uv)
    vertices.append(np.concatenate([p,n,uv,np.ones((len(p),3))],axis=1));faces.append(np.asarray(m.faces)+offset);offset+=len(p)
v=np.concatenate(vertices);f=np.concatenate(faces);lo=v[:,:3].min(0);hi=v[:,:3].max(0)
v[:,:3]-=np.array([(lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]]);v[:,:3]*=.98/max((hi-lo)[:2])
(out/'rock-optimized.mesh').write_bytes(struct.pack('<4sII',b'CRM2',len(v),f.size)+v.astype('<f4').tobytes()+f.astype('<u4').tobytes())
material=doc['materials'][0];texture=doc['textures'][material['pbrMetallicRoughness']['baseColorTexture']['index']];view=doc['bufferViews'][doc['images'][texture['source']]['bufferView']]
start=view.get('byteOffset',0);im=Image.open(io.BytesIO(data[start:start+view['byteLength']])).convert('RGB');im.thumbnail((768,768));im.save(out/'rock-albedo.webp',quality=88,method=4)
print(f'Imported {len(v)} vertices / {len(f)} triangles; albedo {im.size}. Rebuild the standalone HTML next.')
