import React, { useState, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '@/core/services/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

import { ApplyOverviewScreen } from './apply-overview-screen';
import { ScanIdStepScreen } from './scan-id-step-screen';
import { IdDetailsStepScreen } from './id-details-step-screen';
import { AddressDetailsStepScreen } from './address-details-step-screen';
import { EmergencyContactStepScreen } from './emergency-contact-step-screen';
import { EmploymentDetailsStepScreen } from './employment-details-step-screen';
import { ApplicationSuccessScreen } from './application-success-screen';

import { PRODUCTS_CATALOG, ProductJsonItem } from '@/core/services/products-seed-service';
import {
  getUserDataFromSecureStore,
  saveUserDataToSecureStore,
  cleanAndDeduplicateApplications,
  getNormalizedProductKey,
  ExtendedUserProfile,
  CardApplicationDraft,
} from '@/core/services/secure-storage-service';
import { useSession } from '@/features/auth/presentation/session-provider';

import { useApplyCardViewModel } from '../viewmodels/use-apply-card-view-model';

export function ApplyCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session } = useSession();
  const vm = useApplyCardViewModel();

  const productId = (params.productId as string) || 'cc_hdfc_regalia_001';
  const initialStepParam = params.resumeStep ? parseInt(params.resumeStep as string, 10) : 0;
  const initialAppIdParam = (params.applicationId as string) || null;

  const [currentStep, setCurrentStep] = useState<number>(initialStepParam);
  const [minAllowedStep, setMinAllowedStep] = useState<number>(initialStepParam);
  const [selectedProduct, setSelectedProduct] = useState<ProductJsonItem | null>(null);
  const [applicationId, setApplicationId] = useState<string>(initialAppIdParam || `app_${Date.now()}`);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [draftData, setDraftData] = useState<Partial<CardApplicationDraft>>({
    applicationId: initialAppIdParam || `app_${Date.now()}`,
    productId,
    status: 'PENDING',
    currentStep: initialStepParam,
    createdAt: new Date().toISOString(),
  });

  // 1. Fetch Product details from PRODUCTS_CATALOG or Firestore
  useEffect(() => {
    async function loadProductAndDraft() {
      // Step A: Product match
      const matched = PRODUCTS_CATALOG.find((p) => p.cardId === productId || p.productId === productId);
      if (matched) {
        setSelectedProduct(matched);
        setDraftData((prev) => ({
          ...prev,
          productTitle: matched.title,
          bank: matched.bank,
          category: matched.category,
          imageId: matched.imageId,
        }));
      } else {
        try {
          const docRef = doc(db, 'products', 'credit_cards', 'items', productId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as ProductJsonItem;
            setSelectedProduct(data);
            setDraftData((prev) => ({
              ...prev,
              productTitle: data.title,
              bank: data.bank,
              category: data.category,
              imageId: data.imageId,
            }));
          }
        } catch (e) {
          console.warn('Product fetch note:', e);
        }
      }

      // Step B: Load existing user profile & check for pending draft for THIS EXACT PRODUCT
      const targetUid = session?.uid;
      const targetProductKey = getNormalizedProductKey({ cardId: productId, productId: productId, title: matched?.title });
      let existingApp: CardApplicationDraft | undefined = undefined;

      const storedUser = await getUserDataFromSecureStore();
      if (storedUser?.pendingApplications) {
        existingApp = storedUser.pendingApplications.find((a) => {
          if (!a) return false;
          if (initialAppIdParam && a.applicationId === initialAppIdParam) return true;
          const draftKey = getNormalizedProductKey(a);
          return draftKey === targetProductKey;
        });
      }

      // Step C: Fallback - query Firestore database for remote pending draft for THIS EXACT PRODUCT
      if (!existingApp && targetUid) {
        try {
          const userDocRef = doc(db, 'klysavo_users', targetUid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const remotePending = (userSnap.data()?.pendingApplications || []) as CardApplicationDraft[];
            existingApp = remotePending.find((a) => {
              if (!a) return false;
              if (initialAppIdParam && a.applicationId === initialAppIdParam) return true;
              const draftKey = getNormalizedProductKey(a);
              return draftKey === targetProductKey;
            });
          }
        } catch (fErr) {
          console.warn('Firestore draft load note:', fErr);
        }
      }

      if (existingApp) {
        if (existingApp.status === 'SUBMITTED' || existingApp.status === 'APPROVED') {
          Alert.alert(
            'Already Applied',
            `You have already submitted an application for ${existingApp.productTitle || 'this card'}. Your application is currently under review.`,
            [{ text: 'OK', onPress: () => router.replace('/(main)/home') }]
          );
          return;
        }

        setApplicationId(existingApp.applicationId);
        setDraftData(existingApp);
        const startStep = initialStepParam > 0 ? initialStepParam : (existingApp.currentStep || 0);
        setMinAllowedStep(startStep);
        setCurrentStep(startStep);
      } else {
        // CLEAN FRESH START FOR NEW PRODUCT APPLICATION
        const newAppId = initialAppIdParam || `app_${Date.now()}`;
        const startStep = initialStepParam > 0 ? initialStepParam : 0;
        setApplicationId(newAppId);
        setMinAllowedStep(startStep);
        setCurrentStep(startStep);
        setDraftData({
          applicationId: newAppId,
          productId: matched?.cardId || matched?.productId || productId,
          productTitle: matched?.title || 'Card Application',
          bank: matched?.bank || 'Klysavo Bank',
          category: matched?.category || 'Credit Card',
          imageId: matched?.imageId || 'img_cc_hdfc_regalia_001',
          status: 'PENDING',
          currentStep: startStep,
          createdAt: new Date().toISOString(),
        });
      }
    }

    loadProductAndDraft();
  }, [productId, initialAppIdParam, session?.uid]);

  // Hardware Back Handler to enforce minAllowedStep boundary
  useEffect(() => {
    const onBackPress = () => {
      handlePrevStep();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentStep, minAllowedStep]);

  // Helper to persist draft to both Firestore & SecureStore on every NEXT click
  const saveDraftToDatabaseAndStore = async (
    stepNumber: number,
    partialUpdates: Partial<CardApplicationDraft>,
    isFinalSubmit: boolean = false
  ): Promise<boolean> => {
    const storedUser = await getUserDataFromSecureStore();
    const targetUid = storedUser?.uid || session?.uid || 'usr_registered_user';
    
    const baseUser = storedUser || {
      uid: targetUid,
      fullName: session?.displayName || 'Valued User',
      email: session?.email || '',
      mobileNumber: '',
      cprNumber: '',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const nowIso = new Date().toISOString();
    const rawDraft: CardApplicationDraft = {
      applicationId: applicationId,
      productId: productId,
      productTitle: selectedProduct?.title || draftData.productTitle || 'Credit Card Application',
      bank: selectedProduct?.bank || draftData.bank || 'Klysavo Bank',
      category: selectedProduct?.category || draftData.category || 'Credit Card',
      imageId: selectedProduct?.imageId || draftData.imageId || 'img_cc_hdfc_regalia_001',
      currentStep: stepNumber,
      status: partialUpdates.status || (isFinalSubmit || stepNumber >= 6 ? 'SUBMITTED' : 'PENDING'),
      updatedAt: nowIso,
      createdAt: draftData.createdAt || nowIso,
      capturedImageUri: partialUpdates.capturedImageUri || draftData.capturedImageUri || '',
      idDetails: { ...draftData.idDetails, ...partialUpdates.idDetails },
      addressDetails: { ...draftData.addressDetails, ...partialUpdates.addressDetails },
      emergencyContactDetails: { ...draftData.emergencyContactDetails, ...partialUpdates.emergencyContactDetails },
      employmentDetails: { ...draftData.employmentDetails, ...partialUpdates.employmentDetails },
    };

    // Sanitize object so no undefined values are passed to Firestore setDoc
    const fullDraft = JSON.parse(JSON.stringify(rawDraft)) as CardApplicationDraft;

    setDraftData(fullDraft);

    // Update pendingApplications array
    const currentPending = baseUser.pendingApplications || [];
    let updatedPendingList: CardApplicationDraft[];

    const idx = currentPending.findIndex((a) => a.applicationId === applicationId);
    if (idx >= 0) {
      updatedPendingList = [...currentPending];
      updatedPendingList[idx] = fullDraft;
    } else {
      updatedPendingList = [fullDraft, ...currentPending];
    }

    const cleanedPendingList = cleanAndDeduplicateApplications(updatedPendingList);

    const updatedProfile: ExtendedUserProfile = {
      ...baseUser,
      pendingApplications: cleanedPendingList,
    };

    // 1. Update Local SecureStore
    await saveUserDataToSecureStore(updatedProfile);

    // 2. Save to Firestore Database (both sub-collection & parent doc)
    try {
      const appDocRef = doc(db, 'klysavo_users', targetUid, 'applications', applicationId);
      await setDoc(appDocRef, fullDraft, { merge: true });

      const userDocRef = doc(db, 'klysavo_users', targetUid);
      await setDoc(userDocRef, { pendingApplications: cleanedPendingList }, { merge: true });

      console.log(`\n✅ [FIRESTORE STEP SAVE SUCCESS] Saved Step ${stepNumber} to klysavo_users/${targetUid}/applications/${applicationId}`);
      return true;
    } catch (err) {
      console.error('Firestore application save error:', err);
      await saveUserDataToSecureStore(updatedProfile);
      return false;
    }
  };

  // Overview Step 0 -> Proceed to Scan ID (Step 1)
  const handleOverviewProceed = () => {
    setCurrentStep(1);
  };

  // Step 1: Scan ID Complete -> Save to API FIRST, ONLY THEN navigate to next step
  const handleScanIdNext = async (data?: { capturedImage: string }) => {
    const nextStep = currentStep + 1;
    const steps = selectedProduct?.steps || [];
    const isFinalSubmit = currentStep === steps.length;

    setIsSaving(true);
    const success = await saveDraftToDatabaseAndStore(nextStep, { capturedImageUri: data?.capturedImage }, isFinalSubmit);
    setIsSaving(false);
    if (success) {
      setCurrentStep(nextStep);
    } else {
      Alert.alert('Save Error', 'Failed to save application progress to server. Please try again.');
    }
  };

  // Step 2: ID Details Complete -> Save to API FIRST, ONLY THEN navigate to next step
  const handleIdDetailsNext = async (data?: { fullName: string; cprNumber: string; dob: string; expiryDate: string; nationality?: string }) => {
    const nextStep = currentStep + 1;
    const steps = selectedProduct?.steps || [];
    const isFinalSubmit = currentStep === steps.length;

    setIsSaving(true);
    const success = await saveDraftToDatabaseAndStore(nextStep, { idDetails: data }, isFinalSubmit);
    setIsSaving(false);
    if (success) {
      setCurrentStep(nextStep);
    } else {
      Alert.alert('Save Error', 'Failed to save application progress to server. Please try again.');
    }
  };

  // Step 3: Address Details Complete -> Save to API FIRST, ONLY THEN navigate to next step
  const handleAddressDetailsNext = async (data?: { building: string; road: string; block: string; city: string }) => {
    const nextStep = currentStep + 1;
    const steps = selectedProduct?.steps || [];
    const isFinalSubmit = currentStep === steps.length;

    setIsSaving(true);
    const success = await saveDraftToDatabaseAndStore(nextStep, { addressDetails: data }, isFinalSubmit);
    setIsSaving(false);
    if (success) {
      setCurrentStep(nextStep);
    } else {
      Alert.alert('Save Error', 'Failed to save application progress to server. Please try again.');
    }
  };

  // Step 4: Emergency Contact Complete -> Save to API FIRST, ONLY THEN navigate to next step
  const handleEmergencyContactNext = async (data?: { name: string; phone: string; relationship: string }) => {
    const nextStep = currentStep + 1;
    const steps = selectedProduct?.steps || [];
    const isFinalSubmit = currentStep === steps.length;

    setIsSaving(true);
    const success = await saveDraftToDatabaseAndStore(nextStep, { emergencyContactDetails: data }, isFinalSubmit);
    setIsSaving(false);
    if (success) {
      setCurrentStep(nextStep);
    } else {
      Alert.alert('Save Error', 'Failed to save application progress to server. Please try again.');
    }
  };

  // Step 5: Employment Details Complete -> Save to API FIRST, ONLY THEN navigate to success
  const handleEmploymentSubmit = async (data?: { employer?: string; employerName?: string; employmentStatus?: string; occupation: string; monthlySalary: string }) => {
    const nextStep = currentStep + 1;
    const steps = selectedProduct?.steps || [];
    const isFinalSubmit = currentStep === steps.length;

    setIsSaving(true);
    const success = await saveDraftToDatabaseAndStore(nextStep, { employmentDetails: data }, isFinalSubmit);
    setIsSaving(false);
    if (success) {
      setCurrentStep(nextStep);
    } else {
      Alert.alert('Submission Error', 'Failed to submit application to server. Please try again.');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > minAllowedStep) {
      setCurrentStep((prev) => prev - 1);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(main)/home');
      }
    }
  };

  const handleFinish = () => {
    router.replace('/(main)/home');
  };

  // Helper to render the current step component dynamically based on product configuration
  const renderStepComponent = () => {
    // Step 0: Always Overview
    if (currentStep === 0) {
      return (
        <ApplyOverviewScreen
          onProceed={handleOverviewProceed}
          onBack={() => router.back()}
          productTitle={selectedProduct?.title || draftData.productTitle}
          isLoading={isSaving}
        />
      );
    }

    const steps = selectedProduct?.steps || [];

    // Final Step + 1: Always Success
    if (currentStep > steps.length) {
      return <ApplicationSuccessScreen onDone={handleFinish} applicationId={applicationId} isLoading={isSaving} />;
    }

    // Dynamic Step from Database
    const currentStepConfig = steps[currentStep - 1];
    const isLastStep = currentStep === steps.length;

    if (!currentStepConfig) return null;

    switch (currentStepConfig.id) {
      case 'scan_id':
        return (
          <ScanIdStepScreen
            onContinue={handleScanIdNext}
            onBack={handlePrevStep}
            initialImage={draftData.capturedImageUri}
            isLoading={isSaving}
          />
        );
      case 'id_details':
        return (
          <IdDetailsStepScreen
            onContinue={handleIdDetailsNext}
            onBack={handlePrevStep}
            initialData={draftData.idDetails}
            isLoading={isSaving}
          />
        );
      case 'address':
        return (
          <AddressDetailsStepScreen
            onContinue={handleAddressDetailsNext}
            onBack={handlePrevStep}
            initialData={draftData.addressDetails}
            isLoading={isSaving}
          />
        );
      case 'contact':
        return (
          <EmergencyContactStepScreen
            onContinue={handleEmergencyContactNext}
            onBack={handlePrevStep}
            initialData={draftData.emergencyContactDetails}
            isLoading={isSaving}
          />
        );
      case 'employment':
        return (
          <EmploymentDetailsStepScreen
            onSubmit={handleEmploymentSubmit}
            onBack={handlePrevStep}
            initialData={draftData.employmentDetails}
            isLoading={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return renderStepComponent();
}
