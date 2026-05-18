import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { latinToBaybayinExercises } from "../data/latinToBaybayinExercises";
import { baybayinToLatinExercises } from "../data/transliterationExercises";
import {
  type ExerciseFeedback,
  type TransliterationExercise,
  Difficulty,
  ExerciseDirection,
} from "../types/transliteration";

interface UseTransliterationExerciseReturn {
  currentExercise: TransliterationExercise | null;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  feedback: ExerciseFeedback | null;
  isCorrect: boolean;
  isSubmitted: boolean;
  score: number;
  totalAttempts: number;
  difficulty: Difficulty;
  isDifficultySelected: boolean;
  handleDifficultySelect: (difficulty: Difficulty) => void;
  handleSubmit: () => void;
  handleNext: () => void;
  handleHint: () => void;
  handleChangeDifficulty: () => void;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useTransliterationExercise = (
  direction: ExerciseDirection
): UseTransliterationExerciseReturn => {
  const { t } = useTranslation();
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const shuffledExercises = useMemo(() => {
    const source =
      direction === ExerciseDirection.BAYBAYIN_TO_LATIN
        ? baybayinToLatinExercises
        : latinToBaybayinExercises;

    return shuffleArray(source.filter((ex) => ex.difficulty === difficulty));
  }, [difficulty, direction]);

  const currentExercise = shuffledExercises[currentIndex] || null;

  const handleDifficultySelect = useCallback(
    (selectedDifficulty: Difficulty) => {
      setDifficulty(selectedDifficulty);
      setIsDifficultySelected(true);
      setCurrentIndex(0);
      setScore(0);
      setTotalAttempts(0);
      setUserAnswer("");
      setFeedback(null);
      setIsCorrect(false);
      setIsSubmitted(false);
    },
    []
  );

  const handleChangeDifficulty = useCallback(() => {
    setIsDifficultySelected(false);
    setFeedback(null);
  }, []);

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim().replace(/\s+/g, " ");
  };

  const handleSubmit = useCallback(() => {
    if (!currentExercise || !userAnswer.trim()) return;

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = normalizeAnswer(
      currentExercise.correctAnswer
    );

    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    setTotalAttempts((prev) => prev + 1);

    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
      setFeedback({
        message: t("practice.exercise.correct"),
        details: `${currentExercise.prompt} = ${currentExercise.correctAnswer}`,
      });
    } else {
      setFeedback({
        message: t("practice.exercise.incorrect"),
        details: `${t("practice.exercise.correctAnswer")}: ${currentExercise.correctAnswer}`,
      });
    }
  }, [currentExercise, userAnswer, t]);

  const handleNext = useCallback(() => {
    if (currentIndex < shuffledExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setUserAnswer("");
    setFeedback(null);
    setIsCorrect(false);
    setIsSubmitted(false);
  }, [currentIndex, shuffledExercises.length]);

  const handleHint = useCallback(() => {
    if (currentExercise) {
      setFeedback({
        message: t("practice.exercise.hint"),
        details: currentExercise.hint,
      });
    }
  }, [currentExercise, t]);

  return {
    currentExercise,
    userAnswer,
    setUserAnswer,
    feedback,
    isCorrect,
    isSubmitted,
    score,
    totalAttempts,
    difficulty,
    isDifficultySelected,
    handleDifficultySelect,
    handleSubmit,
    handleNext,
    handleHint,
    handleChangeDifficulty,
  };
};
