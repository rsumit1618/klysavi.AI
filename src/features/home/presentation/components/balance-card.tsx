import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { balanceCardStyles } from './balance-card.styles';

interface BalanceCardProps {
  amount?: number;
}

export function BalanceCard({ amount = 12450 }: BalanceCardProps) {
  return (
    <View>
      {/* Premium Infinite Card */}
      <View style={balanceCardStyles.cardContainer}>
        {/* Top Row */}
        <View style={balanceCardStyles.cardTopRow}>
          <View>
            <Text style={balanceCardStyles.cardSubtype}>PREMIUM INFINITE</Text>
            <Text style={balanceCardStyles.cardBrand}>klysavo.AI</Text>
          </View>
          <Ionicons name="wifi" size={26} color={colors.gold} />
        </View>

        {/* Middle Row */}
        <View style={balanceCardStyles.cardMiddleRow}>
          <View style={balanceCardStyles.chipIcon} />
          <Text style={balanceCardStyles.cardNumber}>•••• •••• •••• 8812</Text>
        </View>

        {/* Bottom Row */}
        <View style={balanceCardStyles.cardBottomRow}>
          <View>
            <Text style={balanceCardStyles.metaLabel}>CARD HOLDER</Text>
            <Text style={balanceCardStyles.metaValue}>ALEXANDER VANDYKE</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={balanceCardStyles.metaLabel}>EXPIRY</Text>
            <Text style={balanceCardStyles.metaValue}>09/28</Text>
          </View>
        </View>
      </View>

      {/* Financial Stats Card */}
      <View style={balanceCardStyles.statsContainer}>
        <View style={balanceCardStyles.statsTopRow}>
          <View>
            <Text style={balanceCardStyles.statsLabel}>AVAILABLE BALANCE</Text>
            <View style={balanceCardStyles.balanceRow}>
              <Text style={balanceCardStyles.balanceAmount}>${amount.toLocaleString()}</Text>
              <Text style={balanceCardStyles.balanceCents}>.00</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={balanceCardStyles.statsLabel}>SPENT THIS MONTH</Text>
            <Text style={balanceCardStyles.spentAmount}>$2,140.20</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={balanceCardStyles.limitHeader}>
          <Text style={balanceCardStyles.limitLabel}>Monthly Limit</Text>
          <Text style={balanceCardStyles.limitValue}>$15,000.00</Text>
        </View>
        <View style={balanceCardStyles.progressBarBg}>
          <View style={[balanceCardStyles.progressBarFill, { width: '14%' }]} />
        </View>
      </View>
    </View>
  );
}
