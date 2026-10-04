---
name: GBVirtuoso
description: Instrument-panel study workspace for circuit, ASIC and VLSI interviews.
mode: Operate + Read
colors:
  bg: "oklch(0.155 0.022 268)"
  rail: "oklch(0.14 0.02 268)"
  panel: "oklch(0.195 0.026 268)"
  panel-2: "oklch(0.225 0.03 268)"
  panel-3: "oklch(0.265 0.032 268)"
  panel-glow-top: "oklch(0.235 0.032 268)"
  line: "oklch(0.29 0.03 268)"
  line-strong: "oklch(0.4 0.035 268)"
  ink: "oklch(0.95 0.01 85)"
  ink-2: "oklch(0.8 0.018 268)"
  ink-3: "oklch(0.65 0.022 268)"
  accent: "oklch(0.79 0.1 278)"
  accent-ink: "oklch(0.82 0.09 278)"
  on-accent: "oklch(0.2 0.04 278)"
  ch2: "oklch(0.82 0.085 190)"
  ok: "oklch(0.83 0.11 160)"
  bad: "oklch(0.76 0.12 20)"
  warn: "oklch(0.83 0.1 60)"
  plot-bg: "oklch(0.18 0.024 268)"
  plot-grid: "oklch(0.28 0.028 268)"
  plate: "oklch(0.97 0.005 85)"
  scrim: "oklch(0.1 0.02 268 / 0.6)"
  shadow: "oklch(0 0 0 / 0.5)"
  light-bg: "oklch(0.975 0.006 85)"
  light-panel: "oklch(0.995 0.003 85)"
  light-ink: "oklch(0.22 0.03 268)"
  light-accent: "oklch(0.62 0.13 278)"
  white: "#ffffff"
typography:
  ui: "IBM Plex Sans (variable, wdth 85-100)"
  mono: "IBM Plex Mono"
  h1: "clamp(30px, 3.6vw, 42px) / 500 / stretch 92%"
  body: "15.5px / 1.6"
  label: "Plex Mono 11px, uppercase, 0.08em tracking"
rounded: "14px panels and cards, 10px inputs and options, full pill for buttons, chips, tags, segmented controls and nav items"
---

# Design system: GBVirtuoso

## Direction
**Instrument dark, Oura palette.** Calm and premium like the Oura app: deep navy-black surfaces with a soft top-lit gradient on cards, warm off-white type, light-weight large numerals, generous rounding and pill controls. One periwinkle accent (Oura's sleep color) marks actions and focus; readiness teal is the second plot trace and equation color; peach and mint carry hint and correct states; soft coral marks errors. Data stays crisp: monospaced IDs and counts, hairline grids.

Hallmark: custom bespoke "Instrument Panel" macrostructure, N3 side rail with N4 hidden command palette, Ft2 inline footer line. Taste dials: variance 4, motion 3, density 6. Impeccable mode: Operate for the dashboard, bank and drills; Read for lessons.

## Rules
- **One accent.** Periwinkle marks the primary action, the active nav item, must-conquer domains, focus and the hot data point in plots. Never decorative.
- **Semantic colour carries state only:** mint correct, coral incorrect or trap, peach hint/sketch, teal equations. Every callout has a tinted fill and a hairline border; no side-stripe accents.
- **Type:** Plex Sans for everything readable; condensed width (85%) for headings; Plex Mono for IDs, counts, labels and code. No italic headings. No em or en dashes in visible copy (normalised at startup for imported text).
- **Shape:** 14px cards and panels, 10px inputs and answer options, full pill for every button, chip, tag, segmented control and nav item. Circular option keys.
- **Depth:** flat panels with a 1px top highlight. Floating surfaces (dialogs, toast) use a defined edge and a small shadow only.
- **Figures:** computed plots render in theme colours. Original lecture and model images sit on a light "plate" so white-background scans stay legible on dark.
- **Motion (Emil):** transform and opacity only; buttons scale to 0.97 on press in 140ms; dialogs enter from 0.97 scale in 180ms with a strong ease-out; no animation on keyboard-driven actions; everything respects reduced motion.
- **Layout:** side rail 240px; content max 1200px (880px for reading pages); lessons have a sticky on-page index at desktop widths. Phone layout: rail becomes a drawer, lens buttons wrap, every grid collapses to one column with no horizontal scroll.

## Components
Today dashboard (next-lesson panel with lesson anatomy chips, readout strip, today's loop list, domain tiles with segmented meters), lesson reader (sectioned with periwinkle dot markers), question card (keyed options, per-option explanations, rubric checklist, four-step self-grade), drill and mock runners (progress bar of result segments, timer), code lab (teaching column plus editor and console).

## Visual learning components
Lessons has a direct sidebar entry and an expanded topic library, with search, topic and progress filters. Topic rows link straight to the reader. A prerequisite-aware reading path powers Today, the suggested next lesson and reader previous/next links; Learn retains the role-based priority tiers.

Sheets groups equations by source lesson rather than mixing a domain's formulas. Operating conditions and symbol mappings come first, followed by a circuit context and a source lecture crop or earlier figure, then display math. Source-linked lecture crops also appear in the lesson's visible Picture it section. The palette and original visual assets are preserved.

Inline vector figures share one renderer across lessons, questions, drills, mocks and labs. Every plate opens with a keyboard-accessible zoom button; captions explain what to inspect. SVGs use the same periwinkle, teal and semantic-state tokens as the app. Key gates, the mirror and the 6T bitcell use conventional connected drawings; complex circuits use explicit named nets. All model plots state their assumptions.

Questions preserve the attempt-first flow: solution annotations enter the DOM only after reveal. Contextual mock diagrams sit behind a native sketch-first disclosure; figure-reading exercises remain visible. Domain strips link to printable figure sheets. Printing temporarily uses the existing light theme, then restores the selected theme.

## Verification
`impeccable detect` is clean on all UI files. Every lesson, question (with answers revealed), lab and page renders without JS errors, KaTeX errors, visible dashes, or horizontal overflow at 375px and desktop widths.
