import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { transactionsStyles } from '@/features/transactions/presentation/screens/transactions-screen.styles';

export interface HistoryListItem {
  id: string;
  title: string;
  subText?: string;
  amountText?: string;
  statusText?: string;
  statusColor?: string;
}

interface AppHistoryListProps {
  headerTitle: string;
  items: HistoryListItem[];
  emptyIconName?: keyof typeof Ionicons.glyphMap;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function AppHistoryList({
  headerTitle,
  items,
  emptyIconName = 'receipt-outline',
  emptyTitle = 'No History Recorded',
  emptySubtitle = 'Records will automatically appear here once transactions or activities occur.',
}: AppHistoryListProps) {
  return (
    <View style={transactionsStyles.historySection}>
      <Text style={transactionsStyles.historyHeaderLabel}>{headerTitle}</Text>
      {!items || items.length === 0 ? (
        <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 32, alignItems: 'center', justifyContent: 'center', marginVertical: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(18, 60, 48, 0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name={emptyIconName} size={32} color={colors.darkGreen} />
          </View>
          <Text style={{ fontSize: 16, fontFamily: fontFamilies.bold, color: colors.textDark, textAlign: 'center', marginBottom: 6 }}>
            {emptyTitle}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: fontFamilies.regular, color: colors.textMuted, textAlign: 'center', lineHeight: 19 }}>
            {emptySubtitle}
          </Text>
        </View>
      ) : (
        items.map((item) => (
          <View key={item.id} style={transactionsStyles.txRow}>
            <View style={transactionsStyles.txLeftCol}>
              <Text style={transactionsStyles.txMerchantTitle} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
              {item.subText ? <Text style={transactionsStyles.txTimeSub}>{item.subText}</Text> : null}
            </View>
            <View style={transactionsStyles.txRightCol}>
              {item.amountText ? <Text style={transactionsStyles.txAmountText}>{item.amountText}</Text> : null}
              {item.statusText ? (
                <Text style={{ fontSize: 10.5, fontFamily: fontFamilies.bold, color: item.statusColor || '#38A169', textAlign: 'right' }}>
                  {item.statusText}
                </Text>
              ) : null}
            </View>
          </View>
        ))
      )}
    </View>
  );
}
