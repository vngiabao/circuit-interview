## Part R — Read this first


### R.1 The interview, confirmed

| Item | Detail |
| --- | --- |
| When | **Friday, October 2, 1:00 PM Pacific / 4:00 PM Eastern**, about **45 minutes** |
| Who | **Bo Li**, Circuit Design Engineer at NVIDIA |
| How | Microsoft Teams, **camera and microphone on the whole time** |
| Role | Circuit Design Engineer – New College Grad 2027, JR2014331 (standard cells and/or custom ROM) |
| Rules | **No outside tools (e.g., ChatGPT) during the interview** = disqualification. Have paper and pen ready to draw. |
| After | Next steps usually in **5–7 business days**. Thank-you note goes **through the recruiter**. If Bo hasn't joined within 10 minutes, email the scheduler. |

<div class="co co-core"><p class="co-t">The one-line shift</p>

TSMC asked "will he stay and own a fab loop?" NVIDIA asks "**can he reason at the transistor level, check his own work, and be honest about what he knows?**" Most of the 45 minutes is technical. Your résumé is the map Bo will use to decide where to push.

</div>

### R.2 Who Bo Li is (from his LinkedIn)

| | |
| --- | --- |
| Now | Circuit Design Engineer, NVIDIA, **since Feb 2025** (about 1.5 years full-time) |
| Before | **NVIDIA Circuit Design intern, May–Aug 2024: "EM flow enhancements"** (skills listed: Circuit Design, **Electromigration**) |
| Education | **MS EE, USC** (2023–24; lithography, e-beam litho); **BS Computer Engineering, UC Davis** (2018–23; digital circuit design, CAD) |

<div class="co co-value"><p class="co-t">What this tells you</p>

He's a **near-peer**: two years ago he was where you are. Expect a **practical, hands-on engineer**, not a manager's fit interview. His internship was **electromigration flow work**, so **EM/IR is his home turf** and where he'll judge depth fastest (Part T1.8). His CAD and flow background means he'll respect **automation and checking your own results**.

</div>

### R.3 What the forums actually report (evidence, not rumor)

| Source | Date | What was asked |
| --- | --- | --- |
| Glassdoor, **Circuit Design Engineer, Santa Clara** | Jul 2026 | "Very straight to the point, **no introductory stuff**." Questions **from résumé projects**, then **a few behavioral**, then a **daily-task problem**: "**How would you characterize the leakage of a standard cell library with minimal compute?**" |
| Glassdoor, Circuit Design Engineer, Santa Clara | Jun 2025 | 1 hour. "**What is hold time?**" |
| Glassdoor, Circuit Design intern | Aug 2025 | 3 × 45-min technical rounds: **CMOS basics, stick diagrams, timing closure, coding (SPICE/Python), SRAM basics** |
| Glassdoor, Circuit Design intern | Feb 2024 | "**Draw stick diagrams** of various circuits." "**Size CMOS circuits in ratios 2:1 and 1:1.**" "**Draw a transistor-level latch and D-FF.**" |
| Glassdoor, Circuit Design intern | Dec 2023 | 45 min: **timing and power**, "timing and power optimization for low power," then your interests |
| Blind, NVIDIA SRAM circuit design | — | **RC charging/discharging**, power vs area trade-offs |
| Glassdoor, industry std-cell/memory roles | various | How a **sense amp** works · **NAND vs NOR** · why **PMOS slower** · **avoid hold violations** · **reduce leakage (6+ ways)** · **reduce EM** · power dissipation types · **footer cell** · short pulse from a clock |

Sources: [Glassdoor CDE](https://www.glassdoor.com/Interview/NVIDIA-Circuit-Design-Engineer-Interview-Questions-EI_IE7633.0,6_KO7,30.htm) · [Glassdoor CDE intern](https://www.glassdoor.com/Interview/NVIDIA-Circuit-Design-Engineer-Intern-Interview-Questions-EI_IE7633.0,6_KO7,37.htm) · [Blind SRAM](https://www.teamblind.com/post/senior-sram-circuit-design-engineer-interview-at-nvidia-n0rigjyb) · [Glassdoor std-cell](https://www.glassdoor.com/Interview/standard-cell-design-interview-questions-SRCH_KO0,20.htm) · [Glassdoor memory](https://www.glassdoor.com/Interview/memory-design-engineer-interview-questions-SRCH_KO0,22.htm). Reddit could not be accessed from here; the GPT playbook found only adjacent Reddit threads (a PD student, advice threads), which are weaker than the Glassdoor reports above.

<div class="co co-core"><p class="co-t">What this means for Friday</p>

**Expect: résumé project → fundamentals (hold time, sizing, latch/flop, stick diagram) → one practical "how would you do this task" problem.** Be ready to skip the intro entirely. The July 2026 leakage-characterization task is the closest thing to a real sample question; it's fully answered in Q10.

</div>

### R.4 The likely 45 minutes

| Min | What | Where in this bible |
| --- | --- | --- |
| 0–3 | Hello, maybe a 30-second intro (or none) | Q1 |
| 3–13 | One résumé project, 2–3 follow-ups | Q2–Q3, Part RD |
| 13–33 | Fundamentals + one practical problem | Part Q, Tier 1 |
| 33–38 | One or two behavioral | Q16–Q18, Part A2 |
| 38–45 | Your questions, close | Part P |

If he spends 25 minutes on one circuit, **follow the depth**. Don't force the schedule.

### R.5 How this bible is tiered (learn top-down, don't skip ahead)

| Tier | What | Rule |
| --- | --- | --- |
| <span class="tier t1">T1 MUST CONQUER</span> | CMOS & sizing, stick diagrams, delay/power/leakage, latch/flop/setup/hold, 6T SRAM, NOR ROM, characterization, SPICE, **EM/IR**, DRC/LVS | Be able to **draw it, explain it, and handle one changed assumption** without notes |
| <span class="tier t2">T2 HOW TO EXCEL</span> | Logical effort, charge sharing, level shifters, clock/power gating, metastability, memory timing, variation & yield math, aging, FinFET/GAA transition | Start only after T1 passes the gate (R.7) |
| <span class="tier t3">T3 GOOD TO KNOW</span> | ROM history beyond NOR/NAND (ROM.8), ROM compilers, CCS/LVF detail, NVIDIA cell research, tools | Skim; one sentence each |
| <span class="tier rd">RÉSUMÉ ONLY</span> | WICS TIA/filter, Faraday DFT/STA/MBIST, NTT (corrected facts), SRAM PUF, adder, mixer, PetersonLab | Only because **you claimed it**; can be probed 3 deep |

### R.6 Your plan to Friday

| When | Do | Output |
| --- | --- | --- |
| **Wed** (4–5 h) | Part R, P, Q1–Q3 out loud. **T1.1–T1.5** on paper. **ROM.1–ROM.10** (the team, the architectures). **SKILL.1 + SKILL.3** (what makes someone excel; estimate before simulating). | Intro under 75 s; can draw NAND2 stick, TG latch, DFF, 6T, ROM column cold |
| **Thu** (4–5 h) | **T1.6–T1.11** incl. **leakage task** and **EM/IR**. **SKILL.2** (SPICE craft: say the five testbench-realism points and the setup-time bisection). **Part X** expert bank, 6 scenarios out loud. Résumé defense (WICS, Faraday, NTT). One **45-min mock**. | Q10 fluent; EM in 3 levels of depth; can set up any recipe in SKILL.2f |
| **Fri AM** (2–3 h) | T2 picks; **Part G** final-hour checklist; CULT/CAREER answers once. Test Teams, camera, drawing setup by **3:00 PM ET**. | Calm, warm, ready |

### R.7 The readiness gate (score 0/1/2 each; move to T2 at 16/20)

1. 60-second intro, no notes · 2. Defend one real WICS or Faraday decision · 3. Draw + size NAND2 at 2:1 **and** 1:1 · 4. Draw a NAND2 **stick diagram** · 5. Draw a TG latch and a master–slave DFF; explain setup/hold · 6. Why hold can't be fixed by slowing the clock · 7. 6T read and write conflict · 8. Both ROM keeper failure modes · 9. Leakage characterization with minimal compute · 10. EM vs IR, and avg vs RMS vs peak

### R.8 What changed from earlier versions (audit summary)

The GPT playbook caught real facts, so **these corrections are now built in**:

- **NTT (EECS 627)** was a **130nm course ASIC**. Blocks were individually DRC/LVS clean; **top-level DRC/LVS was not closed** by the deadline, and the presentation records a **low-DMA-frequency functional bug**. Never say "clean signoff" or "taped out" for NTT (Part RD.3).
- **miLEAD:** the résumé says **four** startups, **Oct 2024–Aug 2026**, outreach to 2,000–4,000 potential consumers per project, highest valuation ~$55M.
- **Degree wording:** your résumé lists an **MS (Winter 2026)** and a doctoral fellowship. **Never say "I have a PhD."** Say "I started on the PhD track and completed my MS."
- **"3σ for flops, 6σ for memory"** is a common rule of thumb, not a universal rule. Say "sigma targets come from array size and yield goals."

What GPT's version got wrong for **you**: it hedged every sentence, left most personal answers as blanks, and ran 139 pages. This version keeps its accurate technical content, but in **short lecture format** (definition → why you care → how → pros/cons → what if → best choice), with **full answers** and **one takeaway highlighted per question**.

## Part P — Bo Li: how to enter, what to show, what to ask


### P.1 How to enter

- **By 3:45 PM ET:** Teams open, camera at eye level, good light, **paper + dark pen** (or a tablet) ready to draw, and a glass of water.
- **Opening:** "Hi Bo, nice to meet you, thanks for taking the time today. Can you hear me okay?" Then **let him set the format.**
- **If he jumps straight to a question** (the July 2026 report said "no introductory stuff"): answer it. Don't force your intro in.
- **When drawing:** hold the paper up to the camera, or say "let me describe as I draw." Label nodes (VDD, GND, A, B, Y) out loud.

### P.2 What he'll value (and what to show)

| He is | So he'll value | Show it by |
| --- | --- | --- |
| ~1.5 yr full-time circuit designer | Clear fundamentals, practical thinking | Draw it, trace the current path, state assumptions |
| Did **EM flow enhancements** as an intern | **EM/IR depth**, flows, automation, checking results | T1.8 answers; your Tcl/Perl automation |
| UC Davis CompE → USC EE (CAD, litho) | Tool and flow literacy | Name the flow step and tool without overclaiming |
| Recently a new grad himself | Honesty, coachability, fast learning | "Here's what I know, here's how I'd find out" |

### P.3 How to talk about EM without bluffing

<div class="co co-key"><p class="co-t">Your honest EM line</p>

"I first learned EM/IR while **helping a friend prepare for a CAD EM/IR interview at Apple**. That was self-study, not signoff experience. What I understand is the chain: **circuit activity → current waveform → which wire or via → average, RMS or peak limit → fix and its cost**." Then show it with one example: a clock buffer's output via, or a high-drive cell's output pin.

</div>

- **If he goes deep:** Black's equation, avg vs RMS vs peak, Blech length, via arrays, Liberty EM tables (T1.8, T2.6).
- **If you hit your limit:** "That's past what I've studied. My guess is X because Y, and I'd check it with Z."

### P.3b What Bo may ask "from his own desk" (not from forum lists)

These come from **what Bo actually did** (an intern project on **EM flow enhancements**, then full-time circuit design) and the daily problems in ROLE.9, not from question lists online.

| He might ask | What a strong answer covers |
| --- | --- |
| "An EM check flags one via on a cell's output pin at 1.3× the limit, only at one corner. Real or artifact?" | EM limits drop at **high temperature** (Black's equation); current is highest at **FF / high VDD**. Check whether that corner pairing is intended (it's the usual conservative one), the **toggle-rate/frequency assumption**, and the via count in the extracted view. If real: **add vias or widen**, then recheck timing and area. |
| "How do you get the RMS current of a clock buffer's output from SPICE?" | Simulate at the **target frequency with realistic slew and load**; `.meas tran irms RMS i(...)` over whole periods; report **avg, RMS and peak**. |
| "Signal wire vs power strap: which EM limit matters?" | Signal wires carry **bidirectional** current (average ≈ 0) → **RMS (heating) and peak** matter. Power straps carry **one-way** current → **average (DC EM)** matters. |
| "How do cell-level EM limits reach the chip-level check?" | Characterize per-pin limits into the **.lib** (e.g., max toggle rate vs slew and load); chip tools compare the **actual toggle rate** against it. So the library number has to be right, or every chip inherits the error. |
| "A new flow version reports twice the violations. What do you do?" | Freeze the design; **diff old vs new outputs**; check **units, thresholds, temperature, activity and net mapping** before believing the design got worse (ROLE.5). |
| "The EM run takes two days. How would you speed it up?" | Use pre-characterized cell limits; run detailed analysis only on **flagged or high-activity nets**; parallelize; **reuse results for unchanged cells**; make sure speed-ups don't change the answer on a known test case. |
| "A ROM instance passes everything, but you're asked to sign it off with a brand-new code file. What do you rerun?" | Anything **pattern-dependent**: read-1 leakage with the new worst column, IR/peak current, and characterization if the pattern changes the worst-case arcs. Structural checks don't change. |

### P.4 Questions to ask him (pick two, based on the conversation)

1. **The job:** "How is this opening split between **standard-cell design, ROM, and characterization or methodology**? What would a new grad **own first**?"
2. **Your transition:** "My transistor-level work has been in **65nm planar**. What tends to be the **biggest adjustment** for a new grad moving into your device and library environment?"
3. **EM, if it came up:** "Your profile mentions **EM flow enhancements** from your internship. What made an EM flow improvement most valuable: **accuracy, coverage, runtime, or easier debug**?"
4. **Judgment:** "When a cell meets timing but **fails a reliability check**, how do circuit, layout and methodology engineers usually settle the trade-off?"
5. **Node (let him choose the depth):** "At a level you can share, is the work mostly **established FinFET** libraries or **newer device platforms**?"
6. **Ramp:** "What separates new engineers who ramp up well on this team?"

<div class="co co-guard"><p class="co-t">Don&#x27;t ask</p>

Confidential node or model details, compensation, or "how did I do?" Leave logistics (start date, relocation) for Chanel.

</div>

### P.4b Questions only Bo (or the team) can answer

<div class="co co-value"><p class="co-t">Why these beat internet questions</p>

The best questions are ones **whose answers only an insider knows**, built from **his** path and **this team's** work. They show you've already thought about the job. Pick **two or three**, and have a **follow-up** ready so it turns into a conversation.

</div>

**About his own path (only he knows):**

1. "Your intern project was **EM flow enhancements**. **Did that flow go into production use?** What was the hardest part: accuracy, runtime, or getting people to trust it?"
    - *Follow-up:* "Did it change how cells are characterized for EM, or just how violations are reported?"
2. "Going from intern to full-time, **what changed most in what you owned?**"
3. "You studied **lithography** in your MS. Does that show up in cell or bitcell layout, like patterning constraints at advanced nodes?"
    - *Why it's good:* it's specific to him, and at advanced nodes, patterning rules really do shape cell layout.

**About how the team really works:**

4. "**Right now, how is your time split** between new-node library work, requests from chip teams, and support/debug?" (This answers your own "what's the day-to-day?" question.)
5. "When a chip team needs a ROM, **how much is compiler-generated and how much is custom-tuned**? Is the compiler built in-house?"
6. "How early does the library team get involved in a new process? **Do you give feedback on the design rules** (DTCO), or mostly receive them?"
7. "Which check catches the **most real problems** for you: characterization QA, post-layout simulation, EM/IR, or silicon?"
8. "When silicon comes back, **how does the team learn whether the ROM margins were right**: BIST data, test chips, or failure analysis?"

**ROM-specific (shows you read up):**

9. "For ROM sign-off, do you verify with **the actual firmware patterns or synthetic worst cases**, or both?"
10. "How do you handle a **late code change**: is programming kept at a via layer so only one mask changes?"

**About you succeeding:**

11. "What did **your first three months** look like, and what do you wish you'd known in month one?"

<div class="co co-guard"><p class="co-t">Stay on the right side</p>

Frame anything about nodes, products or roadmap as "**at a level you can share**". Don't ask about unreleased products, compensation, or "how did I do?". If he says "I can't talk about that", smile and move on: "Totally fair."

</div>

### P.5 How to close

> "Thanks, Bo. I really enjoyed hearing about [something specific he said]. The mix of **transistor-level design and making the library trustworthy** is exactly what I want to go deep on, and I'd be excited to do it on this team."

**After:** within 24 hours, send a short thank-you **to Chanel** (she forwards it). Mention one specific topic from the conversation. Write down every question you were asked for the next round.

## Part N — NVIDIA: what to know about the company


### N.1 The one-paragraph version

NVIDIA designs **accelerated computing platforms**: GPUs, CPUs (Vera), networking (from its Mellanox acquisition), full rack systems, and the **CUDA** software stack that makes them useful. It's **fabless**: NVIDIA designs, and **TSMC manufactures**. It began in graphics (invented the GPU in 1999), CUDA (2006) turned the GPU into a general parallel computer, and deep learning made it the engine of modern AI. Today it's overwhelmingly a **data-center company**.

| Latest quarter (Q2 FY2027, May–Jul 2026) | Value |
| --- | --- |
| Revenue | **$96.2B**, up 106% year over year |
| Data Center | **$89.0B** (~92% of revenue) |
| Gross margin | **75%** |
| Next quarter outlook | $108B |
| Current platform | **Vera Rubin** in full production ramp; Blackwell before it |

Source: [NVIDIA Q2 FY2027 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027). Don't recite numbers in the interview; know the shape.

### N.2 The five values, and how to show each

From NVIDIA's Code of Conduct ([summary](https://www.resumeadapter.com/companies/nvidia/core-values)). Show them; never recite them.

| Value | Their words | Show it by | Your story |
| --- | --- | --- | --- |
| **Innovation** | "Dream big, start small. Take risks, learn fast." | A new approach that removed wasted work | Faraday Tcl/Perl automation |
| **Intellectual Honesty** | "Seek truth, learn from mistakes, share learnings." | Precise scope; "I don't know, here's how I'd check" | Faraday scope-setter; NTT's real status; grad-school recovery |
| **Speed and Agility** | "Learn, adapt, shape the world." | Ramp fast on something new | New DFT/STA flow in 1.5 months |
| **Excellence and Determination** | "Maintain the highest standards." | Check your own result after the fix | WICS PVT validation |
| **One Team** | "Do what's best for the company." | Clean handoffs, credit others | Taiwan–Vietnam handoffs; mentoring interns |

<div class="co co-core"><p class="co-t">Core memory</p>

**At NVIDIA, "intellectual honesty" is a named value. Precise scope is a strength, not a weakness.**

</div>

### N.3 Why your team matters (the line to say)

<div class="co co-key"><p class="co-t">Say this</p>

"Everyone at the leading edge builds on the same foundry process. The **standard-cell and memory libraries** are where a design company can get **more out of that same process**. Every cell is used **billions of times** on chips where **power is the limit**, so a 1% gain in a flop is a real product gain."

</div>

## Part ROLE — What the job actually is


### ROLE.1 In one sentence

**Deliver a circuit that works, a model that tells the truth, and a release other engineers can use.** You design the **transistor-level building blocks** (standard cells: logic, flops, level shifters, math cells) and/or **custom ROMs** that every NVIDIA chip is built from. Your customers are internal: synthesis, place-and-route, timing and power teams.

### ROLE.2 Your five responsibilities

| Responsibility | What it means | Proof you can give |
| --- | --- | --- |
| **Circuit** | Topology and sizing; delay, power, leakage, area, input load, margins | WICS design across PVT |
| **Model** | The .lib must match silicon behavior: right arcs, states, units | Faraday: consumed .libs in PrimeTime |
| **Verification** | Define failure first, cover the operating space, catch bad data | PVT validation; checking scripts |
| **Flow** | Automate sims, extraction, QA; make results reproducible | Faraday Tcl/Perl automation |
| **Collaboration** | Turn a vague downstream complaint into a reproducible case and fix | Faraday cross-team handoffs |

### ROLE.3 The design flow: request to released IP

<figure class="fig"><img src="assets/fig/diagrams/flow.svg" alt="Standard-cell / ROM design flow, request to release." loading="lazy"><figcaption>Standard-cell / ROM design flow, request to release. · Original supplied circuit diagram</figcaption></figure>

| # | Step | Tools (industry examples) | Your output |
| --- | --- | --- | --- |
| 1 | **Spec**: function, drive strengths, Vt flavors, voltage/temperature range, loads and slews | Spec doc, hand calculations | Acceptance plan: what "correct" and "margin" mean |
| 2 | **Topology & sizing** | Virtuoso schematic; paper | Candidate circuit + reasoned trade-off |
| 3 | **Pre-layout simulation**: all arcs, corners, Monte Carlo | **Spectre / HSPICE / PrimeSim / FineSim** via **ADE** | Working window + testbench that detects failure |
| 4 | **Layout** (with layout engineers): cell height, rails, pin access | Virtuoso Layout | Legal layout; tell layout which nodes are sensitive |
| 5 | **DRC / LVS / extraction** | **Calibre**, Pegasus/PVS; **Quantus / StarRC** | Clean, extracted netlist |
| 6 | **Post-layout re-simulation** | Same simulators on extracted netlist | Delay/leakage/margins with real parasitics |
| 7 | **Reliability**: EM, IR, aging, noise, high-sigma | **Voltus-XFi / Totem / PrimeSim Reliability**, Solido | Violations explained and fixed |
| 8 | **Characterization** → .lib (timing, power, noise, variation) | **Liberate / SiliconSmart** | Library + QA evidence |
| 9 | **Release QA**: views agree, spot-check vs SPICE, test synthesis/route | Python/Tcl/Perl scripts, Make | Versioned, consistent release |
| 10 | **Support**: users report a problem; reproduce and fix | Scripts, STA | Root cause and regression |

For **ROM**, add: array organization (rows/columns/mux), decoder, precharge, keeper, sense path, self-timing, the **compiler** that generates every size, and verification over **code patterns** and **configurations**.

<div class="co co-core"><p class="co-t">Core memory</p>

**Spec → circuit → sim → layout → DRC/LVS/PEX → post-layout sim → reliability → characterize → QA → support. Every change loops back.**

</div>

### ROLE.4 The life of a new IP cell: the complete cycle

<div class="co co-analogy"><p class="co-t">Picture it</p>

Launching a new car model: design it, build a prototype, crash-test it at every speed (corners), get the fuel-economy rating (characterization), let a dealer test-drive it (trial integration), launch, then read the warranty claims from real drivers (silicon correlation). A failed crash test sends you back to the drawing board, not to the showroom.

</div>

<figure class="fig"><img src="assets/fig/diagrams/cellcycle.svg" alt="The life of a new IP cell: forward flow, and where each failure sends you back." loading="lazy"><figcaption>The life of a new IP cell: forward flow, and where each failure sends you back. · Original supplied circuit diagram</figcaption></figure>


A new grad lists steps. An experienced engineer describes **gates**: what must be true to move on, and **where you go back** when it isn't. Tell it like this:

> "We **start with a request and a spec**: a design team or the library roadmap needs, say, a **low-power multi-bit flop** or a **new ROM configuration**. First I pin down the **contract**: function, drive strengths, Vt flavors, **PVT and voltage range**, load/slew range, area and power targets, and the **sign-off criteria** (sigma, EM, aging life). Then I **reproduce a reference cell** in the current PDK, so I know my setup matches the team's.
>
> Next is **topology and sizing** on paper, then **pre-layout SPICE** across corners and Monte Carlo. If it **can't meet spec pre-layout**, it never will post-layout, so I **go back to topology** or **renegotiate the spec** now, while it's cheap.
>
> Then **layout, co-designed with the layout engineer**: I tell them which nodes are sensitive and which paths carry the big currents. It has to pass **DRC and LVS in context**, abutted with neighbors and fill. Then **extract and re-simulate**: if post-layout loses too much margin, that's usually **parasitics or layout-dependent effects**, so it goes **back to layout**, or to **sizing** if layout can't recover it.
>
> Then **reliability**: EM on the output and rails, IR, **aging to end of life**, noise, and **high sigma** where it's memory-like. A failure there means **layout** (vias, metal), **sizing** (drive), or a **restriction in the .lib** (max load or toggle rate).
>
> Then **characterization** into the .lib, and **library QA**: spot-check against SPICE (typically within a few percent), monotonic tables, consistency across the family, no missing arcs. QA failures usually go **back to the characterization setup** (sensitization, thresholds, criteria), not the circuit.
>
> Before release, a **trial integration**: synthesize and place-and-route a small block with the new cell, run **STA**, and confirm the **router can reach the pins**. Then **release**: versioned views, release notes, known limits.
>
> **After release**, I **support users**, and when **silicon** comes back, I **correlate**: ring oscillators and test structures vs the models. If silicon disagrees, the loop starts again: re-characterize, re-guardband, or fix the cell in the next revision."

| # | Stage | Exit gate (must be true to move on) | If it fails → go back to |
| --- | --- | --- | --- |
| 0 | **Spec & contract** | Function, PVT, targets and sign-off criteria agreed and written | — (clarify with requester) |
| 1 | **Baseline** | Reference cell reproduces the team's numbers in your setup | Fix the environment / versions first |
| 2 | **Topology & sizing** | Hand analysis says the targets are reachable | Spec renegotiation |
| 3 | **Pre-layout sim** (corners + MC) | Meets spec **with margin** for layout loss (e.g., 10–20%) | 2 (topology/sizing) |
| 4 | **Layout** (co-design) | Fits height, pitch, pin-access rules | 2 if it doesn't fit |
| 5 | **DRC / LVS in context** | Clean with neighbors and fill | 4 |
| 6 | **Extraction + post-layout sim** | Still meets spec at all corners | 4 (parasitics, LDE) or 2 (sizing) |
| 7 | **Reliability**: EM, IR, aging, noise, high sigma | All limits met at end of life | 4 (vias/metal), 2 (drive), or restrict in .lib |
| 8 | **Characterization** | Complete tables; no missing or non-physical points | Characterization setup |
| 9 | **Library QA** | Spot checks vs SPICE within tolerance; family consistency; views agree | 8, or 4/6 if the circuit is at fault |
| 10 | **Trial integration** | Synthesizes, places, routes, STA-clean; pins reachable | 4 (pin access) or 9 (models) |
| 11 | **Release** | Versioned views + release notes + known limits | — |
| 12 | **Support & silicon correlation** | Silicon matches models within guardband | Re-characterize, re-guardband, or fix in next revision |

<div class="co co-core"><p class="co-t">Core memory</p>

**Spec → baseline → topology → pre-layout (with margin) → layout → DRC/LVS in context → post-layout → reliability → characterize → QA → trial integration → release → silicon correlation. Every gate has a known "go back to."**

</div>

<div class="co co-value"><p class="co-t">Why this impresses</p>

It shows you think in **exit criteria and feedback loops**, you **fix problems at the cheapest stage** (pre-layout before layout), and you know the job **doesn't end at release**: silicon correlation closes the loop. That's how someone with a few years in the role talks.

</div>

**For a ROM, the same cycle adds:** compiler generation for every configuration, **content verification** against the code file, **worst-configuration and worst-code-pattern selection**, and **late code changes** re-entering at stage 6–9 (re-verify margin for the new code).

### ROLE.5 What a day looks like (examples; ROLE.9 shows how it changes across a year)

- **Timing regression:** "NAND2 A→Y fall got 12% slower in the new revision." Compare runs under **identical** settings first; find the cause (more internal-node capacitance, higher contact resistance); try one legal fix with layout; check the side effects.
- **ROM margin fail:** a code pattern fails at the sense time. Plot precharge, WL, BL, SAE. Starts low → precharge problem. Droops → leakage vs keeper. Too slow to fall → selected cell vs keeper/capacitance.
- **Flow bug:** "The new script reports twice the EM violations." Freeze the design, compare old vs new outputs, and find what changed in mapping, units or thresholds before assuming the design got worse.

### ROLE.6 Questions you'll face on the job (and in "how would you…" interviews)

Each row is a realistic task for this team. **Must know** = what you need to answer it in the interview. **Good to know** = what makes the answer strong.

| The situation | Must know | Good to know |
| --- | --- | --- |
| "We need a new **NAND2 X6** drive strength." | Sizing rule, input cap vs drive, which arcs to simulate, DRC/LVS → extract → re-sim → characterize | Fin quantization; pin order (late signal on the fast pin); check EM on the bigger output |
| "The flop **fails hold** at SS/cold/low VDD in the new revision." | Hold physics, why the period doesn't matter, clock slew and CLK/CLKB overlap, temperature inversion | Compare against the old revision under identical settings first; is it the circuit or the characterization criterion? |
| "The new library's **leakage is 30% higher** than last release." | Leakage is exponential in Vt and temperature; state-dependent; check units, corners, model versions | Layout-dependent effects shift Vt; run a matched comparison before blaming the circuit |
| "The **max-depth ROM** from the compiler **misreads 1s** at FF/hot." | Keeper vs (N−1)·I_off; worst code pattern; worst corner | Shorter/hierarchical bitlines; later sense costs the "1"; check the compiler's extremes, not the middle |
| "A designer says the **cell is slower in STA** than in your SPICE." | .lib = slew × load tables; interpolation vs extrapolation; sensitization; which corner | Reproduce their exact slew/load/corner; CCS vs NLDM differences; missing or wrong arc |
| "The **EM report flags the output via** of an X8 buffer." | Avg / RMS / peak; load × frequency × slew drive current; vias are the weak point | Via arrays; limit max load or toggle rate in the .lib; recheck timing after the fix |
| "**LVS fails** after a layout edit." | Shorts first, then opens, then device properties; labels and pins | Cross-probe in the results viewer; re-extract and re-simulate after the fix |
| "The **level shifter fails** at VDDL = 0.5 V." | NMOS vs cross-coupled PMOS contention; worst corner is slow N / fast P, cold | Bigger NMOS vs weaker PMOS vs a different topology; check both transitions |
| "**3% of characterization points are missing.**" | Missing ≠ zero; find why (no crossing, non-convergence, license/job failure) | Make missing results fatal; rerun only the failed points; log versions |
| "Design wants a **lower clock-pin-cap flop**." | Clock pins toggle every cycle → clock power; trade-off with clk-to-Q, setup/hold, robustness | TSPC or shared-clock (multi-bit) flops; verify variation and hold |

<div class="co co-core"><p class="co-t">Core memory</p>

**Every day-to-day question follows one pattern: reproduce under identical conditions → find the physical cause → change one thing → recheck everything the change touches.**

</div>

### ROLE.7 Who you work with

| Person | What you bring them |
| --- | --- |
| Mentor / cell lead | Options, evidence, recommendation, open risks |
| Layout engineer | Exact node/shape, failing condition, proposed physical cause |
| CAD / characterization | Minimal reproducible case, versions, expected vs actual |
| Reliability specialist | Stress condition, waveform, rule version |
| Library users (PD/STA) | Which cells/arcs are affected, impact, workaround |

### ROLE.8 What a new grad owns first

1. **Reproduce a reference cell** and its results (learn the flow).
2. Own a **bounded change**: a new drive strength, a debug, a margin check.
3. Grow to a **cell family** or a **flow improvement**, and support its users.

### ROLE.9 Across a year: what you receive, what you ship, and who it's for

<div class="co co-analogy"><p class="co-t">Picture it</p>

The library team is a **restaurant kitchen that only serves the house**: no outside customers, but every NVIDIA chip team orders from it. Some months you're **writing a new menu** (new node), most weeks you're **cooking orders** (instances, new cells), and some days you're **answering why a dish tasted off** (debug).

</div>

<div class="co co-guard"><p class="co-t">Where this comes from</p>

I have **no inside information** about NVIDIA. This is built from the JD, public NVIDIA facts, and how foundation-IP teams at large chip companies usually run. **Confirm it with Bo**: "how is your time split right now?" is itself one of the best questions you can ask (P.4b).

</div>

**Do you build IP to sell to other companies?** Almost certainly **no**. NVIDIA is a **chip and systems company**, not a cell-library vendor like Arm, Synopsys or Cadence. The team builds standard cells and ROMs **for NVIDIA's own chips**: data-center and gaming GPUs, CPUs, networking chips and automotive/robotics SoCs. Your **customers are internal chip teams** (physical design, STA, SoC integration, firmware). (NVIDIA does license some interconnect technology to partners, but that's a different group from cell libraries.)

**Or do you just keep revising the same thing?** Neither. Think of the library as **a product line that never stops shipping**. The same team switches between **six modes**, and which one dominates depends on where the node and the chips are in their life.

| Mode | What triggers it | What you receive | What you do | What you ship | Typical length |
| --- | --- | --- | --- | --- | --- |
| **1 New node / new library** | A new process is chosen for future chips | **PDK** (device models, DRC/LVS decks, design rules), a **library architecture spec** (cell height, tracks, Vt flavors, voltage/temperature corners), a target cell list | Design and size cells and the ROM bitcell/periphery, work with layout, simulate, characterize, verify | Library **alpha → beta → 1.0** releases | Months to over a year |
| **2 PDK / model updates** | Foundry moves the PDK from v0.5 → v0.9 → v1.0 | New SPICE models, changed rules | Re-simulate, re-characterize, fix newly illegal layouts, **compare old vs new** | Library revision + release notes explaining what moved | Weeks |
| **3 Chip-team requests** | A chip needs something | A **request**: "ROM, 4K words × 32 bits, this speed at SS, this voltage domain, **here's the code file**", or "we need a high-drive clock buffer / special flop / level shifter" | Generate or design it, verify with the **real code** and corners, deliver views | **Instance views**: GDS, LEF, .lib per corner, Verilog model, SPICE/CDL netlist, datasheet | Days to weeks |
| **4 Support & debug** | Downstream sees a problem | A bug report: "odd timing on this arc", "EM violation on this pin", "LVS mismatch" | Reproduce, find the root cause, fix or explain | A fix, a patched view, or an explanation | Hours to days |
| **5 Silicon correlation** | First silicon comes back | BIST results, test-chip measurements, failure analysis | Compare silicon with the models; adjust margins or models if needed | Updated models/guard-bands; lessons for the next node | Weeks |
| **6 Flow / methodology** | Something is too slow, too manual or too risky | Pain points (runtime, missed checks) | Improve scripts, characterization QA, EM/IR checks (**like Bo's intern EM-flow project**) | A better flow the whole team uses | Ongoing |

<div class="co co-core"><p class="co-t">Core memory</p>

**Inputs:** PDK + library spec (new node), or a request + code file (per chip), or a bug report. **Outputs:** not a chip, but **released, verified IP views** (GDS, LEF, .lib, Verilog, netlist, datasheet) that chip teams drop into their designs. **You see "your" silicon months later.**

</div>

**Will you get a spec?** Usually yes, but it's **often short or informal**: a requirements doc for a library, a ticket or email for a ROM instance or a new cell. A habit that makes new grads look senior: **write the spec back** ("Here's what I understood: function, drive, speed at which corner, power, pins, deadline. Correct?") before you start.

**Do you own the full flow from spec to product?** The **team** does. As a new grad you'll likely own **a piece end to end** (a cell family, a ROM verification task, a characterization/QA step, a flow script), then grow into owning a whole block or instance type. Owning a piece end to end, including release notes and support, is how you build trust.

**What a week can look like in each mode:**

| Mode | A realistic week |
| --- | --- |
| New node | Mon: review a new design-rule change with layout. Tue–Wed: size and simulate a flop family at the new corners. Thu: first characterization run; find a non-monotonic table. Fri: root-cause it (a measurement threshold), rerun, write it up. |
| Chip request | Mon: request for a ROM instance with a new firmware code file. Tue: generate it, run the worst-pattern checks. Wed: one column fails read-1 at hot/leaky; check encoding. Thu: fix, rerun all corners. Fri: deliver views + release note. |
| Support | An STA engineer reports a hold violation that only appears with the new library. You compare the two .lib versions, find the arc that moved, check the simulation behind it, and explain whether it's real. |
| Silicon | BIST shows a few failing ROM instances at low VDD. You pull the margin simulations for that configuration and compare with the measured VDD-min to see whether the model was optimistic. |

## Part ROM — The ROM team inside NVIDIA

This part answers the big-picture questions: **what ROM is for, where the team sits, how it works with other teams, what "deep submicron" changes, where the bottlenecks are, and how ROM compares with the alternatives.** It's what lets you ask smart questions and sound like you understand the job, not just the circuit. (The circuit itself is in Q12 and T1.6.)

<div class="co co-note"><p class="co-t">What&#x27;s public vs inferred</p>

NVIDIA doesn't publish how its ROM team is organized. The JD confirms **custom ROM modules in deep-submicron nodes**, "**function/feasibility verification of new ROM designs**" and "**new design flows**." Everything else below is **how ROM work is done across the industry**. Present it as "how I understand this kind of team works," and ask Bo to correct you.

</div>

### ROM.1 What ROM is for on a GPU or SoC

<div class="co co-analogy"><p class="co-t">Picture it</p>

A mask ROM is a **punch card baked into the chip**: the holes (vias present or absent) are the data. You can read it forever, but changing it means making a new card.

</div>

**Definition.** A **mask ROM** is on-chip memory whose contents are **fixed at manufacture** by the physical layout (a contact or via present or absent). It holds data that **never changes during operation**.

| Typical content | Why it lives in ROM |
| --- | --- |
| **Boot code / secure-boot root of trust** | Must exist before anything loads; **can't be altered** by software, which matters for security |
| **Microcode / firmware for on-chip controllers** | Fixed routines that run every time |
| **Constant tables** (e.g., math seed tables for reciprocal, square root or transcendental functions; coefficient tables) | Read constantly, never written: ROM is the densest, lowest-power way to store them |
| **Default configuration / fixed patterns** | Known-good values at power-up |

<div class="co co-core"><p class="co-t">Core memory</p>

**ROM = fixed data the chip needs every time: boot and security code, microcode, constant tables. Densest and lowest power, and it can't be changed by software.**

</div>

### ROM.2 Where the ROM team sits

A ROM team is usually part of a **foundation-IP / circuit-design** organization, next to the **standard-cell**, **SRAM / register-file compiler** and custom-circuit teams. It builds **ROM compilers and macros** that many chip teams use. Its customers are **internal chip teams**, not end users.

<figure class="fig"><img src="assets/fig/diagrams/romorg.svg" alt="How a ROM / foundation-IP team connects to the rest of the chip organization (green = inputs, orange = deliverables, gray = two-way)." loading="lazy"><figcaption>How a ROM / foundation-IP team connects to the rest of the chip organization (green = inputs, orange = deliverables, gray = two-way). · Original supplied circuit diagram</figcaption></figure>

### ROM.3 The ROM workflow, request to silicon

<div class="co co-analogy"><p class="co-t">Picture it</p>

A ROM compiler is a **cookie cutter plus a printing press**: one proven set of pieces (bitcell, decoder slice, sense slice) stamped out at any size, with whatever message (code) the customer hands you.

</div>

| # | Step | Who's involved | Output |
| --- | --- | --- | --- |
| 1 | **Request**: size (words × bits), speed, power, interface | Chip architecture / design team | Configuration spec |
| 2 | **Code content** arrives (hex/binary file) | Firmware, security or architecture team | The data to encode |
| 3 | **Generate** the macro from the compiler: array, decoder, precharge/keeper, sense, control | **ROM team** | Netlist + layout |
| 4 | **Functional check**: read every address, compare to the code file | ROM team (+ verification) | Content-mapping sign-off |
| 5 | **Electrical feasibility**: worst code patterns × PVT × high sigma; access time, read margins | **ROM team** (your JD line) | Margin report |
| 6 | **Physical checks**: DRC/LVS, EM/IR on wordline drivers and bitlines | ROM team + CAD | Clean macro |
| 7 | **Views**: GDS, LEF, .lib, Verilog model, datasheet | ROM team → PD/STA/DFT | Release package |
| 8 | **Integration**: placed in the chip, timed, tested (BIST / signature) | PD, STA, DFT teams | Chip-level sign-off |
| 9 | **Late code change** | Firmware → ROM team | Re-encode; with **via-programming**, often just **one metal/via mask** |
| 10 | **Silicon**: readback test and debug | Post-silicon validation | Pass, or a debug case back to ROM team |

<div class="co co-core"><p class="co-t">Core memory</p>

**Spec + code in → compiler generates the macro → verify content, then electrical margin at worst pattern/PVT/sigma → DRC/LVS/EM → views to PD/STA/DFT → late code change via one mask → silicon readback.**

</div>

### ROM.4 How the ROM team works with other teams

| Team | They give you | You give them | Typical friction |
| --- | --- | --- | --- |
| **Chip architecture / design** | Size, speed, power, interface needs | A macro that meets them, datasheet | "Can it be faster/smaller?" → access time vs density trade-off |
| **Firmware / security** | The **code content**, and late changes | Encoded ROM; turnaround time for changes | Code arriving late → why **via-programmed** ROMs matter |
| **Foundry / process & device** | PDK, device models, **design rules** | Test cases, feedback on rules | Rule changes forcing layout rework |
| **Layout & CAD** | Leaf-cell layout, compiler infrastructure, flows | Circuit intent, sensitive nodes, checks to add | Generator bugs at extreme configurations |
| **Physical design & STA** | Floorplan constraints, pin placement needs | LEF, .lib, timing that holds in context | Pin access; model accuracy |
| **DFT / test** | BIST requirements | Testable macro, signature (MISR) plan | Test time, coverage |
| **Reliability** | EM/IR/aging rules and tools | Waveforms, violations fixed | Wordline-driver EM; aging of sense circuits |
| **Post-silicon validation** | Failing readback data | Debug support, root cause | "Is it the content, timing, or margin?" |

### ROM.5 "Deep submicron": what it is and why ROM gets harder

<div class="co co-analogy"><p class="co-t">Picture it</p>

Shrinking a ROM is like **shrinking a bathtub while its drain gets weaker and its leaks get relatively bigger**. Past some size you stop making one big tub and build several small ones (hierarchical bitlines).

</div>

**What it means.** "Deep submicron" originally meant features well below 1 µm (roughly 0.25 µm and smaller). Today it's shorthand for **advanced nodes**: **FinFET** (e.g., TSMC N5/N4/N3; NVIDIA's Blackwell is on a custom 4NP process) and **gate-all-around nanosheet** (N2 and beyond).

| What changes at advanced nodes | Effect on a ROM | Why it matters |
| --- | --- | --- |
| **Leakage is larger relative to on-current** | Unselected cells leak the bitline harder | **Fewer rows per bitline**; stronger keepers or hierarchical bitlines |
| **Lower VDD** | Less overdrive, smaller bitline swing | Tighter sense margin; temperature inversion |
| **More local variation** (tiny devices) | A weak selected cell and a strong keeper can coincide | **High-sigma** verification (5–6σ) |
| **Width quantized in fins** | Bitcell is typically **one fin**; can't make it "a bit stronger" | Fix margins with architecture, not sizing |
| **Contact and via resistance up** | Slower discharge; weaker drive through the bitcell | Post-layout simulation is essential |
| **Wire RC up** (thin metals) | Long wordlines and bitlines are slow | Banking, segmentation, repeaters |
| **Restrictive layout rules / multi-patterning** | Where you can place programming vias is constrained | Regular, rule-friendly array layout; compiler must respect it |
| **EM limits tighter** | Wordline drivers and bitline currents concentrate | EM checks on the periphery |

**FinFET/GAA helps too:** better gate control means a **steeper subthreshold slope**, so **less leakage per off-cell** than a planar device at the same speed. That's one reason large ROMs stayed practical at advanced nodes.

<div class="co co-core"><p class="co-t">Core memory</p>

**Deep submicron = FinFET/GAA nodes. For ROM: more leakage vs on-current, lower VDD, more variation, 1-fin cells, higher contact/wire resistance → fewer rows per bitline, tighter sense margin, high-sigma verification.**

</div>

### ROM.6 The bottlenecks (where the hard work is)

1. **Bitline leakage vs on-current:** the **number of rows per bitline** is limited by (N−1) leaking cells vs one on-cell at fast/hot. This sets density and speed.
2. **Sense margin at low VDD:** bitline swing at the sense moment must beat the sense-circuit offset at high sigma.
3. **Access time vs density:** longer bitlines are denser but slower and leakier; shorter ones need more periphery.
4. **Verification coverage:** **code patterns × every compiler configuration × PVT × sigma** is enormous. Picking the **worst cases smartly** (max rows, max columns, worst code) is the real skill, and it's the "feasibility verification" line in the JD.
5. **Late code changes:** firmware finishes late; the ROM must absorb changes with minimal mask cost.
6. **Periphery reliability:** wordline drivers and sense circuits see the highest currents and asymmetric aging.

<div class="co co-value"><p class="co-t">Value to show</p>

"The circuit is simple; the **verification space** is the hard part. I'd want to be good at finding the **few worst cases** that cover the whole space: max-depth configurations, worst code patterns, fast/hot for leakage, slow/cold for discharge."

</div>

### ROM.7 ROM vs the alternatives

| Option | Density | Speed / power | Flexibility | Security | Best for |
| --- | --- | --- | --- | --- | --- |
| **Mask ROM** | **Highest** (1 transistor per bit, or none) | Fast reads, **lowest power**, no retention needed | **None**: a change needs a mask (one via mask if via-programmed) | **Strongest**: can't be rewritten | Stable, high-volume code and tables |
| **SRAM loaded at boot** | ~6T per bit: much larger | Fast; leaks; must be loaded from external flash first | Full: any content any time | Weaker: writable | Code that changes often |
| **OTP / eFuse** | Lower than ROM | Slow to program; small arrays | Program once, **after manufacturing** | Good | Keys, chip IDs, trimming, repair, small patches |
| **Synthesized logic (hard-coded constants)** | Poor for large tables | Fine for tiny tables | Change = re-synthesis | Good | Very small lookup tables |
| **External flash** | Off-chip | Slow access; needs interface and SRAM | Field-updatable | Weakest | Large, updatable firmware |

<div class="co co-core"><p class="co-t">Core memory</p>

**ROM wins on density, power and security; loses on flexibility. Common pattern: ROM for the fixed core (boot, tables), OTP/eFuse for small per-chip data and patches, SRAM + flash for anything that must change.**

</div>

**Inside ROM, two design choices to know:**

| Choice | Option A | Option B |
| --- | --- | --- |
| **Architecture** | **NOR ROM**: cells in parallel on the bitline → **fast**, the standard choice | **NAND ROM**: cells in series → **denser**, but slow (small stack current) |
| **Programming layer** | **Contact / via-programmed**: code change = **one late mask**, flexible | **Diffusion / implant-programmed**: densest, but a change touches early masks (costly) |

### ROM.8 ROM architectures through the generations (from diode matrix to FinFET and beyond)

<div class="co co-analogy"><p class="co-t">Picture it</p>

ROM history is **the book, not the paper**: the paper (a transistor or diode at a crossing) has barely changed since the 1960s; the printing press, binding and library catalog around it (sensing, timing, hierarchy, encoding) got reinvented every decade.

</div>

The same way the TSMC bible walked **planar → FinFET → GAA → CFET**, here is ROM's evolution. Each generation follows one pattern: **characteristic → consequence → why the industry moved on.** The driving problem throughout: **store more bits per area, read them faster, and leak less, while the transistor underneath keeps changing.**

<figure class="fig"><img src="assets/fig/diagrams/romgen.svg" alt="ROM architectures through the generations (read left→right, then snake back)." loading="lazy"><figcaption>ROM architectures through the generations (read left→right, then snake back). · Original supplied circuit diagram</figcaption></figure>

#### Gen 1 — Diode-matrix ROM (1950s–60s)

- **Characteristic:** a grid of wordlines and bitlines; a **diode at a crossing = 1**, no diode = 0. Purely passive.
- **Consequence:** dead simple, but **no gain**: the selected line must drive every diode's current directly, so it's **slow and power-hungry**, and discrete diodes are big.
- **Why move on:** integrated MOS transistors gave **gain and density** in the same process as logic.

#### Gen 2 — MOS NOR mask ROM (1970s →, still the embedded workhorse)

- **Characteristic:** **one NMOS per bit** in parallel on the bitline; programmed by **contact, diffusion or implant**.
- **Consequence:** **fast** (a single device discharges the bitline), **pattern-independent** read path, easy to build in a logic process. Cost: a **drain contact per cell pair** and **leakage from every connected cell**.
- **Why it stayed:** speed and logic-process compatibility. Most **embedded ROM compilers** today are NOR-based.

#### Gen 3 — NAND mask ROM (1980s, density-first)

- **Characteristic:** **series strings** (8–16 cells), programmed with **depletion implants** ("always on" cells).
- **Consequence:** **densest** (no contacts inside the string), low bitline leakage, but **slow** (tiny stack current, body effect) and sensitive to string length.
- **Where it went:** large standalone ROMs where density beat speed, and later the **concept** lived on in **NAND flash**.

#### Gen 4 — Dynamic, self-timed embedded ROMs (1990s–2000s, the compiler era)

- **Characteristic:** **precharged bitlines + keeper**, **column muxing**, **sense amplifiers** instead of full-swing reads, **replica/dummy-bitline self-timing**, and **via-programming in upper metal** for late code changes. Delivered by **compilers** that generate any size.
- **Consequence:** fast, scalable, and schedule-friendly. Some designs add **ECC bits and a reference column** per word for robustness and self-timing (one published high-temperature ROM used **7 ECC bits + 1 reference bit** on a 64-bit word).
- **Why it evolved further:** power and leakage became the limit.

#### Gen 5 — Low-power ROM techniques (2000s →)

| Technique | How it works | Saves | Costs |
| --- | --- | --- | --- |
| **Selective precharge** | Precharge only the columns being read | Precharge power (big: every bitline swings every cycle otherwise) | Control logic, timing |
| **Data encoding / inversion** | Store a column (or row) **inverted** if it has mostly connected cells, plus a flag bit | Leakage, bitline cap, discharge energy | Flag bits, output XOR |
| **Minimize connected cells** (choose the cheaper polarity) | Encode so "no transistor" is the majority value | Leakage and switching | Encoding step in the compiler |
| **Hierarchical / divided word- and bitlines** | Short local lines under global ones | RC, leakage, energy | Periphery area |
| **Charge sharing / charge recycling** | Reuse charge from discharged lines instead of pulling it all from VDD | Dynamic energy | Timing complexity |
| **Bank power gating** | Cut supply to idle banks | Leakage | Wake-up time |

#### Gen 6 — Density revisited: multi-level and diode bitcells

- **Multi-level cell (MLC) ROM:** store **2 bits per cell** with different transistor strengths or Vt levels, read with multiple reference levels. **Pros:** ~2× density. **Cons:** much **smaller sense margin**, sensitive to variation; hard at low VDD.
- **Diode bitcells at advanced nodes:** research at **40nm** showed a **16-Mb contact-programmed ROM with a diode bitcell** (dual-trench isolation) for very high density. **Pros:** tiny cell. **Cons:** process-specific structures, periphery complexity.

#### Gen 7 — FinFET ROM (16nm and below: today's mainstream)

- **Characteristic:** the bitcell is typically **one fin**; strict **gate pitch** and **diffusion-break** rules; programming usually by **via or contact**; **contact and local-interconnect resistance** matter.
- **Consequences:**
    - **Good:** FinFET's **steeper subthreshold slope** means **less leakage per off-cell**, easing the (N−1)·I_off problem.
    - **Bad:** you **can't size the cell up** (it's one fin), so margins are fixed by **architecture**: **hierarchical bitlines**, keeper design, sense timing, encoding.
    - **Variation** at one fin makes **high-sigma verification** mandatory.
    - **Lower VDD** and **temperature inversion** make slow/cold/low-VDD the discharge corner.

#### Gen 8 — What's next: GAA, backside power, CFET, and alternatives

| Technology | What changes for ROM | Pros | Cons / open questions |
| --- | --- | --- | --- |
| **GAA / nanosheet** (N2-class) | Gate all around; **sheet width tunable** within limits | Even better electrostatics → lower leakage; can tune **I_on/I_off** of the bitcell | New layout rules; parasitics; variability of sheets |
| **Backside power delivery** | Power rails move under the transistors | Frees front-side tracks for **bitlines/wordlines**; lower IR drop for precharge bursts | Thermal, new design rules |
| **CFET** (stacked NMOS over PMOS, roadmap) | N and P stacked vertically | Big density gains for **logic** | A ROM array is **NMOS-only**, so CFET helps the **periphery** more than the array |
| **Embedded NVM replacing ROM** (e.g., MRAM/RRAM, OTP/antifuse) | Code becomes **field-updatable** | Patchable firmware, no mask change | Process cost, endurance, retention, security |

<div class="co co-core"><p class="co-t">Core memory</p>

**Diode matrix (passive, slow) → NOR (fast, 1T/bit, the embedded standard) → NAND (densest, slow) → dynamic self-timed compiled ROMs (precharge, keeper, sense, replica, via-programming) → low-power tricks (selective precharge, data inversion, hierarchy) → MLC/diode density experiments → FinFET (1-fin cell, fix margins with architecture) → GAA/backside power next.**

</div>

<div class="co co-value"><p class="co-t">Wow line</p>

"The ROM bitcell has barely changed in decades; **what evolved is everything around it**: dynamic sensing, self-timing, hierarchy, encoding and verification. At FinFET the cell is one fin, so the **architecture is the only knob left**, and at GAA, **tunable sheet width** might give some of that knob back."

</div>

**Comparison at a glance:**

| Architecture | Speed | Density | Leakage | Programming | Best use |
| --- | --- | --- | --- | --- | --- |
| Diode matrix | Slow | Low (historic) | — | Diode present/absent | Historic |
| **NOR (dynamic, self-timed)** | **Fast** | Medium | Higher (parallel cells) | Contact/via | **Embedded ROM in logic (today)** |
| NAND | Slow | **Highest** | Lower | Depletion implant | Large, slow storage |
| MLC ROM | Medium | ~2× NOR | Medium | Multiple Vt/strengths | Density-critical, relaxed margin |
| FinFET NOR + hierarchy | Fast | Medium-high | Low per cell | Via | Advanced-node SoC/GPU ROM |

Sources: [Tekmos: The design of a masked ROM](https://www.tekmos.com/about/blog/the-design-of-a-masked-rom) · [A 40-nm 16-Mb contact-programming mask ROM using a dual-trench-isolation diode bitcell](https://www.researchgate.net/publication/282555884_A_40-nm_16-Mb_Contact-Programming_Mask_ROM_Using_Dual_Trench_Isolation_Diode_Bitcell) · [Survey of low-power techniques for ROMs](https://www.researchgate.net/publication/220847191_Survey_of_low_power_techniques_for_ROMs) · [A low-power ROM using charge recycling and charge sharing](https://www.researchgate.net/publication/2982157_A_low-power_ROM_using_charge_recycling_and_charge_sharing_techniques) · [U-M EECS 373: ROM, EPROM and EEPROM technology](https://web.eecs.umich.edu/~prabal/teaching/eecs373-f10/readings/rom-eprom-eeprom-technology.pdf)

### ROM.9 The rest of the memory family: DRAM, flash, and new memories <span class="tier t3">T3 GOOD TO KNOW</span>

<div class="co co-analogy"><p class="co-t">Picture it</p>

Memories are **ways to leave a note**: ROM is **carved in stone**, SRAM is **two people holding a pose** (lasts only while they're awake), DRAM is **a bucket with a slow leak** that you must keep refilling (refresh), and flash is **ink you can bleach, but only a page at a time and only so many times**.

</div>

**Is it worth knowing? Yes, at the comparison level, not the design level.** Nobody on a ROM team expects you to design a DRAM or a flash cell. But three things make it worth ~30 minutes:

1. **Bo can ask "why ROM and not X?"** or "how does a ROM read compare with a DRAM read?" You should answer in one breath.
2. **On a GPU, memory is the story.** HBM (stacked DRAM) and on-chip SRAM set performance; ROM, OTP and flash hold what the chip needs to boot and run. Knowing where ROM sits shows you understand the product.
3. **The circuit ideas transfer:** precharged bitlines, a reference, a sense amp, margin vs leakage/retention, multi-level cells, ECC. If you understand those in ROM, DRAM and flash are variations on the same theme.

<div class="co co-guard"><p class="co-t">One word to avoid</p>

"Flash RAM" is loose usage: **flash is non-volatile storage, not RAM** (RAM = random-access, volatile, read/write: SRAM, DRAM). Say "flash" or "NOR/NAND flash".

</div>

<figure class="fig"><img src="assets/fig/diagrams/memhier.svg" alt="Where each memory lives around a data-center GPU (simplified): on-die SRAM, ROM and OTP; HBM DRAM in the package; flash on the board and in storage." loading="lazy"><figcaption>Where each memory lives around a data-center GPU (simplified): on-die SRAM, ROM and OTP; HBM DRAM in the package; flash on the board and in storage. · Original supplied circuit diagram</figcaption></figure>

**Table 1 — Mechanism: how each one stores and reads a bit**

| Memory | Cell | Stores data as | Volatile? | Read | Write | Density | Where it lives around a GPU |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Mask ROM** | 1T (or 0T) | Transistor/via present or absent | No, **fixed** | Fast, non-destructive | Never (new mask) | Very high | Boot code, microcode, tables |
| **SRAM** | 6T/8T | Cross-coupled inverters | Yes | Fastest | Fast | Low | Register files, L1/shared, L2 caches |
| **DRAM** | **1T1C** | **Charge on a capacitor** | Yes, **leaks away → refresh** | Destructive → restore | Fast | High | **HBM** stacks next to the GPU; system memory |
| **NOR flash** | 1 floating-gate/charge-trap T, parallel | **Trapped charge shifts Vt** | No | Fast random read | Slow; erase by block | Medium | Boot/firmware chip on the board (SPI flash) |
| **NAND flash** | Series strings, 3D stacked | Trapped charge (multi-level) | No | Page read, slower | Slow, block erase, **limited endurance** | **Highest** | SSDs |
| **OTP / eFuse / antifuse** | Fuse or broken oxide | Permanent physical change | No | Fast | **Once** | Low | Keys, IDs, trims, **memory repair** |
| **MRAM / RRAM / PCM** | 1T + resistive element | Resistance (magnetic, filament, phase) | No | Fast-ish | Medium | Medium | Embedded NVM in logic nodes (MCUs, some SoCs) |

**Table 2 — Function and usage: what each one is for, and why it wins there**

| Memory | Function (its job) | Typical usage | Why it's chosen | Why not everywhere | Scale (order of magnitude) |
| --- | --- | --- | --- | --- | --- |
| **Mask ROM** | Hold **fixed** code and data forever | Boot ROM, microcode, lookup tables (math functions, coefficients), fixed configuration | Densest and lowest power **on a logic process**; tamper-proof; no loading step | Can't change after tape-out; a bug means a mask revision or a patch path | Kb to a few Mb per chip |
| **SRAM** | **Working memory** the logic reads and writes every cycle | Register files, L1/shared memory, L2 cache, buffers, FIFOs | Fastest; built in the same logic process | Big cell (6T+) → costly per bit; leaks; data lost at power-off | Up to hundreds of MB on a large GPU |
| **DRAM** | **Bulk working memory** close to the processor | HBM stacks next to the GPU; DDR/LPDDR system memory | Far denser than SRAM; high bandwidth (HBM) | Needs refresh; special process → separate die; slower than SRAM | Tens to hundreds of GB |
| **NOR flash** | Store **code** that must survive power-off and be updatable | Board-level firmware image (SPI flash), MCU code | Fast random reads (can execute in place); reliable | Low density; slow erase/write; hard to embed at advanced nodes | Mb to Gb |
| **NAND flash** | Store **large data** persistently | SSDs, phones, USB drives | Cheapest per bit; 3D stacking; multi-bit cells | Slow, block-erase, wears out; needs heavy ECC and a controller | Hundreds of GB to TB |
| **OTP / eFuse / antifuse** | Store **small per-chip data** written once after manufacturing | Security keys, chip ID, analog trims, **memory repair maps**, feature enables | Works on any logic process; permanent; unique per die | One write only; large per bit; small capacity | Bits to Kb |
| **MRAM / RRAM / PCM** | **Non-volatile memory embedded in logic** (the eFlash replacement) | Embedded code/data in MCUs and some SoCs; research for AI/in-memory compute | Non-volatile, rewritable, few extra masks, scales better than eFlash | Newer: endurance, retention, read margin and cost still being worked out | Mb range, embedded |

<div class="co co-core"><p class="co-t">Core memory</p>

**ROM = never changes. SRAM = fastest working memory. DRAM = big working memory (needs refresh). Flash = keeps data with power off (NOR for code, NAND for storage). OTP = a few permanent bits per chip. MRAM/RRAM = the new embedded non-volatile option.** On an advanced GPU die you get **SRAM + ROM + OTP**; DRAM and flash live off the die.

</div>

#### DRAM in five lines

- **Cell:** one access transistor + one capacitor. **Read:** precharge bitline to **VDD/2**, open the wordline, the cell **charge-shares** with the bitline, a cross-coupled sense amp amplifies, then **writes the value back** (the read destroyed it).
- **Refresh:** the capacitor leaks, so every row is re-read and restored periodically (standard DRAM specs refresh within tens of milliseconds [verify exact spec]).
- **Process:** deep-trench or stacked capacitors need a **special process**, which is why DRAM is a separate die (embedded DRAM exists but is rare at advanced logic nodes).
- **HBM:** DRAM dies stacked with **through-silicon vias** and a **very wide interface**, placed next to the GPU on the package (CoWoS). NVIDIA's data-center GPUs are HBM-based.
- **Link to ROM:** same precharge → wordline → small ΔV → sense-amp sequence; DRAM's signal is set by a **capacitor ratio**, ROM's by **cell current × time**.

<div class="co co-eq"><p class="co-t">DRAM signal: charge sharing</p>

**ΔV = (VDD/2) · Cs / (Cs + C_BL).** Illustrative numbers: Cs = 10 fF, C_BL = 80 fF, VDD/2 = 0.55 V → ΔV ≈ **61 mV**. **Memory trick:** "a thimble poured into a bucket": a small cell into a big bitline gives a small signal, so the sense amp does the real work. Compare with ROM: **ΔV = I_cell · t / C_BL** (a tap filling the bucket over time).

</div>

#### Flash in five lines

- **Cell:** a transistor with a **floating gate** (or charge-trap layer). Electrons stored there **raise Vt**; read = "does it turn on at the read voltage?"
- **Program/erase** need **high voltage** (tunneling or hot-carrier injection); erase is by **block**; the oxide wears → **limited endurance**, plus **retention** loss over years.
- **NOR flash:** cells in parallel (like **NOR ROM**) → fast random reads, used for **code**. **NAND flash:** series strings (like **NAND ROM**) → densest, used for **storage**; modern NAND is **3D** with hundreds of layers and 3–4 bits per cell.
- **Why no embedded flash in a leading-edge GPU:** flash needs extra masks and high-voltage devices that don't scale with FinFET logic; eFlash largely stalls around the 28nm-class nodes. **That's exactly why advanced chips use mask ROM + OTP/eFuse on-die**, and external flash on the board, with MRAM/RRAM as the emerging embedded option.
- **Link to ROM:** a flash array is essentially a **ROM whose "transistor present/absent" became "Vt high/low", electrically changeable**. MLC flash is the grown-up version of MLC ROM (ROM.8, Gen 6).

**What transfers to your job:**

| Concept | In ROM | In DRAM | In flash |
| --- | --- | --- | --- |
| Precharge + sense | Precharge VDD, SA or inverter | Precharge VDD/2, latch SA | Precharge, SA vs reference |
| Reference | Dummy/replica column | The other half-bitline at VDD/2 | Reference cell / read voltage |
| What kills margin | Leakage (N−1)·I_off, variation | Leakage (retention), Cs/C_BL ratio | Vt distribution spread, retention, disturb |
| Multi-level | MLC ROM (rare) | — | MLC/TLC/QLC (standard) |
| Protection | ECC in some designs, BIST | ECC, refresh, repair | Heavy ECC, wear leveling |

<div class="co co-value"><p class="co-t">If asked, say it in three lines</p>

"All of them read the same way: precharge, select, develop a small signal, sense against a reference. What differs is **how the bit is stored**: a via or transistor in ROM, a latch in SRAM, charge on a capacitor in DRAM, trapped charge that shifts Vt in flash. That sets the trade-off: **ROM is the densest and lowest-power on a logic process but can't change; DRAM and flash need special processes, so on an advanced GPU die you get SRAM, ROM and OTP, and DRAM/flash sit off-die.**"

</div>

### ROM.10 How to use this in the interview

- **If asked "what do you know about the role?"** (Q19–Q19b): "A ROM team builds the **compilers and macros** for fixed on-chip data, like boot and security code, microcode and constant tables, and the hard part is **proving every configuration and code pattern reads correctly** at every corner and sigma."
- **If asked "what's hard about ROM at advanced nodes?"**: bitline leakage vs on-current, low-VDD sense margin, variation at one fin, and verification coverage (ROM.5–ROM.6).
- **Good questions to ask Bo** (pick one):
    - "Is the ROM work mostly **compiler development** or **custom macros** for specific chips?"
    - "How late in a project do **code changes** usually arrive, and does via-programming absorb most of them?"
    - "What limits **rows per bitline** most in your current node: leakage, sense margin, or access time?"
    - "How do you choose the **worst-case configurations and code patterns** for feasibility verification?"

## Part NODE — Your process node & your transition


### NODE.1 What node will you work on?

**Not confirmed. Don't claim one.** Public anchors: **Blackwell** is on a custom **TSMC 4NP** (FinFET) process; **Rubin** is reported on **TSMC 3nm-class** (FinFET) ([TechSpot](https://www.techspot.com/news/105852-nvidia-blackwell-ai-successor-rubin-moves-forward-six.html)); TSMC's **N2** moves to **nanosheet (GAA)** transistors. A library team may work on current products **and** evaluate future nodes. Prepare **FinFET** cell design first, and know enough about **GAA** to ask a smart question.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Never say "I'll be working on 3nm." Ask: "At a level you can share, is the work mostly established FinFET libraries or newer device platforms? More new-node bring-up or improving existing libraries?"

</div>

### NODE.2 From where you are to where they are

| | You have | New at an advanced node |
| --- | --- | --- |
| Devices | **65nm planar** analog (WICS); 22nm flow (Faraday, not transistor-level) | **FinFET / GAA**: gate wraps the channel; **width in whole fins or sheets** |
| Sizing | Continuous W/L | **Discrete legal choices**; can't use 1.5 fins |
| Parasitics | Channel resistance dominates | **Contact and local-interconnect resistance** can dominate; M0/M1 matter |
| Layout | Custom analog layout | **Fixed cell height and gate pitch**, diffusion breaks, **pin access** |
| Variation | Corners + some MC | Tighter margins at **low VDD**; **temperature inversion** (cold is slow) |
| Reliability | Basic | **Self-heating** in fins; stricter EM at narrow metal |

### NODE.3 What to revisit, what to learn, which tools

| Revisit (you learned it; refresh) | Learn (new) | Tools to recognize |
| --- | --- | --- |
| Inverter VTC, NAND/NOR/AOI, sizing, logical effort | FinFET fin quantization, LOD/WPE | **Virtuoso + ADE** (schematic, test setup) |
| Latch/flop, setup/hold | Cell architecture: track height, pitch, pin access | **Spectre / HSPICE / PrimeSim** (simulate) |
| 6T SRAM, sense amps | NOR ROM, keeper, compilers | **Calibre** (DRC/LVS), **Quantus/StarRC** (extraction) |
| RC delay, charge sharing, power | Liberty .lib: NLDM, CCS, LVF | **Liberate / SiliconSmart** (characterize) |
| Corners vs mismatch | High-sigma methods | **Voltus-XFi / Totem** (EM/IR), **Solido** (variation) |
| Tcl/Perl/Python | Characterization QA scripts | Python/Tcl/Perl, Make, job schedulers |

<div class="co co-key"><p class="co-t">Say this if asked about readiness</p>

"My transistor-level experience is **65nm planar**, so I won't claim I've designed in your node. The fundamentals transfer: device and circuit reasoning, SPICE across PVT, and a downstream timing view. What's new for me is **legal FinFET sizing, layout and contact constraints**, and the team's **characterization and reliability flow**. I'd ramp by **reproducing a reference cell**, making one controlled change, and validating it through extraction and QA."

</div>

## Part SKILL — The skills that make someone excel in this job

You asked the right question: **what actually makes someone great at standard-cell / ROM circuit design?** It isn't research depth, and it isn't LeetCode. The job is to **produce circuits and numbers that thousands of downstream engineers trust without re-checking.** Every skill below serves that one goal.

<div class="co co-core"><p class="co-t">The one-line answer</p>

**SPICE craft plus circuit intuition is #1**: set up the *right* simulation, predict the answer before you run it, and know when a number is lying. **Variation/margin thinking** and a **verification mindset** come next. **Scripting is a multiplier**: it turns one good simulation into 10,000 good simulations, but it can't fix a bad testbench.

</div>

### SKILL.1 The ranking (and why research depth isn't on top)

<div class="co co-analogy"><p class="co-t">Picture it</p>

A great cell engineer is a **bridge inspector, not a bridge poet**: the job isn't one beautiful new design, it's certifying that every bridge holds at every load, in every weather, for twenty years, and writing it down so others can drive over it without checking.

</div>

| # | Skill | What it looks like on the job | Why it ranks here | Day-1 level needed |
| --- | --- | --- | --- | --- |
| **1** | **SPICE simulation craft** | Realistic testbenches, correct measurements, sweeps, MC, post-layout, convergence | Every deliverable is a simulated number; a wrong setup gives a confident, wrong answer | **High**; this is what they'll probe |
| **2** | **Circuit intuition / hand analysis** | Predict the result (order of magnitude, trend, which corner) *before* simulating | It's how you catch a wrong simulation and how you debug fast | **High** |
| **3** | **Variation & margin thinking** | "What's the worst case? How many sigma? Across which corners, temps, patterns?" | Memory fails in the tails; one bad cell in a million kills the chip | Medium-high |
| **4** | **Verification mindset** | Coverage matrices, regressions, "why did it pass?", sign-off checklists | IP ships to many chips; an escape costs a respin | Medium-high |
| **5** | **Scripting & automation** | Python/Tcl/shell to generate netlists, run sweeps, parse results, flag outliers | Compilers + characterization = huge run counts; nobody does this by hand | **Medium**: read, modify, write small tools |
| **6** | **Characterization / Liberty literacy** | Read a .lib, sanity-check tables, know NLDM/CCS/LVF, EM/leakage attributes | The .lib *is* your product for the digital world | Medium |
| **7** | **Layout & parasitic awareness** | Read a layout, know what the DSPF adds, spot what dominates (vias, MOL, coupling) | At FinFET/GAA, parasitics often matter as much as transistors | Medium |
| **8** | **Reliability awareness** | EM limits, IR drop, aging on sense amps and keepers | Sign-off gates; silent killers after tape-out | Medium (see T1.8) |
| **9** | **Communication & debug discipline** | Clear write-ups, fast escalation, "here's what I checked" | Flat org, many consumers; "One Team" and "Intellectual Honesty" | High |

<div class="co co-why"><p class="co-t">Why research depth ranks lower (your instinct is right)</p>

Research teaches you to go **deep on one novel thing**. This job rewards going **wide and reliable on many ordinary things**: every cell, every corner, every configuration, correct, on schedule. Your MS is valuable for **physics intuition and the ability to learn fast**, not for publishing inside the job. Say it this way: *"My research gave me the physics; what I want now is the discipline of shipping IP that thousands of engineers rely on."*

</div>

<div class="co co-value"><p class="co-t">What excellent vs average looks like</p>

**Average:** runs the simulation, reports the number. **Excellent:** predicted the number first, knows which corner and pattern is worst, checked that the testbench is realistic, automated the sweep, noticed the one outlier, and wrote two lines explaining why it's real or an artifact.

</div>

### SKILL.2 SPICE simulation craft (the #1 skill)

<div class="co co-analogy"><p class="co-t">Picture it</p>

A simulator is a **very literal genie**: it grants exactly the wish you worded, not the one you meant. An ideal input step, no load or an ideal supply is a badly worded wish.

</div>

<figure class="fig"><img src="assets/fig/diagrams/testbench.svg" alt="Anatomy of a realistic SPICE testbench: real driver, real load, real supply, measurements that match the library." loading="lazy"><figcaption>Anatomy of a realistic SPICE testbench: real driver, real load, real supply, measurements that match the library. · Original supplied circuit diagram</figcaption></figure>

**The mindset:** a simulator answers **exactly the question you asked**, not the one you meant. Most errors are in the *question* (testbench), not the *answer* (the solver).

#### 2a. Testbench realism: the five things that make a number believable

1. **Real driver, real slew.** Drive the input through an actual cell (or a PWL with the library's slew), never an ideal step. An ideal step makes every gate look fast and hides short-circuit current.
2. **Real load.** FO4 or the actual wire + fanout, including **wire RC** at advanced nodes. An unloaded output is meaningless.
3. **Real supply.** Include package/grid resistance and local decap when you care about **peak current, droop or dynamic IR** (sense amps, precharge bursts). An ideal VDD hides the problem you're supposed to find.
4. **Correct initial state.** Latches, SRAM cells, sense amps and keepers are bistable: set the state with `.ic` / `.nodeset` or a proper reset sequence, and **let it settle** before measuring.
5. **Correct extraction view.** Pre-layout for architecture; **post-layout (DSPF/SPEF) for anything you sign off.**

#### 2b. Measurements that match the library

Measurement conventions must **match the .lib's thresholds**, or your numbers won't correlate.

```spice
* delay: input 50% to output 50%
.meas tran tpd_hl TRIG v(in)  VAL='0.5*vdd' RISE=1
+                 TARG v(out) VAL='0.5*vdd' FALL=1
* output slew: 20%-80% (or 10%-90%, whatever the library uses)
.meas tran tf     TRIG v(out) VAL='0.8*vdd' FALL=1
+                 TARG v(out) VAL='0.2*vdd' FALL=1
* switching energy: integrate supply current over one event
.meas tran q_sw   INTEG i(vdd) FROM=1n TO=2n
.meas tran e_sw   PARAM='-q_sw*vdd'
* leakage: average current in a quiet window after settling
.meas tran ileak  AVG i(vdd) FROM=5n TO=6n
```

<div class="co co-guard"><p class="co-t">Measurement traps</p>

- **Wrong edge:** `RISE=1` vs `RISE=2` if the first edge is the reset glitch.
- **Sign of current:** SPICE usually reports current *into* the source's + terminal; supply current often comes out **negative**. Know your convention before reporting "negative power".
- **Window:** leakage measured before the circuit settles = a transient, not leakage.
- **Failed measure:** a `.meas` that never triggers prints "failed", and a script that doesn't check for it silently drops that corner.

</div>

#### 2c. Sweeps: one netlist, many questions

```spice
.param vdd=0.75 cl=2f slew=20p
.data loads
+ cl    slew
+ 1f    10p
+ 2f    20p
+ 4f    40p
.enddata
.tran 1p 5n SWEEP DATA=loads          $ load x slew table, like a .lib
.temp -40 25 125                      $ temperature sweep
.lib 'models.lib' tt
.alter
.lib 'models.lib' ss                  $ rerun the whole deck at SS
.param vdd=0.675                      $ with low VDD
.end
```

- **`.param`** for everything you might change; never hard-code numbers in devices.
- **`.data`** for 2-D tables (slew × load), exactly the shape of a .lib table.
- **`.alter`** reruns the deck with changes (corner, VDD, a device size).
- **Temperature matters both ways:** at advanced nodes with low VDD, **temperature inversion** can make **cold** the slow corner. Always sweep both ends.

#### 2d. Monte Carlo done right

- Use the foundry's **mismatch** (local) and **process** (global) models, and know which you turned on: **global + local** for yield, **local only** for things like sense-amp offset.
- **Seed** the run so results are reproducible; report **mean, σ, and the sample count.**
- **N matters:** 1,000 samples see about ±3σ. Memory needs ~6σ → **importance sampling / high-sigma tools** (T1.11), not brute force.
- Check the distribution **shape**: a long tail or two humps means a nonlinear failure mechanism, and a Gaussian extrapolation will lie.

#### 2e. Convergence and accuracy vs runtime

| Symptom | Likely cause | First fixes |
| --- | --- | --- |
| DC op point won't converge | Bistable node, floating node, huge device ratios | `.nodeset` the state; check for floating gates/nodes; gmin stepping |
| "Timestep too small" | Sharp edges, ideal switches, discontinuous models | Give sources finite rise times; check for zero-R loops; relax, don't over-tighten |
| Results change with tstep | Under-resolved edges | Tighten max step / accuracy option until the number stops moving |
| Runs forever | Too tight tolerances, huge post-layout netlist | Loosen where it doesn't matter; reduce the DSPF or simulate only the critical path |

<div class="co co-eq"><p class="co-t">The accuracy rule</p>

**A number isn't real until it stops changing** when you tighten the timestep or tolerance. Do this check once per new testbench, then fix the settings.

</div>

#### 2f. Recipes you should be able to set up cold

| Task | Setup | What you report |
| --- | --- | --- |
| **Cell delay/slew table** | Driver → cell → load, `.data` slew × load, all arcs, all corners | 2-D tables per arc, rise/fall |
| **Leakage per state** | Hold inputs static per state, settle, measure `i(vdd)` (or `.op`) | Leakage per input vector per corner; **log-temp** trend |
| **Setup/hold time** | Sweep data-to-clock offset; find where clk→Q **pushes out by X%** (often 10%) or fails; **bisection** instead of a fine sweep | Setup/hold per slew pair |
| **Butterfly / SNM** | DC sweep each half-cell, overlay the curves, largest inscribed square | Read/hold SNM at corners, with MC |
| **Sense-amp offset** | MC with local mismatch; sweep input differential until the output flips | σ of offset → required ΔV at 6σ |
| **ROM read margin** | Worst code pattern (all other cells on for leakage), slow corner, low VDD; measure ΔV at SAE; also the **read-1 hold** with leakage vs keeper | ΔV_read-0 and droop_read-1 with margin |
| **Keeper sizing** | Sweep keeper width; plot read-0 delay vs read-1 droop | The window where both pass, with margin |
| **Peak current / EM** | Real supply, simultaneous switching, measure peak/avg/RMS per branch | Currents per wire/via vs EM limits |

**Bisection for setup time**, the idea (HSPICE-style; syntax varies by simulator):

```spice
.param tsu = opt1(100p, 0, 300p)            $ search range
.meas tran dq TRIG v(clk) VAL='0.5*vdd' RISE=2
+             TARG v(q)   VAL='0.5*vdd' RISE=1
.meas tran pushout PARAM='dq/dq_nominal'
.tran 1p 3n SWEEP OPTIMIZE=opt1 RESULTS=pushout MODEL=bis
.model bis OPT METHOD=BISECTION              $ stop where pushout crosses 1.1
```

Why it matters: a fine sweep might take 100 runs per point; bisection takes ~10. Multiply by arcs × slews × corners and it's the difference between hours and days. **That's the "minimal compute" instinct from the forum question (Q10).**

#### 2g. Post-layout simulation

- Replace the schematic netlist with the **extracted netlist** (DSPF with R and C), keeping the same testbench. HSPICE and Spectre both have ways to back-annotate a DSPF onto the schematic hierarchy; the concept is identical.
- **Compare pre vs post** for the same measurement. A 10–30% delay pushout is normal at advanced nodes [verify for the node]; a 3× change means an extraction or connectivity problem, or a real layout issue.
- Look for **what dominates**: via/contact resistance, long local wires, coupling to a switching neighbor.

#### 2h. Reading results like an expert (the sanity checklist)

1. **Monotonic?** Delay should rise with load and with input slew. A dip means a measurement or convergence problem.
2. **Right corner ordering?** SS slower than TT slower than FF (watch temperature inversion).
3. **Rise vs fall plausible?** Big asymmetry → check P/N ratio or a wrong edge.
4. **Currents make sense?** Look at `i(vdd)` for crowbar current and unexpected DC paths.
5. **Waveforms, not just numbers.** Open the waveform for the worst case; glitches, ringing or a node that never fully swings show up there, not in a `.meas`.
6. **Compare to hand estimate** (SKILL.3). If you're off by 10×, stop and find out why.

<div class="co co-guard"><p class="co-t">Top 10 SPICE mistakes (each one has caused a respin somewhere)</p>

1 Ideal input step · 2 No load · 3 Ideal supply for a peak-current question · 4 Bistable node not initialized · 5 Measured before settling · 6 Thresholds don't match the .lib · 7 A failed `.meas` silently dropped · 8 Wrong model corner or missing mismatch flag · 9 Timestep too coarse to resolve the edge · 10 Pre-layout numbers used for sign-off.

</div>

### SKILL.3 Circuit intuition: predict before you simulate

<div class="co co-analogy"><p class="co-t">Picture it</p>

Estimating before simulating is **checking the restaurant bill in your head**: you don't need the exact total, but if it says $900 for two coffees, you know something's wrong before you pay.

</div>

**Habit:** before every run, write down **the number you expect, the trend, and the worst corner.** If the simulation disagrees, either your understanding or the testbench is wrong, and both are worth knowing.

The four formulas that cover 80% of estimates:

```latex
t \approx \frac{C\,\Delta V}{I} \qquad \tau = RC \qquad P_{dyn} = \alpha C V^2 f \qquad I_{leak,BL} \approx (N-1)\,I_{off}
```

**Worked example (ROM bitline, the kind of estimate to do out loud):**

- Bitline C ≈ **50 fF** (assumed for the example), needed swing ΔV ≈ **100 mV**, cell current ≈ **10 µA**.
- Time to develop the signal: t = C·ΔV / I = 50e-15 × 0.1 / 10e-6 = **0.5 ns**.
- Now **halve the cell current** (slow corner, low VDD): **1 ns**. Double the rows (C doubles): **1 ns** again. Do both: **2 ns**. That's why long bitlines at SS/low-VDD are the ROM's critical case, and why hierarchy helps.
- Leakage check for read-1: 255 off-cells × **1 nA** ≈ **0.26 µA** leaking, against a keeper that must supply that without fighting the 10 µA read-0 too hard. **Ratio I_on / ((N−1)·I_off) ≈ 40** here: comfortable. At a hot, leaky corner with 10 nA per cell it drops to **~4**: now the keeper design matters.

<div class="co co-value"><p class="co-t">Say this in the interview</p>

"Before I simulate, I estimate with C·ΔV/I and the leakage ratio, so I know which corner should be worst. If the simulation disagrees with my estimate by a lot, I debug the testbench before I believe the circuit."

</div>

**Trends you should know without simulating:**

| Change | Delay | Leakage | Dynamic power |
| --- | --- | --- | --- |
| VDD ↓ 10% | ↑ (more at low VDD, near Vt) | ↓ (DIBL) | ↓ ~19% (V²) |
| Temp ↑ | ↑ at high VDD; can **↓** at low VDD (temperature inversion) | **↑ exponentially** | ~ |
| Higher-Vt device | ↑ | **↓ a lot** | ~ |
| Longer channel (Lg bias) | ↑ slightly | ↓ | ~ |
| Stack of 2 off devices | — | **↓ several ×** (stack effect) | — |
| Wider device | ↓ own delay, ↑ load on the previous stage | ↑ | ↑ |

### SKILL.4 Variation & margin thinking

- **Ask the three questions** for any circuit: *What's the worst corner? What's the worst pattern/state? How many sigma does it need?*
- **Global vs local:** corners handle global shifts; **mismatch** kills matched pairs (sense amps, SRAM cells, replica timing).
- **Margin has to be allocated:** e.g., sense margin = ΔV developed − (SA offset at 6σ) − noise/coupling − aging shift. **Write the budget as a sum.**
- **Aging eats margin asymmetrically:** a sense amp that always resolves the same way ages one side (T2 aging section).
- **Replica timing is a margin tool:** it tracks global PVT, but **not** local mismatch, so the local part still needs margin.

<div class="co co-eq"><p class="co-t">The margin budget (write it on the whiteboard)</p>

**ΔV_available ≥ V_offset(6σ) + V_noise + V_aging + guard-band.** If it doesn't close: longer SAE delay, shorter bitlines (hierarchy), stronger cell, or a better sense amp.

</div>

### SKILL.5 Verification mindset

The job isn't "make it work once"; it's **"prove it works everywhere it will be used."**

| Axis | Typical coverage |
| --- | --- |
| Process corners | TT, SS, FF, SF, FS (plus SSG/FFG variants per foundry) |
| Voltage | min / nominal / max, plus overdrive and retention modes |
| Temperature | cold (−40 °C) / room / hot (125 °C) |
| Configuration | smallest, largest, and odd shapes (compilers!) |
| Data | worst code patterns: all-0, all-1, checkerboard, max-leakage columns |
| Parasitics | pre- and post-layout, RC-worst/C-worst extraction corners |
| Reliability | EM, IR, aging (end-of-life models) |
| Variation | MC and high-sigma for bitcells and sense amps |

Habits:

- **"Why did it pass?"** is as important as "why did it fail?" A pass at a corner you expected to be tight but wasn't often means a broken testbench.
- **Regressions:** rerun the full suite after every change; compare to the previous release, and investigate **any** shift above a threshold.
- **Golden references:** compare your characterized numbers to an independent path (a different simulator setting, a hand-built testbench, or silicon data).
- **Checklist before release:** DRC/LVS/ERC clean, post-layout sims, EM/IR, characterization QA, views consistent (.lib, LEF, GDS, Verilog), release notes.

### SKILL.6 Scripting & automation (a multiplier, not the core)

<div class="co co-analogy"><p class="co-t">Picture it</p>

Scripting is a **dishwasher**: it doesn't cook, and it can't fix a bad recipe, but no professional kitchen washes 10,000 plates by hand.

</div>

**What "good enough" means for a new grad:** you can **read** an existing flow script, **modify** it (add a corner, a measurement, a check), and **write** a small tool from scratch (parse results, compare, flag outliers). Not algorithms puzzles.

| Language | Where you'll meet it | What to know |
| --- | --- | --- |
| **Python** | Netlist generation, result parsing, comparing releases, plots | Files, regex, dicts, loops, f-strings, `subprocess`, pandas basics |
| **Tcl** | EDA tools (characterization, layout, P&R, extraction) | Variables, `foreach`, `proc`, reading tool docs |
| **Shell** | Launching jobs, grid/farm submission, file wrangling | `grep`, `sed`, `awk`, loops, pipes |
| **Perl** | Legacy flows (still common) | Read it; don't need to write it |
| **SKILL** (Cadence) | Layout/schematic automation in Virtuoso | Awareness only |

**The 4 scripts a cell/ROM engineer writes most often:**

1. **Template → netlists:** fill a SPICE template with corner/VDD/temp/load and write N decks.
2. **Launch and track:** submit to the compute farm, detect failures, rerun.
3. **Parse and tabulate:** read every `.mt0`/log, collect measurements, **flag missing/failed ones**.
4. **Compare and flag:** new vs previous release (or vs spec); report outliers above X%.

```python
# Script 4 in 12 lines: flag cells whose delay moved > 5% vs last release
import csv
def load(path):
    with open(path) as f:
        return {(r['cell'], r['arc'], r['corner']): float(r['delay_ps'])
                for r in csv.DictReader(f)}
old, new = load('rel_prev.csv'), load('rel_new.csv')
for key in sorted(new):
    if key not in old:
        print('NEW   ', key); continue
    d = (new[key] - old[key]) / old[key]
    if abs(d) > 0.05:
        print(f'MOVED {key} {old[key]:.1f} -> {new[key]:.1f} ps ({d:+.1%})')
for key in sorted(set(old) - set(new)):
    print('MISSING', key)          # missing is often worse than moved
```

More drills (by hand, no AI tools) are in **CODE.1** at the end.

<div class="co co-value"><p class="co-t">How to talk about coding if asked</p>

"I use Python and shell to automate sweeps and parse results; I'm strongest at the parts that touch circuits: generating netlists, collecting measurements, and flagging outliers. I'd ramp quickly on the team's Tcl/characterization flow." Honest, specific, and it points back to the circuits.

</div>

### SKILL.7 Characterization and Liberty literacy

You should be able to **open a .lib and sanity-check it in two minutes.**

```text
cell (NAND2_X1) {
  area : 0.12 ;
  cell_leakage_power : 1.8 ;
  leakage_power () { when : "!A & !B" ; value : 0.9 ; }   /* per state */
  pin (ZN) {
    direction : output ;
    function : "!(A & B)" ;
    timing () {
      related_pin : "A" ;
      timing_sense : negative_unate ;
      cell_fall (delay_template_7x7) {
        index_1 ("0.005, 0.01, 0.02, ...") ;   /* input transition (ns) */
        index_2 ("0.0005, 0.001, 0.002, ...") ; /* output load (pF) */
        values ("...", "...", ...) ;
      }
    }
  }
}
```

**The two-minute check:**

- **Units** in the header (ns/ps, pF/fF, nW/pW) match what you expect.
- **Tables monotonic** in both slew and load; no negative delays (negative **setup/hold** can be legitimate).
- **Function and unateness** correct (a NAND is negative-unate).
- **Leakage per state** exists for every state that matters, and **stacked states leak less**.
- **Corners ordered** sensibly across SS/TT/FF libraries.
- **Advanced models present** where required: **CCS** (current waveforms) or **LVF** (sigma tables for variation), **EM** attributes.

<div class="co co-why"><p class="co-t">Why this matters to the ROM team</p>

A ROM compiler emits a **.lib per instance**. If one configuration's table is non-monotonic or its setup is wrong, STA on the GPU is wrong for every chip using that instance. **The .lib is the product the digital world sees.**

</div>

### SKILL.8 Layout and parasitic awareness

- **Read a layout** well enough to find the critical path, the bitline, the supply straps, and the via stacks.
- **Know what dominates at FinFET/GAA:** **contact/via resistance and middle-of-line (MOL)** often rival the transistor; **coupling cap** between tight-pitch bitlines matters for sensing.
- **Layout-dependent effects:** distance to diffusion breaks, well proximity, and neighboring patterns shift Vt and current; matched pairs need matched surroundings.
- **Talk to the layout engineer early:** "these two devices must be matched; this bitline must be shielded; this supply needs a double via."

### SKILL.9 Reliability awareness (short; the deep version is T1.8)

- **EM:** average (DC), RMS (heating) and peak limits per wire/via; worst on **supply straps and bitline precharge paths**; via arrays fix most problems.
- **IR:** static vs dynamic; precharge bursts and wide wordline decoders are the ROM's peak-current events.
- **Aging:** NBTI/PBTI/HCI shift Vt over life; check **end-of-life** corners for sense amps, keepers and replica timing.

### SKILL.10 Communication and debug discipline

**The debug loop that makes seniors trust you:**

1. **Reproduce** with the smallest testbench.
2. **Isolate** one variable at a time (corner, VDD, pattern, pre vs post-layout).
3. **Hypothesize with physics**, then test the hypothesis with one targeted simulation.
4. **Fix and prove it** at the failing case **and** everywhere else (no regressions).
5. **Write it down** in five lines: what failed, where, root cause, fix, evidence.

<div class="co co-value"><p class="co-t">The five-line finding (use this format for every issue)</p>

**What:** read-1 fails at SS/0.675 V/125 °C on the 512-row config. **Where:** column with 511 connected cells. **Why:** leakage 511 × I_off exceeds the keeper. **Fix:** column inversion encoding (or a split bitline). **Evidence:** droop goes from 180 mV to 40 mV; all other corners unchanged.

</div>

This format is **Intellectual Honesty + One Team** in practice: anyone can check your work.

### SKILL.11 How to show these skills in 45 minutes

| Skill | Signal you can give | Where it comes from |
| --- | --- | --- |
| SPICE craft | Mention realistic drivers/loads, measurement thresholds, MC, post-layout | Your WICS and course-chip work (RD.1, RD.3) |
| Intuition | Estimate out loud before answering (C·ΔV/I, leakage ratio) | SKILL.3 example |
| Variation | Always name the worst corner **and** the worst pattern | T1.11, SKILL.4 |
| Verification | "Why did it pass?", regressions, checklists | Faraday DFT/STA (RD.2) |
| Scripting | Name a concrete automation you did; offer to ramp on Tcl | Honest, specific |
| Communication | Answer in the five-line shape | SKILL.10 |

<div class="co co-guard"><p class="co-t">Don&#x27;t overclaim</p>

Say what you **did** and what you **know**, and say "I haven't done X in production, but here's how I'd approach it" for the rest. That sentence, followed by a correct approach, scores higher than a bluff.

</div>

## Part Q — First-round rehearsal: the 21 most likely questions, answered

Ordered the way Friday is likely to run. Each answer has **bold keywords** to hit, one **core memory** line to remember if the wording escapes you, and **follow-ups** Bo is likely to add. Say them out loud; don't memorize word for word.

### Opening & résumé

#### Q1. "Tell me about yourself." <span class="tier rd">RÉSUMÉ</span>

**30-second version** (if he's clearly in a hurry, as in the July 2026 report):

> I'm a Michigan MS grad in ICs and VLSI with a materials-science background. I've worked on both sides of a cell library: in the WICS lab I designed **ultra-low-power analog front-end blocks in TSMC 65nm** and validated them **across PVT**, and at Faraday I owned **chip-top DFT and STA on a 22nm tapeout**, where I was a **user of standard-cell libraries**. This role is where those meet, so I'm excited to go deep on it.

**75-second version:** add the origin (from Vietnam, came to Michigan for engineering), the device side (materials → why transistors leak and vary), the Tcl/Perl automation at Faraday, and one human line (founded the Vietnamese student association, 3 → 90+ members).

<div class="co co-core"><p class="co-t">Core memory</p>

**Device physics → circuit design (WICS) → library user (Faraday) → this role builds the library.**

</div>

- **Follow-up: "Have you designed a production cell library?"** "No. My direct experience is **transistor-level analog design** and the **implementation flow that consumes libraries**. I can walk you through how I'd design, simulate and characterize a cell right now." Then do it.

#### Q2. "Walk me through your most relevant project." (WICS) <span class="tier rd">RÉSUMÉ</span>

> In Prof. Wentzloff's WICS lab I designed circuit blocks for a **fully implantable auditory prosthesis**: a **transimpedance amplifier** and an **active-RC filter** for the low-noise front end between the MEMS sensor and the ASIC, in **TSMC 65nm** with flip-chip packaging. The constraint was **power**: it's an implant, so I biased devices in **subthreshold**, where **gm/Id is highest**. The challenge was keeping **stability and noise** acceptable **across PVT corners**, because in subthreshold the current is **exponential in Vt**, so a small process or temperature shift moves everything. [verify: the corner that broke, what you changed, the number you hit.]

<div class="co co-core"><p class="co-t">Core memory</p>

**Objective → my blocks → one decision → how I checked it → result.** Subthreshold = max gm/Id, but exponential sensitivity to Vt and temperature.

</div>

- **Bridge to the role:** "That's the same physics that makes **low-voltage cells and ROM reads** hard: leakage, variation and temperature near threshold."
- Full 3-deep defense: **Part RD.1**.

#### Q3. "What did you do at Faraday? Tell me about a timing violation you fixed." <span class="tier rd">RÉSUMÉ</span>

> Quick framing of scope: on a **UMC 22nm shuttle**, my lane was **chip-top DFT and STA checks** and the **handoffs**: scan, **MBIST** integration, ATPG and ATE patterns, and **PrimeTime** timing debug, with fixes recommended to the physical-design team. I automated the check chain in **Tcl/Perl/Csh**. We taped out on the **1.5-month schedule**, and I got a **top-10% rating**. For a violation: find the failing path, decide **setup or hold**, trace the cause (**logic depth, weak drive, a constraint error**), recommend the least invasive fix (**resize, buffer, or fix the constraint**), and re-run all corners to make sure it didn't break a neighbor.

<div class="co co-value"><p class="co-t">Value to show</p>

"Every delay PrimeTime showed me came from the **.lib tables** this team builds. I've been the customer. I know what a wrong library costs downstream."

</div>

### Fundamentals (the questions actually reported)

#### Q4. "What is hold time?" (reported Jun 2025) <span class="tier t1">T1</span>

<div class="co co-analogy"><p class="co-t">Picture it</p>

Setup and hold are a **photographer's shutter**: the subject (data) must be still a moment **before** the click (setup) and a moment **after** (hold). Taking photos less often (a slower clock) doesn't help if someone jumps into the frame right at the click.

</div>

<figure class="fig"><img src="assets/fig/diagrams/timing.svg" alt="Setup and hold window around the capturing edge, and clock-to-Q." loading="lazy"><figcaption>Setup and hold window around the capturing edge, and clock-to-Q. · Original supplied circuit diagram</figcaption></figure>

> **Hold time** is the minimum time the data input must stay **stable after the capturing clock edge**, so the flop reliably captures the **old** value. A **hold violation** means **new data arrives too early**, through a path that's too fast, and corrupts the value being captured. **Setup time** is the mirror image: data must be stable **before** the edge.
>
> The key difference: the **hold check compares launch and capture on the same clock edge**, so the **clock period doesn't appear**. That's why you **can't fix hold by slowing the clock**. You fix it by **adding delay to the short data path** (buffers or slower cells), **reducing clock skew**, or using a flop with a smaller hold requirement. Setup, by contrast, gets better with a longer period.

<div class="co co-eq"><p class="co-t">Hold and setup slack (S = capture clock arrival − launch clock arrival)</p>

```latex
\text{Setup slack} = T + S - t_{cq,max} - t_{pd,max} - t_{setup}
\qquad
\text{Hold slack} = t_{cq,min} + t_{cd,min} - S - t_{hold}
```
**Remember:** setup races the **next** edge (T is in it); hold protects the **same** edge (no T). **Later capture clock (S > 0) helps setup, hurts hold.**

</div>

<div class="co co-core"><p class="co-t">Core memory</p>

**Setup = old data arrives in time. Hold = new data stays away long enough. Period only helps setup.**

</div>

- **Follow-up: "Where does hold come from inside the flop?"** In a TG master–slave flop, the master's input gate closes a little **after** the clock edge (clock buffering, CLK/CLKB overlap). Data changing inside that window can leak through (Q7).
- **Follow-up: "Can setup or hold be negative?"** Yes. They're measured at the **external pins**. If the internal clock is delayed relative to data, data can arrive after the edge and still be captured (negative setup), and vice versa.

#### Q5. "Size CMOS gates at 2:1 and 1:1." (reported) <span class="tier t1">T1</span>

<figure class="fig"><img src="assets/fig/diagrams/gates.svg" alt="NAND2 and NOR2 with widths at the 2:1 mobility ratio (inverter = N1, P2)." loading="lazy"><figcaption>NAND2 and NOR2 with widths at the 2:1 mobility ratio (inverter = N1, P2). · Original supplied circuit diagram</figcaption></figure>

**The rule:** match each gate's **worst-case pull-up and pull-down resistance** to a reference inverter. **Series** transistors add resistance, so each must be **wider** (× number in series). **Parallel** transistors are sized for **one** conducting (worst case).

"2:1" = PMOS is **2× weaker** than NMOS (hole mobility ≈ ½ electron mobility; classic planar). "1:1" = equal strength (closer to modern FinFETs, where PMOS is strained and nearly as strong).

| Gate | NMOS (each) | PMOS at **2:1** | PMOS at **1:1** | Logical effort g (2:1) |
| --- | --- | --- | --- | --- |
| Inverter | 1 | 2 | 1 | 1 |
| NAND2 | **2** (2 in series) | **2** (parallel) | 1 | 4/3 |
| NAND3 | 3 | 2 | 1 | 5/3 |
| NOR2 | 1 (parallel) | **4** (2 in series) | 2 | 5/3 |
| NOR3 | 1 | 6 | 3 | 7/3 |
| AOI21 (Y = !(AB + C)) | A, B = 2; C = 1 | A, B, C = 4 | A, B, C = 2 | A, B: 6/3 = 2 · C: 5/3 |

<div class="co co-core"><p class="co-t">Core memory</p>

**Series → multiply width by the stack count. Parallel → size for one. 2:1 means PMOS doubles.**

</div>

- **Follow-up: "Which is better, NAND or NOR?"** **NAND**: its slow PMOS are in **parallel**, and its series stack is **NMOS**, which is fast. NOR puts PMOS in series, so they must be huge: more area, more input capacitance (logical effort 5/3 vs 4/3). That's why libraries are **NAND-heavy** and NOR3+ is avoided.
- **Follow-up: "At FinFET nodes?"** Widths are **quantized in fins**, so you choose legal fin counts (you can't use 1.5 fins) and compare the options in SPICE.

#### Q6. "Draw the stick diagram of a NAND2." (reported) <span class="tier t1">T1</span>

<figure class="fig"><img src="assets/fig/diagrams/stick.svg" alt="NAND2 stick diagram with Euler order A–B: one unbroken strip per diffusion." loading="lazy"><figcaption>NAND2 stick diagram with Euler order A–B: one unbroken strip per diffusion. · Original supplied circuit diagram</figcaption></figure>

**How to draw any stick diagram (5 steps):**

1. **Rails:** VDD (metal) along the top, GND (metal) along the bottom.
2. **Diffusion:** a **p-diffusion** strip near VDD (PMOS), an **n-diffusion** strip near GND (NMOS).
3. **Poly:** one **vertical poly line per input**, crossing **both** strips. Every crossing is a transistor.
4. **Order the inputs with an Euler path:** find one input order that traces **every edge of both the pull-up and the pull-down graph once**. Then each diffusion strip is **unbroken**: shared source/drain, smallest area.
5. **Contacts and metal:** connect the diffusion between/around the gates to VDD, GND or the output as the schematic says; tie the output from p-diff to n-diff with metal.

**NAND2 with order A–B:** PMOS strip = **VDD | A | Y | B | VDD** (two PMOS in parallel share the output contact in the middle). NMOS strip = **Y | A | x | B | GND** (series: the middle node x has no contact).

<div class="co co-core"><p class="co-t">Core memory</p>

**Rails outside, diffusion inside, one poly per input, Euler path for unbroken diffusion, output metal from p to n.**

</div>

- **Follow-up: "AOI21?"** Pull-down: (A series B) ∥ C. Pull-up: (A ∥ B) series C. Order **A–B–C** is an Euler path in both, so one unbroken strip each.
- **Color convention (if drawing in color):** green = n-diffusion, yellow/brown = p-diffusion, red = poly, blue = metal, X = contact.

#### Q7. "Draw a transistor-level latch and a D flip-flop." (reported) <span class="tier t1">T1</span>

<figure class="fig"><img src="assets/fig/diagrams/latch.svg" alt="Static transmission-gate latch (transparent when CLK = 1)." loading="lazy"><figcaption>Static transmission-gate latch (transparent when CLK = 1). · Original supplied circuit diagram</figcaption></figure>

<figure class="fig"><img src="assets/fig/diagrams/dff.svg" alt="Positive-edge master–slave D flip-flop built from two TG latches." loading="lazy"><figcaption>Positive-edge master–slave D flip-flop built from two TG latches. · Original supplied circuit diagram</figcaption></figure>

> **Latch (level-sensitive):** a **transmission gate** (TG) feeds an inverter pair. When the clock enables the input TG, the latch is **transparent**: Q follows D. When the clock flips, the input TG turns **off** and a **feedback TG** turns **on**, closing the loop, so the inverters **hold** the value.
>
> **Positive-edge D flip-flop = two latches back to back (master–slave).** The **master is transparent when CLK is low**, the **slave when CLK is high**. On the **rising edge** the master closes and holds D, and the slave opens and passes it to Q. So Q only changes at the rising edge.

<div class="co co-core"><p class="co-t">Core memory</p>

**Latch = TG in + two inverters + TG feedback. DFF = master (open on CLK low) + slave (open on CLK high). Captures at the rising edge.**

</div>

- **Where setup comes from:** D must get through the master's input TG and inverter and settle the master loop **before** the edge closes it.
- **Where hold comes from:** the master's input TG doesn't close instantly (clock buffer delay, CLK/CLKB overlap), so D must stay put a little **after** the edge.
- **Clk-to-Q:** slave TG + output inverter delay.
- **Follow-up: "Why use TGs instead of single NMOS pass gates?"** An NMOS passes a **weak 1** (VDD − Vt); a TG passes **both levels fully**.

#### Q8. "Why is PMOS slower than NMOS?" <span class="tier t1">T1</span>

> Holes have **lower mobility** than electrons, roughly **half** in silicon, so a same-size PMOS carries less current and has higher resistance. That's why the textbook inverter uses **Wp ≈ 2 Wn** to balance rise and fall. At advanced FinFET nodes, **strain engineering** (e.g., SiGe in PMOS) closes much of the gap, so the ratio is closer to 1:1, and you use the actual models.

<div class="co co-core"><p class="co-t">Core memory</p>

**Hole mobility ≈ ½ electron → PMOS ≈ 2× wider for equal drive (planar). FinFET strain narrows the gap.**

</div>

#### Q9. "How would you reduce power? Timing and power optimization for low power." (reported) <span class="tier t1">T1</span>

> First **separate the three components**: **dynamic switching** (αCV²f), **short-circuit** (both networks on during a slow edge), and **leakage** (static). Then attack each:

| Lever | Cuts | Costs |
| --- | --- | --- |
| **Lower VDD** | Dynamic ∝ V² (−10% V ≈ −19% dynamic) | Speed; smaller margins |
| **Clock gating** | Dynamic (stops clock toggling in idle logic) | ICG area, enable timing |
| **Reduce activity / glitches** | Dynamic | Logic changes |
| **Smaller cells off the critical path** | Dynamic + leakage (less C and width) | Delay on that path |
| **Sharp input slews** | Short-circuit | Upstream drive |
| **High-Vt cells off the critical path** | Leakage (exponential) | Slower |
| **Longer channel length variants** | Leakage | Area, speed |
| **Stacking / input-vector control** | Leakage (stack effect) | Design effort |
| **Power gating (header/footer switch)** | Leakage when idle | Wake-up time, IR drop, state loss (needs retention) |
| **Body biasing / DVFS** | Leakage or dynamic, adaptively | Complexity |

> The rule: **optimize the critical path for speed and everything else for power.** Use LVT only where timing needs it, and HVT everywhere else.

<div class="co co-core"><p class="co-t">Core memory</p>

**Dynamic = αCV²f. Leakage is exponential in Vt. Speed where it matters, low power everywhere else.**

</div>

- **"What's a footer cell?"** An NMOS power switch between the logic's virtual ground and real ground; turning it off cuts leakage (header = PMOS switch on VDD).

### The practical "daily task" problem (reported Jul 2026)

#### Q10. "How would you characterize the leakage of a standard-cell library with minimal compute?" <span class="tier t1">T1</span>

<div class="co co-analogy"><p class="co-t">Picture it</p>

Leakage is a **photo, not a video**: you need one DC snapshot per input state, not a movie of the cell switching. That's why it's cheap if you set it up right.

</div>

This is the closest thing to a real NVIDIA question for this role. **Clarify first, then give a plan.**

> **First, I'd clarify the deliverable:** state-dependent leakage for the .lib (a value per input state, plus a default), at which **PVT corners**, for how many cells and Vt flavors, and at what accuracy.
>
> **Then the key insight: leakage is a DC quantity.** I don't need transient simulations at all. For each cell and each **input state**, one **DC operating-point solve** gives the supply current. That's orders of magnitude cheaper than timing characterization.
>
> **Plan, cheapest first:**
>
> 1. **Enumerate the states:** a combinational cell has 2ⁿ input vectors; a sequential cell also needs its **internal state** (Q = 0/1) and clock level. **Stack effect** makes leakage strongly state-dependent, so states matter.
> 2. **Batch, don't launch:** put **many cells and states in one netlist**, or use parameter sweeps (`.alter` / `.data`), so model loading and license and job overhead happen once, not thousands of times.
> 3. **Reuse proven equivalences only:** drive-strength variants (X1/X2/X4) are often parallel copies, so leakage scales with width. **Characterize one fully and spot-check** the others rather than assuming. Symmetric inputs can share results **only if the layout is symmetric**.
> 4. **Be smart about corners:** leakage is exponential in temperature and Vt, so **worst case is fast/hot/high-voltage**. Run the corners the library actually requires. If intermediate temperatures are needed, interpolate in the **log domain**, validated on a sample.
> 5. **A device-level shortcut (propose, then validate):** most leakage comes from **off transistors**. Characterize each device type's off-current once per corner, then **compute** cell leakage per state from which devices are off (and in what stack). Validate against SPICE on a representative sample; use SPICE for the outliers.
> 6. **QA automatically:** flag leakage that **doesn't rise with temperature**, **X2 ≠ ~2× X1**, stacked states that leak **more** than single-off states, missing or zero values, and big changes from the previous library.
>
> **Pre- vs post-layout:** leakage is DC, so parasitic capacitance doesn't matter, but **layout-dependent effects** (stress, well proximity) shift Vt. So final numbers should come from the extracted netlist with those effects; pre-layout is fine for exploration.

<div class="co co-core"><p class="co-t">Core memory</p>

**Clarify → leakage is DC (op-point, not transient) → enumerate states → batch → reuse only proven equivalences → worst = FF/hot → validate shortcuts → automated QA.**

</div>

<div class="co co-value"><p class="co-t">Value to show</p>

Engineering judgment about **compute cost** and **correctness at the same time**, plus automation (your Faraday strength). This question tests how you'd actually work, so structure beats trivia.

</div>

### Memory

#### Q11. "Draw a 6T SRAM cell. How do read and write work?" <span class="tier t1">T1</span>

<figure class="fig"><img src="assets/fig/diagrams/sram.svg" alt="6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG)." loading="lazy"><figcaption>6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG). · Original supplied circuit diagram</figcaption></figure>

> Two **cross-coupled inverters** store the bit on Q and QB. Two **NMOS access transistors (pass gates)**, gated by the **wordline**, connect Q to **BL** and QB to **BLB**.
>
> **Read:** precharge both bitlines high, raise WL. The side storing 0 discharges its bitline through **access + pull-down** in series. The **sense amp** fires once there's ~100–200 mV difference. **Danger:** the 0 node bumps up (voltage divider); if it crosses the other inverter's trip point, the cell **flips** (**read disturb**). So **pull-down must be stronger than access**.
>
> **Write:** drive one bitline to 0, raise WL. The **access transistor must overpower the pull-up** holding the node high. So **access must be stronger than pull-up**.

<div class="co co-core"><p class="co-t">Core memory</p>

**Read must not flip; write must flip. PD > PG > PU.**

</div>

- **"How does a sense amp work?"** A **cross-coupled latch** with an enable (SAE). Its two sides start balanced on the bitline difference; when SAE fires, **positive feedback** amplifies that small difference to a full 0/1. The bitline swing at SAE must beat the **sense-amp offset** (from mismatch).
- Deeper: T1.4.

#### Q12. "How does a ROM read work? What does the keeper do?" <span class="tier t1">T1</span>

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

rom: the original referenced asset was not included in the supplied source bundle. 

</div>

> In a **NOR ROM**, each bit is one NMOS on the bitline, programmed by whether its **contact/via exists**. Precharge the bitline high, raise one wordline. **Connected** cell → bitline **discharges** (reads 0). **Not connected** → bitline **stays high** (reads 1).
>
> The **keeper** is a weak PMOS holding the bitline high against **leakage**. It creates **two opposite failure modes**:
>
> - **Reading a 1:** all the other connected cells on the bitline **leak** it down. A keeper that's **too weak** gives a **false 0**.
> - **Reading a 0:** the one selected cell must discharge the bitline **against the keeper**. A keeper that's **too strong** gives a **late or missing 0**.

<div class="co co-core"><p class="co-t">Core memory</p>

**The keeper saves the 1 and fights the 0. Check both, at the worst code pattern and corner.**

</div>

- **"How many rows per bitline?"** Limited by (N−1) off-cells' leakage vs one on-cell's current, worst at **fast/hot**. Fix with **hierarchical (shorter) bitlines**, low-leakage cells, or a better keeper/sensing scheme.
- **"Why does the code (data) matter?"** It decides how many cells connect, which sets **leakage and bitline capacitance**. Verify the **worst pattern**, not a random one.

#### Q12b. "What is a ROM?" (answer it like an engineer talking to an engineer) <span class="tier t1">T1</span>

<div class="co co-analogy"><p class="co-t">Picture it</p>

Think of a **printed book**: the paper and binding (the array) are trivial; the hard part is making sure **every page is readable in every lighting condition** (corner), for **every edition size** (configuration), whatever text is printed (code pattern).

</div>

The trap: a junior answers with the **definition**. An experienced engineer answers with **what it is physically, where the design problem actually is, and how you prove it works**. Answer in three layers and **let Bo pull you deeper**.

**Layer 1: the one-liner (5 seconds).**

> "Non-volatile, read-only memory whose data is **fixed at manufacture by the layout itself**: a bit is a transistor that is or isn't connected to the bitline."

**Layer 2: the engineer's answer (60–90 seconds). This is the default.**

> "Physically, a mask ROM is an **array of single transistors**. In the usual **NOR organization**, each cell's gate is a wordline and its drain either **has a contact or via to the bitline or doesn't**, so the data is literally the **presence or absence of one via**. That makes it the **densest and lowest-power** on-chip storage, and since software can't change it, it's where you put **boot and security code, microcode and constant tables**.
>
> But the bitcell is the easy part. **The design problem is the periphery and the margins.** A read is a **precharged, single-ended bitline**: one selected cell has to pull it down **against a keeper**, while every other connected cell on that bitline is **leaking it the same way** when you're trying to read a 1. So the key trade-offs are **rows per bitline versus leakage and speed, keeper strength, and when to fire the sense**, all at the worst corner, which is fast/hot for leakage and slow/cold at low VDD for discharge.
>
> And because a **compiler** generates every size for every chip, with **whatever code the firmware team hands you**, the real job is **verification**: proving that **every configuration and every code pattern** reads correctly at every corner, out to high sigma. That's the 'feasibility verification' in your job description."

<div class="co co-core"><p class="co-t">Core memory</p>

**"A bit is a via that's there or not. The cell is trivial; the design is the periphery; the job is verification across every size, code pattern, corner and sigma."**

</div>

**Layer 3: the "wow" details (use one or two, only when he engages).**

| Say this | Why it lands |
| --- | --- |
| "**The data is part of the circuit.** A column with many connected cells has **more leakage and more bitline junction capacitance**, so the ROM's speed and margin **depend on the code**. The worst case for reading a 1 is a column where **every other cell is connected**." | Shows you understand ROM is **data-dependent**, which most candidates miss |
| "Some ROMs **encode the data per column**, e.g., **store the inverse** when a column is mostly connected cells, with a flag bit, to **cut worst-case leakage and capacitance**." | A real design optimization; shows you think about architecture, not just the cell |
| "Adjacent rows typically **share a drain contact**, so one contact serves two cells. That's part of why NOR ROM is so dense." | Layout-level awareness |
| "**Via-programmed** ROMs put the code in an upper via layer, so a **late firmware change costs one mask**, not a full re-spin. **Diffusion- or implant-programmed** ROMs are denser, but changes hit early masks." | Connects circuit choice to **schedule and cost**, a senior-engineer concern |
| "Bitline length is set by **(N−1)·I_off vs I_on at fast/hot**. At advanced nodes the fix is **hierarchical bitlines** (short local bitlines + a global one) rather than a bigger cell, since the cell is **one fin**." | Shows the **deep-submicron** constraint and the architectural fix |
| "Sensing is often **single-ended** (a skewed inverter or domino-style stage), timed by a **replica or dummy bitline** that tracks PVT. Replica tracks **global** variation, not the **local** mismatch of the one cell being read, so you still need sigma margin." | Timing + variation nuance |
| "**Test is easy in one way:** the contents are known, so BIST reads every address and compresses it into a **MISR signature** to compare against the expected one." | Links to your **MBIST** experience |
| "There's a **security angle**: via-programmed bits can be read optically by delayering the chip, which is one reason **implant-programmed** ROMs exist for sensitive code." | Unexpected, thoughtful. Use only if the conversation goes there |
| "The figures of merit I'd track: **bits/µm², access time, energy per read, leakage per bit, and rows per bitline** at the worst corner." | Sounds like someone who has owned a macro |

**How to deliver it.**

1. Give **Layer 1**, then go straight into **Layer 2** without being asked. That's the answer.
2. End with an **offer**: "I can draw the column and walk through the read margin if that helps."
3. Use **one** Layer-3 detail **per follow-up**, not all at once. Wow comes from **precision when pushed**, not from reciting everything.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Don't claim you've **built** a ROM compiler or used column-inversion encoding. Say "**one technique I've read about** is…" or "**my understanding** is…". Depth with honesty beats depth with a false claim, especially at NVIDIA.

</div>

#### Q12c. "What is a standard cell?" (same layered approach) <span class="tier t1">T1</span>

**Layer 1:**

> "A pre-designed, pre-characterized logic or storage block, like an inverter, NAND or flop, at a **fixed height**, so place-and-route can **tile them in rows**."

**Layer 2 (default):**

> "A standard cell is really a **contract**, not just a circuit. It's a **transistor-level design**, a **layout** that abuts cleanly with its neighbors (**fixed track height, shared power rails, legal pin access**), and a set of **views that must all agree**: the schematic, GDS, the **LEF** for place-and-route, the **Verilog** model, and the **.lib** that synthesis and STA trust for timing, power and noise. Each function comes in a **family**: several **drive strengths** and **Vt flavors**, so the tools can trade speed against leakage path by path.
>
> The design work is **transistor sizing and topology** against **delay, power, leakage, area and input capacitance**, then **characterizing** it across slew, load and PVT, and checking **EM, aging and variation**. The part people underestimate is that **a cell is only as good as its .lib**: if the model is optimistic, silicon fails what STA passed."

**Layer 3 ("wow" follow-ups):**

- "**Pin access is a first-class metric** at advanced nodes. A fast cell the router can't reach is useless. NVIDIA Research has published on automated cell layout for routability (**NVCell**)."
- "At FinFET nodes **width is quantized in fins**, so a family's drive strengths are really **fin-count choices**, and the **track height** sets how many fins fit. That's the core density-vs-drive trade."
- "**Flops dominate clock power**: they toggle every cycle through the clock pin, so **clock-pin capacitance** is one of the most valuable things to shave in a library."
- "**Multi-Vt** lets tools put LVT only on critical paths. The library's job is to make those swaps **footprint-compatible** so they're free for the router."

<div class="co co-core"><p class="co-t">Core memory</p>

**"A standard cell is a contract: circuit + layout + LEF + Verilog + .lib that all agree. A cell is only as good as its .lib."**

</div>

### EM / IR (Bo's turf)

#### Q13. "What's the difference between EM and IR? How do you know about it?" <span class="tier t1">T1</span>

> **IR drop** is **voltage lost now**: current through the resistance of the power grid and wires means the cell sees less than VDD, so it's **slower** and margins shrink. **Electromigration** is **damage over lifetime**: high current density pushes metal atoms along a wire or via until it **voids (opens) or forms hillocks (shorts)**. IR is a **performance** problem today; EM is a **reliability** problem after years.
>
> **How I learned it:** I first dug into EM/IR while **helping a friend prepare for a CAD EM/IR interview at Apple**. That was self-study, not signoff experience. Since then I've connected it to cell design: the **current waveform** through each wire and via, **average vs RMS vs peak** limits, and what a fix costs in timing and area.

<div class="co co-core"><p class="co-t">Core memory</p>

**IR = voltage now (speed). EM = metal wear-out over years (reliability). Both start from the real current path.**

</div>

<div class="co co-guard"><p class="co-t">Guardrail</p>

Only use the Apple-friend story if it's true, and say it plainly as learning. Never imply you worked at Apple or used its tools. Then **prove it with reasoning** (T1.8): Black's equation, avg/RMS/peak, where cells fail, how fixes trade off.

</div>

- **"What would you check first on an EM violation?"** Which **wire/via**, which **metric** (avg/RMS/peak), what **frequency, load and temperature** were assumed. Confirm it's a real stress, not a setup or mapping error, then fix the **cause**: more vias, wider metal, lower drive, or limiting the load/frequency the cell is allowed.
- **"Can average current be zero and still fail?"** Yes. A **signal wire** carries current both ways: average ≈ 0, but **RMS (heating)** and **peak** are not.

### Classic calculations

#### Q14. "RC charging: how long to reach 50%? 90%?" <span class="tier t1">T1</span>

<div class="co co-eq"><p class="co-t">RC step response</p>

```latex
V(t) = V_{DD}\,(1 - e^{-t/RC}) \qquad t_{50\%} = 0.69\,RC \qquad t_{63\%} = RC \qquad t_{90\%} = 2.3\,RC
```
**Remember:** "0.7 to half, 1 to 63, 2.3 to 90." From 10% to 90% ≈ **2.2 RC**.

</div>

- **Charge sharing** (a classic, also asked at NVIDIA): a node of 10 fF at VDD connects to 5 fF at 0 V. Charge is conserved: V = VDD × 10/(10+5) = **0.67 VDD**. It can falsely flip a dynamic node.
- **Series capacitors:** same **charge** on each; voltages split **inversely** to capacitance.

### Physical verification

#### Q15. "DRC and LVS are clean. Is the cell done?" <span class="tier t1">T1</span>

> No. **DRC** only says the layout is **manufacturable** (geometry rules). **LVS** only says it's **the circuit I intended** (connectivity and devices). I still need **extracted (post-layout) simulation** for timing, power and margins; **EM/IR** and reliability checks; **characterization** into the .lib; and a check that **all the views agree** (schematic, layout, LEF, .lib, Verilog) and that the **router can reach the pins**.

<div class="co co-core"><p class="co-t">Core memory</p>

**DRC = legal shape. LVS = right circuit. Neither = works, fast enough, or reliable.**

</div>

### Behavioral (expect 1–2)

#### Q16. "Tell me about a tough deadline." <span class="tier rd">RÉSUMÉ</span>

> At Faraday I owned chip-top DFT and STA for a **22nm shuttle** on a **1.5-month schedule**. I **triaged** which checks actually gated tapeout, and built **Tcl/Perl automation** so the repeatable checks ran themselves, which kept my time for real problems like timing violations. We taped out on schedule, and I got a **top-10% rating**. **Lesson:** under a hard deadline, prioritize ruthlessly and automate the repeatable part.

#### Q17. "Tell me about a mistake." <span class="tier rd">RÉSUMÉ</span>

> During my move from the PhD track to the master's, I **took on too much** (research, teaching 400+ students, consulting) and my grades slipped. The real mistake was **not flagging it or cutting scope early**; I tried to grind through quietly. I fixed how I manage commitments, recovered that term, and finished strong. Now I **raise problems early**. [Better, if you have one: a **technical** miss you caught, e.g., a corner you hadn't simulated, and the check you added so it wouldn't recur.]

<div class="co co-value"><p class="co-t">Value to show</p>

NVIDIA's value **Intellectual Honesty: "learn from mistakes, share learnings."** Own it in two sentences, then the fix.

</div>

#### Q18. "Tell me about a disagreement or teamwork across groups." <span class="tier rd">RÉSUMÉ</span>

> At Faraday the flow crossed **synthesis, physical design and verification**, split between **Taiwan and Vietnam**. My checks sat in the middle, so I made every handoff explicit: what was checked, what was open, what I needed back. [Or the implant **chip-platform disagreement**: I stopped arguing and asked for their reasoning, found their real constraint, and reframed my proposal to de-risk it.] **Lesson:** most conflicts are an unspoken constraint; listen for it.

### Motivation & close

#### Q19. "Why NVIDIA? Why this role?" <span class="tier t1">T1</span>

> Everyone at the leading edge uses the same foundry process. The **standard-cell and memory libraries** are one of the few places a design company can get **more out of that same process** than its competitors. And every cell is used **billions of times** on chips where **power is the limit**, so a small gain in a flop's power or area is a real gain for the product. I want to work on that layer, and NVIDIA is where it matters most.

#### Q19b. "Why the ROM team?" (and "standard cells or ROM?") <span class="tier t1">T1</span>

> Honestly, I'm excited about both, for different reasons. **ROM** appeals to me because it's where the physics is most exposed: a ROM read is a **small-signal sensing problem with leakage fighting you**, and "feasibility verification" means proving that **every code pattern, every size the compiler can make, at every corner** still reads correctly. That's the kind of margin and verification work I did with PVT validation near threshold, and it uses my analog instincts directly. **Standard cells** appeal to me because of the **leverage**: one flop design gets used billions of times. I'd be happy on either side, and I'd like to learn both.

- **If he says the seat is mostly ROM:** "Great. The bitline-leakage-versus-keeper trade-off and compiler verification are what I'd want to get good at first."
- **If mostly standard cells:** "Great. Flops and level shifters are where I'd want to go deep: that's where the timing and low-voltage margins live."

<div class="co co-guard"><p class="co-t">Guardrail</p>

Don't pick one so strongly that you sound disappointed by the other. Ask him which way the opening leans (Part P.4, question 1).

</div>

<div class="co co-value"><p class="co-t">Why a ROM team exists at NVIDIA (the one-liner)</p>

Every chip needs **fixed on-chip data**: boot code, firmware and microcode, constant tables. A **custom ROM** is **denser, faster and lower-power** than storing it in SRAM or logic, and a compiler lets every chip team generate the exact size it needs.

</div>


#### Q19c. "Why are you a good fit for this role?" <span class="tier t1">T1</span>

> Three reasons. **First, I understand the device under the cell.** Materials science and near-threshold analog design taught me why transistors **leak, vary and slow down cold at low voltage**, which is exactly what decides a cell's or a ROM's margin. **Second, I've been the library's customer.** At Faraday I signed off a **22nm chip in PrimeTime**, where every delay came from the .lib, and I integrated **MBIST** for the memories, so I know what users need from a library: **accurate models and testable memories**. **Third, I verify and automate.** I validated my WICS blocks **across every PVT corner**, and I built **Tcl/Perl automation** for the Faraday checks. That's the "feasibility verification" and "new flows" part of your job description. What I'm still building is production cell and ROM design itself, and I learn fastest by doing.

<div class="co co-core"><p class="co-t">Core memory</p>

**Device physics underneath + library customer downstream + verify-and-automate habit. Name the one gap honestly, then show you're closing it.**

</div>

<div class="co co-value"><p class="co-t">Map it to the job description (if he asks for specifics)</p>

| JD asks for | Your evidence |
| --- | --- |
| Deep-submicron process issues | Materials BS; leakage and variation near threshold |
| SPICE, adapt to new tools | Virtuoso/SPICE across PVT (WICS) |
| Margin, variation simulations | Corner validation of the TIA/filter |
| DRC/LVS debug | NTT block-level DRC/LVS |
| Scripting, automation | Tcl/Perl/Csh flows at Faraday |
| Teamwork, communication | Taiwan–Vietnam handoffs; GSI for 400+ students |

</div>

#### Q19d. "Why go from analog design to a ROM team?" <span class="tier t1">T1</span>

> Because a ROM is **much more analog than it looks**. The stored bit is trivial, but the **read path is an analog problem**: one selected cell has to **pull a precharged bitline down against a keeper**, while **hundreds of unselected cells leak** it the other way, and the **sense circuit** has to decide correctly at the right moment, at the **worst corner and code pattern**. That's the same thinking I used on the implant front end: **small signals, tight margins, subthreshold leakage, and checking every PVT corner**, not just typical. What changes is scale: my analog block was **one instance**; a ROM compiler generates **every size, for every chip**. I want that leverage, and I'd bring an analog designer's paranoia about margins to it.

<div class="co co-core"><p class="co-t">Core memory</p>

**"A ROM read is an analog problem in a digital box": keeper vs leakage vs sense timing. Same margin thinking as my subthreshold front end, at far bigger scale.**

</div>

- **If pushed "but you've never designed memory":** "True. I've been close to it: MBIST integration and NTT SRAM-block integration. And I can walk you through a ROM column's read margin right now." Then draw Q12.
- **Same logic for standard cells:** "A flop's setup time is a race between two analog paths; a level shifter is a contention problem." (Part D2.1)

#### Q19e. "You started a PhD. Why did you leave, and why did your research change?" <span class="tier rd">RÉSUMÉ</span>

**Why you'll get it:** your résumé shows a doctoral fellowship, an MS, and research that moved from an **RF receiver** (mixer-first, 2023) to an **implant front end** (2024–25). A circuit engineer will read that as "is he committed to design?" Answer calmly, briefly, and forward.

> I started on the **PhD track in Prof. Wentzloff's WICS lab**, working on **ultra-low-power circuits**. My research moved from a **low-power RF receiver** to the **analog front end of an implantable auditory device**, which followed the lab's projects and pulled me deeper into **subthreshold design and margin work**. Over time I realized what I enjoy most is **designing circuits that ship**, where the result is used by a whole product, rather than spending five more years narrowing onto one research question. So I **completed my MS** and moved toward industry circuit design. The research wasn't a detour. It's where I learned to **design for margin across PVT and reason from device physics**, which is exactly what cell and ROM design needs.

<div class="co co-core"><p class="co-t">Core memory</p>

**PhD track → research moved from RF to implant front end (followed the work, went deeper into low-power margins) → realized I want circuits that ship → completed the MS → industry circuit design. Not a detour: it's where the margin thinking comes from.**

</div>

- **"Why not finish the PhD?"** "A PhD rewards going very deep on one question for years. I want to **build and ship circuits** that many designs depend on. Once I was sure of that, finishing the MS and moving to industry was the honest choice, not momentum."
- **"Why did your topic change from RF to the implant?"** [verify: the real reason, e.g., funding or project needs in the lab, or your interest in the medical front end.] Frame: "It **followed the lab's projects**, and it moved me toward the part I liked most: **low-power analog margins**."
- **"How did your advisor take it?"** "It was an honest conversation, and we're on good terms. He saw that my strengths are **hands-on and applied**, and that I'd do well in industry."
- **"Would you go back?"** "No. I'm building an industry career in circuit design."

<div class="co co-guard"><p class="co-t">Guardrails</p>

1. **Never say "I have a PhD."** Say "I started on the PhD track and **completed my MS**."
2. Never "burned out," "lost interest," or anything negative about the lab, the research or your advisor.
3. Don't make **consulting** the reason you left, and don't imply it only started afterward (the dates overlap).
4. Keep it to **~45 seconds**, then stop. Let him ask more if he wants.
5. Bring up the grad-school overload/probation **only if he asks** about grades (Part A2, C3).

</div>

#### Q20. "Do you have questions for me?"

See **Part P.4** and the insider questions in **P.4b**. Ask two: **what a new grad owns first**, and **the transition from 65nm to your node**. If EM came up, ask about his EM flow work.

#### Q21. "Write a SPICE measurement / a quick script." (reported: "Coding (SPICE/Python)") <span class="tier t1">T1</span>

```text
* 50%-to-50% falling delay, input rising (VDD = 0.8 V)
.meas tran tphl TRIG v(in)  VAL=0.4 RISE=1
+               TARG v(out) VAL=0.4 FALL=1
* 20%-80% output rise slew
.meas tran trise TRIG v(out) VAL=0.16 RISE=1
+                TARG v(out) VAL=0.64 RISE=1
* leakage: hold one input state, let it settle, average supply current
.meas tran ileak AVG i(vdd) FROM=5n TO=6n
* (or a pure DC operating point per state: .op, then read i(vdd))
```

```python
# parse measured delays; missing = failure, never zero
import re, sys
vals = {}
for line in open(sys.argv[1]):
    m = re.match(r"\s*(\w+)\s*=\s*([-\d.eE+]+)", line)
    if m: vals[m[1]] = float(m[2])
for k in ["tphl", "trise"]:
    if k not in vals: sys.exit(f"MISSING {k}")  # fail loudly
print(vals)
```

<div class="co co-core"><p class="co-t">Core memory</p>

**Say the thresholds out loud (50% for delay, 20–80% for slew). A missing measurement is a failure, not a zero.**

</div>

## Part X — Expert question bank (engineer to engineer)

The complete **life of a new IP cell** (stages, gates, fail-back loops) is in **ROLE.4**; read it first.

Bo won't ask "what is a MOSFET." He'll ask **design questions and scenarios**, the way two engineers talk. Each answer below gives the **short answer first** (say it in the first 15 seconds), then the **depth**, then **one "wow" line** to use only if he pushes. For "how would you…" questions, use the same frame every time:

<div class="co co-core"><p class="co-t">The expert frame for any scenario</p>

**1. Clarify the spec and the failure. 2. Name the physical mechanism. 3. Give the trade-off (what the fix costs). 4. Say how you'd verify it: which sim, which corner, which sigma.**

</div>

### X.1 Custom ROM & memory array design

#### X1.1 "Compare NOR-type and NAND-type ROM arrays."

<div class="co co-analogy"><p class="co-t">Picture it</p>

NOR vs NAND ROM is **a row of parallel doors vs a hallway of doors in series**: parallel doors let you out fast through any one; a series hallway saves space but you must pass every door to get through.

</div>

<figure class="fig"><img src="assets/fig/diagrams/norvsnand.svg" alt="NOR ROM (parallel cells, fast) vs NAND ROM (series string, dense)." loading="lazy"><figcaption>NOR ROM (parallel cells, fast) vs NAND ROM (series string, dense). · Original supplied circuit diagram</figcaption></figure>


**Short answer:** "**NOR is fast; NAND is dense.** NOR puts every cell in **parallel** on the bitline, so a read is **one transistor pulling down**. NAND puts cells in a **series string**, which saves contacts and area but makes the read current tiny, so it's **slow**."

| | **NOR ROM** | **NAND ROM** |
| --- | --- | --- |
| Structure | One transistor per bit from bitline to ground; gate = wordline | 8–16 transistors in series between bitline and ground |
| Read | Raise **one** WL; a connected cell discharges the BL | **All unselected WLs high**, selected WL **low**; the string conducts only if the selected cell is "always on" |
| Programming | Contact/via present or absent | Selected cells made **always-on** (depletion implant or a shorting layer) |
| Speed | **Fast**: single-device pull-down; pattern-independent path | **Slow**: series stack, small current, body effect; worse with longer strings |
| Density | Lower: needs a drain contact per cell (shared by two rows) | **Higher**: no contacts inside the string |
| Leakage | **High**: all connected cells leak onto the BL | Lower: a string is a series stack |
| Layout | Simple and regular | Needs the programming implant/layer; string length vs speed |
| Used for | **Speed-critical** on-chip ROM (the usual choice in logic processes) | **Density-critical**, slower storage |

<div class="co co-value"><p class="co-t">Wow line</p>

"In a logic process, NOR usually wins because **access time and compatibility with standard logic layers** matter more than the last bit of density. And in NOR, the **worst-case read-1 is data-dependent**: the more connected cells on a column, the more leakage."

</div>

#### X1.2 "How do you physically program a mask ROM bit? Via/contact vs Vt-implant, and the cycle-time impact."

<div class="co co-analogy"><p class="co-t">Picture it</p>

Via programming is **writing the message on the last page of the book**: easy to reprint late. Implant programming is **writing it into the paper itself**: harder to read, but a change means making the paper again.

</div>

**Short answer:** "The bit is set by **one mask layer**. **Contact/via programming** decides whether the cell's drain connects to the bitline; **Vt-implant programming** makes some cells high-Vt so they never turn on. The big difference is **where that mask sits in the process**, which sets **how long a code change takes**."

| | **Contact / via-programmed** | **Vt-implant (or diffusion) programmed** |
| --- | --- | --- |
| How a "1"/"0" is made | Contact or via **present or absent** between drain and bitline | Every cell is connected; selected cells get an extra **implant → very high Vt** (never conducts at read) |
| Mask position | **Back end** (contact or an upper via layer) | **Front end** (early implant masks) |
| Code-change cycle time | **Short**: wafers can be run through front-end steps and **held ("banked")**, then finished with the new via mask | **Long**: the change is near the start of the flow, so most of the **multi-month** fab cycle repeats |
| Density | Slightly lower (programming via must fit rules) | **Densest** (uniform array, no programming via) |
| Security | Bits can be read by **delayering and imaging** the via layer | **Harder to read** optically (implant is invisible in a normal image) |
| Leakage/variation | Unconnected cells don't load the bitline | All cells connect → more junction capacitance; high-Vt cells still leak slightly |

<div class="co co-value"><p class="co-t">Wow line</p>

"If firmware is still changing late in the project, I'd push for **upper-via programming**: the code change becomes **one late mask on banked wafers** instead of a front-end restart. For **security-sensitive boot code**, implant programming is harder to reverse-engineer. It's a **schedule-vs-security** trade, not just density."

</div>

#### X1.3 "Draw and explain the ROM read timing. How do you design precharge and the decoder to minimize access time?"

<figure class="fig"><img src="assets/fig/diagrams/romtiming.svg" alt="ROM read cycle: precharge releases, wordline fires, bitline develops, replica-timed SAE captures, then WL off and precharge restores." loading="lazy"><figcaption>ROM read cycle: precharge releases, wordline fires, bitline develops, replica-timed SAE captures, then WL off and precharge restores. · Original supplied circuit diagram</figcaption></figure>

**Short answer:** "**Precharge off → wordline on → bitline develops → sense enable → latch → wordline off → precharge on.** Access time is **decode + wordline RC + bitline development + sense**, so I attack the biggest term first."

**The sequence (and the two rules):**

1. CLK edge latches the address; **precharge turns off** (PCH_b high).
2. **Decoder** fires one wordline. **Rule 1: precharge must be off before WL rises**, or you get crowbar current and a fight on the bitline.
3. **Bitline develops**: falls for a connected cell, droops slightly (leakage) for an unconnected one.
4. **SAE** fires, timed by a **replica/dummy bitline** so it tracks PVT; output latches.
5. **WL falls, then precharge restores the bitline.** **Rule 2: WL must be off before precharge turns on.**

**Precharge design:**

- **Size the precharge PMOS** to restore the full bitline within the precharge window: roughly t ≈ C_BL·ΔV / I_pch. It sets **cycle time**, not access time.
- **Keeper separate from precharge:** precharge is strong and brief; the keeper is weak and on during evaluate.
- Keep the **precharge clock non-overlapping** with WL; watch the **simultaneous-precharge current burst** (all bitlines at once) for **IR/EM**; stagger by bank if needed.

**Decoder design (minimize access time):**

- **Predecode** (2→4 or 3→8) + a final NAND per row: splits a big fan-in into cheap stages.
- **Size the path by logical effort**: the WL driver sees (columns × gate cap + wire), so the chain from address to WL uses ~FO4 stages.
- **Wordline RC** grows with **length²**: put the decoder **in the middle** and drive both halves, or **segment the wordline** (global/local WL).
- Speed-critical gates can be **skewed** (favor the rising WL edge).

<div class="co co-value"><p class="co-t">Wow line</p>

"I'd **break the access time into its terms** from a post-layout sim of the **largest configuration**: decode, WL RC to the far cell, BL development, SAE. The fix is different for each: logical effort for decode, **segmentation for WL RC, hierarchical bitlines for BL development**."

</div>

#### X1.4 "What sense amplifier would you use for a dense ROM bitline? How do you handle mismatch?"

**Short answer:** "A NOR ROM column has **one bitline, no complement**, so it's **single-ended**. For density I'd use **short local bitlines with a simple single-ended stage** (a skewed inverter or domino-style sense). If speed matters, a **latch-type sense amp against a reference bitline**, which gives differential-style sensing with small swing."

| Option | Pros | Cons | Use when |
| --- | --- | --- | --- |
| **Single-ended (skewed inverter / domino)** | Tiny, fits the column pitch, robust | Needs **large swing** → slower; sensitive to leakage and noise | Dense, lower-speed ROM; short local BLs |
| **Latch SA vs reference bitline** (dummy column producing a mid-level reference) | **Small swing → fast**, lower energy | Area; needs a good reference; **offset** matters | Speed-critical ROM |
| **Fully differential (two cells per bit)** | Most robust margin | **2× array area** | Rare: critical or very low-voltage cases |

**Mismatch mitigation:**

- **Bigger input devices**: offset σ ∝ 1/√(WL) (Pelgrom), at the cost of area and bitline load.
- **Symmetric, common-centroid layout** and identical routing on both inputs.
- **Budget swing for offset**: fire SAE when swing > offset at **5–6σ**; the **replica timing** margin must include it.
- **Pre-amplify or offset-cancel** (auto-zero) if the swing budget is too tight.
- **Aging:** a ROM's data never changes, so **some sense amps read the same value for years** → **asymmetric NBTI** → offset drifts. Check **aged offset**, and precharge/equalize both sides to balance stress.

<div class="co co-value"><p class="co-t">Wow line</p>

"In a ROM the offset problem gets worse **over life**: fixed data means **fixed asymmetric stress** on each sense amp. I'd sign off the offset **after aging**, not just fresh."

</div>

### X.2 Deep-submicron (FinFET / GAA) physics & scaling

#### X2.1 "How do you counteract DIBL and gate-oxide tunneling when scaling cells to 3nm/2nm?"

**Short answer:** "Mostly the **device** handles it: **FinFET and GAA** give the gate multi-sided control, which cuts **DIBL**; **high-k metal gate** keeps the physical oxide thick enough to limit **tunneling**. As a **cell designer**, I manage the rest through **device choice and topology**."

- **Foundry side:** multi-gate electrostatics (fin/nanosheet) → lower DIBL and a steeper subthreshold slope; high-k/metal gate → same electrical thickness with a thicker physical oxide → much less gate tunneling.
- **Designer side (what you control):**
    - **Vt flavor**: HVT/UHVT where speed allows.
    - **Channel-length variants** (longer L where offered) for leakage-critical devices (e.g., ROM bitcells, keepers).
    - **Stacking**: a series off-stack lowers Vds on each device → **less DIBL** (the stack effect).
    - **Reduce Vds on idle devices**: power-gate idle banks, lower retention voltage.
    - **Avoid minimum devices** where leakage or mismatch dominates.

<div class="co co-value"><p class="co-t">Wow line</p>

"At 3nm/2nm, **GIDL and junction leakage** can matter as much as subthreshold at the hot corner, and body biasing is much weaker in FinFET than in planar or FD-SOI, so **Vt/L choice and topology** are the main levers left to the designer."

</div>

#### X2.2 "Wire resistance dominates at these nodes. How do you analyze and optimize long bitline RC?"

<div class="co co-analogy"><p class="co-t">Picture it</p>

A long bitline is **one endless street**: every extra block adds traffic (capacitance) and potholes (resistance), and the trip time grows with the **square** of the length. Hierarchical bitlines are **local streets feeding a highway**.

</div>

<figure class="fig"><img src="assets/fig/diagrams/hierbl.svg" alt="Flat vs hierarchical bitlines: shorter local lines cut capacitance, leakage and RC." loading="lazy"><figcaption>Flat vs hierarchical bitlines: shorter local lines cut capacitance, leakage and RC. · Original supplied circuit diagram</figcaption></figure>


**Short answer:** "Treat the bitline as a **distributed RC**: delay grows with **length squared**. Analyze on an **RC-extracted, full-length critical-path netlist** at the **far cell**, then **shorten the effective line**, mainly with **hierarchical bitlines**."

<div class="co co-eq"><p class="co-t">Distributed RC</p>

```latex
t_{50\%} \approx 0.38\,R_w C_w \;(+\; 0.69\,R_{drv} C_w) \qquad R_w C_w \propto L^2
```
**Remember:** "**double the length → 4× the wire delay**." Halving a bitline into two segments cuts wire RC per segment by ~4×.

</div>

**Analysis:**

- Extract **R and C** (not C-only); simulate a **critical-path netlist** with the **full distributed bitline and wordline**, the selected cell at the **far end**.
- Separate **wire delay vs device delay** (the cell's current into the bitline's C) to know which to fix.
- Check **bitline-to-bitline coupling**: a neighbor discharging couples onto a bitline that should stay high.

**Optimization:**

| Fix | Helps | Costs |
| --- | --- | --- |
| **Hierarchical bitlines** (short local BL + global BL) | Cuts C, leakage and RC together | More sense stages and area |
| **Sense in the middle / double-ended access** | Halves the effective length | Floorplan complexity |
| **Wider or upper-layer metal** for global lines | Lower R | More C per length; track usage |
| **Spacing / shielding** between bitlines | Less coupling | Density |

#### X2.3 "ROM code is permanent, and the hardware must last the GPU's life. How do you design wordline drivers against NBTI, HCI and EM?"

**Short answer:** "Simulate the **aged** circuit, not just the fresh one: apply a realistic **stress profile** to get each device's **ΔVt**, re-simulate at **end of life**, and check EM on the driver's output path at the **real access rate**."

| Mechanism | Where in a WL driver | How you simulate it | Design against it |
| --- | --- | --- | --- |
| **NBTI** (PMOS, Vt rises under negative gate bias, hot) | The **pull-up PMOS** that drives the WL high | Aging-aware SPICE (e.g., reliability simulators) with **duty cycle per row** → ΔVt → end-of-life netlist | **Margin** on WL rise time; don't size to the edge; sense timing that tracks aged WL |
| **HCI** (hot carriers during switching at high Vds) | Driver devices charging a **large WL capacitance**, esp. with **slow input slews** | Same flow, with **switching activity** | **Sharp input slews** into the driver; staged (tapered) drivers |
| **EM** | **Driver output, vias and the WL metal**: peak/RMS current charging the WL | Current waveforms at the **max access rate** and **temperature** vs rule limits | **Via arrays** at the driver output, wider WL metal, **segmented WLs** (less charge per driver) |

<div class="co co-value"><p class="co-t">Wow line</p>

"ROM usage is **uneven**: boot code rows may be read heavily, others rarely. So aging and EM stress **differ by row**, and I'd simulate the **worst-used rows**, not an average. And the sense amps see **fixed data forever**, so their aging is **asymmetric**."

</div>

### X.3 Transistor-level standard-cell design

#### X3.1 "For an AOI/OAI gate, how do you size for symmetric rise/fall and a balanced switching threshold (Vm)?"

**Short answer:** "Make the **worst-case pull-up path** as strong as the **worst-case pull-down path**. Each network's worst path is its **longest series stack**, so width scales with the stack depth, times the **mobility ratio β = μn/μp** for PMOS."

**AOI21 (Y = !(AB + C)), β = 2:**

- **Pull-down:** worst path = **A–B in series (2)** → A, B = **2**; C alone → **1**.
- **Pull-up:** (A ∥ B) in series with C → worst path = **2 in series** → each PMOS = 2 × β = **4**.
- Symmetric drive → rise ≈ fall for the **worst-case input**. Other input patterns will be faster.

<div class="co co-eq"><p class="co-t">Switching threshold</p>

```latex
V_m = \frac{V_{tn} + r\,(V_{DD} - |V_{tp}|)}{1 + r} \qquad r = \sqrt{\frac{k_p}{k_n}}
```
**Remember:** "equal currents at V_m." Stronger PMOS → V_m moves **up**. For V_m ≈ VDD/2 you need k_p ≈ k_n (with |Vtp| ≈ Vtn).

</div>

- **Complex gates have more than one Vm:** it depends **which inputs switch** (e.g., A alone vs A and B together).

<div class="co co-value"><p class="co-t">Wow line</p>

"Symmetric rise/fall isn't always the goal. For **minimum average delay** of an inverter chain, the optimal Wp/Wn is closer to **√(μn/μp) ≈ 1.4** than 2, because the extra PMOS width adds input capacitance. And at FinFET the answer is **fin counts**, so I'd compare legal options in SPICE."

</div>

#### X3.2 "How do you calculate logical and electrical effort for a custom cell and optimize it for FO4?"

**Short answer:** "**g** = the cell's input capacitance divided by an inverter's that delivers the same output current; **h** = C_out/C_in. Stage delay **d = g·h + p**. Aim for **stage effort g·h ≈ 4**."

- **Compute g per input** from the sized transistors: AOI21 at β=2 → input A: (2 + 4)/3 = **2**; input C: (1 + 4)/3 = **5/3**. (Inverter = 1 + 2 = 3.)
- **Parasitic delay p** ≈ diffusion capacitance on the output node relative to an inverter (NAND2 ≈ 2, NOR2 ≈ 2, AOI21 higher).
- **Optimize for a load:** for f = g·h = 4 on input A: h = 4/2 = 2 → **C_in = C_load/2** → pick the drive strength that gives that input cap.
- **Path:** F = G·B·H, N ≈ log₄F, each stage effort F^(1/N).

<div class="co co-value"><p class="co-t">Wow line</p>

"Logical effort also tells you **which pin to give the critical signal**: the input with **lower g** (and nearer the output) is the faster arc. That's a real library decision: make the fast pin obvious in the .lib."

</div>

#### X3.3 "How would you use multi-Vt (UHVT to LVT) inside a custom ROM module?"

**Short answer:** "Put **high-Vt where the transistor count is**, the **bitcells**, and **low-Vt only on the timing-critical periphery**. Leakage scales with device count; speed is set by a handful of devices on the access path."

| Block | Vt choice | Why |
| --- | --- | --- |
| **Bitcell array** | **HVT / UHVT** (or long-L) | Most transistors, most leakage; also **improves I_on/I_off**, so **more rows per bitline** |
| **Decoder, WL drivers, sense, output** (access path) | **LVT / SVT** | Few devices; they set access time |
| **Keeper** | HVT or long-L | Weak on purpose; stable |
| **Precharge** | SVT | Needs strength for cycle time, not access |
| **Idle banks / non-critical control** | HVT + **power gating** | Leakage when not accessed |

- **Check both sides of the trade:** HVT bitcells **lower I_on**, so the **read-0 discharge** slows. Verify slow/cold/low-VDD discharge **and** fast/hot read-1 leakage.
- **Leakage math:** ~**10× per ~80–100 mV** of Vt, so a UHVT array can cut array leakage by an order of magnitude or more.

### X.4 Layout, margining & sign-off simulations

#### X4.1 "Walk through a Monte Carlo setup for margins. What sigma for a library vs a memory array, and why?"

<div class="co co-analogy"><p class="co-t">Picture it</p>

Monte Carlo is **rolling dice**. To see a one-in-a-billion roll you'd need about a billion rolls. **Importance sampling is fishing where the fish are**: sample mostly near the failure, then correct the odds.

</div>

**Short answer:** "Define the **failure metric** first, run **local mismatch MC at each relevant global corner**, and switch to **high-sigma methods** when the target is beyond ~4σ. Memory needs **5–6σ per cell** because **millions of identical cells** must all work; a standard cell's variation is handled **statistically per path** in STA, so ~3σ cell characterization with **LVF** is typical."

**Setup, step by step:**

1. **Metric + failure:** e.g., ROM: bitline swing at SAE − SA offset < 0; flop: clk-Q pushout > 10%.
2. **Global corner:** run local MC at **each** relevant corner (SS/cold for discharge, FF/hot for leakage), not only TT.
3. **Mismatch models on**, correct devices and layout effects (post-layout netlist).
4. **Sample size:** ~1,000s of runs resolve ~3σ. **Zero fails in n runs ≈ p < 3/n** only.
5. **High sigma:** **importance sampling** / Solido-style methods to reach 5–6σ with thousands, not billions, of runs.
6. **Check the tail shape:** don't extrapolate a Gaussian fit blindly; real tails are often non-Gaussian.

| | Typical target | Why |
| --- | --- | --- |
| **Memory array (SRAM/ROM bitcell, sense)** | **5–6σ** | p_fail × N cells; 1 Mb at 99.9% yield → ~1e-9 per cell → ~6σ. **ROM usually has no redundancy**, so it needs the full margin |
| **Standard cells** | ~3σ characterization + **LVF/POCV** | Timing variation is combined **statistically along each path** in STA; different failure model |

<div class="co co-value"><p class="co-t">Wow line</p>

"The sigma target comes from **N and the yield goal**, and from **repair**: SRAMs often have **redundancy**, which relaxes the per-cell target; a **ROM can't be repaired** because its content is fixed, so it needs the full sigma."

</div>

#### X4.2 "Static vs dynamic IR drop in a standard-cell layout. How do you optimize the in-cell rails?"

**Short answer:** "**Static IR** = average current × grid resistance, a DC shift. **Dynamic IR** = the **transient droop** when many cells switch at once: peak current through R, L·di/dt, minus what local decap supplies. Inside the cell, the levers are **rail width, rail-to-grid vias and where the current enters**."

- **In-cell / row level:**
    - **Rail width** on M0/M1 (within the track budget) and **rail via density** to the upper grid ("power stapling").
    - Place **high-current devices near rail taps**; avoid supply current running along long thin internal wires.
    - **Decap / filler-decap cells** near high-activity cells for dynamic droop.
    - **Multi-finger** big drivers to spread current across rail contacts.
- **Chip-level context:** grid strength, spreading simultaneous switching (clock skew scheduling), decap placement.
- **ROM-specific:** **precharging every bitline at once** is a large current burst: stagger precharge by bank.

#### X4.3 "Debug a DRC failure for dummy-gate placement, and an LVS failure from a floating bulk."

**DRC: dummy gate / poly placement.**

1. **Read the exact rule:** gate pitch, dummy poly at the diffusion edge, diffusion-break type, poly extension.
2. **Check in context:** many of these errors appear **only when the cell abuts neighbors**. Run DRC **with neighbors or fill cells**, not just standalone.
3. **Fix at the boundary:** add or align the **dummy gate at the cell edge**, use the correct **diffusion break**, keep **uniform gate pitch** across the boundary.
4. **Re-run DRC in context, then re-extract**: dummy gates and diffusion breaks change **layout-dependent effects** (stress), so timing can shift.

**LVS: floating bulk.**

1. **Identify which device/net:** the report shows a well or substrate with no connection, or a 4-terminal device mismatch.
2. **Check the tie strategy:** in standard-cell rows, **bulk is usually tied by separate tap cells**, not inside every cell. A standalone cell LVS may need the **tap or the right LVS option** for global bulk nets.
3. **Check naming:** if the library has **separate bulk pins** (e.g., VNW/VPW for body bias) the **schematic and layout must use the same bulk nets**. A schematic tying bulk to VDD vs a layout on VNW is a classic mismatch.
4. **Check the layers:** the well covers the devices, and the well/tap contacts exist.
5. **Fix, re-run LVS, then re-extract.**

<div class="co co-value"><p class="co-t">Wow line</p>

"Half of cell DRC problems are **context problems**: the cell is clean alone and fails when abutted. I'd always check a cell **in a row with its neighbors and fill** before calling it clean."

</div>

### X.5 Scenario questions in the same style

#### X5.1 "The ROM passes at TT but one address reads 0 instead of 1 at FF/125 °C. Debug it."

> "A 1 reading as 0 at **fast/hot** says **leakage**. First I'd check **that column's code**: probably most other cells are connected, which is **max leakage and max bitline cap**. Then plot BL, keeper and SAE. If the bitline **droops below the sense threshold before SAE**, options are a **stronger or delayed keeper** (then re-check read-0 at slow/cold), **earlier SAE** if the read-0 still has margin, or **shorter bitlines** if no keeper size satisfies both. Last, check whether it's **one weak local device** by running mismatch MC on that column."

#### X5.2 "The largest configuration misses access time by 10%. Where do you look?"

> "**Break the path** on the post-layout netlist: decode → WL rise at the **far** column → BL development at the **far** row → SAE → output. Whichever term grew fastest with size is the target: **segment the wordline** if WL RC, **hierarchical bitlines** if BL development, **re-size the decode chain** if decode. Then re-verify that the fix didn't break read-1 leakage."

#### X5.3 "Why not just make the keeper stronger?"

> "It fixes read-1 and **hurts read-0**: the selected cell has to fight it, so discharge slows, contention current rises, and at slow/cold/low-VDD the 0 may not arrive in time. The keeper is a **window**, and if the window closes, the answer is **architecture**: shorter bitlines, not a bigger keeper."

#### X5.4 "What happens if precharge and wordline overlap?"

> "The precharge PMOS and the selected cell **fight**: **crowbar current**, a bitline that never discharges properly (wrong read), extra power, and **EM/IR stress** on the precharge path. That's why the two are **non-overlapping** by design, and I'd check that at the fast corner where edges shift."

#### X5.5 "Firmware sends a code change two weeks before tapeout."

> "If the ROM is **via-programmed**, it's a **re-encode on one mask**: regenerate, re-run **content verification**, and re-check **electrical margin for the new code**, since a column that became densely connected changes leakage and capacitance. If it's implant-programmed, this is a schedule conversation, not a circuit one."

#### X5.6 "A new flop's characterized setup time is negative at SS. Is that a bug?"

> "Not necessarily. Setup is measured at the **external pins**; if internal clock buffering delays the capture, data can arrive after the external edge and still be captured. I'd check the **pass criterion** (e.g., 10% clk-Q pushout), the **waveforms at the boundary**, and that **hold** is still reasonable, since setup and hold trade against each other."

#### X5.7 "EM passes at 1 GHz, but the design wants to run the cell at 1.5 GHz."

> "RMS and average current scale **with frequency**, so the margin shrinks by roughly 1.5×. I'd re-run EM at 1.5 GHz with the real **load and slew**; if it fails, either **fix the cell** (vias, wider output metal) or **update the .lib EM limits** (max toggle rate / max load) so the tools keep designers in the safe region."

#### X5.8 "The sense amp passes fresh but fails after aging simulation."

> "**Asymmetric stress:** in a ROM the data is fixed, so that sense amp reads the **same value for years** and one side's devices age more, shifting its **offset**. Fixes: **more swing budget** at SAE, **balance the stress** (precharge/equalize both sides between reads), or **larger devices**. And sign off the offset **aged**, at the worst-used column."

<div class="co co-core"><p class="co-t">Core memory</p>

**Every scenario: mechanism → the corner it lives at → the fix → what the fix costs → how you'd re-verify.** That's how an experienced engineer answers.

</div>

### X.6 Experienced-engineer questions (what a 3+ year engineer is expected to handle)

The role asks for an MS because the job is **analysis, not just execution**: modeling device physics, statistics (high sigma), reliability physics, and turning an open-ended request into a verified design. These questions test that.

#### X6.1 "Your library's .lib says a cell is 8% faster than SPICE at one corner. What's going on?"

> "First I'd check it's a **like-for-like comparison**: same netlist (pre- vs post-layout), same **slew and load point** (on-grid vs interpolated), same **thresholds** and **sensitization**. If it's an **interpolation** point, the table may be too coarse there: add indices. If it's **on-grid**, compare the characterization **deck** to my testbench: stimulus shape (ramp vs realistic waveform), receiver load, model version. **Optimistic** errors are the dangerous ones; I'd flag the cell until it's fixed."

#### X6.2 "The foundry drops a new PDK version mid-project. What do you do?"

> "Read the **release notes**: which **models, rules or layers** changed. Rule changes → re-run **DRC/LVS**; model changes → re-simulate a **reference set** (inverter, NAND, flop, ring oscillator) old vs new to see the **size and direction** of the shift. If the shift is small and uniform, **re-characterize** and re-QA; if it hits a specific device (e.g., HVT leakage), target the cells that use it. Then tell users **which cells changed and by how much**."

#### X6.3 "You're bringing up a library on a brand-new node. What do you build first, and why?"

> "The **minimum set that lets a design team start and lets us learn the node**: inverter/buffer, NAND/NOR, a basic flop, a clock buffer and ICG, tie/fill/tap/decap cells, plus **ring oscillators** to correlate with silicon early. Before that, I'd settle the **cell architecture** with layout and PD: **track height, fins per device, rail and pin-access strategy**, because every later cell inherits it. Then expand the family: drive strengths, Vt flavors, complex gates, then specialty cells like level shifters and multi-bit flops."

#### X6.4 "How do you pick a track height (cell height) for a new library?"

> "It's a **density vs drive vs routability** trade. Shorter cells are denser but fit **fewer fins** per device (weaker drive) and **fewer pin-access tracks**. Taller cells drive harder and route more easily but cost area. Libraries often ship **more than one height**: a dense one for most logic, a taller high-performance one for critical paths. I'd evaluate on **real blocks**: synthesize and route a benchmark with each option and compare area, timing and congestion."

#### X6.5 "A design team says your flop causes hold violations everywhere. How do you respond?"

> "Reproduce **their** failing path first: which flop, **which corner**, what clock slew and skew. Then check the **model**: is the characterized hold too optimistic (criterion, clock slew range, aged vs fresh)? If the **model** is right and the flop just has a large hold time, the options are a **hold-friendlier variant**, or it's a **clock-tree/skew** issue on their side. Either way, I close the loop with data, not opinion."

#### X6.6 "How do you validate that your library matches silicon?"

> "**Test structures on a test chip or product**: ring oscillators built from library cells (per Vt and drive), leakage monitors, flop characterization circuits. Compare measured frequency and leakage to **SPICE and .lib predictions at the same voltage and temperature**. A **systematic offset** means a model/extraction issue, so re-center or re-guardband. **Scatter** tells you about variation. That feedback sets guardbands for the next release."

#### X6.7 "What goes into a multi-bit flop, and why do people want them?"

> "**Two to eight flops sharing one clock buffer and layout**, so there are fewer clock pins and less **clock power and area** per bit. Costs: **pin access** gets harder, **placement flexibility** drops, and a multi-bit flop's **scan and timing** must be characterized per bit. Clock power is a big share of chip power, so the saving is real."

#### X6.8 "How would you speed up characterization turnaround for a 2,000-cell library?"

> "Make the flow **incremental**: re-characterize only cells whose **netlist, model or settings changed** (Make-style dependencies). **Batch** simulations, **reuse** results across drive strengths only where proven, run **pilot points** to catch setup errors before the full run, and make **failures loud** so missing points get rerun, not silently interpolated. Track runtime per cell to find outliers."

#### X6.9 "When would you use a pulsed latch or a TSPC flop instead of a TG master–slave flop?"

> "**Pulsed latch:** when timing is tight and you want **tiny setup and time borrowing**, accepting a **larger hold** requirement and a pulse generator to verify across PVT. **TSPC:** fewer clock phases and a fast, compact flop, but sensitive to **slow clock slews** and charge sharing. **TG master–slave** stays the default for robustness. The choice is driven by the design's timing, power and robustness targets."

#### X6.10 "How do aging-aware libraries work, and when do you sign off with them?"

> "Characterize the cells with **aged device models**: ΔVt from **BTI/HCI** under an assumed **stress profile** (voltage, temperature, duty, lifetime), giving an **end-of-life .lib**. STA runs with it to make sure the design **still meets timing after years**. The key judgment is the **stress assumption**: too pessimistic wastes area and power; too optimistic risks field failures."

#### X6.11 "Explain LVF and why it matters for a library."

> "**Liberty Variation Format** adds **per-arc sigma tables**, for delay, transition and constraints, on top of the nominal tables. STA then combines variation **statistically along each path** (POCV) instead of applying a flat margin, which removes a lot of **pessimism**. For the library team, it means characterizing **local variation per arc**, which is expensive, so the **efficiency of the MC flow** matters."

#### X6.12 "How do you decide what goes in the library at all?"

> "Driven by **users and data**: which functions and drive strengths the synthesis and PD tools actually pick, where they have to **stack cells** to make a function (a candidate for a new complex gate), what's **missing on critical paths** (a stronger drive, a better Vt), and power hot spots (**clock gating, multi-bit flops**). Every added cell has a **maintenance and characterization cost**, so it has to earn its place."

<div class="co co-core"><p class="co-t">Core memory</p>

**The MS-level skill is analysis: model it, bound it statistically, verify it against silicon, and explain the trade-off with data. Answer every question from that stance.**

</div>

## Part F1 — Faraday, told honestly (scope it before he wanders)


### F1.1 The scope-setter (say it whenever Faraday comes up)

> Quick framing so it's clear what I owned: on that **UMC 22nm shuttle**, my lane was the **DFT and STA checks** and the **handoffs**. After synthesis I ran ERC and **timing checks in PrimeTime**, passed to physical design, iterated as it came back, then handed to verification. I **integrated MBIST** for the memories and delivered **ATE patterns**. Physical implementation and failure root-causing were other teams' scope.

- **Mine:** DFT/STA checks · ERC · PrimeTime timing debug · MBIST integration · ATPG/ATE patterns · Tcl/Perl/Csh automation · handoffs (Taiwan ↔ Vietnam teams) · mentoring undergrads.
- **Not mine:** physical implementation (I recommended fixes; PD owned them) · failure analysis · anything implying more than ~5 months (Jan–May 2024).

### F1.2 Why Faraday matters to *this* team

<div class="co co-value"><p class="co-t">Say this</p>

"At Faraday I was a **customer of what this team builds**. Every delay in PrimeTime came from the **standard-cell .lib tables**, and every memory I wrapped with MBIST came from a **memory compiler**. I've seen what a library needs to give its users: **accurate characterization, sane behavior across corners, testable memories**."

</div>

### F1.3 "What is MBIST? What faults does it catch?" (in your zone; memory-relevant)

> **Memory built-in self-test**: an on-chip engine that tests the memories by writing and reading patterns (**march algorithms**). It catches **stuck-at** (bit stuck 0/1), **transition** (can't flip one way), **coupling** (writing one cell disturbs a neighbor), **address-decoder** (wrong cell accessed), and **retention** faults. My part was integrating it into the flow, not root-causing physical fails.

- **Bridge to design:** "Each fault maps to a design margin: read disturb shows up as a coupling or transition fault, a weak cell at low VDD as a retention fault. MBIST **finds** escapes; it **can't prove** 6σ margin. That's what design-time analysis is for."

<div class="co co-core"><p class="co-t">Core memory</p>

**Scope first → answer inside your zone → "here's how I understand the rest." You never need to inflate Faraday.**

</div>

## Part D2 — The drills they may hit (locked-down answers)

Your résumé raises one quiet question: **"is circuit design real for him, or one option among many?"** Resolve every version of it back to one arc.

<div class="co co-core"><p class="co-t">Your master arc</p>

"I explored deliberately, research and then the business side, and it **converged on hands-on silicon**: where device physics becomes something every chip uses. A standard-cell and ROM library is exactly that."

</div>

#### D2.1 "Your research was analog. Why digital cells and ROM?"

> Standard cells and especially ROM are **analog design wearing digital clothes**. A flop's setup time is a race between two analog paths, a level shifter is a **contention** problem, and a ROM read is **small-signal sensing** with leakage fighting you. The skills from my TIA and filter work (**sizing for margin, PVT corners, noise and leakage at low bias**) are what a cell designer uses. The difference is scale: my analog block was one instance; a cell here is **billions**. That leverage is what draws me.

#### D2.2 "You haven't designed memory. Why believe you can do ROM?"

> Fair. I haven't designed a memory array end to end. What I have is adjacent: I **integrated MBIST** at Faraday, and on the NTT course project I did the **physical integration of the SRAM blocks**. And the physics of a ROM read, **one weak cell against a keeper while every other cell on the bitline leaks at a hot, fast corner**, is the same subthreshold-leakage and variation physics I worked with near threshold. I'm happy to walk through a ROM column right now.

<div class="co co-value"><p class="co-t">Then prove it</p>

Offer to draw the NOR ROM column (Q12). An honest gap followed by immediate understanding beats claimed experience.

</div>

#### D2.3 "Why did you leave the PhD track?"

> It was a deliberate redirect. I went in wanting depth, and I got it, but I realized I want to be **close to real products and real silicon**, and a multi-year thesis narrows you onto one problem for a long time. So I **completed my MS** and moved toward industry circuit design. I'd rather make that correction than stay on the wrong track out of momentum.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Say "**I started on the PhD track and completed my MS.**" Never "I have a PhD." Never badmouth research, your advisor or the lab; never "burned out."

</div>

#### D2.4 "You did consulting. Will you leave engineering for business?"

> No. The consulting at miLEAD, **market research for four biotech startups**, was a **test I ran**. It made me a better communicator, and it clarified that I'm happiest **hands-on with the technology**. That's why I'm interviewing for a transistor-level role, not a strategy one.

#### D2.5 "What have you been doing since you graduated?"

> [Fill in the true answer.] Shape: "I finished my MS in [month] 2026 and have been **recruiting for full-time circuit roles**, and deliberately sharpening fundamentals for this work: [e.g., device physics, SRAM/ROM, characterization]. [One honest line about anything else.]"

<div class="co co-fill"><p class="co-t">Fill in</p>

Make this true and specific. Keep side projects to one line.

</div>

#### D2.6 "When can you start? The role is New College Grad 2027."

> "I've finished my MS, so I can start **earlier than the typical 2027 timeline** if the team needs it, and I'm flexible to fit the program." Detailed logistics go to Chanel.

#### D2.7 "Are you interviewing elsewhere?"

> "I'm talking with a few companies, but this is the role I'm most excited about, because it sits exactly where my device and design background meet." Short, true, redirect.

#### D2.8 "What's your long-term goal?"

> "To become someone the team relies on for the **hard cells and hard margins**: first owning a cell family or ROM end to end, then a **new-node library bring-up**, then deeper technical ownership of foundation IP."

#### D2.9 "Collaborate or lead?"

> "Either, depending on what the work needs. I get to know people's strengths, **come prepared** so I don't waste their time, and make the **next owner and next action** clear. At Faraday that meant clean handoffs between the Taiwan and Vietnam teams."

## Part CR — Creativity (real stories only)

- **CR.1 Faraday automation:** "Doing the checks by hand each iteration would have eaten the 1.5-month timeline, so I treated it as an **automation problem**: Tcl/Perl flows that ran the whole check chain. The creative part was seeing that **the bottleneck was repetition**." *Land:* "That's the 'new flows' line in your job description."
- **CR.2 PetersonLab:** "Rather than guessing one anneal condition, I **designed a multi-temperature study** to map how anneal temperature drove conductivity and morphology." *Land:* "Same instinct as a corner sweep: map the space, don't trust one point."
- **CR.3 The ecosystem idea:** "A cell only matters in its ecosystem: the router, the timing tool, every design that uses it. A cell that's fast in SPICE but **hard to route or badly characterized** isn't a good cell."

## Part R2 — Your six stories (have these cold)

| # | Question | Story | End on |
| --- | --- | --- | --- |
| 1 | Hardest technical problem | WICS TIA + filter across PVT | [verify: the corner fix and number] |
| 2 | Tough deadline | Faraday 22nm, 1.5-month tapeout | On time, top-10% |
| 3 | Mistake | Grad-school overload → recovery (or a technical miss) | Now flags problems early |
| 4 | Learning fast | Faraday DFT/STA flow, new to you | Full flow in weeks |
| 5 | Conflict | Implant chip-platform disagreement | Listened for the real constraint |
| 6 | Cross-team | Faraday Taiwan–Vietnam handoffs | Clean handoffs, tapeout on time |

<div class="co co-core"><p class="co-t">Rules for every story</p>

**45–70 seconds.** Situation in two sentences, most of the time on **your actions**, end on a **number or concrete result**, then one line of lesson. Engineering stories first; at most one consulting story.

</div>

## Part CULT — NVIDIA culture: what the behavioral questions test

The themes behind NVIDIA's behavioral questions, and full answers to the culture-specific ones. (The general behavioral bank is in Part A2, D1–D21.)

### CULT.1 What NVIDIA's behavioral questions are really testing

TSMC's behaviorals circled one theme: **collaboration and commitment to a 24/7 team loop**. NVIDIA's circle a different set, straight from its culture: a **flat organization**, **direct and often public feedback**, extreme **speed**, and **intellectual honesty**. Widely reported practices (e.g., in *The Nvidia Way*): "**speed of light**" thinking (what's the physical limit, and why aren't we there?), "**the mission is the boss**" (work for the goal, not the org chart), **whiteboards over slides**, and leaders **owning failures openly**.

| Theme | What they probe | Question you might hear | Your story |
| --- | --- | --- | --- |
| **Intellectual honesty** | Do you tell the truth about your work, even when it's unflattering? | "A time you shipped something you weren't proud of." · "Harshest feedback you got?" | NTT's unfinished top-level closure; grad-school overload |
| **Handling direct feedback** | Can you take blunt, even public criticism without getting defensive? | "Your work was criticized in front of others. What did you do?" | [verify: a design review, advisor meeting, or Faraday review] |
| **Speed & urgency** | Do you find the fastest real path, or accept the default pace? | "How did you hit a hard deadline?" · "What would 'speed of light' be here?" | Faraday 1.5-month tapeout + automation |
| **Ownership ("mission is the boss")** | Do you fix what's broken even if it's not yours? | "A problem you fixed that wasn't yours to fix." | Faraday: mentoring interns; automating checks nobody assigned |
| **Excellence & persistence** | Do you hold your own bar and keep going? | "What does excellent work look like to you?" · "A problem that took a long time to pay off." | WICS PVT validation; PetersonLab anneal study |
| **One team / influence without authority** | In a flat org, can you move people with evidence, not title? | "Influencing a decision without authority." · "Disagreement with someone senior." | Chip-platform disagreement; Taiwan–Vietnam handoffs |

<div class="co co-core"><p class="co-t">Core memory</p>

**NVIDIA wants: tells the truth fast, takes blunt feedback well, moves at the speed of light, owns the mission beyond the job description, and influences with evidence.** Every story should show at least one.

</div>

Sources: [NVIDIA core values](https://www.resumeadapter.com/companies/nvidia/core-values) · [Design Gurus: NVIDIA behavioral questions](https://www.designgurus.io/answers/detail/top-nvidia-behavioral-interview-questions-and-how-to-answer-them) · [Lessons from Jensen Huang and *The Nvidia Way*](https://michaelxbloch.substack.com/p/lessons-from-jensen-huang-and-the) · [*The Nvidia Way* review](https://lmwalsh.substack.com/p/the-nvidia-way-reveals-how-this-chipmaker)

### CULT.2 NVIDIA-specific behavioral questions, answered

These are the culture-driven questions not already covered in Part A2 (D1–D21).

#### "Tell me about the harshest feedback you've received."

> [verify: pick the real one.] A shape that works: "During my master's, I was told directly that I tended to **argue my position before understanding the other person's constraint**. It stung, because I thought I was being thorough. But it was right. I changed how I start technical disagreements: I ask the other person to walk me through their reasoning first. It made the implant chip-platform discussion go much better, and I've kept doing it."

<div class="co co-value"><p class="co-t">Value to show</p>

**You took it in, didn't get defensive, and changed a behavior you can point to.** That's what a direct-feedback culture needs.

</div>

#### "Your work was criticized in front of others. How did you respond?"

> [verify: a real review.] "I **thanked them, asked a clarifying question** so I understood the actual concern, and **didn't defend in the moment**. Afterward I checked it; [they were right / partly right], I fixed it, and I **followed up with the result** in the same forum. Public criticism is fast feedback; the worst response is to hide the fix."

#### "Tell me about something you shipped that you weren't proud of."

> "Our NTT accelerator in EECS 627. The blocks were clean and we reached post-layout functional verification, but **top-level DRC/LVS wasn't closed** by the deadline, and we had a **bug at low DMA frequencies** we never root-caused during the course. Going back through the code since, my best hypothesis is a **write-back race** that only shows up when the DMA is slower than the core (RD.3). I'm not proud of leaving full-chip closure that late. The lesson I took: **budget closure and interface verification from day one**, not as the last step. I'd rather say that plainly than dress it up."

<div class="co co-why"><p class="co-t">Why this works</p>

It's **true**, it uses the exact facts in your report, and it shows **intellectual honesty** the way NVIDIA means it: say the unflattering thing first, then what you learned.

</div>

#### "What does excellent work look like to you?"

> "Work that's **right under the conditions that matter, not just nominal**, and that someone else can **trust and reuse** without asking me. At WICS that meant validating across **all PVT corners**, not only typical. Where I met my bar: [verify: e.g., the TIA/filter validation]. Where I didn't: NTT's full-chip closure. For a library, excellence is the same idea: every arc and corner correct, because thousands of designs will trust it."

#### "Tell me about a problem you worked on a long time before it paid off." / "…kept going after others called it done."

> [verify: WICS is the natural fit.] "The implant front end: getting stability and noise right across corners at subthreshold bias took many iterations: [the specific issue]. The easy stopping point was 'it works at typical.' I kept going until it held at [the worst corner], because an implant can't just work on a good day."

#### "Tell me about a time you fixed a problem that wasn't yours."

> "At Faraday, the repetitive DFT/STA checks weren't anyone's 'project'; everyone just redid them by hand. I **built Tcl/Perl automation** for the whole chain so it ran itself. I also **mentored the senior undergrads** in the internship program, which wasn't in my role, and most converted to full-time. If something slows the mission down, I'd rather fix it than wait for it to be assigned."

#### "Tell me about influencing a decision without formal authority."

> "The implant chip-platform disagreement: I wasn't the decision-maker. Instead of arguing, I **found the other side's real constraint**, [verify: risk/timeline], and **brought data**, [verify: PVT simulations / a comparison], that de-risked it. The decision moved because the **evidence** changed, not because I pushed harder. In a flat team, evidence is the authority."

#### "Tell me about telling someone an unpleasant truth about their work."

> [verify: a real case, e.g., as a GSI with a student's lab, a teammate's block on NTT, or a miLEAD recommendation a founder didn't want.] Structure: "**Private first, specific, with data, and with a way forward.** I said what I saw, showed why it mattered, and offered to help fix it. [Outcome.]"

#### "If you could work on anything here, what would it be?"

> "**Energy-efficient cells and memories at low voltage**: flops, level shifters and ROM reads near threshold, where leakage and variation decide everything. That's exactly where my subthreshold background is useful, and at NVIDIA's scale, power is the limit on every product."

#### "NVIDIA is intense. Why do you want that?"

> "I do my best work with **real ownership and a hard target**. The Faraday tapeout was a 1.5-month sprint, and I liked it. What I've learned is to **flag problems early and triage honestly** instead of grinding silently. That's how I'd keep up at NVIDIA's pace."

## Part CAREER — Your future & career plan

### CAREER.1 The plan, horizon by horizon (the TSMC B2 cluster, rebuilt for NVIDIA)

**The frame:** at TSMC the question was "will he stay on the loop?" At NVIDIA it's "**will he go deep in circuits and grow into owning hard problems?**" Rooted, technical, specific.

| Horizon | What to say |
| --- | --- |
| **First 6–12 months** | "**Reproduce a reference cell and its flow**, then own a **bounded change**, like a new drive strength, a margin check or a debug, and support its users." |
| **2–3 years** | "Own a **cell family or a ROM configuration end to end**: design, margins, characterization, release. Be the person designers come to when that family looks wrong." |
| **5 years** | "Go through a **new-node library bring-up**, where the library is built from scratch, and lead a piece of it. Deep expertise in **low-voltage cells or memory margins**." |
| **10 years** | "Direction, not a title: **deep technical ownership of foundation IP** at the leading edge. Technical track or leading a team, wherever I add the most." |

#### "Where do you see yourself in five years?"

> "Growing deep here. The first couple of years, getting really good at owning cells or a ROM end to end and supporting the teams that use them. By five years, I'd like to have been through a **new-node bring-up** and be someone the team relies on for **hard margin problems**, especially at low voltage."

#### "Technical track or management?"

> "**Technical first**, for a long time. I want real depth before I'd lead anyone. If leading a small technical team is where I add the most later, I'd be open to it, but depth comes first."

#### "Would you want to move to another team later?"

> "My focus is getting deep **here**. Library work touches every design team, so I'd naturally learn a lot about the rest of the chip, but I'm not looking at this as a stepping stone."

#### "Would you go back for a PhD or an MBA?"

> "No. I'm focused on building an industry career in circuit design; that's the direction I've chosen."

#### "What do you want to learn in your first year?"

> "Three things: **legal FinFET/GAA sizing and layout constraints**, the team's **characterization and QA flow**, and **high-sigma and reliability methodology**. And I'd like to see how the library is actually used by the physical-design teams."

<div class="co co-guard"><p class="co-t">Guardrails for the career cluster</p>

1. **Keep the horizon inside NVIDIA and circuit design.** Don't volunteer longer-term ideas about strategy, consulting, a startup, or healthcare commercialization. They're real interests, but here they read as "he'll leave."
2. **No "stepping stone" language.** Never "this will give me a foundation to…"
3. **Specific beats grand.** "Own a flop family, then a node bring-up" is stronger than "become a leader in AI hardware."
4. **Consistent with Part D2:** exploring is over; it converged on hands-on silicon.

</div>

<div class="co co-core"><p class="co-t">Core memory</p>

**Year 1: reproduce, then own a bounded change. Years 2–3: own a cell family or ROM. Year 5: new-node bring-up, go-to for hard margins. Year 10: deep technical ownership of foundation IP. Technical track first.**

</div>

## Tier 1 — Must conquer 

**Goal for every topic:** draw it, trace the current, state the assumption, and handle one changed condition ("what if VDD drops?"). Format: **Definition → Why you care → How it works → Trade-offs → What if → Best choice → Core memory.**

### T1.1 The MOSFET: regions, leakage, temperature

<div class="co co-analogy"><p class="co-t">Picture it</p>

A MOSFET is a **water valve**: gate voltage opens the channel. Above Vt, flow grows like the square of how far you open it; below Vt it's a **drip that grows 10× for each small turn**: that drip is leakage. Two closed valves in series (a stack) leak far less than one.

</div>

**Definition.** A MOSFET is a voltage-controlled switch: gate voltage above **threshold (Vt)** forms a channel between source and drain. **NMOS** turns on with a high gate; **PMOS** with a low gate.

**Why you care.** Every cell's **speed, leakage and variation** come from these device behaviors. Bo will expect you to explain *why* a cell is slow or leaky from the device up.

<figure class="fig"><img src="assets/fig/diagrams/inverter.svg" alt="CMOS inverter: PMOS pulls up, NMOS pulls down." loading="lazy"><figcaption>CMOS inverter: PMOS pulls up, NMOS pulls down. · Original supplied circuit diagram</figcaption></figure>

**How it works.**

- **Cutoff** (Vgs < Vt): "off," but a small **subthreshold current** still flows, **exponential** in (Vgs − Vt).
- **Triode / linear** (Vds < Vgs − Vt): acts like a resistor.
- **Saturation** (Vds ≥ Vgs − Vt): current mostly set by Vgs; the transistor is a current source. Saturation ≠ off.
- **Short-channel effects:** **DIBL** (high drain voltage lowers the barrier → Vt drops → more leakage), **velocity saturation** (current becomes closer to linear in overdrive, not square-law).

<div class="co co-eq"><p class="co-t">E1 · MOSFET current (teaching model)</p>

```latex
I_{D,sat} = \tfrac{\beta}{2}(V_{GS}-V_t)^2 \qquad I_{sub} \propto e^{(V_{GS}-V_t)/(n\,kT/q)}
```
**Remember:** above Vt → **square law** (overdrive²). Below Vt → **exponential**: every ~60–100 mV of Vt changes leakage by **10×**. **Limit:** advanced nodes need the real compact models.

</div>

| Leakage type | What it is | Worse when |
| --- | --- | --- |
| **Subthreshold** | Channel current when "off" | **Low Vt, hot**, high Vds (DIBL) |
| **Gate** | Tunneling through thin oxide | Thin oxide (much reduced by high-k metal gate) |
| **GIDL** | Band-to-band at the drain edge | High drain–gate voltage |
| **Junction** | Reverse-biased diode leakage | Hot |

**What if…?**

- **Temperature rises?** Mobility drops (slower) **and** Vt drops (faster, leakier). At **high VDD** mobility wins → **hot is slow**. At **low VDD** Vt wins → **cold is slow** (**temperature inversion**). Libraries need both hot and cold slow corners.
- **Two off transistors in series?** The middle node rises, giving the top device a **negative Vgs** and less DIBL → **much less leakage** (**stack effect**). Leakage depends on the **input state**.
- **VDD drops?** Less overdrive, so a Vt shift is a bigger fraction of it → **variation matters more**.

<div class="co co-core"><p class="co-t">Core memory</p>

**Above Vt: square law. Below Vt: exponential, 10× per ~80 mV. Hot = leaky. Low VDD: cold is slow. Stacks leak less.**

</div>

### T1.2 CMOS gates, sizing & stick diagrams

<div class="co co-analogy"><p class="co-t">Picture it</p>

Standard cells are **LEGO bricks**: every brick is the same height with the power rails in the same place, so any two snap together. The Euler path is **drawing the circuit without lifting your pen**, so every transistor shares one continuous strip of diffusion.

</div>

**Definition.** A static CMOS gate = a **PMOS pull-up network** to VDD and a **complementary NMOS pull-down network** to GND. Series in one network ↔ parallel in the other.

**Why you care.** This is literally the cell you'd design. The reported NVIDIA questions: **size at 2:1 and 1:1, draw stick diagrams, NAND vs NOR**.

<figure class="fig"><img src="assets/fig/diagrams/gates.svg" alt="NAND2 and NOR2 with widths at the 2:1 mobility ratio (inverter = N1, P2)." loading="lazy"><figcaption>NAND2 and NOR2 with widths at the 2:1 mobility ratio (inverter = N1, P2). · Original supplied circuit diagram</figcaption></figure>

**How it works.**

- **NAND2:** NMOS in **series**, PMOS in **parallel**. **NOR2:** NMOS in **parallel**, PMOS in **series**.
- **AOI21 (Y = !(AB + C)):** pull-down (A–B series) ∥ C; pull-up (A ∥ B) series C.
- **Sizing rule:** match the worst-case path resistance to the reference inverter. Series ×n, parallel ×1. (Full table in Q5.)
- **Pass gates:** NMOS passes a strong 0 but a **weak 1** (VDD − Vt); PMOS the opposite; a **transmission gate** (both in parallel) passes both fully.

<figure class="fig"><img src="assets/fig/diagrams/stick.svg" alt="NAND2 stick diagram with Euler order A–B: one unbroken strip per diffusion." loading="lazy"><figcaption>NAND2 stick diagram with Euler order A–B: one unbroken strip per diffusion. · Original supplied circuit diagram</figcaption></figure>

**Trade-offs.**

| Choice | Pros | Cons |
| --- | --- | --- |
| **NAND-based logic** | Series NMOS is fast; less input cap | May need extra inversion |
| **NOR-based logic** | Parallel NMOS fast pull-down | Series PMOS huge → more area and input cap |
| **Complex gate (AOI/OAI)** | One stage instead of two; less area | Taller stacks; slower beyond ~3–4 series |
| **Upsize a gate** | Lower output resistance | More **input cap** (slows the previous stage), more leakage |

**What if…?**

- **I double every transistor. Why is the path slower?** You doubled the **load on the previous stage** and added diffusion cap. Size the bottleneck, not everything.
- **Two NAND inputs, same logic, different delay?** The input **nearest the output** in the NMOS stack is faster (the lower node is already discharged). Put the **latest-arriving signal on the faster pin**.
- **A 4-input NOR in one stage?** 4 series PMOS: huge and slow. Split into NOR2 + NAND2 or restructure.

**Best choice.** Keep stacks ≤ 3–4; prefer NAND/AOI; size for the **path**, not the gate.

<div class="co co-core"><p class="co-t">Core memory</p>

**Series ↔ parallel duals. Series → wider. NAND > NOR. Euler path → unbroken diffusion. Upsizing loads the previous stage.**

</div>

### T1.3 Delay, power & leakage

<div class="co co-analogy"><p class="co-t">Picture it</p>

Delay is **filling a bucket (C) through a hose (R)**. A bigger hose (upsizing) fills faster, but the bigger hose is heavier for the person upstream to push (more input capacitance on the previous gate).

</div>

**Definition.** **Delay** = input 50% to output 50%. **Slew** = 20–80% (or 10–90%) transition time. **Power** = dynamic (switching) + short-circuit + leakage.

**Why you care.** Every cell is judged on **delay vs power vs area**. The reported NVIDIA intern question: "timing and power optimization for low power."

<div class="co co-eq"><p class="co-t">E2 · Gate delay (RC model)</p>

```latex
t_{pd} \approx 0.69\,R_{eff}\,(C_{self} + C_{load})
```
**Remember:** "0.69 to half swing." Doubling width halves R but also doubles C_self and the input cap, so delay doesn't halve. **Limit:** effective R is an approximation.

</div>

<div class="co co-eq"><p class="co-t">E3 · Power</p>

```latex
P_{dyn} = \alpha\,C\,V_{DD}^2\,f \qquad P_{leak} = V_{DD}\,I_{leak} \qquad E_{0\to1} = C\,V_{DD}^2
```
**Remember:** "**a C V-squared f**": **voltage is squared**, so −10% VDD ≈ **−19%** dynamic power. The supply pays C·V² per charge: half stored, half burned in the PMOS.

</div>

**How it works / trade-offs.**

| Knob | Delay | Dynamic power | Leakage |
| --- | --- | --- | --- |
| **Upsize** | ↓ (if load dominates) | ↑ (more C) | ↑ |
| **Lower VDD** | ↑ | ↓↓ (V²) | ↓ |
| **Lower Vt (LVT)** | ↓ | ≈ | ↑↑ (exponential) |
| **Longer L** | ↑ | ↑ slightly | ↓ |
| **Slower input slew** | ↑ | ↑ (short-circuit) | ≈ |

**What if…?**

- **Lower frequency: less energy?** Less **power**, but the same **energy per operation**; leakage energy can even rise because the task takes longer.
- **Power dropped after my change: is the cell better?** Only if **activity, voltage, load and slew were identical**. A circuit that stopped toggling is low-power and broken.

<div class="co co-core"><p class="co-t">Core memory</p>

**Delay ≈ 0.69 RC. Power = αCV²f + V·I_leak. Voltage is the biggest lever. LVT buys speed with exponential leakage.**

</div>

**Worked problem W1.** R = 2 kΩ, C_self = 3 fF, C_load = 12 fF → t ≈ 0.69 × 2k × 15f = **20.7 ps**. Double the width (R = 1 kΩ, C_self = 6 fF) → 0.69 × 1k × 18f = **12.4 ps**. **Not half**, and the previous stage now sees 2× input cap.

### T1.4 Latches, flip-flops, setup & hold

<div class="co co-analogy"><p class="co-t">Picture it</p>

A flip-flop is a **two-door airlock**: the outer door (master) is open while the clock is low; at the rising edge it shuts and the inner door (slave) opens. Data can never run straight through both at once.

</div>

**Definition.** A **latch** is transparent during one clock level. A **flip-flop** captures at an edge. **Setup/hold** = the data-stable window around the capture edge. **Clk-to-Q** = edge to output change.

**Why you care.** The JD lists **flip-flops explicitly**; the reported questions include "**What is hold time?**" and "**Draw a latch and D-FF**." Flops are among the most-used, most power-hungry cells on a GPU.

<figure class="fig"><img src="assets/fig/diagrams/latch.svg" alt="Static transmission-gate latch (transparent when CLK = 1)." loading="lazy"><figcaption>Static transmission-gate latch (transparent when CLK = 1). · Original supplied circuit diagram</figcaption></figure>

<figure class="fig"><img src="assets/fig/diagrams/dff.svg" alt="Positive-edge master–slave D flip-flop built from two TG latches." loading="lazy"><figcaption>Positive-edge master–slave D flip-flop built from two TG latches. · Original supplied circuit diagram</figcaption></figure>

**How it works.** (Detailed in Q7.) Master open on CLK low, slave open on CLK high → captures at the rising edge. **Setup** = time to get D through the master and settle its loop before it closes. **Hold** = the master's input TG closes slightly late (clock buffering, CLK/CLKB overlap), so D must stay put briefly after the edge.

<figure class="fig"><img src="assets/fig/diagrams/timing.svg" alt="Setup and hold window around the capturing edge, and clock-to-Q." loading="lazy"><figcaption>Setup and hold window around the capturing edge, and clock-to-Q. · Original supplied circuit diagram</figcaption></figure>

**How setup/hold are characterized.** Sweep D closer to the clock edge until **clk-to-Q pushes out by a set amount (often ~10%)** or the flop fails. That boundary is the setup (or hold) time. Setup and hold **interact**: pushing one tighter loosens the other.

**Trade-offs.**

| Flop style | Pros | Cons |
| --- | --- | --- |
| **TG master–slave** (standard) | Robust, low power, well understood | Two clock phases; setup + clk-Q is the timing cost |
| **C²MOS** | Tolerates clock overlap | Stacked devices, slower |
| **TSPC** (single-phase) | One clock, fast | Sensitive to slow clock slews; charge-sharing risk |
| **Pulsed latch** | Tiny setup, can borrow time | Large hold risk; pulse generation |

**What if…?**

- **Hold violation. Lower the frequency?** **No**, the period isn't in the hold check. Add delay on the short path, or reduce skew.
- **Slow clock slew?** CLK and CLKB overlap longer → both TGs partly on → **hold gets worse**, race-through risk.
- **A new flop is 8% faster clk-to-Q. Ship it?** Check **setup + clk-Q together**, hold, min pulse width, **clock-pin capacitance** (clock power!), variation, aging, EM, layout.
- **Data arrives right at the edge?** **Metastability**: the flop resolves slowly and unpredictably. **MTBF grows exponentially** with resolution time; that's why synchronizers use two flops.

<div class="co co-eq"><p class="co-t">E4 · Timing slack (S = capture clock − launch clock arrival)</p>

```latex
\text{Setup: } T + S \ge t_{cq,max} + t_{pd,max} + t_{su} \qquad \text{Hold: } t_{cq,min} + t_{cd,min} \ge S + t_{h}
```
**Remember:** "**Setup races the next edge; hold protects this edge.**" Positive skew (later capture) **helps setup, hurts hold**. Draw both edges; never memorize the sign.

</div>

**Worked problem W2.** T = 1 ns, S = +50 ps. Setup: t_cq = 80, t_pd,max = 750, t_su = 60, uncertainty 40 → slack = 1000 + 50 − 80 − 750 − 60 − 40 = **+120 ps** ✓. Hold: t_cq,min = 25, t_cd,min = 35, t_h = 30, uncertainty 10 → slack = 25 + 35 − 50 − 30 − 10 = **−30 ps** ✗. Fix: **add ≥30 ps of delay on the short path**, then recheck setup (it has 120 ps to spare).

<div class="co co-core"><p class="co-t">Core memory</p>

**Latch = TG + inverter loop. DFF = master + slave. Setup = old data in time. Hold = new data not too early. Slowing the clock never fixes hold.**

</div>

### T1.5 6T SRAM & the sense amplifier

<div class="co co-analogy"><p class="co-t">Picture it</p>

A 6T cell is **two people leaning back-to-back** holding each other up. Reading is a gentle tap on one shoulder to see who's up: don't knock them over (**PD > PG**). Writing is a shove hard enough to flip them (**PG > PU**). The sense amp is a **seesaw**: a tiny push, then gravity (positive feedback) slams it down.

</div>

**Definition.** A **6T SRAM cell** = two cross-coupled inverters (store Q/QB) + two NMOS **access transistors** gated by the **wordline**, connecting to **BL/BLB**.

**Why you care.** The JD lists **SRAM and register files**; the reported intern interviews include **SRAM basics**; and the ROM sense path uses the same ideas.

<figure class="fig"><img src="assets/fig/diagrams/sram.svg" alt="6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG)." loading="lazy"><figcaption>6T SRAM cell: cross-coupled inverters (PU/PD) plus two access transistors (PG). · Original supplied circuit diagram</figcaption></figure>

**How it works.**

- **Hold:** WL low, the inverter loop holds itself.
- **Read:** precharge BL/BLB high, raise WL. The 0-side bitline discharges through **access + pull-down**. The 0 node **bumps up**: if it passes the other inverter's trip point, the cell **flips** (read disturb). → **PD must be stronger than PG** (cell ratio ≈ 1.2–2 classically).
- **Write:** drive one bitline to 0, raise WL. The access transistor must **overpower the pull-up**. → **PG must be stronger than PU**.
- **Sense amp:** a **latch** with an enable. The bitlines develop only ~100–200 mV; when **SAE** fires, positive feedback resolves it to full rail. Fire when **bitline swing > sense-amp offset**, timed by a **replica bitline** that tracks PVT.

<figure class="fig"><img src="assets/fig/diagrams/senseamp.svg" alt="Latch-type sense amplifier." loading="lazy"><figcaption>Latch-type sense amplifier. · Original supplied circuit diagram</figcaption></figure>

**Trade-offs.**

| Knob | Helps | Hurts |
| --- | --- | --- |
| Stronger PG | Write, speed | **Read stability** |
| Stronger PD | Read stability | Area |
| Weaker PU | Write | Hold at low VDD |
| **8T cell** (separate read port) | No read disturb; multi-port register files | ~30% more area |
| **Assists** (WL underdrive, negative BL, cell-VDD collapse) | Low-voltage read or write | Speed, complexity, half-select risk |

**What if…?**

- **Read works at high VDD but flips at low VDD?** Less margin: a Vt mismatch is a bigger share. Check **read SNM at low VDD with mismatch**; consider WL underdrive or 8T.
- **Write fails. Make PG stronger?** Maybe, but check **read stability** (the same PG hurts it) and **half-selected cells** on the same row.
- **More sense-amp gain didn't fix wrong reads?** The problem is **offset** or **timing**, not gain: the swing at SAE is smaller than the offset.

<div class="co co-eq"><p class="co-t">E5 · Bitline development</p>

```latex
\Delta V = \frac{I_{cell}\, t}{C_{BL}}
```
**Remember:** "**I t over C**." More rows → more C_BL → less swing in the same time. 12 µA × 250 ps / 80 fF = **37.5 mV**.

</div>

<div class="co co-core"><p class="co-t">Core memory</p>

**Read must not flip (PD > PG). Write must flip (PG > PU). Sense amp resolves a small swing; swing must beat offset.**

</div>

### T1.6 ROM: read path, keeper & margins

<div class="co co-analogy"><p class="co-t">Picture it</p>

A ROM bitline is a **bathtub filled to the top** (precharge). Reading a 0 = pulling the one big plug (selected cell) and draining it in time. Reading a 1 = the tub must stay full while every connected cell is a **small leak**, and the keeper is a **trickling faucet** topping it up. Too strong a faucet and the plug can't drain it; too weak and the leaks empty it.

</div>

**Definition.** A **mask ROM** stores fixed data in the **physical connection**: in a **NOR ROM** each bit is an NMOS on the bitline that is either **connected (contact/via present)** or **not**.

**Why you care.** The JD: "**Lead the function/feasibility verification of new ROM designs.**" The key question: **can every code pattern be read correctly at every required corner?**

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

rom: the original referenced asset was not included in the supplied source bundle. 

</div>

**How it works.**

1. **Precharge** the bitline high; the precharge PMOS turns off; a **weak keeper** holds it.
2. **Decode** one address, raise one **wordline**.
3. **Connected** cell → bitline **falls** (reads 0). **Not connected** → **stays high** (reads 1).
4. **Sense** (an inverter or sense amp), **latch**, precharge again.

| Failure | Cause | Fix direction |
| --- | --- | --- |
| **False 0 on a "1" read** | (N−1) connected cells **leak** the bitline down; keeper too weak | Stronger keeper, fewer rows, HVT cells |
| **Late/missing 0** | Selected cell too weak **vs keeper** + big bitline cap | Weaker keeper, fewer rows, later sense |
| **Back-to-back read fails** | Precharge doesn't finish in the cycle | Stronger precharge, longer cycle |

<div class="co co-eq"><p class="co-t">E6 · ROM read budget</p>

```latex
t_{0} \approx \frac{C_{BL}\,\Delta V}{I_{sel} - I_{keeper}} \qquad \Delta V_{droop,1} \approx \frac{(N{-}1)\,I_{off} - I_{keeper}}{C_{BL}}\, t
```
**Remember:** "**The keeper saves the 1 and fights the 0.**" Both must pass at the sense time, at the **worst corner and code**.

</div>

**Trade-offs.**

| Knob | Pros | Cons |
| --- | --- | --- |
| **Stronger keeper** | "1" survives leakage | "0" slower; contention power |
| **Shorter bitlines (hierarchical)** | Less C and leakage | More sense circuits, area, control |
| **Later sense** | More time for "0" to fall | "1" droops longer; slower access |
| **HVT / longer-L cells** | Less leakage | Weaker on-current |
| **Via-programmed** | Code change = one late mask | Constrains layout |

**What if…?**

- **Stronger keeper fixed one code, broke another?** It helped the "1" read, hurt the "0" read. Plot **both at the sense instant**; if no keeper size works, **shorten the bitline**.
- **The functional model reads every address correctly. Done?** No. That checks **content mapping**, not **electrical margin**. You still need SPICE on the worst patterns, corners and variation.
- **Only the largest compiled ROM fails?** Max rows = max leakage and C. Verify the **extremes of the compiler range**, not the middle.

**Worked problems.**

- **W3 (droop):** 255 connected cells × 8 nA = 2.04 µA, plus 0.16 µA other leakage = 2.2 µA; keeper 1.2 µA → net 1.0 µA. Over 1 ns on 50 fF: ΔV = 1 µA × 1 ns / 50 fF = **20 mV** droop.
- **W4 (discharge):** C_BL = 100 fF, need 0.2 V, I_sel = 25 µA, keeper 5 µA → t = 100f × 0.2 / 20µ = **1 ns**. If sense fires at 0.8 ns, only **160 mV**: fail.

<div class="co co-core"><p class="co-t">Core memory</p>

**Precharge → WL → connected falls (0), unconnected holds (1). Keeper: saves the 1, fights the 0. Rows limited by leakage vs on-current at fast/hot. Code pattern is a variable.**

</div>

### T1.7 Characterization & Liberty (.lib)

<div class="co co-analogy"><p class="co-t">Picture it</p>

The .lib is a **car's spec sheet**: 0–60 time at every load and road condition. Characterization is the **test track**. Designers never drive the car before buying; they trust the sheet, so a wrong number becomes a crash later.

</div>

**Definition.** **Characterization** = running SPICE on a cell across input slews, output loads and PVT to build the **.lib**: timing, power, pin capacitance and constraints that synthesis and STA use.

**Why you care.** The .lib is **your product's promise**. If it's optimistic, silicon fails what STA passed; if pessimistic, designers waste area and power. The reported leakage task (Q10) is a characterization question.

**How it works.**

- **Timing arc:** input → output under a **sensitizing** state (NAND A→Y needs **B = 1**).
- **Unateness:** positive-unate (buffer), **negative-unate** (inverter, NAND), non-unate (XOR: depends on the other input).
- **NLDM tables:** delay and output slew as a **2-D table of input slew × output load** (e.g., 7×7). STA **interpolates**.
- **Sequential:** clk-to-Q, **setup/hold** (by clk-Q pushout criterion), recovery/removal, min pulse width.
- **Power:** internal switching energy per arc; **leakage per input state** (`when` conditions).
- **Variation:** corners (global) vs mismatch (local); **LVF** adds sigma tables for statistical timing.
- **Models:** **NLDM** (simple tables) → **CCS/ECSM** (current waveforms; more accurate at advanced nodes).

<div class="co co-eq"><p class="co-t">E7 · Table interpolation</p>

```latex
d(x,y) = (1{-}x)(1{-}y)\,d_{00} + x(1{-}y)\,d_{10} + (1{-}x)\,y\,d_{01} + x\,y\,d_{11}
```
**Remember:** interpolate along **load**, then along **slew**. Outside the grid = **extrapolation**: treat it with suspicion.

</div>

**Worked problem W5.** Delays at (slew, load) = (10 ps, 2 fF) 20, (10, 6) 40, (30, 2) 30, (30, 6) 54 ps. At (15 ps, 5 fF): load fraction 0.75 → 35 ps at 10 ps slew, 48 ps at 30 ps slew; slew fraction 0.25 → **38.25 ps**.

**What if…?**

- **A table value gets faster as load increases?** Suspicious: check the **measurement** (crossings, sensitization, convergence) before believing or smoothing it.
- **Setup passes, but clk-to-Q doubled?** Only OK if the **characterization criterion** allows it; the criterion must be explicit (e.g., 10% pushout).
- **Missing arc?** STA may silently lose a timing path. Never drop it; regenerate and validate.

<div class="co co-core"><p class="co-t">Core memory</p>

**.lib = promise. Sensitize the arc; tables are slew × load; setup/hold by clk-Q pushout; leakage per state; spot-check against SPICE.**

</div>

### T1.8 EM & IR: Bo's home turf (go deep here) 

<div class="co co-analogy"><p class="co-t">Picture it</p>

EM is a **river eroding its bank**: fast, concentrated flow (current density) carries metal atoms downstream, and **narrow spots and bridges (vias) wear out first**. It takes years, and a hotter river erodes faster. IR drop is **water pressure**: open every tap in the building at once (simultaneous switching) and the top floor gets a trickle; a rooftop tank (decap) helps for a moment.

</div>

**Definition.** **IR drop:** voltage lost across the resistance of the supply grid and wires (V = I·R, plus L·di/dt). **Electromigration (EM):** high current density moves metal atoms over time, forming **voids (opens)** or **hillocks (shorts)**, mostly at **vias and narrow wires**.

**Why you care.** The JD names **EM/IR**, and **Bo's internship was EM flow enhancements**. For cells: **output pins of high-drive cells, internal M0/M1 wires, vias, and the power rails** carry concentrated current.

<figure class="fig"><img src="assets/fig/diagrams/em.svg" alt="Why a signal wire can average zero current and still fail EM." loading="lazy"><figcaption>Why a signal wire can average zero current and still fail EM. · Original supplied circuit diagram</figcaption></figure>

**How it works: the three current metrics.**

| Metric | Physical meaning | Limits | Typical for |
| --- | --- | --- | --- |
| **Average (DC)** | Net charge flow in one direction | **DC EM** (atoms drift one way) | **Power rails** (always one direction) |
| **RMS** | **Heating** (I²R) | **Joule heating**, which accelerates EM | **Signal wires** (bidirectional) |
| **Peak** | Instantaneous max | Peak EM / fusing limit | Fast, high-drive switching |

<div class="co co-eq"><p class="co-t">E8 · Black&#x27;s equation (EM lifetime)</p>

```latex
\mathrm{MTTF} = A\, J^{-n}\, e^{E_a / kT} \qquad J = \frac{I}{w\,t}
```
**Remember:** "**more current density or hotter → shorter life.**" n ≈ 1–2; Ea ≈ 0.7–0.9 eV for copper. Double the width at the same current and n = 2 → **4× lifetime**. **Limit:** calibrated per process; the foundry deck sets the real limits.

</div>

<div class="co co-eq"><p class="co-t">E9 · Pulse currents (duty d)</p>

```latex
I_{avg} = I_p\, d \qquad I_{rms} = I_p \sqrt{d} \qquad \text{e.g. } 4\,\text{mA at } 25\% \Rightarrow 1\,\text{mA avg},\ 2\,\text{mA rms}
```
**Remember:** "**average the current; RMS averages the square.**" A signal wire can average **≈ 0** and still have large RMS and peak.

</div>

**What drives cell EM current up?**

- **Higher output load** → more charge per transition → higher avg and RMS.
- **Higher toggle frequency** → more transitions per second.
- **Faster input slew / bigger drive** → higher **peak** current.
- **Hotter** (including FinFET **self-heating**) → exponentially shorter life.

**How cell EM is handled (know the words).**

- **Signal EM at chip level uses cell EM limits.** Characterization can produce, per output pin, the **maximum toggle rate** (or maximum load) before EM limits are hit. Liberty has an **`electromigration`** group (e.g., `em_max_toggle_rate` indexed by slew and load). Tools: **Liberate (Trio EM characterization), Voltus-XFi, Totem, PrimeSim Reliability.**
- **Power EM:** rails and vias carry unidirectional current → **DC EM**; checked with the power grid (static and dynamic).
- **Blech effect:** a short enough wire (**j × L below a critical product**) builds back-stress that stops EM, so **short segments are more robust**.
- **Via arrays and redundant vias:** current splits, and one void doesn't open the path. But **current doesn't always share equally**.

**Fixes and what they cost.**

| Fix | Helps | Costs |
| --- | --- | --- |
| **Wider metal** | Lower J | Area, capacitance, routing |
| **More / redundant vias** | Via EM (often the bottleneck) | Area; DRC |
| **Split the output pin / spread current** | Local J | Layout effort |
| **Lower drive strength** | Lower peak | Slower |
| **Limit max load or toggle rate in the .lib** | Keeps users in a safe region | Restricts designers |
| **Move to a thicker, higher metal** | Lower J | Via stacks, pin access |

<figure class="fig"><img src="assets/fig/diagrams/irdrop.svg" alt="Static vs dynamic IR drop on a cell&#x27;s supply." loading="lazy"><figcaption>Static vs dynamic IR drop on a cell&#x27;s supply. · Original supplied circuit diagram</figcaption></figure>

**IR drop.**

- **Static IR:** average current × grid resistance. **Dynamic IR:** many cells switching together draw a current burst; the grid's R, L and local **decap** decide the droop.
- **Effect:** less VDD → **slower** cells, smaller read and sense margins (worst in memories and at low VDD).
- **Fixes:** stronger grid, more rails/vias, **decap cells**, spreading simultaneous switching.

<div class="co co-eq"><p class="co-t">E10 · Decap sizing</p>

```latex
C_{decap} \approx \frac{I\,\Delta t}{\Delta V} \qquad \text{2 mA for 200 ps, 20 mV droop} \Rightarrow 20\,\text{pF}
```
**Remember:** decap is a **charge budget**: it helps a short burst, not a sustained DC current or EM.

</div>

**What if…?**

- **Average current is zero. EM safe?** **No.** Bidirectional signal current still has **RMS heating** and **peak**; the rule deck decides which limits apply.
- **Widened the metal; still failing?** The **via or contact** is the bottleneck, or current crowds at a corner. Cross-probe the exact failing element.
- **The fastest cell fails EM. Which do I pick?** The one that **meets all constraints**. A slightly slower cell with EM margin beats a fast one without.
- **The new EM script reports 2× violations. Is the design worse?** Not necessarily. Freeze the design; compare mapping, units, thresholds, duplicates. A better detector can find real old issues.
- **Timing fix (upsize) created an EM violation?** More drive = more **peak current** through the same output pin/vias. Recheck EM after every timing fix.
- **Does decap fix EM?** No. It helps IR droop, not conductor current density.

<div class="co co-core"><p class="co-t">Core memory</p>

**IR = voltage now → speed. EM = atoms move over years → opens/shorts. Rails = DC EM (average). Signals = RMS + peak. Load × frequency × slew drive cell EM. Vias are usually the weak point. Every timing fix → recheck EM.**

</div>

<div class="co co-value"><p class="co-t">Value to show Bo</p>

Follow the **whole current path** (device → contact → M0/M1 → via → pin), name the **metric**, and name what the fix **costs**. That's what an EM flow engineer listens for.

</div>

### T1.9 SPICE testbenches & DRC / LVS / extraction

<div class="co co-analogy"><p class="co-t">Picture it</p>

LVS is **checking the building against the blueprint** (same rooms, same doors). DRC is **checking the building code** (hallway widths). Passing both means it's legal and matches the plan, not that the elevators are fast enough (that's post-layout simulation).

</div>

**SPICE testbench: build it in this order.**

1. **Question:** which arc or margin, and what counts as pass?
2. **Circuit:** right pins, supplies, body ties, legal sizes, model corner; schematic or extracted?
3. **Stimulus:** realistic input slew, output load, initial state (e.g., NAND other input = 1).
4. **Analysis:** `.tran` for switching, `.dc`/`.op` for leakage, AC/noise for analog.
5. **Measure:** thresholds (**50% delay, 20–80% slew**), which crossing, time window.
6. **Look at one waveform** before sweeping a thousand points.

**What if…?**

- **Simulation passed but every delay is 0?** The **measurement** failed (no crossing, wrong node, wrong threshold) or a script defaulted to 0. **Missing ≠ zero**: make it a hard failure.
- **Works only with a forced initial condition?** You proved behavior from that state, not start-up. Test real power-up.
- **Hundreds of runs don't converge?** Isolate one; look for floating nodes and bad sources before loosening tolerances.

**DRC / LVS / PEX.**

| Check | Asks | Classic failures | Debug order |
| --- | --- | --- | --- |
| **DRC** | Is the geometry manufacturable? | Spacing, width, enclosure, density, antenna | Fix, re-run; watch that fixes don't change electrical behavior |
| **LVS** | Is it the circuit I meant? | **Shorts**, opens, device-count or size mismatch, wrong well/substrate tie, missing labels | **Shorts first** (they cascade), then opens, then device properties |
| **PEX** | What are the real R and C? | — | Re-simulate: compare schematic vs extracted under identical conditions |

- **Antenna rule:** a long metal line collects plasma charge during etch and can damage a thin gate; fix with a **diode or a jumper to a higher layer**.
- **DRC/LVS clean ≠ done** (Q15).

<div class="co co-core"><p class="co-t">Core memory</p>

**Testbench: question → circuit → stimulus → analysis → measurement → look at one waveform. Missing ≠ zero. LVS: shorts first. Clean ≠ done.**

</div>

### T1.10 Noise: crosstalk, supply and dynamic nodes

<div class="co co-analogy"><p class="co-t">Picture it</p>

Crosstalk is **a conversation at the next table**: if your neighbor shouts (switches) while you whisper (a quiet node), your listener mishears. Static gates speak loudly and recover; dynamic nodes and sense amps whisper and can't.

</div>

**Definition.** Noise = any unwanted voltage on a node: **crosstalk** from neighboring wires, **supply noise** (IR drop and ground bounce), **charge sharing** and **leakage** on dynamic nodes.

**Why you care.** The JD lists noise simulations. A cell or ROM bitline that works in isolation can **glitch or slow down** next to a switching neighbor.

| Noise type | What happens | Fix |
| --- | --- | --- |
| **Crosstalk glitch** | A switching aggressor couples through wire capacitance onto a quiet victim → a bump that can flip a latch or dynamic node | Spacing, **shielding**, stronger victim driver |
| **Crosstalk delay** | Aggressor switching **opposite** to the victim **slows** it (the coupling cap looks like 2×C); **same** direction **speeds** it up | Spacing, shielding, timing windows in signoff |
| **Supply noise** | IR drop / ground bounce shifts the switching point | Stronger grid, decap |
| **Dynamic-node noise** | Charge sharing or leakage droops a precharged node (ROM bitline!) | **Keeper**, precharge internal nodes |

- **Noise margin:** NM_H = V_OH − V_IH, NM_L = V_IL − V_OL. Static cells restore levels; **dynamic** nodes and **sense amps** don't, which is why they're the noise-sensitive ones.
- **In the library:** CCS-noise models describe how much glitch a cell's input can tolerate and how strongly its output holds.

<div class="co co-core"><p class="co-t">Core memory</p>

**Opposite-switching neighbor slows you, same-direction speeds you up. Static gates restore; dynamic nodes and sense amps don't, so they need keepers and margin.**

</div>

### T1.11 High sigma: the must-know version

<div class="co co-analogy"><p class="co-t">Picture it</p>

**One in a billion people** is about eight people on Earth. A 1 Mb array has a million cells, and you need all of them to work on almost every chip, so each cell must be a one-in-a-billion failure. That's what 6σ means here.

</div>

<figure class="fig"><img src="assets/fig/diagrams/sigma.svg" alt="Why memory needs high-sigma methods: the failures that matter are far out in the tail." loading="lazy"><figcaption>Why memory needs high-sigma methods: the failures that matter are far out in the tail. · Original supplied circuit diagram</figcaption></figure>


The job explicitly lists **"high sigma variation simulations,"** so know these four lines cold:

1. **Why:** an array of N cells at yield Y needs a per-cell failure rate below ≈ (−ln Y)/N. **1 Mb at 99.9% → ~1e-9 → about 6σ.**
2. **Why plain Monte Carlo fails:** to see a 1e-9 event you'd need ~1e10 runs. **1,000 clean runs only proves ~2.7σ** (rule of three: p < 3/n).
3. **What's used instead:** **importance sampling** (sample near the failure region, reweight), scaled-sigma extrapolation, statistical blockade. Tool: **Solido**.
4. **Where it applies:** bitcells, ROM read paths, sense-amp offset (5–6σ); flops and logic are usually lower, with LVF in the .lib.

## Tier 2 — How to excel 

Start only after Tier 1 passes the gate (R.7). These are the follow-ups that separate good from strong.

### T2.1 Logical effort, buffer chains & charge sharing

<div class="co co-analogy"><p class="co-t">Picture it</p>

Logical effort is **bike gears**: too big a jump per stage wastes effort, too many stages waste time. About **4× per stage** is the sweet spot.

</div>

**Definition.** **Logical effort (g)** = how much worse a gate is than an inverter at driving, for the same input cap. **Electrical effort (h)** = C_out / C_in. Stage delay **d = g·h + p** (p = parasitic delay).

**Why you care.** It's how you size a path of cells, and why a "faster" cell can slow the path.

<div class="co co-eq"><p class="co-t">E11 · Path sizing</p>

```latex
F = G\,B\,H \qquad N_{opt} \approx \log_4 F \qquad \hat{f} = F^{1/N} \approx 4
```
**Remember:** "**fan-out of 4 per stage**." Driving 64× load from a unit inverter → log₄64 = **3 stages**, sizes **1, 4, 16**.

</div>

**What if…?**

- **Odd stage count needed for polarity?** Take the nearest N with the right polarity; the stage effort moves a bit off 4, but delay is flat near the optimum.
- **Long wire in the path?** It adds R and C; Elmore delay = Σ Rᵢ × (downstream C). Split with repeaters.

**Charge sharing.** A precharged dynamic node (10 fF at VDD) connects to an uncharged internal node (5 fF at 0 V) → **V = VDD × 10/15 = 0.67 VDD**. Can falsely flip the next stage. **Fixes:** keeper, precharge internal nodes, put the input with the big internal node lower in the stack.

<div class="co co-core"><p class="co-t">Core memory</p>

**d = gh + p. Aim for ~4 per stage. Charge sharing = charge conserved: V = VDD·C₁/(C₁+C₂).**

</div>

### T2.2 Level shifters, isolation & power domains

<div class="co co-analogy"><p class="co-t">Picture it</p>

A low-to-high level shifter is a **tug-of-war**: a weak NMOS (driven by the low voltage) must pull the rope against a PMOS holding the other side at the high voltage. If the low side gets too weak, it never wins.

</div>

**Definition.** A **level shifter** moves a signal from a low supply (VDDL) to a high one (VDDH), or back. **Isolation** clamps a signal to a safe value when its domain is off.

**Why you care.** The JD names **level shifters**; they're special cells whose failures depend on **two supplies and contention**, not just a truth table.

<figure class="fig"><img src="assets/fig/diagrams/levelshifter.svg" alt="Low-to-high level shifter: cross-coupled PMOS on VDDH, NMOS driven from VDDL." loading="lazy"><figcaption>Low-to-high level shifter: cross-coupled PMOS on VDDH, NMOS driven from VDDL. · Original supplied circuit diagram</figcaption></figure>

**How it works (low → high).** Input A (0 to VDDL) drives NMOS N1; A_bar drives N2. **Cross-coupled PMOS** on VDDH hold the output.

1. A rises → N1 pulls node X down, **fighting P1**, which is still on (**contention**).
2. As X falls, P2 turns on → X_bar rises to VDDH.
3. X_bar high turns P1 off → the fight ends; feedback completes the switch.

**What if…?**

- **VDDL gets very low (near Vt)?** N1's gate drive is weak and **can't overpower P1**, so X never falls far enough to trigger feedback → **stuck or very slow**. Worst corner: **low VDDL, high VDDH, slow NMOS / fast PMOS, cold**.
- **VDDL = 0 (low domain off), VDDH on?** A and A_bar are both ~0 or floating → the output is **undefined** and may float or burn current. Use an **isolation cell** (clamp to a known 0 or 1) controlled by a power-management signal.
- **VDDH = 0, VDDL on?** Check for back-powering through the input devices and device stress.

**Trade-offs.**

| Knob | Pros | Cons |
| --- | --- | --- |
| **Bigger NMOS** | Wins the contention at low VDDL | More input cap and area |
| **Weaker / current-limited PMOS** | Less contention | Slower rising output |
| **Wilson-mirror / multi-stage shifters** | Work at very low VDDL | More devices, static current |
| **Output buffer** | Isolates the internal nodes from the load | Extra delay |

<div class="co co-core"><p class="co-t">Core memory</p>

**Low→high shifter = cross-coupled PMOS + NMOS pull-downs. Failure = NMOS can't win the contention at low VDDL. Domain off → isolation cell, not a shifter.**

</div>

### T2.3 Clock gating, power gating & retention

<div class="co co-analogy"><p class="co-t">Picture it</p>

Clock gating is **turning off the lights in empty rooms**: the house stays powered and you're back instantly. Power gating is **flipping the breaker**: saves more, but anything in the fridge needs a cooler (retention) and the power-up takes time.

</div>

<figure class="fig"><img src="assets/fig/diagrams/icg.svg" alt="Integrated clock-gating cell (ICG): latch + AND." loading="lazy"><figcaption>Integrated clock-gating cell (ICG): latch + AND. · Original supplied circuit diagram</figcaption></figure>

| Technique | What | Pros | Cons | Best when |
| --- | --- | --- | --- | --- |
| **Clock gating (ICG)** | Stop the clock to idle flops | Big **dynamic** savings (clocks toggle every cycle); state kept; instant wake | ICG area, enable timing, clock insertion delay; **leakage unchanged** | **Short, frequent** idle periods |
| **Power gating** | Header (PMOS) / footer (NMOS) switch cuts the supply | Big **leakage** savings | Switch area, **IR drop** when on, **state lost**, wake-up time and **inrush** current | **Long** idle periods |
| **Retention flop** | Saves state on an always-on supply | Fast restore after power gating | Extra area, always-on routing | Power gating + must keep state |
| **Isolation cell** | Clamps outputs of an off domain | Prevents floating inputs downstream | Timing of isolate/release | Any power-gated domain |

**Why an ICG and not a plain AND gate?** If the enable changes while CLK is high, an AND can produce a **glitch or runt pulse**. The ICG's **latch** (transparent when CLK is low) freezes the enable during the high phase, so the gated clock is always clean.

<div class="co co-core"><p class="co-t">Core memory</p>

**Clock gating cuts dynamic power (keeps state); power gating cuts leakage (loses state, needs retention + isolation). ICG = latch + AND, glitch-free.**

</div>

### T2.4 Metastability & synchronizers

<div class="co co-analogy"><p class="co-t">Picture it</p>

Metastability is a **ball balanced on a hilltop**: it will roll off eventually, but look too soon and you can't tell which way. Waiting one more cycle makes a wrong read **exponentially** rarer.

</div>

**Definition.** When data changes inside the setup/hold window, the flop's internal loop balances near the middle and **resolves slowly and unpredictably**.

<div class="co co-eq"><p class="co-t">E12 · Synchronizer MTBF</p>

```latex
\mathrm{MTBF} = \frac{e^{t_r/\tau}}{T_0\, f_{clk}\, f_{data}}
```
**Remember:** "**exponential in resolution time**." One more flop of wait time multiplies MTBF enormously. τ is set by the regenerative loop's gm/C.

</div>

- **Two-flop synchronizer** for single bits. **Buses:** use an **async FIFO with Gray-coded pointers** (one bit changes at a time) or a handshake. Never synchronize each bus bit separately (bits resolve on different cycles).
- **Can a faster flop guarantee zero failures?** No: it lowers the probability; it never reaches zero.

### T2.5 Memory organization & self-timing

<div class="co co-analogy"><p class="co-t">Picture it</p>

A memory array is a **library building**: the decoder is the **floor directory** (which row), the column mux picks the **shelf**, and the sense amp **reads the faint spine** of the book.

</div>

<div class="co co-guard"><p class="co-t">Source figure unavailable</p>

array: the original referenced asset was not included in the supplied source bundle. 

</div>

- **Words = rows × mux factor; columns = bits × mux.** A 1,024×32 memory as 256 rows × 128 columns uses mux-4.
- **Bitline length = rows** → more C and leakage (ROM!). **Wordline length = columns** → more RC; far cells turn on late.
- **Replica (dummy) bitline:** a spare column that always discharges, generating **SAE** so timing **tracks PVT**. It doesn't track **local** variation of the cell being read → you still need margin.
- **Cycle time** = access + precharge/reset. **Back-to-back reads** fail if precharge doesn't finish.

<div class="co co-core"><p class="co-t">Core memory</p>

**Rows set bitline C and leakage; columns set wordline RC. Replica bitline tracks global PVT, not local mismatch.**

</div>

### T2.6 Variation, yield & high-sigma

<div class="co co-analogy"><p class="co-t">Picture it</p>

Corners are the **weather forecast for the whole city** (global: everything hot or cold together). Mismatch is **two neighbors' houses built slightly differently** (local).

</div>

**Definition.** **Global** variation (corners: SS/FF/SF/FS/TT) shifts every device together; **local mismatch** makes neighbors differ (random dopants, line-edge roughness).

<div class="co co-eq"><p class="co-t">E13 · Mismatch and array yield</p>

```latex
\sigma(\Delta V_t) = \frac{A_{Vt}}{\sqrt{W L}} \qquad Y = (1-p)^N \approx e^{-Np} \qquad p_{max} \approx \frac{-\ln Y}{N}
```
**Remember:** "**4× area → ½ sigma**." For 1 Mb at 99.9% yield → p ≈ 1e-9 per cell → about **6σ**.

</div>

| σ (one-sided) | Failure probability |
| --- | --- |
| 3 | 1.35e-3 |
| 4.5 | 3.4e-6 |
| 5 | 2.9e-7 |
| 6 | 9.9e-10 |

- **Zero failures in n Monte Carlo runs** → 95% bound p < **3/n** ("rule of three"). 1,000 clean runs ≈ **2.7σ**, nowhere near 6σ.
- **High-sigma methods:** **importance sampling** (sample near the failure region, reweight), statistical blockade, scaled-sigma extrapolation, most-probable-failure-point search. Tool: **Solido**.
- **Sigma targets come from array size and yield goals**, not a universal "3σ flops, 6σ memory" rule, though that's the usual pattern.

<div class="co co-core"><p class="co-t">Core memory</p>

**Corners = global; Monte Carlo = local. Yield ≈ e^(−Np). 1 Mb → ~6σ. Zero fails in n runs → p < 3/n.**

</div>

### T2.7 Aging & reliability beyond EM

| Mechanism | What | Worse when | Effect |
| --- | --- | --- | --- |
| **NBTI** (PMOS) / **PBTI** (high-k NMOS) | Vt magnitude rises under bias; partly recovers | Hot, high voltage, long "on" time | Slower cells; SRAM PU weakens |
| **HCI** | High-energy carriers damage the oxide during switching | **Slow input slews**, high Vds, big loads | Slower NMOS over time |
| **TDDB** | Gate oxide eventually breaks down | High voltage | Hard failure |
| **Self-heating** | FinFET channels trap heat | High drive, high activity | Hotter → worse EM and aging |

- **Asymmetric aging:** a sense amp that keeps reading the same value ages one side more → its **offset drifts**. Some designs swap or randomize to balance stress.
- **Aged .libs** exist so timing is signed off at end-of-life.

### T2.8 Math cells: full adders

- **Full adder:** Sum = A ⊕ B ⊕ Cin; Cout = AB + Cin(A ⊕ B). With **G = AB, P = A ⊕ B**: Cout = G + P·Cin.
- **Mirror adder** (28T): symmetric pull-up/pull-down for the carry; the **carry path is critical**, so put **Cin on the transistor nearest the output** and size it up.
- **Ripple-carry** delay grows linearly with bits; **carry-lookahead / prefix** adders trade area for log(n) delay. Compressors (3:2, 4:2) are the library's multiplier building blocks.

### T2.9 Advanced-node transition: FinFET → GAA

| | Planar | FinFET | GAA / nanosheet |
| --- | --- | --- | --- |
| Gate control | One side | Three sides | **All around** |
| Leakage / DIBL | Worst | Much better | Best |
| Width | Continuous | **Whole fins only** | Sheet width tunable (within limits) |
| Pain points | Short-channel effects | Self-heating, fin quantization, parasitics | New layout rules, parasitics, variability |

- **A hand calculation wants 1.5 fins?** Enumerate **legal** options (1 or 2 fins, different Vt or L, topology change) and compare in SPICE.
- **Contact/wire resistance:** if channel R = 1 kΩ and contact+wire R = 1 kΩ, halving the channel R only cuts total R by 25%. Local interconnect matters.
- **Backside power delivery** (future nodes): power rails move under the transistors, freeing routing tracks and cutting IR drop.

<div class="co co-core"><p class="co-t">Core memory</p>

**Physics transfers; legal device choices and parasitics must be relearned. FinFET = quantized width; GAA = all-around gate; contacts matter.**

</div>

### T2.10 Register files

<div class="co co-analogy"><p class="co-t">Picture it</p>

A register file is **a small office with many doors**: several people can come in and out at once (ports), but every extra door takes wall space (area grows fast with ports).

</div>

**Definition.** A **register file** is a small, very fast memory with **many ports**, e.g., 2 reads + 1 write per cycle. GPUs have huge, heavily banked register files feeding thousands of threads.

**How it works.**

- Base cell = **8T**: a 6T storage cell + a separate **read stack** (2 series NMOS: one gated by the storage node, one by the **read wordline**) onto a **read bitline**.
- **Each extra read port adds another read stack, RWL and RBL; each write port adds access devices, WWL and bitlines.** Area grows roughly with the **square of the port count**.
- The read bitline is **single-ended, precharged, with a keeper**: the **same sensing problem as a ROM bitline** (leakage of unselected cells vs one on-cell).

| Pros | Cons |
| --- | --- |
| No read disturb (read port is isolated) | ~30%+ area per bit vs 6T, more per port |
| Multi-port → high bandwidth | Port count explodes area and wiring |
| Fast single-ended reads | Leakage-limited bitline length (like ROM) |

<div class="co co-core"><p class="co-t">Core memory</p>

**Register file = 8T+ cells with many ports. Read port = precharged single-ended bitline + keeper, the same leakage-vs-on-current problem as ROM.**

</div>

## Tier 3 — Good to know (one sentence each) 

- **Importance sampling:** shift the Monte Carlo toward the failure region, then weight the results back; finds 6σ failures with thousands, not billions, of runs.
- **ROM compilers:** generate every size and code from leaf cells; verify the **extremes of the range** (max rows, max columns, each mux option) and worst code patterns.
- **NAND ROM:** cells in series; denser but slower than NOR ROM.
- **CCS / ECSM:** current-source cell models; more accurate than NLDM for timing and noise at advanced nodes.
- **LVF / POCV:** per-arc sigma in the .lib lets STA do statistical on-chip variation instead of flat margins.
- **NVCell (NVIDIA Research):** an automated standard-cell layout generator using reinforcement learning (DAC 2021; routability follow-up in 2023). A good informed question: "Does automated layout generation change how the cell team works?"
- **SKILL / OCEAN:** Cadence scripting for Virtuoso and simulation automation.
- **Blech length:** short enough wires are immune to EM because back-stress balances the electron wind.
- **Temperature inversion:** at low VDD, cold is the slow corner.
- **Footer vs header switch:** NMOS to ground vs PMOS to VDD; footer is smaller (NMOS stronger), header keeps ground clean.

## Résumé defense — only because you claimed it 

Bo reads your résumé and picks. For each project: **what it was, what you owned, three likely follow-ups, the bridge to this role.** [verify] = a fact only you can supply; fill it before Friday.

### RD.1 WICS: implantable auditory front end (TSMC 65nm)

**The 30-second version.** "A **transimpedance amplifier** and **active-RC filter** for the low-noise front end between a MEMS sensor and the ASIC of a fully implantable auditory prosthesis, in **TSMC 65nm** with flip-chip packaging, **subthreshold** for ultra-low power, validated for **stability and noise across PVT** in Virtuoso/SPICE."

**Refresh the theory (you may be asked to draw it).**

- **TIA:** converts sensor **current → voltage**. Resistive-feedback TIA: V_out = −I_in × R_f (within bandwidth). Input impedance is low, so the sensor sees a virtual ground.
- **Subthreshold:** I_D ∝ exp(V_GS/nU_T) → **gm/I_D ≈ 1/(n·U_T) ≈ 25–30 V⁻¹**, the **maximum** possible. Best transconductance per µA, but low bandwidth and exponential sensitivity to Vt and temperature.
- **Noise:** thermal noise current ∝ gm; input-referred noise **falls with more bias current**, so noise and power trade directly.
- **Stability:** feedback loop needs **phase margin** (≈ 60° target). Sensor capacitance at the input adds a pole and can make a TIA ring; compensation (e.g., a feedback cap C_f across R_f) fixes it.
- **Active-RC filter:** op-amp + R and C sets the poles; accuracy depends on RC variation across corners (often tuned or trimmed).

<div class="co co-eq"><p class="co-t">E14 · Subthreshold efficiency</p>

```latex
\frac{g_m}{I_D} \approx \frac{1}{n\,U_T} \qquad U_T = \frac{kT}{q} \approx 26\,\text{mV at 300 K}
```
**Remember:** "**subthreshold = max gm per amp**", but gm ∝ I, so bandwidth ∝ current.

</div>

**Three-deep chain.**

1. **"Why subthreshold?"** Implant: power is everything, and weak inversion gives the most gm per µA.
2. **"What broke across corners?"** [verify: e.g., phase margin at SS/cold, or noise at low bias.] "I fixed it by [verify]." Condition → symptom → hypothesis → change → re-check.
3. **"How does that relate to cells?"** Subthreshold current is exponential in Vt and temperature, the same physics behind **leakage**, **temperature inversion** and **low-VDD cell and ROM margins**.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Know your numbers: supply, bias current or power, bandwidth, transimpedance/gain, integrated noise, phase margin, corner set, and schematic vs layout status. If you don't remember one: "I don't recall the exact number; it was measured as X."

</div>

### RD.2 Faraday: DFT/STA, UMC 22nm, 1.5-month tapeout

Scope first (F1.1). Then:

1. **"Read me a timing report."** Startpoint, endpoint, launch/capture clock, **data arrival**, **required time**, clock skew, uncertainty, **cell vs net delay**, **slack** (required − arrival; negative = violation). First decide: **real path problem or constraint problem** (missing clock, wrong exception)?
2. **"How did you fix a violation?"** Setup: speed the path (upsize, buffer, restructure) or relax a wrong constraint. Hold: **add delay**. Re-run **all corners**.
3. **"What's scan / ATPG?"** Scan turns flops into a **shift register** in test mode so ATPG can **control and observe** internal state; ATPG generates patterns for a **fault model** (stuck-at, transition); **coverage** = % of modeled faults detected.
4. **"What did your automation do?"** [verify: inputs, what it checked, how it flagged failures, what it saved.]

- **Bridge:** "STA is only as good as the **.lib** it reads. I've felt what an inaccurate or missing arc does downstream."
- **CDC** (if asked): two-flop synchronizers for single bits; async FIFO with Gray pointers for buses.

### RD.3 NTT accelerator (EECS 627, Jan–Apr 2026): what the repo actually shows

This section is rebuilt from **reading the full team repo** (RTL, testbenches, Python models, DC synthesis and Innovus scripts). Facts marked *(inferred)* come from code structure, not from a report.

<figure class="fig"><img src="assets/fig/diagrams/nttfloor.svg" alt="EECS 627 NTT chip as built in the repo: top-level floorplan (left) and the sram_row block (right). Block outlines and positions from the Innovus scripts, to scale; SRAM macro footprints approximate." loading="lazy"><figcaption>EECS 627 NTT chip as built in the repo: top-level floorplan (left) and the sram_row block (right). Block outlines and positions from the Innovus scripts, to scale; SRAM macro footprints approximate. · Original supplied circuit diagram</figcaption></figure>

#### Facts you can state with confidence

| Item | What the repo shows |
| --- | --- |
| Process | **IBM 130nm (cmos8rf), 8 metal layers (top 2 thick)**, ARM/Artisan standard cells (the "…TR" cells: INVX2TR, ANTENNATR, FILL*TR), Artisan pads |
| Tools | **Synopsys DC** (synthesis), **Cadence Innovus** (APR), Calibre **v2lvs** for LVS netlists, **VCS** for RTL and SDF-annotated gate-level sim |
| What it computes | Forward/inverse **NTT for n = 256 and 1024**, 32-bit coefficients, plus element-wise multiply → full **polynomial multiplication**; **4 moduli ("schemes") loadable at runtime** over the serial interface |
| Core | **16 radix-2 Cooley-Tukey butterfly PEs**, one butterfly per PE per cycle; **Pease constant-geometry** schedule, so PE-to-PE wiring is a **fixed perfect shuffle**, not a network. n=1024 = 10 stages × 32 cycles = **320 compute cycles** |
| Math | **32-bit Barrett modular multiplier**, fully combinational in the PE (three multiplies + correction in one cycle); **48 modmults** in the chip (16 in PEs, 32 in the permutation rows) |
| Memory | **16 × ROW_SRAM** (512 × 64, **true dual-port**) = **64 KB** data *(inferred from ports)*; **48 twiddle macros** (16 × [one 512×32 SRAM + two 128×32 register-file macros]); **22 dual-clock two-port RF macros** as async-FIFO storage; about **128 Kb of flop-based register files** (PE ping-pong buffers + 32×32 files in the permutation block) |
| Clocks | Core **100 MHz** (10 ns); DMA/AXI clock ~**278 MHz** synthesis target, **312.5 MHz** in the chip testbench; a **÷4 clock via a latch-based ICG** (12.5% duty) feeds the DMA side of the FIFOs; both clocks from **on-chip ring oscillators** built from clock buffers |
| CDC | **Gray-code async FIFOs** with **2-flop synchronizers**, depth 16; clocks declared **asynchronous groups** |
| Physical hierarchy | **Hierarchical**: each of the **16 PEs hardened as its own block** (the PE index is baked into its logic), plus 2 permutation rows, 16 LUT blocks, controller → integrated in **NTTcore (7.0 × 6.4 mm)** → top with two **sram_row** blocks, DMA, SPI, 2 ring oscillators, pad ring. **Die 10 × 9 mm** |
| Timing closure | **PEs 12, 14, 15** failed slack and got **extra targeted optimization passes** in the scripts |
| Verification | Python golden models (naive → fast NTT → cycle-schedule model) generate per-cycle gold for all 16 PEs; post-APR chip sim with **SDF on 36 blocks** (max corner) |
| Status (unchanged) | Blocks individually DRC/LVS clean (per the team report; the repo's DRC is Innovus `verifyGeometry`, reports not committed); **top-level DRC/LVS not closed**; the **low-DMA-frequency functional bug** |

<div class="co co-guard"><p class="co-t">Things the repo shows were NOT done: never imply them</p>

- **Only one corner** (TT, 1.2 V, 25 °C). The "best/worst" views all point at the typical library. **No SS/FF signoff, no derates.**
- **No IR-drop or EM analysis.** The power-estimate script was never adapted. The 1.16 W figure is a synthesis estimate.
- **No clock gating inside the NTT core**; LUT macros are always enabled.
- The on-chip **ring NoC was dropped**; don't describe it as part of the chip.
- The controller is **counter-based index generation, not a microcode ROM**.
- Don't claim ML-KEM compliance.
- Not taped out, no silicon.

</div>

#### Your part: confirm it before Friday [fill in]

Two traces in the repo point to you: a comment in the **LUT floorplan script** ("*Bao these were the tentative placements we had*"), and the **SPI block's SDF** being read from **your** work directory. The bible has said "physical integration, including the memory blocks". **Decide exactly which blocks you ran** (LUT? SPI? sram_row? top-level assembly? LVS prep?) and say only those. **[verify: list your blocks]**

#### The honest two-minute answer (updated)

> "Our team built a configurable NTT accelerator in **IBM 130nm**. It's the polynomial-multiply engine behind post-quantum and homomorphic encryption. It has 16 butterfly PEs with Barrett modular multipliers, about 86 memory macros (dual-port data SRAMs, twiddle SRAMs and register files, and dual-clock FIFO macros), and a DMA with async FIFOs. We did it **hierarchically**: each PE hardened separately, then integrated. **My part was physical integration**: [your blocks], floorplanning the memory macros, power grid and pin planning, and DRC/LVS/antenna fixes. Blocks came out clean. **Top-level DRC/LVS wasn't closed** by the deadline, mostly power-stripe and antenna issues at the top. And we had a functional bug at low DMA clock that I've since traced to a likely cause. **What I took away:** leave real time for full-chip closure, and treat interfaces and clock ratios as seriously as the core."

#### Physical-design details you can cite (only for blocks you touched)

- **sram_row (1150 × 7150 µm):**
    - **8 dual-port 512×64 SRAMs** stacked vertically at ~770 µm pitch, rotated R270, fixed, with asymmetric halos.
    - **11 FIFO RF macros** clustered at the bottom, near the DMA.
    - Floorplan evolved from a **6.2 mm × 1.0 mm landscape row** to a **portrait stack** along the die edge, so two mirrored rows flank NTTcore.
- **Pins:** ~**1,100 NTT-side pins on M3 at 5 µm pitch**, **interleaved per bank** by a Tcl procedure so each SRAM's request/response pins sit beside it. DMA-side pins on M2 at the bottom.
- **Power grid:**
    - Rings on M2/M3 + M4/M3; **vertical M2 over the SRAM column, M4 over logic, both 20 µm pitch**; **horizontal M5 in bands broken around the macros**.
    - Power exported to the parent **only on M5**.
    - At top: **5 stacked rings**, **M6 stripes at 31 µm pitch aligned to NTTcore's internal grid**, M7/M8 at 50 µm.
- **CTS:** two **asynchronous** clocks in sram_row with separate skew groups; the SRAMs' **CLKA→CLKB timing arcs disabled**.
- **Antenna:** router diode insertion everywhere, plus a script that **attached 608 antenna diodes** to long inter-block buses in NTTcore.
- **LVS prep (v2lvs):** three manual fixes:
    1. Make power pins **inout ports** in the physical netlist.
    2. Reconnect the **I/O-supply pad pins** (not defined as power pins in the tech files).
    3. Convert the SRAM compiler's CDL bus brackets **[] → <>**.
- **Hold fix at the SRAM pins:** twiddle-SRAM **address/WEN inputs pass through transparent-low latches** to avoid hold violations.

#### The low-DMA-frequency bug: now you have an answer

<div class="co co-eq"><p class="co-t">The physics first (say this, it&#x27;s the circuit-designer answer)</p>

**A failure that appears only at *lower* frequency is not setup timing**: slowing the clock *adds* setup slack. **Hold doesn't depend on frequency.** So the cause must be a **rate or clock-ratio assumption**: something that only goes wrong when one side becomes the slower one.

</div>

Two code-level hypotheses, both frequency-dependent. **Present them as hypotheses from reviewing the code afterward**, not as proven root causes:

1. **Write-back race in the row controller.**
    - While a finished result is still **draining to DRAM**, the **next NTT's results can interrupt the drain**.
    - The "which slot is draining" pointer only advances when a drain *completes*, so the new results are **stored into the same SRAM slot still being drained**.
    - Drain time scales with the **DMA clock**; NTT compute time is fixed in **core cycles**. Fast DMA: the drain always wins. Slow DMA: it loses → corrupted outputs.
2. **Testbench load race.**
    - The test loads the instruction image, waits a **fixed 1 µs**, then **overwrites the same memory region with data**.
    - Fetching 64 instruction lines takes ≥ 256 DMA cycles: ~0.8 µs at 312 MHz, but **~1 µs near 250–300 MHz**.
    - Below that, the chip fetches data bytes as instructions.
    - The threshold lands right where the failure was seen.

**Debug plan** (what you'd actually do):

1. **Sweep the DMA clock** with the core clock fixed, and find the exact threshold.
2. **Replace fixed waits with handshakes** (or separate the memory regions). If the failure moves or disappears, it was the testbench.
3. Add **assertions**: FIFO overflow, drain/store slot collision, response counts.
4. **Diff the memory dump against the golden model** to find the first bad word.

<div class="co co-value"><p class="co-t">Why this story now works for you</p>

It shows the **Intellectual Honesty** value (you name what wasn't closed) plus **debug discipline**: reason from physics, form a frequency-dependent hypothesis, design the experiment. That's the NVIDIA "leakage with minimal compute" style of thinking applied to your own project.

</div>

#### How this project maps to the NVIDIA JD

| JD line | Your evidence from this project |
| --- | --- |
| DRC/LVS debug | Block DRC/antenna loops; **v2lvs netlist fixes** (power ports, pad supplies, bus brackets); **608 antenna diodes** on long buses; honest top-level non-closure |
| SRAM, register files | Integrated **dual-port data SRAMs, single-port twiddle SRAMs, register-file macros, dual-clock FIFO RFs**; saw why **multi-port flop register files** were used where macros couldn't provide 2R2W with async read |
| Flip-flops, math cells | **Latch-based ICG**, latches as a **hold fix** at SRAM inputs, **Barrett modmult** as the timing-critical math block |
| Scripting (Tcl, Make, automation) | **Make pattern rules running 16 PE syntheses/APRs in parallel**, env-var-parameterized Tcl, Tcl procs for **pin interleaving, route blockages, diode attachment** (claim only the ones you wrote) |
| Custom ROM | **Twiddle factors are a textbook ROM use case** (constant, read-only, deterministic access). We used SRAM because the **4 moduli load at runtime**. With fixed parameters, a ROM would be denser, lower-power, need no init sequence, and could keep only each PE's ~67 unique twiddles |
| EM/IR, aging, noise, margin, high sigma | **Gap.** Say it: "We signed off at a single typical corner with no IR/EM analysis; that's exactly the rigor I want to learn." Then show you know what you'd add (SS/FF corners, rail analysis on the SRAM power bands, EM on the M5 straps) |

<div class="co co-value"><p class="co-t">The ROM bridge (use it if ROM comes up)</p>

"In our NTT chip, the twiddle factors were **the one thing a ROM is perfect for**: constants, read-only, accessed in a fixed order. We stored them in SRAM because we wanted four moduli loadable at runtime. With fixed parameter sets you'd use a **ROM**: denser, lower leakage, no write path, no init sequence. That trade-off is part of why I'm interested in the ROM team."

</div>

#### Likely follow-ups (short answers)

- **"Why rotate the SRAMs / why those halos?"** To put the SRAM pins on the side facing NTTcore and keep the stack narrow; halos leave room for pin access and power connection. *(Only if it was your block.)*
- **"How did you choose stripe pitch?"** Honestly: course-template pitches (20 µm in blocks, 31–50 µm at top) with **no IR analysis**. "At NVIDIA I'd size them from a rail analysis and the SRAM peak current."
- **"What were the top-level failures?"** Power-stripe and antenna issues at integration. Likely causes: **mismatched power-pin layers between block abstracts**, stripe gaps, via stacks dropping into blocks. "I'd isolate them by layer and by block boundary."
- **"How did you verify post-layout?"** SDF-annotated gate-level simulation of the full chip at the max corner, compared against Python gold. **Gaps:** no min-delay (hold) corner, one typical corner.
- **"Why a latch in front of the SRAM inputs?"** A transparent-low latch holds address/WEN stable through the clock-high phase, adding **hold margin** at the macro pins where the SRAM's hold requirement is large.
- **"Why Gray code in the FIFO?"** Only one bit changes per increment, so a pointer sampled mid-change is off by at most one: safe for full/empty (pessimistic, never wrong).

### RD.4 16-bit RISC processor with SRAM PUF (EECS 427)

[verify first: what exactly you built.] **If you worked on the PUF:** "An **SRAM PUF** uses each 6T cell's **power-up state**, set by random **mismatch** between its two inverters, as a chip-unique fingerprint. It's the mirror image of bitcell design: memory designers **fight** mismatch; a PUF **exploits** it. Noise and temperature make some bits unstable, so real PUFs need enrollment and error correction."

### RD.5 8-bit dual-mode ripple adder (power/speed)

"Critical path = the **carry chain**. Speed: optimize the carry path (Cin on the transistor nearest the output, inverting carry to skip inverters). Power: smaller devices off the carry path. [verify: what you changed.] Full adders and compressors are the **math cells** in the JD."

### RD.6 Mixer-first receiver & Windmill divider (WICS 2023)

"**Mixer-first** puts the passive mixer before any RF gain; baseband impedance is reflected to the input. I researched **ring oscillators and dividers** and modeled a **Windmill divider** for low-power **quadrature** clock generation. [verify: 1–2 honest sentences on why it was novel.]" Safe ground: **ring oscillator frequency = 1/(2·N·t_stage)**, which is why ring oscillators are on-chip **process-speed monitors**, and a divider is **flop timing**.

### RD.7 PetersonLab: wide-bandgap thin films (SURE 2022)

"PVD metal contacts with shadow masks, a **multi-temperature anneal study** on conductivity and morphology, **Hall/PPMS** characterization."

- **Hall:** a magnetic field deflects carriers → transverse voltage → **carrier type and concentration**; with resistivity → **mobility** (μ = |R_H|/ρ).
- **Why anneal matters:** drives contact formation; too little → non-ohmic; too much → degraded morphology. A **thermal-budget** trade-off.
- **Bridge:** "At advanced nodes, **contact resistance** is a real part of a cell's delay."

### RD.8 Other lines (one sentence each, then pivot)

- **Bandgap reference:** CTAT (V_BE falls with T) + scaled PTAT (ΔV_BE rises with T) → flat; needs a **start-up circuit** (zero-current state).
- **EECS 215 GSI (400+ students):** "Explaining circuits simply to beginners forced me to really understand the fundamentals."
- **miLEAD (four startups, Oct 2024–Aug 2026):** market research, outreach to 2,000–4,000 potential consumers per project. One sentence, then back to circuits.
- **ARTiculate, case competitions, certificate:** one line each; "communication and structured thinking; my center of gravity is technical."

## Part A2 — Full answer library

The complete answers: motivation, the why-circuit-design bridge, your path and commitment, the résumé walk-through, transcript, every behavioral, and the deep-dives. The parts above are the distilled priorities; this is the full library to draw from.

### PART A — Motivation & fit

#### A0. "Tell me about yourself." (almost always the opener)

> Sure. I'm originally from Vietnam and came to Michigan for engineering. I did my undergrad in materials science with an EE minor. I loved the device side, why transistors behave the way they do, so I leaned into VLSI and analog and graduated summa cum laude. Then I did a master's in integrated circuits and VLSI. Along the way I've worked on both sides of the chip: at Faraday I taped out a 22nm ASIC, owning the DFT and timing signoff on a six-week timeline; in Prof. Wentzloff's WICS lab I designed ultra-low-power analog front-end blocks for an implantable device in TSMC 65nm, validated across PVT corners; and earlier I did hands-on device and thin-film work in the cleanroom. What that mix taught me is that the part I care about most is where device physics turns into something designers can build with. A standard-cell and ROM library is exactly that, which is why I'm excited about this role. Outside the technical work, I like building things with people: I founded the Vietnamese student association at Michigan and grew it from three of us to over ninety.

<div class="co co-why"><p class="co-t">Why this works</p>

A 60–75 second arc: origin → education → both sides (device and design) → the bridge to *this* role → a human note. It plants "physics becomes a library" before they ask "why this role."

</div>

<div class="co co-guard"><p class="co-t">Guardrail</p>

Keep it to ~75 seconds. Give the arc and let them dig. Don't list consulting or case competitions here; let them come up later if they do.

</div>

#### A1. "Why NVIDIA?"

> Two reasons. First, NVIDIA is where the hardest chips are being built right now. The data-center GPUs are near the reticle limit and power is the ceiling, so every bit of efficiency at the transistor level matters at a scale nobody else has. Second, and more specific to me: at the leading edge everyone uses the same foundry process, and the libraries are one of the few places a design company can pull more out of that process than its competitors. I'd rather work on that layer at NVIDIA than anywhere else, because here it directly sets what the products can do.

- **If they want more:** mention CUDA making the GPU a general computer, the move to full platforms (GPU, CPU, networking, systems), and that data center is now about 92% of revenue (Part N).

#### A2. "What do you know about this role?"

> It's a foundation-IP role: designing the transistor-level standard cells and custom ROMs that every NVIDIA chip is built from. Day to day that means designing and sizing cells, simulating them across corners and Monte Carlo, checking EM, aging and noise, getting layout DRC/LVS clean, and characterizing them into libraries the synthesis and timing tools use. On the ROM side, it's the array, decoder and sense path, verified with enough margin at high sigma, plus the flows that generate and check them. The customers are internal, the design teams, so quality checks and supporting them matter as much as the design itself.

#### A3. "Why this kind of circuit work, and not analog or process integration?"

> Because it's the circuit work closest to the device. Analog was where I learned to design for margin, but each block is one instance. Process integration is about making the device yield. Standard cells and ROM sit between them: transistor-level design that has to respect every device effect, deployed billions of times. That combination of physics and leverage is the thing I want to go deep on.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Don't dismiss analog or process work; you may be asked by someone who loves it. Frame this role as where your interests meet, not as escaping something.

</div>

#### A4. "Are you willing to relocate and work on-site in Santa Clara?"

> Yes, fully. I know it's an on-site role, and for this kind of work I'd want to be near the team anyway. The fastest way to learn a library flow is sitting next to the people who built it.

#### A5. "Where do you see yourself in five years?"

> Growing deep here. The first couple of years, getting genuinely good at owning cells or a ROM end to end: design, margins, characterization, and supporting the design teams. Then a harder problem, ideally a new-node library bring-up where nothing exists yet. Five years out, I'd like to be the person newer engineers come to when a cell or a margin issue is hard.

#### A6. "Where in ten years?"

> Far enough out that I'd rather give the direction than pretend I've mapped the title. The direction is deep technical ownership of foundation IP at the leading edge, with enough node transitions behind me to have real judgment. Whether that's a technical track or leading a team, I'll follow where I add the most.

<div class="co co-guard"><p class="co-t">Register note</p>

Rooted and specific, like TSMC. Not the expansive McKinsey energy. They're hiring an engineer to own cells, and they want someone who'll stay and get deep.

</div>

#### A7. "NVIDIA runs at a very fast, intense pace. How do you feel about that?"

> I do better with real ownership and pace than without it. The Faraday tapeout was a six-week sprint from RTL to GDSII, and I ran grad research, teaching 400-plus students and consulting at the same time. What grad school taught me is to flag problems early and triage honestly instead of grinding silently. That's how you keep up at a fast pace without dropping things.

#### A8. "What makes you a good fit? Why should we hire you?"

> Three things. I understand the device underneath a cell, from materials science and near-threshold design. I understand the flow that consumes the cell, from signing off a 22nm chip. And I'm honest and fast at learning what I don't know yet, like memory design, which I've been working through from first principles. Most candidates are strong in one of those. For a library team, which sits between the device and the design flow, having both sides is the fit.

### PART B — The "why circuit design" narrative (your bridge)

Your recent record reads design + process + entrepreneurship, and an interviewer may quietly wonder whether circuit design is one option among many. This is the answer that closes that door. Say it with conviction.

> My path has run in both directions. I've done the device side: materials science, thin-film deposition, annealing studies, electrical characterization in the cleanroom. And I've done the design side: ultra-low-power analog in the WICS lab and a 22nm tapeout at Faraday. What kept pulling me back is the boundary between them: how a device's physics limits what a designer can do. A standard-cell library is where that boundary gets encoded. The cell designer decides how the device's speed, leakage and variation turn into something a billion-transistor chip can use. That's the specific thing I want to master. It's not a fallback; it's the job that uses both halves of what I've done.

- **If an interviewer came from analog or device work themselves:** "Then you know exactly why that boundary matters."

### PART B2 — Your path, future & commitment (the hard questions: read this one twice)

The facts only look like drift if you tell them as drift. Told as convergence, where you tested paths and this is where they pointed, the same facts read as maturity. Every answer below is built to be true; if something isn't true for you, fix the fact, not the spin.

#### B2.0 The master narrative

Use D2.0. Every answer in this cluster resolves back to it.

#### B2.1 "Why did you quit the PhD?"

> It was a deliberate redirect, not a washout. I went in wanting depth, and I got it, but I realized I want to be close to real products and real silicon, and a five-year thesis narrows you onto one problem for a long time. Once I was honest with myself about that, the master's was the faster, better path to the work I care about. I'd rather make that correction than spend years on the wrong track out of momentum.

<div class="co co-guard"><p class="co-t">Do / Don&#x27;t</p>

Do: frame as clarity. Don't: badmouth research or your advisor, or say "I burned out."

</div>

#### B2.2 "Why consulting? Why the business detour?"

> Curiosity. Alongside my research, I wanted to understand how technology becomes a product, so I consulted for biotech startups. I don't regret it: it made me better at communicating with non-engineers and at thinking about the "why" behind the technology. But it clarified the opposite of what I expected: I'm happiest with my hands on the technology, not advising it from a slide. That's a big part of why I'm here for a transistor-level role.

#### B2.3 "Why circuit design now?"

> Because it's where the rest of my path pointed, and I finally know it. I've done device work, analog design and a digital signoff flow. A library role is the one place that uses all three. "Why now" is that I've tested the alternatives, deep research and the business side, so instead of wondering, I know what fits. That's a more durable reason to commit than if I'd never questioned it.

#### B2.4 "Your interests seem to be everywhere. How do I know you're focused?"

> I understand why it looks that way on paper. The honest version is that I explored deliberately, research and then the business side, because I wanted to choose from experience, not assumption. What looks like scattered interests was actually me narrowing down. The exploring is over: it converged on hands-on silicon, which is why I'm here for this specific role and not still sampling.

#### B2.5 "How do I know you'll stay?" (the commitment question)

> The reasons I redirected before don't apply here. I left research because it was too narrow and too far from real products; I didn't pursue the business path because it was too far from the technology. This role is both technical and real, at a scale nobody else has. So it's not another way-station; it's where those earlier reasons point. And I don't make changes lightly: I went all in on the PhD, and it took real reflection to change course.

<div class="co co-core"><p class="co-t">Most important answer for you</p>

Rehearse B2.5 until it's calm and natural. It's rarer at NVIDIA than at TSMC, but if it comes, it decides the interview.

</div>

#### B2.6 Owning the "all-in, then redirect" pattern

If it comes up directly: "I commit hard to things. What I've learned about myself is to pair that with honesty about fit and to redirect from clarity rather than sunk cost. Each redirect taught me what I want, and they all point the same way. The all-in energy you'd get from me here is the same, but this time it's pointed at the thing I've confirmed I want."

<div class="co co-guard"><p class="co-t">Guardrail</p>

Don't name consulting as the reason you left the PhD track, and don't claim it only started afterward (the dates overlap). That's what made it read as drift at McKinsey. The destination was hands-on silicon; consulting was a test you ran.

</div>

#### B2.7 "Tell me about the conversation with your advisor."

> It was a good, honest conversation, and we're on good terms. What he reflected back was that my strength is breadth across a system rather than drilling one narrow research problem for years, and that my hands-on, applied skill set would do well in industry. Hearing that from someone who worked closely with me gave me confidence it was the right call.

- **If pushed "so he thought you weren't cut out for research?"** "Not that. More that my strengths point to applied, cross-domain work, and he was honest enough to say so."

<div class="co co-guard"><p class="co-t">Guardrail</p>

Say "broad across the system," never "unfocused." Don't volunteer that the door back was left open.

</div>

#### B2.8 "Would you ever go back to a PhD?"

> I'm focused on building an industry career. That's the direction I've chosen.

Short, forward, closed. Don't elaborate.

#### B2.9 Guardrails for this whole cluster

1. **Never volunteer consulting, an MBA or startups as a plan.** If the résumé raises them, frame them as a test that pointed you here.
2. **Convergence, not drift.** Every "why I left X" ends by pointing at this role.
3. **Rooted, specific, modest.** They're hiring an engineer to go deep.
4. **Honesty over polish.** A calm true answer beats a smooth evasion, and at NVIDIA intellectual honesty is a named value.

### PART C1 — Résumé walk-through: every line, NVIDIA angle

You submitted the same résumé as for TSMC, so the lines are the same. What changes is the **angle**: every line should land on something a cell or memory team values. Each entry has a 2–3 sentence spoken answer, the likely follow-up, and what to land. [verify] = a specific only you can fill.

#### Education

**MS, Electrical & Computer Engineering (Integrated Circuits & VLSI), University of Michigan, Winter 2026.** "My master's focused on integrated circuits and VLSI: analog and digital IC design, VLSI, and the full design flow. I started on the PhD track and moved to the master's."

- **Land:** the IC/VLSI focus; if they ask about the PhD switch, go to B2.1.

**BS, Materials Science & Engineering, EE minor, 3.89, summa cum laude.** "Materials science gave me the device side: thermodynamics, kinetics, thin films, how defects and interfaces change electrical behavior. The EE minor pulled me into circuits."

- **Land:** "It's why I think about a cell from the device up: leakage, variation, why a contact's resistance matters at advanced nodes."

#### Work experience (most recent first)

**miLEAD — Project Manager & Life Science Consultant (Oct 2024–Aug 2026).** "I led market-entry and pivot strategy for four pre-clinical biotech startups, the largest valued around $55M, with outreach to 2,000–4,000 potential consumers per project and presenting recommendations to leadership."

- **Follow-up:** "Why consulting, if you want circuits?" → B2.2. Keep it brief; don't let it pull focus.
- **Land:** communication with non-engineers; learning an unfamiliar domain fast.

**Graduate Student Instructor — EECS 215, Intro to Electronic Circuits (Aug 2025–May 2026).** "I taught intro circuits, lectures, office hours and labs, and built lab materials on amplifiers for a class of 400-plus students."

- **Follow-up:** "What was hard?" → [verify: e.g., explaining one concept several ways until it clicks].
- **Land:** "Teaching forced me to understand fundamentals well enough to explain them simply, which is exactly what a whiteboard interview tests."

**WICS Lab — Graduate Student Researcher (Jul 2024–Nov 2025).** (Defense: RD.1.) "I designed ultra-low-power circuit blocks for an implantable auditory prosthesis: a transimpedance amplifier and an active-RC filter for a low-noise front-end at the MEMS–ASIC interface, in TSMC 65nm with flip-chip packaging, validated across PVT corners in Virtuoso and SPICE."

- **Land:** transistor-level design, subthreshold operation, corner validation, a TSMC process. That's most of a cell designer's toolkit.

**Faraday Technology — DFT/STA Engineer (Jan–May 2024).** (Defense: RD.2; scope first with F1.1.) "I owned chip-top DFT and STA for a UMC 22nm ASIC shuttle, RTL to GDSII, in about six weeks: scan, MBIST, ATPG, ATE patterns, PrimeTime timing debug, and Tcl/Perl automation. I got a top-10% rating."

- **Land:** "I was a customer of the libraries and memory compilers this team builds" (F1.3).

#### Skills (they probe this: "which of these can you go deep on?")

**EDA: Virtuoso, SPICE, Design Compiler, Innovus, PrimeTime, NCVerilog, Verdi.** "Virtuoso and SPICE for transistor-level design and simulation; Design Compiler for synthesis; Innovus for place-and-route; PrimeTime for timing signoff."

- **If asked "pick one and go deep":** for this role, **Virtuoso/SPICE** (your WICS work) or **PrimeTime** (Faraday). Don't claim depth on a tool you only touched.

**Characterization: SEM, EDX, Hall, PPMS, evaporator, RTP.** "On the device side I've run PVD deposition, RTP anneals, and characterized films with SEM, EDX, Hall and PPMS."

- **Land:** "I've measured device-level electrical behavior directly, so SPICE model corners aren't abstract to me."

**Languages: Tcl, Perl, Python, C/C++, Verilog/SystemVerilog, MATLAB, Linux.** "I automate flows. I built DFT/STA automation in Tcl and Perl at Faraday."

- **Land:** the JD asks for Perl, Tcl, Make and automation. This is a direct match.

#### Projects

**NTT accelerator (EECS 627).** (Defense: RD.3.) Team project in **IBM 130nm** (DC + Innovus, hierarchical: 16 PEs hardened separately). Scope to your part: back-end physical integration, the memory-block layout in Innovus, and block-level DRC/LVS fixes. **Top-level DRC/LVS was not closed** by the deadline; say so plainly. Teammates drove the algorithm.

- **Land:** "It's my hands-on DRC/LVS debug experience, and it was on the memory blocks."

**Mixer-first quadrature RF front-end (WICS, 2023).** "A mixer-first quadrature receiver in TSMC 65nm for low-power IoT. I researched ring oscillators and dividers and modeled a novel 'Windmill' divider for low-power quadrature clock generation."

- **Follow-up:** "What's the Windmill divider?" → [verify: 1–2 honest sentences]. If thin: "That was more research and modeling," then pivot.
- **Land:** "Ring oscillators are also how fabs and library teams monitor process speed, and a divider is built from flops, so it connects to flop timing."

**Selected analog & digital projects (EECS 311/312/413/427).** "A three-stage BJT amplifier, an 8-bit ripple-carry adder optimized for power and speed, a multi-stage amplifier, a bandgap reference, and a 16-bit RISC processor with an SRAM PUF."

- **For NVIDIA, lead with two:** the **8-bit adder** (RD.5: a "math cell" in the JD) and the **SRAM PUF** (RD.4: built on 6T-cell mismatch).

**Energy-harvesting sensor board (WICS, 2022–23).** "I built a board to characterize a commercial sensor, wrote C to monitor it, and designed a portable board around its power profile with an integrated energy harvester."

- **Land:** power awareness; hands-on hardware. One or two sentences.

**PetersonLab — wide-bandgap thin films (SURE 2022).** (Defense: RD.7.) PVD contacts, a multi-temperature anneal study, Hall/PPMS characterization.

- **Land:** device physics and experiment design.

#### Honors (asked last, if at all: keep short, pivot to technical)

- **ARTiculate — Ross+Tech Innovation Jam winner (2025):** "An AI drawing-therapy app for autistic kids. I led customer discovery, prototyping and the pitch." One line.
- **Case competitions (team leader, semifinalist):** one sentence, then steer back: "those were about structured thinking and communication; my center of gravity is technical."
- **Graduate Certificate in Innovation & Entrepreneurship (2026):** one line; "understanding how technology gets commercialized," not a pivot.

<div class="co co-core"><p class="co-t">Rule for the whole walk-through</p>

For anything you don't retain well, give the honest two-sentence version and pivot to a project you own (WICS, Faraday, NTT physical side, PetersonLab). Never inflate a team contribution into sole ownership. NVIDIA engineers will feel it, and intellectual honesty is a core value.

</div>

### PART C — Transcript & record (be calm, own it, pivot)

NVIDIA may ask for a transcript or just ask about GPA. Same answers as TSMC.

#### C1. "Walk me through your academic record."

> Undergrad I did materials science with an EE minor and graduated summa cum laude, around 3.9. I was strongest where materials meets devices, plus the VLSI and analog side through the minor. Grad school I focused on ICs and VLSI. My grad GPA is lower than undergrad, and I'm happy to talk about why: there was a real transition in the middle of it.

#### C2. "Why is your grad GPA lower?"

> A few honest things. Graduate IC and VLSI coursework is a real step up, and I was carrying research, teaching and consulting at the same time. The bigger factor is that I changed direction mid-program, from the PhD track to the master's, and that transition was rough for a stretch. I owned it and pulled it back up; my most recent term is strong.

#### C3. "You were on academic probation in Fall 2025."

> Yes, that was the roughest stretch of that transition. I was moving off the PhD track, taking hard courses, and overextended. I took it seriously, fixed how I was managing everything, cleared it that same term, and finished the next term strong. It's not a moment I'm proud of, but it's the clearest example I have of recovering under pressure and fixing a problem instead of letting it slide.

<div class="co co-guard"><p class="co-t">Guardrail</p>

Two sentences of ownership, then the recovery. Don't over-explain or sound rattled.

</div>

#### C4. "You got a B− in Analog Integrated Circuits."

> Fair, that was during the tough stretch, and I won't argue the grade. What I'd say is the material stuck: I've done analog design hands-on since in the WICS lab. I'm comfortable being tested on it right now.

<div class="co co-key"><p class="co-t">The real rebuttal</p>

Then answer the next analog or device question well. That's what actually erases the grade.

</div>

### PART D — Behavioral (STAR, mapped to your real stories)

STAR: situation, task, action, result. 45–70 seconds. End on a number or concrete outcome, then one line of lesson. [verify] = fill the true specific before the interview.

#### D1. "Tell me about a time you resolved a conflict."

> On the implantable auditory-prosthesis work, our team disagreed about the chip-platform direction: [verify: e.g., I wanted a subthreshold approach for power, and a collaborator wanted a more conventional approach for schedule and margin]. It got tense because we were both right in different ways. I stopped arguing my side and asked them to walk me through their reasoning, and realized their real concern was [verify: risk or timeline], not the technique. So I reframed my proposal to de-risk that, [verify: e.g., by characterizing across PVT corners to prove margin, with a fallback block]. Once they saw I'd taken their constraint seriously, we aligned. Most technical conflict is really an unspoken constraint, and the fastest way through is to listen for it.

<div class="co co-why"><p class="co-t">Why this works</p>

It shows listening and self-reflection, which was your coaching feedback, and it's technical, which suits NVIDIA. Value: One Team.

</div>

#### D2. "Tell me about a complex technical problem you solved under pressure."

> At Faraday I owned chip-top DFT and STA for a 22nm ASIC shuttle, and the timeline was about six weeks from RTL to GDSII. The hard part was [verify: e.g., a set of setup and hold violations on critical paths late in the flow]. I couldn't brute-force it, so I [verify: isolated the worst paths in PrimeTime, traced them to X, and fixed them with Y: resizing, buffering, or a constraint fix], and in parallel I automated the checks in Tcl and Perl so they ran themselves each iteration. We taped out on time and I got a top-10% rating. Under real pressure, automate the repeatable part so your attention goes to the actual hard problem.

- **If pushed "how did you fix a timing violation?":** "Find the failing path, decide setup or hold, trace the cause (logic depth, weak drive, a constraint issue), fix with the least invasive change, then re-run to confirm it closed without breaking a neighbor or another corner."

#### D3. "How do you handle competing priorities?"

> I lived this in grad school: research in the WICS lab, teaching as a GSI for 400-plus students, and consulting, all at once. "Work harder" doesn't scale; triage does. Each week I'd be honest about what had a real deadline versus what felt urgent, protect blocks for deep work, and tell people early when something had to slip. It wasn't perfect, and that's part of what the tough stretch taught me, but it made me much better at prioritizing.

#### D4. "Tell me about a time you improved a process or a tool."

> At Faraday, the DFT and STA flow had a lot of manual, repetitive steps: pre-synthesis checks, ATPG runs, post-layout checks. Each iteration took time and was easy to get wrong by hand. I built automation in Tcl, Perl and Csh that ran the whole chain, which [verify: cut X hours per iteration] and made the flow more reliable. If I'm doing something repetitive every week, I'd rather build the tool once, which is what I'd bring to characterization and QA flows here.

<div class="co co-fill"><p class="co-t">Fill in</p>

Put a number on the time saved. It turns a good story into a strong one. Value: Innovation, Speed and Agility.

</div>

#### D5. "Describe working with a difficult stakeholder."

> At miLEAD I worked with a startup founder who was [verify: very attached to their original market and resistant to the pivot our research pointed to]. It's their company, so pushing harder wouldn't work. I brought the primary data, [verify: the outreach to a few thousand potential customers], let the numbers do the arguing, and framed the pivot as protecting their upside. They moved toward the less-saturated market. With a resistant stakeholder, you win on evidence plus respect for their position.

- **Land for NVIDIA:** "Same thing with a design team pushing back on a library change: bring the data."

#### D6. "Tell me about a mistake or failure."

> The honest one is grad school. During the PhD-to-master's transition I took on too much and let my performance slip, and I hit academic probation. The failure wasn't the hard courses; it was not asking for help or cutting scope early enough. Once I admitted that, I fixed how I managed my commitments, cleared probation that term, and finished strong. What changed permanently is that I now flag problems early instead of powering through quietly.

- **Technical alternative (have one ready):** [verify: a real design or verification miss you caught, e.g., a corner you hadn't simulated, and the check you added so it wouldn't recur]. NVIDIA engineers like a technical mistake story.

<div class="co co-why"><p class="co-t">Why this works</p>

It matches NVIDIA's "Intellectual Honesty: learn from mistakes, share learnings" almost word for word.

</div>

#### D7. "Tell me about learning a new technology or domain fast."

> When I joined Faraday I owned chip-top DFT and STA for a 22nm shuttle, and I hadn't run that full flow end to end before: scan insertion, MBIST, ATPG, timing signoff. I had about six weeks. I built the simplest end-to-end version first, then attacked the hard parts, [verify: e.g., debugging STA violations in PrimeTime or the ATE pattern flow], and automated the repetitive checks. We taped out on time, top-10% rating. My approach to a new domain: get something working end to end fast, then go deep on the bottleneck. It's what I've been doing with memory design for this role.

#### D8. "Tell me about a time you disagreed with someone more senior."

> [verify: In the WICS lab or at Faraday, I disagreed with my advisor or lead about an approach.] Instead of pushing back with opinion, I got the data: [verify: I ran the simulation across PVT corners or built a quick comparison] and brought that. They looked at it and we adjusted the plan. With someone senior: disagree with evidence, not volume, and be genuinely willing to be wrong.

#### D9. "How do you make sure your work is accurate?"

> In the cleanroom, sloppy is expensive and invisible until later: a wrong anneal temperature doesn't show up until you characterize the film. So I logged every run's exact conditions and never trusted a single measurement. Same discipline in STA signoff at Faraday, where one missed corner can kill a chip. My habit: assume the failure is subtle, write things down so you can trace back, and verify rather than trust.

- **Land:** "For a library that billions of instances depend on, that's the habit you want."

#### D10. "Tell me about taking ownership beyond your role."

> I founded the Vietnamese International Student Association at Michigan. It started with three of us and grew to over ninety members with a flagship cultural event. Nobody assigned it; it needed to exist. At work, at Faraday I also mentored senior undergrads during a two-month internship program, and most converted to full-time. I tend to pick up what's falling through the cracks.

#### D11. "How do you handle repetitive, high-stakes verification?"

> Validating circuits across PVT corners is repetitive and easy to zone out on, but one missed corner can sink the design. I don't rely on willpower: I build structure, a consistent checklist, and automate what can be automated so my attention goes to the anomalies. For library QA I'd do the same: scripts that flag non-monotonic tables or outliers across drive strengths, so judgment goes where it matters.

#### D12. "Walk me through the deepest technical problem you've worked on."

> The TIA and active-RC filter for the implant front-end. Power was the constraint, so I biased devices in subthreshold, which is efficient but makes everything sensitive to variation and temperature. The challenge was [verify: e.g., keeping stability and phase margin at the slow corner, or noise at low bias current]. I [verify: what you changed, e.g., adjusted compensation or bias, re-sized devices] and validated across PVT corners. [verify: the result, e.g., met X noise at Y nW]. That taught me how thin margins get when you operate near the threshold, which is exactly what matters for low-voltage cells and memory.

<div class="co co-fill"><p class="co-t">Fill in</p>

This is the story they'll push three deep. Get the real corner problem and the number (RD.1).

</div>

#### D13. "Tell me about working across teams."

> At Faraday the flow crossed teams and countries: synthesis, physical design and verification, split between Taiwan and Vietnam. My checks sat in the middle, so handoffs were my job. I made each one explicit, what was checked, what was open, what I needed back, so nobody had to guess across time zones. [verify: an example of a handoff that went better because of it.] We hit the tapeout date.

- **Land:** "A library team's customers are other teams, so clean handoffs and clear release notes are half the job."

#### D14. "Give me an example of adapting to something unfamiliar."

> Last spring I joined a full-chip accelerator project for the number-theoretic transform, a math domain I hadn't worked in. My part was the back-end physical integration: the memory-block layout and place-and-route in Innovus, and block-level DRC/LVS. I got up to speed by building the simplest end-to-end version first and leaned on teammates for the algorithm while I owned the physical side. The blocks came out clean, though top-level closure ran out of time, which taught me to budget full-chip closure much earlier. I adapt by getting something working end to end, then going deep where it matters, and being clear about which parts are mine.

#### D15. "Explain a complex concept to someone without the background." (or: "Tell me about teaching")

> As a GSI for EECS 215 I had 400-plus students, many seeing circuits for the first time. [verify: pick a concept, e.g., op-amp feedback or transistor operation.] What worked was starting from something physical they already knew, then adding one idea at a time, and checking understanding before moving on. The lesson was that if I can't explain it simply, I don't understand it well enough yet.

- **Tip:** they may say "explain a flip-flop / a ROM to me like I'm new." Use the same method live.

#### D16. "Tell me about feedback you received and what you did with it."

> [verify: a real piece of feedback, e.g., from your advisor, a Faraday lead, or a mock-interview coach.] A shape that works: "I was told I tended to argue my position before understanding the other person's constraint. I took it seriously and changed how I start disagreements: I ask them to walk me through their reasoning first. It's made me much better in technical debates, like the chip-platform one."

<div class="co co-guard"><p class="co-t">Guardrail</p>

Pick feedback that's real and that you've visibly acted on. Don't pick one that undermines the role ("I'm not detail-oriented").

</div>

#### D17. "Tell me about working with ambiguity."

> At miLEAD, each startup came with a vague question, "where should we go?", and no data. I broke it into testable pieces, gathered primary data from a few thousand potential customers, and let the answer emerge. [Or technical: in the WICS lab, a research block with no spec beyond "as low power as possible."] With ambiguity I turn it into a list of questions I can actually answer.

#### D18. "What are you most proud of?"

> Technically, the Faraday tapeout: a real 22nm chip, signed off on a six-week clock, with a top-10% rating. Personally, VISA: building a community from three people to over ninety. Both are about owning something end to end.

#### D19. "What's your greatest weakness?"

> I used to take on too much and try to power through quietly. That caught up with me during my grad-school transition. Now I scope early and raise problems as soon as I see them. On the technical side, memory design is the area I have least hands-on experience in, which is why I've been working through SRAM and ROM from first principles for this role.

<div class="co co-why"><p class="co-t">Why this works</p>

Real, not fake-humble, already being fixed, and the technical half pre-empts D2.3 honestly.

</div>

#### D20. "Tell me about a time you changed your mind because of data." (intellectual honesty)

> [verify: a real moment, e.g., in the PetersonLab anneal study you expected higher temperature to help conductivity, but the data showed morphology degrading, so you changed the recommendation.] I'd rather be right than consistent: when the data disagrees with me, the data wins.

#### D21. "Tell me about helping someone else succeed."

> At Faraday I mentored senior undergrads during a two-month internship program. [verify: what you did, e.g., walked them through the flow, reviewed their scripts.] Most of them converted to full-time. It wasn't in my job description; I saw they needed it.

<div class="co co-core"><p class="co-t">Story allocation matrix (spread them: they compare notes)</p>

| Story | Best for | Also covers |
| --- | --- | --- |
| Faraday tapeout | D2 pressure, D7 learn fast, D18 proud | Speed and Agility |
| Faraday automation | D4 improve, CR.1 creativity, D11 | Innovation |
| Faraday handoffs / mentoring | D13 cross-team, D21 helping | One Team |
| WICS TIA/filter | D12 deepest problem, RD.1 | Excellence |
| Chip-platform disagreement | D1 conflict, D16 feedback | One Team |
| NTT physical integration | D14 adaptability, RD.3 | Speed and Agility |
| Probation recovery | D6 mistake, D19 weakness, C3 | Intellectual Honesty |
| PetersonLab | D9 detail, D20 data, CR.2 | Excellence |
| VISA | D10 ownership, D18 | One Team |
| miLEAD founder | D5 stakeholder, D17 ambiguity | (use at most once) |

</div>

## Part CODE — Coding & scripting drills

### CODE.1 Will there be live coding? How to respond, and four drills

**Will there be live coding?** Unlikely in a 45-minute first round with a circuit engineer. The JD calls scripting "a certain plus"; only one intern report mentions "Coding (SPICE/Python)." The realistic version: "**How would you script this?**" in a shared doc.

**How to respond:**

1. **Say the logic first:** "Loop over cells and corners, run the sim, parse the value, **flag anything missing instead of treating it as zero**, write a summary."
2. **Then write simple code.** Syntax doesn't need to be perfect: "I'd double-check the exact function name, but the structure is this."
3. **Be honest, not apologetic:** "I write practical automation, mostly Tcl/Perl for flows, and I look syntax up as I go. What I focus on is making the script **catch bad results**."
4. **Be ready to explain your Faraday script** in plain words: input → what it checked → output → how it flagged failures.

#### Drill 1: parse delays from a log, flag missing (Python)

```python
import re

need = ["tphl", "tplh"]           # measurements we expect
vals = {}
for line in open("sim.log"):
    m = re.match(r"\s*(\w+)\s*=\s*([-\d.eE+]+)", line)
    if m:
        vals[m[1]] = float(m[2])   # name -> value

missing = [k for k in need if k not in vals]
if missing:
    raise SystemExit(f"missing: {missing}")  # fail loudly
print(vals)
```

#### Drill 2: sweep corners and loads, collect results (Python)

```python
import subprocess

rows = []
for corner in ["ss", "tt", "ff"]:
    for load in [1e-15, 5e-15, 20e-15]:
        deck = open("tb.sp").read().format(corner=corner, load=load)
        open("run.sp", "w").write(deck)
        subprocess.run(["spice", "run.sp", "-o", "run.log"], check=True)
        d = parse_delay("run.log")             # Drill 1 logic
        rows.append((corner, load, d))         # None = missing

bad = [r for r in rows if r[2] is None]
print("failed points:", bad)                   # never average them in
```

#### Drill 3: the same loop in Tcl (read it, don't memorize it)

```tcl
set cells {INV_X1 NAND2_X1 NOR2_X1}
foreach c $cells {
    set f [open "${c}.log" r]
    set found 0
    while {[gets $f line] >= 0} {
        if {[regexp {tphl\s*=\s*(\S+)} $line -> d]} {
            puts "$c tphl = $d"
            set found 1
        }
    }
    close $f
    if {!$found} { puts "MISSING $c" }  ;# flag it
}
```

#### Drill 4: SPICE parameter sweep (no script needed)

```text
.param cload=5f
C1 out 0 {cload}
.tran 1p 5n sweep cload list 1f 5f 20f
.meas tran tphl TRIG v(in) VAL=0.4 RISE=1 TARG v(out) VAL=0.4 FALL=1
```

- **Make, in one sentence:** "It reruns only the steps whose inputs changed, based on declared dependencies, so a big characterization flow doesn't redo everything."

<div class="co co-core"><p class="co-t">Core memory</p>

**Logic out loud first. Loop → run → parse → flag missing → summarize. Missing is a failure, never a zero.**

</div>

## Part G — Final hour, equations & glossary


### G.1 Final-hour checklist (Friday, before 4:00 PM ET)

- [ ] **Draw from memory, 5 minutes each:** inverter, NAND2 + NOR2 sized at 2:1, **NAND2 stick diagram**, TG latch, **master–slave DFF**, 6T SRAM, **NOR ROM column with keeper**.
- [ ] **Say out loud:** 30-second intro · WICS in 60 seconds · Faraday scope-setter · "What is hold time?" · the **leakage-characterization plan** · EM vs IR + avg/RMS/peak.
- [ ] **One timing problem** on paper (W2) and **one ROM calculation** (W3/W4).
- [ ] **Your two or three questions for Bo** (P.4, and the insider ones in P.4b), and the NTT honest answer (RD.3).
- [ ] **Setup by 3:45 PM ET:** Teams tested, camera at eye level, light in front, paper + dark pen, water, phone silent, **no other AI tools open**.
- [ ] **Mindset:** think out loud · start from physics · "I don't know, here's how I'd check" is a strong answer · follow Bo's depth.

### G.2 Equation recall sheet

| # | Equation | Memory trick |
| --- | --- | --- |
| E1 | I_sat = (β/2)(V_GS − V_t)² ; I_sub ∝ e^((V_GS−V_t)/nU_T) | Square above Vt, exponential below; 10× per ~80 mV |
| E2 | t_pd ≈ 0.69 R C | "0.7 to half" |
| — | t_63% = RC, t_90% = 2.3 RC | "1 to 63, 2.3 to 90" |
| E3 | P = αCV²f + V·I_leak ; E = CV² per charge | "a C V-squared f" |
| E4 | Setup: T + S ≥ t_cq + t_pd,max + t_su ; Hold: t_cq,min + t_cd,min ≥ S + t_h | Setup races the next edge; hold protects this edge |
| E5 | ΔV = I·t / C | "I t over C" |
| E6 | t₀ ≈ C_BL ΔV / (I_sel − I_keeper) | Keeper saves the 1, fights the 0 |
| E7 | Bilinear table interpolation | Load first, then slew |
| E8 | MTTF = A J⁻ⁿ e^(Ea/kT) | More current density or hotter → shorter life |
| E9 | I_avg = I_p·d ; I_rms = I_p·√d | Average the current; RMS averages the square |
| E10 | C_decap = I·Δt / ΔV | Decap = a charge budget |
| E11 | d = gh + p ; N ≈ log₄F | Fan-out of 4 |
| E12 | MTBF = e^(t_r/τ) / (T₀ f_clk f_data) | Exponential in wait time |
| E13 | σ(ΔVt) = A_Vt/√(WL) ; Y ≈ e^(−Np) | 4× area → ½ sigma |
| E14 | gm/I_D ≈ 1/(n U_T) | Subthreshold = max gm per amp |
| — | Charge sharing: V = VDD·C₁/(C₁ + C₂) | Charge is conserved |

### G.3 Glossary

A fast flip-through so these terms come out fluently. **Tier 1:** define cold and say smoothly. **Tier 2:** recognize and give one sentence. 

#### Glossary Tier 1 — must-know

**Cells & library**

| Term | Say it |
| --- | --- |
| Standard cell | A pre-designed, pre-characterized logic block (INV, NAND, flop…) at fixed height, tiled in rows by place-and-route |
| Track height | Cell height in routing tracks (metal pitches); sets density vs drive and pin access |
| Drive strength | X1/X2/X4 variants of one function, made with more parallel fins or fingers |
| Multi-Vt | Same cell in ULVT/LVT/SVT/HVT flavors: speed vs leakage trade |
| .lib (Liberty) | The library file STA and synthesis read: timing, power, pin caps, constraints per corner |
| NLDM | Delay and output transition as 2-D tables of input slew × output load |
| CCS / ECSM | Current-source models: more accurate timing and noise at advanced nodes |
| LVF | Liberty Variation Format: adds sigma tables so STA can do statistical OCV |
| Timing arc | A pin-to-pin relationship in the .lib (A→Y delay, CLK→Q, setup, hold) |
| Characterization | Simulating a cell across slews, loads and corners to fill the .lib |
| Foundation IP | Standard cells + memories + basic IP every chip is built from |

**Timing & sequentials**

| Term | Say it |
| --- | --- |
| Setup time | How long D must be stable before the clock edge |
| Hold time | How long D must stay stable after the edge; independent of clock period |
| Clk-to-Q | Delay from clock edge to output change |
| Metastability | A flop caught mid-transition that resolves slowly and unpredictably; MTBF grows exponentially with resolution time |
| Recovery / removal | Setup and hold equivalents for an async reset's release |
| Min pulse width | Shortest clock high or low a flop tolerates |
| Clock-gating cell (ICG) | Latch + AND so enable changes can't glitch the gated clock |
| Level shifter | Moves a signal between voltage domains; low→high uses cross-coupled PMOS |
| Logical effort | g: how much worse a gate is than an inverter at driving; d = gh + p |
| FO4 | Delay of an inverter driving four copies of itself; a node's speed unit |

**Devices & variation**

| Term | Say it |
| --- | --- |
| DIBL | Drain voltage lowers the source barrier, dropping Vt at high Vds |
| Subthreshold slope | mV of gate voltage per decade of current below Vt (~60 mV/dec ideal at room temp) |
| Stack effect | Series off transistors leak far less than one |
| FinFET / GAA | Gate wraps the channel (3 sides / all sides): better control, width quantized in fins or sheets |
| Temperature inversion | At low VDD, cold is slow because Vt rises; at high VDD, hot is slow |
| Pelgrom's law | Local mismatch σ(ΔVt) ∝ 1/√(WL) |
| Process corners | SS/FF/SF/FS/TT: global speed extremes of NMOS/PMOS |
| Monte Carlo | Random sampling of local variation to estimate yield or margin |
| High sigma | Verifying rare failures (4.5–6σ) with importance sampling, not plain Monte Carlo |

**Reliability**

| Term | Say it |
| --- | --- |
| Electromigration | Current pushes metal atoms, causing voids/opens over time; MTTF by Black's equation |
| Avg / RMS / peak current | Three EM limits: DC EM, Joule heating, instantaneous |
| IR drop | Supply droop from current in the grid; static (average) vs dynamic (switching) |
| NBTI / PBTI | Bias-temperature instability raises the magnitude of Vt over time (PMOS / high-k NMOS) |
| HCI | Hot-carrier damage during switching at high Vds; worse with slow input slews |
| TDDB | Time-dependent gate-oxide breakdown |
| Charge sharing | A precharged node loses voltage to internal node capacitance |

**Flow & verification**

| Term | Say it |
| --- | --- |
| SPICE .measure | Extracts delay, slew, power from a simulation automatically |
| PEX | Parasitic extraction: RC from layout for post-layout sims |
| DRC | Layout obeys the foundry's geometric rules |
| LVS | Layout netlist matches the schematic |
| STA | Checks every timing path without vectors; slack = required − arrival |
| OCV / POCV | Derating for on-chip variation; parametric OCV uses per-cell sigma (LVF) |
| MBIST | On-chip memory self-test with march algorithms |


**Memory**

| Term | Say it |
| --- | --- |
| WL / BL / BLB | Wordline selects a row; bitline and complement carry data |
| PU / PD / PG | Pull-up PMOS, pull-down NMOS, pass-gate (access) NMOS in 6T |
| Cell ratio | PD strength / PG strength; sets read stability |
| Read disturb | Cell flips during a read because the 0 node bumps up |
| Half-select | Cells on an active row in unselected columns |
| SNM | Static noise margin from the butterfly curve |
| Vmin | Lowest VDD where the array works at target sigma |
| SAE / offset | Sense-amp enable / built-in imbalance from mismatch |
| Replica bitline | Dummy column timing SAE to track PVT |
| Keeper | Weak PMOS holding a precharged node high against leakage |
| Mux factor | Columns per output bit; words = rows × mux |
| Hierarchical bitline | Short local bitlines feeding a global one |
| ROM compiler | Generates every ROM size/code and its views from leaf cells |

#### Glossary Tier 2 — nice-to-have

| Term | Say it |
| --- | --- |
| Pin access | Whether the router can reach a cell's pins; critical at advanced nodes |
| Diffusion break | Gap between active areas of neighboring cells; affects density and stress |
| LOD / WPE | Layout-dependent effects: length of diffusion stress, well-proximity Vt shift |
| Self-heating | FinFET channels heat up locally, raising temperature and worsening EM |
| TSPC flop | True single-phase clock flop: fast, sensitive to slow clock slews |
| Pulsed latch | Latch clocked by a short pulse: tiny setup, larger hold risk |
| Retention flop | Keeps state on an always-on supply while the main domain powers off |
| Isolation cell | Clamps outputs of a powered-off domain to a known value |
| Decap cell | On-chip capacitance to smooth supply noise |
| Tap / endcap cell | Well and substrate ties; row-end protection |
| MISR | Signature register compressing many outputs, e.g., ROM test readout |
| Importance sampling | Shift sampling toward the failure region, then reweight |
| Liberate / SiliconSmart | Characterization tools (Cadence / Synopsys) |
| Solido | Variation-aware and high-sigma simulation tools |
| Calibre | Mentor/Siemens DRC/LVS tool |
| Near-threshold computing | Running VDD just above Vt for energy efficiency; your WICS home turf |
| CoWoS | TSMC's 2.5-D packaging for NVIDIA GPUs with HBM |
| HBM | Stacked DRAM beside the GPU in the package |

### G.4 Sources

- Interview confirmation email (Bo Li, Oct 2, 1 PM PT, 45 min, Teams) and Bo Li's LinkedIn (screenshots you supplied).
- [Glassdoor: NVIDIA Circuit Design Engineer interviews](https://www.glassdoor.com/Interview/NVIDIA-Circuit-Design-Engineer-Interview-Questions-EI_IE7633.0,6_KO7,30.htm) · [Glassdoor: NVIDIA Circuit Design intern interviews](https://www.glassdoor.com/Interview/NVIDIA-Circuit-Design-Engineer-Intern-Interview-Questions-EI_IE7633.0,6_KO7,37.htm) · [Glassdoor: standard-cell design questions](https://www.glassdoor.com/Interview/standard-cell-design-interview-questions-SRCH_KO0,20.htm) · [Glassdoor: memory design questions](https://www.glassdoor.com/Interview/memory-design-engineer-interview-questions-SRCH_KO0,22.htm) · [Blind: NVIDIA SRAM circuit interview](https://www.teamblind.com/post/senior-sram-circuit-design-engineer-interview-at-nvidia-n0rigjyb) · [EDAboard: standard-cell interview concepts](https://www.edaboard.com/threads/important-concepts-for-standard-cell-dsign-engineer-interview.330112/)
- [NVIDIA Q2 FY2027 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027) · [NVIDIA core values (Code of Conduct summary)](https://www.resumeadapter.com/companies/nvidia/core-values) · [TechSpot: Rubin on 3nm](https://www.techspot.com/news/105852-nvidia-blackwell-ai-successor-rubin-moves-forward-six.html)
- NTT facts: your EECS 627 final report and presentation, as audited in the GPT playbook (130nm, top-level DRC/LVS incomplete, DMA-frequency bug).
- Reddit could not be accessed from this session; the GPT playbook's Reddit finds were adjacent roles and advice threads only.