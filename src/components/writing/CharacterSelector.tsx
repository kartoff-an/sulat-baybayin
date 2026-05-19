import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
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
import type { BaybayinCharacter } from "../../types/alphabet";

interface CharacterSelectorProps {
  selected: BaybayinCharacter;
  onSelect: (character: BaybayinCharacter) => void;
  characters: BaybayinCharacter[];
  disabled?: boolean;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  selected,
  onSelect,
  characters,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (character: BaybayinCharacter) => {
    onSelect(character);
    setIsOpen(false);
  };

  // Group characters by category
  const groupedCharacters = characters.reduce((acc, char) => {
    const category = char.category || "consonants";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(char);
    return acc;
  }, {} as Record<string, BaybayinCharacter[]>);

  const categoryNames: Record<string, string> = {
    vowels: t("alphabet.categories.vowels"),
    consonants: t("alphabet.categories.consonants"),
    special: t("alphabet.categories.special"),
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("writing.character")}</Text>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        style={[styles.selector, disabled && styles.selectorDisabled]}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.selectorBaybayin}>{selected.baybayin}</Text>
          <Text style={styles.selectorText}>
            {selected.latin}
          </Text>
        </View>
        <ChevronDown
          size={16}
          color={colors.textPlaceholder}
          strokeWidth={1.5}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("writing.selectCharacter")}</Text>
            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {Object.entries(groupedCharacters).map(([category, chars]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryHeader}>
                    {categoryNames[category] || category}
                  </Text>
                  {chars.map((char) => (
                    <TouchableOpacity
                      key={char.id}
                      onPress={() => handleSelect(char)}
                      style={[
                        styles.modalItem,
                        char.id === selected.id && styles.modalItemActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalItemBaybayin}>
                        {char.baybayin}
                      </Text>
                      <View style={styles.modalItemInfo}>
                        <Text
                          style={[
                            styles.modalItemText,
                            char.id === selected.id && styles.modalItemTextActive,
                          ]}
                        >
                          {char.latin}
                        </Text>
                        <Text style={styles.modalItemPronunciation}>
                          {char.pronunciation}
                        </Text>
                      </View>
                      {char.id === selected.id && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>{t("common.selected")}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.sectionLabel,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    ...borders.normal,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
  },
  selectorDisabled: {
    opacity: 0.5,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectorBaybayin: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  selectorText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    letterSpacing: -0.2,
  },
  modalList: {
    maxHeight: "100%",
  },
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
    gap: 12,
  },
  modalItemActive: {
    backgroundColor: colors.surfaceTertiary,
  },
  modalItemBaybayin: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    width: 40,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  modalItemTextActive: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  modalItemPronunciation: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 1,
  },
  selectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.lg,
  },
  selectedBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.surface,
  },
});

export default CharacterSelector;