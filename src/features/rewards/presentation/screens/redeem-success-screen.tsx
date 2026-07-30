import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { ShieldLogo } from '@/features/splash/presentation/components/shield-logo';

export function RedeemSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const txId = (params.txId as string) || `tx_redeem_${Date.now()}`;
  const pointsRedeemed = (params.points as string) || '500';
  const equivalentValue = (params.value as string) || 'BHD 5.000';
  const remainingPoints = (params.remainingPoints as string) || '11,950';



  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/home');
    }
  };

  // Enable Back Button & Swipe Back Navigation
  useEffect(() => {
    const onBackPress = () => {
      handleGoBack();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const handleDone = () => {
    handleGoBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      <View
        style={[
          styles.mainWrapper,
          {
            paddingTop: Math.max(insets.top + 16, 32),
            paddingBottom: Math.max(insets.bottom + 16, 24),
          },
        ]}
      >
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <ShieldLogo size={32} />
          <Text style={styles.brandText}>
            klysavo<Text style={{ color: colors.goldDark }}>.AI</Text>
          </Text>
        </View>

        {/* Center Celebration Content */}
        <View style={styles.centerContent}>
          <View style={styles.checkBadgeOuter}>
            <View style={styles.checkBadgeInner}>
              <Ionicons name="checkmark" size={44} color={colors.darkGreen} />
            </View>
          </View>

          <Text style={styles.successTitle}>Redemption Successful!</Text>
          <Text style={styles.successSubtitle}>
            You have successfully redeemed {pointsRedeemed} Reward Points for {equivalentValue} Cash Credit.
          </Text>

          {/* Receipt Details Box */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Ionicons name="receipt-outline" size={20} color={colors.darkGreen} />
              <Text style={styles.receiptHeaderTitle}>TRANSACTION RECEIPT</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValue}>{txId.slice(0, 18)}...</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Points Redeemed</Text>
              <Text style={[styles.receiptValue, { color: '#E53E3E', fontFamily: fontFamilies.bold }]}>
                -{pointsRedeemed} PTS
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Credit Value</Text>
              <Text style={[styles.receiptValue, { color: colors.darkGreen, fontFamily: fontFamilies.bold }]}>
                {equivalentValue}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>New Points Balance</Text>
              <Text style={styles.receiptValue}>{Number(remainingPoints).toLocaleString()} PTS</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>COMPLETED</Text>
              </View>
            </View>
          </View>
        </View>

        {/* DONE Button - Navigates back to Home without PIN prompt */}
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>DONE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  checkBadgeOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(18, 60, 48, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(18, 60, 48, 0.15)',
  },
  checkBadgeInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 28,
    lineHeight: 20,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  receiptHeaderTitle: {
    fontSize: 12,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
  },
  receiptValue: {
    fontSize: 13.5,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
  },
  statusPill: {
    backgroundColor: 'rgba(18, 60, 48, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
  },
  doneBtn: {
    width: '100%',
    height: 56,
    backgroundColor: colors.darkGreen,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.gold,
    letterSpacing: 1,
  },
});
