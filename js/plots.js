/* Computed teaching figures. Every curve is generated from the stated model at render time.
 * These are illustrative first-order models, not PDK simulation or measurement. */
(function () {
  const T = window.T;
  let plotSerial = 0;
  const W = 640, H = 360, M = { l: 62, r: 20, t: 22, b: 48 };
  const fmt = (v) => {
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 1000 || a < 0.01) return v.toExponential(0).replace('e+', 'e');
    return +v.toFixed(a < 1 ? 2 : a < 10 ? 1 : 0) + '';
  };

  function frame(opt) {
    plotSerial++;
    const { x0, x1, y0, y1, xl, yl, logy, logx } = opt;
    const fx = (x) => { const v = logx ? (Math.log10(x) - Math.log10(x0)) / (Math.log10(x1) - Math.log10(x0)) : (x - x0) / (x1 - x0); return M.l + v * (W - M.l - M.r); };
    const fy = (y) => { const v = logy ? (Math.log10(Math.max(y, 1e-300)) - Math.log10(y0)) / (Math.log10(y1) - Math.log10(y0)) : (y - y0) / (y1 - y0); return H - M.b - v * (H - M.t - M.b); };
    let g = '';
    const xt = opt.xt || ticks(x0, x1, logx), yt = opt.yt || ticks(y0, y1, logy);
    xt.forEach((t) => { const X = fx(t); g += `<line x1="${X}" x2="${X}" y1="${M.t}" y2="${H - M.b}" class="pg"/><text x="${X}" y="${H - M.b + 16}" class="pt" text-anchor="middle">${opt.xf ? opt.xf(t) : fmt(t)}</text>`; });
    yt.forEach((t) => { const Y = fy(t); g += `<line x1="${M.l}" x2="${W - M.r}" y1="${Y}" y2="${Y}" class="pg"/><text x="${M.l - 8}" y="${Y + 4}" class="pt" text-anchor="end">${opt.yf ? opt.yf(t) : fmt(t)}</text>`; });
    g += `<line x1="${M.l}" x2="${W - M.r}" y1="${H - M.b}" y2="${H - M.b}" class="pax"/><line x1="${M.l}" x2="${M.l}" y1="${M.t}" y2="${H - M.b}" class="pax"/>`;
    g += `<text x="${(M.l + W - M.r) / 2}" y="${H - 10}" class="pl" text-anchor="middle">${xl}</text>`;
    g += `<text transform="translate(15 ${(M.t + H - M.b) / 2}) rotate(-90)" class="pl" text-anchor="middle">${yl}</text>`;
    return { fx, fy, g };
  }
  function ticks(a, b, log) {
    if (log) { const out = []; for (let e = Math.ceil(Math.log10(a)); e <= Math.floor(Math.log10(b)); e++) out.push(10 ** e); return out; }
    const span = b - a, raw = span / 5, mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= 6);
    const out = []; for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10)); return out;
  }
  const path = (pts, fx, fy) => 'M' + pts.filter((p) => isFinite(p[1])).map((p) => `${fx(p[0]).toFixed(1)},${fy(p[1]).toFixed(1)}`).join('L');
  const line = (pts, F, cls = 'pa', extra = '') => `<path d="${path(pts, F.fx, F.fy)}" class="${cls}" clip-path="url(#plot-clip-${plotSerial})" ${extra}/>`;
  const dot = (x, y, F, cls = 'pdot') => `<circle cx="${F.fx(x)}" cy="${F.fy(y)}" r="4" class="${cls}" clip-path="url(#plot-clip-${plotSerial})"/>`;
  const note = (x, y, txt, F, dx = 8, dy = -8, anchor = 'start') => `<text x="${F.fx(x) + dx}" y="${F.fy(y) + dy}" class="pn" text-anchor="${anchor}">${txt}</text>`;
  const hline = (y, F, cls = 'pref') => `<line x1="${M.l}" x2="${W - M.r}" y1="${F.fy(y)}" y2="${F.fy(y)}" class="${cls}"/>`;
  const vline = (x, F, cls = 'pref') => `<line x1="${F.fx(x)}" x2="${F.fx(x)}" y1="${M.t}" y2="${H - M.b}" class="${cls}"/>`;
  const legend = (items) => items.map((it, i) => `<g transform="translate(${W - M.r - 170} ${M.t + 8 + i * 18})"><line x1="0" x2="22" y1="0" y2="0" class="${it[0]}"/><text x="28" y="4" class="pn">${it[1]}</text></g>`).join('');
  const svg = (body, label) => `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T.esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="plot-clip-${plotSerial}"><rect x="${M.l}" y="${M.t}" width="${W-M.l-M.r}" height="${H-M.t-M.b}"/></clipPath></defs>${body}</svg>`;
  const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);

  /* square-law MOSFET with channel-length modulation */
  const ids = (vgs, vds, vt, k, lam) => {
    if (vgs <= vt) return 0;
    const vov = vgs - vt;
    return vds < vov ? k * (vov * vds - vds * vds / 2) * (1 + lam * vds) : 0.5 * k * vov * vov * (1 + lam * vds);
  };

  const P = {};
  // Exposed for numerical QA; these are illustrative models, not a process design kit.
  const models = T.plotModels = {
    subthreshold(vg, vd) {
      const n = 1.4, phi = 0.026, vt = 0.35 - 0.09 * vd;
      return 1e-7 * Math.log1p(Math.exp((vg-vt)/(2*n*phi))) ** 2 * (1-Math.exp(-vd/phi));
    },
    energy(v) {
      const ion = Math.log1p(Math.exp((v-.35)/(2*1.4*.026))) ** 2 * .008;
      return { dynamic: v*v, leakage: .24*v*v/ion };
    },
    droop(t) {
      const L=.5e-9, C=200e-9, R=.4e-3, I=20, alpha=R/(2*L);
      const wd=Math.sqrt(1/(L*C)-alpha*alpha);
      const drop=I*R+Math.exp(-alpha*t)*(-I*R*Math.cos(wd*t)+(I/C-alpha*I*R)/wd*Math.sin(wd*t));
      return 1-drop;
    },
  };

  P.vtc = () => {
    const VDD = 0.8, vtn = 0.25, vtp = 0.25, lam = 0.06;
    const solve = (vin, r) => { // r = kp/kn
      let lo = 0, hi = VDD;
      for (let i = 0; i < 60; i++) {
        const v = (lo + hi) / 2;
        const inn = ids(vin, v, vtn, 1, lam), ip = ids(VDD - vin, VDD - v, vtp, r, lam);
        if (inn > ip) hi = v; else lo = v;
      }
      return (lo + hi) / 2;
    };
    const F = frame({ x0: 0, x1: VDD, y0: 0, y1: VDD, xl: 'Vin (V)', yl: 'Vout (V)' });
    const curves = [[0.5, 'pc'], [1, 'pa'], [2, 'pb']].map(([r, c]) => [r, c, range(0, VDD, 160).map((v) => [v, solve(v, r)])]);
    const bal = curves[1][2];
    let vm = 0; bal.forEach(([x, y]) => { if (Math.abs(y - x) < Math.abs(solve(vm, 1) - vm)) vm = x; });
    let vil = 0, vih = VDD;
    for (let i = 1; i < bal.length; i++) {
      const s = (bal[i][1] - bal[i - 1][1]) / (bal[i][0] - bal[i - 1][0]);
      if (s < -1 && vil === 0) vil = bal[i][0];
      if (s >= -1 && vil && vih === VDD && bal[i][0] > vm) vih = bal[i][0];
    }
    let body = F.g + `<line x1="${F.fx(0)}" y1="${F.fy(0)}" x2="${F.fx(VDD)}" y2="${F.fy(VDD)}" class="pref"/>`;
    curves.forEach(([r, c, pts]) => (body += line(pts, F, c)));
    body += dot(vm, vm, F) + note(vm, vm, `VM ≈ ${vm.toFixed(2)} V`, F);
    body += vline(vil, F) + vline(vih, F) + note(vil, 0.06, 'VIL', F, 4, 0) + note(vih, 0.06, 'VIH', F, 4, 0);
    body += legend([['pc', 'βp/βn = 0.5 (weak PMOS)'], ['pa', 'βp/βn = 1 (balanced)'], ['pb', 'βp/βn = 2 (strong PMOS)']]);
    return svg(body, 'Inverter voltage transfer curves for three beta ratios');
  };

  P.idvds = () => {
    const vt = 0.3, k = 1, lam = 0.08;
    const F = frame({ x0: 0, x1: 1, y0: 0, y1: 0.27, xl: 'VDS (V)', yl: 'ID (normalised)' });
    let body = F.g;
    [0.5, 0.6, 0.7, 0.8, 0.9].forEach((vg, i) => {
      const pts = range(0, 1, 100).map((v) => [v, ids(vg, v, vt, k, lam)]);
      body += line(pts, F, i === 4 ? 'pb' : 'pa');
      body += note(1, pts[100][1], `VGS ${vg}`, F, -4, -6, 'end');
    });
    const bnd = range(0, 0.6, 60).map((vov) => [vov, 0.5 * k * vov * vov * (1 + lam * vov)]);
    body += line(bnd, F, 'pref');
    body += note(0.36, 0.5 * 0.36 * 0.36 * 1.03, 'VDS = VGS - VT (pinch-off)', F, -6, -10, 'end');
    body += note(0.12, 0.2, 'triode', F) + note(0.62, 0.2, 'saturation', F);
    return svg(body, 'MOSFET output characteristics with the triode/saturation boundary');
  };

  P.subvt = () => {
    const n = 1.4, vt0 = 0.35, dibl = 0.09, i0 = 1e-7, phi = 0.026;
    const id = models.subthreshold;
    const F = frame({ x0: 0, x1: 0.9, y0: 1e-11, y1: 1e-3, xl: 'VGS (V)', yl: 'ID (A, log)', logy: true, yf: (t) => `1e${Math.round(Math.log10(t))}` });
    let body = F.g;
    const lo = range(0, 0.9, 120).map((v) => [v, id(v, 0.05)]), hi = range(0, 0.9, 120).map((v) => [v, id(v, 0.8)]);
    body += line(lo, F, 'pa') + line(hi, F, 'pb');
    const ss = n * phi * Math.log(10) * 1000;
    body += note(0.12, id(0.12, 0.8), `slope ≈ ${ss.toFixed(0)} mV/dec`, F, 8, 14);
    body += dot(0, id(0, 0.8), F) + dot(0, id(0, 0.05), F) + note(0, id(0, 0.8), 'Ioff rises with VDS (DIBL)', F, 10, -6);
    body += legend([['pa', 'VDS = 0.05 V'], ['pb', 'VDS = 0.8 V']]);
    return svg(body, 'Subthreshold current on a log scale showing slope and DIBL shift');
  };

  P.stages = () => {
    const F0 = 256, p = 1;
    const F = frame({ x0: 1, x1: 10, y0: 0, y1: 60, xl: 'Number of stages N', yl: 'Path delay D (τ units)', xt: range(1, 10, 9) });
    const pts = range(1, 10, 9).map((N) => [N, N * F0 ** (1 / N) + N * p]);
    let body = F.g + line(pts, F, 'pa') + pts.map(([x, y]) => dot(x, y, F, x === 4 ? 'pdot hot' : 'pdot')).join('');
    body += note(4, pts[3][1], `N = 4, f = ${(F0 ** 0.25).toFixed(1)}, D = ${pts[3][1].toFixed(1)}τ`, F, 8, -10);
    body += note(2, 58, `N = 1 would be ${(F0 + p).toFixed(0)}τ (off scale)`, F, 0, 4);
    return svg(body, 'Logical-effort path delay versus number of stages for path effort 256');
  };

  P.mtbf = () => {
    const tau = 20e-12, tw = 20e-12, fc = 1e9, fd = 0.1e9;
    const mt = (t) => Math.exp(t / tau) / (tw * fc * fd);
    const F = frame({ x0: 0, x1: 1.0e-9, y0: 1e-8, y1: 1e16, xl: 'Resolution time tr (ns)', yl: 'MTBF (s, log)', logy: true, xf: (t) => (t * 1e9).toFixed(1), yf: (t) => `1e${Math.round(Math.log10(t))}`, yt: [1e-8, 1e-4, 1, 1e4, 1e8, 1e12, 1e16] });
    let body = F.g + line(range(0, 1e-9, 100).map((t) => [t, mt(t)]), F, 'pa');
    body += hline(3.15e7 * 1000, F) + note(0.02e-9, 3.15e10, '1000 years', F, 0, -6);
    const one = 1e-9 - 50e-12, two = 2 * 1e-9 - 100e-12;
    body += dot(one, mt(one), F, 'pdot hot') + note(one, mt(one), '2-flop chain: one interstage resolution interval', F, -8, 18, 'end');
    body += note(0.05e-9, 1e13, `τ = 20 ps, Tw = 20 ps, fclk = 1 GHz, fdata = 100 MHz`, F, 0, 0);
    body += note(0.05e-9, 1e11, `Each extra flop adds ~one Tclk of tr: MTBF × e^(Tclk/τ) = × e^50`, F, 0, 0);
    return svg(body, 'Synchronizer MTBF grows exponentially with resolution time');
  };

  P.wire = () => {
    const r = 0.1, c = 0.2, Rd = 1, Cd = 1, tau0 = Rd * Cd; // normalised per unit length
    const unrep = (L) => 0.38 * r * c * L * L + 0.69 * Rd * c * L;
    const k = Math.sqrt(1.38 * Rd * Cd / (0.38 * r * c)); // minimizes delay/length in the stated fixed-size repeater model
    const rep = (L) => (L / k) * (0.38 * r * c * k * k + 0.69 * (Rd * (c * k + Cd) + r * k * Cd) + 0.69 * tau0);
    const F = frame({ x0: 0, x1: 40, y0: 0, y1: 50, xl: 'Wire length (normalised)', yl: 'Delay (normalised)' });
    let body = F.g + line(range(0, 40, 80).map((L) => [L, unrep(L)]), F, 'pa') + line(range(0, 40, 80).map((L) => [L, rep(L)]), F, 'pb');
    const cross = range(1, 40, 390).find((L) => rep(L) < unrep(L));
    body += dot(cross, rep(cross), F) + note(cross, rep(cross), `repeaters win beyond ≈ ${cross.toFixed(0)}`, F, 8, 14);
    body += legend([['pa', 'Unrepeated: grows ∝ L²'], ['pb', 'Fixed-size repeaters: ∝ L']]);
    return svg(body, 'Unrepeated wire delay grows quadratically while repeated wire delay grows linearly');
  };

  P.rcstep = () => {
    const F = frame({ x0: 0, x1: 4, y0: 0, y1: 1.05, xl: 'Time (units of RC)', yl: 'Vout / VDD' });
    let body = F.g + line(range(0, 4, 120).map((t) => [t, 1 - Math.exp(-t)]), F, 'pa');
    [[0.5, Math.log(2)], [0.9, Math.log(10)], [0.632, 1]].forEach(([v, t]) => { body += dot(t, v, F, v === 0.5 ? 'pdot hot' : 'pdot') + note(t, v, `${Math.round(v * 100)}% at ${t.toFixed(2)} RC`, F, 8, 14); });
    body += note(2.2, 0.35, '10% to 90% rise = ln 9 ≈ 2.2 RC', F);
    return svg(body, 'RC step response with 50, 63 and 90 percent crossing times');
  };

  P.energy = () => {
    // Energy/op: normalized C V² plus assumed constant leakage-current scale × V × delay.
    const vt = 0.35, n = 1.4, phi = 0.026, a = 1.4;
    const Edyn = (v) => models.energy(v).dynamic, Eleak = (v) => models.energy(v).leakage;
    const F = frame({ x0: 0.15, x1: 1.0, y0: 0, y1: 2, xl: 'VDD (V)', yl: 'Energy per operation (normalised)' });
    const pts = range(0.15, 1.0, 170);
    const tot = pts.map((v) => [v, Edyn(v) + Eleak(v)]);
    let mi = tot.reduce((m, p) => (p[1] < m[1] ? p : m));
    let body = F.g + line(pts.map((v) => [v, Edyn(v)]), F, 'pa') + line(pts.map((v) => [v, Eleak(v)]), F, 'pc') + line(tot, F, 'pb');
    body += dot(mi[0], mi[1], F, 'pdot hot') + note(mi[0], mi[1], `minimum ≈ ${mi[0].toFixed(2)} V in this model`, F, -8, -10, 'end');
    body += note(.17, 1.9, 'Low-V energy continues above this axis; VT = 0.35 V', F, 0, 0);
    body += legend([['pa', 'Dynamic C·VDD²'], ['pc', 'Leakage × (slower) delay'], ['pb', 'Total']]);
    return svg(body, 'Energy per operation versus supply voltage showing a minimum-energy point');
  };

  P.pushout = () => {
    const tcq0 = 40, tau = 6, m0 = 8;
    const tcq = (m) => tcq0 + tau * Math.log(1 + Math.exp(-(m - m0) / 2.2) * 8);
    const F = frame({ x0: 0, x1: 80, y0: 30, y1: 100, xl: 'Data-to-clock setup margin (ps)', yl: 'Clock-to-Q delay (ps)' });
    const pts = range(2, 80, 156).map((m) => [m, tcq(m)]);
    const nominal = tcq(80), lim = nominal * 1.1;
    const su = pts.find((p) => p[1] <= lim);
    let body = F.g + line(pts.map(([x, y]) => [x, Math.min(y, 100)]), F, 'pa') + hline(lim, F) + note(78, lim, '10% pushout criterion', F, 0, -6, 'end');
    body += dot(su[0], su[1], F, 'pdot hot') + note(su[0], su[1], `setup time ≈ ${su[0].toFixed(0)} ps`, F, 8, -10);
    body += note(4, 96, 'Illustrative pushout curve; capture failure is not modeled', F, 4, 0);
    return svg(body, 'Clock-to-Q pushout as data arrives closer to the clock edge defines setup time');
  };

  P.bitline = () => {
    const C = 120e-15, I = 25e-6, V = 0.8, need = 0.08;
    const t1 = need * C / I;
    const F = frame({ x0: 0, x1: 700e-12, y0: 0.62, y1: 0.82, xl: 'Time after wordline rise (ps)', yl: 'Bitline voltage (V)', xf: (t) => Math.round(t * 1e12) });
    let body = F.g + line([[0, V], [700e-12, V]], F, 'pc') + line(range(0, 700e-12, 70).map((t) => [t, V - I * t / C]), F, 'pa');
    body += vline(t1, F) + dot(t1, V - need, F, 'pdot hot') + note(t1, V - need, `80 mV at ≈ ${Math.round(t1 * 1e12)} ps`, F, 8, 16);
    body += note(25e-12, .637, 'Example signal target; SAE also needs offset/noise/yield margin', F, 0, 0);
    body += legend([['pc', 'BLB (stays precharged)'], ['pa', 'BL (cell discharges)']]);
    return svg(body, 'SRAM bitline differential development before sense enable');
  };

  P.pelgrom = () => {
    const A = 1.5; // mV·µm; pair-mismatch coefficient, already includes both devices
    const F = frame({ x0: 0, x1: 24, y0: 0, y1: 40, xl: '1 / √(W·L)  (µm⁻¹)', yl: 'σ(ΔVT) of a pair (mV)' });
    let body = F.g + line(range(0, 24, 60).map((x) => [x, A * x]), F, 'pa');
    [[0.05, 0.05], [0.1, 0.03], [0.2, 0.1]].forEach(([w, l]) => { const x = 1 / Math.sqrt(w * l); body += dot(x, A * x, F) + note(x, A * x, `${w * 1000}×${l * 1000} nm`, F, 8, 14); });
    body += note(0.5, 37, 'σ(ΔVT) = AVT / √(WL); pair AVT = 1.5 mV·µm (illustrative)', F);
    body += note(0.5, 33, '4× the area halves the mismatch', F);
    return svg(body, 'Pelgrom threshold mismatch scales with inverse square root of device area');
  };

  P.yield = () => {
    const bits = 2 ** 20 * 8; // 1 MB
    const Q = (z) => 0.5 * erfc(z / Math.SQRT2);
    const F = frame({ x0: 3, x1: 7, y0: 0, y1: 100, xl: 'Bit-cell margin in σ', yl: 'Array yield, 8 Mb no repair (%)' });
    const pts = range(3, 7, 160).map((z) => [z, 100 * Math.exp(bits * Math.log1p(-Q(z)))]);
    const z90 = pts.find((p) => p[1] >= 90);
    let body = F.g + line(pts, F, 'pa') + dot(z90[0], z90[1], F, 'pdot hot') + note(z90[0], z90[1], `90% yield needs ≈ ${z90[0].toFixed(2)}σ per cell`, F, -8, -8, 'end');
    body += note(3.1, 90, 'Y = (1 - p_fail)^N, p_fail = Q(z)', F);
    return svg(body, 'Memory array yield versus per-cell sigma margin');
  };

  P.droop = () => {
    const L = 0.5e-9, C = 200e-9, R = 0.4e-3, I = 20, V0 = 1.0; // first-droop RLC
    const w0 = 1 / Math.sqrt(L * C), z = (R / 2) * Math.sqrt(C / L), wd = w0 * Math.sqrt(1 - z * z);
    const v = models.droop;
    const tmax = 6 * 2 * Math.PI / wd;
    const F = frame({ x0: 0, x1: tmax, y0: -0.1, y1: 2.1, xl: 'Time after a current step (ns)', yl: 'Ideal RLC node voltage (V)', xf: (t) => Math.round(t * 1e9) });
    const pts = range(0, tmax, 300).map((t) => [t, v(t)]);
    const lo = pts.reduce((m, p) => (p[1] < m[1] ? p : m));
    const f = wd / (2 * Math.PI);
    let body = F.g + line(pts, F, 'pa') + hline(V0 - I * R, F) + dot(lo[0], lo[1], F, 'pdot hot');
    body += note(lo[0], lo[1], `first droop ≈ ${((V0 - lo[1]) * 1000).toFixed(0)} mV at ≈ ${(lo[0] * 1e9).toFixed(0)} ns`, F, 8, 14);
    body += note(tmax * 0.98, V0 - I * R, 'settles to IR', F, 0, -6, 'end');
    body += note(tmax * 0.98, 2.03, `L = 0.5 nH, C = 200 nF, R = 0.4 mΩ; 20 A step`, F, 0, 0, 'end');
    body += note(tmax * 0.98, 1.88, `f ≈ ${(f / 1e6).toFixed(0)} MHz; ideal load model, not a valid chip supply`, F, 0, 0, 'end');
    return svg(body, 'Supply droop after a load current step in a package-inductance and on-die-decap network');
  };

  P.leakT = () => {
    const F = frame({ x0: 0, x1: 125, y0: 1, y1: 1000, xl: 'Temperature (°C)', yl: 'Ioff (relative, log)', logy: true });
    const pts = range(0, 125, 50).map((t) => [t, 2 ** (t / 18)]);
    let body = F.g + line(pts, F, 'pa') + note(10, 300, 'Illustrative law: Ioff/Ioff(0 °C) = 2^(T/18 °C)', F) + note(10, 180, 'Doubling interval is assumed, not universal process behavior', F);
    return svg(body, 'Leakage current rises exponentially with temperature');
  };

  function erfc(x) { const z = Math.abs(x), t = 1 / (1 + 0.5 * z); const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }

  /* ---------- schematics (hand-placed, real signal paths) ---------- */
  const S = (w, h, body, label) => `<svg class="plot sch" viewBox="0 0 ${w} ${h}" role="img" aria-label="${T.esc(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const ff = (x, y, name) => `<rect x="${x}" y="${y}" width="70" height="80" class="sbox"/><text x="${x + 8}" y="${y + 26}" class="sl">D</text><text x="${x + 52}" y="${y + 26}" class="sl">Q</text><path d="M${x} ${y + 58} l10 8 l-10 8" class="sw"/><text x="${x + 35}" y="${y + 100}" class="sl" text-anchor="middle">${name}</text>`;

  P.sync2 = () => {
    let b = '';
    b += `<text x="20" y="40" class="sh">clk A domain</text><text x="300" y="40" class="sh">clk B domain</text>`;
    b += `<line x1="270" y1="20" x2="270" y2="250" class="sdash"/>`;
    b += ff(60, 70, 'launch (A)') + ff(330, 70, 'sync 1') + ff(480, 70, 'sync 2');
    b += `<path d="M130 96 H330" class="sw"/><path d="M400 96 H480" class="sw"/><path d="M550 96 H620" class="sw"/>`;
    b += `<text x="410" y="86" class="sn">resolves here</text><text x="560" y="86" class="sn">lower risk</text>`;
    b += `<path d="M20 202 H40 V136 H60" class="sw"/><text x="20" y="220" class="sl">clkA</text>`;
    b += `<path d="M300 230 H460 M310 230 V136 H330 M460 230 V136 H480" class="sw"/><text x="300" y="248" class="sl">clkB</text>`;
    b += `<text x="20" y="275" class="sn">Single-bit level crossing; pulses need sufficient width or a handshake.</text>`;
    b += `<text x="20" y="293" class="sn">Time the interstage path. Gray buses also need protocol and skew constraints.</text>`;
    b += `<text x="20" y="311" class="sn">No combinational logic between stages; keep their route short. Risk is nonzero.</text>`;
    return S(640, 330, b, 'Two flip-flop synchronizer');
  };

  P.domino = () => {
    let b = `<text x="20" y="24" class="sh">Footed domino AND2 (precharge low phase, evaluate high phase)</text>`;
    b += `<path d="M150 50 V70" class="sw"/><text x="138" y="46" class="sl">VDD</text>`;
    b += `<rect x="130" y="70" width="40" height="30" class="sbox"/><text x="176" y="90" class="sl">P1 (clk)</text>`;
    b += `<path d="M150 100 V130 H260" class="sw"/><circle cx="150" cy="130" r="3" class="sdot"/><text x="160" y="124" class="sl">X (dynamic node)</text>`;
    b += `<path d="M150 130 V150" class="sw"/><rect x="130" y="150" width="40" height="30" class="sbox"/><text x="176" y="170" class="sl">A</text>`;
    b += `<path d="M150 180 V196" class="sw"/><rect x="130" y="196" width="40" height="30" class="sbox"/><text x="176" y="216" class="sl">B</text>`;
    b += `<path d="M150 226 V242" class="sw"/><rect x="130" y="242" width="40" height="30" class="sbox"/><text x="176" y="262" class="sl">N foot (clk)</text>`;
    b += `<path d="M150 272 V292" class="sw"/><text x="138" y="306" class="sl">GND</text>`;
    b += `<path d="M260 115 L300 130 L260 145 Z" class="sbox"/><circle cx="304" cy="130" r="4" class="sbox"/><path d="M308 130 H380" class="sw"/><text x="352" y="122" class="sl">Y</text>`;
    b += `<path d="M150 50 H240 V60 M240 82 V112 H150 M260 71 H330 V130" class="sw"/><circle cx="150" cy="112" r="3" class="sdot"/><rect x="220" y="60" width="40" height="22" class="sbox"/><text x="258" y="52" class="sl">weak PMOS keeper</text>`;
    b += `<text x="420" y="80" class="sn">Rules</text><text x="420" y="100" class="sn">1. inputs may only rise during evaluate</text><text x="420" y="118" class="sn">2. keeper fights leakage and noise,</text><text x="420" y="134" class="sn">   but must lose to the pull-down</text><text x="420" y="152" class="sn">3. charge sharing with internal nodes</text><text x="420" y="168" class="sn">   droops X: precharge them too</text><text x="420" y="186" class="sn">4. output inverter makes Y monotonic</text>`;
    return S(700, 320, b, 'Footed domino gate with keeper');
  };

  P.prefix = (kind = 'ks') => {
    const n = 16, colW = 36, rowH = 34, x0 = 30, y0 = 40;
    const levels = Math.log2(n);
    let b = `<text x="${x0}" y="22" class="sh">${kind === 'ks' ? 'Kogge-Stone: 16 bits, 4 combine levels' : 'Brent-Kung: 16 bits, 7 combine levels'}</text>`;
    for (let i = 0; i < n; i++) b += `<text x="${x0 + (n - 1 - i) * colW + 10}" y="${y0}" class="sl" text-anchor="middle">${i}</text>`;
    const node = (i, lvl, black) => `<circle cx="${x0 + (n - 1 - i) * colW + 10}" cy="${y0 + 16 + lvl * rowH}" r="6" class="${black ? 'snode' : 'sopen'}"/>`;
    const wire = (i, j, lvl) => `<path d="M${x0 + (n - 1 - j) * colW + 10} ${y0 + 16 + (lvl - 1) * rowH} L${x0 + (n - 1 - i) * colW + 10} ${y0 + 16 + lvl * rowH}" class="sthin"/>`;
    const pass = (lvl) => Array.from({length:n},(_,i)=>wire(i,i,lvl)).join('');
    for (let i = 0; i < n; i++) b += node(i, 0, false);
    let maxL = levels;
    if (kind === 'ks') {
      for (let l = 1; l <= levels; l++) { const d = 2 ** (l - 1); b += pass(l); for (let i = 0; i < n; i++) { if (i >= d) b += wire(i, i - d, l) + node(i, l, true); else b += node(i, l, false); } }
    } else {
      let l = 0;
      for (let d = 1; d < n; d *= 2) { l++; b += pass(l); for (let i = 0; i < n; i++) { if ((i + 1) % (2 * d) === 0) b += wire(i, i - d, l) + node(i, l, true); else b += node(i,l,false); } }
      for (let d = n / 4; d >= 1; d /= 2) { l++; b += pass(l); for (let i = 0; i < n; i++) { if ((i + 1) % (2 * d) === d && i >= 2 * d) b += wire(i, i - d, l) + node(i, l, true); else b += node(i,l,false); } }
      maxL = l;
    }
    const h = y0 + 30 + maxL * rowH;
    return S(x0 * 2 + n * colW, h, b, kind === 'ks' ? 'Kogge-Stone prefix network' : 'Brent-Kung prefix network');
  };
  P.bk = () => P.prefix('bk');
  P.ks = () => P.prefix('ks');

  P.diffpair = () => {
    let b = `<text x="20" y="24" class="sh">NMOS differential pair with PMOS mirror load (5T OTA)</text>`;
    b += `<path d="M110 50 H330" class="sw"/><text x="200" y="44" class="sl">VDD</text>`;
    b += `<rect x="90" y="60" width="40" height="34" class="sbox"/><rect x="290" y="60" width="40" height="34" class="sbox"/><text x="60" y="82" class="sl">M3</text><text x="338" y="82" class="sl">M4</text>`;
    b += `<path d="M110 50 V60 M310 50 V60 M110 94 V130 M310 94 V130 M110 112 H160 V77 H130 M160 77 H290" class="sw"/><circle cx="110" cy="112" r="3" class="sdot"/><text x="166" y="72" class="sn">diode-connected M3 sets the mirror</text>`;
    b += `<rect x="90" y="130" width="40" height="34" class="sbox"/><rect x="290" y="130" width="40" height="34" class="sbox"/><text x="60" y="152" class="sl">M1</text><text x="338" y="152" class="sl">M2</text>`;
    b += `<path d="M40 147 H90 M380 147 H330" class="sw"/><text x="20" y="140" class="sl">Vin+</text><text x="384" y="140" class="sl">Vin-</text>`;
    b += `<path d="M310 112 H400" class="sw"/><circle cx="310" cy="112" r="3" class="sdot"/><text x="404" y="116" class="sl">Vout</text>`;
    b += `<path d="M110 164 V190 H310 V164 M210 190 V210" class="sw"/><rect x="190" y="210" width="40" height="34" class="sbox"/><text x="236" y="232" class="sl">M5 tail, ISS</text><path d="M210 244 V262" class="sw"/><text x="200" y="278" class="sl">GND</text>`;
    b += `<path d="M145 227 H190" class="sw"/><text x="110" y="221" class="sl">Vbias</text>`;
    b += `<text x="440" y="160" class="sn">Av ≈ gm1 · (ro2 ∥ ro4)</text><text x="440" y="180" class="sn">gm1 = 2·ID/Vov, ID = ISS/2</text><text x="440" y="200" class="sn">ICMR low: VGS1 + Vdsat5</text><text x="440" y="220" class="sn">ICMR high: VDD - VSG3 + VT1</text>`;
    return S(640, 290, b, 'Five transistor operational transconductance amplifier');
  };

  T.plots = P;
  T.plot = (name) => {
    const fn = P[name];
    if (!fn) return `<p class="faint small">Figure "${T.esc(name)}" is not available.</p>`;
    try { return fn(); } catch (e) { console.error(e); return `<p class="faint small">Figure "${T.esc(name)}" failed to render.</p>`; }
  };
})();
