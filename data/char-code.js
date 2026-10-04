/* CHAR and CODE: standard cells and libraries; scripting and automation. */
(function () {
  const r = String.raw;
  const blk = (lang, s) => '\n```' + lang + '\n' + s.trim() + '\n```\n';
  T.addUnits([
    {
      id: 'char-std-cell', d: 'char', order: 1, tier: 1, mins: 25,
      title: 'What a standard cell is, and what ships with it',
      goal: 'Explain a standard cell\'s physical template, the views a library delivers, and how a cell goes from schematic to signed-off Liberty.',
      tags: ['standard cell', 'library', 'track height', 'lef'],
      model: r`A **standard cell** is a pre-designed, pre-verified logic function (INV, NAND2, AOI22, DFF, ICG, level shifter...) laid out on a fixed **template**: a common height measured in routing **tracks** (for example 6T or 7.5T), VDD and VSS rails on the top and bottom edges shared with neighbours by abutment, n-well on the PMOS side, and pins on the routing grid. Width varies in multiples of the placement site (one gate pitch at FinFET nodes). Because every cell obeys the template, a placer can tile millions of them in rows.

A library ships several **views** of each cell: schematic and SPICE netlist (for LVS and simulation), layout GDS, an abstract **LEF** (size, pins, blockages, for place and route), **Liberty** timing, power and noise models per PVT corner, Verilog functional models, and often antenna and EM data.

Track height is a key trade-off: taller cells have wider devices and more internal routing room (faster, easier pin access); shorter cells are denser and lower power but weaker and harder to route. Libraries come in **Vt flavours** (ULVT to HVT) with identical footprints so tools can swap them, and in **drive strengths** (X1, X2, X4...).

The cell lifecycle: specification, schematic and sizing, layout to the template, DRC/LVS, parasitic extraction, characterisation across corners, Liberty QA against SPICE, then release and correlation to silicon.`,
      eq: [[r`\text{cell height} = N_{tracks} \times \text{metal pitch}`, 'For example 6 tracks × 28 nm ≈ 168 nm.']],
      traps: ['Describing a standard cell as "just a gate". It is a gate plus a physical template plus a set of models.', 'Forgetting the LEF abstract, which is what place and route actually sees.', 'Assuming all Vt flavours have different footprints; they share one so swaps are free in layout.'],
      say: r`A standard cell is a verified logic function laid out on a fixed template: common height in routing tracks, shared VDD and VSS rails by abutment, pins on the routing grid, width in multiples of the placement site. The library delivers schematics and netlists, GDS, LEF abstracts for place and route, Liberty models per corner and Verilog models, in several Vt flavours and drive strengths with shared footprints.`,
      ask: ['How do you pick a track height for a new library?', 'What would you build first for a brand-new node?', 'What goes into a multi-bit flop?', 'How do you decide whether to add a cell?'],
      checks: ['CHAR-001', 'CHAR-002', 'CHAR-005'],
    },
  ]);

  T.addQ([
    /* ---------- CHAR ---------- */
    { id: 'CHAR-001', d: 'char', u: 'char-std-cell', lvl: 1, f: 'multi', tags: ['views'],
      q: 'Which views does a standard-cell library typically deliver? Select all that apply.',
      opts: ['Liberty timing and power models per corner', 'LEF abstracts for place and route', 'GDS layout', 'The foundry\'s process recipe', 'Verilog functional models'],
      ans: [0, 1, 2, 4], why: ['Yes.', 'Yes.', 'Yes.', 'Process recipes are the foundry\'s and are not part of a cell library.', 'Yes.'] },
    { id: 'CHAR-002', d: 'char', u: 'char-std-cell', lvl: 1, f: 'mcq', tags: ['track height'],
      q: 'What is a likely consequence of moving a library from 7.5-track to 6-track cells?',
      opts: ['Higher density and lower power per cell, but weaker drive and harder pin access and routing.', 'Faster cells and easier routing.', 'No change except naming.', 'Only flip-flops shrink.'],
      ans: 0, why: ['Correct.', 'Opposite.', 'Height drives device width and routing.', 'All cells share the height.'] },
    { id: 'CHAR-003', d: 'char', u: 'liberty-tables', lvl: 2, f: 'num', ans: 62.5, tol: 0.01, unit: 'ps', tags: ['interpolation'],
      q: 'A delay table has corners d(20 ps, 10 fF) = 35, d(60, 10) = 55, d(20, 30) = 65, d(60, 30) = 95 ps. Bilinear interpolation at (40 ps, 20 fF)?',
      a: r`The point is at the centre of the cell, so $d = (35+55+65+95)/4 = 62.5$ ps.` },
    { id: 'CHAR-004', d: 'char', u: 'liberty-tables', lvl: 2, f: 'mcq', tags: ['ccs'],
      q: 'When does a CCS (current-source) model matter more than an NLDM delay table?',
      opts: ['When the load is a resistive interconnect or the waveform shape matters (noise, strong RC shielding), where a single slew and lumped load misrepresent the real behaviour.', 'Only for flip-flops.', 'Never; NLDM is always as accurate.', 'Only at the typical corner.'],
      ans: 0, why: ['Correct.', 'Applies to all arcs.', 'NLDM struggles with RC-dominated loads at advanced nodes.', 'Applies at all corners.'] },
    { id: 'CHAR-005', d: 'char', u: 'char-std-cell', lvl: 2, f: 'mcq', tags: ['library validation'],
      q: 'The .lib shows a cell 8% faster than your SPICE simulation at one corner. Which cause should you check first?',
      opts: ['Whether the comparison uses identical conditions: the same input slew, load, side-input state (arc condition), extraction and model version.', 'A bug in the STA tool.', 'Silicon will match the .lib, so ignore SPICE.', 'Change the library value by 8%.'],
      ans: 0, why: ['Mismatched conditions are the most common cause; then interpolation error, then characterisation setup.', 'Unlikely.', 'No.', 'Never patch without root cause.'] },
    { id: 'CHAR-006', d: 'char', u: 'sequential-characterization', lvl: 2, f: 'mcq', tags: ['setup hold'],
      q: 'Why are setup and hold characterised as tables indexed by clock and data slew?',
      opts: ['The internal race between clock and data paths depends on how fast each edge is, so the constraint changes with both slews.', 'For compatibility only.', 'Because flops have no clock-to-Q.', 'Because Liberty requires every value to be a table.'],
      ans: 0, why: ['Correct.', 'There is a physical reason.', 'No.', 'Scalars are allowed; tables are used because the dependence is real.'] },
    { id: 'CHAR-007', d: 'char', u: 'char-std-cell', lvl: 2, f: 'mcq', tags: ['lvf'],
      q: 'What does LVF (Liberty Variation Format) add to a library?',
      opts: ['Per-arc statistical sigma (and sometimes skew/moments) of delay, slew and constraints, used by statistical or POCV timing.', 'Layout views.', 'Leakage per state.', 'Voltage scaling factors only.'],
      ans: 0, why: ['Correct.', 'No.', 'Leakage per state is in standard Liberty.', 'No.'] },
    { id: 'CHAR-008', d: 'char', u: 'char-std-cell', lvl: 3, f: 'design', tags: ['new node'],
      q: 'You are bringing up a standard-cell library on a brand-new node. What do you build first, and why?',
      rub: ['Starts with a small, high-usage core set: inverters and buffers in several drives, NAND/NOR, a flop, a latch, an ICG, tie cells, fillers and well taps.', 'Uses that set to validate the template (height, rails, pin access, DRC at density) with a test block through place and route.', 'Characterises and correlates early against SPICE and, when available, silicon (ring oscillators).', 'Expands to complex gates, multi-bit flops, level shifters and power-management cells once the template is proven.'],
      a: 'Build the smallest set that can implement a real block: inverters and buffers in several drives, NAND2/NOR2, a few AOI/OAIs, one robust flop and latch, an ICG, tie-hi/lo, fillers, decaps and well taps. Use it to prove the template through a full place-and-route trial (pin access, DRC at high density, power-rail EM), characterise and correlate against SPICE and early silicon monitors, then expand to complex gates, multi-bit flops, level shifters and retention cells.' },
    { id: 'CHAR-009', d: 'char', u: 'char-std-cell', lvl: 2, f: 'mcq', tags: ['multi-bit flop'],
      q: 'Why do designers like multi-bit flip-flops (for example 4 flops sharing one cell)?',
      opts: ['They share clock buffering inside the cell, cutting clock pin capacitance and clock-tree power, and pack more densely.', 'They are always faster.', 'They remove the need for scan.', 'They eliminate hold violations.'],
      ans: 0, why: ['Correct; costs include less placement flexibility and possible timing imbalance across bits.', 'Not inherently.', 'They still need scan.', 'No.'] },
    { id: 'CHAR-010', d: 'char', u: 'spice-testbench', lvl: 2, f: 'mcq', tags: ['measure'],
      q: 'A delay measurement uses an ideal step input. What is the likely error?',
      opts: ['Delay is optimistic, because real gates see finite input slews that slow the output and change short-circuit current.', 'Delay is pessimistic by 2×.', 'No error.', 'The measurement cannot be made.'],
      ans: 0, why: ['Correct: drive inputs through a shaping stage or with a characterised slew.', 'Not in general.', 'There is an error.', 'It can be made; it is just wrong.'] },
    { id: 'CHAR-011', d: 'char', u: 'leakage-characterization', lvl: 1, f: 'mcq', tags: ['leakage state'],
      q: 'For a NAND2 (2-high NMOS stack), which input state usually gives the lowest subthreshold leakage?',
      opts: ['Both inputs 0: two series off NMOS (stack effect).', 'Both inputs 1.', 'A = 1, B = 0.', 'All states leak equally.'],
      ans: 0, why: ['Correct.', 'Then the two PMOS in parallel are off with full VDS, leaking more.', 'Only one off NMOS in the stack.', 'Leakage is strongly state dependent.'] },
    { id: 'CHAR-012', d: 'char', u: 'char-std-cell', lvl: 2, f: 'num', ans: 168, tol: 0.01, unit: 'nm', tags: ['cell height'],
      q: 'A library uses 6-track cells on a 28 nm metal pitch. What is the cell height in nm?',
      a: r`$6 \times 28 = 168$ nm.` },

    /* ---------- CODE ---------- */
    { id: 'CODE-001', d: 'code', u: 'tcl-language', lvl: 1, f: 'spot', tags: ['read-code', 'tcl'],
      q: 'What does this Tcl print?' + blk('tcl', `
set x 5
puts {value is $x}
puts "value is $x"`),
      opts: ['`value is $x` then `value is 5`', '`value is 5` twice', '`value is $x` twice', 'An error'],
      ans: 0, why: ['Braces suppress substitution; quotes allow it.', 'Braces do not substitute.', 'Quotes do substitute.', 'Both lines are legal.'] },
    { id: 'CODE-002', d: 'code', u: 'tcl-language', lvl: 2, f: 'spot', tags: ['read-code', 'tcl'],
      q: 'Why does this fail in an EDA tool console?' + blk('tcl', `
get_pins u_core/data[3]`),
      opts: ['`[3]` is command substitution in Tcl, so the shell tries to run a command named `3`. Use `{u_core/data[3]}` or escape the brackets.', 'Pins cannot be indexed.', '`get_pins` needs `-hier`.', 'The slash is illegal.'],
      ans: 0, why: ['Correct.', 'They can.', 'Not the cause.', 'Slashes are hierarchy separators.'] },
    { id: 'CODE-003', d: 'code', u: 'tcl-language', lvl: 2, f: 'mcq', tags: ['tcl', 'upvar'],
      q: 'What does `upvar 1 $name local` do inside a Tcl procedure?',
      opts: ['Makes `local` an alias for the caller\'s variable whose name is in `name`, so the procedure can modify it.', 'Copies the caller\'s variable into `local`.', 'Declares a global variable.', 'Increments `name`.'],
      ans: 0, why: ['Correct: Tcl\'s pass-by-reference.', 'It is an alias, not a copy.', 'That is `global`.', 'That is `incr`.'] },
    { id: 'CODE-004', d: 'code', u: 'report-parsing', lvl: 2, f: 'spot', tags: ['read-code', 'python'],
      q: 'This parser is used to sign off timing. What is the dangerous bug?' + blk('python', `
import re
def worst_slack(text):
    m = re.search(r"slack \\(VIOLATED\\)\\s+(-?[\\d.]+)", text)
    return float(m.group(1)) if m else 0.0`),
      opts: ['A missing or reformatted line returns 0.0, which looks like a clean, met path; it should raise or return a "missing" status.', 'The regex cannot match negative numbers.', '`float` cannot parse decimals.', '`re.search` only checks the first line.'],
      ans: 0, why: ['Correct: missing evidence must never look like a pass. (It also only finds violated paths.)', '`-?` handles negatives.', 'It can.', '`search` scans the whole string.'] },
    { id: 'CODE-005', d: 'code', u: 'report-parsing', lvl: 1, f: 'mcq', tags: ['shell'],
      q: 'Which command lists the 5 worst (most negative) slack values from many reports, given lines like `slack (VIOLATED) -0.123`?',
      opts: ['`grep -h "slack (VIOLATED)" *.rpt | awk \'{print $3}\' | sort -g | head -5`', '`grep slack *.rpt | head -5`', '`sort *.rpt | tail -5`', '`wc -l *.rpt`'],
      ans: 0, why: ['Correct: `sort -g` sorts numerically including negatives and e-notation; the most negative come first.', 'Takes the first five matches, not the worst.', 'Sorts whole lines alphabetically.', 'Counts lines.'] },
    { id: 'CODE-006', d: 'code', u: 'automation-audit', lvl: 2, f: 'spot', tags: ['read-code', 'python'],
      q: 'This compares cell delays between two library releases. What can go wrong?' + blk('python', `
old = dict(read_csv("rel1.csv"))   # cell -> delay
new = dict(read_csv("rel2.csv"))
for cell in new:
    change = (new[cell] - old[cell]) / old[cell]
    if abs(change) > 0.05:
        print(cell, change)`),
      opts: ['Cells missing from rel1 raise KeyError, cells removed in rel2 are silently ignored, duplicate rows are silently overwritten by dict(), and a zero old delay divides by zero.', 'Nothing; it is correct.', 'Only the print format is wrong.', 'Floats cannot be subtracted.'],
      ans: 0, why: ['Correct: reconcile key sets, reject duplicates and handle zero baselines explicitly.', 'Several silent failure modes.', 'Much more than formatting.', 'They can.'] },
    { id: 'CODE-007', d: 'code', u: 'automation-audit', lvl: 1, f: 'mcq', tags: ['make'],
      q: 'In a Makefile rule, what are `$@` and `$<`?',
      opts: ['`$@` is the target name, `$<` is the first prerequisite.', '`$@` is all prerequisites, `$<` is the target.', 'Both are the target.', 'They are shell variables unrelated to Make.'],
      ans: 0, why: ['Correct. `$^` is all prerequisites.', 'Backwards.', 'No.', 'They are Make automatic variables.'] },
    { id: 'CODE-008', d: 'code', u: 'report-parsing', lvl: 2, f: 'spot', tags: ['read-code', 'python'],
      q: 'What does this print?' + blk('python', `
vals = ["3n", "40p", "1.2u"]
scale = {"n": 1e-9, "p": 1e-12, "u": 1e-6}
print(sorted(vals))
print(sorted(vals, key=lambda s: float(s[:-1]) * scale[s[-1]]))`),
      opts: ["`['1.2u', '3n', '40p']` then `['40p', '3n', '1.2u']`", "`['40p', '3n', '1.2u']` twice", "`['3n', '40p', '1.2u']` twice", 'An error'],
      ans: 0, why: ['The first sort is alphabetical on strings; the second is numeric after unit scaling.', 'The first sort is a string sort.', 'Both lines sort.', 'Valid code.'] },
    { id: 'CODE-009', d: 'code', u: 'automation-audit', lvl: 2, f: 'multi', tags: ['robust flow'],
      q: 'Which practices make a characterisation or regression flow trustworthy? Select all that apply.',
      opts: ['A manifest of expected runs that is reconciled against completed results.', 'Treating a missing measurement as zero so averages still compute.', 'Recording tool, model and script versions with every result.', 'Failing loudly (non-zero exit, clear message) on parse errors.', 'Overwriting previous results in place to save disk.'],
      ans: [0, 2, 3], why: ['Yes.', 'Never: missing is not zero.', 'Yes.', 'Yes.', 'Destroys reproducibility.'] },
    { id: 'CODE-010', d: 'code', u: 'tcl-language', lvl: 2, f: 'mcq', tags: ['tcl', 'expr'],
      q: 'Why should Tcl `expr` arguments be braced, e.g. `expr {$a + $b}`?',
      opts: ['Braces let expr do its own single substitution and byte-compile the expression; unbraced, the parser substitutes first and expr substitutes again (slower, and unsafe if values contain brackets).', 'Braces make the result an integer.', 'Without braces expr is a syntax error.', 'Braces round the result.'],
      ans: 0, why: ['Correct.', 'No.', 'Unbraced works, just badly.', 'No.'] },
    { id: 'CODE-011', d: 'code', lvl: 1, f: 'num', ans: 2, tolAbs: 0, tags: ['bits'],
      q: 'In Python, what is `bin(0b10110100).count("1") - bin(0b0110).count("1")`?',
      a: '0b10110100 has four 1s (bits 7, 5, 4 and 2) and 0b0110 has two, so the result is 4 - 2 = 2. In Python 3.10+ you can also write `int.bit_count()`.' },
    { id: 'CODE-012', d: 'code', lvl: 3, f: 'design', tags: ['automation design'],
      q: 'Design a script that flags every standard cell whose delay moved more than 5% between two library releases, across all corners. What does it check and report?',
      rub: ['Parses both Liberty files per corner into a keyed structure (cell, arc, condition, table index).', 'Reconciles keys: reports cells or arcs added, removed or duplicated rather than skipping them.', 'Compares like with like (same slew/load indices; interpolates if the grids changed) and handles zero or tiny baselines.', 'Reports the worst change per cell with corner and arc, sorted, plus a summary count; exits non-zero if anything failed to parse.', 'Records versions and command lines for reproducibility.'],
      a: 'Parse each corner of both releases into a dictionary keyed by (cell, arc, when-condition, slew index, load index). Reconcile the key sets and report added, removed and duplicate entries explicitly. Compare values on matching grids (interpolate if indices changed), skip or flag near-zero baselines, compute relative change, and report the worst change per cell with its corner and arc, sorted, with a summary line. Exit non-zero on any parse error, and stamp the output with file hashes and tool versions.' },
  ]);
})();
