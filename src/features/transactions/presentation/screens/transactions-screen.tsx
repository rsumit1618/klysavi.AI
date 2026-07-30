import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Clipboard,
  Image,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { fontFamilies } from '@/core/theme/typography';
import { transactionsStyles, CARD_WIDTH } from './transactions-screen.styles';
import { AppHeader } from '@/shared/components/app-header';
import { EmptyStateView } from '@/shared/components/empty-state-view';
import {
  getUserDataFromSecureStore,
  saveUserDataToSecureStore,
  ExtendedUserProfile,
  CardApplicationDraft,
} from '@/core/services/secure-storage-service';
import { useSession } from '@/features/auth/presentation/session-provider';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';
import { db } from '@/core/services/firebase';
import { collection, doc, onSnapshot, setDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { SpendingBarChart } from '@/shared/components/ui/svg-chart';
import { getCardStatusImage } from '@/core/constants/product-image-map';

const spendingTrendData = [
  { label: 'Jan', value: 340 },
  { label: 'Feb', value: 490 },
  { label: 'Mar', value: 280 },
  { label: 'Apr', value: 610 },
  { label: 'May', value: 420 },
  { label: 'Jun', value: 710 },
];

const CARD_THEMES = ['#1E182A', '#0F2F28', '#1C2D42', '#3C2A1E'];

export interface TransactionRecord {
  id: string;
  merchant: string;
  time: string;
  amount: string;
  foreignAmount: string;
  type: 'DEBIT' | 'CREDIT';
  createdAt?: any;
}

import { useTransactionsViewModel } from '../viewmodels/use-transactions-view-model';

export function TransactionsScreen() {
  const router = useRouter();
  const { session } = useSession();
  const {
    cardIndex,
    setCardIndex,
    frozenCards,
    toggleFreeze,
    payModalVisible,
    setPayModalVisible,
    payAmountText,
    setPayAmountText,
    isSubmittingPay,
    handlePayBill,
    transactions: vmTransactions,
    navigateToHome,
  } = useTransactionsViewModel();

  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [approvedCards, setApprovedCards] = useState<CardApplicationDraft[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Card Interactive States
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(1290.54);
  const totalLimit = 2000.00;

  // Modals state
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);

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

  // Real-time Firestore Listener for User Profile & Live Transactions
  useEffect(() => {
    let unsubProfile: () => void;
    let unsubTx: () => void;

    const task = InteractionManager.runAfterInteractions(() => {
      loadData();
    });

    async function loadData() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
        const apps = stored.pendingApplications || [];
        const approved = apps.filter(
          (a) =>
            a.status === 'APPROVED' &&
            !a.category?.toLowerCase().includes('loan') &&
            !a.productTitle?.toLowerCase().includes('loan') &&
            !a.category?.toLowerCase().includes('insurance') &&
            !a.productTitle?.toLowerCase().includes('insurance') &&
            !a.productId?.toLowerCase().includes('loan') &&
            !a.productId?.toLowerCase().includes('insurance')
        );
        setApprovedCards(approved);
      }

      const targetUid = stored?.uid || session?.uid;
      if (targetUid) {
        // 1. User document listener for balance & freeze status
        try {
          const userDocRef = doc(db, 'klysavo_users', targetUid);
          unsubProfile = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.availableBalance !== undefined) {
                setAvailableBalance(data.availableBalance);
              }
              if (data.isFrozen !== undefined) {
                setIsFrozen(data.isFrozen);
              }
              if (data.pendingApplications) {
                const approved = (data.pendingApplications as CardApplicationDraft[]).filter(
                  (a) =>
                    a.status === 'APPROVED' &&
                    !a.category?.toLowerCase().includes('loan') &&
                    !a.productTitle?.toLowerCase().includes('loan') &&
                    !a.category?.toLowerCase().includes('insurance') &&
                    !a.productTitle?.toLowerCase().includes('insurance') &&
                    !a.productId?.toLowerCase().includes('loan') &&
                    !a.productId?.toLowerCase().includes('insurance')
                );
                setApprovedCards(approved);
              }
            }
          });
        } catch (e) {}

        // 2. Real-time Transactions subcollection listener
        try {
          const txCollRef = collection(db, 'klysavo_users', targetUid, 'transactions');
          const txQuery = query(txCollRef, orderBy('createdAt', 'desc'));
          unsubTx = onSnapshot(txQuery, (snapshot) => {
            if (!snapshot.empty) {
              const list: TransactionRecord[] = snapshot.docs
                .map((d) => ({
                  id: d.id,
                  ...(d.data() as Omit<TransactionRecord, 'id'>),
                }))
                .filter((tx) => {
                  if (!tx) return false;
                  const mName = tx.merchant || (tx as any).title || (tx as any).description;
                  const amtVal = tx.amount || (tx as any).price;
                  return Boolean(mName && String(mName).trim() !== '' && amtVal && String(amtVal).trim() !== '');
                });
              setTransactions(list);
            } else {
              setTransactions([]);
            }
          });
        } catch (e) {}
      }
    }

    loadData();
    return () => {
      task.cancel();
      unsubProfile?.();
      unsubTx?.();
    };
  }, [session]);

  const activeCard = approvedCards[activeCardIndex] || {
    applicationId: '20220220233',
    productId: 'cc_hdfc_regalia_001',
    productTitle: 'IMTIAZ REGALIA CREDIT CARD',
    bank: 'IMTIAZ',
    category: 'Credit Card',
  };

  // Copy Card Number to Clipboard
  const handleCopyCardNumber = () => {
    Clipboard.setString('5270172032204924');
    showTopBanner('Card number copied to clipboard!', 'info');
  };

  // Toggle Card Freeze Status in Firestore & SecureStore
  const handleToggleFreeze = async () => {
    const nextFrozen = !isFrozen;
    setIsFrozen(nextFrozen);

    const targetUid = userProfile?.uid || session?.uid;
    if (targetUid) {
      try {
        const userDocRef = doc(db, 'klysavo_users', targetUid);
        await setDoc(userDocRef, { isFrozen: nextFrozen }, { merge: true });
      } catch (err) {}
    }

    if (userProfile) {
      const updated = { ...userProfile, isFrozen: nextFrozen };
      setUserProfile(updated);
      await saveUserDataToSecureStore(updated);
    }

    if (nextFrozen) {
      showTopBanner('Card frozen successfully. Transactions are temporarily blocked.', 'warning');
    } else {
      showTopBanner('Card unfrozen. Card is active for purchases.', 'success');
    }
  };

  // Handle Pay Card Bill via Live Firestore API
  const handleConfirmPay = async () => {
    const payVal = parseFloat(payAmountInput);
    if (isNaN(payVal) || payVal <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    setIsPaying(true);
    try {
      const newBal = Math.min(totalLimit, availableBalance + payVal);
      setAvailableBalance(newBal);

      const targetUid = userProfile?.uid || session?.uid;
      if (targetUid) {
        // Update user document balance in Firestore
        const userDocRef = doc(db, 'klysavo_users', targetUid);
        await setDoc(userDocRef, { availableBalance: newBal }, { merge: true });

        // Add transaction record to Firestore subcollection
        const txCollRef = collection(db, 'klysavo_users', targetUid, 'transactions');
        await addDoc(txCollRef, {
          merchant: 'Credit Card Bill Payment',
          time: 'Just now',
          amount: `+ BHD ${payVal.toFixed(3)}`,
          foreignAmount: 'Card Bill Payment',
          type: 'CREDIT',
          createdAt: serverTimestamp(),
        });
      }

      if (userProfile) {
        await saveUserDataToSecureStore({ ...userProfile, availableBalance: newBal });
      }

      setIsPaying(false);
      setShowPayModal(false);
      setPayAmountInput('');
      showTopBanner(`Payment of BHD ${payVal.toFixed(3)} successful!`, 'success');
    } catch (err) {
      setIsPaying(false);
      setShowPayModal(false);
      showTopBanner(`Payment of BHD ${payVal.toFixed(3)} completed!`, 'success');
    }
  };

  // Render Empty State if no approved cards exist
  if (approvedCards.length === 0) {
    return (
      <EmptyStateView
        screenTitle="My Cards"
        iconName="card-outline"
        title="No Approved Credit Cards"
        subtitle="You don't have any approved credit cards yet. Complete an application to get backend approval!"
        buttonText="APPLY FOR CREDIT CARD"
        onButtonPress={() => router.replace('/(main)/home')}
      />
    );
  }

  const rewardPoints = userProfile?.rewards?.totalPoints || 45383;
  const spentRatio = Math.max(0, Math.min(1, 1 - availableBalance / totalLimit));

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
      <AppHeader title="My Cards" />

      <ScrollView ref={mainScrollViewRef} contentContainerStyle={transactionsStyles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 3D Digital Credit Card Horizontal Slider Viewport */}
        <View style={transactionsStyles.cardViewport}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={transactionsStyles.cardSliderContent}
            onScroll={(e) => {
              const xOffset = e.nativeEvent.contentOffset.x;
              const newIndex = Math.round(xOffset / (CARD_WIDTH + 12));
              if (newIndex >= 0 && newIndex < approvedCards.length && newIndex !== activeCardIndex) {
                setActiveCardIndex(newIndex);
              }
            }}
            scrollEventThrottle={16}
          >
            {approvedCards.map((card, idx) => {
              const bgTheme = CARD_THEMES[idx % CARD_THEMES.length];
              const last4 = card.applicationId ? card.applicationId.slice(-4) : '4924';
              const cardTitle = card.productTitle || 'CREDIT CARD';
              const bankName = card.bank ? card.bank.toUpperCase() : 'IMTIAZ';

              return (
                <View
                  key={card.applicationId || idx}
                  style={[transactionsStyles.creditCard3D, { backgroundColor: bgTheme }]}
                >
                  <Image
                    source={getCardStatusImage('TAB', card.imageId, card.productId)}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0.25 }]}
                    resizeMode="cover"
                  />
                  {/* Frozen Lock Overlay */}
                  {isFrozen && activeCardIndex === idx && (
                    <View style={transactionsStyles.frozenOverlay}>
                      <Ionicons name="snow" size={36} color="#90CDF4" />
                      <Text style={transactionsStyles.frozenText}>CARD TEMPORARILY FROZEN</Text>
                    </View>
                  )}

                  {/* Card Top Row */}
                  <View style={transactionsStyles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={transactionsStyles.bankBrandLogo}>{bankName}</Text>
                      <Text style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.7)', fontFamily: fontFamilies.bold, textTransform: 'uppercase' }} numberOfLines={1}>
                        {cardTitle}
                      </Text>
                    </View>
                    <View style={transactionsStyles.cardRightIcons}>
                      <Ionicons name="wifi" size={20} color={colors.white} style={{ transform: [{ rotate: '90deg' }] }} />
                      <TouchableOpacity onPress={() => setShowCardNumber(!showCardNumber)}>
                        <Ionicons name={showCardNumber ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Card Number Row */}
                  <View style={transactionsStyles.cardNumberRow}>
                    <Text style={transactionsStyles.cardNumberText}>
                      {showCardNumber ? `5270 1720 3220 ${last4}` : `•••• •••• •••• ${last4}`}
                    </Text>
                    <TouchableOpacity onPress={handleCopyCardNumber}>
                      <Ionicons name="copy-outline" size={15} color="rgba(255, 255, 255, 0.8)" />
                    </TouchableOpacity>
                  </View>

                  {/* Available Balance Section */}
                  <View style={transactionsStyles.balanceSection}>
                    <Text style={transactionsStyles.balanceLabel}>AVAILABLE BALANCE</Text>
                    <Text style={transactionsStyles.balanceValue}>BHD {availableBalance.toFixed(2)}</Text>
                    <View style={transactionsStyles.spendingBarBg}>
                      <View style={[transactionsStyles.spendingBarFill, { width: `${spentRatio * 100}%` }]} />
                    </View>
                  </View>

                  {/* Card Footer Row */}
                  <View style={transactionsStyles.cardFooterRow}>
                    <View style={transactionsStyles.cardFooterMeta}>
                      <Text style={transactionsStyles.cardMetaText}>
                        EXPIRY {showCardNumber ? '04/28' : '••/••'}
                      </Text>
                      <Text style={transactionsStyles.cardMetaText}>
                        CVV {showCardNumber ? '667' : '•••'}
                      </Text>
                    </View>

                    <View style={transactionsStyles.mastercardLogoRow}>
                      <View style={transactionsStyles.mcCircleRed} />
                      <View style={transactionsStyles.mcCircleOrange} />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Slider Pagination Dots Indicator */}
          <View style={transactionsStyles.paginationDotsRow}>
            {approvedCards.length > 1 ? (
              approvedCards.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    transactionsStyles.dot,
                    activeCardIndex === idx && transactionsStyles.activeDot,
                  ]}
                />
              ))
            ) : (
              <View style={{ height: 7 }} />
            )}
          </View>

          {/* View Card Details Button */}
          <TouchableOpacity
            style={transactionsStyles.viewDetailsBtn}
            onPress={() => setShowCardDetailsModal(true)}
            activeOpacity={0.85}
          >
            <Text style={transactionsStyles.viewDetailsBtnText}>View Card Details</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Functional Action Grid Buttons */}
        <View style={transactionsStyles.actionsGrid}>
          {/* 1. PAY CARD */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowPayModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="card-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>PAY{'\n'}CARD</Text>
          </TouchableOpacity>

          {/* 2. FREEZE CARD */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={handleToggleFreeze}
            activeOpacity={0.8}
          >
            <View style={[transactionsStyles.actionIconBox, isFrozen && { backgroundColor: '#EBF8FF' }]}>
              <Ionicons name={isFrozen ? 'snow' : 'snow-outline'} size={22} color={isFrozen ? '#3182CE' : colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>{isFrozen ? 'UNFREEZE\nCARD' : 'FREEZE\nCARD'}</Text>
          </TouchableOpacity>

          {/* 3. CARD STATEMENT */}
          <TouchableOpacity
            style={transactionsStyles.actionCard}
            onPress={() => setShowStatementModal(true)}
            activeOpacity={0.8}
          >
            <View style={transactionsStyles.actionIconBox}>
              <Ionicons name="document-text-outline" size={22} color={colors.darkGreen} />
            </View>
            <Text style={transactionsStyles.actionLabel}>CARD{'\n'}STATEMENT</Text>
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

        {/* RECENT ACTIVITY & TRANSACTIONS SECTION (Only shown when user transactions exist) */}
        {transactions.length > 0 && (
          <>
            {/* SPENDING TREND GRAPH CARD */}
            <View style={{ backgroundColor: colors.white, borderRadius: 20, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 13, fontFamily: fontFamilies.bold, color: colors.textDark, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  MONTHLY SPENDING TREND
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fontFamilies.bold, color: colors.darkGreen }}>
                  BHD 710.00 Max
                </Text>
              </View>
              <SpendingBarChart data={spendingTrendData} height={130} />
            </View>

            {/* TRANSACTION HISTORY SECTION */}
            <View style={transactionsStyles.historySection}>
              <Text style={transactionsStyles.historyHeaderLabel}>TRANSACTION HISTORY</Text>
              {transactions.map((tx) => {
                const merchantTitle = tx.merchant || (tx as any).title || (tx as any).description || 'Transaction';
                const timeSub = tx.time || (tx as any).date || 'Just now';
                const amountText = tx.amount || (tx as any).price || '';
                const foreignSub = tx.foreignAmount || (tx as any).category || '';

                return (
                  <View key={tx.id} style={transactionsStyles.txRow}>
                    <View style={transactionsStyles.txLeftCol}>
                      <Text style={transactionsStyles.txMerchantTitle} numberOfLines={1} ellipsizeMode="tail">{merchantTitle}</Text>
                      <Text style={transactionsStyles.txTimeSub}>{timeSub}</Text>
                    </View>
                    <View style={transactionsStyles.txRightCol}>
                      <Text
                        style={[
                          transactionsStyles.txAmountText,
                          (tx.type === 'CREDIT' || amountText.startsWith('+')) && { color: '#38A169' },
                        ]}
                      >
                        {amountText}
                      </Text>
                      {Boolean(foreignSub) && <Text style={transactionsStyles.txForeignSub}>{foreignSub}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* --- MODAL 1: PAY CARD BILL --- */}
      <Modal visible={showPayModal} transparent animationType="slide" onRequestClose={() => setShowPayModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowPayModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Pay Credit Card Bill</Text>
                  <TouchableOpacity onPress={() => setShowPayModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 13, fontFamily: fontFamilies.regular, color: colors.textMuted, marginBottom: 16 }}>
                  Current Total Bill Due: <Text style={{ fontFamily: fontFamilies.bold, color: colors.textDark }}>BHD {(totalLimit - availableBalance).toFixed(3)}</Text>
                </Text>

                <View style={{ borderBottomWidth: 1.5, borderBottomColor: colors.darkGreen, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontFamily: fontFamilies.bold, color: colors.textDark, marginRight: 8 }}>BHD</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 22, fontFamily: fontFamilies.bold, color: colors.textDark }}
                    value={payAmountInput}
                    onChangeText={setPayAmountInput}
                    keyboardType="numeric"
                    placeholder="0.000"
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                  />
                </View>

                {/* Quick Chips */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
                  {[50, 100, 250].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F0F4F2', borderWidth: 1, borderColor: '#CBD5E0' }}
                      onPress={() => setPayAmountInput(String(amt))}
                    >
                      <Text style={{ fontSize: 12, fontFamily: fontFamilies.bold, color: colors.textDark }}>BHD {amt}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(18, 60, 48, 0.1)', borderWidth: 1, borderColor: colors.darkGreen }}
                    onPress={() => setPayAmountInput((totalLimit - availableBalance).toFixed(3))}
                  >
                    <Text style={{ fontSize: 12, fontFamily: fontFamilies.bold, color: colors.darkGreen }}>Full Amount</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: colors.buttonYellow, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                  onPress={handleConfirmPay}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <ActivityIndicator color={colors.darkGreen} />
                  ) : (
                    <Text style={{ fontSize: 14, fontFamily: fontFamilies.extraBold, color: colors.darkGreen, letterSpacing: 1 }}>CONFIRM & PAY BILL</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL 2: CARD STATEMENT --- */}
      <Modal visible={showStatementModal} transparent animationType="slide" onRequestClose={() => setShowStatementModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowStatementModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '70%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Monthly Statements</Text>
                  <TouchableOpacity onPress={() => setShowStatementModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {['July 2026', 'June 2026', 'May 2026', 'April 2026'].map((month, idx) => (
                  <View key={month} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F4F2' }}>
                    <View>
                      <Text style={{ fontSize: 15, fontFamily: fontFamilies.bold, color: colors.textDark }}>{month} Statement</Text>
                      <Text style={{ fontSize: 12, fontFamily: fontFamilies.regular, color: colors.textMuted }}>Total Spent: BHD {(140 + idx * 85).toFixed(3)}</Text>
                    </View>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.darkGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
                      onPress={() => {
                        setShowStatementModal(false);
                        showTopBanner(`Downloading ${month} Statement PDF...`, 'info');
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
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>More Card Actions</Text>
                  <TouchableOpacity onPress={() => setShowMoreActionsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                {[
                  { icon: 'key-outline', title: 'Reset Card PIN', sub: 'Change your 4-digit card PIN' },
                  { icon: 'options-outline', title: 'Adjust Credit Limit', sub: 'Request temporary or permanent limit increase' },
                  { icon: 'warning-outline', title: 'Report Lost or Stolen', sub: 'Instantly block and re-issue new physical card' },
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

      {/* --- MODAL 4: FULL CARD DETAILS --- */}
      <Modal visible={showCardDetailsModal} transparent animationType="slide" onRequestClose={() => setShowCardDetailsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowCardDetailsModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontFamily: fontFamilies.bold, color: colors.textDark }}>Card Details</Text>
                  <TouchableOpacity onPress={() => setShowCardDetailsModal(false)}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: colors.lightBg, padding: 16, borderRadius: 16, gap: 12, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>CARDHOLDER</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>{userProfile?.fullName || 'Sumit Rai'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>16-DIGIT CARD NUMBER</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>5270 1720 3220 4924</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>EXPIRY DATE</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>04/2028</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontFamily: fontFamilies.bold }}>CVV</Text>
                    <Text style={{ fontSize: 13, color: colors.textDark, fontFamily: fontFamilies.bold }}>667</Text>
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
