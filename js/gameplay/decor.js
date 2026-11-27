// Environment props are generated after the map, objectives and safe rooms.
// Reserve one existing floor tile for generation; runtime collision uses the mesh footprint.
// Preserve connectivity constructively: every incident edge of the removed
// tile must have a replacement path in its eight-cell ring. By induction,
// adding any number of these props cannot disconnect any original component.
const DECOR_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function decorFloorAllowed(world,x,y){
 if(world[y]?.[x]!==0)return false;
 const open=(xx,yy)=>world[yy]?.[xx]===0;
 const neighbors=DECOR_DIRS.map(([dx,dy])=>[x+dx,y+dy]).filter(([xx,yy])=>open(xx,yy));
 if(neighbors.length<3)return false;
 let count=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))count++;
 if(count<7)return false; // never a single-width corridor or narrow corner
 const seen=new Set(),queue=[neighbors[0]];seen.add(neighbors[0].join(','));
 for(let i=0;i<queue.length;i++)for(const [dx,dy] of DECOR_DIRS){
  const nx=queue[i][0]+dx,ny=queue[i][1]+dy,key=nx+','+ny;
  if(Math.abs(nx-x)>1||Math.abs(ny-y)>1||(nx===x&&ny===y)||!open(nx,ny)||seen.has(key))continue;
  seen.add(key);queue.push([nx,ny]);
 }
 return neighbors.every(p=>seen.has(p.join(',')));
}
function decorModelsFor(stage){return Object.keys(DECOR_MODELS).filter(k=>stage===5||DECOR_MODELS[k].stage===stage);}
// Smaller loose props stay inside the reserved floor tile, even on their side.
// Imported box/CRT meshes have symmetric local Y extents and a floor origin.
function looseDecorPose(kind,spec,random){
 const size=(kind==='box'?.48:.55)+random()*.12;
 const yaw=random()*Math.PI*2;
 const tilt=random()<.38?(random()<.5?-1:1)*Math.PI/2:0;
 const z=tilt?spec.depth*size:0;
 const radius=(tilt?Math.hypot(spec.radius,spec.height):spec.radius)*size;
 const jitter=Math.max(0,.44-radius);
 return {size,yaw,tilt,z,dx:(random()*2-1)*jitter,dy:(random()*2-1)*jitter,radius};
}
// Local +Y is the back of the bench and the pipe flange, facing the backing wall.
function wallFloorDecorPose(kind,spec,wall){
 const [dx,dy]=wall;
 const offset=.5-spec.depth-(kind==='pipe'?0:.015);
 return {dx:dx*offset,dy:dy*offset,yaw:Math.atan2(-dx,dy)};
}
function mountedDecorPose(kind,spec,[dx,dy]){
 const offset=.5-spec.depth-.035;
 return {dx:dx*offset,dy:dy*offset,z:kind==='camera'?1-spec.height-.025:.78-spec.height/2,yaw:Math.atan2(-dx,dy)};
}
function scatterLevelDecor(){
 const s=gameSession,world=s.world,N=s.N;
 // Independent random stream: decor must not change enemy or loot RNG.
 let decorSeed=(seed^0x5f3759df^s.level)|0;
 const random=()=>{decorSeed=(Math.imul(decorSeed,1664525)+1013904223)|0;return (decorSeed>>>0)/4294967296;};
 let poseSeed=(decorSeed^0x6d2b79f5)|0;
 const poseRandom=()=>{poseSeed=(Math.imul(poseSeed,1664525)+1013904223)|0;return (poseSeed>>>0)/4294967296;};
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const rooms=s.level===12?s.rushSafeRooms:s.safeRoom?[s.safeRoom]:[];
 const reserved=[s.player,...s.guards,...s.fuses,...s.terminals,...s.interactables,...s.bonusItems,...s.props.filter(p=>p.type==='hazard'||p.type==='rock'),...(s.level===1?[s.cat]:[]),{x:s.exitCell.x+.5,y:s.exitCell.y+.5},...s.doors.map(d=>({x:d.x+.5,y:d.y+.5})),...rooms.map(r=>({x:r.doorX+.5,y:r.doorY+.5}))].filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y));
 const inRoom=(x,y)=>rooms.some(r=>x>=r.left-1&&x<=r.left+r.side&&y>=r.top-1&&y<=r.top+r.side);
 const placed=[];
 for(const stage of s.level===12?[1,2,3,4,5]:[renderStage()]){
  const cells=[];
  for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
   if(world[y][x]!==0||inRoom(x,y)||(s.level===12&&bossRushArea(x)!==stage))continue;
   if(reserved.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.0))continue;
   // Gates, exits and safe-room approaches must never be occupied.
   if(DECOR_DIRS.some(([dx,dy])=>[3,4,8].includes(world[y+dy]?.[x+dx])))continue;
   cells.push({x,y});
  }
  shuffle(cells);
  const keys=decorModelsFor(stage),plan=[];
  // Give each supplied model a chance before repeats. Last Encounter mixes
  // the old sectors with its own, giving its native objects extra weight.
  for(let pass=0;pass<(stage===5?1:3);pass++)plan.push(...shuffle(keys.slice()));
  if(stage===5){plan.push('mannequin','lastClock','mannequin','lastClock');if(s.level!==12)plan.push(...shuffle(keys.slice()));}
  if(stage!==5&&s.level!==12&&N>=65)plan.push(...shuffle(keys.slice()));
  for(const kind of plan){
   const spec=DECOR_MODELS[kind];if(!spec)continue;
   if(spec.triangles>8000&&placed.filter(p=>p.model===kind&&p.stage===stage).length>=2)continue;
   const isWall=spec.placement==='wall';
   const againstWall=kind==='bench'||kind==='pipe';
   let selected=null;
   for(const cell of cells){
    const {x,y}=cell;if(world[y][x]!==0)continue;
    if(placed.some(p=>Math.hypot(p.cellX-x,p.cellY-y)<2.6))continue;
    const walls=DECOR_DIRS.filter(([dx,dy])=>world[y+dy]?.[x+dx]===1);
    if(isWall){if(!walls.length)continue;selected={...cell,wall:walls[Math.floor(random()*walls.length)]};break;}
    if(!decorFloorAllowed(world,x,y))continue;
    if(againstWall&&!walls.length)continue;
    selected=againstWall?{...cell,wall:walls[Math.floor(poseRandom()*walls.length)]}:cell;break;
   }
   if(!selected)continue; // safe skip, never force a prop into a passage
   const {x,y,wall}=selected;let px=x+.5,py=y+.5,z=0,yaw=Math.floor(random()*4)*Math.PI/2;
   let size=1,tilt=0,radius=spec.radius; // converter bounds each floor object within its collision tile
   if(isWall){const pose=mountedDecorPose(kind,spec,wall);px+=pose.dx;py+=pose.dy;z=pose.z;yaw=pose.yaw;}
   else {
    world[y][x]=5;
    if(againstWall){const pose=wallFloorDecorPose(kind,spec,wall);px+=pose.dx;py+=pose.dy;yaw=pose.yaw;}
    if(kind==='box'||kind==='crt'){
     const pose=looseDecorPose(kind,spec,poseRandom);
     px+=pose.dx;py+=pose.dy;z=pose.z;yaw=pose.yaw;size=pose.size;tilt=pose.tilt;radius=pose.radius;
    }
   }
   const prop={type:'decor',model:kind,x:px,y:py,z,yaw,size,tilt,radius,stage,cellX:x,cellY:y,solid:!isWall};
   placed.push(prop);s.props.push(prop);
  }
 }
 s.worldRevision++;
 return placed;
}
