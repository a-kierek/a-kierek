"""Check the real packaged Node HTTP server, using a fresh local port."""
from pathlib import Path
import json, re, os, socket, subprocess, time, urllib.request, urllib.error, urllib.parse
root=Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1',0)); port=sock.getsockname()[1]
base=f'http://127.0.0.1:{port}/'
proc=subprocess.Popen(['node','server/server.js'],cwd=root,env={**os.environ,'HOST':'127.0.0.1','PORT':str(port)},stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
def get(path):
    with urllib.request.urlopen(base+path,timeout=5) as response:
        return response.status,response.read()
try:
    for _ in range(50):
        try:
            status,health=get('health'); break
        except OSError: time.sleep(.1)
    else: raise RuntimeError('Server did not start')
    assert status==200 and json.loads(health)['version']=='1.7.0-alpha.1'
    status,html=get(''); assert status==200
    html=html.decode(); scripts=re.findall(r'<script src="([^"]+)"></script>',html)
    assert scripts==['js/game.bundle.js?v=1.7.0-alpha.1.2','js/core/boot.js?v=1.7.0-alpha.1.2']
    for path in scripts+re.findall(r'<link href="([^"]+)" rel="stylesheet"',html)+json.loads((root/'tools/script-order.json').read_text()):
        status,body=get(path); assert status==200 and body==(root/path.split('?')[0]).read_bytes(),path
    for path in ['slot-optimized.mesh','tree-optimized.mesh','campfire-optimized.mesh','slot-albedo.webp']:
        status,body=get('assets/models/'+path); assert status==200 and body==(root/'assets/models'/path).read_bytes()
    # Verify every production media file, including exact case-sensitive paths.
    asset_files=[p for p in (root/'assets').rglob('*') if p.is_file() and p.suffix.lower() in {'.png','.svg','.webp','.jpg','.jpeg','.wav','.ogg','.mp3','.mesh'}]
    for asset in asset_files:
        status,body=get(urllib.parse.quote(asset.relative_to(root).as_posix())); assert status==200 and body==asset.read_bytes(),asset
    assert get('favicon.ico')[0]==204
    try: get('js/nonexistent-beta-test.js')
    except urllib.error.HTTPError as e: assert e.code==404
    else: raise AssertionError('Missing script must return 404')
    print(f'PASS all {len(asset_files)} production media files via HTTP, genuine missing file returns 404')
    paths=json.loads((root/'tools/script-order.json').read_text())
    expected='\n;\n'.join('// SOURCE: '+path+'\n'+(root/path).read_text() for path in paths[:-1])+'\n;\nwindow.CatroomsScriptsReady = true;\n'
    expected=re.sub(r"""(['"])(assets/audio/replacements/[^'"\s]+\.mp3)\1""",
                    lambda m: m[0] if (root/m[2]).is_file() else 'null', expected)
    assert (root/'js/game.bundle.js').read_text()==expected
    print('PASS actual HTTP server: version, index, both scripts, all source scripts, CSS, models, favicon, bundle integrity')
finally:
    proc.terminate();proc.wait(timeout=5)
