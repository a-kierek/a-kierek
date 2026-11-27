// Decorative survival-HUD mirror. Does not change the game state or controls.
const syncDecorativeHUD=(()=>{
 const count=document.getElementById('fieldItemCount');
 const zone=document.getElementById('fieldZone'),action=document.getElementById('fieldActionText');
 let last='',lastUpdate=-Infinity;
 function mirror(time=performance.now()){
  if(gameSession.state!=='playing'||time-lastUpdate<280)return;lastUpdate=time;
  try{
   const n=Number(document.getElementById('count')?.textContent||0);
   const total=Number(document.getElementById('required')?.textContent||7);
   const l=renderStage();
   const val=n+' / '+total;
   const ready=typeof gameSession.interactReady!=='undefined'?gameSession.interactReady:null;
   const act=l===1?'COLLECT BATTERIES':ready?'E / '+(ready.title||'UZYJ'):'E / CHECK SURROUNDINGS';
   const panels=gameSession.terminals.filter(t=>t.used).length,totalPanels=gameSession.terminals.length;
   const target=l===1?'batteries':l===2?'cards':l===3?'cores':l===4?'food':'items';
   const objective=n>=total?(panels>=totalPanels?'Reach the exit':'Activate panels · '+panels+' / '+totalPanels):'Collect '+target+(totalPanels?' · '+panels+'/'+totalPanels+' panels':'');
   const next=val+'|'+l+'|'+act+'|'+objective;
   if(next===last)return;last=next;
   if(count)count.textContent=val;const title=$('hudObjectiveText'),bar=$('hudObjectiveProgress');if(title)title.textContent=objective;if(bar)bar.style.setProperty('--progress',String(Math.max(0,Math.min(100,total>0?n/total*100:0)))+'%');
   if(zone)zone.textContent=l===5?'RANDOM ZONE':'SEKTOR 0'+l;
   if(action)action.textContent=act;
  }catch(e){/* HUD decoration must never interrupt gameplay. */}
 }
 return mirror;
})();

// One-second rising-edge detection indicator, independent of rendering FPS.
const syncDetectionHUD=(()=>{
 let generation=-1,wasDetected=false,until=0;
 return ()=>{
  const el=$('detectionWarning');if(!el)return;
  if(generation!==gameSession.generation){generation=gameSession.generation;wasDetected=false;until=0;}
  if(gameSession.state!=='playing'){el.hidden=true;return;}
  const active=g=>g&&g.state==='chase'&&!g.frozen&&g.variant!=='gray';
  const detected=!gameSession.player.hidden&&(gameSession.guards.some(g=>active(g)&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||(gameSession.level===1&&gameSession.awake&&active(gameSession.cat)));
  if(detected&&!wasDetected)until=gameSession.elapsed+1;
  wasDetected=detected;el.hidden=gameSession.elapsed>=until;
  const details=$('mapRunDetails');if(details&&!details.hidden){
   const level=$('levelLabel').textContent,status=gameSession.player.hidden?'HIDDEN':detected?'DETECTED':gameSession.guards.some(g=>g.state==='search'||g.state==='suspicious')?'SEARCHING':'UNDETECTED';
   if($('mapLevelDetails').textContent!==level)$('mapLevelDetails').textContent=level;
   if($('mapDetectionDetails').textContent!==status)$('mapDetectionDetails').textContent=status;
  }
 };
})();
