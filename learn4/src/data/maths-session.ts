import type { Session } from './types';

export const mathsSession: Session = {
  id: 'maths-fractions-1',
  subject: 'maths',
  title: 'Fractions: Equal Parts, Different Names',
  victorianCode: 'VCMNA159 · VCMNA160',
  description: 'Explore equivalent fractions, count by halves, quarters and thirds, and place fractions on a number line.',
  yearLevel: 4,
  estimatedMinutes: 55,
  starsAvailable: 10,
  color: '#10b981',
  icon: '🔢',
  steps: [
    {
      id: 'maths-video-1',
      type: 'video',
      title: 'What Are Fractions? (A Quick Refresher)',
      duration: '5 min',
      youtubeId: 'n0FZhQ_GkKo',
      description: 'Fractions show us equal parts of a whole. Watch how a pizza, a chocolate bar, and a number line can all help us understand fractions.',
      teacherNote: 'Pause at 1:45 to check students can name the numerator and denominator. Ask: "If I eat 3 slices of a pizza cut into 8 equal pieces, what fraction did I eat?"',
      keyPoints: [
        'The **denominator** (bottom number) tells us how many equal parts the whole is cut into',
        'The **numerator** (top number) tells us how many parts we have',
        'Fractions must always be **equal parts** — otherwise it\'s not fair!',
      ],
    },
    {
      id: 'maths-example-1',
      type: 'worked-example',
      title: 'Equivalent Fractions — Same Amount, Different Name',
      teacherNote: 'Use physical paper folding if possible: fold an A4 sheet in half (1/2), then fold again to show 2/4 is the same. Students are often surprised.',
      content: {
        heading: 'Equivalent Fractions',
        body: [
          {
            label: '🍕 What are equivalent fractions?',
            text: 'Equivalent fractions look different but are worth exactly the same amount. Imagine cutting a pizza into 2 equal slices and taking 1 slice. That\'s ½. Now cut the SAME pizza into 4 equal slices — you\'d take 2 slices to get the same amount. So ½ = 2/4.',
            highlight: 'green',
          },
          {
            label: '📐 How to find equivalent fractions',
            text: 'Multiply (or divide) BOTH the numerator and denominator by the same number:\n\n1/2 × 2/2 = 2/4 ✓\n1/2 × 3/3 = 3/6 ✓\n1/2 × 4/4 = 4/8 ✓\n\nAs long as you do the same thing to top and bottom, the fraction stays the same value!',
            highlight: 'blue',
          },
          {
            label: '🔍 Simplifying fractions',
            text: 'We can also go the other way — make a fraction simpler by dividing top and bottom by the same number.\n\n4/8 ÷ 4/4 = 1/2\n6/9 ÷ 3/3 = 2/3\n\nThe simplest form uses the smallest possible numbers.',
            highlight: 'purple',
          },
        ],
        questions: [
          { q: 'What is an equivalent fraction for 2/3?', a: '4/6, 6/9, 8/12 (any correct multiple)' },
          { q: 'What is 6/8 in its simplest form?', a: '3/4' },
          { q: 'How do you check if two fractions are equivalent?', a: 'Cross-multiply and check if the products are equal, or simplify both fractions' },
        ],
      },
    },
    {
      id: 'maths-example-2',
      type: 'worked-example',
      title: 'Fractions on a Number Line',
      teacherNote: 'Draw a number line on the board from 0 to 2. Plot 1/4, 1/2, 3/4, 1, 1¼, 1½ together as a class.',
      content: {
        heading: 'Placing Fractions on a Number Line',
        body: [
          {
            label: '📏 Setting up the number line',
            text: 'To place fractions on a number line:\n1. Draw a line from 0 to 1 (or further)\n2. Divide the space into EQUAL parts — as many as the denominator\n3. Count along to find your fraction\n\nFor quarters: divide 0→1 into 4 equal jumps. Then 1/4, 2/4, 3/4, 4/4=1',
            highlight: 'blue',
          },
          {
            label: '🔢 Counting by quarters',
            text: 'Count along in quarters:\n0, ¼, ½, ¾, 1, 1¼, 1½, 1¾, 2\n\nNotice that 2/4 = ½ and 4/4 = 1. The number line shows us equivalent fractions at exactly the same point!',
            highlight: 'green',
          },
          {
            label: '🔢 Counting by thirds',
            text: 'Count along in thirds:\n0, ⅓, ⅔, 1, 1⅓, 1⅔, 2\n\nMixed numbers like 1⅓ mean "one whole AND one third". On the number line, this sits between 1 and 2.',
            highlight: 'orange',
          },
        ],
        questions: [
          { q: 'Where does 3/4 sit on a number line between 0 and 1?', a: 'Three-quarters of the way between 0 and 1' },
          { q: 'Is 5/4 more or less than 1?', a: 'More than 1 (it equals 1¼)' },
          { q: 'What mixed number is the same as 7/3?', a: '2 and 1/3 (2⅓)' },
        ],
      },
    },
    {
      id: 'maths-quiz-1',
      type: 'quiz',
      title: 'Fractions Practice Questions',
      teacherNote: 'Q3 and Q5 are the most challenging — give students extra thinking time. Encourage them to draw a diagram.',
      questions: [
        {
          id: 'mq1',
          text: 'Which fraction is equivalent to 1/2?',
          image: null,
          options: ['1/3', '3/4', '4/8', '2/3'],
          correct: 2,
          explanation: '4/8 = 4÷4 / 8÷4 = **1/2**. You can check by multiplying: 1×8 = 8, and 2×4 = 8. Equal! ✓',
        },
        {
          id: 'mq2',
          text: 'What fraction of this shape is shaded?\n\n▓▓▓░ (3 out of 4 equal squares)',
          image: null,
          options: ['1/4', '3/4', '1/3', '3/3'],
          correct: 1,
          explanation: '3 parts are shaded out of 4 equal parts total. That\'s **3/4** (three-quarters).',
        },
        {
          id: 'mq3',
          text: 'Put these fractions in order from SMALLEST to LARGEST:\n1/4, 3/4, 1/2, 1/8',
          image: null,
          options: [
            '1/8, 1/4, 1/2, 3/4',
            '1/4, 1/8, 1/2, 3/4',
            '1/8, 1/2, 1/4, 3/4',
            '3/4, 1/2, 1/4, 1/8',
          ],
          correct: 0,
          explanation: 'Convert to eighths: 1/8, 2/8, 4/8, 6/8. In order: **1/8, 1/4, 1/2, 3/4**. Using a number line really helps here!',
        },
        {
          id: 'mq4',
          text: 'James counted by quarters: 0, 1/4, 2/4, 3/4, ___. What comes next?',
          image: null,
          options: ['4/4', '5/4', '1/2', '3/4'],
          correct: 0,
          explanation: '4/4 = **1 whole**. When your numerator equals the denominator, you\'ve made one complete whole!',
        },
        {
          id: 'mq5',
          text: 'Emma has 2/3 of a chocolate bar. Ben has 4/6 of a chocolate bar (the same size). Who has more?',
          image: null,
          options: ['Emma has more', 'Ben has more', 'They have the same amount', 'Not enough information'],
          correct: 2,
          explanation: '2/3 = 4/6 — they are **equivalent fractions**! Multiply 2/3 by 2/2 and you get 4/6. Both students have exactly the same amount. 🍫',
        },
        {
          id: 'mq6',
          text: 'Which point on the number line shows 1½?\n(0 ——¼——½——¾——1——?——1½——1¾——2)',
          image: null,
          options: ['Between 1 and 1¼', 'Between 1¼ and 1½', 'At the 6th mark from 0', 'Between 1¾ and 2'],
          correct: 2,
          explanation: 'Counting in quarters from 0: 0, ¼, ½, ¾, 1, 1¼, **1½** — that\'s the **6th mark** (or jump). 1½ = 1 whole + 2 quarters.',
        },
      ],
    },
    {
      id: 'maths-free-1',
      type: 'free-response',
      title: 'Show Your Thinking',
      teacherNote: 'These open-ended questions assess deeper understanding. Mark generously — value reasoning over perfect notation.',
      prompt: 'Answer these questions in full sentences. Show how you worked it out!',
      fields: [
        {
          id: 'mf1',
          label: '🍕 Question 1: A pizza is cut into 8 equal slices. Priya eats 2 slices. Write her share as a fraction and then find one equivalent fraction.',
          placeholder: 'Priya eats... which is the same as...',
        },
        {
          id: 'mf2',
          label: '📏 Question 2: Draw a number line from 0 to 2 and mark these fractions on it: 1/3, 2/3, 1, 1⅓, 2. Describe where each one sits.',
          placeholder: 'On my number line, 1/3 is...',
        },
        {
          id: 'mf3',
          label: '🤔 Question 3 (Challenge!): Explain in your own words why 3/6 and 1/2 are the same amount. Use a drawing or an example to help.',
          placeholder: 'I think 3/6 and 1/2 are equal because...',
        },
      ],
    },
    {
      id: 'maths-homework-1',
      type: 'homework',
      title: 'Homework: Fractions in Real Life',
      teacherNote: 'Due next class. These tasks encourage students to find fractions in their everyday environment.',
      dueNext: true,
      tasks: [
        {
          id: 'hw-m1',
          label: 'Find a fraction in your kitchen — a recipe, food packaging, or measuring cup. Write it down and explain what the numerator and denominator mean.',
          hint: 'e.g. "½ cup of flour means 1 part out of 2 equal parts that make one cup"',
        },
        {
          id: 'hw-m2',
          label: 'Complete: 1/4 = __/8 = __/12. Show how you worked it out.',
          hint: 'Multiply the top and bottom by the same number each time.',
        },
        {
          id: 'hw-m3',
          label: 'Draw a number line from 0 to 3 and mark at least 8 fractions on it (use halves, quarters or thirds).',
          hint: 'Label each one clearly — don\'t forget the mixed numbers like 1½ and 2¼!',
        },
        {
          id: 'hw-m4',
          label: 'CHALLENGE: Can you find 3 different fractions that are all equivalent to 2/4? Write them out.',
          hint: 'Try multiplying both numbers by 2, 3, and 5.',
        },
      ],
    },
  ],
};
