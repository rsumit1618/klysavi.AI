import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { transactionsStyles, CARD_WIDTH } from '@/features/transactions/presentation/screens/transactions-screen.styles';
import { EmptyStateView } from '@/shared/components/empty-state-view';
import {
  getUserDataFromSecureStore,
  cleanAndDeduplicateApplications,
  ExtendedUserProfile,
  CardApplicationDraft,
} from '@/core/services/secure-storage-service';
import { AppHeader } from '@/shared/components/app-header';
import { useSession } from '@/features/auth/presentation/session-provider';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';
import { db } from '@/core/services/firebase';
import { doc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getCardStatusImage } from '@/core/constants/product-image-map';
import { AppHistoryList } from '@/shared/components/ui/app-history-list';
import { AppCardSlider } from '@/shared/components/ui/app-card-slider';

const INSURANCE_CARD_THEMES = ['#1E3C36', '#0F2F28', '#1C2D42', '#3D251E'];

const isInsuranceApproved = (a: CardApplicationDraft): boolean => {
  if (!a || a.status !== 'APPROVED') return false;
  const cat = (a.category || '').toLowerCase();
  const title = (a.productTitle || '').toLowerCase();
  const pId = (a.productId || '').toLowerCase();
  return cat.includes('insurance') || title.includes('insurance') || pId.includes('ins_') || pId.includes('insurance');
};

export default function InsuranceRoute() {
  const router = useRouter();
  const { session } = useSession();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [approvedPolicies, setApprovedPolicies] = useState<CardApplicationDraft[]>([]);
  const [activePolicyIndex, setActivePolicyIndex] = useState(0);
  const [insuranceTransactions, setInsuranceTransactions] = useState<any[]>([]);

  // Modals state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isFilingClaim, setIsFilingClaim] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [showPolicyDetailsModal, setShowPolicyDetailsModal] = useState(false);

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('info');

  const showTopBanner = (message: string, type: BannerType = 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  // Swiping back / pressing back returns to Home tab
  useEffect(() => {
    const onBackPress = () => {
      router.replace('/(main)/home');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const mainScrollViewRef = useRef<ScrollView>(null);

  // Refresh local policies & reset scroll position to top on screen focus
  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: false });
      async function refreshOnFocus() {
        const stored = await getUserDataFromSecureStore();
        if (stored) {
          setUserProfile(stored);
          const apps = cleanAndDeduplicateApplications(stored.pendingApplications || []);
          const policies = apps.filter(isInsuranceApproved);
          setApprovedPolicies(policies);
        }
      }
      refreshOnFocus();
    }, [])
  );

  // Real-time Firestore database listener for approved insurance policies
  useEffect(() => {
    let unsub: () => void;
    let unsubTx: () => void;

    const task = InteractionManager.runAfterInteractions(() => {
      loadInsurance();

      const targetUid = session?.uid;
      if (targetUid) {
        try {
          const txCollRef = collection(db, 'klysavo_users', targetUid, 'insurance_transactions');
          const txQuery = query(txCollRef, orderBy('createdAt', 'desc'));
          unsubTx = onSnapshot(
            txQuery,
            (snap) => {
              if (!snap.empty) {
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setInsuranceTransactions(list);
              } else {
                setInsuranceTransactions([]);
              }
            },
            () => setInsuranceTransactions([])
          );
        } catch (e) {
          setInsuranceTransactions([]);
        }
      }
    });

    async function loadInsurance() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
        const apps = cleanAndDeduplicateApplications(stored.pendingApplications || []);
        const policies = apps.filter(isInsuranceApproved);
        setApprovedPolicies(policies);
      }

      const targetUid = stored?.uid || session?.uid;
      if (targetUid) {
        try {
          const docRef = doc(db, 'klysavo_users', targetUid);
          unsub = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const rawApps = (data.pendingApplications as CardApplicationDraft[]) || [];
              const apps = cleanAndDeduplicateApplications(rawApps);
              const policies = apps.filter(isInsuranceApproved);
              setApprovedPolicies(policies);
            }
          });
        } catch (e) {}
      }
    }

    return () => {
      task.cancel();
      unsub?.();
      unsubTx?.();
    };
  }, [session]);

  const activePolicy = approvedPolicies[activePolicyIndex] || {
    applicationId: 'ins_12345678',
    productId: 'ins_health_shield_001',
    productTitle: 'Comprehensive Health Insurance',
    bank: 'KLYSAVO CARE',
    category: 'Health Insurance',
  };

  const activePolicyKey = activePolicy.applicationId || (activePolicy as any).cardId || activePolicy.productId || `policy_${activePolicyIndex}`;

  // Filter transactions uniquely for the active policy
  const activePolicyTransactions = insuranceTransactions.filter((tx) => {
    if (!tx) return false;
    const txPolicyId = (tx as any).policyId || (tx as any).applicationId;
    if (txPolicyId) {
      return txPolicyId === activePolicyKey;
    }
    // Legacy transactions default to 1st policy only
    return activePolicyIndex === 0;
  });

  // Render Empty State if no approved insurance policies exist
  if (approvedPolicies.length === 0) {
    return (
      <EmptyStateView
        screenTitle="My Insurance"
        iconName="shield-outline"
        title="No Active Insurance"
        subtitle="You don't have any active insurance policies at the moment. Explore health, auto, and travel coverage options!"
        buttonText="EXPLORE COVERAGE"
        onButtonPress={() => router.replace('/(main)/home')}
      />
    );
  }

  return (
    <SafeAreaView style={transactionsStyles.container}>
      {/* Top Banner Notification */}
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      {/* Standardized App Header */}
      <AppHeader title="My Insurance" />

      <ScrollView ref={mainScrollViewRef} contentContainerStyle={transactionsStyles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 3D Digital Insurance Card Horizontal Slider Viewport */}
        <AppCardSlider
          items={approvedPolicies.map((policy, idx) => ({
            id: policy.applicationId || `${idx}`,
            title: policy.productTitle || 'HEALTH SHIELD',
            bankName: policy.bank ? policy.bank.toUpperCase() : 'KLYSAVO CARE',
            refNumber: `POLICY NO: POL-${policy.applicationId ? policy.applicationId.slice(-8) : '88204924'}`,
            balanceLabel: 'TOTAL COVERAGE SUM',
            balanceValue: 'BHD 50,000.00',
            progressWidth: '100%',
            meta1Text: 'TYPE: COMPREHENSIVE',
            meta2Text: 'EXPIRY: 31 DEC 2027',
            imageId: policy.imageId,
            productId: policy.productId,
          }))}
          activeIndex={activePolicyIndex}
          onIndexChange={setActivePolicyIndex}
          themes={INSURANCE_CARD_THEMES}
          actionButtonText="View Policy Details"
          onActionButtonPress={() => setShowPolicyDetailsModal(true)}
        />

        {/* 4 Functional Action Grid Buttons */}
        <View style={transactionsStyles.actionsGrid}>
          {/* 1. FILE CLAIM */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowClaimModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>FILE{'\n'}CLAIM</Text>
          </TouchableOpacity>

          {/* 2. DOWNLOAD POLICY */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => showTopBanner('Downloading E-Policy Card PDF...', 'info')}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="download-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>DOWNLOAD{'\n'}POLICY</Text>
          </TouchableOpacity>

          {/* 3. RENEW POLICY */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => showTopBanner('Policy renewal request submitted!', 'success')}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="refresh-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>RENEW{'\n'}POLICY</Text>
          </TouchableOpacity>

          {/* 4. MORE ACTIONS */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowMoreActionsModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="grid-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>MORE{'\n'}ACTIONS</Text>
          </TouchableOpacity>
        </View>

        {/* CLAIMS & POLICY HISTORY SECTION */}
        <AppHistoryList
          headerTitle="CLAIMS & POLICY HISTORY"
          items={activePolicyTransactions.map((tx) => ({
            id: tx.id,
            title: tx.title || 'Insurance Claim',
            subText: tx.date || 'Just now',
            amountText: tx.amount || 'BHD 0.000',
            statusText: tx.status || 'SUBMITTED',
          }))}
          emptyIconName="shield-checkmark-outline"
          emptyTitle="No Transactions Yet"
          emptySubtitle="Make your first transaction or claim to view your activity here."
        />
      </ScrollView>

      {/* --- MODAL 1: FILE CLAIM --- */}
      <Modal visible={showClaimModal} transparent animationType="slide" onRequestClose={() => setShowClaimModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowClaimModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>File Insurance Claim</Text>
                  <TouchableOpacity onPress={() => setShowClaimModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {[
                  { title: 'Cashless Hospital Pre-Authorization', desc: 'Pre-approve hospital admission at network hospitals' },
                  { title: 'Reimbursement Claim', desc: 'Upload medical bills for direct bank reimbursement' },
                  { title: 'Emergency Roadside Assistance', desc: 'Instant car towing and repair support' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.title}
                    style={{ padding: 14, borderRadius: 16, backgroundColor: '#F0F4F2', marginBottom: 12, opacity: isFilingClaim ? 0.6 : 1 }}
                    disabled={isFilingClaim}
                    onPress={async () => {
                      if (isFilingClaim) return;
                      setIsFilingClaim(true);
                      if (session?.uid) {
                        try {
                          const txCollRef = collection(db, 'klysavo_users', session.uid, 'insurance_transactions');
                          await addDoc(txCollRef, {
                            policyId: activePolicyKey,
                            applicationId: activePolicy.applicationId || activePolicyKey,
                            title: item.title,
                            date: 'Just now',
                            amount: 'BHD 0.000',
                            status: 'SUBMITTED',
                            createdAt: serverTimestamp(),
                          });
                        } catch (err) {}
                      }
                      setIsFilingClaim(false);
                      setShowClaimModal(false);
                      showTopBanner(`${item.title} request initiated successfully!`, 'success');
                    }}
                  >
                    <Text style={{ fontSize: 15, fontFamily: fontFamilies.bold, color: colors.textDark }}>{item.title}</Text>
                    <Text style={{ fontSize: 12, fontFamily: fontFamilies.regular, color: colors.textMuted, marginTop: 2 }}>{item.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL 2: MORE ACTIONS --- */}
      <Modal visible={showMoreActionsModal} transparent animationType="slide" onRequestClose={() => setShowMoreActionsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMoreActionsModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>More Policy Actions</Text>
                  <TouchableOpacity onPress={() => setShowMoreActionsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {[
                  { icon: 'business-outline', title: 'Network Hospitals & Clinics', sub: 'Find nearby 500+ cashless medical centers' },
                  { icon: 'people-outline', title: 'Add Dependent Family Members', sub: 'Include spouse and children in policy' },
                  { icon: 'shield-outline', title: 'Upgrade Coverage Limit', sub: 'Increase sum insured amount up to BHD 100,000' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.title}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F4F2' }}
                    onPress={() => {
                      setShowMoreActionsModal(false);
                      showTopBanner(`${item.title} requested successfully!`, 'info');
                    }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F2', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={item.icon as any} size={20} color={colors.darkGreen} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontFamily: fontFamilies.bold, color: colors.textDark }}>{item.title}</Text>
                      <Text style={{ fontSize: 12, fontFamily: fontFamilies.regular, color: colors.textMuted }}>{item.sub}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL 3: FULL POLICY DETAILS --- */}
      <Modal visible={showPolicyDetailsModal} transparent animationType="slide" onRequestClose={() => setShowPolicyDetailsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowPolicyDetailsModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Policy Details</Text>
                  <TouchableOpacity onPress={() => setShowPolicyDetailsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: colors.lightBg, padding: 16, borderRadius: 16, gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>POLICY INSURED</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>{userProfile?.fullName || 'Sumit Rai'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>POLICY NUMBER</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>POL-{activePolicy.applicationId?.slice(-8) || '88204924'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>SUM INSURED</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>BHD 50,000.00</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>EXPIRY DATE</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>31 Dec 2027</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
