// Shared deterministic scene for free exploration and benchmark camera poses.
function populateGraphicsDemo(scene){
 scene.level=1;
 scene.graphicsDemo=true;
 scene.runCheated=true;
 scene.runTestEntry=true;
 scene.N=32;
 scene.GOAL=1;
 scene.world=Array.from({length:scene.N},()=>Array(scene.N).fill(1));
 const carve=(left,top,right,bottom)=>{
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)scene.world[y][x]=0;
 };
 carve(2,10,29,13);
 carve(6,6,10,9);
 carve(14,14,20,20);
 carve(22,6,27,9);
 carve(24,14,28,18);
 carve(15,15,22,17);
 carve(22,13,22,17);
 scene.world[9][24]=4;
 scene.safeRoom={left:21,top:5,side:8,centerX:24.5,centerY:7.5,doorX:24,doorY:9,
  fireX:24.5,fireY:6.65,machineX:23.2,machineY:7.6,treeX:26.2,treeY:7.4,open:false};
 const clock=mountedDecorPose('yellowClock',DECOR_MODELS.yellowClock,[0,-1]);
 const bench=wallFloorDecorPose('bench',DECOR_MODELS.bench,[-1,0]);
 for(const [model,x,y,z,yaw,size,solid] of [
  ['cabinet',5.5,10.5,0,0,1.22,true],
  ['box',7.5,12.5,0,.36,1.4,true],
  ['desk',11.5,13.5,0,Math.PI,1,true],
  ['yellowClock',8.5+clock.dx,6.5+clock.dy,clock.z,clock.yaw,1,false],
  ['bench',14.5+bench.dx,17.5+bench.dy,0,bench.yaw,1,true],
  ['mannequin',15.5,11.5,0,.28,.96,true],
  ['pump',18.5,15.5,0,.55,1,true],
  ['metalTable',19.5,19.5,0,0,1,true],
  ['barrel',21.5,10.5,0,.1,1.16,true],
  ['box',25.5,16.5,0,.7,1,true],
  ['crt',26.5,17.5,0,.1,1,true]
 ]){
  scene.props.push({type:'decor',model,x,y,z,yaw,size,solid,stage:1});
  if(solid)scene.world[Math.floor(y)][Math.floor(x)]=5;
 }
 scene.fuses=[{x:9.35,y:11.5,phase:.3},{x:16.5,y:18.5,phase:2},{x:27.5,y:11.5,phase:3}];
 scene.seen=scene.world.map(row=>row.map(()=>false));
 scene.player={x:3.5,y:11.5,a:0,pitch:-.07,flash:true,hp:100,maxHp:100,stamina:100,maxStamina:100,collected:0,coins:0,inventory:{energy:[],slow:0,freeze:0}};
 return scene;
}

function beginGraphicsDemo(){
 if(!graphicsReadyForPlay()||(gameSession.state!=='menu'&&!gameSession.graphicsDemo))return false;
 cancelTransition();
 prepareRun();
 resetRage();
 gameSession.resetRound();
 populateGraphicsDemo(gameSession);
 clearModeClasses();
 keys={};resetMobileInputs();
 $('seedChip').style.display='none';
 $('eventTag').style.display='none';
 $('missionDetails').style.display='none';
 $('interactHint').style.display='none';
 $('hardEmergency').hidden=true;
 UI.toast.classList.remove('visible');
 setMapVisibility(false);
 updateInventoryUI();
 updateSeen();
 setState('playing');
 if(!isCoarse)requestGamePointerLock();
 return true;
}

function updateGraphicsDemo(dt){
 const player=gameSession.player;
 gameSession.elapsed+=dt;
 gameSession.clock+=dt;
 if(gameSession.elapsed>gameSession.toastTimeout)UI.toast.classList.remove('visible');
 const yawInput=Number(!!keys.ArrowRight)-Number(!!keys.ArrowLeft);
 setCameraLook(yawInput*dt*2.4,0);
 const forward=Number(!!(keys.KeyW||keys.ArrowUp))-Number(!!(keys.KeyS||keys.ArrowDown))-touchY;
 const strafe=Number(!!keys.KeyD)-Number(!!keys.KeyA)+touchX;
 const length=Math.hypot(forward,strafe);
 player.moving=length>.07;
 if(player.moving){
  const speed=(keys.ShiftLeft||keys.ShiftRight||touchRun)?4.15:2.55;
  const step=dt*speed/Math.max(1,length),cos=Math.cos(player.a),sin=Math.sin(player.a);
  move(player,(forward*cos-strafe*sin)*step,(forward*sin+strafe*cos)*step,.22);
  gameSession.walkPhase+=dt*9;
  updateSeen();
 }
 const target=findInteractable();
 showInteractionHint(target?.type==='pickup'?target:null);
}

function graphicsDemoDoorInReach(scene=gameSession){
 const room=scene.safeRoom;
 return Math.hypot(scene.player.x-room.doorX-.5,scene.player.y-room.doorY-.5)<=1.55;
}
function toggleGraphicsDemoDoor(scene=gameSession){
 const room=scene.safeRoom;
 if(!graphicsDemoDoorInReach(scene))return false;
 if(room.open&&Math.abs(scene.player.x-room.doorX-.5)<.74&&Math.abs(scene.player.y-room.doorY-.5)<.74)return false;
 room.open=!room.open;
 scene.world[room.doorY][room.doorX]=room.open?0:4;
 scene.worldRevision++;
 return true;
}
