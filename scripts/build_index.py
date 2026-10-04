"""Write index.html: inlines Phosphor icons and lists every data file in load order.

Run from the tapeout folder after adding a data file:  python scripts/build_index.py
"""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, 'vendor', 'icons')


def icon(name):
    with open(os.path.join(ICONS, name + '.svg'), encoding='utf-8') as f:
        svg = f.read()
    svg = re.sub(r'<svg[^>]*>', '<svg class="ico" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">', svg, count=1)
    return svg


NAV = [
    ('plan', '#/plan', 'list-checks', 'Weekly plan', None),
    ('home', '#/', 'cpu', 'Die map', None),
    ('learn', '#/learn', 'book-open', 'Learn', 'learn'),
    ('bank', '#/bank', 'list-checks', 'Answer bank', 'bank'),
    ('drill', '#/drill', 'target', 'Drill', 'drill'),
    ('mock', '#/mock', 'microphone-stage', 'Mock interview', None),
    ('code', '#/code', 'code', 'Code corner', 'code'),
    ('sheets', '#/sheets', 'cards', 'Sheets', None),
    ('stories', '#/stories', 'chat-text', 'Stories', None),
    ('sources', '#/sources', 'books', 'Sources', None),
]


def main():
    data = sorted(os.path.basename(p) for p in glob.glob(os.path.join(ROOT, 'data', '*.js')))
    first = ['domains.js']
    last = ['vault.js', 'slides.js', 'studio-bridge.js', 'references.js']
    middle = [d for d in data if d not in first + last]
    nav = '\n'.join(
        f'        <li><a href="{h}" data-nav="{k}">{icon(ic)}<span>{label}</span>' + (f'<span class="count" data-count="{c}"></span>' if c else '<span></span>') + '</a></li>'
        for k, h, ic, label, c in NAV)
    scripts = ['vendor/katex/katex.min.js', 'vendor/marked.js', 'js/core.js', 'js/plots.js', 'js/question.js'] + \
        [f'data/{d}' for d in first + middle + last] + ['js/views.js', 'js/practice.js', 'js/code.js', 'js/plan.js', 'js/app.js']
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GBVirtuoso</title>
<meta name="description" content="A circuit, ASIC and VLSI learning platform: lessons, an answer bank, drills, mock interviews and a coding corner.">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/app.css">
<script>try{{var s=JSON.parse(localStorage.getItem('tapeout.v1')||'{{}}').settings||{{}};var t=s.theme||'auto';document.documentElement.dataset.theme=(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))?'dark':'light'}}catch(e){{}}</script>
</head>
<body>
<div class="shell">
  <aside class="rail" aria-label="Main navigation">
    <a class="mark" href="#/"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="3" y="3" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="7" width="8" height="8" fill="var(--accent)"/></svg><b>GBVirtuoso</b><span>circuit learning</span></a>
    <button class="cmdk-btn" data-open-search>{icon('magnifying-glass').replace('class="ico"', 'class="ico" width="16" height="16"')}<span style="flex:1;text-align:left">Search</span><kbd>Ctrl K</kbd></button>
    <nav><ul class="nav">
{nav}
    </ul></nav>
    <div class="rail-foot"><a class="nav-set" href="#/settings" style="color:inherit">Settings and backup</a><span id="year"></span></div>
  </aside>
  <div class="main">
    <header class="topbar"><a class="mark" href="#/"><svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true"><rect x="3" y="3" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="7" width="8" height="8" fill="var(--accent)"/></svg><b>GBVirtuoso</b></a>
      <div class="row"><button class="btn quiet sm" data-open-search aria-label="Search">{icon('magnifying-glass').replace('class="ico"', 'class="ico" width="18" height="18"')}</button><button class="btn ghost sm" id="menu" aria-expanded="false" aria-label="Open menu">{icon('list').replace('class="ico"', 'class="ico" width="18" height="18"')}</button></div></header>
    <main id="main" tabindex="-1"></main>
  </div>
</div>
<dialog id="cmdk" class="cmdk" aria-label="Search"><input type="search" placeholder="Search lessons, questions, labs, terms..." aria-label="Search everything"><ul role="listbox"></ul></dialog>
<dialog id="zoom" class="zoom" aria-label="Enlarged figure"><img alt=""><div class="zbar"><span class="zcap"></span><span>Click anywhere to close</span></div></dialog>
<div id="toast" class="toast" role="status" hidden></div>
{chr(10).join(f'<script src="{s}"></script>' for s in scripts)}
</body>
</html>
'''
    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print('index.html written with', len(middle), 'content files')


if __name__ == '__main__':
    main()
