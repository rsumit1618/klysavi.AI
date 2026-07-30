import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { registerStyles } from './register-screen.styles';
import { isValidEmail, isValidPhoneNumber } from '@/core/utils/validators';
import { checkUserExistsInFirebase, registerUserInFirebase } from '@/features/auth/services/firebase-auth-service';
import { saveUserDataToSecureStore } from '@/core/services/secure-storage-service';
import { useSession } from '@/features/auth/presentation/session-provider';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';
import { AuthNoticeModal } from '../components/auth-notice-modal';

export function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useSession();

  // Mandatory Registration Form State
  const [fullName, setFullName] = useState('');
  const [cprNumber, setCprNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('warning');

  // Notice Modal for Existing Registered Account
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const showTopBanner = (message: string, type: BannerType = 'warning') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  // Keyboard Focus Chaining Refs
  const cprInputRef = useRef<TextInput>(null);
  const mobileInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const isNameValid = fullName.trim().length >= 2;
  const isCprValid = isValidPhoneNumber(cprNumber);
  const isPhoneValid = mobileNumber.trim().length === 10;
  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.trim().length >= 6;

  const isFormValid = isNameValid && isCprValid && isPhoneValid && isEmailValid && isPasswordValid;

  const handleRegister = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      // 1. Direct Firestore Check
      const existingUser = await checkUserExistsInFirebase(cprNumber, mobileNumber, email);

      if (existingUser) {
        setLoading(false);
        setShowNoticeModal(true);
        return;
      }

      // 2. Direct Registration in Firestore
      const createdUser = await registerUserInFirebase({
        fullName,
        cprNumber,
        mobileNumber,
        email,
        password,
      });

      // Save user profile to SecureStore
      await saveUserDataToSecureStore(createdUser);

      await signIn(createdUser);
      setLoading(false);

      showTopBanner(`Registration successful! Welcome, ${createdUser.fullName}!`, 'success');
      setTimeout(() => {
        router.replace('/(main)/home');
      }, 600);
    } catch (error: any) {
      setLoading(false);
      console.error('Firebase Registration Error:', error);

      const errorCode = error?.code;
      if (error?.message === 'USER_ALREADY_EXISTS' || errorCode === 'auth/email-already-in-use') {
        showTopBanner('An account with this email already exists. Please login instead.', 'warning');
      } else if (errorCode === 'auth/invalid-email') {
        showTopBanner('The email address is invalid.', 'error');
      } else if (errorCode === 'auth/weak-password') {
        showTopBanner('The password is too weak. Use at least 6 characters.', 'error');
      } else if (error?.message?.includes('permission')) {
        showTopBanner('System error: Registration permissions denied. Contact support.', 'error');
      } else {
        showTopBanner('Unable to complete registration. Please try again.', 'error');
      }
    }
  };

  return (
    <SafeAreaView style={registerStyles.container}>
      {/* Top Banner Notification */}
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
          ref={scrollRef}
          contentContainerStyle={registerStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Navigation Back Button */}
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity
              style={{ width: 40, height: 40, justifyContent: 'center' }}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={26} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          {/* Main Form Body */}
          <View style={registerStyles.mainFormSection}>
            {/* Welcome Headline */}
            <View style={registerStyles.welcomeSection}>
              <Text style={registerStyles.greetingText}>Create Account</Text>
              <Text style={registerStyles.titleText}>Join Klysavo AI Banking</Text>
            </View>

            {/* Field 1: FULL NAME */}
            <View style={registerStyles.formGroup}>
              <Text style={registerStyles.fieldLabel}>FULL NAME (AS ON CPR)</Text>
              <View
                style={[
                  registerStyles.underlineInputRow,
                  focusedInput === 'fullName' && registerStyles.underlineInputRowFocused,
                ]}
              >
                <TextInput
                  style={registerStyles.inputField}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => cprInputRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="Enter full name as on CPR"
                  placeholderTextColor={colors.textMuted}
                />
                <Ionicons name="person-outline" size={20} color={colors.textDark} style={registerStyles.infoIcon} />
              </View>
            </View>

            {/* Field 2: CPR / ID NUMBER */}
            <View style={registerStyles.formGroup}>
              <Text style={registerStyles.fieldLabel}>ID NUMBER (CPR)</Text>
              <View
                style={[
                  registerStyles.underlineInputRow,
                  focusedInput === 'cprNumber' && registerStyles.underlineInputRowFocused,
                ]}
              >
                <TextInput
                  ref={cprInputRef}
                  style={registerStyles.inputField}
                  value={cprNumber}
                  onChangeText={(val) => setCprNumber(val.replace(/\D/g, ''))}
                  onFocus={() => setFocusedInput('cprNumber')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="numeric"
                  maxLength={15}
                  returnKeyType="next"
                  onSubmitEditing={() => mobileInputRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="Enter 9-digit CPR number"
                  placeholderTextColor={colors.textMuted}
                />
                <Ionicons name="card-outline" size={20} color={colors.textDark} style={registerStyles.infoIcon} />
              </View>
            </View>

            {/* Field 3: MOBILE NUMBER */}
            <View style={registerStyles.formGroup}>
              <Text style={registerStyles.fieldLabel}>MOBILE NUMBER</Text>
              <View
                style={[
                  registerStyles.underlineInputRow,
                  focusedInput === 'mobileNumber' && registerStyles.underlineInputRowFocused,
                ]}
              >
                <TextInput
                  ref={mobileInputRef}
                  style={registerStyles.inputField}
                  value={mobileNumber}
                  onChangeText={(val) => setMobileNumber(val.replace(/\D/g, ''))}
                  onFocus={() => setFocusedInput('mobileNumber')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="Enter mobile number"
                  placeholderTextColor={colors.textMuted}
                />
                <Ionicons name="call-outline" size={20} color={colors.textDark} style={registerStyles.infoIcon} />
              </View>
            </View>

            {/* Field 4: EMAIL ADDRESS */}
            <View style={registerStyles.formGroup}>
              <Text style={registerStyles.fieldLabel}>EMAIL ADDRESS</Text>
              <View
                style={[
                  registerStyles.underlineInputRow,
                  focusedInput === 'email' && registerStyles.underlineInputRowFocused,
                ]}
              >
                <TextInput
                  ref={emailInputRef}
                  style={registerStyles.inputField}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  blurOnSubmit={false}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.textMuted}
                />
                <Ionicons name="mail-outline" size={20} color={colors.textDark} style={registerStyles.infoIcon} />
              </View>
            </View>

            {/* Field 5: CREATE PASSWORD */}
            <View style={registerStyles.formGroup}>
              <Text style={registerStyles.fieldLabel}>CREATE PASSWORD</Text>
              <View
                style={[
                  registerStyles.underlineInputRow,
                  focusedInput === 'password' && registerStyles.underlineInputRowFocused,
                ]}
              >
                <TextInput
                  ref={passwordInputRef}
                  style={registerStyles.inputField}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => {
                    setFocusedInput('password');
                    // Scroll to bottom when password field is focused
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  placeholder="Create password (min 6 chars)"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  style={registerStyles.infoIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textDark}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Action Yellow Button */}
            <TouchableOpacity
              style={[registerStyles.registerBtn, (!isFormValid || loading) && registerStyles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={colors.darkGreen} size="small" />
              ) : (
                <>
                  <Text style={[registerStyles.registerBtnText, !isFormValid && registerStyles.registerBtnTextDisabled]}>
                    REGISTER & CONTINUE
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={!isFormValid ? '#A0AEC0' : colors.darkGreen}
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login Link Row */}
            <View style={registerStyles.loginRow}>
              <Text style={registerStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleBack}>
                <Text style={registerStyles.loginLink}>LOGIN HERE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Existing Account Customer Support Notice Modal */}
      <AuthNoticeModal
        visible={showNoticeModal}
        type="MISSING_COLLECTION"
        email={email}
        onClose={() => setShowNoticeModal(false)}
        onCreateAccount={() => setShowNoticeModal(false)}
      />
    </SafeAreaView>
  );
}
