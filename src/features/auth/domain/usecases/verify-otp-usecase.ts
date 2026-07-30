import type { AuthRepository, VerifyOtpRequest } from '@/features/auth/domain/repositories/auth-repository';
export const verifyOtp = (repository: AuthRepository, input: VerifyOtpRequest) => repository.verifyOtp(input);
