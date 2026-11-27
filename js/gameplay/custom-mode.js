// Custom solo game, no campaign progress/achievements granted.
// Reuses the proven connected HARD dungeon generator and enemy AI.
function readCustomGameForm(){
 const requestedStage=Number($('customTheme').value);
 const stage=[1,2,3,4,5].includes(requestedStage)?requestedStage:1;
 const size=[49,65,81,97,121].includes(Number($('customSize').value))?Number($('customSize').value):65;
 const difficulty=$('customDifficulty').value==='hard'?'hard':'normal';
 const safeRooms=$('customSafeRooms').checked;
 const enemies=[];
 for(const input of document.querySelectorAll('#customEnemyGrid select[data-enemy]')){
  if(!['cat','watcher','listener','pig','stranger'].includes(input.dataset.enemy))continue;
  const n=Math.floor(clamp(Number(input.value)||0,0,3));
  for(let i=0;i<n;i++)enemies.push(input.dataset.enemy);
 }
 const rawSeed=$('customSeed')?.value?.trim();const fixedSeed=rawSeed&&Number.isInteger(Number(rawSeed))&&Number(rawSeed)>=0&&Number(rawSeed)<=4294967295?Number(rawSeed):null;
 customGameConfig={stage,size,difficulty,safeRooms,enemies:enemies.slice(0,12),fixedSeed,drinks:Math.floor(clamp(Number($('customDrinks')?.value)||0,0,3)),loot:$('customLoot')?.checked!==false,dark:!!$('customDark')?.checked,emergencies:$('customEmergency')?.checked!==false};
 if(!customGameConfig.enemies.length)customGameConfig.enemies=['cat'];
 return customGameConfig;
}
function customGameLineup(){
 const c=customGameConfig;
 if(c.difficulty==='normal')return c.enemies.map(kind=>[kind,'classic']);
 const variants=HARD_CHAMPION_VARIANTS;
 const ordinaryIndex=rnd()<.4?Math.floor(rnd()*c.enemies.length):-1;
 return c.enemies.map((kind,i)=>[kind,i===ordinaryIndex?'classic':variants[Math.floor(rnd()*variants.length)]]);
}
function resetCustomGame(){
 resetHard();
 document.body.classList.toggle('hard-level',customGameConfig.difficulty==='hard');
 document.body.classList.add('custom-level');
 if(customGameConfig.difficulty==='normal'){
  gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;
  $('hardEmergency').hidden=true;
 }
 $('levelLabel').textContent='CUSTOM GAME / '+HARD_STAGE_NAMES[customGameConfig.stage];
 $('eventTag').textContent='CUSTOM GAME · '+customGameConfig.size+' x '+customGameConfig.size;
}

function applyCustomOptions(){
 const c=customGameConfig,p=gameSession.player;
 if(c.loot===false)gameSession.bonusItems=gameSession.bonusItems.filter(x=>x.type==='coin'||x.type==='key');
 if(c.dark)p.flash=false;
 if(c.emergencies===false){gameSession.hardEmergency=null;gameSession.hardNextEmergency=Infinity;}
 for(let i=0;i<(c.drinks||0);i++)ensureInventory().energy.push({energySprite:0,fakeMonster:false});
}
