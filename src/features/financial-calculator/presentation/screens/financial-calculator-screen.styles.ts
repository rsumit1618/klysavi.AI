import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const calcStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
    justifyContent: 'space-between',
  },

  // Headline & Subtitle
  headlineSection: {
    marginBottom: 28,
    marginTop: 8,
  },
  headlineText: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },

  // Form Underline Fields (Exact Screenshot Match)
  formGroup: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  underlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  underlineRowFocused: {
    borderBottomColor: colors.darkGreen,
  },
  underlineInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    padding: 0,
  },
  prefixText: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginRight: 10,
  },

  // Hero Banner (Overview Screen)
  heroBanner: {
    backgroundColor: colors.darkGreen,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(230, 198, 117, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroHeadline: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    lineHeight: 22,
  },
  heroHighlight: {
    color: colors.gold,
    fontFamily: fontFamilies.bold,
  },

  // Steps Overview Card (Overview Screen)
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  cardHeaderBadge: {
    backgroundColor: colors.mintBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardHeaderBadgeText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 18,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 14,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: '#8E8E93',
  },
  stepLabelText: {
    fontSize: 14.5,
    fontFamily: fontFamilies.medium,
    color: colors.textDark,
  },

  // Primary Action Button (CALCULATE)
  calculateBtn: {
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
    marginTop: 16,
  },
  calculateBtnText: {
    fontSize: 15,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.darkGreen,
  },
  proceedBtn: {
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
    shadowRadius: 10,
    elevation: 3,
    marginTop: 16,
  },
  proceedBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.darkGreen,
  },

  // Dedicated Results Screen Styles
  resultsContainer: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  resultsContentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  statusBadgeCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.darkGreen,
  },
  statusTitle: {
    fontSize: 26,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  statusSubtext: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  metricsCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.darkGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: colors.textMuted,
  },
  metricValue: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },

  // Custom Dropdown Bottom Sheet Modal
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '50%',
  },
  pickerSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerSheetTitle: {
    fontSize: 17,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  pickerOptionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerOptionText: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
  },
  pickerOptionTextActive: {
    color: colors.darkGreen,
    fontFamily: fontFamilies.bold,
  },
});
