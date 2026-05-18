import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, borders, colors, spacing } from "../../theme";
import type { BaybayinCharacter } from "../../types/alphabet";
import AlphabetCard from "./AlphabetCard";

interface AlphabetGridProps {
  characters: BaybayinCharacter[];
}

const AlphabetGrid: React.FC<AlphabetGridProps> = ({ characters }) => {
  if (characters.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>ᜊ</Text>
        </View>
        <Text style={styles.emptyTitle}>No Characters Found</Text>
        <Text style={styles.emptyDescription}>
          Try adjusting your search or filter
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {characters.map((character) => (
        <AlphabetCard key={character.id} character={character} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    ...borders.thin,
  },
  emptyIconText: {
    fontSize: 20,
    color: colors.textPlaceholder,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.textPlaceholder,
    fontWeight: "400",
  },
});

export default AlphabetGrid;
