/* Practice-side views: answer bank, question page, drill sessions, mock interview. */
(function () {
  const T = window.T;
  const V = (T.views = T.views || {});
  const OBJ = ['mcq', 'multi', 'num', 'tf', 'order', 'text', 'spot'];
  const OPEN = ['short', 'oral', 'design'];
  let disposeSession = () => {};
  // This listener is registered before the shell router. Stop callbacks targeting
  // the old DOM, but retain the persisted deadline and responses for resume.
  window.addEventListener('hashchange', () => disposeSession());

  /* ---------- filtering shared by bank, question nav and drills ---------- */
  T.filterQ = (p) => {
    let list = T.allQ();
    if (p.d) list = list.filter((q) => q.d === p.d);
    if (p.u) { const u = T.unit(p.u); list = list.filter((q) => q.u === p.u || (u && q.d === u.d && (u.tags || []).some((t) => (q.tags || []).includes(t)))); }
    if (p.l) list = list.filter((q) => String(q.lvl || 2) === p.l);
    if (p.f === 'obj') list = list.filter((q) => OBJ.includes(q.f));
    else if (p.f === 'open') list = list.filter((q) => OPEN.includes(q.f));
    else if (p.f) list = list.filter((q) => q.f === p.f);
    if (p.src === 'core') list = list.filter((q) => !q.vault);
    if (p.src === 'notes') list = list.filter((q) => q.vault);
    if (p.s === 'new') list = list.filter((q) => !T.state.q[q.id]);
    if (p.s === 'miss') list = list.filter((q) => { const s = T.state.q[q.id]; return s && s.grade === 0; });
    if (p.s === 'due') list = list.filter((q) => T.isDue(q.id));
    if (p.s === 'solid') list = list.filter((q) => { const s = T.state.q[q.id]; return s && s.box >= 3; });
    if (p.q) {
      const terms = p.q.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((q) => { const hay = `${q.id} ${q.title || ''} ${q.q} ${(q.tags || []).join(' ')}`.toLowerCase(); return terms.every((t) => hay.includes(t)); });
    }
    return list;
  };
  const qs = (p) => { const u = new URLSearchParams(); Object.entries(p).forEach(([k, v]) => v && u.set(k, v)); const s = u.toString(); return s ? '?' + s : ''; };
  const title = (q) => q.title || String(q.q).replace(/[*_`$#>]/g, '').split('\n')[0].slice(0, 140);
  T.qtitle = title;
  const mark = (q) => { const s = T.state.q[q.id]; if (!s) return '<span class="faint">new</span>'; if (T.isDue(q.id)) return '<span class="mark-bad">due</span>'; return s.grade === 0 ? '<span class="mark-bad">missed</span>' : `<span class="mark-ok">box ${s.box}</span>`; };

  V.bank = (el, p) => {
    const doms = window.TAPEOUT_DOMAINS;
    const all = T.allQ();
    const list = T.filterQ(p);
    const limit = +(p.n || 80);
    const chip = (key, val, label, n) => `<button class="chip" data-k="${key}" data-v="${val}" aria-pressed="${(p[key] || '') === val}">${label}${n != null ? `<span class="n">${n}</span>` : ''}</button>`;
    const base = Object.assign({}, p, { n: '' });
    el.innerHTML = `<div class="page">
      <header class="head"><h1>Answer bank</h1><p class="lede">${all.length} questions, including ${all.filter(q => q.f === 'mcq').length} multiple-choice questions. ${all.filter((q) => !q.vault).length} written for this learning platform, ${all.filter((q) => q.vault).length} imported from your lecture books, drill book and prep notes. Attempt first; every answer explains itself.</p></header>
      <div class="bank-layout">
        <aside class="filters" aria-label="Filters">
          <div class="field"><label for="bq">Search</label><input id="bq" type="search" value="${T.esc(p.q || '')}" placeholder="setup, keeper, Elmore, FIFO..."></div>
          <div class="grp"><span class="lbl">Domain</span><div class="opts">${chip('d', '', 'All')}${doms.map((d) => chip('d', d.id, d.code, all.filter((q) => q.d === d.id).length)).join('')}</div></div>
          <div class="grp"><span class="lbl">Depth</span><div class="opts">${chip('l', '', 'All')}${chip('l', '1', 'L1 recall')}${chip('l', '2', 'L2 apply')}${chip('l', '3', 'L3 design')}</div></div>
          <div class="grp"><span class="lbl">Format</span><div class="opts">${chip('f', '', 'All')}${chip('f', 'mcq', 'Multiple choice')}${chip('f', 'obj', 'Auto-checked')}${chip('f', 'open', 'Open / oral')}${chip('f', 'num', 'Numeric')}${chip('f', 'spot', 'Spot the bug')}${chip('f', 'order', 'Ordering')}</div></div>
          <div class="grp"><span class="lbl">Status</span><div class="opts">${chip('s', '', 'All')}${chip('s', 'new', 'New')}${chip('s', 'due', 'Due')}${chip('s', 'miss', 'Missed')}${chip('s', 'solid', 'Solid')}</div></div>
          <div class="grp"><span class="lbl">Source</span><div class="opts">${chip('src', '', 'All')}${chip('src', 'core', 'Platform')}${chip('src', 'notes', 'Your notes')}</div></div>
        </aside>
        <div>
          <div class="row" style="margin-bottom:12px"><b>${list.length}</b><span class="muted">matching</span><span class="spacer"></span>
            ${list.length ? `<a class="btn accent sm" href="#/drill${qs({ mode: 'filter', d: p.d, l: p.l, f: p.f, s: p.s, src: p.src, q: p.q, u: p.u })}">Drill these</a>` : ''}</div>
          ${list.length ? `<ul class="qlist">${list.slice(0, limit).map((q) => `<li><a href="#/q/${q.id}${qs({ d: p.d, l: p.l, f: p.f, s: p.s, src: p.src, q: p.q, u: p.u })}"><span class="qid">${q.id}</span><span class="qt">${T.esc(title(q))}</span><span class="qm">${T.esc(T.domain(q.d).code)} · L${q.lvl || 2} · ${mark(q)}</span></a></li>`).join('')}</ul>
            ${list.length > limit ? `<p style="margin-top:16px"><a class="btn ghost" href="#/bank${qs(Object.assign({}, base, { n: String(limit + 120) }))}">Show ${Math.min(120, list.length - limit)} more</a></p>` : ''}`
            : `<div class="empty-state"><h3>No questions match</h3><p>Loosen a filter, or clear the search.</p><a class="btn ghost sm" href="#/bank">Clear filters</a></div>`}
        </div>
      </div></div>`;
    el.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => { const np = Object.assign({}, p, { [c.dataset.k]: c.dataset.v, n: '' }); location.hash = '#/bank' + qs(np); }));
    const bq = el.querySelector('#bq');
    bq.addEventListener('input', T.debounce(() => { const np = Object.assign({}, p, { q: bq.value.trim(), n: '' }); history.replaceState(null, '', '#/bank' + qs(np)); V.bank(el, np); const nb = el.querySelector('#bq'); nb.focus(); nb.setSelectionRange(nb.value.length, nb.value.length); }, 260));
  };

  V.question = (el, id, p) => {
    const q = T.getQ(id);
    if (!q) return V.notFound(el);
    const list = T.filterQ(p);
    const i = list.findIndex((x) => x.id === id);
    const prev = i > 0 ? list[i - 1] : null, next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
    const tail = qs(p);
    el.innerHTML = `<div class="page narrow">
      <nav class="crumbs"><a href="#/bank${tail}">Answer bank</a><span>/</span><span>${T.esc(T.domain(q.d).name)}</span>${i >= 0 ? `<span class="faint">· ${i + 1} of ${list.length}</span>` : ''}</nav>
      <div id="qhost" style="margin-top:16px"></div>
      <nav class="qnav no-print">${prev ? `<a class="btn ghost sm" href="#/q/${prev.id}${tail}">← Previous</a>` : ''}<span class="spacer"></span><span class="faint small">Keys: 1-4 choose · Enter check · N next</span>${next ? `<a class="btn sm" href="#/q/${next.id}${tail}">Next →</a>` : ''}</nav>
    </div>`;
    const card = T.renderQuestion(el.querySelector('#qhost'), q);
    T.keyHandler = (e) => {
      if (e.target.matches('input[type=text],input[type=search],textarea')) return;
      if (/^[1-8]$/.test(e.key)) card._pick(+e.key - 1);
      else if (e.key === 'Enter') card._check();
      else if ((e.key === 'n' || e.key === 'ArrowRight') && next) location.hash = `#/q/${next.id}${tail}`;
      else if ((e.key === 'p' || e.key === 'ArrowLeft') && prev) location.hash = `#/q/${prev.id}${tail}`;
    };
  };

  /* ---------- drills ---------- */
  function lensWeighted(n) {
    const lens = T.lens();
    const doms = window.TAPEOUT_DOMAINS.filter((d) => d.id !== 'story');
    const w = { 1: 3, 2: 2, 3: 1 };
    const bag = [];
    doms.forEach((d) => { for (let k = 0; k < w[d.tier[lens]]; k++) bag.push(d.id); });
    const picked = [], used = new Set();
    let guard = 0;
    while (picked.length < n && guard++ < 2000) {
      const d = bag[Math.floor(Math.random() * bag.length)];
      const pool = T.allQ().filter((q) => q.d === d && !used.has(q.id) && OBJ.includes(q.f));
      const fresh = pool.filter((q) => !T.state.q[q.id]);
      const src = fresh.length ? fresh : pool;
      if (!src.length) continue;
      const q = src[Math.floor(Math.random() * src.length)];
      used.add(q.id); picked.push(q);
    }
    return picked;
  }

  V.drill = (el, p) => {
    if (p.mode) return startDrill(el, p);
    const due = T.dueList().length;
    const weak = T.allQ().filter((q) => { const s = T.state.q[q.id]; return s && (s.grade === 0 || (s.n >= 2 && s.ok / s.n < 0.6)); }).length;
    const doms = window.TAPEOUT_DOMAINS;
    el.innerHTML = `<div class="page">
      <header class="head"><h1>Drill</h1><p class="lede">Short, focused sessions. Each answer is graded, explained and scheduled for review. Mixed drills are weighted by your role lens.</p></header>
      ${T.state.activeSession && !T.state.activeSession.mock ? `<p><a class="btn accent" href="#/drill?mode=resume">Resume saved drill</a></p>` : ''}
      <div class="setup-grid">
        <div class="mode"><h2>Review what is due</h2><p>${due} question${due === 1 ? '' : 's'} scheduled for today or earlier. Do these first.</p><div><a class="btn accent" href="#/drill?mode=due" ${due ? '' : 'aria-disabled="true"'}>Start review</a></div></div>
        <div class="mode"><h2>Quick ten</h2><p>Ten auto-checked questions across domains, new ones first, weighted toward must-conquer domains.</p><div><a class="btn" href="#/drill?mode=quick">Start</a></div></div>
        <div class="mode"><h2>Weak spots</h2><p>${weak} question${weak === 1 ? '' : 's'} you missed last time or answer correctly less than 60% of the time.</p><div><a class="btn" href="#/drill?mode=weak">Start</a></div></div>
        <div class="mode"><h2>Rapid recall</h2><p>Twenty L1 questions, one minute each. Definitions and one-liners you must never hesitate on.</p><div><a class="btn" href="#/drill?mode=rapid">Start</a></div></div>
        <div class="mode" style="grid-column:1/-1"><h2>Domain sprint</h2><p>Pick a domain and depth. Questions run from recall to design.</p>
          <form class="row" id="sprint" style="margin-top:8px"><div class="field" style="min-width:220px"><label for="sd">Domain</label><select id="sd">${doms.map((d) => `<option value="${d.id}">${d.code}: ${T.esc(d.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="sl">Depth</label><select id="sl"><option value="">Mixed</option><option value="1">L1 recall</option><option value="2">L2 apply</option><option value="3">L3 design</option></select></div>
          <div class="field"><label for="sn">Questions</label><select id="sn"><option>8</option><option selected>12</option><option>20</option></select></div>
          <div class="field"><span class="lbl">&nbsp;</span><button class="btn accent" type="submit">Start sprint</button></div></form></div>
      </div>
      ${T.state.sessions.length ? `<section class="sec"><h2>Recent sessions</h2><table class="report"><thead><tr><th>When</th><th>Mode</th><th>Questions</th><th>Correct or solid</th></tr></thead><tbody>${T.state.sessions.slice(-8).reverse().map((s) => `<tr><td>${new Date(s.t).toLocaleString()}</td><td>${T.esc(s.mode)}</td><td class="mono">${s.n}</td><td class="mono">${s.ungraded ? 'not graded' : `${s.ok}/${s.n}`}</td></tr>`).join('')}</tbody></table></section>` : ''}
    </div>`;
    el.querySelector('#sprint').addEventListener('submit', (e) => { e.preventDefault(); location.hash = `#/drill?mode=domain&d=${el.querySelector('#sd').value}&l=${el.querySelector('#sl').value}&n=${el.querySelector('#sn').value}`; });
    el.querySelectorAll('[aria-disabled="true"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); T.toast('Nothing is due right now.'); }));
  };

  function startDrill(el, p) {
    const saved = T.state.activeSession;
    const sessionKey = 'drill:' + JSON.stringify(p);
    if (saved && !saved.mock && (p.mode === 'resume' || saved.key === sessionKey)) return runSession(el, [], saved.label, false, { resume: true });
    let list = [], label = '';
    const n = +(p.n || 12);
    if (p.mode === 'due') { list = T.shuffle(T.dueList()).slice(0, 40); label = 'Review due'; }
    else if (p.mode === 'quick') { list = lensWeighted(10); label = 'Quick ten'; }
    else if (p.mode === 'weak') { list = T.shuffle(T.allQ().filter((q) => { const s = T.state.q[q.id]; return s && (s.grade === 0 || (s.n >= 2 && s.ok / s.n < 0.6)); })).slice(0, 20); label = 'Weak spots'; }
    else if (p.mode === 'rapid') { list = T.shuffle(T.allQ().filter((q) => (q.lvl || 2) === 1 && q.d !== 'story')).slice(0, 20); label = 'Rapid recall'; }
    else if (p.mode === 'domain') {
      let pool = T.allQ().filter((q) => q.d === p.d && (!p.l || String(q.lvl || 2) === p.l));
      const fresh = T.shuffle(pool.filter((q) => !T.state.q[q.id])), seen = T.shuffle(pool.filter((q) => T.state.q[q.id]));
      list = fresh.concat(seen).slice(0, n).sort((a, b) => (a.lvl || 2) - (b.lvl || 2));
      label = `${T.domain(p.d).code} sprint`;
    } else if (p.mode === 'filter') { list = T.shuffle(T.filterQ(p)).slice(0, 25); label = 'Filtered drill'; }
    if (!list.length) { el.innerHTML = `<div class="page narrow"><div class="empty-state"><h3>Nothing to drill here</h3><p>Try another mode.</p><a class="btn ghost sm" href="#/drill">Back to drills</a></div></div>`; return; }
    runSession(el, list, label, false, { key: sessionKey });
  }

  function runSession(el, list, label, mock, mockOpts) {
    disposeSession();
    const options = mockOpts || {};
    let session = options.resume ? T.state.activeSession : null;
    if (session) {
      list = session.ids.map((id, k) => { const q = T.getQ(id); return q && { ...q, _stage: (session.stages || [])[k] }; });
      if (list.some(q => !q)) { el.innerHTML = '<div class="page"><h1>Saved session needs its question data</h1><p>Your saved session is preserved. Restore the matching content before resuming, or start a new session.</p></div>'; return; }
      label = session.label; mock = session.mock;
    } else {
      const now = Date.now();
      session = { ids: list.map(q => q.id), stages: list.map(q => q._stage || ''), label, mock, key: options.key || label, started: now, deadline: mock ? now + options.minutes * 60000 : 0, index: 0, results: [], responses: {}, paused: false };
      T.state.activeSession = session;
      T.save();
    }
    const results = session.results;
    session.responses ||= {};
    let i = session.index, timerId, transitionId, disposed = false, finished = false;
    const t0 = session.started;
    disposeSession = () => { disposed = true; clearInterval(timerId); clearTimeout(transitionId); };
    function show() {
      if (disposed || finished) return;
      clearInterval(timerId);
      if (mock && !session.paused && Date.now() >= session.deadline) return finish();
      if (i >= list.length) return finish();
      const raw = list[i];
      const q = mock ? asOral(raw) : raw;
      el.innerHTML = `<div class="page narrow">
        <div class="row" style="margin-bottom:8px"><b>${T.esc(label)}</b><span class="spacer"></span>${mock ? `<span class="timer" id="tm"></span><button class="btn quiet sm" id="pause">${session.paused ? 'Resume timer' : 'Pause timer'}</button>` : ''}<a class="btn quiet sm" href="#/drill" id="quit">End session</a></div>
        <div class="progress-line"><span>${i + 1}/${list.length}</span><span class="bar">${list.map((_, k) => `<i class="${k < results.length ? (results[k].correct ? 'ok' : 'bad') : k === i ? 'cur' : ''}"></i>`).join('')}</span></div>
        ${mock && raw._stage ? `<p class="small muted" style="margin:0 0 8px">${T.esc(raw._stage)}</p>` : ''}
        <div id="qhost"></div>
        <p class="faint small" style="margin-top:16px">Grade yourself after the answer to move on.</p></div>`;
      el.querySelector('#quit').addEventListener('click', (e) => { e.preventDefault(); finish(); });
      const currentIndex = i;
      const card = T.renderQuestion(el.querySelector('#qhost'), q, { oral: mock, drafts: mock ? session.responses : T.state.drafts, onDone: (r) => {
        if (disposed || finished || i !== currentIndex) return;
        results.push({ id: raw.id, correct: r.correct, grade: r.grade }); i++; session.index = i; T.save();
        transitionId = setTimeout(show, 160);
      } });
      T.keyHandler = (e) => { if (e.target.matches('input[type=text],textarea')) return; if (/^[1-8]$/.test(e.key)) card._pick(+e.key - 1); else if (e.key === 'Enter') card._check(); };
      if (mock) {
        const tm = el.querySelector('#tm');
        const tick = () => { if (disposed || finished) return; const left = session.paused ? session.remaining : Math.max(0, session.deadline - Date.now()); tm.textContent = `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')} ${session.paused ? 'paused' : 'left'}`; tm.classList.toggle('low', left < 120000); if (!left && !session.paused) { T.toast('Time is up. Your saved responses are ready to review.'); finish(); } };
        el.querySelector('#pause').addEventListener('click', (e) => { if (session.paused) { session.deadline = Date.now() + session.remaining; session.paused = false; } else { session.remaining = Math.max(0, session.deadline - Date.now()); session.paused = true; } T.save(); e.target.textContent = session.paused ? 'Resume timer' : 'Pause timer'; tick(); });
        timerId = setInterval(tick, 1000); tick();
      }
      window.scrollTo({ top: 0 });
    }
    function finish() {
      if (finished || disposed) return;
      finished = true;
      clearInterval(timerId);
      clearTimeout(transitionId);
      T.keyHandler = null;
      const ok = results.filter((r) => r.correct).length;
      const responses = mock ? { ...session.responses } : Object.fromEntries(session.ids.filter(id => T.state.drafts[id]).map(id => [id, T.state.drafts[id]]));
      if (results.length || Object.keys(responses).length) T.state.sessions.push({ t: Date.now(), mode: label, n: results.length, ok, mins: Math.round((Date.now() - t0) / 60000), responses, ids: session.ids });
      T.state.activeSession = null; T.save();
      const missed = results.filter((r) => !r.correct).map((r) => T.getQ(r.id));
      el.innerHTML = `<div class="page narrow"><header class="head"><h1>${T.esc(label)}: done</h1><p class="lede">${results.length ? `${ok} of ${results.length} correct or self-graded solid, in ${Math.max(1, Math.round((Date.now() - t0) / 60000))} min.` : 'No answers recorded.'} ${missed.length ? 'Misses are back in your review queue for today.' : ''}</p></header>
        ${results.length ? `<table class="report"><thead><tr><th>Question</th><th>Domain</th><th>Result</th></tr></thead><tbody>${results.map((r) => { const q = T.getQ(r.id); return `<tr><td><a href="#/q/${q.id}">${T.esc(title(q))}</a></td><td class="mono">${T.domain(q.d).code}</td><td>${r.correct ? '<span class="mark-ok">✓ solid</span>' : '<span class="mark-bad">× review</span>'}</td></tr>`; }).join('')}</tbody></table>` : ''}
        <div class="row" style="margin-top:24px">${missed.length ? `<a class="btn accent" href="#/drill?mode=weak">Drill the misses</a>` : ''}<a class="btn ghost" href="#/drill">Another drill</a><a class="btn quiet" href="#/">Today</a></div></div>`;
    }
    show();
  }

  /* ---------- mock interview ---------- */
  function asOral(q) {
    if (OPEN.includes(q.f)) return q;
    const ansText = q.f === 'mcq' || (q.f === 'spot' && q.opts) ? q.opts[q.ans] : q.f === 'multi' ? q.ans.map((k) => q.opts[k]).join('; ') : q.f === 'tf' ? (q.ans ? 'True' : 'False') : q.f === 'num' ? `${q.ans}${q.unit ? ' ' + q.unit : ''}` : q.f === 'text' ? q.acc[0] : q.f === 'order' ? q.items.join(' → ') : '';
    return Object.assign({}, q, { f: 'oral', a: `**Answer:** ${ansText}\n\n${q.ex || ''}\n\n${q.a || ''}`, ex: '', rub: q.rub || null, oral: q.oral || null });
  }

  V.mock = (el, p) => {
    if (p.resume && T.state.activeSession?.mock) return runSession(el, [], '', true, { resume: true });
    if (p.go) return runMock(el, p);
    el.innerHTML = `<div class="page narrow">
      <header class="head"><h1>Mock interview</h1><p class="lede">A timed, spoken rehearsal. Questions arrive the way a panel asks them: an opener, then chains that start easy and push deeper in one domain, then a scripting question and a close.</p></header>
      ${T.state.activeSession?.mock ? `<p><a class="btn accent" href="#/mock?resume=1">Resume saved interview</a> <span class="small muted">The deadline continues while you are away.</span></p>` : ''}
      <div class="co co-core"><p class="co-t">How to run it</p><ul><li>Answer out loud before revealing, ideally standing at a whiteboard or paper.</li><li>Draw the circuit or waveform before you explain it.</li><li>State assumptions, give the mechanism, then a number, then the trade-off.</li><li>Grade yourself against the rubric honestly; misses go to review.</li></ul></div>
      <form id="mk" class="row" style="margin-top:16px;align-items:flex-end">
        <div class="field"><label for="ml">Length</label><select id="ml"><option value="20">20 min · 2 chains</option><option value="35">35 min · 3 chains</option><option value="45" selected>45 min · 4 chains</option><option value="50">50 min · 4 chains</option><option value="60">60 min · 4 chains</option></select></div>
        <div class="field"><label for="mb">Opener</label><select id="mb"><option value="1">Include a project or behavioural opener</option><option value="0">Technical only</option></select></div>
        <button class="btn accent" type="submit">Start the interview</button>
      </form>
      <p class="small muted" style="margin-top:12px">Chains are drawn from must-conquer domains for your lens (${T.esc(window.TAPEOUT_LENSES.find((l) => l.id === T.lens()).name)}). Change it on the Today page.</p>
    </div>`;
    el.querySelector('#mk').addEventListener('submit', (e) => { e.preventDefault(); T.state.activeSession = null; T.save(); location.hash = `#/mock?go=1&m=${el.querySelector('#ml').value}&b=${el.querySelector('#mb').value}`; });
  };

  function runMock(el, p) {
    if (T.state.activeSession?.mock) return runSession(el, [], '', true, { resume: true });
    const minutes = [20, 35, 45, 50, 60].includes(+p.m) ? +p.m : 45, chains = minutes <= 20 ? 2 : minutes <= 35 ? 3 : 4;
    const lens = T.lens();
    const doms = T.shuffle(window.TAPEOUT_DOMAINS.filter((d) => d.id !== 'story' && d.id !== 'code' && d.tier[lens] === 1));
    const extra = T.shuffle(window.TAPEOUT_DOMAINS.filter((d) => d.id !== 'story' && d.id !== 'code' && d.tier[lens] === 2));
    const pick = doms.concat(extra).slice(0, chains);
    const plan = [];
    if (p.b !== '0') { const op = T.shuffle(T.allQ().filter((q) => q.d === 'story'))[0]; if (op) plan.push(Object.assign({}, op, { _stage: 'Opener' })); }
    pick.forEach((d) => {
      [1, 2, 3].forEach((lvl) => {
        const pool = T.allQ().filter((q) => q.d === d.id && (q.lvl || 2) === lvl);
        const authored = pool.filter((q) => !q.vault);
        const q = T.shuffle(authored.length ? authored : pool)[0];
        if (q && !plan.some((x) => x.id === q.id)) plan.push(Object.assign({}, q, { _stage: `${d.name}: ${['', 'warm-up', 'apply it', 'push deeper'][lvl]}` }));
      });
    });
    const codePool = T.allQ().filter((q) => q.d === 'code');
    const code = T.shuffle(codePool.filter(q => !q.vault).length ? codePool.filter(q => !q.vault) : codePool)[0];
    if (code) plan.push(Object.assign({}, code, { _stage: 'Scripting' }));
    const close = T.allQ().find((q) => q.id === 'STORY-12');
    if (close) plan.push(Object.assign({}, close, { _stage: 'Close' }));
    runSession(el, plan, `Mock interview · ${minutes} min`, true, { minutes });
  }
  T.runSession = runSession;
})();
