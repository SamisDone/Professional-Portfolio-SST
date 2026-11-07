"""
Rebuilds the two font files in src/fonts from the upstream variable TTFs.

    python scripts/subset-fonts.py Archivo[wdth,wght].ttf MartianMono[wdth,wght].ttf

Both come from github.com/google/fonts (ofl/archivo, ofl/martianmono), under
the SIL Open Font License 1.1; the licence files sit beside the output.

What it does, and why:

  Archivo       stays variable, cut to weight 400 to 900 and width 100 to
                125, the only ranges the type scale uses. Every heading, the
                display name and the body copy come out of this one file.
  Martian Mono  pinned to a static instance at weight 500 and width 87.5,
                because the Label step is the only place it is used.
  Martian Mono  Narrow: a second static instance at weight 500 and width 75,
                for the proof row's domain lines on phones, cut to the
                characters a domain line can hold. Browsers fetch it only
                when a rule uses it, and only a phone-width rule does.

Both are subset to Latin plus the punctuation the copy uses. Neither family
has the north-east arrow, so arrows are drawn as SVG (src/components/Arrow.tsx)
rather than set as text. Needs fontTools and brotli: pip install fonttools brotli
"""

import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,"
    "U+2010-2011,U+2018-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,"
    "U+20AC,U+2122,U+2212"
)
FEATURES = ["kern", "liga", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum", "case", "rvrn"]


def save_subset(font, out):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    subsetter = subset.Subsetter(opts)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    subset.save_font(font, out, opts)


# What a domain line can hold: letters (shown upper case), digits, the dot,
# the hyphen and the slash of an internal path.
NARROW_UNICODES = "U+0020,U+002D-002F,U+0030-0039,U+0041-005A,U+005F,U+0061-007A,U+00A0"


def save_narrow(martian, out="src/fonts/MartianMono-Narrow.woff2"):
    m = instancer.instantiateVariableFont(TTFont(martian), {"wght": 500, "wdth": 75})
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    subsetter = subset.Subsetter(opts)
    subsetter.populate(unicodes=subset.parse_unicodes(NARROW_UNICODES))
    subsetter.subset(m)
    subset.save_font(m, out, opts)


def main(archivo, martian):
    a = instancer.instantiateVariableFont(TTFont(archivo), {"wght": (400, 900), "wdth": (100, 125)})
    save_subset(a, "src/fonts/Archivo.woff2")

    m = instancer.instantiateVariableFont(TTFont(martian), {"wght": 500, "wdth": 87.5})
    save_subset(m, "src/fonts/MartianMono-Label.woff2")

    save_narrow(martian)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
