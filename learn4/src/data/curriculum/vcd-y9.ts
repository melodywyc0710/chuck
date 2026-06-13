import type { Session } from '../types';

export const vcdY9: Session[] = [
  {
    id: 'vcd-y9-01',
    subject: 'vcd',
    title: 'Advanced Typography',
    victorianCode: 'VCAVCD301',
    description: 'Coming soon — advanced typography, grid systems, and deep design analysis for Year 9.',
    yearLevel: 9,
    estimatedMinutes: 60,
    starsAvailable: 5,
    color: '#db2777',
    icon: '🔤',
    steps: [
      {
        id: 'vcd-y9-01-s1',
        type: 'worked-example',
        title: 'Advanced Typography',
        teacherNote: 'Year 9 VCD content coming soon.',
        imagePrompt: 'typography grid system layout showing columns gutters margins alignment clean professional editorial design',
        content: {
          heading: 'Typography as a Design System',
          body: [
            { label: 'Coming Soon', text: 'This lesson will cover advanced typography including typographic hierarchy, grid-based layouts, legibility principles, and professional font pairing strategies used in editorial and brand design.', highlight: 'blue' },
          ],
          questions: [
            { q: 'What is typographic hierarchy?', a: 'The visual organisation of type elements by importance — using size, weight, colour and placement to guide the reader from most to least important information.' },
          ],
        },
      },
      {
        id: 'vcd-y9-01-s2',
        type: 'quiz',
        title: 'Quiz: Typography Fundamentals',
        teacherNote: 'Placeholder quiz.',
        questions: [
          { id: 'vcd-y9-01-q1', text: 'Which font category is most appropriate for long body text in a printed book?', image: null, options: ['Decorative display font', 'Serif or readable sans-serif', 'Handwritten script', 'Symbol font'], correct: 1, explanation: 'Readable serif or sans-serif fonts are designed for sustained reading — decorative fonts tire the eye quickly over long passages.' },
          { id: 'vcd-y9-01-q2', text: 'What does "leading" refer to in typography?', image: null, options: ['The first letter of a paragraph', 'The space between lines of text', 'The weight of a font', 'The width of a typeface'], correct: 1, explanation: 'Leading (pronounced "ledding") is the vertical space between lines of text — too tight and text becomes hard to read; too loose and it loses cohesion.' },
        ],
      },
      { id: 'vcd-y9-01-s3', type: 'worked-example', title: 'Grid Systems', teacherNote: 'Placeholder.', imagePrompt: 'publication layout grid system showing columns gutters margins baseline grid, clean editorial design professional', content: { heading: 'Grid Systems in Layout', body: [{ label: 'Grid Systems', text: 'A grid is an invisible framework of columns, rows and margins that organises content consistently across pages. Grids create order, improve readability, and speed up design decisions. Every major newspaper, magazine and website uses a grid system.', highlight: 'green' }], questions: [{ q: 'Why do designers use grid systems?', a: 'Grids create consistency, order and alignment across multiple pages or screens — making layouts easier to navigate and faster to design.' }] } },
      { id: 'vcd-y9-01-s4', type: 'quiz', title: 'Quiz: Grid Systems', teacherNote: 'Placeholder.', questions: [{ id: 'vcd-y9-01-q3', text: 'What is a "gutter" in a grid layout?', image: null, options: ['The outer margin of the page', 'The space between columns', 'The baseline of text', 'The header area'], correct: 1, explanation: 'A gutter is the gap between columns in a grid — it provides breathing room between content blocks and prevents columns from visually merging.' }] },
      { id: 'vcd-y9-01-s5', type: 'free-response', title: 'Typography Analysis', teacherNote: 'Placeholder.', prompt: 'Find a well-designed magazine page and analyse the typography and grid system used.', fields: [{ id: 'analysis', label: 'Describe the typographic hierarchy and grid structure you can identify.', placeholder: 'e.g. The magazine uses a 6-column grid with a large headline spanning 4 columns...', multiline: true, minRows: 4 }] },
      { id: 'vcd-y9-01-s6', type: 'homework', title: 'Homework: Typography Redesign', teacherNote: 'Placeholder.', dueNext: true, tasks: [{ id: 'hw1', label: 'Take a poorly designed flyer or notice and redesign the typography only', hint: 'Focus on hierarchy, font choice, size contrast and spacing — do not change the content' }, { id: 'hw2', label: 'Annotate your redesign explaining each typographic decision', hint: 'Reference hierarchy, legibility, audience and purpose' }] },
    ],
  },
];
