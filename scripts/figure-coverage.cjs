/* Run: node scripts/figure-coverage.cjs. Counts only resolved SVG generators.
 * Legacy images are reported separately; decorative metadata is not coverage. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
function load(){
  const c={console,URL,URLSearchParams,Map,Set,Date,localStorage:{getItem:()=>null,setItem:()=>{}},setTimeout:()=>1,clearTimeout:()=>{},
    document:{compatMode:'CSS1Compat',querySelector:()=>({textContent:'',hidden:false})},
    marked:require(path.join(ROOT,'vendor/marked.js')),katex:require(path.join(ROOT,'vendor/katex/katex.min.js'))};
  c.window=c;vm.createContext(c);
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  for(const m of html.matchAll(/<script\s+src="([^"?]+\.js)"/g)){
    const f=m[1];
    if(!['js/core.js','js/plots.js','js/schematics.js','js/figures.js'].includes(f)&&!f.startsWith('data/'))continue;
    vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),c,{filename:f});
  }
  c.T.state.settings.hideCompany=false;return c;
}
function audit(c){
  const T=c.T,questions=T.allQ(),failures=[],unresolved=[],counts={schematic:0,layout:0,block:0,waveform:0,plot:0};
  const list=v=>T.figureList(v), cache=new Map();
  function resolve(f,owner){
    const key=JSON.stringify({schematic:f.schematic,plot:f.plot,waveform:f.waveform,spec:f.spec,src:f.src});if(cache.has(key))return cache.get(key);
    let svg='',type=null;
    try{
      if(f.schematic){
        if(!T.schematics[f.schematic])throw Error('Unknown schematic '+f.schematic);
        const model=T.schematicModel(f.schematic,f.spec||{});
        type=model.kind==='circuit'?'schematic':model.kind==='layout'?'layout':model.kind==='waveform'?'waveform':'block';
        svg=T.schematic(f.schematic,f.spec||{});
      }else if(f.waveform){type='waveform';svg=T.waveform(f.waveform);}
      else if(f.plot){
        if(!T.plots[f.plot])throw Error('Unknown plot '+f.plot);
        type=['ks','bk','domino','sync2','diffpair'].includes(f.plot)?'block':'plot';svg=T.plot(f.plot,f.spec||{});
      }else if(f.src){
        if(!fs.existsSync(path.join(ROOT,f.src)))throw Error('Missing image '+f.src);
        cache.set(key,{generated:false,type:'image'});return cache.get(key);
      }else throw Error('Figure has no source or generator');
      if(!/<svg\b/.test(svg)||!/aria-label=/.test(svg)||/NaN|undefined/.test(svg))throw Error('Invalid or unlabelled SVG');
      counts[type]++;const result={generated:true,type};cache.set(key,result);return result;
    }catch(e){unresolved.push({owner,message:e.message});cache.set(key,null);return null;}
  }
  const structural=r=>r&&['schematic','layout','block'].includes(r.type);
  const behavioral=r=>r&&['waveform','plot'].includes(r.type);
  const lessonsBelowTarget=[];
  for(const u of T.units){
    const figures=list(u.figs).map(f=>resolve(f,'lesson:'+u.id)).filter(Boolean);
    if(figures.filter(r=>r.generated).length<2||!figures.some(structural)||!figures.some(behavioral))lessonsBelowTarget.push(u.id);
  }
  const withoutFigures=[],withoutGenerated=[],priorityWithoutFigures=[],byDomainLevel={};let withFigure=0,withGenerated=0;
  for(const q of questions){
    // figureList preserves support for the pre-existing single-field contract.
    const figs=T.questionFigures(q),resolved=figs.map(f=>resolve(f,'question:'+q.id)).filter(Boolean);
    if(resolved.length)withFigure++;else withoutFigures.push(q.id);
    if(resolved.some(r=>r.generated))withGenerated++;else{
      withoutGenerated.push(q.id);const key=q.d+':L'+(q.lvl||2);(byDomainLevel[key]||=[]).push(q.id);
      if(['num','design','spot'].includes(q.f)||/\bdraw\b|\bsketch\b/i.test(q.q))priorityWithoutFigures.push({id:q.id,format:q.f,title:q.title||q.q.slice(0,100)});
    }
    for(const f of list(q.afig))resolve(f,'answer:'+q.id);
    if(q.figureDriven){
      if(!resolved.some(r=>r.generated))failures.push('Figure-driven prompt lacks generated figure: '+q.id);
      if(!list(q.afig).some(f=>resolve(f,'answer:'+q.id)?.generated))failures.push('Figure-driven answer lacks generated solution: '+q.id);
      if(q.f!=='mcq'||q.opts?.length!==4||q.why?.length!==4)failures.push('Figure-driven MCQ schema: '+q.id);
      if(!q.figureRationale)failures.push('Missing figure-reading rationale: '+q.id);
    }
  }
  const labsWithoutDiagram=T.labs.filter(l=>!list(l.figs).some(f=>structural(resolve(f,'lab:'+l.id)))).map(l=>l.id);
  const newPerDomain={};
  for(const d of c.TAPEOUT_DOMAINS){
    const fs=list(T.domainFigures?.[d.id]);
    if(fs.length<3||fs.length>6)failures.push('Domain strip must contain3-6 figures: '+d.id);
    for(const f of fs)if(!resolve(f,'domain:'+d.id)?.generated)failures.push('Domain figure is not generated: '+d.id);
    newPerDomain[d.id]=questions.filter(q=>q.figureDriven&&q.d===d.id).length;
    if(newPerDomain[d.id]<4)failures.push('Need four new figure-driven questions in '+d.id);
  }
  if(lessonsBelowTarget.length)failures.push('Lessons lack structural/behavioral pair');
  if(withGenerated/questions.length<.4)failures.push('Generated question coverage below40%');
  if(labsWithoutDiagram.length)failures.push('Labs lack generated structural diagram');
  if(priorityWithoutFigures.length)failures.push('Priority numeric/design/drawing/spot prompts lack a generated figure');
  if(unresolved.length)failures.push('Unresolved or invalid generated figures');
  return{pass:!failures.length,totalLessons:T.units.length,lessonsMeetingTarget:T.units.length-lessonsBelowTarget.length,lessonsBelowTarget,
    totalQuestions:questions.length,questionsWithAnyFigure:withFigure,questionsWithGeneratedFigure:withGenerated,
    questionGeneratedShare:withGenerated/questions.length,questionsWithoutFigures:withoutFigures,
    questionsWithoutGeneratedByDomainLevel:byDomainLevel,priorityWithoutFigures,
    newFigureDrivenTotal:Object.values(newPerDomain).reduce((a,b)=>a+b,0),newFigureDrivenPerDomain:newPerDomain,
    totalLabs:T.labs.length,labsWithDiagram:T.labs.length-labsWithoutDiagram.length,labsWithoutDiagram,
    uniqueResolvedGeneratedFigures:counts,unresolved,failures};
}
if(require.main===module){
  const report=audit(load());fs.mkdirSync(path.join(ROOT,'.qa'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'.qa/figure-coverage.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
}
module.exports={load,audit};
