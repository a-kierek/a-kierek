#!/usr/bin/env python3
"""Convert the two supplied Backrooms asset directories into room meshes."""
import hashlib
import json
import math
from pathlib import Path
import sys

import numpy as np
from PIL import Image
import trimesh
from decor_geometry import footprint, write_mesh

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/models/rooms'
SPECS = {
    'officeChair': ('chair', 1, 'floor', .43, .25),
    'officePC': ('old_pc', 1, 'surface', .19, .21),
    'officePhone': ('phone', 1, 'surface', .081, .105),
    'officePrinter': ('printer', 1, 'surface', .077, .135),
    'serverRack': ('network_server_rack', 1, 'floor', .76, .36),
    'wardrobe': ('psx_style_wardrobe', 5, 'floor', .79, .36),
    'hospitalBed': ('hospital_bed', 5, 'floor', .32, .45),
    'emergencyShower': ('emergency_shower_with_eye_wash', 2, 'floor', .78, .38),
    'waterTank': ('water_container', 2, 'floor', .64, .43),
    'reactorUnit': ('reactorwater', 3, 'floor', .76, .39),
    'turbine': ('turbine_dynamo', 3, 'floor', .52, .43),
    'generatorUnit': ('generator', 3, 'floor', .74, .40),
    'metalLeaf': ('metal_door_-_gameready', 3, 'wall', .86, .28),
    'windowFrame': ('window', 5, 'wall', .55, .28),
    'oldStairs': ('old_stairs', 2, 'landing', .59, .46),
    'balustrade': ('balustrade__feet_assembly_export', 2, 'landing', .44, .49),
    'poolThree': ('swimming_pool_no.2', 2, 'basin', .62, 3),
    'poolFive': ('swimming_pool_no.2', 2, 'basin', .62, 5),
}


def convert(source_dir):
    OUT.mkdir(parents=True, exist_ok=True)
    images, ids, models, credits = [], {}, {}, {}
    def atlas_id(image):
        if image is None:
            image = Image.new('RGB', (8, 8), 'white')
        image = image.convert('RGB').resize((248, 248), Image.Resampling.LANCZOS)
        key = hashlib.sha256(image.tobytes()).digest()
        if key not in ids:
            ids[key] = len(images)
            images.append(image)
        return ids[key]

    for name, (stem, stage, placement, max_height, max_radius) in SPECS.items():
        path = next(source_dir.rglob(stem + '.glb'))
        scene = trimesh.load_scene(path, process=False)
        raw = path.read_bytes()
        credits[stem] = json.loads(raw[20:20+int.from_bytes(raw[12:16], 'little')])['asset']['extras']
        vertices, indices, materials = [], [], []
        offset = 0
        water = None
        for node in sorted(scene.graph.nodes_geometry):
            transform, geometry = scene.graph[node]
            mesh = scene.geometry[geometry]
            if not isinstance(mesh, trimesh.Trimesh) or (name == 'balustrade' and node != 'Object_2'):
                continue
            basis = transform[:3, :3]
            pos = mesh.vertices @ basis.T + transform[:3, 3]
            norm = mesh.vertex_normals @ np.linalg.inv(basis)
            pos = pos[:, [0, 2, 1]] * [1, -1, 1]
            norm = norm[:, [0, 2, 1]] * [1, -1, 1]
            material = mesh.visual.material
            if placement == 'basin' and material.name == 'Water_Swim':
                water = (pos.min(0), pos.max(0))
                continue
            uv = getattr(mesh.visual, 'uv', None)
            if uv is None:
                uv = np.zeros((len(pos), 2))
            factor = getattr(material, 'baseColorFactor', None)
            tint = np.ones(3) if factor is None else (np.asarray(factor[:3]) / 255) ** (1 / 2.2)
            vertices.append(np.column_stack((pos, norm, np.clip(uv,0,1), np.tile(tint, (len(pos), 1)))))
            faces = mesh.faces[:, [0, 2, 1]] if np.linalg.det(basis) < 0 else mesh.faces
            indices.append(faces + offset)
            materials.extend([atlas_id(getattr(material, 'baseColorTexture', None))] * len(pos))
            offset += len(pos)
        v, faces = np.concatenate(vertices), np.concatenate(indices)
        low, high = v[:, :3].min(0), v[:, :3].max(0)
        if placement == 'basin':
            water_low, water_high = water
            v[:, :3] -= [*((water_low+water_high)/2)[:2], high[2]]
            scale = np.array([3/(water_high[0]-water_low[0]), max_radius/(water_high[1]-water_low[1]), max_height/(high[2]-low[2])])
            v[:, :3] *= scale
            v[:,2] += .009
            v[:,3:6] /= scale
        elif name == 'metalLeaf':
            v[:, :3] -= [*((low+high)/2)[:2], low[2]]
            scale = np.array([1.04/(high[0]-low[0]),.075/(high[1]-low[1]),1/(high[2]-low[2])])
            v[:,:3] *= scale
            v[:,3:6] /= scale
        else:
            v[:, :3] -= [*((low+high)/2)[:2], low[2]]
            v[:, :3] *= min(max_height/(high[2]-low[2]), max_radius/np.linalg.norm(v[:,:2],axis=1).max())
        v[:,3:6] /= np.maximum(1e-10,np.linalg.norm(v[:,3:6],axis=1,keepdims=True))
        models[name] = (stage, placement, v, faces, np.asarray(materials))
    columns = math.ceil(math.sqrt(len(images)))
    rows = math.ceil(len(images)/columns)
    atlas = Image.new('RGB',(256*columns,256*rows))
    for i,image in enumerate(images):
        padded = np.pad(np.asarray(image),((4,4),(4,4),(0,0)),mode='edge')
        atlas.paste(Image.fromarray(padded),(256*(i%columns),256*(i//columns)))
    atlas.save(OUT/'albedo.webp',quality=87,method=5)
    manifest, footprints = {}, {}
    for name, (stage, placement, v, faces, material) in models.items():
        v[:,6] = (material%columns*256+4.5+v[:,6]*247)/atlas.width
        v[:,7] = 1-(material//columns*256+4.5+(1-v[:,7])*247)/atlas.height
        v, reverse = np.unique(v.astype('<f4'),axis=0,return_inverse=True)
        write_mesh(OUT/(name+'.mesh'),v,reverse[faces])
        manifest[name] = dict(stage=stage,placement=placement,roomAtlas=True,
            radius=round(float(np.linalg.norm(v[:,:2],axis=1).max()),5),
            height=round(float(v[:,2].max()),5),depth=round(float(abs(v[:,1]).max()),5),
            triangles=len(faces),mesh='assets/models/rooms/'+name+'.mesh')
        if placement == 'floor':
            footprints[name] = {'floor':footprint(v[:,:2])}
    compact = lambda obj:json.dumps(obj,separators=(',',':'))
    (ROOT/'js/graphics/room-model-data.js').write_text(
        '// Generated by tools/import_room_models.py.\nconst ROOM_MODELS='+compact(manifest)+
        ';\nconst ROOM_MODEL_FOOTPRINTS='+compact(footprints)+
        ";\nconst ROOM_MODEL_ALBEDO='assets/models/rooms/albedo.webp';\n", encoding='utf-8')
    lines=['# Modele pokojów','', 'Modele przekonwertowano i przeskalowano na potrzeby gry. Zasoby udostępniono na licencji [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).','']
    for credit in credits.values():
        lines.append(f"- {credit['title']} — {credit['author'].split(' (')[0]}. [Model]({credit['source']})")
    (ROOT/'docs/room-model-credits.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')


if __name__ == '__main__':
    convert(Path(sys.argv[1]))
