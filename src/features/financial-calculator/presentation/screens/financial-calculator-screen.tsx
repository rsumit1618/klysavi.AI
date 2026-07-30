import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { calcStyles } from './financial-calculator-screen.styles';
import { AppActionButton } from '@/shared/components/ui/app-action-button';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';

const FINANCE_TYPES = [
  'Personal Finance',
  'Auto Finance',
  'Mortgage / Housing Finance',
  'Credit Card Limit',
];

const INTEREST_RATES = ['4%', '5%', '6%', '7%', '8%'];

import { useFinancialCalculatorViewModel } from '../viewmodels/use-financial-calculator-view-model';

interface FinancialCalculatorScreenProps {
  onBack?: () => void;
}

export function FinancialCalculatorScreen({ onBack }: FinancialCalculatorScreenProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Refs for Keyboard Focus Chaining
  const requestedAmountRef = useRef<TextInput>(null);
  const periodMonthsRef = useRef<TextInput>(null);
  const grossIncomeRef = useRef<TextInput>(null);
  const internalDeductionRef = useRef<TextInput>(null);
  const personalLoanDeductionRef = useRef<TextInput>(null);
  const creditCardLimitRef = useRef<TextInput>(null);
  const autoLoanDeductionRef = useRef<TextInput>(null);
  const housingLoanDeductionRef = useRef<TextInput>(null);

  // State
  const [financeType, setFinanceType] = useState('Personal Finance');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [periodMonths, setPeriodMonths] = useState('');
  const [interestRate, setInterestRate] = useState('6%');
  const [grossIncome, setGrossIncome] = useState('');
  const [internalDeduction, setInternalDeduction] = useState('');
  const [personalLoanDeduction, setPersonalLoanDeduction] = useState('');
  const [creditCardLimit, setCreditCardLimit] = useState('');
  const [autoLoanDeduction, setAutoLoanDeduction] = useState('');
  const [housingLoanDeduction, setHousingLoanDeduction] = useState('');

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('warning');

  const showTopBanner = (message: string, type: BannerType = 'warning') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  // Picker Modal State
  const [activePicker, setActivePicker] = useState<'TYPE' | 'RATE' | null>(null);

  // Net Deduction Calculation
  const parseVal = (str: string) => parseFloat(str.replace(/,/g, '')) || 0;
  const netDeductionVal =
    parseVal(internalDeduction) +
    parseVal(personalLoanDeduction) +
    parseVal(autoLoanDeduction) +
    parseVal(housingLoanDeduction);

  const netDeductionFormatted = `BHD ${netDeductionVal.toFixed(3)}`;

  // Strict Validation Rules
  const numReqAmount = parseInt(requestedAmount.replace(/\D/g, '') || '0', 10);
  const numPeriod = parseInt(periodMonths.replace(/\D/g, '') || '0', 10);
  const numIncome = parseInt(grossIncome.replace(/\D/g, '') || '0', 10);

  const isFormValid = numReqAmount >= 100 && numPeriod >= 6 && numPeriod <= 84 && numIncome >= 100;

  const handleCalculate = () => {
    if (numReqAmount < 100) {
      showTopBanner('Requested amount must be at least BHD 100.', 'warning');
      return;
    }
    if (numPeriod < 6 || numPeriod > 84) {
      showTopBanner('Tenure period must be between 6 and 84 months.', 'warning');
      return;
    }
    if (numIncome < 100) {
      showTopBanner('Monthly Gross Income must be at least BHD 100.', 'warning');
      return;
    }

    router.push({
      pathname: '/financial-calculator-result',
      params: {
        financeType,
        requestedAmount: `BHD ${numReqAmount.toLocaleString()}`,
        periodMonths: `${numPeriod}`,
        netDeduction: netDeductionFormatted,
        grossIncome: `BHD ${numIncome.toLocaleString()}`,
      },
    });
  };

  const handleInfoPress = (fieldTitle: string, infoText: string) => {
    Alert.alert(fieldTitle, infoText);
  };

  return (
    <View style={calcStyles.container}>
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={calcStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Headline & Description */}
            <View style={calcStyles.headlineSection}>
              <Text style={calcStyles.headlineText}>Let’s calculate your financial eligibility with us</Text>
              <Text style={calcStyles.subtext}>Please choose your preferred financial services below</Text>
            </View>

            {/* 1. FINANCE TYPE (Dropdown) */}
            <View style={calcStyles.formGroup}>
              <Text style={calcStyles.fieldLabel}>FINANCE TYPE</Text>
              <TouchableOpacity
                style={calcStyles.underlineRow}
                onPress={() => setActivePicker('TYPE')}
                activeOpacity={0.8}
              >
                <Text style={calcStyles.underlineInput}>{financeType}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {/* 2. REQUESTED AMOUNT */}
            <View style={calcStyles.formGroup}>
              <Text style={calcStyles.fieldLabel}>REQUESTED AMOUNT (BHD)</Text>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={requestedAmountRef}
                  style={calcStyles.underlineInput}
                  value={requestedAmount}
                  onChangeText={(val) => setRequestedAmount(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={7}
                  returnKeyType="next"
                  onSubmitEditing={() => periodMonthsRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. 15000 (Max 7 digits)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 3. PERIOD (MONTHS) */}
            <View style={calcStyles.formGroup}>
              <Text style={calcStyles.fieldLabel}>PERIOD (MONTHS, MAX 84)</Text>
              <View style={calcStyles.underlineRow}>
                <TextInput
                  ref={periodMonthsRef}
                  style={calcStyles.underlineInput}
                  value={periodMonths}
                  onChangeText={(val) => {
                    const clean = val.replace(/\D/g, '');
                    if (clean && parseInt(clean, 10) > 84) {
                      setPeriodMonths('84');
                      showTopBanner('Maximum loan tenure is 84 months (7 years).', 'info');
                    } else {
                      setPeriodMonths(clean);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  returnKeyType="next"
                  onSubmitEditing={() => grossIncomeRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. 48 (6 - 84 months)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 4. INTEREST RATE (Dropdown) */}
            <View style={calcStyles.formGroup}>
              <Text style={calcStyles.fieldLabel}>INTEREST RATE</Text>
              <TouchableOpacity
                style={calcStyles.underlineRow}
                onPress={() => setActivePicker('RATE')}
                activeOpacity={0.8}
              >
                <Text style={calcStyles.underlineInput}>{interestRate}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {/* 5. MONTHLY GROSS INCOME ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>MONTHLY GROSS INCOME (BHD)</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Monthly Gross Income', 'Your total monthly salary before taxes and deductions.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={grossIncomeRef}
                  style={calcStyles.underlineInput}
                  value={grossIncome}
                  onChangeText={(val) => setGrossIncome(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={7}
                  returnKeyType="next"
                  onSubmitEditing={() => internalDeductionRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="e.g. 800"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 6. INTERNAL DEDUCTION ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>INTERNAL DEDUCTION</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Internal Deduction', 'Existing internal loan deductions with Klysavo / BCFC.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={internalDeductionRef}
                  style={calcStyles.underlineInput}
                  value={internalDeduction}
                  onChangeText={(val) => setInternalDeduction(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => personalLoanDeductionRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="0.000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 7. PERSONAL LOAN DEDUCTION ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>PERSONAL LOAN DEDUCTION</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Personal Loan Deduction', 'Monthly installments for existing personal loans.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={personalLoanDeductionRef}
                  style={calcStyles.underlineInput}
                  value={personalLoanDeduction}
                  onChangeText={(val) => setPersonalLoanDeduction(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => creditCardLimitRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="0.000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 8. CREDIT CARD LIMIT ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>CREDIT CARD LIMIT</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Credit Card Limit', 'Total combined credit limit across all active credit cards.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={creditCardLimitRef}
                  style={calcStyles.underlineInput}
                  value={creditCardLimit}
                  onChangeText={(val) => setCreditCardLimit(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => autoLoanDeductionRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="0.000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 9. AUTO LOAN DEDUCTION ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>AUTO LOAN DEDUCTION</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Auto Loan Deduction', 'Monthly installments for active car loans.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={autoLoanDeductionRef}
                  style={calcStyles.underlineInput}
                  value={autoLoanDeduction}
                  onChangeText={(val) => setAutoLoanDeduction(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => housingLoanDeductionRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="0.000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 10. HOUSING LOAN DEDUCTION ⓘ */}
            <View style={calcStyles.formGroup}>
              <View style={calcStyles.labelRow}>
                <Text style={calcStyles.fieldLabel}>HOUSING LOAN DEDUCTION</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleInfoPress('Housing Loan Deduction', 'Monthly mortgage or housing loan installments.')
                  }
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              <View style={calcStyles.underlineRow}>
                <Text style={calcStyles.prefixText}>BHD</Text>
                <TextInput
                  ref={housingLoanDeductionRef}
                  style={calcStyles.underlineInput}
                  value={housingLoanDeduction}
                  onChangeText={(val) => setHousingLoanDeduction(val.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder="0.000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* 11. NET DEDUCTION */}
            <View style={calcStyles.formGroup}>
              <Text style={calcStyles.fieldLabel}>NET DEDUCTION</Text>
              <View style={[calcStyles.underlineRow, { borderBottomColor: colors.darkGreen }]}>
                <Text style={calcStyles.underlineInput}>{netDeductionFormatted}</Text>
              </View>
            </View>
          </View>

          {/* Action Yellow Button (CALCULATE) */}
          <AppActionButton
            title="CALCULATE"
            disabled={!isFormValid}
            iconName="arrow-forward"
            onPress={handleCalculate}
            style={{ marginTop: 16, marginBottom: 24 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Dropdown Bottom Sheet Picker Modal */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={calcStyles.pickerModalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={calcStyles.pickerSheetContainer}>
            <View style={calcStyles.pickerSheetHeader}>
              <Text style={calcStyles.pickerSheetTitle}>
                Select {activePicker === 'TYPE' ? 'Finance Type' : 'Interest Rate'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close" size={22} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {(activePicker === 'TYPE' ? FINANCE_TYPES : INTEREST_RATES).map((option) => {
                const isSelected =
                  activePicker === 'TYPE' ? financeType === option : interestRate === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={calcStyles.pickerOptionItem}
                    onPress={() => {
                      if (activePicker === 'TYPE') setFinanceType(option);
                      else setInterestRate(option);
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        calcStyles.pickerOptionText,
                        isSelected && calcStyles.pickerOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.darkGreen} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
