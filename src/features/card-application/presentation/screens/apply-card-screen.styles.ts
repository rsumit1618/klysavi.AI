import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const applyCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },

  // Top Header Row with Title
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  headerRightSpacer: {
    width: 40,
    marginRight: -8,
  },

  // Step Progress Header Bar (Exact Screenshot Match)
  progressSection: {
    marginBottom: 24,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepIndicatorText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  autoSaveText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: '#2E7D5B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressSegmentActive: {
    backgroundColor: '#0C231E',
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

  // Page Headline & Sub-link Section
  headlineSection: {
    marginBottom: 28,
  },
  headlineText: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subLinkText: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: '#2E7D5B',
    textDecorationLine: 'underline',
  },

  // Minimal Underline Form Fields (Exact Screenshot Match)
  formGroup: {
    marginBottom: 24,
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
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  underlineInputRowFocused: {
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

  // Toggle Switch Row (Screenshot 3 Match)
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    flex: 1,
    paddingRight: 16,
    lineHeight: 22,
  },
  togglePill: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    padding: 3,
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: colors.darkGreen,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  toggleText: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
  },

  // Action Button Stack (Exact Screenshot Match)
  buttonStack: {
    gap: 12,
    marginTop: 20,
  },
  skipBtn: {
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  skipBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.textDark,
  },
  nextBtn: {
    backgroundColor: colors.buttonYellow,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.buttonYellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  nextBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.textDark,
  },
  nextBtnTextDisabled: {
    color: '#A0AEC0',
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
  },
  proceedBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.textDark,
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

  // Scan Container Mockup
  scanContainer: {
    backgroundColor: '#0F1715',
    borderRadius: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  scanFrame: {
    width: 220,
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fontFamilies.medium,
    marginTop: 8,
  },

  // Under Review Success Screen (Increased Top Spacing)
  reviewScreenContainer: {
    flex: 1,
    backgroundColor: '#B8DEC8',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  reviewContentArea: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 52,
  },
  reviewIconCircle: {
    marginBottom: 28,
  },
  reviewTitle: {
    fontSize: 25,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    lineHeight: 33,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  reviewSubtext: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: 'rgba(10, 36, 29, 0.75)',
    lineHeight: 20,
    marginBottom: 32,
  },
  appIdBoxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appIdLabel: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: 'rgba(10, 36, 29, 0.75)',
  },
  appIdValue: {
    fontSize: 14,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  doneBtn: {
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  doneBtnText: {
    fontSize: 14,
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
    color: colors.textDark,
  },
});
