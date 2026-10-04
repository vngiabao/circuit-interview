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
    await render('lessons direct catalog', () => {
      V.lessons(host,{});
      if(host.querySelectorAll('.lesson-open').length!==T.units.length) throw Error('Not every lesson is directly accessible');
      if(host.querySelectorAll('.lesson-topic').length!==domainsCount()) throw Error('Topic separation missing');
      if(host.querySelector('[data-reset-lessons]').getBoundingClientRect().width) throw Error('Clear filters shown without a filter');
      const search=host.querySelector('#lesson-search');search.value='zzzz-no-lesson';search.dispatchEvent(new w.Event('input'));
      if(host.querySelectorAll('.lesson-open').length || !host.querySelector('.empty-state')) throw Error('Search empty state failed');
      host.querySelector('[data-reset-lessons]').click();
      if(host.querySelectorAll('.lesson-open').length!==T.units.length) throw Error('Clear filters failed');
      const topic=host.querySelector('#lesson-topic');topic.value='seq';topic.dispatchEvent(new w.Event('change'));
      if(host.querySelectorAll('.lesson-open').length!==T.units.filter(u=>u.d==='seq').length) throw Error('Topic filter failed');
    });
    function domainsCount(){return w.TAPEOUT_DOMAINS.length;}
    await render('lessons progress filter', () => {
      const saved=T.state.units; T.state.units={};
      try {
        T.state.units[T.units[0].id]={status:'learning'};V.lessons(host,{status:'learning'});
        if(host.querySelectorAll('.lesson-open').length!==1) throw Error('Progress filter failed');
      } finally {T.state.units=saved;}
    });
    await render('contextual sheets', () => {
      V.sheets(host);
      if(host.querySelectorAll('.sheet-lesson').length!==T.units.filter(u=>u.eq?.length).length) throw Error('Equation lesson context missing');
      for(const section of host.querySelectorAll('.sheet-lesson')){
        const context=section.querySelector('.sheet-conditions'),diagram=section.querySelector('.sheet-example'),math=section.querySelector('.sheet-equations');
        if(!context || !diagram.querySelector('svg') || !math.querySelector('.katex')) throw Error('Incomplete equation context');
        if(!(context.compareDocumentPosition(math)&w.Node.DOCUMENT_POSITION_FOLLOWING) || !(diagram.compareDocumentPosition(math)&w.Node.DOCUMENT_POSITION_FOLLOWING)) throw Error('Equation appears before its context');
      }
      if(!host.querySelector('.sheet-example img[src*="lectures"]')) throw Error('Original lecture crops not used in sheets');
    });
    await render('contextual sheets topic filter', () => V.sheets(host,{topic:'mem'}));
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
