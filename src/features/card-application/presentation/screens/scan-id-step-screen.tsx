import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { StepProgressBar } from '@/shared/components/step-progress-header';

interface ScanIdStepScreenProps {
  onContinue: (data?: { capturedImage: string }) => void;
  onSkip?: () => void;
  onBack: () => void;
  initialImage?: string;
  isLoading?: boolean;
}

export function ScanIdStepScreen({ onContinue, onBack, initialImage, isLoading }: ScanIdStepScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImage || null);

  React.useEffect(() => {
    if (initialImage) {
      setCapturedImage(initialImage);
    }
  }, [initialImage]);

  const handleScanCPR = async () => {
    try {
      // 1. Request Camera Permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera access to scan your ID card.');
        return;
      }

      // 2. Launch Camera with Base64 encoding enabled
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64Data = asset.base64
          ? (asset.base64.startsWith('data:image') ? asset.base64 : `data:image/jpeg;base64,${asset.base64}`)
          : asset.uri;
        setCapturedImage(base64Data);
      }
    } catch (error) {
      console.error('Camera Launch Error:', error);
      Alert.alert('Error', 'Unable to open camera. Please try again.');
    }
  };

  const handleNext = () => {
    if (!capturedImage || isLoading) return;
    onContinue({ capturedImage });
  };

  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Standardized App Header outside ScrollView - Same as Reward Page */}
      <AppHeader showBack title="Scan ID" onBackPress={onBack} />

      <ScrollView contentContainerStyle={applyCardStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          {/* Step Progress Bar */}
          <StepProgressBar currentStep={1} totalSteps={5} />

          {/* Headline & Sublink */}
          <View style={applyCardStyles.headlineSection}>
            <Text style={applyCardStyles.headlineText}>Scan your Smart CPR ID</Text>
            <TouchableOpacity onPress={() => Alert.alert('CPR Scan', 'We extract identity data automatically from your Bahrain CPR card.')}>
              <Text style={applyCardStyles.subLinkText}>Why do we need to scan your CPR ID?</Text>
            </TouchableOpacity>
          </View>

          {/* Camera Scan Viewport Card */}
          <View style={applyCardStyles.scanContainer}>
            {capturedImage ? (
              <Image source={{ uri: capturedImage }} style={applyCardStyles.capturedImage} resizeMode="cover" />
            ) : (
              <View style={applyCardStyles.scanFrame}>
                <Ionicons name="camera-outline" size={44} color={colors.gold} />
                <Text style={applyCardStyles.scanText}>Position CPR ID inside frame</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[applyCardStyles.nextBtn, { backgroundColor: colors.darkGreen, marginBottom: 12 }]}
            onPress={handleScanCPR}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={[applyCardStyles.nextBtnText, { color: colors.gold }]}>
              {capturedImage ? 'RE-SCAN CPR' : 'SCAN CPR NOW'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Button Section (Full Width NEXT Button) */}
        <View style={applyCardStyles.buttonStack}>
          <TouchableOpacity
            style={[applyCardStyles.nextBtn, { flex: 1 }, (!capturedImage || isLoading) && applyCardStyles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!capturedImage || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[applyCardStyles.nextBtnText, !capturedImage && applyCardStyles.nextBtnTextDisabled]}>
                NEXT
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
