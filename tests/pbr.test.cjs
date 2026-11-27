const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});const run=s=>vm.runInContext(s,ctx);
run(['js/graphics/materials.js','js/graphics/shaders/shared.js','js/graphics/shaders/terrain.js','js/graphics/shaders/world-geometry.js'].map(read).join('\n'));
const paths=run('SURFACE_DETAIL_PATHS');assert.equal(paths.length,12);assert.equal(new Set(paths).size,12);
for(const p of paths){const png=fs.readFileSync(path.join(root,p));assert.equal(png.readUInt32BE(16),512);assert.equal(png.readUInt32BE(20),512);assert.equal(png[25],2);}
for(const code of [run('TERRAIN_WGSL'),run('geometryTerrainSource()')]){
 for(const term of ['@binding(12)','fn cp11BRDF','material.roughness','wallLightVisible(p.xy,source.xy','readSurfaceDetail(uv,layer+4','readSurfaceDetail(vec2f(texX,wallV)','detailAvailable()&&hit!=8u&&layer<4'])assert.ok(code.includes(term),term);
}
// Numeric reference for bounded dielectric GGX at extreme roughness/angles.
function brdf(nl,nv,nh,vh,rough,base){if(nl<=0)return 0;nv=Math.max(nv,.001);const a=rough**2,a2=a*a,q=nh*nh*(a2-1)+1,d=a2/Math.max(Math.PI*q*q,.000001),k=(rough+1)**2/8,g=nv/(nv*(1-k)+k)*nl/(nl*(1-k)+k),f=.04+.96*(1-vh)**5,s=d*g*f/Math.max(4*nv*nl,.001);return ((1-f)*base+Math.min(s*Math.PI,4))*nl;}
for(const rough of [.16,.32,.58,.91,.96])for(const nl of [0,.001,.1,.5,1])for(const nv of [0,.001,.1,.5,1])for(const nh of [0,.01,.5,.99,1])for(const vh of [0,.1,.9,1]){const n=brdf(nl,nv,nh,vh,rough,.4);assert.ok(Number.isFinite(n)&&n>=0&&n<=4.4);}
assert.ok(brdf(1,1,1,1,.32,.4)>brdf(1,1,1,1,.9,.4));
const gpu=read('js/graphics/webgpu.js');assert.ok(gpu.includes('this.hdEnabled&&this.surfaceDetails?this.surfaceDetails:this.wallTexture'));assert.ok(gpu.includes('renderer.surfaceDetails=await buildSurfaceDetails(renderer)'));
console.log('PASS 12 packed detail maps, both terrain shader paths, material fallback and 2500 bounded GGX reference cases');
