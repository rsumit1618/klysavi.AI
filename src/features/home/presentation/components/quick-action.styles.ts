import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';

export const quickActionStyles = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#F3F4F3',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  actionItemFrozen: {
    backgroundColor: '#FFF0F0',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  actionLabelFrozen: {
    color: colors.error,
  },
});
