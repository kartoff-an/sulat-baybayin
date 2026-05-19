import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CharacterSelector from "../components/writing/CharacterSelector";
import StrokeGuide from "../components/writing/StrokeGuide";
import WritingCanvas from "../components/writing/WritingCanvas";
import { useWritingPractice } from "../hooks/useWritingPractice";
import { getWritingCharacters } from "../utils/writing";

import {
  borderRadius,
  borders,
  colors,
  layout,
  spacing,
  typography,
} from "../theme";

import * as Speech from "expo-speech";
import { initializeRecognizer, resetReferenceFrames } from "../utils/ndollar-recognition/ndollar-recognizer";
import { alphabetCharacters } from "../data/alphabetData";

type RootStackParamList = {
  Learn: undefined;
};

interface Point {
  x: number;
  y: number;
}

const PracticeWritingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const {
    selectedCharacter,
    setSelectedCharacter,
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
  } = useWritingPractice();

  const writingCharacters = useMemo(() => getWritingCharacters(), []);
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [canvasResetKey, setCanvasResetKey] = useState(0);
  const [shouldResetCanvas, setShouldResetCanvas] = useState(false);

  // Speak character pronunciation when selected
  useEffect(() => {
    if (selectedCharacter?.pronunciation && !isBlindMode) {
      Speech.speak(selectedCharacter.pronunciation, {
        language: "fil-PH",
        pitch: 1.0,
        rate: 0.8,
      });
    }
  }, [selectedCharacter?.id, isBlindMode]);

  // Initialize recognizer
  useEffect(() => {
    initializeRecognizer(alphabetCharacters);
    return () => {
      resetReferenceFrames();
      Speech.stop();
    };
  }, []);

  const handleNextCharacter = () => {
    const randomIndex = Math.floor(Math.random() * writingCharacters.length);
    const nextChar = writingCharacters[randomIndex];
    console.log(`Switching to character: ${nextChar.latin} (${nextChar.id})`);
    setSelectedCharacter(nextChar);
    handleReset();
    clearValidation();
    setCanvasResetKey(prev => prev + 1);
  };

  const toggleBlindMode = () => {
    setIsBlindMode((prev) => !prev);
    handleReset();
    clearValidation();
    setCanvasResetKey(prev => prev + 1);
  };

  const handleResetWithClear = () => {
    handleReset();
    clearValidation();
    setCanvasResetKey(prev => prev + 1);
  };

  const handleStrokeWrapper = (points: Point[]) => {
    handleStrokeComplete(points);
  };

  const handleResetComplete = () => {
    setShouldResetCanvas(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#6B7280" strokeWidth={1.5} />
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleBlindMode}
            style={[styles.blindToggle, isBlindMode && styles.blindToggleActive]}
            activeOpacity={0.7}
          >
            {isBlindMode ? (
              <>
                <EyeOff size={16} color="#7C3AED" strokeWidth={1.5} />
                <Text style={styles.blindToggleTextActive}>
                  {t("writing.blindMode")}
                </Text>
              </>
            ) : (
              <>
                <Eye size={16} color="#6B7280" strokeWidth={1.5} />
                <Text style={styles.blindToggleText}>
                  {t("writing.guidedMode")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Character Selector - hidden in blind mode */}
          {!isBlindMode && (
            <CharacterSelector
              selected={selectedCharacter}
              onSelect={setSelectedCharacter}
              characters={writingCharacters}
              disabled={isBlindMode}
            />
          )}

          {/* Main Content */}
          <View style={isLargeScreen ? styles.twoColumn : styles.singleColumn}>
            {/* Left Column - Stroke Guide */}
            {!isBlindMode && (
              <View style={styles.sidebar}>
                <StrokeGuide
                  character={selectedCharacter}
                  strokes={strokes}
                  currentStroke={currentStroke}
                  isComplete={isComplete}
                  accuracy={overallAccuracy}
                  onReset={handleResetWithClear}
                  strokeAttempts={strokeAttempts}
                />
              </View>
            )}

            {/* Blind Mode Info Panel */}
            {isBlindMode && (
              <View style={styles.sidebar}>
                <View style={styles.blindInfoCard}>
                  <View style={styles.blindInfoHeader}>
                    <EyeOff size={16} color="#7C3AED" strokeWidth={1.5} />
                    <Text style={styles.blindInfoTitle}>
                      {t("writing.blindPractice")}
                    </Text>
                  </View>

                  {/* Character Display */}
                  <View style={styles.blindCharacterBox}>
                    <Text style={styles.blindCharacterLabel}>
                      {t("writing.writeThisCharacter")}:
                    </Text>
                    <Text style={styles.blindCharacter}>
                      {selectedCharacter.latin.toUpperCase()}
                    </Text>
                  </View>

                  {/* Progress */}
                  <View style={styles.blindProgressSection}>
                    <View style={styles.blindProgressHeader}>
                      <Text style={styles.blindProgressLabel}>
                        {t("writing.progress")}
                      </Text>
                      <Text style={styles.blindProgressValue}>
                        {currentStroke}/{strokes} strokes
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${strokes > 0 ? (currentStroke / strokes) * 100 : 0}%`,
                            backgroundColor: "#7C3AED",
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Overall Accuracy */}
                  {isComplete && (
                    <View style={styles.blindAccuracySection}>
                      <View style={styles.blindAccuracyHeader}>
                        <Text style={styles.blindAccuracyLabel}>
                          {t("writing.overallAccuracy")}
                        </Text>
                        <Text
                          style={[
                            styles.blindAccuracyValue,
                            overallAccuracy >= 70 && styles.accuracyHigh,
                            overallAccuracy >= 50 && overallAccuracy < 70 && styles.accuracyMedium,
                            overallAccuracy < 50 && styles.accuracyLow,
                          ]}
                        >
                          {Math.round(overallAccuracy)}%
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${overallAccuracy}%`,
                              backgroundColor:
                                overallAccuracy >= 70
                                  ? "#10B981"
                                  : overallAccuracy >= 50
                                    ? "#F59E0B"
                                    : "#EF4444",
                            },
                          ]}
                        />
                      </View>
                      {overallAccuracy >= 70 && (
                        <Text style={styles.encouragementText}>
                          {t("writing.excellentWork")}
                        </Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleResetWithClear}
                    style={styles.resetButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.resetButtonText}>
                      {t("writing.resetPractice")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Canvas */}
            <View style={styles.canvasContainer}>
              <WritingCanvas
                key={canvasResetKey}
                character={selectedCharacter}
                strokes={strokes}
                currentStroke={currentStroke}
                onStrokeComplete={handleStrokeWrapper}
                onClear={handleCanvasClear}
                isComplete={isComplete}
                getTargetPoints={getTargetPoints}
                isBlindMode={isBlindMode}
                onNextCharacter={handleNextCharacter}
                validationResult={validationResult}
                shouldReset={shouldResetCanvas}
                onResetComplete={handleResetComplete}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  blindToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceTertiary,
    ...borders.normal,
  },
  blindToggleActive: {
    backgroundColor: colors.accentLight,
    borderColor: "#DDD6FE",
  },
  blindToggleText: {
    ...typography.buttonSmall,
    color: colors.textTertiary,
  },
  blindToggleTextActive: {
    ...typography.buttonSmall,
    color: colors.accentDark,
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
    maxWidth: layout.maxWideContentWidth,
    alignSelf: "center",
    width: "100%",
  },
  singleColumn: {
    gap: spacing.lg,
  },
  twoColumn: {
    flexDirection: "row",
    gap: spacing.xxl,
  },
  sidebar: {
    width: '100%',
  },
  canvasContainer: {
    flex: 1,
    minWidth: 300,
  },
  blindInfoCard: {
    backgroundColor: colors.blindBg,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...borders.thin,
    borderColor: colors.blindBorder,
  },
  blindInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  blindInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.blindText,
  },
  blindCharacterBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...borders.thin,
    borderColor: colors.blindBorder,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  blindCharacterLabel: {
    ...typography.labelSmall,
    marginBottom: spacing.xs,
  },
  blindCharacter: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.blindAccent,
    textAlign: "center",
  },
  blindBaybayin: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  blindProgressSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.blindBorder,
  },
  blindProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  blindProgressLabel: {
    ...typography.labelSmall,
  },
  blindProgressValue: {
    ...typography.labelSmall,
    fontWeight: "600",
    color: colors.blindAccent,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  blindAccuracySection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.blindBorder,
  },
  blindAccuracyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  blindAccuracyLabel: {
    ...typography.labelSmall,
  },
  blindAccuracyValue: {
    ...typography.labelSmall,
    fontWeight: "700",
  },
  accuracyHigh: {
    color: colors.successDark,
  },
  accuracyMedium: {
    color: colors.warningDark,
  },
  accuracyLow: {
    color: colors.errorDark,
  },
  encouragementText: {
    fontSize: 11,
    color: colors.successDark,
    marginTop: 6,
    textAlign: "center",
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...borders.thin,
    borderColor: colors.blindBorder,
    alignItems: "center",
  },
  resetButtonText: {
    ...typography.buttonSmall,
    color: colors.blindAccent,
  },
});

export default PracticeWritingScreen;