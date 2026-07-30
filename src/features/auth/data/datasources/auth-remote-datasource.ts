import {
  checkEmailExistsInFirestore,
  checkUserExistsInFirebase,
  verifyEmailPasswordLogin,
  registerUserInFirebase,
} from '@/features/auth/services/firebase-auth-service';
import type { ExtendedUserProfile } from '@/core/services/secure-storage-service';

export interface IAuthRemoteDataSource {
  checkEmailExists(email: string): Promise<boolean>;
  checkUserExists(cpr: string, mobile: string, email: string): Promise<ExtendedUserProfile | null>;
  loginWithEmailPassword(
    email: string,
    pass: string
  ): Promise<{ status: string; user?: ExtendedUserProfile; message?: string }>;
  registerUser(user: Omit<ExtendedUserProfile, 'uid' | 'createdAt'>): Promise<ExtendedUserProfile>;
}

export class AuthRemoteDataSource implements IAuthRemoteDataSource {
  async checkEmailExists(email: string): Promise<boolean> {
    return checkEmailExistsInFirestore(email);
  }

  async checkUserExists(cpr: string, mobile: string, email: string): Promise<ExtendedUserProfile | null> {
    return checkUserExistsInFirebase(cpr, mobile, email);
  }

  async loginWithEmailPassword(email: string, pass: string) {
    return verifyEmailPasswordLogin(email, pass);
  }

  async registerUser(
    user: Omit<ExtendedUserProfile, 'uid' | 'createdAt'>
  ): Promise<ExtendedUserProfile> {
    return registerUserInFirebase(user);
  }
}
