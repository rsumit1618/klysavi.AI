import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';
import { HomeRemoteDataSource, UserApplicationDoc } from '@/features/home/data/datasources/home-remote-datasource';
import { HomeRepositoryImpl } from '@/features/home/data/repositories/home-repository-impl';

const homeRepo = new HomeRepositoryImpl(new HomeRemoteDataSource());

export function useHomeViewModel() {
  const router = useRouter();
  const { session } = useSession();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userApplications, setUserApplications] = useState<UserApplicationDoc[]>([]);

  useEffect(() => {
    const targetUid = session?.uid;
    if (!targetUid) return;

    const unsub = homeRepo.observeUserApplications(
      targetUid,
      (apps) => setUserApplications(apps),
      (err) => console.warn('Home apps listener error:', err)
    );

    return () => unsub();
  }, [session?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const isProductApplied = (productType: string): boolean => {
    return userApplications.some((app) => app.productType === productType || app.productName === productType);
  };

  return {
    session,
    activeBannerIndex,
    setActiveBannerIndex,
    menuVisible,
    setMenuVisible,
    refreshing,
    onRefresh,
    userApplications,
    isProductApplied,
    navigateToProfile: () => router.push('/user-profile'),
    navigateToApplyCard: () => router.push('/apply-card'),
    navigateToCalculator: () => router.push('/financial-calculator'),
    navigateToRewards: () => router.push('/redeem-rewards'),
  };
}
