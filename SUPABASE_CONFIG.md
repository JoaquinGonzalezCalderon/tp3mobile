# Configuración de Supabase

Este documento registra la configuración de Supabase Auth utilizada/esperada para el TP3.

> Antes de entregar, verificar en el Dashboard remoto que estos valores coincidan con el proyecto real. El archivo `supabase/config.toml` funciona como referencia reproducible, pero no demuestra por sí solo el estado del Dashboard remoto.

## 1. Cliente

El cliente se crea en:

```text
src/lib/supabase.ts
```

Variables utilizadas:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Configuración de Auth del cliente:

```ts
auth: {
  storage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
}
```

## 2. Confirmación de email

Configuración esperada:

```text
Confirm email: activado
```

En `supabase/config.toml`:

```toml
[auth.email]
enable_confirmations = true
```

El registro envía un `emailRedirectTo` generado con:

```text
Linking.createURL('confirm')
```

## 3. Política de contraseñas

Configuración declarada:

```text
Longitud mínima: 8 caracteres
Mayúscula: obligatoria
Minúscula: obligatoria
Número: obligatorio
Símbolo: obligatorio
```

En `supabase/config.toml`:

```toml
minimum_password_length = 8
password_requirements = "lower_upper_letters_digits_symbols"
```

La misma política se valida del lado cliente en `src/lib/validation.ts`.

## 4. Confirmación de contraseña

Supabase no recibe un campo separado de confirmación.

La aplicación valida localmente que:

```text
password === confirmPassword
```

La regla se aplica tanto en registro como al definir una contraseña nueva.

## 5. Rate limits y cooldown

El proyecto declara un intervalo mínimo de 60 segundos entre emails de autenticación:

```toml
[auth.email]
max_frequency = "60s"
```

La interfaz también utiliza un cooldown visual de 60 segundos para:

- reenvío de confirmación;
- recuperación de contraseña;
- situaciones de rate limit en login/registro.

## 6. Expiración de OTP / enlaces

Configuración declarada:

```toml
otp_expiry = 3600
```

Esto equivale a:

```text
3600 segundos = 1 hora
```

## 7. Redirect URLs

Scheme de la aplicación:

```text
ibanktp
```

Definido en `app.json`.

Redirect URLs declaradas en `supabase/config.toml`:

```text
ibanktp://confirm
ibanktp://reset-password
http://localhost:8081/confirm
http://localhost:8081/reset-password
```

## 8. Expo Go

Durante pruebas con Expo Go, `Linking.createURL()` puede generar URLs con scheme `exp://`.

Si se utiliza Expo Go para probar confirmación o recuperación, se debe agregar temporalmente la URL generada por esa sesión a la allowlist de Redirect URLs de Supabase.

Para validar el scheme definitivo:

```text
ibanktp://
```

se recomienda un development build.

## 9. Recuperación de contraseña

La solicitud se realiza con:

```text
supabase.auth.resetPasswordForEmail()
```

Redirect:

```text
reset-password
```

El `AuthProvider` procesa:

- URLs entrantes;
- códigos de intercambio de sesión;
- access/refresh tokens;
- evento `PASSWORD_RECOVERY`.

La pantalla de nueva contraseña solo se habilita si existe un contexto de recuperación válido.

## 10. Actualización de contraseña

La contraseña nueva se guarda con:

```text
supabase.auth.updateUser({ password: nuevaPassword })
```

Después de actualizarla:

1. se ejecuta `signOut`;
2. se limpia el estado temporal de recuperación;
3. se redirige a Login;
4. se muestra un mensaje de éxito.

## 11. Persistencia y refresh

La sesión se guarda con AsyncStorage.

El auto-refresh se controla con `AppState`:

```text
active      -> startAutoRefresh()
background  -> stopAutoRefresh()
```

## 12. Claves y seguridad

En el cliente solo deben existir:

```text
Project URL
anon/publishable key
```

No debe incluirse:

```text
service_role
```

El `.env` se encuentra ignorado por Git.

## 13. Checklist del Dashboard antes de entregar

Marcar una vez verificado manualmente:

- [ ] Authentication por email habilitado.
- [ ] Confirm email activado.
- [ ] Longitud mínima de contraseña = 8.
- [ ] Mayúscula obligatoria.
- [ ] Minúscula obligatoria.
- [ ] Número obligatorio.
- [ ] Símbolo obligatorio.
- [ ] Expiración OTP/link = 3600 segundos o menos.
- [ ] Cooldown de emails = 60 segundos.
- [ ] `ibanktp://confirm` agregado a Redirect URLs.
- [ ] `ibanktp://reset-password` agregado a Redirect URLs.
- [ ] URLs necesarias de desarrollo agregadas durante las pruebas.
- [ ] No existe ninguna `service_role` key en el repositorio.
- [ ] Confirmación de email probada.
- [ ] Recuperación de contraseña probada.
