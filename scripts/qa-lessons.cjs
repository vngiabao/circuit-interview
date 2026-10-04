/* Curriculum dependencies, equation context and preserved media regression. */
const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const c=require('./figure-coverage.cjs').load(), T=c.T;
const ids=T.lessonTopics.flatMap(t=>t.ids);
assert.equal(ids.length,T.units.length);
assert.equal(new Set(ids).size,ids.length);
assert.deepEqual(Array.from(ids).sort(),Array.from(T.units,u=>u.id).sort());
assert.equal(new Set(T.lessonTopics.map(t=>t.d)).size,c.TAPEOUT_DOMAINS.length);
for(const topic of T.lessonTopics) for(const id of topic.ids) assert.equal(T.unit(id).d,topic.d);
const reading=T.lessonPath(), seen=new Set(); let dependencies=0;
for(const u of reading){
  for(const id of T.lessonPrereqs(u)){assert(seen.has(id),'Prerequisite must precede '+u.id+': '+id);dependencies++;}
  seen.add(u.id);
}
assert.equal(reading[0].id,'cmos-foundations');
T.state.units={}; assert.equal(T.nextLesson().id,reading[0].id);
T.state.units[reading[0].id]={status:'solid'}; assert.equal(T.nextLesson().id,reading[1].id);
for(const u of reading) T.state.units[u.id]={status:'solid'};
assert.equal(T.nextLesson(),undefined);
const equations=T.units.filter(u=>u.eq?.length); let lectureLinks=0, images=0;
for(const u of T.units){
  for(const f of u.figs || []) if(f.src){ assert(fs.existsSync(path.resolve(__dirname,'..',f.src))); images++; }
  const slides=T.lessonSlides(u); lectureLinks+=slides.length;
  for(const s of slides){assert(c.TAPEOUT_SLIDES.includes(s));assert(fs.existsSync(path.resolve(__dirname,'..',s.f)));}
  const body=new Set([...(u.body || '').matchAll(/assets\/fig\/lectures\/[A-Za-z0-9_.-]+\.(?:png|jpe?g|svg)/g)].map(m=>m[0]));
  for(const f of body){if(c.TAPEOUT_SLIDES.some(s=>s.f===f)) assert(slides.some(s=>s.f===f),'Missing source-linked crop '+u.id+': '+f);}
}
for(const u of equations){
  const ctx=T.sheetContext[u.id]; assert(ctx?.mode&&ctx?.names,'Context missing '+u.id);
  const f=typeof ctx.diagram==='string'?{schematic:ctx.diagram}:ctx.diagram;
  assert(T.figure(f).includes('<svg'),'Missing context diagram '+u.id);
}
assert.equal(equations.length,44);assert.equal(images,22);assert.equal(c.TAPEOUT_SLIDES.length,534);
for(const id of ['low-power-domains','adaptive-voltage','compute-in-memory']) assert(T.lessonSlides(T.unit(id)).some(s=>s.f.endsWith('.jpeg')),'EECS627 JPEG crops omitted '+id);
console.log(JSON.stringify({pass:true,lessons:ids.length,topics:T.lessonTopics.length,prerequisiteEdges:dependencies,equationLessons:equations.length,preservedLessonImages:images,lectureFigures:c.TAPEOUT_SLIDES.length,sourceLinkedLectureUses:lectureLinks}));
