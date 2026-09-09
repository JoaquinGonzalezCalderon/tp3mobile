# iBank — flujo de autenticación con Supabase

Trabajo Práctico 3 de **Arquitectura y Programación Móvil**.

Aplicación desarrollada con **React Native + Expo** que implementa el flujo completo de autenticación solicitado para iBank, utilizando **Supabase Auth** como backend.

## Funcionalidades implementadas

- Inicio de sesión con email y contraseña.
- Registro de usuario.
- Confirmación pendiente de email.
- Reenvío del email de confirmación.
- Recuperación de contraseña por email.
- Definición de una nueva contraseña desde un enlace de recuperación.
- Validaciones de formularios con React Hook Form + Zod.
- Checklist visual de requisitos de contraseña.
- Aceptación obligatoria de términos en el registro.
- Estados de carga y bloqueo de formularios durante requests.
- Manejo de rate limit con cooldown visual de 60 segundos.
- Mensajes de error centralizados y en español.
- Comportamiento anti-enumeración en registro y recuperación.
- Persistencia de sesión mediante AsyncStorage.
- Auto-refresh de sesión según el estado de la aplicación.
- Deep links para confirmación y recuperación.
- Rutas protegidas para separar autenticación y contenido privado.
- Logout mediante Supabase Auth.
- Home mínima para demostrar sesión válida, metadata del usuario y rutas protegidas.

## Stack técnico

- React Native 0.86
- Expo SDK 57
- Expo Router
- TypeScript
- Supabase JS v2
- React Hook Form
- Zod
- AsyncStorage
- Expo Linking
- React Native URL Polyfill

## Requisitos

- Node.js 20 o superior.
- npm.
- Expo Go, development build o emulador Android/iOS.
- Un proyecto de Supabase.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/JoaquinGonzalezCalderon/tp3mobile.git
cd tp3mobile
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de variables de entorno a partir del ejemplo.

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Completar `.env` con los datos públicos del proyecto Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_O_PUBLISHABLE_KEY
```

> Las variables `EXPO_PUBLIC_` forman parte de la aplicación cliente. La clave `service_role` nunca debe incluirse en la app ni subirse al repositorio.

El archivo `.env` está ignorado por Git.

## Ejecutar el proyecto

```bash
npm start
```

Desde Expo:

- `a` abre Android.
- `i` abre iOS en macOS.
- `w` abre la versión web.

También pueden utilizarse:

```bash
npm run android
npm run ios
npm run web
```

## Configuración de Supabase

El repositorio incluye `supabase/config.toml` con una configuración de Auth alineada al TP.

Configuración declarada:

- Confirmación de email activada.
- Contraseña mínima de 8 caracteres.
- Requisito de mayúscula, minúscula, número y símbolo.
- Cooldown de 60 segundos para emails de autenticación.
- Expiración de OTP/enlaces de 3600 segundos.
- Signup por email habilitado.
- Signup anónimo deshabilitado.
- Redirect URLs para confirmación y recuperación.

Redirect URLs declaradas:

```text
ibanktp://confirm
ibanktp://reset-password
http://localhost:8081/confirm
http://localhost:8081/reset-password
```

El scheme de la aplicación está definido en `app.json` como:

```text
ibanktp
```

Durante desarrollo con Expo Go, `Linking.createURL()` puede generar una URL `exp://`. Esa URL debe agregarse temporalmente a la allowlist del proyecto Supabase si se prueba el flujo desde Expo Go. Para validar el scheme `ibanktp://` de punta a punta se recomienda usar un development build.

> Importante: `supabase/config.toml` documenta la configuración esperada/reproducible. Antes de entregar conviene verificar que el proyecto remoto de Supabase tenga efectivamente los mismos valores.

La configuración completa está explicada en [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md).

## Flujo implementado

### 1. Inicio de sesión

El login utiliza `supabase.auth.signInWithPassword()`.

El botón solo se habilita cuando el email es válido y la contraseña no está vacía. Durante la request se bloquean los campos y se muestra el estado de carga.

Los errores se traducen mediante un módulo centralizado. Las credenciales inválidas muestran un mensaje genérico y un email no confirmado redirige a la pantalla de confirmación pendiente.

### 2. Registro

El registro utiliza `supabase.auth.signUp()` y guarda el nombre ingresado en `user_metadata.full_name`.

La contraseña debe cumplir:

- 8 caracteres como mínimo.
- Una letra mayúscula.
- Una letra minúscula.
- Un número.
- Un símbolo.

Además, la confirmación debe coincidir y el checkbox de términos es obligatorio.

El formulario muestra un checklist de contraseña en tiempo real.

### 3. Confirmación pendiente

Luego del registro se muestra el email al que se envió la confirmación.

El usuario puede reenviar el mensaje mediante `supabase.auth.resend()` y se aplica un cooldown visual de 60 segundos.

### 4. Recuperación de contraseña

Se utiliza `supabase.auth.resetPasswordForEmail()` con un deep link hacia `reset-password`.

Después del envío se muestra el mismo mensaje neutro independientemente de si el email existe o no:

> Si el email existe en nuestro sistema, vas a recibir instrucciones.

### 5. Nueva contraseña

La pantalla de nueva contraseña solo se habilita cuando existe una sesión de recuperación válida.

La aplicación procesa enlaces entrantes y el evento `PASSWORD_RECOVERY`. Al guardar la nueva contraseña se utiliza `supabase.auth.updateUser()`.

Después de actualizarla, la sesión temporal de recuperación se cierra y el usuario vuelve al login con un mensaje de éxito.

## Sesión y rutas protegidas

`AuthProvider` centraliza:

- Obtención de la sesión inicial.
- Persistencia de sesión.
- Escucha de cambios de autenticación.
- Deep links.
- Recuperación de contraseña.
- Auto-refresh según foreground/background.

Las rutas se separan en dos grupos:

```text
src/app/(auth)   pantallas públicas de autenticación
src/app/(app)    pantallas que requieren una sesión válida
```

Mientras se resuelve la sesión inicial se muestra un loader, evitando un parpadeo incorrecto del login.

## Manejo de errores

Los errores de Supabase se traducen en `src/lib/auth-errors.ts` para evitar duplicar lógica entre pantallas.

Se contemplan, entre otros:

- Credenciales inválidas.
- Email no confirmado.
- Rate limit.
- Contraseña débil.
- Usuario existente.
- Errores de red.
- Link vencido o inválido.

## Seguridad

- No se registran contraseñas ni tokens en consola.
- `.env` no se versiona.
- Solo se utiliza la clave pública `anon/publishable` en el cliente.
- La `service_role` no se incluye en la aplicación.
- Los formularios no permiten doble envío durante una request.
- Los mensajes sensibles evitan revelar si una cuenta existe.

## Verificación técnica

Para comprobar TypeScript:

```bash
npm run typecheck
```

Para verificar que Expo pueda generar la versión web:

```bash
npx expo export --platform web
```

## Plataforma probada

Completar antes de la entrega con la prueba real realizada:

```text
Plataforma probada: ____________________
Dispositivo / emulador: _______________
Resultado: _____________________________
```

La consigna exige probar el flujo al menos en Android o iOS y documentar si no se probó en la otra plataforma.

## Estructura del proyecto

```text
src/app/          rutas y pantallas de Expo Router
src/components/   componentes reutilizables de formularios
src/hooks/        hooks reutilizables, incluido cooldown
src/lib/          cliente Supabase, validaciones y errores
src/providers/    sesión, ciclo de vida y deep links
src/theme/        tokens visuales
supabase/         configuración reproducible de Supabase
```

## Documentación de entrega

- [DECISIONES.md](./DECISIONES.md): decisiones de diseño, arquitectura, adaptaciones y alcance.
- [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md): configuración de Authentication utilizada.
- [EVIDENCIAS.md](./EVIDENCIAS.md): guía de capturas y pruebas a adjuntar para la entrega.
- [ENTREGA.md](./ENTREGA.md): checklist final antes de presentar.

## Alcance no implementado

De acuerdo con la consigna, quedaron fuera del alcance obligatorio:

- Login social.
- Segundo factor mediante OTP.
- PIN local.
- Biometría.
- CAPTCHA.
- Tabla pública `profiles`.
