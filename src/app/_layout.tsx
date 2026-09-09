import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/providers/AuthProvider';
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ animation: 'slide_from_right', headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
        <Stack.Screen name="reset-password" />
      </Stack>
    </AuthProvider>
  );
}
