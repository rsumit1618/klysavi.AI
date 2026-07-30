import type { ExtendedUserProfile, UserAddress } from '@/core/services/secure-storage-service';

export interface IProfileRepository {
  updateProfileImage(uid: string, base64Image: string): Promise<ExtendedUserProfile>;
  updateAddress(uid: string, address: UserAddress): Promise<ExtendedUserProfile>;
  getProfile(uid: string): Promise<ExtendedUserProfile | null>;
  syncLocalWithRemote(uid: string): Promise<ExtendedUserProfile | null>;
}
