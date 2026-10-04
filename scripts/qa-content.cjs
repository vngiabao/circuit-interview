/* Run: node scripts/qa-content.cjs. Uses shipped data order and actual renderer.
 * This is structural/rendering QA, not a claim that all engineering prose has
 * been independently re-derived or that a teaching plot is measured evidence.
 */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const input = JSON.parse(read('scripts/source-inputs/studio.json'));
const failures = [], warnings = [], assets = new Set(), mathErrors = [];
const test = (condition, message) => { if (!condition) failures.push(message); };
const c = { console, URL, URLSearchParams, Blob, Map, Set, Date,
  document: { compatMode: 'CSS1Compat', querySelector: () => ({textContent:'', hidden:false}) },
  localStorage: {getItem: () => null, setItem: () => {}},
  setTimeout: () => 1, clearTimeout: () => {},
  marked: require(path.join(ROOT, 'vendor/marked.js')),
  katex: require(path.join(ROOT, 'vendor/katex/katex.min.js')) };
c.window = c; vm.createContext(c);
vm.runInContext(read('js/core.js'), c, {filename:'js/core.js'});
const dataFiles = [...read('index.html').matchAll(/<script\s+src="(data\/[^"?]+\.js)"/g)].map(m=>m[1]);
for (const f of dataFiles) vm.runInContext(read(f), c, {filename:f});
const T = c.T;
T.state.settings.hideCompany = false;
const questions = T.allQ(), units = T.units, labs = T.labs;
function unique(xs, label) { test(new Set(xs.map(x=>x.id)).size === xs.length, label+' IDs are not unique'); }
unique(questions,'Question'); unique(units,'Lesson'); unique(labs,'Lab');
test(questions.length >= 600, 'Expected at least 600 total questions');
test(units.length >= 54, 'Expected at least 54 lessons');
test(labs.length >= 21, 'Expected at least 21 labs');
const old = new Map(questions.filter(q=>q.legacyId).map(q=>[q.legacyId,q]));
test(old.size === 412, 'Expected all 412 legacy questions');
for (const q of input.questions) {
  const got = old.get(q.id); test(!!got,'Missing original question '+q.id);
  if (!got) continue;
  test(!got.company, 'Active technical content hidden as company-specific: '+q.id);
  if (q.format === 'mcq') {
    test(got.f === 'mcq', 'Legacy MCQ lost its format: '+q.id);
    test(JSON.stringify(got.opts) === JSON.stringify(q.choices), 'Legacy MCQ options changed: '+q.id);
    test(got.ans === q.correct, 'Legacy MCQ answer changed: '+q.id);
    if (q.choiceExplanations) test(JSON.stringify(got.why) === JSON.stringify(q.choiceExplanations), 'Legacy reasoning changed: '+q.id);
  }
}
test([...old.values()].filter(q=>q.f==='mcq').length===367, 'Expected 367 legacy MCQs');
for (const q of questions) {
  test(!!T.domain(q.d), 'Unknown domain '+q.d+' on '+q.id);
  if (q.u) test(!!T.unit(q.u),'Unknown lesson '+q.u+' on '+q.id);
  if (q.f === 'mcq') {
    test(q.opts?.length === 4, 'MCQ needs four options: '+q.id);
    test(Number.isInteger(q.ans) && q.ans >= 0 && q.ans < q.opts.length, 'Invalid answer index: '+q.id);
    test(q.why?.length === 4 && q.why.every(s=>typeof s==='string'&&s.trim()), 'MCQ needs four explanations: '+q.id);
    test(new Set(q.opts).size===4, 'Duplicate MCQ options: '+q.id);
  }
}
for (const d of c.TAPEOUT_DOMAINS) test(questions.some(q=>q.d===d.id),'Empty question domain '+d.id);
for (const u of units) {
  test(!!T.domain(u.d),'Unknown lesson domain '+u.id);
  for (const id of u.prerequisites||[]) test(!!T.unit(id),'Missing prerequisite '+id+' on '+u.id);
  for (const id of u.labIds||[]) test(labs.some(l=>l.id===id),'Missing lab '+id+' on '+u.id);
  for (const id of u.checks||[]) test(!!T.getQ(id),'Missing lesson question '+id+' on '+u.id);
}
for (const l of input.labs) {
  const got=labs.find(x=>x.legacyId===l.id); test(!!got,'Missing legacy lab '+l.id);
  for (const k of ['starter','solution','tests']) test(got?.[k]===l[k], 'Legacy lab '+k+' changed: '+l.id);
}
let stringFields=0, renderedFields=0, mathMarkupCount=0, maxParagraph={characters:0,field:''};
const seen = new Set();
function inspectString(s, field) {
  stringFields++;
  test(!/[A-Za-z]:[\\/]Users[\\/]|file:\/\/|(?:^|["'(\s])\.\.\/interview-studio/.test(s), 'Private/local path in shipped data: '+field);
  for (const m of s.matchAll(/(?:src=["']|!\[[^\]]*\]\()(assets\/[^"'\s)<>]+)/g)) assets.add(m[1]);
  // Data source strings are Markdown, including question options and callouts.
  // Rendering all strings catches errors in less frequently visited fields too.
  const rendered=T.md(s); renderedFields++;
  if (/class="(?:math-error|katex-error)"/.test(rendered)) mathErrors.push({field,error:(rendered.match(/title="([^"]+)"/)||[])[1]||'render error'});
  test(!/language-latex/.test(rendered),'Raw LaTeX code fence rendered: '+field);
  test(!/\u0000[MC]\d+\u0000/.test(rendered),'Unresolved renderer token: '+field);
  if (/^(?:SLIDE2?|DIAGRAM|FIG2?):/m.test(s)) failures.push('Unresolved figure directive: '+field);
  mathMarkupCount+=(rendered.match(/class="katex"/g)||[]).length;
  for (const m of rendered.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)) {
    const plain=m[1].replace(/<[^>]*>/g,'').replace(/&[^;]+;/g,'x');
    if(plain.length>maxParagraph.characters)maxParagraph={characters:plain.length,field};
  }
}
function walk(value, field) {
  if(typeof value==='string')return inspectString(value,field);
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  for(const [k,v] of Object.entries(value))walk(v,field+'.'+k);
}
walk({questions,units,labs,glossary:T.glossary,domains:c.TAPEOUT_DOMAINS,slides:c.TAPEOUT_SLIDES},'data');
for (const u of units) for (const [i,e] of (u.eq||[]).entries()) {
  const rendered=T.tex(e[0],true);
  if(/class="(?:math-error|katex-error)"/.test(rendered))mathErrors.push({field:'unit.'+u.id+'.eq.'+i,error:'direct equation rendering failed'});
}
const refs=c.TAPEOUT_REFERENCES||[];
test(refs.length===8,'Expected eight bundled reference books');
test(refs.reduce((n,r)=>n+r.sections.length,0)===78,'Expected 78 reference chapters');
for(const r of refs){
  test(fs.existsSync(path.join(ROOT,r.file)),'Missing rendered reference '+r.id);
  const original=fs.readFileSync(path.join(ROOT,r.originalFile));
  test(crypto.createHash('sha256').update(original).digest('hex')===r.sourceSha256,'Original reference hash mismatch: '+r.id);
  inspectString(read(r.file),'reference.'+r.id);
}
for(const s of c.TAPEOUT_SLIDES||[])assets.add(s.f);
for(const asset of assets)test(fs.existsSync(path.join(ROOT,asset)),'Missing asset '+asset);
test(!mathErrors.length, mathErrors.length+' math-rendering errors');
// Regression checks for fenced display equations and Boolean operators.
test(/katex-display/.test(T.md('```latex\nA\\land B \\lor C = \\overline{Q}\n```')),'Logic equation fence did not render as display math');
const caveats=JSON.parse(read('scripts/source-inputs/studio-bridge-audit.json'));
const missingNames=[...new Set(caveats.unavailableSourceFigures.map(g=>g.name))];
warnings.push('59 supplied-source figure names are unavailable and explicitly labeled; no lesson image is missing.');
const result={pass:failures.length===0, questions:questions.length, mcqs:questions.filter(q=>q.f==='mcq').length,
  legacyQuestions:old.size, legacyMCQs:[...old.values()].filter(q=>q.f==='mcq').length,
  lessons:units.length,labs:labs.length,referenceBooks:refs.length,referenceChapters:78,
  imageAssetsChecked:assets.size,stringFields,renderedFields,mathMarkupCount,maxParagraph,
  unavailableArchivalFigureNames:missingNames.length,mathErrors,failures,warnings};
fs.mkdirSync(path.join(ROOT,'.qa'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'.qa/content.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
