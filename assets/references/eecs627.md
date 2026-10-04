## How to use this printout

These are **Prof. David Blaauw's EECS 627 lectures** (VLSI Design II, UMich, Winter 2026), rebuilt as a lecture packet. It is the **deep-submicron half** of your training: noise, synchronization, low power and level shifters, power delivery and EM, variation and aging, adaptive design, leakage and power gating, inductance, SOI, energy recovery and compute-in-memory. Each lecture has the professor's slides, lecture notes, and **Check yourself** questions built from the course's practice exams.

| If you have | Read |
| --- | --- |
| 1 hour | **Lecture 7** (variation, aging, EM) and **Lecture 4** (power supply, IR, decap, EM), then **Lecture 2** (synchronizers, MTBF) |
| 3 hours | Add **Lecture 3** (level shifters), **Lecture 9** (leakage, power gating), **Lecture 1** (noise, SER) |
| More | Lecture 8 (adaptive design, Razor), 10 (inductance), 11 (compute-in-memory), 5 (SOI), 6 (energy recovery) |

Practice-exam answers marked **(derived)** were blank or inconsistent in the posted solutions and were recomputed.

## Lecture 1 — Digital Noise

In this lecture, **noise** means anything that pushes a signal away from its nominal steady-state value (usually a supply rail) while it should be stable. **Digital noise** is deterministic and repeats across chips and over time. Coupling, charge sharing, IR drop and substrate injection all fall in that class. **Analog noise** (flicker, shot) is random. Particle strikes (soft errors) are the one random, external source the lecture covers. After the noise sources, the lecture asks when noise actually causes a failure (latches, dynamic gates, logical and temporal masking), how to budget it with **noise margins** and the **½-gain rule**, how coupling turns into **delay noise** (Miller factors 0/2/3), and how to avoid it (spacing, shielding, buffering, encoding). For a standard-cell or ROM designer, this lecture explains why flop inputs are always buffered, why a dynamic bitline needs a keeper and a guard band, how SRAM/flop SER is quoted in FIT, and why SI-aware timing changes setup and hold numbers.

### 1.1 Capacitive coupling: the four noise types and the lumped model

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p6-1.jpeg" alt="A quiet victim coupled to a switching aggressor sees four glitch types, low/high undershoot and low/high overshoot, depending on its own state and the aggressor direction." loading="lazy"><figcaption>A quiet victim coupled to a switching aggressor sees four glitch types, low/high undershoot and low/high overshoot, depending on its own state and the aggressor direction. · EECS 627 lecture packet · page 6</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p6-2.jpeg" alt="The distributed RC aggressor/victim pair reduces to a Thevenin aggressor source, the victim holding resistance Rh, the victim ground cap Cg and the coupling cap Cc." loading="lazy"><figcaption>The distributed RC aggressor/victim pair reduces to a Thevenin aggressor source, the victim holding resistance Rh, the victim ground cap Cg and the coupling cap Cc. · EECS 627 lecture packet · page 6</figcaption></figure>

Slide 4 sets up the problem. A victim net runs next to one or more aggressors. Each aggressor is modeled as a **Thevenin source** (a ramp behind its driver resistance), and the victim driver is just a **holding resistance** to its rail. The wires are distributed RC with coupling caps between them.

The **four noise types** (slide 5) come from the victim's quiet state and the aggressor's direction:

- Victim **low** + rising aggressor → **low overshoot** (a positive bump above 0). Victim low + falling aggressor → **low undershoot** (below ground).
- Victim **high** + falling aggressor → **high undershoot** (a dip below Vdd). Victim high + rising aggressor → **high overshoot** (above Vdd).
- Low overshoot and high undershoot move the node *toward* the opposite logic level, so they cause **functional failures**. Undershoot below ground and overshoot above Vdd look harmless logically. They still forward-bias junctions (substrate injection, §1.4) and can turn on a transmission gate that should be off (§1.7).

**Lumped model** (slide 6): collapse the distributed network into a single Cc from the aggressor to the victim node, with Rh ∥ Cg from the victim to ground. The noise waveform has a peak **VN**, a **rise time tr = f(aggressor slope)** and a **fall/decay time tf = f(victim RC)**. The rise is set by how fast the aggressor charges Cc. The decay is set by how fast the victim's holder restores the node.

<div class="co co-core"><p class="co-t">Core idea</p>

Coupling noise is a capacitive divider during the aggressor edge, then an RC recovery set by the victim's holder. The peak depends on the race between the aggressor injecting charge and the victim driver removing it.

</div>

### 1.2 Charge-divider approximation and parameter sensitivities

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p7-1.jpeg" alt="Ignoring the holder during a fast edge gives the charge-divider bound ΔVN = ΔVa·Cc/(Cg+Cc)." loading="lazy"><figcaption>Ignoring the holder during a fast edge gives the charge-divider bound ΔVN = ΔVa·Cc/(Cg+Cc). · EECS 627 lecture packet · page 7</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p7-2.jpeg" alt="A stronger victim driver, weaker aggressor, larger Cg or smaller Cc all lower the peak noise, and each one changes the waveform&#x27;s rise or fall differently." loading="lazy"><figcaption>A stronger victim driver, weaker aggressor, larger Cg or smaller Cc all lower the peak noise, and each one changes the waveform&#x27;s rise or fall differently. · EECS 627 lecture packet · page 7</figcaption></figure>

Simplified lumped model (slide 7): if the aggressor edge is much faster than the victim's RhCg, the holder has no time to act. Charge conservation on the victim node gives:

```latex
\Delta Q_g = \Delta Q_c \;\Rightarrow\; \Delta V_N C_g = (\Delta V_a - \Delta V_N)C_c
\;\Rightarrow\; \Delta V_N = \Delta V_a\,\frac{C_c}{C_g + C_c}
```

This is the **worst-case (infinitely fast aggressor) bound**. A finite aggressor slope and a real holder always make the actual peak lower.

**Sensitivity table** (slide 8, read row by row: the change on the left → effect on VN, tr, tf):

| Change | VN | tr | tf |
|---|---|---|---|
| Victim driver stronger ↑ | ↓ | same | ↓ |
| Aggressor weaker/slower ↓ | ↓ | ↑ | same |
| Cg ↑ | ↓ | same | ↑ |
| Rw ↓ | depends on topology | | |
| Cc ↓ | ↓ | same | ↓ |

Slides 9–11 add three points. **Wire resistance is topology dependent.** Slide 9 shows a victim whose driver is at one end, coupled near the far end to an aggressor. Victim2 sits between them. Lowering Rw helps the far node hear its holder, but it also changes where the noise peaks. A stronger victim driver also makes the victim a **stronger aggressor** to its own neighbors. Finally, tr follows the aggressor slope and tf follows the victim RC.

**Superposition** (slide 12): with several aggressors (A1, A2), the total noise is approximately the linear sum of the individual pulses. If the pulses are offset in time you get two humps. If they align, you get one taller peak. Worst-case analysis aligns them, which is often pessimistic (§1.7, temporal masking).

<div class="co co-eq"><p class="co-t">Equation card</p>

ΔVN ≤ ΔVa · Cc/(Cc+Cg). Memory trick: a capacitive divider with Cc on top and Cg on the bottom. The holder (victim driver) and the aggressor slope only reduce it.

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

In the exam question, reducing the victim driver width makes the aggressor transition **faster**. A weaker holder lets the victim node follow the aggressor, so less voltage changes across Cc and the aggressor sees less effective load. Coupling is two-way: the victim also affects the aggressor.

</div>

### 1.3 Charge sharing and IR drop

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p8-1.jpeg" alt="When a dynamic node shares charge with an internal stack node, Vo = Vdd·Co/(Co+Ci), unless the internal node clamps at Vdd − Vt first." loading="lazy"><figcaption>When a dynamic node shares charge with an internal stack node, Vo = Vdd·Co/(Co+Ci), unless the internal node clamps at Vdd − Vt first. · EECS 627 lecture packet · page 8</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p8-2.jpeg" alt="Ground and supply networks carry current, so the driver&#x27;s and receiver&#x27;s local rails differ, and a receiver can see a &quot;0&quot; that turns its NMOS on." loading="lazy"><figcaption>Ground and supply networks carry current, so the driver&#x27;s and receiver&#x27;s local rails differ, and a receiver can see a &quot;0&quot; that turns its NMOS on. · EECS 627 lecture packet · page 8</figcaption></figure>

**Charge sharing** (slide 14). A dynamic node Co is precharged to Vdd. During evaluate, an upper stack transistor turns on while the bottom of the stack stays off, so Co dumps charge into an internal node Ci that started at 0:

```latex
V_o = V_{dd}\,\frac{C_o}{C_o + C_i}
```

**But if** Vo > Vdd − Vt, the NMOS between the nodes cuts off before equalization. The internal node can only reach Vi,max = Vdd − Vt. Charge conservation then gives:

```latex
C_o V_{dd} = C_o V_o + C_i (V_{dd} - V_t) \;\Rightarrow\; V_o = V_{dd} - \frac{C_i}{C_o}(V_{dd} - V_t)
```

So the loss on Co is set by how much charge Ci needs to climb to Vdd − Vt. That is less than the full-equalization loss whenever the clamp applies.

**IR drop as noise** (slide 16). The on-chip ground (and Vdd) network is a resistive mesh carrying switching current from other gates. A driver outputting "0" is really at its local ground Vs,driver, which bounces up. The receiver's local ground Vs,receiver can dip at the same moment (dashed blue trace on the slide). The receiver NMOS sees Vgs = Vo,driver − Vs,receiver, which can exceed Vt even though both nodes are nominally at "0" ("**NMOS turns ON**"). Vdd behaves the same way. The input signal is referenced to one rail and the gate to another, so supply noise looks like signal noise.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A NOR-ROM bitline is a wide dynamic NOR. Charge sharing from the precharged bitline into internal or column-mux nodes is a classic read-0 failure. Precharging internal nodes, adding a keeper and limiting stack depth are the fixes. For EM/IR, static and dynamic IR analysis covers the speed loss, and this slide is the *noise* side of IR. Mismatched ground between a driver and its receiver eats directly into noise margin. Flops and dynamic cells near heavy switchers need their rails well strapped.

</div>

### 1.4 Substrate coupling: minority-carrier injection

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p9-1.jpeg" alt="When undershoot noise drives a source below ground, the n+/p-sub diode forward-biases and injects electrons, which diffuse to the nearest high-voltage n+ node, such as a dynamic node at Vdd." loading="lazy"><figcaption>When undershoot noise drives a source below ground, the n+/p-sub diode forward-biases and injects electrons, which diffuse to the nearest high-voltage n+ node, such as a dynamic node at Vdd. · EECS 627 lecture packet · page 9</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p9-2.jpeg" alt="A Vdd-tied n+ guard ring around sensitive NMOS collects the stray electrons, and it also helps with latch-up." loading="lazy"><figcaption>A Vdd-tied n+ guard ring around sensitive NMOS collects the stray electrons, and it also helps with latch-up. · EECS 627 lecture packet · page 9</figcaption></figure>

An NMOS source or drain is an n+/p-sub diode. If **low undershoot** coupling noise or ground noise pulls that n+ below the substrate by about a diode drop, the junction **forward-biases** and injects **electrons (minority carriers)** into the p-substrate. The electrons diffuse and are collected by **n+ regions at high voltage**, the reverse-biased junctions that act as collectors. The worst victim is a **dynamic node precharged to Vdd** (slide 18 shows Co on a Φ-precharged node losing its "1"). The node is floating, so any collected charge is lost for good.

Fixes (slide 19):

- **Guard rings** of n+ tied to **Vdd** around NMOS devices. They intercept the electrons before they reach the sensitive node. The same structure helps against **latch-up**.
- The effect is **less of an issue with lower Vdd**, because smaller swings make large forward bias less likely.

### 1.5 Soft errors: mechanism, Qcrit, collection area, FIT

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p9-3.jpeg" alt="Alpha particles and neutrons leave an ionization track, and the charge collected from that track is a localized, angle-dependent, non-deterministic event." loading="lazy"><figcaption>Alpha particles and neutrons leave an ionization track, and the charge collected from that track is a localized, angle-dependent, non-deterministic event. · EECS 627 lecture packet · page 9</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p9-4.jpeg" alt="A node flips when the collected charge exceeds Qcrit ≈ Cnode·VDD, and the failure rate is the tail of the strike-charge distribution beyond Qcrit." loading="lazy"><figcaption>A node flips when the collected charge exceeds Qcrit ≈ Cnode·VDD, and the failure rate is the tail of the strike-charge distribution beyond Qcrit. · EECS 627 lecture packet · page 9</figcaption></figure>

A **single-event upset (SEU)** is a radiation-induced error. The particles are **alpha particles** (from packaging and materials) and **neutrons** (from cosmic rays, through secondary reactions in silicon). The particle leaves an electron-hole track. The n+ drain at Vdd (a stored "1" on an NMOS drain) collects the electrons. The amount of charge depends on the **incident angle**, and the effect is **very localized**. Slide 22 shows the time course. Charge in the depletion region is collected by **drift (~ps)**, which produces the sharp current spike. Charge outside the depletion region follows by **diffusion (~ns)**, which produces the long tail.

**Critical charge** (slide 23): **Qcrit ≈ Cnode · VDD** is the charge needed to flip a node. In a cross-coupled latch, the struck node has to move far enough that the feedback inverter amplifies the error (slide shows 0→1 on one side of the pair). The curve on the slide plots P versus Q_event. The failure probability is the area beyond Qcrit. Lower Vdd or smaller Cnode moves Qcrit left, so more of the distribution fails.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p10-1.jpeg" alt="FIT counts failures per 10⁹ device-hours, so 1000 FIT is about 1 failure per 100 years per chip but about 1 per month across 1200 machines." loading="lazy"><figcaption>FIT counts failures per 10⁹ device-hours, so 1000 FIT is about 1 failure per 100 years per chip but about 1 per month across 1200 machines. · EECS 627 lecture packet · page 10</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p10-2.jpeg" alt="In FinFET nodes per-bit SRAM SER drops, but multi-cell upsets dominate, and unprotected flip-flops now cause about 50% of system FIT." loading="lazy"><figcaption>In FinFET nodes per-bit SRAM SER drops, but multi-cell upsets dominate, and unprotected flip-flops now cause about 50% of system FIT. · EECS 627 lecture packet · page 10</figcaption></figure>

**Collection area** (slide 24) is the region around a node that is sensitive to a strike. Scaling shrinks it, which helps: a strike is shared among neighbors and diluted. Smaller cells, though, mean one strike now covers **several cells**, giving **multi-cell upsets (MCU)**. Slide 25's plot shows Qcrit and collection area both falling with node. SRAM FIT per bit falls while **FIT per chip stays flat/rises**, and MCUs increase.

**FIT** = number of failures in **10⁹ hours**. ITRS bounded FIT < 1000. 1000 FIT = 1000 failures / ~10⁵ years ≈ **1 failure in 100 years** per part. A data center with **1200 machines** would see about **1 failure every month**.

Flux and charge numbers (slide 26):

- **Alpha particles.** From lead in chips and old packaging materials: flux **0.01 events/cm²·h**. Cleaner processes (clean lead, new materials) give a **20× reduction**. From background radiation: **0.005 events/cm²·h**, which **can be shielded** with package coatings. Charge **10–20 fC**.
- **Neutrons.** From background cosmic radiation: flux **0.005 events/cm²·h**. Charge **100–200 fC**. They **cannot be shielded**.

**Old processes** (slide 27): SRAM SER per chip was holding steady. With scaling, each cell stores less charge, but there are more cells per unit area and each has a smaller collection area. In DRAM the two opposing effects (smaller Cnode vs smaller collection area) cancel. The key implication is more multi-bit failures, so memories use **interleaving**. Logic latches were getting worse more quickly but were still behind SRAM. Combinational logic was getting worse but was behind latches. The pie chart: unprotected SRAM ~60%, sequential ~30%, combinational ~10%.

**New processes** (slide 28):

- **SRAM.** FinFET fins shorten charge-collection paths. Qcrit falls, yet per-bit 6T SER drops **≈2–3× from 14 nm → 7 nm → 5 nm**. Cell density explodes, though, and **80% of neutron events in 5 nm SRAM are MCUs**, so chip-level SRAM FIT stays roughly flat without stronger ECC.
- **DRAM.** The two effects still cancel.
- **Key implication.** Modern caches need **SECDED/DECTED ECC plus interleaving**. Interleaving puts physically adjacent bits in different ECC words, so an MCU becomes several single-bit errors.
- **SOI** gives **≈10–40× lower per-bit SER** than bulk/FinFET at the same node because it cuts the collection area.
- **Latches/FFs** improve more slowly with scaling. **Unprotected FFs are now the dominant contributor (≈50% of system FIT in 5 nm CPUs)**, which calls for TMR and similar techniques.
- **Combinational logic** stays **≤ 20%** of logic SER because faster circuits mean a strike glitch rarely lands in a latching window (temporal masking). The pie chart: sequential ~50%, unprotected SRAM ~30%, combinational ~20%.

Slide 29 (trend plots) shows the same story. Per-bit alpha SER for SRAM and DFF drops sharply toward 16/7 nm. At system level, SER keeps rising with node, IC-level SER rises more slowly, and FF SER falls per bit.

<div class="co co-eq"><p class="co-t">Equation card</p>

Qcrit ≈ Cnode·VDD. FIT = failures per 10⁹ h. P(fail in time T) ≈ Σ(FITᵢ)·T/10⁹. Neutrons: 100–200 fC and unshieldable. Alphas: 10–20 fC and shieldable/cleanable.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A ROM's *array* is hard-wired, so it has no stored charge to flip (added). Its sense amplifiers, output latches and register-file or flop periphery are still SER targets. For flops, SER is now quoted per cell in the library, and a hardened (DICE) flop variant is a standard library offering. SRAM and register files need ECC and bit interleaving, and column-mux interleaving is a layout decision the memory designer owns. Expect the interviewer to ask why lower Vdd hurts SER (Qcrit = C·V) and why MCUs force interleaving.

</div>

### 1.6 Hardened latches: TMR and DICE

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p11-1.jpeg" alt="A normal latch keeps its state on two nodes, so after a strike makes both N0 and N1 high, the original state cannot be recovered." loading="lazy"><figcaption>A normal latch keeps its state on two nodes, so after a strike makes both N0 and N1 high, the original state cannot be recovered. · EECS 627 lecture packet · page 11</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p11-2.jpeg" alt="Triple modular redundancy stores the bit in three flops and a majority voter outputs the value held by at least two of them." loading="lazy"><figcaption>Triple modular redundancy stores the bit in three flops and a majority voter outputs the value held by at least two of them. · EECS 627 lecture packet · page 11</figcaption></figure>

**Why a normal latch cannot self-correct** (slide 30). A cross-coupled latch keeps its state on two complementary nodes N0 and N1. The two normal states are (L, H) and (H, L). A strike pulls a low node high, so either normal state can end up as (**H, H**). Given only (H, H), the original state is ambiguous. Two nodes carry no redundancy, so the latch cannot know which way to recover, and the feedback just resolves to whichever side wins.

**TMR** (slide 31): three flops A, B, C feed a **majority voter**, and OUT = majority(A, B, C). The truth table on the slide: 000/001/010/100 → 0, and 011/101/110/111 → 1. TMR tolerates any single upset. It costs 3× area/power plus the voter, and the voter itself remains a single point of failure.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p11-3.jpeg" alt="The DICE latch stores the bit on four nodes (N0a, N1a, N0b, N1b), each driven by a PMOS gated by one neighbor and an NMOS gated by the other." loading="lazy"><figcaption>The DICE latch stores the bit on four nodes (N0a, N1a, N0b, N1b), each driven by a PMOS gated by one neighbor and an NMOS gated by the other. · EECS 627 lecture packet · page 11</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p11-4.jpeg" alt="After a strike on one DICE node, two neighbors float and one is held at ½, so the two untouched nodes drive the struck node back to its original value." loading="lazy"><figcaption>After a strike on one DICE node, two neighbors float and one is held at ½, so the two untouched nodes drive the struck node back to its original value. · EECS 627 lecture packet · page 11</figcaption></figure>

**DICE-style hardened latch** (slides 32–33). The storage loop has **four** nodes in a ring, with values 0-1-0-1 (N1b=0, N0a=1, N1a=0, N0b=1). Each node is driven by a **PMOS gated by one neighbor** and an **NMOS gated by the other neighbor**. Every node therefore needs *both* neighbors to agree before it can change. The data is written into two of the nodes through two transmission gates, and the output stage is driven by N0a and N0b.

Strike walk-through (slide 33, red → blue → green = before → during strike → after recovery). A strike flips one node, here a "1" pulled to "0":

- One neighbor gets its PMOS turned on while its NMOS is still on, so it **fights to ½** and stays near its value.
- The other affected node has *both* devices turned off. It **floats (f0/f1)**, holding its value on capacitance.
- The remaining nodes are untouched, and they still drive the gates of the struck node's pull-up/pull-down with the correct values. When the strike current dies, the struck node is **restored** (0 → 1), and the ½ and floating nodes return to 0/1.

The principle is that **a single node can never flip the whole loop**. The two uncorrupted nodes remain the source of truth. DICE fails only if a strike corrupts two sensitive nodes at once. That is why layout separates the node pairs, and MCUs at advanced nodes erode the protection (added).

<div class="co co-core"><p class="co-t">Core idea</p>

Hardening means redundant state: three copies plus a vote (TMR), or four interlocked nodes (DICE) where any node needs agreement from two neighbors to change. A plain 2-node latch has no way to tell which node was hit.

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

Hardening relies on the strike being **transient** and on the redundant nodes being **physically separate**. In the practice-exam latch (Check yourself Q7), a strike held indefinitely leaves the output node floating, so whether Q survives depends on off-state leakage ratios, not on restoring feedback. A single strike that reaches two sensitive nodes (an MCU) defeats DICE and TMR alike.

</div>

### 1.7 When does noise cause failure? Latches, dynamic gates, masking

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p12-1.jpeg" alt="Data noise flips a latch only if it lands inside the setup-hold window around the closing clock edge." loading="lazy"><figcaption>Data noise flips a latch only if it lands inside the setup-hold window around the closing clock edge. · EECS 627 lecture packet · page 12</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p12-2.jpeg" alt="An unbuffered latch input on a long wire is vulnerable to low undershoot, because a below-ground D turns on the off transmission gate and corrupts the stored node." loading="lazy"><figcaption>An unbuffered latch input on a long wire is vulnerable to low undershoot, because a below-ground D turns on the off transmission gate and corrupts the stored node. · EECS 627 lecture packet · page 12</figcaption></figure>

**Clock noise** (slide 35) on the latch clock can open the latch and pass a wrong D. It is uncommon because clocks are well controlled and driven by strong drivers.

**Data noise** (slides 36–37) has to arrive at the right time. In an edge-triggered (master-slave) register, a glitch on D matters only if it is present inside the **setup–hold window**. Outside the window it is ignored, or it just makes the transparent master flicker before it settles. A noise pulse straddling the window "maybe flips" the latch.

**Merging gates into the latch** (slide 38): putting the upstream NAND directly into the latch's transmission-gate input saves two inverters and makes the cell more compact. Slide 38 asks whether that is better. Slide 39 says no. With the clock off, the TG's NMOS gate is at 0. If D is a long wire coupled to an aggressor and gets **low undershoot** below ground, the NMOS sees Vgs > Vt (the source dips below its gate) and conducts. The storage node n is pulled down and the latch flips **even though it is closed**. Rule: **always protect latch inputs.** Drive the TG from a local, short, buffered node, never directly from a routed net.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p12-3.jpeg" alt="A dynamic gate is exposed for the whole evaluate window and is sensitive to low overshoot on its inputs, because a glitch that discharges the precharged node cannot be undone." loading="lazy"><figcaption>A dynamic gate is exposed for the whole evaluate window and is sensitive to low overshoot on its inputs, because a glitch that discharges the precharged node cannot be undone. · EECS 627 lecture packet · page 12</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p12-4.jpeg" alt="Aggressor noise only matters if its propagation window lines up with the capture flop&#x27;s setup-hold window, so in this example only A1 can cause a failure." loading="lazy"><figcaption>Aggressor noise only matters if its propagation window lines up with the capture flop&#x27;s setup-hold window, so in this example only A1 can cause a failure. · EECS 627 lecture packet · page 12</figcaption></figure>

**Dynamic gates** (slide 40) have a **big noise window**. The precharged node n is vulnerable for the entire evaluate phase, not just a setup-hold window. A **low overshoot** on input D (a "0" input bumping up toward Vt) partially turns on the pull-down and discharges n. The loss is permanent until the next precharge. A dynamic gate is **only sensitive to low overshoot** on the input side. Its own output node is also exposed to high undershoot via coupling (added).

**Logical masking** (slide 42): if a side input of the receiving gate is at its controlling value (e.g. a 0 into an AND), a glitch on the other input never reaches the flop.

**Temporal masking** (slide 43): the maximum noise is **not** the sum of all aggressors. A glitch has to propagate through the downstream logic (delay window [dmin, dmax]) and arrive inside the capture flop's setup-hold window. In the example, A1's window (via d1, d3) overlaps the window and A2's does not, so **only A1 affects** the flop. This window-based analysis is still **pessimistic**. It ignores correlation through **common fast/slow paths**, and it does not consider **pulse width** (a narrow glitch gets filtered).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

This is why every library flop and latch has an **input inverter/buffer** before the transmission gate. The cell's D pin must be noise-robust no matter what the router does. In ROM, the bitline is a dynamic node exposed for the whole read window. Wordline-to-bitline and bitline-to-bitline coupling, low overshoot on unselected wordlines, and n·Ioff leakage all eat into the same keeper-versus-noise margin. Shielded or twisted bitlines and keeper sizing are the countermeasures.

</div>

### 1.8 Noise propagation and noise margins

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p13-1.jpeg" alt="Injected noise has to be propagated until it hits a latch, and along the way each gate may attenuate it, amplify it or add new coupled noise." loading="lazy"><figcaption>Injected noise has to be propagated until it hits a latch, and along the way each gate may attenuate it, amplify it or add new coupled noise. · EECS 627 lecture packet · page 13</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p13-2.jpeg" alt="Model a long inverter chain as a feedback loop, where VIL/VIH define valid inputs and NML = VIL − VOL and NMH = VOH − VIH bound the DC noise allowed per stage." loading="lazy"><figcaption>Model a long inverter chain as a feedback loop, where VIL/VIH define valid inputs and NML = VIL − VOL and NMH = VOH − VIH bound the DC noise allowed per stage. · EECS 627 lecture packet · page 13</figcaption></figure>

**Noise amplification** (slides 45–48). To decide if noise is a problem, you must **propagate it until it hits a latch**. Each stage is a nonlinear amplifier. A small glitch below the switching threshold is attenuated. A glitch near the high-gain region is amplified, and more coupled noise can add at every net. Noise is **AC**, so **both pulse height and pulse width** matter. Slide 46's simulations show a glitch dying out in a chain at one amplitude and propagating to full swing at a slightly larger one. A possible **feedback loop** (latch) can capture it. Full propagation analysis must handle temporal, logic and electrical masking, which is too expensive. The **noise margin** approach instead sets **local constraints** per stage: a max input noise and a max propagated noise such that no stage ever amplifies (slide 48 shows each net's budget bar).

**Noise margin definitions** (slides 49–51). A long chain is modeled as a **ring/feedback loop** of inverters with noise sources between stages. From the transfer curve:

- **VIL / VIH** are the max input voltage still read as 0 and the min input voltage still read as 1.
- **VOL / VOH** are the outputs that result: max "0" and min "1".
- **NML = VIL − VOL**, **NMH = VOH − VIH**. They are valid only if **VOL < VIL** and **VOH > VIH**.
- The analysis is **pessimistic**: it is DC (real noise is a pulse) and local (each stage alone).

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p14-1.jpeg" alt="Choosing VIL = VIH at the 45° crossing gives the degenerate case NML = NMH = 0, so pushing one margin up always takes from the other." loading="lazy"><figcaption>Choosing VIL = VIH at the 45° crossing gives the degenerate case NML = NMH = 0, so pushing one margin up always takes from the other. · EECS 627 lecture packet · page 14</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p14-2.jpeg" alt="Each stage&#x27;s noise gain is ∂Vo/∂Vx = k/(1−k), so a stage stays non-amplifying only where the inverter&#x27;s small-signal gain k ≤ ½." loading="lazy"><figcaption>Each stage&#x27;s noise gain is ∂Vo/∂Vx = k/(1−k), so a stage stays non-amplifying only where the inverter&#x27;s small-signal gain k ≤ ½. · EECS 627 lecture packet · page 14</figcaption></figure>

**Trade-offs** (slides 52–54). Raising VIL raises NML, but it raises the VOH that the stage must produce from VIH… in effect, **NMH decreases**. The margins form a single budget that you allocate. In the extreme, **VIL = VIH = Vs** (the 45° unity-crossing point) gives **NML = NMH = 0**. You do not have to optimize NML and NMH independently. Exploiting **asymmetry** helps when noise is unequal, e.g. more ground bounce than Vdd droop.

**Objective 1: maximize the sum** (slide 55). With Vout = H(Vin):

```latex
F = NML + NMH = V_{IL} - H(V_{IH}) + H(V_{IL}) - V_{IH}
\quad\Rightarrow\quad
\frac{\partial F}{\partial V_{IL}} = 0 \Rightarrow H'(V_{IL}) = -1,\;\;
\frac{\partial F}{\partial V_{IH}} = 0 \Rightarrow H'(V_{IH}) = -1
```

The classic textbook answer is that VIL/VIH sit at the **unity-gain points**. But the transfer function may be skewed, and noise may be unequally distributed along the path.

**Objective 2: stability should be immune to small changes in noise** (slide 56). Lump the loop into one inverter of small-signal gain k with an extra noise ΔVx in the loop:

```latex
\Delta V_o = k\,\Delta V_I,\quad \Delta V_I = \Delta V_x + \Delta V_o
\;\Rightarrow\; \frac{\partial V_o}{\partial V_x} = \frac{k}{1-k}
```

At **k = 1** (the unity-gain point), ∂Vo/∂Vx = **∞**: an infinitesimal extra noise tips the loop. Requiring ∂Vo/∂Vx = 1 (noise not amplified around the loop) gives **k = ½**.

**Key points** (slide 57): **stay below the ½-gain point for safety**. Noise is AC, so it is not as bad as the DC analysis suggests. **Restoring CMOS logic plus edge-triggered registers is a robust combination.**

<div class="co co-eq"><p class="co-t">Equation card</p>

NML = VIL − VOL and NMH = VOH − VIH. Max-sum gives |H′| = 1 at VIL/VIH. Robustness gives loop noise gain k/(1−k), so use |gain| ≤ ½. Memory trick: "unity gain = infinite sensitivity, half gain = unity sensitivity".

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

Saying "noise margin is at the unity-gain point" without qualification. That maximizes the *sum* of margins, but a stage sitting there has infinite sensitivity to extra noise. The lecture's safer rule is the **½-gain point**. Also, NM only exists if VOL < VIL and VOH > VIH, which fails for weak or ratioed outputs.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Library **noise characterization** (noise-immunity curves of glitch height versus width per input pin, plus the output holding resistance; .lib CCS-noise style) (added) is exactly the "local constraint" approach. Each cell guarantees what it will reject and how hard it holds, and SI sign-off checks every net against it. Ratioed or level-shifting circuits and ROM sense inverters with skewed trip points are where the asymmetric allocation shows up.

</div>

### 1.9 Delay noise

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p15-1.jpeg" alt="An aggressor switching opposite to the victim during the victim&#x27;s transition adds a glitch that slows the edge, which makes setup timing worse." loading="lazy"><figcaption>An aggressor switching opposite to the victim during the victim&#x27;s transition adds a glitch that slows the edge, which makes setup timing worse. · EECS 627 lecture packet · page 15</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p15-2.jpeg" alt="An aggressor switching the same way speeds the victim edge, which reduces delay and can break hold timing." loading="lazy"><figcaption>An aggressor switching the same way speeds the victim edge, which reduces delay and can break hold timing. · EECS 627 lecture packet · page 15</figcaption></figure>

**Delay noise** (slide 59): when the aggressor switches *during* the victim's transition, its glitch lands on a moving edge. The victim delay is **increased or reduced**, and the waveform may **no longer be monotonic**.

- **Delay increased** (slide 60): opposite-direction switching gives **worse performance**, a setup/max-delay problem.
- **Delay decreased** (slide 61): same-direction switching **can violate hold times**, a min-delay problem.
- **Noise shape and alignment matter** (slide 62). The Δdelay-versus-alignment curves peak when the glitch lands near the victim's 50% crossing. A glitch late on the edge can produce a non-monotonic bump with an abrupt Δdelay jump.

**Effective (Miller) capacitance** (slides 63–66). Replace Cc by grounded caps Cg1 (on the aggressor) and Cg2 (on the victim) that draw the same current If = Cc·d(V1 − V2)/dt.

- **Opposite switching, equal slew** (V1 = Vdd − V2): If = 2Cc·dV/dt, so **Cg1 = Cg2 = 2Cc**.
- **Same switching** (V1 = V2): If = 0, so **Cg1 = Cg2 = 0**.
- **Aggressor twice as fast** (V1 = Vdd − 2V2): If = −3Cc·dV2/dt. The victim sees **Cg2 = 3Cc** and the aggressor sees **Cg1 = (3/2)Cc**.

General form (derived): if the aggressor slews m times faster in the opposite direction, the victim sees (1+m)·Cc and the aggressor sees (1+m)/m·Cc.

<div class="co co-eq"><p class="co-t">Equation card</p>

Miller factor = 1 + (aggressor slew rate / victim slew rate), with a sign for direction. Same direction at equal slew gives 0, quiet gives 1, opposite at equal slew gives 2, and opposite with the aggressor 2× faster gives 3 for the victim. Use 0 for min-delay (hold) and 2 or more for max-delay (setup).

</div>

Slides 67–68 use an 8× aggressor (1 Ω, 16 fF) against a 1× victim (10 Ω, 2 fF). **Opposite switching** with 2 fF coupling visibly **delays** the victim, and the aggressor is barely affected. **Same-direction switching** with a large 32 fF coupling makes the victim **faster**, because the aggressor pulls it along. The weak net is always the one that suffers.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p15-3.jpeg" alt="With equal slews and opposite switching, replacing Cc by 2·Cc to ground (4 + 2·2 = 8 fF on each net) reproduces the full coupled simulation." loading="lazy"><figcaption>With equal slews and opposite switching, replacing Cc by 2·Cc to ground (4 + 2·2 = 8 fF on each net) reproduces the full coupled simulation. · EECS 627 lecture packet · page 15</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p15-4.jpeg" alt="With a 4× faster aggressor and 4 fF coupling, the matching grounded caps are 24 fF on the victim and 9 fF on the aggressor, which shows how asymmetric Miller factors become." loading="lazy"><figcaption>With a 4× faster aggressor and 4 fF coupling, the matching grounded caps are 24 fF on the victim and 9 fF on the aggressor, which shows how asymmetric Miller factors become. · EECS 627 lecture packet · page 15</figcaption></figure>

Modeling checks (slides 69–71) use 2 Ω segments, Cg = 4 fF per net and Cc = 2 fF, and compare the full simulation (solid) to the grounded effective cap (dotted):

| Case | Victim Ceff | Aggressor Ceff | Check |
|---|---|---|---|
| Equal slew (2× vs 2× drivers) | 8 fF | 8 fF | 4 + 2·2 |
| 2× aggressor slew (4× driver) | 10 fF | 7 fF | 4 + 3·2 and 4 + 1.5·2 |
| 4× slew (8× driver), Cc = 4 fF | 24 fF | 9 fF | 4 + 5·4 and 4 + 1.25·4 (derived) |

The effective-cap model tracks the full simulation closely, which is why STA tools can use switching-window-based Miller factors instead of coupled simulation (added).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

SI-aware STA is where delay noise shows up: crosstalk-induced delta delay for setup and hold. Hold fixes at the min corner must assume the speed-up case (factor 0). In a ROM, adjacent bitlines discharge in the same direction when reading neighboring 0s, and in opposite directions in other data patterns. That data-dependent bitline Ceff is the reason for worst-case **data-pattern** characterization of read access time (added).

</div>

### 1.10 Noise avoidance

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p16-1.jpeg" alt="Spacing cuts both Cc and total cap at an area cost, and shielding eliminates Cc but increases total capacitance." loading="lazy"><figcaption>Spacing cuts both Cc and total cap at an area cost, and shielding eliminates Cc but increases total capacitance. · EECS 627 lecture packet · page 16</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p16-2.jpeg" alt="Upper metals are wider and more widely spaced (Cc ≈ 0.1Cg), lower metals are dense (Cc ≈ 2Cg), and bus encoding reduces worst-case transitions." loading="lazy"><figcaption>Upper metals are wider and more widely spaced (Cc ≈ 0.1Cg), lower metals are dense (Cc ≈ 2Cg), and bus encoding reduces worst-case transitions. · EECS 627 lecture packet · page 16</figcaption></figure>

Techniques (slides 73–78):

- **Size up the victim driver.** This lowers the holding resistance, but it also **makes the net a stronger aggressor** to its own neighbors. It is only effective if the wire is not too long, because far-end wire resistance dominates. It increases input load, so there is a delay impact.
- **Widen wires.** This reduces resistance, which is good for a long wire with a strong driver. It increases ground capacitance (and Cc via sidewall), so it can be good or bad for delay.
- **Spacing.** Coupling and total capacitance both go down, which is good for delay. The cost is area.
- **Shielding** with Vdd/GND wires between signals. Coupling is eliminated, but total capacitance goes up, so delay gets slightly worse with a fixed Miller factor of 1.
- **Higher metal layers.** They are wider and more widely spaced, and they sit further from the substrate (Cg ↓). Cc falls even faster. The slide gives **Cc ≈ 0.1Cg on higher metals** and **Cc ≈ 2Cg on lower metals**.
- **Bus encoding** (slide 76, Victor ICCAD'01). Encode the data so neighboring wires **never switch in opposite directions**. There is an encoder at the driving end and a decoder at the receiving end. The slide's example marks 0100 → 0010 invalid because adjacent bits swap. Routing density is better than inserting shields. Address and data buses behave differently, so the best code differs.
- **Insert buffers** (Intel: every **~300 µm**). This limits the coupled length per segment. **Staggered buffers** invert the aggressor polarity halfway along the victim's segment, so half the coupling injects positive noise and half negative, and the two **cancel**.
- **Active shielding** (slide 78). Drive the neighboring "shields" with the **same signal** as the victim. The coupling becomes same-direction (Miller factor 0), which minimizes effective coupling and **speeds up** the victim.

**Summary** (slide 79): most digital noise sources are **internal**, so they scale with the design. **Particle strikes are external and don't scale.** **Interconnect coupling noise is the biggest issue**, a density versus noise trade-off. Overall, CMOS circuits are *very* reliable.

<div class="co co-core"><p class="co-t">Core idea</p>

Every fix trades density, power or delay for noise. Strengthening the holder helps the victim but hurts its neighbors. Shielding kills Cc but adds C. Only spacing reduces both, at the cost of area.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

In ROM and register-file arrays, bitline pitch is fixed by the cell, so the realistic tools are shielding or interleaved bitlines, twisting, segmenting long bitlines (the analog of buffer insertion) and careful wordline driver sizing. In standard-cell routing, NDRs (wider and spaced) on clocks and long nets and shielded clocks are the routine fixes, and buffer insertion doubles as a noise fix.

</div>

### 1.x Check yourself

1. **(Exam 1 P7.1) An aggressor net transitions next to a victim that is not switching. If you reduce the width of the victim driver, does the aggressor transition get faster or slower?** Faster. The victim's holding resistance is larger, so the victim node follows the aggressor and less voltage develops across Cc. The aggressor sees a smaller effective load. The cost is a larger noise peak on the victim.

2. **(Exam 1 P7.2) As technology scales, the collection area shrinks. Why does that improve SER robustness, and how does it make the design less robust? How is that mitigated?** It improves robustness because the ion's charge is diluted across neighboring cells, so less reaches any one node. It hurts because one strike now reaches several cells, so multiple simultaneous failures become more likely. The circuit fix is **SRAM bit interleaving**, so the upset bits land in different ECC words.

3. **(Exam 1 P7.4B) You own 300 processors: 50 at 10 FIT and 250 at 100 FIT. What is the chance of a failure in one day?** (50·10/10⁹ + 250·100/10⁹)·24 = 612,000/10⁹ ≈ **6.1 × 10⁻⁴** per day.

4. **(Exam 1 P7.4A) Digital noise is deterministic. Why can't we predict it well and just do a worst-case analysis?** A real chip has an enormous number of transition combinations, and in each one the noise may or may not be masked temporally or logically. Simulating every scenario is impossible, and summing all aggressors as a worst case is far too pessimistic.

5. **Aggressor and victim each have Cg = 4 fF with Cc = 2 fF. The aggressor switches opposite to the victim and twice as fast. What grounded caps model each net?** The victim sees 4 + 3·2 = **10 fF** and the aggressor sees 4 + 1.5·2 = **7 fF** (slide 70). At equal slew both see 8 fF. If both switch the same way, both see 4 fF.

6. **Why does the lecture recommend staying below the ½-gain point instead of using the unity-gain points for VIL/VIH?** Loop noise gain is k/(1−k). At k = 1 it is infinite, so any extra noise tips the stage. At k = ½ it is 1, so noise is not amplified. The unity-gain points only maximize NML + NMH.

7. **(Exam 1 P7.3) SEU-hardened latch.** TG1 writes D onto Q and TG2 writes D onto INT2. INT2 and INT3 form a cross-coupled inverter pair (I2: INT2→INT3, I1: INT3→INT2). INT1a is driven by MP3 (gate INT2) and MN3 (gate Q). INT1b is driven by MP4 (gate Q) and MN4 (gate INT2). Q is driven by the stack MP1 (gate INT1a) + MP2 (gate INT3) to Vdd and the stack MN2 (gate INT3) + MN1 (gate INT1b) to ground. PMOS and NMOS have equal on currents and equal off currents. The posted solutions for this part are blank, so all answers below are (derived).
    - **(A) Q = 0 is stored and a strike drives INT3 1 → 0 for several FO4. Sketch INT2, INT1a, INT1b and Q. Does the latch survive?** Stored state: INT2 = 0, INT3 = 1, INT1a = 1, INT1b = 1, Q = 0. The strike sets INT3 = 0. I1 then drives INT2 0 → 1, which turns MP2 on and MN2 off. Q loses both paths (MP1 is off because INT1a = 1, MN2 is off), so **Q floats at 0**. INT2 = 1 turns MP3 off while MN3 stays off (Q = 0), so **INT1a floats at 1**. MN4 turns on while MP4 stays on, so **INT1b fights to about ½**. Q stays at 0 because pulling it up needs INT1a and INT3 to both go low, and INT1a can only fall if Q first rises. The output stage acts like a C-element. **Yes, the latch resists** at Q. The INT2/INT3 pair stays flipped until the next transparent phase rewrites it through TG2.
    - **(B) Same case, but the strike holds INT3 at 0 indefinitely. Can MP1–4 and MN1–4 be sized so Q is unaffected?** Yes, through leakage ratios. Q is floating between MP1 (off) and MN2 (off), so make the pull-down leakage win: **MN2 (and MN1) wider than MP1**. INT1a is floating between MP3 (off) and MN3 (off), so make **MP3 wider than MN3** to keep INT1a high and MP1 off.
    - **(C) Can it be sized so it also survives the mirror case: Q = 1 and a held 0 → 1 strike on INT3?** In the mirror case INT2 falls, so MP2 and MN1 are off, Q floats at 1, INT1b floats at 0 and INT1a fights. Holding Q = 1 needs **MP2 wider than MN1** and **MN4 wider than MP4**. These are different devices from case B, so on paper both sets of ratios can be met at once. In practice the retention is purely leakage-based, sensitive to PVT and to TG1 leakage from D, and holds only for a limited time. Hardening is meant for transient strikes.

8. **Why can't a standard cross-coupled latch recover from a particle strike, and how does DICE fix this?** A strike can turn either (L, H) or (H, L) into (H, H), so with only two nodes the original state is ambiguous. DICE stores the bit on four interlocked nodes, and each node needs both neighbors to agree before it changes. A single strike only floats or half-drives its neighbors, and the two untouched nodes restore the struck one.


## Lecture 2 — Synchronization

This lecture is about what happens when a flip-flop or latch samples a signal that is not synchronous with its clock. It builds the small-signal model of a cross-coupled latch caught near its metastable point, derives the regeneration time constant τ and the aperture window ta, turns them into a probability of failure and an MTBF, and then covers synchronizer design: two- and three-stage synchronizers, the bus and fan-out pitfalls, handshaking, and faster resolving circuits (Jamb latch, dynamic synchronizer). For a standard-cell designer this is the physics behind the flip-flop's clock-to-Q blow-up near the setup/hold edge, which is what .lib setup/hold characterization measures, and behind the dedicated "synchronizer flop" cells most libraries ship.

### 2.1 Why synchronization is needed

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p19-1.jpeg" alt="Deciding which of two nearly simultaneous events came first takes longer the closer they are, and fails when it takes longer than the time allotted." loading="lazy"><figcaption>Deciding which of two nearly simultaneous events came first takes longer the closer they are, and fails when it takes longer than the time allotted. · EECS 627 lecture packet · page 19</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p19-2.jpeg" alt="A latch has two stable states and one metastable balance point where A = B = Vm." loading="lazy"><figcaption>A latch has two stable states and one metastable balance point where A = B = Vm. · EECS 627 lecture packet · page 19</figcaption></figure>

- **Why multiple clock domains exist** (slide 3): systems-on-chip with many independently clocked blocks, **sensor/peripheral interfaces**, and **clock-tree variation** that makes nominally common clocks drift.
- **First problem** (slide 4): a detector produces `data` and a write-enable `WE` asynchronously to the µP clock. If WE and clk arrive at nearly the same time, the synchronizer must decide whether WE belongs to this cycle or the next. If `data` and `WE` are synchronized separately, **WE' and data' can land in different cycles**.
- **Second problem — arbitration.** Determining "who is first" is fundamentally unbounded: the smaller the time difference, the longer the decision takes. The tCQ vs tDC plot (clock-to-Q against data-to-clock separation) diverges as tDC approaches the critical point. When the decision takes longer than the time allotted, the signal fails.
- This shows up in three places: **sampling asynchronous requests**, **arbitrating between asynchronous signals**, and **transmitting between clock domains**.

**The latch picture.** A D-latch's storage loop is two cross-coupled inverters. Plotting the two transfer curves (A→B and B→A) gives three intersections: two **stable** states (A = 0, B = VDD and A = VDD, B = 0) and one **metastable** point A = B = Vm. The usual picture is a ball on a hill: the stable states are valleys and the metastable state is the hilltop. Any perturbation moves the ball off the hilltop, but if it starts almost exactly at the top it takes a long time to roll off.

Slide 8 (narrated): simulated latch waveforms as D is moved closer to the clock edge. The internal node sits near Vm for longer and longer, and **tDQ grows logarithmically** as the input lines up with the metastable point. On a log-time axis, tDQ is flat far from the edge and then rises steeply.

<div class="co co-core"><p class="co-t">Core idea</p>

A bistable element always has a metastable balance point. Sampling an input that is changing near the clock edge can leave the latch near that point, and the time it takes to resolve has no upper bound. It can only be made exponentially unlikely.

</div>

### 2.2 The small-signal model: aperture ta and regeneration τ

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p20-1.jpeg" alt="The initial imbalance ΔV0 is proportional to the input/clock offset Δt, scaled by the aperture window ta." loading="lazy"><figcaption>The initial imbalance ΔV0 is proportional to the input/clock offset Δt, scaled by the aperture window ta. · EECS 627 lecture packet · page 20</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p20-2.jpeg" alt="Once the inputs settle, the latch is two cross-coupled inverters and ΔV grows exponentially with time constant τr = Cd/gm." loading="lazy"><figcaption>Once the inputs settle, the latch is two cross-coupled inverters and ΔV grows exponentially with time constant τr = Cd/gm. · EECS 627 lecture packet · page 20</figcaption></figure>

**Step 1: initial imbalance from the timing offset (slide 9).** Use a cross-coupled NAND latch whose inputs A and B both rise 0→1, separated by Δt. During Δt only one side is pulling, so it develops a voltage difference with slope ks:

```latex
\Delta V_0 = k_s\,\Delta t,\qquad k_s = \frac{I_d}{C} = \frac{1}{t_a}\quad\Rightarrow\quad \Delta V_0 = \frac{\Delta t}{t_a}
```

- **ta is the aperture window**: the time over which the input moves the internal node by one (normalized) volt. It is a **function of transistor size and load capacitance** (ta = C/Id).
- ΔV0 here is normalized to the 1 V decision level used on the next slides.

**Step 2: regeneration (slide 10).** As B goes to 1, the NAND gates act as **cross-coupled inverters**, biased near Vm with small-signal gain. A voltage difference ΔV gives a current ΔI = gm·ΔV into the node capacitance Cd:

```latex
\Delta I = g_m\,\Delta V,\qquad d\Delta V = \frac{\Delta I\,dt}{C_d} = \frac{g_m\,\Delta V\,dt}{C_d}
```

```latex
\Delta V(t) = \Delta V(0)\,e^{\frac{g_m t}{C_d}} = \Delta V_0\,e^{t/\tau_r},\qquad \tau_r = \frac{C_d}{g_m}
```

- **τr is the regeneration time constant** of the latch: node capacitance over the transconductance of the cross-coupled pair at the metastable bias. It is close to one fanout-of-one inverter delay (added: a rule of thumb, roughly the FO1–FO4 range).
- The positive feedback makes the difference **grow** exponentially rather than decay. That is why a latch eventually resolves, and why the time it needs depends on the **log** of the starting imbalance.

<div class="co co-eq"><p class="co-t">Equation card</p>

ΔV0 = Δt/ta, ΔV(t) = ΔV0·e^(t/τr), τr = Cd/gm. Memory trick: "ta converts time to voltage, τr amplifies voltage exponentially." Small Cd and large gm give a fast latch.

</div>

### 2.3 Resolving time td and why it diverges

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p21-1.jpeg" alt="Setting ΔV(td) = 1 V gives td = τr·ln(ta/Δt), so td goes to infinity as Δt goes to 0." loading="lazy"><figcaption>Setting ΔV(td) = 1 V gives td = τr·ln(ta/Δt), so td goes to infinity as Δt goes to 0. · EECS 627 lecture packet · page 21</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p21-2.jpeg" alt="For a given allotted td, the synchronizer fails only if the two edges fall within ta·e^(−td/τr) of each other." loading="lazy"><figcaption>For a given allotted td, the synchronizer fails only if the two edges fall within ta·e^(−td/τr) of each other. · EECS 627 lecture packet · page 21</figcaption></figure>

Define **td as the resolving time**, the time for the output to reach 1 V:

```latex
\Delta V(t_d) = \Delta V_0\,e^{t_d/\tau_r} = 1 \;\Rightarrow\; t_d = -\tau_r \ln(\Delta V_0) = -\tau_r \ln\!\left(\frac{\Delta t}{t_a}\right) = \tau_r\ln\!\left(\frac{t_a}{\Delta t}\right)
```

- **As Δt → 0, td → ∞.** In a real circuit **noise breaks the tie** and the latch converges, but the time is still unbounded in principle.
- Every factor of e reduction in Δt costs one more τr of resolving time. Every 2.3·τr of extra waiting buys a **10× reduction** in the window that fails.

**Turning it into a failure probability (slide 13).** Two clocks with frequencies fA and fB slide past each other, so Δt is uniformly distributed over one period TA. If we allow td for the decision, the synchronizer fails when:

```latex
P\big(\Delta V(t_d) < 1\big) \;\Rightarrow\; \Delta V_0\,e^{t_d/\tau_r} = \frac{\Delta t}{t_a}\,e^{t_d/\tau_r} < 1 \;\Rightarrow\; \Delta t < t_a\,e^{-t_d/\tau_r}
```

```latex
P\big(\Delta V(t_d) < 1\big) = P\!\left(\Delta t < t_a e^{-t_d/\tau_r}\right) = \frac{t_a\,e^{-t_d/\tau_r}}{T_A} = t_a\,f_A\,e^{-t_d/\tau_r}
```

The quantity **ta·e^(−td/τr)** is the effective **metastability window**: the band of Δt that is still unresolved after td. It shrinks exponentially with waiting time.

<div class="co co-guard"><p class="co-t">Common trap</p>

ta and τr are different things. ta (aperture) sets how big the dangerous window is at t = 0 and enters the probability linearly. τr sets how fast the window shrinks and sits in the exponent. Halving τr helps far more than halving ta. Also, the setup and hold times on a datasheet are not ta: they are chosen to keep tCQ degradation small (for example 10%), so ta is much smaller than setup + hold.

</div>

### 2.4 Failure rate and MTBF

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p21-3.jpeg" alt="Failure frequency is ta·fA·fB·e^(−td/τr) and MTBF is its reciprocal." loading="lazy"><figcaption>Failure frequency is ta·fA·fB·e^(−td/τr) and MTBF is its reciprocal. · EECS 627 lecture packet · page 21</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p21-4.jpeg" alt="With ta = 100 ps, τr = 200 ps and td = 10 ns, MTBF comes out near 10^8 years." loading="lazy"><figcaption>With ta = 100 ps, τr = 200 ps and td = 10 ns, MTBF comes out near 10^8 years. · EECS 627 lecture packet · page 21</figcaption></figure>

```latex
P(\text{Failure}) = t_a f_A\,e^{-t_d/\tau_r},\qquad
\text{Frequency of failure} = t_a f_A f_B\,e^{-t_d/\tau_r},\qquad
\text{MTBF} = \frac{e^{t_d/\tau_r}}{t_a f_A f_B}
```

- P(Failure) is **per sampling event**. Multiply by the event rate of the other clock to get failures per second.
- Slide 14 labels fA as the **faster** clock frequency in P(failure). Either way, the failure rate uses the product fA·fB, so the labeling only matters for which "per event" probability you quote.

**Worked example (slide 15).** fA = 50 MHz (events on line A), fB = 300 MHz (events on line B), ta = 100 ps, td = 10 ns, τr = 200 ps.

- Use the **higher** frequency in P: P = ta·fB·e^(−td/τr) = 100 ps × 300 MHz × e^(−50) = 0.03 × 1.93×10⁻²² = **5.786×10⁻²⁴**.
- MTBF = 1/(P·fA) = 1/(5.786×10⁻²⁴ × 50 MHz) = **3.45×10¹⁵ s ≈ 10⁸ years**.
- The slide's MTBF line writes 5.786×10⁻²¹. That is a typo for 10⁻²⁴; the final 3.45×10¹⁵ s uses 10⁻²⁴ (derived).

**The scale argument (slide 16).** 10⁸ years sounds safe, BUT there are **100,000 synchronized signals on a chip** and **10,000 parts in a data center**, so 10⁹ synchronizers. 10⁹ / 10⁸ years = **10 failures per year** across the fleet. MTBF targets must be set for the population, not for one flop.

<div class="co co-eq"><p class="co-t">Equation card</p>

MTBF = e^(td/τr) / (ta·fA·fB). Memory trick: "time constant on top, frequencies on the bottom." Each extra τr of waiting multiplies MTBF by e. Each extra clock cycle TA multiplies it by e^(TA/τr), which is huge when TA ≫ τr.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

τr and ta are flip-flop properties that a cell designer controls: τr = Cd/gm of the master/slave cross-coupled pair, which is why synchronizer flops use a lightly loaded storage node and strong feedback devices. The same physics sets the shape of the .lib clock-to-Q vs data-arrival curve: as data approaches the clock edge, tCQ rises logarithmically, and setup/hold are defined at a pushout criterion on that curve. Low VDD and slow corners raise τr sharply because gm drops (near-threshold gm is exponential in Vgs), so synchronizer MTBF must be signed off at the slow, low-voltage, cold or hot corner where gm is lowest, and with high-sigma τr since one weak synchronizer out of 10⁹ is what fails.

</div>

### 2.5 Basic synchronizers: one, two and three stages

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p22-1.jpeg" alt="Moving logic out of the crossing cycle raises td from TA − tlogic − tsu to TA − tsu." loading="lazy"><figcaption>Moving logic out of the crossing cycle raises td from TA − tlogic − tsu to TA − tsu. · EECS 627 lecture packet · page 22</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p22-2.jpeg" alt="A third stage multiplies two independent failure probabilities, so the exponent effectively doubles." loading="lazy"><figcaption>A third stage multiplies two independent failure probabilities, so the exponent effectively doubles. · EECS 627 lecture packet · page 22</figcaption></figure>

- **Single-latch synchronizer.** The receiving flop in the clkA domain feeds logic, then the next clkA flop. Time available to resolve: **td = TA − tlogic − tsu**.
- **Double-latch (two-flop) synchronizer.** Insert a second clkA flop **with no logic between** the two. Now **td = TA − tsu**. Since td sits in the exponent, removing tlogic from the cycle is worth a factor e^(tlogic/τr) in MTBF. The cost is one cycle of latency.
- **Triple-latch.** Add another stage. Each stage has about **TA − tsu** to resolve, and the first latch only passes a failure on if the second latch also fails to resolve:

```latex
P(\text{fail}) = P(\text{fail-latch1})\cdot P(\text{fail-latch2})
```

The decision time is effectively doubled (2·(TA − tsu)) at the cost of another cycle of latency.

<div class="co co-core"><p class="co-t">Core idea</p>

A synchronizer works by buying resolving time. Every stage with no logic between flops adds about one clock period to td, and MTBF grows as e^(td/τr).

</div>

### 2.6 Pitfalls: fan-out and buses

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p23-1.jpeg" alt="Never synchronize the same asynchronous signal in more than one place, because the copies can resolve differently." loading="lazy"><figcaption>Never synchronize the same asynchronous signal in more than one place, because the copies can resolve differently. · EECS 627 lecture packet · page 23</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p23-2.jpeg" alt="Synchronizing each bit of a bus separately lets skew put different bits into different cycles." loading="lazy"><figcaption>Synchronizing each bit of a bus separately lets skew put different bits into different cycles. · EECS 627 lecture packet · page 23</figcaption></figure>

- **Fan-out pitfall.** If one clkX signal goes to two separate clkA synchronizer flops, one may resolve to the old value and the other to the new value in the same cycle. The logic downstream sees an **inconsistent** state. **Synchronize once, then fan out internally** inside the clkA domain.
- **Bus pitfall.** Per-bit synchronizers on SIG[0], SIG[1] look natural but **don't do this**: different travel times (wire skew, different flop apertures) mean one bit can be captured this cycle and another bit next cycle, so the receiver sees a value that was never sent (for example 01→10 read as 11 or 00).
- Interview angle: "Why not just put a two-flop synchronizer on every bit of a counter crossing domains?" Answer: bits can be split across cycles. The fixes are a single synchronized control signal (handshake, next section) or Gray coding so only one bit changes at a time (Gray coding is added, standard practice for async FIFO pointers).

### 2.7 Handshaking and ways to reduce failure

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p23-3.jpeg" alt="Handshaking synchronizes one REQ/ACK pair instead of the data bus, so the multi-bit data is stable when it is read." loading="lazy"><figcaption>Handshaking synchronizes one REQ/ACK pair instead of the data bus, so the multi-bit data is stable when it is read. · EECS 627 lecture packet · page 23</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p23-4.jpeg" alt="Smaller cap, waiting longer, lower frequency, faster gates, completion logic and more stages all reduce failure frequency." loading="lazy"><figcaption>Smaller cap, waiting longer, lower frequency, faster gates, completion logic and more stages all reduce failure frequency. · EECS 627 lecture packet · page 23</figcaption></figure>

**Handshaking rules (4-phase):**

1. Sender puts data on the bus, then **asserts REQ**.
2. Receiver (after synchronizing REQ) **latches the data, asserts ACK**.
3. Sender **deasserts REQ** and will not reassert until ACK deasserts.
4. Receiver sees REQ deasserted and **deasserts ACK** when ready to continue.

Only REQ (into the receiver domain) and ACK (into the sender domain) pass through synchronizers. The data bus is held stable for the whole exchange, so it needs no synchronization: **a single point of synchronization for the entire bus**. The cost is throughput: several synchronizer latencies per transfer.

**How to reduce frequency of failure (slide 24):**

- **Smaller capacitance.** Shield the load cap at the output of the cross-coupled inverters in the flop, because τr = Cd/gm. Drive Q through a buffer rather than loading the storage node.
- **Wait longer** (multiple clock cycles). Application-specific: is the latency acceptable?
- **Lower frequency.** fA·fB is in the denominator, and a longer TA also increases td.
- **Faster gates.** Technology scaling reduces τr, but clock frequency goes up too, so td shrinks with it.
- **Add completion logic (?)** — see next.
- **Add more sampling FFs:** multi-stage synchronizers.

**Sizing trade-offs inside the synchronizer flop** (Exam 2 P4 C/D). Take a standard latch used as the synchronizing element: an input tristate (D → Ni), a forward inverter (Ni → Q) and a feedback tristate (Q → Ni), with the two tristates on opposite clock phases. The two metastability parameters respond to sizing differently:

- **ta** is set by how fast D can move Ni, so it depends on the input tristate's drive against the load on Ni.
- **τr = Cd/gm** is set by the loop formed by the forward inverter and the feedback tristate.

| Change | ta | τr | Net effect |
|---|---|---|---|
| Upsize the **forward inverter** | ↑ (more load on Ni slows the input tristate) | ≈ same to first order, since gm and Cd both scale. In practice ↓, because part of Cd is fixed. | ta is worse; τr is slightly better |
| Upsize the **input tristate** | ↓ (stronger drive moves Ni faster) | ↑ (its diffusion cap adds to Cd at Ni, and loop gm is unchanged) | ta is better; τr is worse |

Since τr sits in the exponent of MTBF, the τr term usually dominates. Keep the input device just strong enough, make the loop strong relative to its own capacitance, and buffer Q off the storage node.

<div class="co co-guard"><p class="co-t">Common trap</p>

"Scaling fixes metastability" is wrong in practice. τr improves with each node, but TA shrinks just as fast, and at low VDD τr gets much worse because gm collapses. MTBF has to be checked at the operating voltage and corner where the synchronizer runs.

</div>

### 2.8 Completion detection and the Jamb latch

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p24-1.jpeg" alt="Skewed inverters detect a mid-rail value and hold en low, but en can itself go metastable." loading="lazy"><figcaption>Skewed inverters detect a mid-rail value and hold en low, but en can itself go metastable. · EECS 627 lecture packet · page 24</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p24-2.jpeg" alt="A Jamb latch resolves faster because its feedback reduces to a lightly loaded cross-coupled inverter pair." loading="lazy"><figcaption>A Jamb latch resolves faster because its feedback reduces to a lightly loaded cross-coupled inverter pair. · EECS 627 lecture packet · page 24</figcaption></figure>

**Completion detection.** The idea is to detect whether the synchronizer output is still mid-rail and only enable the downstream flop when it has resolved.

- **Inv_n** has a strong NMOS (low switching threshold) and **Inv_p** has a strong PMOS (high switching threshold). A is data through Inv_n and a second inverter. B is data through Inv_p.
- **Stable case** (data at full-rail 1 or 0): (A, B) = (1, 0) or (0, 1), so **en = 1** (en is a NAND of A and B).
- **Metastable case** (data mid-rail): Inv_n pulls down, the second inverter pulls up, so A = 1. Inv_p pulls up, so B = 1. (A, B) = (1, 1), so **en = 0**.
- **BUT 'en' can itself be metastable** when the flop fires: the transition between the two cases is continuous, so the detector moves the problem without removing it. The slide's sigmoid sketch marks the "metastable region" of en.

**Jamb latch.** A cross-coupled inverter pair with a reset device and a data/clock NMOS stack that pulls one side down (the "jamb"). Benefits:

- **Faster resolving.** The feedback loops simplify to cross-coupled inverter pairs, the output is buffered, and the storage node sees very little load, so Cd and τr are small.
- No transmission gates or clocked feedback in the loop, so gm of the loop is the full inverter gm.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Jamb-style latches and sense-amp flops are the same circuit family as SRAM/ROM sense amplifiers: a cross-coupled pair resolving a small initial imbalance ΔV0 with time constant Cd/gm. The sense-amp resolve time is td = τr·ln(Vswing/ΔVbitline), so the metastability math here also sets how much bitline split a ROM or register-file sense amp needs for a given sense time, and what happens to the rare cell with a tiny split (a high-sigma failure).

</div>

### 2.9 Advanced synchronizers and how to measure them

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p25-1.jpeg" alt="The dynamic synchronizer uses precharged dynamic buffers whose skewed inverters turn an intermediate voltage into a pulse that resolves cleanly." loading="lazy"><figcaption>The dynamic synchronizer uses precharged dynamic buffers whose skewed inverters turn an intermediate voltage into a pulse that resolves cleanly. · EECS 627 lecture packet · page 25</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p25-2.jpeg" alt="Adding capacitance stretches τ until the metastability window is measurable, then the line is extrapolated back to the self-load." loading="lazy"><figcaption>Adding capacitance stretches τ until the metastability window is measurable, then the line is extrapolated back to the self-load. · EECS 627 lecture packet · page 25</figcaption></figure>

**Dynamic synchronizer** (Giridhar et al., CICC 2013, from Blaauw's group):

- In a double-flop synchronizer, an **intermediate voltage on Q1** can cause metastability at Q2.
- The dynamic version replaces the flops with **dynamic buffers** (P-skewed, precharged on CK, evaluate on CK). An intermediate input on Y1 causes the evaluate node to discharge **partially**, producing a pulse. Scenario 1: an intermediate voltage on Y1 does cause V2 to evaluate. Scenario 2: certain pulses on Y1 can make Y2 metastable.
- **Pulse amplification (slide 29, narrated):** chains of **skewed inverters** between the dynamic buffers act as a pulse filter/amplifier. A narrow, weak pulse shrinks and dies; a wide one grows to full swing. Each stage pushes the output toward a clean 0 or 1, and more stages (2-stage vs 3-stage, 1-inverter vs 7-inverter chains) shrink the window further.

**Measurement by capacitance de-rating (slide 30):**

- The real metastability window at nominal conditions (around 10⁻³⁰ s and below) is far too small to measure directly.
- So deliberately add **load capacitance** (up to about 30k fF) to raise τ until the window is measurable (10⁻⁷ to 10⁻¹² s). The window vs capacitance is a straight line on a log scale.
- **Extrapolate back** to the **self-load (about 2 fF)** and the nominal 2 GHz operation.

**Comparison (slide 31, narrated):** the extrapolated metastability windows, with fit and measurement error bars, show the 3-stage, 7-inverter **dynamic synchronizer** with a window many orders of magnitude smaller than the **Jamb latch** and the **2-FF synchronizer** (reading the chart, about 10⁻³⁷ to 10⁻³⁹ s for the dynamic design against about 10⁻²⁸ to 10⁻³² s for the others).

<div class="co co-core"><p class="co-t">Core idea</p>

You cannot simulate or measure a 10⁸-year MTBF directly. You measure or simulate τr and ta (for example by de-rating to make them large and then extrapolating), and compute MTBF from the exponential model.

</div>

Summary (slide 32): metastability model (τ, td), MTBF; bus synchronization by handshake; synchronizer circuits (2 FFs, Jamb latch, dynamic latch); synchronizer measurement by capacitance de-rating.

### 2.x Check yourself

1. **Derive τr for a cross-coupled latch near its metastable point.** → ΔI = gm·ΔV charges Cd: dΔV/dt = gm·ΔV/Cd, so ΔV(t) = ΔV0·e^(t/τr) with τr = Cd/gm.

2. **Why does td go to infinity as Δt goes to 0, and what saves real circuits?** → td = τr·ln(ta/Δt): the initial imbalance ΔV0 = Δt/ta goes to zero, so exponential growth needs unbounded time to reach 1 V. Noise breaks the tie in practice, but the resolve time is still unbounded in probability.

3. **Recompute the slide 15 example: fA = 50 MHz, fB = 300 MHz, ta = 100 ps, τr = 200 ps, td = 10 ns.** → P = 100 ps·300 MHz·e^(−50) = 5.786×10⁻²⁴. MTBF = 1/(P·fA) = 3.45×10¹⁵ s ≈ 1.1×10⁸ years.

4. **(Exam 2 P4 A/B) A two-flop synchronizer has TCQ = Tsetup = 50 ps. fA = 1 GHz (sending), fB = 1.5 GHz (receiving), Tlogic = 200 ps after the first flop, ta = 20 ps. What τr gives Pfailure = 6.2×10⁻¹¹, and what is the MTBF?** → td = Tperiod − (Tlogic + Tsetup) = 670 ps − 250 ps = 420 ps. Pfailure = ta·fB·e^(−td/τr) gives 0.03·e^(−420/τr) = 6.2×10⁻¹¹, so 420/τr = ln(4.84×10⁸) ≈ 20.0 and **τr ≈ 21 ps** (derived; the solution leaves it as X). MTBF = 1/(fA·Pfailure) = 1/(10⁹ × 6.2×10⁻¹¹) ≈ **16 s**.

5. **(Exam 2 P4 C/D) In a latch used as a synchronizer, how do ta and τr change if you upsize (C) the forward inverter or (D) the input tristate?** → (C) ta increases, because the bigger inverter loads Ni and slows the input tristate, so the chance of metastability goes up. τr is unchanged to first order (gm and Cd scale together) and decreases slightly in practice because some capacitance is fixed, which helps. (D) ta decreases, because the stronger input drive moves Ni faster, which helps. τr increases, because there is extra capacitance at Ni with no extra loop gm, which hurts.

6. **Why is a 10⁸-year MTBF not good enough for a data-center product?** → 10⁵ synchronizers per chip × 10⁴ parts = 10⁹ synchronizers, so about 10 failures per year across the fleet.

7. **Why is a two-flop synchronizer better than one flop followed by logic?** → td goes from TA − tlogic − tsu to TA − tsu. Because td is in the exponent, MTBF improves by e^(tlogic/τr).

8. **Why not synchronize each bit of a bus, or synchronize one signal in two places?** → The copies can resolve to different cycles, so the receiver sees inconsistent values or a bus value that was never sent. Use a single synchronized REQ/ACK handshake (or Gray-coded pointers), and synchronize once then fan out.


## Lecture 3 — Low Power

This lecture reviews where CMOS power goes (dynamic, short-circuit, leakage) and then walks through the circuit-level knobs for cutting it: clock gating, supply scaling bought with parallelism or pipelining, multiple supply domains, dynamic voltage scaling, and operation near threshold with its minimum-energy point. The last third is about the circuit every multi-supply chip needs: the **level converter** (DCVS, pass-gate, improved keepers, interrupted DCVS, split-control) and the level-converting flip-flop. At a GPU company, level shifters are library cells with a two-sided sizing window and opposite sign-off corners, and memory macros carry their own internal shifters, so this material is directly on the job description.

### 3.1 Power consumption review

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p27-1.jpeg" alt="Short-circuit current flows only while both devices conduct, so a slow input driving a fast output is the bad case." loading="lazy"><figcaption>Short-circuit current flows only while both devices conduct, so a slow input driving a fast output is the bad case. · EECS 627 lecture packet · page 27</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p27-2.jpeg" alt="On a rising output the supply delivers C·VDD², half burned in the PMOS and half stored on the load." loading="lazy"><figcaption>On a rising output the supply delivers C·VDD², half burned in the PMOS and half stored on the load. · EECS 627 lecture packet · page 27</figcaption></figure>

**Total power = dynamic + static (leakage) + short-circuit.** Slide 3 also marks the static parts: subthreshold leakage through the off device and gate-oxide leakage through the on device.

**Short-circuit power.** While the input sits in the window Vtn < Vin < VDD − |Vtp|, both devices conduct.

- **Good case (input fast, output slow).** The output is still near VDD while the input crosses the window, so the PMOS sees a small VDS and passes little current, and only for a short time.
- **Bad case (input slow, output fast).** The output has already fallen while the input is still mid-swing, so the PMOS sees a large VDS for a long time.
- **Rule from the slide:** with comparable input and output rise/fall times, short-circuit power is < 10% of dynamic power, and the course ignores it from here on.

**Dynamic energy, input 1→0 (output charges 0→VDD).**

```latex
E_{supply} = \int_0^{\infty} V_{dd}\, i(t)\,dt = V_{dd} C \int_0^{V_{dd}} dV_O = C V_{dd}^2
```

```latex
E_{PMOS} = \int_0^{\infty} (V_{dd}-V_O)\, i_p(t)\,dt = \tfrac{1}{2} C V_{dd}^2,\qquad E_{CAP} = \int_0^{\infty} V_O\, i_C\,dt = \tfrac{1}{2} C V_{dd}^2
```

The result does not depend on the PMOS on-resistance. Sizing changes how *fast* the energy is dissipated, not *how much*.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p28-1.jpeg" alt="On the falling edge the supply delivers nothing, and the NMOS dissipates the ½CV² stored on the load." loading="lazy"><figcaption>On the falling edge the supply delivers nothing, and the NMOS dissipates the ½CV² stored on the load. · EECS 627 lecture packet · page 28</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p28-2.jpeg" alt="Switching power is α·C·VDD²·f, with α = 1 for a clock and ½ for a signal that switches once per cycle." loading="lazy"><figcaption>Switching power is α·C·VDD²·f, with α = 1 for a clock and ½ for a signal that switches once per cycle. · EECS 627 lecture packet · page 28</figcaption></figure>

**Input 0→1 (output discharges).** The supply delivers 0 energy, and the NMOS dissipates the stored ½CV². Over one full charge/discharge cycle the supply delivers C·VDD², half lost in each device, so each device burns P = f·½CV².

**Activity factor.** With switching frequency fsw = α·f:

- a **clock** has α = 1 (one full charge/discharge per cycle);
- a signal that **switches once per clock cycle** (0→1 one cycle, 1→0 the next) has α = ½.

<div class="co co-eq"><p class="co-t">Equation card</p>

```latex
P_{switching} = \alpha\, C\, V_{DD}^2\, f
```
Only V is squared, so supply scaling is the strongest knob. Watch the α convention: here α counts full charge/discharge cycles per clock (clock α = 1). Many textbooks define α as 0→1 transitions per cycle and write ½αCV²f; both agree for a clock (added).

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

"A bigger driver burns more switching energy." It does not. The ½CV² lost per edge is independent of on-resistance. A bigger driver costs energy only through its own extra gate and diffusion capacitance (more C) and through short-circuit current if it slows the edges of its own input.

</div>

Slide 8 lists where power can be attacked. At the architecture level: data compression, power management, algorithm choice, delay/power trade-off, and clock gating (~20%). At the technology level: low-k dielectrics, SOI, and advanced nodes. Slide 10 then sorts the circuit knobs by the terms of the equation:

- **Reduce C:** sizing, P/N ratio, shorter routes, new circuit structures.
- **Reduce α:** clock gating, bus encoding.
- **Scale VDD** ("very effective"): parallel/pipeline trade-off, low-swing signaling and clocking, dynamic voltage scaling (DVS).

### 3.2 Clock gating

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p29-1.jpeg" alt="Gating 90% of the flip-flops in an MPEG4 decoder cut power from 30.6 mW to 8.5 mW, about 70%, using a latch-based glitch-free gate." loading="lazy"><figcaption>Gating 90% of the flip-flops in an MPEG4 decoder cut power from 30.6 mW to 8.5 mW, about 70%, using a latch-based glitch-free gate. · EECS 627 lecture packet · page 29</figcaption></figure>

**Clock gating** stops the clock to registers whose inputs are not changing. The clock tree and the flops' internal clock nodes have α = 1, so they often dominate dynamic power. In the MPEG4 decoder (Ohashi, ISSCC'02), 90% of the flip-flops are clock-gated, and clock gating alone gives a 70% power reduction (30.6 mW → 8.5 mW).

**The integrated clock-gating (ICG) cell** on the slide:

- `en` passes through a **latch that is transparent while clk is low**; its output `n` is ANDed with `clk` to form `g_clk`.
- Because the latch is opaque while clk is high, a glitch or late change on `en` during the high phase cannot reach `g_clk`. In the waveform, `n` changes only after clk falls, one tCQ later.
- Without the latch, AND(clk, en) would chop the clock pulse whenever `en` moved during the high phase and could clock a flop on a glitch.

<div class="co co-core"><p class="co-t">Core idea</p>

Clock gating lowers α on the highest-α net on the chip. The latch + AND structure makes it safe: `en` is sampled only during the low phase, so `g_clk` cannot glitch.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

The ICG is itself a standard cell, characterized with a **clock-gating setup/hold check of `en` against clk**, not an ordinary data check. ROM and register-file macros gate their own internal clocks (precharge and wordline enables fire only on an access), and the `.lib` clock-pin internal-power tables for idle versus active come from exactly this behavior.

</div>

### 3.3 Supply scaling at constant throughput: parallelism and pipelining

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p30-1.jpeg" alt="Two parallel copies at fref/2 each get twice the time, so VDD can drop and power scales by about ε², because the (2+ov)/2 factor is almost 1." loading="lazy"><figcaption>Two parallel copies at fref/2 each get twice the time, so VDD can drop and power scales by about ε², because the (2+ov)/2 factor is almost 1. · EECS 627 lecture packet · page 30</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p30-2.jpeg" alt="Pipelining halves the logic depth per stage, so VDD can drop at the same clock: with ov = 10% and ε = 0.66, power is 0.48·Pref." loading="lazy"><figcaption>Pipelining halves the logic depth per stage, so VDD can drop at the same clock: with ov = 10% and ε = 0.66, power is 0.48·Pref. · EECS 627 lecture packet · page 30</figcaption></figure>

The idea: **spend area to buy delay slack, then trade the slack for lower VDD.** Power falls roughly quadratically with VDD, while the area cost is only linear.

**Reference design (slide 13):** registers, logic F1 and F2, clock fref, and Pref = Cref·Vdd,ref²·fref, where Cref is the average switching capacitance.

**Parallel implementation.** Duplicate F1/F2 and alternate between the copies, so each copy has two cycles; a mux selects the output.

```latex
f_{par} = f_{ref}/2,\quad C_{par} = (2+ov_{par})\,C_{ref},\quad V_{dd,par} = \epsilon_{par} V_{dd,ref}
```

```latex
P_{par} = \epsilon_{par}^2 \cdot \frac{2+ov_{par}}{2} \cdot P_{ref}
```

Doubling C is cancelled by halving f, so (2+ov)/2 is "almost 1". The net gain is ε² from running each copy slower at a lower supply.

**Pipelined implementation.** Insert registers between F1 and F2. The clock stays at fref, but each stage has about half the logic depth, so the same frequency is met at lower VDD.

```latex
f_{pipe} = f_{ref},\quad C_{pipe} = (1+ov_{pipe})\,C_{ref},\quad P_{pipe} = \epsilon_{pipe}^2 (1+ov_{pipe}) P_{ref}
```

Worked example from the slide: ov_pipe = 10%, ε_pipe = 0.66, so P_pipe = 0.66²·1.1·Pref = **0.48 Pref**.

Costs (slide 12): area (a parallel design roughly doubles area), latency (a pipeline adds cycles), and the cost/power trade-off. The fixed tCQ + tsetup of each pipeline register takes a larger share of a shorter stage, which is why ε cannot be pushed down indefinitely (added).

<div class="co co-eq"><p class="co-t">Equation card</p>

Parallel: P = ε²·(2+ov)/2·Pref ≈ ε²·Pref. Pipelined: P = ε²·(1+ov)·Pref. Example: 0.66²·1.1 = 0.48.
The overhead is linear; the voltage win is squared.

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

The ε² gain exists only if VDD is actually lowered. Parallelism at fixed VDD saves nothing; it doubles C and halves f. Near threshold, delay grows superlinearly as VDD drops, so a 2× delay budget buys a much smaller ε, and the leakage of the doubled area starts to count (see 3.6).

</div>

### 3.4 Multiple supply domains (multi-VDD, CVS)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p31-1.jpeg" alt="In clustered voltage scaling only non-critical gates move to VDDL, and paths may go from high to low voltage only, with level-shifting flops at the boundary." loading="lazy"><figcaption>In clustered voltage scaling only non-critical gates move to VDDL, and paths may go from high to low voltage only, with level-shifting flops at the boundary. · EECS 627 lecture packet · page 31</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p31-2.jpeg" alt="Single-rail cells at VDDH and VDDL need N-well isolation, so they go in dedicated rows or dedicated regions." loading="lazy"><figcaption>Single-rail cells at VDDH and VDDL need N-well isolation, so they go in dedicated rows or dedicated regions. · EECS 627 lecture packet · page 31</figcaption></figure>

**Multiple voltage domains** use the timing slack that most paths have: off-critical gates move to VDDL while the critical path stays at VDDH. Slide 12 lists the costs: DC-DC converters or extra off-chip supplies, and distributing several supplies on chip.

**Clustered Voltage Scaling (CVS), slide 17:**

- The low-VDD portion is shaded. Within a combinational cone, signals may go **from high to low voltage ONLY**.
- A VDDL gate driving a VDDH gate is the problem: its "1" is only VDDL, so the VDDH gate's PMOS sees VSG = VDDH − VDDL. If that exceeds |Vtp|, the PMOS is not off, and the gate draws static current or fails to switch cleanly.
- Low-to-high conversion therefore happens at the domain boundary, in the **level-shifting flip-flop** (marked FF on the slide).

**Physical implementation, slide 18.** The N-wells of VDDH and VDDL PMOS devices sit at different potentials, so they need **N-well isolation spacing**: (a) dedicated alternating VDDL/VDDH rows, or (b) dedicated VDDH and VDDL regions. Each costs area or placement freedom.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p31-3.jpeg" alt="With a shared N-well tied to VDDH, VDDL cells mix freely in a row, but their PMOS sees reverse body bias VSB = VDDL − VDDH." loading="lazy"><figcaption>With a shared N-well tied to VDDH, VDDL cells mix freely in a row, but their PMOS sees reverse body bias VSB = VDDL − VDDH. · EECS 627 lecture packet · page 31</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p31-4.jpeg" alt="A VDDL input cannot turn off a VDDH PMOS, so the level-converting flip-flop restores full VDDH swing inside the flop." loading="lazy"><figcaption>A VDDL input cannot turn off a VDDH PMOS, so the level-converting flip-flop restores full VDDH swing inside the flop. · EECS 627 lecture packet · page 31</figcaption></figure>

**Shared N-well, slide 19.** All cells share an N-well tied to VDDH, so VDDL and VDDH cells mix anywhere with no isolation spacing. The VDDL PMOS has its source at VDDL and its body at VDDH, so it sees **reverse body bias, VSB = VDDL − VDDH**. That raises |Vtp|, making those gates slower but less leaky (added).

**Level-Converting Flip-Flop (LCFF, Ishihara ISLPED'03), slide 20.**

- **Problem:** a 0-to-VDDL signal into a VDDH inverter leaves that PMOS at |VGS| = VDDH − VDDL when the input is "high", so the "PMOS does not turn off": static current and a degraded low.
- **Fix:** the low-domain driver feeds a clocked pass gate into a high-domain latch with a VDDH feedback inverter. The pull-down path (red, on/off) discharges the latch node, and the VDDH feedback restores the full high level.
- The conversion is absorbed into a flop that was already there, so a separate level shifter's delay and area leave the critical path.

<div class="co co-core"><p class="co-t">Core idea</p>

Going down in voltage is free. Going up needs a level converter, because a VDDL "1" cannot shut off a VDDH PMOS. Put the converter where a sequential element already exists (the LCFF) and keep each cone strictly high-to-low.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Multi-VDD appears in library work as **level-shifter cells** (single- and dual-rail), always-on cells, and the **N-well/row strategy** of a dual-rail library. SRAM/ROM macros with a separate array supply (often called VDDM or VCS) contain up-shifters on the wordline drivers, characterized on a 2-D grid of both supplies in the `.lib` (added).

</div>

### 3.5 Dynamic voltage scaling (DVS)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p32-1.jpeg" alt="For a task needing only part of peak throughput, clock or power gating saves energy linearly with duty cycle, while just-in-time DVS saves roughly with its cube." loading="lazy"><figcaption>For a task needing only part of peak throughput, clock or power gating saves energy linearly with duty cycle, while just-in-time DVS saves roughly with its cube. · EECS 627 lecture packet · page 32</figcaption></figure>

Two ways to run a task that needs only a fraction of peak throughput:

- **Clock/power gating (race to idle):** run at full VDD and f for t_on, then gate. Energy is linear in duty cycle.

    ```latex
    E = P_{Vdd}\, t_{on} = P_{Vdd}\, t_{task}\,(\text{duty cycle})
    ```

- **Just-in-time DVS:** lower f so the task finishes exactly at its deadline, and lower V with it (V ∝ f above threshold).

    ```latex
    E = P_{scaled}\, t_{task} = (f_{scaled} C_s V_{scaled}^2)\, t_{task} \propto f_{scaled}^3 \propto (\text{duty cycle})^3
    ```

- **Gain of DVS over gating:** ∝ (duty cycle)².

<div class="co co-guard"><p class="co-t">Common trap</p>

The cubic saving assumes V tracks f and leakage is negligible. Near and below threshold, V stops dropping much while t_task keeps growing, so leakage energy grows. That is the reason for a minimum-energy point (next section), and why race-to-idle can win in leaky technologies or at low voltage (added).

</div>

### 3.6 Minimum-energy point and near-threshold computing

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p33-1.jpeg" alt="Lowering VDD cuts active energy quadratically, but below threshold the exponential delay makes leakage energy explode, so total energy has a minimum at Vmin." loading="lazy"><figcaption>Lowering VDD cuts active energy quadratically, but below threshold the exponential delay makes leakage energy explode, so total energy has a minimum at Vmin. · EECS 627 lecture packet · page 33</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p33-2.jpeg" alt="At low voltage, delay sensitivity to VDD, Vth and temperature grows exponentially, as the 65 nm inverter-chain variability plot shows." loading="lazy"><figcaption>At low voltage, delay sensitivity to VDD, Vth and temperature grows exponentially, as the 65 nm inverter-chain variability plot shows. · EECS 627 lecture packet · page 33</figcaption></figure>

**Superthreshold region:**

- Active energy scales down quadratically with VDD.
- Leakage current is roughly constant (it rises slightly with VDD because of DIBL).
- Delay scales about linearly with 1/VDD, and leakage power falls about linearly, so **leakage energy per operation is about constant**.

**Subthreshold region:**

- Active energy still scales down quadratically.
- Delay scales up exponentially (on-current is exponential in VGS − Vth), so **leakage energy = I_leak·VDD·T_cycle scales up exponentially**.

**Minimum Energy Point (Vmin):** where leakage energy becomes comparable to active energy; the plot puts it near 0.2–0.3 V for that technology.

Subthreshold examples (slide 25): a 180 mV FFT processor (0.18 µm, 628k transistors) runs at 164 Hz at 180 mV and 6 MHz at 900 mV, with 0.6 µW at 350 mV; a 300 mV multiplier (0.35 µm) runs at 23.1 kHz and 21.4 nW. The speed given up near Vmin is enormous.

**Implications of low-voltage design (slide 26):**

- **Sensitivities increase exponentially** to supply voltage, threshold voltage and temperature. In the 65 nm inverter-chain plot, delay σ/µ climbs steeply below about 0.5 V, and Vth-induced variation is the largest share.
- **SRAM design gets harder**; alternative bitcells help.
- **Timing gets harder:** short (hold) and long paths, more clock skew, growing margins.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p33-3.jpeg" alt="Near-threshold computing backs off from Vmin: about 2× the minimum energy buys about 100× less delay than subthreshold, while staying about 10× below superthreshold energy." loading="lazy"><figcaption>Near-threshold computing backs off from Vmin: about 2× the minimum energy buys about 100× less delay than subthreshold, while staying about 10× below superthreshold energy. · EECS 627 lecture packet · page 33</figcaption></figure>

**Near-Threshold Computing (Zhai, Blaauw, ISLPED 2007).** Operate slightly above Vth, not at Vmin. Read off the curves:

- **Energy:** NTC is about **2× above** the minimum energy and about **10× below** superthreshold energy per operation.
- **Delay:** NTC is about **100× faster** than operation at Vmin and about **10× slower** than superthreshold.

Backing off from Vmin also eases variability, VDD/temperature sensitivity and SRAM design. The open problem is the performance loss, usually recovered with parallelism.

<div class="co co-core"><p class="co-t">Core idea</p>

Energy per operation has a minimum because leakage energy = I_leak·V·t_delay and t_delay explodes below Vth. NTV sits just above Vth, where most of the energy saving remains but the delay and variability penalties have not yet blown up.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

At low VDD, **local Vth variation dominates delay**, so library characterization needs statistical (LVF/sigma) timing and hold margins grow. In a ROM or register file a low-voltage read is a ratio fight: the selected cell's current against **n·Ioff of the unselected cells plus the keeper**. That sensing margin shrinks fastest exactly where NTV wants to operate, which makes it a high-sigma problem (added).

</div>

### 3.7 Level converters: DCVS and pass-gate

Level converters are needed wherever a VDDL domain drives a VDDH domain. The asynchronous (unclocked) converters are covered here; the LCFF in 3.4 is the clocked option. Each slide labels every transistor ON/OFF and numbers the order of events.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p34-1.jpeg" alt="In a DCVS converter the VDDL-driven NMOS must overpower the cross-coupled VDDH PMOS (IN-ON &gt; IP-ON) while the PMOS must beat NMOS leakage (IP-ON &gt; IN-OFF), and both margins collapse as VDDL drops." loading="lazy"><figcaption>In a DCVS converter the VDDL-driven NMOS must overpower the cross-coupled VDDH PMOS (IN-ON &gt; IP-ON) while the PMOS must beat NMOS leakage (IP-ON &gt; IN-OFF), and both margins collapse as VDDL drops. · EECS 627 lecture packet · page 34</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p34-2.jpeg" alt="The pass-gate converter reduces contention because the fighting PMOS M3 loses VGS as IN rises and M1&#x27;s VDS collapses once IN is high." loading="lazy"><figcaption>The pass-gate converter reduces contention because the fighting PMOS M3 loses VGS as IN rises and M1&#x27;s VDS collapses once IN is high. · EECS 627 lecture packet · page 34</figcaption></figure>

**Standard DCVS (Differential Cascode Voltage Switch) level converter, slide 29.**

- **Structure:** two NMOS pull-downs (M3, M6) driven by IN and its complement (from a VDDL inverter), two cross-coupled VDDH PMOS (M4, M5), and a VDDH output inverter.
- **Sequence for IN rising (0→VDDL):**
    1. M6 turns on (gate 0→L) while M3 turns off (gate L→0).
    2. M6 must pull its node down (H→↓) **while M5 is still fully on**. This is the **fight**.
    3. Once that node is low enough, M4 turns on.
    4. M4 pulls the other node to H, which shuts off M5, and the low node completes to 0.
    5. OUT goes 0→H.

**The two-sided constraint (the key interview point):**

- **IN-ON > IP-ON.** The NMOS, whose gate swings only to VDDL, must out-drive a PMOS whose |VGS| = VDDH. Otherwise the converter never flips: a **functional failure**. This pushes toward a large NMOS and a weak PMOS.
- **IP-ON > IN-OFF.** The PMOS must still hold the high node against the off NMOS's leakage. Otherwise the high node is not maintained. This forbids making the PMOS too weak.

**"Mingoo plot" (current ranges):**

| | VDDL = 0.8 V | VDDL = 0.3 V |
|---|---|---|
| IN-ON | 100 µA | 100 nA |
| IP-ON | 100 nA | 3 nA |
| IN-OFF | 100 pA | 100 pA |
| NMOS ION/IOFF range | 10⁶ | 10³ |
| Margin per constraint | 1000× each | 30× each |

At VDDL = 0.3 V the NMOS is subthreshold and its ION/IOFF collapses to about 10³. Only about 30× is left on each side, so IP-ON must sit inside a narrow window between IN-OFF and IN-ON, and variation can push it out either way. The slide's summary: **DCVS has a critical relationship between ION and IOFF, and the NMOS ION/IOFF ratio falls as VDDL falls.**

**Pass-gate (PG) level converter, slide 30.**

- **Structure:** IN (VDDL swing) drives M2, an NMOS pull-down on the internal node, and also passes through M1, an NMOS pass transistor with its gate at VDDL, to the gate of M3, the VDDH PMOS pull-up on the internal node. M4 is a VDDH PMOS feedback device, controlled by the internal node, that pulls M3's gate to full VDDH.
- **Sequence for IN rising:**
    1. M1 passes IN, so M3's gate rises 0 → L−Vth (M1 can only pass up to VDDL − Vth).
    2. M2 turns on (gate 0→L) and starts pulling the internal node down against the weakening M3.
    3. As the internal node falls (H→↓), M4 turns on.
    4. M4 pulls M3's gate the rest of the way, L−Vth → H, which shuts M3 off completely, and the node completes to 0.
    5. OUT goes 0→H.
- **Why it is more robust (reduced contention):**
    - **VGS of M3 shrinks as IN rises**, because its gate is being driven up, whereas a DCVS PMOS keeps full VDDH drive until the other side flips.
    - **VDS of M1 shrinks once IN is high**, so M4 pulling M3's gate above VDDL meets little opposition (M1 turns itself off).

<div class="co co-eq"><p class="co-t">Equation card</p>

DCVS works only if **IN-ON(min) > IP-ON(max)** and **IP-ON(min) > IN-OFF(max)**.
VDDL = 0.8 V: about 1000× margin each side. VDDL = 0.3 V: about 30× each side.
Mnemonic: "N must win the fight, P must beat the leak."

</div>

### 3.8 Improved and wide-range level converters

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p35-1.jpeg" alt="Splitting the keeper into series devices (STR1) or driving it from an inverter (STR2) weakens contention without the extra node-N load of a long-channel keeper." loading="lazy"><figcaption>Splitting the keeper into series devices (STR1) or driving it from an inverter (STR2) weakens contention without the extra node-N load of a long-channel keeper. · EECS 627 lecture packet · page 35</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p35-2.jpeg" alt="For VDDL = 0.3 V to VDDH = 2.5 V, zero-Vth thick-oxide devices shield the thin-oxide inputs, but plain DCVS yields only 64.72% in 100,000 Monte Carlo runs." loading="lazy"><figcaption>For VDDL = 0.3 V to VDDH = 2.5 V, zero-Vth thick-oxide devices shield the thin-oxide inputs, but plain DCVS yields only 64.72% in 100,000 Monte Carlo runs. · EECS 627 lecture packet · page 35</figcaption></figure>

**Improved level conversion circuits (slide 31).** The usual way to weaken a keeper or feedback PMOS is a long gate length, but that adds capacitance on node N and slows it. Instead:

- **STR1:** keeper M4 is split into two series devices, M4 and M5.
- **STR2:** an inverter feeds keeper M5.

Either way the keeper conducts less during the fight **without increasing the load on node N**.

**Wide-range conversion, VDDL = 0.3 V to VDDH = 2.5 V (slide 32):**

- A 2.5 V VDDH requires **thick-oxide** devices (HVT in the legend) for the cross-coupled PMOS.
- **Zero-Vth thick-oxide** NMOS cascodes **shield the thin-oxide (SVT) input NMOS** from the high VDS.
- 100,000 Monte Carlo samples: **yield 64.72%**, delay µ = 2.89 FO4, σ = 1.68 FO4.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p36-1.jpeg" alt="Interrupting the DCVS PMOS path weakens it, but the fight is still 0.3 V of NMOS VGS against 2.2 V of PMOS VSG, and yield only reaches 73.77%." loading="lazy"><figcaption>Interrupting the DCVS PMOS path weakens it, but the fight is still 0.3 V of NMOS VGS against 2.2 V of PMOS VSG, and yield only reaches 73.77%. · EECS 627 lecture packet · page 36</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p36-2.jpeg" alt="The split-control converter adds diodes so the weak NMOS pulls down a node behind off diodes and turns on the opposite PMOS, raising yield to 98.93%." loading="lazy"><figcaption>The split-control converter adds diodes so the weak NMOS pulls down a node behind off diodes and turns on the opposite PMOS, raising yield to 98.93%. · EECS 627 lecture packet · page 36</figcaption></figure>

**Interrupted DCVS (slide 33).** A series PMOS weakens the pull-up during the transition, but the fundamental mismatch remains: the NMOS has **VGS = 0.3 V** against a PMOS with **VSG = VDDH − 0.3 V = 2.2 V**. Yield 73.77%, delay µ = 2.66 FO4, σ = 1.51 FO4.

**Split-control Level Converter (SLC, Kim, ESSCIRC 2012), slide 34:**

- Diode-connected devices in the pull-up path set internal levels of VDDH, VDDH − VD and VDDH − 2VD.
- The diodes are **off**, so the 0.3 V NMOS pulls down a node without fighting a full-strength PMOS, and pulling it down **turns on the opposite PMOS** (super-Vth).
- 100,000 Monte Carlo samples: **yield 98.93%**, delay µ = 1.62 FO4, σ = 0.73 FO4: better mean and less than half the spread.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p36-3.jpeg" alt="In the SLC the output buffer runs super-threshold in one state and fully off in the other, but the scheme requires VDDH ≫ 2VD." loading="lazy"><figcaption>In the SLC the output buffer runs super-threshold in one state and fully off in the other, but the scheme requires VDDH ≫ 2VD. · EECS 627 lecture packet · page 36</figcaption></figure>

**SLC output stage (slide 35).** The buffer's control nodes sit near 2VD and 0, so the output buffer is **super-Vth** when on and **completely off** otherwise. The limitation: **VDDH ≫ 2VD**, so SLC suits wide-range conversion (0.3 → 2.5 V), not small steps such as 0.6 → 0.8 V.

**Summary (slide 36).** Leakage gets most of the attention, but **dynamic power still dominates** most applications and is the limiting factor (heat removal) in 3D integration. Leakage is covered in L09.

<div class="co co-guard"><p class="co-t">Common trap</p>

**Picking one "worst corner" for a level shifter.** The constraint is two-sided, so it needs two different corner checks, each with its own temperature. When the NMOS is subthreshold (VDDL = 0.3 V, |Vt| = 0.4 V), its current falls when cold, while a superthreshold PMOS gets stronger when cold (mobility). So the "is the NMOS strong enough?" check is **FS at −20 °C** (PMOS letter first), not "SS hot". Once both devices are superthreshold (VDDL = 0.6 V), temperature moves them together and no single temperature is clearly worst.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A level shifter is a **library cell** with exactly this two-sided sizing window. It is signed off with high-sigma Monte Carlo (yields like 64.72% or even 98.93% are unacceptable for a cell instantiated thousands of times), across a 2-D VDDL × VDDH grid, at **opposite** temperature corners for each constraint. A DCVS shifter's contention current also shows up as dynamic power and local IR drop on VDDH, and thick-oxide devices and diode stacks bring reliability (TDDB) rules with them (added).

</div>

### 3.x Check yourself

1. **The energy drawn from VDD to charge C to VDD is C·VDD². Where does it go, and does PMOS size matter? (Practice Exam 2, P1(A))** Half (½CV²) is dissipated in the PMOS and half is stored on C, later burned in the NMOS on discharge. ∫Ip·Vp dt is the same for any PMOS resistance, so no sizing of P1 minimizes the energy supplied by VDD.

2. **(Practice Exam 2, P1(C)) The load is split into two CL/2 capacitors, one charged through P1 and one through a further device N2. Can any sizing make VDD supply less energy than in the single-cap case?** No. VDD still delivers charge VDD·2(CL/2) = CL·VDD, so energy CL·VDD². Sizing only changes which transistor dissipates it.

3. **Why does a clock-gating cell use a latch rather than a plain AND gate?** The latch is transparent only while clk is low, so `en` is frozen during the high phase, and a late or glitchy enable cannot truncate or create a pulse on `g_clk`.

4. **A design is pipelined with 10% register overhead and VDD scaled to 0.66×. What is the new power?** P = 0.66²·1.1·Pref = 0.48·Pref.

5. **What is the minimum-energy point, and why does NTV back off from it?** It is the VDD where leakage energy per operation (I_leak·V·t_delay) becomes comparable to active energy; below it, exponential delay makes leakage energy explode. NTV costs about 2× the minimum energy but runs about 100× faster than at Vmin, with much less variability, and it is still about 10× more energy-efficient than superthreshold.

6. **State the two DCVS level-converter constraints and why they get harder at low VDDL.** IN-ON > IP-ON (the NMOS must win the fight) and IP-ON > IN-OFF (the PMOS must beat leakage). At low VDDL the NMOS goes subthreshold, so its ION/IOFF falls from about 10⁶ to about 10³, and the margin per side drops from about 1000× to about 30×.

7. **(Practice Exam 1, P2(A)) Regular DCVS level converter, |Vt| = 400 mV, VDDL = 0.3 V, VDDH = 0.8 V. Corners FF/FS/SF/SS (first letter PMOS) at −20 °C or 85 °C. Which corner checks that the NMOS is sized large enough relative to the PMOS?** **FS at −20 °C.** The NMOS (gate at 0.3 V < Vt) is subthreshold, so it is weakest when slow (S) and cold. The PMOS (|VGS| = 0.8 V) is superthreshold, so it is strongest when fast (F) and cold (higher mobility). Both worst cases coincide at −20 °C.

8. **(Practice Exam 1, P2(B)) Now VDDL = 0.6 V, VDDH = 0.8 V. Which corner checks that the PMOS is strong enough relative to the NMOS?** **SF at both 85 °C and −20 °C (and possibly 25 °C).** Weak PMOS (S) against strong NMOS (F). Both devices are now superthreshold, so temperature makes both stronger or both weaker together, and it is not obvious which temperature is worst, so all must be simulated.


## Lecture 4 — Power Supply

This lecture follows current from the voltage regulator on the board, through package and bumps, into the on-chip grid and the decoupling capacitance that sits next to the switching gates. It sets the design target (an impedance limit over all frequencies), splits supply noise into IR drop and L·di/dt drop, shows why decaps form a frequency hierarchy from board to die, and ends with the RLC resonance model that explains first, second and third droop. For a circuit designer at a GPU company this is the physics behind IR/EM signoff: every standard cell's delay is characterized at a voltage that the grid must actually deliver, and the power rails of every cell and memory macro are the wires most exposed to electromigration.

### 4.1 Goal and the impedance target

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p38-1.jpeg" alt="The supply network must look like a low impedance at every frequency of interest, and Z ≤ r·VDD²/P gives about 1 mΩ for a 100 W, 1 V chip with 10% ripple." loading="lazy"><figcaption>The supply network must look like a low impedance at every frequency of interest, and Z ≤ r·VDD²/P gives about 1 mΩ for a 100 W, 1 V chip with 10% ripple. · EECS 627 lecture packet · page 38</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p38-2.jpeg" alt="Electrically, the regulator feeds the chip through board, package and bump/bond R and L, with bulk, ceramic, package and on-chip capacitors along the way, each with its own parasitic R and L." loading="lazy"><figcaption>Electrically, the regulator feeds the chip through board, package and bump/bond R and L, with bulk, ceramic, package and on-chip capacitors along the way, each with its own parasitic R and L. · EECS 627 lecture packet · page 38</figcaption></figure>

**Goal:** supply a constant voltage, **temporally and spatially**, to every device on the chip. **Problem:** current must get from the voltage regulator to the chip without droop, and the supply system includes the package and board, not just the chip pads. Supply design is hard "despite having just a few transistors".

**The impedance target.** If the chip draws power P at VDD, the current is I = P/VDD. With an allowed ripple of r·VDD, the network impedance must satisfy I·Z ≤ r·VDD:

```latex
Z \le \frac{r\,V_{DD}}{I} = \frac{r\,V_{DD}^2}{P}
```

Example from the slide: 100 W, 1 V, r = 0.1 gives **Z ≤ 1 mΩ**. Trend: P is rising and VDD is falling while r stays flat, so the required impedance drops fast (it scales as VDD²/P).

**Physical and electrical model (slides 4–6).** Wire-bond and flip-chip (C4) versions are shown; BGA balls connect package to board. The electrical chain, left to right, is: voltage regulator → printed-circuit-board planes (bulk capacitor, ceramic capacitors) → package and pins (package capacitor) → solder bumps or wire bonds → on-chip capacitor and on-chip current demand. Every capacitor also has parasitic R and L, so **the design must consider both transient and frequency response**.

<div class="co co-eq"><p class="co-t">Equation card</p>

```latex
Z_{target} = \frac{r\,V_{DD}^2}{P}
```
100 W, 1 V, 10% ripple → 1 mΩ. The target must hold "at all frequencies of interest", from DC (regulator) up to the clock harmonics (on-chip decap).

</div>

### 4.2 Voltage drop: IR and L·di/dt

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p39-1.jpeg" alt="IR drop scales with current (15× from low-end to high-performance), but L·di/dt scales with both current and edge rate (225×)." loading="lazy"><figcaption>IR drop scales with current (15× from low-end to high-performance), but L·di/dt scales with both current and edge rate (225×). · EECS 627 lecture packet · page 39</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p39-2.jpeg" alt="IR and L·di/dt drops peak at different times and places, so they do not simply add, and fast mode changes (20 A to 100 A) excite the inductive drop." loading="lazy"><figcaption>IR and L·di/dt drops peak at different times and places, so they do not simply add, and fast mode changes (20 A to 100 A) excite the inductive drop. · EECS 627 lecture packet · page 39</figcaption></figure>

**IR drop:** ΔV_IR = I·R, maximum at peak current. Scaling of I_dc: P↑ and VDD↓, so I↑↑.

- Low-end: P = 15 W at VDD = 1.2 V (12.5 A). High-performance: P = 150 W (10×) at VDD = 0.8 V (0.66×) (187.5 A).
- The current ratio is 10/0.66 = **15×**, so ΔV_IR grows 15× at fixed R. (The slide's intermediate "ΔI = ΔP/ΔV = 20x" does not match its own numbers; 15× is the consistent figure.)

**L·di/dt drop:** ΔV_L = L·dI/dt, caused by a change in current. Scaling of V_ac: dI↑ and dt↓, so dI/dt↑↑.

- Low-end f = 200 MHz, high-performance f = 3 GHz (15×). With ΔI = 15× and dt 15× shorter, **ΔV_L grows 225×**.
- Meanwhile the noise budget r·VDD shrinks, which is why the inductive part dominates modern supply design.

**Timing of the drops (slide 9).** In the example the current steps from 20 A to 100 A over tens to hundreds of cycles. ΔV_IR follows the current level, but ΔV_L appears only at the edges of the step (a dip on the rising edge, a bump on the falling edge). Since they occur at different times, the total ΔV_drop is not simply their sum. Supply variation exists across **time (temporal)** and **location (spatial)**, and fast transitions between operating modes (clock gating, power gating, idle-to-turbo) are the main trigger.

**Static vs dynamic IR (added).** In signoff language, *static IR* is the DC drop computed with average currents through the resistive grid (the ΔV_IR above). *Dynamic IR* (or dynamic voltage drop) is the time-domain drop from switching currents through the grid R, package L and decap, which includes the L·di/dt and resonance terms of 4.10. Static IR checks the metal; dynamic IR checks decap placement and simultaneous switching.

### 4.3 What supply noise breaks: delay, noise, TDDB, EM

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p39-3.jpeg" alt="A sustained supply drop slows every gate, and AC supply noise acts like a noise pulse that can ring, overshoot and undershoot." loading="lazy"><figcaption>A sustained supply drop slows every gate, and AC supply noise acts like a noise pulse that can ring, overshoot and undershoot. · EECS 627 lecture packet · page 39</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p39-4.jpeg" alt="Inductive overshoot adds oxide stress (TDDB) and limits VDD, while high current densities drive electromigration that breaks the metal." loading="lazy"><figcaption>Inductive overshoot adds oxide stress (TDDB) and limits VDD, while high current densities drive electromigration that breaks the metal. · EECS 627 lecture packet · page 39</figcaption></figure>

**Sustained drop → performance loss.** The effective supply is ΔV = VDD − VSS, where VDD droops and VSS bounces up with a non-ideal network. Gate delay:

```latex
t_d \propto \frac{C V}{I} \propto \frac{1}{V_{gs}-V_t} \propto \frac{1}{V_{dd}-V_{ss}-V_t},\qquad \Delta V \uparrow\ \Rightarrow\ t_d \uparrow
```

**AC noise → functional/delay noise.** Supply noise acts like a standard noise pulse. The slide's driver/receiver picture shows the point: driver and receiver have *different* local VDD/VSS, so a quiet "0" from the driver looks like a glitch relative to the receiver's ground. Ringing gives both over- and undershoot.

**TDDB (time-dependent dielectric breakdown).** Overshoot from inductance adds oxide stress even though the spikes are short-lived, and that sets a **limit on VDD**.

**EM (electromigration).** High current densities displace metal atoms through momentum transfer (the "electron wind"); voids grow, the metal breaks, the chip fails.

**Electromigration in more depth (added, standard textbook material).**

- **Black's equation** gives median time to failure:

    ```latex
    MTTF = A\, J^{-n} \exp\!\left(\frac{E_a}{k T}\right)
    ```

    with n ≈ 1–2 and Ea the activation energy of the dominant diffusion path (interfaces in Cu). Lifetime falls steeply with both current density J and temperature, so EM limits are always quoted at a temperature.
- **Why power wires are worst** (Exam 2, P5(A)): they carry high current density, it is **unidirectional** (DC), so there is no back-flow "healing" as in bidirectional signal nets, and they see changes in width/thickness (vias, jogs, bumps) where flux divergence nucleates voids.
- **Signoff limits:** average current (Iavg) for power rails and vias, RMS current (Joule self-heating) and peak current for signal nets. Short wires below the **Blech length** are immune because the back-stress gradient balances the electron wind (J·L product below a critical value).
- **Where it bites in a cell or macro:** M1/M2 rails, via stacks from the rails into the grid, and the bitline/wordline drivers of memory macros, which see high average current when activity is high.

<div class="co co-core"><p class="co-t">Core idea</p>

Supply noise has two cost centres: the slow, sustained part (IR) costs frequency, and the fast part (L·di/dt, resonance) costs noise margin and oxide reliability. EM is the long-term cost of the current itself and is worst on DC, high-J power wires.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Cell `.lib` timing is characterized at a fixed VDD, and IR drop is signed off as a derate against it, so every millivolt of droop is timing margin someone else had to pay for. EM rules for rail width, via count and pin access are written into the cell layout itself: a cell with strong drive needs enough rail and via capacity for its average and RMS current at the signoff temperature. In a ROM or SRAM, simultaneous wordline and bitline switching across many columns is a local di/dt event, which is why macros carry their own decap and dense rails.

</div>

### 4.4 Board and the decap frequency hierarchy

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p40-1.jpeg" alt="A real capacitor has series L, so its impedance falls only until the LC resonance and rises again above it, which makes a capacitor useless at high frequency." loading="lazy"><figcaption>A real capacitor has series L, so its impedance falls only until the LC resonance and rises again above it, which makes a capacitor useless at high frequency. · EECS 627 lecture packet · page 40</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p40-2.jpeg" alt="Large board caps with ~100 pH, package caps with ~10 pH and on-chip decap behind ~1 pH C4 inductance each cover their own band, and together they flatten the impedance." loading="lazy"><figcaption>Large board caps with ~100 pH, package caps with ~10 pH and on-chip decap behind ~1 pH C4 inductance each cover their own band, and together they flatten the impedance. · EECS 627 lecture packet · page 40</figcaption></figure>

**Board traces (slide 13):** reduce wire length (lower L) and increase width/thickness (lower R). **Board decaps (slide 14):** a trade-off between C and L (R is typically small); larger-value capacitors come with larger parasitic inductance.

**One capacitor (slide 15).** A real capacitor is a series RLC:

```latex
Z = R + j\omega L + \frac{1}{j\omega C},\qquad \omega_r = \sqrt{\frac{1}{LC}}
```

- Below ωr the 1/(jωC) term dominates: a capacitor **does not suppress low-frequency current**.
- Above ωr the jωL term dominates: **inductance makes the decap useless at high frequencies**.
- It works only in a band (the "suppressed frequency" notch), and ωr falls as C grows.

**The hierarchy (slide 16).** Each stage is a capacitor behind its own series inductance, seen from the chip's current source:

| Stage (from the slide) | Capacitance | Series L in front of it |
|---|---|---|
| Large decap (board) | 1000's µF | large board inductance, ~100 pH |
| Medium decap (package) | 100's µF | medium package inductance, ~10 pH |
| Small decap (near the C4s) | 1–10's µF | small C4 bump inductance, ~1 pH |
| On-chip decap | 10's nF | none (sits at the load) |

The regulator handles only low-frequency content (< 1 MHz); high-frequency content (> 1 GHz) must be served by on-chip decap because the C4 inductance blocks it. The sum of the dashed curves ("large decap + board L", "medium decap + package L", "small decap + C4 L", "on-chip decap") gives the total |Z| response, with a small bump at each hand-off between stages (the frequency axis spans roughly 10 MHz to beyond 1 GHz). **Need both small and large decaps to cover the entire frequency range** (R omitted for simplicity).

**Board summary (slide 17):** keep resistance small; decaps filter high-frequency current; small caps with low L go **near the chip** (if high-frequency current must travel far from the chip, ripples and droops occur), and large caps with higher L go further away.

<div class="co co-guard"><p class="co-t">Common trap</p>

"Just add more capacitance." A capacitor helps only at frequencies below its own self-resonance, and only if the inductance between it and the load is small. A huge cap far from the die does nothing for a 1 GHz current step; only on-die decap (and the package L in front of the next level) set the first droop.

</div>

### 4.5 Package and thermal

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p41-1.jpeg" alt="Wire bonds are cheap but carry ~5 nH and ~200 pads, while flip-chip area arrays bring ~0.1 nH per bump and ~1000 pads spread over the die." loading="lazy"><figcaption>Wire bonds are cheap but carry ~5 nH and ~200 pads, while flip-chip area arrays bring ~0.1 nH per bump and ~1000 pads spread over the die. · EECS 627 lecture packet · page 41</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p41-2.jpeg" alt="Package IR drop is non-uniform across the C4 bumps and hard to predict, as the bump-current map shows." loading="lazy"><figcaption>Package IR drop is non-uniform across the C4 bumps and hard to predict, as the bump-current map shows. · EECS 627 lecture packet · page 41</figcaption></figure>

**Wire bond vs flip chip (slide 20):**

| | Wire bond | Flip chip (C4) |
|---|---|---|
| Inductance | high, typically **5 nH** | low, **~0.1 nH** (shorter distance per bump) |
| Pad count | limited, **~200** (periphery) | high, **~1000** (area array) |
| Power distribution | from the edge | power bumps over the entire chip → less stress on the on-chip grid |
| Cost | cheap; allows thermal expansion | high cost; custom package design |

Package design is increasingly complicated, with many power/ground layers, and the package causes significant supply variation. Its IR drop is **non-uniform across the C4s** and difficult to predict and analyze (slide 22), so per-bump current (and per-bump EM) must be analyzed together with the die.

**Heat (slides 24–26).** A 60 W light bulb has 120 cm² of surface; an Itanium 2 die dissipates 130 W over 4 cm². The package spreads heat; heat sinks and fans add area and airflow; liquid cooling is used in extreme cases. Thermal resistance is Ohm's law for heat:

```latex
\Delta T = \theta_{ja} P,\qquad \theta_{ja} = \theta_{jp} + \theta_{pa}
```

Worked example: heat sink 1.0 °C/W to package, chip-to-package 0.5 °C/W, ambient up to 55 °C, chip limit 100 °C → P_max = (100 − 55)/(1 + 0.5) = **30 W**. High-end servers reach about 0.2 °C/W (expensive). Temperature also feeds back into EM lifetime and leakage.

### 4.6 On-chip power grid

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p42-1.jpeg" alt="A full grid has lots of metal, lower resistance and current density, lines up with C4 bumps and is highly redundant, at the cost of metal layers and routing resources." loading="lazy"><figcaption>A full grid has lots of metal, lower resistance and current density, lines up with C4 bumps and is highly redundant, at the cost of metal layers and routing resources. · EECS 627 lecture packet · page 42</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p42-2.jpeg" alt="Power enters through C4 balls into fully dense top metal layers, then strapped stripes and via stacks carry it down to the M2 standard-cell rails." loading="lazy"><figcaption>Power enters through C4 balls into fully dense top metal layers, then strapped stripes and via stacks carry it down to the M2 standard-cell rails. · EECS 627 lecture packet · page 42</figcaption></figure>

**Topologies:**

- **Tree (slide 28):** local grids fed by branches. Simple, efficient metal use. But a single wire failure cuts a region, spatially close locations can see large voltage differences, and it suits only very low-end designs.
- **Grid (slide 29):** used in high-end processors. Lots of metal, lower resistance, lines up with C4, **lower J (current density) and therefore lower electromigration**, lower spatial variation, highly redundant. Costs more metal layers and routing resources.
- **Plane (slide 32):** reserves two whole metal layers as power planes. Good for reducing inductive coupling, but expensive and uncommon since C4.
- **Backside power delivery (slide 33):** Intel PowerVia (20A) moves power to the wafer backside, freeing front-side signal routing and shortening the supply path.

**Grid power delivery (slide 30).** C4 balls connect to the package; the top two metal layers (e.g. M10–M11) are **fully dense** alternating P/G; stripes on M9 down to M3 carry current down through via stacks; M2 holds the **standard-cell rails**. The resulting VDD profile (slide 31) is a map with local craters under high-current blocks and between bumps.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

The standard-cell rail is the last, thinnest and most resistive link of this chain, and the via stacks that connect it to the stripes are typical EM and IR hotspots. Cell height, rail width and pin placement are chosen together with the grid pitch. Memory macros usually block some grid layers over the array and must bring their own rails and straps, which is where IR/EM signoff of a macro concentrates.

</div>

### 4.7 Implicit (intrinsic) decoupling capacitance

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p43-1.jpeg" alt="Every idle gate places its device and wire capacitances between VDD and GND, and averaged over both states Ceff ≈ ½(Cgs + Cdb + Cw) + Cgd." loading="lazy"><figcaption>Every idle gate places its device and wire capacitances between VDD and GND, and averaged over both states Ceff ≈ ½(Cgs + Cdb + Cw) + Cgd. · EECS 627 lecture packet · page 43</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p43-2.jpeg" alt="Back of the envelope: implicit decap is about half of the non-switching capacitance, which with s ≈ 0.1 is much larger than the switching capacitance." loading="lazy"><figcaption>Back of the envelope: implicit decap is about half of the non-switching capacitance, which with s ≈ 0.1 is much larger than the switching capacitance. · EECS 627 lecture packet · page 43</figcaption></figure>

**Implicit decap** is the capacitance already present between VDD and GND through non-switching circuits: the n-well junction (slide 35), plus device and wire capacitances of idle gates. For an inverter with output 0 (input 1), the PMOS capacitances and the VDD-side wire cap connect the rails:

```latex
C_{eff,0} \cong (C_{gd,p}+C_{gs,p}+C_{gd,n}+C_{db,n}) + C_{w,VDD}
```

```latex
C_{eff,1} \cong (C_{gd,n}+C_{gs,n}+C_{gd,p}+C_{db,p}) + C_{w,gnd}
```

```latex
C_{eff} \cong \tfrac{1}{2}(C_{gs,p}+C_{gs,n}+C_{db,p}+C_{db,n}) + \tfrac{1}{2}(C_{w,gnd}+C_{w,VDD}) + C_{gd,n}+C_{gd,p}
```

It depends on the circuit state, current is injected and extracted at different locations, and it includes both device and interconnect parasitics.

**Back of the envelope (slide 37).** With switching factor s:

```latex
P = f C_{switch} V_{dd}^2,\quad C_{switch} = s\,C_{total} = \frac{P}{f V_{dd}^2},\quad C_{no\text{-}switch} = (1-s)\,C_{total} = \frac{1-s}{s}\frac{P}{f V_{dd}^2}
```

```latex
C_{decap} \cong \frac{C_{no\text{-}switch}}{2}
```

About half of the non-switching capacitance sits between VDD and GND. Since s is usually low (~0.1), **Cdecap ≫ Cswitch**: idle logic is a large decap for free.

<div class="co co-guard"><p class="co-t">Common trap</p>

Exam 2, P5(B) (P = 1.2 W, 1.2 V, 1 GHz, s = 0.15) gives C_total = 1.2/(1.2²·10⁹·0.15) = 5.56 nF and the official answer C_decap = 0.85·C_total = **4.72 nF**. That uses all of the non-switching capacitance. The slide's rule (½ of C_no-switch) would give about **2.36 nF**. Know both and state which one you use.

</div>

### 4.8 Explicit decoupling capacitors

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p44-1.jpeg" alt="A single thin-oxide MOS decap can short and leaks, while two stacked caps short only on a double failure and see half the voltage, at the cost of less total capacitance." loading="lazy"><figcaption>A single thin-oxide MOS decap can short and leaks, while two stacked caps short only on a double failure and see half the voltage, at the cost of less total capacitance. · EECS 627 lecture packet · page 44</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p44-2.jpeg" alt="Gating the decap through a self-biased series PMOS (or a fuse) turns it off if its oxide fails, and the self-gated version needs Isub,p &gt; Igate,n to start up." loading="lazy"><figcaption>Gating the decap through a self-biased series PMOS (or a fuse) turns it off if its oxide fails, and the self-gated version needs Isub,p &gt; Igate,n to start up. · EECS 627 lecture packet · page 44</figcaption></figure>

**Plain MOS decap (slide 38, left):** an NMOS gate tied to VDD, source/drain to GND. Thin oxide gives high C per area, but:

- **Reliability:** the thin oxide can short, which is a **yield** problem (one bad decap shorts VDD to GND);
- **High gate leakage** through the thin oxide.

**Stacked decap (slide 38, right):** two MOS caps in series.

- Shorts only on a **double failure**;
- each gate sees **half the voltage**, so it is less sensitive to gate failure (and leaks less);
- but **less total capacitance** (series combination). Two equal caps in series give half the capacitance of one; for the same total area, each half-size, the stack gives a quarter (added).

**Protected decaps (slide 39):**

- **Series transistor or fuse:** turns off the cap in case of oxide failure and reduces gate leakage, but the cap is unusable if the series transistor fails.
- **Self-gated variant:** a PMOS in series, whose gate is driven by an inverter from the cap node. Normally the node is 1, the inverter outputs 0, and the PMOS is on. If the oxide fails, the node is pulled to 0, the inverter outputs 1 and the PMOS turns off, disconnecting the failed cap. To start up (and to stay in the good state) the PMOS subthreshold leakage must charge the node against the cap's gate leakage: **Isub,p > Igate,n**.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p44-3.jpeg" alt="An active decap switches two C/2 capacitors from parallel to series during a droop, delivering ΔQ = C(Vdd + ΔV)/2 instead of a passive cap&#x27;s ΔV·C." loading="lazy"><figcaption>An active decap switches two C/2 capacitors from parallel to series during a droop, delivering ΔQ = C(Vdd + ΔV)/2 instead of a passive cap&#x27;s ΔV·C. · EECS 627 lecture packet · page 44</figcaption></figure>

**Active decoupling capacitor (slides 40–42).** Two capacitors of C/2 are switched by non-overlapping `charge` and `discharge` signals.

- **Charge phase:** the two C/2 caps sit in **parallel** between VDD and GND, holding Q = Vdd·C.
- **Discharge phase (when a droop is detected):** they are reconnected in **series** across the rails, which doubles the stacked voltage and pushes charge into the drooping supply. With the rail at Vdd − ΔV, the series stack retains Q = (C/2)·((Vdd − ΔV)/2)·2 = C(Vdd − ΔV)/2.

```latex
\Delta Q = V_{dd} C - \frac{V_{dd}-\Delta V}{2}C = \frac{V_{dd}C}{2} + \frac{\Delta V\, C}{2} = \frac{C\,(V_{dd}+\Delta V)}{2}
```

A passive cap of the same size gives only **ΔQ = ΔV·C**. Since ΔV ≪ Vdd, the active scheme delivers about Vdd/(2ΔV) times more charge (for Vdd = 1 V and a 50 mV droop, about 10×, added). The cost is switches, a droop detector and non-overlapping control.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Decap cells and filler-decap cells are part of every standard-cell library, and their layout embodies exactly these choices: thin vs thick oxide, gate-leakage budget, and reliability against oxide shorts. In memory macros, the bitline precharge and wordline drivers create sharp local current steps, so decap is placed inside or around the macro to set the first droop locally.

</div>

### 4.9 Other power-delivery ideas

**Stacked / on-chip DC-DC converters (slide 44, Karnik, ISLPED'04).** The Pentium 4 (90 nm) PDN uses an off-chip buck converter: high-voltage transistors, a high-quality inductor and large capacitance. An on-chip converter (monolithic, or on a 3D-stacked die with through vias) gives the same load regulation with smaller capacitance, but on-chip inductance is small, limited by materials. Delivering power at a higher voltage and converting near the load reduces current, and therefore IR and EM, in the package (added).

**High-tension (charge-recycling) power delivery (slide 45, Rajapandian, ICCD 2003).** Stack logic between 0–VDD and VDD–2·VDD so that the same current is used twice; a push/pull regulator compensates the top/bottom current mismatch and keeps the intermediate rail at Vint = VDD. Efficiency falls as the domain mismatch grows (plot on the slide).

### 4.10 Power-grid model, resonance and how to fix it

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p45-1.jpeg" alt="A lumped L–R feeding on-chip C gives an IR step plus a damped ring at ωr = 1/√(LC), with the peak drop a quarter period after the current step." loading="lazy"><figcaption>A lumped L–R feeding on-chip C gives an IR step plus a damped ring at ωr = 1/√(LC), with the peak drop a quarter period after the current step. · EECS 627 lecture packet · page 45</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p45-2.jpeg" alt="IR drop needs more metal, L·di/dt needs decap (which helps only as √(1/C)) or a slow ramp, and resonance needs lower Q." loading="lazy"><figcaption>IR drop needs more metal, L·di/dt needs decap (which helps only as √(1/C)) or a slow ramp, and resonance needs lower Q. · EECS 627 lecture packet · page 45</figcaption></figure>

**The model.** The package/board is lumped into series L and R; the chip is C (decap) plus a current source that steps by ΔI. Before the step the decap holds VDD. When Ichip steps up, the inductor current I_L cannot follow instantly, so the decap supplies the charge and Vchip falls. I_L overshoots Ichip, recharges C, and the system rings.

```latex
\Delta V(t) = IR + \Delta I \sqrt{\frac{L}{C}}\; e^{-\frac{R t}{2L}} \sin(\omega_r t - \theta)
```

```latex
\omega_r = \sqrt{\frac{1}{LC}},\qquad Q = \frac{1}{R}\sqrt{\frac{L}{C}}
```

- **ΔV_IR** is the steady-state step (IR).
- **ΔV_L** is the extra transient drop, with peak ≈ ΔI·√(L/C), reached at **ωr·t = π/2** (one quarter of the resonance period). √(L/C) is the characteristic impedance of the LC tank (added).
- **Damping** is set by R/2L; after the first droop the ringing decays as e^(−Rt/2L).

**Optimization (slide 48):**

- **IR drop:** ΔV_IR ∝ I, R → solved with more metal.
- **L·di/dt drop:** ΔV_L ∝ √(L/C)·ΔI → solved with more decap, but only as √(1/C) (4× the decap halves the droop); or solved with a **slow current ramp compared to the resonance period**, t_ramp ≫ 2L/R. The plot contrasts a 50–100-cycle ramp from 10% to 100% current with a 5–10-cycle one.
- **Resonance:** solved with lower Q = (1/R)·√(L/C), i.e. more damping R/2L. Ringing is a problem when e^(−Rt/2L) decays slowly.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p46-1.jpeg" alt="Every fix trades something: more metal lowers IR but raises Q, less L raises ωr and lowers Q, more C helps only as √C at an area cost, and slow turn-on lowers ΔI." loading="lazy"><figcaption>Every fix trades something: more metal lowers IR but raises Q, less L raises ωr and lowers Q, more C helps only as √C at an area cost, and slow turn-on lowers ΔI. · EECS 627 lecture packet · page 46</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p46-2.jpeg" alt="The Pentium 4 supply impedance peaks near 100 MHz from package L, and a current step produces first, second and third droops from on-chip, package and board capacitance." loading="lazy"><figcaption>The Pentium 4 supply impedance peaks near 100 MHz from package L, and a current step produces first, second and third droops from on-chip, package and board capacitance. · EECS 627 lecture packet · page 46</figcaption></figure>

**How to fix (slide 49):**

| Knob | How | Effect |
|---|---|---|
| Reduce R | more metal; tree → grid → flip-chip (C4) | ΔV_IR ↓, but less damping: Q ↑ (worse resonance) |
| Reduce L | thin package, short bond wires, flip-chip, more pads | ΔV_L ↓, ωr ↑, Q ↓ |
| Increase C | decoupling capacitance (benefit ∝ √C) | ΔV_IR ↓ (as shown on the slide), ΔV_L ↓, Q ↓, area ↑ |
| Decrease I (step) | turn modules on slowly, larger reset latency | ΔI ↓, ΔV_L ↓ |

**Pentium 4 example (slide 50).** The impedance profile sits near a ~1 mΩ target from 0.01 MHz up, with small bumps from the regulator, motherboard and socket, and a **~5 mΩ spike near 100 MHz from the package L** resonating with on-die decap. The step response to a sudden current change shows:

- **1st droop** (fastest, deepest, ns scale): on-chip decap against package L;
- **2nd droop:** package capacitance;
- **3rd droop** (slowest, µs scale): board capacitance.

Each droop is one capacitor stage of 4.4 running out of charge before the next, slower stage behind its larger inductance can respond (added).

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p47-1.jpeg" alt="Measured on the package power plane of a 400 MHz design, switching from NOP to a high-power instruction produces a 160 mV maximum undershoot." loading="lazy"><figcaption>Measured on the package power plane of a 400 MHz design, switching from NOP to a high-power instruction produces a 160 mV maximum undershoot. · EECS 627 lecture packet · page 47</figcaption></figure>

**Measured transients (slides 51–52).** The FFT of a 200 MHz design shows the spectrum of supply current: a large peak at the clock frequency and smaller harmonics, which is what the impedance profile must suppress. Measured on the package power plane of a 400 MHz chip (between about 1.8 V and 2 V), switching from NOP to a high-power instruction gives a **maximum undershoot of 160 mV**, followed by ringing.

<div class="co co-eq"><p class="co-t">Equation card</p>

```latex
\Delta V_{max} \approx IR + \Delta I \sqrt{\frac{L}{C}}\, e^{-\frac{R\,t_{pk}}{2L}},\quad t_{pk} = \frac{T_r}{4} = \frac{1}{4 f_r},\quad f_r = \frac{1}{2\pi\sqrt{LC}}
```
Mind 2π: ωr = 1/√(LC) is in rad/s; f_r = ωr/2π is in Hz. Peak at a quarter period.

</div>

<div class="co co-core"><p class="co-t">Core idea</p>

The die sees the package through a resonant tank. Below resonance the regulator and board handle current; above it the on-die decap does; at resonance (tens to a hundred MHz) neither does, the impedance peaks, and a current step whose rise time is shorter than about a quarter resonance period produces the first droop, of size about ΔI·√(L/C).

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

First droop is what a sudden activity change (clock ungating a large GPU block) does to every cell. Libraries are characterized at signoff voltages that already include a droop budget, and designs either add decap, stage the turn-on (slow ramp), or use adaptive clocking to survive it. When asked "how would you size decap for a block?", start from ΔV ≈ ΔI·√(L/C) and the impedance target, then check the resonance Q.

</div>

### 4.x Check yourself

1. **Derive the impedance target and evaluate it for 100 W, 1 V, 10% ripple.** I = P/VDD and ΔV = I·Z ≤ r·VDD, so Z ≤ r·VDD²/P = 0.1·1/100 = 1 mΩ.

2. **Going from 15 W at 1.2 V and 200 MHz to 150 W at 0.8 V and 3 GHz, how do IR and L·di/dt drop scale?** Current grows 10/0.66 = 15×, so IR drop grows 15× at fixed R. dI/dt grows 15× (current) × 15× (frequency) = 225×, so L·di/dt drop grows 225×.

3. **(Exam 2, P5(A)) Why are power-grid wires more susceptible to electromigration than signal nets?** High current density; unidirectional (DC) current, so no recovery as in bidirectional signal nets; and changes in wire width/thickness (vias, transitions) where voids form.

4. **(Exam 2, P5(B)) Implicit decap of a 1.2 W chip, 130 nm, s = 15% (clock = 1), VDD = 1.2 V, f = 1 GHz.** C_total·1.2²·10⁹·0.15 = 1.2 → C_total = 5.56 nF. Official answer: C_decap = 0.85·C_total = 4.72 nF. (With the lecture's "half of non-switching" rule, 2.36 nF.)

5. **(Exam 2, P5(C)) C2 = 2 nF (core decap), C1 = ½C2 = 1 nF (extra on-chip cap), L1 = L2 = 1 nH, R1 = R2 = 100 mΩ, I = 0. Initially VX = 1 V (C1 on the 1 V supply) and VY = 0.5 V (C2 on the 0.5 V supply). At t1, S2 opens and S1 closes. Find VX, VY just after t1 and at t = ∞.** Charge sharing: C1·1 V + C2·0.5 V = C2·1 V = 1.5C2·V_new, so VX = VY ≈ 0.67 V just after t1 (the inductor current cannot change instantly, so it does not help at first). At t = ∞ all currents and drops are zero, so VX = VY = 1 V. Between them, L1 recharges C1 + C2 with an underdamped ring (Q = (1/0.1)·√(1 nH/3 nF) ≈ 5.8), so expect overshoot above 1 V before settling (added).

6. **(Exam 2, P5(D)) Resonant frequency after t1?** L = 1 nH, C = C1 + C2 = 3 nF: 1/√(LC) = 5.77·10⁸ rad/s, i.e. **f ≈ 92 MHz** (the official solution writes "Wr = 92 MHz"; numerically that is ωr/2π).

7. **(Exam 2, P5(E)) S1 closed long enough that both caps are at 1 V; the core current steps 0 → 500 mA. Resonant frequency and worst-case undershoot at VY?** Resonance is unchanged, ~92 MHz. IR drop = 0.5 A·100 mΩ = 50 mV. t_peak = ¼·T_r ≈ 2.72 ns (official: 2.75 ns). L·di/dt term = I·√(L/C)·e^(−R·t_peak/2L) = 0.5·√(1 nH/3 nF)·e^(−0.1·2.72 ns/2 nH) = 0.5·0.577·e^(−0.136) = 0.289·0.873 ≈ **0.25 V**. The official solution states **275 mV**, giving 50 + 275 = 325 mV and VY_min = 675 mV; recomputing with the same formula gives ~252 mV, so a total of ~300 mV and **VY_min ≈ 0.70 V**. Treat the 275 mV as an arithmetic slip; the method (IR + damped ΔI·√(L/C) at a quarter period) is the point.

8. **Why does adding more decap help L·di/dt droop less than you might hope, and what else can you do?** Peak droop ∝ √(L/C)·ΔI, so 4× the decap only halves the droop, at area (and leakage) cost. Alternatives: lower L (flip-chip, more bumps), ramp current slowly (t_ramp ≫ 2L/R, e.g. 50–100 cycles), or add damping (lower Q).


## Lecture 5 — Silicon on Insulator (SOI)

Silicon-on-insulator puts the transistor in a thin silicon film sitting on a buried oxide (BOX), so the source/drain junctions no longer sit on a big substrate. That buys lower junction capacitance, no junction leakage to substrate, no latch-up and radiation hardness, but in the partially depleted (PD) flavor it creates a **floating body** whose voltage depends on switching history. This lecture walks through the device, how SOI wafers are made, the body-charging mechanisms, the first/second-switching (history) effect, the parasitic bipolar, fully depleted SOI/UTBB, and body contacts. For a circuit designer the transferable lessons are about **history-dependent delay** (characterization), **dynamic-node robustness** (bipolar discharge of precharged nodes) and **back-bias** as a tuning knob.

### 5.1 The SOI device and its features

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p49-1.jpeg" alt="A thin Si film (PD ~150 nm, FD &lt;50 nm) sits on a ~400 nm buried oxide over a ~700 um handle wafer." loading="lazy"><figcaption>A thin Si film (PD ~150 nm, FD &lt;50 nm) sits on a ~400 nm buried oxide over a ~700 um handle wafer. · EECS 627 lecture packet · page 49</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p49-2.jpeg" alt="SOI removes S/D junction cap and junction leakage, is rad-hard and latch-up free, but PD-SOI has a floating body." loading="lazy"><figcaption>SOI removes S/D junction cap and junction leakage, is rad-hard and latch-up free, but PD-SOI has a floating body. · EECS 627 lecture packet · page 49</figcaption></figure>

The device is a normal n+/p/n+ MOSFET, but the channel region sits on the **BOX (buried SiO2)**, and laterally it is bounded by oxide (STI). Numbers on the slide:

- **PD (partially depleted)** film ~**150 nm**: the depletion region under the gate does not reach the BOX, so a neutral, electrically floating p-region (the **body**) remains.
- **FD (fully depleted)** film **< 50 nm**: the whole film depletes when the channel forms, so there is effectively no neutral body.
- BOX ~**400 nm** (can be thinner); substrate ~**700 um**.

Main features (slide 4):

- **Smaller S/D capacitance and no S/D junction leakage** → lower power and faster. The S/D diffusions butt against the BOX, so only the sidewall to the body remains; the large area junction to substrate is gone.
- **Radiation hardened**: an ion strike can only collect charge from the thin film, not from deep in the substrate.
- **No latch-up**: there is no p-n-p-n path through a common substrate; every device is oxide-isolated.
- **PD → floating body**: hysteresis (history effect), parasitic bipolar device, leaky.
- **FD → no body**: needs tight process control of the Si film thickness; electrically it looks like a bulk device.

<div class="co co-core"><p class="co-t">Core idea</p>

SOI trades the substrate junction (capacitance, leakage, latch-up, soft errors) for a floating body (history-dependent Vth, parasitic bipolar). PD-SOI design is mostly about managing the body.

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

"SOI has no body effect" is wrong. In PD-SOI the body is there but floating; its voltage moves with coupling and leakage, so Vth moves. In FD-SOI the BOX/substrate acts as a back gate, so back bias still shifts Vth.

</div>

### 5.2 Wafer manufacturing

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p50-1.jpeg" alt="Smart Cut splits a hydrogen-implanted wafer at the implant plane so the donor wafer can be reused, which made SOI cheap enough for mainstream use." loading="lazy"><figcaption>Smart Cut splits a hydrogen-implanted wafer at the implant plane so the donor wafer can be reused, which made SOI cheap enough for mainstream use. · EECS 627 lecture packet · page 50</figcaption></figure>

The lecture shows three methods:

- **Bonding** (slide 7): oxidize two Si wafers, bond them oxide-to-oxide, grind the top wafer down (CMP), anneal and polish. **Expensive: two wafers per SOI wafer.**
- **SIMOX** (Separation by IMplantation of OXygen, slide 8): high-energy O2 implant into a single wafer, then anneal and CMP to form the BOX. Advantage: single wafer. Problem: **stress from SiO2 expansion and implant damage** in the active film.
- **Smart Cut** (slide 9): oxidize wafer A, **implant hydrogen (H+)** to a precise depth, flip and bond to a new handle wafer B, then cleave along the hydrogen-weakened plane ("smart cut"), anneal and polish. The remainder of wafer A is **reused** (A becomes the next B). **Most preferred method.**

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Mostly background, but it is a favorite exam/interview history question: SOI stayed niche (space, rad-hard) because bonded wafers cost two wafers each; Smart Cut's wafer reuse is what made terrestrial SOI economical.

</div>

### 5.3 Body-charging mechanisms

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p50-2.jpeg" alt="Capacitive coupling through Cgb, Csb and Cdb changes the floating body voltage instantly on every transition." loading="lazy"><figcaption>Capacitive coupling through Cgb, Csb and Cdb changes the floating body voltage instantly on every transition. · EECS 627 lecture packet · page 50</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p50-3.jpeg" alt="DC currents (diode, leakage, tunneling, impact ionization) set the body voltage slowly, from ns to ms time constants." loading="lazy"><figcaption>DC currents (diode, leakage, tunneling, impact ionization) set the body voltage slowly, from ns to ms time constants. · EECS 627 lecture packet · page 50</figcaption></figure>

Two classes of mechanisms set the floating body voltage **Vb**:

**AC (capacitive) coupling** — instantaneous. The body is a node with capacitances to gate (**Cgb**), source (**Csb**), drain (**Cdb**) and, through the BOX, substrate (**Cbulk**). A step ΔV on any terminal moves the body by the capacitive divider (added, standard form):

```latex
\Delta V_b = \Delta V_x \,\frac{C_{xb}}{C_{gb}+C_{sb}+C_{db}+C_{bulk}}
```

Slide caveats: **Cgb exists only when the channel is not inverted** (once inverted, the channel shields the body from the gate), and **Csb is voltage dependent** (it is a junction capacitance).

**DC (charge) mechanisms** — slow, they set the steady state. With the slide's time scales:

- **S/B forward-bias diode current If** — **ns** (fast; this is what clamps the body from rising much above ~0.6–0.7 V)
- **D/B reverse-bias leakage Ir** — **us**
- **Gate tunneling current** — **us (slow)**
- **Impact ionization current Iii** — **ms** (as given on the slide)
- **Thermal generation/recombination** — slow

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p51-1.jpeg" alt="Impact ionization near the drain injects holes into an NMOS body during transitions, worst at Vgs ~ Vdd/2 and Vds = Vdd." loading="lazy"><figcaption>Impact ionization near the drain injects holes into an NMOS body during transitions, worst at Vgs ~ Vdd/2 and Vds = Vdd. · EECS 627 lecture packet · page 51</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p51-2.jpeg" alt="At DC the body settles where charge in (DB leakage, impact ionization) balances charge out (BS forward diode)." loading="lazy"><figcaption>At DC the body settles where charge in (DB leakage, impact ionization) balances charge out (BS forward diode). · EECS 627 lecture packet · page 51</figcaption></figure>

**Impact ionization**: hot electrons near the drain create electron-hole pairs; in an NMOS the holes are swept into the p-body and **raise the body potential**, and the charge **accumulates** over many transitions. Worst case is **Vgs ≈ Vdd/2, Vds = Vdd** (enough current and high field at once — i.e., mid-transition).

**DC equilibrium** (slide 14): current in = reverse-biased DB diode + impact ionization; current out = forward-biased BS diode. The slide's table:

- G = 0, S = 0, D = 0 → **Vb = 0**, Vt = Vt0
- G = 0, S = 0, D = Vdd → **Vb = 0.35 V**, Vt reduced
- G = 0, S = Vdd, D = Vdd → **Vb = Vdd**, Vt small

The middle row is the important one: an off NMOS with its drain high (e.g., the pull-down of an inverter whose output is high) drifts to **Vb ≈ 0.35 V**, which lowers its Vth. The last row (both S and D high) floats the body all the way to Vdd — this sets up the parasitic bipolar (5.5).

<div class="co co-core"><p class="co-t">Core idea</p>

Fast mechanisms (capacitive coupling, forward diode) move Vb within one transition; slow ones (leakage, impact ionization) set where it starts. Delay therefore depends on what the gate did microseconds to milliseconds ago.

</div>

### 5.4 First switching vs. second switching (history effect)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p52-1.jpeg" alt="First switching follows a long idle period; second switching follows a recent transition, and their delays differ." loading="lazy"><figcaption>First switching follows a long idle period; second switching follows a recent transition, and their delays differ. · EECS 627 lecture packet · page 52</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p52-2.jpeg" alt="First switch of an NMOS: body starts at 0.35 V, Cgb couples it up, Cdb couples it down 0.45 V, ending at -0.1 V." loading="lazy"><figcaption>First switch of an NMOS: body starts at 0.35 V, Cgb couples it up, Cdb couples it down 0.45 V, ending at -0.1 V. · EECS 627 lecture packet · page 52</figcaption></figure>

Definitions (slide 16): **first switching** = the input has been in one state for a long time (body at DC equilibrium) and then switches; **second switching** = a transition shortly after a previous one (body still carries the coupled charge from the last transition).

**NMOS first switching** (inverter input 0 → 1, slide 17, data from Bernstein & Rohrer, IBM):

- Before: Vg = 0, Vs = 0, Vd = Vdd → **Vb = 0.35 V** (DC equilibrium, table above).
- Input rises: **Cgb couples the body up** (small bump).
- Output falls: drain swings Vdd → 0 and **Cdb couples the body down by ~0.45 V**.
- After: **Vb ≈ -0.1 V** (below the source → higher Vth). It then slowly recovers toward equilibrium.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p52-3.jpeg" alt="Second switch: the body starts at 0 V and is coupled up 0.45 V by Cgb and Cdb, so the second transition is faster than the first." loading="lazy"><figcaption>Second switch: the body starts at 0 V and is coupled up 0.45 V by Cgb and Cdb, so the second transition is faster than the first. · EECS 627 lecture packet · page 52</figcaption></figure>

**NMOS second switching** (input 0 → 1 → 0 → 1, slide 18): after the input has been high, Vg = Vdd, Vs = Vd = 0 and **Vb = 0 V**. When the input falls and the output rises, **Cgb and Cdb couple the body up by ~0.45 V**, so at the start of the next switch **Vb = 0.45 V** — higher than the 0.35 V of the first switch → lower Vth → **the second switch is faster than the first**.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

History-dependent delay is a characterization problem: a single .lib arc cannot capture it, so PD-SOI libraries were characterized at the worst (first-switch, low-body) and best (second-switch) states and timing used the spread as extra margin. It is the same mindset as aging- or pattern-dependent delay in bulk: "what state was the device in before the edge?" Interviewers ask: which switch is slower and why (first, because Cdb coupling drives Vb negative from a lower start).

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

Don't reason only from the DC table. The DC body voltage sets the starting point, but the transition itself (Cdb coupling as the drain swings) often moves Vb more than the DC difference between states.

</div>

### 5.5 Parasitic bipolar effect

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p53-1.jpeg" alt="With source and drain both high the body floats up; pulling the source low turns on the lateral n-p-n bipolar regardless of the gate." loading="lazy"><figcaption>With source and drain both high the body floats up; pulling the source low turns on the lateral n-p-n bipolar regardless of the gate. · EECS 627 lecture packet · page 53</figcaption></figure>

The n+ source / p body / n+ drain form a **lateral n-p-n BJT** with the floating body as the base. Sequence (slide 20):

1. **Both S and D are high** for a long time → the body charges up toward Vdd (last row of the DC table).
2. **S is pulled low** quickly — the slide's example is **pass-transistor logic (PTL)**, where the "source" is a signal node, not ground.
3. The body-source junction is now forward biased; the stored body charge is the base current, and the BJT conducts collector current from the drain **independent of the gate** (the MOSFET is off).

The result is a transient leakage pulse that can discharge a node that should be held. The classic victims (added, standard SOI design lore): **precharged dynamic nodes** and **pass-gate muxes** — e.g., a domino node or a precharged bitline whose off pull-down/mux devices have both terminals high and then see their source yanked low. The same physics underlies the general rule that in PD-SOI a dynamic node needs a stronger keeper or a pre-discharge of internal stack nodes.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A NOR-ROM bitline is a wide dynamic NOR: many off cells hang on a precharged line, and the keeper must beat their combined leakage (n·Ioff). In PD-SOI you would add the bipolar pulse to that budget whenever an internal node (a column-mux source, a stacked node) can sit high and then be pulled low. The interview angle: name the off-state leakage paths of a dynamic node and how the keeper/precharge scheme covers each.

</div>

<div class="co co-core"><p class="co-t">Core idea</p>

Floating body + source dropping = a free BJT. The gate cannot stop it; only limiting body charge (body contacts, FD-SOI) or avoiding the "S and D both high, then S low" pattern can.

</div>

### 5.6 Fully depleted SOI and UTBB

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p54-1.jpeg" alt="FD-SOI (&lt;50 nm film) fully depletes, removing the bipolar and most hysteresis and giving ~70 mV/dec swing." loading="lazy"><figcaption>FD-SOI (&lt;50 nm film) fully depletes, removing the bipolar and most hysteresis and giving ~70 mV/dec swing. · EECS 627 lecture packet · page 54</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p54-2.jpeg" alt="UTBB-SOI (7 nm body, 25 nm BOX, ST 28/22 nm) adds a strong back-bias knob and an undoped channel with low RDF." loading="lazy"><figcaption>UTBB-SOI (7 nm body, 25 nm BOX, ST 28/22 nm) adds a strong back-bias knob and an undoped channel with low RDF. · EECS 627 lecture packet · page 54</figcaption></figure>

**FD-SOI** (thin film < 50 nm) — the film fully depletes when the channel forms:

- **No bipolar**, **much less hysteresis** (there is no neutral body to store charge).
- **Better subthreshold swing ~70 mV/dec** (closer to the 60 mV/dec ideal than bulk).
- **Lower Vth for the same Ioff** (follows from the steeper swing).
- **But**: higher **S/D resistance** (thin film), **Vth sensitive to Si thickness**, and **high-Vth devices are harder to fabricate** (you cannot simply dope a fully depleted film heavily).

**UTBB-SOI (Ultra-Thin Body and BOX)** — STMicroelectronics **28 nm / 22 nm**, **7 nm body / 25 nm BOX**:

- Advantages: **strong back-bias effect** (the thin BOX makes the substrate a real back gate; the slide shows a **flip-well** arrangement where the well under NMOS/PMOS is chosen to set LVT/RVT flavors) and an **undoped channel → low random dopant fluctuation (RDF)**.
- Disadvantages: **hard to manufacture**, and the **subthreshold swing is penalized with a thin BOX** (more coupling to the substrate).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Low RDF means lower local Vth mismatch — directly helpful for SRAM/ROM sense margins and high-sigma yield. Back bias is a post-silicon knob (forward bias for speed, reverse bias for leakage) that feeds into adaptive design and into multi-corner characterization of the same cell at several back-bias points.

</div>

### 5.7 Body contacts

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p54-3.jpeg" alt="Tying the body to ground makes a 4-terminal device: slower than bulk, but no delay variation and no bipolar." loading="lazy"><figcaption>Tying the body to ground makes a 4-terminal device: slower than bulk, but no delay variation and no bipolar. · EECS 627 lecture packet · page 54</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p54-4.jpeg" alt="Delay vs. Leff: floating-body SOI is fastest, bulk is next, and body-tied SOI is slowest." loading="lazy"><figcaption>Delay vs. Leff: floating-body SOI is fastest, bulk is next, and body-tied SOI is slowest. · EECS 627 lecture packet · page 54</figcaption></figure>

A **body contact** (slide 25) brings the body out through a p+ tap (the T-shaped/H-gate layout on the slide), giving a **4-terminal device**. Tying it to GND:

- **Slower than bulk** (extra gate/body capacitance and the contact's resistance; you also lose the floating-body Vth reduction),
- **but no delay variation** (no history effect),
- and **no bipolar**.

The measured plot (slide 26, Bernstein & Rohrer) of delay vs. Leff (0.09–0.15 um) shows the order: **floating SOI lowest delay, bulk in the middle, SOI-body-tied highest**. Designers therefore used body contacts selectively — on circuits that need matching or predictability (sense amps, PLLs, analog pairs, dynamic nodes), not everywhere (added).

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p55-1.jpeg" alt="Shorting body to gate gives low Vth when on and high Vth when off, but only works for Vdd &lt; 0.6 V." loading="lazy"><figcaption>Shorting body to gate gives low Vth when on and high Vth when off, but only works for Vdd &lt; 0.6 V. · EECS 627 lecture packet · page 55</figcaption></figure>

**Smart body contact** (body tied to gate; known as **DTMOS**, dynamic-threshold MOS — added name):

- Input rises → body rises with it → **lower Vth → fast switching**.
- Input falls → body goes low → **high Vth → low Ioff**.
- **But**: the body-source diode forward biases if the gate exceeds ~0.6 V, so **Vdd < 0.6 V**; plus **additional gate capacitance**, **Miller capacitance** (more gate-to-drain coupling) and the **RC delay of the back gate** (the body is resistive).

Summary (slide 28): SOI is here; PD-SOI remains in older specialty processes (IBM went PD-SOI around **1998–2000**, "too early", and the **floating body was too painful**); FD-SOI lives on in FinFETs (the fin is also fully depleted) and in UTBB at 28/22 nm.

Relation to today's processes (added): a FinFET or gate-all-around device on a bulk wafer is fully depleted by geometry rather than by a thin film on a BOX, so it inherits the FD-SOI benefits (steep swing, undoped channel, low RDF, no floating-body history) without the SOI wafer. What it gives up is the strong back-bias knob of UTBB, since the gate wraps the channel and the substrate has little control. Planar FD-SOI (UTBB) remains a niche for low-power/IoT/RF parts precisely because of that body-bias knob.

<div class="co co-core"><p class="co-t">Core idea</p>

The body is a knob: float it (fast, unpredictable), tie it (predictable, slower), tie it to the gate (fast and low leakage, but only at low Vdd), or bias it from the back (UTBB).

</div>

<div class="co co-eq"><p class="co-t">Equation card</p>

Coupling: ΔVb = ΔVx · Cxb / ΣCb. First vs. second switch: Vb starts at 0.35 V vs. 0.45 V → second is faster. DTMOS limit: Vdd < ~0.6 V (body-source diode). FD-SOI swing ~70 mV/dec.

</div>

### 5.x Check yourself

1. **Why did SOI stay restricted to space applications for many years?** → Bonded SOI needed two wafers per SOI wafer, so cost was not competitive for terrestrial products; the radiation tolerance still made it worth it for space. (V2 practice exam 2, Problem 6A)
2. **What technique made terrestrial SOI practical?** → Smart Cut: H+ implant defines a cleave plane so the donor wafer is reused, avoiding two wafers per SOI wafer. (V2 practice exam 2, Problem 6B)
3. **List the DC body-charging mechanisms of an NMOS in PD-SOI and which direction each pushes Vb.** → In: DB reverse leakage, impact ionization (holes), gate tunneling; out: BS forward diode (fast clamp); plus slow thermal generation/recombination.
4. **Which is slower, the first or the second switch of an NMOS pull-down, and why?** → The first: the body starts at 0.35 V and Cdb coupling drives it to about -0.1 V; in the second switch the body starts at 0.45 V (coupled up during the previous edge), so Vth is lower.
5. **Describe the parasitic bipolar failure.** → Source and drain both high for a long time charge the floating body; when the source is pulled low (e.g., pass-transistor logic) the B-S junction forward biases and the lateral n-p-n conducts drain current with the gate off — it can discharge a held dynamic node.
6. **Why does FD-SOI avoid the bipolar and most hysteresis?** → The film (<50 nm) fully depletes, so there is no neutral body to store charge; side benefits are ~70 mV/dec swing and lower Vth at equal Ioff.
7. **What do body contacts cost, and what does a body-to-gate tie buy?** → Grounded body: slower than bulk but no history variation and no bipolar. Body-to-gate (DTMOS): low Vth when on, high Vth when off, but Vdd < 0.6 V, more gate and Miller capacitance, and back-gate RC delay.
8. **Two UTBB-SOI advantages and two disadvantages?** → Strong back-bias effect and an undoped channel (low RDF); hard to manufacture and swing penalized by the thin BOX.


## Lecture 6 — Energy Recovery (Adiabatic Logic)

Conventional CMOS burns ½CV² in the switch resistance on every charge and every discharge, no matter how the transistor is sized. Energy-recovery (adiabatic) circuits avoid this by never putting a large voltage across a conducting switch: they ramp the supply slowly, with a resonant LC "power clock", so the energy stored on the load can be returned instead of burned. This lecture derives where the energy goes, builds the resonant clock, then shows single-rail and dual-rail adiabatic dynamic logic, an adiabatic flip-flop (PTERF), and real examples (UMich SCAL-D multiplier, AMD Piledriver resonant clock mesh, SRAM bitline charge recycling). For a circuit designer the most transferable ideas are the **switch-energy argument**, **resonant clocking** and **charge recycling on bitlines**.

### 6.1 Where the energy goes

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p57-1.jpeg" alt="A CMOS inverter driven by a step burns ½CV² in the switch on each transition; the capacitor itself stores energy without loss." loading="lazy"><figcaption>A CMOS inverter driven by a step burns ½CV² in the switch on each transition; the capacitor itself stores energy without loss. · EECS 627 lecture packet · page 57</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p57-2.jpeg" alt="Ramping the input slowly over T cuts the loss to (RC/T)·CV², which goes to zero as T grows." loading="lazy"><figcaption>Ramping the input slowly over T cuts the loss to (RC/T)·CV², which goes to zero as T grows. · EECS 627 lecture packet · page 57</figcaption></figure>

**Step input** (slides 3–4). Energy flowing into or out of a capacitor is lossless; energy flowing through a resistor is lost as **PR = VR·IR**. For a step, the full voltage initially appears across the switch, and integrating VR·IR over the charging transient gives

```latex
E_{diss} = \tfrac{1}{2} C V^2 \quad \text{(per transition, independent of } R\text{)}
```

The other ½CV² ends up stored on CL and is burned in the NMOS on the discharge, giving the familiar CV² per cycle drawn from the supply. The key point (and a classic exam question): **sizing the pull-up does not change this energy** — a smaller R just dissipates the same energy faster (V2 practice exam 2, Problem 1A).

**Slow ramp input** (slide 5). If the source ramps linearly over T ≫ RC, the current is roughly constant I = CV/T and the voltage across R is small:

```latex
E_R = P_R T = V_R I_R T = I^2 R T = \left(\frac{CV}{T}\right)^2 R T = \left(\frac{RC}{T}\right) C V^2
```

So **E → 0 as T → ∞**. In practice make **T ≫ RC**: with a typical **RC ~ 30 ps**, choosing **T ~ 300 ps** is "not so slow" and gives E ≈ 0.1·CV² (derived), versus 0.5·CV² for a step.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p57-3.jpeg" alt="Ramping in n equal steps cuts the loss to ½CV²/n, which also goes to zero for large n." loading="lazy"><figcaption>Ramping in n equal steps cuts the loss to ½CV²/n, which also goes to zero for large n. · EECS 627 lecture packet · page 57</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p57-4.jpeg" alt="With an oscillating source, close the switch only when the voltage across it is zero, then ride the waveform up or down." loading="lazy"><figcaption>With an oscillating source, close the switch only when the voltage across it is zero, then ride the waveform up or down. · EECS 627 lecture packet · page 57</figcaption></figure>

**Stepwise charging** (slide 6): n steps of V/n each dissipate ½C(V/n)², so

```latex
E = \left[\tfrac12 C\left(\tfrac{V}{n}\right)^2\right] n = \tfrac12 C\frac{V^2}{n} \;\xrightarrow{n\to\infty}\; 0
```

**Oscillating input** (slides 7–14). Replace the ramp by a sinusoidal source. Keep the switch open while the source swings; **close it at the instant the source equals the capacitor voltage** (zero volts across the switch), then let the capacitor ride the source up (0 → 1) or down (1 → 0); **open it at the peak or trough** and the capacitor holds its value. Conditionally closing the switch is what makes it logic: "**conditionally ramp up or down**."

<div class="co co-core"><p class="co-t">Core idea</p>

Dissipation is ∫VR·IR dt in the switch. Adiabatic design keeps VR small by making the source track the load (slow ramp, steps, or a sinusoid), so energy moves back and forth instead of being burned.

</div>

<div class="co co-eq"><p class="co-t">Equation card</p>

Step: E = ½CV² (any R). Ramp: E = (RC/T)·CV². n steps: E = ½CV²/n. Memory trick: loss scales with (voltage across the switch)², so cut that voltage.

</div>

### 6.2 Resonant clock generation

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p58-1.jpeg" alt="An LC tank with a switch moves energy between inductor and capacitor every half cycle, which is lossless if Rswitch = 0." loading="lazy"><figcaption>An LC tank with a switch moves energy between inductor and capacitor every half cycle, which is lossless if Rswitch = 0. · EECS 627 lecture packet · page 58</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p58-2.jpeg" alt="Switch, wire and inductor resistance damp the oscillation, and the resonant frequency is fixed by L and C." loading="lazy"><figcaption>Switch, wire and inductor resistance damp the oscillation, and the resonant frequency is fixed by L and C. · EECS 627 lecture packet · page 58</figcaption></figure>

**Resonant clock** (slides 16–20): an inductor from a VDD/2 source drives the clock capacitance. Phase 1: current builds in the inductor (energizing) as vclk rises; phase 2: the inductor de-energizes, pushing vclk above VDD/2 to the peak; phases 3–4 repeat in the opposite direction. Energy sloshes between L and C — **no loss if Rswitch = 0 Ω**. This is also called **"charge recycling."**

**With loss** (slide 21): resistance of the **switch, interconnect and inductor** damps the oscillation (decaying envelope around VDD/2). The slide gives

```latex
Q = \frac{1}{R}\sqrt{\frac{L}{C_t}}, \qquad \omega_0 = \frac{\sqrt{1-\gamma^2}}{\sqrt{L C_t}}, \qquad \gamma = \frac{R}{2}\sqrt{\frac{C_t}{L}}
```

and for the lossless case **ω0 = 1/√(LC)**. Two consequences: the switch must replenish the lost energy each cycle, and the **clock frequency is fixed** by L and C — you cannot freely scale frequency (DVFS) without retuning.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p59-1.jpeg" alt="Practical drivers kick the tank at its trough, at both peak and trough, or through a square-wave source into a large tank cap." loading="lazy"><figcaption>Practical drivers kick the tank at its trough, at both peak and trough, or through a square-wave source into a large tank cap. · EECS 627 lecture packet · page 59</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p59-2.jpeg" alt="Single-rail adiabatic OR: pass transistors gate the power clock to the output, which tracks it minus a Vt drop." loading="lazy"><figcaption>Single-rail adiabatic OR: pass transistors gate the power clock to the output, which tracks it minus a Vt drop. · EECS 627 lecture packet · page 59</figcaption></figure>

**Clocking schemes** (slide 22): three ways to sustain the oscillation — a single pull-down switch that fires at the trough (red circle), pull-up and pull-down switches that fire at both peak and trough, or a square-wave driver through R-L into a tank formed by **Clarge** in parallel with **Ccircuit**. In every case the switch fires when the voltage across it is near zero, so the kick itself is efficient.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

The clock network is the largest single switched capacitance on a chip, so resonant clocking is the one adiabatic idea that shipped (AMD Piledriver, 6.6). For a cell designer the consequence is sinusoidal (slow-edge) clocks: flops must be characterized and robust against slow clock slew, and hold/setup arcs move with the edge rate.

</div>

### 6.3 Adiabatic dynamic logic (single rail)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p59-3.jpeg" alt="Adiabatic logic needs no clock gating and costs little energy, but needs a high-Q resonant clock and correct timing, and spends one clock phase per gate." loading="lazy"><figcaption>Adiabatic logic needs no clock gating and costs little energy, but needs a high-Q resonant clock and correct timing, and spends one clock phase per gate. · EECS 627 lecture packet · page 59</figcaption></figure>

**Adiabatic OR gate** (slides 24–25): the power clock vclk (resonant, from a VDD/2 source through L) is passed to vout through parallel NMOS devices driven by A and B (= VDD when on). If either is on, vout follows vclk up and back down — energy returns to the tank.

Issues:

- **Not full-rail**: an NMOS passes only VDD − Vt (**Vt drop**).
- The **Vt drop accumulates stage by stage** in a logic chain.

Advantages: **low energy at nominal supply voltage** (unlike voltage scaling, no Vdd reduction is needed) and **no need for clock gating** (an idle gate whose switch stays open simply does not charge).

Disadvantages: **resonant clock required with a good Q**; **must switch at the right time** (inputs must be stable before the power clock ramps, otherwise there is a voltage across the switch); **1 gate delay = 1 clock phase** (very slow pipelines); **capacitance changes with switching** (the load the tank sees depends on data, which detunes the resonance).

### 6.4 Dual-rail adiabatic dynamic logic

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p60-1.jpeg" alt="A dual-rail inverter with cross-coupled PMOS gives full-rail outputs and a data-independent load, at the cost of 4 transistors and strict timing." loading="lazy"><figcaption>A dual-rail inverter with cross-coupled PMOS gives full-rail outputs and a data-independent load, at the cost of 4 transistors and strict timing. · EECS 627 lecture packet · page 60</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p60-2.jpeg" alt="Cascaded stages use power clocks 90 degrees apart, cycling input switch, evaluate, hold and precharge." loading="lazy"><figcaption>Cascaded stages use power clocks 90 degrees apart, cycling input switch, evaluate, hold and precharge. · EECS 627 lecture packet · page 60</figcaption></figure>

**Dual-rail INV** (slides 27–32): cross-coupled PMOS from VDD on top, NMOS input devices in and in̄ at the bottom, and the **power clock Φ as the "ground"** of the NMOS. Walking the numbered steps:

1. Φ rises 0 → VDD. With in = 1, Q follows Φ up through the NMOS to **VDD − Vth**; Q̄ is held at VDD by its PMOS.
2. At the peak (zero voltage across the switches) the inputs swap: **in 1 → 0, in̄ 0 → 1**.
3. Φ falls; Q̄ now follows Φ down through the in̄ NMOS (VDD → VDD − Vth → 0), returning its charge to the clock.
4. As Q̄ falls, the left PMOS turns on and restores **Q to full VDD**.

Advantages: **equal load** (exactly one rail of each pair switches every cycle, so the tank sees data-independent capacitance — this fixes the "cap changes with switching" problem) and **full-rail switching** (PMOS restoration removes the Vt drop). Problems: **switch at the right times**, and **4 transistors for an inverter**.

**Cascading** (slides 33–36): stage 1 on Φ1 feeds stage 2 on Φ2, shifted **90°**. Each stage cycles through **input switch → evaluate → hold → precharge**; while stage 1 holds, stage 2 evaluates from it.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p60-3.jpeg" alt="Dual-rail adiabatic needs four 90-degree power clocks, evaluates one gate per phase, and cannot connect arbitrary outputs to inputs." loading="lazy"><figcaption>Dual-rail adiabatic needs four 90-degree power clocks, evaluates one gate per phase, and cannot connect arbitrary outputs to inputs. · EECS 627 lecture packet · page 60</figcaption></figure>

Problems (slide 37):

- **4 resonant clocks, each 90° phase shifted**.
- **1 clock cycle → 4 evaluate phases → 4 logic gates** per cycle (deeply pipelined, gate-level clocking).
- **I/O cannot be arbitrarily connected**: a gate's inputs must come from the stage on the previous phase, so paths of different depth need **dummy (buffer) stages** to rebalance before they merge at a 2-input gate (V2 practice exam 2, Problem 1D, item f).

<div class="co co-guard"><p class="co-t">Common trap</p>

"Adiabatic logic is zero energy" is false. Loss scales as RC/T, there are non-adiabatic residues (Vt drops, partial-adiabatic steps), and the tank has finite Q. The real costs are area (dual rail, 4T inverter), multi-phase clocks and a fixed frequency.

</div>

### 6.5 Adiabatic flip-flop (PTERF)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p61-1.jpeg" alt="PTERF is a dual-rail adiabatic inverter (power-clocked PMOS pair) feeding a NOR SR latch, bridging static logic to static logic." loading="lazy"><figcaption>PTERF is a dual-rail adiabatic inverter (power-clocked PMOS pair) feeding a NOR SR latch, bridging static logic to static logic. · EECS 627 lecture packet · page 61</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p61-2.jpeg" alt="The output node discharges adiabatically to about Vthp and the remainder is lost non-adiabatically, hence partially adiabatic." loading="lazy"><figcaption>The output node discharges adiabatically to about Vthp and the remainder is lost non-adiabatically, hence partially adiabatic. · EECS 627 lecture packet · page 61</figcaption></figure>

**PTERF** (Ziesler et al., VLSI Symposium 2003): the clocked element is a **cross-coupled PMOS pair sourced from Φ** with **NMOS D / D̄ pull-downs to ground**, producing pulsed dual-rail outputs **X, Y** that set/reset a **NOR SR latch** to produce static **Q, Q̄**. Placed between ordinary **static combinational logic** blocks, it lets a design use an energy-recovery clock without converting all logic to adiabatic style.

Walking slides 40–45: as Φ rises, the selected node (X) follows Φ (0 → Vthp → 1) and sets the latch; as Φ falls, X tracks it back down — but only until the PMOS turns off near **|Vthp|**; the last Vthp of swing is discharged by the NMOS non-adiabatically (**"partial adiabatic"**, slide 44). When D changes, the other side (Y) fires on the next Φ and the latch flips Q (slide 45).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

PTERF is a pulsed-latch idea: a clock-driven precharge/evaluate front end plus an SR latch, the same topology family as sense-amp flip-flops and the sense-amp + latch used at the bottom of an SRAM/ROM column. Interview angle: what sets its setup time (D must be stable before Φ ramps) and why its energy is "partial" (the PMOS cut-off at Vthp).

</div>

### 6.6 Adiabatic examples

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p61-3.jpeg" alt="AMD Piledriver (2012) used a resonant clock mesh, saving 24% of clock power and 10% of total." loading="lazy"><figcaption>AMD Piledriver (2012) used a resonant clock mesh, saving 24% of clock power and 10% of total. · EECS 627 lecture packet · page 61</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p61-4.jpeg" alt="SRAM charge recycling shorts bitlines at staggered voltages so charge is shared, claiming up to ~90% write power saving." loading="lazy"><figcaption>SRAM charge recycling shorts bitlines at staggered voltages so charge is shared, claiming up to ~90% write power saving. · EECS 627 lecture packet · page 61</figcaption></figure>

- **Work at UMich** (slide 47): a full-custom **8-bit multiplier with BIST in SCAL-D** showed **2–3× lower power than CMOS at 100 MHz**.
- **AMD Piledriver (2012)**: a **resonant clock mesh** — on-chip spiral inductors and tank capacitors on the clock grid, with a clock driver that can switch between resonant and conventional modes (the slide shows plsEn/preclk/drvEn controls). **Energy recovery in the clock network only**: **24% saving in clock network, 10% total**.
- **Low-power SRAM, charge recycling** (K. Roy, JSSC 2008): **bitline capacitance is large**, and full-swing writes keep charging and discharging it. Bitlines of different segments are **shorted at intermediate voltages** (VDD, ¾VDD, ½VDD, ¼VDD, VSS on the slide) so charge is passed from one bitline pair to the next — **the voltage across each switch stays small**, which is the same adiabatic principle. **Up to ~90% write power saving claimed.**

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Bitlines and wordlines are the big capacitors in a memory macro. Charge sharing, limited-swing bitlines and staged precharge are all "keep the voltage across the switch small" ideas. For a ROM/SRAM designer this is the bridge from this lecture: precharge energy ∝ C_BL·VDD·ΔV_BL, so limiting the swing and recycling charge pays directly.

</div>

<div class="co co-core"><p class="co-t">Core idea</p>

Full adiabatic logic is a research curiosity (slow, multi-phase, area-hungry); the parts that survive are resonant clocks and charge recycling on big capacitive nets.

</div>

### 6.x Check yourself

1. **In a CMOS inverter switched by an instant input step, is there a pull-up size that minimizes the energy drawn from VDD?** → No. The energy lost in the pull-up is ∫I·V dt = ½CV² regardless of its resistance; size only changes how fast it is burned. (V2 practice exam 2, Problem 1A)
2. **An NMOS pass device N2 (gate at Vhigh ≫ VDD) charges CL from a source ramping linearly over T. Does N2 sizing matter?** → Yes, larger is better: the current is fixed at about CL·VDD/T, and a wider N2 lowers the voltage across it, so E = I²RT drops. (Problem 1B)
3. **Splitting CL into CL/2 + CL/2 behind P1 and an N2 pass device, with an instant step: can sizing beat circuit (a)?** → No. VDD supplies charge CL·VDD and energy CL·VDD² either way; sizing only changes which transistor dissipates the energy. (Problem 1C)
4. **Give three difficulties of adiabatic circuits in a processor.** → Need an inductor with good Q on chip; resonant frequency not easily tunable (C load sets it); speed penalty (one gate per clock phase); poor scaling of size/complexity; dummy paths to align cascaded logic at multi-input gates. (Problem 1D)
5. **Energy lost when ramping over T = 300 ps with RC = 30 ps?** → E = (RC/T)·CV² = 0.1·CV², versus 0.5·CV² for a step (derived).
6. **Why use a dual-rail adiabatic gate instead of the single-rail OR?** → Full-rail outputs (PMOS restoration removes the Vt drop) and a data-independent load on the resonant clock.
7. **Why can't dual-rail adiabatic gates be wired arbitrarily?** → Each gate evaluates on its own 90°-shifted phase; inputs must come from the previous phase, so unequal path depths need dummy buffer stages.
8. **Where did energy recovery actually ship, and how much did it save?** → AMD Piledriver's resonant clock mesh: 24% of clock power, 10% of total.


## Lecture 7 — Variations

This lecture is about the fact that no two transistors, wires or dies are alike, and that the chip also changes while it runs. It walks through where uncertainty comes from (modeling and extraction errors, manufacturing steps such as CMP, lithography, implantation, stress and annealing, and operating voltage and temperature), how to classify it (systematic vs random, die-to-die vs within-die, spatially correlated vs uncorrelated), and how to analyze it (corners vs global Monte Carlo vs local Monte Carlo at a corner). It closes with lifetime effects: NBTI, hot-carrier degradation, TDDB and electromigration. For a standard-cell or ROM designer this is the lecture behind every margin you sign off: the .lib corners, the OCV/AOCV/POCV derates, SRAM/ROM high-sigma bitcell analysis, aging-aware characterization and EM rules.

### 7.1 Why variation became a first-order problem

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p63-1.jpeg" alt="At 0.18 µm, ~1000 dies spanned 30% in frequency and 20X in leakage, and the fastest dies were also the leakiest." loading="lazy"><figcaption>At 0.18 µm, ~1000 dies spanned 30% in frequency and 20X in leakage, and the fastest dies were also the leakiest. · EECS 627 lecture packet · page 63</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p63-2.jpeg" alt="Performance variability (σ/µ) has grown node over node, with a dip at high-k metal gate and new rises with FinFET and EUV." loading="lazy"><figcaption>Performance variability (σ/µ) has grown node over node, with a dip at high-k metal gate and new rises with FinFET and EUV. · EECS 627 lecture packet · page 63</figcaption></figure>

The opening data (Borkar, Intel) is the classic "wake-up call": about **1000 samples in 0.18 µm**, plotted as normalized frequency vs normalized standby leakage.

- Frequency spread ≈ **30%**, leakage spread ≈ **20X**.
- The two are correlated through the same physical knob: a die with shorter Leff or lower Vth is fast **and** leaky. The green cluster is slow and low-leakage; the yellow cluster is the sweet spot; the red tail is fast but leaks up to 20X.
- This makes it a **two-sided constraint**. You cannot just ship the fast dies: the fastest ones blow the power/thermal budget, and the slowest ones miss frequency. Yield is the area inside a window, not above a line.

Why leakage spreads so much more than frequency: subthreshold current is exponential in Vth, while delay is roughly linear in it.

```latex
I_{off} \propto e^{-V_{th}/(n v_T)} \quad\Rightarrow\quad \text{Gaussian } V_{th} \;\to\; \text{lognormal } I_{off}
```

A practical consequence (added): the **mean** leakage of a population is larger than the leakage of the nominal device, E[Ioff] = Ioff,nom·exp(σVth²/(2(n·vT)²)), so a full-chip leakage estimate taken at TT underestimates the real average.

The trend chart (slide 4) shows variability (σ/µ of performance) climbing from the 250 nm era to the 3 nm era. Two annotations matter: **HKMG introduction** gives a visible dip (thinner effective oxide and lower channel doping reduce Vth spread), and the curve resumes its rise with **FinFET** and **EUV**. The four images name the main physical culprits: litho-induced gate CD variation, oxide thickness, random dopants, and CMP thickness variation.

<div class="co co-core"><p class="co-t">Core idea</p>

Variation turns one design point into a distribution. Frequency and leakage come from the same distribution, so the fast tail is also the leaky tail, and yield is a two-sided window.

</div>

### 7.2 Where uncertainty enters: design, manufacturing, application

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p64-1.jpeg" alt="Uncertainty enters at design (modeling and analysis), manufacturing (process), and application (context: V, T, workload, aging), and each stage is modeled differently." loading="lazy"><figcaption>Uncertainty enters at design (modeling and analysis), manufacturing (process), and application (context: V, T, workload, aging), and each stage is modeled differently. · EECS 627 lecture packet · page 64</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p64-2.jpeg" alt="A 2D rule-table extractor underestimated coupling capacitance by about 4X and total capacitance by about 2X compared with a 3D field solver." loading="lazy"><figcaption>A 2D rule-table extractor underestimated coupling capacitance by about 4X and total capacitance by about 2X compared with a 3D field solver. · EECS 627 lecture packet · page 64</figcaption></figure>

Slides 5–9 build a table with three columns and three rows (uncertainty, sample space, modeling):

| Stage | Uncertainty | Sample space | How it is modeled |
|---|---|---|---|
| Design implementation | Modeling and analysis uncertainty | Design iterations | **Worst case** (hold vs setup bounds on C) |
| Manufacturing | Process uncertainty | Manufactured die | **Probabilistic / statistical** (ship vs reject on f) |
| Application | Context uncertainty | Instruction sequence, V, T, aging | **Worst case** (tmin to tmax) |

So the lecture splits sources into three bins (slide 10):

1. **Process modeling and analysis errors**: device model inaccuracy, parasitic extraction error.
2. **Manufacturing variations**: device and interconnect parameters.
3. **Operating context variations**: supply voltage and temperature during operation.

**Extraction accuracy (slide 11).** The same INTERCONNECT net extracted by a 2D rule-table PEX and by a 3D field-solver PEX: coupling cap is **~4X** higher and total cap **~2X** higher in 3D (table: Ctotal 3.61e-16 F vs 6.76e-16 F; Cc 3.62e-17 F vs 1.49e-16 F). The cross-section of an M0–M10 stack shows why: real wire shapes are tall, trapezoidal and closely spaced, which a 2D table cannot capture.

**Model accuracy (slide 12)** lists non-manufacturing sources of timing error that designers often forget are "variation":

- PDK characterization error (the SPICE model itself),
- **false paths** (pessimism, or optimism if a real path is declared false),
- **coupling delay noise**, which depends on assumed aggressor/victim alignment,
- **multi-input switching (MIS)** and its alignment: a .lib arc is characterized with one input switching, but simultaneous switching of two series or parallel inputs changes the delay.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

MIS and coupling alignment are exactly what library characterization does not capture by default. A NAND2 with both inputs rising together is slower (series stack) and a NOR2 with both inputs falling together is faster than its single-input arc says. ROM bitlines are long coupled wires: a 2X error in extracted bitline capacitance directly mis-sizes the precharge, keeper and sense timing.

</div>

### 7.3 Device-level manufacturing variation: planar vs FinFET

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p65-1.jpeg" alt="In planar devices the 3σ/µ budget was about 3% for Tox, 5–7% for L and 5% for RDF." loading="lazy"><figcaption>In planar devices the 3σ/µ budget was about 3% for Tox, 5–7% for L and 5% for RDF. · EECS 627 lecture packet · page 65</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p65-2.jpeg" alt="In FinFETs RDF drops to 2% and Tox to 1.5%, but L grows to 8–12% and fin width (10–15%) and metal gate granularity (5–8%) appear." loading="lazy"><figcaption>In FinFETs RDF drops to 2% and Tox to 1.5%, but L grows to 8–12% and fin width (10–15%) and metal gate granularity (5–8%) appear. · EECS 627 lecture packet · page 65</figcaption></figure>

Numbers to memorize (all are 3σ/µ):

| Source | Planar | FinFET |
|---|---|---|
| Tox | 3% | 1.5% |
| Gate length L | 5–7% | 8–12% |
| RDF | 5% | 2% |
| Fin width | — | 10–15% (new) |
| Metal gate granularity (MGG) | — | 5–8% (new) |

Interpretation:

- FinFETs use a lightly doped (near intrinsic) channel, so **RDF shrinks**. That is why FinFET Vth mismatch was a relief for SRAM at first.
- But two new **random** sources appear: **fin width** (the fin is a lithographically/spacer-defined sliver whose thickness sets electrostatics and Vth) and **metal gate granularity** (the work-function metal is polycrystalline; each grain orientation has a different work function, so a small gate sees only a few grains).
- Devices are **width-quantized** (integer fins), so you can no longer upsize a bitcell by a fraction of a fin to fix mismatch.

The general list on slide 16 (repeated as the section roadmap): CMP, lithography, RDF (ion implantation), LER, stress implants, RTA, wafer topography/reflectivity, etching. Its key sentence: **one physical parameter usually impacts more than one electrical parameter**. Example: doping → Vth → both ID,sat (→ fmax) and Ileak (→ Pstandby).

### 7.4 CMP and metal fill

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p65-3.jpeg" alt="Soft copper dishes in wide lines and erodes in dense arrays, so metal thickness, and therefore R and C, depends on layout density." loading="lazy"><figcaption>Soft copper dishes in wide lines and erodes in dense arrays, so metal thickness, and therefore R and C, depends on layout density. · EECS 627 lecture packet · page 65</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p65-4.jpeg" alt="Floating fill adds two series coupling caps with switching dependence, while grounded fill adds larger ground caps without it, and either must be modeled." loading="lazy"><figcaption>Floating fill adds two series coupling caps with switching dependence, while grounded fill adds larger ground caps without it, and either must be modeled. · EECS 627 lecture packet · page 65</figcaption></figure>

**Why CMP (slide 17):** each damascene level must be planarized before the next is built; without CMP the stack becomes wavy and later litho goes out of focus.

**Layout dependence (slide 18):** SiO2 is **hard**, copper is **soft**, so the polish removes them at different rates.

- **Dishing**: the pad bends into **wide** lines and scoops copper out of the middle (isolated wide lines, dense wide lines).
- **Erosion**: in **dense** arrays both oxide and metal are removed, lowering the whole region.
- Result: **metal thickness ↓ → Cc ↓ but R ↑**. The goal is uniform metal.

**Metal fill (slide 19):** dummy shapes inserted before tape-out make density fairly uniform and reduce CMP uncertainty. Foundries enforce **min and/or max density rules** per window.

**Floating vs grounded fill (slide 20)** between two signal wires A1 and A2:

| Case | Capacitance | Effect |
|---|---|---|
| No fill | 580 aF coupling | Smallest coupling, bad for CMP |
| Floating fill | 600 aF + 600 aF in series through the fill | Less delay increase, but **switching dependence** (still couples A1 to A2) |
| Grounded fill | 700 aF + 700 aF, each to ground | More delay increase, **no switching dependence** |

Slide 21 shows the histograms over many nets of Cc(float-fill)/Cc(no-fill) and Cc(ground-fill)/Cc(float-fill): fill typically raises capacitance by a sizeable fraction with a long tail. The message is in the title: **floating or grounded, model it either way** (extract with fill, not without).

<div class="co co-guard"><p class="co-t">Common trap</p>

"Fill only affects ground capacitance" is wrong for floating fill. A floating fill shape is a capacitive bridge between the two neighbors, so it keeps (and spreads) Miller coupling. Grounded fill removes switching dependence but costs more total C.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Exam answer: CMP affects coupling and ground capacitance (and resistance) by changing metal thickness, and the design rule it creates is the metal density rule. In memories and ROMs the array is a dense, regular pattern next to sparse periphery, which is the textbook setup for erosion. EM and IR budgets use the thinned (eroded) metal cross-section.

</div>

### 7.5 Lithography and resolution enhancement (OPC, phase shift)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p66-1.jpeg" alt="Minimum feature size is k1·λ/NA, and since 193 nm light printed features far below its wavelength for two decades, everything rides on k1 (RET) and NA." loading="lazy"><figcaption>Minimum feature size is k1·λ/NA, and since 193 nm light printed features far below its wavelength for two decades, everything rides on k1 (RET) and NA. · EECS 627 lecture packet · page 66</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p66-2.jpeg" alt="Without OPC the printed gate length varies by about 20%, and OPC pre-distorts the mask with hammerheads and serifs to compensate." loading="lazy"><figcaption>Without OPC the printed gate length varies by about 20%, and OPC pre-distorts the mask with hammerheads and serifs to compensate. · EECS 627 lecture packet · page 66</figcaption></figure>

**Projection lithography (slide 23):** a UV laser illuminates a mask; the lens stack forms a **4X reduced** image on the photoresist. A **reticle** holds multiple chips, about **20 mm × 30 mm = 600 mm²**, and a **stepper** moves the wafer from field to field.

```latex
\text{Min feature} = \frac{k_1\,\lambda}{NA}
```

- **NA**: numerical aperture (optics), **λ**: wavelength, **k1**: process factor reduced by **resolution enhancement techniques (RET)** such as OPC.
- Traditional source **193 nm** (ArF); production technology is at **2 nm (GAA)**. The industry moved to **EUV (λ = 13 nm)** at **7/5 nm**, in production since **2019**; the open question has been throughput.

**RET (slide 25):** the light is a wave with wavelength, direction, amplitude and phase; RET controls all four (OPC shapes amplitude, phase-shift masks control phase, off-axis illumination controls direction, EUV changes wavelength).

**You do not get what you drew (slide 26):** a drawn poly shape prints with rounded corners, line-end pullback and width that depends on neighbors. **Lprinted varies by ~20% without OPC** (slide 27). OPC "you draw / OPC" examples: hammerheads on line ends, serifs on corners, notches on inside corners.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p67-1.jpeg" alt="OPC adds serifs and sub-resolution scattering bars so the printed gate matches the drawn shape." loading="lazy"><figcaption>OPC adds serifs and sub-resolution scattering bars so the printed gate matches the drawn shape. · EECS 627 lecture packet · page 67</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p67-2.jpeg" alt="A 180° phase shifter makes adjacent openings interfere destructively so two close features print separately instead of merging." loading="lazy"><figcaption>A 180° phase shifter makes adjacent openings interfere destructively so two close features print separately instead of merging. · EECS 627 lecture packet · page 67</figcaption></figure>

- **Scattering bars** (assist features) are below the print threshold; they make an isolated line "look dense" to the optics so isolated and dense lines print with the same CD.
- **Phase shift masks**: with a binary mask the two neighboring openings' fields add, and the summed intensity between them crosses the resist threshold, so the features merge. Flipping one opening by **180°** makes the fields cancel between them; intensity (|A|²) drops to zero there and two separate features print.
- **Immersion (slide 31):** water between lens and wafer (n = **1.44**) lets the lens collect wider angles, so **NA > 1 (1.1–1.2 at 45 nm)**. Practical problems: bubbles and temperature control, which slow production.

<div class="co co-core"><p class="co-t">Core idea</p>

Gate length is not what you drew. Its printed value depends on neighbors, focus and dose, which is why foundries restrict layout (fixed pitch, one orientation) and why identical layout context is the best matching tool.

</div>

### 7.6 Double patterning and SRAM robustness

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p67-3.jpeg" alt="Pitch-split DPL prints shapes in two exposures and needs tight overlay, while SADP uses spacers to double pitch and is immune to overlay but forces one CD." loading="lazy"><figcaption>Pitch-split DPL prints shapes in two exposures and needs tight overlay, while SADP uses spacers to double pitch and is immune to overlay but forces one CD. · EECS 627 lecture packet · page 67</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p67-4.jpeg" alt="Features closer than the single-exposure spacing must go on different masks, some conflicts are fixed by stitches, but odd-cycle native conflicts cannot be fixed." loading="lazy"><figcaption>Features closer than the single-exposure spacing must go on different masks, some conflicts are fixed by stitches, but odd-cycle native conflicts cannot be fixed. · EECS 627 lecture packet · page 67</figcaption></figure>

**DPL** is the optical solution for **32 nm and below** (slide 32). Two flavors:

- **Pitch-split (LELE)**: split the critical layer into two masks, each printed at a robust **k1 ≈ 0.35–0.4**. Cost: tighter **overlay** control and more processing steps. Each mask has its **own CD distribution**.
- **Spacer / self-aligned DPL (SADP)**: print a mandrel, deposit spacers on its sidewalls, remove the mandrel; the spacers define lines at twice the frequency. **Excellent variability control, immune to overlay**, but limits the whole layer to **one critical dimension**. Used extensively at 14–7–5 nm and still in use (Intel's 22 nm line/space example on slide 33).

**Challenge 1: decomposition (slide 35).** Shapes closer than the minimum same-mask spacing must be on different colors. This is a graph 2-coloring problem: any **odd cycle** of conflicts is a **native conflict** that cannot be colored. Some conflicts can be resolved with a **stitch** (split a shape between two masks with an overlap), but stitches cost printability due to overlay error and line-end effects. Goal: conflict-free layout with minimum stitches.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p68-1.jpeg" alt="Two masks give two gate-length populations, which breaks the assumption that neighbors are correlated and increases mismatch between adjacent devices." loading="lazy"><figcaption>Two masks give two gate-length populations, which breaks the assumption that neighbors are correlated and increases mismatch between adjacent devices. · EECS 627 lecture packet · page 68</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p68-2.jpeg" alt="If the mask1 access transistor is stronger than the mask2 pull-up and pull-down on the same node, write gets easier but read stability gets worse." loading="lazy"><figcaption>If the mask1 access transistor is stronger than the mask2 pull-up and pull-down on the same node, write gets easier but read stability gets worse. · EECS 627 lecture packet · page 68</figcaption></figure>

**Challenge 2: dual CD population (slide 36).** Two inverters next to each other, one on mask 1 and one on mask 2, now draw Leff from two different distributions (two shifted Gaussians). This:

- **violates the assumption of spatial correlation** (adjacent devices used to match),
- **increases mismatch** between adjacent devices,
- **hurts SRAM robustness**, because the 6T cell is a ratioed circuit that depends on matching.

**SRAM walkthrough (slides 37–41).** In the 6T layout, each horizontal poly row holds three gates. The bottom row (A on the right side, plus the left inverter's N and P) is **mask 1 (red)**; the top row (A on the left side, plus the right inverter's P and N) is **mask 2 (blue)**. So on each storage node the access transistor comes from one mask and the cross-coupled inverter devices it fights come from the other.

Assume mask 1 prints shorter gates (lower Vth, **red stronger than blue**):

- **Write 0**: access A (red) ↑ strength, pull-up P it fights (blue) ↓ strength → **better write**.
- **Read 0**: access A (red) ↑ strength, pull-down N that must hold the node low (blue) ↓ strength → read bump grows → **worse read** (read disturb).

On the other side of the cell the roles reverse (weak access vs strong inverter: harder write, better read). Either way the cell is **skewed**, and the failure rate is set by its weaker side.

Recall the 6T ratios (added, standard): read stability needs **β = (W/L)PD / (W/L)AX > 1** (typically 1.5–2); writability needs the access device to beat the pull-up, **(W/L)AX / (W/L)PU > 1**. DPL moves both ratios in correlated, opposite directions.

<div class="co co-eq"><p class="co-t">Equation card</p>

Pitch-split DPL: two masks → two Leff means µ1 ≠ µ2. Adjacent-device mismatch now has a systematic term: ΔL = (µ1 − µ2) + random. Mismatch variance no longer cancels the global part because the two devices do not share it.
Memory trick: "same mask, same fate; different mask, different fate."

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam.) In single patterning, reticle-to-reticle laser intensity variation shifts all six transistors of a bitcell equally, so it does **not** cause bitcell failure; **RDF** (random, uncorrelated) does. Once the cell is double-patterned, laser/dose variation hits the two masks differently, so **both** RDF and laser intensity matter. If only NMOS vary, **read** failure gets worse: read depends on access + pull-down, which are on different masks, while write depends on access + PMOS, and the PMOS has no variation.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Coloring is now part of standard-cell design: cell boundary poly/M1 colors must be compatible on abutment, and the library is characterized per color assignment or with a color-aware derate. In a NOR ROM, the bitline pull-down transistors and the precharge/keeper come from different rows and may come from different masks; keeper vs n·Ioff and the sense margin must be checked with the mask-to-mask CD offset included.

</div>

**Layout restrictions (slide 42).** 65 nm planar: bidirectional features, varied gate dimensions and pitches. 32 nm planar: unidirectional, uniform gate dimensions, gridded. 16 nm FinFET: unidirectional on-grid layers, fin-quantized devices, aggressive DRC. Regularity is the price of printability.

### 7.7 The RET roadmap and random dopant fluctuation

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p69-1.jpeg" alt="Each node added a resolution trick: OPC at 180 nm, phase shift and scattering bars at 90 nm, immersion at 45 nm, double patterning at 32/22 nm, quad patterning at 12/10 nm, and EUV at 7/5 nm." loading="lazy"><figcaption>Each node added a resolution trick: OPC at 180 nm, phase shift and scattering bars at 90 nm, immersion at 45 nm, double patterning at 32/22 nm, quad patterning at 12/10 nm, and EUV at 7/5 nm. · EECS 627 lecture packet · page 69</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p69-2.jpeg" alt="Fewer dopant atoms per channel means σVth/µVth grows as Na^−0.6, so lowering doping makes relative variation worse unless HKMG helps." loading="lazy"><figcaption>Fewer dopant atoms per channel means σVth/µVth grows as Na^−0.6, so lowering doping makes relative variation worse unless HKMG helps. · EECS 627 lecture packet · page 69</figcaption></figure>

**RET / Leff summary:**

| Feature | Light | Technique |
|---|---|---|
| 180 nm | 248 nm | OPC |
| 90 nm | 193 nm | Phase shift masks, scattering bars |
| 45 nm | 193 nm | Immersion |
| 32, 22 nm | 193 nm | Double patterning |
| 12, 10 nm | 193 nm | Quad patterning / new immersion |
| 7, 5 nm | 13 nm | EUV |

**RDF.** Dopants are placed by ion implantation, a Poisson process. In a 50 nm channel there are only tens to hundreds of dopant atoms (the Intel chart shows the average number falling by orders of magnitude with node), so the count and position fluctuate visibly.

```latex
\sigma_{V_{th}} \propto N_a^{0.4}, \qquad \mu_{V_{th}} \propto N_a \quad\Rightarrow\quad \frac{\sigma_{V_{th}}}{\mu_{V_{th}}} \propto N_a^{-0.6}
```

- Smaller doping → **more relative variation**.
- **HKMG helps**: a metal gate sets Vth through work function, so channel doping can be reduced, and the thinner EOT reduces the Vth sensitivity to each charge.
- RDF is **within-die and spatially uncorrelated**: two transistors side by side see independent draws. That is why it dominates SRAM, sense-amp and latch mismatch.

Pelgrom's law (added, standard): mismatch between two identical devices falls with gate area,

```latex
\sigma_{\Delta V_{th}} = \frac{A_{V_t}}{\sqrt{W L}}
```

This is the quantitative form of the slide's advice "make devices larger" for uncorrelated variation. Doubling area cuts σ by √2 only, so it is an expensive fix.

### 7.8 Line edge roughness and stress

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p70-1.jpeg" alt="Line edge roughness makes L vary along the gate width, so the device leaks like its shortest slice and Ion/Ioff degrades." loading="lazy"><figcaption>Line edge roughness makes L vary along the gate width, so the device leaks like its shortest slice and Ion/Ioff degrades. · EECS 627 lecture packet · page 70</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p70-2.jpeg" alt="Channel stress depends on source/drain length and contact placement, so two devices with the same W and L can differ by up to ~15% (PMOS)." loading="lazy"><figcaption>Channel stress depends on source/drain length and contact placement, so two devices with the same W and L can differ by up to ~15% (PMOS). · EECS 627 lecture packet · page 70</figcaption></figure>

**LER.** Statistical photon count during exposure and the chemistry of the photoresist make the gate edge rough. L varies **along the width**; a device with average **Lactual = 55.5 nm** (vs **Lideal = 55 nm**, W = 2 µm) sits off the ideal Ioff/Ion curve. Because Ioff is exponential in local L, the short slices dominate leakage while Ion follows the average: **Ion/Ioff degrades**, and more so for shorter channels. Goal: high IDSAT, low ILEAK. LER is random and uncorrelated.

**Stress (slides 49–50).** As scaling's natural gains slowed, mobility was boosted with mechanical stress, which alters valence/conduction bands, carrier effective mass and scattering. Higher mobility = smaller delay **and** larger leakage. Desired stress:

| Axis | NMOS | PMOS |
|---|---|---|
| X (longitudinal) | Tensile | Compressive |
| Y (lateral) | Tensile | Tensile |
| Z (depth) | Compressive | Tensile |

Sources: shallow trench isolation (STI), embedded SiGe in PMOS source/drain, dual-stress nitride liner. In FinFET/GAA, liner techniques are no longer effective; strain engineering now relies on channel materials (SiGe, SiC) and epitaxy.

**Layout dependence (slide 51):**

- Longer active area (larger **LS/D**) → more SiGe, STI pushed away → more stress → higher IDSAT.
- Contacts away from the channel → more stress from the nitride; no contacts → even more.
- Two devices with identical W, L can differ by **up to ~15% (PMOS)**. This is a **systematic** variation and must be modeled (LOD / well-proximity style effects in the SPICE model, added).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A standard cell's transistor performance depends on what is next to it: diffusion breaks, cell-edge fillers and neighbors' active areas change stress. That is why libraries characterize with fixed boundary conditions and why a cell placed at a row end or next to a diffusion break can be slower than its .lib. In a ROM array, edge columns see different stress and lithography than the interior, which is why arrays use dummy rows/columns.

</div>

### 7.9 RTA, other fab effects, and the modeling chain

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p71-1.jpeg" alt="Local anneal temperature varies by more than 10 °C on 45 nm chips with layout pattern, and hotter anneal lowers Vth and Rext, raising both Ion and Ioff." loading="lazy"><figcaption>Local anneal temperature varies by more than 10 °C on 45 nm chips with layout pattern, and hotter anneal lowers Vth and Rext, raising both Ion and Ioff. · EECS 627 lecture packet · page 71</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p71-2.jpeg" alt="Variation mechanisms change physical parameters, which change electrical parameters, which change circuit performance, and one physical parameter hits several electrical ones." loading="lazy"><figcaption>Variation mechanisms change physical parameters, which change electrical parameters, which change circuit performance, and one physical parameter hits several electrical ones. · EECS 627 lecture packet · page 71</figcaption></figure>

**RTA (slides 53–54).** Rapid thermal anneal is used for steps with a low thermal budget (HKMG): poly activation, S/D junction and extension activation, side wall oxidation, STI liner oxidation. Because anneal times are now very short, the characteristic thermal length is **smaller than the die**, and the heat absorbed depends on the layout pattern's optical properties. Result: **>10 °C** local fluctuation on 45 nm chips. Higher local anneal temperature reduces **Vth** and **Rext** (stronger short-channel effects, more gate overlap of S/D, compensation of halo doping, higher dopant activation), giving higher Ion and much higher Ioff. RTA is **within-die but spatially correlated**.

**Wafer topography (slide 56).** Advanced nodes (FinFETs, CFETs) leave residual height differences after CMP; local height differences cause **uncorrectable focus errors**, so systematic CD variation. Tilting the wafer can compensate topography of a center reticle to a degree but not at the reticle corners.

**Wafer reflectivity (slide 57).** Reflections at the wafer–resist interface create standing waves, so effective exposure depends on resist thickness. CD swings **sinusoidally with resist thickness** (the swing curve, roughly 0.45–0.6 µm linewidth over 0.9–1.2 µm resist thickness on the slide).

**Etching (slide 59).** More etch time or ICP power → higher plasma density and ion flux → faster removal; small time/power variation changes etch rate and sidewall erosion, giving **random CD variation** across wafers and runs (slide shows 200 s vs 250 s, 230–350 W).

**Summary of effects (slide 60):**

- Metal thickness: CMP, metal density.
- Gate length Leff: OPC/OPE, phase shift / immersion / double patterning / focus / laser intensity.
- Doping: RDF, RTA, dose variation.
- Oxide thickness: temperature difference during growth.
- Mobility: layout-dependent stress, LER.

**The modeling chain (slide 61):** mechanism (CMP, OPC, RDF, LER, temperature) → physical parameter (CD, tox, doping, wire width/thickness) → electrical parameter (Isat, Cgate, Vth, Rwire, Cwire) → circuit metric (gate delay, slew, leakage power, wire delay). Example: poly flare + OPC → CD/Leff distribution → Idsat and Vth variation → a delay-vs-leakage scatter.

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam: three sources of Ioff variation.) RDF and RTA → Vth; lithography (OPE/OPC/phase shift/double patterning) → channel length; temperature fluctuation during oxide growth → tox. Do not list only "Vth"; the question wants the mechanism and the parameter it moves.

</div>

### 7.10 Classifying variation: systematic vs random, die-to-die vs within-die

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p72-1.jpeg" alt="Variation is systematic or random, random splits into die-to-die and within-die, and within-die splits into spatially correlated and uncorrelated, each with its own design fix." loading="lazy"><figcaption>Variation is systematic or random, random splits into die-to-die and within-die, and within-die splits into spatially correlated and uncorrelated, each with its own design fix. · EECS 627 lecture packet · page 72</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p72-2.jpeg" alt="A 130 nm wafer CD map shows smooth spatial correlation across the wafer plus a repeating within-reticle signature." loading="lazy"><figcaption>A 130 nm wafer CD map shows smooth spatial correlation across the wafer plus a repeating within-reticle signature. · EECS 627 lecture packet · page 72</figcaption></figure>

The taxonomy on slide 63 is the single most useful slide for an interview:

- **Systematic** (predictable from layout): **OPC, stress, CMP**. Note: sometimes treated as random because modeling it exactly is too expensive.
- **Random**:
    - **Die-to-die (global, inter-die)**: **laser intensity, etch rate, focus/dose**. Magnitude increases **reticles < wafers < lots < fabs**.
    - **Within-die (local, intra-die)**:
        - **Spatially correlated**: **RTA, etch rate**. Fix: **place related cells physically close** to each other.
        - **Spatially uncorrelated**: **LER, RDF**. Fix: **make devices larger**.
- **For better matching: make an exact copy of the layout** (same orientation, same neighbors, so systematic effects cancel).

Slide 62 shows the spatial hierarchy: fab-to-fab, lot-to-lot, wafer-to-wafer, die-to-die (inter-die mismatch: litho focus, edge, polishing) and within-die (intra-die mismatch: lens aberration, diffraction effects, random dopants). The 130 nm CD map (Cline et al., ICCAD 2006) and a 90 nm ring-oscillator frequency wafer map (slide 65, a radial center-to-edge pattern) show that variation is spatially smooth at the wafer scale, which is why nearby gates are correlated.

<div class="co co-core"><p class="co-t">Core idea</p>

Know which bucket a source lives in, because the fix differs. Global variation cancels in any differential or matched structure and is handled by corners or adaptive tuning; correlated local variation is handled by proximity; uncorrelated local variation only shrinks with device area.

</div>

### 7.11 Statistical timing: corners vs global MC vs local MC at a corner

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p73-1.jpeg" alt="For a 2-gate path with dnom=100, σd2d=10 and σwid=5, a full corner gives 290 and zero mismatch, while local Monte Carlo at the global corner gives 281 and a 3σ mismatch of 21." loading="lazy"><figcaption>For a 2-gate path with dnom=100, σd2d=10 and σwid=5, a full corner gives 290 and zero mismatch, while local Monte Carlo at the global corner gives 281 and a 3σ mismatch of 21. · EECS 627 lecture packet · page 73</figcaption></figure>

Setup: two gates, each with delay

```latex
d_{g,i} = d_{nom} + d_{d2d} + d_{wid,i}, \qquad d_{nom}=100,\; \sigma_{d2d}=10,\; \sigma_{wid}=5
```

Two metrics: **path delay** dp = dg1 + dg2 (setup-like) and **mismatch** dmm = dg1 − dg2 (skew, sense-amp offset, bitcell pair).

**1. Corner (FF/TT/SS).** Every gate is pushed to +3σ of both components, as scalars:

- dg1 = dg2 = 100 + 3·10 + 3·5 = **145**
- dp = 2·145 = **290**
- dmm = 145 − 145 = **0**

Corners are **pessimistic for path delay** (all local variation lined up in the same direction) and **optimistic, actually blind, for mismatch** (two identical scalars cannot mismatch).

**2. Global MC (as written on the slide).** Each gate is a random variable with σg = √(10² + 5²) = **11**; the slide adds the two gates as independent: σp = √(σg1² + σg2²) = **16**, 3σ point = 200 + 48 = **248**; σmm = **16**, 3σ mismatch = **48**.

**3. Local MC at the global corner.** Fix d2d at its +3σ value (a scalar), let only the local part vary: µg = 100 + 30 = **130**, σg = σwid = **5**; µp = **260**, σp = √(25 + 25) = **7**, 3σ point = **281**; µmm = 0, σmm = **7**, 3σ mismatch = **21**. This is the industry flow: global corner (SS/FF .lib) plus local variation (OCV/POCV or local MC).

**The correct correlated math (derived).** The die-to-die term is **the same draw for every gate on a die** (fully correlated), so it adds **linearly**; the within-die terms are independent and add as **root-sum-square**. For a path of N identical gates:

```latex
\mu_p = N\,d_{nom}, \qquad \sigma_p^2 = (N\,\sigma_{d2d})^2 + N\,\sigma_{wid}^2
```

```latex
d_{mm} = d_{wid,1} - d_{wid,2} \;\Rightarrow\; \sigma_{mm} = \sqrt{2}\,\sigma_{wid}
```

With the slide's numbers (N = 2): σp = √(20² + 2·5²) = √450 = **21.2**, so the 3σ path delay is 200 + 63.6 = **263.6**; σmm = √2·5 = **7.07**, so the 3σ mismatch is **21.2**, the same as the local-at-corner result, because global variation cancels in a difference. The slide's "global MC" row (σ = 16 for both) is what you get if d2d is (incorrectly) sampled independently per gate: it understates path variation and invents mismatch from global variation. The practice exam solution uses the correlated form (below).

<div class="co co-eq"><p class="co-t">Equation card</p>

Global (correlated) adds linearly: σ = N·σG. Local (independent) adds in quadrature: σ = √N·σL.
Path: σp² = (N·σG)² + N·σL². Difference of two paths: global cancels, σ² = (NA + NB)·σL².
Relative local variation σ/µ falls as 1/√N: deep paths average out local variation; short paths, clock skew and matched pairs do not.
Memory trick: "Global marches in step; local takes a random walk."

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

Never compute mismatch at a corner. Corners set all instances to the same value, so offset, skew and bitcell imbalance come out zero. Mismatch must come from local statistics (local MC or a POCV/LVF sigma per arc).

</div>

**Worked practice-exam problem (Problem 5).** Clock network: launch flop clocked directly, capture flop clocked through two clock inverters (Inv11, Inv12). Logic = 10 inverters. Each inverter: µ = 50 ps, σG = 10 ps, σL = 5 ps (independent). Flops: tC-Q = 100 ps, setup = 15 ps, hold = 100 ps, no variation.

- Skew = Dinv11 + Dinv12. Setup: Tclk = tC-Q + 10 Dinv + tsu − 2 Dinv(clk) → 8 net inverters of global. Hold: Dlogic,min = thold + 2 Dinv(clk) − tC-Q.

| Case | Skew 3σ | Min Tclk (setup) | Min logic delay (hold) |
|---|---|---|---|
| (A) D2D only | µ 100, σ 2·10 = 20 → **160 ps** | µ 515, σ 8·10 = 80 → **755 ps** | µ 100, σ 20 → **160 ps** |
| (B) Local MC at +3σ D2D corner | µ 160, σ √(2·25) ≈ 7 → **181 ps** | µ 755, σ √(12·25) = 17.3 → **806.9 ps** | µ 160, σ ≈ 7 → **181 ps** |
| (B+) Full MC, both random | µ 100, σ √(20² + 2·25) = 21.2 → **163.6 ps** | µ 515, σ √(80² + 12·25) = 81.9 → **760.5 ps** | µ 100, σ 21.2 → **163.6 ps** |

Lessons: (1) global variation of the clock inverters **cancels** against the global variation of the logic (8 net, not 12); local variation does not cancel (all 12 contribute, √12). (2) Stacking a 3σ global corner and then a 3σ local excursion (B) is pessimistic vs the true joint 3σ point (B+): 806.9 vs 760.5 ps. (3) Adding a second identical path: with D2D only, the mean and σ of fmax do not change (paths are identical); with WID only, the **mean fmax drops** (fmax = min over paths, i.e. the max of two delays) and the σ of fmax **shrinks**.

**High-sigma (added).** For a memory or ROM, the relevant statistic is not one path at 3σ but the worst of millions of cells. One-sided Gaussian tails: 3σ ≈ 1.3e-3, 4σ ≈ 3.2e-5, 5σ ≈ 2.9e-7, 6σ ≈ 1e-9. A 1 Mb array with a target of fewer than ~1e-3 failing arrays needs per-cell failure below ~1e-9, i.e. **~6σ** margin on the bitcell. Plain MC would need ~1e10 samples to see a few failures, so designers use importance sampling, statistical blockade or extrapolation. The expected worst of N independent Gaussian samples is roughly µ + σ·√(2 ln N) (≈ 5.3σ for N = 1e6). Global variation does not get the √(2 ln N) penalty, only local does, which is why bitcell, sense-amp and keeper analyses are local-at-corner.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

This is the math behind .lib statistical data: AOCV derates shrink with depth (√N averaging), and POCV/LVF stores a σ per arc so STA can RSS local variation along a path while applying global variation through the corner. For a NOR ROM bitline, the keeper must hold against the leakage of up to n off cells: global Vth shift moves all n·Ioff together (linear), the local part of the sum averages, but the single on-cell discharge current and the sense-amp offset are local quantities that must be checked at ~6σ.

</div>

### 7.12 Operating context: supply and temperature

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p74-1.jpeg" alt="Supply varies within the die through IR drop in the resistive grid and L·di/dt droop through package inductance." loading="lazy"><figcaption>Supply varies within the die through IR drop in the resistive grid and L·di/dt droop through package inductance. · EECS 627 lecture packet · page 74</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p74-2.jpeg" alt="Activity creates temperature hot spots, with up to 30.3 °C rise on a processor, which shift speed and leakage locally." loading="lazy"><figcaption>Activity creates temperature hot spots, with up to 30.3 °C rise on a processor, which shift speed and leakage locally. · EECS 627 lecture packet · page 74</figcaption></figure>

**Voltage.** The supply network is PCB → package → chip wires, with decoupling caps along the way.

- **IR drop**: static/average drop through the resistive on-chip grid (simulated ASIC map shows the % VDD variation peaking in high-current regions far from bumps).
- **L·di/dt drop**: transient droop from package inductance when current changes quickly (measured on a dual-core Itanium 2).

**Temperature.** Hot spots form in high-activity units (FPU, issue logic) and differ by workload (worst-case power vs OS boot); the measured profile has a **max of 30.3 °C** rise. Temperature lowers mobility (slower at high T) and raises leakage exponentially; at low VDD, **temperature inversion** can make cold the slow corner (added).

These are **worst-case** quantities in the uncertainty table (7.2): they set the V and T of the signoff corner.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Cells are characterized at VDD minus a budgeted IR drop and at Tmin/Tmax. ROM and register-file arrays draw large synchronized currents on wordline/precharge edges, so local L·di/dt and IR drop in the array's grid add directly to the access-time margin. Voltage-sensitive arcs (low VDD near threshold) need the droop included in the corner.

</div>

### 7.13 Aging: NBTI, HCI, TDDB

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p75-1.jpeg" alt="Broken Si–H bonds at the interface cause NBTI and hot-carrier degradation, broken Si–O bonds cause TDDB, and drive current drops within months." loading="lazy"><figcaption>Broken Si–H bonds at the interface cause NBTI and hot-carrier degradation, broken Si–O bonds cause TDDB, and drive current drops within months. · EECS 627 lecture packet · page 75</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p75-2.jpeg" alt="NBTI ΔVth and ΔIDS grow with stress time, and with scaling ΔVth in mV falls while the percentage Ion loss rises." loading="lazy"><figcaption>NBTI ΔVth and ΔIDS grow with stress time, and with scaling ΔVth in mV falls while the percentage Ion loss rises. · EECS 627 lecture packet · page 75</figcaption></figure>

Aging is variation **in time**: "initially" vs "a few months later" the drain current curves for VG1 and VG2 have dropped.

- **Broken Si–H bonds** at the Si/SiO2 interface → interface traps → **NBTI** and **hot carrier degradation (HCD/HCI)**.
- **Broken Si–O bonds** in the oxide bulk → **TDDB**.

**NBTI (Negative Bias Temperature Instability).** Mechanism (standard): a **PMOS** with its gate at a negative bias relative to source (Vgs = −VDD, i.e. input low, PMOS on), at elevated temperature, breaks Si–H bonds; hydrogen diffuses away and leaves positive interface charge, so |Vth| rises and Ion falls. Slide data: pMOSFET, tox = 1.5 nm, A = 10 µm × 10 µm, **Vg = −1.5 V, T = 125 °C**: ΔVth and ΔIDS rise steeply at first then saturate (power-law in time, ΔVth ∝ t^n with n ≈ 0.16–0.25, added). Partial **recovery** happens when the stress is removed, so the effective shift depends on duty cycle (added).

Scaling trend (Cao et al., DAC 2006): from 130 nm to 32 nm, **ΔVth decreases**, but **ΔIDS (%) increases**, because VDD − Vth (overdrive) shrinks faster, so each mV of shift costs more current.

- **FinFET**: NBTI got worse or stayed flat: fin sidewalls have different crystal orientations from planar (100) surfaces, with more Si–H bonds and more interface trap generation.
- **GAA**: improved or flat, because the crystal orientation gives less interface trap generation.

**HCI (hot carrier injection/degradation)** (standard): carriers accelerated by high lateral field near the drain during switching get injected into the oxide or create interface traps near the drain. It mainly hits **NMOS**, happens **only during transitions** (Vds high while current flows), so it scales with **activity × frequency** and slew.

**TDDB** (standard): defects accumulate in the gate oxide under field until a percolation path forms (soft then hard breakdown), raising gate leakage and eventually shorting the gate. It depends on oxide field and temperature, so it sets the maximum VDD for a given oxide (and limits overdrive in level shifters and I/O).

<div class="co co-eq"><p class="co-t">Equation card</p>

NBTI: PMOS, Vgs = −VDD, high T, DC-like stress, ΔVth ∝ t^n (n ≈ 0.2), partial recovery. Static: depends on duty cycle (signal probability), not toggle rate.
HCI: mostly NMOS, during switching, ∝ activity × f, worse with slow input slew and high VDD.
TDDB: oxide field + T; sets max VDD.
Memory trick: "NBTI hates idle PMOS; HCI hates busy NMOS; TDDB hates high field."

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

A clock gated off with its PMOS held on (input low) ages under NBTI asymmetrically: one edge slows and the other does not, so duty cycle and pulse width drift. Likewise an SRAM cell holding the same data for years ages one PMOS only, which skews the cell toward its stored value and degrades write margin for the opposite value (and read SNM). Aging-aware sign-off uses the actual signal probability per pin.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Libraries are now characterized "aged" (end-of-life Vth shifts per device, based on a mission profile of V, T and duty cycle). For flip-flops, NBTI on the clock and master/slave keepers moves setup/hold and C-Q. For ROM: precharge PMOS sit on (gate low) between accesses and age under NBTI, weakening precharge and the keeper; the keeper/n·Ioff balance must hold with an aged keeper and the worst-case leakage. Level shifters with large input-to-supply ratios see high oxide fields (TDDB) and asymmetric stress.

</div>

### 7.14 Electromigration

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p76-1.jpeg" alt="Electromigration fails where metal flux divergence occurs: more atoms in than out piles up into hillocks and shorts, and more out than in leaves voids and opens." loading="lazy"><figcaption>Electromigration fails where metal flux divergence occurs: more atoms in than out piles up into hillocks and shorts, and more out than in leaves voids and opens. · EECS 627 lecture packet · page 76</figcaption></figure>

**Mechanism.** Electron current pushes metal ions ("electron wind"). Along a uniform line, flux in = flux out and nothing changes. Failure happens where **flux diverges**: at grain boundaries, vias, width or thickness changes.

- **fluxin = fluxout**: steady state, no damage.
- **fluxin > fluxout**: atoms accumulate → **hillock / extrusion** → **short** to a neighbor.
- **fluxin < fluxout**: atoms depleted → **void** → **open** (resistance rises then the line breaks).

Slide points:

- **Particularly sensitive to DC (unidirectional) currents**; bidirectional (AC) current partially heals because ions move back and forth.
- **High DC current + thin metal → dangerous**: "the chip would die in minutes after power-ON."

Standard lifetime model (added): **Black's equation**,

```latex
\text{MTTF} = A\,J^{-n}\,e^{E_a/(kT)}, \qquad n \approx 2
```

so lifetime falls with current density squared and exponentially with temperature. Short lines below the **Blech length** (J·L below a critical product) are immune because back-stress balances the wind (added). Foundry EM rules give limits on **average** current density (DC/unidirectional EM), **RMS** current (Joule self-heating) and **peak** current, per layer, width and via count, and derated by temperature.

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam: why are power grid wires more susceptible to EM than signal nets?) Answer: (1) high current density, (2) the current is **unidirectional** (DC), so there is no healing, (3) changes in wire width/thickness (and vias) create flux divergence. Signal wires carry bidirectional current and are limited mostly by RMS/peak rules.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Inside a standard cell, the output pin and the internal power rails/vias carry the cell's switching current, and high-drive cells (X16 buffers, clock drivers) can violate signal-EM (RMS/peak) limits at high frequency and load; libraries publish EM-limited max frequency or max load per pin. Power rails in cell rows, ROM/SRAM array VDD/VSS straps and the precharge supply carry unidirectional current and need DC EM checks plus IR drop analysis on the thinned (CMP-eroded) cross-section. The ROM bitline itself sees mostly one-way discharge current per access, so check average current at the column mux and sense-amp vias.

</div>

### 7.15 Summary

From slide 79:

- **PVT**, with a focus on **P**: random, systematic and spatial.
- Trends: smaller geometries → worse process variability (physical limits, manufacturing challenges); lower voltages → more sensitivity to Vth fluctuations and temperature gradients.
- Result: **design for variability** and **statistical STA**.
- Next lecture: **adaptivity** (post-silicon tuning, body bias, AVFS, canaries), which attacks global and slow variation that static margins handle poorly.

<div class="co co-core"><p class="co-t">Core idea</p>

Margin = global corner + local statistics + environment (V, T) + aging + model/extraction error. Global adds linearly and cancels in matched structures; local adds in quadrature and dominates mismatch and high-sigma arrays; aging and EM are time-dependent and set by mission profile.

</div>

### 7.x Check yourself

1. **(Exam 1, P3A) What does CMP stand for, which chip elements does it impact and how, and which foundry design rule results from it?** — Chemical Mechanical Polishing. It changes the metal dimensions (thickness, through dishing of wide lines and erosion of dense regions), which changes the electric field and therefore the **coupling capacitance and ground capacitance** (and wire resistance). The resulting rule is the **metal density** rule (min/max density per window, enforced with fill).
2. **(Exam 1, P3B) List three manufacturing uncertainties that cause Ioff variation and how.** — (1) **RDF and RTA** change Vth. (2) Lithography-induced uncertainty (**OPE/OPC, phase shift masks, double patterning**) changes the channel length. (3) **Temperature fluctuation during oxide growth** changes oxide thickness. Each enters Ioff exponentially through Vth, which is why leakage spreads 20X while frequency spreads 30%.
3. **(Exam 1, P4A/B) A 6T SRAM sees RDF and reticle-to-reticle laser intensity variation (which moves gate length). Which causes bitcell failure with single patterning, and with double patterning?** — Single patterning: **RDF**, because laser intensity shifts all six transistors the same way and the cell fails on mismatch. Double patterning: **both**, because laser intensity now differs for the odd and even (mask 1 vs mask 2) transistors, so it creates mismatch inside the cell.
4. **(Exam 1, P4C) If only NMOS vary, does single → double patterning hurt read or write more?** — **Read.** Read is set by access + pull-down, which sit on separate patterning steps, so they now mismatch. Write is set by access + pull-up, and the PMOS has no variation, so write only sees the NMOS's own variation.
5. **(Exam 1, P5A) Clock network: launch flop clocked directly, capture flop through two clock inverters; logic = 10 inverters; each inverter µ = 50 ps, σG = 10 ps, σL = 5 ps; tC-Q = 100, setup = 15, hold = 100 ps (no variation). With die-to-die only, give the 3σ skew, min clock period and min logic delay for hold.** — Skew = 2Dnom + 2Dd2d: µ = 100, σ = 20 → **160 ps**. Tclk = tC-Q + tsu + 10Dinv − 2Dinv: µ = 100 + 15 + 8·50 = 515, σ = 8·10 = 80 → **755 ps**. Hold: Dlogic = thold + 2Dinv − tC-Q: µ = 100, σ = 20 → **160 ps**. Global cancels between clock and data paths, leaving 8 net inverters.
6. **(Exam 1, P5B and B+) Now add σL = 5 ps: (B) local MC at the +3σ die-to-die corner; (B+) full MC with both random.** — (B): skew µ = 160, σ = √(2·25) ≈ 7 → **181 ps**; Tclk µ = 515 + 24·10 = 755, σ = √(12·25) = 17.3 → **806.9 ps**; hold µ = 160, σ ≈ 7 → **181 ps**. (B+): skew σ = √(20² + 2·5²) = 21.2 → **163.6 ps**; Tclk σ = √(80² + 12·25) = 81.9 → 515 + 3·81.9 = **760.5 ps**; hold → **163.6 ps**. Local variation does not cancel (all 12 inverters count, in quadrature), and stacking a 3σ global corner on a 3σ local excursion (B) is pessimistic versus the true joint 3σ point (B+).
7. **(Exam 1, P5C) Add a second identical logic path. How do the mean and σ of fmax change under die-to-die only, and under within-die only?** — D2D only: mean **same**, σ **same** (the two paths are identical, so they are the same path). WID only: mean fmax **reduces** (fmax = min of the two path frequencies, the max of two delays), and σ **reduces** (the max of two partially correlated distributions is narrower).
8. **Contrast NBTI, HCI and EM, and say why power grid wires are more EM-prone than signal wires.** — NBTI: PMOS under negative gate bias at high T, Si–H bond breaking, set by duty cycle, partially recovers; ΔVth in mV falls with scaling but ΔIon(%) rises. HCI: mostly NMOS, only during switching, scales with activity × frequency. Power grid EM: high current density, **unidirectional DC** current with no healing, and width/thickness/via changes that create flux divergence.


## Lecture 8 — Adaptive Design

Lecture 7 showed that static worst-case margins for process, voltage, temperature, aging and noise stack into an unrealistic guardband. This lecture asks how a chip can measure its own condition and tune voltage, frequency or body bias to remove that guardband: design-time DVFS tables, post-silicon tables, canary (replica) circuits, in-situ delay monitors, and the "let fail and correct" Razor flip-flops. For a circuit designer at a GPU company this is the logic behind AVFS fuse tables, critical-path monitors and droop detectors, and it changes what a standard-cell, flop or memory designer must guarantee: which margin is still static, and which is now taken away by the adaptive loop.

### 8.1 Adapt to what? Classifying variation by speed and reach

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p79-1.jpeg" alt="DVFS adapts to workload, while AVFS adapts to process, voltage, temperature and aging, and many techniques do both at once." loading="lazy"><figcaption>DVFS adapts to workload, while AVFS adapts to process, voltage, temperature and aging, and many techniques do both at once. · EECS 627 lecture packet · page 79</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p79-2.jpeg" alt="Variations range from extremely slow (process, aging, months) to slow (temperature, package VDD, seconds to ms) to fast (IR drop, jitter, coupling, ns), and slower ones are easier to address." loading="lazy"><figcaption>Variations range from extremely slow (process, aging, months) to slow (temperature, package VDD, seconds to ms) to fast (IR drop, jitter, coupling, ns), and slower ones are easier to address. · EECS 627 lecture packet · page 79</figcaption></figure>

Four things a chip can adapt to:

- **Workload**: performance needs vary and tasks finish at different times. Lower F, then lower V, then P drops. This is **DVFS** (dynamic voltage and frequency scaling).
- **Process**: fast, slow, typical silicon (P).
- **Environment**: voltage and temperature (V, T).
- **Aging**: NBTI and TDDB.

The last three are **AVFS** (adaptive voltage and frequency scaling), the focus of this lecture.

The temporal axis (slide 3) is the key organizing idea:

| Rate | Examples | Time scale |
|---|---|---|
| Extremely slow | Process variation, aging, lifetime degradation | months to days |
| Slow | Ambient temperature, hot spots, package/board VDD fluctuation, L·di/dt drop | s to ms (to µs) |
| Fast | IR drop, PLL jitter, coupling noise | µs to ns |

The arrow "easier to address" points to the slow end: a control loop can only remove a margin if it reacts faster than the variation changes.

<div class="co co-core"><p class="co-t">Core idea</p>

An adaptive loop removes the margin for any variation it can **sense** (same physics, same location) and **out-run** (faster loop than the variation). Everything else still needs a static margin.

</div>

### 8.2 Why margins hurt: stacking and the low-power conflict

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p80-1.jpeg" alt="Static margins (process, aging), dynamic margins (V, T, noise) and safety margins (model uncertainty) stack on top of the point of first failure, costing power and closure effort." loading="lazy"><figcaption>Static margins (process, aging), dynamic margins (V, T, noise) and safety margins (model uncertainty) stack on top of the point of first failure, costing power and closure effort. · EECS 627 lecture packet · page 80</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p80-2.jpeg" alt="Summing 3σ delay impacts of eleven mechanisms gives 129% of delay, a very conservative and unrealistic guardband." loading="lazy"><figcaption>Summing 3σ delay impacts of eleven mechanisms gives 129% of delay, a very conservative and unrealistic guardband. · EECS 627 lecture packet · page 80</figcaption></figure>

**Margin stack (slide 4).** Start from the **point of first failure (PoFF)**, the lowest VDD (or highest f) where this die on this workload actually works. On top of it the designer adds:

- **Static margins**: process + aging.
- **Dynamic margins**: V, T, noise.
- **Safety margins**: uncertainty in models and calibration.

The timing picture: Tcrit plus temperature, process, signal integrity, voltage and delay-model margins gives **Tmargins**, which is what Fmax, yield, VDD and power are signed off at. Accumulating independent worst cases leads to unrealistic constraints: large power/performance overhead and difficult design closure.

**Delay impact of margins (slide 5, Bernstein, IBM J. R&D).** 3σ delay impact by mechanism and time constant:

| Time domain (s) | Mechanism | 3σ delay impact |
|---|---|---|
| 10¹² | Inter-die process (litho node) | 20% |
| 10⁹ | Electromigration | 5% |
| 10⁸ | Hot-electron effect | 5% |
| 10⁶ | NBTI | 15% |
| 10⁴ | Electrical mean variation | 15% |
| 10⁻¹ | Across-chip Lpoly | 15% |
| 10⁻⁴ | Temperature hot spots | 12% |
| 10⁻⁸ | SOI history effect | 10% |
| 10⁻¹⁰ | Supply voltage | 17% |
| 10⁻¹⁰ | Line-line coupling | 10% |
| 10⁻¹¹ | Residual S/D charge | 5% |
| | **Linear sum** | **129%** |

Linear summation assumes all mechanisms are at their 3σ worst simultaneously, which is why it is "very conservative, unrealistic". Independent sources would combine closer to root-sum-square (added): √(Σ xi²) ≈ 42% for the same table.

<div class="co co-eq"><p class="co-t">Equation card</p>

Linear stacking: margin = Σ 3σi (assumes all worst at once).
RSS for independent sources (added): margin = √(Σ (3σi)²).
Aging alone (NBTI + HCI + EM) is 25% on the slide's table, which is why aging-aware sign-off matters.

</div>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p81-1.jpeg" alt="Variations sit on a grid of spatial reach (global vs local) and temporal rate (extremely slow, slow, fast), and each adaptive technique covers a different part of the grid." loading="lazy"><figcaption>Variations sit on a grid of spatial reach (global vs local) and temporal rate (extremely slow, slow, fast), and each adaptive technique covers a different part of the grid. · EECS 627 lecture packet · page 81</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p81-2.jpeg" alt="Low-power design fights robustness because low VDD raises Vt sensitivity and power optimization creates a wall of near-critical paths." loading="lazy"><figcaption>Low-power design fights robustness because low VDD raises Vt sensitivity and power optimization creates a wall of near-critical paths. · EECS 627 lecture packet · page 81</figcaption></figure>

**The 2D grid (slide 6)** is reused for every technique and in the exam:

| | Extremely slow (static) | Slow-changing (dynamic) | Fast-changing (dynamic) |
|---|---|---|---|
| **Global** | Inter-die process (D2D); lifetime degradation (NBTI, TDDB) | Package/die VDD fluctuations; ambient temperature | PLL jitter; IR drop |
| **Local** | Intra-die process (WID) | Temperature hot spots | IR drop; coupling noise (capacitive and L·di/dt); local clock jitter (IR drop in clock tree) |

**Low power vs robustness (slide 7).**

- Low-voltage operation (DVS, subthreshold) reduces static noise margins, and **sensitivity to Vt variation increases at low voltage**.
- Power optimization (downsizing, high-Vt swap on non-critical paths) **equalizes path delays**: the path-delay histogram becomes a wall just below fmax, so many paths are near-critical and the probability that some path exceeds the timing constraint goes up.
- Robust low-power circuits then need more margin (higher VDD, larger devices), which gives the power back. Adaptive design is the escape from this loop.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

A library that enables aggressive power recovery (many Vt flavors, fine drive steps) produces exactly the "wall of critical paths" the slide warns about. Statistically, the max of many near-critical paths has a higher mean (Lecture 7, two-path problem), so the .lib local-variation data (LVF/POCV) and low-VDD characterization accuracy become the limiting factor.

</div>

### 8.3 DVFS: design-time tables and safe switching

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p81-3.jpeg" alt="To stay safe, always raise voltage before raising frequency and lower frequency before lowering voltage." loading="lazy"><figcaption>To stay safe, always raise voltage before raising frequency and lower frequency before lowering voltage. · EECS 627 lecture packet · page 81</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p81-4.jpeg" alt="Intel SpeedStep on XScale (0.18 µm) ran 800 MHz at 1.65 V and 900 mW down to 200 MHz at 0.75 V and 50 mW, switching frequency by slow PLL relocking." loading="lazy"><figcaption>Intel SpeedStep on XScale (0.18 µm) ran 800 MHz at 1.65 V and 900 mW down to 200 MHz at 0.75 V and 50 mW, switching frequency by slow PLL relocking. · EECS 627 lecture packet · page 81</figcaption></figure>

**DVFS (slide 9).** Adapt frequency to workload demand: software controls speed, lowers f when predicted demand is low, and adapts V to **match** f. The V/f pairs come from a **pre-silicon** look-up table generated at design time and stored once for all processors (ROM). First examples: AMD PowerNow, ARM IEM, IBM DPM, Intel SpeedStep / Enhanced SpeedStep, Transmeta LongRun/LongRun2.

**Safe sequencing (slide 10).** Frequency must never exceed what the present voltage supports:

- Going up: **increase V first**, wait for it to settle, then raise f.
- Going down: **decrease f first**, then lower V.

**SpeedStep numbers.** 1.65 V / 800 MHz / 900 mW; 1.3 V / 600 MHz / 450 mW; 0.75 V / 200 MHz / 50 mW. From 800 to 200 MHz, f drops 4X but power drops 18X, because P ∝ C·V²·f and V also drops (1.65 → 0.75 V gives (1.65/0.75)² ≈ 4.8X).

```latex
P_{dyn} = \alpha C V_{DD}^2 f, \qquad \frac{900\text{ mW}}{50\text{ mW}} = 18 \approx 4 \times 4.8
```

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p82-1.jpeg" alt="IBM DPM avoids slow PLL relocking by running the PLL at fixed frequency and selecting divided clocks with a glitch-free mux, with VDD scaled externally from 0.9 to 1.95 V." loading="lazy"><figcaption>IBM DPM avoids slow PLL relocking by running the PLL at fixed frequency and selecting divided clocks with a glitch-free mux, with VDD scaled externally from 0.9 to 1.95 V. · EECS 627 lecture packet · page 82</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p82-2.jpeg" alt="Design-time DVFS tables address none of the process, environmental or aging variations, because one table is used for every die." loading="lazy"><figcaption>Design-time DVFS tables address none of the process, environmental or aging variations, because one table is used for every die. · EECS 627 lecture packet · page 82</figcaption></figure>

**IBM DPM (2002, Nowka JSSC).** LDO-powered PLL on a constant 1.0 V supply; core supply VDVFS = **0.9–1.95 V**, set externally; software picks f and V. A **level shifter** moves the PLL clock into the variable core domain, then a clock divider and a **glitch-free (hazard-free) MUX** select the frequency, avoiding PLL relock time.

**Glitch-free MUX (slides 13–14).** A plain AND-OR mux, c·f1 + c̄·f2, can glitch when c changes while f1 = f2 = 1 (the classic static-1 hazard: one AND term turns off before the other turns on). Adding the consensus term **f1·f2** (the "added for glitch-free" gate) holds fout = 1 through the transition. For switching between f1 and f1/2, the control is resynchronized by a flop so the switch happens only when **both clocks are all '1' or all '0'**, so no runt pulse is created.

<div class="co co-guard"><p class="co-t">Common trap</p>

A design-time DVFS table addresses **none** of the variations on the grid (slide 16). It is pure workload adaptation: every die gets the same worst-case V for a given f. Exam phrasing: DVFS = workload adaptation; AVFS = process and environmental adaptation.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

DVFS means every cell, flop and memory must work and be characterized across a voltage range, not one corner: .lib sets at several VDD points, level shifters on every domain crossing (as in the IBM DPM PLL path), and SRAM/ROM sense timing that tracks logic across V. A clock mux cell must be glitch-free by construction, which is why libraries ship dedicated clock-mux and clock-gating cells.

</div>

### 8.4 AVFS and post-silicon look-up tables

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p83-1.jpeg" alt="AVFS gives each die, and each moment of its life, its own operating point, and needs a sensor, a knob and an algorithm." loading="lazy"><figcaption>AVFS gives each die, and each moment of its life, its own operating point, and needs a sensor, a knob and an algorithm. · EECS 627 lecture packet · page 83</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p83-2.jpeg" alt="Post-silicon tester tables address only variations fixed for the chip&#x27;s lifetime, both global and local process." loading="lazy"><figcaption>Post-silicon tester tables address only variations fixed for the chip&#x27;s lifetime, both global and local process. · EECS 627 lecture packet · page 83</figcaption></figure>

**AVFS (slide 18).** Adjust V and f to process and environmental conditions:

- Instead of one operating point for all dies, use **different operating points per die**.
- Use **multiple operating points dynamically** over one die's life.
- Remove worst-case margins for better energy efficiency and performance.

Three requirements:

1. **SENSE**: performance/environment monitors (canaries, temperature sensors, in-situ measurements).
2. **KNOB**: frequency, supply voltage, body bias.
3. **ALGORITHM**: guarantee correct operation.

Two families (slide 19):

- **"Always correct"**: look-up tables, canary circuits, in-situ delay detection. Never fail; keep some margin.
- **"Let fail and correct"**: self-calibrating circuits tune until the point of failure, need a **recovery mechanism**, and remove margins for both global and local variation.

**Look-up table AVFS (slides 20–23).** Same as DVFS, but the table is **post-silicon**, generated on the tester, different for every chip.

- Advantages: very easy to design and deploy; exploits low-utilization epochs through DVFS; **addresses fixed WID variation (RDF, LER, …)**, because the tester measures the real critical path of that die, including its local variation.
- Disadvantages: only static variation (global and local process); worst-case margins for everything else (aging, V, T, noise); tester calibration across many frequency points is costly; must find and run worst-case vectors.

<div class="co co-core"><p class="co-t">Core idea</p>

A per-die table measures the truth for that die at test time, so it captures both D2D and WID process variation. It cannot see anything that happens after test: aging, temperature, droop.

</div>

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam P6.) Add a temperature sensor and three tester tables at −20, 25 and 85 °C. Now the tables also address **ambient temperature**, besides both process variations. They still do not address lifetime degradation, package effects, hot spots, or any fast-changing variation. At a sensor reading between table temperatures (e.g. 40 °C), pick the **worse** neighbor: above Vt that is the **hotter** table (mobility dominates, hot is slow); **below Vt pick the colder table** (Vt rise dominates, cold is slow). This is **temperature inversion** (added explanation): at low VDD the delay sensitivity to Vt, which rises as T falls, outweighs mobility loss.

</div>

### 8.5 Canary circuits: critical-path replicas and ring oscillators

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p84-1.jpeg" alt="A critical path replica is launched every reference cycle, and if its output arrives before the reference-clock sample the counter steps VDD down, otherwise up, so VDD settles where the replica just meets fref." loading="lazy"><figcaption>A critical path replica is launched every reference cycle, and if its output arrives before the reference-clock sample the counter steps VDD down, otherwise up, so VDD settles where the replica just meets fref. · EECS 627 lecture packet · page 84</figcaption></figure>

**Kuroda et al. (JSSC 1998), 0.4 µm.** The delay through a replica of the critical path sets the supply the processor runs at for a given frequency (fext).

Operation (from the timing diagram):

- A toggle flop launches a transition into the **critical path replica (CPR)** every fref cycle.
- At the next edge, two flops sample: **QCPR** (the CPR output) and **Qref** (the undelayed signal, a reference that always has the "correct" value).
- An XOR compares them. If the CPR output arrived in time, QCPR = Qref and the up/down counter counts **down** (lower VDD). If it was late, they differ and the counter counts **up**.
- The counter drives a **DC/DC converter** that sets Vcore; the loop dithers around the voltage where the replica delay equals one fref period. A frequency pick block chooses fcore.

This **eliminates the margin for global process variation** (and slow global V, T, aging, which the replica sees too).

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p84-2.jpeg" alt="A tunable ring oscillator that tracks the critical path runs in a closed loop that adjusts the supply until the desired frequency is reached, saving 11% to 78% energy." loading="lazy"><figcaption>A tunable ring oscillator that tracks the critical path runs in a closed loop that adjusts the supply until the desired frequency is reached, saving 11% to 78% energy. · EECS 627 lecture packet · page 84</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p84-3.jpeg" alt="TI SmartReflex (45 nm) combines adaptive body bias (FBB for speed, RBB for leakage), DVFS and AVS, with modes that cut power to well below baseline." loading="lazy"><figcaption>TI SmartReflex (45 nm) combines adaptive body bias (FBB for speed, RBB for leakage), DVFS and AVS, with modes that cut power to well below baseline. · EECS 627 lecture packet · page 84</figcaption></figure>

**Burd et al. (JSSC 2002)**, 0.6 µm, 7.5 × 9 mm², 1.5M transistors: tunable **ring oscillator** tracks the processor critical-path delay; count and compare with the desired frequency, and the DC/DC adjusts Vcore until the ring runs at fcore. **11% to 78% energy savings** over no voltage/frequency scaling.

**Akui et al. (JSSC 2004), Sony PDA processor**, 0.18 µm eDRAM, **0.9–1.6 V, 8–123 MHz**: a DFC block picks frequency, a critical path monitor sets voltage, and a clock-thinning circuit gives **0.5 MHz** frequency steps.

**TI SmartReflex (Gammie, ISSCC 2008), 45 nm.** Power management by modes: High perf. (FBB + AVS), Mid and Low perf. (AVS + DVFS + RBB), No computation (AVS, DVFS, RBB, power-down). Body bias plot: forward bias up to ~+300–400 mV raises performance to ~125%; reverse bias down to ~−300 mV and below cuts leakage to below 75%.

<div class="co co-eq"><p class="co-t">Equation card</p>

Body effect (added, standard): Vt = Vt0 + γ(√(2φF + VSB) − √(2φF)).
RBB (VSB > 0 for NMOS) raises Vt and cuts leakage exponentially; FBB lowers Vt and speeds up, at the cost of leakage and junction current. Body-bias effectiveness shrinks in FinFET (thin, undoped fin), which is why it survives mainly in FD-SOI (added).

</div>

### 8.6 Why canaries need margin: mistracking, local variation, fast changes

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p85-1.jpeg" alt="A canary only tracks the real critical path across voltage approximately, and since the real critical path depends on the instruction, multiple canaries are needed to reduce the margin." loading="lazy"><figcaption>A canary only tracks the real critical path across voltage approximately, and since the real critical path depends on the instruction, multiple canaries are needed to reduce the margin. · EECS 627 lecture packet · page 85</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p85-2.jpeg" alt="IBM Power6 uses 24 critical-path monitors with a time-to-digital converter that reads timing slack as a thermometer code and models Fmax across voltage within 3 FO2 delays." loading="lazy"><figcaption>IBM Power6 uses 24 critical-path monitors with a time-to-digital converter that reads timing slack as a thermometer code and models Fmax across voltage within 3 FO2 delays. · EECS 627 lecture packet · page 85</figcaption></figure>

Three sources of canary margin (slide 36): **(1) mistracking, (2) local variation, (3) fast-changing variation.**

**#1 Mistracking.** Ideal: the canary (CPM) delay vs V curve sits just above the core critical path everywhere. Actual: the core critical path is not one path; it **depends on the instruction**, and different paths (wire-dominated, gate-dominated, stacked, different Vt) scale differently with V and T. The curves cross, so a single canary fails at some voltages unless a big margin is added. Fix: **multiple CPMs** of different composition, take the worst, reduced margin.

**IBM Power6 CPM (Drake, ISSCC 2007), 65 nm.** Many CPR paths of different types feed a **TDC**: a delay line with 7 flops sampling the output at successive taps, giving a thermometer code (Fast: 1111110, Slow: 1000000). Results: CPM models Fmax across voltage **within 3 FO2 delays**; **24 CPMs** placed in expected high-activity areas to sense voltage transients and local hot spots. Limits: significant calibration effort during test; difficult to detect very fast voltage transients.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p85-3.jpeg" alt="Because the canary and the real critical path each vary locally, keeping tracking failures rare requires a 3σ margin on both distributions." loading="lazy"><figcaption>Because the canary and the real critical path each vary locally, keeping tracking failures rare requires a 3σ margin on both distributions. · EECS 627 lecture packet · page 85</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p85-4.jpeg" alt="The first supply droop after a load step is fast (under 10 cycles) and can be highly localized, so a remote canary cannot see or react to it in time." loading="lazy"><figcaption>The first supply droop after a load step is fast (under 10 cycles) and can be highly localized, so a remote canary cannot see or react to it in time. · EECS 627 lecture packet · page 85</figcaption></figure>

**#2 Local variation.** The canary is a different set of transistors from the critical path. With WID variation each has its own distribution; to keep the tracking failure region (overlap) small, the replica must be set about **3σ + 3σ** away from the critical path. Slide 42: histogram of replica path delay mistracking (% of original path delay), N = 1000; at **VDD = 1.2 V σ = 3%**, at **VDD = 0.7 V σ = 8%**. Local variation grows at low voltage, so canaries need more margin, waste energy, and need **multiple canaries to average** out variation (σ of the average falls as 1/√n).

```latex
\sigma_{mistrack} = \sqrt{\sigma_{canary}^2 + \sigma_{crit}^2}, \qquad \text{margin} \approx 3\,\sigma_{mistrack}
```

**#3 Fast-changing variation.** After a current step, VCC shows a deep **first droop** (Intel data: roughly from 1.2 V down toward ~1.1 V within the first few ns, then ringing settling over ~50 ns). The first droop (package L with on-die decap resonance) is **fast** (the canary loop needs **> 10 cycles**) and **highly localized**.

<div class="co co-core"><p class="co-t">Core idea</p>

A canary is a copy, not the circuit. It tracks what copy and original share (global process, slow V, T, aging) and misses what they do not share (local variation, instruction-dependent paths, local fast droop).

</div>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p86-1.jpeg" alt="Itanium 2 regional voltage detectors spot a ~160 mV local droop and dither the regional clock from 2.272 GHz to 2.087 GHz for a droop lasting about 18 cycles." loading="lazy"><figcaption>Itanium 2 regional voltage detectors spot a ~160 mV local droop and dither the regional clock from 2.272 GHz to 2.087 GHz for a droop lasting about 18 cycles. · EECS 627 lecture packet · page 86</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p86-2.jpeg" alt="Canary response takes a detection delay plus a response delay, during which the core keeps slowing at the environment&#x27;s rate of change, so the restore margin must cover that interval." loading="lazy"><figcaption>Canary response takes a detection delay plus a response delay, during which the core keeps slowing at the environment&#x27;s rate of change, so the restore margin must cover that interval. · EECS 627 lecture packet · page 86</figcaption></figure>

**Itanium 2 local canary (Fisher, JSSC 2006).** Regional voltage detectors drive regional clock dividers. On a **~160 mV** local droop, frequency is reduced from **2.272 GHz to 2.087 GHz** (−8%) for a droop lasting **~18 cycles**. This is **di/dt adaptation**: instead of guardbanding the whole chip for the worst first droop, stretch the clock only where and when it happens. (Modern adaptive clocking / droop detectors on CPUs and GPUs follow this idea, added.)

**Response time margin (slides 45–48).** As core voltage (or 1/temperature) ramps at a rate (V/s), core delay and canary delay both rise. The canary takes one cycle to raise an alarm (**detection delay**) and the system needs several cycles to raise V or lower f (**response delay**). During that time the core keeps slowing, so a **restore margin / response margin** is required:

```latex
\text{margin} \;\geq\; \frac{\partial t_d}{\partial V}\cdot\frac{dV}{dt}\cdot(t_{detect} + t_{response})
```

(added formalization of the slide picture). Temperature changes in **ms**, voltage in **µs**: slow response + fast environment = more margin.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Canaries and CPMs are built from library cells, so the designer must pick cells whose V/T sensitivity spans the real critical paths (wire-heavy, stacked NAND/NOR, high-Vt, flop-dominated). SRAM/ROM access paths scale with V and T differently from logic (bitline discharge vs gate delay), so a logic canary mistracks the memory: memories need their own replica (e.g. a replica bitline for sense timing) or a separate margin. Droop detectors and adaptive clocking reduce the IR/di/dt budget in signoff, but only if their reaction time is shorter than the first droop.

</div>

### 8.7 Canary scorecard and in-situ delay detection

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p87-1.jpeg" alt="Canary circuits address only variations that are not local or fast: D2D process, aging, package VDD and ambient temperature." loading="lazy"><figcaption>Canary circuits address only variations that are not local or fast: D2D process, aging, package VDD and ambient temperature. · EECS 627 lecture packet · page 87</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p87-2.jpeg" alt="Sampling the same data at three successively delayed clocks tells whether the path is too slow, tuned, too close, or failing, so frequency can be tuned on the real circuit." loading="lazy"><figcaption>Sampling the same data at three successively delayed clocks tells whether the path is too slow, tuned, too close, or failing, so frequency can be tuned on the real circuit. · EECS 627 lecture packet · page 87</figcaption></figure>

**Canary scorecard (slides 49–51).**

- Addresses: inter-die process, lifetime degradation (**NBTI, TDDB**), package/die VDD fluctuation, ambient temperature (global and slow or static).
- Does not address: intra-die (WID) process, hot spots, IR drop, coupling noise, jitter (local or fast).
- Advantages: relatively easy, **no changes to the processor design**, no tester time (in theory). Can be tuned post-silicon to reduce margin, with more test cost.

So for **NBTI tracking**: a canary built from the same devices under similar stress ages with the chip and pulls VDD up as the circuit slows. Caveat (added): the canary only tracks aging if its **duty cycle and activity** resemble the critical path's; an always-toggling ring oscillator ages differently (HCI-like, ~50% duty) from a path whose PMOS sits on for long periods (NBTI).

**In-situ delay detection (Kehl '93, slide 53).** Sample the incoming data of the real circuit several times within the cycle (registers at t0, t1, t2 compared by XOR, giving EQ0–EQ2), with a tuned clock. Eliminates the tracking issue and addresses local variations; only slow-rate changes; the system must be taken off-line and calibrated.

**Frequency tuning strategy (slide 54).** One flip-flop is replaced by three flops on **clk1, clk2, clk3/clkcore** (each a delayed version of CLK; clk3 is the core's real clock). err1 and err2 compare the early samples against the late one:

| Case | Data arrives | err1 | err2 | Action |
|---|---|---|---|---|
| 1 | before clk1 | 0 | 0 | too easy / slow: raise f |
| 2 | between clk1 and clk2 | 1 | 0 | **tuned** |
| 3 | between clk2 and clk3 | 1 | 1 | too close / fast: lower f |
| 4 | after clk3 | 0 | 0 | **FAIL** (all three samples wrong, looks like case 1) |

Case 4 is indistinguishable from case 1, so tuning must approach from the safe side and stop at case 2.

**In-situ scorecard (slides 55–57).** Addresses everything that is **not fast**: both global and local process, aging, package VDD, ambient temperature and hot spots. Advantages: monitors the **actual circuit delay, not a copy**, so no mistracking, and removes margin for all slow variation. Disadvantages: invasive (circuits change internally), some delay and area overhead, **periodic halting** to run worst-case vectors, so slow response time.

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam P6 B iii.) Compared with per-temperature tester tables, a canary **additionally tracks aging (degradation) and slow package variation**, and can track temperature at finer grain. But it **mistracks across temperature and voltage**, and it **does not track intra-die variation**, which the per-die tables do. Overall (P6 B iv): no firm answer, but tables probably win, because finer temperature tracking is offset by V/T mistracking, canaries miss WID, and degradation is typically small.

</div>

### 8.8 Let fail and correct: Razor I

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p88-1.jpeg" alt="Razor I adds a shadow latch, clocked off the falling edge, to each critical flip-flop, and on a mismatch overwrites the main flop with the shadow latch&#x27;s correct value." loading="lazy"><figcaption>Razor I adds a shadow latch, clocked off the falling edge, to each critical flip-flop, and on a mismatch overwrites the main flop with the shadow latch&#x27;s correct value. · EECS 627 lecture packet · page 88</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p88-2.jpeg" alt="An error is detected when data arrives after the main flop&#x27;s setup time but before the shadow latch closes, and the error must propagate through XOR and OR-tree within the detection window." loading="lazy"><figcaption>An error is detected when data arrives after the main flop&#x27;s setup time but before the shadow latch closes, and the error must propagate through XOR and OR-tree within the detection window. · EECS 627 lecture packet · page 88</figcaption></figure>

**Key idea (slide 59).** You do not know if all margin is gone until you reach the onset of failure (race-car analogy: you find the limit by occasionally sliding). Needed: **in-situ error detection** (overhead?), **error correction**, and **tuning based on error rate**.

**Razor flip-flop.** Main flip-flop samples at the rising edge; a **shadow latch** samples the same D, transparent while CLK is high and closing at the **falling edge**. A comparator (XOR) flags QFF ≠ QSL.

- **Case 1 (safe)**: D settles before FFsu. QFF and QSL get the same value (after tCQ-FF and tCQ-SL). Error = 0.
- **Case 2 (error)**: D arrives after the main flop's setup time but before the shadow latch's setup (SLsu) at the falling edge. QFF has the old value, QSL gets the new value after tDQ-SL; XOR fires after tXOR, the OR-tree after tOR-tree, and **Restore** overwrites the main flop with QSL. The **error detection window** runs from the regular clock edge to the latest error detection point before the shadow latch closes.

Design rules (slide 60):

- The shadow latch must **always be correct by conventional design** (it is timed with the extra half cycle of slack).
- **Hold constraint**: because the shadow latch is transparent for the high phase, any short path must not arrive before the shadow latch closes, so short paths need **delay buffers** (min delay > high phase + hold).
- **Metastability** at the main flop must be detected (a local meta-detector), since a late D can make QFF metastable while the comparator says nothing.
- Pipeline state must be recovered while guaranteeing forward progress.

```latex
t_{\min,\text{path}} \;\geq\; t_{\text{high}} + t_{hold,SL} - t_{CQ}
```

(added form of the hold rule: data from the next cycle must not corrupt the shadow latch before it closes).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

The Razor flop is a library cell with two state elements, a comparator and a meta-detector; its .lib needs setup/hold for the main flop, the shadow-latch window, and an error-output arc. The hold rule turns into massive hold buffering on short paths into Razor flops, which is a real area/power cost, and is why only a small subset of flops can be Razor flops.

</div>

### 8.9 Recovery, voltage tuning, and measured results

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p89-1.jpeg" alt="Razor tunes voltage on error rate and purposely runs below the point of first failure, trading lower processor energy against rising recovery energy to find an optimal voltage." loading="lazy"><figcaption>Razor tunes voltage on error rate and purposely runs below the point of first failure, trading lower processor energy against rising recovery energy to find an optimal voltage. · EECS 627 lecture packet · page 89</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p89-2.jpeg" alt="Measured: about 0.04% error rate and 0.2% IPC loss at the optimum, with about 5% extra energy reduction past the point of first failure." loading="lazy"><figcaption>Measured: about 0.04% error rate and 0.2% IPC loss at the optimum, with about 5% extra energy reduction past the point of first failure. · EECS 627 lecture packet · page 89</figcaption></figure>

**Distributed pipeline recovery (slide 68).** Builds on the existing branch/data speculation recovery: a Razor error in a stage injects a **bubble** into the next stage, sends a **flush** back up the pipe, and the instruction is replayed. Multi-cycle penalty per timing failure; scalable because all recovery communication is local. A **stabilizer** flop before write-back prevents a possibly-wrong value from reaching memory/register file.

**Energy optimum (slide 69).** Tune VDD on error rate; eliminate PVT and safety margins (tune for near-zero error rate); purposely run **below the PoFF** to capture all margins, including **data-dependent** ones. As V falls: processor energy falls (∝ V²), recovery energy rises (error rate rises exponentially), IPC falls. Total energy has a minimum at the **optimal voltage**, below the PoFF, far below the traditional margin point. Analogy: wireless links run at a non-zero bit error rate with retransmission.

```latex
E_{total}(V) = E_{proc}(V) + E_{recovery}(V), \qquad E_{proc}\propto V^2,\; E_{recovery} \propto \text{ErrorRate}(V)
```

**Measured (slide 70)**: past the point of first failure, **~5% additional energy reduction**, at **~0.04% error rate** and **~0.2% IPC reduction** (core voltage 1.15–1.2 V range).

### 8.10 Razor II

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p89-3.jpeg" alt="Razor II uses a single positive-level latch plus a transition detector on its internal node, flagging any transition after a short detection-clock pulse as a timing error and sending recovery to the pipeline." loading="lazy"><figcaption>Razor II uses a single positive-level latch plus a transition detector on its internal node, flagging any transition after a short detection-clock pulse as a timing error and sending recovery to the pipeline. · EECS 627 lecture packet · page 89</figcaption></figure>

**Structure.** One **positive-level-sensitive latch** (not flop + shadow latch), a **detection clock (DC) generator**, and a **transition detector** on the latch node N.

- CLK high: latch transparent. A short DC pulse at the rising edge, lasting **Tcq,max**, masks the expected transition of N caused by data that arrived on time.
- After DC ends and while CLK is still high is the **delay error detection window**. Any transition of N in the window means D arrived late: **ERROR**.
- **Valid data transition**: D settles before the CLK edge, N changes within Tcq,max under DC masking, no error.
- **Invalid transition**: D changes late, N toggles in the window, ERROR rises and drives the **restore logic of the pipeline**.

Differences from Razor I (standard summary of the Razor II paper, added): detection only, no local restore of the latch; correction is by **architectural replay**; smaller cell (one latch, no shadow), and it also catches **SEU-induced** transitions on N.

**Micro-architecture (slide 72).** Error signals from each stage (FE_ERR, DE_ERR, IS_ERR, EX_ERR, ME_ERR, S0_ERR) go to recovery control, which flushes and **replays** from the recovered PC. **Stabilization stages** (S0, S1) give the error detection time to stop write-back to SRAM/memory.

<div class="co co-guard"><p class="co-t">Common trap</p>

(Practice exam P6 C.) **Hold time in Razor II** is set by the time from the **detection clock going high to the main clock going low** (the latch becoming opaque): a short path launched by the next edge must not reach N during that interval, or it is flagged as an error. If a hold path is violated on silicon, every time the instruction exercises it Razor flags an error and recovery **replays at lower frequency**, but a hold failure is frequency-independent, so it **fails again and again**: the processor hangs, makes no progress, and the error rate spikes to **100%**. It cannot execute that code.

</div>

### 8.11 Silicon results and the scorecard

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p90-1.jpeg" alt="On chip TT9 at fixed 1 GHz, AVS lowered VDD to 0.97 V under a typical workload versus 1.1 V with 3% margin, saving 32% power, with a power virus pushing PoFF to 1.07 V." loading="lazy"><figcaption>On chip TT9 at fixed 1 GHz, AVS lowered VDD to 0.97 V under a typical workload versus 1.1 V with 3% margin, saving 32% power, with a power virus pushing PoFF to 1.07 V. · EECS 627 lecture packet · page 90</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p90-2.jpeg" alt="Razor-based tuning addresses all variations on the grid, fast ones included, as long as they fit inside the detection window." loading="lazy"><figcaption>Razor-based tuning addresses all variations on the grid, fast ones included, as long as they fit inside the detection window. · EECS 627 lecture packet · page 90</figcaption></figure>

**Razor ARM processor (2010), UMC 65 nm SP.** 1 V nominal, 1.1 V overdrive; subset of the ARM ISA with critical paths representative of industrial ARM designs; **88 dies from split lots (30 FF / 37 TT / 21 SS)**; sign-off **724 MHz at 0.9 V / SS / 125 °C**. Experiments: adaptive frequency (AFS) and adaptive voltage (AVS).

- **Failing Razor flops, chip TT9 at 1 V (slide 74)**: **4 timing detectors fail at 1.1 GHz vs 122 at 1.2 GHz**. Error onset is sharp with frequency.
- **Workloads (slide 75)**: power virus fails different and more flops; **significant variation in PoFF across workloads**, which is the data-dependent margin that static signoff must cover and Razor removes.
- **AVS at fixed 1 GHz, TT9 (slides 76–77)**: NOP: voltage drops until PoFF (~0.93 V); power virus: new PoFF at **1.07 V**; typical: **0.97 V**. The non-Razor operating point is **1.1 V (3% margin)**, so the typical workload saves **32% power**.
- **1.2 V vs Razor (slide 78)**: at 1.2 V the FF5 part is the power outlier (~100 mW, large leakage). Razor-tuned VDD: **FF5 906 mV, TT9 963 mV, SS6 1.063 V**; the SS6 part now consumes the maximum power, and the **outlier drops from 100 mW to 48 mW (52% saving)**. Fast parts get the lowest voltage, which also kills their leakage.
- **Power distribution (slide 79)**: without Razor (OD 1.2 V) power spreads ~62–102 mW; with Razor ~38–47 mW. **Razor improves both µ and σ** of the power distribution.

**IBM Telum II (ISSCC 2025)**: 5.5 GHz, Samsung 5 nm, 600 mm², 43B transistors, 24 miles of wire, 165B vias, 18 metal layers. A Razor-like scheme: when VDD droops toward V_CRIT, a **recovery event** happens in the "recoverable error" band above the "unrecoverable error" band. A recovery event is treated as a **warning that timing protection is insufficient**, and V_CRIT is raised dynamically (dynamic adaptation of timing protection).

**Razor scorecard (slides 82–84).**

- Addresses **all** variations, **inside the detection window**, and also instruction-dependent delay.
- Disadvantages: architectural changes for error correction; **hold constraint** grows with a larger speculation window (overhead); only a small subset of flops can be Razor flops; limits on single-cycle delay changes (a change larger than the window is not caught).

<div class="co co-core"><p class="co-t">Core idea</p>

Scorecard across the grid: design-time DVFS covers nothing; tester tables cover static global + local process (add temperature with per-T tables); canaries cover global slow and static (process, aging, package V, ambient T); in-situ covers everything not fast; Razor covers everything within its detection window, at the cost of hold buffering and recovery logic.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

AVFS changes what the library guarantees. Per-die voltage means fast parts run at much lower VDD, so cells, level shifters and memories must be characterized and functional at the low end of a wide window, where temperature inversion flips the slow temperature. Aging is absorbed by the loop only if the monitor ages like the logic; SRAM/ROM read margins (sense-amp offset, keeper vs n·Ioff, bitline swing) are local, high-sigma quantities that no global monitor sees, so memories keep their own static margin or a separate supply (VDDmin of the array often sets the AVFS floor, added).

</div>

### 8.x Check yourself

1. **(Exam 1, P6A) What is the difference between DVFS and AVFS?** — DVFS is **workload adaptation** (design-time V/f table, same for all dies). AVFS is **process and environmental adaptation** (V/f set per die and over time, using sensors, canaries, in-situ monitors or Razor).
2. **(Exam 1, P6B i) A chip has three tester-filled V/f tables at −20, 25 and 85 °C and a temperature sensor. It reads 40 °C. Which table?** — Above Vt, use the **higher-temperature** table (85 °C), since hot is the worst case. Below Vt, use the **lower-temperature** table (25 °C), because of temperature inversion (cold is slow when Vt dominates).
3. **(Exam 1, P6B ii) Which variations does this table approach address?** — Addresses **both process variations (D2D and WID)** and **ambient temperature**. Does not address lifetime degradation, package effects, hot spots, or any fast-changing variation (IR drop, droop, coupling, jitter).
4. **(Exam 1, P6B iii–iv) Compare with a canary circuit. Which approach wins?** — A canary also tracks **degradation (aging)** and slow package variation, and can track temperature at finer grain. But it **mistracks across temperature and voltage** and **does not track intra-die variation**. Overall there is no firm answer, but the tables probably win: finer temperature tracking is offset by V/T mistracking, canaries miss WID, and degradation is typically small.
5. **(Exam 1, P6C i) In Razor II, what sets the required hold time?** — The time from the **detection clock going high to the main clock going low** (the latch becoming opaque). A short path launched by the next edge must not toggle the latch node during that window, or it is flagged as an error.
6. **(Exam 1, P6C ii) A RazorII chip comes back with one hold violation. How does it behave?** — When an instruction exercises that path, Razor flags an error and recovery replays the instruction at lower frequency. A hold failure does not depend on frequency, so it fails again every time: the processor hangs, makes no forward progress, and the error rate spikes to **100%**. It cannot execute that code.
7. **Why does a canary need margin even for slow variations, and how large is the local-variation part?** — Three reasons: mistracking (the real critical path changes with instruction and scales differently with V/T), local variation (canary and path are different devices: about 3σ on each side, with replica mistracking σ = 3% at 1.2 V and 8% at 0.7 V), and response time (detection + response delay times the environment's rate of change). Multiple canaries reduce the first two.
8. **Give the key Razor ARM silicon numbers.** — 65 nm, 88 dies (30 FF / 37 TT / 21 SS), sign-off 724 MHz at 0.9 V / SS / 125 °C. TT9 at 1 GHz: typical workload at 0.97 V vs 1.1 V (3% margin) = **32% power saving**; power-virus PoFF 1.07 V. Razor-tuned VDD 906 mV (FF5), 963 mV (TT9), 1.063 V (SS6) vs 1.2 V: outlier power 100 → 48 mW (**52% saving**); both µ and σ of power improve.


## Lecture 9 — Leakage

This lecture covers the static current that flows when a transistor is supposed to be off, and what can be done about it. The first half goes through the mechanisms (subthreshold conduction and DIBL, GIDL, gate-oxide tunneling, junction leakage) and how they depend on voltage, temperature and device type (planar vs FinFET/GAA). The second half covers the circuit techniques: raising Vth, stacking and input-state assignment, dual-Vt, power gating (MTCMOS) with its sizing, decap, wake-up and state-retention problems, boosted-gate and super-cutoff switches, and body biasing. At a GPU company every standard-cell library comes in several Vt flavors, every large block is power gated, and the SRAM/ROM arrays are often the largest source of leakage on the die. So these are everyday design decisions for the library and memory teams, not academic topics.

### 9.1 Leakage components and the subthreshold model

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p92-1.jpeg" alt="A MOSFET leaks through three paths, source-to-drain (subthreshold), gate (oxide tunneling) and junction (drain/source to body)." loading="lazy"><figcaption>A MOSFET leaks through three paths, source-to-drain (subthreshold), gate (oxide tunneling) and junction (drain/source to body). · EECS 627 lecture packet · page 92</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p92-2.jpeg" alt="Below threshold the drain current is exponential in VGS − VTH, with a swing S = n(kT/q)ln10 of 60–100 mV/decade." loading="lazy"><figcaption>Below threshold the drain current is exponential in VGS − VTH, with a swing S = n(kT/q)ln10 of 60–100 mV/decade. · EECS 627 lecture packet · page 92</figcaption></figure>

The deck uses one device picture to organize the first half of the lecture:

- **S-D (subthreshold) leakage**: carriers diffuse over the source-channel barrier when VGS < VTH. This is the dominant term in most logic.
- **Gate leakage**: direct tunneling through the thin dielectric.
- **Junction leakage**: reverse-biased drain/source-to-body diodes (and, at high field, GIDL, which also exits through the body).

**Subthreshold model.** In weak inversion the current is diffusion-limited, so it follows a Boltzmann exponential:

```latex
I_{DS} = 2n\mu C_{ox}\frac{W}{L}\left(\frac{kT}{q}\right)^2 e^{\frac{V_{GS}-V_{TH}}{nkT/q}}\left(1-e^{\frac{-V_{DS}}{kT/q}}\right) = I_S\, e^{\frac{V_{GS}-V_{TH}}{nkT/q}}\left(1-e^{\frac{-V_{DS}}{kT/q}}\right)
```

- **n** is the slope factor (≥ 1, typically about 1.5). It is the capacitive divider between gate and channel, n = 1 + C_dep/C_ox. A gate with perfect control (FinFET/GAA) pushes n toward 1.
- The last factor is ≈ 1 once VDS > ~100 mV (a few kT/q), so for an off device with full VDD across it the drain voltage drops out, apart from DIBL (next slide).

In base 10:

```latex
I_{DS} = I_S\,10^{\frac{V_{GS}-V_{TH}}{S}}\left(1-10^{\frac{-nV_{DS}}{S}}\right),\qquad S = n\frac{kT}{q}\ln(10)
```

**S is the subthreshold swing**, the mV of gate voltage per decade of current: 60 mV/dec at room temperature is the ideal (n = 1) limit, and real devices are 60–100 mV/dec. A quick rule: every S of Vth you give up costs 10X in leakage. With S = 80 mV, a 100 mV lower-Vt cell leaks about 18X more (added).

<div class="co co-eq"><p class="co-t">Equation card</p>

Ioff ∝ 10^(−VTH/S), S = n·(kT/q)·ln10 ≈ 60 mV/dec · n at 300 K. kT/q ≈ 26 mV at room temperature, and S grows linearly with absolute temperature.

</div>

### 9.2 DIBL and the voltage dependence of Isub

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p93-1.jpeg" alt="In a short-channel device the drain field lowers the source barrier, so raising VDS lowers VT and raises Ioff sharply." loading="lazy"><figcaption>In a short-channel device the drain field lowers the source barrier, so raising VDS lowers VT and raises Ioff sharply. · EECS 627 lecture packet · page 93</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p93-2.jpeg" alt="With DIBL (λd) and body effect (β) the leakage becomes exponential in VDS, making leakage power a strong function of VDD." loading="lazy"><figcaption>With DIBL (λd) and body effect (β) the leakage becomes exponential in VDS, making leakage power a strong function of VDD. · EECS 627 lecture packet · page 93</figcaption></figure>

**Drain-induced barrier lowering (DIBL).** The band diagrams (Narendra, Intel) show the source-channel barrier for a long and a short channel. In a long device the barrier is set by the gate alone. When the channel is short, the drain depletion region reaches toward the source and the drain voltage pulls the barrier down. The chain on the slide is the result:

VDS ↑ ⇒ VT ↓ ⇒ IOFF ↑↑

Folding DIBL and body bias into the model:

```latex
I_{DS} = I_S\,10^{\frac{V_{GS}-V_{TH}+\lambda_d V_{DS}+\beta V_{BS}}{S}}\left(1-10^{\frac{-nV_{DS}}{S}}\right)
```

```latex
I_{leak} = I_0\frac{W}{W_0}\,10^{\frac{-V_{TH}+\lambda_d V_{DS}+\beta V_{BS}}{S}}\qquad (V_{GS}=0,\; V_{DS} > 3\text{–}4\,kT/q)
```

Coefficients given on the slide:

| | λd (DIBL) | β (body effect) |
|---|---|---|
| Planar (old) | ≈ 0.1 = 1/10 | ≈ 0.1 = 1/10 |
| FinFET, GAA | ≈ 0.025 = 1/40 | ≈ 0.008 = 1/125 |

Two consequences:

1. **Leakage power P = Ileak·VDD falls faster than linearly with VDD**, because Ileak itself is exponential in VDD through λd. Lowering VDD is a leakage knob as well as a dynamic-power knob.
2. **FinFET/GAA devices have much less DIBL and almost no body effect.** The gate wraps the channel, so the drain and the body both lose control. This is good for leakage, but (as shown later) it makes stacking and body biasing much less effective.

<div class="co co-guard"><p class="co-t">Common trap</p>

DIBL means the off-current of a device depends on its own VDS. Any technique that lowers VDS across the off device (stacking, a collapsed virtual rail) gains twice: once from the smaller VDS, and again from the higher effective Vth. Any technique that raises VDS (e.g. shorting a virtual rail to VDD) costs leakage.

</div>

### 9.3 GIDL and the full drain-leakage picture

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p94-1.jpeg" alt="GIDL: with the gate driven negative and the drain high, band-to-band tunneling in the gate-drain overlap creates a drain-to-bulk current that grows with VDG." loading="lazy"><figcaption>GIDL: with the gate driven negative and the drain high, band-to-band tunneling in the gate-drain overlap creates a drain-to-bulk current that grows with VDG. · EECS 627 lecture packet · page 94</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p94-2.jpeg" alt="In 90 nm planar NMOS, ID vs VGS shows subthreshold rising with VDS (DIBL) and a GIDL tail that rises again for negative VGS at high VDS." loading="lazy"><figcaption>In 90 nm planar NMOS, ID vs VGS shows subthreshold rising with VDS (DIBL) and a GIDL tail that rises again for negative VGS at high VDS. · EECS 627 lecture packet · page 94</figcaption></figure>

**Gate-induced drain leakage (GIDL).** For an NMOS with the gate at or below 0 V and the drain high, the gate-to-drain overlap region sees a very large vertical field. The silicon under the gate edge is driven into deep depletion and bands bend enough for **band-to-band tunneling** (plus **trap-assisted tunneling**). Electron-hole pairs are generated; electrons go to the drain and holes to the bulk. So:

- GIDL flows **drain to bulk**, not drain to source.
- It scales with **VDG**, not with VGS alone. It is more significant at larger VDS and more negative VGS (Chen, TED'01: curves for Vd = 2–6 V vs gate voltage down to −8 V).

**Combined drain leakage, 90 nm NMOS (slide 9).** ID vs VGS from −0.4 V to 1.2 V for VDS = 0.1, 1.0 and 2.5 V:

- For VGS > 0 the curves are subthreshold exponentials; the higher-VDS curves are shifted up and left (DIBL).
- At VGS < 0 the 2.5 V curve does not keep dropping; it bottoms out and rises again. That is GIDL.
- The minimum leakage therefore sits at a **slightly negative VGS**, and the optimum gets shallower as VDS rises.

The FinFET version (Kerber et al., IBM, IEDL 2013) shows the same shape: Idrain vs Vgate from −0.4 to 1.4 V at VDS = 0.6 and 1.2 V, with the off-state current turning back up for negative gate voltage, more strongly at 1.2 V.

<div class="co co-core"><p class="co-t">Core idea</p>

Driving the gate below the source (super-cutoff, negative wordline, reverse body bias) helps only until GIDL takes over. There is an optimum negative VGS, and it gets shallower as VDS increases.

</div>

### 9.4 Temperature dependence

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p94-3.jpeg" alt="In FinFET/GAA nodes the Vth drop with temperature dominates the mobility loss, so Ion increases with temperature (temperature inversion) and both Ion and Ioff rise when hot." loading="lazy"><figcaption>In FinFET/GAA nodes the Vth drop with temperature dominates the mobility loss, so Ion increases with temperature (temperature inversion) and both Ion and Ioff rise when hot. · EECS 627 lecture packet · page 94</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p94-4.jpeg" alt="Gate tunneling current density is exponential in oxide thickness and voltage, only moderately temperature dependent, and larger for NMOS than PMOS." loading="lazy"><figcaption>Gate tunneling current density is exponential in oxide thickness and voltage, only moderately temperature dependent, and larger for NMOS than PMOS. · EECS 627 lecture packet · page 94</figcaption></figure>

**Planar (slide 11).** Increasing temperature (1) reduces mobility and (2) reduces VTH.

- **IOFF increases** with temperature (lower Vth, larger kT/q in the swing).
- **ION decreases** with temperature when VDD > Vth (mobility wins). When VDD < Vth, Ion increases with temperature (the Vth drop wins). There is a **temperature-insensitive VDD** in between.

**FinFET (slide 12).** The same two effects exist, but the Vth reduction is more dominant, so **ION increases with temperature** and IOFF also increases. The inverter-chain delay plot (50-stage chain, −40 °C to 125 °C) shows delay **falling** as temperature rises. The slide's warning: at advanced nodes this is **temperature inversion**, and different process corners of the same device can behave differently. "Cold is fast, hot is slow" is no longer a safe assumption for superthreshold operation.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Temperature inversion is why modern .lib sign-off needs both the cold and the hot corner for setup (the slowest corner can be SS at −40 °C, especially at low VDD), while leakage and EM are always worst at the hot corner. Hold and min-delay checks have the mirror problem. A library characterizer has to know which (process, V, T) combination is actually worst for each arc, and cannot assume it from intuition.

</div>

### 9.5 Gate leakage and high-k

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p95-1.jpeg" alt="EOT = tg·(3.9/εg): a physically thicker high-k film gives the same capacitance as thin SiO2 with far less tunneling." loading="lazy"><figcaption>EOT = tg·(3.9/εg): a physically thicker high-k film gives the same capacitance as thin SiO2 with far less tunneling. · EECS 627 lecture packet · page 95</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p95-2.jpeg" alt="Junction leakage comes from generation, diffusion and band-to-band tunneling in reverse-biased diodes; it is strongly temperature dependent but usually the smallest term." loading="lazy"><figcaption>Junction leakage comes from generation, diffusion and band-to-band tunneling in reverse-biased diodes; it is strongly temperature dependent but usually the smallest term. · EECS 627 lecture packet · page 95</figcaption></figure>

**Gate tunneling.** At ~1.2 nm SiO2 the oxide is a few atomic layers thick (Mistry, IEDM'07, TEM image) and electrons tunnel directly through it. Slide 15 plots JG vs VDD for tox from 0.6 to 1.9 nm: the curves are spread over many decades of the 10⁻⁹ to 10⁹ A/cm² axis, and at a given VDD each ~0.2–0.3 nm of thinner oxide costs roughly one to two orders of magnitude. Remarks:

- **Exponential in oxide thickness and applied voltage.**
- **Only a moderate function of temperature** (tunneling is not thermally activated), unlike subthreshold.
- **Larger for NMOS than PMOS** (electron tunneling from the inverted channel has a lower barrier than hole tunneling).
- It breaks the oldest assumption of MOS digital design, **infinite gate input resistance**. A gate now draws static current from whatever drives it, which matters for keepers, dynamic nodes and floating nodes.

**High-k / metal gate (from 45 nm).** Replace SiO2 (κ = 3.9) with HfO2 (εeff ≈ 15–30) or HfSiOx (εeff ≈ 12–16), usually together with a metal gate:

```latex
EOT = t_{ox} = t_g\cdot\frac{3.9}{\varepsilon_g}
```

The physical film can be thicker (3.0 nm high-k vs 1.2 nm SiO2 in the TEM comparison), so tunneling falls exponentially while Cox stays the same or rises. The slide's table: **gate capacitance 60% greater** (faster transistors, since Ion ∝ µCox(W/L)Vov²), **gate dielectric leakage reduced by more than 100% (i.e. by a large factor)**, which "buys a few generations of technology scaling".

**Junction leakage.** Reverse-biased drain/source-to-substrate and well diodes leak by (1) generation of electron-hole pairs in the depletion region, (2) diffusion of minority carriers, and (3) in sub-50 nm technologies with heavily doped junctions, band-to-band tunneling across a narrow depletion region (this gets better as advanced devices need less doping). Watch for well leakage at high temperature. Junction leakage is a **strong function of temperature** but **much smaller than the other components** in general.

**Thermal runaway in burn-in (slide 20).** Burn-in runs parts at high voltage, high temperature and slow clock to screen weak die. Leakage rises with temperature, the extra power raises temperature further, and the loop can run away (the photo shows a burned Athlon socket). Today all processors have **thermal throttling**.

**The standby problem (slide 21).** With clock gating everywhere, idle units burn almost no dynamic power, so **leakage dominates standby power**. The challenge is to turn a unit off when no ideal switch exists.

### 9.6 General approaches and raising Vth

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p96-1.jpeg" alt="Raising Vth (ULVT to HVT) cuts leakage by 300–1000X, but delay grows 2.3X at 0.8 V and 13.8X at 0.5 V because delay depends on the VDD/Vth ratio." loading="lazy"><figcaption>Raising Vth (ULVT to HVT) cuts leakage by 300–1000X, but delay grows 2.3X at 0.8 V and 13.8X at 0.5 V because delay depends on the VDD/Vth ratio. · EECS 627 lecture packet · page 96</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p96-2.jpeg" alt="In a 2-NMOS stack of a planar NAND, the intermediate node settles where the two leakage currents match, about 9X below a single off device." loading="lazy"><figcaption>In a 2-NMOS stack of a planar NAND, the intermediate node settles where the two leakage currents match, about 9X below a single off device. · EECS 627 lecture packet · page 96</figcaption></figure>

**General approaches (slide 23):**

- **Lower temperature**: much work on cooling, including microfluidic channels in the silicon.
- **Increase gate length**: Vth rises because short-channel effects (DIBL, roll-off) shrink. Costs gate capacitance, so it works when ΔL is kept small. Standard libraries ship "long-L" or "+2 nm poly bias" variants for exactly this reason (added; see "Lgate biasing" in the summary slide).
- **Decrease voltage**: exponential payoff through DIBL.

**Raising Vth** is the most fundamental knob. Delay follows the alpha-power law

```latex
\tau \propto \frac{V_{DD}}{(V_{DD}-V_{th})^{\alpha}}
```

so the penalty explodes as VDD approaches Vth. The FinFET data on the slide:

| | ULVT @ 0.8 V | HVT @ 0.8 V | ULVT @ 0.5 V | HVT @ 0.5 V |
|---|---|---|---|---|
| Leakage (norm) | 1 | 0.003 | 1 | 0.001 |
| Delay (norm) | 1 | 2.28 | 1 | 13.81 |

At nominal voltage HVT is a reasonable trade (330X less leakage for 2.3X delay). At 0.5 V it is close to unusable for anything timing-critical (13.8X delay). This is why low-voltage designs use LVT/ULVT and control leakage by other means.

### 9.7 Stacking

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p96-3.jpeg" alt="Equating the leakage of the top and bottom off devices gives VM ≈ λd·VDD/(1+2λd); the stack leaks 0.12X (planar) or 0.33X (FinFET) of a single device." loading="lazy"><figcaption>Equating the leakage of the top and bottom off devices gives VM ≈ λd·VDD/(1+2λd); the stack leaks 0.12X (planar) or 0.33X (FinFET) of a single device. · EECS 627 lecture packet · page 96</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p96-4.jpeg" alt="Measured stack factors: planar 9/17/24X for 2/3/4 NMOS, but only 3/5/8X for FinFET because DIBL and body effect are small." loading="lazy"><figcaption>Measured stack factors: planar 9/17/24X for 2/3/4 NMOS, but only 3/5/8X for FinFET because DIBL and body effect are small. · EECS 627 lecture packet · page 96</figcaption></figure>

**Mechanism.** In a two-high off stack (NAND pull-down with A = B = 0), the intermediate node VM floats up until the two leakage currents match. Three things then help the top device M1:

1. **Negative VGS**: its gate is at 0 but its source is at VM, so VGS = −VM.
2. **Reduced VDS**: VDD − VM instead of VDD, so less DIBL.
3. **Body effect**: VSB = VM raises its Vth (ignored in the derivation, since body effect is small in short-channel devices).

Derivation (body effect neglected, VDS of M2 assumed > a few kT/q):

```latex
I_{leak,M1} = I_0'\,10^{\frac{-V_M - V_{TH} + \lambda_d (V_{DD}-V_M)}{S}},\qquad I_{leak,M2} = I_0'\,10^{\frac{-V_{TH}+\lambda_d V_M}{S}}
```

```latex
V_M \approx \frac{\lambda_d}{1+2\lambda_d}V_{DD},\qquad \frac{I_{stack}}{I_{inv}} \approx 10^{-\frac{\lambda_d V_{DD}}{S}\cdot\frac{1+\lambda_d}{1+2\lambda_d}}
```

The naive expectation is a 2X saving (two equal resistors in series). The real saving is much larger because of the exponentials:

- **Planar**: λd = 0.1 → VM ≈ 100 mV → Istack/Iinv ≈ **0.12**.
- **FinFET**: λd = 0.05 → VM ≈ 35 mV → Istack/Iinv ≈ **0.33**.

The 90 nm simulation (slide 26) plots IM1 and IM2 vs VM; they cross at a stack factor of **9**. The 16 nm FinFET version (slide 27) crosses at a factor of **3**.

Measured savings for deeper stacks (slide 29; intermediate nodes settle at 35 mV for a 2-stack, 48 mV and 15 mV for a 3-stack):

| Stack | Planar | FinFET |
|---|---|---|
| 2 NMOS | 9X | 3X |
| 3 NMOS | 17X | 5X |
| 4 NMOS | 24X | 8X |
| 2 PMOS | 8X | 2.8X |
| 3 PMOS | 12X | 4.8X |
| 4 PMOS | 16X | 6.8X |

<div class="co co-core"><p class="co-t">Core idea</p>

The stack effect is a DIBL effect. It is large in planar (λd ≈ 0.1) and modest in FinFET (λd ≈ 0.025–0.05). Each additional off device gives diminishing returns because most of the voltage already sits across the top device.

</div>

### 9.8 State dependence: Isub vs Igate

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p97-1.jpeg" alt="In a 3-NMOS stack, Isub depends mainly on how many devices are off (1 off: 7–11 pA, 2 off: 2–4 pA, 3 off: 1 pA), then on where the off devices sit." loading="lazy"><figcaption>In a 3-NMOS stack, Isub depends mainly on how many devices are off (1 off: 7–11 pA, 2 off: 2–4 pA, 3 off: 1 pA), then on where the off devices sit. · EECS 627 lecture packet · page 97</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p97-2.jpeg" alt="Igate depends on where the on devices sit: an on device with its channel at 0 V leaks most (2 pA each), while on devices with source/drain near VDD barely leak or leak in reverse." loading="lazy"><figcaption>Igate depends on where the on devices sit: an on device with its channel at 0 V leaks most (2 pA each), while on devices with source/drain near VDD barely leak or leak in reverse. · EECS 627 lecture packet · page 97</figcaption></figure>

**Isub table (slide 30)**, NAND3 pull-down, inputs (A, B, C) with A at the top:

| State | # OFF | VDS of off-stack | Isub |
|---|---|---|---|
| 011 | 1 | VDD | 11 pA |
| 101 | 1 | VDD − VTH | 9 pA |
| 110 | 1 | VDD − VTH | 7 pA |
| 001 | 2 | VDD | 4 pA |
| 010 | 2 | ~VDD | 3 pA |
| 100 | 2 | VDD − VTH | 2 pA |
| 000 | 3 | VDD | 1 pA |

First order: number of off devices. Second order: the voltage across the off stack. An on NMOS above an off one can only pass VDD − VTH to the internal node, which lowers VDS and DIBL.

**Igate (slides 31–32).** Gate tunneling depends on the voltage between the gate and the channel/overlap:

- Gate at VDD, source and drain at 0 V (on device at the bottom of a discharged stack): **Igate = max**.
- Gate at VDD, source and drain at VDD: Igate = 0.
- Gate at VDD with channel at VDD − VTH: small.
- Gate at 0 V, drain at VDD (off device, edge tunneling through the gate-drain overlap): small **reverse** current.

| State | # ON (effective) | Igate |
|---|---|---|
| 111 | 3 | (2 pA)×3 |
| 011 | 2 | (2 pA)×2 |
| 001 | 1 | 2 pA |
| 101 | 1 | 2 pA |
| 010 | 0.5 | 1 pA |
| 110 | 0 | −0.1 pA (reverse) |
| 100 | 0 | −0.2 pA (reverse) |
| 000 | 0 | −0.2 pA (reverse) |

So the best parking state for subthreshold (000, 1 pA) also happens to be a good one for gate leakage. In general, though, the two can disagree: Isub wants many off devices, Igate wants the on devices placed where their channels sit near VDD (at the top of the stack).

<div class="co co-guard"><p class="co-t">Common trap</p>

"Isub depends on how many devices are off; Igate depends on where the on devices are." When gate leakage is comparable to subthreshold leakage (thin-oxide planar nodes), the minimum-leakage input vector must be found with both terms included.

</div>

### 9.9 Input vector control and settling time

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p99-1.jpeg" alt="Leakage spreads widely across input states for single gates (NAND4: 101X) but much less for whole blocks (data path 5X, adder 1.2X, decoder 1.25X)." loading="lazy"><figcaption>Leakage spreads widely across input states for single gates (NAND4: 101X) but much less for whole blocks (data path 5X, adder 1.2X, decoder 1.25X). · EECS 627 lecture packet · page 99</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p99-2.jpeg" alt="After the inputs switch to the low-leakage state, internal stack nodes take microseconds to hundreds of milliseconds to settle, and leakage stays elevated meanwhile." loading="lazy"><figcaption>After the inputs switch to the low-leakage state, internal stack nodes take microseconds to hundreds of milliseconds to settle, and leakage stays elevated meanwhile. · EECS 627 lecture packet · page 99</figcaption></figure>

**Standby strategy (slides 33–34).** Off-current is lower in complex gates, and some input patterns are better than others. So: find the input vector that minimizes leakage of a combinational block, and during standby force the block's inputs to that vector. The implementation shown modifies the boundary latches: a "0"-latch or "1"-latch with a **standby** input that overrides the stored value.

**But the gain is limited at block level (slide 35)**, because a vector that is good for one gate is bad for another:

| Block / gate | Min (nA) | Mean | Max | Max/Min |
|---|---|---|---|---|
| Data path | 11.42 | 21.36 | 57.72 | 5.05 |
| Adder | 256.8 | 283.1 | 309.8 | 1.2 |
| Control | 33.8 | 45.97 | 60.23 | 1.78 |
| Decoder | 1702.5 | 1914.3 | 2122.1 | 1.25 |
| Nand4 | 0.07 | 0.76 | 7.1 | 101.4 |
| OAI21 | 0.84 | 7.73 | 17.78 | 21.2 |
| Tinv | 0.37 | 1.89 | 5.76 | 15.6 |
| AOI21 | 2.44 | 8.51 | 17.23 | 7.1 |

Pros: little overhead, fast transition to the low-leakage state. Cons: limited effectiveness.

**Settling (slides 36–40).** Consider a 4-high NMOS stack whose top three inputs go 1 → 0 with the bottom already off. Before the transition the internal nodes sit at VDD − Vth (they were charged through on devices). After the transition there is no strong path to discharge them; they bleed down only through subthreshold currents, in sequence: the bottom node goes to ~35 mV, then the others settle to 48 mV / 15 mV, and finally to **55 / 24 / 10 mV**. The simulated discharge currents (bottom, middle, top node) show the bottom node settling first and the top node last. **Settling times range from microseconds to hundreds of milliseconds**, and leakage is elevated during this time. Leakage estimates for short sleep intervals must use a transient analysis, not the DC stack value.

### 9.10 Forced stacking and dual-Vt

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p100-1.jpeg" alt="Splitting one transistor into two series devices of W/2 keeps the input load but costs ~4X delay for ~20X less leakage (less in FinFET), a poor trade compared with raising Vth." loading="lazy"><figcaption>Splitting one transistor into two series devices of W/2 keeps the input load but costs ~4X delay for ~20X less leakage (less in FinFET), a poor trade compared with raising Vth. · EECS 627 lecture packet · page 100</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p100-2.jpeg" alt="Combining dual-Vt with an optimal standby input state, so that only devices that are off in standby get high Vt, cuts leakage by ~9.7X vs all low-Vt." loading="lazy"><figcaption>Combining dual-Vt with an optimal standby input state, so that only devices that are off in standby get high Vt, cuts leakage by ~9.7X vs all low-Vt. · EECS 627 lecture packet · page 100</figcaption></figure>

**Forced stacking.** Replace a single device of width W with two series devices (wu = wl = W/2) for the same input capacitance. Each half has half the drive and they are in series, so **delay goes up ~4X** while **leakage drops ~20X** (stack effect; even less saving for FinFETs). The slide verdict: **not a good trade compared with increasing Vth**, but useful for leakage in non-critical, shallow gates in addition to high Vt. (Library equivalent, added: "stacked" or long-channel always-on cells, and the 2-high keeper or tail devices used in retention and bitline circuits.)

**Dual-Vth optimization (slide 43).** Each transistor gets a high or low Vth: low Vth on speed-critical paths, high Vth everywhere else. The goal is the best leakage between the all-low-Vt and all-high-Vt extremes **while meeting the delay constraint**. In practice this is the multi-Vt swap step in synthesis/P&R (start with HVT, upgrade only the cells on critical paths, or start with LVT and downgrade cells with slack).

**Vth plus input state (slides 44–45).** If the standby input state is known, the devices that are **off** in standby are the ones that set leakage, so only they need high Vt; devices that are on in standby can stay low-Vt for speed. The bar charts (normalized leakage):

- All low-Vt: 1X
- Dual-Vt (no state): ~2X lower
- Dual-Vt with a random standby state: ~7.8X lower
- Dual-Vt with the optimal standby state: ~9.7X lower

Dual-Vt summary: **pros** are low overhead and that it **always works, including at runtime** (it is not a standby-only technique); **cons** are extra fab cost (implant masks) and modest savings, ~2–3X by itself.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Multi-Vt is the main runtime-leakage tool, and it is delivered through the library: every cell exists in ULVT/LVT/SVT/HVT (and sometimes long-L) variants with identical footprints and pin positions, so the tool can swap them without touching routing. In SRAM/ROM, peripheral logic on the access path is usually LVT, while bitcells and non-critical decoder/control logic are HVT. The 0.5 V row of the table explains why low-VDD (DVFS minimum) corners push designs back toward LVT.

</div>

### 9.11 Power gating (MTCMOS) and its variants

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p101-1.jpeg" alt="Power gating can use a footer, a header, or both; an NMOS footer is more area efficient, and footer plus header blocks leakage under all input patterns." loading="lazy"><figcaption>Power gating can use a footer, a header, or both; an NMOS footer is more area efficient, and footer plus header blocks leakage under all input patterns. · EECS 627 lecture packet · page 101</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p101-2.jpeg" alt="Super-cutoff CMOS uses a normal-Vt thin-oxide switch driven to a negative VGS in standby, which makes it area efficient and fast when active." loading="lazy"><figcaption>Super-cutoff CMOS uses a normal-Vt thin-oxide switch driven to a negative VGS in standby, which makes it area efficient and fast when active. · EECS 627 lecture packet · page 101</figcaption></figure>

**Power gating (slide 47).** Disconnect the module from its supply rail(s) during standby using a **footer** (NMOS to GND), a **header** (PMOS to VDD), or both. It is most effective when **high-Vt** devices are available for the switch while the logic stays low-Vt; this combination is what **MTCMOS** (multi-threshold CMOS) refers to. It fits into standard design flows, but the switch costs performance (see 9.12).

**Options (slide 48):**

- **NMOS sleep transistor is more area efficient than PMOS** (higher mobility, so less width for the same on-resistance).
- **Footer + header** gives the most effective leakage reduction **under all input patterns**, because a single switch can be bypassed by a sneak path depending on the stored or input state (see 9.13).

**Boosted-gate MOS (BGMOS, slide 49).** The leak cut-off switch (LS) is **high-Vt** (low leakage) and **thick-oxide** (no gate leakage). To recover its poor drive, its gate is **boosted** above VDD in active mode (Vboost); in standby it goes to 0 V. Requires a boosted supply and thick-oxide devices.

**Boosted-sleep MOS / Super-cutoff CMOS (SCCMOS, slide 50).** The switch is a **normal (or high) Vt, thin-oxide** device. In active mode its gate is at VDD (good performance, small area). In standby its gate is driven to **−Vboost**, a **negative VGS**, which pushes it deep into cutoff ("super cutoff"). Each S of negative VGS buys a decade of subthreshold leakage, so a normal-Vt switch can match a high-Vt one.

<div class="co co-guard"><p class="co-t">Common trap</p>

Super-cutoff does not scale without limit. As VGS goes more negative, VDG across the switch grows and **GIDL** (9.3) rises, so total leakage reaches a minimum and then increases again. The thin-oxide switch also sees VDD + Vboost across its gate oxide in standby, which is a reliability (TDDB) limit (added).

</div>

### 9.12 Virtual rails, sleep-transistor sizing and decap placement

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p101-3.jpeg" alt="In active mode the virtual rails carry IR/switching noise; in standby they collapse (virtual VDD falls, virtual GND rises) as the logic leaks through the off switch." loading="lazy"><figcaption>In active mode the virtual rails carry IR/switching noise; in standby they collapse (virtual VDD falls, virtual GND rises) as the logic leaks through the off switch. · EECS 627 lecture packet · page 101</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p101-4.jpeg" alt="Decap on the virtual rail helps performance and gets gated with the block, but lengthens the convergence time and needs a slow header turn-on to limit in-rush current." loading="lazy"><figcaption>Decap on the virtual rail helps performance and gets gated with the block, but lengthens the convergence time and needs a slow header turn-on to limit in-rush current. · EECS 627 lecture packet · page 101</figcaption></figure>

**Virtual supplies (Tschanz, JSSC'03).** The gated block sits between a virtual VDD and a virtual GND.

- **Active**: the switches are on, and the virtual rails sit near VDD and GND but carry extra noise, since the switch resistance adds to the rail impedance.
- **Standby**: the switches are off; the block leaks through them, and the virtual rails drift toward each other (virtual VDD falls, virtual GND rises) until the block's leakage equals the switch leakage. This collapse is what reduces leakage. In the logic, VDS falls (DIBL) and the off devices become negatively biased, just like a stack. It is also what destroys the stored state.

**Sleep transistor sizing (slide 52).**

- The switch is not free. In active mode the circuit sees it as **extra power-line resistance**, so wider is better for performance.
- Width costs area (and leakage of the switch itself, and gate energy each time it toggles).
- Method: **minimize the switch size for a given ripple** (e.g. 5% of VDD) on the virtual rail. This requires the **worst-case vector**, i.e. the input pattern that draws the largest simultaneous current.

A first-order sizing relation (added):

```latex
R_{sleep} \approx \frac{1}{\mu C_{ox}\frac{W}{L}(V_{DD}-V_{th,H})}, \qquad I_{peak}\,R_{sleep} \le \Delta V_{allowed}\;(\text{e.g. }0.05\,V_{DD})
```

Because a block's current is spread over time and over many gates, the shared switch only has to carry the peak of the sum, not the sum of each gate's peak. This is the main area advantage of block-level gating over gate-level gating (added).

**Decap placement (slide 53):**

| | Decap on supply rails | Decap on virtual rails |
|---|---|---|
| Performance | worse (−) | better (+) |
| Convergence time | shorter (+) | longer (−) |
| Oxide leakage savings | none (−) | yes (+), decap is gated too |

Decap on the virtual rail sits right next to the logic, so it smooths the noise the switch creates. Its own oxide leakage is cut off in standby, but it must be recharged on every wake-up, which (1) slows convergence (longer time constant) and (2) creates a large **in-rush current**. Hence the note: **turn on the header slowly**.

**Wake-up and ground bounce (added, standard practice).** At wake-up the switch has to recharge the whole virtual-rail capacitance (logic plus decap) from its collapsed level. If all switches turn on at once, the in-rush current i = C·dV/dt causes IR drop and L·di/dt **bounce on the always-on rails**, which can upset neighboring active blocks and retention cells. Standard fixes: daisy-chain the switch enables so they turn on in sequence (often a weak "trickle" chain followed by the strong chain), limit slew, and wait for an acknowledge signal before releasing the block. The wake-up latency and the switching energy set the minimum sleep time worth entering (see the break-even problem in 9.x).

<div class="co co-eq"><p class="co-t">Equation card</p>

Break-even sleep time: E_overhead = ΔP_leak · t_BE, so t_BE = (C_switch·VDD² + C_virtual·VDD²) / (VDD·(I_leak,active − I_leak,sleep)). Sleep only pays when the idle interval is longer than t_BE plus the wake-up latency.

</div>

### 9.13 Preserving state

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p103-1.jpeg" alt="A state-retaining MTCMOS latch keeps a high-Vt, always-powered inverter pair in the feedback loop while the low-Vt forward path is gated, at the cost of setup time." loading="lazy"><figcaption>A state-retaining MTCMOS latch keeps a high-Vt, always-powered inverter pair in the feedback loop while the low-Vt forward path is gated, at the cost of setup time. · EECS 627 lecture packet · page 103</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p103-2.jpeg" alt="With only one polarity of sleep device, a sneak path through the always-on high-Vt loop and the gated low-Vt devices still leaks, so both header and footer are needed." loading="lazy"><figcaption>With only one polarity of sleep device, a sneak path through the always-on high-Vt loop and the gated low-Vt devices still leaks, so both header and footer are needed. · EECS 627 lecture packet · page 103</figcaption></figure>

Collapsing the virtual rail **loses the state of the registers** (slide 54). Options:

1. **Keep registers on nominal VDD** (not gated). They keep their state but continue to leak.
2. **Lower VDD in sleep** (data-retention voltage). Less leakage, but there is some impact on robustness, noise margin and soft-error immunity.
3. **Retain state through scan (slide 55)**: scan out the state into a local, non-gated (high-Vt) memory before entering standby, and scan it back in on wake-up. No special retention flip-flop is needed, a single footer/header is enough, and the existing scan circuitry is reused. Cost: a non-power-gated memory and a **slower transition** into and out of standby.
4. **State-retaining MTCMOS latch (slide 56)**: the critical-path devices (input inverter, forward-path inverter) are low-Vt and power gated (SBY devices). The feedback inverter pair that holds the state is **high-Vt and always powered**. The high-Vt devices in the loop make the latch slower to write: a **setup-time penalty**.

**Sneak leakage paths (slides 57–58).** If only a footer (or only a header) gates the low-Vt inverter, the always-on high-Vt loop drives the low-Vt devices' outputs and a current path closes from the real VDD through the always-on inverter, into the gated inverter's output, and through its low-Vt device to the virtual rail, bypassing the sleep device (shown for both stored values, 0 and 1). So **both polarities of high-Vt sleep devices** are needed.

**MTCMOS derivatives (slide 59)**, which trade some leakage saving for retaining state:

- **Clamping**: a diode in parallel with the high-Vt footer limits how far virtual GND can rise, so the logic still sees roughly VDD − V_diode and keeps its state, with less leakage than ungated.
- **Retention**: an HVT header for active mode, plus a **small-W high-Vt header from a lower V_retain** supply to virtual VDD for sleep. The block sits at a reduced retention voltage.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

These are the cells a library team builds for power-gated designs: header/footer switch cells, retention flops (a balloon latch on the always-on supply with save/restore pins), isolation cells (clamp outputs of a gated domain to a known value), and always-on buffers. They need special .lib attributes (power-pin and related-supply annotations for UPF/CPF), leakage characterized in both states, and the sneak-path checks above. SRAM macros do the same in hardware: periphery power-down, array source biasing or a reduced retention VDD (light sleep / deep sleep / shutdown modes), with retention voltage limited by the bitcell's data-retention voltage at high sigma (added).

</div>

### 9.14 Sleep-transistor placement and layout

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p104-1.jpeg" alt="Sleep switches are added as &quot;strapper&quot; cells in the standard-cell rows, connecting the global VDD/GND straps to the virtual rails that feed the row." loading="lazy"><figcaption>Sleep switches are added as &quot;strapper&quot; cells in the standard-cell rows, connecting the global VDD/GND straps to the virtual rails that feed the row. · EECS 627 lecture packet · page 104</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p104-2.jpeg" alt="In an ALU test chip, sleep transistors cost 6% area as PMOS headers and 3% as NMOS footers, for a ~20–100X leakage reduction." loading="lazy"><figcaption>In an ALU test chip, sleep transistors cost 6% area as PMOS headers and 3% as NMOS footers, for a ~20–100X leakage reduction. · EECS 627 lecture packet · page 104</figcaption></figure>

**Placement.** Without gating, the M3/M4 VDD/GND straps connect straight down to the rows' VDD/GND rails. With gating, **"strapper" cells** are inserted in the standard-cell rows; they hold the header and footer devices that connect the global VDD/GND (upper metal) to the row's **VDD′ and GND′** (virtual rails). This is the distributed (column or checkerboard) switch style used by current flows.

**Evaluation (ALU layout, slide 61):**

- Pros: **large leakage improvement (~20–100X)**, fast transition, modest area overhead (**PMOS 6%, NMOS 3%**).
- Cons: some performance degradation; **worse supply integrity** (extra series resistance, virtual-rail noise).

### 9.15 Body biasing and the comparison

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p104-3.jpeg" alt="Dynamic body biasing applies forward body bias in active mode (low Vt, fast) and reverse body bias in standby (high Vt, low leakage), and can also compensate Vt variation." loading="lazy"><figcaption>Dynamic body biasing applies forward body bias in active mode (low Vt, fast) and reverse body bias in standby (high Vt, low leakage), and can also compensate Vt variation. · EECS 627 lecture packet · page 104</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p104-4.jpeg" alt="Comparison: stacking 1–2X, power gating 10–1000X, dynamic body bias 2–20X, dual-Vt 2–3X." loading="lazy"><figcaption>Comparison: stacking 1–2X, power gating 10–1000X, dynamic body bias 2–20X, dual-Vt 2–3X. · EECS 627 lecture packet · page 104</figcaption></figure>

**Dynamic body biasing (slides 63–65).** Raise thresholds during sleep with **reverse body bias (RBB)**, and optionally lower them in active mode with **forward body bias (FBB)** (Kuroda ISSCC'96; Tschanz JSSC'03):

```latex
V_t = V_{t0} + \gamma\left(\sqrt{2\phi_F - V_{BB}} - \sqrt{2\phi_F}\right)
```

- Pros: **no delay penalty** in active (the logic itself is unchanged), and it can be used to **compensate threshold variation** (adaptive body bias per die).
- Cons:
    - Requires a **triple-well** process (N-isolation under the P-well so VBBN can differ from the substrate), an area penalty.
    - **Limited range of Vt adjustment (<100 mV)**, much smaller at FinFET/GAA nodes, almost 0 (β ≈ 0.008).
    - **Limited leakage reduction (<10X)**, even less at advanced nodes; deep RBB also increases junction leakage and GIDL (added).
    - **Energy cost** of charging and discharging the large well capacitance, and slow activation.

**Example (slide 66, Miyazaki, Springer'06):** application processor (SH-mobile), 250 nm, 1.8 V core, 3.3 V I/O, 3.3M transistors, with a 0.13 mm² body-bias controller (VBC) generating 3.3 V and −1.5 V wells. Measured standby leakage: about **1300 µA** with substrate control off vs **46.5 µA** with it on (subthreshold leakage, pn-junction leakage and 3.3 V area leakage shown as components).

**Comparison (slide 67):**

| | Transistor stacking | Power gating (MTCMOS) | Dynamic body biasing | Dual-Vth |
|---|---|---|---|---|
| Pros | conventional technology, no performance impact | conventional technology, conceptually simple, most effective | reuses standard designs, no performance impact | works at run time, no/minor performance loss, no layout change, extremely common |
| Cons | limited impact, special registers | performance impact, changes in design flow | triple well, slow activation, does not scale well | limited reduction, extra mask layers |
| Potential savings | 1–2X | 10–1000X | 2–20X | 2–3X |

**Summary (slide 68).** For runtime leakage: dual-Vth primarily, MTCMOS common, Lgate biasing in use today. Statistical analysis and optimization matter because leakage and performance are correlated (a fast die is a leaky die). New devices (double-gate FETs and beyond) change the picture. Open question: will we get a better switch?

<div class="co co-core"><p class="co-t">Core idea</p>

Runtime leakage is managed by multi-Vt and channel-length choices in the library. Standby leakage is managed by power gating, with retention and wake-up handled carefully. Stacking and body bias, strong in planar, lose most of their effect in FinFET/GAA because DIBL and body effect have shrunk.

</div>

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

In an SRAM/ROM array, millions of cells leak in parallel onto shared bitlines (added). Bitline leakage from the unselected cells on a column fights the read current of the selected cell, so the number of cells per bitline is limited by the ratio of on-current to total off-current at the hot, fast-leakage corner. That is a sense-margin problem as well as a power problem, and it is why ROM/SRAM designs use HVT access devices, short local bitlines, keepers and negative wordline or source biasing. The DIBL and GIDL limits from this lecture set how far those biasing tricks can go.

</div>

### 9.x Check yourself

1. **(Exam 2, P2A) An inverter (NMOS M1 and PMOS M4, both 1 µm) has an NMOS footer M2 (1 µm) between virtual ground VGND and GND. NMOS Vth = 300 mV, PMOS Vth = 200 mV, I0 = 300 µA/µm, η = 1, VT = 25 mV, γ = β = 0, VDD = 1 V. Input = VDD, sleep_bar = 0. What is the steady-state leakage?**
   The off PMOS (Vth = 200 mV) leaks far more than the footer (Vth = 300 mV), so VGND rises close to VDD and the footer has the full VDD across it, (1 − e^(−Vds/VT)) ≈ 1. Leakage is set by M2: I = 300 µA·e^(−300/25) = 300 µA·e^(−12) ≈ **1.8 nA**.

2. **(Exam 2, P2B) To make VGND reach steady state instantly, a small transistor M3 shorts VGND to VDD when sleep is asserted. With Cg = Cj = 1 fF/µm, what is the minimum sleep time for an energy saving?**
   Overhead: switching the sleep transistor gate (Cg·1 V²) plus charging the junction capacitances of M1, M2, M4 to VDD; the solution totals E_overhead = **5 fJ**. Without gating the leakage is through the PMOS: 300 µA·e^(−200/25) ≈ **100 nA**. With gating: **1.8 nA**. Power saved = 1 V·(100 − 1.8) nA = **98.2 nW**. Break-even: t = 5 fJ / 98.2 nW ≈ **51 ns** (assuming leakage stops instantly).

3. **(Exam 2, P2C) Was the shorting transistor a good idea? With the simplified model (γ = β = 0), does steady-state sleep leakage increase, decrease or stay the same? And with a real model?**
   Simplified model: **increase**. M2 starts leaking at its full steady-state value immediately rather than after VGND drifts up, and VGND sits slightly higher (at VDD), so M2 leaks very slightly more. Real model: **increase**. With β ≠ 0 (**DIBL**), VGND held at VDD puts the maximum VDS across M2, which lowers its effective Vth and raises its leakage.

4. **(Exam 2, P2D) Super-cutoff lowers an NMOS switch's VGS below 0 V to cut subthreshold leakage. Why does total leakage eventually rise again as VGS keeps decreasing?**
   **GIDL.** With VGS strongly negative and VDS large, the gate-drain field causes band-to-band tunneling in the overlap region, and current flows from drain to body. It grows with VDG, so it eventually outweighs the falling subthreshold current.

5. **Why does a 2-high NMOS off stack leak ~9X less than a single device in planar 90 nm, but only ~3X less in a 16 nm FinFET?**
   The intermediate node rises to VM ≈ λd·VDD/(1+2λd), which gives the top device a negative VGS and a smaller VDS. Both act through the DIBL coefficient. Planar λd ≈ 0.1 gives VM ≈ 100 mV and Istack/Iinv ≈ 0.12; FinFET λd ≈ 0.05 gives VM ≈ 35 mV and ≈ 0.33. Less DIBL means less stack benefit.

6. **For a NAND3 pull-down, which input state minimizes subthreshold leakage, and what rule governs gate leakage?**
   000 (all three off, 1 pA vs 11 pA for 011). Isub depends mainly on the number of off devices, then on VDS across the off stack. Igate depends on the position of on devices: an on device whose channel is at 0 V leaks most (~2 pA); one with source/drain at VDD leaks ~0. Off devices with the drain at VDD show a small reverse current.

7. **In a FinFET process, going from ULVT to HVT cuts leakage to 0.003 at 0.8 V and 0.001 at 0.5 V. Why is HVT acceptable at 0.8 V but not at 0.5 V?**
   Delay ∝ VDD/(VDD − Vth)^α. At 0.8 V the HVT delay penalty is 2.28X; at 0.5 V, VDD is close to the HVT threshold and the penalty is 13.81X. Low-VDD designs need low-Vt devices and must control leakage with gating instead.

8. **What are the trade-offs of putting decap on the virtual rail instead of the real supply rail of a power-gated block?**
   Virtual-rail decap gives better active performance (it suppresses the noise the switch adds) and its oxide leakage is gated off in sleep. But it lengthens convergence (wake-up) time and creates large in-rush current when the header turns on, so the header must be turned on slowly (staged), or the in-rush causes IR drop and ground bounce on the always-on rails.


## Lecture 10 — Inductance

On-chip inductance is a property of a current **loop**, not of a wire: it depends on where the return current flows, and that changes with frequency. This lecture builds the loop picture, shows how resistance and inductance trade places as frequency rises (proximity and skin effects), traces the return current of a switching signal through the VDD and GND grids, and then covers inductive effects on delay and crosstalk, layout techniques to control inductance, and the idea of an optimal inductance for repeated wires. For a GPU circuit designer it matters on wide, fast global wires (clocks, top-metal buses) and in the power grid, where loop inductance sets supply droop (see L04).

### 10.1 Inductance as a loop property

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p107-1.jpeg" alt="Inductance belongs to a closed current loop and scales with loop area, and on chip the return path is whatever conductor carries the current back: power/ground lines, substrate or other signals." loading="lazy"><figcaption>Inductance belongs to a closed current loop and scales with loop area, and on chip the return path is whatever conductor carries the current back: power/ground lines, substrate or other signals. · EECS 627 lecture packet · page 107</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p107-2.jpeg" alt="Inductance causes oscillation, over/undershoot and inductive crosstalk, and it changes delay and sharpens transitions compared with an RC model." loading="lazy"><figcaption>Inductance causes oscillation, over/undershoot and inductive crosstalk, and it changes delay and sharpens transitions compared with an RC model. · EECS 627 lecture packet · page 107</figcaption></figure>

**Definition.** Inductance relates the voltage induced in a loop to the change of magnetic flux through it. To first order, **loop inductance is proportional to loop area**:

```latex
L \approx \mu A,\qquad V = L\,\frac{dI}{dt}
```

**In VLSI**, a driver injects current into a wire, and the current returns to the driver through a **return path**:

- power and ground lines (they are AC ground);
- the substrate;
- other signal lines.

The inductance of a signal therefore cannot be known from the wire alone; it depends on how far away its return current flows.

**Inductive effects on signal nets (slide 5):** oscillations, under/overshoot, inductive crosstalk; an increase in signal delay but a reduction in transition times. The RC-model waveform is a clean monotonic edge; the RLC-model waveform of the same net has faster edges with ringing and overshoot.

<div class="co co-core"><p class="co-t">Core idea</p>

There is no such thing as "the inductance of a wire" on chip. There is the inductance of a loop, set by the signal path and the return path together. Every inductance-control technique in this lecture works by making the return path closer (smaller loop) or by cancelling flux.

</div>

### 10.2 Frequency dependence: proximity and skin effect

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p108-1.jpeg" alt="At low frequency R dominates and return current spreads (low R, high L); at high frequency jωL dominates and return current crowds under the signal (high R, low L)." loading="lazy"><figcaption>At low frequency R dominates and return current spreads (low R, high L); at high frequency jωL dominates and return current crowds under the signal (high R, low L). · EECS 627 lecture packet · page 108</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p108-2.jpeg" alt="At very high frequency the skin effect confines current to a depth δ = √(2ρ/ωµ), about 2 µm in copper at 1 GHz, so R rises as √f." loading="lazy"><figcaption>At very high frequency the skin effect confines current to a depth δ = √(2ρ/ωµ), about 2 µm in copper at 1 GHz, so R rises as √f. · EECS 627 lecture packet · page 108</figcaption></figure>

**Currents seek the path of least impedance**, Z = R + jωL, so the return path depends on frequency.

- **Low frequency: R dominates.** The return current **spreads** over many parallel conductors to minimize resistance. **Result: low resistance, high inductance** (large loop).
- **High frequency: jωL dominates.** The return current **crowds close** to the signal to minimize loop area (**proximity effect**). **Result: high resistance (fewer conductors used), low inductance.**
- **Very high frequency: skin effect.** Current travels near the conductor surface, with density J = e^(−d/δ) from the surface, so R ~ f^0.5.

```latex
\delta = \sqrt{\frac{2\rho}{\omega \mu}}
```

For copper at room temperature (ρ = 1.68·10⁻⁸ Ω·m, µ = 1.256·10⁻⁶ H/m): **60 Hz → 8.42 mm, 100 MHz → 6.52 µm, 1 GHz → 2.06 µm.** The slide's cross-sections show uniform current at low frequency, current shifted toward the return conductor at high frequency, and a thin surface layer at very high frequency.

**Summary (slide 10).** As frequency rises, R increases (proximity, then skin effect) and L decreases (proximity effect); the R(f) and L(f) curves span roughly 10 MHz to 1000 GHz. Yet in Z = R + jωL, R↑, L↓ and ω↑, and the slide asks: **why is L a problem at high frequencies?** Because L falls only until the return path is as close as it can get, then saturates, while ω keeps growing, so ωL eventually exceeds R. Inductance matters most for **wide, thick, low-resistance** wires (top-metal clocks and buses) driven by **strong drivers with fast edges** (added). A common rule of thumb (added): inductance is significant when the rise time is shorter than about twice the time of flight, tr < 2·l·√(L·C) per unit length, and the line's total resistance is below about twice its characteristic impedance √(L/C).

<div class="co co-guard"><p class="co-t">Common trap</p>

"Skin effect is what makes on-chip inductance frequency dependent." For on-chip wires a few µm thick, skin depth only reaches wire dimensions around and above 1 GHz (2.06 µm). The dominant on-chip effect in the GHz range is the **proximity effect**: the *return path* moves, which changes L much more than skin effect changes R.

</div>

### 10.3 Current flow in the power grid when a signal switches

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p109-1.jpeg" alt="A rising signal draws charging current from VDD that flows through the signal-to-GND capacitance into the ground grid and back through the supply." loading="lazy"><figcaption>A rising signal draws charging current from VDD that flows through the signal-to-GND capacitance into the ground grid and back through the supply. · EECS 627 lecture packet · page 109</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p109-2.jpeg" alt="A falling signal discharges the signal-to-VDD capacitance, so that part of the return current flows in the VDD grid." loading="lazy"><figcaption>A falling signal discharges the signal-to-VDD capacitance, so that part of the return current flows in the VDD grid. · EECS 627 lecture packet · page 109</figcaption></figure>

**Picture (slide 12):** a signal line runs between a VDD grid (red) and a GND grid (black), with distributed capacitance from the signal to both grids and the receiver's gate capacitance at the end.

- **Rising signal (slide 13):** current flows from the VDD pad through the VDD grid into the driver's PMOS, along the signal line, through the **capacitance between the signal line and the GND grid** (interconnect and gate), into the GND grid, and back through the supply (battery/decap) to VDD.
- **Device capacitances (slide 14):** part of the charging current flows through the receiver's device capacitances as well.
- **Falling signal (slide 15):** the driver's NMOS discharges the **capacitance between the signal line and the VDD grid**; that current circulates through the VDD grid and the driver.

**Consequence:** the return current of a switching signal is split between the VDD and GND grids in proportion to how the signal's capacitance is split between them, and it crosses from one grid to the other through decap (explicit or implicit) or through the supply. Placing decap changes where the return current can "jump", and therefore the loop area (this is Exam 2, P3).

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

For a long bitline, wordline or global clock, the return path is the power grid around it. Shielding with VDD/VSS lines, the local grid pitch and the decap between rails all decide the loop inductance. In EM/IR terms, the same return currents add AC current to the rail segments next to busy signals.

</div>

### 10.4 Frequency of interest and inductive effects on delay

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p109-3.jpeg" alt="A trapezoidal signal&#x27;s spectrum is flat to 1/(π·tp), falls 20 dB/dec to 1/(π·tr) and 40 dB/dec beyond, so with tr ≈ 10 ps the content reaches about 30 GHz." loading="lazy"><figcaption>A trapezoidal signal&#x27;s spectrum is flat to 1/(π·tp), falls 20 dB/dec to 1/(π·tr) and 40 dB/dec beyond, so with tr ≈ 10 ps the content reaches about 30 GHz. · EECS 627 lecture packet · page 109</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p109-4.jpeg" alt="Driving an 8 mm × 7 mm grid line, the far-end voltage overshoots well above its final value and the line current peaks near 16 mA and rings." loading="lazy"><figcaption>Driving an 8 mm × 7 mm grid line, the far-end voltage overshoots well above its final value and the line current peaks near 16 mA and rings. · EECS 627 lecture packet · page 109</figcaption></figure>

**Frequency of interest.** A trapezoidal pulse with period T, pulse width tp and rise time tr has a spectrum with harmonics at multiples of f₀ = 1/T under an envelope that is flat up to 1/(π·tp), falls at 20 dB/dec up to 1/(π·tr), and at 40 dB/dec above. With **tr ≈ 10 ps and tp ≈ 300 ps**, the corners are near **1 GHz and 30 GHz**. The **rise time, not the clock frequency**, sets the highest frequency that matters, so the R and L values to use are those at tens of GHz (high R, low L, proximity regime).

**Inductive effects (slide 18).** An inverter drives a line at B across a 7 mm × 8 mm grid to a receiver at C. In simulation:

- the far-end voltage (blue) overshoots to about 1.08 V on a 0.8 V swing and rings for several tens of ps;
- the near-end voltage (green) shows a step/plateau around 0.5 V: the driver initially sees the line's characteristic impedance and waits for the reflection (added interpretation);
- the line current peaks near 16 mA, swings to about −7.5 mA and rings down.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p110-1.jpeg" alt="Compared with an RC model, the RLC near end shows a plateau and the far end starts later but switches faster, so inductance shifts delay and sharpens edges." loading="lazy"><figcaption>Compared with an RC model, the RLC near end shows a plateau and the far end starts later but switches faster, so inductance shifts delay and sharpens edges. · EECS 627 lecture packet · page 110</figcaption></figure>

**RLC vs RC (slide 19).** For the same net (A rising input, B near end, C far end, falling):

- **Near end B:** the RLC waveform falls faster at first, then stalls on a plateau near 0.45 V before finishing.
- **Far end C:** the RLC waveform starts later (time of flight) but has a much sharper transition, and slightly undershoots below 0 V.
- The RC model misses both the plateau and the steeper far-end slope, so it mis-predicts both delay and slew.

<div class="co co-eq"><p class="co-t">Equation card</p>

```latex
f_{knee} \approx \frac{1}{\pi t_r},\qquad \delta = \sqrt{\frac{2\rho}{\omega\mu}},\qquad V = L\frac{dI}{dt},\quad V_{victim} = m\frac{dI_{agg}}{dt}
```
tr = 10 ps → ~30 GHz. Copper δ: 6.52 µm at 100 MHz, 2.06 µm at 1 GHz.

</div>

### 10.5 Inductive coupling (crosstalk)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p110-2.jpeg" alt="The aggressor&#x27;s current loop links flux into the victim&#x27;s loop through mutual inductance m, inducing Vy = m·dIx/dt, so a unipolar aggressor current gives a bipolar victim glitch." loading="lazy"><figcaption>The aggressor&#x27;s current loop links flux into the victim&#x27;s loop through mutual inductance m, inducing Vy = m·dIx/dt, so a unipolar aggressor current gives a bipolar victim glitch. · EECS 627 lecture packet · page 110</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p110-3.jpeg" alt="On a 3 mm bus the RC model predicts a small victim dip, but the RLC model shows a larger glitch of about 0.18 V of the opposite polarity." loading="lazy"><figcaption>On a 3 mm bus the RC model predicts a small victim dip, but the RLC model shows a larger glitch of about 0.18 V of the opposite polarity. · EECS 627 lecture packet · page 110</figcaption></figure>

**Mechanism (slides 21–25).** Two drivers share the same return grid. When the aggressor switches, its current flows out on the signal line and back in a loop through the grid; the victim's loop (signal plus its own return) overlaps that loop, so flux couples between them (the two overlapping ellipses). In circuit form the two lines are coupled inductors with mutual inductance m, and the victim (held at 0) sees a series source:

```latex
V_y = m \cdot \frac{dI_x}{dt}
```

The aggressor current Ix is a single pulse, so dIx/dt is positive then negative, and **the victim glitch Vout is bipolar** (one lobe each way).

**Bus example (slide 26).** Five parallel wires over 3 mm; the aggressor B_Aggressor falls from 1.4 V when A rises.

- **RC model:** the victim dips slightly below 0 V (capacitive coupling follows the aggressor's direction).
- **RLC model:** the victim rises by about **0.18 V**, the opposite direction, then settles.

Two practical conclusions (added): inductive noise can have the opposite sign to capacitive noise, so the two partly cancel or add depending on geometry; and because return loops are large, inductive coupling reaches **far beyond the nearest neighbour**, so shielding only the adjacent wire does not remove it.

<div class="co co-guard"><p class="co-t">Common trap</p>

Capacitive crosstalk is local (nearest neighbours, falls fast with spacing) and is fixed by spacing or a shield wire. Inductive crosstalk is set by **loop overlap**, which can be large; a shield helps only if it actually carries the return current close to the signal.

</div>

### 10.6 Inductance avoidance

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p111-1.jpeg" alt="A signal over a power grid returns through the grid wires, and the loop area is set by how far away the nearest power/ground wires are." loading="lazy"><figcaption>A signal over a power grid returns through the grid wires, and the loop area is set by how far away the nearest power/ground wires are. · EECS 627 lecture packet · page 111</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p111-2.jpeg" alt="A denser power/ground grid gives close-by return paths and smaller loops, at the cost of more metal." loading="lazy"><figcaption>A denser power/ground grid gives close-by return paths and smaller loops, at the cost of more metal. · EECS 627 lecture packet · page 111</figcaption></figure>

**Guidelines (slide 28):** shielding; dedicated ground planes/returns; interdigitated wires; staggered inverters; twisted-bundle layout structures.

**Power grid as the return path (slides 29–32).** The grid is orthogonal VDD and GND stripes; a signal runs over it; its return current flows back through the nearby grid wires, and the loop closes through the driver. **Denser grid (slide 33):** close-by return paths → smaller loop → lower L, but it increases metallization.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p111-3.jpeg" alt="Dedicated power/ground shields on both sides of a signal keep the return path as close as possible." loading="lazy"><figcaption>Dedicated power/ground shields on both sides of a signal keep the return path as close as possible. · EECS 627 lecture packet · page 111</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p111-4.jpeg" alt="Interdigitation splits a wide conductor into several narrow wires with shields in between, so every piece has a close return." loading="lazy"><figcaption>Interdigitation splits a wide conductor into several narrow wires with shields in between, so every piece has a close return. · EECS 627 lecture packet · page 111</figcaption></figure>

- **Dedicated shields (slide 34):** sandwich the signal between power/ground shields so the return is as close as possible. Standard for global clocks (added).
- **Power/ground plane (slide 35):** reduces inductance at both low and high frequencies, at the cost of more metallization.
- **Interdigitation (slide 36, Massoud '98):** split a wide conductor into multiple wires with shields between them, so each segment has a nearby return.

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p112-1.jpeg" alt="Inserting power/ground shields between bus wires reduces both capacitive and inductive coupling." loading="lazy"><figcaption>Inserting power/ground shields between bus wires reduces both capacitive and inductive coupling. · EECS 627 lecture packet · page 112</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p112-2.jpeg" alt="A twisted-bundle layout routes nets in opposite loops, so the flux from adjacent nets cancels." loading="lazy"><figcaption>A twisted-bundle layout routes nets in opposite loops, so the flux from adjacent nets cancels. · EECS 627 lecture packet · page 112</figcaption></figure>

**For buses (slides 37–42):**

- **Increase spacing (slide 38):** reduces both capacitive and inductive coupling, at area cost.
- **Shields (slide 39):** P/G wires between adjacent signals reduce both couplings and give each signal a close return.
- **Staggered inverters (slide 40):** offset repeaters on adjacent wires to reduce the overlap of their switching segments; reduces capacitive and inductive coupling.
- **Twisted bundle (slide 41, Zhong '00):** nets swap tracks so the induced loops have opposite orientation and the magnetic flux from adjacent nets cancels.
- **Active shielding (slide 42):** a variant in which the shield structure is driven rather than static; the slide only shows the circuit and simulated waveforms.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

The same toolbox (dense P/G straps, shields on both sides, twisted or swizzled bitlines) appears in memory arrays, where long parallel bitlines and wordlines are the classic coupling-noise victims and sense margin depends on a quiet reference. For cell libraries, it explains why clock buffers and high-drive cells are placed under shielded, grid-aligned routes.

</div>

### 10.7 Optimal inductance for repeated interconnect

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p112-3.jpeg" alt="In a repeated line, a modest inductance sharpens the edge arriving at each repeater, and the faster slopes cascade down the chain to cut overall delay." loading="lazy"><figcaption>In a repeated line, a modest inductance sharpens the edge arriving at each repeater, and the faster slopes cascade down the chain to cut overall delay. · EECS 627 lecture packet · page 112</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p112-4.jpeg" alt="Up to about 1.4 nH, inductance improves slew about 5× and cuts total delay to about 0.87× of RC with negligible overshoot; beyond that overshoot rises rapidly and delay grows." loading="lazy"><figcaption>Up to about 1.4 nH, inductance improves slew about 5× and cuts total delay to about 0.87× of RC with negligible overshoot; beyond that overshoot rises rapidly and delay grows. · EECS 627 lecture packet · page 112</figcaption></figure>

**Idea.** Inductance is not only a nuisance: it **sharpens slopes**, and in a chain of repeaters a sharper input slope makes each repeater faster, which **cascades**. So the inductance can be tuned to an **optimal value**: minimal ringing at repeater inputs, minimal delay penalty, faster slew.

**Simulation results (slide 45), normalized to the RC case:**

- **Slew (10–90%):** improves strongly with inductance, to about 0.2–0.25 of RC (the slide's **5×**) by about 1.4 nH for repeaters 5, 8 and 11, then **saturates**; repeater 2 improves only to about 0.65 at 3 nH. The improvement builds along the chain (cascading effect).
- **Delay:** total delay falls to an **optimum of about 0.87× of RC near 1.4 nH**, then increases; delay to repeater 2 alone barely improves and rises above RC for larger L.
- **Overshoot:** negligible (below about 5% of VDD) for small inductance, then an **inflection point** near 1.3–1.4 nH after which it rises rapidly, to about 28–29% of VDD at 3 nH.

<div class="co co-core"><p class="co-t">Core idea</p>

A little inductance speeds up a repeated line by sharpening slopes; too much makes it ring. The optimum sits just before the overshoot inflection point.

</div>

### 10.x Check yourself

1. **Why is on-chip inductance frequency dependent, and in which direction do R and L move with frequency?** Current takes the path of least impedance R + jωL. At low frequency the return spreads (low R, high L); at high frequency it crowds close to the signal by the proximity effect (higher R, lower L); at very high frequency skin effect raises R further (R ~ √f).

2. **Skin depth of copper at 1 GHz, and the formula?** δ = √(2ρ/(ωµ)) = 2.06 µm (6.52 µm at 100 MHz, 8.42 mm at 60 Hz).

3. **A 3 GHz chip has 10 ps edges. What frequency should you use to judge inductive effects?** The edge rate sets it: the spectrum corner is about 1/(π·tr) ≈ 30 GHz, so evaluate R and L in the tens-of-GHz (proximity) regime, not at 3 GHz.

4. **What does inductive coupling do to a quiet victim, and how does it differ from capacitive coupling?** It induces Vy = m·dIx/dt, a bipolar glitch. In the 3 mm bus example it is about 0.18 V and opposite in sign to the small capacitive dip of the RC model, and it couples through loop overlap, so it reaches beyond nearest neighbours.

5. **(Exam 2, P3(A)) Two single-layer layouts: layout 1 has fewer, more widely spaced power/ground stripes; layout 2 has more stripes, spaced closer, but its nearest stripe is farther from the signal than layout 1's. Which has lower resistance and lower inductance at low (kHz) and high (10 GHz) frequency?** Lower R: low f → **2** (more stripes in parallel); high f → **same** (current flows only in the nearest wire, and widths/thicknesses match). Lower L: low f → **2** (current spreads over all stripes, and layout 2's stripes are closer together, giving a smaller loop); high f → **1** (current takes the nearest wire, which is closer to the signal in layout 1).

6. **(Exam 2, P3(B)) An explicit decap Cd is added between the VDD and GND grids. Layout 3: signal centred between the grids. Layout 4: signal three times closer to GND than to VDD. Signal rising, all VDD–GND current through the decap. Effect on low-frequency inductance?** Layout 3: equal signal-to-grid capacitances inject equal currents, both Cd terminals move together, no current flows through Cd, so **inductance stays the same**. Layout 4: more current enters the GND grid, Cd conducts some of it into the VDD grid, which is farther from the signal (larger loop), so **inductance increases slightly** (only slightly, because at low frequency the current spreads and the loops are large anyway).

7. **(Exam 2, P3(C)) Same layouts, high frequency?** Cd is now a short between grids and current follows the smallest loop. Layout 3: VDD and GND return loops are equal, so jumping grids gains nothing; **no (little) change**. Layout 4: current injected into the VDD grid from the far half of the signal can now jump through Cd to the closer GND grid mid-way, shrinking its loop, so **inductance decreases**, but only by a limited fraction (the solution suggests maybe 25% or less), since only the smaller signal-to-VDD current from the second half of the line is affected.

8. **Why can a repeated wire be faster with some inductance, and what limits it?** Inductance sharpens the edge at each repeater input, and faster input slopes cascade down the chain: slew improves about 5× and total delay drops to about 0.87× of RC near 1.4 nH. Beyond the inflection point overshoot rises rapidly (to about 28% of VDD at 3 nH) and delay increases.


## Lecture 11 — Compute-in-Memory

This lecture asks why AI hardware spends most of its energy moving data rather than computing, and what happens when part of the computation is pushed into the memory array itself. It surveys the memory technologies used for compute-in-memory (CIM). It then goes through SRAM-based CIM at three levels: logic on the bitline (AND/NOR/XOR, CAM), analog multiply-accumulate in the current and charge domains with ADC readout, and digital CIM with in-macro multipliers and adder trees. For a circuit designer working on SRAM, ROM and register files at a GPU company, CIM is the read path you already know (wordline pulse, bitcell current, bitline swing, sense margin), used to compute instead of read. The same variation, leakage and margin problems decide whether it works.

### 11.1 The memory wall and where CIM sits

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p114-1.jpeg" alt="External memory access costs ~1000 fJ/bit, 20X an on-chip SRAM access (50 fJ/bit) and 167X a PE operation (6 fJ/bit), so data movement dominates system energy." loading="lazy"><figcaption>External memory access costs ~1000 fJ/bit, 20X an on-chip SRAM access (50 fJ/bit) and 167X a PE operation (6 fJ/bit), so data movement dominates system energy. · EECS 627 lecture packet · page 114</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p114-2.jpeg" alt="Architectures evolve from von Neumann (separate storage and processor) to near-memory compute to in-memory compute, trading transferred data for energy efficiency." loading="lazy"><figcaption>Architectures evolve from von Neumann (separate storage and processor) to near-memory compute to in-memory compute, trading transferred data for energy efficiency. · EECS 627 lecture packet · page 114</figcaption></figure>

**Memory wall (slide 4).** In a von Neumann machine, weights and intermediate data travel through a hierarchy (NVM, DRAM, SRAM, PE controls, PE array) over a system bus. The result is long latency, high power and high hardware cost. The two responses are high-bandwidth memory, or an architecture beyond von Neumann.

**Energy numbers (Houshmand, IEDM 2020):**

```latex
E_{system} = E_{compute} + E_{on\text{-}chip\ access} + E_{external\ access}
```

| Operation | Energy (fJ/bit) |
|---|---|
| Off-chip memory | ~1000 |
| On-chip SRAM | 50 |
| PE operation | 6 |

So external access is >20X an on-chip SRAM access and >167X a PE operation. Even on chip (Wang, JSSC 2019), the **system bus** dominates: bus energy is **>26X the SRAM read energy** (slide 6 example: SRAM array read 1.6 pJ, network inside the cache macro 4.2 pJ, system bus 42 pJ vs a 32-bit add at 0.1 pJ).

**Three architectures (slide 7):**

- **Von Neumann**: memory array (storage) → read/write → data bus → processor.
- **Near-memory compute**: digital computing units placed right next to a storage array.
- **In-memory compute**: the array does storage and compute; mixed-signal or digital compute units are built into the macro.

Moving to the right reduces transferred data and raises energy efficiency.

**Device choices (slides 8–12):**

| Category | Devices | Pros | Cons |
|---|---|---|---|
| Non-CMOS (off-chip NVM / DRAM PIM) | NAND flash, DRAM | reduces external memory access | memory processes are slow and inefficient for logic |
| CMOS volatile | SRAM, eDRAM | high throughput, compatible with existing architectures | lower memory density, utilization issues |
| CMOS nonvolatile (nvCIM) | MRAM, RRAM, PCRAM | eliminates weight movement, keeps whole network on chip, instant power-on (no reload) | limited capacity (~64 Mb), so only tiny edge models; device variation and reliability |

nvCIM's edge-AI pitch (slide 12): an SRAM-CIM edge chip must reload weights from NVM after every power-on, while an nvCIM chip wakes up with its weights in place. That gives low energy and short wake-up latency for duty-cycled devices.

**Metrics (slide 13):** performance in **TOPS** (10¹² operations per second, where one add or one multiply counts as one OP), energy efficiency in **TOPS/W**, area efficiency in TOPS/mm², **accuracy loss** of the network caused by CIM non-idealities, and memory capacity. Since precision changes everything, numbers are normalized:

```latex
TOPS_{N\,bit} = TOPS_{M\,bit}\cdot\frac{M_{input}}{N_{input}}\cdot\frac{M_{weight}}{N_{weight}},\qquad TOPS_{1b} = TOPS_{8b}\cdot 8\cdot 8
```

<div class="co co-guard"><p class="co-t">Common trap</p>

CIM papers often quote 1-bit or 4-bit TOPS/W. Always normalize to the same input and weight precision before comparing. An 8b×8b operation is worth 64 binary operations.

</div>

### 11.2 Logic-in-memory: bitline computing

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p115-1.jpeg" alt="Activating two wordlines at once makes the BL compute AND of the two cells (BLB gives NOR); the 01/10 case sits between 00 and 11 and has the smallest voltage margin." loading="lazy"><figcaption>Activating two wordlines at once makes the BL compute AND of the two cells (BLB gives NOR); the 01/10 case sits between 00 and 11 and has the smallest voltage margin. · EECS 627 lecture packet · page 115</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p115-2.jpeg" alt="In an 8T bitcell with the input on RWL and the weight stored in Q, the decoupled read port discharges RBL only when both are 1: a bitwise AND, which is a 1-bit multiply." loading="lazy"><figcaption>In an 8T bitcell with the input on RWL and the weight stored in Q, the decoupled read port discharges RBL only when both are 1: a bitwise AND, which is a 1-bit multiply. · EECS 627 lecture packet · page 115</figcaption></figure>

**AND/NOR on the bitline (slides 15–16, Dhakad 2024).** Precharge BL and BLB, then assert WLA and WLB together on two cells in the same column.

- BL stays high only if **both** cells store 1 (neither discharges it), so a sense amp with V_ref between the levels reads **AND**.
- BLB stays high only if both store 0, giving **NOR**.
- **XOR** = NOR(AND, NOR), formed with a small amount of logic below the column (the "basic ALU").

The waveform shows three BL levels: 11 (no discharge), 01/10 (one cell discharging) and 00 (two cells discharging). The **01/10 case has the lower voltage signal margin**: the reference must sit between a one-cell and a zero-cell discharge (for AND), and between one-cell and two-cell discharge on the other side.

This is directly related to normal SRAM design (added):

- Multi-row activation on a 6T cell is a **read-disturb** risk: two cells fighting on the same bitline can flip the weaker one, the same mechanism that sets read stability (β ratio, read SNM) in normal reads, now with a stronger aggressor. Designs use wordline underdrive or short pulses.
- The sense margin is set by the **worst-case (high-sigma) bitcell current** and the sense-amp offset, just as in a normal read, but now between three levels instead of two.

**AND at the bitcell (slide 17, Kiran/Saxena ICECS 2015).** A standard **8T** cell (6T core plus a 2T read stack M7/M8) with input A on RWL and input B stored at Q. RBL discharges only when RWL = 1 **and** Q = 1. That is the bitwise product. Because the read port is decoupled from the storage nodes, many rows can be activated at once without read disturb, which is why 8T-style cells are common in CIM.

<div class="co co-core"><p class="co-t">Core idea</p>

A bitline is a wired-OR/AND node, and a decoupled read port is a 1-bit multiplier. CIM starts from those two facts and then counts how much charge or current lands on the bitline.

</div>

### 11.3 Content-addressable memory (CAM)

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p116-1.jpeg" alt="In a 10T CAM cell each bit computes XOR(SL, D) and pulls down the precharged match line on a mismatch, so ML stays high only if the whole word matches." loading="lazy"><figcaption>In a 10T CAM cell each bit computes XOR(SL, D) and pulls down the precharged match line on a mismatch, so ML stays high only if the whole word matches. · EECS 627 lecture packet · page 116</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p116-2.jpeg" alt="A CAM works as a routing table: the search word returns the matching address, which then indexes a RAM for the output data." loading="lazy"><figcaption>A CAM works as a routing table: the search word returns the matching address, which then indexes a RAM for the output data. · EECS 627 lecture packet · page 116</figcaption></figure>

**XOR at the bitcell (slide 18).** The 10T CAM cell is a 6T core plus two 2-device pull-down paths on the **match line (ML)**. The left path discharges ML when SL = 1 and D = 0; the right path when SL = 0 and D = 1. So each cell pulls down on **SL ⊕ D**, i.e. on a mismatch.

**Search (slide 19).** Precharge ML to VDD, then drive the search lines. All cells on the word compute XOR in parallel and form a wired NOR on the ML:

```latex
ML = \overline{(D_0\oplus SL_0) + (D_1\oplus SL_1) + \dots + (D_N\oplus SL_N)}
```

ML stays at VDD only when data = search word; a match-line sense amp (MLSA) produces the match result. Many MLs (stored words 0 … w−1) are searched in parallel, and an encoder turns the matching line into a log2(w)-bit address (slide 20).

**Use (slide 21).** CAM is typically a **routing/lookup table**: input data → matched address → output data at that address in a RAM (e.g. search 01101 matches word 01, which reads "port B"). In processors the same structure shows up in TLBs and fully associative tags (added).

Circuit issues (added): every mismatching ML discharges on every search, so **ML power** dominates. The worst case for sensing is a **1-bit mismatch** (only one weak pull-down path) vs a full match that is still slowly discharged by the **leakage of N off pull-down paths**. That is the same on-current vs N·off-current ratio that limits ROM/SRAM bitline length.

### 11.4 Analog CIM: multiplier styles

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p117-1.jpeg" alt="In-cell computing puts a multiplier in each bitcell (high parallelism, larger cell); in-array computing shares a local compute cell among a group of foundry 6T/8T cells (better density)." loading="lazy"><figcaption>In-cell computing puts a multiplier in each bitcell (high parallelism, larger cell); in-array computing shares a local compute cell among a group of foundry 6T/8T cells (better density). · EECS 627 lecture packet · page 117</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p117-2.jpeg" alt="A current-domain multiplier is an AND: the cell sources Ion only when input X (on WL) and weight W are both 1; resistive memories use LRS/HRS currents instead." loading="lazy"><figcaption>A current-domain multiplier is an AND: the cell sources Ion only when input X (on WL) and weight W are both 1; resistive memories use LRS/HRS currents instead. · EECS 627 lecture packet · page 117</figcaption></figure>

**Why analog.** MAC (multiply-accumulate) is **>99% of the operations** in a neural network, Y = Σ Xi·Wi. Analog CIM uses the array as a matrix-vector multiplier: inputs X drive the wordlines (activation), weights W sit in the bitcells, and each bitline sums the products and is read by an ADC. Three mechanisms define a design: **multiplying, accumulating, and handling multi-bit inputs/weights**.

**In-cell vs in-array (slide 24, TSMC ISSCC'21/'22):**

- **In-cell local computing**: every bitcell can multiply. High parallelism (TOPS/mm²), but a larger bitcell (extra transistors).
- **In-array local computing**: uses the foundry's compact 6T/8T cells; a local computing cell (LCC) is shared by a group of cells (a sub-array). Good memory density (Mb/mm²), medium parallelism.

**Current-domain multiplier (slide 25).** 1-bit multiplication is AND (or NOR, depending on polarity). The SRAM cell with WL = X conducts I_on when X·W = 1 and I_off otherwise. In MRAM/RRAM the weight is a resistance: low-resistance state (LRS) gives I_LRS = "1", high-resistance state (HRS) gives I_HRS = "0".

Note (added) that the "0" is not zero current. The off cells still contribute I_off (SRAM) or I_HRS (RRAM/MRAM), and with N rows active the zero level is N·I_off. The on/off ratio of the cell therefore limits how many rows can be summed, which is a direct consequence of the leakage physics of L09.

### 11.5 Current-domain accumulation

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p117-3.jpeg" alt="Cell currents add on the bitline by Kirchhoff&#x27;s current law; a clamp holds the BL at VBL and a current ADC reads Isum = ΣIi." loading="lazy"><figcaption>Cell currents add on the bitline by Kirchhoff&#x27;s current law; a clamp holds the BL at VBL and a current ADC reads Isum = ΣIi. · EECS 627 lecture packet · page 117</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p117-4.jpeg" alt="Charge-domain multipliers deposit ΔQ = ION·tpulse (current-based) or ΔQ = C0·VWL (coupling-based) on the read bitline." loading="lazy"><figcaption>Charge-domain multipliers deposit ΔQ = ION·tpulse (current-based) or ΔQ = C0·VWL (coupling-based) on the read bitline. · EECS 627 lecture packet · page 117</figcaption></figure>

**Current-domain MAC.** With all rows active, the bitline current is

```latex
Y = \sum_{i=0}^{N}(X_i\times W_i) = \sum_{i=0}^{N} I_i = I_{sum}
```

A **clamping circuit** holds the bitline at a fixed V_BL, so each cell's current does not depend on how much the bitline has moved, and a **current ADC** digitizes I_sum. The I_BL waveform shows a "current developing" phase followed by readout, with levels MAC = 0, 1, … N.

- **Pro**: simple bitcell multiplier.
- **Cons**: **nonlinearity** in the current multiplication (each cell's current depends on its V_DS, set by the clamp, and on the series resistance as the sum grows), and **large power for constant current** (a DC current flows for the whole evaluation).

**Charge-domain (voltage-domain) multiplier (slides 28–29).** Each product deposits a fixed packet of charge on the bitline:

- **Current-based**: a WL pulse of width t_pulse lets the cell discharge ΔQ = I_ON·t_pulse when W = 1.
- **Coupling-based**: the cell drives a local capacitor C0 that couples onto RBL, so ΔQ = C0·V_WL.
- **Charge-sharing-based**: the product is stored on C0 and then shared onto RBL, again ΔQ = C0·V_WL.

The capacitor-based styles are more linear, because the packet is set by a capacitor (well matched, e.g. MOM) rather than by a transistor current (which varies with Vth). That is why they are popular (added).

### 11.6 Charge-domain accumulation and multibit inputs

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p118-1.jpeg" alt="Each cell contributes ΔVi = ΔQi/CBL, and the precharged bitline accumulates the sum by charge sharing, read out by a voltage ADC." loading="lazy"><figcaption>Each cell contributes ΔVi = ΔQi/CBL, and the precharged bitline accumulates the sum by charge sharing, read out by a voltage ADC. · EECS 627 lecture packet · page 118</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p118-2.jpeg" alt="Multibit inputs can be applied as serial bits, wordline pulse width, pulse count, an analog wordline voltage, or an analog bitline voltage." loading="lazy"><figcaption>Multibit inputs can be applied as serial bits, wordline pulse width, pulse count, an analog wordline voltage, or an analog bitline voltage. · EECS 627 lecture packet · page 118</figcaption></figure>

**Voltage-domain MAC:**

```latex
Y = \sum_{i=0}^{N}(X_i\times W_i) = \sum_{i=0}^{N}\Delta V_i = \sum_{i=0}^{N}\frac{\Delta Q_i}{C_{BL}},\qquad \Delta V_{BL} = \sum \Delta V_i
```

Sequence: precharge BL, apply inputs, let the voltage settle at a level set by the MAC value (MAC = 0 … N), then digitize with a **voltage ADC**.

- **Pro**: **linear accumulation** through charge sharing.
- **Cons**: **large bitcell area** due to the capacitor; **limited signal range**. The whole MAC range must fit within VDD (in practice less, to keep cells in the right operating region), so each LSB is ≈ V_swing/N.

**Multibit inputs (slide 32, Si/Zhou/Yang/Chang, ASICON 2021):**

| Method | How X is applied | Trade-off (added) |
|---|---|---|
| (a) Serial binary input, parallel weight (SIPW) | one input bit per cycle, shift-and-add outside | simplest and most robust; latency ∝ input bits |
| (b) Modulated WL pulse width (MWLPW) | t_pulse ∝ X | one cycle; pulse-width resolution and cell-current variation limit linearity |
| (c) Modulated WL pulse count (MWLPC) | number of pulses ∝ X | better matching than width; longer time |
| (d) Analog input voltage on WL (AIVWL) | V_WL ∝ X | compact; strongly nonlinear (I_cell vs V_WL) |
| (e) Analog input voltage on BL | V_BL set by X | needs precise BL drivers |

### 11.7 Multibit weights and the signal-margin problem

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p119-1.jpeg" alt="Multibit weights are built by separate columns plus a shifted adder tree, binary transistor sizing in the cell, multi-level cells, or binary-weighted charge sharing." loading="lazy"><figcaption>Multibit weights are built by separate columns plus a shifted adder tree, binary transistor sizing in the cell, multi-level cells, or binary-weighted charge sharing. · EECS 627 lecture packet · page 119</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p119-2.jpeg" alt="Signal margin is the worst-case gap between adjacent MAC levels, about range/levels minus variation, and reliable compute needs ADC offset below half of it." loading="lazy"><figcaption>Signal margin is the worst-case gap between adjacent MAC levels, about range/levels minus variation, and reliable compute needs ADC offset below half of it. · EECS 627 lecture packet · page 119</figcaption></figure>

**Multibit weights (slide 33):**

- **(a) Separate columns**: each weight bit in its own column with its own ADC; results are shifted (<<7 … <<0) and summed in an accumulator. This is the most common approach and is robust, but needs one ADC per column.
- **(b) Transistor sizing in the bitcell**: binary-sized read devices (1X, 2X) so one cell's current is weighted.
- **(c) Multi-level cell (MLC)**: e.g. RRAM conductance levels; the distributions must not overlap.
- **(d) BL charge sharing**: binary-weighted compute capacitors (1C, 2C, … 8C) combine column voltages before a single ADC.

**Signal margin (slide 36).** Each MAC value produces a distribution of BL voltages (cell-to-cell Vth variation, cap mismatch, noise). Definitions:

```latex
\text{Signal margin} \approx \frac{\text{total output range}}{\text{number of levels}} - \text{variation},\qquad |V_{os,ADC}| < \frac{\text{signal margin}}{2}
```

- Signal margin is the **minimum (worst-case) voltage gap between consecutive MAC levels**.
- The **ADC offset must be less than half the signal margin** for reliable compute.

This is the CIM version of the SRAM sense margin (added): in a normal read, the margin is between the "0" and "1" bitline distributions at high sigma, and the sense amp offset must fit inside it. In CIM there are N + 1 levels in the same voltage range, so each gap is about N times smaller, and each level's spread grows like √k·σ_cell as more cells contribute. High-sigma analysis now applies to every pair of adjacent MAC levels.

<div class="co co-core"><p class="co-t">Core idea</p>

Analog CIM divides the bitline swing into N + 1 levels. Margin per level shrinks like 1/N while the variation of a level grows with the number of contributing cells, so precision is limited by bitcell current variation and ADC offset, exactly the quantities that limit an SRAM read.

</div>

### 11.8 Throughput vs margin, and nonlinearity

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p120-1.jpeg" alt="Accumulating more rows per bitline raises throughput and energy efficiency but collapses the signal margin." loading="lazy"><figcaption>Accumulating more rows per bitline raises throughput and energy efficiency but collapses the signal margin. · EECS 627 lecture packet · page 120</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p120-2.jpeg" alt="Measured transfer curves (Verma) bend away from the ideal line because cells move between operating regions across the MAC range." loading="lazy"><figcaption>Measured transfer curves (Verma) bend away from the ideal line because cells move between operating regions across the MAC range. · EECS 627 lecture packet · page 120</figcaption></figure>

**Trade-off (slide 37).** Plotted against the number of rows accumulated on the bitline (1 to 128): normalized throughput rises linearly (more MACs per access, low I_BL per row is good), while the voltage-domain signal margin falls from about 0.75 (a.u.) at 1 row to almost zero at 128. More accumulation means higher throughput and energy efficiency but lower compute accuracy. Practical macros activate a limited number of rows at a time (typically 16–64, added) and accumulate the partial sums digitally.

**Nonlinearity (slide 38, Verma, SSC Magazine 2019).** The MAC transfer curve is not linear, because the circuit moves between operating regions:

- (a) ΔV_BL vs WLDAC code: ideal vs nominal curve; the nominal curve bends and the spread grows with code.
- (b) Measured V_RBL vs input (XAC) value from −256 to 256: S-shaped saturation at the ends, with level spacing around zero of only tens of mV (0.28 V vs 0.32 V lines marked).

Sources (added): the bitcell current depends on V_DS, so as the BL discharges the current drops (and the access device can leave saturation); clamp and ADC finite gain; charge injection.

**Design space (slide 39):**

Analog CIM design space = target application × memory device × multiplication method × accumulation method × multibit input solution × multibit weight solution × system co-design.

The optimal point differs for each application.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Every non-ideality of analog CIM is a familiar SRAM/ROM sign-off item: bitcell Ion variation at high sigma (local Monte Carlo on the read stack), Ioff accumulation from unselected rows (the bitline-leakage limit on rows per column), sense-amp/ADC offset, wordline pulse-width variation across PVT, and bitline coupling noise. An interviewer may ask how many cells you can hang on a bitline, or how you size a sense amp. The answer is the same σ-based margin argument as in 11.7, with two levels instead of N + 1.

</div>

### 11.9 Digital CIM

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p121-1.jpeg" alt="Digital CIM replaces analog accumulation with digital multipliers, an adder tree and an accumulator, built with pitch-matched custom layout inside the macro." loading="lazy"><figcaption>Digital CIM replaces analog accumulation with digital multipliers, an adder tree and an accumulator, built with pitch-matched custom layout inside the macro. · EECS 627 lecture packet · page 121</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p121-2.jpeg" alt="TSMC digital CIM uses a NOR gate as the 1-bit multiplier per cell (6T 1RW, ISSCC&#x27;21) or per shared group (12T 1R1W with simultaneous read/write, ISSCC&#x27;22)." loading="lazy"><figcaption>TSMC digital CIM uses a NOR gate as the 1-bit multiplier per cell (6T 1RW, ISSCC&#x27;21) or per shared group (12T 1R1W with simultaneous read/write, ISSCC&#x27;22). · EECS 627 lecture packet · page 121</figcaption></figure>

**Architecture (slide 41).** Each SRAM sub-array holds weights W[7:0]. A **digital multiplier unit** per sub-array multiplies the stored weight by one bit of the input (IN[x], bit-serial), an **adder tree** sums the products across rows, and an **accumulator** shifts and adds over input bits to form the dot product. A normal readout path keeps the array usable as plain memory. The circuits are fully custom and **pitch-matched** to the bitcell columns.

Why digital: no ADC, no analog margin, results are exact and scale with technology like logic. CIM gains come from wide internal bandwidth and the elimination of data movement, not from analog summation (added).

**Multiplier as a logic gate (slide 42):**

- **6T 1RW cell with a NOR-gate local compute cell** (Chih, TSMC, ISSCC'21): the multiply is a NOR of the inverted weight and inverted input (equivalent to AND with complemented inputs; the slide's table: W_B = 0, IN_B = 0 → 1). Accumulation is an adder tree.
- **12T 1R1W cell** (Fujiwara, TSMC, ISSCC'22): the NOR multiplier is shared across bitcells (4b×1b multiplier, 6-stage adder tree), and the separate write port allows **simultaneous read and write**, so weights can be updated while computing.

### 11.10 Multiplier/adder optimizations and dual-rail power

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p121-3.jpeg" alt="A mux-based local compute cell selects among 0, W0, W1 and a stored W0+W1 using two input bits, removing the static adder from the first stage." loading="lazy"><figcaption>A mux-based local compute cell selects among 0, W0, W1 and a stored W0+W1 using two input bits, removing the static adder from the first stage. · EECS 627 lecture packet · page 121</figcaption></figure>

<figure class="fig"><img src="assets/fig/lectures/eecs627-lecture-packet-p121-4.jpeg" alt="Dual-rail power: MAC logic on a high-VDD, low-Vt domain for speed, while SRAM and decode use a low-VDD, high-Vt domain to keep standby current low." loading="lazy"><figcaption>Dual-rail power: MAC logic on a high-VDD, low-Vt domain for speed, while SRAM and decode use a low-VDD, high-Vt domain to keep standby current low. · EECS 627 lecture packet · page 121</figcaption></figure>

**Merging multiply and first-stage add (slides 43–44).** With two input bits IN0[x], IN1[x] and two weights W0, W1, the first-stage sum IN0·W0 + IN1·W1 can only be 0, W1, W0 or W0+W1. That is a 4-entry lookup:

| IN0[x] | IN1[x] | OUT |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | W1 |
| 1 | 0 | W0 |
| 1 | 1 | W0+W1 |

- **MUX with static adder** (Fujiwara, ISSCC'24): a mux replaces multipliers plus the first adder stage; W0+W1 comes from a static adder. **7% fewer devices and 5% faster.**
- **MUX with stored result**: precompute W0+W1 at write time and store it in the array next to W0 and W1, so the local compute cell is just a 4:1 mux. This removes the static adder's area and power, at the cost of storing an extra word.

**Adder tree (slides 45–46).** A **hierarchical adder tree** (local adder per sub-array → semi-global adder → global adder and shifter) shortens interconnect and cuts its area and energy. Chih (ISSCC'21) mixes **14T pass-gate adders and 28T static adders** in alternating stages: about **30% better energy efficiency and ~20% lower adder-tree area**. Pass-gate stages are small but degrade the signal, so static stages are placed between them to restore it (added).

**Dual-rail power (slide 47).** The macro (18 rows × 18 segments, 196 columns of storage) splits:

- **VDD domain with low-Vt devices** for the MAC/adder logic, for performance.
- **VDDM domain with high-Vt devices** for SRAM storage and decode, for **low standby current** (and for bitcell stability at a voltage chosen for the array).
- **Level shifters (LS)** between decode and the array.

This is the L09 dual-Vt idea applied to a macro, and it is the standard memory-compiler arrangement of separate periphery and array supplies (added).

**Later slides, briefly.**

- **Floating-point CIM (slides 48–49)**: FP (BF16/FP16) gives the best accuracy but costs energy and parameters; INT4/INT8 is more efficient but loses accuracy, especially on ImageNet. FP-CIM must align mantissas to a common exponent. There are three methods:
    - **input alignment** (by product exponent): highest input sparsity, but needs extra mantissa bits;
    - **separate input and weight alignment**: highest compute parallelism, but needs extra mantissa bits;
    - **product alignment**: least accuracy loss, but hard to perform MACs inside the CIM.
- **Advanced-node demo (slide 50, Fujiwara ISSCC'22)**: 5 nm, 64 kb, 4b/4b signed weight/activation, 64 4b×1b multipliers and a 64-input adder tree per array. TSMC has also shown the first DCIM **compiler** in 3 nm (Mori, VLSI'25), supporting INT and FP.
- **Backup**: RRAM–SRAM fusion processors and mixed-precision nvCIM. SRAM-CIM gives high accuracy and supports local training; RRAM-CIM gives high energy efficiency and dense nonvolatile storage.

<div class="co co-why"><p class="co-t">Why it matters for std-cell / ROM work</p>

Digital CIM is really a library and memory-compiler problem: pitch-matched adder and mux cells, low-Vt periphery on its own rail, level shifters into a high-Vt array domain, and compiler-generated macros characterized like any SRAM (timing, leakage, EM/IR on the dense adder trees). The 14T/28T adder mix is the same restoring-stage reasoning used when choosing pass-gate vs static cells in a library.

</div>

### 11.x Check yourself

1. **Using the slide's energy numbers, how much more expensive is fetching a bit from off-chip memory than computing with it in a PE, and what does that imply?**
   ~1000 fJ/bit vs 6 fJ/bit, about 167X (and 20X an on-chip SRAM access at 50 fJ/bit). Data movement, not arithmetic, dominates energy, so the goal is to reduce weight and activation movement: near-memory or in-memory compute. (derived)

2. **Two cells in the same column are read at once on a precharged BL/BLB pair. What does each line compute, and which input case is hardest to sense?**
   BL stays high only if both cells hold 1: **AND**. BLB stays high only if both hold 0: **NOR**. XOR = NOR(AND, NOR). The **01/10** case has the smallest margin, since it lies between the no-discharge and two-cell-discharge levels. Multi-row activation also raises read-disturb risk in a 6T cell. (derived)

3. **Why do many CIM designs use an 8T cell rather than a 6T cell?**
   The 8T read port (RWL-gated 2T stack onto RBL) is decoupled from the storage nodes. RBL discharges only when RWL·Q = 1, which is a 1-bit multiply, and many rows can be active at once without disturbing the stored data. (derived)

4. **Compare current-domain and charge-domain accumulation.**
   Current domain: cell currents sum on a clamped BL (KCL), read by a current ADC. Simple cells, but nonlinear and burns static current. Charge domain: each cell adds ΔQ (I_ON·t_pulse or C0·V_WL) and the BL voltage accumulates ΔV = ΣΔQ/C_BL, read by a voltage ADC. Linear (especially capacitor-based), but larger cells and a range limited by VDD. (derived)

5. **Define CIM signal margin and the ADC requirement. Why does margin fall as more rows are accumulated?**
   Signal margin is the minimum gap between adjacent MAC-level distributions ≈ (output range / number of levels) − variation, and ADC offset must be < margin/2. More rows means more levels in the same range (gap ∝ 1/N), while each level's spread grows with the number of contributing cells. Throughput rises and margin collapses (slide 37: from ~0.75 a.u. at 1 row to ~0 at 128). (derived)

6. **In a current-domain SRAM CIM with N rows active, what sets the zero level and the maximum useful N?**
   Off cells still conduct I_off, so MAC = 0 gives N·I_off and every level is offset by the off-current of the cells not contributing. Useful N is limited by the I_on/I_off ratio and its variation at the hot, leaky corner. This is the same limit as cells per bitline in SRAM/ROM. (derived)

7. **What does a mux-based local compute cell replace, and what are the two variants' benefits?**
   It replaces the 1-bit multipliers plus the first adder stage. With two input bits the output is 0, W1, W0 or W0+W1. With a static adder generating W0+W1: 7% fewer devices and 5% faster (ISSCC'24). With W0+W1 precomputed and stored in the array: the static adder's area and power are removed as well. (derived)

8. **Why does a digital CIM macro use a dual-rail supply, and which devices go where?**
   MAC/adder logic sits on a higher-VDD, low-Vt domain for performance. SRAM storage and decode sit on a VDDM domain with high-Vt devices for low standby current. Level shifters cross between them. This applies the dual-Vt leakage trade-off from L09 at the macro level. (derived)