#!/usr/bin/env python3
"""Generate favicons and social metadata images from public/gradient_image.avif."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "gradient_image.avif"
APP_DIR = ROOT / "src" / "app"
PUBLIC_DIR = ROOT / "public"

VARIANTS: list[tuple[Path, str]] = [
    (APP_DIR / "favicon.ico", "ico:16,32,48"),
    (APP_DIR / "icon.png", "32x32"),
    (APP_DIR / "apple-icon.png", "180x180"),
    (PUBLIC_DIR / "icon-192.png", "192x192"),
    (PUBLIC_DIR / "icon-512.png", "512x512"),
    (PUBLIC_DIR / "og-image.png", "1200x630^"),
]


def run_magick(args: list[str]) -> None:
    magick = shutil.which("magick") or shutil.which("convert")
    if not magick:
        raise RuntimeError("ImageMagick (magick/convert) is required but not found on PATH")

    command = [magick, *args]
    subprocess.run(command, check=True)


def generate_variant(destination: Path, geometry: str) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    if destination.suffix == ".ico":
        run_magick(
            [
                str(SOURCE),
                "-resize",
                "48x48",
                "-define",
                f"icon:auto-resize={geometry.removeprefix('ico:')}",
                str(destination),
            ]
        )
        return

    if geometry.endswith("^"):
        size = geometry.removesuffix("^")
        run_magick(
            [
                str(SOURCE),
                "-resize",
                size,
                "-gravity",
                "center",
                "-extent",
                size,
                str(destination),
            ]
        )
        return

    run_magick([str(SOURCE), "-resize", geometry, str(destination)])


def write_manifest() -> None:
    manifest = """{
  "name": "Gaussian Gradient Generator",
  "short_name": "Gradients",
  "description": "Generate smooth Gaussian gradients with customizable distribution, dithering, and CSS export",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#1a1a1a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
"""
    (PUBLIC_DIR / "site.webmanifest").write_text(manifest, encoding="utf-8")


def main() -> int:
    if not SOURCE.is_file():
        print(f"Source image not found: {SOURCE}", file=sys.stderr)
        return 1

    for destination, geometry in VARIANTS:
        print(f"Generating {destination.relative_to(ROOT)} ({geometry})")
        generate_variant(destination, geometry)

    write_manifest()
    print(f"Wrote {PUBLIC_DIR / 'site.webmanifest'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
