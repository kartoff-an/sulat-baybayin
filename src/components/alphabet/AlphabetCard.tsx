import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { Check, Copy, Volume2, X } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, borders, colors, spacing } from "../../theme";
import type { BaybayinCharacter } from "../../types/alphabet";
import { BaybayinStroke } from "./BaybayinStroke";

interface AlphabetCardProps {
  character: BaybayinCharacter;
}

const AlphabetCard: React.FC<AlphabetCardProps> = ({ character }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const characterTranslation = t(`alphabet.characters.${character.id}`, {
    returnObjects: true,
  }) as { description: string; examples: string[] } | undefined;

  const examples = characterTranslation?.examples || character.examples;
  const description = characterTranslation?.description || "";

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(character.baybayin);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePlaySound = async () => {
    try {
      Speech.speak(character.pronunciation, {
        language: "fil-PH",
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (ttsError) {
      console.error("TTS error:", ttsError);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setIsModalVisible(true);
          handlePlaySound();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.characterRow}>
          <View style={styles.characterBox}>
            <Text style={styles.characterText}>{character.baybayin}</Text>
          </View>

          <View style={styles.characterInfo}>
            <Text style={styles.latinText}>{character.latin}</Text>
            <Text style={styles.pronunciationText}>
              /{character.pronunciation}/
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleCopy}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              {isCopied ? (
                <Check size={16} color={colors.success} strokeWidth={1.5} />
              ) : (
                <Copy
                  size={16}
                  color={colors.textPlaceholder}
                  strokeWidth={1.5}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlaySound}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Volume2
                size={16}
                color={colors.textPlaceholder}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </View>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        {examples.length > 0 && (
          <View style={styles.examplesContainer}>
            {examples.map((example: string, index: number) => (
              <View key={index} style={styles.exampleTag}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <X size={20} color={colors.textPlaceholder} strokeWidth={1.5} />
            </TouchableOpacity>

            <View style={styles.modalCharacter}>
              <Text style={styles.modalCharacterText}>
                {character.baybayin}
              </Text>
            </View>
            <Text style={styles.modalPronunciation}>
              /{character.pronunciation}/
            </Text>

            <BaybayinStroke character={character} />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...borders.thin,
  },
  characterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  characterBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    ...borders.thin,
    alignItems: "center",
    justifyContent: "center",
  },
  characterText: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  characterInfo: {
    flex: 1,
  },
  latinText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  pronunciationText: {
    fontSize: 12,
    color: colors.textPlaceholder,
    fontWeight: "400",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  examplesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  exampleTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    ...borders.thin,
  },
  exampleText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCharacter: {
    width: 80,
    height: 80,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xxxl,
    ...borders.thin,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  modalCharacterText: {
    fontSize: 36,
    color: colors.textPrimary,
  },
  modalPronunciation: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: spacing.xxl,
    fontWeight: "400",
  },
});

export default AlphabetCard;
