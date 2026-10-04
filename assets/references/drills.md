## How this drill book works

Your friend on the Santa Clara team described the format: **about four main questions, each followed by many follow-ups that drill down to fundamentals**, including twists like *"what if the NMOS drives VDD and the PMOS drives 0: sketch Vin–Vout"* (that exact question is **chain A2**). Behavioral was light, mostly your **plan and goals** (Part E).

Each chain below follows that shape:
- an **opening question** as Bo might ask it, with what to **draw**;
- **five to seven follow-ups**, each deeper toward device physics and numbers;
- at least two **"What if…"** twists (swapped devices, corners, VDD, sizing, leakage, variation);
- **worked problems** with full numbers;
- a **Trap** (the common wrong answer) and a **one-line takeaway**.

**How to practice:** cover the answers. Say the opening answer out loud while drawing. Then read each follow-up and answer **before** looking. If you get stuck, apply the universal method below.

<div class="co co-core"><p class="co-t">The universal method for any what-if</p>

1. **Which device is ON, and in which region?** (cutoff / subthreshold / linear / saturation)
2. **Write KCL at the node** that matters (currents in = currents out).
3. **Find the limits**: what can the output reach (rails? VDD−Vt? |Vt|?), and is there a fight (ratioed)?
4. **Sketch the curve or waveform**, then label the key points.
5. **Say what it means for a real cell**: speed, leakage, margin, robustness.

</div>

<div class="co co-guard"><p class="co-t">About the plots</p>

Plots come from a simple **illustrative model**: a symmetric EKV-style MOSFET with VDD = 0.9 V, Vt ≈ 0.35 V and kn = 2·kp. Shapes and trends are right; exact numbers are not a real process. In the interview, quote the **reasoning and trends**, not these digits.

</div>



## Part A — Transistors and the inverter, drilled to first principles

All plots come from one **illustrative model** (a symmetric EKV-style MOSFET, VDD = 0.9 V, Vt ≈ 0.35 V, kn = 2·kp, n = 1.35, λ = 0.4 V⁻¹). The numbers are teaching numbers, not a real PDK. Every number below was computed in `gen_A.py`.

### A1. The CMOS inverter VTC, region by region

Why they ask: every later question (noise margin, ratioed logic, keepers, SRAM stability) assumes you can draw this curve and say which device is in which region at each point.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_vtc_regions.png: the original referenced asset was not included in the supplied source bundle. Inverter VTC with the five operating regions, VM, VIL/VIH (slope −1 points), and the gain and crowbar-current peaks at VM.

</div>

**Opening question.** "Draw the VTC of a CMOS inverter and walk me through it."

**Answer.** Start from KCL at the output: with no DC load, I_P = I_N at every point, so the VTC is the set of points where the two device currents match. Five regions:

- **A** (Vin < Vtn): NMOS off, PMOS linear with ~0 current → Vout = VDD (**VOH = VDD**).
- **B** (Vtn < Vin < VM): NMOS saturated, PMOS linear. Vout starts to drop.
- **C** (Vin ≈ VM): **both saturated**. Two current sources fight, so the curve is nearly vertical. Gain is highest here and so is crowbar current.
- **D** (VM < Vin < VDD − |Vtp|): NMOS linear, PMOS saturated.
- **E** (Vin > VDD − |Vtp|): PMOS off → Vout = 0 (**VOL = 0**).

Draw: a box from 0 to VDD on both axes and the dashed Vout = Vin diagonal. The curve stays flat at VDD, falls steeply through the diagonal at VM, and stays flat at 0. Mark the two slope −1 points (VIL and VIH) and label A–E under the axis.

**▸ Follow-up 1.** "Define VIL, VIH and the noise margins. Give me numbers for your plot."

**Answer.** **VIL** is the largest input still read as a 0 and **VIH** is the smallest input still read as a 1. Both are taken at the **dVout/dVin = −1** points, because beyond them the gate amplifies noise (|gain| > 1). Then **NMH = VOH − VIH** and **NML = VIL − VOL**. In the model: VIL = 0.41 V, VIH = 0.49 V, VOH = 0.9, VOL = 0, so **NMH = NML = 0.41 V**. The margins are symmetric because VM = VDD/2. The undefined region VIH − VIL is only 78 mV wide because the gain is about 41.

**▸ Follow-up 2.** "Derive VM."

**Answer.** At VM both devices are saturated and Vin = Vout = VM. Set the square-law currents equal:

```latex
\frac{k_n}{2}\,(V_M - V_{tn})^2 \;=\; \frac{k_p}{2}\,(V_{DD} - V_M - |V_{tp}|)^2
\;\;\Rightarrow\;\;
V_M = \frac{V_{tn} + r\,(V_{DD} - |V_{tp}|)}{1 + r},\qquad r = \sqrt{\frac{k_p}{k_n}}
```

Here kp and kn include W/L. With kn' = 2·kp' and Wp = 2·Wn we get r = 1, so VM = (0.35 + 0.55)/2 = **0.45 V**, which is exactly what the model gives. Velocity saturation changes the exponent (the currents become closer to linear in Vov), but the structure stays the same: VM is set by the **ratio of strengths**.

**▸ Follow-up 3 (worked numeric problem).** "VDD = 0.9, Vtn = |Vtp| = 0.35, kn' = 2kp'. What VM do you get with Wp = Wn? What Wp/Wn puts VM at 0.40 V? At 0.50 V?"

**Answer.**
- Wp = Wn: r = √(1/2) = 0.707, so VM = (0.35 + 0.707·0.55)/1.707 = **0.433 V** (the model gives 0.426).
- VM = 0.40 requires r = (VM − Vtn)/(VDD − |Vtp| − VM) = 0.05/0.15 = 1/3. Then kp/kn = 1/9, so Wp/Wn = 2/9 = **0.22**.
- VM = 0.50 requires r = 0.15/0.05 = 3, so kp/kn = 9 and Wp/Wn = **18**.

The lesson is that VM depends only weakly (square-root) on sizing. Doubling Wp moves VM by only about 20 mV (0.450 → 0.474 V in the model), and pushing VM toward a rail costs enormous width.

**▸ Follow-up 4.** "What is the gain at VM, and why isn't it infinite?"

**Answer.** Use small-signal analysis at VM: both devices are saturated transconductors driving each other's output conductance.

```latex
A_v = -\frac{g_{mn} + g_{mp}}{g_{dsn} + g_{dsp}},\qquad g_m \approx \frac{2I_D}{V_{ov}},\; g_{ds} \approx \lambda I_D
\;\Rightarrow\; A_v \approx -\frac{2/V_{ov,n} + 2/V_{ov,p}}{\lambda_n + \lambda_p}
```

With Vov = 0.1 V and λ = 0.4 V⁻¹ the hand estimate is −(20 + 20)/0.8 = **−50**. The model gives **−41**, because at Vov = 0.1 V the device is in moderate inversion, where gm/Id = 14 V⁻¹ rather than 2/Vov = 20 V⁻¹. With ideal saturation (λ = 0) the gain would be infinite and the transition vertical. **Channel-length modulation** (plus DIBL) is the only thing keeping it finite. That is why short-channel inverters have softer VTCs.

**▸ Follow-up 5.** "What if Wp is doubled or halved?"

**Answer.** Doubling Wp makes the PMOS stronger, so the NMOS needs more Vin to win. VM moves **right** (0.45 → 0.474 V) and the curve shifts without changing shape. NMH shrinks and NML grows. Halving Wp moves VM **left** (0.426 V). Show the family:

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_vtc_wp_vdd.png: the original referenced asset was not included in the supplied source bundle. Left: Wp = 1, 2, 4·Wn shifts VM by only about ±20 mV. Right: VTCs normalized to VDD for VDD = 0.9 V down to 0.06 V.

</div>

The same physics is used deliberately in **skewed gates** (HI-skew or LO-skew inverters on dynamic outputs) and in **keeper feedback inverters**, where you shift VM to favor one transition.

**▸ Follow-up 6 — What if VDD drops toward and below Vtn + |Vtp| = 0.7 V?**

**Answer.** Above 0.7 V there is a window around VM where both devices are strongly on (that window is region C, and it is where the crowbar current comes from). Below 0.7 V that window disappears. The square-law hand model then predicts a **dead band**: for some Vin both devices are off and the output would float, giving hysteresis. Real devices conduct **subthreshold** current, so the inverter keeps working as a ratio of two exponentials. The right panel shows clean, full-swing VTCs at 0.6 V, 0.4 V and even 0.25 V. Peak gain actually rises to about 69 at 0.4 V, because gm/Id is highest in weak inversion. It only degrades at a few kT/q: |gain| = 6 at 0.12 V and 1.6 at 0.06 V. The theoretical floor for gain > 1 is about 2·ln2·kT/q ≈ 36 mV (Swanson–Meindl/Meindl), and practical logic needs several times that. The price is **speed**: delay grows exponentially below Vt (see A6). Crowbar current also nearly disappears, which is one reason near- and sub-threshold logic is energy-efficient.

**▸ Follow-up 7 — What if it is hot versus cold?**

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_vtc_temp.png: the original referenced asset was not included in the supplied source bundle. Inverter VTC at −40 °C and 125 °C for VDD = 0.9 V and 0.3 V, using a temperature-extended model (Vt −1 mV/K, µ ∝ T^−1.5, kT/q).

</div>

**Answer.** Three things move with temperature: **Vt falls** (about 0.5–1 mV/K), **mobility falls** (µ ∝ T^−1.5) and **kT/q rises**. The two mobility changes cancel in the ratio, and both thresholds shift by the same amount in this model, so **VM stays at 0.45 V**. What does change is the **steepness**. When cold, VM − Vt is only 0.03 V, so the devices sit near threshold, where gm/Id is high and |gain| ≈ 67. When hot, VM − Vt = 0.20 V, so gm/Id is lower and |gain| ≈ 25. Noise margins shrink a little when hot (NML goes from 0.425 to 0.389 V). In real silicon, Vtn and |Vtp| have different temperature coefficients, so VM drifts somewhat (added). Hot also means far more leakage (A5).

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "VM = VDD/2 because the inverter is symmetric." VM = VDD/2 only when the strengths are matched (kn·Wn = kp·Wp with equal |Vt|). Also, do not claim the gain is infinite because "both are current sources". λ (CLM) and DIBL set the gain.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

KCL (I_P = I_N) defines every point of the VTC. VM is set by the strength ratio through √(kp/kn), the slope at VM is set by gm/gds, and the curve still works below Vtn + |Vtp| because of subthreshold conduction, only slowly.

</div>

### A2. The swapped inverter: NMOS on top, PMOS on the bottom

Why they ask: this is the reported "what-if" question. It tests whether you reason from **which terminal is the source** instead of from memorized pictures.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_swapped_sch.png: the original referenced asset was not included in the supplied source bundle. Normal inverter compared with the swapped version: in the swapped circuit both devices have their source at the output, so each is a source follower.

</div>

**Opening question.** "Same inverter, but the NMOS connects the output to VDD and the PMOS connects the output to GND. Gates are both tied to Vin. Sketch Vin–Vout."

**Answer.** First find the sources. For the NMOS on top, the drain is at VDD, so the **source is the output**. For the PMOS on the bottom, the drain is at GND, so its **source is also the output**. Both are **source followers**:
- The NMOS can pull the output up only while Vgs > Vt, so Vout ≤ Vin − Vtn (and body effect makes this worse, because Vsb = Vout).
- The PMOS can pull the output down only to Vout ≥ Vin + |Vtp|.

The result is a **non-inverting** gate with **gain < 1** and no regeneration. Between those two limits there is a band about Vtn + |Vtp| ≈ 0.7 V wide where **both devices are nearly off**. Inside that band the output is set by leakage balance and by history.

Draw: a positive-slope line, not a falling step. It starts at roughly |Vtp| or below at Vin = 0 and ends at roughly VDD − Vtn(body) or above at Vin = VDD, inside a shaded band bounded by Vin − Vtn and Vin + |Vtp|. Overlay the normal inverter for contrast.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_vtc_swapped.png: the original referenced asset was not included in the supplied source bundle. Swapped-device DC transfer curve: a line with slope about 1/n from 0.12 V to 0.78 V inside a dead band, against the normal inverter.

</div>

**▸ Follow-up 1.** "Why is the DC curve that straight line, and why is its slope 1/n?"

**Answer.** With no load, the only steady state is where both devices are in **subthreshold** and their leakage currents match. In weak inversion I ∝ exp((V_G − Vt − n·V_S)/(n·U_T)), with bulk-referenced voltages. Set the NMOS current (source = out, bulk = 0) equal to the PMOS current (source = out, bulk = VDD) with matched strengths:

```latex
V_{out} = \frac{V_{DD}}{2} + \frac{1}{n}\left(V_{in} - \frac{V_{DD}}{2}\right)
```

With n = 1.35 this gives 0.117 V at Vin = 0 and 0.783 V at Vin = VDD. The model gives **0.12 → 0.78 V with slope 0.73**. The slope is the **source-follower gain 1/n < 1**, and the 1/n comes from body effect. If the strengths are unmatched, the line shifts by (U_T/2)·ln(βn/βp): only a few mV per 2×.

**▸ Follow-up 2.** "Is that DC value what you'd actually see?"

**Answer.** Usually not, because the line is reached only through **subthreshold creep**, which is very slow. Take Vin = VDD. If the output starts at 0, the NMOS pulls it up quickly to about (Vin − Vt)/n ≈ 0.4 V (the strong-inversion limit in this model) and then creeps: 0.26 V at 50 ps and still only 0.47 V at 2 ns. If the output starts at 0.9 V, the PMOS has Vsg ≈ 0 and nothing pulls it down, so it stays at **0.90 V**. Same input, different output: the node behaves like a **soft, history-dependent dynamic node**.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_swapped_tran.png: the original referenced asset was not included in the supplied source bundle. Left: with Vin = VDD the output depends on its initial state; right: a chain of swapped stages decays toward VDD/2 while inverters restore full levels.

</div>

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_swapped_toggle.png: the original referenced asset was not included in the supplied source bundle. Toggling the swapped gate gives a tiny in-phase swing, while a normal inverter swings rail to rail.

</div>

**▸ Follow-up 3.** "So can it be used as a logic buffer? What happens in a chain?"

**Answer.** No. A logic gate must **regenerate**: it needs |gain| > 1 around the switching point, so that noise shrinks stage by stage. Here gain ≈ 1/n ≈ 0.74 everywhere, so every stage **compresses** the swing toward the fixed point. Even in the best DC case a 0.9 V input decays as 0.90 → 0.78 → 0.69 → 0.63 → 0.58 → 0.55 → **0.52 V after 6 stages** (the deviation from VDD/2 shrinks by about 1/n per stage). When toggled at 1 GHz the output barely moves (0.43–0.45 V in the model). With a weaker body effect than this model's, the first-cut swing is |Vtp| ↔ VDD − Vtn ≈ 0.35 ↔ 0.5 V: still well below rail-to-rail, and it never restores.

**▸ Follow-up 4 — What if you build a ring oscillator out of these?**

**Answer.** It **does not oscillate**. Oscillation needs a net **inverting** loop with loop gain > 1 at the frequency where the phase adds to 360°. Each stage here is non-inverting with gain < 1, so an odd count does not invert and the loop gain is below 1. The nodes settle to a leakage-defined DC point (near VDD/2 here). This is the cleanest way to show that inversion and gain are both required (see A7).

**▸ Follow-up 5 — What if Vin swings beyond the rails: VDD + Vtn and −|Vtp| (bootstrapped)?**

**Answer.** If the gate goes to VDD + Vtn(body), the NMOS stays on with Vgs > Vt even when its source is at VDD, so the output reaches the **full VDD**. Likewise, driving the gate to −|Vtp| lets the PMOS reach full 0. You then have a full-swing **non-inverting** buffer, but the input swing is still larger than the output swing (gain < 1). This is exactly the reason for **boosted wordlines** (VPP) in DRAM and boosted pass gates: an NMOS can pass a full 1 only if its gate is about one Vt above the level being passed.

**▸ Follow-up 6.** "Is this structure ever used?"

**Answer.** Yes, as a follower rather than as logic:
- It is a **complementary source follower** (a class-B push-pull output stage). Its dead band is exactly **crossover distortion**, which is why analog designers bias such stages into class-AB.
- Single **source followers** are used as analog buffers and level shifters.
- An **NMOS pull-up** gives a natural **VDD − Vt precharge** or clamp, used in some ROM, DRAM and sense-amp bitline schemes to limit swing and save power.
- NMOS-only pass-gate logic has the same weak-1 behavior (A3).

**▸ Follow-up 7.** "Speed?"

**Answer.** Speed is poor and gets worse as the output moves. A source follower's drive is ∝ (Vin − Vt − n·Vout)². It shrinks as Vout rises, so the output approaches its final value roughly hyperbolically rather than exponentially, with no regeneration to sharpen the edges. In a normal inverter, Vgs = VDD for the whole transition.

<div class="co co-guard"><p class="co-t">Trap</p>

Drawing a normal inverter VTC flipped upside down, or claiming "it's still an inverter, just weaker". Both devices are followers (the source is the output), so the gate is **non-inverting**, has **gain < 1** and cannot reach either rail. Also, do not quote a single exact output value. Inside the dead band the output is set by leakage and history.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Find the source first. NMOS-up/PMOS-down makes two source followers: Vout tracks Vin with slope about 1/n, is confined between Vin − Vtn and Vin + |Vtp|, and has no gain and no inversion, so it cannot restore logic levels.

</div>

### A3. Pass transistors and transmission gates

Why they ask: ROM and mux paths are full of pass devices. The weak-1/weak-0 rules, Vt drops and static current in the receiver are daily concerns in custom design.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_pass_tran.png: the original referenced asset was not included in the supplied source bundle. Passing a 1 and a 0 through an NMOS, a PMOS and a transmission gate into 2 fF: only the TG passes both values fully.

</div>

**Opening question.** "What does an NMOS pass transistor do to a 1 and to a 0? What about a PMOS and a TG?"

**Answer.** Whichever terminal is lower in voltage is the NMOS source.
- **Passing a 0:** the source is the output node. Vgs = VDD the whole way, so the NMOS discharges the node fully: a **strong 0**.
- **Passing a 1:** the source becomes the output. As it rises, Vgs = VDD − Vout shrinks until the device cuts off at Vout ≈ **VDD − Vtn(Vsb)**: a **weak 1**. The model reaches 0.32 V at 100 ps and 0.44 V at 1 ns, then creeps.
- **PMOS** is the mirror image: a strong 1 and a weak 0 that stalls near |Vtp| or above (0.46 V at 1 ns in the model).
- A **TG** (NMOS and PMOS in parallel, complementary gates) passes **both values fully**, because one device is always strong at the end of the swing.

Draw: output waveforms. The NMOS rises fast and then flattens below VDD − Vt. The PMOS falls fast and then flattens above |Vtp|. The TG goes rail to rail.

**▸ Follow-up 1.** "Why is the 1 even weaker than VDD − Vt0? Calculate it."

**Answer (worked).** **Body effect.** The output node is the source, so Vsb = Vout and the threshold rises as the node charges:

```latex
V_t(V_{SB}) = V_{t0} + \gamma\left(\sqrt{2\phi_F + V_{SB}} - \sqrt{2\phi_F}\right),\qquad V_{out} = V_{DD} - V_t(V_{out})
```

Take Vt0 = 0.35, γ = 0.3 √V, 2φF = 0.8 V. Solving the self-consistent equation gives **Vout = 0.479 V** with Vt = 0.421 V, not 0.55 V. The model, whose body effect is stronger, gives 0.44–0.47 V. Strictly speaking, after cutoff the node keeps creeping up through subthreshold current, so the result is also time-dependent.

**▸ Follow-up 2 — What if the weak 1 drives the gate of another pass transistor, rather than its source/drain?**

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_pass_chain.png: the original referenced asset was not included in the supplied source bundle. Left: a degraded node drives the next pass gate's gate (a second Vt drop) or its source/drain (no new drop); right: inverter static current against its input voltage.

</div>

**Answer.** At a **gate**, the next device's gate sits at about VDD − Vt. It can then pass at most (VDD − Vt) − Vt, so the **drops accumulate**: 0.15 V in the model. At a **source/drain** of a device whose gate is at full VDD, that device can still pass up to VDD − Vt, so a level of about VDD − Vt passes through with **no extra drop** (0.45 V). Rule: **never drive a gate from an un-restored pass output**. Series pass chains lose only one Vt.

**▸ Follow-up 3.** "What's wrong with feeding VDD − Vt into a CMOS inverter?"

**Answer.** The inverter's PMOS sees Vsg = VDD − Vin ≈ Vt, so it is **not fully off**, while the NMOS is on. That gives a **static crowbar current** plus a degraded VOL. With the numbers above (Vin = 0.479, so Vsg = 0.421 and the PMOS Vov = 0.071 V), square law with Wp = 2 gives kp·Wp/2·Vov² = 100 µ·2/2·0.071² ≈ **0.5 µA**. The model gives **1.03 µA at 0.47 V** and **0.24 µA at 0.55 V**, against **22 pA** with a full-VDD input: 4–5 orders of magnitude. Across thousands of mux outputs this becomes a static-power bug, and the input sits near VM, so noise margin is lost as well.

**▸ Follow-up 4.** "How do you fix the weak 1 without a TG?"

**Answer.** Use a **level restorer (keeper)**: a PMOS from VDD to the pass node, with its gate driven by the output of the receiving inverter. Once the node rises past the inverter's VM, the output goes low, the PMOS turns on and pulls the node the rest of the way to VDD. The static current disappears. The cost is a **ratio constraint**: to write a 0, the pass NMOS (often in series with the driver) must pull the node below the inverter VM **while fighting the keeper**. The keeper must therefore be weak (long channel) — the same ratioed problem as A4. Other fixes: a TG, a boosted gate (VDD + Vt), or a low-Vt pass device.

**▸ Follow-up 5 — What if you lower VDD?**

**Answer.** The weak 1, about VDD − Vt(body), shrinks faster than VDD. At VDD = 0.6 V the first-cut output is 0.6 − 0.35 − (body) ≈ 0.2 V, which is below the receiver's VM. The logic fails. That is why NMOS-only pass-transistor logic disappeared as VDD scaled and TGs or restorers became standard.

**▸ Follow-up 6 (worked numeric problem).** "Eight NMOS pass gates in series, each R = 10 kΩ, node capacitance C = 2 fF. Delay? How do you improve it?"

**Answer.** Use the Elmore delay of an RC ladder:

```latex
\tau = \sum_{i=1}^{N} i\,RC = RC\,\frac{N(N+1)}{2}
```

RC = 20 ps and N = 8, so τ = 20 ps × 36 = **720 ps**. Delay grows as **N²**. Insert a buffer in the middle (2 segments of 4): 2 × 20 ps × 10 = **400 ps** plus two buffer delays. Buffers also restore the weak level, so the practical rule is to buffer every 3–4 pass devices.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying an NMOS passes "VDD − Vt" and stopping there. Mention body effect (the true value is lower), mention that the drops compound only through gates, and mention the static current in the receiver.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

NMOS passes a strong 0 and a weak 1, PMOS the opposite, and a TG passes both. A weak 1 costs a body-effect-enlarged Vt and static current in the next inverter, and Vt drops add up whenever a degraded node drives a gate.

</div>

### A4. Ratioed logic: pseudo-NMOS

Why they ask: keepers on ROM bitlines and dynamic nodes, and the SRAM read ratio, are all the same ratioed fight. The pseudo-NMOS VTC is the cleanest way to show it.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_pseudo_vtc.png: the original referenced asset was not included in the supplied source bundle. Pseudo-NMOS VTC for several PMOS widths against CMOS (VOL > 0 and VM pushed up), and the static current paid when the output is low.

</div>

**Opening question.** "Draw a pseudo-NMOS inverter's VTC and compare it with CMOS."

**Answer.** The PMOS gate is tied to **GND**, so the PMOS is always on as a load, and the NMOS pull-down is the only input device.
- Vin = 0: the NMOS is off, so VOH = VDD.
- Vin = VDD: KCL requires the NMOS to sink the PMOS current, so it needs **Vds > 0**. Therefore **VOL ≠ 0** and **static current** flows whenever the output is low.

Compared with CMOS: VM moves up (0.56–0.71 V depending on Wp), gain is lower (about 9–12 compared with 41), NML is smaller, and the low-to-high edge is slow because the PMOS is weak. The benefit is one transistor per input (N + 1 instead of 2N) and lower input capacitance.

Draw: the curve starts at VDD, falls later than the CMOS curve and flattens at a nonzero VOL. Add the CMOS curve as a dashed reference.

**▸ Follow-up 1 (worked numeric problem).** "VDD = 0.9 V, Vt = 0.35 V, kn' = 200 µA/V², kp' = 100 µA/V², Wn/L = 1. Size the PMOS for VOL = 0.1 V. Static power?"

**Answer.** At VOL the PMOS is **saturated** (Vsd = 0.8 V > Vsg − |Vtp| = 0.55 V) and the NMOS is **linear**:

```latex
\frac{k_p'}{2}\frac{W_p}{L}(V_{DD}-|V_{tp}|)^2 = k_n'\frac{W_n}{L}\left[(V_{DD}-V_{tn})V_{OL} - \frac{V_{OL}^2}{2}\right]
```

- Right-hand side: 200 µ × (0.55·0.1 − 0.005) = **10 µA**.
- Solve for the PMOS: Wp/L = 10 µ / (50 µ × 0.3025) = **0.66**, which is about 1/1.5 of the NMOS width.
- Check in the model: Wp = 0.66 gives VOL = 97 mV.
- Static power = 10 µA × 0.9 V = **9 µW per gate while low**. A million such gates, half of them low, would burn about **4.4 W**. That is why pseudo-NMOS survives only in a few wide NOR, PLA or ROM structures.

**▸ Follow-up 2 — What if the PMOS is too strong?**

**Answer.** VOL rises and VM moves toward VDD. At Wp = 1.5, VOL = 0.26 V. At **Wp = 4, VOL = 0.75 V**, the |gain| peaks at only 0.64 and the stage cannot drive the next gate low. It is no longer logic. A ratioed gate works only if the pull-down **wins the fight by a ratio**, typically βn/βp ≈ 3–4 or more.

**▸ Follow-up 3 — What if the PMOS is too weak?**

**Answer.** VOL is excellent (47 mV at Wp = 0.33) and static current halves (5 µA), but **tpLH** grows: the rise current is just the weak PMOS current, so tpLH ≈ C·VDD/(2·Ip). The output also has poor noise immunity when high, because the pull-up holds the node only weakly against coupling. Sizing therefore trades VOL and static power against rise delay.

**▸ Follow-up 4.** "Where else do you see this exact fight?"

**Answer.**
- **ROM or dynamic bitline keepers.** The bitline is precharged high and a weak PMOS keeper holds it against the leakage of all the off cells. A selected cell (an NMOS, often in a series stack) must pull the bitline down **while fighting the keeper**, just like the pseudo-NMOS pull-down. Example with model leakage values (Vds = 0.9 V, W = 1): 256 off cells × 19 pA ≈ **5 nA** at 25 °C, but 256 × 2.3 nA ≈ **0.59 µA** at 125 °C. The keeper must source more than the hot leakage, yet stay weak enough that one on-cell (tens of µA) overrides it quickly at the slow-cold corner. Size the keeper at **hot/fast leakage** for holding and at **slow/cold** for overpowering.
- **SRAM read stability.** During a read, the access NMOS (saturated, from the bitline at VDD) fights the pull-down NMOS (linear) at the 0 node, so the node bumps up. The **cell ratio** CR = β_pd/β_ax keeps that bump below the other inverter's trip point.

**▸ Follow-up 5 (worked numeric problem).** "Compute the SRAM read bump for CR = 1, 2, 3. Use VDD = 0.9 V, Vt = 0.35 V and ignore body effect."

**Answer.** Set the saturated access current equal to the linear pull-down current:

```latex
\frac{\beta_{ax}}{2}(V_{DD}-V_t-V)^2 = CR\cdot\beta_{ax}\left[(V_{DD}-V_t)V - \frac{V^2}{2}\right]
```

The read bump is **V = 0.161 V at CR = 1**, **0.101 V at CR = 2** and **0.074 V at CR = 3**. Each of these must stay well below the opposite inverter's VM (about 0.45 V), with margin for variation. That is why CR ≈ 1.5–2.5 is typical. It is the same KCL ratio calculation as the pseudo-NMOS VOL.

**▸ Follow-up 6.** "Why does pseudo-NMOS still appear in fast wide NORs?"

**Answer.** A wide NOR in CMOS needs a **series PMOS stack**, which is very slow and very large. Pseudo-NMOS has only parallel NMOS devices and one PMOS load, so input capacitance is low and the falling edge is fast. Its static power is acceptable if the gate is clock-gated or rarely low. Dynamic logic (precharge plus keeper) gets the same advantage without the static current.

<div class="co co-guard"><p class="co-t">Trap</p>

"VOL is 0 because the NMOS is on." KCL says the NMOS must carry the PMOS current, so it needs a nonzero Vds. VOL is set by the β ratio, not by the NMOS alone.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Ratioed logic is KCL with two devices on at once. VOL is set by the β ratio, static current is the price, and the same calculation sizes ROM keepers and the SRAM cell ratio.

</div>

### A5. MOSFET fundamentals under the hood

Why they ask: every inverter answer eventually reduces to Id(Vgs, Vds, Vsb, T). Leakage, keepers, ROM sensing and corner selection all depend on it.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_idvg_temp.png: the original referenced asset was not included in the supplied source bundle. Left: log Id–Vgs at two Vds showing the subthreshold slope and DIBL; right: Id–Vgs at −40 °C and 125 °C showing the temperature-inversion crossover (temperature dependence added explicitly to the model).

</div>

**Opening question.** "Sketch Id versus Vgs on a log scale and tell me what sets each part."

**Answer.** There are two regimes.
- **Subthreshold** (a straight line on log scale). Current is **diffusion** over a source barrier that the gate lowers by ΔVgs/n, giving I ∝ exp((Vgs − Vt)/(n·kT/q)).
- **Strong inversion**: the curve bends over into roughly square-law, or nearly linear once velocity saturation sets in.

The slope of the straight part is the **subthreshold swing**:

```latex
S = n\,\frac{kT}{q}\,\ln 10,\qquad n = 1 + \frac{C_{dep}}{C_{ox}}
```

With n = 1.35 at 300 K, S = **80 mV/dec**, and the model measures 83. The ideal limit (n = 1) is 60 mV/dec. Real planar devices are about 80–100 mV/dec. FinFETs, with better gate control, are about 65–75 mV/dec.

Draw: log Id against Vgs with a straight subthreshold line, a knee near Vt and saturation above it. Mark Ioff at Vgs = 0.

**▸ Follow-up 1.** "How is Vt actually defined? It's not a cliff."

**Answer.** Vt is a convention:
- **Constant-current Vt**: the Vgs at which Id = e.g. 100 nA·W/L. This is fast to measure, and the fab and SPICE models commonly report it.
- **Linear extrapolation**: extrapolate the linear-region Id–Vgs at its maximum-gm point down to the axis.
- **Physical (textbook) definition**: surface potential ψs = 2φF, i.e. the inversion charge equals the background doping.

```latex
V_t = V_{FB} + 2\phi_F + \frac{\sqrt{2 q \varepsilon_{si} N_A (2\phi_F)}}{C_{ox}}
```

The definitions differ by tens of mV, so always ask which one a number refers to. In the left plot the constant-current Vt at 100 nA is **0.330 V at Vds = 0.05 V** and **0.239 V at Vds = 0.9 V**.

**▸ Follow-up 2.** "What is DIBL and what does it do to your circuits?"

**Answer.** **Drain-induced barrier lowering**: in a short channel the drain field reaches the source barrier and lowers it, so Vt falls as Vds rises (ΔVt ≈ −η·Vds). In the plot the curve shifts left by 91 mV, which is **≈ 107 mV/V** measured at constant current. Consequences:
- **Ioff rises** about 11× from Vds = 0.05 V to 0.9 V (15 pA → 167 pA).
- Output conductance rises, so **intrinsic gain and VTC steepness fall**.
- **Stacking** helps, because the upper off device sees a smaller Vds and the lower one gets a negative Vgs.

**▸ Follow-up 3 (worked numeric problem).** "Body effect: Vt0 = 0.35 V, γ = 0.3 √V, 2φF = 0.8 V. What is Vt at Vsb = 0.3 V and 0.5 V? Where does this matter?"

**Answer.**
- Vt(0.3) = 0.35 + 0.3·(√1.1 − √0.8) = **0.396 V**.
- Vt(0.5) = 0.35 + 0.3·(√1.3 − √0.8) = **0.424 V**.

It matters for the upper devices in an NMOS stack (NAND or ROM series cells), whose sources sit above ground, for pass-gate weak levels (A3) and for source followers (A2). Reverse body bias is a leakage knob for the same reason. FinFETs have weak body effect, which removes much of this and also most of the body-bias knob.

**▸ Follow-up 4.** "How does temperature change Id?"

**Answer.** Three effects compete:
- **Vt decreases** by about 0.5–1 mV/K, which raises current.
- **Mobility decreases** (µ ∝ T^−1.5, phonon scattering), which lowers current.
- **kT/q increases**, which raises S: about 62 mV/dec at −40 °C, 80 at 27 °C and 107 at 125 °C (n = 1.35).

At high Vgs the mobility term wins, so hot is slower. Near Vt the threshold term wins, so hot is faster. The curves therefore **cross**: this is **temperature inversion**. With the explicit extension used here (Vt −1 mV/K, µ ∝ T^−1.5, kT/q), the crossover is at **Vgs ≈ 0.75 V**. At 0.9 V cold gives 34 µA and hot 28 µA. At 0.5 V hot gives 4.3 µA and cold 1.3 µA.

**▸ Follow-up 5 — What if VDD sits near or below the crossover?**

**Answer.** Near the crossover (the **zero-temperature-coefficient** point) delay barely changes with temperature, which is pleasant. **Below** it, the **cold** corner becomes the slowest corner. In modern low-VDD FinFET designs, timing therefore has to be signed off at **SS/cold** as well as SS/hot, and the worst corner can swap between the high-voltage and low-voltage (DVFS) operating points. The point to state in an interview: "worst-case timing is not always hot".

**▸ Follow-up 6 — What if it's hot: what happens to leakage?**

**Answer.** Leakage is exponential in −Vt/(n·kT/q), and **both** Vt and kT/q move in the direction that increases it. In the model, Ioff goes **91 fA (−40 °C) → 19 pA (25 °C) → 2.3 nA (125 °C)**: about **120× from 25 to 125 °C** and 25,000× across the full range (real-silicon ratios depend strongly on the leakage mix and Vt flavor (added)). Hot is therefore the worst case for **keepers, ROM bitline droop, dynamic-node retention and standby power**. This is a design point, not a footnote, for a ROM with hundreds of cells per bitline.

<div class="co co-guard"><p class="co-t">Trap</p>

"Hot is always the slow corner." That holds only above the temperature-inversion crossover. Another common mistake: calling S "60 mV/dec". That is the ideal-n room-temperature limit. Real devices are worse, and S scales with T.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Subthreshold current is diffusion over a gate-controlled barrier (S = n·kT/q·ln10). Vt is a convention that DIBL, body bias and temperature all move, and because Vt and mobility move in opposite directions with T, hot is faster below the crossover and slower above it.

</div>

### A6. Inverter delay and sizing

Why they ask: standard-cell design means sizing for delay, input capacitance and load. They want tp = 0.69·R·C from first principles and the optimal-chain argument.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_inv_delay.png: the original referenced asset was not included in the supplied source bundle. Left: inverter transient with a 20 ps input ramp into 4 fF, with 50% delay points; right: step-input tpHL against VDD from the model, with an α-power fit.

</div>

**Opening question.** "Where does tp = 0.69·R·C come from, and what is R?"

**Answer.** If the switching device is modeled as a resistor R discharging C, then V(t) = VDD·e^(−t/RC). V reaches VDD/2 at t = RC·ln 2 = **0.69·RC**. A real transistor is not a resistor: during the 50% transition it is mostly a current source. **R_eq** is defined as the average of Vds/Id over the swing from VDD to VDD/2, which is about (3/4)·VDD/Idsat. In the model, the unit NMOS Idsat is 30.5 µA, so R_eq ≈ 22 kΩ. For C = 4 fF, 0.69·R·C = **61 ps**, against **63 ps** from the exact step-input integral and **69 ps** with a 20 ps input ramp (tpHL ≈ tpLH because the strengths are matched). Rise and fall times (10–90 %) are about **128 ps**.

```latex
t_p = \int_{V_{DD}/2}^{V_{DD}} \frac{C\,dV}{I_D(V)} \;\approx\; 0.69\,R_{eq}\,C,\qquad R_{eq}\approx \frac{3}{4}\frac{V_{DD}}{I_{Dsat}}
```

Draw: input ramp and output RC-like edge, with arrows between the 50 % crossings.

**▸ Follow-up 1.** "What's self-loading, and why doesn't making the inverter wider make it infinitely fast?"

**Answer.** The load is C_ext plus the inverter's **own drain capacitance**, which is proportional to W. With tp = 0.69·(R₀/W)·(γ·C₀·W + C_ext): widening W shrinks the C_ext term, but the self-loading term 0.69·R₀·γ·C₀ = **tp0** is independent of W. That is the **intrinsic delay**, and no amount of width removes it. Widening also raises the input capacitance, which slows the **previous** stage.

**▸ Follow-up 2.** "What is FO4 and why do we use it?"

**Answer.** **FO4** is the delay of an inverter driving four copies of itself: tp = tp0·(1 + 4/γ). It is a process-normalized unit that cancels most technology dependence, so designs can be compared across nodes. Worked example: R = 5 kΩ, Cin = 1.5 fF and Cd = 1.5 fF (γ = 1) gives FO4 = 0.69 × 5 kΩ × (1.5 + 6) fF = **25.9 ps**. Gate delays are often quoted in FO4s, and a clock period is commonly ~15–25 FO4.

**▸ Follow-up 3 (worked numeric problem).** "Drive C_L = 4096·Cin of a unit inverter. How many stages and what ratio? γ = 1, tp0 = 5.2 ps."

**Answer.** With N stages of fanout f each, f^N = F = 4096 and total delay = N·tp0·(1 + f/γ).

- N = 1: f = 4096 → 4097·tp0 (= 21.2 ns)
- N = 3: f = 16 → 51·tp0
- N = 5: f = 5.28 → 31.4·tp0
- **N = 6: f = 4.00 → 30.0·tp0 (= 155 ps)**
- N = 7: f = 3.28 → 29.97·tp0
- N = 8: f = 2.83 → 30.6·tp0

The optimum satisfies ln f = 1 + γ/f, which gives **f ≈ 3.6** for γ = 1 (e for γ = 0). The minimum is **very flat**, so engineers use f ≈ 4. N = 6 or 7 are within 0.1 %. Adding an inverter for polarity costs almost nothing near the optimum.

**▸ Follow-up 4 — What if you double the width, or double the load?**

**Answer.**
- **Double W** of one inverter with a fixed external load: R halves and self-load doubles, so the intrinsic term is unchanged and the external term halves. Delay drops but not by 2×. The previous stage now sees 2× input capacitance, so the path may not improve. Only the full chain tells you.
- **Double the load**: only the external term doubles. For FO4 with γ = 1 that is 5·tp0 → 9·tp0, or **+80 %**, not +100 %, because self-loading does not change.

**▸ Follow-up 5 — What if you lower VDD?**

**Answer.** tp ∝ C·VDD/Ion, and with the **α-power law** Ion ∝ (VDD − Vt)^α:

```latex
t_p \;\propto\; \frac{C\,V_{DD}}{(V_{DD}-V_t)^{\alpha}}
```

- The model has no velocity saturation, so the fit gives α ≈ **2.1**. From 0.9 to 0.7 V delay grows **2.0×** (63 → 127 ps), and at 0.5 V it is **7.5×**.
- Real short-channel devices have α ≈ 1.2–1.5. With α = 1.3, 0.9 → 0.7 V would give only 1.4×.
- Below Vt the formula breaks down. The current becomes exponential, so delay explodes: **3.6 ns at VDD = Vt** and **28 ns at 0.25 V**, which is 57× and 440× the 0.9 V value.

This is the energy–delay tradeoff behind DVFS.

**▸ Follow-up 6.** "Why does a slow input slew increase delay, and how big is the effect?"

**Answer.** While the input is still ramping, the pull-down is only partly on and the pull-up has not switched off, so the two fight (crowbar current). The 50 %-to-50 % delay grows. In the model, a stage driven by a realistic self-similar edge (~128 ps 10–90 %) has **122 ps** delay, against 63 ps for a step: almost 2×. This is why timing libraries are indexed by **input slew and output load**, and why max-transition rules exist.

<div class="co co-guard"><p class="co-t">Trap</p>

"Make it twice as wide and it's twice as fast." Self-loading caps the gain, and a bigger input capacitance slows the previous stage. Another trap is quoting tp = RC without the ln 2, or treating R as Vds/Id at one bias point.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Delay is charge over current (0.69·R_eq·C). Self-loading sets an intrinsic floor, the optimum fanout per stage is about 4 (flat minimum), and delay scales as VDD/(VDD − Vt)^α until it goes exponential below Vt.

</div>

### A7. Ring oscillator

Why they ask: it combines inversion, gain and delay, and it is the standard silicon process monitor. Expect "why odd?", "what if even?" and "how do you gate it?".

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

A_ring.png: the original referenced asset was not included in the supplied source bundle. Five-stage ring oscillator and its node waveforms (C = 4 fF per node): period about 1.22 ns, so tp is about 122 ps per stage.

</div>

**Opening question.** "What sets the frequency of a ring oscillator, and why must N be odd?"

**Answer.** An edge must travel around the loop **twice** for one full period: once to flip every node, and once more to flip them back. So:

```latex
f = \frac{1}{2\,N\,t_p}
```

The loop needs **net inversion** so that it has **no stable DC solution**. With N odd, assuming all nodes are logic levels leads to a contradiction, and the only DC solution is every node at VM. That point is **unstable** because the small-signal loop gain is |A|^N ≫ 1. Model: N = 5 with 4 fF per node gives T = **1224 ps** → f = 0.82 GHz → **tp ≈ 122 ps**.

Draw: N inverters in a loop and staggered square-ish waveforms, each node delayed by tp from the previous one.

**▸ Follow-up 1.** "What if N is even?"

**Answer.** The loop is then non-inverting, so it has **two stable states** (alternating 0/1/0/1 and its complement). It **latches** into one of them and never oscillates. N = 2 is exactly the cross-coupled pair at the core of an SRAM cell or latch. The VM point still exists but is a metastable saddle. A noise kick sends it to one of the stable states (metastability).

**▸ Follow-up 2.** "What's the minimum stage gain required? What about N = 1?"

**Answer.** Use the Barkhausen condition with single-pole stages. The N stages must add 180° of phase on top of the DC inversion, so each provides 180°/N, and the loop gain must be ≥ 1 at that frequency. This gives |A₀| ≥ 1/cos(π/N): **2.0 for N = 3**, **1.24 for N = 5** and **1.11 for N = 7**. An inverter (|A| ≈ 41) passes easily. The swapped structure in A2 (gain < 1, non-inverting) fails both tests. For **N = 1**, a single inverter with output tied to input settles at **VM**. That is a self-biased amplifier (used to bias inverter-based amplifiers or crystal oscillators), not an oscillator, because one pole cannot give 180° of phase.

**▸ Follow-up 3 (worked numeric problem).** "31-stage ring, tp = 15 ps. Frequency? Silicon measures 250 MHz on a 101-stage ring: what's tp? What does a 5 % slower tp do to the 31-stage ring?"

**Answer.**
- f = 1/(2·31·15 ps) = **1.075 GHz**.
- tp = 1/(2·101·250 MHz) = **19.8 ps**.
- tp = 15.75 ps gives f = **1.024 GHz**, a 4.8 % drop. Frequency is directly proportional to device drive, which is why rings make good monitors.

**▸ Follow-up 4.** "How are rings used as process monitors?"

**Answer.** f ∝ Ion/(C·VDD), so ring frequency on scribe-line or on-die monitors bins **fast/slow corners**, tracks **VDD droop and temperature**, and supports adaptive voltage scaling. Making the ring **NMOS-sensitive** or **PMOS-sensitive** (stages with stacked NMOS or PMOS, NAND versus NOR rings, or skewed sizing) separates the two devices, so FS and SF corners can be identified. Rings with wire loads or extra fanout separate **device** from **interconnect** (RC) variation, and leakage-sensitive variants track Ioff. The ring includes realistic input slews, so its tp (122 ps here) is a "loaded, real-slew" delay rather than the 63 ps step-input number.

**▸ Follow-up 5 — What if one stage is a NAND2 with an enable input?**

**Answer.** With **EN = 1** the NAND behaves as an inverter (Y = ¬A), so the ring oscillates. f falls slightly because a NAND stage, with its series NMOS stack, is slower: for example 30 inverters at 15 ps plus one NAND at 20 ps gives 1/(2·470 ps) = **1.064 GHz**. With **EN = 0** the NAND output is forced to **1**, the loop is broken and every node settles to a defined level. There is no floating node and no crowbar current, so the ring is cleanly **stopped**. This is how test rings are gated and how counters read them out. NAND (enable active-high, parks the output high) or NOR (parks it low) is chosen by the required idle state.

**▸ Follow-up 6 — What if VDD or temperature changes?**

**Answer.** f follows the device current. Lowering VDD lowers f sharply (A6), and near or below threshold it falls exponentially, which is why rings make good on-die VDD sensors. Temperature has the effect described in A5. Above the inversion crossover hot is slower, below it hot is faster, and near the zero-temperature-coefficient point the ring is nearly temperature-independent. The same ring therefore reads differently at different supply voltages, which matters when calibrating it as a thermal sensor.

<div class="co co-guard"><p class="co-t">Trap</p>

Writing f = 1/(N·tp). The factor of 2 is needed because each node must switch twice (rise and fall) per period. Other traps: saying "even rings oscillate too, just at a different frequency" (they latch), and forgetting the per-stage gain requirement.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A ring needs odd inversion and enough per-stage gain (|A| > 1/cos(π/N)). It runs at 1/(2·N·tp), latches if N is even, and its frequency maps directly onto Ion/(C·VDD), which makes it a process, voltage and temperature monitor.

</div>


## Part B — Gates, delay, power and dynamic logic, drilled

### B1. NAND2 from the transistors up

Why they ask: NAND2 is the workhorse of every standard-cell library. Pin order, sizing and the internal node turn up directly in cell layout and in the pin-dependent timing arcs of the .lib.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_nand2_sch.svg: the original referenced asset was not included in the supplied source bundle. NAND2 with 2:1 sizing; the late-arriving input A drives the NMOS nearest the output, so node X is already discharged when A arrives

</div>

**Opening question.** "Draw a two-input NAND at transistor level, size it, and tell me which input you'd connect to which transistor."

**Answer.**
- **Pull-up:** two PMOS in **parallel** (either input low → Y = 1). **Pull-down:** two NMOS in **series** (both high → Y = 0). The two networks are duals, so Y = ¬(A·B).
- Sizing in a 2:1 mobility process: a unit inverter is N = 1, P = 2. Each series NMOS is doubled to **N = 2** so that the stack matches one unit NMOS. Each PMOS is **P = 2**, because the worst-case pull-up has only one PMOS on. Input capacitance per pin is 2 + 2 = 4 units against 3 for the inverter, so **g = 4/3**.
- **Pin order:** connect the **latest-arriving input to the NMOS nearest the output** (MNA). The early input has already discharged the internal node X through MNB, so the late edge only has to discharge C_out.
- Draw: the schematic above. Then the stick diagram: a p-diffusion strip VDD | A | Y | B | VDD and an n-diffusion strip Y | A | X | B | GND, with poly A and B in the same order in both. That gives one Euler path, no diffusion breaks, and shared diffusion on Y and X.

**▸ Follow-up 1.** "Which input pattern gives the worst-case fall, and which gives the worst-case rise? Give me numbers."

**Answer.** I'd use Elmore delay with W&H units: an NMOS of width 1 has resistance R, a PMOS of width 2 has R, and diffusion is C per unit width. The output carries 6C of parasitic (2C + 2C from the PMOS drains, 2C from MNA), node X carries 2C, and the load is h fan-out NAND2 inputs at 4C each.

**Worked numeric problem.** R = 10 kΩ, C = 0.15 fF (RC = 1.5 ps), fan-out h = 3, so C_out = 6C + 12C = 18C.

| Transition | Who conducts | Elmore | Delay |
|---|---|---|---|
| Fall, A (top) arrives last, X already at 0 | MNA + MNB (R/2 + R/2) | R·18C = 18RC | **27.0 ps** |
| Fall, B (bottom) arrives last, X precharged | adds (R/2)·C_X | 18RC + (R/2)(2C) = 19RC | **28.5 ps** (worst fall) |
| Rise, A falls (X isolated by MNA) | one PMOS (R) | 18RC | 27.0 ps |
| Rise, B falls with A = 1 (X recharged through MNA) | adds (R + R/2)·2C | 21RC | **31.5 ps** (worst rise) |
| Rise, A and B fall together | two PMOS in parallel (R/2) | 9RC | 13.5 ps (best) |

```latex
t_{pdf,\,worst} = \tfrac{R}{2}\,(2C) + \left(\tfrac{R}{2}+\tfrac{R}{2}\right)(6+4h)C = (7+4h)\,RC
```

The worst fall happens when the bottom input arrives last. The worst rise happens when only one PMOS turns on **and** X has to be recharged as well. The simultaneous-falling case is the fastest rise.

**▸ Follow-up 2.** "What voltage is the internal node X at when A = 1 and B = 0? How much charge does it hold?"

**Answer.** Y is high, MNA has V_G = V_DD and MNB is off. MNA acts as a source follower that charges X toward V_DD − V_t. Because X is MNA's source, **body effect** raises V_t, so X reaches only about 0.4 V within roughly 100 ps in the model. After that MNA is in subthreshold and X keeps **creeping up**. The true DC limit is the point where MNA's subthreshold current equals MNB's I_off, about 0.66 V in the model (no DIBL). With C_X = 1 fF at about 0.45 V, X holds **Q ≈ 0.45 fC**. That charge matters in three ways:
1. It produces the extra (R/2)·C_X term in the worst fall.
2. Delay becomes **history-dependent**, which is why .lib timing arcs are per pin and sometimes per state.
3. In dynamic logic the same charge causes **charge sharing** (B5). In a static NAND the on PMOS restores the output, so it only shows up as a small dip.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_nand2_vx.png: the original referenced asset was not included in the supplied source bundle. Internal node X charging through MNA, which acts as a source follower: fast to about 0.4 V (body-effected V_t), then a slow subthreshold creep toward the DC limit

</div>

**▸ Follow-up 3.** "Does the VTC depend on which input switches?"

**Answer.** Yes. At V_M, KCL sets the PMOS current equal to the stack current.
- **Both inputs switching together:** the two PMOS are in parallel (twice the pull-up) against the full series stack, so V_M rises: **0.477 V** in the model.
- **One input switching:** one PMOS against a stack whose other device is fully on: about **0.43 V**. That is slightly below the reference N1/P2 inverter (0.450 V), because two width-2 NMOS in series are a bit stronger than one width-1 device. The bottom transistor sits in the linear region with only a small V_DS.
- **Top (A) versus bottom (B) switching:** when A switches, its source is at V_X > 0 (degeneration plus body effect), so it is weaker and V_M is slightly higher: **0.431 V against 0.427 V**. The model's gap is small. In bulk silicon with a stronger body effect it is larger (added).

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_nand2_vtc.png: the original referenced asset was not included in the supplied source bundle. NAND2 VTCs for the three switching cases; simultaneous switching shifts V_M up by about 50 mV, and top versus bottom differ by a few mV

</div>

**▸ Follow-up 4.** "Why does the 'both switch together' case matter for timing sign-off?"

**Answer.** The .lib is characterized with **single-input switching**: one pin toggles and the others are held at non-controlling values. When both inputs fall together the rise is about 2× faster (9RC against 18RC), so single-input-switching numbers are pessimistic for max delay and **optimistic for hold/min delay**. When both rise together the stack sees only one edge. This is the **multi-input switching** effect, and some flows add derates for it (added).

**▸ Follow-up 5 — What if** "you put the late-arriving input on the **bottom** transistor instead?"

**Answer.** Every late fall now pays for discharging X: 19RC against 18RC, which is **+1.5 ps (+5.6%) at h = 3** and +10% at h = 1 (11RC against 10RC). The late rise also pays 3RC to recharge X. Rule: the critical input goes **nearest the output**. The gate is logically symmetric but **not electrically symmetric**, and library cells publish different arcs for pins A and B.

**▸ Follow-up 6 — What if** "this is a 1:1 FinFET-like process (μ_n ≈ μ_p)?"

**Answer.** The unit inverter becomes N = 1, P = 1 with C_in = 2. NAND2 becomes N = 2, P = 1, so C_in = 3 and **g = 3/2**. That is *worse* than the 4/3 of the 2:1 process, because the inverter it is compared against got cheaper. NOR2 becomes N = 1, P = 2, also **g = 3/2**, so the NAND advantage disappears in logical-effort terms. In FinFET, widths are **quantized to whole fins**, so "N = 2" means 2 fins. Ratios like 1.5 cannot be built, which is one reason libraries use skewed and multi-fin variants.

**▸ Follow-up 7.** "In layout, why does the ordering matter for area?"

**Answer.** With the same poly order (A, B) in the PMOS and NMOS rows there is a common **Euler path**: each diffusion row is one unbroken strip with shared source/drain contacts. Merged diffusion also reduces C_X, since X needs no contact at all and is only a shared diffusion between two gates. A different order would need a diffusion break, which costs a poly pitch and adds capacitance.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "the worst-case rise is when both inputs fall". Two PMOS in parallel is the *fastest* rise. The worst is one PMOS on plus recharging X. A second trap is treating A and B as interchangeable: they have different delays, VTCs and leakage.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

NAND2 = parallel PMOS (P = 2) plus series NMOS (N = 2), g = 4/3. Put the late input nearest the output, and remember the internal node X: it holds charge, makes delay history-dependent, and moves V_M.

</div>

---

### B2. NOR vs NAND, complex gates, and logical effort with real numbers

Why they ask: choosing cells and sizing a path is daily work in a standard-cell team, and logical effort is the fastest way to show you can reason about it without a simulator.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_le_g.png: the original referenced asset was not included in the supplied source bundle. Logical effort vs fan-in; in a 2:1 process NOR grows twice as fast as NAND, and in a 1:1 process they coincide

</div>

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_le_path.svg: the original referenced asset was not included in the supplied source bundle. Worked path: inverter, NAND2, NOR2 with a branch of 2 driving 120 units

</div>

**Opening question.** "Why do people prefer NAND over NOR?"

**Answer.** In a NOR the **PMOS are in series**, and the PMOS is already the weak device (μ_p ≈ μ_n/2 in bulk). Matching unit drive in a NOR2 takes P = 4 and N = 1, so C_in = 5 and **g = 5/3**. A NAND2 needs N = 2 and P = 2, so C_in = 4 and **g = 4/3**. The NOR has more input capacitance, larger PMOS area and more PMOS leakage, and with large series PMOS stacks a slower rise. Both gates have the same transistor count; the difference comes entirely from which device ends up stacked.

**▸ Follow-up 1.** "Give me g and p for NAND/NOR with 2–4 inputs."

**Answer.** p is the parasitic delay: output diffusion capacitance in units of the inverter's.

| Gate | g (2:1 process) | g (1:1 process) | p |
|---|---|---|---|
| NAND2 / NOR2 | 4/3 / 5/3 | 3/2 / 3/2 | 2 |
| NAND3 / NOR3 | 5/3 / 7/3 | 2 / 2 | 3 |
| NAND4 / NOR4 | 2 / 3 | 5/2 / 5/2 | 4 |

```latex
g_{\mathrm{NAND}n} = \frac{n+2}{3}, \qquad g_{\mathrm{NOR}n} = \frac{2n+1}{3}, \qquad g_{1:1} = \frac{n+1}{2}
```

**▸ Follow-up 2.** "Size an AOI21, Y = ¬(A·B + C), and give its logical effort."

**Answer.** Pull-down: A and B in series, in parallel with C. Pull-up: (A ∥ B) in series with C, which is the dual. Size each network so its worst path matches a unit inverter (N = 1, P = 2).

| Input | NMOS width | PMOS width | C_in | g |
|---|---|---|---|---|
| A | 2 (series) | 4 (two-stack) | 6 | **2** |
| B | 2 (series) | 4 | 6 | **2** |
| C | 1 (alone) | 4 | 5 | **5/3** |

Put the C PMOS at the output and the A ∥ B pair toward VDD. The output then sees NMOS 2 + 1 and PMOS 4, a total of 7, so **p = 7/3**. Putting A ∥ B at the output would give p = 11/3. Pin C is the fast pin, so route the late signal to C.

**▸ Follow-up 3 — worked path problem.** "Inverter → NAND2 → NOR2 → 120 units of load. The NAND2 output also drives an identical NOR2 off the path. C_in = 10. Size it and give the delay."

**Answer.**

```latex
G = 1\cdot\tfrac{4}{3}\cdot\tfrac{5}{3} = \tfrac{20}{9},\quad B = 2,\quad H = \tfrac{120}{10} = 12,\quad F = GBH = 53.33
```

```latex
\hat f = F^{1/3} = 3.764,\qquad D = 3\hat f + P = 3(3.764) + (1+2+2) = 16.29\,\tau
```

Size backward from the load using C_in,i = g_i·b_i·C_out,i / f̂:
- NOR2 input = (5/3)(120)/3.764 = **53.1**, giving N = 53.1/5 = 10.6 and P = 42.5.
- NAND2 input = (4/3)(2·53.1)/3.764 = **37.6**, giving N = P = 18.8.
- Inverter input = 1·37.6/3.764 = 10.0 ✓ (closes the loop).

Every stage then has f = 3.764. With τ = 3 ps, D ≈ 16.3τ ≈ **49 ps**. The optimal stage count is N̂ = log₄F = 2.87, so 3 stages is correct.

**▸ Follow-up 4 — What if** "the load doubles to 240?"

**Answer.** F = 106.7, f̂ = 4.74, D = 3(4.74) + 5 = **19.2τ**. Now N̂ = log₄F = 3.37. A 4-stage path would give 4·F^¼ + 6 = **18.9τ**, about 2% faster, but it inverts the logic. Keeping polarity takes 5 stages, which gives 19.7τ (worse). The right answer is to keep 3 stages and upsize, or to restructure (for example, absorb an inversion into the logic). The delay curve is very flat near the optimum.

**▸ Follow-up 5 — What if** "you build a NOR3 in a 1:1 FinFET-like process?"

**Answer.** P = 3 fins per PMOS in a series stack and N = 1 fin, so C_in = 4 and **g = 2**, exactly the same as NAND3 (N = 3, P = 1, also g = 2). p = (3 + 3)/2 = **3** for both. The classic "avoid NOR" rule is mostly a 2:1-mobility argument. In a balanced process the NOR penalty shrinks to secondary effects:
- the three-high PMOS stack has internal-node capacitance and series contact/via resistance;
- fins are quantized;
- PMOS performance depends on strain, which can make the effective ratio non-unity (added).

Bulk body effect is largely gone in FinFET, because undoped fins have weak body coupling (added), so stacking costs mostly resistance and capacitance.

**▸ Follow-up 6.** "Why not just build a NAND8?"

**Answer.** Stack delay grows **quadratically**. Each of the n series devices is sized n× (R/n), and each internal node carries about nC. The Elmore delay is then:

```latex
t_{stack} \approx \sum_{i=1}^{n-1}\frac{iR}{n}\,(nC) + R\,C_{out} = \frac{n(n-1)}{2}\,RC + R\,C_{out}
```

The internal-node terms are 1, 3 and 6 RC for n = 2, 3, 4, while g grows linearly. On top of that, body effect weakens the upper devices in bulk, there are more internal nodes for charge sharing, and slews degrade. Practical limits are about **4 NMOS and 3 PMOS** in series. Beyond that, decompose into a tree (NAND4 = NAND2 → NOR2 gives the same function in a shallower form).

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "NOR is slower because it has more transistors" (it has the same number), or quoting g = 5/3 for NOR2 without saying that it assumes 2:1 mobility. In a 1:1 process NAND2 and NOR2 both have g = 3/2.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

NAND is preferred because series NMOS is cheaper than series PMOS when μ_n ≈ 2μ_p. Logical effort (F = GBH, f̂ = F^(1/N), D = Nf̂ + P) turns path sizing into arithmetic.

</div>

---

### B3. Power: dynamic, short-circuit, leakage, and the energy-delay trade-off

Why they ask: standard-cell libraries carry power tables (internal power, leakage), and a designer must know which knob moves which term and by how much.

**Opening question.** "Where does the power go in a CMOS gate, and which term dominates?"

**Answer.**
1. **Dynamic (switching):** P = α·C·V_DD²·f. This usually dominates in active logic.
2. **Short-circuit:** both devices are on during an input transition. It is typically under about 10% if slews are controlled.
3. **Static leakage:** subthreshold (dominant), gate tunneling, junction/GIDL. It dominates when idle and grows exponentially with temperature.

Draw: an inverter with C_L, arrows for charge from VDD into C_L and from C_L to GND, and a dashed arrow from VDD straight to GND labeled "short-circuit".

**▸ Follow-up 1.** "Derive the CV²f. Where does the energy go?"

**Answer.** On a 0→1 output transition the supply delivers charge Q = C·V_DD at voltage V_DD, so it supplies **E = C·V_DD²**. Half of that, ½CV², ends up stored in C. The other half is dissipated in the PMOS **regardless of its resistance**. On 1→0 the stored ½CV² is dissipated in the NMOS. Each full charge/discharge cycle therefore costs CV² from the supply. With α the probability of a 0→1 transition per cycle:

```latex
P_{dyn} = \alpha\, C\, V_{DD}^2\, f
```

Example: a 2 fF node draws 1.62 fJ per 0→1 transition at 0.9 V, and 0.81 fJ of that is stored.

**▸ Follow-up 2 — worked numeric problem.** "A block switches 1 nF in total with α = 0.1 at 2 GHz and 0.9 V. Power? What if V_DD drops 10%? What if activity doubles?"

**Answer.**
- P = 0.1 × 1 nF × 0.81 V² × 2 GHz = **162 mW**.
- **What if V_DD −10% (0.81 V)** at the same f: P scales as 0.9² = 0.81, giving **131 mW (−19%)**. The gate also slows: with the α-power law (α = 1.3, V_t = 0.35 V), delay ∝ V/(V − V_t)^α grows **×1.135**. If f is lowered to match, P = 162 × 0.81 / 1.135 ≈ **116 mW (−29%)**. Energy per operation is −19% and EDP is ×0.92.
- **What if activity doubles** (for example, glitching or poor clock gating): P is linear in α, so **324 mW**. Glitches count as real transitions. Clock gating and balanced paths cut α. The clock net has α = 1 (two edges per cycle) and is often 30–40% of dynamic power (added).

**▸ Follow-up 3.** "When does short-circuit current flow, and how does it depend on input slew?"

**Answer.** It flows only while V_tn < V_in < V_DD − |V_tp| **and** the output has moved enough to put voltage across the device that is turning off. With a rising input and C_L = 0.2 fF in the model, the supply current is pure short-circuit current, because the PMOS is only turning off. Results:
- Input t_r = 20 ps: E_sc ≈ **0.4%** of C_L·V_DD².
- Input t_r = 200 ps: E_sc ≈ **11.5%**.

Sweep: 10 / 20 / 50 / 100 / 200 / 400 ps gives 0.1 / 0.4 / 1.7 / 4.6 / 11.5 / 27% of C_L·V_DD².

With a 2 fF load at 100 ps it is only about 0.1%. The output barely moves during the input window, so the PMOS has almost no V_SD. The design rule is to **keep input and output slews comparable**; library max-transition limits partly enforce this.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_sc_current.png: the original referenced asset was not included in the supplied source bundle. Inverter with a rising input; supply current is pure short-circuit current, and a 10× slower input gives about 30× more short-circuit charge here

</div>

**▸ Follow-up 4 — What if** "V_DD < V_tn + |V_tp| (here 0.7 V)?"

**Answer.** There is no input voltage at which both devices are above threshold, so strong-inversion short-circuit current disappears and only subthreshold overlap current remains. That is one reason near-threshold designs see negligible short-circuit power. The cost is that the VTC becomes subthreshold-shaped, delay gets much worse, and **leakage energy per operation rises** because each operation takes longer.

**▸ Follow-up 5.** "Leakage: give me a number for a block, and say what moves it."

**Answer.** A 10M-gate block at about 100 pA average per gate leaks 10M × 100 pA × 0.9 V ≈ **0.9 mW at room temperature**. At 125 °C the model's subthreshold leakage is ×44, giving about **40 mW**. In standby leakage dominates, which is why there are power gating, HVT cells, stacking and input-vector control (see B4). Leakage grows exponentially as V_t falls (60–100 mV/decade) and with temperature, and roughly linearly to exponentially with V_DD through DIBL.

**▸ Follow-up 6.** "Where is the energy-delay optimum?"

**Answer.** Energy ∝ V², and delay ∝ V/(V − V_t)^α. So EDP ∝ V³/(V − V_t)^α, and its minimum is at:

```latex
\frac{d}{dV}\ln\frac{V^3}{(V-V_t)^\alpha}=0 \;\Rightarrow\; V_{opt} = \frac{3V_t}{3-\alpha} = \frac{3(0.35)}{1.7} \approx 0.62\ \text{V}
```

The curve is flat around the optimum, so running at 0.9 V costs only about +20% EDP and buys about 1.7× speed. A square-law model (α = 2) would put the optimum at 3V_t ≈ 1.05 V. Including leakage energy pushes the optimum **up**, because slow operation integrates leakage for longer.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_edp.png: the original referenced asset was not included in the supplied source bundle. Normalized energy, delay and EDP vs V_DD with the α-power model; the EDP minimum is at about 0.62 V

</div>

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "the PMOS resistance determines how much energy is lost while charging". It does not: half of CV² is lost in any resistive charging. Another trap is saying "dropping V_DD 10% saves 10%". It saves 19% at the same f because power scales with V².

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

P = αCV²f + short-circuit + leakage. V² is the strongest knob, slew control keeps short-circuit power small, and leakage is the exponential term that dominates when idle and hot.

</div>

---

### B4. Leakage in gates: stack effect, state dependence, temperature, and how to characterize it cheaply

Why they ask: every cell in the library needs state-dependent leakage numbers (Liberty `leakage_power` with `when` conditions). Bo will want to hear the physics of the numbers and an efficient way to compute them.

**Opening question.** "Your NAND2 is idle. Does its leakage depend on the input state, and why?"

**Answer.** Yes, by up to about 10× in a NAND2. Leakage flows through whichever network is **off**:
- inputs 11: the output is low, and the two parallel PMOS leak with full V_DS;
- 01 / 10: one NMOS in the stack is off;
- 00: **both NMOS are off in series**, and this is the minimum because of the **stack effect**.

The intermediate node rises a little, which gives the top device V_GS < 0, body effect, and less DIBL on the bottom device.

Draw: the NMOS stack with node X at a few tens of mV, annotated "top: V_GS = −V_X, V_DS = V_DD − V_X; bottom: V_GS = 0, V_DS = V_X".

**▸ Follow-up 1.** "Derive the intermediate node voltage for two off NMOS in series."

**Answer.** Use subthreshold current in EKV form: the gate term is divided by n, and the source term enters at full strength, which includes body effect. DIBL is η·V_DS. Apply KCL at X (top current = bottom current):

```latex
I = I_0\,e^{\frac{V_G - V_t + \eta V_{DS}}{nU_T}}\,e^{-\frac{V_S}{U_T}}\left(1-e^{-\frac{V_{DS}}{U_T}}\right)
```

```latex
\underbrace{\frac{\eta (V_{DD}-V_X)}{nU_T} - \frac{V_X}{U_T}}_{\text{top}} = \underbrace{\frac{\eta V_X}{nU_T} + \ln\!\left(1-e^{-V_X/U_T}\right)}_{\text{bottom}}
```

If V_X ≫ U_T, the log term vanishes and the closed form is:

```latex
V_X \approx \frac{\eta V_{DD}}{n + 2\eta}
```

With η = 0.08, n = 1.35, V_DD = 0.9: the closed form gives **V_X ≈ 48 mV**, the exact equation gives **51 mV**, and the full model (including λ) gives **57 mV**. The leakage reduction I_single/I_stack ≈ e^{η(V_DD − V_X)/(nU_T)} is about 7×; the exact value is **8.1×** and the model gives **10.2×**. Without DIBL the model gives only **2.4×**, so **DIBL removal on the bottom device is the main mechanism**. Body effect and negative V_GS on the top device set V_X.

**▸ Follow-up 2 — worked numeric.** "Give me the leakage per state for NAND2 and NAND3."

**Answer.** Model at 27 °C, 2:1 sizing (NAND2: N = 2, P = 2; NAND3: N = 3, P = 2). States are listed top → bottom of the NMOS stack.

| NAND2 state | Leaking path | I_leak |
|---|---|---|
| 00 | 2-stack, V_X = 57 mV | **33 pA** (best) |
| 01 | top off, full V_DS, source at 0 | 341 pA (worst, tie) |
| 10 | bottom off; X passes up to ~0.64 V through the on top device, so V_DS is smaller and DIBL lower | 175 pA |
| 11 | two PMOS off in parallel (each W = 2 at half mobility = one unit NMOS) | 341 pA (worst, tie) |

The NAND2 average over equiprobable states is 222 pA. For NAND3 the range is **25 pA (000)** to **511 pA (011 and 111)**, about 20×, and the average is 213 pA. 001/010 give 50 pA (two-stack) and 100 gives 45 pA.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_leak_states.png: the original referenced asset was not included in the supplied source bundle. State-dependent leakage of NAND2 and NAND3; the all-off NMOS stack is lowest, and a single off device with full V_DS (or the parallel PMOS) is highest

</div>

**▸ Follow-up 3.** "How do you use that?"

**Answer.** (a) Liberty stores leakage per `when` state, and power tools weight the states by signal probability. (b) **Input-vector control**: in sleep mode, park the inputs in the minimum-leakage state (for example, drive NAND inputs to 0). (c) Pin order affects leakage as well as delay, as the 01/10 asymmetry shows. (d) **Stack forcing**: replace one off-prone device of width W with two series devices of width W/2 each. Input capacitance stays the same and leakage falls several-fold, at the cost of delay, so it suits non-critical paths.

**▸ Follow-up 4 — What if** "the die runs at 125 °C instead of 25 °C?"

**Answer.** Three effects stack up:
1. The subthreshold slope degrades: S = n·U_T·ln10 goes from **80.5 mV/dec to 107 mV/dec**.
2. V_t drops by about 0.8 mV/K.
3. Mobility falls as T^−1.5. This partly offsets the first two, and it also slows I_on (×0.83 in the model).

The model gives **×44** for a single off device, which is about a **doubling every 18 °C**. The two-stack goes up ×72, and the HVT device ×97, because a higher-V_t device has more exponent to lose. Temperature inversion and self-heating make leakage sign-off at the hot corner (added).

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_leak_temp.png: the original referenced asset was not included in the supplied source bundle. Subthreshold leakage vs temperature on a log axis for a single device, a two-stack and an HVT device

</div>

**▸ Follow-up 5 — What if** "you swap to HVT (+100 mV)?"

**Answer.** Leakage falls by e^{0.1/(nU_T)} = **17.5×** (the model agrees), while I_on drops to **0.70×** in the model. Real libraries typically quote about 10× less leakage and about 15–30% more delay per Vt step (added), because the model's square-law-like strong inversion overstates the I_on loss. The use is **multi-Vt optimization**: swap non-critical cells to HVT after timing closure, and keep LVT/SVT on critical paths.

**▸ Follow-up 6.** "How would you characterize leakage for a whole library with minimal compute?"

**Answer.**
1. **DC operating point only.** Leakage is static, so each state needs one `.op`, not a transient. That is milliseconds per state.
2. **Enumerate states sparingly.** 2ⁿ states per cell, but you can **exploit symmetry**: equivalent pins with identical stacks share results, and states where the off network is identical give the same leakage (in NAND3, 001 and 010 are both two-stacks with identical numbers here).
3. **Batch.** Put all states of a cell, or many cells, in one netlist as independent instances, or use `.alter`/`.data` sweeps over corner and temperature. One simulator launch then covers hundreds of op points, which amortizes the parse and model-load overhead that dominates such short runs.
4. **Exploit structure.** Leakage = the sum over off sub-networks. Characterize **primitives** (single off device at each V_DS, 2-stack, 3-stack, PMOS parallel) once per Vt/corner/temperature, then compose cell leakage from lookup. A full simulation is needed only for cells with odd topologies such as transmission gates and feedback.
5. **Fit temperature and V_DD.** Simulate 3–4 temperatures and fit log(I) against T (it is smooth) instead of simulating every point.
6. **Validate.** Full-sim a random sample of cells and states at the extreme corners (FF, 125 °C, high V_DD) and compare against the composed values (for example, within 5%). Also check that gate leakage and GIDL are included, because primitive composition misses gate tunneling from on devices.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "two stacked off transistors leak half as much". It is 5–10× less, because the intermediate node gives the top device V_GS < 0 and body effect, and the bottom device loses its DIBL. A second trap is forgetting the PMOS network in the 11 state.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Leakage is state-dependent: an off stack is about 10× lower thanks to V_X of a few tens of mV and DIBL. It is exponential in temperature (about 2× per 18 °C here) and in V_t (about 17× per 100 mV). Characterize it with batched DC op points and composed primitives.

</div>

---

### B5. Domino logic: precharge/evaluate, keeper window, charge sharing

Why they ask: custom datapath and ROM/register-file read paths use dynamic nodes. Bo works next to the custom ROM team, and keeper sizing and charge sharing are the classic drill topics.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_domino_sch.svg: the original referenced asset was not included in the supplied source bundle. Footed domino AND2 with a weak PMOS keeper driven from the output; X is the charge-sharing node

</div>

**Opening question.** "Draw a domino gate and walk me through one clock cycle."

**Answer.**
- **CLK = 0 (precharge):** the precharge PMOS pulls the dynamic node to V_DD and the foot NMOS is off. OUT = 0 after the static inverter.
- **CLK = 1 (evaluate):** the precharge is off and the foot is on. If the pull-down network conducts (A·B = 1), the dynamic node discharges and OUT rises. Otherwise the node **floats high**, held only by its capacitance and the keeper.
- The node can only fall during evaluate, so each domino output makes **at most one 0→1 transition per cycle**. Monotonic-rising outputs are what make cascading legal.

Draw: the schematic above plus the waveform below.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_domino_wave.png: the original referenced asset was not included in the supplied source bundle. Two cycles: in cycle 1 only A rises, so charge sharing with X dips the dynamic node; in cycle 2 A and B rise and the node evaluates

</div>

**▸ Follow-up 1.** "Why is it fast, and what does it cost?"

**Answer.** Fast because:
- there is no PMOS in the logic network, so input capacitance is only the NMOS (lower logical effort);
- the output inverter can be **HI-skewed** (strong PMOS) to fire early;
- only one edge type has to be fast.

Costs:
- **clock load** and α = 1 on precharged nodes, hence high power;
- **noise sensitivity** (floating node);
- **charge sharing**;
- the **monotonicity** requirement;
- a **keeper** is needed.

**▸ Follow-up 2 — keeper window, worked numeric.** "How do you size the keeper?"

**Answer.** The keeper is a weak PMOS whose gate is driven by OUT. It must satisfy **I_on(pull-down) > I_keeper > n·I_off (plus noise)**.

Setup: an 8-input domino OR, pull-down NMOS W = 2, foot W = 4. Model numbers:
- One on path at V_dyn = 0.45 V (the trip point of the output inverter): **I_on = 33.0 µA**.
- Keeper per unit W: 13.2 µA at V_dyn = 0.45 V, 5.0 µA at V_dyn = 0.8 V.
- 8 off inputs at V_dyn = 0.8 V: n·I_off = 0.34 nA (clean), 23.7 nA (0.15 V input noise), **1.21 µA (0.3 V input noise)**.

Bounds:
- **Lower bound** (hold V_dyn ≥ 0.8 V against 0.3 V noise): W_k ≥ 1.21 µA / 5.0 µA = **0.24**.
- **Upper bound** (contention rule, I_on ≥ 3·I_k at V_M): W_k ≤ 33.0 / (3 × 13.2) = **0.83**.
- Pick **W_k = 0.3**: I_on/I_k = 8.3, and evaluate delay is 56 ps against 52 ps with no keeper.

Pure leakage alone would need only W_k ≈ 10⁻⁴. **Noise and the hot corner set the floor**, not leakage at 27 °C (leakage at 125 °C is ×44).

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_keeper.png: the original referenced asset was not included in the supplied source bundle. Left: hold with noisy off inputs; no keeper or an undersized keeper lets the node cross V_M, while W_k = 0.3 holds at 0.82 V. Right: evaluate; a stronger keeper slows the fall and W_k = 3 never switches

</div>

**▸ Follow-up 3 — What if** "the keeper is too weak or too strong?"

**Answer.**
- **Too weak** (W_k = 0.05): the node crosses V_M at **2.7 ns** (1.5 ns with no keeper), so OUT glitches high. That is a functional failure, and in domino it is irreversible within the cycle.
- **Too strong:** W_k = 1.2 (beyond the 3:1 rule) evaluates in 78 ps instead of 52 ps (+50%). At **W_k = 3**, I_k ≈ 40 µA exceeds I_on, so the node settles near 0.6 V and **never evaluates**.

Real designs use a **conditional or two-stage keeper**, or a keeper with a long channel or stacked device to get very small W without a minimum-width limit (added).

**▸ Follow-up 4 — charge sharing, worked numeric.** "In cycle 1, A goes high but B stays low. What happens to the dynamic node?"

**Answer.** Charge on C_dyn redistributes onto C_X through MNA. MNA cuts off once V_X reaches V_DD − V_t, which splits the problem into two cases:

```latex
\text{Case 1 } (\Delta V < V_t):\quad \Delta V = \frac{C_X}{C_{dyn}}\,(V_{DD}-V_t)
```

```latex
\text{Case 2 } (\Delta V \ge V_t):\quad V_{final} = V_{DD}\,\frac{C_{dyn}}{C_{dyn}+C_X}
```

- **C_dyn = 10 fF, C_X = 3 fF:** case 1 gives ΔV = 0.3 × 0.55 = **0.165 V**, so V_dyn = **0.735 V**.
- **C_X = 10 fF:** case 1 would need ΔV = 0.55 ≥ V_t, so case 2 applies: V_dyn = **0.45 V**, right at the inverter trip point, which is a failure.

The model transient gives 0.77 V and 0.50 V at 1 ns, slightly higher because body effect raises MNA's effective V_t (X stalls near 0.4 V). Redoing case 1 with V_t,eff ≈ 0.48 V gives 0.9 − 0.3 × 0.42 ≈ 0.77 V, which matches.

Fixes: precharge the internal node with a small PMOS on X; make C_dyn larger relative to C_X (put the larger-capacitance input lower in the stack); add a keeper; reorder inputs.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_charge_share.png: the original referenced asset was not included in the supplied source bundle. Charge sharing with no keeper: C_X/C_dyn = 0.3 costs about 0.13 V, while C_X = C_dyn drops the node close to the inverter trip point

</div>

**▸ Follow-up 5 — What if** "the inputs are non-monotonic, for example a glitch high then low during evaluate?"

**Answer.** The node discharges during the glitch and **cannot recover**: there is no pull-up during evaluate apart from the weak keeper, which turns off once OUT flips. The output stays wrong for the rest of the cycle. Consequences:
- one dynamic gate cannot drive another directly. Its output falls during evaluate, which looks like a 1→0 glitch at the next gate's input, so you need the inverter (that is what makes it **domino**);
- **domino cannot implement inverting logic**. Use dual-rail domino, or push inversions to the start or end of the domino chain;
- static logic inside a domino chain must be **non-inverting** and hazard-free.

**▸ Follow-up 6 — What if** "you remove the foot (footless domino)?"

**Answer.** You save one series device, so the pull-down is faster (lower logical effort) and the clock load is smaller. But during precharge, if any input is still high, there is a **direct path from the precharge PMOS through the pull-down to GND**. That causes crowbar current and a degraded precharge. So footless stages need inputs that are **guaranteed low during precharge**. Normally that means a footed first stage followed by footless stages, with **delayed precharge** (each stage's precharge waits until its inputs have reset) (added).

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "make the keeper as strong as possible for robustness". It fights evaluation and at W_k = 3 the gate never switches. A second trap is quoting the case-2 charge-sharing formula when the pass device cuts off (case 1).

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Domino means precharge high, conditionally discharge once, monotonic inputs only. Size the keeper inside I_on > I_k > n·I_off + noise, and check charge sharing with C_X/C_dyn and V_DD − V_t.

</div>

---

### B6. Crosstalk: Miller factor, coupling noise, and fixes

Why they ask: signal integrity is part of every timing and noise sign-off, and a custom-circuit designer must know why dynamic nodes and sense amplifiers are the most exposed.

**Opening question.** "Two long parallel wires, an aggressor and a victim. What does the aggressor do to the victim?"

**Answer.** Two effects through the coupling capacitance C_c:
1. **Delay change.** When both switch, the effective coupling capacitance is **MCF·C_c**: 0 if they switch in the same direction, 1 if the aggressor is quiet, 2 if they switch in opposite directions.
2. **Noise glitch.** When the victim is quiet, the aggressor injects charge and the victim bumps. This is worst when the victim is floating, as in dynamic nodes.

Draw: two wires, C_c between them, C_g from each to ground, a driver R_v on the victim and R_a on the aggressor.

**▸ Follow-up 1 — worked numeric.** "R_v = 1 kΩ, C_g = 50 fF, C_c = 50 fF. Delay for MCF 0, 1, 2?"

**Answer.** t₅₀ = 0.69·R_v·(C_g + MCF·C_c):
- **34.5 ps** (same direction);
- **69.0 ps** (quiet neighbor);
- **103.5 ps** (opposite direction).

That is a 3× spread. Max-delay sign-off must use MCF = 2 (opposite switching), and **hold/min-delay must use MCF = 0** (same direction). The "×2" comes from the voltage across C_c swinging 2·V_DD.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_miller.png: the original referenced asset was not included in the supplied source bundle. Victim rising with the neighbor switching the same way, quiet, or opposite; the coupling capacitance counts 0, 1 or 2 times

</div>

**▸ Follow-up 2 — worked numeric.** "Victim quiet. What noise bump do you get if the victim is floating, and if it is driven?"

**Answer.**
- **Floating:** pure capacitive divider, ΔV = V_DD·C_c/(C_c + C_g) = 0.9 × 50/100 = **0.45 V**. That is half the supply and above typical noise margins.
- **Driven:** the victim driver bleeds the charge away. Weste–Harris approximation:

```latex
\Delta V_{victim} = \frac{C_c}{C_{g,v}+C_c}\cdot\frac{V_{DD}}{1+k},\qquad k = \frac{\tau_{aggr}}{\tau_{victim}} = \frac{R_a\,(C_{g,a}+C_c)}{R_v\,(C_{g,v}+C_c)}
```

With R_a = 500 Ω, every C_g = 50 fF and C_c = 50 fF:
- R_v = 1 kΩ: k = 0.5, so **ΔV = 0.30 V** (linear RC simulation: 0.24 V).
- R_v = 250 Ω: k = 2, so **ΔV = 0.15 V** (simulation: 0.12 V).

The formula is about 25% pessimistic here. The scaling is right: **a stronger victim holder means less noise**.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_xtalk.png: the original referenced asset was not included in the supplied source bundle. Victim glitch for a floating victim (permanent 0.45 V shift) vs driven victims (a transient bump that decays with τ_victim)

</div>

**▸ Follow-up 3 — What if** "you double the spacing?"

**Answer.** Sidewall coupling falls roughly as 1/s, so take C_c 50 → 25 fF, while C_g rises slightly (say 55 fF) as fringing goes to ground instead.
- Floating noise: 0.9 × 25/80 = **0.28 V** (down from 0.45).
- Driven (R_v = 1 kΩ): k = (500·80f)/(1k·80f) = 0.5, so the formula gives **0.19 V** (simulation 0.14 V).
- Delay range: 0.69·1k·(55 + {0, 25, 50}) fF = **38 / 55 / 72 ps**, against 34.5–103.5 ps before. The spread shrinks from 69 ps to 34.5 ps.

The cost is routing tracks (a non-default rule).

**▸ Follow-up 4 — What if** "you insert a grounded shield wire between them?"

**Answer.** The coupling to the aggressor drops to about 0, so the noise is about 0. The victim's coupling capacitance now goes to a **quiet** line, so C_g ≈ 50 + 50 = 100 fF and the MCF variation disappears. Delay is a fixed **69 ps**, equal to the old MCF = 1 case: deterministic but not faster. You trade a track, and some speed compared with the best case, for predictability. Shields are standard on clocks, dynamic nodes and long analog/sense lines.

**▸ Follow-up 5.** "Why are dynamic nodes and sense amplifiers the most sensitive?"

**Answer.**
- A **dynamic node** is floating or held only by a weak keeper, so a coupling bump is **not restored**. If it crosses the inverter trip point it is an irreversible logic error, as in B5.
- A **sense amp / bitline** resolves a small differential (tens of mV in SRAM/ROM). Coupling of a few tens of mV between adjacent bitlines, or from wordlines, is comparable to the signal and can flip the resolved value. Hence twisted bitlines, shielding, and symmetric layout (added).
- Static CMOS nodes are actively driven, so their noise decays with τ_victim, and the next gate's **noise immunity** (it needs both amplitude and width to propagate) filters short glitches.

**▸ Follow-up 6.** "List the fixes in order of cost."

**Answer.**
1. Upsize the victim driver (raises k).
2. Slow the aggressor slew, if timing allows (lowers k).
3. Insert repeaters (shorter coupled length).
4. Spacing (NDR).
5. Shielding.
6. Move to a different layer, or route orthogonally on adjacent layers.
7. Timing-window analysis: aggressors that cannot switch in the victim's window are filtered out, which removes most pessimism (added).

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "coupling only matters for noise" and forgetting MCF = 0 in hold analysis. A second trap is computing driven-victim noise with the floating formula: a driven victim recovers, a floating one does not.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Coupling scales the effective C_c by 0/1/2 for delay and injects ΔV = V_DD·C_c/(C_c + C_g)·1/(1 + k) of noise. Floating dynamic nodes (k → 0) take the full divider.

</div>

---

### B7. Wires, Elmore delay, and repeaters

Why they ask: past a few hundred µm, wires dominate delay. An engineer who worked on EM flows will also want to see how wire sizing ties delay to current density.

**Opening question.** "How do you estimate the delay of a long on-chip wire, and how do you fix it?"

**Answer.** Model the wire as **distributed RC**. Elmore delay is the first moment of the impulse response: for each capacitor, multiply by the resistance it shares with the path from the source, and sum. For a uniform line that gives **RC/2**; the 50% delay is about 0.38RC. Because R and C both scale with L, delay ∝ **L²**. The fix is **repeaters**: split the wire into N segments so each segment's delay is ∝ (L/N)², which makes total delay **linear in L**. Also consider wider or upper-layer metal.

Draw: a driver, an RC ladder with R/N and C/N, a load, and arrows for "R upstream × C at node".

**▸ Follow-up 1 — worked numeric.** "A 1 mm wire with r = 0.5 Ω/µm and c = 0.2 fF/µm. Elmore delay as an N-segment ladder?"

**Answer.** R = 500 Ω, C = 200 fF, RC = **100 ps**. For an L-section ladder (R/N then C/N), node i has upstream resistance iR/N:

```latex
t_{Elmore} = \sum_{i=1}^{N}\frac{iR}{N}\cdot\frac{C}{N} = RC\,\frac{N+1}{2N}
```

N = 1 gives 100 ps, N = 2 gives 75 ps, N = 4 gives **62.5 ps**, N = 10 gives 55 ps, and N → ∞ gives **50 ps (RC/2)**. The real 50% step delay is about 0.38RC = **38 ps**. Elmore is an upper bound on the 50% delay in RC trees (added).

**▸ Follow-up 2.** "Now add a driver and a load."

**Answer.**

```latex
t = R_d\,(C_w + C_L) + R_w\left(\tfrac{C_w}{2} + C_L\right)
```

The driver sees the whole capacitance. The wire resistance sees half its own capacitance plus the full load. The cross term R_w·C_L is why you put **large receivers** at the near end and why the load end matters.

**▸ Follow-up 3 — worked numeric, repeaters.** "Unit inverter R = 10 kΩ, C = C_p = 0.15 fF, same wire. Optimal repeater spacing, size and delay per mm?"

**Answer.** Minimize the per-length delay of one segment, t_seg = (R/W)(W·C_p + c·l + W·C) + r·l(c·l/2 + W·C):

```latex
l_{opt} = \sqrt{\frac{2R\,(C+C_p)}{rc}} = 245\ \mu\text{m},\quad W_{opt} = \sqrt{\frac{R\,c}{r\,C}} = 163,\quad \frac{t}{l} = \left(2+\sqrt{2\left(1+\tfrac{C_p}{C}\right)}\right)\sqrt{RC\,rc} = 49\ \text{ps/mm}
```

A numeric optimizer gives the same 245 µm, 163 and 49.0 ps/mm. Examples:
- **1 mm:** 4 segments, **49 ps** repeated against 77.5 ps unrepeated (one size-163 driver).
- **5 mm:** **245 ps** against **1375 ps**.

Repeaters pay off beyond about **0.38 mm** for this driver. The optimum is flat: ±30% in spacing costs only a few percent of delay, so designers use fewer, smaller repeaters to save power and area.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

B_wire_delay.png: the original referenced asset was not included in the supplied source bundle. Elmore delay vs length: unrepeated is quadratic, optimally repeated is linear; wider wire and upper metal reduce the slope as √(rc)

</div>

**▸ Follow-up 4 — What if** "you double the wire width?"

**Answer.** **r halves**, but c does **not** double: the area component doubles, while fringe and sidewall coupling stay about the same. Say c rises ×1.3. Repeated delay ∝ √(rc), so it scales by √(0.5 × 1.3) = **0.806**, giving 39.5 ps/mm. Optimal spacing grows to 304 µm. The unrepeated 1 mm delay goes from 77.5 to 57.5 ps.

The EM view: a 2× wider wire carries the same current at half the current density, which roughly helps EM lifetime per Black's equation, MTTF ∝ J^−n. Wide wires are therefore common on clocks and long buses, at the cost of tracks.

**▸ Follow-up 5 — What if** "you move the route to upper metal?"

**Answer.** Upper metal is thicker and wider, so r might be about 10× lower (0.05 Ω/µm) with similar c. Repeated delay ∝ √(rc) falls ×√10 to **15.5 ps/mm** (×0.32), and repeaters are spaced about **775 µm** apart. Costs:
- via-stack resistance going up and down (several vias, each a few Ω or more);
- limited tracks, and blockage of the layers below by the via stacks;
- repeaters still sit in the device layer;
- on very wide, fast upper-layer lines, **inductance** starts to matter, so the RC-only model becomes optimistic (added).

**▸ Follow-up 6.** "Why does wire delay not scale down with technology like gate delay does?"

**Answer.** Shrinking width and thickness raises r per µm roughly as 1/(w·t). Surface and grain-boundary scattering plus barrier layers make copper resistivity worse still at small widths. c per µm stays roughly constant. A *local* wire shrinks in length too, but a *global* wire spans the die, which does not shrink, so its RC grows while gate delay falls. Hence more repeaters, more metal layers, and the upper-metal "fat wire" strategy.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "wire delay is RC". The Elmore delay of a distributed line is **RC/2** (the 50% delay is about 0.38RC), and it is quadratic in length. A second trap is saying "doubling the width halves the delay": c rises too, so repeated delay improves only about √(0.65) ≈ 0.8×.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Distributed RC gives Elmore delay RC/2 ∝ L². Repeaters at l_opt = √(2R(C + C_p)/(rc)) make delay linear (49 ps/mm here), and every wire-geometry what-if scales that slope as √(rc).

</div>


## Part C — Latches, flip-flops, timing and level shifters, drilled

### C1. Static latch and TG latch: bistability and the write condition

Why they ask: every flop, ICG and SRAM bit is "two inverters in a loop plus a way in", and the write fight is the first sizing rule a standard-cell designer owns.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_tg_latch.svg: the original referenced asset was not included in the supplied source bundle. Positive TG latch: input TG on when CLK = 1, feedback TG on when CLK = 0; X is the storage node.

</div>

**Opening question.** "Draw a static latch with transmission gates and walk me through how it works."

**Answer.** A latch is a **bistable loop** (INV1 → INV2 → back) plus a gate that lets data in. With CLK = 1 the input TG is on and the feedback TG is off, so X follows D and Q follows D: the latch is **transparent**. With CLK = 0 the input TG turns off and the feedback TG turns on, closing the loop: two inverters back to back hold whatever X was at the closing edge. The value is captured at the **closing** edge (here, the falling edge of CLK). It is static because the loop restores the level actively, so it holds forever with no refresh, only leakage power.
Draw: D → TG(CLK) → X → INV1 → QB; QB → INV2 → TG(CLKB) → back to X; label which TG is on in each phase.

**▸ Follow-up 1.** "Why does a loop of two inverters store a bit? Show me graphically."

**Answer.** Plot INV1's VTC (QB vs Q) and INV2's VTC mirrored on the same axes: the **butterfly**. Where the curves cross, both inverters agree, so those are the equilibria. There are three: (0, VDD) and (VDD, 0) are **stable** because the loop gain there is ≪ 1 (each inverter sits on a flat part of its VTC, so a disturbance shrinks going round). The middle crossing at (V_M, V_M) is **metastable**: the loop gain there is |A|² ≫ 1, so any tiny disturbance grows until the loop hits a rail. Bistability needs loop gain > 1 at the middle point. The **static noise margin** is the side of the largest square that fits in a lobe of the butterfly; it is how much series noise voltage the loop can take before it flips.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_butterfly.png: the original referenced asset was not included in the supplied source bundle. Butterfly of two identical inverters (illustrative model): two stable points, one metastable point at V_M = 0.45 V, hold SNM about 378 mV.

</div>

**▸ Follow-up 2.** "Suppose the feedback is not gated, just a weak inverter always on. What is the write condition?"

**Answer.** This is the **ratioed** (jam / keeper) latch. During a write the input path and the feedback inverter are both driving X. Say X holds 1 and we write 0: INV2's PMOS has its gate at QB = 0, so it is fully on and pulling X up; the input path pulls X down. Write by KCL at X: the input path must pull X below the forward inverter's **switching threshold V_M** (with margin), and then INV1 flips QB, which turns the keeper PMOS off and the loop finishes the job. So the rule is: **the driver plus pass device must overpower the feedback device** at X = V_M. In practice the keeper is minimum width with a long L, and the writer is a normal-strength device.

**Worked numeric problem (hand, square law).** k′n = 200 µA/V², k′p = 100 µA/V², |V_t| = 0.35 V, VDD = 0.9 V. X holds 1, keeper PMOS gate at 0; we write 0 through an NMOS (gate at VDD, source at 0). Require X ≤ 0.3 V (0.15 V below V_M = 0.45 V). How strong must the writer be relative to the keeper?

Keeper: V_SD = 0.6 V > V_SG − |V_t| = 0.55 V, so it is saturated.

```latex
I_P = \tfrac{1}{2}k'_p\left(\tfrac{W}{L}\right)_p (V_{DD}-|V_t|)^2 = 50\,\mu \cdot 0.55^2 \left(\tfrac{W}{L}\right)_p = 15.1\,\mu\text{A}\cdot\left(\tfrac{W}{L}\right)_p
```

Writer: V_DS = 0.3 V < V_GS − V_t = 0.55 V, so it is linear.

```latex
I_N = k'_n\left(\tfrac{W}{L}\right)_n\left[(0.55)(0.3) - \tfrac{0.3^2}{2}\right] = 200\,\mu \cdot 0.120 \left(\tfrac{W}{L}\right)_n = 24.0\,\mu\text{A}\cdot\left(\tfrac{W}{L}\right)_n
```

```latex
I_N \ge I_P \;\Rightarrow\; \frac{(W/L)_n}{(W/L)_p} \ge \frac{15.1}{24.0} = 0.63
```

With a long-L keeper of W/L = 1/2, the writer needs W/L ≥ 0.32, which is easy. With a keeper of W/L = 2, the writer needs W/L ≥ 1.26. Writing 1 against the keeper's NMOS is the dual case, and it is harder if the pass device is NMOS-only, because the NMOS passes a weak 1 (it stops at VDD − V_t).

**▸ Follow-up 3.** "What if the feedback is too strong? Where does it fail first?"

**Answer.** X stalls above V_M, INV1 never flips, and the write fails. If it is only marginal, the write still completes but slowly, which pushes out D→Q and setup. It fails first at the corner where the **writer is weak and the keeper is strong**. For writing 0 against a PMOS keeper, that is **SF (slow NMOS, fast PMOS)**, and it gets worse at **low VDD**, because the writer's overdrive shrinks while the keeper's V_SG stays at VDD. The inverter's V_M also moves at that corner (a fast PMOS raises it), so you check the ratio against the corner's own V_M. In the model below, the keeper/TG width ratio that breaks the write falls from 2.0 at TT/0.9 V to 1.12 at SF/0.9 V and 0.90 at SF/0.7 V. A ratio that is "2× safe" at TT has almost no margin at SF and low voltage.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_write_contention.png: the original referenced asset was not included in the supplied source bundle. X during a write-0 through a TG against an always-on keeper PMOS; the write fails where X crosses the forward inverter's V_M (illustrative model).

</div>

**▸ Follow-up 4.** "What if instead you clock the feedback inverter (C²MOS style) or use the feedback TG like in your drawing?"

**Answer.** Then there is **no contention**: the feedback is cut off, or tri-stated, during the transparent phase, so the writer only has to charge X's capacitance. Sizing is no longer a ratio, the write is robust at every corner and at low VDD, and the cell is faster. The costs are extra transistors (a clocked inverter adds 2 stacked devices), **more clock-pin load** (more gates toggling every cycle means more clock power, which dominates flop power), and a stacked, slower feedback inverter. There is also a brief floating window: around the edge where both the input path and the feedback are off, X is dynamic for a few ps, so clock overlap and skew between CLK and CLKB matter. That leads into C2. Standard-cell flops usually use clocked or TG-gated feedback for this reason; ratioed keepers show up in register files and SRAM-like structures where clock load matters most.

**▸ Follow-up 5.** "Why is the latch transparent but a flop is not? And why do we care about the closing edge?"

**Answer.** A latch passes D to Q for the whole active phase, so a fast path can race through two latches in the same phase. Its timing reference is the **closing edge**: setup and hold are measured there, because the bit must have got into the loop and set it past V_M before the input TG shuts. A flop is two latches in opposite phases (C2), so at no instant is there a transparent path from D to Q, which gives edge-triggered behavior. Latch-based design can use **time borrowing** (data arriving late in the transparent phase just passes through), but it makes hold checks and the timing graph more complex.

**▸ Follow-up 6 (first principles).** "Why must the loop gain at V_M exceed 1? What happens at very low VDD?"

**Answer.** Near the metastable point, a small deviation v goes round the loop and comes back as A²·v. If A² > 1 it grows, and the two outer points are the only stable states. If A² < 1 (both VTCs too shallow), the middle point becomes stable and the butterfly collapses to a single crossing, so the cell stores nothing. At very low VDD the inverter's gain falls, because when VDD is only a few thermal voltages the devices cannot stay saturated (subthreshold drain current depends on V_DS through 1 − e^{−V_DS/U_T}). Variation also skews the two VTCs, so the **SNM shrinks** and a mismatched pair can lose one lobe. That sets the **data-retention voltage** of latches and SRAM.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "make the feedback inverter weak" without stating against what and at which corner. The write condition is a KCL ratio evaluated at X = V_M, at the corner with a slow writer and fast keeper (SF for a write-0 against a PMOS) and at minimum VDD. A ratio that works at TT can fail there.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A latch is a gain > 1 loop with three equilibria; a write must push the storage node past V_M against the feedback, so either size the writer to win at the worst skewed corner or gate the feedback so there is no fight.

</div>

### C2. Master–slave TG flip-flop: phases, internal setup and hold, clock overlap

Why they ask: this is the standard-cell DFF. They want to hear where setup and hold physically come from inside the cell, and what breaks when the two clock phases are not ideal.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_msff.svg: the original referenced asset was not included in the supplied source bundle. Positive-edge TG master–slave flop: master open when CLK = 0, slave open when CLK = 1.

</div>

**Opening question.** "Draw a positive-edge-triggered master–slave flop and explain the phases."

**Answer.** Two latches in opposite phases. **CLK low**: the master input TG is on, so the master tracks D (master node = D̄), while the slave input TG is off and the slave loop holds the old Q. **CLK rises**: the master input TG closes and the master loop locks the value it had; the slave TG opens and passes the locked value to Q. **CLK high**: D can do anything, because the master is closed. So Q updates only at the rising edge. Each TG needs CLK and CLKB, which are generated by a local clock inverter (or two) inside the cell.
Draw: D → TG(open on CLK = 0) → INV → TG(open on CLK = 1) → INV → Q, each with a gated feedback inverter; mark the local CLK → CLKB inverter.

**▸ Follow-up 1.** "Where does the setup time come from inside this cell?"

**Answer.** At the rising edge the master must already hold the new value **strongly enough that its loop regenerates the right way** when the input TG shuts. That needs D to have propagated through the input TG and the master's forward inverter, and the feedback node to have followed, before the TG closes. So setup ≈ delay D → master storage node (TG + INV1 + feedback node) minus the delay from CLK to the moment the master TG actually turns off (through the local clock inverter). If the clock path inside the cell is slow, setup shrinks. Data arriving just in time leaves the master near V_M, so it regenerates slowly, which is the clk→Q **pushout** (C3, C5).

**▸ Follow-up 2.** "And hold?"

**Answer.** After the rising edge, the master input TG does not shut instantly. CLKB is created by an inverter, so the TG's NMOS (gate = CLKB) stays on until CLKB falls one inverter delay later, and the TG is fully off only after both gates have crossed their thresholds. If D changes inside that window, the new value leaks into the master and corrupts the captured bit. So hold ≈ (CLK → TG fully off) − (D → master node delay). If the internal data path is slower than the internal clock path, **hold is negative**: D can change slightly before the clock edge and still be safe. Many library flops have small or negative hold for this reason.

**▸ Follow-up 3 (what if).** "What if CLK and CLKB are skewed, so CLKB arrives late?"

**Answer.** Then there are **overlap** windows where both latches are partly transparent. At the rising edge CLK = 1 while CLKB is still 1 (a **1-1 overlap**): the master NMOS (gate CLKB) and the slave NMOS (gate CLK) are both on, so a D that changes just after the edge can **race through** both latches to Q in the same cycle. That is a hold failure inside the cell. At the falling edge CLK = 0 while CLKB is still 0 (a **0-0 overlap**): both PMOS devices are on, so again there is a transparent path. Condition for safety: the D → Q path delay through both latches must exceed the overlap time, i.e. internal hold ≥ t_overlap − t_D→Q,internal. Fixes: generate CLKB locally with a short, well-sized inverter so the overlap is a few ps; use **clocked inverters** or **non-overlapping clocks** in custom designs; or make the flop's internal path slower (adds setup). CLK slew matters too: a slow edge widens the region where both devices conduct.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_overlap_race.png: the original referenced asset was not included in the supplied source bundle. CLKB late by 14 ps: during the 1-1 overlap both TGs conduct and a D change just after the edge races to Q.

</div>

**▸ Follow-up 4 (what if).** "What if you remove the slave's feedback to save area and clock load, making it a dynamic flop?"

**Answer.** While CLK is low, the slave TG is off and the slave input node is **floating**: it keeps its value only as charge on the node capacitance. Leakage (subthreshold through the off TG, junction leakage, gate leakage) drains it. If the clock stops or runs slowly, the node droops past the next inverter's threshold and Q flips (or the next inverter burns crowbar current while the node is near V_M). So a dynamic flop has a **minimum clock frequency**, it is unsafe for clock gating, scan shift at low speed, or test with a stopped clock, and it is noise-sensitive (coupling onto a floating node). Standard-cell libraries keep it static for this reason.

**Worked numeric problem.** Slave node C = 1 fF, stored 1 at 0.9 V. Fail when it droops to 0.6 V (keep noise margin). The leakage at the start, from the model: 33 pA at 25 °C and 2.5 nA at 105 °C. Estimate the minimum clock frequency.

```latex
t_{hold} \approx \frac{C\,\Delta V}{I_{leak}} = \frac{1\,\text{fF}\cdot 0.3\,\text{V}}{33\,\text{pA}} = 9.1\,\mu\text{s}\;(25^\circ\text{C}),\qquad \frac{0.3\,\text{fC}}{2.54\,\text{nA}} = 118\,\text{ns}\;(105^\circ\text{C})
```

The node floats for half a period (CLK low), so f_min = 1/(2·t_hold). The transient model gives slightly longer times (14 µs and 177 ns), because leakage falls as V_DS shrinks. That gives f_min ≈ 36 kHz at 25 °C and **≈ 2.8 MHz hot**. Hot leakage is about 80× larger, so the hot corner sets the spec.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_dynamic_droop.png: the original referenced asset was not included in the supplied source bundle. Floating 1-fF node leaking through an off TG; hot leakage cuts the safe floating time from about 14 µs to about 177 ns (illustrative model).

</div>

**▸ Follow-up 5.** "What sets clk→Q of this flop?"

**Answer.** It is the delay from CLK, through the local clock inverter (to get CLKB), to the slave TG opening, then through the slave TG and the output inverter(s) driving the load. If the master was only marginally set (late data), add the regeneration time of the master loop. In the .lib it is a table versus CLK input slew and output load. Sizing the output inverter trades clk→Q against clock-pin and D-pin capacitance.

**▸ Follow-up 6.** "Why do most library flops buffer CLK inside instead of taking CLK and CLKB from outside?"

**Answer.** Local generation keeps CLK–CLKB skew tiny and fixed (one inverter, characterized with the cell), it presents a **single small clock pin load** to the clock tree, and it makes the internal setup and hold independent of how the tree was routed. The cost is that the internal inverter adds to clk→Q and burns power every cycle even when D is idle, which is why flop clock power is a big share of chip dynamic power and why clock gating (C6) matters.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying "setup and hold are properties of the data path." They are properties of the cell's internal race: data path to the storage node versus clock path to the TG actually turning off. That is why hold can be negative, and why CLK/CLKB overlap is a hold problem inside the flop.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A master–slave flop is two opposite-phase latches; setup is "data must reach and set the master before it shuts", hold is "data must not leak in before it is fully shut", and clock overlap is the window where both are open.

</div>

### C3. Setup/hold characterization: the clk→Q pushout curve

Why they ask: a library team owns these numbers. They want the curve, the pass criterion, the search algorithm, and how slews change the result.

**Opening question.** "How do you characterize the setup time of a flop?"

**Answer.** Sweep the data edge toward the clock edge and watch clk→Q. Far from the edge, clk→Q is **flat** (t_cq0). As data gets closer, the master is only partly set when it closes, its regeneration starts from a smaller imbalance, and clk→Q **rises**, roughly logarithmically. Closer still, the **wrong value is captured** (or Q never transitions). Setup time is defined as the data-to-clock offset where clk→Q has **pushed out by a fixed criterion, typically 5–10 %** of t_cq0, not the hard failure point. Hold is the same sweep with the data changing after the edge. You find each point by bisection in SPICE, per (data slew, clock slew) pair, per arc (rise/fall), per corner.
Draw: x-axis = setup offset, y-axis = clk→Q; flat, then a knee rising, then a vertical asymptote/fail region; a dashed line at 1.1·t_cq0; mark where they cross.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_setup_hold_curve.png: the original referenced asset was not included in the supplied source bundle. Behavioral flop model: clk→Q vs data offset with a 10 % pushout criterion for nominal, slow data slew and slow clock slew (illustrative model).

</div>

**▸ Follow-up 1.** "Why use a pushout criterion and not the point where it fails?"

**Answer.** Near the failure point clk→Q goes to infinity (it is the metastable point), so the "fail" offset is not a usable number, and operating near it means clk→Q is huge and variable. Static timing assumes **clk→Q = the table value** whenever setup is met, so setup must be defined at a point where clk→Q is still close to nominal. The 5–10 % criterion couples the two: meeting setup guarantees the clk→Q that STA uses. Some flows instead use an **interdependent setup/clk→Q** optimization (trading a little extra clk→Q for less setup), but the principle is the same.

**▸ Follow-up 2.** "Walk me through the bisection procedure."

**Answer.**
1. Measure t_cq0 with data far from the edge (e.g. 1 ns before). Target = 1.1·t_cq0.
2. Bracket: lo = offset that is known to fail or exceed the target (e.g. −20 ps), hi = known pass (e.g. +80 ps).
3. Run at mid = (lo + hi)/2. If clk→Q > target or Q is wrong, set lo = mid; else set hi = mid.
4. Stop when hi − lo < resolution (e.g. 0.05–0.5 ps). Report hi (the safe side).

Each iteration halves the bracket, so a 100-ps bracket at 0.05-ps resolution takes log₂(100/0.05) ≈ 11 runs. My model converged in exactly 11. Watch the pass/fail definition: also check that Q reaches the **correct** value and settles, not only the delay. A glitch that recovers can look like a pass. Repeat for each slew pair, each arc, and each corner, which is why characterization farms run millions of SPICE jobs.

**Worked numeric problem (behavioral model).** Master node X is driven by D through an input stage of delay d_in = 20 ps, then an RC with τ_RC = 12 ps. The master closes δ = 12 ps after the clock edge. Regeneration: clk→Q = t_cq0 + τ_reg·ln((V_DD/2)/ΔV₀), with t_cq0 = 45 ps, τ_reg = 8 ps, ΔV₀ = X(δ) − V_DD/2, V_DD = 0.9 V. Find setup and hold at 10 % pushout (step input).

10 % pushout means 4.5 ps extra:

```latex
\Delta V_0 = 0.45\,e^{-4.5/8} = 0.256\,\text{V} \;\Rightarrow\; X(\delta) = 0.706\,\text{V} = 0.785\,V_{DD}
```

Setup (D rises): X = V_DD(1 − e^{−t/τ_RC}) = 0.785·V_DD needs t = 12·ln(1/0.215) = 18.4 ps of settling before closure:

```latex
t_{su} = t + d_{in} - \delta = 18.4 + 20 - 12 = 26.4\,\text{ps}
```

Hold (D falls after the edge): X = V_DD·e^{−y/τ_RC} ≥ 0.785·V_DD allows y = 12·ln(1/0.785) = 2.9 ps of decay before closure:

```latex
t_{h} = \delta - d_{in} - y = 12 - 20 - 2.9 = -10.9\,\text{ps}
```

With a 10-ps ramp instead of a step, the simulation gives 27.0 ps and −10.8 ps. Hard failure (X(δ) = V_DD/2) is at 16.3 ps and −16.3 ps. Note that **setup + hold ≈ 16 ps** is the width of the sampling window; d_in − δ only slides the window.

**▸ Follow-up 3.** "Explain negative hold time. Is it a bug?"

**Answer.** No. Hold is negative when the cell's **internal data path (d_in) is slower than its internal clock path (δ)**. In the example, D needs 20 ps to reach the master node but the master shuts 12 ps after the edge, so D can change up to about 11 ps **before** the clock edge and the new value still arrives too late to disturb the captured one. Setup gets correspondingly larger: the window just slides later. Negative hold is helpful in STA (hold is easier to meet with short paths and clock skew), and designers sometimes add input delay deliberately for that, paying setup.

**▸ Follow-up 4 (what if).** "What if the input data slew is larger?"

**Answer.** The data reaches the storage node later and less sharply. The input stage's delay grows with input slew, and a slow ramp crosses the internal threshold later relative to its own 50 % point. So **setup increases**. In my model, a 60-ps data slew instead of 10 ps pushes setup from 27 to 54 ps. Hold moves much less here (−10.8 to −9.8 ps), because the later arrival inside is partly offset by the ramp starting earlier. In real cells hold often decreases with data slew, but the direction is cell-specific (added). That is exactly why it is characterized rather than guessed. The window (setup + hold) also widens, from 16 to 44 ps, because a slow edge spends longer in the ambiguous region.

**▸ Follow-up 5 (what if).** "What if the clock slew is larger?"

**Answer.** The internal clock buffer and the TG turn-off happen later relative to the clock pin's 50 % point (and the TG spends longer half-on). The closure point δ moves later, so data gets more time: **setup decreases and hold increases**. In the model, a 60-ps clock slew gives setup 27 → 14.5 ps and hold −10.8 → +1.7 ps. The window stays about 16 ps; it just slides. This is why a degraded clock slew at a flop (weak clock buffer, long route) can create **hold** violations that STA catches only if the hold table is indexed by clock slew. It is also why clock trees have tight max-transition limits.

**▸ Follow-up 6.** "How does this end up in the .lib?"

**Answer.** As constraint arcs on the D pin, related to CLK: `timing_type : setup_rising` and `hold_rising`, with `rise_constraint` (for D rising) and `fall_constraint` (for D falling) tables. Each is a 2-D lookup on a `lu_table_template`, typically **index_1 = related_pin_transition (clock slew)** and **index_2 = constrained_pin_transition (data slew)**, e.g. 5×5 or 7×7 points, one table per PVT corner. The STA tool interpolates using the actual slews at the pins. The clk→Q tables (index: CLK slew × output load) are characterized consistently with the same pushout criterion. For advanced nodes, statistical/LVF variants add σ tables for setup and hold so OCV can be applied per arc.

```
pin(D) { timing() { related_pin : "CLK"; timing_type : setup_rising;
  rise_constraint(setup_tmpl) { index_1("0.01,0.05,0.2"); index_2("0.01,0.05,0.2"); values("...") }
  fall_constraint(setup_tmpl) { ... } } }
```

**▸ Follow-up 7.** "Setup and hold are characterized independently. Is that a problem?"

**Answer.** They interact: a data pulse that just meets setup at the leading edge and just meets hold at the trailing edge may fail when both are tight together, because the master gets less total drive. Characterizing each with the other side relaxed can be optimistic. Flows handle it with margin, with a minimum-pulse-width check on D, or with interdependent characterization. Also, clk→Q at the setup point is already 10 % slower, which STA must use consistently. Either use the pushed-out clk→Q or define setup tightly enough that the difference is covered by margin.

<div class="co co-guard"><p class="co-t">Trap</p>

Defining setup as "the point where the flop fails". At that point clk→Q is unbounded. Setup is defined at a small clk→Q pushout (5–10 %), so the clk→Q that STA assumes stays valid whenever setup is met.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Characterize by bisecting the data offset to the 5–10 % clk→Q pushout point, per slew pair, arc and corner; setup + hold is the sampling window, and internal clock versus data delay only slides it, which is why hold can be negative and clock slew trades setup for hold.

</div>

### C4. Timing budget: setup, hold, skew and jitter with numbers

Why they ask: they want to see you write both inequalities without hesitation, sign skew correctly, and know that only setup depends on frequency.

**Opening question.** "Write the setup and hold constraints for a flop-to-flop path including clock skew and jitter."

**Answer.** Let skew = t_clk,capture − t_clk,launch (positive means the capture clock arrives later). Setup (the **max** path must arrive before the **next** capture edge):

```latex
t_{cq,max} + t_{pd,max} + t_{su} \;\le\; T + t_{skew} - t_{jitter}
```

Hold (the **min** path launched by an edge must not disturb the data captured by the **same** edge at the receiver):

```latex
t_{cq,min} + t_{pd,min} \;\ge\; t_{h} + t_{skew} + t_{unc,hold}
```

Positive skew helps setup and hurts hold. Cycle-to-cycle jitter enters setup because the launch and capture edges are different edges. For hold the same edge is involved, so jitter mostly cancels; only a small uncertainty term remains.
Draw: launch CLK, capture CLK shifted by skew, the D2 window from min to max arrival, the setup window before the next capture edge, the hold window after the same capture edge.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_timing_budget.png: the original referenced asset was not included in the supplied source bundle. Worked example 1: max arrival at 840 ps leaves 100 ps setup slack; the min arrival at 65 ps falls inside the 55-ps-wide hold window after the skewed capture edge.

</div>

**▸ Follow-up 1.** "Do worked example 1."

**Answer.** **Given:** T = 1000 ps (1 GHz), t_cq = 60 ps max / 45 ps min, t_pd = 780 ps max / 5 ps min, t_su = 40 ps, t_h = 15 ps, skew = +30 ps, jitter (setup) = 50 ps, hold uncertainty = 10 ps.

```latex
\text{setup slack} = (1000 + 30 - 50) - (60 + 780 + 40) = 980 - 880 = +100\,\text{ps}
```

```latex
\text{hold slack} = (45 + 5) - (15 + 30 + 10) = 50 - 55 = -5\,\text{ps}\;\;\text{(violation)}
```

Max frequency from setup: T_min = 60 + 780 + 40 − 30 + 50 = 900 ps, so f_max = 1.11 GHz.

**▸ Follow-up 2 (what if).** "The chip fails. Just slow the clock to 800 MHz?"

**Answer.** That fixes only setup. At T = 1250 ps the setup slack becomes 1250 + 30 − 50 − 880 = **+350 ps**, but the hold inequality has **no T in it**: hold slack is still **−5 ps** at any frequency. A hold violation is a functional failure that no clock frequency fixes (only a different skew, or more delay on the short path). That is why hold is signed off at the fast corner (min delays, FF/hot or cold) and must be clean before tapeout.

**▸ Follow-up 3.** "How do you fix the −5 ps hold?"

**Answer.** Options, in rough order of preference:
1. **Insert delay on the short path only**: a hold buffer or delay cell (e.g. +20 ps gives slack +15) near the capture flop, where it does not sit on any long path. If it is on a segment shared with the 780-ps path, setup slack drops from 100 to 80 ps, which is still fine.
2. **Reduce the positive skew**: rebalance the clock tree so the capture clock is not 30 ps late (that trades setup slack).
3. Use a flop with **smaller or negative hold** or slower clk→Q min (a library choice).
4. Upsizing logic does not help; that makes the min path faster.

Never fix hold by slowing the clock.

**▸ Follow-up 4 (what if).** "Same path, but the skew is −30 ps (capture clock early)."

**Answer.**

```latex
\text{setup} = 1000 - 30 - 50 - 880 = +40\,\text{ps},\qquad \text{hold} = 50 - (15 - 30 + 10) = +55\,\text{ps}
```

Negative skew eats setup and gives hold. So "skew is bad" is wrong as a blanket statement: skew moves slack between setup and hold. **Useful skew** deliberately delays capture clocks on critical paths.

**▸ Follow-up 5.** "Do a second example: 2 GHz, capture clock early."

**Answer.** **Given:** T = 500 ps, t_cq = 50, t_pd max/min = 400/20, t_su = 35, t_h = 20, skew = −40, jitter = 30, hold unc = 5.

```latex
\text{setup} = 500 - 40 - 30 - (50+400+35) = 430 - 485 = -55\,\text{ps}
```

```latex
\text{hold} = (50+20) - (20 - 40 + 5) = 70 + 15 = +85\,\text{ps}
```

Setup fails, with plenty of hold slack. Fix with **useful skew**: delay the capture clock so skew = +40. Then setup = 500 + 40 − 30 − 485 = **+25 ps** and hold = 70 − (20 + 40 + 5) = **+5 ps**. Both pass, but hold is now thin, and the next stage's launch is also delayed (its own setup must be rechecked: skew borrowed here is paid back downstream).

**▸ Follow-up 6.** "Negative hold time in the library: plug it in."

**Answer.** Same as example 1 but with t_h = −10 ps: hold slack = 50 − (−10 + 30 + 10) = **+20 ps**. The violation disappears without a buffer. This is why cell designers care about the flop's internal clock-versus-data delay (C3).

**▸ Follow-up 7 (first principles).** "Why does jitter cancel for hold but not for setup? And where does duty cycle enter?"

**Answer.** Hold compares a launch and a capture caused by **the same source edge**: if the PLL edge comes 10 ps early, both flops see it early (apart from the small part of jitter that accumulates differently along the two tree branches, which is why an uncertainty term remains). Setup compares edge n (launch) to edge n + 1 (capture), so **period jitter** directly shortens the available time. Duty cycle enters for **half-cycle paths**: a positive-edge to negative-edge path gets only T_high (minus duty-cycle distortion), and so do latch-based designs and ICG enables in some styles (C6).

<div class="co co-guard"><p class="co-t">Trap</p>

"We'll fix the hold violation by lowering the frequency." Hold has no T term: it is a race between paths launched by the same edge, so frequency does not help, and the silicon fails at every speed.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Setup: max path + t_su ≤ T + skew − jitter. Hold: min path ≥ t_h + skew + uncertainty, with no T term. Positive skew trades hold slack for setup slack, and hold is fixed with delay on the short path, never with the clock.

</div>

### C5. Metastability: regeneration, clk→Q blow-up, MTBF

Why they ask: it connects the latch's small-signal loop gain (C1) to a system reliability number, and it tests whether you know characterization cannot remove it.

**Opening question.** "What is metastability and why can't a flop resolve instantly?"

**Answer.** If data changes inside the flop's sampling window, the master loop is left near its **metastable point** (V_M, V_M) when it closes, with a small imbalance ΔV₀. Around that point the cross-coupled pair is a positive-feedback amplifier. Linearize with g_m and node capacitance C:

```latex
C\frac{d\Delta V}{dt} = (g_m - g_{ds})\,\Delta V \;\Rightarrow\; \Delta V(t) = \Delta V_0\, e^{t/\tau},\quad \tau \approx \frac{C}{g_m}
```

The time to resolve to a valid level V_s is t_res = τ·ln(V_s/ΔV₀). It is **logarithmic in ΔV₀** and unbounded as ΔV₀ → 0. Since ΔV₀ is proportional to how close the data arrived to the exact balance point, clk→Q grows by τ·ln10 per decade of closeness.
Draw: exponential curves of ΔV vs t for decreasing ΔV₀, each reaching the rail later by a fixed step per decade.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_metastability.png: the original referenced asset was not included in the supplied source bundle. Left: regeneration from smaller initial imbalances takes linearly longer per decade (τ = 15 ps). Right: clk→Q vs distance from the metastable point; each decade closer adds τ·ln10 ≈ 35 ps (illustrative model).

</div>

**▸ Follow-up 1.** "Put numbers on that."

**Answer.** With τ = 15 ps and resolving to V_s = 0.45 V:
- ΔV₀ = 0.1 V gives 15·ln 4.5 = 23 ps
- ΔV₀ = 1 mV gives 92 ps
- ΔV₀ = 10 µV gives 161 ps
- ΔV₀ = 10 nV gives 264 ps

Each decade adds 15·ln10 = 34.5 ps. If the node slews at about 0.03 V/ps through the aperture, data 0.1 ps from the balance point leaves ΔV₀ = 3 mV and clk→Q ≈ 45 + 75 = 120 ps. At 10⁻⁵ ps it is 258 ps. There is no offset at which clk→Q is infinite with certainty, but there is also no bound.

**▸ Follow-up 2.** "Give me the MTBF formula and do a two-flop synchronizer."

**Answer.** The probability that an asynchronous data edge lands in the effective window is T₀·f_data per clock, and the probability that it is still unresolved after t_r is e^{−t_r/τ}:

```latex
\text{MTBF} = \frac{e^{t_r/\tau}}{T_0\, f_{clk}\, f_{data}}
```

**Given:** τ = 15 ps, T₀ = 20 ps, f_clk = 1 GHz, f_data = 100 MHz. In a **two-flop synchronizer**, the first flop gets almost a full cycle to resolve before the second samples it: t_r = T − t_cq − t_su = 1000 − 60 − 40 = 900 ps.

```latex
\text{MTBF} = \frac{e^{900/15}}{20\,\text{ps}\cdot 10^9\cdot 10^8} = \frac{e^{60}}{2\times 10^{6}} = \frac{1.14\times 10^{26}}{2\times 10^6} = 5.7\times 10^{19}\,\text{s} \approx 1.8\times 10^{12}\,\text{years}
```

With only a single flop feeding logic, with 100 ps left over: e^{6.67}/2×10⁶ = 786/2×10⁶ = **0.39 ms**. It fails thousands of times per second.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_mtbf.png: the original referenced asset was not included in the supplied source bundle. MTBF grows exponentially with resolution time; doubling τ halves the exponent and turns 10¹² years into about 62 days.

</div>

**▸ Follow-up 3 (what if).** "What if τ doubles to 30 ps, for example at low VDD or the cold-slow corner?"

**Answer.** The exponent halves: e^{30}/2×10⁶ = 1.07×10¹³/2×10⁶ = **5.3×10⁶ s ≈ 62 days**. From 10¹² years to two months. τ = C/g_m degrades badly at low VDD (g_m collapses near threshold), so **synchronizers must be signed off at the slowest τ corner**, often low-V and SS. Fix: a third flop. With t_r = 1800 ps at τ = 30 ps, MTBF is back to e^{60}/2×10⁶ = 1.8×10¹² years. Or use a flop designed for small τ (high g_m/C in the master loop, minimal extra load on the storage nodes).

**▸ Follow-up 4 (what if).** "What if the clock doubles to 2 GHz?"

**Answer.** The penalty is twofold: t_r shrinks to 500 − 100 = 400 ps, and f_clk doubles in the denominator. e^{26.7}/(20 ps·2×10⁹·10⁸) = 3.8×10¹¹/4×10⁶ = **9.5×10⁴ s ≈ 26 hours**. The exponent dominates: losing 500 ps of resolution time cost 33 e-folds; the factor 2 in f_clk is negligible by comparison. For 10-year MTBF at these rates you need t_r ≥ τ·ln(10 yr·T₀·f_clk·f_data) ≈ 511 ps at τ = 15 ps, or 1022 ps at τ = 30 ps.

**▸ Follow-up 5.** "Can't we just characterize setup and hold conservatively and guarantee it never happens?"

**Answer.** No. Setup/hold characterization guarantees behavior **only when the data meets the window**. A synchronous path in STA does. An **asynchronous** input has no fixed phase relationship to the clock, so its edges land uniformly over the period, and a fraction T₀/T of them land in the window no matter how the window is defined. Making setup/hold larger just moves where you draw the line; the physics (a continuous input mapped to a binary output in finite time) guarantees that some inputs resolve arbitrarily slowly. You can only make failure **improbable** (more t_r, smaller τ), and you handle it architecturally: synchronizers on single bits, gray-coded pointers or handshakes for buses, and async FIFOs.

**▸ Follow-up 6.** "What is T₀ physically, and how do you measure τ?"

**Answer.** T₀ is the effective width of the window in which an input causes a slow resolution, normalized so that the formula fits. It is about the aperture width scaled by the ratio of the regeneration time constant to the input slope. You get both τ and T₀ by SPICE: sweep the data offset very finely around the balance point (bisection down to fs or below), record clk→Q versus log|Δt|, and fit. The slope of clk→Q vs ln|Δt| is τ, and the intercept gives T₀. τ is about 1–2 FO4-like inverter time constants of the loop, so anything that loads the storage nodes (big output inverter, scan mux, extra keeper) increases τ.

<div class="co co-guard"><p class="co-t">Trap</p>

"A two-flop synchronizer eliminates metastability." It makes the probability astronomically small for a given τ, t_r and data rate. MTBF is exponential in t_r/τ, so a slow corner (τ doubles) or a faster clock can turn 10¹² years into days.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A near-balanced latch regenerates as e^{t/τ}, so clk→Q grows by τ·ln10 per decade of closeness and is unbounded; MTBF = e^{t_r/τ}/(T₀·f_clk·f_data) is managed with resolution time and small τ, never eliminated by characterization.

</div>

### C6. Clock gating cell: latch + AND

Why they ask: the ICG is in every standard-cell library and is the main clock-power lever. They want to know why the latch is there, what its timing check is, and the active-low variant.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_icg.svg: the original referenced asset was not included in the supplied source bundle. Integrated clock gate: a negative-level latch (open when CLK = 0) feeding an AND with CLK.

</div>

**Opening question.** "Why not just AND the clock with an enable?"

**Answer.** Because EN is produced by logic clocked by the same clock, so it changes **after the rising edge, while CLK is high**. With a plain AND, an EN rise during the high phase creates a **runt pulse** on GCLK (a partial high pulse that can clock some flops and not others), and an EN fall during the high phase **truncates** a pulse. Both are glitches on a clock, which is catastrophic. The ICG puts a **latch that is transparent when CLK is low** in front of the AND. EN can only pass to the AND input while CLK = 0, when the AND output is forced low anyway, and it is frozen while CLK = 1. So GCLK is always either a full clock pulse or nothing.
Draw: EN → latch (enable = CLKB) → AND with CLK → GCLK; then the waveforms: CLK, EN changing mid-high, AND-only GCLK with a runt, latched EN changing only at the falling edge, clean GCLK.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_icg_glitch.png: the original referenced asset was not included in the supplied source bundle. EN changes twice while CLK is high: the plain AND produces a runt and a truncated pulse; the latch defers EN to the low phase, so the ICG emits one clean full pulse.

</div>

**▸ Follow-up 1.** "Why is the latch transparent when CLK is low, not high?"

**Answer.** When CLK is low the AND output is 0 regardless of its other input, so any change at that input is invisible. That is the safe time to let EN through. When CLK goes high, the AND passes CLK, so its other input must be **stable for the whole high phase**: the latch must be closed. A latch transparent when CLK is high would pass EN changes straight into the AND during the high phase, which is the glitch we wanted to remove. Put the other way: the latch's **closing edge is the rising edge of CLK**, which is exactly when GCLK starts its pulse.

**▸ Follow-up 2.** "So what are the setup and hold of EN on an ICG?"

**Answer.** EN must be stable before the latch closes, at the **rising edge** of CLK: that is the **setup check** (clock-gating setup), referenced to the rising edge. It must not change until the latch is fully closed after that edge: the **hold check**, also at the rising edge. Because EN usually comes from flops clocked by the previous rising edge, the setup path gets a full cycle. There is a catch, though: the ICG sits **upstream** in the clock tree, so its clock arrives earlier than the leaf clocks that launch EN.

**Worked numeric problem.** T = 1000 ps. The ICG is 150 ps of insertion delay above the leaf flops (so a leaf flop's clock arrives 150 ps after the ICG's clock). EN path: t_cq = 60 ps, logic = 650 ps, ICG setup = 50 ps. Slack?

```latex
\text{slack} = T - t_{insertion} - t_{cq} - t_{logic} - t_{su,ICG} = 1000 - 150 - 60 - 650 - 50 = +90\,\text{ps}
```

The 150 ps of tree below the ICG comes straight out of the enable path's budget. This is why enable paths to high-level ICGs are often critical, and why tools clone ICGs closer to the leaves.

**▸ Follow-up 3.** "Why does it have to be one cell instead of a latch and an AND from the library?"

**Answer.** The latch output to AND input path and the CLK-to-latch versus CLK-to-AND relationship are an **internal race**. The latch must close before the AND's CLK input rises enough to pass a pulse, and the latch output must not glitch at its opening (falling) edge while the AND's CLK input is still not fully low. As a single characterized cell, the internal skew is fixed and verified, and the .lib describes it as a clock-gating cell (`clock_gating_integrated_cell : "latch_posedge"`) with clock-gating setup/hold arcs. A place-and-route tool could separate a discrete latch and AND, routing different delays to them, and break the guarantee. ICGs usually also include a **test enable** (EN OR TE) so scan can force the clock on.

**▸ Follow-up 4 (what if).** "What if the downstream flops are negative-edge triggered, or the clock idles high? Show the OR-based gate."

**Answer.** For a clock whose **active edge is falling** (or which must idle high), use an **OR** gate: GCLK = CLK + EN̄_latched. When disabled, GCLK is held **high**. The latch is now transparent while **CLK is high** (when the OR output is forced to 1, so changes are invisible) and closes at the **falling edge**. Setup and hold of EN are then referenced to the falling edge. The rule is symmetric: the latch is open during the phase in which the gate's output is forced to its idle value, and closes at the edge that starts an active pulse.

**▸ Follow-up 5 (what if).** "What if you use a flop instead of a latch to sample EN?"

**Answer.** A positive-edge flop would update EN_q right after the rising edge, while CLK is high, which recreates the glitch at the AND. A negative-edge flop works functionally (EN_q changes only at the falling edge, in the low phase), but the enable gets only the time until the falling edge, which is half a cycle. The latch is better: it is transparent through the whole low phase, so EN can arrive anytime up to the rising edge (**time borrowing**), giving a full-cycle budget with fewer transistors.

**▸ Follow-up 6.** "How much power does clock gating save, and what does it cost?"

**Answer.** Clock power is P = α·C·V²·f with α = 1 for the clock (it toggles every cycle) on the tree and on every flop's clock pin. Gating a group of N flops for a fraction g of cycles removes about g of the power of that subtree (wires, buffers, flop internal clock nodes), less the ICG's own power and the always-toggling CLK pin of the ICG. Costs: the enable timing above, an extra cell delay in the clock path (more insertion delay and on-chip variation between gated and ungated branches, which hurts skew), and DFT needing the test-enable bypass. It pays off when the group is large enough and idle often enough.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying the latch "synchronizes EN". Its job is to freeze EN during the half-cycle in which the AND passes the clock (CLK high for an AND-type ICG), so the gated clock can only be a whole pulse or nothing. A latch transparent on the wrong phase, or a positive-edge flop, brings the glitch back.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

ICG = a latch open while the gate's output is forced idle, plus an AND (or OR for idle-high clocks); EN is checked for setup/hold at the edge that starts the pulse, and the ICG's early clock eats into the enable budget.

</div>

### C7. Level shifter (DCVS cross-coupled PMOS): contention, VDDL limits, corners

Why they ask: every multi-voltage chip (SRAM periphery, ROM wordlines, IO, retention) needs low-to-high shifting. It is a ratioed contention circuit like C1, and they expect you to reason from "which device is on" to a minimum-VDDL number.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_level_shifter.svg: the original referenced asset was not included in the supplied source bundle. DCVS level shifter: inputs swing 0…VDDL, cross-coupled PMOS on VDDH; N1 must overpower P1 to flip it.

</div>

**Opening question.** "Draw a low-to-high level shifter and walk through a transition step by step."

**Answer.** Two NMOS pull-downs driven by A and Ā (0…VDDL, Ā from a VDDL inverter) and two **cross-coupled PMOS** loads on VDDH. Start: A = 0, Ā = VDDL, so N2 is on and OUT (X̄) = 0, which turns P1 fully on and holds X = VDDH, keeping P2 off. Now A rises to VDDL:
1. N1 turns on with V_GS = VDDL, but P1 is still fully on (its gate is OUT = 0, V_SG = VDDH). This is **contention**: N1 must sink more current than P1 sources to pull X down.
2. Ā falls, so N2 turns off.
3. As X falls below VDDH − |V_tp|, P2 turns on and starts charging OUT.
4. As OUT rises, P1's V_SG drops and it weakens, X falls faster, and P2 gets stronger. This is **positive feedback**, and it finishes with X = 0 and OUT = VDDH.
5. Static state: one side has its NMOS on and PMOS off, so there is **no static current** and the output swings full rail to VDDH.

Draw: the schematic, then a waveform where X sags slowly during the contention phase and then snaps down as OUT rises.

**▸ Follow-up 1.** "What is the design condition? Make it quantitative."

**Answer.** Same idea as the latch write in C1: by KCL at X, N1 with V_GS = **VDDL** must out-sink P1 with V_SG = **VDDH**, around X ≈ VDDH/2 (enough for P2 to turn on and the feedback to take over). A first-order criterion:

```latex
I_{N1}(V_{GS}=V_{DDL},\,V_{DS}=V_{DDH}/2) \;>\; I_{P1}(V_{SG}=V_{DDH},\,V_{SD}=V_{DDH}/2)
```

The NMOS overdrive is VDDL − V_tn, while the PMOS overdrive is VDDH − |V_tp|, so N1 must be **much wider** than P1 (and P1 often has a long L) when VDDL ≪ VDDH. In the model (VDDH = 0.9 V, W_P = 1), I_P1 = 13.2 µA. N1 reaches that at VDDL = 0.74 V for W_N = 1, 0.62 V for 2, 0.54 V for 4 and 0.48 V for 8.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_ls_vddl.png: the original referenced asset was not included in the supplied source bundle. Left: N1 current at its gate = VDDL vs the fully-on P1 current; the crossings are the DC minimum VDDL for each NMOS width. Right: transient delay (C = 2 fF) ends where the shifter fails to flip within 5 ns, including an SF cold corner (illustrative model).

</div>

**▸ Follow-up 2 (what if).** "What happens as VDDL approaches V_t? Will a wider NMOS keep saving you?"

**Answer.** No, there are diminishing returns. Above threshold, current rises roughly quadratically or linearly with VDDL − V_t, so doubling W buys a decent VDDL step. Near and below V_t, N1 is in **subthreshold**, so its current is exponential in VDDL. Doubling W then only buys n·U_T·ln2 ≈ 1.35 × 25.9 mV × 0.693 ≈ **24 mV** of VDDL. In the transient model the minimum working VDDL is 0.70, 0.60, 0.525 and 0.475 V for W_N = 1, 2, 4, 8: each doubling buys 100, 75 and 50 mV, shrinking toward that limit. Below about V_t + 100 mV, the delay also explodes (0.9 V: 83 ps at W_N = 4; 0.525 V: over 1 ns), and wider N1 adds input capacitance on the VDDL driver. For deep low VDDL, change topology instead: a **current-limited PMOS** (a series PMOS gated by the input, or a header that weakens P1 during the transition), **Wilson current-mirror** shifters, or a two-stage shifter.

**▸ Follow-up 3 (what if).** "Which PVT corner is worst for this level shifter, and why?"

**Answer.** The corner with the **weakest N1 relative to P1**: **slow NMOS / fast PMOS (SF, NMOS letter first)**, at **cold** temperature, with **minimum VDDL and maximum VDDH**. Cold matters because V_t rises at low temperature, and at low VDDL the NMOS is near threshold, so its current is set by VDDL − V_t and drops sharply. Meanwhile the strongly-on PMOS gains from higher mobility in the cold. Maximum VDDH makes P1 stronger. In the model (SF: V_tn +50 mV and k −10 %, |V_tp| −50 mV and k +10 %; −40 °C: +50 mV on both |V_t|, +20 % mobility, U_T = 20 mV), W_N = 4 needs VDDL ≥ 0.65 V instead of 0.525 V at TT. That is 125 mV lost, purely from the corner. Naming conventions differ: your 627 exam wrote the PMOS letter first, so it called this same corner **FS**. In the interview, say the physics: slow NMOS, fast PMOS.

**▸ Follow-up 4 (what if).** "Why not just drive a VDDH inverter directly with the VDDL signal?"

**Answer.** When the input is a VDDL "1", the VDDH inverter's PMOS sees V_SG = VDDH − VDDL. If that exceeds |V_tp|, the PMOS is **on** and fights the NMOS: there is a large static crowbar current and V_OUT may not even reach a valid low. Even if VDDH − VDDL < |V_tp|, the PMOS is only in **subthreshold**, and leakage is exponential in V_SG, so static current is orders of magnitude above normal leakage. Model (VDDH = 0.9 V, W_N = 1, W_P = 2): input at 0.9 V gives 22 pA (normal leakage); at 0.7 V, 6.0 nA (270×); at 0.6 V, 78 nA (about 3500×); at 0.5 V, 0.61 µA with V_OUT = 24 mV. Below about 0.45 V the inverter does not even switch (input below its V_M). Multiply by thousands of crossings and the IDLE power is ruined. The DCVS shifter avoids this because no device ever has a partially-on gate in steady state: the PMOS gates see VDDH-domain full-swing signals.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

C_ls_static.png: the original referenced asset was not included in the supplied source bundle. Static supply current of a VDDH inverter whose input "1" is only VDDL: the PMOS is never fully off, and below about 0.45 V the output does not switch (illustrative model).

</div>

**▸ Follow-up 5.** "What about high-to-low shifting?"

**Answer.** Usually it needs **nothing**: a VDDL-domain inverter driven by a 0…VDDH signal works fine. For a "1" at VDDH, the NMOS is overdriven (stronger) and the PMOS gets V_GS = +(VDDH − VDDL), i.e. more strongly off, so there is no static current. For a "0" it is a normal inverter. The cautions: gate-oxide reliability if VDDH exceeds the VDDL devices' rating (use thick-oxide input devices), and the input threshold is set by VDDL. Libraries still often provide a high-to-low "shifter" cell, mainly as a buffer with an **isolation** function and a clean domain-crossing boundary for the power-intent (UPF) checks.

**▸ Follow-up 6.** "Draw the timing and power issues: delay asymmetry, and what if VDDL is powered off?"

**Answer.**
- **Delay is asymmetric.** OUT rising is two steps in series: N1 must first win its fight against P1 to pull X down, and only then does P2 charge OUT. OUT falling is one step: N2 pulls OUT down directly, against P2 (also a contention, but with no second stage). So the rise is usually slower, and both scale with the N/P ratio. The .lib therefore has separate rise and fall tables, and delay depends strongly on VDDL, so multi-voltage STA must use the VDDL-specific characterization.
- **Short-circuit energy.** During the contention phase N1 and P1 conduct together, so switching energy is above C·V².
- **VDDL powered off.** A and Ā float or both go low. If both float to mid-rail, both NMOS are partly on and the cross-coupled pair can sit at an undefined state with static current. If both are 0, the latch holds its last state. So level shifters that receive a switchable domain include an **enable/isolation clamp** (force a known output, cut the NMOS legs) controlled from the always-on domain. That is the "enable level shifter" cell in UPF flows.

<div class="co co-guard"><p class="co-t">Trap</p>

"Just upsize N1 until it works." Near V_t, NMOS current is exponential in VDDL, so each doubling of width buys only about n·U_T·ln2 ≈ 24 mV while the input load grows. The worst case is slow-N/fast-P at cold, minimum VDDL and maximum VDDH, and the fix there is topology (limit P1's current), not width alone.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A DCVS level shifter is a ratioed latch write across domains: N1 at VDDL overdrive must beat P1 at VDDH overdrive, which sets a minimum VDDL that rises sharply at slow-N/fast-P cold; driving a VDDH gate directly with VDDL leaks orders of magnitude more, and high-to-low needs no shifter.

</div>


## Part D — SRAM, ROM, sense amps, EM/IR and variation, drilled

### D1. 6T SRAM read: the read bump and cell ratio

Why they ask: it is the classic "which transistor fights which" problem. It checks KCL, operating regions and sizing intuition in one question.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_6t_cell.png: the original referenced asset was not included in the supplied source bundle. 6T cell during a read with Q = 0, plus the AX/PD divider that sets the read bump on Q

</div>

**Opening question.** "Walk me through a 6T SRAM read. Which node is at risk, and how do you size against it?"

**Answer.** Both bitlines are **precharged to V_DD**, then WL goes high. On the side that stores '1', BLB and QB are both at V_DD, so nothing happens there. On the side that stores **'0'**, the access NMOS (AX) connects BL (at V_DD) to Q, while the pull-down (PD, gate = QB = V_DD) holds Q at ground. The two devices form a **resistive divider**, and Q rises by a **read bump** ΔV. If ΔV gets near the **trip point of the opposite inverter**, the cell flips. That is a **destructive read** (read upset). The fix is to make PD stronger than AX. The **cell ratio** CR = (W/L)_PD / (W/L)_AX is typically about 1.5–2.5. Draw: the 6T cell, the I_read arrow from BL through AX into PD, and next to it the two-transistor divider (AX on top, PD below, Q in between).

**▸ Follow-up 1.** "Which region is each device in? Write the KCL for V_Q."

**Answer.** AX has gate = drain = V_DD and source = Q, so V_DS = V_GS. That means V_DS > V_GS − V_t and AX is **saturated** (it acts like a diode-connected device). PD has V_GS = V_DD and V_DS = V_Q, which is small, so PD is **linear**. Set I_AX = I_PD with the square law:

```latex
\frac{\beta_{AX}}{2}\,(V_{DD}-V_Q-V_t)^2=\beta_{PD}\Big[(V_{DD}-V_t)V_Q-\tfrac{V_Q^2}{2}\Big]
```

**Worked numeric problem.** Take V_DD = 0.9 V and V_t = 0.35 V.
- CR = 1: (0.55 − V)²/2 = 0.55V − V²/2, which gives V² − 1.1V + 0.15125 = 0, so **V_Q = 161 mV**.
- CR = 2: 3V² − 3.3V + 0.3025 = 0, so **V_Q = 101 mV**.

The EKV model gives **135 mV (CR = 1)** and **89 mV (CR = 2)**. The model's numbers are lower because it includes the body effect and the n factor on AX: AX's source rises, so it weakens.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_read_bump.png: the original referenced asset was not included in the supplied source bundle. Read bump vs CR from the illustrative model, with the trip point of the opposite inverter at 0.9 V and 0.6 V

</div>

**▸ Follow-up 2.** "Why compare against the trip point of the other inverter? Is that DC check enough?"

**Answer.** Q is the input of the QB inverter. If Q crosses that inverter's V_M, QB starts to fall, and positive feedback finishes the flip. In this model V_M ≈ **0.40 V**. It sits below V_DD/2 because that inverter's NMOS (W = 2) is stronger than its PMOS. So the nominal bump (89 mV) has about 310 mV of DC headroom. The DC check is **necessary but not sufficient**, for three reasons:
- The real metric is **read SNM**, which perturbs both halves at once (see D2).
- **Mismatch** moves both the bump and V_M.
- The cell has to hold at the **6σ tail cell**, not at the nominal cell.

**▸ Follow-up 3. What if CR = 1?** "Same-size PD and AX. Does the cell still work?"

**Answer.** The bump grows from 89 to **135 mV** (model). The nominal cell still holds in DC, and read SNM drops only from 216 to 193 mV in this model. But the mismatch tail is now closer: at CR = 1, a 3σ AX/PD skew gives a **183 mV** bump. With CR < 1, AX starts to win, the bump climbs toward V_M, and the read becomes destructive. The trade-off is **area vs stability**: a bigger PD makes the cell larger and adds node capacitance, so foundry cells settle near CR ≈ 1.5–2.

**▸ Follow-up 4. What if V_DD drops to 0.6 V?**

**Answer.** The absolute bump shrinks to **41 mV** at CR = 2, which looks safer. It is not, for two reasons:
- V_M falls to **0.27 V** and read SNM falls from 216 to **149 mV**.
- σ_Vt does **not** scale with V_DD.

So the margin measured in σ shrinks. This is why SRAM sets the chip's **V_min**. The cell is the first block to fail as V_DD drops, because its margin is a fixed number of mV competing against fixed mismatch.

**▸ Follow-up 5. What if there is local mismatch: PD Vt +3σ, AX Vt −3σ (σ = 25 mV)?**

**Answer.** This is the worst read skew: a weak PD and a strong AX. At CR = 2 the bump goes from 89 to **124 mV**. In the butterfly, read SNM falls from 216 to **128 mV**, and the lobes become asymmetric. The other side's V_M also moves with its own mismatch. Corners do not catch this, because a corner shifts AX and PD together while the failure depends on their **difference**. That is why bitcells are verified with local Monte Carlo at high sigma (see D7).

**▸ Follow-up 6. What if you underdrive the WL (0.8 V instead of 0.9 V)?**

**Answer.** AX gets weaker, and the bump drops from 89 to **63 mV**. This is a **read assist**. Its cost is lower I_read, so the BL develops slower and SAE has to fire later. It also hurts **write**, which needs a strong AX. Other read assists:
- lower BL precharge
- a higher cell supply than the periphery supply
- the **8T cell**, whose separate read port (two stacked NMOS) never touches the storage nodes, so read SNM ≈ hold SNM

**▸ Follow-up 7.** "Besides stability, what else does the read path set?"

**Answer.** **Read current.** AX in series with PD discharges C_BL. The **weakest** cell's current sets how long you wait before SAE (see D4). Upsizing AX speeds the read but raises the bump, and upsizing PD costs area. That is the whole 6T sizing triangle in one sentence: read stability needs PD > AX, writability needs AX > PU (see D2), and speed needs a strong AX.

<div class="co co-guard"><p class="co-t">Trap</p>

Saying the '1' node is the one at risk, or that "the bitline gets disturbed". The disturbed node is the **'0' node**, lifted by the AX/PD divider, and the failure is it crossing the **other** inverter's trip point. A second trap is quoting only the nominal bump. The design case is the 6σ mismatched cell at low V_DD.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

During a read, the '0' node sits on an AX(saturated)/PD(linear) divider. Keep PD stronger than AX (CR ≈ 1.5–2) so that the bump stays well below the opposite inverter's trip point even at the mismatch tail and V_min.

</div>

### D2. Butterfly curves, SNM, write trip and assists

Why they ask: SNM is the standard currency of bitcell robustness. They want to see you derive it graphically, then show that read and write pull the sizing in opposite directions.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_butterfly.png: the original referenced asset was not included in the supplied source bundle. Butterfly curves from the illustrative model in hold and read, with the largest inscribed squares (SNM)

</div>

**Opening question.** "Define static noise margin for an SRAM cell and draw the butterfly for hold and read."

**Answer.** Plot V_QB = f(V_Q) for one inverter, then plot the other inverter's VTC **mirrored** about y = x. The two curves form a "butterfly" with two lobes, one per stable state. **SNM** is the side of the **largest square that fits inside the smaller lobe**. It equals the largest DC noise voltage, applied in series with both inverter inputs in the worst-case polarity, that the cell survives with two stable states. In **read**, AX pulls each low output up to the read bump, which lifts the low tail of each VTC and shrinks the lobes. Model (CR = 2, V_DD = 0.9 V): **hold SNM ≈ 366 mV, read SNM ≈ 216 mV**. Draw: two S-curves, one mirrored, then a square in each lobe, with the read curves' low ends lifted.

**▸ Follow-up 1.** "Why a square, and why the smaller lobe?"

**Answer.** Noise sources that shift both inputs by the same V_n move one curve right and the other up by the same amount. The cell loses a state when the shifted curves touch, leaving only one crossing. The largest shift that keeps three crossings is the side of the largest inscribed square. A cell is only as robust as its weaker state, so take the smaller lobe. Numerically: rotate the axes by 45°, find the largest separation of the curves along the diagonal, and divide by √2. That is how the plot's squares were computed.

**▸ Follow-up 2.** "How does a write work, and what sizing condition does it need?"

**Answer.** Suppose Q = 1 and we want to write 0. Drive **BL = 0** (BLB stays at V_DD) and raise WL. AX now has to pull Q down **against the pull-up PU** (gate = QB = 0, so PU is on). Q must fall below the trip point of the QB inverter. The condition is **AX stronger than PU**, i.e. a small **pull-up ratio** PR = (W/L)_PU/(W/L)_AX. The PMOS's lower mobility helps here. Strength order: **PD > AX > PU**. In the model, with PU = AX = 1 and PD = 2, the full 2-node cell becomes monostable at **WL = 0.67 V**. The **write margin** is therefore 0.9 − 0.67 = **230 mV** of WL headroom.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_write.png: the original referenced asset was not included in the supplied source bundle. Left: write butterfly at WL = VDD, where only the written state survives. Right: WL voltage at which the cell flips vs pull-up width, with and without a negative bitline

</div>

**▸ Follow-up 3. What if the pull-up is made stronger (W_PU = 3)?**

**Answer.** The WL flip voltage rises from 0.67 to **0.835 V**, so write margin falls from 230 mV to **65 mV**. A few σ of PU-strong / AX-weak mismatch then gives **write failures**, and these fail worst at the slow-N/fast-P (**SF**) corner. Hold SNM and the '1' level improve slightly, which is why designers are tempted. The core tension: read wants a weak AX, write wants a strong AX; PU strength only helps hold and only hurts write.

**▸ Follow-up 4.** "How do you measure write margin?"

**Answer.** Three common definitions:
1. **WL sweep**: hold the BLs at write values, ramp WL, and find the WL where the cell flips. Margin = V_DD − WL_trip. This is the one plotted.
2. **BL sweep**: hold WL at V_DD and lower BL from V_DD. The BL voltage at the flip is the margin; a higher value is better.
3. **Write butterfly / write SNM**: with WL at V_DD, the old state's lobe must vanish so only one crossing remains (left panel).

All three rank cells the same way. Pick one and quote it at a σ target.

**▸ Follow-up 5. What if you add a negative-bitline assist (BL = −0.1 V)?**

**Answer.** AX's V_GS and V_DS both grow by 0.1 V, so it beats PU more easily. WL trip moves from 0.67 to **0.56 V** (margin about **340 mV**). Even with W_PU = 3 it moves from 0.835 to **0.735 V**. Costs:
- A coupling-cap boost circuit whose depth varies with BL capacitance.
- **Oxide stress**: AX sees gate–source = 0.9 − (−0.1) = 1.0 V, above nominal V_DD.
- Unselected rows on the same BL see AX with gate = 0 and source = −0.1 V, i.e. V_GS = +0.1 V, which multiplies their subthreshold leakage. This is a slow disturb risk for cells storing '1' there.

**▸ Follow-up 6.** "What's half-select, and does an 8T cell fix it?"

**Answer.** With a **column mux** (bit-interleaving, used so that one particle strike's multi-bit upset lands in different words), WL rises across the whole row while only some columns are written. The **unselected columns in the selected row** have WL high and precharged BLs, so they are doing a **read**. A write therefore still needs **read stability** on the half-selected cells, and a strong write assist on WL (overdrive) makes their read disturb worse. 8T separates the **read** port, but the write still uses the 6T access devices on a shared WL. So 8T does **not** fix write half-select. Fixes:
- read-modify-write (write the whole row back)
- no column interleaving on the write path
- column-selected WL / cross-point writes

**▸ Follow-up 7.** "Name the other write assists and their side effects."

**Answer.**
- **Cell-V_DD collapse** during write: weakens PU. It must not drop below retention voltage for the other cells on that supply.
- **WL overdrive**: makes AX stronger, but half-selected cells suffer.
- **Negative BL**: covered above.

Every write assist makes some cell weaker, which is why assists are column- or row-local and timed.

<div class="co co-guard"><p class="co-t">Trap</p>

"Upsize AX to help write." That fixes write and breaks read, because CR drops and the bump rises. Another trap is calling SNM the gap between the curves at V_DD/2. SNM is the side of the **largest inscribed square in the smaller lobe**.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Strength order PD > AX > PU: read SNM shrinks because AX lifts the '0' node, write needs AX to overpower PU, and assists (WL under/overdrive, negative BL, V_DD collapse) buy margin on one side at a cost on the other.

</div>

### D3. NOR ROM bitline: I_on vs (N−1)·I_off, keeper window

Why they ask: this is the core custom-ROM question for a standard-cell/ROM team. Every number you can derive from C·dV/dt = I, and the hot-corner leakage twist separates a memorized answer from one you can actually derive.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_rom_col.png: the original referenced asset was not included in the supplied source bundle. NOR ROM column: precharge PMOS, feedback keeper, sense inverter, and the three cell cases (selected 0, leaking unselected, unprogrammed 1)

</div>

**Opening question.** "You have a NOR ROM column with N cells on a bitline. Walk me through a read and tell me what limits N."

**Answer.**
1. **Precharge** BL to V_DD (PRE_b low), then release it.
2. Raise one WL.
3. If the selected cell **has a transistor connected** to BL (contact or via present), it discharges BL with I_on, and we read **"0"**. If not, BL should stay high, and we read **"1"**.

In the read-1 case, though, all **N−1 unselected cells** that have transistors leak I_off each. So sensing is a **race**: read-0 must develop ΔV before read-1 droop does. N is limited by **I_on / ((N−1)·I_off)** at the hot corner, and C_BL ∝ N slows read-0 at the same time. A weak **keeper** can replace the leakage, but it also fights read-0, so it must sit inside a window. Draw: the column with precharge, keeper, sense inverter, one ON cell, leaking cells, and a no-contact cell.

**Worked numeric problem.** Given N = 256, C_BL = 50 fF, I_on = 20 µA (slow cell), I_off = 2 nA at 25 °C and 60 nA hot (×30). Sense at ΔV = 100 mV.

```latex
t_{0}=\frac{C_{BL}\,\Delta V}{I_{on}}=\frac{50\,\text{fF}\cdot 0.1\,\text{V}}{20\,\mu\text{A}}=250\ \text{ps}
\qquad
\Delta V_{1}(t_0)=\frac{(N-1)I_{off}\,t_0}{C_{BL}}
```

- Worst-case read-0 assumes **no** other cell on the column leaks. Leakage would only help it, so the worst case is data-dependent: all other cells unprogrammed. That gives **250 ps** to reach 100 mV.
- Worst-case read-1 assumes all 255 others are programmed and leak.
  - **Cold:** 255 × 2 nA = 0.51 µA. Droop at 250 ps is **2.6 mV**, which is fine.
  - **Hot:** 255 × 60 nA = **15.3 µA**. Droop at 250 ps is **76.5 mV**, leaving only 23.5 mV of differential against the 100 mV read-0. Read-1 itself crosses the 100 mV sense level at **327 ps**. The column fails.
- **Keeper window:** I_on > I_keeper > (N−1)·I_off. Here the window ratio is 20/15.3 = **1.31**. A keeper of 18 µA (1.2× the leakage) leaves I_on − I_k = 2 µA for read-0, so t = 50 fF × 0.1 V / 2 µA = **2.5 ns**, ten times slower. (The plot shows about 2 ns because its keeper ramps in over the first 20 mV of droop.)
- **Hierarchical fix:** use a local BL with N = 64 and C = 15 fF. Hot leakage is 63 × 60 nA = 3.78 µA. A 5 µA keeper leaves 15 µA net for read-0, so t = 15 fF × 0.1 V / 15 µA = **100 ps**, and read-1 is held.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_rom_bl.png: the original referenced asset was not included in the supplied source bundle. BL(t) for worst-case read-0 and read-1 at cold and hot: no keeper, keeper sized for N = 256, and a 64-cell local bitline

</div>

**▸ Follow-up 1.** "Why precharge at all? Why not a static PMOS pull-up?"

**Answer.** A static pull-up (pseudo-NMOS) is **ratioed**: V_OL ≠ 0 and every '0' column burns DC current for the whole cycle. Precharge-evaluate has **no static current**, uses only the fast NMOS for evaluation, and lets you sense a **small swing** instead of waiting for full rail. Costs:
- a precharge phase in the cycle
- vulnerability to leakage droop and coupling (that is why the keeper exists)
- precharge current peaks when all BLs recharge at once (an IR/EM concern, see D6)

**▸ Follow-up 2.** "Why does I_off grow 10–30× or more from cold to hot?"

**Answer.** Subthreshold current goes as I_off ∝ exp(−V_t/(n·kT/q)). With temperature:
- **V_t drops**, by roughly 0.5–1.5 mV/K.
- kT/q rises (25.7 → 32.6 mV from 25 to 105 °C).
- DIBL adds more when V_DS = V_DD.

A simple model with dV_t/dT = −1 mV/K over 80 K gives about **80×**, so ×30 is a moderate assumption. I_on, by contrast, is roughly flat or even falls at hot because mobility drops. So the ratio I_on/I_off collapses at **hot**, which makes hot the ROM sensing corner.

**▸ Follow-up 3. What if N doubles to 512?**

**Answer.** C_BL rises to about 90 fF, so read-0 takes **450 ps**. Hot leakage is 511 × 60 nA = **30.7 µA**, which is **greater than I_on**. Read-1 now droops faster than read-0 falls (I_on/leak = 0.65). The window is **inverted**, so no keeper size works. You must split the bitline (hierarchy) or cut leakage per cell.

**▸ Follow-up 4. What if V_DD drops from 0.9 to 0.7 V?**

**Answer.** Use I_on ∝ (V_DD − V_t)^1.3 as a rough alpha-power law. I_on falls to **0.56×**, so read-0 is **1.8× slower** (450 ps). I_off falls much less, mainly through DIBL. So **I_on/I_off worsens** and the droop accumulates over a longer sensing time. Low V_DD plus hot is the ROM's worst corner, and both effects compound.

**▸ Follow-up 5.** "List the fixes."

**Answer.**
- **Hierarchical bitlines**: short local BLs of 16–64 cells and a global BL. This cuts N and C together.
- **HVT or long-L cells**: I_off drops exponentially and I_on drops only polynomially.
- **Data encoding**: store each word inverted when that leaves fewer programmed transistors, plus one polarity bit. This bounds the worst-case leakers per column.
- **Negative WL** on unselected rows, or **raising the source line** of unselected cells. Either gives a negative V_GS and less I_off.
- A **feedback keeper**: weak, long-L, gate driven by the sense-inverter output. It turns off once BL falls past the trip point, so it only fights at the start.
- **Replica/self-timed sensing** from a dummy column with worst-case cells, so SAE tracks PVT.
- **Reference-based differential sensing** (against a dummy BL at about half I_on) instead of a skewed inverter.

**▸ Follow-up 6.** "Via (contact) programming vs implant programming. What's the difference?"

**Answer.**
- **Contact/via programming:** every site has a transistor, and a "1" simply has **no drain contact or via** to the BL. Code sits on a late mask (contact or an upper via layer), so **turnaround is fast** and a code change is cheap. A side effect is that unconnected cells add **no junction cap**, so C_BL depends on the data.
- **Implant (V_t) programming:** "1" cells get a high-V_t implant so they never turn on. Every cell is identically connected, which gives a **denser** array with shared contacts. But the mask comes early, so turnaround is **long**. Every junction loads the BL. The code is also not visible in metal, so it is harder to read optically (added).
- Diffusion (active-layer) programming is a third, front-end option.

**▸ Follow-up 7.** "Why is the sense inverter skewed, and why is the keeper long-L?"

**Answer.** A **high-V_M** (skewed) inverter trips after a small droop, so read-0 is detected early. It is single-ended, though, so its V_M variation and noise eat the margin; that is why bigger arrays move to an SA with a reference. A long-L keeper is weak per unit area and has **lower σ_Vt** (larger WL, Pelgrom), so its strength sits more predictably inside the narrow window.

<div class="co co-guard"><p class="co-t">Trap</p>

Computing read-1 with just one leaking cell, or at room temperature. The worst case is **all N−1 others programmed, at hot**. The read-0 worst case is the opposite data pattern (nobody else leaks) with a slow cell. A second trap is "just add a bigger keeper": the keeper must stay below I_on, so if (N−1)·I_off ≈ I_on there is no window left.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

A NOR ROM read is a race between I_on·t/C (read-0) and (N−1)·I_off·t/C (read-1). Size N so that I_on ≫ (N−1)·I_off at hot, put the keeper inside that window, and use hierarchy, HVT/long-L cells or encoding when it closes.

</div>

### D4. Sense amplifier: offset, required ΔV and SAE timing

Why they ask: the SA links variation (σ_offset) to timing (when to fire SAE), and both come straight from first principles.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_sa_timing.png: the original referenced asset was not included in the supplied source bundle. Bitline differential vs time for a nominal and a weak cell, against the 5σ offset band and required ΔV, with the SAE window

</div>

**Opening question.** "Why do memories use a sense amplifier, and what determines when you fire it?"

**Answer.** C_BL is large (tens of fF) and the cell current is small (tens of µA). Full swing would take ns. A **latch-type SA** (cross-coupled inverters, enabled by SAE through a tail NMOS) amplifies a small ΔV of about **50–150 mV** to full rail through **positive feedback**. Fire SAE when the **weakest cell's** ΔV = I_cell·t/C_BL exceeds the **SA offset at kσ** plus noise and coupling margin. Draw: the cross-coupled latch with an input pair on BL/BLB (or BL-connected latch with isolation PMOS), the tail device on SAE, and ΔV(t) ramps against an offset band.

**Worked numeric problem.**
- **Offset:** A_VT = 1.5 mV·µm and an input pair of W/L = 0.4/0.06 µm give σ_Vt = 1.5/√0.024 = **9.7 mV** per device. The pair offset is √2 × 9.7 = **13.7 mV**. Adding latch and load contributions, take **σ_off = 15 mV**.
- **Sigma target:** with 10⁴–10⁵ SAs per chip at 99.9 % yield, the per-SA probability is 10⁻⁷–10⁻⁸, which is **5.2–5.6σ**. Use 5σ = **75 mV**, plus 25 mV for noise and coupling, giving a **100 mV** requirement.
- **Timing:** C_BL = 60 fF. The weak tail cell (20 µA) develops 0.33 mV/ps and reaches 100 mV at **300 ps**. The nominal cell (30 µA) gets there at 200 ps. Firing at the nominal time is the mistake.

**▸ Follow-up 1.** "How fast does the latch resolve?"

**Answer.** Once enabled, the latch's differential grows as ΔV(t) = ΔV₀·e^(t/τ), with τ ≈ C/g_m.

```latex
t_{res}\approx\tau\ln\frac{V_{DD}}{\Delta V_0}
```

With τ = 10 ps: ΔV₀ = 100 mV gives **22 ps**, and ΔV₀ = 10 mV gives **45 ps**. A small input is slow, and an input near zero (or one cancelled by offset) is metastable.

**▸ Follow-up 2.** "Where does offset come from, and how do you reduce it?"

**Answer.** Sources:
- **V_t mismatch** of the input pair (dominant)
- β mismatch
- latch PMOS/NMOS mismatch
- **asymmetric parasitics** from layout and coupling
- SAE feedthrough

Remedies: by Pelgrom, 4× the area halves σ. You can also use common-centroid/symmetric layout, offset-cancelling SAs, or redundancy. Limits: the SA must fit the **column-mux pitch**, and a BL-connected SA adds C_BL.

**▸ Follow-up 3. What if SAE fires 50 ps early (250 ps)?**

**Answer.** The weak cell has only **83 mV**. After 25 mV of noise, 58 mV is left for offset, which is **3.9σ**. The failure probability is about **5 × 10⁻⁵** per weak-cell read per SA, which multiplied over millions of reads is a yield or field failure. **What if it fires late?** Reliability improves, but cycle time grows and BL energy grows linearly. One column at 100 mV costs C·V_DD·ΔV = **5.4 fJ**, compared with **48.6 fJ** at full swing.

**▸ Follow-up 4.** "How do you generate SAE so that it tracks the bitline?"

**Answer.** Use **replica-bitline self-timing**. A dummy column with **m** always-on replica cells discharges a replica BL. When that replica BL crosses an inverter trip (≈ V_DD/2), it fires SAE. The ratio is set so the replica reaches 0.45 V when the real BL reaches 100 mV, i.e. the replica must slew **4.5× faster**. You get that by using m cells or less replica capacitance. Because it uses the **same bitcell devices**, it tracks PVT, especially at low V_DD, where cell current and logic delay diverge (an inverter-chain delay tracks badly). Using m > 1 cells also averages the replica's own mismatch by σ/√m.

**▸ Follow-up 5. What if aging shifts the offset by +10 mV over life?**

**Answer.** **NBTI** (PMOS), **PBTI**/**HCI** (NMOS) shift V_t. An SA that keeps reading the same value stresses one side more, so its offset **drifts** in one direction. With the same 100 mV budget: (100 − 25 − 10)/15 = **4.3σ** instead of 5σ. Fixes:
- design to the **end-of-life** σ
- alternate input polarity (input swapping or data scrambling) to balance stress
- periodic recovery
- extra SAE delay margin

**▸ Follow-up 6. What if V_DD is lowered?**

**Answer.** Offset (in mV) does **not** scale down, but cell current falls steeply, so the time to reach the same required ΔV rises as 1/I_cell. The latch τ also grows. So the read slows by more than the logic around it, which is another reason replica timing is needed.

<div class="co co-guard"><p class="co-t">Trap</p>

Timing SAE from the **nominal** cell and a **1σ** offset. The design point is the weak tail cell versus the offset at **5–6σ** plus noise. Another trap is claiming a bigger SA always helps: area and pitch limits, plus extra BL loading, push back.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Required ΔV = k·σ_offset + noise. Fire SAE when the weakest cell reaches it (t = C_BL·ΔV/I_weak), and generate SAE with a replica bitline so that it tracks the cells across PVT and aging.

</div>

### D5. Array organization: aspect ratio, column mux, banking, decoder

Why they ask: it tests whether you can turn "4K×32" into rows, columns, a mux and a decoder with numbers, and whether you see the delay and energy consequences.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_org.png: the original referenced asset was not included in the supplied source bundle. For 128 Kb, BL development delay grows with rows and WL RC with columns squared; their sum has a minimum near 256–512 rows

</div>

**Opening question.** "You need a 4K×32 memory (128 Kb). How do you organize the array?"

**Answer.** Not 4096 rows × 32 columns. A 4096-cell BL is about 780 fF and takes about 3 ns to develop 100 mV. Instead, **fold** the words with a **column mux** so the array is closer to square: 512 rows × 256 columns (mux 8) or 256 × 512 (mux 16). Then weigh:
- **BL C ∝ rows**, which sets read time
- **WL R and C ∝ columns**, so WL RC ∝ columns²
- mux ratio, which sets SA pitch
- decoder size
- energy

Go to **banks** when the capacity grows. Draw: the array, the row decoder on the left, the column mux and SAs at the bottom, I/O, and the control block.

**Worked numeric problem.** Per cell: BL 0.19 fF, WL 0.3 fF and 2 Ω. I_cell = 25 µA and ΔV = 100 mV.

| rows × cols | mux | C_BL | t_BL (100 mV) | WL 0.5·R·C |
|---|---|---|---|---|
| 4096 × 32 | 1 | 778 fF | 3.1 ns | 0.3 ps |
| 1024 × 128 | 4 | 195 fF | 778 ps | 4.9 ps |
| 512 × 256 | 8 | 97 fF | 389 ps | 19.7 ps |
| 256 × 512 | 16 | 49 fF | 195 ps | 79 ps |
| 128 × 1024 | 32 | 24 fF | 97 ps | 315 ps |

In this model the delay sum is lowest near **256 × 512**. Many designs still choose **512 × 256**, because of energy, SA pitch and layout aspect (next follow-up).

**▸ Follow-up 1.** "Where does the energy go, and does the mux ratio matter?"

**Answer.** Every cell on the selected row turns on, so **all columns swing**, not just the 32 you read. Energy per access = cols × C_BL × V_DD × ΔV = bits × c_cell × V_DD × ΔV ≈ **2.2 pJ**, regardless of aspect. The **useful fraction is 32/cols**: mux 16 wastes 15/16 of it. To cut energy you need a **divided/segmented WL** (only the needed columns' local WL goes high) or **banking** (only one bank is active), not a different aspect ratio.

**▸ Follow-up 2.** "Size the row decoder with logical effort."

**Answer.** Take a 9:512 decoder (512 rows × 256 columns).
- Each address line (true or complement) drives half of the 512 ANDs, so **B = 256**.
- WL load = 256 × 0.3 fF = 76.8 fF. With address C_in = 2 fF, **H = 38.4**.
- A 9-input AND built as NAND3 + NOR3 has **G = (5/3)(7/3) = 3.89**.

```latex
F=G\,B\,H=3.89\cdot256\cdot38.4\approx3.8\times10^{4},\qquad N=\log_4F\approx7.6\Rightarrow 8,\qquad f=F^{1/8}\approx3.74
```

Delay ≈ N·f + P ≈ 29.9 + 8 ≈ **38 τ** (with p ≈ 1 per stage; N = 8 beats 7 or 9). **Predecoding** (three 3:8 predecoders whose outputs are ANDed at each row) cuts the branching per address bit and the number of large gates. The final WL driver is a large inverter chain sized for the WL RC.

**▸ Follow-up 3.** "Why does WL delay go as columns², and how do you fix it?"

**Answer.** R and C both grow with length, so the distributed RC ∝ L². The Elmore value is 0.5·R·C (the 50 % point is about 0.38·RC). Fixes:
- **strap** the poly WL with metal
- a **divided WL**: a global WL plus local WL drivers per segment, which also saves energy
- drive the WL from the middle (halves L, quartering the RC)

You cannot put repeaters inside the cell pitch, so segmentation is the way to "repeat".

**▸ Follow-up 4. What if the spec were 1K×128 instead of 4K×32 (same 128 Kb)?**

**Answer.** Physically it can be the **same 512 × 256 array**:
- **4K×32**: 9 row bits + 3 column bits, **mux 8**, 32 SAs.
- **1K×128**: 9 row bits + 1 column bit, **mux 2**, **128 SAs** and I/Os.

The wide word has **4× the bandwidth** per access and wastes fewer columns (1 of 2 instead of 7 of 8 in each mux group), so energy per useful bit is lower. The costs are 4× the SAs and I/O, an SA pitch of only **2 columns** (tight), and higher peak current per access.

**▸ Follow-up 5. What if capacity grows 16× (2 Mb)?**

**Answer.** Don't stretch one array. Use **banks** of about 128 Kb, plus bank decode, an H-tree or balanced global data and address routing, and activate only one bank per access. **Leakage ∝ total bits** no matter how you organize it, so add retention or power-gating of idle banks. For ROM, rows per local BL also set the **(N−1)·I_off** leakage (D3), which is another reason for hierarchy.

**▸ Follow-up 6.** "Any other reason to use a column mux besides aspect ratio?"

**Answer.** **Soft errors**: interleaving bits of different words means one multi-cell upset hits different words, so per-word **ECC** (SECDED) can correct each one. The cost is half-select during writes (D2).

<div class="co co-guard"><p class="co-t">Trap</p>

"Make it square for minimum delay" without mentioning that every column on the row swings (energy), SA pitch, or the mux's effect on half-select. Another trap is forgetting that BL delay is set by the **number of rows**, not by total capacity.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

Rows set C_BL and read time, columns set WL RC (∝ cols²), and mux ratio sets SA pitch and wasted energy. Fold the words to balance these, then use banks and a logical-effort-sized decoder (here about 8 stages, ≈ 38 τ).

</div>

### D6. EM and IR: rails, droop, decap, Black's equation

Why they ask: the interviewer has EM-flow background. They want to see that you separate the voltage problem (IR) from the reliability problem (EM), and that you can do the numbers.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_ir_rail.png: the original referenced asset was not included in the supplied source bundle. Static IR along a 100 µm, 200 Ω rail carrying 0.5 mA spread uniformly, fed from one end vs both ends

</div>

**Opening question.** "What's the difference between IR drop and EM, and how would you check a standard-cell power rail?"

**Answer.**
- **IR drop** is voltage lost across grid resistance, so cells see a lower V_DD. That means slower timing and less SRAM/ROM margin. It has a **static** part (average current) and a **dynamic** part (L·di/dt and resistive drop during switching bursts, buffered by decap).
- **EM** is a **wear-out** mechanism: the electron wind transfers momentum to metal atoms, which grows **voids** (opens, rising resistance) and **hillocks** (shorts). It depends on **current density J** and **temperature**, and it is checked per wire and via against foundry limits for average, RMS and peak current.

So: IR is a voltage at time zero, EM is a lifetime. Draw: a rail with tap currents and the V(x) parabola.

**Worked numeric problem (static IR).** The rail is 100 µm long and 0.1 µm wide, with R_s = 0.2 Ω/□. That is 1000 squares, so R = **200 Ω**. A total current I = 0.5 mA is spread uniformly along it.

```latex
V(x)=V_{DD}-\frac{IR}{L^2}\Big(Lx-\frac{x^2}{2}\Big)\ \Rightarrow\ \Delta V_{max}=\frac{IR}{2}\ \text{(one end)},\qquad \frac{IR}{8}\ \text{(both ends)}
```

- Fed from one end: 0.5 mA × 200 Ω / 2 = **50 mV**.
- Fed from both ends: **12.5 mV**.
- With **straps every 20 µm** (each segment 40 Ω, 0.1 mA, both ends fed): **0.5 mV**.
- Doubling the width halves R, so the one-end drop becomes 25 mV.

The lesson: IR drop goes as **I·R/2 for distributed current**, not I·R, and strap pitch is the strongest lever.

**▸ Follow-up 1.** "What is dynamic droop, and what does decap do?"

**Answer.** Model the package and bump path as series R and L feeding the on-die decap C, and apply a load step I. The first droop is roughly I·√(L/C), followed by ringing at f₀ = 1/(2π√(LC)) with Q = √(L/C)/R. **Numbers:** L = 20 pH, R = 2 mΩ, C = 200 nF, 10 A step:
- √(L/C) = 10 mΩ, so the estimate is about 100 mV; the simulation gives **105 mV**.
- f₀ = **80 MHz**, Q = 5.

**What if decap is 4× (800 nF)?** The droop **halves** to about **55 mV** (∝ 1/√C) and f₀ halves to 40 MHz. The DC level is still 0.9 − 10 A × 2 mΩ = 880 mV. Decap only buys **time** for the regulator and package; it cannot fix the resistive (DC) drop.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_droop.png: the original referenced asset was not included in the supplied source bundle. Simulated RLC response to a 10 A load step with 200 nF vs 800 nF on-die decap

</div>

**▸ Follow-up 2.** "For EM, which current do you check: average, RMS or peak?"

**Answer.** Take a 2 mA pulse with 10 % duty cycle:
- **I_avg = 0.2 mA**
- **I_rms = 2 × √0.1 = 0.63 mA**
- **I_peak = 2 mA**

**Power rails** carry mostly unidirectional current, so the **average** J limit applies (Black's equation). **Signal wires** are **bidirectional**: they charge and then discharge, so the average is about 0, and damage partly heals when current reverses. Their limits are **RMS** (Joule self-heating, which raises temperature and accelerates EM in nearby wires) and **peak**. For bidirectional ±2 mA pulses of 10 % each, I_rms = 2√0.2 = **0.89 mA**.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_em_pulse.png: the original referenced asset was not included in the supplied source bundle. Average, RMS and peak current of one pulse train: each maps to a different EM/self-heating rule

</div>

**▸ Follow-up 3. What if current doubles, or temperature rises 20 °C?**

**Answer.** Black's equation:

```latex
\text{MTTF}=A\,J^{-n}\exp\!\Big(\frac{E_a}{kT}\Big),\qquad n\approx 1\text{–}2
```

- **J × 2 with n = 2** gives MTTF ÷ **4** (with n = 1, ÷2).
- **105 → 125 °C** with E_a = 0.9 eV: exp[(E_a/k)(1/398 − 1/378)] = **0.25**, also ÷4.
- **Both together** give ÷16 (0.062).

This is why EM limits are quoted at a temperature (often 105–125 °C), and why self-heating (RMS) feeds back into the average-current EM rule.

**▸ Follow-up 4.** "How do vias come in?"

**Answer.** Vias are EM weak points: current crowds at the via edge, and the via-to-line interface is where voids nucleate. Each via has its own current limit. With an illustrative 0.1 mA per via, a 1.2 mA rail tap needs **≥ 12 vias**, so use **via arrays**. Arrays also add **redundancy** (one voided via doesn't open the path) and improve yield. **Blech effect**: if J·L is below a critical product, back-stress halts EM. Short segments between vias are therefore effectively immune, which EM tools exploit.

**▸ Follow-up 5.** "List the fixes for IR and EM."

**Answer.**
- **Wider / parallel / stacked rails**: R ↓ and J ↓, which fixes both.
- **More straps and vias**.
- **Decap** near hot spots, for dynamic droop only.
- Place high-current cells near straps.
- Spread switching activity: stagger precharge, skew clock edges.
- Power-switch sizing.
- For signal EM: non-default width rules, a smaller driver (slower edge, lower peak), or splitting the load.

For memories, **all BLs precharging at once** gives a large peak current, so stagger precharge or use segmented arrays.

**▸ Follow-up 6. What if temperature rises 20 °C: does IR drop change too?**

**Answer.** Yes. Cu resistivity rises about 0.4 %/K, so R goes up about 8 % and IR drop goes up about 8 % (50 → 54 mV in the example) (added). Hot is also the leakage corner, so static current rises as well. Hot is therefore bad for IR and EM together.

<div class="co co-guard"><p class="co-t">Trap</p>

Checking a signal wire's EM with average current (≈ 0, so it "passes") and missing the RMS/peak limits. Or treating EM as a voltage-drop problem. EM is lifetime, ∝ J^−n·e^(E_a/kT), so 2× current or +20 °C each cost about 4× MTTF.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

IR = I·R/2 for distributed load (I·R/8 fed from both ends); droop ≈ I·√(L/C), so decap scales as 1/√C and can't fix DC drop. EM uses average current for rails and RMS/peak for signals, and Black's equation makes 2× J or +20 °C roughly a 4× lifetime hit.

</div>

### D7. Variation and high sigma: Pelgrom, yield math, importance sampling

Why they ask: every memory margin above (bump, SNM, write trip, SA offset, ROM leakage) is meaningful only at a sigma target. They want the yield arithmetic and why brute-force Monte Carlo can't reach it.

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_pelgrom.png: the original referenced asset was not included in the supplied source bundle. Pelgrom scaling: σ(ΔVt) = A_VT/√(WL)

</div>

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

D_tail.png: the original referenced asset was not included in the supplied source bundle. Normal tail with 3, 4.5 and 6σ markers, and array yield vs per-cell sigma for 128 Kb, 1 Mb and 16 Mb

</div>

**Opening question.** "How do you verify that a bitcell is robust? Why aren't corners enough?"

**Answer.**
- **Global variation** (die-to-die and wafer; the SS/FF/SF/FS corners) moves **all** devices together.
- **Local random mismatch** (random dopant fluctuation, line-edge roughness, metal grain) is **independent per transistor**, with σ_Vt = A_VT/√(WL).

Bitcells use **minimum-size** devices, so their σ is large, and there are **millions** of cells. A cell fails on **differences** (AX vs PD, left vs right) that corners never create. So you verify global corners **plus** local Monte Carlo at **about 6σ** per cell, which needs special statistical methods. Draw: a normal curve with the tail beyond kσ shaded.

**Worked numeric problem.**
- **Pelgrom**, with A_VT = 1.5 mV·µm:
  - 0.1 × 0.05 µm gives σ_Vt = 1.5/√0.005 = **21.2 mV**.
  - 0.2 × 0.1 µm (4× the area) gives **10.6 mV**, half as much.
- **Yield:** a 1 Mb array (N = 2²⁰ cells) at 99.9 % yield with no repair:

```latex
Y=(1-p)^N\approx e^{-Np}\ \Rightarrow\ p\le\frac{-\ln Y}{N}=\frac{1.0005\times10^{-3}}{1\,048\,576}=9.5\times10^{-10}\ \Rightarrow\ k=\Phi^{-1}(1-p)\approx 6.0\sigma
```

For reference, the tails are: 3σ → 1.3 × 10⁻³, 4.5σ → 3.4 × 10⁻⁶, 6σ → 9.9 × 10⁻¹⁰ (one-sided). Even 3σ, in 1 Mb, means about **1400** failing cells.

**▸ Follow-up 1.** "Why can't you just run Monte Carlo?"

**Answer.** Estimating p ≈ 10⁻⁹ to ±10 % needs about 100 failures, i.e. **100/p ≈ 10¹¹ simulations**. Running 1000 samples with zero failures only shows p < 3 × 10⁻³, which is about **2.7σ**. **Importance sampling** fixes this: sample from a distribution **shifted toward the failure region** (centred near the most-probable failure point in V_t space), then weight each sample by the likelihood ratio f(x)/g(x). That gives an unbiased p estimate from about 10³–10⁴ simulations. Related methods: statistical blockade, and minimum-norm (most-probable-point) search.

**▸ Follow-up 2. What if the array is 16× larger (16 Mb)?**

**Answer.** p ≤ 1.0 × 10⁻³ / 2²⁴ = 6.0 × 10⁻¹¹, which is **6.44σ**: only **+0.44σ** for 16× the bits. The tail is so steep that capacity costs little extra sigma. **Redundancy** (spare rows/columns) and **ECC** relax the requirement much more. For example, with SECDED on 39-bit codewords (32 data + 7 check) in a 1 Mb array, a word fails only with ≥ 2 bad bits. p_word ≈ C(39,2)·p², and 32768 words × 741 × p² ≤ 10⁻³ gives p ≤ 6.4 × 10⁻⁶ ≈ **4.4σ** per cell. In practice ECC is usually reserved for soft errors, so this is an upper bound on the benefit.

**▸ Follow-up 3.** "How does σ map into the memory margins we discussed?"

**Answer.** Each metric has a mean and a spread, and you need roughly μ − kσ > 0:
- **Read SNM**: a 3σ AX/PD skew already took read SNM from 216 to 128 mV (D1/D2).
- **SA**: required ΔV = 5σ × 15 mV + noise (D4).
- **ROM**: I_off is **lognormal**. One σ_Vt (21 mV) changes I_off by exp(0.0212/(1.35 × 0.0259)) ≈ **1.8×**, so a 6σ low-V_t leaker is huge. Summed over N−1 cells it averages out somewhat, but the weak-I_on read-0 cell sits at the far tail.

Metrics like SNM are **nonlinear** in V_t, so sample in V_t space. Do not fit a Gaussian to SNM and extrapolate it.

**▸ Follow-up 4. What if you combine global corners with local variation?**

**Answer.** Run local high-sigma MC **at** the worst global corner for each failure mode. Read stability is typically worst at **FS** (fast NMOS AX, slow PMOS) and write at **SF** (slow NMOS AX, fast PMOS). ROM read-1 is worst **hot** (leakage) and read-0 is worst **slow / low V_DD** (I_on). Low V_DD makes all of these worse, because σ_Vt stays fixed while the margins shrink.

**▸ Follow-up 5.** "What breaks the Gaussian assumption?"

**Answer.** V_t mismatch is close to Gaussian, but the far tail is not guaranteed. Random telegraph noise and aging (BTI) add time-dependent shifts, and layout-dependent effects add systematic offsets. So high-sigma signoff often includes **aging-aware** and **end-of-life** margins, plus silicon V_min correlation.

<div class="co co-guard"><p class="co-t">Trap</p>

"We ran 1000 Monte Carlo runs and none failed, so it's fine." That shows only about 2.7σ. A 1 Mb array needs about 6σ per cell, which takes importance sampling or a similar method. Another trap is using global corners alone for a bitcell, whose failures come from **mismatch between neighbouring devices**.

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

σ_Vt = A_VT/√(WL) makes bitcells the worst-matched devices on the chip. N cells at yield Y need p ≤ −ln Y/N per cell (about 6σ for 1 Mb, +0.44σ for 16×), which you verify with importance sampling and recover with redundancy or ECC.

</div>


## Part E — Your plan and goals (the light behavioral part)

Your friend said behavioral was **light and focused on your plan and goals**. Keep each answer **20–40 seconds**, specific, and **inside NVIDIA circuit design**.

**"What are you looking for in your first job?"**

> "Depth at the transistor level with real ownership: cells or ROM where my work ships in every chip that uses it, and a team that holds a high bar on margins and verification."

**"Where do you see yourself in 1, 3 and 5 years?"**

> "**Year one:** reproduce a reference cell and its flow, then own a bounded change, like a new drive strength, a margin check or a debug, and support its users. **By year three:** own a cell family or a ROM configuration end to end: design, margins, characterization, release. **By year five:** go through a new-node library bring-up, lead a piece of it, and be someone the team relies on for hard margin problems, especially at low voltage."

**"What do you want to learn first?"**

> "FinFET/GAA legal sizing and layout constraints, the team's characterization and QA flow, and the high-sigma and reliability methodology. And how the physical-design teams actually use the library."

**"Technical track or management?"**

> "Technical first, for a long time. Depth before leading anyone."

**"Why standard cells / ROM rather than analog?"**

> "My analog work taught me margin thinking: PVT, subthreshold sensitivity, stability. Foundation IP uses exactly that thinking, but the result multiplies across every chip. And ROM is a small circuit with deep margin problems, which is the kind of problem I like."

**"Why leave the PhD track?"**

> "I wanted to build things that ship. I finished my MS in VLSI and focused on industry circuit design. That's the direction I've chosen."

<div class="co co-guard"><p class="co-t">Guardrails</p>

Never "stepping stone". Don't volunteer strategy, consulting, startup or healthcare-commercialization goals. Never "I have a PhD" (say "I started on the PhD track and completed my MS").

</div>

<div class="co co-core"><p class="co-t">One-line takeaway</p>

**Year 1: reproduce, then own a bounded change. Year 3: own a cell family or ROM. Year 5: new-node bring-up and the go-to for hard margins. Technical track first.**

</div>