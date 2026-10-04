/* A repeatable plan, driven by the selected role and actual lesson progress. */
(function () {
  const T = window.T;
  T.views.plan = (el) => {
    const cfg = T.state.settings.plan || { minutes: 45, days: 5, deadline: '' };
    const minutes = [30,45,60].includes(+cfg.minutes) ? +cfg.minutes : 45;
    const days = Math.max(3, Math.min(7, +cfg.days || 5));
    const tier = (u) => T.tierOf(T.domain(u.d)) || 3;
    const pending = T.units.filter((u) => T.state.units[u.id]?.status !== 'solid')
      .sort((a,b) => tier(a)-tier(b) || window.TAPEOUT_DOMAINS.findIndex(d=>d.id===a.d)-window.TAPEOUT_DOMAINS.findIndex(d=>d.id===b.d) || (a.order||0)-(b.order||0));
    const chosen = [], picked = new Set();
    function add(u) {
      if (!u || picked.has(u.id)) return;
      picked.add(u.id);
      (u.prerequisites || []).forEach((id) => { const p = T.unit(id); if (p && T.state.units[id]?.status !== 'solid') add(p); });
      chosen.push(u);
    }
    pending.forEach(add);
    const date = cfg.deadline && /^\d{4}-\d{2}-\d{2}$/.test(cfg.deadline) ? new Date(cfg.deadline+'T12:00:00') : null;
    const remaining = date && !isNaN(date) ? Math.ceil((date-new Date())/86400000) : null;
    const split = minutes === 30 ? [15,10,5] : minutes === 45 ? [25,15,5] : [30,20,10];
    el.innerHTML = `<div class="page narrow"><header class="head"><h1>Your weekly plan</h1><p class="lede">Conquer the fundamentals for your role, then extend your range. The next sessions follow your remaining lessons and prerequisites.</p></header>
      <div class="row plan-controls"><div class="field"><label for="plan-min">Minutes per session</label><select id="plan-min">${[30,45,60].map(n=>`<option value="${n}" ${n===minutes?'selected':''}>${n} minutes</option>`).join('')}</select></div><div class="field"><label for="plan-days">Sessions this week</label><select id="plan-days">${[3,4,5,6,7].map(n=>`<option value="${n}" ${n===days?'selected':''}>${n} sessions</option>`).join('')}</select></div><div class="field"><label for="plan-date">Interview date (optional)</label><input type="date" id="plan-date" value="${T.esc(cfg.deadline || '')}"></div></div>
      <p class="small muted">Role: ${T.esc(window.TAPEOUT_LENSES.find(x=>x.id===T.lens())?.name || 'Circuit design')}. <a href="#/settings">Change role</a>. A lesson can span sessions; mark it solid only after passing its checkpoints.</p>
      ${remaining !== null ? `<div class="co co-why"><p class="co-t">${remaining >= 0 ? `${remaining} days until your interview` : 'Your saved interview date has passed'}</p><p>${remaining >= 0 && remaining <= 3 ? 'Prioritize missed must-conquer questions, your project evidence, and one full mock. Use the last evening for keycards and rest.' : 'Use the weekly cycle below. Schedule a mock before the final week, then direct the remaining sessions toward the gaps it exposes.'}</p></div>` : ''}
      <section class="unit-block"><h2>Your priority order</h2><ol><li><b>Must conquer:</b> explain the mechanism, solve a numerical case, and handle a changed assumption.</li><li><b>How to excel:</b> compare design choices, corners, failure modes, and verification.</li><li><b>Good to know:</b> build breadth after the core is reliable.</li></ol><p>Keep project-specific preparation alongside every tier: state your own contribution and support each claimed result.</p></section>
      <section class="unit-block"><h2>This week's sessions</h2><ol class="plan-list">${Array.from({length:days},(_,i)=>{
        const u=chosen[i];
        return `<li><h3>Session ${i+1} · ${u ? T.esc(u.title) : 'Consolidate your weak areas'}</h3><p>${split[0]} min learn and solve · ${split[1]} min retrieval practice · ${split[2]} min spoken explanation.</p>${u ? `<p><a class="btn accent sm" href="#/unit/${u.id}">Open lesson</a> <a class="btn ghost sm" href="#/drill?mode=domain&d=${u.d}">Practice ${T.esc(T.domain(u.d).code)}</a></p>` : '<a class="btn ghost sm" href="#/drill?mode=due">Review due questions</a>'}<p class="small muted">Exit check: explain without notes, solve once unaided, and name one trap.${u?.labIds?.length ? ` Then try <a href="#/lab/${u.labIds[0]}">the linked coding lab</a>.` : ''}</p></li>`;
      }).join('')}</ol></section>
      <section class="unit-block"><h2>End-of-week review</h2><p>Revisit missed answers and check whether your reasoning survives follow-ups. A correct guess is still a gap.</p><div class="row"><a class="btn" href="#/drill?mode=weak">Review weak areas</a><a class="btn ghost" href="#/mock">Schedule a 45–60 minute mock</a><a class="btn ghost" href="#/stories">Rehearse a project</a></div></section>
      <section class="unit-block"><h2>The day before</h2><p>Review <a href="#/sheets">equation keycards</a>, two project stories, and your questions for the interviewer. Check the meeting link, time zone, audio, camera, and the interview's permitted-tool rules. Leave time to rest.</p></section></div>`;
    ['plan-min','plan-days','plan-date'].forEach(id=>el.querySelector('#'+id).addEventListener('change',()=>{
      T.state.settings.plan = {minutes:+el.querySelector('#plan-min').value,days:+el.querySelector('#plan-days').value,deadline:el.querySelector('#plan-date').value};
      T.save(); T.views.plan(el);
    }));
  };
})();
