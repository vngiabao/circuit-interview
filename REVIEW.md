# Review of the Claude revision — 2026-10-04

Retained the role-based die map, focused lesson structure, answer explanations, spaced drills, search, light/dark themes, and integrated mock sessions. These improve navigation and retrieval practice.

Fixed material regressions before publication:

- Restored the previous 42 lessons and 12 labs alongside the new four lessons and one lab. Recovered 71 missing questions and preserved all 367 original multiple-choice questions with their option/answer pairing.
- Added a weekly plan and lesson prerequisites, takeaways, checkpoints and coding links. Broadened role lenses to include analog/mixed-signal.
- Rendered fenced LaTeX using display-mode KaTeX. Bundled Markdown references and removed parent-folder PDF links.
- Corrected hold-slack sign, C²MOS edge-rate reasoning, synchronizer guarantees, latch timing assumptions and ECO placement examples.
- Corrected subthreshold slope (approximately 84 mV/dec), the computed energy minimum (0.73 V), RLC plot bounds/response, Pelgrom convention and several circuit connections.
- Prevented repeated grading from advancing review intervals; hardened numeric input and safe backup import. Added import support for earlier Study Studio progress.
- Isolated Python runs, added Stop/timeouts, and persisted mock sessions through navigation/reload.
- Removed unsupported claims about interview frequency and clarified objective checks versus self-ratings.

Limits remain explicit: archived figures absent from supplied assets are labeled unavailable; mock grading is structured self-assessment, not live AI evaluation; browser-local progress requires export/import across addresses. Future work should prioritize more authored analog/CDC/physical-design follow-up chains and calibrated grading against human-reviewed answers before adding a paid AI voice service.

# Redesign and content pass (Claude), 2026-10-04

- Replaced the light datasheet look with the Instrument-dark system (DESIGN.md): new tokens, IBM Plex type, Today dashboard, panel-based lists, readable callouts without side stripes, theme-aware plots.
- Rebuilt the 42 imported lessons into the structured format and wrote meanings for all 76 imported equations (they shipped with one placeholder note).
- Added 8 lessons and about 180 questions, concentrated in RTL (2 → 32), CDC, ASIC flow, analog, arithmetic, characterization, scripting and stories, with typed numeric questions restored across the core domains.
- Added 8 Python labs (21 total); every reference solution passes its tests in vendored Pyodide.
- Fixed: energy-vs-VDD model now has its minimum near/below VT (≈0.30 V), mobile lens overflow, missing mock-interview closer (STORY-12), MCQ wrong-answer highlighting, equation clipping, em/en dashes in imported copy.
- Correction to the note above: the original hold-slack answer (SEQ-009, −5 ps) was already correct; no sign fix was needed.
