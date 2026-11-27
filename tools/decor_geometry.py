"""Geometry corrections and horizontal collision footprints for CRM2 props."""
import json
import math
import struct

import numpy as np


def read_mesh(path):
    data = path.read_bytes()
    vertex_count, index_count = struct.unpack_from('<II', data, 4)
    vertices = np.frombuffer(data, dtype='<f4', offset=12, count=vertex_count * 11)
    faces = np.frombuffer(data, dtype='<u4', offset=12 + vertex_count * 44, count=index_count)
    return vertices.reshape(-1, 11).copy(), faces.reshape(-1, 3).copy()


def write_mesh(path, vertices, faces):
    path.write_bytes(struct.pack('<4sII', b'CRM2', len(vertices), faces.size)
                     + vertices.astype('<f4').tobytes() + faces.astype('<u4').tobytes())


def correct_mesh(name, vertices, faces, radius):
    if name == 'yellowClock':
        # Reflect the dial (including the hands) with its UVs attached.
        vertices[:, [0, 3]] *= -1
        faces[:, [1, 2]] = faces[:, [2, 1]]
    if name == 'pipe':
        # The mounting flange points along local -X in the imported asset.
        # Rotate it to +Y, the direction the placement code puts against a wall.
        for x, y in ((0, 1), (3, 4)):
            vertices[:, [x, y]] = vertices[:, [y, x]] * [1, -1]
    if name == 'bench':
        # Local +X is missing its leg. Find the angle at which the two
        # halves have the same lowest point, then rest that plane on Z=0.
        left = vertices[:, 0] < 0
        lo, hi = 0., math.pi / 4
        for _ in range(32):
            angle = (lo + hi) / 2
            height = vertices[:, 2] * math.cos(angle) - vertices[:, 0] * math.sin(angle)
            if height[~left].min() > height[left].min():
                lo = angle
            else:
                hi = angle
        c, s = math.cos(angle), math.sin(angle)
        for x, z in ((0, 2), (3, 5)):
            a, b = vertices[:, x].copy(), vertices[:, z].copy()
            vertices[:, x] = a * c + b * s
            vertices[:, z] = b * c - a * s
        vertices[:, 0] -= (vertices[:, 0].min() + vertices[:, 0].max()) / 2
        vertices[:, 2] -= vertices[:, 2].min()
        vertices[:, :3] *= min(1., radius / np.linalg.norm(vertices[:, :2], axis=1).max())


def footprint(points):
    """Counterclockwise convex hull with collinear points removed."""
    ordered = sorted(set(map(tuple, points.astype(float).round(7))))

    def half(points):
        hull = []
        for c in points:
            while len(hull) >= 2:
                a, b = hull[-2:]
                if (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0]) > 0:
                    break
                hull.pop()
            hull.append(c)
        return hull[:-1]
    return [coordinate for point in half(ordered) + half(reversed(ordered)) for coordinate in point]


def collision_data(models, rock_mesh):
    lines = []
    for name, vertices in models:
        xy = json.dumps(footprint(vertices[:, :2]), separators=(',', ':'))
        if name in ('box', 'crt'):
            xz = json.dumps(footprint(vertices[:, [0, 2]]), separators=(',', ':'))
            lines.append(f' {name}:{{floor:{xy},side:{xz}}},')
        else:
            lines.append(f' {name}:{{floor:{xy}}},')
    rock, _ = read_mesh(rock_mesh)
    xy = json.dumps(footprint(rock[:, :2]), separators=(',', ':'))
    return ('const DECOR_FOOTPRINTS=Object.freeze({\n' + '\n'.join(lines)
            + f'\n rock:{{floor:{xy}}},\n}});\n')
