// Mode IDs remain compatible with existing save keys, seeds and developer commands.
// Reset and simulation strategy are selected from the same registry.
const modeDefinition=(name,generate,step,roomPolicy='shared')=>Object.freeze({name,generate,step,roomPolicy});
const normalFacilityStep=dt=>updateFacility(dt,false);
const hardModeDefinition=modeDefinition('hard',()=>resetHard(),dt=>updateHard(dt));
const modeDefinitions=Object.freeze({
 1:modeDefinition('normal-1',()=>resetBase(),dt=>updateBase(dt)),
 2:modeDefinition('normal-2',()=>resetLevel2(),normalFacilityStep),
 3:modeDefinition('normal-3',()=>resetLevel3(),dt=>updateFacility(dt,true)),
 4:modeDefinition('normal-4',()=>resetLevel4(),normalFacilityStep),
 5:modeDefinition('procedural',()=>resetProcedural(),normalFacilityStep),
 6:hardModeDefinition,7:hardModeDefinition,8:hardModeDefinition,9:hardModeDefinition,
 10:modeDefinition('normal-5',()=>resetLevel5(),normalFacilityStep),11:hardModeDefinition,
 12:modeDefinition('boss-rush',()=>resetBossRush(),dt=>updateBossRush(dt),'owned'),
 13:modeDefinition('custom',()=>resetCustomGame(),dt=>{if(isHardMode())updateHard(dt);else normalFacilityStep(dt);},'optional')
});
function modeFor(id){const mode=modeDefinitions[id];if(!mode)throw new RangeError('Unknown game mode '+id);return mode;}
function resolveRunEntry(target,difficulty,customStage=1){
 if(!Number.isInteger(target)||target<1||target>13)return null;
 const stage=target===13?customStage:target===12?0:target===10||target===11?5:target>=6&&target<=9?target-5:target;
 const hard=target===12||target===11||(target>=6&&target<=9)||(difficulty==='hard'&&stage>=1&&stage<=4);
 const id=target===13||target===12?target:hard?(stage===5?11:stage+5):target;
 return {id,stage,hard};
}
function reset(){
 gameSession.resetRound();
 sessionTimers.clear('death');$('jump').classList.remove('show');
 resetSimulationClock();
 clearModeClasses();$('hardEmergency').hidden=true;
 // Avoid stale UI diff caches when returning to a mode with the same counters.
 delete $('missionDetails').dataset.stats;delete $('stealthStatus').dataset.stealth;
 const mode=modeFor(gameSession.level);mode.generate();
 if(mode.roomPolicy==='owned'){scatterLevelDecor();return;}
 if(mode.roomPolicy==='optional'&&!customGameConfig.safeRooms){gameSession.player.coins=0;updateCoinCounter();scatterLevelDecor();return;}
 setupSafeRoomAndCoins();
 if(mode.roomPolicy==='optional'){
  for(let attempt=0;attempt<7&&!gameSession.safeRoom;attempt++){
   gameSession.safeRoomFurniture=[];mode.generate();setupSafeRoomAndCoins();
  }
  if(!gameSession.safeRoom)showToast('COULD NOT PLACE SAFE ROOM: CHOOSE A LARGER MAP',3);
 }
 scatterLevelDecor();
}
function update(dt){if(gameSession.graphicsDemo)updateGraphicsDemo(dt);else modeFor(gameSession.level).step(dt);}
