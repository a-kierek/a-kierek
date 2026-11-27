#!/usr/bin/env python3
"""Alpha 3 asset optimizer. Run once on original CRM2 payloads, not on Alpha 3 output.
Requires numpy, Pillow and ffmpeg. Keep the Alpha 2.1 ZIP as the source backup.
"""
from pathlib import Path
import base64, re, struct, subprocess, json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'js/graphics/model-data.js'
original=P.read_text(encoding='ascii')
if 'ALPHA3_OPTIMIZED' in original: raise SystemExit('Historical Alpha 3 tool: run in an extracted Alpha 2.1 project, not this release.')

def simplify(raw,kind,step):
    magic,n,k=struct.unpack_from('<4sII',raw)
    assert magic==b'CRM2' and len(raw)==12+44*n+4*k
    v=np.frombuffer(raw,dtype='<f4',count=n*11,offset=12).reshape(-1,11)
    f=np.frombuffer(raw,dtype='<u4',offset=12+n*44).reshape(-1,3)
    if kind=='campfire':return raw,n,k//3,n,k//3
    # Cluster only vertices with similar normals, UVs and materials, retaining the original texture coordinates.
    key=np.concatenate([np.rint(v[:,:3]/step),np.rint(v[:,3:6]*2),np.rint(v[:,6:8]/.04),np.rint(v[:,8:]*32)],axis=1).astype(np.int32)
    _,m=np.unique(key,axis=0,return_inverse=True)
    num=int(m.max())+1
    count=np.bincount(m,minlength=num)
    merged=np.stack([np.bincount(m,weights=v[:,i],minlength=num)/count for i in range(11)],axis=1).astype(np.float32)
    normals=merged[:,3:6];normals/=np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-8)
    ff=m[f];ff=ff[(ff[:,0]!=ff[:,1])&(ff[:,1]!=ff[:,2])&(ff[:,2]!=ff[:,0])]
    # Cull duplicate triangles; mesh pipeline renders both sides.
    _,unique=np.unique(np.sort(ff,axis=1),axis=0,return_index=True)
    ff=ff[np.sort(unique)]
    a,b,c=merged[ff[:,0],:3],merged[ff[:,1],:3],merged[ff[:,2],:3]
    ff=ff[np.linalg.norm(np.cross(b-a,c-a),axis=1)>1e-10]
    used,remap=np.unique(ff.ravel(),return_inverse=True)
    merged=merged[used];ff=remap.reshape(-1,3)
    assert np.isfinite(merged).all() and ff.max()<len(merged)
    # Keep overall proportions and floor contact exact.
    oldmin,oldmax=v[:,:3].min(0),v[:,:3].max(0)
    newmin,newmax=merged[:,:3].min(0),merged[:,:3].max(0)
    merged[:,:3]=(merged[:,:3]-newmin)*(oldmax-oldmin)/np.maximum(newmax-newmin,1e-8)+oldmin
    packed=struct.pack('<4sII',b'CRM2',len(merged),ff.size)+merged.astype('<f4').tobytes()+ff.astype('<u4').tobytes()
    return packed,n,k//3,len(merged),len(ff)

report={'models':{},'images':{},'audio':{}}
parts=['// ALPHA3_OPTIMIZED: UV/material/normal-aware clustering of existing CRM2 meshes.','const CATROOMS_MODEL_MESHES={']
for kind,b64 in re.findall(r"\b(tree|slot|campfire)\s*:\s*'([A-Za-z0-9+/=]+)'",original):
    raw=base64.b64decode(b64,validate=True)
    packed,n,f,nn,ff=simplify(raw,kind,{'slot':.018,'tree':.006,'campfire':0}[kind])
    report['models'][kind]={'vertices_before':n,'vertices_after':nn,'triangles_before':f,'triangles_after':ff,'bytes_before':len(raw),'bytes_after':len(packed)}
    parts.append(f" {kind}:'{base64.b64encode(packed).decode('ascii')}',")
assert len(report['models'])==3
P.write_text('\n'.join(parts+['};','']),encoding='ascii')
# Only oversized item art, not enemy portraits or jumpscares. Maintain PNG and aspect/alpha.
for name in ['card.png','battery.png','puffi.png','grosz.png']:
    p=ROOT/'assets/items'/name;size=p.stat().st_size
    with Image.open(p) as src:
        im=src.convert('RGBA');old=im.size;im.thumbnail((512,512),Image.Resampling.LANCZOS)
    if im.size!=old:im.save(p,optimize=True)
    report['images'][name]={'before':list(old),'after':list(im.size),'bytes_before':size,'bytes_after':p.stat().st_size}
# Keep the same MP3 paths. No changes to short SFX and voices.
for name in ['music/menu-ambient.mp3','music/game-ambient.mp3','music/chase-trailer.mp3']:
    p=ROOT/'assets/audio'/name;size=p.stat().st_size;out=p.with_name(p.stem+'.optimized.mp3')
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(p),'-map_metadata','0','-c:a','libmp3lame','-b:a','128k',str(out)],check=True)
    out.replace(p);report['audio'][name]={'bytes_before':size,'bytes_after':p.stat().st_size}
(ROOT/'docs/alpha3-assets.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
