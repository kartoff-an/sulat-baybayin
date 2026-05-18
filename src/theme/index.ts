export const colors = {
  // Backgrounds
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceSecondary: "#F9FAFB",
  surfaceTertiary: "#F3F4F6",

  // Text
  textPrimary: "#111827",
  textSecondary: "#374151",
  textTertiary: "#6B7280",
  textPlaceholder: "#9CA3AF",
  textDisabled: "#D1D5DB",

  // Brand
  primary: "#3B82F6",
  primaryLight: "#EFF6FF",
  primaryDark: "#2563EB",

  // Semantic
  success: "#10B981",
  successLight: "#ECFDF5",
  successDark: "#059669",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  warningDark: "#D97706",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  errorDark: "#DC2626",

  // Accent
  accent: "#8B5CF6",
  accentLight: "#F5F3FF",
  accentDark: "#7C3AED",

  // Borders
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Special
  blindBg: "#FAF5FF",
  blindBorder: "#E9D5FF",
  blindText: "#6B21A8",
  blindAccent: "#7C3AED",
};

export const typography = {
  // Headings
  h1: {
    fontSize: 38,
    fontFamily: "Inter_300Light",
    color: colors.textPrimary,
    letterSpacing: -1.2,
    lineHeight: 42,
  },

  h2: {
    fontSize: 30,
    fontFamily: "Inter_300Light",
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 36,
  },

  // Hero / Feature
  hero: {
    fontSize: 48,
    fontFamily: "Inter_300Light",
    color: colors.textPrimary,
    letterSpacing: -2,
    lineHeight: 52,
  },

  // Subtitles
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.textPlaceholder,
    lineHeight: 24,
    letterSpacing: -0.1,
  },

  // Section labels
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: colors.textPlaceholder,
    textTransform: "uppercase" as const,
    letterSpacing: 1.4,
  },

  // Body
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    lineHeight: 24,
    letterSpacing: -0.1,
  },

  bodySmall: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.textPlaceholder,
    lineHeight: 20,
    letterSpacing: -0.05,
  },

  // Labels
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },

  labelSmall: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: colors.textPlaceholder,
    letterSpacing: 0.2,
  },

  // Buttons
  button: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.1,
  },

  buttonSmall: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0,
  },

  // Brand
  brand: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },

  // Card Titles
  cardTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  xxl: 12,
  xxxl: 16,
  round: 9999,
};

export const shadows = {
  none: {},
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
};

export const borders = {
  thin: {
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  normal: {
    borderWidth: 0.5,
    borderColor: colors.border,
  },
};

export const layout = {
  headerHeight: 64,
  bottomNavHeight: 56,
  maxContentWidth: 640,
  maxWideContentWidth: 1024,
  screenPadding: 20,
  contentPaddingTop: 24,
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  borders,
  layout,
};

export default theme;
