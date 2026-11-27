#!/usr/bin/env python3
"""CP11: deterministic approximate relief/roughness from original procedural albedo.
Packed RGB: tangent normal X,Y in RG, perceptual roughness in B. Opaque PNG.
All derivatives wrap so repeating material edges are consistent.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
ROOT=Path(__file__).resolve().parents[1]/'assets/materials'
MATERIALS={
'yellow-wall':(.84,.65),'flood-wall':(.48,.85),'industrial-wall':(.58,.85),'chrum-wall':(.78,.85),
'yellow-floor':(.91,.95),'yellow-ceiling':(.84,.60),'flood-floor':(.32,.85),'flood-ceiling':(.76,.75),
'industrial-floor':(.82,.90),'industrial-ceiling':(.62,.80),'chrum-floor':(.87,.90),'chrum-ceiling':(.81,.80)}
for name,(rough,strength) in MATERIALS.items():
    img=Image.open(ROOT/(name+'.png')).convert('L').resize((512,512),Image.Resampling.LANCZOS)
    h=np.asarray(img.filter(ImageFilter.GaussianBlur(.85)),dtype=np.float32)/255
    # A restrained luminance-derived relief proxy, not measured surface geometry.
    dx=(np.roll(h,-1,1)-np.roll(h,1,1))*strength*3.5
    dy=(np.roll(h,-1,0)-np.roll(h,1,0))*strength*3.5
    length=np.sqrt(1+dx*dx+dy*dy)
    local=np.clip(rough+(0.5-h)*.18+(h.mean()-.5)*.18,.16,.96)
    packed=np.stack((.5-.5*dx/length,.5-.5*dy/length,local),axis=-1)
    Image.fromarray(np.rint(np.clip(packed,0,1)*255).astype(np.uint8),'RGB').save(ROOT/(name+'-detail.png'),optimize=True)
