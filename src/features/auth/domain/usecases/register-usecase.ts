import type { AuthRepository, RegisterRequest } from '@/features/auth/domain/repositories/auth-repository';
export const requestRegistrationOtp = (repository: AuthRepository, input: RegisterRequest) => repository.register(input);
