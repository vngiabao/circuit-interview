---
name: GBVirtuoso
description: Instrument-panel study workspace for circuit, ASIC and VLSI interviews.
mode: Operate + Read
colors:
  bg: "oklch(0.165 0.006 250)"
  rail: "oklch(0.145 0.006 250)"
  panel: "oklch(0.2 0.007 250)"
  panel-2: "oklch(0.235 0.008 250)"
  line: "oklch(0.3 0.008 250)"
  ink: "oklch(0.94 0.004 250)"
  ink-2: "oklch(0.78 0.008 250)"
  accent: "oklch(0.87 0.165 96)"
  ch2: "oklch(0.8 0.1 210)"
  ok: "oklch(0.8 0.15 152)"
  bad: "oklch(0.72 0.17 25)"
  warn: "oklch(0.8 0.13 70)"
typography:
  ui: "IBM Plex Sans (variable, wdth 85-100)"
  mono: "IBM Plex Mono"
  h1: "clamp(30px, 3.6vw, 42px) / 600 / stretch 85%"
  body: "15.5px / 1.6"
  label: "Plex Mono 11px, uppercase, 0.08em tracking"
rounded: "6px everywhere (4px for tags and keys)"
---

# Design system: GBVirtuoso

## Direction
**Instrument dark.** The site should feel like a well-made EDA or oscilloscope tool you study in at night: graphite surfaces, crisp hairlines, monospaced numerics, and one signal-yellow accent borrowed from a scope's channel 1. Cyan (channel 2) appears only as the second trace in plots and in equation callouts.

Hallmark: custom bespoke "Instrument Panel" macrostructure, N3 side rail with N4 hidden command palette, Ft2 inline footer line. Taste dials: variance 4, motion 3, density 6. Impeccable mode: Operate for the dashboard, bank and drills; Read for lessons.

## Rules
- **One accent.** Yellow marks the primary action, the active nav item, must-conquer domains, focus and the hot data point in plots. Never decorative.
- **Semantic colour carries state only:** green correct, red incorrect or trap, amber hint/sketch, cyan equations. Every callout has a tinted fill and a hairline border; no side-stripe accents.
- **Type:** Plex Sans for everything readable; condensed width (85%) for headings; Plex Mono for IDs, counts, labels and code. No italic headings. No em or en dashes in visible copy (normalised at startup for imported text).
- **Shape:** 6px radius system-wide; 4px for tags and keyboard keys.
- **Depth:** flat panels with a 1px top highlight. Floating surfaces (dialogs, toast) use a defined edge and a small shadow only.
- **Figures:** computed plots render in theme colours. Original lecture and model images sit on a light "plate" so white-background scans stay legible on dark.
- **Motion (Emil):** transform and opacity only; buttons scale to 0.97 on press in 140ms; dialogs enter from 0.97 scale in 180ms with a strong ease-out; no animation on keyboard-driven actions; everything respects reduced motion.
- **Layout:** side rail 240px; content max 1200px (880px for reading pages); lessons have a sticky on-page index at desktop widths. Phone layout: rail becomes a drawer, lens buttons wrap, every grid collapses to one column with no horizontal scroll.

## Components
Today dashboard (next-lesson panel with lesson anatomy chips, readout strip, today's loop list, domain tiles with segmented meters), lesson reader (sectioned with yellow rule markers), question card (keyed options, per-option explanations, rubric checklist, four-step self-grade), drill and mock runners (progress bar of result segments, timer), code lab (teaching column plus editor and console).

## Verification
`impeccable detect` is clean on all UI files. Every lesson, question (with answers revealed), lab and page renders without JS errors, KaTeX errors, visible dashes, or horizontal overflow at 375px and desktop widths.
