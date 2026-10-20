import { CurriculumSkill } from '../types/learning';

export const ONTARIO_SKILLS: CurriculumSkill[] = [
  // ==================== GRADE 3 MATHEMATICS ====================
  {
    id: 'ON-M3-B1.1',
    curriculumCode: 'B1.1',
    title: 'Place Value of Digits up to 1,000',
    subject: 'math',
    grade: '3',
    strand: 'Strand B: Number',
    substrand: 'Whole Numbers',
    description: 'Read, represent, and compose whole numbers up to 1,000 using base-ten place value models.',
    ontarioExpectation: 'Ontario Math B1.1: Read, represent, compose, and decompose whole numbers up to and including 1,000, using a variety of tools and representations.',
    smartScore: 78,
    questionsAnswered: 12,
    isMastered: false,
    questions: [
      {
        id: 'q-m3-b11-1',
        skillId: 'ON-M3-B1.1',
        prompt: 'Look at the base-ten blocks below. What number is represented by 4 hundreds flats, 6 tens rods, and 7 ones units?',
        visual: {
          type: 'base_ten',
          data: { hundreds: 4, tens: 6, ones: 7 }
        },
        options: ['467', '476', '4,067', '764'],
        correctAnswer: '467',
        explanation: '4 hundreds = 400. 6 tens = 60. 7 ones = 7. Adding them together: 400 + 60 + 7 = 467.',
        hint: 'Count the hundreds first (large squares), then tens (sticks), then single units.',
        difficulty: 'easy'
      },
      {
        id: 'q-m3-b11-2',
        skillId: 'ON-M3-B1.1',
        prompt: 'In the number 839, what is the value of the digit 3?',
        visual: {
          type: 'base_ten',
          data: { hundreds: 8, tens: 3, ones: 9 }
        },
        options: ['30 (3 tens)', '3 (3 ones)', '300 (3 hundreds)', '39'],
        correctAnswer: '30 (3 tens)',
        explanation: 'The digit 3 is in the tens place. 3 tens have a value of 30.',
        hint: 'Check the position: hundreds is on the left, tens is in the middle, ones is on the right.',
        difficulty: 'medium'
      },
      {
        id: 'q-m3-b11-3',
        skillId: 'ON-M3-B1.1',
        prompt: 'Challenge Zone: If you have 7 hundreds and trade 2 hundreds for 20 tens, what is the total number you have if you also have 5 ones?',
        visual: {
          type: 'base_ten',
          data: { hundreds: 5, tens: 20, ones: 5 }
        },
        options: ['705', '525', '725', '750'],
        correctAnswer: '705',
        explanation: 'Trading hundreds for tens changes the form but not the value! 5 hundreds (500) + 20 tens (200) + 5 ones = 705.',
        hint: 'Remember that 10 tens = 100, so 20 tens = 200!',
        difficulty: 'challenge'
      }
    ]
  },
  {
    id: 'ON-M3-B1.4',
    curriculumCode: 'B1.4',
    title: 'Compare and Order Fractions with Strip Models',
    subject: 'math',
    grade: '3',
    strand: 'Strand B: Number',
    substrand: 'Fractions',
    description: 'Use visual fraction models to compare unit and non-unit fractions with like and unlike denominators.',
    ontarioExpectation: 'Ontario Math B1.4: Represent fractions from halves to tenths using visual models including area and strip representations.',
    smartScore: 92,
    questionsAnswered: 24,
    isMastered: false,
    questions: [
      {
        id: 'q-m3-b14-1',
        skillId: 'ON-M3-B1.4',
        prompt: 'Compare the two fraction strips below: 3/4 versus 2/4. Which symbol makes the sentence true?',
        visual: {
          type: 'fraction_bar',
          data: { fractionA: { num: 3, den: 4, label: '3/4' }, fractionB: { num: 2, den: 4, label: '2/4' } }
        },
        options: ['3/4 > 2/4 (Greater than)', '3/4 < 2/4 (Less than)', '3/4 = 2/4 (Equal)'],
        correctAnswer: '3/4 > 2/4 (Greater than)',
        explanation: 'Both fractions have the same denominator (fourths). 3 parts are clearly longer than 2 parts, so 3/4 is greater than 2/4.',
        hint: 'Look at the shaded length in the fraction strip comparison.',
        difficulty: 'easy'
      },
      {
        id: 'q-m3-b14-2',
        skillId: 'ON-M3-B1.4',
        prompt: 'Which fraction is equivalent to 1/2 when looking at fourths?',
        visual: {
          type: 'fraction_bar',
          data: { fractionA: { num: 1, den: 2, label: '1/2' }, fractionB: { num: 2, den: 4, label: '2/4' } }
        },
        options: ['2/4', '3/4', '1/4', '4/4'],
        correctAnswer: '2/4',
        explanation: 'When you divide each half into 2 equal pieces, 1 out of 2 becomes 2 out of 4 (2/4).',
        hint: 'Compare the line right down the center of the strip.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ON-M3-F1.1',
    curriculumCode: 'F1.1',
    title: 'Canadian Currency & Making Change up to $10',
    subject: 'math',
    grade: '3',
    strand: 'Strand F: Financial Literacy',
    substrand: 'Money Concepts',
    description: 'Estimate and calculate the total cost of Canadian coins (nickels, dimes, quarters, loonies, toonies) and bills.',
    ontarioExpectation: 'Ontario Math F1.1: Estimate and calculate the change for transactions involving whole-dollar amounts up to $10.',
    smartScore: 85,
    questionsAnswered: 18,
    isMastered: false,
    questions: [
      {
        id: 'q-m3-f11-1',
        skillId: 'ON-M3-F1.1',
        prompt: 'You buy a delicious maple pastry for $3.50 at the Ontario Farmer\'s Market and pay with a $5 bill. How much change should you get back?',
        visual: {
          type: 'canadian_currency',
          data: { paid: 5.00, itemCost: 3.50 }
        },
        options: ['$1.50 (1 Loonie + 2 Quarters)', '$1.25', '$2.50', '$0.50'],
        correctAnswer: '$1.50 (1 Loonie + 2 Quarters)',
        explanation: 'Subtract the cost from the cash paid: $5.00 - $3.50 = $1.50. You can make $1.50 with one Loonie ($1.00) and two 25¢ quarters ($0.50).',
        hint: 'Count up from $3.50: add 50¢ to make $4.00, then add $1.00 to reach $5.00!',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ON-M3-C3.1',
    curriculumCode: 'C3.1',
    title: 'Coding Concepts: Loops and Sequences',
    subject: 'math',
    grade: '3',
    strand: 'Strand C: Algebra',
    substrand: 'Coding Skills',
    description: 'Solve problems and create computational representations using sequential execution and repeating loops.',
    ontarioExpectation: 'Ontario Math C3.1: Solve problems and create computational representations of mathematical situations by writing and executing code, including code that involves sequential and repeating events.',
    smartScore: 100,
    questionsAnswered: 30,
    isMastered: true,
    questions: [
      {
        id: 'q-m3-c31-1',
        skillId: 'ON-M3-C3.1',
        prompt: 'A robot starts at position 0 on a number line. It executes this code block: REPEAT 4 TIMES: [ Move Forward 5 steps ]. What position is the robot at?',
        visual: {
          type: 'number_line',
          data: { start: 0, step: 5, repeats: 4, end: 20 }
        },
        options: ['20', '9', '25', '16'],
        correctAnswer: '20',
        explanation: 'The loop repeats moving forward 5 steps 4 times. 4 × 5 = 20. The robot stops at 20.',
        hint: 'Think of repeated addition: 5 + 5 + 5 + 5.',
        difficulty: 'easy'
      }
    ]
  },

  // ==================== GRADE 4 MATHEMATICS ====================
  {
    id: 'ON-M4-C2.1',
    curriculumCode: 'C2.1',
    title: 'Algebraic Balancing Equations with Balance Scale',
    subject: 'math',
    grade: '4',
    strand: 'Strand C: Algebra',
    substrand: 'Variables & Equations',
    description: 'Solve one-step equations using the balance scale visual model to keep both sides equal.',
    ontarioExpectation: 'Ontario Math C2.1: Determine whether equations involving addition, subtraction, multiplication, and division are true or false, and find missing values.',
    smartScore: 68,
    questionsAnswered: 8,
    isMastered: false,
    questions: [
      {
        id: 'q-m4-c21-1',
        skillId: 'ON-M4-C2.1',
        prompt: 'The balance scale is level! The left pan holds a mystery box (x) and 7 kilograms. The right pan holds 19 kilograms. What is the value of x?',
        visual: {
          type: 'balance_scale',
          data: { leftLabel: 'x + 7 kg', rightLabel: '19 kg', target: 12 }
        },
        options: ['12 kg', '26 kg', '13 kg', '7 kg'],
        correctAnswer: '12 kg',
        explanation: 'To keep the scale balanced, subtract 7 from both pans: x + 7 - 7 = 19 - 7, so x = 12 kg.',
        hint: 'What number added to 7 gives 19? 19 - 7 = ?',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'ON-M4-E1.1',
    curriculumCode: 'E1.1',
    title: 'Perimeter and Area of Rectangles',
    subject: 'math',
    grade: '4',
    strand: 'Strand E: Spatial Sense',
    substrand: 'Geometric Measurement',
    description: 'Distinguish between perimeter (rim around) and area (surface inside) using square units.',
    ontarioExpectation: 'Ontario Math E1.1: Describe the relationships between rectangular units of length and area, and calculate perimeter and area of rectangles.',
    smartScore: 84,
    questionsAnswered: 16,
    isMastered: false,
    questions: [
      {
        id: 'q-m4-e11-1',
        skillId: 'ON-M4-E1.1',
        prompt: 'A Canadian backyard ice rink is 8 metres long and 5 metres wide. What is the perimeter of the rink?',
        visual: {
          type: 'geometry_shape',
          data: { shape: 'rectangle', length: 8, width: 5, unit: 'm' }
        },
        options: ['26 metres', '40 square metres', '13 metres', '28 metres'],
        correctAnswer: '26 metres',
        explanation: 'Perimeter is the distance all the way around: 8 + 5 + 8 + 5 = 26 metres. (40 m² is the area, not the perimeter!)',
        hint: 'Perimeter adds all 4 sides: 2 × (length + width).',
        difficulty: 'medium'
      }
    ]
  },

  // ==================== GRADE 4 & 5 SCIENCE & TECHNOLOGY ====================
  {
    id: 'ON-S4-E1.1',
    curriculumCode: 'E1.1',
    title: 'Rocks, Minerals and Geological Formations',
    subject: 'science',
    grade: '4',
    strand: 'Earth & Space Systems',
    substrand: 'Rocks and Minerals',
    description: 'Examine igneous, sedimentary, and metamorphic rocks found across the Canadian Shield.',
    ontarioExpectation: 'Ontario Science E1.1: Assess the social and environmental impacts of the geological mining industry in Ontario and identify rock types.',
    smartScore: 90,
    questionsAnswered: 22,
    isMastered: false,
    questions: [
      {
        id: 'q-s4-e11-1',
        skillId: 'ON-S4-E1.1',
        prompt: 'Which rock type is formed when molten magma or lava from deep inside Earth cools and hardens, such as granite found in Northern Ontario?',
        visual: {
          type: 'science_cell',
          data: { diagram: 'rock_cycle', rockType: 'Igneous' }
        },
        options: ['Igneous rock', 'Sedimentary rock', 'Metamorphic rock', 'Fossil fuel'],
        correctAnswer: 'Igneous rock',
        explanation: 'Igneous rocks come from fiery molten rock that cools down. "Igneous" comes from the Latin word for fire (ignis)!',
        hint: 'Think of volcanoes and magma cooling into hard granite rock.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'ON-S5-B2.1',
    curriculumCode: 'B2.1',
    title: 'Human Organ Systems: Digestive & Circulatory',
    subject: 'science',
    grade: '5',
    strand: 'Life Systems',
    substrand: 'Human Health and Body Systems',
    description: 'Trace how nutrients and oxygen circulate through the heart, lungs, and bloodstream.',
    ontarioExpectation: 'Ontario Science B2.1: Identify major organs of the respiratory, circulatory, and digestive systems and explain their interactions.',
    smartScore: 76,
    questionsAnswered: 14,
    isMastered: false,
    questions: [
      {
        id: 'q-s5-b21-1',
        skillId: 'ON-S5-B2.1',
        prompt: 'Which muscular organ acts as a double pump, sending oxygen-rich blood through arteries to the entire body?',
        visual: {
          type: 'science_cell',
          data: { organ: 'heart', chambers: 4 }
        },
        options: ['The Heart', 'The Lungs', 'The Stomach', 'The Liver'],
        correctAnswer: 'The Heart',
        explanation: 'The heart beats approximately 100,000 times a day, pumping blood through thousands of kilometers of blood vessels!',
        hint: 'You can feel its rhythmic beat in your chest or at your wrist pulse.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'ON-S6-E2.1',
    curriculumCode: 'E2.1',
    title: 'Space Exploration & Solar System Dynamics',
    subject: 'science',
    grade: '6',
    strand: 'Earth & Space Systems',
    substrand: 'Space Exploration',
    description: 'Analyze planetary motion, gravity, and Canadian contributions like the Canadarm aboard the ISS.',
    ontarioExpectation: 'Ontario Science E2.1: Describe components of the solar system and investigate Canadian technological contributions to space exploration.',
    smartScore: 94,
    questionsAnswered: 28,
    isMastered: false,
    questions: [
      {
        id: 'q-s6-e21-1',
        skillId: 'ON-S6-E2.1',
        prompt: 'What famous Canadian robotic arm played an indispensable role in building the International Space Station and deploying satellites?',
        visual: {
          type: 'science_cell',
          data: { topic: 'Canadarm', flag: '🇨🇦' }
        },
        options: ['Canadarm', 'Apollo Lunar Lander', 'Hubble Lens', 'Mars Rover Spirit'],
        correctAnswer: 'Canadarm',
        explanation: 'Canadarm (and Canadarm2) was designed by Canadian engineers at SPAR Aerospace and the Canadian Space Agency, becoming a national symbol of scientific achievement!',
        hint: 'Its name literally starts with the first 6 letters of Canada!',
        difficulty: 'easy'
      }
    ]
  },

  // ==================== LANGUAGE ARTS (ONTARIO 2023) ====================
  {
    id: 'ON-L4-C1.2',
    curriculumCode: 'C1.2',
    title: 'Making Inferences from Literary Text',
    subject: 'language',
    grade: '4',
    strand: 'Comprehension',
    substrand: 'Critical Literacy',
    description: 'Combine text clues with personal knowledge to draw inferences and uncover deeper meaning.',
    ontarioExpectation: 'Ontario Language C1.2: Make inferences using stated and implied information and evidence from texts to deepen understanding.',
    smartScore: 82,
    questionsAnswered: 15,
    isMastered: false,
    questions: [
      {
        id: 'q-l4-c12-1',
        skillId: 'ON-L4-C1.2',
        prompt: 'Read this passage: "Maya laced up her boots, pulled her thick woolen toque over her ears, and wiped the frosty condensation from the window before picking up her snow shovel." What can you infer about the weather?',
        options: [
          'It is a cold winter morning after a snowfall',
          'It is a rainy summer afternoon',
          'She is preparing for a sunny day at Wasaga Beach',
          'A thunderstorm is passing through'
        ],
        correctAnswer: 'It is a cold winter morning after a snowfall',
        explanation: 'Text clues: "thick woolen toque", "frosty condensation", and "snow shovel" all imply cold winter conditions with snow on the ground.',
        hint: 'Notice the items she puts on and carries: toque, boots, snow shovel.',
        difficulty: 'easy'
      }
    ]
  },

  // ==================== SOCIAL STUDIES (ONTARIO) ====================
  {
    id: 'ON-SS3-A1.1',
    curriculumCode: 'A1.1',
    title: 'Early Communities in Ontario and Indigenous Peoples',
    subject: 'social',
    grade: '3',
    strand: 'Heritage & Identity',
    substrand: 'Early Communities in Canada',
    description: 'Explore the daily life, governance, and environmental stewardship of Anishinaabe and Haudenosaunee nations.',
    ontarioExpectation: 'Ontario Social Studies A1.1: Describe some of the ways in which daily life of Indigenous peoples was connected to the land and seasonal cycles.',
    smartScore: 88,
    questionsAnswered: 20,
    isMastered: false,
    questions: [
      {
        id: 'q-ss3-a11-1',
        skillId: 'ON-SS3-A1.1',
        prompt: 'The Haudenosaunee (Iroquois) lived in communal wooden homes covered with elm bark where multiple related families shared a hearth fire. What were these homes called?',
        options: ['Longhouses', 'Tipi structures', 'Igloos', 'Pioneer log cabins'],
        correctAnswer: 'Longhouses',
        explanation: 'Longhouses were sturdy, extended wooden homes that could house 20 or more family members, symbolizing community and unity.',
        hint: 'The name literally describes its lengthy architectural design.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'ON-SS4-B2.1',
    curriculumCode: 'B2.1',
    title: 'Physical and Political Regions of Canada',
    subject: 'social',
    grade: '4',
    strand: 'People & Environments',
    substrand: 'Political and Physical Regions of Canada',
    description: 'Identify Canada\'s 10 provinces, 3 territories, and physiographic regions like the Canadian Shield and Great Lakes-St. Lawrence Lowlands.',
    ontarioExpectation: 'Ontario Social Studies B2.1: Identify and describe the characteristics of Canada\'s main physical regions and map provinces and territories.',
    smartScore: 79,
    questionsAnswered: 13,
    isMastered: false,
    questions: [
      {
        id: 'q-ss4-b21-1',
        skillId: 'ON-SS4-B2.1',
        prompt: 'Which landform region covers more than half of Canada with ancient exposed rock, millions of freshwater lakes, and boreal forests?',
        options: ['The Canadian Shield', 'The Interior Plains', 'The Appalachian Region', 'The Arctic Lowlands'],
        correctAnswer: 'The Canadian Shield',
        explanation: 'The Canadian Shield is an enormous horseshoe-shaped region of ancient Precambrian rock wrapping around Hudson Bay, rich in minerals, timber, and water.',
        hint: 'It is named after a defensive piece of armor because of its tough, ancient rock shield.',
        difficulty: 'medium'
      }
    ]
  }
];

export const INITIAL_CHILD_PROFILES = [
  {
    id: 'child-1',
    name: 'Maya',
    avatar: '🦊',
    grade: '3' as const,
    targetSchoolBoard: 'Toronto District School Board (TDSB)',
    totalQuestions: 142,
    totalTimeMinutes: 285,
    currentStreakDays: 6,
    masteredSkillsCount: 14,
    diagnosticOverallScore: 485,
    diagnosticGradeLevel: 'Grade 3.7',
    stickersEarned: ['🏆 Gold Ribbon', '🍁 Ontario Maple Leaf', '🚀 Canadarm Explorer', '🦫 Beaver Builder', '🔬 Science Star'],
    recentHurdles: [
      {
        skillId: 'ON-M3-B1.1',
        skillTitle: 'Place Value up to 1,000',
        misconception: 'Swapped tens and ones when writing expanded form (wrote 34 as 43).',
        parentTip: 'Practice naming grocery items with 2-digit prices and asking "How many dimes and pennies?"',
        detectedAt: 'Yesterday'
      }
    ]
  },
  {
    id: 'child-2',
    name: 'Liam',
    avatar: '🦉',
    grade: '5' as const,
    targetSchoolBoard: 'Ottawa-Carleton District School Board',
    totalQuestions: 210,
    totalTimeMinutes: 410,
    currentStreakDays: 12,
    masteredSkillsCount: 22,
    diagnosticOverallScore: 590,
    diagnosticGradeLevel: 'Grade 5.4',
    stickersEarned: ['🌟 Math Champion', '🔬 Cell Biologist', '⚡ Energy Master', '🇨🇦 Canadian History Badge'],
    recentHurdles: [
      {
        skillId: 'ON-S5-B2.1',
        skillTitle: 'Human Organ Systems',
        misconception: 'Confused arteries (carrying blood away from heart) with veins (carrying blood toward heart).',
        parentTip: 'Use the mnemonic "A is for Away! Arteries carry blood Away from the heart!"',
        detectedAt: '2 days ago'
      }
    ]
  }
];
