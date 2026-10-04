# Prompt for GPT / Codex: GBVirtuoso handoff and figure expansion

Paste everything below the line into GPT/Codex.

---

You are continuing work on **GBVirtuoso**, my circuit / ASIC / VLSI interview study site. Last time you pushed a build from the wrong folder, which overwrote the redesign. Read Part 1 completely and follow its rules before changing anything. Part 2 is the actual task.

## Part 1. What was reorganized, and the rules for not pushing the wrong code

### Where the code lives now
- **The only source of truth is the folder** `C:\Users\vngia\OneDrive - Umich\Desktop\Job Application\Engineer Jobs\NVIDIA\Interview Website`.
  - That folder is the git repository root **and** the website root. Remote: `https://github.com/vngiabao/circuit-interview`, branch `main`.
  - Cloudflare Pages builds `main` with `node scripts/build-site.cjs` (output `dist/`) and serves https://gbvirtuoso.pages.dev.
- **These folders no longer exist; do not recreate them or copy from them:** `NVIDIA\tapeout\` and `NVIDIA\interview-studio\`.
- The old Study Studio now lives at `Interview Website\archive\study-studio\`. That folder is **git-ignored and read-only reference**: never edit it, never copy files from it into the site, never push from it.
- The parent `NVIDIA\` folder holds my PDFs, résumé and a 4 GB screen recording. Never add anything from it to the repo.

### Required baseline
- The correct baseline is commit `0790d7d` ("Retune palette and shapes to an Oura-like dark theme"), whose parent is `3aaea95` ("Redesign GBVirtuoso as an instrument-dark study workspace...").
- Before any edit, run `git fetch origin`, `git status` and `git log --oneline -5` inside `Interview Website`. Confirm that `HEAD` is `origin/main` and contains `0790d7d`. If it does not, **stop and tell me**. Do not "fix" it by copying files from anywhere.

### Rules for git
- Work on a branch, for example `figures-expansion`.
- Make small commits, with a message that says what changed.
- Never `git push --force`.
- Never replace `index.html`, `css/`, `js/` or `data/` wholesale with files from another folder or an older snapshot.
- Merge to `main` only after every QA step in Part 2 passes. Then report back the final commit hash.

### What the current site is (do not regress any of this)
**Design system:** "Instrument dark, Oura palette", documented in `DESIGN.md` (product facts are in `PRODUCT.md`).
- Tokens live in `css/tokens.css`: deep navy-black surfaces with soft top-lit cards (`--glow`), warm off-white ink, and one periwinkle accent `--accent`.
- Teal `--ch2` is used for second plot traces and equations. Mint `--ok`, coral `--bad` and peach `--warn` are used for state only.
- Shapes: 14px cards, 10px inputs, and pill-shaped buttons, chips and tags. Fonts: IBM Plex Sans plus IBM Plex Mono (self-hosted in `vendor/fonts`). Dark is the default; light mode exists.
- Every colour in CSS and SVG must reference a token. Running `C:\Users\vngia\.codex\skills\impeccable\scripts\impeccable.cmd detect --json <changed UI files>` must report **zero** findings.
- No em or en dashes in visible copy.

**App structure:** a static single-page app with no framework.
- `js/core.js` provides the registry, markdown + KaTeX, the progress store and spaced review.
- `js/question.js` renders every question format.
- `js/views.js` covers Today, Learn, domains, lessons, sheets, stories and sources. `js/practice.js` covers the bank, drills and the mock interview. `js/code.js` plus `js/py-worker.js` run Python labs in vendored Pyodide. `js/plan.js` is the weekly plan, and `js/app.js` is the router, search and startup dash normaliser.
- `js/plots.js` holds the computed figures. `T.plot(name)` renders `P[name]`, and the SVG classes `pa pb pc pg pt pl pn pref pdot sbox sw sl sh sn ...` are styled from tokens.

**Content:** 54 lessons, 623 questions and 21 labs. Load order is the `<script>` list in `index.html`, which is maintained by hand. Add new data files there, after `data/studio-bridge.js`.
- **Generated, do not hand-edit:** `data/vault.js` (built by `scripts/build_vault.py`), `data/studio-bridge.js` and `data/references.js` (built by `scripts/build_studio_bridge.py`), and `data/slides.js`.
- **Authored:**
  - `data/seq.js`, `rtl.js`, `cdc-flow.js`, `ana-arith.js`, `char-code.js`, `core-extra.js`, `story.js`, `labs.js` and `labs-2.js`.
  - `data/upgrades-1/2/3.js` add the teaching layer to imported lessons via `T.upgradeUnits({id: {...}})`.
  - `data/eq-notes.js` gives imported equations their meanings.

**Lesson (unit) schema:**
`{id, d, order, tier, mins, title, goal, tags, model, eq:[[tex, note]], figs:[{plot:'name', cap} | {src:'assets/...', cap, from}], worked:{q,a}, traps:[], say, ask:[], checks:[qids], slides:['427-10']}`

**Question schema:**
- Fields: `{id, d, u, lvl:1|2|3, f, q, opts, ans, why[], ex, a, say, rub[], trap, fu[], hint, tags, fig}`.
- Formats: `mcq multi num tf order text short oral design spot`.
- The MCQ/multi `ans` value is an index (or an array of indexes) into `opts`.
- `num` uses `ans` plus `tol` (relative) or `tolAbs`.
- IDs look like `RTL-012`. Legacy IDs are `V###` and `extra-*`; never renumber them.

**QA that must stay green:** `node scripts/qa-technical.cjs`, `node scripts/qa-content.cjs` and `node scripts/qa-state.cjs`.
- qa-content enforces that every legacy MCQ keeps its exact options and answer.
- qa-state runs every lab's reference solution in real Pyodide.
- Also do a browser sweep: render every lesson, every question with its answer revealed, every lab and every page at 375px and at desktop width, in dark and light. Confirm there are no JS errors, no KaTeX errors and no horizontal overflow.

**Honesty rules:**
- Computed figures are labelled "Computed teaching model", not simulation or silicon.
- Personal story answers keep `[fill in]`.
- Never invent my accomplishments or interview history.

## Part 2. The task: many more figures, everywhere

I want far more visuals: circuits, layouts, block diagrams, waveforms and graphs. Right now most pages and most questions are text only, apart from lecture crops and a handful of older images. Visuals must appear in **Learn (lessons and domain pages), Answer bank, Drill, Mock interview and the Code corner**.

### 1. Build reusable vector generators (no raster images and no image AI for technical figures)
Create `js/schematics.js`, loaded after `plots.js`. It needs a small SVG drawing library that snaps to a grid and is styled only by token-driven CSS classes. It should cover:

- **Transistor level:** NMOS and PMOS symbols (bulk optional), VDD/GND, wires with junction dots, labels.
- **Gates:** compound helpers for the inverter, NAND/NOR (any fan-in), AOI/OAI, transmission gate, tristate, pseudo-NMOS, domino with keeper, C²MOS, TG latch, master-slave flop, TSPC, pulsed latch, ICG, DCVS level shifter.
- **Memory:** SRAM 6T and 8T, sense amplifier, NOR/NAND ROM column with keeper, precharge and equalise devices.
- **Analog and power:** current mirrors (basic and cascode), 5T OTA, two-stage op-amp with Miller cap, StrongARM comparator, bandgap core, charge-pump PLL blocks, power-gating header/footer, decap.
- **Timing diagrams:** a generator that takes a small spec (signals, edges, X/Z regions, arrows and annotations for setup, hold, skew, clk→Q, borrowing) and draws the waveform. Use it for setup/hold, metastability, handshakes, FIFO pointers, scan shift/capture, domino precharge/evaluate, SRAM read/write sequences and clock gating.
- **Layout and physical:** stick diagrams and coloured-layer cell layouts (n-well, diffusion, poly, M1, M2, contacts) with a legend. Also a standard-cell template showing rails and tracks, a floorplan with macros and halos, a power-grid mesh, CTS H-tree, antenna and latch-up illustrations, and an RC wire π-model.
- **Block diagrams:** RTL-to-GDS flow, async FIFO, two-flop synchronizer, handshake, pipeline, adder prefix trees (KS/BK already exist in plots.js), Booth multiplier with compressor tree, barrel shifter, memory array organisation (decoder, column mux, sense amps, banks), SerDes/PLL, STA timing graph.
- **More computed graphs in `plots.js`:** Id–Vgs and Id–Vds families, VTC with noise-margin squares, butterfly/SNM, gm/Id, Bode plot with phase margin, step response with ringing, FO4 delay versus VDD, leakage versus VT and temperature, crosstalk glitch, IR map heat strip, EM lifetime versus J, Monte Carlo histogram with σ markers, yield versus sigma, MTBF, Liberty delay surface, Elmore ladder response, shmoo plot, power-versus-frequency (DVFS) curve.

Every figure must:
- Have topologically correct connections. Reviewers will trace the nets, so add connectivity checks to `scripts/qa-technical.cjs` for each schematic generator: expected node counts and connections.
- Carry an `aria-label` and a caption that says what to notice.
- Use only token classes. No hex colours, no fake data presented as measurement. Where it is a model, the caption says "Computed teaching model".
- Render legibly at 375px wide and in both themes.

### 2. Coverage targets
- **Every lesson (all 54):** at least 2 generated figures, one structural (schematic, layout or block) and one behavioural (waveform or graph). Add more where a mechanism has steps, for example SRAM read and then SRAM write.
- **Questions:** at least 40% of all 623 questions should have a figure. Prioritise L2/L3, every numeric question, every "draw it" or design prompt and every spot-the-bug item.
  - Many prompts should *require* reading the figure, for example "From this waveform, what is the hold slack?" or "Which node is floating in this schematic?".
  - Add new figure-driven questions as well: at least 60 new ones spread across all 16 domains, each with four options and per-option explanations, or numeric with tolerance.
- **Answers:**
  - Add an answer-side figure field `afig`, shown only after reveal: the annotated solution, such as the waveform with the slack marked or the schematic with the discharge path highlighted.
  - Add `figs` as an array on questions; keep the single `fig` working for backward compatibility.
- **Drill and Mock:** show the question figure in drills. In mock mode, show the figure for "draw/explain" prompts, and add a "sketch first, then compare" toggle that hides the figure until you click reveal.
- **Domain pages:** a small figure strip with 3 to 6 key diagrams for that domain.
- **Today page:** the next-lesson card shows that lesson's first structural figure as a thumbnail.
- **Code corner:** every lab gets one diagram of what the code models, such as an RC tree, a netlist DAG, a timing-report anatomy or Gray code transitions.
- **Sheets:** a "figure sheet" per domain, printable.

### 3. Rendering changes
- **`js/question.js`:** render `figs` (an array) above the inputs and `afig` inside the reveal. Add tap-to-zoom using the existing `#zoom` dialog: inline SVG must zoom too, so clone the SVG into the dialog.
- **`js/views.js`:** the lesson "Picture it" section already renders `u.figs`; keep that behaviour. Add the domain figure strip and the Today thumbnail.
- **CSS:** add only token-based classes. Keep the 14px card radius and pill controls, and do not introduce new colours.

### 4. Verification before merging
1. All three QA scripts pass. Extend `qa-technical` with connectivity checks for every schematic generator, and extend `qa-content` to assert the coverage targets.
2. Add `scripts/figure-coverage.cjs`. It prints lessons with fewer than 2 figures, questions without figures by domain and level, and labs without a diagram. It must report the targets met.
3. Do the browser sweep from Part 1, plus a zoom test on 10 random inline SVGs.
4. `impeccable detect` reports zero findings.
5. Spot-check 20 schematics by hand for correct topology, and list in your report which ones you checked.

### 5. Report back
- The branch and the final `main` commit hash.
- Counts: figures added by type, lessons with 2 or more figures, the share of questions with figures, and the new figure-driven questions per domain.
- Anything you could not do, stated plainly. Do not claim coverage that the coverage script does not show.
