#!/usr/bin/env python3
"""Reproducible original procedural CP04 albedo assets (no external sources)."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
OUT=Path(__file__).resolve().parents[1]/'assets/materials'
OUT.mkdir(exist_ok=True)
def surface(name,w,h,seed,base,kind):
    rng=np.random.default_rng(seed)
    y,x=np.mgrid[0:h,0:w]; u=x/w; v=y/h
    def noise(n,m):
        raw=rng.integers(0,256,(m,n),dtype=np.uint8)
        return np.asarray(Image.fromarray(raw).resize((w,h),Image.Resampling.BICUBIC),dtype=np.float32)/127.5-1
    broad=noise(9,13); mid=noise(37,53); fine=noise(180,220); grain=rng.normal(0,1,(h,w))
    d=9*broad+4*mid+2*fine+1.8*grain
    if kind=='wallpaper':
        d+=4*np.cos(u*2*np.pi*7)+2*np.cos(u*2*np.pi*28)
        leaf=np.exp(-((np.mod(u*7,1)-.5)/.12)**2-((np.mod(v*8,1)-.5)/.18)**2)
        d-=15*leaf+15*np.maximum(0,-broad-.25)*np.clip(v*1.8,0,1)
    elif kind=='metal':
        d+=4*np.sin(u*2*np.pi*4)+3*np.sin(v*2*np.pi*80)+9*np.maximum(0,mid-.15)
        d-=28*((np.mod(u*4,1)<.045)|(np.mod(v*5,1)<.045))
    elif kind=='panel':
        d-=25*((np.mod(u*4,1)<.09)|(np.mod(v*4,1)<.055));d+=4*np.sin(v*2*np.pi*95)
    elif kind=='wood':
        d+=6*np.sin(u*2*np.pi*45+3*broad)+3*np.sin(u*2*np.pi*112+2*mid)
        d-=25*(np.mod(u*6,1)<.035);d-=12*(np.mod(v*5,1)<.035)
    elif kind=='carpet':
        d+=5*np.sin(u*2*np.pi*160)*np.cos(v*2*np.pi*170)+3*grain-10*np.maximum(0,-broad)
    elif kind=='tile':
        d+=5*broad-30*((np.mod(u*2,1)<.018)|(np.mod(v*2,1)<.018))
    elif kind=='ceiling':
        d-=15*(fine<-.45);d+=2*grain
    elif kind=='concrete':
        d+=3*grain-10*(fine<-.55)
    elif kind=='mud':
        d+=9*broad+5*mid-8*(fine<-.5)
    rgb=np.clip(np.array(base)[None,None,:]+d[:,:,None]*np.array([1,.91,.72]),0,255).astype(np.uint8)
    im=Image.fromarray(rgb,'RGB')
    if kind=='wallpaper':
        g=ImageDraw.Draw(im);g.rectangle((0,int(h*.86),w,h),fill=(99,89,58));g.rectangle((0,int(h*.85),w,int(h*.875)),fill=(169,149,100));g.rectangle((0,int(h*.89),w,int(h*.895)),fill=(126,110,71));g.rectangle((0,0,w,int(h*.025)),fill=(171,155,103))
    im.save(OUT/(name+'.png'),optimize=True)
for i,(name,base,kind) in enumerate([('yellow-wall',(190,174,113),'wallpaper'),('flood-wall',(55,77,87),'metal'),('industrial-wall',(72,53,72),'panel'),('chrum-wall',(109,78,64),'wood')]):surface(name,512,1024,100+i,base,kind)
# Keep original shader's sector tinting: surfaces use neutral/warm source tones.
for i,(name,base,kind) in enumerate([('yellow-floor',(109,99,73),'carpet'),('yellow-ceiling',(166,158,118),'ceiling'),('flood-floor',(125,130,123),'tile'),('flood-ceiling',(151,153,142),'concrete'),('industrial-floor',(117,111,105),'concrete'),('industrial-ceiling',(146,140,130),'panel'),('chrum-floor',(108,99,75),'mud'),('chrum-ceiling',(143,129,105),'wood')]):surface(name,512,512,200+i,base,kind)
