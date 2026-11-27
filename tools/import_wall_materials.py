#!/usr/bin/env python3
"""Usage: python tools/import_wall_materials.py wallpaper.zip sewerbrick10-bl.zip."""
from io import BytesIO
from pathlib import Path
import sys
from zipfile import ZipFile

import numpy as np
from PIL import Image

DESTINATION = Path(__file__).resolve().parents[1] / 'assets/materials'
WALL_SIZE = (512, 1024)
DETAIL_SIZE = (512, 512)


def load_map(archive, filename, mode, size):
    name = next(name for name in archive.namelist() if Path(name).name == filename)
    return Image.open(BytesIO(archive.read(name))).convert(mode).resize(size, Image.Resampling.LANCZOS)


def import_wall(path, destination, prefix, base_name, normal_name, roughness_name, ao_name=None):
    with ZipFile(path) as archive:
        base = load_map(archive, prefix + base_name, 'RGB', WALL_SIZE)
        if ao_name:
            ao = np.asarray(load_map(archive, prefix + ao_name, 'L', WALL_SIZE), dtype=float) / 255
            base = Image.fromarray(np.uint8(np.round(np.asarray(base) * ao[:, :, None] ** .65)))
        base.save(DESTINATION / f'{destination}-wall.png', optimize=True)

        normal = load_map(archive, prefix + normal_name, 'RGB', DETAIL_SIZE)
        roughness = load_map(archive, prefix + roughness_name, 'L', DETAIL_SIZE)
        # The renderer's wall tangent goes down as image V increases.
        packed = Image.merge('RGB', (normal.getchannel('R'), normal.getchannel('G').point(lambda v: 255 - v), roughness))
        packed.save(DESTINATION / f'{destination}-wall-detail.png', optimize=True)


if __name__ == '__main__':
    wallpaper, sewer_brick = sys.argv[1:]
    import_wall(wallpaper, 'yellow', 'Wallpaper_Backrooms_001_', 'basecolor.png', 'normal.png', 'roughness.png')
    import_wall(sewer_brick, 'flood', 'sewerbrick10_', 'basecolor.png', 'Normal-ogl.png', 'roughness.png', 'AO.png')
