/* Original, grid-snapped teaching schematics. Equal net labels mean an electrical
 * connection, exactly as in a labelled-net schematic. No PDK or measured geometry.
 * MOS terminals are D/G/S/B; PMOS bulk defaults to VDD, NMOS bulk to GND.
 * The separate topology API makes the rendered terminal labels independently testable. */
(function () {
  'use strict';
  const T = window.T, R = {}, G = 5;
  const esc = (s) => T.esc(String(s ?? ''));
  const snap = (n) => Math.round(n / G) * G;
  const tx = (x, y, text, cls = 'sg-label', anchor = 'start') => `<text x="${snap(x)}" y="${snap(y)}" class="${cls}" text-anchor="${anchor}">${esc(text)}</text>`;
  const ln = (x1, y1, x2, y2, cls = 'sg-wire', attr = '') => `<line x1="${snap(x1)}" y1="${snap(y1)}" x2="${snap(x2)}" y2="${snap(y2)}" class="${cls}" ${attr}/>`;
  const path = (points, cls = 'sg-wire', attr = '') => `<path d="M${points.map(p => p.map(snap).join(',')).join(' L')}" class="${cls}" ${attr}/>`;
  const dot = (x, y, cls = 'sg-dot') => `<circle cx="${snap(x)}" cy="${snap(y)}" r="3" class="${cls}"/>`;
  const box = (x, y, w, h, cls = 'sg-panel') => `<rect x="${snap(x)}" y="${snap(y)}" width="${snap(w)}" height="${snap(h)}" rx="10" class="${cls}"/>`;
  const words = (text,limit=76) => {
    const lines=[''];String(text || '').split(/\s+/).forEach(word=>{const i=lines.length-1;if(lines[i].length+word.length+1>limit)lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;});return lines;
  };
  let serial = 0;
  const wrap = (body, label, height = 360, width = 640) => `<svg class="plot schematic" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(label)}</title>${body}</svg>`;
  const mos = (id, type, d, g, s, b) => ({id,type,d,g,s,b:b || (type === 'p' ? 'VDD' : 'GND')});
  const n = (id,d,g,s,b) => mos(id,'n',d,g,s,b);
  const p = (id,d,g,s,b) => mos(id,'p',d,g,s,b);
  const passive = (id,type,a,b,value) => ({id,type,a,b,value});
  const inv = (prefix,input,output,vdd='VDD',gnd='GND') => [p(prefix+'P',output,input,vdd,vdd),n(prefix+'N',output,input,gnd,gnd)];
  const tg = (prefix,a,b,en,enb) => [n(prefix+'N',a,en,b),p(prefix+'P',a,enb,b)];
  const chain = (prefix,type,top,gates,bottom) => gates.map((gate,i) => mos(prefix+(i+1),type,i ? prefix+'x'+i : top,gate,i === gates.length-1 ? bottom : prefix+'x'+(i+1)));
  const netsOf = ds => [...new Set(ds.flatMap(d => ['n','p'].includes(d.type) ? [d.d,d.g,d.s,d.b] : d.type === 'bjt' ? [d.c,d.base,d.e] : [d.a,d.b]).filter(Boolean))];
  function circuit(title, devices, stacks, notice, extra = {}) { return {kind:'circuit',title,devices,stacks,notice,...extra}; }
  function topology(model) {
    if (model.kind === 'waveform') return {kind:'waveform',nodes:model.spec.signals.map(s => s.name),devices:[],nets:[],edges:[]};
    if (model.kind !== 'circuit') return {kind:model.kind,nodes:model.nodes || [],devices:[],nets:model.nets || [],edges:model.edges || [],...model.topology};
    const nets = netsOf(model.devices);
    const edges = model.devices.flatMap(d => ['n','p'].includes(d.type) ? ['d','g','s','b'].map(port => ({device:d.id,port,net:d[port]})) : d.type === 'bjt' ? ['c','base','e'].map(port => ({device:d.id,port,net:d[port]})) : ['a','b'].map(port => ({device:d.id,port,net:d[port]})));
    return {kind:'circuit',nodes:nets.slice(),devices:model.devices.map(d=>({...d})),nets:nets.map(id=>({id,terminals:edges.filter(e=>e.net===id).map(e=>e.device+'.'+e.port)})),edges};
  }
  function ground(x,y) { return ln(x,y,x,y+10)+ln(x-15,y+10,x+15,y+10)+ln(x-10,y+15,x+10,y+15)+ln(x-5,y+20,x+5,y+20); }
  function supply(x,y,label) { return ln(x,y,x,y-10)+ln(x-20,y-10,x+20,y-10)+tx(x,y-20,label,'sg-label','middle'); }
  function deviceGlyph(d,x,y,spec) {
    const hot = (net) => (spec.highlight || []).includes(net) ? 'sg-wire sg-highlight' : 'sg-wire';
    let out='';
    const valueLabel=(offset=35)=>tx(x>540?x-25:x+offset,y+40,d.value || d.id,'sg-note',x>540?'end':'start');
    if (['n','p'].includes(d.type)) {
      // D at upper right, S at lower right. Gate is insulated; circle means PMOS.
      out+=path([[x+10,y],[x+10,y+15],[x,y+15],[x,y+55],[x+10,y+55],[x+10,y+70]],'sg-device',`data-device="${esc(d.id)}"`);
      out+=ln(x-10,y+15,x-10,y+55,'sg-device');
      out+=ln(x-50,y+35,x-20,y+35,hot(d.g),`data-net="${esc(d.g)}" data-port="${esc(d.id)}.g"`);
      out+=d.type==='p' ? `<circle cx="${x-15}" cy="${y+35}" r="5" class="sg-device"/>` : ln(x-20,y+35,x-10,y+35,'sg-device');
      out+=tx(x-55,y+30,d.g,'sg-label','end')+tx(x+25,y+40,d.id,'sg-note');
      // Source/drain are asymmetric only through the explicitly declared body tie.
      if (spec.bulk) out+=ln(x,y+35,x+20,y+35,'sg-wire')+tx(x+25,y+25,d.b,'sg-note');
    } else if(d.type==='cap') {
      out+=ln(x+10,y,x+10,y+25)+ln(x-10,y+25,x+30,y+25,'sg-device')+ln(x-10,y+40,x+30,y+40,'sg-device')+ln(x+10,y+40,x+10,y+70);
      out+=valueLabel();
    } else if(d.type==='res') {
      out+=path([[x+10,y],[x+10,y+10],[x,y+15],[x+20,y+25],[x,y+35],[x+20,y+45],[x,y+55],[x+10,y+60],[x+10,y+70]],'sg-device');
      out+=valueLabel();
    } else if(d.type==='inductor') {
      out+=ln(x+10,y,x+10,y+10)+`<path d="M${x+10} ${y+10} c-15 0 -15 15 0 15 c-15 0 -15 15 0 15 c-15 0 -15 15 0 15" class="sg-device"/>`+ln(x+10,y+55,x+10,y+70)+valueLabel();
    } else if(d.type==='current') {
      out+=ln(x+10,y,x+10,y+15)+`<circle cx="${x+10}" cy="${y+35}" r="20" class="sg-device"/>`+ln(x+10,y+55,x+10,y+70)+ln(x+10,y+20,x+10,y+50,'sg-device')+path([[x+5,y+40],[x+10,y+50],[x+15,y+40]],'sg-device')+valueLabel(40);
    } else if(d.type==='bjt') {
      out+=ln(x+10,y,x+10,y+15)+ln(x-10,y+20,x-10,y+50,'sg-device')+ln(x-50,y+35,x-10,y+35)+ln(x-10,y+25,x+10,y+15,'sg-device')+ln(x-10,y+45,x+10,y+55,'sg-device')+ln(x+10,y+55,x+10,y+70);
      out+=path([[x+2,y+53],[x+10,y+55],[x+5,y+47]],'sg-device')+tx(x-55,y+30,d.base,'sg-label','end')+tx(x+25,y+40,d.value || d.id,'sg-note');
    }
    return out;
  }
  function renderCircuit(m,spec) {
    const stacks=m.stacks || m.devices.map(d=>[d.id]);
    const cols=Math.min(3,stacks.length), pitch=640/cols;
    let body=tx(20,25,spec.title || m.title,'sg-title'), rowY=65;
    for(let start=0;start<stacks.length;start+=cols) {
      const slice=stacks.slice(start,start+cols), maxCount=Math.max(...slice.map(s=>s.length));
      slice.forEach((ids,j)=>{
        const x=snap(j*pitch+pitch*.6), devices=ids.map(id=>m.devices.find(d=>d.id===id));
        const terminals=devices.map((d,i)=>{
          if(!['n','p'].includes(d.type))return d.type==='bjt'?[d.c,d.e]:[d.a,d.b];
          const prev=devices[i-1];
          const supplyNet=/^VDD/.test(d.d)?d.d:/^VDD/.test(d.s)?d.s:null;
          if(d.type==='p'&&supplyNet)return supplyNet===d.d?[d.d,d.s]:[d.s,d.d];
          if(prev&&prev.type==='p'){
            // Follow a PMOS series stack down from its supply rather than swapping labels.
            if(d.s===prev.d||d.s===prev.s)return[d.s,d.d];
          }
          return[d.d,d.s];
        });
        devices.forEach((d,i)=>{
          const y=rowY+i*100, [top,bottom]=terminals[i];
          const cls=net=>(spec.highlight || []).includes(net)?'sg-wire sg-highlight':'sg-wire';
          body+=deviceGlyph(d,x,y,spec);
          // Every port label is bound to the device terminal in topology().
          if(i===0) body+=ln(x+10,y-10,x+10,y,cls(top),`data-net="${esc(top)}"`)+tx(x+10,y-15,top,'sg-label','middle');
          const next=devices[i+1], nextTop=next&&terminals[i+1][0];
          if(next && nextTop===bottom) body+=ln(x+10,y+70,x+10,y+100,cls(bottom),`data-net="${esc(bottom)}"`)+dot(x+10,y+85)+tx(x+25,y+85,bottom,'sg-note');
          else {
            body+=ln(x+10,y+70,x+10,y+80,cls(bottom),`data-net="${esc(bottom)}"`)+tx(x+10,y+95,bottom,'sg-label','middle');
            if(next) body+=tx(x+10,y+85,nextTop,'sg-note','middle');
          }
        });
      });
      rowY+=maxCount*100+35;
    }
    body+=tx(20,rowY,'Equal net labels connect. Bodies use supply ties unless specified.','sg-note');
    const lines=(spec.annotations || []).map(a=>(a.net ? a.net+': ' : '')+a.label);
    if(m.notice) lines.unshift(m.notice);
    if(m.notice2) lines.push(m.notice2);
    const wrapped=lines.flatMap(line=>words(line));
    wrapped.forEach((line,i)=>body+=tx(20,rowY+25+i*20,line,'sg-note'));
    return wrap(body,spec.title || m.title,rowY+45+wrapped.length*20);
  }
  const add=(id,fn)=>{R[id]=fn;};
  const fanIn=spec=>Math.max(1,Math.floor(Number(spec.fanin)||2));
  const inputNames=k=>Array.from({length:k},(_,i)=>i<26?String.fromCharCode(65+i):'IN'+(i+1));
  add('inverter',()=>circuit('CMOS inverter',inv('M','A','Y'),[['MP','MN']],'A high: NMOS discharges Y. A low: PMOS charges Y.'));
  add('nand',spec=>{
    const k=fanIn(spec), gates=inputNames(k);
    const ds=gates.map((g,i)=>p('P'+(i+1),'Y',g,'VDD')).concat(chain('N','n','Y',gates,'GND'));
    return circuit('NAND'+k+': parallel pull-up, series pull-down',ds,gates.map((_,i)=>['P'+(i+1)]).concat([gates.map((_,i)=>'N'+(i+1))]),'All inputs high are required to discharge Y.');
  });
  add('nor',spec=>{
    const k=fanIn(spec),gates=inputNames(k);
    const ds=chain('P','p','VDD',gates,'Y').concat(gates.map((g,i)=>n('N'+(i+1),'Y',g,'GND')));
    return circuit('NOR'+k+': series pull-up, parallel pull-down',ds,[gates.map((_,i)=>'P'+(i+1))].concat(gates.map((_,i)=>['N'+(i+1)])),'Any high input discharges Y.');
  });
  add('aoi',()=>circuit('AOI21: Y = not (A B + C)',[p('PA','VDD','A','PU'),p('PB','VDD','B','PU'),p('PC','PU','C','Y'),n('NA','Y','A','NX'),n('NB','NX','B','GND'),n('NC','Y','C','GND')],[['PA','PC'],['PB'],['NA','NB'],['NC']],'Pull-down: A and B in series, in parallel with C.'));
  add('oai',()=>circuit('OAI21: Y = not ((A + B) C)',[p('PA','VDD','A','PX'),p('PB','PX','B','Y'),p('PC','VDD','C','Y'),n('NA','Y','A','NX'),n('NB','Y','B','NX'),n('NC','NX','C','GND')],[['PA','PB'],['PC'],['NA','NC'],['NB']],'Pull-down: parallel A/B pair in series with C.'));
  add('transmission-gate',()=>circuit('Transmission gate',tg('TG','A','Y','EN','ENb'),[['TGN'],['TGP']],'EN = 1, ENb = 0: both devices connect A and Y.'));
  add('tristate',()=>circuit('Tristate inverting driver',[p('PEN','VDD','ENb','PX'),p('PD','PX','A','Y'),n('ND','Y','A','NX'),n('NEN','NX','EN','GND')],[['PEN','PD','ND','NEN']],'EN = 0 disconnects both rails. Y is high impedance.'));
  add('pseudo-nmos',()=>circuit('Pseudo-NMOS inverter',[p('LOAD','Y','GND','VDD'),n('PD','Y','A','GND')],[['LOAD'],['PD']],'The always-on weak PMOS competes with the pull-down when A is high.'));
  add('domino',()=>circuit('Footed domino AND with keeper',[p('PRE','X','CLK','VDD'),p('KEEP','X','Y','VDD'),n('A','X','Ain','AX'),n('B','AX','Bin','FX'),n('FOOT','FX','CLK','GND'),...inv('OUT','X','Y')],[['PRE'],['KEEP'],['A','B','FOOT'],['OUTP','OUTN']],'CLK = 0 precharges X. CLK = 1 evaluates; keeper feedback comes from Y.'));
  add('c2mos',()=>circuit('Clocked CMOS inverter',[p('PD','VDD','D','PX'),p('PC','PX','CLKb','Q'),n('NC','Q','CLK','NX'),n('ND','NX','D','GND')],[['PD','PC','NC','ND']],'CLK = 1 enables both rails; CLK = 0 stores dynamic charge on Q.'));
  function latch(prefix,input,output,en,enb) {
    const x=prefix+'X',z=prefix+'Z';
    return [...tg(prefix+'IN',input,x,en,enb),...inv(prefix+'I',x,output),...inv(prefix+'F',output,z),...tg(prefix+'FB',z,x,enb,en)];
  }
  add('tg-latch',()=>{const ds=latch('L','D','Qb','CLK','CLKb');return circuit('Static transmission-gate latch',ds,[['LINN'],['LINP'],['LIP','LIN'],['LFP','LFN'],['LFBN'],['LFBP']],'CLK high: input TG on. CLK low: feedback TG on. Output Qb is inverted.');});
  add('master-slave',()=>{const ds=[...latch('M','D','Mb','CLKb','CLK'),...latch('S','Mb','Q','CLK','CLKb')];return circuit('Positive-edge master-slave TG flop',ds,ds.map(d=>[d.id]),'Master transparent for CLK low; slave transparent for CLK high. Two inversions give Q = D.');});
  add('tspc',()=>circuit('TSPC dynamic positive-edge flip-flop',[
    p('P1','PX','CLK','VDD'),p('P0','X','D','PX'),n('N1','X','D','GND'),
    p('P2','Y','CLK','VDD'),n('N3','Y','X','NY'),n('N4','NY','CLK','GND'),
    p('P3','Qb','Y','VDD'),n('N5','Qb','CLK','NQ'),n('N6','NQ','Y','GND'),...inv('OUT','Qb','Q')
  ],[['P1','P0'],['N1'],['P2'],['N3','N4'],['P3'],['N5','N6'],['OUTP','OUTN']],'11T implementation: X tracks not D while low; Y evaluates high; buffered Q retains between edges.'));
  add('pulsed-latch',()=>{const ds=latch('L','D','Qb','PULSE','PULSEb');return circuit('Pulse-controlled static latch',ds,ds.map(d=>[d.id]),'A short active-high pulse opens the input TG. External pulse generation is not shown.');});
  add('icg',()=>({kind:'blocks',title:'Glitch-free integrated clock gating',nodes:['EN','TEST','OR','LATCH','CLK','AND','GCLK'],edges:[['EN','OR'],['TEST','OR'],['OR','LATCH'],['LATCH','AND'],['CLK','LATCH'],['CLK','AND'],['AND','GCLK']],labels:{OR:'EN or TEST',LATCH:'Latch open CLK = 0',AND:'CLK and latched EN'},notice:'The enable is held stable throughout CLK high. The latch clock is active low.'}));
  add('level-shifter',()=>circuit('DCVS low-to-high level shifter',[p('P1','Q','Qb','VDDH','VDDH'),p('P2','Qb','Q','VDDH','VDDH'),n('N1','Q','D','GND'),n('N2','Qb','Db','GND')],[['P1','N1'],['P2','N2']],'Cross-coupled PMOS restore full VDDH; D/Db are complementary low-domain inputs.'));
  function sram8(eight) {const ds=[...inv('L','Qb','Q'),...inv('R','Q','Qb'),n('AXL','BL','WL','Q'),n('AXR','BLb','WL','Qb')];if(eight)ds.push(n('RD','RBL','Q','RX'),n('RSEL','RX','RWL','GND'));return circuit((eight?'8T':'6T')+' SRAM bitcell',ds,[['LP','LN'],['RP','RN'],['AXL'],['AXR']].concat(eight?[['RD','RSEL']]:[]),eight?'Separate read stack senses Q without connecting a read bitline to the storage node.':'WL connects the cross-coupled storage nodes to differential BL/BLb.');}
  add('sram6t',()=>sram8(false));add('sram8t',()=>sram8(true));
  add('sense-amplifier',()=>circuit('Regenerative voltage-latch sense amplifier',[p('LP','Q','Qb','VDD'),p('RP','Qb','Q','VDD'),n('LN','Q','Qb','TAIL'),n('RN','Qb','Q','TAIL'),n('EN','TAIL','SAEN','GND'),...tg('BL','BL','Q','CONNECT','CONNECTb'),...tg('BR','BLb','Qb','CONNECT','CONNECTb')],[['LP','LN','EN'],['RP','RN'],['BLN'],['BLP'],['BRN'],['BRP']],'CONNECT samples a small differential; SAEN starts regeneration. Isolation avoids driving the array.'));
  add('nor-rom',()=>circuit('NOR ROM bitline',[p('PRE','BL','PREb','VDD'),p('KEEP','BL','SENSE','VDD'),n('CELL0','BL','WL0','GND'),n('CELL2','BL','WL2','GND'),...inv('S','BL','SENSE')],[['PRE'],['KEEP'],['CELL0'],['CELL2'],['SP','SN']],'Present devices discharge on their wordline. WL1 has no programmed device.'));
  add('nand-rom',()=>circuit('NAND ROM series column',[p('PRE','BL','PREb','VDD'),p('KEEP','BL','SENSE','VDD'),n('C0','BL','WL0','X0'),n('C1','X0','WL1','X1'),n('C2','X1','WL2','FOOT'),n('SEL','FOOT','SELECT','GND'),...inv('S','BL','SENSE')],[['PRE'],['KEEP'],['C0','C1','C2','SEL'],['SP','SN']],'The series column conducts only with every active pass gate and SELECT high.'));
  add('precharge-equalize',()=>circuit('Differential bitline precharge and equalization',[p('PBL','BL','PREb','VDD'),p('PBR','BLb','PREb','VDD'),p('EQ','BL','PREb','BLb')],[['PBL'],['PBR'],['EQ']],'PREb low charges both lines and shorts BL to BLb; turn off before access.'));
  add('mirror',()=>circuit('Basic NMOS current mirror',[n('REF','BIAS','BIAS','GND'),n('OUT','IOUT','BIAS','GND')],[['REF'],['OUT']],'The diode-connected REF sets VGS. Matching and saturation are required for current copying.'));
  add('cascode-mirror',()=>circuit('NMOS cascode current mirror',[n('REFC','REF','REF','BIAS'),n('REF','BIAS','BIAS','GND'),n('OUTC','IOUT','REF','XO'),n('OUT','XO','BIAS','GND')],[['REFC','REF'],['OUTC','OUT']],'Extra devices hold the lower drain voltages more constant, at the cost of headroom.'));
  add('ota5t',()=>circuit('Five-transistor single-ended OTA',[p('LOAD1','X','X','VDD'),p('LOAD2','OUT','X','VDD'),n('INP','X','VINp','TAIL'),n('INN','OUT','VINn','TAIL'),n('TAIL','TAIL','VBIAS','GND')],[['LOAD1','INP','TAIL'],['LOAD2','INN']],'NMOS differential pair with PMOS mirror load. VINp high makes OUT rise.'));
  add('opamp2',()=>circuit('Two-stage op-amp with Miller compensation',[p('L1','X','X','VDD'),p('L2','V1','X','VDD'),n('I1','X','VINn','TAIL'),n('I2','V1','VINp','TAIL'),n('T','TAIL','VBIASn','GND'),p('P2','OUT','VBIASp','VDD'),n('N2','OUT','V1','GND'),passive('CC','cap','V1','OUT','Cc')],[['L1','I1','T'],['L2','I2'],['P2','N2'],['CC']],'Cc spans V1 and OUT. The second inversion makes the right pair input noninverting.'));
  add('strongarm',()=>circuit('StrongARM dynamic comparator',[p('PL','Q','Qb','VDD'),p('PR','Qb','Q','VDD'),n('NL','Q','Qb','XL'),n('NR','Qb','Q','XR'),n('IP','XL','VINp','TAIL'),n('IN','XR','VINn','TAIL'),n('T','TAIL','CLK','GND'),p('PQ','Q','CLK','VDD'),p('PQB','Qb','CLK','VDD'),p('PX','XL','CLK','VDD'),p('PY','XR','CLK','VDD')],[['PL','NL','IP','T'],['PR','NR','IN'],['PQ'],['PQB'],['PX'],['PY']],'CLK low precharges Q/Qb and XL/XR. CLK high enables the differential pair and regeneration.'));
  add('bandgap',()=>circuit('Brokaw-style bandgap core',[p('P1','VREF','BIAS','VDD'),p('P2','C2','BIAS','VDD'),{id:'Q1',type:'bjt',c:'VREF',base:'VREF',e:'E1',value:'Q1: area A'},{id:'Q2',type:'bjt',c:'C2',base:'VREF',e:'E2',value:'Q2: area N A'},passive('RPTAT','res','E2','E1','R1'),passive('RSUM','res','E1','GND','R2')],[['P1','Q1','RSUM'],['P2','Q2','RPTAT']],'Feedback forces VREF = C2; equal mirrored currents give I R1 = delta VBE.',{notice2:'Shared R2 carries 2I: VREF = VBE1 + 2 (R2/R1) delta VBE. Feedback/startup not shown.'}));
  add('power-header',()=>circuit('PMOS power-gating header',[p('HEADER','VVDD','SLEEP','VDD'),...inv('LOAD','A','Y','VVDD')],[['HEADER'],['LOADP','LOADN']],'SLEEP high opens the header. Body remains on the real VDD rail.'));
  add('power-footer',()=>circuit('NMOS power-gating footer',[...inv('LOAD','A','Y','VDD','VGND'),n('FOOT','VGND','RUN','GND')],[['LOADP','LOADN'],['FOOT']],'RUN low disconnects virtual ground; output state is not retained by this cell.'));
  add('decap',()=>circuit('Local supply decoupling', [passive('ESR','res','VDD','VC','ESR'),passive('C','cap','VC','GND','Cdecap')],[['ESR','C']],'The capacitor supplies transient charge; ESR limits the immediate voltage step.'));
  add('rc-pi',()=>circuit('RC wire pi model',[passive('CIN','cap','IN','GND','Cwire / 2'),passive('R','res','IN','OUT','Rwire'),passive('COUT','cap','OUT','GND','Cwire / 2')],[['CIN'],['R'],['COUT']],'The two shunt capacitors preserve total wire capacitance; resistance separates IN and OUT.'));
  add('common-source',()=>circuit('Resistively loaded common-source amplifier',[passive('RD','res','VDD','Y','RD'),n('M1','Y','VIN','GND')],[['RD','M1']],'Drain output Y inverts the input signal. The source and bulk are at ground.'));
  add('coupled-wire',()=>circuit('Capacitive aggressor-victim coupling',[passive('CC','cap','A','Y','Cc'),passive('CG','cap','Y','GND','Cg')],[['CC','CG']],'A changes; initially floating Y moves by Cc/(Cc+Cg) times the aggressor step.'));
  add('supply-inductor',()=>circuit('Supply inductance and local decoupling',[passive('L','inductor','VDD','Y','Lpkg'),passive('C','cap','Y','GND','Cdecap'),passive('ILOAD','current','Y','GND','Iload')],[['L','C'],['ILOAD']],'Voltage across L follows current slew through L; decap separates load and inductor current slew.'));
  function blocks(id,title,rows,edges,notice,labels={}) {add(id,()=>({kind:'blocks',title,rows,nodes:rows.flat(),edges,notice,labels}));}
  blocks('rtl-gds','RTL to GDS design flow',[['RTL','SYNTH','NETLIST'],['STA','PLACE','CTS'],['ROUTE','EXTRACT','SIGNOFF']],[['RTL','SYNTH'],['SYNTH','NETLIST'],['NETLIST','STA'],['NETLIST','PLACE'],['PLACE','CTS'],['CTS','ROUTE'],['ROUTE','EXTRACT'],['EXTRACT','SIGNOFF'],['EXTRACT','STA']],'Extracted parasitics feed timing closure; signoff includes DRC, LVS and reliability.',{SYNTH:'Synthesis',NETLIST:'Mapped netlist',EXTRACT:'RC extraction',SIGNOFF:'GDS / signoff'});
  blocks('async-fifo','Dual-clock FIFO structure',[['WDATA','RAM','RDATA'],['WGRAY','WSYNC','REMPTY'],['RFULL','RSYNC','RGRAY']],[['WDATA','RAM'],['RAM','RDATA'],['WGRAY','WSYNC'],['WSYNC','REMPTY'],['RGRAY','RSYNC'],['RSYNC','RFULL']],'Pointers cross clock domains through two-flop synchronizers; payload uses dual-port storage.',{WSYNC:'2FF in read clock',RSYNC:'2FF in write clock',WGRAY:'Write Gray pointer',RGRAY:'Read Gray pointer',RFULL:'Write full logic',REMPTY:'Read empty logic'});
  blocks('synchronizer','Two-flop single-bit synchronizer',[['ASYNC','FF1','FF2'],['CLK','Q1','SYNC']],[['ASYNC','FF1'],['FF1','FF2'],['FF2','SYNC'],['FF1','Q1'],['CLK','FF1'],['CLK','FF2']],'Use only the second stage for functional logic. This circuit does not make arbitrary buses coherent.',{FF1:'Metastability catcher',FF2:'Settling stage',Q1:'No functional fanout'});
  blocks('handshake','Four-phase bundled-data handshake',[['SOURCE','DATA','DEST'],['REQ','REQSYNC','ACK'],['ACKRX','ACKSYNC','ACKTX']],[['SOURCE','DATA'],['DATA','DEST'],['SOURCE','REQ'],['REQ','REQSYNC'],['REQSYNC','DEST'],['DEST','ACK'],['ACK','ACKTX'],['ACKTX','ACKSYNC'],['ACKSYNC','ACKRX'],['ACKRX','SOURCE']],'Hold DATA stable until returned ACK; request and acknowledgment cross via synchronizers.',{REQSYNC:'Request 2FF',ACKSYNC:'ACK 2FF',ACKRX:'Source sees ACK',ACKTX:'Destination ACK'});
  blocks('pipeline','Three-stage synchronous pipeline',[['FF0','COMB1','FF1'],['COMB2','FF2','CLK']],[['FF0','COMB1'],['COMB1','FF1'],['FF1','COMB2'],['COMB2','FF2'],['CLK','FF0'],['CLK','FF1'],['CLK','FF2']],'Every register-to-register edge has setup and hold checks; latency is two clock periods.',{COMB1:'Logic stage 1',COMB2:'Logic stage 2'});
  blocks('booth','Radix-4 Booth multiplication',[['OPERANDS','RECODE','PARTIAL'],['CSA1','CSA2','CPA']],[['OPERANDS','RECODE'],['RECODE','PARTIAL'],['PARTIAL','CSA1'],['CSA1','CSA2'],['CSA2','CPA']],'Overlapping three-bit recoding selects 0, plus/minus A or plus/minus 2A; compressor stages reduce rows.',{RECODE:'Radix-4 recoder',PARTIAL:'Partial products',CSA1:'3:2 compressor',CSA2:'3:2 compressor',CPA:'Final carry adder'});
  blocks('barrel-shifter','Eight-bit logarithmic barrel shifter',[['INPUT','MUX1','MUX2'],['MUX4','OUTPUT','SELECT']],[['INPUT','MUX1'],['MUX1','MUX2'],['MUX2','MUX4'],['MUX4','OUTPUT'],['SELECT','MUX1'],['SELECT','MUX2'],['SELECT','MUX4']],'Three 2:1-mux layers select a shift by 1, 2 and 4. Fill behavior determines logical vs arithmetic shift.',{MUX1:'Shift 0 or 1',MUX2:'Shift 0 or 2',MUX4:'Shift 0 or 4',SELECT:'s[2:0]'});
  blocks('memory-array','Banked memory organization',[['ADDR','ROWDEC','CELLS'],['COLMUX','SENSE','DATA'],['BANK','PRECHARGE','WRITE']],[['ADDR','ROWDEC'],['ROWDEC','CELLS'],['CELLS','COLMUX'],['COLMUX','SENSE'],['SENSE','DATA'],['BANK','ROWDEC'],['PRECHARGE','CELLS'],['WRITE','COLMUX']],'Row decode selects wordlines; column mux selects bitlines; banks trade parallelism and area.',{ROWDEC:'Row decoder',CELLS:'Bitcell array',COLMUX:'Column mux',SENSE:'Sense amps',PRECHARGE:'BL precharge',WRITE:'Write drivers'});
  blocks('serdes','SerDes transmit and receive path',[['PARALLEL','SERIALIZE','TX'],['CHANNEL','RX','DESERIALIZE'],['CDR','PLL','OUT']],[['PARALLEL','SERIALIZE'],['SERIALIZE','TX'],['TX','CHANNEL'],['CHANNEL','RX'],['RX','DESERIALIZE'],['DESERIALIZE','OUT'],['RX','CDR'],['CDR','DESERIALIZE'],['PLL','SERIALIZE']],'TX serialization and RX clock/data recovery solve different clocking problems.',{PARALLEL:'TX parallel data',OUT:'RX parallel data',RX:'Equalizer / sampler',CDR:'Clock recovery'});
  blocks('pll','Charge-pump phase-locked loop',[['REF','PFD','CP'],['FILTER','VCO','OUT'],['DIVIDER']],[['REF','PFD'],['PFD','CP'],['CP','FILTER'],['FILTER','VCO'],['VCO','OUT'],['OUT','DIVIDER'],['DIVIDER','PFD']],'PFD UP/DN pulses steer the charge pump; the divider closes phase feedback.',{REF:'Reference clock',PFD:'Phase detector',CP:'Charge pump',FILTER:'Loop filter',VCO:'Voltage-controlled osc',DIVIDER:'Divide by N'});
  blocks('sta-graph','STA timing graph',[['START','GATE1','GATE2'],['LAUNCH','CAPTURE','END']],[['START','GATE1'],['GATE1','GATE2'],['GATE2','END'],['LAUNCH','START'],['CAPTURE','END']],'Propagate latest arrivals for setup and earliest arrivals for hold; launch and capture clock paths both matter.',{START:'Launch Q',END:'Capture D',LAUNCH:'Launch clock',CAPTURE:'Capture clock',GATE1:'Cell + net delay',GATE2:'Cell + net delay'});
  add('block-diagram',spec=>{
    const nodes=(spec.nodes || ['IN','LOGIC','OUT']).map(node=>typeof node==='string'?node:node.id),edges=spec.edges || [['IN','LOGIC'],['LOGIC','OUT']];
    if(new Set(nodes).size!==nodes.length)throw new Error('Duplicate block node');
    edges.forEach(([a,b])=>{if(!nodes.includes(a)||!nodes.includes(b))throw new Error('Unknown block endpoint '+a+' '+b);});
    return {kind:'blocks',title:spec.title || 'Functional block diagram',nodes,edges,rows:spec.rows,labels:spec.labels || {},notice:spec.notice || 'Arrows indicate directed signal dependencies.'};
  });
  add('logic-chain',spec=>{const k=Math.min(6,Math.max(1,Number(spec.stages)||4)),nodes=['IN',...Array.from({length:k},(_,i)=>'G'+(i+1)),'OUT'];return {kind:'blocks',title:'Combinational logic chain',nodes,edges:nodes.slice(1).map((id,i)=>[nodes[i],id]),labels:{IN:'Input',OUT:'Output'},notice:k+' combinational stages lie on this path; add their cell and interconnect delays.'};});
  blocks('register-swap','Simultaneous register exchange',[['Q1','D2','FF2'],['FF1','D1','Q2']],[['Q1','D2'],['D2','FF2'],['FF2','Q2'],['Q2','D1'],['D1','FF1'],['FF1','Q1']],'Both flops sample old values at the same edge. Nonblocking assignments exchange Q1 and Q2.');
  blocks('compressor-tree','Carry-save row reduction',[['ROWS9','ROWS6','ROWS4'],['ROWS3','ROWS2','CPA']],[['ROWS9','ROWS6'],['ROWS6','ROWS4'],['ROWS4','ROWS3'],['ROWS3','ROWS2'],['ROWS2','CPA']],'Each carry-save reduction has local sum/carry outputs; only the final CPA propagates carry.',{ROWS9:'9 input rows',ROWS6:'6 rows',ROWS4:'4 rows',ROWS3:'3 rows',ROWS2:'2 rows',CPA:'Final carry adder'});
  blocks('ntt-butterfly','Modular NTT butterfly',[['A','B','MUL'],['ADD','SUB','W'],['OUTP','OUTM']],[['B','MUL'],['W','MUL'],['MUL','ADD'],['MUL','SUB'],['A','ADD'],['A','SUB'],['ADD','OUTP'],['SUB','OUTM']],'t = b times w mod q; outputs are (a + t) mod q and (a - t) mod q.',{MUL:'t = b w mod q',ADD:'a + t mod q',SUB:'a - t mod q',W:'Twiddle w',OUTP:'Butterfly plus',OUTM:'Butterfly minus'});
  function routeBlocks(A,B,coords,height,used) {
    const start=[A.x+A.w+5,A.y+25],goal=[B.x-5,B.y+25],key=p=>p.join(','),startKey=key(start),goalKey=key(goal);
    const blocked=(x,y)=>Object.values(coords).some(c=>x>=c.x-2&&x<=c.x+c.w+2&&y>=c.y-2&&y<=c.y+c.h+2);
    const heap=[];
    const push=v=>{heap.push(v);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p].f<=v.f)break;heap[i]=heap[p];i=p;}heap[i]=v;};
    const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let c=i*2+1;if(c>=heap.length)break;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return first;};
    const best=new Map([[startKey,0]]),prev=new Map();push({p:start,g:0,f:0});
    while(heap.length){const cur=pop(),k=key(cur.p);if(cur.g!==best.get(k))continue;if(k===goalKey)break;
      for(const [dx,dy] of [[5,0],[-5,0],[0,5],[0,-5]]){const next=[cur.p[0]+dx,cur.p[1]+dy],nk=key(next);if(next[0]<10||next[0]>630||next[1]<40||next[1]>height-45||blocked(...next))continue;const g=cur.g+1+(used.get(nk)||0)*2;
        if(g<(best.get(nk)??Infinity)){best.set(nk,g);prev.set(nk,k);push({p:next,g,f:g+(Math.abs(next[0]-goal[0])+Math.abs(next[1]-goal[1]))/5});}
      }
    }
    if(!best.has(goalKey))throw new Error('No unobstructed block route');
    const pts=[];for(let k=goalKey;k;k=prev.get(k)){const p=k.split(',').map(Number);pts.push(p);used.set(k,(used.get(k)||0)+1);if(k===startKey)break;}pts.reverse();
    const full=[[A.x+A.w,A.y+25],...pts,[B.x,B.y+25]],out=[full[0]];
    for(let i=1;i<full.length-1;i++){const a=full[i-1],b=full[i],c=full[i+1];if(!((a[0]===b[0]&&b[0]===c[0])||(a[1]===b[1]&&b[1]===c[1])))out.push(b);}out.push(full[full.length-1]);return out;
  }
  function renderBlocks(m,spec) {
    const rows=m.rows || Array.from({length:Math.ceil(m.nodes.length/3)},(_,i)=>m.nodes.slice(i*3,i*3+3));
    const coords={}, h=85+rows.length*110;
    let body=tx(20,25,spec.title || m.title,'sg-title'), sid=++serial;
    body+=`<defs><marker id="sg-arrow-${sid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="sg-dot"/></marker></defs>`;
    rows.forEach((row,r)=>row.forEach((id,c)=>{coords[id]={x:25+c*205,y:55+r*110,w:175,h:55};}));
    const used=new Map();
    m.edges.forEach(([a,b],i)=>{
      const A=coords[a],B=coords[b];if(!A||!B)throw new Error('Unknown block net '+a+' '+b);
      const pts=routeBlocks(A,B,coords,h,used);
      body+=path(pts,(spec.highlight || []).includes(a)|| (spec.highlight || []).includes(b)?'sg-wire sg-highlight':'sg-wire',`marker-end="url(#sg-arrow-${sid})" data-edge="${esc(a+'>'+b)}"`);
    });
    rows.forEach(row=>row.forEach(id=>{const c=coords[id];body+=box(c.x,c.y,c.w,c.h)+tx(c.x+c.w/2,c.y+20,id,'sg-note','middle')+tx(c.x+c.w/2,c.y+40,m.labels?.[id] || id,'sg-label','middle');}));
    const notes=words(m.notice || 'Conceptual block diagram: arrows show functional information flow.').concat((spec.annotations || []).flatMap(a=>words((a.net ? a.net+': ' : '')+a.label)));
    notes.forEach((line,i)=>body+=tx(20,h-10+i*20,line,'sg-note'));
    return wrap(body,spec.title || m.title,h+20+notes.length*20);
  }
  /* Waveform spec: points are event changes [time, 0|1|'x'|'z'|bus string].
   * values is an equal-duration string of 0/1/x/z states. Only state transitions
   * change level; a region annotates time rather than altering the data. */
  function waveform(spec={}) {
    const duration=Number(spec.duration)||10,signals=spec.signals || [{name:'CLK',values:'0011001100'}];
    const W=640,left=105,right=615,step=75,top=60,H=top+signals.length*step+100;
    const fx=time=>left+Math.max(0,Math.min(duration,Number(time)))/duration*(right-left);
    let body=tx(20,25,spec.title || 'Timing diagram','sg-title');
    const ticks=spec.ticks || Array.from({length:6},(_,i)=>i*duration/5);
    ticks.forEach(time=>body+=ln(fx(time),top-15,fx(time),H-65,'pg')+tx(fx(time),H-40,String(time),'sg-note','middle'));
    body+=tx(615,H-20,spec.unit || 'time','sg-note','end');
    (spec.regions || []).forEach(r=>{const y=r.signal==null?top-10:top+r.signal*step-10,height=r.signal==null?signals.length*step:55;body+=`<rect x="${fx(r.from)}" y="${y}" width="${Math.max(0,fx(r.to)-fx(r.from))}" height="${height}" class="sg-region"/>`+tx((fx(r.from)+fx(r.to))/2,y+15,r.label || 'window','sg-note','middle');});
    signals.forEach((signal,row)=>{
      const y=top+row*step,low=y+35,high=y+5;
      body+=tx(left-15,y+25,signal.name,'sg-label','end');
      let points;
      if(signal.points)points=signal.points.map(p=>Array.isArray(p)?p:[p.time,p.value]);
      else {const values=String(signal.values || '0');points=Array.from(values,(value,i)=>[i*duration/values.length,value]);}
      points.sort((a,b)=>a[0]-b[0]);if(!points.length)points=[[0,0]];
      if(points[0][0]>0)points.unshift([0,points[0][1]]);
      points.forEach(([time,state],i)=>{
        const end=i+1<points.length?points[i+1][0]:duration,X=fx(time),E=fx(end),v=String(state).toLowerCase(),next=i+1<points.length?String(points[i+1][1]).toLowerCase():v;
        const cls=row%2?'sg-wire sg-ch2':'sg-wire';
        if(v==='0'||v==='1') {
          const Y=v==='1'?high:low;body+=ln(X,Y,E,Y,cls);
          if((next==='0'||next==='1')&&next!==v)body+=ln(E,Y,E,next==='1'?high:low,cls);
        }else if(v==='z')body+=ln(X,y+20,E,y+20,'sg-wire sg-x')+tx((X+E)/2,y+15,'Z','sg-note','middle');
        else {body+=box(X,y,E-X,40,'sg-region')+path([[X,y],[Math.min(X+10,E),y+20],[X,y+40]],cls)+path([[E,y],[Math.max(E-10,X),y+20],[E,y+40]],cls)+tx((X+E)/2,y+25,v==='x'?'X':String(state),'sg-note','middle');}
      });
    });
    (spec.arrows || []).forEach((a,i)=>{const Y=a.y==null?H-70:top+Number(a.y)*step+55,X=fx(a.from),E=fx(a.to);body+=ln(X,Y,E,Y,'sg-wire sg-highlight')+path([[X+5,Y-5],[X,Y],[X+5,Y+5]],'sg-wire sg-highlight')+path([[E-5,Y-5],[E,Y],[E-5,Y+5]],'sg-wire sg-highlight')+tx((X+E)/2,Y-5,a.label || 'interval','sg-note','middle');});
    const placed=[],extraNotes=[];
    (spec.annotations || []).forEach(a=>{const row=Math.max(0,Math.min(signals.length-1,Number(a.signal)||0)),X=fx(a.time),Y=top+row*step,label=String(a.label || ''),width=Math.min(570,label.length*8),textX=Math.max(20,Math.min(X+5,625-width));body+=ln(X,Y-5,X,Y+40,'sg-wire sg-warn');
      if(placed.some(p=>p.row===row&&textX<p.x+p.width&&textX+width>p.x))extraNotes.push(signals[row].name+' at '+a.time+' '+(spec.unit || 'time')+': '+label);
      else{body+=tx(textX,Y-10,label,'sg-note');placed.push({row,x:textX,width});}
    });
    const notes=extraNotes.concat(spec.solutionNotes || []).flatMap(text=>words(text));notes.forEach((text,i)=>body+=tx(20,H+10+i*20,text,'sg-note'));
    return wrap(body,spec.title || 'Timing diagram',H+(notes.length?notes.length*20+30:0));
  }
  const wave=(id,spec)=>add(id,()=>({kind:'waveform',title:spec.title,spec}));
  wave('timing-setup-hold',{title:'Setup and hold stability window',duration:10,signals:[{name:'CLK',points:[[0,0],[5,1],[8,0]]},{name:'D',points:[[0,0],[3,1],[7,0]]},{name:'Q',points:[[0,0],[5.8,1]]}],regions:[{from:4,to:5,label:'setup',signal:1},{from:5,to:6,label:'hold',signal:1}],arrows:[{from:5,to:5.8,y:2,label:'clk to Q'}],unit:'ns'});
  wave('timing-metastability',{title:'Metastability is analog settling, not a fixed delay',duration:10,signals:[{name:'CLK',points:[[0,0],[3,1],[5,0],[7,1],[9,0]]},{name:'ASYNC',points:[[0,0],[3,1]]},{name:'Q1',points:[[0,0],[3,'x'],[5.5,1]]},{name:'Q2',points:[[0,0],[7.8,1]]}],regions:[{from:3,to:5.5,label:'uncertain settling',signal:2}],unit:'ns'});
  wave('timing-handshake',{title:'Four-phase request/acknowledgment transfer',duration:12,signals:[{name:'DATA',points:[[0,'old'],[1,'new'],[10,'old']]},{name:'REQ',points:[[0,0],[2,1],[7,0]]},{name:'ACK',points:[[0,0],[5,1],[9,0]]}],regions:[{from:1,to:9,label:'hold payload stable',signal:0}],unit:'cycles'});
  wave('timing-fifo',{title:'Gray pointer crosses one changing bit',duration:8,signals:[{name:'CLKw',values:'01010101'},{name:'BIN',points:[[0,'00'],[2,'01'],[4,'10'],[6,'11']]},{name:'GRAY',points:[[0,'00'],[2,'01'],[4,'11'],[6,'10']]},{name:'READ SYNC',points:[[0,'00'],[4,'01'],[6,'11']]}],unit:'cycles'});
  wave('timing-scan',{title:'Scan shift then functional capture',duration:10,signals:[{name:'CLK',values:'0101010101'},{name:'SCAN_EN',points:[[0,1],[6.5,0]]},{name:'SCAN_IN',values:'0011110000'},{name:'MODE',points:[[0,'shift'],[6.5,'capture']]}],unit:'cycles'});
  wave('timing-domino',{title:'Domino precharge and evaluate sequence',duration:8,signals:[{name:'CLK',values:'00001111'},{name:'A',points:[[0,0],[4.5,1]]},{name:'B',points:[[0,0],[5,1]]},{name:'X',points:[[0,1],[5.5,0]]},{name:'Y',points:[[0,0],[6,1]]}],regions:[{from:0,to:4,label:'precharge'},{from:4,to:8,label:'evaluate'}],unit:'ns'});
  wave('timing-sram-read',{title:'SRAM read phases',duration:10,signals:[{name:'PREb',points:[[0,0],[2,1],[8,0]]},{name:'WL',points:[[0,0],[3,1],[7,0]]},{name:'BL/BLb',points:[[0,'equal'],[4,'small delta'],[8,'equal']]},{name:'SAEN',points:[[0,0],[5,1],[7,0]]},{name:'DATA',points:[[0,'x'],[6,'valid']]}],unit:'ns'});
  wave('timing-sram-write',{title:'SRAM write: drive differential bitlines before wordline',duration:10,signals:[{name:'PREb',points:[[0,0],[1,1],[8,0]]},{name:'BL',points:[[0,1],[2,0],[8,1]]},{name:'BLb',points:[[0,1]]},{name:'WL',points:[[0,0],[3,1],[7,0]]},{name:'Q',points:[[0,1],[4,0]]}],regions:[{from:2,to:7,label:'write drive active'}],unit:'ns'});
  wave('timing-gating',{title:'Safe clock gating holds enable throughout clock high',duration:8,signals:[{name:'CLK',values:'00110011'},{name:'EN',points:[[0,0],[1,1],[3,0]]},{name:'EN_LATCH',points:[[0,0],[1,1],[4,0]]},{name:'GCLK',points:[[0,0],[2,1],[4,0]]}],unit:'ns'});
  wave('timing-borrowing',{title:'Time borrowing across two non-overlapping latches',duration:10,signals:[{name:'PHI1',points:[[0,1],[4,0],[8,1]]},{name:'PHI2',points:[[0,0],[4.5,1],[7.5,0]]},{name:'D2',points:[[0,0],[5.5,1]]},{name:'Q2',points:[[0,0],[6,1]]}],arrows:[{from:4.5,to:5.5,y:2,label:'1 ns borrowed'}],unit:'ns'});
  const layers=['well','diff','poly','m1','m2','contact'];
  function layout(id,title,notice,build,nodes=[],edges=[]) {add(id,()=>({kind:'layout',title,notice,build,nodes,edges,topology:{layers:layers.slice()}}));}
  function legend(y) {return layers.map((layer,i)=>`<rect x="${20+i*100}" y="${y}" width="15" height="15" class="sg-layer-${layer}"/>`+tx(40+i*100,y+13,layer,'sg-note')).join('');}
  layout('stick-nand','NAND2 stick diagram','Schematic layers, not a DRC-clean layout. Diffusion gaps break electrical connections.',()=>{
    let b=`<rect x="40" y="60" width="560" height="100" class="sg-layer-well"/>`;
    b+=ln(50,70,590,70,'sg-layer-m1')+ln(50,300,590,300,'sg-layer-m1')+tx(50,55,'VDD')+tx(50,320,'GND');
    // A continuous p diffusion contains two devices sharing Y in the middle.
    b+=ln(100,130,500,130,'sg-layer-diff')+ln(100,240,500,240,'sg-layer-diff');
    [220,380].forEach((x,i)=>{b+=ln(x,90,x,265,'sg-layer-poly')+tx(x,285,i?'B':'A','sg-label','middle');});
    const contact=(x,y)=>`<rect x="${x-5}" y="${y-5}" width="10" height="10" class="sg-layer-contact"/>`;
    [[100,130],[300,130],[500,130],[100,240],[500,240]].forEach(([x,y])=>b+=contact(x,y));
    b+=path([[100,130],[100,70],[500,70],[500,130]],'sg-layer-m1')+path([[300,130],[300,185],[500,185],[500,240]],'sg-layer-m1')+ln(100,240,100,300,'sg-layer-m1')+ln(500,185,575,185,'sg-layer-m1')+tx(580,190,'Y');return b;
  },['VDD','GND','A','B','Y','NX'],[['PA','VDD','Y'],['PB','VDD','Y'],['NA','GND','NX'],['NB','NX','Y']]);
  layout('cell-layout','Layer view of a CMOS inverter','Layer geometry is illustrative. Only contacts connect poly/diffusion to metal.',()=>{
    let b=`<rect x="50" y="70" width="540" height="110" class="sg-layer-well"/>`;
    b+=`<rect x="100" y="110" width="400" height="30" class="sg-layer-diff"/><rect x="100" y="220" width="400" height="30" class="sg-layer-diff"/>`;
    b+=ln(250,80,250,270,'sg-layer-poly')+tx(235,290,'A');
    b+=ln(60,55,580,55,'sg-layer-m1')+ln(60,310,580,310,'sg-layer-m1')+path([[130,125],[130,55]],'sg-layer-m1')+path([[130,235],[130,310]],'sg-layer-m1')+path([[470,125],[470,235],[560,235]],'sg-layer-m1')+tx(565,240,'Y');
    [[130,125],[130,235],[470,125],[470,235]].forEach(([x,y])=>b+=`<rect x="${x-5}" y="${y-5}" width="10" height="10" class="sg-layer-contact"/>`);
    return b+tx(60,45,'VDD')+tx(60,335,'GND');
  },['VDD','GND','A','Y'],[['PMOS','VDD','Y'],['NMOS','Y','GND']]);
  layout('standard-cell','Standard-cell rails and routing tracks','Cell height fixes rail pitch; width quantization and pins constrain placement.',()=>{
    let b=box(50,70,540,230);b+=ln(50,75,590,75,'sg-layer-m1')+ln(50,295,590,295,'sg-layer-m1')+tx(60,60,'VDD')+tx(60,325,'VSS');
    for(let i=0;i<5;i++)b+=ln(60,110+i*35,580,110+i*35,'pg')+tx(580,105+i*35,'track '+(i+1),'sg-note','end');
    [140,300,460].forEach((x,i)=>b+=box(x,125,65,115,'sg-region')+tx(x+30,185,'cell '+(i+1),'sg-note','middle'));return b;
  },['VDD','VSS','TRACK1','TRACK2','TRACK3','TRACK4','TRACK5']);
  layout('floorplan','Macro floorplan with keepout halos','Halos reserve routing and placement space. Power straps must still reach each macro.',()=>{
    let b=box(40,60,560,270);[[75,100,155,160,'SRAM'],[360,85,190,100,'DSP'],[380,240,150,55,'IO']].forEach(([x,y,w,h,label])=>{b+=box(x-15,y-15,w+30,h+30,'sg-region')+box(x,y,w,h)+tx(x+w/2,y+h/2,label,'sg-title','middle');});
    return b+tx(260,190,'standard cells','sg-note')+tx(260,215,'routing channel','sg-note');
  },['CORE','SRAM','DSP','IO','HALO']);
  layout('power-grid','Orthogonal power-grid mesh','M1 and M2 connect only at shown vias. Separate VDD/VSS straps alternate.',()=>{
    let b='';for(let x=80;x<=560;x+=80)b+=ln(x,70,x,300,'sg-layer-m2');for(let y=90;y<=290;y+=50)b+=ln(50,y,590,y,'sg-layer-m1');
    for(let x=80;x<=560;x+=80)for(let y=90;y<=290;y+=50)if(((x/80)+(y-90)/50)%2===0)b+=`<rect x="${x-5}" y="${y-5}" width="10" height="10" class="sg-layer-contact"/>`;
    return b+tx(60,55,'Alternating supply nets; vias join matching straps only.','sg-note');
  },['VDD','VSS','M1','M2']);
  layout('cts-tree','Balanced H-tree clock distribution','Equal geometric path lengths help skew; loads and wire RC still need balancing.',()=>{
    let b=path([[320,60],[320,170],[160,170],[160,110],[80,110]],'sg-wire')+path([[160,170],[160,250],[80,250]],'sg-wire')+path([[160,110],[240,110]],'sg-wire')+path([[160,250],[240,250]],'sg-wire')+path([[320,170],[480,170],[480,110],[400,110]],'sg-wire')+path([[480,170],[480,250],[400,250]],'sg-wire')+path([[480,110],[560,110]],'sg-wire')+path([[480,250],[560,250]],'sg-wire');
    [[80,110],[240,110],[80,250],[240,250],[400,110],[560,110],[400,250],[560,250]].forEach(([x,y],i)=>b+=dot(x,y)+tx(x,y+25,'sink '+i,'sg-note','middle'));return b+tx(320,45,'CLK root','sg-label','middle');
  },['CLK',...Array.from({length:8},(_,i)=>'SINK'+i)],Array.from({length:8},(_,i)=>['CLK','SINK'+i]));
  layout('antenna','Antenna charging and protective discharge','A long conductor can collect plasma charge before a discharge path is fabricated.',()=>{
    let b=ln(60,100,500,100,'sg-layer-m2')+path([[500,100],[500,210],[350,210]],'sg-layer-m1')+ln(350,180,350,255,'sg-layer-poly')+tx(60,80,'long exposed metal','sg-note')+tx(310,280,'thin gate oxide','sg-note');
    b+=path([[500,100],[570,100],[570,240]],'sg-wire')+path([[550,200],[590,200],[570,225],[550,200]],'sg-device')+ln(550,230,590,230,'sg-device')+ground(570,240)+tx(550,275,'diode','sg-note');return b;
  },['METAL','GATE','DIODE','GND'],[['METAL','GATE'],['METAL','DIODE'],['DIODE','GND']]);
  layout('latchup','Parasitic SCR path in CMOS','Injected carriers can trigger positive feedback through parasitic PNP and NPN devices.',()=>{
    let b=`<rect x="50" y="190" width="540" height="120" class="sg-layer-diff"/><rect x="80" y="80" width="230" height="170" class="sg-layer-well"/>`;
    b+=tx(120,115,'n-well')+tx(350,275,'p-substrate')+box(105,150,65,35,'sg-layer-diff')+box(430,150,65,35,'sg-layer-diff')+tx(115,140,'p+ / VDD','sg-note')+tx(430,140,'n+ / VSS','sg-note');
    b+=path([[140,185],[210,215],[450,185]],'sg-wire sg-highlight')+path([[450,185],[360,245],[140,185]],'sg-wire sg-ch2')+tx(220,200,'parasitic PNP','sg-note')+tx(250,305,'parasitic NPN + well/substrate resistance','sg-note');return b;
  },['VDD','VSS','NWELL','PSUB','PNP','NPN'],[['PNP','NWELL','PSUB'],['NPN','PSUB','NWELL']]);
  function renderLayout(m,spec) {
    let b=tx(20,25,spec.title || m.title,'sg-title')+m.build()+legend(355);
    const notes=words(m.notice).concat((spec.annotations || []).flatMap(a=>words((a.net?a.net+': ':'')+a.label)));
    notes.forEach((line,i)=>b+=tx(20,400+i*20,line,'sg-note'));
    return wrap(b,spec.title || m.title,425+notes.length*20);
  }
  /* Conventional connected views for the frequently traced interview circuits.
   * Wire coordinates and terminal declarations share the same device IDs.
   * At a crossing only a junction dot means a connection. */
  function connected(name,m,spec) {
    if(!['inverter','nand','nor','aoi','oai','mirror','sram6t','tg-latch','master-slave'].includes(name))return null;
    if(['nand','nor'].includes(name)&&(fanIn(spec)<2||fanIn(spec)>4))return null;
    let b=tx(20,25,spec.title || m.title,'sg-title'), bottom=420;
    const wire=(points,net)=>path(points,(spec.highlight || []).includes(net)?'sg-wire sg-highlight':'sg-wire',`data-net="${esc(net)}"`);
    const dev=(id,x,y)=>deviceGlyph(m.devices.find(d=>d.id===id),x,y,spec);
    const rail=(y,net)=>wire([[60,y],[590,y]],net)+tx(60,y-10,net,'sg-label');
    const out=(x,y,net)=>wire([[x,y],[590,y]],net)+dot(x,y)+tx(595,y+5,net,'sg-label');
    if(name==='inverter') {
      b+=rail(65,'VDD')+dev('MP',300,90)+dev('MN',300,250)+wire([[310,65],[310,90]],'VDD')+wire([[310,160],[310,250]],'Y')+wire([[310,320],[310,370]],'GND')+ground(310,370)+out(310,205,'Y');
      b+=wire([[250,125],[210,125],[210,285],[250,285]],'A')+wire([[140,205],[210,205]],'A')+dot(210,205)+tx(115,210,'A');
    } else if(name==='nand') {
      const k=(Number(spec.fanin)||2),xs=Array.from({length:k},(_,i)=>100+i*400/(k-1));
      b+=rail(65,'VDD');xs.forEach((x,i)=>b+=dev('P'+(i+1),snap(x),90)+wire([[snap(x)+10,65],[snap(x)+10,90]],'VDD')+wire([[snap(x)+10,160],[snap(x)+10,190]],'Y')+dot(snap(x)+10,190));
      b+=wire([[xs[0]+10,190],[xs[k-1]+10,190]],'Y')+out(310,190,'Y')+wire([[310,190],[310,220]],'Y');
      for(let i=0;i<k;i++){const y=220+i*100;b+=dev('N'+(i+1),300,y);if(i<k-1)b+=wire([[310,y+70],[310,y+100]],'N'+'x'+(i+1))+dot(310,y+85);}
      const end=220+(k-1)*100+70;b+=wire([[310,end],[310,end+20]],'GND')+ground(310,end+20);bottom=end+80;
    } else if(name==='nor') {
      const k=(Number(spec.fanin)||2),xs=Array.from({length:k},(_,i)=>100+i*400/(k-1));b+=rail(65,'VDD')+wire([[310,65],[310,90]],'VDD');
      for(let i=0;i<k;i++){const y=90+i*100;b+=dev('P'+(i+1),300,y);if(i<k-1)b+=wire([[310,y+70],[310,y+100]],'Px'+(i+1));}
      const Y=90+(k-1)*100+100,N=Y+40;b+=wire([[310,Y-30],[310,Y]],'Y')+wire([[xs[0]+10,Y],[xs[k-1]+10,Y]],'Y')+out(310,Y,'Y');
      xs.forEach((x,i)=>b+=dev('N'+(i+1),snap(x),N)+wire([[snap(x)+10,Y],[snap(x)+10,N]],'Y')+wire([[snap(x)+10,N+70],[snap(x)+10,N+100]],'GND')+dot(snap(x)+10,Y));
      b+=rail(N+100,'GND');bottom=N+155;
    } else if(name==='aoi') {
      b+=rail(65,'VDD')+dev('PA',160,90)+dev('PB',440,90)+wire([[170,65],[170,90]],'VDD')+wire([[450,65],[450,90]],'VDD')+wire([[170,160],[170,185],[450,185],[450,160]],'PU')+wire([[310,185],[310,210]],'PU')+dot(310,185)+dev('PC',300,210)+wire([[310,280],[310,310]],'Y')+out(310,310,'Y')+wire([[170,310],[450,310]],'Y')+dev('NA',160,340)+dev('NB',160,440)+dev('NC',440,340)+wire([[170,310],[170,340]],'Y')+wire([[450,310],[450,340]],'Y')+wire([[170,410],[170,440]],'NX')+wire([[170,510],[170,540]],'GND')+wire([[450,410],[450,540]],'GND')+rail(540,'GND');bottom=585;
    } else if(name==='oai') {
      b+=rail(65,'VDD')+dev('PA',160,90)+dev('PB',160,190)+dev('PC',440,90)+wire([[170,65],[170,90]],'VDD')+wire([[450,65],[450,90]],'VDD')+wire([[170,160],[170,190]],'PX')+wire([[170,260],[170,290],[450,290],[450,160]],'Y')+out(310,290,'Y')+dev('NA',160,330)+dev('NB',440,330)+wire([[170,290],[170,330]],'Y')+wire([[450,290],[450,330]],'Y')+wire([[170,400],[170,430],[450,430],[450,400]],'NX')+dot(310,430)+wire([[310,430],[310,460]],'NX')+dev('NC',300,460)+wire([[310,530],[310,550]],'GND')+ground(310,550);bottom=595;
    } else if(name==='mirror') {
      b+=dev('REF',180,170)+dev('OUT',440,170)+wire([[190,100],[190,170]],'BIAS')+wire([[450,100],[450,170]],'IOUT')+tx(185,85,'IREF','sg-label','middle')+tx(450,85,'IOUT','sg-label','middle');
      b+=wire([[190,130],[105,130],[105,205],[130,205]],'BIAS')+dot(190,130)+wire([[105,205],[105,285],[365,285],[365,205],[390,205]],'BIAS')+dot(105,205)+wire([[190,240],[190,330],[450,330],[450,240]],'GND')+ground(320,330);bottom=405;
    } else if(name==='sram6t') {
      b+=rail(65,'VDD')+rail(335,'GND');[['LP',160,90],['LN',160,235],['RP',440,90],['RN',440,235]].forEach(([id,x,y])=>b+=dev(id,x,y));
      b+=wire([[170,65],[170,90]],'VDD')+wire([[450,65],[450,90]],'VDD')+wire([[170,160],[170,235]],'Q')+wire([[450,160],[450,235]],'Qb')+wire([[170,305],[170,335]],'GND')+wire([[450,305],[450,335]],'GND');
      b+=wire([[110,125],[90,125],[90,270],[110,270]],'Qb')+wire([[450,195],[470,195],[470,375],[50,375],[50,225],[90,225]],'Qb')+dot(450,195)+dot(90,225);
      b+=wire([[390,125],[370,125],[370,270],[390,270]],'Q')+wire([[170,195],[200,195],[200,45],[350,45],[350,195],[370,195]],'Q')+dot(170,195)+dot(370,195);
      // Horizontal access MOS has channel ends connected to BL and the storage node.
      const access=(x,y,id,net,left,right)=>{
        const leftNet=id==='AXL'?'BL':'Qb',rightNet=id==='AXL'?'Q':'BLb';
        let a=wire([[left,y],[x-20,y]],leftNet)+path([[x-20,y],[x-20,y-10],[x+20,y-10],[x+20,y]],'sg-device',`data-device="${id}"`)+wire([[x+20,y],[right,y]],rightNet)+ln(x-20,y-20,x+20,y-20,'sg-device')+wire([[x,y-45],[x,y-20]],'WL');
        return a+tx(x,y-50,'WL','sg-note','middle')+tx(x,y+20,id,'sg-note','middle');
      };
      b+=access(110,195,'AXL','BL',20,170)+tx(20,220,'BL')+access(530,195,'AXR','BLb',450,620)+tx(600,220,'BLb')+tx(180,190,'Q')+tx(455,190,'Qb');bottom=420;
    } else {
      // Composition explicitly shows the two TG controls and the feedback inverter.
      const tri=(x,y,label,left=false)=>path(left?[[x+40,y-15],[x+40,y+15],[x+10,y],[x+40,y-15]]:[[x,y-15],[x,y+15],[x+30,y],[x,y-15]],'sg-device')+`<circle cx="${left?x+5:x+35}" cy="${y}" r="5" class="sg-device"/>`+tx(x+20,y+35,label,'sg-note','middle');
      const switchTG=(x,y,en,enb,label)=>{
        let a=box(x-25,y-20,50,40,'sg-panel')+path([[x-20,y],[x+20,y]],'sg-device')+ln(x,y-40,x,y-20,'sg-wire')+ln(x,y+20,x,y+40,'sg-wire');
        return a+tx(x,y-45,en,'sg-note','middle')+tx(x,y+55,enb,'sg-note','middle')+tx(x,y+5,label,'sg-note','middle');
      };
      const stage=(offset,width,prefix,input,output,en,enb)=>{
        const x=offset, y=145, s=width/300;
        let a=wire([[x+10,y],[x+55,y]],input)+switchTG(x+80,y,en,enb,'TG')+wire([[x+105,y],[x+145,y]],prefix+'X')+tri(x+145,y,'INV')+wire([[x+185,y],[x+285,y]],output)+tx(x+10,y-10,input,'sg-note')+tx(x+280,y-10,output,'sg-note','end');
        a+=tri(x+220,275,'INV',true)+wire([[x+250,y],[x+285,y],[x+285,275],[x+260,275]],output)+switchTG(x+80,275,enb,en,'TG')+wire([[x+220,275],[x+185,275],[x+185,345],[x+105,345],[x+105,275]],prefix+'Z')+wire([[x+55,275],[x+35,275],[x+35,215],[x+125,215],[x+125,y]],prefix+'X')+dot(x+125,y)+dot(x+250,y);
        return a;
      };
      if(name==='tg-latch')b+=stage(155,300,'L','D','Qb','CLK','CLKb');
      else b+=stage(10,300,'M','D','Mb','CLKb','CLK')+stage(325,300,'S','Mb','Q','CLK','CLKb')+wire([[295,145],[335,145]],'Mb');
      bottom=400;
    }
    const notes=words(m.notice).concat((spec.annotations || []).flatMap(a=>words((a.net ? a.net+': ':'')+a.label)));
    notes.forEach((line,i)=>b+=tx(20,bottom+i*20,line,'sg-note'));
    return wrap(b,spec.title || m.title,bottom+30+notes.length*20);
  }
  T.schematics=R;
  T.schematicTopology=(name,spec={})=>{if(!R[name])throw new Error('Unknown schematic '+name);return topology(R[name](spec));};
  T.schematicModel=(name,spec={})=>{if(!R[name])throw new Error('Unknown schematic '+name);return R[name](spec);};
  T.schematic=(name,spec={})=>{
    if(!R[name]) return `<p class="empty">Diagram unavailable: ${esc(name)}</p>`;
    const m=R[name](spec);
    const conventional=connected(name,m,spec);if(conventional)return conventional;
    if(m.kind==='circuit')return renderCircuit(m,spec);
    if(m.kind==='waveform')return waveform({...m.spec,...spec});
    if(m.kind==='layout')return renderLayout(m,spec);
    return renderBlocks(m,spec);
  };
  T.waveform=waveform;
  T.schematicPrimitives={grid:G,snap,mos:n,pmos:p,ground,supply,wire:ln,junction:dot,label:tx};
})();
