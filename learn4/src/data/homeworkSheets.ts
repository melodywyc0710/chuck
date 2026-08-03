export interface HomeworkSheet {
  sessionId: string;
  title: string;
  subject: string;
  yearLevel: number;
  victorianCode: string;
  sections: HomeworkSection[];
}

export interface HomeworkSection {
  heading: string;
  instructions: string;
  questions: HomeworkQuestion[];
}

export interface HomeworkQuestion {
  number: number;
  text: string;
  lines: number; // how many answer lines to show (1 = short answer, 3+ = extended)
  hasBox?: boolean; // show a large answer box instead of lines
}

export const homeworkSheets: Record<string, HomeworkSheet> = {

  // ─────────────────────────────────────────────────────────────
  // Y4 ENGLISH
  // ─────────────────────────────────────────────────────────────

  'y4-eng-01': {
    sessionId: 'y4-eng-01',
    title: 'Narrative Story Structure',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-NAR-01',
    sections: [
      {
        heading: 'Section 1 – Story Structure Knowledge',
        instructions: 'Answer the following questions about narrative structure.',
        questions: [
          { number: 1, text: 'Label the three main parts of a narrative story in order: __________, __________, __________', lines: 1 },
          { number: 2, text: 'Write a definition for "orientation" in your own words.', lines: 2 },
          { number: 3, text: 'Write a definition for "complication" in your own words.', lines: 2 },
          { number: 4, text: 'Write a definition for "resolution" in your own words.', lines: 2 },
          { number: 5, text: 'Read this passage: "Mia had always loved the old lighthouse at the edge of town. One stormy night, she noticed its light had gone dark — and ships were heading straight for the rocks." Which part of a story is this? Circle one: Orientation / Complication / Resolution. Explain why.', lines: 2 },
          { number: 6, text: 'Read this passage: "By morning, the lighthouse beam swept safely across the bay. Mia smiled, knowing she had saved the sailors." Which part of the story is this? Circle one: Orientation / Complication / Resolution. Explain why.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Reading Task',
        instructions: 'Read the following story extract carefully, then answer the questions below.',
        questions: [
          { number: 7, text: 'STORY EXTRACT: The Lost Kite\n\nTom had been saving his pocket money for three whole months to buy the biggest kite in Mr. Patel\'s shop. It was bright red with a golden dragon on it. On the first day of spring, he raced to the park, unspooled the string, and let it soar.\n\nBut then a sudden gust of wind tore the string from his hands. The kite tumbled and disappeared over the tall oak trees at the edge of the park.\n\nTom searched for an hour. Just as he was about to give up, he heard a small voice: "Is this your kite, mister?" A girl no older than six stood there, holding the golden dragon, grinning. Tom laughed so hard his sides ached.\n\nWhere does this story take place? Use evidence from the text.', lines: 2 },
          { number: 8, text: 'Who is the main character? What do we learn about him in the orientation?', lines: 2 },
          { number: 9, text: 'What is the complication in this story? Write it in your own words.', lines: 2 },
          { number: 10, text: 'How is the complication resolved? Is it a satisfying resolution? Why or why not?', lines: 3 },
          { number: 11, text: 'What is the mood of this story? Choose one word and explain using evidence from the text.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Planning Your Story',
        instructions: 'Use this story planner to plan your own short narrative. Fill in every box.',
        questions: [
          { number: 12, text: 'Character name and brief description (who is your main character? What do they want?)', lines: 2 },
          { number: 13, text: 'Setting (when and where does your story take place? What does it look, sound and feel like?)', lines: 2 },
          { number: 14, text: 'Problem / Complication (what goes wrong? What obstacle or conflict does your character face?)', lines: 2 },
          { number: 15, text: 'Solution / Resolution (how does your character solve the problem? What do they learn?)', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Using your planner from Section 3, write a complete short story. Your story must have a clear orientation, complication, and resolution. Write at least 3 paragraphs. Use interesting words, vary your sentences, and check your punctuation when you finish.',
        questions: [
          { number: 16, text: 'Write your narrative story here. Use your planner! Aim for at least 150 words.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-02': {
    sessionId: 'y4-eng-02',
    title: 'Character Development',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-NAR-02',
    sections: [
      {
        heading: 'Section 1 – Character Analysis',
        instructions: 'For each character below, identify their main want and their flaw.',
        questions: [
          { number: 1, text: 'Character: Harry Potter. Want: _______________. Flaw: _______________', lines: 1 },
          { number: 2, text: 'Character: Cinderella. Want: _______________. Flaw: _______________', lines: 1 },
          { number: 3, text: 'Character: The BFG (from Roald Dahl). Want: _______________. Flaw: _______________', lines: 1 },
          { number: 4, text: 'Why do flaws make characters more interesting to read about? Give one reason.', lines: 2 },
          { number: 5, text: 'Think of a character from a book you have read. Write their name, one want, and one flaw.', lines: 2 },
          { number: 6, text: 'If a character had no flaws at all, how would that change the story? Explain your thinking.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Show Don\'t Tell',
        instructions: 'Rewrite each "telling" sentence as a "showing" sentence. Do NOT use the word in bold.',
        questions: [
          { number: 7, text: 'TELLING: Jade was nervous.\nYour SHOWING sentence:', lines: 2 },
          { number: 8, text: 'TELLING: The old man was very tired.\nYour SHOWING sentence:', lines: 2 },
          { number: 9, text: 'TELLING: The puppy was excited.\nYour SHOWING sentence:', lines: 2 },
          { number: 10, text: 'TELLING: Sam was angry.\nYour SHOWING sentence:', lines: 2 },
          { number: 11, text: 'TELLING: The classroom was noisy.\nYour SHOWING sentence:', lines: 2 },
          { number: 12, text: 'TELLING: Lily was proud of herself.\nYour SHOWING sentence:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Character Profile',
        instructions: 'Design your own original character by answering all questions below.',
        questions: [
          { number: 13, text: 'Appearance: What does your character look like? Describe their face, clothes, and one unusual feature.', lines: 2 },
          { number: 14, text: 'Personality: List three personality traits. For each trait, give one piece of evidence — what does your character do that shows this trait?', lines: 3 },
          { number: 15, text: 'Want and Flaw: What does your character most want? What is their biggest flaw?', lines: 2 },
          { number: 16, text: 'Challenge: What challenge will your character face because of their flaw? How might they grow?', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Write a character introduction paragraph (one paragraph, minimum 80 words). Introduce your character from Section 3 using show-don\'t-tell. The reader should understand who your character is, what they want, and sense their flaw — but you must SHOW, not TELL.',
        questions: [
          { number: 17, text: 'Character introduction paragraph (show, don\'t tell). Use your profile from Section 3.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-03': {
    sessionId: 'y4-eng-03',
    title: 'Setting & Atmosphere',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-NAR-03',
    sections: [
      {
        heading: 'Section 1 – Sensory Language',
        instructions: 'Label which sense each phrase uses (sight, hearing, smell, taste, touch). Then write your own phrase for three of the senses.',
        questions: [
          { number: 1, text: '"The golden sun melted behind the purple hills." Sense: _______________', lines: 1 },
          { number: 2, text: '"A sour tang of salt and seaweed hung in the breeze." Sense: _______________', lines: 1 },
          { number: 3, text: '"Somewhere deep in the forest, a kookaburra laughed." Sense: _______________', lines: 1 },
          { number: 4, text: '"The dry grass scratched at her ankles." Sense: _______________', lines: 1 },
          { number: 5, text: '"The warm lamington melted on his tongue." Sense: _______________', lines: 1 },
          { number: 6, text: '"The air was thick with the smell of eucalyptus after rain." Sense: _______________', lines: 1 },
          { number: 7, text: 'Write your own SIGHT phrase about a park or beach:', lines: 1 },
          { number: 8, text: 'Write your own SOUND phrase about a rainy night:', lines: 1 },
          { number: 9, text: 'Write your own SMELL phrase about an outdoor market:', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Simile & Metaphor',
        instructions: 'Identify the device used (simile or metaphor), then complete or write your own.',
        questions: [
          { number: 10, text: '"The moon was a silver coin in the dark sky." Device: ___. Explain what it means:', lines: 1 },
          { number: 11, text: '"Her voice was like warm honey." Device: ___. Explain what it means:', lines: 1 },
          { number: 12, text: '"The wind was an angry giant, shaking the trees." Device: ___. Explain what it means:', lines: 1 },
          { number: 13, text: 'Complete this simile: "The thunder was as loud as _______________"', lines: 1 },
          { number: 14, text: 'Complete this metaphor: "The city at night is _______________"', lines: 1 },
          { number: 15, text: 'Write your own original simile about the ocean:', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Setting Description Analysis',
        instructions: 'Read this model paragraph, then answer the analysis questions.',
        questions: [
          { number: 16, text: 'MODEL PARAGRAPH:\n"The old bush track wound between red gum trees whose bark peeled away in strips like sunburnt skin. Cicadas screamed in waves, so loud that Maya had to shout to hear herself think. The air tasted of dust and dry heat, and every rock glittered as if scattered with broken glass."\n\nIdentify a SIMILE in this paragraph. Write it out and explain what it compares.', lines: 2 },
          { number: 17, text: 'Identify a METAPHOR or personification in this paragraph. Write it out and explain the effect.', lines: 2 },
          { number: 18, text: 'List THREE senses the writer uses in this paragraph and give one example for each.', lines: 3 },
          { number: 19, text: 'What ATMOSPHERE or mood does this paragraph create? Use at least two words from the text to support your answer.', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Write a setting description of an Australian location (e.g., the outback, a rainforest, a beach, a city at dusk). You must include: all 5 senses, at least 1 simile, and at least 1 metaphor or personification. Aim for at least 120 words.',
        questions: [
          { number: 20, text: 'Setting description of an Australian location. Use all 5 senses + 2 figurative language devices.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-04': {
    sessionId: 'y4-eng-04',
    title: 'Dialogue',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-NAR-04',
    sections: [
      {
        heading: 'Section 1 – Punctuation Rules',
        instructions: 'Add the missing punctuation (inverted commas, commas, full stops, capital letters, new paragraph marks) to each dialogue sentence.',
        questions: [
          { number: 1, text: 'Add all missing punctuation: come on said Jake we\'re going to be late', lines: 2 },
          { number: 2, text: 'Add all missing punctuation: i don\'t want to go whispered Emma', lines: 2 },
          { number: 3, text: 'Add all missing punctuation: what time does the bus leave asked Dad', lines: 2 },
          { number: 4, text: 'Add all missing punctuation: it was absolutely perfect shouted Mei this is the best day ever', lines: 2 },
          { number: 5, text: 'Add all missing punctuation: look out cried the captain a whale is right below us', lines: 2 },
          { number: 6, text: 'Write TWO rules about punctuating dialogue that you know. Rule 1: _______________. Rule 2: _______________.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Reporting Verbs',
        instructions: 'Replace the word "said" with a more precise reporting verb. Then explain in one word the emotion it adds.',
        questions: [
          { number: 7, text: '"I\'m not going!" said Maya.\nBetter verb: _______________. Emotion it adds: _______________', lines: 1 },
          { number: 8, text: '"Do you want to know a secret?" said Tom.\nBetter verb: _______________. Emotion it adds: _______________', lines: 1 },
          { number: 9, text: '"I\'ve lost my bag," said Lucy.\nBetter verb: _______________. Emotion it adds: _______________', lines: 1 },
          { number: 10, text: '"Look at the size of that spider!" said James.\nBetter verb: _______________. Emotion it adds: _______________', lines: 1 },
          { number: 11, text: 'List SIX other reporting verbs you could use instead of "said": 1. ___ 2. ___ 3. ___ 4. ___ 5. ___ 6. ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Dialogue Analysis',
        instructions: 'Read this dialogue passage and answer the questions.',
        questions: [
          { number: 12, text: 'PASSAGE:\n"Grandma, why do you still keep that old photograph?" Zoe asked, settling beside her on the porch swing.\n\nGrandma\'s fingers traced the faded edges. "Because some things," she murmured, "are worth remembering exactly as they were."\n\n"Who are they?" Zoe pressed.\n\n"People I loved," said Grandma simply. "People the sea took."\n\nHow many speakers are there? Name them: _______________', lines: 1 },
          { number: 13, text: 'Find one reporting verb other than "said". Write it and explain what emotion it shows.', lines: 2 },
          { number: 14, text: 'Why does the writer begin a new paragraph for each new speaker? Explain in your own words.', lines: 2 },
          { number: 15, text: 'How does the dialogue help you understand Grandma\'s character? Write 2–3 sentences.', lines: 3 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Write a conversation between two characters (e.g., a child and a grandparent, two friends, a student and a teacher). Include at least 8 exchanges (8 lines of dialogue — 4 per character). Use correct punctuation throughout, start a new paragraph for each speaker, and use a variety of reporting verbs.',
        questions: [
          { number: 16, text: 'Write your dialogue here. At least 8 exchanges, correct punctuation, varied reporting verbs.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-05': {
    sessionId: 'y4-eng-05',
    title: 'Informative Reports',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-INF-01',
    sections: [
      {
        heading: 'Section 1 – Fact vs Opinion',
        instructions: 'Classify each statement as FACT or OPINION. Then explain your reasoning in one sentence.',
        questions: [
          { number: 1, text: '"Australia is home to more than 800 species of birds." F / O. Because: _______________', lines: 1 },
          { number: 2, text: '"The platypus is the most interesting animal in the world." F / O. Because: _______________', lines: 1 },
          { number: 3, text: '"Koalas sleep up to 22 hours a day." F / O. Because: _______________', lines: 1 },
          { number: 4, text: '"Everyone should visit Uluru at least once." F / O. Because: _______________', lines: 1 },
          { number: 5, text: '"The Great Barrier Reef is the world\'s largest coral reef system." F / O. Because: _______________', lines: 1 },
          { number: 6, text: '"Saving water is more important than any other environmental action." F / O. Because: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Report Structure',
        instructions: 'Answer questions about report structure, then rewrite informal sentences in a formal style.',
        questions: [
          { number: 7, text: 'Label these four parts of a report in the correct order: Body paragraphs, Conclusion, General classification, Subheadings. Order: 1.___ 2.___ 3.___ 4.___', lines: 1 },
          { number: 8, text: 'What is the purpose of a general classification (opening section) in an informative report?', lines: 2 },
          { number: 9, text: 'Rewrite this informal sentence formally: "Kangaroos are super cool and they can jump really far."', lines: 2 },
          { number: 10, text: 'Rewrite this informal sentence formally: "You wouldn\'t believe how long crocodiles can live — like, 70 years or something!"', lines: 2 },
          { number: 11, text: 'Rewrite this informal sentence formally: "Wombats are kinda weird because they poop squares and their poo is cube-shaped."', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Research Notes',
        instructions: 'Read the following paragraph about the echidna, then answer the comprehension questions.',
        questions: [
          { number: 12, text: 'PARAGRAPH:\nThe short-beaked echidna (Tachyglossus aculeatus) is one of Australia\'s most fascinating native mammals. It is a monotreme — a mammal that lays eggs rather than giving birth to live young. Echidnas are covered in sharp spines made of keratin, the same protein found in human fingernails. When threatened, they curl into a tight ball, exposing only their spines. They have no teeth; instead, a long sticky tongue allows them to capture ants and termites at great speed. Echidnas live across most of Australia, from rainforests to deserts.\n\nWhat does "monotreme" mean? Use the text to help you.', lines: 2 },
          { number: 13, text: 'How do echidnas protect themselves from predators?', lines: 2 },
          { number: 14, text: 'What do echidnas eat, and how do they catch their food?', lines: 2 },
          { number: 15, text: 'Write down TWO facts from this paragraph that you could use in an informative report about the echidna. Write them as report sentences.', lines: 3 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Write an informative report about any Australian animal you choose. Your report must include 4 sections with headings: (1) General Classification, (2) Appearance, (3) Habitat and Diet, (4) Interesting Facts / Conservation. Use formal language, facts only (no opinions), and at least one technical word in each section.',
        questions: [
          { number: 16, text: 'Informative report about an Australian animal. 4 sections with headings, formal language, facts only.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-06': {
    sessionId: 'y4-eng-06',
    title: 'Explanatory Texts',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'EN4-INF-02',
    sections: [
      {
        heading: 'Section 1 – Cause & Effect',
        instructions: 'For each sentence, identify the CAUSE and the EFFECT. Then write two original cause-and-effect sentences.',
        questions: [
          { number: 1, text: '"Because it rained heavily, the river flooded." CAUSE: ___. EFFECT: ___', lines: 1 },
          { number: 2, text: '"The plants died because they were not watered." CAUSE: ___. EFFECT: ___', lines: 1 },
          { number: 3, text: '"When the temperature drops below zero, water turns to ice." CAUSE: ___. EFFECT: ___', lines: 1 },
          { number: 4, text: '"The road was slippery, so the car skidded." CAUSE: ___. EFFECT: ___', lines: 1 },
          { number: 5, text: 'Write your own cause-and-effect sentence about the weather:', lines: 1 },
          { number: 6, text: 'Write your own cause-and-effect sentence about animals or nature:', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Connecting Language',
        instructions: 'Choose the best connective from the box to complete each sentence. Then write two sentences of your own using the given connectives.\n[Box: as a result, because, therefore, when, this causes, which means that, due to]',
        questions: [
          { number: 7, text: '____________ water evaporates from the ocean, it rises into the atmosphere.', lines: 1 },
          { number: 8, text: 'The sun heats the ground, ____________ the air near the surface warms up.', lines: 1 },
          { number: 9, text: '____________ of cooling air temperatures, water vapour condenses into clouds.', lines: 1 },
          { number: 10, text: 'Water droplets combine and grow heavier, ____________ them to fall as rain.', lines: 1 },
          { number: 11, text: 'Write a sentence using "therefore": _______________', lines: 1 },
          { number: 12, text: 'Write a sentence using "as a result": _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Flow Chart',
        instructions: 'Sequence the steps of a process, then create a simple flow chart.',
        questions: [
          { number: 13, text: 'These steps for making toast are out of order. Number them 1–5 in the correct order:\n___ Put the toast on a plate.\n___ Place bread in the toaster.\n___ Spread butter on the toast.\n___ Wait for the toast to pop up.\n___ Press down the toaster lever.', lines: 1 },
          { number: 14, text: 'Draw a simple flow chart (boxes with arrows) showing the 5 steps above in the correct order.', lines: 0, hasBox: true },
          { number: 15, text: 'Choose ONE process below and list its steps in order: (A) How a caterpillar becomes a butterfly, (B) How bread is baked, (C) How a seed grows into a plant. Write at least 4 steps.', lines: 3 },
          { number: 16, text: 'What connective words (e.g., first, next, then, finally) are useful when explaining a process? List at least five: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 4 – Writing Task',
        instructions: 'Write an explanation of how something works. Choose one topic: (A) How rain forms, (B) How bread is made, (C) How a volcano erupts, (D) How a plant makes food. Your explanation must include: a title, a general statement, numbered or sequenced steps with connectives, cause-and-effect language, and a concluding sentence.',
        questions: [
          { number: 17, text: 'Explanation text. Include title, general statement, sequenced steps with connectives, cause-effect language, and conclusion.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Y4 MATHS
  // ─────────────────────────────────────────────────────────────

  'y4-mat-01': {
    sessionId: 'y4-mat-01',
    title: 'Place Value to 10,000',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-NUM-01',
    sections: [
      {
        heading: 'Section 1 – Read & Write Numbers',
        instructions: 'Write numbers in words, words as digits, or identify the value of a digit.',
        questions: [
          { number: 1, text: 'Write 3,472 in words: _______________', lines: 1 },
          { number: 2, text: 'Write 9,065 in words: _______________', lines: 1 },
          { number: 3, text: 'Write in digits: "six thousand, three hundred and four" _______________', lines: 1 },
          { number: 4, text: 'Write in digits: "eight thousand and seventy-one" _______________', lines: 1 },
          { number: 5, text: 'In the number 7,284, what is the value of the digit 7? _______________', lines: 1 },
          { number: 6, text: 'In the number 5,639, what is the value of the digit 3? _______________', lines: 1 },
          { number: 7, text: 'In the number 4,801, the digit 8 is in the _____________ place, so its value is _____________.', lines: 1 },
          { number: 8, text: 'Write a 4-digit number where the thousands digit is 6, the hundreds digit is 0, the tens digit is 5, and the ones digit is 9. _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Expanded Form',
        instructions: 'Write numbers in expanded form, or write the standard number from expanded form.',
        questions: [
          { number: 9, text: 'Write 2,735 in expanded form: ___ + ___ + ___ + ___', lines: 1 },
          { number: 10, text: 'Write 6,408 in expanded form: ___ + ___ + ___ + ___', lines: 1 },
          { number: 11, text: 'Write 9,050 in expanded form: ___ + ___ + ___ + ___', lines: 1 },
          { number: 12, text: 'Write as a standard number: 4,000 + 300 + 60 + 7 = _______________', lines: 1 },
          { number: 13, text: 'Write as a standard number: 7,000 + 0 + 40 + 2 = _______________', lines: 1 },
          { number: 14, text: 'Write as a standard number: 1,000 + 900 + 0 + 5 = _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Compare & Order',
        instructions: 'Use >, < or = to compare numbers, order sets from smallest to largest, and find numbers in between.',
        questions: [
          { number: 15, text: '4,382 ___ 4,823', lines: 1 },
          { number: 16, text: '7,099 ___ 7,100', lines: 1 },
          { number: 17, text: '5,500 ___ 5,500', lines: 1 },
          { number: 18, text: 'Order from smallest to largest: 6,741 / 6,174 / 6,471 / 6,714\n_______________', lines: 1 },
          { number: 19, text: 'Order from largest to smallest: 3,208 / 3,820 / 3,028 / 3,802\n_______________', lines: 1 },
          { number: 20, text: 'Write THREE numbers that are between 5,000 and 5,010: ___, ___, ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Read each problem carefully. Show your working and write a sentence answer.',
        questions: [
          { number: 21, text: 'A library has 4,285 books. It receives a donation of 1,000 more books. How many books does it have now? Show working:', lines: 2 },
          { number: 22, text: 'A farmer counted 3,640 sheep on Monday and 3,460 sheep on Tuesday. On which day were there more sheep? How many more?', lines: 2 },
          { number: 23, text: 'A school fundraiser collected $2,053 last year and $2,305 this year. How much more was raised this year? Show working:', lines: 2 },
          { number: 24, text: 'The distance from Sydney to Melbourne is 8,757 metres on a map (not in real life!). The distance from Sydney to Brisbane is 9,205 metres on the same map. Write both distances in words and state which is further.', lines: 3 },
        ],
      },
    ],
  },

  'y4-mat-02': {
    sessionId: 'y4-mat-02',
    title: 'Addition Strategies',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-ADD-01',
    sections: [
      {
        heading: 'Section 1 – Mental Strategies',
        instructions: 'Use the jump strategy (count on from the larger number) or the split strategy (split into hundreds, tens, ones) to solve these. Show your method.',
        questions: [
          { number: 1, text: '347 + 125 = ___  Strategy used: _______________', lines: 1 },
          { number: 2, text: '462 + 234 = ___  Strategy used: _______________', lines: 1 },
          { number: 3, text: '581 + 199 = ___  Strategy used: _______________', lines: 1 },
          { number: 4, text: '743 + 158 = ___  Strategy used: _______________', lines: 1 },
          { number: 5, text: '265 + 435 = ___  Strategy used: _______________', lines: 1 },
          { number: 6, text: '829 + 164 = ___  Strategy used: _______________', lines: 1 },
          { number: 7, text: '476 + 347 = ___  Show split strategy working:  400+300=___ 70+40=___ 6+7=___ Total:___', lines: 1 },
          { number: 8, text: '568 + 275 = ___  Show split strategy working:  500+200=___ 60+70=___ 8+5=___ Total:___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Written Algorithm (Column Addition)',
        instructions: 'Set out each addition in columns and solve. Show all carrying.',
        questions: [
          { number: 9, text: '   3 4 7\n+ 2 8 5\n───────\n= ___', lines: 2 },
          { number: 10, text: '   5 6 8\n+ 3 7 4\n───────\n= ___', lines: 2 },
          { number: 11, text: '   7 4 9\n+ 1 8 6\n───────\n= ___', lines: 2 },
          { number: 12, text: '  2 4 8 3\n+ 1 6 5 7\n────────\n= ___', lines: 2 },
          { number: 13, text: '  3 7 9 4\n+ 2 4 8 9\n────────\n= ___', lines: 2 },
          { number: 14, text: '  4 5 6 7\n+ 3 8 9 4\n────────\n= ___', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Missing Numbers',
        instructions: 'Find the missing number (the missing addend) in each equation.',
        questions: [
          { number: 15, text: '___ + 246 = 500.  Answer: ___  Working: _______________', lines: 1 },
          { number: 16, text: '374 + ___ = 600.  Answer: ___  Working: _______________', lines: 1 },
          { number: 17, text: '___ + 589 = 1000. Answer: ___  Working: _______________', lines: 1 },
          { number: 18, text: '1,245 + ___ = 2,000. Answer: ___  Working: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Read each problem. Show your working clearly and write a sentence answer.',
        questions: [
          { number: 19, text: 'A school canteen sold 347 meat pies on Monday and 289 on Tuesday. How many pies were sold over the two days? Show working:', lines: 3 },
          { number: 20, text: 'Mia scored 1,456 points on level 1 of a game and 2,378 points on level 2. What was her total score? Show working:', lines: 3 },
          { number: 21, text: 'A bus trip covers 384 km on the first day, 275 km on the second day, and 198 km on the third day. What is the total distance? Show working:', lines: 3 },
          { number: 22, text: 'Three classes collected cans for a food drive: Year 4A collected 284, Year 4B collected 317, and Year 4C collected 199. What was the total for all three classes? Show working:', lines: 3 },
        ],
      },
    ],
  },

  'y4-mat-03': {
    sessionId: 'y4-mat-03',
    title: 'Subtraction Strategies',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-SUB-01',
    sections: [
      {
        heading: 'Section 1 – Mental Subtraction',
        instructions: 'Use the count-back method or the difference method (counting up to the larger number) to solve these mentally. Write which method you used.',
        questions: [
          { number: 1, text: '500 − 237 = ___  Method: _______________', lines: 1 },
          { number: 2, text: '743 − 125 = ___  Method: _______________', lines: 1 },
          { number: 3, text: '800 − 365 = ___  Method: _______________', lines: 1 },
          { number: 4, text: '621 − 398 = ___  Method: _______________', lines: 1 },
          { number: 5, text: '1,000 − 463 = ___  Method: _______________', lines: 1 },
          { number: 6, text: '954 − 281 = ___  Method: _______________', lines: 1 },
          { number: 7, text: '700 − 456 = ___  Count up from 456 to 700: 456 → ___ → ___ → 700. Difference = ___', lines: 1 },
          { number: 8, text: '2,000 − 786 = ___  Show your count-up working here:', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Written Algorithm (Column Subtraction)',
        instructions: 'Set out each subtraction in columns. Show trading/borrowing where needed.',
        questions: [
          { number: 9, text: '   5 4 3\n−  2 6 7\n───────\n= ___', lines: 2 },
          { number: 10, text: '   8 0 2\n−  3 4 5\n───────\n= ___', lines: 2 },
          { number: 11, text: '   7 3 0\n−  4 8 9\n───────\n= ___', lines: 2 },
          { number: 12, text: '  6 0 0 0\n− 2 7 4 8\n────────\n= ___', lines: 2 },
          { number: 13, text: '  9 3 4 5\n− 4 6 7 8\n────────\n= ___', lines: 2 },
          { number: 14, text: '  7 0 0 4\n− 3 5 8 9\n────────\n= ___', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Checking with Addition',
        instructions: 'Check each subtraction by adding the answer back to the number that was subtracted. Write the check sum.',
        questions: [
          { number: 15, text: '724 − 385 = 339.  Check: 339 + 385 = ___.  Is the answer correct? ___', lines: 1 },
          { number: 16, text: '800 − 264 = 534.  Check: 534 + 264 = ___.  Is the answer correct? ___', lines: 1 },
          { number: 17, text: '5,000 − 1,876 = 3,124.  Check: 3,124 + 1,876 = ___.  Is the answer correct? ___', lines: 1 },
          { number: 18, text: 'Solve AND check: 4,305 − 1,749 = ___.  Check: ___ + ___ = ___.  Correct? ___', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working clearly. Write a sentence answer for each problem.',
        questions: [
          { number: 19, text: 'A cinema has 1,200 seats. On Friday night, 847 seats were filled. How many seats were empty? Show working:', lines: 3 },
          { number: 20, text: 'A train starts with 325 passengers. At the first stop, 148 passengers get off. How many are left? Show working:', lines: 3 },
          { number: 21, text: 'A fundraiser aimed to raise $5,000. So far, $3,248 has been raised. How much more is needed? Show working:', lines: 3 },
          { number: 22, text: 'Mount Kosciuszko is 2,228 metres tall. Mt Buffalo is 1,723 metres tall. What is the difference in height? Show working:', lines: 3 },
        ],
      },
    ],
  },

  'y4-mat-04': {
    sessionId: 'y4-mat-04',
    title: 'Multiplication',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-MUL-01',
    sections: [
      {
        heading: 'Section 1 – Times Tables (Mixed 2–10)',
        instructions: 'Answer as quickly as you can. Circle any you are not sure of and come back to them.',
        questions: [
          { number: 1, text: '7 × 6 = ___   4 × 9 = ___   8 × 3 = ___', lines: 1 },
          { number: 2, text: '5 × 7 = ___   9 × 4 = ___   6 × 8 = ___', lines: 1 },
          { number: 3, text: '3 × 9 = ___   7 × 8 = ___   2 × 6 = ___', lines: 1 },
          { number: 4, text: '10 × 7 = ___  8 × 8 = ___   5 × 9 = ___', lines: 1 },
          { number: 5, text: '6 × 4 = ___   9 × 9 = ___   7 × 3 = ___', lines: 1 },
          { number: 6, text: '4 × 8 = ___   3 × 7 = ___   9 × 6 = ___', lines: 1 },
          { number: 7, text: '8 × 5 = ___   6 × 7 = ___   4 × 4 = ___', lines: 1 },
          { number: 8, text: '9 × 7 = ___   5 × 5 = ___   8 × 6 = ___', lines: 1 },
          { number: 9, text: '3 × 8 = ___   7 × 4 = ___   6 × 6 = ___', lines: 1 },
          { number: 10, text: '10 × 9 = ___  5 × 8 = ___   7 × 7 = ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Arrays',
        instructions: 'Draw or describe arrays, and write the multiplication sentence for each.',
        questions: [
          { number: 11, text: 'Draw an array for 4 × 3. Write the multiplication sentence: ___ × ___ = ___', lines: 2 },
          { number: 12, text: 'Draw an array for 5 × 6. Write the multiplication sentence: ___ × ___ = ___', lines: 2 },
          { number: 13, text: 'This array has 3 rows and 7 columns. Write two multiplication sentences for this array: ___ × ___ = ___ and ___ × ___ = ___', lines: 1 },
          { number: 14, text: 'An egg carton has 2 rows and 6 columns. Draw the array and write the multiplication sentence.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Breakdown Strategy (Distributive Property)',
        instructions: 'Break harder facts into easier ones. For example: 7 × 8 = 7 × (5 + 3) = 35 + 21 = 56.',
        questions: [
          { number: 15, text: '6 × 14 = 6 × (10 + 4) = ___ + ___ = ___', lines: 1 },
          { number: 16, text: '8 × 13 = 8 × (10 + 3) = ___ + ___ = ___', lines: 1 },
          { number: 17, text: '7 × 15 = 7 × (___ + ___) = ___ + ___ = ___', lines: 1 },
          { number: 18, text: 'Use the breakdown strategy to solve 9 × 16. Show your working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 19, text: 'There are 8 classes at school. Each class has 24 students. How many students are there in total? Show working:', lines: 3 },
          { number: 20, text: 'A box holds 6 rows of muffins with 9 muffins in each row. How many muffins are in the box? Show working:', lines: 3 },
          { number: 21, text: 'Lily earns $7 per hour. She worked 15 hours last week. How much did she earn? Show working:', lines: 3 },
          { number: 22, text: 'A garden has 9 rows of sunflowers. Each row has 8 plants. How many sunflowers are there? If each plant grows 3 flowers, how many flowers altogether? Show working:', lines: 4 },
        ],
      },
    ],
  },

  'y4-mat-05': {
    sessionId: 'y4-mat-05',
    title: 'Division',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-DIV-01',
    sections: [
      {
        heading: 'Section 1 – Division Facts',
        instructions: 'Answer these division facts. Remember: division is the inverse of multiplication.',
        questions: [
          { number: 1, text: '42 ÷ 7 = ___   56 ÷ 8 = ___   36 ÷ 6 = ___', lines: 1 },
          { number: 2, text: '45 ÷ 9 = ___   32 ÷ 4 = ___   63 ÷ 7 = ___', lines: 1 },
          { number: 3, text: '72 ÷ 8 = ___   54 ÷ 6 = ___   81 ÷ 9 = ___', lines: 1 },
          { number: 4, text: '28 ÷ 4 = ___   48 ÷ 6 = ___   35 ÷ 5 = ___', lines: 1 },
          { number: 5, text: '64 ÷ 8 = ___   27 ÷ 3 = ___   40 ÷ 5 = ___', lines: 1 },
          { number: 6, text: '49 ÷ 7 = ___   24 ÷ 4 = ___   90 ÷ 9 = ___', lines: 1 },
          { number: 7, text: '18 ÷ 6 = ___   30 ÷ 5 = ___   56 ÷ 7 = ___', lines: 1 },
          { number: 8, text: '100 ÷ 10 = ___ 48 ÷ 8 = ___   21 ÷ 3 = ___', lines: 1 },
          { number: 9, text: 'Sharing: 36 lollies shared equally among 4 friends = ___ lollies each.', lines: 1 },
          { number: 10, text: 'Grouping: How many groups of 6 in 48? ___ groups.', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Remainders',
        instructions: 'Divide and find the remainder. Then interpret what the remainder means in context.',
        questions: [
          { number: 11, text: '25 ÷ 4 = ___ remainder ___. What does the remainder mean here?', lines: 1 },
          { number: 12, text: '37 ÷ 5 = ___ remainder ___. What does the remainder mean here?', lines: 1 },
          { number: 13, text: '50 ÷ 7 = ___ remainder ___. If you were sharing 50 stickers among 7 friends, what would you do with the extras?', lines: 2 },
          { number: 14, text: '83 ÷ 9 = ___ remainder ___. Explain in words what this means.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Fact Families',
        instructions: 'Write all 4 number sentences (fact family) for each set of numbers.',
        questions: [
          { number: 15, text: 'Numbers: 7, 8, 56. Write all 4 facts: ___, ___, ___, ___', lines: 1 },
          { number: 16, text: 'Numbers: 9, 6, 54. Write all 4 facts: ___, ___, ___, ___', lines: 1 },
          { number: 17, text: 'Numbers: 4, 8, 32. Write all 4 facts: ___, ___, ___, ___', lines: 1 },
          { number: 18, text: 'Numbers: 7, 9, 63. Write all 4 facts: ___, ___, ___, ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 19, text: '72 students need to be split into groups of 8 for a sport carnival. How many groups will there be? Show working:', lines: 3 },
          { number: 20, text: 'A baker has 85 cupcakes to pack into boxes of 6. How many full boxes can she make? How many are left over? Show working:', lines: 3 },
          { number: 21, text: 'Sam has 56 stickers. He wants to share them equally among 7 friends. How many does each friend get? Show working:', lines: 3 },
          { number: 22, text: 'A class earns 100 merit points. If each student needs 9 points for a reward, how many students get a reward and how many points are left over? Show working:', lines: 3 },
        ],
      },
    ],
  },

  'y4-mat-06': {
    sessionId: 'y4-mat-06',
    title: 'Fractions',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'MA4-FRA-01',
    sections: [
      {
        heading: 'Section 1 – Name the Fraction',
        instructions: 'For each shape description, shade the correct part and write the fraction.',
        questions: [
          { number: 1, text: 'A rectangle is divided into 4 equal parts. Shade 1 part. The fraction shaded is: ___', lines: 1 },
          { number: 2, text: 'A circle is divided into 8 equal parts. Shade 3 parts. The fraction shaded is: ___', lines: 1 },
          { number: 3, text: 'A shape is divided into 6 equal parts. 5 parts are shaded. Write the fraction for shaded: ___ and not shaded: ___', lines: 1 },
          { number: 4, text: 'A strip is divided into 10 equal parts. 7 parts are shaded. Fraction shaded: ___. Fraction not shaded: ___', lines: 1 },
          { number: 5, text: 'In the fraction 3/5, what does the 3 (numerator) tell us? _______________', lines: 1 },
          { number: 6, text: 'In the fraction 3/5, what does the 5 (denominator) tell us? _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Number Line',
        instructions: 'Mark the given fractions on the number lines provided. Draw the number line if needed.',
        questions: [
          { number: 7, text: 'On a number line from 0 to 1, mark and label: 1/2, 1/4, 3/4. Draw your number line here:', lines: 2 },
          { number: 8, text: 'On a number line from 0 to 1, mark and label: 1/3, 2/3. Draw your number line here:', lines: 2 },
          { number: 9, text: 'On a number line from 0 to 2, mark and label: 1/2, 1, 1 1/2. Draw your number line here:', lines: 2 },
          { number: 10, text: 'What fraction is exactly halfway between 0 and 1/2 on a number line? ___ Explain:', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Equivalent Fractions',
        instructions: 'Find equivalent fractions by multiplying or dividing numerator and denominator by the same number.',
        questions: [
          { number: 11, text: '1/2 = ___/4 = ___/8 = ___/10', lines: 1 },
          { number: 12, text: '2/3 = ___/6 = ___/9 = ___/12', lines: 1 },
          { number: 13, text: '3/4 = ___/8 = ___/12', lines: 1 },
          { number: 14, text: 'Are 4/8 and 1/2 equivalent? Draw a diagram to show why or why not:', lines: 2 },
          { number: 15, text: 'Circle the fraction that is NOT equivalent to 1/3: 2/6  3/9  4/12  5/12. Explain your answer:', lines: 1 },
          { number: 16, text: 'Write two equivalent fractions for 2/5: ___ and ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 17, text: 'Mia ate 3/8 of a pizza. Ben ate 2/8. What fraction did they eat altogether? What fraction was left?', lines: 2 },
          { number: 18, text: 'A ribbon is 1 metre long. Sam uses 3/4 of it for a project. How much ribbon is left? Draw a diagram to help:', lines: 3 },
          { number: 19, text: 'There are 24 students in a class. 1/3 are wearing hats. How many students are wearing hats? Show working:', lines: 2 },
          { number: 20, text: '5/6 of a bag of marbles is blue. There are 30 marbles in the bag. How many are blue? Show working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 5 – Compare Fractions',
        instructions: 'Use <, > or = to compare each pair of fractions. Draw a diagram if it helps you.',
        questions: [
          { number: 21, text: '1/2 ___ 1/4. Explain: _______________', lines: 1 },
          { number: 22, text: '3/8 ___ 3/4. Explain: _______________', lines: 1 },
          { number: 23, text: '2/3 ___ 4/6. Explain: _______________', lines: 1 },
          { number: 24, text: 'Order these fractions from smallest to largest: 3/4, 1/2, 1/8, 7/8\nSmallest → Largest: ___, ___, ___, ___', lines: 1 },
        ],
      },
    ],
  },

  'y4-eng-07': {
    sessionId: 'y4-eng-07',
    title: 'Visualising and Predicting',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELY259',
    sections: [
      {
        heading: 'Section 1 – Visualising',
        instructions: 'Answer the following questions about the visualising strategy.',
        questions: [
          { number: 1, text: 'What is a "mind movie" in reading? Explain in your own words.', lines: 2 },
          { number: 2, text: 'List the five senses a reader can use when visualising a text: __________, __________, __________, __________, __________', lines: 1 },
          { number: 3, text: 'Read this sentence: "The kookaburra laughed from a dead scribbly gum while red dust swirled across the dry paddock." What do you SEE, HEAR and SMELL in your mind movie?', lines: 3 },
          { number: 4, text: 'If you lose your mental image while reading, what should you do? Explain.', lines: 2 },
          { number: 5, text: 'Why does visualising help you understand and remember what you read?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Predicting',
        instructions: 'Use clues from the text to make and justify predictions.',
        questions: [
          { number: 6, text: 'What is the difference between a prediction and a guess?', lines: 2 },
          { number: 7, text: 'Read these clues from a book cover: "A girl stands on the edge of a cliff. The title is The Last Jump. A storm gathers behind her." Make a prediction using the sentence starter: "I predict ___ because ___."', lines: 2 },
          { number: 8, text: 'A chapter begins: "Maya checked her watch — three minutes until the alarm went off. She had to find the code before the whole system crashed." What do you predict will happen? Use two text clues in your answer.', lines: 3 },
          { number: 9, text: 'You predict a character will escape, but instead they get caught. What should you do next as a reader?', lines: 2 },
          { number: 10, text: 'Why is it important to use the word "because" when making predictions?', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Reading Response',
        instructions: 'Use your current home reading book to complete these tasks.',
        questions: [
          { number: 11, text: 'Write the title and author of your current reading book: Title: _______________. Author: _______________', lines: 1 },
          { number: 12, text: 'Choose a descriptive paragraph from your book. Write 2–3 sentences describing the mental image it created. Include at least two senses.', lines: 3 },
          { number: 13, text: 'Before reading your next chapter, make a prediction using clues from the chapter title and the last page you read: "I predict ___ because ___."', lines: 2 },
          { number: 14, text: 'After reading the chapter: Was your prediction confirmed or disconfirmed? What clue did you use or miss? Write a full explanation.', lines: 3 },
        ],
      },
    ],
  },

  'y4-eng-08': {
    sessionId: 'y4-eng-08',
    title: 'Nouns, Verbs, Adjectives and Adverbs',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELA268',
    sections: [
      {
        heading: 'Section 1 – Identifying Word Classes',
        instructions: 'Label the word class of each underlined word: noun (N), verb (V), adjective (Adj) or adverb (Adv).',
        questions: [
          { number: 1, text: '"The ancient ghost gum creaked loudly in the hot wind."\nLabel: ancient ___, ghost gum ___, creaked ___, loudly ___, hot ___, wind ___', lines: 1 },
          { number: 2, text: '"Three exhausted players limped slowly off the muddy oval."\nLabel: three ___, players ___, limped ___, slowly ___, muddy ___, oval ___', lines: 1 },
          { number: 3, text: 'Write the test you use to check if a word is a NOUN: _______________. Test: is "wombat" a noun? _______________', lines: 1 },
          { number: 4, text: 'Write the test you use to check if a word is a VERB: _______________. Test: is "thundered" a verb? _______________', lines: 1 },
          { number: 5, text: 'What is the difference between an adjective and an adverb? Write one example of each.', lines: 2 },
          { number: 6, text: 'Give an example of an adverb that does NOT end in "-ly": _______________. Write a sentence using it: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Upgrading Weak Writing',
        instructions: 'Improve each weak sentence by replacing vague words with precise nouns, verbs, adjectives and adverbs. Label your changes.',
        questions: [
          { number: 7, text: 'Weak: "The bird went to the tree and made a noise." Improve it with a precise noun, strong verb and adverb:', lines: 2 },
          { number: 8, text: 'Weak: "The dog ran fast across the place." Improve it with a precise noun and strong verb:', lines: 2 },
          { number: 9, text: 'Weak: "She said something and then walked away." Improve it with a precise reporting verb and a descriptive adverb:', lines: 2 },
          { number: 10, text: 'Weak: "There was a big animal near the water." Improve it using a precise Australian animal and strong adjectives:', lines: 2 },
          { number: 11, text: 'Explain: why is "scrambled" a better verb than "went quickly" in the sentence "The possum went quickly up the tree"?', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Write Your Own',
        instructions: 'Use your knowledge of word classes to write vivid sentences about Australian animals.',
        questions: [
          { number: 12, text: 'Write a sentence about a kookaburra that includes: a precise noun, a strong action verb, one adjective and one adverb. Then label each word class in brackets.', lines: 3 },
          { number: 13, text: 'Write a sentence about a surf beach using at least two adjectives and one adverb. Underline the adjectives and circle the adverb.', lines: 2 },
          { number: 14, text: 'Take this weak paragraph and rewrite it with precise word choices. "A big animal was near the water. It made a noise. A small thing ran away." Aim for two vivid sentences.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-09': {
    sessionId: 'y4-eng-09',
    title: 'Editing and Proofreading Strategies',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELY263',
    sections: [
      {
        heading: 'Section 1 – Understanding the Process',
        instructions: 'Answer these questions about editing and proofreading.',
        questions: [
          { number: 1, text: 'What is the difference between editing and proofreading? Give one example of each.', lines: 2 },
          { number: 2, text: 'Why should you always EDIT before you PROOFREAD? Explain.', lines: 2 },
          { number: 3, text: 'Why does reading your writing ALOUD help the editing process?', lines: 2 },
          { number: 4, text: 'What is the "proofreading backwards" trick and why does it work?', lines: 2 },
          { number: 5, text: 'Label each task as EDITING (E) or PROOFREADING (P):\na) Fix a misspelling ___\nb) Replace a weak verb with a stronger one ___\nc) Add more detail to a paragraph ___\nd) Fix a missing full stop ___\ne) Remove a repeated idea ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Edit This Passage',
        instructions: 'Read the passage below, then answer the editing and proofreading questions.',
        questions: [
          { number: 6, text: 'PASSAGE TO EDIT:\n"The boy was scared. He ran. He hid behind a tree. The tree was big. he waited. He heard a noise. Something was coming. It was his dog biscuit the dog had found him"\n\nIdentify TWO editing improvements (content/structure) this passage needs:', lines: 2 },
          { number: 7, text: 'Identify TWO proofreading errors (spelling, punctuation, capitals) in the passage:', lines: 2 },
          { number: 8, text: 'Rewrite the passage with your editing and proofreading changes applied. Aim for 3–4 much stronger sentences.', lines: 4 },
          { number: 9, text: 'The passage uses the weak verb "ran" twice. Write TWO more precise replacement verbs that could be used instead: _______________ and _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Edit Your Own Writing',
        instructions: 'Apply the editing and proofreading process to your own recent writing.',
        questions: [
          { number: 10, text: 'Choose a piece of your own writing from this term. Write the title or topic here: _______________. List THREE content improvements you could make (editing):',  lines: 3 },
          { number: 11, text: 'List TWO surface errors you found when proofreading your writing (e.g. spelling, punctuation, capitals). Write the error and the correction.', lines: 2 },
          { number: 12, text: 'Give your writing to someone at home for "2 Stars and a Wish" feedback. Write what they said here. Do you agree with their wish? Why or why not?', lines: 3 },
          { number: 13, text: 'Rewrite your BEST paragraph from that piece, incorporating all your editing and proofreading improvements.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-10': {
    sessionId: 'y4-eng-10',
    title: 'Presentations and Discussion',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELY265',
    sections: [
      {
        heading: 'Section 1 – Presentation Skills',
        instructions: 'Answer questions about planning and delivering an oral presentation.',
        questions: [
          { number: 1, text: 'Label the three parts of a well-structured presentation in order: __________, __________, __________', lines: 1 },
          { number: 2, text: 'Why should you use cue cards instead of reading from a full script? Give TWO reasons.', lines: 2 },
          { number: 3, text: 'List THREE "voice" skills that make a presentation clear and confident: _______________, _______________, _______________', lines: 1 },
          { number: 4, text: 'List TWO body language tips for a confident presentation: _______________, _______________', lines: 1 },
          { number: 5, text: 'Write a strong HOOK (opening sentence) for a presentation about Australian wildlife. It should surprise or interest the listener immediately.', lines: 2 },
          { number: 6, text: 'Write a memorable CONCLUSION sentence for the same presentation.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Active Listening and Discussion',
        instructions: 'Answer questions about active listening and taking part in class discussion.',
        questions: [
          { number: 7, text: 'Describe active listening in your own words. What does it look like?', lines: 2 },
          { number: 8, text: 'What is the difference between a discussion and an argument?', lines: 2 },
          { number: 9, text: 'Write a sentence starter for AGREEING with a classmate\'s idea: _______________', lines: 1 },
          { number: 10, text: 'Write a sentence starter for RESPECTFULLY DISAGREEING with a classmate\'s idea: _______________', lines: 1 },
          { number: 11, text: 'Write a sentence starter for BUILDING ON what a classmate said: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Plan Your Presentation',
        instructions: 'Plan a 2-minute presentation on an Australian topic of your choice.',
        questions: [
          { number: 12, text: 'My presentation topic: _______________', lines: 1 },
          { number: 13, text: 'HOOK (surprising fact or bold question to open with):',  lines: 2 },
          { number: 14, text: 'MAIN POINT 1 — write 3–4 cue words only (not full sentences): _______________', lines: 1 },
          { number: 15, text: 'MAIN POINT 2 — write 3–4 cue words only: _______________', lines: 1 },
          { number: 16, text: 'CONCLUSION — write your memorable closing sentence:', lines: 2 },
          { number: 17, text: 'Practise at home and ask someone for "2 Stars and a Wish". Write their feedback here and note ONE thing you will improve.', lines: 3 },
        ],
      },
    ],
  },

  'y4-eng-11': {
    sessionId: 'y4-eng-11',
    title: 'Punctuation: Full Stops, Capitals and More',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELA312',
    sections: [
      {
        heading: 'Section 1 – Add the Punctuation',
        instructions: 'Rewrite each sentence or passage with correct capital letters and end punctuation (full stop, question mark or exclamation mark).',
        questions: [
          { number: 1, text: 'Add capitals and end punctuation: "the platypus lives in rivers and lakes across eastern australia"', lines: 1 },
          { number: 2, text: 'Add capitals and end punctuation: "have you ever seen a quokka at rottnest island"', lines: 1 },
          { number: 3, text: 'Add capitals and end punctuation: "a great white shark swam right beneath our boat"', lines: 1 },
          { number: 4, text: 'Add all capitals and end punctuation to this passage: "on monday, tom and i went to the gold coast. we saw a rainbow lorikeet in the garden. did you know they eat fruit"', lines: 2 },
          { number: 5, text: 'Circle the words that need capitals in this sentence and explain why:\n"last friday, liam visited his grandpa in ballarat and watched the collingwood game."', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Identify the Sentence Type and Fix Errors',
        instructions: 'Label each sentence as Statement (St), Question (Q), Exclamation (Ex) or Command (C). Then correct any punctuation errors.',
        questions: [
          { number: 6, text: 'Label and fix: "koalas sleep up to 22 hours a day" Type: ___ Fixed sentence: _______________', lines: 1 },
          { number: 7, text: 'Label and fix: "what time does the school bus leave" Type: ___ Fixed sentence: _______________', lines: 1 },
          { number: 8, text: 'Label and fix: "a snake is under the bench" Type: ___ Fixed sentence: _______________', lines: 1 },
          { number: 9, text: 'Label and fix: "sit in the shade and drink plenty of water" Type: ___ Fixed sentence: _______________', lines: 1 },
          { number: 10, text: 'A student wrote: "I love footy!!!! It is the best!!!! Our team won!!!!" What punctuation problem does this show? How should it be written?', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Write Your Own',
        instructions: 'Write correctly punctuated sentences about Australian animals or sport.',
        questions: [
          { number: 11, text: 'Write one STATEMENT about an Australian animal with correct punctuation:', lines: 1 },
          { number: 12, text: 'Write one QUESTION using "How", "Why" or "Have you ever..." with correct punctuation:', lines: 1 },
          { number: 13, text: 'Write one EXCLAMATION that expresses genuine surprise or excitement with correct punctuation:', lines: 1 },
          { number: 14, text: 'Write one COMMAND telling someone what to do in the bush or at the beach:', lines: 1 },
          { number: 15, text: 'Write a short paragraph (4–5 sentences, mixed sentence types) about your favourite Australian animal or sport. Every sentence must have correct capital letters and end punctuation.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-12': {
    sessionId: 'y4-eng-12',
    title: 'Punctuation: Commas',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELA312',
    sections: [
      {
        heading: 'Section 1 – Commas in Lists',
        instructions: 'Add commas to the lists in each sentence, or explain why no commas are needed. Remember: no comma before the final "and" in Australian English.',
        questions: [
          { number: 1, text: 'Add commas: "In her bag Mia had a water bottle a hat sunscreen and a snack."', lines: 1 },
          { number: 2, text: 'Add commas: "The campsite had a fire pit a picnic table a tap and a flying fox."', lines: 1 },
          { number: 3, text: 'Does this sentence need commas? Explain: "Tom and Anika played cricket after school."', lines: 1 },
          { number: 4, text: 'Add commas to the list of VERBS: "The kookaburra swooped dived grabbed the lizard and flew back to its branch."', lines: 1 },
          { number: 5, text: 'Find and fix the comma error: "She bought mangoes, and rockmelon, at the market." Write the correct sentence: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Commas After Introductory Phrases and Between Clauses',
        instructions: 'Add the missing comma and explain which "job" it is doing (joining clauses OR introductory phrase).',
        questions: [
          { number: 6, text: 'Add comma and label the job: "After the long footy match the players were exhausted." Comma after: ___ Job: ___', lines: 1 },
          { number: 7, text: 'Add comma and label the job: "We wanted to go surfing but the waves were too rough." Comma after: ___ Job: ___', lines: 1 },
          { number: 8, text: 'Add comma and label the job: "Because it had rained the creek was running fast." Comma after: ___ Job: ___', lines: 1 },
          { number: 9, text: 'Add comma and label the job: "The team trained hard so they were ready for the final." Comma after: ___ Job: ___', lines: 1 },
          { number: 10, text: 'Explain the "Cover It" test for introductory phrases. Apply it to this sentence: "On Saturday morning the magpies were swooping."', lines: 2 },
          { number: 11, text: 'Which sentence has a WRONG comma? Fix it.\na) "I was late, because the tram was delayed."\nb) "Because the tram was delayed, I was late."', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Write Using All Three Comma Jobs',
        instructions: 'Write your own sentences demonstrating each comma job, then write a paragraph using all three.',
        questions: [
          { number: 12, text: 'Job 1 — Write a sentence with a list of FOUR items about a camping trip or the beach:', lines: 1 },
          { number: 13, text: 'Job 2 — Write a sentence joining TWO complete ideas with "but", "so" or "or" (comma before the joining word):', lines: 1 },
          { number: 14, text: 'Job 3 — Write a sentence starting with a time or place phrase (comma after the opening phrase):', lines: 1 },
          { number: 15, text: 'Write a paragraph (5–6 sentences) about a day at the beach or a bush walk. Include all three comma jobs — label each comma with its job number (1, 2 or 3).', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-13': {
    sessionId: 'y4-eng-13',
    title: 'Grammar: Nouns, Verbs and Adjectives',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELA313',
    sections: [
      {
        heading: 'Section 1 – Identify and Classify',
        instructions: 'Identify and label nouns (N), verbs (V) and adjectives (Adj) in each sentence.',
        questions: [
          { number: 1, text: '"A curious possum climbed the old wooden fence." Label: curious ___, possum ___, climbed ___, old ___, wooden ___, fence ___', lines: 1 },
          { number: 2, text: '"The massive wave crashed onto the white sand near Bondi Beach." Identify: one proper noun ___, two adjectives ___ and ___, the verb ___', lines: 1 },
          { number: 3, text: 'What is a PROPER NOUN? Write TWO Australian examples: _______________', lines: 1 },
          { number: 4, text: 'What is a COLLECTIVE NOUN? Give one Australian animal example: _______________', lines: 1 },
          { number: 5, text: 'What is a BEING VERB (linking verb)? Write a sentence that uses one: _______________', lines: 1 },
          { number: 6, text: 'How many nouns are in this sentence: "Lola kicked the ball over the rusty fence into the neighbour\'s garden"? List them: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Upgrade Weak Sentences',
        instructions: 'Rewrite each weak sentence using precise nouns, strong verbs and vivid adjectives.',
        questions: [
          { number: 7, text: 'Weak: "A bird went over the place and made a noise."\nUpgraded version (use a specific Australian bird, precise verb and one adjective):', lines: 2 },
          { number: 8, text: 'Weak: "A big animal ate some food near the water."\nUpgraded version (use a precise animal, strong verb and two adjectives):', lines: 2 },
          { number: 9, text: 'Weak: "My dog is very nice and good and it is fun to play with."\nUpgraded version (replace "nice", "good" and "fun" with vivid, specific adjectives):', lines: 2 },
          { number: 10, text: 'Replace the weak verb: "The injured player walked slowly off the field." Replace "walked slowly" with ONE precise verb that shows he was in pain: _______________', lines: 1 },
          { number: 11, text: 'Explain: why is a precise noun like "thorny devil" better than "animal" in a description?', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Write Your Own',
        instructions: 'Write vivid sentences and a paragraph using precise nouns, strong verbs and well-chosen adjectives.',
        questions: [
          { number: 12, text: 'Write a sentence with TWO nouns, ONE verb and TWO adjectives about an Australian landscape. Label each word class in brackets.', lines: 2 },
          { number: 13, text: 'Write a sentence about your school oval or local park that uses a precise noun, a strong verb and one adjective. The sentence must create a clear mental image.', lines: 2 },
          { number: 14, text: 'Write a 4–5 sentence description of an Australian animal. Use precise nouns, strong verbs and vivid adjectives. Underline nouns in blue, circle verbs and box adjectives.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-eng-14': {
    sessionId: 'y4-eng-14',
    title: 'Grammar: Sentence Types',
    subject: 'English',
    yearLevel: 4,
    victorianCode: 'VCELA313',
    sections: [
      {
        heading: 'Section 1 – Identify and Label Sentence Types',
        instructions: 'Label each sentence as Statement (St), Question (Q), Command (C) or Exclamation (Ex). Then write the correct end punctuation.',
        questions: [
          { number: 1, text: '"The Murray–Darling is Australia\'s longest river system___" Type: ___', lines: 1 },
          { number: 2, text: '"Have you ever seen a cassowary in the wild___" Type: ___', lines: 1 },
          { number: 3, text: '"Pack your hat and drink bottle before you leave___" Type: ___', lines: 1 },
          { number: 4, text: '"What a spectacular catch that was___" Type: ___', lines: 1 },
          { number: 5, text: '"Don\'t feed the wild birds at the picnic area___" Type: ___', lines: 1 },
          { number: 6, text: 'How can you tell a command from a statement? Write a rule and give one example of each: _______________', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Convert and Create',
        instructions: 'Transform sentences between types and write your own examples.',
        questions: [
          { number: 7, text: 'Turn this STATEMENT into a QUESTION: "The AFL grand final is held at the MCG every year."', lines: 1 },
          { number: 8, text: 'Turn this STATEMENT into a COMMAND: "Students should arrive at school on time."', lines: 1 },
          { number: 9, text: 'Turn this STATEMENT into an EXCLAMATION: "That goal was impressive."', lines: 1 },
          { number: 10, text: 'What is a RHETORICAL QUESTION? Write one about Australian wildlife.', lines: 2 },
          { number: 11, text: 'A writer uses ONLY statements throughout their story. What effect does this create? How could they improve it?', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Write Using All Four Sentence Types',
        instructions: 'Demonstrate your understanding by writing a passage that uses all four sentence types purposefully.',
        questions: [
          { number: 12, text: 'Write one of EACH sentence type about Australian animals or sport (4 sentences total). Label each one in brackets: [Statement], [Question], [Command], [Exclamation].', lines: 4 },
          { number: 13, text: 'Write a short persuasive passage (5–7 sentences) arguing that your class should go on a particular excursion. Use ALL FOUR sentence types — label each one.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-mat-07': {
    sessionId: 'y4-mat-07',
    title: 'Patterns and Algebra',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'VCMNA145',
    sections: [
      {
        heading: 'Section 1 – Pattern Rules and Sequences',
        instructions: 'Find the rule for each pattern and extend it by writing the next three terms.',
        questions: [
          { number: 1, text: '4, 9, 14, 19, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 2, text: '256, 128, 64, 32, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 3, text: '3, 6, 12, 24, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 4, text: '100, 93, 86, 79, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 5, text: 'Which number does NOT belong in this pattern: 6, 12, 18, 25, 30? Circle it and explain why: _______________', lines: 1 },
          { number: 6, text: 'A pattern starts at 5 and adds 7 each time. List the first 6 terms: ___, ___, ___, ___, ___, ___. What is the 10th term? ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Tables of Values and Variables',
        instructions: 'Use tables and inverse operations to find missing values and unknown numbers.',
        questions: [
          { number: 7, text: 'Complete the table:\nTerm number: 1 | 2 | 3 | 4 | 5\nValue: 7 | 14 | 21 | __ | __\nRule: _______________', lines: 2 },
          { number: 8, text: 'Find □: □ + 13 = 30. □ = ___. Working: _______________', lines: 1 },
          { number: 9, text: 'Find □: 6 × □ = 54. □ = ___. Working: _______________', lines: 1 },
          { number: 10, text: 'Find □: □ − 17 = 28. □ = ___. Working: _______________', lines: 1 },
          { number: 11, text: 'Find □: □ ÷ 9 = 7. □ = ___. Working: _______________', lines: 1 },
          { number: 12, text: 'Explain how to use the INVERSE OPERATION to solve □ + 15 = 40. What is the inverse of addition?', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Patterns in Real Life',
        instructions: 'Apply patterns and algebra to real-world problems. Show all working and write a sentence answer.',
        questions: [
          { number: 13, text: 'An AFL team scores 6 points for every goal. Complete the table:\nGoals: 1 | 2 | 3 | 4 | 5\nPoints: 6 | __ | __ | __ | __\nIf they score 9 goals, how many points do they earn? Show working:', lines: 3 },
          { number: 14, text: 'A plant grows 5 cm every week. It is 10 cm tall now. How tall will it be after 6 more weeks? Show working using a table or a rule:', lines: 3 },
          { number: 15, text: 'A bakery makes 15 muffins in the first hour and 12 more each hour after that. How many muffins does it have after hour 4? Show your working:', lines: 3 },
          { number: 16, text: 'Create your own number pattern (at least 6 terms). Write the rule clearly. Then write a word problem set in Australia that uses your pattern.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y4-mat-08': {
    sessionId: 'y4-mat-08',
    title: 'Geometry: 2D Shapes',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'VCMMG160',
    sections: [
      {
        heading: 'Section 1 – Classify Shapes',
        instructions: 'Classify triangles and quadrilaterals by their properties.',
        questions: [
          { number: 1, text: 'A triangle has sides of 6 cm, 6 cm and 9 cm. What type is it? _______________. How do you know?', lines: 1 },
          { number: 2, text: 'A triangle has all three sides of different lengths. What type is it? _______________', lines: 1 },
          { number: 3, text: 'Name a quadrilateral that has: 4 equal sides AND 4 right angles: _______________. 4 equal sides but NO right angles: _______________', lines: 1 },
          { number: 4, text: 'True or false: "A square is always a rectangle." ___ Explain why: _______________', lines: 1 },
          { number: 5, text: 'How many lines of symmetry does each shape have?\nSquare: ___ Rectangle: ___ Equilateral triangle: ___ Isosceles triangle: ___', lines: 1 },
          { number: 6, text: 'Describe TWO differences between a rhombus and a square:', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Angles in Shapes',
        instructions: 'Use the angle sum rules for triangles (180°) and quadrilaterals (360°) to find missing angles.',
        questions: [
          { number: 7, text: 'Two angles of a triangle are 55° and 75°. Find the third angle. Show working:', lines: 2 },
          { number: 8, text: 'A triangle has one angle of 90° and one of 35°. Find the third angle. What type of angle is 55°? (Acute/Obtuse/Right)', lines: 2 },
          { number: 9, text: 'Three angles of a quadrilateral are 95°, 80° and 110°. Find the fourth angle. Show working:', lines: 2 },
          { number: 10, text: 'Classify each angle as Acute, Right, Obtuse or Reflex:\n45°: ___ 90°: ___ 135°: ___ 200°: ___', lines: 1 },
          { number: 11, text: 'Explain how you know that quadrilateral angles always sum to 360° (Hint: think about splitting into triangles):', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Shapes in the Real World',
        instructions: 'Apply your knowledge of 2D shapes to real-world contexts.',
        questions: [
          { number: 12, text: 'Name THREE objects in your home or school that are quadrilaterals. For each, write the type of quadrilateral and ONE property that makes it that type.', lines: 3 },
          { number: 13, text: 'A triangular road sign has one angle of 60°. If the triangle is equilateral, what are the other two angles? ___. How many lines of symmetry does it have? ___', lines: 1 },
          { number: 14, text: 'Look at the tiles, windows or floors around you. Sketch or describe TWO different 2D shapes you can find. Write one property of each.', lines: 3 },
          { number: 15, text: 'Explain in your own words: why is a square a special type of rectangle AND a special type of rhombus?', lines: 2 },
        ],
      },
    ],
  },

  'y4-mat-09': {
    sessionId: 'y4-mat-09',
    title: 'Time and Data',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'VCMMG163',
    sections: [
      {
        heading: 'Section 1 – 12-Hour and 24-Hour Time',
        instructions: 'Convert between 12-hour and 24-hour time.',
        questions: [
          { number: 1, text: 'Convert to 24-hour time:\na) 3:15 PM → ___  b) 9:00 AM → ___  c) 11:45 PM → ___  d) 12:00 PM → ___', lines: 1 },
          { number: 2, text: 'Convert to 12-hour time:\na) 0745 → ___  b) 1330 → ___  c) 2210 → ___  d) 1605 → ___', lines: 1 },
          { number: 3, text: 'Which times are in the MORNING (AM)? Circle them: 0835 / 1420 / 0015 / 2355 / 1145', lines: 1 },
          { number: 4, text: 'Write the rule for converting PM times to 24-hour time: _______________. Why is 12:00 PM = 1200 a special case?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Elapsed Time and Timetables',
        instructions: 'Calculate elapsed time and read timetables.',
        questions: [
          { number: 5, text: 'How long is it from 9:45 AM to 12:20 PM? Use the count-forward method:\n9:45 → 10:00 = ___ min\n10:00 → 12:00 = ___ hours\n12:00 → 12:20 = ___ min\nTotal: ___', lines: 2 },
          { number: 6, text: 'A movie starts at 2:15 PM and ends at 4:40 PM. How long is the movie? Show your working:', lines: 2 },
          { number: 7, text: 'Use this train timetable:\nCity: 0830 | 0910 | 1015\nSouth Station: 0915 | 0955 | 1100\nBay Terminal: 0940 | 1020 | 1125\n\nIf you catch the 0910 from the City, when do you arrive at Bay Terminal? ___\nHow long is the journey? ___', lines: 2 },
          { number: 8, text: 'You need to arrive at school by 8:45 AM. The walk takes 20 minutes and breakfast takes 15 minutes. What time must you wake up? Show working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Collecting and Reading Data',
        instructions: 'Read data displays and answer questions.',
        questions: [
          { number: 9, text: 'A bar graph shows students\' favourite Australian animals:\nKoala: 8  Kangaroo: 6  Platypus: 3  Wombat: 5  Echidna: 3\n\nWhat was the most popular animal? ___ Least popular? ___\nHow many more students chose Koala than Platypus? ___\nHow many students were surveyed in total? ___', lines: 2 },
          { number: 10, text: 'In a picture graph, each 🐨 symbol represents 4 students. A column shows 3.5 symbols. How many students does this represent? Show working:', lines: 1 },
          { number: 11, text: 'Survey 8–10 people in your home about their favourite sport. Create a tally table and draw a bar graph here. Label both axes. What does your data show?', lines: 0, hasBox: true },
          { number: 12, text: 'Write TWO conclusions from the data you collected in Question 11:', lines: 2 },
        ],
      },
    ],
  },

  'y4-mat-10': {
    sessionId: 'y4-mat-10',
    title: 'Probability',
    subject: 'Maths',
    yearLevel: 4,
    victorianCode: 'VCMSP165',
    sections: [
      {
        heading: 'Section 1 – Language of Chance and the Probability Scale',
        instructions: 'Use probability language and place events on the scale from 0 (impossible) to 1 (certain).',
        questions: [
          { number: 1, text: 'Place these events on the probability scale by writing a word: impossible / unlikely / even chance / likely / certain\na) Rolling a 7 on a standard die: ___\nb) Flipping heads on a fair coin: ___\nc) The sun rising tomorrow in Australia: ___\nd) Drawing a red card from a standard deck: ___', lines: 2 },
          { number: 2, text: 'Write your own example of an UNLIKELY event that could happen in Australia: _______________', lines: 1 },
          { number: 3, text: 'Write your own example of an IMPOSSIBLE event: _______________', lines: 1 },
          { number: 4, text: 'A spinner has 8 equal sections: 3 red, 3 blue, 2 yellow. Where on the probability scale does "spinning red" sit? Is it closer to impossible, even chance or certain? Explain.', lines: 2 },
          { number: 5, text: 'What does it mean for an event to have an "even chance"? Give one real-life example: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Calculating Probability',
        instructions: 'Use the formula P(event) = favourable outcomes ÷ total outcomes to calculate probability as a fraction.',
        questions: [
          { number: 6, text: 'A bag has 4 red, 3 blue and 3 green counters (10 total).\nP(red) = ___ P(blue) = ___ P(green) = ___\nDo all probabilities add to 1? Check: ___ + ___ + ___ = ___', lines: 2 },
          { number: 7, text: 'A spinner has 4 equal sections: red, blue, green and yellow.\nP(blue) = ___ P(NOT blue) = ___\nHow do you calculate P(NOT blue)? _______________', lines: 2 },
          { number: 8, text: 'A bag has 2 red and 8 blue counters. What is P(red)? ___ Where would you place this on the probability scale: impossible, unlikely, even chance, likely or certain? ___', lines: 1 },
          { number: 9, text: 'A 6-sided die is rolled. Calculate:\nP(rolling a 6): ___ P(rolling an even number): ___ P(rolling a number less than 5): ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Probability Experiments and Word Problems',
        instructions: 'Apply probability to experiments and real-life problems.',
        questions: [
          { number: 10, text: 'A coin is flipped 40 times. How many heads does theoretical probability predict? Show working:', lines: 2 },
          { number: 11, text: 'You roll a die 60 times. How many times do you expect to roll a 4? Show working:', lines: 2 },
          { number: 12, text: 'Flip a coin 20 times at home. Record your results using tally marks:\nHeads: ___ (tally) Total: ___  Tails: ___ (tally) Total: ___\nYour experimental P(heads) = ___/20. How does this compare to the theoretical prediction of 1/2?', lines: 3 },
          { number: 13, text: 'Explain in your own words: why does doing MORE trials in a probability experiment usually give results that are closer to the theoretical probability?', lines: 2 },
          { number: 14, text: 'A class game gives a prize if you roll a 6 on a die. Is this fair? What is the probability of winning? How would you change the rules to make it more likely to win?', lines: 3 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Y6 MATHS
  // ─────────────────────────────────────────────────────────────

  'y6-mat-01': {
    sessionId: 'y6-mat-01',
    title: 'Integers & Number Systems',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'MA6-NUM-01',
    sections: [
      {
        heading: 'Section 1 – Understanding Integers',
        instructions: 'Answer questions about positive and negative numbers.',
        questions: [
          { number: 1, text: 'Write the integer for: "12 degrees below zero" ___', lines: 1 },
          { number: 2, text: 'Write the integer for: "50 metres above sea level" ___', lines: 1 },
          { number: 3, text: 'Write the integer for: "a debt of $75" ___', lines: 1 },
          { number: 4, text: 'Plot and label these integers on a number line: −6, −2, 0, 3, 7. Draw the number line:', lines: 2 },
          { number: 5, text: 'Order from smallest to largest: −3, 5, −8, 0, 2, −1\n_______________', lines: 1 },
          { number: 6, text: 'Which is greater: −15 or −4? Explain why: _______________', lines: 1 },
          { number: 7, text: 'The temperature at night is −5°C. During the day it rises 13 degrees. What is the daytime temperature? ___', lines: 1 },
          { number: 8, text: 'A submarine is at −120 m. It rises 45 m. What is the new depth? ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Operations with Integers',
        instructions: 'Solve using number lines or rules for positive and negative numbers.',
        questions: [
          { number: 9, text: '8 + (−3) = ___', lines: 1 },
          { number: 10, text: '−5 + (−4) = ___', lines: 1 },
          { number: 11, text: '6 − (−2) = ___', lines: 1 },
          { number: 12, text: '−7 + 10 = ___', lines: 1 },
          { number: 13, text: '−3 − 5 = ___', lines: 1 },
          { number: 14, text: '4 × (−3) = ___', lines: 1 },
          { number: 15, text: '−24 ÷ 6 = ___', lines: 1 },
          { number: 16, text: '(−5) × (−4) = ___. Explain the rule for multiplying two negatives:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Large Numbers & Prime Factorisation',
        instructions: 'Work with large numbers and identify prime factors.',
        questions: [
          { number: 17, text: 'Write the prime factorisation of 36: _______________', lines: 1 },
          { number: 18, text: 'Write the prime factorisation of 60: _______________', lines: 1 },
          { number: 19, text: 'Find the HCF (Highest Common Factor) of 48 and 72: ___', lines: 2 },
          { number: 20, text: 'Find the LCM (Lowest Common Multiple) of 6 and 9: ___', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 21, text: 'The temperature in Canberra fell from 3°C to −8°C overnight. By how many degrees did it fall? Show working:', lines: 3 },
          { number: 22, text: 'A bank account has a balance of −$450. The owner deposits $780. What is the new balance? Show working:', lines: 3 },
          { number: 23, text: 'A lift starts at floor −3 (underground). It goes up 8 floors, then down 2. On which floor does it stop? Show working:', lines: 3 },
          { number: 24, text: 'Explain in your own words: Why is it true that a negative × a negative = a positive? Can you give a real-life example?', lines: 3 },
        ],
      },
    ],
  },

  'y6-mat-02': {
    sessionId: 'y6-mat-02',
    title: 'Fractions, Decimals & Percentages',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'MA6-FDP-01',
    sections: [
      {
        heading: 'Section 1 – Converting Between FDP',
        instructions: 'Convert between fractions, decimals, and percentages.',
        questions: [
          { number: 1, text: 'Write 3/4 as a decimal: ___ and as a percentage: ___', lines: 1 },
          { number: 2, text: 'Write 0.65 as a fraction: ___ and as a percentage: ___', lines: 1 },
          { number: 3, text: 'Write 80% as a decimal: ___ and as a fraction in simplest form: ___', lines: 1 },
          { number: 4, text: 'Write 7/20 as a decimal: ___ and as a percentage: ___', lines: 1 },
          { number: 5, text: 'Write 37.5% as a decimal: ___ and as a fraction: ___', lines: 1 },
          { number: 6, text: 'Order from smallest to largest: 3/5, 0.62, 55%, 0.7, 3/4\n_______________', lines: 1 },
          { number: 7, text: 'Which is greater: 2/3 or 65%? Show your working:', lines: 2 },
          { number: 8, text: 'A student scored 17/20 on a test. What is their percentage score? ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Operations with Fractions',
        instructions: 'Add, subtract, multiply or divide fractions. Show all working.',
        questions: [
          { number: 9, text: '2/5 + 3/10 = ___  (Hint: find a common denominator)', lines: 2 },
          { number: 10, text: '7/8 − 1/4 = ___', lines: 2 },
          { number: 11, text: '3/4 × 2/3 = ___', lines: 2 },
          { number: 12, text: '5/6 ÷ 5 = ___', lines: 2 },
          { number: 13, text: '1 3/4 + 2 1/2 = ___  (Mixed numbers)', lines: 2 },
          { number: 14, text: '3 1/3 − 1 2/3 = ___', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Percentage Calculations',
        instructions: 'Calculate percentages of amounts.',
        questions: [
          { number: 15, text: 'Find 25% of $640: ___', lines: 1 },
          { number: 16, text: 'Find 35% of 200 kg: ___', lines: 1 },
          { number: 17, text: 'A shirt costs $80 and is on sale for 15% off. How much is the discount? What is the sale price?', lines: 2 },
          { number: 18, text: 'A class of 28 students: 75% bring a packed lunch. How many students is that?', lines: 2 },
          { number: 19, text: 'Jack scored 18 out of 24 on a quiz. What percentage did he score? Show working:', lines: 2 },
          { number: 20, text: 'GST in Australia is 10%. A bike costs $550 before GST. What is the total price with GST?', lines: 2 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 21, text: 'A pizza is cut into 12 equal slices. Sofia eats 1/4 and Tom eats 1/3. What fraction is left? How many slices is that?', lines: 3 },
          { number: 22, text: 'An athletics track is 400 m. A runner completes 3 3/4 laps. How many metres did she run? Show working:', lines: 3 },
          { number: 23, text: 'Tickets to a concert cost $120. A 20% discount is offered to students. What is the student price? If Sam also has a further 5% off, what does he pay?', lines: 4 },
          { number: 24, text: 'A bank account earns 3.5% interest per year. If $2,000 is deposited, how much interest is earned in one year? What is the new total?', lines: 3 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Y5 MATHS
  // ─────────────────────────────────────────────────────────────

  'y5-mat-01': {
    sessionId: 'y5-mat-01',
    title: 'Large Numbers & Place Value',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMNA192',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these place value questions about large numbers.',
        questions: [
          { number: 1, text: 'Write 473 205 in words: _______________', lines: 1 },
          { number: 2, text: 'Write in digits: "five hundred and nine thousand, three hundred and forty-two" _______________', lines: 1 },
          { number: 3, text: 'In the number 826 047, what is the value of the digit 8? _______________', lines: 1 },
          { number: 4, text: 'Write 304 750 in expanded form: ___ + ___ + ___ + ___ + ___', lines: 1 },
          { number: 5, text: 'Round 647 382 to the nearest ten thousand: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Read each problem carefully. Show your working and write a sentence answer.',
        questions: [
          { number: 6, text: 'The population of Brisbane is 2 528 317 and the population of Adelaide is 1 402 393. Write both populations in words and state which city has more people.', lines: 3 },
          { number: 7, text: 'A news report rounds the AFL Grand Final crowd of 97 458 to the nearest ten thousand. What rounded number should they report? Show your working.', lines: 2 },
          { number: 8, text: 'The area of Western Australia is 2 642 753 km². Round this to the nearest hundred thousand km². Explain how you decided which way to round.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully and show all working.',
        questions: [
          { number: 9, text: 'I am a six-digit number. My hundred-thousands digit is 4. My ten-thousands digit is double my ones digit of 3. My thousands digit is 0. My hundreds digit is 7. My tens digit is 1. Write me in digits and in expanded form.', lines: 2 },
          { number: 10, text: 'The distances between Australian cities are: 1 747 km, 2 176 km, 2 782 km and 1 479 km. Order them from largest to smallest and explain how you compared them.', lines: 3 },
          { number: 11, text: 'Create a place value puzzle using a five or six-digit number. Write three clues about the digits so a partner can find your number. Then solve it yourself.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-02': {
    sessionId: 'y5-mat-02',
    title: 'Multiplication Strategies',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMNA193',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Use the standard algorithm or area model to calculate. Estimate first.',
        questions: [
          { number: 1, text: 'Estimate, then calculate: 47 × 38. Estimate: ___ × ___ ≈ ___. Exact answer: ___', lines: 1 },
          { number: 2, text: 'Estimate, then calculate: 62 × 54. Estimate: ___ × ___ ≈ ___. Exact answer: ___', lines: 1 },
          { number: 3, text: 'Calculate using the standard algorithm: 134 × 27 = ___. Show all working:', lines: 2 },
          { number: 4, text: 'Use the area model to solve 45 × 32. Draw the grid and label all four partial products.', hasBox: true, lines: 0 },
          { number: 5, text: 'Use doubling and halving to solve 18 × 25 = ___ (Hint: halve 18, double 25)', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer for each.',
        questions: [
          { number: 6, text: 'The Gabba cricket ground has 36 rows of reserved seating, each with 48 seats. How many reserved seats are there? Show working:', lines: 3 },
          { number: 7, text: 'A school canteen sells 125 meat pies each day. How many pies does it sell in 28 school days? Show working:', lines: 3 },
          { number: 8, text: 'A farmer plants 48 rows of sunflowers with 37 plants in each row. How many sunflower plants are there in total? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Estimate 483 × 19 by rounding each number to the nearest ten, then calculate the exact answer. How close was your estimate? Show working:', lines: 3 },
          { number: 10, text: 'Mia says 99 × 8 = 800 − 8 = 792. Explain the strategy she used. Is she correct? Use the same strategy to solve 99 × 7.', lines: 3 },
          { number: 11, text: 'Write your own real-world multiplication word problem that requires 2-digit × 2-digit. Solve it using two different methods and check both give the same answer.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-03': {
    sessionId: 'y5-mat-03',
    title: 'Fractions & Equivalence',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMNA194',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these fraction questions. Show your working.',
        questions: [
          { number: 1, text: 'Find three fractions equivalent to 3/5: ___, ___, ___', lines: 1 },
          { number: 2, text: 'Simplify 18/24 to lowest terms. Show the HCF: ___. Answer: ___', lines: 1 },
          { number: 3, text: 'Simplify 20/28. HCF: ___. Answer: ___', lines: 1 },
          { number: 4, text: 'Convert 17/5 to a mixed number: ___. Convert 3 2/5 to an improper fraction: ___', lines: 1 },
          { number: 5, text: 'Calculate 2/5 + 1/3. (Find the LCD first.) LCD = ___. Answer: ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'A Vegemite jar is 5/8 full. After breakfast, 2/8 is used. What fraction remains? Is this more or less than half a jar? Show working:', lines: 3 },
          { number: 7, text: 'Three friends share a large pizza. Zara eats 3/8, Ben eats 1/4 and Priya eats 1/8. What fraction is left? Write your answer in simplest form. Show working:', lines: 3 },
          { number: 8, text: 'A recipe needs 2/3 cup of sugar. You have already measured 1/4 cup. How much more do you need? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Which is larger: 4/5 or 7/9? Convert both to the same denominator and explain your answer clearly.', lines: 3 },
          { number: 10, text: 'Order these fractions from smallest to largest: 3/4, 2/3, 5/6, 7/12. Find a common denominator and show your full working.', lines: 3 },
          { number: 11, text: 'A student says 1/2 + 1/3 = 2/5. Explain the error they made and show the correct answer with full working.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-04': {
    sessionId: 'y5-mat-04',
    title: 'Decimals',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMNA195',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these decimal questions. Show all working.',
        questions: [
          { number: 1, text: 'What is the value of the digit 7 in 5.078? _______________', lines: 1 },
          { number: 2, text: 'Order from smallest to largest: 2.3, 2.03, 2.303, 2.033\n_______________', lines: 1 },
          { number: 3, text: 'Calculate: 5.80 + 3.47 = ___. Show decimal-aligned working:', lines: 2 },
          { number: 4, text: 'Calculate: 9.04 − 3.70 = ___. Show decimal-aligned working:', lines: 2 },
          { number: 5, text: 'Calculate: 3.24 × 7 = ___ (Hint: ignore decimal, multiply, then replace.)', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'Four swimmers\' times in the 100 m freestyle: Ana 58.73 s, Ben 59.04 s, Cleo 58.9 s, Dario 57.88 s. Who finished first and who was last? How much faster was the winner than the slowest swimmer? Show working:', lines: 3 },
          { number: 7, text: 'Petrol costs $2.139 per litre. A car uses 45 litres of petrol. To the nearest cent, how much does the petrol cost? (Hint: round to $2.14 first.) Show working:', lines: 3 },
          { number: 8, text: 'A runner\'s personal best is 58.32 seconds. Their new time is 57.9 seconds. By how much did they improve? Show working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working.',
        questions: [
          { number: 9, text: 'Round each number to the nearest tenth: 3.847 / 12.652 / 0.095 / 7.350. Explain the rule you used for 7.350.', lines: 3 },
          { number: 10, text: 'A student says 0.30 is greater than 0.3 because 30 is greater than 3. Are they correct? Explain using a place value chart or diagram.', lines: 3 },
          { number: 11, text: 'Find three prices at a supermarket. Add them together to find the total. Then round each price to the nearest dollar and estimate the total. How close is your estimate? Show all working.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-05': {
    sessionId: 'y5-mat-05',
    title: 'Measurement: Perimeter & Area',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMMG196',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Use the correct formula to calculate perimeter and area.',
        questions: [
          { number: 1, text: 'A rectangle is 14 m long and 9 m wide. Perimeter = ___. Area = ___', lines: 1 },
          { number: 2, text: 'A square has a perimeter of 36 cm. What is the length of one side? ___ What is its area? ___', lines: 1 },
          { number: 3, text: 'Find the area of a triangle with base 12 cm and perpendicular height 7 cm. Show working: ___', lines: 1 },
          { number: 4, text: 'A composite shape is made of two rectangles: 8 m × 5 m and 3 m × 4 m. Total area = ___', lines: 1 },
          { number: 5, text: 'A rectangle is 9 cm long and 6 cm wide. Calculate its perimeter and area, and write the correct units for each.', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'A school garden is 12 m long and 7 m wide. The school needs fencing around the entire garden and lawn turf for the ground. How much fencing (perimeter) and how much turf (area) is needed? Show working:', lines: 3 },
          { number: 7, text: 'An AFL training ground is 135 m long and 85 m wide. What is the area of the playing surface in m²? If groundskeepers need to mow it 3 times per week, how many m² do they mow in total each week? Show working:', lines: 3 },
          { number: 8, text: 'A rectangular room is 9 m × 7 m. A square cupboard (2 m × 2 m) is built into one corner. What is the remaining floor area? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Two rectangles have the same perimeter of 40 cm but different areas. Give two possible sets of dimensions and calculate the area for each. Which rectangle has the greater area?', lines: 3 },
          { number: 10, text: 'An L-shaped room has outer dimensions 10 m × 8 m. A 3 m × 4 m section is removed from one corner. Calculate the floor area and explain your method.', lines: 3 },
          { number: 11, text: 'Design a composite shape floor plan with at least two rectangular sections. Label all measurements, calculate the total area, and find the perimeter of the outer edge.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-06': {
    sessionId: 'y5-mat-06',
    title: 'Data & Statistics',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMSP197',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Calculate mean, median, mode and range for the data sets below.',
        questions: [
          { number: 1, text: 'Data: 6, 9, 4, 7, 9. Mean = ___. Median = ___. Mode = ___. Range = ___', lines: 1 },
          { number: 2, text: 'Data: 12, 8, 15, 8, 10, 14, 8, 11. Show working for the mean:  Sum = ___, Count = ___, Mean = ___. Median = ___. Mode = ___. Range = ___', lines: 2 },
          { number: 3, text: 'A data set has 6 values. After ordering, the 3rd value is 14 and the 4th is 18. What is the median? ___. Explain:', lines: 1 },
          { number: 4, text: 'Data: 3, 7, 5, 7, 2, 9, 7, 4. Mean = ___. Median = ___. Mode = ___. Range = ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Answer each question with full working and a sentence.',
        questions: [
          { number: 5, text: 'A Year 5 cricket team scored these runs in 8 matches: 18, 35, 22, 35, 41, 8, 35, 29. Calculate the mean, median, mode and range. Show all working:', lines: 3 },
          { number: 6, text: 'House prices in a suburb are: $450 000, $480 000, $510 000, $490 000 and $1 200 000. Calculate the mean and median. Which is more useful to describe the typical house price? Explain why.', lines: 3 },
          { number: 7, text: 'A shoe shop sells these sizes in one day: 7, 8, 8, 9, 7, 8, 10, 6, 8, 9. Which measure (mean, median or mode) is most useful for ordering stock? Explain your choice.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show working and explain your reasoning.',
        questions: [
          { number: 8, text: 'A data set is: 5, 5, 5, 5, 100. Calculate the mean and median. Explain why the mean gives a misleading picture of this data set.', lines: 3 },
          { number: 9, text: 'Two cricket teams both have a mean score of 30. Team A has a range of 5 and Team B has a range of 45. What does this tell you about each team\'s consistency? Which team would you rather be on? Explain.', lines: 3 },
          { number: 10, text: 'Collect your own data set of at least 8 values (e.g. daily temperatures, sport scores). Calculate all four measures and write 2–3 sentences interpreting what the statistics tell you.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-07': {
    sessionId: 'y5-mat-07',
    title: 'Measurement: Perimeter, Area & Volume',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMMG198',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Use the correct formula. Write the correct units in your answer.',
        questions: [
          { number: 1, text: 'A classroom is 9 m long and 7 m wide. Perimeter = ___. Area = ___', lines: 1 },
          { number: 2, text: 'A box is 5 cm long, 4 cm wide and 3 cm tall. Volume = ___', lines: 1 },
          { number: 3, text: 'A square playground has a perimeter of 48 m. What is one side length? ___. What is the area? ___', lines: 1 },
          { number: 4, text: 'A fish tank is 50 cm × 25 cm × 30 cm. Volume = ___ cm³. How many litres does it hold? (1 000 cm³ = 1 L) ___', lines: 1 },
          { number: 5, text: 'Convert 2.4 m² to cm². (Hint: 1 m² = 10 000 cm²) _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'A backyard pool is 8 m long, 4 m wide and 1.5 m deep. How many cubic metres of water does it hold? If 1 m³ = 1 000 litres, how many litres is that? Show working:', lines: 3 },
          { number: 7, text: 'A concrete slab for a garden shed is 4 m long, 3 m wide and 0.1 m thick. How many cubic metres of concrete are needed? Show working:', lines: 2 },
          { number: 8, text: 'A rectangular tank has volume 360 cm³. It is 12 cm long and 5 cm wide. Find the height. Show working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Two rectangular prisms have the same volume of 120 cm³. Give two different sets of dimensions (l × w × h) that both equal 120 cm³. Which would make a better box for packing? Explain.', lines: 3 },
          { number: 10, text: 'A garden bed is 3 m × 2 m × 0.2 m. You can buy potting mix in 0.1 m³ bags. How many bags do you need? What would it cost if each bag is $12.50? Show working:', lines: 3 },
          { number: 11, text: 'Design a rectangular storage box with volume between 200 and 300 cm³. Label the length, width and height. Calculate the exact volume and find what the dimensions would be in millimetres.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-08': {
    sessionId: 'y5-mat-08',
    title: 'Geometry: Shapes, Angles & Symmetry',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMMG200',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these geometry questions.',
        questions: [
          { number: 1, text: 'Classify each angle: 45° = ___. 90° = ___. 135° = ___. 180° = ___. 210° = ___', lines: 1 },
          { number: 2, text: 'A triangle has angles 50° and 70°. Find the third angle: ___. What type of triangle is it (acute, right or obtuse)?', lines: 1 },
          { number: 3, text: 'How many lines of symmetry does each shape have? Square: ___. Rectangle: ___. Equilateral triangle: ___. Scalene triangle: ___', lines: 1 },
          { number: 4, text: 'A quadrilateral has angles 110°, 85°, 75° and x°. Find x. Show working: _______________', lines: 1 },
          { number: 5, text: 'Name two shapes that have exactly 2 lines of symmetry: 1.___ 2.___. Name one shape with no lines of symmetry: ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'An isosceles triangle has one angle of 40°. If the two base angles are equal, find the value of each base angle. Show working and draw a labelled diagram:', lines: 3 },
          { number: 7, text: 'A shape is translated 5 units to the right and 3 units down, then reflected over a vertical line. Describe what happens to its size and shape at each step. Does the final position match the original?', lines: 3 },
          { number: 8, text: 'The Australian flag contains a pentagon (the Federation Star has more sides, but imagine a regular pentagon). If a regular pentagon has interior angles of 108° each, do all the angles add to 540°? Show working to verify.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working.',
        questions: [
          { number: 9, text: 'A triangle has angles in the ratio 1 : 2 : 3. Find each angle and name the type of triangle. Show working:', lines: 3 },
          { number: 10, text: 'Describe THREE real-life examples in Australia where you can find lines of symmetry (e.g. in architecture, nature or sport). Draw and label each one.', hasBox: true, lines: 0 },
          { number: 11, text: 'A regular hexagon has 6 lines of symmetry and interior angles of 120° each. Explain why a regular hexagon tiles a floor perfectly without gaps, but a regular pentagon cannot.', lines: 3 },
        ],
      },
    ],
  },

  'y5-mat-09': {
    sessionId: 'y5-mat-09',
    title: 'Statistics: Data Collection & Graphs',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMSP204',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Read the tally chart and answer the questions.',
        questions: [
          { number: 1, text: 'A class voted for their favourite Australian animal. Results: Kangaroo 8, Koala 12, Platypus 5, Wombat 9, Quokka 6. What is the total number of votes? ___. Which animal got the most votes? ___', lines: 1 },
          { number: 2, text: 'Using the data above, what fraction of students chose the Koala? ___. What percentage chose the Kangaroo? Show working: ___', lines: 1 },
          { number: 3, text: 'What is the difference between the most popular and least popular animal in the survey? ___', lines: 1 },
          { number: 4, text: 'If you were drawing a bar graph for this data, what scale would you use on the vertical axis? Explain your choice: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Use the data to answer each question.',
        questions: [
          { number: 5, text: 'Daily maximum temperatures (°C) in Melbourne for one week: Mon 22, Tue 18, Wed 25, Thu 29, Fri 31, Sat 17, Sun 24. Calculate the mean temperature and the range. What type of graph would best display this data? Explain.', lines: 3 },
          { number: 6, text: 'A Year 5 class counted cars passing the school in 30 minutes by colour: Red 14, Blue 22, White 18, Silver 11, Other 5. Draw a bar graph for this data. Label the axes and give the graph a title.', hasBox: true, lines: 0 },
          { number: 7, text: 'Using the car colour data above, what conclusion could you make about car colours in your area? Write 2–3 sentences interpreting the data.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show working and explain your reasoning.',
        questions: [
          { number: 8, text: 'Sam says that a pie chart would be better than a bar graph for the car colour data. Do you agree? Explain the advantages and disadvantages of each graph type for this data.', lines: 3 },
          { number: 9, text: 'Design your own data collection survey about something in your school or local area. Write your question, collect at least 15 responses, display the data in a graph and write a summary of your findings.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y5-mat-10': {
    sessionId: 'y5-mat-10',
    title: 'Financial Maths: Percentages & Budgeting',
    subject: 'Maths',
    yearLevel: 5,
    victorianCode: 'VCMNA178',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Calculate each percentage. Show your working.',
        questions: [
          { number: 1, text: 'Find 10% of $350 = ___. Find 25% of $350 = ___. Find 15% of $350 = ___', lines: 1 },
          { number: 2, text: 'Find 20% of $85: ___. Show working using the 10% method:', lines: 1 },
          { number: 3, text: 'A $120 jacket is on sale for 25% off. How much is saved? ___. What is the sale price? ___', lines: 1 },
          { number: 4, text: 'GST in Australia is 10%. A book costs $45 before GST. What is the total price with GST? ___', lines: 1 },
          { number: 5, text: '28 out of 40 students bring lunch from home. What percentage is that? Show working: ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'Ava receives $50 pocket money each month. She saves 40%, spends 30% on entertainment and uses 30% for food. How much does she save? How much does she spend on each category? Show working:', lines: 3 },
          { number: 7, text: 'A pair of shoes normally costs $120. The shop has a "30% off" sale. What is the sale price? If you also need to pay 10% GST on the sale price, what is the final amount you pay? Show working:', lines: 3 },
          { number: 8, text: 'A Year 5 student scored 32 out of 40 on a maths test and 27 out of 30 on a spelling test. Convert each score to a percentage and compare them. Which test did they do better in? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Ben has $200 to spend on a school camp. Accommodation costs $85, meals cost $45 and activities cost $55. How much does he have left over? What percentage of his total budget did he spend? Show working:', lines: 3 },
          { number: 10, text: 'A price increased by 20% then decreased by 20%. Is the final price the same as the original? Use $100 as your starting price to prove your answer.', lines: 3 },
          { number: 11, text: 'Create a monthly budget for a Year 5 student who receives $60 per month. Decide how much to save, spend and donate. Use percentages and dollar amounts. Justify your choices.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Y6 MATHS (sessions 04–10)
  // ─────────────────────────────────────────────────────────────

  'y6-mat-04': {
    sessionId: 'y6-mat-04',
    title: 'Fractions: Comparing, Ordering & Equivalent Fractions',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMNA168',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these fraction questions. Show all working.',
        questions: [
          { number: 1, text: 'Write three fractions equivalent to 2/5: ___, ___, ___', lines: 1 },
          { number: 2, text: 'Simplify 24/36 to lowest terms. HCF = ___. Answer: ___', lines: 1 },
          { number: 3, text: 'Simplify 15/40. HCF = ___. Answer: ___', lines: 1 },
          { number: 4, text: 'Find the LCD of 4 and 6: ___. Then calculate ¼ + ⅓ = ___', lines: 1 },
          { number: 5, text: 'Order from smallest to largest: ½, ⅓, ¾, ¼ (convert to the same denominator first). Working: ___. Order: ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'Three friends share two pizzas. Ava eats 3/8, Ben eats ½ and Cleo eats 1/4. How much pizza did they eat altogether? How much is left? Write your answer in simplest form. Show working:', lines: 3 },
          { number: 7, text: 'A garden is divided into sections: roses take ⅓, vegetables take ¼ and herbs take ⅙. What fraction is left for lawn? Show working using a common denominator:', lines: 3 },
          { number: 8, text: 'Which is greater: 4/7 or 5/9? Find the LCD and convert both fractions to compare them. Show full working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Order these fractions from smallest to largest: 2/3, 5/8, 3/4, 7/12. Find a common denominator for all four and show your full working.', lines: 3 },
          { number: 10, text: 'A recipe calls for 3/4 cup of butter. You only have 1/3 cup. How much more do you need? Write the answer in two ways: as a fraction and as a decimal.', lines: 3 },
          { number: 11, text: 'A student claims that 3/5 > 5/8 because 3+5 = 8 and 5+8 = 13, and 8/13 shows 3/5 is bigger. Explain clearly why this reasoning is wrong and show the correct comparison method.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-05': {
    sessionId: 'y6-mat-05',
    title: 'Decimals: Multiplying and Dividing by 10, 100, 1000',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMNA171',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Calculate each answer and convert the measurements as shown.',
        questions: [
          { number: 1, text: '0.056 × 100 = ___. 7300 ÷ 1000 = ___. 4.7 × 1000 = ___', lines: 1 },
          { number: 2, text: 'Convert: 4.85 km to metres: ___. 2500 g to kilograms: ___', lines: 1 },
          { number: 3, text: '6.3 × 9 = ___ (ignore decimal, multiply, then replace). Show working: _______________', lines: 1 },
          { number: 4, text: '15.6 ÷ 4 = ___. Show working: _______________', lines: 1 },
          { number: 5, text: 'Calculate: (a) 0.43 × 1000 = ___  (b) 8200 ÷ 100 = ___  (c) 7.65 × 10 = ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'A road is 4.85 km long. A cyclist rides it 3 times. How many metres does the cyclist travel in total? Show working:', lines: 3 },
          { number: 7, text: 'Four friends split a restaurant bill of $92.40 equally. How much does each person pay? Show working:', lines: 2 },
          { number: 8, text: 'A plank of timber is 7.2 m long and is cut into 8 equal pieces. How long is each piece in metres? In centimetres? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Which is larger: 4.5 × 100 or 3.8 × 1000? Calculate both and explain why multiplying by a bigger power of 10 does not always give the biggest result.', lines: 3 },
          { number: 10, text: 'A car travels 0.4 km every minute on a freeway. How far does it travel in: (a) 10 minutes (b) 100 minutes? Give answers in both km and metres. Show all working:', lines: 3 },
          { number: 11, text: 'A scientist measures a cell as 0.0035 mm wide. Convert this to micrometres (× 1000) and to nanometres (× 1 000 000). Show all working and explain the pattern you notice when multiplying by powers of 10.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-06': {
    sessionId: 'y6-mat-06',
    title: 'Percentages: Finding Percentages of Quantities',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMNA171',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Calculate each percentage. Show your method.',
        questions: [
          { number: 1, text: 'Find 20% of $65: ___. Find 5% of 180: ___. Find 35% of $240: ___', lines: 1 },
          { number: 2, text: 'A jacket costs $120. It is 25% off. How much is the discount? ___. Sale price? ___', lines: 1 },
          { number: 3, text: 'A textbook costs $55 before GST (10%). Total price = ___. Show working:', lines: 1 },
          { number: 4, text: 'A price tag shows $165 including 10% GST. Pre-GST price = ___ (Hint: divide by 1.1). Show working:', lines: 1 },
          { number: 5, text: '30 out of 40 students passed a test. What percentage passed? ___. What percentage did not pass? ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'A $280 course increases in price by 15%. What is the new price? (Hint: 15% = 10% + 5%). Show working:', lines: 3 },
          { number: 7, text: 'A $960 laptop is 25% off. What is the sale price? If you then pay 10% GST on the sale price, what is the final amount you pay? Show working:', lines: 3 },
          { number: 8, text: 'A school had 400 students last year. This year it has 460 students. What is the percentage increase? Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Find these percentages: (a) 30% of 250  (b) 12% of $85  (c) 6% of 1400  (d) 125% of 80. Explain what it means when the percentage is greater than 100%.', lines: 3 },
          { number: 10, text: 'A restaurant bill is $96. If you tip 15%, what is the total amount you pay? Show working using the 10% method:', lines: 3 },
          { number: 11, text: 'A shoe store marks up shoes by 40% from the wholesale price, then discounts them 40% in a sale. Are the shoes back at the wholesale price? Use $100 to prove your answer and explain what happens.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-07': {
    sessionId: 'y6-mat-07',
    title: 'Algebra: Patterns, Rules and Substitution',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMNA179',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these algebra questions. Show all working.',
        questions: [
          { number: 1, text: 'Evaluate 6n − 4 when n = 5: ___. Evaluate 2a + 3b when a = 5 and b = 4: ___', lines: 1 },
          { number: 2, text: 'Pattern: 4, 7, 10, 13, ... Which rule generates this? (a) 4n  (b) 3n + 1  (c) 2n + 2  (d) n + 3. Check: ___', lines: 1 },
          { number: 3, text: 'Find the rule for the table: n: 1, 2, 3, 4 → Output: 5, 9, 13, 17. Rule: ___. Find the 10th term: ___', lines: 1 },
          { number: 4, text: 'Solve: 3n + 6 = 21. Show working: n = ___. Check: ___', lines: 1 },
          { number: 5, text: 'Solve: 5n − 4 = 21. Show working: n = ___. Check: ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Write an equation or formula, then solve. Show all working.',
        questions: [
          { number: 6, text: 'A taxi charges $3.50 flag fall plus $2.20 per kilometre. Write the cost formula: C = ___. Find the cost for 7 km. Find the cost for 12 km. Show working:', lines: 3 },
          { number: 7, text: 'A pool holds 1 800 litres and is drained at 200 litres per hour. Write a formula for litres remaining after h hours: L = ___. How many hours until it is empty? Show working:', lines: 3 },
          { number: 8, text: 'A phone plan charges $15 per month plus $0.10 per text. Write a formula for monthly cost C with t texts. Find the cost for 45 texts and for 120 texts. Show working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'Evaluate these expressions: (a) 5n + 3 when n=4  (b) 8 − 2n when n=3  (c) n² + 1 when n=7. Explain what n² means.', lines: 3 },
          { number: 10, text: 'If 4n + 3 = 23, find n. Then explain how you could check your answer by substituting back into the equation.', lines: 3 },
          { number: 11, text: 'Create a real-world scenario that can be modelled by a linear rule (like a taxi fare or a savings plan). Write the formula, create a table of values for n = 1 to 5, and graph it on the grid provided.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-08': {
    sessionId: 'y6-mat-08',
    title: 'Geometry: 2D Shapes, Angles and Transformations',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMMG200',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Answer these geometry questions. Show working where needed.',
        questions: [
          { number: 1, text: 'A triangle has two angles of 55° each. Find the third angle: ___. Name the triangle type: ___', lines: 1 },
          { number: 2, text: 'A quadrilateral has angles 90°, 85°, 100° and x°. Find x. Show working: x = ___', lines: 1 },
          { number: 3, text: 'Interior angle of a regular pentagon: (5−2) × 180 ÷ 5 = ___°. Interior angle of a regular hexagon: ___°', lines: 1 },
          { number: 4, text: 'How many lines of symmetry does each shape have? Equilateral triangle: ___. Square: ___. Rectangle: ___. Kite: ___', lines: 1 },
          { number: 5, text: 'Name the transformation: "A shape is flipped over a vertical line" = ___. "A shape slides 4 right and 2 up" = ___. "A shape turns 90° clockwise" = ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 6, text: 'Find the missing angle in each shape: (a) Triangle with 74° and 53°: x = ___  (b) Quadrilateral with 110°, 95°, 80°: x = ___  (c) An isosceles triangle with apex angle 40° — find the two equal base angles. Show all working:', lines: 3 },
          { number: 7, text: 'A shape on a grid is reflected over a vertical mirror line, then translated 3 units right and 2 units up. Does it change size or shape? Describe precisely what happens at each step.', lines: 3 },
          { number: 8, text: 'A regular octagon has 8 sides. Find each interior angle using the formula (n−2) × 180 ÷ n. Do the 8 angles add to 1080°? Show working to verify.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 9, text: 'A parallelogram has one angle of 75°. What are the other three angles? Explain the properties of a parallelogram you used to find them.', lines: 3 },
          { number: 10, text: 'Why do regular hexagons tile a floor perfectly but regular pentagons do not? Use the interior angle formula to explain. (Hint: angles meeting at a point must sum to 360°.)', lines: 3 },
          { number: 11, text: 'Draw a shape on grid paper and apply TWO different transformations. Label each shape (original, after step 1, after step 2). Describe each transformation precisely using correct mathematical language.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-09': {
    sessionId: 'y6-mat-09',
    title: 'Statistics: Mean, Median, Mode and Range',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMSP215',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Calculate each statistical measure. Show all working.',
        questions: [
          { number: 1, text: 'Data: 7, 12, 8, 15, 8, 10, 13, 8, 11, 18. First order the data: ___. Mean = ___. Median = ___. Mode = ___. Range = ___', lines: 2 },
          { number: 2, text: 'A data set has 6 values. The 3rd is 14 and the 4th is 18 (after ordering). Median = ___. Explain why:', lines: 1 },
          { number: 3, text: 'Data: 5, 5, 5, 5, 100. Mean = ___. Median = ___. Mode = ___. Range = ___', lines: 1 },
          { number: 4, text: 'Which measure (mean/median/mode) is most affected by the value 100 in question 3? ___. Explain: _______________', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working. Write a sentence answer.',
        questions: [
          { number: 5, text: 'House prices in a street: $450 000, $480 000, $510 000, $490 000 and $1 400 000. Calculate the mean and median. Which is more useful for a buyer wanting to know the "typical" price? Explain.', lines: 3 },
          { number: 6, text: 'A Year 6 student\'s test scores: 72, 85, 68, 91, 85, 74, 85, 78. Calculate all four measures. The teacher offers to drop the lowest score. Recalculate the mean with the lowest score removed. What is the difference?', lines: 3 },
          { number: 7, text: 'Two basketball teams both have a mean score of 68 points. Team A has a range of 4; Team B has a range of 42. What does this tell you about each team\'s scoring consistency? Which team is more predictable?', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'Think carefully. Show all working and explain your reasoning.',
        questions: [
          { number: 8, text: 'The mean of five numbers is 12. Four of the numbers are 8, 15, 10 and 14. Find the fifth number. Show working:', lines: 3 },
          { number: 9, text: 'A shoe shop wants to know which size to stock most. The sizes sold last week were: 8, 9, 9, 10, 8, 9, 7, 10, 9, 8, 9, 11, 8, 9, 8. Which measure should they use and why? Calculate it.', lines: 3 },
          { number: 10, text: 'Design a statistical investigation. Choose a question, collect at least 10 data values, calculate all four measures, display the data in a graph and write a 3–4 sentence interpretation of what the statistics show.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-10': {
    sessionId: 'y6-mat-10',
    title: 'Problem Solving: Multi-Step Word Problems',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'VCMNA170',
    sections: [
      {
        heading: 'Section 1 – Fluency',
        instructions: 'Solve each problem. Show your working clearly.',
        questions: [
          { number: 1, text: 'A shop sells 3 types of sandwiches: $5.50, $6.80 and $4.90. If 12 of the first, 8 of the second and 15 of the third are sold, what is the total income? Show working:', lines: 2 },
          { number: 2, text: 'A car travels at 60 km/h for 2.5 hours, then 80 km/h for 1.5 hours. What is the total distance travelled? Show working:', lines: 2 },
          { number: 3, text: 'A rectangular pool is 12 m × 8 m × 1.5 m deep. How many litres of water does it hold? (1 m³ = 1 000 L). Show working:', lines: 2 },
          { number: 4, text: 'A shirt costs $45 before GST. After 10% GST is added, then 20% discount is applied. What is the final price? Show working:', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Problem Solving',
        instructions: 'Show all working step by step. Write a sentence answer.',
        questions: [
          { number: 5, text: 'A school fundraiser sold 240 raffle tickets at $3.50 each. Costs were $85 for printing and $120 for prizes. How much profit did the school make? What percentage of the total income was profit? Show working:', lines: 3 },
          { number: 6, text: 'Mia and Tom share $84. Tom gets $12 more than Mia. Write an equation and solve it to find how much each person gets. Show working:', lines: 3 },
          { number: 7, text: 'A recipe for 6 people needs 450 g of flour, 3 eggs and 240 mL of milk. Adjust the recipe for 10 people. Show all working:', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Reasoning & Extension',
        instructions: 'These are multi-step problems. Plan your approach before calculating.',
        questions: [
          { number: 8, text: 'Three friends run a 42 km marathon. Each runs a different section: Alex runs 1/3 of the total distance, Ben runs 35% and Cleo runs the rest. How many kilometres does each person run? Show working:', lines: 3 },
          { number: 9, text: 'A mobile phone plan charges $25 per month plus $0.08 per minute of calls. In one month, a customer made 180 minutes of calls. What was the bill? If the customer has a budget of $40 per month, how many minutes can they talk before exceeding it? Show working:', lines: 3 },
          { number: 10, text: 'Design your own multi-step problem set in an Australian context (e.g. AFL, shopping, travel). It must use at least 3 different mathematical operations. Write the problem, solve it, and explain each step of your solution.', hasBox: true, lines: 0 },
        ],
      },
    ],
  },

  'y6-mat-03': {
    sessionId: 'y6-mat-03',
    title: 'Algebra & Patterns',
    subject: 'Maths',
    yearLevel: 6,
    victorianCode: 'MA6-ALG-01',
    sections: [
      {
        heading: 'Section 1 – Patterns & Rules',
        instructions: 'Describe patterns, find rules, and extend sequences.',
        questions: [
          { number: 1, text: 'Extend the pattern: 4, 9, 14, 19, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 2, text: 'Extend the pattern: 3, 6, 12, 24, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 3, text: 'Extend the pattern: 100, 93, 86, 79, ___, ___, ___. Rule: _______________', lines: 1 },
          { number: 4, text: 'A pattern has the rule: multiply by 3 then subtract 1. If the first term is 2, write the first 5 terms: ___, ___, ___, ___, ___', lines: 1 },
          { number: 5, text: 'A tiling pattern: Term 1 has 1 tile, Term 2 has 4 tiles, Term 3 has 9 tiles. How many tiles in Term 4? ___ Term 5? ___ What is the rule? ___', lines: 1 },
          { number: 6, text: 'Write a rule for this table:\nx: 1, 2, 3, 4, 5\ny: 5, 8, 11, 14, 17\nRule: y = ___', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Variables & Expressions',
        instructions: 'Write and evaluate algebraic expressions.',
        questions: [
          { number: 7, text: 'Write an expression: "3 more than n" → ___', lines: 1 },
          { number: 8, text: 'Write an expression: "double m then subtract 4" → ___', lines: 1 },
          { number: 9, text: 'Write an expression: "the product of p and 7, divided by 2" → ___', lines: 1 },
          { number: 10, text: 'Evaluate 3x + 5 when x = 4: ___. Show working: _______________', lines: 1 },
          { number: 11, text: 'Evaluate 2a − b when a = 6 and b = 3: ___. Show working: _______________', lines: 1 },
          { number: 12, text: 'Evaluate (m + n)² when m = 2 and n = 3: ___. Show working: _______________', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Equations',
        instructions: 'Solve for the unknown variable. Show all working.',
        questions: [
          { number: 13, text: 'x + 7 = 15 → x = ___. Check: ___ + 7 = ___', lines: 1 },
          { number: 14, text: '3y = 24 → y = ___. Check: 3 × ___ = ___', lines: 1 },
          { number: 15, text: '2m − 5 = 11 → m = ___. Show working:', lines: 2 },
          { number: 16, text: 'n/4 + 3 = 8 → n = ___. Show working:', lines: 2 },
          { number: 17, text: '5p − 3 = 2p + 9 → p = ___. Show working:', lines: 3 },
          { number: 18, text: 'Write your own equation with one unknown. Solve it and show your check:', lines: 3 },
        ],
      },
      {
        heading: 'Section 4 – Word Problems (Algebraic Thinking)',
        instructions: 'Write an equation for each problem, then solve it. Show all working.',
        questions: [
          { number: 19, text: 'I think of a number, multiply it by 4 and add 3. The answer is 27. What is my number? Write an equation: ___. Solve:', lines: 3 },
          { number: 20, text: 'A rectangle has a perimeter of 48 cm. Its length is 14 cm. Write an equation and find the width. Show working:', lines: 3 },
          { number: 21, text: 'Mia and Tom share $72. Tom gets $12 more than Mia. How much does each person get? Write equations and solve:', lines: 4 },
          { number: 22, text: 'A pattern of tables and chairs: 1 table needs 4 chairs, 2 tables need 6 chairs, 3 tables need 8 chairs. Write a formula for the number of chairs (c) given the number of tables (t). How many chairs for 10 tables?', lines: 4 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Y5 ENGLISH
  // ─────────────────────────────────────────────────────────────

  'y5-eng-01': {
    sessionId: 'y5-eng-01',
    title: 'Narrative: Point of View',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY321',
    sections: [
      {
        heading: 'Section 1 – Understanding Point of View',
        instructions: 'Answer the following questions about narrative point of view.',
        questions: [
          { number: 1, text: 'What pronouns tell you a story uses first person narration? Give two examples.', lines: 1 },
          { number: 2, text: 'What is the difference between third person limited and third person omniscient narration?', lines: 2 },
          { number: 3, text: 'Read: "I gripped the torch and crept towards the sound." What point of view is this? How do you know?', lines: 2 },
          { number: 4, text: 'Read: "Maya didn\'t know it yet, but the stranger had been watching her all morning." What point of view is this? How do you know?', lines: 2 },
          { number: 5, text: 'What is "head-hopping" in fiction writing? Why should writers avoid it?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing Point of View',
        instructions: 'Read the two passages below, then answer the questions that follow.',
        questions: [
          { number: 6, text: 'PASSAGE A: "I pressed myself against the cold rock and held my breath. My heart was hammering so loud I was sure they could hear it."\nPASSAGE B: "Zara pressed herself against the cold rock. Outside, Torres paused — he had heard something. Her panicked breathing was about to give her away."\n\nWhich passage creates dramatic irony? Explain why.', lines: 3 },
          { number: 7, text: 'In Passage A, what does the reader NOT know that creates tension?', lines: 2 },
          { number: 8, text: 'In Passage B, what does the reader know that Zara does NOT know? How does this affect the tension?', lines: 2 },
          { number: 9, text: 'If you were writing a mystery where the reader should be kept in the dark, which point of view would you choose? Explain your reasoning.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Choose a tense moment and write it twice. Use the space provided.',
        questions: [
          { number: 10, text: 'Describe your chosen moment and setting in one sentence (e.g. a bushfire approaching, a penalty shootout, being lost in the bush).', lines: 1 },
          { number: 11, text: 'Write your moment in FIRST PERSON (4–5 sentences). Use "I" and let the reader share your fear or excitement.', lines: 4 },
          { number: 12, text: 'Now write the SAME moment in THIRD PERSON OMNISCIENT (4–5 sentences). Reveal something the character does not know.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-02': {
    sessionId: 'y5-eng-02',
    title: 'Persuasive Texts',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY322',
    sections: [
      {
        heading: 'Section 1 – Persuasive Techniques',
        instructions: 'Answer the following questions about persuasive writing.',
        questions: [
          { number: 1, text: 'What is the purpose of a persuasive text? How is it different from a balanced discussion?', lines: 2 },
          { number: 2, text: 'What is a rhetorical question? Write one example about a topic of your choice.', lines: 2 },
          { number: 3, text: 'Underline the emotive language in this sentence and explain its effect: "The heartbreaking destruction of our ancient forests must be stopped before it is too late."', lines: 2 },
          { number: 4, text: 'What does the OREO structure stand for? Write out each letter with its meaning.', lines: 2 },
          { number: 5, text: 'What does it mean to "concede and refute" in persuasive writing? Why does this make your argument stronger?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing a Persuasive Text',
        instructions: 'Read this short opinion piece, then answer the questions below.\n\n"Every day, millions of Australian students sit inside during lunch when they could be learning in nature. Research proves that just 20 minutes of outdoor time improves focus by 35%. Will we ignore the science while our children\'s wellbeing suffers? Schools must act now."',
        questions: [
          { number: 6, text: 'What is the writer\'s position? Write it as a clear statement.', lines: 1 },
          { number: 7, text: 'Identify one example of emotive language and explain its effect on the reader.', lines: 2 },
          { number: 8, text: 'Find the rhetorical question. What is it designed to make the reader feel?', lines: 2 },
          { number: 9, text: 'What evidence does the writer use? Is it convincing? Give a reason for your answer.', lines: 2 },
          { number: 10, text: 'Write a counter-argument someone might raise against this opinion piece.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Plan and write a persuasive paragraph on a topic you feel strongly about.',
        questions: [
          { number: 11, text: 'My topic and clear position statement:', lines: 1 },
          { number: 12, text: 'Write ONE OREO body paragraph defending your position. Include emotive language, a piece of evidence and link back to your position.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-03': {
    sessionId: 'y5-eng-03',
    title: 'Figurative Language',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY323',
    sections: [
      {
        heading: 'Section 1 – Identifying Figurative Devices',
        instructions: 'Identify the figurative device in each sentence (simile, metaphor or personification) and explain what is being compared or given human qualities.',
        questions: [
          { number: 1, text: '"The harbour shimmered like crumpled silver foil." Device: ___. What is being compared?', lines: 1 },
          { number: 2, text: '"The storm was a demolition crew sent to flatten everything." Device: ___. What is being compared?', lines: 1 },
          { number: 3, text: '"The gum trees leaned in to listen as she told her secret." Device: ___. What human quality is given?', lines: 1 },
          { number: 4, text: '"The outback was a furnace that broiled everything it touched." Device: ___. What effect does this create?', lines: 2 },
          { number: 5, text: '"The creek moved like old, tired blood." Device: ___. What impression does this create?', lines: 2 },
          { number: 6, text: 'What is the key difference between a simile and a metaphor? Give one example of each.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing Figurative Language',
        instructions: 'Use the analysis formula — "This [device] creates the impression of [quality] because [explanation]" — to answer the following.',
        questions: [
          { number: 7, text: 'Analyse: "The highway swallowed car after car, never satisfied." Identify the device and explain its effect on the reader.', lines: 3 },
          { number: 8, text: 'Explain why "as cold as ice" is considered a weak simile at Year 5 level.', lines: 2 },
          { number: 9, text: 'Write TWO personification sentences about the same subject — one that makes it feel welcoming and one that makes it feel threatening.', lines: 3 },
          { number: 10, text: 'What is an extended metaphor? Write one example across two sentences about an Australian storm.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Choose an Australian place or event and write a descriptive paragraph using figurative language.',
        questions: [
          { number: 11, text: 'My chosen subject (e.g. the MCG during a final, a Queensland storm, the Great Barrier Reef):', lines: 1 },
          { number: 12, text: 'Write a descriptive paragraph (5–7 sentences) about your subject. You must include at least ONE simile, ONE metaphor and ONE personification. Underline each device and label it in the margin.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-04': {
    sessionId: 'y5-eng-04',
    title: 'News Reports',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY324',
    sections: [
      {
        heading: 'Section 1 – News Report Features',
        instructions: 'Answer the following questions about the features and language of news reports.',
        questions: [
          { number: 1, text: 'What are the 5Ws? Write each one out in full.', lines: 1 },
          { number: 2, text: 'What does the "inverted pyramid" structure mean in news report writing?', lines: 2 },
          { number: 3, text: 'What is the difference between a headline, a byline and a lead paragraph?', lines: 2 },
          { number: 4, text: 'Rewrite this headline using correct news style (present tense, active voice, no unnecessary articles): "Yesterday some students from a local school in Melbourne went and won a big science competition."', lines: 1 },
          { number: 5, text: 'Which sentence uses objective language? Circle your answer and explain.\nA: "The shocking and outrageous decision devastated the community."\nB: "The council voted 7–4 on Tuesday to close the library from January."', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing a Lead Paragraph',
        instructions: 'Read the lead paragraph below, then answer the questions.\n\n"Students from Parkview Primary School planted 1,000 native trees at Yarra Bend Park on Friday as part of a Victorian Government restoration initiative to combat habitat loss."',
        questions: [
          { number: 6, text: 'Identify each of the 5Ws in this lead. Write WHO, WHAT, WHEN, WHERE and WHY with your answers.', lines: 3 },
          { number: 7, text: 'Is anything missing from this lead? What extra detail would improve it?', lines: 2 },
          { number: 8, text: 'Why should a quote in a news report always be attributed to a named person?', lines: 2 },
          { number: 9, text: 'Write a quote (1–2 sentences) that a student from the tree-planting event might say. Set it out correctly with speech marks and attribution.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Write a short news report about a real or invented event at your school.',
        questions: [
          { number: 10, text: 'My headline (short, present tense, active voice):', lines: 1 },
          { number: 11, text: 'Write your full news report — headline, lead paragraph (all 5Ws), one body paragraph, and one quote. Use objective language throughout.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-05': {
    sessionId: 'y5-eng-05',
    title: 'Vocabulary in Context',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY325',
    sections: [
      {
        heading: 'Section 1 – Context Clues',
        instructions: 'Use context clues to work out the meaning of each underlined word. State which type of clue you used (definition, example, contrast or inference).',
        questions: [
          { number: 1, text: '"The wombat is nocturnal, meaning it is active at night." Meaning of nocturnal: ___. Clue type: ___', lines: 1 },
          { number: 2, text: '"Unlike her gregarious brother who loved parties, Priya was solitary by nature." Meaning of gregarious: ___. Clue type: ___', lines: 1 },
          { number: 3, text: '"The politician\'s obfuscation made it impossible for journalists to get a straight answer." Meaning of obfuscation: ___. Clue type: ___', lines: 2 },
          { number: 4, text: '"Marsupials, such as kangaroos, wombats and possums, carry their young in pouches." Meaning of marsupials: ___. Clue type: ___', lines: 1 },
          { number: 5, text: 'Using the REAP strategy (Read, Examine, Ask, Predict), work out the meaning of "resilient" in: "The ecosystem was remarkably resilient despite the bushfire."', lines: 3 },
        ],
      },
      {
        heading: 'Section 2 – Connotations and Word Choice',
        instructions: 'Answer these questions about connotations and precise vocabulary.',
        questions: [
          { number: 6, text: 'Place these synonyms for "thin" on a spectrum from most negative to most positive: scrawny, slender, slim, bony, thin. Explain the difference between the most negative and most positive.', lines: 3 },
          { number: 7, text: 'A journalist wants to write a neutral report. Which verb is most appropriate: "claimed", "stated" or "admitted"? Explain why the other two are not neutral.', lines: 2 },
          { number: 8, text: 'Rewrite this vague sentence using precise vocabulary: "The rain made the river bigger and it flowed faster."', lines: 2 },
          { number: 9, text: 'If you know the root "chronos" means time, decode these words: chronology, synchronise, chronic.', lines: 2 },
          { number: 10, text: 'What is the difference between a word\'s denotation and its connotation? Give an example using "frugal" and "miserly".', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Apply your vocabulary skills in a short piece of writing.',
        questions: [
          { number: 11, text: 'Choose ONE of the following topics and write 4–5 sentences about it. You must: (a) use at least three precise/ambitious vocabulary choices, (b) avoid vague words like "nice", "big" or "bad", and (c) circle your three best word choices.\nTOPICS: a storm rolling in over the coast / a busy school canteen at lunchtime / the feeling of crossing the finish line.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-06': {
    sessionId: 'y5-eng-06',
    title: 'Editing and Revising',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY326',
    sections: [
      {
        heading: 'Section 1 – Revising and Editing Knowledge',
        instructions: 'Answer the following questions about the revision and editing process.',
        questions: [
          { number: 1, text: 'What is the difference between revising and editing? Give one example of each.', lines: 2 },
          { number: 2, text: 'What is "sentence variety" and why does it improve a piece of writing?', lines: 2 },
          { number: 3, text: 'What are cohesive devices? Name two examples.', lines: 2 },
          { number: 4, text: 'Read this paragraph: "The dog ran. The dog barked. The dog jumped. The dog was excited." Identify the problem and suggest two specific improvements.', lines: 3 },
          { number: 5, text: 'Name TWO things you should check when editing for surface errors.', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Revise and Edit a Paragraph',
        instructions: 'Read the paragraph below carefully, then answer the questions.\n\n"Last saturday our class went to the museum. It was good. We saw dinosaur bones. They was very big. I liked the ones with the long necks best. We also saw rocks and stuff. Then we went home."',
        questions: [
          { number: 6, text: 'Find and correct THREE surface errors (spelling, punctuation or grammar) in the paragraph. Write each correction.', lines: 3 },
          { number: 7, text: 'The paragraph has poor sentence variety. Rewrite the first three sentences as ONE well-constructed complex sentence.', lines: 2 },
          { number: 8, text: 'Replace the vague words "good", "big" and "stuff" with more precise vocabulary.', lines: 2 },
          { number: 9, text: 'Add a cohesive device to link this sentence to the previous one: "___ we also saw an exhibition about ancient Egypt."', lines: 1 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Write and then self-edit a short paragraph.',
        questions: [
          { number: 10, text: 'Write a paragraph (5–6 sentences) about an experience that mattered to you. Focus on varied sentence length and precise vocabulary.', lines: 0, hasBox: true },
          { number: 11, text: 'Self-edit checklist — tick each item once you have checked your paragraph above:\n☐ Sentences vary in length (some short, some longer)\n☐ No two sentences in a row start the same way\n☐ At least two precise/ambitious vocabulary choices\n☐ At least one cohesive device (e.g. however, furthermore, as a result)\n☐ Capital letters and punctuation correct', lines: 1 },
        ],
      },
    ],
  },

  'y5-eng-07': {
    sessionId: 'y5-eng-07',
    title: 'Poetry: Forms and Features',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELT310',
    sections: [
      {
        heading: 'Section 1 – Poetry Knowledge',
        instructions: 'Answer the following questions about poetic forms and features.',
        questions: [
          { number: 1, text: 'What is the syllable pattern for a haiku? Write it out (e.g. __ / __ / __) and give an example.', lines: 2 },
          { number: 2, text: 'What is free verse poetry? How is it different from poetry that uses rhyme and regular rhythm?', lines: 2 },
          { number: 3, text: 'What is alliteration? Write one example from your own imagination about the sea.', lines: 2 },
          { number: 4, text: 'What is onomatopoeia? Write three onomatopoeic words related to a thunderstorm.', lines: 1 },
          { number: 5, text: 'How does a line break in poetry differ from a full stop? What effect can a well-placed line break create?', lines: 2 },
          { number: 6, text: 'What is imagery in poetry? How is it different from the literal meaning of the words?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing a Poem',
        instructions: 'Read the haiku below, then answer the questions.\n\n"Red dust on the track —\nthe wedge-tail rides the hot air,\nnothing moves below."',
        questions: [
          { number: 7, text: 'Count the syllables in each line. Does this haiku follow the 5-7-5 pattern?', lines: 2 },
          { number: 8, text: 'What image does the poem create? What mood or feeling does it give the reader?', lines: 2 },
          { number: 9, text: 'Identify ONE example of imagery in the poem. Explain what it makes you picture.', lines: 2 },
          { number: 10, text: 'What Australian setting does this poem describe? List two specific details as evidence.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Write your own poems using the forms you studied in this lesson.',
        questions: [
          { number: 11, text: 'Write a haiku (5-7-5 syllables) about an Australian animal, place or season. Count your syllables carefully and write them beside each line.', lines: 3 },
          { number: 12, text: 'Now write a free verse poem (6–10 lines) about the same subject. Focus on strong imagery — help the reader see, hear and feel your subject. Use at least one sound device (alliteration or onomatopoeia).', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-08': {
    sessionId: 'y5-eng-08',
    title: 'Speaking: Persuasive Speech',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELY323',
    sections: [
      {
        heading: 'Section 1 – Persuasive Speaking Skills',
        instructions: 'Answer the following questions about delivering a persuasive speech.',
        questions: [
          { number: 1, text: 'Name THREE vocal techniques that make a persuasive speech more effective. For each one, explain how it helps the audience.', lines: 3 },
          { number: 2, text: 'What is the purpose of deliberate pausing in a speech? When would you pause for maximum effect?', lines: 2 },
          { number: 3, text: 'What is the difference between a written opinion piece and a spoken persuasive speech? Name two differences.', lines: 2 },
          { number: 4, text: 'What is the rule of three in rhetoric? Write an example sentence that uses it.', lines: 2 },
          { number: 5, text: 'Why is eye contact important when delivering a speech? What message does it send to the audience?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Analysing a Speech Extract',
        instructions: 'Read this extract from a student speech, then answer the questions.\n\n"Every day, thousands of animals lose their homes because of deforestation. Every. Single. Day. How many more must suffer before we act? We can change this — we must change this — and we must change it now."',
        questions: [
          { number: 6, text: 'Identify TWO rhetorical techniques used in this extract and name them.', lines: 2 },
          { number: 7, text: 'Why does the speaker repeat "Every. Single. Day." as three separate sentences? What effect does this create?', lines: 2 },
          { number: 8, text: 'Identify the rhetorical question. What is it designed to make the audience feel?', lines: 2 },
          { number: 9, text: 'Where would you pause if you were delivering this speech? Mark two spots with a / and explain why you chose those moments.', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Plan and write a 2-minute persuasive speech.',
        questions: [
          { number: 10, text: 'My topic and position statement (one sentence):',  lines: 1 },
          { number: 11, text: 'My strongest argument (OREO paragraph — one claim with reason and evidence):', lines: 3 },
          { number: 12, text: 'Write your speech introduction and conclusion. Include: a strong hook, a clear position, a rhetorical question or the rule of three, and a call to action.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-09': {
    sessionId: 'y5-eng-09',
    title: 'Grammar: Complex Sentences',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELA319',
    sections: [
      {
        heading: 'Section 1 – Subordinate Clauses and Conjunctions',
        instructions: 'Answer these questions about complex sentences.',
        questions: [
          { number: 1, text: 'What is a subordinate clause? How is it different from a main clause?', lines: 2 },
          { number: 2, text: 'Name four subordinating conjunctions and write a sentence using each one.', lines: 3 },
          { number: 3, text: 'Combine these two simple sentences into one complex sentence using a subordinating conjunction:\n"It was raining heavily. We decided to stay inside."', lines: 2 },
          { number: 4, text: 'Combine these two simple sentences into one complex sentence:\n"She studied hard every night. She passed the test."', lines: 2 },
          { number: 5, text: 'When a subordinate clause comes at the START of a sentence, what punctuation do you need? Write an example.', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Identifying and Using Complex Sentences',
        instructions: 'Read each sentence and answer the questions.',
        questions: [
          { number: 6, text: 'Underline the main clause and circle the subordinate clause:\n"Although the team was exhausted, they kept running until the final whistle."', lines: 1 },
          { number: 7, text: 'Underline the main clause and circle the subordinate clause:\n"Before she could answer, the teacher called on someone else."', lines: 1 },
          { number: 8, text: 'Explain what relationship the subordinating conjunction "although" expresses between two ideas (e.g. cause, time, contrast, condition).', lines: 1 },
          { number: 9, text: 'Explain what relationship the subordinating conjunction "because" expresses. Write a sentence using it to show a cause-and-effect relationship.', lines: 2 },
          { number: 10, text: 'Rewrite this paragraph to replace at least TWO simple sentences with complex sentences:\n"The storm came. We ran inside. The rain was loud. We waited."', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Use complex sentences in your own writing.',
        questions: [
          { number: 11, text: 'Write 5–6 sentences describing what happens before and after school. Each sentence must be a complex sentence — use a different subordinating conjunction each time. Label the subordinating conjunction in each sentence.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-10': {
    sessionId: 'y5-eng-10',
    title: 'Reading: Inference and Interpretation',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELT305',
    sections: [
      {
        heading: 'Section 1 – Literal vs Inferential Reading',
        instructions: 'Answer these questions about reading comprehension strategies.',
        questions: [
          { number: 1, text: 'What is the difference between a literal question and an inferential question? Give an example of each.', lines: 2 },
          { number: 2, text: 'What does it mean to "read between the lines"? Why can\'t you always find the answer by looking directly at the text?', lines: 2 },
          { number: 3, text: 'What is "author intent"? Why is it useful to think about why an author included a particular detail?', lines: 2 },
          { number: 4, text: 'When justifying an inference with evidence, what does the phrase "The text says… which suggests…" help you do?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Close Reading Practice',
        instructions: 'Read the passage carefully, then answer all questions. Use evidence from the text.\n\n"Sam hadn\'t eaten since morning. He sat outside the bakery and watched people carrying warm bags past him, not looking down. He counted the coins in his pocket — three times. Then he stood up and walked in the opposite direction."',
        questions: [
          { number: 5, text: 'What do we know for certain from the text? List two literal facts.', lines: 2 },
          { number: 6, text: 'Why does Sam count his coins three times? What does this suggest about his situation? Use evidence.', lines: 2 },
          { number: 7, text: 'The text says people carried bags "not looking down". What does this suggest about how Sam felt?', lines: 2 },
          { number: 8, text: 'Why does Sam walk "in the opposite direction"? Explain two possible inferences and decide which is more likely. Justify your choice.', lines: 3 },
          { number: 9, text: 'What mood does this passage create? Identify TWO words or phrases that create this mood and explain each one.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Use your inference skills in your own writing.',
        questions: [
          { number: 10, text: 'Write a short passage (5–8 sentences) about a character in a difficult situation. DO NOT state the character\'s emotions directly — show them through actions, details and the environment. Your reader should be able to INFER how the character feels.', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-11': {
    sessionId: 'y5-eng-11',
    title: 'Apostrophes: Possession and Contractions',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELA413',
    sections: [
      {
        heading: 'Section 1 – Apostrophe Rules',
        instructions: 'Answer these questions about how apostrophes work.',
        questions: [
          { number: 1, text: 'What are the TWO jobs of an apostrophe? Give one example of each.', lines: 2 },
          { number: 2, text: 'How do you form the possessive of a SINGULAR noun? Write the rule and give two examples.', lines: 2 },
          { number: 3, text: 'How do you form the possessive of a PLURAL noun that already ends in -s? Give two examples.', lines: 2 },
          { number: 4, text: 'Explain the difference between "its" and "it\'s". Write one sentence using each correctly.', lines: 2 },
          { number: 5, text: 'Write the contractions for: do not, could not, I am, they are, we have.', lines: 1 },
        ],
      },
      {
        heading: 'Section 2 – Fix the Sentences',
        instructions: 'Each sentence below contains one or more apostrophe errors. Rewrite the sentence correctly and explain the error.',
        questions: [
          { number: 6, text: 'Error: "The dog wagged it\'s tail at the childrens\' teacher."\nCorrection:', lines: 2 },
          { number: 7, text: 'Error: "Dont forget to pack the boy\'s lunches — all three of them have theres in the fridge."\nCorrection:', lines: 2 },
          { number: 8, text: 'Error: "The teams jerseys were to small for the players\'." \nCorrection:', lines: 2 },
          { number: 9, text: 'Error: "Its going to rain, so bring the Smiths\' umbrella\'s."\nCorrection:', lines: 2 },
          { number: 10, text: 'Error: "The womens restroom is next to the manager\'s office\'s."\nCorrection:', lines: 2 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Practise using apostrophes correctly in your own writing.',
        questions: [
          { number: 11, text: 'Write a short paragraph (5–6 sentences) about a school excursion. You MUST correctly include: two possessive apostrophes (one singular, one plural), two contractions, and one use of "its" (no apostrophe).', lines: 0, hasBox: true },
          { number: 12, text: 'Circle every apostrophe in your paragraph above and write beside each one whether it is POSSESSION (P) or CONTRACTION (C).', lines: 1 },
        ],
      },
    ],
  },

  'y5-eng-12': {
    sessionId: 'y5-eng-12',
    title: 'Conjunctions and Complex Sentences',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELA414',
    sections: [
      {
        heading: 'Section 1 – Types of Conjunctions',
        instructions: 'Answer these questions about coordinating and subordinating conjunctions.',
        questions: [
          { number: 1, text: 'What does FANBOYS stand for? Write out all seven coordinating conjunctions.', lines: 1 },
          { number: 2, text: 'What is the difference between a coordinating conjunction and a subordinating conjunction?', lines: 2 },
          { number: 3, text: 'Write a sentence using "but" (coordinating) that shows a contrast between two ideas.', lines: 1 },
          { number: 4, text: 'Write a sentence using "although" (subordinating) that shows a contrast between two ideas.', lines: 1 },
          { number: 5, text: 'Give three examples of subordinating conjunctions that show TIME relationships (e.g. when, while…). Write a sentence using one of them.', lines: 2 },
          { number: 6, text: 'Why is varying between short simple sentences and longer complex sentences important in writing?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Fix and Improve Sentences',
        instructions: 'Use conjunctions to combine, fix or improve the following.',
        questions: [
          { number: 7, text: 'Combine using a coordinating conjunction: "We wanted to go to the beach. It was too windy."', lines: 1 },
          { number: 8, text: 'Combine using a subordinating conjunction: "She finished her homework. She went outside to play."', lines: 1 },
          { number: 9, text: 'Identify the conjunction and state whether it is coordinating or subordinating:\n"The footy match was cancelled because the oval was flooded."\nConjunction: ___. Type: ___', lines: 1 },
          { number: 10, text: 'Rewrite this passage so it has better sentence variety — use at least TWO conjunctions and vary the sentence beginnings:\n"Tom was nervous. He walked in. He sat down. He picked up his pencil. He started writing."', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Show your conjunction skills in a piece of writing.',
        questions: [
          { number: 11, text: 'Write a paragraph (6–8 sentences) describing a challenge you have faced or a time you felt proud. You must use: at least two coordinating conjunctions (FANBOYS) and at least two subordinating conjunctions. Underline each conjunction and label it CO (coordinating) or SUB (subordinating).', lines: 0, hasBox: true },
        ],
      },
    ],
  },

  'y5-eng-13': {
    sessionId: 'y5-eng-13',
    title: 'Subject, Predicate and Tense Consistency',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELA415',
    sections: [
      {
        heading: 'Section 1 – Subject, Predicate and Agreement',
        instructions: 'Answer these questions about sentence structure and subject-verb agreement.',
        questions: [
          { number: 1, text: 'Underline the SUBJECT and circle the PREDICATE in each sentence:\na) The golden retriever barked at the postie.\nb) Three students from our class won the science competition.\nc) Running along the beach every morning keeps Maya fit.', lines: 2 },
          { number: 2, text: 'Choose the correct verb form. Circle your answer and explain why:\n"The group of students (was / were) waiting outside." — which is correct?', lines: 2 },
          { number: 3, text: 'Fix the subject-verb agreement error in each sentence:\na) "The news are very upsetting today."\nb) "Everyone have to bring their own lunch."\nc) "Neither of the boys were listening."', lines: 2 },
          { number: 4, text: 'What is tense consistency? Why is it important in storytelling and report writing?', lines: 2 },
          { number: 5, text: 'How do you decide whether to write a story in past tense or present tense? What effect does present tense have on the reader?', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Fix the Tense Errors',
        instructions: 'Each passage below contains tense consistency errors. Rewrite the passage correctly.',
        questions: [
          { number: 6, text: 'Fix the tense errors: "Mia runs to the park and stopped at the gate. She looks around and saw that nobody was there. She sits on the swing and started to cry."\nCorrected version:', lines: 3 },
          { number: 7, text: 'Fix the tense errors: "The explorer climbed the ridge and looks out across the valley. He can see a river far below. He takes out his notebook and wrote down the coordinates."\nCorrected version:', lines: 3 },
          { number: 8, text: 'Fix the subject-verb agreement errors:\na) "Each of the players have their own locker."\nb) "The team are playing well today." (hint: in Australian English, collective nouns can take a plural verb — is this error or style?)\nc) "Neither the teacher nor the students was aware of the fire drill."', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Demonstrate your control of tense and subject-verb agreement.',
        questions: [
          { number: 9, text: 'Write a paragraph (5–7 sentences) retelling an event from your school year (a sport, excursion, performance or experiment). Use PAST TENSE throughout and ensure every subject and verb agree. After writing, underline every verb to check consistency.', lines: 0, hasBox: true },
          { number: 10, text: 'Now rewrite your first two sentences in PRESENT TENSE. How does the effect on the reader change?', lines: 2 },
        ],
      },
    ],
  },

  'y5-eng-14': {
    sessionId: 'y5-eng-14',
    title: 'Paragraphs and Topic Sentences',
    subject: 'English',
    yearLevel: 5,
    victorianCode: 'VCELA416',
    sections: [
      {
        heading: 'Section 1 – Paragraph Structure',
        instructions: 'Answer the following questions about paragraph structure.',
        questions: [
          { number: 1, text: 'What are the THREE essential parts of a well-structured paragraph? Describe what each one does.', lines: 3 },
          { number: 2, text: 'What is a topic sentence? What two things should it always do?', lines: 2 },
          { number: 3, text: 'Read this topic sentence: "School canteens should only sell healthy food." Write TWO supporting detail sentences that develop this idea.', lines: 2 },
          { number: 4, text: 'Write a concluding sentence for the school canteen paragraph that links back to the topic sentence without simply repeating it.', lines: 1 },
          { number: 5, text: 'What is wrong with this paragraph? Identify the problem and explain how to fix it:\n"I enjoy playing basketball. My favourite food is pizza. We practised at school last Tuesday. Our team is called the Rockets."', lines: 2 },
        ],
      },
      {
        heading: 'Section 2 – Improve a Weak Paragraph',
        instructions: 'Read the weak paragraph below, then complete all tasks.\n\n"Animals are good. Some animals are pets. Pets help people. Dogs are nice. Cats are also nice. Animals can help sick people feel better."',
        questions: [
          { number: 6, text: 'Write a strong topic sentence for this paragraph. Your topic sentence should announce a clear idea that the whole paragraph will develop.', lines: 1 },
          { number: 7, text: 'Choose the BEST supporting detail from the paragraph and improve it. Add a specific example or piece of evidence to strengthen it.', lines: 2 },
          { number: 8, text: 'Write a concluding sentence that wraps up the paragraph\'s main idea and links back to the topic sentence.', lines: 1 },
          { number: 9, text: 'Rewrite the entire paragraph using your topic sentence, improved supporting details, and concluding sentence. Aim for 4–5 sentences.', lines: 3 },
        ],
      },
      {
        heading: 'Section 3 – Writing Task',
        instructions: 'Write two well-structured paragraphs on a topic of your choice.',
        questions: [
          { number: 10, text: 'Choose a topic (e.g. why your school should have more sport, why space exploration matters, why reading is important). Write TWO separate paragraphs — each with a clear topic sentence, at least two supporting details with evidence or examples, and a concluding sentence. Use a different idea in each paragraph.', lines: 0, hasBox: true },
          { number: 11, text: 'Self-check: Label the topic sentence (TS), supporting details (SD) and concluding sentence (CS) in each of your paragraphs above.', lines: 1 },
        ],
      },
    ],
  },
};
