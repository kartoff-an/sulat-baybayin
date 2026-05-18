import {
  ArrowRight,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../../theme";

import { Difficulty } from "../../types/transliteration";

interface DifficultySelectionProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelection: React.FC<
  DifficultySelectionProps
> = ({ onSelect }) => {
  const { t } = useTranslation();

  const difficulties = [
    {
      value: Difficulty.BEGINNER,
      label: t("practice.difficulty.beginner.label"),
      description: t(
        "practice.difficulty.beginner.description"
      ),
      icon: Sparkles,
      color: colors.primary,
    },
    {
      value: Difficulty.INTERMEDIATE,
      label: t(
        "practice.difficulty.intermediate.label"
      ),
      description: t(
        "practice.difficulty.intermediate.description"
      ),
      icon: Zap,
      color: colors.success,
    },
    {
      value: Difficulty.ADVANCED,
      label: t("practice.difficulty.advanced.label"),
      description: t(
        "practice.difficulty.advanced.description"
      ),
      icon: Flame,
      color: colors.accent,
    },
  ];

  return (
    <View style={styles.container}>
      {difficulties.map((difficulty, index) => (
        <TouchableOpacity
          key={difficulty.value}
          onPress={() => onSelect(difficulty.value)}
          activeOpacity={0.7}
          style={[
            styles.row,
            index !== difficulties.length - 1 &&
            styles.rowBorder,
          ]}
        >
          {/* Icon Column */}
          <View style={styles.iconColumn}>
            <difficulty.icon
              size={20}
              color={difficulty.color}
              strokeWidth={1.7}
            />

            {index !== difficulties.length - 1 && (
              <View style={styles.connector} />
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.label}>
                {difficulty.label}
              </Text>

              <ArrowRight
                size={15}
                color={colors.textDisabled}
                strokeWidth={1.8}
              />
            </View>

            <Text
              style={styles.description}
              numberOfLines={2}
            >
              {difficulty.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.xl,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  iconColumn: {
    width: 32,
    alignItems: "center",
    marginRight: spacing.lg,
  },

  connector: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    opacity: 0.7,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  label: {
    ...typography.cardTitle,
  },

  description: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    lineHeight: 20,
    paddingRight: spacing.lg,
  },
});

export default DifficultySelection;