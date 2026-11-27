// Boot must reject missing definitions before touching the DOM.
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const boot=fs.readFileSync(path.join(__dirname,'../js/core/boot.js'),'utf8');
assert.throws(()=>vm.runInNewContext(boot,{window:{}}),/Incomplete game scripts/);
const ctx={window:{CatroomsScriptsReady:true},bossRushVisible(){},bossRushCompleted(){},resetBossRush(){},modeFor(){}};
assert.throws(()=>vm.runInNewContext(boot,ctx),/Incomplete game scripts/);
assert.throws(()=>vm.runInNewContext(boot,{window:{CatroomsStartupError:{message:'404'}}}),/Startup aborted/);
console.log('PASS missing bundle, missing Custom Game and previous script error prevent partial startup');
