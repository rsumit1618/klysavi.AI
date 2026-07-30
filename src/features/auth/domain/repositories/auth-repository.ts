import type { AuthSession, User } from '@/features/auth/domain/entities/user';
export type OtpRequest = { requestId: string; expiresAt: string };
export type PhoneAuthRequest = { phone: string };
export type RegisterRequest = PhoneAuthRequest & Pick<User, 'fullName' | 'email'>;
export type VerifyOtpRequest = PhoneAuthRequest & { code: string; requestId: string };
export interface AuthRepository { requestOtp(input: PhoneAuthRequest): Promise<OtpRequest>; register(input: RegisterRequest): Promise<OtpRequest>; verifyOtp(input: VerifyOtpRequest): Promise<AuthSession>; }
