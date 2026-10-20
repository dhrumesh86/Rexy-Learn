export type Page =
  | "overview"
  | "path"
  | "lab"
  | "live"
  | "story"
  | "achievements"
  | "parent"
  | "planner"
  | "games";
export type Subject = "math" | "reading" | "science";
export type Question = {
  prompt: string;
  answers: string[];
  correct: number;
  hint: string;
  explain: string;
  visual?: string;
};
export const subjects = [
  {
    id: "math" as Subject,
    name: "Math explorers",
    land: "Number island",
    detail: "Play with numbers, patterns and big ideas.",
    color: "blue",
    lesson: "Add in clever ways",
    progress: 50,
  },
  {
    id: "reading" as Subject,
    name: "Story seekers",
    land: "Story forest",
    detail: "Discover, read and imagine new worlds.",
    color: "pink",
    lesson: "A little seed. A big adventure.",
    progress: 50,
  },
  {
    id: "science" as Subject,
    name: "Wonder lab",
    land: "Wonder valley",
    detail: "Explore science and the amazing world around you.",
    color: "green",
    lesson: "What do plants need?",
    progress: 33,
  },
];
export const questions: Record<Subject, Question[]> = {
  math: [
    {
      prompt: "You have 5 stars. How many more make 8?",
      answers: ["2", "3", "4", "5"],
      correct: 1,
      visual: "stars",
      hint: "Count on from 5: 6, 7, 8. How many steps?",
      explain: "Three more! 5 + 3 = 8.",
    },
    {
      prompt: "What is 12 + 6?",
      answers: ["16", "17", "18", "19"],
      correct: 2,
      visual: "ten",
      hint: "Split 12 into 10 and 2. Add 2 + 6, then add the ten.",
      explain: "10 + 2 + 6 = 10 + 8 = 18.",
    },
    {
      prompt: "What number comes next? 2, 4, 6, 8, …",
      answers: ["9", "10", "11", "12"],
      correct: 1,
      hint: "Each number is two more than the last.",
      explain: "We count by twos: 2, 4, 6, 8, 10.",
    },
    {
      prompt: "There are 15 apples. You share 5. How many are left?",
      answers: ["5", "9", "10", "20"],
      correct: 2,
      hint: "Take five away from fifteen.",
      explain: "15 − 5 = 10 apples.",
    },
    {
      prompt: "Which number has 3 tens and 4 ones?",
      answers: ["43", "7", "304", "34"],
      correct: 3,
      hint: "Three tens means 30. Add four ones.",
      explain: "Three tens and four ones make 34: 30 + 4 = 34.",
    },
  ],
  reading: [
    {
      prompt:
        "Lily planted a seed. She gave it water and sunlight. What will probably happen next?",
      answers: [
        "The seed grows",
        "The seed becomes a stone",
        "The sun disappears",
      ],
      correct: 0,
      hint: "Think about what water and sunlight help a seed do.",
      explain:
        "The seed can begin to grow when it has the conditions it needs.",
    },
    {
      prompt: "Which word means a very young plant?",
      answers: ["Cloud", "Sprout", "Pebble"],
      correct: 1,
      hint: "It starts with “spr”. You might see it just above the soil.",
      explain: "A sprout is a young plant that has just begun growing.",
    },
    {
      prompt: "Which sentence tells us how Lily feels?",
      answers: [
        "The pot is brown.",
        "Lily feels proud of her plant.",
        "The plant has leaves.",
      ],
      correct: 1,
      hint: "Look for a feeling word.",
      explain: "“Proud” tells us how Lily feels.",
    },
    {
      prompt: "Choose the word that rhymes with “light”.",
      answers: ["Leaf", "Night", "Grow"],
      correct: 1,
      hint: "Listen to the ending sound in “light”.",
      explain: "Light and night both end with the same sound.",
    },
    {
      prompt:
        "What is a good title for a story about a seed that keeps growing?",
      answers: [
        "A Little Seed’s Adventure",
        "The Missing Snowball",
        "A Day at the Pool",
      ],
      correct: 0,
      hint: "A title gives us a clue about the story.",
      explain: "A Little Seed’s Adventure tells us what the story is about.",
    },
  ],
  science: [
    {
      prompt: "Which two things help most garden plants grow?",
      answers: ["Water and light", "Candy and paint", "Stones and toys"],
      correct: 0,
      hint: "Think about what we give our plant in the lab.",
      explain:
        "Plants need water and light, along with air, nutrients and suitable conditions.",
    },
    {
      prompt: "Which part of a plant takes up water from the soil?",
      answers: ["Flower", "Roots", "Petals"],
      correct: 1,
      hint: "This part is usually below the soil.",
      explain: "Roots take up water and help anchor the plant.",
    },
    {
      prompt: "What is one way to test how water affects a plant?",
      answers: [
        "Change everything at once",
        "Give similar plants different amounts of water",
        "Hide all the plants",
      ],
      correct: 1,
      hint: "For a fair comparison, change one condition and keep the others similar.",
      explain:
        "Compare similar plants with the same light and soil, but different amounts of water.",
    },
    {
      prompt: "What might happen if a plant receives too much water?",
      answers: [
        "It always grows faster",
        "Its roots may have trouble getting air",
        "It turns into a tree immediately",
      ],
      correct: 1,
      hint: "Roots need air too. Soil should not always be soggy.",
      explain:
        "Too much water can fill the spaces in soil that normally contain air.",
    },
    {
      prompt: "Which observation can we measure?",
      answers: [
        "The plant looks happy",
        "The plant is magical",
        "The plant is 8 centimetres tall",
      ],
      correct: 2,
      hint: "Look for a number and a unit.",
      explain: "A ruler can measure a plant’s height in centimetres.",
    },
  ],
};
export const storyPages = [
  "Lily found a tiny seed in her garden. “You look small,” she whispered, “but I wonder what you could become.”",
  "She filled a little pot with soil and made a cosy spot for the seed. Rexy helped her tuck it in.",
  "Lily planted a tiny seed in her garden. Days went by. The soil was dark and quiet. Then, a little sprout peeked out!",
  "“Hello, little sprout!” said Rexy. Lily gave it a little water and moved it into the warm sunlight.",
  "One cloudy day, Lily worried. “Will it keep growing?” Rexy smiled. “Let’s keep watching and caring for it.”",
  "Little by little, the sprout grew taller. Two bright leaves opened like tiny hands reaching for the sky.",
  "A butterfly landed nearby. Lily drew the leaves in her notebook. “Every day brings something new!” she said.",
  "At last, a yellow flower opened. Lily and Rexy beamed. Small beginnings can grow into wonderful things—with care and time.",
];
export function tutorReply(input: string, exercise: "stars" | "ten" = "stars") {
  const text = input.toLowerCase().trim();
  if (/\b(hi|hello|hey)\b/.test(text))
    return "Hi, explorer! I’m your practice buddy. Let’s think through this example together. You can type, tap the counters, or draw.";
  if (/\b(hint|help|stuck|know)\b/.test(text))
    return exercise === "stars"
      ? "Start with 5 stars. Count on: 6, 7, 8. How many new stars did you count?"
      : "Try making a ten. Split 12 into 10 and 2. What is 2 + 6?";
  const answer =
    exercise === "stars"
      ? /^(3|three)(\s+(more|stars?))?[.!?]?$/.test(text)
      : /^(18|eighteen)[.!?]?$/.test(text);
  if (answer)
    return exercise === "stars"
      ? "Yes! Three more stars make eight: 5 + 3 = 8. Can you show it with the stars?"
      : "Yes! 12 + 6 = 18. You made a ten, then added 2 + 6 = 8. Great explaining!";
  return exercise === "stars"
    ? "Let’s use the picture. We already have 5 stars, and our goal is 8. Tap the empty stars one at a time, then count how many you added."
    : "Let’s look at the ten frames. We have one full ten, 2 blue counters, and 6 pink counters. Count the extra counters, then add them to ten.";
}
export function plantOutcome(sun: number, water: number) {
  if (water > 85)
    return {
      title: "A little too soggy",
      detail:
        "In our simple model, lots of water leaves less room for air in the soil. Try less water.",
      height: 34,
      healthy: false,
    };
  if (water < 25)
    return {
      title: "A thirsty little sprout",
      detail:
        "Our model plant needs more water. Change the water slider and test your idea again.",
      height: 25,
      healthy: false,
    };
  if (sun < 25)
    return {
      title: "Looking for light",
      detail:
        "Our model plant has water but little light. Try moving the sunlight slider.",
      height: 40,
      healthy: false,
    };
  return {
    title: "Room to grow!",
    detail:
      "With moderate water and enough light, our model plant grows more leaves. Real plants have different needs.",
    height: 85,
    healthy: true,
  };
}
export const defaultPlan = {
  goal: 60,
  time: "16:30",
  reminders: true,
  readAloud: true,
  breaks: true,
  review: true,
  extras: [0, 0, 0, 0, 0],
};
export type Plan = typeof defaultPlan;
export const planActivities = [
  { label: "Warm-up", minutes: 5, color: "blue" },
  { label: "Math", minutes: 15, color: "blue" },
  { label: "Reading", minutes: 15, color: "pink" },
  { label: "Wiggle break", minutes: 5, color: "amber" },
  { label: "Science", minutes: 15, color: "green" },
  { label: "Reflection", minutes: 5, color: "purple" },
];
