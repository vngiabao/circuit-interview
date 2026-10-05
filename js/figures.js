/* One figure contract across learning, practice and coding. */
(function () {
  const T = window.T;
  T.figureList = (value) => (Array.isArray(value) ? value : value ? [value] : []).map(f => typeof f === 'string' ? f.startsWith('plot:') ? {plot: f.slice(5)} : {src: f} : f).filter(Boolean);
  T.questionFigures = q => {
    const list = T.figureList(q.figs), old = T.figureList(q.fig);
    return old.concat(list).filter((f,i,a) => a.findIndex(x => JSON.stringify(x) === JSON.stringify(f)) === i);
  };
  T.figure = function (input) {
    const f = T.figureList(input)[0];
    if (!f) return '';
    const title = f.alt || f.cap || f.schematic || f.plot || 'Timing diagram';
    const svg = f.schematic ? T.schematic(f.schematic, f.spec || {}) : f.waveform ? T.waveform(f.waveform) : f.plot ? T.plot(f.plot, f.spec || {}) : '';
    const media = svg || (f.src ? `<img src="${T.esc(f.src)}" alt="${T.esc(title)}" loading="lazy">` : '');
    if (!media) return '';
    const source = f.from || (f.plot ? 'Computed teaching model' : f.schematic || f.waveform ? 'Illustrative circuit or sequence' : '');
    const wide = f.schematic && T.schematicModel(f.schematic,f.spec || {}).kind === 'blocks' || ['ks','bk'].includes(f.plot) || f.from?.startsWith('EECS');
    return `<figure class="fig${wide?' fig-wide':''}"><button type="button" class="figure-open" data-figure-zoom aria-label="Enlarge figure: ${T.esc(title)}">${media}</button><figcaption><span class="figure-hint">Tap the figure to enlarge. </span>${T.md(f.cap || title, {inline:true})}${source ? ` <span class="src">${T.esc(source)}</span>` : ''}</figcaption></figure>`;
  };
  T.figures = value => T.figureList(value).map(T.figure).join('');
})();
