import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const balanceCardStyles = StyleSheet.create({
  // Premium Card
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 22,
    height: 210,
    justifyContent: 'space-between',
    shadowColor: colors.darkGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(230, 198, 117, 0.2)',
    marginBottom: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSubtype: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardBrand: {
    fontSize: 20,
    fontFamily: fontFamilies.extraBold,
    color: colors.white,
    marginTop: 2,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chipIcon: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(230, 198, 117, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(230, 198, 117, 0.4)',
  },
  cardNumber: {
    fontSize: 17,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    letterSpacing: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: fontFamilies.bold,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  // Financial Stats Card
  statsContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceAmount: {
    fontSize: 26,
    fontFamily: fontFamilies.extraBold,
    color: colors.textDark,
  },
  balanceCents: {
    fontSize: 15,
    fontFamily: fontFamilies.semiBold,
    color: colors.textMuted,
  },
  spentAmount: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.error,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  limitLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
  },
  limitValue: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EDEEED',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.darkGreen,
    borderRadius: 4,
  },
});
