import type { ITransactionsRemoteDataSource } from '../datasources/transactions-remote-datasource';
import type { TransactionRecord } from '@/features/transactions/presentation/screens/transactions-screen';

export class TransactionsRepositoryImpl {
  constructor(private remoteDataSource: ITransactionsRemoteDataSource) {}

  observeTransactions(
    uid: string,
    onSuccess: (transactions: TransactionRecord[]) => void,
    onError: (err: Error) => void
  ): () => void {
    return this.remoteDataSource.subscribeUserTransactions(uid, onSuccess, onError);
  }

  async payCardBill(uid: string, amountVal: number): Promise<string> {
    return this.remoteDataSource.createBillPaymentTransaction(uid, amountVal);
  }
}
