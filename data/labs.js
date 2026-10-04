/* Code corner labs. Each lab teaches, then tests. Python only (runs locally in Pyodide). */
(function () {
  T.addLabs([
    {
      id: 'py-units', track: 'basics', level: 1, mins: 15,
      title: 'Engineering numbers: parse "2.5n", "40fF" and "1.2meg"',
      goal: 'Write a finite-valued parser for an explicitly defined SPICE-style suffix convention.',
      teach: `This exercise uses a **SPICE-style suffix convention**: \`2.5n\`, \`40f\`, \`1.2meg\`, \`3.3\`. A script that reads them must convert to finite floats, and must **fail loudly** on invalid or overflowing values instead of silently returning 0 or infinity. Report formats and Liberty unit declarations can use different conventions; select the grammar from the actual input format.

Key details interviewers look for:

1. **SPICE suffixes are case-insensitive**, and \`m\` means milli while \`meg\` means mega. Check the longer suffix first.
2. Units after the suffix are ignored by SPICE (\`40fF\` is 40e-15). Strip trailing letters after a known suffix.
3. Never return 0 for an unparseable value. Raise \`ValueError\` with the offending text, so a broken report cannot become a passing check.
4. Check \`math.isfinite\` both after parsing the numeric token and after multiplying by the scale. \`1e999\` overflows while parsing; \`1e308t\` overflows only after scaling. Negative finite values are valid.
5. In this case-insensitive SPICE-style grammar, \`1F\` means \`1e-15\`: \`F\` is the femto scale. In strict case-sensitive SI notation, \`1 F\` denotes one farad. The restored strict-SI parsing lab uses its own grammar; do not silently mix the two conventions.

A clean pattern is one regular expression for the number, then a lookup table for the suffix:

\`\`\`python
import re
NUM = re.compile(r"^\\s*([-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][-+]?\\d+)?)\\s*([a-zA-Z]*)\\s*$")
\`\`\`
`,
      task: `Implement \`parse_si(text)\` returning a finite float under the SPICE-style convention above. Support \`f p n u m k meg g t\` (any case), trailing letters after a recognized scale (\`fF\`, \`ns\`, \`mV\`), bare units \`V s A Hz ohm\`, plain numbers and e-notation. Accept negative finite values. Raise \`ValueError\` for malformed input, unknown scales, an empty string, a nonfinite numeric token, or overflow after scaling. Here \`1F\` is femto, not one farad.`,
      starter: `import re
import math

SUFFIX = {
    # fill in: 'f': 1e-15, ...
}

def parse_si(text):
    """Convert '2.5n', '40fF', '1.2meg', '3.3' to float. Raise ValueError on garbage."""
    raise NotImplementedError

print(parse_si("2.5n"), parse_si("40fF"), parse_si("1.2meg"))
`,
      solution: `import re
import math

SUFFIX = {'f': 1e-15, 'p': 1e-12, 'n': 1e-9, 'u': 1e-6, 'm': 1e-3,
          'k': 1e3, 'meg': 1e6, 'g': 1e9, 't': 1e12}
NUM = re.compile(r"^\\s*([-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][-+]?\\d+)?)\\s*([a-zA-Z]*)\\s*$")

def parse_si(text):
    m = NUM.match(str(text))
    if not m:
        raise ValueError(f"not a number: {text!r}")
    value, tail = float(m.group(1)), m.group(2).lower()
    if not math.isfinite(value):
        raise ValueError(f"nonfinite numeric token: {text!r}")
    if not tail:
        scale = 1.0
    elif tail.startswith('meg'):
        scale = 1e6
    elif tail[0] in SUFFIX:
        scale = SUFFIX[tail[0]]
    # a bare unit such as 'v' or 's' with no scale prefix
    elif tail in ('v', 's', 'a', 'hz', 'ohm'):
        scale = 1.0
    else:
        raise ValueError(f"unknown suffix in {text!r}")
    result = value * scale
    if not math.isfinite(result):
        raise ValueError(f"scaled value overflow: {text!r}")
    return result

print(parse_si("2.5n"), parse_si("40fF"), parse_si("1.2meg"))
`,
      tests: `import math
def close(a, b): return math.isclose(a, b, rel_tol=1e-9, abs_tol=0)
assert close(parse_si("2.5n"), 2.5e-9)
assert close(parse_si("40fF"), 40e-15)
assert close(parse_si("1.2meg"), 1.2e6)
assert close(parse_si("1.2MEG"), 1.2e6)
assert close(parse_si("3m"), 3e-3), "m is milli, not mega"
assert close(parse_si("3.3"), 3.3)
assert close(parse_si("-1e-3"), -1e-3)
assert close(parse_si("-2.5n"), -2.5e-9)
assert close(parse_si("-1.2MEG"), -1.2e6)
assert close(parse_si("1F"), 1e-15), "SPICE-style F is femto; strict SI F is farad"
assert close(parse_si("1e308"), 1e308), "large but finite values remain valid"
assert close(parse_si("100ps"), 100e-12)
for bad in ["", "abc", "1.2.3n", "n5", "NaN", "inf", "-inf", "1e999", "-1e999", "1e308t", "-1e308t", "9e307meg"]:
    try:
        parse_si(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"should reject {bad!r}")
`,
      hints: ['Match the number and the trailing letters separately with one regex, then decide what the letters mean.', 'Test `meg` before you look at the first letter, otherwise `1meg` becomes 1 milli.', 'For `40fF` the first letter `f` is the scale; the rest is a unit you can ignore.'],
      explain: `The two traps are **m vs meg** and **silent failure**. Interviewers often follow up with: *"How would you handle \`1.5mil\` (a length unit) or \`10k\` in a resistor value?"* and *"Where in a flow would a silent 0 hurt you?"* (a missing delay parsed as 0 makes a timing comparison pass). Say that you would log the file and line of every rejected value.`,
    },
  ]);
})();
