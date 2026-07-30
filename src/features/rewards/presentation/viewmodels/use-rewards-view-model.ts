import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';

export function useRewardsViewModel() {
  const router = useRouter();
  const { session } = useSession();

  const [selectedReward, setSelectedReward] = useState<any | null>(null);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);

  const handleConfirmRedeem = () => {
    setRedeemModalVisible(false);
    router.push({
      pathname: '/redeem-success',
      params: {
        rewardTitle: selectedReward?.title || 'Reward Voucher',
        pointsCost: selectedReward?.points || '1,000',
      },
    });
  };

  return {
    session,
    selectedReward,
    setSelectedReward,
    redeemModalVisible,
    setRedeemModalVisible,
    handleConfirmRedeem,
    handleBack: () => router.back(),
  };
}
