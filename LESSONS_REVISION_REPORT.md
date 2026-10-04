# Lessons navigation and contextual equation references

Source: the existing `Interview Website` repository, starting at `a97ab33` on main. The work remains descended from Claude's `0790d7d` Oura redesign. No checkout replacement or archive copying.

- `#/lessons` directly lists all 54 lessons under 16 topics. Search, topic and progress filters keep their state when the learner opens a lesson and uses browser Back.
- A stable prerequisite-aware reading path checks 78 dependency edges. The path starts with MOSFET foundations; Today and the reader's previous/next links use that path. The topic catalog stays grouped, with cross-topic prerequisites linked explicitly. Learn retains role-based tiers.
- All 44 lessons with equations have a separate equation reference: circuit/mode, symbol mappings and model limits, diagrams, then display equations and a worked-example link. Sheets can be filtered to one topic.
- Earlier graphics remain in their original lesson arrays. All 22 lesson image entries and 534 original lecture crops remain available. Source notes/metadata resolve to 207 lecture uses across lessons; selected crops now appear in visible Picture it sections and equation references, rather than only in collapsed source notes.
- The technical review checked assumptions and exact equation-to-diagram node names, including SRAM ratios, leakage stacks, dynamic charge sharing, RC versus distributed-wire models, scan chain variables, and example-dependent timing/power conventions.

## Verification

- `qa-content.cjs`, `qa-technical.cjs`, `qa-state.cjs`, `qa-lessons.cjs`, and the static build pass. All 21 Python lab reference solutions pass.
- `impeccable detect` reports zero findings on changed UI files.
- Four browser sweeps: 1280px and 375px in dark and light, 1,536 rendered states per sweep. No JavaScript errors, KaTeX errors, horizontal overflow or clipped SVG labels. Includes every lesson, question and revealed answer, lab, domain and reference, plus filter/empty-state and equation-context ordering checks.
- Direct lesson opening, browser Back with a topic filter, mobile search/clear, and the memory equation sheet were exercised through the actual app UI.
- `git diff 0790d7d` is empty for `css/tokens.css`, the four generated content files, and `assets/`. The Oura palette, lecture images and original assets are unchanged.

Existing source limitation: the content audit still reports 59 unavailable archival figure names explicitly labeled in source notes. They were not removed by this revision; all shipped lesson image assets pass the existence check.
