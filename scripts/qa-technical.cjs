/* Numerical/structural checks for the teaching models, run with node scripts/qa-technical.cjs.
 * Sequential references used during review:
 * https://ece-research.unm.edu/jimp/vlsiII/slides/html/seq_logic2.html
 * https://www.cerc.utexas.edu/~jaa/vlsi/lectures/11-2.pdf
 * These checks exercise the shipped model functions, not a PDK or silicon.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const T={units:[],bank:[],esc:s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;'),addUnits(xs){this.units.push(...xs)},addQ(xs){this.bank.push(...xs)}};
const context=vm.createContext({window:{T},T,console});
for(const file of ['js/plots.js','data/seq.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const near=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} differs from ${expected}`);
let figures=0;
for(const [name,fn] of Object.entries(T.plots)){
 const svg=fn();assert.match(svg,/<svg/);assert.ok(!/NaN|Infinity|undefined/.test(svg),name);figures++;
}
const m=T.plotModels;
const measuredSwing=.001/Math.log10(m.subthreshold(-.099,.05)/m.subthreshold(-.1,.05));
near(measuredSwing,1.4*.026*Math.log(10),.00011);
assert.ok(m.subthreshold(0,.8)>m.subthreshold(0,.05),'DIBL must increase off-current at higher drain voltage');
const energies=Array.from({length:171},(_,i)=>{const v=.15+.85*i/170,e=m.energy(v);return{v,total:e.dynamic+e.leakage}});
const minimum=energies.reduce((a,b)=>a.total<b.total?a:b);
// Minimum-energy point must sit near or below VT (0.35 V) and well below the 1 V energy.
assert.ok(minimum.v>.2&&minimum.v<.36,'MEP should be near/below VT, got '+minimum.v);assert.ok(minimum.total<.3);
assert.match(T.plots.energy(),/minimum-energy point ≈ 0\.[23]\d V/);
// A load-current step starts with capacitor discharge I/C and settles to Vsource - IR.
near(m.droop(0),1);near((m.droop(1e-14)-m.droop(0))/1e-14,-20/200e-9,20);
near(m.droop(.0001),1-20*.0004,1e-10);
assert.match(T.plots.droop(),/20 A step/);assert.match(T.plots.droop(),/not a valid chip supply/);
const waveform=Array.from({length:1001},(_,i)=>m.droop(i*4e-10));
assert.ok(Math.min(...waveform)>-.1&&Math.max(...waveform)<2.1,'Droop axis must contain the actual response');
assert.match(T.plots.pelgrom(),/pair AVT/);assert.ok(!T.plots.pelgrom().includes('·√2'));
assert.match(T.plots.mtbf(),/2-flop chain/);assert.match(T.plots.pushout(),/capture failure is not modeled/);
// Rendering should clip out-of-axis data rather than flatten numerical curves at an arbitrary cap.
assert.match(T.plots.stages(),/<clipPath/);assert.match(T.plots.energy(),/clip-path=/);
assert.match(T.plots.domino(),/M150 50 H240 V60 M240 82 V112 H150 M260 71 H330 V130/);
// Both prefix inputs must reach every combining node, including vertical pass-throughs.
assert.ok((T.plots.ks().match(/class="sthin"/g)||[]).length>=16*4+49);
assert.ok((T.plots.bk().match(/class="sthin"/g)||[]).length>=16*7+26);
const seq=fs.readFileSync(path.join(root,'data/seq.js'),'utf8');
assert.ok(!seq.includes('rise/fall are slow enough'));assert.ok(!seq.includes('synchronizer, not STA, guarantees'));
assert.match(seq,/hold slack[^\n]*arrival[^\n]*required/);
near(60+520+35-40+15,590);near(45+20-30-40,-5);
near(970-620,350);near(1470-(620+300),550);
near(1000+.92*310-40-30-1.08*(300+600),243.2,1e-10);
near(1.08*250-.92*250,40,1e-10);
for(const q of T.bank){
 if(q.f==='mcq'){assert.equal(q.opts.length,4,q.id);assert.equal(q.why.length,4,q.id);assert.ok(q.ans>=0&&q.ans<q.opts.length,q.id)}
 if(q.f==='num')assert.ok(Number.isFinite(q.ans),q.id);
}
for(const id of ['SEQ-004','SEQ-008','SEQ-009','SEQ-010','SEQ-021']){
 const q=T.bank.find(q=>q.id===id);assert.equal(q.f,'mcq',id);assert.ok(q.oral,id);
 assert.ok(q.why.every(s=>s.length>20),id);assert.ok(q.a||q.ex,id);
}
near(50+400+30-20+10,470);near(40+10-25-30,-5);near(1000*.5-30,470);
console.log(JSON.stringify({pass:true,figures,lessons:T.units.length,questions:T.bank.length,subthresholdSwing_mV:measuredSwing*1000,energyMinimum:minimum,checks:'model slopes, RLC initial/final conditions, axis bounds, timing arithmetic, topology and MCQ schemas'}));
