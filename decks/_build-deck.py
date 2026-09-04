# -*- coding: utf-8 -*-
"""Build the Al Nimr slide deck.

Drop the real Al Nimr logo in this folder as `alnimr_logo.png` (or .jpg) and
re-run. Until it is there, the client mark falls back to a plain type lockup.
"""
import base64, io, os, re
from PIL import Image

MEDIA = 'pptx_x/ppt/media'

def data_uri(path, maxh, maxw, colors=64, flatten=True):
    im = Image.open(path).convert('RGBA')
    if flatten:
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        im = bg.convert('RGB')
        box = im.point(lambda p: 255 if p < 246 else 0).convert('L').getbbox()
        if box:
            im = im.crop(box)
    else:
        im = im.crop(im.getbbox() or (0, 0, im.width, im.height))
    r = min(maxh / im.height, maxw / im.width, 4)
    im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    out = im.quantize(colors=colors) if im.mode == 'RGB' else im
    buf = io.BytesIO()
    out.save(buf, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

REFS = [
    ('ASGC', 'image117.jpeg'), ('Gulf Precast', 'image118.png'), ('Lamprell', 'image126.png'),
    ('Petrochem', 'image124.png'), ('Union Paper Mills', 'image123.png'), ('M.A.H.Y. Khoory & Co', 'image121.jpeg'),
    ('Al Hathboor', 'image116.png'), ('Western Bainoona Group', 'image145.png'), ('Al Dahra', 'image143.jpeg'),
    ('Mai Dubai', 'image144.png'), ('Dubai World Trade Centre', 'image111.png'),
    ('Hamad International Airport', 'image149.png'), ('Toshiba', 'image130.png'), ('flydubai', 'image169.png'),
    ('First Abu Dhabi Bank', 'image141.png'), ('Al Jadeed Bakery', 'image122.png'),
]

gerab = data_uri(os.path.join(MEDIA, 'image3.png'), 180, 180, colors=32)
refs = '\n'.join(
    '      <img class="ref" src="%s" alt="%s" title="%s">' % (data_uri(os.path.join(MEDIA, fn), 76, 210), name, name)
    for name, fn in REFS
)

FALLBACK_SM = '<span class="cl-txt"><b>AL NIMR STEEL</b><i>TRADING LLC</i></span>'
FALLBACK_LG = ('<div class="cl-txt lg"><b>AL NIMR STEEL</b><i>TRADING LLC</i>'
               '<u lang="ar">النمر لتجارة '
               'الحديد ذ.م.م</u></div>')

client = next((p for p in ('alnimr_logo.png', 'alnimr_logo.jpg', 'alnimr_logo.jpeg') if os.path.exists(p)), None)
if client:
    sm = '<img class="cl" src="%s" alt="Al Nimr Steel Trading LLC">' % data_uri(client, 60, 320, colors=128)
    lg = ('<img class="cl" style="height:58px" src="%s" alt="Al Nimr Steel Trading LLC">'
          % data_uri(client, 140, 700, colors=200))
    print('client logo: embedded from', client)
else:
    sm, lg = FALLBACK_SM, FALLBACK_LG
    print('client logo: NOT FOUND, using type lockup (drop alnimr_logo.png here and re-run)')

def photo_uri(path, maxw, quality=80):
    """Downscale a photo or scan and return a JPEG data URI."""
    im = Image.open(path)
    if im.mode in ('RGBA', 'LA', 'P'):
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im.convert('RGBA'), mask=im.convert('RGBA').split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=quality, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode(), len(buf.getvalue())


def find(*stems):
    for stem in stems:
        for ext in ('.jpg', '.jpeg', '.png', '.webp'):
            if os.path.exists(stem + ext):
                return stem + ext
    return None


yard = find('yard', 'steelyard', 'hero')
if yard:
    uri, n = photo_uri(yard, 1900, 78)
    hero = '<div class="shot" style="background-image:url(%s)"></div>' % uri
    print('hero photo: %s embedded, %d KB' % (yard, n // 1024))
else:
    hero = '<div class="shot none"></div>'
    print('hero photo: NOT FOUND, using gradient (drop yard.jpg here and re-run)')

mtc = find('mtc', 'certificate', 'cert')
if mtc:
    uri, n = photo_uri(mtc, 1500, 84)
    thumb, _ = photo_uri(mtc, 760, 80)
    mtc_html = ('<div class="sheet" style="background-image:url(%s)" data-full="%s" '
                'role="button" tabindex="0" aria-label="Enlarge the mill test certificate"></div>' % (thumb, uri))
    mtc_cap = 'Example mill test certificate. Click to enlarge.'
    print('certificate: %s embedded, %d KB' % (mtc, n // 1024))
else:
    mtc_html = '<div class="sheet none">Mill test certificate<br>image goes here</div>'
    mtc_cap = 'Example mill test certificate.'
    print('certificate: NOT FOUND, using placeholder (drop mtc.png here and re-run)')

html = open('deck2_template.html', encoding='utf-8').read()
html = (html.replace('{{GERAB}}', gerab)
            .replace('{{ALNIMR_SM}}', sm)
            .replace('{{ALNIMR_LG}}', lg)
            .replace('{{REFS}}', refs)
            .replace('{{HERO}}', hero)
            .replace('{{MTC}}', mtc_html)
            .replace('{{MTCCAP}}', mtc_cap))
assert '{{' not in html, 'unreplaced placeholder'
open('alnimr-wms-deck.html', 'w', encoding='utf-8').write(html)

bad = [d for d in ('—', '–', '&mdash;', '&ndash;') if d in html]
print('written %d KB; dash check: %s' % (len(html) // 1024, bad or 'clean'))
