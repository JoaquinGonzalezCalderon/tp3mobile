# Decisiones de implementación

Este documento resume las decisiones tomadas para implementar el flujo de autenticación del TP3 de iBank con React Native, Expo y Supabase Auth.

## 1. Diseño y mapeo del Figma

Se tomó como referencia el frame `2:20347` del archivo iBank indicado en la consigna y el lenguaje visual del kit.

### Elementos trasladados al proyecto

Se mantuvo la estructura funcional y visual esperada para las cinco pantallas obligatorias:

1. Inicio de sesión.
2. Registro.
3. Confirmación pendiente.
4. Recuperación de contraseña.
5. Nueva contraseña.

También se conservaron patrones visuales comunes del kit:

- Superficies claras.
- Color principal violeta.
- Campos delineados.
- Botones redondeados.
- Jerarquía tipográfica marcada.
- Distribución mobile de los formularios.
- Estados de error, carga y deshabilitado.

Los valores de color, radios y espaciado se centralizaron en `src/theme/tokens.ts` para mantener consistencia entre pantallas y permitir ajustes globales.

## 2. Adaptaciones realizadas

### Iconografía

Las ilustraciones comerciales del kit no se incluyeron en el repositorio. En su lugar se utilizó iconografía provista por Expo/Ionicons para mantener una interfaz coherente sin agregar recursos externos no necesarios para el TP.

### Home

La consigna se concentra en autenticación. Se agregó una Home mínima únicamente para demostrar:

- acceso a una ruta protegida;
- lectura del usuario autenticado;
- uso del nombre almacenado en `user_metadata`;
- persistencia de sesión;
- cierre de sesión.

La Home no pretende implementar funcionalidad bancaria completa.

### Estados funcionales

Además de las vistas principales se incorporaron estados que son necesarios por las reglas de negocio:

- loading;
- botones deshabilitados;
- errores de formulario;
- errores de Supabase;
- cooldown;
- link de recuperación inválido o vencido;
- confirmación pendiente;
- mensaje de éxito después de cambiar la contraseña.

## 3. Arquitectura

### Expo Router

Se eligió Expo Router para organizar la navegación por archivos.

Las rutas se separaron en:

```text
src/app/(auth)
src/app/(app)
```

`(auth)` contiene las pantallas públicas y `(app)` las pantallas que requieren sesión.

Los layouts de ambos grupos verifican el estado de autenticación y redirigen según corresponda.

### AuthProvider

`src/providers/AuthProvider.tsx` centraliza el estado de autenticación.

Sus responsabilidades son:

- recuperar la sesión inicial;
- escuchar cambios de Auth;
- controlar el estado de carga inicial;
- procesar deep links;
- detectar `PASSWORD_RECOVERY`;
- manejar la sesión temporal de recuperación;
- iniciar o detener el auto-refresh según el estado de la app.

Esto evita repetir la lógica de sesión en cada pantalla.

### AsyncStorage

Se utilizó `@react-native-async-storage/async-storage` para persistir la sesión de Supabase en React Native.

El cliente tiene configurado:

```text
autoRefreshToken: true
persistSession: true
detectSessionInUrl: false
```

`detectSessionInUrl` queda desactivado porque los enlaces entrantes se procesan manualmente en React Native mediante Expo Linking.

### React Hook Form + Zod

Los formularios utilizan React Hook Form y Zod.

Esto permite:

- validar mientras el usuario escribe;
- centralizar esquemas;
- controlar `isValid`;
- mostrar errores por campo;
- evitar enviar formularios inválidos.

Las reglas están en `src/lib/validation.ts`.

### Errores centralizados

Los errores de Supabase se traducen en `src/lib/auth-errors.ts`.

Se centralizaron para mantener mensajes consistentes entre pantallas y evitar que cada componente dependa de los textos internos de Supabase.

Se contemplan:

- credenciales inválidas;
- email no confirmado;
- rate limit;
- contraseña débil;
- usuario existente;
- errores de red;
- links vencidos o inválidos.

## 4. Reglas de negocio implementadas

### Login

- Email válido.
- Contraseña obligatoria.
- Botón deshabilitado si el formulario no es válido.
- Inputs bloqueados durante la request.
- Error genérico para credenciales incorrectas.
- Redirección a confirmación pendiente si el email no fue confirmado.
- Cooldown visual ante rate limit.
- Navegación a Home con login exitoso.

### Registro

- Nombre.
- Email válido.
- Contraseña segura.
- Confirmación de contraseña.
- Checkbox de términos obligatorio.
- Checklist visual de contraseña.
- `full_name` guardado en `user_metadata`.
- `emailRedirectTo` generado con Expo Linking.
- Mensaje neutro ante cuenta existente.
- Navegación a confirmación pendiente.

### Confirmación

- Muestra el email utilizado.
- Reenvío mediante `supabase.auth.resend()`.
- Cooldown de 60 segundos.
- Mensajes de éxito y error.

### Recuperación

- Valida únicamente el formato del email.
- Usa `resetPasswordForEmail`.
- Genera redirect hacia `reset-password`.
- Muestra un mensaje neutro independientemente de si el email existe.
- Aplica cooldown de 60 segundos.

### Nueva contraseña

- Solo se habilita con una sesión de recuperación válida.
- Maneja links inválidos o vencidos con un estado propio.
- Aplica las mismas reglas de contraseña del registro.
- Exige confirmación.
- Actualiza con `updateUser`.
- Cierra la sesión temporal mediante `signOut`.
- Regresa al login con mensaje de éxito.

## 5. Seguridad

Se tomaron las siguientes decisiones:

- El `.env` no se versiona.
- El cliente solo recibe la `anon/publishable key`.
- La `service_role` no forma parte de la aplicación.
- No se imprimen contraseñas ni tokens.
- Los mensajes de recuperación no revelan si una cuenta existe.
- Las credenciales inválidas se informan con un mensaje genérico.
- Durante una request los formularios bloquean nuevos envíos.
- Las rutas privadas requieren una sesión válida.

## 6. Configuración de Supabase

La configuración reproducible se encuentra en `supabase/config.toml`.

Además se documenta en `SUPABASE_CONFIG.md`:

- política de contraseña;
- confirmación de email;
- expiración;
- cooldown;
- redirect URLs;
- claves permitidas en el cliente;
- consideraciones de Expo Go y development build.

## 7. Fuera de alcance

Quedaron fuera del alcance obligatorio:

- login social;
- OTP como segundo factor;
- PIN local;
- biometría;
- CAPTCHA;
- tabla pública `profiles`.

Estas funcionalidades no son necesarias para completar las cinco pantallas y reglas de autenticación exigidas por el TP.
