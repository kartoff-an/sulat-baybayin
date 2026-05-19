import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { LucideIcon } from "lucide-react-native";
import {
  ArrowRight,
  BookOpen,
  Languages,
  Pen,
  Type,
} from "lucide-react-native";
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

import AppHeader from "../components/layout/AppHeader";
import BottomNav from "../components/layout/BottomNav";

import {
  borderRadius,
  colors,
  layout,
  spacing,
  typography,
} from "../theme";

type RootStackParamList = {
  Dashboard: undefined;
  Learn: undefined;
  AlphabetTable: undefined;
  PracticeWriting: undefined;
  BaybayinToLatin: undefined;
  LatinToBaybayin: undefined;
  Transliterate: undefined;
};

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: keyof RootStackParamList;
  color: string;
}

const LearnScreen: React.FC = () => {
  const { t } = useTranslation();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const insets = useSafeAreaInsets();

  const quickActions: QuickAction[] = [
    {
      id: "alphabet-table",
      title: t("learn.options.alphabetTable.title"),
      description: t("learn.options.alphabetTable.description"),
      icon: BookOpen,
      path: "AlphabetTable",
      color: colors.primary,
    },
    {
      id: "practice-writing",
      title: t("learn.options.practiceWriting.title"),
      description: t("learn.options.practiceWriting.description"),
      icon: Pen,
      path: "PracticeWriting",
      color: colors.success,
    },
    {
      id: "baybayin-to-latin",
      title: t("learn.options.baybayinToLatin.title"),
      description: t("learn.options.baybayinToLatin.description"),
      icon: Type,
      path: "BaybayinToLatin",
      color: colors.accent,
    },
    {
      id: "latin-to-baybayin",
      title: t("learn.options.latinToBaybayin.title"),
      description: t("learn.options.latinToBaybayin.description"),
      icon: Languages,
      path: "LatinToBaybayin",
      color: colors.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader paddingTop={20} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
        }}
      >
        <View style={styles.content}>
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>
              {t("learn.welcome")}
            </Text>

            <Text style={styles.title}>
              {t("learn.title")}
            </Text>

            <Text style={styles.subtitle}>
              {t("learn.subtitle")}
            </Text>
          </View>

          {/* Featured */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.featuredCard}
            onPress={() => navigation.navigate("PracticeWriting")}
          >
            <View style={styles.featuredTop}>
              <View style={styles.featuredIconLarge}>
                <Pen
                  size={22}
                  color={colors.surface}
                  strokeWidth={1.8}
                />
              </View>

              <View style={styles.featuredArrow}>
                <ArrowRight
                  size={16}
                  color={colors.primary}
                  strokeWidth={2}
                />
              </View>
            </View>

            <Text style={styles.featuredCardLabel}>
              {t("learn.continueLearning")}
            </Text>

            <Text style={styles.featuredCardTitle}>
              {t("learn.practiceWriting")}
            </Text>

            <Text style={styles.featuredCardDescription}>
              {t("learn.cardDescription")}
            </Text>
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actions}>
            <Text style={styles.sectionLabel}>
              {t("learn.quickActions")}
            </Text>

            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                activeOpacity={0.7}
                style={[
                  styles.actionRow,
                  index !== quickActions.length - 1 &&
                  styles.actionBorder,
                ]}
                onPress={() => navigation.navigate(action.path)}
              >
                <View style={styles.actionIconColumn}>
                  <action.icon
                    size={20}
                    color={action.color}
                    strokeWidth={1.7}
                  />

                  {index !== quickActions.length - 1 && (
                    <View style={styles.iconConnector} />
                  )}
                </View>

                <View style={styles.actionContent}>
                  <View style={styles.actionHeader}>
                    <Text style={styles.actionTitle}>
                      {action.title}
                    </Text>

                    <ArrowRight
                      size={15}
                      color={colors.textDisabled}
                      strokeWidth={1.8}
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    style={styles.actionDescription}
                  >
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav paddingBottom={insets.bottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },

  hero: {
    marginBottom: spacing.xxxl,
  },

  eyebrow: {
    ...typography.sectionLabel,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },

  subtitle: {
    ...typography.body,
    color: colors.textTertiary,
    lineHeight: 24,
    maxWidth: "88%",
  },

  featuredCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xxxl,
  },

  featuredTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  featuredIconLarge: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  featuredArrow: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  featuredCardLabel: {
    ...typography.labelSmall,
    color: "rgba(255,255,255,0.72)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  featuredCardTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: "Inter_300Light",
    color: colors.surface,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },

  featuredCardDescription: {
    ...typography.body,
    color: "rgba(255,255,255,0.82)",
    maxWidth: "90%",
  },

  actions: {},

  sectionLabel: {
    ...typography.sectionLabel,
    marginBottom: spacing.lg,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.xl,
  },

  actionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  actionIconColumn: {
    width: 32,
    alignItems: "center",
    marginRight: spacing.lg,
  },

  iconConnector: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    opacity: 0.7,
  },

  actionContent: {
    flex: 1,
  },

  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  actionTitle: {
    ...typography.cardTitle,
  },

  actionDescription: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    lineHeight: 20,
    paddingRight: spacing.lg,
  },
});

export default LearnScreen;