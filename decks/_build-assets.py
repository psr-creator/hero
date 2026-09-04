# -*- coding: utf-8 -*-
gerab = open('gerab_logo.txt').read().strip()
refs  = open('refs.html').read()

STRIPES = ('<defs><clipPath id="{cid}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"></rect></clipPath></defs>'
 '<g clip-path="url(#{cid})"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#F2A31C"></rect>'
 '<g fill="#141414"><path d="M{a1} {y} l{sw} 0 l-{sk} {h} l-{sw} 0 z"></path>'
 '<path d="M{a2} {y} l{sw2} 0 l-{sk} {h} l-{sw2} 0 z"></path>'
 '<path d="M{a3} {y} l{sw} 0 l-{sk} {h} l-{sw} 0 z"></path></g></g>')

def mark(cid, x, y, w, h, r, sk, aa, sws):
    return STRIPES.format(cid=cid, x=x, y=y, w=w, h=h, r=r, sk=sk,
                          a1=aa[0], a2=aa[1], a3=aa[2], sw=sws[0], sw2=sws[1])

ARCHIVO = 'Archivo, Helvetica Neue, Arial, sans-serif'
PLEXMONO = 'IBM Plex Mono, monospace'

small = ('<svg viewBox="0 0 180 32" width="180" height="32" role="img" aria-label="Al Nimr Steel Trading LLC" '
 'style="height:28px;width:auto;display:block;flex:none">'
 + mark('anst_s', 0, 3, 26, 26, 3, 7, (5, 13, 21), (4, 3))
 + '<text x="34" y="16" font-family="' + ARCHIVO + '" font-weight="800" font-size="13.5"'
   ' letter-spacing="-0.2" fill="var(--ink)">AL NIMR STEEL</text>'
   '<text x="34.5" y="27.5" font-family="' + PLEXMONO + '" font-size="8" letter-spacing="1.7"'
   ' fill="var(--muted)">TRADING LLC</text></svg>')

large = ('<svg viewBox="0 0 250 48" width="250" height="48" role="img" aria-label="Al Nimr Steel Trading LLC" '
 'style="height:44px;width:auto;display:block;flex:none">'
 + mark('anst_l', 0, 4, 40, 40, 4, 11, (8, 20, 32), (7, 5))
 + '<text x="52" y="24" font-family="' + ARCHIVO + '" font-weight="800" font-size="20"'
   ' letter-spacing="-0.4" fill="var(--ink)">AL NIMR STEEL</text>'
   '<text x="53" y="38" font-family="' + PLEXMONO + '" font-size="9" letter-spacing="2.4"'
   ' fill="var(--muted)">TRADING LLC</text></svg>')

html = open('deck_template.html', encoding='utf-8').read()
html = (html.replace('{{GERAB}}', gerab)
            .replace('{{ALNIMR_SM}}', small)
            .replace('{{ALNIMR_LG}}', large)
            .replace('{{REFS}}', refs))
assert '{{' not in html, 'unreplaced placeholder'
open('steel-yard-wms.html', 'w', encoding='utf-8').write(html)
print('written', len(html) // 1024, 'KB · svgs:', html.count('aria-label="Al Nimr Steel Trading LLC"'))
