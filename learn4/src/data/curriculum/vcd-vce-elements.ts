import type { Session } from '../types';

export const vcdVceElements: Session[] = [
  // ─── SESSION: DESIGN ELEMENTS — LINE, SHAPE, FORM, POINT, TONE ──────────
  {
    id: 'vcd-vce-e01',
    subject: 'vcd',
    title: 'Design Elements: Colour, Shape, Line, Tone, Texture, Form, Point & Type',
    victorianCode: 'VCAA-VCD-ELEM1',
    description: 'Master all eight VCAA 2024 design elements — Colour, Shape, Line, Tone, Texture, Form, Point and Type — with VCE-level analysis vocabulary and exam application.',
    yearLevel: 11,
    estimatedMinutes: 70,
    starsAvailable: 6,
    color: '#7c3aed',
    icon: '📐',
    steps: [
      {
        id: 'vcd-vce-e01-s1',
        type: 'worked-example',
        title: 'The Eight VCAA 2024 Design Elements',
        teacherNote: 'The VCAA 2024 study design identifies exactly EIGHT design elements: Colour, Shape, Line, Tone, Texture, Form, Point and Type. "Space" is NOT a listed element in 2024. Point and Type are new additions students must know.',
        imagePrompt: 'design elements poster showing eight elements colour shape line tone texture form point type with examples, VCAA 2024 visual communication design educational poster',
        content: {
          heading: 'Eight Elements — the Building Blocks of All Design',
          body: [
            {
              label: 'Colour, Shape and Line',
              text: 'Colour: two models — Subtractive (CMYK, used for print) and Additive (RGB, used for screens). Colour has hue, saturation, primary/secondary/warm/cool properties; used for identity, decoration, depth and hierarchy. Colour has cultural connections with emotions. Shape: a two-dimensional enclosure — organic/biomorphic (found in nature), stylised (simplified), or geometric/rectilinear/sharp/hard-edged. Used to signify, denote or organise. Line: a continuous mark used to emphasise, divide components, create a figure, tone, texture or organise space. Can be geometric or organic, ruled or freehand, thick or thin, straight/curved/solid/dotted/dashed/flowing/visible/implied. Used in conventions for technical drawing.',
              highlight: 'blue',
            },
            {
              label: 'Tone, Texture and Form',
              text: 'Tone: a variation of the intensity of colour. Used to create and emphasise form. Monochromatic. Light and dark, value, percentage, tint or shade. Qualities: dramatic, chiaroscuro, soft, gradual, subtle. Texture: the surface of an object or image. Actual texture can be felt; implied texture looks like texture. Used for function or aesthetics. Deep, shallow, regular, random, organic or geometric, rough or smooth, gloss, matte, shiny, satin. Form: a three-dimensional entity — cube, sphere, rectangular prism, tetrahedron, pyramid. Solid, hollow, slender, cylindrical, rectangular, conical, biomorphic, geometric. Made by shapes, lines and/or colours.',
              highlight: 'green',
            },
            {
              label: 'Point (NEW in 2024)',
              text: 'Point: a mark. Can be a dot, square or circular. Used to create tone, texture, form and contrast in pictures. Point is used to create emphasis or a focal point using colour, scale and contrast. Point is one of the eight VCAA 2024 design elements — students often overlook it. In practice, a single point (dot) can anchor a composition, create a focal point, or when repeated, build tone (as in halftone printing or stipple illustration).',
              highlight: 'orange',
            },
            {
              label: 'Type as a Design Element (NEW in 2024)',
              text: 'Type is writing in VCD. It communicates ideas, information and emotion through its literal meanings and its aesthetics. A typeface is one name/style of type. Typefaces are made in different groups: Serif and Sans serif. Decorative. Serif-type forms communicate old, established authority; sans serif-type forms communicate ideas with a newer feeling. A type-family has different widths and weights: ultra-light, light, regular, medium, bold, black, condensed, extended and italic. Type anatomy, leading, tracking and kerning are all key VCE knowledge.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'Name all eight design elements in the VCAA 2024 VCD study design.', a: 'Colour, Shape, Line, Tone, Texture, Form, Point and Type. Note: "Space" is NOT one of the eight — it has been removed in the 2024 study design. Point and Type are both design elements.' },
            { q: 'What is the difference between actual texture and implied texture in the VCAA 2024 study design?', a: 'Actual texture can be physically felt with our hands — it is the real surface quality of a material. Implied texture looks like texture on a flat surface but cannot be felt — it is a visual representation of a surface quality, such as a photograph of timber grain printed on paper.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e01-s2',
        type: 'quiz',
        title: 'Quiz: The Eight Design Elements',
        teacherNote: 'Exam questions name a specific element and ask students to identify its visual qualities or communication effect. Practise naming all eight from memory.',
        questions: [
          { id: 'vcd-vce-e01-q1', text: 'Which of the following is NOT one of the eight VCAA 2024 design elements?', image: null, options: ['Point', 'Space', 'Type', 'Tone'], correct: 1, explanation: '"Space" is not a VCAA 2024 design element — it was removed in the 2024 study design. The eight elements are: Colour, Shape, Line, Tone, Texture, Form, Point and Type.' },
          { id: 'vcd-vce-e01-q2', text: 'In the VCAA 2024 study design, "Type" is classified as:', image: null, options: ['A design principle', 'A design element — one of the eight fundamental building blocks of visual communication', 'A gestalt principle', 'A drawing convention'], correct: 1, explanation: 'Type is one of the eight design elements in the VCAA 2024 VCD study design — it is a fundamental component of design, not merely a tool. Type communicates ideas, information and emotion through both its literal meaning and its aesthetic qualities.' },
          { id: 'vcd-vce-e01-q3', text: 'The FedEx logo contains a hidden arrow formed by the gap between letters. The design element most directly responsible for this effect is:', image: null, options: ['Colour', 'Tone', 'Shape — the implied arrow shape created by negative space between the E and x letterforms', 'Point'], correct: 2, explanation: 'Shape includes implied shapes — the eye perceives the arrow as a shape even though it is formed by the surrounding letterforms rather than drawn directly. This is shape as a design element working through figure-ground.' },
          { id: 'vcd-vce-e01-q4', text: 'A stipple illustration uses thousands of small dots to create tonal variation. Which design element is being used as the primary building block?', image: null, options: ['Line', 'Point — individual marks (dots) used to build tone, texture and form', 'Form', 'Texture'], correct: 1, explanation: 'Point is the design element used here — individual dot marks that, when clustered densely, create dark tones, and when spaced apart, create light tones. This is the classical stipple technique and a direct application of Point as a design element.' },
        ],
      },
      {
        id: 'vcd-vce-e01-s3',
        type: 'worked-example',
        title: 'Form, Space and Tone',
        teacherNote: 'The relationship between form, space and tone is critical in presentation drawing — ensure students understand how tone creates the illusion of form.',
        imagePrompt: 'design elements form space tone study showing 3D forms with tonal rendering positive negative space relationships, clean educational design poster with annotations',
        content: {
          heading: 'Three-Dimensional Thinking on a Two-Dimensional Surface',
          body: [
            {
              label: 'Form vs Shape',
              text: 'Shape is two-dimensional (a circle, a square). Form is three-dimensional (a sphere, a cube) — or the illusion of three dimensions on a flat surface. Form is created through tone: graduating tones from light to dark across a surface create the perception of curvature or planes receding in space. In presentation drawing, form without tone appears flat; tone is what gives a drawing depth and solidity.',
              highlight: 'blue',
            },
            {
              label: 'Positive and Negative Space',
              text: 'Positive space is occupied by the subject (the object, the figure, the text). Negative space is the unoccupied area around and between subjects. In skilled design, negative space is designed — it is not leftover. The Volkswagen logo uses negative space to create the V and W letters. The Australian Broadcasting Corporation logo creates a pattern where positive and negative space are visually equal, creating ambiguity. Negative space can communicate as powerfully as positive form.',
              highlight: 'green',
            },
            {
              label: 'Tone: Creating Depth and Drama',
              text: 'Tone is the relative lightness or darkness of a surface. In design and presentation drawing, tone serves three functions: (1) Modelling — graduated tone on curved surfaces creates the illusion of 3D form. (2) Contrast — tonal contrast between elements creates visual hierarchy and emphasis. (3) Atmosphere — high contrast (stark blacks and whites) creates drama and tension; low contrast (subtle tonal range) creates softness and serenity.',
              highlight: 'orange',
            },
            {
              label: 'Tonal Contrast and Visual Hierarchy',
              text: 'The highest tonal contrast in a composition draws the eye first. White text on black background has maximum tonal contrast — the eye goes there immediately. This is why the most critical message in a poster design typically has the highest tonal contrast against its background. Reducing tonal contrast deprioritises an element in the visual hierarchy. Designers use tone consciously to build a visual pathway through the composition.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What is the fundamental difference between shape and form in design?', a: 'Shape is two-dimensional; form is three-dimensional (or the illusion of three dimensions on a 2D surface). Form is created through tonal modelling — graduating tones that suggest volume, curvature and depth.' },
            { q: 'Why do skilled designers treat negative space as designed space rather than empty space?', a: 'Negative space can communicate meaning (as in the FedEx hidden arrow or ABC logo), create visual balance, improve legibility, and give compositions breathing room. Undesigned negative space creates visual clutter and disorganisation.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e01-s4',
        type: 'quiz',
        title: 'Quiz: Form, Space and Tone',
        teacherNote: 'Link these concepts explicitly to presentation drawing — students need to apply them, not just name them.',
        questions: [
          { id: 'vcd-vce-e01-q5', text: 'In a presentation drawing of a sphere, what technique creates the illusion of three-dimensional form?', image: null, options: ['Using an outline only', 'Graduating tone from light to dark across the surface', 'Adding a cast shadow only', 'Using multiple colours'], correct: 1, explanation: 'Graduated tone (tonal modelling) — moving from the lightest point (facing the light source) to the darkest point (turning away from light) — creates the optical illusion of a curved, three-dimensional surface.' },
          { id: 'vcd-vce-e01-q6', text: 'In a poster composition, the element with the highest tonal contrast against its background will:', image: null, options: ['Recede into the background', 'Be perceived as the least important element', 'Attract the viewer\'s eye first and register as the most important element', 'Create a calming effect'], correct: 2, explanation: 'The human eye is drawn to the point of highest contrast first — this is the basis of visual hierarchy through tone. Designers exploit this to control the viewer\'s reading order.' },
          { id: 'vcd-vce-e01-q7', text: 'The term "negative space" in design refers to:', image: null, options: ['A design that communicates negative emotions', 'The areas of a composition not occupied by the main subject — the space around and between elements', 'Black or dark areas in a design', 'Empty unused pages in a folio'], correct: 1, explanation: 'Negative space is the unoccupied area of a composition. In high-quality design, this space is actively designed rather than incidental — it shapes how the positive elements are perceived.' },
        ],
      },
      {
        id: 'vcd-vce-e01-s5',
        type: 'free-response',
        title: 'Element Analysis: Apply Your Knowledge',
        teacherNote: 'Students should select a design they genuinely find interesting — authentic engagement produces better analysis.',
        prompt: 'Select a well-known logo or poster (e.g. Nike, Apple, Greenpeace, Melbourne 2030 Olympic bid, any brand you use daily). Analyse how it uses at least THREE of the five design elements (line, shape, form, space, tone).',
        fields: [
          {
            id: 'design',
            label: 'Name the design and describe it briefly',
            placeholder: 'e.g. The Apple logo — a monochrome apple silhouette with a single leaf and a bite taken from the right side...',
            multiline: true,
            minRows: 2,
          },
          {
            id: 'element1',
            label: 'Element 1 analysis (name the element, evidence, effect, link to purpose/audience)',
            placeholder: 'e.g. Shape: The apple silhouette is an organic shape — biomorphic and immediately recognisable. The bite taken from it creates an implied line that draws the eye...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'element2',
            label: 'Element 2 analysis',
            placeholder: '',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'element3',
            label: 'Element 3 analysis',
            placeholder: '',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-e01-s6',
        type: 'homework',
        title: 'Homework: Elements Hunt',
        teacherNote: 'This task builds visual literacy — the ability to see design elements consciously in everyday environments.',
        dueNext: true,
        tasks: [
          { id: 'hw1', label: 'Photograph 5 designs in your environment that demonstrate deliberate use of negative space', hint: 'Look at logos, signage, packaging — photograph them and annotate each: what is the negative space, what does it communicate or contribute?' },
          { id: 'hw2', label: 'Analyse how ONE design you use daily uses tone to create visual hierarchy', hint: 'Look at an app icon, food packaging, or magazine cover — trace the tonal values from lightest to darkest and identify what the designer emphasised through contrast.' },
          { id: 'hw3', label: 'Write a 200-word analysis of line use in two contrasting brand logos (e.g. a bank vs a children\'s charity)', hint: 'Compare line direction, weight and quality — why are they so different? What does each communicate about the brand?' },
        ],
      },
    ],
  },

  // ─── SESSION: DESIGN ELEMENTS — TEXTURE AND COLOUR ──────────────────────
  {
    id: 'vcd-vce-e02',
    subject: 'vcd',
    title: 'Design Elements: Texture & Colour Theory',
    victorianCode: 'VCAA-VCD-ELEM2',
    description: 'Understand how texture communicates tactile and cultural meaning, and master colour theory — hue, saturation, value, temperature, harmonies and psychology.',
    yearLevel: 11,
    estimatedMinutes: 70,
    starsAvailable: 6,
    color: '#7c3aed',
    icon: '🎨',
    steps: [
      {
        id: 'vcd-vce-e02-s1',
        type: 'worked-example',
        title: 'Texture: Surface Quality and Cultural Meaning',
        teacherNote: 'Texture is frequently underanalysed in VCE — students name it without discussing its communicative function. Push for purpose-audience connections.',
        imagePrompt: 'design texture studies showing visual and tactile texture contrast rough smooth organic geometric grain paper wood metal, design elements poster educational',
        content: {
          heading: 'Texture Communicates Before the Viewer Consciously Reads',
          body: [
            {
              label: 'Actual vs Visual Texture',
              text: 'Actual texture is physically present — embossed packaging, rough paper stock, woven fabric. Visual texture is the illusion of surface quality on a flat surface — a photograph of timber, a halftone dot pattern, a scanned linen texture in a background. In print design, actual texture (paper choice, lamination, embossing, foil) is a powerful communication tool — glossy lamination communicates premium and precision; uncoated recycled stock communicates environmental consciousness and authenticity.',
              highlight: 'blue',
            },
            {
              label: 'Texture and Brand Positioning',
              text: 'Luxury brands extensively use actual texture to communicate premium quality before the consumer reads a word: thick, cream, uncoated paper; embossed letterpress text; cold foil stamping; soft-touch matte lamination. Fast fashion packaging uses cheap gloss laminate on thin stock — the textural message is speed and disposability. Texture is a material message about value.',
              highlight: 'green',
            },
            {
              label: 'Colour: Hue, Saturation and Value',
              text: 'Colour has three properties: Hue (the colour itself — red, blue, green), Saturation (the intensity or purity of the colour — vivid vs muted/desaturated), and Value (the lightness or darkness — tint = colour + white, shade = colour + black, tone = colour + grey). In VCE analysis, always describe colour using all three properties: "a highly saturated warm red" is more precise than just "red".',
              highlight: 'orange',
            },
            {
              label: 'Colour Temperature',
              text: 'Warm colours (red, orange, yellow) appear to advance — they seem closer to the viewer and feel energetic, urgent, or stimulating. Cool colours (blue, green, violet) appear to recede — they feel calmer, more distant, and more rational. This is why warning and emergency signage uses warm colours (red, orange), and corporate/technology brands favour cool blues (trust, calm, rationality). Interior designers use temperature to make rooms feel larger (cool) or cozier (warm).',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What is the difference between actual texture and visual texture in design?', a: 'Actual texture is physically present on the surface (embossing, paper stock, fabric). Visual texture is the illusion of surface quality on a flat surface — a photographic or graphic representation of texture.' },
            { q: 'Why do luxury brands invest heavily in actual texture for their packaging?', a: 'Actual texture communicates premium quality before the consumer consciously engages with the design — thick paper, embossing, and foiling signal quality through touch, making the unboxing experience itself a brand message.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e02-s2',
        type: 'worked-example',
        title: 'Colour Theory: Harmonies and Psychology',
        teacherNote: 'Colour theory is heavily tested in the VCE exam. Students must understand the colour wheel, harmonies, and cultural/psychological effects fluently.',
        imagePrompt: 'colour theory diagram showing colour wheel complementary analogous triadic split complementary harmonies with brand examples, clean educational design poster',
        content: {
          heading: 'Colour Harmonies and Psychological Effects',
          body: [
            {
              label: 'The Colour Wheel and Harmonies',
              text: 'Primary colours (red, yellow, blue in traditional theory; red, green, blue in light/RGB). Secondary colours (orange, green, violet). Tertiary colours (red-orange, yellow-green, etc). Harmonies: Complementary (opposite colours — maximum contrast, vibrant, eye-catching: red/green, blue/orange), Analogous (adjacent colours — harmonious, cohesive, natural: blue/blue-green/green), Triadic (three equally spaced — vibrant but balanced: red/yellow/blue), Split-complementary (a colour plus two adjacent to its complement — vibrant but less harsh than complementary).',
              highlight: 'blue',
            },
            {
              label: 'CMYK vs RGB: Critical for Production',
              text: 'RGB (Red, Green, Blue) is additive colour — used for screen/digital display. Mixing all three at maximum = white. CMYK (Cyan, Magenta, Yellow, Key/Black) is subtractive colour — used for print. Mixing all pigments = near-black. NEVER design for print in RGB — colours will shift when converted. Screen designs that look vibrant in RGB can appear duller in CMYK print. This is a technical specification that VCE students must know and apply in their briefs.',
              highlight: 'green',
            },
            {
              label: 'Colour Psychology',
              text: 'Red: urgency, passion, danger, appetite stimulation (fast food). Blue: trust, calm, technology, authority (finance, tech). Green: nature, health, sustainability, growth. Yellow: optimism, energy, caution, visibility (highest luminosity). Orange: enthusiasm, warmth, accessibility, creativity. Purple: luxury, spirituality, wisdom, royalty. Black: sophistication, luxury, authority, finality. White: purity, minimalism, cleanliness, space. These are Western cultural associations — they shift across cultures.',
              highlight: 'orange',
            },
            {
              label: 'Monochromatic and Achromatic Schemes',
              text: 'Monochromatic colour schemes use one hue in multiple values and saturations (e.g. a design using light blue, mid blue, deep navy). They create cohesion and visual restraint — often associated with minimalism and sophistication. Achromatic schemes use only black, white and grey — no hue. They communicate timelessness, precision and elegance. Many luxury fashion houses (Chanel, Celine) use achromatic palettes to avoid associating with a specific hue\'s cultural connotations.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What is the difference between RGB and CMYK colour modes, and when should each be used?', a: 'RGB (additive, light-based) is for digital/screen designs. CMYK (subtractive, pigment-based) is for print production. Designing print work in RGB will cause colour shifting when converted — always set up print documents in CMYK.' },
            { q: 'Why do fast food brands (McDonald\'s, KFC) predominantly use red and yellow in their identities?', a: 'Red creates urgency and stimulates appetite; yellow attracts attention (highest luminosity of all colours) and communicates happiness and warmth. Together they create an emotionally compelling combination designed to trigger hunger and impulsive behaviour — both are warm advancing colours.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e02-s3',
        type: 'quiz',
        title: 'Quiz: Texture and Colour Theory',
        teacherNote: 'Colour theory questions appear in almost every VCE VCD exam — students must be fluent.',
        questions: [
          { id: 'vcd-vce-e02-q1', text: 'Blue and orange are examples of which colour harmony?', image: null, options: ['Analogous', 'Monochromatic', 'Complementary', 'Triadic'], correct: 2, explanation: 'Complementary colours sit directly opposite each other on the colour wheel. Blue and orange are complements — they create maximum colour contrast and appear more vibrant when placed adjacent.' },
          { id: 'vcd-vce-e02-q2', text: 'A packaging designer creates a box for organic tea in CMYK on uncoated recycled stock. What texture message does this communicate?', image: null, options: ['Premium luxury quality', 'Environmental authenticity and naturalism — consistent with the organic brand values', 'Speed and efficiency', 'Digital modernity'], correct: 1, explanation: 'Uncoated recycled stock feels organic and natural — it communicates environmental authenticity through its tactile and visual texture. This aligns with the organic tea brand\'s values and resonates with its environmentally conscious audience.' },
          { id: 'vcd-vce-e02-q3', text: 'A designer is creating artwork for a luxury print brochure. They should set up their document in:', image: null, options: ['RGB colour mode', 'CMYK colour mode', 'Greyscale only', 'Pantone only'], correct: 1, explanation: 'Print production uses CMYK (Cyan, Magenta, Yellow, Key/Black) subtractive colour. Setting up in RGB and converting later causes colour shifts. Always design for print in CMYK from the start.' },
          { id: 'vcd-vce-e02-q4', text: 'A design uses blue, blue-green and green. This is an example of which colour harmony?', image: null, options: ['Complementary', 'Triadic', 'Analogous', 'Split-complementary'], correct: 2, explanation: 'Analogous harmonies use colours adjacent to each other on the colour wheel. Blue, blue-green and green are neighbours — they create harmonious, cohesive palettes that feel natural and unified.' },
          { id: 'vcd-vce-e02-q5', text: 'The "value" of a colour refers to:', image: null, options: ['Its monetary cost', 'Its relative lightness or darkness', 'Its intensity or purity', 'Its temperature (warm or cool)'], correct: 1, explanation: 'Value is one of three colour properties (alongside hue and saturation) — it describes how light or dark a colour is. Tints (colour + white) increase value; shades (colour + black) decrease it.' },
          { id: 'vcd-vce-e02-q6', text: 'Which colour appears to visually advance (seem closer to the viewer) in a composition?', image: null, options: ['Cool violet', 'Cool blue', 'Warm red-orange', 'Cool blue-green'], correct: 2, explanation: 'Warm colours (red, orange, yellow) appear to advance — they seem to come toward the viewer. Cool colours recede. Designers use this to push elements forward (warm) or push them back (cool) without changing their physical position in the layout.' },
        ],
      },
      {
        id: 'vcd-vce-e02-s4',
        type: 'worked-example',
        title: 'Cultural Colour Meanings — Global Design Awareness',
        teacherNote: 'Exam questions increasingly test cultural sensitivity in design — this content prepares students for both the exam and professional practice.',
        imagePrompt: 'cultural colour meaning chart showing different colour associations across Western Asian Middle Eastern cultures, educational design infographic clean layout',
        content: {
          heading: 'Colour Meaning Changes Across Cultures',
          body: [
            {
              label: 'Why Cultural Context Matters',
              text: 'Colour meaning is not universal — it is culturally determined. A design that works perfectly for an Australian audience can inadvertently communicate the opposite meaning in another cultural context. In globalised design (packaging sold internationally, websites for global audiences, international brand launches), cultural colour literacy is not optional — it is a professional requirement addressed in VCE VCD\'s Cultural evaluation criterion.',
              highlight: 'blue',
            },
            {
              label: 'Key Cultural Colour Differences',
              text: 'White: Western = purity/weddings/minimalism; East Asian = mourning/death/funerals — a white gift box is inappropriate in China or Japan. Red: Western = danger/love/urgency; Chinese = luck/celebration/prosperity — red is the dominant colour at Chinese New Year and weddings. Green: Western = nature/growth; Middle Eastern = the colour of Islam/sacred meaning — religious sensitivity required. Black: Western = elegance/mourning; Ethiopian cultural contexts = strength/age/masculinity.',
              highlight: 'green',
            },
            {
              label: 'Application in VCE Evaluation',
              text: 'When writing the Cultural evaluation criterion, address: (1) What cultural context does this design operate in? (2) Are there colour choices that may carry unintended cultural meanings for the target audience? (3) Does the design demonstrate cultural awareness in its visual decisions? A design for a multicultural Australian audience should consider that different community members may read colours differently.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'Why is white packaging inappropriate as a gift in some East Asian cultural contexts?', a: 'In several East Asian cultures (China, Japan, Korea), white is the colour associated with mourning, death and funerals. A white gift box communicates the opposite of the intended celebratory meaning.' },
            { q: 'How does cultural colour awareness relate to the VCE VCD evaluation criteria?', a: 'Cultural sensitivity is one of the four VCAA evaluation criteria — designers must consider whether colour choices are appropriate and respectful within the cultural context of the target audience, and avoid unintentional negative cultural connotations.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e02-s5',
        type: 'free-response',
        title: 'Colour Analysis: Your Chosen Design',
        teacherNote: 'Students who struggle with this benefit from having the colour wheel beside them — colour naming is a skill that improves with reference.',
        prompt: 'Select a brand, poster or packaging design with a distinctive colour palette. Analyse its colour choices in full VCE depth.',
        fields: [
          {
            id: 'design',
            label: 'Name and describe the design and its colour palette',
            placeholder: 'e.g. Cadbury chocolate packaging — a distinctive deep purple (Pantone 2685C) with gold typography...',
            multiline: true,
            minRows: 2,
          },
          {
            id: 'harmony',
            label: 'Identify the colour harmony used and describe the hue, saturation and value of each colour',
            placeholder: 'e.g. The scheme is essentially monochromatic — a deep, highly saturated purple with gold as an accent. The purple is a cool colour with high saturation and very low value (very dark)...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'psychology',
            label: 'Analyse the psychological and cultural effects of these colour choices in relation to the audience',
            placeholder: 'e.g. Purple carries strong associations with luxury, royalty and premium quality in Western culture — Cadbury has used this exclusively since 1914, making the colour itself the brand signal for a mass-market chocolate audience seeking a sense of affordable luxury...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-e02-s6',
        type: 'homework',
        title: 'Homework: Colour in the Real World',
        teacherNote: 'Colour theory becomes real when students apply it to their own environment — push them to look analytically at familiar designs.',
        dueNext: true,
        tasks: [
          { id: 'hw1', label: 'Visit a supermarket and photograph the packaging from 3 products in the same category (e.g. 3 cereals, 3 body washes)', hint: 'Analyse how competing products differentiate through colour — how does each brand use colour to position itself differently from competitors on the same shelf?' },
          { id: 'hw2', label: 'Find one example of a design that uses colour in a culturally sensitive (or insensitive) way and explain your analysis', hint: 'This could be a global brand that adjusted its colours for different markets, or a brand that received criticism for cultural colour insensitivity — research the story.' },
          { id: 'hw3', label: 'Create a colour palette for an imaginary brand with a brief (e.g. a sustainable Melbourne café targeting 25–35 year olds). Annotate every colour choice with psychological and cultural justification.', hint: 'Reference colour temperature, saturation, harmony type, and why each choice suits the specific audience described.' },
        ],
      },
    ],
  },

  // ─── SESSION: DESIGN PRINCIPLES ──────────────────────────────────────────
  {
    id: 'vcd-vce-e03',
    subject: 'vcd',
    title: 'Design Principles: Balance, Contrast & Dominance',
    victorianCode: 'VCAA-VCD-PRIN1',
    description: 'Master the VCAA 2024 design principles of balance, contrast and dominance — how they work, how to identify them, and how to write VCE-level analysis using precise vocabulary.',
    yearLevel: 11,
    estimatedMinutes: 65,
    starsAvailable: 6,
    color: '#7c3aed',
    icon: '⚖️',
    steps: [
      {
        id: 'vcd-vce-e03-s1',
        type: 'worked-example',
        title: 'Balance, Contrast and Dominance',
        teacherNote: 'Note: the VCAA 2024 study design uses "dominance" not "emphasis." Students should use the correct VCAA terminology in their exam responses and folio annotations.',
        imagePrompt: 'design principles balance contrast dominance study showing symmetrical asymmetrical examples visual weight dominant element annotations, clean educational design poster infographic',
        content: {
          heading: 'Balance, Contrast and Dominance — the VCAA 2024 Principles',
          body: [
            {
              label: 'Symmetrical and Asymmetrical Balance',
              text: 'Symmetrical (formal) balance: elements are mirrored across a central axis — creates stability, formality, dignity. Historically used in architecture, religious and governmental design. Asymmetrical (informal) balance: elements balance through visual weight rather than position. Visual weight is determined by: size, colour saturation, tonal contrast, texture, complexity and position. A small dark textured element can balance a large pale element. Asymmetrical balance feels dynamic and modern while maintaining compositional equilibrium.',
              highlight: 'blue',
            },
            {
              label: 'Contrast',
              text: 'Contrast is the degree of difference between elements — the greater the difference, the greater the contrast. Types: tonal contrast (light vs dark), scale contrast (large vs small), colour contrast (complementary colours, warm vs cool), texture contrast (smooth vs rough), typographic contrast (serif vs sans-serif, heavy vs light weight). Contrast is essential for visual hierarchy — without contrast, all elements appear equally important, creating monotony and visual confusion.',
              highlight: 'green',
            },
            {
              label: 'Dominance (not Emphasis)',
              text: 'Dominance — the VCAA 2024 term for what is sometimes called "emphasis" — is the principle that creates a clear focal point: the element that commands the viewer\'s attention first. Dominance is established through: maximum contrast against the background, greater size relative to other elements, the most saturated or advancing colour, isolation in negative space, position at the optical centre or along a strong axis, or having directional lines from other elements pointing toward it. A composition without a dominant element lacks visual hierarchy and confuses the viewer.',
              highlight: 'orange',
            },
            {
              label: 'Dominance vs Visual Hierarchy',
              text: 'Dominance establishes the single most important element. Visual hierarchy establishes a ranked order for all elements — first (dominant), second, third, and so on. Both are required in professional design: the dominant element anchors the composition; the hierarchy guides the viewer through all remaining information in order of importance. In a poster: the dominant headline → the dominant image → the subheading → the body text → the call to action. Every level is a designed decision.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What is the correct VCAA 2024 term for the design principle that creates the primary focal point in a composition?', a: 'Dominance — not "emphasis." The VCAA 2024 study design uses "dominance" to describe the principle that makes one element command the viewer\'s attention first. Always use the correct VCAA terminology in exam responses.' },
            { q: 'How does dominance differ from visual hierarchy?', a: 'Dominance establishes the single most important element in a composition — the one focal point. Visual hierarchy arranges ALL elements in a ranked order of importance from most to least dominant. Dominance is about one element; hierarchy is about the ordered relationship between all elements.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e03-s2',
        type: 'quiz',
        title: 'Quiz: Balance, Contrast and Dominance',
        teacherNote: 'Reinforce the VCAA terminology — "dominance" not "emphasis." Students who use the wrong term in the exam may lose marks.',
        questions: [
          { id: 'vcd-vce-e03-q1', text: 'A composition has a large, lightly coloured shape on the left balanced by a small, dark, highly textured shape on the right. This is an example of:', image: null, options: ['Symmetrical balance', 'Radial balance', 'Asymmetrical balance achieved through contrasting visual weights', 'Imbalance'], correct: 2, explanation: 'Asymmetrical balance uses different visual weights to achieve equilibrium — the small dark textured shape has greater visual weight than its size suggests, balancing the larger but lighter shape.' },
          { id: 'vcd-vce-e03-q2', text: 'In VCAA 2024 VCD terminology, the principle that creates the primary focal point in a composition is called:', image: null, options: ['Emphasis', 'Dominance', 'Unity', 'Hierarchy'], correct: 1, explanation: 'The VCAA 2024 study design uses the term "dominance" for the principle that makes one element command the viewer\'s attention first. Using "emphasis" instead risks losing marks in the exam — always use the correct VCAA terminology.' },
          { id: 'vcd-vce-e03-q3', text: 'Which type of balance is most associated with formality, tradition and institutional authority?', image: null, options: ['Asymmetrical balance', 'Radial balance', 'Symmetrical balance', 'Implied balance'], correct: 2, explanation: 'Symmetrical balance has historical associations with classical architecture, religious design and governmental authority — it projects stability, formality and permanence.' },
          { id: 'vcd-vce-e03-q4', text: 'A magazine spread has a large high-contrast headline taking up 60% of the page and body text in light grey. Which principle makes the headline the dominant element?', image: null, options: ['Symmetrical balance', 'Dominance through scale and tonal contrast', 'Pattern', 'Proportion alone'], correct: 1, explanation: 'The large scale and high tonal contrast of the headline against the lighter body text creates dominance — the viewer\'s eye goes to the headline first. Scale and tonal contrast are the primary tools of dominance here.' },
        ],
      },
      {
        id: 'vcd-vce-e03-s3',
        type: 'worked-example',
        title: 'Rhythm, Harmony, Unity and Proportion',
        teacherNote: 'The VCAA 2024 study design lists "harmony" as a separate principle from unity. Harmony refers to the pleasing relationship between elements; unity is the overall coherence of the design as a whole.',
        imagePrompt: 'design principles rhythm unity proportion examples showing grid based editorial layout repetition pattern visual flow, educational design poster clean layout',
        content: {
          heading: 'Rhythm, Harmony, Unity and Proportion: The Invisible Architecture',
          body: [
            {
              label: 'Rhythm in Design',
              text: 'Visual rhythm is created by the repetition of design elements at regular or irregular intervals. Regular rhythm (uniform repetition) creates order and predictability — used in grid systems, stripes, patterns, and formal brand systems. Progressive rhythm (elements increasing or decreasing in size, colour, or spacing) creates movement and direction — the eye follows the progression. Flowing rhythm (curvilinear repetition) creates organic, graceful movement — seen in art nouveau design and nature-inspired work.',
              highlight: 'blue',
            },
            {
              label: 'Harmony: Pleasing Relationships Between Elements',
              text: 'Harmony is the principle describing the pleasing visual relationship between elements — when colours, shapes, textures and forms feel as though they belong together because they share visual qualities or follow a consistent logic. Colour harmony (analogous or complementary palettes), typographic harmony (consistent typeface family), and formal harmony (related shapes throughout) all contribute. Harmony is about the relationship between individual elements; it is distinct from unity.',
              highlight: 'green',
            },
            {
              label: 'Unity: The Design Feels Complete',
              text: 'Unity is the overarching quality of a design where all elements work together as a coherent whole — nothing feels out of place, added randomly, or inconsistent with the rest. Achieved through: consistent colour palette, consistent typographic system, recurring shapes or motifs, shared alignment grids, and consistent spatial relationships. A design without unity feels assembled rather than designed — as if elements came from different sources. Brand guidelines enforce unity across all applications and media.',
              highlight: 'orange',
            },
            {
              label: 'Proportion and the Golden Ratio',
              text: 'Proportion describes the relationship in size between elements. The Golden Ratio (1:1.618) appears throughout nature and has been used in Western design since ancient Greece — the Parthenon, Renaissance paintings, and many contemporary logo systems are based on this ratio. The Rule of Thirds divides a composition into 3×3 equal sections — placing key elements at the intersection points creates visually comfortable, dynamic compositions. Proportion communicates: generous proportions suggest confidence and luxury; cramped proportions suggest economy or urgency.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'How does a brand style guide enforce visual unity across different applications?', a: 'A style guide specifies the exact colours (with Pantone, CMYK and RGB values), typefaces and their usage rules, spacing and proportion rules, logo usage rules, and grid systems. By applying these consistently, all brand touchpoints share a visual vocabulary that makes them feel like parts of one system — achieving unity across different media and designers.' },
            { q: 'What is the difference between regular and progressive rhythm in design?', a: 'Regular rhythm uses uniform repetition (equal intervals, equal sizes) creating order and predictability. Progressive rhythm involves elements that change progressively (growing larger, lighter, or more spaced) — creating visual movement and directing the viewer\'s eye along a path.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e03-s4',
        type: 'quiz',
        title: 'Quiz: Rhythm, Harmony, Unity and Proportion',
        teacherNote: 'Unity and harmony are distinct principles in the VCAA 2024 study design — students should be able to explain both separately.',
        questions: [
          { id: 'vcd-vce-e03-q5', text: 'A design system uses five different typefaces in five different colours with no consistent spacing or alignment. This design most clearly lacks:', image: null, options: ['Contrast', 'Dominance', 'Unity — there is no consistent visual language or system', 'Rhythm'], correct: 2, explanation: 'Unity requires consistent visual elements that make a design feel like a cohesive whole. Inconsistent typefaces, colours and spacing creates visual chaos — the opposite of unity.' },
          { id: 'vcd-vce-e03-q6', text: 'A poster design places a large circle in the top-left third and a small square at the bottom-right intersection point of a Rule of Thirds grid. The visual effect of this proportion relationship is:', image: null, options: ['Static and uninteresting', 'Dynamically balanced — the different sizes create visual tension while the Rule of Thirds placement creates comfortable composition', 'Chaotic and hard to read', 'Perfectly symmetrical'], correct: 1, explanation: 'The Rule of Thirds creates naturally pleasing compositions by placing elements at power points (intersections) rather than the centre. The proportion difference (large vs small) creates dynamic contrast while the grid placement maintains compositional harmony.' },
          { id: 'vcd-vce-e03-q7', text: 'Progressive rhythm in design (elements progressively increasing in size) creates a sense of:', image: null, options: ['Static calm', 'Movement, direction and dynamic energy — the eye follows the progression', 'Perfect balance', 'Uniform pattern'], correct: 1, explanation: 'Progressive rhythm guides the viewer\'s eye — the direction of change (growing or shrinking) creates an implied movement through the composition. This is used to build visual pathways and create dynamism.' },
        ],
      },
      {
        id: 'vcd-vce-e03-s5',
        type: 'free-response',
        title: 'Principles in Practice: Comparative Analysis',
        teacherNote: 'Comparative analysis is a key VCE skill — push students to contrast how different designers achieve similar goals through different principles.',
        prompt: 'Compare how TWO different organisations (e.g. Amnesty International and NAB Bank, or Apple and a charity of your choice) use design principles differently to communicate to their different audiences.\n\nFocus on: balance type, the use of contrast to create hierarchy, and what creates dominance in each design.',
        fields: [
          {
            id: 'design_a',
            label: 'Design A — describe the organisation and its design approach',
            placeholder: 'e.g. Apple.com homepage — asymmetrical balance, the product image is the dominant element, white space is used deliberately...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'design_b',
            label: 'Design B — describe the organisation and its design approach',
            placeholder: 'e.g. NAB bank website — symmetrical grid structure, navy/white tonal contrast creates hierarchy, the CTA button uses warm colour for dominance...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'comparison',
            label: 'Compare: why are the principles used so differently, given the different audiences and purposes?',
            placeholder: 'e.g. Apple\'s minimalism and asymmetrical emphasis on the single product reflects a premium, confident brand speaking to design-literate consumers. NAB\'s symmetrical stability reflects the reliability and order that financial customers need to feel trust...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-e03-s6',
        type: 'homework',
        title: 'Homework: Principles in Your Folio',
        teacherNote: 'Students should apply these principles consciously in their own design work — not just identify them in others\'.',
        dueNext: true,
        tasks: [
          { id: 'hw1', label: 'Review your current folio project and identify which design principles you have used — annotate these in your folio', hint: 'Be specific: "I used asymmetrical balance — the large image on the left is balanced by a concentrated text block on the right because..."' },
          { id: 'hw2', label: 'Write a 300-word analysis of a double-page magazine spread focusing exclusively on how design principles create the visual experience', hint: 'Identify balance type, where emphasis is placed and how it is achieved, what creates the visual rhythm and unity, what proportional relationships exist between elements' },
          { id: 'hw3', label: 'Redesign a section of your folio work to improve one specific principle — document before and after with annotation explaining what changed and why', hint: 'Focus on one principle at a time — trying to improve everything simultaneously usually makes nothing better' },
        ],
      },
    ],
  },

  // ─── SESSION: GESTALT PRINCIPLES ─────────────────────────────────────────
  {
    id: 'vcd-vce-e04',
    subject: 'vcd',
    title: 'Gestalt Principles in Visual Communication',
    victorianCode: 'VCAA-VCD-GEST',
    description: 'Understand how the human mind perceives visual information through gestalt principles — proximity, similarity, continuation, closure, figure-ground — and apply these in VCE analysis and design.',
    yearLevel: 11,
    estimatedMinutes: 60,
    starsAvailable: 5,
    color: '#7c3aed',
    icon: '🧠',
    steps: [
      {
        id: 'vcd-vce-e04-s1',
        type: 'worked-example',
        title: 'How the Brain Organises Visual Information',
        teacherNote: 'Gestalt principles explain WHY certain design choices work — they are not arbitrary rules but descriptions of perceptual psychology. Connect each principle to a well-known design example.',
        imagePrompt: 'gestalt principles diagram showing proximity similarity continuation closure figure-ground with visual design examples, educational psychology design poster clean layout',
        content: {
          heading: 'Gestalt: The Brain Groups What Belongs Together',
          body: [
            {
              label: 'Proximity',
              text: 'Elements close to each other are perceived as belonging together, regardless of their shape or colour. In design: grouping related information close together (and separating unrelated groups with space) creates logical visual organisation without lines or boxes. Navigation menus use proximity — the menu items are close, the gap before the next section is larger. In editorial layout, captions are placed close to the images they describe.',
              highlight: 'blue',
            },
            {
              label: 'Similarity',
              text: 'Elements that share visual qualities (same colour, size, shape, texture) are perceived as belonging to the same group. In design: all clickable elements in an interface should share a visual quality (blue, underlined) so users know they are all links. All headings in a document use the same typeface and size so readers perceive the hierarchy. Using the same shape for all icons in a set creates visual unity through similarity.',
              highlight: 'green',
            },
            {
              label: 'Continuation',
              text: 'The eye follows paths, curves or lines and continues beyond their physical endpoint. In design: a row of arrows or a diagonal line directs the eye to a destination even after the line ends. The Amazon logo uses a curved arrow (from A to Z) that also appears to smile — the eye follows the arc, reading both the brand message (we sell everything from A to Z) and the emotional warmth simultaneously.',
              highlight: 'orange',
            },
            {
              label: 'Closure and Figure-Ground',
              text: 'Closure: the mind completes incomplete shapes (the FedEx arrow, the WWF panda constructed from discontinuous shapes). Figure-Ground: the visual separation between a subject (figure) and its background (ground). Some designs deliberately create figure-ground ambiguity — the old/young woman optical illusion, the Rubin vase. In logo design, figure-ground reversal can embed secondary meanings (the 2006 Washington DC Arts logo embeds both a dancer and "DC" in positive/negative space).',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'How does the gestalt principle of proximity help designers organise information without using lines or boxes?', a: 'Elements placed close together are perceived as related groups. By clustering related content and separating groups with larger spaces, designers create logical information architecture purely through spatial arrangement — reducing visual clutter while maintaining clear organisation.' },
            { q: 'What is figure-ground in visual design, and how can designers exploit ambiguity in this relationship?', a: 'Figure-ground is the perceptual relationship between a subject (figure) and its background (ground). Ambiguity — where figure and ground can be read as switching — allows designs to embed secondary meanings or create memorable optical effects, as seen in logos that hide secondary imagery in negative space.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e04-s2',
        type: 'quiz',
        title: 'Quiz: Gestalt Principles',
        teacherNote: 'Students should be able to name and apply all five gestalt principles in their analysis.',
        questions: [
          { id: 'vcd-vce-e04-q1', text: 'A website groups all payment icons (Visa, Mastercard, PayPal) close together in the footer, separated by space from the copyright text. Which gestalt principle is creating this visual grouping?', image: null, options: ['Similarity', 'Proximity', 'Closure', 'Continuation'], correct: 1, explanation: 'Proximity causes elements that are close together to be perceived as related — the payment icons are grouped by their physical closeness, telling users they all belong to the same category (payment options).' },
          { id: 'vcd-vce-e04-q2', text: 'In the FedEx logo, the implied arrow between the E and x that the brain perceives without being physically drawn is an example of:', image: null, options: ['Proximity', 'Similarity', 'Closure', 'Continuation'], correct: 2, explanation: 'Closure is the mind\'s tendency to complete incomplete shapes. The gap between E and x is perceived as an arrow because the brain fills in the implied form — creating a shape that doesn\'t physically exist.' },
          { id: 'vcd-vce-e04-q3', text: 'All clickable links on a website are displayed in blue and underlined. Non-clickable text is black. Users intuitively know which text is clickable. This is an application of:', image: null, options: ['Proximity', 'Similarity — elements sharing visual qualities are perceived as belonging to the same category (clickable)', 'Figure-ground', 'Continuation'], correct: 1, explanation: 'Similarity causes users to group all blue underlined elements as "the same type of thing" — in this case, links. This is fundamental to interface design: consistent visual treatment of similar-function elements builds user understanding.' },
          { id: 'vcd-vce-e04-q4', text: 'A poster shows a diagonal row of dots that appears to continue beyond the poster edge, directing the eye toward the call to action. This uses:', image: null, options: ['Closure', 'Similarity', 'Continuation — the eye follows the implied path beyond the physical end of the dots', 'Proximity'], correct: 2, explanation: 'Continuation causes the eye to follow implied paths even when they end — the diagonal dot sequence creates a visual vector pointing toward the call to action, even though the sequence stops before reaching it.' },
          { id: 'vcd-vce-e04-q5', text: 'A logo uses alternating black and white areas where the positive and negative space appear to switch depending on how you look at it. This technique is called:', image: null, options: ['Symmetry', 'Figure-ground ambiguity — deliberately making ground and figure interchangeable', 'Monochromatic contrast', 'Visual rhythm'], correct: 1, explanation: 'Figure-ground ambiguity is a deliberate design technique where the relationship between subject and background is interchangeable — the viewer can read either the black or white areas as the "figure", often revealing two different meanings.' },
        ],
      },
      {
        id: 'vcd-vce-e04-s3',
        type: 'worked-example',
        title: 'Applying Gestalt to Your Own Design Decisions',
        teacherNote: 'The most valuable use of gestalt knowledge is in students\' own design decisions — not just in analysis. Push students to apply these principles intentionally.',
        imagePrompt: 'VCE design folio page showing intentional application of gestalt principles in layout design with annotations pointing to proximity similarity grouping, professional student portfolio',
        content: {
          heading: 'Gestalt as a Design Tool, Not Just Analysis Theory',
          body: [
            {
              label: 'Using Proximity for Information Design',
              text: 'When designing a poster, brochure or interface: start by identifying your information groups. Which elements belong together logically? Then place them close together physically, and create clear spatial separation between groups. This creates visual hierarchy and readability without relying on lines, boxes, or other structural elements — the composition feels clean because the structure is invisible.',
              highlight: 'blue',
            },
            {
              label: 'Using Similarity for System Design',
              text: 'In a brand system or publication design, identify the categories of elements (headings, body text, captions, callouts, CTAs). Give each category a consistent visual treatment. This creates a visual grammar that readers learn quickly — they know a bold teal box is always a key fact, a grey italic is always a caption. Consistent similarity across a system reduces cognitive load for the reader.',
              highlight: 'green',
            },
            {
              label: 'Folio Annotation Opportunity',
              text: 'When you make a deliberate gestalt decision in your folio design — grouping related design iterations, using visual similarity to link your mood board to your colour explorations, creating figure-ground ambiguity in a logo mark — annotate it explicitly: "I applied the gestalt principle of proximity to group the three logo iterations with their annotation notes, separating them from the rejected concepts with a larger gap, creating clear visual organisation without adding borders." This level of annotation demonstrates sophisticated design thinking.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'How can the gestalt principle of similarity be used in a publication design system?', a: 'By giving each category of content a consistent visual treatment (e.g. all headings same typeface and size, all captions same colour and size), designers create a visual grammar. Readers quickly learn the system and can navigate the publication efficiently because similar-looking elements always serve the same function.' },
            { q: 'Why is it useful to annotate gestalt decisions explicitly in a VCE folio?', a: 'Explicitly naming gestalt principles in annotations demonstrates sophisticated design thinking — it shows the decision was intentional and theoretically informed. This elevates annotation from "I put these together because they looked good" to "I applied proximity to create visual grouping, which improves information hierarchy for the reader."' },
          ],
        },
      },
      {
        id: 'vcd-vce-e04-s4',
        type: 'free-response',
        title: 'Gestalt Analysis: Deconstruct a Real Design',
        teacherNote: 'Give students a design they have not seen before for maximum challenge — avoid designs they have already analysed.',
        prompt: 'Choose a complex visual design — a magazine cover, a website landing page screenshot, or a product packaging range — and identify and analyse ALL gestalt principles you can observe.',
        fields: [
          {
            id: 'design',
            label: 'Name and describe your chosen design',
            placeholder: '',
            multiline: true,
            minRows: 2,
          },
          {
            id: 'proximity',
            label: 'Proximity: where and how is it used? What visual groups does it create?',
            placeholder: 'e.g. The product name, weight and flavour descriptor are grouped tightly at the top, separated by 20mm of space from the ingredient list below — proximity creates two distinct information zones...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'similarity_continuation',
            label: 'Similarity and/or Continuation: identify examples and explain their effect',
            placeholder: '',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'closure_figureground',
            label: 'Closure and/or Figure-Ground: are either used? What meaning do they create?',
            placeholder: '',
            multiline: true,
            minRows: 3,
          },
        ],
      },
      {
        id: 'vcd-vce-e04-s5',
        type: 'homework',
        title: 'Homework: Gestalt in Your Folio',
        teacherNote: 'Consciously applying gestalt principles to their own work is the ultimate objective — this task bridges theory and practice.',
        dueNext: false,
        tasks: [
          { id: 'hw1', label: 'Apply the gestalt principle of proximity deliberately in one page of your folio — group related elements close together, separate groups with intentional space', hint: 'Photograph the page before and after reorganising — the spatial change should be clearly visible and the organisation more intuitive' },
          { id: 'hw2', label: 'Annotate three gestalt principles you have (intentionally or unintentionally) used in your folio with proper VCE-level annotation', hint: 'Name the principle, identify where it appears, explain what visual effect it creates, connect it to the purpose of that folio page' },
        ],
      },
    ],
  },
];
