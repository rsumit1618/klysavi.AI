import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';
import { TransactionsRemoteDataSource } from '@/features/transactions/data/datasources/transactions-remote-datasource';
import { TransactionsRepositoryImpl } from '@/features/transactions/data/repositories/transactions-repository-impl';
import type { TransactionRecord } from '../screens/transactions-screen';

const txRepo = new TransactionsRepositoryImpl(new TransactionsRemoteDataSource());

export function useTransactionsViewModel() {
  const router = useRouter();
  const { session } = useSession();

  const [cardIndex, setCardIndex] = useState(0);
  const [frozenCards, setFrozenCards] = useState<Record<number, boolean>>({});
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payAmountText, setPayAmountText] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    const targetUid = session?.uid;
    if (!targetUid) return;

    const unsub = txRepo.observeTransactions(
      targetUid,
      (list) => setTransactions(list),
      (err) => console.warn('Transactions listener error:', err)
    );

    return () => unsub();
  }, [session?.uid]);

  const toggleFreeze = () => {
    setFrozenCards((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }));
  };

  const handlePayBill = async (amount: string) => {
    const num = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(num) || num <= 0 || !session?.uid) return;

    setIsSubmittingPay(true);
    try {
      await txRepo.payCardBill(session.uid, num);
      setPayModalVisible(false);
      setPayAmountText('');
    } catch (err) {
      console.warn('Pay bill error:', err);
    } finally {
      setIsSubmittingPay(false);
    }
  };

  return {
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
    transactions,
    navigateToHome: () => router.replace('/(main)/home'),
  };
}
