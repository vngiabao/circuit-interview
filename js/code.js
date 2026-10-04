/* Code corner: taught Python labs that run locally in Pyodide, plus read-and-predict drills. */
(function () {
  const T = window.T;
  const V = (T.views = T.views || {});
  const TRACKS = [
    ['basics', 'Python the way circuit engineers use it', 'Units, floats, list comprehensions and small numerical models you can write in an interview without numpy.'],
    ['parse', 'Parsing reports and logs', 'Regular expressions, robust parsing that fails loudly, and summarising thousands of timing or DRC lines.'],
    ['model', 'Modelling circuits numerically', 'Turn an equation from the lessons into code: RC, Elmore, logical effort, Monte Carlo, MTBF.'],
    ['algo', 'Interview algorithms for hardware people', 'Bit manipulation, Gray code, FIFO sizing, graph traversal of a netlist, and simulation of small FSMs.'],
  ];

  const WORKER_URL = new URL('py-worker.js', document.currentScript.src);
  let worker, pending, serial = 0;
  function complete(data, reset = false) {
    if (!pending) return;
    const p = pending; pending = null; clearTimeout(p.timer);
    if (reset && worker) { worker.terminate(); worker = null; }
    p.resolve(data);
  }
  function arm(ms, message) {
    if (!pending) return;
    clearTimeout(pending.timer);
    pending.timer = setTimeout(() => complete({ ok: false, out: message }, true), ms);
  }
  T.stopPython = () => complete({ ok: false, cancelled: true, out: 'Execution stopped. Your code is saved.' }, true);
  window.addEventListener('hashchange', T.stopPython);
  function run(code, tests, onStatus = () => {}) {
    return new Promise((resolve) => {
      if (pending) return resolve({ ok: false, busy: true, out: 'Another Python run is still active. Stop it before starting another.' });
      if (location.protocol === 'file:') return resolve({ ok: false, out: 'Python needs the site served over http. From the NVIDIA folder run:\n  python -m http.server 8427\nthen open http://localhost:8427/tapeout/' });
      if (!worker) {
        try { worker = new Worker(WORKER_URL, { type: 'module' }); }
        catch (e) { return resolve({ ok: false, out: 'Could not start the Python worker: ' + e.message }); }
        worker.onmessage = ({ data }) => {
          if (!pending || data.id !== pending.id) return;
          if (data.type === 'status') {
            pending.onStatus(data.text);
            if (data.phase === 'running') arm(20000, 'Stopped after 20 s of execution. Check for an infinite loop.');
          } else if (data.type === 'done') complete(data);
        };
        worker.onerror = (e) => complete({ ok: false, out: 'Python worker failed: ' + (e.message || 'could not load runtime') }, true);
        worker.onmessageerror = () => complete({ ok: false, out: 'Python returned an unreadable response. Try again.' }, true);
      }
      const id = ++serial;
      pending = { id, resolve, onStatus, timer: null };
      arm(90000, 'Python runtime loading timed out. Retry after checking that the runtime files are available.');
      try { worker.postMessage({ id, code, tests }); }
      catch (e) { complete({ ok: false, out: 'Could not start execution: ' + e.message }, true); }
    });
  }
  T.runPython = run;
  V.code = (el) => {
    const reading = T.allQ().filter((q) => q.d === 'code' || q.d === 'rtl' || q.f === 'spot' || (q.tags || []).includes('read-code'));
    el.innerHTML = `<div class="page">
      <header class="head"><h1>Code corner</h1><p class="lede">${T.labs.length} Python labs with teaching and executable tests, plus ${reading.length} automation and RTL questions. Python runs locally in your browser; the app does not upload your code.</p></header>
      <div class="co co-core"><p class="co-t">Code the engineering checks</p><p>Practice parsing reports, calculating from tables, interpreting RTL, automating checks and modelling equations. State units and assumptions, test edge cases, and make missing or invalid evidence fail visibly. These exercises build habits you can apply to circuit workflows and explain in interviews.</p></div>
      ${TRACKS.map(([k, t, s]) => { const labs = T.labs.filter((l) => l.track === k); if (!labs.length) return ''; return `<section class="sec"><h2>${t}</h2><p class="sub">${s}</p><ul class="ulist">${labs.map((l) => { const st = T.state.labs[l.id] || {}; return `<li class="${st.passed ? 'done' : ''}"><a href="#/lab/${l.id}"><span class="t">${T.esc(l.title)}</span><span class="m">L${l.level || 1} · ${l.mins || 15} min</span><span class="s">${T.esc(l.goal)}</span></a></li>`; }).join('')}</ul></section>`; }).join('')}
      ${reading.length ? `<section class="sec"><h2>Automation and RTL questions</h2><p class="sub">Practice script behavior, robust flow checks and the hardware implied by RTL.</p>
        <ul class="qlist">${reading.map((q) => `<li><a href="#/q/${q.id}"><span class="qid">${q.id}</span><span class="qt">${T.esc(T.qtitle(q))}</span><span class="qm">${T.domain(q.d).code} · L${q.lvl || 2}</span></a></li>`).join('')}</ul></section>` : ''}
    </div>`;
  };

  V.lab = (el, id) => {
    const l = T.labs.find((x) => x.id === id);
    if (!l) return V.notFound(el);
    const st = (T.state.labs[l.id] = T.state.labs[l.id] || {});
    const i = T.labs.indexOf(l), next = T.labs[i + 1];
    el.innerHTML = `<div class="page">
      <nav class="crumbs"><a href="#/code">Code corner</a><span>/</span><span>${T.esc(TRACKS.find((t) => t[0] === l.track)[1])}</span></nav>
      <header class="head"><h1>${T.esc(l.title)}</h1><p class="lede">${T.esc(l.goal)}</p></header>
      <div class="lab-grid">
        <article class="md">
          ${T.md(l.teach)}
          ${l.task ? `<div class="co co-key"><p class="co-t">Your task</p>${T.md(l.task)}</div>` : ''}
          ${l.hints && l.hints.length ? `<div class="hints"></div><button class="btn ghost sm" id="hint">Show a hint (${l.hints.length})</button>` : ''}
          <div id="after" ${st.passed ? '' : 'hidden'}>${l.explain ? `<div class="co co-why"><p class="co-t">Why this solution, and what they ask next</p>${T.md(l.explain)}</div>` : ''}</div>
          <details class="deeper" style="margin-top:16px"><summary>Reference solution</summary><pre class="code"><code>${T.esc(l.solution)}</code></pre></details>
        </article>
        <div class="editor-wrap">
          <label class="lbl" for="ed">solution.py</label>
          <textarea id="ed" class="editor" spellcheck="false" autocapitalize="off" autocomplete="off">${T.esc(st.code ?? l.starter)}</textarea>
          <div class="row"><button class="btn accent" id="test">Run tests</button><button class="btn ghost" id="run">Run</button><button class="btn ghost" id="stop" hidden>Stop</button><span class="spacer"></span><button class="btn quiet sm" id="reset">Reset code</button></div>
          <pre id="console" class="console" aria-live="polite">${st.passed ? 'Passed earlier. Run again any time.' : 'Output appears here. Ctrl+Enter runs the tests.'}</pre>
          ${next ? `<a class="btn ghost sm" href="#/lab/${next.id}" style="justify-self:end">Next lab: ${T.esc(next.title)} →</a>` : ''}
        </div>
      </div></div>`;
    const ed = el.querySelector('#ed'), con = el.querySelector('#console');
    ed.addEventListener('input', () => { st.code = ed.value; st.passed = false; T.save(); });
    ed.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText('    ', s, ed.selectionEnd, 'end'); ed.dispatchEvent(new Event('input')); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); go(true); }
    });
    let hi = 0;
    const hb = el.querySelector('#hint');
    if (hb) hb.addEventListener('click', () => { el.querySelector('.hints').insertAdjacentHTML('beforeend', `<div class="co co-sketch"><p class="co-t">Hint ${hi + 1}</p>${T.md(l.hints[hi])}</div>`); hi++; if (hi >= l.hints.length) hb.remove(); else hb.textContent = `Another hint (${l.hints.length - hi} left)`; });
    let busy = false;
    const after = el.querySelector('#after'), stop = el.querySelector('#stop');
    async function go(tests) {
      if (busy) return;
      busy = true;
      const btns = el.querySelectorAll('#test,#run');
      btns.forEach((b) => { b.dataset.state = 'loading'; b.disabled = true; });
      stop.hidden = false; ed.disabled = true;
      st.code = ed.value; T.save();
      con.className = 'console';
      const r = await run(ed.value, tests ? l.tests : null, text => { con.textContent = text; });
      busy = false;
      btns.forEach((b) => { delete b.dataset.state; b.disabled = false; });
      stop.hidden = true; ed.disabled = false;
      con.textContent = r.out;
      con.classList.add(r.ok ? 'ok' : 'bad');
      if (tests && !r.busy) { st.passed = !!r.ok; st.t = Date.now(); st.output = r.out; T.save(); after.hidden = !r.ok; if (r.ok && ed.isConnected) T.toast('All tests passed.'); }
    }
    el.querySelector('#test').addEventListener('click', () => go(true));
    el.querySelector('#run').addEventListener('click', () => go(false));
    stop.addEventListener('click', T.stopPython);
    el.querySelector('#reset').addEventListener('click', () => { if (busy) return; if (confirm('Replace your code with the starter?')) { ed.value = l.starter; st.code = l.starter; st.passed = false; after.hidden = true; T.save(); } });
  };

})();
