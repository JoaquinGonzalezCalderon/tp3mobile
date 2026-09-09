import { Redirect, Stack } from 'expo-router';

import { FullScreenLoader } from '@/components/FullScreenLoader';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const { isLoading, recoveryReady, session } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  if (session) return <Redirect href={recoveryReady ? '/reset-password' : '/home'} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
