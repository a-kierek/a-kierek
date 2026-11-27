// Usable inventory: items remain in the player's possession until explicitly activated.
function ensureInventory(){
 const inventory=gameSession.player.inventory??={energy:[],slow:0,freeze:0,shield:0};
 inventory.shield??=0;
 return inventory;
}
const INVENTORY_SLOTS=[
 ['inventoryDrink','Drink',useEnergyDrink],
 ['inventorySlow','Slow device',useHardSlow],
 ['inventoryFreeze','Freeze device',useHardFreeze],
 ['inventoryShield','Shield',useShield]
];
function updateInventoryUI(){
 const inv=ensureInventory();
 const counts=[inv.energy.length,gameSession.player.slowCharges||0,gameSession.player.freezeCharges||0,inv.shield];
 const drink=$('inventoryDrinkSprite');
 if(drink&&inv.energy.length)drink.src=ENERGY_DRINK_PNGS[inv.energy[0].energySprite||0];
 INVENTORY_SLOTS.forEach(([id,label],index)=>{
  const button=$(id),count=counts[index],selected=index===gameSession.inventorySlot;
  if(button){
   button.classList.toggle('is-empty',count===0);
   button.classList.toggle('is-selected',selected);
   button.setAttribute('aria-pressed',String(selected));
   button.setAttribute('aria-label',label+' · '+count);
  }
  const counter=$(id+'Count');
  if(counter)counter.textContent=String(count);
 });
 $('activeInventory')?.classList.toggle('inv-empty',!counts.some(Boolean));
}
function selectInventorySlot(index){
 if(gameSession.state!=='playing'||gameSession.graphicsDemo)return;
 gameSession.inventorySlot=(index+INVENTORY_SLOTS.length)%INVENTORY_SLOTS.length;
 updateInventoryUI();
}
function useSelectedItem(){
 if(gameSession.state==='playing'&&!gameSession.graphicsDemo)INVENTORY_SLOTS[gameSession.inventorySlot][2]();
}
function useShield(){
 if(gameSession.state!=='playing')return;
 const inventory=ensureInventory();
 if(!inventory.shield){showToast('NO SHIELDS',1.6);return;}
 inventory.shield--;
 gameSession.player.shieldUntil=Math.max(gameSession.elapsed,gameSession.player.shieldUntil||0)+12;
 showToast('SHIELD ACTIVE · 12 SEC',2.4);playUnlock();updateInventoryUI();
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
INVENTORY_SLOTS.forEach(([id],index)=>{
 $(id)?.addEventListener('click',()=>{
  selectInventorySlot(index);
  if(isCoarse)useSelectedItem();
 });
});
