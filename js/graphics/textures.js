
function createPigFood(){let cv=document.createElement('canvas');cv.width=140;cv.height=190;let g=cv.getContext('2d');g.fillStyle='#f7e56a';g.fillRect(26,24,88,132);g.fillStyle='#2b90d9';g.fillRect(30,48,80,88);g.fillStyle='#fff';g.fillRect(42,66,56,40);g.fillStyle='#5b3fd1';g.font='bold 18px sans-serif';g.fillText('PUFFI',43,93);g.fillStyle='#f2c32c';g.fillRect(40,118,60,18);return spriteFromSource(FOOD_PNG,cv)}
function createBloodArt(){let c=document.createElement('canvas');c.width=150;c.height=110;let g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);for(let i=0;i<7;i++){g.fillStyle=i?`rgba(108,0,0,${.18+.09*i})`:'rgba(150,18,10,.9)';g.beginPath();g.ellipse(76+(rnd()-.5)*18,58+(rnd()-.5)*14,44-i*4,26-i*2,rnd()*TAU,0,TAU);g.fill()}g.fillStyle='rgba(95,0,0,.75)';for(let i=0;i<6;i++){g.beginPath();g.arc(22+i*18,70+(rnd()-.5)*12,4+rnd()*7,0,TAU);g.fill()}return c}
function createHazardArt(){let c=document.createElement('canvas');c.width=150;c.height=110;let g=c.getContext('2d');const grad=g.createRadialGradient(74,55,10,75,56,58);grad.addColorStop(0,'rgba(193,255,59,.95)');grad.addColorStop(.45,'rgba(77,235,89,.9)');grad.addColorStop(.75,'rgba(33,161,91,.82)');grad.addColorStop(1,'rgba(18,83,54,.15)');g.fillStyle=grad;g.beginPath();g.ellipse(75,56,52,30,.1,0,TAU);g.fill();g.strokeStyle='rgba(220,255,160,.7)';g.lineWidth=3;g.beginPath();g.moveTo(55,55);g.lineTo(71,38);g.lineTo(66,53);g.lineTo(87,53);g.lineTo(78,74);g.lineTo(82,60);g.lineTo(62,60);g.closePath();g.stroke();return c}


function spriteFromSource(src,fallback){let img=new Image();img.src=src;img.fallback=fallback;return img}
function createTexture(){let canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;let g=canvas.getContext('2d');g.fillStyle='#c5b67c';g.fillRect(0,0,128,256);let lg=g.createLinearGradient(0,0,128,0);lg.addColorStop(0,'#756e45');lg.addColorStop(.04,'#a89b63');lg.addColorStop(.15,'#cfc08c');lg.addColorStop(.7,'#c3b57f');lg.addColorStop(.98,'#a79a65');lg.addColorStop(1,'#756e45');g.fillStyle=lg;g.fillRect(0,0,128,256);
  // Old floral wallpaper, vertical pinstripes and accumulated water damage.
  for(let x=4;x<128;x+=18){g.fillStyle='#f6ebad24';g.fillRect(x,0,3,224);g.fillStyle='#675d3440';g.fillRect(x+4,0,1,224);for(let y=12;y<205;y+=32){g.fillStyle='#726c3840';g.beginPath();g.ellipse(x+8,y,3,6,0,0,TAU);g.fill();g.fillStyle='#f1e1a034';g.fillRect(x+7,y-7,1,3)}}
  for(let i=0;i<1500;i++){let x=rnd()*128,y=rnd()*255;g.fillStyle=i%3===0?'#433a1e16':'#fff5c214';g.fillRect(x,y,1+rnd()*3,1+rnd()*3)}
  for(let i=0;i<28;i++){g.fillStyle='#5a543720';let x=rnd()*128,y=rnd()*212;g.beginPath();g.ellipse(x,y,3+rnd()*19,1+rnd()*10,Math.sin(i),0,TAU);g.fill()}
  g.fillStyle='#ddc48c';g.fillRect(0,0,128,9);g.fillStyle='#918055';g.fillRect(0,7,128,3);g.fillStyle='#6a603e';g.fillRect(0,220,128,36);g.fillStyle='#e4d099';g.fillRect(0,218,128,7);g.fillStyle='#8e7b50';g.fillRect(0,226,128,3);g.fillStyle='#3d3825';g.fillRect(0,253,128,3);return canvas}

function createDoor(open){let cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');g.fillStyle='#bfb17b';g.fillRect(0,0,128,256);g.fillStyle='#6b6140';g.fillRect(8,6,112,250);g.fillStyle='#282c24';g.fillRect(17,20,94,232);g.fillStyle=open?'#0a3a24':'#3b3226';g.fillRect(24,39,80,204);g.strokeStyle=open?'#96ef7f':'#d5b773';g.lineWidth=3;g.strokeRect(24,39,80,204);g.fillStyle='#171b15';g.fillRect(30,92,68,140);g.strokeStyle='#76785d';g.lineWidth=1;g.strokeRect(31,93,66,138);g.fillStyle=open?'#83fc96':'#ffb852';g.shadowBlur=15;g.shadowColor=open?'#3bff63':'#ffd154';g.fillRect(35,43,58,30);g.shadowBlur=0;g.fillStyle='#191e14';g.font='bold 18px monospace';g.textAlign='center';g.fillText(open?'EXIT':'LOCK',64,64);g.fillStyle='#cfc9ae';g.fillRect(86,154,5,10);g.fillStyle=open?'#b1ffaa':'#d45b40';g.beginPath();g.arc(64,16,4,0,TAU);g.fill();return cv}

function createFuse(){let cv=document.createElement('canvas');cv.width=128;cv.height=160;let g=cv.getContext('2d');g.shadowColor='#f9db5b';g.shadowBlur=22;g.fillStyle='#f3b735';g.beginPath();g.roundRect(40,24,48,108,12);g.fill();g.shadowBlur=0;let gr=g.createLinearGradient(40,0,88,0);gr.addColorStop(0,'#8f541c');gr.addColorStop(.28,'#fff2aa');gr.addColorStop(.65,'#e9ae34');gr.addColorStop(1,'#774718');g.fillStyle=gr;g.fillRect(43,40,42,76);g.fillStyle='#a3e7ca';g.fillRect(45,20,38,20);g.fillRect(45,115,38,20);g.fillStyle='#283d37';g.fillRect(48,24,32,5);g.fillRect(48,124,32,5);g.fillStyle='#fff9c9';g.beginPath();g.moveTo(68,44);g.lineTo(50,83);g.lineTo(64,83);g.lineTo(55,111);g.lineTo(80,70);g.lineTo(65,70);g.closePath();g.fill();g.strokeStyle='#fef4b8';g.lineWidth=2;g.beginPath();g.moveTo(23,73);g.lineTo(31,65);g.moveTo(94,70);g.lineTo(105,59);g.moveTo(24,102);g.lineTo(31,107);g.stroke();return spriteFromSource(BATTERY_PNG,cv)}

function makeBackgroundTextures(){floorTexture=new Uint8Array(64*64*3);ceilingTexture=new Uint8Array(64*64*3);for(let y=0;y<64;y++)for(let x=0;x<64;x++){let i=(y*64+x)*3,r=rnd()*18,stitch=((x+2*y)%11===0)?5:0;floorTexture[i]=100+r-stitch;floorTexture[i+1]=91+r*.75-stitch;floorTexture[i+2]=67+r*.47-stitch;let v=rnd()*15;ceilingTexture[i]=157+v;ceilingTexture[i+1]=150+v*.83;ceilingTexture[i+2]=112+v*.5}}

function createMetalTexture(){let cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');g.fillStyle='#344d5b';g.fillRect(0,0,128,256);let grad=g.createLinearGradient(0,0,128,0);grad.addColorStop(0,'#182e3b');grad.addColorStop(.16,'#53717d');grad.addColorStop(.52,'#344b58');grad.addColorStop(.9,'#426373');grad.addColorStop(1,'#152d3a');g.fillStyle=grad;g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=32){g.fillStyle='#112b39';g.fillRect(x,0,3,256);g.fillStyle='#75929a50';g.fillRect(x+4,0,1,256)}
 for(let y=0;y<256;y+=48){g.fillStyle='#132c36';g.fillRect(0,y,128,4);g.fillStyle='#78929c55';g.fillRect(0,y+5,128,2)}
 for(let i=0;i<380;i++){g.fillStyle=i%2?'#b1d5d312':'#000b171b';g.fillRect(rnd()*128,rnd()*256,rnd()*5+1,rnd()*9+1)}
 g.fillStyle='#ac693c';g.fillRect(0,202,128,3);g.fillStyle='#152a36';g.fillRect(0,247,128,9);return cv}

function createSecurityDoor(){let cv=createDoor(false),g=cv.getContext('2d');g.fillStyle='#163d49';g.fillRect(25,39,79,204);g.strokeStyle='#7bcbcd';g.lineWidth=3;g.strokeRect(25,39,79,204);g.fillStyle='#b9594c';g.fillRect(38,52,55,24);g.fillStyle='#fff1d5';g.font='bold 14px monospace';g.textAlign='center';g.fillText('SEALED',65,69);return cv}

function createTerminal(){let cv=document.createElement('canvas');cv.width=128;cv.height=170;let g=cv.getContext('2d');g.fillStyle='#172b37';g.fillRect(30,42,68,110);g.fillStyle='#6f9ba4';g.fillRect(24,30,80,82);g.fillStyle='#061c29';g.fillRect(30,35,68,68);g.fillStyle='#65fff0';g.shadowBlur=14;g.shadowColor='#64ffef';g.fillRect(37,45,54,4);g.fillRect(37,57,32,3);g.fillRect(37,67,44,3);g.fillRect(37,79,38,3);g.shadowBlur=0;g.fillStyle='#e86f58';g.fillRect(57,123,15,10);g.fillStyle='#597783';g.fillRect(44,152,40,14);return cv}

function createKeycard(){let cv=document.createElement('canvas');cv.width=128;cv.height=160;let g=cv.getContext('2d');g.save();g.translate(64,80);g.rotate(-.18);g.fillStyle='#e8a956';g.shadowColor='#ffb977';g.shadowBlur=22;g.fillRect(-38,-22,76,48);g.shadowBlur=0;g.fillStyle='#0d3243';g.fillRect(-33,-17,66,38);g.fillStyle='#a7e5e4';g.fillRect(-26,-11,24,8);g.fillStyle='#e8a956';g.fillRect(-26,6,54,4);g.fillRect(-26,14,30,3);g.restore();return spriteFromSource(CARD_PNG,cv)}

function createLockerArt(){let c=document.createElement('canvas');c.width=110;c.height=210;let g=c.getContext('2d');g.fillStyle='#0c1a27';g.fillRect(15,8,82,198);g.fillStyle='#56717b';g.fillRect(20,12,70,186);g.fillStyle='#182d38';g.fillRect(26,19,58,170);g.fillStyle='#87abb4';g.fillRect(30,32,50,7);for(let y=53;y<83;y+=10)g.fillRect(36,y,38,3);g.fillStyle='#bacacf';g.fillRect(68,106,5,24);g.fillStyle='#19313d';g.fillRect(16,198,82,6);return c}

function createStairArt(){let c=document.createElement('canvas');c.width=120;c.height=190;let g=c.getContext('2d');g.fillStyle='#242633';g.fillRect(10,25,100,158);g.fillStyle='#ad7f66';for(let i=0;i<7;i++)g.fillRect(18+i*4,156-i*17,84-i*7,13);g.fillStyle='#eec78e';g.font='bold 17px monospace';g.fillText('STAIRS',24,38);return c}

function createPickupArt(color,label){let c=document.createElement('canvas');c.width=110;c.height=140;let g=c.getContext('2d');g.shadowBlur=24;g.shadowColor=color;g.fillStyle=color;g.fillRect(28,25,53,87);g.shadowBlur=0;g.strokeStyle='#fff2d6';g.lineWidth=3;g.strokeRect(32,28,45,80);g.fillStyle='#14242c';g.fillRect(40,49,28,24);g.fillStyle='#fff5da';g.font='bold 13px monospace';g.fillText(label,42,66);return c}

function createFinalWall(){
 const cv=document.createElement('canvas');cv.width=128;cv.height=256;let g=cv.getContext('2d');
 let bg=g.createLinearGradient(0,0,128,256);bg.addColorStop(0,'#4d334b');bg.addColorStop(1,'#181b31');g.fillStyle=bg;g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=32){g.fillStyle='#131324';g.fillRect(x,0,5,256);g.fillStyle='#86677877';g.fillRect(x+6,0,2,256)}
 for(let y=0;y<256;y+=64){g.fillStyle='#10101f';g.fillRect(0,y,128,6);g.fillStyle='#935b66';g.fillRect(0,y+7,128,2)}
 for(let i=0;i<60;i++){g.fillStyle=i%2?'#b7746450':'#8057762e';g.fillRect(rnd()*128,rnd()*256,1+rnd()*4,4+rnd()*24)}
 g.fillStyle='#dc8550';g.fillRect(0,180,128,7);g.fillStyle='#ae434d';g.fillRect(0,187,128,4);
 g.strokeStyle='#db7d64';g.lineWidth=2;g.strokeRect(5,6,118,244);return cv
}

function createPigWall(){
 const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');
 g.fillStyle='#715349';g.fillRect(0,0,128,256);
 for(let x=0;x<128;x+=21){g.fillStyle=x%2?'#785c50':'#695044';g.fillRect(x,0,19,256);g.fillStyle='#271d1c';g.fillRect(x+19,0,2,256);}
 for(let y=8;y<250;y+=54){g.fillStyle='#302421';g.fillRect(0,y,128,3);g.fillStyle='#96715f';g.fillRect(0,y+4,128,1);}
 for(let i=0;i<50;i++){g.fillStyle='#16120d30';g.fillRect(rnd()*128,rnd()*256,2+rnd()*5,5+rnd()*16)}
 g.fillStyle='#ba7e5c';g.fillRect(0,236,128,8);return c;
}

function createCoopAvatarArt(){
 const c=document.createElement('canvas');c.width=130;c.height=185;const g=c.getContext('2d');
 g.fillStyle='#17373b';g.strokeStyle='#75e9d4';g.lineWidth=4;
 g.beginPath();g.ellipse(65,53,32,38,0,0,TAU);g.fill();g.stroke();
 g.fillStyle='#95fff0';g.fillRect(37,49,56,13);g.fillStyle='#223845';g.fillRect(40,51,50,9);
 g.fillStyle='#2e716f';g.beginPath();g.moveTo(29,94);g.lineTo(100,94);g.lineTo(117,175);g.lineTo(12,175);g.closePath();g.fill();g.stroke();
 g.fillStyle='#d3ffe2';g.fillRect(46,114,38,9);g.fillStyle='#63cdc2';g.fillRect(57,134,16,23);return c;
}
