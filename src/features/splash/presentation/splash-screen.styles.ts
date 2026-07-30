import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glowContainer: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(152, 203, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  outerPulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    borderColor: 'rgba(152, 203, 255, 0.18)',
  },
  innerPulseRing: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1,
    borderColor: 'rgba(152, 203, 255, 0.1)',
  },
  emblemContainer: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandName: {
    color: colors.white,
    fontSize: 40,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: -0.5,
  },
  aiAccent: {
    color: colors.iceBlue,
    fontSize: 40,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: -0.5,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: fontFamilies.bold,
    letterSpacing: 4.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  loaderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.secondary,
  },
  loaderText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    fontStyle: 'italic',
  },
  bottomAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(152, 203, 255, 0.25)',
  },
});
