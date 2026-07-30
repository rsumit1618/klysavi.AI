import { db } from '@/core/api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { ExtendedUserProfile, UserAddress } from '@/core/services/secure-storage-service';

export interface IProfileRemoteDataSource {
  updateProfileImage(uid: string, base64Image: string): Promise<void>;
  updateAddress(uid: string, address: UserAddress): Promise<void>;
  getUserProfile(uid: string): Promise<ExtendedUserProfile | null>;
}

export class ProfileRemoteDataSourceImpl implements IProfileRemoteDataSource {
  private readonly collectionName = 'klysavo_users';

  async updateProfileImage(uid: string, base64Image: string): Promise<void> {
    const docRef = doc(db, this.collectionName, uid);
    await updateDoc(docRef, {
      profileImage: base64Image,
    });
  }

  async updateAddress(uid: string, address: UserAddress): Promise<void> {
    const docRef = doc(db, this.collectionName, uid);
    await updateDoc(docRef, {
      address: address,
    });
  }

  async getUserProfile(uid: string): Promise<ExtendedUserProfile | null> {
    const docRef = doc(db, this.collectionName, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ExtendedUserProfile;
    }
    return null;
  }
}
