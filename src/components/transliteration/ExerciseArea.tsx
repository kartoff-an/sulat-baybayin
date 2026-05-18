import {
  ArrowRight,
  CheckCircle,
  Keyboard,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  XCircle,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard as RNKeyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  borders,
  colors,
  spacing,
  typography,
} from "../../theme";
import {
  type ExerciseFeedback,
  type TransliterationExercise as ExerciseType,
  Difficulty,
  ExerciseDirection,
} from "../../types/transliteration";
import { playCorrectSound, playHintSound, playIncorrectSound } from "../../utils/sound";
import * as Speech from "expo-speech";

interface ExerciseAreaProps {
  exercise: ExerciseType | null;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onHint: () => void;
  feedback: ExerciseFeedback | null;
  isCorrect: boolean;
  isSubmitted: boolean;
  score: number;
  totalAttempts: number;
  difficulty: Difficulty;
  onChangeDifficulty: () => void;
  direction: ExerciseDirection;
}

const ExerciseArea: React.FC<ExerciseAreaProps> = ({
  exercise,
  userAnswer,
  onAnswerChange,
  onSubmit,
  onNext,
  onHint,
  feedback,
  isCorrect,
  isSubmitted,
  score,
  difficulty,
  totalAttempts,
  onChangeDifficulty,
  direction,
}) => {
  const { t } = useTranslation();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [previousSubmitted, setPreviousSubmitted] = useState(false);
  const [hasSpokenAnswer, setHasSpokenAnswer] = useState(false);
  const [answerPressed, setAnswerPressed] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  useEffect(() => {
    if (isSubmitted && !previousSubmitted) {
      if (isCorrect) {
        playCorrectSound();
        setTimeout(() => {
          if (exercise?.prompt && !hasSpokenAnswer) {
            speakText(exercise.prompt);
            setHasSpokenAnswer(true);
          }
        }, 500);
      } else {
        playIncorrectSound();
      }
    }
    setPreviousSubmitted(isSubmitted);

    if (!isSubmitted) {
      setHasSpokenAnswer(false);
      setAnswerPressed(false);
    }
  }, [isSubmitted, isCorrect]);

  useEffect(() => {
    const keyboardDidHideListener = RNKeyboard.addListener('keyboardDidHide', () => {
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const speakText = async (text: string) => {
    try {
      await Speech.speak(text, {
        language: 'fil-PH',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  };

  const handleSpeakAnswer = () => {
    if (exercise?.prompt) {
      speakText(exercise.prompt);
    }
  };

  const handleShowCorrectAnswer = () => {
    if (feedback?.details && feedback.details.includes(t("practice.exercise.correctAnswer"))) {
      const correctAnswer = feedback.details.replace(t("practice.exercise.correctAnswer"), "").trim();
      if (correctAnswer) {
        speakText(correctAnswer);
      }
    }
    setAnswerPressed(true);
  };

  const getDifficultyLabel = (difficulty: Difficulty): string | undefined => {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return t("practice.difficulty.beginner.label");
      case Difficulty.INTERMEDIATE:
        return t("practice.difficulty.intermediate.label");
      case Difficulty.ADVANCED:
        return t("practice.difficulty.advanced.label");
    }
    return undefined;
  };

  const getPlaceholderText = (): string => {
    if (direction === ExerciseDirection.BAYBAYIN_TO_LATIN) {
      return t("practice.exercise.typeAnswer", { script: "Latin" });
    }
    return t("practice.exercise.typeAnswer", { script: "Baybayin" });
  };

  const handleKeyboardCharacter = (character: string) => {
    if (!isSubmitted) {
      if (character === "BACKSPACE") {
        onAnswerChange(userAnswer.slice(0, -1));
      } else {
        const newAnswer = userAnswer + character;
        onAnswerChange(newAnswer);
      }
    }
  };

  const handleSubmit = () => {
    RNKeyboard.dismiss();
    onSubmit();
  };

  const handleNext = () => {
    setHasSpokenAnswer(false);
    setAnswerPressed(false);
    onNext();
  };

  const handleHint = () => {
    playHintSound();
    onHint();
  };

  if (!exercise) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>ᜊ</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {t("practice.exercise.noExercises")}
        </Text>
        <Text style={styles.emptyDescription}>
          {t("practice.exercise.noExercisesMessage")}
        </Text>
        <TouchableOpacity
          onPress={onChangeDifficulty}
          style={styles.changeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.changeButtonText}>
            {t("practice.exercise.changeDifficulty")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLeft}>
          <View style={styles.statItem}>
            <Trophy size={16} color={colors.primary} strokeWidth={1.5} />
            <Text style={styles.statLabel}>{t("practice.exercise.score")}</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Target size={16} color={colors.accent} strokeWidth={1.5} />
            <Text style={styles.statLabel}>
              {t("practice.exercise.accuracy")}
            </Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
        </View>

        <View style={styles.progressRight}>
          <Text style={styles.attemptsText}>
            {totalAttempts === 1
              ? t("practice.exercise.attempts", { count: totalAttempts })
              : t("practice.exercise.attempts_plural", {
                count: totalAttempts,
              })}
          </Text>
          <TouchableOpacity
            onPress={onChangeDifficulty}
            style={styles.changeButtonSmall}
            activeOpacity={0.7}
          >
            <Text style={styles.changeButtonSmallText}>
              {t("practice.exercise.changeDifficulty")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Section */}
      <View style={styles.exerciseContainer}>
        {/* Difficulty Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getDifficultyLabel(difficulty)}</Text>
        </View>

        {/* Exercise Prompt with Speak Button */}
        <Text style={styles.directionText}>
          {direction === ExerciseDirection.BAYBAYIN_TO_LATIN
            ? t("practice.exercise.convertDirection", {
              from: "Baybayin",
              to: "Latin",
            })
            : t("practice.exercise.convertDirection", {
              from: "Latin",
              to: "Baybayin",
            })}
        </Text>
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{exercise.prompt}</Text>
          <TouchableOpacity
            onPress={handleSpeakAnswer}
            style={styles.speakButton}
            activeOpacity={0.7}
          >
            <Volume2 size={18} color={colors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Answer Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>
              {t("practice.exercise.yourAnswer")}
            </Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              value={userAnswer}
              onChangeText={onAnswerChange}
              editable={!isSubmitted}
              placeholder={getPlaceholderText()}
              placeholderTextColor={colors.textPlaceholder}
              style={[
                styles.input,
                isSubmitted && isCorrect && styles.inputCorrect,
                isSubmitted && !isCorrect && styles.inputIncorrect,
              ]}
              onSubmitEditing={isSubmitted ? handleNext : handleSubmit}
              returnKeyType={isSubmitted ? "next" : "done"}
            />
            {isSubmitted && (
              <View style={styles.inputIcon}>
                {isCorrect ? (
                  <CheckCircle
                    size={20}
                    color={colors.success}
                    strokeWidth={1.5}
                  />
                ) : (
                  <XCircle size={20} color={colors.error} strokeWidth={1.5} />
                )}
              </View>
            )}
          </View>
        </View>

        {/* Feedback */}
        {feedback && (
          <View
            style={[
              styles.feedback,
              isSubmitted && isCorrect && styles.feedbackCorrect,
              isSubmitted && !isCorrect && styles.feedbackIncorrect,
            ]}
          >
            <View style={styles.feedbackContent}>
              <Text
                style={[
                  styles.feedbackTitle,
                  isSubmitted && isCorrect && styles.feedbackTitleCorrect,
                  isSubmitted && !isCorrect && styles.feedbackTitleIncorrect,
                ]}
              >
                {feedback.message}
              </Text>
              <Text style={styles.feedbackDetails}>{feedback.details}</Text>
            </View>
            {isSubmitted && !isCorrect && feedback.message.includes(t("practice.exercise.incorrect")) && (
              <TouchableOpacity
                onPress={handleShowCorrectAnswer}
                style={styles.listenButton}
                activeOpacity={0.7}
              >
                <Volume2 size={16} color={colors.primary} strokeWidth={1.5} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!isSubmitted && (
            <TouchableOpacity
              onPress={handleHint}
              style={styles.hintButton}
              activeOpacity={0.7}
            >
              <Lightbulb size={16} color={colors.warning} strokeWidth={1.5} />
              <Text style={styles.hintButtonText}>
                {t("practice.exercise.showHint")}
              </Text>
            </TouchableOpacity>
          )}

          {!isSubmitted ? (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!userAnswer.trim()}
              style={[
                styles.submitButton,
                !userAnswer.trim() && styles.submitButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>
                {t("practice.exercise.checkAnswer")}
              </Text>
              <ArrowRight size={16} color={colors.surface} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              style={styles.nextButton}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>{t("common.next")}</Text>
              <RotateCcw size={16} color={colors.surface} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Keyboard Shortcut Hint */}
        <Text style={styles.shortcutHint}>
          {isSubmitted
            ? t("practice.exercise.pressEnter", {
              action: t("practice.exercise.continue"),
            })
            : t("practice.exercise.pressEnter", {
              action: t("practice.exercise.check"),
            })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...borders.thin,
  },
  emptyIconText: {
    fontSize: 28,
    color: colors.textPlaceholder,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginBottom: spacing.xxl,
    textAlign: "center",
  },
  changeButton: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  progressContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...borders.thin,
  },
  progressLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: "400",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  progressRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderLight,
  },
  attemptsText: {
    fontSize: 12,
    color: colors.textPlaceholder,
    fontWeight: "400",
  },
  changeButtonSmall: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
  },
  changeButtonSmallText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  exerciseContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xxl,
    ...borders.thin,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textTertiary,
  },
  directionText: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    fontWeight: "400",
  },
  promptContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xxl,
    ...borders.thin,
    padding: spacing.xxxl,
    alignItems: "center",
    marginBottom: spacing.xxl,
    position: "relative",
  },
  promptText: {
    fontSize: 56,
    color: colors.textPrimary,
    lineHeight: 64,
  },
  speakButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...borders.normal,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.label,
  },
  keyboardToggle: {
    padding: 6,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    ...borders.thin,
  },
  keyboardToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    ...borders.normal,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: "400",
    backgroundColor: colors.surface,
  },
  inputCorrect: {
    borderColor: "#6EE7B7",
    backgroundColor: colors.successLight,
  },
  inputIncorrect: {
    borderColor: "#FCA5A5",
    backgroundColor: colors.errorLight,
  },
  inputIcon: {
    position: "absolute",
    right: spacing.md,
    top: 14,
  },
  feedback: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackCorrect: {
    backgroundColor: colors.successLight,
    ...borders.thin,
    borderColor: "#BBF7D0",
  },
  feedbackIncorrect: {
    backgroundColor: colors.errorLight,
    ...borders.thin,
    borderColor: "#FECACA",
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  feedbackTitleCorrect: {
    color: colors.successDark,
  },
  feedbackTitleIncorrect: {
    color: colors.errorDark,
  },
  feedbackDetails: {
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  listenButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hintButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    ...borders.thin,
  },
  hintButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textTertiary,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.surface,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    marginLeft: "auto",
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.surface,
  },
  shortcutHint: {
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: 11,
    color: colors.textPlaceholder,
  },
});

export default ExerciseArea;