import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useInsuranceViewModel() {
  const router = useRouter();

  const [policyIndex, setPolicyIndex] = useState(0);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimSubmittedMessage, setClaimSubmittedMessage] = useState('');

  const handleFileClaim = () => {
    setClaimModalVisible(false);
    setClaimSubmittedMessage('Claim request submitted successfully!');
    setTimeout(() => setClaimSubmittedMessage(''), 3000);
  };

  return {
    policyIndex,
    setPolicyIndex,
    claimModalVisible,
    setClaimModalVisible,
    claimSubmittedMessage,
    handleFileClaim,
    navigateToHome: () => router.replace('/(main)/home'),
  };
}
