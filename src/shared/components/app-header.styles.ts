import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const appHeaderStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginTop: 16,
    width: '100%',
  },
  // Padding for back-button screens (Profile, Redeem, Financial, Apply flow, etc.)
  headerRowBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 16,
    width: '100%',
  },
  headerLeft: {
    zIndex: 10,
    marginRight: 4,
  },
  // Standardized Circle Button (Matching Home Screen & Rewards Style)
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDEEED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  titleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  // Centered title variant — used when a back button is present (Profile, Redeem, Financial etc.)
  titleColCentered: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    marginTop: 1,
  },
  titleText: {
    fontSize: 22,
    fontFamily: fontFamilies.extraBold,
    color: colors.textDark,
    letterSpacing: -0.3,
  },
  // Centered title text — original style for back-button screens
  titleTextCentered: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
});
