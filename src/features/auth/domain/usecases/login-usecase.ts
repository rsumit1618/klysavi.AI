import type { AuthRepository, PhoneAuthRequest } from '@/features/auth/domain/repositories/auth-repository';
export const requestLoginOtp = (repository: AuthRepository, input: PhoneAuthRequest) => repository.requestOtp(input);
