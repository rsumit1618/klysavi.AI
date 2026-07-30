import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { db } from '@/core/services/firebase';
import { doc, setDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import {
  getUserDataFromSecureStore,
  saveUserDataToSecureStore,
  ExtendedUserProfile,
  RewardTransaction,
} from '@/core/services/secure-storage-service';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';
import { AppHeader } from '@/shared/components/app-header';
import { useSession } from '@/features/auth/presentation/session-provider';

const FIXED_REDEEM_POINTS = 500;
const EQUIVALENT_VALUE_BHD = 'BHD 5.000';

export function RedeemRewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useSession();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Top Banner state
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('success');

  const showTopBanner = (msg: string, type: BannerType = 'success') => {
    setBannerMessage(msg);
    setBannerType(type);
    setBannerVisible(true);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/home');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleGoBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;

    async function loadData() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
      }

      const targetUid = stored?.uid || session?.uid;
      if (targetUid) {
        const userDocRef = doc(db, 'klysavo_users', targetUid);
        unsubscribe = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as ExtendedUserProfile;
            setUserProfile((prev) => ({ ...prev, ...data, uid: targetUid }));
          }
        });
      }
    }

    loadData();
    return () => unsubscribe?.();
  }, [session]);

  const currentPoints = userProfile?.rewards?.totalPoints ?? 0;
  const canRedeem = currentPoints >= FIXED_REDEEM_POINTS;
  const transactionsList: RewardTransaction[] = userProfile?.rewards?.transactions || [];

  const handleRedeem500Points = async () => {
    if (!canRedeem) {
      showTopBanner(`Minimum ${FIXED_REDEEM_POINTS} points required to redeem.`, 'error');
      return;
    }

    setLoading(true);
    const targetUid = userProfile?.uid || session?.uid || 'usr_registered_user';
    const newTotalPoints = Math.max(0, currentPoints - FIXED_REDEEM_POINTS);

    const txId = `tx_redeem_${Date.now()}`;
    const newTx: RewardTransaction = {
      id: txId,
      type: 'REDEEM_REWARDS',
      points: FIXED_REDEEM_POINTS,
      equivalentValue: EQUIVALENT_VALUE_BHD,
      title: `Redeemed ${FIXED_REDEEM_POINTS} Points for ${EQUIVALENT_VALUE_BHD} Cash Credit`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    const updatedTransactions = [newTx, ...transactionsList];

    const updatedRewards = {
      totalPoints: newTotalPoints,
      expiringPoints: userProfile?.rewards?.expiringPoints ?? 0,
      expiryDate: userProfile?.rewards?.expiryDate ?? '31 Dec 2026',
      transactions: updatedTransactions,
    };

    const updatedProfile: ExtendedUserProfile = {
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      status: userProfile?.status || 'active',
      ...(userProfile || {}),
      uid: targetUid,
      fullName: userProfile?.fullName || 'Valued User',
      email: userProfile?.email || '',
      mobileNumber: userProfile?.mobileNumber || '',
      cprNumber: userProfile?.cprNumber || '',
      rewards: updatedRewards,
    };

    try {
      // 1. Save to Firestore User Document (`klysavo_users` collection)
      const userDocRef = doc(db, 'klysavo_users', targetUid);
      await setDoc(userDocRef, { rewards: updatedRewards }, { merge: true });

      // 2. Add individual transaction record in `klysavo_users/{uid}/transactions` sub-collection
      const txSubCollRef = collection(db, 'klysavo_users', targetUid, 'transactions');
      await addDoc(txSubCollRef, newTx);

      // 3. Save to local SecureStore
      await saveUserDataToSecureStore(updatedProfile);

      setLoading(false);

      // 4. Navigate directly to Redeem Success Screen (Push onto stack so back transition works)
      router.push({
        pathname: '/redeem-success',
        params: {
          txId: newTx.id,
          points: String(FIXED_REDEEM_POINTS),
          value: EQUIVALENT_VALUE_BHD,
          remainingPoints: String(newTotalPoints),
          createdAt: newTx.createdAt,
        },
      });
    } catch (error) {
      console.warn('Firestore redeem note:', error);
      await saveUserDataToSecureStore(updatedProfile);
      setLoading(false);

      router.push({
        pathname: '/redeem-success',
        params: {
          txId: newTx.id,
          points: String(FIXED_REDEEM_POINTS),
          value: EQUIVALENT_VALUE_BHD,
          remainingPoints: String(newTotalPoints),
          createdAt: newTx.createdAt,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      {/* Standardized App Header */}
      <AppHeader title="Redeem Rewards" showBack onBackPress={handleGoBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Available Points Card */}
        <View style={styles.pointsBalanceCard}>
          <View style={styles.starBadge}>
            <Ionicons name="star" size={32} color="#D4AF37" />
          </View>
          <Text style={styles.balanceLabel}>AVAILABLE REWARD BALANCE</Text>
          <Text style={styles.balanceNumber}>
            {currentPoints.toLocaleString()} <Text style={styles.ptsUnit}>PTS</Text>
          </Text>
          <Text style={styles.conversionSubtext}>500 Reward Points = BHD 5.000 Cash Credit</Text>
        </View>

        {/* 500 Points Limit Offer Card */}
        <View style={styles.offerCard}>
          <View style={styles.offerIconCol}>
            <View style={styles.offerBadge}>
              <Ionicons name="gift-outline" size={26} color={colors.darkGreen} />
            </View>
          </View>
          <View style={styles.offerDetailsCol}>
            <View style={styles.fixedLimitTag}>
              <Text style={styles.fixedLimitTagText}>FIXED LIMIT: 500 PTS / REDEMPTION</Text>
            </View>
            <Text style={styles.offerTitle}>Redeem 500 Points</Text>
            <Text style={styles.offerDesc}>Get BHD 5.000 Instant Cash Credit added directly to your account balance.</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.redeemBtn, !canRedeem && styles.redeemBtnDisabled]}
          onPress={handleRedeem500Points}
          disabled={!canRedeem || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="flash" size={20} color={colors.gold} />
              <Text style={styles.redeemBtnText}>REDEEM 500 POINTS NOW ({EQUIVALENT_VALUE_BHD})</Text>
            </>
          )}
        </TouchableOpacity>

        {!canRedeem && (
          <Text style={styles.insufficientText}>
            ⚠️ You need at least 500 points to redeem. Current balance is {currentPoints} PTS.
          </Text>
        )}

        {/* Transactions History */}
        <Text style={styles.sectionTitle}>REDEEMED TRANSACTIONS HISTORY</Text>
        {transactionsList.length === 0 ? (
          <View style={styles.emptyTxBox}>
            <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyTxText}>No reward redemptions performed yet.</Text>
          </View>
        ) : (
          transactionsList.map((tx) => (
            <View key={tx.id} style={styles.txRowCard}>
              <View style={styles.txIconBadge}>
                <Ionicons name="checkmark-circle" size={24} color={colors.darkGreen} />
              </View>
              <View style={styles.txInfoCol}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>
                  {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.txAmountCol}>
                <Text style={styles.txPointsText}>-{tx.points} PTS</Text>
                <Text style={styles.txValueText}>{tx.equivalentValue}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  pointsBalanceCard: {
    backgroundColor: '#1E3C36',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  starBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  balanceNumber: {
    fontSize: 34,
    fontFamily: fontFamilies.extraBold,
    color: colors.white,
    marginBottom: 4,
  },
  ptsUnit: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.gold,
  },
  conversionSubtext: {
    fontSize: 12,
    fontFamily: fontFamilies.medium,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 14,
    alignItems: 'center',
  },
  offerIconCol: {
    justifyContent: 'center',
  },
  offerBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(18, 60, 48, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerDetailsCol: {
    flex: 1,
  },
  fixedLimitTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  fixedLimitTagText: {
    fontSize: 9.5,
    fontFamily: fontFamilies.bold,
    color: colors.goldDark,
    letterSpacing: 0.8,
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
    marginBottom: 2,
  },
  offerDesc: {
    fontSize: 12.5,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    lineHeight: 17,
  },
  redeemBtn: {
    height: 56,
    backgroundColor: colors.darkGreen,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  redeemBtnDisabled: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0,
    elevation: 0,
  },
  redeemBtnText: {
    fontSize: 14.5,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  insufficientText: {
    fontSize: 12.5,
    fontFamily: fontFamilies.semiBold,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 12,
  },
  emptyTxBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTxText: {
    fontSize: 13,
    fontFamily: fontFamilies.medium,
    color: colors.textMuted,
  },
  txRowCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(18, 60, 48, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfoCol: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  txDate: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txPointsText: {
    fontSize: 13.5,
    fontFamily: fontFamilies.bold,
    color: '#E53E3E',
  },
  txValueText: {
    fontSize: 11.5,
    fontFamily: fontFamilies.semiBold,
    color: colors.darkGreen,
    marginTop: 2,
  },
});
