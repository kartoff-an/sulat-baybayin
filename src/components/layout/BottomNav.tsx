import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookMarked, Languages } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing } from "../../theme";

type RootStackParamList = {
  Learn: undefined;
  Transliterate: undefined;
  AlphabetTable: undefined;
  PracticeWriting: undefined;
  BaybayinToLatin: undefined;
  LatinToBaybayin: undefined;
  Dashboard: undefined;
};

interface BottomNavProps {
  paddingBottom: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ paddingBottom }) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();

  const tabs = [
    {
      name: "Learn" as keyof RootStackParamList,
      label: t("navigation.learn"),
      icon: BookMarked,
    },
    {
      name: "Transliterate" as keyof RootStackParamList,
      label: t("navigation.transliterate"),
      icon: Languages,
    },
  ];

  const isActive = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {tabs.map((tab) => {
        const active = isActive(tab.name);
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Icon
              size={20}
              color={active ? colors.primary : colors.textPlaceholder}
              strokeWidth={1.5}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderLight,
    flexDirection: "row",
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    paddingTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textPlaceholder,
    letterSpacing: 0.2,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 0.2,
  },
});

export default BottomNav;
