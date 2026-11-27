#!/usr/bin/env python3
"""Usage: python tools/import_pickups.py NAME source.glb

Requires numpy, trimesh, and Pillow. The game loads the converted CRM2 assets.
"""
from pathlib import Path
import sys

import numpy as np
import trimesh

from decor_geometry import write_mesh


SPECS = {
    'battery': (.46, False), 'card': (.42, False),
    'shield': (.30, False), 'drink': (.10, True), 'terminal': (.84, True),
}


def import_pickup(source, name, width, y_up, destination):
    scene = trimesh.load(source, force='scene', process=False)
    vertices, faces = [], []
    offset = 0
    for node in sorted(scene.graph.nodes_geometry):
        transform, geometry = scene.graph[node]
        mesh = scene.geometry[geometry]
        basis = transform[:3, :3]
        positions = mesh.vertices @ basis.T + transform[:3, 3]
        normals = mesh.vertex_normals @ np.linalg.inv(basis)
        if y_up:
            positions = positions[:, [0, 2, 1]] * [1, -1, 1]
            normals = normals[:, [0, 2, 1]] * [1, -1, 1]
        normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-9)
        uv = getattr(mesh.visual, 'uv', None)
        if uv is None:
            uv = np.zeros((len(positions), 2))
        material = mesh.visual.material
        factor = getattr(material, 'baseColorFactor', None)
        color = np.ones(3) if factor is None else np.asarray(factor[:3], dtype=float) / 255
        color = np.where(color <= .0031308, 12.92 * color, 1.055 * color ** (1 / 2.4) - .055)
        vertices.append(np.column_stack((positions, normals, uv, np.tile(color, (len(positions), 1)))))
        winding = mesh.faces[:, [0, 2, 1]] if np.linalg.det(basis) < 0 else mesh.faces
        faces.append(winding + offset)
        offset += len(positions)

        albedo = getattr(material, 'baseColorTexture', None)
        if albedo is not None:
            albedo = albedo.convert('RGB')
            albedo.thumbnail((512, 512))
            albedo.save(destination / f'{name}-albedo.webp', quality=88, method=5)

    vertices = np.concatenate(vertices)
    positions = vertices[:, :3]
    low, high = positions.min(axis=0), positions.max(axis=0)
    # Normalize the floor contact after converting each source's up axis.
    positions -= [*(low[:2] + high[:2]) / 2, low[2]]
    positions *= width / max(high[:2] - low[:2])
    vertices, index = np.unique(vertices.astype('<f4'), axis=0, return_inverse=True)
    write_mesh(destination / f'{name}.mesh', vertices, index[np.concatenate(faces)])


if __name__ == '__main__':
    name, source = sys.argv[1:]
    output = Path(__file__).resolve().parents[1] / 'assets/models/pickups'
    output.mkdir(parents=True, exist_ok=True)
    import_pickup(Path(source), name, *SPECS[name], output)
