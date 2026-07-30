import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const emptyStateStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: -0.5,
    marginBottom: 22,
    marginTop: 6,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EDEEED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titleText: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 32,
  },
  applyBtn: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    color: colors.textDark,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
