import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Globe } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import i18n from "../../i18n/config";
import {
  borderRadius,
  borders,
  colors,
  shadows,
  spacing,
  typography,
} from "../../theme";

type RootStackParamList = {
  Dashboard: undefined;
  Learn: undefined;
};

interface AppHeaderProps {
  paddingTop: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({ paddingTop }) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentLanguage = i18n.language || "en";

  const languages = [
    { code: "en", label: "EN" },
    { code: "tl", label: "TL" },
  ];

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
          style={styles.brandContainer}
          activeOpacity={0.7}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>ᜊ</Text>
          </View>
          <Text style={styles.brandName}>{t("common.appName")}</Text>
        </TouchableOpacity>

        <View style={styles.languageSwitcher}>
          <Globe size={14} color={colors.textPlaceholder} strokeWidth={1.5} />
          <View style={styles.languageOptions}>
            {languages.map((lang, index) => (
              <React.Fragment key={lang.code}>
                <TouchableOpacity
                  onPress={() => handleLanguageChange(lang.code)}
                  style={[
                    styles.languageButton,
                    currentLanguage === lang.code &&
                      styles.activeLanguageButton,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageText,
                      currentLanguage === lang.code &&
                        styles.activeLanguageText,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
                {index < languages.length - 1 && (
                  <View style={styles.separator} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  brandName: {
    ...typography.brand,
  },
  languageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    ...borders.thin,
    marginLeft: spacing.lg,
  },
  languageOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  activeLanguageButton: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  languageText: {
    ...typography.buttonSmall,
    color: colors.textTertiary,
    letterSpacing: 0.3,
  },
  activeLanguageText: {
    color: colors.surface,
    fontWeight: "600",
  },
  separator: {
    width: 0.5,
    height: 16,
    backgroundColor: colors.border,
  },
});

export default AppHeader;
