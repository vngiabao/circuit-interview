/* Structured teaching for imported lessons, part 3: scripting, analog, RTL. */
(function () {
  const r = String.raw;
  T.upgradeUnits({
    'tcl-language': {
      model: r`Tcl is the language of EDA tool consoles (Innovus, PrimeTime, Genus, Calibre). Everything is a string and every line is a command with words. Three substitutions happen before the command runs: <code>$var</code> substitutes a variable, <code>[cmd]</code> runs a command and substitutes its result, and backslash escapes. **Double quotes** group words and still allow substitution; **braces** group words and suppress substitution, which is why procedure bodies, <code>if</code> conditions and <code>foreach</code> bodies are braced: they are evaluated later, by the command, not by the parser now.

Lists are strings with structure: use <code>lindex</code>, <code>llength</code>, <code>lappend</code>, <code>foreach</code>. <code>expr {...}</code> does arithmetic (brace it, for speed and safety). <code>upvar</code> lets a procedure modify a caller's variable. Bus pin names like <code>data[3]</code> need escaping or braces because brackets mean command substitution.

For robust flow scripts: locate files relative to the script (<code>[file dirname [info script]]</code>), check that tool queries returned something before using it, and fail with a clear message instead of continuing on an empty collection.`,
      say: r`In Tcl every line is a command; dollar substitutes a variable, square brackets run a command, quotes group with substitution, braces group without it, which is why bodies and expr arguments are braced and evaluated later. Brackets in bus pin names need escaping. In flows I locate files relative to the script and check every query actually returned something before using it.`,
      traps: ['Unbraced expr, which double-substitutes and is slow.', 'Writing data[3] unescaped and running a command named 3.', 'Assuming the current working directory.'],
      ask: ['Braces versus quotes in Tcl?', 'What does upvar do?', 'How do you make a flow script robust?'],
    },
    'report-parsing': {
      model: r`Parsing a timing, DRC or simulation report is where silent bugs hide. Rules that interviewers listen for:

1. **Match the real format.** Copy a line from an actual report into your regex test; tools change column order and units between versions.
2. **Missing is not zero.** If a slack line is not found, record "missing" with the file name; never default to 0 or skip silently, or a broken run looks like a pass.
3. **Units and sign.** Normalise ps/ns, handle negative numbers and e-notation.
4. **Keep provenance.** Every extracted value carries its source file and line, so a surprising number can be checked.
5. **Summarise, then rank.** Worst slack, number of violations, total negative slack, grouped by endpoint or block.

The usual stack: <code>grep</code>/<code>awk</code> for a quick look, Python with regular expressions and a dataclass or CSV for anything you will rerun.`,
      say: r`I write the regex against a real report line, treat a missing match as missing with the file name rather than zero, normalise units and signs, keep the source file and line with every value, and then summarise worst slack, violation count and total negative slack by block. Quick looks in grep and awk, anything repeatable in Python.`,
      traps: ['Parsing an idealised format from memory.', 'Returning 0 for a missing value.', 'Mixing ns and ps across reports.'],
      ask: ['Find the worst slack across 1,000 reports.', 'How do you detect a report that was truncated?', 'awk one-liner for negative slack lines?'],
    },
    'automation-audit': {
      model: r`An automated sweep has two objects that must reconcile: the **expected** matrix (every corner × cell × condition you meant to run) and the **observed** results. Most automation bugs are mismatches between them: a job that never ran, a duplicate run that overwrote another, a result with the wrong units, a crashed simulation whose output file exists but is empty.

Separate the stages: **generate** a manifest of runs with unique keys, **execute** and record job status, **parse** each output with explicit success checks, then **compare** observed against expected and against a baseline. Before computing percentage changes, check for missing rows, duplicate keys, unit mismatches and zero or near-zero baselines.

Make reruns idempotent (same inputs, same outputs), log tool and model versions, and make the final report say what was *not* checked as clearly as what passed.`,
      say: r`I keep the expected run matrix and the observed results as separate objects and reconcile them: generate a manifest with unique keys, track job status, parse with explicit success checks, then compare against expected and baseline, checking missing rows, duplicates, units and zero baselines before any percentage. Runs are idempotent and versions are logged.`,
      traps: ['Computing a percentage change against a zero baseline.', 'Letting a duplicate key silently overwrite a row.', 'Counting an empty output file as a completed run.'],
      ask: ['How would you flag cells whose delay moved more than 5% versus last release?', 'What would you improve in a flow you inherited?', 'How do you know a sweep is complete?'],
    },
    'analog-gm-ro': {
      model: r`Analog starts with **bias**: set DC currents and voltages so every device sits in saturation with enough headroom. Only then linearise. In saturation, $g_m = 2I_D/V_{OV}$ (square law) and $r_o \approx 1/(\lambda I_D)$. The **intrinsic gain** $g_m r_o = 2/(\lambda V_{OV})$ rises with longer channels and lower overdrive.

A common-source stage's gain is $A_v = -g_m (r_o \parallel R_L \parallel r_{o,load})$: every conductance at the output counts, including the load device and whatever the next stage presents. That is why a high intrinsic gain can collapse to a small loaded gain.

Trade-offs move together: more current raises $g_m$ and bandwidth but lowers $r_o$ and costs power; lower overdrive raises $g_m/I_D$ and gain but needs bigger devices (more capacitance, less bandwidth) and approaches weak inversion where square law fails; output swing is limited by keeping devices in saturation.`,
      say: r`Bias first so every device is saturated with headroom, then small-signal: gm equals 2 ID over Vov and ro about 1 over lambda ID, so intrinsic gain is 2 over lambda Vov. A common-source stage gain is minus gm times everything in parallel at the output, so loading can collapse it. Current, overdrive, swing and bandwidth trade against each other.`,
      traps: ['Computing gain before checking saturation.', 'Leaving the load device\'s r_o out of the parallel combination.', 'Using square law in weak inversion.'],
      ask: ['Why does more bias current sometimes reduce gain?', 'What sets output swing?', 'How does channel length change intrinsic gain?'],
      worked: { q: r`$I_D$ = 100 µA, $V_{OV}$ = 0.2 V, λ = 0.1 V⁻¹ for both the amplifying NMOS and its PMOS current-source load. Gain?`, a: r`$g_m = 2(100\,\mu)/0.2 = 1$ mS. $r_o = 1/(0.1 \times 100\,\mu) = 100$ kΩ each, in parallel 50 kΩ. $A_v = -1\,\text{m} \times 50\,\text{k} = -50$ (34 dB).` },
    },
    'analog-differential-pair': {
      model: r`A differential pair splits a tail current between two matched devices. A differential input $v_{id}$ steers $\pm g_m v_{id}/2$ between the branches; a common-mode input ideally changes nothing because the tail current is fixed. Differential gain with resistive or mirror loads is about $g_m R_{out}$; with a current-mirror load (5-transistor OTA) the single-ended output gets the full $g_m(r_{o2} \parallel r_{o4})$.

Real limits: finite tail output resistance lets common-mode leak into the output (finite **CMRR**); device **mismatch** creates input offset and converts common-mode to differential; and the **input common-mode range** comes from headroom: the input must be high enough to keep the tail device saturated ($V_{GS1} + V_{dsat,tail}$) and low enough to keep the input devices saturated against their loads.`,
      say: r`The pair steers a fixed tail current, so differential input gives gm times vid over 2 in each branch and common-mode ideally does nothing. With a mirror load, gain is gm times ro2 parallel ro4. Finite tail resistance and mismatch limit CMRR and cause offset, and the input common-mode range is set by keeping the tail and input devices saturated.`,
      traps: ['Confusing single-ended and differential gain.', 'Ignoring tail headroom at low common mode.', 'Treating mismatch and finite tail resistance as the same error.'],
      ask: ['Find the common-mode floor.', 'Where does offset come from?', 'Why use a mirror load?'],
      figs: [{ plot: 'diffpair', cap: 'Five-transistor OTA with the gain and common-mode range equations.' }],
    },
    'analog-current-mirrors': {
      model: r`A current mirror copies a reference current by giving two devices the same $V_{GS}$: a diode-connected device sets it, the output device copies it scaled by size ratio. Matched $V_{GS}$ is not sufficient for an accurate copy: the output current also depends on $V_{DS}$ through channel-length modulation, $I_{out}/I_{ref} \approx \frac{W_{out}}{W_{ref}}\frac{1+\lambda V_{DS,out}}{1+\lambda V_{DS,ref}}$.

Errors come in three kinds with different signatures: **systematic** $V_{DS}$ mismatch (fix with a cascode or by matching drain voltages), **random** $V_T$ and β mismatch (fix with area and higher overdrive), and **compliance** failure when the output device falls out of saturation at low output voltage (the current collapses). A cascode raises output resistance by roughly $g_m r_o$ at the cost of one more $V_{dsat}$ of headroom.`,
      say: r`A mirror copies current by matching VGS, but channel-length modulation makes the copy depend on drain voltage, mismatch adds random error, and below its compliance voltage the output device leaves saturation and the current collapses. A cascode multiplies output resistance by about gm ro and costs one extra Vdsat of headroom.`,
      traps: ['Assuming matched VGS guarantees matched current.', 'Diagnosing a compliance failure as mismatch.', 'Adding a cascode without checking headroom.'],
      ask: ['Mirror ratio with unequal drain voltages?', 'A mirror fails only at low output voltage. Why?', 'How do you reduce random mirror error?'],
      worked: { q: r`1:1 mirror, λ = 0.1 V⁻¹, reference $V_{DS}$ = 0.45 V, output $V_{DS}$ = 0.9 V. Output error?`, a: r`$\frac{1+0.09}{1+0.045} = 1.043$: about 4.3% high. Matching the drain voltages or cascoding removes most of it.` },
    },
    'analog-feedback-stability': {
      model: r`Negative feedback trades gain for accuracy: closed-loop gain $\frac{A}{1+A\beta} \approx \frac{1}{\beta}$ when the **loop gain** $A\beta \gg 1$, with fractional error about $1/(A\beta)$. Bandwidth extends by the same factor.

Stability depends on the loop gain's phase where its magnitude crosses 1. **Phase margin** is 180° minus the phase lag there; around 60° gives fast settling with little ringing, under ~45° rings, near 0 oscillates. Each pole adds up to 90° of lag; compensation (a dominant pole, Miller capacitance) makes the loop gain cross unity before the second pole bites.

Small-signal stability is not the whole story: a large step can **slew** (output current limited by bias, so the output ramps at $I/C$) before linear settling, and a stable amplifier can still miss its settling time.`,
      say: r`Closed-loop gain is A over 1 plus A beta, about 1 over beta with error 1 over loop gain. Stability is judged at the loop-gain crossover: phase margin around 60 degrees settles cleanly. Compensation pushes the crossover below the second pole. Large steps also slew at I over C, so a stable loop can still miss settling time.`,
      traps: ['Evaluating phase margin at the open-loop amplifier crossover instead of the loop gain (Aβ).', 'Thinking a stable loop must settle fast.', 'Assuming more loop gain always helps without checking phase.'],
      ask: ['Read this loop-gain plot: what is the phase margin?', 'A stable amplifier misses settling time. Why?', 'Why Miller compensation?'],
      worked: { q: r`A = 10,000, β = 0.1. Closed-loop gain and its error?`, a: r`Loop gain $A\beta = 1000$. Closed-loop gain $= 10000/1001 = 9.990$, about 0.1% below the ideal 10.` },
    },
    'analog-noise-offset': {
      model: r`Noise is random and characterised by a density (V/√Hz). Its rms value needs a bandwidth: $e_{rms} = e_n\sqrt{B}$ for white noise (use the noise bandwidth, $\pi/2$ times the -3 dB bandwidth for a single pole). **Uncorrelated noise sources add in power**: $e_{total} = \sqrt{e_1^2 + e_2^2 + ...}$. A resistor contributes $\sqrt{4kTR}$ per √Hz, and an amplifier's current noise flowing through the source resistance contributes $i_n R$; at high source impedance current noise can dominate.

**Offset** is a static error from mismatch, a separate budget: it does not average away and is removed by trimming, auto-zeroing or chopping. **Interference** (supply ripple, coupling) is deterministic and fixed by layout and rejection, not by averaging. Averaging N samples reduces uncorrelated noise by √N, but not offset or correlated interference.`,
      say: r`Noise density times root bandwidth gives rms noise, and uncorrelated sources add as root-sum-square, including 4kTR from resistors and current noise times source resistance. Offset is a separate static budget fixed by trim, auto-zero or chopping. Averaging N samples cuts random noise by root N but does nothing to offset or correlated interference.`,
      traps: ['Adding noise voltages linearly.', 'Expecting averaging to remove offset.', 'Forgetting to specify bandwidth.'],
      ask: ['White noise over 1 MHz bandwidth?', 'What does averaging remove?', 'When does current noise dominate?'],
      worked: { q: r`Amplifier noise 10 nV/√Hz, source resistor 10 kΩ (12.9 nV/√Hz at room temperature), bandwidth 100 kHz. Total rms input noise?`, a: r`Density $= \sqrt{10^2 + 12.9^2} = 16.3$ nV/√Hz. Over 100 kHz: $16.3\,\text{n} \times 316 = 5.2\,\mu$V rms.` },
    },
    'analog-sampling-adc': {
      model: r`An ADC samples, then quantises. **Sampling** needs the input bandwidth limited below half the sample rate (Nyquist) or out-of-band signals **alias** into the band, and no number of bits fixes aliasing. The sample-and-hold must **settle** to within half an LSB: an RC acquisition network needs $t \ge RC\ln(2^{N+1})$ for a full-scale step, about $(N+1)\cdot 0.69\,RC$.

**Quantisation** with step $\Delta = V_{FS}/2^N$ adds noise of $\Delta/\sqrt{12}$ rms, giving the ideal $\text{SNR} = 6.02N + 1.76$ dB for a full-scale sine. The sampling capacitor adds $kT/C$ noise, so higher resolution needs a bigger capacitor, which needs a stronger driver to settle in time: noise, settling and power trade together. Real converters are judged by ENOB, not nominal bits.`,
      say: r`Sampling first: band-limit below Nyquist or out-of-band signals alias, and bits don't fix that. The track-and-hold must settle to half an LSB, about N plus 1 times 0.69 RC. Quantisation adds delta over root 12 noise, ideal SNR 6.02 N plus 1.76 dB, and kT over C noise pushes the capacitor bigger, which the driver must then charge in time.`,
      traps: ['Assuming more bits fixes aliasing.', 'Forgetting kT/C noise on the sampling capacitor.', 'Quoting nominal bits instead of ENOB.'],
      ask: ['How long is long enough to acquire?', 'Aliasing versus resolution?', 'Why does kT/C matter?'],
      worked: { q: r`12-bit ADC, sampling RC = 50 ps. Minimum acquisition time for half-LSB settling of a full-scale step?`, a: r`$t \ge RC\ln(2^{13}) = 50\,\text{ps} \times 9.01 = 451$ ps.` },
    },
    'rtl-sequential-semantics': {
      model: r`RTL describes registers and the logic between them. In a clocked <code>always @(posedge clk)</code> block, use **non-blocking** assignments (<code>&lt;=</code>): all right-hand sides are sampled with the old values and updated together, exactly like a bank of flip-flops, so <code>a &lt;= b; b &lt;= a;</code> swaps. Blocking assignments (<code>=</code>) in a clocked block update immediately and make the result depend on statement order, a classic simulation/synthesis mismatch.

In combinational <code>always @(*)</code> blocks use **blocking** assignments, and assign every output on every path. A missing <code>else</code> or a missing case branch means "keep the old value", which synthesises to a **latch**. Default assignments at the top of the block prevent that.

Then check the hardware, not only the waveform: read the synthesis report for inferred latches, unexpected flops and constant-propagated logic.`,
      say: r`Clocked blocks use non-blocking assignments so every register samples old values and updates together, like real flops. Combinational blocks use blocking assignments and must assign every output on every path, or synthesis infers a latch to hold the old value. Default assignments prevent that, and I check the synthesis report for latches, not just the waveform.`,
      traps: ['Blocking assignments in a clocked block creating order-dependent behaviour.', 'Incomplete if/case in combinational logic inferring a latch.', 'Mixing blocking and non-blocking to the same variable.'],
      ask: ['Does a missing else always mean a latch?', 'Why does this swap work with <= but not =?', 'What does a shift register look like in RTL?'],
      worked: { q: r`<code>always @(posedge clk) begin q1 = d; q2 = q1; end</code>. What hardware does this describe, and what if you use <code>&lt;=</code>?`, a: r`With blocking, <code>q2</code> receives the new <code>q1</code>, which is <code>d</code>, so both registers load <code>d</code> (synthesis may even merge them): one stage, not two. With non-blocking, <code>q2</code> gets the old <code>q1</code>: a two-stage shift register, which is almost certainly what was intended.` },
    },
    'rtl-cdc-handshake': {
      model: r`Moving a multi-bit transaction across clock domains needs a protocol, not just synchronizers. A **request/acknowledge handshake**: the source puts data on a bus and holds it, then toggles (or raises) a request; the destination synchronises the request, samples the now-stable data, and returns an acknowledge that the source synchronises before changing the data again. The data bus itself is never synchronised; it is stable whenever it is sampled.

Four-phase (req up, ack up, req down, ack down) is simple but slow: each step costs two-to-three destination or source clock cycles of synchronisation. Two-phase (toggle) halves that. For throughput, use an **async FIFO**: the source writes at its rate, Gray-coded pointers cross into the other domain, and full/empty are computed conservatively.

Latency and throughput are different requirements: a handshake gives low area and guaranteed coherency; a FIFO gives throughput.`,
      say: r`For a data word I hold the data stable, synchronise only a request into the destination, sample the data there, and send back an acknowledge so the source knows when it may change. Four-phase is simple but takes several synchronisation delays per word; toggling halves it; for real throughput I use an async FIFO with Gray pointers.`,
      traps: ['Synchronising the data bus bit by bit.', 'Changing the data before the acknowledge returns.', 'Expecting handshake throughput to match a FIFO.'],
      ask: ['When can the source change the payload?', 'Round-trip latency of a 4-phase handshake?', 'Two-phase versus four-phase?'],
      figs: [{ plot: 'sync2', cap: 'The control signal of a handshake crosses through a two-flop synchronizer; the data bus does not.' }],
    },
    'rtl-reset-verification': {
      model: r`Reset has two edges with different problems. **Assertion** can be asynchronous: forcing flops to a known state immediately is fine. **Release** must be synchronous to each clock domain: if reset deasserts near a clock edge, some flops leave reset this cycle and others next cycle (a recovery/removal violation), and a state machine can start in an illegal state. The standard pattern is **asynchronous assert, synchronous deassert**: a reset synchronizer per clock domain.

Not every flop needs reset: datapath registers that are always written before being read can skip it (saves area and routing), but control state, valid bits and FSM states must reset.

Verification should test more than power-up: reset in the middle of operation, reset in one domain while another runs, and recovery afterwards. Assertions need assumptions that match the real environment and coverage that proves the interesting cases were reached.`,
      say: r`Assert reset asynchronously, release it synchronously per clock domain with a reset synchronizer, because a release near a clock edge lets flops leave reset on different cycles. Control and valid state must reset; datapath registers written before read can skip it. I verify mid-operation and per-domain resets, not just power-up, with coverage on the cases that matter.`,
      traps: ['Releasing an asynchronous reset directly into many flops.', 'Leaving FSM state or valid bits unreset.', 'Only testing reset at time zero.'],
      ask: ['Why synchronise reset release?', 'Can data registers be left unreset?', 'What is a recovery violation?'],
    },
  });
})();
