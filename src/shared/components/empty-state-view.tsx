import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { emptyStateStyles } from './empty-state-view.styles';

import { transactionsStyles } from '@/features/transactions/presentation/screens/transactions-screen.styles';

interface EmptyStateViewProps {
  screenTitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonPress: () => void;
}

export function EmptyStateView({
  screenTitle,
  iconName,
  title,
  subtitle,
  buttonText,
  onButtonPress,
}: EmptyStateViewProps) {
  return (
    <SafeAreaView style={emptyStateStyles.container}>
      <ScrollView contentContainerStyle={emptyStateStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title Header */}
        <View style={transactionsStyles.headerRow}>
          <Text style={transactionsStyles.headerTitle}>{screenTitle}</Text>
        </View>

        {/* Center Empty State View */}
        <View style={emptyStateStyles.centerContent}>
          {/* Icon Badge */}
          <View style={emptyStateStyles.iconContainer}>
            <Ionicons name={iconName} size={48} color={colors.textMuted} />
          </View>

          {/* Title & Subtitle */}
          <Text style={emptyStateStyles.titleText}>{title}</Text>
          <Text style={emptyStateStyles.subtitleText}>{subtitle}</Text>

          {/* Action Button */}
          <TouchableOpacity style={emptyStateStyles.applyBtn} onPress={onButtonPress} activeOpacity={0.8}>
            <Text style={emptyStateStyles.applyBtnText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
