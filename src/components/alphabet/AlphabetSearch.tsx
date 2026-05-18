import { Search } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { borderRadius, borders, colors, spacing } from "../../theme";

interface AlphabetSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const AlphabetSearch: React.FC<AlphabetSearchProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Search
        size={16}
        color={colors.textPlaceholder}
        strokeWidth={1.5}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t("alphabet.search")}
        placeholderTextColor={colors.textPlaceholder}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...borders.thin,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "400",
    padding: 0,
  },
});

export default AlphabetSearch;
