# GBVirtuoso

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Static HTML, CSS and JavaScript. Self-hosted KaTeX, marked, IBM Plex fonts and Pyodide. Progress in browser localStorage with export/import. Deployed as a static site (Cloudflare Pages build copies `index.html`, `css`, `js`, `data`, `assets`, `vendor`, `_headers`). Source repository: https://github.com/vngiabao/circuit-interview.

## Users
One learner (Bao Vo) preparing for circuit design, ASIC/physical design, digital/RTL and analog/mixed-signal interviews at any company. Not limited to NVIDIA or to standard cells.

## Product Purpose
A study bible and practice workspace: structured lessons, an answer bank that teaches through every option, spaced review, timed spoken mock interviews with follow-up chains, and a coding corner with taught Python labs.

## Operating Context
Used in long evening study sessions, often at night, on a laptop, sometimes on a phone. Dark is the default theme; light is available.

## Content Truth
- 54 lessons across 16 domains; every lesson has a mental model, equations with meanings, traps, a 30-second spoken answer and follow-ups. 42 imported lessons keep their full source notes in a collapsed section.
- 600+ questions: authored questions in ten formats plus every technical question from the user's EECS 427/627 books, drill book, prep bibles and scripting companion (imported via `data/vault.js` and `data/studio-bridge.js`; legacy MCQ answers are preserved byte-for-byte and checked by `scripts/qa-content.cjs`).
- 21 Python labs with tests; 534 captioned lecture figures; 8 bundled reference books.
- Computed plots are first-order teaching models, labelled as such, not PDK simulation.

## Product Principles
Attempt before reveal. Show mechanism, assumptions and numbers. Misses come back today. Never invent personal accomplishments: story answers keep [fill in] until verified. Progress is self-assessment, not a hiring prediction.
