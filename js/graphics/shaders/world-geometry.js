// Rasterize the nearest world surface: forward depth, cell, surface tag.
const WORLD_GEOMETRY_WGSL=/* wgsl */ `
${FRAME_WGSL}
${DEPTH_WGSL}
${PROJECTION_WGSL}
@group(0) @binding(0) var<uniform> frame:SceneFrame;
struct WallVertex {
 @builtin(position) position:vec4f,
 @location(0) depth:f32,
 @location(1) @interpolate(flat) cell:vec3f,
};
@vertex fn vertex(@location(0) point:vec3f,@location(1) cell:vec3f)->WallVertex {
 let coords=cameraCoords(point,frame);
 let depth=coords.z;
 var out:WallVertex;
 out.position=cameraClip(coords,frame);
 out.depth=depth;out.cell=cell;
 return out;
}
@fragment fn fragment(input:WallVertex)->@location(0) vec4f {
 return vec4f(max(VIEW_NEAR,input.depth),input.cell);
}
`;
// Reuse all the established surface materials and gameplay screen effects.
// The alternate fragment has no grid traversal loop; rasterized surfaces
// determine visibility. Evaluate exact horizontal plane depth for shading
// instead of reconstructing UVs from quantized half-float depth.
function geometryTerrainSource(){
 const start=TERRAIN_WGSL.indexOf(' var cell=vec2i(floor(frame.player.xy));');
 const end=TERRAIN_WGSL.indexOf(' let wallPoint=',start);
 if(start<0||end<0)throw Error('Terrain shader contract changed');
 const source='@group(0) @binding(11) var geometryHits:texture_2d<f32>;\n'+
 TERRAIN_WGSL.slice(0,start)+` let rasterHit=textureLoad(geometryHits,vec2i(pixel.xy),0);
 let hasSurface=rasterHit.x>0.;
 let hasWall=hasSurface && rasterHit.w<1.5;
 let hasPlane=hasSurface && rasterHit.w>=1.5;
 let cell=vec2i(rasterHit.yz);
 let side=i32(rasterHit.w);
 let hit=max(1u,tileAt(cell.x,cell.y));
 var distance=WALL_DEPTH_SCALE;
 if(hasWall){
   let along=select(ray.y,ray.x,side==0);
   let axisCell=select(cell.y,cell.x,side==0);
   let axisOrigin=select(frame.player.y,frame.player.x,side==0);
   let boundary=f32(axisCell)+select(0.,1.,along<0.);
   distance=max(VIEW_NEAR,(boundary-axisOrigin)/along);
 }
`+TERRAIN_WGSL.slice(end);
 const oldResolve='result=scenerySurface(ray3,ray3.z<0.,distance);';
 if(!source.includes(oldResolve))throw Error('Terrain surface resolve contract changed');
 return source.replace(oldResolve,`if(hasPlane){
     let isFloor=rasterHit.w<2.5||rasterHit.w>3.5;
     // Compute the exact depth again after identifying the rasterized surface.
     distance=select(min(VIEW_FAR,(roomCeiling(cell,i32(frame.viewport.z))-.5)/max(ray3.z,.000001)),planeDepth(ray3),isFloor);
     if(rasterHit.w>3.5){
       let z=select(POOL_WATER_Z,${POOL_BOTTOM_Z},rasterHit.w>4.5);
       distance=min(VIEW_FAR,(.5-z)/max(-ray3.z,.000001));
       result=poolSurface(frame.player.xy+ray.xy*distance,distance);
     }else{result=scenerySurface(ray3,isFloor,distance);}
   }else{
     // Preserve the classic distant fog/near clip fallback when no triangle
     // covers the pixel (including views beyond VIEW_FAR).
     result=sceneryAt(pixel.xy,ray3);
     distance=planeDepth(ray3);
   }`);
}
