import base64, re, os
OUT = '/home/user/hero/presentations/aaraamam-business-central/deck.html'
def uri(p):
    ext = os.path.splitext(p)[1].lower()
    mime = {'.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg'}[ext]
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p,'rb').read()).decode())

tok = {
    'GERAB':    uri('assets/gl_Gerab_System_Solutions.png'),
    'CLIENT':   uri('assets/cl_aaraamam.png'),
    'SHOT':     uri('assets/cover_shot.jpg'),
    'FLOW':     uri('assets/inline_flow.jpg'),
    'FLOWFULL': uri('assets/full_flow.jpg'),
}
for f in sorted(os.listdir('assets')):
    if f.startswith('ref_'):
        tok['REF_' + f[4:].rsplit('.',1)[0]] = uri('assets/' + f)

head = open('head.html', encoding='utf8').read()
body = open('body-template.html', encoding='utf8').read()

missing = set(re.findall(r'\{\{(\w+)\}\}', body)) - set(tok)
if missing: raise SystemExit('unresolved tokens: ' + ', '.join(sorted(missing)))
for k, v in tok.items():
    body = body.replace('{{%s}}' % k, v)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf8').write(head + '\n' + body)
print('wrote %s  %.1f KB' % (OUT, os.path.getsize(OUT)/1024))
