/* Browser regression harness, excluded from the published build. Uses real DOM
 * renderers and real question handlers; does not write study progress. */
(function () {
  const frame = document.querySelector('iframe'), report = document.querySelector('#qa-report');
  frame.addEventListener('load', async () => {
    const w = frame.contentWindow, doc = w.document, T = w.T, V = T.views;
    const theme = new URLSearchParams(location.search).get('theme') || 'dark';
    const failures = [], errors = [], counts = {}, clipping = new Set();
    let renders = 0;
    T.save = () => {}; T.toast = () => {}; T.state.settings.hideCompany = false;
    T.state.settings.theme = theme; T.applyTheme();
    const host = doc.querySelector('#main');
    w.addEventListener('error', e => errors.push(e.message));
    w.addEventListener('unhandledrejection', e => errors.push(String(e.reason)));
    const pause = () => new Promise(r => requestAnimationFrame(r));
    function inspect(name) {
      renders++;
      if (host.querySelector('.math-error')) failures.push(name + ': math parse error');
      if (/Something broke on this page/.test(host.textContent)) failures.push(name + ': error view');
      if (doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 2) failures.push(name + ': horizontal page overflow');
      host.querySelectorAll('svg[viewBox]').forEach(svg => {
        const b = svg.viewBox.baseVal;
        if (!svg.getBoundingClientRect().width) return;
        svg.querySelectorAll('text').forEach(text => {
          const t = text.getBoundingClientRect(), b = svg.getBoundingClientRect();
          if (t.left < b.left - 1 || t.top < b.top - 1 || t.right > b.right + 1 || t.bottom > b.bottom + 1) clipping.add(name + ': ' + text.textContent);
        });
      });
      host.querySelectorAll('p,pre,li').forEach(x => {
        if (!x.closest('.katex') && !x.querySelector('.katex') && /^\s*(logic,max|c-q|t_su)\s*$/.test(x.textContent)) failures.push(name + ': isolated equation fragment');
      });
      if (renders % 25 === 0) report.textContent = `Running ${theme} ${doc.documentElement.clientWidth}px: ${renders} rendered states; ${failures.length} failures`;
    }
    async function render(name, fn) {
      try { await fn(); inspect(name); } catch(e) { failures.push(name + ': ' + e.message); }
      if (renders % 10 === 0) await pause();
    }
    await doc.fonts.ready;
    for (const u of T.units) await render('lesson ' + u.id, () => V.unit(host,u.id));
    counts.lessons = T.units.length;
    const questions = T.allQ();
    for (const q of questions) {
      await render('question ' + q.id, () => {
        host.innerHTML = '<div class="page narrow"><div id="question-host"></div></div>';
        T.renderQuestion(host.querySelector('#question-host'),q);
        if (host.querySelector('.answer-figures')) throw Error('answer figure leaked before reveal');
      });
      await render('answer ' + q.id, () => host.querySelector('[data-act="giveup"],[data-act="reveal"]').click());
    }
    counts.questions = questions.length; counts.answers = questions.length;
    for (const l of T.labs) await render('lab ' + l.id, () => V.lab(host,l.id));
    counts.labs = T.labs.length;
    const domains = w.TAPEOUT_DOMAINS;
    for (const d of domains) {
      await render('domain ' + d.id, () => V.domain(host,d.id));
      await render('figure sheet ' + d.id, () => V.figureSheet(host,d.id));
    }
    counts.domains = domains.length; counts.figureSheets = domains.length;
    for (const key of Object.keys(w.TAPEOUT_LECTURES)) await render('slides ' + key, () => V.slides(host,key));
    for (const [name,fn] of [['home',()=>V.home(host)],['learn',()=>V.learn(host)],['bank',()=>V.bank(host,{})],['drill',()=>V.drill(host,{})],['mock',()=>V.mock(host,{})],['code',()=>V.code(host)],['sheets',()=>V.sheets(host)],['stories',()=>V.stories(host)],['sources',()=>V.sources(host)],['settings',()=>V.settings(host)],['plan',()=>V.plan(host)]]) await render(name,fn);
    for (const r of w.TAPEOUT_REFERENCES) await render('reference ' + r.id, () => V.reference(host,r.id));
    counts.references = w.TAPEOUT_REFERENCES.length;
    // Real mock disclosure: a figure-driven prompt stays visible, a contextual
    // drawing is hidden until the native disclosure is opened.
    const q = questions.find(q => T.questionFigures(q).length && !q.figureDriven);
    if (q) await render('mock sketch-first', () => {
      host.innerHTML = '<div class="page narrow"><div id="question-host"></div></div>';
      T.renderQuestion(host.querySelector('#question-host'),q,{oral:true,sketchFirst:true});
      const details = host.querySelector('.sketch-compare');
      if (!details || details.open) throw Error('sketch-first disclosure missing or open');
      details.open = true;
      if (!details.querySelector('svg,img')) throw Error('compare diagram missing');
    });
    V.figureSheet(host,domains[0].id);
    const result = {theme,width:w.innerWidth,renders,counts,failures,errors,clippedLabels:[...clipping]};
    report.textContent = JSON.stringify(result,null,2);
    report.dataset.complete = 'true';
  });
})();
