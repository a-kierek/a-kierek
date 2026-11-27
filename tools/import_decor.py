#!/usr/bin/env python3
"""Convert themed GLB models into CRM2 meshes and a shared padded albedo atlas.
Usage: python tools/import_decor.py /path/to/models
Needs numpy, trimesh and Pillow. Original GLBs remain outside the release.
"""
from pathlib import Path
import sys, json, hashlib, math
import numpy as np
import trimesh
from PIL import Image
from decor_geometry import collision_data, correct_mesh, write_mesh
root=Path(__file__).resolve().parents[1]; src=Path(sys.argv[1]); out=root/'assets/models/decor'; out.mkdir(parents=True,exist_ok=True)
# Dimensions in tiles; a floor model's entire horizontal bounding circle fits one tile.
# Wall fixtures are recessed into the wall clearance band.
# Per-model maximum height and radius preserve proportions.
specs=[
 ('box','box.glb',1,'floor',.52,.42),('cabinet','rusty_filing_cabinet.glb',1,'floor',.90,.39),('desk','school_desk.glb',1,'floor',.64,.43),('yellowClock','wall_clock__ps1_style.glb',1,'wall',.28,.20),
 ('bench','floodedcomplex/broken_bench.glb',2,'floor',.48,.44),('lifebuoy','floodedcomplex/lifebuoy.glb',2,'wall',.43,.27),('pipe','floodedcomplex/pipe.glb',2,'floor',.90,.38),('pump','floodedcomplex/water_motor_pump.glb',2,'floor',.68,.43),
 ('barrel','bloodyzone/rusty_red_barell_with_danger_sign.glb',3,'floor',.68,.39),('metalTable','bloodyzone/table_with_metal_legs.glb',3,'floor',.67,.44),
 ('camera','chrumsector/broken_camera.glb',4,'wall',.28,.30),('crt','chrumsector/crt-tv.glb',4,'floor',.56,.43),
 ('mannequin','lastencounter/store_mannequin.glb',5,'floor',.91,.35),('lastClock','lastencounter/wall_clock__ps1_style.glb',5,'wall',.36,.30)]
# Atlas deduplicates identical material images. A white tile handles untextured materials.
images=[]; hashes={}; models=[]
def tile(im):
 if im is None: im=Image.new('RGB',(8,8),'white')
 im=im.convert('RGB'); key=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
 if key not in hashes: hashes[key]=len(images);images.append(im)
 return hashes[key]
for name,rel,stage,placement,height,radius in specs:
 scene=trimesh.load(str(src/rel),force='scene',process=False)
 verts=[];faces=[];tile_ids=[];offset=0
 for node in sorted(scene.graph.nodes_geometry):
  tf,gn=scene.graph.get(node);m=scene.geometry[gn];p=np.asarray(m.vertices)@tf[:3,:3].T+tf[:3,3]
  n=np.asarray(m.vertex_normals)@np.linalg.inv(tf[:3,:3]);p=p[:,[0,2,1]]*[1,-1,1];n=n[:,[0,2,1]]*[1,-1,1]
  n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-9)
  uv=getattr(m.visual,'uv',None);uv=np.asarray(uv) if uv is not None else np.zeros((len(p),2));uv=np.clip(uv,0,1)
  mat=getattr(m.visual,'material',None); im=getattr(mat,'baseColorTexture',None)
  factor=getattr(mat,'baseColorFactor',None);color=np.ones(3) if factor is None else np.asarray(factor[:3],dtype=float)/255.
  verts.append(np.concatenate([p,n,uv,np.tile(color,(len(p),1))],axis=1)); f=np.asarray(m.faces)
  if np.linalg.det(tf[:3,:3])<0:f=f[:,[0,2,1]]
  faces.append(f+offset);tile_ids.extend([tile(im)]*len(p));offset+=len(p)
 v=np.concatenate(verts);f=np.concatenate(faces);lo=v[:,:3].min(0);hi=v[:,:3].max(0)
 v[:,:3]-=[(lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]]
 scale=min(height/max(hi[2]-lo[2],1e-9),radius/max(np.linalg.norm(v[:,:2],axis=1).max(),1e-9))
 v[:,:3]*=scale
 if placement=='wall':
  # Keep fixtures inside the wall-side 0.22-tile clearance band. A player
  # whose body stays in the corridor cannot collide with them.
  depth_scale=min(1.,.085/max(np.abs(v[:,1]).max(),1e-9))
  v[:,1]*=depth_scale;v[:,4]/=depth_scale
  v[:,3:6]/=np.maximum(np.linalg.norm(v[:,3:6],axis=1,keepdims=True),1e-9)
 correct_mesh(name,v,f,radius)
 models.append((name,rel,stage,placement,v,f,np.asarray(tile_ids)))
# 384px per material plus a replicated edge gutter to prevent bilinear bleed.
cell=384;pad=4;cols=math.ceil(math.sqrt(len(images)));rows=math.ceil(len(images)/cols);aw,ah=cols*cell,rows*cell
atlas=Image.new('RGB',(aw,ah),(255,255,255))
for i,im in enumerate(images):
 im=im.resize((cell-2*pad,cell-2*pad),Image.Resampling.LANCZOS)
 a=np.pad(np.asarray(im),((pad,pad),(pad,pad),(0,0)),mode='edge');atlas.paste(Image.fromarray(a),((i%cols)*cell,(i//cols)*cell))
atlas.save(out/'albedo.webp',quality=87,method=5)
report={}; lines=[]; collision_models=[]
for name,rel,stage,placement,v,f,ids in models:
 # Existing shader flips v. Map source texture into the atlas's coordinates.
 v[:,6]=((ids%cols)*cell+pad+.5+v[:,6]*(cell-2*pad-1))/aw
 v[:,7]=1-((ids//cols)*cell+pad+.5+(1-v[:,7])*(cell-2*pad-1))/ah
 # Exact duplicate vertex reduction (retains hard edges and UV seams).
 v,inv=np.unique(v.astype('<f4'),axis=0,return_inverse=True);f=inv[f].astype('<u4')
 dest=out/('pipe-flanged.mesh' if name=='pipe' else name+'.mesh');write_mesh(dest,v,f)
 if placement=='floor':collision_models.append((name,v))
 radius=float(np.linalg.norm(v[:,:2],axis=1).max());h=float(v[:,2].max());d=float(np.abs(v[:,1]).max())
 report[name]={'source':rel,'stage':stage,'placement':placement,'triangles':len(f),'vertices':len(v),'radius':radius,'height':h,'depth':d,'bytes':dest.stat().st_size}
 if dest.name!=name+'.mesh':report[name]['mesh']=dest.name
 lines.append(f" {name}:Object.freeze({{stage:{stage},placement:'{placement}',radius:{radius:.5f},height:{h:.5f},depth:{d:.5f},triangles:{len(f)},mesh:'assets/models/decor/{dest.name}'}}),")
 print(name,len(f),'triangles',round(radius,3),round(h,3))
(root/'js/graphics/decor-data.js').write_text('// Generated by tools/import_decor.py. World units in tiles.\nconst DECOR_MODELS=Object.freeze({\n'+'\n'.join(lines)+"\n});\nconst DECOR_ALBEDO='assets/models/decor/albedo.webp';\n"+collision_data(collision_models,out.parent/'rock-optimized.mesh'))
(root/'docs/decor-assets.json').write_text(json.dumps({'atlas':[aw,ah],'materials':len(images),'models':report},indent=2)+'\n')
print('Atlas',aw,ah,len(images),'materials; total',sum(p.stat().st_size for p in out.iterdir()),'bytes')
