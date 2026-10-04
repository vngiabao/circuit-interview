/* Shell: routing, navigation counts, search palette, figure zoom, theme. */
(function () {
  const T = window.T, V = T.views;
  const main = T.$('#main');

  // Visible copy carries no em or en dashes (taste skill rule). Imported text is normalised once at startup.
  (function dedashAll() {
    const fix = (str) => str.replace(/\s*—\s*/g, ' - ').replace(/(\d)–(\d)/g, '$1-$2').replace(/\s–\s/g, ' - ').replace(/–/g, '-');
    const walk = (x, depth) => {
      if (!x || typeof x !== 'object' || depth > 6) return;
      for (const k of Object.keys(x)) {
        if (k === 'solution' || k === 'tests' || k === 'starter') continue;
        if (typeof x[k] === 'string') x[k] = fix(x[k]);
        else walk(x[k], depth + 1);
      }
    };
    [T.units, T.bank, T.labs, T.glossary, window.TAPEOUT_VAULT, window.TAPEOUT_DOMAINS].forEach((a) => walk(a, 0));
  })();

  T.applyTheme = () => {
    const t = T.state.settings.theme || 'dark';
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  };
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', T.applyTheme);
  T.applyTheme();
  window.addEventListener('beforeprint', () => { document.documentElement.dataset.theme = 'light'; });
  window.addEventListener('afterprint', T.applyTheme);

  T.refreshCounts = () => {
    T._all = null;
    const due = T.dueList().length;
    const set = (k, v, cls) => { const el = T.$(`[data-count="${k}"]`); if (el) { el.textContent = v; el.className = 'count' + (cls ? ' ' + cls : ''); } };
    set('bank', T.allQ().length);
    set('drill', due ? `${due} due` : '', due ? 'due' : '');
    set('learn', T.units.length);
    set('lessons', T.units.length);
    set('code', T.labs.length);
  };

  const routes = [
    [/^\/?$/, () => V.home(main)],
    [/^\/plan$/, () => V.plan(main)],
    [/^\/reference\/([\w-]+)$/, (m) => V.reference(main, m[1])],
    [/^\/learn$/, () => V.learn(main)],
    [/^\/lessons$/, (m, p) => V.lessons(main, p)],
    [/^\/learn\/([\w-]+)$/, (m) => V.domain(main, m[1])],
    [/^\/unit\/([\w-]+)$/, (m) => V.unit(main, m[1])],
    [/^\/bank$/, (m, p) => V.bank(main, p)],
    [/^\/q\/([\w-]+)$/, (m, p) => V.question(main, m[1], p)],
    [/^\/drill$/, (m, p) => V.drill(main, p)],
    [/^\/mock$/, (m, p) => V.mock(main, p)],
    [/^\/code$/, () => V.code(main)],
    [/^\/lab\/([\w-]+)$/, (m) => V.lab(main, m[1])],
    [/^\/sheets$/, (m, p) => V.sheets(main, p)],
    [/^\/figures\/([\w-]+)$/, (m) => V.figureSheet(main, m[1])],
    [/^\/stories$/, () => V.stories(main)],
    [/^\/sources$/, () => V.sources(main)],
    [/^\/slides\/([\w-]+)$/, (m) => V.slides(main, m[1])],
    [/^\/settings$/, () => V.settings(main)],
  ];
  const navKey = (path) => (path.match(/^\/(\w+)/) || [, 'home'])[1].replace(/^(unit)$/, 'lessons').replace(/^q$/, 'bank').replace(/^lab$/, 'code').replace(/^slides$/, 'sources').replace(/^figures$/, 'sheets');

  function route() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, query] = raw.split('?');
    const p = Object.fromEntries(new URLSearchParams(query || ''));
    T.keyHandler = null;
    const hit = routes.find(([re]) => re.test(path));
    try { hit ? hit[1](path.match(hit[0]), p) : V.notFound(main); }
    catch (e) { console.error(e); main.innerHTML = `<div class="page"><div class="empty-state"><h3>Something broke on this page</h3><p class="mono small">${T.esc(e.message)}</p><a href="#/">Back to today</a></div></div>`; }
    const key = navKey(path);
    T.$$('.nav a').forEach((a) => { if (a.dataset.nav === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const h1 = main.querySelector('h1');
    document.title = (h1 ? h1.textContent + ' · ' : '') + 'GBVirtuoso';
    if (!/^\/q\//.test(path) || !T._lastWasQ) window.scrollTo({ top: 0 });
    T._lastWasQ = /^\/q\//.test(path);
    closeRail();
    T.refreshCounts();
  }
  window.addEventListener('hashchange', route);

  /* ---------- mobile rail ---------- */
  const rail = T.$('.rail');
  let scrim;
  function openRail() { rail.classList.add('open'); scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.addEventListener('click', closeRail); document.body.appendChild(scrim); T.$('#menu').setAttribute('aria-expanded', 'true'); }
  function closeRail() { rail.classList.remove('open'); if (scrim) { scrim.remove(); scrim = null; } const m = T.$('#menu'); if (m) m.setAttribute('aria-expanded', 'false'); }
  T.$('#menu').addEventListener('click', () => (rail.classList.contains('open') ? closeRail() : openRail()));

  /* ---------- search palette ---------- */
  const dlg = T.$('#cmdk'), inp = T.$('#cmdk input'), ul = T.$('#cmdk ul');
  let items = [], sel = 0;
  function index() {
    if (T._idx) return T._idx;
    const idx = [];
    (window.TAPEOUT_DOMAINS || []).forEach((d) => idx.push({ k: d.code, t: d.name, s: d.blurb, h: `#/learn/${d.id}` }));
    T.units.forEach((u) => idx.push({ k: 'LESSON', t: u.title, s: `${u.goal || ''} ${(u.tags || []).join(' ')}`, h: `#/unit/${u.id}` }));
    T.labs.forEach((l) => idx.push({ k: 'LAB', t: l.title, s: l.goal, h: `#/lab/${l.id}` }));
    T.glossary.forEach(([t, d]) => idx.push({ k: 'TERM', t, s: d, h: '#/sheets' }));
    T.allQ().forEach((q) => idx.push({ k: q.id, t: T.qtitle(q), s: `${q.q} ${(q.tags || []).join(' ')}`, h: `#/q/${q.id}` }));
    [['Lessons', '#/lessons'], ['Learn', '#/learn'], ['Weekly plan', '#/plan'], ['Answer bank', '#/bank'], ['Drill', '#/drill'], ['Mock interview', '#/mock'], ['Code corner', '#/code'], ['Sheets', '#/sheets'], ['Stories', '#/stories'], ['Sources', '#/sources'], ['Settings', '#/settings']].forEach(([t, h]) => idx.push({ k: 'GO', t, s: '', h }));
    idx.forEach((x) => (x.hay = `${x.k} ${x.t} ${x.s}`.toLowerCase()));
    return (T._idx = idx);
  }
  function search() {
    const terms = inp.value.toLowerCase().split(/\s+/).filter(Boolean);
    const idx = index();
    items = !terms.length ? idx.filter((x) => x.k === 'GO' || x.k === 'LESSON').slice(0, 14) : idx.filter((x) => terms.every((t) => x.hay.includes(t))).map((x) => ({ x, sc: terms.reduce((a, t) => a + (x.t.toLowerCase().includes(t) ? 3 : 1), 0) + (x.k === 'LESSON' ? 2 : 0) })).sort((a, b) => b.sc - a.sc).slice(0, 40).map((r) => r.x);
    sel = 0;
    ul.innerHTML = items.length ? items.map((x, i) => `<li><a href="${x.h}" aria-selected="${i === sel}" data-i="${i}"><span class="k">${T.esc(x.k)}</span><span>${T.esc(x.t)}</span></a></li>`).join('') : `<li class="empty">No match. Try a shorter word such as "hold", "keeper" or "Elmore".</li>`;
  }
  T.openSearch = () => { T._idx = null; dlg.showModal(); inp.value = ''; search(); inp.focus(); };
  inp.addEventListener('input', search);
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); T.$$('a', ul).forEach((a, i) => a.setAttribute('aria-selected', String(i === sel))); const a = T.$$('a', ul)[sel]; if (a) a.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter' && items[sel]) { e.preventDefault(); location.hash = items[sel].h; dlg.close(); }
  });
  ul.addEventListener('click', (e) => { if (e.target.closest('a')) dlg.close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  T.$$('[data-open-search]').forEach((b) => b.addEventListener('click', T.openSearch));

  /* ---------- figure zoom ---------- */
  const zoom = T.$('#zoom');
  document.addEventListener('click', (e) => {
    const media = e.target.closest('[data-figure-zoom]')?.querySelector('svg,img') || e.target.closest('.md img, .fig img, .slides img');
    if (!media) return;
    zoom.querySelectorAll('.zoom-media').forEach(x => x.remove());
    const clone = media.cloneNode(true);
    clone.classList.add('zoom-media');
    if (clone.tagName.toLowerCase() === 'svg') {
      const prefix = `zoom-${Date.now()}-`, ids = new Map();
      clone.querySelectorAll('[id]').forEach(x => { ids.set(x.id, prefix + x.id); x.id = prefix + x.id; });
      clone.querySelectorAll('*').forEach(x => [...x.attributes].forEach(a => {
        let v = a.value;
        ids.forEach((next, old) => { v = v.replaceAll(`url(#${old})`, `url(#${next})`); if (v === `#${old}`) v = `#${next}`; if (a.name === 'aria-labelledby') v = v.split(' ').map(t => t === old ? next : t).join(' '); });
        if (v !== a.value) x.setAttribute(a.name, v);
      }));
    }
    zoom.insertBefore(clone, zoom.firstChild);
    T.$('.zcap', zoom).textContent = media.closest('figure')?.querySelector('figcaption')?.textContent || media.getAttribute('aria-label') || media.alt || '';
    zoom.showModal();
  });
  zoom.addEventListener('click', () => zoom.close());

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !e.target.matches('input,textarea,select'))) { e.preventDefault(); T.openSearch(); return; }
    if (dlg.open || zoom.open) return;
    if (T.keyHandler && !e.metaKey && !e.ctrlKey && !e.altKey) T.keyHandler(e);
  });

  T.$('#year').textContent = `${T.units.length} lessons · ${T.allQ().length} questions · ${T.labs.length} labs`;
  route();
})();
