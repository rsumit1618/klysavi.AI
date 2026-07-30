import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';

interface ApplyOverviewScreenProps {
  onProceed: () => void;
  onBack?: () => void;
  productTitle?: string;
  isLoading?: boolean;
}

export function ApplyOverviewScreen({ onProceed, onBack, productTitle, isLoading }: ApplyOverviewScreenProps) {
  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Standardized App Header outside ScrollView for clean alignment */}
      <AppHeader showBack title="Apply" onBackPress={onBack} />

      <ScrollView contentContainerStyle={applyCardStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>

          {/* Dark Emerald Hero Banner */}
          <View style={applyCardStyles.heroBanner}>
            <View style={applyCardStyles.heroIconBadge}>
              <Ionicons name="sparkles" size={24} color={colors.gold} />
            </View>
            <View style={applyCardStyles.heroTextContainer}>
              <Text style={applyCardStyles.heroHeadline}>
                With all details, it will only take a <Text style={applyCardStyles.heroHighlight}>few minutes</Text> to create an account
              </Text>
            </View>
          </View>

          {/* Steps Card */}
          <View style={applyCardStyles.stepsCard}>
            <View style={applyCardStyles.cardHeaderRow}>
              <Text style={applyCardStyles.cardHeaderTitle}>{productTitle || 'Apply Prepaid Card'}</Text>
              <View style={applyCardStyles.cardHeaderBadge}>
                <Text style={applyCardStyles.cardHeaderBadgeText}>INSTANT AI</Text>
              </View>
            </View>
            <View style={applyCardStyles.cardDivider} />

            {/* 1. Scan ID */}
            <View style={applyCardStyles.stepItemRow}>
              <View style={applyCardStyles.stepNumberBadge}>
                <Text style={applyCardStyles.stepNumberText}>1</Text>
              </View>
              <Text style={applyCardStyles.stepLabelText}>Scan ID</Text>
            </View>

            {/* 2. ID Details */}
            <View style={applyCardStyles.stepItemRow}>
              <View style={applyCardStyles.stepNumberBadge}>
                <Text style={applyCardStyles.stepNumberText}>2</Text>
              </View>
              <Text style={applyCardStyles.stepLabelText}>ID Details</Text>
            </View>

            {/* 3. Address Details */}
            <View style={applyCardStyles.stepItemRow}>
              <View style={applyCardStyles.stepNumberBadge}>
                <Text style={applyCardStyles.stepNumberText}>3</Text>
              </View>
              <Text style={applyCardStyles.stepLabelText}>Address Details</Text>
            </View>

            {/* 4. Emergency Contact */}
            <View style={applyCardStyles.stepItemRow}>
              <View style={applyCardStyles.stepNumberBadge}>
                <Text style={applyCardStyles.stepNumberText}>4</Text>
              </View>
              <Text style={applyCardStyles.stepLabelText}>Emergency Contact</Text>
            </View>

            {/* 5. Employment Details */}
            <View style={applyCardStyles.stepItemRow}>
              <View style={applyCardStyles.stepNumberBadge}>
                <Text style={applyCardStyles.stepNumberText}>5</Text>
              </View>
              <Text style={applyCardStyles.stepLabelText}>Employment Details</Text>
            </View>
          </View>
        </View>

        {/* Bottom Action Button (PROCEED) */}
        <TouchableOpacity
          style={[applyCardStyles.proceedBtn, isLoading && { opacity: 0.7 }]}
          onPress={onProceed}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.darkGreen} size="small" />
          ) : (
            <>
              <Text style={applyCardStyles.proceedBtnText}>PROCEED</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.darkGreen} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
