"""Validate shader compilation, GPU shadow visibility and the interactive benchmark in Chromium."""
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import time
from urllib.request import urlopen
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    port = sock.getsockname()[1]
base = f'http://localhost:{port}'
server = subprocess.Popen(['node', 'server/server.js'], cwd=root, stdout=subprocess.DEVNULL,
                          env={**os.environ, 'HOST': '127.0.0.1', 'PORT': str(port)})
try:
    for _ in range(50):
        try:
            with urlopen(base + '/health', timeout=2) as response:
                assert response.status == 200
            break
        except OSError:
            time.sleep(.1)
    else:
        raise RuntimeError('Web server failed to start')

    with sync_playwright() as playwright:
        chromium = sys.argv[1] if len(sys.argv) > 1 else '/usr/bin/chromium'
        args = ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-webgpu',
                '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-gpu-watchdog',
                '--autoplay-policy=no-user-gesture-required']
        browser = playwright.chromium.launch(executable_path=chromium, headless=True, args=args)
        page = browser.new_page(viewport={'width': 480, 'height': 320})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.add_init_script("""
        window.gpuErrors=[];
        // Headless SwiftShader cannot present a shared Chromium swap buffer
        // here. Provide a real GPU render target with readback support.
        let target;
        const getContext=HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext=function(type,...args){
          if(type!=='webgpu')return getContext.call(this,type,...args);
          return {
            configure:({device,format})=>{
              target?.destroy();
              target=device.createTexture({size:[this.width,this.height],format,
                usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});
            },
            getCurrentTexture:()=>target,
          };
        };
        const requestDevice=GPUAdapter.prototype.requestDevice;
        GPUAdapter.prototype.requestDevice=async function(...args){
          const device=await requestDevice.apply(this,args);
          device.addEventListener('uncapturederror',event=>gpuErrors.push(event.error.message));
          return device;
        };
        """)
        page.goto(base)
        page.wait_for_function("window.CatroomsGraphicsStatus && CatroomsGraphicsStatus.backend!=='initializing'", timeout=90000)
        assert page.evaluate("CatroomsGraphicsStatus.backend==='webgpu'"), page.evaluate("CatroomsGraphicsStatus")
        assert page.evaluate("CatroomsPBR.available && CatroomsTerrainExperiment.available && CatroomsPostFX.available")
        print('PASS WebGPU compiles classic, 3D geometry, PBR, sprite, mesh and HDR pipelines', flush=True)

        visibility = page.evaluate("""async ()=>{
          const device=gpuRenderer.device;
          const storage=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST;
          const make=(data)=>{const buffer=device.createBuffer({size:data.byteLength,usage:storage});device.queue.writeBuffer(buffer,0,data);return buffer;};
          const tiles=new Uint32Array(128*8);
          tiles[2*128+3]=1;
          // One model instance translated away from its single test triangle.
          const shadow=new Float32Array(20*4);
          shadow.set([4.49,4,0,4, 4.51,5,1,5, 4.5,4,0,1, 1,0,1,0]);
          shadow.set([0,0,0,10, 0,1,1,1, 0,0,0,0, 0,1,0,0, 0,0,1,0],5*4);
          const map=make(tiles),models=make(shadow);
          const output=device.createBuffer({size:24,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});
          const readback=device.createBuffer({size:24,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});
          const source=FRAME_WGSL+LIGHTING_WGSL+`
          @group(0) @binding(0) var<storage,read> worldTiles:array<u32>;
          @group(0) @binding(1) var<storage,read> shadowData:array<vec4f>;
          @group(0) @binding(2) var<storage,read_write> output:array<f32>;
          @compute @workgroup_size(1) fn test(){
            let start=vec3f(2.5,2.5,0.4);let end=vec3f(4.5,2.5,0.9);
            output[0]=shadowSample(start,end,8,true,0.);
            output[1]=shadowSample(start,end,8,false,0.);
            output[2]=shadowSample(vec3f(3.5,4.25,.25),vec3f(5.5,4.25,.25),8,false,1.);
            output[3]=shadowSample(vec3f(3.5,4.75,.75),vec3f(5.5,4.75,.75),8,false,1.);
            var f:SceneFrame;f.viewport.z=8.;f.shadows.x=1.;
            output[4]=lightVisibility(vec3f(2.5,3.035,.4),vec3f(4.5,3.035,.9),f,true,.28);
            f.shadows.x=0.;
            output[5]=lightVisibility(vec3f(2.5,3.035,.4),vec3f(4.5,3.035,.9),f,true,.28);
          }`;
          const shader=device.createShaderModule({code:source});
          const compilation=await shader.getCompilationInfo();
          if(compilation.messages.some(m=>m.type==='error'))throw Error(compilation.messages.map(m=>m.message).join(' | '));
          const pipeline=device.createComputePipeline({layout:'auto',compute:{module:shader,entryPoint:'test'}});
          const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[map,models,output].map((buffer,binding)=>({binding,resource:{buffer}}))});
          const encoder=device.createCommandEncoder();
          const pass=encoder.beginComputePass();
          pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.dispatchWorkgroups(1);pass.end();
          encoder.copyBufferToBuffer(output,0,readback,0,24);
          device.queue.submit([encoder.finish()]);
          await readback.mapAsync(GPUMapMode.READ);
          const result=Array.from(new Float32Array(readback.getMappedRange()));
          readback.unmap();
          for(const buffer of [map,models,output,readback])buffer.destroy();
          return result;
        }""")
        assert visibility[:4] == [0, 1, 0, 1] and 0 < visibility[4] < 1 and visibility[5] == 1, visibility
        print('PASS GPU readback confirms opaque walls, triangle-shaped model shadows and a soft penumbra', flush=True)

        page.evaluate("CatroomsGraphicsBench.running=true")
        page.evaluate("localStorage.setItem('catroomsTutorialDone','1');$('releaseNotesClose').click();$('pixelPressStart').click();$('graphicsDemoBtn').click()")
        assert page.evaluate("gameSession.graphicsDemo && gameSession.state==='playing' && !qualifiesForProgress()")
        page.evaluate("""
        gameSession.player.x=24.5;gameSession.player.y=10.55;
        if(!toggleGraphicsDemoDoor()||gameSession.world[9][24]!==0)throw Error('Demo door failed');
        toggleGraphicsDemoDoor();pause();$('settingsPauseBtn').click();
        $('settingPreset').value='ultra';$('settingPreset').dispatchEvent(new Event('change'));gpuRenderer.render();
        """)
        page.wait_for_function("gpuRenderer.stats.planeTriangles>0 && gpuRenderer.frameData[RENDER_FRAME.shadows+1]>0")
        assert page.evaluate("CatroomsLighting.softShadows && CatroomsLighting.modelShadows && CatroomsPBR.enabled")
        pixels = page.evaluate("""async ()=>{
          const r=gpuRenderer,device=r.device;
          const capture=async ()=>{
            const width=r.lastWidth,height=r.lastHeight,stride=Math.ceil(width*4/256)*256;
            const buffer=device.createBuffer({size:stride*height,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});
            r.render();
            const encoder=device.createCommandEncoder();
            encoder.copyTextureToBuffer({texture:r.context.getCurrentTexture()},{buffer,bytesPerRow:stride},[width,height]);
            device.queue.submit([encoder.finish()]);
            await buffer.mapAsync(GPUMapMode.READ);
            const view=new Uint8Array(buffer.getMappedRange()),pixels=[];
            for(let row=0;row<height;row+=4)for(let column=0;column<width;column+=4){
              const offset=row*stride+column*4;
              pixels.push(view[offset],view[offset+1],view[offset+2]);
            }
            buffer.unmap();buffer.destroy();return pixels;
          };
          const diff=(a,b)=>a.reduce((sum,v,i)=>sum+Math.abs(v-b[i]),0)/a.length;
          if(r.post)r.post.enabled=false;
          r.softShadowsEnabled=false;r.modelShadowsEnabled=false;
          const raster=await capture();
          r.worldGeometry.toggle();const classic=await capture();
          r.toggleHdMaterials();const noPbr=await capture();
          r.toggleHdMaterials();r.worldGeometry.toggle();
          r.softShadowsEnabled=true;r.modelShadowsEnabled=true;
          const shadows=await capture();
          if(r.post)r.post.enabled=true;
          return {geometryDelta:diff(raster,classic),pbrDelta:diff(classic,noPbr),
            shadowDelta:diff(raster,shadows),range:Math.max(...raster)-Math.min(...raster)};
        }""")
        assert pixels['range'] > 20 and pixels['geometryDelta'] < 4 and pixels['pbrDelta'] > 1, pixels
        assert pixels['shadowDelta'] > .03, pixels
        print('PASS terrain pixel readback compares 3D geometry, classic raycast, HD/PBR and shadows', pixels, flush=True)
        options = page.evaluate("({triangles:gpuRenderer.stats.planeTriangles,oldTriangles:gameSession.world.flat().filter(t=>t===0||t===5).length*4})")
        print(f"PASS demo render and merged geometry ({options['triangles']} vs {options['oldTriangles']} plane triangles)", flush=True)

        page.set_viewport_size({'width': 320, 'height': 216})
        print('Running five presets on an isolated WebGPU render target', flush=True)
        page.evaluate("""
        CatroomsGraphicsBench.running=false;
        window.benchSession=gameSession;
        window.benchPosition=[gameSession.player.x,gameSession.player.y,gameSession.clock];
        $('settingsDefaultsBtn').click();
        if(!gpuRenderer.wallShadowsEnabled||gpuRenderer.worldGeometry.enabled||gpuRenderer.softShadowsEnabled)throw Error('Defaults failed');
        $('settingPreset').value='auto';$('settingPreset').dispatchEvent(new Event('change'));
        """)
        page.wait_for_function("!CatroomsGraphicsBench.running", timeout=180000)
        assert page.evaluate("$('settingBenchResults').querySelectorAll('li').length===5"), page.evaluate("$('settingBenchResults').textContent")
        assert page.evaluate("""gameSession===benchSession && gameSession.state==='paused' &&
          [gameSession.player.x,gameSession.player.y,gameSession.clock].every((v,i)=>v===benchPosition[i]) &&
          $('settingPreset').value==='auto' && !!localStorage.getItem('catroomsGfxAuto') &&
          !$('graphicsBenchDialog').open""")
        results = page.evaluate("CatroomsGraphicsBench.results")
        print('PASS AUTO benchmarks five presets and preserves the paused session', flush=True)
        print(json.dumps(results), flush=True)
        page.evaluate("$('settingBenchmark').click();$('graphicsBenchCancel').click();")
        page.wait_for_function("!CatroomsGraphicsBench.running && $('settingBenchResults').textContent==='Benchmark cancelled.'")
        assert page.evaluate("$('settingPreset').value==='auto' && !!localStorage.getItem('catroomsGfxAuto')")
        assert page.evaluate("gpuErrors.length===0"), page.evaluate("gpuErrors")
        assert not errors, errors
        browser.close()
finally:
    server.terminate()
    server.wait(timeout=5)
