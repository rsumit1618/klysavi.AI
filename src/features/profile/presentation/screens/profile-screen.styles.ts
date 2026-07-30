import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
  },
  // Top Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    marginTop: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDEEED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDEEED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingCol: {
    justifyContent: 'center',
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
  // Section Label
  sectionLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  // Promo Card Container
  promoCardContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Edge-to-Edge Graphic Banner
  lightGraphicBanner: {
    width: '100%',
    height: 170,
    backgroundColor: '#F0F3F5',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  // Text Section Boxes
  infoBoxMint: {
    padding: 20,
    backgroundColor: '#EEF8F3',
  },
  infoBoxCream: {
    padding: 20,
    backgroundColor: '#F7F7EE',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  cardSubtext: {
    fontSize: 13.5,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    lineHeight: 19,
  },
  // Bottom Special Offer Card
  promoOfferCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF8F3',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 48, 0.12)',
    marginTop: 4,
    marginBottom: 12,
  },
  promoIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
    lineHeight: 18,
  },
});
