import {
  saveUserDataToSecureStore,
  getUserDataFromSecureStore,
  clearUserDataFromSecureStore,
  type ExtendedUserProfile,
} from '@/core/services/secure-storage-service';

export interface IAuthLocalDataSource {
  saveUserSession(user: ExtendedUserProfile): Promise<void>;
  getUserSession(): Promise<ExtendedUserProfile | null>;
  clearUserSession(): Promise<void>;
}

export class AuthLocalDataSource implements IAuthLocalDataSource {
  async saveUserSession(user: ExtendedUserProfile): Promise<void> {
    await saveUserDataToSecureStore(user);
  }

  async getUserSession(): Promise<ExtendedUserProfile | null> {
    return getUserDataFromSecureStore();
  }

  async clearUserSession(): Promise<void> {
    await clearUserDataFromSecureStore();
  }
}
