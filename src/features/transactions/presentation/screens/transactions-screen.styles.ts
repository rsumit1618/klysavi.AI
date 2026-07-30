import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 40; // 20px padding left + 20px padding right

export const transactionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 48,
  },

  // Top Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    marginTop: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: -0.5,
  },

  // 3D Credit Card Slider & Viewport
  cardViewport: {
    marginTop: 6,
    marginBottom: 16,
    marginHorizontal: -24,
  },
  cardSliderContent: {
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 24,
  },
  creditCard3D: {
    width: CARD_WIDTH,
    height: 210,
    borderRadius: 24,
    backgroundColor: '#1E182A',
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 40, 50, 0.86)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  frozenText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: '#90CDF4',
    letterSpacing: 1.5,
  },

  // Card Top Row
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankBrandLogo: {
    fontSize: 17,
    fontFamily: fontFamilies.extraBold,
    color: colors.white,
    letterSpacing: 1.4,
  },
  cardRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Card Number Row
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  cardNumberText: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    letterSpacing: 2.0,
  },

  // Balance Section
  balanceSection: {
    marginTop: 6,
  },
  balanceLabel: {
    fontSize: 9.5,
    fontFamily: fontFamilies.bold,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 21,
    fontFamily: fontFamilies.extraBold,
    color: colors.white,
    letterSpacing: -0.3,
  },

  // Spending Bar
  spendingBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
    overflow: 'hidden',
  },
  spendingBarFill: {
    height: '100%',
    backgroundColor: colors.buttonYellow,
    borderRadius: 3,
  },

  // Card Footer Row
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFooterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardMetaText: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.7,
  },
  mastercardLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircleRed: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EB001B',
  },
  mcCircleOrange: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF5F00',
    marginLeft: -10,
    opacity: 0.9,
  },

  // Slider Pagination Dots Indicator
  paginationDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 14,
    marginBottom: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#CBD5E0',
  },
  activeDot: {
    width: 22,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.darkGreen,
  },

  // View Card Details Floating Button
  viewDetailsBtn: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 12,
  },
  viewDetailsBtnText: {
    fontSize: 11.5,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },

  // 4 Action Buttons Grid
  actionsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 14,
  },

  // Transaction History Section
  historySection: {
    marginTop: 16,
  },
  historyHeaderLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  txRow: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    overflow: 'hidden',
  },
  txLeftCol: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  txMerchantTitle: {
    fontSize: 13.5,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 3,
    flexShrink: 1,
  },
  txTimeSub: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
  },
  txRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txAmountText: {
    fontSize: 13.5,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 3,
    textAlign: 'right',
  },
  txForeignSub: {
    fontSize: 10.5,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    textAlign: 'right',
  },

  // Cool Empty Transaction Widget
  emptyTxCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  emptyTxIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTxTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 6,
  },
  emptyTxSub: {
    fontSize: 12.5,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
    marginBottom: 16,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(46, 125, 91, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38A169',
  },
  liveStatusText: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
    letterSpacing: 0.8,
  },
});
