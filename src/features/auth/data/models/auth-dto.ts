import type { ExtendedUserProfile } from '@/core/services/secure-storage-service';

export interface LoginRequestDto {
  email: string;
  pass: string;
}

export interface RegisterRequestDto {
  fullName: string;
  cprNumber: string;
  mobileNumber: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  status: 'SUCCESS' | 'AUTH_FAILED' | 'MISSING_COLLECTION_RECORD' | 'INACTIVE_ACCOUNT';
  user?: ExtendedUserProfile;
  message?: string;
}
