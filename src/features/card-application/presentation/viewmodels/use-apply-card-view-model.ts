import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';
import { CardApplicationRemoteDataSource } from '@/features/card-application/data/datasources/card-application-remote-datasource';
import { CardApplicationRepositoryImpl } from '@/features/card-application/data/repositories/card-application-repository-impl';

const applyRepo = new CardApplicationRepositoryImpl(new CardApplicationRemoteDataSource());

export function useApplyCardViewModel() {
  const router = useRouter();
  const { session } = useSession();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const userAny = session as any;
  const [fullName, setFullName] = useState(userAny?.fullName || '');
  const [cprNumber, setCprNumber] = useState(userAny?.cprNumber || '');
  const [mobileNumber, setMobileNumber] = useState(userAny?.mobileNumber || '');
  const [email, setEmail] = useState(session?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const isStep1Valid = fullName.trim().length > 2 && cprNumber.trim().length >= 8 && mobileNumber.trim().length >= 8;

  const handleNext = () => {
    if (step === 1) {
      if (!isStep1Valid) {
        setBannerMessage('Please fill all required personal details correctly.');
        setBannerVisible(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2);
    } else {
      router.back();
    }
  };

  const handleSubmit = async (productType = 'Credit Card', productName = 'Klysavo Infinite Card') => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await applyRepo.apply({
        uid: session?.uid,
        fullName,
        cprNumber,
        mobileNumber,
        email,
        productType,
        productName,
        status: 'PENDING',
      });

      router.replace('/(main)/home');
    } catch (err) {
      console.warn('Submit application error:', err);
      setBannerMessage('Failed to submit application. Please try again.');
      setBannerVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    fullName,
    setFullName,
    cprNumber,
    setCprNumber,
    mobileNumber,
    setMobileNumber,
    email,
    setEmail,
    isSubmitting,
    bannerVisible,
    setBannerVisible,
    bannerMessage,
    isStep1Valid,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
