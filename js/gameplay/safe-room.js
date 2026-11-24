// One sealed safe room and one coin-operated slot machine per map.
// Local in-game currency only: a spin costs one collectible grosz.
let safeRoom=null;
let safeRoomFurniture=[]; // Static, GPU-raycast boxes. Each entry: center, dimensions, material. 
const SLOT_REWARD_WEIGHTS=Object.freeze({freeze:15,slow:35,none:50});

function isSafeRoomProtected(){
 return Boolean(safeRoom && !safeRoom.open && player &&
  Math.floor(player.x)>=safeRoom.left+1 && Math.floor(player.x)<=safeRoom.left+safeRoom.side-2 &&
  Math.floor(player.y)>=safeRoom.top+1 && Math.floor(player.y)<=safeRoom.top+safeRoom.side-2);
}
function updateCoinCounter(){
 const el=document.getElementById('coinHudValue');if(el)el.textContent=String(player.coins||0);
 const label=document.getElementById('safeRoomLabel');if(label)label.classList.toggle('visible',isSafeRoomProtected());
}
function setupSafeRoomAndCoins(){
 safeRoom=null;safeRoomFurniture=[];
 if(!Array.isArray(bonusItems))bonusItems=[];
 if(!Array.isArray(interactables))interactables=[];
 player.coins=0;
 const spawn={x:Math.floor(player.x),y:Math.floor(player.y)};
 const dist=bfsDistances(spawn.x,spawn.y);
 const important=[...fuses,...terminals,...bonusItems,...guards,...(level===1&&cat?.x!=null?[cat]:[]),...props.filter(p=>p.type==='hazard'),
   {x:exitCell.x+.5,y:exitCell.y+.5},{x:player.x,y:player.y}];
 // Normal procedural mode has a dense connected 4x4 room lattice. Searching
 // exclusively for an unused 9x9 rectangle can fail on some seeds, which was
 // why the slot machine sometimes disappeared entirely. Build a guaranteed
 // 9x9 side annex outside the original eastern boundary instead. The corridor
 // starts at an already reachable floor tile; it only removes old wall cells.
 let annex=null;
 if(level===5 && N+14<=126){
   const oldN=N;
   const usable=[];
   for(let y=6;y<oldN-7;y++)for(let x=3;x<oldN-2;x++){
     if(world[y][x]===0&&dist[y][x]>=8)usable.push({x,y,d:dist[y][x]});
   }
   usable.sort((a,b)=>b.x-a.x||Math.abs(a.d-22)-Math.abs(b.d-22));
   const anchor=usable[0];
   if(anchor){
     const side=9, extra=14;
     for(const row of world)for(let i=0;i<extra;i++)row.push(1);
     for(let i=0;i<extra;i++)world.push(Array(oldN+extra).fill(1));
     N=oldN+extra;
     const top=anchor.y-4,left=oldN+3,doorX=left,doorY=anchor.y;
     for(let x=anchor.x+1;x<doorX;x++)world[doorY][x]=0;
     seen=Array.from({length:N},(_,y)=>Array.from({length:N},(_,x)=>seen[y]?.[x]||false));
     annex={left,top,side,doorX,doorY,centerX:left+side/2,centerY:top+side/2,distance:anchor.d+doorX-anchor.x};
   }
 }
 // The room shares only one controlled entry with the reachable corridors.
 const directions=[{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
 let choices=annex?[annex]:[];
 if(!choices.length)for(const side of [11,9,7,5]){
  choices=[];
  for(let top=2;top+side<N-2;top++)for(let left=2;left+side<N-2;left++){
   let allWall=true;
   for(let y=top;y<top+side&&allWall;y++)for(let x=left;x<left+side;x++){
    if(world[y]?.[x]!==1){allWall=false;break}
   }
   if(!allWall)continue;
   for(const direction of directions){
    const dx=direction.dx,dy=direction.dy;
    const doorX=left+(dx===0?Math.floor(side/2):dx<0?0:side-1);
    const doorY=top+(dy===0?Math.floor(side/2):dy<0?0:side-1);
    const outsideX=doorX+dx,outsideY=doorY+dy;
    const dd=dist[outsideY]?.[outsideX]??-1;
    if(world[outsideY]?.[outsideX]!==0||dd<6)continue;
    const centerX=left+side/2,centerY=top+side/2;
    if(important.some(p=>Math.hypot(p.x-centerX,p.y-centerY)<side/2+1))continue;
    choices.push({left,top,side,doorX,doorY,centerX,centerY,distance:dd});
   }
  }
  if(choices.length)break;
 }
 // Fallback: wall off an open 5x5 patch while verifying every old objective
 // remains reachable. Never use a patch that would strand any item or enemy.
 if(!choices.length){
  for(const side of [9,7,5]){
   for(let top=2;top+side<N-2;top++)for(let left=2;left+side<N-2;left++){
    const cx=left+side/2,cy=top+side/2;
    if(important.some(p=>Math.hypot(p.x-cx,p.y-cy)<side/2+1.25))continue;
    for(const {dx,dy} of directions){
     const doorX=left+(dx===0?side>>1:dx<0?0:side-1);
     const doorY=top+(dy===0?side>>1:dy<0?0:side-1);
     const outsideX=doorX+dx,outsideY=doorY+dy;
     if(world[outsideY]?.[outsideX]!==0||dist[outsideY]?.[outsideX]<6)continue;
     const backup=[];
     for(let y=top;y<top+side;y++)for(let x=left;x<left+side;x++){
      backup.push([x,y,world[y][x]]);
      world[y][x]=(x===left||x===left+side-1||y===top||y===top+side-1)?1:0;
     }
     world[doorY][doorX]=4;
     const after=bfsDistances(spawn.x,spawn.y);
     const accessible=important.every(p=>{
       const px=Math.floor(p.x),py=Math.floor(p.y);
       if(after[py]?.[px]>=0)return true;
       if(world[py]?.[px]===3)return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>after[py+dy]?.[px+dx]>=0);
       return false;
     });
     for(const [x,y,old] of backup)world[y][x]=old;
     if(accessible)choices.push({left,top,side,doorX,doorY,centerX:cx,centerY:cy,distance:dist[outsideY][outsideX]});
    }
   }
   if(choices.length)break;
  }
 }
 if(choices.length){
  choices.sort((a,b)=>Math.abs(a.distance-20)-Math.abs(b.distance-20));
  const room=choices[Math.floor(Math.random()*Math.min(12,choices.length))];
  for(let y=room.top;y<room.top+room.side;y++)for(let x=room.left;x<room.left+room.side;x++){
   world[y][x]=(x===room.left||y===room.top||x===room.left+room.side-1||y===room.top+room.side-1)?8:0;
  }
  world[room.doorY][room.doorX]=4;
  const northDoor=room.doorY===room.top;
  const wallY=northDoor?room.top+room.side-1:room.top;
  // The imported GLB has a 0.67-tile depth. Keep its entire footprint
  // clear of the wall collision cell (which ends 0.5 tiles from wallY).
  // A 1.12-tile wall-centre offset leaves ~0.285 tiles of visible clearance.
  const machineWallOffset=1.12;
  const machineY=northDoor?wallY-machineWallOffset:wallY+machineWallOffset;
  const machineX=room.centerX;
  const fireX=room.side>=7?room.centerX+.5:room.left+room.side-1.65;
  const fireY=room.side>=7?room.centerY+.5:room.top+room.side-1.65;
  // Meshes use the exact GLB topology, UVs and colours, not rotating sprites.
  // Only a simplified cabinet bounding box remains for physical collisions.
  safeRoom={...room,open:false,machineX,machineY,machineYaw:northDoor?Math.PI:0,fireX,fireY};
  interactables.push({id:'slot-machine',type:'slot',title:'JEDNOREKI BANDYTA · 1 GROSZ',x:machineX,y:machineY,used:false});
  const put=(x,y,z,w,d,h,material,collisionOnly=false)=>safeRoomFurniture.push({x,y,z,w,d,h,material,collisionOnly});
  put(machineX,machineY,.49,.85,.60,.96,1,true);
  const chairX=room.left+1.75,chairY=room.top+room.side-2;
  put(chairX,chairY,.31,.74,.70,.13,3);
  put(chairX,chairY+.27,.56,.74,.14,.72,4);
  for(const sx of [-.26,.26])for(const sy of [-.24,.24])put(chairX+sx,chairY+sy,.15,.10,.10,.30,3);
  // The imported campfire GLB replaces the previous firepit/flame cubes.
  // Flat posters attached to room walls; no billboard rotation.
  const posterY=northDoor?room.top+1.03:room.top+room.side-1.03;
  const posterFront=northDoor?1:-1;
  put(room.left+1.45,posterY,.58,.80,.028,.53,7);
  put(room.left+room.side-2,posterY,.56,.72,.028,.49,8);
  safeRoom.posterFront=posterFront;
 }
 // 5–12 coins scattered over walkable, reachable floor cells. Excludes the
 // exit, room, players, opponents, and required pickups.
 const reachable=bfsDistances(spawn.x,spawn.y);
 const available=[];
 for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){
  if(world[y][x]!==0||reachable[y][x]<5)continue;
  if(safeRoom&&x>=safeRoom.left&&x<safeRoom.left+safeRoom.side&&y>=safeRoom.top&&y<safeRoom.top+safeRoom.side)continue;
  if(important.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.1))continue;
  available.push({x,y});
 }
 for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
 const coinCount=5+Math.floor(Math.random()*8);
 let n=0;
 for(const cell of available){
  if(n>=coinCount)break;
  if(bonusItems.some(q=>q.type==='coin'&&Math.hypot(q.x-cell.x-.5,q.y-cell.y-.5)<3))continue;
  bonusItems.push({id:'grosz-'+n,type:'coin',name:'1 GROSZ',x:cell.x+.5,y:cell.y+.5,taken:false,quantity:1,phase:Math.random()*Math.PI*2});n++;
 }
 updateCoinCounter();
}
function pickupCoins(){
 if(!player)return;
 let acquired=0;
 for(const coin of bonusItems){
  if(coin.type==='coin'&&!coin.taken&&Math.hypot(coin.x-player.x,coin.y-player.y)<.69){
   coin.taken=true;acquired++;player.coins=(player.coins||0)+1;
  }
 }
 if(acquired){playCoinPickup();showToast('ZNALEZIONO '+acquired+' GROSZ'+(acquired===1?'':'E'),2);updateCoinCounter();}
}
function safeRoomInteraction(){
 if(!safeRoom||state!=='playing')return false;
 const doorDistance=Math.hypot(player.x-safeRoom.doorX-.5,player.y-safeRoom.doorY-.5);
 if(doorDistance<1.7){
  if(safeRoom.open&&Math.floor(player.x)===safeRoom.doorX&&Math.floor(player.y)===safeRoom.doorY){
    showToast('ODSUN SIE OD DRZWI, ABY JE ZAMKNAC',2.2);return true;
  }
  safeRoom.open=!safeRoom.open;
  world[safeRoom.doorY][safeRoom.doorX]=safeRoom.open?0:4;
  playUnlock();showToast(safeRoom.open?'OTWARTO POKOJ BEZPIECZNY':'ZAMKNIETO DRZWI POKOJU BEZPIECZNEGO',2.6);
  updateCoinCounter();return true;
 }
 return false;
}
function slotMachineSpin(){
 if(state!=='playing'||!safeRoom)return;
 const slot=interactables.find(o=>o.type==='slot');
 if(!slot||Math.hypot(player.x-slot.x,player.y-slot.y)>=1.45)return;
 if((player.coins||0)<1){showToast('BRAK GROSZY · POTRZEBUJESZ 1',2.5);return;}
 player.coins--;updateCoinCounter();playCoinSlot();
 // Independent draw on every paid interaction, exact 15/35/50 bands.
 const roll=Math.random()*100;
 if(roll<15){
  player.freezeCharges=(player.freezeCharges||0)+1;ensureInventory().freeze=player.freezeCharges;
  showToast('777 · WYGRANA: ZAMRAZACZ',3);playWin();
 }else if(roll<50){
  player.slowCharges=(player.slowCharges||0)+1;ensureInventory().slow=player.slowCharges;
  showToast('777 · WYGRANA: SPOWALNIACZ',3);playUnlock();
 }else{showToast('PUSTE LOSOWANIE · STRACONO 1 GROSZ',2.5);sound(145,.18,'square',.09,-80)}
 updateInventoryUI();
}
