import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
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

const LOAN_CARD_THEMES = ['#0F2F28', '#1C2D42', '#3C2A1E', '#1E182A'];

export function TransferScreen() {
  const router = useRouter();
  const { session } = useSession();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [approvedLoans, setApprovedLoans] = useState<CardApplicationDraft[]>([]);
  const [activeLoanIndex, setActiveLoanIndex] = useState(0);
  const [loanTransactions, setLoanTransactions] = useState<any[]>([]);

  // Modals state
  const [showPayEmiModal, setShowPayEmiModal] = useState(false);
  const [payEmiInput, setPayEmiInput] = useState('245.500');
  const [isProcessing, setIsProcessing] = useState(false);

  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [showLoanDetailsModal, setShowLoanDetailsModal] = useState(false);

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('info');

  const mainScrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position to top whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

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

  // Real-time Firestore database listener for approved loans
  useEffect(() => {
    let unsub: () => void;
    let unsubTx: () => void;

    const task = InteractionManager.runAfterInteractions(() => {
      loadLoans();

      const targetUid = session?.uid;
      if (targetUid) {
        try {
          const txCollRef = collection(db, 'klysavo_users', targetUid, 'loan_transactions');
          const txQuery = query(txCollRef, orderBy('createdAt', 'desc'));
          unsubTx = onSnapshot(
            txQuery,
            (snap) => {
              if (!snap.empty) {
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setLoanTransactions(list);
              } else {
                setLoanTransactions([]);
              }
            },
            () => setLoanTransactions([])
          );
        } catch (e) {
          setLoanTransactions([]);
        }
      }
    });

    async function loadLoans() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
        const apps = stored.pendingApplications || [];
        const loans = apps.filter(
          (a) =>
            a.status === 'APPROVED' &&
            (a.category?.toLowerCase().includes('loan') || a.productTitle?.toLowerCase().includes('loan'))
        );
        setApprovedLoans(loans);
      }

      const targetUid = stored?.uid || session?.uid;
      if (targetUid) {
        try {
          const docRef = doc(db, 'klysavo_users', targetUid);
          unsub = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const apps = (data.pendingApplications as CardApplicationDraft[]) || [];
              const loans = apps.filter(
                (a) =>
                  a.status === 'APPROVED' &&
                  (a.category?.toLowerCase().includes('loan') || a.productTitle?.toLowerCase().includes('loan'))
              );
              setApprovedLoans(loans);
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

  const activeLoan = approvedLoans[activeLoanIndex] || {
    applicationId: 'loan_12345678',
    productId: 'loan_personal_express_001',
    productTitle: 'Klysavo Express Personal Loan',
    bank: 'KLYSAVO FINANCE',
    category: 'Personal Loan',
  };

  // Handle Pay Monthly EMI
  const handleConfirmPayEmi = async () => {
    const val = parseFloat(payEmiInput);
    if (isNaN(val) || val <= 0) {
      showTopBanner('Please enter a valid EMI payment amount.', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      if (session?.uid) {
        const txCollRef = collection(db, 'klysavo_users', session.uid, 'loan_transactions');
        await addDoc(txCollRef, {
          title: 'Monthly EMI Payment',
          date: 'Just now',
          amount: `- BHD ${val.toFixed(3)}`,
          status: 'PAID',
          createdAt: serverTimestamp(),
        });
      }
      setIsProcessing(false);
      setShowPayEmiModal(false);
      showTopBanner(`Monthly EMI Payment of BHD ${val.toFixed(3)} processed successfully!`, 'success');
    } catch (err) {
      setIsProcessing(false);
      console.warn('EMI payment error:', err);
    }
  };

  // Render Empty State if no approved loans exist
  if (approvedLoans.length === 0) {
    return (
      <EmptyStateView
        screenTitle="My Loans"
        iconName="cash-outline"
        title="No Active Loans"
        subtitle="You don't have any approved loan accounts at the moment. Apply for instant digital personal or auto loans!"
        buttonText="APPLY FOR LOAN"
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
      <AppHeader title="My Loans" />

      <ScrollView ref={mainScrollViewRef} contentContainerStyle={transactionsStyles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 3D Digital Loan Card Horizontal Slider Viewport */}
        <AppCardSlider
          items={approvedLoans.map((loan, idx) => ({
            id: loan.applicationId || `${idx}`,
            title: loan.productTitle || 'EXPRESS LOAN',
            bankName: loan.bank ? loan.bank.toUpperCase() : 'KLYSAVO FINANCE',
            refNumber: `LOAN ACC: LN-${loan.applicationId ? loan.applicationId.slice(-8) : '88204924'}`,
            balanceLabel: 'SANCTIONED LOAN AMOUNT',
            balanceValue: 'BHD 15,000.00',
            progressWidth: '45%',
            meta1Text: 'MONTHLY EMI: BHD 245.500',
            meta2Text: 'DUE: 05 AUG 2026',
            imageId: loan.imageId,
            productId: loan.productId,
          }))}
          activeIndex={activeLoanIndex}
          onIndexChange={setActiveLoanIndex}
          themes={LOAN_CARD_THEMES}
          actionButtonText="View Loan Details"
          onActionButtonPress={() => setShowLoanDetailsModal(true)}
        />

        {/* 4 Functional Action Grid Buttons */}
        <View style={transactionsStyles.actionsGrid}>
          {/* 1. PAY EMI */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowPayEmiModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="card-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>PAY{'\n'}EMI</Text>
          </TouchableOpacity>

          {/* 2. PREPAY LOAN */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => showTopBanner('Loan Pre-payment request submitted successfully!', 'success')}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="cash-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>PREPAY{'\n'}LOAN</Text>
          </TouchableOpacity>

          {/* 3. LOAN STATEMENT */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowStatementModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="document-text-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>LOAN{'\n'}STATEMENT</Text>
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

        {/* LOAN REPAYMENT HISTORY SECTION */}
        <AppHistoryList
          headerTitle="LOAN REPAYMENT HISTORY"
          items={loanTransactions.map((tx) => ({
            id: tx.id,
            title: tx.title || 'Monthly EMI Payment',
            subText: tx.date || 'Just now',
            amountText: tx.amount,
            statusText: tx.status || 'PAID',
          }))}
          emptyTitle="No Repayment History"
          emptySubtitle="Your repayment history will appear here once EMI payments are processed."
        />
      </ScrollView>

      {/* --- MODAL 1: PAY MONTHLY EMI --- */}
      <Modal visible={showPayEmiModal} transparent animationType="slide" onRequestClose={() => setShowPayEmiModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowPayEmiModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Pay Monthly Loan EMI</Text>
                  <TouchableOpacity onPress={() => setShowPayEmiModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 13, fontFamily: fontFamilies.regular, color: colors.textMuted, marginBottom: 16 }}>
                  Monthly Scheduled EMI: <Text style={{ fontFamily: fontFamilies.bold, color: colors.textDark }}>BHD 245.500</Text>
                </Text>

                <View style={{ borderBottomWidth: 1.5, borderBottomColor: colors.darkGreen, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 18, fontFamily: fontFamilies.bold, color: colors.textDark, marginRight: 8 }}>BHD</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 22, fontFamily: fontFamilies.bold, color: colors.textDark }}
                    value={payEmiInput}
                    onChangeText={setPayEmiInput}
                    keyboardType="numeric"
                    placeholder="245.500"
                  />
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: colors.buttonYellow, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                  onPress={handleConfirmPayEmi}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={colors.darkGreen} />
                  ) : (
                    <Text style={{ fontSize: 14, fontFamily: fontFamilies.extraBold, color: colors.darkGreen, letterSpacing: 1 }}>CONFIRM EMI PAYMENT</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL 2: LOAN STATEMENT --- */}
      <Modal visible={showStatementModal} transparent animationType="slide" onRequestClose={() => setShowStatementModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowStatementModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Loan Statements</Text>
                  <TouchableOpacity onPress={() => setShowStatementModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {['2026 Annual Statement', 'Q2 2026 Loan Summary', 'Interest Certificate 2026'].map((docTitle) => (
                  <View key={docTitle} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F4F2' }}>
                    <Text style={{ fontSize: 15, fontFamily: fontFamilies.bold, color: colors.textDark }}>{docTitle}</Text>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.darkGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
                      onPress={() => {
                        setShowStatementModal(false);
                        showTopBanner(`Downloading ${docTitle} PDF...`, 'info');
                      }}
                    >
                      <Ionicons name="download-outline" size={14} color={colors.gold} />
                      <Text style={{ fontSize: 11, fontFamily: fontFamilies.bold, color: colors.gold }}>PDF</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL 3: MORE ACTIONS --- */}
      <Modal visible={showMoreActionsModal} transparent animationType="slide" onRequestClose={() => setShowMoreActionsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMoreActionsModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>More Loan Actions</Text>
                  <TouchableOpacity onPress={() => setShowMoreActionsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {[
                  { icon: 'document-text-outline', title: 'Interest Tax Certificate', sub: 'Download official IT interest certificate' },
                  { icon: 'options-outline', title: 'Restructure Loan Tenure', sub: 'Request extension or tenure adjustment' },
                  { icon: 'checkmark-circle-outline', title: 'NOC / Loan Closure', sub: 'Request No Objection Certificate upon closure' },
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

      {/* --- MODAL 4: FULL LOAN DETAILS --- */}
      <Modal visible={showLoanDetailsModal} transparent animationType="slide" onRequestClose={() => setShowLoanDetailsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowLoanDetailsModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Loan Account Details</Text>
                  <TouchableOpacity onPress={() => setShowLoanDetailsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: colors.lightBg, padding: 16, borderRadius: 16, gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>LOAN HOLDER</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>{userProfile?.fullName || 'Sumit Rai'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>LOAN ACCOUNT NO</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>LN-{activeLoan.applicationId?.slice(-8) || '88204924'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>INTEREST RATE</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>4.5% p.a.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>TENURE</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>60 Months</Text>
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
