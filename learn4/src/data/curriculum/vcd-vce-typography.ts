import type { Session } from '../types';

export const vcdVceTypography: Session[] = [
  // ─── SESSION: TYPOGRAPHY FUNDAMENTALS ────────────────────────────────────
  {
    id: 'vcd-vce-t01',
    subject: 'vcd',
    title: 'Typography: Anatomy, Classification & Hierarchy',
    victorianCode: 'VCAA-VCD-TYPE1',
    description: 'Master letterform anatomy, the four major typeface classifications, and typographic hierarchy — the core type knowledge tested in every VCE VCD examination.',
    yearLevel: 11,
    estimatedMinutes: 70,
    starsAvailable: 6,
    color: '#6d28d9',
    icon: '🔤',
    steps: [
      {
        id: 'vcd-vce-t01-s1',
        type: 'worked-example',
        title: 'Letterform Anatomy: The Language of Type',
        teacherNote: 'Students who know type anatomy can analyse typographic choices with precision — "the large x-height improves legibility at small sizes" is far more useful than "the font is easy to read."',
        imagePrompt: 'typography anatomy diagram showing baseline x-height cap height ascender descender serif bowl stem counter crossbar with labels, clean educational design poster',
        content: {
          heading: 'Every Part of a Letter Has a Name and a Purpose',
          body: [
            {
              label: 'Structural Measurements',
              text: 'Baseline: the invisible line all letters sit on. Cap Height: the height of uppercase letters. X-height: the height of lowercase letters like "x", "n", "o" (excluding ascenders/descenders) — high x-height = better legibility at small sizes. Ascender: the part of lowercase letters extending above the x-height (b, d, f, h, k, l, t). Descender: the part extending below the baseline (g, j, p, q, y). These measurements vary between typefaces and affect how fonts feel at different sizes.',
              highlight: 'blue',
            },
            {
              label: 'Stroke and Detail Parts',
              text: 'Stem: the main vertical stroke of a letter. Bowl: the curved enclosed area (in b, d, o, p). Counter: the enclosed or partially enclosed space within a letter (the hole in o, the space inside b). Serif: the decorative stroke at the end of letter arms — their presence or absence defines the primary classification of all typefaces. Arm: a horizontal or diagonal stroke extending from a stem. Crossbar: the horizontal stroke crossing the letter (A, H, e, t). Ear: the small projection from the top of letters like g and r.',
              highlight: 'green',
            },
            {
              label: 'Serif vs Sans-Serif: More Than Aesthetics',
              text: 'Serifs originated from Roman stone carving — the flat-bottomed finishing strokes made letters clearer on stone. In print, serifs create a visual baseline connecting letterforms, which aids horizontal eye tracking in long text — this is why books and newspapers use serif typefaces for body text. Sans-serif (without serifs) emerged prominently with the Bauhaus and modernist movement — clean, rational, industrial. At small sizes on low-resolution screens, sans-serif can outperform serif. At large sizes and in print, both work well.',
              highlight: 'orange',
            },
            {
              label: 'The Aperture and Openness',
              text: 'Aperture is the opening of partially enclosed counters (the opening of the c, e, a, s). Wide aperture: the letter has a large, open gap — better legibility at small sizes and lower contrast environments (signs, wayfinding). Narrow aperture: the opening is small — more refined, elegant, but can reduce legibility when small. Open-aperture humanist typefaces like Frutiger were specifically designed for signage and wayfinding in airports and hospitals where legibility at distance is critical.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'Why does a typeface with a large x-height tend to be more legible at small sizes?', a: 'The x-height determines how much visual space the lowercase letters (the majority of body text) occupy. A large x-height means lowercase letters are proportionally bigger relative to the overall cap height — making them more distinguishable from each other at small sizes and in low-contrast conditions.' },
            { q: 'What are serifs and why were they historically used in print body text?', a: 'Serifs are the small decorative strokes at the ends of letterforms. They originated in Roman stone carving. In print, they create a subtle horizontal baseline that connects letterforms, aiding the eye\'s horizontal tracking across a line of text — which is why they have traditionally been preferred for long-form print reading.' },
          ],
        },
      },
      {
        id: 'vcd-vce-t01-s2',
        type: 'quiz',
        title: 'Quiz: Font Anatomy',
        teacherNote: 'Typography anatomy is examined directly in the VCE exam — students must know all terms confidently.',
        questions: [
          { id: 'vcd-vce-t01-q1', text: 'The "x-height" of a typeface refers to:', image: null, options: ['The height of the capital letter X', 'The height of lowercase letters excluding ascenders and descenders', 'The width of the letter x', 'The point size of the font'], correct: 1, explanation: 'X-height is the height of the main body of lowercase letters (letters like x, n, o, a) — excluding ascenders (like the top of h) and descenders (like the tail of p). It is a key factor in legibility.' },
          { id: 'vcd-vce-t01-q2', text: 'The enclosed space inside the letter "o" is called:', image: null, options: ['The bowl', 'The counter', 'The aperture', 'The stem'], correct: 1, explanation: 'The counter is the enclosed or partially enclosed negative space within a letterform — the hole inside "o", the spaces inside "b" and "d". Counter size affects legibility significantly.' },
          { id: 'vcd-vce-t01-q3', text: 'An "ascender" in typography refers to:', image: null, options: ['The part of a letter above the cap height', 'The part of lowercase letters that extends above the x-height (as in b, d, h)', 'The decorative stroke at the letter end', 'The horizontal crossbar'], correct: 1, explanation: 'Ascenders are the strokes on lowercase letters that extend above the x-height — the top portions of b, d, f, h, k, l, and t. They distinguish certain lowercase letters and affect the visual rhythm of type.' },
          { id: 'vcd-vce-t01-q4', text: 'Why were serif typefaces historically preferred for long-form print body text?', image: null, options: ['They are more decorative', 'They are larger', 'The serifs create visual connectors between letters, aiding the eye in tracking horizontally across a line of text', 'They are more modern'], correct: 2, explanation: 'Serifs create subtle horizontal cues that help the eye track across lines of text. This benefit is most pronounced in print at comfortable reading sizes — for long texts like books and newspapers, serif typefaces reduce reading fatigue.' },
        ],
      },
      {
        id: 'vcd-vce-t01-s3',
        type: 'worked-example',
        title: 'Typeface Classification: Four Essential Categories',
        teacherNote: 'Students should be able to identify typeface classification from visual characteristics alone — this is frequently tested in the VCE exam where students see an unfamiliar typeface and must classify it.',
        imagePrompt: 'typeface classification chart showing serif humanist geometric slab serif examples side by side with identifying characteristics labeled, clean typography education poster',
        content: {
          heading: 'The Four Classifications VCE Expects You to Know',
          body: [
            {
              label: 'Serif Typefaces (Old Style, Transitional, Modern)',
              text: 'All have serifs, but they differ in: stroke contrast (the difference between thick and thin strokes), serif shape (bracketed vs hairline), and axis (the angle of thickening on curved strokes). Old Style (Garamond, Caslon): minimal stroke contrast, angled axis, bracketed serifs — classical and warm. Transitional (Baskerville, Times New Roman): medium stroke contrast, more vertical axis — balanced and neutral. Modern/Didone (Bodoni, Didot): extreme stroke contrast, perfectly vertical axis, hairline unbracketed serifs — elegant, high fashion.',
              highlight: 'blue',
            },
            {
              label: 'Humanist Sans-Serif',
              text: 'Sans-serif with hand-drawn, calligraphic qualities — letters show variation in stroke width reminiscent of a broad-nib pen, giving them warmth and personality. Examples: Gill Sans, Frutiger, Myriad, Segoe UI, Corbel. The humanist quality makes these feel approachable and personal compared to geometric alternatives. Used extensively in wayfinding, healthcare, education, and social impact communication — anywhere "warm and approachable" is needed without sacrificing readability.',
              highlight: 'green',
            },
            {
              label: 'Geometric Sans-Serif',
              text: 'Constructed from pure geometric forms — the "o" is a nearly perfect circle, strokes are monolinear (same weight throughout), letters have a mechanical, rational quality. Examples: Futura, Avenir, Gill Sans (controversial — some classify as humanist), Gotham, Montserrat. Communicate modernity, rationality, precision and technology. Dominant in contemporary tech brands (Airbnb uses Cereal, a geometric sans; many tech companies use custom geometric sans-serifs). Bauhaus principle: form reduced to geometric essence.',
              highlight: 'orange',
            },
            {
              label: 'Slab Serif',
              text: 'Serifs are thick, blocky and rectangular with minimal or no bracketing (smooth transition from stem to serif). Originally designed in the 19th century for advertising — heavy, attention-commanding, readable at distance. Examples: Rockwell, Clarendon, Courier, Memphis, Archer. Variations: monolinear slab (uniform stroke width, like Courier) and seriffed slab with stroke contrast (like Clarendon). Communicate strength, confidence, tradition and reliability. Used in editorial design, product branding for hardware/tools, premium food brands wanting to feel artisanal.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'How would you visually identify a Geometric sans-serif typeface?', a: 'Look for: near-perfect circular "o", monolinear stroke weight (consistent thickness throughout), rational, mechanical construction based on geometric forms, no serifs. Compare to humanist sans-serif which shows variation in stroke weight and hand-drawn qualities.' },
            { q: 'Why do healthcare and education brands often choose humanist sans-serif typefaces?', a: 'Humanist sans-serifs carry warmth and approachability through their hand-drawn, calligraphic qualities — the slight variation in stroke width gives them a human quality. In healthcare and education, conveying warmth, trust and accessibility is critical, and humanist typefaces support these values without sacrificing legibility.' },
          ],
        },
      },
      {
        id: 'vcd-vce-t01-s4',
        type: 'quiz',
        title: 'Quiz: Typeface Classification',
        teacherNote: 'Use printed specimens for visual identification practice alongside these conceptual questions.',
        questions: [
          { id: 'vcd-vce-t01-q5', text: 'A typeface has hairline serifs with extreme contrast between thick and thin strokes, and a perfectly vertical stress axis. This is most likely a:', image: null, options: ['Humanist sans-serif', 'Old Style serif', 'Modern/Didone serif (like Bodoni)', 'Slab serif'], correct: 2, explanation: 'The combination of hairline (unbracketed, very thin) serifs, extreme thick/thin stroke contrast, and perfectly vertical stress axis are the definitive characteristics of Modern (Didone) typefaces like Bodoni and Didot — high fashion, elegant, and dramatic.' },
          { id: 'vcd-vce-t01-q6', text: 'A new sustainability brand wants a typeface that feels human, warm, approachable and readable. Which classification should they choose?', image: null, options: ['Geometric sans-serif', 'Modern serif', 'Humanist sans-serif', 'Slab serif'], correct: 2, explanation: 'Humanist sans-serifs carry warmth through their calligraphic stroke variation while remaining clean and readable. Their hand-drawn quality communicates the human, authentic values that sustainability brands seek.' },
          { id: 'vcd-vce-t01-q7', text: 'Futura and Gotham share which typeface classification and what is the key identifying visual characteristic?', image: null, options: ['Slab serif — thick rectangular serifs', 'Humanist sans — varied stroke width', 'Geometric sans-serif — near-perfect circular "o" and monolinear strokes', 'Old Style serif — bracketed serifs'], correct: 2, explanation: 'Both are geometric sans-serifs — constructed from pure geometric forms. The most identifiable feature is the near-perfectly circular "o" and consistent (monolinear) stroke weight throughout the letterforms.' },
          { id: 'vcd-vce-t01-q8', text: 'Slab serif typefaces were originally designed in the 19th century primarily for:', image: null, options: ['Luxury fashion magazines', 'Book body text', 'Advertising and posters — to be readable at distance and command attention', 'Scientific journals'], correct: 2, explanation: 'Slab serifs emerged for advertising in the 19th century — their heavy, blocky serifs and strong visual weight made them commanding at distance on posters and signage, before electric lighting made nighttime advertising possible.' },
        ],
      },
      {
        id: 'vcd-vce-t01-s5',
        type: 'worked-example',
        title: 'Typographic Hierarchy and Spatial Relationships',
        teacherNote: 'Hierarchy is the most important typographic concept for VCE — without it, all text appears equally important. Students should practice building hierarchies before analysing them.',
        imagePrompt: 'typographic hierarchy example showing heading subheading body caption with clear size weight and spacing contrast, clean editorial layout educational design poster',
        content: {
          heading: 'Hierarchy: Guiding the Reader Through the Text',
          body: [
            {
              label: 'Building a Typographic Hierarchy',
              text: 'Typographic hierarchy is the visual organisation of type by importance — using size, weight, colour, spacing and position to guide the reader from most to least important. A four-level hierarchy: (1) Display/Headline: largest, highest contrast, establishes the primary message. (2) Subheading: smaller than headline, differentiates sections. (3) Body text: comfortable reading size (typically 10-12pt in print, 16-18px screen), regular weight, sufficient leading. (4) Caption/Supporting text: smallest, secondary colour or weight, provides context.',
              highlight: 'blue',
            },
            {
              label: 'Kerning, Tracking and Leading',
              text: 'Kerning: the adjustment of space between specific letter pairs — A and V naturally leave a gap that must be reduced, L and T similarly. Poor kerning is immediately noticeable (and a common error in student work). Tracking: uniform spacing applied to a block of text — increasing tracking in all-caps headlines improves readability; too much tracking in body text creates gaps that break reading rhythm. Leading (line-height): vertical space between text baselines — too tight creates a dense, airless feel; too open breaks the sense of the text as a unit. Standard body text leading is approximately 120-145% of the font size.',
              highlight: 'green',
            },
            {
              label: 'Font Pairing for Hierarchy',
              text: 'Effective type pairing creates contrast between the heading and body typefaces. Classic strategy: pair a display/decorative typeface for headlines with a highly legible text typeface for body (e.g. a bold geometric sans headline + an Old Style serif body). Avoid pairing two similar typefaces — the similarity creates tension without contrast (use a single typeface in multiple weights instead). A simpler strategy: use one typeface family (which offers multiple weights and styles) and build hierarchy through size and weight contrast within the family.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'What is the difference between kerning and tracking in typography?', a: 'Kerning adjusts space between specific pairs of letters (e.g. "AV" "LT") to correct optical imbalances in individual letter pairs. Tracking applies uniform spacing to an entire block of text — it adjusts the overall density of text rather than fixing specific pairs.' },
            { q: 'Why is leading (line-height) important for body text legibility?', a: 'Leading controls the vertical breathing room between lines. Too tight: lines appear to merge, the eye struggles to find the next line, reading becomes fatiguing. Too loose: the text feels disconnected, reading loses momentum. The optimal range (typically 120-145% of point size) allows the eye to easily return to the start of each new line while feeling like coherent, connected text.' },
          ],
        },
      },
      {
        id: 'vcd-vce-t01-s6',
        type: 'free-response',
        title: 'Typography Analysis: A Real-World Example',
        teacherNote: 'Students should choose a publication or brand they actually engage with — authentic examples produce more engaged analysis.',
        prompt: 'Choose a magazine cover, book cover, or brand identity that uses typography as a primary design tool. Perform a complete VCE-level typographic analysis.',
        fields: [
          {
            id: 'identify',
            label: 'Identify and classify the typefaces used (name them if you can, otherwise describe and classify)',
            placeholder: 'e.g. The headline uses a Didone serif (Bodoni-style) — identifiable by its extreme thick/thin stroke contrast and hairline serifs. The body text uses a humanist sans-serif...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'hierarchy',
            label: 'Describe the typographic hierarchy — how many levels? How is each distinguished?',
            placeholder: 'e.g. Three distinct levels: the masthead (all-caps geometric sans, approximately 60pt, black) → coverlines (mixed case, 14pt, two weights — bold and regular) → barcode/subscription info (8pt, grey, almost invisible)...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'audience',
            label: 'Analyse how the typographic choices communicate to the specific target audience and brand positioning',
            placeholder: 'e.g. The Didone serif headline communicates the fashion magazine\'s luxury positioning — the extreme contrast is associated with high fashion and refinement. The target audience of affluent 25-45 year old fashion consumers will read this as premium...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
    ],
  },

  // ─── SESSION: ADVANCED TYPOGRAPHY FOR VCE ────────────────────────────────
  {
    id: 'vcd-vce-t02',
    subject: 'vcd',
    title: 'Advanced Typography: Systems, Grids & Exam Application',
    victorianCode: 'VCAA-VCD-TYPE2',
    description: 'Master typographic grid systems, font pairing strategy, and the precise VCE vocabulary for writing top-scoring typography analysis in the exam.',
    yearLevel: 11,
    estimatedMinutes: 65,
    starsAvailable: 6,
    color: '#6d28d9',
    icon: '📰',
    steps: [
      {
        id: 'vcd-vce-t02-s1',
        type: 'worked-example',
        title: 'Typography in Grid Systems',
        teacherNote: 'Grid systems are the invisible infrastructure of all professional publication and brand design. Students often understand the concept but struggle to apply it — practise with real newspaper and magazine layouts.',
        imagePrompt: 'editorial grid system layout showing columns gutters margins baseline grid with text flowing through multiple columns, professional magazine double page spread annotated',
        content: {
          heading: 'Grids Make Typography Systematic and Coherent',
          body: [
            {
              label: 'Why Grids Exist',
              text: 'A grid is a modular framework of columns, rows and margins that provides consistent structure across multiple pages or applications. Before grids, each page was designed individually — inconsistent and inefficient. Grid systems (popularised by Swiss International Style designers like Josef Müller-Brockmann in the 1950s-60s) allow one system to govern many pages: every designer working on the same publication knows where elements go, creating visual unity across the entire work.',
              highlight: 'blue',
            },
            {
              label: 'Grid Anatomy',
              text: 'Margins: the space between the page edge and the live area (where content lives). Columns: vertical divisions of the live area. Gutters: the space between columns. Rows (modules): horizontal divisions creating a grid of cells. The baseline grid: a grid of horizontal lines spaced at the leading distance of the body text — all text, on all pages, aligns to this grid. This creates the mechanical, rhythmic consistency of professional publication design.',
              highlight: 'green',
            },
            {
              label: 'Typographic Scale Systems',
              text: 'Professional typographers use mathematical scale systems to determine font sizes. The classical scale (6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21, 24, 36, 48, 60, 72pt) was built into metal type — fonts were cast in these fixed sizes. The modular scale uses a ratio (like the golden ratio 1:1.618 or a 4th = 1:1.333) to generate harmonious size relationships. Contemporary digital tools allow any size, but designers who understand scale ratios create more harmonious typographic hierarchies than those who choose sizes arbitrarily.',
              highlight: 'orange',
            },
            {
              label: 'Typography in Brand Systems',
              text: 'Brand typography systems specify: the primary typeface (for headlines and display), the secondary typeface (for body text), usage rules (which typeface appears when, in which weight), size hierarchies, spacing rules, and fallback fonts for digital environments where the brand font may not be available. Google, Nike, Apple, and all major brands have comprehensive typography standards — this is what makes their communications feel consistently "them" across all touchpoints.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What problem did the adoption of grid systems solve in publication design?', a: 'Without grids, each page was designed independently — inconsistent, inefficient, and visually incoherent when pages were viewed together. Grid systems provide a shared framework that creates visual unity across multiple pages while allowing content variation within that structure.' },
            { q: 'What is a baseline grid and why do professional publications use it?', a: 'A baseline grid is a horizontal grid spaced at the leading (line-height) of the body text. All text on all pages aligns to this grid, so the baselines on one column align with baselines in the adjacent column and on pages front and back — creating mechanical consistency and visual harmony throughout the publication.' },
          ],
        },
      },
      {
        id: 'vcd-vce-t02-s2',
        type: 'quiz',
        title: 'Quiz: Typography Systems',
        teacherNote: 'Connect each concept to a real design example students can visualise.',
        questions: [
          { id: 'vcd-vce-t02-q1', text: 'The "gutter" in a typographic grid system refers to:', image: null, options: ['The bottom margin of a page', 'The space between columns', 'The baseline grid interval', 'The cap height of the headline typeface'], correct: 1, explanation: 'Gutters are the spaces between columns in a grid system. They create visual separation between content in adjacent columns, preventing text and images from merging visually.' },
          { id: 'vcd-vce-t02-q2', text: 'A designer increases the tracking on an all-caps headline. The likely effect is:', image: null, options: ['Letters appear to merge together', 'The headline becomes harder to read', 'Improved legibility and a more refined, elegant appearance — all-caps text at normal tracking can feel compressed', 'The headline becomes smaller'], correct: 2, explanation: 'All-caps text is less legible than mixed-case at normal tracking because capital letters are all similar heights — there is no ascender/descender variation to aid recognition. Increasing tracking in all-caps creates space for each letterform to breathe, improving readability and creating a more refined typographic appearance.' },
          { id: 'vcd-vce-t02-q3', text: 'A brand\'s primary typeface is a geometric sans-serif (Futura). A complementary secondary typeface for body text would most likely be:', image: null, options: ['Another geometric sans-serif — to maintain consistency', 'An Old Style serif — contrasting classification creates useful tension while the elegance of both complements well', 'A heavy slab serif with maximum weight', 'A handwritten script'], correct: 1, explanation: 'Effective type pairing creates contrast through different classifications. Pairing a modern geometric sans headline with a warm Old Style serif body creates meaningful contrast — the rational headline vs the warm, readable body — while both communicate quality and intentional design.' },
          { id: 'vcd-vce-t02-q4', text: 'Leading is described as "too tight" in a block of body text. The practical effect on the reader is:', image: null, options: ['The text feels modern and dynamic', 'Lines appear to merge, the eye struggles to track from end of one line to beginning of the next, reading becomes fatiguing', 'The text is more readable', 'The text takes up more space on the page'], correct: 1, explanation: 'Tight leading reduces vertical separation between lines. The eye has difficulty locating the start of the next line and may re-read the same line. This is exhausting for sustained reading — standard body text leading is 120-145% of the font size.' },
        ],
      },
      {
        id: 'vcd-vce-t02-s3',
        type: 'worked-example',
        title: 'Writing High-Scoring Typography Analysis',
        teacherNote: 'Typography is examined in every VCE VCD exam. Students who can write precise, vocabulary-rich typography analysis consistently score highly.',
        imagePrompt: 'VCE exam practice typography analysis response showing structured paragraph with annotated type terminology, educational document clean layout professional',
        content: {
          heading: 'Vocabulary + Evidence + Effect + Audience = Full Marks',
          body: [
            {
              label: 'The VCE Typography Vocabulary Bank',
              text: 'Examiners reward these terms (only use them if you understand them): typographic hierarchy, x-height, cap height, ascender, descender, counter, aperture, stroke contrast, humanist/geometric/slab/transitional/Didone, serif/sans-serif, kerning, tracking, leading, typeweight (thin/light/regular/medium/semibold/bold/black), type size, all-caps, mixed case, text alignment (justified/ragged right/centred), type colour, typeface pairing, visual pathway, typographic texture.',
              highlight: 'blue',
            },
            {
              label: 'Weak vs Strong Typography Analysis',
              text: 'Weak: "The poster uses a bold sans-serif font for the title which makes it stand out." Strong: "The headline employs a compressed, high-weight geometric sans-serif (likely Futura ExtraBold Condensed) capitalised throughout, set at approximately four times the cap height of the body text. The monolinear strokes and near-perfect circular counters communicate the automotive brand\'s values of technological precision. The all-caps setting eliminates ascender-descender variation, creating a uniform, machine-like texture that reinforces this positioning. Its high tonal contrast against the white ground ensures it anchors the visual hierarchy as the dominant element."',
              highlight: 'green',
            },
            {
              label: 'Connecting Type Choices to Audience',
              text: 'Type analysis that doesn\'t connect to audience cannot earn full marks. After analysing the formal qualities of a typeface, always link: "The Didone serif used in this perfume advertisement communicates luxury through its extreme stroke contrast and mathematical elegance. This directly speaks to the aspirational target audience of affluent women aged 30–55 who associate these classical typographic qualities with the heritage luxury brands they emulate." The chain must be: specific typeface characteristic → visual effect → audience interpretation → brand/communication purpose.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'What chain of reasoning makes a typography analysis response earn full VCE marks?', a: 'Specific typeface characteristic (named and described) → visual effect it creates → how the target audience interprets or responds to it → how this serves the design\'s purpose. Every link in the chain must be present — skipping straight from "characteristic" to "purpose" loses the critical middle steps.' },
            { q: 'Why is "the font makes it stand out" insufficient as a VCE typography analysis response?', a: 'It describes the effect (stands out) without explaining what specific typographic quality creates that effect, or why the audience responds to it. VCE requires students to name the specific choice (type classification, weight, size, spacing), explain the visual mechanism, and connect it to purpose and audience.' },
          ],
        },
      },
      {
        id: 'vcd-vce-t02-s4',
        type: 'quiz',
        title: 'Quiz: Exam-Level Typography Analysis',
        teacherNote: 'Have students rank these responses from weakest to strongest and justify their ranking before revealing the correct answer.',
        questions: [
          { id: 'vcd-vce-t02-q5', text: 'A luxury watch advertisement uses a condensed Didone serif at large scale with wide tracking. Which analysis response would score highest?', image: null, options: ['"The fancy font suits the luxury brand."', '"The large text is bold and catches the eye."', '"The condensed Didone serif\'s extreme thick/thin stroke contrast creates a sense of refined tension and mathematical elegance — a typographic quality historically associated with Parisian fashion houses. The wide tracking in the all-caps setting gives each letterform presence and creates an aura of exclusivity, aligning precisely with the aspirational positioning sought by the target audience of high-net-worth individuals aged 40-65 who read these qualities as signifiers of genuine luxury heritage."', '"Good font choice for a watch brand."'], correct: 2, explanation: 'This response: names the specific classification (condensed Didone serif), describes the characteristic (extreme thick/thin contrast), explains the effect (refined tension, mathematical elegance), provides cultural context (Parisian fashion houses), analyses the typographic technique (wide tracking in all-caps), and connects it to the specific audience (high-net-worth individuals aged 40-65) and their reading of these signals.' },
          { id: 'vcd-vce-t02-q6', text: 'A children\'s book cover uses a rounded, bouncy sans-serif with large x-height and wide aperture. In a VCE analysis, what should you connect this to?', image: null, options: ['The history of sans-serif typefaces', 'The target audience of young children and their parents — the rounded forms reference child-drawn letterforms creating warmth and safety, the large x-height ensures legibility for early readers, and the wide aperture maintains clarity even at the smaller sizes used for the author name', 'The cost of font licensing', 'General rules about sans-serif typefaces'], correct: 1, explanation: 'Every typographic choice must be connected to purpose and audience. The child audience drives all these choices: rounded forms for emotional warmth, large x-height for their developmental reading needs, open aperture for clarity. The analysis earns marks by explaining each quality\'s specific function for this particular audience.' },
        ],
      },
      {
        id: 'vcd-vce-t02-s5',
        type: 'free-response',
        title: 'Timed Typography Exam Practice',
        teacherNote: 'Set a 15-minute timer. After completion, have students identify their VCD vocabulary terms and the PEEL structure in their responses.',
        prompt: 'Exam practice question (allow 15 minutes):\n\nA global environmental non-profit has redesigned its brand identity. The new wordmark uses a humanist sans-serif typeface set in title case with generous tracking. The sub-brand tag line uses a lightweight geometric sans-serif in upper-case. The organisation\'s audience is educated urban professionals aged 28–50 across Asia-Pacific and Europe.\n\nAnalyse how the typographic choices in this brand identity communicate to the target audience. (6 marks)',
        fields: [
          {
            id: 'paragraph1',
            label: 'Paragraph 1: Wordmark typeface analysis (PEEL structure)',
            placeholder: 'Point: The wordmark employs a humanist sans-serif... Evidence: The title case setting with generous tracking... Effect: The humanist quality creates... Link: For the educated urban professional audience...',
            multiline: true,
            minRows: 6,
          },
          {
            id: 'paragraph2',
            label: 'Paragraph 2: Tagline typeface analysis (PEEL structure)',
            placeholder: 'Point: The tagline contrast employs... Evidence: The lightweight geometric sans in all-caps... Effect: The extreme thinness of the strokes... Link: This secondary typographic voice communicates...',
            multiline: true,
            minRows: 6,
          },
        ],
      },
      {
        id: 'vcd-vce-t02-s6',
        type: 'homework',
        title: 'Homework: Typography Deep Dive',
        teacherNote: 'Regular typography analysis builds the vocabulary and pattern recognition essential for exam performance.',
        dueNext: true,
        tasks: [
          { id: 'hw1', label: 'Find 4 examples of different typeface classifications in use (one serif, one humanist sans, one geometric sans, one slab serif) and photograph them', hint: 'Look on packaging, signage, advertisements, book covers — annotate each with: classification, identifying characteristics, what the choice communicates, why it suits this specific brand/purpose' },
          { id: 'hw2', label: 'Write a kerning exercise: print out the word "VAULT" in a large display font and manually mark where kerning adjustments are needed and why', hint: 'Pay particular attention to the V-A pair and A-U pair — these are classic kerning problem areas where natural letter spacing creates awkward gaps' },
          { id: 'hw3', label: 'Audit the typography in your current folio project: does it have a clear hierarchy? Are the type choices justified in your annotations?', hint: 'Write an annotation for each typeface decision in your folio — what is the classification, why was it chosen, how does it suit the brief?' },
        ],
      },
    ],
  },
];
