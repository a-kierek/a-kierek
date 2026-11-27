// One sealed safe room and one coin-operated slot machine per map.
// Local in-game currency only: a spin costs one collectible grosz.

 // Static, GPU-raycast boxes. Each entry: center, dimensions, material. 
const SLOT_REWARD_WEIGHTS=Object.freeze({freeze:15,slow:35,none:50});

function isSafeRoomProtected(){
 return Boolean(gameSession.player&&bossRushRooms().some(room=>!room.open&&
  Math.floor(gameSession.player.x)>=room.left+1&&Math.floor(gameSession.player.x)<=room.left+room.side-2&&
  Math.floor(gameSession.player.y)>=room.top+1&&Math.floor(gameSession.player.y)<=room.top+room.side-2));
}
function pickSafeRoomPosterMaterials(count=3){const pool=[7,8,9,10,11];for(let i=pool.length-1;i>0;i--){const j=Math.floor(mapRandom()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,count)}

function safeRoomMachinePlacement(room){
 const side=room.side;
 const offset=1.12;
 if(room.doorY===room.top){
  return {machineX:room.centerX,machineY:room.top+side-offset,machineYaw:Math.PI,wall:'south'};
 }
 if(room.doorY===room.top+side-1){
  return {machineX:room.centerX,machineY:room.top+offset,machineYaw:0,wall:'north'};
 }
 if(room.doorX===room.left){
  return {machineX:room.left+side-offset,machineY:room.centerY,machineYaw:Math.PI/2,wall:'east'};
 }
 return {machineX:room.left+offset,machineY:room.centerY,machineYaw:-Math.PI/2,wall:'west'};
}

function updateCoinCounter(){
 const el=document.getElementById('coinHudValue');if(el)el.textContent=String(gameSession.player.coins||0);
 const label=document.getElementById('safeRoomLabel');if(label)label.classList.toggle('visible',isSafeRoomProtected());
}
function setupSafeRoomAndCoins(){
 gameSession.safeRoom=null;gameSession.safeRoomFurniture=[];
 if(!Array.isArray(gameSession.bonusItems))gameSession.bonusItems=[];
 if(!Array.isArray(gameSession.interactables))gameSession.interactables=[];
 gameSession.player.coins=0;
 const spawn={x:Math.floor(gameSession.player.x),y:Math.floor(gameSession.player.y)};
 const dist=bfsDistances(spawn.x,spawn.y);
 const important=[...gameSession.fuses,...gameSession.terminals,...gameSession.bonusItems,...gameSession.guards,...(gameSession.level===1&&gameSession.cat?.x!=null?[gameSession.cat]:[]),...gameSession.props.filter(p=>p.type==='hazard'),
   {x:gameSession.exitCell.x+.5,y:gameSession.exitCell.y+.5},{x:gameSession.player.x,y:gameSession.player.y}];
 // Normal procedural mode has a dense connected 4x4 room lattice. Searching
 // exclusively for an unused 9x9 rectangle can fail on some seeds, which was
 // why the slot machine sometimes disappeared entirely. Build a guaranteed
 // 9x9 side annex outside the original eastern boundary instead. The corridor
 // starts at an already reachable floor tile; it only removes old wall cells.
 let annex=null;
 if(gameSession.level===5 && gameSession.N+14<=126){
   const oldN=gameSession.N;
   const usable=[];
   for(let y=6;y<oldN-7;y++)for(let x=3;x<oldN-2;x++){
     if(gameSession.world[y][x]===0&&dist[y][x]>=8)usable.push({x,y,d:dist[y][x]});
   }
   usable.sort((a,b)=>b.x-a.x||Math.abs(a.d-22)-Math.abs(b.d-22));
   const anchor=usable[0];
   if(anchor){
     const side=9, extra=14;
     for(const row of gameSession.world)for(let i=0;i<extra;i++)row.push(1);
     for(let i=0;i<extra;i++)gameSession.world.push(Array(oldN+extra).fill(1));
     gameSession.N=oldN+extra;
     const top=anchor.y-4,left=oldN+3,doorX=left,doorY=anchor.y;
     for(let x=anchor.x+1;x<doorX;x++)gameSession.world[doorY][x]=0;
     gameSession.seen=Array.from({length:gameSession.N},(_,y)=>Array.from({length:gameSession.N},(_,x)=>gameSession.seen[y]?.[x]||false));
     annex={left,top,side,doorX,doorY,centerX:left+side/2,centerY:top+side/2,distance:anchor.d+doorX-anchor.x};
   }
 }
 // The room shares only one controlled entry with the reachable corridors.
 const directions=[{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
 let choices=annex?[annex]:[];
 if(!choices.length)for(const side of [11,9,7,5]){
  choices=[];
  for(let top=2;top+side<gameSession.N-2;top++)for(let left=2;left+side<gameSession.N-2;left++){
   let allWall=true;
   for(let y=top;y<top+side&&allWall;y++)for(let x=left;x<left+side;x++){
    if(gameSession.world[y]?.[x]!==1){allWall=false;break}
   }
   if(!allWall)continue;
   for(const direction of directions){
    const dx=direction.dx,dy=direction.dy;
    const doorX=left+(dx===0?Math.floor(side/2):dx<0?0:side-1);
    const doorY=top+(dy===0?Math.floor(side/2):dy<0?0:side-1);
    const outsideX=doorX+dx,outsideY=doorY+dy;
    const dd=dist[outsideY]?.[outsideX]??-1;
    if(gameSession.world[outsideY]?.[outsideX]!==0||dd<6)continue;
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
   for(let top=2;top+side<gameSession.N-2;top++)for(let left=2;left+side<gameSession.N-2;left++){
    const cx=left+side/2,cy=top+side/2;
    if(important.some(p=>Math.hypot(p.x-cx,p.y-cy)<side/2+1.25))continue;
    for(const {dx,dy} of directions){
     const doorX=left+(dx===0?side>>1:dx<0?0:side-1);
     const doorY=top+(dy===0?side>>1:dy<0?0:side-1);
     const outsideX=doorX+dx,outsideY=doorY+dy;
     if(gameSession.world[outsideY]?.[outsideX]!==0||dist[outsideY]?.[outsideX]<6)continue;
     const backup=[];
     for(let y=top;y<top+side;y++)for(let x=left;x<left+side;x++){
      backup.push([x,y,gameSession.world[y][x]]);
      gameSession.world[y][x]=(x===left||x===left+side-1||y===top||y===top+side-1)?1:0;
     }
     gameSession.world[doorY][doorX]=4;
     const after=bfsDistances(spawn.x,spawn.y);
     const accessible=important.every(p=>{
       const px=Math.floor(p.x),py=Math.floor(p.y);
       if(after[py]?.[px]>=0)return true;
       if(gameSession.world[py]?.[px]===3)return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>after[py+dy]?.[px+dx]>=0);
       return false;
     });
     for(const [x,y,old] of backup)gameSession.world[y][x]=old;
     if(accessible)choices.push({left,top,side,doorX,doorY,centerX:cx,centerY:cy,distance:dist[outsideY][outsideX]});
    }
   }
   if(choices.length)break;
  }
 }
 if(choices.length){
  choices.sort((a,b)=>Math.abs(a.distance-20)-Math.abs(b.distance-20));
  const room=choices[Math.floor(mapRandom()*Math.min(12,choices.length))];
  for(let y=room.top;y<room.top+room.side;y++)for(let x=room.left;x<room.left+room.side;x++){
   gameSession.world[y][x]=(x===room.left||y===room.top||x===room.left+room.side-1||y===room.top+room.side-1)?8:0;
  }
  gameSession.world[room.doorY][room.doorX]=4;
  const machine=safeRoomMachinePlacement(room);
  const machineX=machine.machineX,machineY=machine.machineY;
  const fireX=room.side>=7?room.centerX+.5:room.left+room.side-1.65;
  const fireY=room.side>=7?room.centerY+.5:room.top+room.side-1.65;
  // Meshes use the exact GLB topology, UVs and colours, not rotating sprites.
  // Only a simplified cabinet bounding box remains for physical collisions.
  gameSession.safeRoom={...room,open:false,machineX,machineY,machineYaw:machine.machineYaw,fireX,fireY,treeX:null,treeY:null,treeYaw:0};
  gameSession.interactables.push({id:'slot-machine',type:'slot',title:'SLOT MACHINE · 1 COIN',x:machineX,y:machineY,used:false});
  const put=(x,y,z,w,d,h,material,collisionOnly=false)=>gameSession.safeRoomFurniture.push({x,y,z,w,d,h,material,collisionOnly});
  put(machineX,machineY,.39,.69,.50,.78,1,true);
  // The imported campfire GLB replaces the previous firepit/flame cubes.
  // Flat posters attached to room walls; no billboard rotation.
  const posterAxis=(room.doorY===room.top||room.doorY===room.top+room.side-1)?'vertical':'horizontal';
  const posterMaterials=pickSafeRoomPosterMaterials(3);
  const posterSizes=[[.70,.50],[.72,.56],[.68,.48]];
  const posterPlacements=posterAxis==='vertical'
   ?[
     {x:room.left+1.03,y:room.top+1.55,vertical:true},
     {x:room.left+1.03,y:room.top+room.side-1.55,vertical:true},
     {x:room.left+room.side-1.03,y:room.centerY,vertical:true}
    ]
   :[
     {x:room.left+1.55,y:room.top+1.03,vertical:false},
     {x:room.left+room.side-1.55,y:room.top+1.03,vertical:false},
     {x:room.centerX,y:room.top+room.side-1.03,vertical:false}
    ];
  posterMaterials.forEach((material,index)=>{const [w,h]=posterSizes[index]||[.70,.50];const cfg=posterPlacements[index];if(!cfg)return;put(cfg.x,cfg.y,.58,cfg.vertical?.028:w,cfg.vertical?w:.028,h,material)});
 }
 // 5–12 coins scattered over walkable, reachable floor cells. Excludes the
 // exit, room, players, opponents, and required pickups.
 const reachable=bfsDistances(spawn.x,spawn.y);
 const available=[];
 for(let y=2;y<gameSession.N-2;y++)for(let x=2;x<gameSession.N-2;x++){
  if(gameSession.world[y][x]!==0||reachable[y][x]<5)continue;
  if(gameSession.safeRoom&&x>=gameSession.safeRoom.left&&x<gameSession.safeRoom.left+gameSession.safeRoom.side&&y>=gameSession.safeRoom.top&&y<gameSession.safeRoom.top+gameSession.safeRoom.side)continue;
  if(important.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.1))continue;
  available.push({x,y});
 }
 for(let i=available.length-1;i>0;i--){const j=Math.floor(mapRandom()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
 const coinCount=5+Math.floor(mapRandom()*8);
 let n=0;
 for(const cell of available){
  if(n>=coinCount)break;
  if(gameSession.bonusItems.some(q=>q.type==='coin'&&Math.hypot(q.x-cell.x-.5,q.y-cell.y-.5)<3))continue;
  gameSession.bonusItems.push({id:'coin-'+n,type:'coin',name:'1 Coin',x:cell.x+.5,y:cell.y+.5,taken:false,quantity:1,phase:mapRandom()*Math.PI*2});n++;
 }
 updateCoinCounter();
}
function pickupCoins(){
 if(!gameSession.player)return;
 let acquired=0;
 for(const coin of gameSession.bonusItems){
  if(coin.type==='coin'&&!coin.taken&&Math.hypot(coin.x-gameSession.player.x,coin.y-gameSession.player.y)<.69&&lineOfSight(gameSession.player.x,gameSession.player.y,coin.x,coin.y)){
   coin.taken=true;acquired++;gameSession.stats.coins=(gameSession.stats.coins||0)+1;gameSession.player.coins=(gameSession.player.coins||0)+1;
  }
 }
 if(acquired){playCoinPickup();showToast('FOUND '+acquired+' GROSZ'+(acquired===1?'':'E'),2);updateCoinCounter();}
}
function safeRoomInteraction(room){
 if(gameSession.state!=='playing'||!bossRushRooms().includes(room)||!lineOfSight(gameSession.player.x,gameSession.player.y,room.doorX+.5,room.doorY+.5,{allowTargetTile:true}))return false;
 const doorDistance=Math.hypot(gameSession.player.x-room.doorX-.5,gameSession.player.y-room.doorY-.5);
 if(doorDistance<1.7){
  if(room.open&&[gameSession.player,...gameSession.guards,...(gameSession.level===1&&gameSession.awake?[gameSession.cat]:[])].some(p=>Math.abs(p.x-room.doorX-.5)<.5+.23&&Math.abs(p.y-room.doorY-.5)<.5+.23)){
    showToast('DOOR BLOCKED · CLEAR THE ENTRY',2.2);return true;
  }
  room.open=!room.open;
  gameSession.world[room.doorY][room.doorX]=room.open?0:4;markWorldChanged();
  playUnlock();showToast(room.open?'SAFE ROOM OPENED':'SAFE ROOM DOOR CLOSED',2.6);
  updateCoinCounter();return true;
 }
 return false;
}
function slotMachineSpin(slot){
 if(gameSession.state!=='playing'||!bossRushRooms().length)return;
 if(!slot||slot.type!=='slot'||!gameSession.interactables.includes(slot)||Math.hypot(gameSession.player.x-slot.x,gameSession.player.y-slot.y)>=1.45||!lineOfSight(gameSession.player.x,gameSession.player.y,slot.x,slot.y,{allowTargetFurniture:true}))return;
 if((gameSession.player.coins||0)<1){showToast('NO COINS · NEED 1',2.5);return;}
 gameSession.player.coins--;updateCoinCounter();playCoinSlot();
 // Independent draw on every paid interaction, exact 15/35/50 bands.
 const roll=Math.random()*100;
 if(roll<15){
  gameSession.player.freezeCharges=(gameSession.player.freezeCharges||0)+1;ensureInventory().freeze=gameSession.player.freezeCharges;
  showToast('777 · WYGRANA: FREEZE DEVICE',3);playWin();
 }else if(roll<50){
  gameSession.player.slowCharges=(gameSession.player.slowCharges||0)+1;ensureInventory().slow=gameSession.player.slowCharges;
  showToast('777 · WYGRANA: SLOW DEVICE',3);playUnlock();
 }else{showToast('NO PRIZE · LOST 1 COIN',2.5);sound(145,.18,'square',.09,-80)}
 updateInventoryUI();
}
