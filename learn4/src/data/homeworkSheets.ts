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
};
