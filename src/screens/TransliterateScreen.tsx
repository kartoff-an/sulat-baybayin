import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { ArrowLeftRight, Check, Copy, Volume2, X } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../components/layout/AppHeader";
import BottomNav from "../components/layout/BottomNav";

import {
  borderRadius,
  borders,
  colors,
  layout,
  spacing,
  typography,
} from "../theme";

type TransliterationDirection = "latin-to-baybayin" | "baybayin-to-latin";

const latinToBaybayinMap: Record<string, string> = {
  a: "ᜀ",
  i: "ᜁ",
  e: "ᜁ",
  u: "ᜂ",
  o: "ᜂ",
  ba: "ᜊ",
  bi: "ᜊᜒ",
  be: "ᜊᜒ",
  bu: "ᜊᜓ",
  bo: "ᜊᜓ",
  ka: "ᜃ",
  ki: "ᜃᜒ",
  ke: "ᜃᜒ",
  ku: "ᜃᜓ",
  ko: "ᜃᜓ",
  da: "ᜇ",
  di: "ᜇᜒ",
  de: "ᜇᜒ",
  du: "ᜇᜓ",
  do: "ᜇᜓ",
  ra: "ᜇ",
  ri: "ᜇᜒ",
  re: "ᜇᜒ",
  ru: "ᜇᜓ",
  ro: "ᜇᜓ",
  ga: "ᜄ",
  gi: "ᜄᜒ",
  ge: "ᜄᜒ",
  gu: "ᜄᜓ",
  go: "ᜄᜓ",
  ha: "ᜑ",
  hi: "ᜑᜒ",
  he: "ᜑᜒ",
  hu: "ᜑᜓ",
  ho: "ᜑᜓ",
  la: "ᜎ",
  li: "ᜎᜒ",
  le: "ᜎᜒ",
  lu: "ᜎᜓ",
  lo: "ᜎᜓ",
  ma: "ᜋ",
  mi: "ᜋᜒ",
  me: "ᜋᜒ",
  mu: "ᜋᜓ",
  mo: "ᜋᜓ",
  na: "ᜈ",
  ni: "ᜈᜒ",
  ne: "ᜈᜒ",
  nu: "ᜈᜓ",
  no: "ᜈᜓ",
  nga: "ᜅ",
  ngi: "ᜅᜒ",
  nge: "ᜅᜒ",
  ngu: "ᜅᜓ",
  ngo: "ᜅᜓ",
  pa: "ᜉ",
  pi: "ᜉᜒ",
  pe: "ᜉᜒ",
  pu: "ᜉᜓ",
  po: "ᜉᜓ",
  sa: "ᜐ",
  si: "ᜐᜒ",
  se: "ᜐᜒ",
  su: "ᜐᜓ",
  so: "ᜐᜓ",
  ta: "ᜆ",
  ti: "ᜆᜒ",
  te: "ᜆᜒ",
  tu: "ᜆᜓ",
  to: "ᜆᜓ",
  wa: "ᜏ",
  wi: "ᜏᜒ",
  we: "ᜏᜒ",
  wu: "ᜏᜓ",
  wo: "ᜏᜓ",
  ya: "ᜌ",
  yi: "ᜌᜒ",
  ye: "ᜌᜒ",
  yu: "ᜌᜓ",
  yo: "ᜌᜓ",
  b: "ᜊ᜔",
  k: "ᜃ᜔",
  d: "ᜇ᜔",
  r: "ᜇ᜔",
  g: "ᜄ᜔",
  h: "ᜑ᜔",
  l: "ᜎ᜔",
  m: "ᜋ᜔",
  n: "ᜈ᜔",
  ng: "ᜅ᜔",
  p: "ᜉ᜔",
  s: "ᜐ᜔",
  t: "ᜆ᜔",
  w: "ᜏ᜔",
  y: "ᜌ᜔",
};

const baybayinToLatinMap: Record<string, string> = {
  ᜀ: "a",
  ᜁ: "i",
  ᜂ: "u",
  ᜊ: "ba",
  ᜊᜒ: "bi",
  ᜊᜓ: "bu",
  ᜊ᜔: "b",
  ᜃ: "ka",
  ᜃᜒ: "ki",
  ᜃᜓ: "ku",
  ᜃ᜔: "k",
  ᜇ: "da",
  ᜇᜒ: "di",
  ᜇᜓ: "du",
  ᜇ᜔: "d",
  ᜄ: "ga",
  ᜄᜒ: "gi",
  ᜄᜓ: "gu",
  ᜄ᜔: "g",
  ᜑ: "ha",
  ᜑᜒ: "hi",
  ᜑᜓ: "hu",
  ᜑ᜔: "h",
  ᜎ: "la",
  ᜎᜒ: "li",
  ᜎᜓ: "lu",
  ᜎ᜔: "l",
  ᜋ: "ma",
  ᜋᜒ: "mi",
  ᜋᜓ: "mu",
  ᜋ᜔: "m",
  ᜈ: "na",
  ᜈᜒ: "ni",
  ᜈᜓ: "nu",
  ᜈ᜔: "n",
  ᜅ: "nga",
  ᜅᜒ: "ngi",
  ᜅᜓ: "ngu",
  ᜅ᜔: "ng",
  ᜉ: "pa",
  ᜉᜒ: "pi",
  ᜉᜓ: "pu",
  ᜉ᜔: "p",
  ᜐ: "sa",
  ᜐᜒ: "si",
  ᜐᜓ: "su",
  ᜐ᜔: "s",
  ᜆ: "ta",
  ᜆᜒ: "ti",
  ᜆᜓ: "tu",
  ᜆ᜔: "t",
  ᜏ: "wa",
  ᜏᜒ: "wi",
  ᜏᜓ: "wu",
  ᜏ᜔: "w",
  ᜌ: "ya",
  ᜌᜒ: "yi",
  ᜌᜓ: "yu",
  ᜌ᜔: "y",
};

const TransliterateScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [direction, setDirection] =
    useState<TransliterationDirection>("latin-to-baybayin");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const convertLatinToBaybayin = (text: string): string => {
    let result = "";
    let i = 0;
    const lowerText = text.toLowerCase();

    while (i < lowerText.length) {
      if (lowerText[i] === " ") {
        result += " ";
        i++;
        continue;
      }

      let found = false;

      if (i < lowerText.length - 2 && lowerText.substring(i, i + 3) === "nga") {
        if (i + 3 < lowerText.length && lowerText[i + 3] === "y") {
          result += latinToBaybayinMap["nga"] || "";
          i += 3;
          found = true;
        }
      }

      if (!found && i < lowerText.length - 1) {
        const twoChars = lowerText.substring(i, i + 2);
        if (latinToBaybayinMap[twoChars]) {
          result += latinToBaybayinMap[twoChars];
          i += 2;
          found = true;
        }
      }

      if (!found) {
        const oneChar = lowerText[i];
        if (latinToBaybayinMap[oneChar]) {
          result += latinToBaybayinMap[oneChar];
        } else {
          result += lowerText[i];
        }
        i++;
      }
    }

    return result;
  };

  const convertBaybayinToLatin = (text: string): string => {
    let result = "";
    let i = 0;

    while (i < text.length) {
      if (text[i] === " ") {
        result += " ";
        i++;
        continue;
      }

      let found = false;

      if (i < text.length - 1) {
        const twoChars = text.substring(i, i + 2);
        if (baybayinToLatinMap[twoChars]) {
          result += baybayinToLatinMap[twoChars];
          i += 2;
          found = true;
        }
      }

      if (!found) {
        const oneChar = text[i];
        if (baybayinToLatinMap[oneChar]) {
          result += baybayinToLatinMap[oneChar];
        } else {
          result += text[i];
        }
        i++;
      }
    }

    return result;
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSpeak = () => {
    const textToSpeak = direction === "baybayin-to-latin" ? output : input;
    if (textToSpeak.trim()) {
      Speech.speak(textToSpeak, {
        language: "fil-PH",
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  const handleSwap = () => {
    setDirection((prev) =>
      prev === "latin-to-baybayin" ? "baybayin-to-latin" : "latin-to-baybayin"
    );
    setInput("");
    setOutput("");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    if (text.trim()) {
      if (direction === "latin-to-baybayin") {
        setOutput(convertLatinToBaybayin(text));
      } else {
        setOutput(convertBaybayinToLatin(text));
      }
    } else {
      setOutput("");
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader paddingTop={20} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.subtitle}>{t("transliteration.subtitle")}</Text>
          </View>

          {/* Direction Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => setDirection("latin-to-baybayin")}
              style={[
                styles.toggleButton,
                direction === "latin-to-baybayin" && styles.toggleButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  direction === "latin-to-baybayin" &&
                    styles.toggleButtonTextActive,
                ]}
              >
                {t("transliteration.latinToBaybayin")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSwap}
              style={styles.swapButton}
              activeOpacity={0.7}
            >
              <ArrowLeftRight size={18} color="#6B7280" strokeWidth={1.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDirection("baybayin-to-latin")}
              style={[
                styles.toggleButton,
                direction === "baybayin-to-latin" && styles.toggleButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  direction === "baybayin-to-latin" &&
                    styles.toggleButtonTextActive,
                ]}
              >
                {t("transliteration.baybayinToLatin")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>
                {direction === "latin-to-baybayin"
                  ? t("transliteration.latinText")
                  : t("transliteration.baybayinText")}
              </Text>
              {input.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <X size={14} color="#9CA3AF" strokeWidth={1.5} />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              value={input}
              onChangeText={handleInputChange}
              placeholder={
                direction === "latin-to-baybayin"
                  ? t("transliteration.typeHere", { script: "Latin" })
                  : t("transliteration.typeHere", { script: "Baybayin" })
              }
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {input.length === 1
                ? t("transliteration.characters", { count: 1 })
                : t("transliteration.characters_plural", {
                    count: input.length,
                  })}
            </Text>
          </View>

          {/* Output */}
          <View style={styles.outputSection}>
            <Text style={styles.outputLabel}>
              {direction === "latin-to-baybayin"
                ? t("transliteration.baybayinOutput")
                : t("transliteration.latinOutput")}
            </Text>
            <View style={styles.outputContainer}>
              <Text
                style={[
                  styles.outputText,
                  direction === "latin-to-baybayin" && styles.outputTextLarge,
                  !output && styles.outputPlaceholder,
                ]}
              >
                {output ||
                  (direction === "latin-to-baybayin"
                    ? t("transliteration.translationPlaceholder", {
                        script: "Baybayin",
                      })
                    : t("transliteration.translationPlaceholder", {
                        script: "Latin",
                      }))}
              </Text>
            </View>

            {/* Action Buttons Below Output */}
            {output.length > 0 && (
              <View style={styles.outputActions}>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  {isCopied ? (
                    <Check size={16} color="#10B981" strokeWidth={1.5} />
                  ) : (
                    <Copy size={16} color="#6B7280" strokeWidth={1.5} />
                  )}
                  <Text style={styles.actionButtonText}>
                    {isCopied
                      ? t("common.copied")
                      : t("transliteration.copyToClipboard")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSpeak}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Volume2 size={16} color="#6B7280" strokeWidth={1.5} />
                  <Text style={styles.actionButtonText}>
                    {t("transliteration.listenPronunciation")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  subtitle: {
    ...typography.subtitle,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    ...typography.buttonSmall,
    color: colors.textTertiary,
  },
  toggleButtonTextActive: {
    color: colors.surface,
    fontWeight: "600",
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.label,
  },
  clearButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  input: {
    ...borders.normal,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 120,
    fontWeight: "400",
  },
  charCount: {
    ...typography.labelSmall,
    marginTop: 6,
    textAlign: "right",
  },
  outputSection: {
    marginBottom: spacing.xxxl,
  },
  outputLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  outputContainer: {
    ...borders.normal,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    minHeight: 100,
  },
  outputText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  outputTextLarge: {
    fontSize: 24,
    lineHeight: 32,
  },
  outputPlaceholder: {
    color: colors.textPlaceholder,
    fontSize: 14,
  },
  outputActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...borders.normal,
  },
  actionButtonText: {
    ...typography.buttonSmall,
    color: colors.textTertiary,
  },
});

export default TransliterateScreen;
