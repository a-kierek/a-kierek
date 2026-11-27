const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const ctx=vm.createContext({});
vm.runInContext(`
const GPUBufferUsage={UNIFORM:1,COPY_DST:2},GPUTextureUsage={RENDER_ATTACHMENT:1,TEXTURE_BINDING:2};
let ids=0, passes=[], destroyed=[], writes=[];
const device={createShaderModule:()=>({}),createRenderPipeline:d=>({...d,getBindGroupLayout:()=>({})}),createBuffer:()=>({}),createSampler:()=>({}),createTexture:d=>{const id=++ids;return {id,d,createView:()=>({id}),destroy:()=>destroyed.push(id)}},createBindGroup:d=>d,queue:{writeBuffer:(b,o,data)=>writes.push(Array.from(data))}};
const encoder={beginRenderPass:d=>{const p={output:d.colorAttachments[0].view,draws:0};passes.push(p);return {setPipeline:v=>p.pipeline=v,setBindGroup:(i,v)=>p.bind=v,draw:n=>p.draws=n,end:()=>{}}}};
${read('js/graphics/post-processing.js')}
const pp=new CatroomsPostProcessing(device,'bgra8unorm');pp.resize(1700,1000);
`,ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('pp.scene.d.format'),'rgba16float');assert.equal(run('pp.bloomWidth'),425);assert.equal(run('pp.bloomHeight'),250);
run('pp.encode(encoder,{id:999},true,1000)');assert.equal(run('passes.length'),4);assert.equal(run('pp.index'),1);
assert.equal(run('passes.every(p=>p.draws===3&&!p.bind.entries.some(e=>e.resource.id===p.output.id))'),true);
assert.equal(run('passes[3].pipeline.fragment.targets[0].format'),'bgra8unorm');
assert.equal(run('writes[0][2]'),1);run('pp.encode(encoder,{id:999},true,1016)');assert.equal(run('pp.index'),0);assert.equal(run('writes[1][2]'),0);
run('pp.enabled=false;pp.encode(encoder,{id:999},true,1032)');assert.equal(run('pp.passes'),1);assert.equal(run('pp.reset'),true);
run('pp.enabled=true;pp.encode(encoder,{id:999},true,1048)');assert.equal(run('writes[3][2]'),1);
run('pp.encode(encoder,{id:999},true,20000)');assert.ok(run('writes[4][0]')<=.100001);
run('pp.resize(1,1)');assert.equal(run('destroyed.length'),5);assert.equal(run('pp.bloomWidth'),1);assert.equal(run('pp.index'),0);assert.equal(run('pp.reset'),true);
run('pp.encode(encoder,{id:999},false,21000)');assert.equal(run('pp.passes'),1);assert.equal(run('pp.reset'),true);
const shader=run('POST_WGSL');for(const name of ['exposure','extract','blur','composite'])assert.ok(shader.includes(`fn ${name}(`));
const render=read('js/graphics/webgpu.js');assert.match(render,/post\?\'rgba16float\':format/);assert.match(render,/event.code!==\'F4\'/);assert.match(read('js/graphics/shaders/terrain.js'),/out.color=vec4f\(max\(color/);
console.log('PASS HDR target, 4-pass pipeline, no read/write aliasing, exposure ping-pong, time cap, resize cleanup and bypass (mock GPU)');
