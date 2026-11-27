// Contract of modular shader sources and renderer assembly.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const order=JSON.parse(read('tools/script-order.json'));
const shaders=['terrain','sprites','mesh'].map(n=>`js/graphics/shaders/${n}.js`);
const idx=order.indexOf('js/graphics/webgpu.js');
const shared='js/graphics/shaders/shared.js';
assert.deepEqual(order.slice(idx-8,idx),['js/graphics/camera.js',shared,...shaders,'js/graphics/shaders/world-geometry.js','js/graphics/world-geometry.js','js/graphics/post-processing.js']);
assert.equal(new Set(order).size,order.length);
const bundle=read('js/game.bundle.js');
const ctx=vm.createContext({});
vm.runInContext([shared,...shaders].map(read).join('\n'),ctx);
for(const [name,file] of [['TERRAIN_WGSL',shaders[0]],['SPRITES_WGSL',shaders[1]],['MODEL_WGSL',shaders[2]]]){
 assert.ok(vm.runInContext(name,ctx).includes('@fragment'));
 assert.ok(bundle.includes(read(file)),`${file} not in online bundle`);
 assert.ok(!read('js/graphics/webgpu.js').includes(`const ${name} =`));
}
console.log('PASS modular shader order, source uniqueness and online bundle');
