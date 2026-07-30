import { colors } from './colors';

export const fontFamilies = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_600SemiBold',
  extraBold: 'Manrope_700Bold',
} as const;

export const typography = {
  // Screen & Header Titles
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: colors.textDark,
    letterSpacing: -0.4,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  cardTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  headline: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: colors.textDark,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.textDark,
  },
  subLink: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#2E7D5B',
    textDecorationLine: 'underline' as const,
  },
  buttonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.textDark,
  },
} as const;

export type Typography = typeof typography;
