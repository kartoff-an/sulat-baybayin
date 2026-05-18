import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslation } from "../locales/en/translation";
import { tlTranslation } from "../locales/tl/translation";

const LANGUAGE_STORAGE_KEY = "@app_language";

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Try to get saved language from storage
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tl")) {
        callback(savedLanguage);
        return;
      }

      // Get device locale
      const locales = Localization.getLocales();
      const deviceLocale = locales[0]?.languageCode || "en";

      // Check if device language is supported
      const supportedLanguages = ["en", "tl"];
      const detectedLanguage = supportedLanguages.includes(deviceLocale)
        ? deviceLocale
        : "en";

      callback(detectedLanguage);
    } catch (error) {
      console.error("Language detection failed:", error);
      callback("en"); // Fallback to English
    }
  },
  init: () => {
    // Optional: initialization code
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
      console.error("Failed to cache language:", error);
    }
  },
};

// Initialize i18n with proper configuration
const options: InitOptions = {
  resources: {
    en: {
      translation: enTranslation,
    },
    tl: {
      translation: tlTranslation,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
  react: {
    useSuspense: false,
  },
  load: "languageOnly",
  preload: ["en", "tl"],
};

i18n.use(languageDetector).use(initReactI18next).init(options);

export default i18n;
