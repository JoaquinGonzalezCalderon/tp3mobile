import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthScaffold } from '@/components/AuthScaffold';
import { FeedbackBanner } from '@/components/FeedbackBanner';
import { FormField } from '@/components/FormField';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { PrimaryButton } from '@/components/PrimaryButton';
import { mapAuthError } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';
import { newPasswordSchema, type NewPasswordValues } from '@/lib/validation';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/tokens';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { clearRecovery, recoveryError, recoveryReady } = useAuth();
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setError,
    watch,
  } = useForm<NewPasswordValues>({
    defaultValues: { confirmPassword: '', password: '' },
    mode: 'onChange',
    resolver: zodResolver(newPasswordSchema),
  });
  const password = watch('password');

  const onSubmit = handleSubmit(async ({ password: newPassword }) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError('root', { message: mapAuthError(error).message });
      return;
    }

    await supabase.auth.signOut();
    clearRecovery();
    router.replace({ pathname: '/login', params: { success: 'Tu contraseña se actualizó. Ya podés iniciar sesión.' } });
  });

  if (!recoveryReady) {
    return (
      <AuthScaffold
        footer={<Text onPress={() => router.replace('/forgot-password')} style={styles.link}>Solicitar un enlace nuevo</Text>}
        subtitle="Por seguridad, los enlaces de recuperación tienen una vigencia limitada."
        title="Enlace no válido"
      >
        <FeedbackBanner message={recoveryError ?? 'El enlace venció, ya fue utilizado o no es válido.'} />
        <PrimaryButton label="Pedir otro enlace" onPress={() => router.replace('/forgot-password')} />
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      subtitle="Elegí una contraseña segura que no hayas usado antes."
      title="Nueva contraseña"
    >
      {errors.root?.message ? <FeedbackBanner message={errors.root.message} /> : null}
      <Controller control={control} name="password" render={({ field, fieldState }) => (
        <FormField
          autoComplete="new-password"
          editable={!isSubmitting}
          error={fieldState.error?.message}
          icon="lock-closed-outline"
          label="Contraseña nueva"
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          password
          placeholder="Ingresá una contraseña"
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
          returnKeyType="done"
          value={field.value}
        />
      )} />
      <PrimaryButton
        disabled={!isValid}
        isLoading={isSubmitting}
        label="Guardar contraseña"
        loadingLabel="Guardando…"
        onPress={onSubmit}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.primary, fontSize: 14, fontWeight: '800', textAlign: 'center' },
});

