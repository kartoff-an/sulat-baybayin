import { CheckCircle, ChevronRight, RefreshCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import {
  borderRadius,
  borders,
  colors,
  spacing,
  typography,
} from "../../theme";
import { type BaybayinCharacter } from "../../types/alphabet";
import { parseSVGPath } from "../../utils/writing";

interface StrokeAttempt {
  points: { x: number; y: number }[];
  accuracy?: number;
}

interface StrokeGuideProps {
  character: BaybayinCharacter;
  strokes: number;
  currentStroke: number;
  isComplete: boolean;
  accuracy: number;
  onReset: () => void;
  strokeAttempts: StrokeAttempt[];
}

const CANVAS_SIZE = 120;
const STROKE_COLORS = ["#006D77", "#2C7DA0", "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7"];

const StrokeGuide: React.FC<StrokeGuideProps> = ({
  character,
  strokes,
  currentStroke,
  isComplete,
  accuracy,
  onReset,
  strokeAttempts,
}) => {
  const { t } = useTranslation();
  const [selectedStroke, setSelectedStroke] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  // Update selected stroke when currentStroke changes
  useEffect(() => {
    setSelectedStroke(currentStroke);
  }, [character.id, currentStroke, strokeAttempts.length]);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return colors.success;
    if (acc >= 50) return colors.warning;
    return colors.error;
  };

  const getAccuracyBackground = (acc: number) => {
    if (acc >= 80) return colors.successLight;
    if (acc >= 50) return colors.warningLight;
    return colors.errorLight;
  };

  const getBounds = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100, width: 100, height: 100 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    const width = maxX - minX;
    const height = maxY - minY;
    return { minX, maxX, minY, maxY, width: width || 100, height: height || 100 };
  };

  const transformPath = (pathData: string, scale: number, offsetX: number, offsetY: number): string => {
    if (!pathData) return "";
    const transformed = pathData.replace(
      /([ML])(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/g,
      (match, cmd, x, y) => {
        const newX = parseFloat(x) * scale + offsetX;
        const newY = parseFloat(y) * scale + offsetY;
        return `${cmd} ${newX},${newY}`;
      }
    );
    return transformed;
  };

  const getArrowPath = (
    points: { x: number; y: number }[],
    scale: number,
    offsetX: number,
    offsetY: number
  ): string => {
    if (points.length < 2) return "";

    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    const arrowSize = 8;
    const x = p2.x * scale + offsetX;
    const y = p2.y * scale + offsetY;
    const angle1 = angle + Math.PI * 0.8;
    const angle2 = angle - Math.PI * 0.8;

    const x1 = x + Math.cos(angle1) * arrowSize;
    const y1 = y + Math.sin(angle1) * arrowSize;
    const x2 = x + Math.cos(angle2) * arrowSize;
    const y2 = y + Math.sin(angle2) * arrowSize;

    return `M${x1},${y1} L${x},${y} L${x2},${y2}`;
  };

  const renderStrokePreview = () => {
    const stroke = character.strokes[selectedStroke];
    if (!stroke || !stroke.path) return null;

    const pathData = stroke.path;
    const points = parseSVGPath(pathData);

    if (points.length === 0) return null;

    const bounds = getBounds(points);
    const scale = Math.min(
      CANVAS_SIZE / (bounds.width + 20),
      CANVAS_SIZE / (bounds.height + 20)
    );
    const offsetX = (CANVAS_SIZE - bounds.width * scale) / 2 - bounds.minX * scale;
    const offsetY = (CANVAS_SIZE - bounds.height * scale) / 2 - bounds.minY * scale;

    return (
      <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}>
        <Rect
          x={0}
          y={0}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          fill={colors.surfaceSecondary}
          rx={8}
        />

        <Path
          d={`M${CANVAS_SIZE / 2} 0 L${CANVAS_SIZE / 2} ${CANVAS_SIZE}
              M0 ${CANVAS_SIZE / 2} L${CANVAS_SIZE} ${CANVAS_SIZE / 2}`}
          stroke={colors.border}
          strokeWidth={0.5}
          opacity={0.5}
        />

        {points.length > 0 && (
          <Circle
            cx={points[0].x * scale + offsetX}
            cy={points[0].y * scale + offsetY}
            r={4}
            fill="#10B981"
            stroke={colors.surface}
            strokeWidth={1.5}
          />
        )}

        <Path
          d={transformPath(pathData, scale, offsetX, offsetY)}
          fill="transparent"
          stroke={STROKE_COLORS[selectedStroke % STROKE_COLORS.length]}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.length > 1 && (
          <Circle
            cx={points[points.length - 1].x * scale + offsetX}
            cy={points[points.length - 1].y * scale + offsetY}
            r={3}
            fill={STROKE_COLORS[selectedStroke % STROKE_COLORS.length]}
            stroke={colors.surface}
            strokeWidth={1.5}
          />
        )}

        {points.length > 1 && (
          <Path
            d={getArrowPath(points, scale, offsetX, offsetY)}
            fill={STROKE_COLORS[selectedStroke % STROKE_COLORS.length]}
            opacity={0.7}
          />
        )}
      </Svg>
    );
  };

  const overallColor = getAccuracyColor(accuracy);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t("writing.strokeGuide")}</Text>
          <Text style={styles.subtitle}>
            {character.latin.toUpperCase()} - {character.baybayin}
          </Text>
        </View>
        <TouchableOpacity onPress={onReset} style={styles.resetButton} activeOpacity={0.7}>
          <RefreshCw size={14} color={colors.textTertiary} strokeWidth={1.5} />
          <Text style={styles.resetText}>{t("common.reset")}</Text>
        </TouchableOpacity>
      </View>

      {/* Overall Accuracy Section - only shown when complete */}
      {isComplete && (
        <View style={styles.accuracySection}>
          <View style={styles.accuracyHeader}>
            <Text style={styles.accuracyLabel}>{t("writing.overallAccuracy")}</Text>
            <View style={[styles.accuracyBadge, { backgroundColor: getAccuracyBackground(accuracy) }]}>
              <Text style={[styles.accuracyBadgeText, { color: overallColor }]}>
                {Math.round(accuracy)}%
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${accuracy}%`, backgroundColor: overallColor },
              ]}
            />
          </View>
          {isComplete && (
            <Text style={[styles.accuracyMessage, { color: overallColor }]}>
              {accuracy >= 80 ? t("writing.characterMastered") :
                accuracy >= 50 ? t("writing.keepPracticing") :
                  t("writing.keepImproving")}
            </Text>
          )}
        </View>
      )}

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{t("writing.progress")}</Text>
          <Text style={styles.progressValue}>
            {t("writing.strokeProgress", {
              currentStroke,
              strokes,
            })}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStroke / strokes) * 100}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
      </View>

      {/* Toggle Details Button */}
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        style={styles.toggleButton}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>
          {showDetails ? t("writing.hideStrokeDetails") : t("writing.showStrokeDetails")}
        </Text>
        <ChevronRight
          size={12}
          color={colors.textTertiary}
          strokeWidth={1.5}
          style={[styles.toggleIcon, !showDetails && styles.toggleIconRotated]}
        />
      </TouchableOpacity>

      {/* Stroke List */}
      {showDetails && (
        <View style={styles.strokeList}>
          {character.strokes.map((stroke, index) => {
            const isCompleted = index < strokeAttempts.length;
            const isCurrent = index === currentStroke;

            let statusBadge: { text: string; color: string; bg: string } | null = null;
            if (isCompleted) {
              statusBadge = { text: "✓", color: colors.success, bg: colors.successLight };
            } else if (isCurrent) {
              statusBadge = { text: "●", color: colors.primary, bg: colors.primaryLight };
            }

            return (
              <TouchableOpacity
                key={stroke.id}
                onPress={() => setSelectedStroke(index)}
                style={[
                  styles.strokeItem,
                  isCompleted && styles.strokeItemCompleted,
                  isCurrent && styles.strokeItemCurrent,
                  selectedStroke === index && styles.strokeItemSelected,
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.strokeNumber,
                    statusBadge && { backgroundColor: statusBadge.bg, borderColor: statusBadge.color },
                    isCurrent && styles.strokeNumberCurrent,
                    selectedStroke === index && styles.strokeNumberSelected,
                  ]}
                >
                  {statusBadge ? (
                    <Text style={[styles.strokeNumberText, { color: statusBadge.color }]}>
                      {statusBadge.text}
                    </Text>
                  ) : (
                    <Text style={styles.strokeNumberText}>{index + 1}</Text>
                  )}
                </View>

                <View style={styles.strokeInfo}>
                  <Text
                    style={[
                      styles.strokeDirection,
                      isCurrent && styles.strokeDirectionCurrent,
                      isCompleted && styles.strokeDirectionCompleted,
                    ]}
                  >
                    {stroke.direction}
                  </Text>
                  <Text
                    style={[
                      styles.strokeDescription,
                      isCurrent && styles.strokeDescriptionCurrent,
                      isCompleted && styles.strokeDescriptionCompleted,
                    ]}
                    numberOfLines={1}
                  >
                    {stroke.description}
                  </Text>
                </View>

                {/* Current indicator */}
                {isCurrent && !isCompleted && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>{t("common.current")}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Stroke Preview */}
      {showDetails && character.strokes[selectedStroke] && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            {t("writing.strokePreview", { number: selectedStroke + 1 })}
          </Text>
          <View style={styles.previewContainer}>
            {renderStrokePreview()}
            <View style={styles.previewInfo}>
              <Text style={styles.previewDirection}>
                {character.strokes[selectedStroke]?.direction}
              </Text>
              <Text style={styles.previewDescription}>
                {character.strokes[selectedStroke]?.description}
              </Text>
              {selectedStroke === currentStroke && !isComplete && (
                <View style={styles.currentStrokeHint}>
                  <CheckCircle size={12} color={colors.primary} strokeWidth={1.5} />
                  <Text style={styles.currentStrokeHintText}>
                    {t("writing.drawStrokeNext")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...borders.thin,
    maxHeight: 600,
    width: '100%',
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  resetText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  accuracySection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  accuracyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  accuracyLabel: {
    ...typography.labelSmall,
  },
  accuracyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  accuracyBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  accuracyMessage: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
  },
  progressSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    ...typography.labelSmall,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  toggleButtonText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  toggleIcon: {
    transform: [{ rotate: "0deg" }],
  },
  toggleIconRotated: {
    transform: [{ rotate: "90deg" }],
  },
  strokeList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
    maxHeight: 280,
  },
  strokeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
  },
  strokeItemCompleted: {
    backgroundColor: colors.surfaceSecondary,
  },
  strokeItemCurrent: {
    backgroundColor: colors.primaryLight,
  },
  strokeItemSelected: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  strokeNumber: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  strokeNumberCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  strokeNumberSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  strokeNumberText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  strokeInfo: {
    flex: 1,
  },
  strokeDirection: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  strokeDirectionCurrent: {
    fontWeight: "700",
    color: colors.primary,
  },
  strokeDirectionCompleted: {
    color: colors.textTertiary,
  },
  strokeDescription: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 1,
  },
  strokeDescriptionCurrent: {
    color: colors.textSecondary,
  },
  strokeDescriptionCompleted: {
    color: colors.textDisabled,
  },
  currentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.surface,
  },
  previewSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderLight,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  previewContainer: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  previewInfo: {
    flex: 1,
  },
  previewDirection: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },
  previewDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  currentStrokeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderLight,
  },
  currentStrokeHintText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "500",
  },
  completionSection: {
    marginTop: spacing.md,
  },
  completionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...borders.thin,
  },
  completionContent: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  completionMessage: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
});

export default StrokeGuide;