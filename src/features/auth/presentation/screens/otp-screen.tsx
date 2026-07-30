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
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { otpStyles } from './otp-screen.styles';
import { registerUserInFirebase, checkUserExistsInFirebase } from '@/features/auth/services/firebase-auth-service';
import { useSession } from '../session-provider';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';

export function OtpScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const params = useLocalSearchParams<{
    fullName?: string;
    cprNumber?: string;
    mobileNumber?: string;
    email?: string;
    password?: string;
  }>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('warning');

  const showTopBanner = (message: string, type: BannerType = 'warning') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/register');
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

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const cleanVal = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit.length === 1)) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    showTopBanner(`A new 6-digit PIN has been sent to your mobile number.`, 'info');
  };

  const isOtpComplete = otp.every((digit) => digit !== '');
  const rawMobile = params.mobileNumber || '';
  const displayContact = rawMobile.length >= 4 ? `**** ${rawMobile.slice(-4)}` : rawMobile || '**** 9090';

  const handleVerify = async () => {
    if (!isOtpComplete || loading) return;

    setLoading(true);
    try {
      if (params.fullName && params.cprNumber && params.mobileNumber && params.email) {
        const existingUser = await checkUserExistsInFirebase(
          params.cprNumber,
          params.mobileNumber,
          params.email
        );

        if (existingUser) {
          setLoading(false);
          showTopBanner('This account is already registered. Please login.', 'error');
          return;
        }

        const createdUser = await registerUserInFirebase({
          fullName: params.fullName,
          cprNumber: params.cprNumber,
          mobileNumber: params.mobileNumber,
          email: params.email,
          password: params.password,
        });

        await signIn(createdUser);
        setLoading(false);

        showTopBanner(`Registration successful! Welcome, ${createdUser.fullName}!`, 'success');
        setTimeout(() => {
          router.replace('/(main)/home');
        }, 600);
      } else {
        await signIn();
        setLoading(false);
        router.replace('/(main)/home');
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Firebase Auth Verification Error:', error);
      showTopBanner('Failed to complete authentication with Firebase. Please try again.', 'error');
    }
  };

  return (
    <SafeAreaView style={otpStyles.container}>
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
          contentContainerStyle={otpStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header Row */}
          <View style={otpStyles.topRow}>
            <TouchableOpacity style={otpStyles.backButton} onPress={handleBack} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={24} color={colors.textDark} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[otpStyles.resendPill, canResend && otpStyles.resendPillActive]}
              onPress={handleResend}
              disabled={!canResend}
              activeOpacity={0.8}
            >
              <Text style={[otpStyles.resendPillText, canResend && otpStyles.resendPillTextActive]}>
                {canResend ? 'RESEND OTP' : `RESEND IN ${timer}S`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Headline Section */}
          <View style={otpStyles.mainContent}>
            <View style={otpStyles.iconBadgeWrapper}>
              <View style={otpStyles.iconBadge}>
                <Ionicons name="phone-portrait-outline" size={30} color={colors.darkGreen} />
              </View>
            </View>

            <Text style={otpStyles.titleText}>Enter OTP Code</Text>
            <Text style={otpStyles.subtitleText}>
              We sent a 6-digit verification code to your registered mobile number
            </Text>

            {/* Contact Pill Card */}
            <View style={otpStyles.contactPillCard}>
              <Ionicons name="lock-closed" size={16} color={colors.darkGreen} />
              <Text style={otpStyles.contactPillText}>{displayContact}</Text>
            </View>

            {/* 6 OTP Input Boxes */}
            <View style={otpStyles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[otpStyles.otpBox, digit ? otpStyles.otpBoxFilled : null]}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>

          {/* Yellow Verify Action Button */}
          <TouchableOpacity
            style={[otpStyles.verifyBtn, (!isOtpComplete || loading) && otpStyles.verifyBtnDisabled]}
            onPress={handleVerify}
            disabled={!isOtpComplete || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.darkGreen} size="small" />
            ) : (
              <>
                <Text style={[otpStyles.verifyBtnText, !isOtpComplete && otpStyles.verifyBtnTextDisabled]}>
                  VERIFY & CONTINUE
                </Text>
                <Ionicons name="arrow-forward" size={18} color={!isOtpComplete ? '#A0AEC0' : colors.darkGreen} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
