import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { homeStyles } from './home-screen.styles';
import { useLocalization } from '@/core/localization/localization-provider';
import { useSession } from '@/features/auth/presentation/session-provider';
import { SideMenuDrawer } from '@/shared/components/side-menu-drawer';
import { db } from '@/core/services/firebase';
import { collection, doc, onSnapshot, getDoc, setDoc, getDocs } from 'firebase/firestore';
import {
  saveUserDataToSecureStore,
  getUserDataFromSecureStore,
  cleanAndDeduplicateApplications,
  isProductApplied,
  getNormalizedProductKey,
  getInitials,
  ExtendedUserProfile,
  CardApplicationDraft,
} from '@/core/services/secure-storage-service';
import { ProductJsonItem, PRODUCTS_CATALOG } from '@/core/services/products-seed-service';
import { getLocalProductImage, getCardStatusImage } from '@/core/constants/product-image-map';
import { useHomeViewModel } from '../viewmodels/use-home-view-model';

export function HomeScreen() {
  const router = useRouter();
  const { session } = useSession();
  const { t } = useLocalization();
  const vm = useHomeViewModel();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Firestore Loaded Product Catalog Items (No dummy fallbacks)
  const [creditCards, setCreditCards] = useState<ProductJsonItem[]>([]);
  const [loanCards, setLoanCards] = useState<ProductJsonItem[]>([]);
  const [insuranceCards, setInsuranceCards] = useState<ProductJsonItem[]>([]);

  const lastBackPressTime = useRef<number>(0);
  const mainScrollViewRef = useRef<ScrollView>(null);

  // Re-read fresh local storage cache & reset scroll position to top on focus
  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: false });
      async function refreshOnFocus() {
        const stored = await getUserDataFromSecureStore();
        if (stored) {
          setUserProfile(stored);
        }
      }
      refreshOnFocus();
    }, [])
  );

  // 1. Fetch live user profile and read Products from Firestore upon landing on Home Screen
  useEffect(() => {
    let unsubscribeProfile: () => void;
    let unsubscribeSubApps: () => void;
    let unsubscribeCredit: () => void;
    let unsubscribeLoans: () => void;
    let unsubscribeInsurance: () => void;

    let fetchedCredits: ProductJsonItem[] = creditCards;
    let fetchedLoans: ProductJsonItem[] = loanCards;
    let fetchedInsurances: ProductJsonItem[] = insuranceCards;

    async function initializeData() {
      // Step A: Load local SecureStore cached profile immediately
      const storedData = await getUserDataFromSecureStore();
      if (storedData) {
        setUserProfile(storedData);
      }

      // =========================================================================
      // API CALL #1: User Profile & Applications API Call (Pending, Upcoming, Approved)
      // =========================================================================
      const targetUid = storedData?.uid || session?.uid;

      if (targetUid && targetUid.trim() !== '' && targetUid !== 'usr_registered_user') {
        try {
          const userDocRef = doc(db, 'klysavo_users', targetUid);
          const appsSubCollRef = collection(db, 'klysavo_users', targetUid, 'applications');

          // A. Listen to parent User Profile doc
          unsubscribeProfile = onSnapshot(
            userDocRef,
            async (docSnap) => {
              if (docSnap.exists()) {
                const remoteUser = docSnap.data() as ExtendedUserProfile;
                const latestLocal = await getUserDataFromSecureStore();
                const mergedApps = cleanAndDeduplicateApplications([
                  ...(latestLocal?.pendingApplications || []),
                  ...(remoteUser.pendingApplications || []),
                ]);
                const updatedProfile = {
                  ...latestLocal,
                  ...remoteUser,
                  pendingApplications: mergedApps,
                  uid: targetUid,
                };
                setUserProfile(updatedProfile);
                await saveUserDataToSecureStore(updatedProfile);
              }
            },
            (error) => {
              if (error.code !== 'permission-denied') {
                console.warn('Firestore profile sync error:', error);
              }
            }
          );

          // B. Listen to sub-collection 'applications' directly
          unsubscribeSubApps = onSnapshot(
            appsSubCollRef,
            async (subSnap) => {
              if (!subSnap.empty) {
                const remoteSubApps = subSnap.docs.map((d) => d.data() as CardApplicationDraft);
                const latestLocal = await getUserDataFromSecureStore();
                const currentApps = latestLocal?.pendingApplications || [];
                const cleanedList = cleanAndDeduplicateApplications([
                  ...currentApps,
                  ...remoteSubApps,
                ]);
                const updated = { ...(latestLocal || {}), pendingApplications: cleanedList } as ExtendedUserProfile;
                setUserProfile(updated);
                await saveUserDataToSecureStore(updated);
              }
            },
            (error) => {
              if (error.code !== 'permission-denied') {
                console.warn('Firestore apps sync error:', error);
              }
            }
          );
        } catch (pErr) {}
      }

      // =========================================================================
      // API CALL #2: Product Catalog & Credit Cards API Call
      // =========================================================================
      try {
        const creditDocRef = doc(db, 'products', 'credit_cards');
        const creditSubColl = collection(db, 'products', 'credit_cards', 'items');

        unsubscribeCredit = onSnapshot(
          creditSubColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              fetchedCredits = snapshot.docs.map((d) => d.data() as ProductJsonItem);
            } else {
              try {
                const docSnap = await getDoc(creditDocRef);
                if (docSnap.exists() && docSnap.data().items) {
                  fetchedCredits = docSnap.data().items as ProductJsonItem[];
                }
              } catch (e) {}
            }
            setCreditCards([...fetchedCredits]);

          },
          (error) => {
            setCreditCards(PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_credit_cards'));
          }
        );
      } catch (err) {
        setCreditCards(PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_credit_cards'));
      }

      // Step D: Read Loan Cards from products/loan_cards with Silent Permission Handling
      try {
        const loanDocRef = doc(db, 'products', 'loan_cards');
        const loanSubColl = collection(db, 'products', 'loan_cards', 'items');

        unsubscribeLoans = onSnapshot(
          loanSubColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              fetchedLoans = snapshot.docs.map(d => d.data() as ProductJsonItem);
            } else {
              try {
                const docSnap = await getDoc(loanDocRef);
                if (docSnap.exists() && docSnap.data().items) {
                  fetchedLoans = docSnap.data().items as ProductJsonItem[];
                }
              } catch (e) {}
            }
            setLoanCards([...fetchedLoans]);

          },
          (error) => {
            // Silently fallback to local seed data
            setLoanCards(PRODUCTS_CATALOG.filter(p => p.productId === 'prd_loan_cards'));
          }
        );
      } catch (err) {
        setLoanCards(PRODUCTS_CATALOG.filter(p => p.productId === 'prd_loan_cards'));
      }

      // Step E: Read Insurance Cards from products/insurance_cards with Silent Permission Handling
      try {
        const insDocRef = doc(db, 'products', 'insurance_cards');
        const insSubColl = collection(db, 'products', 'insurance_cards', 'items');

        unsubscribeInsurance = onSnapshot(
          insSubColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              fetchedInsurances = snapshot.docs.map(d => d.data() as ProductJsonItem);
            } else {
              try {
                const docSnap = await getDoc(insDocRef);
                if (docSnap.exists() && docSnap.data().items) {
                  fetchedInsurances = docSnap.data().items as ProductJsonItem[];
                }
              } catch (e) {}
            }
            setInsuranceCards([...fetchedInsurances]);

          },
          (error) => {
            // Silently fallback to local seed data
            setInsuranceCards(PRODUCTS_CATALOG.filter(p => p.productId === 'prd_insurance_cards'));
          }
        );
      } catch (err) {
        setInsuranceCards(PRODUCTS_CATALOG.filter(p => p.productId === 'prd_insurance_cards'));
      }
    }

    initializeData();
    return () => {
      unsubscribeProfile?.();
      unsubscribeSubApps?.();
      unsubscribeCredit?.();
      unsubscribeLoans?.();
      unsubscribeInsurance?.();
    };
  }, [session]);

  // Pull-To-Refresh API Handler with Silent Permission Error Handling
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 [PULL-TO-REFRESH] Fetching latest User Profile & Catalog APIs...');

    try {
      // 1. Fetch User Profile with silent permission fallback
      const storedData = await getUserDataFromSecureStore();
      const targetUid = storedData?.uid || session?.uid;
      if (targetUid) {
        try {
          const userDocRef = doc(db, 'klysavo_users', targetUid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const remoteUser = docSnap.data() as ExtendedUserProfile;
            const mergedApps = cleanAndDeduplicateApplications([
              ...(storedData?.pendingApplications || []),
              ...(remoteUser.pendingApplications || []),
            ]);
            const updatedProfile = { ...storedData, ...remoteUser, pendingApplications: mergedApps, uid: targetUid };
            setUserProfile(updatedProfile);
            await saveUserDataToSecureStore(updatedProfile);
          }
        } catch (uErr) {
          // Silently handle permission error by keeping local cached profile
        }
      }

      // 2. Refresh Credit Cards API with silent fallback
      try {
        const creditSubColl = collection(db, 'products', 'credit_cards', 'items');
        const creditSnap = await getDocs(creditSubColl);
        if (!creditSnap.empty) {
          setCreditCards(creditSnap.docs.map((d) => d.data() as ProductJsonItem));
        }
      } catch (e) {
        setCreditCards(PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_credit_cards'));
      }

      // 3. Refresh Loan Cards API with silent fallback
      try {
        const loanSubColl = collection(db, 'products', 'loan_cards', 'items');
        const loanSnap = await getDocs(loanSubColl);
        if (!loanSnap.empty) {
          setLoanCards(loanSnap.docs.map((d) => d.data() as ProductJsonItem));
        }
      } catch (e) {
        setLoanCards(PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_loan_cards'));
      }

      // 4. Refresh Insurance Cards API with silent fallback
      try {
        const insSubColl = collection(db, 'products', 'insurance_cards', 'items');
        const insSnap = await getDocs(insSubColl);
        if (!insSnap.empty) {
          setInsuranceCards(insSnap.docs.map((d) => d.data() as ProductJsonItem));
        }
      } catch (e) {
        setInsuranceCards(PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_insurance_cards'));
      }

      console.log('✅ [PULL-TO-REFRESH] Complete!');
    } catch (err) {
      // Silently finish refresh
    } finally {
      setRefreshing(false);
    }
  }, [session]);



  // Double-tap back handler on Home screen
  useEffect(() => {
    const onBackPress = () => {
      const now = Date.now();
      if (lastBackPressTime.current && now - lastBackPressTime.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPressTime.current = now;
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const displayName = userProfile?.fullName || session?.displayName || 'Valued User';
  const profileImage = userProfile?.profileImage || session?.profileImage || null;

  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [profileImage]);

  // Rewards Data Formatting
  const totalPoints = userProfile?.rewards?.totalPoints ?? 0;
  const expiringPoints = userProfile?.rewards?.expiringPoints ?? 0;
  const expiryDate = userProfile?.rewards?.expiryDate ?? '';
  const formattedTotalPoints = totalPoints.toLocaleString();
  const formattedExpiringPoints = expiringPoints.toLocaleString();

  const allApplications = cleanAndDeduplicateApplications(userProfile?.pendingApplications || []);

  // Set of all canonical product keys of approved applications
  const approvedProductKeys = new Set(
    allApplications
      .filter((a) => a.status === 'APPROVED')
      .map((a) => getNormalizedProductKey(a))
  );

  // SECTION 0A: MY ACTIVE APPROVED CREDIT CARDS
  const approvedCards = allApplications.filter(
    (a) =>
      a.status === 'APPROVED' &&
      !a.category?.toLowerCase().includes('loan') &&
      !a.productTitle?.toLowerCase().includes('loan') &&
      !a.productId?.toLowerCase().includes('loan') &&
      !a.category?.toLowerCase().includes('insurance') &&
      !a.productTitle?.toLowerCase().includes('insurance') &&
      !a.productId?.toLowerCase().includes('insurance')
  );

  // SECTION 0B: MY ACTIVE APPROVED LOANS
  const approvedLoans = allApplications.filter(
    (a) =>
      a.status === 'APPROVED' &&
      (a.category?.toLowerCase().includes('loan') ||
        a.productTitle?.toLowerCase().includes('loan') ||
        a.productId?.toLowerCase().includes('loan'))
  );

  // SECTION 0C: MY ACTIVE APPROVED INSURANCE
  const approvedInsurance = allApplications.filter(
    (a) =>
      a.status === 'APPROVED' &&
      (a.category?.toLowerCase().includes('insurance') ||
        a.productTitle?.toLowerCase().includes('insurance') ||
        a.productId?.toLowerCase().includes('insurance'))
  );

  // SECTION 1: ONGOING APPLICATION (Incomplete / Pending Applications)
  const ongoingApps = allApplications.filter((a) => {
    if (a.status !== 'PENDING' && a.status !== 'DRAFT') return false;
    const key = getNormalizedProductKey(a);
    return !approvedProductKeys.has(key);
  });

  // SECTION 2: UPCOMING CARDS (Completed Applications Awaiting Backend Approval)
  const upcomingApps = allApplications.filter((a) => {
    if (a.status !== 'SUBMITTED') return false;
    const key = getNormalizedProductKey(a);
    return !approvedProductKeys.has(key);
  });

  // Filter available catalog cards: exclude ANY card that the user already has in progress, submitted, or approved
  const availableCreditCards = creditCards.filter(
    (card) => !isProductApplied(card, allApplications)
  );

  const availableLoanCards = loanCards.filter(
    (card) => !isProductApplied(card, allApplications)
  );

  const availableInsuranceCards = insuranceCards.filter(
    (card) => !isProductApplied(card, allApplications)
  );

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView
        ref={mainScrollViewRef}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.darkGreen, colors.gold]}
            tintColor={colors.darkGreen}
            progressBackgroundColor={colors.white}
          />
        }
      >
        {/* Top Header Row */}
        <View style={homeStyles.headerRow}>
          <View style={homeStyles.headerLeft}>
            {/* Hamburger Icon -> Opens Side Menu Drawer */}
            <TouchableOpacity style={homeStyles.menuBtn} onPress={() => setDrawerOpen(true)}>
              <Ionicons name="menu-outline" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <View style={homeStyles.greetingCol}>
              <Text style={homeStyles.greetingSub}>Hello and welcome,</Text>
              <Text style={homeStyles.greetingName}>{displayName}</Text>
            </View>
          </View>

          {/* Profile Avatar Icon -> Pushes User Profile Stack Screen with slide_from_right animation */}
          <TouchableOpacity
            style={[
              homeStyles.profileAvatarBtn,
              profileImage && !imageLoadError
                ? { backgroundColor: 'transparent' }
                : { backgroundColor: colors.darkGreen },
            ]}
            onPress={() => router.push('/user-profile')}
          >
            {profileImage && !imageLoadError ? (
              <Image
                source={{ uri: profileImage }}
                onError={() => setImageLoadError(true)}
                style={{ width: 42, height: 42 }}
                resizeMode="cover"
              />
            ) : (
              <>
                {displayName && displayName !== 'Valued User' ? (
                  <Text style={{
                    color: colors.gold,
                    fontFamily: 'Manrope_700Bold',
                    fontSize: 14,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    includeFontPadding: false,
                  }}>
                    {getInitials(displayName)}
                  </Text>
                ) : (
                  <Ionicons name="person" size={20} color={colors.gold} />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Loyalty Points Reward Card -> Navigates to dedicated Redeem Rewards Screen */}
        <TouchableOpacity
          style={homeStyles.rewardCard}
          onPress={() => router.push('/redeem-rewards')}
          activeOpacity={0.9}
        >
          <View style={homeStyles.rewardIconBadge}>
            <Ionicons name="star" size={28} color="#D4AF37" />
          </View>
          <View style={homeStyles.rewardContent}>
            <View style={homeStyles.rewardPointsRow}>
              <Text style={homeStyles.rewardPointsNumber}>{formattedTotalPoints}</Text>
              <Text style={homeStyles.rewardPointsLabel}>Reward Points</Text>
            </View>
            <Text style={homeStyles.rewardExpiringText}>
              {expiringPoints > 0
                ? `${formattedExpiringPoints} points expiring on ${expiryDate}`
                : 'No points expiring soon'}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
            <Text style={{ color: colors.gold, fontSize: 10, fontFamily: 'Manrope_700Bold', marginTop: 2 }}>REDEEM</Text>
          </View>
        </TouchableOpacity>

        {/* Financial Calculator Dedicated Card */}
        <TouchableOpacity
          style={homeStyles.calculatorCard}
          onPress={() => router.push('/financial-calculator')}
          activeOpacity={0.85}
        >
          <View style={homeStyles.calcLeftRow}>
            <View style={homeStyles.calcIconBadge}>
              <Ionicons name="calculator-outline" size={24} color={colors.darkGreen} />
            </View>
            <Text style={homeStyles.calcTitle}>Financial Calculator</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* SECTION 0A: MY ACTIVE CREDIT CARDS */}
        {approvedCards.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>MY ACTIVE CREDIT CARDS</Text>
            {approvedCards.map((item) => (
              <View
                key={item.applicationId}
                style={[homeStyles.ongoingCard, { backgroundColor: '#1E3C36' }]}
              >
                <Image
                  source={getCardStatusImage('APPROVED', item.imageId, item.productId)}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
                  resizeMode="cover"
                />
                <View style={homeStyles.ongoingTopRow}>
                  <View style={[homeStyles.inProcessBadge, { backgroundColor: '#2F855A' }]}>
                    <Text style={homeStyles.inProcessText}>Approved & Active</Text>
                  </View>
                  <View style={homeStyles.categoryWhitePill}>
                    <Text style={homeStyles.categoryWhitePillText}>
                      {item.category || 'Credit Card'}
                    </Text>
                  </View>
                </View>

                <Text style={homeStyles.ongoingTitle}>{item.productTitle}</Text>

                <View style={homeStyles.ongoingBottomRow}>
                  <Text style={homeStyles.ongoingRefId}>
                    Card No <Text style={homeStyles.ongoingRefIdBold}>•••• {item.applicationId.slice(-4)}</Text>
                  </Text>
                  <Text style={homeStyles.ongoingLastEdit}>
                    Limit <Text style={homeStyles.ongoingRefIdBold}>BHD 2,500.00</Text>
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* SECTION 0B: MY ACTIVE LOANS */}
        {approvedLoans.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>MY ACTIVE LOAN ACCOUNTS</Text>
            {approvedLoans.map((item) => (
              <View
                key={item.applicationId}
                style={[homeStyles.ongoingCard, { backgroundColor: '#1C2D42' }]}
              >
                <Image
                  source={getCardStatusImage('APPROVED', item.imageId, item.productId)}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
                  resizeMode="cover"
                />
                <View style={homeStyles.ongoingTopRow}>
                  <View style={[homeStyles.inProcessBadge, { backgroundColor: '#2F855A' }]}>
                    <Text style={homeStyles.inProcessText}>Active Loan</Text>
                  </View>
                  <View style={homeStyles.categoryWhitePill}>
                    <Text style={homeStyles.categoryWhitePillText}>
                      {item.category || 'Personal Loan'}
                    </Text>
                  </View>
                </View>

                <Text style={homeStyles.ongoingTitle}>{item.productTitle}</Text>

                <View style={homeStyles.ongoingBottomRow}>
                  <Text style={homeStyles.ongoingRefId}>
                    Loan No <Text style={homeStyles.ongoingRefIdBold}>LN-•••• {item.applicationId.slice(-4)}</Text>
                  </Text>
                  <Text style={homeStyles.ongoingLastEdit}>
                    Sanctioned <Text style={homeStyles.ongoingRefIdBold}>BHD 15,000.00</Text>
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* SECTION 0C: MY ACTIVE INSURANCE */}
        {approvedInsurance.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>MY ACTIVE INSURANCE POLICIES</Text>
            {approvedInsurance.map((item) => (
              <View
                key={item.applicationId}
                style={[homeStyles.ongoingCard, { backgroundColor: '#3D251E' }]}
              >
                <Image
                  source={getCardStatusImage('APPROVED', item.imageId, item.productId)}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
                  resizeMode="cover"
                />
                <View style={homeStyles.ongoingTopRow}>
                  <View style={[homeStyles.inProcessBadge, { backgroundColor: '#2F855A' }]}>
                    <Text style={homeStyles.inProcessText}>Active Policy</Text>
                  </View>
                  <View style={homeStyles.categoryWhitePill}>
                    <Text style={homeStyles.categoryWhitePillText}>
                      {item.category || 'Health Insurance'}
                    </Text>
                  </View>
                </View>

                <Text style={homeStyles.ongoingTitle}>{item.productTitle}</Text>

                <View style={homeStyles.ongoingBottomRow}>
                  <Text style={homeStyles.ongoingRefId}>
                    Policy No <Text style={homeStyles.ongoingRefIdBold}>POL-•••• {item.applicationId.slice(-4)}</Text>
                  </Text>
                  <Text style={homeStyles.ongoingLastEdit}>
                    Coverage <Text style={homeStyles.ongoingRefIdBold}>BHD 50,000.00</Text>
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
        {ongoingApps.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>ONGOING APPLICATION</Text>
            {ongoingApps.map((item) => (
              <TouchableOpacity
                key={item.applicationId}
                style={homeStyles.ongoingCard}
                onPress={() =>
                  router.push({
                    pathname: '/apply-card',
                    params: {
                      productId: item.productId,
                      resumeStep: String(item.currentStep || 1),
                      applicationId: item.applicationId,
                    },
                  })
                }
                activeOpacity={0.9}
              >
                <Image
                  source={getCardStatusImage('PENDING', item.imageId, item.productId)}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
                  resizeMode="cover"
                />
                <View style={homeStyles.ongoingTopRow}>
                  <View style={homeStyles.inProcessBadge}>
                    <Text style={homeStyles.inProcessText}>In Progress</Text>
                  </View>
                  <View style={homeStyles.categoryWhitePill}>
                    <Text style={homeStyles.categoryWhitePillText}>
                      {item.category || 'Credit Card'}
                    </Text>
                  </View>
                </View>

                <Text style={homeStyles.ongoingTitle}>{item.productTitle}</Text>

                <View style={homeStyles.ongoingBottomRow}>
                  <Text style={homeStyles.ongoingRefId}>
                    Ref ID <Text style={homeStyles.ongoingRefIdBold}>{item.applicationId.slice(-10)}</Text>
                  </Text>
                  <Text style={homeStyles.ongoingLastEdit}>
                    last edit{' '}
                    {new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* SECTION 2: UPCOMING APPLICATION (Same UI as Ongoing Card with Awaiting status) */}
        {upcomingApps.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>UPCOMING APPLICATION</Text>
            {upcomingApps.map((item) => (
              <View
                key={item.applicationId}
                style={[homeStyles.ongoingCard, { backgroundColor: '#3D5A73' }]}
              >
                <Image
                  source={getCardStatusImage('PENDING', item.imageId, item.productId)}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.35 }]}
                  resizeMode="cover"
                />
                <View style={homeStyles.ongoingTopRow}>
                  <View style={homeStyles.awaitingBadge}>
                    <Text style={homeStyles.awaitingText}>Awaiting</Text>
                  </View>
                  <View style={homeStyles.categoryWhitePill}>
                    <Text style={homeStyles.categoryWhitePillText}>
                      {item.category || 'Credit Card'}
                    </Text>
                  </View>
                </View>

                <Text style={homeStyles.ongoingTitle}>{item.productTitle}</Text>

                <View style={homeStyles.ongoingBottomRow}>
                  <Text style={homeStyles.ongoingRefId}>
                    Ref ID <Text style={homeStyles.ongoingRefIdBold}>{item.applicationId.slice(-10)}</Text>
                  </Text>
                  <Text style={homeStyles.ongoingLastEdit}>
                    submitted{' '}
                    {new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* SECTION 3: CREDIT CARDS (Only show un-applied credit cards) */}
        {availableCreditCards.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>IMTIAZ CREDIT CARDS</Text>
            {availableCreditCards.map((card, idx) => (
              <TouchableOpacity
                key={card.cardId || idx}
                style={homeStyles.promoCardContainer}
                onPress={() => router.push({ pathname: '/apply-card', params: { productId: card.cardId } })}
                activeOpacity={0.9}
              >
                <View style={homeStyles.lightGraphicBanner}>
                  <Image
                    source={getCardStatusImage('APPLY', card.imageId, card.productId)}
                    style={homeStyles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={homeStyles.cardOverlayHeader}>
                    <View style={homeStyles.bankBadge}>
                      <Text style={homeStyles.bankBadgeText}>{card.bank || 'Klysavo Bank'}</Text>
                    </View>
                    <View style={homeStyles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#D4AF37" />
                      <Text style={homeStyles.ratingBadgeText}>{card.rating || 4.8}</Text>
                    </View>
                  </View>
                </View>

                <View style={idx % 2 === 0 ? homeStyles.infoBoxMint : homeStyles.infoBoxCream}>
                  <Text style={homeStyles.categoryTag}>{card.category || 'Credit Card'}</Text>
                  <Text style={homeStyles.cardTitle}>{card.title}</Text>

                  <View style={homeStyles.feeRow}>
                    <View style={homeStyles.feePill}>
                      <Text style={homeStyles.feePillText}>
                        {card.annualFee > 0 ? `Annual Fee: BHD ${card.annualFee}` : 'Zero Annual Fee'}
                      </Text>
                    </View>
                    {card.joiningFee === 0 && (
                      <View style={[homeStyles.feePill, { backgroundColor: 'rgba(212, 175, 55, 0.15)' }]}>
                        <Text style={[homeStyles.feePillText, { color: colors.goldDark }]}>Free Joining</Text>
                      </View>
                    )}
                  </View>

                  {card.shortDescription && (
                    <View style={homeStyles.promoOfferCard}>
                      <View style={homeStyles.promoIconBadge}>
                        <Ionicons name="card" size={22} color={colors.gold} />
                      </View>
                      <Text style={homeStyles.promoText}>{card.shortDescription}</Text>
                    </View>
                  )}

                  <Text style={homeStyles.cardSubtext}>{card.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* SECTION 4: INSURANCE COVERAGE (Only show un-applied insurance coverage) */}
        {availableInsuranceCards.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>INSURANCE COVERAGE</Text>
            {availableInsuranceCards.map((card, idx) => (
              <TouchableOpacity
                key={card.cardId || idx}
                style={homeStyles.promoCardContainer}
                onPress={() => router.push({ pathname: '/apply-card', params: { productId: card.cardId } })}
                activeOpacity={0.9}
              >
                <View style={homeStyles.lightGraphicBanner}>
                  <Image
                    source={getCardStatusImage('APPLY', card.imageId, card.productId)}
                    style={homeStyles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={homeStyles.cardOverlayHeader}>
                    <View style={homeStyles.bankBadge}>
                      <Text style={homeStyles.bankBadgeText}>{card.bank || 'Klysavo Care'}</Text>
                    </View>
                    <View style={homeStyles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#D4AF37" />
                      <Text style={homeStyles.ratingBadgeText}>{card.rating || 4.8}</Text>
                    </View>
                  </View>
                </View>
                <View style={homeStyles.infoBoxMint}>
                  <Text style={homeStyles.categoryTag}>{card.category || 'Insurance Protection'}</Text>
                  <Text style={homeStyles.cardTitle}>{card.title}</Text>
                  <Text style={homeStyles.cardSubtext}>{card.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* SECTION 5: LOAN PRODUCTS (Only show un-applied loan products) */}
        {availableLoanCards.length > 0 && (
          <>
            <Text style={homeStyles.sectionLabel}>LOAN PRODUCTS</Text>
            {availableLoanCards.map((card, idx) => (
              <TouchableOpacity
                key={card.cardId || idx}
                style={homeStyles.promoCardContainer}
                onPress={() => router.push({ pathname: '/apply-card', params: { productId: card.cardId } })}
                activeOpacity={0.9}
              >
                <View style={homeStyles.lightGraphicBanner}>
                  <Image
                    source={getCardStatusImage('APPLY', card.imageId, card.productId)}
                    style={homeStyles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={homeStyles.cardOverlayHeader}>
                    <View style={homeStyles.bankBadge}>
                      <Text style={homeStyles.bankBadgeText}>{card.bank || 'Klysavo Finance'}</Text>
                    </View>
                    <View style={homeStyles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#D4AF37" />
                      <Text style={homeStyles.ratingBadgeText}>{card.rating || 4.8}</Text>
                    </View>
                  </View>
                </View>
                <View style={homeStyles.infoBoxCream}>
                  <Text style={homeStyles.categoryTag}>{card.category || 'Loan Product'}</Text>
                  <Text style={homeStyles.cardTitle}>{card.title}</Text>
                  <Text style={homeStyles.cardSubtext}>{card.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Side Menu Drawer Component */}
      <SideMenuDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}
