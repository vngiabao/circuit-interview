/* Run: node scripts/qa-state.cjs. No browser state or source data is modified. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const marked = require(path.join(ROOT, 'vendor/marked.js'));
const katex = require(path.join(ROOT, 'vendor/katex/katex.min.js'));
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS', name); }
function environment(initial = null) {
  const store = new Map(initial ? [['tapeout.v1', JSON.stringify(initial)]] : []), timers = new Map(), events = {};
  let timerId = 0;
  const c = { console, URL, URLSearchParams, Blob, Map, Set, Date, marked, katex,
    document: { compatMode: 'CSS1Compat', querySelector: () => ({ textContent: '', hidden: false }), currentScript: { src: 'https://example.test/js/code.js' } },
    location: { protocol: 'https:', hash: '#/' },
    localStorage: { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) },
    setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms, interval: false }); return timerId; },
    clearTimeout: id => timers.delete(id),
    setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, interval: true }); return timerId; },
    clearInterval: id => timers.delete(id),
    FileReader: class { readAsText(file) { this.result = file; this.onload(); } },
    addEventListener: (name, fn) => { (events[name] ||= []).push(fn); },
    scrollTo: () => {},
  };
  c.window = c; c._timers = timers; c._store = store; c._events = events;
  vm.createContext(c);
  c.load = f => vm.runInContext(read(f), c, { filename: f });
  c.load('js/core.js');
  c.load('js/figures.js');
  c.T.toast = () => {};
  return c;
}
class Element {
  constructor(dataset = {}) { this.dataset = dataset; this.events = {}; this.value = ''; this.classList = { add() {}, toggle() {} }; }
  addEventListener(k, fn) { this.events[k] = fn; }
  setAttribute(k, v) { this[k] = v; }
  remove() { this.removed = true; }
  insertAdjacentHTML(_, html) { this.html = (this.html || '') + html; }
  focus() {}
}
function questionHost() {
  const grade = [0, 1, 2, 3].map(g => new Element({ g: String(g) }));
  const inputs = [0, 1].map(i => Object.assign(new Element(), { value: String(i), checked: i === 0 }));
  const options = inputs.map(i => new Element({ i: i.value }));
  const card = new Element(), rv = new Element(), fb = new Element(), opts = new Element();
  card.querySelector = s => ({ '.rv': rv, '.fb': fb, '.opts': opts }[s] || null);
  card.querySelectorAll = s => s === '[data-g]' || s === '[data-g],[data-rub]' ? grade
    : s === '.opts input:checked' ? inputs.filter(x => x.checked)
    : s === '.opts input' ? inputs : s === '.opt' ? options : [];
  return { firstElementChild: card, card, grade, rv, fb, inputs, options, innerHTML: '' };
}
function sessionHost() {
  const parts = new Map();
  return { innerHTML: '', querySelector(s) { if (!parts.has(s)) parts.set(s, new Element()); return parts.get(s); }, parts };
}

(async () => {
  const c = environment(), T = c.T;
  c.load('js/question.js');
  check('numeric values use display units and compatible explicit SI units', () => {
    for (const s of ['470', '470ps', '470 ps', '0.47ns', '4.7e-10 s', '470p']) assert(Math.abs(T.parseNumber(s, 'ps') - 470) < 1e-9, s);
    assert.equal(T.parseNumber('-5 ps', 'ps'), -5);
    assert.equal(T.parseNumber('2.5n'), 2.5e-9);
    assert.equal(T.parseNumber('40 mA', 'A'), .04);
    for (const s of ['470/1000', '470garbage', '470 xyz', 'NaN', 'Infinity', '1e999', '470mV', '1,2']) assert(Number.isNaN(T.parseNumber(s, 'ps')), s);
  });
  check('latex fences render math while ordinary code is protected', () => {
    const html = T.md('```latex\nx^2 + y^2\n```\n\n```python\nprint("$x$")\n```');
    assert(html.includes('katex-display'));
    assert(!html.includes('language-latex'));
    assert(html.includes('language-python'));
    assert(html.includes('$x$'));
    assert(T.md('    ```latex\n    x=1\n    ```').includes('katex-display'));
    assert(T.md('```latex\n\\notARealMacro{x}\n```').includes('math-error'));
  });
  check('legacy and array figures coexist; solution annotations remain answer-only', () => {
    T.plot = () => '<svg role="img" aria-label="legacy plot"></svg>';
    T.schematic = name => `<svg role="img" aria-label="${name}"></svg>`;
    const q = {id:'figure-test',d:'seq',f:'mcq',q:'Read the circuit',opts:['one','two'],ans:0,
      fig:'plot:legacy',figs:[{schematic:'question-structure',cap:'Question structure'}],
      afig:[{schematic:'solution-structure',cap:'Answer-only annotation'}]};
    const h = questionHost();
    const card = T.renderQuestion(h,q);
    assert.equal(T.questionFigures(q).length,2);
    assert(h.innerHTML.includes('legacy plot') && h.innerHTML.includes('question-structure'));
    assert(!h.innerHTML.includes('Answer-only annotation'));
    card._check();
    assert(h.rv.innerHTML.includes('Answer-only annotation'));
    const hidden = questionHost();
    T.renderQuestion(hidden,q,{sketchFirst:true});
    assert(hidden.innerHTML.includes('sketch-compare'));
    assert(!hidden.innerHTML.includes('class="sketch-compare" open'));
  });
  T.addQ([{ id: 'new-q', legacyId: 'old-q', d: 'seq', f: 'mcq' }]);
  T.addUnits([{ id: 'new-u', legacyId: 'old-u' }]);
  T.addLabs([{ id: 'new-l', legacyId: 'old-l' }]);
  c.TAPEOUT_VAULT = [{ id: 'V123', k: 'old-vault' }];
  const old = { version: 1, questions: { 'old-q': { attempt: 'my reasoning', rating: 'solid', ratedAt: 100, due: 200 }, 'old-vault': { lastCheck: true, ratedAt: 50 } }, lessons: {}, labs: { 'old-l': { code: 'print(1)', passed: true } }, notes: { 'old-u': 'old note' }, drawings: { x: 'private drawing state' }, mockHistory: [{ started: 10, ids: ['old-q'], responses: { 'old-q': 'spoken notes' }, duration: 2700 }], learning: { notes: { 'old-u': 'learning note' }, recall: { 'old-u': 'recall text' }, checks: { 'old-u:0': true }, lastModule: 'old-u' } };
  const migrated = T.migrateStudio(old);
  check('Studio migration maps IDs and preserves evidence without invented mastery', () => {
    assert.equal(migrated.drafts['new-q'], 'my reasoning');
    assert.equal(migrated.q['new-q'].n, 0);
    assert.equal(migrated.q.V123.ok, 1);
    assert.equal(migrated.units['new-u'].status, 'learning');
    assert.equal(migrated.units['new-u'].checks['0'], true);
    assert(migrated.notes['new-u'].includes('old note') && migrated.notes['new-u'].includes('recall text'));
    assert.equal(migrated.labs['new-l'].code, 'print(1)');
    assert.equal(migrated.labs['new-l'].passed, false);
    assert.equal(migrated.labs['new-l'].previouslyPassed, true);
    assert.equal(migrated.sessions[0].ungraded, true);
    assert.equal(migrated.legacyArchive.studioBackup.drawings.x, 'private drawing state');
  });
  T.state.notes.current = 'keep me'; T.save();
  const before = JSON.stringify(T.state), storageBefore = c._store.get('tapeout.v1');
  for (const data of [{ v: 1, q: {}, settings: null }, { v: 1, q: [], settings: {} }, { v: 1, q: { x: { n: -1 } } }, { v: 1, q: {}, sessions: 'bad' }]) await assert.rejects(T.importState(JSON.stringify(data)));
  check('invalid imports neither mutate current state nor replace saved progress', () => { assert.equal(JSON.stringify(T.state), before); assert.equal(c._store.get('tapeout.v1'), storageBefore); });
  await T.importState(JSON.stringify(old));
  check('valid import merges rather than deleting unrelated work', () => { assert.equal(T.state.notes.current, 'keep me'); assert.equal(T.state.drafts['new-q'], 'my reasoning'); });
  check('analog plan and checklist-only lesson records survive round trip', () => {
    const st = JSON.parse(JSON.stringify(T.state)); st.settings = { theme: 'light', hideCompany: true, lens: 'analog', plan: { minutes: 45, days: 5, deadline: '' } }; st.units.justChecks = { checks: { 0: true } };
    const v = T.validateState(st); assert.equal(v.units.justChecks.status, 'learning'); assert.equal(v.settings.lens, 'analog');
  });
  const cardHost = questionHost();
  let done = 0;
  const card = T.renderQuestion(cardHost, { id: 'grade-once', d: 'seq', f: 'mcq', opts: ['right', 'wrong'], ans: 0, q: 'Choose', ex: 'HIDDEN_EXPLANATION', why: ['RIGHT_REASON', 'WRONG_REASON'] }, { onDone: () => done++ });
  check('answer/explanation is absent before checking', () => { assert(!cardHost.innerHTML.includes('HIDDEN_EXPLANATION')); assert(!cardHost.innerHTML.includes('RIGHT_REASON')); });
  card._check();
  cardHost.grade[3].events.click(); cardHost.grade[3].events.click(); cardHost.grade[2].events.click();
  check('one checked question can produce only one attempt and transition', () => { assert.equal(T.state.q['grade-once'].n, 1); assert.equal(T.state.q['grade-once'].box, 2); assert.equal(done, 1); assert(cardHost.grade.every(x => x.disabled)); assert(cardHost.rv.innerHTML.includes('HIDDEN_EXPLANATION')); });
  const wrongHost = questionHost(); wrongHost.inputs[0].checked = false; wrongHost.inputs[1].checked = true;
  T.renderQuestion(wrongHost, { id: 'wrong', d: 'seq', f: 'mcq', opts: ['right', 'wrong'], ans: 0, q: 'Choose' })._check(); wrongHost.grade[3].events.click();
  check('an objectively wrong response stays due even if Easy is clicked', () => { assert.equal(T.state.q.wrong.grade, 0); assert.equal(T.state.q.wrong.box, 0); });
  check('Hard schedules the advertised one day even for a high review box', () => { T.state.q['grade-once'].box = 6; const record = T.record('grade-once', 1, true); assert.equal(record.box, 1); assert.equal(record.due - T.today(), 86400000); });

  const s = environment(); s.load('js/practice.js');
  const sq = [{ id: 'a', f: 'oral', d: 'seq', q: 'A' }, { id: 'b', f: 'oral', d: 'seq', q: 'B' }]; s.T.addQ(sq); s.TAPEOUT_DOMAINS = [{ id: 'seq', code: 'SEQ' }];
  let rendered;
  s.T.renderQuestion = (_, q, opts) => { rendered = { q, opts }; return { _pick() {}, _check() {} }; };
  const sh = sessionHost(); s.T.runSession(sh, sq, 'Test interview', true, { minutes: 45 });
  const deadline = s.T.state.activeSession.deadline;
  rendered.opts.drafts.a = 'saved session answer'; s.T.save();
  rendered.opts.onDone({ correct: true, grade: 2 }); rendered.opts.onDone({ correct: true, grade: 2 });
  check('mock transitions persist once and deadline is absolute', () => { assert.equal(s.T.state.activeSession.index, 1); assert.equal(s.T.state.activeSession.results.length, 1); assert.equal(s.T.state.activeSession.deadline, deadline); });
  s._events.hashchange.forEach(fn => fn());
  check('navigation clears old mock timers and delayed render callbacks', () => { assert.equal(s._timers.size, 0); });
  s.T.runSession(sh, [], '', true, { resume: true });
  check('resume restores question index, deadline and isolated answers', () => { assert.equal(rendered.q.id, 'b'); assert.equal(s.T.state.activeSession.deadline, deadline); assert.equal(s.T.state.activeSession.responses.a, 'saved session answer'); assert.equal(s.T.state.drafts.a, undefined); });
  sh.parts.get('#pause').events.click({ target: sh.parts.get('#pause') });
  check('pause is persisted and reimportable', () => { assert(s.T.state.activeSession.paused); assert(s.T.state.activeSession.remaining > 0); s.T.validateState(JSON.parse(JSON.stringify(s.T.state))); });
  sh.parts.get('#pause').events.click({ target: sh.parts.get('#pause') });
  s.T.state.activeSession.deadline = Date.now() - 1;
  [...s._timers.values()].find(t => t.interval).fn();
  check('expiry closes session once and saves responses', () => { assert.equal(s.T.state.activeSession, null); assert.equal(s.T.state.sessions.length, 1); assert.equal(s.T.state.sessions[0].responses.a, 'saved session answer'); assert.equal(s._timers.size, 0); });

  const w = environment(); let worker;
  w.Worker = class { constructor() { worker = this; this.messages = []; } postMessage(m) { this.messages.push(m); } terminate() { this.terminated = true; } };
  w.load('js/code.js');
  const first = w.T.runPython('A', null), rejected = await w.T.runPython('B', null);
  check('concurrent Python request cannot overwrite pending run', () => { assert.equal(rejected.busy, true); assert.equal(worker.messages.length, 1); });
  worker.onmessage({ data: { id: 999, type: 'done', ok: true, out: 'wrong response' } });
  worker.onmessage({ data: { id: worker.messages[0].id, type: 'status', phase: 'running', text: 'Running' } });
  check('execution has a separate 20-second timeout after loading', () => { assert.equal([...w._timers.values()][0].ms, 20000); });
  worker.onmessage({ data: { id: worker.messages[0].id, type: 'done', ok: true, out: 'A' } });
  assert.equal((await first).out, 'A');
  const stopping = w.T.runPython('while True: pass', null); w.T.stopPython(); assert.equal((await stopping).cancelled, true);
  check('Stop terminates worker and resolves pending promise', () => { assert(worker.terminated); assert.equal(w._timers.size, 0); });
  const failing = w.T.runPython('C', null); worker.onerror({ message: 'missing runtime' }); assert.match((await failing).out, /missing runtime/);
  check('worker load errors settle the request without a lingering timer', () => { assert.equal(w._timers.size, 0); });

  // Execute the actual shipped Pyodide runtime, not a JavaScript approximation.
  const runtime = path.join(ROOT, 'vendor/pyodide');
  const { loadPyodide } = await import(pathToFileURL(path.join(runtime, 'pyodide.mjs')));
  const py = await loadPyodide({ indexURL: runtime + path.sep });
  const data = environment();
  const scripts = [...read('index.html').matchAll(/<script src="(data\/[^"?]+)"/g)].map(m => m[1]);
  for (const file of scripts) data.load(file);
  for (const lab of data.T.labs) {
    const dict = py.globals.get('dict'), scope = dict(); dict.destroy();
    try { await py.runPythonAsync(lab.solution, { globals: scope }); await py.runPythonAsync(lab.tests, { globals: scope }); }
    catch (e) { throw new Error(`Reference lab ${lab.id} failed: ${e.message}`); }
    finally { scope.destroy(); }
  }
  check(`all ${data.T.labs.length} reference labs pass in actual local Python`, () => assert(data.T.labs.length > 0));
  const dict = py.globals.get('dict'), isolated = dict(); dict.destroy();
  await assert.rejects(py.runPythonAsync('assert 1 == 2, "deliberate failing assertion"', { globals: isolated }));
  isolated.destroy();
  check('actual Python rejects a failing assertion instead of reporting a pass', () => {});
  console.log(`\n${checks} regression checks passed.`);
})().catch(err => { console.error(err.stack); process.exitCode = 1; });
