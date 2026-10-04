"""Build data/vault.js and data/slides.js from the earlier study-studio exports.

The vault holds every question that was extracted from the user's own study
material (EECS 427/627 lecture books, the drill book, the core interview bible,
the scripting companion). Each item is re-tagged into Tapeout's 16 domains,
cleaned of book-only directives, and merged with its multiple-choice adaptation
when one exists. Nothing is invented here; text is carried over.

Run from the tapeout folder:  python scripts/build_vault.py
"""
import json, re, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OLD = os.path.join(ROOT, 'archive', 'study-studio', 'dist')
SRC_MD = os.path.join(ROOT, 'archive', 'study-studio', 'source-bible', 'src')


def load(name):
    with open(os.path.join(OLD, name), encoding='utf-8') as f:
        return json.load(f)


SOURCE_LABEL = {
    'core': 'Circuit Design Interview Bible',
    'drills': 'Drill Book',
    'eecs427': 'EECS 427 lecture book',
    'eecs627': 'EECS 627 lecture book',
    'scripting': 'Scripting Companion',
    'ext': 'Earlier studio extension',
}

DIAGRAMS = {os.path.splitext(f)[0] for f in os.listdir(os.path.join(ROOT, 'assets', 'fig', 'diagrams'))}

DASH = re.compile(r'\s*—\s*')


def dedash(s):
    """Visible copy carries no em/en dashes (taste-skill rule)."""
    if not s:
        return s
    s = DASH.sub(' - ', s)
    s = re.sub(r'(?<=\w)–(?=\w)', '-', s)
    s = s.replace('–', '-')
    return s


def convert_md(text, prompt=''):
    if not text:
        return ''
    lines = text.replace('\r', '').split('\n')
    out = []
    i = 0
    while i < len(lines):
        ln = lines[i]
        m = re.match(r'^!!!\s+(\w+)\s+"([^"]*)"\s*$', ln)
        if m:
            kind, title = m.group(1), m.group(2)
            body = []
            i += 1
            while i < len(lines) and (lines[i].startswith('    ') or lines[i].strip() == ''):
                if lines[i].strip() == '' and i + 1 < len(lines) and not lines[i + 1].startswith('    '):
                    break
                body.append(lines[i][4:])
                i += 1
            kind = {'star': 'core', 'value': 'value'}.get(kind, kind)
            out.append(f'<div class="co co-{kind}"><p class="co-t">{title}</p>\n\n' + '\n'.join(body).strip() + '\n\n</div>')
            continue
        m = re.match(r'^DIAGRAM:(\w+)', ln)
        if m:
            name = m.group(1)
            if name in DIAGRAMS:
                out.append(f'![{name} diagram](assets/fig/diagrams/{name}.svg)')
            i += 1
            continue
        m = re.match(r'^FIG2?:([^|]+)\|?(.*)$', ln)
        if m:
            cap = m.group(2).strip()
            if cap:
                out.append(f'<div class="co co-sketch"><p class="co-t">Sketch it yourself</p>\n\n{cap}\n\n</div>')
            i += 1
            continue
        ln = re.sub(r'\{:\s*[^}]*\}', '', ln)
        out.append(ln)
        i += 1
    s = '\n'.join(out).strip()
    # Drop a leading echo of the prompt ("6. **(Exam 2 ...) prompt?** answer")
    m = re.match(r'^\s*\d+\.\s+\*\*(.+?)\*\*\s*(?:[—-]\s*)?', s, re.S)
    if m and prompt and m.group(1).strip()[:25].lower() == prompt.strip()[:25].lower():
        s = s[m.end():]
    return dedash(s).strip()


def clean_prompt(p):
    p = re.sub(r'\{:\s*[^}]*\}', '', p or '')
    p = re.sub(r'\s+(T1|T2|T3|RÉSUMÉ)\s*$', '', p.strip())
    return dedash(p.strip())


def has(s, *words):
    s = s.lower()
    return any(w in s for w in words)


PERSONAL = re.compile(r'^(D2\.|B2\.|A\d\.|C2\.|D\d+\.|Q1\.|Q2\.|Q3\.|Q16|Q17|Q18|Q19|Q20|NODE|Skills|"|F1\.\d)')
COMPANY = re.compile(r'nvidia|santa clara|rom team|new college grad|what node will you work on|what do you know about this role', re.I)


def domain_for(q, src):
    t = (q.get('title', '') + ' ' + q.get('prompt', '')).lower()
    topic = q.get('topic', '')
    title = q.get('title', '')
    if src == 'core' and (topic in ('projects', 'behavioral') or PERSONAL.match(title)):
        if 'mbist' in t:
            return 'flow'
        return 'story'
    if src == 'scripting' or topic == 'scripting':
        if has(t, 'keeper'):
            return 'mem'
        return 'code'
    if src == 'ext':
        return {'analog': 'ana', 'physical': 'flow'}.get(topic, 'cdc' if has(t, 'cross', 'reset', 'payload', 'synchron') else 'rtl')
    if has(t, 'metastab', 'synchroniz', 'mtbf', 'regeneration', 'clock domain', 'τr', 'τr'):
        return 'cdc'
    if has(t, 'compute-in-memory', 'cim', '8t cell', 'accumulation', 'local compute cell', 'digital cim', 'off-chip memory'):
        return 'mem'
    if topic in ('rom', 'sram'):
        if has(t, 'em and ir', 'black'):
            return 'int'
        if has(t, 'pelgrom', 'high sigma', 'variation'):
            return 'var'
        return 'mem'
    if has(t, 'antenna', 'drc', 'lvs', 'dummy-gate', 'scan', 'stuck-at'):
        return 'flow'
    if has(t, 'latch-up', 'nbti', 'hci', 'seu', 'particle', 'ser ', 'ser robust', 'fit', 'razor', 'canary', 'avfs', 'dvfs', 'monte carlo', 'cmp stand', 'manufacturing uncertaint', 'rdf', 'patterning', 'aging', 'lvf'):
        return 'var'
    if has(t, 'crosstalk', 'aggressor', 'victim', 'repeater', 'wire', 'elmore delay, and', 'inductance', 'skin depth', 'decap', 'impedance target', 'l·di/dt', 'di/dt', 'electromigration', ' em ', 'em and ir', 'ir drop', 'em passes', 'power-grid', 'power grid', 'glitch is fatal', 'glitch fatal', 'average, rms', 'π-model', 'l-model', 'bitlines'):
        return 'int'
    if topic == 'advanced':
        return 'dev'
    if topic == 'characterization' or has(t, 'characteriz', '.lib', 'liberty', 'track height', 'library', 'silicon'):
        return 'char'
    if topic == 'arithmetic':
        return 'arith'
    if topic == 'timing':
        if has(t, 'level shifter', 'level-shifter'):
            return 'pwr'
        return 'seq'
    if topic == 'lowpower':
        if has(t, 'nand2 from', 'logical effort'):
            return 'cmos' if 'nand2 from' in t else 'dly'
        return 'pwr'
    if topic == 'delay':
        return 'dly'
    if topic == 'statistics':
        if has(t, 'aggressor', 'noise', 'gain point'):
            return 'int'
        return 'var'
    if topic == 'reliability':
        if has(t, 'nbti'):
            return 'var'
        return 'int'
    if topic == 'layout':
        return 'cmos'
    if topic == 'devices':
        if has(t, 'dibl', 'tunneling', 'mosfet fundamentals', 'pmos slower', 'pmos is slower'):
            return 'dev'
        if has(t, 'standard cell', 'track', 'bring', 'multi-bit', 'library'):
            return 'char'
        if has(t, 'access time', 'precharge and wordline', 'firmware'):
            return 'mem'
        if has(t, 'logical and electrical effort', 'inverter delay', 'ring oscillator'):
            return 'dly'
        return 'cmos'
    return 'cmos'


TITLE_FIX = {
    'Phase alignment in adiabatic logic': 'pwr',
    'Why pseudo-NMOS has a nonzero low': 'cmos',
    'Percentage power reduction': 'pwr',
    'Common-mode motion across a decap': 'int',
    'Domino keeper sizing window': 'cmos',
    'Driver plus distributed-wire Elmore moment': 'int',
    'Temperature inversion': 'dev',
}


def level_for(q, src):
    tier = q.get('tier', '')
    if src == 'eecs627' or tier == 'Depth':
        return 3
    if src == 'core' and re.match(r'^Q\d', q.get('title', '')):
        return 1
    return 2


def main():
    mp = load('markdown-practice.json')['questions']
    ext = load('platform-extensions.json')['questions']
    content = load('content.json')['questions']
    over = load('mcq-overrides.json')['questions']
    for i in (1, 2, 3):
        for q in load(f'mcq-batch-{i}.json'):
            over.setdefault(q['id'], q)

    pool = {}
    for q in mp:
        pool[q['id']] = (q, q['sourceIds'][0])
    for q in ext:
        pool[q['id']] = (q, 'ext')
    extra = 0
    for q in content:
        if q['id'] not in pool and q.get('sourceIds') and q['sourceIds'][0] in SOURCE_LABEL and q.get('answer'):
            pool[q['id']] = (q, q['sourceIds'][0])
            extra += 1

    items = []
    counts = collections.Counter()
    for n, (qid, (q, src)) in enumerate(pool.items()):
        d = domain_for(q, src)
        prompt = clean_prompt(q.get('prompt') or q.get('title'))
        answer = convert_md(q.get('answer', ''), q.get('prompt', ''))
        it = {
            'id': 'V' + str(n + 1).zfill(3),
            'k': qid,
            'd': d,
            'lvl': level_for(q, src),
            'f': 'short',
            'title': clean_prompt(q.get('title', '')),
            'q': prompt,
            'a': answer,
            'src': SOURCE_LABEL.get(src, src),
        }
        if q.get('hint'):
            it['hint'] = dedash(q['hint'])
        if q.get('trap'):
            it['trap'] = dedash(q['trap'])
        if q.get('followup'):
            it['fu'] = [dedash(q['followup'])]
        if d == 'story':
            it['personal'] = True
            it['f'] = 'oral'
        if COMPANY.search(q.get('title', '') + ' ' + q.get('prompt', '')):
            it['company'] = 'NVIDIA'
        o = over.get(qid)
        if o and o.get('choices') and d != 'story':
            it['f'] = 'mcq'
            it['q'] = dedash(o['prompt'])
            it['title'] = dedash(o.get('title') or it['title'])
            it['opts'] = [dedash(c) for c in o['choices']]
            it['ans'] = o['correct']
            it['why'] = [dedash(c) for c in o.get('choiceExplanations', [])]
            it['ex'] = dedash(o.get('mcqExplanation', ''))
            if o.get('hint'):
                it['hint'] = dedash(o['hint'])
            it['oral'] = dedash(o.get('oralPrompt') or prompt)
        d = TITLE_FIX.get(it['title'], d)
        it['d'] = d
        counts[d] += 1
        items.append(it)

    out = os.path.join(ROOT, 'data', 'vault.js')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('/* Generated by scripts/build_vault.py from the user\'s study exports. Do not edit by hand. */\n')
        f.write('window.TAPEOUT_VAULT = ')
        json.dump(items, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print('vault items', len(items), 'extra from content.json', extra)
    print(dict(counts))
    print('mcq', sum(1 for i in items if i['f'] == 'mcq'), 'company', sum(1 for i in items if i.get('company')))

    # Slides: captioned original lecture images, grouped by lecture
    sf = load('source-figures.json')['slides']
    titles = {}
    for book, key in (('eecs427_lectures', '427'), ('eecs627_lectures', '627')):
        with open(os.path.join(SRC_MD, book + '.md'), encoding='utf-8') as f:
            for m in re.finditer(r'^## Lecture (\d+)\s+\S+\s+(.+)$', f.read(), re.M):
                titles[f'{key}-{int(m.group(1))}'] = m.group(2).strip()
    slides = []
    for sid, s in sf.items():
        key = '427' if s['book'].startswith('eecs427') else '627'
        m = re.match(r'[lm](\d+)_p(\d+)', s['name'])
        if not m:
            continue
        lec = f'{key}-{int(m.group(1))}'
        page = s['sourceRefs'][0]['page'] if s.get('sourceRefs') else None
        slides.append({'lec': lec, 'f': s['file'].replace('figures/', 'assets/fig/'), 'cap': dedash(s['caption']), 'pg': page, 'w': s.get('width'), 'h': s.get('height')})
    slides.sort(key=lambda x: (x['lec'].split('-')[0], int(x['lec'].split('-')[1]), x['pg'] or 0))
    with open(os.path.join(ROOT, 'data', 'slides.js'), 'w', encoding='utf-8') as f:
        f.write('/* Original EECS 427/627 lecture figures with verified captions (generated). */\n')
        f.write('window.TAPEOUT_LECTURES = ')
        json.dump(titles, f, ensure_ascii=False)
        f.write(';\nwindow.TAPEOUT_SLIDES = ')
        json.dump(slides, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print('slides', len(slides), 'lectures', len(titles))


if __name__ == '__main__':
    main()
