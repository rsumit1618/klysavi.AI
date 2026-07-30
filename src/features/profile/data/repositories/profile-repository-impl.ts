import type { IProfileRepository } from '../../domain/repositories/profile-repository';
import type { IProfileRemoteDataSource } from '../datasources/profile-remote-datasource';
import {
  saveUserDataToSecureStore,
  getUserDataFromSecureStore,
  type ExtendedUserProfile,
  type UserAddress
} from '@/core/services/secure-storage-service';

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private remoteDataSource: IProfileRemoteDataSource) {}

  async updateProfileImage(uid: string, base64Image: string): Promise<ExtendedUserProfile> {
    // 1. Update Remote
    await this.remoteDataSource.updateProfileImage(uid, base64Image);

    // 2. Update Local
    const current = await getUserDataFromSecureStore();
    const updated: ExtendedUserProfile = {
      ...(current || { uid } as ExtendedUserProfile),
      profileImage: base64Image,
    };
    await saveUserDataToSecureStore(updated);

    return updated;
  }

  async updateAddress(uid: string, address: UserAddress): Promise<ExtendedUserProfile> {
    // 1. Update Remote
    await this.remoteDataSource.updateAddress(uid, address);

    // 2. Update Local
    const current = await getUserDataFromSecureStore();
    const updated: ExtendedUserProfile = {
      ...(current || { uid } as ExtendedUserProfile),
      address: address,
    };
    await saveUserDataToSecureStore(updated);

    return updated;
  }

  async getProfile(uid: string): Promise<ExtendedUserProfile | null> {
    const local = await getUserDataFromSecureStore();
    if (local && local.uid === uid) {
      return local;
    }
    return this.syncLocalWithRemote(uid);
  }

  async syncLocalWithRemote(uid: string): Promise<ExtendedUserProfile | null> {
    const remote = await this.remoteDataSource.getUserProfile(uid);
    if (remote) {
      await saveUserDataToSecureStore(remote);
    }
    return remote;
  }
}
