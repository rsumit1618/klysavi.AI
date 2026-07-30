import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { StepProgressBar } from '@/shared/components/step-progress-header';
import { getUserDataFromSecureStore } from '@/core/services/secure-storage-service';
import { useSession } from '@/features/auth/presentation/session-provider';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';

interface IdDetailsStepScreenProps {
  onContinue: (data?: { fullName: string; cprNumber: string; dob: string; expiryDate: string; nationality: string }) => void;
  onSkip?: () => void;
  onBack: () => void;
  initialData?: { fullName?: string; cprNumber?: string; dob?: string; expiryDate?: string; nationality?: string };
  isLoading?: boolean;
}

export function IdDetailsStepScreen({ onContinue, onBack, initialData, isLoading }: IdDetailsStepScreenProps) {
  const { session } = useSession();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [fullName, setFullName] = useState(initialData?.fullName || session?.displayName || '');
  const [cprNumber, setCprNumber] = useState(initialData?.cprNumber || session?.cprNumber || '');
  const [dob, setDob] = useState(initialData?.dob || '14/08/1992');
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || '12/2029');
  const [nationality, setNationality] = useState(initialData?.nationality || 'Bahraini');

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('info');

  const showTopBanner = (message: string, type: BannerType = 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  useEffect(() => {
    if (initialData) {
      if (initialData.fullName) setFullName(initialData.fullName);
      if (initialData.cprNumber) setCprNumber(initialData.cprNumber);
      if (initialData.dob) setDob(initialData.dob);
      if (initialData.expiryDate) setExpiryDate(initialData.expiryDate);
      if (initialData.nationality) setNationality(initialData.nationality);
    }
  }, [initialData]);

  useEffect(() => {
    async function loadUserData() {
      if (!initialData?.fullName || !initialData?.cprNumber) {
        const stored = await getUserDataFromSecureStore();
        if (stored) {
          if (!fullName && stored.fullName) setFullName(stored.fullName);
          if (!cprNumber && stored.cprNumber) setCprNumber(stored.cprNumber);
        }
      }
    }

    loadUserData();
  }, []);

  const isFormFilled = fullName.trim().length > 0 && cprNumber.trim().length > 0;

  const handleNext = () => {
    if (!isFormFilled) return;
    onContinue({ fullName, cprNumber, dob, expiryDate, nationality });
  };

  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Top Banner Notification */}
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      {/* Standardized App Header outside ScrollView - Same as Reward Page */}
      <AppHeader showBack title="ID Details" onBackPress={onBack} />

      <ScrollView contentContainerStyle={applyCardStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          {/* Step Progress Bar */}
          <StepProgressBar currentStep={2} totalSteps={5} />

          {/* Headline & Sublink */}
          <View style={applyCardStyles.headlineSection}>
            <Text style={applyCardStyles.headlineText}>Verify your ID details</Text>
            <TouchableOpacity onPress={() => showTopBanner('Data automatically verified with eGovernment Authority (iGA).', 'info')}>
              <Text style={applyCardStyles.subLinkText}>Is this data automatically fetched?</Text>
            </TouchableOpacity>
          </View>

          {/* FULL NAME */}
          <View style={applyCardStyles.formGroup}>
            <Text style={applyCardStyles.fieldLabel}>FULL NAME (AS ON CPR)</Text>
            <View style={[applyCardStyles.underlineInputRow, focusedInput === 'fullName' && applyCardStyles.underlineInputRowFocused]}>
              <TextInput
                style={applyCardStyles.underlineInput}
                value={fullName}
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
                onChangeText={setFullName}
                placeholder="Please enter"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* CPR NUMBER */}
          <View style={applyCardStyles.formGroup}>
            <Text style={applyCardStyles.fieldLabel}>CPR / ID NUMBER</Text>
            <View style={[applyCardStyles.underlineInputRow, focusedInput === 'cpr' && applyCardStyles.underlineInputRowFocused]}>
              <TextInput
                style={applyCardStyles.underlineInput}
                value={cprNumber}
                onFocus={() => setFocusedInput('cpr')}
                onBlur={() => setFocusedInput(null)}
                onChangeText={setCprNumber}
                keyboardType="numeric"
                placeholder="Please enter"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* DATE OF BIRTH */}
          <View style={applyCardStyles.formGroup}>
            <Text style={applyCardStyles.fieldLabel}>DATE OF BIRTH</Text>
            <View style={[applyCardStyles.underlineInputRow, focusedInput === 'dob' && applyCardStyles.underlineInputRowFocused]}>
              <TextInput
                style={applyCardStyles.underlineInput}
                value={dob}
                onFocus={() => setFocusedInput('dob')}
                onBlur={() => setFocusedInput(null)}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* NATIONALITY */}
          <View style={applyCardStyles.formGroup}>
            <Text style={applyCardStyles.fieldLabel}>NATIONALITY</Text>
            <View style={[applyCardStyles.underlineInputRow, focusedInput === 'nationality' && applyCardStyles.underlineInputRowFocused]}>
              <TextInput
                style={applyCardStyles.underlineInput}
                value={nationality}
                onFocus={() => setFocusedInput('nationality')}
                onBlur={() => setFocusedInput(null)}
                onChangeText={setNationality}
                placeholder="Please enter"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Bottom Button Section (Full-Width NEXT Button) */}
        <View style={applyCardStyles.buttonStack}>
          <TouchableOpacity
            style={[applyCardStyles.nextBtn, { flex: 1 }, (!isFormFilled || isLoading) && applyCardStyles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!isFormFilled || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[applyCardStyles.nextBtnText, !isFormFilled && applyCardStyles.nextBtnTextDisabled]}>
                NEXT
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
