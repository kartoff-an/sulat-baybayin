import { Globe } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN" },
    { code: "tl", label: "TL" },
  ];

  const currentLanguage = i18n.language || "en";

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  return (
    <View style={styles.container}>
      <Globe size={16} color="#6B7280" />
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageChange(lang.code)}
          style={[
            styles.button,
            currentLanguage === lang.code
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === lang.code
                ? styles.activeButtonText
                : styles.inactiveButtonText,
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: "#3B82F6", // bg-primary
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
  inactiveButtonText: {
    color: "#6B7280",
  },
});

export default LanguageSwitcher;
