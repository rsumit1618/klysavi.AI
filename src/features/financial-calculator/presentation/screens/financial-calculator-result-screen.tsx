import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { calcStyles } from './financial-calculator-screen.styles';
import { AppHeader } from '@/shared/components/app-header';

export function FinancialCalculatorResultScreen() {
  const router = useRouter();
  const { financeType, requestedAmount, periodMonths, netDeduction } =
    useLocalSearchParams<{
      financeType?: string;
      requestedAmount?: string;
      periodMonths?: string;
      netDeduction?: string;
      grossIncome?: string;
    }>();

  // Clean numerical parsing
  const rawAmount = parseFloat((requestedAmount || '15000').replace(/[^0-9.]/g, '')) || 15000;
  const numAmount = Math.min(Math.max(rawAmount, 500), 100000);

  const rawDeduction = parseFloat((netDeduction || '405').replace(/[^0-9.]/g, '')) || 405;
  const numDeduction = Math.min(Math.max(rawDeduction, 50), 5000);

  const rawMonths = parseInt((periodMonths || '48').replace(/[^0-9]/g, ''), 10) || 48;
  const numMonths = Math.min(Math.max(rawMonths, 6), 84);

  const formattedAmount = `BHD ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  const formattedDeduction = `BHD ${numDeduction.toFixed(3)}`;

  return (
    <SafeAreaView style={calcStyles.resultsContainer}>
      <AppHeader showBack title="Financial Calculator" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={calcStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          {/* Celebration Header */}
          <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#E6F4ED',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1.5,
                borderColor: '#059669',
              }}
            >
              <Ionicons name="checkmark-circle" size={44} color="#059669" />
            </View>

            <Text style={{ fontSize: 24, fontFamily: fontFamilies.bold, color: colors.textDark, textAlign: 'center', marginBottom: 6 }}>
              You Are Pre-Approved!
            </Text>
            <Text style={{ fontSize: 13.5, fontFamily: fontFamilies.regular, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 }}>
              Based on your financial profile, you qualify for instant IMTIAZ Credit Card issuance.
            </Text>
          </View>

          {/* Hero Approved Limit Display Card */}
          <View
            style={{
              backgroundColor: '#0F2F28',
              borderRadius: 24,
              padding: 24,
              marginBottom: 20,
              alignItems: 'center',
              shadowColor: '#0F2F28',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 5,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(230, 198, 117, 0.18)',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 20,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: 'rgba(230, 198, 117, 0.35)',
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: fontFamilies.bold, color: '#E6C675', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                APPROVED FINANCE LIMIT
              </Text>
            </View>

            <Text style={{ fontSize: 32, fontFamily: fontFamilies.extraBold, color: colors.white, letterSpacing: -0.5, marginBottom: 14 }}>
              {formattedAmount}
            </Text>

            {/* Visual Breakdown Bar */}
            <View style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{ width: '70%', height: '100%', backgroundColor: '#00C49F' }} />
              <View style={{ width: '30%', height: '100%', backgroundColor: '#E6C675' }} />
            </View>
          </View>

          {/* Metrics Breakdown List */}
          <View style={calcStyles.metricsCard}>
            <View style={calcStyles.metricRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="card-outline" size={18} color={colors.darkGreen} />
                <Text style={calcStyles.metricLabel}>Selected Product</Text>
              </View>
              <Text style={calcStyles.metricValue}>{financeType || 'Personal Finance'}</Text>
            </View>

            <View style={calcStyles.metricRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="wallet-outline" size={18} color={colors.darkGreen} />
                <Text style={calcStyles.metricLabel}>Max Finance Amount</Text>
              </View>
              <Text style={calcStyles.metricValue}>{formattedAmount}</Text>
            </View>

            <View style={calcStyles.metricRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="calendar-outline" size={18} color={colors.darkGreen} />
                <Text style={calcStyles.metricLabel}>Tenure Period</Text>
              </View>
              <Text style={calcStyles.metricValue}>{numMonths} Months</Text>
            </View>

            <View style={calcStyles.metricRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="cash-outline" size={18} color={colors.darkGreen} />
                <Text style={calcStyles.metricLabel}>Net Deduction</Text>
              </View>
              <Text style={calcStyles.metricValue}>{formattedDeduction}</Text>
            </View>

            <View style={[calcStyles.metricRow, { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="stats-chart-outline" size={18} color={colors.darkGreen} />
                <Text style={calcStyles.metricLabel}>Debt Burden Ratio (DBR)</Text>
              </View>
              <View style={{ backgroundColor: '#E6F4ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 13, fontFamily: fontFamilies.bold, color: '#059669' }}>40.5% (PASS)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Action Button (DONE) */}
        <TouchableOpacity
          style={calcStyles.calculateBtn}
          onPress={() => router.navigate('/(main)/home')}
          activeOpacity={0.85}
        >
          <Text style={calcStyles.calculateBtnText}>DONE</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
