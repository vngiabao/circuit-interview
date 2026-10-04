/* Structured teaching for imported lessons, part 2: timing, CDC, characterization, interconnect, variation, physical design. */
(function () {
  const r = String.raw;
  T.upgradeUnits({
    'latch-storage': {
      model: r`Storage needs feedback. Two inverters in a loop are **bistable**: they have two stable states and one unstable balance point in between. A latch adds a way in: a transmission gate that, while the clock is active, drives the loop to a new value (transparent), and a second gate that closes the loop when the clock goes inactive (opaque, holding).

A **master-slave flip-flop** puts two latches on opposite clock phases. While CLK is low the master is transparent and tracks D, the slave holds Q. At the rising edge the master closes on whatever D was, and the slave opens to pass it to Q. Only one latch is ever transparent, so data cannot race through, provided the two clock phases do not overlap.

That proviso is the failure mode: if CLK and CLK-bar overlap (both high or both low briefly, from skew in the local clock inverter), both latches can be partly transparent and a fast D can race straight through. Robust flops generate local clocks carefully, use C²MOS structures that tolerate overlap with sharp edges, or add delay on short paths.`,
      say: r`Two cross-coupled inverters are bistable; a latch adds a gate that writes the loop while the clock is active and closes the feedback when it isn't. A flip-flop is a master latch transparent on one phase and a slave on the other, so only the value at the edge reaches Q. Its weak point is clock overlap: if both phases are briefly active, fast data can race through both latches.`,
      traps: ['Calling the latch edge-triggered.', 'Assuming CLK-bar switches instantly.', 'Using a dynamic latch where the clock can stop.'],
      ask: ['Draw the TG latch and the flop.', 'What does clock overlap do?', 'Static versus dynamic latch?'],
      figs: [{ src: 'assets/fig/circuits/master-slave-dff.svg', cap: 'Master-slave flip-flop from two TG latches.', from: 'Earlier studio circuit figure' }],
    },
    'setup-hold': {
      model: r`Two races, two inequalities. Define skew $\delta = t_{CLK2} - t_{CLK1}$, capture minus launch.

**Setup (next-cycle race)**: the slowest data launched at edge $k$ must arrive a setup time before edge $k+1$ at the capture flop: $t_{cq,max} + t_{logic,max} + t_{su} \le T + \delta$ (minus jitter). Too slow: lengthen T or speed the path.

**Hold (same-cycle race)**: the fastest data launched at edge $k$ must arrive after the capture flop has finished capturing the edge-$k$ value: $t_{cq,min} + t_{logic,min} \ge t_{hold} + \delta$. No T appears, so only delay fixes it.

Write the skew sign explicitly every time. Positive skew (capture late) adds to setup and subtracts from hold; any clock uncertainty is subtracted from both margins in signoff.`,
      say: r`Setup is the next-cycle race of the slowest path: clock-to-Q plus max logic plus setup must fit in T plus skew. Hold is the same-cycle race of the fastest path: min clock-to-Q plus min logic must exceed hold plus skew. T is only in setup, so frequency fixes setup and only delay fixes hold, and I always define skew as capture minus launch.`,
      traps: ['Adding T to the hold equation.', 'Using max delays in hold.', 'Flipping the skew sign mid-derivation.'],
      ask: ['Is positive skew good?', 'Silicon has a hold violation. Options?', 'How does jitter enter each check?'],
      worked: { q: r`$T = 1$ ns, $t_{cq} = 80$ ps (min 60), logic max 780 ps and min 30 ps, setup 50 ps, hold 40 ps, $\delta = -30$ ps. Check both.`, a: r`Setup: $80 + 780 + 50 = 910 \le 1000 - 30 = 970$, slack +60 ps. Hold: $60 + 30 = 90 \ge 40 - 30 = 10$, slack +80 ps. Negative skew hurt setup by 30 ps and helped hold by 30 ps.` },
    },
    'sequential-characterization': {
      model: r`Characterising a flop means finding where it stops behaving. Sweep the data arrival time relative to the clock and record clock-to-Q. Far from the edge, $t_{cq}$ is flat; as data gets close, the master's feedback starts from a smaller imbalance and resolves more slowly, so $t_{cq}$ **pushes out**, then capture fails.

Setup time is defined by a **criterion**, typically the arrival at which $t_{cq}$ has grown by 5-10% over nominal, not the failure cliff. That keeps the sum $t_{su}+t_{cq}$ near its minimum and makes the number repeatable. Hold is found the same way from the other side, with the setup side held generous.

Every constraint is a function of clock slew, data slew, output load, PVT and the criterion itself. A Liberty table stores setup and hold versus clock and data slew; the characterisation testbench must also check minimum pulse width and that the flop actually captured the right value, not only that $t_{cq}$ was measured.`,
      say: r`I sweep data arrival against the clock and watch clock-to-Q push out as data gets close, because the master loop starts closer to balance. Setup is where clock-to-Q grows by a chosen criterion like 10%, not the cliff, which keeps setup plus clock-to-Q minimal and repeatable. Each value depends on slews, load, PVT and the criterion, and the testbench must also verify the captured value.`,
      traps: ['Defining setup at the pass/fail cliff.', 'Reporting setup without the slews and load it was measured at.', 'Measuring t_cq without checking capture correctness.'],
      ask: ['Why can setup be negative?', 'How do you speed up characterisation of 2,000 cells?', 'Why do setup and hold interact?'],
      figs: [{ plot: 'pushout', cap: 'Clock-to-Q pushout versus setup margin with a 10% criterion.' }, { src: 'assets/fig/models/setup-hold-characterization.png', cap: 'Setup and hold characterisation with an explicit acceptance rule.', from: 'Earlier studio model figure' }],
    },
    'metastability': {
      model: r`If data changes inside the tiny aperture around a clock edge, the latch's cross-coupled inverters start almost exactly at their balance point. Near that point the loop is a small-signal amplifier with positive feedback: the imbalance grows as $\Delta V(t) = \Delta V_0 e^{t/\tau}$, where $\tau \approx C/g_m$ is the regeneration time constant. The closer to balance it starts, the longer it takes to resolve, and there is no upper bound.

Because data arrival is random relative to an asynchronous clock, the starting imbalance is random, and the probability of still being unresolved after time $t_r$ falls as $e^{-t_r/\tau}$. That gives

$$\text{MTBF} = \frac{e^{t_r/\tau}}{T_w f_{clk} f_{data}}$$

with $T_w$ the aperture. Every extra flop in a synchronizer adds roughly a clock period of $t_r$, multiplying MTBF by $e^{T/\tau}$. Better flops (larger $g_m/C$, smaller $\tau$) help exponentially.`,
      say: r`A setup or hold violation leaves the latch near its balance point, where positive feedback grows the imbalance exponentially with time constant C over gm, so resolution time has no bound. Probability of still being unresolved falls as e to the minus t over tau, giving MTBF equals e to the t over tau divided by the window times both frequencies. A second flop adds about a cycle of resolution time, which is an exponential gain.`,
      traps: ['Saying a synchronizer prevents metastability. It makes failure improbable.', 'Putting logic between the two synchronizer flops, which eats resolution time.', 'Quoting MTBF for one chip when a fleet runs millions.'],
      ask: ['Why two flops?', 'Why is a 10⁸-year MTBF not good enough for a data center?', 'How does upsizing the latch change τ?'],
      worked: { q: r`τ = 20 ps, $T_w$ = 20 ps, $f_{clk}$ = 1 GHz, $f_{data}$ = 100 MHz. One flop gives $t_r$ ≈ 0.85 ns. Compute MTBF, then with a second flop ($t_r$ ≈ 1.85 ns).`, a: r`Denominator $= 20\times10^{-12} \times 10^9 \times 10^8 = 2\times10^6$/s. One flop: $e^{42.5}/2\times10^6 \approx 2.9\times10^{18}/2\times10^6 = 1.4\times10^{12}$ s, about 46,000 years. Two flops: multiply by $e^{50} \approx 5\times10^{21}$: effectively never. Note how sensitive this is to τ: at τ = 40 ps the one-flop MTBF is $e^{21.25}/2\times10^6 \approx 850$ s.` },
      figs: [{ plot: 'mtbf', cap: 'MTBF versus resolution time on a log scale: each extra cycle multiplies MTBF by e^(T/τ).' }],
    },
    'cdc-protocols': {
      model: r`A two-flop synchronizer makes **one bit** safe to sample. It does not make several bits arrive together: each bit resolves independently and may land a cycle apart, so a bus synchronised bit by bit can be read as a value that never existed.

Pick the protocol by what you are moving. **Level signals** (slow enables): two-flop synchronizer. **Pulses** from fast to slow: stretch the pulse or convert to a toggle so the slow side cannot miss it. **Multi-bit counters**: Gray-code them so only one bit changes per step, then synchronise. **Data words**: hold the data stable and synchronise only a control signal (a request/acknowledge handshake, or a valid flag the receiver acknowledges), so the receiver samples data that is guaranteed stable. **Streams**: an asynchronous FIFO with Gray-coded read and write pointers synchronised into the opposite domain.

Then make it reviewable: constrain the synchronizer paths, mark the flops for placement close together, and run a CDC checker. Never synchronise the same signal in two places (they can disagree) and never let it reconverge with its own synchronised copy.`,
      say: r`A two-flop synchronizer only protects one bit. For pulses I toggle or stretch so the slow side can't miss them, for counters I Gray-code, for data words I hold the data and synchronise a request and acknowledge, and for streams I use an async FIFO with Gray pointers. Then I constrain it, keep the flops together, and run a CDC tool. Never synchronise the same signal twice.`,
      traps: ['Synchronising each bit of a binary bus.', 'Sending a one-cycle pulse from a fast clock to a slow one.', 'Synchronising one signal in two places and letting them reconverge.'],
      ask: ['Why Gray code in an async FIFO?', 'How deep should the FIFO be?', 'Latency of a 4-phase handshake?'],
      figs: [{ plot: 'sync2', cap: 'Two flip-flop synchronizer and its rules.' }],
    },
    'physical-layout': {
      model: r`Layout turns a schematic into masks. A standard cell sits between a VDD rail and a VSS rail; PMOS live in an n-well tied to VDD, NMOS in the p-substrate tied to VSS. Those **well and substrate taps** are part of the circuit: they set body voltage and keep the parasitic PNPN thyristor between wells from triggering (**latch-up**).

Each layer obeys geometric rules (**DRC**): width, spacing, enclosure, density, and the **antenna** rule, which limits how much metal can be connected to a gate before a diode path exists, because plasma etching charges long wires and can damage thin oxide. **LVS** extracts a netlist from the layout and proves it matches the schematic. Passing both means legal and matching, not good: parasitics, layout-dependent effects (well proximity, stress from diffusion length), electromigration and yield-friendly patterns still decide whether the cell performs.

At advanced nodes, gate pitch is fixed, poly is unidirectional, and diffusion breaks and dummy gates are part of the rules, so cell layout is highly constrained.`,
      say: r`Cells sit between rails, PMOS in a VDD-tied n-well and NMOS in the VSS-tied substrate, and the taps matter because they set body bias and prevent latch-up. DRC checks geometry including antenna and density, LVS proves the layout matches the schematic. Clean DRC and LVS means legal, not good: parasitics, layout-dependent effects and EM still need checking.`,
      traps: ['Treating well taps as optional.', '"DRC and LVS clean, so it is done."', 'Fixing an antenna violation by adding more metal on the same layer.'],
      ask: ['DRC and LVS are clean. Is the cell done?', 'What causes latch-up?', 'Two fixes for an antenna violation?'],
      figs: [{ src: 'assets/fig/diagrams/stick.svg', cap: 'NAND2 stick diagram.', from: 'Circuit Design Interview Bible' }],
    },
    'wire-rc': {
      model: r`A wire has resistance $R = R_\square L/W$ and capacitance to ground and to its neighbours, both growing with length. An unbuffered wire behaves like a distributed RC line, so its own delay grows as $0.38\,rcL^2$, quadratic in length; with a driver of resistance $R_d$ and load $C_L$, the Elmore delay is $R_d(C_w+C_L) + R_w(C_w/2 + C_L)$.

Quadratic growth means long wires must be broken up with **repeaters**. With optimal spacing and sizing, delay becomes linear in length. The optimal segment length is where the wire's own RC delay roughly equals a repeater's intrinsic delay. Repeaters cost area, power (often a large share of global-wire energy) and placement freedom, so practical designs use fewer, smaller repeaters than delay-optimal at a few percent delay cost.

Modern wires are tall and narrow (aspect ratio around 2) to keep resistance down, which raises sidewall coupling, so neighbouring wires become the dominant capacitance and crosstalk matters.`,
      say: r`A wire's resistance and capacitance both grow with length, so unbuffered delay grows with length squared: 0.38 r c L squared for the wire alone, plus driver terms in the Elmore expression. Repeaters break it into segments and make delay linear. Delay-optimal repeaters cost a lot of power, so designs back off for a small delay penalty.`,
      traps: ['Using 0.69RC for a distributed line; the distributed wire itself is 0.38RC.', 'Upsizing the driver to fix a long wire. Wire resistance is the problem.', 'Forgetting coupling capacitance dominates on tight-pitch layers.'],
      ask: ['Optimal repeater spacing and size?', 'Why do modern wires have aspect ratio about 2?', 'π-model versus L-model?'],
      worked: { q: r`Driver 1 kΩ, wire 500 Ω and 100 fF total, load 10 fF. Compute the Elmore delay.`, a: r`$R_d(C_w+C_L) + R_w(C_w/2+C_L) = 1\text{k}(110\text{f}) + 500(50\text{f}+10\text{f}) = 110 + 30 = 140$ ps (Elmore time constant; multiply by ~0.69 for a 50% estimate when the driver dominates).` },
      figs: [{ plot: 'wire', cap: 'Unrepeated wire delay grows with L²; optimally repeated delay grows linearly.' }],
    },
    'coupling-noise': {
      model: r`Two adjacent wires form a capacitor $C_c$. When the **aggressor** switches, it injects charge into the **victim**. A floating victim (a precharged dynamic node, a tristated bus) gets a step of $\Delta V = \frac{C_c}{C_c + C_g}\Delta V_{agg}$ that stays until something restores it. A driven victim gets a glitch that its driver pulls back, smaller if the driver is strong relative to the aggressor's edge rate.

Coupling also changes **delay**. If aggressor and victim switch in the **same** direction, the coupling cap sees no voltage change and effectively disappears (faster). In **opposite** directions, the cap sees twice the swing, effectively doubling it (Miller factor 2, slower). STA with SI models this with timing windows: only aggressors whose switching windows overlap the victim's transition matter.

Fixes: spacing, shielding with grounded wires, routing on different layers, stronger victim drivers, reducing aggressor slew, and keeping dynamic nodes short and protected by keepers.`,
      say: r`Coupling capacitance injects charge from an aggressor into a victim. A floating victim keeps the step, C couple over total times the aggressor swing; a driven victim sees a glitch the driver pulls back. For delay, same-direction switching removes the coupling cap and opposite switching doubles it. Fixes are spacing, shielding, layer changes, stronger victim drivers and slower aggressors.`,
      traps: ['Treating coupling as a fixed ground capacitance.', 'Forgetting that a dynamic node cannot recover from a glitch.', 'Considering every neighbour an aggressor regardless of timing windows.'],
      ask: ['Effective capacitance with an opposite-switching neighbour?', 'Why is a glitch fatal on a domino node but not on static CMOS?', 'How does STA decide which aggressors matter?'],
      worked: { q: r`A floating victim has 4 fF to ground and 2 fF coupling to an aggressor that swings 0.8 V. Compute the victim step.`, a: r`$\Delta V = \frac{2}{2+4}\times 0.8 = 0.27$ V. On a precharged node with a 0.4 V sense threshold this alone eats two thirds of the margin.` },
    },
    'power-delivery': {
      model: r`The supply a transistor sees is VDD minus everything between the regulator and the die: package and bump inductance, grid resistance, and the on-die decoupling that supplies fast current locally.

**Static IR drop** is average current times grid resistance. **Dynamic droop** comes from current steps: the package inductance $L$ resists the change ($L\,di/dt$), and the on-die decap $C$ supplies charge meanwhile. Together $L$ and $C$ form a resonant tank at $f = 1/(2\pi\sqrt{LC})$, typically tens to a few hundred MHz, and a load step rings at that frequency with a **first droop** that is usually the worst event.

Design targets an impedance profile: the supply impedance seen from the die must stay below $Z_{target} = \frac{r V_{DD}}{I} = \frac{r V_{DD}^2}{P}$ (r = allowed ripple fraction) across frequency. Decap helps at high frequency, package and board caps at lower frequency; resistance damps resonance. As voltage falls and power rises, $Z_{target}$ falls quadratically, which is why power delivery got so much harder.`,
      say: r`The die sees VDD minus IR drop in the grid and L di/dt droop from the package. On-die decap supplies fast current, but with the package inductance it forms an LC resonance, and a load step gives a first droop at that frequency. I design to a target impedance, ripple fraction times VDD squared over power, held across frequency by decap on die and capacitors on package and board.`,
      traps: ['Treating IR drop and L di/dt as the same thing.', 'Assuming more decap always fixes droop; it lowers resonance frequency and needs damping.', 'Running IR analysis with average current only.'],
      ask: ['Derive the target impedance for 100 W, 1 V, 10% ripple.', 'Why are power grids EM-prone?', 'What is first droop?'],
      worked: { q: r`100 W at 1 V with 10% allowed ripple. Target impedance? If the package is 20 pH, what on-die decap puts the resonance at 100 MHz?`, a: r`$Z = 0.1 \times 1^2/100 = 1$ mΩ. $C = 1/((2\pi f)^2 L) = 1/((6.28\times10^8)^2 \times 20\times10^{-12}) \approx 127$ nF.` },
      figs: [{ plot: 'droop', cap: 'Supply response to a current step: first droop at the LC resonance, settling to the IR level.' }, { src: 'assets/fig/diagrams/irdrop.svg', cap: 'IR drop along a power rail.', from: 'Circuit Design Interview Bible' }],
    },
    'em-aging': {
      model: r`Two different wear-out families. **Electromigration** is in the metal: electrons push metal atoms along the wire, forming voids (opens, resistance rise) and hillocks (shorts). Black's equation, $\text{MTTF} = A J^{-n} e^{E_a/kT}$ with $n \approx 2$, says lifetime falls with current density squared and exponentially with temperature. Unidirectional DC current (power rails, via arrays) is the dangerous case; bidirectional signal currents partly heal, so signal EM is checked against RMS and peak limits rather than average.

**Transistor aging** is in the device: **NBTI** raises PMOS $|V_T|$ under negative gate bias at high temperature (partially recovering when stress is removed), **HCI** degrades devices that switch with high drain current, and **TDDB** wears the gate oxide. Aging slows paths over the product's life, so signoff uses aged libraries or margins.

Keep the quantities straight: average current for DC EM, RMS for Joule heating, peak for instantaneous limits. IR drop is a separate, instantaneous voltage problem, not a lifetime one.`,
      say: r`EM is metal wear: electron wind moves atoms, Black's equation gives lifetime falling with J squared and exponentially with temperature, and DC power-grid current is the worst case. Aging is device wear: NBTI on PMOS, HCI on switching devices, TDDB on oxide, slowing circuits over life. Average current is for DC EM, RMS for heating, peak for instantaneous limits, and IR drop is a separate voltage problem.`,
      traps: ['Using average current for a bidirectional signal net as if it were DC.', 'Confusing EM (lifetime) with IR drop (instantaneous).', 'Forgetting NBTI partially recovers.'],
      ask: ['EM passes at 1 GHz; the design now runs at 1.5 GHz. What changes?', 'Why are power rails more EM-prone than signal nets?', 'How do aging-aware libraries work?'],
      worked: { q: r`A current pulse train: 20 mA peak, 25% duty cycle. Give average, RMS and peak.`, a: r`Average $= 0.25 \times 20 = 5$ mA. RMS $= 20\sqrt{0.25} = 10$ mA. Peak $= 20$ mA. Each feeds a different check.` },
      figs: [{ src: 'assets/fig/models/em-ir.png', cap: 'Peak, average and RMS current answer different reliability questions.', from: 'Earlier studio model figure' }],
    },
    'spice-testbench': {
      model: r`A testbench is a contract: stimulus, operating conditions, what is measured, and what counts as failure. Write the question first ("what is the 50% falling delay of this NAND2 with 20 fF load at SS/0.72 V/125 °C?"), then build only what answers it.

Good practice: realistic input slews (drive inputs through a shaping inverter, not ideal steps), the right load (including wire), explicit initial conditions only where you mean them, measurement statements with defined thresholds and edge counts, and a check that each measurement succeeded. A simulator that exits cleanly with a failed <code>.measure</code> (no crossing found) has told you nothing, and a script that reads that as zero has told you something false.

Sweep deliberately: corners and temperatures, supply, load and slew grids. Record the netlist, model version and options with every result so it can be reproduced.`,
      say: r`I start from the exact question, then build a testbench with realistic slews, the right load, conditions and measurement thresholds, and I check every measurement actually succeeded, because a failed measure is not a zero. I sweep corners, supply, slew and load deliberately and save the netlist, models and options with the results so they can be reproduced.`,
      traps: ['Ideal step inputs, which give optimistic delays.', 'Treating a failed measure as zero.', 'Forcing initial conditions that hide a startup problem.'],
      ask: ['How do you measure setup time in SPICE?', 'What breaks when you use an ideal step?', 'How would you make a testbench sweep reproducible?'],
      figs: [{ src: 'assets/fig/models/spice-diagnosis.png', cap: 'Define the crossing threshold, direction and window before parsing a waveform.', from: 'Earlier studio model figure' }],
    },
    'liberty-tables': {
      model: r`A Liberty (.lib) file is the contract between a cell and the digital flow. For each timing **arc** (input pin to output pin, under a stated condition of the other inputs), it stores delay and output slew in 2-D lookup tables indexed by **input slew** and **output load**, plus setup/hold tables for sequential cells, power tables, capacitances and leakage per state. One .lib exists per PVT corner.

Tools **interpolate** between table points (bilinear inside, extrapolate outside, which is risky). Models: **NLDM** (delay and slew tables, fast, less accurate for strong RC loads), **CCS/ECSM** (current-source waveforms, more accurate with complex loads and for noise), and **LVF** (adds per-arc sigma for statistical timing).

Validation: re-simulate random table points and off-grid points in SPICE and compare; check monotonicity (delay should rise with load and slew), arc completeness and sensitisation conditions (a NAND input arc must be measured with the other input at its non-controlling value).`,
      say: r`Liberty stores each arc's delay and output slew as tables over input slew and output load, plus constraints, power and leakage, one file per corner. Tools interpolate, so I validate with off-grid SPICE spot checks, monotonicity checks and arc-condition checks. NLDM is fast, CCS is more accurate for real RC loads and noise, and LVF adds sigma for statistical timing.`,
      traps: ['Trusting extrapolation beyond the table.', 'Measuring an arc without sensitising the other inputs.', 'Comparing .lib to SPICE at a table point only.'],
      ask: ['The .lib is 8% faster than SPICE at one corner. What is going on?', 'NLDM versus CCS?', 'What does LVF add?'],
      worked: { q: r`Delay table at slews 20/60 ps and loads 10/30 fF: d(20,10)=35, d(60,10)=55, d(20,30)=65, d(60,30)=95 ps. Interpolate at slew 40 ps, load 20 fF.`, a: r`Midpoint in both axes: bilinear average $= (35+55+65+95)/4 = 62.5$ ps.` },
      figs: [{ src: 'assets/fig/models/liberty-characterization.png', cap: 'Liberty interpolation surface and the corner values behind a looked-up number.', from: 'Earlier studio model figure' }],
    },
    'variation-types': {
      model: r`Classify variation before you simulate it. **Global (die-to-die)** variation moves every device on a chip together; corners (SS, FF, SF, FS) bracket it. **Local (within-die) mismatch** is random device to device, mostly from random dopant fluctuation and line-edge roughness, and follows **Pelgrom**: $\sigma(\Delta V_T) = A_{VT}/\sqrt{WL}$, so quadrupling area halves mismatch. **Systematic** effects (layout-dependent stress, lithography, CMP density) are deterministic given the layout. **Temporal** variation (aging, temperature, supply noise) changes over time.

Different structures care about different kinds: a long logic path averages local variation (σ grows as √N while the mean grows as N), so its relative variation shrinks; an SRAM cell, a sense amp or a matched current mirror sees raw local mismatch and needs high-sigma analysis because there are millions of them.

Monte Carlo samples the statistical model. Zero failures in N samples does not prove the failure rate is zero: with 95% confidence it only says $p < 3/N$. High-sigma targets need importance sampling or extrapolation, not brute force.`,
      say: r`Global variation moves a whole die and is covered by corners; local mismatch is random per device and follows Pelgrom, sigma proportional to one over root area; systematic effects come from layout; temporal ones from aging and temperature. Logic paths average local variation, memory cells don't, so memories need high-sigma methods. Zero Monte Carlo failures in N runs only bounds the failure rate below about 3 over N.`,
      traps: ['Using corners to cover local mismatch.', 'Claiming zero failures in 1,000 Monte Carlo runs proves a ppm-level design.', 'Forgetting correlation between neighbouring devices.'],
      ask: ['What sigma for a library versus a memory array?', 'Why does a long path vary less, relatively?', 'Explain importance sampling.'],
      worked: { q: r`A path has 16 identical gates: $d_{nom}$ = 100 ps, $\sigma_{d2d}$ = 10 ps (fully correlated), $\sigma_{wid}$ = 5 ps (independent). Mean and σ of path delay?`, a: r`$\mu = 1600$ ps. $\sigma^2 = (16 \times 10)^2 + 16 \times 5^2 = 25600 + 400$, $\sigma \approx 161$ ps. The global term dominates; local variation averaged out to 20 ps.` },
      figs: [{ plot: 'pelgrom', cap: 'Pelgrom mismatch scales with 1/√(WL).' }, { src: 'assets/fig/models/variation-yield.png', cap: 'Zero observed failures does not establish a ppb tail.', from: 'Earlier studio model figure' }],
    },
    'leakage-characterization': {
      model: r`Cell leakage depends on input **state**: a NAND2 with both inputs low has a two-device off stack and leaks far less than with one input high. So a library stores leakage per state (when conditions), and a design's leakage is the state-probability-weighted sum, which requires a stated probability model (uniform states, or activity-derived ones).

The experiment: for each cell, each state, each corner (leakage is hugely corner- and temperature-dependent, so FF/hot dominates signoff), run a DC operating point and measure supply current, separating gate, junction and subthreshold contributions if the models allow.

Cutting cost honestly: share runs across cells with identical topology, prioritise high-use cells and leakiest corners, and if you sample states, quantify the risk of missing the worst state. Missing the single worst state of a high-use cell is how a leakage budget gets blown.`,
      say: r`Leakage is per cell, per input state, per corner, because stacks and DIBL change with state, and FF hot dominates. Design leakage is a weighted sum that needs a stated state-probability model. To save compute I share topologies, prioritise high-use cells and the leakiest corners, and if I sample states I quantify the chance of missing the worst one.`,
      traps: ['One leakage number per cell.', 'Characterising leakage only at typical.', 'Sampling states without bounding the miss probability.'],
      ask: ['Characterise a library\'s leakage with minimal compute.', 'Which NAND3 state leaks most?', 'Why does leakage vary 100× per gate but less per block?'],
      figs: [{ src: 'assets/fig/models/leakage-sampling.png', cap: 'A cheaper leakage pilot is not full state coverage.', from: 'Earlier studio model figure' }],
    },
    'physical-timing-repair': {
      model: r`Repair with evidence, then re-verify everything the repair touched. Setup slack $= T + \delta - t_{su} - U_s - t_{cq,max} - t_{data,max}$; hold slack $= t_{cq,min} + t_{data,min} - \delta - t_{hold} - U_h$. Read which term is the problem.

**Setup fixes**: upsize or swap to lower Vt on the critical cells, restructure logic, buffer long wires, move cells closer, promote nets to faster layers, useful skew if the next stage has slack. **Hold fixes**: insert delay cells on the short path near the capture pin, after the point where long paths join, so setup paths are untouched; or reduce harmful skew.

Every fix moves something else: a delay cell on a shared segment breaks setup, a Vt swap adds leakage, an upsized cell loads its driver and adds congestion, a skew change shifts hold on neighbouring flops. Re-run all modes and corners after each ECO batch.`,
      say: r`I read the slack equation to see which term is wrong. Setup: speed the critical cells and wires or borrow skew from a stage with slack. Hold: add delay only on the short branch near the capture pin, past where long paths merge. Each fix has side effects, leakage, load, congestion or neighbouring hold, so I re-run every mode and corner after each ECO batch.`,
      traps: ['Adding hold buffers at the launch flop where they also delay critical setup paths.', 'Fixing setup with skew that breaks hold elsewhere.', 'Closing one corner at a time.'],
      ask: ['A hold fix broke setup. Why?', 'Is positive skew free margin?', 'What changes between pre-route and post-route timing?'],
    },
    'physical-parasitics-congestion': {
      model: r`Placement estimates wires; routing makes them real. After routing, nets detour around congestion, change layers through vias, and sit next to neighbours, so resistance and coupling capacitance rise and timing usually regresses from the placement estimate.

**Congestion** is demand versus routing tracks in a region. Hotspots come from high cell density, high-pin-count cells, macros' pin edges and narrow channels. Fixes: spread cells (lower utilisation locally), add placement blockages or padding around dense cells, move or rotate macros, change pin access, and avoid long nets that cross the hotspot. A global congestion map is an estimate; detailed routing with DRC is the truth.

Shorter is not always faster: a long net on a thick upper layer can beat a short detour on thin lower metal, and spreading cells to cure congestion can lengthen critical nets.`,
      say: r`Routing turns estimated wires into real ones with detours, vias and neighbours, so timing usually regresses after route. Congestion is track demand versus supply; I fix it with local spreading, padding, macro and pin changes, and verify with detailed route, not the global map. Layer choice matters as much as length.`,
      traps: ['Trusting placement-stage timing.', 'Treating the global congestion map as signoff.', 'Assuming the geometrically shortest route is fastest.'],
      ask: ['Why did timing regress after routing?', 'How do you fix a congestion hotspot?', 'Compute the Elmore delay of a driver plus distributed wire.'],
    },
    'physical-scan-test': {
      model: r`Manufacturing test asks "was this chip built right?", not "is the design right?". **Scan** replaces flops with scan flops that can be chained into shift registers. In **shift** mode you load a pattern into every flop and unload the response; in **capture** mode one functional clock lets the combinational logic compute. That makes internal state controllable and observable, so ATPG can generate patterns that detect **stuck-at** faults with high coverage.

**At-speed** test (launch-on-capture or launch-on-shift) launches a transition and captures it at the functional clock period, catching **transition** (delay) defects that slow stuck-at tests miss. **MBIST** tests memories with march algorithms through on-chip controllers.

Costs: scan muxes add delay on every flop's D path, scan chains add routing, shift power can exceed functional power (high toggle rates), and test time scales with chain length. Coverage numbers are structural: 99% stuck-at coverage says nothing about functional correctness.`,
      say: r`Scan turns flops into shift registers so ATPG can control and observe internal state; stuck-at patterns run slowly, at-speed patterns launch and capture transitions at the real clock to catch delay defects, and MBIST tests memories. It costs a mux delay on every flop, routing and high shift power, and coverage is structural, it doesn't prove the design is functionally correct.`,
      traps: ['Treating stuck-at coverage as functional verification.', 'Forgetting shift power and IR during test.', 'Ignoring scan-path hold timing during shift.'],
      ask: ['Scan load time with parallel chains?', 'What does 99% stuck-at coverage establish?', 'Launch-on-capture versus launch-on-shift?'],
      worked: { q: r`200,000 scan flops, 400 chains, 50 MHz shift clock. How long to load one pattern, and 2,000 patterns?`, a: r`Chain length $= 500$. One load $= 500/50\,\text{MHz} = 10\,\mu$s. With load/unload overlapped, 2,000 patterns ≈ 2,001 × 10 µs ≈ 20 ms.` },
    },
  });
})();
