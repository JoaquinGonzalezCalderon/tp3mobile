import { z } from 'zod';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordChecks = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  symbol: /[^A-Za-z0-9]/.test(password),
});

export const isStrongPassword = (password: string) =>
  Object.values(passwordChecks(password)).every(Boolean);

export const loginSchema = z.object({
  email: z.string().trim().email('Ingresá un email válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});

export const recoverSchema = z.object({
  email: z.string().trim().email('Ingresá un email válido.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Ingresá tu nombre.'),
    email: z.string().trim().email('Ingresá un email válido.'),
    password: z.string().refine(isStrongPassword, 'La contraseña no cumple todos los requisitos.'),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine(Boolean, 'Tenés que aceptar los términos.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export const newPasswordSchema = z
  .object({
    password: z.string().refine(isStrongPassword, 'La contraseña no cumple todos los requisitos.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RecoverValues = z.infer<typeof recoverSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
