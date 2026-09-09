# Decisiones de implementación

## Diseño

Se tomó como referencia el frame `2:20347` del archivo iBank indicado en la consigna y las vistas públicas del mismo kit. Se mantuvo su lenguaje visual: superficies blancas, violeta como color principal, campos delineados, botones compactos con esquinas redondeadas y jerarquía tipográfica marcada.

El acceso automatizado al archivo de Figma no permitió inspeccionar propiedades internas. Por eso los valores se concentraron en `src/theme/tokens.ts`: colores, radios y espaciados pueden corregirse en un solo lugar al contrastar la app con Dev Mode. Las ilustraciones comerciales del kit no se incluyeron; se reemplazaron por iconografía de Expo para evitar agregar recursos sin licencia al repositorio.

## Arquitectura

- **Expo Router:** cada pantalla tiene una URL y los grupos `(auth)` y `(app)` aplican las reglas de acceso.
- **AsyncStorage:** se eligió porque es la opción documentada por Supabase para persistir la sesión completa en React Native. SecureStore tiene límites por valor que requieren fragmentar la sesión y no aporta una mejora simple para este alcance.
- **React Hook Form + Zod:** concentra las reglas de cliente y habilita cada submit solo cuando el formulario es válido.
- **AuthProvider:** mantiene la sesión, evita el parpadeo inicial, controla el auto-refresh y procesa enlaces de confirmación o recuperación.
- **Errores centralizados:** `src/lib/auth-errors.ts` evita que cada pantalla interprete de forma distinta los códigos de Supabase.

## Alcance

Se implementaron las cinco pantallas obligatorias y una Home mínima para demostrar rutas protegidas y logout. Login social, OTP como segundo factor, biometría, CAPTCHA y tabla `profiles` quedaron fuera del alcance obligatorio.

La configuración remota del dashboard no forma parte del bundle de la aplicación. Los valores necesarios y las Redirect URLs están documentados en el README, y las reglas reproducibles quedaron declaradas en `supabase/config.toml` para auditarlas y aplicarlas con Supabase CLI.
