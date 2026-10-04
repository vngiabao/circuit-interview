## How to use this printout

These are **Prof. Zhengya Zhang's EECS 427 lectures** (UMich, Fall 2023, IBM 130nm), rebuilt as a lecture packet. It contains **the slides themselves**, the derivations from the annotated versions, and notes written to be read like a lecture. Each lecture ends with **Check yourself** questions.

| If you have | Read |
| --- | --- |
| 1 hour | **Lecture 11** (setup, hold, flops) and **Lecture 10** (SRAM), then the **Check yourself** sets in Lectures 3, 4, 7 and 9 |
| 3 hours | Add **Lecture 7** (dynamic logic, the closest thing to a ROM bitline), **Lecture 9** (leakage), **Lecture 4** (logical effort), **Lecture 3** (delay) |
| More | Lectures 2 (layout, stick diagrams), 5 (adders), 6 (logic families), 8 (dynamic power), 12 (multipliers), 13 (wires) |

Boxes: **Core idea** (yellow), **Equation card** (gold), **Common trap** (red), **Why it matters for std-cell / ROM work** (green).

## Lecture 2 — Fabrication and Layout

This lecture goes from the transistor's terminals to the mask set that makes it. It starts with a short CMOS refresher (complementary pull-up and pull-down networks, NAND/NOR, tristates), walks through the CMOS process step by step, and ends with what a layout designer has to respect: design rules, antenna rules, latch-up, the conventions for inverter, NAND2 and NOR2 layouts, and stick diagrams. For standard-cell work this is the physical base. Every cell is a set of rectangles on these masks, and every parasitic C or R you later characterize comes from choices made here.

### 2.1 CMOS refresher: the device and the complementary gate

SLIDE2:l02_p02_b|The MOS gate stack is a capacitor, and the gate voltage relative to the body controls whether a channel forms between n+ source and drain.||l02_p03_t|Static CMOS pairs a pMOS pull-up network with a complementary nMOS pull-down network, so exactly one of them conducts in steady state.

- The **nMOS** has four terminals: gate, source, drain and **body**. The gate–oxide–body stack is a **MOS capacitor**, with SiO₂ as a very good insulator between two conductors (poly gate and body). The professor's annotations give the turn-on conditions: nMOS ON when V_GS > V_Tn, pMOS ON when V_SG > |V_Tp|. Source and drain are defined by voltage. For an nMOS the source is the lower-voltage terminal.
- **Complementary (static) CMOS**: the inputs drive both a **pMOS pull-up network** and an **nMOS pull-down network**. The four-case table is a common interview question:
    - pull-up OFF, pull-down OFF → **Z** (floating, high impedance)
    - pull-up ON, pull-down OFF → **1**
    - pull-up OFF, pull-down ON → **0**
    - pull-up ON, pull-down ON → **X**, a fight with **static current**
- Annotation on the X case: when both networks conduct, the output is a resistive divider, V_out = V_DD·R_n/(R_n + R_p). That is why ratioed logic and contention (for example a keeper fighting a pull-down) have to be sized deliberately.
- Another annotation: an nMOS passing a 1 only reaches V_DD − V_T, and a pMOS passing a 0 only reaches |V_T|. nMOS pass a **strong 0** and pMOS pass a **strong 1**. That is why nMOS go in the pull-down and pMOS in the pull-up.

!!! core "Core idea"
    In static CMOS the pull-down and pull-up networks are **duals**: series in one is parallel in the other. For any input combination exactly one network conducts, so the output is always driven, rail-to-rail, with no static current (ignoring leakage).

### 2.2 NAND, NOR and the internal node

SLIDE2:l02_p03_b|In a NAND2 the internal node Z between the two series nMOS takes different values depending on the input pattern, including a degraded VDD−Vth.||l02_p04_t|In a NOR2 the internal node between the series pMOS can sit at a degraded Vth or float near VDD.

**NAND2**: two nMOS in **series** (pull-down conducts only when A = B = 1) and two pMOS in **parallel**. Y = ¬(A·B). The table also tracks the **internal node Z** between the series nMOS (A on the top device next to Y, B on the bottom):

| A | B | Y | Z | why |
|---|---|---|---|---|
| 0 | 0 | 1 | ~100 mV | both nMOS off; Z floats at its old value |
| 0 | 1 | 1 | 0 | B on, discharges Z to ground |
| 1 | 0 | 1 | V_DD − V_th | A on, passes Y = 1 down to Z, but an nMOS only passes V_DD − V_T |
| 1 | 1 | 0 | 0 | both on, pull-down path |

**NOR2**: pMOS in series, nMOS in parallel, Y = ¬(A + B). The internal node between the series pMOS reads 1, 1, **V_th** (A = 1, B = 0: the lower pMOS passes Y = 0 up but stops at |V_Tp|), and **~V_DD − 100 mV** (floating).

The annotations also practice building gates from the function. Y = ¬(A·B) gives series nMOS. Y = ¬(A + B·C) gives nMOS A in parallel with (B series C), and the pMOS network is its dual: A in series with (B ∥ C).

!!! guard "Common trap"
    The internal nodes are not "don't care". The charge stored on Z (V_DD − V_th in the A = 1, B = 0 case) has to be discharged on the next falling transition. That is the origin of the **input-pattern dependence** of delay in Lecture 3 and of **charge sharing** in dynamic gates. In a dynamic NOR ROM or a domino stack, an internal node like Z can share charge with the precharged node and pull it down.

!!! why "Why it matters for std-cell / ROM work"
    A NOR ROM bitline is a wide NOR. Every cell transistor hangs in parallel on the bitline, the same topology as the NOR pull-down here, but with a precharge pMOS instead of a series pMOS stack. Static NOR gates are avoided for many inputs because of the **series pMOS stack**. The ROM sidesteps this by precharging and evaluating with nMOS only.

### 2.3 Tristates: restoring vs nonrestoring

SLIDE2:l02_p04_b|A tristate buffer drives 0 or 1 when enabled and presents high impedance Z when not enabled.||l02_p05_b|A tristate inverter puts EN-controlled transistors in series with an inverter stack, so its output is restored to the rails.

- **Tristate buffer**: EN = 0 → Y = Z. EN = 1 → Y = A. Used for shared buses (register-file read ports, bitline-style buses).
- The **transmission gate** is the cheapest tristate (two transistors, nMOS with EN and pMOS with ¬EN) but it is **nonrestoring**. Noise on A passes straight to Y. The annotated VTC is a 45° line: a ΔV at the input gives the same ΔV at the output, with no gain to clean it up.
- The **tristate inverter** stacks EN/¬EN transistors in series with the A transistors. EN = 0 → Y = Z. EN = 1 → Y = ¬A. The annotated VTC for EN = 1 shows a normal inverter with gain, so it **restores** logic levels. The cost is a 2-high stack in both networks, so it is slower and has a larger input load than a plain inverter of the same size.

!!! core "Core idea"
    Restoring means a stage with gain whose output comes from the rails, not from the input. A TG is fine inside a cell, for example in a mux or flip-flop, as long as a restoring stage follows it. Long TG chains accumulate RC delay and noise.

### 2.4 Cross-section of an inverter: wells, taps and masks

SLIDE2:l02_p06_b|On a p-substrate the nMOS sits directly in the substrate while the pMOS needs an n-well as its body.||l02_p07_t|Metal on lightly doped silicon makes a poor contact, so heavily doped n+ well taps and p+ substrate taps tie the bodies to VDD and GND.

- A **p-type substrate** hosts the nMOS. The **n-well** is the body of the pMOS. The n-well connects to V_DD and the p-substrate to GND, which keeps the source/drain–body diodes reverse-biased.
- Metal touching lightly doped silicon forms a Schottky-like, poor contact. So the bodies connect through heavily doped **taps**: a p+ **substrate tap** to GND and an n+ **well tap** to V_DD.
- Taps also set the body potential locally. Too few taps means a high well/substrate resistance, which is the latch-up mechanism in 2.9.

SLIDE2:l02_p07_b|The inverter is defined by a set of masks, and the cross-section is taken along the dashed line through both transistors and both taps.||l02_p08_t|Six masks define the inverter: n-well, polysilicon, n+ diffusion, p+ diffusion, contact and metal.

The **six basic masks** for the inverter are **n-well, polysilicon, n+ diffusion, p+ diffusion, contact, metal (M1)**. A transistor exists wherever poly crosses diffusion. The n+ and p+ "select" masks decide which diffusion becomes nMOS source/drain and which becomes the n-well tap (n+ in the n-well), and likewise for pMOS and the substrate tap.

### 2.5 Process flow (the condensed version)

SLIDE2:l02_p11_t|Photolithography transfers the mask pattern into photoresist, and the resist then protects the oxide during etch.||l02_p15_t|N-diffusion is self-aligned: the already-patterned poly gate blocks the implant, so source and drain line up exactly with the gate.

The flow repeats one loop over and over: **oxidize → spin photoresist → expose through mask → develop → etch → strip resist → implant/deposit → strip oxide**.

- **Oxidation**: grow SiO₂ at 900–1200 °C with H₂O or O₂.
- **Photoresist**: positive resist softens where exposed. Negative resist hardens where exposed. The slide example uses negative resist.
- **Etch** the oxide with HF where the resist is gone, then strip the resist (piranha etch) so it doesn't melt in the next high-temperature step.
- **n-well**: diffusion (furnace with arsenic gas) or **ion implantation** (blast with As ions, blocked by SiO₂). Then strip the oxide.
- **Gate oxide + poly**: a very thin gate oxide, < 20 Å (6–7 atomic layers; about 15 Å at 65 nm). Then **CVD polysilicon** from silane (SiH₄), heavily doped to conduct, and patterned with the same litho loop.
- **Self-aligned source/drain**: the poly gate itself masks the n+ implant, so source and drain sit exactly at the gate edges with no misalignment between gate and channel. **Poly beats metal** for self-aligned gates because it survives the later high-temperature steps. The regions are still called "diffusion" even though they are implanted today.
- p+ diffusion repeats the steps for pMOS source/drain and the substrate tap.

!!! why "Why it matters for std-cell / ROM work"
    "Self-aligned" is why L_gate is set by the **poly width** (the feature size f, see 2.6). It is also why poly can never be used to cross diffusion casually: anywhere poly crosses active, you made a transistor.

### 2.6 Contacts, metal stack and feature size

SLIDE2:l02_p17_b|Contacts connect M1 to diffusion and poly, and vias connect each metal layer up through the stack to top metal.||l02_p18_t|Minimum mask dimensions set transistor size, and the feature size is the minimum poly width, which sets L_gate.

- **Contacts**: cover the wafer with thick **field oxide** and etch contact cuts. Then sputter metal and pattern it. **Contact** = M1 to diffusion or poly. **Via12, Via23, ...** = M_x to M_(x+1). The stack runs M1, M2, M3, ..., top metal.
- **Feature size f** = source–drain distance, set by the **minimum poly width → L_gate**. Historically it shrank about 30% every 2–3 years (Moore's law).
- The minimum mask dimensions set the transistor size, and through it speed, cost and power.

### 2.7 Design rules

SLIDE2:l02_p18_b|Design rules exist to tolerate fabrication errors such as mask misalignment, dust, lateral diffusion and rough surfaces.||l02_p19_t|A transistor is the overlap of poly and diffusion, so poly must extend past diffusion, and diffusion should never be used for routing.

**Why design rules?** They are the contract between the process engineer and the designer. They provide margin against **mask misalignment, dust, process variation (for example lateral diffusion) and rough surfaces**. The summary slide calls this a balance between yield and performance.

**Transistor rules** (poly over diffusion):

- If poly does not fully cross the diffusion (no **poly extension / endcap**), misalignment can leave a diffusion path around the gate end. Source and drain **short**, a catastrophic error. This is the POLY→DIFF *extension* rule.
- Unrelated poly too close to diffusion can, with misalignment, overlap it and make a narrower, more resistive diffusion. It still works, but the rule spaces them apart.
- **Never route in diffusion.** It is highly resistive and adds junction capacitance.

SLIDE2:l02_p19_b|The inverter layout annotates the key rule types: poly extension, contact to diffusion, n-well enclosure of p-diffusion, metal spacing and poly-to-contact spacing.||l02_p20_t|Contact and via rules require both layers to enclose the cut so that a misaligned mask still lands the contact on both materials.

Rules called out on the inverter: **POLY→DIFF** (extension past active), **CONT→DIFF** (enclosure of the contact by diffusion), **NWELL→PDIFF** (the well must enclose the pMOS active with margin), **NWELL→NDIFF** (n-active must stay away from the well edge), **M1→M1** (spacing), **POLY→CONT** (a gate must not touch a diffusion contact).

**Inter-layer rules**: the contact mask covers M1 to p-diffusion, M1 to n-diffusion and M1 to poly. The via masks cover M_x to M_y. The cut must be **enclosed by both materials**, so that a misaligned mask still lands the cut fully on both layers instead of half-landing, which raises resistance and hurts reliability.

!!! guard "Common trap"
    Spacing and enclosure rules are not arbitrary. Each one maps to a specific failure (short, open, high-R contact, punch-through to the well). An interviewer may ask "why does poly need to extend past active?" The answer is misalignment, which would otherwise short source to drain.

### 2.8 Antenna rules

SLIDE2:l02_p20_b|Plasma processing charges exposed conductors, and if a large conductor area connects only to a thin gate the gate oxide can break down.||l02_p21_t|Antenna violations are fixed by jumping to a higher metal near the gate or by adding a reverse-biased diode to discharge the line.

- Many process steps use **plasmas** and charged particles. Charge collects on exposed poly and metal in proportion to the **conductor area**. If that conductor connects only to a **thin gate oxide**, the field across the oxide can cause breakdown or damage.
- **Antenna ratio** = (A_poly + A_M1 + …) / A_gate_ox. It is checked per layer as each layer is being fabricated.
- If a **diode** (a diffusion connection) is attached along the line, the charge can bleed off and the rules are relaxed. Once the net reaches a source/drain diffusion, it is safe.
- **Fixes** shown in the slide:
    - (b) **metal jumper**: break the long M1 and hop up to M2 close to the gate. While M1 is being etched, the gate only sees the short M1 stub, and M2 is built later when the net already connects to a driver diffusion.
    - (c) **antenna diode**: add a small reverse-biased diode near the gate.

!!! why "Why it matters for std-cell / ROM work"
    Long **wordlines in poly or low metal** and long input routes to small gates are classic antenna offenders. In standard-cell flows, cells carry **antenna gate area / diffusion area** in the LEF, and the router inserts jumpers or diode cells. A ROM wordline driven from far away into a row of tiny gates is a textbook case.

### 2.9 Latch-up

SLIDE2:l02_p21_b|The parasitic vertical PNP and lateral NPN form a thyristor that, once triggered through Rwell and Rsub, latches a low-impedance VDD-to-GND path.||l02_p22_t|Latch-up is avoided by lowering well and substrate resistance with heavy doping, close taps and guard rings.

- The CMOS structure forms parasitic bipolar transistors: a **vertical PNP** (p+ source / n-well / p-substrate) and a **lateral NPN** (n+ source / p-substrate / n-well). Cross-coupled through **R_well** and **R_sub**, they form an **SCR (thyristor)**.
- Trigger: a current injected into the well or substrate (overshoot, a big I/O driver) drops enough voltage across R_well or R_sub to forward-bias a base–emitter junction (about 0.7 V). Each BJT then feeds the other's base. Positive feedback latches a low-impedance V_DD→GND path, which can destroy the chip.
- Most commonly a problem in **I/O pads**, with big drivers, large currents and voltage overshoot.
- **Avoidance** (lower the resistances so no junction gets forward-biased):
    - higher substrate doping reduces R_sub
    - a low-resistance contact to GND/V_DD reduces R_well: **taps placed frequently** and close to the transistors
    - **guard rings** (p+ around nMOS, n+ around pMOS) reduce the parasitic resistances and collect injected carriers

!!! why "Why it matters for std-cell / ROM work"
    This is why standard-cell libraries have a **max tap-to-device distance** rule and **tap cells / well-tie cells** placed every N µm in the row (tapless cells rely on them). In memories, the dense array rows still need periodic well and substrate straps.

### 2.10 Inverter, NAND2 and NOR2 layout

SLIDE:l02_p22_b|In 130 nm the minimum device is 160 nm wide by 120 nm long, the reference inverter is 320/120 pMOS over 160/120 nMOS, and NAND2/NOR2 share diffusion between adjacent transistors.

- Transistor dimensions are specified as **W/L**. In the 0.13 µm process the **minimum is W = 0.16 µm, L = 0.12 µm**. The reference inverter uses **pMOS 320 nm/120 nm and nMOS 160 nm/120 nm**, the **2:1 P/N ratio**, which roughly compensates for hole mobility being about half that of electrons, so rise and fall resistance are similar. (The discussion section adds that the lab uses 0.28 µm as the practical minimum width to avoid layout complications, with an inverter of 560/280 nm.)
- Annotations: **I ∝ W/L**, so R ∝ L/W. **Two identical transistors in series** behave like one transistor of twice the length (the professor's "N/2"). Their resistances add, so each must be twice as wide to match a single device's drive. Also drawn: a shared source/drain diffusion between two adjacent gates, which is what makes series and parallel stacks compact.
- **NAND2 layout**: the two series nMOS share one diffusion strip, and the internal node is just the diffusion between the two poly lines, with no contact. The two parallel pMOS share a strip, with the output in the middle and V_DD at both ends (or the reverse).
- **NOR2** is the mirror: pMOS in series on one strip, nMOS in parallel.

#### Sizing NAND2 and NOR2 (2:1 and 1:1), worked out

Assume a unit nMOS of width 1 has resistance R, and a pMOS needs width 2 for the same R (μn/μp ≈ 2). Size every gate so its **worst-case** pull-up and pull-down match the reference inverter.

**2:1 reference (P = 2, N = 1, Cin = 3):**

- **NAND2**: series nMOS → each **2** (2 × R/2 = R). Parallel pMOS → each **2** (the worst case is only one pMOS on, which must give R alone). Cin per input = 4, so **g = 4/3**.
- **NOR2**: series pMOS → each **4**. Parallel nMOS → each **1**. Cin = 5, so **g = 5/3**.
- **NAND-n**: nMOS n, pMOS 2 → g = (n+2)/3. **NOR-n**: pMOS 2n, nMOS 1 → g = (2n+1)/3.

**1:1 reference (P = 1, N = 1, Cin = 2; the pull-up is then 2R, twice as weak as the pull-down):**

- **NAND2**: series nMOS → each **2**. Parallel pMOS → each **1**. Cin = 3, g = 3/2.
- **NOR2**: series pMOS → each **2** (2 × 2R/2 = 2R, matching the inverter's 2R pull-up). Parallel nMOS → each **1**. Cin = 3, g = 3/2.
- In general, with reference ratio γ:1 (added): g_NAND = (n + γ)/(1 + γ) and g_NOR = (1 + nγ)/(1 + γ). With γ = 1 both equal (n+1)/2. NOR looks as good as NAND, but only because the reference inverter itself rises slowly.

**"All-minimum" (every device width 1):** NAND2 pull-down = 2R, twice as slow falling as a unit inverter. NOR2 pull-up = 2 × 2R = 4R, four times slower than the nMOS pull-down. This is why **NOR2 with min devices** is the slowest common cell, and why std-cell libraries offer NAND-heavy logic.

!!! eq "Equation card"
    Series stack of k devices: R_total = Σ R_i → **width each = k × reference width** to match.
    Parallel: size for the worst case (one device on) → **width = reference width**.
    2:1 ref: g_NAND,n = (n+2)/3, g_NOR,n = (2n+1)/3. 1:1 ref: both (n+1)/2.
    Memory trick: "**series scales, parallel stays.**"

SLIDE2:l02_p23_t|A simplified layout diagram shows only metal1, p-diffusion, n-diffusion, poly and contacts for the inverter and a three-input gate.||l02_p23_b|A stick diagram has no dimensions and shows only the relative positions of transistors, wires and contacts.

### 2.11 Stick diagrams and Euler paths

A **stick diagram** contains **no dimensions**. It shows only the **relative positions** of the layers: horizontal diffusion strips (p on top near V_DD, n on the bottom near GND), vertical poly lines for the inputs, metal for V_DD/GND/output, and X marks for contacts. The discussion section's rule of thumb is to draw the stick diagram before the layout and to **minimize breaks in diffusion** and **minimize interconnect**.

**How to get one unbroken diffusion strip: the Euler path method.**

1. Draw the **pull-down graph**: the nodes are electrical nets (OUT, GND, internal nodes) and each nMOS is an **edge** labeled with its input.
2. Draw the **pull-up graph** the same way (V_DD, OUT, internal nodes, one edge per pMOS).
3. Find an **Euler path** (one that visits every edge exactly once) whose **input order is the same in both graphs**.
4. Place the poly columns in that order. Each strip is then continuous, with every adjacent pair of transistors sharing a diffusion. A missing common Euler path means a **diffusion break** (extra width, plus an extra isolated contacted diffusion).

**Worked example**: OUT = ¬(D + A·(B + C)), the complex gate from Lecture 3.

- Pull-down: D from OUT to GND; A from OUT to x; B from x to GND; C from x to GND.
- Pull-up (dual): A from V_DD to m; B from V_DD to n; C from n to m; D from m to OUT.
- Try the order **D – A – B – C**:
    - nMOS: GND –D– OUT –A– x –B– GND –C– x ✓ (every edge once)
    - pMOS: OUT –D– m –A– V_DD –B– n –C– m ✓
- So a single poly order D, A, B, C gives one continuous p-strip and one continuous n-strip. Contacts are needed only where a diffusion node is a real net connection (GND, V_DD, OUT, and the m/x nodes that close the loops). Every other shared node can stay **uncontacted**, which has less capacitance (Lecture 3).

**NAND2** is the trivial case: order A, B. The n-strip runs GND–A–(internal, uncontacted)–B–OUT, and the p-strip runs V_DD–A–OUT–B–V_DD. The choice of which end is the output matters for capacitance (Lecture 3, "Layout comparison": put the output on the **shared middle** p-diffusion, so it has one contacted diffusion instead of two).

!!! core "Core idea"
    Same input order in both networks + one Euler path in each = one diffusion strip per network = minimum width and minimum diffusion capacitance. This is the textbook way to lay out a static CMOS cell, and interviewers like to have it drawn on a whiteboard.

!!! why "Why it matters for std-cell / ROM work"
    Standard cells have a fixed height (a fixed number of M1/M2 tracks) and variable width in **poly-pitch (CPP)** units. An Euler-path ordering minimizes the number of poly pitches and avoids diffusion breaks, which in FinFET nodes cost a whole dummy gate (diffusion-break rules). Output-node diffusion directly sets the **intrinsic delay (p)** and the output pin capacitance in the .lib.

### 2.12 Cost and yield

SLIDE:l02_p25_t|Yield is good dies divided by total dies, dies per wafer falls with die area including an edge-loss term, and yield falls exponentially with area times defect density.

```latex
Y = \frac{\text{good chips per wafer}}{\text{total chips per wafer}}\times 100\%,\qquad
\text{Dies/wafer} = \frac{\pi (d/2)^2}{A_{die}} - \frac{\pi d}{\sqrt{2A_{die}}},\qquad
Y = e^{-AD}
```

- **Non-recurring cost (NRE)**: design engineering plus prototype manufacturing, including **masks**. The mask-set cost on the slide climbs from about $100K at 350 nm to about $10M at 45 nm.
- **Recurring**: R_process = W/(N·Y_w·Y_pa). W = wafer cost (2–3K), N = gross dies per wafer, Y_w = die yield, Y_pa = packaging yield (≈ 1). **Y_w dominates**: big dies have lower yield *and* fewer dies per wafer, so **big chips are expensive**. Packaging ranges from dimes to tens of dollars depending on power and size. Test cost depends on complexity and test time.
- The second term in dies/wafer is the partial-die loss around the wafer edge. The wafer pictures show that with a fixed defect count, small dies lose a smaller fraction.

!!! core "Core idea"
    Area is cost twice over: fewer dies per wafer, and lower yield per die (Y = e^(−AD)). That is the reason dense layout and small cells matter, and why memories (the largest area blocks) carry redundancy.

### 2.x Check yourself

1. **In a NAND2 with A on the top nMOS, what is the internal node voltage when A = 1, B = 0, and why?** → V_DD − V_th. The top nMOS conducts from Y = V_DD down to the internal node, but an nMOS stops passing once V_GS falls to V_T. This stored charge is the reason the next falling transition is slower when B arrives last.
2. **Why is a transmission-gate tristate called nonrestoring, and when is it acceptable?** → Its output is a resistive copy of its input with no gain (unity VTC slope), so noise passes through. It is fine inside a cell when a restoring inverter follows. Avoid long TG chains.
3. **Size a NOR3 for a 2:1 reference inverter, and give its logical effort.** → Three series pMOS of width 6 each and three parallel nMOS of width 1 each. Cin = 7, g = 7/3.
4. **Same NAND2 and NOR2 but referenced to a 1:1 inverter?** → NAND2: nMOS 2, 2 and pMOS 1, 1. NOR2: pMOS 2, 2 and nMOS 1, 1. Both have Cin = 3 and g = 3/2 relative to the 1:1 inverter (Cin = 2).
5. **Find a common Euler path for ¬(A·B + C).** → Pull-down edges: A from OUT to x, B from x to GND, C from OUT to GND. Pull-up (dual, (A ∥ B) in series with C): A from V_DD to y, B from V_DD to y, C from y to OUT. The order **A, B, C** works in both: nMOS OUT –A– x –B– GND –C– OUT, and pMOS y –A– V_DD –B– y –C– OUT. That gives one unbroken strip per network.
6. **What is the antenna ratio, and name two fixes.** → (A_poly + A_M1 + …)/A_gate_ox. Fix with a metal jumper to a higher layer near the gate, or with an antenna (reverse-biased) diode on the net.
7. **What causes latch-up, and what layout practices prevent it?** → The parasitic PNP/NPN thyristor is triggered when current through R_well/R_sub forward-biases a junction. Prevent it with frequent well and substrate taps, guard rings and higher substrate doping. It is especially important near I/O.
8. **Why does poly need to extend past the active region?** → Mask misalignment could otherwise leave a diffusion path around the gate end, shorting source to drain.


## Lecture 3 — Static CMOS Circuits Review: Delay

This lecture turns transistors into numbers a designer can reason with. Each ON transistor becomes an **equivalent resistance R_eq**, each terminal becomes a **capacitance** (gate, diffusion), and gate delay becomes an **RC product**: 0.69·R·C for a single node and the **Elmore sum** for a stack. With these, the lecture covers sizing for performance, self-loading, the P/N ratio, input-pattern dependence, transistor ordering, how to size a complex gate so it matches an inverter, and how layout (shared diffusion, fingers) changes C. This is the model behind every std-cell .lib table and every hand estimate an interviewer will ask for.

### 3.1 Delay definitions and the first-order RC model

SLIDE2:l03_p02_b|Propagation delay is measured from the 50% point of the input to the 50% point of the output, and rise and fall times from 10% to 90%.||l03_p03_t|A step into an RC network gives an exponential output that crosses 50% at t = ln2·RC ≈ 0.69RC.

- **t_pHL**: input 50% → output 50% for a falling output. **t_pLH**: the same for a rising output. **t_p = (t_pHL + t_pLH)/2**. **t_r, t_f** are measured 10%→90% (slew).
- **RC step response**: V_out(t) = (1 − e^(−t/τ))·V_DD with τ = RC. The annotation derives the 50% point: 1 − e^(−t/τ) = ½ → e^(−t/τ) = ½ → **t = ln2·τ = 0.69RC**. For the discharge, V_out = V_DD·e^(−t/τ) = V_DD/2 gives the same 0.69RC.

```latex
V_{out}(t) = \left(1-e^{-t/RC}\right)V_{DD},\qquad t_p=\ln 2\cdot RC = 0.69\,RC
```

- Professor's annotation on **self-loading**: an inverter with parasitic output cap C_p driving C_L has **t_p = 0.69R(C_p + C_L)**. Make it 2× wider: R → R/2 and C_p → 2C_p, so **t_p′ = 0.69(R/2)(2C_p + C_L) = 0.69RC_p + 0.69(R/2)C_L**. The intrinsic part **0.69RC_p does not change with size**. Only the load-dependent part improves. That one line is the seed of logical effort's parasitic delay p.

!!! eq "Equation card"
    t_p = 0.69·R_eq·(C_self + C_load)
    Width ×k: R/k, C_self·k → intrinsic delay constant, load term ÷k.
    Memory trick: "**ln 2 ≈ 0.69, and the intrinsic delay never shrinks with size.**"

### 3.2 Inverter transient and equivalent resistance

SLIDE2:l03_p03_b|For a low-to-high output the pMOS charges CL through RP, and for high-to-low the nMOS discharges CL through RN.||l03_p04_t|The equivalent resistance averages V/I at the start and midpoint of the transition and is about three quarters of VDD over IDSAT.

- Rising output: **t_pLH = 0.69·R_P·C_L**. Falling output: **t_pHL = 0.69·R_N·C_L**.
- **R_eq** is a large-signal average over the transition of interest (V_DS from V_DD to V_DD/2, with V_GS = V_DD):
    - at 0% (V_DS = V_DD): V/I = V_DD/I_DSAT
    - at 50% (V_DS = V_DD/2): V/I = (V_DD/2)/(a·I_DSAT), with a < 1 (channel-length modulation)

```latex
R_{eq} = \frac{1}{2}\left(\frac{V_{DD}}{I_{DSAT}} + \frac{V_{DD}/2}{a\,I_{DSAT}}\right)\approx \frac{3}{4}\frac{V_{DD}}{I_{DSAT}}
```

- Annotation: **R_eq ∝ L/W** (width up → R down). I_DSAT ∝ W, so R_eq scales as 1/W.

!!! guard "Common trap"
    R_eq is not the small-signal r_ds and not V_DD/I_DSAT. It is an **average over the switching window**, about ¾·V_DD/I_DSAT. Also, a pMOS of the same W has roughly 2× the R of an nMOS (μn/μp ≈ 2), which is why the reference inverter is 2:1.

### 3.3 Capacitance: gate and diffusion

SLIDE2:l03_p05_t|Gate capacitance is modeled simply as Cox·W·L, which is about 1.3 fF per micron of gate width in this process.||l03_p05_b|Source and drain diffusion capacitance is parasitic, depends on area and perimeter, and is about CG for a contacted diffusion and half that for an uncontacted one.

- **Gate capacitance**: C_GC = ε_ox·W·L/t_ox = C_ox·W·L = **C_per_micron·W**, with **C_per_micron ≈ 1.3 fF/µm**. Since L is fixed at minimum, gate cap is proportional to W. ε_ox = 3.9ε₀.
- **Diffusion capacitance** (C_SB, C_DB): reverse-biased source/drain–body junctions. They are **parasitic**, depend on **area and perimeter**, and are **comparable to C_G**:
    - **contacted** diffusion ≈ **1×C_G** per device (an isolated contacted diffusion seen by one FET is drawn as **2×C_G**, a shared one as 1×C_G each)
    - **uncontacted** (merged, between two series gates) ≈ **½·C_G**
    - this varies with the process
- Rule: **use small diffusion nodes**. Share contacts between neighbors, merge series nodes without a contact, and never route in diffusion.

SLIDE2:l03_p06_t|Good layout shares contacted diffusions and merges uncontacted ones, which in the NAND3 example cuts output capacitance by 2C.||l03_p06_b|In 130 nm, C is about 1.3 fF per micron so 0.21 fF per unit device, and R is about 13 kΩ for a 160 nm wide unit nMOS.

- It is easiest to assume a contacted diffusion on every source and drain, but **good layout minimizes diffusion area**. In the NAND3 example, sharing one output diffusion contact between two pMOS **cuts output C by 2C**, and the merged uncontacted series nodes are only **1.5C** each (½ of a width-3 device's 3C). The annotations re-derive these numbers on the schematic: series nMOS width 3, internal nodes 1.5C, pMOS width 2 with 2C each.
- **130 nm RC values** (memorize):
    - C = C_g = C_s = C_d = **1.3 fF/µm** of gate width → **C = 0.21 fF per unit device** (160 nm)
    - **R ≈ 13 kΩ** for a 160 nm-wide nMOS. It improves with shorter channel length.
    - "Unit transistor" may mean the minimum contacted device. Any convention is fine if used consistently.

!!! why "Why it matters for std-cell / ROM work"
    The output-node diffusion is the **parasitic delay** of a cell and part of its output pin cap. In a **NOR ROM bitline**, every cell's drain hangs on the bitline. Bitline C ≈ (number of rows / 2 if two cells share a contact) × C_diff + wire. That is why ROM and SRAM cells **share the bitline contact between mirrored neighbors**. It halves the per-cell diffusion load on the bitline.

### 3.4 Hand estimate: fanout-of-1 inverter

SLIDE2:l03_p07_t|A fanout-of-1 inverter with 10 kΩ drive and 1.26 fF total load has a delay of about 8.7 ps.||l03_p08_t|Delay falls with VDD roughly as CL·VDD over (VDD−VT) to the alpha, with alpha about 1.2 to 1.3.

Worked example (130 nm, 320/160 nm inverter driving an identical one, R taken as 10 kΩ for both pull-up and pull-down):

- Self-load: pMOS drain 0.42 fF + nMOS drain 0.21 fF. Load: next gate's pMOS 0.42 fF + nMOS 0.21 fF.

```latex
t_{pd}=0.69\times 10\,k\Omega\times(0.42+0.42+0.21+0.21)\,fF = 0.69\times10^4\times1.26\times10^{-15}\approx 8.7\ \text{ps}
```

**Design for performance**: reduce C (compact layout, short wires, no diffusion routing), reduce R (wider devices, but **watch self-loading**), or raise V_DD (usually ruled out by reliability and power).

**Delay vs V_DD**:

```latex
t_p = 0.69\cdot\frac{3}{4}\frac{C_L V_{DD}}{I_{DSATn}}\approx 0.52\frac{C_L V_{DD}}{(W/L)_n k'_n V_{DSATn}(V_{DD}-V_{Tn}-V_{DSATn}/2)}\;\approx\; k\frac{C_L V_{DD}}{(V_{DD}-V_{Tn})^{\alpha}},\quad \alpha\approx1.2\text{–}1.3
```

The annotation marks the "~V_DD" numerator: delay rises steeply as V_DD approaches V_T, and the plot shows normalized t_p rising from about 1 at 2.4 V to about 5 at 0.8 V.

!!! guard "Common trap"
    Raising V_DD speeds the gate up only with diminishing returns, while dynamic energy grows as V_DD². Near V_T the delay blows up. This matters for **min-V_DD (Vmin) characterization** of memories and register files.

### 3.5 Sizing an inverter: self-loading and the P/N ratio

SLIDE2:l03_p08_b|For a fixed load, upsizing the driver by S reduces delay toward an asymptote set by its own intrinsic capacitance.||l03_p09_t|Raising the P/N ratio beta speeds up the rising transition but slows the falling one, so average tp has a minimum, which is not at the tr = tf point.

- **Device sizing** with S = W_p/W_p,min = W_n/W_n,min and a fixed load. The annotation derives it: R_eq = R/S and C_p = C·S, so

```latex
t_p = 0.69\,\frac{R}{S}\,(CS + C_L) = 0.69RC + 0.69\,\frac{R}{S}\,C_L
```

The plotted t_p falls from about 36 ps at S = 1 toward the asymptote **0.69RC** (about 20 ps on the plot). Past S ≈ 10 the gains are tiny: **intrinsic capacitances dominate** (self-loading), and a bigger driver also loads its own predecessor more. That is the hook for logical effort.

- **NMOS/PMOS ratio** β = W_p/W_n with N fixed:
    - t_pLH = 0.69·R_p(C_p + C_n), which falls as β rises (stronger pMOS)
    - t_pHL = 0.69·R_n(C_p + C_n), which rises as β rises (more C_D and C_G)
    - t_p = ½(t_pLH + t_pHL) has a minimum. On the slide it sits **left of the t_r = t_f point** (dashed line near β ≈ 2.4). Making P bigger raises C_D and C_G, slows the gate and **leaks more**.
- Textbook fact (added): the minimum-average-delay β ≈ √(μn/μp) ≈ 1.4, smaller than the β ≈ μn/μp ≈ 2 that equalizes rise and fall. This matches Lecture 4's "why not P/N = 1.5?" slide.

!!! core "Core idea"
    Sizing helps only the **load-dependent** part of delay. Equal rise and fall (β ≈ 2) is good for noise margins and duty cycle (clock trees). Minimum average delay prefers a smaller β (about 1.4–1.5).

### 3.6 Input-pattern dependence and transistor ordering

SLIDE2:l03_p09_b|NAND2 rising delay is 0.69 Rp/2 CL if both inputs fall but 0.69 Rp CL if only one falls, and falling delay is 0.69 2Rn CL.||l03_p10_t|Placing the late-arriving input on the transistor closest to the output means the internal node is already discharged when it switches.

**NAND2 (ignoring C_int at first):**

- **Low→high, both inputs go low**: two parallel pMOS → **0.69·(R_p/2)·C_L**
- **Low→high, one input goes low**: **0.69·R_p·C_L** (the worst case, used for sizing)
- **High→low, both inputs go high**: two series nMOS → **0.69·2R_n·C_L**

With C_int included, the falling delay also depends on **which** input switches last:

- **Transistor ordering**: if the late input In1 drives **M2 (top, near the output)** and In2 = 1 has already been high, C₁ is already discharged, so the delay is the time to discharge **C_L only**.
- If the late input drives **M1 (bottom)**, C₁ is charged (to about V_DD − V_T, see Lecture 2) and the delay must discharge **C_L and C₁**.
- **Rule: put the critical (latest-arriving) input on the transistor closest to the output.**

!!! why "Why it matters for std-cell / ROM work"
    Liberty files characterize **each input pin's arc separately**, and A and B of a NAND2 have different delays and pin caps for exactly this reason. Synthesis "pin swapping" puts the critical net on the faster pin (the one nearest the output). In dynamic gates and ROM stacks, the same internal-node charge causes **charge sharing** onto the precharged node.

### 3.7 Sizing gates to match the inverter, including complex gates

SLIDE2:l03_p10_b|Size each network so its worst-case path has the resistance of the reference inverter: NAND2 nMOS 2 and pMOS 2, NOR2 pMOS 4 and nMOS 1.||l03_p11_t|For OUT = NOT(D + A(B+C)) the series paths set the widths, and there are multiple valid pMOS sizings such as 4-8-8-4 or 3-6-6-6.

**Method**: the reference inverter is P = 2, N = 1, giving R in both directions. For every *path* from the output to a rail, make Σ R_i = R, sizing for the **worst case** (fewest devices on).

- **NAND2**: nMOS in series → 2, 2. pMOS in parallel → 2, 2 (one alone must give R).
- **NOR2**: pMOS in series → 4, 4. nMOS in parallel → 1, 1.
- With a **1:1 reference** (P = 1, N = 1): NAND2 is nMOS 2, 2 and pMOS 1, 1. NOR2 is pMOS 2, 2 and nMOS 1, 1. Both inputs see Cin = 3 versus 2 for the inverter (g = 3/2). The trade is a pull-up twice as slow as the pull-down for every gate in the library. (Discussion 1 asks "why size PMOS = 2 × NMOS?" and "what does 'size to match logical effort of the 2-1 inverter' mean?" This is the answer: equal worst-case R, which makes g = 4/3 for NAND2.)

**Complex gate OUT = ¬(D + A·(B + C))**:

- **nMOS**: D alone from OUT to GND → **1**. A in series with (B ∥ C) → A = **2**, B = **2**, C = **2** (worst case: only one of B and C on).
- **pMOS** (dual: D in series with [A ∥ (B series C)]). Two worst-case paths: D–A and D–B–C.
    - Slide answer (blue) **A = 4, B = 8, C = 8, D = 4**: D–A = R/2 + R/2 = R ✓. D–B–C = R/2 + R/4 + R/4 = R ✓.
    - Annotation (black) **A = 3, B = 6, C = 6, D = 6**: R_A = (2/3)R, R_D = R_B = R_C = (2/6)R = R/3, so D–A = R/3 + 2R/3 = R ✓ and D–B–C = 3·R/3 = R ✓.
    - Both meet the spec. 3-6-6-6 (total 21) puts less load on input **A** (3 vs 4) at the cost of more load on D (6 vs 8 for B and C, 6 vs 4 for D). **Sizing a complex gate is not unique.** Choose based on which input is critical and on total area/cap.

!!! eq "Equation card"
    For each rail-to-output path: Σ_i (R_unit / w_i) = R_ref.
    nMOS unit: w = 1 → R. pMOS unit: w = 2 → R.
    k devices in series, equal widths → each k × reference width.

### 3.8 Elmore delay and the NAND3 example

SLIDE2:l03_p11_b|Elmore delay sums, for each node, its capacitance times the total resistance from that node back to the source.||l03_p12_t|A unit NAND3 driving f identical gates has worst-case falling delay (10.5 + 5f)RC and pull-up delay (9 + 5f)RC by Elmore.

**Elmore delay** treats ON transistors as resistors and the network as an RC ladder:

```latex
t_{pd}\approx\sum_{i}R_{i\to source}\,C_i = R_1C_1 + (R_1+R_2)C_2 + \dots + (R_1+\dots+R_N)C_N
```

It applies to transistor stacks and, later, to interconnect. The annotation writes t₁ = 0.69C₁R₁, t₂ = 0.69C₂(R₁ + R₂) and so on (multiply the sum by 0.69 for a 50% delay).

**NAND3 example** (R = 13 kΩ/unit, C = 0.21 fF/unit). Sizing: pMOS **2** each, nMOS **3** each. Load: f copies of a NAND3, each input 2 + 3 = **5C**, so **5fC**. Output self-cap: 3 pMOS drains at 2C each + one nMOS drain 3C = **9C**. Internal nodes n2 and n1: **1.5C** each (uncontacted, ½·3C).

- **Worst-case pull-down** (all three nMOS, each R/3, with n1 and n2 to discharge):

```latex
t_{pd}=1.5C\cdot\frac{R}{3} + 1.5C\left(\frac{R}{3}+\frac{R}{3}\right) + (9+5f)C\left(\frac{R}{3}+\frac{R}{3}+\frac{R}{3}\right) = (10.5+5f)RC
```

- **Worst-case pull-up** (one pMOS of R): **(9 + 5f)RC** when only the output node is counted. The professor's annotation adds the terms for when the internal nodes also have to be charged up through the conducting upper nMOS (for example, bottom input low, top inputs high): the extra charge on n2 and n1 is seen through R + R/3 and R + 2R/3 respectively. My evaluation (added): + 1.5C·(4R/3) + 1.5C·(5R/3) = +4.5RC, giving about (13.5 + 5f)RC. Multiply by 0.69 for the 50% delay, as the annotation does.

!!! guard "Common trap"
    In the series stack, the node **nearest ground** sees only one R/3, and the **output** sees the full stack. Write each C with *its own* path resistance to the source. Also remember the factor 0.69 if you want a 50% delay rather than an Elmore "time constant".

### 3.9 Layout effects: output diffusion and fingers

SLIDE2:l03_p12_b|Two NAND2 stick layouts differ in whether the output sits on a shared middle pMOS diffusion or on two outer diffusions, which changes output capacitance.||l03_p13_t|Folding a wide transistor into two fingers shares the drain between them and reduces diffusion capacitance.

- **Layout comparison** (NAND2, order A–B): the left layout has **V_DD on the two outer p-diffusions and Y on the shared middle one**, so the output carries **one** contacted pMOS diffusion (≈ 2C for width 2 shared). The right layout has V_DD in the middle and **Y on both outer** diffusions, so two contacted diffusions on the output. **The left layout is better**: less output C means a smaller parasitic delay p. The nMOS side is the same in both (Y on one end of the series strip).
- **Multi-fingered transistors**: a wide device folded into 2 fingers (S–D–S) has the **drain shared** by both gates. Drain area and perimeter roughly halve, which gives less diffusion capacitance on the switching node. It also avoids odd aspect ratios (Discussion 3: wide transistors are fingered to fit the bit-slice pitch).

!!! why "Why it matters for std-cell / ROM work"
    Std-cell X2/X4 drive strengths are built as **fingers**, with the output on shared inner drains and the supplies on the outer sources. A larger drive cell therefore has lower R and **only modestly** higher p, close to the logical-effort ideal. For EM, wide output fingers spread current. For IR, outer source contacts tie directly to the rails.

### 3.x Check yourself

1. **Derive t_p = 0.69RC.** → For a step into RC, V_out = V_DD(1 − e^(−t/RC)). Set it equal to V_DD/2: e^(−t/RC) = ½, so t = RC·ln 2 ≈ 0.69RC.
2. **Estimate the FO1 delay of a 320/160 nm inverter in 130 nm.** → C_total = 0.42 + 0.21 (self) + 0.42 + 0.21 (load) = 1.26 fF. With R ≈ 10 kΩ, t_pd = 0.69 × 10 kΩ × 1.26 fF ≈ 8.7 ps.
3. **Why does doubling an inverter's width not halve its delay?** → t_p = 0.69RC_p + 0.69(R/S)C_L. The intrinsic term does not depend on S, and the larger input cap also slows the previous stage (self-loading).
4. **For a NAND2, which input should the critical signal drive, and why?** → The transistor nearest the output. Its internal node is already discharged by the earlier input, so only C_L has to be discharged.
5. **Size NAND3 and NOR3 to match a 2:1 inverter; give the worst-case R in each direction.** → NAND3: nMOS 3, 3, 3 and pMOS 2, 2, 2. NOR3: pMOS 6, 6, 6 and nMOS 1, 1, 1. All worst-case paths equal R.
6. **Write the Elmore delay for the NAND3 pull-down with internal nodes 1.5C and an output of (9 + 5f)C.** → (R/3)(1.5C) + (2R/3)(1.5C) + R(9 + 5f)C = (10.5 + 5f)RC.
7. **Two NAND2 layouts: output on the middle p-diffusion versus on both outer ones. Which is better?** → Middle (shared) output. It has one contacted diffusion on Y instead of two, so lower output cap and lower intrinsic delay.
8. **Why might a designer choose β ≈ 1.5 instead of 2?** → Average delay is minimized near √(μn/μp). A smaller pMOS cuts input cap and diffusion cap more than it slows the rising edge. β = 2 is kept where symmetric rise and fall matter (clocks, noise margins).


## Lecture 4 — Logical Effort

Logical effort turns the RC model of Lecture 3 into a back-of-the-envelope method for sizing and choosing topologies. It answers four questions quickly: how fast a gate is relative to an inverter (g, p), how to split a path's effort across stages (equal stage effort), how many stages to use (stage effort about 4, delay about log₄F FO4s), and how wide each gate should be (work backward from the load). The lecture ends with a real register-file decoder, sensitivity to the wrong number of stages or sizes, P/N ratio, limitations, and the measured τ and p_inv for the class's 130 nm process. Decoders, wordline drivers and clock buffers in a ROM or standard-cell library are all sized this way.

### 4.1 Delay of one gate: d = gh + p

SLIDE2:l04_p02_b|Gate delay in units of tau splits into effort delay f = gh and parasitic delay p.||l04_p03_t|On a delay-versus-fanout plot, g is the slope and p is the intercept, with the inverter as the reference g = p = 1.

```latex
d = \frac{t_p}{\tau} = f + p = g\,h + p,\qquad h=\frac{C_{out}}{C_{in}},\qquad \tau = 0.69\cdot 3RC
```

- **τ** is the process-independent unit: τ = 0.69·3RC, about **3 ps in 65 nm**, about **60 ps in 0.6 µm**, and about **9 ps in a typical 130 nm** process.
- **f = gh**: the effort delay (stage effort).
    - **g, logical effort**: how much worse the gate is than an inverter at delivering current per unit of input cap. g ≡ 1 for the inverter. It depends on **topology, not size**.
    - **h, electrical effort** = C_out/C_in (the "fanout").
- **p, parasitic delay**: the delay with no load, set by the gate's own output diffusion. It depends on **technology and gate type**, not size.

**Derivation from the annotations** (unit nMOS has R and C per width):

- **Inverter (2/1)**: C_in = 3C, self-cap 3C. t_p = 0.69R(3C + C_out), so d = t_p/(0.69R·3C) = 1 + C_out/3C = **1·h + 1** → g = 1, p = 1.
- **Inverter 2× (4/2)**: C_in = 6C, self 6C. t_p = 0.69(R/2)(6C + C_out), so d = 1 + C_out/6C = 1·h + 1. **Same g and p**: size-independent, as claimed.
- **NAND2 (pMOS 2, 2; nMOS 2, 2)**: C_in = 4C, output self-cap = 2 + 2 + 2 = 6C, pull-down R. t_p = 0.69R(6C + C_out), so d = (6C + C_out)/3C = 2 + (4/3)·h → **g = 4/3, p = 2**.

!!! core "Core idea"
    Delay is a straight line in h. The **slope is g** (topology cost) and the **intercept is p** (self-loading). Making a gate bigger slides you along the line (h changes); it never changes g or p.

### 4.2 Computing g and the g table

SLIDE2:l04_p03_b|Logical effort is the input capacitance of a gate divided by that of an inverter delivering the same output current, so inverter 3/3, NAND2 4/3, NOR2 5/3.||l04_p04_t|For a 2:1 reference, an n-input NAND has g = (n+2)/3 and an n-input NOR has g = (2n+1)/3.

**Definition**: g = C_in(gate) / C_in(inverter that delivers the same output current). Measure it from delay-versus-fanout plots, or estimate it by counting widths after sizing each gate for equal worst-case drive (Lecture 3 §3.7):

- Inverter 2/1 → C_in = 3 → **g = 3/3**
- NAND2: pMOS 2, nMOS 2 → C_in = 4 → **g = 4/3**
- NOR2: pMOS 4, nMOS 1 → C_in = 5 → **g = 5/3**

| inputs | 1 | 2 | 3 | 4 | 5 | n |
|---|---|---|---|---|---|---|
| Inverter | 1 | | | | | |
| NAND | | 4/3 | 5/3 | 6/3 | 7/3 | (n+2)/3 |
| NOR | | 5/3 | 7/3 | 9/3 | 11/3 | (2n+1)/3 |

**The same table with a 1:1 reference inverter** (P = 1, N = 1, C_in = 2, assuming μn/μp = 2). Size again for equal worst-case drive:

- NAND-n: nMOS width n, pMOS width 1 → g = (n+1)/2. NAND2 = 3/2.
- NOR-n: pMOS width n, nMOS width 1 → g = (n+1)/2. NOR2 = 3/2.
- General (added): reference γ:1 → g_NAND = (n+γ)/(1+γ), g_NOR = (1+nγ)/(1+γ). For γ = 1.5: NAND2 = 1.4, NOR2 = 1.6.
- With a 1:1 ratio NOR stops looking worse than NAND, but only because the reference itself has a pull-up twice as weak. Absolute rising delays are slower everywhere. Do not compare g values computed against different references.

!!! eq "Equation card"
    2:1 → g_INV = 1, g_NAND,n = (n+2)/3, g_NOR,n = (2n+1)/3, p_NAND = p_NOR = n (×p_inv).
    Memory trick: "**NAND adds n to 2, NOR adds 2n to 1, all over 3.**"

### 4.3 Parasitic delay and delay components

SLIDE2:l04_p04_b|Parasitic delay is estimated from output self-loading at equal drive: inverter 3/3 = 1, NAND2 6/3 = 2, NOR2 6/3 = 2.||l04_p05_b|Normalized delay versus electrical effort shows lines whose slope is g and intercept is p, for example a NAND3 at d = (5/3)h + 3.

- Count only the diffusion **on the output node** (internal nodes are ignored for simplicity):
    - Inverter: 2 + 1 = 3 → **p = 3/3 = 1**
    - NAND2: pMOS 2 + 2 on the output, plus the top nMOS 2 → 6 → **p = 2**
    - NOR2: the pMOS next to the output (4) + both parallel nMOS (1 + 1) → 6 → **p = 2**
- In general **p_NAND,n = p_NOR,n = n** (in units of p_inv).
- **Delay components plot**: the inverter line has d = h + 1. The **3-input NAND** has g = 5/3, p = 3, so **d = (5/3)h + 3**. The annotation reads g as the slope 5/(3·5C) per unit C_out: a bigger gate has a smaller slope against absolute C_out, but the same slope against h.

!!! guard "Common trap"
    p = n for NAND and NOR here is a simplification that ignores internal-node capacitance. Real p values in a measured library are larger, and the gates in the middle of a stack suffer more (see 4.11). Also, p_inv in a real process is not 1. The class measured **about 3.4** in 130 nm (4.12).

### 4.4 FO4 and a first multi-input example

SLIDE2:l04_p06_t|An inverter driving four copies of itself has h = 4, g = 1, p = 1, so the FO4 delay is 5 tau, roughly L/3 ps.||l04_p06_b|A gate with Cin = 1 driving three loads totaling 3 has h = 3, and as a NAND4 with g = 6/3 and p = 4 its delay is 10 tau.

- **FO4**: d = gh + p = 1·4 + 1 = **5τ**. Rule of thumb: **FO4 ≈ L/3 ps** with L in nm. **130 nm → 43 ps, 45 nm → 15 ps.**
- **More complex circuit**: the driving gate has C_in = 1 and drives three gates with C_in = 3/2 (g = 9/3), 1/2 (g = 1) and 1 (g = 6/3). C_out = 3/2 + 1/2 + 1 = 3, so h = 3. With g = 6/3 and p = 4 (annotation), **d = 2·3 + 4 = 10τ**.

!!! why "Why it matters for std-cell / ROM work"
    FO4 is the universal ruler. Cycle times ("20 FO4 per stage"), cell characterization sanity checks ("does my INVX1 FO4 match about L/3?"), and comparisons between processes are all quoted in FO4. A quick check during .lib review: τ ≈ FO4/5.

### 4.5 Path effort and branching

SLIDE2:l04_p07_b|With branching, part of the current goes off-path, so the product of stage efforts exceeds H and must include the branching effort b.||l04_p08_t|Path effort F = GBH is the product of stage efforts and depends only on topology, not on sizes or added inverters.

**Multistage**: for a chain C₁ → C₂ → C₃, h₁ = C₂/C₁ and h₂ = C₃/C₂, so H = C₃/C₁ = h₁h₂.

**Branching**: if stage 1 drives three identical gates (only one on the path), h₁ = 3C₂/C₁ and h₂ = C₃/C₂, so **h₁h₂ = 3H ≠ H**. Define

```latex
b_i = \frac{C_{on\text{-}path}+C_{off\text{-}path}}{C_{on\text{-}path}},\qquad b_1=\frac{C_2+2C_2}{C_2}=3,\ b_2 = 1,\qquad h_1h_2 = b_1b_2H = BH
```

**Path quantities**:

```latex
G=\prod g_i,\quad B=\prod b_i,\quad H=\frac{C_{out}}{C_{in}},\quad F = GBH = \prod g_i h_i = \prod f_i,\quad P=\sum p_i
```

- Annotation: F = Πf_i = Π(g_i h_i) = Πg_i·Πh_i = G·BH.
- **F does not change when inverters are added** (g = 1, b = 1) and **does not depend on sizes**, only on topology. (H is fixed by the specified input and load.)

!!! guard "Common trap"
    Forgetting **B** is the most common error in decoder problems. Each address line fans out to many decoder gates, but only one is on the path you are timing.

### 4.6 Minimum delay: equal stage effort

SLIDE2:l04_p08_b|Setting the derivative of total delay with respect to h1 to zero gives g1h1 = g2h2, so delay is minimal when stage efforts are equal.||l04_p09_t|For N stages the optimum stage effort is F to the 1/N, and the minimum path delay is N times F to the 1/N plus P.

Two stages: D = g₁h₁ + p₁ + g₂h₂ + p₂ with h₂ = H/h₁:

```latex
\frac{\partial D}{\partial h_1} = g_1 - g_2\frac{H}{h_1^2} = 0 \;\Rightarrow\; g_1h_1 = g_2h_2 \;\Rightarrow\; f_1=f_2
```

N stages:

```latex
\hat f = F^{1/N},\qquad \hat D = N F^{1/N} + P
```

!!! core "Core idea"
    **Equal effort per stage minimizes delay.** The total "effort budget" F is fixed by topology, so it is divided evenly.

### 4.7 Worked example: three NAND2s

SLIDE2:l04_p09_b|Three NAND2 stages from Cin = 4 to CL = 108 have F = 64, an optimal stage effort of 4 and a minimum delay of 18 tau.||l04_p10_b|Working backward from the load with Cin = g·Cout/f gives input caps 36, 12 and 4, and the last NAND2 uses transistors of width 18.

- G = (4/3)³ = **2.37**, B = 1, H = 108/4 = **27**, F = 2.37 × 27 ≈ **64**
- f̂ = 64^(1/3) ≈ **4**
- D̂ = 3·4 + 3·2 = 12 + 6 = **18τ** (each NAND2 has p = 2)
- **Sizing backward**: C_in,i = g_i·C_out,i/f̂
    - C_in,c = (4/3)(108)/4 = **36**
    - C_in,b = (4/3)(36)/4 = **12**
    - C_in,a = (4/3)(12)/4 = **4** ✓ (matches the input spec, which checks the work)
- **Transistor widths** for gate c: C_in = 36 split as pMOS 2 : nMOS 2 of 4 → each = (2/4)·36 = **18**. All four devices are 18.

!!! eq "Equation card"
    F = GBH → N̂ ≈ log₄F → f̂ = F^(1/N) → D̂ = N·f̂ + P → C_in,i = g_i·C_out,i/f̂ (go backward).
    Check: the first stage's C_in must come out equal to the spec.

### 4.8 Best number of stages

SLIDE2:l04_p11_t|Adding n2 inverters leaves F unchanged but adds parasitic delay, so the optimum number of stages is a balance that depends on technology.||l04_p11_b|With p_inv = 1 the best number of stages rises by one roughly every factor of 4 in path effort, and the best stage effort stays between about 2.4 and 4.4.

Adding n₂ inverters to n₁ stages of logic: N = n₁ + n₂, with G, B, H unchanged (F fixed), but P grows:

```latex
\hat D = N F^{1/N} + \sum_{i=1}^{n_1} p_i + n_2\,p_{inv}
```

Annotations: F = f̂^N → **N̂ = log₄F**, f̂_opt ≈ 4 (for p_inv = 1; the exact optimum is about 3.6, added). The p_inv = 1 table:

- F < 5.83 → 1 stage. 5.83–22.3 → 2. 22.3–82.2 → 3. 82.2–300 → 4. 300–1090 → 5. 1090–3920 → 6. 3920–14200 → 7.
- The best stage effort f stays in about **2.4–4.4** once N ≥ 2. Minimum delays at the boundaries: 6.8, 11.4, 16.0, 20.7, 25.3, 29.8, 34.4.

!!! why "Why it matters for std-cell / ROM work"
    A **wordline driver** for a ROM or SRAM row is a pure buffer-sizing problem. C_out is the whole wordline (cell gates plus wire), C_in is what the decoder can afford. N ≈ log₄(H·G) stages, each about 4× (or about 5× with realistic p_inv, see 4.12). The same applies to clock buffers and to the output drivers of large std-cells (BUFX16 etc.).

### 4.9 Real example: register-file decoder

SLIDE2:l04_p13_t|A 4-to-16 decoder for a 16-word by 32-bit register file drives 96 units of wordline capacitance from address inputs of 10 units each.||l04_p13_b|With H = 9.6, B = 8, G = 2, F = 153.6 the best design is 3 stages with stage effort 5.35, delay 22.1 tau, and sizes 10, 6.7 and 18.

**Spec**: 16 words × 32 bits. Each bit presents **3 unit transistors** of load to the wordline → C_out = 32 × 3 = **96**. True and complementary A[3:0] are available, each driven by an input driver of C_in = **10**.

- **Electrical effort**: H = 96/10 = **9.6**
- **Branching**: each address polarity goes to **8 of the 16** decoders (annotation: word[0] = ¬A3·¬A2·¬A1·¬A0, word[1] = ¬A3·¬A2·¬A1·A0, …), so **B = 8**
- **Logical effort**: a NAND4 has g = 6/3 = **2** (plus inverters at 1), so **G = 2**
- **F = GBH = 2 × 8 × 9.6 = 153.6** → log₄(153.6) ≈ 3.6 → **N = 3**
- f̂ = 153.6^(1/3) = **5.35**. D = 3·5.35 + P with P = 1 + 4 + 1 = 6 → **D = 22.1τ**
- **Sizing** (INV–NAND4–INV), backward:
    - output inverter: C_in = 96·1/5.35 = **18**
    - NAND4: C_in = 18·2/5.35 = **6.7**
    - input inverter: C_in = 6.7·1·**8**/5.35 = **10** ✓ (b = 8 is included because the inverter drives 8 NAND4s)

SLIDE2:l04_p14_t|A spreadsheet comparison of decoder topologies shows NAND2-INV-NAND2-INV is fastest at 19.7 tau and a single NOR4 is terrible at 234 tau.||l04_p14_b|Using more stages than optimal is less harmful than using fewer: delay is 1.51 times optimal at half the stages but only 1.26 times at double.

**Comparison** (N, G, P, D):

- NOR4: 1, 3, 4, **234**
- NAND4-INV: 2, 2, 5, 29.8
- NAND2-NOR2: 2, 20/9, 4, 30.1
- **INV-NAND4-INV: 3, 2, 6, 22.1** (the design above)
- NAND4-INV-INV-INV: 4, 2, 7, 21.1
- NAND2-NOR2-INV-INV: 4, 20/9, 6, 20.5
- **NAND2-INV-NAND2-INV: 4, 16/9, 6, 19.7** (best)
- INV-NAND2-INV-NAND2-INV: 5, 16/9, 7, 20.4
- NAND2-INV-NAND2-INV-INV-INV: 6, 16/9, 8, 21.6

Lessons: splitting a NAND4 into a tree of NAND2s lowers G (16/9 < 2). Four stages beats three because F ≈ 153 is close to the 3/4-stage boundary. A single NOR4 driving the whole load is a disaster.

**Wrong number of stages**: D(N)/D(N̂) is **1.51 at N/N̂ = 0.5** but only **1.26 at N/N̂ = 2**. **Too many stages is "less worse"** than too few.

!!! why "Why it matters for std-cell / ROM work"
    ROM and SRAM **row decoders** are built exactly like this: **predecode** (NAND2/NAND3 on address pairs or triples, which lowers G and B) followed by a final NAND/NOR per row and a wordline driver chain. The decoder's B and the wordline's H dominate the sizing. In a NOR ROM the wordline load is the cell gates along the row. In a contact/via-programmed ROM it is usually the same for every row regardless of data.

### 4.10 Sensitivity: wrong sizes and P/N ratio

SLIDE2:l04_p15_t|Sizing a single gate wrong by 1.5x or 0.67x costs only about 4 percent of delay, and even 2x or 0.5x costs about 13 percent.||l04_p15_b|P/N = 2 balances noise margins and slopes, but P/N = 1.5 lowers input capacitance and can give a faster average delay.

- **Wrong gate size**: the penalty is **symmetric** in log of the size ratio. **1.044 at s = 0.67 or 1.5**, **1.133 at s = 0.5 or 2**. Delay is **weakly sensitive** to sizing, so round to available drive strengths without worrying much.
- **P/N ratio**: why P/N = 2? Balanced **noise margins** and about **equal rise and fall slopes**. Why consider **P/N = 1.5**? Each stage's input cap drops (2.5 vs 3 units). The rising edge is slower (arrow up on the pMOS) but the falling edge is faster (smaller load on the driving nMOS). Averaged over rise and fall, delay is lower, which matches the β analysis in Lecture 3 §3.5.

!!! core "Core idea"
    Logical-effort optima are **flat**. Being within ±50% of the ideal size, or one stage off on the "more stages" side, costs only a few percent. Effort should go into topology (G, B, P), not into perfect fractional sizes.

### 4.11 Limitations, and τ and p_inv measured in 130 nm

SLIDE2:l04_p16_t|Internal-node capacitance and body effect make the bottom and middle inputs of a stack slower, which the simple logical-effort model ignores.||l04_p19_t|Measured in the class's 130 nm process, tau is about 6.3 ps and p_inv about 3.4 at nominal, with clear spread across fast and slow corners.

**Limitations**:

- **Internal-node capacitance**: in a series stack, the internal nodes must be discharged too (plot: the internal node bumps when the top input switches). Inputs near the rail are slower. **Body effect** raises V_T of the upper stacked devices.
- **Chicken and egg**: G needs the path, but the number of stages is unknown without G. Iterate.
- **Simplistic delay model**: neglects input rise and fall time effects.
- **Interconnect**: wires add fixed C, so iteration is needed.
- **Maximum speed only**: it gives no minimum area/power for a delay constraint. Sizing tools such as **TILOS** (start minimum, find the critical path, upsize the transistor with the best sensitivity, repeat) aim to make all paths equal in length. The optimized path-delay distribution piles up at the max delay, so **process variation hurts the optimized design more** (Area–Delay slide).

**Measured 130 nm values** (homework: characterize INV, NAND2/3/4, NOR2/3/4):

- Average **τ** (nominal / fast / slow): 320/160: **6.26 / 5.74 / 6.98 ps**. 560/280: 6.31 / 5.66 / 7.14. 1120/560: 6.37 / 5.55 / 7.14.
- Average **p_inv**: 320/160: **3.46 / 2.64 / 4.24**. 560/280: 3.27 / 2.86 / 3.75. 1120/560: 3.42 / 2.77 / 3.93.
- So FO4 ≈ (4 + 3.4)·6.3 ≈ 47 ps, consistent with the L/3 ≈ 43 ps rule.
- **Best number of stages with p_inv = 3.38**: boundaries F = 9.57, 54.4, 294, 1563, 8246, 43327 for N = 1…6 (D̂ = 12.9, 21.5, 30.1, 38.7, 47.3, 55.8). The optimal stage effort rises to about **4–6** (for example 3.79–6.65 at N = 3). **With realistic parasitics, use fewer and larger stages**, an effort of about 5–6 instead of 4.

!!! why "Why it matters for std-cell / ROM work"
    This homework *is* library characterization in miniature: fit d = gh + p to measured delay versus fanout for each cell, at each corner. A .lib NLDM table is the same data with input slew added as a second axis, which removes the "neglects input rise time" limitation. In a ROM, the bitline (a wide dynamic NOR) is the extreme case of the internal-node/parasitic limitation. Its p is huge, n·C_diff from every cell on the bitline, so it is handled by precharge, a keeper and a sense amp, not by logical effort.

### 4.x Check yourself

1. **Derive g and p for a NAND2 sized 2/2 from t_p = 0.69R(C_self + C_out).** → C_in = 4C, C_self = 6C. d = (6C + C_out)/(3C) = 2 + (4/3)h, so g = 4/3 and p = 2.
2. **What is the FO4 delay in τ, and roughly in ps at 130 nm?** → 5τ, about L/3 ≈ 43 ps (measured: about 7.4 × 6.3 ≈ 47 ps with p_inv ≈ 3.4).
3. **A path has G = 2, B = 8, H = 9.6. How many stages, what stage effort and what delay?** → F = 153.6, N = 3, f̂ = 5.35, D = 3·5.35 + P (= 6 for INV-NAND4-INV) = 22.1τ.
4. **Three NAND2s, C_in = 4, C_L = 108: give the sizes.** → F = 64, f̂ = 4, input caps 4 → 12 → 36. The last gate's transistors are 18 each. D = 18τ.
5. **NAND2 and NOR2 logical effort with a 2:1 reference versus a 1:1 reference?** → 2:1: 4/3 and 5/3. 1:1: both 3/2 (NAND2 nMOS 2, pMOS 1; NOR2 pMOS 2, nMOS 1).
6. **You are unsure between 3 and 4 stages. Which error is cheaper?** → Too many. At N/N̂ = 2 the penalty is 1.26, versus 1.51 at N/N̂ = 0.5, and near the boundary the difference is a few percent.
7. **Why is the branching effort 8 in the 4:16 decoder?** → Each true or complement address line drives 8 of the 16 NAND4 decoders (half the words have that bit equal to 0), but only one is on the timed path.
8. **Why is the best stage effort larger than 4 in the measured 130 nm process?** → p_inv ≈ 3.4, not 1. Each extra stage costs more parasitic delay, so the optimum shifts to fewer, higher-effort stages (f ≈ 5–6).


## Lecture 5 — Adders

Addition is the canonical datapath problem: every bit is easy, but the carry has to travel across the whole word. This lecture builds up from the single-bit full adder (PGK, the 28T static adder, the 24T mirror adder) to word-level architectures (ripple, carry-bypass, carry-select) and finally to parallel-prefix trees (Kogge-Stone, Brent-Kung, Sklansky, Han-Carlson, Ladner-Fischer, sparse trees). For a circuit designer the lesson is twofold: optimize the cell that sits on the critical path (the carry gate, its input ordering and its node capacitance), and pick an architecture by trading logic levels, fanout and wiring.

### 5.1 Single-bit addition and PGK

SLIDE2:l05_p01_b|A full adder is S = A⊕B⊕C and Cout = MAJ(A,B,C); the truth table splits into kill, propagate and generate rows.||l05_p02_t|Generate, propagate and kill describe what a bit does to the incoming carry, using only A and B.

A **half adder** is just an AND (carry) and an XOR (sum). A **full adder** adds a third input (the carry-in), producing

- **S = A ⊕ B ⊕ C**
- **Cout = MAJ(A, B, C) = AB + AC + BC**

The instructor's annotation on the truth table rewrites the sum in a form that reuses the carry: **S = ABC + (A + B + C)·¬Cout**. This is exactly how the 28-transistor static adder is built (5.2): compute ¬Cout first, then use it inside the sum gate.

The key abstraction is **PGK**, defined from A and B only (independent of the carry-in):

- **Generate**: Cout = 1 regardless of Cin → **G = A·B**
- **Propagate**: Cout = Cin → **P = A ⊕ B**
- **Kill**: Cout = 0 regardless of Cin → **K = ¬A·¬B**

On the truth table the rows group neatly: AB = 00 is K, AB = 01/10 is P, AB = 11 is G.

SLIDE:l05_p02_b|Carry and sum can be written as Co = G + P·Ci and S = P⊕Ci, and P = A+B works for the carry but not the sum.

```latex
C_o(G,P) = G + P\,C_i \qquad S(G,P) = P \oplus C_i
```

The slide asks "which P is preferred, A + B or A ⊕ B?" The instructor's annotation proves that the OR version also gives the right carry:

```latex
G + (A+B)C_i = G + (AB + A\oplus B)C_i = G + G C_i + P C_i = G(1+C_i) + P C_i = G + P C_i
```

So **P = A + B** (sometimes called "transmit" T) is valid for the **carry** because the overlap case (A = B = 1) is already covered by G. But the **sum** needs the true XOR: S = (A⊕B)⊕Ci. Interviewers like this question: OR is cheaper and faster than XOR, so carry logic often uses A + B while the sum path keeps the XOR.

!!! core "Core idea"
    PGK turns addition into a carry-propagation problem: Ci+1 = Gi + Pi·Ci. Everything in this lecture is a way to evaluate that recurrence faster.

!!! guard "Common trap"
    P = A + B is fine for carries (and for the carry-bypass "all propagate" test only if you are careful — see 5.4, where the slide insists on XOR). It is never fine for the sum.

### 5.2 Static CMOS full adder and the inversion property

SLIDE2:l05_p03_t|The 28-transistor static adder computes ¬Cout first and then reuses it to build the sum.||l05_p03_b|Inverting all inputs inverts both outputs, so a ripple chain can alternate true and complemented bits and drop inverters.

The **28T static CMOS full adder** is two complex gates plus two inverters:

- Carry stage: ¬Cout = complement of MAJ(A,B,Ci). The dashed boxes on the slide highlight the parallel A‖B pull-down (a P-like term) and the series A–B branch (G). The note "connection not needed" points out that the series PMOS stack's internal node does not need the cross-connection.
- Sum stage: ¬S = complement of (ABCi + (A+B+Ci)·¬Cout), then inverted.
- Weakness: the carry passes through an extra inverter in every bit, PMOS stacks are tall (up to 3 series), and Cout drives a large load (the sum gate and the next bit).

The annotation sketches the block view: the carry gate C feeds the sum gate S, and the carry output goes through an inverter before the next bit — that inverter is the target of the next optimization.

**Inversion property**: a full adder is self-dual.

```latex
\bar S(A,B,C_i) = S(\bar A,\bar B,\bar C_i) \qquad \bar C_o(A,B,C_i) = C_o(\bar A,\bar B,\bar C_i)
```

So in a ripple chain you can feed odd bits with inverted operands and pass the inverted carry directly, eliminating the carry inverter in every stage (only the A, B inputs and S outputs of alternate cells get inverted — and those are off the critical path).

### 5.3 The mirror adder

SLIDE2:l05_p04_t|The 24-transistor mirror adder uses symmetric NMOS and PMOS networks, with Ci transistors placed closest to the output.||l05_p04_b|Layout rules for the mirror adder focus on minimizing capacitance at the carry node Co.

The **mirror adder** (24 transistors) replaces the dual-network carry gate with one whose pull-up and pull-down are **identical (mirror) topologies**, which works because the carry function is self-dual. Read the carry stage (red) as three parts:

- **Kill**: series A–B PMOS pulls ¬Co high (both inputs 0 → kill → Cout = 0, so ¬Co = 1).
- **Generate**: series A–B NMOS pulls ¬Co low.
- **"0"-propagate / "1"-propagate**: the A‖B parallel pair in series with the Ci transistor passes the carry.

Facts from the slide:

- NMOS and PMOS chains are **completely symmetrical**; at most **two series transistors** in carry generation.
- The most critical layout issue is **capacitance at node Co**. It is made of **4 diffusion capacitances, 2 internal gate capacitances, and 6 gate capacitances in the connecting adder cell**.
- **Transistors connected to Ci are placed closest to the output** — the late-arriving input goes nearest the output so the internal nodes are already charged/discharged when it arrives (the same input-ordering rule as in logical effort).
- **Only the carry-stage transistors need to be optimized** for speed; the whole sum stage can be **minimum size** ("Min. size" bracket on the schematic).

The annotation sketches the chain of mirror adders: each bit is C → S with the carry passing as ¬Co, using the inversion property so no inverter appears in the carry path.

!!! eq "Equation card"
    Co = G + P·Ci ; S = P ⊕ Ci ; S = ABCi + (A+B+Ci)·¬Co.
    Memory trick: "carry first, sum reuses carry" — both the 28T and the 24T mirror adder build ¬Co first.

!!! why "Why it matters for std-cell / ROM work"
    A full-adder cell (FA, ADDF) is a standard-cell library staple. Its .lib arcs are asymmetric: the CI→CO arc is the one synthesis uses on the carry chain, so the cell is sized and pin-ordered (CI nearest the output) for that arc, while A/B→S arcs can be slow. The "minimize the Co node" rule is the same discipline you use on any cell's internal high-fanout node.

### 5.4 Ripple-carry adder and carry-bypass

SLIDE2:l05_p05_t|Ripple carry delay grows linearly with the number of bits, so the goal is the fastest possible carry cell.||l05_p05_b|Using P and G, the ripple adder splits into a setup stage, a carry chain of AND-OR cells, and a sum XOR.

**Ripple-carry adder**: N full adders chained; worst case is a carry generated at bit 0 that propagates to bit N−1.

```latex
t_{adder} = (N-1)\,t_{carry} + t_{sum}, \qquad t_p = O(N)
```

Rewriting with P and G gives a three-part structure:

- **Setup**: compute Gi, Pi for all bits in parallel.
- **Carry chain**: Ci:0 = Gi + Pi·Ci−1:0 with G0:0 = Cin, P0:0 = 0, so Cout,i = Gi:0.
- **Sum**: Si = Pi ⊕ Ci−1:0.

```latex
t_{adder} = t_{setup} + (N-1)\,t_{carry} + \max(t_{carry}, t_{sum})
```

The instructor's annotation unrolls the group signals: G1:0 = G1 + P1G0, P1:0 = P1P0, G2:0 = G2 + P2G1:0, G3:0 = G3 + P3G2:0 … and Cout = G1 + P1Cin. This is the prefix-operator view that 5.6 generalizes.

The Discussion 4 review (CAD4 ALU) also mentions the **Manchester carry chain**: pass-transistor carry propagation through a chain of P-controlled switches with G/K pull-downs — small and regular, but the chain is an RC ladder, so long chains must be broken with buffers.

SLIDE2:l05_p06_t|Carry-bypass skips a block when all its bits propagate, selecting Cin directly via a mux.||l05_p06_b|The bypass critical path ripples through the first block, bypasses the middle blocks, and ripples through the last block.

**Carry-bypass (carry-skip) adder**: group bits into blocks of M. If every bit in the block propagates (BP = P0P1P2P3 = 1), then the block's carry-out equals its carry-in, so a mux can skip the ripple. Otherwise the block either kills or generates internally, and its carry-out does not depend on Cin anyway.

- The block propagate must use **P = A ⊕ B, not OR** (slide: "Must be XOR not OR"). With OR, A = B = 1 would set P = 1 and wrongly let the bypass select Cin when the block actually generates. (The annotation "P = A + B = AB + A⊕B = G + P" is the reason: OR includes G.)
- Critical path (N bits, block size M):

```latex
t_{adder} = t_{setup} + M\,t_{carry} + (N/M - 1)\,t_{bypass} + (M-1)\,t_{carry} + t_{sum}
```

- The annotated example (M = 4, N = 16) walks a carry generated in the first block: ripple through block 0 (labelled "make fast"), bypass blocks 1 and 2 ("need not be fast"), then ripple through the last block to the sum. The worst case is G in bit 0, P everywhere in the middle, and a ripple in the last block.

SLIDE:l05_p07_b|The carry-select adder precomputes both possible block carries and a multiplexer picks the right one when the real carry arrives.

The ripple-vs-bypass plot (slide 13) shows that bypass only wins beyond roughly **4–8 bits** — for short words the extra mux overhead dominates.

### 5.5 Carry-select adders

SLIDE2:l05_p08_t|In a linear carry-select adder the critical path is one block ripple plus one mux per block.||l05_p09_t|Square-root carry select grows block sizes by one so each block's carries are ready just as the incoming carry arrives.

**Carry-select**: each block computes its carries twice, once assuming Cin = 0 and once assuming Cin = 1, then a mux selects. Block results are ready in parallel, so only the mux chain is serial.

```latex
t_{adder} = t_{setup} + M\,t_{carry} + (N/M)\,t_{mux} + t_{sum}
```

The annotation marks this as O(N/M). The slide notes the block sums "can be pre-computed when muxes fire".

**Square-root carry select**: with equal block sizes, later blocks finish their 0/1 carries long before the incoming carry arrives — wasted slack. Make block sizes grow (2, 3, 4, 5, …) so each block's internal carries finish exactly when the mux select arrives. The instructor's derivation:

```latex
N = 2 + 3 + 4 + \dots + n = \frac{(2+n)(n-1)}{2} \approx \frac{n^2}{2} \;\Rightarrow\; n \approx \sqrt{2N}
```

```latex
t_{adder} = t_{setup} + 2\,t_{carry} + \sqrt{2N}\,t_{mux} + t_{sum} \quad = O(\sqrt{N})
```

SLIDE:l05_p09_b|Ripple is linear, linear-select grows in steps, and square-root select grows slowest with word length.

The comparison plot (tp in unit delays vs N up to 60): ripple climbs linearly to roughly 45 unit delays by N ≈ 50, linear select reaches roughly 20 by N = 60, and square-root select stays lowest (low teens at N = 60) — values read off the plot.

!!! core "Core idea"
    Ripple O(N), carry-select O(N/M), square-root select O(√N), prefix trees O(log N). Each step spends area/power to remove serial dependence.

!!! guard "Common trap"
    In the bypass adder, a block whose bits are not all propagating is not "slow" — its carry-out is determined internally. The worst case is a carry born in the first block and dying in the last.

### 5.6 Parallel-prefix (PG) trees

SLIDE2:l05_p10_b|Black cells combine group generate and propagate, gray cells compute only generate, and buffers just pass signals.||l05_p11_t|The ripple adder drawn as a PG diagram is a serial chain of N−1 gray cells.

**Prefix notation** Gi:j, Pi:j = group generate/propagate over bits i…j. Combining two adjacent groups (i:k and k−1:j):

```latex
G_{i:j} = G_{i:k} + P_{i:k}\,G_{k-1:j} \qquad P_{i:j} = P_{i:k}\,P_{k-1:j}
```

- **Black cell**: computes both G and P (AOI + AND).
- **Gray cell**: computes only G (used when the group reaches bit 0, since Pi:0 is never needed again — Gi:0 is the carry).
- **Buffer**: just repeats G and P to reduce loading.

The carry-ripple PG diagram is the degenerate tree: N−1 gray cells in series, delay growing down the diagonal. The goal of a tree is all Gi:0 in O(log N) levels.

SLIDE2:l05_p11_b|Kogge-Stone reaches every group G in log2N levels with fanout of 2, at the cost of many long wires.||l05_p12_t|Brent-Kung uses a forward tree and a backward tree, giving low fanout and few wires but 2log2(n)−1 levels.

**Kogge-Stone** (16 bits shown): log2N levels (spans 2, 4, 8), every cell has fanout 2. The instructor's annotations trace how (3:0) = (3:2)(1:0) and (5:2) = (5:4)(3:2); (15:0) is built as (15:8)+(7:0), which itself decomposes all the way down to pairs.

- **Brent-Kung**: one forward (reduction) tree plus one backward (distribution) tree; **2·log2(n) − 1** logic levels, minimal wiring, fanout ≈ 2. Annotation: (14:0) = (14:8)(7:0), and (14:8) = (14:12)(11:8) etc. — the backward tree fills in the "odd" groups.
SLIDE2:l05_p12_b|Sklansky reaches log2(n) levels with few wires but fanout that doubles each level and uneven sizing.||l05_p13_t|Every prefix tree trades logic levels, fanout and wiring, and the three corners are Kogge-Stone, Brent-Kung and Sklansky.

- **Sklansky** (divide-and-conquer): **log2(n)** levels and few wires, but **large fanout** (a node like 7:0 drives 8 cells at the last level) and **uneven sizing** (slide example: (10:8) + (7:0)).

SLIDE2:l05_p13_b|Han-Carlson does Kogge-Stone on every other bit and one ripple stage at the end, halving wiring.||l05_p14_t|Knowles halves Kogge-Stone wiring by letting neighbors share overlapping groups, at the cost of more fanout.

**Tree classification** — three axes, and fanout and wiring both cost **power**:

- **Kogge-Stone**: low logic levels, low fanout, **high wiring**.
- **Brent-Kung**: low fanout, low wiring, **high logic levels**.
- **Sklansky**: low logic levels, low wiring, **high fanout**.

Hybrids sit in between:

- **Han-Carlson**: Kogge-Stone on odd bits, then one extra ripple stage → **log2(n) + 1** levels. "Reduces wire length by half → half power compared to Kogge-Stone."
- **Knowles**: Kogge-Stone with doubled-up fanout in late stages; "half the wires by overlapping neighbors → more fanout". Annotation: (15:0) = (15:8)(7:0); (14:0) = (14:7)(7:0) — overlapping ranges are fine because G is idempotent (OR).

SLIDE2:l05_p14_b|Ladner-Fischer mixes Brent-Kung, Sklansky and Han-Carlson layers to trade logic levels against fanout with low wiring.||l05_p15_t|A higher-radix cell merges four groups at once, G = G3 + P3(G2 + P2(G1 + P1G0)).

**Ladner-Fischer**: rows labelled B&K, Sklansky, Han-Carlson — the point is that the families form a continuum (this is Harris's prefix-adder taxonomy, added), and you can pick any blend.

**Higher radix**: combine r groups per cell instead of 2.

```latex
G = G_3 + P_3\,(G_2 + P_2\,(G_1 + P_1 G_0))
```

Radix-3 Kogge-Stone has N = log3(n) levels: **fewer logic levels, but each stage has more delay** (taller stacks / bigger AOIs).

SLIDE:l05_p16_t|Sparse trees compute only every s-th carry and use carry-select blocks to finish the sums.

**Sparse tree adders** combine a prefix tree with carry-select:

- Build a **sparse PG tree** that only computes carries into short groups (s = 2, 4, 8 or 16 bits).
- Use **pairs of s-bit adders** to precompute the sums for Cin = 0 and Cin = 1.
- A **mux** picks the correct sum based on the group carry from the tree.
- Example on the slide: Intel 32-bit radix-2 Sklansky sparse tree adder with s = 4 (2003). A radix-3 Kogge-Stone sparse tree with s = 3 is also shown.
- Benefits: **small number of logic levels, lower gate count and power**; widely used in high-performance 32–64-bit high-radix adders.

!!! eq "Equation card"
    Prefix op: (G,P)i:j = (Gi:k + Pi:k·Gk−1:j , Pi:k·Pk−1:j).
    Levels: Kogge-Stone log2N; Sklansky log2N; Brent-Kung 2log2N − 1; Han-Carlson log2N + 1.
    Trick: "KS = wires, BK = levels, Sk = fanout."

!!! why "Why it matters for std-cell / ROM work"
    Prefix trees are built from AOI21/OAI21 (gray/black cells) and buffers — exactly the complex gates a standard-cell library must make fast and dense. Kogge-Stone's wiring problem is why router congestion, not gate delay, often limits adders after synthesis; Sklansky's fanout is why you see buffer insertion on the "7:0" net. In a ROM/RF the address decoder has the same structure question (predecode tree fanout vs levels).

### 5.x Check yourself

1. **Why can P = A + B be used for carry computation but not for the sum?** — G + (A+B)Ci = G + (G + A⊕B)Ci = G + PCi, so the extra A = B = 1 case is absorbed by G. The sum needs (A⊕B)⊕Ci; OR would give the wrong sum when A = B = 1.
2. **In a carry-bypass adder, why must the block-propagate use XOR?** — With OR, a block with A = B = 1 in some bit would claim "propagate" and the mux would pass Cin, but that bit actually generates; the carry-out would be wrong when Cin = 0.
3. **What is on the mirror adder's critical node and how is it minimized?** — Node Co: 4 diffusion caps, 2 internal gate caps and 6 gate caps of the next cell. Keep Ci transistors closest to the output, size only the carry stage, keep the sum stage minimum size.
4. **Write the critical-path delay of a linear carry-select adder and a square-root carry-select adder.** — t = tsetup + M·tcarry + (N/M)·tmux + tsum; square root: t = tsetup + 2tcarry + √(2N)·tmux + tsum, from N ≈ n²/2.
5. **Rank Kogge-Stone, Brent-Kung and Sklansky on logic levels, fanout and wiring.** — KS: low levels, low fanout, high wiring. BK: high levels (2log2N − 1), low fanout, low wiring. Sklansky: low levels, low wiring, high fanout.
6. **How does the inversion property speed up a ripple adder?** — S and Co of inverted inputs are the inverted outputs, so alternate cells take inverted A, B and ¬C, and the carry inverter is removed from every stage of the chain.
7. **What is a sparse tree adder?** — A prefix tree that only computes every s-th carry, plus pairs of s-bit adders (Cin = 0/1) and a mux per group; fewer cells and wires, used in 32–64-bit high-performance adders.
8. **(Discussion 4) How does the ALU compute SUB/CMP with an adder, and how is overflow detected?** — A + ¬B + 1 (carry-in = 1). Overflow F = Cn ⊕ Cn−1; zero Z = NOR of all result bits; negative N = Cn ⊕ Cn−1 ⊕ Sn−1 for signed results.


## Lecture 6 — Static Logic Families

Complementary static CMOS is the default for good reasons, but it is neither the fastest nor the smallest way to build logic. This lecture walks through the alternatives the course considers: pulse-static (skewed) CMOS, differential cascode voltage switch (DCVS), cascode non-threshold logic (CNTL), pass-gate and transmission-gate logic with level restoration (LEAP), complementary pass-gate logic (CPL), and output prediction logic (OPL). Each one buys speed, area or power by giving up something static CMOS gives for free — ratioless operation, full swing, noise margin, or freedom from timing constraints — and recognizing that trade is exactly what an interviewer probes.

### 6.1 Classic static CMOS

SLIDE:l06_p02_t|Static CMOS is ratioless, full-swing and nearly zero static power, which is why it is the default.

**Advantages** (slide 3):

- **Non-ratioed** — output levels do not depend on device sizes; sizing only affects speed.
- **~0 static power** (ideally; leakage aside).
- **Low short-circuit power**, about **10% of dynamic power**.
- **Full rail swing** and **good noise margins**.
- **True and complement functions** available (with an inverter).

**Disadvantages** (slide 4):

- **Large number of transistors / large area** — 2 per input, plus every gate needs a PUN that duplicates the PDN.
- **Slow**: the PMOS network suffers from lower **mobility** (so PMOS must be ~2× wider), and each input sees **transistor capacitance from the dual function** (it drives both an NMOS and a PMOS gate).
- **Increasing static power due to leakage** as technology scales.
- The slide's triangle: **noise margin ↔ speed ↔ power** — every family below moves along one of these edges.

!!! core "Core idea"
    Every non-CMOS family removes some of the PMOS network (to cut input capacitance and area) and pays with ratioed behavior, reduced swing, clocking, or noise sensitivity.

### 6.2 Pulse static CMOS (PS-CMOS) and skewed gates

SLIDE2:l06_p03_t|A pulse-static path is reset to a known state by a clock and then evaluates with only one transition per gate.||l06_p04_b|Because each gate in evaluation only switches one way, its P/N ratio can be skewed to speed that edge.

**PS-CMOS idea**: a latch feeds a first gate that is forced by Φ/Φ̄ into a known **reset** state; the reset ripples down a chain of static gates, so every node in the path sits at a known value. During **evaluate**, each node can switch at most **once, in a known direction**. Labels on the slide: H/↓ (node resets High, evaluates falling), L/↑ (resets Low, evaluates rising).

- Slide 6 annotation: **all inputs to a gate must reset to the same state**, and **off-path inputs must be set up correctly**, otherwise the reset does not propagate cleanly (e.g. a NAND whose other input is 0 blocks the reset wave).
- The instructor's sketch splits the cycle into an eval block (on Φ) and a reset block (on Φ̄), both in one clock period.

**Skewing**: since only one edge matters in evaluate, gates are sized to favor it. A gate whose **input falls** (output rises) gets **P/N > 2** (HI-skew); a gate whose input rises gets **P/N < 2** (LO-skew). The slide labels P/N > 1, < 1, > 1 alternating; the annotation corrects the threshold to 2 (unskewed CMOS uses P/N = 2).

The instructor works out the **logical effort of skewed inverters** against the unskewed 2:1 reference:

- **HI-skew inverter, P = 3, N = 1** (Cin = 4). Pull-down: the reference with the same pull-down strength (N = 1) is 2/1 with Cin = 3 → **g_d = 4/3 > 1**. Pull-up: the reference with the same pull-up (P = 3) is 3/1.5 with Cin = 4.5 → **g_u = 4/4.5 = 8/9 < 1**.
- **LO-skew inverter, P = 1, N = 1** (Cin = 2). Pull-down vs 2/1 (Cin = 3) → **g_d = 2/3**. Pull-up vs 1/0.5 (Cin = 1.5) → **g_u = 2/1.5 = 4/3**.

The favored edge gets g < 1; the other edge gets g > 1. The sketched VTC shows the switching threshold moving with skew.

**How far can we skew?** Limited by **noise margin** (the switching threshold moves toward one rail) and by the **reset path** (the slow edge is the reset edge, and reset must still finish within its phase).

```latex
g_u = \frac{C_{in}}{C_{in,\,\mathrm{ref}}\big|_{\text{same pull-up}}} \qquad g_d = \frac{C_{in}}{C_{in,\,\mathrm{ref}}\big|_{\text{same pull-down}}}
```

SLIDE2:l06_p05_t|PS-CMOS is fast through skewing, has no delay dependence on history, and does not glitch in evaluation.||l06_p05_b|PS-CMOS cannot make arbitrary connections, burns more power, and has worse noise margin from skewed ratios.

- **Advantages**: faster due to P/N skewing (but the **reset must still be fast enough** — unlike dynamic precharge, reset has to *propagate* through the chain); **no delay dependence on previous state**; **no glitching in evaluation** when balanced, but more transitions overall (every node resets every cycle).
- **Disadvantages**: **cannot make arbitrary connections** (off-path inputs and reset polarity must line up); **high power** (activity factor ~1 because of reset); **worse noise margin** due to skewed P/N.

!!! why "Why it matters for std-cell / ROM work"
    HI-skew and LO-skew inverters and buffers are real library cells, used exactly where one edge is critical — e.g. the inverter after a precharged ROM bitline or domino node, which only needs a fast rising output. Their .lib has very different rise/fall arcs; characterization must cover both, and the slow edge sets the reset/precharge budget.

### 6.3 Differential cascode voltage switch (DCVS)

SLIDE2:l06_p06_t|DCVS uses complementary NMOS pull-down trees with a cross-coupled PMOS pair as the load.||l06_p08_t|In DCVS the side pulled down by the NMOS tree moves first, then the cross-coupled PMOS pulls the other side up.

**DCVS** (DCVSL): two NMOS trees implementing f and ¬f, each pulling down one output; a **cross-coupled PMOS pair** restores the other output high. Shown: left tree A–B in series (pulls ¬(A·B) low when AB = 1); right tree Ā ‖ B̄ (pulls A·B low otherwise). The slide's comment: it replaces the complementary **PMOS stack with NMOS**.

Switching sequence (slides 12–15, A: 0→1 with B = 1):

1. Initially A·B node = 0, ¬(A·B) node = 1.
2. A rises: the left tree starts conducting and **fights the PMOS that is on** (annotation: the left node droops from VDD). This is a **ratioed fight** — the NMOS tree must win.
3. Once the left node falls far enough, the right PMOS turns on and pulls A·B high, which turns off the left PMOS and completes the transition.

**Which output switches first?** The **falling** output (¬Q here), since the rising side waits for the falling side to turn on its PMOS. Output timing is therefore asymmetric, and there is a **crow-bar current** spike during the fight (the current plot on slide 16).

SLIDE2:l06_p09_t|DCVS needs no PMOS duality, so input capacitance is lower and complex functions fit in one stage.||l06_p09_b|DCVS needs dual-rail inputs, has crowbar current, and the PMOS must be sized in a narrow window.

- **Advantages**: **no PMOS duality** → **lower input capacitance**, **NMOS only** in logic; **faster than CMOS**; can evaluate **complex logic trees in one stage** (and shared-transistor trees, e.g. XOR, fit naturally).
- **Disadvantages**: needs **complementary (dual-rail) inputs**; **crow-bar current**, sensitive to input timing; **PMOS sizing is hard** — too large and the pull-down cannot switch the output; too small and the rise is slow.
- "**Ratioed logic?**" — yes, in the transient sense: during switching the NMOS tree must overpower an on PMOS. In steady state it is ratioless (the PMOS on the low side is off), unlike pseudo-NMOS, which burns static current whenever the output is low (added).

!!! guard "Common trap"
    DCVS has no static current in steady state, but it is still a ratioed fight during transitions. If an interviewer asks "is DCVS ratioed?", the answer is "dynamically yes, statically no" — and the sizing constraint is the same as a keeper constraint.

### 6.4 Cascode non-threshold logic (CNTL)

SLIDE2:l06_p10_t|CNTL adds clamp transistors so internal nodes swing only between about Vt and Vdd−Vt.||l06_p13_t|CNTL rises faster and draws a smaller current spike because the PMOS is never hard on or off.

**CNTL** modifies DCVS by inserting NMOS devices that **limit the voltage swing** on the internal node n2 and the outputs:

- An NMOS between output and tree **limits the max voltage of n2 to Vdd − Vth**.
- An NMOS at the bottom **limits the min voltage of n2 to Vth**.
- So n2 swings **Vt ↔ Vdd − Vt**, and the outputs swing roughly **Vt → Vdd** (slides 20–24 walk through: the low output sits at Vt, never at 0).
- "Why good?" — less swing → faster, and the PMOS operates **at the edge of ON** rather than switching hard.

Advantages: **faster rise time** (less swing, PMOS near threshold); **PMOS not turned hard on/off → smaller power spike**; **reduced voltage swing → lower switching power**.

SLIDE:l06_p13_b|CNTL pays with higher leakage, more devices, careful sizing, and a non-full-swing output that must be restored.

Disadvantages: **higher leakage** (transistors sit at the edge of cut-off); **more transistors, more area**; **careful sizing** of PMOS/NMOS; **not full swing** → more noise-sensitive, and it **must be level-restored** somewhere downstream.

### 6.5 Pass-gate logic

SLIDE2:l06_p14_t|Pass-gate logic is 20–50% faster in XOR- and mux-like circuits because it carries less capacitance.||l06_p14_b|Pass gates lose a threshold, suffer body effect, and are vulnerable to input undershoot and coupling.

**Pass-gate (pass-transistor) logic**: inputs drive transistor *sources* as well as gates, so functions like mux and XOR take very few devices. The instructor's annotations build examples: F = A·B (B gates A, else pass 0 via B̄), F = A + B, and F = AB + C.

- **Advantages**: **speed 20–50% faster** (less capacitance) in some circuits such as **XOR/MUX**; **lower dynamic power**.
- **Disadvantages**:
    - **Vt drop**: an NMOS passes a weak 1 (**Vdd − Vt**, with Vt raised by **body effect** since the source rises); a PMOS passes a weak 0 (|Vtp|). The output must be **level-restored** somewhere.
    - **Sensitive to undershoot noise on inputs**: a node held at Vdd − Vt by an NMOS whose gate is at Vdd is at the **edge of cutoff**; and an off device (gate at 0) whose source dips below 0 will turn on and discharge the node. **Buffers at the inputs** suppress this. The node is also **sensitive to coupling** because it is weakly driven.
    - **Body effect → limit the number of FETs in series**.

The instructor's annotation on series chains: an unbuffered chain of n pass gates is an RC ladder with Elmore delay

```latex
t \approx RC\,(1 + 2 + \dots + n) = RC\,\frac{n(n+1)}{2} = O(n^2)
```

while inserting buffers every few stages makes it O(n). This is the same reason the Manchester carry chain (Lecture 5) is broken up.

SLIDE2:l06_p15_t|Pass-gate delay depends on state, and the output needs an inverter before it can drive the next stage.||l06_p15_b|LEAP adds an output inverter with a PMOS feedback keeper to restore full swing.

Further disadvantages (slide 29): **delay depends on state** (0→1 through an NMOS is slower than 1→0); **cannot be cascaded without an output inverter**; **added leakage in the output inverter** (its input sits at Vdd − Vt, so its PMOS is not fully off).

**LEAP / LEAN** (lean integration with pass transistors): NMOS-only pass network + output inverter + a **PMOS keeper/level restorer** whose gate is the inverter output. When the internal node rises to Vdd − Vt, the inverter output goes low, turning the PMOS on and pulling the node fully to Vdd.

What it fixes: **full swing**, **added noise tolerance**, and the leakage of the output inverter. "**Ratioed logic?**" — yes: on a 1→0 transition the pass network must overpower the keeper.

!!! eq "Equation card"
    NMOS passes 1 → Vdd − Vtn (body-effected); PMOS passes 0 → |Vtp|.
    Unbuffered n-stage pass chain: t ≈ RC·n(n+1)/2.
    Trick: "NMOS is good at 0, PMOS is good at 1 — a pass gate is good at only one."

### 6.6 LEAP keeper sizing and output inverter ratio

SLIDE:l06_p16_t|With a keeper the internal node reaches full rail, but the input sees more loading and current during switching.

The simulation (slide 31) compares **with vs without keeper**: with the keeper, node A (the inverter input) reaches the full rail and the output B settles cleanly; without it A stalls at Vdd − Vt. The cost is **more loading** and a larger current during the transition (the fight).

Keeper sizing trends (slides 32–33):

- **0→1 transition**: a **strong** keeper makes A rise to the rail faster once the inverter flips (it helps); a weak keeper leaves A crawling up.
- **1→0 transition**: a **strong** keeper **slows** the fall of A (the pass network must fight it), so B rises later; a weak keeper lets A fall quickly.
- So keeper strength trades 0→1 completion against 1→0 delay — and if it is too strong, the 1→0 transition fails entirely.

**Output inverter P/N** (slide 34): a **low P/N (0.5)** inverter has a **low switching threshold**, so it responds earlier to the slowly rising, degraded Vdd − Vt input; the output B falls sooner and the keeper engages sooner. P/N = 2 responds later.

!!! why "Why it matters for std-cell / ROM work"
    This is the **ROM/SRAM bitline sensing problem in miniature**: a weakly driven node, a keeper that must hold it against leakage but lose to a real pull-down, and a skewed (low-threshold or high-threshold) inverter that senses it early. The same "keeper too strong → slow or fail; too weak → droop" trade sets ROM keeper sizing against the bitline's n·Ioff (Lecture 7).

### 6.7 Transmission-gate logic

SLIDE2:l06_p18_t|Transmission gates pair NMOS and PMOS so either level passes cleanly, with better noise margin but more capacitance.||l06_p18_b|Simulated side by side, the transmission gate reaches the full rail while the NMOS pass gate stops short.

**Transmission gate (TG)**: NMOS and PMOS in parallel with complementary gate signals (annotation: A on the NMOS, Ā on the PMOS). Each device covers the other's weak level, so the output swings rail to rail.

- **PMOS should be small** — it only helps **complete the transition** (the NMOS does most of the early work for a rising node until it approaches Vdd − Vt).
- **Better noise margin** (full swing, no Vt drop).
- **Slower than pass-gate logic** — more capacitance (two diffusions per node, two gates per control).
- Waveforms (slide 36): in the TG version the internal nodes N1, N2 rise to the rail; in the pass-gate version N2 lags and settles below the rail, and the output transition is slower.

!!! why "Why it matters for std-cell / ROM work"
    TG muxes and XORs are standard-cell staples, and TGs are the column mux in SRAM/ROM arrays. A column mux built from NMOS-only pass gates passes a degraded "1" to the sense amp; a TG passes both levels — which matters for differential sensing and write paths.

### 6.8 Complementary pass-gate logic (CPL)

SLIDE2:l06_p19_t|CPL builds dual-rail NMOS pass networks with a cross-coupled PMOS restorer and output inverters.||l06_p20_b|Unlike DCVS, CPL inputs drive both trees and PMOS sizing affects only speed and noise margin.

**CPL** is **dual-rail pass-gate logic combined with DCVS-style restoration**: two NMOS pass networks compute f and ¬f (the slide's example computes XNOR: Q = 1 when A = B), a **cross-coupled PMOS pair** restores the weak high to Vdd, and **output inverters** buffer the result. Slides 38–39 step through A, B changes: the pass network drives the low side to 0 directly, and the high side, which arrives at Vdd − Vt, is pulled to Vdd by the cross-coupled PMOS.

Differences from DCVSL (advantages):

- **Inputs drive both trees** (as pass inputs, not only gates).
- **Better power consumption**, **very fast**.
- **PFET size only affects performance and noise margin, not functionality** — the pass network drives the node, so there is no ratioed fight that can fail outright (contrast DCVS).

SLIDE:l06_p21_t|CPL is fast but has poor noise margin, needs buffered inputs, and its PMOS size trades noise and power against speed.

Disadvantages: **not a very successful family** — needs **input buffers** for low undershoot noise; **poor noise margins** (sensitive to undershoot noise on inputs); a **PMOS trade-off**: PMOS↑ → slow fall (fights the low side), PMOS↓ → slow rise (weaker restore). The current plot (slide 42) shows a single sharp spike per transition.

### 6.9 Output prediction logic (OPL)

SLIDE2:l06_p22_b|OPL predicts every output is 1, so in an inverting path half the gates never need to switch.||l06_p24_t|Precharging toward the middle and evaluating early cuts delay versus a classic dynamic gate.

**Motivation**: in CMOS every gate switches L→H or H→L, so P/N must be balanced for both edges; in dynamic logic every gate precharges high and conditionally discharges — faster (NMOS only) but still full swing.

**OPL idea**: **assume all outputs will be 1**. In a chain of inverting gates you will be **right half the time** — every other gate needs **no transition** — so worst-case delay drops dramatically.

- Problem: an inverting gate with 1 at both input and output is **not a stable state**; the 1s would erode downstream and kill the gain.
- Solution: **disable each gate until its inputs are ready** (each stage gets its own clock, Clk1…Clk4, separated by a small **clock separation**), so the predicted 1 can be held everywhere until evaluation.
- Slide 47: classic dynamic output discharges from the precharge level with a full-swing delay; precharging toward **half Vdd** reduces delay; the real implementation gets close to that by evaluating with the clock just as the inputs arrive.

SLIDE2:l06_p24_b|Clock timing relative to inputs decides whether the OPL output glitches down and recovers or stays high.||l06_p25_b|OPL gates swing about half rail and are over 2x faster than CMOS, but clocking, variation and power make them hard to use.

OPL gate (slides 48, 50): a **clocked pseudo-static NOR/NAND**: a PMOS network plus a clocked PMOS precharge in parallel, and an NMOS network with a clocked footer.

- **Precharge**: Clk = L, output = H.
- **Clock arrives** → output starts to drop (footer on).
- **Input arrives** → if the gate should stay high, the input turns the pull-down off and the PMOS **pulls the output back up**. Clock just right → small dip; clock **late** → slower; clock **early** → the output glitches deep before recovering.
- The simulated chains use clock delays of 0, 50, and 15 ps spacing.

**Advantages**: gates swing **about half rail**; **very fast (> 2× faster than CMOS)**. **Disadvantages**: **very difficult clocking** (stages have different delays), **very sensitive to process variation** (clock placement), **power hungry** (every gate glitches), **sensitive to delay noise**.

!!! core "Core idea"
    Every non-CMOS family wins speed by limiting swing, sharing NMOS, or relying on timing — and each must eventually restore a full-rail, noise-robust signal.

### 6.x Check yourself

1. **What does a HI-skew inverter (P = 3, N = 1) cost in logical effort for each edge?** — Compared with the 2:1 reference of equal strength: g_u = 4/4.5 = 8/9 (favored), g_d = 4/3 (penalized). Skewing is limited by noise margin and the reset/precharge edge.
2. **In DCVS, which output switches first, and why is DCVS called ratioed?** — The falling output first; the NMOS tree must overpower the still-on cross-coupled PMOS before the other side rises. Statically there is no current path, but the transient fight makes sizing ratioed.
3. **Why does an NMOS pass gate deliver only Vdd − Vt, and why is it worse than Vt0?** — The NMOS turns off when Vgs falls to Vt; the source is the rising node, so body effect raises Vt above Vt0.
4. **Delay of n unbuffered pass gates in series?** — Elmore: RC·n(n+1)/2, i.e. O(n²); buffering every few stages makes it linear.
5. **What does the LEAP keeper fix, and what is the sizing trade-off?** — Restores full swing and noise tolerance and stops inverter leakage. Strong keeper: faster 0→1 completion, slower (or failed) 1→0. Weak keeper: the opposite.
6. **Why does a low P/N output inverter help in LEAP?** — It has a low switching threshold, so it flips earlier on the slowly rising Vdd − Vt node and turns on the keeper sooner.
7. **How does CPL differ from DCVS in terms of functional risk?** — In CPL the pass network drives the node directly, so PMOS size only affects speed and noise margin; in DCVS an oversized PMOS can stop the gate from switching.
8. **Why does OPL predict 1s, and why does it need per-stage clocks?** — In an inverting chain half the gates are right and need no transition; but 1-in/1-out is unstable for an inverting gate, so each gate is held off until its inputs are ready.


## Lecture 7 — Dynamic Logic Families

Dynamic (domino) logic removes the PMOS pull-up network and replaces it with a clocked precharge device, storing the result as charge on a floating node. That makes gates faster and lower in input capacitance, but it introduces a set of failure modes static CMOS never has: monotonicity requirements, leakage, charge sharing, noise on a floating node, and clock-timing constraints. This lecture covers the basic domino gate and its issues (keepers, charge sharing, timing), then the family tree — cascaded, footless, NORA/zipper, dual-rail, multiple-output, compound, self-resetting and limited-switch dynamic logic — and ends with two coupling effects (back-gate and Miller). It is the closest lecture to memory periphery: a NOR ROM bitline is a very wide dynamic NOR, and every issue below shows up there.

### 7.1 The basic domino gate

SLIDE2:l07_p02_t|A dynamic gate precharges its node high when the clock is low and conditionally discharges it through the NMOS network when the clock is high.||l07_p02_b|The dynamic 3-input OR has far less input and internal capacitance than the static version.

**Operation** (clock Φ split into two phases):

- **Precharge (Φ = 0)**: the PMOS precharge device charges the **dynamic node X to VDD**; the footer NMOS is off, so the PDN cannot conduct; the output inverter drives **out low**.
- **Evaluate (Φ = 1)**: precharge off, footer on. If the PDN conducts, X **discharges** (conditional discharge); otherwise X stays at VDD — **floating**, held only by its capacitance.
- **Inputs must be stable and monotonic L→H during evaluate.**

The instructor's annotations make the monotonicity rule concrete. With Φ = 1, an input A that is held at VDD, held at 0, or rises 0→1 all give the correct X. An input that **falls** 1→0 during evaluate is wrong: X has already discharged and nothing can recharge it until the next precharge. The second sketch shows why you cannot cascade two bare dynamic gates: during evaluate the first gate's dynamic node starts at 1 and falls, so the second gate sees a 1 at the start of evaluation and discharges wrongly. The inverter fixes this — each **domino** stage outputs 0 in precharge and can only rise during evaluate, so the next stage's inputs are monotonic rising.

**Cin/Cout comparison, 3-input OR** (sizes from the slide):

- **Static**: NOR3 with PMOS 6/6/6 in series and NMOS 1/1/1, followed by a 4/2 inverter. Input cap **Ci = 7**, node cap **Cn = 9**. Annotation: **g = 7/3**, parasitic **p = 9/3 = 3**.
- **Dynamic**: precharge PMOS 1, NMOS 2/2/2, footer 2, followed by an inverter **5/1 skewed for evaluate**. **Ci = 2**, **Cn = 7**. Annotation: **g = 2/3**, **p = 7/3**.
- So the dynamic OR has about **3.5× less input capacitance** and a smaller parasitic delay; the output inverter is HI-skew because in evaluate X only falls and out only rises.

```latex
g_{static\;OR3} = 7/3,\quad p = 3 \qquad\qquad g_{dynamic\;OR3} = 2/3,\quad p = 7/3
```

SLIDE2:l07_p03_t|Domino is faster with lower input capacitance and an early switch point, using a HI-skew output inverter.||l07_p03_b|Domino pays with low noise margin, charge sharing, leakage, and a noise-sensitive floating node.

**Advantages**: faster than CMOS; **lower input capacitance**; **early switch point**; **inverter P/N > 2** (only the rising output delay matters).

The instructor's VTC sketches explain "early switch point": a static inverter (VDD = 1.2 V in this process) switches at about **0.6 V**, but a dynamic gate in evaluate starts discharging as soon as the input exceeds **Vtn** — its switching threshold is about **Vt**. That is the speed advantage *and* the noise problem in one picture: the low noise margin is **NML ≈ Vtn**.

**Disadvantages**: **low noise margin**; **charge sharing**; **leakage currents**; **internal capacitance charge sensitive to noise**. The annotation on slide 6 shows a charge-sharing case: Φ = 1, a = b = 0, input c rises — the PDN does not conduct, but X shares charge with the node below c and droops from VDD.

!!! core "Core idea"
    A dynamic node is a capacitor with a switch to ground. In evaluate it can only go down, so every input must rise monotonically, and anything that removes charge (leakage, charge sharing, coupling) causes an irreversible error.

!!! guard "Common trap"
    "Dynamic logic is faster because NMOS is faster" is only half the story. The bigger win is input capacitance (no PMOS on the inputs) and the early switch point (threshold ≈ Vt). The same early switch point is why noise margin is so low.

### 7.2 Leakage and the keeper

SLIDE2:l07_p04_t|During evaluate a non-discharged dynamic node floats, and NMOS leakage slowly discharges it.||l07_p04_b|The keeper current must sit between the total off-leakage of the pull-down and the on-current of a single pull-down path.

When X should stay high in evaluate (all inputs 0), it is **floating**; **subthreshold leakage** through the off NMOS paths slowly discharges it. With a long evaluate phase (or a slow clock), X can droop past the inverter threshold.

**Half-latch (keeper)**: a weak PMOS from VDD to X, gated by the output inverter. While out = 0 (X high), the keeper is on and **replenishes the leakage**. When X genuinely discharges, out rises and turns the keeper off — but only after X has fallen past the inverter's switching point, so the PDN must **fight** the keeper first. The annotation redraws it as a cross-coupled inverter pair (a half latch).

**Current ordering** (the vertical scale on slide 8):

```latex
I_{pd,on} \;>\; I_{k,on,pmos} \;>\; n\cdot I_{pd,off} \;>\; I_{pd,off}
```

- **Eval margin** = gap between I_pd,on (one conducting path) and I_k: the PDN must win the fight, with margin for weak-corner NMOS / strong-corner PMOS.
- **Hold margin** = gap between I_k and **n·I_pd,off** (n parallel off paths all leaking): the keeper must out-supply the total leakage at the hot, fast-leakage corner.
- So the keeper **limits the width of OR gates**: as n grows, n·I_pd,off approaches I_pd,on and the window between the two margins closes.

!!! eq "Equation card"
    n·I_off(worst leak corner) < I_keeper < I_on,single path(weak corner).
    Max fan-in n_max ≈ I_on / I_off ÷ (margin factor).
    Trick: "keeper sits between one-on and all-off."

!!! why "Why it matters for std-cell / ROM work"
    A NOR ROM bitline is this exact gate with n = number of cells on the bitline (often hundreds of cells, added). The keeper must hold the bitline against n·Ioff of all unselected cells at hot/FF, yet a single selected cell (weak, minimum-size, possibly a high-Vt device) must overpower it at cold/SS. That inequality sets the maximum rows per bitline, drives bitline segmentation (local/global bitlines), and is why leakage — not speed — often decides ROM array height. It is also why ROM leakage numbers in .lib are dominated by bitline cells.

SLIDE:l07_p05_t|A static PMOS pull-up network as keeper avoids the fight, but only a few PMOS fit in series and input cap rises.

**Alternative to the half latch**: replace the feedback keeper with a weak **input-controlled PMOS network** (for an OR, series PMOS gated by a, b). When all inputs are 0 it holds X high; when any input is 1, the series PMOS path is off — **no fight**. Cost: **only a few PMOS fit in series** (wide OR gates can't use it) and **input capacitance increases** (inputs drive PMOS again — partly undoing the dynamic advantage).

### 7.3 Charge sharing

SLIDE2:l07_p05_b|In evaluate the dynamic node shares charge with an internal node that was discharged in a previous cycle.||l07_p06_t|Precharging internal nodes fixes charge sharing but adds capacitance and makes the pull-down slower.

**Mechanism**: in the previous cycle, internal node n (between series transistors A and B) was discharged (B = 1). Now in evaluate A = 1, B = 0: the PDN does not conduct, but A connects X to n, and charge **redistributes** between CL (dynamic node) and CA (internal node). X drops even though the logic says it should stay high.

The instructor derives the two regimes:

**Case 1 — CL ≫ CA**: n charges only until transistor A cuts off, at **VDD − VT**. Charge conservation:

```latex
C_L V_{DD} = C_L V_F + C_A (V_{DD} - V_T) \;\Rightarrow\; V_F = V_{DD} - \frac{C_A}{C_L}\,(V_{DD} - V_T)
```

**Case 2 — CL ~ CA (or CL < CA)**: X and n equalize before A cuts off (V_F < VDD − VT):

```latex
C_L V_{DD} = (C_L + C_A)\,V_F \;\Rightarrow\; V_F = \frac{C_L}{C_L + C_A}\,V_{DD}
```

The design rule is to keep the droop ΔV = (CA/CL)(VDD − VT) below the output inverter's noise margin — i.e. keep internal capacitance small relative to the dynamic node, or precharge the internal nodes. The annotation in the corner sketches a memory-style column (word line on a cell, with **CL ≪ CA**) — the extreme of case 2, where a small precharged node dumps its charge onto a large one (interpretation, added).

**Fix: precharge internal nodes** with extra clocked PMOS devices. Alternative: an **NMOS** precharge (gate on Φ̄) that pulls the internal node to **VDD − Vt** — "lower voltage discharge": less charge to dump later. Issues: the **PDN becomes slower** (more internal capacitance), and there is a **higher voltage to discharge** on each evaluating path.

Other standard fixes (added): a keeper also restores charge-sharing droop if it is strong enough; reorder the PDN so the late/likely-high input is near the dynamic node; and size the output inverter's threshold low so small droops are tolerated.

!!! why "Why it matters for std-cell / ROM work"
    In a NOR ROM each cell is one transistor from bitline to ground, so per-cell charge sharing is small — but **column muxes**, **bitline segmentation switches** and **stacked (NAND-ROM) cells** all create internal nodes that share charge with the sense node. The usual fixes are exactly these: precharge the internal/local bitlines too, and keep the sense node capacitance large relative to anything it shares with.

SLIDE:l07_p06_b|Domino delay depends on input arrival time, and the first gate in a chain sees extra clock-related delay.

**Timing**: the delay from input i to Q depends on **when** the input arrives relative to the clock edge. If i is ready long before Φ rises, the delay is clock-limited (clk→Q); as i arrives later inside evaluate, the i→Q delay decreases and flattens (about **30%** variation is marked on the plot). The **first gate in a domino chain** has increased delay because it is launched by the clock (and must be footed — see 7.5). For characterization this means a dynamic cell's delay is a function of two arrival times, not one.

### 7.4 Domino cascading

SLIDE:l07_p07_t|A domino chain precharges every gate together and then evaluates in a ripple, with inputs held stable by latches during evaluate.

A **domino chain**: latch → dynamic gate → inverter → dynamic gate → … → latch. All gates precharge simultaneously on Φ = 0; in evaluate, a transition can **ripple** through the chain like falling dominoes. Constraints:

- The **input latch must hold inputs stable during evaluate** (it latches on Φ̄; slide: "latch input" then "latch output").
- The timing diagram (A → B → C → D) shows each node rising in sequence during E, then all being reset together in P.
- Only **non-inverting** logic is possible in a single domino stage (dynamic gate + inverter = AND/OR type functions), which is why dual-rail domino exists (7.7).

### 7.5 Footless domino

SLIDE2:l07_p07_b|Only the first stage needs a footer, provided later stages see their inputs precharge low before their own precharge.||l07_p08_t|Delayed clocks let each stage precharge after its inputs have fallen and evaluate before its inputs become valid.

**Footless domino**: remove the clocked foot NMOS from every stage except the first.

- The **first stage has a footer** — its inputs come from a latch and are **not guaranteed low during precharge**; without a foot, a high input during precharge creates a VDD→GND **crowbar** path through the precharge PMOS and the PDN. (Annotation: the footer is crossed out on the first stage only to show the short circuit.)
- **Later stages don't need a footer** because their inputs come from domino outputs that are low in precharge — **but only after the previous stage has precharged**. So **inputs must precharge low before the dynamic node precharges**, enforced with **delayed clocks Φ1, Φ2**.
- Rule from the timing slide: **precharge after the inputs precharge**, and **evaluate before the inputs are valid** (each stage must be in evaluate before its input rises, so it never misses an input).

SLIDE:l07_p09_t|Footless domino needs multiple clocks and gives later stages less precharge time, traded against one less series NMOS.

- **Advantage**: faster than classic domino — **one less NMOS** in the pull-down stack.
- **Disadvantages**: multiple clocks (and you **cannot simply delay the clock**, since fast inputs may arrive during evaluate); **reduced precharge time for later stages**; a trade-off between **upsizing the precharge PMOS** (increases dynamic-node cap) versus saving one NMOS; you can put a **footed stage after a footless stage** to recover precharge time.

### 7.6 NORA / zipper logic

SLIDE2:l07_p09_b|NORA alternates N-type gates precharged high with P-type gates precharged low, with no inverter in between.||l07_p10_b|NORA is fast but drives loads poorly, uses slow PMOS networks, and has poor noise margin.

**NORA (no-race) / zipper**: alternate **N-blocks** (PDN, clocked by Φ, precharge high, output falls in evaluate) and **P-blocks** (PUN, clocked by Φ̄, precharge low, output rises in evaluate). An N-block's output falls monotonically, which is exactly what a P-block's PMOS inputs need; a P-block's output rises, which is what the next N-block needs. No inverter required.

- **Advantages**: **eliminates the inverter delay** (but then there is **no drive for long interconnect**); fast.
- **Disadvantages**: not good for **large output loads** (no output inverter); **big, slow PMOS PUN**; **bad noise margins** → can add a keeper; **noise on the dynamic node** (it drives the next stage directly); **cannot make arbitrary connections** (N must feed P must feed N).

### 7.7 Dual-rail domino

SLIDE2:l07_p11_t|Dual-rail domino computes both f and its complement so any logic function is possible, at twice the transistors.||l07_p11_b|When evaluation trees share internal nodes, those nodes are precharged for every input pattern.

**Why**: a domino stage is **non-inverting only**, so general logic (XOR, inversion) needs **dual-rail** signals: each signal travels as a pair (a_h, a_l), both 0 in precharge, exactly one rises in evaluate. Example: AND/NAND pair computing A·B and ¬(A·B) with A, Ā, B, B̄ inputs.

- **Double the number of transistors**.
- A **shared foot** gives **less clock load**, and **only one tree evaluates** each cycle.
- Annotation: "Why good? Always precharged." In the shared structure (slide 22), the internal nodes are connected to one or other precharged rail for **any** input pattern, so they sit at **VDD − Vt** (shown in red) and charge sharing is greatly reduced.
- Dual-rail also gives **completion detection** for free (one rail high = done), useful for self-timed design (added).

SLIDE2:l07_p12_t|Cross-coupled keepers in dual-rail domino avoid a keeper fight but leave both rails unprotected until inputs arrive.||l07_p12_b|Multiple-output domino taps intermediate nodes of one pull-down stack to compute several functions at once.

**Dual-rail with cross-coupled keepers**: each rail's keeper PMOS is gated by the **other** rail. When one rail discharges, it turns on the keeper of the other rail, holding it high. **No fight** — the falling rail's keeper is controlled by the other (still high) rail and is off.

"**Still not completely safe. Why?**" — **no keeper is set (on) while the inputs have not arrived**: early in evaluate both rails are high, so both keepers are off and both dynamic nodes float, vulnerable to leakage and noise until one input arrives.

**Multiple-output domino (MODL)**: tap intermediate nodes of a series stack, each with its own precharge device and inverter. Example: Q1 = AB(C+D), Q2 = B(C+D), Q3 = C+D from one stack.

- **Implement more logic per domino stage** (shared transistors).
- **Slows down the top output** (more capacitance on its path) but more work is done.
- **Common** in practice (e.g. carry-lookahead chains, added).

### 7.8 Compound domino

SLIDE:l07_p13_t|Compound domino ends short dynamic stacks in a static gate, e.g. a NAND that computes AB + CD.

**Compound domino**: replace the output inverter with a **static gate** that combines several short dynamic nodes. Example: two dynamic nodes ¬(AB) and ¬(CD) feed a static NAND → **Out = ¬(¬(AB)·¬(CD)) = AB + CD**.

- **Reduces the number of transistors in a stack** → faster. Due to **VDD scaling, no more than 4 transistors in a stack**.
- **Each dynamic output node needs its own half latch (keeper)**.
- The static gate must still be non-inverting overall from input to output (dynamic node falls → static NAND output rises), so the next stage remains monotonic.

### 7.9 Self-resetting domino (SRD)

SLIDE2:l07_p14_t|Self-resetting domino has no clock or footer; its own output, delayed through an inverter chain, triggers the precharge.||l07_p17_b|SRD requires inputs to fall before the reset pulse and the reset to finish before the next input arrives.

**SRD**: precharge is **not clocked** — it is **controlled by the output** through a delay chain (three inverters to a precharge PMOS, gate signal f). No footer.

Sequence (slides 28–33):

1. Idle: n precharged to 1, out = 0, f = 1 (PMOS off), inputs 0 — **n is floating**.
2. Input A rises → n falls → out rises. **No fight**: the precharge PMOS is off.
3. After the inverter-chain delay, f falls → precharge PMOS on → n is recharged. **Input must be 0 before this pulse ripples through**, otherwise the precharge PMOS fights the PDN (crowbar).
4. n rises → out falls → after the delay f rises again. **The next input must happen after precharge ripples through**.

**Timing constraints**: f drops **after** the inputs go low; f pulls up **before** the next input; multiple inputs must **line up in time** (inputs become pulses, not levels).

SLIDE:l07_p18_b|SRD trades the clock for hard pulse-timing constraints that are sensitive to process variation.

- **Advantages**: **no clock**; **fast evaluation** (no footer); **more time for precharge** than standard footless domino.
- **Disadvantages**: timing constraints; **stability after precharge**; **sensitive to process variations** (the pulse widths are set by inverter delays); **very difficult in practice → you end up pulsing everything**.

!!! why "Why it matters for std-cell / ROM work"
    Self-timed and pulsed resets are common in memory periphery: SRAM/ROM word-line pulses, sense-enable timing and bitline precharge are often generated from replica/dummy-path delay chains rather than clock edges — the same "the circuit resets itself after a tracked delay" idea, with the same min/max pulse-width constraints across PVT.

### 7.10 Limited-switch dynamic logic (LSDL)

SLIDE2:l07_p19_t|LSDL puts a clocked latch behind a dynamic front end so the output changes only when its value changes.||l07_p20_t|In LSDL the dynamic node precharges every cycle, but the latched output switches only on a real change.

**LSDL**: a dynamic front end (dyn node, PDN) followed by a **clocked static latch stage** (node m, back-to-back inverters during precharge) driving the output.

- During **precharge**, the dynamic node is high but the output stage is **cut off from it** by the clocked devices, and the back-to-back inverters **hold the previous value** (prev).
- During **evaluate**, the output stage samples the dynamic node and updates the latch. If the value didn't change, the output does **not toggle** — "output switch limiters, or latch".
- **Fast like dynamic**, **low power like static** (or a latch); it **replaces a latch** since it already has a clock.
- Timing diagram: dyn pulses down in every evaluate where A = 1, but m and out change only once when A changes.

SLIDE:l07_p21_t|LSDL gives up keepers and dynamic depth per stage, needs narrow evaluate pulses, and complicates setup and hold analysis.

- **Advantages**: fast (dynamic); low power (**static output**, **fewer output switches**); **easy interface with static circuits**; output inverter; latched output; **no need for a dual-rail version** (static inverters can be used after it).
- **Disadvantages**: **fewer dynamic devices per stage** (slower than pure domino); **no dynamic-node keeper → evaluate must be narrow** (a pulse); **pulse generation**; longer gate delay from the embedded latch; **complicated setup/hold analysis** due to logic inside the latch; non-regular pipelines need different pulse settings.
- Pipeline example (slide 42): LSDL1 → static logic → LSDL2; n2 (the max-delay output of static logic 2) **must arrive before L2's evaluate pulse** — a setup constraint on the pulse.

### 7.11 Coupling issues: back-gate and Miller

SLIDE2:l07_p22_t|When a static gate driven by a dynamic node turns on, its rising gate capacitance pulls charge off the dynamic node.||l07_p22_b|Clock feedthrough through the precharge device's gate-drain capacitance bumps the dynamic node at clock edges.

**Back-gate coupling** (dynamic→static interface): the dynamic node drives one input of a static NAND whose other input m rises late. Before m rises, the NAND's internal node n sits at VDD − Vt; when m rises, n is pulled to 0. The transistor whose gate is dyn now turns fully on and its **gate capacitance increases** (channel forms) — that capacitance **charge-shares with the dynamic node**, which dips (green waveform). The instructor's annotation: the coupling capacitor sees V_C go from 0 to VDD across it, so it injects i = C·dV/dt = C·VDD/Δt into the dynamic node.

- **Negative effect on speed** and possibly on **functionality** (if the dip crosses the downstream threshold or the keeper cannot recover it).
- Fix (added): drive the static gate from the domino output inverter rather than the raw dynamic node, keep the dynamic node capacitance large, or order the NAND inputs so dyn connects to the transistor nearest the output.

**Miller capacitance / clock feedthrough**: the precharge PMOS's gate–drain capacitance couples the clock edge onto the dynamic node. At the P→E edge (Φ rises), dyn is bumped **above VDD**, so the NMOS has **more charge to pull down** in evaluate (a speed hit). At the E→P edge (Φ falls) dyn is bumped down, but the precharge device is turning on at that moment, so that bump **only affects precharge** and is harmless. Not a functional failure on its own, but it adds to the charge budget.

!!! core "Core idea"
    Every dynamic-node failure is a charge budget: precharge puts Q = C·VDD on the node, and leakage, charge sharing, back-gate coupling and feedthrough all remove or add charge. The keeper and the output inverter's threshold set how much error is tolerated.

!!! why "Why it matters for std-cell / ROM work"
    For a ROM bitline: **precharge** = bitline precharge PMOS (and its Miller kick on the clock edge); **evaluate** = word line on, selected cell discharges; **keeper vs n·Ioff** = hold margin across all rows; **charge sharing** = column mux and segment switches; **early switch point** = a HI-skew (or low-threshold) sensing inverter, or a sense amp for small swing. Interviewers will ask you to size the keeper, estimate droop, and say what limits rows per bitline.

### 7.x Check yourself

1. **Why must domino inputs be monotonically rising during evaluate?** — The dynamic node can only be discharged in evaluate; an input that is briefly high then falls discharges it irreversibly until the next precharge. The output inverter guarantees each domino output only rises, so chains stay monotonic.
2. **What is the switching threshold of a dynamic gate in evaluate, and what does it imply?** — About Vtn (vs ~VDD/2 for static, 0.6 V at 1.2 V): early switch point (fast) but low-side noise margin of only about Vt.
3. **State the keeper sizing inequality and what it limits.** — n·I_pd,off < I_keeper < I_pd,on (with corner margins). It limits OR fan-in — for a ROM, the number of cells per bitline.
4. **Derive the charge-sharing voltage when CL ≫ CA.** — CL·VDD = CL·VF + CA(VDD − VT) → VF = VDD − (CA/CL)(VDD − VT). If CL ~ CA: VF = CL·VDD/(CL + CA).
5. **Why does footless domino still need a footer in the first stage?** — Its inputs come from a latch and are not guaranteed low during precharge, which would short the precharge PMOS to ground. Later stages get inputs that precharge low — provided their own precharge is delayed (Φ1, Φ2).
6. **Why use dual-rail domino, and what is unsafe about cross-coupled dual-rail keepers?** — Domino is non-inverting, so complements must be computed explicitly. With cross-coupled keepers, both rails float with no keeper on until an input arrives.
7. **What are the self-resetting domino timing constraints?** — f must fall after the inputs go low; f must rise again before the next input; all inputs must line up as pulses.
8. **What is back-gate coupling?** — A static gate driven by a dynamic node: when its other input turns its stack on, the driven transistor's gate capacitance rises and pulls charge off the dynamic node (i = C·dV/dt), slowing or corrupting it.


## Lecture 8 — Dynamic Power

This lecture builds the switching-power model from first principles (where the CV² actually goes), turns it into a usable estimate with activity factors, and then walks the knobs: capacitance, activity (clock gating), and supply voltage (multi-VDD with level converters, low-swing clocking, parallel/pipelined architectures, DVFS). For a standard-cell designer this is the physics behind the `internal_power` and switching tables in a .lib, and behind every "why is this flop so big on the clock pin" discussion.

### 8.1 Where power goes: switching, short-circuit, leakage

SLIDE2:l08_p02_t|Total power splits into dynamic switching, short-circuit (crowbar) and static leakage components.||l08_p02_b|Short-circuit current is a brief overlap blip, under 10% of dynamic power when input and output slopes are comparable.

The lecture starts from the definitions: **instantaneous power** P(t) = I(t)·V(t), **energy** E = ∫P dt over an interval T, and **average power** Pavg = E/T. Everything below is bookkeeping of where the supply energy ends up.

- **Total power = dynamic + static + short-circuit.** The slide's inverter cartoons label the three paths: the charge/discharge current into the load (dynamic), the momentary VDD→GND path during a transition (short circuit), and the paths that flow even with a stable input — subthreshold leakage through the OFF device and gate-oxide leakage (Lecture 9).
- **Short-circuit (crowbar) current:** while the input passes through the middle of the swing, with Vtn < Vin < VDD − |Vtp|, both nMOS and pMOS are ON. The slide's rule: **< 10% of dynamic power if rise/fall times are comparable for input and output**; the course then ignores it.
- The interview angle: short-circuit energy grows with **slow input slew** and with a **weak load** (output switches fast while the input is still mid-rail). This is exactly why .lib `internal_power` is a 2-D table indexed by input transition and output load, and why max-transition design rules exist.

!!! guard "Common trap"
    "Short-circuit power is negligible" is only true when slopes are balanced. A large gate driven by a weak, slow net (or a long wire without repeaters) can spend a large fraction of its energy in crowbar current. Fix the slew, not the gate.

### 8.2 Deriving CV² — and why half of it is lost

SLIDE2:l08_p03_t|On a rising output the supply delivers C·VDD², half burned in the pMOS and half stored on the load.||l08_p03_b|On the falling output the supply delivers nothing and the stored ½C·VDD² is dissipated in the nMOS.

**Input 1→0 (output rises).** The professor's annotation writes the load current i(t) = C·dVo/dt and substitutes:

```latex
E_{supply} = \int_0^\infty V_{DD}\, i(t)\,dt = V_{DD}\,C\int_0^{V_{DD}} dV_O = C V_{DD}^2
```

```latex
E_{PMOS} = \int_0^\infty (V_{DD}-V_O)\, i_p(t)\,dt = C\int_0^{V_{DD}} (V_{DD}-V_O)\,dV_O = \tfrac12 C V_{DD}^2
```

```latex
E_{CAP} = \int_0^\infty V_O\, i_C(t)\,dt = C\int_0^{V_{DD}} V_O\,dV_O = \tfrac12 C V_{DD}^2
```

**Input 0→1 (output falls).** The supply delivers **0**; the nMOS dissipates the ½CV²DD that was on the capacitor.

- So one full cycle (0→1→0 at the output) costs **C·VDD²** from the supply, independent of transistor sizes, R, or edge rates. The resistance only decides *how fast*, never *how much* (for a full-swing charge from a fixed supply).
- Interviewer angle: "Where is the energy dissipated?" — half in the pull-up during charge, half in the pull-down during discharge. "Can you recover it?" — only with non-fixed-supply schemes (adiabatic/charge recycling), which this course does not cover.

!!! core "Core idea"
    A full 0→1→0 output cycle draws exactly C·VDD² from the supply. The energy depends on C and V only — sizing changes speed, not the per-transition energy of a given C.

### 8.3 Activity factor

SLIDE2:l08_p04_t|Dynamic power is α·C·VDD²·f, with α = 1 for a clock and ½ for a node that toggles once per cycle.||l08_p04_b|For random independent data α = P·(1−P), giving 0.25 at P = 0.5 and typically about 0.1 in real logic.

Let the clock be **f** and the node's transition rate **fsw = α·f**. Then:

```latex
P_{switching} = \alpha\, C\, V_{DD}^2\, f
```

- **α is defined per clock cycle and counts 0→1 transitions** (each 0→1 implies one charge from VDD). A clock rises once per cycle → **α = 1**. A signal that switches once per cycle (rises one cycle, falls the next) → **α = ½**.
- **Estimation:** with Pi = Prob(node = 1) and P̄i = 1 − Pi, for temporally independent data **αi = P̄i·Pi** (probability it was 0 last cycle times probability it is 1 now). The annotation: α = P0·P1. Random data P = 0.5 → **α = 0.25**.
- Real data is not random (the slide's example: upper bits of 64-bit bank-account balances are usually 0). Data that propagates through ANDs and ORs has lower activity; **typically α ≈ 0.1** for logic.

!!! eq "Equation card"
    P_dyn = α·C·VDD²·f, α = P0·P1 (independent inputs), clock α = 1, random data α = 0.25, typical logic α ≈ 0.1. Memory trick: α counts *charging* events per cycle — the supply only pays on 0→1.

!!! guard "Common trap"
    Mixing conventions. Some texts define activity as "transitions per cycle" (both edges) and write ½·α·C·V²·f. This course uses α = probability of a 0→1 transition, so the factor ½ is absorbed (clock α = 1, not 2). State your convention before plugging numbers.

### 8.4 Switching probability through gates — worked example

SLIDE2:l08_p05_t|Output-high probability for each gate follows from the input probabilities, assuming independent inputs.||l08_p05_b|A 4-input AND built as NAND2-NAND2 into an inverted-input AND (a NOR2) has α = 3/16 on the internal nodes and 15/256 on the output.

Table on the slide (inputs independent):

| Gate | P(Y=1) |
|---|---|
| AND2 | PA·PB |
| AND3 | PA·PB·PC |
| OR2 | 1 − P̄A·P̄B |
| NAND2 | 1 − PA·PB |
| NOR2 | P̄A·P̄B |
| XOR2 | PA·P̄B + P̄A·PB |

**Worked example (from the annotated slide).** 4-input AND = two NAND2s (n1 = NAND(A,B), n2 = NAND(C,D)) feeding an AND with inverted inputs — i.e. a **NOR2** (the professor redraws it as a NOR). Inputs P = 0.5.

- n1: P0 = PA·PB = 0.25, so P1 = 0.75 → **α = 0.25 × 0.75 = 3/16**. Same for n2.
- Y = NOR(n1, n2) is 1 only when n1 = n2 = 0 (circled row of the truth table): **P1 = 0.25 × 0.25 = 1/16**, P0 = 15/16 → **α = 15/256 ≈ 0.059**.
- Intuition: deep AND/OR-type logic pushes probabilities toward 0 or 1, and α = P(1−P) collapses. XOR-rich logic (adders, parity, CRC) keeps P ≈ 0.5 and α high.
- Interview angle: "Why is this estimate an upper/lower bound?" It ignores **glitches** (spurious transitions from unequal path delays, which raise activity) and **correlation** (reconvergent fanout makes inputs dependent, so the product formulas are wrong).

### 8.5 Chip-level dynamic power estimate

SLIDE2:l08_p06_t|A 1-billion-transistor 65 nm chip at 1 V and 1 GHz, with logic at α = 0.1 and memory at α = 0.02.||l08_p06_b|Switched capacitance is 27 nF of logic and 171 nF of memory, giving about 6.1 W of dynamic power.

Givens: 50 M logic transistors, average width 300 nm (the annotation rewrites 12λ × 0.025 µm/λ = 0.3 µm), α = 0.1; 950 M memory transistors, average width 100 nm (4λ = 0.1 µm), α = 0.02; 1.0 V, 65 nm; C = 1 fF/µm (gate) + 0.8 fF/µm (diffusion) = **1.8 fF/µm**; neglect wire and short-circuit.

```latex
C_{logic} = (50\times10^6)(0.3\,\mu m)(1.8\,fF/\mu m) = 27\ nF
```

```latex
C_{mem} = (950\times10^6)(0.1\,\mu m)(1.8\,fF/\mu m) = 171\ nF
```

```latex
P_{dynamic} = [0.1\,C_{logic} + 0.02\,C_{mem}](1.0)^2(1\,GHz) = (2.7 + 3.42)\,nF\cdot GHz \approx 6.1\ W
```

- Note the lesson: memory is 95% of the transistors and 86% of the capacitance, but its low activity keeps it at ~56% of the power. Activity dominates the budget as much as capacitance.
- Interview angle: "What did we ignore?" Wire capacitance (often comparable to or larger than gate C in real designs), the clock network (α = 1 on a big C), short-circuit power, glitches, and leakage.

!!! why "Why it matters for std-cell / ROM work"
    In a ROM or register file the array dominates C but has low activity per cell; the power is concentrated in the few things that switch every access — wordline drivers, precharged bitlines (a precharged bitline that discharges and recharges each read is effectively α ≈ P(read 0) per access), sense amps, and the clock. Characterization reports this as `internal_power` per pin and per `when` condition; the estimate here is the same arithmetic.

### 8.6 Scaling theory and why power still rose

SLIDE2:l08_p07_t|Under ideal (Dennard) scaling, power per device falls as 1/S² and power density stays constant.||l08_p07_b|Power rose anyway because device count grew, VDD stopped scaling, leakage grew and interconnect increased.

**Ideal scaling, factor S > 1:** tox, L, W → 1/S; V → 1/S; C → 1/S (annotation: C = εA/d ∝ (1/S²)/(1/S) = 1/S); delay → 1/S (annotation: t = RC = (V/I)·C ∝ 1/S); f → S; number of devices (per design) → 1.

```latex
P_{dyn} = \alpha C V_{DD}^2 f = \alpha \frac{C}{S}\frac{V_{DD}^2}{S^2} S f = \frac{1}{S^2}
```

Area per device also scales as 1/S², so **power density P/A = 1**. "So why is POWER INCREASING???"

- **Number of devices is not constant:** with constant die size the device count grows by k² (k = S), so P_dyn per chip ≈ 1 — and in practice more because:
- **Leakage power is increasing** (Lecture 9: lower Vt → exponentially more Ioff).
- **VDD scaling is lagging** (it cannot drop much without dropping Vt, which costs leakage).
- **Increasing interconnect** (more metal layers, more wire C).
- Consequence on the slide: **frequency starts to lag / stays constant** so the chip can still be cooled.

The supporting slides (not shown) list the problems power causes — supply delivery, battery life, heat removal and packaging cost, supply integrity, temperature-driven reliability — and the "new design philosophy": performance is set by a small fraction of critical gates, while *all* gates burn power, so use fast devices (high VDD, low Vt, short L) only where needed and slower devices everywhere else; **trade excess speed for power**.

### 8.7 Reducing C: latch topology and clock load

SLIDE2:l08_p10_t|A transmission-gate latch with a local clock inverter puts 8C on clock, while a pass-nMOS latch moves the load to data (14C data, 2C clock).||l08_p10_b|Clock gating stops the clock to idle registers, removing α = 1 clock switching and all downstream activity.

The overview slide lists the three knobs: **reduce C** (sizing, P/N ratio, shorter routes, new circuit structures), **reduce α** (clock gating, bus encoding), **scale VDD** (parallel/pipeline, low-swing signaling/clocking, DVS). VDD is the strongest because it is squared.

**Less-cap latches (professor's annotation).** Top: transmission-gate latch with its own clock inverter (sized 2:1) and a D input inverter → **Data = 8C, Clock = 8C**. Bottom: latch using clocked nMOS pass devices (size 1) → **Data = 14C, Clock = 2C**. The annotation adds α(data) = 0.1, α(clock) = 1. The effective switched capacitance per cycle is therefore:

- Top: 0.1·8C + 1·8C = **8.8C**
- Bottom: 0.1·14C + 1·2C = **3.4C**

So moving capacitance from the clock pin to the data pin is a ~2.6× win even though total pin cap went up. Lesson: **weight capacitance by its activity**; the clock pin is the most expensive capacitance in a flop.

**Clock gating.** Turn off the clock to registers in unused blocks: saves the clock activity (α = 1) and eliminates all switching in the block; requires knowing in advance whether the block will be used. The annotated waveforms show the classic problem: ANDing clk with a raw enable glitches if `en` changes while clk is high. The fix is the **latch-based clock gater** (enable latched while clk is low, then ANDed) so the gated clock clk′ is glitch-free.

!!! why "Why it matters for std-cell / ROM work"
    Integrated clock-gating cells (ICG: latch + AND) are library cells; their setup/hold of `en` versus clk is characterized like a flop's. In a ROM/RF macro, clock and wordline enables are gated internally so an idle macro draws only leakage. Flop design choices that reduce clock-pin cap show up directly in the .lib clock-pin `internal_power` and in clock-tree power.

!!! core "Core idea"
    Capacitance is not equal: weight it by activity. Clock-pin capacitance (α = 1) costs ~10× data-pin capacitance (α ≈ 0.1).

### 8.8 Trading area for voltage: parallel and pipelined datapaths

SLIDE2:l08_p11_b|The reference datapath (adder + comparator) runs at 40 MHz at 5 V with switched capacitance Cref.||l08_p12_t|Two parallel copies at half clock rate allow VDD = Vref/1.7, giving 0.36 Pref at 2.15× capacitance.

For **fixed-rate processing** (streaming DSP, communications) there is no benefit to throughput beyond the real-time requirement, so spare speed can be converted to lower VDD. (Variable-rate/burst computation — general-purpose — is "mostly idle with bursts", where faster is better; that motivates DVFS and gating instead.)

**Reference:** critical path = T_adder + T_comparator (= 25 ns) → f_ref = 40 MHz; switched capacitance C_ref; V_dd = V_ref = 5 V; P_ref = C_ref·V_ref²·f_ref; area 636 × 833 µm².

**Parallel:** two copies, each clocked at f_ref/2, outputs muxed. Each copy now has twice the time, so V can drop until the delay doubles: V_par = V_ref/1.7. Capacitance rises (two datapaths + mux + routing) to C_par = 2.15 C_ref.

```latex
P_{par} = (2.15\,C_{ref})\left(\tfrac{V_{ref}}{1.7}\right)^2 \tfrac{f_{ref}}{2} \approx 0.36\,P_{ref}
```

Area 1476 × 1219 µm² (≈3.4×).

SLIDE2:l08_p12_b|Pipelining halves the critical path so VDD = Vref/1.7 at the same clock, giving 0.39 Pref with only 1.15× capacitance.||l08_p13_t|Summary: pipelined 0.39, parallel 0.36, pipeline plus parallel 0.2 of reference power at 2.0 V and 3.7× area.

**Pipelined:** add a register between adder and comparator. Critical path = max(T_adder, T_comparator), so at the same clock (f_pipe = f_ref) the voltage can drop to V_pipe = V_ref/1.7. Capacitance rises only for the pipeline registers: C_pipe = 1.15 C_ref.

```latex
P_{pipe} = (1.15\,C_{ref})\left(\tfrac{V_{ref}}{1.7}\right)^2 f_{ref} \approx 0.39\,P_{ref}
```

Area 640 × 1081 µm² (≈1.3×).

| Architecture | Voltage | Area | Power |
|---|---|---|---|
| Simple datapath | 5 V | 1 | 1 |
| Pipelined | 2.9 V | 1.3 | 0.39 |
| Parallel | 2.9 V | 3.4 | 0.36 |
| Pipeline-Parallel | 2.0 V | 3.7 | 0.2 |

- Pipelining buys almost the same power reduction as parallelism for a fraction of the area — but adds latency and register power (and clock power).
- Why it stops working: VDD cannot approach Vt without delay exploding (delay ∝ VDD/(VDD − Vt)^α, Lecture 9 slide), and lowering Vt to compensate costs exponential leakage. The supporting slide lists the supply-scaling options: more parallelism/pipelining (area/cost), **multiple voltage domains** (DC-DC converters or extra supplies, distribution cost), DVS, and lowering Vt (exponential leakage "eventually dominates").

!!! eq "Equation card"
    P ∝ C·V²·f. Parallel-by-N: C×N (plus overhead), f÷N, V lowered to match N× delay budget. Pipeline-by-N: C × (1 + register overhead), f same, V lowered to match 1/N path. Both win because V enters squared while C enters linearly.

### 8.9 Multiple supplies and level converters

SLIDE2:l08_p14_t|Two supplies are common; a low-VDD gate driving a high-VDD gate needs a level converter because the pMOS never fully turns off.||l08_p14_b|The DCVS level converter uses cross-coupled pMOS and differential nMOS pull-downs, at the cost of contention and more transistors.

**How many VDDs?** Two is common — many chips already have one for core and one for I/O.

**When are level converters needed?** Only for **step-up** (VDDL driving VDDH). The professor's sketch: a 0.8 V gate output (high = 0.8 V) drives an inverter on 1.2 V. The pMOS of the receiving gate sees Vgs = 0.8 − 1.2 = −0.4 V when it should be OFF; if |Vtp| < 0.4 V it is partially ON → static current and a degraded output. Step-down (1.2 V driving 0.8 V) needs no converter: the 0.8 V gate just sees an overdriven input.

Reduce overhead by **converting at register boundaries** and **embedding level conversion inside the flop**.

**DCVS level converter** (differential cascode voltage switch; annotations: IN 0/0.8 V on VDDL, the rest on VDDH = 1.2 V): an inverter on VDDL makes IN and IN̄; these drive two nMOS pull-downs (M3, M6), whose drains are loaded by a cross-coupled pMOS pair (M4, M5) on VDDH. The nMOS only needs VDDL gate drive to pull its side to 0, which turns on the opposite pMOS and pulls the other side to the full 1.2 V. The nMOS must **win the fight** against a fully-ON pMOS (contention) with only 0.8 V of gate drive — so nMOS must be sized strong; this costs power and delay. Slide verdict: **more power dissipation because of greater contention and a higher transistor count**.

SLIDE2:l08_p15_t|The pass-gate level converter lets a VDDL-gated pass nMOS pull the input node low, with a single pMOS feedback keeper, reducing contention.||l08_p15_b|A diode-connected Vt-drop transistor avoids a second supply, giving swing Vt to VDD−Vt and power α·C·VDD·(VDD−2Vt)·f.

**Pass-gate (PG) level converter:** IN (0/0.8 V) drives the nMOS M2 directly and also passes through M1 (gate tied to VDDL) to node X, which drives the pMOS M3; M3/M2 form an inverting stage on VDDH whose node Y feeds the output inverter, and pMOS M4 (gate driven from Y) is the feedback that restores X. Annotated rising input: M2 turns on and pulls Y low; X only reaches about 0.5 V through M1 (a Vt drop below 0.8 V), but Y low turns on M4, which pulls X to the full 1.2 V and shuts M3 off completely; M1 then cuts off, isolating the VDDL driver from the 1.2 V node. **Lower power, reduced contention** compared with DCVS (only M4 briefly fights the input path).

**Avoid 2 supplies:** generate the low swing locally with a diode-connected (Vt-drop) transistor in series with each rail. Output swing **Vt → VDD − Vt**. The supply still sources charge at VDD, but the node only swings VDD − 2Vt:

```latex
P_{dyn} = \alpha C V_{supply} V_{swing} f,\quad V_{supply}=V_{DD},\ V_{swing}=V_{DD}-2V_t
```

The annotation flags the key point: P = α·C·V_DD·V_swing·f, so power falls **linearly** with swing (not quadratically) because the charge comes from the full VDD supply. A true lower supply gives V², a dropped swing from the high supply gives only V·ΔV. (The receiving gate must tolerate the degraded level — not full rail at either end.)

!!! guard "Common trap"
    "Low swing saves V²." Only if the charge comes from a supply at the low voltage. If you derive the low swing from VDD (Vt drops, charge sharing), the energy is C·VDD·Vswing — linear savings.

!!! why "Why it matters for std-cell / ROM work"
    Level shifters are library cells with their own .lib (two supply pins, `related_power_pin` per pin). Embedding the level shift in a flop or in the wordline driver of a memory (low-voltage periphery driving a higher-voltage array, or vice versa) is a standard trick; interviewers like asking why the pMOS of the receiving gate leaks and which direction needs a shifter.

### 8.10 Low-swing clocking

SLIDE:l08_p16_b|Intel's dual-supply latch accepts a low-VDD clock on nMOS-only clock devices; the test chip cut clock power by 71%.

The clock is the highest-activity net, so the lecture's low-swing clocking slide argues for **low VDD on the clock distribution and high VDD on the logic**: it targets the largest share of active power without hurting logic speed. The catch: it **requires new flops/latches**, because in a conventional flop a low-swing clock does not turn the clock pMOS fully off (same step-up problem as 8.9).

**Intel latch** (Krishnamurthy et al., VLSI Symposium 2002, 130 nm, 5 GHz integer core): the clock (VDDL, annotated 0.8 V) drives only nMOS devices, so it need not reach VDDH; the storage and output use VDDH. **Test chip: 71% clock power reduction.** The professor's annotation 0.8²/1.2² ≈ 0.44 is the quadratic factor if the clock net's charge comes from a 0.8 V supply instead of 1.2 V.

### 8.11 DVFS versus gating

SLIDE:l08_p17_t|Clock/power gating saves energy linearly with duty cycle, while just-in-time DVFS saves roughly with the cube.

Given a dynamic workload, either finish fast and turn off, or slow down to just meet the deadline:

- **Clock/power gating — linear:** run at f_normal, VDD_normal until done, then gate.

```latex
Energy = P_{V_{dd}}\cdot t_{on} = P_{V_{dd}}\cdot t_{task}\cdot(\text{duty cycle})
```

- **Just-in-time DVFS — cubic** (slide's statement): stretch each task over its whole slot, lowering f and VDD together.

```latex
Energy = P_{V_{scaled}}\cdot t_{task} = (f_{scaled}\, C_s V_{scaled}^2)\, t_{task} \propto (\text{duty cycle})^3
```

Reading the cubic: with duty cycle d, just-in-time DVFS runs at f = d·f_normal and (ideally) V ∝ f, so P ∝ f·V² ∝ d³ over the fixed slot t_task. Gating runs at full power for d·t_task, so energy ∝ d. The ratio is d² — the C·V² per operation saving. Either way, DVFS beats race-to-idle as long as leakage is small and VDD has headroom above Vt.

- Interviewer angle: when does race-to-idle win? When leakage (and fixed overheads like PLL/regulators) dominates, or when VDD is already near its minimum so slowing down only adds leakage time. (added)
- Lecture 9's design-space table puts it together: dynamic power — design time: logic design, sizing, low-C circuits; run time: clock gating; adaptive: DVFS.

!!! core "Core idea"
    Lowering C is always the best strategy (no speed penalty); the voltage knob is the strongest but trades speed; multiple supplies and lower supplies need level converters on step-up. (Lecture summary.)

### 8.x Check yourself

1. **A full output 0→1→0 cycle draws how much energy from VDD, and where is it dissipated?** C·VDD². ½CV² in the pMOS during the rise; ½CV² stored then dissipated in the nMOS during the fall. Independent of R.
2. **What is α for a clock, a signal that toggles every cycle, and random data?** 1, ½, and 0.25 (= P0·P1 with P = 0.5) in this course's 0→1 convention.
3. **4-input AND as NAND2-NAND2-NOR2 with P = 0.5 inputs: α at the NAND outputs and at Y?** NAND outputs P1 = 0.75, α = 3/16; Y = NOR: P1 = 1/16, α = 15/256.
4. **Estimate the 1 B-transistor 65 nm chip's dynamic power.** C_logic = 27 nF (α 0.1), C_mem = 171 nF (α 0.02), 1 V, 1 GHz → ~6.1 W.
5. **Why does a latch with 14C on data and 2C on clock beat one with 8C/8C?** Weighted by activity (0.1 and 1): 3.4C vs 8.8C switched per cycle.
6. **Pipelined vs parallel datapath power and area?** Pipelined: V/1.7, C ×1.15, P = 0.39, area 1.3. Parallel: V/1.7, C ×2.15, f/2, P = 0.36, area 3.4. Both: 2.0 V, 0.2, area 3.7.
7. **Which direction needs a level converter, and why?** VDDL→VDDH: the receiving pMOS sees |Vgs| = VDDH − VDDL and does not turn off. Step-down needs none.
8. **A swing reduced by Vt-drop devices from a single VDD supply saves how much?** P = α·C·VDD·(VDD − 2Vt)·f — linear in swing, not quadratic.


## Lecture 9 — Static Power (Leakage)

This lecture catalogs the leakage currents in a MOSFET (junction/BTBT, subthreshold, GIDL, gate tunneling), builds the subthreshold equation with DIBL and body effect into a form you can do arithmetic with, and then uses it to explain the stack effect and the strong input-state dependence of gate leakage. The second half covers the leakage-reduction toolbox: state assignment, power gating (MTCMOS), dual-Vt, and body biasing. For a standard-cell or ROM designer this is the most directly "interviewable" lecture: .lib leakage tables are per-state for exactly the reasons shown here, and a NOR-ROM bitline is a contest between one ON cell and n·Ioff of OFF cells.

### 9.1 Leakage mechanisms I1 and I2: junction and subthreshold

SLIDE2:l09_p02_t|I1 is reverse-biased junction leakage, typically below 1 fA/µm² and negligible, plus band-to-band tunneling.||l09_p02_b|I2 is subthreshold (weak-inversion) conduction, the dominant leakage in modern devices.

- **I1: reverse-biased p-n junction** (drain/source diffusion to substrate/well). Typically **< 1 fA/µm²** — negligible. Scales with the **area and perimeter** of diffusion. At high doping it also includes **band-to-band tunneling (BTBT)**, which grows in scaled devices with heavy halo implants.
- **I2: weak-inversion / subthreshold current.** Channel is not inverted but carriers diffuse over the source-channel barrier. Raising the drain voltage extends the drain depletion toward the source and **lowers the potential barrier** (this is DIBL, 9.3). **Dominant effect in modern devices.**

### 9.2 The subthreshold equation and the "Ioff·10^(V/S)" form

SLIDE2:l09_p03_t|Subthreshold current is exponential in Vgs; rewriting it relative to Ioff gives a base-10 form with slope S ≈ 100 mV/decade.||l09_p03_b|DIBL lowers the threshold by η·Vds, so higher drain voltage increases leakage.

Physical form:

```latex
I_{ds} = I_{ds0}\, e^{\frac{V_{gs}-V_{t0}+\eta V_{ds}-k_\gamma V_{sb}}{n v_T}}\left(1-e^{\frac{-V_{ds}}{v_T}}\right)
```

- **n** is process dependent, typically **1.3–1.7**; **vT = kT/q** (≈ 26 mV at room temperature); **Vt0** is the zero-bias threshold; **η** is the DIBL coefficient; **kγ** the linearized body-effect coefficient.

Rewritten relative to **Ioff** (current at Vgs = 0, Vds = VDD, Vsb = 0) on a log scale:

```latex
I_{ds} = I_{off}\,10^{\frac{V_{gs}+\eta(V_{ds}-V_{DD})-k_\gamma V_{sb}}{S}}\left(1-e^{\frac{-V_{ds}}{v_T}}\right),\qquad
S = \left[\frac{d(\log_{10} I_{ds})}{dV_{gs}}\right]^{-1} = n v_T \ln 10
```

The professor's annotations: e^x = 10^y ⇒ x = y·ln10, which is where the ln10 in S comes from. S ≈ 1.5 × 26 mV × 2.3 ≈ **100 mV/decade at room temperature**. Sketch: plotting log10(Ids) vs Vgs, (1) at Vgs = 0, Ids = Ioff; (2) at Vgs = 100 mV, Ids = 10·Ioff; and so on up to Vt. Every S of gate voltage is one decade of current.

!!! eq "Equation card"
    I = Ioff · 10^[(Vgs + η(Vds − VDD) − kγVsb)/S] · (1 − e^(−Vds/vT)). S = n·vT·ln10 ≈ 100 mV/dec. Memory trick: "100 mV per decade" — 100 mV of Vt, of gate underdrive, or (via η = 0.1) of 1 V of Vds each move the current by 10×, 10×, and 10× respectively.

**DIBL.** The drain's field reaches into the channel and lowers the source barrier; more pronounced in **short transistors** where drain-to-channel coupling is strong. Effective threshold:

```latex
V_t' = V_t - \eta V_{ds}
```

So **high drain voltage increases leakage.** The slide circles the η(Vds − VDD) term: leakage is referenced to Vds = VDD; any OFF device with less than VDD across it leaks less.

### 9.3 Body effect, Vds dependence, and GIDL

SLIDE2:l09_p04_t|Reverse body bias raises Vt and cuts leakage; leakage is flat in Vds above 4vT (except DIBL) and drops sharply below 2vT.||l09_p04_b|I3 is gate-induced drain leakage: with negative gate and positive drain, tunneling at the drain edge under the gate.

- **Body coefficient:** for nMOS, lowering the body relative to the source (**reverse body bias**, Vsb > 0) **increases effective Vt** and **reduces leakage** — the −kγVsb term.
- **Vds dependence** (the (1 − e^(−Vds/vT)) factor): for **Vds > 4vT** (~100 mV) the current is independent of Vds apart from DIBL; for **Vds < 2vT** (~50 mV) it **drops rapidly**. This factor is what makes the second device in a stack leak little (9.6): the bottom device has only a few tens of mV across it.
- **I3: GIDL (gate-induced drain leakage).** With **negative gate / positive drain**, the strong field in the gate-drain overlap **thins the drain depletion**, enabling **band-to-band tunneling** from drain to well near the gate. It rises as Vgs goes *more negative* — so it punishes negative-gate tricks (e.g. driving an OFF nMOS gate below ground) and high drain voltages.

### 9.4 The Id–Vgs roundup and the numbers to use

SLIDE2:l09_p05_t|On log Ids vs Vgs: S = 100 mV/decade, DIBL moves Ioff from 2.0 to 27 nA/µm between Vds = 0.1 and 1.0 V, and GIDL lifts the curve at negative Vgs.||l09_p05_b|For Vds above 50 mV, Isub ≈ Ioff·10^((Vgs + η(Vds−VDD) − kγVsb)/S), with typical 65 nm values Ioff = 1–100 nA/µm and η = kγ = 0.1.

The roundup plot (typical 65 nm-class nMOS, Ids in A/µm):

- Subthreshold slope **S = 100 mV/decade**; Vt ≈ 0.3 V.
- At Vgs = 0: **Ioff = 27 nA/µm at Vds = 1.0 V** versus **2.0 nA/µm at Vds = 0.1 V** — that vertical gap is **DIBL** (~1.1 decades).
- Below Vgs ≈ −0.2 V the curve turns *up* again: **GIDL**.

Simplified equation for Vds > 50 mV (the (1 − e) factor ≈ 1):

```latex
I_{sub} \approx I_{off}\,10^{\frac{V_{gs}+\eta(V_{ds}-V_{DD})-k_\gamma V_{sb}}{S}}
```

Typical 65 nm values (slide):

| Vth | Ioff |
|---|---|
| 0.3 V | 100 nA/µm |
| 0.4 V | 10 nA/µm |
| 0.5 V | 1 nA/µm |

DIBL coefficient **η = 0.1**, body-effect coefficient **kγ = 0.1**, **S = 100 mV/decade**.

!!! core "Core idea"
    Leakage is one exponential: every 100 mV of Vt, of negative Vgs, of reverse body bias (÷kγ = 0.1 → 1 V), or of drain voltage (÷η = 0.1 → 1 V) is a factor of 10. Reason about leakage by counting decades.

### 9.5 Gate oxide tunneling

SLIDE2:l09_p06_t|I4 is gate-oxide tunneling, rising sharply with thinner oxide and depending strongly on oxide material.||l09_p06_b|Gate leakage is exponentially sensitive to tox and VDD, larger for electrons (nMOS), negligible above 30 Å and critical near 12 Å until high-k.

- **I4: gate oxide tunneling** — carriers tunnel directly through a very thin oxide. Highly dependent on **oxide material and thickness**.

```latex
I_{gate} = W A \left(\frac{V_{DD}}{t_{ox}}\right)^2 e^{-B\frac{t_{ox}}{V_{DD}}}
```

- **A and B** are technology constants. Exponentially sensitive to tox and VDD (plot from [Song01] shows J_G vs VDD for tox from ~6 to ~15 Å, many decades apart).
- **Greater for electrons → nMOS gates leak more.**
- **Negligible for older processes (tox > 30 Å)**; **critically important at 65 nm and below (tox ≈ 12 Å)**; improved again with **high-k metal gate** (physically thicker dielectric for the same capacitance).
- Unlike subthreshold, gate leakage flows in **ON** devices (full Vgs across the oxide), so it is also state dependent — but with the opposite sense: a device leaks through its gate when it is *on*.
- The course's process is IBM 130 nm, where gate leakage is minor; it matters in the 65 nm examples.

### 9.6 Leakage levers and the stack effect

SLIDE2:l09_p07_t|The three levers: +100 mV of Vt cuts leakage ~10× but slows the gate, cooling cuts it ~5.2× per 10 °C, and stacking cuts it further.||l09_p07_b|Two series OFF devices self-reverse-bias: Vx = ηVDD/(1 + 2η + kγ) and leakage drops about 10×.

**Fundamental levers** (slide):

- **Increase Vth: ~10× leakage reduction for every 100 mV** — "but: bad for delay", since τ ∝ VDD/(VDD − Vt)^α.
- **Reduce temperature: ~5.2× reduction / 10 °C** (slide's number; temperature sensitivity is strongly process and Vt dependent — characterize it, do not assume it).
- **Stacking transistors.**

**Stack effect derivation.** Two series OFF nMOS, N2 on top (drain at VDD), N1 at the bottom; intermediate node Vx. In steady state the same current flows through both:

- N1: Vgs = 0, Vds = Vx, Vsb = 0 → I = Ioff·10^(η(Vx − VDD)/S)
- N2: Vgs = −Vx (source at Vx), Vds = VDD − Vx, Vsb = Vx → I = Ioff·10^((−Vx + η((VDD − Vx) − VDD) − kγVx)/S)

Equate exponents:

```latex
V_x = \frac{\eta V_{DD}}{1+2\eta+k_\gamma}
```

```latex
I_{sub} = I_{off}\,10^{\frac{-\eta V_{DD}\left(\frac{1+\eta+k_\gamma}{1+2\eta+k_\gamma}\right)}{S}} \approx I_{off}\,10^{\frac{-\eta V_{DD}}{S}}
```

Annotated numbers: η = 0.1, VDD = 1 V, S = 0.1 V → exponent ≈ −0.1·1/0.1 = −1 → **Isub ≈ 0.1 Ioff**. (Exact: Vx = 0.1/1.3 ≈ 77 mV, exponent −0.92, ≈ 0.12 Ioff.) **Leakage through a 2-stack reduces ~10×.**

Three mechanisms combine in the top device: **negative Vgs** (−Vx), **reverse body bias** (Vsb = Vx), and **less DIBL** (Vds < VDD). The bottom device has only Vx ≈ 77 mV across it — less DIBL, and close to the regime where the (1 − e^(−Vds/vT)) factor bites.

!!! eq "Equation card"
    Vx = ηVDD/(1 + 2η + kγ); I_stack2 ≈ Ioff·10^(−ηVDD/S) ≈ Ioff/10 for η = 0.1, VDD = 1 V, S = 100 mV. Memory trick: the 2-stack factor is "η·VDD/S decades" — DIBL decides how much stacking helps.

!!! guard "Common trap"
    The stack factor is mostly a DIBL effect. In a technology with small η (long channel, low VDD) stacking buys much less. Also: the factor applies only when *both* devices are OFF; a 2-stack with one device ON is just one OFF device with a slightly higher source.

### 9.7 Stacking data and state assignment in a NAND3

SLIDE2:l09_p08_t|Simulated stack leakage: SVT 258 → 36.1 → 19.8 pA for 1/2/3-stacks; HVT 1.25 → 0.185 → 0.122 pA.||l09_p08_b|In a NAND3, leakage ranges from 10.5 pA (all inputs 0) to 192 pA (all 1); dominant states have only one OFF device in the path.

**Stacking and leakage (table on the slide):**

| Stack | SVT leakage (pA) | Reduction | HVT leakage (pA) | Reduction vs SVT-1 | Reduction per HVT |
|---|---|---|---|---|---|
| 1 | 258 | ×1 | 1.25 | ×206 | ×1 |
| 2 | 36.1 | ×7.1 | 0.185 | ×1394 | ×6.8 |
| 3 | 19.8 | ×13 | 0.122 | ×2115 | ×10.3 |

- The 2-stack factor (×7.1 SVT, ×6.8 HVT) matches the ~10× estimate in order of magnitude; the third device adds less than another 2× (diminishing returns — the second-from-top node voltages shrink).
- HVT alone is ×206 — over two decades, consistent with the "10× per 100 mV" rule for a Vt shift of a bit over 200 mV.

**State assignment in a NAND3** (P1–P3 parallel pMOS, N1–N3 series nMOS; nMOS width 480 nm, pMOS 320 nm; currents in pA):

| A B C | Leakage (pA) | Leaking transistors |
|---|---|---|
| 0 0 0 | 10.537 | N1, N2, N3 |
| 0 0 1 | 18.534 | N1, N2 |
| 0 1 0 | 18.234 | N1, N3 |
| 0 1 1 | 135.772 | N1 |
| 1 0 0 | 20.350 | N2, N3 |
| 1 0 1 | 102.672 | N2 |
| 1 1 0 | 100.970 | N3 |
| 1 1 1 | 192.174 | P1, P2, P3 |

- **Only a few states have significant leakage**: those with **only one transistor OFF in any path from VDD to GND** (highlighted on the slide: 011, 101, 110, 111).
- 111: three OFF pMOS in **parallel** → three single-device leakages add → worst case (192 pA).
- One OFF nMOS (011/101/110): ~100–136 pA; the variation among them is the position in the stack (the OFF device's Vds and body bias differ when ON devices sit above or below it).
- Two or three OFF nMOS: 10–20 pA — the stack effect.
- Max/min ≈ 18×.

!!! why "Why it matters for std-cell / ROM work"
    This table *is* a .lib leakage characterization: `leakage_power` groups with `when : "A&B&!C"` and so on, one per state, plus `cell_leakage_power` (typically the state-probability-weighted average). A NOR ROM bitline is the same physics in the opposite topology: n cells in parallel, each a single OFF nMOS with full Vds — the bitline sees **n·Ioff**, with no stack factor to help, which is why the keeper must out-source n·Ioff at the hot/fast corner while still being overpowered by one ON cell.

### 9.8 State dependence at block level and input-vector control

SLIDE2:l09_p09_t|Single-gate leakage varies up to 101× across states, but whole blocks vary only 1.2–1.8× because many gates average out.||l09_p09_b|Find the minimum-leakage input vector (30–40% variation) and force it with sleep-controlled latches.

Table (leakage current in nA):

| Block | Min | Mean | Max | Max/Min |
|---|---|---|---|---|
| Adder1 | 256.8 | 283.1 | 309.8 | 1.2 |
| Control | 33.8 | 45.97 | 60.23 | 1.78 |
| Decoder | 1702.5 | 1914.3 | 2122.1 | 1.25 |
| Nand4 | 0.07 | 0.76 | 7.1 | 101.4 |
| OAI21 | 0.84 | 7.73 | 17.78 | 21.2 |
| Tinv | 0.37 | 1.89 | 5.76 | 15.6 |
| AOI21 | 2.44 | 8.51 | 17.23 | 7.1 |

- **Circuit state is partially unknown in sleep.** For a block, the many gates' states are correlated and averaged, so **variation is much less for an entire circuit than for individual gates** (1.2–1.8× vs 7–101×).
- **Input-vector control / state assignment:** find the input to a combinational block that minimizes leakage (**30%–40% variation** with input vector), and **modify the latches** so a **Sleep** signal forces those predetermined values into the logic (annotated circuit: a latch output gated by Sleep to force a 0 or 1).
- The NAND4 row (101×) shows why: all-ones has 4 parallel OFF pMOS, all-zeros has a 4-stack.

!!! guard "Common trap"
    Quoting a gate's "leakage" as one number. Per-gate leakage varies by 1–2 decades with state; per-block leakage varies far less. Always ask "at what input state, temperature, and corner?"

### 9.9 Power gating (MTCMOS) and state retention

SLIDE2:l09_p10_t|Power gating uses high-Vt header/footer switches to create virtual rails, with output isolation; the switch costs IR drop when on and dynamic power to toggle.||l09_p10_b|A state-retaining MTCMOS latch keeps a high-Vt, always-powered storage loop so data survives standby.

**Power gating, aka MTCMOS (multi-threshold CMOS):**

- **Turn OFF power to idle blocks** via a header pMOS (Sleep̄) and/or footer nMOS (Sleep), creating **virtual VDD and virtual GND**.
- **Use high-Vt** for header/footer so the switch itself leaks little; the logic inside can be low-Vt for speed.
- **"Gate" outputs** (isolation) to avoid driving invalid/floating levels into the next, still-powered block.
- **Voltage drop across the sleep transistor** during normal operation slows the logic → **size it wide enough** to minimize the impact (it is a resistor in series with every gate's supply).
- **Switching the sleep transistor costs dynamic power** (charging the virtual rail and the big switch gate) → **only justified when the circuit sleeps long enough** (break-even time).
- In sleep the block **loses state**; retention needs special flops.

**State-retaining MTCMOS latch** [Mutoh et al., JSSC 8/95]: the main latch is low-Vt and gated by SBY (standby) switches; a **high-Vt** feedback/keeper path stays powered and holds the data during standby, so state survives without the leakage of the low-Vt path.

!!! why "Why it matters for std-cell / ROM work"
    Header/footer switch cells, isolation cells, and retention flops are standard library cells. Memories use the same idea: periphery is power-gated while the array is kept in a low-leakage retention state (reduced or source-biased supply). Interviewers ask how to size the switch (IR drop vs leakage vs area), how to manage rush current on wake-up, and what the break-even sleep time is.

### 9.10 Sleep transistor layout and dual-Vt logic

SLIDE2:l09_p11_b|Use low Vt only on critical paths; assignment per gate or per transistor needs no clustering and no level converters.||l09_p12_t|Vt can be assigned per gate, per pull-up/pull-down half, per stack, or per transistor, with finer control costing library size and design-rule area.

(A supporting slide, Tschanz ISSCC'03, shows PMOS and NMOS sleep transistors laid out in the M3/M4 power grid between real and virtual VCC/VSS rails.)

**Dual-thresholds inside a logic block:**

- **Minimum energy is reached when all paths are critical** (have the same delay) — any slack is wasted energy that could have been traded for higher Vt (or lower VDD, or smaller size).
- **Use low Vt on timing-critical paths, high Vt elsewhere.** Assignment per gate or per transistor; **no clustering** of logic needed and **no level converters** (unlike multi-VDD) — the big practical advantage.

**Vt assignment granularity:**

- **Gate level** (whole cell one Vt).
- **Pull-up / pull-down network** (half gate): single Vt in PUN or PDN.
- **Stack based**: single Vt in series-connected transistors.
- **Individual transistors within a stack**: possible **area penalty** — the slide's sketch shows the **design rule constraint for different Vt assignment** (implant-layer spacing between adjacent devices of different Vt).
- **More library cells with finer control**: better leakage/delay trade-off, but harder for synthesis tools.

!!! core "Core idea"
    Dual-Vt is the cheapest leakage knob in active mode: same supply, no converters, swap cells on non-critical paths. Its limit is that it cannot reduce leakage on critical paths and saves little when the timing slack histogram is narrow.

### 9.11 Body biasing and VTCMOS

SLIDE2:l09_p12_b|Dynamic body bias applies about 450 mV forward bias in active mode for speed and about 500 mV reverse bias in idle mode for leakage, needing a triple well.||l09_p13_t|VTCMOS biases the n-well and an isolated p-well separately (VBBP, VBBN) to move Vt at run time.

**Dynamic body bias:**

- **Active mode — forward body bias (FBB):** PMOS body ~**450 mV below VCC**, NMOS body ~**450 mV above VSS** → lower |Vt|, faster.
- **Idle mode — reverse body bias (RBB):** PMOS body ~**500 mV above VCC** (V_HIGH), NMOS body ~**500 mV below VSS** (V_LOW) → higher |Vt|, lower leakage.
- **Triple well needed** to bias the nMOS body independently of the substrate.

How much does RBB buy? With kγ = 0.1 and S = 100 mV/dec, 500 mV of RBB → kγ·Vsb/S = 0.5 decade ≈ 3× (back-of-envelope from 9.4's numbers). Body effect weakens with scaling, and RBB raises GIDL/BTBT (larger drain-to-body voltage), so RBB has diminishing returns in deep-submicron. (added)

**VTCMOS (variable-threshold CMOS):** n-well tied to VBBP, p-well (inside an **n-isolation** deep well, on p-sub) tied to VBBN, separate from VDD/VSS, so Vt can be adjusted by the bias generators.

### 9.12 Overview and the design space

SLIDE2:l09_p13_b|Four techniques: MTCMOS (high-Vt switches), dual-Vt, state assignment, and variable-Vt via substrate bias.||l09_p14_t|Dynamic and leakage power knobs sorted by design time, run time, and adaptive (variable throughput).

| | Design time | Run time | Run time / adaptive |
|---|---|---|---|
| **Dynamic** | Logic design, sizing, low-C circuits | Clock gating | DVFS |
| **Leakage** | Multi-Vth, stack effect | Sleep transistors, state assignment, variable Vth | Sleep transistors, variable Vth |

**Conclusions (slide):**

- **Standby-mode** leakage reduction can be **orders of magnitude**, but **may lose state** and **takes time to switch in and out**.
- **Active-mode** leakage reduction is **tougher**: smaller savings, and the circuit **must be ready for inputs to toggle at any time** (so only design-time techniques — dual-Vt, stacking, longer L — and slow-adapting body bias apply).

### 9.13 Characterizing the leakage of a standard-cell library with minimal compute

The question an interviewer asks: *"How would you characterize the leakage of a standard cell library with minimal compute?"* The lecture already contains every ingredient; the procedure below assembles them. Steps marked (added) go beyond the slides.

**What has to be produced.** For each cell, each PVT corner: leakage per input/internal state (the `when` conditions) and an average `cell_leakage_power`. The NAND3 table (9.7) is one cell at one corner. A library has hundreds to thousands of cells, several Vt flavors, and many corners, and a 6-input cell has 64 states — brute-force SPICE of everything is the expensive baseline.

**1. Leakage is a DC problem — never run transients.** Leakage at a fixed state is a DC operating point: set inputs, solve `.op`, read the supply current (and gate currents). One DC solve per state is orders of magnitude cheaper than a transient. Sequential cells need the internal state (Q/QN, latch node) initialized too — use `.ic`/`.nodeset` and treat the stored value as an extra "input". (added)

**2. Characterize the device once, then compose.** By 9.4, every device's subthreshold current is Ioff·10^((Vgs + η(Vds − VDD) − kγVsb)/S), and gate leakage is W·A·(VDD/tox)²·e^(−B·tox/VDD) (9.5). So extract, per Vt flavor and corner, from a handful of DC sweeps on single transistors: Ioff per µm, S, η, kγ, and gate-leakage per µm (ON and OFF). Then each cell state reduces to a small network of OFF devices (added):

- parallel OFF devices **add** (NAND3 state 111 ≈ 3 single pMOS leakages);
- series OFF devices are divided by the **stack factor** — compute it analytically with Vx = ηVDD/(1 + 2η + kγ), or tabulate it once from SPICE (×7.1 for 2, ×13 for 3 in the SVT data, ×6.8/×10.3 in HVT);
- the leakage of each path is set by its OFF devices only; ON devices are near-shorts;
- add gate leakage of ON devices (and nMOS-dominated: electrons tunnel more).

This "device table + topology" model needs only a netlist traversal per state, not a solve.

**3. Prune the states: only one-OFF-device states matter.** From 9.7, the dominant states are those with **only one transistor OFF in any VDD→GND path**; multi-OFF stacks are ~10× smaller. For the average, one needs mostly the high-leakage states. Use logical symmetry too: inputs in the same parallel network are interchangeable, and positions within a series stack differ only slightly (NAND3: 18.5, 18.2, 20.4 pA for the three two-OFF states; 136, 103, 101 pA for the one-OFF states). Simulate one representative per equivalence class and map the rest. (added)

**4. SPICE only where it pays.** Run full DC SPICE on (a) the dominant states of each cell family and (b) a sample of cells, and use those runs to calibrate the composition model (stack-position correction, junction/GIDL contributions); fall back to SPICE only where the model error exceeds a threshold. (added)

**5. Sweep PVT cheaply by exploiting the exponential.** log(I) is nearly linear in Vt shift, VDD (through η: ΔVDD = 100 mV → η·ΔV/S = 0.1 decade ≈ 1.26× at η = 0.1), and body bias, and smooth in temperature. Simulate two or three temperatures/voltages and fit/interpolate in log space instead of rerunning every corner. Calibrate the temperature factor from the device itself (the slide quotes ~5.2× per 10 °C; the real number is process and Vt specific). Leakage signoff is dominated by the **fast-process, high-temperature, high-VDD corner**. (added)

**6. Reuse across Vt flavors and sizes.** Leakage scales with width (per-µm Ioff), and an HVT version of a cell is the SVT version with a different Ioff (×206 in the slide's data) and nearly the same stack factor (×6.8 vs ×7.1). Characterize drive-strength variants by width scaling, and Vt variants by device-table swap, then spot-check. (added)

**7. Report.** Per-state values as `leakage_power` with `when` conditions, plus `cell_leakage_power` = probability-weighted average (equal probabilities if nothing better is known; 9.8 shows block-level averages vary only 1.2–1.8× with state, so the average is a reasonable block estimate). (added)

!!! why "Why it matters for std-cell / ROM work"
    The same composition applies to a ROM column: bitline leakage = (number of cells on the bitline that are OFF but programmed/connected) × Ioff(single device, full Vds, hot/fast corner), with no stack factor; sense margin and keeper sizing are set by the ratio of one ON cell's current to that sum. A 2-device stacked access path (e.g. column mux in series) gets the ~10× stack benefit — a design lever.

!!! core "Core idea"
    Leakage characterization is DC, exponential, and topological: extract a few device parameters per Vt and corner, compose cell states from parallel-add / series-stack rules, simulate only the dominant one-OFF-device states, and interpolate corners in log space.

### 9.x Check yourself

1. **Name the four leakage mechanisms and the dominant one.** I1 reverse-biased junction (with BTBT), I2 subthreshold (dominant), I3 GIDL, I4 gate-oxide tunneling.
2. **What is S, and why ~100 mV/decade?** S = n·vT·ln10 ≈ 1.5 × 26 mV × 2.3 ≈ 90–100 mV per decade of current; 10× leakage per 100 mV of Vt.
3. **From the roundup plot, how much does DIBL change Ioff between Vds = 0.1 V and 1.0 V?** 2.0 → 27 nA/µm, about 13× (η = 0.1 with S = 100 mV/dec predicts 10^0.9 ≈ 8×; the plotted device has stronger DIBL).
4. **Derive the 2-stack leakage.** Equate currents: Vx = ηVDD/(1 + 2η + kγ); I ≈ Ioff·10^(−ηVDD/S) ≈ 0.1 Ioff for η = 0.1, VDD = 1 V. Mechanisms: negative Vgs, reverse body bias, reduced DIBL on the top device.
5. **Which NAND3 input state leaks most and why?** 111: three OFF pMOS in parallel, 192 pA. Least: 000 (three-stack), 10.5 pA. Dominant states have only one OFF device in a path.
6. **Why does block leakage vary only 1.2–1.8× with input vector while a NAND4 varies 101×?** Averaging over many gates whose states are correlated and mixed; still 30–40% is worth recovering by forcing a min-leakage vector in sleep.
7. **MTCMOS trade-offs?** High-Vt switches cut standby leakage by orders of magnitude, but cost IR drop (size wide), area, wake-up energy/time (break-even sleep time), isolation cells, and lost state unless retention latches are used.
8. **Why is dual-Vt easier to deploy than multi-VDD?** No level converters and no clustering; cells can be swapped individually on non-critical paths.


## Lecture 10 — SRAM

This lecture builds a static memory from the bitcell outward: the 6T cell and its read and write operations, the two sizing ratios that keep reads non-destructive and writes possible, static noise margin, layout, low-voltage assists, 8T/10T cells, leakage control, and the column circuitry (precharge, sense amplifiers, column muxes) and hierarchy around the array. For a ROM or register-file designer almost every idea carries over directly. A ROM bitline is a precharged wired-NOR column read through a sense amplifier and column mux. The tension between cell density, bitline capacitance, leakage and sensing speed is the same one.

### 10.1 Array organization and the 6T cell

SLIDE2:l10_p01_b|An SRAM is a 2^n-row by 2^m-column array of cells with a row decoder, bitline conditioning on top and column circuitry at the bottom.||l10_p02_t|The 6T cell stores a bit in cross-coupled inverters and reaches the bitlines through two access transistors gated by the wordline.

**Terminology (slide 2):** a **cell** stores one bit. A horizontal **row** of cells shares a **wordline (WL)**, driven by the **row decoder**. A vertical **column** shares a pair of **bitlines (BL, BL_b)**. Above the array is **bitline conditioning** (precharge), and below it is **column circuitry** (sense amps, write drivers, column mux). An n-bit address splits into row bits (to the row decoder) and column bits (to the column mux), and the data port is 2^m bits wide before column muxing.

**6T cell (slide 3):** used in most commercial chips. Two cross-coupled inverters store A and A_b. Two NMOS **access** (pass) transistors connect A to bit and A_b to bit_b when the word line is high.

- **Read:** precharge bit and bit_b high, then raise the wordline. The side storing 0 discharges its bitline.
- **Write:** drive the data differentially onto bit and bit_b, then raise the wordline. The low bitline overpowers the cell.

The professor's annotation marks VDD on the precharged bitlines and on the internal "1" node — every read begins with both bitlines at VDD.

!!! core "Core idea"
    One cell, two opposite requirements. A **read** must not disturb the cell, so the cell must win against the bitline. A **write** must flip the cell, so the bitline must win against the cell. All of 6T sizing reconciles those two.

### 10.2 Static noise margin and the butterfly curve

SLIDE:l10_p02_b|The SNM is the side of the largest square that fits inside the butterfly curve's lobes, here 0.32 V.

**Static noise margin (SNM)** is the DC noise voltage Vn that can be inserted in series with both inverters (in the worst-case polarity) before the cell loses one of its stable states.

How it is constructed:

1. Plot inverter I's VTC (V2 vs V1) and inverter II's VTC mirrored (V1 vs V2) on the same axes. The result is a **butterfly curve** with two lobes and three intersections (two stable states and the metastable point on the line of symmetry).
2. Adding the noise source Vn shifts one curve relative to the other. When the shift equals the side of the **largest square that fits inside a lobe**, the two curves touch, the lobe closes, and only one stable state remains.
3. **SNM = side of the largest embedded square** (take the smaller lobe if asymmetric). On the slide, VDD = 1.0 V and **SNM = 0.32 V**.

Kinds of SNM (standard):

- **Hold SNM** — wordline off. The cell is just two inverters, so the lobes are large.
- **Read SNM** — wordline on and bitlines precharged at VDD. The access transistor pulls the "0" node up, which squeezes the lobes. **Read SNM is the binding stability metric for a 6T cell**, and it is much smaller than hold SNM.
- (added) **Write margin** is the converse: with the bitline driven low, a successful write needs the butterfly to collapse to *one* intersection. It is often quoted as the highest WL voltage (or bitline voltage) at which the write fails.

!!! guard "Common trap"
    The SNM square goes inside the lobe, between the two curves, and is measured along an axis. It is **not** the diagonal distance, and it is **not** VDD/2 minus something. Also state which SNM you mean: hold SNM can look great while read SNM is the number that fails at low VDD.

### 10.3 Read operation and the cell ratio

SLIDE2:l10_p03_t|During a read the bitline on the 0 side discharges through access and pull-down devices, and the 0 node bumps up.||l10_p03_b|The access transistor and pull-down NMOS form a divider that raises node A while bit discharges.

The lecture's naming: **P1, N1** = inverter driving **A** (pull-up, pull-down); **P2, N3** = inverter driving **A_b**; **N2** = access transistor on the bit side; **N4** = access transistor on the bit_b side.

**Read sequence, example A = 0, A_b = 1:**

- Precharge bit and bit_b high and turn on word.
- bit discharges through **N2 (access) in series with N1 (pull-down)**. bit_b stays high, since A_b = 1 means no current flows.
- Node A, which should be 0, **bumps up slightly**. N2 pulls it toward the precharged bit at VDD while N1 holds it toward ground. It is a resistive divider.

**Read stability:** A must not rise past the trip point of the inverter (P2/N3) that drives A_b, or the cell flips (a **destructive read**). This requires the pull-down to be stronger than the access transistor:

```latex
\text{Read stability:}\quad N_1 > N_2
```

The slide 6 waveform shows word rising at about 100 ps, bit falling slowly over several hundred ps (high capacitance), and A rising only a small amount before settling. The annotation redraws the read path as a stack: the WL-gated access device on top, the VDD-gated pull-down below, and the middle node A.

(added) A first-order estimate of the bump ΔV: the access device is saturated (Vgs = VDD − ΔV ≈ VDD) and the pull-down is linear (Vgs = VDD, Vds = ΔV). Equating currents:

```latex
\frac{k_{acc}}{2}\,(V_{DD} - \Delta V - V_t)^2 \;=\; k_{pd}\!\left[(V_{DD} - V_t)\,\Delta V - \frac{\Delta V^2}{2}\right]
```

A larger k_pd/k_acc gives a smaller ΔV.

SLIDE2:l10_p04_t|The read bump on node A falls as the cell ratio rises, so a CR around 1.2 to 2 keeps the bump well below the trip point.||l10_p05_b|Sizing order: pull-down strong, access medium, pull-up weak.

**Cell ratio (also called the beta ratio):**

```latex
CR \;=\; \frac{W_{N1}/L_{N1}}{W_{N2}/L_{N2}} \;=\; \frac{(W/L)_{\text{pull-down}}}{(W/L)_{\text{access}}}
```

The slide 7 plot shows **voltage rise vs CR** for CR from about 0.5 to 3. The rise falls monotonically, from about 1 V at very small CR to about 0.2 V at CR = 3. The professor circled **CR ≈ 1.2, rise ≈ 0.4 V** and drew an arrow toward larger CR: a bigger cell ratio gives a smaller bump and better read stability, at the cost of area.

**SRAM sizing summary (slide 10):**

- High bitlines must not overpower the inverters during reads → **pull-down strong vs access**.
- Low bitlines must be able to write a new value → **access medium vs pull-up**.
- So the ordering is **pull-down (strong) > access (medium) > pull-up (weak)**.

### 10.4 Write operation and the pull-up ratio

SLIDE2:l10_p04_b|To write, drive one bitline low and raise the wordline; the access device must overpower the PMOS pull-up so A_b falls and the cell flips.||l10_p05_t|The A_b voltage during write rises with the pull-up ratio, so the PMOS must be weak relative to the access NMOS.

**Write sequence, example A = 0, A_b = 1, writing bit = 1, bit_b = 0:**

- Drive bit high and bit_b low, then turn on word.
- **Force A_b low first.** Access transistor N4 pulls A_b toward bit_b = 0 while pull-up P2 holds A_b at VDD.
- Once A_b falls below the trip point of inverter P1/N1, A rises, the feedback reinforces, and the cell flips. The waveform shows A_b dropping sharply at word rise and A then rising to 1.

Why write through the 0 side? Pulling A up from the bit = 1 side can't work. The NMOS access device passes a weak 1 (stops at VDD − Vt), and the cell ratio is chosen specifically so that the access device cannot pull the 0 node up. That is read stability. **Writes always happen by pulling the 1 node down.**

**Writability:** the access transistor must overpower the feedback inverter's pull-up:

```latex
\text{Writability:}\quad N_4 > P_2
\qquad
PR \;=\; \frac{W_{P2}/L_{P2}}{W_{N4}/L_{N4}} \;=\; \frac{(W/L)_{\text{pull-up}}}{(W/L)_{\text{access}}}
```

The slide 9 plot shows **cell voltage (A_b during the write) vs pull-up ratio**, rising roughly linearly from 0 to about 0.45 V as PR goes from about 0.3 to 2. The annotation circles the high-PR end (≈1.8, ≈0.4 V) and points left. **A smaller PR pulls A_b lower and makes the write more reliable.** The node must get below the opposite inverter's switching threshold.

!!! eq "Equation card"
    **CR = (W/L)pull-down / (W/L)access** — must be large (≈1.2 to 2+) for **read stability** (N1 > N2).

    **PR = (W/L)pull-up / (W/L)access** — must be small (≲1 to 1.5) for **writability** (N4 > P2).

    Order: **pull-down > access > pull-up**. Memory trick: "**Read: cell beats bitline. Write: bitline beats cell.**"

!!! guard "Common trap"
    The two ratios share a denominator, the access transistor. Making the access device stronger speeds reads and helps writes, but it hurts read stability. Making it weaker helps stability but slows reads and hurts writability. Being asked "what if I upsize the access transistor?" is a standard interview probe. Name both consequences.

### 10.5 Cell layout and density

SLIDE2:l10_p06_t|A textbook 6T cell is 26 by 45 lambda; tiles mirror to share VDD, GND and bitline contacts.||l10_p06_b|Thin-cell layout keeps poly and diffusion straight and in one direction, and also shortens the bitlines.

**Cell size is critical** because the array is the cell multiplied by millions:

- Textbook cell: **26 × 45 λ** = 1170 λ². With λ = F/2 that is about 290 F². Industry cells are much smaller, **≈130 F²**.
- **Tile cells sharing VDD, GND and bitline contacts.** Adjacent cells are mirrored, so one contact serves two cells. That is why the sense-amp slide counts "64C" of diffusion for 128 cells.

**Thin cell (lithographically friendly), slide 12:**

- In nanometer CMOS, **avoid bends in poly and diffusion** and **orient all transistors in one direction**. Straight, one-directional shapes print reliably with restricted design rules.
- The thin cell is wide and short. Wordline poly runs horizontally across it, and bit, VDD, bit_b and GND run vertically.
- Because the cell is short in the bitline direction, it **reduces the length and capacitance of the bitlines**. This gives faster reads and less precharge energy.

SLIDE2:l10_p07_t|Five Intel generations show steady cell-area scaling, with the switch to the thin cell at 65 nm.||l10_p07_b|A published 65 nm cell uses pull-down 130/65, pull-up 115/65 and access 100/75 nm, about 1 µm² at 90 nm and 0.25 µm² at 45 nm.

- Commercial SRAMs (slide 13): Intel cell micrographs from 130 nm to 32 nm. The **transition to the thin cell happened at 65 nm**, and cell area scales steadily, roughly halving each node on a log plot.
- **Example 65 nm sizing (slide 14, from Liu and Kursun, ISCAS 2007).** W/L in nm: access N3/N4 = **100/75**, pull-ups P1/P2 = **115/65**, pull-downs N1/N2 = **130/65**. Note that the paper's labels differ from the lecture's. In the paper, N1/N2 are the pull-downs and N3/N4 are the access devices. The access transistor uses a **longer L (75 nm)** to weaken it without shrinking W, and the ratios work out to:

```latex
CR = \frac{130/65}{100/75} = \frac{2.0}{1.33} \approx 1.5,
\qquad
PR = \frac{115/65}{100/75} = \frac{1.77}{1.33} \approx 1.33
```

- **Rule of thumb on the slide:** a 6T cell is **≈1 µm² at 90 nm** and **≈0.25 µm² at 45 nm**. Both are about 120 to 125 F², consistent with the "130 F²" figure.

!!! why "Why it matters for std-cell / ROM work"
    Memory cells are drawn under relaxed "bitcell" rules and pushed far denser than logic. A ROM cell (one transistor, or a programmed contact/via) is denser still. The same thin-cell logic applies: unidirectional poly, shared contacts between mirrored rows, and a short cell in the bitline direction to cut bitline C. Shared diffusion contacts are also why bitline capacitance is quoted per *pair* of cells.

### 10.6 Low-voltage operation: read and write assists

SLIDE:l10_p08_t|At low VDD the 6T cell degrades, so read and write assists or a different bitcell are needed.

Lowering VDD is the main power knob, but at low VDD the 6T margins collapse. Vt variation becomes a large fraction of VDD, and the CR/PR balance no longer has room for both read and write. Options from the slide:

**Read-assist techniques** (make the cell win the read):

- **Lower the wordline voltage** (WL underdrive). This weakens the access device, raising the effective CR. The cost is a slower read.
- **Raise the cell VDD during read.** This strengthens the cross-coupled inverters.

**Write-assist techniques** (make the bitline win the write):

- **Drive the bitline to a negative voltage** (negative-BL assist). The access device sees a larger Vgs and pulls the 1 node down harder.
- **Raise the wordline voltage** (WL overdrive). This strengthens the access device. It hurts half-selected cells on the same row.
- **Float the cell VDD/ground** or **lower the cell VDD** (VDD collapse). This weakens the pull-up that fights the write.

Read and write assists pull in **opposite directions** on the same knobs (WL level, cell VDD). That is why they are applied only during the operation that needs them, usually per column or per row. **Or: change the bitcell** (8T/10T, next).

### 10.7 Leakage reduction, 8T and 10T bitcells

SLIDE:l10_p08_b|Leakage is cut by lowering cell VDD, raising cell GND, sleep transistors, lowering Vgs or Vds of the access paths, or reverse body bias.

Six techniques on the slide, each shown with an active/sleep waveform:

- **Lower cell VDD** in sleep (VDDV dropped). This reduces Vds across off devices and lowers DIBL-driven subthreshold leakage and gate leakage, as long as the cell stays above its data-retention voltage.
- **Higher cell GND** (virtual ground Vs raised in sleep). This has the same effect from the bottom, and it also reverse-biases the source of the off pull-downs.
- **Sleep transistor** with a bias, a header between VDD and the subarray's VDDV. It limits the current and sets the retention voltage.
- **Lower Vgs.** Drive the wordline slightly negative in sleep so the access transistors are more strongly off.
- **Lower Vds.** Lower or float the bitlines in sleep, so the off access devices see less drain bias.
- **Reverse body bias** in sleep, which raises Vt.

(added) All of these trade wake-up time and retention margin for leakage. In big arrays leakage dominates standby power because nearly every cell is idle.

SLIDE2:l10_p09_t|The 8T cell adds a separate read port (RWL, RBL) so reads never disturb the storage nodes, at about 30% area cost.||l10_p09_b|The 10T subthreshold cell adds a read buffer that cuts bitline leakage and works down to 380 mV at 65 nm.

**8T bitcell (IBM, VLSI Symp. 2005):**

- **Decouple read and write paths.** A 6T core is written through WWL, WBL and WBL_. A two-transistor read stack is gated by the storage node and RWL and discharges a single-ended RBL.
- The storage nodes only drive a *gate* during reads, so **read SNM ≈ hold SNM**, a significant SNM improvement over 6T. Read stability no longer constrains sizing, so the 6T core can be sized purely for writability. It also behaves better at low voltage.
- **≈30% area penalty** compared to 6T. A single-ended read needs a different sensing scheme. The annotation marks the read stack (storage node at VDD turns the lower device on), and the layout sketch shows the extra poly lines.
- (added) This is also a natural 1-write/1-read two-port cell, which is why 8T-style cells are common in register files.

**10T bitcell (Chandrakasan, ISSCC 2006):**

- **Optimized for subthreshold operation.**
- It adds a more complex **read buffer** (M7 to M10) to cut **bitline leakage**. When QB = 1, leakage from unselected cells passes through a **stack** (stack effect). When QB = 0, a **pull-up PMOS** (M10) holds the internal read node so the off read device sees a small Vds. Unselected cells therefore barely leak onto RBL, and many cells can share a bitline at subthreshold VDD, where Ion/Ioff is small.
- It uses **one redundant row and dual VDDs for wordline overdrive**.
- Result: a **256 kb array functional down to 380 mV** in 65 nm.

!!! why "Why it matters for std-cell / ROM work"
    The 10T read-buffer argument is the ROM bitline problem exactly. A NOR ROM column is a precharged bitline with n cells hanging on it. The selected cell must discharge it faster than the **n − 1 unselected cells' leakage (n·Ioff)** plus noise can, and the keeper must hold a 1 against that same n·Ioff. Shorter bitlines (hierarchy), stacked or negative-gated cells, and a properly sized keeper are the same fixes used in the 10T design.

### 10.8 Column circuitry: bitline conditioning and sense amplifiers

SLIDE2:l10_p10_t|Each column needs bitline conditioning, sense amplifiers and column multiplexing.||l10_p10_b|PMOS devices precharge both bitlines high before a read, and an equalizer shorts them so the sense amp starts from zero differential.

**Column circuitry (slide 19).** Every column (or group of columns) needs:

- **Bitline conditioning** (precharge and equalize),
- **Sense amplifiers**,
- **Column multiplexing**, plus the write drivers.

**Bitline conditioning (slide 20):**

- **Precharge bitlines high before reads.** Two PMOS devices gated by φ (active low) connect bit and bit_b to VDD.
- **Equalize** with a third PMOS between bit and bit_b. This removes any residual differential from the previous access, so the sense amplifier sees only the new signal. (added) Any leftover offset subtracts directly from the sense margin.

SLIDE2:l10_p11_t|With 128 cells on a bitline, a big C discharged by a small cell current is slow, so sense amps fire on a small swing.||l10_p11_b|A clocked latch-type sense amp fires after enough swing develops, with isolation devices cutting off the bitline capacitance.

**Why sense amplifiers (slide 21):**

- Bitlines carry many cells. Example: a **32 kbit SRAM organized as 128 rows × 256 columns has 128 cells on each bitline**.
- Delay scales as

```latex
t_{pd} \;\propto\; \frac{C}{I}\,\Delta V
```

- **Big C:** even with shared diffusion contacts, the bitline sees **64C** of diffusion capacitance (128 cells / 2 per contact), plus wire.
- **Small I:** the bitline is discharged through the small access and pull-down stack of a minimum-size cell.
- So the only lever left is **ΔV**. **Sense amplifiers are triggered on a small voltage swing** (typically about 100 to 200 mV, added) instead of waiting for a full-rail swing.

**Clocked sense amp (slide 22):**

- **Clocked sense amp saves power.** It burns current only after it fires, instead of acting as a continuously biased amplifier.
- **It requires sense_clk to fire after enough bitline swing.** The timing is a margin problem. Fire too early and offset or noise flips the result. Fire too late and you lose speed and burn bitline power. Real designs generate sense_clk from a **replica bitline** that tracks the cell's discharge across PVT (added).
- **Isolation transistors** (PMOS gated by sense_clk) **cut off the large bitline capacitance** when the amp fires. The annotation marks them going 0→1, so they turn off. The regenerative latch then only has to flip its own small internal nodes, which makes it fast and keeps the latch from driving the bitlines full-swing.
- **Regenerative feedback:** cross-coupled inverters with a tail device amplify the small differential to full rail, sense and sense_b. This is the same exponential regeneration as a flop's metastability resolution (Lecture 11). A larger initial ΔV gives a faster, more reliable decision.

!!! core "Core idea"
    tpd ∝ C·ΔV / I. Since the cell can't supply more I and the bitline can't shed C, a memory gets its speed by **sensing a small ΔV** with a well-timed, offset-tolerant, clocked sense amp.

### 10.9 Column multiplexing, hierarchy and the tree decoder mux

SLIDE2:l10_p12_t|A 2k-word × 16-bit memory folded into 256 rows × 128 columns needs sixteen 8:1 column muxes.||l10_p12_b|Hierarchical blocks shorten wires and let the block address activate only one block.

**Column multiplexing (slide 23).** Arrays are **folded** to get a good aspect ratio. A 2048 × 16 array would be absurdly tall and thin, with very long bitlines.

- Example: **2 kword × 16 folded into 256 rows × 128 columns** (2048 × 16 = 32 768 = 256 × 128). Each row holds 8 words.
- The memory must select 16 output bits from 128 columns, so it needs **sixteen 8:1 column multiplexers**. The address splits into 8 row bits (256 rows) and 3 column bits (8:1).
- Folding is also what lets a sense amplifier be shared by 8 columns. The sense amp is much wider than a cell pitch.

**Hierarchical memory architecture (slide 24).** The array is split into P blocks, each with its own row decoder and column logic, plus a block selector, a global data bus and a global amplifier/driver. The advantages on the slide:

1. **Shorter wires within blocks**, meaning shorter wordlines and bitlines with less RC and C.
2. **Block address activates only 1 block**, which saves power because the other blocks' bitlines are never precharged or discharged.

SLIDE:l10_p13_t|Column muxes can be NMOS pass-transistor trees with precharged outputs, decoded directly by A0 to A2.

**Tree decoder mux (slide 25):**

- The column mux can use **pass transistors**: **nMOS only, with precharged outputs**. Because bitlines are precharged high and reads only discharge them, an NMOS passes the 0 well and never has to pass a strong 1.
- In a **tree** mux, each level is controlled by one address bit and its complement (A0/Ā0 at the leaves, then A1, then A2). There is no separate decoder, but the series stack is 3 deep for 8:1, which adds resistance.
- The slide draws **two identical trees**: one selects among bitlines B0 to B7 and drives **Y**, and the other selects among the complements B̄0 to B̄7 and drives **Ȳ**. The differential pair (Y, Ȳ) goes to the sense amps and write circuits, and the same tree carries write data back down.
- (added) The alternative is a single level of 8 pass gates driven by a separate 3:8 decoder. It has one device in series and is faster, but it adds decoder logic and puts more junction capacitance on the shared output.

(added) **Row decoders**, for completeness. These slides do not draw one, but the row decoder that drives the WLs is normally **predecoded**: groups of 2 to 3 address bits are decoded into one-hot lines, and a final NAND/NOR per row combines them, followed by a wordline driver sized by logical effort to drive the long WL. Its layout must be **pitch-matched** to the cell row height. That pitch constraint, more than speed, dictates the decoder's topology.

### 10.10 Analyzing SRAM robustness

Slide 26 lists three methods:

- **Skew-corner approach.** Simulate at global process corners where NMOS and PMOS move in opposite directions. (added) Read stability is typically worst at fast-NMOS / slow-PMOS, and writability at slow-NMOS / fast-PMOS, because each corner tips the CR or PR balance.
- **Monte Carlo.** Model *local* Vt mismatch between the six transistors of one cell. (added) An array of millions of cells must work at the cell's tail, so yield targets are around 5 to 6σ, which plain Monte Carlo reaches only with importance sampling or extrapolation.
- **Dynamic analysis.** SNM is a DC metric. A real WL pulse is finite, so a cell can survive a disturbance that would flip it in DC, and a write can fail if the pulse ends before the cell flips. Time-domain margins capture both.

!!! why "Why it matters for std-cell / ROM work"
    Memory compilers and ROM macros are signed off exactly this way. Bitcell margins use skew corners plus high-sigma statistics. The periphery (decoder, sense amp, sense timing) is signed off with Monte Carlo on the sense-amp offset against the guaranteed bitline swing. The macro's `.lib` then reports address/data setup and hold to CLK, clock-to-Q (access time), and leakage per mode, characterized the same way as a flop.

### 10.x Check yourself

1. **Define the cell ratio and the pull-up ratio, and say which operation each protects.** CR = (W/L)pull-down / (W/L)access protects **read stability**. It keeps the read bump on the 0 node below the opposite inverter's trip point (N1 > N2). PR = (W/L)pull-up / (W/L)access protects **writability**. The access device must pull the 1 node low against the PMOS (N4 > P2). The sizing order is pull-down > access > pull-up.

2. **Walk through a read of A = 0. Which bitline moves, and what is the danger?** Both bitlines are precharged to VDD, then WL rises. bit discharges through the access N2 and pull-down N1, and bit_b stays high. Node A rises slightly (the divider between N2 and N1). If it crosses the trip point of the A_b inverter, the cell flips and the read is destructive.

3. **Why is a 6T cell written by pulling the 1 node low rather than pushing the 0 node high?** The NMOS access device passes a weak 1. More importantly, the cell ratio is designed so the access device cannot raise the 0 node, since that is read stability. So the write must come from the bitline driven to 0 overpowering the weak PMOS pull-up.

4. **How is the static noise margin defined from the butterfly curve, and what was it on the slide?** Overlay one inverter's VTC with the other's mirrored VTC. The SNM is the side of the largest square that fits inside the smaller lobe, which equals the series noise voltage that eliminates one stable state. On the slide it was 0.32 V at VDD = 1.0 V. Read SNM, with WL on, is smaller than hold SNM.

5. **For the 65 nm cell (pull-down 130/65, pull-up 115/65, access 100/75), compute CR and PR. Why is the access L 75 nm?** CR = 2.0/1.33 ≈ 1.5 and PR = 1.77/1.33 ≈ 1.33. The longer access L weakens the pass gate without going below minimum width, which raises CR for read stability.

6. **Why do memories use sense amplifiers, and why is the sense amp clocked with isolation devices?** tpd ∝ C·ΔV/I. A bitline with 128 cells has big C (64C of shared diffusion) and is discharged by a tiny cell current, so the only knob is a small ΔV. A clocked sense amp burns power only when fired. It must fire after enough swing, and the isolation transistors disconnect the heavy bitlines so the regenerative latch resolves quickly.

7. **Name two read assists and two write assists. Why can't they be on all the time?** Read: lower the WL voltage, or raise the cell VDD during read. Write: a negative bitline, raising the WL, or lowering or floating the cell VDD/GND. They push the same knobs in opposite directions (WL level, cell supply), so each is applied only during its own operation.

8. **A 2k × 16 memory is folded into 256 × 128. How many column muxes, what size, and what are the benefits of a hierarchical organization?** 128/16 = 8, so sixteen 8:1 muxes (3 column-address bits, 8 row bits). Hierarchy shortens the wires inside each block and activates only the addressed block, which saves power. The mux can be an NMOS-only tree with precharged outputs, since it only has to pass a discharging 0.


## Lecture 11 — Timing and Latch Design

This lecture is where every register-to-register path in the chip gets its rules. It defines the three timing numbers of a sequential element (**setup**, **hold**, **clock-to-Q**), builds the two timing inequalities with **clock skew** and **jitter**, and then walks through the circuits that implement storage: master–slave flops, dynamic C²MOS registers, TSPC latches, and pulsed registers (including AMD's HLFF). For a standard-cell designer this is the physics behind every `setup_rising` / `hold_rising` / `rising_edge` arc in a `.lib` file, and the reason a flop is the most carefully characterized cell in the library.

### 11.1 Synchronous timing and the three timing metrics

SLIDE2:l11_p01_b|A synchronous path is launch register R1, combinational logic, and capture register R2, all on one clock.||l11_p02_t|Setup and hold bracket a window around the clock edge where D must be stable; tc-q is measured from the edge to Q.

The whole lecture rests on one picture: **R1 → combinational logic → R2**, both registers clocked by CLK. Data launched by R1 on one edge must be captured cleanly by R2 on the *next* edge (the setup race), and must not corrupt what R2 captures on the *same* edge (the hold race).

The three metrics of an edge-triggered register (slide 3):

- **Setup time, tsu** — how long before the active clock edge D must be stable.
- **Hold time, thold** — how long after the active clock edge D must stay stable.
- **Clock-to-Q delay, tc-q** — time from the clock edge (50%) to the Q transition (50%), *given* D met setup and hold.

The interval from tsu-before to thold-after the edge is the **sampling window** (or aperture). D can do anything it likes outside the window; inside it, the flop's behavior is not guaranteed.

Two delays per path, not one. Every block has a **maximum (propagation) delay** and a **minimum (contamination) delay**:

- tc-q (max) and **tc-q,cd** (contamination, the fastest Q can start to move),
- tlogic (max, the critical path) and **tlogic,cd** (the shortest path through the logic).

Setup cares only about the slow numbers; hold cares only about the fast numbers. This is the single most useful sentence for keeping the two constraints straight.

!!! core "Core idea"
    Setup is a **max-delay** check against the **next** edge. Hold is a **min-delay** check against the **same** edge. Mixing these up is the root of every confused answer about timing.

SLIDE:l11_p02_b|With ideal clocks the cycle must cover tc-q + logic + tsu, and the fastest path must outlast thold.

With an ideal clock (no skew, no jitter), the slide gives:

```latex
\underbrace{T \;\ge\; t_{c\text{-}q} + t_{logic,max} + t_{su}}_{\text{setup (max delay)}}
\qquad\qquad
\underbrace{t_{c\text{-}q,cd} + t_{logic,min} \;>\; t_{hold}}_{\text{hold (min delay)}}
```

The professor's annotation draws both as timing diagrams:

- **Setup:** CLK1 rises, Q of R1 moves after tc-q, the logic adds tlogic, and the result must land at least tsu before CLK2's next rising edge, one period T later.
- **Hold:** the *same* CLK edge that makes R2 capture also makes R1 launch new data. That new data races through tc-q,cd + tlogic,min; if it reaches R2's D before thold has elapsed, it overwrites the value R2 was supposed to hold. The annotation also sketches a shift register (flop→flop with no logic between them) — the classic worst case for hold, since tlogic,min = 0 and only tc-q,cd protects the path.

Note what is absent from the hold inequality: **T**. That observation drives the rest of the lecture.

### 11.2 Clock nonidealities: skew and jitter

SLIDE2:l11_p03_t|Skew is spatial variation of the same edge across the chip; jitter is temporal variation of successive edges at one point.||l11_p03_b|Both skew and jitter eat into the usable cycle time.

Definitions from the slide:

- **Clock skew, δ** — *spatial* variation in the arrival time of the *same* (temporally equivalent) clock edge at two different registers. It is mostly **deterministic** (wire length, buffer mismatch, load imbalance) plus a random component from device variation. Skew is static from cycle to cycle.
- **Clock jitter** — *temporal* variation in consecutive edges at a single point.
    - **Cycle-to-cycle (short-term) jitter, tJS** — the edge-to-edge period variation; this is what affects a single-cycle path.
    - **Long-term jitter, tJL** — accumulated drift over many cycles; matters for I/O and multi-cycle interfaces.
- **Duty-cycle (pulse-width) variation** — matters for **level-sensitive (latch-based)** clocking, since a latch is transparent for a phase, not an instant.

On slide 6 both skew δ and jitter tJS are drawn as shifts of an edge; the point is that **both reduce the effective cycle time** available to logic.

SLIDE2:l11_p04_t|Clock uncertainty comes from the generator, devices, supply, interconnect, temperature, load, and coupling.||l11_p04_b|Measured skew across an IBM processor's paths spans tens of picoseconds around the nominal arrival.

The seven numbered **sources of clock uncertainty** on slide 7:

1. **Clock generation** (PLL) — the source of jitter.
2. **Devices** — Vt / L mismatch between clock buffers → skew (and random skew).
3. **Interconnect** — RC mismatch in the clock wires → skew.
4. **Power supply** — supply noise modulates buffer delay → **jitter** (this is dynamic, cycle-dependent).
5. **Temperature** — gradients across the die change buffer delay → slow-varying skew.
6. **Capacitive load** — unequal flop counts / loads per branch → skew.
7. **Coupling to adjacent lines** — crosstalk on the clock net → jitter-like edge movement.

Rule of thumb: static, spatial sources (2, 3, 5, 6) show up as **skew**; dynamic, time-varying sources (1, 4, 7) show up as **jitter**.

Slide 8 is a histogram of clock arrival times (in ps) across paths on an IBM microprocessor — a real chip's skew is a distribution, not a single number, which is why timing signoff uses a skew/uncertainty margin rather than an exact value. The annotation on slide 10 sketches the two standard distribution networks: an **H-tree** (balanced, low nominal skew) and a **clock grid/mesh** (shorted network, low skew and robust to variation, at a power cost).

!!! why "Why it matters for std-cell / ROM work"
    Clock buffers and clock-gating cells are standard cells too, and their delay mismatch is skew. Library teams characterize separate clock-tree cells (balanced rise/fall, strong drive) precisely so that CTS can control δ. Supply noise on a clock buffer is jitter — another reason IR drop on the clock tree is signed off more tightly than on data cells.

### 11.3 Positive and negative skew

SLIDE:l11_p05_t|Clock routed with the data gives positive skew; clock routed against the data gives negative skew.

The sign convention used throughout the lecture:

```latex
\delta \;=\; t_{CLK2} - t_{CLK1}\qquad(\text{receiver arrival} - \text{launcher arrival})
```

- **(a) Positive skew, δ > 0:** the clock is driven from the left, in the *same* direction as data flow, so each downstream register sees the edge later.
- **(b) Negative skew, δ < 0:** the clock is driven from the right, *against* the data flow, so the receiving register sees the edge earlier.

SLIDE2:l11_p05_b|Positive skew gives the logic extra time but makes hold harder, and slowing the clock cannot fix a hold violation.||l11_p06_t|Negative skew shortens the effective cycle but relaxes hold.

**Positive skew (δ > 0)** — "launching edge arrives before the receiving edge."

- Edge ① (CLK1) launches data; edge ③ (the next CLK2 edge) captures it. Edge ③ arrives at **TCLK + δ** after ①, so the logic gets **extra time δ** → good for performance.
- But edge ② (the *same* cycle's CLK2 edge) arrives δ after ①. R2 must hold its old value until **δ + thold** after ①, so new data from R1 must take at least that long → bad for hold.
- **Key line on the slide: hold time violations cannot be fixed by running the clock slower.** The hold race is between ① and ②, which are the *same* edge; T never enters.

**Negative skew (δ < 0)** — "receiving edge arrives before the launching edge."

- The capture edge ③ is only TCLK − |δ| after the launch edge → less time for logic → bad for performance.
- The same-cycle edge ② arrives *before* ①, so R2 has already latched by the time new data leaves R1 → good for hold.

!!! guard "Common trap"
    "Skew is bad" is the wrong answer. Skew is a **trade**: positive skew lends time to the setup path and borrows it from the hold path, and negative skew does the reverse. Useful-skew optimization in CTS exploits exactly this. What is always bad is **uncertainty** (unpredictable skew and jitter), because it must be subtracted from both checks.

### 11.4 Deriving the timing constraints with skew and jitter

SLIDE2:l11_p06_b|Setup with skew: T ≥ tc-q + tsu + tlogic − δ, worst when the receiving edge comes early.||l11_p07_t|Hold with skew: tc-q,cd + tlogic,cd > thold + δ, worst when the receiving edge comes late.

This is the derivation students are expected to reproduce from scratch. Set the launching edge of CLK1 at time 0.

**Setup (max-delay) derivation**

1. R1's clock edge arrives at t = 0. The slowest data at R1's Q appears at tc-q.
2. It propagates through the slowest logic path: arrival at R2's D is at **tc-q + tlogic**.
3. R2 captures on its *next* edge, which arrives at **T + δ** (one period later, shifted by the skew).
4. D must be stable tsu before that edge:

```latex
t_{c\text{-}q} + t_{logic} + t_{su} \;\le\; T + \delta
\quad\Longrightarrow\quad
\boxed{T \;\ge\; t_{c\text{-}q} + t_{logic} + t_{su} - \delta}
```

Positive δ helps (subtracted from the requirement); **negative δ is the worst case** — "worst case is when receiving edge arrives early."

**Hold (min-delay) derivation**

1. The *same* edge that R1 uses to launch at t = 0 reaches R2 at **t = δ**. At that moment R2 is capturing the *previous* data.
2. R2 needs its D to stay at the old value until **δ + thold**.
3. The fastest new data from R1 reaches R2's D at **tc-q,cd + tlogic,cd**.
4. The new data must arrive after the hold window closes:

```latex
t_{c\text{-}q,cd} + t_{logic,cd} \;>\; t_{hold} + \delta
```

**Positive δ is the worst case** for hold ("receiving edge arrives late") — it is a **race between data and clock**. "cd" means **contamination delay**: the fastest possible delay.

**Adding jitter (from the annotation on slide 10).** The professor extends both inequalities with the cycle-to-cycle jitter tj. In the worst case the launching edge comes late by tj and the capturing edge comes early by tj, so 2tj comes off the budget:

```latex
T + \delta \;\ge\; t_{c\text{-}q,max} + t_{logic,max} + t_{su} + 2t_j
\;\;\Longrightarrow\;\;
T \;\ge\; t_{c\text{-}q,max} + t_{logic,max} + t_{su} - \delta + 2t_j
```

```latex
t_{c\text{-}q,min} + t_{logic,min} \;>\; t_{hold} + \delta + 2t_j
```

(added) In signoff STA, the hold check is launched and captured by the *same* source edge, so most PLL cycle-to-cycle jitter cancels; tools usually apply a smaller hold uncertainty than setup uncertainty. The annotation's +2tj is the conservative classroom bound.

**Why hold cannot be fixed by slowing the clock.** T appears only in the setup inequality. The hold inequality compares two things that both happen within a single edge: the clock reaching R2 (δ) and the fastest data reaching R2 (tc-q,cd + tlogic,cd). A chip with a setup violation can be sold at a lower frequency; a chip with a hold violation is **dead at every frequency**. That is why hold is fixed at design time, by:

- inserting **delay buffers** on short paths (raising tlogic,cd),
- reducing skew δ on that pair (or flipping it negative),
- using flops with a **larger tc-q,cd** or **smaller thold** (the slide 14 phrase "small hold time → inherent race immunity").

!!! eq "Equation card"
    Setup: **T ≥ tc-q + tlogic,max + tsu − δ (+2tj)** — slow numbers, next edge, T helps.

    Hold: **tc-q,cd + tlogic,cd > thold + δ (+2tj)** — fast numbers, same edge, T absent.

    Memory trick: "**setup — slow — next; hold — hurry — now.**" Positive δ: + for setup, − for hold. Every picosecond of skew moved into one inequality is taken from the other.

!!! guard "Common trap"
    Watch the sign convention. This lecture defines δ = t(receiver) − t(launcher). Some textbooks define skew the other way, which flips every sign. In an interview, state your convention before writing the inequality.

### 11.5 How setup, hold and tc-q are actually measured (CAD2)

The lecture defines setup and hold as abstract windows; the course's CAD2 assignment and Discussion 2 define *how to measure them in SPICE*. This is the definition the industry uses too.

**The key physical fact:** as D moves closer to the clock edge, the flop does not fail abruptly. The internal storage node has less and less time to settle before the feedback closes, so the cross-coupled loop starts closer to its balanced point and takes longer to resolve. The visible symptom is that **tc-q grows** as D approaches the edge ("clk-q pushout"). Very close to the edge tc-q blows up and then the flop captures the wrong value.

So "setup time" is a defined point on a continuous curve. Discussion 2 states it directly: *"Setup time point: the point at which CLK-Q delay rises 5% beyond nominal."*

**CAD2 setup procedure (post-PEX, 25 fF load on Q):**

1. Store a 1 (or 0) in the flop and let it settle a full cycle. (The CAD2 FAQ warns: skipping this step is the usual reason students get a zero or negative setup time.)
2. On the next cycle, change D at least 0.25 cycle before the rising edge and measure nominal tc-q (50% CLK → 50% Q).
3. Parametrically sweep the D transition later and later, toward the edge; tc-q increases.
4. **Setup time = the D-to-CLK separation that gives ≈5% increase in tc-q.**

**CAD2 hold procedure:**

1. Store a 1 (0) and settle for a cycle.
2. Toggle D at the falling clock edge (so the correct value is present well before the rising edge).
3. Toggle D *again* at least 0.25 cycle after the rising edge and measure tc-q.
4. Sweep that second toggle earlier and earlier, toward the edge.
5. **Hold time = the CLK-to-D separation that gives ≈5% increase in tc-q.**

Measure **rise and fall separately** — four constraint numbers (setup-rise, setup-fall, hold-rise, hold-fall) plus two delays (tc-q rise, fall). They differ because a 0 and a 1 are written through different devices (NMOS vs PMOS halves of a TG, pull-up vs pull-down stacks).

```latex
t_{su} \equiv t_{D\to CLK}\ \text{such that}\ t_{c\text{-}q} = 1.05\,t_{c\text{-}q,nom}
\qquad
t_{hold} \equiv t_{CLK\to D}\ \text{such that}\ t_{c\text{-}q} = 1.05\,t_{c\text{-}q,nom}
```

**Why define it by pushout instead of pass/fail?** Because the pushout is real delay that the downstream path sees. If you clocked D right at the pass/fail boundary, tc-q would be enormous and the *next* stage's setup would fail. The pushout criterion balances "smaller tsu" against "bigger tc-q". (added) This also means setup and tc-q are not independent: the quantity that actually matters on a path is the **D-to-Q delay** = tsu + tc-q, and its minimum sits at a D arrival somewhat before the steep part of the curve. Many industrial flows use a pushout criterion (10% is common) or a pass/fail-plus-glitch criterion; the percentage is a flow choice.

**Negative hold time.** The CAD2 FAQ: *"Why is my hold time negative? This is actually possible."* A negative hold means D may change *before* the clock edge and the flop still captures the old value. It happens when the data path from the D pin to the internal sampling node is **slower** than the clock path to the switch that closes the master (e.g., an input buffer/inverter in front of the master TG, as the robustness slide recommends). The data change is still "in flight" inside the cell when the master closes. Symmetrically, **negative setup** means D may arrive *after* the edge and still be captured — typical of pulsed latches and of any element whose sampling switch closes some delay after the clock pin edge (see 11.7 and 11.9). (added) What is always positive is the window width tsu + thold, which is the aperture in which D must not move.

**Metastability basics (added).** If D changes inside the aperture, the cross-coupled pair can be left near its balanced point VM. Linearizing the loop, a small initial imbalance V0 grows exponentially with the regeneration time constant τ (≈ C/gm of the loop):

```latex
\Delta V(t) = \Delta V_0\, e^{t/\tau}
\qquad
P(\text{unresolved after } t_r) \propto e^{-t_r/\tau}
\qquad
\text{MTBF} = \frac{e^{t_r/\tau}}{T_0\, f_{clk}\, f_{data}}
```

Inside a synchronous design, setup/hold signoff guarantees D never enters the window, so metastability does not occur. It matters only for **asynchronous inputs** (clock-domain crossings), where the standard fix is a **two-flop synchronizer** that gives the first flop a full cycle (tr) to resolve. Small τ (strong, lightly loaded cross-coupled pair) is what a synchronizer flop is optimized for. The c-q pushout curve above is the same exponential seen from outside the cell.

!!! why "Why it matters for std-cell / ROM work"
    This procedure is literally how a flop's `.lib` constraint tables are generated: sweep D against CLK at each (data slew, clock slew) index, find the pushout point, record setup/hold per edge. NLDM setup tables are 2-D because a slow clock slew moves the internal closing instant and a slow data slew delays arrival at the storage node. A negative number in a hold table is normal and is not a bug. The same "sweep the input against the clock edge" method characterizes a ROM/SRAM macro's address setup/hold to the clock and its clock-to-data-out.

### 11.6 Flip-flop requirements and robustness

SLIDE2:l11_p07_b|A good flop needs small tc-q, tsu and thold, low clock load and power, drive strength, scan, and robustness.||l11_p08_t|Buffer the input, never float storage nodes, give them modest capacitance, and keep their wires short.

**Design requirements (slide 14):**

- **High speed** — small tc-q, small tsu, small thold. Small hold gives "**inherent race immunity**": the less hold a flop needs, the fewer delay buffers the design needs on short paths.
- **Low power** and **small clock load** — "clock power is very large." Every flop's clock pin is toggling every cycle with activity factor 1; the clock network is often the single largest power consumer.
- **High driving capability** — the flop must drive its fanout without an extra buffer stage.
- **Integration of logic into the flip-flop** — e.g., a mux or AND in the master stage removes a gate from the critical path.
- **Multiplexed or clock scan (testability)** — every production flop is a scan flop; the scan mux at D adds to setup.
- **Robustness** and **crosstalk insensitivity**.

**Robustness rules (slide 15):**

- **Input isolation** — *don't use a pass transistor directly at the input; use a buffer.* An unbuffered TG at D lets the driving net see the internal storage node (charge sharing, kickback) and makes the flop's timing depend on whatever drives it. With a buffer, the cell's characterization is self-contained.
- **No floating nodes** — create **pseudo-static** storage nodes (a weak keeper/feedback) so a stopped or slow clock does not let leakage destroy the state.
- **Minimum capacitance on the storage node** — the middle of the cross-couple needs enough capacitance for noise immunity (charge from a coupling event divides against it), but too much slows the flop.
- **Preventing exposure** — keep wires on storage nodes short to suppress coupling from other nodes.

!!! why "Why it matters for std-cell / ROM work"
    These four rules are why every library DFF has an input inverter before the master TG, an output inverter after the slave (Q never comes directly off a storage node), weak keepers, and compact internal routing. The same rules apply to a ROM's sense latch and a register-file bit: buffered inputs, no floating nodes, short storage wiring.

### 11.7 Latches, master–slave flip-flops and the dynamic (C²MOS) register

Before the dynamic register slide, it is worth stating the latch/flop foundation that the lecture assumes (and that CAD2 and Discussion 2 build).

**Latch vs flip-flop.**

- A **latch** is level-sensitive: a **positive latch** is *transparent* (Q follows D) while clk = 1 and *holds* while clk = 0; a **negative latch** is the opposite. Its timing is defined relative to the **closing** edge.
- A **flip-flop** is edge-triggered. The standard way to build one is **master–slave**: a negative latch (master) followed by a positive latch (slave) gives a positive-edge flop. Discussion 2: *when the master is transparent, the slave holds; when the master holds, the slave is transparent; data is captured at the rising edge.*
- (added) Latch-based design can **borrow time** across phases (a slow stage uses part of the next phase), which is why duty-cycle variation (slide 5) matters for it, and its hold constraint is harder because a latch is transparent for half a cycle.

**Static TG master–slave flop (annotation on slide 16; CAD2 Figure 2).** Each latch is a **transmission gate** into an inverter, with a feedback inverter closed by a second TG (or a clocked tri-state inverter). On the rising edge, the master's input TG opens and its feedback closes; the slave's TG closes and passes the stored value to Q. The professor's annotated timing:

```latex
t_{su} = t_{tg} + t_{inv}
\qquad
t_{hold} \approx 0
\qquad
t_{c\text{-}q} = t_{tg} + t_{inv} + t_{inv}
```

- **Setup:** before the edge, D must pass through the master input TG *and* the master inverter, so that both ends of the master loop are at the right value when the feedback closes.
- **Hold ≈ 0:** the input TG turns off right at the edge (ideal, non-overlapping clk/clkb), so D can change immediately afterwards.
- **tc-q:** the slave TG, the slave inverter, and the output inverter.

(Textbook versions with an input inverter and more stages give larger counts, e.g., Rabaey's tsu = 3·tinv + ttx; the structure of the argument is identical.)

CAD2 / Discussion 2 sizing guidance for this flop:

- **Feedback path weak** (minimum width, 160 nm in the 130 nm kit) — so the forward path can overwrite the loop without a fight. Same writability logic as an SRAM cell (Lecture 10).
- **TG PMOS:NMOS = 1:1** — both devices conduct, and a TG passes 0 through the NMOS and 1 through the PMOS.
- **Local clock buffers inside the cell** ("why don't we use clk directly in the schematic?") — the cell generates its own clk and clkb, so the skew between the two phases is controlled and the external clock sees a single small gate load.
- Asynchronous reset via NAND / gated feedback in both latches (CAD2 notes that real designs prefer synchronous reset for DFT and glitch reasons).

SLIDE:l11_p08_b|The C²MOS dynamic register uses clocked inverters for master and slave, with storage on C1 and C2.

**The C²MOS (clocked CMOS) dynamic register.** Master: M1–M4, a clocked inverter (M2/M1 driven by D, M4 gated by clk as the PMOS clock device, M3 gated by !clk as the NMOS clock device). Slave: M5–M8, the same structure with clocks swapped. Storage is the **dynamic** charge on C1 (node QM) and C2 (node Q).

- clk = 0: master is a transparent inverter (QM = D̄); the slave is off and holds Q on C2.
- clk = 1: master is off and holds QM on C1; slave inverts QM → Q = D. Positive-edge triggered.
- Compared with the TG flop: no pass gates at the storage node (inputs drive gates only, so no charge sharing from D), and fewer transistors; but nodes are dynamic, so a minimum clock frequency applies (leakage), or keepers are added to make it pseudo-static.

**Clock-overlap insensitivity.** Real clk and !clk overlap because !clk is generated by an inverter and lags. In the TG flop, a 1–1 overlap turns both NMOS halves on at once and data can **race through** master and slave in one edge. In C²MOS, during a 0–0 overlap only the PMOS clock devices (M4 of master, M8 of slave) are on, and during 1–1 only the NMOS ones (M3, M7). A non-inverting path through two inverting stages would need a pull-up in one and a pull-down in the other, so data cannot propagate through both stages during either overlap. The condition is that clock rise/fall times are short enough that both devices are never partially on for long.

**The professor's annotation: clock-phase skew moves setup into hold.** Let !clk lag clk by δ at the rising edge.

- **D = 1** (master pulls QM low through M1 and M3, with M3 gated by !clk): M3 stays on for δ after clk rises, so the master keeps sampling for δ past the edge. Result: **tsu = −δ + tpd**, **thold = δ**, and **tc-q = δ + x** (Q cannot settle until the overlap ends).
- **D = 0** (master pulls QM high through M2 and M4, with M4 gated by clk): this path closes exactly at the clk edge, so **tsu = tpu**, with the δ-wide window again appearing as hold.

The lesson: the effective sampling instant is set by whichever clock device *actually* closes the master. Any delay between the clock pin and that device shifts the window later — setup shrinks (possibly negative) and hold grows by the same amount. This is the mechanism behind negative setup and positive hold in many real cells.

!!! core "Core idea"
    A flop's setup and hold are not two independent numbers; they are the two ends of one window, positioned by when the master actually closes. Delay the closing (clock buffers, phase overlap, pulse width) and the window slides later: setup goes down, hold goes up.

!!! guard "Common trap"
    "The TG master–slave flop has zero hold time" is true only with perfect, non-overlapping clk/clkb. With a lagging clkb, the master input TG stays partially on after the edge and hold becomes positive. That is why the cell generates its own clocks locally and keeps clk/clkb skew small.

### 11.8 True single-phase clocking (TSPC) and pulse-triggered registers

SLIDE2:l11_p09_t|TSPC latches use a single clock with no inverted phase: the negative latch holds at clk=1, the positive latch is transparent at clk=1.||l11_p09_b|An edge-triggered cell can be two latches in master–slave form or one latch opened by a short pulse.

**TSPC latches (slide 17).** Each latch is two cascaded clocked stages that use only **clk** (no !clk):

- **Negative latch:** hold when clk = 1, transparent when clk = 0.
- **Positive latch:** transparent when clk = 1, hold when clk = 0.

A **TSPC flip-flop** is a negative TSPC latch followed by a positive one. Why it was attractive:

- **No clock inversion → no clk/!clk skew or overlap problem** (the whole issue in 11.7 disappears).
- **Small clock load** — one clock wire, a few devices.
- Logic can be embedded into the first stage of each latch.

Costs: storage is dynamic (needs a minimum frequency or keepers), it is sensitive to clock slew (slow edges let both stages conduct), and the internal nodes are noise-sensitive. (added) Because of these, TSPC is common in high-speed dividers and prescalers but rare in general-purpose standard-cell libraries, which favor the static TG flop.

**Pulse-triggered registers (slide 18).** There are two ways to build an edge-triggered element:

- **Master–slave latches** — L1 (negative) and L2 (positive), as above.
- **Pulse-triggered latch** — a *single* latch L made transparent only for a short pulse generated at each clock edge.

The pulsed latch saves a full latch stage: tc-q is one latch delay instead of two, and there are fewer clocked transistors.

### 11.9 Pulsed registers and the hybrid latch flip-flop (HLFF)

SLIDE2:l11_p10_t|A glitch generator ANDs CLK with a delayed inverted CLK to make a short CLKG pulse that opens a single C²MOS-style latch.||l11_p10_b|The HLFF used in AMD K6 and K7 merges a pulse window and a latch in one cell.

**Pulsed register (slide 19).**

- **(a) Register:** a C²MOS-style latch (M1–M3, M4–M6) clocked by **CLKG**.
- **(b) Glitch generation:** CLK and a delayed, inverted CLK (through the inverter chain and node X) feed an AND gate. CLKG is high only for the delay of the inverting chain after each rising CLK edge.
- **(c) Glitch clock:** the waveform shows the narrow CLKG pulse at each rising edge of CLK.

Timing consequences:

```latex
t_{su} \approx t_{D\to storage} - t_{pulse}\ (\text{can be} < 0),
\qquad
t_{hold} \approx t_{pulse},
\qquad
t_{c\text{-}q} \approx \text{one latch delay}
```

- **Negative setup** — data arriving after the CLK edge but within the pulse still gets through ("soft edge").
- **Hold time ≈ pulse width** — the latch is transparent for the pulse, so a fast path can race through. This is the price.
- The pulse must be **wide enough** to write the latch at the slow corner and **narrow enough** to keep hold manageable at the fast corner. That PVT window is the main design risk.

**HLFF — hybrid latch flip-flop (slide 20)**, used in AMD K6 and K7:

- The front end is a three-NMOS stack M1–M3 gated by **CLKD**, D, and **CLK**, with PMOS P1 (gated by CLK) and P2 (gated by D) pulling node **x**. CLKD is CLK through three inverters, so it is an inverted, delayed copy.
- **Transparency window:** just after CLK rises, CLK = 1 and CLKD is still 1 for three inverter delays. Only in that window can the stack evaluate: if D = 1, x is pulled low. Outside the window x is precharged/held high.
- The second stage (P3, M4–M6, gated by x, CLK, CLKD) drives **Q**, and a cross-coupled inverter pair on Q makes the output static.
- So it is a "latch" (transparent for a pulse) built like a "flip-flop" (edge-defined window, static output) — hence *hybrid*.

Properties: one-stage tc-q, **negative setup**, hold ≈ three inverter delays (the window), logic can be merged into the front-end stack, and a small number of clocked devices. The trade is the same as any pulsed design: hold races and sensitivity of the window to PVT.

!!! eq "Equation card"
    Master–slave TG: **tsu ≈ ttg + tinv, thold ≈ 0, tc-q ≈ ttg + 2·tinv**.

    Pulsed / HLFF: **tsu < 0 possible, thold ≈ tpulse, tc-q ≈ one latch delay**.

    Clock-phase delay δ inside the cell: **tsu → tsu − δ, thold → thold + δ**.

!!! why "Why it matters for std-cell / ROM work"
    Pulsed latches show up in register files and SRAM/ROM macro interfaces, where a single pulse generator is shared across many bits so the per-bit latch is small. The same idea drives macro timing: the wordline pulse and the sense-enable timing are self-timed pulses derived from the clock. Their width sets both how far the bitline swings (functional margin) and the hold requirement on the address inputs. In the EECS 427 register file (Discussion 3), the array is built as a shared **master latch** per bit column with a **slave latch** per word — a master–slave flop split across the array to save area.

### 11.10 Summary

SLIDE:l11_p11_t|Clocks are not ideal, skew should stay under about 10% of the period, and sequentials consume much of the timing and power budget.

The professor's summary:

- Clocks strongly affect IC performance and are not ideal. **Skew and jitter** are the standard nonidealities; skew is usually the larger one and gets the most attention.
- **Rule of thumb: keep skew below 10% of the clock period.**
- Sequential elements consume a significant share of the **timing budget** (tc-q + tsu every cycle) and of the **power** (clock load), so they must be designed carefully, and robustness is critical.
- Newer designs such as **pulsed registers** improve performance at the cost of design complexity (hold races, pulse-width control).

### 11.x Check yourself

1. **Derive the setup and hold constraints for R1 → logic → R2 with skew δ = tCLK2 − tCLK1.** Setup: data launched at 0 arrives at tc-q + tlogic,max and must precede R2's next edge at T + δ by tsu, so T ≥ tc-q + tlogic + tsu − δ. Hold: the same edge reaches R2 at δ, so the fastest new data must arrive after δ + thold, giving tc-q,cd + tlogic,cd > thold + δ. With cycle-to-cycle jitter, add 2tj to the right-hand side of each (per the annotation).

2. **A chip comes back from the fab with a hold violation. Can you ship it at a lower frequency?** No. T does not appear in the hold inequality; the race is between one clock edge reaching R2 and the fastest data launched by that same edge. Hold must be fixed in design: add delay on the short path, reduce δ, or use a flop with smaller hold or larger tc-q,cd.

3. **Is positive skew good or bad?** Both. It gives the setup path δ of extra time (good for performance) and makes hold δ harder. Negative skew does the opposite. Unpredictable skew (uncertainty) is bad for both.

4. **How do you measure setup time in SPICE, and why not just find the pass/fail point?** Sweep the D transition toward the clock edge and watch tc-q. Setup is the D-to-CLK time at which tc-q has grown about 5% over nominal (the CAD2 / Discussion 2 definition). Hold is measured the same way with a second D toggle swept back toward the edge. At the pass/fail point tc-q is so large that the next stage fails, so the pushout criterion trades a bit of setup for a bounded tc-q. Measure rise and fall separately.

5. **What does a negative hold time mean, and how can it happen?** D may change slightly before the clock edge and the old value is still captured. It happens when the internal data path (for example an input inverter before the master TG) is slower than the clock path to the device that closes the master, so the change is still in flight when the master closes. The CAD2 FAQ notes it is legitimately possible.

6. **Why is the C²MOS register insensitive to clk/!clk overlap, while the TG flop is not?** During 0–0 overlap only the PMOS clock devices conduct, and during 1–1 only the NMOS ones. Getting through two inverting stages would need a pull-up in one stage and a pull-down in the other, so data cannot race through, provided clock edges are sharp. In a TG flop, 1–1 overlap turns on both NMOS halves and data can race straight through.

7. **For a pulsed latch with pulse width tpw, what happens to setup and hold, and what is the main design risk?** Setup can become negative (data may arrive during the pulse), hold rises to about tpw, and tc-q is one latch delay. The risk is the pulse width across PVT: too narrow and the latch is not written at the slow corner, too wide and hold races at the fast corner.

8. **List the flip-flop robustness rules from the lecture.** Buffer the input (no pass transistor directly at D); no floating nodes (use pseudo-static storage); give storage nodes enough capacitance for noise immunity, but not so much that the flop slows down; keep storage-node wires short to limit coupling. Also keep the feedback path weak so the flop is writable.


## Lecture 12 — Multipliers

A multiplier is mostly an adder problem in disguise: generate many partial products, add them all up, and do it without paying a carry-propagate delay at every step. This lecture introduces carry-save addition (the trick that removes carry propagation from multi-operand addition), the array multiplier, Booth encoding (fewer partial products), sign-extension tricks, Wallace and 4:2 compressor trees (logarithmic accumulation), and the final carry-propagate adder. For a circuit designer, the full adder and compressor cells, the Booth selector and the final adder are the critical standard cells, and the tree's wiring is the layout problem.

### 12.1 Multi-operand addition and carry-save adders

SLIDE2:l12_p01_b|Adding k words with k−1 ordinary adders is large and slow because every adder propagates a carry.||l12_p02_t|A carry-save adder is N independent full adders that reduce three words to a sum word and a carry word.

**Problem**: add k N-bit words, e.g. 0001 + 0111 + 1101 + 0010 = 10111. The straightforward solution chains **k − 1 carry-propagate adders**: large and slow. The annotation gives the delay as roughly **(k − 1)·N** full-adder delays (each ripple adder costs ~N).

**Carry-save addition**: a full adder sums **3 inputs** into **2 outputs**, and the carry has **twice the weight** of the sum. Put **N full adders in parallel, with no carry chain between them**, and you get an **N-bit carry-save adder (CSA)**: it reduces three N-bit words X, Y, Z to a sum word S and a carry word C (shifted left by one) in **one FA delay**, independent of N. It is also called a **3:2 compressor** (or 3:2 counter).

SLIDE:l12_p02_b|Use k−2 CSA stages to keep the sum in redundant carry-save form, then one carry-propagate adder at the end.

**CSA application**: use **k − 2 CSA stages**, keeping the result in **carry-save (redundant) form**; a single **final carry-propagate adder (CPA)** computes the actual result. Worked example from the slide:

- 0001 + 0111 + 1101 → S = 1011, C = 0101_ (carry shifted one place).
- 0101_ + 1011 + 0010 → S = 00011, C = 01010_.
- CPA: 01010_ + 00011 = **10111** (= 23 = 1 + 7 + 13 + 2).

Annotation: delay ≈ **(k − 2) + (N + 2) = N + k** FA delays — one FA delay per CSA level plus one ripple CPA — versus (k − 1)·N for chained CPAs.

!!! core "Core idea"
    Never propagate carries until the very end. A CSA level costs one full-adder delay regardless of word width; only the final CPA sees the carry chain.

!!! eq "Equation card"
    Chained CPAs: ≈ (k − 1)·N.  CSA array + CPA: ≈ (k − 2) + N (+ small constant).
    A 3:2 CSA: S = X⊕Y⊕Z, C = MAJ(X,Y,Z) shifted left 1.

### 12.2 Multiplication basics

SLIDE2:l12_p03_t|An M×N multiply forms N shifted M-bit partial products and sums them into an M+N-bit product.||l12_p03_b|The product is a double sum of AND terms xi·yj weighted by 2^(i+j).

Example: 1100 (12, multiplicand) × 0101 (5, multiplier) gives partial products 1100, 0000, 1100, 0000 (shifted) and the product **00111100 = 60**.

- **M × N-bit multiplication** produces **N partial products of M bits** each, summed into an **M + N-bit product**.
- General form, multiplicand Y = (y_{M−1}…y_0), multiplier X = (x_{N−1}…x_0):

```latex
P = \left(\sum_{j=0}^{M-1} y_j 2^j\right)\left(\sum_{i=0}^{N-1} x_i 2^i\right) = \sum_{i=0}^{N-1}\sum_{j=0}^{M-1} x_i\,y_j\,2^{i+j}
```

- Each partial-product bit is just an **AND gate** xi·yj; the 6×6 example on the slide shows the parallelogram of x_i y_j terms summing into p11…p0.

SLIDE2:l12_p04_t|A dot diagram shows every partial-product bit as a dot, making the parallelogram shape of the sum visible.||l12_p04_b|An array multiplier sums partial products with rows of carry-save adders and finishes with a carry-propagate adder.

**Dot diagram**: each dot is a bit; for a 16×16 multiply, 16 rows (one per multiplier bit x0…x15) shifted by one column each. Column heights rise to 16 in the middle and fall off at both ends — this profile drives tree design and final-adder timing.

**Array multiplier** (4×4 shown): rows of full adders form a **CSA array**; each row adds one new partial product to the running sum/carry; the bottom row is a **CPA**. The slide redraws the cell in several equivalent orientations (A, B, Sin, Cin → Cout, Sout) to show that inputs can be swapped to balance routing. The marked **critical path** runs down the array and then along the CPA. Annotation: delay ≈ **N + M** cell delays — linear in the operand widths.

SLIDE2:l12_p05_t|The array can be squashed into a rectangular floorplan for regular layout.||l12_p06_t|Radix-2^r encoding looks at r multiplier bits at a time, cutting the number of partial products to N/r.

**Rectangular array**: the parallelogram is skewed into a **rectangle** so the cells tile in a regular floorplan; low product bits p0…p3 exit along one side, high bits p4…p7 along the bottom. This is why array multipliers are layout-friendly even though they are slow.

**Three steps in multiplication** (slide 10): (1) **partial product generation**, (2) **partial product accumulation**, (3) **final addition**. The rest of the lecture optimizes each.

### 12.3 Partial-product reduction and Booth encoding

**Radix-2^r encoding**: an array multiplier needs N partial products. Looking at **r bits** of the multiplier at a time gives **N/r** partial products — "faster and smaller?" For **r = 2** (radix-4) each pair of bits selects **0, Y, 2Y or 3Y**. The first three are easy (2Y is a shift), but **3Y requires an adder** (a "hard multiple").

The instructor's annotation tabulates the pair → PP mapping: 00 → 0, 01 → Y, 10 → 2Y = **4Y − 2Y**, 11 → 3Y = **4Y − Y**. The 4Y term is pushed into the next partial product (weight 4 = one radix-4 digit up). That is Booth's idea.

SLIDE2:l12_p06_b|Booth encoding replaces 3Y with −Y plus 4Y in the next partial product, so only 0, ±Y and ±2Y are needed.||l12_p07_t|A Booth encoder produces SINGLE, DOUBLE and NEG per partial product, and a selector per bit chooses and inverts.

**Booth (modified, radix-4) encoding**: instead of 3Y, use **−Y** and increment the next partial product (add 4Y); similarly, 2Y can be written as −2Y + 4Y. Each partial product is chosen from the overlapping triplet (x_{2i+1}, x_{2i}, x_{2i−1}):

| x2i+1 x2i x2i−1 | PP_i | SINGLE | DOUBLE | NEG |
|---|---|---|---|---|
| 000 | 0 | 0 | 0 | 0 |
| 001 | Y | 1 | 0 | 0 |
| 010 | Y | 1 | 0 | 0 |
| 011 | 2Y | 0 | 1 | 0 |
| 100 | −2Y | 0 | 1 | 1 |
| 101 | −Y | 1 | 0 | 1 |
| 110 | −Y | 1 | 0 | 1 |
| 111 | −0 (= 0) | 0 | 0 | 1 |

- The bit x_{2i−1} (the MSB of the previous pair) is what implements "increment the next PP by 4Y".
- **Booth hardware**: one **Booth encoder** per partial product generates **SINGLE_i, DOUBLE_i, NEG_i**; a **Booth selector** per bit computes PP_ij = (y_j·SINGLE + y_{j−1}·DOUBLE) ⊕ NEG (an AOI22 plus XOR — the slide's selector). Negation is "invert and add 1": the inversion is the XOR, and the +1 is added as an extra bit in the next row.
- Net effect: **N/2 partial products** instead of N, at the cost of encoders, more complex selectors, and **signed** partial products.

!!! guard "Common trap"
    Booth radix-4 halves the number of partial products, not the number of bits per partial product — each PP is M+1 bits (to hold ±2Y) and is signed, so sign extension becomes a real cost.

!!! why "Why it matters for std-cell / ROM work"
    The Booth selector (AOI22 + XOR/XNOR) and the full adder are the highest-count cells in a multiplier — library teams build dedicated, densely laid-out versions (and dual-polarity outputs) because their area and input capacitance multiply by M·N/2. The SINGLE/DOUBLE/NEG nets are high-fanout (one encoder drives a whole row of selectors), so they need buffering — a characterization point for max-capacitance and slew in .lib.

### 12.4 Sign extension

SLIDE2:l12_p07_b|Negative partial products need sign extension, which adds many bits and puts a heavy load on each sign bit.||l12_p08_t|Because the sign field is all 0s or all 1s, it can be replaced by all 1s plus a correction in one column.

**Sign extension**: Booth partial products can be negative, so each must be sign-extended to the full product width — **cumbersome** (many extra dots) and a **high fanout on the most significant bit** (the sign bit s drives every extended position).

**Simplified sign extension**: the sign bits are **either all 0s or all 1s**. Note that **all 0s = all 1s + 1 in the proper column**. So replace each extension field with a row of constant 1s and put **s̄** (inverted sign) in the sign position; this removes the fanout on the MSB.

SLIDE:l12_p08_b|All the constant 1s can be summed at design time, leaving only a few sign-related bits per partial product.

**Even simpler**: there is **no need to add all the 1s in hardware** — the constant 1s from every row can be **precomputed** at design time into a single constant. The result is the familiar pattern: the first PP gets three sign-related bits (s̄ s s), the middle PPs get a leading "1 s̄", and only a handful of extra dots remain (plus the NEG "+1" bits in the LSB positions of the following rows). Interviewers like this one because it shows the difference between "logically required" and "hardware required" bits.

### 12.5 Partial-product accumulation: Wallace trees and 4:2 compressors

SLIDE2:l12_p09_t|A Wallace tree reduces partial products with full and half adders in parallel layers, cutting the height by 3:2 per level.||l12_p09_b|In the 4×4 Wallace tree the critical path is only two adder stages before the final adder.

**Wallace tree**: instead of adding one partial product per row (array: N levels), apply **3:2 CSAs in parallel** to every group of three bits in each column. Each level reduces column height by a factor of **3/2**, so the number of levels is about **log_{1.5}(N/2)** (annotation) — logarithmic instead of linear.

4×4 example (dot-diagram and gate views):

- Partial products: column heights 1, 2, 3, 4, 3, 2, 1.
- **First stage**: two half adders reduce the tallest columns.
- **Second stage**: four full adders (plus HA where needed) bring every column to height ≤ 2.
- **Final adder**: a 2-row CPA produces z7…z0.

The cost is **irregular wiring**: carries go to the next column, sums stay, and the tree is hard to lay out compared with the array.

SLIDE2:l12_p10_t|A 4:2 compressor built from two full adders reduces four bits to two with a lateral carry that does not ripple.||l12_p10_b|The final adder sees partial-product bits arriving at different times, with the middle columns latest.

**4:2 compressor**: two cascaded full adders taking four inputs W, X, Y, Z plus a lateral carry-in t_i, producing **C and S** plus a lateral carry-out t_{i+1}. Key property: **t_{i+1} does not depend on t_i**, so the lateral carries do **not ripple** across columns. A tree of 4:2 compressors halves the height per level (log2 instead of log1.5) and is **more regular** (binary tree, easier layout), which is why many real multipliers use it.

**Final addition**: the outputs of the tree arrive at the CPA **non-uniformly** — low columns finish early (short columns), middle columns last (tallest), high columns in between. The slide shows a prefix adder whose structure is matched to this arrival profile: ripple where bits arrive early, a fast tree where they arrive late. This is the bridge back to Lecture 5: the choice among ripple, select and prefix structures depends on input arrival times, not just word length.

!!! core "Core idea"
    Multiplier = Booth (fewer PPs) + tree (log-depth accumulation in carry-save form) + one fast CPA tailored to the tree's arrival profile.

!!! eq "Equation card"
    Array: delay ∝ N + M.  Wallace (3:2): ≈ log_{1.5}(N/2) levels.  4:2 tree: ≈ log2(N/2) levels, each ≈ 1.5 FA delays (added).
    Booth radix-4: N/2 partial products from 0, ±Y, ±2Y.

!!! why "Why it matters for std-cell / ROM work"
    The CSA/compressor tree is the densest arithmetic in a GPU datapath (tensor-core MACs). Its timing depends on the FA and 4:2 cell's sum vs carry arcs, its power on glitching through unbalanced paths, and its area on how tightly the FA cell abuts. A library with a fast CI→CO arc, a separate fast-sum FA variant, and a dedicated 4:2 compressor cell changes the multiplier's achievable frequency more than any single gate sizing.

### 12.x Check yourself

1. **Why is a carry-save adder's delay independent of word width?** — It is N full adders with no carry chain between them; each bit's sum and carry depend only on that bit's three inputs, so one FA delay per level.
2. **Delay of adding k N-bit numbers with chained CPAs vs a CSA tree plus one CPA?** — Chained: about (k − 1)·N; CSA approach: about (k − 2) + N (annotation: N + k).
3. **Why does radix-4 multiplication need Booth encoding?** — Plain radix-4 needs 0, Y, 2Y, 3Y, and 3Y needs an adder. Booth rewrites 3Y = 4Y − Y and 2Y = 4Y − 2Y, pushing the 4Y into the next digit, so only 0, ±Y, ±2Y (shifts and inversions) are needed.
4. **Give the Booth digit for multiplier bits (x2i+1, x2i, x2i−1) = 011 and 101.** — 011 → +2Y (DOUBLE); 101 → −Y (SINGLE, NEG).
5. **How is a negative partial product formed in hardware?** — Invert the selected bits (XOR with NEG) and add 1 in the LSB position of the next row.
6. **What is the sign-extension trick?** — An all-0s or all-1s extension equals all 1s plus 1 in the right column; replace the extension with constant 1s and s̄, then precompute the sum of all constants so only a few sign bits per row remain.
7. **Why do 4:2 compressor trees often beat Wallace 3:2 trees in practice?** — The lateral carry does not ripple, the tree is binary (more regular layout and wiring), and each level halves the height.
8. **Why should the final CPA be designed knowing the tree's arrival profile?** — The middle columns arrive last; the CPA can ripple through early-arriving bits and spend its fast prefix logic only where bits arrive late.


## Lecture 13 — Interconnect

This lecture treats the wire as a circuit element: its geometry and layer stack, its resistance (sheet resistance, metals, contacts), its capacitance (to ground planes and to neighbors), how to model it as lumped RC segments, how neighbors couple into it (crosstalk delay through the Miller factor, and crosstalk noise), and how to break long wires with repeaters. For a standard-cell or ROM designer, wires are the load: M1/M2 routes inside cells, pin capacitance seen by the router, and the long, heavily loaded wordlines and bitlines of a memory array, where RC and coupling set both speed and sense margin.

### 13.1 Wire geometry and the layer stack

SLIDE2:l13_p01_b|Pitch = w + s and aspect ratio t/w ≈ 2 in modern processes, packing many tall, skinny wires.||l13_p02_t|Modern stacks have 6–10+ layers: thin dense M1 for cells, wider mid layers, thickest top layers for VDD, GND and clock.

- **Pitch = w + s** (width + spacing). Thickness **t**, height above the layer below **h**, length **l**.
- **Aspect ratio AR = t/w.** Old processes had **AR ≪ 1**; modern processes have **AR ≈ 2** — tall skinny wires to pack many tracks while keeping cross-section (and resistance) acceptable. Side effect: tall wires have large **sidewall** area, so coupling to neighbors dominates the capacitance.
- **Layer stack:** **M1** thin and narrow (high-density cells), **mid layers** thicker and wider (density vs. speed), **top layers** thickest (VDD, GND, clock). The example slide shows Intel 90 nm and 45 nm cross-sections.

!!! why "Why it matters for std-cell / ROM work"
    Cell architecture is defined by the M1/M2 pitch: cell height is quoted in tracks, and pin access depends on how many M2 tracks can reach each pin. Memory bitlines and wordlines are usually drawn on low layers at minimum pitch, so their per-length R and coupling C are the worst in the stack.

### 13.2 Lumped models and wire resistance

SLIDE2:l13_p03_t|A distributed wire is approximated by N lumped segments; the π-model is preferred and the L-model overestimates delay.||l13_p03_b|R = ρl/(tw) = R□·(l/w): count squares, since a square of any size has the same resistance.

**Lumped element models.** A wire is a distributed RC line; approximate with N segments of R/N and C/N. The three single-segment forms are **L-model** (all C at the far end — crossed out on the slide), **π-model** (C/2 at each end — boxed, the recommended one), and **T-model** (R/2, C, R/2). With π segments, even N = 1 reproduces the distributed line's Elmore delay (see 13.6).

**Wire resistance:**

```latex
R = \frac{\rho}{t}\frac{l}{w} = R_\square \frac{l}{w}
```

- ρ is the **resistivity** (Ω·m); **R□ = ρ/t** is the **sheet resistance** in Ω/□, where □ is a dimensionless unit.
- **Count squares:** R = R□ × (number of squares). A 1-block wire of length L, width W has the same resistance as a 4-block wire 2L by 2W — both are L/W squares.
- Interview angle: "Why does doubling width halve R but not halve RC?" — C has a large fringe/sidewall component that does not scale with width, so RC improves less than 2×.

### 13.3 Metals and contacts

SLIDE2:l13_p04_t|Aluminum until the 180 nm generation, copper since; Cu 1.7 vs Al 2.8 µΩ·cm bulk resistivity.||l13_p04_b|Contacts and vias are 2–20 Ω each, so use many in parallel for low resistance.

| Metal | Bulk resistivity (µΩ·cm) |
|---|---|
| Silver (Ag) | 1.6 |
| Copper (Cu) | 1.7 |
| Gold (Au) | 2.2 |
| Aluminum (Al) | 2.8 |
| Tungsten (W) | 5.3 |
| Titanium (Ti) | 43.0 |

- **Until the 180 nm generation**, wires were **aluminum**; contemporary processes use **copper** (lower ρ; better electromigration resistance). Tungsten is used for contacts/local plugs; titanium for barrier/liner layers. (Thin Cu wires have effective resistivity well above bulk because of the barrier and surface/grain scattering — added.)
- **Contacts and vias: 2–20 Ω each** — use many contacts in parallel (the slide shows a 1-via junction vs a via array).

!!! why "Why it matters for std-cell / ROM work"
    Via count matters for both IR drop and EM: power-rail vias in a cell row and the vias on a strong driver's output (wordline driver, clock buffer) are the first places a reliability check fails. Redundant (double) vias are also a yield rule.

### 13.4 Wire capacitance

SLIDE2:l13_p05_t|Ctotal = Ctop + Cbot + 2·Cadj: plates above and below plus both neighbors.||l13_p05_b|C grows with overlap area (w, t) and shrinks with distance (s, h); k = 3.9 for SiO2, about 3 or less for low-k.

```latex
C_{total} = C_{top} + C_{bot} + 2C_{adj}
```

- **Ctop/Cbot:** to layers n+1 and n−1 (often treated as grounded, quiet planes). **Cadj:** to each neighbor on the same layer.
- **Parallel plate:** C = εox·A/d. Increasing **area (w, t)** increases capacitance; increasing **distance (s, h)** decreases it. With AR ≈ 2 the sidewall term (∝ t/s) is large, so **coupling is a large fraction of the total** — the Wire Engineering plot (13.8) shows 2Cadj/(2Cadj + Cgnd) of 0.4–0.75.
- **ε0 = 8.85 × 10⁻¹⁴ F/cm**, εox = k·ε0, **k = 3.9 for SiO₂**; **low-k dielectrics, k ≈ 3 or less** (air pockets).
- Rule-of-thumb (added): total wire capacitance on most layers lands near 0.2 fF/µm, nearly independent of node, because width and spacing scale together.

### 13.5 Diffusion, poly, and crosstalk

SLIDE2:l13_p06_t|Diffusion is 1–2 fF/µm and resistive and poly is highly resistive: never use them as wires.||l13_p06_b|Capacitive coupling to a switching neighbor injects noise into quiet wires and changes delay of switching ones.

- **Diffusion:** capacitance **1–2 fF/µm**, comparable to gate capacitance, and high resistance → **avoid diffusion runners** for wires.
- **Polysilicon:** high R → use for gates; occasionally for very short wires between gates.
- **Crosstalk:** a wire has high capacitance to its neighbor. When the neighbor switches, the wire tends to follow — **capacitive coupling**. Two effects: **noise on non-switching wires** and **increased (or decreased) delay on switching wires**.

### 13.6 Elmore delay for a wire (added)

Not a slide of its own, but required for the repeater slides ("write equation for Elmore delay") and used on the Wire Engineering plot ("Delay: RC/2"). Standard textbook results:

- An N-segment RC ladder with total R and C: the Elmore delay to the far end is Σ (iR/N)(C/N) for i = 1..N = RC(N+1)/(2N) → **RC/2** as N → ∞. A single **π-segment** gives exactly R·C/2, matching the distributed line; the **L-model** gives RC — 2× too pessimistic, hence crossed out on the slide.
- Driver resistance Rd, wire (Rw, Cw total), load CL:

```latex
t_{Elmore} = R_d\,(C_w + C_L) + R_w\left(\frac{C_w}{2} + C_L\right)
```

- 50% delay: multiply lumped terms by 0.69; the distributed RwCw term is ≈ 0.38·RwCw (step response of a distributed line), so t50 ≈ 0.69Rd(Cw + CL) + 0.38RwCw + 0.69RwCL.
- **Quadratic in length:** Rw and Cw both ∝ l, so the wire term ∝ l². This is the whole motivation for repeaters.

!!! eq "Equation card"
    Wire: R = R□·l/w, C = Ctop + Cbot + 2Cadj (∝ l). Elmore of a distributed wire = RC/2 (π-model). With a driver: Rd(Cw + CL) + Rw(Cw/2 + CL). Memory trick: "the wire sees half its own capacitance, the load sees all of the wire's resistance."

!!! why "Why it matters for std-cell / ROM work"
    A ROM wordline is a distributed RC line loaded by a gate at every cell; a bitline is a distributed RC line loaded by a drain at every cell. The far-end cell sees roughly RwCw/2 of extra delay, which is why arrays are partitioned (shorter wordlines, local/global bitlines) and why wordline drivers sit on both sides in wide arrays.

### 13.7 Crosstalk delay and crosstalk noise

SLIDE2:l13_p07_t|Effective coupling capacitance depends on the neighbor: Miller factor 1 if quiet, 0 if switching the same way, 2 if switching opposite.||l13_p07_b|A floating victim sees ΔVvictim = Cadj/(Cgnd−v + Cadj)·ΔVaggressor — a capacitive divider.

**Crosstalk delay.** Assume layers above and below are on average quiet: Cgnd = Ctop + Cbot. The effective Cadj depends on neighbor B while A switches — the **Miller effect**:

| B | ΔV across Cadj | Ceff(A) | MCF |
|---|---|---|---|
| Constant | VDD | Cgnd + Cadj | 1 |
| Switching with A | 0 | Cgnd | 0 |
| Switching opposite A | 2VDD | Cgnd + 2Cadj | 2 |

- The **Miller coupling factor (MCF)** ranges 0–2, so with a large coupling fraction the wire's delay varies by roughly 2–3× depending on neighbors. Timing tools model this as signal-integrity (SI) delay, using worst-case MCF for setup and best-case for hold. (added for the tool context)

**Crosstalk noise.** If the victim is **floating** (e.g. a dynamic node, a precharged bitline), model as a capacitive divider:

```latex
\Delta V_{victim} = \frac{C_{adj}}{C_{gnd-v} + C_{adj}}\,\Delta V_{aggressor}
```

### 13.8 Driven victims, waveforms, and why noise matters

SLIDE2:l13_p08_t|A driven victim fights back: noise is divided by (1 + k), where k is the ratio of aggressor to victim time constants.||l13_p08_b|For Cadj = Cvictim the floating victim reaches 50%, while victims with half-, equal- and double-size drivers peak at 16%, 8% and 4%.

Usually the victim is held by a gate that **fights the noise**; the noise then depends on relative resistances:

```latex
\Delta V_{victim} = \frac{C_{adj}}{C_{gnd-v} + C_{adj}}\,\frac{1}{1+k}\,\Delta V_{aggressor},\qquad
k = \frac{\tau_{aggressor}}{\tau_{victim}} = \frac{R_{aggressor}(C_{gnd-a} + C_{adj})}{R_{victim}(C_{gnd-v} + C_{adj})}
```

- **Coupling waveforms** (simulated, Cadj = Cvictim): undriven victim → **50%** (the divider, stays there); half-size driver → **16%**; equal-size driver → **8%**; double-size driver → **4%** — and driven victims recover back to the rail after the aggressor's edge.
- A slow aggressor (large k) gives the victim's driver time to restore the node → less noise. Fast, strong aggressors next to weakly-held nets are the worst case.

SLIDE2:l13_p09_t|Noise below the noise margin is harmless to static CMOS, but glitches cost delay and power, and dynamic logic and memories can fail outright.||l13_p09_b|Wire engineering trades width, spacing, layer and shielding: wider pitch lowers both RC/2 delay and the coupling fraction.

**Noise implications:**

- If the noise is **below the noise margin**, nothing happens.
- **Static CMOS** eventually settles to the correct output even after large spikes — **but glitches cause extra delay and extra power** (false transitions).
- **Dynamic logic never recovers from glitches**: a discharged precharged node stays discharged.
- **Memories and other sensitive circuits** can also produce the wrong answer.

**Wire engineering:** goal — meet delay, area, and power with acceptable noise. Degrees of freedom: **width, spacing, layer, shielding**. The plots (wire spacing 320/480/640 nm) show delay (RC/2) falling from ~1.8 ns to ~0.55 ns and coupling fraction 2Cadj/(2Cadj + Cgnd) falling from ~0.75 to ~0.38 as pitch grows from ~700 to ~1600 nm. The bottom sketch shows shielding options: VDD/GND every few signals, a shield between every signal, or **interleaving** two buses (a0 b0 a1 b1 …) so that neighbors of each a-wire belong to a bus that is not switching at the same time.

!!! why "Why it matters for std-cell / ROM work"
    Precharged bitlines and dynamic NOR ROM columns are floating victims during evaluation: a coupled glitch from a neighboring bitline or a switching wordline/column-select line can discharge a node that should have stayed high, and dynamic logic never recovers. Hence keepers (which turn a floating victim into a weakly driven one, cutting noise by 1/(1 + k)), bitline twisting or shielding, and careful ordering of adjacent signals. Same reason register-file read bitlines and domino nodes are shielded.

!!! guard "Common trap"
    Treating Cadj as a fixed capacitance in timing. It is Cgnd + MCF·Cadj with MCF from 0 to 2. Using MCF = 1 for both setup and hold hides both the worst-case slow path and the worst-case fast path.

### 13.9 Repeaters

SLIDE2:l13_p10_t|RC delay grows as l², so break long wires into N segments, each driven by an inverter or buffer.||l13_p10_b|Each segment is modeled as an inverter of width W (R/W, CW·pinv) driving a π-model wire of length l/N and the next repeater's gate CW.

- R and C are both ∝ l, so **RC delay ∝ l²** — unacceptable for long wires.
- **Break the wire into N segments**, each driven by an inverter/buffer: each segment's delay ∝ (l/N)², times N segments → total wire delay ∝ l²/N, plus N repeater delays. Total delay becomes **linear** in l at the optimum.
- **Equivalent circuit per segment:** wire length l/N with capacitance Cw·l/N and resistance Rw·l/N (π-split: Cw·l/(2N) at each end); inverter of width W (nMOS W, pMOS 2W) with gate capacitance C·W, output resistance R/W, and parasitic CW·pinv.

### 13.10 Repeater results and energy

SLIDE2:l13_p11_t|Minimizing Elmore delay gives segment length l/N = √(2RC′/(RwCw)) and width W = √(RCw/(RwC′)), with C′ = C(1 + pinv).||l13_p11_b|Delay-optimal repeaters cost 1.87·Cw·VDD² per length, an 87% premium; downsizing for minimum EDP cuts the premium to 30% for 14% more delay.

Write the Elmore delay of N segments, differentiate with respect to W and N, set to zero:

```latex
\frac{l}{N} = \sqrt{\frac{2RC'}{R_wC_w}},\qquad
W = \sqrt{\frac{RC_w}{R_wC'}},\qquad C' = C(1+p_{inv})
```

- Intuition: optimum segment length balances wire RC against repeater RC′ — a technology constant independent of the total length; the optimum size makes the repeater's R/W comparable to the segment's wire resistance times the ratio of capacitances.
- Resulting delay per unit length (standard textbook result, added):

```latex
\frac{t_{pd}}{l} = \left(2 + \sqrt{2(1+p_{inv})}\right)\sqrt{RC\,R_wC_w}
```

**Repeater energy:**

- **Energy/length ≈ 1.87·Cw·VDD²** — an **87% premium** over an unrepeated wire; the extra goes into the large repeaters' gate and diffusion capacitance.
- **Downsizing for minimum energy-delay product:** energy premium only **30%**, delay **+14%** from the minimum. Delay is very flat near the optimum, so slightly smaller, slightly fewer repeaters are almost always the right choice.

!!! eq "Equation card"
    l/N = √(2RC′/(RwCw)), W = √(RCw/(RwC′)), C′ = C(1 + pinv). Energy at min delay ≈ 1.87·Cw·VDD²/length; at min EDP, +30% energy for +14% delay. Memory trick: "unrepeated is l², repeated is l; the optimum is flat, so undersize."

!!! core "Core idea"
    Wires scale badly because RC ∝ l²; repeaters make delay linear in length at a sizable energy cost, and the flat delay optimum means you should downsize them.

### 13.11 Electromigration (EM) — not covered in the lecture (added)

The lecture does not cover EM, but it is a standard interview topic for cell and memory designers because EM limits appear in cell characterization and signoff.

- **What it is:** at high current density, electrons transfer momentum to metal atoms ("electron wind"), causing atoms to drift along the wire. Atoms deplete at one end (**voids → opens / rising resistance**) and pile up at the other (**hillocks/extrusions → shorts**). Lifetime follows **Black's equation**, MTTF ∝ J⁻ⁿ·exp(Ea/kT) (n ≈ 1–2), so it is strongly accelerated by **current density** and **temperature**. Vias and via-metal interfaces are the usual weak points; Cu is much more robust than Al.
- **Three current measures** used in EM/reliability rules for a waveform i(t) over period T:
    - **Average:** I_avg = (1/T)∫ i(t) dt — the net unidirectional flow that drives EM wear-out; the key limit for **power rails** and other unidirectional currents. For bidirectional signal wires the net average is small, so rules typically apply per direction or with a recovery factor.
    - **RMS:** I_rms = √((1/T)∫ i(t)² dt) — sets **Joule self-heating**, which raises the local temperature and accelerates EM; the key limit for **signal wires**.
    - **Peak:** I_peak = max|i(t)| — limits short-pulse damage (local melting/fusing) and is checked for very high-current transients.
- Limits are given per layer and per via (often as current per unit width, derated with temperature), and are the reason power rails, high-drive outputs, and clock nets are widened or multi-via'd.

!!! why "Why it matters for std-cell / ROM work"
    Libraries carry EM data for output pins (max allowed load/frequency or current per pin), and a cell's internal M1 power rail and output pin must survive the RMS/average current of its largest drive strength at its max frequency and load. In memories, the wordline drivers, bitline precharge devices, and sense-amp supply wires carry large, repetitive currents and are classic EM/IR checkpoints alongside the array's power grid.

### 13.x Check yourself

1. **Why do modern wires have AR ≈ 2, and what is the side effect?** Tall narrow wires pack more tracks at acceptable resistance; the large sidewall makes coupling capacitance a big fraction of total C.
2. **Why is the L-model crossed out and the π-model boxed?** The L-model puts all C at the far end, giving Elmore = RC (2× pessimistic); the π-model gives RC/2, matching the distributed line.
3. **Ceff of a wire whose neighbor switches in the opposite direction?** Cgnd + 2Cadj (MCF = 2); same direction: Cgnd (MCF = 0); quiet: Cgnd + Cadj.
4. **Floating victim noise with Cadj = Cgnd-v?** ΔV = Cadj/(Cgnd + Cadj)·ΔVagg = 50%. With an equal-size driver: 8%; half-size: 16%; double: 4%.
5. **Why is a glitch fatal in a domino node or precharged bitline but not in static CMOS?** Static CMOS restores the level actively; a precharged/dynamic node that discharges has no pull-up during evaluation and cannot recover.
6. **Optimal repeater spacing and size?** l/N = √(2RC′/(RwCw)), W = √(RCw/(RwC′)), C′ = C(1 + pinv) — derived from minimizing Elmore delay over N and W.
7. **Energy cost of delay-optimal repeaters and how to reduce it?** 1.87·Cw·VDD² per length (87% premium); size for min EDP to cut the premium to 30% for +14% delay.
8. **Define average, RMS, and peak current for EM, and which matters where.** I_avg = mean current (EM wear-out, power rails); I_rms = root-mean-square (Joule heating, signal wires); I_peak = max |i| (short-pulse damage).
