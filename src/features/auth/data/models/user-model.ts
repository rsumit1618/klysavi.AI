import type { User } from '@/features/auth/domain/entities/user';
export type UserModel = { id: string; full_name: string; phone: string; email?: string };
export const toUser = (model: UserModel): User => ({ id: model.id, fullName: model.full_name, phone: model.phone, email: model.email });
