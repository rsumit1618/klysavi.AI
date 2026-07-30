import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';

import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { StepProgressBar } from '@/shared/components/step-progress-header';
import { UnderlineInputField } from '@/shared/components/underline-input-field';
import { DropdownPickerModal } from '@/shared/components/dropdown-picker-modal';

interface EmergencyContactStepScreenProps {
  onContinue: (data?: { name: string; phone: string; relationship: string }) => void;
  onSkip?: () => void;
  onBack: () => void;
  initialData?: { name?: string; phone?: string; relationship?: string };
  isLoading?: boolean;
}

const RELATIONSHIP_OPTIONS = [
  'Father',
  'Mother',
  'Spouse',
  'Sibling',
  'Son',
  'Daughter',
  'Friend',
  'Relative',
  'Colleague',
];

export function EmergencyContactStepScreen({ onContinue, onBack, initialData, isLoading }: EmergencyContactStepScreenProps) {
  // Form state initialized with existing data if available
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone ? initialData.phone.replace(/^\+91\s*/, '') : '');
  const [relationship, setRelationship] = useState(initialData?.relationship || '');
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.phone) setPhone(initialData.phone.replace(/^\+91\s*/, ''));
      if (initialData.relationship) setRelationship(initialData.relationship);
    }
  }, [initialData]);

  const phoneInputRef = useRef<TextInput>(null);

  // Phone number must be exactly 10 digits and have prefix +91
  const isPhoneValid = phone.trim().length === 10;
  const isFormFilled = name.trim().length >= 2 && isPhoneValid && relationship.length > 0;

  const handleNext = () => {
    if (!isFormFilled) return;
    onContinue({ name, phone: `+91 ${phone}`, relationship });
  };

  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Standardized App Header outside ScrollView - Same as Reward Page */}
      <AppHeader showBack title="Emergency Contact" onBackPress={onBack} />

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
            <StepProgressBar currentStep={4} totalSteps={5} />

            {/* Headline & Sublink */}
            <View style={applyCardStyles.headlineSection}>
              <Text style={applyCardStyles.headlineText}>Alternative Contact Person</Text>
              <TouchableOpacity onPress={() => Alert.alert('Alternative Contact', 'We require an emergency contact for security and account verification purposes.')}>
                <Text style={applyCardStyles.subLinkText}>Why does BCFC needs Alternative Contact?</Text>
              </TouchableOpacity>
            </View>

            {/* Reusable Form Inputs */}
            <UnderlineInputField
              label="NAME"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => phoneInputRef.current?.focus()}
              blurOnSubmit={false}
              placeholder="Enter contact full name"
            />

            <UnderlineInputField
              inputRef={phoneInputRef}
              label="CONTACT NUMBER"
              prefix="+91"
              value={phone}
              onChangeText={(val) => setPhone(val.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              maxLength={10}
              returnKeyType="done"
              placeholder="Enter 10-digit mobile number"
            />

            {/* Relationship Dropdown Picker Field */}
            <UnderlineInputField
              label="RELATIONSHIP"
              isDropdown
              dropdownValue={relationship || 'Select Relationship'}
              onRightIconPress={() => setShowDropdown(true)}
            />
          </View>

          {/* Bottom Button Section */}
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

      {/* Relationship Dropdown Bottom Sheet Modal */}
      <DropdownPickerModal
        visible={showDropdown}
        title="Select Relationship"
        options={RELATIONSHIP_OPTIONS}
        selectedValue={relationship}
        onSelect={(val) => setRelationship(val)}
        onClose={() => setShowDropdown(false)}
      />
    </SafeAreaView>
  );
}
