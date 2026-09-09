import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScaffold } from '@/components/AuthScaffold';
import { ConfigNotice } from '@/components/ConfigNotice';
import { FeedbackBanner } from '@/components/FeedbackBanner';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCooldown } from '@/hooks/useCooldown';
import { mapAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { loginSchema, type LoginValues } from '@/lib/validation';
import { colors, spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { success } = useLocalSearchParams<{ success?: string }>();
  const cooldown = useCooldown();
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setError,
    watch,
  } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const email = watch('email');

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured) {
      setError('root', { message: 'Falta configurar Supabase. Copiá .env.example a .env.' });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });

    if (!error) {
      router.replace('/home');
      return;
    }

    const mapped = mapAuthError(error);
    if (mapped.kind === 'email_not_confirmed') {
      router.replace({ pathname: '/confirm', params: { email: values.email.trim().toLowerCase() } });
      return;
    }
    if (mapped.kind === 'rate_limit') cooldown.start();
    setError('root', { message: mapped.message });
  });

  const rootError = errors.root?.message;
  const disabled = !isValid || isSubmitting || cooldown.isCoolingDown;

  return (
    <AuthScaffold
      footer={(
        <Text style={styles.footerText}>
          ¿Todavía no tenés una cuenta?{' '}
          <Link href="/register" style={styles.link}>Registrate</Link>
        </Text>
      )}
      subtitle="Ingresá tus datos para acceder a tu cuenta."
      title="Bienvenido de nuevo"
    >
      <ConfigNotice />
      {success ? <FeedbackBanner message={success} type="success" /> : null}
      {rootError ? <FeedbackBanner message={rootError} /> : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            editable={!isSubmitting}
            error={error?.message}
            icon="mail-outline"
            keyboardType="email-address"
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="nombre@ejemplo.com"
            returnKeyType="next"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <FormField
            autoComplete="password"
            editable={!isSubmitting}
            error={error?.message}
            icon="lock-closed-outline"
            label="Contraseña"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={onSubmit}
            password
            placeholder="Ingresá tu contraseña"
            returnKeyType="done"
            value={value}
          />
        )}
      />

      <Pressable
        accessibilityRole="link"
        disabled={isSubmitting}
        onPress={() => router.push({ pathname: '/forgot-password', params: { email } })}
        style={styles.forgot}
      >
        <Text style={styles.link}>Olvidé mi contraseña</Text>
      </Pressable>

      <PrimaryButton
        disabled={disabled}
        isLoading={isSubmitting}
        label={cooldown.isCoolingDown ? `Reintentá en ${cooldown.remaining}s` : 'Iniciar sesión'}
        loadingLabel="Ingresando…"
        onPress={onSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', minHeight: 36, justifyContent: 'center' },
  link: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  footerText: { color: colors.muted, fontSize: 14, textAlign: 'center' },
});
