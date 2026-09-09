import { Redirect, Stack } from 'expo-router';

import { FullScreenLoader } from '@/components/FullScreenLoader';
import { useAuth } from '@/providers/AuthProvider';

export default function AppLayout() {
  const { isLoading, recoveryReady, session } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  if (!session) return <Redirect href="/login" />;
  if (recoveryReady) return <Redirect href="/reset-password" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
