/* Authored visual curriculum. Existing figures are preserved; these figures
 * connect each lesson to its actual structure and changing electrical state. */
(function () {
  const T = window.T;
  // Original course figures lead the arithmetic overview; generated diagrams
  // remain available underneath for practice. Exact source crops are preserved.
  T.domainLectureFigures = {
    arith: [
      ['eecs427-lecture-packet-p47-1.png','Read the black-cell, gray-cell and buffer definitions before following a prefix tree.'],
      ['eecs427-lecture-packet-p47-3.png','Kogge–Stone: trace the increasing group spans and notice the dense wiring.'],
      ['eecs427-lecture-packet-p47-4.png','Brent–Kung: follow the reduction and distribution paths. Its smaller network trades wiring and cell count for additional depth.'],
      ['eecs427-lecture-packet-p48-2.png','Compare logic depth, fanout and wiring before choosing an adder architecture.'],
      ['eecs427-lecture-packet-p135-3.png','Booth recoding: read each overlapping three-bit group and select 0, ±Y or ±2Y; Y is the multiplicand.'],
      ['eecs427-lecture-packet-p135-4.png','Follow the Booth encoder controls into the partial-product selector.'],
      ['eecs427-lecture-packet-p132-2.png','Carry-save reduction: three equal-weight inputs become a sum and a carry of doubled weight.'],
      ['eecs427-lecture-packet-p138-2.png','Trace a concrete Wallace reduction tree through its half/full adders and final carry-propagating adder.']
    ].map(([file,cap])=>{
      const slide=(window.TAPEOUT_SLIDES || []).find(s=>s.f.endsWith('/'+file));
      if(!slide)throw new Error('Missing arithmetic lecture figure '+file);
      return {src:slide.f,alt:slide.cap,cap,from:'EECS '+slide.lec.replace('-',' lecture ')+', packet p. '+slide.pg};
    })
  };
  T.lessonSlideSelections = {'arith-adders':T.domainLectureFigures.arith.slice(0,4).map(f=>f.src)};
  const S = (id, cap, spec) => ({ schematic: id, cap, ...(spec ? {spec} : {}) });
  const P = (id, cap) => ({ plot: id, cap: 'Computed teaching model. ' + cap });
  const W = (id, cap) => S(id, 'Illustrative timing sequence. ' + cap);
  const pairs = {
    'seq-latch-ff': [S('master-slave','Trace the two storage stages and their opposite clock phases.'), W('timing-borrowing','Compare a transparent interval with capture at the closing edge.')],
    'seq-setup-hold': [S('sta-graph','Separate launch, data and capture paths before assigning skew signs.'), W('timing-setup-hold','Read the stable-data windows around the capture edge.')],
    'seq-clocking': [S('icg','The enable latch isolates the active clock phase from enable changes.'), W('timing-gating','The stored enable changes only while the clock is low.')],
    'seq-sta': [S('sta-graph','A timing check compares an arrival path with its required-time path.'), W('timing-setup-hold','Maximum-delay and minimum-delay checks use different data arrivals.')],
    'cmos-foundations': [S('inverter','Trace the complementary paths between the output and each supply.'), P('vtc','Compare output restoration and the switching threshold.')],
    'rc-delay': [S('rc-pi','Identify the resistance and the capacitances charged through it.'), P('rcstep','The half-supply crossing occurs at ln(2) times RC.')],
    'gate-sizing': [S('nand','Two series pull-down devices must share the drive-resistance budget.'), P('idvds','Drive depends on terminal voltage as well as width; matched resistance is an approximation.')],
    'gate-power': [S('inverter','The pull-up charges the output capacitance and the pull-down discharges it.'), P('dvfs-power','Compare frequency scaling at fixed supply with voltage-and-frequency scaling.')],
    'leakage-mechanisms': [S('nand','An off-device stack changes internal bias and leakage paths.'), P('leakage-vt-temp','Track the sensitivity of off-current to threshold and temperature.')],
    'logical-effort': [S('pipeline','Identify successive driven stages and the load boundary; registers here mark path boundaries.'), P('stages','Changing stage count trades effort per stage against parasitic delay.')],
    'sram-operation': [S('sram6t','Distinguish access, pull-down and pull-up devices before following read and write current.'), W('timing-sram-read','Precharge precedes wordline assertion and sensing.'), W('timing-sram-write','Apply differential write data before opening the access devices.')],
    'sram-margins': [S('sram6t','Read stability and write ability constrain different device ratios.'), P('butterfly-snm','The butterfly construction measures static noise margin in the stated transfer-curve model.')],
    'bitline-sensing': [S('precharge-equalize','Precharge establishes common mode; equalization removes residual differential.'), P('bitline','Sense enable needs enough developed differential to overcome offset and noise.')],
    'rom-read-margins': [S('nor-rom','Follow the keeper and selected discharge paths competing at the same bitline.'), W('timing-domino','Separate precharge from evaluation before defining the available read time.')],
    'latch-storage': [S('tg-latch','The input and feedback transmission gates operate on opposite phases.'), W('timing-borrowing','A latch passes changes within its transparent phase, then holds state.')],
    'setup-hold': [S('sta-graph','Identify which clock arrival belongs to launch and which belongs to capture.'), W('timing-setup-hold','Derive required times from the capture edge rather than memorizing a skew sign.')],
    'sequential-characterization': [S('master-slave','Internal storage and clock paths create the measured capture boundary.'), P('pushout','A clock-to-Q degradation criterion differs from a functional pass/fail cliff.')],
    'metastability': [S('synchronizer','The first stage receives asynchronous data; the second samples after resolution time.'), W('timing-metastability','An uncertain first-stage interval is not a stable third logic value.')],
    'cdc-protocols': [S('handshake','Control crosses safely while the payload remains stable until acknowledgement.'), W('timing-handshake','Follow request, acknowledgement and the payload hold interval.')],
    'physical-layout': [S('cell-layout','Inspect diffusion, poly, contacts and routing as distinct physical layers.'), P('wire','Added wire length changes delay even when connectivity is unchanged.')],
    'wire-rc': [S('rc-pi','Distributed wire capacitance loads different resistive segments.'), P('elmore-response','Compare a distributed ladder response with a one-pole approximation.')],
    'coupling-noise': [S('rc-pi','Use the interconnect network to identify the vulnerable receiving node.'), P('crosstalk-glitch','A coupled transient depends on aggressor slew and victim restoration.')],
    'power-delivery': [S('power-grid','Trace the supply network from its connection points toward distributed loads.'), P('ir-heatstrip','Voltage loss accumulates with current and path resistance in the stated grid model.')],
    'em-aging': [S('power-grid','Current crowds into shared supply segments and vias.'), P('em-lifetime','Compare current-density sensitivity at a fixed stated temperature.')],
    'spice-testbench': [S('inverter','Name the stimulus, load, supplies and measured output node.'), P('rcstep','A crossing is a threshold event on a waveform, not merely a simulator exit code.')],
    'liberty-tables': [S('nand','Hold the other input in a sensitizing state to measure one propagation arc.'), P('liberty-surface','Delay depends on both input slew and output load; inspect axis orientation.')],
    'variation-types': [S('mirror','Nominally matched devices can share a global shift while retaining local mismatch.'), P('mc-histogram','Read the model mean and sigma markers; a histogram is not proof of a rare tail.')],
    'leakage-characterization': [S('nand','Input state selects which devices are off and how internal nodes bias the stack.'), P('leakage-vt-temp','A leakage table must retain its bias, temperature and model conditions.')],
    'tcl-language': [S('rtl-gds','Tool commands operate on distinct representations and object collections in this flow.'), {waveform:{title:'Illustrative command phases',duration:4,unit:'step',ticks:[0,1,2,3,4],signals:[{name:'parse',points:[[0,1],[1,0]]},{name:'substitute',points:[[0,0],[1,1],[2,0]]},{name:'execute',points:[[0,0],[2,1],[3,0]]}],annotations:[{time:1,signal:1,label:'braces suppress first-pass substitution'}]},cap:'Illustrative interpreter sequence. Keep parsing, substitution and command evaluation distinct.'}],
    'report-parsing': [S('sta-graph','A parsed timing record should retain the path, arrival and required-time identities.'), {waveform:{title:'Measurement status before numeric comparison',duration:4,unit:'step',ticks:[0,1,2,3,4],signals:[{name:'complete',points:[[0,0],[1,1]]},{name:'metric',points:[[0,0],[2,1]]},{name:'usable',points:[[0,0],[3,1]]}],annotations:[{time:2,signal:1,label:'missing is not zero'}]},cap:'Illustrative validation sequence. A completed run is not yet a validated measurement.'}],
    'automation-audit': [S('rtl-gds','Preserve run identity across tool stages and compare outputs with the intended inputs.'), {waveform:{title:'Audit gates',duration:4,unit:'step',ticks:[0,1,2,3,4],signals:[{name:'manifest',points:[[0,0],[1,1]]},{name:'complete',points:[[0,0],[2,1]]},{name:'coverage',points:[[0,0],[3,1]]}]},cap:'Illustrative audit sequence. Verify expected coverage independently of run completion.'}],
    'low-power-domains': [S('level-shifter','Trace low-domain control into a cross-coupled high-domain output stage.'), W('timing-gating','The control protocol must preserve complete clock pulses.')],
    'adaptive-voltage': [S('sta-graph','A replica or in-situ monitor represents a timing path whose margin must be tracked.'), P('dvfs-power','Adaptation trades dynamic power against a voltage-dependent timing limit.')],
    'compute-in-memory': [S('memory-array','Separate storage, row selection, column accumulation and sensing.'), P('bitline','Finite signal-development time and sense offset constrain current-domain accumulation.')],
    'analog-gm-ro': [S('ota5t','Identify the biased transconductance devices and the finite-resistance output node.'), P('gm-id','Transconductance efficiency varies with inversion level; it is not a constant process number.')],
    'analog-differential-pair': [S('ota5t','Trace equal and opposite branch-current changes around the tail bias.'), P('idvds','Output-device headroom determines whether the small-signal gain model remains valid.')],
    'analog-current-mirrors': [S('mirror','The reference device establishes gate bias; the output device still needs compliance voltage.'), P('idvds','Inspect the departure from saturation at low output voltage.')],
    'analog-feedback-stability': [S('opamp2','Locate both gain stages and the Miller compensation path.'), P('bode-margin','Measure phase margin at the loop-gain unity crossing.'), P('step-ringing','Damping connects frequency-domain margin to the small-signal transient response.')],
    'analog-noise-offset': [S('ota5t','Input-pair mismatch and device noise are different sources of input-referred error.'), P('mc-histogram','An ensemble spread and a shifted mean represent distinct error statistics.')],
    'analog-sampling-adc': [S('transmission-gate','A sampling switch transfers charge to a storage node during acquisition.'), P('rcstep','The remaining settling error decreases exponentially, not linearly with time.')],
    'rtl-sequential-semantics': [S('pipeline','Each register marks a state boundary; source-code order does not erase it.'), W('timing-scan','Follow how old state advances one storage boundary at a clock edge.')],
    'rtl-cdc-handshake': [S('handshake','The payload and synchronization control have different crossing contracts.'), W('timing-handshake','Do not release the held payload before protocol completion.')],
    'rtl-reset-verification': [S('synchronizer','Reset release is synchronized before normal sequential operation.'), W('timing-metastability','A transition near an active edge motivates recovery/removal and release checks.')],
    'physical-timing-repair': [S('sta-graph','A data-path repair affects both the maximum and minimum arrival paths.'), W('timing-setup-hold','Check setup and hold after the repair under one declared skew convention.')],
    'physical-parasitics-congestion': [S('floorplan','Macros, halos and channels constrain actual routes.'), P('wire','Routed detours can dominate a cell-sizing improvement.')],
    'physical-scan-test': [S('pipeline','Scan converts storage elements into controllable serial paths for test.'), W('timing-scan','Separate shift activity from functional-speed capture.')],
    'story-method': [S('rtl-gds','Place a contribution at a precise stage and name its input and delivered artifact.'), {waveform:{title:'Hypothetical project evidence timeline',duration:4,unit:'stage',ticks:[0,1,2,3,4],signals:[{name:'baseline',points:[[0,1],[1,0]]},{name:'change',points:[[0,0],[1,1],[2,0]]},{name:'retest',points:[[0,0],[2,1],[3,0]]},{name:'handoff',points:[[0,0],[3,1]]}]},cap:'Illustrative project sequence, not personal history. Distinguish your change from the later team outcome.'}],
    'rtl-fsm-fifo': [S('async-fifo','Separate storage, pointer generation and synchronized pointer comparison.'), W('timing-fifo','Gray-pointer transitions and synchronization latency affect flags.')],
    'rtl-puzzles': [S('barrel-shifter','A staged network trades mux depth against wiring and control complexity.'), W('timing-scan','Trace state changes across edges before deriving a sequential shortcut.')],
    'flow-rtl-to-gds': [S('rtl-gds','Each stage transforms an artifact and adds checks rather than replacing earlier evidence.'), P('shmoo','A pass/fail region is meaningful only for the declared voltage/frequency test and conditions.')],
    'arith-adders': [S('booth','Separate partial-product generation, compression and final carry propagation.'), {waveform:{title:'Illustrative arithmetic pipeline latency',duration:5,unit:'cycle',ticks:[0,1,2,3,4,5],signals:[{name:'input valid',points:[[0,1],[1,0]]},{name:'reduced',points:[[0,0],[1,1],[2,0]]},{name:'sum valid',points:[[0,0],[2,1],[3,0]]}]},cap:'Illustrative pipeline sequence. Latency counts stages; throughput counts how often a new input can enter.'}],
    'char-std-cell': [S('standard-cell','Rails, routing tracks and pin access constrain a reusable cell template.'), P('liberty-surface','A library timing model connects that cell to its slew and load environment.')],
    'dev-short-channel': [S('inverter','Short-channel device behavior changes both off-state leakage and on-state drive in this circuit.'), P('id-vgs','Compare drain-bias-dependent transfer curves within the declared teaching model.')],
    'cmos-dynamic': [S('domino','Trace precharge, evaluation, keeper feedback and the output inversion separately.'), W('timing-domino','Dynamic charge is reset during precharge and conditionally removed during evaluation.')]
  };
  for (const u of T.units) {
    if (!pairs[u.id]) throw new Error('Missing visual lesson mapping: ' + u.id);
    u.figs = [...(u.figs || []), ...pairs[u.id]];
  }
  T.domainFigures = {
    dev:[S('inverter','Connect terminal biases to circuit action.'),P('id-vgs','Compare bias-dependent transfer curves.'),P('gm-id','Compare transconductance efficiency.')],
    cmos:[S('nand','Trace series pull-down and parallel pull-up paths.'),S('nor','Compare the complementary arrangement.'),S('domino','Identify stored dynamic charge and keeper feedback.'),P('vtc','Observe voltage restoration.')],
    dly:[S('rc-pi','Place capacitance along the resistive path.'),P('rcstep','Find threshold crossings.'),P('stages','Balance stage effort and parasitics.')],
    pwr:[S('power-header','Disconnect the virtual supply deliberately.'),S('level-shifter','Cross voltage domains safely.'),W('timing-gating','Preserve clock pulse shape.'),P('dvfs-power','Relate power to the voltage/frequency operating point.')],
    seq:[S('tg-latch','Trace the storage loop.'),S('master-slave','Compare opposite clock phases.'),W('timing-setup-hold','Inspect capture windows.')],
    cdc:[S('synchronizer','Allocate resolution time.'),S('handshake','Preserve transaction coherence.'),S('async-fifo','Cross pointers separately from stored data.'),W('timing-handshake','Follow protocol completion.')],
    mem:[S('sram6t','Trace read and write paths.'),S('sram8t','Inspect the isolated read port.'),S('nor-rom','Identify keeper contention.'),W('timing-sram-read','Sequence bitline and sense controls.')],
    int:[S('rc-pi','Separate driver and wire loading.'),S('power-grid','Follow shared supply paths.'),P('crosstalk-glitch','Observe coupled disturbance.'),P('ir-heatstrip','Inspect the modeled spatial voltage loss.')],
    var:[S('mirror','Distinguish common bias from local mismatch.'),P('mc-histogram','Read mean and sigma.'),P('sigma-yield','Relate a per-cell tail to array yield.'),P('em-lifetime','Check lifetime sensitivity to current density.')],
    arith:[S('booth','Separate generation, reduction and final addition.'),S('barrel-shifter','Inspect mux depth.'),P('ks','Trace prefix connectivity.'),P('bk','Compare area and depth tradeoffs.')],
    rtl:[S('pipeline','State boundaries define sequential semantics.'),S('async-fifo','Storage and control have separate jobs.'),W('timing-scan','Trace old state across an edge.')],
    flow:[S('rtl-gds','Identify deliverables and checks.'),S('floorplan','Inspect macro halos and routing channels.'),S('cts-tree','Balance clock delivery paths.'),W('timing-scan','Separate test shift and capture.')],
    char:[S('nand','Sensitize a single input arc.'),S('standard-cell','Connect logical, timing and physical views.'),P('liberty-surface','Inspect both table axes.')],
    ana:[S('mirror','Check compliance as well as ratio.'),S('ota5t','Trace the differential signal path.'),S('opamp2','Locate compensation feedback.'),P('bode-margin','Read unity crossing and phase margin.')],
    code:[S('sta-graph','Retain path identity when parsing timing.'),S('rtl-gds','Track artifacts and tool stages.'),P('elmore-response','Compare a numerical model with its circuit.')],
    story:[S('rtl-gds','Name the stage you actually owned.'),S('sta-graph','Separate measured evidence from a proposed repair.'),S('floorplan','State the scope and boundaries of a team project.')]
  };
  const labMap = {
    'py-units':['rc-pi','R and C must be normalized to compatible units before forming a time.'],
    units:['rc-pi','A parser preserves resistance, capacitance and time dimensions.'],
    timing:['sta-graph','Return separate setup and hold comparisons from the two path budgets.'],
    rc:['rc-pi','Model driver resistance, intrinsic capacitance and external load separately.'],
    crossings:['inverter','Match an input event to the intended output threshold crossing.'],
    rom:['nor-rom','Compare keeper restoration against selected discharge on the same bitline.'],
    interpolation:['nand','A characterized gate arc supplies each slew/load table sample.'],
    manifest:['rtl-gds','Enumerate intended runs before collecting stage outputs.'],
    audit:['rtl-gds','Compare delivered artifacts against the expected run identities.'],
    yield:['memory-array','Array size amplifies a small per-cell failure probability.'],
    butterfly:['ntt-butterfly','Reduce the twiddle product modulo q, then form the normalized modular sum and difference.'],
    csv:['sta-graph','Match the same path and condition before subtracting measured delays.'],
    precharge:['precharge-equalize','Restore the bitline to a defined initial voltage before the next access.'],
    'elmore-tree':['rc-pi','Each resistance sees the capacitance downstream of its branch.'],
    'le-path':['inverter','Size a chain by the load that each stage presents to its predecessor.'],
    'mc-mismatch':['sense-amplifier','Compare the developed input signal with the random offset threshold.'],
    'gray-code':['async-fifo','Gray pointers cross control boundaries while memory retains the payload.'],
    'timing-report':['sta-graph','Retain launch, capture, arrival and required-time identities.'],
    'netlist-depth':['pipeline','Walk combinational dependencies between state boundaries.'],
    'mtbf-stages':['synchronizer','Each additional stage changes available resolution time and latency.'],
    'drc-summary':['cell-layout','A geometry-rule result identifies a physical layer and location.']
  };
  for (const l of T.labs) { const m=labMap[l.id]; if(!m)throw Error('Missing lab diagram '+l.id); l.figs=[...(l.figs||[]),S(m[0],m[1])]; }
  // Narrow concept matches attach supporting figures without changing any old
  // prompt or answer. Matches use the prompt/title, never an answer keyword.
  const rules = [
    [/sram|bitcell|cell ratio|butterfly.*(?:snm|noise)|read.sn[m]?/i,'sram6t','Follow the storage and access devices relevant to this read/write question.'],
    [/sense.amplifier|sense.amp|sense.enable|\bSAE\b/i,'sense-amplifier','Compare the two sense inputs before regenerative amplification.'],
    [/\bROM\b|keeper|precharg/i,'nor-rom','Locate the bitline, precharge and opposing keeper/discharge currents.'],
    [/metastab|synchroniz|MTBF|resolution time/i,'synchronizer','Identify the asynchronous input and the interval between receiving stages.'],
    [/handshake|request.*ack|bundled.data/i,'handshake','Track the held payload and acknowledgement path.'],
    [/FIFO|Gray.*(?:pointer|code)|pointer.*Gray/i,'async-fifo','Separate local binary state, Gray crossing and storage.'],
    [/setup|hold|skew|clock.to.Q|t_CQ|CRPR|OCV|timing (?:path|graph|violation)/i,'sta-graph','Keep launch, data and capture paths separate while working the timing check.'],
    [/latch|borrowing/i,'tg-latch','Identify transparent and feedback phases at the storage node.'],
    [/TSPC|master.slave|flip.flop|flop/i,'master-slave','Trace the two storage boundaries and clock phases.'],
    [/clock.gat|gated.clock/i,'icg','Check whether enable can change during the active clock phase.'],
    [/domino|dynamic node|charge shar/i,'domino','Locate dynamic charge storage and the evaluation path.'],
    [/\bOAI/i,'oai','Trace the complementary networks of this OR-AND-invert topology.'],
    [/\bAOI/i,'aoi','Translate the compound logic into complementary conducting paths.'],
    [/NAND/i,'nand','Trace the series pull-down stack and parallel pull-up branches.'],
    [/NOR/i,'nor','Trace the parallel pull-down branches and series pull-up stack.'],
    [/inverter|VTC|noise.margin|subthreshold|DIBL|threshold|body.effect|FinFET|GAA|velocity.saturat/i,'inverter','Relate terminal bias and device behavior to a complementary output node.'],
    [/Elmore|wire|interconnect|crosstalk|coupl|repeater|RC\b|rise.time|50% crossing|10%.to.90%/i,'rc-pi','Place each capacitance on the appropriate side of the interconnect resistance.'],
    [/IR.drop|droop|power.rail|power.grid|target impedance|current dens|electromig|decap|inductance|RMS current/i,'power-grid','Identify current-carrying shared segments and the local supply seen by a load.'],
    [/mirror|compliance/i,'mirror','Compare reference and output terminal biases as well as geometry ratio.'],
    [/differential.pair|common.source|transconductance|gm.?Id|noise voltage|thermal noise|offset/i,'ota5t','Locate transconductance, bias and output nodes before referring gain or error to the input.'],
    [/feedback|phase.margin|Miller|Bode|open.loop|closed.loop/i,'opamp2','Trace the gain stages and compensation path in this feedback example.'],
    [/ADC|sampling|sampler|acquisition|quantization/i,'transmission-gate','Separate the acquisition switch and held node from later signal processing.'],
    [/power.gat|wake.up|idle.*power/i,'power-header','Identify the virtual supply and the state that must survive or be restored.'],
    [/dynamic power|switch.*capacitance|DVFS/i,'inverter','Identify the charged output capacitance and the supply that provides transition energy.'],
    [/voltage.domain|level.shift/i,'level-shifter','Different voltage domains require explicit control and signal-transfer contracts.'],
    [/Pelgrom|mismatch|correlat/i,'mirror','Use a nominal matched pair to separate common shifts from local mismatch.'],
    [/array.*yield|per.cell.*fail|yield/i,'plot:sigma-yield','Separate the per-cell failure tail from the yield of a large array.'],
    [/Monte Carlo|sigma|fail.*probab|zero fail/i,'plot:mc-histogram','Read sample spread and sigma markers without treating limited samples as rare-tail proof.'],
    [/Kogge/i,'plot:ks','Trace carry-prefix levels and fanout in the Kogge-Stone structure.'],
    [/Brent/i,'plot:bk','Trace the reduction and distribution stages of the Brent-Kung structure.'],
    [/prefix|adder/i,'plot:ks','Compare the prefix carry network with the path being discussed.'],
    [/compressor|partial.product|multipl|Booth|population count|signed.*sum/i,'booth','Separate partial-product reduction from final carry propagation.'],
    [/barrel|shift|mux|multiplex/i,'barrel-shifter','Trace the staged selection network and its control bits.'],
    [/floorplan|macro|congestion|placement|routing/i,'floorplan','Physical constraints change routes and therefore electrical behavior.'],
    [/DRC|LVS|layout|track|cell.height|pin.access|antenna|Euler|diffusion|finger/i,'cell-layout','Inspect layer geometry separately from schematic connectivity.'],
    [/scan|ATPG|test.coverage|stuck.at/i,'timing-scan','Separate serial shift clocks from functional capture clocks before interpreting test behavior.'],
    [/Liberty|library|characteriz|slew|delay.table|interpolat/i,'standard-cell','A reusable cell needs compatible logical, electrical and physical views.'],
    [/always\s*@|nonblocking|blocking|register|counter|FSM|state.machine|sequence|pipeline|encoding|divide.by|reset/i,'pipeline','Trace old and new state at the register boundaries.'],
    [/parser|parse|regex|report|manifest|script|Tcl|Python|sort|bin\(|CSV|regression|sweep/i,'rtl-gds','Automation must preserve artifact identity and validation status across each tool stage.']
  ];
  const targeted = new Set(['num','design','spot']);
  const pool = T.bank.concat(window.TAPEOUT_VAULT || []);
  for (const q of pool) {
    if ((q.lvl || 2)<2 && !targeted.has(q.f)) continue;
    const text=(q.title||'')+' '+q.q;
    const match=rules.find(r=>r[0].test(text));
    if(!match)continue;
    // The AOI registry uses AB+C. Do not silently relabel a prompt using A+BC.
    if(match[1]==='aoi'&&/A\s*\+\s*B\s*[*·]?\s*C/i.test(text))continue;
    const previous=q.figs||T.figureList(q.fig);
    const added=match[1].startsWith('plot:')?P(match[1].slice(5),match[2]):S(match[1],match[2]);
    if(['nand','nor'].includes(match[1])){
      const fanin=text.match(new RegExp(match[1]+'\\s*([234])','i'));
      if(fanin)added.spec={fanin:Number(fanin[1])};
    }
    q.figs=[...previous,added];
    q.figureRationale=match[2];
  }
  const priorityCases={
    'RTL-027': P('ks','A prefix carry network illustrates carry propagation. Use the 7-bit operand width and signed range stated in the prompt; this reference network is not drawn to that width.'),
    'DEV-006': P('leakage-vt-temp','Leakage changes exponentially with threshold. Use the swing and threshold values in the prompt; the plotted curves are a separate teaching example.'),
    'DLY-105': P('stages','Compare the stage-count tradeoff. This reference sweep uses F=256; calculate the stated path effort from G, B and H.'),
    'PWR-103': S('inverter','Trace charging through the PMOS from the supply to the output capacitance, then distinguish supplied energy from stored energy.')
  };
  for(const q of pool)if(priorityCases[q.id]){q.figs=[...(q.figs||T.figureList(q.fig)),priorityCases[q.id]];q.figureRationale=priorityCases[q.id].cap;}
  T._all=null; T._byId=null;
})();
