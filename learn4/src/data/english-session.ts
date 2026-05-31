import type { Session } from './types';

export const englishSession: Session = {
  id: 'eng-narrative-1',
  subject: 'english',
  title: 'Narrative Writing: Paint a Picture with Words',
  victorianCode: 'VCELT312 · VCELA311',
  description: 'Learn to write exciting stories with vivid characters, settings, and a problem to solve.',
  yearLevel: 4,
  estimatedMinutes: 55,
  starsAvailable: 10,
  color: '#6366f1',
  icon: '📖',
  steps: [
    {
      id: 'eng-video-1',
      type: 'video',
      title: 'What Makes a Great Story?',
      duration: '6 min',
      youtubeId: 'KwO_FuUy7B8',
      description: 'Watch how every great story has three parts: a beginning that sets the scene, a middle with a problem, and an end where things are worked out.',
      teacherNote: 'This video introduces the three-part narrative structure (orientation, complication, resolution). Pause at 2:30 to check students understand "orientation".',
      keyPoints: [
        'Every story needs characters and a setting — this is called the **orientation**',
        'Something goes wrong or tricky — this is the **complication**',
        'The character works it out — this is the **resolution**',
      ],
    },
    {
      id: 'eng-example-1',
      type: 'worked-example',
      title: 'Read This Story Together',
      teacherNote: 'Read aloud together. Ask students to put their hand up when they notice the complication.',
      content: {
        heading: 'The Lost Compass',
        body: [
          {
            label: '🟢 Orientation (Beginning)',
            text: 'Mia loved exploring the bushland behind her grandmother\'s house. Every Saturday morning, she tucked her old brass compass into her pocket and set off through the tall gum trees, listening to the kookaburras laugh overhead. The bush smelled like eucalyptus and warm earth.',
            highlight: 'green',
          },
          {
            label: '🟠 Complication (Problem)',
            text: 'One morning, Mia reached for her compass — but her pocket was empty. Her heart dropped like a stone. Without it, every tree looked the same. The sun had vanished behind thick grey clouds. She turned left, then right, then left again. Nothing looked familiar. "Stay calm," she whispered to herself, but her voice wobbled.',
            highlight: 'orange',
          },
          {
            label: '🔵 Resolution (Ending)',
            text: 'Then Mia remembered what her grandmother always said: "Moss grows on the south side of trees." She crouched down and ran her fingers along the bark. Soft, damp moss — pointing south. Slowly, carefully, she followed the trees home. When the red roof of the farmhouse appeared through the leaves, Mia let out a long, shaky breath. She\'d found her own way back.',
            highlight: 'blue',
          },
        ],
        questions: [
          { q: 'Who is the character in this story?', a: 'Mia' },
          { q: 'What is the setting?', a: 'Bushland / behind her grandmother\'s house' },
          { q: 'What is the complication (problem)?', a: 'She lost her compass and got lost' },
          { q: 'How did Mia solve her problem?', a: 'She remembered that moss grows on the south side of trees' },
        ],
      },
    },
    {
      id: 'eng-quiz-1',
      type: 'quiz',
      title: 'Check Your Understanding',
      teacherNote: 'Students should attempt independently. Review answers as a class before moving on.',
      questions: [
        {
          id: 'eq1',
          text: 'Which part of the story introduces the characters and setting?',
          image: null,
          options: ['Complication', 'Resolution', 'Orientation', 'Conclusion'],
          correct: 2,
          explanation: 'The **orientation** is the beginning of a narrative. It introduces who the story is about and where/when it happens.',
        },
        {
          id: 'eq2',
          text: 'In "The Lost Compass", what is the complication?',
          image: null,
          options: [
            'Mia loves exploring the bush',
            'Mia\'s compass goes missing and she gets lost',
            'Mia finds her way home using moss',
            'Kookaburras are laughing in the trees',
          ],
          correct: 1,
          explanation: 'The complication is the **problem** in the story. Mia losing her compass and not knowing which way to go is the complication.',
        },
        {
          id: 'eq3',
          text: 'Which sentence uses the BEST descriptive language?',
          image: null,
          options: [
            'The dog ran fast.',
            'The dog moved quickly through the park.',
            'The enormous, shaggy dog bolted across the sunlit park, paws thundering on the grass.',
            'The dog was big and it ran.',
          ],
          correct: 2,
          explanation: 'Great descriptions use **adjectives** (enormous, shaggy), **adverbs** (thundering), and **specific verbs** (bolted) to paint a picture in the reader\'s mind.',
        },
        {
          id: 'eq4',
          text: 'A writer wants to describe a stormy night. Which words are MOST useful?',
          image: null,
          options: [
            'nice, good, big, dark',
            'howling, jagged, pelting, ominous',
            'happy, bright, warm, cheerful',
            'average, normal, okay, fine',
          ],
          correct: 1,
          explanation: 'Powerful descriptive words like **howling wind**, **jagged lightning**, and **pelting rain** make the reader feel like they\'re really there.',
        },
        {
          id: 'eq5',
          text: 'What should a story\'s resolution do?',
          image: null,
          options: [
            'Introduce a brand new problem',
            'Describe the setting in detail',
            'Show how the character solves the problem or what they learn',
            'List all the characters in the story',
          ],
          correct: 2,
          explanation: 'The resolution **wraps up** the story. It shows how the problem is solved and often shows what the character has learned or how they have changed.',
        },
      ],
    },
    {
      id: 'eng-example-2',
      type: 'worked-example',
      title: 'How to Plan Your Narrative',
      teacherNote: 'Model filling in the story map on the board before students complete their own.',
      content: {
        heading: 'Use a Story Map to Plan',
        body: [
          {
            label: '✏️ Step 1 — Choose your character',
            text: 'Think about WHO your story is about. Give them a name and one or two interesting details. Example: "Jasper is a 9-year-old who is afraid of the dark but loves astronomy."',
            highlight: 'purple',
          },
          {
            label: '🗺️ Step 2 — Choose your setting',
            text: 'WHERE and WHEN does the story happen? Be specific! Instead of "a forest", try "a misty forest on the coldest morning of the year". Instead of "school", try "a crumbling old library at the back of the school".',
            highlight: 'blue',
          },
          {
            label: '⚡ Step 3 — Create your complication',
            text: 'What goes WRONG? The best complications put your character in a situation where they must use their personality to solve it. Example: Jasper gets locked in the school observatory alone at night — his biggest fear.',
            highlight: 'orange',
          },
          {
            label: '🌟 Step 4 — Plan your resolution',
            text: 'How does your character fix it? Try to make the solution come from the character\'s own skills or personality. Jasper uses his knowledge of star positions to signal for help with a torch — his love of astronomy saves him!',
            highlight: 'green',
          },
        ],
        questions: [
          { q: 'What makes a setting interesting?', a: 'Being specific — giving details like time, weather, place' },
          { q: 'Why is it good when the character uses their own skills to solve the problem?', a: 'It makes the story feel believable and shows character growth' },
        ],
      },
    },
    {
      id: 'eng-free-1',
      type: 'free-response',
      title: 'Plan Your Own Story',
      teacherNote: 'Allow 12–15 minutes. Encourage students to share their setting ideas with a partner before writing.',
      prompt: 'Fill in your story map below. Use the examples from the lesson to help you.',
      fields: [
        { id: 'character', label: '🧒 My character\'s name and one interesting fact about them', placeholder: 'e.g. Lily, who can talk to animals but they never listen to her...' },
        { id: 'setting', label: '🌍 My setting — where and when? Add 2 descriptive details!', placeholder: 'e.g. A foggy harbour at dawn, where fishing boats creak and the water is ink-black...' },
        { id: 'complication', label: '⚡ What goes wrong? (The complication)', placeholder: 'e.g. A seal steals the lighthouse keeper\'s key and Lily is the only one who can talk to it...' },
        { id: 'resolution', label: '🌟 How does the character solve it?', placeholder: 'e.g. Lily convinces the seal to return the key by promising to bring fresh fish...' },
      ],
    },
    {
      id: 'eng-free-2',
      type: 'free-response',
      title: 'Write Your Story Opening',
      teacherNote: 'Students write 1–2 paragraphs (orientation only). Encourage at least 3 descriptive words and one piece of dialogue.',
      prompt: 'Using your story map, write the BEGINNING of your story (the orientation). Try to:\n• Use at least 3 descriptive words\n• Tell us WHO is in the story and WHERE they are\n• Make the reader want to keep reading!',
      fields: [
        { id: 'story-opening', label: '📝 Write your story opening here', placeholder: 'Start your story...', multiline: true, minRows: 8 },
      ],
    },
    {
      id: 'eng-homework-1',
      type: 'homework',
      title: 'Homework: Finish Your Story!',
      teacherNote: 'Due at next class. Remind students to use their story map. Suggest 20–25 minutes at home.',
      dueNext: true,
      tasks: [
        {
          id: 'hw-eng-1',
          label: 'Write the COMPLICATION — at least 2 sentences describing the problem',
          hint: 'Use exciting words! How does your character feel? What do they see, hear or smell?',
        },
        {
          id: 'hw-eng-2',
          label: 'Write the RESOLUTION — how the problem is solved (2–3 sentences)',
          hint: 'Try to make your character solve the problem themselves using their special skill or knowledge.',
        },
        {
          id: 'hw-eng-3',
          label: 'Add at least ONE example of dialogue (someone speaking)',
          hint: 'Remember speech marks! e.g. "I\'ve got an idea," said Leo, grinning.',
        },
        {
          id: 'hw-eng-4',
          label: 'Read your whole story aloud to someone at home',
          hint: 'Does it make sense? Does it sound exciting? Change anything that feels boring.',
        },
      ],
    },
  ],
};
