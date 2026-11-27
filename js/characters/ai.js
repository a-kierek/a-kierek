// Never spawn a guard in a wall or on an isolated side of a locked door.
// Reachability is checked from the player entrance with the current live map.
function safeGuardSpawn(x,y){
 if(gameSession.level===12){
   const xx=Math.floor(x),yy=Math.floor(y);
   if(freeAt(xx+.5,yy+.5,.23))return{x:xx+.5,y:yy+.5};
   for(let radius=1;radius<12;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)
     if(freeAt(xx+dx+.5,yy+dy+.5,.23))return{x:xx+dx+.5,y:yy+dy+.5};
 }
 const start=(isHardMode()||gameSession.level===13)?7:gameSession.level===5?6:gameSession.level===1?2:3;
 const dist=bfsDistances(start,start);
 let best=null,bestScore=Infinity;
 for(let yy=1;yy<gameSession.N-1;yy++)for(let xx=1;xx<gameSession.N-1;xx++){
   if(gameSession.world[yy]?.[xx]!==0||dist[yy][xx]<0||dist[yy][xx]<6)continue;
   const cx=xx+.5,cy=yy+.5;
   if(!freeAt(cx,cy,.24))continue;
   const score=Math.hypot(x-cx,y-cy)+(.002*dist[yy][xx]);
   if(score<bestScore){best={x:cx,y:cy};bestScore=score}
 }
 return best||{x:3.5,y:3.5};
}

function makeGuard(x,y,kind,territory=null){
  const spawn=safeGuardSpawn(x,y);x=spawn.x;y=spawn.y;
  return {id:kind,kind,x,y,territory,stuckTime:0,a:rnd()*TAU,state:'patrol',memory:null,heard:null,investigate:null,patrolTarget:null,path:[],pathTimer:0,alert:0,searchTimer:0,listenTimer:0,lastSeen:-100,wasSeeing:false,patrolFail:0,searchStep:0};
}

function randomPatrolPoint(g){
  if(!g||!g.x)return{x:3.5,y:3.5};
  let points=[];
  let a=g.territory||{x0:1,y0:1,x1:gameSession.N-2,y1:gameSession.N-2};
  for(let attempts=0;attempts<70;attempts++){
    let x=Math.floor(a.x0+rnd()*(a.x1-a.x0+1)),y=Math.floor(a.y0+rnd()*(a.y1-a.y0+1));
    if(!freeAt(x+.5,y+.5,.23)||Math.hypot(g.x-x-.5,g.y-y-.5)<3.5)continue;
    if(lineOfSight(g.x,g.y,x+.5,y+.5)||Number.isFinite(navPathDistance(Math.floor(g.x),Math.floor(g.y),x,y,Infinity,g))){return{x:x+.5,y:y+.5}}
  }
  return{x:g.x,y:g.y};
}

function addNoise(x,y,radius,type='urzadzenie'){
  gameSession.noiseEvents.push({x,y,radius,expiry:gameSession.elapsed+2.4,type});gameSession.stats.noises++;
  if(gameSession.noiseEvents.length>25)gameSession.noiseEvents.shift();
}

function audibleDistance(g,x,y,maxDistance){
 const d=Math.hypot(g.x-x,g.y-y);
 if(d>maxDistance)return Infinity;
 if(lineOfSight(g.x,g.y,x,y))return d;
 return navPathDistance(Math.floor(g.x),Math.floor(g.y),Math.floor(x),Math.floor(y),maxDistance,g);
}

function updateGuard(g,dt,idx=0){
  if(!freeAt(g.x,g.y,.23)){
    const safe=safeGuardSpawn(g.x,g.y);g.x=safe.x;g.y=safe.y;
    g.path=[];g.pathTimer=0;g.patrolTarget=null;g.stuckTime=0;
  }
  if(g.frozen){g.state='frozen';return {sees:false,distance:Math.hypot(g.x-gameSession.player.x,g.y-gameSession.player.y)};}
  const prey=coop.role==='host'&&coop.active ? [gameSession.player,...coop.remotes.values()].filter(p=>p&&p.x!=null).sort((a,b)=>Math.hypot(g.x-a.x,g.y-a.y)-Math.hypot(g.x-b.x,g.y-b.y))[0]||gameSession.player : gameSession.player;
  const preyCrouching=prey===gameSession.player?gameSession.crouching:!!prey.crouching;
  const distance=Math.hypot(g.x-prey.x,g.y-prey.y);
  const range=(g.kind==='watcher'?11.4:g.kind==='listener'?6.4:g.kind==='pig'?7.7:g.kind==='stranger'?10.2:8.3)*1.48*(rageMode?(gameSession.level===3?1.85:1.45):1)*(gameSession.eventState?.kind==='blackout'?.67:1)*(g.hardEnhanced?1.57:1);
  const fov=(g.kind==='watcher'?1.48:g.kind==='listener'?1.9:g.kind==='pig'?2.25:g.kind==='stranger'?2.0:2.0)*(rageMode?1.2:1)*(g.hardEnhanced?1.31:1);
  const angle=Math.atan2(prey.y-g.y,prey.x-g.x);
  const facing=Math.abs(Math.atan2(Math.sin(angle-g.a),Math.cos(angle-g.a)))<fov;
  let sees=g.variant==='gray'&&isHardMode()?true:distance<range&&facing&&lineOfSight(g.x,g.y,prey.x,prey.y);
  if(prey.hidden&&distance>1.1&&g.variant!=='gray')sees=false;
  if(preyCrouching&&distance>3.3&&g.state!=='chase'&&g.kind!=='watcher'&&g.variant!=='gray')sees=false;
  if(!prey.flash&&!rageMode&&distance>5&&g.kind!=='watcher'&&g.state!=='chase'&&g.variant!=='gray')sees=false;
  const protectedPrey=prey===gameSession.player&&isSafeRoomProtected();
  if(protectedPrey)sees=false;
  if(protectedPrey&&!g.preyProtected){g.memory=null;g.investigate=null;g.heard=null;g.patrolTarget=null;g.path=[];g.pathTimer=0;g.state='patrol';}
  g.preyProtected=protectedPrey;
  if(sees){
    if(g.state!=='chase')g.pathTimer=0;
    g.state='chase';
    const lead=g.hardEnhanced&&prey.moving?Math.min(2.8,distance*.21):0;
    const px=prey.x+Math.cos(prey.a||0)*lead,py=prey.y+Math.sin(prey.a||0)*lead;
    g.memory=lead&&freeAt(px,py,.24)?{x:px,y:py}:{x:prey.x,y:prey.y};g.alert=g.hardEnhanced?12:rageMode?(gameSession.level===3?13:9):5.5;g.searchTimer=0;g.lastSeen=gameSession.elapsed;
    if(gameSession.level===3&&!g.wasSeeing&&gameSession.guardCallCooldown<=0){
      gameSession.guardCallCooldown=5.5;
      for(let ally of gameSession.guards)if(ally!==g&&Math.hypot(g.x-ally.x,g.y-ally.y)<(rageMode?29:18)){
        if(ally.state!=='chase'){ally.state='suspicious';ally.investigate={x:g.memory.x,y:g.memory.y};ally.searchTimer=9;ally.pathTimer=0}
      }
      addNoise(g.x,g.y,9,'ostrzezenie');
    }
  }else{
    g.listenTimer=(g.listenTimer||0)-dt;
    if(g.listenTimer<=0){
      g.listenTimer=.42+idx*.09;
      let best=null,score=Infinity;
      // Preserve Level 1's footstep hearing, with path-aware attenuation.
      if(!protectedPrey&&gameSession.level===1&&prey.moving&&!preyCrouching){
        const running=prey===gameSession.player?(keys.ShiftLeft||keys.ShiftRight||touchRun):!!prey.sprinting;
        const radius=(running?9.3:3.3)*(rageMode?1.5:1);
        const noiseDist=audibleDistance(g,prey.x,prey.y,radius);
        if(noiseDist<radius){best={x:prey.x,y:prey.y};score=noiseDist}
      }
      for(let e of gameSession.noiseEvents){
        if(e.expiry<gameSession.elapsed||protectedPrey&&bossRushRooms().some(r=>!r.open&&e.x>=r.left+1&&e.x<r.left+r.side-1&&e.y>=r.top+1&&e.y<r.top+r.side-1))continue;
        let mult=(g.kind==='listener'?1.55:g.kind==='pig'?1.35:1)*1.20*(rageMode?(gameSession.level===3?1.9:1.5):1)*(g.hardEnhanced?1.57:1);
        let distanceSound=audibleDistance(g,e.x,e.y,e.radius*mult);
        if(distanceSound<e.radius*mult&&distanceSound<score){best=e;score=distanceSound}
      }
      if(best&&g.state!=='chase'){
        g.heard={x:best.x,y:best.y};
        // Repeated footsteps update the destination, not the listening countdown.
        if(g.state==='suspicious'){
          if(!g.investigate||Math.hypot(g.investigate.x-best.x,g.investigate.y-best.y)>1)g.pathTimer=0;
          g.investigate=g.heard;
        }else if(g.state!=='listen'){g.state='listen';g.alert=rageMode?1.8:1.1;g.pathTimer=0;}
      }
    }
    if(g.state==='chase'){g.alert-=dt;if(g.alert<=0){g.state='search';g.investigate=g.memory;g.searchTimer=g.hardEnhanced?17:rageMode?(gameSession.level===3?19:13):8;g.pathTimer=0}}
    else if(g.state==='listen'){g.alert-=dt;if(g.alert<=0){g.state='suspicious';g.investigate=g.heard;g.pathTimer=0}}
    else if(g.state==='search'){
      g.searchTimer-=dt;
      if(g.searchTimer<=0){g.state='patrol';g.memory=null;g.investigate=null;g.patrolTarget=null}
    }
  }
  g.wasSeeing=sees;
  let target=null;
  if(g.state==='chase')target=g.memory;
  else if(g.state==='suspicious'||g.state==='search')target=g.investigate;
  else if(g.state==='patrol'){
    if(!g.patrolTarget||Math.hypot(g.x-g.patrolTarget.x,g.y-g.patrolTarget.y)<.72)g.patrolTarget=randomPatrolPoint(g);
    target=g.patrolTarget;
  }else if(g.state==='listen'){g.a+=dt*.9;}
  if(target&&Math.hypot(g.x-target.x,g.y-target.y)<.7&&g.state!=='chase'){
    if(g.state==='suspicious'){g.state='search';g.searchTimer=rageMode?14:7;g.investigate=randomPatrolPoint(g);target=g.investigate;}
    else if(g.state==='search'){g.investigate=randomPatrolPoint(g);target=g.investigate;}
    else if(g.state==='patrol'){g.patrolTarget=randomPatrolPoint(g);target=g.patrolTarget;}
    g.pathTimer=0;
  }
  g.pathTimer-=dt;
  if(target&&g.pathTimer<=0){
    g.path=findPath(Math.floor(g.x),Math.floor(g.y),Math.floor(target.x),Math.floor(target.y),g);
    g.pathTimer=(g.hardEnhanced?.19:rageMode?.25:.52)+idx*.025;
    if(!g.path.length&&Math.hypot(g.x-target.x,g.y-target.y)>1.4&&g.state==='patrol')g.patrolTarget=null;
  }
  if(!target)g.path=[];
  let waypoint=g.path[0];if(waypoint&&Math.hypot(g.x-waypoint.x,g.y-waypoint.y)<.27){g.path.shift();waypoint=g.path[0]}
  if(target&&lineOfSight(g.x,g.y,target.x,target.y)&&(Math.hypot(g.x-target.x,g.y-target.y)<1.8||(!waypoint&&g.state==='chase')))waypoint=target;
  // A blocked/empty patrol must not permanently lock the field of view.
  if((!waypoint||Math.hypot(g.x-waypoint.x,g.y-waypoint.y)<=.02)&&(g.state==='patrol'||g.state==='search'||g.state==='suspicious'))g.a=(g.a+dt*1.2)%TAU;
  if(waypoint){
    let dx=waypoint.x-g.x,dy=waypoint.y-g.y,len=Math.hypot(dx,dy);
    if(len>.02){
      let speed=(g.kind==='cat'?1.64:g.kind==='watcher'?1.65:g.kind==='pig'?1.53:g.kind==='stranger'?1.78:1.5)*(g.state==='chase'?(g.kind==='pig'?1.83:1.40):g.state==='search'?1.14:1)*(rageMode?(gameSession.level===3?1.39:1.2):1)*(g.speedMultiplier||1)*(hardSlowActive()?.52:1);
      let step=Math.min(dt*speed,len),beforeX=g.x,beforeY=g.y;move(g,dx/len*step,dy/len*step,.23);
      g.a=Math.atan2(dy,dx);
      if(Math.hypot(g.x-beforeX,g.y-beforeY)<step*.08)g.stuckTime=(g.stuckTime||0)+dt;
      else g.stuckTime=0;
      if(g.stuckTime>2){g.pathTimer=0;g.path=[];g.patrolTarget=null;g.stuckTime=0;
        if(g.state==='patrol')g.patrolTarget=randomPatrolPoint(g);
      }
    }
  }
  if(sees)gameSession.guardSight=Math.max(gameSession.guardSight,1.2);
  return{sees,distance};
}
