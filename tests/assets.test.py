"""Validate CRM2 model lengths, finite vertices, normals, indices, and enemy image alpha."""
from pathlib import Path
import struct,json,hashlib
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
report=json.loads((root/'docs/alpha3-assets.json').read_text())
models={}
integrity=json.loads((root/'docs/alpha4-mesh-integrity.json').read_text())
for kind in ['tree','campfire']:
 b=(root/'assets/models'/f'{kind}-optimized.mesh').read_bytes()
 assert hashlib.sha256(b).hexdigest()==integrity[kind]['sha256']
 magic,n,k=struct.unpack_from('<4sII',b)
 assert magic==b'CRM2' and len(b)==12+44*n+4*k and k%3==0
 v=np.frombuffer(b,dtype='<f4',offset=12,count=n*11).reshape(-1,11)
 f=np.frombuffer(b,dtype='<u4',offset=12+44*n)
 assert np.isfinite(v).all() and f.max()<n and v[:,2].min()>=-1e-6
 assert n==report['models'][kind]['vertices_after'] and k//3==report['models'][kind]['triangles_after']
 models[kind]=k//3
assert len(models)==2
for name in ['chrum','marmur','blysk','szept','nowy-przeciwnik']:
 with Image.open(root/'assets/characters'/f'{name}.png') as im:
  im.load();a=im.convert('RGBA').getchannel('A');assert a.getextrema()==(0,255) and a.getbbox()
print('PASS CRM2 models:',models,'; five enemy sprites have visible alpha data.')

rock=(root/'assets/models/rock-optimized.mesh').read_bytes()
magic,n,k=struct.unpack_from('<4sII',rock)
assert magic==b'CRM2' and n==2812 and k==5144*3 and len(rock)==12+44*n+4*k
v=np.frombuffer(rock,dtype='<f4',offset=12,count=n*11).reshape(-1,11)
f=np.frombuffer(rock,dtype='<u4',offset=12+44*n)
assert np.isfinite(v).all() and f.max()<n and abs(v[:,2].min())<1e-6 and np.ptp(v[:,2])>0
for name in ['decals/plasm_3.png','ui/detection-warning.png']:
 with Image.open(root/'assets'/name) as im: assert im.convert('RGBA').getchannel('A').getextrema()==(0,255)
with Image.open(root/'assets/models/rock-albedo.webp') as im: im.load();assert max(im.size)<=768
print('PASS real rock geometry, albedo and supplied transparent HUD/decal images')

for kind,triangles in [('slot',1968),('door',740)]:
 b=(root/'assets/models'/f'{kind}-optimized.mesh').read_bytes();magic,n,k=struct.unpack_from('<4sII',b)
 assert magic==b'CRM2' and k==triangles*3 and len(b)==12+44*n+4*k
 v=np.frombuffer(b,dtype='<f4',offset=12,count=n*11).reshape(-1,11);f=np.frombuffer(b,dtype='<u4',offset=12+44*n)
 assert np.isfinite(v).all() and f.max()<n and abs(v[:,2].min())<1e-6
 assert np.allclose(np.linalg.norm(v[:,3:6],axis=1),1,atol=.001)
 print('PASS new model',kind,n,triangles)

# New environment geometry: all 14 assets, actual radius/height constraints,
# finite unit normals, atlas UV bounds and valid shared image.
decor=json.loads((root/'docs/decor-assets.json').read_text())
assert len(decor['models'])==14 and decor['materials']==19
with Image.open(root/'assets/models/decor/albedo.webp') as im:
 im.load();assert list(im.size)==decor['atlas']
for name,meta in decor['models'].items():
 b=(root/'assets/models/decor'/f'{name}.mesh').read_bytes()
 magic,n,k=struct.unpack_from('<4sII',b)
 assert magic==b'CRM2' and len(b)==12+44*n+4*k and k==3*meta['triangles']
 v=np.frombuffer(b,dtype='<f4',offset=12,count=n*11).reshape(-1,11)
 f=np.frombuffer(b,dtype='<u4',offset=12+44*n)
 assert np.isfinite(v).all() and f.max()<n and np.allclose(np.linalg.norm(v[:,3:6],axis=1),1,atol=.002),name
 assert v[:,6:8].min()>=0 and v[:,6:8].max()<=1 and v[:,8:11].min()>=0 and v[:,8:11].max()<=1,name
 assert abs(v[:,2].min())<1e-6 and v[:,2].max()<=.92 and np.linalg.norm(v[:,:2],axis=1).max()<=.45,name
 if meta['placement']=='wall':assert np.abs(v[:,1]).max()<=.08501,name
print('PASS 14 decor meshes, normalized geometry and shared texture atlas')

for material in ['yellow','flood','industrial','chrum']:
 for surface in ['wall','floor','ceiling']:
  with Image.open(root/'assets/materials'/f'{material}-{surface}.png') as im:
   im.load();assert im.mode=='RGB' and im.size==(512,1024 if surface=='wall' else 512)
   assert np.std(np.asarray(im,dtype=float)[:,:,0])>2
print('PASS 12 original HD albedo material assets and native resolutions')
