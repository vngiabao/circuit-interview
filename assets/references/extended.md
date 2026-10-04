## Part 0 — Read this first (Friday morning)

This is the **extended version** of the last document (the short version is the 24-page Ultimate Playbook). It is written to be read **tonight, after** the other four: the Bible, the Scripting Companion, and the 427 and 627 lecture packets. It does **not** add new material to memorize. It **compresses** everything into what you say and draw in 45 minutes, and it fills the few gaps found by checking the Perplexity question list against your documents.

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

<div class="co co-guard"><p class="co-t">Interview rule from your email</p>

**No ChatGPT or any outside tool during the interview** (disqualification). Close all AI apps before 4:00 PM.

</div>

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

<div class="co co-guard"><p class="co-t">Never say</p>

"I have a PhD" (say "I started on the PhD track and completed my MS") · "taped out" or "clean signoff" for NTT · "I designed a cell library" or "I designed a ROM."

</div>

### 1.2 "Why NVIDIA, why this role, why ROM?" (45 s)

> "NVIDIA's chips push the hardest on performance and power, and foundation IP **multiplies across every chip**: one better cell or ROM improves every design that uses it. I like work where **correctness is the product**: thousands of engineers trust the library's numbers without re-checking them. And ROM is a small circuit with deep margin problems, one weak cell against a keeper while every other cell on the bitline leaks at a hot, fast corner. That's transistor-level physics I enjoy, and my **analog margin habits transfer directly**."

### 1.3 The three project answers (spec → choices → corners → failure/debug → result → my part)

| Project | Say this (60–90 s) | Your part, said precisely |
| --- | --- | --- |
| **WICS** (TSMC 65nm) | TIA + active-RC filter for an implantable auditory front end. **Subthreshold** for max gm/Id. Challenge: **stability and noise across PVT**, because current is exponential in Vt and temperature. **[fill in: the corner that broke, what you changed, the number]** | "I designed and simulated these blocks" (schematic/layout status: **[fill in]**) |
| **Faraday** (UMC 22nm) | Chip-top **DFT and STA checks**: scan, **MBIST** integration, ATPG/ATE patterns, **PrimeTime** debug with fixes recommended to PD. Automated the check chain. Taped out on a **1.5-month** schedule; top-10% rating | "My lane was DFT/STA checks and handoffs, **not** physical design or cell design" |
| **NTT** (IBM 130nm, 627) | Configurable NTT accelerator: 16 butterfly PEs, ~86 memory macros, async FIFOs, **hierarchical** APR. Blocks clean; **top-level DRC/LVS not closed** by the deadline; a **low-DMA-frequency bug** I've since traced to a likely race | "My part was physical integration: **[fill in: your blocks]**, macro floorplan, power grid, pins, DRC/LVS/antenna fixes" |

<div class="co co-value"><p class="co-t">If you don&#x27;t remember a number</p>

"I don't recall the exact value. Qualitatively it was X, and I'd verify it by Y." Then move on. **An honest gap beats a wrong number.**

</div>

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

<figure class="fig"><img src="assets/fig/diagrams/inverter.svg" alt="CMOS inverter: PMOS pulls up, NMOS pulls down." loading="lazy"><figcaption>CMOS inverter: PMOS pulls up, NMOS pulls down. · Original supplied circuit diagram</figcaption></figure>

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

<div class="co co-eq"><p class="co-t">Logical effort in one line</p>

**d = g·h + p**; NAND g = (n+2)/3, NOR g = (2n+1)/3; best ≈ 4 per stage; FO4 = 5τ ≈ L/3 ps [427 p.29–31].

</div>

**Debug scenario:** *"Rise is 2× slower than fall."* Check the P/N ratio for the actual corner (SF?), the input slew, the PMOS stack depth, and whether it's the **worst** input (NOR rise) or a measurement-threshold mistake.

### Sheet 2 — Latches, flip-flops, setup/hold, ICG, metastability

<figure class="fig"><img src="assets/fig/diagrams/dff.svg" alt="Positive-edge master–slave D flip-flop built from two TG latches." loading="lazy"><figcaption>Positive-edge master–slave D flip-flop built from two TG latches. · Original supplied circuit diagram</figcaption></figure>

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

<figure class="fig"><img src="assets/fig/diagrams/levelshifter.svg" alt="Low-to-high level shifter: cross-coupled PMOS on VDDH, NMOS driven from VDDL." loading="lazy"><figcaption>Low-to-high level shifter: cross-coupled PMOS on VDDH, NMOS driven from VDDL. · Original supplied circuit diagram</figcaption></figure>

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

<figure class="fig"><img src="assets/fig/diagrams/sram.svg" alt="6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG)." loading="lazy"><figcaption>6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG). · Original supplied circuit diagram</figcaption></figure>

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

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

rom: the original referenced asset was not included in the supplied source bundle. 

</div>

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

<figure class="fig"><img src="assets/fig/diagrams/testbench.svg" alt="Anatomy of a realistic SPICE testbench: real driver, real load, real supply, measurements that match the library." loading="lazy"><figcaption>Anatomy of a realistic SPICE testbench: real driver, real load, real supply, measurements that match the library. · Original supplied circuit diagram</figcaption></figure>

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

<div class="co co-core"><p class="co-t">Leakage with minimal compute (the reported NVIDIA question)</p>

"Leakage is a **DC** problem, so **one operating point per state per corner**. No transients, which is the biggest saving.
- **Batch** all states and temperatures of a cell into **one run** (.alter / .data / temperature sweep) and parallelize across cells.
- Use **structure** to prioritize: single-OFF states dominate, and stacks are 5–10× lower. Characterize unit devices and stacks once to **predict and sanity-check**.
- Temperature is exponential: verify interpolation from a few points **before** using it.
- **Let internal nodes settle**; check that stacked states < single-OFF states and that leakage rises with temperature and VDD.
- **Never silently drop coverage for a release**: every legal state the .lib needs gets a value, and every reduction is validated against full simulation on a sample."

</div>

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

<figure class="fig"><img src="assets/fig/diagrams/irdrop.svg" alt="Static vs dynamic IR drop on a cell&#x27;s supply." loading="lazy"><figcaption>Static vs dynamic IR drop on a cell&#x27;s supply. · Original supplied circuit diagram</figcaption></figure>

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

## Part 6 — Full answers to every Perplexity question

Each answer is what you'd **say**: two to six lines, the key point first. References point to the deeper version. Answers about your own projects use only verified facts; fill every [fill in] or drop it.

### 6.1 Background and projects

1. **Most relevant transistor-level circuit you designed, and your exact contribution?**
   The WICS TIA and active-RC filter in TSMC 65nm. I designed and simulated them in subthreshold for maximum gm/Id, and validated stability and noise across PVT. [fill in: layout or measurement status, and one number.] For the cell side, add the 427 TG flip-flop: I designed it, laid it out, and characterized setup/hold post-extraction at 5% clk→Q pushout.
2. **A difficult bug, and how you found the root cause?**
   The NTT low-DMA-frequency failure. Physics first: a failure only at **lower** frequency can't be setup, and hold doesn't depend on frequency, so it had to be a rate or clock-ratio assumption. Reviewing the code, the leading hypothesis is a write-back race when the DMA is slower than the core. The experiment to confirm it: sweep the DMA clock with the core fixed, replace fixed waits with handshakes, add assertions, diff against the golden model. (A WICS corner failure also works if you have its details.)
3. **Nodes, PDKs, simulators, extraction, layout and verification tools?**
    - TSMC 65nm (WICS), UMC 22nm (Faraday, flow side), IBM 130nm cmrf8sf (427/627).
    - SPICE via Virtuoso ADE (HSPICE/Spectre); Calibre DRC, LVS and PEX/xRC with RVE.
    - Design Compiler, Innovus, PrimeTime; VCS/NC-Verilog with SDF.
    - **Say "used" vs "owned" precisely.**
4. **Standard-cell characterization: which Liberty quantities did you generate or consume?**
    - **Consumed:** at Faraday, PrimeTime read NLDM delay and slew tables, constraints and pin caps.
    - **Generated:** in 627 Lab 2, a .lib for a custom macro with PrimeTime; in 427, flop setup/hold/clk→Q by SPICE sweeps.
    - I know the full set: delay and transition tables vs slew×load, setup/hold/recovery/removal, min pulse width, pin cap, internal power, per-state leakage, and CCS/LVF.
    - I haven't run a production Liberate flow.
5. **A time you automated an analysis or verification task?**
    - **Faraday:** automated the chip-top check chain [fill in: language, what it checked]. Needed because many checks repeated on every netlist drop.
    - **NTT:** Make pattern rules ran 16 per-PE synthesis/APR jobs in parallel, with Tcl procedures for pins, blockages and antenna diodes.
    - **Validation:** compare against known-good runs and flag anything that didn't parse.
6. **Limited industry experience: what best shows device-level design and verification?**
    - WICS: transistor-level design across PVT.
    - 427: full-custom flop, register file and ALU, with DRC/LVS/PEX and post-layout SPICE.
    - 627: deep-submicron topics plus DRC/LVS and flow.
    - Faraday: the library-consumer view on a real 22nm tapeout.

### 6.2 CMOS and standard cells

7. **Size an inverter for balanced rise and fall?** Make pull-up and pull-down strengths equal: Wp/Wn ≈ µn/µp. That's about 2:1 in planar and closer to 1:1 in FinFET. In practice the minimum-average-delay ratio is a bit below the equal-edge ratio.
8. **Why is PMOS wider?** Holes have lower mobility than electrons, so a PMOS needs more width for the same current.
9. **What sets inverter delay?** tp ≈ 0.69·R_eq·C, and R_eq ∝ VDD/I_dsat.
    - **R:** device width/strength.
    - **C:** load + wire + self-loading.
    - **Input slew:** slower input → longer delay plus short-circuit current.
    - **VDD:** delay ∝ VDD/(VDD−Vt)^α.
    - **Temperature:** slower when hot at high VDD (mobility), faster when hot at low VDD (Vt drops: temperature inversion).
    - **Process:** SS vs FF.
10. **VIL, VIH, VOL, VOH, noise margins, switching threshold?** VOH/VOL are the output levels. VIL/VIH are the input voltages where the VTC slope is −1. NMH = VOH − VIH, NML = VIL − VOL. VM is where Vin = Vout, set by the P/N strength ratio.
11. **Stacking: leakage, speed, area?**
    - **Leakage:** drops ~5–10× for 2 OFF devices. The middle node rises, giving negative Vgs, lower Vds (less DIBL) and body effect.
    - **Speed:** worse (series resistance), so devices are made wider: more area and input cap.
12. **Dynamic vs short-circuit vs leakage power?**
    - **Dynamic** = αCV²f. Reduce α (clock gating), C (sizing, wire), V (multi-VDD, DVFS).
    - **Short-circuit:** both networks briefly on during slow input edges. Keep slews sharp and balanced.
    - **Leakage:** subthreshold, gate and junction. Reduce with HVT, stacks, longer L, power gating, body bias.
13. **LVT, SVT, HVT?** Same footprint, different Vt.
    - LVT: fast but leaky (about 10× per 100 mV lower Vt). Use on critical paths.
    - HVT: slow, low leakage. Use on non-critical, always-on and retention cells.
    - SVT: the default.
    - Same footprint lets you swap Vt late for timing or leakage.
14. **PVT corners: worst for setup, hold and leakage?**
    - **Setup:** slow process, low VDD; cold or hot depending on temperature inversion.
    - **Hold:** fast process, high VDD. Watch clock-vs-data skew; hold can also fail at SS when skew dominates.
    - **Leakage:** FF, high VDD, high temperature, LVT, plus the worst input state.
15. **Input slew: why it matters?** It changes the cell's own delay and output slew, and adds short-circuit power. A slow output slew then slows every downstream cell. That's why .lib tables are indexed by input slew, and why max-transition rules exist.
16. **Measure cell rise, fall and transitions in SPICE?** Use .meas:
    - **Delay:** input 50% → output 50% (rise and fall arcs separately).
    - **Transition:** output 20→80% or 10→90%, per the library.
    - Use a realistic input (a driver cell or library-slew PWL) and the table load.
17. **Characterize a NAND2 or flip-flop across slew/load tables?**
    - **NAND2:** for each arc (A→Y with B = 1, B→Y with A = 1), sweep the index grid of input slew × load at every PVT corner. Record delay, transition and energy; also pin caps and per-state leakage.
    - **Flop:** clk→Q tables vs clock slew × load. Setup/hold by bisection on the data-to-clock offset at 5–10% clk→Q pushout, across data and clock slews. Min pulse width; recovery/removal for async pins.
    - **Then QA** the tables (Sheet 6).
18. **What makes a cell library-friendly?**
    - **Layout:** fixed height, rails by abutment, well/tap compatibility, on-grid accessible pins, DRC-clean abutment in any order, filler compatibility.
    - **Electrical:** predictable, complete .lib arcs; internal power and leakage; robustness across PVT and variation.
    - **Family:** consistent drive strengths and Vt flavors with the same footprint.

### 6.3 Sequential cells

19. **TG latch/flop?**
    - **Latch:** an input TG (transparent on one clock phase) into an inverter, with a feedback inverter through a TG on the opposite phase.
    - **Flop:** master (transparent CLK low) + slave (transparent CLK high), with local CLK/CLKB buffers inside the cell.
20. **Latch vs flip-flop?** A latch is level-sensitive: transparent for a phase. A flop is edge-triggered: captures at the edge, built as two latches on opposite phases.
21. **What causes setup and hold violations at the cell level?**
    - **Setup:** the data hasn't propagated through the master's input path and established its feedback before the master closes.
    - **Hold:** the master's input TG closes slightly after the edge (internal clock delay, CLK/CLKB skew), so early new data leaks in.
    - At chip level both come from path delay vs clock skew.
22. **Reduce clk→Q without breaking everything?** Each option, with its cost:
    - Stronger slave/output driver → more clock load and power.
    - LVT on the clk→Q path → leakage.
    - A pulsed latch (fewer stages) → larger hold.
    - Smaller internal nodes → noise sensitivity.
    - Re-check setup, hold, power, leakage and robustness after every change.
23. **Why is clock overlap dangerous?** If CLK and CLKB are both partly on, master and slave are transparent at once, so data races through two stages in one cycle (a hold failure inside the cell).
24. **Design or validate a clock-gating cell?**
    - **Design:** a latch (transparent while CLK low) + AND. EN must be stable while CLK is high, so the gated clock can't glitch.
    - **Validate:** EN setup/hold to the rising edge, a glitch check across EN timing sweeps, CLK→GCLK delay and slew, both polarities, all corners.
25. **Metastability: can characterization eliminate it?** No. A latch that samples during its aperture resolves with time constant τ, and failure probability falls as e^(−t/τ). Characterization gives τ and the aperture for MTBF math; synchronizers (two or more flops) buy resolution time.
26. **Where do pulse-width and minimum-period checks come from?** Internal nodes and feedback loops need time to settle and regenerate. A clock pulse that's too short won't complete a write; a period that's too short won't let the master capture and the slave propagate. The .lib carries min_pulse_width and minimum-period constraints.
27. **Static vs TG vs pulse-triggered flops?**
    - **TG master–slave:** robust, moderate clk→Q, high clock load.
    - **Static logic-gate flops:** robust, slower, larger.
    - **Pulse-triggered** (HLFF, pulsed latch): small clk→Q and soft edges for time borrowing, but large hold time and pulse-generation variability.

### 6.4 ROM, SRAM and memory

28. **How does a custom ROM work, physically and logically?** A NOR ROM column:
    - **Logic:** precharge the bitline high, fire one wordline. If that cell's transistor (or via) is present, the bitline discharges; otherwise the keeper holds it high. The sense amp or inverter reads it at the timed SAE.
    - **Physically:** code set by a via/contact (late mask) or implant (dense, early mask).
29. **Mask ROM vs register file vs SRAM vs standard-cell logic ROM?**
    - **Mask ROM:** densest, lowest power, unchangeable; verification is code-pattern dependent.
    - **Register file:** small, multi-port, fast, changeable.
    - **SRAM:** dense-ish, changeable, needs loading, leaks; verification needs bitcell high-sigma.
    - **Logic ROM:** synthesized constants; only sensible for tiny tables; just STA.
30. **6T hold, read, write?**
    - **Hold:** WL low, the cross-coupled pair keeps state.
    - **Read:** precharge both bitlines, raise WL, the 0-side bitline discharges through access + pull-down, the SA senses.
    - **Write:** drive one bitline low and raise WL; the access device overpowers the pull-up and the cell flips.
31. **Read SNM and write margin: how to measure?**
    - **Read SNM:** the largest square in the butterfly curve with WL on (DC sweeps of each half-cell).
    - **Write margin:** sweep WL voltage (or the bitline voltage) until the cell flips. The margin is the distance from that point to the operating value; N-curves are an alternative.
32. **Why size pull-down, access and pull-up differently?**
    - Read stability needs pull-down > access (cell ratio), so the read bump stays below the trip point.
    - Writability needs access > pull-up (pull-up ratio).
    - Hence strong / medium / weak.
33. **What causes read disturb or write failure?**
    - **Read disturb:** low cell ratio, mismatch, high WL, low VDD.
    - **Write failure:** high pull-up ratio, weak access device, low WL or slow corner, mismatch.
    - Assists help: WL underdrive or cell-VDD boost for read; negative bitline or VDD collapse for write.
34. **Validate a ROM or SRAM across PVT and mismatch?**
    - Corners × VDD × temperature on extracted netlists, with worst code/data patterns.
    - Local Monte Carlo for SA offset and cells; high-sigma for bitcell failure rates at the array size.
    - Timing with replica tracking; EM/IR on precharge; aging end-of-life.
35. **Bitline precharge: what and why?** Bitlines start at a known high, so reading needs only a small, fast discharge that a sense amp detects. Without precharge, the bitline's prior state would corrupt the read.
36. **Sense-amp offset, bitline leakage, weak read current?**
    - **Offset:** larger matched devices with common-centroid layout, budgeted at the required sigma; delay SAE accordingly.
    - **Leakage:** fewer cells per bitline (hierarchy), HVT or longer-L cells, a keeper sized between I_on and n·I_off.
    - **Weak read current:** shorter bitlines, longer sense time via replica timing, WL boost.
37. **Make a ROM robust while meeting density and performance?**
    - Keep the bitcell minimum and spend margin in the periphery: hierarchical bitlines, replica self-timing, keeper sizing.
    - **Data encoding** (invert leaky columns); SA offset cancellation or sizing.
    - Verify at the worst code pattern and corner with statistics.

### 6.5 SPICE and variation

38. **Testbench for an inverter, NAND, flop or level shifter?**
    - **Common setup:** driver cell or PWL at library slews; table loads; supply as a source (add an RLC for droop studies); correct corner model; .ic/.nodeset for bistable nodes; settle before measuring.
    - **Flops:** a data sweep vs clock.
    - **Level shifters:** sweep VDDL/VDDH combinations and include Monte Carlo.
39. **Which measurements in a characterization testbench?** Delay and transition per arc; switching/internal energy; input pin cap; per-state leakage; and for sequential cells setup/hold/clk→Q/min pulse width/recovery/removal.
40. **Timestep, stop time, input ramp, load, thresholds?**
    - **Timestep:** resolves the fastest edge; tighten until results stop moving.
    - **Stop time:** all events plus settling.
    - **Ramp:** library slews.
    - **Load:** table points.
    - **Thresholds:** exactly those in the .lib header.
41. **Non-convergence: causes and debug?** Floating nodes, ideal steps or zero-R loops, uninitialized latches, extreme device ratios, too-tight tolerances. Simplify the testbench, add finite edges, .nodeset the bistable nodes, check connectivity, and only then relax options.
42. **Nominal vs corner vs Monte Carlo mismatch vs global variation?**
    - **Nominal:** typical.
    - **Corners:** the whole die's process shifted together (SS/FF/SF/FS).
    - **Global MC:** samples die-to-die variation.
    - **Local MC:** samples device-to-device mismatch, which kills matched pairs, SRAM and sense amps.
    - **Rule:** global adds linearly, local adds in root-sum-square.
43. **High-sigma analysis: what and why?** Estimating failure probabilities at 5–6σ, needed when a chip has millions of cells (1 Mb at 99.9% yield ≈ 6σ per cell). Brute-force MC can't reach that, so use importance sampling or statistical blockade.
44. **Find the worst-case leakage corner for a library?** Start from physics: FF, high VDD, high temperature, LVT. Then confirm per cell: some cells peak at different states, and GIDL or gate leakage can matter at certain biases. Simulate the corner set and take the max per cell and state.
45. **Characterize leakage with minimal compute?** See Sheet 6. In one breath: DC only, batch states and temperatures per run, parallelize, use structure to prioritize and sanity-check, verify any interpolation, never drop release coverage.
46. **Temperature, VDD, Vt and dimensions vs subthreshold leakage?**
    - Exponential in −Vt/(n·kT/q).
    - **Temperature:** Vt drops and kT/q rises, so leakage climbs fast.
    - **VDD:** DIBL lowers Vt at higher Vds.
    - **Vt:** about 10× per 100 mV.
    - **Dimensions:** ∝ W; shorter L means more short-channel effect and DIBL.
47. **Noise margin or robustness under supply noise?** Inject realistic droop/ripple (an RLC supply model or PWL on VDD) during switching. Measure functional Vmin and timing at the drooped voltage, and use noise-immunity (amplitude × width) curves for dynamic nodes.
48. **True design weakness, testbench error, parasitic problem, or simulator setting?**
    - **Testbench:** sanity-check the setup (slews, loads, initial conditions, thresholds, corner).
    - **Simulator:** tighten the timestep; does the result move?
    - **Parasitics:** compare schematic vs extracted.
    - **Design:** perturb the suspected mechanism with one targeted change (e.g., keeper size). If the margin moves as physics predicts, it's real.
    - Write the evidence in five lines.

### 6.6 EM, IR, reliability and noise

49. **Static vs dynamic IR, and the effect on a cell or ROM?**
    - **Static:** average current × grid resistance.
    - **Dynamic:** droop at switching events such as clock edges or ROM precharge bursts.
    - **Effects:** slower cells, less noise margin, lower sense margin, higher Vmin.
50. **What is EM, and what drives it?** Momentum transfer from electrons drifts metal atoms, causing voids and hillocks. Drivers: current density (average for unidirectional, RMS for heating, peak), temperature (Black's law), width and thickness, via count, length (the Blech effect protects short segments), and material.
51. **Fix an EM violation in a cell layout?** Widen the metal, add via arrays, split the output into fingers or multiple pins, move current to thicker layers, reduce drive or toggle rate. Then re-check timing and pin access.
52. **Reduce IR without breaking routability?** Fewer, wider straps on thick upper layers aligned to rows; more vias at rail-to-strap connections; decap in whitespace; spread high-activity cells; backside power at advanced nodes; keep low layers free for signals.
53. **What is BTI aging?** Under gate bias at temperature, interface and oxide traps raise |Vt| over time (NBTI on PMOS, PBTI on NMOS with high-k), partly recovering when stress is removed. Effect: slower cells, and offset drift in asymmetrically stressed sense amps. Analyze with end-of-life models.
54. **Hot-carrier injection: what and when?** High-energy carriers near the drain at high VDD and fast edges damage the oxide, raising Vt and lowering current. A concern for high-activity, strong drivers, clock buffers and I/O.
55. **Noise types in deep submicron?**
    - **Crosstalk:** coupling; delay changes with a Miller factor of 0/1/2, plus glitches.
    - **Supply noise:** IR + L·di/dt.
    - **Jitter:** eats the timing budget.
    - **SER:** particle strikes.
    - **Thermal/flicker noise:** matters for sense amps, analog and low-swing circuits.
    - Dynamic nodes and sense amps are the most vulnerable.
56. **Robust level shifter across domains?**
    - **Topology:** DCVS with a strong NMOS and weak (or current-limited) PMOS, or a wide-range variant.
    - **Verify:** every VDDL/VDDH pair, all corners and temperatures (worst NMOS-weak case: FS, cold, at minimum VDDL), Monte Carlo; check delay, duty cycle and static current.
    - Add isolation if a domain can shut off.
57. **Works at nominal but fails with droop: first checks?**
    1. Timing or function?
    2. Is the droop model realistic?
    3. Is the failure local (rail or via resistance in the extraction)?
    4. Which node fails: a keeper or sense margin, or a latch write at low VDD?
    5. Then decide on a cell fix or a decap/grid request.

### 6.7 DRC/LVS and layout

58. **DRC vs LVS?** DRC: geometry vs manufacturing rules (width, spacing, enclosure, density, antenna). LVS: the layout's extracted devices and nets match the schematic (devices, connectivity, parameters, pins).
59. **LVS debug sequence?**
    1. Check netlist prep (pin names, power ports, bus brackets).
    2. Compare device and net counts.
    3. Fix shorts first (fewer nets), then opens (extra nets).
    4. Then parameter mismatches, then pins.
    5. Smallest failing block first; cross-probe in RVE.
60. **What creates opens, shorts, missing devices, wrong pins, parameter mismatches?**
    - **Opens:** missing vias or contacts, broken wires.
    - **Shorts:** overlapping metal, a mislabeled net, a power label on a signal.
    - **Missing devices:** a recognition, implant or well layer missing.
    - **Wrong pins:** wrong layer or name.
    - **Parameter mismatches:** drawn W/L or finger count differs from the schematic.
61. **How do parasitic R and C affect timing and power after extraction?** Extra C slows edges and raises dynamic power. Extra R (poly, vias, local interconnect) adds delay and IR. Coupling C adds noise and delay variation. Post-layout is usually slower than schematic.
62. **Layout techniques for matching?** Same orientation, common-centroid/interdigitation, dummy devices, equal distance from well edges and diffusion breaks, symmetric routing, and adequate gate area (Pelgrom σ ∝ 1/√(WL)).
63. **Common standard-cell layout constraints?** Fixed height in tracks; VDD/VSS rails at top and bottom, shared by abutment; continuous wells; diffusion sharing (Euler paths); routing tracks and pin access on grid; filler and tap compatibility; no DRC violations at any abutment.
64. **Why might a schematic-correct cell fail only after extraction?** Parasitic R on gates, vias or local interconnect; coupling onto dynamic or sensitive nodes; extra diffusion C; IR on internal rails; layout-dependent effects shifting Vt.
65. **A DRC-clean but electrically poor layout?** Fix it anyway: double the vias, shorten gate poly, strengthen rails, shield or space sensitive nodes, match orientations, reduce antenna exposure. DRC is necessary, not sufficient.

### 6.8 Scripting and problem solving

66. **Script to find the worst ten cells by leakage, delay, slew or margin?** Parse every result into one table (cell, arc, corner, value), sort, print the top 10, and print any file that failed to parse or had "failed" measurements [S p.15].
67. **Parse a SPICE log and flag failures?** Match the measurement lines with a regex; treat "failed", missing values and non-zero exit codes as errors; check the corner and model names echoed in the output against what was requested.
68. **Reusable PVT and Monte Carlo flow?** One config (cells, corners, VDD, temperatures, seeds), template netlists, a launcher with a run ID per job, a parser, a summary table and a regression diff vs the last release.
69. **Keep stale, failed or mislabeled results out?**
    - Run IDs; outputs newer than their inputs; corner and model echoed inside each output and verified.
    - Input hashes; fail loudly on missing results.
    - `pipefail` so piping through tee doesn't hide tool errors.
70. **Checks for an automated cell-quality dashboard?** Pass/fail counts, worst slack/margin per cell, monotonicity, missing arcs, corner ordering, drive-strength consistency, deltas vs the last release, leakage sanity, runtime outliers.
71. **Use Make to manage netlist → extraction → SPICE → report?** Make each stage's output a real file target that depends on its inputs, so only what changed re-runs. Pattern rules handle per-cell/per-corner jobs, `-j` runs them in parallel, and a final report target depends on all results.


## Part 7 — Key cards from every document

Every **Core idea**, **Equation card** and **Guardrail / Common trap** box from your four documents, in document order. Use this tonight as the final pass: if a card doesn't ring a bell, go back to that section.

### Bible: Part R — Read this first

<div class="co co-core"><p class="co-t">R.1 The interview, confirmed · The one-line shift</p>

TSMC asked "will he stay and own a fab loop?" NVIDIA asks "**can he reason at the transistor level, check his own work, and be honest about what he knows?**" Most of the 45 minutes is technical. Your résumé is the map Bo will use to decide where to push.

</div>

<div class="co co-core"><p class="co-t">R.3 What the forums actually report (evidence, not rumor) · What this means for Friday</p>

**Expect: résumé project → fundamentals (hold time, sizing, latch/flop, stick diagram) → one practical "how would you do this task" problem.** Be ready to skip the intro entirely. The July 2026 leakage-characterization task is the closest thing to a real sample question; it's fully answered in Q10.

</div>


### Bible: Part P — Bo Li: how to enter, what to show, what to ask

<div class="co co-guard"><p class="co-t">P.4 Questions to ask him (pick two, based on the conversation) · Don&#x27;t ask</p>

Confidential node or model details, compensation, or "how did I do?" Leave logistics (start date, relocation) for Chanel.

</div>

<div class="co co-guard"><p class="co-t">P.4b Questions only Bo (or the team) can answer · Stay on the right side</p>

Frame anything about nodes, products or roadmap as "**at a level you can share**". Don't ask about unreleased products, compensation, or "how did I do?". If he says "I can't talk about that", smile and move on: "Totally fair."

</div>


### Bible: Part N — NVIDIA: what to know about the company

<div class="co co-core"><p class="co-t">N.2 The five values, and how to show each · Core memory</p>

**At NVIDIA, "intellectual honesty" is a named value. Precise scope is a strength, not a weakness.**

</div>


### Bible: Part ROLE — What the job actually is

<div class="co co-core"><p class="co-t">ROLE.3 The design flow: request to released IP · Core memory</p>

**Spec → circuit → sim → layout → DRC/LVS/PEX → post-layout sim → reliability → characterize → QA → support. Every change loops back.**

</div>

<div class="co co-core"><p class="co-t">ROLE.4 The life of a new IP cell: the complete cycle · Core memory</p>

**Spec → baseline → topology → pre-layout (with margin) → layout → DRC/LVS in context → post-layout → reliability → characterize → QA → trial integration → release → silicon correlation. Every gate has a known "go back to."**

</div>

<div class="co co-core"><p class="co-t">ROLE.6 Questions you&#x27;ll face on the job (and in &#x27;how would you…&#x27; inter · Core memory</p>

**Every day-to-day question follows one pattern: reproduce under identical conditions → find the physical cause → change one thing → recheck everything the change touches.**

</div>

<div class="co co-guard"><p class="co-t">ROLE.9 Across a year: what you receive, what you ship, and who it&#x27;s fo · Where this comes from</p>

I have **no inside information** about NVIDIA. This is built from the JD, public NVIDIA facts, and how foundation-IP teams at large chip companies usually run. **Confirm it with Bo**: "how is your time split right now?" is itself one of the best questions you can ask (P.4b).

</div>

<div class="co co-core"><p class="co-t">ROLE.9 Across a year: what you receive, what you ship, and who it&#x27;s fo · Core memory</p>

**Inputs:** PDK + library spec (new node), or a request + code file (per chip), or a bug report. **Outputs:** not a chip, but **released, verified IP views** (GDS, LEF, .lib, Verilog, netlist, datasheet) that chip teams drop into their designs. **You see "your" silicon months later.**

</div>


### Bible: Part ROM — The ROM team inside NVIDIA

<div class="co co-core"><p class="co-t">ROM.1 What ROM is for on a GPU or SoC · Core memory</p>

**ROM = fixed data the chip needs every time: boot and security code, microcode, constant tables. Densest and lowest power, and it can't be changed by software.**

</div>

<div class="co co-core"><p class="co-t">ROM.3 The ROM workflow, request to silicon · Core memory</p>

**Spec + code in → compiler generates the macro → verify content, then electrical margin at worst pattern/PVT/sigma → DRC/LVS/EM → views to PD/STA/DFT → late code change via one mask → silicon readback.**

</div>

<div class="co co-core"><p class="co-t">ROM.5 &#x27;Deep submicron&#x27;: what it is and why ROM gets harder · Core memory</p>

**Deep submicron = FinFET/GAA nodes. For ROM: more leakage vs on-current, lower VDD, more variation, 1-fin cells, higher contact/wire resistance → fewer rows per bitline, tighter sense margin, high-sigma verification.**

</div>

<div class="co co-core"><p class="co-t">ROM.7 ROM vs the alternatives · Core memory</p>

**ROM wins on density, power and security; loses on flexibility. Common pattern: ROM for the fixed core (boot, tables), OTP/eFuse for small per-chip data and patches, SRAM + flash for anything that must change.**

</div>

<div class="co co-core"><p class="co-t">Gen 8 — What&#x27;s next: GAA, backside power, CFET, and alternatives · Core memory</p>

**Diode matrix (passive, slow) → NOR (fast, 1T/bit, the embedded standard) → NAND (densest, slow) → dynamic self-timed compiled ROMs (precharge, keeper, sense, replica, via-programming) → low-power tricks (selective precharge, data inversion, hierarchy) → MLC/diode density experiments → FinFET (1-fin cell, fix margins with architecture) → GAA/backside power next.**

</div>

<div class="co co-guard"><p class="co-t">ROM.9 The rest of the memory family: DRAM, flash, and new memories T3  · One word to avoid</p>

"Flash RAM" is loose usage: **flash is non-volatile storage, not RAM** (RAM = random-access, volatile, read/write: SRAM, DRAM). Say "flash" or "NOR/NAND flash".

</div>

<div class="co co-core"><p class="co-t">ROM.9 The rest of the memory family: DRAM, flash, and new memories T3  · Core memory</p>

**ROM = never changes. SRAM = fastest working memory. DRAM = big working memory (needs refresh). Flash = keeps data with power off (NOR for code, NAND for storage). OTP = a few permanent bits per chip. MRAM/RRAM = the new embedded non-volatile option.** On an advanced GPU die you get **SRAM + ROM + OTP**; DRAM and flash live off the die.

</div>

<div class="co co-eq"><p class="co-t">DRAM in five lines · DRAM signal: charge sharing</p>

**ΔV = (VDD/2) · Cs / (Cs + C_BL).** Illustrative numbers: Cs = 10 fF, C_BL = 80 fF, VDD/2 = 0.55 V → ΔV ≈ **61 mV**. **Memory trick:** "a thimble poured into a bucket": a small cell into a big bitline gives a small signal, so the sense amp does the real work. Compare with ROM: **ΔV = I_cell · t / C_BL** (a tap filling the bucket over time).

</div>


### Bible: Part NODE — Your process node & your transition

<div class="co co-guard"><p class="co-t">NODE.1 What node will you work on? · Guardrail</p>

Never say "I'll be working on 3nm." Ask: "At a level you can share, is the work mostly established FinFET libraries or newer device platforms? More new-node bring-up or improving existing libraries?"

</div>


### Bible: Part SKILL — The skills that make someone excel in this job

<div class="co co-core"><p class="co-t">The one-line answer</p>

**SPICE craft plus circuit intuition is #1**: set up the *right* simulation, predict the answer before you run it, and know when a number is lying. **Variation/margin thinking** and a **verification mindset** come next. **Scripting is a multiplier**: it turns one good simulation into 10,000 good simulations, but it can't fix a bad testbench.

</div>

<div class="co co-guard"><p class="co-t">2b. Measurements that match the library · Measurement traps</p>

- **Wrong edge:** `RISE=1` vs `RISE=2` if the first edge is the reset glitch.
- **Sign of current:** SPICE usually reports current *into* the source's + terminal; supply current often comes out **negative**. Know your convention before reporting "negative power".
- **Window:** leakage measured before the circuit settles = a transient, not leakage.
- **Failed measure:** a `.meas` that never triggers prints "failed", and a script that doesn't check for it silently drops that corner.

</div>

<div class="co co-eq"><p class="co-t">2e. Convergence and accuracy vs runtime · The accuracy rule</p>

**A number isn't real until it stops changing** when you tighten the timestep or tolerance. Do this check once per new testbench, then fix the settings.

</div>

<div class="co co-guard"><p class="co-t">2h. Reading results like an expert (the sanity checklist) · Top 10 SPICE mistakes (each one has caused a respin somewhere)</p>

1 Ideal input step · 2 No load · 3 Ideal supply for a peak-current question · 4 Bistable node not initialized · 5 Measured before settling · 6 Thresholds don't match the .lib · 7 A failed `.meas` silently dropped · 8 Wrong model corner or missing mismatch flag · 9 Timestep too coarse to resolve the edge · 10 Pre-layout numbers used for sign-off.

</div>

<div class="co co-eq"><p class="co-t">SKILL.4 Variation &amp; margin thinking · The margin budget (write it on the whiteboard)</p>

**ΔV_available ≥ V_offset(6σ) + V_noise + V_aging + guard-band.** If it doesn't close: longer SAE delay, shorter bitlines (hierarchy), stronger cell, or a better sense amp.

</div>

<div class="co co-guard"><p class="co-t">SKILL.11 How to show these skills in 45 minutes · Don&#x27;t overclaim</p>

Say what you **did** and what you **know**, and say "I haven't done X in production, but here's how I'd approach it" for the rest. That sentence, followed by a correct approach, scores higher than a bluff.

</div>


### Bible: Part Q — First-round rehearsal: the 21 most likely questions, answered

<div class="co co-core"><p class="co-t">Q1. &#x27;Tell me about yourself.&#x27; RÉSUMÉ · Core memory</p>

**Device physics → circuit design (WICS) → library user (Faraday) → this role builds the library.**

</div>

<div class="co co-core"><p class="co-t">Q2. &#x27;Walk me through your most relevant project.&#x27; (WICS) RÉSUMÉ · Core memory</p>

**Objective → my blocks → one decision → how I checked it → result.** Subthreshold = max gm/Id, but exponential sensitivity to Vt and temperature.

</div>

<div class="co co-eq"><p class="co-t">Q4. &#x27;What is hold time?&#x27; (reported Jun 2025) T1 · Hold and setup slack (S = capture clock arrival − launch clock arrival)</p>

```latex
\text{Setup slack} = T + S - t_{cq,max} - t_{pd,max} - t_{setup}
\qquad
\text{Hold slack} = t_{cq,min} + t_{cd,min} - S - t_{hold}
```
**Remember:** setup races the **next** edge (T is in it); hold protects the **same** edge (no T). **Later capture clock (S > 0) helps setup, hurts hold.**

</div>

<div class="co co-core"><p class="co-t">Q4. &#x27;What is hold time?&#x27; (reported Jun 2025) T1 · Core memory</p>

**Setup = old data arrives in time. Hold = new data stays away long enough. Period only helps setup.**

</div>

<div class="co co-core"><p class="co-t">Q5. &#x27;Size CMOS gates at 2:1 and 1:1.&#x27; (reported) T1 · Core memory</p>

**Series → multiply width by the stack count. Parallel → size for one. 2:1 means PMOS doubles.**

</div>

<div class="co co-core"><p class="co-t">Q6. &#x27;Draw the stick diagram of a NAND2.&#x27; (reported) T1 · Core memory</p>

**Rails outside, diffusion inside, one poly per input, Euler path for unbroken diffusion, output metal from p to n.**

</div>

<div class="co co-core"><p class="co-t">Q7. &#x27;Draw a transistor-level latch and a D flip-flop.&#x27; (reported) T1 · Core memory</p>

**Latch = TG in + two inverters + TG feedback. DFF = master (open on CLK low) + slave (open on CLK high). Captures at the rising edge.**

</div>

<div class="co co-core"><p class="co-t">Q8. &#x27;Why is PMOS slower than NMOS?&#x27; T1 · Core memory</p>

**Hole mobility ≈ ½ electron → PMOS ≈ 2× wider for equal drive (planar). FinFET strain narrows the gap.**

</div>

<div class="co co-core"><p class="co-t">Q9. &#x27;How would you reduce power? Timing and power optimization for low · Core memory</p>

**Dynamic = αCV²f. Leakage is exponential in Vt. Speed where it matters, low power everywhere else.**

</div>

<div class="co co-core"><p class="co-t">Q10. &#x27;How would you characterize the leakage of a standard-cell librar · Core memory</p>

**Clarify → leakage is DC (op-point, not transient) → enumerate states → batch → reuse only proven equivalences → worst = FF/hot → validate shortcuts → automated QA.**

</div>

<div class="co co-core"><p class="co-t">Q11. &#x27;Draw a 6T SRAM cell. How do read and write work?&#x27; T1 · Core memory</p>

**Read must not flip; write must flip. PD > PG > PU.**

</div>

<div class="co co-core"><p class="co-t">Q12. &#x27;How does a ROM read work? What does the keeper do?&#x27; T1 · Core memory</p>

**The keeper saves the 1 and fights the 0. Check both, at the worst code pattern and corner.**

</div>

<div class="co co-core"><p class="co-t">Q12b. &#x27;What is a ROM?&#x27; (answer it like an engineer talking to an engin · Core memory</p>

**"A bit is a via that's there or not. The cell is trivial; the design is the periphery; the job is verification across every size, code pattern, corner and sigma."**

</div>

<div class="co co-guard"><p class="co-t">Q12b. &#x27;What is a ROM?&#x27; (answer it like an engineer talking to an engin · Guardrail</p>

Don't claim you've **built** a ROM compiler or used column-inversion encoding. Say "**one technique I've read about** is…" or "**my understanding** is…". Depth with honesty beats depth with a false claim, especially at NVIDIA.

</div>

<div class="co co-core"><p class="co-t">Q12c. &#x27;What is a standard cell?&#x27; (same layered approach) T1 · Core memory</p>

**"A standard cell is a contract: circuit + layout + LEF + Verilog + .lib that all agree. A cell is only as good as its .lib."**

</div>

<div class="co co-core"><p class="co-t">Q13. &#x27;What&#x27;s the difference between EM and IR? How do you know about i · Core memory</p>

**IR = voltage now (speed). EM = metal wear-out over years (reliability). Both start from the real current path.**

</div>

<div class="co co-guard"><p class="co-t">Q13. &#x27;What&#x27;s the difference between EM and IR? How do you know about i · Guardrail</p>

Only use the Apple-friend story if it's true, and say it plainly as learning. Never imply you worked at Apple or used its tools. Then **prove it with reasoning** (T1.8): Black's equation, avg/RMS/peak, where cells fail, how fixes trade off.

</div>

<div class="co co-eq"><p class="co-t">Q14. &#x27;RC charging: how long to reach 50%? 90%?&#x27; T1 · RC step response</p>

```latex
V(t) = V_{DD}\,(1 - e^{-t/RC}) \qquad t_{50\%} = 0.69\,RC \qquad t_{63\%} = RC \qquad t_{90\%} = 2.3\,RC
```
**Remember:** "0.7 to half, 1 to 63, 2.3 to 90." From 10% to 90% ≈ **2.2 RC**.

</div>

<div class="co co-core"><p class="co-t">Q15. &#x27;DRC and LVS are clean. Is the cell done?&#x27; T1 · Core memory</p>

**DRC = legal shape. LVS = right circuit. Neither = works, fast enough, or reliable.**

</div>

<div class="co co-guard"><p class="co-t">Q19b. &#x27;Why the ROM team?&#x27; (and &#x27;standard cells or ROM?&#x27;) T1 · Guardrail</p>

Don't pick one so strongly that you sound disappointed by the other. Ask him which way the opening leans (Part P.4, question 1).

</div>

<div class="co co-core"><p class="co-t">Q19c. &#x27;Why are you a good fit for this role?&#x27; T1 · Core memory</p>

**Device physics underneath + library customer downstream + verify-and-automate habit. Name the one gap honestly, then show you're closing it.**

</div>

<div class="co co-core"><p class="co-t">Q19d. &#x27;Why go from analog design to a ROM team?&#x27; T1 · Core memory</p>

**"A ROM read is an analog problem in a digital box": keeper vs leakage vs sense timing. Same margin thinking as my subthreshold front end, at far bigger scale.**

</div>

<div class="co co-core"><p class="co-t">Q19e. &#x27;You started a PhD. Why did you leave, and why did your research · Core memory</p>

**PhD track → research moved from RF to implant front end (followed the work, went deeper into low-power margins) → realized I want circuits that ship → completed the MS → industry circuit design. Not a detour: it's where the margin thinking comes from.**

</div>

<div class="co co-guard"><p class="co-t">Q19e. &#x27;You started a PhD. Why did you leave, and why did your research · Guardrails</p>

1. **Never say "I have a PhD."** Say "I started on the PhD track and **completed my MS**."
2. Never "burned out," "lost interest," or anything negative about the lab, the research or your advisor.
3. Don't make **consulting** the reason you left, and don't imply it only started afterward (the dates overlap).
4. Keep it to **~45 seconds**, then stop. Let him ask more if he wants.
5. Bring up the grad-school overload/probation **only if he asks** about grades (Part A2, C3).

</div>

<div class="co co-core"><p class="co-t">Q21. &#x27;Write a SPICE measurement / a quick script.&#x27; (reported: &#x27;Coding  · Core memory</p>

**Say the thresholds out loud (50% for delay, 20–80% for slew). A missing measurement is a failure, not a zero.**

</div>


### Bible: Part X — Expert question bank (engineer to engineer)

<div class="co co-core"><p class="co-t">The expert frame for any scenario</p>

**1. Clarify the spec and the failure. 2. Name the physical mechanism. 3. Give the trade-off (what the fix costs). 4. Say how you'd verify it: which sim, which corner, which sigma.**

</div>

<div class="co co-eq"><p class="co-t">X2.2 &#x27;Wire resistance dominates at these nodes. How do you analyze and · Distributed RC</p>

```latex
t_{50\%} \approx 0.38\,R_w C_w \;(+\; 0.69\,R_{drv} C_w) \qquad R_w C_w \propto L^2
```
**Remember:** "**double the length → 4× the wire delay**." Halving a bitline into two segments cuts wire RC per segment by ~4×.

</div>

<div class="co co-eq"><p class="co-t">X3.1 &#x27;For an AOI/OAI gate, how do you size for symmetric rise/fall and · Switching threshold</p>

```latex
V_m = \frac{V_{tn} + r\,(V_{DD} - |V_{tp}|)}{1 + r} \qquad r = \sqrt{\frac{k_p}{k_n}}
```
**Remember:** "equal currents at V_m." Stronger PMOS → V_m moves **up**. For V_m ≈ VDD/2 you need k_p ≈ k_n (with |Vtp| ≈ Vtn).

</div>

<div class="co co-core"><p class="co-t">X5.8 &#x27;The sense amp passes fresh but fails after aging simulation.&#x27; · Core memory</p>

**Every scenario: mechanism → the corner it lives at → the fix → what the fix costs → how you'd re-verify.** That's how an experienced engineer answers.

</div>

<div class="co co-core"><p class="co-t">X6.12 &#x27;How do you decide what goes in the library at all?&#x27; · Core memory</p>

**The MS-level skill is analysis: model it, bound it statistically, verify it against silicon, and explain the trade-off with data. Answer every question from that stance.**

</div>


### Bible: Part F1 — Faraday, told honestly (scope it before he wanders)

<div class="co co-core"><p class="co-t">F1.3 &#x27;What is MBIST? What faults does it catch?&#x27; (in your zone; memory · Core memory</p>

**Scope first → answer inside your zone → "here's how I understand the rest." You never need to inflate Faraday.**

</div>


### Bible: Part D2 — The drills they may hit (locked-down answers)

<div class="co co-core"><p class="co-t">Your master arc</p>

"I explored deliberately, research and then the business side, and it **converged on hands-on silicon**: where device physics becomes something every chip uses. A standard-cell and ROM library is exactly that."

</div>

<div class="co co-guard"><p class="co-t">D2.3 &#x27;Why did you leave the PhD track?&#x27; · Guardrail</p>

Say "**I started on the PhD track and completed my MS.**" Never "I have a PhD." Never badmouth research, your advisor or the lab; never "burned out."

</div>


### Bible: Part R2 — Your six stories (have these cold)

<div class="co co-core"><p class="co-t">Rules for every story</p>

**45–70 seconds.** Situation in two sentences, most of the time on **your actions**, end on a **number or concrete result**, then one line of lesson. Engineering stories first; at most one consulting story.

</div>


### Bible: Part CULT — NVIDIA culture: what the behavioral questions test

<div class="co co-core"><p class="co-t">CULT.1 What NVIDIA&#x27;s behavioral questions are really testing · Core memory</p>

**NVIDIA wants: tells the truth fast, takes blunt feedback well, moves at the speed of light, owns the mission beyond the job description, and influences with evidence.** Every story should show at least one.

</div>


### Bible: Part CAREER — Your future & career plan

<div class="co co-guard"><p class="co-t">&#x27;What do you want to learn in your first year?&#x27; · Guardrails for the career cluster</p>

1. **Keep the horizon inside NVIDIA and circuit design.** Don't volunteer longer-term ideas about strategy, consulting, a startup, or healthcare commercialization. They're real interests, but here they read as "he'll leave."
2. **No "stepping stone" language.** Never "this will give me a foundation to…"
3. **Specific beats grand.** "Own a flop family, then a node bring-up" is stronger than "become a leader in AI hardware."
4. **Consistent with Part D2:** exploring is over; it converged on hands-on silicon.

</div>

<div class="co co-core"><p class="co-t">&#x27;What do you want to learn in your first year?&#x27; · Core memory</p>

**Year 1: reproduce, then own a bounded change. Years 2–3: own a cell family or ROM. Year 5: new-node bring-up, go-to for hard margins. Year 10: deep technical ownership of foundation IP. Technical track first.**

</div>


### Bible: Tier 1 — Must conquer

<div class="co co-eq"><p class="co-t">T1.1 The MOSFET: regions, leakage, temperature · E1 · MOSFET current (teaching model)</p>

```latex
I_{D,sat} = \tfrac{\beta}{2}(V_{GS}-V_t)^2 \qquad I_{sub} \propto e^{(V_{GS}-V_t)/(n\,kT/q)}
```
**Remember:** above Vt → **square law** (overdrive²). Below Vt → **exponential**: every ~60–100 mV of Vt changes leakage by **10×**. **Limit:** advanced nodes need the real compact models.

</div>

<div class="co co-core"><p class="co-t">T1.1 The MOSFET: regions, leakage, temperature · Core memory</p>

**Above Vt: square law. Below Vt: exponential, 10× per ~80 mV. Hot = leaky. Low VDD: cold is slow. Stacks leak less.**

</div>

<div class="co co-core"><p class="co-t">T1.2 CMOS gates, sizing &amp; stick diagrams · Core memory</p>

**Series ↔ parallel duals. Series → wider. NAND > NOR. Euler path → unbroken diffusion. Upsizing loads the previous stage.**

</div>

<div class="co co-eq"><p class="co-t">T1.3 Delay, power &amp; leakage · E2 · Gate delay (RC model)</p>

```latex
t_{pd} \approx 0.69\,R_{eff}\,(C_{self} + C_{load})
```
**Remember:** "0.69 to half swing." Doubling width halves R but also doubles C_self and the input cap, so delay doesn't halve. **Limit:** effective R is an approximation.

</div>

<div class="co co-eq"><p class="co-t">T1.3 Delay, power &amp; leakage · E3 · Power</p>

```latex
P_{dyn} = \alpha\,C\,V_{DD}^2\,f \qquad P_{leak} = V_{DD}\,I_{leak} \qquad E_{0\to1} = C\,V_{DD}^2
```
**Remember:** "**a C V-squared f**": **voltage is squared**, so −10% VDD ≈ **−19%** dynamic power. The supply pays C·V² per charge: half stored, half burned in the PMOS.

</div>

<div class="co co-core"><p class="co-t">T1.3 Delay, power &amp; leakage · Core memory</p>

**Delay ≈ 0.69 RC. Power = αCV²f + V·I_leak. Voltage is the biggest lever. LVT buys speed with exponential leakage.**

</div>

<div class="co co-eq"><p class="co-t">T1.4 Latches, flip-flops, setup &amp; hold · E4 · Timing slack (S = capture clock − launch clock arrival)</p>

```latex
\text{Setup: } T + S \ge t_{cq,max} + t_{pd,max} + t_{su} \qquad \text{Hold: } t_{cq,min} + t_{cd,min} \ge S + t_{h}
```
**Remember:** "**Setup races the next edge; hold protects this edge.**" Positive skew (later capture) **helps setup, hurts hold**. Draw both edges; never memorize the sign.

</div>

<div class="co co-core"><p class="co-t">T1.4 Latches, flip-flops, setup &amp; hold · Core memory</p>

**Latch = TG + inverter loop. DFF = master + slave. Setup = old data in time. Hold = new data not too early. Slowing the clock never fixes hold.**

</div>

<div class="co co-eq"><p class="co-t">T1.5 6T SRAM &amp; the sense amplifier · E5 · Bitline development</p>

```latex
\Delta V = \frac{I_{cell}\, t}{C_{BL}}
```
**Remember:** "**I t over C**." More rows → more C_BL → less swing in the same time. 12 µA × 250 ps / 80 fF = **37.5 mV**.

</div>

<div class="co co-core"><p class="co-t">T1.5 6T SRAM &amp; the sense amplifier · Core memory</p>

**Read must not flip (PD > PG). Write must flip (PG > PU). Sense amp resolves a small swing; swing must beat offset.**

</div>

<div class="co co-eq"><p class="co-t">T1.6 ROM: read path, keeper &amp; margins · E6 · ROM read budget</p>

```latex
t_{0} \approx \frac{C_{BL}\,\Delta V}{I_{sel} - I_{keeper}} \qquad \Delta V_{droop,1} \approx \frac{(N{-}1)\,I_{off} - I_{keeper}}{C_{BL}}\, t
```
**Remember:** "**The keeper saves the 1 and fights the 0.**" Both must pass at the sense time, at the **worst corner and code**.

</div>

<div class="co co-core"><p class="co-t">T1.6 ROM: read path, keeper &amp; margins · Core memory</p>

**Precharge → WL → connected falls (0), unconnected holds (1). Keeper: saves the 1, fights the 0. Rows limited by leakage vs on-current at fast/hot. Code pattern is a variable.**

</div>

<div class="co co-eq"><p class="co-t">T1.7 Characterization &amp; Liberty (.lib) · E7 · Table interpolation</p>

```latex
d(x,y) = (1{-}x)(1{-}y)\,d_{00} + x(1{-}y)\,d_{10} + (1{-}x)\,y\,d_{01} + x\,y\,d_{11}
```
**Remember:** interpolate along **load**, then along **slew**. Outside the grid = **extrapolation**: treat it with suspicion.

</div>

<div class="co co-core"><p class="co-t">T1.7 Characterization &amp; Liberty (.lib) · Core memory</p>

**.lib = promise. Sensitize the arc; tables are slew × load; setup/hold by clk-Q pushout; leakage per state; spot-check against SPICE.**

</div>

<div class="co co-eq"><p class="co-t">T1.8 EM &amp; IR: Bo&#x27;s home turf (go deep here) · E8 · Black&#x27;s equation (EM lifetime)</p>

```latex
\mathrm{MTTF} = A\, J^{-n}\, e^{E_a / kT} \qquad J = \frac{I}{w\,t}
```
**Remember:** "**more current density or hotter → shorter life.**" n ≈ 1–2; Ea ≈ 0.7–0.9 eV for copper. Double the width at the same current and n = 2 → **4× lifetime**. **Limit:** calibrated per process; the foundry deck sets the real limits.

</div>

<div class="co co-eq"><p class="co-t">T1.8 EM &amp; IR: Bo&#x27;s home turf (go deep here) · E9 · Pulse currents (duty d)</p>

```latex
I_{avg} = I_p\, d \qquad I_{rms} = I_p \sqrt{d} \qquad \text{e.g. } 4\,\text{mA at } 25\% \Rightarrow 1\,\text{mA avg},\ 2\,\text{mA rms}
```
**Remember:** "**average the current; RMS averages the square.**" A signal wire can average **≈ 0** and still have large RMS and peak.

</div>

<div class="co co-eq"><p class="co-t">T1.8 EM &amp; IR: Bo&#x27;s home turf (go deep here) · E10 · Decap sizing</p>

```latex
C_{decap} \approx \frac{I\,\Delta t}{\Delta V} \qquad \text{2 mA for 200 ps, 20 mV droop} \Rightarrow 20\,\text{pF}
```
**Remember:** decap is a **charge budget**: it helps a short burst, not a sustained DC current or EM.

</div>

<div class="co co-core"><p class="co-t">T1.8 EM &amp; IR: Bo&#x27;s home turf (go deep here) · Core memory</p>

**IR = voltage now → speed. EM = atoms move over years → opens/shorts. Rails = DC EM (average). Signals = RMS + peak. Load × frequency × slew drive cell EM. Vias are usually the weak point. Every timing fix → recheck EM.**

</div>

<div class="co co-core"><p class="co-t">T1.9 SPICE testbenches &amp; DRC / LVS / extraction · Core memory</p>

**Testbench: question → circuit → stimulus → analysis → measurement → look at one waveform. Missing ≠ zero. LVS: shorts first. Clean ≠ done.**

</div>

<div class="co co-core"><p class="co-t">T1.10 Noise: crosstalk, supply and dynamic nodes · Core memory</p>

**Opposite-switching neighbor slows you, same-direction speeds you up. Static gates restore; dynamic nodes and sense amps don't, so they need keepers and margin.**

</div>


### Bible: Tier 2 — How to excel

<div class="co co-eq"><p class="co-t">T2.1 Logical effort, buffer chains &amp; charge sharing · E11 · Path sizing</p>

```latex
F = G\,B\,H \qquad N_{opt} \approx \log_4 F \qquad \hat{f} = F^{1/N} \approx 4
```
**Remember:** "**fan-out of 4 per stage**." Driving 64× load from a unit inverter → log₄64 = **3 stages**, sizes **1, 4, 16**.

</div>

<div class="co co-core"><p class="co-t">T2.1 Logical effort, buffer chains &amp; charge sharing · Core memory</p>

**d = gh + p. Aim for ~4 per stage. Charge sharing = charge conserved: V = VDD·C₁/(C₁+C₂).**

</div>

<div class="co co-core"><p class="co-t">T2.2 Level shifters, isolation &amp; power domains · Core memory</p>

**Low→high shifter = cross-coupled PMOS + NMOS pull-downs. Failure = NMOS can't win the contention at low VDDL. Domain off → isolation cell, not a shifter.**

</div>

<div class="co co-core"><p class="co-t">T2.3 Clock gating, power gating &amp; retention · Core memory</p>

**Clock gating cuts dynamic power (keeps state); power gating cuts leakage (loses state, needs retention + isolation). ICG = latch + AND, glitch-free.**

</div>

<div class="co co-eq"><p class="co-t">T2.4 Metastability &amp; synchronizers · E12 · Synchronizer MTBF</p>

```latex
\mathrm{MTBF} = \frac{e^{t_r/\tau}}{T_0\, f_{clk}\, f_{data}}
```
**Remember:** "**exponential in resolution time**." One more flop of wait time multiplies MTBF enormously. τ is set by the regenerative loop's gm/C.

</div>

<div class="co co-core"><p class="co-t">T2.5 Memory organization &amp; self-timing · Core memory</p>

**Rows set bitline C and leakage; columns set wordline RC. Replica bitline tracks global PVT, not local mismatch.**

</div>

<div class="co co-eq"><p class="co-t">T2.6 Variation, yield &amp; high-sigma · E13 · Mismatch and array yield</p>

```latex
\sigma(\Delta V_t) = \frac{A_{Vt}}{\sqrt{W L}} \qquad Y = (1-p)^N \approx e^{-Np} \qquad p_{max} \approx \frac{-\ln Y}{N}
```
**Remember:** "**4× area → ½ sigma**." For 1 Mb at 99.9% yield → p ≈ 1e-9 per cell → about **6σ**.

</div>

<div class="co co-core"><p class="co-t">T2.6 Variation, yield &amp; high-sigma · Core memory</p>

**Corners = global; Monte Carlo = local. Yield ≈ e^(−Np). 1 Mb → ~6σ. Zero fails in n runs → p < 3/n.**

</div>

<div class="co co-core"><p class="co-t">T2.9 Advanced-node transition: FinFET → GAA · Core memory</p>

**Physics transfers; legal device choices and parasitics must be relearned. FinFET = quantized width; GAA = all-around gate; contacts matter.**

</div>

<div class="co co-core"><p class="co-t">T2.10 Register files · Core memory</p>

**Register file = 8T+ cells with many ports. Read port = precharged single-ended bitline + keeper, the same leakage-vs-on-current problem as ROM.**

</div>


### Bible: Résumé defense — only because you claimed it

<div class="co co-eq"><p class="co-t">RD.1 WICS: implantable auditory front end (TSMC 65nm) · E14 · Subthreshold efficiency</p>

```latex
\frac{g_m}{I_D} \approx \frac{1}{n\,U_T} \qquad U_T = \frac{kT}{q} \approx 26\,\text{mV at 300 K}
```
**Remember:** "**subthreshold = max gm per amp**", but gm ∝ I, so bandwidth ∝ current.

</div>

<div class="co co-guard"><p class="co-t">RD.1 WICS: implantable auditory front end (TSMC 65nm) · Guardrail</p>

Know your numbers: supply, bias current or power, bandwidth, transimpedance/gain, integrated noise, phase margin, corner set, and schematic vs layout status. If you don't remember one: "I don't recall the exact number; it was measured as X."

</div>

<div class="co co-guard"><p class="co-t">Facts you can state with confidence · Things the repo shows were NOT done: never imply them</p>

- **Only one corner** (TT, 1.2 V, 25 °C). The "best/worst" views all point at the typical library. **No SS/FF signoff, no derates.**
- **No IR-drop or EM analysis.** The power-estimate script was never adapted. The 1.16 W figure is a synthesis estimate.
- **No clock gating inside the NTT core**; LUT macros are always enabled.
- The on-chip **ring NoC was dropped**; don't describe it as part of the chip.
- The controller is **counter-based index generation, not a microcode ROM**.
- Don't claim ML-KEM compliance.
- Not taped out, no silicon.

</div>

<div class="co co-eq"><p class="co-t">The low-DMA-frequency bug: now you have an answer · The physics first (say this, it&#x27;s the circuit-designer answer)</p>

**A failure that appears only at *lower* frequency is not setup timing**: slowing the clock *adds* setup slack. **Hold doesn't depend on frequency.** So the cause must be a **rate or clock-ratio assumption**: something that only goes wrong when one side becomes the slower one.

</div>


### Bible: Part A2 — Full answer library

<div class="co co-guard"><p class="co-t">A0. &#x27;Tell me about yourself.&#x27; (almost always the opener) · Guardrail</p>

Keep it to ~75 seconds. Give the arc and let them dig. Don't list consulting or case competitions here; let them come up later if they do.

</div>

<div class="co co-guard"><p class="co-t">A3. &#x27;Why this kind of circuit work, and not analog or process integrat · Guardrail</p>

Don't dismiss analog or process work; you may be asked by someone who loves it. Frame this role as where your interests meet, not as escaping something.

</div>

<div class="co co-guard"><p class="co-t">A6. &#x27;Where in ten years?&#x27; · Register note</p>

Rooted and specific, like TSMC. Not the expansive McKinsey energy. They're hiring an engineer to own cells, and they want someone who'll stay and get deep.

</div>

<div class="co co-guard"><p class="co-t">B2.1 &#x27;Why did you quit the PhD?&#x27; · Do / Don&#x27;t</p>

Do: frame as clarity. Don't: badmouth research or your advisor, or say "I burned out."

</div>

<div class="co co-guard"><p class="co-t">B2.6 Owning the &#x27;all-in, then redirect&#x27; pattern · Guardrail</p>

Don't name consulting as the reason you left the PhD track, and don't claim it only started afterward (the dates overlap). That's what made it read as drift at McKinsey. The destination was hands-on silicon; consulting was a test you ran.

</div>

<div class="co co-guard"><p class="co-t">B2.7 &#x27;Tell me about the conversation with your advisor.&#x27; · Guardrail</p>

Say "broad across the system," never "unfocused." Don't volunteer that the door back was left open.

</div>

<div class="co co-guard"><p class="co-t">C3. &#x27;You were on academic probation in Fall 2025.&#x27; · Guardrail</p>

Two sentences of ownership, then the recovery. Don't over-explain or sound rattled.

</div>

<div class="co co-guard"><p class="co-t">D16. &#x27;Tell me about feedback you received and what you did with it.&#x27; · Guardrail</p>

Pick feedback that's real and that you've visibly acted on. Don't pick one that undermines the role ("I'm not detail-oriented").

</div>


### Bible: Part CODE — Coding & scripting drills

<div class="co co-core"><p class="co-t">Drill 4: SPICE parameter sweep (no script needed) · Core memory</p>

**Logic out loud first. Loop → run → parse → flag missing → summarize. Missing is a failure, never a zero.**

</div>

### Scripting: Part 1 — The answer to "What have you done with Perl, Tcl, Make?"

<div class="co co-guard"><p class="co-t">Ownership: confirm before Friday</p>

The Innovus scripts start from a **course template** (header: "EECS 627 Final Lab, Created by Qirui Zhang"). What the **team added** on top is the interesting part: the Make pattern rules, the per-PE parameterization, and the Tcl procs for pins, route blockages and antenna diodes. **Claim only the pieces you wrote or ran**, and say "we started from the course's Innovus template and extended it." **[fill in: which procs/targets were yours]**

</div>


### Scripting: Part 2 — Make: what you used, what it means

<div class="co co-guard"><p class="co-t">2.2 Make vocabulary you should use naturally · One subtle thing that sounds senior</p>

`tool | tee log` returns **tee's** exit code, so a **failed** DC/Innovus run can look like success to Make. Fix: put `SHELL := /bin/bash` and `.SHELLFLAGS := -o pipefail -c` at the top of the Makefile. Mention it as "something I'd fix."

</div>


### Scripting: Part 3 — Tcl: the language, then your procs

<div class="co co-eq"><p class="co-t">3.1 Tcl in ten rules · The gotcha that proves you&#x27;ve actually written Tcl for EDA tools</p>

**Square brackets in pin names must be escaped**, because `[0]` would be treated as a command. Your pin script does exactly this: `editPin -pin "${pin_name}\[$pin_idx\]"`. **Memory trick:** "in Tcl, brackets **run** things."

</div>


### Scripting: Part 7 — Perl, shell and Python: the report-parsing toolkit

<div class="co co-guard"><p class="co-t">7.2 One-liners worth memorizing · Say this, it shows maturity</p>

"Report formats differ between tools and versions, so I **check one report by eye first**, then write the parser, and I make the script **flag files it couldn't parse** instead of silently skipping them."

</div>

### 427: Lecture 2 — Fabrication and Layout

<div class="co co-core"><p class="co-t">2.1 CMOS refresher: the device and the complementary gate · Core idea</p>

In static CMOS the pull-down and pull-up networks are **duals**: series in one is parallel in the other. For any input combination exactly one network conducts, so the output is always driven, rail-to-rail, with no static current (ignoring leakage).

</div>

<div class="co co-guard"><p class="co-t">2.2 NAND, NOR and the internal node · Common trap</p>

The internal nodes are not "don't care". The charge stored on Z (V_DD − V_th in the A = 1, B = 0 case) has to be discharged on the next falling transition. That is the origin of the **input-pattern dependence** of delay in Lecture 3 and of **charge sharing** in dynamic gates. In a dynamic NOR ROM or a domino stack, an internal node like Z can share charge with the precharged node and pull it down.

</div>

<div class="co co-core"><p class="co-t">2.3 Tristates: restoring vs nonrestoring · Core idea</p>

Restoring means a stage with gain whose output comes from the rails, not from the input. A TG is fine inside a cell, for example in a mux or flip-flop, as long as a restoring stage follows it. Long TG chains accumulate RC delay and noise.

</div>

<div class="co co-guard"><p class="co-t">2.7 Design rules · Common trap</p>

Spacing and enclosure rules are not arbitrary. Each one maps to a specific failure (short, open, high-R contact, punch-through to the well). An interviewer may ask "why does poly need to extend past active?" The answer is misalignment, which would otherwise short source to drain.

</div>

<div class="co co-eq"><p class="co-t">Sizing NAND2 and NOR2 (2:1 and 1:1), worked out · Equation card</p>

Series stack of k devices: R_total = Σ R_i → **width each = k × reference width** to match.
Parallel: size for the worst case (one device on) → **width = reference width**.
2:1 ref: g_NAND,n = (n+2)/3, g_NOR,n = (2n+1)/3. 1:1 ref: both (n+1)/2.
Memory trick: "**series scales, parallel stays.**"

</div>

<div class="co co-core"><p class="co-t">2.11 Stick diagrams and Euler paths · Core idea</p>

Same input order in both networks + one Euler path in each = one diffusion strip per network = minimum width and minimum diffusion capacitance. This is the textbook way to lay out a static CMOS cell, and interviewers like to have it drawn on a whiteboard.

</div>

<div class="co co-core"><p class="co-t">2.12 Cost and yield · Core idea</p>

Area is cost twice over: fewer dies per wafer, and lower yield per die (Y = e^(−AD)). That is the reason dense layout and small cells matter, and why memories (the largest area blocks) carry redundancy.

</div>


### 427: Lecture 3 — Static CMOS Circuits Review: Delay

<div class="co co-eq"><p class="co-t">3.1 Delay definitions and the first-order RC model · Equation card</p>

t_p = 0.69·R_eq·(C_self + C_load)
Width ×k: R/k, C_self·k → intrinsic delay constant, load term ÷k.
Memory trick: "**ln 2 ≈ 0.69, and the intrinsic delay never shrinks with size.**"

</div>

<div class="co co-guard"><p class="co-t">3.2 Inverter transient and equivalent resistance · Common trap</p>

R_eq is not the small-signal r_ds and not V_DD/I_DSAT. It is an **average over the switching window**, about ¾·V_DD/I_DSAT. Also, a pMOS of the same W has roughly 2× the R of an nMOS (μn/μp ≈ 2), which is why the reference inverter is 2:1.

</div>

<div class="co co-guard"><p class="co-t">3.4 Hand estimate: fanout-of-1 inverter · Common trap</p>

Raising V_DD speeds the gate up only with diminishing returns, while dynamic energy grows as V_DD². Near V_T the delay blows up. This matters for **min-V_DD (Vmin) characterization** of memories and register files.

</div>

<div class="co co-core"><p class="co-t">3.5 Sizing an inverter: self-loading and the P/N ratio · Core idea</p>

Sizing helps only the **load-dependent** part of delay. Equal rise and fall (β ≈ 2) is good for noise margins and duty cycle (clock trees). Minimum average delay prefers a smaller β (about 1.4–1.5).

</div>

<div class="co co-eq"><p class="co-t">3.7 Sizing gates to match the inverter, including complex gates · Equation card</p>

For each rail-to-output path: Σ_i (R_unit / w_i) = R_ref.
nMOS unit: w = 1 → R. pMOS unit: w = 2 → R.
k devices in series, equal widths → each k × reference width.

</div>

<div class="co co-guard"><p class="co-t">3.8 Elmore delay and the NAND3 example · Common trap</p>

In the series stack, the node **nearest ground** sees only one R/3, and the **output** sees the full stack. Write each C with *its own* path resistance to the source. Also remember the factor 0.69 if you want a 50% delay rather than an Elmore "time constant".

</div>


### 427: Lecture 4 — Logical Effort

<div class="co co-core"><p class="co-t">4.1 Delay of one gate: d = gh + p · Core idea</p>

Delay is a straight line in h. The **slope is g** (topology cost) and the **intercept is p** (self-loading). Making a gate bigger slides you along the line (h changes); it never changes g or p.

</div>

<div class="co co-eq"><p class="co-t">4.2 Computing g and the g table · Equation card</p>

2:1 → g_INV = 1, g_NAND,n = (n+2)/3, g_NOR,n = (2n+1)/3, p_NAND = p_NOR = n (×p_inv).
Memory trick: "**NAND adds n to 2, NOR adds 2n to 1, all over 3.**"

</div>

<div class="co co-guard"><p class="co-t">4.3 Parasitic delay and delay components · Common trap</p>

p = n for NAND and NOR here is a simplification that ignores internal-node capacitance. Real p values in a measured library are larger, and the gates in the middle of a stack suffer more (see 4.11). Also, p_inv in a real process is not 1. The class measured **about 3.4** in 130 nm (4.12).

</div>

<div class="co co-guard"><p class="co-t">4.5 Path effort and branching · Common trap</p>

Forgetting **B** is the most common error in decoder problems. Each address line fans out to many decoder gates, but only one is on the path you are timing.

</div>

<div class="co co-core"><p class="co-t">4.6 Minimum delay: equal stage effort · Core idea</p>

**Equal effort per stage minimizes delay.** The total "effort budget" F is fixed by topology, so it is divided evenly.

</div>

<div class="co co-eq"><p class="co-t">4.7 Worked example: three NAND2s · Equation card</p>

F = GBH → N̂ ≈ log₄F → f̂ = F^(1/N) → D̂ = N·f̂ + P → C_in,i = g_i·C_out,i/f̂ (go backward).
Check: the first stage's C_in must come out equal to the spec.

</div>

<div class="co co-core"><p class="co-t">4.10 Sensitivity: wrong sizes and P/N ratio · Core idea</p>

Logical-effort optima are **flat**. Being within ±50% of the ideal size, or one stage off on the "more stages" side, costs only a few percent. Effort should go into topology (G, B, P), not into perfect fractional sizes.

</div>


### 427: Lecture 5 — Adders

<div class="co co-core"><p class="co-t">5.1 Single-bit addition and PGK · Core idea</p>

PGK turns addition into a carry-propagation problem: Ci+1 = Gi + Pi·Ci. Everything in this lecture is a way to evaluate that recurrence faster.

</div>

<div class="co co-guard"><p class="co-t">5.1 Single-bit addition and PGK · Common trap</p>

P = A + B is fine for carries (and for the carry-bypass "all propagate" test only if you are careful — see 5.4, where the slide insists on XOR). It is never fine for the sum.

</div>

<div class="co co-eq"><p class="co-t">5.3 The mirror adder · Equation card</p>

Co = G + P·Ci ; S = P ⊕ Ci ; S = ABCi + (A+B+Ci)·¬Co.
Memory trick: "carry first, sum reuses carry" — both the 28T and the 24T mirror adder build ¬Co first.

</div>

<div class="co co-core"><p class="co-t">5.5 Carry-select adders · Core idea</p>

Ripple O(N), carry-select O(N/M), square-root select O(√N), prefix trees O(log N). Each step spends area/power to remove serial dependence.

</div>

<div class="co co-guard"><p class="co-t">5.5 Carry-select adders · Common trap</p>

In the bypass adder, a block whose bits are not all propagating is not "slow" — its carry-out is determined internally. The worst case is a carry born in the first block and dying in the last.

</div>

<div class="co co-eq"><p class="co-t">5.6 Parallel-prefix (PG) trees · Equation card</p>

Prefix op: (G,P)i:j = (Gi:k + Pi:k·Gk−1:j , Pi:k·Pk−1:j).
Levels: Kogge-Stone log2N; Sklansky log2N; Brent-Kung 2log2N − 1; Han-Carlson log2N + 1.
Trick: "KS = wires, BK = levels, Sk = fanout."

</div>


### 427: Lecture 6 — Static Logic Families

<div class="co co-core"><p class="co-t">6.1 Classic static CMOS · Core idea</p>

Every non-CMOS family removes some of the PMOS network (to cut input capacitance and area) and pays with ratioed behavior, reduced swing, clocking, or noise sensitivity.

</div>

<div class="co co-guard"><p class="co-t">6.3 Differential cascode voltage switch (DCVS) · Common trap</p>

DCVS has no static current in steady state, but it is still a ratioed fight during transitions. If an interviewer asks "is DCVS ratioed?", the answer is "dynamically yes, statically no" — and the sizing constraint is the same as a keeper constraint.

</div>

<div class="co co-eq"><p class="co-t">6.5 Pass-gate logic · Equation card</p>

NMOS passes 1 → Vdd − Vtn (body-effected); PMOS passes 0 → |Vtp|.
Unbuffered n-stage pass chain: t ≈ RC·n(n+1)/2.
Trick: "NMOS is good at 0, PMOS is good at 1 — a pass gate is good at only one."

</div>

<div class="co co-core"><p class="co-t">6.9 Output prediction logic (OPL) · Core idea</p>

Every non-CMOS family wins speed by limiting swing, sharing NMOS, or relying on timing — and each must eventually restore a full-rail, noise-robust signal.

</div>


### 427: Lecture 7 — Dynamic Logic Families

<div class="co co-core"><p class="co-t">7.1 The basic domino gate · Core idea</p>

A dynamic node is a capacitor with a switch to ground. In evaluate it can only go down, so every input must rise monotonically, and anything that removes charge (leakage, charge sharing, coupling) causes an irreversible error.

</div>

<div class="co co-guard"><p class="co-t">7.1 The basic domino gate · Common trap</p>

"Dynamic logic is faster because NMOS is faster" is only half the story. The bigger win is input capacitance (no PMOS on the inputs) and the early switch point (threshold ≈ Vt). The same early switch point is why noise margin is so low.

</div>

<div class="co co-eq"><p class="co-t">7.2 Leakage and the keeper · Equation card</p>

n·I_off(worst leak corner) < I_keeper < I_on,single path(weak corner).
Max fan-in n_max ≈ I_on / I_off ÷ (margin factor).
Trick: "keeper sits between one-on and all-off."

</div>

<div class="co co-core"><p class="co-t">7.11 Coupling issues: back-gate and Miller · Core idea</p>

Every dynamic-node failure is a charge budget: precharge puts Q = C·VDD on the node, and leakage, charge sharing, back-gate coupling and feedthrough all remove or add charge. The keeper and the output inverter's threshold set how much error is tolerated.

</div>


### 427: Lecture 8 — Dynamic Power

<div class="co co-guard"><p class="co-t">8.1 Where power goes: switching, short-circuit, leakage · Common trap</p>

"Short-circuit power is negligible" is only true when slopes are balanced. A large gate driven by a weak, slow net (or a long wire without repeaters) can spend a large fraction of its energy in crowbar current. Fix the slew, not the gate.

</div>

<div class="co co-core"><p class="co-t">8.2 Deriving CV² — and why half of it is lost · Core idea</p>

A full 0→1→0 output cycle draws exactly C·VDD² from the supply. The energy depends on C and V only — sizing changes speed, not the per-transition energy of a given C.

</div>

<div class="co co-eq"><p class="co-t">8.3 Activity factor · Equation card</p>

P_dyn = α·C·VDD²·f, α = P0·P1 (independent inputs), clock α = 1, random data α = 0.25, typical logic α ≈ 0.1. Memory trick: α counts *charging* events per cycle — the supply only pays on 0→1.

</div>

<div class="co co-guard"><p class="co-t">8.3 Activity factor · Common trap</p>

Mixing conventions. Some texts define activity as "transitions per cycle" (both edges) and write ½·α·C·V²·f. This course uses α = probability of a 0→1 transition, so the factor ½ is absorbed (clock α = 1, not 2). State your convention before plugging numbers.

</div>

<div class="co co-core"><p class="co-t">8.7 Reducing C: latch topology and clock load · Core idea</p>

Capacitance is not equal: weight it by activity. Clock-pin capacitance (α = 1) costs ~10× data-pin capacitance (α ≈ 0.1).

</div>

<div class="co co-eq"><p class="co-t">8.8 Trading area for voltage: parallel and pipelined datapaths · Equation card</p>

P ∝ C·V²·f. Parallel-by-N: C×N (plus overhead), f÷N, V lowered to match N× delay budget. Pipeline-by-N: C × (1 + register overhead), f same, V lowered to match 1/N path. Both win because V enters squared while C enters linearly.

</div>

<div class="co co-guard"><p class="co-t">8.9 Multiple supplies and level converters · Common trap</p>

"Low swing saves V²." Only if the charge comes from a supply at the low voltage. If you derive the low swing from VDD (Vt drops, charge sharing), the energy is C·VDD·Vswing — linear savings.

</div>

<div class="co co-core"><p class="co-t">8.11 DVFS versus gating · Core idea</p>

Lowering C is always the best strategy (no speed penalty); the voltage knob is the strongest but trades speed; multiple supplies and lower supplies need level converters on step-up. (Lecture summary.)

</div>


### 427: Lecture 9 — Static Power (Leakage)

<div class="co co-eq"><p class="co-t">9.2 The subthreshold equation and the &#x27;Ioff·10^(V/S)&#x27; form · Equation card</p>

I = Ioff · 10^[(Vgs + η(Vds − VDD) − kγVsb)/S] · (1 − e^(−Vds/vT)). S = n·vT·ln10 ≈ 100 mV/dec. Memory trick: "100 mV per decade" — 100 mV of Vt, of gate underdrive, or (via η = 0.1) of 1 V of Vds each move the current by 10×, 10×, and 10× respectively.

</div>

<div class="co co-core"><p class="co-t">9.4 The Id–Vgs roundup and the numbers to use · Core idea</p>

Leakage is one exponential: every 100 mV of Vt, of negative Vgs, of reverse body bias (÷kγ = 0.1 → 1 V), or of drain voltage (÷η = 0.1 → 1 V) is a factor of 10. Reason about leakage by counting decades.

</div>

<div class="co co-eq"><p class="co-t">9.6 Leakage levers and the stack effect · Equation card</p>

Vx = ηVDD/(1 + 2η + kγ); I_stack2 ≈ Ioff·10^(−ηVDD/S) ≈ Ioff/10 for η = 0.1, VDD = 1 V, S = 100 mV. Memory trick: the 2-stack factor is "η·VDD/S decades" — DIBL decides how much stacking helps.

</div>

<div class="co co-guard"><p class="co-t">9.6 Leakage levers and the stack effect · Common trap</p>

The stack factor is mostly a DIBL effect. In a technology with small η (long channel, low VDD) stacking buys much less. Also: the factor applies only when *both* devices are OFF; a 2-stack with one device ON is just one OFF device with a slightly higher source.

</div>

<div class="co co-guard"><p class="co-t">9.8 State dependence at block level and input-vector control · Common trap</p>

Quoting a gate's "leakage" as one number. Per-gate leakage varies by 1–2 decades with state; per-block leakage varies far less. Always ask "at what input state, temperature, and corner?"

</div>

<div class="co co-core"><p class="co-t">9.10 Sleep transistor layout and dual-Vt logic · Core idea</p>

Dual-Vt is the cheapest leakage knob in active mode: same supply, no converters, swap cells on non-critical paths. Its limit is that it cannot reduce leakage on critical paths and saves little when the timing slack histogram is narrow.

</div>

<div class="co co-core"><p class="co-t">9.13 Characterizing the leakage of a standard-cell library with minima · Core idea</p>

Leakage characterization is DC, exponential, and topological: extract a few device parameters per Vt and corner, compose cell states from parallel-add / series-stack rules, simulate only the dominant one-OFF-device states, and interpolate corners in log space.

</div>


### 427: Lecture 10 — SRAM

<div class="co co-core"><p class="co-t">10.1 Array organization and the 6T cell · Core idea</p>

One cell, two opposite requirements. A **read** must not disturb the cell, so the cell must win against the bitline. A **write** must flip the cell, so the bitline must win against the cell. All of 6T sizing reconciles those two.

</div>

<div class="co co-guard"><p class="co-t">10.2 Static noise margin and the butterfly curve · Common trap</p>

The SNM square goes inside the lobe, between the two curves, and is measured along an axis. It is **not** the diagonal distance, and it is **not** VDD/2 minus something. Also state which SNM you mean: hold SNM can look great while read SNM is the number that fails at low VDD.

</div>

<div class="co co-eq"><p class="co-t">10.4 Write operation and the pull-up ratio · Equation card</p>

**CR = (W/L)pull-down / (W/L)access** — must be large (≈1.2 to 2+) for **read stability** (N1 > N2).

**PR = (W/L)pull-up / (W/L)access** — must be small (≲1 to 1.5) for **writability** (N4 > P2).

Order: **pull-down > access > pull-up**. Memory trick: "**Read: cell beats bitline. Write: bitline beats cell.**"

</div>

<div class="co co-guard"><p class="co-t">10.4 Write operation and the pull-up ratio · Common trap</p>

The two ratios share a denominator, the access transistor. Making the access device stronger speeds reads and helps writes, but it hurts read stability. Making it weaker helps stability but slows reads and hurts writability. Being asked "what if I upsize the access transistor?" is a standard interview probe. Name both consequences.

</div>

<div class="co co-core"><p class="co-t">10.8 Column circuitry: bitline conditioning and sense amplifiers · Core idea</p>

tpd ∝ C·ΔV / I. Since the cell can't supply more I and the bitline can't shed C, a memory gets its speed by **sensing a small ΔV** with a well-timed, offset-tolerant, clocked sense amp.

</div>


### 427: Lecture 11 — Timing and Latch Design

<div class="co co-core"><p class="co-t">11.1 Synchronous timing and the three timing metrics · Core idea</p>

Setup is a **max-delay** check against the **next** edge. Hold is a **min-delay** check against the **same** edge. Mixing these up is the root of every confused answer about timing.

</div>

<div class="co co-guard"><p class="co-t">11.3 Positive and negative skew · Common trap</p>

"Skew is bad" is the wrong answer. Skew is a **trade**: positive skew lends time to the setup path and borrows it from the hold path, and negative skew does the reverse. Useful-skew optimization in CTS exploits exactly this. What is always bad is **uncertainty** (unpredictable skew and jitter), because it must be subtracted from both checks.

</div>

<div class="co co-eq"><p class="co-t">11.4 Deriving the timing constraints with skew and jitter · Equation card</p>

Setup: **T ≥ tc-q + tlogic,max + tsu − δ (+2tj)** — slow numbers, next edge, T helps.

Hold: **tc-q,cd + tlogic,cd > thold + δ (+2tj)** — fast numbers, same edge, T absent.

Memory trick: "**setup — slow — next; hold — hurry — now.**" Positive δ: + for setup, − for hold. Every picosecond of skew moved into one inequality is taken from the other.

</div>

<div class="co co-guard"><p class="co-t">11.4 Deriving the timing constraints with skew and jitter · Common trap</p>

Watch the sign convention. This lecture defines δ = t(receiver) − t(launcher). Some textbooks define skew the other way, which flips every sign. In an interview, state your convention before writing the inequality.

</div>

<div class="co co-core"><p class="co-t">11.7 Latches, master–slave flip-flops and the dynamic (C²MOS) register · Core idea</p>

A flop's setup and hold are not two independent numbers; they are the two ends of one window, positioned by when the master actually closes. Delay the closing (clock buffers, phase overlap, pulse width) and the window slides later: setup goes down, hold goes up.

</div>

<div class="co co-guard"><p class="co-t">11.7 Latches, master–slave flip-flops and the dynamic (C²MOS) register · Common trap</p>

"The TG master–slave flop has zero hold time" is true only with perfect, non-overlapping clk/clkb. With a lagging clkb, the master input TG stays partially on after the edge and hold becomes positive. That is why the cell generates its own clocks locally and keeps clk/clkb skew small.

</div>

<div class="co co-eq"><p class="co-t">11.9 Pulsed registers and the hybrid latch flip-flop (HLFF) · Equation card</p>

Master–slave TG: **tsu ≈ ttg + tinv, thold ≈ 0, tc-q ≈ ttg + 2·tinv**.

Pulsed / HLFF: **tsu < 0 possible, thold ≈ tpulse, tc-q ≈ one latch delay**.

Clock-phase delay δ inside the cell: **tsu → tsu − δ, thold → thold + δ**.

</div>


### 427: Lecture 12 — Multipliers

<div class="co co-core"><p class="co-t">12.1 Multi-operand addition and carry-save adders · Core idea</p>

Never propagate carries until the very end. A CSA level costs one full-adder delay regardless of word width; only the final CPA sees the carry chain.

</div>

<div class="co co-eq"><p class="co-t">12.1 Multi-operand addition and carry-save adders · Equation card</p>

Chained CPAs: ≈ (k − 1)·N.  CSA array + CPA: ≈ (k − 2) + N (+ small constant).
A 3:2 CSA: S = X⊕Y⊕Z, C = MAJ(X,Y,Z) shifted left 1.

</div>

<div class="co co-guard"><p class="co-t">12.3 Partial-product reduction and Booth encoding · Common trap</p>

Booth radix-4 halves the number of partial products, not the number of bits per partial product — each PP is M+1 bits (to hold ±2Y) and is signed, so sign extension becomes a real cost.

</div>

<div class="co co-core"><p class="co-t">12.5 Partial-product accumulation: Wallace trees and 4:2 compressors · Core idea</p>

Multiplier = Booth (fewer PPs) + tree (log-depth accumulation in carry-save form) + one fast CPA tailored to the tree's arrival profile.

</div>

<div class="co co-eq"><p class="co-t">12.5 Partial-product accumulation: Wallace trees and 4:2 compressors · Equation card</p>

Array: delay ∝ N + M.  Wallace (3:2): ≈ log_{1.5}(N/2) levels.  4:2 tree: ≈ log2(N/2) levels, each ≈ 1.5 FA delays (added).
Booth radix-4: N/2 partial products from 0, ±Y, ±2Y.

</div>


### 427: Lecture 13 — Interconnect

<div class="co co-eq"><p class="co-t">13.6 Elmore delay for a wire (added) · Equation card</p>

Wire: R = R□·l/w, C = Ctop + Cbot + 2Cadj (∝ l). Elmore of a distributed wire = RC/2 (π-model). With a driver: Rd(Cw + CL) + Rw(Cw/2 + CL). Memory trick: "the wire sees half its own capacitance, the load sees all of the wire's resistance."

</div>

<div class="co co-guard"><p class="co-t">13.8 Driven victims, waveforms, and why noise matters · Common trap</p>

Treating Cadj as a fixed capacitance in timing. It is Cgnd + MCF·Cadj with MCF from 0 to 2. Using MCF = 1 for both setup and hold hides both the worst-case slow path and the worst-case fast path.

</div>

<div class="co co-eq"><p class="co-t">13.10 Repeater results and energy · Equation card</p>

l/N = √(2RC′/(RwCw)), W = √(RCw/(RwC′)), C′ = C(1 + pinv). Energy at min delay ≈ 1.87·Cw·VDD²/length; at min EDP, +30% energy for +14% delay. Memory trick: "unrepeated is l², repeated is l; the optimum is flat, so undersize."

</div>

<div class="co co-core"><p class="co-t">13.10 Repeater results and energy · Core idea</p>

Wires scale badly because RC ∝ l²; repeaters make delay linear in length at a sizable energy cost, and the flat delay optimum means you should downsize them.

</div>

### 627: Lecture 1 — Digital Noise

<div class="co co-core"><p class="co-t">1.1 Capacitive coupling: the four noise types and the lumped model · Core idea</p>

Coupling noise is a capacitive divider during the aggressor edge, then an RC recovery set by the victim's holder. The peak depends on the race between the aggressor injecting charge and the victim driver removing it.

</div>

<div class="co co-eq"><p class="co-t">1.2 Charge-divider approximation and parameter sensitivities · Equation card</p>

ΔVN ≤ ΔVa · Cc/(Cc+Cg). Memory trick: a capacitive divider with Cc on top and Cg on the bottom. The holder (victim driver) and the aggressor slope only reduce it.

</div>

<div class="co co-guard"><p class="co-t">1.2 Charge-divider approximation and parameter sensitivities · Common trap</p>

In the exam question, reducing the victim driver width makes the aggressor transition **faster**. A weaker holder lets the victim node follow the aggressor, so less voltage changes across Cc and the aggressor sees less effective load. Coupling is two-way: the victim also affects the aggressor.

</div>

<div class="co co-eq"><p class="co-t">1.5 Soft errors: mechanism, Qcrit, collection area, FIT · Equation card</p>

Qcrit ≈ Cnode·VDD. FIT = failures per 10⁹ h. P(fail in time T) ≈ Σ(FITᵢ)·T/10⁹. Neutrons: 100–200 fC and unshieldable. Alphas: 10–20 fC and shieldable/cleanable.

</div>

<div class="co co-core"><p class="co-t">1.6 Hardened latches: TMR and DICE · Core idea</p>

Hardening means redundant state: three copies plus a vote (TMR), or four interlocked nodes (DICE) where any node needs agreement from two neighbors to change. A plain 2-node latch has no way to tell which node was hit.

</div>

<div class="co co-guard"><p class="co-t">1.6 Hardened latches: TMR and DICE · Common trap</p>

Hardening relies on the strike being **transient** and on the redundant nodes being **physically separate**. In the practice-exam latch (Check yourself Q7), a strike held indefinitely leaves the output node floating, so whether Q survives depends on off-state leakage ratios, not on restoring feedback. A single strike that reaches two sensitive nodes (an MCU) defeats DICE and TMR alike.

</div>

<div class="co co-eq"><p class="co-t">1.8 Noise propagation and noise margins · Equation card</p>

NML = VIL − VOL and NMH = VOH − VIH. Max-sum gives |H′| = 1 at VIL/VIH. Robustness gives loop noise gain k/(1−k), so use |gain| ≤ ½. Memory trick: "unity gain = infinite sensitivity, half gain = unity sensitivity".

</div>

<div class="co co-guard"><p class="co-t">1.8 Noise propagation and noise margins · Common trap</p>

Saying "noise margin is at the unity-gain point" without qualification. That maximizes the *sum* of margins, but a stage sitting there has infinite sensitivity to extra noise. The lecture's safer rule is the **½-gain point**. Also, NM only exists if VOL < VIL and VOH > VIH, which fails for weak or ratioed outputs.

</div>

<div class="co co-eq"><p class="co-t">1.9 Delay noise · Equation card</p>

Miller factor = 1 + (aggressor slew rate / victim slew rate), with a sign for direction. Same direction at equal slew gives 0, quiet gives 1, opposite at equal slew gives 2, and opposite with the aggressor 2× faster gives 3 for the victim. Use 0 for min-delay (hold) and 2 or more for max-delay (setup).

</div>

<div class="co co-core"><p class="co-t">1.10 Noise avoidance · Core idea</p>

Every fix trades density, power or delay for noise. Strengthening the holder helps the victim but hurts its neighbors. Shielding kills Cc but adds C. Only spacing reduces both, at the cost of area.

</div>


### 627: Lecture 2 — Synchronization

<div class="co co-core"><p class="co-t">2.1 Why synchronization is needed · Core idea</p>

A bistable element always has a metastable balance point. Sampling an input that is changing near the clock edge can leave the latch near that point, and the time it takes to resolve has no upper bound. It can only be made exponentially unlikely.

</div>

<div class="co co-eq"><p class="co-t">2.2 The small-signal model: aperture ta and regeneration τ · Equation card</p>

ΔV0 = Δt/ta, ΔV(t) = ΔV0·e^(t/τr), τr = Cd/gm. Memory trick: "ta converts time to voltage, τr amplifies voltage exponentially." Small Cd and large gm give a fast latch.

</div>

<div class="co co-guard"><p class="co-t">2.3 Resolving time td and why it diverges · Common trap</p>

ta and τr are different things. ta (aperture) sets how big the dangerous window is at t = 0 and enters the probability linearly. τr sets how fast the window shrinks and sits in the exponent. Halving τr helps far more than halving ta. Also, the setup and hold times on a datasheet are not ta: they are chosen to keep tCQ degradation small (for example 10%), so ta is much smaller than setup + hold.

</div>

<div class="co co-eq"><p class="co-t">2.4 Failure rate and MTBF · Equation card</p>

MTBF = e^(td/τr) / (ta·fA·fB). Memory trick: "time constant on top, frequencies on the bottom." Each extra τr of waiting multiplies MTBF by e. Each extra clock cycle TA multiplies it by e^(TA/τr), which is huge when TA ≫ τr.

</div>

<div class="co co-core"><p class="co-t">2.5 Basic synchronizers: one, two and three stages · Core idea</p>

A synchronizer works by buying resolving time. Every stage with no logic between flops adds about one clock period to td, and MTBF grows as e^(td/τr).

</div>

<div class="co co-guard"><p class="co-t">2.7 Handshaking and ways to reduce failure · Common trap</p>

"Scaling fixes metastability" is wrong in practice. τr improves with each node, but TA shrinks just as fast, and at low VDD τr gets much worse because gm collapses. MTBF has to be checked at the operating voltage and corner where the synchronizer runs.

</div>

<div class="co co-core"><p class="co-t">2.9 Advanced synchronizers and how to measure them · Core idea</p>

You cannot simulate or measure a 10⁸-year MTBF directly. You measure or simulate τr and ta (for example by de-rating to make them large and then extrapolating), and compute MTBF from the exponential model.

</div>


### 627: Lecture 3 — Low Power

<div class="co co-eq"><p class="co-t">3.1 Power consumption review · Equation card</p>

```latex
P_{switching} = \alpha\, C\, V_{DD}^2\, f
```
Only V is squared, so supply scaling is the strongest knob. Watch the α convention: here α counts full charge/discharge cycles per clock (clock α = 1). Many textbooks define α as 0→1 transitions per cycle and write ½αCV²f; both agree for a clock (added).

</div>

<div class="co co-guard"><p class="co-t">3.1 Power consumption review · Common trap</p>

"A bigger driver burns more switching energy." It does not. The ½CV² lost per edge is independent of on-resistance. A bigger driver costs energy only through its own extra gate and diffusion capacitance (more C) and through short-circuit current if it slows the edges of its own input.

</div>

<div class="co co-core"><p class="co-t">3.2 Clock gating · Core idea</p>

Clock gating lowers α on the highest-α net on the chip. The latch + AND structure makes it safe: `en` is sampled only during the low phase, so `g_clk` cannot glitch.

</div>

<div class="co co-eq"><p class="co-t">3.3 Supply scaling at constant throughput: parallelism and pipelining · Equation card</p>

Parallel: P = ε²·(2+ov)/2·Pref ≈ ε²·Pref. Pipelined: P = ε²·(1+ov)·Pref. Example: 0.66²·1.1 = 0.48.
The overhead is linear; the voltage win is squared.

</div>

<div class="co co-guard"><p class="co-t">3.3 Supply scaling at constant throughput: parallelism and pipelining · Common trap</p>

The ε² gain exists only if VDD is actually lowered. Parallelism at fixed VDD saves nothing; it doubles C and halves f. Near threshold, delay grows superlinearly as VDD drops, so a 2× delay budget buys a much smaller ε, and the leakage of the doubled area starts to count (see 3.6).

</div>

<div class="co co-core"><p class="co-t">3.4 Multiple supply domains (multi-VDD, CVS) · Core idea</p>

Going down in voltage is free. Going up needs a level converter, because a VDDL "1" cannot shut off a VDDH PMOS. Put the converter where a sequential element already exists (the LCFF) and keep each cone strictly high-to-low.

</div>

<div class="co co-guard"><p class="co-t">3.5 Dynamic voltage scaling (DVS) · Common trap</p>

The cubic saving assumes V tracks f and leakage is negligible. Near and below threshold, V stops dropping much while t_task keeps growing, so leakage energy grows. That is the reason for a minimum-energy point (next section), and why race-to-idle can win in leaky technologies or at low voltage (added).

</div>

<div class="co co-core"><p class="co-t">3.6 Minimum-energy point and near-threshold computing · Core idea</p>

Energy per operation has a minimum because leakage energy = I_leak·V·t_delay and t_delay explodes below Vth. NTV sits just above Vth, where most of the energy saving remains but the delay and variability penalties have not yet blown up.

</div>

<div class="co co-eq"><p class="co-t">3.7 Level converters: DCVS and pass-gate · Equation card</p>

DCVS works only if **IN-ON(min) > IP-ON(max)** and **IP-ON(min) > IN-OFF(max)**.
VDDL = 0.8 V: about 1000× margin each side. VDDL = 0.3 V: about 30× each side.
Mnemonic: "N must win the fight, P must beat the leak."

</div>

<div class="co co-guard"><p class="co-t">3.8 Improved and wide-range level converters · Common trap</p>

**Picking one "worst corner" for a level shifter.** The constraint is two-sided, so it needs two different corner checks, each with its own temperature. When the NMOS is subthreshold (VDDL = 0.3 V, |Vt| = 0.4 V), its current falls when cold, while a superthreshold PMOS gets stronger when cold (mobility). So the "is the NMOS strong enough?" check is **FS at −20 °C** (PMOS letter first), not "SS hot". Once both devices are superthreshold (VDDL = 0.6 V), temperature moves them together and no single temperature is clearly worst.

</div>


### 627: Lecture 4 — Power Supply

<div class="co co-eq"><p class="co-t">4.1 Goal and the impedance target · Equation card</p>

```latex
Z_{target} = \frac{r\,V_{DD}^2}{P}
```
100 W, 1 V, 10% ripple → 1 mΩ. The target must hold "at all frequencies of interest", from DC (regulator) up to the clock harmonics (on-chip decap).

</div>

<div class="co co-core"><p class="co-t">4.3 What supply noise breaks: delay, noise, TDDB, EM · Core idea</p>

Supply noise has two cost centres: the slow, sustained part (IR) costs frequency, and the fast part (L·di/dt, resonance) costs noise margin and oxide reliability. EM is the long-term cost of the current itself and is worst on DC, high-J power wires.

</div>

<div class="co co-guard"><p class="co-t">4.4 Board and the decap frequency hierarchy · Common trap</p>

"Just add more capacitance." A capacitor helps only at frequencies below its own self-resonance, and only if the inductance between it and the load is small. A huge cap far from the die does nothing for a 1 GHz current step; only on-die decap (and the package L in front of the next level) set the first droop.

</div>

<div class="co co-guard"><p class="co-t">4.7 Implicit (intrinsic) decoupling capacitance · Common trap</p>

Exam 2, P5(B) (P = 1.2 W, 1.2 V, 1 GHz, s = 0.15) gives C_total = 1.2/(1.2²·10⁹·0.15) = 5.56 nF and the official answer C_decap = 0.85·C_total = **4.72 nF**. That uses all of the non-switching capacitance. The slide's rule (½ of C_no-switch) would give about **2.36 nF**. Know both and state which one you use.

</div>

<div class="co co-eq"><p class="co-t">4.10 Power-grid model, resonance and how to fix it · Equation card</p>

```latex
\Delta V_{max} \approx IR + \Delta I \sqrt{\frac{L}{C}}\, e^{-\frac{R\,t_{pk}}{2L}},\quad t_{pk} = \frac{T_r}{4} = \frac{1}{4 f_r},\quad f_r = \frac{1}{2\pi\sqrt{LC}}
```
Mind 2π: ωr = 1/√(LC) is in rad/s; f_r = ωr/2π is in Hz. Peak at a quarter period.

</div>

<div class="co co-core"><p class="co-t">4.10 Power-grid model, resonance and how to fix it · Core idea</p>

The die sees the package through a resonant tank. Below resonance the regulator and board handle current; above it the on-die decap does; at resonance (tens to a hundred MHz) neither does, the impedance peaks, and a current step whose rise time is shorter than about a quarter resonance period produces the first droop, of size about ΔI·√(L/C).

</div>


### 627: Lecture 5 — Silicon on Insulator (SOI)

<div class="co co-core"><p class="co-t">5.1 The SOI device and its features · Core idea</p>

SOI trades the substrate junction (capacitance, leakage, latch-up, soft errors) for a floating body (history-dependent Vth, parasitic bipolar). PD-SOI design is mostly about managing the body.

</div>

<div class="co co-guard"><p class="co-t">5.1 The SOI device and its features · Common trap</p>

"SOI has no body effect" is wrong. In PD-SOI the body is there but floating; its voltage moves with coupling and leakage, so Vth moves. In FD-SOI the BOX/substrate acts as a back gate, so back bias still shifts Vth.

</div>

<div class="co co-core"><p class="co-t">5.3 Body-charging mechanisms · Core idea</p>

Fast mechanisms (capacitive coupling, forward diode) move Vb within one transition; slow ones (leakage, impact ionization) set where it starts. Delay therefore depends on what the gate did microseconds to milliseconds ago.

</div>

<div class="co co-guard"><p class="co-t">5.4 First switching vs. second switching (history effect) · Common trap</p>

Don't reason only from the DC table. The DC body voltage sets the starting point, but the transition itself (Cdb coupling as the drain swings) often moves Vb more than the DC difference between states.

</div>

<div class="co co-core"><p class="co-t">5.5 Parasitic bipolar effect · Core idea</p>

Floating body + source dropping = a free BJT. The gate cannot stop it; only limiting body charge (body contacts, FD-SOI) or avoiding the "S and D both high, then S low" pattern can.

</div>

<div class="co co-core"><p class="co-t">5.7 Body contacts · Core idea</p>

The body is a knob: float it (fast, unpredictable), tie it (predictable, slower), tie it to the gate (fast and low leakage, but only at low Vdd), or bias it from the back (UTBB).

</div>

<div class="co co-eq"><p class="co-t">5.7 Body contacts · Equation card</p>

Coupling: ΔVb = ΔVx · Cxb / ΣCb. First vs. second switch: Vb starts at 0.35 V vs. 0.45 V → second is faster. DTMOS limit: Vdd < ~0.6 V (body-source diode). FD-SOI swing ~70 mV/dec.

</div>


### 627: Lecture 6 — Energy Recovery (Adiabatic Logic)

<div class="co co-core"><p class="co-t">6.1 Where the energy goes · Core idea</p>

Dissipation is ∫VR·IR dt in the switch. Adiabatic design keeps VR small by making the source track the load (slow ramp, steps, or a sinusoid), so energy moves back and forth instead of being burned.

</div>

<div class="co co-eq"><p class="co-t">6.1 Where the energy goes · Equation card</p>

Step: E = ½CV² (any R). Ramp: E = (RC/T)·CV². n steps: E = ½CV²/n. Memory trick: loss scales with (voltage across the switch)², so cut that voltage.

</div>

<div class="co co-guard"><p class="co-t">6.4 Dual-rail adiabatic dynamic logic · Common trap</p>

"Adiabatic logic is zero energy" is false. Loss scales as RC/T, there are non-adiabatic residues (Vt drops, partial-adiabatic steps), and the tank has finite Q. The real costs are area (dual rail, 4T inverter), multi-phase clocks and a fixed frequency.

</div>

<div class="co co-core"><p class="co-t">6.6 Adiabatic examples · Core idea</p>

Full adiabatic logic is a research curiosity (slow, multi-phase, area-hungry); the parts that survive are resonant clocks and charge recycling on big capacitive nets.

</div>


### 627: Lecture 7 — Variations

<div class="co co-core"><p class="co-t">7.1 Why variation became a first-order problem · Core idea</p>

Variation turns one design point into a distribution. Frequency and leakage come from the same distribution, so the fast tail is also the leaky tail, and yield is a two-sided window.

</div>

<div class="co co-guard"><p class="co-t">7.4 CMP and metal fill · Common trap</p>

"Fill only affects ground capacitance" is wrong for floating fill. A floating fill shape is a capacitive bridge between the two neighbors, so it keeps (and spreads) Miller coupling. Grounded fill removes switching dependence but costs more total C.

</div>

<div class="co co-core"><p class="co-t">7.5 Lithography and resolution enhancement (OPC, phase shift) · Core idea</p>

Gate length is not what you drew. Its printed value depends on neighbors, focus and dose, which is why foundries restrict layout (fixed pitch, one orientation) and why identical layout context is the best matching tool.

</div>

<div class="co co-eq"><p class="co-t">7.6 Double patterning and SRAM robustness · Equation card</p>

Pitch-split DPL: two masks → two Leff means µ1 ≠ µ2. Adjacent-device mismatch now has a systematic term: ΔL = (µ1 − µ2) + random. Mismatch variance no longer cancels the global part because the two devices do not share it.
Memory trick: "same mask, same fate; different mask, different fate."

</div>

<div class="co co-guard"><p class="co-t">7.6 Double patterning and SRAM robustness · Common trap</p>

(Practice exam.) In single patterning, reticle-to-reticle laser intensity variation shifts all six transistors of a bitcell equally, so it does **not** cause bitcell failure; **RDF** (random, uncorrelated) does. Once the cell is double-patterned, laser/dose variation hits the two masks differently, so **both** RDF and laser intensity matter. If only NMOS vary, **read** failure gets worse: read depends on access + pull-down, which are on different masks, while write depends on access + PMOS, and the PMOS has no variation.

</div>

<div class="co co-guard"><p class="co-t">7.9 RTA, other fab effects, and the modeling chain · Common trap</p>

(Practice exam: three sources of Ioff variation.) RDF and RTA → Vth; lithography (OPE/OPC/phase shift/double patterning) → channel length; temperature fluctuation during oxide growth → tox. Do not list only "Vth"; the question wants the mechanism and the parameter it moves.

</div>

<div class="co co-core"><p class="co-t">7.10 Classifying variation: systematic vs random, die-to-die vs within · Core idea</p>

Know which bucket a source lives in, because the fix differs. Global variation cancels in any differential or matched structure and is handled by corners or adaptive tuning; correlated local variation is handled by proximity; uncorrelated local variation only shrinks with device area.

</div>

<div class="co co-eq"><p class="co-t">7.11 Statistical timing: corners vs global MC vs local MC at a corner · Equation card</p>

Global (correlated) adds linearly: σ = N·σG. Local (independent) adds in quadrature: σ = √N·σL.
Path: σp² = (N·σG)² + N·σL². Difference of two paths: global cancels, σ² = (NA + NB)·σL².
Relative local variation σ/µ falls as 1/√N: deep paths average out local variation; short paths, clock skew and matched pairs do not.
Memory trick: "Global marches in step; local takes a random walk."

</div>

<div class="co co-guard"><p class="co-t">7.11 Statistical timing: corners vs global MC vs local MC at a corner · Common trap</p>

Never compute mismatch at a corner. Corners set all instances to the same value, so offset, skew and bitcell imbalance come out zero. Mismatch must come from local statistics (local MC or a POCV/LVF sigma per arc).

</div>

<div class="co co-eq"><p class="co-t">7.13 Aging: NBTI, HCI, TDDB · Equation card</p>

NBTI: PMOS, Vgs = −VDD, high T, DC-like stress, ΔVth ∝ t^n (n ≈ 0.2), partial recovery. Static: depends on duty cycle (signal probability), not toggle rate.
HCI: mostly NMOS, during switching, ∝ activity × f, worse with slow input slew and high VDD.
TDDB: oxide field + T; sets max VDD.
Memory trick: "NBTI hates idle PMOS; HCI hates busy NMOS; TDDB hates high field."

</div>

<div class="co co-guard"><p class="co-t">7.13 Aging: NBTI, HCI, TDDB · Common trap</p>

A clock gated off with its PMOS held on (input low) ages under NBTI asymmetrically: one edge slows and the other does not, so duty cycle and pulse width drift. Likewise an SRAM cell holding the same data for years ages one PMOS only, which skews the cell toward its stored value and degrades write margin for the opposite value (and read SNM). Aging-aware sign-off uses the actual signal probability per pin.

</div>

<div class="co co-guard"><p class="co-t">7.14 Electromigration · Common trap</p>

(Practice exam: why are power grid wires more susceptible to EM than signal nets?) Answer: (1) high current density, (2) the current is **unidirectional** (DC), so there is no healing, (3) changes in wire width/thickness (and vias) create flux divergence. Signal wires carry bidirectional current and are limited mostly by RMS/peak rules.

</div>

<div class="co co-core"><p class="co-t">7.15 Summary · Core idea</p>

Margin = global corner + local statistics + environment (V, T) + aging + model/extraction error. Global adds linearly and cancels in matched structures; local adds in quadrature and dominates mismatch and high-sigma arrays; aging and EM are time-dependent and set by mission profile.

</div>


### 627: Lecture 8 — Adaptive Design

<div class="co co-core"><p class="co-t">8.1 Adapt to what? Classifying variation by speed and reach · Core idea</p>

An adaptive loop removes the margin for any variation it can **sense** (same physics, same location) and **out-run** (faster loop than the variation). Everything else still needs a static margin.

</div>

<div class="co co-eq"><p class="co-t">8.2 Why margins hurt: stacking and the low-power conflict · Equation card</p>

Linear stacking: margin = Σ 3σi (assumes all worst at once).
RSS for independent sources (added): margin = √(Σ (3σi)²).
Aging alone (NBTI + HCI + EM) is 25% on the slide's table, which is why aging-aware sign-off matters.

</div>

<div class="co co-guard"><p class="co-t">8.3 DVFS: design-time tables and safe switching · Common trap</p>

A design-time DVFS table addresses **none** of the variations on the grid (slide 16). It is pure workload adaptation: every die gets the same worst-case V for a given f. Exam phrasing: DVFS = workload adaptation; AVFS = process and environmental adaptation.

</div>

<div class="co co-core"><p class="co-t">8.4 AVFS and post-silicon look-up tables · Core idea</p>

A per-die table measures the truth for that die at test time, so it captures both D2D and WID process variation. It cannot see anything that happens after test: aging, temperature, droop.

</div>

<div class="co co-guard"><p class="co-t">8.4 AVFS and post-silicon look-up tables · Common trap</p>

(Practice exam P6.) Add a temperature sensor and three tester tables at −20, 25 and 85 °C. Now the tables also address **ambient temperature**, besides both process variations. They still do not address lifetime degradation, package effects, hot spots, or any fast-changing variation. At a sensor reading between table temperatures (e.g. 40 °C), pick the **worse** neighbor: above Vt that is the **hotter** table (mobility dominates, hot is slow); **below Vt pick the colder table** (Vt rise dominates, cold is slow). This is **temperature inversion** (added explanation): at low VDD the delay sensitivity to Vt, which rises as T falls, outweighs mobility loss.

</div>

<div class="co co-eq"><p class="co-t">8.5 Canary circuits: critical-path replicas and ring oscillators · Equation card</p>

Body effect (added, standard): Vt = Vt0 + γ(√(2φF + VSB) − √(2φF)).
RBB (VSB > 0 for NMOS) raises Vt and cuts leakage exponentially; FBB lowers Vt and speeds up, at the cost of leakage and junction current. Body-bias effectiveness shrinks in FinFET (thin, undoped fin), which is why it survives mainly in FD-SOI (added).

</div>

<div class="co co-core"><p class="co-t">8.6 Why canaries need margin: mistracking, local variation, fast chang · Core idea</p>

A canary is a copy, not the circuit. It tracks what copy and original share (global process, slow V, T, aging) and misses what they do not share (local variation, instruction-dependent paths, local fast droop).

</div>

<div class="co co-guard"><p class="co-t">8.7 Canary scorecard and in-situ delay detection · Common trap</p>

(Practice exam P6 B iii.) Compared with per-temperature tester tables, a canary **additionally tracks aging (degradation) and slow package variation**, and can track temperature at finer grain. But it **mistracks across temperature and voltage**, and it **does not track intra-die variation**, which the per-die tables do. Overall (P6 B iv): no firm answer, but tables probably win, because finer temperature tracking is offset by V/T mistracking, canaries miss WID, and degradation is typically small.

</div>

<div class="co co-guard"><p class="co-t">8.10 Razor II · Common trap</p>

(Practice exam P6 C.) **Hold time in Razor II** is set by the time from the **detection clock going high to the main clock going low** (the latch becoming opaque): a short path launched by the next edge must not reach N during that interval, or it is flagged as an error. If a hold path is violated on silicon, every time the instruction exercises it Razor flags an error and recovery **replays at lower frequency**, but a hold failure is frequency-independent, so it **fails again and again**: the processor hangs, makes no progress, and the error rate spikes to **100%**. It cannot execute that code.

</div>

<div class="co co-core"><p class="co-t">8.11 Silicon results and the scorecard · Core idea</p>

Scorecard across the grid: design-time DVFS covers nothing; tester tables cover static global + local process (add temperature with per-T tables); canaries cover global slow and static (process, aging, package V, ambient T); in-situ covers everything not fast; Razor covers everything within its detection window, at the cost of hold buffering and recovery logic.

</div>


### 627: Lecture 9 — Leakage

<div class="co co-eq"><p class="co-t">9.1 Leakage components and the subthreshold model · Equation card</p>

Ioff ∝ 10^(−VTH/S), S = n·(kT/q)·ln10 ≈ 60 mV/dec · n at 300 K. kT/q ≈ 26 mV at room temperature, and S grows linearly with absolute temperature.

</div>

<div class="co co-guard"><p class="co-t">9.2 DIBL and the voltage dependence of Isub · Common trap</p>

DIBL means the off-current of a device depends on its own VDS. Any technique that lowers VDS across the off device (stacking, a collapsed virtual rail) gains twice: once from the smaller VDS, and again from the higher effective Vth. Any technique that raises VDS (e.g. shorting a virtual rail to VDD) costs leakage.

</div>

<div class="co co-core"><p class="co-t">9.3 GIDL and the full drain-leakage picture · Core idea</p>

Driving the gate below the source (super-cutoff, negative wordline, reverse body bias) helps only until GIDL takes over. There is an optimum negative VGS, and it gets shallower as VDS increases.

</div>

<div class="co co-core"><p class="co-t">9.7 Stacking · Core idea</p>

The stack effect is a DIBL effect. It is large in planar (λd ≈ 0.1) and modest in FinFET (λd ≈ 0.025–0.05). Each additional off device gives diminishing returns because most of the voltage already sits across the top device.

</div>

<div class="co co-guard"><p class="co-t">9.8 State dependence: Isub vs Igate · Common trap</p>

"Isub depends on how many devices are off; Igate depends on where the on devices are." When gate leakage is comparable to subthreshold leakage (thin-oxide planar nodes), the minimum-leakage input vector must be found with both terms included.

</div>

<div class="co co-guard"><p class="co-t">9.11 Power gating (MTCMOS) and its variants · Common trap</p>

Super-cutoff does not scale without limit. As VGS goes more negative, VDG across the switch grows and **GIDL** (9.3) rises, so total leakage reaches a minimum and then increases again. The thin-oxide switch also sees VDD + Vboost across its gate oxide in standby, which is a reliability (TDDB) limit (added).

</div>

<div class="co co-eq"><p class="co-t">9.12 Virtual rails, sleep-transistor sizing and decap placement · Equation card</p>

Break-even sleep time: E_overhead = ΔP_leak · t_BE, so t_BE = (C_switch·VDD² + C_virtual·VDD²) / (VDD·(I_leak,active − I_leak,sleep)). Sleep only pays when the idle interval is longer than t_BE plus the wake-up latency.

</div>

<div class="co co-core"><p class="co-t">9.15 Body biasing and the comparison · Core idea</p>

Runtime leakage is managed by multi-Vt and channel-length choices in the library. Standby leakage is managed by power gating, with retention and wake-up handled carefully. Stacking and body bias, strong in planar, lose most of their effect in FinFET/GAA because DIBL and body effect have shrunk.

</div>


### 627: Lecture 10 — Inductance

<div class="co co-core"><p class="co-t">10.1 Inductance as a loop property · Core idea</p>

There is no such thing as "the inductance of a wire" on chip. There is the inductance of a loop, set by the signal path and the return path together. Every inductance-control technique in this lecture works by making the return path closer (smaller loop) or by cancelling flux.

</div>

<div class="co co-guard"><p class="co-t">10.2 Frequency dependence: proximity and skin effect · Common trap</p>

"Skin effect is what makes on-chip inductance frequency dependent." For on-chip wires a few µm thick, skin depth only reaches wire dimensions around and above 1 GHz (2.06 µm). The dominant on-chip effect in the GHz range is the **proximity effect**: the *return path* moves, which changes L much more than skin effect changes R.

</div>

<div class="co co-eq"><p class="co-t">10.4 Frequency of interest and inductive effects on delay · Equation card</p>

```latex
f_{knee} \approx \frac{1}{\pi t_r},\qquad \delta = \sqrt{\frac{2\rho}{\omega\mu}},\qquad V = L\frac{dI}{dt},\quad V_{victim} = m\frac{dI_{agg}}{dt}
```
tr = 10 ps → ~30 GHz. Copper δ: 6.52 µm at 100 MHz, 2.06 µm at 1 GHz.

</div>

<div class="co co-guard"><p class="co-t">10.5 Inductive coupling (crosstalk) · Common trap</p>

Capacitive crosstalk is local (nearest neighbours, falls fast with spacing) and is fixed by spacing or a shield wire. Inductive crosstalk is set by **loop overlap**, which can be large; a shield helps only if it actually carries the return current close to the signal.

</div>

<div class="co co-core"><p class="co-t">10.7 Optimal inductance for repeated interconnect · Core idea</p>

A little inductance speeds up a repeated line by sharpening slopes; too much makes it ring. The optimum sits just before the overshoot inflection point.

</div>


### 627: Lecture 11 — Compute-in-Memory

<div class="co co-guard"><p class="co-t">11.1 The memory wall and where CIM sits · Common trap</p>

CIM papers often quote 1-bit or 4-bit TOPS/W. Always normalize to the same input and weight precision before comparing. An 8b×8b operation is worth 64 binary operations.

</div>

<div class="co co-core"><p class="co-t">11.2 Logic-in-memory: bitline computing · Core idea</p>

A bitline is a wired-OR/AND node, and a decoupled read port is a 1-bit multiplier. CIM starts from those two facts and then counts how much charge or current lands on the bitline.

</div>

<div class="co co-core"><p class="co-t">11.7 Multibit weights and the signal-margin problem · Core idea</p>

Analog CIM divides the bitline swing into N + 1 levels. Margin per level shrinks like 1/N while the variation of a level grows with the number of contributing cells, so precision is limited by bitcell current variation and ADC offset, exactly the quantities that limit an SRAM read.

</div>


## Part 8 — The last five minutes (3:55 PM ET)

<div class="co co-core"><p class="co-t">Say these to yourself</p>

- **Think out loud.** Estimate before you calculate. Draw before you explain.
- **Scope precisely:** "I owned X; the team did Y."
- **If stuck:** "From first principles I'd expect X because Y; I'd verify with Z."
- **Tie answers back to the library:** "and that's why the .lib / the margin / the corner matters."
- **Ask one real question at the end**, then thank him by name.

</div>

**Within 24 hours:** a short thank-you to **Chanel** (she forwards it), naming one topic from the conversation. Then write down every question you were asked.