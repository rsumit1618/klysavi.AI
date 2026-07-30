import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { fontFamilies, typography } from '@/core/theme/typography';

interface StepProgressHeaderProps {
  title: string;
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  showAutoSave?: boolean;
}

export function StepProgressBar({
  currentStep,
  totalSteps = 5,
  showAutoSave = true,
}: {
  currentStep: number;
  totalSteps?: number;
  showAutoSave?: boolean;
}) {
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressTextRow}>
        <Text style={styles.stepIndicatorText}>
          STEP {currentStep} OF {totalSteps}
        </Text>
        {showAutoSave && <Text style={styles.autoSaveText}>AUTO SAVE</Text>}
      </View>

      {/* Segmented Progress Bars */}
      <View style={styles.progressBarRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          return (
            <View
              key={index}
              style={[styles.progressSegment, isActive && styles.progressSegmentActive]}
            />
          );
        })}
      </View>
    </View>
  );
}

export function StepProgressHeader({
  title,
  currentStep,
  totalSteps = 5,
  onBack,
  showAutoSave = true,
}: StepProgressHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Header Title Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      {/* Progress Bar Section */}
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} showAutoSave={showAutoSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.headerTitle,
    flex: 1,
    textAlign: 'center',
  },
  rightSpacer: {
    width: 40,
    marginRight: -8,
  },
  progressSection: {
    marginBottom: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepIndicatorText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  autoSaveText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: '#2E7D5B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressSegmentActive: {
    backgroundColor: '#0C231E',
  },
});
