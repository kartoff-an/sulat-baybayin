import { CheckCircle2, Eraser, XCircle } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { borderRadius, borders, colors, spacing } from "../../theme";
import { type BaybayinCharacter } from "../../types/alphabet";
import { parseSVGPath } from "../../utils/writing";

interface Point {
  x: number;
  y: number;
}

interface ValidationResult {
  show: boolean;
  isValid: boolean;
  confidence: number;
}

interface WritingCanvasProps {
  character: BaybayinCharacter;
  strokes: number;
  currentStroke: number;
  onStrokeComplete: (points: Point[]) => void;
  onClear: () => void;
  isComplete: boolean;
  getTargetPoints: (strokeIndex: number) => Point[];
  isBlindMode?: boolean;
  onNextCharacter?: () => void;
  validationResult?: ValidationResult;
  shouldReset?: boolean;
  onResetComplete?: () => void;
}

const CANVAS_SIZE = 340;

const WritingCanvas: React.FC<WritingCanvasProps> = ({
  character,
  currentStroke,
  onStrokeComplete,
  onClear,
  isComplete,
  getTargetPoints,
  isBlindMode = false,
  onNextCharacter,
  validationResult = { show: false, isValid: false, confidence: 0 },
  shouldReset = false,
  onResetComplete,
}) => {
  const { t } = useTranslation();
  const [completedStrokes, setCompletedStrokes] = useState<Point[][]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorConfidence, setErrorConfidence] = useState(0);

  const currentPointsRef = useRef<Point[]>([]);
  const completedStrokesRef = useRef<Point[][]>([]);
  const autoDeleteTimerRef = useRef<number | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  // Handle external reset signal
  useEffect(() => {
    if (shouldReset) {
      console.log("External reset signal received, clearing canvas");
      resetCanvas();
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [shouldReset]);

  // Handle validation result display
  useEffect(() => {
    if (validationResult.show) {
      if (validationResult.isValid) {
        setShowErrorOverlay(false);
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
          errorTimerRef.current = null;
        }
      } else {
        setErrorConfidence(validationResult.confidence);
        setShowErrorOverlay(true);

        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
        }

        errorTimerRef.current = setTimeout(() => {
          setShowErrorOverlay(false);
          if (!isDeleting) {
            deleteAllStrokes();
          }
        }, 2000);
      }
    } else {
      setShowErrorOverlay(false);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
    }
  }, [validationResult.show, validationResult.isValid, validationResult.confidence]);

  useEffect(() => {
    currentPointsRef.current = currentPoints;
  }, [currentPoints]);

  useEffect(() => {
    completedStrokesRef.current = completedStrokes;
  }, [completedStrokes]);

  useEffect(() => {
    setCompletedStrokes([]);
    completedStrokesRef.current = [];
    setCurrentPoints([]);
    currentPointsRef.current = [];
    setIsDeleting(false);
    setShowErrorOverlay(false);
    
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    if (autoDeleteTimerRef.current) {
      clearTimeout(autoDeleteTimerRef.current);
      autoDeleteTimerRef.current = null;
    }
  }, [character.id]);

  useEffect(() => {
    return () => {
      if (autoDeleteTimerRef.current) clearTimeout(autoDeleteTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const resetCanvas = () => {
    if (autoDeleteTimerRef.current) clearTimeout(autoDeleteTimerRef.current);
    setCompletedStrokes([]);
    setCurrentPoints([]);
    setIsDeleting(false);
    setShowErrorOverlay(false);
    completedStrokesRef.current = [];
    currentPointsRef.current = [];
    onClear();
  };

  const deleteAllStrokes = useCallback(() => {
    setIsDeleting(true);

    if (autoDeleteTimerRef.current) clearTimeout(autoDeleteTimerRef.current);
    autoDeleteTimerRef.current = setTimeout(() => {
      resetCanvas();
      // Signal parent to reset all progress
      onStrokeComplete([]);
      console.log("All strokes deleted, resetting everything");
    }, 500);
  }, [onStrokeComplete]);

  const handleStrokeEnd = useCallback(() => {
    const points = currentPointsRef.current;

    if (points.length < 5) {
      setCurrentPoints([]);
      currentPointsRef.current = [];
      return;
    }

    const newCompletedStrokes = [...completedStrokesRef.current, points];
    setCompletedStrokes(newCompletedStrokes);
    completedStrokesRef.current = newCompletedStrokes;

    onStrokeComplete(points);

    setCurrentPoints([]);
    currentPointsRef.current = [];
  }, [onStrokeComplete]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isComplete && !isDeleting && !validationResult.show && !showErrorOverlay,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isComplete || isDeleting || validationResult.show || showErrorOverlay) return false;
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: (evt) => {
        if (isComplete || isDeleting || validationResult.show || showErrorOverlay) return;
        const { locationX, locationY } = evt.nativeEvent;
        const point = {
          x: Math.max(0, Math.min(CANVAS_SIZE, locationX)),
          y: Math.max(0, Math.min(CANVAS_SIZE, locationY)),
        };
        currentPointsRef.current = [point];
        setCurrentPoints([point]);
      },
      onPanResponderMove: (evt) => {
        if (isComplete || isDeleting || validationResult.show || showErrorOverlay) return;
        const { locationX, locationY } = evt.nativeEvent;
        const point = {
          x: Math.max(0, Math.min(CANVAS_SIZE, locationX)),
          y: Math.max(0, Math.min(CANVAS_SIZE, locationY)),
        };
        const newPoints = [...currentPointsRef.current, point];
        currentPointsRef.current = newPoints;
        setCurrentPoints(newPoints);
      },
      onPanResponderRelease: () => {
        if (isComplete || isDeleting || validationResult.show || showErrorOverlay) return;
        handleStrokeEnd();
      },
    })
  ).current;

  const pointsToPath = useCallback((points: Point[]): string => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, []);

  const gridLines = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => (
      <React.Fragment key={`grid-${i}`}>
        <Line
          x1={i * (CANVAS_SIZE / 6)}
          y1={0}
          x2={i * (CANVAS_SIZE / 6)}
          y2={CANVAS_SIZE}
          stroke={colors.borderLight}
          strokeWidth={0.5}
        />
        <Line
          x1={0}
          y1={i * (CANVAS_SIZE / 6)}
          x2={CANVAS_SIZE}
          y2={i * (CANVAS_SIZE / 6)}
          stroke={colors.borderLight}
          strokeWidth={0.5}
        />
      </React.Fragment>
    ));
  }, []);

  const guideStrokes = React.useMemo(() => {
    if (isBlindMode) return null;

    return character.strokes.map((stroke, index) => {
      const isCompleted = index < completedStrokes.length;
      const isCurrent = index === currentStroke;
      const isNext = index === currentStroke + 1;

      let opacity = 0.1;
      let strokeWidth = 5;

      if (isCurrent) {
        opacity = 0.35;
        strokeWidth = 8;
      } else if (isNext && !isCompleted) {
        opacity = 0.15;
        strokeWidth = 5;
      } else if (!isCompleted) {
        opacity = 0.08;
        strokeWidth = 4;
      }

      const targetPoints = parseSVGPath(stroke.path);

      return (
        <React.Fragment key={stroke.id}>
          <Path
            d={stroke.path}
            fill="transparent"
            stroke={`rgba(0, 109, 119, ${opacity})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {targetPoints.length > 0 && isCurrent && (
            <Circle
              cx={targetPoints[0].x}
              cy={targetPoints[0].y}
              r={6}
              fill="rgba(0, 109, 119, 0.4)"
            />
          )}
        </React.Fragment>
      );
    });
  }, [character.strokes, currentStroke, completedStrokes.length, isBlindMode]);

  // Get validation style based on validity
  const getValidationStyle = (isValid: boolean) => {
    if (isValid) {
      return {
        bg: colors.successLight,
        border: "#A7F3D0",
        iconColor: colors.successDark,
        textColor: colors.successDark,
      };
    }
    return {
      bg: colors.errorLight,
      border: "#FECACA",
      iconColor: colors.errorDark,
      textColor: colors.errorDark,
    };
  };

  const successStyle = getValidationStyle(true);
  const errorStyle = getValidationStyle(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("writing.writingCanvas")}</Text>
        <TouchableOpacity
          onPress={deleteAllStrokes}
          disabled={isDeleting}
          style={[styles.clearButton, isDeleting && styles.clearButtonDisabled]}
          activeOpacity={0.7}
        >
          <Eraser size={14} color={colors.textTertiary} strokeWidth={1.5} />
          <Text style={styles.clearText}>{t("common.clear")}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.canvasWrapper, isBlindMode && styles.canvasWrapperBlind]}
      >
        <View {...panResponder.panHandlers} style={styles.canvasContainer}>
          <Svg
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          >
            {gridLines}
            {guideStrokes}

            {isBlindMode && (
              <SvgText
                x={CANVAS_SIZE / 2}
                y={CANVAS_SIZE / 2}
                textAnchor="middle"
                fontSize={14}
                fill="rgba(0,0,0,0.06)"
                fontWeight="600"
              >
                {t("writing.writeFromMemory")}
              </SvgText>
            )}

            {/* Completed strokes */}
            {completedStrokes.map((strokePoints, index) => {
              if (strokePoints.length < 2) return null;
              return (
                <Path
                  key={`completed-${index}`}
                  d={pointsToPath(strokePoints)}
                  fill="transparent"
                  stroke={isBlindMode ? colors.blindAccent : "#006D77"}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Current stroke being drawn */}
            {currentPoints.length > 1 && !isDeleting && !validationResult.show && !showErrorOverlay && (
              <Path
                d={pointsToPath(currentPoints)}
                fill="transparent"
                stroke={isBlindMode ? colors.blindAccent : "#006D77"}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
            )}
          </Svg>
        </View>

        {/* Success Overlay*/}
        {validationResult.show && validationResult.isValid && (
          <View
            style={[
              styles.successOverlay,
              { backgroundColor: successStyle.bg, borderColor: successStyle.border },
            ]}
          >
            <CheckCircle2 size={48} color={successStyle.iconColor} strokeWidth={1.5} />
            <View style={styles.validationContent}>
              <Text style={[styles.successTitle, { color: successStyle.textColor }]}>
                {t("writing.characterRecognized")}
              </Text>
              <Text style={[styles.validationAccuracy, { color: successStyle.textColor }]}>
                {t("writing.accuracy", { confidence: Math.round(validationResult.confidence) })}
              </Text>
            </View>
            {onNextCharacter && (
              <TouchableOpacity
                onPress={onNextCharacter}
                style={[styles.nextButton, { backgroundColor: successStyle.iconColor }]}
                activeOpacity={0.7}
              >
                <Text style={styles.nextButtonText}>{t("writing.nextCharacter")}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Error Overlay*/}
        {showErrorOverlay && !isDeleting && (
          <View
            style={[
              styles.errorOverlay,
              { backgroundColor: errorStyle.bg, borderColor: errorStyle.border },
            ]}
          >
            <XCircle size={48} color={errorStyle.iconColor} strokeWidth={1.5} />
            <View style={styles.validationContent}>
              <Text style={[styles.errorTitle, { color: errorStyle.textColor }]}>
                {t("writing.characterNotRecognized")}
              </Text>
              <Text style={[styles.resetNotice, { color: errorStyle.textColor }]}>
                {t("writing.resettingCanvas")}
              </Text>
            </View>
          </View>
        )}

        {/* Deleting overlay */}
        {isDeleting && (
          <View style={styles.deletingOverlay}>
            <XCircle size={28} color={colors.error} strokeWidth={1.5} />
            <Text style={styles.deletingText}>{t("writing.willRestart")}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={2}>
          {isDeleting
            ? t("writing.restartingCharacter")
            : isBlindMode
              ? t("writing.writeFromMemory")
              : t("writing.drawCharacter")}
        </Text>
        <View style={styles.strokeIndicator}>
          <Text style={styles.strokeIndicatorText}>
            {Math.min(currentStroke + 1, character.strokes.length)}/{character.strokes.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...borders.thin,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.lg,
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  canvasWrapper: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...borders.thin,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  canvasWrapperBlind: {
    borderColor: colors.blindBorder,
    backgroundColor: colors.blindBg,
  },
  canvasContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    zIndex: 20,
    padding: spacing.lg,
  },
  errorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    zIndex: 20,
    padding: spacing.lg,
  },
  validationContent: {
    alignItems: "center",
    gap: spacing.sm,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
  },
  validationAccuracy: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  resetNotice: {
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.sm,
    fontStyle: "italic",
  },
  nextButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(254, 242, 242, 0.95)",
    gap: spacing.md,
    zIndex: 20,
  },
  deletingText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.error,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.md,
  },
  footerText: {
    fontSize: 10,
    color: colors.textPlaceholder,
    flex: 1,
  },
  strokeIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: borderRadius.md,
  },
  strokeIndicatorText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});

export default React.memo(WritingCanvas);