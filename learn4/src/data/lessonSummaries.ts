// Lesson-specific parent summaries — used by LessonFeedback to make each
// report sound like it came from that lesson specifically, not a template.
// Each entry: { en, zh } — what was covered + why it matters (combined naturally).

export const lessonSummaries: Record<string, { en: string; zh: string; futureEn: string; futureZh: string }> = {

  // ── Year 4 English ──────────────────────────────────────────────────────────

  'y4-eng-01': {
    en: `This week in English we focused on narrative story structure — the three-part framework every great story uses: orientation (introducing the characters and setting), complication (the problem that disrupts the world), and resolution (how the problem is solved). We worked through a model story called "The Missing Footy" and practised identifying each part before planning their own story structure.`,
    zh: `这周英语课上，我们学习了叙述文的三段式结构：开端（介绍人物和背景）、冲突（打破故事世界的问题）和结局（问题如何被解决）。课堂上我们通过一个叫"The Missing Footy"的示范故事，一起分析了每个部分，并练习了独立规划自己的故事结构。`,
    futureEn: `Understanding story structure is the backbone of all creative writing. Once a student internalises orientation–complication–resolution, they have a reliable scaffold they can use for every narrative they write through primary school and beyond. It also sharpens reading comprehension — they begin to notice how authors build tension and resolve it.`,
    futureZh: `叙述文结构是所有创意写作的骨架。一旦学生真正理解了"开端—冲突—结局"这个框架，他们在之后所有的写作中都有一个可靠的支撑。这也有助于提升阅读理解能力——他们会开始注意到作者是如何构建张力并解决冲突的。`,
  },

  'y4-eng-02': {
    en: `This week in English we worked on character development — how authors make characters feel real and memorable. We explored the idea that strong characters have clear wants and believable flaws, and we practised the "Show Don't Tell" technique: instead of writing "Mia was nervous", we worked on describing what nervousness looks like from the outside — the shaking hands, the dry mouth, the short breaths.`,
    zh: `这周英语课上，我们学习了人物塑造——作者如何让笔下的人物感觉真实而令人难忘。我们探讨了优秀人物需要有清晰的内心渴望和真实的性格缺陷，并且练习了"Show Don't Tell（展示而非讲述）"的写作技巧：不直接写"Mia很紧张"，而是描写紧张在外表上呈现的样子——颤抖的手、干燥的喉咙、急促的呼吸。`,
    futureEn: `The ability to write convincing characters is one of the highest-order skills in creative writing. "Show Don't Tell" in particular is a technique that strong writers use right through to senior school and beyond — it's what separates flat, telling prose from vivid, immersive writing. Building this habit early makes a significant difference.`,
    futureZh: `写出令人信服的人物是创意写作中最高阶的技巧之一。"Show Don't Tell"这个技巧是优秀写作者从小学一直用到高中乃至更高阶段的核心方法——它是平淡叙述与生动沉浸式写作之间的关键差异。从小培养这个习惯会产生非常显著的长期影响。`,
  },

  'y4-eng-03': {
    en: `This week in English we focused on setting and atmosphere — how authors use the five senses to bring a place to life on the page. We looked at examples from Australian bush and beach settings, and practised using similes and metaphors to make descriptions more vivid. The lesson challenged students to write a paragraph where a reader could almost feel the heat, smell the eucalyptus, or hear the waves without being told what the setting is.`,
    zh: `这周英语课上，我们学习了场景描写和氛围营造——作者如何运用五种感官让一个地方在文字中栩栩如生。我们通过澳大利亚丛林和海滩的场景案例，练习了用明喻和隐喻让描写更加生动。课堂上要求学生写一段话，让读者不用被告知地点，就能从文字中感受到那里的炎热、闻到桉树的气息，或者听到海浪的声音。`,
    futureEn: `Descriptive writing is one of the most frequently assessed skills across all years of primary and secondary school. The ability to use sensory language and figurative techniques — simile, metaphor, personification — directly lifts the quality of any piece of writing, whether it's a narrative, a poem, or even an essay.`,
    futureZh: `描写性写作是小学和中学各年级中最常被评估的写作技能之一。运用感官语言和修辞手法——明喻、隐喻、拟人——的能力，会直接提升任何类型文章的质量，无论是叙述文、诗歌还是说明文。`,
  },

  'y4-eng-04': {
    en: `This week in English we covered dialogue and speech punctuation — the six key rules that govern how spoken words appear on the page. We worked through a model story called "The Shortcut", identifying how speech marks, commas, new paragraphs and reporting verbs (whispered, demanded, replied) are used together. Students then practised writing their own short dialogue scenes following the same rules.`,
    zh: `这周英语课上，我们学习了对话和引号标点——管理口语文字如何在书面呈现的六个核心规则。我们通过一个叫"The Shortcut"的示范故事，分析了引号、逗号、新段落以及报告动词（whispered、demanded、replied等）是如何配合使用的。学生随后练习了按照相同规则写出自己的简短对话场景。`,
    futureEn: `Correct dialogue punctuation is a specific skill that is directly assessed in primary school writing tasks — it's one of the clearest markers examiners use to differentiate writing levels. Beyond that, knowing how to write convincing dialogue is essential for narrative writing throughout all of primary and secondary school.`,
    futureZh: `正确的对话标点是小学写作任务中被直接评估的具体技能之一——它是评卷老师区分写作水平的最清晰标志之一。除此之外，能够写出生动的对话对整个小学和中学阶段的叙述文写作都至关重要。`,
  },

  'y4-eng-05': {
    en: `This week in English we worked on informative report writing, using the thorny devil lizard as a model topic. We looked at the structure of a report — general classification, physical description, habitat, diet and behaviour — and practised distinguishing between facts and opinions, and using formal, impersonal language. Students also worked on identifying what makes a piece of writing sound like a report rather than a story.`,
    zh: `这周英语课上，我们以澳大利亚的刺角蜥蜴为模型主题，学习了信息报告的写作方法。我们分析了报告的结构——总体分类、外形描述、栖息地、食物和行为——并练习了区分事实与观点，以及使用正式、客观的语言。学生还练习了识别什么样的文字风格像是报告而不是故事。`,
    futureEn: `Informative report writing is one of the most important non-fiction forms students will encounter — it underpins science reports, history essays, and research tasks right through to Year 12. Learning to distinguish facts from opinions and write in an objective, formal register are skills that transfer across every subject.`,
    futureZh: `信息报告写作是学生在学习过程中接触最多的非虚构文体之一——它支撑着科学报告、历史小论文以及一直到高中的各类研究任务。学会区分事实与观点、用客观正式的语气写作，是可以迁移到所有学科的重要能力。`,
  },

  'y4-eng-06': {
    en: `This week in English we focused on explanatory texts — the type of writing that answers "how" and "why" questions. We studied the structure of an explanation (phenomenon → sequence of causes and effects → summary) using the water cycle as an example, and practised using cause-and-effect language such as "this causes", "as a result" and "which means that". Students also worked on creating a simple flow chart to organise their explanation before writing.`,
    zh: `这周英语课上，我们学习了说明文——回答"如何"和"为什么"问题的文体。我们以水循环为例，研究了说明文的结构（现象→一系列因果关系→总结），并练习了使用因果连接语言，如"this causes"、"as a result"和"which means that"。学生还练习了在写作前用流程图整理说明内容。`,
    futureEn: `Explanatory writing is a crucial skill across science and HASS. Being able to explain a process clearly and logically — using proper cause-and-effect language and a structured sequence — is exactly what's required in science investigation reports and geography tasks. This lesson directly builds those cross-curricular skills.`,
    futureZh: `说明文写作是科学和人文社会学科中的核心能力。能够清晰、有逻辑地解释一个过程——使用正确的因果语言和有序的结构——正是科学调查报告和地理任务所要求的。这节课直接培养了跨学科的写作能力。`,
  },

  // ── Year 4 Maths ───────────────────────────────────────────────────────────

  'y4-mat-01': {
    en: `This week in Maths we covered place value up to 10,000. We worked on understanding what each digit means in a four-digit number — the ones, tens, hundreds and thousands — and practised writing numbers in expanded form (e.g. 3,472 = 3,000 + 400 + 70 + 2). We also compared and ordered large numbers using real AFL crowd figures as context, which helped make the concept concrete.`,
    zh: `这周数学课上，我们学习了万以内数的位置值。我们深入理解了四位数中每个数字代表的含义——个位、十位、百位和千位——并练习了用展开式表示数字（例如3,472 = 3,000 + 400 + 70 + 2）。我们还用AFL比赛的真实观众人数作为情境，比较和排列大数，这让抽象的数字概念变得更加具体。`,
    futureEn: `Place value is the single most important foundation in primary school mathematics. A student's ability to understand, compare and work flexibly with large numbers underpins every area of maths that follows — written addition and subtraction, multiplication, division, decimals and percentages. Getting this right now saves a lot of difficulty later.`,
    futureZh: `位置值是小学数学中最重要的基础之一。学生理解、比较和灵活运用大数的能力，支撑着之后数学学习中的每一个领域——竖式加减法、乘法、除法、小数和百分数。现在打好这个基础，能为之后的学习节省大量时间和精力。`,
  },

  'y4-mat-02': {
    en: `This week in Maths we explored addition strategies for larger numbers. We practised three approaches: the jump strategy (jumping forward on a number line in manageable steps), the split strategy (breaking each number into hundreds, tens and ones and adding each part separately), and the standard algorithm (the written column method with carrying). Students worked on knowing when each strategy is most efficient.`,
    zh: `这周数学课上，我们学习了大数加法的多种策略。我们练习了三种方法：跳跃策略（在数线上分步向前跳跃）、分拆策略（将每个数拆分成百、十、个位分别相加）以及竖式算法（标准的进位笔算方法）。学生练习了判断在不同情境下哪种策略最高效。`,
    futureEn: `Understanding multiple addition strategies — rather than just memorising one method — gives students genuine mathematical flexibility. This flexibility becomes essential when they encounter algebra, where being able to rearrange and decompose numbers mentally is a key skill. The written algorithm with carrying also directly prepares them for multi-digit multiplication.`,
    futureZh: `掌握多种加法策略——而不是只记住一种方法——让学生具备真正的数学灵活性。这种灵活性在代数学习中至关重要，因为能够在脑中拆解和重组数字是一项核心技能。进位竖式算法也直接为之后的多位数乘法打下基础。`,
  },

  'y4-mat-03': {
    en: `This week in Maths we focused on subtraction strategies. We worked on counting back on a number line, finding the difference by counting up (which is especially useful when the numbers are close together), and the trading method in the written algorithm — where we exchange a ten for ten ones when the top digit isn't big enough to subtract from. We used shopping scenarios to make the strategies feel practical.`,
    zh: `这周数学课上，我们学习了减法策略。我们练习了在数线上向后数的方法、用向上数来求差（当两个数比较接近时特别有用）以及笔算中的借位方法——当上面的数字不够减时，从高位借一当十用。我们用购物场景让这些策略更加贴近实际生活。`,
    futureEn: `Subtraction is foundational for problem solving, measurement, data and financial mathematics throughout primary school. The trading (borrowing) algorithm in particular is directly used in multi-digit division and will appear again in decimal subtraction. Understanding why the algorithm works — not just how — makes it far more durable.`,
    futureZh: `减法是整个小学阶段解决问题、测量、数据处理和财务数学的基础。借位算法尤其会在多位数除法中直接用到，在小数减法中也会再次出现。理解算法背后的原理——而不只是步骤——会让学生对这些知识的掌握更加扎实持久。`,
  },

  'y4-mat-04': {
    en: `This week in Maths we worked on multiplication from the 2 to 10 times tables. We used arrays (rows and columns of objects) to visualise what multiplication means, explored the commutative property (that 4×6 gives the same result as 6×4), and practised the breakdown strategy for harder facts — for example, solving 7×8 by thinking of it as 7×4 doubled.`,
    zh: `这周数学课上，我们系统学习了2到10的乘法口诀。我们用阵列（行和列排列的物体）来形象化乘法的含义，探索了交换律（4×6和6×4结果相同），并练习了用分解策略处理较难的乘法——例如，把7×8想成7×4再加倍来计算。`,
    futureEn: `Confident multiplication knowledge is the gateway to almost every area of upper primary mathematics — long multiplication, division, fractions, area, rates and ratio all depend on it. The breakdown strategy also directly seeds algebraic thinking, where students will later decompose expressions in the same way.`,
    futureZh: `熟练掌握乘法口诀是进入小学高年级数学几乎所有领域的入口——长乘法、除法、分数、面积、速率和比例都依赖于此。分解策略也直接播下了代数思维的种子，学生之后会用完全相同的方式来拆解代数表达式。`,
  },

  'y4-mat-05': {
    en: `This week in Maths we explored division through two different lenses: sharing (splitting a total equally among a number of groups) and grouping (working out how many equal groups fit into a total). We looked at fact families to show the link between multiplication and division, and introduced remainders — what happens when a total doesn't divide evenly — using real-life examples like distributing fruit at lunch.`,
    zh: `这周数学课上，我们从两个角度学习了除法：平均分（将总数平均分给若干组）和分组（算出总数里能包含多少个相等的组）。我们通过乘除法族来展示乘法和除法之间的关系，并引入了余数的概念——当总数不能被整除时会发生什么——用午餐分发水果这样的生活情景来帮助理解。`,
    futureEn: `Division with remainders is a concept students will use constantly — in fractions (what is 17 ÷ 4 as a mixed number?), in time problems, in data (finding averages) and in everyday situations. Understanding the relationship between multiplication and division also makes learning long division far more intuitive when it's introduced in Year 5.`,
    futureZh: `带余数除法是学生在之后学习中会不断用到的概念——在分数（17÷4等于几又几分之几？）、时间问题、数据处理（求平均数）以及日常生活中都会出现。理解乘法和除法之间的关系，也会让五年级引入长除法时变得更加直观易懂。`,
  },

  'y4-mat-06': {
    en: `This week in Maths we introduced fractions — what the numerator and denominator each mean, how to name fractions, and how to place them on a number line. We worked with halves, thirds, quarters, fifths, sixths and eighths, and explored equivalent fractions by looking at which fractions land on the same point on the number line (for example, that 2/4 and 1/2 are the same size).`,
    zh: `这周数学课上，我们开始学习分数——分子和分母各自的含义、如何命名分数，以及如何在数线上标出分数的位置。我们学习了二分之一、三分之一、四分之一、五分之一、六分之一和八分之一，并通过数线探索了等值分数——哪些分数落在同一个点上（例如2/4和1/2其实是同一个大小）。`,
    futureEn: `Fractions are one of the most important — and most commonly struggled with — areas of primary mathematics. The conceptual understanding built here, of what a fraction actually represents and where it sits relative to a whole, is the foundation for fraction operations (adding, subtracting, multiplying), decimals, percentages and ratio in Years 5, 6 and beyond.`,
    futureZh: `分数是小学数学中最重要、也是最容易让学生感到困难的领域之一。这里建立的概念理解——分数真正代表什么、它相对于整体在哪里——是五年级、六年级及之后学习分数运算（加减乘除）、小数、百分数和比例的根基。`,
  },

  // ── Year 6 Maths ───────────────────────────────────────────────────────────

  'y6-mat-01': {
    en: `This week in Maths we introduced positive and negative integers — extending the number line below zero to include negative numbers. We used temperature and ocean depth as real-world contexts, practised comparing and ordering negative numbers, and worked through addition and subtraction with integers, including problems like calculating the difference between −8°C and 5°C.`,
    zh: `这周数学课上，我们学习了正负整数——将数线延伸到零以下，引入负数的概念。我们用气温和海洋深度作为真实情境，练习了比较和排列负数，并学习了整数的加减法运算，包括计算零下8度和零上5度之差这类问题。`,
    futureEn: `Positive and negative integers appear throughout secondary mathematics — in algebra, coordinate geometry, directed number problems and scientific contexts. The ability to move fluently across zero on a number line, and to understand that a negative minus a negative can be positive, is a critical conceptual step that many students find challenging if the foundation isn't laid clearly.`,
    futureZh: `正负整数贯穿整个中学数学——代数、坐标几何、有向数问题以及科学情境中都会用到。能够流畅地穿越数线上的零点，理解负数减负数可以是正数，是一个重要的概念性步骤。如果基础不够清晰，很多学生在之后会遇到较大的困难。`,
  },

  'y6-mat-02': {
    en: `This week in Maths we worked through the order of operations — the BODMAS rule that tells us which part of a calculation to do first when an expression contains multiple operations. We covered brackets, orders (powers and roots), division and multiplication (left to right), and addition and subtraction (left to right). We applied the rules to word problems including tuck-shop scenarios to make the order meaningful rather than arbitrary.`,
    zh: `这周数学课上，我们学习了运算顺序——BODMAS规则，告诉我们当一个算式包含多种运算时，应该先算哪一部分。我们学习了括号、乘方（次方和方根）、乘除法（从左到右）以及加减法（从左到右）的先后顺序，并通过小卖部场景等实际问题来应用这些规则，让顺序变得有意义而不是死记硬背。`,
    futureEn: `Order of operations is the grammar of mathematics — without it, the same expression could produce different answers depending on who calculates it. It is fundamental to every algebraic expression students will encounter from Year 7 onwards, and is directly tested in NAPLAN and selective school assessments. Understanding BODMAS deeply, not just as a mnemonic, is what makes algebra feel logical rather than mysterious.`,
    futureZh: `运算顺序是数学的"语法"——没有它，同一个算式在不同人手里会得出不同的答案。它是七年级以后所有代数表达式的基础，也会在NAPLAN和精英学校考试中直接考查。深入理解BODMAS——而不只是记住口诀——是让代数感觉合乎逻辑而不是神秘难懂的关键。`,
  },

  'y6-mat-03': {
    en: `This week in Maths we worked on converting fluently between fractions, decimals and percentages — understanding that 3/4, 0.75 and 75% all describe the same quantity. We practised the 10% method as a mental calculation tool, applied percentages to real-life contexts including calculating GST on purchases, and worked through percentage increase and decrease problems.`,
    zh: `这周数学课上，我们学习了分数、小数和百分数之间的灵活转换——理解3/4、0.75和75%描述的是同一个量。我们练习了用10%方法进行心算，将百分数应用到真实生活情境中，包括计算商品的GST（商品服务税），并练习了百分数增加和减少的问题。`,
    futureEn: `The relationship between fractions, decimals and percentages sits at the heart of financial literacy, data interpretation and proportional reasoning — three areas that appear constantly in secondary school mathematics, science and economics. Being able to move fluently between the three representations, and to apply percentage calculations mentally, is a skill that pays dividends across every subject area.`,
    futureZh: `分数、小数和百分数之间的关系是金融素养、数据解读和比例推理的核心——这三个领域在中学数学、科学和经济学中反复出现。能够在三种表示形式之间灵活转换，并能心算百分数，是一项在所有学科领域都能带来长期回报的能力。`,
  },

  // ── Weekly lessons ─────────────────────────────────────────────────────────

  'weekly-eng-w2': {
    en: `This week in English we worked on persuasive writing — specifically how to write an opinion piece. Students learned how to open with a clear position statement, build an argument using three reasons backed by evidence, use connective language (furthermore, however, consequently) to link ideas, acknowledge and refute the opposing view, and close with a call to action. We looked at real examples and students wrote their own piece on a topic they chose.`,
    zh: `这周英语课上，我们学习了说服性写作——具体来说是如何写观点文章。学生学习了如何用清晰的立场陈述开篇，用三个有据可查的理由构建论点，使用连接词（furthermore、however、consequently等）连接想法，承认并反驳对立观点，并以行动呼吁作为结尾。我们分析了真实案例，学生还自主选择题目写了自己的观点文章。`,
    futureEn: `Persuasive writing is one of the most heavily weighted text types in the Australian Curriculum and in NAPLAN writing assessments. The skills from this lesson — constructing a logical argument, using evidence, and anticipating counter-arguments — also transfer directly to debating, formal essay writing in secondary school, and everyday reasoning.`,
    futureZh: `说服性写作是澳大利亚课程和NAPLAN写作评估中权重最高的文体类型之一。这节课中学到的技能——构建逻辑论点、运用证据、预见反驳——也直接迁移到辩论、中学正式论文写作以及日常推理思维中。`,
  },

  'weekly-mat-w2': {
    en: `This week in Maths we explored number patterns — identifying the rule in a sequence and using it to extend the pattern, find missing terms, and create original patterns. We worked with multiplication and division rules, two-step patterns (such as ×2 then +1), and applied pattern thinking to real-world contexts like population growth and savings.`,
    zh: `这周数学课上，我们学习了数字规律——找出数列中的规律，并用它来延伸数列、找出缺失项，以及创造自己的数列。我们研究了乘法和除法规律、两步规律（如×2再+1），并将规律思维应用到人口增长和储蓄等真实情境中。`,
    futureEn: `Pattern recognition is foundational to algebraic thinking. Identifying a rule and expressing it consistently is exactly what students will do when they write algebraic expressions and equations in secondary school. The two-step patterns in this lesson are particularly close in structure to linear sequences in algebra.`,
    futureZh: `规律识别是代数思维的基础。找到规律并能一致地表达它，正是学生在中学写代数表达式和方程时要做的事情。这节课中的两步规律在结构上与代数中的线性数列非常接近。`,
  },

  'weekly-eng-w3': {
    en: `This week in English we explored poetry — focusing on rhyme schemes (ABAB and AABB), counting syllables for rhythm, and the six core poetic devices: simile, metaphor, personification, alliteration, onomatopoeia and repetition. We read examples from Australian poetry and students wrote their own poem about Australia using at least three devices and a consistent rhyme scheme.`,
    zh: `这周英语课上，我们探索了诗歌——重点学习了押韵方案（ABAB和AABB）、通过数音节感受节奏，以及六种核心诗歌手法：明喻、隐喻、拟人、头韵、拟声和重复。我们阅读了澳大利亚诗歌的案例，学生用至少三种手法和一致的押韵方案创作了关于澳大利亚的诗歌。`,
    futureEn: `Poetry study develops a precision and care with language that improves all writing. Recognising and using figurative devices — simile, metaphor, personification — directly enriches narrative and descriptive writing, and these same techniques appear in reading comprehension tasks throughout secondary school.`,
    futureZh: `诗歌学习培养了对语言的精准感和审美力，能提升所有类型的写作。认识并使用修辞手法——明喻、隐喻、拟人——直接丰富了叙述性和描写性写作，这些相同的技巧在整个中学阶段的阅读理解任务中反复出现。`,
  },

  'weekly-mat-w3': {
    en: `This week in Maths we covered perimeter and area. We learned the formulas for rectangles and squares, worked through the difference between perimeter (distance around a shape, measured in cm or m) and area (the flat space inside, measured in cm² or m²), and extended this to composite shapes — L-shapes and other figures made by joining two rectangles — where we practised splitting shapes and adding the parts.`,
    zh: `这周数学课上，我们学习了周长和面积。我们学习了长方形和正方形的公式，搞清楚了周长（形状外围的距离，用厘米或米计量）和面积（内部平面空间，用平方厘米或平方米计量）之间的区别，并将这些知识延伸到组合图形——L形以及其他由两个长方形拼成的图形——练习了拆分图形并将各部分面积相加的方法。`,
    futureEn: `Perimeter and area are applied constantly in measurement, geometry and real-world problem solving. They lead directly into volume and surface area in Year 5 and 6, and into coordinate geometry and calculus concepts in secondary school. The habit of identifying the shape, selecting the correct formula and checking units is a mathematical discipline that carries forward across all of STEM.`,
    futureZh: `周长和面积在测量、几何和现实生活问题中被持续应用。它们直接通向五年级和六年级的体积和表面积，以及中学的坐标几何和微积分概念。养成识别图形形状、选择正确公式、检查单位的数学习惯，是一种在所有STEM学科中都能发挥作用的思维纪律。`,
  },
};
