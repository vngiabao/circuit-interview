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
 const viewBox=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
 for(const tick of svg.matchAll(/<text x="([\d.e+-]+)" y="([\d.e+-]+)" class="pt"/g)){
  assert.ok(+tick[1]>=0&&+tick[1]<=+viewBox[1]&&+tick[2]>=0&&+tick[2]<=+viewBox[2],name+' axis tick escaped SVG bounds');
 }
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
// Expanded models: check physical limits, conservation, numerical geometry, and units.
const expandedIds=['id-vgs','id-vds','vtc-noise','butterfly-snm','gm-id','bode-margin','step-ringing','fo4-vdd','leakage-vt-temp','crosstalk-glitch','ir-heatstrip','em-lifetime','mc-histogram','sigma-yield','liberty-surface','elmore-response','shmoo','dvfs-power'];
for(const id of expandedIds){
 assert.ok(T.plotInfo[id]?.caption,id+' needs interpretation metadata');
 for(const solution of [false,true]){
  const html=T.plot(id,{solution});assert.match(html,/Computed teaching model/);assert.match(html,/aria-label="[^"]+"/);assert.match(html,/<desc>/);
  assert.ok(!/NaN|Infinity|undefined|#[0-9a-f]{6}\b/i.test(html),id);
  for(const p of html.matchAll(/<path\b[^>]*>/g))assert.match(p[0],/fill="none"/,id+' paths must not inherit SVG black fill');
 }
}
assert.match(T.plot('prefix'),/Kogge-Stone/,'Adding plot options must not change legacy prefix default');
near(m.mosCurrent(.2,1,.3,200e-6,.08),0);
near(m.mosCurrent(.9,0,.3,200e-6,.08),0);
// Across the triode/saturation knee, both current and its first derivative are continuous.
const knee=.4,eps=1e-7;
near(m.mosCurrent(.7,knee-eps,.3,200e-6,.08),m.mosCurrent(.7,knee+eps,.3,200e-6,.08),1e-10);
for(let i=0;i<=100;i++){
 const vin=i/100,vout=m.inverter(vin);
 near(m.mosCurrent(vin,vout,.3,200e-6,.08),m.mosCurrent(1-vin,1-vout,.3,200e-6,.08),1e-12);
 near(vout+m.inverter(1-vin),1,1e-10);
 assert.ok(vout>=0&&vout<=1);
}
const nm=m.noiseMargins();near(nm.nml,nm.nmh,1e-10);assert.ok(nm.nml>.39&&nm.nml<.4);
for(const x of [nm.vil,nm.vih])near((m.inverter(x+1e-5)-m.inverter(x-1e-5))/2e-5,-1,1e-6);
const snm=m.snm();assert.ok(snm.side>.39&&snm.side<.4);
// The lower left corner lies on the mirrored VTC, upper right on the normal VTC.
near(m.inverter(snm.y),snm.x,1e-9);near(m.inverter(snm.x+snm.side),snm.y+snm.side,1e-9);
for(let i=0;i<=20;i++){
 const x=snm.x+snm.side*i/20;
 assert.ok(m.inverter(x)>=snm.y+snm.side-1e-8,'Square must stay below upper VTC');
}
const squareRects=[...T.plot('butterfly-snm').matchAll(/<rect[^>]+width="([\d.]+)" height="([\d.]+)" class="pfill-a"/g)];
assert.equal(squareRects.length,1);near(+squareRects[0][1],+squareRects[0][2],1e-8,'SNM must have equal visual axis scale');
near(m.gmId(1e-16),1/(1.4*.02585),1e-6);
assert.ok(m.gmId(.01)>m.gmId(1)&&m.gmId(1)>m.gmId(100));
// The unity frequency is independently solved from the quadratic in f^2.
const f1=1e3,f2=1e7,A=1e4;
const fUnity=Math.sqrt((-(f1*f1+f2*f2)+Math.sqrt((f1*f1+f2*f2)**2+4*f1*f1*f2*f2*(A*A-1)))/2);
near(m.loop(fUnity).gain,1,1e-8);const phaseMargin=180+m.loop(fUnity).phase;
assert.ok(phaseMargin>51&&phaseMargin<53);
for(const z of [.2,.7]){
 near(m.step(0,z),0);near(m.step(1e-6,z),1,1e-8);
 near(m.step(1/(2e8*Math.sqrt(1-z*z)),z)-1,Math.exp(-Math.PI*z/Math.sqrt(1-z*z)),1e-12);
}
near(m.fo4(1)*1e12,30);assert.ok(m.fo4(.4)>m.fo4(.6)&&m.fo4(.6)>m.fo4(1));assert.ok(m.fo4(.4)*1e12<170);
near(m.leakage(.3,25),1);assert.ok(m.leakage(.3,125)>m.leakage(.3,85));assert.ok(m.leakage(.4,25)<m.leakage(.3,25));
assert.ok(m.leakage(.2,125)<200&&m.leakage(.5,25)>.001,'Leakage axes contain every curve');
near(m.crosstalk(0),0);near(m.crosstalk(50e-12-1e-19),m.crosstalk(50e-12+1e-19),1e-8);
assert.ok(m.crosstalk(50e-12,20e-12)<m.crosstalk(50e-12,100e-12));
assert.ok(m.crosstalk(50e-12,100e-12)<.2);near(m.crosstalk(50e-12,1),.2,1e-10);
const rail=m.rail();near(rail[10].one,.9945);near(rail[5].two,.99875);
for(let i=1;i<10;i++){
 // KCL at each interior load tap: incoming minus outgoing current = 1 mA.
 for(const mode of ['one','two'])near((rail[i-1][mode]-2*rail[i][mode]+rail[i+1][mode])/.1,.001,1e-12);
 near(rail[i].two,rail[10-i].two);
}
near((rail[9].one-rail[10].one)/.1,.001);
near(m.em(1),1);near(m.em(2),.25);assert.ok(m.em(1,125)<m.em(1,85));
const samples=m.gaussianSamples(),samplesAgain=m.gaussianSamples();assert.deepEqual(samples,samplesAgain);
const mu=samples.reduce((a,b)=>a+b,0)/samples.length,sd=Math.sqrt(samples.reduce((a,b)=>a+(b-mu)**2,0)/(samples.length-1));
assert.ok(Math.abs(mu)<.002&&sd>.014&&sd<.016);assert.ok(samples.every(x=>Math.abs(x)<.06),'Histogram must show all seeded samples');
assert.ok(m.arrayYield(5,1024)>m.arrayYield(5,1048576));assert.ok(m.arrayYield(6)>m.arrayYield(5));near(m.arrayYield(5),.7403916,1e-6);
// Bilinear interpolation agrees with the specified synthetic table at an interior point.
const bilinear=(m.liberty(60,8)+m.liberty(80,8)+m.liberty(60,12)+m.liberty(80,12))/4;
near(bilinear,m.liberty(70,10));near(bilinear,18.76);
near(m.ladder(0).near,0);near(m.ladder(0).far,0);near(m.ladder(1e-8).far,1);
let moment=0,previous=0;const dt=.01e-12;
for(let i=0;i<=50000;i++){
 const a=m.ladder(i*dt);assert.ok(a.near>=a.far-1e-12&&a.far>=previous-1e-12);previous=a.far;
 moment+=(1-a.far)*dt*(i===0||i===50000?.5:1);
}
near(moment,30e-12,1e-17,'Area of step error equals Elmore first moment');
near(m.fmax(1)/1e9,5/3);assert.ok(m.fmax(.6)<m.fmax(1));
near(m.dvfs(1).fixed,.1);near(m.dvfs(1).scaled,.0525625);near(m.dvfs(2).fixed,m.dvfs(2).scaled);
console.log(JSON.stringify({pass:true,figures,expanded:expandedIds.length,lessons:T.units.length,questions:T.bank.length,subthresholdSwing_mV:measuredSwing*1000,energyMinimum:minimum,snm_V:snm.side,phaseMargin_deg:phaseMargin,mcSampleSigma_mV:sd*1000,checks:'KCL, transfer symmetry, noise square geometry, pole response, coupling limits, rail KCL, seeded histogram, yield, table interpolation, Elmore moment, existing timing and topology'}));
// The structural library maintains its own topology checks. Run it as part of the required gate.
const schematicQA=path.join(__dirname,'qa-schematics.cjs');
assert.ok(fs.existsSync(schematicQA),'The combined technical gate requires scripts/qa-schematics.cjs');
console.log(JSON.stringify(require(schematicQA)()));
