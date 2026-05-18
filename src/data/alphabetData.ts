import { type BaybayinCharacter } from "../types/alphabet";

// stroke paths relative 100x100 svg canvas

export const alphabetCharacters: BaybayinCharacter[] = [
  // VOWELS
  {
    id: "a",
    baybayin: "ᜀ",
    latin: "A",
    pronunciation: "ah",
    category: "vowels",
    description: 'The vowel "A"',
    examples: ["aso", "araw"],
    strokes: [
      {
        id: 1,
        path: `M 21.93 23.00
        C 35.53 27.31, 38.27 39.85, 31.80 67.69
        C 28.47 89.54, 42.67 90.77, 52.00 74.62
        C 61.27 59.08, 66.70 45.80, 70.27 41.54
        C 77.40 32.58, 84.68 33.54, 88.58 42.18`,
        description: "Main curve",
        direction: "Top to bottom right",
      },
      {
        id: 2,
        path: "M 20.87 40.08 L 48.36 39.92",
        description: "Middle line",
        direction: "Left to right",
      },
      {
        id: 3,
        path: "M 20.90 52.69 L 34.62 52.54",
        description: "Bottom accent",
        direction: "Left to right",
      },
    ],
  },
  {
    id: "i",
    baybayin: "ᜁ",
    latin: "I / E",
    pronunciation: "ee/eh",
    category: "vowels",
    description: 'The vowel "I/E"',
    examples: ["isda", "elepante"],
    strokes: [
      {
        id: 1,
        path: "M 17.69 33.44 C 40.00 57.21, 56.92 16.53, 78.04 41.11",
        description: "Top curve",
        direction: "Left to right",
      },
      {
        id: 2,
        path: `M 17.96 70.26
        C 29.54 77.95, 38.15 69.63, 41.19 50.83
        C 41.82 61.74, 44.63 64.79, 46.38 67.53
        C 48.65 65.92, 53.04 59.50, 54.50 50.93
        C 55.54 70.11, 64.54 77.50, 75.07 70.23`,
        description: "Bottom wave",
        direction: "Left to right, wavy",
      },
    ],
  },
  {
    id: "u",
    baybayin: "ᜂ",
    latin: "U / O",
    pronunciation: "oo/oh",
    category: "vowels",
    description: 'The vowel "U/O"',
    examples: ["ulan", "oso"],
    strokes: [
      {
        id: 1,
        path: `M 39.46 38.29
        C 58.87 28.77, 64.29 51.85, 44.05 51.23
        C 68.51 50.80, 57.62 76.98, 36.10 67.64`,
        description: "U shape",
        direction: "Top to bottom, curved",
      },
    ],
  },

  // CONSONANTS
  {
    id: "ba",
    baybayin: "ᜊ",
    latin: "Ba",
    pronunciation: "ba",
    category: "consonants",
    description: "Ba",
    examples: ["bata", "bahay"],
    strokes: [
      {
        id: 1,
        path: `M 47.62 65.00
        C 19.38 86.20, 23.90 34.50, 50.33 34.45
        C 78.57 40.00, 64.38 84.50, 47.62 65.00
        Z`,
        description: "Oval shape",
        direction: "Continuous loop",
      },
    ],
  },
  {
    id: "ka",
    baybayin: "ᜃ",
    latin: "Ka",
    pronunciation: "ka",
    category: "consonants",
    description: "Ka",
    examples: ["kamay", "kape"],
    strokes: [
      {
        id: 1,
        path: "M 26.98 42.33 C 42.23 58.67, 58.93 26.78, 74.97 39.91",
        description: "Top curve",
        direction: "Left to right, upward",
      },
      {
        id: 2,
        path: "M 26.85 64.74 C 44.92 80.67, 56.35 49.89, 75.13 62.22",
        description: "Bottom curve",
        direction: "Left to right, downward",
      },
      {
        id: 3,
        path: "M 50.76 42.28 L 50.77 64.81",
        description: "Vertical connector",
        direction: "Top to bottom",
      },
    ],
  },
  {
    id: "da",
    baybayin: "ᜇ",
    latin: "Da / Ra",
    pronunciation: "da/ra",
    category: "consonants",
    description: "Da/Ra",
    examples: ["dagat", "damit"],
    strokes: [
      {
        id: 1,
        path: "M 24.05 41.51 C 45.75 57.03, 56.10 30.21, 75.00 46.35",
        description: "Top wave",
        direction: "Left to right",
      },
      {
        id: 2,
        path: `M 33.55 46.02
        C 22.60 56.04, 26.20 68.28, 37.50 67.29
        C 53.45 65.21, 62.65 56.20, 75.08 66.93`,
        description: "Bottom curve",
        direction: "Left to right, curved",
      },
    ],
  },
  {
    id: "ga",
    baybayin: "ᜄ",
    latin: "Ga",
    pronunciation: "ga",
    category: "consonants",
    description: "Ga",
    examples: ["gatas", "guro"],
    strokes: [
      {
        id: 1,
        path: `M 32.79 31.00
        C 52.08 20.00, 57.50 46.10, 37.23 45.90
        C 57.96 43.30, 45.38 86.45, 29.58 64.95`,
        description: "Left curve",
        direction: "Top to bottom left",
      },
      {
        id: 2,
        path: "M 49.42 33.10 C 72.92 20.00, 50.92 68.50, 70.83 67.05",
        description: "Right curve",
        direction: "Top to bottom right",
      },
    ],
  },
  {
    id: "ha",
    baybayin: "ᜑ",
    latin: "Ha",
    pronunciation: "ha",
    category: "consonants",
    description: "Ha",
    examples: ["halaman", "hangin"],
    strokes: [
      {
        id: 1,
        path: "M 23.53 52.49 C 43.95 67.48, 55.59 41.90, 73.95 57.19",
        description: "Main curve",
        direction: "Left to right",
      },
    ],
  },
  {
    id: "la",
    baybayin: "ᜎ",
    latin: "La",
    pronunciation: "la",
    category: "consonants",
    description: "La",
    examples: ["lalaki", "langit"],
    strokes: [
      {
        id: 1,
        path: "M 27.00 43.00 C 42.75 58.30, 53.35 30.60, 73.15 41.80",
        description: "Top curve",
        direction: "Left to right",
      },
      {
        id: 2,
        path: `M 52.00 42.18
        C 39.45 60.10, 64.45 50.25, 48.79 61.12
        C 50.35 66.90, 62.70 59.97, 47.15 73.38`,
        description: "Bottom squiggle",
        direction: "Left to right, wavy",
      },
    ],
  },
  {
    id: "ma",
    baybayin: "ᜋ",
    latin: "Ma",
    pronunciation: "ma",
    category: "consonants",
    description: "Ma",
    examples: ["mata", "mahal"],
    strokes: [
      {
        id: 1,
        path: `M 22.44 47.00
        C 40.63 47.90, 29.07 43.15, 32.29 66.75
        C 45.46 93.00, 58.88 21.65, 74.78 43.60`,
        description: "Main shape",
        direction: "Left to right, looping",
      },
      {
        id: 2,
        path: "M 31.90 54.35 C 37.85 51.75, 49.76 51.48, 53.27 55.63",
        description: "Accent mark",
        direction: "Left to right",
      },
    ],
  },
  {
    id: "na",
    baybayin: "ᜈ",
    latin: "Na",
    pronunciation: "na",
    category: "consonants",
    description: "Na",
    examples: ["nanay", "niyog"],
    strokes: [
      {
        id: 1,
        path: "M 32.00 74.00 C 21.10 26.20, 77.60 28.50, 65.00 74.00",
        description: "Outer curve",
        direction: "Top to bottom, curved",
      },
      {
        id: 2,
        path: `M 48.00 39.00
        C 47.15 52.65, 59.08 44.60, 47.00 53.50
        C 41.75 57.35, 61.50 55.00, 47.08 63.33
        C 41.45 68.20, 63.45 61.90, 45.35 75.95`,
        description: "Inner squiggle",
        direction: "Top to bottom, wavy",
      },
    ],
  },
  {
    id: "nga",
    baybayin: "ᜅ",
    latin: "Nga",
    pronunciation: "nga",
    category: "consonants",
    description: "Nga",
    examples: ["ngayon", "ngalan"],
    strokes: [
      {
        id: 1,
        path: `M 30.55 38.64
        C 20.45 45.85, 27.65 52.60, 36.75 46.85
        C 45.55 42.40, 54.65 57.90, 43.60 67.55
        C 37.00 72.40, 25.40 59.03, 26.95 74.00`,
        description: "Left squiggle",
        direction: "Top to bottom, wavy",
      },
      {
        id: 2,
        path: `M 48.70 57.27
        C 62.85 58.65, 60.00 45.00, 71.03 51.80
        C 78.50 57.25, 71.10 67.25, 63.50 69.00`,
        description: "Right curve",
        direction: "Top to bottom right",
      },
    ],
  },
  {
    id: "pa",
    baybayin: "ᜉ",
    latin: "Pa",
    pronunciation: "pa",
    category: "consonants",
    description: "Pa",
    examples: ["pamilya", "puno"],
    strokes: [
      {
        id: 1,
        path: `M 23.00 50.00
        C 46.90 46.45, 24.10 60.60, 36.22 71.04
        C 51.70 78.75, 64.20 23.25, 77.00 43.70`,
        description: "Main shape",
        direction: "Left to right, looping",
      },
      {
        id: 2,
        path: "M 58.83 50.80 C 61.45 53.50, 64.37 57.70, 65.48 60.70",
        description: "Accent mark",
        direction: "Left to right",
      },
    ],
  },
  {
    id: "sa",
    baybayin: "ᜐ",
    latin: "Sa",
    pronunciation: "sa",
    category: "consonants",
    description: "Sa",
    examples: ["saging", "saya"],
    strokes: [
      {
        id: 1,
        path: `M 24.50 36.95
        C 39.60 38.70, 33.95 28.35, 35.10 67.55
        C 42.50 62.65, 51.35 27.80, 67.35 39.05
        C 74.45 45.25, 66.35 52.80, 58.75 52.80
        C 74.25 51.15, 76.85 71.10, 52.65 69.90`,
        description: "Continuous curve",
        direction: "Top to bottom, wavy",
      },
    ],
  },
  {
    id: "ta",
    baybayin: "ᜆ",
    latin: "Ta",
    pronunciation: "ta",
    category: "consonants",
    description: "Ta",
    examples: ["tatay", "tubig"],
    strokes: [
      {
        id: 1,
        path: `M 29.15 48.82
        C 24.55 63.90, 45.00 49.00, 47.80 45.85
        C 57.35 38.45, 64.00 36.95, 74.29 40.97`,
        description: "Top curve",
        direction: "Left to right",
      },
      {
        id: 2,
        path: "M 32.50 72.50 C 33.00 68.80, 31.65 63.00, 47.50 46.12",
        description: "Bottom stroke",
        direction: "Bottom to top right",
      },
    ],
  },
  {
    id: "wa",
    baybayin: "ᜏ",
    latin: "Wa",
    pronunciation: "wa",
    category: "consonants",
    description: "Wa",
    examples: ["walo", "wika"],
    strokes: [
      {
        id: 1,
        path: `M 31.08 48.30
        C 46.90 48.75, 42.50 45.85, 40.65 61.60
        C 39.65 76.65, 64.50 68.70, 65.75 43.75
        C 66.00 32.00, 50.00 34.00, 47.50 39.40`,
        description: "Loop shape",
        direction: "Left to right, looping",
      },
    ],
  },
  {
    id: "ya",
    baybayin: "ᜌ",
    latin: "Ya",
    pronunciation: "ya",
    category: "consonants",
    description: "Ya",
    examples: ["yaman", "yakap"],
    strokes: [
      {
        id: 1,
        path: `M 23.00 50.00
        C 43.35 48.25, 29.80 53.10, 32.95 67.50
        C 35.30 75.55, 47.90 69.60, 56.00 55.00
        C 73.75 16.95, 86.35 58.05, 65.30 50.00`,
        description: "Main shape",
        direction: "Left to right, looping",
      },
    ],
  },

  // SPECIAL
  {
    id: "virama",
    baybayin: "◌᜔",
    latin: "Virama",
    pronunciation: "kudlit",
    category: "special",
    description: "Cancels vowel",
    examples: [],
    strokes: [
      {
        id: 1,
        path: "M 55.00 67.50 L 55.00 72.50",
        description: "Vertical line",
        direction: "Top to bottom",
      },
      {
        id: 2,
        path: "M 52.50 70.00 L 57.50 70.00",
        description: "Horizontal line",
        direction: "Left to right",
      },
    ],
  },
  {
    id: "kudlit_i",
    baybayin: "◌ᜒ",
    latin: "Kudlit I/E",
    pronunciation: "i/e",
    category: "special",
    description: "Above mark",
    examples: ["ᜊᜒ"],
    strokes: [
      {
        id: 1,
        path: "M 57.80 36.70 C 56.70 35.75, 55.00 36.05, 54.00 37.50",
        description: "Curved mark",
        direction: "Right to left, upward",
      },
    ],
  },
  {
    id: "kudlit_u",
    baybayin: "◌ᜓ",
    latin: "Kudlit U/O",
    pronunciation: "u/o",
    category: "special",
    description: "Below mark",
    examples: ["ᜊᜓ"],
    strokes: [
      {
        id: 1,
        path: "M 61.00 72.00 C 60.13 71.55, 58.45 71.75, 58.50 72.90",
        description: "Curved mark below",
        direction: "Right to left, downward",
      },
    ],
  },
];
