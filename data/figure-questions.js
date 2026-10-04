/* Figure-driven exercises. Numerical labels belong to hypothetical teaching
 * cases, not measured silicon or the learner's project history. */
(function () {
  const T=window.T, out=[];
  const circuit=(id,title,labels)=>({schematic:id,spec:{title,annotations:labels.map(label=>({net:'',label}))},cap:'Illustrative circuit. Read the annotated operating conditions before calculating.'});
  const wave=(title,duration,signals,annotations=[],unit='ns')=>({waveform:{title,duration,unit,ticks:[0,duration/4,duration/2,3*duration/4,duration],signals,annotations},cap:'Illustrative waveform. Read event times from the shared horizontal axis.'});
  const blocks=(title,nodes,edges,labels,notes)=>({schematic:'block-diagram',spec:{title,nodes,edges,labels,annotations:notes.map(label=>({net:'',label}))},cap:'Illustrative block structure. The annotations define this hypothetical case.'});
  const sig=(name,points)=>({name,points});
  function add(d,n,title,q,opts,ans,why,ex,fig,solution){
    const annotated=JSON.parse(JSON.stringify(fig));
    if(annotated.waveform){annotated.waveform.title='Annotated solution';annotated.waveform.solutionNotes=[solution];}
    else {annotated.spec.title='Annotated solution';annotated.spec.annotations.push({net:'',label:solution});annotated.spec.highlight=['Y','Q','BL'];}
    annotated.cap='Worked interpretation. '+solution;
    out.push({id:'FIG-'+d.toUpperCase()+'-'+String(n).padStart(3,'0'),d,lvl:2,f:'mcq',title,q,opts,ans,why,ex,
      figs:[fig],afig:[annotated],figureDriven:true,figureRationale:'The circuit annotations or plotted event times supply inputs needed to answer.',
      hint:'Identify the marked nodes or events, state the model, then use the values shown in the figure.',
      tags:['figure-driven',d],oral:q,fu:['Change one marked condition and explain which part of your reasoning changes.']});
  }
  add('dev',1,'Device overdrive from marked biases','For the marked NMOS biases, what is the long-channel gate overdrive VGS minus VT?',
    ['0.30 V','0.70 V','0.40 V','1.10 V'],0,
    ['Subtract the marked threshold from the marked gate-to-source voltage.','This is VGS before subtracting threshold.','This is the threshold, not overdrive.','Adding threshold gives the wrong quantity.'],
    'The figure gives VGS=0.70 V and VT=0.40 V. VOV=0.70-0.40=0.30 V.',circuit('inverter','NMOS bias example',['VGS = 0.70 V','VTn = 0.40 V']), 'VOV = 0.30 V');
  add('dev',2,'Locate the saturation condition','Under the long-channel NMOS model, which region follows from the marked terminal voltages?',
    ['Saturation','Triode','Cutoff','The region depends only on VDD'],0,
    ['The gate exceeds threshold and VDS exceeds VGS-VT.','Triode requires VDS below overdrive for this on-device.','The marked gate bias exceeds threshold.','The region requires local VGS, VDS and threshold, not supply alone.'],
    'VOV=0.8-0.3=0.5 V. The marked VDS=0.6 V exceeds 0.5 V, so the ideal long-channel device is in saturation.',circuit('inverter','Long-channel NMOS region',['VGS = 0.80 V; VTn = 0.30 V','VDS = 0.60 V']), 'VDS 0.60 V >= VOV 0.50 V');
  add('dev',3,'Read a subthreshold current ratio','The two annotated operating points differ only in gate voltage. With the stated subthreshold swing, what is I2/I1?',
    ['10','2','100','0.1'],0,
    ['One swing interval is one decade of current.','A linear factor-of-two model does not describe the stated logarithmic swing.','Two decades would need twice the shown gate change.','Increasing gate voltage increases the NMOS subthreshold current.'],
    'The gate rises by 80 mV and S=80 mV/decade. I2/I1=10^(80/80)=10.',circuit('inverter','Subthreshold comparison',['VG1 = 0.10 V; VG2 = 0.18 V','S = 80 mV/dec; other biases fixed']), '80 mV rise = 1 decade = 10x');
  add('dev',4,'Convert DIBL to leakage change','Use the marked DIBL coefficient and swing. What leakage-current ratio results from the shown drain-bias increase, with gate bias fixed?',
    ['10','2','0.1','100'],0,
    ['DIBL reduces effective threshold by one marked swing interval.','This incorrectly treats a decade-based relationship as linear.','A higher drain bias lowers the effective threshold in this model.','The threshold shift is one decade, not two.'],
    'The drain bias increases 0.50 V. The threshold reduction is 0.10*0.50=0.050 V. At 50 mV/decade this raises current by 10x.',circuit('inverter','DIBL teaching case',['VDS: 0.10 V -> 0.60 V','DIBL = 0.10 V/V; S = 50 mV/dec']), 'Delta VT = -50 mV; leakage x10');
  add('cmos',1,'Trace a NAND conducting path','For the marked input state, what is the static output of the shown complementary gate? Ignore leakage.',
    ['Low','High','High impedance','A resistive midpoint'],0,
    ['Both series NMOS devices conduct and both PMOS branches are off.','No pull-up branch conducts at this input state.','The conducting pull-down drives the output.','A midpoint would require simultaneous pull-up and pull-down conduction.'],
    'For a NAND with A=B=1, the complete series pull-down path conducts. Y=0.',circuit('nand','NAND input state',['A = 1; B = 1','Static CMOS; ignore leakage']), 'A=B=1 completes Y-to-GND path');
  add('cmos',2,'Read the NOR pull-up condition','For the marked input state of the NOR, which output condition follows?',
    ['High through the series PMOS path','Low through two series NMOS devices','Floating because both NMOS are off','Half the supply by symmetry'],0,
    ['Both low inputs turn on the series pull-up devices.','The shown NOR has parallel NMOS branches, and both are off.','The PMOS path still drives the output when the NMOS network is off.','Complementary static logic does not form an equal divider in this state.'],
    'A=B=0 turns off both NOR pull-down branches and enables the series pull-up. The settled output is high.',circuit('nor','NOR input state',['A = 0; B = 0']), 'Series PMOS on; Y = VDD');
  add('cmos',3,'Account for dynamic charge sharing','When the marked precharged and discharged nodes connect, what is their common voltage? Ignore leakage and rail current during sharing.',
    ['0.60 V','0.80 V','0.20 V','0.40 V'],0,
    ['Conserved charge divides across the sum of the two capacitances.','This ignores charge transferred into the initially empty node.','This is the droop, not the final voltage.','Equal voltage averaging would require equal capacitances.'],
    'Initial charge is 12 fF*0.8 V. With 16 fF total, the final voltage is 0.60 V; droop is 0.20 V.',circuit('domino','Charge-sharing teaching case',['Dynamic node: 12 fF at 0.80 V','Internal node: 4 fF at 0 V','Connect nodes; ignore rail current']), 'Q conserved: final V = 0.60 V');
  add('cmos',4,'Size a series pull-down','Using R proportional to 1/W and the annotated inverter reference, what width should EACH of the two series NAND NMOS devices have for equal pull-down resistance?',
    ['2 units','1 unit','0.5 unit','4 units'],0,
    ['Each device contributes half the reference resistance, so two in series recover it.','Two reference-width devices have twice the reference resistance.','Narrowing doubles each resistance, worsening the series path.','This gives half the reference path resistance, oversizing for the stated target.'],
    'The reference NMOS has W=1. Two devices each W=2 contribute R/2+R/2=R. This ignores stack/body effects and capacitance.',circuit('nand','Matched-resistance sizing',['Reference inverter NMOS W = 1','Two equal series NMOS; R scales as 1/W']), 'Wn = 2 each; R/2 + R/2 = R');
  add('dly',1,'Compute the annotated RC crossing','For the marked lumped RC approximation, what is the 50% crossing delay? Use ln(2)=0.693.',
    ['13.86 ps','20 ps','6.93 ps','28.9 ps'],0,
    ['RC=20 ps and multiplying by 0.693 gives 13.86 ps.','This is the time constant rather than the 50% crossing.','This omits half of the marked resistance or capacitance.','This divides by 0.693 instead of multiplying.'],
    'R=2 kohm and total C=10 fF give RC=20 ps; t50=0.693RC=13.86 ps.',circuit('rc-pi','Lumped crossing approximation',['Use total C = 10 fF','Effective R = 2 kohm','Lump C at output for this calculation']), 't50 = 0.693 x 20 ps = 13.86 ps');
  add('dly',2,'Weight the wire capacitance','Use the marked distributed-wire approximation tau=Rd(Cw+CL)+Rw(Cw/2+CL). What is tau?',
    ['112 ps','120 ps','77.6 ps','60 ps'],0,
    ['The driver term is 100 ps and the distributed-wire term is 12 ps.','This weights all wire capacitance after the full wire resistance.','This unnecessarily converts the requested moment to an approximate 50% delay.','This incorrectly halves capacitance seen by the driver.'],
    '1000*(80+20) fF +200*(40+20) fF=100 ps+12 ps=112 ps.',circuit('rc-pi','Distributed-wire moment',['Rd = 1 kohm; Rw = 200 ohm','Cw = 80 fF; CL = 20 fF']), 'Driver 100 ps + wire 12 ps = 112 ps');
  add('dly',3,'Read threshold crossing times','From the waveform markers, what is the 10%-to-90% transition time?',
    ['44 ps','60 ps','16 ps','76 ps'],0,
    ['Subtract the 10% event time from the 90% event time.','This is the absolute 90% time, not the interval.','This is the absolute 10% time.','Adding event times does not give transition duration.'],
    'The marked threshold events occur at 16 ps and 60 ps. Transition time=60-16=44 ps.',wave('Threshold-event flags',80,[sig('above 10%',[[0,0],[16,1]]),sig('above 90%',[[0,0],[60,1]])],[{time:16,signal:0,label:'10% at 16 ps'},{time:60,signal:1,label:'90% at 60 ps'}],'ps'),'t90 - t10 = 44 ps');
  add('dly',4,'Compare gate and path delay','For the annotated path, what is its total delay in tau under the stated logical-effort model?',
    ['20 tau','16 tau','5 tau','24 tau'],0,
    ['Four stages each contribute effort 4 plus parasitic 1.','This includes effort but omits all four parasitic terms.','This is one stage delay.','This adds an extra parasitic unit to every stage.'],
    'Each stage delay is gh+p=4+1=5 tau. Four stages give 20 tau.',circuit('logic-chain','Four combinational stages between registers',['N = 4; each stage effort gh = 4','Each stage parasitic p = 1','Ignore register overhead']), '4 x (4 + 1) = 20 tau');
  add('pwr',1,'Read switching duty','The high intervals indicate cycles with one 0-to-1 charge event. What activity factor does the marked four-cycle sample show?',
    ['0.5','0.25','1','2'],0,
    ['Two of the four cycles contain a charge event.','This counts only one of the two active intervals.','Only half the sample cycles are active.','This is the event count before dividing by cycles.'],
    'The active intervals are cycles 0-1 and 2-3: two charge events in four cycles, so alpha=2/4=0.5.',wave('Charge-event indicator per cycle',4,[sig('charge',[[0,1],[1,0],[2,1],[3,0]])],[],'cycle'),'2 events / 4 cycles = alpha 0.5');
  add('pwr',2,'Calculate switched-capacitance power','Using the figure conditions and P=alpha*C*VDD^2*f, what is dynamic power?',
    ['64 mW','80 mW','640 mW','32 mW'],0,
    ['The marked parameters multiply to 0.064 W.','This uses VDD instead of VDD squared.','This omits the 0.1 activity factor.','This adds an unjustified factor of one-half to supply energy per charge event.'],
    '0.1*1 nF*(0.8 V)^2*1 GHz=0.064 W=64 mW. Alpha counts 0-to-1 charging events.',circuit('inverter','Switching-power model',['C = 1 nF; VDD = 0.8 V','f = 1 GHz; alpha = 0.1','Alpha counts 0-to-1 events']), 'Pdyn = 64 mW');
  add('pwr',3,'Find the gating hazard','A raw AND gates CLK with EN. Which output hazard follows from the shown event order?',
    ['A rising edge occurs partway through CLK high','The gated clock stays low throughout this high phase','The clock pulse becomes wider than CLK high','Only a falling-edge delay changes'],0,
    ['When EN rises while CLK is already high, the AND output rises immediately.','Both inputs are high after EN rises.','The resulting pulse is shortened, not extended beyond the source high phase.','The waveform creates a new rising edge as well as its normal later fall.'],
    'CLK rises at 2 ns; EN rises at 3 ns. The AND output rises at 3 ns and falls with CLK at 6 ns, producing a shortened 3 ns pulse.',wave('Raw clock-gating inputs',8,[sig('CLK',[[0,0],[2,1],[6,0]]),sig('EN',[[0,0],[3,1]])],[{time:3,signal:1,label:'EN rises inside high phase'}]),'GCLK rises at 3 ns, falls at 6 ns');
  add('pwr',4,'Add wake-up energy','With the marked operating schedule, what average power includes active, idle and wake-up contributions?',
    ['254 mW','204 mW','250 mW','1.05 W'],0,
    ['Active and idle 204 mW combined with 50 mW wake-up cost gives 254 mW.','This omits wake-up energy.','This omits the 4 mW weighted idle contribution.','This treats the active watt as present all the time.'],
    '0.2*1 W+0.8*5 mW+50 uJ*1000/s=200+4+50=254 mW.',circuit('power-header','Power-gated operating schedule',['Active: 20% at 1 W; idle: 80% at 5 mW','Wake cost: 50 uJ, 1000 wakes/s']), 'Average = 200 + 4 + 50 = 254 mW');
  add('seq',1,'Measure setup slack on the axis','The capture flop needs 1 ns setup. From the marked data and capture edges, what is setup slack?',
    ['1 ns','2 ns','-1 ns','5 ns'],0,
    ['Data arrives 2 ns before capture, leaving 1 ns after the requirement.','This is the available interval before subtracting setup.','The data arrives earlier than required, not later.','This is the absolute capture time.'],
    'Data is stable at 3 ns, capture is 5 ns, and setup is 1 ns: slack=5-3-1=1 ns.',wave('Setup measurement',8,[sig('D',[[0,0],[3,1]]),sig('CLK',[[0,0],[5,1],[7,0]])],[{time:3,signal:0,label:'D settles'},{time:5,signal:1,label:'capture; setup 1 ns'}]),'Setup slack = 5 - 3 - 1 = +1 ns');
  add('seq',2,'Measure hold slack on the axis','The hold requirement is 1 ns. What hold slack follows from the shown new-data transition?',
    ['-0.5 ns','+0.5 ns','+1.5 ns','-1.5 ns'],0,
    ['New data arrives 0.5 ns after capture, short of the 1 ns requirement.','This is the elapsed time before subtracting required hold.','This adds the hold requirement instead of subtracting it.','This incorrectly subtracts both the elapsed interval and the hold requirement.'],
    'Capture is 4 ns; new data arrives 4.5 ns. Hold slack=(4.5-4)-1=-0.5 ns.',wave('Hold measurement',8,[sig('CLK',[[0,0],[4,1],[6,0]]),sig('D',[[0,0],[4.5,1]])],[{time:4,signal:0,label:'capture; hold 1 ns'},{time:4.5,signal:1,label:'new data'}]),'Hold slack = 0.5 - 1 = -0.5 ns');
  add('seq',3,'Read capture-minus-launch skew','What is capture-minus-launch clock skew from the marked edges?',
    ['+0.5 ns','-0.5 ns','+4.5 ns','0 ns'],0,
    ['Capture arrives 0.5 ns later than launch.','This uses launch-minus-capture instead.','Adding the arrival times is not skew.','The separate clock paths do not arrive simultaneously.'],
    'Launch is 2 ns and capture is 2.5 ns. Skew=2.5-2=+0.5 ns.',wave('Clock arrivals',4,[sig('launch',[[0,0],[2,1],[3,0]]),sig('capture',[[0,0],[2.5,1],[3.5,0]])],[{time:2,signal:0,label:'launch 2 ns'},{time:2.5,signal:1,label:'capture 2.5 ns'}]),'Capture - launch = +0.5 ns');
  add('seq',4,'Read latch borrowing budget','The latch is transparent while EN is high. With 0.5 ns setup to closing, what is the latest legal D arrival in the displayed cycle?',
    ['5.5 ns','6.5 ns','2.5 ns','6 ns'],0,
    ['Subtract the setup requirement from the 6 ns closing edge.','This arrives after the latch closes.','This references the opening edge rather than the closing edge.','This ignores the required setup margin.'],
    'The transparent interval is 2 ns to 6 ns. D must settle by 6-0.5=5.5 ns.',wave('Latch transparent interval',8,[sig('EN',[[0,0],[2,1],[6,0]])],[{time:2,signal:0,label:'opens'},{time:6,signal:0,label:'closes; setup 0.5 ns'}]),'Latest D = 6 - 0.5 = 5.5 ns');
  add('cdc',1,'Identify an incoherent bus capture','The figure shows two destination bits after independent synchronizers. The source changed directly from 00 to 11. Which intermediate word is visible?',
    ['01','10','00 only','11 only'],0,
    ['Bit 0 arrives before bit 1, producing 01 between the two transitions.','The shown order has bit 0 first, not bit 1.','The first bit has already changed during the intermediate interval.','The second bit has not yet changed during the intermediate interval.'],
    'Destination bit 0 rises at 2 ns and bit 1 at 4 ns. Between them, [bit 1 bit 0]=01, a word never sent by the source.',wave('Independent bus synchronizer outputs',6,[sig('bit 0',[[0,0],[2,1]]),sig('bit 1',[[0,0],[4,1]])],[{time:2,signal:0,label:'bit 0 arrives'},{time:4,signal:1,label:'bit 1 arrives'}]),'Between 2 ns and 4 ns: word 01');
  add('cdc',2,'Read the payload hold interval','In this bundled-data transfer, the source may release data only after returned acknowledgement. What minimum hold interval is shown from request assertion?',
    ['6 ns','2 ns','4 ns','8 ns'],0,
    ['Returned acknowledgement is 6 ns after request.','This is the request assertion time.','This stops at the destination acknowledgement rather than its returned copy.','This is the absolute returned-acknowledgement time.'],
    'REQ rises at 2 ns. ACK returned to the source rises at 8 ns. The source must hold for at least 8-2=6 ns, plus any additional protocol requirement.',wave('Handshake return latency',10,[sig('REQ',[[0,0],[2,1],[9,0]]),sig('ACK dest',[[0,0],[6,1]]),sig('ACK source',[[0,0],[8,1]])],[{time:2,signal:0,label:'payload held from here'},{time:8,signal:2,label:'source sees completion'}]),'Required shown hold = 8 - 2 = 6 ns');
  add('cdc',3,'Calculate available resolution time','From the marked first-stage launch and second-stage setup deadline, what resolution time is available?',
    ['0.8 ns','1.0 ns','0.2 ns','1.2 ns'],0,
    ['Resolution runs from 0.1 ns to the 0.9 ns deadline.','This incorrectly uses a whole period and ignores clock-to-Q and setup.','This sums the two overhead terms rather than finding the remaining window.','This adds overhead to the period.'],
    'The marked first-stage response begins 0.1 ns after launch. The second-stage deadline is 0.9 ns. Available resolution=0.9-0.1=0.8 ns.',wave('Synchronizer resolution window',1.2,[sig('Q1 response',[[0,0],[0.1,'x'],[0.9,1]]),sig('second CLK',[[0,0],[1,1],[1.1,0]])],[{time:0.1,signal:0,label:'first-stage response 0.1 ns'},{time:0.9,signal:1,label:'setup deadline 0.9 ns'}]),'Resolution window = 0.8 ns');
  add('cdc',4,'Read Gray transition distance','Read the two annotated adjacent Gray pointer words. How many bits change?',
    ['1','2','3','4'],0,
    ['Only the third bit from the left (second from the right) differs.','This counts one unchanged bit as a transition.','Three bits are unchanged.','The words are not complements.'],
    '0110 XOR 0100=0010, which has one set bit. This is a code property, not by itself a complete CDC timing constraint.',circuit('async-fifo','Adjacent Gray pointer states',['Old Gray = 0110','New Gray = 0100']), '0110 XOR 0100 = 0010: one change');
  add('mem',1,'Read the bitline development budget','With the figure values and constant discharge current, how long is needed to develop the required bitline differential?',
    ['400 ps','200 ps','800 ps','4 ns'],0,
    ['C times required voltage divided by current gives 400 ps.','This halves the shown capacitance or swing without justification.','This doubles the single moving-bitline requirement.','This is a factor-of-ten unit conversion error.'],
    't=C*DeltaV/I=100 fF*80 mV/20 uA=400 ps. This idealized estimate excludes current variation and sense-enable overhead.',circuit('sense-amplifier','Bitline signal-development case',['Moving bitline C = 100 fF','Required DeltaV = 80 mV','Discharge current = 20 uA']), '100 fF x80 mV /20 uA =400 ps');
  add('mem',2,'Compare access and pull-down strength','Using the marked W/L values, what is the SRAM cell ratio (pull-down W/L)/(access W/L)?',
    ['1.5','0.667','2.0','3.0'],0,
    ['The marked pull-down ratio 3 divided by access ratio 2 gives 1.5.','This is the inverse of the requested cell ratio.','This is the access W/L alone.','This is the pull-down W/L alone.'],
    'Pull-down W/L=150/50=3; access W/L=100/50=2. Cell ratio=3/2=1.5. Width ratio is a sizing descriptor, not a complete read-stability proof.',circuit('sram6t','SRAM geometry example',['Pull-down W/L = 150/50 nm','Access W/L = 100/50 nm']), 'Cell ratio = 3/2 =1.5');
  add('mem',3,'Subtract keeper contention','Use the annotated constant currents. How long does the selected ROM bitline take to fall by the target swing?',
    ['2 ns','1.5 ns','1 ns','3 ns'],0,
    ['Net discharge is 15 uA; 30 fC of charge requires 2 ns.','This ignores keeper opposition and uses 20 uA.','This doubles the net discharge current.','This assumes 10 uA net current rather than the shown 15 uA.'],
    'Net current=20-5=15 uA. Required charge=100 fF*0.30 V=30 fC. Time=30 fC/15 uA=2 ns.',circuit('nor-rom','Selected ROM discharge',['Cbitline = 100 fF; target fall = 0.30 V','Icell = 20 uA; Ikeeper = 5 uA']), 'Net 15 uA; read time 2 ns');
  add('mem',4,'Sequence a read without premature sensing','According to the displayed read controls, how much time is available between wordline assertion and sense enable?',
    ['3 ns','2 ns','5 ns','7 ns'],0,
    ['Sense enable at 5 ns follows wordline assertion at 2 ns by 3 ns.','This is the wordline assertion time.','This is the absolute sense-enable time.','This adds the two event times.'],
    'The bitline has 5-2=3 ns to develop after the wordline rises. Whether that is sufficient requires current, capacitance and offset conditions.',wave('SRAM read controls',8,[sig('precharge',[[0,1],[1,0]]),sig('WL',[[0,0],[2,1],[7,0]]),sig('SAE',[[0,0],[5,1],[7,0]])],[{time:2,signal:1,label:'WL rises'},{time:5,signal:2,label:'sense enabled'}]),'Development interval =3 ns');
  add('int',1,'Calculate a floating victim step','For a floating victim with the annotated capacitances, what initial voltage step follows from the aggressor transition? Ignore resistive restoration.',
    ['0.20 V','0.60 V','0.30 V','0.15 V'],0,
    ['The coupling fraction is 2/(2+4), applied to the 0.60 V aggressor swing.','This assumes perfect coupling with no ground capacitance.','This omits coupling capacitance from the denominator.','This uses an incorrect one-quarter divider.'],
    'Charge conservation gives DeltaVvictim=Cc/(Cc+Cg)*DeltaVagg=2/6*0.60=0.20 V.',circuit('coupled-wire','Floating-victim coupling model',['Cc to aggressor = 2 fF; Cg = 4 fF','Aggressor rises by 0.60 V','Victim floating during initial step']), 'Victim step =2/6 x0.60 =0.20 V');
  add('int',2,'Read a supply-drop budget','Using the annotated power and allowed ripple, what target impedance follows from DeltaV/DeltaI, treating the full load current as the step?',
    ['1 milliohm','10 milliohm','0.1 ohm','0.01 milliohm'],0,
    ['Power/supply gives 100 A and 0.1 V/100 A=1 milliohm.','This divides by 10 A instead of the marked 100 A load.','This is 100 times the allowed impedance.','This is one hundredth of the required impedance.'],
    'I=P/V=100 W/1 V=100 A. Allowed ripple=0.10 V. Ztarget=0.10/100=0.001 ohm.',circuit('power-grid','Supply impedance budget',['Pload = 100 W; VDD = 1.0 V','Allowed ripple = 0.10 V','Use full 100 A step']), 'Ztarget =0.10 V /100 A =1 milliohm');
  add('int',3,'Read pulse duty before computing RMS','The pulse repeats every 8 ns. With the marked high current and zero current otherwise, what is RMS current?',
    ['10 mA','5 mA','20 mA','40 mA'],0,
    ['Duty is 2/8=0.25, so RMS=20*sqrt(0.25)=10 mA.','This is average current, not RMS.','This is the peak current.','RMS cannot exceed this nonnegative pulse train peak.'],
    'The 20 mA pulse lasts 2 ns in an 8 ns period. Irms=Ipeak*sqrt(duty)=20*0.5=10 mA; average is 5 mA.',wave('Periodic rail-current indicator',8,[sig('I =20 mA',[[0,1],[2,0]])],[{time:0,signal:0,label:'20 mA high; 0 mA low'},{time:2,signal:0,label:'pulse ends; repeat at 8 ns'}]), 'Duty 1/4; Irms 10 mA; Iavg 5 mA');
  add('int',4,'Calculate local inductive droop','Use only the marked L*dI/dt contribution. What voltage magnitude accompanies the shown current ramp?',
    ['0.10 V','1.0 V','0.01 V','10 V'],0,
    ['20 pH times 5 A/ns gives 0.10 V.','This overstates the result by a factor of ten.','This understates the current slew or inductance by a factor of ten.','This is a hundredfold unit conversion error.'],
    'The current through L changes by 10 A in 2 ns, giving 5e9 A/s. L*dI/dt=20e-12 H*5e9 A/s=0.10 V. Decoupling can make this branch current differ from instantaneous load current; the question specifies the branch current.',circuit('supply-inductor','Package inductive transient',['Path L = 20 pH','Current through L: 0 A ->10 A in 2 ns','Ignore resistive loss for this question']), 'L*dI/dt =0.10 V');
  add('var',1,'Separate common and local variation','For the two marked delay equations, what is d1-d2?',
    ['L1-L2','2G+L1+L2','G+L1-L2','0 for every sample'],0,
    ['Subtracting cancels identical mean and global terms.','This resembles the variable terms of the sum, not the difference.','The equal additive global term cancels completely.','Independent local terms generally differ.'],
    'With d1=mu+G+L1 and d2=mu+G+L2, subtraction leaves L1-L2. Unequal global sensitivity would invalidate exact cancellation.',blocks('Two nominally matched delay paths',['IN','P1','P2','OUT1','OUT2'],[['IN','P1'],['IN','P2'],['P1','OUT1'],['P2','OUT2']],{P1:'Delay path 1',P2:'Delay path 2'},['d1 = mu + G + L1','d2 = mu + G + L2','G identical; L1, L2 independent']), 'd1-d2 = L1-L2; G cancels');
  add('var',2,'Scale mismatch with area','Under the marked Pelgrom model, what is the new sigma after the shown area change?',
    ['3 mV','1.5 mV','6 mV','12 mV'],0,
    ['Quadrupling area halves sigma.','This treats sigma as inversely proportional to area instead of square root of area.','This ignores the changed area.','Larger area reduces mismatch in the stated model.'],
    'sigma scales as 1/sqrt(area). With area multiplied by 4, sigma becomes 6 mV/2=3 mV.',circuit('mirror','Matched-pair area change',['Original sigma = 6 mV','New device area =4 x original','Use sigma proportional to 1/sqrt(area)']), 'New sigma =6/sqrt(4) =3 mV');
  add('var',3,'Interpret a zero-failure experiment','Using the annotated trial count and the approximate 95% rule-of-three bound, what upper failure-probability bound is supported?',
    ['About 0.003','Exactly 0','About 0.000001','About 0.03'],0,
    ['The rule-of-three gives 3/1000=0.003.','Zero observed failures do not establish zero true probability.','A one-in-a-million claim is not supported by this sample size.','This is the rule-of-three result for 100 trials, not 1000.'],
    'For independent Bernoulli trials and zero failures, the approximate 95% upper bound is 3/N=0.003. The exact value is 1-0.05^(1/1000).',circuit('memory-array','Hypothetical Monte Carlo log',['Independent trials N =1000','Observed failures =0','Use approximate 95% rule of three']), 'Upper p about 3/1000 =0.003');
  add('var',4,'Combine correlated and independent path terms','Using the annotated gate statistics, what path sigma results? Assume the global term is fully correlated and local terms independent.',
    ['sqrt(1700) ps, about 41.2 ps','sqrt(500) ps, about 22.4 ps','60 ps','20 ps'],0,
    ['Global sigma adds linearly to 40 ps; local variance adds to 100 ps squared.','This treats the fully correlated global component as independent.','This adds all local sigmas linearly too.','This omits part of the stated variation.'],
    'Four gates give global sigma 4*10=40 ps. Local variance is 4*5^2=100 ps^2. Total sigma=sqrt(40^2+100)=sqrt(1700)=41.23 ps.',circuit('logic-chain','Four-gate path variation',['4 gates; each global sigma =10 ps','Each independent local sigma =5 ps','Common global draw; independent local draws']), 'sigma_path =sqrt(40^2 +4x5^2)');
  add('arith',1,'Read multiplier reduction depth','The annotated compressor reduction schedule ends at two rows. How many compressor levels are shown before the final adder?',
    ['4','3','5','2'],0,
    ['There are four reductions: 9 to 6, 6 to 4, 4 to 3, 3 to 2.','This stops one reduction before reaching two rows.','This adds the final carry-propagate adder as a compressor level.','Two levels leave four rows in this schedule.'],
    'Count transformations, not row counts: 9 ->6 ->4 ->3 ->2 contains four compression levels, followed by a separate final adder.',circuit('compressor-tree','Compressor row schedule',['Rows: 9 ->6 ->4 ->3 ->2','Final carry-propagate adder follows']), 'Four compression levels, then final adder');
  add('arith',2,'Compute a modular butterfly','Use the marked input values and positive modulus. What ordered pair (a+t modq, a-t modq), with t=b*w modq, results?',
    ['(0, 10)','(0, -7)','(17, 10)','(8, 2)'],0,
    ['t=12, so17 mod 17=0 and-7 mod 17=10.','The difference must be normalized to the nonnegative residue interval.','A residue equal to the modulus must reduce to zero.','This omits multiplication by the twiddle factor.'],
    't=(3*4)mod 17=12. The butterfly is((5+12)mod 17, (5-12)mod 17)=(0, 10).',circuit('ntt-butterfly','Modular butterfly',['a =5; b =3; w =4; q =17','t =b*w modq; outputs a+t and a-t']), 't12; normalized outputs(0, 10)');
  add('arith',3,'Distinguish throughput from latency','Read the input and result markers for the repeating transaction pattern. What are latency and steady-state throughput?',
    ['3 cycles; 1 result per cycle','1 cycle; 1 result per 3 cycles','3 cycles; 1 result per 3 cycles','1 cycle; 3 results per cycle'],0,
    ['The first result is delayed three cycles while consecutive transactions emerge each cycle.','This exchanges the latency and initiation interval.','Pipelining allows overlapping transactions despite three-cycle latency.','The figure neither shows one-cycle latency nor three outputs per cycle.'],
    'Input transactions arrive at 0, 1, 2 cycles; their outputs occur at 3, 4, 5 cycles. Each sees three-cycle latency, with one result per cycle after filling.',wave('Pipeline transaction markers',6,[sig('input 0',[[0,1],[0.5,0]]),sig('input 1',[[0,0],[1,1],[1.5,0]]),sig('result 0',[[0,0],[3,1],[3.5,0]]),sig('result 1',[[0,0],[4,1],[4.5,0]])],[],'cycle'),'Latency 3 cycles; initiation interval 1');
  add('arith',4,'Read barrel-shifter stage count','Each marked mux stage optionally shifts by its label. What unsigned shift range can this three-stage network select?',
    ['0 through 7 positions','0 through 3 positions','1 through 4 positions only','0 through 8 positions'],0,
    ['Independent choices of 1, 2 and 4 generate every integer 0 to 7.','This confuses stage count with maximum composed shift.','Zero and combinations of stages are valid selections.','The largest sum is 1+2+4=7, not 8.'],
    'Optional shifts 1, 2 and 4 compose a 3-bit shift amount. Minimum 0; maximum 7.',circuit('barrel-shifter','Optional stage shifts',['Stage 0: shift 0 or 1','Stage 1: shift 0 or 2','Stage 2: shift 0 or 4']), 'Selected shift =b0+2b1+4b2: 0..7');
  add('rtl',1,'Trace simultaneous nonblocking updates','For the annotated pre-edge state and assignments, what is the post-edge pair (a, b)?',
    ['(0, 1)','(0, 0)','(1, 1)','(1, 0)'],0,
    ['Each right-hand side reads old state, so the values swap.','This incorrectly lets the new a feed b during the same edge.','This incorrectly lets the new b feed a during the same edge.','This leaves both registers unchanged despite the assignments.'],
    'Old a=1 and old b=0. Nonblocking assignments schedule a<-old b=0 and b<-old a=1.',circuit('register-swap','Two-register state exchange',['Q1 is a; Q2 is b','Before edge: a=1, b=0','At edge: a <=b; b <=a;']), 'After edge: (a, b) =(0, 1)');
  add('rtl',2,'Count encoding bits','For the marked FSM state count, what minimum binary state-register width is needed?',
    ['3 bits','2 bits','6 bits','4 bits'],0,
    ['Three bits encode eight patterns, enough for six states.','Two bits encode only four states.','Six bits would describe a one-hot choice, not minimum binary width.','Four bits encode sixteen states and exceed the minimum.'],
    'ceil(log2(6))=3. The unused binary encodings still need defined recovery or verification treatment.',circuit('pipeline','FSM state-register requirement',['Reachable logical states =6','Use minimum binary encoding']), 'ceil(log2(6)) =3 bits');
  add('rtl',3,'Read FIFO backlog from rates','Using the annotated burst and service schedule, what backlog accumulates during the burst, assuming an initially empty FIFO?',
    ['60 words','30 words','120 words','0 words'],0,
    ['The 600 ns burst writes 120 and reads 60, leaving 60.','This incorrectly treats the reader as active every 150 MHz cycle.','This ignores simultaneous reading.','The effective reader rate is below the writer rate.'],
    'Burst duration=120/200 MHz=600 ns. Effective read rate=150 MHz*(2/3)=100 Mword/s, giving 60 reads. Backlog=120-60=60 words; implementation adds CDC/flag margins.',circuit('async-fifo','FIFO burst schedule',['Write: 120 words at 200 MHz','Read: 150 MHz, enabled 2/3 cycles','Initially empty; ideal continuous rates']), '120 writes -60 reads =60-word backlog');
  add('rtl',4,'Read validity before using state','The payload register is unreset. At which marked interval may a consumer safely use it under the shown valid protocol?',
    ['Only after VALID rises at 4 ns','Immediately after reset falls at 1 ns','During the unknown payload interval','Whenever the clock first toggles'],0,
    ['Known control keeps the payload blocked until initialization and valid assertion.','Reset release alone does not initialize this datapath register.','Unknown payload is intentionally blocked by valid=0.','Clock activity does not establish payload validity.'],
    'The unreset payload is unknown until 3 ns, and VALID remains low until 4 ns. The contract permits consumption only while valid is high.',wave('Unreset datapath validity',6,[sig('reset',[[0,1],[1,0]]),sig('data known',[[0,0],[3,1]]),sig('VALID',[[0,0],[4,1]])],[{time:3,signal:1,label:'initialization completes'},{time:4,signal:2,label:'consumer may use data'}]), 'Meaningful use starts with VALID at 4 ns');
  add('flow',1,'Calculate balanced scan loading time','From the annotated chain count and shift clock, how long does one scan-state load take? Ignore capture and unload.',
    ['10 microseconds','4 milliseconds','20 microseconds','0.5 microseconds'],0,
    ['The longest chain is 500 flops, each shifted every 20 ns.','This treats all flops as one serial chain.','This adds an unload despite the load-only request.','This undercounts the 500 shift cycles.'],
    '200000/400=500 bits per balanced chain. At 50 MHz, 500/50e6=10 us.',blocks('Parallel scan-chain organization',['ATE','CHAINS','OUT'],[['ATE','CHAINS'],['CHAINS','OUT']],{ATE:'Parallel scan inputs',CHAINS:'400 equal scan chains',OUT:'Parallel scan outputs'},['200000 scan flops total','Shift frequency =50 MHz','Chains load simultaneously']), '500 shifts x20 ns =10 us');
  add('flow',2,'Measure useful routing channel width','Use the annotated edge-to-edge gap and facing halos. Assume both halos block routing. What usable channel remains?',
    ['10 micrometers','30 micrometers','20 micrometers','0 micrometers'],0,
    ['Subtract both 10 um halos from the 30 um edge-to-edge gap.','This ignores both blocked halos.','This subtracts only one of the two halos.','The halos consume 20 um, leaving 10 um.'],
    'Usable width=30-10-10=10 um. Whether it is adequate depends on layers, pin access and actual demand.',circuit('floorplan','Two neighboring macro boundaries',['Edge-to-edge gap =30 um','Facing halo on each macro =10 um','Halos are routing blockages']), 'Usable channel =30-10-10 =10 um');
  add('flow',3,'Compare setup and hold after a repair','Apply the marked minimum/maximum delay increments to the initial slacks. What pair (setup, hold) results, with clocks unchanged?',
    ['(-25, +10) ps','(+65, +10) ps','(-10, +25) ps','(+20, +10) ps'],0,
    ['Setup loses 45 ps while hold gains 30 ps.','Added maximum data delay consumes setup slack instead of improving it.','This swaps the minimum and maximum increments.','This ignores the setup effect of the repair.'],
    'Setup=20-45=-25 ps. Hold=-20+30=+10 ps. This repair fixes the stated hold check but breaks setup.',circuit('sta-graph','Candidate delay-cell repair',['Before: setup+20 ps; hold-20 ps','Cell adds min 30 ps, max 45 ps','Clock arrivals unchanged']), 'After: setup-25 ps; hold+10 ps');
  add('flow',4,'Distinguish scan shift and capture','Which interval in the waveform requests functional capture rather than scan shifting?',
    ['The rising clock edge at 7 ns','The rising clock edge at 1 ns','The rising clock edge at 3 ns','Every edge while scan enable is high'],0,
    ['Scan enable is low at the 7 ns clock edge.','Scan enable is high, so this edge shifts the chain.','This also occurs during scan shifting.','High scan enable selects the shift path, not functional capture.'],
    'Scan enable falls at 6 ns. The next rising edge at 7 ns captures through the functional path; earlier edges at 1 and 3 ns shift.',wave('Scan shift followed by capture',8,[sig('CLK',[[0,0],[1,1],[2,0],[3,1],[4,0],[7,1],[7.5,0]]),sig('SCAN_EN',[[0,1],[6,0]])],[{time:6,signal:1,label:'switch to functional path'},{time:7,signal:0,label:'next active edge'}]), '7 ns edge is functional capture');
  add('char',1,'Read a sensitized AOI arc','For the shown AOI21 function, which marked side-input condition sensitizes A to Y?',
    ['B=1, C=0','B=0, C=1','A held fixed','B and C toggle with A'],0,
    ['B=1 and C=0 leave Y=NOT(A), allowing the A transition through.','C=1 forces Y=0 and blocks A regardless of B.','A cannot excite its propagation arc while held fixed.','Simultaneous side-input transitions do not isolate one arc.'],
    'The figure defines Y=NOT(A*B+C). Fixing B=1, C=0 gives Y=NOT(A).',circuit('aoi','Arc sensitization',['Y = NOT(A*B + C)','Characterize A ->Y; choose fixed B, C']), 'B1, C0 gives Y=NOT(A)');
  add('char',2,'Interpolate a table center','The figure lists four delay corners. What is bilinear interpolation at the center of both axes?',
    ['62.5 ps','60 ps','95 ps','35 ps'],0,
    ['At the center, each corner has weight one-quarter.','This misses the asymmetric upper-right corner contribution.','This is the upper-right sample, not an interpolation.','This is the lower-left sample.'],
    'The center weights are equal: (35+55+65+95)/4=62.5 ps. Slew and load coordinates must be ordered consistently.',circuit('standard-cell','Two-by-two Liberty table',['Slew 20/60 ps; load 10/30 fF','d(20, 10)=35; d(60, 10)=55 ps','d(20, 30)=65; d(60, 30)=95 ps']), 'Center delay =250/4 =62.5 ps');
  add('char',3,'Calculate the cell height','Use the marked track count and pitch, ignoring extra rail offsets. What is the cell height?',
    ['168 nm','196 nm','28 nm','6 nm'],0,
    ['Six tracks times 28 nm pitch gives 168 nm.','This counts an extra pitch not included in the stated model.','This is one track pitch.','This treats the dimensionless track count as a length.'],
    'Height=6*28 nm=168 nm under the explicitly stated convention. Real library track definitions and rail placement must be checked.',circuit('standard-cell','Track-based cell-height model',['Height =6 track pitches','Pitch =28 nm','Ignore extra rail offsets']), '6 x28 nm =168 nm');
  add('char',4,'Measure propagation delay from crossings','What propagation delay follows from the marked input and output 50% crossing events?',
    ['35 ps','80 ps','45 ps','125 ps'],0,
    ['Output crossing 80 ps minus input crossing 45 ps gives 35 ps.','This is the absolute output crossing time.','This is the absolute input crossing time.','Adding crossings does not yield propagation delay.'],
    'For the selected matching event, tpd=80-45=35 ps. The event direction and occurrence must belong to the intended arc.',wave('Matched 50% crossing flags',100,[sig('input 50%',[[0,0],[45,1]]),sig('output 50%',[[0,0],[80,1]])],[{time:45,signal:0,label:'input 50% at 45 ps'},{time:80,signal:1,label:'output 50% at 80 ps'}],'ps'),'tpd =80-45 =35 ps');
  add('ana',1,'Calculate loaded small-signal gain','For the marked common-source equivalent, what is the low-frequency voltage gain? Neglect body effect.',
    ['-5 V/V','-10 V/V','+5 V/V','-20 V/V'],0,
    ['The two 10 kohm output resistances are in parallel, giving 5 kohm times -1 mS.','This omits one of the two parallel conductance contributions.','The common-source output moves opposite to the input.','Parallel resistances do not add to 20 kohm.'],
    'Rout=10 kohm||10 kohm=5 kohm. Av=-gm*Rout=-1 mS*5 kohm=-5 V/V.',circuit('common-source','One output-node small-signal equivalent',['Valid saturation bias; gm=1 mS','ro=10 kohm; RD=10 kohm','Source AC-grounded; ignore body effect']), 'Rout 5 kohm; Av=-5 V/V');
  add('ana',2,'Read mirror compliance','The marked output NMOS has the stated overdrive. Which output voltage is below its ideal long-channel saturation boundary?',
    ['0.10 V','0.25 V','0.40 V','0.80 V'],0,
    ['0.10 V is below the 0.20 V overdrive and loses saturation.','0.25 V exceeds the stated overdrive.','0.40 V also exceeds the boundary.','0.80 V is above the minimum saturation voltage.'],
    'With source at ground and VOV=0.20 V, the ideal boundary is Vout=VDS=0.20 V. A 0.10 V output is below it.',circuit('mirror','NMOS mirror compliance',['Output source =0 V','Output VOV=0.20 V','Use VDS >=VOV for saturation']), '0.10 V <0.20 V: below compliance');
  add('ana',3,'Read phase margin at unity gain','The figure annotation gives loop phase at the 0 dB crossing. What phase margin follows using the conventional negative-feedback definition?',
    ['45 degrees','135 degrees','90 degrees','-45 degrees'],0,
    ['Phase margin=180+(-135)=45 degrees.','This is the magnitude of loop phase, not margin to -180 degrees.','This assumes a -90 degree phase without using the annotation.','The crossing is 45 degrees short of -180, so the margin is positive.'],
    'At unity loop gain, PM=180 degrees+angle(L)=180-135=45 degrees. This small-signal margin does not establish large-signal settling by itself.',circuit('opamp2','Loop-gain crossing measurement',['At |L|=1 (0 dB): phase(L)=-135 deg','Conventional negative-feedback sign']), 'Phase margin =180-135 =45 deg');
  add('ana',4,'Integrate a white-noise density','For the marked flat one-sided input-noise density and ideal rectangular bandwidth, what RMS input noise results?',
    ['2 microvolts RMS','0.2 microvolts RMS','20 microvolts RMS','400 microvolts RMS'],0,
    ['20 nV/sqrtHz times sqrt(10000 Hz) gives 2000 nV.','This underestimates the bandwidth square root by ten.','This overestimates the RMS result by ten.','This mixes density and bandwidth without the required square root.'],
    'vrms=en*sqrt(B)=20 nV/sqrtHz*100 sqrtHz=2000 nV=2 uV. Offset and 1/f noise are excluded by the stated model.',circuit('ota5t','Input-referred white-noise model',['Density=20 nV/sqrtHz','Rectangular bandwidth=10 kHz','White noise only; exclude offset']), 'vrms=20 nV x100 =2 uV RMS');
  add('code',1,'Read a Cartesian sweep manifest','How many distinct jobs belong to the sweep matrix annotated in the diagram?',
    ['24','9','12','48'],0,
    ['Multiply independent axis counts: 2*3*4=24.','This adds axis lengths instead of taking their Cartesian product.','This omits one factor of two.','This doubles the intended combinations.'],
    'Each cell has every corner and every load. The manifest therefore contains 2*3*4=24 distinct tuples.',circuit('rtl-gds','Sweep manifest inputs',['2 distinct cells','3 distinct corners','4 distinct loads; full Cartesian product']), 'Expected unique jobs =2x3x4 =24');
  add('code',2,'Normalize values before sorting','Which annotated delay is smallest after converting all three values to seconds?',
    ['Case B','Case A','Case C','All three cases are tied'],0,
    ['40 ps=4e-11 s, smaller than both alternatives.','3 ns=3e-9 s, larger than 40 ps.','1.2 us=1.2e-6 s, largest here.','The prefixes encode distinct scales.'],
    'Convert to SI: 40 ps=4e-11 s; 3 ns=3e-9 s; 1.2 us=1.2e-6 s. Text sorting is not a physical comparison.',circuit('sta-graph','Three parsed delay strings',['Case A: 3 ns; Case B: 40 ps; Case C: 1.2 us','Compare normalized finite values']), 'Ascending: 40 ps, 3 ns, 1.2 us');
  add('code',3,'Audit coverage independently of duplicates','Compare the expected keys with the observed records shown. Which result is correct?',
    ['Missing c; duplicate a; unexpected x','Missing x; duplicate c; unexpected a','No missing keys because four records exist','Only x is a problem'],0,
    ['Set differences find missing c and extra x; record frequency finds duplicate a.','This reverses expected and observed roles.','Raw record count cannot prove unique-key coverage.','A duplicated expected case and a missing expected case are independent defects.'],
    'Expected={a, b, c}; observed=[a, a, b, x]. Missing={c}, unexpected={x}, duplicate={a}. Count and set checks must both run.',circuit('rtl-gds','Regression coverage audit',['Expected keys: a, b, c','Observed records: a, a, b, x']), 'Missing c; duplicate a; extra x');
  add('code',4,'Interpolate a rising threshold crossing','Use linear interpolation between the annotated waveform samples. When does the 0.5 V rising crossing occur?',
    ['2.5 ns','2 ns','3 ns','0.5 ns'],0,
    ['The threshold is halfway from 0.2 V to 0.8 V, so the time is halfway from 2 ns to 3 ns.','This returns the left sample without interpolation.','This returns the right sample without interpolation.','This is the interval from the left point, not the absolute crossing time.'],
    'Fraction=(0.5-0.2)/(0.8-0.2)=0.5. Time=2+0.5*(3-2)=2.5 ns.',wave('Sample timestamps for interpolation',4,[sig('samples',[[0,0],[2,1],[3,0]])],[{time:2,signal:0,label:'sample(2 ns, 0.2 V)'},{time:3,signal:0,label:'sample(3 ns, 0.8 V)'}]), 'Linear 0.5 V crossing at 2.5 ns');
  add('story',1,'Attribute a contribution to the recorded stage','The hypothetical handoff annotations show individual and team scope. Which statement matches that evidence?',
    ['I analyzed STA and recommended the ECO; the physical team implemented it.','I personally implemented the routed ECO.','I owned every stage from RTL through fabrication.','I measured the result on silicon.'],0,
    ['This separates the named analysis/recommendation work from the team implementation.','The annotations assign implementation to another team.','The displayed scope is narrower than the complete flow.','The evidence is a post-route timing report, not a silicon measurement.'],
    'The diagram assigns path analysis and ECO recommendation to the speaker, implementation to the physical team, and verification to a report. Preserve those boundaries. Replace hypothetical details with verified personal facts.',circuit('rtl-gds','Hypothetical contribution record',['You: STA analysis + ECO recommendation','Physical team: implements ECO','Evidence: post-route timing report']), 'Claim analysis/recommendation, not implementation');
  add('story',2,'Keep a metric within its measured scope','Which claim is supported by the hypothetical measurement conditions shown?',
    ['The characterized path delay fell 10% at the stated corner and load.','The entire chip became 10% faster in every condition.','Silicon performance increased 10% at all voltages.','The design is production-qualified.'],0,
    ['The claim retains the measured path, conditions and relative change.','One path and condition do not establish a whole-chip universal improvement.','The stated evidence is simulation, not silicon across all voltages.','A delay comparison alone does not establish qualification.'],
    'The path changes 100 ps to 90 ps, a 10% reduction. Its scope remains one simulated corner/load with the stated model revision.',circuit('sta-graph','Hypothetical measured comparison',['One path: 100 ps baseline ->90 ps new','Same corner/load/model revision','Evidence: simulation, not silicon']), '10% path-delay reduction at tested condition');
  add('story',3,'Choose the missing evidence for a design claim','The annotations show a proposed topology and a nominal result. Which next artifact most directly tests the claimed robust operation?',
    ['A defined corner and mismatch verification matrix with failures retained','A polished diagram with the same nominal number','A claim that similar circuits usually work','A renamed nominal output file'],0,
    ['Robustness requires testing the stated conditions and retaining failure evidence.','Presentation does not expand operating-condition coverage.','Analogy is not verification of this circuit.','Renaming an existing result adds no new evidence.'],
    'The figure has a nominal result but no corner/mismatch evidence. A declared verification matrix tests the broader robustness claim without inventing a result.',circuit('ota5t','Hypothetical analog design evidence',['Proposed claim: robust across PVT/mismatch','Available evidence: one nominal run','Corner/mismatch checks: not yet run']), 'Next: declared PVT/mismatch verification matrix');
  add('story',4,'Separate a recommendation from a proven repair','What should the speaker say about the hypothetical timing ECO at the last marked stage?',
    ['I proposed the buffer; full setup/hold revalidation was still pending.','The timing problem was fully closed across all corners.','The buffer was already measured on silicon.','The whole design had passed signoff.'],0,
    ['This matches the recorded completion boundary without advancing the status.','Revalidation is explicitly pending.','No silicon measurement appears in the record.','A proposal is earlier than full signoff.'],
    'The displayed sequence stops after proposal, before revalidation. Describe the work completed and the remaining check separately; do not turn a plausible fix into a measured outcome.',wave('Hypothetical ECO evidence timeline',4,[sig('reproduced',[[0,0],[1,1]]),sig('proposed',[[0,0],[2,1]]),sig('retested',[[0,0]])],[{time:3,signal:2,label:'still pending at handoff'}],'stage'),'Proposed repair; revalidation still pending');
  T.addQ(out); T._all=null; T._byId=null;
})();
