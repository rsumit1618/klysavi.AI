import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 80,
  },

  // Top Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
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

  // Form Body
  mainFormSection: {
    marginVertical: 8,
  },
  welcomeSection: {
    marginBottom: 24,
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

  // Minimal Underline Form Fields
  formGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  underlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
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

  // Action Button & Disabled State
  registerBtn: {
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
    marginBottom: 20,
    marginTop: 12,
  },
  registerBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  registerBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.darkGreen,
  },
  registerBtnTextDisabled: {
    color: '#A0AEC0',
  },

  // Login Prompt Link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  loginText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fontFamilies.medium,
  },
  loginLink: {
    fontSize: 13,
    fontFamily: fontFamilies.extraBold,
    color: colors.textDark,
    letterSpacing: 0.3,
  },
});
