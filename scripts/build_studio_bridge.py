"""Restore the complete active learning catalogue in Tapeout's native schema.

Normal builds use only checked-in scripts/source-inputs/studio.json and local
assets. To intentionally refresh the snapshot, use --import-from PATH_TO_DIST.
The snapshot follows the previous app's actual active-question filter and MCQ
overrides, rather than guessing coverage from one intermediate export.
"""
import argparse
import collections
import html
import hashlib
import json
import pathlib
import re
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]
INPUT = ROOT / 'scripts/source-inputs/studio.json'
OUT = ROOT / 'data/studio-bridge.js'
REPORT = ROOT / 'scripts/source-inputs/studio-bridge-audit.json'

MODULE_DOMAIN = {
    'cmos-foundations': 'dev', 'rc-delay': 'dly', 'gate-sizing': 'cmos',
    'gate-power': 'pwr', 'leakage-mechanisms': 'dev', 'logical-effort': 'dly',
    'sram-operation': 'mem', 'sram-margins': 'mem', 'bitline-sensing': 'mem',
    'rom-read-margins': 'mem', 'latch-storage': 'seq', 'setup-hold': 'seq',
    'sequential-characterization': 'char', 'metastability': 'cdc',
    'cdc-protocols': 'cdc', 'physical-layout': 'flow', 'wire-rc': 'int',
    'coupling-noise': 'int', 'power-delivery': 'int', 'em-aging': 'var',
    'spice-testbench': 'char', 'liberty-tables': 'char', 'variation-types': 'var',
    'leakage-characterization': 'char', 'tcl-language': 'code',
    'report-parsing': 'code', 'automation-audit': 'code',
    'low-power-domains': 'pwr', 'adaptive-voltage': 'pwr',
    'compute-in-memory': 'arith', 'rtl-cdc-handshake': 'cdc',
}
TOPIC_DOMAIN = {'devices': 'dev', 'delay': 'dly', 'lowpower': 'pwr',
    'timing': 'seq', 'rom': 'mem', 'sram': 'mem', 'statistics': 'var',
    'reliability': 'var', 'arithmetic': 'arith', 'projects': 'story',
    'scripting': 'code', 'layout': 'flow', 'advanced': 'dev',
    'characterization': 'char', 'analog': 'ana', 'rtl': 'rtl',
    'physical': 'flow', 'spice': 'char'}
SOURCE_NAMES = {'core': 'Circuit Design Interview Bible', 'drills': 'Drill Book',
    'eecs427': 'EECS 427 lecture book', 'eecs627': 'EECS 627 lecture book',
    'scripting': 'Scripting Companion'}

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def capture(old):
    c, x = read(old / 'content.json'), read(old / 'platform-extensions.json')
    overrides = read(old / 'mcq-overrides.json')['questions']
    questions = [q for q in c['questions'] if q['topic'] != 'behavioral' and not
        re.search(r'NVIDIA|TSMC|Bo Li|Chanel|Friday|tell me about yourself', q['prompt'], re.I)] + x['questions']
    questions = [dict(q, **overrides.get(q['id'], {})) for q in questions]
    snap = {'provenance': 'Active Circuit Learning Studio catalogue at commit 9191526',
        'modules': read(old / 'curriculum.json')['modules'] + x['modules'],
        'questions': questions, 'labs': read(old / 'labs.json'),
        'figures': read(old / 'source-figures.json')}
    snap['books'] = [{**{k: b[k] for k in ['id', 'title', 'sourceSha256']},
        'originalFile': b['file'], 'markdown': (old / b['file']).read_text(encoding='utf-8'),
        'sections': [{k: s[k] for k in ['id', 'title', 'level']} for s in b['sections']]}
        for b in read(old / 'markdown-content.json')['books']]
    assert len(questions) == 412 and sum(q['format'] == 'mcq' for q in questions) == 367
    assert len(snap['modules']) == 42 and len(snap['labs']) == 12
    INPUT.parent.mkdir(parents=True, exist_ok=True)
    INPUT.write_text(json.dumps(snap, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for figure in snap['figures']['slides'].values():
        target = ROOT / figure['file'].replace('figures/', 'assets/fig/', 1)
        if not target.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(old / figure['file'], target)

def domain(m):
    return MODULE_DOMAIN.get(m['id'], {'analog': 'ana', 'rtl': 'rtl', 'physical': 'flow'}[m['trackId']] if m['trackId'] in ['analog', 'rtl', 'physical'] else 'dev')

def build():
    src = read(INPUT)
    supplements = read(ROOT / 'scripts/source-inputs/choice-explanations.json')
    figures = src['figures']
    used, gaps = set(), []
    def md(text, book=None, owner=''):
        # Resolve source directives before converting callouts. A missing source
        # image remains an explicit provenance gap, never an invented sketch.
        def figure(match):
            kind, spec = match.group(1), match.group(2)
            rendered = []
            for item in spec.split('||'):
                parts = item.split('|', 1)
                key, caption = parts[0].strip(), parts[1].strip() if len(parts) > 1 else ''
                f = figures['slides'].get(str(book) + ':' + key) if kind.startswith('SLIDE') else figures['diagrams'].get(key) if kind == 'DIAGRAM' else figures['plots'].get(key)
                if not f:
                    gaps.append({'owner': owner, 'kind': kind, 'name': key, 'caption': caption})
                    rendered.append('<div class="co co-guard"><p class="co-t">Source figure unavailable</p>\n\n' +
                        html.escape(key) + ': the original referenced asset was not included in the supplied source bundle. ' + caption + '\n\n</div>')
                    continue
                if kind == 'DIAGRAM':
                    path = 'assets/fig/diagrams/' + key + '.svg'
                    target = ROOT / path
                    if not target.exists():
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_text(f['svg'], encoding='utf-8')
                else:
                    path = f['file'].replace('figures/', 'assets/fig/', 1)
                assert (ROOT / path).is_file(), path
                used.add(path)
                refs = '; '.join(r.get('label', r.get('sourceId', 'Source')) + ' · page ' + str(r['page']) for r in f.get('sourceRefs', []))
                cap = caption or f.get('caption') or key.replace('_', ' ')
                rendered.append('<figure class="fig"><img src="' + html.escape(path, quote=True) + '" alt="' + html.escape(cap, quote=True) + '" loading="lazy"><figcaption>' + html.escape(cap) + (' · ' + html.escape(refs) if refs else ' · Original supplied circuit diagram') + '</figcaption></figure>')
            return '\n\n'.join(rendered)
        text = re.sub(r'^(DIAGRAM|FIG2?|SLIDE2?):([^\n]+)$', figure, text or '', flags=re.M)
        lines, out, i = text.replace('\r', '').split('\n'), [], 0
        while i < len(lines):
            match = re.match(r'^!!!\s+(\w+)\s+"([^"]*)"\s*$', lines[i])
            if match:
                kind, title = match.groups(); body = []; i += 1
                while i < len(lines) and (lines[i].startswith('    ') or not lines[i].strip()):
                    if not lines[i].strip() and i + 1 < len(lines) and not lines[i+1].startswith('    '): break
                    body.append(lines[i][4:] if lines[i].startswith('    ') else ''); i += 1
                kind = {'star': 'core'}.get(kind, kind)
                out.append('<div class="co co-' + kind + '"><p class="co-t">' + html.escape(title) + '</p>\n\n' + '\n'.join(body).strip() + '\n\n</div>')
                continue
            out.append(re.sub(r'\{:\s*[^}]*\}', '', lines[i])); i += 1
        return '\n'.join(out).strip()
    modules = {m['id']: m for m in src['modules']}
    vault_source = (ROOT / 'data/vault.js').read_text(encoding='utf-8')
    existing_domains = {q.get('k', q['id']): q['d'] for q in json.loads(vault_source.split('=', 1)[1].strip().removesuffix(';'))}
    questions = []
    for q in src['questions']:
        qid = q['id']; book = next((s for s in q.get('sourceIds', []) if s in SOURCE_NAMES), None)
        d = domain(modules[q['moduleId']]) if q.get('moduleId') in modules else TOPIC_DOMAIN[q['topic']]
        if d == 'dev' and re.search(r'inverter|nand|nor|cmos|pull.up|pull.down', q['prompt'], re.I): d = 'cmos'
        if q['topic'] == 'projects' and re.search(r'butterfly|ntt|modular|multiplier|adder', q['prompt'], re.I): d = 'arith'
        # Keep Claude's useful, fine-grained technical classification. Its broad
        # heading regex incorrectly treated many technical MCQs as stories;
        # those are deliberately classified from their technical topic instead.
        if existing_domains.get(qid) not in (None, 'story'):
            d = existing_domains[qid]
        elif re.search(r'crosstalk|elmore|power rail|metal segment|wire resistance|decoupling', q['prompt'], re.I): d = 'int'
        elif re.search(r'synchroniz|unrelated clock|metastab', q['prompt'], re.I): d = 'cdc'
        if re.search(r'\b(?:AOI21|OAI21)\b.*siz', q.get('title', ''), re.I): d = 'cmos'
        out = {'id': qid, 'legacyId': qid, 'k': qid, 'd': d, 'lvl': 3 if q['tier'] == 'Depth' else 2,
            'f': 'mcq' if q['format'] == 'mcq' else 'short', 'title': q.get('title', q['prompt']),
            'q': md(q['prompt'], book, qid), 'a': md(q['answer'], book, qid),
            'src': SOURCE_NAMES.get(book, q.get('provenance', 'Earlier studio extension')),
            'tags': [q['topic']] + q.get('keywords', []), 'hint': q.get('hint', ''),
            'trap': q.get('trap', ''), 'fu': [q['followup']] if q.get('followup') else [],
            'oral': q.get('oralPrompt', q['prompt']), 'sourceIds': q.get('sourceIds', []),
            'sourceSectionId': q.get('sourceSectionId'), 'sourceLine': q.get('sourceLine'),
            'references': q.get('references', []), 'bridge': True}
        if q.get('moduleId'): out['u'] = q['moduleId']
        if q['format'] == 'mcq':
            out.update(opts=q['choices'], ans=q['correct'], why=q.get('choiceExplanations') or supplements.get(qid, []), ex=q.get('mcqExplanation', ''))
            assert len(out['opts']) == 4 and 0 <= out['ans'] < 4
            assert len(out['why']) == 4, 'Missing per-choice reasoning: ' + qid
        questions.append(out)
    units = []
    for order, m in enumerate(src['modules']):
        mid = m['id']; source = m.get('source', {}); book = source.get('bookId')
        body = md(m['body'], book, mid)
        checks = [q['id'] for q in questions if q.get('u') == mid][:3]
        if book:
            body += '\n\n### Learning source\nAdapted from [' + SOURCE_NAMES[book] + '](#/reference/' + book + '), section ' + source.get('headingCode', '') + '. Original source text and lecture figures retain their supplied provenance.'
        elif source.get('references'):
            body += '\n\n### Technical references\n' + '\n'.join('- [Technical reference ' + str(i+1) + '](' + r + ')' for i, r in enumerate(source['references']))
        equations = re.findall(r'```latex\s*\n([\s\S]*?)```', m['body'])
        units.append({'id': mid, 'legacyId': mid, 'd': domain(m), 'title': m['title'],
            'order': order+10, 'tier': {'foundation': 1, 'practice': 2, 'depth': 3}[m['tier']],
            'mins': m['minutes'], 'goal': m['objective'], 'body': body,
            'eq': [[e.strip(), 'See the lesson for definitions, assumptions and the worked example.'] for e in equations],
            'tags': m['practiceTopics'], 'checks': checks, 'prerequisites': m['prerequisites'],
            'takeaways': m['takeaways'], 'understandingChecks': m['checks'],
            'labIds': m['labIds'], 'source': source, 'bridge': True})
    labs = []
    for l in src['labs']:
        track = 'parse' if l['id'] in ['crossings', 'manifest', 'audit', 'csv'] else 'algo' if l['id'] == 'butterfly' else 'basics' if l['id'] == 'units' else 'model'
        labs.append({'id': l['id'], 'legacyId': l['id'], 'track': track,
            'level': {'Foundation': 1, 'Intermediate': 2, 'Advanced': 3, 'Project': 3}[l['level']],
            'mins': l['minutes'], 'title': l['title'], 'goal': l['prompt'], 'teach': l['lesson'],
            'task': l['prompt'], 'starter': l['starter'], 'solution': l['solution'],
            'tests': l['tests'], 'hints': l['hints'], 'explain': l['explain'], 'bridge': True})
    references = []
    reference_dir = ROOT / 'assets/references'
    (reference_dir / 'originals').mkdir(parents=True, exist_ok=True)
    for b in src.get('books', []):
        original = reference_dir / 'originals' / (b['id'] + '.md')
        original.write_text(b['markdown'], encoding='utf-8', newline='')
        rendered = reference_dir / (b['id'] + '.md')
        rendered.write_text(md(b['markdown'], b['id'], 'reference:' + b['id']), encoding='utf-8')
        references.append({'id': b['id'], 'title': b['title'],
            'file': rendered.relative_to(ROOT).as_posix(),
            'originalFile': original.relative_to(ROOT).as_posix(),
            'sourceSha256': b['sourceSha256'], 'bundledSha256': hashlib.sha256(original.read_bytes()).hexdigest(),
            'description': 'Archived supplied study reference. Historical interview dates and company context are retained as source context.',
            'sections': b['sections']})
    (ROOT / 'data/references.js').write_text('/* Bundled reference metadata, generated by build_studio_bridge.py. */\nwindow.TAPEOUT_REFERENCES=' + json.dumps(references, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    # Update matches in place: V identifiers and existing Tapeout progress survive.
    # Canonical legacy IDs are carried separately for migration from the old app.
    payload = json.dumps({'units': units, 'questions': questions, 'labs': labs}, ensure_ascii=False, separators=(',', ':'))
    OUT.write_text('/* Generated by scripts/build_studio_bridge.py; edit the captured inputs or generator. */\n(function(){\nconst data=' + payload + ';\nconst T=window.T;\nT.units=T.units.filter(x=>!x.bridge);T.addUnits(data.units);\nT.labs=T.labs.filter(x=>!x.bridge);T.addLabs(data.labs);\nconst vault=(window.TAPEOUT_VAULT||[]).filter(x=>!x.bridge||x.id!==x.legacyId);\nconst index=new Map(vault.map((q,i)=>[q.legacyId||q.k||q.id,i]));\nfor(const q of data.questions){const i=index.get(q.legacyId);if(i!==undefined){vault[i]={...q,id:vault[i].id};}else{index.set(q.legacyId,vault.length);vault.push(q);}}\nconst canonical=new Map(vault.map(q=>[q.legacyId||q.k||q.id,q.id]));for(const u of T.units.filter(x=>x.bridge))u.checks=(u.checks||[]).map(id=>canonical.get(id)||id);\nwindow.TAPEOUT_VAULT=vault;T._all=null;T._byId=null;\nwindow.TAPEOUT_STUDIO_COVERAGE={lessons:42,questions:412,mcq:367,labs:12};\n})();\n', encoding='utf-8')
    report = {'restoredLessons': len(units), 'restoredQuestions': len(questions),
        'restoredMCQs': sum(q['f'] == 'mcq' for q in questions), 'restoredLabs': len(labs),
        'lessonDomains': dict(collections.Counter(u['d'] for u in units)),
        'resolvedAssetCount': len(used), 'resolvedAssets': sorted(used),
        'referenceBooks': len(references), 'referenceSections': sum(len(r['sections']) for r in references),
        'unavailableSourceFigures': gaps,
        'legacyMCQsWithoutPerChoiceExplanations': [q['id'] for q in questions if q['f'] == 'mcq' and not q['why']]}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    assert not [g for g in gaps if g['owner'] in modules], 'Lesson figures must all resolve'
    print(json.dumps({k:v for k,v in report.items() if k not in ['resolvedAssets','unavailableSourceFigures','legacyMCQsWithoutPerChoiceExplanations']}, ensure_ascii=True))
    print('Explicit source-figure gaps:', len(gaps), 'occurrences;', len(set(g['name'] for g in gaps)), 'unique names')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--import-from', type=pathlib.Path)
    args = parser.parse_args()
    if args.import_from: capture(args.import_from)
    build()
