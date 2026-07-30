import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useLoansViewModel() {
  const router = useRouter();

  const [loanIndex, setLoanIndex] = useState(0);
  const [payEmiModalVisible, setPayEmiModalVisible] = useState(false);
  const [statementSentMessage, setStatementSentMessage] = useState('');

  const handleRequestStatement = () => {
    setStatementSentMessage('E-Statement sent to your registered email!');
    setTimeout(() => setStatementSentMessage(''), 3000);
  };

  return {
    loanIndex,
    setLoanIndex,
    payEmiModalVisible,
    setPayEmiModalVisible,
    statementSentMessage,
    handleRequestStatement,
    navigateToHome: () => router.replace('/(main)/home'),
  };
}
