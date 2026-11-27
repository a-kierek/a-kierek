#!/usr/bin/env python3
"""Embed the local CSS, JS, optimized GLB meshes and audio in one offline HTML.
Run: python tools/build_standalone.py
"""
from pathlib import Path
import base64
import re
import json
from functools import lru_cache

root = Path(__file__).resolve().parents[1]
output = root.parent / 'THE_CATROOMS_V1_6_2_4.html'
text = (root / 'index.html').read_text(encoding='utf-8')

@lru_cache(maxsize=None)
def data_url(path):
    asset = root / path
    if not asset.is_file():
        raise FileNotFoundError(asset)
    suffix = asset.suffix.lower()
    mime = {'.png': 'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.mesh':'application/octet-stream'}[suffix]
    return f'data:{mime};base64,{base64.b64encode(asset.read_bytes()).decode("ascii")}'

def inline_css(match):
    css = (root / match.group(1)).read_text(encoding='utf-8')
    for rel in ['blood-ui.png','handprints-ui.png','grease-ui.png','damage-ui.png','menu-blood-handprint.png']:
        css=css.replace("../assets/ui/"+rel, data_url('assets/ui/'+rel))
    return '<style>\n' + css + '\n</style>'

def script_source(path):
    js = (root / path).read_text(encoding='utf-8')
    # Embed quoted local asset paths, including binary model manifests.
    # Cache URLs so multiple references do not repeatedly read/encode a file.
    js = re.sub(r"(['\"])(assets/[^'\"\s]+\.(?:png|svg|webp|wav|mp3|ogg|mesh))\1",
                lambda m: m.group(1) + data_url(m.group(2)) + m.group(1), js)
    if '</script' in js.lower():
        raise ValueError(f'Unsafe script ending in {path}')
    return js

# Asset URLs in HTML attributes must also be embedded (not only JS string paths).
text = re.sub(r'(<img[^>]*\bsrc=")(?P<path>assets/(?:items|ui)/[^"]+\.(?:png|svg))(")',
              lambda m: m.group(1)+data_url(m.group('path'))+m.group(3),text)
text = re.sub(r'<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="([^"]+)")[^>]*>', inline_css, text)
# Generate the online bundle from the same canonical ordered manifest as offline.
paths = json.loads((root / 'tools/script-order.json').read_text(encoding='utf-8'))
assert paths[-1] == 'js/core/boot.js' and len(paths) == len(set(paths))
assert 'js/gameplay/custom-mode.js' in paths
ready = '\n;\nwindow.CatroomsScriptsReady = true;\n'
def combine(reader):
    return '\n;\n'.join('// SOURCE: '+path+'\n'+reader(path) for path in paths[:-1])+ready
online = combine(lambda path: (root/path).read_text(encoding='utf-8'))
(root/'js/game.bundle.js').write_text(online, encoding='utf-8')
pattern = r'<script src="js/game\.bundle\.js\?v=1\.6\.2\.4"></script>\s*<script src="js/core/boot\.js\?v=1\.6\.2\.4"></script>'
bundle = combine(script_source)
boot = script_source(paths[-1])
text, count = re.subn(pattern, lambda _: '<script>\n'+bundle+'\n</script>\n<script>\n'+boot+'\n</script>', text)
assert count == 1, 'Expected online bundle and boot tags in index.html'
output.write_text(text, encoding='utf-8')
print(f'{output} ({output.stat().st_size:,} bytes)')
