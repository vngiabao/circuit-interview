/* One-line meanings for the imported lesson equations (they shipped with a generic placeholder note). */
(function () {
  const N = {
    'rc-delay': ['Step response of a driver charging a load; the 50% point is 0.69 RC.', 'Effective switching resistance: average of the full-current and half-voltage points, about ¾ VDD / IDSAT.'],
    'gate-power': ['Energy drawn from the supply to charge C from 0 to VDD is C·VDD², independent of driver resistance.', 'Half of it is dissipated in the pull-up during the charge.', 'The other half is stored on the capacitor and burned in the pull-down at the next discharge.', 'Average switching power; α is the 0→1 probability per cycle.'],
    'leakage-mechanisms': ['Subthreshold current: exponential in VGS, raised by DIBL (η VDS), lowered by body bias (kγ VSB).', 'Same law written with the off-current at VGS = 0 and the subthreshold swing S.', 'DIBL: effective threshold falls linearly with drain voltage.', 'Intermediate-node voltage in a 2-stack of off devices; it rises slightly, reverse-biasing the top device.', 'Resulting stack leakage: roughly a factor 10^(ηVDD/S) below a single off device.'],
    'logical-effort': ['Stage delay in τ units: effort (g·h) plus parasitic delay p.', 'Branching effort: total load over on-path load at each fork.', 'Path logical, branching and electrical effort multiply into path effort F.', 'Setting ∂D/∂h = 0 shows minimum delay needs equal effort in every stage.', 'Optimal stage effort and the resulting minimum path delay.', 'Same delay when n₂ inverters are added to reach the best stage count.'],
    'sram-operation': ['Read stability needs the pull-down N1 stronger than the access device N2.', 'Current balance at the read-disturbed node: access current in equals pull-down current out; solve for the read bump ΔV.', 'Cell ratio: pull-down strength over access strength (protects reads).', 'Writability needs the access device stronger than the pull-up; pull-up ratio PR must be small.'],
    'bitline-sensing': ['Bitline development time grows with capacitance and required swing, and falls with cell current.'],
    'rom-read-margins': ['Selected-0 read time (cell minus keeper current), and droop of an unselected bitline from N-1 leaking cells.'],
    'latch-storage': ['First-order TG-latch timing: setup through input TG and inverter, near-zero hold, clock-to-Q through the slave path.'],
    'setup-hold': ['Setup is the next-cycle max-delay race; hold is the same-cycle min-delay race.', 'Skew sign convention: capture (receiver) clock arrival minus launch clock arrival.', 'Setup with skew: positive skew relaxes the minimum period.', 'Hold with skew: positive skew makes hold harder.', 'Setup including clock jitter on both edges.', 'Hold including jitter, as derived in the lecture (conservative).'],
    'sequential-characterization': ['Setup and hold defined by a clock-to-Q pushout criterion (here 5%).', 'Metastable regeneration and the resulting MTBF expression.'],
    'metastability': ['Initial imbalance is proportional to how close data arrived to the clock edge.', 'Small-signal positive feedback: the imbalance drives a current that grows it.', 'Exponential growth with regeneration time constant τr = Cd/gm.', 'Time to resolve to a full logic level from an initial imbalance ΔV₀.', 'Failure means data arrived inside a window that shrinks exponentially with resolution time.', 'Probability that one data event causes a failure.', 'Failure rate and MTBF of the synchronizer.'],
    'cdc-protocols': ['Independent stages multiply failure probabilities, which is why a second flop helps so much.'],
    'wire-rc': ['Wire resistance from sheet resistance and the number of squares.', 'Wire capacitance: plates above and below plus two sidewall neighbours.', 'Elmore delay of a driver, distributed wire and load.'],
    'coupling-noise': ['Charge-sharing step on a floating victim.', 'Driven victim: the glitch shrinks as the victim driver gets faster relative to the aggressor.'],
    'power-delivery': ['Allowed supply impedance for a ripple fraction r.', 'Target impedance in terms of power: falls with V² as voltage drops.', 'Series RLC supply model and its resonance frequency.'],
    'em-aging': ["Black's equation: EM lifetime falls with current density (n ≈ 2) and exponentially with temperature."],
    'liberty-tables': ['Bilinear interpolation inside one Liberty table cell (x, y normalised to 0-1).'],
    'variation-types': ['Leakage is exponential in VT, so a Gaussian VT spread gives a skewed lognormal leakage spread.', 'Gate delay model: nominal plus a die-to-die term shared by all gates plus an independent within-die term.', 'Path mean and variance: correlated variation adds linearly, independent variation adds in quadrature.', 'Mismatch between two gates cancels the shared term and doubles the independent variance.'],
    'low-power-domains': ['Race-to-idle: energy is power times on-time.', 'Scaling V with f: energy per task falls roughly with the cube of the frequency reduction.'],
    'adaptive-voltage': ['Dynamic power, and the lecture example of an 18× reduction from combined V and f scaling.', 'Monitor-to-path mistracking adds in quadrature; keep about 3σ of margin.', 'Margin needed for supply changes faster than the detection and response loop.'],
    'compute-in-memory': ['System energy includes on-chip and off-chip data movement, not only compute.', 'Normalising TOPS between bit widths; a 1-bit figure looks 64× better than 8-bit.', 'Bitline accumulation: each active row adds a current proportional to input × weight.', 'Signal margin per level and the ADC offset it allows.'],
    'analog-gm-ro': ['Square-law transconductance, output resistance, and loaded common-source gain.'],
    'analog-differential-pair': ['Splitting inputs into common-mode and differential parts; the tail current is steered by gm·vid/2.'],
    'analog-current-mirrors': ['Mirror ratio including channel-length modulation; output must stay above about VOV.'],
    'analog-feedback-stability': ['Closed-loop gain from forward gain A and feedback β; loop gain L = Aβ sets accuracy and stability.'],
    'analog-noise-offset': ['RMS noise from density and bandwidth; uncorrelated amplifier, resistor and current noise add in power.'],
    'analog-sampling-adc': ['LSB size, quantisation noise and the ideal SNR of an N-bit converter.'],
    'rtl-sequential-semantics': ['Two registers in series: each takes its input from the previous cycle.'],
    'rtl-cdc-handshake': ['Example clock periods and the round-trip control latency of a handshake.'],
    'rtl-reset-verification': ['Reset release through a synchronizer takes one to two destination cycles.'],
    'physical-timing-repair': ['Setup slack with skew δ and setup uncertainty Us.', 'Hold slack with skew δ and hold uncertainty Uh.'],
    'physical-parasitics-congestion': ['Elmore delay of a driver, routed wire and load.'],
    'physical-scan-test': ['Longest scan chain and the shift time per pattern.'],
  };
  const GENERIC = 'See the lesson for definitions, assumptions and the worked example.';
  Object.entries(N).forEach(([id, notes]) => {
    const u = T.units.find((x) => x.id === id);
    if (!u || !u.eq) return;
    u.eq.forEach((e, i) => { if (notes[i] && (!e[1] || e[1] === GENERIC)) e[1] = notes[i]; });
  });
  // Anything left generic renders with no note rather than filler.
  T.units.forEach((u) => (u.eq || []).forEach((e) => { if (e[1] === GENERIC) e[1] = ''; }));
})();
