import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlphabetCategoryFilter from "../components/alphabet/AlphabetCategoryFilter";
import AlphabetGrid from "../components/alphabet/AlphabetGrid";
import AlphabetSearch from "../components/alphabet/AlphabetSearch";
import { useAlphabetFilter } from "../hooks/useAlphabetFilter";

import {
  borderRadius,
  borders,
  colors,
  layout,
  spacing,
  typography,
} from "../theme";

type RootStackParamList = {
  Learn: undefined;
};

const AlphabetTableScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredCharacters,
  } = useAlphabetFilter();

  return (
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
      >
        <View style={styles.content}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.title}>{t("alphabet.title")}</Text>
            <Text style={styles.subtitle}>{t("alphabet.subtitle")}</Text>
          </View>

          {/* How It Works */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {t("alphabet.howItWorks.title")}
            </Text>
            <Text style={styles.infoDescription}>
              {t("alphabet.howItWorks.description")}
            </Text>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <AlphabetSearch value={searchQuery} onChange={setSearchQuery} />
            <AlphabetCategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </View>

          {/* Character Count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {filteredCharacters.length === 1
                ? t("alphabet.showing", { count: filteredCharacters.length })
                : t("alphabet.showing_plural", {
                    count: filteredCharacters.length,
                  })}
            </Text>
          </View>

          {/* Alphabet Grid */}
          <AlphabetGrid characters={filteredCharacters} />
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
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
  },
  infoCard: {
    ...borders.thin,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  infoDescription: {
    ...typography.body,
  },
  filtersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  countContainer: {
    marginBottom: spacing.xl,
  },
  countText: {
    ...typography.sectionLabel,
  },
});

export default AlphabetTableScreen;
