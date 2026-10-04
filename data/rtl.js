/* RTL: digital design, Verilog semantics, FSMs, FIFOs and logic puzzles. */
(function () {
  const r = String.raw;
  const v = (s) => '\n```verilog\n' + s.trim() + '\n```\n';
  T.addUnits([
    {
      id: 'rtl-fsm-fifo', d: 'rtl', order: 2, tier: 1, mins: 30,
      title: 'FSMs, FIFOs and pipelines',
      goal: 'Write a clean two-process FSM, size a FIFO from rates and burst lengths, and explain pipelining with its latency and hazard costs.',
      tags: ['fsm', 'fifo', 'pipeline', 'gray'],
      model: r`**FSMs.** Separate the state register (clocked, non-blocking) from next-state and output logic (combinational, blocking, with defaults). **Moore** outputs depend only on state (glitch-free if registered, one cycle later); **Mealy** outputs depend on state and inputs (react in the same cycle, can glitch). Encodings: **binary** (fewest flops), **one-hot** (one flop per state, simplest and fastest next-state logic, standard on FPGAs and for small control FSMs), **Gray** (one bit changes per transition, useful when the state crosses domains or for low power). Always handle unreachable states with a default that recovers to a safe state.

**FIFOs.** A synchronous FIFO is a dual-port memory plus read and write pointers. With pointers one bit wider than the address, **empty** is "pointers equal" and **full** is "addresses equal, MSBs different". An **asynchronous FIFO** passes Gray-coded pointers through two-flop synchronizers into the other domain; full and empty are then computed conservatively (they can report full or empty slightly late on the side that deasserts, never falsely deassert).

**Depth** comes from the worst burst: if a burst of $B$ words arrives at $f_w$ and is drained at $f_r$ (with read efficiency), the backlog is $B\left(1 - \frac{f_r}{f_w}\right)$ plus synchronisation latency slack.

**Pipelining** cuts the critical path by inserting registers: throughput rises, latency in cycles rises, and dependent operations create hazards that need forwarding or stalls.`,
      eq: [
        [r`\text{depth} \ge B\left(1 - \frac{f_{read}\cdot\eta_r}{f_{write}\cdot\eta_w}\right)`, 'FIFO depth for a burst of B words written at f_write and read at f_read (η = fraction of cycles with a transfer).'],
        [r`g = b \oplus (b \gg 1), \qquad b_i = \textstyle\bigoplus_{j\ge i} g_j`, 'Binary to Gray and back.'],
      ],
      worked: { q: r`A producer writes bursts of 120 words at 200 MHz, one word per cycle. The consumer reads at 150 MHz but can only read 2 of every 3 cycles. Minimum FIFO depth?`, a: r`Burst lasts $120/200\,\text{MHz} = 600$ ns. In that time the reader takes $600\,\text{ns} \times 150\,\text{MHz} \times 2/3 = 60$ words. Backlog $= 120 - 60 = 60$ words. Add a few entries for pointer synchronisation latency in an async FIFO: choose 64.` },
      traps: ['Synchronising a binary pointer: multiple bits change at once and the receiver can see a wildly wrong value.', 'An FSM without a default branch, which leaves illegal states stuck.', 'Mealy outputs driving another domain or a clock enable without registering them.', 'FIFO depth computed from average rates instead of the worst burst.'],
      say: r`I write FSMs as a clocked state register plus a combinational next-state block with defaults; one-hot for small fast control, Gray when state crosses domains. A FIFO is a dual-port RAM with pointers one bit wider than the address so full and empty are unambiguous; an async FIFO crosses Gray-coded pointers through synchronizers. Depth comes from the worst burst minus what the reader drains during it.`,
      ask: ['Why must async FIFO pointers be Gray-coded?', 'Mealy versus Moore?', 'How do you detect full with N-bit addresses?', 'Design a sequence detector for 1011.'],
      checks: ['RTL-010', 'RTL-012', 'RTL-016'],
    },
    {
      id: 'rtl-puzzles', d: 'rtl', order: 3, tier: 2, mins: 25,
      title: 'Classic digital design puzzles',
      goal: 'Solve the standard whiteboard puzzles: edge detectors, clock dividers including divide-by-3 with 50% duty, gray counters, parity, and mux-based logic.',
      tags: ['puzzle', 'divider', 'edge', 'mux'],
      model: r`Most whiteboard digital puzzles reuse a handful of patterns.

- **Edge detector**: register the signal once and compare: rising edge $= s \land \lnot s_d$. For an asynchronous input, synchronise first.
- **Clock divide by even N**: a counter that toggles an output every N/2 cycles. **Divide by odd N with 50% duty**: generate two divided signals, one on the rising edge and one on the falling edge, each high for (N-1)/2 cycles out of N, then OR them; the half-cycle offset makes the combined high time exactly N/2 cycles. In real ASICs, prefer a clock-enable over a generated clock wherever possible.
- **Any function from a mux**: a 2:1 mux with inputs tied to constants or the input variable implements any 2-input function; a 4:1 mux implements any 3-input function by feeding the third variable or its complement to the data inputs.
- **Parity**: XOR reduction. **Gray**: $g = b \oplus (b \gg 1)$.
- **Counting ones, finding the first one**: priority encoders and adder trees; a population count of N bits needs about $\log_2 N$ levels of adders.

When asked, also say the hardware cost and the timing risk: generated clocks need constraints, combinational loops are forbidden, and async inputs need synchronizers.`,
      eq: [[r`f_{out} = \frac{f_{in}}{N}, \quad \text{duty} = \frac{N/2}{N} \text{ via a posedge/negedge pair for odd } N`, 'Odd-modulus divider with 50% duty cycle.']],
      traps: ['Building a divided clock from logic in an ASIC without constraining it as a generated clock.', 'Edge-detecting an asynchronous input without synchronising it.', 'Forgetting that the falling-edge flop in an odd divider sees half a cycle of timing.'],
      say: r`Most puzzles are a handful of patterns: register-and-compare for edges, counters for even dividers, a posedge and negedge pair ORed together for odd dividers with 50% duty, muxes as universal logic, XOR trees for parity, and Gray by XORing with a shifted copy. I also say the hardware cost and timing risk, like generated-clock constraints.`,
      ask: ['Divide by 3 with 50% duty.', 'Implement XOR with only 2:1 muxes.', 'Detect a rising edge on an asynchronous input.', 'Count ones in a 32-bit word efficiently.'],
      checks: ['RTL-020', 'RTL-021', 'RTL-024'],
    },
  ]);

  T.addQ([
    { id: 'RTL-001', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 1, f: 'mcq', tags: ['blocking'],
      q: 'In a clocked `always @(posedge clk)` block describing registers, which assignment should you use, and why?',
      opts: ['Non-blocking (`<=`): every register samples the old values and updates together, like real flip-flops.', 'Blocking (`=`): it simulates faster and synthesises identically.', 'Either; synthesis tools always produce the same hardware.', 'Blocking, because non-blocking creates latches.'],
      ans: 0, why: ['Correct.', 'Blocking assignments in clocked blocks make results depend on statement order and can merge intended pipeline stages.', 'Synthesis may produce different hardware from what simulation shows (a sim/synth mismatch).', 'Latches come from incomplete assignments in combinational blocks, not from `<=`.'] },
    { id: 'RTL-002', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'spot', tags: ['read-code', 'latch'],
      q: 'What hardware does this infer?' + v(`
always @(*) begin
  if (sel) y = a;
end`),
      opts: ['A latch on `y`, transparent when `sel` is 1, because `y` is not assigned when `sel` is 0.', 'A 2:1 mux between `a` and 0.', 'A flip-flop clocked by `sel`.', 'Pure wire `y = a`.'],
      ans: 0, why: ['Correct: "keep the old value" requires storage. Fix with `else y = 0;` or a default assignment.', 'Nothing assigns 0; that would need an else branch.', 'There is no edge in the sensitivity list.', 'The `if` matters: when `sel` is 0, `y` must hold.'] },
    { id: 'RTL-003', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'spot', tags: ['read-code', 'swap'],
      q: 'After one rising edge, with a = 1 and b = 0 beforehand, what are a and b?' + v(`
always @(posedge clk) begin
  a <= b;
  b <= a;
end`),
      opts: ['a = 0, b = 1 (they swap).', 'a = 0, b = 0.', 'a = 1, b = 1.', 'It depends on the simulator.'],
      ans: 0, why: ['Non-blocking assignments read old values, so they swap. With blocking `=`, both would become 0.', 'That is the blocking-assignment result.', 'No.', 'Non-blocking semantics are defined by the language.'] },
    { id: 'RTL-004', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'spot', tags: ['read-code', 'pipeline'],
      q: 'How many flip-flop stages does this describe between `d` and `q2`?' + v(`
always @(posedge clk) begin
  q1 = d;
  q2 = q1;
end`),
      opts: ['Effectively one: `q2` receives the new `q1`, which is `d`, in the same cycle.', 'Two, a shift register.', 'Zero, it is combinational.', 'Three.'],
      ans: 0, why: ['Correct. With blocking assignments the intended two-stage pipeline collapses. Use `<=` for two stages.', 'That is what `<=` would give.', 'There is a clock edge, so registers exist.', 'No.'] },
    { id: 'RTL-005', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 1, f: 'tf', tags: ['latch'],
      q: 'A missing `else` in a clocked `always @(posedge clk)` block infers a latch.',
      ans: false, ex: 'False. In a clocked block, an unassigned register simply keeps its value, which a flip-flop already does (synthesis adds an enable or feedback mux). Latches come from incomplete assignment in **combinational** blocks.' },
    { id: 'RTL-006', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'mcq', tags: ['sensitivity'],
      q: 'An old design uses `always @(a or b)` for `y = a & b & c;`. Simulation and synthesis disagree. Why?',
      opts: ['`c` is missing from the sensitivity list, so simulation does not re-evaluate when `c` changes, while synthesis builds the full AND. Use `always @(*)`.', 'Synthesis ignores AND gates with three inputs.', 'The block needs non-blocking assignments.', 'There is a latch on `a`.'],
      ans: 0, why: ['Correct.', 'No.', 'Combinational blocks use blocking assignments.', 'All outputs are assigned; there is no latch.'] },
    { id: 'RTL-007', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'spot', tags: ['read-code', 'reset'],
      q: 'What is wrong with this reset for an FSM in a design that uses asynchronous reset everywhere else?' + v(`
always @(posedge clk) begin
  if (!rst_n) state <= IDLE;
  else        state <= next;
end`),
      opts: ['Nothing is illegal, but it is a synchronous reset: it needs a running clock and must reach the flop with setup timing; mixing styles must be deliberate.', 'It infers a latch.', 'The reset polarity is impossible in Verilog.', 'Non-blocking assignments cannot be used with reset.'],
      ans: 0, why: ['Correct. Synchronous reset is fine if intended; just do not mix styles accidentally, and make sure the clock runs during reset.', 'No latch: it is clocked.', 'Active-low resets are standard.', 'They can.'] },
    { id: 'RTL-008', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 1, f: 'mcq', tags: ['fsm'],
      q: 'What distinguishes a Mealy machine from a Moore machine?',
      opts: ['Mealy outputs depend on state and current inputs; Moore outputs depend only on state.', 'Mealy machines have more states.', 'Moore machines cannot have reset.', 'Mealy machines are always one-hot encoded.'],
      ans: 0, why: ['Correct. Mealy reacts in the same cycle but outputs can glitch with inputs; Moore outputs are cleaner and a cycle later.', 'Mealy often needs fewer states.', 'Irrelevant.', 'Encoding is independent.'] },
    { id: 'RTL-009', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'num', ans: 3, tolAbs: 0, tags: ['fsm', 'encoding'],
      q: 'A state machine has 6 states. How many flip-flops does a binary encoding need?',
      a: r`$\lceil \log_2 6 \rceil = 3$. One-hot would need 6; Gray, also 3.` },
    { id: 'RTL-010', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'mcq', tags: ['fifo', 'gray'],
      q: 'Why are the read and write pointers of an asynchronous FIFO Gray-coded before being synchronised into the other clock domain?',
      opts: ['Only one bit changes per increment, so a pointer sampled mid-transition is either the old or the new value, never an unrelated one.', 'Gray code uses fewer bits.', 'Gray code removes the need for synchronizer flops.', 'Gray code makes the FIFO deeper.'],
      ans: 0, why: ['Correct. A binary pointer going 0111→1000 can be sampled as any mix of the four changing bits.', 'Same number of bits.', 'Each pointer bit still goes through a two-flop synchronizer.', 'Depth is unaffected.'] },
    { id: 'RTL-011', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'text', acc: ['0110', '6', '4\'b0110'], tags: ['gray'],
      q: 'Convert binary 0100 (decimal 4) to Gray code. Give the 4-bit result.',
      ex: '$g = b \\oplus (b \\gg 1) = 0100 \\oplus 0010 = 0110$.' },
    { id: 'RTL-012', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'num', ans: 60, tolAbs: 0, unit: 'words', tags: ['fifo depth'],
      q: 'Bursts of 120 words are written at 200 MHz (one per cycle). The reader runs at 150 MHz and reads on 2 of every 3 cycles. What backlog (minimum depth, ignoring synchronisation slack) must the FIFO hold?',
      a: r`Burst time $= 120/200\,\text{MHz} = 600$ ns. Words read meanwhile $= 600\,\text{ns} \times 150\,\text{MHz} \times \tfrac{2}{3} = 60$. Backlog $= 120 - 60 = 60$ words.` },
    { id: 'RTL-013', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'mcq', tags: ['fifo', 'full'],
      q: 'A synchronous FIFO with 16 entries uses 5-bit read and write pointers. When is it full?',
      opts: ['When the lower 4 bits are equal and the MSBs differ.', 'When the 5-bit pointers are equal.', 'When the write pointer equals 15.', 'When the read pointer is 0.'],
      ans: 0, why: ['Correct: the writer has lapped the reader by exactly one wrap.', 'Equal pointers mean empty.', 'Pointers wrap; absolute values do not indicate fullness.', 'No.'] },
    { id: 'RTL-014', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 1, f: 'mcq', tags: ['one-hot'],
      q: 'Why is one-hot encoding popular for small, fast control FSMs?',
      opts: ['Next-state and output logic become very shallow (each state is one flop), at the cost of more flops.', 'It uses the fewest flops.', 'It never needs reset.', 'It is required for Moore machines.'],
      ans: 0, why: ['Correct.', 'Binary uses the fewest.', 'It must reset to exactly one hot bit.', 'No.'] },
    { id: 'RTL-015', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'mcq', tags: ['pipeline'],
      q: 'A combinational path of 3 ns is split into three balanced pipeline stages. Each register adds 0.2 ns of overhead (clock-to-Q plus setup). What happens to throughput and latency?',
      opts: ['Clock period falls from 3.2 ns to 1.2 ns (2.7× throughput); latency rises from 3.2 ns to 3.6 ns.', 'Both throughput and latency improve 3×.', 'Throughput improves 3× and latency is unchanged.', 'Neither changes.'],
      ans: 0, why: ['Correct: period $= 1 + 0.2$, latency $= 3 \\times 1.2$.', 'Latency gets worse, not better.', 'Register overhead costs both.', 'Pipelining does change both.'] },
    { id: 'RTL-016', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 3, f: 'design', tags: ['sequence detector'],
      q: 'Design an FSM that asserts `hit` for one cycle whenever the serial input has just completed the sequence 1011 (overlapping allowed). Give the states and transitions.',
      rub: ['Defines states by the longest matched prefix: S0 (none), S1 ("1"), S2 ("10"), S3 ("101").', 'From S3 on 1: assert hit (Mealy) and go to S1 because the trailing "1" starts a new match.', 'From S2 on 0 returns to S0; from S1 on 1 stays in S1; from S3 on 0 goes to S2 ("10").', 'Chooses Mealy (hit same cycle) or Moore (extra state S4, hit one cycle later) and says why.', 'Writes it as a registered state plus combinational next-state logic with a default.'],
      a: r`States by matched prefix: S0 = nothing, S1 = "1", S2 = "10", S3 = "101".

| State | in = 0 | in = 1 |
| --- | --- | --- |
| S0 | S0 | S1 |
| S1 | S2 | S1 |
| S2 | S0 | S3 |
| S3 | S2 | S1, **hit** |

Mealy: hit = (state == S3) && in. For Moore, add S4 ("1011", hit = 1) with S4 on 0 → S2, on 1 → S1. Overlap works because after "1011" the final 1 is already a prefix "1".` },
    { id: 'RTL-017', d: 'rtl', u: 'rtl-reset-verification', lvl: 2, f: 'mcq', tags: ['reset'],
      q: 'What does "asynchronous assert, synchronous deassert" mean for a reset synchronizer?',
      opts: ['Reset takes effect immediately without a clock, but its release is retimed through flops in each clock domain so every flop leaves reset on the same edge.', 'Reset is applied only on clock edges and released immediately.', 'Reset is never released.', 'It means the reset is only used in simulation.'],
      ans: 0, why: ['Correct.', 'Backwards.', 'No.', 'No.'] },
    { id: 'RTL-018', d: 'rtl', u: 'rtl-reset-verification', lvl: 2, f: 'multi', tags: ['reset'],
      q: 'Which registers must normally be reset? Select all that apply.',
      opts: ['FSM state registers.', 'Valid bits of a pipeline.', 'Datapath registers that are always written before they are read.', 'FIFO read and write pointers.'],
      ans: [0, 1, 3], why: ['Must start in a legal state.', 'Garbage valid bits create phantom transactions.', 'Can skip reset to save area and routing, if truly written before read.', 'Must start equal (empty).'] },
    { id: 'RTL-019', d: 'rtl', u: 'rtl-puzzles', lvl: 1, f: 'mcq', tags: ['edge'],
      q: 'Given a signal `s` synchronous to `clk` and its one-cycle-delayed copy `s_d`, which expression is a one-cycle rising-edge pulse?',
      opts: ['`s & ~s_d`', '`~s & s_d`', '`s ^ s_d`', '`s | s_d`'],
      ans: 0, why: ['Correct.', 'That is the falling edge.', 'That fires on both edges.', 'That is a stretched version of `s`.'] },
    { id: 'RTL-020', d: 'rtl', u: 'rtl-puzzles', lvl: 3, f: 'design', tags: ['divider'],
      q: 'Design a divide-by-3 clock with 50% duty cycle. Explain why it works and what you would do instead in a real ASIC.',
      rub: ['Uses a mod-3 counter on the rising edge to make a signal A that is high for one input cycle out of three.', 'Retimes A on the falling edge to get B, the same waveform delayed by half a cycle.', 'ORs A and B so the output is high for exactly 1.5 of every 3 input cycles.', 'Notes the negedge flop sees half-cycle timing and the output is a generated clock that needs constraints.', 'Recommends a clock enable or a PLL/clock-generator divider in a real ASIC rather than a logic-generated clock.'],
      a: r`Run a mod-3 counter on the rising edge and decode a signal A high for one input cycle out of three. Re-time A on the falling edge to get B, the same waveform delayed by half a cycle. $A \lor B$ is high for 1.5 of every 3 cycles: 50% duty at $f/3$. Risks: the negedge path has half a cycle, the OR output is a logic-generated clock (glitch risk, needs <code>create_generated_clock</code>), and skew between A and B distorts duty. In an ASIC prefer a clock enable at $f/3$ or a proper clock divider cell.` },
    { id: 'RTL-021', d: 'rtl', u: 'rtl-puzzles', lvl: 2, f: 'mcq', tags: ['mux'],
      q: 'Using a single 2:1 mux (select = A, inputs I0 when A = 0 and I1 when A = 1), how do you implement Y = A XOR B, given B and its complement are available?',
      opts: ['I0 = B, I1 = B̄.', 'I0 = B̄, I1 = B.', 'I0 = 0, I1 = B.', 'I0 = 1, I1 = B.'],
      ans: 0, why: ['A = 0 gives B, A = 1 gives B̄: exactly XOR.', 'That is XNOR.', 'That is AND.', 'That is A̅ + B (implication).'] },
    { id: 'RTL-022', d: 'rtl', u: 'rtl-puzzles', lvl: 2, f: 'num', ans: 5, tolAbs: 0, tags: ['popcount'],
      q: 'A population count (number of ones) over 32 bits is built as a tree of adders. How many adder levels are needed?',
      a: r`$\log_2 32 = 5$ levels: 16 one-bit sums, 8 two-bit, 4 three-bit, 2 four-bit, 1 six-bit result. (Carry-save compressors can reduce the effective depth further.)` },
    { id: 'RTL-023', d: 'rtl', u: 'rtl-puzzles', lvl: 2, f: 'mcq', tags: ['generated clock'],
      q: 'In an ASIC, why is a clock enable usually preferred over a clock generated by a divider built from flip-flops?',
      opts: ['A divided clock is a new clock: it needs its own tree, constraints and skew balancing and creates crossings with the main clock; an enable keeps one clock domain.', 'Clock enables use less area in every case.', 'Divided clocks cannot be simulated.', 'STA cannot analyse divided clocks at all.'],
      ans: 0, why: ['Correct.', 'Not always, but the timing simplicity is the reason.', 'They can.', 'STA can, given generated-clock constraints; it is still extra risk.'] },
    { id: 'RTL-024', d: 'rtl', u: 'rtl-puzzles', lvl: 2, f: 'mcq', tags: ['parity'],
      q: 'What is the most compact logic for the parity (odd number of ones) of 8 bits, and its depth?',
      opts: ['A balanced XOR tree: 7 two-input XORs, 3 levels.', '8 AND gates and an OR, 2 levels.', 'A 256-entry lookup table only.', 'An 8-bit adder.'],
      ans: 0, why: ['Correct.', 'AND/OR does not compute parity.', 'Possible but far larger.', 'Overkill: parity is the LSB of the popcount.'] },
    { id: 'RTL-025', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'spot', tags: ['read-code', 'counter'],
      q: 'This counter is supposed to count 0 to 9 and wrap. What does it actually do?' + v(`
reg [3:0] cnt;
always @(posedge clk)
  if (cnt == 4'd10) cnt <= 0;
  else              cnt <= cnt + 1;`),
      opts: ['It counts 0 to 10 (eleven states) because it wraps after reaching 10, not after 9.', 'It counts 0 to 9 correctly.', 'It counts 0 to 15.', 'It never leaves 0.'],
      ans: 0, why: ['Off-by-one: compare against 9 to wrap after 9. (Also note there is no reset.)', 'It reaches 10 before wrapping.', 'The compare prevents reaching 15.', 'It increments.'] },
    { id: 'RTL-026', d: 'rtl', u: 'rtl-sequential-semantics', lvl: 2, f: 'mcq', tags: ['signed'],
      q: 'In Verilog, `wire [3:0] a = 4\'b1100;` What is `a >>> 1` and why?',
      opts: ['4\'b0110: `a` is unsigned, so arithmetic shift right fills with 0 just like `>>`.', '4\'b1110: arithmetic shift copies the sign bit.', '4\'b1000.', 'It is a syntax error.'],
      ans: 0, why: ['Correct. `>>>` only sign-extends when the operand is declared `signed`.', 'Only if `a` were `wire signed [3:0]`.', 'No.', '`>>>` is legal Verilog-2001.'] },
    { id: 'RTL-027', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 2, f: 'num', ans: 8, tolAbs: 0, tags: ['twos complement'],
      q: 'How many bits are needed to represent the full range of the sum of two signed 7-bit two\'s-complement numbers without overflow?',
      a: r`Each operand spans $-64$ to $63$; the sum spans $-128$ to $126$, which needs 8 bits. Adding two N-bit numbers needs N+1 bits.` },
    { id: 'RTL-028', d: 'rtl', u: 'rtl-fsm-fifo', lvl: 3, f: 'short', tags: ['handshake', 'valid ready'],
      q: 'Explain the valid/ready handshake used between pipeline stages and the classic mistake that causes lost or duplicated data.',
      rub: ['A transfer happens on a cycle where both valid and ready are high.', 'The source must hold data and valid stable until the transfer occurs (must not drop valid or change data while ready is low).', 'Ready must not combinationally depend on valid in a way that forms a loop across stages; a skid buffer breaks long ready paths.', 'Classic mistakes: changing data while valid is high and ready low (lost data), or counting a transfer when only valid is high (duplicated or phantom data).'],
      a: 'A beat transfers on any cycle where valid and ready are both high. Once the source raises valid it must hold valid and the data stable until that happens. Ready may depend on downstream state, but long combinational ready chains through a pipeline create timing problems, so designers insert skid buffers (two-entry registers) to register ready. Bugs: changing data while stalled loses a beat; treating valid alone as a transfer duplicates beats.' },
    { id: 'RTL-029', d: 'rtl', u: 'rtl-puzzles', lvl: 1, f: 'tf', tags: ['combinational loop'],
      q: 'A combinational feedback loop (an output feeding back into its own logic without a register) is an acceptable way to build a latch in a standard-cell ASIC flow.',
      ans: false, ex: 'False. Combinational loops break STA (no clean timing graph), can oscillate, and are flagged by lint. Use a library latch cell, described with proper latch RTL, if a latch is truly needed.' },
    { id: 'RTL-030', d: 'rtl', u: 'rtl-reset-verification', lvl: 2, f: 'mcq', tags: ['verification'],
      q: 'Your formal property for "every request gets a grant within 8 cycles" passes. What must you also check before trusting it?',
      opts: ['That environment assumptions are realistic (not over-constrained) and that cover properties show requests actually occur and are reachable.', 'Nothing; a pass is a proof.', 'That the property also passes in simulation once.', 'That the RTL has no comments.'],
      ans: 0, why: ['Correct: over-constrained assumptions can make a property vacuously true.', 'A pass is only as good as its assumptions and coverage.', 'Simulation adds little to a real formal proof but cannot catch vacuity on its own.', 'Irrelevant.'] },
  ]);
})();
