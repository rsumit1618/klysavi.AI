import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/core/theme/colors';
import { applyCardStyles } from './apply-card-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { StepProgressBar } from '@/shared/components/step-progress-header';
import { UnderlineInputField } from '@/shared/components/underline-input-field';
import { DropdownPickerModal } from '@/shared/components/dropdown-picker-modal';

interface EmploymentDetailsStepScreenProps {
  onSubmit: (data?: { employmentStatus: string; occupation: string; employerName: string; monthlySalary: string }) => void;
  onSkip?: () => void;
  onBack: () => void;
  initialData?: { employmentStatus?: string; occupation?: string; employerName?: string; monthlySalary?: string };
  isLoading?: boolean;
}

const EMPLOYMENT_STATUS_OPTIONS = [
  'Employed - Private Sector',
  'Employed - Government Sector',
  'Self-Employed / Business Owner',
  'Retired',
  'Student',
  'Unemployed',
];
const JOINING_YEAR_OPTIONS = ['2025', '2024', '2023', '2022', '2021', '2020 or earlier'];

export function EmploymentDetailsStepScreen({ onSubmit, onBack, initialData, isLoading }: EmploymentDetailsStepScreenProps) {
  // Form state
  const [employmentStatus, setEmploymentStatus] = useState(initialData?.employmentStatus || 'Employed - Private Sector');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');
  const [employerName, setEmployerName] = useState(initialData?.employerName || '');
  const [joiningDate, setJoiningDate] = useState('2024');
  const [monthlySalary, setMonthlySalary] = useState(initialData?.monthlySalary ? initialData.monthlySalary.replace(/[^0-9.]/g, '') : '');
  const [hasAdditionalIncome, setHasAdditionalIncome] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      if (initialData.employmentStatus) setEmploymentStatus(initialData.employmentStatus);
      if (initialData.occupation) setOccupation(initialData.occupation);
      if (initialData.employerName) setEmployerName(initialData.employerName);
      if (initialData.monthlySalary) setMonthlySalary(initialData.monthlySalary.replace(/[^0-9.]/g, ''));
    }
  }, [initialData]);

  // Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showJoiningModal, setShowJoiningModal] = useState(false);

  // Form Validation
  const numSalary = parseFloat(monthlySalary) || 0;
  const isFormFilled = employmentStatus.length > 0 && occupation.trim().length >= 2 && employerName.trim().length >= 2 && numSalary >= 100;

  const handleSubmit = () => {
    if (!isFormFilled || isLoading) return;
    onSubmit({
      employmentStatus,
      occupation: occupation.trim(),
      employerName: employerName.trim(),
      monthlySalary: `BHD ${numSalary.toFixed(3)}`,
    });
  };

  return (
    <SafeAreaView style={applyCardStyles.container}>
      {/* Standardized App Header outside ScrollView - Same as Reward Page */}
      <AppHeader showBack title="Employment Details" onBackPress={onBack} />

      <ScrollView contentContainerStyle={applyCardStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          {/* Step Progress Bar */}
          <StepProgressBar currentStep={5} totalSteps={5} />

          {/* Headline */}
          <View style={applyCardStyles.headlineSection}>
            <Text style={applyCardStyles.headlineText}>Let’s answer your employment details</Text>
          </View>

          {/* Reusable Form Fields */}
          <UnderlineInputField
            label="EMPLOYMENT STATUS"
            isDropdown
            dropdownValue={employmentStatus || 'Select Employment Status'}
            onRightIconPress={() => setShowStatusModal(true)}
          />

          <UnderlineInputField
            label="OCCUPATION"
            value={occupation}
            onChangeText={setOccupation}
            placeholder="Enter occupation title"
          />

          <UnderlineInputField
            label="EMPLOYER NAME"
            value={employerName}
            onChangeText={setEmployerName}
            placeholder="Enter company / employer name"
          />

          <UnderlineInputField
            label="JOINING YEAR"
            isDropdown
            dropdownValue={joiningDate || 'Select Joining Year'}
            onRightIconPress={() => setShowJoiningModal(true)}
          />

          <UnderlineInputField
            label="MONTHLY INCOME"
            prefix="BHD"
            value={monthlySalary}
            onChangeText={(val) => setMonthlySalary(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="Enter monthly salary"
          />

          {/* Toggle Switch */}
          <View style={applyCardStyles.toggleRow}>
            <Text style={applyCardStyles.toggleLabel}>Do you have additional sources of income?</Text>
            <TouchableOpacity
              style={[applyCardStyles.togglePill, hasAdditionalIncome && applyCardStyles.togglePillActive]}
              onPress={() => setHasAdditionalIncome(!hasAdditionalIncome)}
              activeOpacity={0.8}
            >
              <View style={[applyCardStyles.toggleCircle, hasAdditionalIncome && applyCardStyles.toggleCircleActive]}>
                <Text style={[applyCardStyles.toggleText, hasAdditionalIncome && { color: colors.darkGreen }]}>
                  {hasAdditionalIncome ? 'YES' : 'NO'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Button Section (Full-Width SUBMIT Button) */}
        <View style={applyCardStyles.buttonStack}>
          <TouchableOpacity
            style={[applyCardStyles.nextBtn, { flex: 1 }, (!isFormFilled || isLoading) && applyCardStyles.nextBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isFormFilled || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[applyCardStyles.nextBtnText, !isFormFilled && applyCardStyles.nextBtnTextDisabled]}>
                SUBMIT
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Employment Status Dropdown Modal */}
      <DropdownPickerModal
        visible={showStatusModal}
        title="Employment Status"
        options={EMPLOYMENT_STATUS_OPTIONS}
        selectedValue={employmentStatus}
        onSelect={setEmploymentStatus}
        onClose={() => setShowStatusModal(false)}
      />

      {/* Joining Year Dropdown Modal */}
      <DropdownPickerModal
        visible={showJoiningModal}
        title="Joining Year"
        options={JOINING_YEAR_OPTIONS}
        selectedValue={joiningDate}
        onSelect={setJoiningDate}
        onClose={() => setShowJoiningModal(false)}
      />
    </SafeAreaView>
  );
}
