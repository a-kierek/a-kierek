// Usable inventory: items remain in the player's possession until explicitly activated.
function ensureInventory(){
 if(!gameSession.player.inventory)gameSession.player.inventory={energy:[],slow:0,freeze:0};
 return gameSession.player.inventory;
}
function updateInventoryUI(){
 const inv=ensureInventory();
 const counters={inventoryDrinkCount:inv.energy.length,inventorySlowCount:gameSession.player.slowCharges||0,inventoryFreezeCount:gameSession.player.freezeCharges||0};
 for(const [id,v] of Object.entries(counters)){const e=$(id);if(e)e.textContent=String(v)}
 const drink=$('inventoryDrinkSprite');
 if(drink&&inv.energy.length)drink.src=ENERGY_DRINK_PNGS[inv.energy[0].energySprite||0];
 for(const [id,n] of [['inventoryDrink',inv.energy.length],['inventorySlow',gameSession.player.slowCharges||0],['inventoryFreeze',gameSession.player.freezeCharges||0]]){
  const e=$(id);if(e){e.disabled=n<1;e.setAttribute('aria-label',id+' · '+n+' szt.')}
 }
 const root=$('activeInventory');if(root)root.classList.toggle('inv-empty',!inv.energy.length&&!inv.slow&&!inv.freeze);
}
function useEnergyDrink(){
 if(gameSession.state!=='playing')return;
 const item=ensureInventory().energy.shift();
 if(!item){showToast('NO ENERGY DRINKS',1.6);return}
 if(item.fakeMonster){
  gameSession.player.energySlowUntil=gameSession.elapsed+2.75;
  showToast('FAKE MONSTER · SPADEK PREDKOSCI NA 2.75 SEKUND',4);
  playSting();
 }else{
  gameSession.player.stamina=Math.min(staminaMax(),(gameSession.player.stamina||0)+85);
  UI.stamina.style.width=staminaWidth();
  showToast('ENERGY DRINK USED · STAMINA RESTORED',2.4);playPickup();
 }
 updateInventoryUI();
}
for(const [id,fn] of [['inventoryDrink',useEnergyDrink],['inventorySlow',useHardSlow],['inventoryFreeze',useHardFreeze]]){
 const button=$(id);if(button)button.addEventListener('click',fn);
}
window.addEventListener('keydown',e=>{
 if(gameSession.state!=='playing'||e.repeat||e.target?.matches?.('input,textarea,select'))return;
 if(e.code==='Digit1')useEnergyDrink();
 if(e.code==='Digit2'||e.code==='KeyZ')useHardSlow();
 if(e.code==='Digit3'||e.code==='KeyX')useHardFreeze();
});
