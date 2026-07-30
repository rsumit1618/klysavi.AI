import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/core/theme/colors';
import { profileStyles } from './profile-screen.styles';
import { homeStyles } from '@/features/home/presentation/screens/home-screen.styles';
import { useLocalization } from '@/core/localization/localization-provider';
import { AppHeader } from '@/shared/components/app-header';
import { TopBannerNotification, BannerType } from '@/shared/components/top-banner-notification';

import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import { PRODUCTS_CATALOG, ProductJsonItem } from '@/core/services/products-seed-service';
import { getLocalProductImage, getCardStatusImage } from '@/core/constants/product-image-map';
import {
  getUserDataFromSecureStore,
  cleanAndDeduplicateApplications,
  isProductApplied,
  ExtendedUserProfile,
} from '@/core/services/secure-storage-service';

export function ProfileScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  // Firestore Loaded Product Catalog Items (No dummy fallbacks)
  const [creditCards, setCreditCards] = useState<ProductJsonItem[]>([]);
  const [loanCards, setLoanCards] = useState<ProductJsonItem[]>([]);
  const [insuranceCards, setInsuranceCards] = useState<ProductJsonItem[]>([]);
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);

  // Top Banner Notification State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('info');

  const showTopBanner = (message: string, type: BannerType = 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  useEffect(() => {
    async function loadUserProfile() {
      const stored = await getUserDataFromSecureStore();
      if (stored) {
        setUserProfile(stored);
      }
    }
    loadUserProfile();
  }, []);

  // Real-time listener for products in Explore Tab with graceful error handling
  useEffect(() => {
    let unsubCredit: () => void;
    let unsubLoan: () => void;
    let unsubInsurance: () => void;

    async function loadExploreProducts() {
      // 1. Credit Cards
      try {
        const docRef = doc(db, 'products', 'credit_cards');
        const subColl = collection(db, 'products', 'credit_cards', 'items');
        unsubCredit = onSnapshot(
          subColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              setCreditCards(snapshot.docs.map(d => d.data() as ProductJsonItem));
            } else {
              const snap = await getDoc(docRef);
              if (snap.exists() && snap.data().items) {
                setCreditCards(snap.data().items as ProductJsonItem[]);
              }
            }
          },
          (error) => {
            console.warn('Explore credit cards snapshot note (handled gracefully):', error.message);
          }
        );
      } catch (err) {
        console.warn('Explore credit cards note:', err);
      }

      // 2. Loan Cards
      try {
        const docRef = doc(db, 'products', 'loan_cards');
        const subColl = collection(db, 'products', 'loan_cards', 'items');
        unsubLoan = onSnapshot(
          subColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              setLoanCards(snapshot.docs.map(d => d.data() as ProductJsonItem));
            } else {
              const snap = await getDoc(docRef);
              if (snap.exists() && snap.data().items) {
                setLoanCards(snap.data().items as ProductJsonItem[]);
              }
            }
          },
          (error) => {
            console.warn('Explore loan cards snapshot note (handled gracefully):', error.message);
          }
        );
      } catch (err) {
        console.warn('Explore loan cards note:', err);
      }

      // 3. Insurance Cards
      try {
        const docRef = doc(db, 'products', 'insurance_cards');
        const subColl = collection(db, 'products', 'insurance_cards', 'items');
        unsubInsurance = onSnapshot(
          subColl,
          async (snapshot) => {
            if (!snapshot.empty) {
              setInsuranceCards(snapshot.docs.map(d => d.data() as ProductJsonItem));
            } else {
              const snap = await getDoc(docRef);
              if (snap.exists() && snap.data().items) {
                setInsuranceCards(snap.data().items as ProductJsonItem[]);
              }
            }
          },
          (error) => {
            console.warn('Explore insurance cards snapshot note (handled gracefully):', error.message);
          }
        );
      } catch (err) {
        console.warn('Explore insurance cards note:', err);
      }
    }

    loadExploreProducts();
    return () => {
      unsubCredit?.();
      unsubLoan?.();
      unsubInsurance?.();
    };
  }, []);

  const catalogCredits = PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_credit_cards');
  const catalogLoans = PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_loan_cards');
  const catalogInsurance = PRODUCTS_CATALOG.filter((p) => p.productId === 'prd_insurance_cards');

  const displayCreditCards = creditCards.length > 0 ? creditCards : catalogCredits;
  const displayInsuranceCards = insuranceCards.length > 0 ? insuranceCards : catalogInsurance;
  const displayLoanCards = loanCards.length > 0 ? loanCards : catalogLoans;

  return (
    <SafeAreaView style={profileStyles.container}>
      {/* Auto-Closing Top Banner Notification */}
      <TopBannerNotification
        visible={bannerVisible}
        message={bannerMessage}
        type={bannerType}
        onClose={() => setBannerVisible(false)}
      />

      {/* Explore Title Header - Moved outside ScrollView for consistent padding */}
      <AppHeader title="Explore" />

      <ScrollView contentContainerStyle={profileStyles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. CREDIT CARDS SECTION */}
        {displayCreditCards.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={profileStyles.sectionLabel}>CREDIT CARDS</Text>
            {displayCreditCards.map((card, idx) => (
              <View
                key={card.cardId || idx}
                style={profileStyles.promoCardContainer}
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
                  <Text style={profileStyles.cardTitle}>{card.title}</Text>
                  <Text style={profileStyles.cardSubtext}>{card.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 2. INSURANCE CARDS SECTION */}
        {displayInsuranceCards.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={profileStyles.sectionLabel}>INSURANCE COVERAGE</Text>
            {displayInsuranceCards.map((card, idx) => (
              <View
                key={card.cardId || idx}
                style={profileStyles.promoCardContainer}
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

                <View style={profileStyles.infoBoxMint}>
                  <Text style={homeStyles.categoryTag}>{card.category || 'Insurance Protection'}</Text>
                  <Text style={profileStyles.cardTitle}>{card.title}</Text>
                  <Text style={profileStyles.cardSubtext}>{card.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 3. LOAN CARDS SECTION */}
        {displayLoanCards.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={profileStyles.sectionLabel}>LOAN PRODUCTS</Text>
            {displayLoanCards.map((card, idx) => (
              <View
                key={card.cardId || idx}
                style={profileStyles.promoCardContainer}
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

                <View style={profileStyles.infoBoxCream}>
                  <Text style={homeStyles.categoryTag}>{card.category || 'Loan Product'}</Text>
                  <Text style={profileStyles.cardTitle}>{card.title}</Text>
                  <Text style={profileStyles.cardSubtext}>{card.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SPECIAL OFFER CARD */}
        <View style={profileStyles.promoOfferCard}>
          <View style={profileStyles.promoIconBadge}>
            <Ionicons name="sparkles" size={24} color={colors.gold} />
          </View>
          <Text style={profileStyles.promoText}>{t('specialOfferText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
