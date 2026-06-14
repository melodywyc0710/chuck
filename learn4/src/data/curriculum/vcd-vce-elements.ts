import type { Session } from '../types';

export const vcdVceElements: Session[] = [
  // ─── SESSION: DESIGN ELEMENTS ────────────────────────────────────────────
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
              text: 'Tone is the relative lightness or darkness of a surface. In design and presentation drawing, tone serves three functions: (1) Modelling — graduated tone on curved surfaces creates the illusion of 3D form. (2) Contrast — tonal contrast between elements creates visual hierarchy. (3) Atmosphere — high contrast (stark blacks and whites) creates drama and tension; low contrast (subtle tonal range) creates softness and serenity.',
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
        prompt: 'Select a well-known logo or poster (e.g. Nike, Apple, Greenpeace, Melbourne 2030 Olympic bid, any brand you use daily). Analyse how it uses at least THREE of the eight design elements (colour, shape, line, tone, texture, form, point, type).',
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

  // ─── SESSION e03: DESIGN PRINCIPLES (VCAA 2024 — ALL 8) ──────────────────
  {
    id: 'vcd-vce-e03',
    subject: 'vcd',
    title: 'Design Principles: All 8 VCAA 2024 Principles',
    victorianCode: 'VCAA-VCD-PRIN1',
    description: 'Master all eight VCAA 2024 design principles — Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. IMPORTANT: Emphasis, Unity, Harmony, Rhythm and Dominance are NOT VCAA 2024 principles.',
    yearLevel: 11,
    estimatedMinutes: 75,
    starsAvailable: 6,
    color: '#7c3aed',
    icon: '⚖️',
    steps: [
      {
        id: 'vcd-vce-e03-s1',
        type: 'worked-example',
        title: 'The Eight VCAA 2024 Design Principles — Part 1',
        teacherNote: 'CRITICAL: The VCAA 2024 study design lists exactly EIGHT design principles: Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. Emphasis, Unity, Harmony, Rhythm and Dominance are NOT in the 2024 list. Students who write "emphasis" or "dominance" in the exam are using incorrect VCAA 2024 terminology.',
        imagePrompt: 'design principles poster showing balance contrast cropping scale proportion hierarchy pattern figure-ground with visual examples, VCAA 2024 VCD educational poster',
        content: {
          heading: 'Eight Principles — Balance, Contrast, Cropping and Scale',
          body: [
            {
              label: 'Balance: Symmetrical and Asymmetrical',
              text: 'Balance is used to create equilibrium between elements in a design. Symmetrical (formal) balance: elements are mirrored across a central axis — creates stability, formality, dignity. Historically used in architecture, religious and governmental design. Asymmetrical (informal) balance: elements balance through visual weight rather than mirrored position. Visual weight is determined by: size, colour saturation, tonal contrast, texture, complexity and position. A small dark textured element can balance a large pale element. Asymmetrical balance feels dynamic and modern while maintaining compositional equilibrium. Radial balance: elements radiate from a central point.',
              highlight: 'blue',
            },
            {
              label: 'Contrast: Difference Creates Visual Interest',
              text: 'Contrast is the degree of difference between elements — the greater the difference, the greater the contrast. Types: tonal contrast (light vs dark), scale contrast (large vs small), colour contrast (complementary colours, warm vs cool), texture contrast (smooth vs rough), typographic contrast (serif vs sans-serif, heavy vs light weight). Contrast is essential for visual hierarchy — without contrast, all elements appear equally important, creating monotony and visual confusion. Contrast also creates visual interest, dynamism and readability.',
              highlight: 'green',
            },
            {
              label: 'Cropping: Framing to Focus Attention',
              text: 'Cropping is the cutting or trimming of an image to select the most important part, remove distracting elements, or create visual tension. A tightly cropped portrait conveys intensity and intimacy. Cropping at unexpected angles creates dynamism. Cropping an object so it bleeds off the edge implies the image continues beyond the frame — creating a sense of scale and abundance. In VCE, cropping is used as a compositional decision: WHAT to include and what to exclude in a frame. Understanding cropping in photography, illustration and graphic layout is essential.',
              highlight: 'orange',
            },
            {
              label: 'Scale: Relative Size and Visual Hierarchy',
              text: 'Scale refers to the size of elements in relation to each other and to the overall composition. Large elements appear more important and closer. Small elements appear less important and more distant. Dramatic scale contrast (very large next to very small) creates visual tension and emphasis. Scale is used to create visual hierarchy — the most important element is typically the largest. In poster design, the headline, image and supporting text use scale to direct reading order. Unexpected scale (a very small human next to a very large product) creates surprise and communicates brand personality.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'Name all eight design principles in the VCAA 2024 VCD study design.', a: 'Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. NOTE: Emphasis, Dominance, Unity, Harmony and Rhythm are NOT VCAA 2024 principles — do not use these terms in the exam.' },
            { q: 'What is the difference between symmetrical and asymmetrical balance?', a: 'Symmetrical balance mirrors elements across a central axis creating stability and formality. Asymmetrical balance achieves equilibrium through contrasting visual weights — a small dark element can balance a large light one. Asymmetrical balance feels more dynamic and contemporary.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e03-s2',
        type: 'worked-example',
        title: 'The Eight VCAA 2024 Design Principles — Part 2',
        teacherNote: 'Proportion, Hierarchy, Pattern and Figure-Ground complete the eight VCAA 2024 principles. Figure-Ground also appears in the gestalt principles list — this dual appearance is intentional and demonstrates its significance in visual communication.',
        imagePrompt: 'design principles proportion hierarchy pattern figure-ground examples editorial layout grid golden ratio negative space, VCAA 2024 VCD educational poster',
        content: {
          heading: 'Eight Principles — Proportion, Hierarchy, Pattern and Figure-Ground',
          body: [
            {
              label: 'Proportion: Relationships Between Sizes',
              text: 'Proportion describes the relationship in size between elements and the overall composition. The Golden Ratio (1:1.618) appears throughout nature and has been used in Western design since ancient Greece — the Parthenon, Renaissance paintings, and many contemporary logo systems are based on this ratio. The Rule of Thirds divides a composition into 3×3 equal sections — placing key elements at the intersection points creates visually dynamic compositions. Proportion communicates: generous proportions suggest confidence and luxury; cramped proportions suggest economy or urgency. Unlike Scale (which concerns size differences), Proportion is about the mathematical relationship between dimensions.',
              highlight: 'blue',
            },
            {
              label: 'Hierarchy: Ordering Information by Importance',
              text: 'Hierarchy is the visual arrangement of elements in order of their importance to the viewer. It establishes a reading order: what the viewer sees first, second, third. Hierarchy is created through combinations of Scale (larger = more important), Contrast (higher contrast = more important), Colour (advancing warm colours = more important), Position (top or optical centre = first read), and Typeface weight (bold = more important). A design without clear hierarchy confuses the viewer — everything competes equally for attention. In poster design: dominant headline → supporting image → subheading → body copy → call to action.',
              highlight: 'green',
            },
            {
              label: 'Pattern: Repetition Creates Visual Texture and Rhythm',
              text: 'Pattern is the repetition of elements (shapes, colours, lines, motifs) at regular or irregular intervals. Pattern creates visual texture across a surface, communicates brand identity (the Burberry tartan, the Louis Vuitton monogram), creates rhythm and movement, and can be used as a background element or as the primary design statement. Regular patterns create order and predictability; irregular patterns feel more organic and dynamic. Pattern is used both decoratively and functionally in VCE design work.',
              highlight: 'orange',
            },
            {
              label: 'Figure-Ground: Subject vs Background',
              text: 'Figure-Ground is the visual relationship between a subject (figure) and its background (ground). The figure is the positive element — the subject, the object, the text. The ground is the negative space — the background. In most designs, the figure is clearly distinct from the ground. Figure-Ground ambiguity — where figure and ground appear to switch — creates memorable designs and can embed secondary meanings. The FedEx hidden arrow, the WWF panda logo, the NBC peacock, the 2006 Washington DC Arts logo — all exploit Figure-Ground. Understanding Figure-Ground is essential for legibility: sufficient contrast between figure and ground is non-negotiable for accessibility.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'How is visual hierarchy created in a design? Name at least four techniques.', a: 'Hierarchy is created through: Scale (larger elements are perceived as more important), Contrast (higher tonal or colour contrast draws the eye first), Colour (warm advancing colours appear more prominent), Position (top of page / optical centre is read first), Typeface weight (bold text reads before light text), and Cropping (isolated elements appear more important than those surrounded by other elements).' },
            { q: 'What is the significance of Figure-Ground as both a design principle and a gestalt principle?', a: 'Figure-Ground appears in BOTH the design principles list and the gestalt principles list in the VCAA 2024 study design. As a design principle, it concerns the visual relationship between subject and background in a composition. As a gestalt principle, it describes the perceptual process by which the brain automatically separates figure from ground. Understanding it in both contexts demonstrates sophisticated knowledge of VCAA 2024 content.' },
          ],
        },
      },
      {
        id: 'vcd-vce-e03-s3',
        type: 'quiz',
        title: 'Quiz: All Eight VCAA 2024 Design Principles',
        teacherNote: 'Students MUST know the correct VCAA 2024 terminology. Emphasis, Dominance, Unity, Harmony and Rhythm are NOT VCAA 2024 principles. Correct any student who uses these terms immediately.',
        questions: [
          {
            id: 'vcd-vce-e03-q1',
            text: 'Which of the following is NOT one of the eight VCAA 2024 design principles?',
            image: null,
            options: ['Cropping', 'Emphasis', 'Figure-Ground', 'Hierarchy'],
            correct: 1,
            explanation: '"Emphasis" is NOT a VCAA 2024 design principle. The eight principles are: Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. Students who write "emphasis" in the exam are using incorrect terminology.',
          },
          {
            id: 'vcd-vce-e03-q2',
            text: 'A magazine cover tightly crops a portrait so the model\'s eyes fill the frame and the top of the head is cut off. This uses which VCAA 2024 design principle?',
            image: null,
            options: ['Scale', 'Pattern', 'Cropping — selecting a portion of an image to focus attention and create visual tension', 'Proportion'],
            correct: 2,
            explanation: 'Cropping is the VCAA 2024 principle describing the cutting or trimming of an image to select the most important part, remove distracting elements, or create visual tension. Tight cropping of the portrait creates intimacy and intensity.',
          },
          {
            id: 'vcd-vce-e03-q3',
            text: 'A poster has a very large product image taking up 80% of the space, with small supporting text. This uses which principle to guide the viewer\'s attention?',
            image: null,
            options: ['Pattern', 'Hierarchy — the large image is the first reading level; scale creates a clear reading order', 'Figure-Ground', 'Cropping'],
            correct: 1,
            explanation: 'Hierarchy establishes a reading order — the large-scale image is perceived first and is the dominant element. The small text creates a secondary reading level. Scale is the tool; Hierarchy is the principle being applied.',
          },
          {
            id: 'vcd-vce-e03-q4',
            text: 'The Burberry tartan and the Louis Vuitton monogram are both examples of which VCAA 2024 design principle used as brand identity?',
            image: null,
            options: ['Proportion', 'Balance', 'Figure-Ground', 'Pattern — repetition of a motif creating visual texture and brand recognition'],
            correct: 3,
            explanation: 'Pattern is the VCAA 2024 design principle describing repetition of elements at regular intervals. Both the Burberry tartan and LV monogram are patterns — the repetitive motif becomes the brand itself.',
          },
          {
            id: 'vcd-vce-e03-q5',
            text: 'The FedEx logo hides an arrow in the negative space between the E and x. This is an application of which VCAA 2024 design principle?',
            image: null,
            options: ['Cropping', 'Scale', 'Figure-Ground — the arrow is revealed through the relationship between the letter forms (figure) and the negative space (ground)', 'Pattern'],
            correct: 2,
            explanation: 'Figure-Ground is the VCAA 2024 principle describing the visual relationship between a subject and its background. The FedEx arrow exists in the ground (negative space) between two letter forms — Figure-Ground ambiguity creates the hidden image.',
          },
          {
            id: 'vcd-vce-e03-q6',
            text: 'Which of the following correctly lists ALL EIGHT VCAA 2024 design principles?',
            image: null,
            options: [
              'Balance, Contrast, Emphasis, Scale, Proportion, Hierarchy, Pattern, Figure-Ground',
              'Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern, Figure-Ground',
              'Balance, Contrast, Cropping, Scale, Proportion, Unity, Pattern, Figure-Ground',
              'Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Rhythm, Figure-Ground',
            ],
            correct: 1,
            explanation: 'The eight VCAA 2024 design principles are: Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. Option A substitutes "Emphasis" for "Cropping" — wrong. Option C substitutes "Unity" for "Hierarchy" — wrong. Option D substitutes "Rhythm" for "Pattern" — wrong.',
          },
        ],
      },
      {
        id: 'vcd-vce-e03-s4',
        type: 'quiz',
        title: 'Quiz: Applying the Principles',
        teacherNote: 'Application questions — students must identify which principle is at work in a given scenario. Push students to justify their answer using precise VCAA 2024 language.',
        questions: [
          {
            id: 'vcd-vce-e03-q7',
            text: 'A composition has a large, lightly coloured shape on the left balanced by a small, dark, highly textured shape on the right. This is an example of:',
            image: null,
            options: ['Symmetrical balance', 'Radial balance', 'Asymmetrical balance — different visual weights achieve equilibrium without mirroring', 'Hierarchy'],
            correct: 2,
            explanation: 'Asymmetrical balance uses contrasting visual weights to achieve equilibrium — the small dark textured shape has greater visual weight than its size suggests, balancing the larger but lighter shape. This is Balance as a VCAA 2024 design principle.',
          },
          {
            id: 'vcd-vce-e03-q8',
            text: 'A sans-serif headline in 72pt sits above body text in 10pt. The difference in size creates clear reading order. Which VCAA 2024 principle describes this?',
            image: null,
            options: ['Scale — the size difference itself', 'Proportion — the mathematical relationship', 'Hierarchy — scale difference creates a reading order from most to least important', 'Contrast'],
            correct: 2,
            explanation: 'While Scale describes the size difference and Contrast describes the difference between elements, Hierarchy is the overarching VCAA 2024 principle that describes the arrangement of elements in order of importance — the reading order from first to last. Scale is the tool; Hierarchy is the principle.',
          },
        ],
      },
      {
        id: 'vcd-vce-e03-s5',
        type: 'free-response',
        title: 'Principles in Practice: Comparative Analysis',
        teacherNote: 'Warn students before they write: the eight principles are Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern and Figure-Ground. NOT Emphasis, Unity, Harmony or Rhythm. If they use incorrect terms, ask them to rewrite using correct VCAA 2024 vocabulary.',
        prompt: 'Compare how TWO different organisations use design principles differently to communicate to their different audiences.\n\nFor each design, identify: what type of balance is used; how contrast creates hierarchy; how scale has been used; and whether cropping, pattern or figure-ground contribute to the design.\n\nIMPORTANT: Use ONLY VCAA 2024 principle names. Do NOT write "emphasis," "unity," "harmony" or "rhythm" — these are NOT VCAA 2024 principles.',
        fields: [
          {
            id: 'design_a',
            label: 'Design A — organisation name, describe the design, analyse using VCAA 2024 principles',
            placeholder: 'e.g. Apple.com homepage — asymmetrical balance with the product as the dominant element (hierarchy step 1); high scale contrast between large product image and small body text; figure-ground creates the product floating against a pure white ground...',
            multiline: true,
            minRows: 5,
          },
          {
            id: 'design_b',
            label: 'Design B — organisation name, describe the design, analyse using VCAA 2024 principles',
            placeholder: 'e.g. Australian Red Cross poster — symmetrical balance creates stability and institutional trust; strong tonal contrast (white cross on red) creates clear hierarchy step 1; the Red Cross figure is cropped at the edges creating vibrancy...',
            multiline: true,
            minRows: 5,
          },
          {
            id: 'comparison',
            label: 'Compare: why are the principles used so differently given each organisation\'s audience and purpose?',
            placeholder: 'e.g. Apple uses asymmetrical balance and dramatic scale contrast to create dynamic, premium design for design-literate consumers. The Red Cross uses symmetrical balance and simple tonal contrast for maximum legibility and institutional trust across all demographics...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-e03-s6',
        type: 'homework',
        title: 'Homework: All Eight Principles in Your Folio',
        teacherNote: 'Students should consciously apply VCAA 2024 principles in their own design work. Remind them: Emphasis, Unity, Harmony and Rhythm are NOT in the VCAA 2024 principles list — folio annotations must use correct terminology.',
        dueNext: true,
        tasks: [
          {
            id: 'hw1',
            label: 'Write out all eight VCAA 2024 design principles from memory, define each in one sentence, and for each note ONE example of it in a real design you have seen',
            hint: 'Balance, Contrast, Cropping, Scale, Proportion, Hierarchy, Pattern, Figure-Ground. Do this without looking at your notes first. Note: Emphasis, Unity, Harmony and Rhythm are NOT on this list.',
          },
          {
            id: 'hw2',
            label: 'Review your current folio project and annotate the use of at least FIVE of the eight VCAA 2024 principles with precise, exam-quality annotation',
            hint: 'Be specific: "I used asymmetrical balance — the large image on the left is balanced by the concentrated text block on the right because the text has higher tonal contrast against its background, giving it greater visual weight despite smaller size." This level of annotation demonstrates sophisticated design thinking.',
          },
          {
            id: 'hw3',
            label: 'Find a design that uses Figure-Ground deliberately (a logo that hides a secondary image in negative space, or a design where the background and foreground compete for attention). Analyse the figure-ground relationship and explain what the designer intended.',
            hint: 'Research the FedEx logo hidden arrow, the Roxy logo, the Amazon logo, the WWF panda, the NBC peacock, or the 2006 Washington DC Arts logo. Any of these have deliberate figure-ground relationships worth analysing.',
          },
        ],
      },
    ],
  },

  // ─── SESSION e04: ALL SIX GESTALT PRINCIPLES ─────────────────────────────
  {
    id: 'vcd-vce-e04',
    subject: 'vcd',
    title: 'Gestalt Principles of Visual Perception — All Six VCAA 2024',
    victorianCode: 'VCAA-VCD-GEST',
    description: 'Master all six VCAA 2024 gestalt principles — Proximity, Continuity, Similarity, Closure, Common Fate and Focal Point. IMPORTANT: It is "Continuity" not "Continuation." "Common Fate" and "Focal Point" are often missed.',
    yearLevel: 11,
    estimatedMinutes: 65,
    starsAvailable: 5,
    color: '#7c3aed',
    icon: '🧠',
    steps: [
      {
        id: 'vcd-vce-e04-s1',
        type: 'worked-example',
        title: 'How the Brain Groups Visual Information — Proximity, Continuity & Similarity',
        teacherNote: 'CRITICAL VCAA 2024 FACTS: (1) The correct term is "Continuity" NOT "Continuation" — students who write "continuation" may lose marks. (2) All SIX gestalt principles must be known: Proximity, Continuity, Similarity, Closure, Common Fate and Focal Point. (3) "Common Fate" and "Focal Point" are frequently missed by students — stress them explicitly.',
        imagePrompt: 'gestalt principles diagram showing proximity grouped elements, continuity eye following curved path, similarity matching shapes grouped, closure incomplete shapes completed by brain, VCAA 2024 VCD educational psychology poster',
        content: {
          heading: 'Six Gestalt Principles — How the Brain Perceives Visual Information',
          body: [
            {
              label: 'Proximity: Grouping Through Space',
              text: 'Proximity is used to group related elements together to organise information and create hierarchy. Elements close to each other are perceived as belonging together, regardless of their shape or colour. In design: clustering related information close together (and separating unrelated groups with larger gaps) creates logical visual organisation without lines or boxes. Navigation menus use proximity — the menu items are close together; the gap before the next section is larger. Captions are placed close to the images they describe. Grouping form fields close together communicates they are part of the same data set.',
              highlight: 'blue',
            },
            {
              label: 'Continuity: Following Implied Paths',
              text: 'Continuity refers to the way our brains tend to anticipate a path through elements that look the same — the eye follows a path, curve or alignment and continues beyond its physical endpoint. NOTE: The VCAA 2024 term is "Continuity" NOT "Continuation" — use the correct term. In design: a diagonal row of dots directs the eye beyond where the dots end. The Amazon logo\'s curved arrow leads the eye from A to Z. A row of aligned thumbnails in an interface creates a path the eye follows left to right. Continuity creates implied direction and movement through a composition.',
              highlight: 'green',
            },
            {
              label: 'Similarity: Shared Visual Qualities Create Groups',
              text: 'Similarity means elements that share similarities (colour, shape, size, texture, or orientation) are perceived as belonging together. In design: all clickable links in an interface share a visual quality (blue, underlined) — users learn all such elements are links. All headings in a document share typeface and size — readers perceive the document hierarchy. Using the same shape for all icons in a set creates unity through similarity. Similarity is the perceptual basis for consistent design systems and brand visual language.',
              highlight: 'orange',
            },
          ],
          questions: [
            {
              q: 'What are all six gestalt principles in the VCAA 2024 study design? Note any terms students commonly get wrong.',
              a: 'The six VCAA 2024 gestalt principles are: Proximity, Continuity, Similarity, Closure, Common Fate and Focal Point. Common mistakes: (1) Writing "Continuation" instead of "Continuity" — the VCAA term is Continuity. (2) Omitting "Common Fate" and/or "Focal Point" — these are often missed. Students must know all six by name.',
            },
            {
              q: 'How does the gestalt principle of Proximity organise information without using lines or boxes?',
              a: 'Elements placed close together are perceived as related groups. By clustering related content and separating groups with larger spaces, designers create logical information architecture purely through spatial arrangement — reducing visual clutter while maintaining clear organisation. The brain automatically sees proximity as membership of the same group.',
            },
          ],
        },
      },
      {
        id: 'vcd-vce-e04-s2',
        type: 'quiz',
        title: 'Quiz: Proximity, Continuity and Similarity',
        teacherNote: 'Correct "Continuation" to "Continuity" immediately if students use it — the VCAA 2024 term is Continuity. Also note that Common Fate and Focal Point (covered in s3) are frequently omitted from students\' lists.',
        questions: [
          {
            id: 'vcd-vce-e04-q1',
            text: 'A website groups all payment icons (Visa, Mastercard, PayPal) close together in the footer, separated by a gap from the copyright text. Which gestalt principle creates this visual grouping?',
            image: null,
            options: ['Similarity', 'Proximity', 'Closure', 'Continuity'],
            correct: 1,
            explanation: 'Proximity causes elements close together to be perceived as related. The payment icons are grouped by physical closeness, telling users they all belong to the same category (payment options). The gap separating them from copyright text creates a different group.',
          },
          {
            id: 'vcd-vce-e04-q2',
            text: 'In the VCAA 2024 study design, the gestalt principle that describes "the way our brains tend to anticipate a path through elements that look the same" is called:',
            image: null,
            options: ['Continuation', 'Continuity', 'Closure', 'Common Fate'],
            correct: 1,
            explanation: 'The VCAA 2024 term is "Continuity" — not "Continuation." Continuity describes how the brain anticipates a path through aligned or similar elements, following implied direction beyond the physical end of the path. Using "Continuation" in the exam uses incorrect terminology.',
          },
          {
            id: 'vcd-vce-e04-q3',
            text: 'All clickable links on a website are blue and underlined; non-clickable text is black. Users intuitively know which text is clickable. This applies which gestalt principle?',
            image: null,
            options: ['Proximity', 'Similarity — elements sharing visual qualities (colour, underline) are perceived as belonging to the same category (clickable links)', 'Focal Point', 'Common Fate'],
            correct: 1,
            explanation: 'Similarity causes users to group all blue underlined elements as "the same type of thing" — clickable links. This is fundamental to interface design: consistent visual treatment of similar-function elements builds user understanding and reduces cognitive load.',
          },
          {
            id: 'vcd-vce-e04-q4',
            text: 'A poster shows a diagonal row of dots that appears to continue beyond the poster edge, directing the eye toward the call to action. This applies which VCAA 2024 gestalt principle?',
            image: null,
            options: ['Closure', 'Similarity', 'Continuity — the eye follows the implied path beyond the physical end of the dots', 'Proximity'],
            correct: 2,
            explanation: 'Continuity (VCAA 2024 term — not "Continuation") causes the eye to follow implied paths even when they end. The diagonal dot sequence creates a visual vector pointing toward the call to action, even though the sequence stops before reaching it.',
          },
        ],
      },
      {
        id: 'vcd-vce-e04-s3',
        type: 'worked-example',
        title: 'Closure, Common Fate and Focal Point — The Three Often Missed',
        teacherNote: 'Common Fate and Focal Point are the two gestalt principles students most frequently omit from their list. Stress them explicitly. "Common Fate" describes elements that move or behave together being perceived as belonging together — it has strong applications in animation, interaction design and interface design.',
        imagePrompt: 'gestalt principles closure incomplete shapes perceived complete, common fate elements moving in same direction grouped, focal point single contrasting element drawing attention, VCAA 2024 VCD gestalt educational design poster',
        content: {
          heading: 'Closure, Common Fate and Focal Point — Three Critical VCAA 2024 Gestalt Principles',
          body: [
            {
              label: 'Closure: The Brain Completes Incomplete Shapes',
              text: 'Closure refers to the human tendency to perceive incomplete shapes as complete and fill in gaps. We see the whole even when only parts are drawn. In design: the FedEx logo arrow (gap between E and x perceived as a complete arrow), the WWF panda logo (black patches perceived as a complete panda despite much of the outline being absent), the NBC peacock logo (implied beak and body from coloured feather shapes). Closure allows designers to create implied shapes and hidden meanings — suggesting rather than showing completely. Closure also works in type: incomplete letterforms in logo design are completed by the brain.',
              highlight: 'blue',
            },
            {
              label: 'Common Fate: Moving Together Means Belonging Together',
              text: 'Common Fate is the tendency to perceive objects that move or behave together as belonging together. Elements that animate, flow or move in the same direction are perceived as a group — even if they have no other visual similarity. In design: a flight of birds moving in the same direction is perceived as a single group (flock). In animation and interface design: menu items that slide in from the same direction feel like they belong together. A loading animation where three dots pulse together is perceived as a unified loading indicator. Common Fate is particularly relevant in digital and interactive design — it is often missed by students who focus only on static design principles.',
              highlight: 'green',
            },
            {
              label: 'Focal Point: The Specific Area That Grabs Attention',
              text: 'Focal Point is the specific area or element within a design that immediately grabs attention. As a gestalt principle, it describes the perceptual draw of a single distinctive element in an otherwise uniform field — the one red circle among 50 grey circles; the single lit window in a dark building; the solo figure in a crowd. Focal Point works through maximum contrast against the surrounding field: difference in colour, size, shape, tone, orientation or position makes one element perceptually dominant. The Focal Point gestalt principle explains why hierarchy works — the brain is wired to notice what is different.',
              highlight: 'orange',
            },
            {
              label: 'Figure-Ground in Gestalt Context',
              text: 'Figure-Ground also appears as a gestalt principle — defined as "the tendency to perceive an object from its background." As a gestalt principle, it describes the automatic perceptual process of separating a figure from its ground. This is distinct from Figure-Ground as a design principle (about legibility and deliberate use of negative space), though both refer to the same relationship. Understanding Figure-Ground in BOTH contexts — as a design principle and a gestalt principle — demonstrates higher-order understanding of VCAA 2024 content.',
              highlight: 'purple',
            },
          ],
          questions: [
            {
              q: 'The FedEx logo has an implied arrow formed by the gap between the E and x. Which gestalt principle explains why we perceive the arrow as a complete shape even though it is not drawn?',
              a: 'Closure — the human tendency to perceive incomplete shapes as complete and fill in gaps. The brain completes the implied triangular arrow form from the two negative-space shapes surrounding the gap, even though no arrow is drawn. This is a classic application of the Closure gestalt principle.',
            },
            {
              q: 'Why is Common Fate particularly relevant to interactive and digital design? Give an example.',
              a: 'Common Fate describes elements that move or behave together as being perceived as belonging together. In interactive/digital design: menu items that slide in from the same direction feel like a group; dots that pulse simultaneously create a unified loading indicator; elements that scroll together feel like they belong to the same content section. Common Fate is often missed by students who focus on static design — in motion design and UI/UX, it is a foundational principle.',
            },
          ],
        },
      },
      {
        id: 'vcd-vce-e04-s4',
        type: 'quiz',
        title: 'Quiz: All Six Gestalt Principles',
        teacherNote: 'This quiz covers all six VCAA 2024 gestalt principles. Use it to check students can name all six without prompting. Common errors: "Continuation" instead of "Continuity"; omitting "Common Fate" and/or "Focal Point."',
        questions: [
          {
            id: 'vcd-vce-e04-q5',
            text: 'In the FedEx logo, the implied arrow between the E and x — perceived without being physically drawn — demonstrates which gestalt principle?',
            image: null,
            options: ['Proximity', 'Similarity', 'Closure', 'Common Fate'],
            correct: 2,
            explanation: 'Closure is the tendency to perceive incomplete shapes as complete and fill in gaps. The brain completes the implied arrow shape from the surrounding negative space, even though no arrow is physically drawn. This is one of the most celebrated applications of the Closure gestalt principle in graphic design.',
          },
          {
            id: 'vcd-vce-e04-q6',
            text: 'A loading screen shows three dots that pulse in and out in perfect unison. Because they move together, users perceive them as a single "loading" indicator rather than three separate elements. This is:',
            image: null,
            options: ['Proximity — they are physically close', 'Similarity — they are the same shape', 'Common Fate — elements that move or behave together are perceived as belonging together', 'Closure — incomplete shapes are filled in'],
            correct: 2,
            explanation: 'Common Fate is the gestalt principle that elements moving or behaving together are perceived as belonging to the same group. The synchronised pulsing unifies the three dots into a single perceived entity — the "loading" indicator. This is why Common Fate is so important in animation and interactive design.',
          },
          {
            id: 'vcd-vce-e04-q7',
            text: 'In a field of 49 grey squares, one is bright red. The bright red square is immediately seen first and draws all attention. Which gestalt principle explains this?',
            image: null,
            options: ['Proximity — the red square is closer to the viewer', 'Continuity — the squares create a path', 'Focal Point — the specific element that immediately grabs attention through maximum contrast against the surrounding field', 'Closure'],
            correct: 2,
            explanation: 'Focal Point is the VCAA 2024 gestalt principle describing the specific area or element that immediately grabs attention. The red square achieves Focal Point through maximum colour contrast and difference from the surrounding uniform grey field — the brain is wired to notice what is different.',
          },
          {
            id: 'vcd-vce-e04-q8',
            text: 'Which of the following correctly lists all SIX gestalt principles in the VCAA 2024 study design?',
            image: null,
            options: [
              'Proximity, Continuation, Similarity, Closure, Common Fate, Focal Point',
              'Proximity, Continuity, Similarity, Closure, Common Fate, Focal Point',
              'Proximity, Continuity, Similarity, Closure, Figure-Ground, Focal Point',
              'Proximity, Continuity, Similarity, Closure, Unity, Focal Point',
            ],
            correct: 1,
            explanation: 'The six VCAA 2024 gestalt principles are: Proximity, Continuity (NOT "Continuation"), Similarity, Closure, Common Fate and Focal Point. Option A is wrong because it says "Continuation" instead of "Continuity." Options C and D substitute other principles for Common Fate.',
          },
        ],
      },
      {
        id: 'vcd-vce-e04-s5',
        type: 'free-response',
        title: 'Gestalt Analysis: Deconstruct a Real Design',
        teacherNote: 'Students should analyse a design they have not previously dissected — fresh analysis produces better thinking. Encourage them to look for all six principles, even if not all are present.',
        prompt: 'Choose a complex visual design — a magazine cover, a website landing page screenshot, a product packaging range, or an app interface. Identify and analyse ALL gestalt principles you can observe. Remember: Proximity, Continuity, Similarity, Closure, Common Fate and Focal Point.\n\nIMPORTANT: Use "Continuity" not "Continuation." Look for all six — Common Fate and Focal Point are easy to miss.',
        fields: [
          {
            id: 'design',
            label: 'Name and describe your chosen design',
            placeholder: 'e.g. Spotify Premium landing page screenshot — dark background with green accents, album artwork arranged in a grid...',
            multiline: true,
            minRows: 2,
          },
          {
            id: 'proximity_continuity',
            label: 'Proximity and Continuity: where and how are they used?',
            placeholder: 'e.g. Proximity: the plan options (price, features list, CTA button) are tightly grouped in individual cards, separated by larger gaps — proximity creates three distinct offer groups. Continuity: the horizontal row of album artwork thumbnails creates a path the eye follows left to right...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'similarity_closure',
            label: 'Similarity and Closure: identify examples and explain their effect',
            placeholder: 'e.g. Similarity: all three plan cards share the same shape, size and internal layout — similarity communicates they are the same type of choice. Closure: the album artwork grid bleeds off the right edge — closure implies the catalogue continues beyond the frame...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'common_fate_focal',
            label: 'Common Fate and Focal Point: are either present? (Note: Common Fate is most visible in motion/interactive design — state if it is absent in your static design and explain why)',
            placeholder: 'e.g. Focal Point: the bright green "Get Premium" CTA button achieves focal point through maximum colour contrast against the dark background — it is seen first despite being smaller than the hero image. Common Fate: not observable in this static screenshot — in the live site, elements that animate in together would demonstrate Common Fate...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-e04-s6',
        type: 'homework',
        title: 'Homework: Gestalt in Your Folio',
        teacherNote: 'Consciously applying gestalt principles to students\' own work is the ultimate objective. This task bridges theory and practice. Folio annotations that name gestalt principles by their VCAA 2024 terms demonstrate sophisticated design thinking.',
        dueNext: false,
        tasks: [
          {
            id: 'hw1',
            label: 'Write out all six VCAA 2024 gestalt principles from memory, define each in one sentence, and note the VCAA correct spelling/name for each',
            hint: 'Proximity, Continuity (NOT Continuation), Similarity, Closure, Common Fate (often missed), Focal Point (often missed). If you can write all six correctly without checking, you are exam-ready on this topic.',
          },
          {
            id: 'hw2',
            label: 'Apply the gestalt principle of Proximity deliberately in one page of your folio — group related elements close together, separate groups with intentional space. Photograph before and after.',
            hint: 'The change in organisation should be clearly visible and the new arrangement more intuitive to navigate. Annotate the change using the correct VCAA 2024 term: "I applied the gestalt principle of Proximity to group..."',
          },
          {
            id: 'hw3',
            label: 'Annotate three gestalt principles you have used (intentionally or unintentionally) in your folio with proper VCE-level annotation. Include at least one of: Common Fate or Focal Point.',
            hint: 'Name the principle (correct VCAA 2024 term), identify exactly where it appears, explain what visual effect it creates, and connect it to the purpose of that folio page for the viewer. If you cannot find Common Fate in a static folio page, discuss how you would introduce it if the design were interactive.',
          },
        ],
      },
    ],
  },
];
