import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/services/firebase';

export interface CardApplicationPayload {
  uid?: string;
  fullName: string;
  cprNumber: string;
  mobileNumber: string;
  email: string;
  productType?: string;
  productName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ICardApplicationRemoteDataSource {
  submitApplication(payload: CardApplicationPayload): Promise<string>;
}

export class CardApplicationRemoteDataSource implements ICardApplicationRemoteDataSource {
  async submitApplication(payload: CardApplicationPayload): Promise<string> {
    const appsRef = collection(db, 'klysavo_applications');
    const newDoc = await addDoc(appsRef, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (payload.uid) {
      const userAppRef = doc(db, 'klysavo_users', payload.uid, 'applications', newDoc.id);
      await setDoc(userAppRef, {
        ...payload,
        id: newDoc.id,
        createdAt: serverTimestamp(),
      });
    }

    return newDoc.id;
  }
}
