/* Independent expected topology and truth-table assertions for original SVG
 * generators. These are circuit connectivity checks, not silicon validation. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
function run() {
 const T={esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/schematics.js'),'utf8'),{window:{T}},{filename:'js/schematics.js'});
 const counts={inverter:[2,4],nand:[4,6],nor:[4,6],aoi:[6,8],oai:[6,8],'transmission-gate':[2,6],tristate:[4,8],'pseudo-nmos':[2,4],domino:[7,9],c2mos:[4,8],'tg-latch':[8,8],'master-slave':[16,11],tspc:[11,11],'pulsed-latch':[8,8],'level-shifter':[4,6],sram6t:[6,7],sram8t:[8,10],'sense-amplifier':[9,10],'nor-rom':[6,7],'nand-rom':[8,12],'precharge-equalize':[3,4],mirror:[2,3],'cascode-mirror':[4,5],ota5t:[5,8],opamp2:[8,10],strongarm:[11,10],bandgap:[6,7],'power-header':[3,6],'power-footer':[3,6],decap:[2,3],'rc-pi':[3,3],'common-source':[2,4],'coupled-wire':[2,3],'supply-inductor':[3,3]};
 const expected={
 inverter:[['MP','g','A'],['MP','s','VDD'],['MN','d','Y'],['MN','s','GND']],
 nand:[['P1','d','Y'],['P2','d','Y'],['N1','s','Nx1'],['N2','d','Nx1']],
 nor:[['P1','s','Px1'],['P2','d','Px1'],['N1','d','Y'],['N2','s','GND']],
 aoi:[['PA','s','PU'],['PB','s','PU'],['PC','d','PU'],['NA','s','NX'],['NB','d','NX'],['NC','d','Y']],
 oai:[['PA','s','PX'],['PB','d','PX'],['NA','s','NX'],['NB','s','NX'],['NC','d','NX']],
 'transmission-gate':[['TGN','d','A'],['TGP','d','A'],['TGN','s','Y'],['TGP','s','Y'],['TGN','g','EN'],['TGP','g','ENb']],
 tristate:[['PEN','g','ENb'],['PEN','s','PX'],['PD','d','PX'],['ND','s','NX'],['NEN','d','NX'],['NEN','g','EN']],
 'pseudo-nmos':[['LOAD','g','GND'],['LOAD','d','Y'],['PD','d','Y']],
 domino:[['PRE','g','CLK'],['KEEP','g','Y'],['A','d','X'],['B','s','FX'],['FOOT','d','FX'],['FOOT','g','CLK'],['OUTN','g','X']],
 c2mos:[['PC','g','CLKb'],['NC','g','CLK'],['PC','s','Q'],['NC','d','Q']],
 'tg-latch':[['LINN','d','D'],['LINN','s','LX'],['LIP','g','LX'],['LFN','g','Qb'],['LFBN','d','LZ'],['LFBN','s','LX'],['LFBN','g','CLKb']],
 'master-slave':[['MINN','g','CLKb'],['MFBN','g','CLK'],['SINN','g','CLK'],['SFBN','g','CLKb'],['MINN','s','MX'],['SINN','d','Mb'],['SIN','d','Q']],
 tspc:[['P1','g','CLK'],['P0','g','D'],['N1','g','D'],['N4','g','CLK'],['N5','g','CLK'],['OUTN','g','Qb'],['OUTN','d','Q']],
 'pulsed-latch':[['LINN','g','PULSE'],['LINP','g','PULSEb'],['LFBN','g','PULSEb']],
 'level-shifter':[['P1','g','Qb'],['P2','g','Q'],['P1','b','VDDH'],['P2','b','VDDH'],['N1','g','D'],['N2','g','Db']],
 sram6t:[['LP','g','Qb'],['RP','g','Q'],['LN','d','Q'],['RN','d','Qb'],['AXL','d','BL'],['AXL','s','Q'],['AXR','d','BLb'],['AXR','s','Qb']],
 sram8t:[['RD','g','Q'],['RD','d','RBL'],['RD','s','RX'],['RSEL','d','RX'],['RSEL','g','RWL']],
 'sense-amplifier':[['LP','g','Qb'],['RP','g','Q'],['LN','s','TAIL'],['RN','s','TAIL'],['EN','d','TAIL'],['EN','g','SAEN'],['BLN','d','BL'],['BRN','d','BLb']],
 'nor-rom':[['PRE','d','BL'],['KEEP','g','SENSE'],['CELL0','d','BL'],['CELL2','d','BL'],['SN','g','BL']],
 'nand-rom':[['C0','s','X0'],['C1','d','X0'],['C1','s','X1'],['C2','d','X1'],['C2','s','FOOT'],['SEL','d','FOOT']],
 'precharge-equalize':[['PBL','d','BL'],['PBR','d','BLb'],['EQ','d','BL'],['EQ','s','BLb'],['EQ','g','PREb']],
 mirror:[['REF','d','BIAS'],['REF','g','BIAS'],['OUT','g','BIAS']],
 'cascode-mirror':[['REFC','s','BIAS'],['REF','g','BIAS'],['OUTC','g','REF'],['OUTC','s','XO'],['OUT','d','XO']],
 ota5t:[['LOAD1','d','X'],['LOAD1','g','X'],['LOAD2','g','X'],['INP','s','TAIL'],['INN','s','TAIL'],['TAIL','d','TAIL']],
 opamp2:[['CC','a','V1'],['CC','b','OUT'],['N2','g','V1'],['I1','s','TAIL'],['I2','s','TAIL'],['I1','g','VINn'],['I2','g','VINp']],
 strongarm:[['NL','g','Qb'],['NR','g','Q'],['IP','d','XL'],['IN','d','XR'],['T','d','TAIL'],['T','g','CLK'],['PX','d','XL'],['PY','d','XR']],
 bandgap:[['Q1','base','VREF'],['Q2','base','VREF'],['RPTAT','a','E2'],['RPTAT','b','E1'],['RSUM','a','E1'],['RSUM','b','GND'],['P1','g','BIAS'],['P2','g','BIAS']],
 'power-header':[['HEADER','s','VDD'],['HEADER','d','VVDD'],['HEADER','b','VDD'],['LOADP','s','VVDD'],['LOADP','b','VVDD']],
 'power-footer':[['FOOT','d','VGND'],['FOOT','s','GND'],['LOADN','s','VGND'],['LOADN','b','VGND']],
 decap:[['ESR','a','VDD'],['ESR','b','VC'],['C','a','VC'],['C','b','GND']],
 'rc-pi':[['CIN','a','IN'],['R','a','IN'],['R','b','OUT'],['COUT','a','OUT'],['CIN','b','GND'],['COUT','b','GND']],
 'common-source':[['RD','a','VDD'],['RD','b','Y'],['M1','d','Y'],['M1','g','VIN'],['M1','s','GND']],
 'coupled-wire':[['CC','a','A'],['CC','b','Y'],['CG','a','Y'],['CG','b','GND']],
 'supply-inductor':[['L','a','VDD'],['L','b','Y'],['C','a','Y'],['ILOAD','a','Y'],['C','b','GND'],['ILOAD','b','GND']]
 };
 const blockExpected={icg:[7,7,['LATCH','AND']], 'rtl-gds':[9,9,['EXTRACT','STA']], 'async-fifo':[9,6,['WGRAY','WSYNC']],synchronizer:[6,6,['FF1','FF2']],handshake:[9,10,['ACKSYNC','ACKRX']],pipeline:[6,7,['COMB2','FF2']],booth:[6,5,['CSA2','CPA']],'barrel-shifter':[6,7,['MUX2','MUX4']],'memory-array':[9,8,['COLMUX','SENSE']],serdes:[9,9,['RX','CDR']],pll:[7,7,['DIVIDER','PFD']],'sta-graph':[6,5,['GATE2','END']],'block-diagram':[3,2,['LOGIC','OUT']],'logic-chain':[6,5,['G3','G4']],'register-swap':[6,6,['Q2','D1']],'compressor-tree':[6,5,['ROWS3','ROWS2']],'ntt-butterfly':[8,8,['MUL','SUB']]};
 const layoutExpected={'stick-nand':[6,4], 'cell-layout':[4,2],'standard-cell':[7,0],floorplan:[5,0],'power-grid':[4,0],'cts-tree':[9,8],antenna:[4,3],latchup:[6,2]};
 const waveCounts={'timing-setup-hold':3,'timing-metastability':4,'timing-handshake':3,'timing-fifo':4,'timing-scan':4,'timing-domino':5,'timing-sram-read':5,'timing-sram-write':5,'timing-gating':4,'timing-borrowing':4};
 let terminals=0;
 for(const [id,fn] of Object.entries(T.schematics)) {
  const svg=T.schematic(id),t=T.schematicTopology(id);
  assert.match(svg,/<svg[^>]*role="img"[^>]*aria-label="[^"]+"/,id);
  assert.ok(!/NaN|Infinity|undefined|#[a-f\d]{3,8}\b|(?:stroke|fill)="/.test(svg),id+' invalid or non-token SVG');
  assert.equal(new Set(t.nodes).size,t.nodes.length,id+' repeated nodes');
  if(t.kind==='circuit') {
   assert.ok(counts[id]&&expected[id],id+' must have independent expectations');
   assert.equal(t.devices.length,counts[id][0],id+' device count');assert.equal(t.nodes.length,counts[id][1],id+' net count');
   assert.equal(new Set(t.devices.map(d=>d.id)).size,t.devices.length,id+' duplicate device ID');
   for(const d of t.devices)for(const port of ['n','p'].includes(d.type)?['d','g','s','b']:d.type==='bjt'?['c','base','e']:['a','b'])assert.ok(t.nodes.includes(d[port]),id+' dangling '+d.id+'.'+port);
   for(const [device,port,net] of expected[id])assert.equal(t.devices.find(d=>d.id===device)?.[port],net,id+' '+device+'.'+port);
   for(const net of (svg.matchAll(/data-net="([^"]+)"/g)))assert.ok(t.nodes.includes(net[1]),id+' drawn wire on unknown net '+net[1]);
   terminals+=t.edges.length;
  } else if(t.kind==='blocks') {
   const exp=blockExpected[id];assert.ok(exp,id+' block lacks expectations');assert.equal(t.nodes.length,exp[0],id);assert.equal(t.edges.length,exp[1],id);
   assert.ok(t.edges.some(e=>e[0]===exp[2][0]&&e[1]===exp[2][1]),id+' critical edge missing');
   t.edges.forEach(([a,b])=>{assert.ok(t.nodes.includes(a)&&t.nodes.includes(b),id+' dangling edge');assert.ok(svg.includes('data-edge="'+a+'&gt;'+b+'"'),id+' edge not drawn');});
   // An independent geometry pass checks every edge segment against all unrelated
   // block rectangles. This catches a router that sends a labelled edge through a box.
   const rects={};
   for(const r of svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*data-block="([^"]+)"/g))rects[r[5]]={x:+r[1],y:+r[2],w:+r[3],h:+r[4]};
   assert.equal(Object.keys(rects).length,t.nodes.length,id+' every block needs rendered bounds');
   for(const match of svg.matchAll(/<path d="([^"]+)"[^>]*data-edge="([^&]+)&gt;([^"]+)"/g)) {
    const [,d,a,b]=match,points=d.replace(/^M/,'').split(' L').map(p=>p.split(',').map(Number));
    assert.ok(points.length<=8,id+' '+a+'>'+b+' has excessive bends; routes must not become staircases');
    for(let i=1;i<points.length;i++)for(const [node,r] of Object.entries(rects))if(node!==a&&node!==b){const [x1,y1]=points[i-1],[x2,y2]=points[i],hit=x1===x2?x1>r.x&&x1<r.x+r.w&&Math.max(y1,y2)>r.y&&Math.min(y1,y2)<r.y+r.h:y1>r.y&&y1<r.y+r.h&&Math.max(x1,x2)>r.x&&Math.min(x1,x2)<r.x+r.w;assert.ok(!hit,id+' '+a+'>'+b+' crosses '+node);}
   }
  } else if(t.kind==='layout') {
   const exp=layoutExpected[id];assert.ok(exp,id+' layout lacks expectations');assert.equal(t.nodes.length,exp[0],id);assert.equal(t.edges.length,exp[1],id);assert.equal(t.layers.length,6,id+' layer legend');
   assert.match(svg,/sg-layer-well/);assert.match(svg,/sg-layer-contact/);
   if(id==='cts-tree')assert.equal((svg.match(/class="sg-dot"/g)||[]).length,8);
  } else {
   assert.equal(t.nodes.length,waveCounts[id],id+' signal count');t.nodes.forEach(node=>assert.ok(svg.includes('>'+node+'</text>'),id+' missing signal label'));
  }
 }
 function reach(t,values,from,to) {
  const edges=t.devices.filter(d=>['n','p'].includes(d.type)&&d.g in values&&(d.type==='n'?!!values[d.g]:!values[d.g])).map(d=>[d.d,d.s]);
  const seen=new Set([from]);for(let change=true;change;){change=false;for(const [a,b] of edges){if(seen.has(a)&&!seen.has(b)){seen.add(b);change=true;}if(seen.has(b)&&!seen.has(a)){seen.add(a);change=true;}}}return seen.has(to);
 }
 for(const id of ['inverter','nand','nor','aoi','oai'])for(let mask=0;mask<8;mask++) {
  const v={A:mask&1,B:(mask>>1)&1,C:(mask>>2)&1},t=T.schematicTopology(id),expectedY=id==='inverter'?!v.A:id==='nand'?!(v.A&&v.B):id==='nor'?!(v.A||v.B):id==='aoi'?!((v.A&&v.B)||v.C):!((v.A||v.B)&&v.C);
  assert.equal(reach(t,v,'Y','VDD'),!!expectedY,id+' pull-up truth '+mask);assert.equal(reach(t,v,'Y','GND'),!expectedY,id+' pull-down truth '+mask);assert.equal(reach(t,v,'VDD','GND'),false,id+' rail short '+mask);
 }
 for(const k of [3,4])for(const id of ['nand','nor']) {
  const t=T.schematicTopology(id,{fanin:k});assert.equal(t.devices.length,2*k);
  for(let mask=0;mask<2**k;mask++){const v=Object.fromEntries(Array.from({length:k},(_,i)=>[String.fromCharCode(65+i),(mask>>i)&1]));const low=id==='nand'?mask===2**k-1:mask!==0;assert.equal(reach(t,v,'Y','GND'),low,id+k+' PDN '+mask);assert.equal(reach(t,v,'Y','VDD'),!low,id+k+' PUN '+mask);}
 }
 for(const en of [0,1])assert.equal(reach(T.schematicTopology('transmission-gate'),{EN:en,ENb:1-en},'A','Y'),!!en);
 for(const en of [0,1])for(const A of [0,1]){const t=T.schematicTopology('tristate'),v={EN:en,ENb:1-en,A};assert.equal(reach(t,v,'Y','GND'),!!(en&&A));assert.equal(reach(t,v,'Y','VDD'),!!(en&&!A));}
 const custom=T.schematic('block-diagram',{nodes:['A','B'],edges:[['A','B']],labels:{A:'First',B:'Second'}});assert.match(custom,/data-edge="A&gt;B"/);
 // Physical routing checks prevent a logical netlist from hiding a misdrawn wire.
 // In the latch the lower inverter faces left. Qb ends on its right-hand input;
 // Z begins beyond its left bubble and returns to the feedback TG.
 for(const [id,offsets] of [['tg-latch',[155]],['master-slave',[10,325]]])for(const x of offsets) {
  const svg=T.schematic(id),input=`M${x+250},145 L${x+285},145 L${x+285},275 L${x+260},275`,output=`M${x+220},275 L${x+185},275 L${x+185},345 L${x+105},345 L${x+105},275`;
  assert.ok(svg.includes(input),id+' feedback inverter input route');assert.ok(svg.includes(output),id+' feedback inverter output route');
  assert.ok(!svg.includes(`L${x+285},275 L${x+220},275`),id+' inverter must not be shorted by wire');
 }
 assert.ok(T.schematic('sram6t').includes('M170,195 L200,195 L200,45 L350,45 L350,195 L370,195'),'SRAM Q feedback must route around PMOS source/drain, not along its channel');
 assert.ok(T.schematic('sram6t').includes('M450,195 L470,195 L470,375 L50,375 L50,225 L90,225'),'SRAM Qb feedback stays below BL access wire at y=195');
 assert.ok(!T.schematic('sram6t').includes('L50,195 L90,195'),'Qb feedback may not overlap the BL net');
 // The final column's passive labels must fit the 640-unit viewBox. Estimate
 // text at a conservative 8 units per character and account for SVG anchoring.
 const rcLabels=[...T.schematic('rc-pi').matchAll(/<text x="([\d.]+)" y="([\d.]+)" class="sg-note" text-anchor="([^"]+)">(Cwire \/ 2|Rwire)<\/text>/g)];
 assert.equal(rcLabels.length,3,'RC pi model must label both shunt capacitances and the series resistance');
 for(const [,x,y,anchor,label] of rcLabels){const width=label.length*8,right=Number(x)+(anchor==='end'?0:anchor==='middle'?width/2:width),left=Number(x)-(anchor==='end'?width:anchor==='middle'?width/2:0);assert.ok(left>=0&&right<=640,'Passive value '+label+' must remain inside the viewBox');}
 assert.ok(rcLabels.some(([,x,y,anchor])=>Number(x)>500&&anchor==='end'),'Rightmost RC capacitor label must face inward');
 const meta=T.schematicModel('timing-metastability').spec;
 const handshakeSvg=T.schematic('handshake');
 for(const label of ['SOURCE','DATA','DEST','REQ','ACK'])assert.equal((handshakeSvg.match(new RegExp('>'+label+'</text>','g'))||[]).length,1,'Handshake '+label+' label must appear once');
 const handshakeWave=T.schematic('timing-handshake');
 assert.match(handshakeWave,/<text[^>]*y="40"[^>]*>hold payload stable<\/text>/,'Hold-window caption must sit above the DATA trace');
 assert.ok(!handshakeWave.includes('>2.4</text>'),'Handshake cycle ticks must be integer events');
 assert.ok(meta.signals[0].points.some(([time,value])=>time===7&&value===1),'Second synchronizer capture must have a rising edge at 7 ns');
 assert.throws(()=>T.schematic('block-diagram',{nodes:['A'],edges:[['A','MISSING']]}),/Unknown block endpoint/);
 assert.throws(()=>T.schematic('block-diagram',{nodes:['A','A'],edges:[]}),/Duplicate block node/);
 assert.equal(T.schematicTopology('logic-chain',{stages:6}).nodes.length,8);
 // The reported defect involved unrelated arrows merging/crossing, not a box
 // collision. Validate the actual drawn segments and distinct terminal ports.
 for(const id of ['rtl-gds','barrel-shifter','booth','compressor-tree']) {
  const svg=T.schematic(id),edges=[...svg.matchAll(/<path d="([^"]+)"[^>]*data-edge="([^"]+)"/g)].map(m=>({name:m[2],pts:m[1].slice(1).split(' L').map(p=>p.split(',').map(Number))}));
  const ports=new Set();
  for(const edge of edges)for(const p of [edge.pts[0],edge.pts.at(-1)]){const key=p.join(',');assert(!ports.has(key),id+' arrows merge at port '+key);ports.add(key);}
  for(let a=0;a<edges.length;a++)for(let b=a+1;b<edges.length;b++)for(let i=1;i<edges[a].pts.length;i++)for(let j=1;j<edges[b].pts.length;j++){
   const [p,q]=[edges[a].pts[i-1],edges[a].pts[i]], [r,s]=[edges[b].pts[j-1],edges[b].pts[j]];
   const av=p[0]===q[0],bv=r[0]===s[0],between=(x,u,v)=>x>=Math.min(u,v)&&x<=Math.max(u,v);
   const hit=av===bv?(av?p[0]===r[0]&&Math.max(Math.min(p[1],q[1]),Math.min(r[1],s[1]))<=Math.min(Math.max(p[1],q[1]),Math.max(r[1],s[1])):p[1]===r[1]&&Math.max(Math.min(p[0],q[0]),Math.min(r[0],s[0]))<=Math.min(Math.max(p[0],q[0]),Math.max(r[0],s[0]))):av?between(p[0],r[0],s[0])&&between(r[1],p[1],q[1]):between(r[0],p[0],q[0])&&between(p[1],r[1],s[1]);
   assert(!hit,id+' ambiguous crossing/overlap: '+edges[a].name+' / '+edges[b].name);
  }
 }
 const flowSvg=T.schematic('rtl-gds');
 for(const name of ['NETLIST&gt;STA','EXTRACT&gt;STA'])assert(flowSvg.includes('data-edge="'+name+'" data-edge-role="check"'),'STA must be a separate check path');
 const w=T.waveform({duration:10,signals:[{name:'D',points:[[0,0],[2,1],[5,'x'],[7,'z']]}],arrows:[{from:2,to:4,y:0,label:'2 ns'}],annotations:[{time:10,signal:0,label:'source sees completion'}]});assert.match(w,/>X</);assert.match(w,/>Z</);assert.match(w,/>2 ns</);assert.ok(!w.includes('x="620" y="50"'));
 const result={pass:true,generators:Object.keys(T.schematics).length,circuits:Object.keys(counts).length,blocks:Object.keys(blockExpected).length,layouts:Object.keys(layoutExpected).length,timing:Object.keys(waveCounts).length,terminalChecks:terminals,checks:'independent net/device counts, critical terminal connections, drawn edge coverage, CMOS truth tables through fan-in 4, no rail shorts, TG and tristate controls, custom-block validation'};
 return result;
}
module.exports=run;if(require.main===module)console.log(JSON.stringify(run()));
