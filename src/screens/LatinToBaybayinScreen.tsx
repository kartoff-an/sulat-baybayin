import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DifficultySelection from "../components/transliteration/DifficultySelection";
import ExerciseArea from "../components/transliteration/ExerciseArea";
import { useTransliterationExercise } from "../hooks/useTransliterationExercise";
import { ExerciseDirection } from "../types/transliteration";

import { borders, colors, layout, spacing, typography } from "../theme";

type RootStackParamList = {
  Learn: undefined;
};

const LatinToBaybayinScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const {
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
  } = useTransliterationExercise(ExerciseDirection.LATIN_TO_BAYBAYIN);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#6B7280" strokeWidth={1.5} />
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Page Header */}
            <View style={styles.pageHeader}>
              <Text style={styles.title}>
                {t("learn.options.latinToBaybayin.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("learn.options.latinToBaybayin.description")}
              </Text>
            </View>

            {/* Content */}
            {!isDifficultySelected ? (
              <DifficultySelection onSelect={handleDifficultySelect} />
            ) : (
              <ExerciseArea
                exercise={currentExercise}
                userAnswer={userAnswer}
                onAnswerChange={setUserAnswer}
                onSubmit={handleSubmit}
                onNext={handleNext}
                onHint={handleHint}
                feedback={feedback}
                isCorrect={isCorrect}
                isSubmitted={isSubmitted}
                score={score}
                totalAttempts={totalAttempts}
                difficulty={difficulty}
                onChangeDifficulty={handleChangeDifficulty}
                direction={ExerciseDirection.LATIN_TO_BAYBAYIN}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    ...borders.thin,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textTertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.contentPaddingTop,
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    width: "100%",
  },
  pageHeader: {
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
  },
});

export default LatinToBaybayinScreen;
