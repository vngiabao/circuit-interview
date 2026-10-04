/* Topic browsing order and a prerequisite-aware reading path. Original lesson
 * content and priorities stay in their authored/generated source files. */
(function () {
  const T = window.T;
  T.lessonTopics = [
    {d:'dev', ids:['cmos-foundations','dev-short-channel','leakage-mechanisms']},
    {d:'dly', ids:['rc-delay','logical-effort']},
    {d:'cmos', ids:['gate-sizing','cmos-dynamic']},
    {d:'pwr', ids:['gate-power','low-power-domains','adaptive-voltage']},
    {d:'seq', ids:['latch-storage','seq-latch-ff','setup-hold','seq-setup-hold','seq-clocking','seq-sta']},
    {d:'mem', ids:['sram-operation','sram-margins','bitline-sensing','rom-read-margins']},
    {d:'char', ids:['char-std-cell','spice-testbench','sequential-characterization','liberty-tables','leakage-characterization']},
    {d:'flow', ids:['flow-rtl-to-gds','physical-layout','physical-timing-repair','physical-parasitics-congestion','physical-scan-test']},
    {d:'int', ids:['wire-rc','coupling-noise','power-delivery']},
    {d:'var', ids:['variation-types','em-aging']},
    {d:'ana', ids:['analog-gm-ro','analog-current-mirrors','analog-differential-pair','analog-feedback-stability','analog-noise-offset','analog-sampling-adc']},
    {d:'arith', ids:['arith-adders','compute-in-memory']},
    {d:'rtl', ids:['rtl-sequential-semantics','rtl-fsm-fifo','rtl-puzzles','rtl-reset-verification']},
    {d:'cdc', ids:['metastability','cdc-protocols','rtl-cdc-handshake']},
    {d:'code', ids:['tcl-language','report-parsing','automation-audit']},
    {d:'story', ids:['story-method']}
  ];
  // Extra dependencies cover the foundational lessons that predate the
  // prerequisites field. Cross-topic edges can interleave the reading path;
  // the library itself remains grouped so a topic is easy to find.
  T.lessonDependencies = {
    'dev-short-channel':['cmos-foundations'],
    'cmos-dynamic':['gate-sizing','gate-power'],
    'seq-latch-ff':['latch-storage'],
    'seq-setup-hold':['setup-hold','seq-latch-ff'],
    'seq-clocking':['seq-setup-hold'],
    'seq-sta':['seq-clocking'],
    'char-std-cell':['gate-sizing'],
    'flow-rtl-to-gds':['char-std-cell'],
    'arith-adders':['gate-sizing','logical-effort'],
    'rtl-fsm-fifo':['rtl-sequential-semantics'],
    'rtl-puzzles':['rtl-fsm-fifo']
  };
  T.lessonPrereqs = u => [...new Set([...(u.prerequisites || []), ...(T.lessonDependencies[u.id] || [])])];
  T.lessonPath = () => {
    const pending = T.lessonTopics.flatMap(t => t.ids.map(T.unit)).filter(Boolean);
    const path = [], done = new Set();
    while (pending.length) {
      const i = pending.findIndex(u => T.lessonPrereqs(u).every(id => done.has(id)));
      if (i < 0) throw new Error('Lesson path has a missing or cyclic prerequisite');
      const [u] = pending.splice(i, 1); path.push(u); done.add(u.id);
    }
    return path;
  };
  T.nextLesson = () => T.lessonPath().find(u => T.state.units[u.id]?.status !== 'solid');
})();
