/* Learning-side views: dashboard, domains, units, sheets, stories, sources, settings. */
(function () {
  const T = window.T;
  const V = (T.views = T.views || {});
  const D = () => window.TAPEOUT_DOMAINS;
  T.lens = () => T.state.settings.lens || 'circuit';
  T.tierOf = (d) => d.tier[T.lens()];
  const TIER = { 1: 'Must conquer', 2: 'How to excel', 3: 'Good to know' };
  const lensSeg = () => `<div class="seg" role="group" aria-label="Role lens">${window.TAPEOUT_LENSES.map((l) => `<button data-lens="${l.id}" aria-pressed="${T.lens() === l.id}">${l.name}</button>`).join('')}</div>`;
  const bindLens = (root, rerender) => root.querySelectorAll('[data-lens]').forEach((b) => b.addEventListener('click', () => { T.state.settings.lens = b.dataset.lens; T.save(); rerender(); }));
  const unitsOf = (did) => (T.lessonTopics.find(t => t.d === did)?.ids || []).map(T.unit).filter(Boolean);
  T.unitsOf = unitsOf;
  const ustatus = (u) => (T.state.units[u.id] && T.state.units[u.id].status) || 'new';

  const TIER_SHORT = { 1: 'must conquer', 2: 'excel', 3: 'breadth' };
  function tile(d) {
    const t = T.tierOf(d);
    const s = T.domainStats(d.id);
    const cover = s.total ? s.seen / s.total : 0;
    const segs = 12, on = Math.max(cover > 0 ? 1 : 0, Math.round(cover * segs));
    const hot = s.acc != null && s.acc < 0.6 && s.seen >= 3;
    return `<a class="tile t${t}" href="#/learn/${d.id}" aria-label="${T.esc(d.name)}: ${s.seen} of ${s.total} questions attempted">
      <div><div class="top"><span class="code">${d.code}</span><span class="tlab">${TIER_SHORT[t]}</span></div><div class="nm">${T.esc(d.name)}</div></div>
      <div style="display:grid;gap:8px"><div class="meter" aria-hidden="true">${Array.from({ length: segs }, (_, i) => `<i class="${i < on ? (hot ? 'hot' : 'on') : ''}"></i>`).join('')}</div>
      <div class="stat"><span>${s.seen}/${s.total} tried</span><span>${s.due ? `<span class="due">${s.due} due</span>` : s.acc != null ? T.fmtPct(s.acc) : s.units ? `${s.unitsDone}/${s.units} lessons` : ''}</span></div></div>
    </a>`;
  }

  function nextUnit() {
    return T.nextLesson();
  }
  T.nextUnit = nextUnit;

  V.home = (el) => {
    const due = T.dueList().length;
    const attempts = Object.values(T.state.q);
    const week = Date.now() - 7 * 86400000;
    let wn = 0, wok = 0;
    attempts.forEach((s) => (s.hist || []).forEach(([t, g, auto]) => { if (t > week) { wn++; if (auto === true || (auto === null && g >= 2)) wok++; } }));
    const u = nextUnit();
    const lab = T.labs.find((l) => !(T.state.labs[l.id] && T.state.labs[l.id].passed)) || T.labs[0];
    const story = T.shuffle(T.allQ().filter((q) => q.d === 'story' && !q.vault), T.today() / 86400000 | 0)[0];
    const doms = D().slice().sort((a, b) => T.tierOf(a) - T.tierOf(b));
    const must = doms.filter((d) => T.tierOf(d) === 1);
    const left = T.units.filter((x) => must.some((d) => d.id === x.d) && ustatus(x) !== 'solid').length;
    const hr = new Date().getHours();
    const hello = hr < 5 ? 'Late night session.' : hr < 12 ? 'Good morning.' : hr < 18 ? 'Good afternoon.' : 'Good evening.';
    const lens = window.TAPEOUT_LENSES.find((l) => l.id === T.lens());
    el.innerHTML = `<div class="page">
      <header class="head"><h1>${hello}</h1>
        <p class="lede">${due ? `${due} question${due > 1 ? 's' : ''} due for review. ` : ''}${left} must-conquer lesson${left === 1 ? '' : 's'} left for ${T.esc(lens.name.toLowerCase())}.</p>
        <div class="row">${lensSeg()}</div>
      </header>
      <div class="dash">
        <section class="panel next" aria-label="Next lesson">
          <span class="label">Next lesson</span>
          ${u ? `<span class="dom">${T.esc(T.domain(u.d).code)} · ${u.mins || 15} min</span><h2>${T.esc(u.title)}</h2><p>${T.esc(u.goal || '')}</p>
          ${u.figs && u.figs.find(f => f.schematic && !f.schematic.startsWith('timing-')) ? `<div class="next-figure">${T.figure(u.figs.find(f => f.schematic && !f.schematic.startsWith('timing-')))}</div>` : ''}
          <ul class="anatomy">${[u.model && 'Mental model', (u.eq || []).length && `${u.eq.length} equation${u.eq.length > 1 ? 's' : ''}`, (u.figs || []).length && `${u.figs.length} figure${u.figs.length > 1 ? 's' : ''}`, u.worked && 'Worked example', (u.traps || []).length && `${u.traps.length} traps`, u.say && '30-second answer', (u.checks || []).length && `${u.checks.length} checks`].filter(Boolean).map((x) => `<li>${x}</li>`).join('')}</ul>
          <div class="row"><a class="btn accent" href="#/unit/${u.id}">Open lesson</a><a class="btn ghost" href="#/plan">Weekly plan</a></div>` : `<h2>Every lesson is marked solid.</h2><p>Keep the knowledge warm with reviews and a mock interview.</p><div class="row"><a class="btn accent" href="#/mock">Start a mock</a></div>`}
        </section>
        <div class="side-stack">
          <div class="panel readout" aria-label="Your numbers"><div><b class="${due ? 'hot' : ''}">${due}</b><span>due today</span></div><div><b>${attempts.length}</b><span>questions tried</span></div><div><b>${wn ? T.fmtPct(wok / wn) : '-'}</b><span>last 7 days</span></div></div>
          <div class="panel"><span class="label">Today's loop</span><ul class="todo">
            <li><a href="#/drill?mode=${due ? 'due' : 'quick'}"><span class="t">${due ? 'Clear your reviews' : 'Quick ten'}</span><span class="s">${due ? `${due} scheduled for today` : 'Ten auto-checked questions, new first'}</span><span class="go">→</span></a></li>
            ${lab ? `<li><a href="#/lab/${lab.id}"><span class="t">One coding rep</span><span class="s">${T.esc(lab.title)}</span><span class="go">→</span></a></li>` : ''}
            ${story ? `<li><a href="#/q/${story.id}"><span class="t">Say one answer out loud</span><span class="s">${T.esc(story.title || story.q)}</span><span class="go">→</span></a></li>` : ''}
            <li><a href="#/mock"><span class="t">Mock interview</span><span class="s">Timed, spoken, with follow-up chains</span><span class="go">→</span></a></li>
          </ul></div>
        </div>
      </div>
      <div class="sec-head"><div><h2>Domains</h2><p>Ordered for ${T.esc(lens.name.toLowerCase())}. Each meter fills as you attempt that domain's questions.</p></div><a class="btn ghost sm" href="#/lessons">All lessons</a></div>
      <div class="tiles">${doms.map(tile).join('')}</div>
      <div class="legend"><span><i class="top"></i>Yellow top edge: must conquer</span><span><i></i>Share attempted</span><span><i class="bad"></i>Accuracy under 60%</span></div>
      <div class="sec-head"><div><h2>How this works</h2></div></div>
      <div class="method">
        <div class="panel"><h3>Understand</h3><p>Each lesson gives the mental model, the few equations that matter, a worked example, the traps, and a 30-second spoken answer.</p></div>
        <div class="panel"><h3>Attempt before reveal</h3><p>${T.allQ().length} questions. Commit to an answer, check it, then read why every option is right or wrong.</p></div>
        <div class="panel"><h3>Rehearse and revisit</h3><p>Grade yourself honestly. Misses return today, solid answers return in days to weeks.</p></div>
      </div>
      <p class="small faint" style="margin-top:24px">Progress lives in this browser only. Back it up in <a href="#/settings">Settings</a>.</p>
    </div>`;
    bindLens(el, () => V.home(el));
  };

  V.learn = (el) => {
    const doms = D().slice().sort((a, b) => T.tierOf(a) - T.tierOf(b));
    el.innerHTML = `<div class="page">
      <header class="head"><h1>Learn</h1><p class="lede">Choose your interview priorities by role. For a topic-by-topic reading path, open Lessons.</p><div class="row">${lensSeg()}<a class="btn ghost" href="#/lessons">Browse all lessons</a></div></header>
      <div class="tiers">${[1, 2, 3].map((t) => `<div class="tier t${t}"><h3>${TIER[t]} <small>${doms.filter((d) => T.tierOf(d) === t).length} domains</small></h3>
        <ul class="ulist">${doms.filter((d) => T.tierOf(d) === t).map((d) => { const s = T.domainStats(d.id); return `<li><a href="#/learn/${d.id}"><span class="t">${T.esc(d.name)}</span><span class="m">${s.unitsDone}/${s.units} solid</span><span class="s">${T.esc(d.blurb)}</span></a></li>`; }).join('')}</ul></div>`).join('')}</div>
    </div>`;
    bindLens(el, () => V.learn(el));
  };

  V.lessons = (el, p = {}) => {
    const next = T.nextLesson();
    const statusLabel = {new:'Not started', learning:'Learning', solid:'Solid'};
    el.innerHTML = `<div class="page lesson-library">
      <header class="head"><h1>Lessons</h1><p class="lede">${T.units.length} lessons, grouped into ${T.lessonTopics.length} topics. Build from devices and delay to circuits, implementation and interview extensions. Open any lesson directly.</p></header>
      <div class="lesson-start panel">
        <div><h2>${next ? 'Your next step' : 'Your reading path is complete'}</h2><p>${next ? `<a href="#/unit/${next.id}">${T.esc(next.title)}</a>` : 'Every lesson is marked solid. Revisit a topic or test yourself in a drill.'}</p><p class="small muted">The suggested path puts prerequisites first. Topic lists run from foundations to deeper applications; linked prerequisites help you move between topics.</p></div>
        <a class="btn accent" href="${next ? '#/unit/'+next.id : '#/drill'}">${next ? 'Open next lesson' : 'Start a drill'}</a>
      </div>
      <div class="lesson-filters">
        <div class="field"><label for="lesson-search">Find a lesson</label><input id="lesson-search" type="search" placeholder="Try setup, SRAM or feedback" value="${T.esc(p.q || '')}"></div>
        <div class="field"><label for="lesson-topic">Topic</label><select id="lesson-topic"><option value="">All topics</option>${T.lessonTopics.map(t => `<option value="${t.d}">${T.esc(T.domain(t.d).name)}</option>`).join('')}</select></div>
        <div class="field"><label for="lesson-status">Progress</label><select id="lesson-status"><option value="">All lessons</option><option value="new">Not started</option><option value="learning">Learning</option><option value="solid">Solid</option></select></div>
      </div>
      <div class="lesson-results"><p class="small muted" id="lesson-result-count" role="status"></p><button class="btn ghost sm" data-reset-lessons>Clear filters</button></div>
      <div id="lesson-groups"></div>
    </div>`;
    const search = el.querySelector('#lesson-search'), topic = el.querySelector('#lesson-topic'), progress = el.querySelector('#lesson-status');
    topic.value = T.domain(p.topic) ? p.topic : '';
    progress.value = statusLabel[p.status] ? p.status : '';
    function update() {
      const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let count = 0;
      el.querySelector('#lesson-groups').innerHTML = T.lessonTopics.map(t => {
        if (topic.value && topic.value !== t.d) return '';
        const d = T.domain(t.d), all = unitsOf(t.d);
        const shown = all.filter(u => (!progress.value || ustatus(u) === progress.value) && terms.every(term => `${u.title} ${u.goal || ''} ${(u.tags || []).join(' ')} ${d.name}`.toLowerCase().includes(term)));
        if (!shown.length) return '';
        count += shown.length;
        return `<section class="lesson-topic" aria-labelledby="topic-${t.d}">
          <div class="sec-head"><div><h2 id="topic-${t.d}">${T.esc(d.name)}</h2><p>${all.filter(u => ustatus(u) === 'solid').length}/${all.length} solid · ${all.reduce((sum,u) => sum + (u.mins || 15),0)} min total</p></div><a class="btn ghost sm" href="#/learn/${t.d}">Topic overview</a></div>
          <ol class="lesson-list panel">${shown.map(u => `<li>
            <a class="lesson-open" href="#/unit/${u.id}"><span class="lesson-number" aria-label="Lesson ${all.indexOf(u)+1} in this topic">${all.indexOf(u)+1}</span><span class="lesson-copy"><b>${T.esc(u.title)}</b><span>${T.esc(u.goal || '')}</span><span class="lesson-meta"><span>${u.mins || 15} min</span><span>${TIER[u.tier || 2]}</span><span class="lesson-state ${ustatus(u)}">${statusLabel[ustatus(u)] || statusLabel.new}</span></span></span><svg class="ico lesson-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></a>
            ${T.lessonPrereqs(u).length ? `<div class="lesson-prereqs"><span>Before this:</span> ${T.lessonPrereqs(u).map(id => `<a href="#/unit/${id}">${T.esc(T.unit(id).title)}</a>`).join('<span aria-hidden="true"> · </span>')}</div>` : ''}
          </li>`).join('')}</ol>
        </section>`;
      }).join('') || '<div class="empty-state"><h3>No lessons match these filters</h3><p>Try a shorter search or clear the filters to see every topic.</p></div>';
      el.querySelector('#lesson-result-count').textContent = `${count} of ${T.units.length} lessons shown`;
      el.querySelector('[data-reset-lessons]').hidden = !search.value && !topic.value && !progress.value;
      const query = new URLSearchParams();
      if (search.value) query.set('q', search.value);
      if (topic.value) query.set('topic', topic.value);
      if (progress.value) query.set('status', progress.value);
      // Keep filters when opening a lesson and returning with browser Back.
      history.replaceState(null, '', '#/lessons' + (query.size ? '?' + query : ''));
    }
    search.addEventListener('input', update);
    topic.addEventListener('change', update);
    progress.addEventListener('change', update);
    el.querySelector('[data-reset-lessons]').addEventListener('click', () => { search.value = ''; topic.value = ''; progress.value = ''; update(); search.focus(); });
    update();
  };

  V.domain = (el, id) => {
    const d = T.domain(id);
    if (!d) return V.notFound(el);
    const s = T.domainStats(id);
    const us = unitsOf(id);
    const lec = d.lectures.filter((k) => (window.TAPEOUT_LECTURES || {})[k]);
    const eqs = us.flatMap((u) => (u.eq || []).map((e) => ({ e, u })));
    el.innerHTML = `<div class="page">
      <nav class="crumbs"><a href="#/learn">Learn</a><span>/</span><span>${d.code}</span></nav>
      <header class="head"><h1>${T.esc(d.name)}</h1><p class="lede">${T.esc(d.blurb)}</p></header>
      <div class="status-row"><span><b>${TIER[T.tierOf(d)]}</b> for ${T.esc(window.TAPEOUT_LENSES.find((l) => l.id === T.lens()).name)}</span><span>${s.total} questions</span><span>${s.seen} attempted</span><span>review success ${T.fmtPct(s.acc)}</span><span>${s.due} due</span>
        <span class="spacer"></span><a class="btn ghost sm" href="#/lessons?topic=${id}">Browse lessons</a><a class="btn accent sm" href="#/drill?mode=domain&d=${id}">Drill this domain</a><a class="btn ghost sm" href="#/bank?d=${id}">Browse questions</a></div>
      <div class="co co-why"><p class="co-t">Why interviewers ask</p><p>${T.esc(d.why)}</p></div>
      ${T.domainFigures && T.domainFigures[id] ? `<section class="sec"><h2>Trace the mechanisms</h2><div class="figure-strip">${T.figures(T.domainFigures[id])}</div><a class="btn ghost sm" href="#/figures/${id}">Open printable figure sheet</a></section>` : ''}
      <section class="sec"><h2>Lessons</h2>
        ${us.length ? `<ul class="ulist panel">${us.map((u) => `<li class="${ustatus(u) === 'solid' ? 'done' : ''}"><a href="#/unit/${u.id}"><span class="t">${T.esc(u.title)}</span><span class="m">${TIER[u.tier || 2]} · ${u.mins || 15} min</span><span class="s">${T.esc(u.goal || '')}</span></a></li>`).join('')}</ul>` : `<div class="empty-state"><h3>No lessons here yet</h3><p>The question bank still covers this domain.</p></div>`}
      </section>
      ${eqs.length ? `<section class="sec"><h2>Keycard</h2><p class="sub">Review each formula with its circuit and operating conditions.</p><a class="btn ghost" href="#/sheets?topic=${id}">Open contextual equation sheet</a></section>` : ''}
      ${lec.length ? `<section class="sec"><h2>Original lecture figures</h2><p class="sub">Captioned slides from your EECS lecture packets.</p><ul class="ulist panel">${lec.map((k) => `<li><a href="#/slides/${k}"><span class="t">EECS ${k.split('-')[0]} lecture ${k.split('-')[1]}: ${T.esc(window.TAPEOUT_LECTURES[k])}</span><span class="m">${(window.TAPEOUT_SLIDES || []).filter((x) => x.lec === k).length} figures</span></a></li>`).join('')}</ul></section>` : ''}
    </div>`;
  };

  const figHTML = f => T.figure(f);

  V.unit = (el, id) => {
    const u = T.unit(id);
    if (!u) return V.notFound(el);
    const d = T.domain(u.d);
    const sib = T.lessonPath(), i = sib.indexOf(u);
    const st = T.state.units[u.id] || {};
    const slides = T.lessonSlides(u);
    const sections = [];
    const add = (key, title, html) => { if (html) sections.push({ key, title, html }); };
    add('prereqs', 'Before this lesson', T.lessonPrereqs(u).length ? `<ul>${T.lessonPrereqs(u).map((id) => { const p = T.unit(id); return p ? `<li><a href="#/unit/${p.id}">${T.esc(p.title)}</a></li>` : `<li>${T.esc(id)}</li>`; }).join('')}</ul>` : '');
    add('model', 'The mental model', u.model ? `<div class="md">${T.md(u.model)}</div>` : '');
    add('eq', 'Equations that matter', u.eq && u.eq.length ? `<div class="eqs">${u.eq.map((e) => `<div class="eq-row"><div class="tex">${T.tex(e[0], true)}</div><div class="note">${T.md(e[1] || '', { inline: true })}</div></div>`).join('')}</div>` : '');
    add('fig', 'Picture it', T.figures([...(u.figs || []), ...slides.slice(0, 2).map(T.lectureFigure)]));
    const structured = !!(u.model || u.say);
    if (!structured) add('body', 'Go deeper', u.body ? `<div class="md">${T.md(u.body)}</div>` : '');
    add('worked', 'Worked example', u.worked ? `<div class="md"><div class="co co-key"><p class="co-t">Problem</p>${T.md(u.worked.q)}</div><details class="deeper"><summary>Try it first, then open the solution</summary><div class="md">${T.md(u.worked.a)}</div></details></div>` : '');
    add('traps', 'Traps', u.traps && u.traps.length ? `<ul class="traps">${u.traps.map((t) => `<li><span>${T.md(t, { inline: true })}</span></li>`).join('')}</ul>` : '');
    add('say', 'Say it in 30 seconds', u.say ? `<p class="say">${T.md(u.say, { inline: true })}</p>` : '');
    add('ask', 'Where interviewers push next', u.ask && u.ask.length ? `<ul class="fu">${u.ask.map((x) => `<li>${T.md(x, { inline: true })}</li>`).join('')}</ul>` : '');
    add('takeaways', 'What to retain', (u.takeaways || []).length ? `<div class="co co-core"><ul>${u.takeaways.map((x) => `<li>${T.md(x, { inline: true })}</li>`).join('')}</ul></div>` : '');
    add('understanding', 'Prove you understand', (u.understandingChecks || []).length ? `<p class="muted">Close the explanation and do each task unaided. These are your own checkpoints.</p>${u.understandingChecks.map((x, n) => `<label class="lesson-check"><input type="checkbox" data-understanding="${n}" ${(st.checks || {})[n] ? 'checked' : ''}><span>${T.md(x, { inline: true })}</span></label>`).join('')}` : '');
    add('labs', 'Apply it in code', (u.labIds || []).length ? `<ul>${u.labIds.map((id) => { const l = T.labs.find((x) => x.id === id); return l ? `<li><a href="#/lab/${id}">${T.esc(l.title)}</a></li>` : ''; }).join('')}</ul>` : '');
    add('check', 'Check yourself', (u.checks || []).length ? `<div class="checks"></div>` : '');
    if (structured && u.body) add('notes-src', 'Full notes from your sources', `<details class="source-notes"><summary>Original lecture and drill notes for this topic <span>${Math.round(u.body.length / 1000)}k characters</span></summary><div class="md">${T.md(u.body)}</div></details>`);
    add('slides', 'From your lecture slides', slides.length ? `<div class="slides">${slides.slice(0, 12).map((s) => `<figure><img src="${s.f}" alt="${T.esc(s.cap)}" loading="lazy"><figcaption>${T.esc(s.cap)}</figcaption></figure>`).join('')}</div>${slides.length > 12 ? `<p>Complete source galleries: ${[...new Set(slides.map(s => s.lec))].map(lec => `<a href="#/slides/${lec}">EECS ${T.esc(lec.replace('-', ' lecture '))}</a>`).join(' · ')}</p>` : ''}` : '');
    const related = T.allQ().filter((q) => q.u === u.id || (q.d === u.d && (u.tags || []).some((t) => (q.tags || []).includes(t))));
    el.innerHTML = `<div class="page">
      <nav class="crumbs"><a href="#/lessons">Lessons</a><span>/</span><a href="#/lessons?topic=${d.id}">${T.esc(d.name)}</a></nav>
      <header class="head"><h1>${T.esc(u.title)}</h1>${u.goal ? `<p class="lede">${T.esc(u.goal)}</p>` : ''}</header>
      <div class="status-row no-print"><span>${u.mins || 15} min · ${TIER[u.tier || 2]}</span><span class="spacer"></span>
        <span class="lbl" id="ust">Your status</span><div class="seg" role="group" aria-labelledby="ust">${[['new', 'Not started'], ['learning', 'Learning'], ['solid', 'Solid']].map(([k, l]) => `<button data-st="${k}" aria-pressed="${(st.status || 'new') === k}">${l}</button>`).join('')}</div></div>
      <div class="reader-grid"><article>
        ${sections.map((s) => `<section class="unit-block" id="u-${s.key}"><h2>${s.title}</h2>${s.html}</section>`).join('')}
        <section class="unit-block no-print" id="u-notes"><h2>Your notes</h2><div class="field"><label for="un">Rewrite the model in your own words. Saved locally.</label><textarea id="un">${T.esc(T.state.notes[u.id] || '')}</textarea></div></section>
        ${related.length ? `<section class="unit-block no-print"><h2>Practice on this topic</h2><p><a class="btn ghost sm" href="#/bank?u=${u.id}">${related.length} related questions</a> <a class="btn ghost sm" href="#/drill?mode=domain&d=${u.d}">Drill ${d.code}</a></p></section>` : ''}
        <nav class="unit-nav no-print" aria-label="Recommended reading path">${i > 0 ? `<a href="#/unit/${sib[i - 1].id}"><span>Previous lesson</span><b>${T.esc(sib[i - 1].title)}</b></a>` : '<span></span>'}${i < sib.length - 1 ? `<a href="#/unit/${sib[i + 1].id}"><span>Next lesson · ${T.esc(T.domain(sib[i + 1].d).code)}</span><b>${T.esc(sib[i + 1].title)}</b></a>` : `<a href="#/lessons"><span>Reading path complete</span><b>Back to all lessons</b></a>`}</nav>
      </article>
      <nav class="toc" aria-label="On this page"><span class="lbl">On this page</span>${sections.map((s) => `<a href="#/unit/${u.id}" data-jump="u-${s.key}">${s.title}</a>`).join('')}<a href="#/unit/${u.id}" data-jump="u-notes">Your notes</a></nav></div>
    </div>`;
    el.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    el.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', () => {
      T.state.units[u.id] = Object.assign(T.state.units[u.id] || {}, { status: b.dataset.st, t: Date.now() }); T.save();
      el.querySelectorAll('[data-st]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const ta = el.querySelector('#un');
    el.querySelectorAll('[data-understanding]').forEach((c) => c.addEventListener('change', () => { const s = T.state.units[u.id] ||= {}; s.checks ||= {}; s.checks[c.dataset.understanding] = c.checked; T.save(); }));
    ta.addEventListener('input', T.debounce(() => { T.state.notes[u.id] = ta.value; T.save(); }, 300));
    const checks = el.querySelector('.checks');
    if (checks) (u.checks || []).map(T.getQ).filter(Boolean).forEach((q) => { const box = document.createElement('div'); box.style.marginBottom = '32px'; checks.appendChild(box); T.renderQuestion(box, q); });
    T.state.lastUnit = u.id; T.save();
  };

  V.slides = (el, lec) => {
    const list = (window.TAPEOUT_SLIDES || []).filter((s) => s.lec === lec);
    const title = (window.TAPEOUT_LECTURES || {})[lec];
    if (!list.length) return V.notFound(el);
    el.innerHTML = `<div class="page"><nav class="crumbs"><a href="#/sources">Sources</a><span>/</span><span>Lecture figures</span></nav>
      <header class="head"><h1>EECS ${lec.split('-')[0]} lecture ${lec.split('-')[1]}: ${T.esc(title)}</h1><p class="lede">${list.length} original figures with their verified captions. Click any figure to enlarge it.</p></header>
      <div class="slides">${list.map((s) => `<figure><img src="${s.f}" alt="${T.esc(s.cap)}" loading="lazy"><figcaption>${T.esc(s.cap)}${s.pg ? ` <span class="faint mono">p.${s.pg}</span>` : ''}</figcaption></figure>`).join('')}</div></div>`;
  };

  V.sheets = (el, p = {}) => {
    const doms = T.lessonTopics.map(t => T.domain(t.d));
    const selected = doms.some(d => d.id === p.topic && unitsOf(d.id).some(u => u.eq?.length)) ? p.topic : '';
    const sheetLesson = u => {
      const context = T.sheetContext[u.id];
      const legacy = (u.figs || []).filter(f => f.src || f.plot);
      const slides = T.lessonSlides(u), match = T.sheetLectureMatch[u.id];
      const lecture = slides.find(s => match?.test(s.cap)) || slides[0];
      const extra = lecture ? T.lectureFigure(lecture) : legacy[0];
      return `<section class="sheet-lesson" aria-labelledby="sheet-${u.id}">
        <h4 id="sheet-${u.id}"><a href="#/unit/${u.id}">${T.esc(u.title)}</a></h4>
        <div class="sheet-conditions"><p><b>Circuit and operating mode.</b> ${T.esc(context.mode)}</p><p><b>Symbols and limits.</b> ${T.esc(context.names)}</p></div>
        <div class="sheet-example">${T.figure({...(typeof context.diagram === 'string' ? {schematic:context.diagram} : context.diagram), cap:'Circuit context for '+u.title+'. Match the node names to the equations below.'})}${extra ? T.figure(extra) : ''}</div>
        <div class="sheet-equations">${u.eq.map(e => `<div class="eq-row"><div class="tex">${T.tex(e[0], true)}</div><div class="note">${T.md(e[1] || '', {inline:true})}</div></div>`).join('')}</div>
        <a class="btn ghost sm" href="#/unit/${u.id}">Open lesson and worked example</a>
      </section>`;
    };
    el.innerHTML = `<div class="page">
      <header class="head"><h1>Sheets</h1><p class="lede">Circuit context first, equations second. Each reference gives the operating mode, model limits and source lesson alongside its diagrams.</p>
        <div class="row no-print"><a class="btn ghost sm" href="#/sheets" data-k="eq">Keycards</a><a class="btn ghost sm" href="#/sheets" data-k="gl">Glossary</a><a class="btn ghost sm" href="#/sheets" data-k="fig">Figure sheets</a><button class="btn ghost sm" onclick="window.print()">Print</button></div></header>
      <div class="field sheet-topic-filter no-print"><label for="sheet-topic">Equation topic</label><select id="sheet-topic"><option value="">All topics</option>${doms.filter(d => unitsOf(d.id).some(u => u.eq?.length)).map(d => `<option value="${d.id}" ${selected === d.id ? 'selected' : ''}>${T.esc(d.name)}</option>`).join('')}</select></div>
      <section id="sh-eq"><h2 style="margin-bottom:16px">Keycards</h2><div class="context-keycards">${doms.filter(d => !selected || d.id === selected).map(d => { const us = unitsOf(d.id).filter(u => u.eq?.length); if (!us.length) return ''; return `<div class="keycard"><h3><span class="code">${d.code}</span>${T.esc(d.name)}</h3>${us.map(sheetLesson).join('')}</div>`; }).join('')}</div></section>
      <section class="sec" id="sh-fig"><h2>Figure sheets</h2><p class="sub">Open one domain to print its circuits, timing diagrams and model plots together.</p><ul class="ulist panel">${doms.map(d => `<li><a href="#/figures/${d.id}"><span class="t">${T.esc(d.name)}</span><span class="m">${(T.domainFigures[d.id] || []).length} diagrams</span></a></li>`).join('')}</ul></section>
      <section class="sec" id="sh-gl"><h2>Glossary</h2><dl class="glossary">${T.glossary.slice().sort((a, b) => a[0].localeCompare(b[0])).map(([t, def]) => `<div><dt>${T.esc(t)}</dt><dd>${T.md(def, { inline: true })}</dd></div>`).join('')}</dl></section>
    </div>`;
    el.querySelectorAll('[data-k]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('sh-' + a.dataset.k).scrollIntoView({ behavior: 'smooth' }); }));
    el.querySelector('#sheet-topic').addEventListener('change', e => { location.hash = '#/sheets' + (e.target.value ? '?topic=' + e.target.value : ''); });
  };

  V.figureSheet = (el, id) => {
    const d = T.domain(id);
    if (!d) return V.notFound(el);
    el.innerHTML = `<div class="page figure-sheet"><nav class="crumbs no-print"><a href="#/sheets">Sheets</a><span>/</span><a href="#/learn/${id}">${T.esc(d.name)}</a></nav><header class="head"><h1>${T.esc(d.name)}: figure sheet</h1><p class="lede">Trace each path, explain the changing state, then state the model assumptions.</p><button class="btn ghost sm no-print" data-print-figures>Print this domain</button></header><div class="figure-strip">${T.figures(T.domainFigures[id] || [])}</div></div>`;
    el.querySelector('[data-print-figures]').addEventListener('click', () => window.print());
  };

  const STORY_SLOTS = [
    ['proj', 'Your most relevant project', 'Walk me through the project you are proudest of.'],
    ['bug', 'The hardest bug you found', 'Tell me about a difficult problem you debugged.'],
    ['fail', 'A mistake or failure', 'Tell me about a time something you built did not work.'],
    ['team', 'Conflict or cross-team work', 'Tell me about a disagreement with a teammate or another group.'],
    ['time', 'Deadline pressure', 'Tell me about a tight deadline and what you cut.'],
    ['auto', 'Something you automated', 'Tell me about a time you made a repetitive task reliable.'],
  ];
  const FIELDS = [['spec', 'Specification and constraints', 'What had to work, by when, under what limits (PPA, corners, schedule)?'], ['role', 'Your part', 'Exactly what you owned. Use "I" for your work and name the team for the rest.'], ['choice', 'Design choices and why', 'Two decisions, each with the alternative you rejected.'], ['evidence', 'Evidence', 'Simulation, corners, measurements, numbers. Write [fill in] where you are unsure, then verify.'], ['debug', 'What went wrong and how you found it', 'Symptom, hypothesis, experiment, root cause.'], ['result', 'Result and what you would change', 'Outcome, plus one honest improvement.']];

  V.stories = (el) => {
    const s = T.state.stories;
    const behav = T.allQ().filter((q) => q.d === 'story');
    el.innerHTML = `<div class="page narrow">
      <header class="head"><h1>Stories</h1><p class="lede">Prepare six useful project and behavioural stories. Build each one around decisions and evidence, then rehearse it out loud in under two minutes.</p></header>
      <div class="co co-core"><p class="co-t">The shape that works for engineers</p><p><b>Spec → your part → choices → evidence → failure and debug → result.</b> Lead with the constraint, not the backstory. Every claim should survive "how do you know?". If a number is not verified, write <b>[fill in]</b> here and check it before you say it.</p></div>
      <div class="co co-guard"><p class="co-t">Keep ownership and evidence clear</p><ul><li>Use "I" for your contribution and "the team" for shared work.</li><li>Do not claim results or numbers you cannot substantiate.</li><li>Describe the actual debug history. Do not invent a failure to improve a story.</li></ul></div>
      ${STORY_SLOTS.map(([k, title, prompt]) => `<section class="unit-block"><h2>${title}</h2><p class="muted">Interviewer: "${prompt}"</p>${FIELDS.map(([f, l, help]) => `<div class="field" style="margin-bottom:12px"><label for="st-${k}-${f}">${l}</label><textarea id="st-${k}-${f}" data-sk="${k}" data-sf="${f}" placeholder="${T.esc(help)}" style="min-height:64px">${T.esc((s[k] || {})[f] || '')}</textarea></div>`).join('')}</section>`).join('')}
      <section class="sec"><h2>Behavioural and project questions</h2><p class="sub">${behav.length} prompts, including the personal ones from your own prep documents.</p>
        <ul class="qlist">${behav.map((q) => `<li><a href="#/q/${q.id}"><span class="qid">${q.id}</span><span class="qt">${T.esc(q.title || q.q)}</span><span class="qm">${q.vault ? 'your notes' : 'framework'}</span></a></li>`).join('')}</ul></section>
    </div>`;
    el.querySelectorAll('[data-sk]').forEach((ta) => ta.addEventListener('input', T.debounce(() => { const k = ta.dataset.sk; s[k] = s[k] || {}; s[k][ta.dataset.sf] = ta.value; T.save(); }, 300)));
  };

  V.sources = (el) => {
    const refs = window.TAPEOUT_REFERENCES || [];
    const lecs = Object.entries(window.TAPEOUT_LECTURES || {});
    el.innerHTML = `<div class="page"><header class="head"><h1>Sources</h1><p class="lede">Original Markdown, lecture figures and source labels behind the learning platform. Archived company context remains reference material; your weekly plan is independent of a past interview date.</p></header>
      <section class="unit-block"><h2>Study references</h2><ul class="ulist">${refs.map(r=>`<li><a href="#/reference/${r.id}"><span class="t">${T.esc(r.title)}</span><span class="m">${r.sections.length} sections</span><span class="s">Read with properly typeset equations and linked source figures.</span></a></li>`).join('')}</ul></section>
      <section class="unit-block"><h2>Lecture figure atlas</h2><p>${(window.TAPEOUT_SLIDES || []).length} figures from the EECS packets. Click any figure to enlarge it.</p><ul class="ulist">${lecs.map(([k,t])=>`<li><a href="#/slides/${k}"><span class="t">EECS ${k.split('-')[0]} · L${k.split('-')[1]} ${T.esc(t)}</span><span class="m">${(window.TAPEOUT_SLIDES || []).filter(s=>s.lec===k).length} figures</span></a></li>`).join('')}</ul></section>
      <section class="unit-block"><h2>How to read the evidence</h2><ul><li>Computed plots are teaching models, not PDK or silicon results.</li><li>Unverified personal claims remain [fill in]. Source statements are not new verification of project ownership.</li><li>Missing archival figures are labeled unavailable. Active lesson figures are bundled locally.</li><li>Review success combines objective checks and self-ratings. It is not a hiring prediction.</li></ul></section></div>`;
  };
  V.reference = async (el, id) => {
    const r = (window.TAPEOUT_REFERENCES || []).find(x=>x.id===id);
    if (!r) return V.notFound(el);
    el.innerHTML = `<div class="page narrow"><nav class="crumbs"><a href="#/sources">Sources</a><span>/</span><span>Archived reference</span></nav><header class="head"><h1>${T.esc(r.title)}</h1><p class="lede">${T.esc(r.description)}</p><a class="btn ghost sm" href="${T.esc(r.originalFile)}" download>Download original Markdown</a></header><div id="reference-body" class="md">Loading reference…</div></div>`;
    const host = el.querySelector('#reference-body');
    try {
      const res = await fetch(r.file);
      if (!res.ok) throw new Error('Reference could not be loaded.');
      const source = await res.text();
      if (!host.isConnected) return;
      host.innerHTML = T.md(source);
    } catch (e) { if (host.isConnected) host.innerHTML = `<p>${T.esc(e.message)} <a href="#/sources">Return to sources</a> and try again.</p>`; }
  };

  V.settings = (el) => {
    const st = T.state.settings;
    el.innerHTML = `<div class="page narrow"><header class="head"><h1>Settings</h1><p class="lede">Everything is stored in this browser only. Export a backup before clearing browser data or switching machines. To bring progress from the previous Study Studio address, export there and import its JSON backup here.</p></header>
      <section class="unit-block"><h2>Appearance</h2><div class="seg" role="group" aria-label="Theme">${[['auto', 'Match system'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => `<button data-theme="${k}" aria-pressed="${(st.theme || 'auto') === k}">${l}</button>`).join('')}</div></section>
      <section class="unit-block"><h2>Role lens</h2><p class="muted">Changes which domains are marked must-conquer and how mixed drills are weighted.</p>${lensSeg()}</section>
      <section class="unit-block"><h2>Company-specific questions</h2><label class="row" style="gap:10px"><input type="checkbox" id="hc" ${st.hideCompany ? 'checked' : ''}> <span>Hide the ${(window.TAPEOUT_VAULT || []).filter((v) => v.company).length} NVIDIA-specific prompts from your earlier prep (team, location, "why this company").</span></label></section>
      <section class="unit-block"><h2>Backup</h2><div class="row"><button class="btn" id="ex">Export progress</button><label class="btn ghost" for="im">Import progress</label><input type="file" id="im" accept="application/json" class="sr"><button class="btn quiet" id="rs">Reset all progress</button></div>
        <p class="small muted" style="margin-top:8px">${Object.keys(T.state.q).length} question records, ${Object.keys(T.state.units).length} lesson statuses, ${Object.keys(T.state.labs).length} labs, ${T.state.sessions.length} sessions.</p></section>
    </div>`;
    el.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => { st.theme = b.dataset.theme; T.save(); T.applyTheme(); V.settings(el); }));
    bindLens(el, () => V.settings(el));
    el.querySelector('#hc').addEventListener('change', (e) => { st.hideCompany = e.target.checked; T.save(); T.refreshCounts(); });
    el.querySelector('#ex').addEventListener('click', T.exportState);
    el.querySelector('#im').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; try { await T.importState(f); T.toast('Progress imported.'); V.settings(el); T.refreshCounts(); } catch (err) { T.toast(err.message); } });
    el.querySelector('#rs').addEventListener('click', () => { if (confirm('Delete all saved progress in this browser? Export first if you want a backup.')) { localStorage.removeItem('tapeout.v1'); location.reload(); } });
  };

  V.notFound = (el) => { el.innerHTML = `<div class="page"><div class="empty-state"><h3>That page does not exist</h3><p>The link may be from an older version. <a href="#/">Back to the dashboard</a>.</p></div></div>`; };
})();
