import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { StepProgressBar } from '@/shared/components/step-progress-header';

interface AddressDetailsStepScreenProps {
  onContinue: (data?: { building: string; road: string; block: string; city: string }) => void;
  onSkip?: () => void;
  onBack: () => void;
  initialData?: { building?: string; road?: string; block?: string; city?: string };
  isLoading?: boolean;
}

export function AddressDetailsStepScreen({ onContinue, onBack, initialData, isLoading }: AddressDetailsStepScreenProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [building, setBuilding] = useState(initialData?.building || '1042');
  const [road, setRoad] = useState(initialData?.road || '3819');
  const [block, setBlock] = useState(initialData?.block || '338');
  const [city, setCity] = useState(initialData?.city || 'Manama');

  React.useEffect(() => {
    if (initialData) {
      if (initialData.building) setBuilding(initialData.building);
      if (initialData.road) setRoad(initialData.road);
      if (initialData.block) setBlock(initialData.block);
      if (initialData.city) setCity(initialData.city);
    }
  }, [initialData]);

  const isFormFilled = building.trim().length > 0 && road.trim().length > 0;

  const handleNext = () => {
    if (!isFormFilled) return;
    onContinue({ building, road, block, city });
  };

  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Standardized App Header outside ScrollView - Same as Reward Page */}
      <AppHeader showBack title="Address Details" onBackPress={onBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[applyCardStyles.scrollContent, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            {/* Step Progress Bar */}
            <StepProgressBar currentStep={3} totalSteps={5} />

            {/* Headline & Sublink */}
            <View style={applyCardStyles.headlineSection}>
              <Text style={applyCardStyles.headlineText}>Where do you currently reside?</Text>
              <TouchableOpacity onPress={() => Alert.alert('Address Requirement', 'Required for credit card delivery and regulatory compliance.')}>
                <Text style={applyCardStyles.subLinkText}>Why do we need your address?</Text>
              </TouchableOpacity>
            </View>

            {/* BUILDING NUMBER */}
            <View style={applyCardStyles.formGroup}>
              <Text style={applyCardStyles.fieldLabel}>BUILDING / VILLA NUMBER</Text>
              <View style={[applyCardStyles.underlineInputRow, focusedInput === 'building' && applyCardStyles.underlineInputRowFocused]}>
                <TextInput
                  style={applyCardStyles.underlineInput}
                  value={building}
                  onFocus={() => setFocusedInput('building')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={setBuilding}
                  placeholder="Please enter"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* ROAD / STREET */}
            <View style={applyCardStyles.formGroup}>
              <Text style={applyCardStyles.fieldLabel}>ROAD / STREET NAME</Text>
              <View style={[applyCardStyles.underlineInputRow, focusedInput === 'road' && applyCardStyles.underlineInputRowFocused]}>
                <TextInput
                  style={applyCardStyles.underlineInput}
                  value={road}
                  onFocus={() => setFocusedInput('road')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={setRoad}
                  placeholder="Please enter"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* BLOCK NUMBER */}
            <View style={applyCardStyles.formGroup}>
              <Text style={applyCardStyles.fieldLabel}>BLOCK NUMBER</Text>
              <View style={[applyCardStyles.underlineInputRow, focusedInput === 'block' && applyCardStyles.underlineInputRowFocused]}>
                <TextInput
                  style={applyCardStyles.underlineInput}
                  value={block}
                  onFocus={() => setFocusedInput('block')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={setBlock}
                  keyboardType="numeric"
                  placeholder="Please enter"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* CITY / AREA */}
            <View style={applyCardStyles.formGroup}>
              <Text style={applyCardStyles.fieldLabel}>CITY / AREA</Text>
              <View style={[applyCardStyles.underlineInputRow, focusedInput === 'city' && applyCardStyles.underlineInputRowFocused]}>
                <TextInput
                  style={applyCardStyles.underlineInput}
                  value={city}
                  onFocus={() => setFocusedInput('city')}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={setCity}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
