#!/usr/bin/env python3
"""Build both versions and run the regression suite; optional mocked-GPU browser smoke."""
from pathlib import Path
import argparse, subprocess, sys
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--browser', action='store_true', help='Run optional Chromium smoke test (mock GPU)')
p.add_argument('--webgpu', action='store_true', help='Validate real WebGPU with Chromium and SwiftShader')
p.add_argument('--chromium', help='Optional Chromium executable path')
args=p.parse_args()
def run(*cmd):
    print('>>>', ' '.join(map(str,cmd)),flush=True)
    subprocess.run(list(map(str,cmd)),cwd=root,check=True)
run(sys.executable,'tools/build_standalone.py')
for path in sorted((root/'js').rglob('*.js')):
    run('node','--check',path.relative_to(root))
run('node','--check','server/server.js')
for path in sorted((root/'tests').glob('*.test.cjs')):
    run('node',path.relative_to(root))
for path in ['tests/assets.test.py','tests/server_smoke.py']:
    run(sys.executable,path)
if args.browser:
    run(sys.executable,'tests/browser_smoke.py',*([args.chromium] if args.chromium else []))
if args.webgpu:
    run(sys.executable,'tests/webgpu_smoke.py',*([args.chromium] if args.chromium else []))
print('PASS release checks')
