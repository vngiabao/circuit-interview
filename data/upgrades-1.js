/* Structured teaching for imported lessons, part 1: devices, gates, delay, power, memory. */
(function () {
  const r = String.raw;
  T.upgradeUnits({
    'cmos-foundations': {
      model: r`A MOSFET is a voltage-controlled switch with a resistance that depends on how hard you turn it on. An **NMOS** conducts when its gate is high relative to its source and pulls toward ground well; a **PMOS** conducts when its gate is low relative to its source and pulls toward VDD well. NMOS passes a strong 0 and a weak 1 (it stops at $V_{DD}-V_{tn}$); PMOS passes a strong 1 and a weak 0.

Static CMOS pairs a **PMOS pull-up network** with a **complementary NMOS pull-down network**. For every input combination exactly one network conducts, so the output always has a path to a rail and there is no static current. Series NMOS give AND-like pull-down (NAND), parallel NMOS give OR-like pull-down (NOR); the PMOS network is the dual.

Every node is a capacitor. Logic is charge being moved on and off those capacitors through finite resistance, which is why the *history* of internal nodes (charged or not) can change the delay of a gate even when its final output is the same.`,
      say: r`A MOSFET is a gate-controlled switch whose on-resistance depends on overdrive. Static CMOS uses a PMOS pull-up and a complementary NMOS pull-down so exactly one conducts for every input, giving rail-to-rail outputs and no static current. NMOS pulls down well and PMOS pulls up well, which is why the networks are split that way. Every node is a capacitor, so delay is charge moving through those switches.`,
      traps: ['Saying an off transistor is an open circuit. It leaks, and that leakage dominates idle power in modern nodes.', 'Putting NMOS in the pull-up. It only reaches VDD minus VT and slows to a crawl near the end.', 'Forgetting that the PMOS network is the dual (series becomes parallel), not a copy.'],
      ask: ['Draw a NAND2 and a NOR2. Which is faster for the same input capacitance, and why?', 'What happens to the output if both networks conduct?', 'Why does an internal node of a NAND3 affect its delay?'],
      worked: { q: r`In a NAND2 with input A on the top (output-side) NMOS and B on the bottom NMOS, A = 1 and B = 0. What is the voltage of the internal node between the two NMOS, and why does it matter?`, a: r`With A on and B off, the internal node connects to the output through A's NMOS. The output is high (B = 0 means the pull-down is open), so the internal node charges up toward $V_{DD} - V_{tn}$ (the NMOS cannot pass a full 1). When B later rises, the gate must discharge both the output and this precharged internal node, so the fall is slower than if the internal node had started at 0. That is why critical late-arriving signals go on the device **closest to the output**: the other devices have already discharged the internal nodes.` },
      figs: [{ plot: 'vtc', cap: 'Inverter transfer curves for three PMOS/NMOS strength ratios. The switching threshold VM moves toward the stronger device.' }],
    },
    'rc-delay': {
      model: r`Treat a switching gate as a resistor charging or discharging a capacitor. The driver contributes an effective resistance $R_{eq}$ (an average over the transition, roughly $\frac{3}{4}V_{DD}/I_{DSAT}$); the load is every capacitance hanging on the output node: the gates it drives, its own drain diffusion, and the wire.

For a step input the output follows $V_{DD}(1-e^{-t/RC})$, so the 50% point is at $\ln 2 \cdot RC \approx 0.69RC$ and the 10-90% transition takes $\ln 9 \cdot RC \approx 2.2RC$. Doubling the driver width halves $R$ but also doubles its own diffusion and input capacitance, which is why upsizing has diminishing returns and loads the previous stage.

Fanout is shorthand for load, but it hides structure. Two gates with the same fanout can differ because one drives a long wire or has a large self-loading diffusion.`,
      say: r`I model the driver as an effective resistance charging every capacitance on its output: downstream gates, its own diffusion, and the wire. A step response crosses 50% at 0.69 RC and goes from 10 to 90% in about 2.2 RC. Making the driver wider lowers R but raises its own and its input capacitance, so the returns diminish.`,
      traps: ['Using 2.2RC for propagation delay. That is the 10-90% rise time; propagation delay is 0.69RC.', 'Ignoring the driver\'s own diffusion capacitance, so you predict that doubling width halves delay.', 'Counting fanout without the wire.'],
      ask: ['Why doesn\'t doubling an inverter\'s width halve its delay?', 'Where does 0.69 come from?', 'How would you measure tp in SPICE?'],
      worked: { q: r`An inverter has $R_{eq} = 2\,\text{k}\Omega$, self capacitance 3 fF, and drives 12 fF of gate load plus a 5 fF wire. Estimate tp. Then estimate tp if you double the inverter width.`, a: r`Load $= 3 + 12 + 5 = 20$ fF, so $t_p = 0.69 \times 2\,\text{k}\Omega \times 20\,\text{fF} = 27.6$ ps.

Doubled: $R = 1\,\text{k}\Omega$ and self capacitance becomes 6 fF, load $= 6 + 12 + 5 = 23$ fF, $t_p = 0.69 \times 1\,\text{k} \times 23\,\text{f} = 15.9$ ps. Not half, and the inverter's own input capacitance doubled, slowing whatever drives it.` },
      figs: [{ plot: 'rcstep', cap: 'RC step response: 50% at 0.69RC, 63% at 1RC, 90% at 2.3RC.' }],
    },
    'gate-sizing': {
      model: r`Size a gate so that its **worst-case** pull-up and pull-down resistance match a reference inverter. Devices in **series** add resistance, so each must be made wider by the number in series. Devices in **parallel** are sized for the case where only one conducts.

With a 2:1 reference inverter (PMOS twice the NMOS width because holes are roughly half as mobile): a NAND2 has NMOS of width 2 (two in series) and PMOS of width 2 (parallel), a NOR2 has NMOS of width 1 and PMOS of width 4. The NAND2 input sees 4 units of capacitance against the inverter's 3, the NOR2 sees 5. That ratio is the **logical effort**: NAND is cheaper than NOR in CMOS, which is why designers prefer NAND-based logic.

Sizing is a trade: a wider gate drives its load faster but presents more capacitance to whatever drives it. You size paths, not gates.`,
      say: r`I match the worst-case pull-up and pull-down to a reference inverter. Series devices scale up by the stack height; parallel devices are sized for one conducting. With a 2-to-1 inverter, a NAND2 is NMOS 2 and PMOS 2, a NOR2 is NMOS 1 and PMOS 4, so NOR inputs are heavier and NAND logic is preferred. And a bigger gate loads its driver, so sizing is a path problem.`,
      traps: ['Sizing parallel devices for "all on". Worst case is one device conducting.', 'Forgetting that modern FinFET PMOS is nearly as strong as NMOS, so 1:1 sizing is often closer to reality than 2:1.', 'Sizing a gate in isolation without checking what drives it.'],
      ask: ['Size a NAND3 and a NOR3 for a 2:1 inverter. Give their logical efforts.', 'Why might you choose a 1.5:1 PMOS ratio instead of 2:1?', 'How do you size an AOI21?'],
      worked: { q: r`Size a NOR3 to match a 2:1 inverter (NMOS 1, PMOS 2). What is its input capacitance per input and its logical effort?`, a: r`Pull-down: three NMOS in parallel, worst case one on, so each NMOS is width 1. Pull-up: three PMOS in series, each must be $3 \times 2 = 6$. Input capacitance per input $= 1 + 6 = 7$ against the inverter's 3, so $g = 7/3 \approx 2.33$. Compare NAND3: NMOS 3, PMOS 2, input $= 5$, $g = 5/3$.` },
      figs: [{ src: 'assets/fig/models/cmos-sizing.png', cap: 'NAND3 sizing: wider series devices restore drive at the cost of input capacitance.', from: 'Earlier studio model figure' }],
    },
    'gate-power': {
      model: r`Each time a node is charged from 0 to $V_{DD}$, the supply delivers $CV_{DD}^2$. Half is burned in the PMOS during the charge, half is stored on the capacitor and burned in the NMOS on the next discharge. So one full 0→1→0 cycle costs $CV_{DD}^2$, independent of transistor size.

Average dynamic power is $P = \alpha C V_{DD}^2 f$, where $\alpha$ is the probability of a 0→1 transition per clock cycle. A clock has $\alpha = 1$ (it rises every cycle), random data about 0.25, and many control signals far less. Because power goes with $V^2$, voltage is the strongest lever; because it goes with $\alpha C$, clock gating and reducing switched capacitance come next.

Two other components: **short-circuit power** while both networks conduct during slow input edges (keep slews sharp and comparable at input and output), and **leakage**, which flows whether or not anything switches and grows exponentially as $V_T$ falls or temperature rises.`,
      say: r`Charging a node from zero to VDD draws C VDD squared from the supply: half burns in the pull-up, half is stored and burns in the pull-down later. Average dynamic power is alpha C V squared f with alpha the 0-to-1 probability per cycle. V squared makes voltage the biggest lever, then activity and capacitance through clock gating. Short-circuit power comes from slow edges, and leakage flows regardless of switching.`,
      traps: ['Saying a wider PMOS burns more energy charging the node. Energy per transition is CV², independent of the resistance.', 'Defining α as transitions per cycle (both edges) while also using a 1/2 factor. Pick one convention.', 'Forgetting that the clock network is often 30% or more of dynamic power.'],
      ask: ['What is α for a clock, random data, and a signal that toggles every cycle?', 'Where does the energy go in a full cycle?', 'How would you cut dynamic power 30% without changing frequency?'],
      worked: { q: r`A block switches 2 nF of total capacitance with average activity 0.1 at 1.5 GHz and 0.8 V. Estimate dynamic power, then the power if voltage drops to 0.7 V with frequency scaled down to 1.2 GHz.`, a: r`$P = 0.1 \times 2\,\text{nF} \times 0.64 \times 1.5\,\text{GHz} = 192$ mW. At 0.7 V and 1.2 GHz: $0.1 \times 2\,\text{n} \times 0.49 \times 1.2\,\text{G} = 117.6$ mW, a 39% reduction for a 20% frequency loss. That cubic-like payoff is why DVFS works.` },
      figs: [{ plot: 'energy', cap: 'Energy per operation versus VDD: dynamic energy falls as V², leakage energy per operation rises as circuits slow, giving a minimum-energy point just below VT.' }],
    },
    'leakage-mechanisms': {
      model: r`An off transistor still conducts. The dominant mechanism is **subthreshold leakage**: below threshold the channel current falls exponentially with gate voltage at the **subthreshold slope** $S = n \cdot \frac{kT}{q}\ln 10$, at best about 60 mV/decade at room temperature and typically 70-90 mV/decade in real devices. So every 80 mV of $V_T$ costs roughly 10× leakage.

**DIBL** lowers $V_T$ as the drain voltage rises in a short channel, so an off device with full $V_{DS}$ leaks more. **Temperature** raises leakage exponentially (lower $V_T$, larger $kT/q$). Other paths: gate tunnelling through thin oxide (largely fixed by high-k dielectrics), junction and band-to-band tunnelling (GIDL) at high fields.

**Stacking** is free leakage reduction: in two series off NMOS, the middle node rises a little. That makes the top device's $V_{GS}$ negative, reduces its $V_{DS}$ (less DIBL) and raises its source-body voltage (body effect). The stack leaks several times less than one device, which is why leakage depends on the input **state**, not just the cell.`,
      say: r`An off device leaks mainly through subthreshold conduction, which falls about a decade per 80 mV of gate voltage below threshold, so lower VT or higher temperature costs leakage exponentially. DIBL makes it worse at full drain voltage. Stacking two off devices helps because the middle node rises, giving the top device negative VGS, less DIBL and some body effect, so leakage depends on the input state.`,
      traps: ['Claiming 60 mV/decade for a real device. That is the room-temperature limit; real planar and FinFET devices sit above it.', 'Treating leakage as one number per cell. It changes several-fold with input state.', 'Forgetting temperature: hot leakage can be 10× room temperature.'],
      ask: ['Which NAND3 input state leaks most, and why?', 'Why does a 2-stack leak much less than one device in planar but less dramatically in FinFET?', 'Name four leakage mechanisms and the dominant one.'],
      worked: { q: r`A device has $S = 85$ mV/dec and 10 nA off-current at $V_T = 0.35$ V. A low-Vt flavour has $V_T = 0.26$ V. Estimate its off-current.`, a: r`$\Delta V_T = 90$ mV, so leakage rises by $10^{90/85} \approx 11.4\times$, about 114 nA. That is why low-Vt cells are used only on critical paths.` },
      figs: [{ plot: 'subvt', cap: 'Subthreshold current on a log scale: slope set by n·kT/q·ln10; higher VDS shifts the curve left (DIBL).' }, { plot: 'leakT', cap: 'Leakage rises exponentially with temperature.' }],
    },
    'logical-effort': {
      model: r`Logical effort turns path sizing into arithmetic. The delay of a stage in units of $\tau$ is $d = gh + p$: $g$ is the **logical effort** (how much worse the gate is than an inverter at driving current for the same input capacitance), $h = C_{out}/C_{in}$ is the **electrical effort**, and $p$ is the **parasitic** self-delay.

For a path, multiply: $G = \prod g_i$, $H = C_{out}/C_{in}$, and $B = \prod b_i$ for **branching** (off-path loads also draw current from the driver). The path effort $F = GBH$. Delay is minimised when every stage bears the same effort $\hat f = F^{1/N}$, giving $D = NF^{1/N} + P$. The best stage effort is about 4 (between 3 and 6 is nearly flat), which is why the FO4 delay is the natural unit and why buffer chains taper by about 4.

Then work backwards from the load: each stage's input capacitance is $C_{in,i} = g_i C_{out,i}/\hat f$. Finally round to legal sizes and keep the right polarity.`,
      say: r`Logical effort says stage delay is g times h plus p. For a path I compute G, B and H, take F equals GBH, and choose the number of stages so the effort per stage is about 4. Delay is N times F to the 1 over N plus the parasitics, and I size backwards from the load with C in equals g C out over f-hat. Then I round to real cells and check polarity.`,
      traps: ['Forgetting branching effort; off-path loads still load the driver.', 'Treating stage effort 4 as sacred. The optimum is flat between about 3 and 6, and parasitics push it up.', 'Ignoring that adding an inverter flips polarity.'],
      ask: ['What is the FO4 delay in τ, and in ps for your node?', 'A path has G = 2, B = 8, H = 9.6. How many stages?', 'When does logical effort break down?'],
      worked: { q: r`Drive a 256× load from a unit inverter. How many stages minimise delay, and what is the delay (inverter $p = 1$)?`, a: r`$F = 256$. $\hat N = \log_4 256 = 4$ stages, each with effort $256^{1/4} = 4$. $D = 4 \times 4 + 4 \times 1 = 20\tau$. With 3 stages: $3 \times 6.35 + 3 = 22\tau$; with 5: $5 \times 3.03 + 5 = 20.2\tau$. A one-stage design would be $257\tau$.` },
      figs: [{ plot: 'stages', cap: 'Path delay versus number of stages for F = 256: shallow minimum around N = 4.' }],
    },
    'sram-operation': {
      model: r`A 6T SRAM cell is two cross-coupled inverters (storage) plus two NMOS access transistors gated by the wordline, connecting the internal nodes Q and QB to the bitlines BL and BLB.

**Read**: precharge both bitlines high, raise the wordline. The side storing 0 pulls its bitline down through access plus pull-down. That 0 node bumps up because the access device injects charge; if the bump exceeds the other inverter's trip point the cell flips (**read disturb**). So the **pull-down must be stronger than the access device**: the cell ratio $CR = (W/L)_{pd}/(W/L)_{acc}$ is typically 1.5-2.5.

**Write**: drive one bitline low hard, raise the wordline. The access device must pull the stored 1 node down below the trip point against its PMOS pull-up. So the **access device must beat the pull-up**: the pull-up ratio $PR = (W/L)_{pu}/(W/L)_{acc}$ must be small.

Read wants a weak access device, write wants a strong one. That conflict is the heart of SRAM design and why assists exist.`,
      say: r`A 6T cell is two cross-coupled inverters and two access transistors. On read, both bitlines are precharged and the 0 side discharges its bitline; the stored 0 bumps up, so the pull-down must beat the access device, that's the cell ratio. On write, one bitline is driven low and the access device must overpower the PMOS pull-up, that's the pull-up ratio. Read wants a weak access device and write wants a strong one.`,
      traps: ['Saying a write pushes the 0 node high. You write by pulling the 1 node low; NMOS access devices pass 0s well.', 'Mixing up which ratio protects which operation.', 'Forgetting that read stability is worst with the wordline on and both bitlines precharged high.'],
      ask: ['Why is the access transistor sometimes longer than minimum?', 'Name two read assists and two write assists.', 'Why do memories use sense amplifiers?'],
      worked: { q: r`Pull-down 130/65, pull-up 115/65, access 100/75 (nm). Compute CR and PR.`, a: r`Access $W/L = 100/75 = 1.33$. $CR = (130/65)/1.33 = 2/1.33 = 1.5$. $PR = (115/65)/1.33 = 1.77/1.33 = 1.33$. The longer access channel is a cheap way to weaken it for read stability without shrinking width below the minimum.` },
      figs: [{ src: 'assets/fig/circuits/sram-6t.svg', cap: '6T SRAM cell: cross-coupled inverters with NMOS access devices on BL and BLB.', from: 'Earlier studio circuit figure' }],
    },
    'sram-margins': {
      model: r`**Static noise margin (SNM)** is the largest DC noise voltage the cell can absorb without flipping. Plot one inverter's transfer curve and the mirror of the other on the same axes (the **butterfly curve**); the side of the largest square that fits inside the smaller lobe is the SNM.

There are different SNMs for different conditions: **hold SNM** (wordline off) is the largest; **read SNM** (wordline on, bitlines precharged) is smaller because the access device lifts the 0 node; **write margin** is measured differently, as how low a bitline must go (or how far the cell trip point must move) to flip the cell.

Variation shrinks every margin, and an array of millions of cells needs each margin to survive roughly 5-6σ of local mismatch. **Assists** move one margin at the cost of another: lowering the wordline voltage or raising the cell supply during read helps read stability but hurts write; lowering the cell supply or driving the bitline negative during write helps write but costs read stability, power or reliability. Assists are therefore applied only during the operation that needs them.`,
      say: r`SNM is the side of the largest square inside the smaller lobe of the butterfly curve. Hold SNM is largest, read SNM is smaller because the access device lifts the 0 node, and write margin is a separate measurement. Assists trade one margin against another, so they are applied only during read or only during write, and margins must survive 5 to 6 sigma of mismatch because the array is huge.`,
      traps: ['Quoting one SNM for the cell without saying hold, read or write.', 'Turning an assist on all the time.', 'Checking margins at nominal instead of at high sigma.'],
      ask: ['Which mismatch hurts read stability most?', 'What is a negative bitline write assist and what does it risk?', 'How many sigma does an 8 Mb array need?'],
      worked: { q: r`An 8 Mb array without redundancy must yield 99%. What per-cell failure probability does that imply?`, a: r`$Y = (1-p)^N \approx e^{-Np}$, so $p \approx -\ln(0.99)/N = 0.01005/8.39\times10^6 \approx 1.2\times10^{-9}$, roughly a 6σ requirement per cell. Redundancy relaxes this.` },
      figs: [{ plot: 'yield', cap: 'Array yield versus per-cell sigma margin: a few tenths of a sigma separate a dead array from a good one.' }],
    },
    'bitline-sensing': {
      model: r`A bitline is a long wire with dozens to hundreds of cells hanging off it, so its capacitance is large (tens to hundreds of fF), while a cell's read current is small (tens of µA). Waiting for a full swing would be slow and burn $CV^2$, so memories let the bitlines develop a **small differential** (tens of mV to ~100 mV) and then fire a **sense amplifier** that regenerates it to full rail.

The time to develop $\Delta V$ is $t = C_{BL}\Delta V / I_{cell}$. The required $\Delta V$ is set by the sense amplifier's **offset** (mismatch, typically several σ of tens of mV) plus noise and margin. Fire sense-enable too early and the amp resolves the wrong way; too late and you waste delay and power. Sense-enable timing usually comes from a **replica bitline** that tracks the real one over PVT.

Organisation trades: more cells per bitline means more capacitance and slower sensing; **column muxing** shares one sense amp between several columns and lets a tall-thin logical array become square; **banking** splits the array to cut bitline and wordline length at the cost of decode and periphery area.`,
      say: r`Bitlines are heavily loaded and cells are weak, so we only develop a small differential, set by the sense amp's offset plus margin, then let a regenerative sense amp amplify it. Development time is C times delta V over the cell current, and sense-enable is timed by a replica bitline so it tracks PVT. Banking and column muxing trade bitline length against periphery.`,
      traps: ['Sizing ΔV to the nominal sense-amp offset instead of its high-sigma value.', 'Firing sense-enable from a fixed delay chain that does not track the bitline over corners.', 'Forgetting that bitline leakage from unselected cells eats the differential.'],
      ask: ['What sets the required bitline swing?', 'Why is the sense amp isolated from the bitlines once it fires?', 'Fold a 2k × 16 array: what are the options?'],
      worked: { q: r`Bitline 120 fF, cell current 25 µA, sense-amp offset σ = 12 mV, design for 5σ plus 20 mV margin. How long before firing sense-enable?`, a: r`$\Delta V = 5 \times 12 + 20 = 80$ mV. $t = 120\,\text{fF} \times 80\,\text{mV} / 25\,\mu\text{A} = 384$ ps.` },
      figs: [{ plot: 'bitline', cap: 'Bitline differential development: fire sense-enable when ΔV covers the sense-amp offset plus margin.' }, { src: 'assets/fig/diagrams/senseamp.svg', cap: 'Latch-type sense amplifier.', from: 'Circuit Design Interview Bible' }],
    },
    'rom-read-margins': {
      model: r`In a precharged NOR-type ROM, each bitline is precharged high and each stored bit is either a transistor connected to the bitline (reads 0, discharges it) or absent (reads 1, bitline stays high). A weak PMOS **keeper** holds the bitline high against leakage.

Two conditions must both pass at the sense instant. **Selected 0**: the selected cell's current minus the keeper current must discharge $C_{BL}$ by the sense threshold in time: $t \approx C_{BL}\Delta V/(I_{sel}-I_{keeper})$. **Retained 1**: with no selected device, the leakage of all $N-1$ unselected devices on the bitline must not droop it below the threshold, and the keeper must supply that leakage.

The keeper sits right in the middle: stronger keeper protects the 1 and slows the 0. Worst cases are opposite corners: the 0 read is slowest at slow/cold-or-low-voltage, the 1 is most at risk at fast/hot where leakage peaks. The code pattern matters too, because a column full of devices has more leakage and more capacitance than an empty one.`,
      say: r`A precharged ROM bitline must pass two checks at sense time: a selected cell must discharge it past threshold despite the keeper, and an unselected bitline must stay high despite N minus 1 leaking cells. The keeper helps the second and hurts the first, and they bind at opposite corners, slow for the 0 and fast-hot for the 1, so I size the keeper against both.`,
      traps: ['Making the keeper "stronger to be safe". It slows or breaks the 0 read.', 'Checking only one corner.', 'Ignoring code-dependent bitline loading.'],
      ask: ['A ROM fails one address at FF/125 °C reading 0 instead of 1. Debug it.', 'What if precharge and wordline overlap?', 'Compare NOR and NAND ROM.'],
      worked: { q: r`$C_{BL} = 200$ fF, precharge 0.8 V, sense threshold 0.5 V. Selected current 24 µA, keeper 6 µA. Each unselected cell leaks 15 nA at FF/hot and there are 127. Evaluation window 3 ns. Check both reads.`, a: r`Selected 0: $t = 200\,\text{f} \times 0.3/(24-6)\,\mu = 3.33$ ns, which **misses** the 3 ns window. Retained 1: leakage $= 127 \times 15\,\text{nA} = 1.9\,\mu\text{A}$, well below the 6 µA keeper, so the 1 is safe with margin. The keeper is oversized: dropping it to 3 µA gives $t = 2.86$ ns for the 0 while still covering the 1.9 µA leak.` },
      figs: [{ src: 'assets/fig/models/rom.png', cap: 'ROM keeper: selected-discharge time versus retained-high droop.', from: 'Earlier studio model figure' }],
    },
    'low-power-domains': {
      model: r`Pick the technique by what it removes and what must survive.

**Clock gating** removes switching in idle registers and their clock tree, keeps state, and costs almost nothing in wake-up time. It is the first lever. **Multi-Vt** swaps non-critical cells to high-Vt to cut leakage at no state cost. **DVFS** lowers voltage and frequency together; since $P \propto fV^2$ and $f$ roughly tracks $V$, power falls roughly with $V^3$ for a task that can run slower. **Power gating** cuts the supply with header or footer switches, removing leakage, but loses state unless you add **retention** flops, needs **isolation** cells so floating outputs do not corrupt powered-on logic, and takes time and rush current to wake.

Crossing between **voltage domains** needs **level shifters** going low-to-high (a low-voltage 1 does not turn off the high-voltage PMOS), and a defined power-up and power-down sequence. These intents are written in UPF/CPF and verified like logic.`,
      say: r`Clock gating removes idle switching and keeps state, so it comes first. Multi-Vt cuts leakage off the critical path. DVFS lowers V and f together for roughly cubic power savings. Power gating removes leakage but needs isolation, retention and a wake-up sequence. Low-to-high domain crossings need level shifters, and all of it is captured in UPF.`,
      traps: ['Power gating without isolation cells, letting floating outputs drive active logic.', 'Forgetting rush current and IR when a gated block wakes.', 'Putting a level shifter only on high-to-low crossings.'],
      ask: ['Which direction needs a level shifter, and why?', 'Retention flop: how does it work?', 'Rank clock gating, power gating, DVFS by wake-up time.'],
      worked: { q: r`A block runs a task 20% of the time at 1 W active and leaks 100 mW when idle. Compare clock gating only (idle power = leakage) with power gating (idle 5 mW, 50 µJ per wake-up, 1000 wake-ups per second).`, a: r`Clock gating: $0.2 \times 1 + 0.8 \times 0.1 = 280$ mW. Power gating: $0.2 + 0.8 \times 0.005 + 1000 \times 50\,\mu\text{J}/\text{s} = 0.2 + 0.004 + 0.05 = 254$ mW. Power gating wins here, but at 2000 wake-ups per second the wake-up energy (100 mW) would make it lose. Break-even idle time matters.` },
      figs: [{ src: 'assets/fig/diagrams/levelshifter.svg', cap: 'DCVS level shifter: cross-coupled PMOS restore a full high-domain swing.', from: 'Circuit Design Interview Bible' }],
    },
    'adaptive-voltage': {
      model: r`Fixed voltage margins cover the worst chip at the worst temperature and aging. Most chips are better than that, so **adaptive voltage scaling** measures margin on each chip and lowers voltage until a monitor says the margin is just enough.

Monitors: **ring oscillators** or **critical-path replicas** (cheap, but they only track variation that affects them the same way as the real paths), **canary** flops that fail slightly before the real path, and **in-situ** detectors like Razor that watch real paths and catch late transitions, then correct by replay.

Everything depends on what the monitor can see and how fast the loop is. Local variation between the monitor and the real critical path needs a margin ($\sqrt{\sigma_{canary}^2+\sigma_{crit}^2}$ times a sigma multiplier). Fast supply droops faster than the control loop need a margin of at least slope × response time. In-situ error detection catches what replicas miss but adds hold constraints (the detector watches a window after the edge) and needs a recovery mechanism.`,
      say: r`Adaptive voltage lowers each chip's voltage until a monitor says margin is just enough. Replicas and ring oscillators are cheap but only track what they share with the real paths; canaries fail first; in-situ detectors like Razor see the real path but add hold constraints and need replay. The remaining margin covers local mismatch between monitor and path and any droop faster than the loop.`,
      traps: ['Assuming a replica tracks local variation or a different path mix.', 'Ignoring droops faster than the controller.', 'Forgetting Razor\'s short-path hold constraint.'],
      ask: ['DVFS versus AVFS?', 'Why does a canary need margin even for slow variations?', 'A Razor chip has one hold violation. What happens?'],
      worked: { q: r`A canary flop has σ = 4 ps of local delay mismatch and the critical path σ = 6 ps. Design to 4σ. The supply can slew 2 mV/ns, delay sensitivity is 0.8 ps/mV, and the loop reacts in 50 ns. What margin do you keep?`, a: r`Mismatch: $4\sqrt{4^2+6^2} = 4 \times 7.2 = 28.8$ ps. Droop during the reaction: $2\,\text{mV/ns} \times 50\,\text{ns} = 100$ mV, times 0.8 ps/mV = 80 ps. Total about 109 ps: the slow loop, not mismatch, dominates.` },
    },
    'compute-in-memory': {
      model: r`Moving a bit from DRAM costs orders of magnitude more energy than a multiply-accumulate on it, so for data-heavy workloads such as neural networks, energy is dominated by data movement. **Compute-in-memory** performs the multiply-accumulate inside or beside the array: many wordlines are activated at once and each cell contributes current or charge in proportion to input × weight, so the bitline sums them.

The catch is analog precision. The accumulated value must be converted by an ADC, and ADCs are expensive in area and energy, often dominating the macro. **Signal margin** per level shrinks as more rows are accumulated (the output range is fixed but the number of levels grows) and variation, leakage and nonlinearity eat it. That limits rows per accumulation and bits per operation.

Design choices: 8T cells (decoupled read port so multi-row activation cannot disturb storage), current-domain (fast, variation-sensitive) versus charge-domain (more linear, capacitor area), or digital CIM (adder trees near the array, exact but larger). An efficiency claim in TOPS/W means nothing without bit width, workload, utilisation and whether the ADC and data movement are included.`,
      say: r`CIM attacks data movement: activate many rows so the bitline sums input times weight. The cost is analog precision, the ADC is often the dominant energy and area, and signal margin per level shrinks with more rows, so you limit rows per accumulation. 8T cells protect storage during multi-row reads, and any TOPS per watt number needs bit width, utilisation and the system boundary.`,
      traps: ['Quoting TOPS/W at 1-bit precision and comparing it to an 8-bit design.', 'Leaving the ADC out of the energy.', 'Using 6T cells for many-row activation and disturbing storage.'],
      ask: ['Why do CIM designs often use 8T cells?', 'Current-domain versus charge-domain accumulation?', 'What limits the number of rows accumulated at once?'],
    },
  });
})();
