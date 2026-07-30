import React from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth/presentation/session-provider';

export default function IndexRoute() {
  const { session } = useSession();
  return <Redirect href={session ? '/(main)/home' : '/login'} />;
}
