
const coinSprite = new Image();coinSprite.src=COIN_PNG;
function makeSlotMachineSprite(){
 const canvas=document.createElement('canvas');canvas.width=150;canvas.height=200;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#050505';ctx.fillRect(14,20,122,175);
 ctx.fillStyle='#6d2723';ctx.fillRect(20,24,108,163);
 ctx.fillStyle='#1b1111';ctx.fillRect(30,39,88,111);
 ctx.strokeStyle='#d7a34b';ctx.lineWidth=5;ctx.strokeRect(30,39,88,111);
 ctx.fillStyle='#dfc377';ctx.font='bold 39px serif';ctx.fillText('777',36,98);
 ctx.fillStyle='#ecb46c';ctx.fillRect(35,115,78,11);
 ctx.fillStyle='#dabe70';ctx.font='bold 15px monospace';ctx.fillText('1 GROSZ',32,166);
 ctx.fillStyle='#8c8b8b';ctx.fillRect(132,64,9,55);
 ctx.beginPath();ctx.arc(136,60,11,0,Math.PI*2);ctx.fillStyle='#ca2727';ctx.fill();
 ctx.fillStyle='#2e1712';ctx.fillRect(28,183,93,10);
 return canvas;
}
const slotMachineSprite=makeSlotMachineSprite();
