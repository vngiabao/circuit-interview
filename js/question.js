/* Question card: attempt first, then check, then the full worked answer, then a self-grade that schedules review. */
(function () {
  const T = window.T;
  const KEYS = 'ABCDEFGH';

  const norm = (s) => String(s || '').toLowerCase().replace(/[\s_\-.,;:'"()]+/g, ' ').trim();
  const objective = (q) => ['mcq', 'multi', 'tf', 'num', 'text', 'order'].includes(q.f) || (q.f === 'spot' && q.opts);
  T.isObjective = objective;

  function meta(q) {
    const d = T.domain(q.d);
    const unit = q.u ? T.unit(q.u) : null;
    return `<div class="qmeta">
      <span class="idtag">${T.esc(q.id)}</span>
      <a class="tag" href="#/learn/${q.d}">${T.esc(d ? d.code : q.d)}</a>
      <span class="tag lvl${q.lvl || 2}">${T.esc(T.LVL[q.lvl || 2])}</span>
      <span class="tag">${T.esc(T.FMT[q.f] || q.f)}</span>
      ${q.vault ? `<span class="faint small">from ${T.esc(q.src)}</span>` : q.src ? `<span class="faint small">${T.esc(q.src)}</span>` : ''}
      ${unit ? `<a class="small" href="#/unit/${unit.id}">Lesson: ${T.esc(unit.title)}</a>` : ''}
    </div>`;
  }

  function inputArea(q, order, drafts) {
    const f = q.f === 'spot' && q.opts ? 'mcq' : q.f;
    if (f === 'mcq' || f === 'multi') {
      const type = f === 'multi' ? 'checkbox' : 'radio';
      return `<fieldset class="opts" aria-label="${f === 'multi' ? 'Select all that apply' : 'Choose one answer'}">
        <legend class="lbl" style="margin-bottom:6px">${f === 'multi' ? 'Select all that apply' : 'Choose one answer'}</legend>
        ${order.map((i, k) => `<label class="opt" data-i="${i}"><input type="${type}" name="o-${q.id}" value="${i}"><span class="key">${KEYS[k]}</span><span class="body">${T.md(q.opts[i], { inline: true })}</span></label>`).join('')}
      </fieldset>`;
    }
    if (f === 'tf') {
      return `<fieldset class="opts" aria-label="True or false"><legend class="lbl" style="margin-bottom:6px">True or false? Then say why before you check.</legend>
        <label class="opt" data-i="1"><input type="radio" name="o-${q.id}" value="1"><span class="key">T</span><span class="body">True</span></label>
        <label class="opt" data-i="0"><input type="radio" name="o-${q.id}" value="0"><span class="key">F</span><span class="body">False</span></label></fieldset>`;
    }
    if (f === 'num') {
      return `<div class="field"><label for="num-${q.id}">Your answer${q.unit ? ` (${T.esc(q.unit)})` : ''}</label>
        <div class="numrow"><input id="num-${q.id}" type="text" inputmode="decimal" autocomplete="off" placeholder="e.g. 0.69"><span class="faint small">Enter a number${q.unit ? ` in ${T.esc(q.unit)}, or include a compatible unit` : ''}. E-notation is accepted; expressions are not evaluated.</span></div></div>`;
    }
    if (f === 'text') {
      return `<div class="field"><label for="txt-${q.id}">Your answer</label><div class="numrow"><input id="txt-${q.id}" type="text" autocomplete="off"></div></div>`;
    }
    if (f === 'order') {
      return `<p class="lbl">Put these in order (top = first). Use the arrows.</p><ol class="order-list">${order.map((i, k) => `<li data-i="${i}"><span class="pos">${k + 1}</span><span>${T.md(q.items[i], { inline: true })}</span><span class="row"><button class="btn quiet sm" data-mv="-1" aria-label="Move up">↑</button><button class="btn quiet sm" data-mv="1" aria-label="Move down">↓</button></span></li>`).join('')}</ol>`;
    }
    const saved = drafts[q.id] || '';
    return `<div class="field"><label for="dr-${q.id}">${q.f === 'oral' ? 'Say it out loud first. Optional: jot your key points.' : q.f === 'design' ? 'Sketch on paper, then list your design decisions here (optional).' : 'Draft your answer (optional, saved locally).'}</label>
      <textarea id="dr-${q.id}" placeholder="Mechanism, assumptions, numbers, trade-off...">${T.esc(saved)}</textarea></div>`;
  }

  const SI = { f: 1e-15, p: 1e-12, n: 1e-9, u: 1e-6, 'µ': 1e-6, m: 1e-3, k: 1e3, K: 1e3, M: 1e6, G: 1e9 };
  const unitParts = (unit) => {
    const m = String(unit || '').replace(/μ/g, 'µ').match(/^([fpnuµmkKMG]?)(s|V|A|F|H|W|J|Hz|Ω|ohm)$/);
    return m ? { base: m[2] === 'ohm' ? 'Ω' : m[2], scale: m[1] ? SI[m[1]] : 1 } : null;
  };
  function parseNum(s, unit = '') {
    s = String(s ?? '').trim().replace(/μ/g, 'µ').replace(/×\s*10\^?/, 'e');
    const m = s.match(/^([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)\s*([^\s]*)$/i);
    if (!m) return NaN;
    const v = Number(m[1]), suffix = m[2];
    if (!Number.isFinite(v)) return NaN;
    if (!suffix || suffix === unit) return v;
    const target = unitParts(unit), input = unitParts(suffix);
    if (input && target && input.base === target.base) return v * input.scale / target.scale;
    if (Object.hasOwn(SI, suffix) && (!unit || target)) return v * SI[suffix] / (target ? target.scale : 1);
    return NaN;
  }
  T.parseNumber = parseNum;

  T.renderQuestion = function (host, q, opts = {}) {
    const drafts = opts.drafts || T.state.drafts;
    const f = q.f === 'spot' && q.opts ? 'mcq' : q.f;
    const shuffle = (f === 'mcq' || f === 'multi') && q.shuffle !== false && !q.vault ? T.shuffle([...q.opts.keys()], hash(q.id)) : f === 'order' ? T.shuffle([...q.items.keys()], hash(q.id) + 7) : q.opts ? [...q.opts.keys()] : [];
    if (f === 'order' && shuffle.every((v, i) => v === i)) shuffle.reverse();
    const prompt = opts.oral && q.oral ? q.oral : q.q;
    host.innerHTML = `<article class="qcard" data-q="${q.id}">
      ${meta(q)}
      <div class="qprompt md">${T.md(prompt)}</div>
      ${opts.sketchFirst && T.questionFigures(q).length ? `<details class="sketch-compare"><summary>Sketch first, then compare the diagram</summary>${T.figures(T.questionFigures(q))}</details>` : T.figures(T.questionFigures(q))}
      <div class="qinput">${inputArea(q, shuffle, drafts)}</div>
      <div class="fb"></div>
      <div class="row qbtns">
        ${objective(q) ? `<button class="btn accent" data-act="check">Check answer</button>` : `<button class="btn accent" data-act="reveal">Reveal model answer</button>`}
        ${q.hint ? `<button class="btn ghost" data-act="hint">Hint</button>` : ''}
        ${objective(q) ? `<button class="btn quiet" data-act="giveup">Show answer</button>` : ''}
      </div>
      <div class="hintbox"></div>
      <div class="rv"></div>
    </article>`;
    const card = host.firstElementChild;
    let result = null, done = false, graded = false;

    const ta = card.querySelector('textarea');
    if (ta) ta.addEventListener('input', () => { drafts[q.id] = ta.value; T.save(); });

    card.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => {
      const li = b.closest('li'), dir = +b.dataset.mv, list = li.parentElement;
      if (dir < 0 && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (dir > 0 && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      [...list.children].forEach((x, k) => (x.querySelector('.pos').textContent = k + 1));
      b.focus();
    }));

    const fb = (cls, html) => (card.querySelector('.fb').innerHTML = `<div class="feedback ${cls}">${html}</div>`);

    function check(giveUp) {
      if (done) return;
      if (f === 'mcq' || f === 'multi' || f === 'tf') {
        const picked = [...card.querySelectorAll('.opts input:checked')].map((i) => +i.value);
        if (!picked.length && !giveUp) return fb('note', 'Pick an answer first, or use <b>Show answer</b>.');
        const right = f === 'tf' ? [q.ans ? 1 : 0] : f === 'multi' ? q.ans : [q.ans];
        result = !giveUp && picked.length === right.length && picked.every((p) => right.includes(p));
        card.querySelector('.opts').classList.add('locked');
        card.querySelectorAll('.opts input').forEach((i) => (i.disabled = true));
        card.querySelectorAll('.opt').forEach((el) => {
          const i = +el.dataset.i;
          if (right.includes(i)) el.classList.add('right');
          else if (picked.includes(i)) el.classList.add('wrong');
          if (q.why && q.why[i] && f !== 'tf') el.insertAdjacentHTML('beforeend', `<div class="why">${T.md(q.why[i], { inline: true })}</div>`);
        });
      } else if (f === 'num') {
        const inp = card.querySelector('input');
        const v = parseNum(inp.value, q.unit || '');
        if (!giveUp && !Number.isFinite(v)) return fb('note', `Enter one finite number${q.unit ? ` in ${T.esc(q.unit)} or with a compatible unit` : ''}; do not enter an expression or extra text.`);
        const tol = q.tolAbs != null ? q.tolAbs : Math.abs(q.ans) * (q.tol != null ? q.tol : 0.05);
        result = !giveUp && Math.abs(v - q.ans) <= tol + 1e-30;
        inp.disabled = true;
        fb(result ? 'ok' : 'bad', `<b>${result ? 'Within tolerance.' : giveUp ? 'Answer:' : 'Not quite.'}</b> <span>Expected ${fmtNum(q.ans)}${q.unit ? ' ' + T.esc(q.unit) : ''} (±${q.tolAbs != null ? fmtNum(q.tolAbs) : Math.round((q.tol ?? 0.05) * 100) + '%'}).${!giveUp && !isNaN(v) ? ` You entered ${fmtNum(v)}.` : ''}</span>`);
      } else if (f === 'text') {
        const inp = card.querySelector('input');
        if (!inp.value.trim() && !giveUp) return fb('note', 'Type an answer first, or use <b>Show answer</b>.');
        result = !giveUp && q.acc.some((a) => norm(a) === norm(inp.value));
        inp.disabled = true;
        fb(result ? 'ok' : 'bad', `<b>${result ? 'Correct.' : 'Accepted answer:'}</b> <span>${T.esc(q.acc[0])}</span>`);
      } else if (f === 'order') {
        const lis = [...card.querySelectorAll('.order-list li')];
        result = !giveUp && lis.every((li, k) => +li.dataset.i === k);
        lis.forEach((li, k) => { li.classList.add(+li.dataset.i === k ? 'right' : 'wrong'); li.querySelectorAll('button').forEach((b) => (b.disabled = true)); });
        if (!result) card.querySelector('.order-list').insertAdjacentHTML('afterend', `<p class="small"><b>Correct order:</b> ${q.items.map((s, i) => `${i + 1}. ${T.md(s, { inline: true })}`).join(' &nbsp; ')}</p>`);
      }
      if (f === 'mcq' || f === 'multi' || f === 'tf') fb(result ? 'ok' : 'bad', `<b>${result ? 'Correct.' : giveUp ? 'Here is the answer.' : 'Not this time.'}</b>${f === 'multi' && !result ? ' <span>Every correct option must be selected and no others.</span>' : ''}`);
      reveal();
    }

    function reveal() {
      if (done) return;
      done = true;
      card.querySelectorAll('[data-act="check"],[data-act="giveup"],[data-act="reveal"],[data-act="hint"]').forEach((b) => b.remove());
      const parts = [];
      if (q.afig) parts.push(`<section class="answer-figures"><h4>Trace the solution</h4>${T.figures(q.afig)}</section>`);
      if (q.ex) parts.push(`<section><h4>Why</h4><div class="md">${T.md(q.ex)}</div></section>`);
      if (q.a && !q.vault) parts.push(`<section><h4>Model answer</h4><div class="md">${T.md(q.a)}</div></section>`);
      if (q.say) parts.push(`<section><h4>Say it like this (≈30 s)</h4><p class="say">${T.md(q.say, { inline: true })}</p></section>`);
      if (q.rub && q.rub.length) parts.push(`<section><h4>Did your answer hit these points?</h4><ul class="rubric">${q.rub.map((r, i) => `<li><label><input type="checkbox" data-rub="${i}"><span>${T.md(r, { inline: true })}</span></label></li>`).join('')}</ul></section>`);
      if (q.trap) parts.push(`<div class="co co-trap"><p class="co-t">Trap</p>${T.md(q.trap)}</div>`);
      if (q.fu && q.fu.length) parts.push(`<section><h4>Where the interviewer goes next</h4><ul class="fu">${q.fu.map((x) => `<li>${T.md(x, { inline: true })}</li>`).join('')}</ul></section>`);
      if (q.vault && q.a) parts.push(`<details class="deeper" ${q.f !== 'mcq' ? 'open' : ''}><summary>${q.f === 'mcq' ? 'Full answer from your notes' : 'Answer from your notes'}</summary><div class="md">${T.md(q.a)}</div></details>`);
      if (q.vault && q.oral && q.oral !== q.q) parts.push(`<p class="small muted"><b>Interview phrasing:</b> ${T.esc(q.oral)}</p>`);
      const rec = objective(q) ? (result ? 2 : 0) : null;
      parts.push(`<div class="grade no-print"><p class="lbl">How solid was that?</p><div class="row">${[['Again', 'today', 0], ['Hard', '1 day', 1], ['Good', 'later', 2], ['Easy', 'much later', 3]].map(([l, s, g]) => `<button data-g="${g}" ${rec === g ? 'aria-pressed="true"' : ''}>${l}<small>${s}</small></button>`).join('')}</div></div>`);
      card.querySelector('.rv').innerHTML = `<div class="reveal">${parts.join('')}</div>`;
      const rubBoxes = card.querySelectorAll('[data-rub]');
      rubBoxes.forEach((b) => b.addEventListener('change', () => {
        const hit = [...rubBoxes].filter((x) => x.checked).length / rubBoxes.length;
        const g = hit >= 0.99 ? 3 : hit >= 0.66 ? 2 : hit >= 0.34 ? 1 : 0;
        card.querySelectorAll('[data-g]').forEach((x) => x.setAttribute('aria-pressed', String(+x.dataset.g === g)));
      }));
      card.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => {
        if (graded) return;
        graded = true;
        const g = objective(q) && result === false ? 0 : +b.dataset.g;
        card.querySelectorAll('[data-g],[data-rub]').forEach((x) => (x.disabled = true));
        card.querySelectorAll('[data-g]').forEach((x) => x.setAttribute('aria-pressed', String(+x.dataset.g === g)));
        const s = T.record(q.id, g, objective(q) ? result : undefined);
        if (opts.onDone) opts.onDone({ q, grade: g, correct: objective(q) ? result : g >= 2, s });
        else T.toast(g === 0 ? 'Back in your review queue today.' : `Next review in ${Math.round((s.due - T.today()) / 86400000)} day(s).`);
      }));
      if (opts.onReveal) opts.onReveal({ q, correct: result });
    }

    card.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'check') check(false);
      if (act.dataset.act === 'giveup') check(true);
      if (act.dataset.act === 'reveal') reveal();
      if (act.dataset.act === 'hint') { card.querySelector('.hintbox').innerHTML = `<div class="co co-sketch"><p class="co-t">Hint</p>${T.md(q.hint)}</div>`; act.remove(); }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !done && e.target.matches('input[type="text"]')) { e.preventDefault(); check(false); }
    });
    card._check = () => (objective(q) ? check(false) : reveal());
    card._pick = (k) => {
      if (done) return;
      const inputs = card.querySelectorAll('.opts input');
      if (inputs[k]) { inputs[k].checked = !inputs[k].checked || inputs[k].type === 'radio'; inputs[k].focus(); }
    };
    return card;
  };

  function fmtNum(v) {
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e4 || a < 1e-2) return v.toExponential(3).replace(/\.?0+e/, 'e');
    return String(+v.toPrecision(4));
  }
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  T.hash = hash;
})();
