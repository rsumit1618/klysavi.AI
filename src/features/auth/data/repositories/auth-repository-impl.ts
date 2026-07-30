import type { IAuthRemoteDataSource } from '../datasources/auth-remote-datasource';
import type { IAuthLocalDataSource } from '../datasources/auth-local-datasource';
import type { ExtendedUserProfile } from '@/core/services/secure-storage-service';

export class AuthRepositoryImpl {
  constructor(
    private remoteDataSource: IAuthRemoteDataSource,
    private localDataSource: IAuthLocalDataSource
  ) {}

  async checkEmail(email: string): Promise<boolean> {
    return this.remoteDataSource.checkEmailExists(email);
  }

  async login(email: string, pass: string) {
    const res = await this.remoteDataSource.loginWithEmailPassword(email, pass);
    if (res.status === 'SUCCESS' && res.user) {
      await this.localDataSource.saveUserSession(res.user);
    }
    return res;
  }

  async register(user: Omit<ExtendedUserProfile, 'uid' | 'createdAt'>) {
    const newUser = await this.remoteDataSource.registerUser(user);
    await this.localDataSource.saveUserSession(newUser);
    return newUser;
  }

  async logout(): Promise<void> {
    await this.localDataSource.clearUserSession();
  }
}
