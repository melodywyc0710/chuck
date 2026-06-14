import type { Session } from '../types';

export const vcdVceHistory: Session[] = [
  // ─── SESSION: DESIGN HISTORY ──────────────────────────────────────────────
  {
    id: 'vcd-vce-h01',
    subject: 'vcd',
    title: 'Design History: Bauhaus, Swiss Style & Postmodernism',
    victorianCode: 'VCAA-VCD-HIST',
    description: 'Understand the major design movements that shaped contemporary visual communication — Bauhaus, Swiss International Style, Modernism and Postmodernism — and apply historical knowledge to VCE analysis.',
    yearLevel: 11,
    estimatedMinutes: 65,
    starsAvailable: 5,
    color: '#5b21b6',
    icon: '🏛️',
    steps: [
      {
        id: 'vcd-vce-h01-s1',
        type: 'worked-example',
        title: 'The Bauhaus: Art, Craft and Technology United',
        teacherNote: 'The Bauhaus is arguably the most influential design school in history. Its principles are still directly visible in contemporary design — especially in tech products and brand systems.',
        imagePrompt: 'Bauhaus design principles poster showing geometric forms primary colours grid typography Herbert Bayer typography minimalist clean design historical reference',
        content: {
          heading: 'Bauhaus (1919–1933): Form Follows Function',
          body: [
            {
              label: 'Origins and Philosophy',
              text: 'Founded by architect Walter Gropius in Dessau, Germany in 1919. The Bauhaus ("Building House") school merged fine art with craft and industrial production — rejecting the historic separation between "fine art" (painting, sculpture) and "applied art" (furniture, typography, metalwork). Core principle: "form follows function" — a designed object\'s aesthetic should emerge from its purpose, not be applied decoratively. Design should serve society, be producible by machine, and improve everyday life.',
              highlight: 'blue',
            },
            {
              label: 'Visual Language of the Bauhaus',
              text: 'Geometric forms (circle, triangle, square as the primary visual vocabulary), primary colours (red, yellow, blue — associated with psychological and formal properties), sans-serif typography (text stripped of ornamental serifs — rational, modern), grid-based composition, and the elimination of historical decoration. Herbert Bayer designed "Universal" — a lowercase-only typeface based on pure geometric construction, arguing that capital letters were unnecessary ornament.',
              highlight: 'green',
            },
            {
              label: 'Bauhaus Legacy in Contemporary Design',
              text: 'The Bauhaus was closed by the Nazis in 1933 — its faculty emigrated to the USA and spread Bauhaus principles internationally. Today its influence is everywhere: Apple\'s product design philosophy (minimal, purposeful, beautiful through function), IKEA\'s accessible modernist furniture, Swiss grid-based design, the international style of corporate identity, and the entire field of user experience design (UX) which applies Bauhaus principles — good design serves users — to digital products.',
              highlight: 'orange',
            },
            {
              label: 'VCE Application: Identifying Bauhaus Influence',
              text: 'When analysing a design in an exam, Bauhaus-influenced design shows: geometric or near-geometric forms, limited primary colour palette or achromatic, sans-serif or minimally decorated typography, grid-based geometric organisation, and emphasis on the relationship between form and function. Look for this in technology branding, modernist architecture and interior design, minimalist packaging, and "flat design" digital interfaces.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What was the central educational philosophy of the Bauhaus that made it revolutionary?', a: 'The Bauhaus rejected the historic separation between "fine art" and "applied art" — it merged painting, sculpture, graphic design, furniture, metalwork and architecture into an integrated design education. Students learned both artistic principles and craft/industrial production skills.' },
            { q: 'How is the Bauhaus principle of "form follows function" visible in contemporary Apple product design?', a: 'Apple products are designed so that their appearance is determined by their functional requirements — minimal physical controls, rounded corners to prevent injury, materials chosen for tactile quality, interfaces stripped to essential interactions. No decorative elements exist without functional purpose — this directly embodies the Bauhaus philosophy.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h01-s2',
        type: 'worked-example',
        title: 'Swiss International Style: The Grid as Design Law',
        teacherNote: 'Swiss Style is the direct ancestor of modern corporate identity design. Students see it every day without realising it — Helvetica is literally everywhere.',
        imagePrompt: 'Swiss International Style design poster showing grid layout asymmetric composition Helvetica typography photography photomontage clean modernist design historical',
        content: {
          heading: 'Swiss International Style (1950s–1960s): Clarity Above All',
          body: [
            {
              label: 'Origins and Key Principles',
              text: 'Emerging in Switzerland and Germany post-WWII (key figures: Josef Müller-Brockmann, Armin Hofmann, Emil Ruder at the Basel School of Design), Swiss Style formalised and extended Bauhaus principles into a rigorous system. Core tenets: mathematical grid systems, objective information presentation (design should communicate clearly, not express the designer\'s personality), sans-serif typography (particularly Helvetica, designed 1957 by Max Miedinger), photographic imagery over illustration, and asymmetric layouts within grid structures.',
              highlight: 'blue',
            },
            {
              label: 'Helvetica and the Neutral Typeface',
              text: 'Helvetica (Latin for "Swiss") was designed to be the ideal neutral typeface — perfectly legible, culturally neutral, applicable to any context. By the 1960s-70s it was adopted by: New York City Transit Authority (subway signage), Lufthansa, American Airlines, NASA, the US federal government, Toyota, and hundreds of corporations worldwide. Its near-neutrality made it the universal visual language of modernist corporate identity — if you saw Helvetica, you knew the organisation considered itself serious and rational.',
              highlight: 'green',
            },
            {
              label: 'The Grid in Swiss Design',
              text: 'Josef Müller-Brockmann\'s 1961 book "Grid Systems in Graphic Design" became the foundational text of the field. His principle: the grid is not a limitation but a creative tool — it provides structure within which visual problems can be solved systematically. Swiss design layouts are highly ordered but not static: photography, typography and white space are combined with dramatic asymmetry within the grid structure. The result: compositions feel dynamic and organised simultaneously.',
              highlight: 'orange',
            },
            {
              label: 'VCE Application: Swiss Style Influence',
              text: 'Swiss-influenced design is characterised by: dominant grid structure, Helvetica or similar neutral grotesque typefaces, black-and-white photography, generous white space, limited colour (often one accent colour + black/white), and asymmetric placement within a grid. Visible in: corporate annual reports, government communications, international wayfinding (airports, hospitals), and contemporary minimal brand identities that reference Swiss heritage.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'Why was Helvetica so widely adopted by corporations and governments in the 1960s and 1970s?', a: 'Helvetica was designed to be maximally neutral — no strong stylistic associations, highly legible, culturally neutral enough to work across different contexts and countries. For large organisations communicating to diverse audiences, this neutrality was ideal: it projected rational professionalism without triggering cultural or aesthetic associations.' },
            { q: 'What is Josef Müller-Brockmann\'s argument for the grid as a creative tool rather than a limitation?', a: 'Müller-Brockmann argued that the grid provides a systematic structure for solving visual problems — it does not dictate what content looks like, but where it goes. Within this constraint, designers have complete creative freedom for typography, imagery and colour. The constraint of structure actually liberates creativity by eliminating arbitrary placement decisions.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h01-s3',
        type: 'quiz',
        title: 'Quiz: Bauhaus and Swiss Style',
        teacherNote: 'Connect historical knowledge to contemporary examples students recognise — abstract design history only sticks when grounded in things students see daily.',
        questions: [
          { id: 'vcd-vce-h01-q1', text: 'The Bauhaus school was founded in 1919 by:', image: null, options: ['Josef Müller-Brockmann', 'Walter Gropius', 'Max Miedinger', 'Herbert Bayer'], correct: 1, explanation: 'Walter Gropius founded the Bauhaus in Dessau, Germany in 1919. He was an architect who believed all design disciplines — architecture, furniture, typography, metalwork — should be unified under a single philosophy.' },
          { id: 'vcd-vce-h01-q2', text: 'The Bauhaus principle "form follows function" means:', image: null, options: ['All functional objects must look the same', 'The aesthetic form of a designed object should emerge from its purpose, not be applied decoratively', 'Function is more important than aesthetics in all design', 'Objects should be designed for factories, not people'], correct: 1, explanation: 'Form follows function means that a designed object\'s appearance should be determined by what it needs to do — its function. Decorative elements that don\'t serve the function are removed. The result is often beautiful in its simplicity.' },
          { id: 'vcd-vce-h01-q3', text: 'Helvetica typeface was designed in 1957 by Max Miedinger for Swiss International Style. It became globally dominant primarily because:', image: null, options: ['It was the most decorative typeface available', 'It expressed the designer\'s personal vision', 'Its near-neutrality made it applicable to any organisation or cultural context — an objective, rational visual language', 'It was the cheapest typeface to license'], correct: 2, explanation: 'Helvetica\'s strength was its lack of strong stylistic associations — it communicated clarity and rationality without suggesting any particular cultural identity. This made it ideal for global organisations communicating across diverse audiences.' },
          { id: 'vcd-vce-h01-q4', text: 'Swiss International Style is primarily associated with which of these design characteristics?', image: null, options: ['Ornamental decoration, serif typefaces, symmetrical layout', 'Grid systems, sans-serif typography, objective imagery, asymmetric composition', 'Hand-drawn illustration, warm colour palettes, historical references', 'Decorative borders, mixed typefaces, centred layout'], correct: 1, explanation: 'Swiss International Style is defined by its systematic approach: mathematical grids, neutral grotesque typefaces (especially Helvetica), objective photographic imagery over illustration, and asymmetric placement within ordered grid structures.' },
        ],
      },
      {
        id: 'vcd-vce-h01-s4',
        type: 'worked-example',
        title: 'Postmodernism: Breaking the Rules',
        teacherNote: 'Postmodern design is harder for students to analyse because it intentionally breaks rules — the key is understanding WHICH rules it breaks and WHY. This is where design theory becomes genuinely interesting.',
        imagePrompt: 'postmodern design examples showing mixed typefaces layered images historical references vibrant colours rule-breaking composition David Carson Wolfgang Weingart style',
        content: {
          heading: 'Postmodernism: When Rules Became the Enemy',
          body: [
            {
              label: 'The Rejection of Modernism',
              text: 'Postmodernism emerged in the 1960s-70s as a critique of Modernism\'s confidence that there was one "correct" solution to any design problem. Where Modernists claimed objectivity and universality, Postmodernists saw ideology disguised as rationality — Swiss Style\'s "neutral" grid was actually a very particular cultural preference. Key argument: there is no single truth, no universal aesthetic standard. Communication design should embrace complexity, ambiguity, historical reference, and multiple simultaneous meanings.',
              highlight: 'blue',
            },
            {
              label: 'Postmodern Visual Language',
              text: 'Wolfgang Weingart (Basel, 1970s): began layering type, deliberately breaking grid rules, mixing typefaces, exploring how "mistakes" could become expressive. April Greiman (USA, 1980s): embraced early computer aesthetics, layered imagery, rough pixels. David Carson (Ray Gun magazine, 1990s): extreme typographic rule-breaking — columns laid over each other, text set backwards, letters distorted to communicate the chaos and energy of alternative music culture. The content of Carson\'s designs was often deliberately illegible — making reading an active, physical effort rather than passive absorption.',
              highlight: 'green',
            },
            {
              label: 'Historical Reference in Postmodern Design',
              text: 'Postmodern design freely samples historical design styles — Victorian ornament appears in contemporary posters, Art Deco letterforms are used irronically, classical column proportions are subverted. Robert Venturi\'s Las Vegas architecture celebrates the "vulgar" commercial strip. Designers mix classical and vernacular with full awareness of the cultural references being activated. This requires visual literacy — understanding what historical styles meant before you can use them deliberately.',
              highlight: 'orange',
            },
            {
              label: 'Contemporary Relevance',
              text: 'Postmodern design thinking underpins much of contemporary design culture: the acceptance of multiple valid solutions to a design problem, the use of vernacular and folk design elements in contemporary work, the embrace of imperfection and the handmade, the collage aesthetic of social media, and the deliberate rule-breaking of contemporary brand "anti-design" (Supreme\'s simple red box logo is postmodern in its deliberate simplicity and irony). Understanding postmodernism helps designers make intentional, contextually aware choices rather than defaulting to rules.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What was the fundamental philosophical objection of Postmodern designers to the Swiss International Style?', a: 'Postmodern designers argued that Swiss Style\'s claim to objectivity and neutrality was false — that the grid and Helvetica were not universal truths but a particular cultural preference being presented as universal law. There is no single correct solution to a design problem; all design communicates ideological values, even when it claims to be neutral.' },
            { q: 'Why did David Carson deliberately make some text in Ray Gun magazine difficult to read?', a: 'Carson used illegibility as expression — making reading an active, physical effort communicated the challenging, rule-breaking culture of the alternative music the magazine covered. If the content was difficult to absorb passively, readers had to actively engage, which matched the attitude of the music and audience. Form and content became unified: the way it looked matched what it was about.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h01-s5',
        type: 'quiz',
        title: 'Quiz: Postmodernism and Design History in Context',
        teacherNote: 'Design history questions appear in VCE Section B. Students must be able to connect movements to specific visual characteristics and philosophical positions.',
        questions: [
          { id: 'vcd-vce-h01-q5', text: 'Postmodern design is best characterised by:', image: null, options: ['Strict grid adherence, one typeface, objective imagery', 'Mixing typefaces and styles, historical references, rule-breaking, embrace of complexity and multiple meanings', 'Primary colours and geometric forms only', 'Complete rejection of typography'], correct: 1, explanation: 'Postmodernism in design embraces complexity, contradiction, historical reference, and the idea that multiple approaches can be valid simultaneously — the direct opposite of Modernism\'s belief in one correct solution.' },
          { id: 'vcd-vce-h01-q6', text: 'Which statement correctly positions the historical relationship between Bauhaus and Swiss International Style?', image: null, options: ['Swiss Style preceded the Bauhaus and influenced it', 'Swiss International Style extended and formalised Bauhaus principles into systematic grid-based graphic design practice in the 1950s-60s', 'They are completely unrelated movements from different countries', 'Swiss Style rejected all Bauhaus principles'], correct: 1, explanation: 'Swiss International Style built directly on Bauhaus foundations — taking Bauhaus principles of geometric rationality, sans-serif typography and functional design and developing them into a comprehensive, systematic approach to graphic communication with rigorous grid theory.' },
          { id: 'vcd-vce-h01-q7', text: 'A contemporary poster uses Victorian-era ornamental borders combined with grunge textures and mixed typefaces referencing the 1960s. This visual approach is best described as:', image: null, options: ['Bauhaus-inspired', 'Swiss International Style', 'Postmodern — it deliberately samples and mixes historical styles for expressive and cultural meaning', 'Functional design'], correct: 2, explanation: 'The deliberate mixing of historical references (Victorian ornament + 1960s typography + grunge aesthetic) is a postmodern strategy — it uses visual history as a vocabulary, combining elements from different periods with awareness of their original contexts.' },
        ],
      },
      {
        id: 'vcd-vce-h01-s6',
        type: 'free-response',
        title: 'Design History: Connect to Your Own Design Context',
        teacherNote: 'Design history only becomes meaningful when students can connect it to what they see and make today — push them to find genuine contemporary examples.',
        prompt: 'Choose ONE design movement (Bauhaus, Swiss International Style, or Postmodernism) and identify a contemporary brand or designer whose work shows clear influence from that movement.',
        fields: [
          {
            id: 'movement',
            label: 'Which movement are you analysing and what are its key visual principles?',
            placeholder: 'e.g. Bauhaus — form follows function, geometric primary forms, sans-serif typography, rational problem-solving...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'contemporary',
            label: 'Which contemporary brand/designer shows this influence, and what specific visual evidence can you identify?',
            placeholder: 'e.g. Apple — the Bauhaus influence is visible in the functional minimalism of product design, the use of neutral sans-serif typography (San Francisco typeface), primary colour use in brand campaigns, and the consistent principle that form should emerge from function...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'why',
            label: 'Why do you think this movement\'s principles still resonate with contemporary audiences?',
            placeholder: 'e.g. Bauhaus principles of functional simplicity resonate because modern consumers are overwhelmed by complexity — a simple, purposeful product feels like relief. The movement\'s values align with contemporary values around sustainability (only what is necessary) and user experience...',
            multiline: true,
            minRows: 3,
          },
        ],
      },
    ],
  },

  // ─── SESSION: DESIGN FIELDS AND CONTEXTS ─────────────────────────────────
  {
    id: 'vcd-vce-h02',
    subject: 'vcd',
    title: 'Design Fields: Communication, Industrial & Environmental',
    victorianCode: 'VCAA-VCD-FIELDS',
    description: 'Understand the three VCE VCD design fields — communication, industrial and environmental design — their defining characteristics, drawing methods and how to analyse work in each field.',
    yearLevel: 11,
    estimatedMinutes: 60,
    starsAvailable: 5,
    color: '#5b21b6',
    icon: '🏢',
    steps: [
      {
        id: 'vcd-vce-h02-s1',
        type: 'worked-example',
        title: 'The Three Design Fields in VCE VCD',
        teacherNote: 'Students often confuse design fields with subject matter — a product can be the subject of communication design (a product advertisement). The field is about the type of solution produced, not the topic.',
        imagePrompt: 'three design fields diagram showing communication design graphic poster branding, industrial design product chair packaging, environmental design architecture interior space, educational VCD poster',
        content: {
          heading: 'Three Fields, Three Types of Visual Solution',
          body: [
            {
              label: 'Communication Design',
              text: 'Communication design (also called graphic design) produces visual communications: posters, advertisements, brand identities, logos, packaging, books, magazines, signage, websites, apps, and motion graphics. The primary purpose is to communicate information, ideas or messages to an audience through visual means. Key concerns: audience, message, visual hierarchy, typography, imagery. Technical methods: digital and manual drawing, layout, typography, photography, illustration.',
              highlight: 'blue',
            },
            {
              label: 'Industrial Design',
              text: 'Industrial design produces physical objects and products: furniture, appliances, vehicles, medical devices, packaging structures, tools, and consumer electronics. The solution is a three-dimensional object that can be manufactured. Key concerns: ergonomics (how it fits the human body), materials (properties, cost, sustainability), manufacturing methods, form and function, aesthetics in three dimensions. Technical methods: working drawings (orthographic projection), three-dimensional visualisation (isometric, perspective), model making, and prototyping.',
              highlight: 'green',
            },
            {
              label: 'Environmental Design',
              text: 'Environmental design creates designed spaces and environments: architecture, interior design, exhibition design, set design, wayfinding systems, landscape design, retail environments, and public spaces. The solution is a space the viewer moves through and inhabits. Key concerns: spatial relationships, human movement and behaviour, materials and structures, lighting, how the space functions and feels over time. Technical methods: planometric drawing, architectural perspective, section drawings, and spatial visualisation.',
              highlight: 'orange',
            },
            {
              label: 'Overlapping Fields in Practice',
              text: 'Real-world design projects often span multiple fields. A retail store involves: environmental design (the spatial layout, fixtures, lighting), communication design (signage, packaging, in-store graphics), and industrial design (custom furniture, display fixtures, product design). In VCE VCD, the examination may include analysis of works from all three fields — students must be able to identify the field, apply appropriate analysis vocabulary, and understand the field-specific drawing conventions used.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'What distinguishes industrial design from communication design in terms of the type of solution produced?', a: 'Industrial design produces three-dimensional physical objects (products, furniture, packaging structures) that can be manufactured. Communication design produces visual communications (posters, logos, packaging graphics, websites) that convey information or messages to audiences through two-dimensional visual means.' },
            { q: 'What is "ergonomics" in industrial design and why is it a primary design consideration?', a: 'Ergonomics is the design of objects in relation to the human body — how a product fits, how it is held, how it can be operated comfortably over extended periods. Industrial design must consider the full range of human body dimensions and capabilities, because a product that causes discomfort or injury has failed fundamentally as a designed object.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h02-s2',
        type: 'quiz',
        title: 'Quiz: Design Fields',
        teacherNote: 'Students should be able to classify any design work by field and justify their classification.',
        questions: [
          { id: 'vcd-vce-h02-q1', text: 'A designer creates a wayfinding system for Melbourne Airport — with directional signage, floor graphics, and digital departure screens. This work belongs primarily to:', image: null, options: ['Industrial design', 'Communication design — wayfinding communicates spatial information to users through visual means', 'Environmental design', 'Both communication and environmental design simultaneously'], correct: 3, explanation: 'Wayfinding systems span communication design (the visual language of signs, maps and graphic elements) and environmental design (how those elements integrate into the spatial experience of the airport). The VCE study design acknowledges that design fields overlap in practice.' },
          { id: 'vcd-vce-h02-q2', text: 'A design brief asks for a new ergonomic office chair. This falls primarily within which design field?', image: null, options: ['Communication design', 'Industrial design — the deliverable is a three-dimensional manufactured object optimised for human use', 'Environmental design', 'Typography design'], correct: 1, explanation: 'Industrial design produces physical, manufacturable objects. An office chair is a three-dimensional product where ergonomics (fit to the human body), materials, manufacturing and aesthetic form are the primary design considerations.' },
          { id: 'vcd-vce-h02-q3', text: 'Environmental design is unique among the three fields because:', image: null, options: ['It only uses computer-aided design', 'The designed solution is a space that users inhabit and move through over time — the experience unfolds spatially and temporally', 'It only involves outdoor spaces', 'It requires the most artistic skill'], correct: 1, explanation: 'Environmental design creates immersive spaces — the designed experience unfolds as the user moves through the space over time. This is fundamentally different from a poster (viewed at a glance) or a product (used by one person at a time) — it is architecture, interior space, and landscape.' },
          { id: 'vcd-vce-h02-q4', text: 'Which drawing method is most appropriate for visualising an interior spatial design concept?', image: null, options: ['Isometric projection', 'Planometric drawing or one-point perspective — both show interior spaces effectively', 'Two-point exterior perspective', 'Oblique elevation'], correct: 1, explanation: 'Planometric (axonometric) drawing shows an interior from above at an angle, revealing both floor plan and vertical space simultaneously. One-point perspective is ideal for showing the experience of looking into a room or along a corridor — both are standard environmental design visualisation methods.' },
        ],
      },
      {
        id: 'vcd-vce-h02-s3',
        type: 'worked-example',
        title: 'Technical Drawing Conventions for Each Field',
        teacherNote: 'Technical drawing conventions are examined in Section A and Section C of the VCE exam. Students must recognise the drawing type and understand what it shows.',
        imagePrompt: 'technical drawing conventions chart showing isometric oblique planometric one-point two-point perspective drawings with labels, VCE visual communication design educational reference poster',
        content: {
          heading: 'Every Field Has Its Own Drawing Language',
          body: [
            {
              label: 'Paraline Drawing Methods (Non-Perspective)',
              text: 'Isometric drawing: both sides recede from a corner edge at 30° to the horizontal. All lines are parallel — they never converge. Accurate measurements can be taken in all three axes. Best for: industrial product visualisation. Planometric (axonometric): the base plan is rotated (typically 45/45° or 30/60°) with vertical walls drawn straight up. Best for: interior spaces, architectural environments. Oblique drawing: one face shown in true scale and shape; other dimensions recede at 45° at half or full scale. Best for: simple communication of form with one dominant face.',
              highlight: 'blue',
            },
            {
              label: 'Perspective Drawing Methods',
              text: 'One-point perspective: all horizontal receding lines converge to a single VP on the horizon. The viewer is looking straight at one face of the subject. Best for: interior spaces viewed head-on, corridors, rooms. Two-point perspective: the viewer is at a corner — two sets of receding lines go to two VPs on the horizon. Vertical lines remain vertical. Best for: exterior views of buildings and products, showing two faces simultaneously. Both require: a horizon line (viewer\'s eye level) and vanishing point(s) set with deliberate placement to avoid distortion.',
              highlight: 'green',
            },
            {
              label: 'Orthographic Projection',
              text: 'Orthographic projection shows an object from multiple directions simultaneously: front view (elevation), side view, top view (plan). These views are arranged in standard positions (first angle or third angle projection) so they can be read together to understand the complete three-dimensional form. Used in engineering and industrial design for manufacturing documentation — every surface, angle and dimension can be measured from an orthographic drawing. Unlike perspective, orthographic drawings have no visual distortion: all parallel lines remain parallel, all measurements are to scale.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'Why does isometric drawing use 30° angles for receding lines rather than convergent lines?', a: 'Isometric drawing is a paraline method — lines remain parallel and never converge. The 30° angles on all receding lines allow accurate measurements to be taken along all three axes simultaneously. Unlike perspective, where scale changes with distance, isometric maintains consistent scale throughout the drawing.' },
            { q: 'When would a designer choose one-point over two-point perspective?', a: 'One-point perspective is best when the viewer is looking directly at one face of the subject (looking down a corridor, into a room, or directly at the front of a product). Two-point perspective is better for corner views where two faces of an object or building are visible simultaneously, creating a more dynamic and realistic sense of three-dimensional form.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h02-s4',
        type: 'quiz',
        title: 'Quiz: Technical Drawing',
        teacherNote: 'Students should be able to identify drawing types from visual characteristics and select the appropriate method for a given purpose.',
        questions: [
          { id: 'vcd-vce-h02-q5', text: 'In isometric drawing, what angle do the receding side edges make with the horizontal?', image: null, options: ['45 degrees', '30 degrees', '60 degrees', '90 degrees (vertical)'], correct: 1, explanation: 'In isometric drawing, the two receding axes go at 30° to the horizontal, and the vertical axis is at 90°. This creates the characteristic angled-cube appearance of isometric projection.' },
          { id: 'vcd-vce-h02-q6', text: 'An architectural designer wants to show a client how a new kitchen layout will look when standing at the island bench and looking toward the window. The most appropriate drawing method is:', image: null, options: ['Isometric projection', 'Orthographic elevation', 'One-point perspective — it shows the interior as the viewer would actually see it from a fixed viewpoint', 'Oblique drawing'], correct: 2, explanation: 'One-point perspective creates the view from a fixed standing position looking straight ahead — exactly how the client would experience the space. The receding lines converge to a single VP, creating a realistic human-eye view of the interior.' },
          { id: 'vcd-vce-h02-q7', text: 'Orthographic projection is essential for manufacturing because:', image: null, options: ['It looks more realistic than perspective', 'All views are at correct, measurable scale with no perspective distortion — manufacturers can read exact dimensions from the drawing', 'It is the only drawing method accepted by governments', 'It is faster to produce than perspective drawing'], correct: 1, explanation: 'Orthographic projection shows front, side and top views with all lines at true scale — no convergence, no distortion. This means every measurement can be taken directly from the drawing, which is essential when manufacturing parts to precise specifications.' },
        ],
      },
      {
        id: 'vcd-vce-h02-s5',
        type: 'free-response',
        title: 'Design Field Analysis: Real Work',
        teacherNote: 'Students benefit from analysing work in fields they haven\'t chosen for their own folio — it builds critical vocabulary breadth.',
        prompt: 'Select ONE design work from EACH of the three fields (communication, industrial, environmental) — describe the work, identify the field, and explain what design considerations would have been central to its creation.',
        fields: [
          {
            id: 'communication',
            label: 'Communication Design example — what is it, who is the audience, what design elements/principles/considerations were central?',
            placeholder: 'e.g. The Greenpeace "Save the Arctic" campaign poster — audience: environmentally engaged citizens aged 20-50, central considerations: image selection, typographic hierarchy for the message, colour palette communicating urgency and environmental stakes...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'industrial',
            label: 'Industrial Design example — what is it, who is the user, what design considerations were central?',
            placeholder: 'e.g. The Herman Miller Aeron chair — user: office workers in sustained computer work sessions, central considerations: ergonomics (spinal support, adjustability for diverse body sizes), material selection (mesh for breathability), manufacturing methods, aesthetic form in an office context...',
            multiline: true,
            minRows: 4,
          },
          {
            id: 'environmental',
            label: 'Environmental Design example — what is it, who inhabits the space, what design considerations were central?',
            placeholder: 'e.g. Melbourne\'s Heide Museum of Modern Art gallery spaces — inhabitants: gallery visitors seeking cultural engagement, central considerations: how light enters the space, the experience of moving from one gallery to another, how wall colours and floor materials frame the artworks without competing...',
            multiline: true,
            minRows: 4,
          },
        ],
      },
      {
        id: 'vcd-vce-h02-s6',
        type: 'homework',
        title: 'Homework: Design Fields in Your Environment',
        teacherNote: 'Design is everywhere — this task asks students to look at their everyday environment with professional analytical eyes.',
        dueNext: false,
        tasks: [
          { id: 'hw1', label: 'Photograph three designed objects/spaces/communications in your immediate environment — one from each field — and annotate what makes each belong to its field', hint: 'Look at your phone (industrial design), a menu or sign (communication design), the room or building you are in (environmental design) — analyse each with field-specific vocabulary' },
          { id: 'hw2', label: 'Practise one type of technical drawing: complete an isometric drawing of a simple object (a book, a phone, a box of tissues)', hint: 'Set up the 30° angles with a set square or protractor — keep all parallel edges truly parallel and maintain consistent scale' },
          { id: 'hw3', label: 'Research one designer working in a field different from your folio project and write 150 words on what design considerations drive their work', hint: 'If your folio is communication design, research an industrial or environmental designer — understanding other fields deepens your design vocabulary' },
        ],
      },
    ],
  },

  // ─── SESSION: DESIGN PROCESS — DOUBLE DIAMOND ────────────────────────────
  {
    id: 'vcd-vce-h03',
    subject: 'vcd',
    title: 'The VCE Design Process: Discover, Define, Develop, Deliver',
    victorianCode: 'VCAA-VCD-PROC',
    description: 'Master the four-phase VCE VCD design process — Discover, Define, Develop, Deliver — and understand how each phase should be evidenced in your folio.',
    yearLevel: 11,
    estimatedMinutes: 60,
    starsAvailable: 5,
    color: '#5b21b6',
    icon: '🔄',
    steps: [
      {
        id: 'vcd-vce-h03-s1',
        type: 'worked-example',
        title: 'The Four-Phase Design Process',
        teacherNote: 'The VCAA study design uses the Double Diamond model adapted as Discover-Define-Develop-Deliver. Students must understand this is not linear — designers move between phases iteratively.',
        imagePrompt: 'design process diagram showing four phases discover define develop deliver with activities and outputs for each phase, VCE visual communication design educational poster clean layout',
        content: {
          heading: 'Design is Iterative, Not Linear',
          body: [
            {
              label: 'Phase 1: Discover',
              text: 'Discover is the research phase — understanding the problem before trying to solve it. Activities: user/audience research, brief analysis, competitor analysis, cultural context research, market research, field observation. Outputs in folio: annotated research, mood boards with annotations, audience profiles, site/context photographs, competitor analysis documentation. Key mindset: stay curious, avoid jumping to solutions — understand the problem deeply first.',
              highlight: 'blue',
            },
            {
              label: 'Phase 2: Define',
              text: 'Define synthesises research into a clear design brief and design opportunity statement. Activities: brief writing or refinement, identifying constraints and opportunities, defining success criteria, creating the design opportunity statement, choosing research that will genuinely inform design decisions. Outputs in folio: annotated brief, design opportunity statement, refined audience profiles, initial concept directions. Key mindset: crystallise what you now know into a clear design direction.',
              highlight: 'green',
            },
            {
              label: 'Phase 3: Develop',
              text: 'Develop is where design ideas are generated and refined. Activities: thumbnail sketching (quantity over quality — generate many ideas), concept development (select and develop 3-5 promising directions), refinement (iterative improvement of selected concepts), feedback (from teacher, target audience, or peers), documentation of development. Outputs in folio: thumbnails with annotations, developed concepts in presentation drawing, digital exploration, annotation of every significant decision, evidence of rejected directions. Key mindset: explore broadly, then converge on the most promising solution.',
              highlight: 'orange',
            },
            {
              label: 'Phase 4: Deliver',
              text: 'Deliver is the production and presentation of the final design solution. Activities: final production (digital or manual), presentation drawing (for product/environment), mockup photography (showing design in context), evaluation against brief and four VCAA criteria, final folio layout and annotation. Outputs in folio: final presentation-quality designs, evaluation statement, complete annotated folio pages. Key mindset: resolve everything — incomplete or unrefined final work signals the process didn\'t reach completion.',
              highlight: 'purple',
            },
          ],
          questions: [
            { q: 'Why is it important to complete thorough Discover and Define phases before beginning to generate design concepts?', a: 'Jumping to solutions before understanding the problem deeply risks solving the wrong problem or missing the most significant design opportunities. Research in Discover and synthesis in Define ensure that design concepts in Develop are genuinely responding to real needs and brief requirements — not just what the designer thought up first.' },
            { q: 'What evidence should a folio show in the Develop phase beyond just the final concepts that were kept?', a: 'The folio should show the full ideation process: thumbnail sketches showing many initial directions, concepts that were developed and then rejected (with annotation explaining why), iterative refinement showing how a concept changed with each version, and evidence of feedback received and how it influenced the design direction.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h03-s2',
        type: 'quiz',
        title: 'Quiz: The Design Process',
        teacherNote: 'Students often underestimate how much the folio should show — use these questions to calibrate their expectations.',
        questions: [
          { id: 'vcd-vce-h03-q1', text: 'A student completes their VCE folio showing only the final design solution with no sketches, research or developmental work. Their folio will:', image: null, options: ['Score highly — the final result is polished and professional', 'Score poorly — without evidence of all four design phases, the folio cannot demonstrate the design thinking process that is being assessed', 'Score average marks', 'Score well on delivery but poorly on other criteria'], correct: 1, explanation: 'VCE VCD folio assessment is explicitly process-based — examiners need to see all four phases. A folio showing only final outcomes cannot demonstrate design thinking, research, development, iteration or evaluation.' },
          { id: 'vcd-vce-h03-q2', text: 'The "Define" phase of the design process primarily involves:', image: null, options: ['Drawing final concepts', 'Synthesising research into a clear brief and design opportunity statement — crystallising understanding of the problem before generating solutions', 'Photographing the final design mockup', 'Researching competitors'], correct: 1, explanation: 'Define bridges research (Discover) and design generation (Develop). It synthesises everything learned in research into clear design criteria, a refined brief, and a design opportunity statement that will guide concept development.' },
          { id: 'vcd-vce-h03-q3', text: 'In the Develop phase, why should thumbnail sketching prioritise quantity over quality initially?', image: null, options: ['Because thumbnails are not assessed', 'To generate a wide range of possibilities before narrowing down — early design thinking is exploratory; judging ideas too early limits creative potential', 'Because sketching is faster than digital drawing', 'To show the examiner you can draw quickly'], correct: 1, explanation: 'Divergent thinking (generating many ideas) must precede convergent thinking (selecting and refining the best). Judging and eliminating ideas too early closes off possibilities before they\'ve been explored — quantity in thumbnails creates the raw material from which good ideas are selected.' },
          { id: 'vcd-vce-h03-q4', text: 'The Deliver phase culminates in which outputs that must appear in the folio?', image: null, options: ['Research documentation and brief analysis', 'Thumbnail sketches and rejected concepts', 'Final presentation-quality design solutions, contextual mockups, and an evaluation against brief requirements and VCAA criteria', 'Competitor analysis'], correct: 2, explanation: 'Deliver produces the final outcomes: polished, complete design solutions in appropriate presentation quality, mockups showing the design in its real-world context, and a rigorous evaluation against the brief\'s requirements and the four VCAA criteria.' },
        ],
      },
      {
        id: 'vcd-vce-h03-s3',
        type: 'worked-example',
        title: 'Evidencing the Process in Your Folio',
        teacherNote: 'Many students understand the design process conceptually but don\'t translate it into folio evidence. This session bridges theory and practice.',
        imagePrompt: 'VCE design folio spread showing all four phases side by side research mood board sketches developed concepts final design with process annotations',
        content: {
          heading: 'What Evidence Does Each Phase Need?',
          body: [
            {
              label: 'Discover: What to Show',
              text: 'Annotated mood board (each image with a note explaining why it was selected and what it will influence), annotated screenshots or photographs of competitor designs (what visual choices did they make and why?), audience research (profile, demographic/psychographic data with sources), brief analysis with constraints and opportunities highlighted in different colours, context photographs if designing for a specific location.',
              highlight: 'blue',
            },
            {
              label: 'Define and Develop: What to Show',
              text: 'Written design opportunity statement (the paragraph beginning "This brief presents an opportunity to design..."). At least 8-12 thumbnail sketches per major element (logo, layout, etc.) showing genuinely different directions — not variations on one idea. Annotated selection criteria for which thumbnails were developed further and why the others were rejected. 3-5 developed concepts with detailed annotation. At least 2 rounds of visible refinement per concept.',
              highlight: 'green',
            },
            {
              label: 'Deliver: What to Show',
              text: 'Final design presentation in high quality — appropriate file format, correct dimensions per brief specifications, correct colour mode. Contextual mockups showing how the design appears in actual use (the poster on a wall, the packaging on a shelf, the app on a phone screen). A written evaluation addressing all four VCAA criteria (functional, aesthetic, cultural, environmental) with specific, justified statements about the design\'s success and where it could be improved.',
              highlight: 'orange',
            },
          ],
          questions: [
            { q: 'What makes a contextual mockup important for the Deliver phase?', a: 'A contextual mockup shows how the design looks in its real-world environment — a poster on a wall, packaging on a store shelf, an app on a phone screen. This demonstrates the designer has considered how the design will actually be experienced, and allows evaluation of whether it works in context, not just as an isolated design element.' },
            { q: 'Why is a written evaluation essential in the Deliver phase?', a: 'The evaluation demonstrates that the designer can assess their own work critically against defined criteria — not just say "I like it" but systematically consider whether it is functional, aesthetically appropriate, culturally sensitive, and environmentally responsible. This critical self-assessment is a core professional design skill and is directly assessed in VCE.' },
          ],
        },
      },
      {
        id: 'vcd-vce-h03-s4',
        type: 'free-response',
        title: 'Process Self-Assessment',
        teacherNote: 'Honest self-assessment is more valuable than positive self-assessment. Push students to identify genuine gaps.',
        prompt: 'Review your current folio project against the four design process phases. Honestly assess the evidence you have for each phase.',
        fields: [
          {
            id: 'discover',
            label: 'Discover phase: What research have you documented? What is missing?',
            placeholder: 'e.g. I have a mood board with 12 images but only 4 are annotated. I have not yet documented my target audience research or competitor analysis. Missing: annotated audience profile, competitor visual analysis...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'develop',
            label: 'Develop phase: How many thumbnail concepts did you generate? How many rounds of refinement can you show?',
            placeholder: 'e.g. I have 6 logo thumbnails but only 2 annotated. I have 1 developed concept that went directly to final with no visible refinement iteration. I need to add: more thumbnails, annotated selection criteria, at least 1-2 more visible refinement rounds...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'deliver',
            label: 'Deliver phase: Do you have final work at appropriate quality? Have you written a four-criteria evaluation?',
            placeholder: 'e.g. My final poster is at correct dimensions but not yet in CMYK. I have no contextual mockup and no formal evaluation — these are my two biggest current gaps...',
            multiline: true,
            minRows: 3,
          },
          {
            id: 'priority',
            label: 'What are your top 3 priority actions to strengthen your folio process evidence?',
            placeholder: 'e.g. 1. Annotate all mood board images this week. 2. Add 8 more thumbnail concepts with selection annotation. 3. Complete a four-criteria evaluation of my current best design...',
            multiline: true,
            minRows: 3,
          },
        ],
      },
      {
        id: 'vcd-vce-h03-s5',
        type: 'homework',
        title: 'Homework: Strengthen the Weakest Process Phase',
        teacherNote: 'Students who identify and address their weakest folio phase before assessment make the most improvement. Specific action plans outperform general good intentions.',
        dueNext: true,
        tasks: [
          { id: 'hw1', label: 'Based on your self-assessment, complete the highest-priority missing process element in your folio', hint: 'Be specific: if you need more thumbnails, generate at least 8 new genuine concepts, not variations of what you already have. If you need audience research, create a proper audience profile with demographic and psychographic detail.' },
          { id: 'hw2', label: 'Write a full design opportunity statement for your current project if you don\'t have one', hint: 'Format: "This brief presents an opportunity to design [deliverable(s)] that [purpose] for [specific audience] by [design approach]. The key design challenge is [challenge]." Write it then use it to evaluate each design decision you make.' },
          { id: 'hw3', label: 'Write a draft evaluation of your current best design concept against all four VCAA criteria (functional, aesthetic, cultural, environmental)', hint: 'Be genuinely critical — identifying weaknesses demonstrates design thinking maturity. Examiners reward honest evaluation over self-congratulation.' },
        ],
      },
    ],
  },
];
