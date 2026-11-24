// Dedicated 2D map overlay. The 3D world continues to use WebGPU exclusively.
function drawMap(){
 const canvas=UI.mapCanvas;if(!canvas||!Array.isArray(world)||!world.length)return;
 const g=canvas.getContext('2d');if(!g)return;
 const resolution=N>=80?440:320;
 if(canvas.width!==resolution||canvas.height!==resolution){canvas.width=resolution;canvas.height=resolution;}
 const ts=resolution/N;
 g.clearRect(0,0,resolution,resolution);
 g.fillStyle='#090d0b';g.fillRect(0,0,resolution,resolution);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  if(!seen[y]?.[x])continue;
  const cell=world[y][x];
  g.fillStyle=cell===5?'#77705f':cell===1?'#52564c':cell===3?'#a0dbab':cell===4?'#b75c42':isHardMode()?'#27302c':'#29362f';
  g.fillRect(x*ts,y*ts,Math.ceil(ts),Math.ceil(ts));
 }
 function pin(x,y,color,radius=.32){
  if(!seen[Math.floor(y)]?.[Math.floor(x)])return;
  g.fillStyle=color;g.beginPath();g.arc((x+.02)*ts,(y+.02)*ts,Math.max(1.7,ts*radius),0,Math.PI*2);g.fill();
 }
 for(const f of fuses)if(!f.taken)pin(f.x,f.y,'#edc879',.28);
 for(const b of bonusItems)if(!b.taken)pin(b.x,b.y,b.type==='coin'?'#e9c05a':b.type==='stamina'?'#a9edb5':b.type==='hardFreeze'?'#82d8fa':b.type==='hardSlow'?'#dcb0ef':'#a6b8d0',.23);
 for(const s of interactables)if(s.type==='slot')pin(s.x,s.y,'#f2bf58',.4);
 for(const t of terminals)pin(t.x,t.y,t.used?'#4fca7d':'#ecc38d',.29);
 if(isHardMode()&&hardEmergency)pin(hardEmergency.x,hardEmergency.y,'#f64539',.48);
 for(const p of props)if(p.type==='hazard'&&(!p.expires||p.expires>elapsed))pin(p.x,p.y,'#63b963',.19);
 if(player.collected===GOAL&&terminals.every(t=>t.used)){
  g.fillStyle='#8bf0b8';g.fillRect(exitCell.x*ts,exitCell.y*ts,Math.ceil(ts),Math.ceil(ts));
 }
 const px=player.x*ts,py=player.y*ts;
 g.fillStyle='#fff1ca';g.beginPath();g.arc(px,py,Math.max(2.8,ts*.4),0,Math.PI*2);g.fill();
 g.strokeStyle='#fff1ca';g.lineWidth=Math.max(1.2,ts*.17);
 g.beginPath();g.moveTo(px,py);g.lineTo(px+Math.cos(player.a)*Math.max(7,ts*1.7),py+Math.sin(player.a)*Math.max(7,ts*1.7));g.stroke();
}
