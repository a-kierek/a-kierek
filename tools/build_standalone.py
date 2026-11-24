#!/usr/bin/env python3
"""Embed the local CSS, JS, optimized GLB meshes and audio in one offline HTML.
Run: python tools/build_standalone.py
"""
from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]
output = root.parent / 'THE_CATROOMS_V1_3_SEKTOR_05.html'
text = (root / 'index.html').read_text(encoding='utf-8')

def data_url(path):
    asset = root / path
    if not asset.is_file():
        raise FileNotFoundError(asset)
    suffix = asset.suffix.lower()
    mime = {'.png': 'image/png', '.webp':'image/webp', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.ogg':'audio/ogg'}[suffix]
    return f'data:{mime};base64,{base64.b64encode(asset.read_bytes()).decode("ascii")}'

def inline_css(match):
    css = (root / match.group(1)).read_text(encoding='utf-8')
    for rel in ['blood-ui.png','handprints-ui.png','grease-ui.png','damage-ui.png','menu-blood-splatter.png','menu-blood-handprint.png']:
        css=css.replace("../assets/ui/"+rel, data_url('assets/ui/'+rel))
    return '<style>\n' + css + '\n</style>'

def inline_js(match):
    js = (root / match.group(1)).read_text(encoding='utf-8')
    # JS constants containing paths are replaced by URI without external dependencies.
    for relative in [
        'assets/characters/marmur.png', 'assets/characters/szept.png',
        'assets/characters/blysk.png', 'assets/characters/chrum.png', 'assets/characters/nowy-przeciwnik.png',
        'assets/items/battery.png', 'assets/items/card.png', 'assets/items/puffi.png',
        'assets/items/slow-device.png', 'assets/items/freeze-device.png',
        'assets/items/grosz.png', 'assets/ui/menu-blood-splatter.png', 'assets/ui/menu-blood-handprint.png', 'assets/items/energy-classic.png', 'assets/items/energy-berry.png',
        'assets/items/energy-peach.png', 'assets/items/energy-ultra.png', 'assets/items/energy-green.png',
        'assets/decals/blood-realistic.png',
        'assets/models/slot-albedo.webp',
        'assets/audio/safe-room/lift-music.mp3', 'assets/audio/safe-room/campfire-crackle.mp3',
        'assets/audio/menu-beep.mp3', 'assets/audio/coin-pickup.mp3','assets/audio/coin-slot.wav', 'assets/audio/battery-charge.wav', 'assets/audio/roblox-walking.mp3',
        'assets/audio/pig-oink.mp3', 'assets/audio/pig-grunt.mp3',
        'assets/audio/pig-squeal.mp3', 'assets/audio/angry-beast.mp3',
        'assets/audio/angry-cat.mp3', 'assets/audio/very-angry-cat.mp3', 'assets/audio/steve-old-hurt.mp3',
        'assets/audio/voices/szept-jadymy-na-imielin.mp3',
        'assets/audio/voices/szept-nie-lubi-imielina.mp3',
        'assets/audio/voices/szept-vamos-polska.mp3',
        'assets/audio/voices/blysk-oni-gadaja.mp3',
        'assets/audio/voices/blysk-kurwy.mp3',
        'assets/audio/voices/blysk-pijany.mp3',
        'assets/audio/jumpscares/appear-scream-loud.wav',
        'assets/audio/hard/heartbeat.mp3','assets/audio/hard/pig-squeal-horror.mp3',
    ]:
        js = js.replace("'" + relative + "'", "'" + data_url(relative) + "'")
    if '</script' in js.lower():
        raise ValueError(f'Unsafe script ending in {match.group(1)}')
    return '<script>\n' + js + '\n</script>'

# Asset URLs in HTML attributes must also be embedded (not only JS string paths).
text = re.sub(r'(<img[^>]*\bsrc=")(?P<path>assets/items/[^"]+\.png)(")',
              lambda m: m.group(1)+data_url(m.group('path'))+m.group(3),text)
text = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, text)
text = re.sub(r'<script src="([^"]+)"></script>', inline_js, text)
text = text.replace('THE CATROOMS | NORMAL / HARD', 'THE CATROOMS | NORMAL / HARD')
output.write_text(text, encoding='utf-8')
print(f'{output} ({output.stat().st_size:,} bytes)')
