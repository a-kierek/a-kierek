// Shared sprite artwork and wall-texture initialization, no Canvas2D scene renderer.
const coopAvatarArt=createCoopAvatarArt();
const lockerArt=createLockerArt(),stairArt=createStairArt(),extraPickupArt=createPickupArt('#eba976','K'),decoyArt=createPickupArt('#d39afd','Q');
const finalWallTexture=createFinalWall();
const staminaArt=createPickupArt('#a5ea8e','S'),shieldArt=createPickupArt('#85c9ff','+'),pigWallTexture=createPigWall(),pigFoodArt=createPigFood(),bloodArt=spriteFromSource(BLOOD_DECAL_PNG,createBloodArt()),hazardArt=createHazardArt();

// Angular slate boulder, rendered as GPU sprite while world tile 5 handles collision.
function createHardRockArt(){
 const c=document.createElement('canvas');c.width=200;c.height=200;const g=c.getContext('2d');
 g.fillStyle='rgba(4,3,2,.40)';g.beginPath();g.ellipse(99,177,79,14,0,0,Math.PI*2);g.fill();
 let p=[[25,161],[40,95],[82,55],[127,61],[166,106],[182,151],[148,174],[64,176]];
 g.beginPath();g.moveTo(...p[0]);p.slice(1).forEach(v=>g.lineTo(...v));g.closePath();
 const gr=g.createLinearGradient(20,60,185,175);gr.addColorStop(0,'#828077');gr.addColorStop(.42,'#5d5953');gr.addColorStop(.78,'#353330');gr.addColorStop(1,'#181919');g.fillStyle=gr;g.fill();
 g.strokeStyle='#242321';g.lineWidth=5;g.stroke();
 g.beginPath();[[40,95],[82,55],[100,114],[59,154],[25,161]].forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath();g.fillStyle='rgba(176,171,156,.22)';g.fill();
 g.beginPath();[[100,114],[127,61],[166,106],[182,151],[148,174],[105,164]].forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath();g.fillStyle='rgba(8,9,9,.40)';g.fill();
 g.strokeStyle='rgba(200,188,161,.20)';g.lineWidth=2;
 for(let i=0;i<14;i++){let x=53+(i*31%95),y=96+(i*23%64);g.beginPath();g.moveTo(x,y);g.lineTo(x+7,y-4);g.stroke();}
 return c;
}
const hardRockArt=createHardRockArt();
