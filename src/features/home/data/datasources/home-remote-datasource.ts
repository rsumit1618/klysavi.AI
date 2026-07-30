import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/services/firebase';

export interface UserApplicationDoc {
  id: string;
  productType?: string;
  productName?: string;
  status?: string;
}

export interface IHomeRemoteDataSource {
  subscribeUserApplications(
    uid: string,
    onSuccess: (apps: UserApplicationDoc[]) => void,
    onError: (err: Error) => void
  ): () => void;
}

export class HomeRemoteDataSource implements IHomeRemoteDataSource {
  subscribeUserApplications(
    uid: string,
    onSuccess: (apps: UserApplicationDoc[]) => void,
    onError: (err: Error) => void
  ): () => void {
    try {
      const appsRef = collection(db, 'klysavo_users', uid, 'applications');
      return onSnapshot(
        appsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<UserApplicationDoc, 'id'>),
            }));
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
}
