import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/services/firebase';
import type { TransactionRecord } from '@/features/transactions/presentation/screens/transactions-screen';

export interface ITransactionsRemoteDataSource {
  subscribeUserTransactions(
    uid: string,
    onSuccess: (transactions: TransactionRecord[]) => void,
    onError: (err: Error) => void
  ): () => void;
  createBillPaymentTransaction(uid: string, amountVal: number): Promise<string>;
}

export class TransactionsRemoteDataSource implements ITransactionsRemoteDataSource {
  subscribeUserTransactions(
    uid: string,
    onSuccess: (transactions: TransactionRecord[]) => void,
    onError: (err: Error) => void
  ): () => void {
    try {
      const txCollRef = collection(db, 'klysavo_users', uid, 'transactions');
      const txQuery = query(txCollRef, orderBy('createdAt', 'desc'));

      return onSnapshot(
        txQuery,
        (snapshot) => {
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
            onSuccess(list);
          } else {
            onSuccess([]);
          }
        },
        onError
      );
    } catch (e: any) {
      onError(e);
      return () => {};
    }
  }

  async createBillPaymentTransaction(uid: string, amountVal: number): Promise<string> {
    const txCollRef = collection(db, 'klysavo_users', uid, 'transactions');
    const newTxDoc = await addDoc(txCollRef, {
      merchant: 'Credit Card Bill Payment',
      time: 'Just now',
      amount: `+ BHD ${amountVal.toFixed(3)}`,
      foreignAmount: 'Bank Transfer Payment',
      type: 'CREDIT',
      createdAt: serverTimestamp(),
    });
    return newTxDoc.id;
  }
}
