import { useCallback, useEffect, useRef, useState } from "react";
import { type BaybayinCharacter } from "../types/alphabet";
import {
  initializeRecognizer,
  registerCharacterStrokes,
  resetReferenceFrames,
  validateCompleteCharacter,
} from "../utils/ndollar-recognition/ndollar-recognizer";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { getWritingCharacters, parseSVGPath } from "../utils/writing";

interface Point {
  x: number;
  y: number;
}

interface StrokeAttempt {
  points: Point[];
}

interface ValidationResult {
  show: boolean;
  isValid: boolean;
  confidence: number;
}

interface UseWritingPracticeReturn {
  selectedCharacter: BaybayinCharacter;
  setSelectedCharacter: (character: BaybayinCharacter) => void;
  strokes: number;
  currentStroke: number;
  isComplete: boolean;
  overallAccuracy: number;
  strokeAttempts: StrokeAttempt[];
  validationResult: ValidationResult;
  handleCanvasClear: () => void;
  handleStrokeComplete: (points: Point[]) => void;
  handleReset: () => void;
  getTargetPoints: (strokeIndex: number) => Point[];
  clearValidation: () => void;
}

const allCharacters = getWritingCharacters();
initializeRecognizer(allCharacters);

export const useWritingPractice = (): UseWritingPracticeReturn => {
  const ACCURACY_THRESHOLD = 60;
  const [selectedCharacter, setSelectedCharacter] = useState<BaybayinCharacter>(
    allCharacters[0]
  );
  const [completedStrokes, setCompletedStrokes] = useState<Point[][]>([]);
  const [strokeAttempts, setStrokeAttempts] = useState<StrokeAttempt[]>([]);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    show: false,
    isValid: false,
    confidence: 0,
  });
  const [shouldResetCanvas, setShouldResetCanvas] = useState<boolean>(false);

  // Refs to avoid stale closures
  const completedStrokesRef = useRef<Point[][]>([]);
  const strokeAttemptsRef = useRef<StrokeAttempt[]>([]);
  const errorTimeoutRef = useRef<number | null>(null);
  const autoResetTimeoutRef = useRef<number | null>(null);

  const strokes = selectedCharacter.strokes.length;
  const currentStroke = completedStrokes.length;
  const isComplete = completedStrokes.length === strokes;

  useEffect(() => {
    completedStrokesRef.current = completedStrokes;
  }, [completedStrokes]);

  useEffect(() => {
    strokeAttemptsRef.current = strokeAttempts;
  }, [strokeAttempts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      if (autoResetTimeoutRef.current) {
        clearTimeout(autoResetTimeoutRef.current);
      }
    };
  }, []);

  // Register the current character when it changes
  useEffect(() => {
    const strokePoints = selectedCharacter.strokes.map((stroke) =>
      parseSVGPath(stroke.path)
    );
    registerCharacterStrokes(selectedCharacter.id, strokePoints);

    console.log(
      `Registered character: ${selectedCharacter.latin} with ${selectedCharacter.strokes.length} strokes`
    );
  }, [
    selectedCharacter.id,
    selectedCharacter.latin,
    selectedCharacter.strokes,
  ]);

  // Reset when character changes
  useEffect(() => {
    console.log(`Character changed to: ${selectedCharacter.latin}`);
    handleReset();
  }, [selectedCharacter.id]);

  const getTargetPoints = useCallback(
    (strokeIndex: number): Point[] => {
      if (strokeIndex >= selectedCharacter.strokes.length) return [];
      return parseSVGPath(selectedCharacter.strokes[strokeIndex].path);
    },
    [selectedCharacter]
  );

  const clearValidation = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
    }
    setValidationResult({ show: false, isValid: false, confidence: 0 });
    setShouldResetCanvas(false);
  }, []);

  const handleReset = useCallback(() => {
    console.log(`Resetting all progress for ${selectedCharacter.latin}`);
    setCompletedStrokes([]);
    setStrokeAttempts([]);
    setOverallAccuracy(0);
    setValidationResult({ show: false, isValid: false, confidence: 0 });
    setShouldResetCanvas(false);
    completedStrokesRef.current = [];
    strokeAttemptsRef.current = [];
    resetReferenceFrames();

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
    }
  }, [selectedCharacter.latin]);

  const handleStrokeComplete = useCallback(
    (points: Point[]) => {
      if (points.length === 0) {
        console.log(`Reset signal received, clearing all progress`);
        setCompletedStrokes([]);
        setStrokeAttempts([]);
        setOverallAccuracy(0);
        setValidationResult({ show: false, isValid: false, confidence: 0 });
        completedStrokesRef.current = [];
        strokeAttemptsRef.current = [];
        resetReferenceFrames();
        return;
      }

      const currentCompletedStrokes = completedStrokesRef.current;
      const currentStrokeIndex = currentCompletedStrokes.length;

      console.log(`handleStrokeComplete called:`, {
        currentStrokeIndex,
        totalStrokes: strokes,
        pointsCount: points.length,
        completedCount: currentCompletedStrokes.length,
      });

      if (currentStrokeIndex >= strokes) {
        console.log(
          `Stroke ignored - already completed all ${strokes} strokes`
        );
        return;
      }

      console.log(`Stroke ${currentStrokeIndex + 1}/${strokes} completed`);

      const newCompletedStrokes = [...currentCompletedStrokes, points];
      setCompletedStrokes(newCompletedStrokes);
      completedStrokesRef.current = newCompletedStrokes;

      const newStrokeAttempts = [...strokeAttemptsRef.current];
      newStrokeAttempts[currentStrokeIndex] = { points };
      setStrokeAttempts(newStrokeAttempts);
      strokeAttemptsRef.current = newStrokeAttempts;

      console.log(
        `Progress: ${newCompletedStrokes.length}/${strokes} strokes completed`
      );

      if (currentStrokeIndex + 1 === strokes) {
        console.log(`All strokes completed! Validating complete character...`);

        const result = validateCompleteCharacter(
          newCompletedStrokes,
          selectedCharacter.id
        );

        const finalAccuracy = result.confidence;
        const isValid = finalAccuracy >= ACCURACY_THRESHOLD;

        setOverallAccuracy(finalAccuracy);

        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        if (autoResetTimeoutRef.current) {
          clearTimeout(autoResetTimeoutRef.current);
        }

        setValidationResult({
          show: true,
          isValid: isValid,
          confidence: finalAccuracy,
        });

        console.log(
          `Character "${selectedCharacter.latin}" completed with ${finalAccuracy}% accuracy - ${isValid ? "SUCCESS ✓" : "FAILURE ✗"}`
        );

        if (finalAccuracy >= 70) {
          console.log(`Excellent! Character recognized!`);
          playCorrectSound();
        } else if (finalAccuracy >= ACCURACY_THRESHOLD) {
          console.log(`Good attempt! Keep practicing!`);
          playCorrectSound();
        } else {
          console.log(`Low accuracy - will auto-reset!`);
          playIncorrectSound();
        }

        if (!isValid) {
          errorTimeoutRef.current = setTimeout(() => {
            setValidationResult({ show: false, isValid: false, confidence: 0 });

            console.log(
              `Low accuracy (${finalAccuracy}%) - Auto-resetting canvas...`
            );
            setShouldResetCanvas(true);

            autoResetTimeoutRef.current = setTimeout(() => {
              handleReset();
              setShouldResetCanvas(false);
            }, 500);
          }, 2000);
        }
      }
    },
    [strokes, selectedCharacter.id, selectedCharacter.latin, handleReset]
  );

  const handleCanvasClear = useCallback(() => {
    console.log(`Canvas cleared - resetting current stroke tracking`);
  }, []);

  const handleCharacterSelect = useCallback((character: BaybayinCharacter) => {
    console.log(
      `Selecting character: ${character.latin} (ID: ${character.id})`
    );
    setSelectedCharacter(character);
  }, []);

  return {
    selectedCharacter,
    setSelectedCharacter: handleCharacterSelect,
    strokes,
    currentStroke,
    isComplete,
    overallAccuracy,
    strokeAttempts,
    validationResult,
    handleCanvasClear,
    handleStrokeComplete,
    handleReset,
    getTargetPoints,
    clearValidation,
  };
};
