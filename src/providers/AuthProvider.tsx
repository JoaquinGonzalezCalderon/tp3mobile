import type { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { mapAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  recoveryReady: boolean;
  recoveryError: string | null;
  clearRecovery: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const RECOVERY_STORAGE_KEY = 'ibank.recovery-mode';

function getUrlParams(url: string) {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.search);
  const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  hashParams.forEach((value, key) => params.set(key, value));
  return params;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const handledUrl = useRef<string | null>(null);

  const handleDeepLink = useCallback(async (url: string | null) => {
    if (!url || handledUrl.current === url || !isSupabaseConfigured) return;
    handledUrl.current = url;

    try {
      const params = getUrlParams(url);
      const code = params.get('code');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
      }

      if (type === 'recovery') {
        await AsyncStorage.setItem(RECOVERY_STORAGE_KEY, 'true');
        setRecoveryReady(true);
        setRecoveryError(null);
        router.replace('/reset-password');
      }
    } catch (error) {
      setRecoveryReady(false);
      setRecoveryError(mapAuthError(error).message);
      router.replace('/reset-password');
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(RECOVERY_STORAGE_KEY),
    ]).then(([{ data }, recoveryMarker]) => {
      if (mounted) {
        setSession(data.session);
        setRecoveryReady(Boolean(data.session && recoveryMarker));
        setIsLoading(false);
      }
    });

    const { data: authSubscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);

      if (event === 'PASSWORD_RECOVERY') {
        AsyncStorage.setItem(RECOVERY_STORAGE_KEY, 'true');
        setRecoveryReady(true);
        setRecoveryError(null);
        router.replace('/reset-password');
      }
    });

    Linking.getInitialURL().then(handleDeepLink);
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
      linkingSubscription.remove();
      appStateSubscription.remove();
    };
  }, [handleDeepLink, router]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isLoading,
    recoveryReady,
    recoveryError,
    clearRecovery: () => {
      AsyncStorage.removeItem(RECOVERY_STORAGE_KEY);
      setRecoveryReady(false);
      setRecoveryError(null);
    },
  }), [isLoading, recoveryError, recoveryReady, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
