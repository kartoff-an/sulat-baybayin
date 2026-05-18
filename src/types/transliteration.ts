export const ExerciseDirection = {
  BAYBAYIN_TO_LATIN: "baybayin_to_latin",
  LATIN_TO_BAYBAYIN: "latin_to_baybayin",
} as const;
export type ExerciseDirection =
  (typeof ExerciseDirection)[keyof typeof ExerciseDirection];

export const Difficulty = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface TransliterationExercise {
  id: string;
  prompt: string;
  correctAnswer: string;
  hint: string;
  difficulty: Difficulty;
  category: string;
}

export interface ExerciseFeedback {
  message: string;
  details: string;
}
