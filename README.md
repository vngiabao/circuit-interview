# GBVirtuoso

A circuit, IC and VLSI interview learning platform. Static HTML, CSS and JavaScript with self-hosted KaTeX 0.16 and Pyodide. No backend or API key is required.

## Learn and practice

- 46 lessons across 16 domains and four role lenses.
- 446 total questions, including 386 multiple-choice questions; company-specific archive prompts are hidden by default.
- Weekly plans, lesson checkpoints, spaced review and notes.
- 13 Python labs with teaching, hints, solutions and executable tests.
- Timed 45/60-minute mock interviews, follow-up chains, pause/resume and rubrics. Speech playback is browser-dependent. This is structured rehearsal with self-assessment, not an AI voice interviewer or a hiring prediction.
- Eight original Markdown references and 534 lecture figures. Missing archival figures are explicitly identified; no PDF equation extraction is used.

## Run locally

From this repository run `python -m http.server 8427 --bind 127.0.0.1`, then open `http://127.0.0.1:8427/`. A file URL cannot run the Python worker or fetch references.

## Build and deploy

Run `node scripts/build-site.cjs`.

Cloudflare Pages: framework **None**, build command `node scripts/build-site.cjs`, output directory `dist`, production branch `main`. The build copies only the website directories and headers. It never reads or publishes the parent folder.

## Validate

```sh
node scripts/qa-state.cjs
node scripts/qa-technical.cjs
node scripts/qa-content.cjs
```

The state suite executes all 13 lab reference solutions in vendored Pyodide and checks safe imports, duplicate grading, numeric units, mock persistence and worker concurrency. Technical checks exercise plot models, timing arithmetic, circuit connectivity and question schemas. Content checks verify restored coverage, source hashes, assets and math rendering.

## Content maintenance

`data/seq.js` holds the new sequential lessons/questions. `data/studio-bridge.js` preserves the earlier platform's curriculum, MCQs and labs. Regenerate it from checked-in inputs with `python scripts/build_studio_bridge.py`.

`index.html` is the maintained entry point. `scripts/build_index.py` can regenerate its shell and script order. The historical `build_vault.py` importer depends on earlier local source material and is not part of a build or deployment.

## Progress and evidence

Progress stays in the browser. Use **Settings → Export progress** before moving devices or clearing browser data. To migrate from the previous Study Studio address, export there and import the JSON here. Import merges compatible records and archives the original backup; imported code needs tests rerun. Different web addresses cannot automatically share local storage.

Teaching models are not PDK simulations. Original references retain historical company/date context and supplied project statements; they are not fresh verification of personal claims. Personal résumé PDFs and screen recordings are excluded.
