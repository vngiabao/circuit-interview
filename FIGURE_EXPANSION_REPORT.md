# Figure expansion verification

Implemented on `figures-expansion` from verified baseline `b823f4c2bd43f9831063ebfe245dd95eb6e897b8`, which contains the required Oura-theme commit `0790d7d`. Work is confined to `Interview Website`; no parent files or archive contents were added.

## Delivered

- 69 new diagram generators: 34 transistor circuits, 17 block diagrams, 8 physical/layout illustrations and 10 named timing diagrams. The waveform API also accepts custom event sequences.
- 18 additional computed graph families; the existing 20 plotting functions remain available. Models include transfer/output characteristics, noise margins, transconductance efficiency, feedback stability, supply/delay/power behavior, coupling, reliability, statistics, characterization surfaces and shmoo regions.
- All 54 lessons have at least two generated figures, including a structural and a behavioral figure. Existing lecture graphics remain intact.
- 521 of 691 total questions have generated figures (75.4%). The ordinary bank shows 687 because four company-specific questions are hidden by default. Every numeric, design, drawing and spot-the-bug priority has a figure.
- 64 new figure-driven MCQs, with four options and per-option explanations: four each in devices, CMOS, delay, power, sequential circuits, CDC, memory, interconnect, variation, arithmetic, RTL, physical design, characterization, analog, scripting and project defense.
- All 21 labs have structural diagrams. Each domain has 3-6 key figures, plus a dedicated printable figure sheet. Today shows the next lesson's structural thumbnail.
- Legacy `q.fig` works alongside `q.figs`. Annotated `q.afig` solutions enter the DOM only after reveal. Contextual mock drawings use a sketch-first disclosure; figure-reading prompts remain visible. SVG zoom clones the original vector and remaps IDs.

The coverage script resolves actual SVGs rather than counting fields. It finds 216 distinct parameterized figure configurations used by the curriculum: 71 circuit, 13 layout, 52 block, 51 waveform and 29 plot configurations. These are configurations, not 216 independently implemented generators.

## Verification

`qa-content`, `qa-technical`, `qa-state`, `qa-schematics`, `figure-coverage`, the static build and the Impeccable detector pass. The detector returns an empty findings array. KaTeX parses all 844 checked math instances without errors; no isolated `logic,max`, `c-q` or `t_su` lines were found during browser rendering.

Technical checks cover 698 transistor/passive terminals, independent device/net expectations, CMOS truth tables through fan-in four, control polarity, physical latch/SRAM wire regressions and 112 block edges routed clear of unrelated block interiors. Numerical checks cover model limits, KCL, symmetry, noise-square geometry, phase margin, seeded distributions, interpolation and Elmore moments. All 21 Python reference solutions pass in actual Python.

The browser harness uses the real shipped renderers and answer handlers. Each viewport/theme run renders 1,532 states: all 54 lessons, all 691 questions before and after reveal, all 21 labs, every domain and figure sheet, lecture galleries, eight reference books and the remaining app pages. Tests inspect JavaScript errors, math errors, horizontal page overflow and SVG text clipping.

The final four runs (375px dark/light and 1280px dark/light) completed 6,128 rendered states with zero failures, JavaScript errors, math errors, overflow or clipped SVG labels. A seeded random zoom sample (seed 20261004) passed for AOI, master-slave flop, 8T SRAM, precharge/equalize, NOR ROM, StrongARM, Id-Vgs, gm/Id, EM lifetime and setup/hold: each opened one labeled SVG, had no duplicate IDs and closed with Escape.

Twenty schematic families were hand-traced in rendered views: inverter, NAND, NOR, AOI, OAI, transmission gate, tristate, domino, TG latch, master-slave flop, 6T SRAM, 8T SRAM, sense amplifier, precharge/equalize, NOR ROM, current mirror, cascode mirror, 5T OTA, StrongARM comparator and level shifter. Review found and corrected physical feedback routing errors in the latch and SRAM views; checks now guard those cases. An independent pass also corrected an AOI question expression, Gray-code wording, inconsistent example circuits, a synchronizer clock edge and waveform annotation collisions.

## Limits

Plots and layouts are clearly labeled teaching models or illustrative geometry. They are not PDK simulations, silicon measurements or DRC/LVS signoff evidence. Complex circuits use explicit named-net drawings; key gates, the mirror and 6T SRAM use conventional connected views, while latch/flop views show functional transmission-gate composition.

The 59 missing historical source-figure names remain explicitly marked unavailable in archived references. No active lesson image is missing. This expansion does not add a live AI interviewer or automatic spoken-answer grading; the existing timed mock and rubric/self-grading behavior remains.

## Reproduce

Run `node scripts/qa-content.cjs`, `node scripts/qa-technical.cjs`, `node scripts/qa-state.cjs`, `node scripts/figure-coverage.cjs` and `node scripts/build-site.cjs`. Serve this folder locally, then open `scripts/browser-sweep.html?theme=dark` and `?theme=light` at 375px and 1280px. The gallery and screenshot-export helper are development tools excluded from `dist`.
