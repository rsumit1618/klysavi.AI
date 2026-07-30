import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

const { width } = Dimensions.get('window');
export const DRAWER_WIDTH = Math.min(width * 0.8, 320);
export const EXTRA_LEFT_OVERHANG = 40;

export const sideMenuStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    left: -EXTRA_LEFT_OVERHANG,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH + EXTRA_LEFT_OVERHANG,
    height: '100%',
    backgroundColor: colors.white,
    paddingTop: 54,
    paddingBottom: 36,
    paddingLeft: EXTRA_LEFT_OVERHANG + 24,
    paddingRight: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 1001,
  },
  // User Info Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  avatarText: {
    color: colors.gold,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  greetingSub: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
  },
  greetingName: {
    fontSize: 17,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  // Menu Items List
  menuList: {
    gap: 22,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  // Footer Section
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
    gap: 18,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  langText: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
  },
});
