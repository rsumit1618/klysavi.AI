import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';

interface ApplicationSuccessScreenProps {
  onDone: () => void;
  applicationId?: string;
  isLoading?: boolean;
}

export function ApplicationSuccessScreen({
  onDone,
  applicationId = '890403244322000',
  isLoading = false,
}: ApplicationSuccessScreenProps) {
  return (
    <SafeAreaView style={applyCardStyles.reviewScreenContainer}>
      {/* Main Content Area - Positioned with increased top spacing */}
      <View style={applyCardStyles.reviewContentArea}>
        {/* Dotted Circular Clock Icon Badge (Increased Size) */}
        <View style={applyCardStyles.reviewIconCircle}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
        </View>

        {/* Title */}
        <Text style={applyCardStyles.reviewTitle}>
          Your Application is{'\n'}Approved & Active
        </Text>

        {/* Subtext */}
        <Text style={applyCardStyles.reviewSubtext}>
          Your new card is ready and visible on your Home Dashboard
        </Text>

        {/* Application ID Card */}
        <View style={applyCardStyles.appIdBoxCard}>
          <Text style={applyCardStyles.appIdLabel}>Application ID</Text>
          <Text style={applyCardStyles.appIdValue}>{applicationId}</Text>
        </View>
      </View>

      {/* Bottom White Card Action Button (DONE) */}
      <TouchableOpacity
        style={applyCardStyles.doneBtn}
        onPress={onDone}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.textDark} />
        ) : (
          <Text style={applyCardStyles.doneBtnText}>DONE</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
