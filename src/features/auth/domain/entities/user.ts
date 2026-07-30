export type User = { id: string; fullName: string; phone: string; email?: string };
export type AuthSession = { accessToken: string; user: User };
