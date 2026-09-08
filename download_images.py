#!/usr/bin/env python3
"""
Download all Google Drive images used by the WPC website to imgs/web/.
Run this script from the wpc_website/ directory:
    python3 download_images.py

Requires: pip install Pillow requests
"""
import os, sys, requests, time
from pathlib import Path

try:
    from PIL import Image, ImageOps
    from io import BytesIO
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("⚠  Pillow not installed — images will be saved without compression.")
    print("   Install with: pip install Pillow")

OUT = Path("imgs/web")
OUT.mkdir(parents=True, exist_ok=True)

# All image IDs used across the site
# Format: (file_id, max_width, output_filename_or_None)
# If output_filename is None, uses file_id.jpg
IMAGES = [
    # === Splash background ===
    ("1RbbqevU8LwwauUS1pct3OJ3ERcl1w8Kt", 1920, "splash-bg.jpg"),

    # === index.html (home page) — profile & skill cards ===
    ("1H8cfLe6etziZYxbMBJC6BO2zcjhKFwME", 800, None),   # profile photo
    ("1MHtkS5dd_oe3BkMysLvjvMQMQDvUjSL_", 600, None),   # programming
    ("1OgdJyv5owRvho7zou49ots24I3VTFHTM", 600, None),   # data analysis
    ("19XKLMEz18iRE0juokyOAGymopLCSrT0h", 600, None),   # software & tools
    ("1ONp1CdscRYKcLmipyxx9jUis16ApgF_i", 600, None),   # research methods
    ("1MXvwEGAzuvjh9rJ-l7To6fspfrRIX-TO", 600, None),   # geospatial data
    ("1hauuiwPEf-efVLKqUrBJc7h52_htRMj8", 600, None),   # biological data
    ("1yAwWKzIXxjpmplDElV4d6PUNLNxwUlQT", 600, None),   # visual data
    ("1DZBcllfFVBLqxRpt1ZBUICvvcD1zb1Qm", 600, None),   # computational data

    # === projects.html ===
    ("1Exxihq3GW0vXpW33fZBvBE2KU7WB5Bvj", 600, None),   # SOS
    ("1pev4bc7jvCoig44S2Acm-nvtJp6NvEHJ", 600, None),   # BioMuse-X
    ("1rgnDTd0Icmy12oVyLRmXnGnsnkfCKtPh", 600, None),   # CropSky
    ("1AHSaBv0woy9g-vauJugfTOerlmszMjUG", 600, None),   # PathoTracter
    ("1pkgFn_Mh-dFkQ7bkGNECNe_UFiJtyAWQ", 600, None),   # wing beat
    ("1ZBZeTvOmOkMWTNqokhT2FfjfcBly_1hp", 600, None),   # light attraction
    ("1a7jy5v7_bW8faBvZnEewJlMGqPf6ivYm", 600, None),   # sexual dimorphism
    ("1C4GhxI5P8BP0UHbObtTlp9tMPd6AEb9p", 600, None),   # eyespot
    ("1pnlb387m3eR5wB8NqueCGHvkK9afnFLk", 600, None),   # sensory organs
    ("1eLV7eXm16pfFf5mFgYQiPPl5IhnfHvf_", 600, None),   # paired wing
    ("1PzhILxW_cy5Hx7tbC_zYvDzWRtM01GMM", 600, None),   # typhoon
    ("18u9VkHaB57YDCq1FnN0Cw0CgiRNQruzN", 600, None),   # seasonal diurnal
    ("1AGz8S0ROL7deJOdqlsuMVvgl69f9QlwC", 600, None),   # climate velocity
    ("1fVwu4eAcYWZHJzG_7lU0Irukz2cPOHTT", 600, None),   # opposite influences
    ("1mbsUv1ADeRGPuClu4tWI9RkrNGj6YfDv", 600, None),   # drought
    ("1mKuLRJ_DYJEaNST_XaZeFuu55_2Ok6o4", 600, None),   # isotope
    ("1hLNXdlZJu7KJ-EFkhJ5ZSxc_OUFaMviF", 600, None),   # blue history
    ("18UluKsiiPTcmyGjmKPyVimT3bMsdY5af", 600, None),   # weather news
    ("1RA80WbUhliwaVL7FOleGpaui-ggBS0Y6", 600, None),   # aurora
    ("1ZgzXgE7GjYfS8uQ0nwXpJUlCJGLKuHPo", 600, None),   # burying beetles

    # === collaborators.html — marquee photos ===
    ("1toQxDijaofIy73EkUnBAeZhD0NiF-bsZ", 800, None),
    ("1SZZpsKK7ACPEkuxQm-VgpUZdAZJ18bNs", 800, None),
    ("1fS3zwCIdLqvvV48l2mOsIzEDajs06Aj-", 800, None),
    ("12AOChYFpA89VFv-s585YwmR2aT1pr4-E", 800, None),
    ("1SBZ2nfbURDJ1ZdQCYObke0RyIYspyYqB", 800, None),
    ("1traecx9-ZQMdXyoSFyscRaQo6AUQaj07", 800, None),
    ("1yVmxVk5w92bbRzUmFvUnxN5t2szi9K_-", 800, None),
    ("10aZZM4mS8GOs49obbVJQQBIUt-p4aXvl", 800, None),
    ("1iSiJlJXSBXC-eD3gF-R5-sgTkULUZqBK", 800, None),
    ("1uoYtGjcLYDgWitLbTHeVjjWU-s73OmIK", 800, None),
    ("1g3p4H9Ts5q5bdfLbor5ruWohxnbObBRs", 800, None),
    ("1qARk7X7cqdsy9g1Y4_rRD-0SZd5g2qPe", 800, None),
    ("1rvqb7Cig13XimwQs_V3GMAj_vtTWChFh", 800, None),
    ("1yCZDdGWyd097uFis9MaQQL3XpfefFSUg", 800, None),
    ("1ninkwzYrVZcvPnsCPvsvXH2zoj_6KMo-", 800, None),
    ("15FFYfI3nKzGY1xYjm6SMDl42uUBXWIiP", 800, None),
    ("1GPAP_Pbb1yFBmdTgz9b7SIqzl6FYEq5m", 800, None),
    ("1qX5xYqG04pJ8atZAOOgdUJzvKfFjI59z", 800, None),
    ("1Gu84b5C20dAMPk5u7Dm7Bm7ms0MFgLwv", 800, None),
    ("1SiS3IeVLtW8q3Tfxtl2JD2_vtaGqohwW", 800, None),
    ("1iMPl9wcyu7I0gYetAHmgjRNRTgoh7vSX", 800, None),
    ("1mD7zOa2_LJmxQ8OMEBv9uKzWqgS4nEGC", 800, None),
    ("1V-nPXC0XJGvcwGgI7YCc3LKDAxV3Au4_", 800, None),
    ("1xSjHLQYBXKiD5_2jkHt05DhrSO7eTPxs", 800, None),
    ("15G39m_ZAETmePvLVbGDo95ILq9EBEtb6", 800, None),
    ("1uuGkBj5Zrj16_JpebGWRhvKO9WAPwrzm", 800, None),
    ("11_BcBE09Aus3TAKojsEJstGdrD0TRFM7", 800, None),
    ("1VCbz4b1h4lUn46W3eWhrQUYvvDEropSQ", 800, None),
    ("1DiQZB1swHIBwo69kxFLbsXib07vdwtqH", 800, None),
    ("1GKBXpMhiUZgSCnLfZm98nAszCdT1stHa", 800, None),
    ("1Y9WbsFHA0Wg-pbJ8hqI7JpdMdVK4hhr7", 800, None),
    ("1llSxSRioHLm7WMnG_azUo1-4nVB9A_3i", 800, None),
    ("150iS6oQqqhsHJUT9egtWC-1xeS6joDC1", 800, None),
    ("1E8wsaeA9lPEZymgULvwtZZxJkPSEygAr", 800, None),
    ("1fJeAGEfITnvtQSVmTvAcO6luM_-mV1_V", 800, None),
    ("1XtxpO0sGigDVRs7_RYKU7PfZquEkTjO4", 800, None),
    ("1gElmGxUaw-MTBV45kHKhcotEw4F4-vxP", 800, None),
]

def download_one(fid, max_w, outname):
    fname = outname or f"{fid}.jpg"
    dest = OUT / fname
    if dest.exists():
        print(f"  ✓ {fname} (already exists, skipping)")
        return True

    # Google Drive direct download URL
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    try:
        r = requests.get(url, timeout=30, allow_redirects=True)
        if r.status_code != 200 or len(r.content) < 1000:
            # Try thumbnail API as fallback
            url2 = f"https://drive.google.com/thumbnail?id={fid}&sz=s{max_w}"
            r = requests.get(url2, timeout=30, allow_redirects=True)
        if r.status_code != 200:
            print(f"  ✗ {fname} — HTTP {r.status_code}")
            return False
        if HAS_PIL:
            img = Image.open(BytesIO(r.content))
            img = ImageOps.exif_transpose(img)  # fix rotation from EXIF
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            w, h = img.size
            if w > max_w:
                ratio = max_w / w
                img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
            img.save(dest, 'JPEG', quality=85, optimize=True)
        else:
            dest.write_bytes(r.content)
        size_kb = dest.stat().st_size / 1024
        print(f"  ✓ {fname} ({size_kb:.0f} KB)")
        return True
    except Exception as e:
        print(f"  ✗ {fname} — {e}")
        return False

if __name__ == "__main__":
    print(f"Downloading {len(IMAGES)} images to {OUT}/")
    print("=" * 50)
    ok = fail = 0
    for fid, max_w, outname in IMAGES:
        if download_one(fid, max_w, outname):
            ok += 1
        else:
            fail += 1
        time.sleep(0.3)  # gentle rate limiting
    print("=" * 50)
    print(f"Done: {ok} downloaded, {fail} failed")
    if fail:
        print("Re-run the script to retry failed downloads.")
