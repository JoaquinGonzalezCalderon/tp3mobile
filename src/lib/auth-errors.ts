type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

export type AuthErrorKind =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'rate_limit'
  | 'weak_password'
  | 'user_exists'
  | 'network'
  | 'expired_link'
  | 'unknown';

export type MappedAuthError = {
  kind: AuthErrorKind;
  message: string;
};

export function mapAuthError(error: unknown): MappedAuthError {
  const authError = (error ?? {}) as AuthErrorLike;
  const code = authError.code?.toLowerCase() ?? '';
  const message = authError.message?.toLowerCase() ?? '';

  if (authError.status === 429 || code.includes('rate_limit') || message.includes('rate limit')) {
    return { kind: 'rate_limit', message: 'Demasiados intentos. Esperá un minuto antes de volver a intentar.' };
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return { kind: 'email_not_confirmed', message: 'Todavía falta confirmar tu email.' };
  }

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return { kind: 'invalid_credentials', message: 'Email o contraseña incorrectos.' };
  }

  if (code === 'weak_password' || message.includes('password should')) {
    return { kind: 'weak_password', message: 'La contraseña no cumple los requisitos de seguridad.' };
  }

  if (code === 'user_already_exists' || message.includes('already registered')) {
    return { kind: 'user_exists', message: 'Revisá tu email para continuar.' };
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('offline')
  ) {
    return { kind: 'network', message: 'No pudimos conectarnos. Revisá tu conexión e intentá otra vez.' };
  }

  if (
    code.includes('otp_expired') ||
    message.includes('expired') ||
    message.includes('invalid token')
  ) {
    return { kind: 'expired_link', message: 'El enlace venció o ya no es válido.' };
  }

  return { kind: 'unknown', message: 'Ocurrió un problema. Intentá nuevamente.' };
}
