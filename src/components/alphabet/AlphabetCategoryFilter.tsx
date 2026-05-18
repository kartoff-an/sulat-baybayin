import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "../../theme";
import type { CharacterCategory } from "../../types/alphabet";

interface AlphabetCategoryFilterProps {
  selected: CharacterCategory;
  onSelect: (category: CharacterCategory) => void;
}

const AlphabetCategoryFilter: React.FC<AlphabetCategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation();

  const categories: { value: CharacterCategory; label: string }[] = [
    { value: "all", label: t("alphabet.categories.all") },
    { value: "vowels", label: t("alphabet.categories.vowels") },
    { value: "consonants", label: t("alphabet.categories.consonants") },
    { value: "special", label: t("alphabet.categories.special") },
  ];

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.value}
          onPress={() => onSelect(category.value)}
          style={[
            styles.button,
            selected === category.value && styles.activeButton,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              selected === category.value && styles.activeButtonText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    gap: 2,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  buttonText: {
    ...typography.labelSmall,
    fontWeight: "500",
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
  activeButtonText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
});

export default AlphabetCategoryFilter;
