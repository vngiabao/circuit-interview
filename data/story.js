/* STORY: project and behavioural answers. Frameworks only; personal facts stay [fill in]. */
(function () {
  const r = String.raw;
  T.addUnits([
    {
      id: 'story-method', d: 'story', order: 1, tier: 1, mins: 20,
      title: 'Tell a project story an engineer will believe',
      goal: 'Structure any project or behavioural answer as spec, your part, decisions, evidence, debug and result, in under two minutes, with nothing you cannot defend.',
      tags: ['story', 'behavioural', 'project'],
      model: r`Technical interviewers listen for three things in a story: **what was hard**, **what you personally decided**, and **how you know it worked**. Generic STAR (situation, task, action, result) is fine, but engineers respond better to the order in which engineering actually happens:

1. **Spec and constraint** (one sentence): what had to work, under which limits. "A 16-bit ROM macro meeting 1.2 GHz access at the slow corner."
2. **Your part**: name exactly what you owned. "I" for your work, the team for the rest.
3. **Two decisions with their rejected alternatives**. This is where competence shows.
4. **Evidence**: corners, Monte Carlo, measurements, the number that convinced you.
5. **What went wrong and how you found it**: symptom, hypothesis, experiment, root cause. Interviewers remember this part most.
6. **Result and what you would change**.

Keep it under two minutes, then stop and let them pull. Every sentence should survive "how do you know?". Anything you cannot verify goes in your notes as **[fill in]** until you have checked it. Never say a number you cannot re-derive at a whiteboard.`,
      eq: [],
      traps: ['Spending a minute on background before the constraint.', 'Saying "we" for everything, so they cannot tell what you did; or "I" for team work, which collapses under follow-ups.', 'A story with no failure in it; it sounds rehearsed and hides your debugging.', 'Quoting a result you cannot re-derive.'],
      say: r`I lead with the constraint, say exactly what I owned, walk through two decisions and what I rejected, give the evidence across corners, then the thing that went wrong and how I found it, and finish with the result and what I would change. Under two minutes, then I let them pull on whatever interests them.`,
      ask: ['What would you do differently?', 'How did you verify that?', 'What was the hardest part technically?', 'What did your teammates do?'],
      checks: ['STORY-01', 'STORY-03'],
    },
  ]);

  const rubric = ['Opens with the specification or constraint in one sentence.', 'States clearly what you personally owned versus the team.', 'Names at least one decision and the alternative you rejected.', 'Gives evidence (corners, simulation, measurement) rather than adjectives.', 'Includes a real problem and how you debugged it.', 'Ends with the result and an honest improvement, in under two minutes.'];
  T.addQ([
    { id: 'STORY-01', d: 'story', u: 'story-method', lvl: 1, f: 'oral', tags: ['project'], title: 'Walk me through your most relevant project',
      q: 'Walk me through the project most relevant to this role.', rub: rubric,
      a: 'Use the Stories page to draft it. Shape: constraint, your part, two decisions, evidence across corners, the failure and its debug, result and improvement. Practise until it fits in 90 to 120 seconds, then let the interviewer choose where to go deeper.',
      fu: ['Which decision would you change now?', 'What was the worst corner, and why?', 'How did you validate the result?'] },
    { id: 'STORY-02', d: 'story', u: 'story-method', lvl: 1, f: 'oral', tags: ['intro'], title: 'Tell me about yourself',
      q: 'Tell me about yourself.',
      rub: ['Under 60 seconds.', 'Present, past, future: what you do now, the path that built the relevant skills, why this role next.', 'Names two or three concrete technical skills relevant to the role.', 'Ends by handing the conversation back (a hook into your best project).'],
      a: 'Keep it to about 60 seconds: what you do now and your strongest technical area, the two experiences that built it (each with one concrete detail), and why this role is the logical next step. Finish with a hook such as "the project I would most like to talk about is..." so the interviewer can pick it up.' },
    { id: 'STORY-03', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['debug'], title: 'The hardest bug you have found',
      q: 'Tell me about the hardest technical problem you debugged.',
      rub: ['Describes the symptom precisely, including when it did and did not happen.', 'States the hypotheses considered and how each was tested.', 'Explains the root cause at the physical or logical level.', 'Explains how the fix was verified and how recurrence was prevented.'],
      a: 'The interviewer is grading your debugging method. Say the symptom (and the conditions that made it appear or disappear), the hypotheses, the experiment that separated them, the root cause in physical terms, and how you proved the fix and prevented recurrence (a check, a test, a script).' },
    { id: 'STORY-04', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['failure'], title: 'A mistake you made',
      q: 'Tell me about a mistake you made, or something you built that did not work.',
      rub: ['Owns the mistake plainly, without blaming others.', 'Explains the impact honestly.', 'Describes what you did to recover.', 'Names the concrete change in your process afterwards.'],
      a: 'Pick a real, technical mistake with a modest impact. Own it in one sentence, describe the impact, the recovery, and the specific process change you made (for example, a checklist item, an automated check, a review step). The process change is the point of the answer.' },
    { id: 'STORY-05', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['conflict'], title: 'A technical disagreement',
      q: 'Tell me about a time you disagreed with a teammate or another team on a technical decision.',
      rub: ['Frames the disagreement as two reasonable positions.', 'Describes how evidence (data, simulation, an experiment) settled it.', 'Shows you could be persuaded or could persuade respectfully.', 'States the outcome and the relationship afterwards.'],
      a: 'Show that you resolve disagreements with evidence: both positions, the experiment or data that decided it, the outcome, and that the working relationship stayed good. Being proven wrong and adopting the better idea is a strong answer.' },
    { id: 'STORY-06', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['deadline'], title: 'A tight deadline',
      q: 'Tell me about a tight deadline. What did you cut, and how did you decide?',
      rub: ['Explains how you prioritised by risk.', 'Names what you deliberately did not do and why that was safe.', 'Mentions communicating the trade-off early.', 'States the result.'],
      a: 'Interviewers want to hear risk-based prioritisation: what had to be right (signoff corners, functional correctness), what could be reduced (extra sweeps, polish), how you told stakeholders early, and how it turned out.' },
    { id: 'STORY-07', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['automation'], title: 'Something you automated',
      q: 'Tell me about a time you automated a repetitive or error-prone task.',
      rub: ['Describes the manual process and its failure modes.', 'Explains the tool or script design choices.', 'Mentions how the automation fails loudly or is validated.', 'Quantifies or concretely describes the benefit.'],
      a: 'Describe the manual process and what went wrong with it, how your script or flow works (inputs, checks, outputs), how it refuses to produce silent wrong answers, and what it saved or prevented.' },
    { id: 'STORY-08', d: 'story', u: 'story-method', lvl: 1, f: 'oral', tags: ['motivation'], title: 'Why this role',
      q: 'Why this role, and why this kind of circuit or chip work?',
      rub: ['Connects specific parts of the role to specific past experience.', 'Shows knowledge of what the team actually works on.', 'Expresses interest in the technical problems, not only the company name.'],
      a: 'Name two things the role does that match things you have done or want to deepen, show you understand the team\'s work, and say what problem you are excited to work on. Avoid answers that would fit any company.' },
    { id: 'STORY-09', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['learning'], title: 'Learning something new fast',
      q: 'Tell me about a time you had to learn a new tool, language or technical area quickly.',
      rub: ['Names what you had to learn and why.', 'Describes your learning method (minimal working example, documentation, asking experts).', 'Shows how you verified you had it right.', 'States the outcome.'],
      a: 'Show a method: start from a minimal working example, read primary documentation, compare against a known-good result, ask an expert targeted questions. Then the outcome.' },
    { id: 'STORY-10', d: 'story', u: 'story-method', lvl: 3, f: 'oral', tags: ['ownership'], title: 'You found a problem outside your scope',
      q: 'Tell me about a time you noticed a problem that was not your responsibility. What did you do?',
      rub: ['Raised it with evidence to the right owner.', 'Did not silently fix someone else\'s area or ignore it.', 'Followed up until it was resolved or explicitly accepted.'],
      a: 'The strong answer: you gathered enough evidence to make the issue concrete, raised it with the owner, offered help, and followed up until it was fixed or consciously accepted as a risk.' },
    { id: 'STORY-11', d: 'story', u: 'story-method', lvl: 2, f: 'oral', tags: ['weakness'], title: 'A weakness',
      q: 'What is a technical weakness you are working on?',
      rub: ['A real, relevant but not disqualifying weakness.', 'What you are doing about it, concretely.', 'Evidence of progress.'],
      a: 'Name a real gap relevant to the role but not central to it, the concrete plan (course, project, practice), and evidence you are improving. Avoid disguised strengths.' },
    { id: 'STORY-12', d: 'story', u: 'story-method', lvl: 1, f: 'oral', tags: ['close'], title: 'Do you have questions for us?',
      q: 'We have a few minutes left. Do you have questions for us?',
      rub: ['Asks two or three specific questions about the team\'s technical work.', 'At least one question about how success is measured in the first months.', 'Avoids questions answered on the website, and saves compensation for the recruiter.'],
      a: 'Prepare three: one about the technical problem the team is fighting now ("what limits your design the most at the current node?"), one about how a new engineer becomes productive and is measured, and one about the interviewer\'s own work. Close with a short thank-you and your interest.' },
  ]);
})();
