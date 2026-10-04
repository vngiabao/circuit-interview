## Part 0 — Read this first (Friday morning)

This is the **last document**, written to be read **after** the other four: the Bible, the Scripting Companion, and the 427 and 627 lecture packets. It does **not** add new material to memorize. It **compresses** everything into what you say and draw in 45 minutes, and it fills the few gaps found by checking the Perplexity question list against your documents.

References use the code **[B p.N]** for the printed Bible, **[S p.N]** for the Scripting Companion, and **[427 p.N] / [627 p.N]** for the lecture packets.

### 0.1 The morning plan (interview 1:00 PM PT / 4:00 PM ET, Teams, camera on)

| Time (ET) | Do | Output |
| --- | --- | --- |
| Morning, 60 min | **Part 1** out loud: opener, why NVIDIA, three project answers, gap lines | Each one under its time limit, no notes |
| 60 min | **Part 2 drill sheets**: draw every figure on paper **from memory**, then check | 7 drawings, each narrated in < 2 min |
| 30 min | **Part 3** project sheets: say "I owned / I did not own" for each project | Clean boundaries |
| 30 min | Skim **Part 4** (where every Perplexity question is answered) for any you can't answer in one breath | Gaps closed |
| 3:00 PM | Test Teams, camera, mic, pen + paper or tablet for drawing; water; close every other app | Calm |
| 3:55 PM | Read **Part 5** (last 5 minutes) | Ready |

!!! guard "Interview rule from your email"
    **No ChatGPT or any outside tool during the interview** (disqualification). Close all AI apps before 4:00 PM.

### 0.2 Perplexity's feedback: what's true and what isn't

| Perplexity said | Verdict | Why / what to do |
| --- | --- | --- |
| Too much material at equal priority; make a short first-round sheet | **True** | This document is that sheet. The rest is reference |
| "Full 55-page Bible" | **Wrong number** | Your printed Bible is 153 pages; it probably saw an older draft. Doesn't change the advice |
| Company revenue and product names are low return | **True** | Keep one 20-second "why NVIDIA" (1.2). Don't quote revenue unless asked |
| Don't memorize Innovus syntax; know the intent | **True** | Know *why* you added a route blockage or diode; a handful of commands is enough [S p.10] |
| Don't oversell Perl | **Partly** | Your Faraday line in the Bible [B p.53] says you automated checks in **Tcl/Perl/Csh**. **If that's true, say it** ("at Faraday I wrote Tcl/Perl/Csh checks"). The NTT repo itself has **no Perl**. Never call yourself a production Perl developer |
| Drop NTT numbers like 608 diodes or 1,100 pins unless you can defend them | **True in principle** | The numbers are **verified from the repo**, but cite them **only for blocks you ran**. Otherwise say "the team" |
| Its 60-second opener | **Mostly good** | Used below with two fixes: lead with **circuit design (WICS)**, and don't imply ROM/library ownership |
| "Cell characterization is the biggest gap" | **Partly** | The content is in [B p.111] and [B p.49, p.41–45], but you lacked a **spoken 7-step answer**. Now in Sheet 6 |
| Leakage: screen, then run the full matrix; never silently cut coverage | **True for signoff, incomplete for the question** | The reported NVIDIA question asks for **minimal compute**. The best answer does both: **make each simulation cheap** (DC, batching, structure) and **keep full coverage** with validated reductions (Sheet 6) |
| Add ROM aspect ratio, mux and banking; corner read failure; verification | **True** | Sheet 5 |
| A single SPICE-debugging answer | **True** | Sheet 6 |
| Gap-handling lines | **True, adopted** | 1.5 (slightly sharpened) |
| Whiteboard fluency beats more reading | **True** | Part 2 is built around drawings |
| "They will very likely test motivation first" | **Partly** | The July 2026 report says the interviewer **skipped intros** [B p.7]. Have the 30-second opener ready, but expect to go straight to résumé and technical |
| Tag every scripting sentence: I wrote / I ran / team did / conceptual | **True, do it tonight** | Mark it in pen on [S p.3–17] |

## Part 1 — The first-round sheet (say these out loud)

### 1.1 "Tell me about yourself" (30 s / 60 s)

> **(30 s)** "I'm a Michigan MS grad in VLSI with a materials-science background, so I came to circuits from the device side. In the WICS lab I designed **ultra-low-power analog front-end blocks in TSMC 65nm** and validated them across PVT. At Faraday I worked on **chip-top DFT and STA on a 22nm tapeout**, so I've been the **customer** of standard-cell and memory models. And in our 627 chip I did **physical integration, DRC/LVS and flow automation**. This role is where device behavior, timing, leakage and verification meet, and that's exactly where I want to go deep."

> **(60 s, add)** "What ties it together: in subthreshold design I learned how exponentially sensitive current is to Vt and temperature. That's the same physics behind leakage and low-voltage margins in cells and ROMs. At Faraday I saw how every timing number comes from the library. I want to be the one who makes those numbers trustworthy."

!!! guard "Never say"
    "I have a PhD" (say "I started on the PhD track and completed my MS") · "taped out" or "clean signoff" for NTT · "I designed a cell library" or "I designed a ROM."

### 1.2 "Why NVIDIA, why this role, why ROM?" (45 s)

> "NVIDIA's chips push the hardest on performance and power, and foundation IP **multiplies across every chip**: one better cell or ROM improves every design that uses it. I like work where **correctness is the product**: thousands of engineers trust the library's numbers without re-checking them. And ROM is a small circuit with deep margin problems, one weak cell against a keeper while every other cell on the bitline leaks at a hot, fast corner. That's transistor-level physics I enjoy, and my **analog margin habits transfer directly**."

### 1.3 The three project answers (spec → choices → corners → failure/debug → result → my part)

| Project | Say this (60–90 s) | Your part, said precisely |
| --- | --- | --- |
| **WICS** (TSMC 65nm) | TIA + active-RC filter for an implantable auditory front end. **Subthreshold** for max gm/Id. Challenge: **stability and noise across PVT**, because current is exponential in Vt and temperature. **[fill in: the corner that broke, what you changed, the number]** | "I designed and simulated these blocks" (schematic/layout status: **[fill in]**) |
| **Faraday** (UMC 22nm) | Chip-top **DFT and STA checks**: scan, **MBIST** integration, ATPG/ATE patterns, **PrimeTime** debug with fixes recommended to PD. Automated the check chain. Taped out on a **1.5-month** schedule; top-10% rating | "My lane was DFT/STA checks and handoffs, **not** physical design or cell design" |
| **NTT** (IBM 130nm, 627) | Configurable NTT accelerator: 16 butterfly PEs, ~86 memory macros, async FIFOs, **hierarchical** APR. Blocks clean; **top-level DRC/LVS not closed** by the deadline; a **low-DMA-frequency bug** I've since traced to a likely race | "My part was physical integration: **[fill in: your blocks]**, macro floorplan, power grid, pins, DRC/LVS/antenna fixes" |

!!! value "If you don't remember a number"
    "I don't recall the exact value. Qualitatively it was X, and I'd verify it by Y." Then move on. **An honest gap beats a wrong number.**

### 1.4 Six stories (45–70 s each, end on a result)

| # | Prompt | Story | End on |
| --- | --- | --- | --- |
| 1 | Hardest technical problem | WICS TIA/filter across PVT | [fill in: the fix and number] |
| 2 | Tough deadline / speed | Faraday 22nm, 1.5-month tapeout + automation | On time, top-10% |
| 3 | Mistake / unfinished work | NTT top-level closure left too late (or grad-school overload) | "Now I budget closure and interfaces from day one" |
| 4 | Learning fast | Faraday DFT/STA flow, new to you | Productive in weeks |
| 5 | Disagreement / influence | Implant chip-platform disagreement | Listened for the real constraint; decided with evidence |
| 6 | Cross-team | Faraday Taiwan–Vietnam handoffs | Clean handoffs, on-time tapeout |

### 1.5 Gap-handling lines (calm, short, then show reasoning)

| Challenge | Say |
| --- | --- |
| "You haven't designed a standard-cell library." | "True. I've used libraries downstream (timing, APR, DRC/LVS, automation) and I've designed transistor-level blocks across PVT, but I haven't owned a library release. Let me show you how I'd design and characterize a cell." **Then do Sheet 6.** |
| "You haven't designed a ROM." | "Not end to end. I understand the read path, precharge, wordline, bitline discharge versus leakage, sense timing, and where it fails. Let me draw a NOR ROM column." **Then do Sheet 5.** |
| "Perl?" | "At Faraday I used Tcl/Perl/Csh for check automation [only if true]; today I'm strongest in Tcl, Make, Python and shell. Perl is the same regex-and-file pattern, and I'd ramp on the team's scripts quickly." |
| A question past your depth | "I haven't worked with that directly. From first principles I'd expect X because Y, and I'd confirm it with Z." |

### 1.6 Three questions to ask Bo (pick by how the conversation went)

1. "Your intern project was **EM flow enhancements**. Did that flow go into production use, and what was the hardest part: accuracy, runtime, or trust?"
2. "**Right now, how is your time split** between new-node library work, chip-team requests and debug?"
3. "For ROM sign-off, do you verify with **real firmware patterns or synthetic worst cases**?" (or: "What separates new engineers who ramp quickly here?")

## Part 2 — Seven drill sheets (draw each from memory, narrate in under 2 minutes)

### Sheet 1 — CMOS inverter, gates, sizing, leakage

DIAGRAM:inverter

**Draw:** PMOS on top, NMOS below, load C. Then sketch the VTC.

- **VTC points:** **VOH/VOL** are the output levels; **VIL/VIH** are where the slope = −1. Noise margins: **NMH = VOH − VIH**, **NML = VIL − VOL**. **Switching threshold VM**: where Vin = Vout. A stronger PMOS (bigger β ratio) pushes VM up. **Balanced VM ≈ VDD/2 when Wp/Wn ≈ µn/µp**.
- **Why PMOS is wider:** hole mobility ≈ ½ electron mobility in planar (**2:1**); in FinFET with strained PMOS it's closer to **1:1** [B p.53].
- **Delay ≈ 0.69·R·C ∝ C·VDD / I_on.** Each knob:
    - **R (size):** wider = faster, but **self-loading**: intrinsic delay stays.
    - **C:** load + wire + self.
    - **Input slew:** slower input → longer delay and more short-circuit current.
    - **VDD:** higher = faster (delay ∝ VDD/(VDD−Vt)^α).
    - **Temperature:** hot = slower at high VDD (mobility), but **faster at low VDD** (Vt drops): **temperature inversion**.
    - **Process:** SS slow, FF fast.
- **NAND2 worst transitions:** **fall** = both NMOS in series; worst when the **input nearest ground arrives last** (it must also discharge the internal node). That's why the **late input goes nearest the output**. **Rise** = only one PMOS on is worst.
- **Stacking:** about **5–10× less leakage per 2-stack** (427 data: 258 → 36.1 pA) [427 p.95]. Slower because of series R, so devices need to be wider: more area and input cap.
- **Power:** dynamic **αCV²f** (fix with clock gating, less C, lower V); short-circuit (fix with balanced, sharp slews); leakage (fix with HVT, stacks, longer L, power gating).
- **LVT/SVT/HVT:** same footprint, different Vt. **LVT** on critical paths (fast, roughly 10× more leakage per 100 mV lower Vt); **HVT** on non-critical, always-on and retention logic; **SVT** as default. Swapping Vt is a late timing/leakage knob.
- **"Why isn't X4 four times faster than X1?"** X4 cuts the **effort delay** (gh) by 4× for the same load, but its **parasitic delay p stays**, and its **4× input cap slows the previous stage**. Beyond some load, upsizing stops helping.

!!! eq "Logical effort in one line"
    **d = g·h + p**; NAND g = (n+2)/3, NOR g = (2n+1)/3; best ≈ 4 per stage; FO4 = 5τ ≈ L/3 ps [427 p.29–31].

**Debug scenario:** *"Rise is 2× slower than fall."* Check the P/N ratio for the actual corner (SF?), the input slew, the PMOS stack depth, and whether it's the **worst** input (NOR rise) or a measurement-threshold mistake.

### Sheet 2 — Latches, flip-flops, setup/hold, ICG, metastability

DIAGRAM:dff

**Draw:** TG master latch (transparent when CLK low) → TG slave latch (transparent when CLK high), with feedback inverters through clocked TGs.

```latex
T_{clk} \ge t_{cq,max} + t_{comb,max} + t_{setup} + t_{skew/uncert} \qquad t_{cq,min} + t_{comb,min} \ge t_{hold} + t_{skew/uncert}
```

- **Latch vs flop:** a latch is **level-sensitive** (transparent for a whole phase); a flop is **edge-triggered** (master–slave = two latches on opposite phases).
- **Cell-level causes:**
    - **Setup:** data must get through the master's input TG and inverter, and set the feedback loop, **before** the master closes.
    - **Hold:** the master's input TG closes slightly **after** the edge (clock buffering, CLK/CLKB skew), so data changing in that window can sneak in.
    - Both are measured as the data offset where **clk→Q pushes out 5–10%** (427 CAD2 used 5%) [427 p.123]. They **can be negative**.
- **Hold can't be fixed by slowing the clock:** T doesn't appear in the hold inequality. Fix with **delay on the short path**, less skew, or a flop with smaller hold.
- **Reducing clk→Q, and what it costs:**
    - Stronger slave/output stage → more clock load and power.
    - LVT on the clk→Q path → more leakage.
    - Pulsed latch (fewer stages) → **larger hold time**.
    - Smaller internal nodes → less noise robustness.
    - Change one thing, then re-check setup, hold, power and robustness.
- **Clock overlap:** if CLK and CLKB are both partly on, **master and slave are transparent at once**, so data can **race through**. Fix with local clock buffering and sizing, or a C²MOS / non-overlap design.
- **ICG cell** (**latch + AND**):
    - The latch is transparent while CLK is low, so **EN must be stable while CLK is high**: no glitch can reach the gated clock.
    - Validate with EN setup/hold to the rising edge, a glitch check, clock-to-gated-clock delay, and both EN polarities.
- **Metastability:** when data changes inside the aperture, the latch sits near its balance point and resolves with time constant **τ**. **Characterization can't eliminate it**: it gives **τ and the aperture** for an MTBF calculation, and synchronizers (two flops) buy resolution time [627 p.20–22].
- **Minimum pulse width and minimum period** exist because internal nodes and feedback loops need time to **settle and regenerate**. A clock pulse that's too short won't write the latch. The .lib carries **min_pulse_width** and minimum-period constraints.
- **Static vs TG vs pulse-triggered flops:** TG master–slave is robust, with moderate clk→Q and high clock load. Pulse-triggered (HLFF, pulsed latch) has small clk→Q and soft edges, but **large hold** and pulse-generator variability [427 p.128–129].

**Debug scenario:** *"Setup passes at TT but the flop fails at SS, low VDD."* Re-run with realistic input slew and clock slew; check whether the master's feedback is too strong (it fights the write) or the input TG is too weak; verify clk→Q pushout versus the failure criterion.

### Sheet 3 — Level shifters, multi-VDD, noise, low voltage

DIAGRAM:levelshifter

**Draw:** two NMOS pull-downs driven by IN / INB (VDDL domain), cross-coupled PMOS to VDDH, OUT on one side.

- **How it works:** the NMOS on the rising input must **overpower the PMOS** holding that node at VDDH. Once the node falls, the other PMOS turns on and the outputs latch.
- **Why it fails:** when **VDDL nears Vt**, the NMOS is weak (subthreshold) and loses the fight. Worst at **FS, cold** for a near-threshold VDDL (627 Exam 1 P2) [627 p.34–36]. Also contention current and slow or asymmetric edges.
- **Design for robustness:**
    - Wide NMOS, weak PMOS (or current-limited / split PMOS).
    - Check across **all VDDL/VDDH combinations, corners and temperatures**, including **Monte Carlo** for mismatch.
    - Wide-range variants exist (SLC, interrupted DCVS); a **level-converting flop** hides the delay.
- **High → low is free; low → high needs a shifter** (a VDDL "1" can't shut off a VDDH PMOS). When a domain can power off, add **isolation cells**.
- **Noise in deep submicron:**
    - **Crosstalk** (capacitive coupling; Miller factor 0/1/2 for delay).
    - **Supply noise** (IR + L·di/dt droop).
    - **Clock jitter** (eats the setup budget).
    - **SER** (particle strikes; fix with interleaving and hardened latches).
    - **Thermal noise** matters for **sense amps and analog**, but rarely for full-swing logic.
    - Dynamic nodes and sense amps are the most vulnerable: "dynamic logic never recovers from a glitch" [627 p.6–17].
- **Robustness under supply noise:** inject droop and ripple in SPICE (a PWL on VDD or an RLC supply model), check functional **Vmin** and timing at the drooped voltage, and use **noise-immunity curves** (amplitude vs pulse width), not just DC noise margins.

### Sheet 4 — 6T SRAM

DIAGRAM:sram

- **Hold:** cross-coupled inverters. **Read:** precharge both bitlines high, raise WL, the "0" side discharges its bitline through access + pull-down. **Write:** drive one bitline low and overpower the pull-up.
- **Sizing: pull-down strong > access medium > pull-up weak.**
    - **Cell ratio** (PD/access) keeps the read bump on the "0" node below the trip point: CR ≈ 1.2 gives ~0.4 V [427 p.105].
    - **Pull-up ratio** (PU/access) must be small enough for the access device to win on write.
- **Read SNM:** the largest square in the butterfly curve, measured with WL on (read is worse than hold).
- **Write margin**, measured one of three ways:
    1. **WL sweep:** the WL voltage where the cell flips.
    2. **BL sweep:** the bitline voltage where the cell flips. The margin is how far above 0 V that is.
    3. N-curve current metrics.
- **Read disturb:** CR too low, mismatch, high WL, low VDD, temperature. **Write failure:** PR too high, a weak access device, low WL, slow corner, mismatch.
- **Why precharge:** it starts every bitline at a known high so a small, fast discharge (sensed by a sense amp) is enough, and it keeps the bitline from disturbing the cell.
- **Validate across PVT and mismatch:** corners × temperatures × VDD, then local **Monte Carlo** plus **high-sigma** (the bitcell needs ~6σ for Mb arrays) [B p.117], plus assists (negative BL, WL underdrive) if used.
- **Sense-amp offset, bitline leakage, weak read current:**
    - **Offset:** size and match the SA (common centroid), use offset-tolerant timing, budget it at the required sigma.
    - **Bitline leakage:** fewer cells per bitline (hierarchy), HVT or longer-L access devices, keepers.
    - **Weak read current:** longer sense time (replica timing), shorter bitlines, WL boost, lower-C bitlines.

### Sheet 5 — NOR ROM: how it works, margins, verification

DIAGRAM:rom

**Draw:** a precharge PMOS on the bitline, N NMOS cells in parallel to ground (gate = WL), a "1"/"0" set by **transistor or via present/absent**, a keeper, and a sense amp or inverter.

- **Logic:** the selected WL turns on its cell. If the cell is **programmed** (connected), the bitline discharges and reads one value; if not, the bitline stays high (held by the keeper).
- **Physically:** a **mask ROM** with code set by a **via/contact** (a late, cheap mask change) or by **implant/diffusion** (denser, but needs an early mask).
- **The core margin problem:**
    - **Read-0:** one on-cell must beat the keeper fast enough.
    - **Read-1:** **(N−1) off-cells leak** and must not droop the bitline past the sense threshold before SAE.
    - Worst: hot, fast, leaky, long bitline. **Keeper:** I_on(cell) > I_keeper > (N−1)·I_off [427 p.65] [B p.109].

| Option | Density | Changeable | Speed / power | Verification |
| --- | --- | --- | --- | --- |
| **Mask ROM** | Highest | Mask change only | Fast reads, lowest power | Code-pattern dependent |
| **Register file** (flops/latches) | Low | Any time | Fast, multi-port | Standard timing |
| **SRAM** | Medium | Any time; needs loading | Fast; leaks; needs init | Bitcell high-sigma |
| **Std-cell logic ROM** (synthesized constants) | Poor for big tables | Re-synthesis | Fine for tiny tables | Just STA |

- **Aspect ratio, mux factor, banking:**
    - **More rows** → longer bitline: more C and **more leakage cells** per bitline (worse read-1 margin, slower).
    - **More columns** → longer wordline: more WL RC (slow, uneven WL rise).
    - **Column mux** shares sense amps and squares up the array, at the cost of mux delay and charge sharing.
    - **Banking / hierarchical bitlines** cut C and leakage, at the cost of peripheral area.
- **"A ROM bit fails at one corner. Isolate it":**
    1. Reproduce with that **code pattern** and corner.
    2. Probe **BL, WL and SAE**: BL starts low → precharge; BL droops → **leakage vs keeper**; BL falls too slowly → **weak cell / RC**.
    3. Check for supply **droop**.
    4. Compare **schematic vs extracted**.
    5. Run Monte Carlo on SA offset and cells.
- **Robust and dense at once:** keep the cell **minimum** and spend margin in the **periphery**:
    - hierarchical bitlines;
    - **replica / self-timed** sense enable that tracks PVT;
    - right-sized keeper;
    - **data encoding** (invert columns with many connected cells to cut leakage);
    - SA offset budgeted at the required sigma.
- **Verify a ROM:**
    - Functional reads of the **actual code**, plus synthetic worst-case patterns (max-leakage columns).
    - All corners and VDD/temperature; extracted parasitics; statistical (mismatch) analysis of SA and cells.
    - Timing and characterization into the .lib; EM/IR on precharge bursts.
    - DRC/LVS on every configuration of a **compiler**.
    - View consistency: .lib, LEF, GDS, CDL, Verilog [B p.24–28].

### Sheet 6 — Characterization, SPICE, leakage, library QA, automation

DIAGRAM:testbench

**"How would you characterize a standard cell?" (seven steps)**

1. **Arcs and states:** for each input→output arc, set side inputs to **sensitizing values** (e.g., NAND2 A→Y with B = 1); know the unateness.
2. **Index tables:** sweep **input slew** × **output load** (e.g., 7×7) around the library's ranges.
3. **Testbench realism:** a driver cell or library-slew PWL, real load, correct rails, **extracted** netlist for sign-off.
4. **Measure:** delay (50%→50%), output transition (**20–80% or 10–90%: match the library**), switching/internal energy (∫I·V), **input pin cap**, and **leakage per static state**.
5. **Sequential cells:**
    - **setup/hold** by **bisection** on the data-to-clock offset until clk→Q pushes out 5–10% (or fails);
    - clk→Q tables;
    - **min pulse width**;
    - recovery/removal for async pins.
6. **Corners:** every PVT in the release; **LVF/sigma** tables if required.
7. **QA:**
    - **monotonic** in slew and load;
    - no missing arcs;
    - **rise/fall sanity**;
    - corners ordered;
    - drive strengths consistent (X2 ≈ between X1 and X4);
    - leakage: stacked states < single-OFF states;
    - **compare to the previous release** and flag outliers.

```text
.meas tran tpd TRIG v(a) VAL='0.5*vdd' RISE=1 TARG v(y) VAL='0.5*vdd' FALL=1
.meas tran tf  TRIG v(y) VAL='0.8*vdd' FALL=1 TARG v(y) VAL='0.2*vdd' FALL=1
.meas tran ileak AVG i(vdd) FROM=5n TO=6n     $ after settling; or .op per state
```

- **Testbench choices:**
    - **Timestep:** small enough to resolve the fastest edge (accuracy check: the result must not change when you tighten it).
    - **Stop time:** every event plus settling.
    - **Input ramp:** the library slews.
    - **Load:** the table points.
    - **Thresholds:** exactly as in the .lib header.
- **SPICE debugging (one answer):** "First the testbench assumptions: rails, source slews, load, **initial conditions** of bistable nodes, pin order, model corner, and whether it reached steady state. Then **schematic vs extracted** to separate function from parasitics, probing internal nodes. For convergence: **floating nodes, ideal steps, zero-R loops, uninitialized latches** (use .nodeset/.ic). Simplify the testbench before loosening tolerances" [B p.41–45].
- **Nominal vs corner vs Monte Carlo:**
    - **Corners** move global process together (SS/FF/SF/FS).
    - **Global MC** samples die-to-die variation.
    - **Local MC** samples device mismatch (what kills SRAM, sense amps and matched pairs).
    - **High-sigma** methods (importance sampling) estimate 5–6σ tails that brute-force MC can't reach [B p.117] [627 p.73].
- **Worst corners:**
    - **Setup:** slow process, low VDD, and **cold or hot** depending on temperature inversion.
    - **Hold:** fast process, high VDD, with the clock-path vs data-path skew mattering.
    - **Leakage:** **FF, high VDD, high temperature, LVT**, then the **worst input state** (one OFF device per path) [427 p.95].

!!! core "Leakage with minimal compute (the reported NVIDIA question)"
    "Leakage is a **DC** problem, so **one operating point per state per corner**. No transients, which is the biggest saving.
    - **Batch** all states and temperatures of a cell into **one run** (.alter / .data / temperature sweep) and parallelize across cells.
    - Use **structure** to prioritize: single-OFF states dominate, and stacks are 5–10× lower. Characterize unit devices and stacks once to **predict and sanity-check**.
    - Temperature is exponential: verify interpolation from a few points **before** using it.
    - **Let internal nodes settle**; check that stacked states < single-OFF states and that leakage rises with temperature and VDD.
    - **Never silently drop coverage for a release**: every legal state the .lib needs gets a value, and every reduction is validated against full simulation on a sample."

- **"What makes a cell library-friendly?"**
    - Layout: fixed height, rails shared by abutment, well/tap rules, **pin access** on the routing grid, DRC-clean when abutted in any order.
    - Electrical and modeling: predictable timing and power across PVT, complete and smooth .lib tables, robustness to variation.
    - Family: consistent drive strengths and multiple Vt flavors with **the same footprint**.
- **Suspicious tables:** non-monotonic entries, negative delays, rise/fall ratios that flip, corners out of order, a drive strength that isn't between its neighbors, or a sudden jump versus the last release.
- **Automation** [S p.14–17]:
    - **Worst ten cells:** parse every result into one table, sort, print the top 10, and **list files that failed to parse**.
    - **Flag failed runs:** "failed" measurements, missing outputs, non-zero exit codes. Use `pipefail` so `| tee` doesn't hide errors.
    - **Reusable PVT/MC flow:** template netlists plus one config (corners, VDD, temperatures, seeds), a farm launcher, a parser, a summary.
    - **No stale or mislabeled results:** one run ID per job; the corner and model **echoed inside each output** and checked by the parser; inputs hashed; outputs rejected if older than their inputs.
    - **Dashboard checks:** pass/fail counts, worst slack/margin per cell, monotonicity, deltas vs the last release, missing arcs, runtime outliers.
    - **Make:** real file targets (netlist → extracted → SPICE results → report), so only what changed re-runs; `make -j` for parallelism.

### Sheet 7 — EM/IR, aging, DRC/LVS, layout

DIAGRAM:irdrop

- **Static vs dynamic IR:** **static** = average current × grid resistance (a DC offset). **Dynamic** = droop when many cells switch at once (clock edges, a ROM precharge burst); decap reduces it. Effects: **slower cells** (setup failures), lower noise margins, ROM/SRAM **sense margin and Vmin**.
- **EM:** metal atoms drift with electron flow, causing voids (opens) and hillocks (shorts). Risk grows with **current density** (average for DC/power, **RMS** for heating, peak), **temperature** (Black's law: MTTF ∝ J⁻ⁿ·e^(Ea/kT)), narrow wires and **single vias**. The Blech effect protects short segments [B p.112–114].
- **Fix EM in a cell:**
    - Widen the output metal; use **via arrays** (double or more vias).
    - Split the output into **multiple fingers or pins**; move current to a thicker layer.
    - Reduce drive or toggle rate (or a smaller cell); spread current over more rail contacts.
    - **Re-check timing and pin access** after every change.
- **Reduce IR without breaking routability:**
    - Use **thick upper layers** for power, and **fewer, wider straps** aligned to the row pitch.
    - Plenty of vias at rail-to-strap connections.
    - **Decap in whitespace**; spread high-activity cells apart.
    - Backside power at advanced nodes.
    - Keep signal tracks free on the lower layers.
- **BTI aging:** **NBTI** on PMOS under negative gate bias (partial recovery) and PBTI on NMOS (high-k) raise **Vt over time**, so cells slow down. Worst for always-on biased devices; asymmetric aging on sense amps causes **offset drift**. **HCI:** high drain field plus fast switching damages the oxide near the drain. Worst for **high-VDD, fast-edge, high-activity** drivers. Check end-of-life corners [627 p.75].
- **"Works at nominal, fails with droop":**
    1. Is it **timing** (setup at the drooped VDD) or **functional** (Vmin: a latch can't write, keeper vs leakage, sense margin)?
    2. Was the droop modeled realistically (RLC, the switching event)?
    3. Is the failure local (a weak rail or single via in the extraction)?
    4. Fix the cell, or ask for decap or grid changes.
- **DRC vs LVS:** **DRC** checks geometry against manufacturing rules (width, spacing, enclosure, density, antenna). **LVS** checks that the layout's devices and connectivity match the schematic.
- **LVS debug sequence:**
    1. Netlist-prep sanity first (pin names, power pins, bus brackets).
    2. **Compare device and net counts**: fewer nets means a **short**, extra nets means an **open**.
    3. Fix shorts first (they cause cascading errors); check power/ground labels.
    4. Then **parameter mismatches** (W/L, finger count), then missing devices or wrong pins.
    5. Smallest failing block first [S p.13].
- **Opens, shorts and similar:** a missing via or contact (open); overlapping metal or a mislabeled net (short); a well tap or device-recognition layer missing (missing device); a pin on the wrong layer or with the wrong name (pin mismatch); a drawn W/L different from the schematic (parameter mismatch).
- **Why a cell fails only after extraction:**
    - Parasitic **R** (long poly gates, single vias, thin local interconnect).
    - **Coupling C** on dynamic or sensitive nodes.
    - Extra diffusion C; IR on internal rails.
    - Layout-dependent effects (well proximity, diffusion length) shifting Vt.
- **DRC-clean but electrically poor:** single vias, long gate poly, a weak rail, a coupling-sensitive node next to an aggressor, unmatched pairs in different orientations, antenna-prone long gates. **Fix it anyway.** DRC is necessary, not sufficient.
- **Matching:** same orientation, **common centroid / interdigitation**, **dummy devices** at the ends, the same distance from well edges, symmetric routing, and a gate area large enough for Pelgrom σ.

## Part 3 — Project defense sheets

### 3.1 WICS (TSMC 65nm) — your strongest circuit story

| | |
| --- | --- |
| **I owned** | TIA and active-RC filter design and simulation across PVT **[fill in: layout? measured?]** |
| **I did not own** | The full ASIC, the MEMS sensor, the system |
| **Mechanism** | Subthreshold for **max gm/Id ≈ 1/(n·U_T)**; noise vs power; stability (phase margin) with sensor capacitance at the input; RC spread in the filter |
| **One failure and fix** | **[fill in: corner → symptom → change → re-check]** |
| **One number** | **[fill in: power, gain, bandwidth, noise, or phase margin]**. If unsure, say it qualitatively |
| **Link to NVIDIA** | Exponential Vt and temperature sensitivity = **leakage, temperature inversion, low-VDD cell and ROM margins** |
| **Likely follow-ups** | Why subthreshold? · What broke across corners? · How did you check stability? [B p.127] |

### 3.2 Faraday (UMC 22nm, 1.5-month tapeout)

| | |
| --- | --- |
| **I owned** | Chip-top **DFT and STA checks** and handoffs: scan, **MBIST** integration, ATPG/ATE patterns, PrimeTime debug, fix recommendations; check automation **[fill in: which language you actually wrote]** |
| **I did not own** | Physical design, cell design, the timing fixes themselves (PD implemented them) |
| **Mechanism** | Timing report: arrival vs required, setup vs hold, skew, **constraint vs real path**; MBIST fault models (stuck-at, transition, coupling) [B p.87] |
| **Result** | On-time tapeout; top-10% rating |
| **Link** | "Every PrimeTime number came from the **.lib**. I've been the library's customer." |
| **Likely follow-ups** | Read me a timing report · How did you fix a hold violation? · What did your automation check? [B p.128] |

### 3.3 NTT (IBM 130nm, EECS 627) — from the repo (replaces the printed RD.3 on p.128–129)

| | |
| --- | --- |
| **I owned** | **[fill in: blocks you ran]**. The repo has your name on the LUT floorplan script, and the SPI timing file comes from your directory |
| **Team did** | Algorithm and RTL, most blocks, the overall flow template (course TA) |
| **Facts** | 16 butterfly PEs (Barrett modmult); **hierarchical APR** (16 PEs hardened separately; PEs 12, 14, 15 needed extra optimization); 16 × 512×64 dual-port data SRAMs, 48 twiddle macros, 22 FIFO macros (~86 total); 100 MHz core; die 10 × 9 mm; **only a TT corner; no IR/EM analysis** |
| **Failure** | **Top-level DRC/LVS not closed** (power-stripe/antenna issues at integration). **Low-DMA-frequency bug** |
| **Bug, physics first** | Fails only at **lower** frequency → **not setup**; hold doesn't depend on frequency → a **rate/ratio race**. Hypotheses from the code: (1) a **write-back race** (new results stored into the slot still draining to DRAM when the DMA is slow); (2) a fixed **1 µs testbench wait** too short below ~250–300 MHz. Debug: sweep the DMA clock, use handshakes instead of waits, add assertions, diff against the golden model |
| **ROM bridge** | Twiddle factors are a textbook **ROM** case (constant, read in order). SRAM was used only because four moduli load at runtime |
| **Never imply** | Tape-out, signoff, multi-corner, IR/EM analysis, a "microcode ROM", or the NoC being in the chip |

### 3.4 EECS 427 RISC + SRAM PUF (one breath)

> "In 427 we built a 16-bit two-stage RISC in IBM 130nm full custom: I designed and laid out a **TG master–slave flop** and characterized its setup/hold post-extraction. Our team built a **16×16 one-write two-read register file**, a carry-select/bypass ALU and a log shifter, integrated with SRAM and ROM macros and pads. Our custom block was an **SRAM PUF**, which uses each cell's **power-up mismatch** as a fingerprint: the mirror image of bitcell design." **[fill in: your part of the PUF]**. The 8-bit ripple adder was an **EECS 312** project, not 427.

## Part 4 — Every Perplexity question, and where it's answered

**✓** = a full answer exists in your documents; **Here** = added in this playbook; **Gap** = honest-gap language.

| Area | Question (short) | Where |
| --- | --- | --- |
| Background | Most relevant transistor-level circuit, exact contribution | 1.3, 3.1 · [B p.52, 127] |
| | Hard bug, root cause | NTT bug 3.3 · WICS [fill in] |
| | Nodes, PDKs, simulators, tools | **Say:** TSMC 65nm (WICS), UMC 22nm (Faraday), IBM 130nm (427/627); SPICE via ADE (HSPICE/Spectre), Calibre DRC/LVS/PEX, Virtuoso, DC, Innovus, PrimeTime, VCS |
| | Characterization / Liberty | Sheet 6 · [B p.111, 49] · 627 Lab 2 (PrimeTime .lib for a custom macro) |
| | Automation story | 1.3 Faraday · [S p.3–9] |
| CMOS & cells | Balanced inverter sizing; PMOS wider; delay factors; VIL/VIH/VOL/VOH, NM, VM | Sheet 1 · [427 p.18–24] |
| | Stacking; dynamic vs short-circuit vs leakage power; LVT/SVT/HVT | Sheet 1 · [427 p.77–100] |
| | PVT worst corners; input slew; measuring rise/fall/transition; characterizing NAND2/flop | Sheet 6 · [B p.41–46] |
| | Library-friendly cell | Sheet 6 · [B p.101] |
| Sequential | TG latch/flop; latch vs flop; setup/hold causes; reducing clk→Q; overlap; ICG glitch rule; metastability; pulse width / min period; flop styles | Sheet 2 · [427 p.117–131] · [B p.104, 120–121] |
| Memory | How ROM works; ROM vs RF vs SRAM vs logic ROM | Sheet 5 · [B p.24–37, 109] |
| | 6T hold/read/write; read SNM and write margin; sizing; disturb and write failure; precharge; validation | Sheet 4 · [427 p.103–116] · [B p.107] |
| | SA offset, bitline leakage, weak read current; robust ROM vs density | Sheets 4–5 · [B p.72–76] |
| SPICE & variation | Testbench for inverter/NAND/flop/shifter; measurements; timestep/stop/ramp/load/thresholds; convergence | Sheet 6 · [B p.41–45] |
| | Nominal vs corner vs MC; high sigma; worst leakage corner; **minimal-compute leakage**; subthreshold dependencies | Sheet 6 · [B p.59, 117, 122] · [427 p.90–101] · [627 p.92–105] |
| | Robustness under supply noise; design weakness vs testbench vs parasitic vs simulator | Sheets 3, 6, 7 · [B p.45] |
| EM/IR & reliability | Static vs dynamic IR; EM variables; fixing EM; IR vs routability | Sheet 7 · [B p.112–115] · [627 p.38–47, 76] |
| | BTI, HCI; noise types; robust level shifter; fails with droop | Sheets 3, 7 · [627 p.27–37, 75] · [B p.118, 123] |
| DRC/LVS & layout | DRC vs LVS; LVS debug; opens/shorts causes; parasitics; matching; std-cell constraints; fails after extraction; DRC-clean but poor | Sheet 7 · [B p.67, 115] · [427 p.6–17] |
| Scripting | Worst ten cells; parse logs and flag failures; PVT/MC flow; stale results; dashboard; Make dependencies | Sheet 6 · [S p.5–17] |
| Mock round | All 12 mock prompts | Parts 1–3 + Sheets 1–7 |

## Part 5 — The last five minutes (3:55 PM ET)

!!! core "Say these to yourself"
    - **Think out loud.** Estimate before you calculate. Draw before you explain.
    - **Scope precisely:** "I owned X; the team did Y."
    - **If stuck:** "From first principles I'd expect X because Y; I'd verify with Z."
    - **Tie answers back to the library:** "and that's why the .lib / the margin / the corner matters."
    - **Ask one real question at the end**, then thank him by name.

**Within 24 hours:** a short thank-you to **Chanel** (she forwards it), naming one topic from the conversation. Then write down every question you were asked.
