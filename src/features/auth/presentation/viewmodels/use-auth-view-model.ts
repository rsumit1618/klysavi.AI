import { useState, useRef, useEffect } from 'react';
import { BackHandler, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';
import { isValidEmail } from '@/core/utils/validators';
import { AuthRemoteDataSource } from '@/features/auth/data/datasources/auth-remote-datasource';
import { AuthLocalDataSource } from '@/features/auth/data/datasources/auth-local-datasource';
import { AuthRepositoryImpl } from '@/features/auth/data/repositories/auth-repository-impl';
import type { NoticeType } from '../components/auth-notice-modal';
import type { BannerType } from '@/shared/components/top-banner-notification';

const authRepo = new AuthRepositoryImpl(
  new AuthRemoteDataSource(),
  new AuthLocalDataSource()
);

export function useAuthViewModel() {
  const router = useRouter();
  const { signIn } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [modalNoticeType, setModalNoticeType] = useState<NoticeType>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<BannerType>('warning');

  const passwordInputRef = useRef<TextInput>(null);
  const lastBackPressTime = useRef<number>(0);

  const showTopBanner = (message: string, type: BannerType = 'warning') => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
  };

  useEffect(() => {
    const onBackPress = () => {
      const now = Date.now();
      if (lastBackPressTime.current && now - lastBackPressTime.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPressTime.current = now;
      showTopBanner('Press back again to exit app', 'warning');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setPassword('');
    }
  };

  const isFormValid = isValidEmail(email) && (!isEmailVerified || password.trim().length >= 6);

  const handleEmailContinue = async () => {
    if (!isValidEmail(email) || loading) return;
    setLoading(true);
    try {
      const exists = await authRepo.checkEmail(email);
      if (exists) {
        setIsEmailVerified(true);
      } else {
        showTopBanner('User not registered with us. Register now.', 'warning');
      }
    } catch (error) {
      showTopBanner('Unable to verify account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    try {
      const result = await authRepo.login(email, password);

      if (result.status === 'AUTH_FAILED') {
        setLoading(false);
        showTopBanner(result.message || 'The email or password you entered is incorrect.', 'error');
        return;
      }

      if (result.status === 'MISSING_COLLECTION_RECORD') {
        setLoading(false);
        showTopBanner('User not registered with us. Register now.', 'warning');
        return;
      }

      const user = result.user;
      if (!user || !user.status || user.status !== 'ACTIVE') {
        setLoading(false);
        setModalNoticeType('INACTIVE_ACCOUNT');
        return;
      }

      await signIn({ ...user, email: user.email || email });
      setLoading(false);
      showTopBanner(`Welcome back, ${user.fullName || 'User'}!`, 'success');
      setTimeout(() => {
        router.replace('/(main)/home');
      }, 500);
    } catch (error) {
      setLoading(false);
      showTopBanner('Failed to authenticate with Firebase. Please try again.', 'error');
    }
  };

  return {
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
    navigateToRegister: () => router.push('/register'),
  };
}
