# iBank — flujo de autenticación con Supabase

Aplicación Expo/React Native que implementa el TP3 de Arquitectura y Programación Móvil: inicio de sesión, registro, confirmación pendiente, recuperación y definición de una contraseña nueva, conectados con Supabase Auth.

## Requisitos

- Node.js 20 o superior
- npm
- Expo Go o un emulador Android/iOS
- Un proyecto de Supabase

## Instalación

```bash
npm install
copy .env.example .env
```

Completá `.env` con la URL y la clave `anon`/`publishable` de tu proyecto. Las variables `EXPO_PUBLIC_` quedan incluidas en la aplicación cliente: nunca uses aquí la clave `service_role`.

Para iniciar el proyecto:

```bash
npm start
```

Después podés presionar `a` para Android, `i` para iOS en macOS o `w` para web. También están disponibles `npm run android`, `npm run ios` y `npm run web`.

## Configuración de Supabase

El repositorio incluye `supabase/config.toml` con las reglas de Auth del TP. Para aplicarlas nuevamente sobre un proyecto propio:

```bash
npx supabase login
npx supabase config push --project-ref TU_PROJECT_REF
```

En **Authentication** del dashboard:

1. Activá **Confirm email**.
2. Definí una contraseña mínima de 8 caracteres y exigí mayúscula, minúscula, número y símbolo.
3. Usá una expiración de enlace/OTP de 3600 segundos o menos.
4. Conservá el cooldown de 60 segundos para signup y recovery.
5. Agregá estas Redirect URLs en **URL Configuration**:

```text
ibanktp://confirm
ibanktp://reset-password
http://localhost:8081/confirm
http://localhost:8081/reset-password
```

Durante el desarrollo con Expo Go, `Linking.createURL` puede generar una URL `exp://`. Revisá el valor mostrado por tu sesión de Expo y agregalo temporalmente a la allowlist. Para validar el scheme real de punta a punta, usá un development build.

Supabase incluye un proveedor de email con límites bajos para pruebas. Configurá SMTP propio antes de usar la app en producción. La protección de contraseñas filtradas requiere un plan compatible.

## Flujo y seguridad

- La sesión se guarda en AsyncStorage, siguiendo el quickstart de Supabase para React Native.
- El refresh token se renueva solo mientras la app está activa.
- Las rutas de autenticación y Home se protegen según la sesión, sin mostrar brevemente una pantalla incorrecta.
- Los errores de Supabase se traducen en un único módulo y los mensajes evitan enumerar usuarios.
- Signup, reenvío y recovery aplican un cooldown visual de 60 segundos.
- El formulario de contraseña nueva solo se habilita con una sesión de recuperación válida.
- Después de actualizar la contraseña se cierra la sesión temporal y se vuelve al login.
- El código no registra contraseñas ni tokens.

## Verificación

```bash
npm run typecheck
npx expo export --platform web
```

El flujo debe probarse en Android o iOS con un proyecto Supabase real. iOS no fue probado en este entorno Windows.

## Estructura

```text
src/app/          rutas y pantallas de Expo Router
src/components/   componentes reutilizables de formularios
src/hooks/        cooldown reutilizable
src/lib/          Supabase, validaciones y mapeo de errores
src/providers/    sesión, ciclo de vida y deep links
src/theme/        tokens visuales
```

Consultá [DECISIONES.md](./DECISIONES.md) para las adaptaciones de diseño y alcance.
