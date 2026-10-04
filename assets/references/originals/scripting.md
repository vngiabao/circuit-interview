## Part 1 — The answer to "What have you done with Perl, Tcl, Make?"

The JD says: *"Strong proficiency in scripting language, such as Perl, Tcl, Make, and automation methods/algorithms a certain plus."* Your NTT repo is real evidence for **Tcl and Make**, and for **Python**. It has **no Perl**. This companion turns what's in the repo into answers, and gives you the commands that make you sound like you've lived in these tools.

!!! guard "Ownership: confirm before Friday"
    The Innovus scripts start from a **course template** (header: "EECS 627 Final Lab, Created by Qirui Zhang"). What the **team added** on top is the interesting part: the Make pattern rules, the per-PE parameterization, and the Tcl procs for pins, route blockages and antenna diodes. **Claim only the pieces you wrote or ran**, and say "we started from the course's Innovus template and extended it." **[fill in: which procs/targets were yours]**

### 1.1 The 45-second answer

> "On our 130nm NTT chip, the whole flow was **driven by Make and Tcl**. We hardened the design **hierarchically**, and each of the 16 butterfly PEs had its index baked into the logic. So we used **Make pattern rules**: one `make -j` target launched **16 Design Compiler and 16 Innovus runs in parallel**, each parameterized by an **environment variable that the Tcl read**. In Innovus we extended the course template with **Tcl procedures**: interleaving about a thousand pins next to their SRAM banks, insetting route blockages over hard blocks, **attaching antenna diodes to whole buses**, and giving **extra optimization passes only to the PEs that failed timing**. **Python** generated golden vectors and test images. For **Perl**, I read and adapt it rather than write it from scratch; it's the same regex-and-loop skill, and I'd pick up the team's scripts quickly."

!!! value "Why this answer works"
    It's **specific** (numbers, tool names, a real problem each script solved), **honest** about Perl, and it shows the **automation mindset** the JD asks for: parameterize, parallelize, and target effort where it's needed.

### 1.2 The flow in one picture

DIAGRAM:scriptflow

**Say it as a sentence:** "Make calls **dc_shell** with a synthesis Tcl, then **innovus -init** with a main Tcl that sources one script per stage. Each block writes **GDS, netlists, SDF, a LEF abstract and a timing model**. The parent block uses the LEF and .lib as **black boxes**. Then **v2lvs** feeds LVS, and **VCS** runs SDF-annotated gate-level simulation against the Python golden model."

## Part 2 — Make: what you used, what it means

### 2.1 The real rule from your repo

```make
PE_SECTION_INDICES := $(shell seq 0 15)
.PHONY: syn-bfpe_all syn-bfpe_single-%
syn-bfpe_all: $(addprefix syn-bfpe_single-,$(PE_SECTION_INDICES))

syn-bfpe_single-%:
	mkdir -p "workdirsyn_PEs/PE$*"
	export PEIDX_PARAM="$*"; cd "workdirsyn_PEs/PE$*"; \
	  dc_shell -tcl_mode -xg_mode -f ../../syn/NTTcore/BFPE.syn.tcl \
	  | tee "../../syn_results/NTTcore/BFPE$*_output.txt"
```

**Read it line by line:**

- `$(shell seq 0 15)` → the list `0 1 … 15`.
- `$(addprefix syn-bfpe_single-, …)` → `syn-bfpe_single-0 … syn-bfpe_single-15`. So `syn-bfpe_all` **depends on 16 targets**.
- `syn-bfpe_single-%` is a **pattern rule**: `%` matches `7` in `syn-bfpe_single-7`, and **`$*`** (the "stem") becomes `7` inside the recipe.
- `export PEIDX_PARAM="$*"; cd …; dc_shell …` is all on **one logical line** because **each recipe line runs in its own shell**. An `export` or `cd` on a separate line would be forgotten.
- `| tee file` shows the log live **and** saves it.
- `.PHONY` says these targets **aren't files**, so Make always runs them.
- **`make -j16 syn-bfpe_all`** runs all 16 in parallel. Make builds the dependency graph and schedules independent targets concurrently.

### 2.2 Make vocabulary you should use naturally

| Term | Meaning | Where you'd say it |
| --- | --- | --- |
| Target / prerequisite / recipe | `target: prereqs` then tab-indented commands | "Each block's APR target depends on its synthesis netlist" |
| `$@` `$<` `$^` `$*` | Target name · first prerequisite · all prerequisites · pattern stem | "`$*` gave each PE its index" |
| Pattern rule `%` | One rule for many similar targets | "one rule for 16 PEs" |
| `.PHONY` | Target isn't a file | "our sim and syn targets are phony" |
| `-j N` | Parallel jobs | "16 PE runs in parallel" |
| `:=` vs `=` | Immediate vs lazy variable expansion | "`:=` so `seq` runs once" |
| Incremental builds | Real file targets rebuild only when inputs are newer | "what I'd add: make the netlist a real file target, so a PE only re-runs when its RTL changes" |

!!! guard "One subtle thing that sounds senior"
    `tool | tee log` returns **tee's** exit code, so a **failed** DC/Innovus run can look like success to Make. Fix: put `SHELL := /bin/bash` and `.SHELLFLAGS := -o pipefail -c` at the top of the Makefile. Mention it as "something I'd fix."

## Part 3 — Tcl: the language, then your procs

### 3.1 Tcl in ten rules

| Rule | Example | Note |
| --- | --- | --- |
| Everything is a string; commands are words | `set pitch 5` | No `=` |
| `$` substitutes a variable | `puts $pitch` | |
| `[ ]` runs a command and substitutes its result | `set box [dbGet …]` | Like `$( )` in shell |
| `{ }` = no substitution; `" "` = substitution | `{$x}` stays literal; `"$x"` expands | Bodies of `proc`/`if`/`for` go in braces |
| Math only inside `expr` | `set y [expr {$j * 760 + 510}]` | Brace the expression: faster and safer |
| Lists | `lindex $box 0`, `llength`, `lsearch -all -inline -glob` | A bounding box is a 4-item list |
| Procedures | `proc name {args} { … }` | |
| Pass by reference | `upvar 1 $slot_var slot` | Lets a proc update the caller's counter |
| Environment variables | `$::env(PEIDX_PARAM)`, `info exists ::env(X)` | How Make passed the PE index |
| Script location | `file dirname [file normalize [info script]]` | Makes scripts runnable from any directory |

!!! eq "The gotcha that proves you've actually written Tcl for EDA tools"
    **Square brackets in pin names must be escaped**, because `[0]` would be treated as a command. Your pin script does exactly this: `editPin -pin "${pin_name}\[$pin_idx\]"`. **Memory trick:** "in Tcl, brackets **run** things."

### 3.2 Your procs, explained

**(a) Inset route blockage over a hard block** (top level)

```tcl
proc create_inset_route_blk {inst_name layers inset} {
    set box [lindex [dbGet [dbGet top.insts.name $inst_name -p].box] 0]
    set llx [lindex $box 0]; set lly [lindex $box 1]
    set urx [lindex $box 2]; set ury [lindex $box 3]
    createRouteBlk -box "[expr {$llx+$inset}] [expr {$lly+$inset}] \
                         [expr {$urx-$inset}] [expr {$ury-$inset}]" \
                   -layer $layers -exceptpgnet
}
```

**Why:** stop top-level signal routing from running over a block on the layers the block uses internally. The **1.2 µm inset** keeps the block's **edge pins reachable**, and `-exceptpgnet` still lets **power straps** cross. The `dbGet … -p` idiom gets a **pointer** to the instance object, then `.box` reads its bounding box.

**(b) Attach antenna diodes to a whole bus** (NTTcore)

```tcl
proc attach_diode_to_entire_bus {inst_name bus_prefix diode_cell} {
    set inst_ptr [dbGet -p top.insts.name $inst_name]
    if {$inst_ptr == "0x0" || $inst_ptr == ""} { return }
    set all_iterms [dbGet ${inst_ptr}.instTerms.name]
    set pins [lsearch -all -inline -glob $all_iterms "*${bus_prefix}*"]
    foreach full $pins {
        set local_pin [lindex [split $full "/"] 1]
        attachDiode -diodeCell $diode_cell -pin $inst_name $local_pin
    }
}
```

**Why:** long inter-block buses (the permutation rows' `lut_address`, the PEs' write/twiddle-request addresses) kept failing **antenna checks**. So a diode (ANTENNATR) went on **every bit**: **608 diodes**, then `ecoPlace` and `ecoRoute`. Note the **defensive checks** ("instance not found", "no pins matched" → warn and return). That's what makes a script safe to run on 16 blocks.

!!! note "Antenna in one line"
    During fabrication, a long metal wire connected only to a gate collects charge while it's being etched and can **damage the thin gate oxide**. Fixes: a **diode** to bleed the charge, a **layer jump** (break the wire up to a higher metal so the gate only connects after the long run is formed), or shorter wires.

**(c) Pin interleaving by bank** (sram_row)

```tcl
proc place_pin {pin_name pin_idx loc} {
    editPin -pin "${pin_name}\[$pin_idx\]" -side LEFT -layer M3 \
            -spreadType START -start "0 $loc" -unit TRACK -fixedPin -spacing 1
}
# pattern per 4 slots: resp, req, req, resp → each bank's request and
# response bits sit side by side, right next to that SRAM
```

**Why:** about **1,100 pins at 5 µm pitch on M3**. Grouping each bank's **75-bit request** and **65-bit response** next to its SRAM keeps wires **short and matched** between NTTcore and the memory, instead of letting the tool scatter them. `upvar` lets the proc keep a running **slot counter** across calls.

**(d) Environment-driven, per-instance behavior** (BFPE)

```tcl
proc require_env_peidxparam {} {
  if {![info exists ::env(PEIDX_PARAM)] || $::env(PEIDX_PARAM) eq ""} {
    error "Missing required env var: PEIDX_PARAM"
  }
  return $::env(PEIDX_PARAM)
}
set PEIDX_PARAM [require_env_peidxparam]
set slack_failing_pes {12 14 15}
if {$PEIDX_PARAM in $slack_failing_pes} {
    optDesign -postRoute              ;# extra setup pass
    optDesign -postRoute -hold        ;# and hold
}
```

**Why:** **fail fast** if the parameter is missing (no silent run with the wrong PE). And **spend runtime only where it's needed**: PEs 12, 14, 15 missed slack, so only they get extra post-CTS/post-route optimization.

## Part 4 — Innovus commands by stage (learn these; they signal experience)

| Stage | Command | What it does / why it matters |
| --- | --- | --- |
| Init | `innovus -init apr_main.tcl` | Batch-run a flow script |
| | `setMultiCpuUsage -localCpu 4` | Multithreading (license-limited) |
| | MMMC: `create_rc_corner`, `create_delay_corner`, `create_analysis_view` | Corners and views for timing. **Yours had only TT**: say so |
| Floorplan | `floorPlan -s W H …` | Core size and margins |
| | `placeInstance inst x y R270 -fixed` | Fix a macro's location/orientation |
| | `addHaloToBlock` | Keep-out ring around macros for pin access and power hookup |
| | `createRouteBlk … -exceptpgnet` | Routing blockage that still allows power |
| | `editPin` (+ `setPinAssignMode -pinEditInBatch true`) | Pin placement; batch mode for speed |
| Power | `globalNetConnect VDD -type pgpin -pin VDD -inst *` | **Logical** power connection of every cell/macro |
| | `addRing -nets {VDD VSS} -width 2 -spacing 1` | Core rings |
| | `sroute -connect corePin` | Follow-pin rails on M1 that power standard-cell rows |
| | `addStripe -layer M5 -width 4 -spacing 2 -set_to_set_distance 50` | Power straps (your sram_row: M2/M4 at 20 µm, M5 at 50 µm) |
| Place | `setDesignMode -process 130` | Node-aware defaults |
| | `place_opt_design` | Placement + pre-CTS optimization |
| | `addTieHiLo` | Tie cells so gates never connect straight to rails |
| CTS | `create_ccopt_clock_tree_spec` + `clock_opt_design` | Build the clock tree (CCOpt) |
| | `set_ccopt_property target_skew 0.1`, `target_insertion_delay … -skew_group …` | Skew/latency targets per clock |
| | `optDesign -postCTS -hold` | **Hold fixing** after real clock skew exists |
| Route | `setNanoRouteMode -routeInsertAntennaDiode true -routeAntennaCellName ANTENNATR` | Antenna repair during routing |
| | `routeDesign -globalDetail` | Global + detailed routing |
| | `setAnalysisMode -analysisType onChipVariation -cppr both` | OCV analysis with pessimism removal |
| | `optDesign -postRoute` / `-hold` | Final timing fixes |
| Fix | `addFiller -cell {FILL64TR … FILL1TR}` | Fill row gaps (continuous wells and rails) |
| | `verifyGeometry`, `verifyConnectivity`, `verifyProcessAntenna` | Innovus-level DRC, opens/shorts, antenna |
| | `editDeleteViolations` + `globalDetailRoute`, `ecoRoute -fix_drc` | Rip up and reroute DRC hot spots |
| | `addMetalFill`, `trimMetalFill` | Density fill (blocks only to M4, top owns M5–M8) |
| Output | `write_sdf` | Delays for gate-level sim |
| | `streamOut … -mapFile` | GDS |
| | `saveNetlist -phys -includePowerGround` | Netlist with power, for LVS |
| | `write_lef_abstract -specifyTopLayer 5 -PGpinLayers {5}` | Abstract the parent sees |
| | `do_extract_model` | ETM .lib so the parent can time the block as a black box |
| Query | `dbGet top.insts.name`, `dbGet -p`, `report_timing -max_paths 1000` | Scripting against the database |

!!! value "One sentence that shows you understand hierarchy"
    "The **LEF abstract and ETM .lib are the contract** between a block and its parent. A mismatch there, like exporting power pins on a different layer than the parent's stripes, is exactly the kind of thing that breaks **top-level power-grid DRC/LVS**, which is where our chip didn't close."

## Part 5 — Design Compiler / SDC commands you used

```tcl
create_clock -name core_clk   -period 10 [get_ports mem_clk]
create_clock -name memory_clk -period 10 [get_ports hbm_clk]
set_clock_uncertainty 0.48 [get_clocks core_clk]
set_clock_transition  0.1  [get_clocks core_clk]
set_clock_groups -asynchronous -group core_clk -group memory_clk
set_false_path -from [get_ports {rstn big_n}]
set_disable_timing ROW_SRAM/ROW_SRAM -from CLKA -to CLKB
set_max_fanout 16 $top_level
set_fix_hold [all_clocks]
set_dont_touch_network [get_clocks {core_clk memory_clk}]
compile_ultra
```

| Command | Say this |
| --- | --- |
| `set_clock_groups -asynchronous` | "The two clocks are unrelated, so crossings go through **async FIFOs**; STA shouldn't time them" |
| `set_disable_timing … CLKA → CLKB` | "The dual-port SRAM model has arcs between its two port clocks. In our row both ports ran on the same core clock, so those arcs were **false** and would create bogus paths" |
| `set_false_path -from rstn` | "Async reset wasn't timed. **Honest gap:** no reset synchronizer, so deassertion wasn't guaranteed clean" |
| `set_clock_uncertainty` | "Margin for jitter and pre-CTS skew" |
| `set_dont_touch_network` on clocks | "Leave the clock tree to CTS" |
| `elaborate -parameters "PEIDX=$PEIDX_PARAM"` | "Same RTL, 16 different netlists" |

## Part 6 — LVS prep with v2lvs

```bash
v2lvs -a "<" ">" -v sram_row.apr.physical.v -o sram_row.cdl \
      -s  ibm13_with_vdd_vss.cdl  -s  ROW_SRAM_tri.cdl  … \
      -lsr ibm13_with_vdd_vss.cdl -lsr ROW_SRAM_tri.cdl … \
      -sl -s0 VSS -s1 VDD
```

- `-v`: the **physical Verilog** netlist from Innovus (includes power).
- `-s` / `-lsr`: **SPICE/CDL** netlists for the leaf cells, SRAM macros and I/O pads (so LVS knows their pins).
- `-a "<" ">"`: write buses with **angle brackets**.
- `-s0 VSS -s1 VDD`: map constant 0/1 to the ground and power nets.

**The two manual fixes** (from the course's LVS instructions):

1. Make **VDD/VSS inout ports** of the top netlist, and reconnect the pads' I/O supplies (not defined as power pins in the tech files).
2. Convert the SRAM compiler's CDL buses from `[ ]` to `< >`.

Fix 2 is a one-line script:

```bash
sed -E 's/\[([0-9]+)\]/<\1>/g' ROW_SRAM.cdl > ROW_SRAM_tri.cdl
perl -pe 's/\[(\d+)\]/<$1>/g' ROW_SRAM.cdl > ROW_SRAM_tri.cdl   # same in Perl
```

!!! value "Say this if asked how you debug LVS"
    "First I separate **netlist-prep problems** from **real layout problems**. Pin-name mismatches like `[0]` vs `<0>`, or power pins that aren't ports, make LVS fail with **thousands of errors** that are all one root cause. Once the netlist is right, the remaining **shorts** usually trace to power (a stripe via landing on a signal) and **opens** to missing connections at block boundaries. I debug the **smallest failing block first**."

## Part 7 — Perl, shell and Python: the report-parsing toolkit

You don't need to write large Perl programs. You need to **read** Perl and do **report surgery** fast.

### 7.1 Reading Perl in two minutes

| Syntax | Meaning |
| --- | --- |
| `$x`, `@list`, `%hash` | Scalar, array, hash (dictionary) |
| `my $x = 5;` | Declare a variable |
| `while (<FH>) { … }` | Loop over file lines; the line is in `$_` |
| `if (/slack\s+(-?[\d.]+)/) { $s = $1; }` | Regex match; `$1` is the first capture |
| `s/old/new/g` | Substitute |
| `$h{$cell}++` | Count occurrences per key |
| `split /\s+/, $line` | Split on whitespace |

### 7.2 One-liners worth memorizing

```bash
# how many violated paths in each report
grep -c "VIOLATED" reports/*setup*.rpt

# the first (worst) slack line in each PE's final setup report
for i in $(seq 0 15); do echo -n "PE$i: "; grep -m1 -i "slack" PE$i/final_setup_timing.rpt; done

# pull numbers after "Slack" and sort, worst first (check one report's format first)
grep -h -i "slack" *.rpt | awk '{print $NF}' | sort -n | head

# count DRC violations by type from a verifyGeometry report
grep -o "Violation: [A-Za-z ]*" geometry.rpt | sort | uniq -c | sort -rn

# Perl: print only lines with negative slack
perl -ne 'print if /slack.*-\d/i' final_setup_timing.rpt
```

!!! guard "Say this, it shows maturity"
    "Report formats differ between tools and versions, so I **check one report by eye first**, then write the parser, and I make the script **flag files it couldn't parse** instead of silently skipping them."

### 7.3 Python equivalent (what you'd actually write for a summary table)

```python
import re, glob
rows = []
for path in sorted(glob.glob("PE*/final_setup_timing.rpt")):
    txt = open(path).read()
    m = re.search(r"slack[^\n]*?(-?\d+\.\d+)", txt, re.I)
    rows.append((path.split("/")[0], float(m.group(1)) if m else None))
for pe, s in rows:
    flag = "MISSING" if s is None else ("FAIL" if s < 0 else "ok")
    print(f"{pe:6s} {s!s:>8} {flag}")
```

## Part 8 — "What would you improve?" (automation ideas from your own repo)

These are **real** issues in the repo. Offering fixes shows you think like the people who own the flows.

| What's in the repo | Better version |
| --- | --- |
| About 40 hand-copied `globalNetConnect` lines, one per SRAM/FIFO macro | One loop: `foreach i {0 1 2 3 4 5 6 7} { globalNetConnect VDD -type pgpin -pin VDD -inst sram_inst_${i}__mem_inst }`, or rely on `-inst *` |
| v2lvs bracket and power-port fixes done **by hand** after every APR run | A script in the flow (the `sed` line + netlist patch) so LVS is **reproducible** |
| Top, sram_row, DMA, SPI APR launched **by hand** | A Make target per block, and the hierarchy as real file dependencies |
| Clock periods typed separately per script (DMA synthesized at 3.2 ns vs 3.6 ns at top; SPI clock names swapped) | One `clocks.tcl` **sourced by every script**: a single source of truth |
| `exec rm -rf` on report directories to save disk during parallel runs | Keep a **one-line summary per PE** (WNS, TNS, DRC count, antenna count), then delete |
| `| tee` hides tool failures | `pipefail`, and fail the Make target on "ERROR" in the log |
| MMMC views all pointing at the typical library | Real **SS/FF corners** so setup and hold are checked where they're worst |

!!! value "The line to close the topic"
    "Scripting to me is about making results **reproducible and trustworthy**: same inputs, same outputs, and a loud failure when something's off. That matters even more for a library, because **thousands of engineers consume your numbers without re-checking them**."

## Part 9 — Likely questions, short answers

- **"How did you run 16 PE variants?"** A Make pattern rule; `$*` passed the index as an env var; Tcl read it with `::env` and elaborated with `-parameters`; `make -j` ran them in parallel.
- **"What does `upvar` do?"** It links a local name to a variable in the caller's scope: pass by reference. I used it for a running pin-slot counter.
- **"`{}` vs `""` in Tcl?"** Braces: no substitution (used for code bodies and `expr`). Quotes: variable and command substitution.
- **"Why escape brackets in pin names?"** In Tcl, `[ ]` runs a command, so `bus[3]` must be written as `bus\[3\]` or inside braces.
- **"`$@` vs `$<` vs `$*`?"** Target name, first prerequisite, pattern stem.
- **"Why does each Make recipe line need `;` or `\`?"** Each line runs in a separate shell, so `cd` and `export` don't carry over.
- **"How would you find the worst slack across 1,000 reports?"** grep/awk or a Python parser into a table, sorted; flag unparsed files; check the format on one report first.
- **"How do you make a flow script robust?"** Fail fast on missing inputs, no hard-coded paths (use `info script`), one config file for shared constants, log everything, and a summary at the end.
- **"Perl?"** "I read and modify it; my go-to for new scripts is Python. Regex and file processing carry over directly, and I'd ramp up on the team's Perl quickly."

## Part 10 — A 30-minute drill before Friday

1. **Say the 45-second answer (1.1) out loud** twice, with your confirmed ownership filled in.
2. **Write the Make pattern rule from memory** (Part 2.1) and explain `$*`, `.PHONY`, `-j`.
3. **Write `attach_diode_to_entire_bus` from memory** (a pointer, a glob filter, a `foreach`, a `split`).
4. **Explain three SDC lines**: clock groups, disable timing CLKA→CLKB, false path on reset.
5. **Do one `grep | awk | sort` one-liner** on any text file.
