import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthScaffold } from '@/components/AuthScaffold';
import { CheckRow } from '@/components/CheckRow';
import { ConfigNotice } from '@/components/ConfigNotice';
import { FeedbackBanner } from '@/components/FeedbackBanner';
import { FormField } from '@/components/FormField';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCooldown } from '@/hooks/useCooldown';
import { mapAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { registerSchema, type RegisterValues } from '@/lib/validation';
import { colors } from '@/theme/tokens';

export default function RegisterScreen() {
  const router = useRouter();
  const cooldown = useCooldown();
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setError,
    watch,
  } = useForm<RegisterValues>({
    defaultValues: { acceptedTerms: false, confirmPassword: '', email: '', name: '', password: '' },
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });
  const password = watch('password');

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured) {
      setError('root', { message: 'Falta configurar Supabase. Copiá .env.example a .env.' });
      return;
    }

    const email = values.email.trim().toLowerCase();
    const { error } = await supabase.auth.signUp({
      email,
      password: values.password,
      options: {
        data: { full_name: values.name.trim() },
        emailRedirectTo: Linking.createURL('confirm'),
      },
    });

    if (error) {
      const mapped = mapAuthError(error);
      if (mapped.kind === 'user_exists') {
        router.replace({ pathname: '/confirm', params: { email } });
        return;
      }
      if (mapped.kind === 'rate_limit') cooldown.start();
      setError('root', { message: mapped.message });
      return;
    }

    router.replace({ pathname: '/confirm', params: { email } });
  });

  return (
    <AuthScaffold
      canGoBack
      footer={<Text style={styles.footer}>¿Ya tenés cuenta? <Link href="/login" style={styles.link}>Iniciá sesión</Link></Text>}
      subtitle="Creá tu cuenta y empezá a manejar tu dinero."
      title="Crear una cuenta"
    >
      <ConfigNotice />
      {errors.root?.message ? <FeedbackBanner message={errors.root.message} /> : null}
      <Controller control={control} name="name" render={({ field, fieldState }) => (
        <FormField
          autoCapitalize="words"
          autoComplete="name"
          editable={!isSubmitting}
          error={fieldState.error?.message}
          icon="person-outline"
          label="Nombre completo"
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          placeholder="Tu nombre"
          value={field.value}
        />
      )} />
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
          placeholder="nombre@ejemplo.com"
          value={field.value}
        />
      )} />
      <Controller control={control} name="password" render={({ field, fieldState }) => (
        <FormField
          autoComplete="new-password"
          editable={!isSubmitting}
          error={fieldState.error?.message}
          icon="lock-closed-outline"
          label="Contraseña"
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          password
          placeholder="Creá una contraseña"
          value={field.value}
        />
      )} />
      <PasswordChecklist password={password} />
      <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => (
        <FormField
          autoComplete="new-password"
          editable={!isSubmitting}
          error={fieldState.error?.message}
          icon="shield-checkmark-outline"
          label="Confirmar contraseña"
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          onSubmitEditing={onSubmit}
          password
          placeholder="Repetí la contraseña"
          value={field.value}
        />
      )} />
      <Controller control={control} name="acceptedTerms" render={({ field, fieldState }) => (
        <>
          <CheckRow checked={field.value} disabled={isSubmitting} onChange={field.onChange} />
          {fieldState.error?.message ? <Text style={styles.error}>{fieldState.error.message}</Text> : null}
        </>
      )} />
      <PrimaryButton
        disabled={!isValid || cooldown.isCoolingDown}
        isLoading={isSubmitting}
        label={cooldown.isCoolingDown ? `Reintentá en ${cooldown.remaining}s` : 'Crear cuenta'}
        loadingLabel="Creando cuenta…"
        onPress={onSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  footer: { color: colors.muted, fontSize: 14, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: '800' },
  error: { color: colors.danger, fontSize: 12 },
});
