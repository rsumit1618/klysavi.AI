import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { recentTransactionStyles } from './recent-transaction.styles';

export function RecentTransaction() {
  const transactions = [
    {
      id: '1',
      title: 'Apple Store - Fifth Ave',
      category: 'ELECTRONICS • TODAY',
      amount: '-$1,299.00',
      status: 'Pending',
      statusColor: '#98CBFF',
      icon: 'bag-handle-outline' as const,
    },
    {
      id: '2',
      title: 'The Gilded Fork',
      category: 'DINING • YESTERDAY',
      amount: '-$142.50',
      status: 'Points Earned',
      statusColor: colors.gold,
      icon: 'restaurant-outline' as const,
    },
    {
      id: '3',
      title: 'Klysavo Cloud AI Subscription',
      category: 'SERVICES • 2 DAYS AGO',
      amount: '-$29.00',
      status: null,
      statusColor: null,
      icon: 'sparkles-outline' as const,
    },
  ];

  return (
    <View style={recentTransactionStyles.container}>
      {transactions.map((tx) => (
        <View key={tx.id} style={recentTransactionStyles.itemRow}>
          <View style={recentTransactionStyles.iconBadge}>
            <Ionicons name={tx.icon} size={22} color={colors.darkGreen} />
          </View>

          <View style={recentTransactionStyles.detailsCol}>
            <Text style={recentTransactionStyles.titleText}>{tx.title}</Text>
            <Text style={recentTransactionStyles.categoryText}>{tx.category}</Text>
          </View>

          <View style={recentTransactionStyles.amountCol}>
            <Text style={recentTransactionStyles.amountText}>{tx.amount}</Text>
            {tx.status && (
              <View style={recentTransactionStyles.statusBadgeRow}>
                <View style={[recentTransactionStyles.statusDot, { backgroundColor: tx.statusColor! }]} />
                <Text style={[recentTransactionStyles.statusText, { color: tx.statusColor! }]}>{tx.status}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
