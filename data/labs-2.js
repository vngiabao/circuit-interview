/* More Code corner labs: circuit models, report parsing and hardware algorithms. */
(function () {
  T.addLabs([
    {
      id: 'elmore-tree', track: 'model', level: 2, mins: 20,
      title: 'Elmore delay of an RC tree',
      goal: 'Compute the Elmore delay to every node of an RC tree, the standard first-order interconnect estimate.',
      teach: `The **Elmore delay** to node $i$ of an RC tree is

$$\\tau_i = \\sum_k R_{ik}\\,C_k$$

where $C_k$ is the capacitance at node $k$ and $R_{ik}$ is the resistance of the path from the root that is **shared** by the paths to $i$ and to $k$.

An equivalent way that is easier to code: walk the tree once from the leaves to compute the **downstream capacitance** of each node (its own C plus everything below it). Then the delay to a node is the sum, over every resistor on the path from the root, of that resistor times the downstream capacitance it drives:

$$\\tau_i = \\sum_{e \\in \\text{path}(root \\to i)} R_e\\,C_{down}(e)$$

Represent the tree as a dictionary: each node maps to (parent, resistance from parent, capacitance at node). The root has parent None.`,
      task: `Implement \`elmore(tree)\` returning a dict of node → Elmore delay (seconds). The tree format is \`{node: (parent, R_ohm, C_farad)}\`; the root has parent \`None\` and R 0. Raise \`ValueError\` if a parent is missing or the graph has a cycle.`,
      starter: `def elmore(tree):
    """tree: {node: (parent, R_from_parent, C_at_node)}. Return {node: delay}."""
    raise NotImplementedError

tree = {
    "drv": (None, 0, 0),
    "a":   ("drv", 100, 10e-15),
    "b":   ("a",   200, 20e-15),
    "c":   ("a",   300, 5e-15),
}
print(elmore(tree))
`,
      solution: `def elmore(tree):
    children = {n: [] for n in tree}
    roots = []
    for n, (p, R, C) in tree.items():
        if p is None:
            roots.append(n)
        elif p not in tree:
            raise ValueError(f"missing parent {p!r} for {n!r}")
        else:
            children[p].append(n)
    if len(roots) != 1:
        raise ValueError("tree must have exactly one root")
    # downstream capacitance, iterative post-order with cycle detection via reachability
    order, stack, seen = [], [roots[0]], set()
    while stack:
        n = stack.pop()
        if n in seen:
            raise ValueError("cycle detected")
        seen.add(n)
        order.append(n)
        stack.extend(children[n])
    if len(seen) != len(tree):
        raise ValueError("unreachable nodes (cycle or disconnected)")
    down = {}
    for n in reversed(order):
        down[n] = tree[n][2] + sum(down[c] for c in children[n])
    delay = {}
    for n in order:
        p, R, _ = tree[n]
        delay[n] = 0.0 if p is None else delay[p] + R * down[n]
    return delay

tree = {
    "drv": (None, 0, 0),
    "a":   ("drv", 100, 10e-15),
    "b":   ("a",   200, 20e-15),
    "c":   ("a",   300, 5e-15),
}
print(elmore(tree))
`,
      tests: `import math
t = {"drv": (None, 0, 0), "a": ("drv", 100, 10e-15), "b": ("a", 200, 20e-15), "c": ("a", 300, 5e-15)}
d = elmore(t)
# a: 100*(10+20+5)f = 3.5ps ; b: 3.5 + 200*20f = 7.5ps ; c: 3.5 + 300*5f = 5ps
assert math.isclose(d["a"], 3.5e-12, rel_tol=1e-9)
assert math.isclose(d["b"], 7.5e-12, rel_tol=1e-9)
assert math.isclose(d["c"], 5.0e-12, rel_tol=1e-9)
assert d["drv"] == 0
# a uniform 4-segment ladder approaches 0.5 RC as segments grow; check exact ladder value
lad = {"r": (None, 0, 0)}
prev = "r"
for i in range(4):
    lad[f"n{i}"] = (prev, 25, 25e-15); prev = f"n{i}"
assert math.isclose(elmore(lad)["n3"], 25*25e-15*(4+3+2+1), rel_tol=1e-9)
for bad in [{"a": ("zz", 1, 1e-15), "r": (None, 0, 0)}, {"a": ("b", 1, 1e-15), "b": ("a", 1, 1e-15)}]:
    try:
        elmore(bad)
    except ValueError:
        pass
    else:
        raise AssertionError("should reject " + str(bad))
`,
      hints: ['First build a children list for each node and find the single root.', 'Downstream capacitance of a node = its own C plus the downstream C of all its children. Compute it leaves-first.', 'Delay of a node = delay of its parent + R(parent→node) × downstream C of the node.'],
      explain: `This is the shared-resistance formula computed in two linear passes, O(N) instead of O(N²). Interviewers follow up with: *"Why is Elmore pessimistic for far nodes and optimistic for near ones?"* (it is the first moment of the impulse response, not the 50% point), *"How do you get the 50% delay?"* (≈ 0.69 τ for a lumped node, closer to 0.38 RC for a distributed line's own RC), and *"Where would you put a repeater?"*`,
    },
    {
      id: 'le-path', track: 'model', level: 2, mins: 20,
      title: 'Size a path with logical effort',
      goal: 'Turn the logical-effort method into code: stage count, stage effort, delay and the input capacitance of every gate.',
      teach: `For a path of gates with logical efforts $g_i$, branching $b_i$ and parasitics $p_i$, driving $C_{out}$ from $C_{in}$:

1. $G = \\prod g_i$, $B = \\prod b_i$, $H = C_{out}/C_{in}$, path effort $F = GBH$.
2. Best stage effort $\\hat f = F^{1/N}$ and delay $D = N\\hat f + \\sum p_i$.
3. Size **backwards** from the load: the input capacitance of stage $i$ is $C_{in,i} = \\frac{g_i\\,b_i\\,C_{out,i}}{\\hat f}$, and $C_{out,i-1} = C_{in,i}$.

The first stage's computed input capacitance must come back to $C_{in}$; that is your self-check.`,
      task: `Implement \`size_path(gates, c_in, c_out)\` where \`gates\` is a list of dicts with keys \`g\`, \`p\` and optional \`b\` (default 1). Return a dict with \`F\`, \`f\` (stage effort), \`D\` (delay in τ) and \`cin\` (list of input capacitances per stage, first equal to c_in).`,
      starter: `import math

def size_path(gates, c_in, c_out):
    raise NotImplementedError

# three NAND2 (g=4/3, p=2) from Cin=4 into 108
print(size_path([{"g": 4/3, "p": 2}] * 3, 4, 108))
`,
      solution: `import math

def size_path(gates, c_in, c_out):
    if not gates or c_in <= 0 or c_out <= 0:
        raise ValueError("need gates and positive capacitances")
    N = len(gates)
    G = math.prod(g["g"] for g in gates)
    B = math.prod(g.get("b", 1) for g in gates)
    H = c_out / c_in
    F = G * B * H
    f = F ** (1 / N)
    D = N * f + sum(g["p"] for g in gates)
    cin = [0.0] * N
    load = c_out
    for i in range(N - 1, -1, -1):
        gi = gates[i]
        cin[i] = gi["g"] * gi.get("b", 1) * load / f
        load = cin[i]
    return {"F": F, "f": f, "D": D, "cin": cin}

print(size_path([{"g": 4/3, "p": 2}] * 3, 4, 108))
`,
      tests: `import math
r = size_path([{"g": 4/3, "p": 2}] * 3, 4, 108)
assert math.isclose(r["F"], (4/3)**3 * 27, rel_tol=1e-9)
assert math.isclose(r["f"], 4.0, rel_tol=1e-9)
assert math.isclose(r["D"], 3*4 + 6, rel_tol=1e-9)
assert math.isclose(r["cin"][0], 4, rel_tol=1e-9), "first stage must return to c_in"
assert math.isclose(r["cin"][1], 12, rel_tol=1e-9) and math.isclose(r["cin"][2], 36, rel_tol=1e-9)
inv = size_path([{"g": 1, "p": 1}] * 4, 1, 256)
assert math.isclose(inv["D"], 20, rel_tol=1e-9)
br = size_path([{"g": 1, "p": 1, "b": 2}, {"g": 1, "p": 1}], 1, 8)
assert math.isclose(br["f"], 4, rel_tol=1e-9)
try:
    size_path([], 1, 2)
except ValueError:
    pass
else:
    raise AssertionError("empty path should be rejected")
`,
      hints: ['math.prod multiplies an iterable.', 'Walk the list in reverse: the last gate drives c_out.', 'Each input capacitance becomes the load of the previous stage.'],
      explain: `The three-NAND2 path gives stage effort exactly 4, sizes 4 → 12 → 36, and D = 18τ. Follow-ups: *"What if the optimum says 3.6 stages?"* (try 3 and 4, mind polarity), *"Where does branching come from?"* (off-path loads), *"Why might real sizes differ?"* (legal sizes, wire capacitance, layout).`,
    },
    {
      id: 'mc-mismatch', track: 'model', level: 2, mins: 25,
      title: 'Monte Carlo: sense-amp offset failure rate',
      goal: 'Estimate a failure probability by Monte Carlo, compare with the analytic answer, and state the confidence honestly.',
      teach: `A sense amplifier fails if its input offset exceeds the available bitline signal. Model the offset as Gaussian with $\\sigma = A_{VT}\\sqrt{2}/\\sqrt{WL}$ (Pelgrom, for a pair). The analytic failure probability for a signal $V_s$ is $p = 2Q(V_s/\\sigma)$ (two-sided), where $Q$ is the Gaussian tail.

Monte Carlo draws many samples and counts failures. Two things to say in an interview:

1. With $k$ failures in $N$ samples, $\\hat p = k/N$ has relative standard error about $1/\\sqrt{k}$, so you need many failures, not just many samples.
2. With **zero** failures, the 95% upper bound is about $3/N$, the rule of three. You cannot claim a 6σ design from 10,000 clean samples.

Use \`random.Random(seed)\` so results are reproducible, and \`statistics.NormalDist\` for the analytic tail.`,
      task: `Implement \`sigma_pair(avt_mv_um, w_um, l_um)\` (mV), \`analytic_fail(signal_mv, sigma_mv)\` (two-sided), \`mc_fail(signal_mv, sigma_mv, n, seed)\` returning the failure fraction, and \`upper_bound_zero(n)\` returning the rule-of-three bound.`,
      starter: `import math, random, statistics

def sigma_pair(avt_mv_um, w_um, l_um):
    raise NotImplementedError

def analytic_fail(signal_mv, sigma_mv):
    raise NotImplementedError

def mc_fail(signal_mv, sigma_mv, n, seed=1):
    raise NotImplementedError

def upper_bound_zero(n):
    raise NotImplementedError
`,
      solution: `import math, random, statistics

def sigma_pair(avt_mv_um, w_um, l_um):
    if w_um <= 0 or l_um <= 0:
        raise ValueError("device dimensions must be positive")
    return avt_mv_um * math.sqrt(2) / math.sqrt(w_um * l_um)

def analytic_fail(signal_mv, sigma_mv):
    z = signal_mv / sigma_mv
    return 2 * (1 - statistics.NormalDist().cdf(z))

def mc_fail(signal_mv, sigma_mv, n, seed=1):
    rng = random.Random(seed)
    fails = sum(1 for _ in range(n) if abs(rng.gauss(0, sigma_mv)) > signal_mv)
    return fails / n

def upper_bound_zero(n):
    return 3.0 / n
`,
      tests: `import math
s = sigma_pair(1.5, 0.5, 0.1)
assert math.isclose(s, 1.5*math.sqrt(2)/math.sqrt(0.05), rel_tol=1e-9)
p = analytic_fail(2*s, s)
assert math.isclose(p, 0.0455, rel_tol=0.01), p
m = mc_fail(2*s, s, 200000, seed=7)
assert abs(m - p) < 0.003, (m, p)
assert mc_fail(2*s, s, 1000, seed=3) == mc_fail(2*s, s, 1000, seed=3), "must be reproducible"
assert math.isclose(upper_bound_zero(1000), 0.003)
try:
    sigma_pair(1.5, 0, 0.1)
except ValueError:
    pass
else:
    raise AssertionError("zero width must be rejected")
`,
      hints: ['NormalDist().cdf(z) gives P(X < z) for a standard normal.', 'Two-sided: the offset can be positive or negative, so double the one-sided tail.', 'Create one random.Random(seed) and draw all samples from it.'],
      explain: `At 2σ the failure rate is about 4.6%, which Monte Carlo reproduces easily. Now ask yourself the interview follow-up: *"How many samples to verify 6σ (p ≈ 2×10⁻⁹)?"* Brute force needs billions; that is why memory teams use importance sampling (shift the sampling distribution toward the failure region and reweight) or extrapolate from fitted tails.`,
    },
    {
      id: 'gray-code', track: 'algo', level: 1, mins: 15,
      title: 'Gray code converters for CDC',
      goal: 'Write binary-to-Gray and Gray-to-binary converters and prove the one-bit-change property that makes Gray pointers safe to synchronise.',
      teach: `Gray code changes exactly one bit between consecutive values. That is why asynchronous FIFOs Gray-code their pointers before synchronising them: a pointer sampled during a transition is either the old or the new value.

- Binary to Gray: $g = b \\oplus (b \\gg 1)$.
- Gray to binary: each binary bit is the XOR of all Gray bits at or above it. In code, repeatedly XOR in right-shifted copies: \`b = g; s = g >> 1; while s: b ^= s; s >>= 1\`.

Also check the wrap: going from $2^n - 1$ back to 0 also changes one bit in an $n$-bit Gray counter, which is what makes Gray counters cyclic.`,
      task: `Implement \`bin2gray(b)\`, \`gray2bin(g)\` for non-negative integers, and \`hamming(a, b)\` (number of differing bits). Raise \`ValueError\` for negative inputs.`,
      starter: `def bin2gray(b):
    raise NotImplementedError

def gray2bin(g):
    raise NotImplementedError

def hamming(a, b):
    raise NotImplementedError
`,
      solution: `def bin2gray(b):
    if b < 0:
        raise ValueError("non-negative only")
    return b ^ (b >> 1)

def gray2bin(g):
    if g < 0:
        raise ValueError("non-negative only")
    b, s = g, g >> 1
    while s:
        b ^= s
        s >>= 1
    return b

def hamming(a, b):
    return bin(a ^ b).count("1")
`,
      tests: `assert bin2gray(4) == 0b0110
assert gray2bin(0b0110) == 4
for n in range(4096):
    assert gray2bin(bin2gray(n)) == n
for n in range(255):
    assert hamming(bin2gray(n), bin2gray(n + 1)) == 1
assert hamming(bin2gray(255) & 0xFF, bin2gray(0)) == 1, "8-bit wrap changes one bit"
assert hamming(7, 8) == 4, "binary 7->8 changes four bits"
for bad in (-1, -8):
    for f in (bin2gray, gray2bin):
        try:
            f(bad)
        except ValueError:
            pass
        else:
            raise AssertionError("negative input must be rejected")
`,
      hints: ['bin2gray is one line with XOR and a shift.', 'For gray2bin, accumulate XORs of ever-more-shifted copies of g.', 'hamming distance = popcount of a XOR b.'],
      explain: `The test that binary 7 → 8 changes four bits is the entire argument for Gray pointers: a synchronizer sampling mid-transition could see any of 16 values. Follow-up: *"Can you Gray-code a FIFO whose depth is not a power of two?"* (not with a plain Gray counter; the wrap would change more than one bit, so use a power-of-two depth or a special sequence).`,
    },
    {
      id: 'timing-report', track: 'parse', level: 2, mins: 25,
      title: 'Parse a timing report without hiding failures',
      goal: 'Extract endpoint, slack and status from a multi-path timing report, keep missing data visible, and summarise WNS, TNS and violation count.',
      teach: `Timing reports list paths as blocks. Each block names an **Endpoint** and ends with a **slack** line marked MET or VIOLATED. A good parser:

1. Splits the report into path blocks (here, separated by a line starting with \`Startpoint:\`).
2. Extracts the endpoint and slack from each block with a regex that tolerates negative numbers and e-notation.
3. Treats a block **without** a slack line as an error to report, never as zero.
4. Summarises **WNS** (worst negative slack, the minimum slack if negative, else 0), **TNS** (sum of negative slacks) and the number of violating paths, and keeps the worst slack per endpoint.`,
      task: `Implement \`parse_report(text)\` returning \`(paths, problems)\` where \`paths\` is a list of \`(endpoint, slack_float)\` and \`problems\` lists endpoints (or "unknown") whose block had no slack. Implement \`summary(paths)\` returning a dict with \`wns\`, \`tns\`, \`violations\` and \`worst_by_endpoint\`.`,
      starter: `import re

REPORT = """Startpoint: a_reg
Endpoint: x_reg/D
  data arrival time  0.812
  slack (VIOLATED)   -0.042
Startpoint: b_reg
Endpoint: y_reg/D
  slack (MET)        0.105
Startpoint: c_reg
Endpoint: x_reg/D
  slack (VIOLATED)   -1.5e-2
Startpoint: d_reg
Endpoint: z_reg/D
  data arrival time  0.700
"""

def parse_report(text):
    raise NotImplementedError

def summary(paths):
    raise NotImplementedError

print(parse_report(REPORT))
`,
      solution: `import re

REPORT = """Startpoint: a_reg
Endpoint: x_reg/D
  data arrival time  0.812
  slack (VIOLATED)   -0.042
Startpoint: b_reg
Endpoint: y_reg/D
  slack (MET)        0.105
Startpoint: c_reg
Endpoint: x_reg/D
  slack (VIOLATED)   -1.5e-2
Startpoint: d_reg
Endpoint: z_reg/D
  data arrival time  0.700
"""

END = re.compile(r"^\\s*Endpoint:\\s*(\\S+)", re.M)
SLACK = re.compile(r"slack\\s*\\((?:MET|VIOLATED)\\)\\s*([-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?)")

def parse_report(text):
    blocks = [b for b in re.split(r"(?m)^(?=Startpoint:)", text) if b.strip()]
    paths, problems = [], []
    for b in blocks:
        e = END.search(b)
        s = SLACK.search(b)
        name = e.group(1) if e else "unknown"
        if s is None:
            problems.append(name)
        else:
            paths.append((name, float(s.group(1))))
    return paths, problems

def summary(paths):
    neg = [s for _, s in paths if s < 0]
    worst = {}
    for ep, s in paths:
        worst[ep] = min(s, worst.get(ep, s))
    return {"wns": min(neg) if neg else 0.0, "tns": sum(neg), "violations": len(neg), "worst_by_endpoint": worst}

print(parse_report(REPORT))
`,
      tests: `import math
paths, problems = parse_report(REPORT)
assert problems == ["z_reg/D"], problems
assert ("x_reg/D", -0.042) in paths and ("y_reg/D", 0.105) in paths
assert any(ep == "x_reg/D" and math.isclose(s, -0.015) for ep, s in paths), "e-notation slack"
sm = summary(paths)
assert math.isclose(sm["wns"], -0.042)
assert math.isclose(sm["tns"], -0.057)
assert sm["violations"] == 2
assert math.isclose(sm["worst_by_endpoint"]["x_reg/D"], -0.042)
assert summary([("a", 0.2)])["wns"] == 0.0
`,
      hints: ['re.split with a lookahead (?=Startpoint:) keeps each block intact.', 'Build the slack regex to accept -1.5e-2 as well as -0.042.', 'A block with no slack goes into problems, not into paths with 0.'],
      explain: `The z_reg/D block has no slack line, maybe a truncated report. Returning it as a problem instead of slack 0 is the whole point. Follow-ups: *"How would you parse 1,000 reports in parallel?"* and *"How do you make sure the regex still matches after a tool upgrade?"* (golden-file tests on real report snippets).`,
    },
    {
      id: 'netlist-depth', track: 'algo', level: 3, mins: 30,
      title: 'Logic depth and fanout of a gate netlist',
      goal: 'Parse a tiny gate-level netlist, compute fanout per net and the logic depth of every net, and detect combinational loops.',
      teach: `A structural netlist is a directed graph: gates are nodes, nets are edges from a driver to its loads. Two questions come up constantly in flows and interviews:

- **Fanout** of a net: how many gate inputs it drives.
- **Logic depth** of a net: the largest number of gates between a primary input and that net. That is a longest-path problem on a DAG, solved with a topological order (Kahn's algorithm). If a topological order cannot include every gate, there is a **combinational loop**, which STA cannot time and lint must flag.

Netlist format for this lab: one gate per line, \`OUT = TYPE(IN1, IN2, ...)\`. Primary inputs are nets never driven by a gate.`,
      task: `Implement \`analyze(netlist)\` returning \`(fanout, depth)\`: \`fanout[net]\` = number of gate inputs it drives, \`depth[net]\` = gate levels from primary inputs (primary inputs have depth 0). Raise \`ValueError("combinational loop")\` if a loop exists and \`ValueError\` for a net driven twice.`,
      starter: `import re
from collections import defaultdict, deque

NET = """
n1 = NAND(a, b)
n2 = NAND(n1, c)
n3 = INV(n1)
y  = NOR(n2, n3)
"""

def analyze(netlist):
    raise NotImplementedError

print(analyze(NET))
`,
      solution: `import re
from collections import defaultdict, deque

NET = """
n1 = NAND(a, b)
n2 = NAND(n1, c)
n3 = INV(n1)
y  = NOR(n2, n3)
"""

LINE = re.compile(r"^\\s*(\\w+)\\s*=\\s*\\w+\\s*\\(([^)]*)\\)\\s*$")

def analyze(netlist):
    gates = {}
    for raw in netlist.strip().splitlines():
        if not raw.strip():
            continue
        m = LINE.match(raw)
        if not m:
            raise ValueError(f"cannot parse: {raw!r}")
        out, ins = m.group(1), [x.strip() for x in m.group(2).split(",") if x.strip()]
        if out in gates:
            raise ValueError(f"net {out} driven twice")
        gates[out] = ins
    fanout = defaultdict(int)
    for ins in gates.values():
        for n in ins:
            fanout[n] += 1
    indeg = {g: sum(1 for n in ins if n in gates) for g, ins in gates.items()}
    users = defaultdict(list)
    for g, ins in gates.items():
        for n in ins:
            if n in gates:
                users[n].append(g)
    depth = {n: 0 for ins in gates.values() for n in ins if n not in gates}
    q = deque(g for g, d in indeg.items() if d == 0)
    done = 0
    while q:
        g = q.popleft()
        done += 1
        depth[g] = 1 + max(depth[n] for n in gates[g]) if gates[g] else 1
        for u in users[g]:
            indeg[u] -= 1
            if indeg[u] == 0:
                q.append(u)
    if done != len(gates):
        raise ValueError("combinational loop")
    return dict(fanout), depth

print(analyze(NET))
`,
      tests: `fo, dp = analyze(NET)
assert fo["n1"] == 2 and fo["a"] == 1 and fo.get("y", 0) == 0
assert dp["a"] == 0 and dp["n1"] == 1 and dp["n2"] == 2 and dp["n3"] == 2 and dp["y"] == 3
try:
    analyze("x = NAND(y, a)\\ny = INV(x)")
except ValueError as e:
    assert "loop" in str(e)
else:
    raise AssertionError("loop not detected")
try:
    analyze("x = INV(a)\\nx = INV(b)")
except ValueError:
    pass
else:
    raise AssertionError("double driver not detected")
`,
      hints: ['Store gates as {output_net: [input_nets]}.', 'In-degree of a gate = number of its inputs that are driven by other gates.', 'Process gates in Kahn order; depth = 1 + max depth of inputs. If not every gate gets processed, there is a loop.'],
      explain: `This is the core of every timing graph: levelise, then propagate. Follow-ups: *"How does STA do this with real delays?"* (same traversal, adding arc delays and propagating max and min arrival times), *"How do you handle flip-flops?"* (they cut the graph: Q pins are startpoints, D pins endpoints).`,
    },
    {
      id: 'mtbf-stages', track: 'model', level: 2, mins: 15,
      title: 'How many synchronizer stages do you need?',
      goal: 'Compute synchronizer MTBF and the number of flops needed to hit a fleet-level reliability target.',
      teach: `For a synchronizer with $n$ flops, the first flop has roughly $t_r \\approx (n-1)T_{clk} + (T_{clk} - t_{su} - t_{cq})$ to resolve before the last one samples. Then

$$\\text{MTBF} = \\frac{e^{t_r/\\tau}}{T_w\\,f_{clk}\\,f_{data}}$$

A product target is usually stated for the **fleet**: number of chips × synchronizers per chip. The per-synchronizer MTBF must exceed the target multiplied by that count.`,
      task: `Implement \`mtbf(tr, tau, tw, fclk, fdata)\` in seconds, \`resolution_time(n, tclk, tsu, tcq)\`, and \`stages_needed(target_years, count, tau, tw, fclk, fdata, tsu, tcq)\` returning the smallest n ≥ 2 whose MTBF ≥ target × count.`,
      starter: `import math
YEAR = 3.15e7

def mtbf(tr, tau, tw, fclk, fdata):
    raise NotImplementedError

def resolution_time(n, tclk, tsu, tcq):
    raise NotImplementedError

def stages_needed(target_years, count, tau, tw, fclk, fdata, tsu, tcq):
    raise NotImplementedError
`,
      solution: `import math
YEAR = 3.15e7

def mtbf(tr, tau, tw, fclk, fdata):
    if tau <= 0 or tw <= 0 or fclk <= 0 or fdata <= 0:
        raise ValueError("parameters must be positive")
    return math.exp(tr / tau) / (tw * fclk * fdata)

def resolution_time(n, tclk, tsu, tcq):
    if n < 1:
        raise ValueError("need at least one flop")
    return (n - 1) * tclk + (tclk - tsu - tcq)

def stages_needed(target_years, count, tau, tw, fclk, fdata, tsu, tcq):
    need = target_years * YEAR * count
    tclk = 1 / fclk
    for n in range(2, 10):
        if mtbf(resolution_time(n, tclk, tsu, tcq), tau, tw, fclk, fdata) >= need:
            return n
    raise ValueError("target not reachable with fewer than 10 stages")
`,
      tests: `import math
m = mtbf(0.85e-9, 20e-12, 20e-12, 1e9, 1e8)
assert math.isclose(m / YEAR, 45400, rel_tol=0.02), m / YEAR
assert math.isclose(resolution_time(2, 1e-9, 50e-12, 100e-12), 1.85e-9)
# 3 GHz, tau 15 ps: tight case
n = stages_needed(1000, 1e6 * 5000, 15e-12, 15e-12, 3e9, 3e8, 30e-12, 60e-12)
assert n == 4, n  # 3 stages gives ~100 fleet-years, short of 1000
assert stages_needed(1, 1, 20e-12, 20e-12, 1e9, 1e8, 50e-12, 100e-12) == 2
`,
      hints: ['math.exp of a large exponent is fine up to about 700.', 'Resolution time for n flops adds a full clock period for each flop beyond the first.', 'Loop n from 2 upward and return the first that meets the target.'],
      explain: `At 3 GHz with τ = 15 ps, one synchronizer with two flops already has an MTBF of about 100 years, but a fleet of a million chips with 5,000 synchronizers each needs **four** stages to reach 1,000 fleet-years; three gives only about 100. Follow-ups: *"Why not just add ten flops?"* (latency), *"What makes τ worse?"* (low voltage, weak flops).`,
    },
    {
      id: 'drc-summary', track: 'parse', level: 1, mins: 15,
      title: 'Summarise a DRC result by rule',
      goal: 'Count DRC violations by rule from a results listing, sort by count, and flag rules that appeared since a previous run.',
      teach: `Physical-verification tools produce long listings of violations. The first thing anyone asks is "which rules, how many, and what is new?". A dictionary or \`collections.Counter\` keyed by rule name answers the first two; a set difference against the previous run answers the third.

Lines in this lab look like \`M2.S.1  spacing  (12.300, 45.120)\`: rule, category, location. Ignore blank lines and lines starting with \`#\`; reject anything else that does not parse, because a format change must not silently drop violations.`,
      task: `Implement \`count_rules(text)\` returning a \`Counter\` of rule → count (raising \`ValueError\` on an unparseable non-comment line), and \`new_rules(current, previous)\` returning the sorted list of rules present now but absent before.`,
      starter: `import re
from collections import Counter

RUN = """# DRC results
M2.S.1  spacing  (12.300, 45.120)
M2.S.1  spacing  (13.000, 45.120)
V1.EN.2 enclosure (1.0, 2.0)
M1.W.1  width    (0.5, 0.7)
"""

def count_rules(text):
    raise NotImplementedError

def new_rules(current, previous):
    raise NotImplementedError

print(count_rules(RUN).most_common())
`,
      solution: `import re
from collections import Counter

RUN = """# DRC results
M2.S.1  spacing  (12.300, 45.120)
M2.S.1  spacing  (13.000, 45.120)
V1.EN.2 enclosure (1.0, 2.0)
M1.W.1  width    (0.5, 0.7)
"""

LINE = re.compile(r"^(\\S+)\\s+(\\w+)\\s+\\(\\s*-?[\\d.]+\\s*,\\s*-?[\\d.]+\\s*\\)\\s*$")

def count_rules(text):
    c = Counter()
    for n, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = LINE.match(line)
        if not m:
            raise ValueError(f"line {n}: cannot parse {raw!r}")
        c[m.group(1)] += 1
    return c

def new_rules(current, previous):
    return sorted(set(current) - set(previous))

print(count_rules(RUN).most_common())
`,
      tests: `c = count_rules(RUN)
assert c["M2.S.1"] == 2 and c["V1.EN.2"] == 1 and sum(c.values()) == 4
assert c.most_common(1)[0] == ("M2.S.1", 2)
prev = count_rules("M2.S.1 spacing (1, 2)")
assert new_rules(c, prev) == ["M1.W.1", "V1.EN.2"]
try:
    count_rules("garbage line here")
except ValueError as e:
    assert "line 1" in str(e)
else:
    raise AssertionError("unparseable line must raise")
`,
      hints: ['Counter()[key] += 1 counts occurrences.', 'Skip blank and comment lines before matching.', 'Set difference finds rules that are new.'],
      explain: `Counting is easy; refusing to silently skip a changed format is what interviewers notice. Follow-up: *"How would you group violations by location to find one root cause that creates hundreds of errors?"* (cluster by coordinates or by cell instance).`,
    },
  ]);
})();
