/* Tapeout core: data registry, markdown + math, local progress store, spaced review. */
(function () {
  const T = (window.T = window.T || {});
  T.units = T.units || [];
  T.bank = T.bank || [];
  T.labs = T.labs || [];
  T.glossary = T.glossary || [];
  T.stories = T.stories || [];

  /* ---------- tiny DOM helpers ---------- */
  T.$ = (sel, root = document) => root.querySelector(sel);
  T.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  T.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  T.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  T.debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
  T.shuffle = (arr, seed) => {
    const a = arr.slice();
    let s = seed ?? Math.floor(Math.random() * 1e9);
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  T.toast = (msg) => {
    let el = T.$('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(T._toastId); T._toastId = setTimeout(() => (el.hidden = true), 2400);
  };

  /* ---------- registration (data files call these) ---------- */
  T.addUnits = (list) => T.units.push(...list);
  T.addQ = (list) => T.bank.push(...list);
  T.addLabs = (list) => T.labs.push(...list);
  T.addGlossary = (list) => T.glossary.push(...list);
  // Structured teaching layered onto imported lessons (model, traps, spoken answer, worked example).
  T.upgradeUnits = (map) => Object.entries(map).forEach(([id, extra]) => {
    const u = T.units.find((x) => x.id === id);
    if (!u) { console.warn('upgrade for missing unit', id); return; }
    if (extra.figs && u.figs) extra = Object.assign({}, extra, { figs: extra.figs.concat(u.figs) });
    Object.assign(u, extra);
  });

  /* ---------- markdown + KaTeX ---------- */
  const renderTex = (tex, display) => {
    try { return window.katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore', output: 'html' }); }
    catch (e) { return `<span class="math-error" role="note" title="${T.esc(e.message)}">Math could not render: <code>${T.esc(tex)}</code></span>`; }
  };
  T.tex = renderTex;
  T.md = (src, opts = {}) => {
    if (!src) return '';
    const math = [];
    let s = String(src);
    // Recognize equation fences before protecting ordinary code. Indented fences
    // occur inside the source's callouts; their LaTeX is still display math.
    const code = [];
    s = s.replace(/```([^\n]*)\n([\s\S]*?)```|`[^`\n]+`/g, (m, lang, body) => {
      if (lang && lang.trim().toLowerCase() === 'latex') { math.push(renderTex(body.trim(), true)); return `\u0000M${math.length - 1}\u0000`; }
      code.push(m); return `\u0000C${code.length - 1}\u0000`;
    });
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { math.push(renderTex(t.trim(), true)); return `\u0000M${math.length - 1}\u0000`; });
    s = s.replace(/(^|[^\\$\w])\$([^\s$](?:[^$\n]*?[^\s$])?)\$(?![\w$])/g, (_, pre, t) => { math.push(renderTex(t, false)); return `${pre}\u0000M${math.length - 1}\u0000`; });
    s = s.replace(/\u0000C(\d+)\u0000/g, (_, i) => code[+i]);
    let html = opts.inline ? window.marked.parseInline(s) : window.marked.parse(s);
    html = html.replace(/\u0000M(\d+)\u0000/g, (_, i) => math[+i]);
    return html;
  };
  if (window.marked) window.marked.setOptions({ gfm: true, breaks: false });

  /* ---------- progress store (browser-local) ---------- */
  const KEY = 'tapeout.v1';
  const blank = () => ({ v: 1, q: {}, units: {}, notes: {}, drafts: {}, labs: {}, stories: {}, sessions: [], activeSession: null, legacy: {}, legacyArchive: {}, settings: { hideCompany: true, theme: 'dark' } });
  const object = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const finite = (x) => typeof x === 'number' && Number.isFinite(x);
  const require = (condition, message) => { if (!condition) throw new Error(message); };
  function safeTree(x) {
    if (!x || typeof x !== 'object') return;
    for (const [k, v] of Object.entries(x)) { require(!['__proto__', 'prototype', 'constructor'].includes(k), 'Unsafe backup key.'); safeTree(v); }
  }
  function validate(data) {
    require(object(data) && data.v === 1 && object(data.q), 'Choose a Tapeout or Circuit Study Studio version 1 backup.');
    safeTree(data);
    const out = Object.assign(blank(), data);
    for (const key of ['q', 'units', 'notes', 'drafts', 'labs', 'stories', 'settings', 'legacy', 'legacyArchive']) require(object(out[key]), `Invalid ${key} in backup.`);
    out.settings = Object.assign(blank().settings, data.settings || {});
    require(typeof out.settings.hideCompany === 'boolean' && ['auto', 'light', 'dark'].includes(out.settings.theme), 'Invalid appearance settings.');
    if (out.settings.lens != null) require(['circuit', 'asic', 'rtl', 'analog'].includes(out.settings.lens), 'Invalid role lens.');
    if (out.settings.plan != null) require(object(out.settings.plan) && [30, 45, 60].includes(out.settings.plan.minutes) && [3, 4, 5, 6].includes(out.settings.plan.days) && (out.settings.plan.deadline == null || typeof out.settings.plan.deadline === 'string'), 'Invalid weekly plan.');
    for (const key of ['notes', 'drafts']) require(Object.values(out[key]).every(v => typeof v === 'string'), `Invalid ${key} text.`);
    for (const s of Object.values(out.q)) {
      require(object(s) && ['n', 'ok', 'box', 'due', 'last'].every(k => finite(s[k]) && s[k] >= 0), 'Invalid question progress.');
      require(Number.isInteger(s.n) && Number.isInteger(s.ok) && s.ok <= s.n && Number.isInteger(s.box) && s.box <= 6, 'Invalid question counts.');
      require(s.grade == null || [0, 1, 2, 3].includes(s.grade), 'Invalid review grade.');
      require(s.hist == null || (Array.isArray(s.hist) && s.hist.every(h => Array.isArray(h) && finite(h[0]) && [0, 1, 2, 3].includes(h[1]) && [null, true, false].includes(h[2]))), 'Invalid question history.');
    }
    out.units = Object.fromEntries(Object.entries(out.units).map(([id, value]) => {
      require(object(value), 'Invalid lesson status.');
      const s = { status: 'learning', ...value };
      require(['new', 'learning', 'solid'].includes(s.status), 'Invalid lesson status.');
      if (s.checks != null) require(object(s.checks) && Object.values(s.checks).every(v => typeof v === 'boolean'), 'Invalid lesson checks.');
      return [id, s];
    }));
    for (const s of Object.values(out.labs)) require(object(s) && (s.code == null || typeof s.code === 'string') && (s.passed == null || typeof s.passed === 'boolean'), 'Invalid lab progress.');
    for (const s of Object.values(out.stories)) require(object(s) && Object.values(s).every(v => typeof v === 'string'), 'Invalid story text.');
    require(Array.isArray(out.sessions) && out.sessions.every(s => object(s) && finite(s.t) && typeof s.mode === 'string' && finite(s.n) && finite(s.ok) && s.n >= 0 && s.ok >= 0 && s.ok <= s.n), 'Invalid session history.');
    const a = out.activeSession;
    if (a != null) {
      require(object(a) && typeof a.mock === 'boolean' && typeof a.label === 'string' && typeof a.key === 'string' && Array.isArray(a.ids) && a.ids.length > 0 && a.ids.every(id => typeof id === 'string'), 'Invalid active session.');
      require(finite(a.started) && finite(a.deadline) && Number.isInteger(a.index) && a.index >= 0 && a.index <= a.ids.length && Array.isArray(a.results) && a.results.length === a.index, 'Invalid active session position.');
      require(a.results.every(r => object(r) && typeof r.id === 'string' && typeof r.correct === 'boolean' && [0, 1, 2, 3].includes(r.grade)), 'Invalid active session results.');
      require(a.stages == null || (Array.isArray(a.stages) && a.stages.every(x => typeof x === 'string')), 'Invalid session stages.');
      require(a.responses == null || (object(a.responses) && Object.values(a.responses).every(x => typeof x === 'string')), 'Invalid session responses.');
      require(a.paused == null || typeof a.paused === 'boolean', 'Invalid pause state.');
      require(a.remaining == null || (finite(a.remaining) && a.remaining >= 0), 'Invalid remaining time.');
    }
    return out;
  }
  const aliases = (items) => new Map(items.flatMap(x => [x.id, x.legacyId, x.originalId, x.originalID, x.k].filter(Boolean).map(id => [id, x.id])));
  function migrateStudio(data) {
    require(object(data) && data.version === 1, 'Unsupported Studio backup version.');
    safeTree(data);
    for (const key of ['questions', 'lessons', 'labs', 'notes']) require(object(data[key]), `Invalid Studio ${key}.`);
    require(Array.isArray(data.mockHistory), 'Invalid Studio mock history.');
    const out = blank(), qa = aliases(T.bank.concat(window.TAPEOUT_VAULT || [])), ua = aliases(T.units), la = aliases(T.labs);
    // Preserve all original data, including unmatched IDs and old drawings. Never
    // infer a new objective score from an old self-rating or checked lesson box.
    out.legacyArchive.studioBackup = data;
    if (object(data.prefs) && ['auto', 'light', 'dark'].includes(data.prefs.theme)) out.settings.theme = data.prefs.theme;
    for (const [id, s] of Object.entries(data.questions)) {
      require(object(s) && (s.attempt == null || typeof s.attempt === 'string'), 'Invalid Studio question record.');
      const target = qa.get(id) || id;
      if (s.attempt != null) out.drafts[target] = s.attempt;
      const graded = ['again', 'partial', 'solid'].includes(s.rating) || typeof s.lastCheck === 'boolean';
      if (graded) {
        const auto = typeof s.lastCheck === 'boolean' ? s.lastCheck : null;
        const grade = auto === false || s.rating === 'again' ? 0 : s.rating === 'partial' ? 1 : 2;
        const last = finite(s.ratedAt) ? s.ratedAt : 0;
        out.q[target] = { n: auto == null ? 0 : 1, ok: auto === true ? 1 : 0, box: grade ? 1 : 0, grade, due: finite(s.due) ? s.due : 0, last, hist: last ? [[last, grade, auto]] : [], imported: true };
      }
    }
    for (const [id, text] of Object.entries(data.notes)) { require(typeof text === 'string', 'Invalid Studio note.'); out.notes[ua.get(id) || id] = text; }
    for (const [id, s] of Object.entries(data.labs)) { require(object(s) && (s.code == null || typeof s.code === 'string') && (s.passed == null || typeof s.passed === 'boolean'), 'Invalid Studio lab.'); out.labs[la.get(id) || id] = { ...s, passed: false, previouslyPassed: !!s.passed }; }
    const learning = data.learning;
    if (learning != null) {
      require(object(learning), 'Invalid Studio learning data.');
      for (const key of ['notes', 'recall']) if (learning[key] != null) {
        require(object(learning[key]) && Object.values(learning[key]).every(v => typeof v === 'string'), 'Invalid Studio learning text.');
        for (const [id, text] of Object.entries(learning[key])) { const target = ua.get(id) || id; out.notes[target] = [out.notes[target], key === 'recall' ? `Earlier unaided recall:\n${text}` : text].filter(Boolean).join('\n\n'); }
      }
      if (learning.checks != null) {
        require(object(learning.checks) && Object.values(learning.checks).every(v => typeof v === 'boolean'), 'Invalid Studio checks.');
        for (const [key, checked] of Object.entries(learning.checks)) { const split = key.lastIndexOf(':'), id = split < 0 ? key : key.slice(0, split), target = ua.get(id) || id; const u = out.units[target] ||= { status: 'learning', importedChecks: {}, checks: {} }; u.importedChecks[key] = checked; if (split >= 0) u.checks[key.slice(split + 1)] = checked; }
      }
      if (learning.lastModule) out.lastUnit = ua.get(learning.lastModule) || learning.lastModule;
    }
    for (const [id, s] of Object.entries(data.lessons)) if (s) out.units[ua.get(id) || id] ||= { status: 'learning', imported: true };
    for (const m of data.mockHistory) { require(object(m) && Array.isArray(m.ids) && object(m.responses || {}), 'Invalid Studio rehearsal.'); out.sessions.push({ t: finite(m.finishedAt) ? m.finishedAt : finite(m.started) ? m.started : 0, mode: 'Earlier Studio rehearsal (ungraded)', n: m.ids.length, ok: 0, mins: Math.round((m.duration || 0) / 60), imported: true, ungraded: true, responses: m.responses || {} }); }
    return validate(out);
  }
  function mergeState(current, incoming) {
    const merged = { ...current, ...incoming };
    for (const key of ['q', 'units', 'notes', 'drafts', 'labs', 'stories', 'settings', 'legacy', 'legacyArchive']) merged[key] = { ...current[key], ...incoming[key] };
    for (const key of ['units', 'labs', 'stories']) for (const id of Object.keys(incoming[key])) {
      if (current[key][id]) merged[key][id] = { ...current[key][id], ...incoming[key][id] };
    }
    // Importing an older backup must not roll back a more recent question attempt.
    for (const [id, s] of Object.entries(current.q)) if (incoming.q[id] && s.last > incoming.q[id].last) merged.q[id] = s;
    const seen = new Set();
    merged.sessions = current.sessions.concat(incoming.sessions).filter(s => { const key = JSON.stringify(s); if (seen.has(key)) return false; seen.add(key); return true; }).slice(-100);
    merged.activeSession = current.activeSession || incoming.activeSession;
    return validate(merged);
  }
  T.validateState = validate;
  T.migrateStudio = migrateStudio;
  T.mergeState = mergeState;
  let state;
  try { const raw = JSON.parse(localStorage.getItem(KEY) || 'null'); state = raw ? validate(raw) : blank(); }
  catch (e) { state = blank(); }
  T.state = state;
  T.save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { T.toast('Could not save progress in this browser.'); } };
  T.exportState = () => {
    const blob = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `tapeout-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  T.importState = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        require(String(r.result).length <= 10 * 1024 * 1024, 'Backup exceeds 10 MB.');
        const data = JSON.parse(r.result);
        const incoming = data && data.version === 1 ? migrateStudio(data) : validate(data);
        const merged = mergeState(state, incoming);
        Object.keys(state).forEach((k) => delete state[k]);
        Object.assign(state, merged);
        T._all = null; T._idx = null;
        T.save(); res();
      } catch (e) { rej(e); }
    };
    r.onerror = () => rej(new Error('Could not read the file.'));
    r.readAsText(file);
  });

  /* ---------- spaced review (Leitner boxes with day intervals) ---------- */
  const DAY = 86400000;
  const INTERVAL = [0, 1, 3, 7, 16, 35, 80];
  T.today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
  T.qstate = (id) => state.q[id];
  // grade: 0 again, 1 hard, 2 good, 3 easy. auto: result of an objective check (true/false/null)
  T.record = (id, grade, auto) => {
    const s = state.q[id] || { n: 0, ok: 0, box: 0, due: 0, last: 0, hist: [] };
    s.n += 1;
    if (auto === true) s.ok += 1;
    if (auto === null || auto === undefined) { if (grade >= 2) s.ok += 1; }
    let box = s.box;
    if (grade === 0) box = 0;
    else if (grade === 1) box = 1;
    else if (grade === 2) box = Math.min(box + 1, INTERVAL.length - 1);
    else box = Math.min(box + 2, INTERVAL.length - 1);
    s.box = box;
    s.grade = grade;
    s.last = Date.now();
    s.due = T.today() + (grade === 0 ? 0 : INTERVAL[box] * DAY);
    s.hist = (s.hist || []).concat([[Date.now(), grade, auto === undefined ? null : auto]]).slice(-12);
    state.q[id] = s;
    T.save();
    return s;
  };
  T.isDue = (id) => { const s = state.q[id]; return !!s && s.due <= T.today() + DAY - 1; };
  T.dueList = () => T.allQ().filter((q) => T.isDue(q.id));

  /* ---------- question pool ---------- */
  T.allQ = () => {
    if (!T._all) {
      const vault = (window.TAPEOUT_VAULT || []).map((v) => Object.assign({ vault: true }, v));
      T._all = T.bank.concat(vault);
      T._byId = new Map(T._all.map((q) => [q.id, q]));
    }
    const hide = state.settings.hideCompany;
    return hide ? T._all.filter((q) => !q.company) : T._all;
  };
  T.getQ = (id) => { T.allQ(); return T._byId.get(id); };
  T.domain = (id) => (window.TAPEOUT_DOMAINS || []).find((d) => d.id === id);
  T.unit = (id) => T.units.find((u) => u.id === id);

  T.domainStats = (did) => {
    const qs = T.allQ().filter((q) => q.d === did && !q.personal);
    let seen = 0, ok = 0, n = 0, due = 0;
    qs.forEach((q) => { const s = state.q[q.id]; if (s) { seen++; ok += s.ok; n += s.n; if (T.isDue(q.id)) due++; } });
    const units = T.units.filter((u) => u.d === did);
    const unitsDone = units.filter((u) => state.units[u.id] && state.units[u.id].status === 'solid').length;
    return { total: qs.length, seen, acc: n ? ok / n : null, due, units: units.length, unitsDone };
  };

  T.fmtPct = (x) => (x == null ? '-' : `${Math.round(x * 100)}%`);
  T.LVL = { 1: 'L1 recall', 2: 'L2 apply', 3: 'L3 design / debug' };
  T.FMT = { mcq: 'Multiple choice', multi: 'Select all', num: 'Numeric', tf: 'True / false', order: 'Ordering', text: 'Fill in', short: 'Short answer', oral: 'Say it out loud', design: 'Design / whiteboard', spot: 'Spot the bug' };
})();
