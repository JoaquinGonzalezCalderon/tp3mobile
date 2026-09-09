import { Redirect } from 'expo-router';

import { FullScreenLoader } from '@/components/FullScreenLoader';
import { useAuth } from '@/providers/AuthProvider';

export default function Index() {
  const { isLoading, session } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  return <Redirect href={session ? '/home' : '/login'} />;
}

