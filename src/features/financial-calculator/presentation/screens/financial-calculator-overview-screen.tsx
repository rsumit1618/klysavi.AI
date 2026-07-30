import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { calcStyles } from './financial-calculator-screen.styles';

interface FinancialCalculatorOverviewScreenProps {
  onProceed: () => void;
  onBack: () => void;
}

export function FinancialCalculatorOverviewScreen({ onProceed, onBack }: FinancialCalculatorOverviewScreenProps) {
  return (
    <View style={calcStyles.container}>
      <ScrollView contentContainerStyle={calcStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          {/* Hero Banner (Same as Apply Card but for Calculator) */}
          <View style={calcStyles.heroBanner}>
            <View style={calcStyles.heroIconBadge}>
              <Ionicons name="calculator" size={24} color={colors.gold} />
            </View>
            <View style={calcStyles.heroTextContainer}>
              <Text style={calcStyles.heroHeadline}>
                Calculate your financial <Text style={calcStyles.heroHighlight}>eligibility & monthly installments</Text> in seconds.
              </Text>
            </View>
          </View>

          {/* Steps/Features Card */}
          <View style={calcStyles.stepsCard}>
            <View style={calcStyles.cardHeaderRow}>
              <Text style={calcStyles.cardHeaderTitle}>Calculation Details</Text>
              <View style={calcStyles.cardHeaderBadge}>
                <Text style={calcStyles.cardHeaderBadgeText}>INSTANT</Text>
              </View>
            </View>
            <View style={calcStyles.cardDivider} />

            {/* 1. Loan Eligibility */}
            <View style={calcStyles.stepItemRow}>
              <View style={calcStyles.stepNumberBadge}>
                <Text style={calcStyles.stepNumberText}>1</Text>
              </View>
              <Text style={calcStyles.stepLabelText}>Check Loan Eligibility</Text>
            </View>

            {/* 2. Monthly EMI */}
            <View style={calcStyles.stepItemRow}>
              <View style={calcStyles.stepNumberBadge}>
                <Text style={calcStyles.stepNumberText}>2</Text>
              </View>
              <Text style={calcStyles.stepLabelText}>Estimate Monthly Installments</Text>
            </View>

            {/* 3. DBR Check */}
            <View style={calcStyles.stepItemRow}>
              <View style={calcStyles.stepNumberBadge}>
                <Text style={calcStyles.stepNumberText}>3</Text>
              </View>
              <Text style={calcStyles.stepLabelText}>Debt Burden Ratio (DBR) Check</Text>
            </View>
          </View>
        </View>

        {/* Bottom Action Button (PROCEED) */}
        <TouchableOpacity
          style={calcStyles.proceedBtn}
          onPress={onProceed}
          activeOpacity={0.85}
        >
          <Text style={calcStyles.proceedBtnText}>PROCEED</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
