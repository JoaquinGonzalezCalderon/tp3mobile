import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScaffold } from '@/components/AuthScaffold';
import { ConfigNotice } from '@/components/ConfigNotice';
import { FeedbackBanner } from '@/components/FeedbackBanner';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCooldown } from '@/hooks/useCooldown';
import { mapAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { colors, radius, spacing } from '@/theme/tokens';

export default function ConfirmScreen() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const cooldown = useCooldown();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'error' | 'success' } | null>({
    message: 'Revisá tu email para continuar.',
    type: 'success',
  });

  const resend = async () => {
    if (!email || !isSupabaseConfigured || loading || cooldown.isCoolingDown) return;
    setLoading(true);
    setFeedback(null);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: Linking.createURL('confirm') },
    });

    setLoading(false);
    if (error) {
      const mapped = mapAuthError(error);
      if (mapped.kind === 'rate_limit') cooldown.start();
      setFeedback({ message: mapped.message, type: 'error' });
      return;
    }

    cooldown.start();
    setFeedback({ message: 'Te enviamos un nuevo enlace de confirmación.', type: 'success' });
  };

  return (
    <AuthScaffold
      canGoBack
      footer={(
        <Pressable accessibilityRole="link" onPress={() => router.replace('/login')}>
          <Text style={styles.backToLogin}>Volver a iniciar sesión</Text>
        </Pressable>
      )}
      subtitle="Usá el enlace que te enviamos para activar tu cuenta."
      title="Confirmá tu email"
    >
      <View style={styles.illustration}>
        <View style={styles.mailCircle}>
          <Ionicons color={colors.primary} name="mail-unread-outline" size={48} />
        </View>
      </View>
      {email ? (
        <Text style={styles.copy}>Enviamos el enlace a <Text style={styles.email}>{email}</Text></Text>
      ) : (
        <FeedbackBanner message="Volvé al registro para indicar tu email." type="warning" />
      )}
      <ConfigNotice />
      {feedback ? <FeedbackBanner message={feedback.message} type={feedback.type} /> : null}
      <PrimaryButton
        disabled={!email || !isSupabaseConfigured || cooldown.isCoolingDown}
        isLoading={loading}
        label={cooldown.isCoolingDown ? `Reenviar en ${cooldown.remaining}s` : 'Reenviar email'}
        loadingLabel="Enviando…"
        onPress={resend}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  illustration: { alignItems: 'center', marginBottom: spacing.sm },
  mailCircle: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.pill, height: 112, justifyContent: 'center', width: 112 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 22, textAlign: 'center' },
  email: { color: colors.ink, fontWeight: '800' },
  backToLogin: { color: colors.primary, fontSize: 14, fontWeight: '800', textAlign: 'center' },
});

