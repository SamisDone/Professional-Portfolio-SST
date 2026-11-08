"""
Adds what public/shots needs beyond the WebP and JPEG sizes that
scripts/optimise-shots.mjs writes:

  <name>.avif, <name>-700.avif   the same two widths, smaller than WebP
  src/data/shot-previews.json    a 20px WebP of each shot as a data: URI

The preview is what a frame shows while its image downloads. It is a real,
very small picture of the shot, drawn scaled up, so the frame already has the
shot's colours and shape instead of an empty grey box.

Run by hand after adding or re-optimising a shot (needs Pillow 11.3 or later):

    python scripts/make-image-variants.py             # all of them
    python scripts/make-image-variants.py sixpence    # just this one
"""

import base64
import io
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "public" / "shots"
OUT = ROOT / "src" / "data" / "shot-previews.json"

WIDTHS = [(1400, ""), (700, "-700")]
AVIF_QUALITY = 55
PREVIEW_WIDTH = 20
PREVIEW_QUALITY = 40


def resized(image, width):
    width = min(width, image.width)
    return image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)


only = set(sys.argv[1:])
previews = json.loads(OUT.read_text()) if OUT.exists() else {}

for source in sorted(SHOTS.glob("*.jpg")):
    name = source.stem
    if only and name not in only:
        continue
    image = Image.open(source).convert("RGB")
    sizes = []
    for width, suffix in WIDTHS:
        path = SHOTS / f"{name}{suffix}.avif"
        resized(image, width).save(path, format="AVIF", quality=AVIF_QUALITY, speed=6)
        sizes.append(f"{path.stat().st_size // 1024}kB")
    buffer = io.BytesIO()
    resized(image, PREVIEW_WIDTH).save(buffer, format="WEBP", quality=PREVIEW_QUALITY, method=6)
    previews[name] = "data:image/webp;base64," + base64.b64encode(buffer.getvalue()).decode()
    print(f"{name:16} {image.width}px  avif {' '.join(sizes)}  preview {len(buffer.getvalue())}B")

OUT.write_text(json.dumps(previews, indent=2, sort_keys=True) + "\n")
