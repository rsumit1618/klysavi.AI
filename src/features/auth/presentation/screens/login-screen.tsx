import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { loginStyles } from './login-screen.styles';
import { ShieldLogo } from '@/features/splash/presentation/components/shield-logo';
import { AuthNoticeModal } from '../components/auth-notice-modal';
import { TopBannerNotification } from '@/shared/components/top-banner-notification';
import { AppActionButton } from '@/shared/components/ui/app-action-button';
import { UnderlineInputField } from '@/shared/components/underline-input-field';

import { useAuthViewModel } from '../viewmodels/use-auth-view-model';

export function LoginScreen() {
  const {
    email,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    activeTab,
    setActiveTab,
    loading,
    isEmailVerified,
    isFormValid,
    modalNoticeType,
    setModalNoticeType,
    bannerVisible,
    bannerMessage,
    bannerType,
    setBannerVisible,
    passwordInputRef,
    handleEmailChange,
    handleEmailContinue,
    handleLogin,
    navigateToRegister,
  } = useAuthViewModel();

  return (
    <SafeAreaView style={loginStyles.container}>
      {/* Auto-Closing Top Banner Notification */}
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
          contentContainerStyle={loginStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header */}
          <View style={loginStyles.headerRow}>
            <View style={loginStyles.logoRow}>
              <ShieldLogo size={36} />
              <Text style={loginStyles.brandText}>
                klysavo<Text style={loginStyles.aiDot}>.AI</Text>
              </Text>
            </View>
          </View>

          {/* Main Form Section */}
          <View style={loginStyles.mainFormSection}>
            {/* Welcome Text */}
            <View style={loginStyles.welcomeSection}>
              <Text style={loginStyles.greetingText}>Hello and</Text>
              <Text style={loginStyles.titleText}>Welcome to Klysavo</Text>
            </View>

            {/* Minimal Underline Tabs */}
            <View style={loginStyles.tabRow}>
              <TouchableOpacity
                onPress={() => setActiveTab('PERSONAL')}
                style={loginStyles.tabButton}
                activeOpacity={0.85}
              >
                <Text style={[loginStyles.tabText, activeTab === 'PERSONAL' && loginStyles.tabTextActive]}>
                  PERSONAL
                </Text>
                {activeTab === 'PERSONAL' && <View style={loginStyles.tabActiveIndicator} />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('BUSINESS')}
                style={loginStyles.tabButton}
                activeOpacity={0.85}
              >
                <Text style={[loginStyles.tabText, activeTab === 'BUSINESS' && loginStyles.tabTextActive]}>
                  BUSINESS
                </Text>
                {activeTab === 'BUSINESS' && <View style={loginStyles.tabActiveIndicator} />}
              </TouchableOpacity>
            </View>

            {/* Field 1: EMAIL ADDRESS */}
            <UnderlineInputField
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType={isEmailVerified ? 'next' : 'done'}
              onSubmitEditing={isEmailVerified ? () => passwordInputRef.current?.focus() : handleEmailContinue}
              placeholder="Enter email address"
              rightIconName="mail-outline"
            />

            {/* Field 2: PASSWORD */}
            {isEmailVerified && (
              <UnderlineInputField
                inputRef={passwordInputRef}
                label="PASSWORD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                placeholder="Enter password (min 6 chars)"
                rightIconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                autoFocus
              />
            )}

            {/* Action Yellow Login Button */}
            <AppActionButton
              title={isEmailVerified ? 'LOGIN' : 'CONTINUE'}
              loading={loading}
              disabled={!isFormValid || loading}
              iconName="arrow-forward"
              onPress={isEmailVerified ? handleLogin : handleEmailContinue}
              style={{ marginTop: 8, marginBottom: 24 }}
            />

            {/* Register Prompt */}
            <View style={loginStyles.registerRow}>
              <Text style={loginStyles.registerText}>New to Klysavo? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={loginStyles.registerLink}>REGISTER NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Special Offer Card */}
            <View style={loginStyles.promoCard}>
              <Image
                source={require('../../../../../assets/images/credit_cards_banner.jpg')}
                style={loginStyles.promoImageThumbnail}
                resizeMode="cover"
              />
              <View style={loginStyles.promoTextContainer}>
                <Text style={loginStyles.promoTitle}>
                  Get special offers with Klysavo AI Smart Credit Card across the world
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Account Notice Customer Support Modal */}
      <AuthNoticeModal
        visible={modalNoticeType !== null}
        type={modalNoticeType}
        email={email}
        onClose={() => setModalNoticeType(null)}
        onCreateAccount={navigateToRegister}
      />
    </SafeAreaView>
  );
}
