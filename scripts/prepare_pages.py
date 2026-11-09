from pathlib import Path
from PIL import Image, ImageOps, UnidentifiedImageError
import shutil

ROOT = Path(".")
SITE = Path("_site")
MAX_EDGE = 1920
WEBP_QUALITY = 78
JPEG_QUALITY = 82
LIMIT = 950 * 1024 * 1024

def ignore(directory, names):
    return {name for name in names if name in {".git", ".github", "_site", ".DS_Store", "Thumbs.db", "__pycache__"}}

if SITE.exists():
    shutil.rmtree(SITE)
shutil.copytree(ROOT, SITE, ignore=ignore)

processed = 0
saved = 0
skipped = 0
for path in SITE.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in {".webp", ".jpg", ".jpeg", ".png"}:
        continue
    before = path.stat().st_size
    try:
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source)
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            options = {"optimize": True}
            if path.suffix.lower() == ".webp":
                options.update(format="WEBP", quality=WEBP_QUALITY, method=6)
            elif path.suffix.lower() in {".jpg", ".jpeg"}:
                if image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")
                options.update(format="JPEG", quality=JPEG_QUALITY, progressive=True)
            else:
                options.update(format="PNG", compress_level=9)
            image.save(path, **options)
        after = path.stat().st_size
        processed += 1
        saved += max(0, before - after)
    except (UnidentifiedImageError, OSError) as exc:
        # Preserve files Pillow cannot decode; do not risk dropping existing site assets.
        skipped += 1
        print(f"WARNING: kept original image unchanged: {path} ({exc})")

total = sum(p.stat().st_size for p in SITE.rglob("*") if p.is_file())
print(f"Optimized images: {processed}")
print(f"Unchanged images (unsupported/corrupt): {skipped}")
print(f"Image bytes saved: {saved:,}")
print(f"Pages artifact size: {total:,} bytes ({total / 1024 / 1024:.1f} MiB)")
if total > LIMIT:
    raise SystemExit("Optimized site is still too large for a safe GitHub Pages deployment.")
