// Decorative survival-HUD mirror. Does not change the game state or controls.
(function(){
 const count=document.getElementById('fieldItemCount'),decoys=document.getElementById('fieldDecoys');
 const zone=document.getElementById('fieldZone'),action=document.getElementById('fieldActionText');
 let last='';
 function mirror(){
  try{
   const n=Number(document.getElementById('count')?.textContent||0);
   const total=Number(document.getElementById('required')?.textContent||7);
   const l=typeof level==='number'?level:1;
   const val=n+' / '+total+'   '+(l===4?'KARMA':l===2?'KARTY':l===3?'RDZENIE':l===5?'ARTEFAKTY':'BATERIE');
   const d=typeof player==='object'&&player?Number(player.decoys||0):0;
   const ready=typeof interactReady!=='undefined'?interactReady:null;
   const act=l===1?'ZBIERAJ BATERIE':ready?'E / '+(ready.title||'UZYJ'):'E / SPRAWDZ OTOCZENIE';
   const next=val+'|'+d+'|'+l+'|'+act;
   if(next===last)return;last=next;
   if(count)count.textContent=val;
   if(decoys)decoys.textContent='WABIKI: '+d;
   if(zone)zone.textContent=l===5?'LOSOWA STREFA':'SEKTOR 0'+l;
   if(action)action.textContent=act;
  }catch(e){/* HUD decoration must never interrupt gameplay. */}
 }
 const prev=window.requestAnimationFrame;
 // Do not intercept the game loop: use lightweight scheduled DOM synchronization.
 window.setInterval(mirror,280);
 mirror();
})();
