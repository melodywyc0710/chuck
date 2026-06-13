import type { Session } from '../types';

export const vcdY10: Session[] = [
  {
    id: 'vcd-y10-01',
    subject: 'vcd',
    title: 'Year 10 VCD — Coming Soon',
    victorianCode: 'VCAVCD401',
    description: 'Year 10 VCD content is being developed. Check back soon.',
    yearLevel: 10,
    estimatedMinutes: 60,
    starsAvailable: 5,
    color: '#db2777',
    icon: '🎨',
    steps: [
      { id: 'vcd-y10-01-s1', type: 'worked-example', title: 'Year 10 VCD', teacherNote: 'Coming soon.', imagePrompt: 'design folio pages showing developmental work sketches refined designs annotations professional VCD folio layout', content: { heading: 'Year 10 VCD Content Coming Soon', body: [{ label: 'Coming Soon', text: 'Year 10 VCD will cover the full design folio process, advanced presentation drawing, typography systems, brand identity, and VCE preparation.', highlight: 'blue' }], questions: [{ q: 'What is a design folio?', a: 'A design folio documents the entire design process from brief through research, ideation, development and evaluation — showing thinking as well as final outcomes.' }] } },
      { id: 'vcd-y10-01-s2', type: 'quiz', title: 'Quiz: Placeholder', teacherNote: 'Coming soon.', questions: [{ id: 'vcd-y10-01-q1', text: 'A design folio should primarily demonstrate:', image: null, options: ['Only finished designs', 'The design thinking process including research, ideation and development', 'Technical drawing skills only', 'Computer skills'], correct: 1, explanation: 'A design folio is evidence of design thinking — the process matters as much as the final outcome, especially in VCE assessment.' }] },
      { id: 'vcd-y10-01-s3', type: 'worked-example', title: 'Placeholder', teacherNote: 'Coming soon.', imagePrompt: 'year 10 VCD design work folio pages', content: { heading: 'More Content Coming', body: [{ label: 'More Soon', text: 'Full Year 10 content including advanced presentation drawing and brand identity systems will be added in upcoming lessons.', highlight: 'green' }], questions: [{ q: 'What is one-point perspective?', a: 'A drawing technique where parallel lines converge to a single vanishing point on the horizon, creating the illusion of depth.' }] } },
      { id: 'vcd-y10-01-s4', type: 'quiz', title: 'Quiz: Placeholder 2', teacherNote: 'Coming soon.', questions: [{ id: 'vcd-y10-01-q2', text: 'In two-point perspective drawing, how many vanishing points are used?', image: null, options: ['One', 'Two', 'Three', 'None'], correct: 1, explanation: 'Two-point perspective uses two vanishing points on the horizon line, allowing objects to be shown from a corner view with both sides receding to different points.' }] },
      { id: 'vcd-y10-01-s5', type: 'free-response', title: 'Placeholder', teacherNote: 'Coming soon.', prompt: 'Describe your design goals for Year 10 VCD.', fields: [{ id: 'goals', label: 'What do you want to achieve in VCD this year?', placeholder: 'e.g. I want to improve my presentation drawing and understand how to build a complete brand...', multiline: true, minRows: 3 }] },
      { id: 'vcd-y10-01-s6', type: 'homework', title: 'Homework: Placeholder', teacherNote: 'Coming soon.', dueNext: false, tasks: [{ id: 'hw1', label: 'Collect 10 examples of professional design work you admire for a mood board', hint: 'Look at packaging, posters, logos, editorial layouts — save as screenshots or photograph them' }] },
    ],
  },
];
