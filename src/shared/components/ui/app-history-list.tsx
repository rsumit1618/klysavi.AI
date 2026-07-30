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
        <View style={{ paddingVertical: 28, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={emptyIconName} size={38} color={colors.textMuted} />
          <Text style={{ fontSize: 14, fontFamily: fontFamilies.bold, color: colors.textDark, marginTop: 10 }}>
            {emptyTitle}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>
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
