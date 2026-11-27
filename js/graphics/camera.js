// Capture the render camera once, independently from simulation/collision state.
// Pitch is a true rotation in radians; horizontal FOV defines both axes.
function captureRenderCamera(position=gameSession.renderPosition(gameSession.player)){
 const angle=cameraViewAngle(),plane=cameraPlaneScale(),pitch=viewPitchOffset();
 return {x:position.x??2.5,y:position.y??2.5,angle,plane,pitch,
  cos:Math.cos(angle),sin:Math.sin(angle)};
}
// Some debug and test callers supply only a position; retain that API.
function resolveRenderCamera(camera){
 return camera.angle!==undefined&&camera.plane!==undefined&&camera.pitch!==undefined&&camera.cos!==undefined&&camera.sin!==undefined?camera:captureRenderCamera(camera);
}

// Camera-space right, up and forward; mirrors the shared WGSL transform.
function cameraCoordinates(camera,x,y,z){
 const dx=x-camera.x,dy=y-camera.y,forward=dx*camera.cos+dy*camera.sin;
 const c=Math.cos(camera.pitch),s=Math.sin(camera.pitch),height=z-.5;
 return {right:-dx*camera.sin+dy*camera.cos,up:height*c-forward*s,depth:forward*c+height*s};
}

// Visual-only spotlight state. Never changes player.flash or enemy detection.
function sampleFlashlight(previous,player,camera,elapsed,walkPhase){
 const target=player.flash&&!player.hidden?1:0;
 const reset=!previous||previous.player!==player||elapsed<previous.elapsed;
 const dt=reset?0:Math.max(0,Math.min(.1,elapsed-previous.elapsed));
 const ease=1-Math.exp(-dt*14);
 const intensity=reset?target:previous.intensity+(target-previous.intensity)*ease;
 const swayTarget=player.moving&&!player.hidden?1:0;
 const sway=reset?swayTarget:previous.sway+(swayTarget-previous.sway)*ease;
 return {player,elapsed,intensity,sway,yaw:camera.angle+Math.sin(walkPhase*.5)*.018*sway,pitch:camera.pitch+Math.cos(walkPhase)*.012*sway};
}
