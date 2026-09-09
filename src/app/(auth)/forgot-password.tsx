import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthScaffold } from '@/components/AuthScaffold';
import { ConfigNotice } from '@/components/ConfigNotice';
import { FeedbackBanner } from '@/components/FeedbackBanner';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCooldown } from '@/hooks/useCooldown';
import { mapAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { recoverSchema, type RecoverValues } from '@/lib/validation';
import { colors } from '@/theme/tokens';

const NEUTRAL_SUCCESS = 'Si el email existe en nuestro sistema, vas a recibir instrucciones.';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const cooldown = useCooldown();
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setError,
  } = useForm<RecoverValues>({
    defaultValues: { email: params.email ?? '' },
    mode: 'onChange',
    resolver: zodResolver(recoverSchema),
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    if (!isSupabaseConfigured) {
      setError('root', { message: 'Falta configurar Supabase. Copiá .env.example a .env.' });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: Linking.createURL('reset-password'),
    });

    if (error) {
      const mapped = mapAuthError(error);
      if (mapped.kind === 'rate_limit') cooldown.start();
      setError('root', { message: mapped.message });
      return;
    }

    cooldown.start();
    router.replace({ pathname: '/forgot-password', params: { sent: '1', email } });
  });

  const sent = useLocalSearchParams<{ sent?: string }>().sent === '1';

  return (
    <AuthScaffold
      canGoBack
      footer={<Text onPress={() => router.replace('/login')} style={styles.link}>Volver a iniciar sesión</Text>}
      subtitle="Ingresá tu email y te enviaremos un enlace para elegir una contraseña nueva."
      title="Recuperar contraseña"
    >
      <ConfigNotice />
      {sent ? <FeedbackBanner message={NEUTRAL_SUCCESS} type="success" /> : null}
      {errors.root?.message ? <FeedbackBanner message={errors.root.message} /> : null}
      <Controller control={control} name="email" render={({ field, fieldState }) => (
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
          error={fieldState.error?.message}
          icon="mail-outline"
          keyboardType="email-address"
          label="Email"
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          onSubmitEditing={onSubmit}
          placeholder="nombre@ejemplo.com"
          returnKeyType="send"
          value={field.value}
        />
      )} />
      <PrimaryButton
        disabled={!isValid || cooldown.isCoolingDown}
        isLoading={isSubmitting}
        label={cooldown.isCoolingDown ? `Reenviar en ${cooldown.remaining}s` : 'Enviar instrucciones'}
        loadingLabel="Enviando…"
        onPress={onSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.primary, fontSize: 14, fontWeight: '800', textAlign: 'center' },
});

