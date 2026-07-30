import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },

  // Top Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    fontSize: 26,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: -0.5,
  },
  aiDot: {
    color: colors.goldDark,
    fontFamily: fontFamilies.bold,
  },

  // Language Toggle Pill
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langButton: {
    width: 44,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  langActive: {
    backgroundColor: '#0C231E',
    borderColor: '#0C231E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  langText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: '#B0B0B0',
  },
  langTextActive: {
    color: colors.white,
  },

  // Form Section
  mainFormSection: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 8,
  },
  welcomeSection: {
    marginBottom: 28,
  },
  greetingText: {
    fontSize: 22,
    fontFamily: fontFamilies.regular,
    color: colors.textDark,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  titleText: {
    fontSize: 26,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: -0.5,
  },

  // Minimal Underline Tabs
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 28,
  },
  tabButton: {
    paddingBottom: 6,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    letterSpacing: 0.8,
    color: '#A0AEC0',
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: colors.textDark,
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: colors.darkGreen,
    borderRadius: 2,
  },

  // Input Section
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  underlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  underlineInputRowFocused: {
    borderBottomColor: colors.darkGreen,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    padding: 0,
  },
  infoIcon: {
    paddingLeft: 10,
  },

  // Login Button & Disabled State
  loginBtn: {
    backgroundColor: colors.buttonYellow,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.buttonYellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
    marginBottom: 24,
  },
  loginBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.darkGreen,
  },
  loginBtnTextDisabled: {
    color: '#A0AEC0',
  },

  // Register Prompt Row
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fontFamilies.medium,
  },
  registerLink: {
    fontSize: 13,
    fontFamily: fontFamilies.extraBold,
    color: colors.textDark,
    letterSpacing: 0.3,
  },

  // Promo Card
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#EBF4F0',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 48, 0.08)',
  },
  promoImageThumbnail: {
    width: 110,
    height: '100%',
    minHeight: 90,
  },
  promoTextContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    lineHeight: 19,
  },
});
