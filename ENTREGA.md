# Checklist final de entrega

Basado en la consigna del TP3.

## 1. Repositorio

- [x] Código fuente subido.
- [x] `.env.example` incluido.
- [x] `.env` ignorado.
- [x] README con instalación.
- [x] README con variables de entorno.
- [x] README con ejecución.
- [x] Arquitectura documentada.
- [x] Configuración de Supabase documentada.
- [x] Decisiones de implementación documentadas.

## 2. Cinco pantallas obligatorias

- [x] Login.
- [x] Registro.
- [x] Confirmación pendiente.
- [x] Recuperar contraseña.
- [x] Nueva contraseña.

## 3. Reglas principales verificadas en el código

- [x] Login con `signInWithPassword`.
- [x] Registro con `signUp`.
- [x] Reenvío con `resend`.
- [x] Recuperación con `resetPasswordForEmail`.
- [x] Cambio con `updateUser`.
- [x] Logout con `signOut`.
- [x] Persistencia con AsyncStorage.
- [x] Auto-refresh.
- [x] Deep links.
- [x] Rutas protegidas.
- [x] Errores centralizados.
- [x] Checklist de contraseña.
- [x] Confirmación de contraseña.
- [x] Términos obligatorios.
- [x] Cooldown visual.
- [x] Mensajes anti-enumeración.

## 4. Lo que falta completar manualmente

### Evidencias

- [ ] Captura Login.
- [ ] Captura error de Login.
- [ ] Captura Registro.
- [ ] Captura checklist de contraseña.
- [ ] Captura Confirmación pendiente.
- [ ] Captura Recuperación.
- [ ] Captura mensaje de recuperación enviado.
- [ ] Captura Nueva contraseña desde deep link.
- [ ] Captura Home autenticada.
- [ ] Captura del Dashboard de Supabase.

Ver `EVIDENCIAS.md`.

### Prueba real

- [ ] Probar el flujo completo en Android o iOS.
- [ ] Completar “Plataforma probada” en README.
- [ ] Probar persistencia cerrando y reabriendo la app.
- [ ] Probar confirmación de email de punta a punta.
- [ ] Probar recuperación de contraseña de punta a punta.

### Dashboard Supabase

- [ ] Verificar Confirm email.
- [ ] Verificar política de contraseña.
- [ ] Verificar expiración.
- [ ] Verificar cooldown.
- [ ] Verificar Redirect URLs.

Ver `SUPABASE_CONFIG.md`.

## 5. Antes de entregar

Ejecutar:

```bash
npm install
npm run typecheck
```

Opcionalmente verificar export web:

```bash
npx expo export --platform web
```

Después:

```bash
git status
git add .
git commit -m "docs: completar entregables TP3"
git push
```

## Resultado esperado

Cuando las evidencias y la prueba real estén completas, los cuatro entregables pedidos quedan cubiertos:

1. Repositorio + README.
2. Capturas o grabación.
3. Documento de decisiones.
4. Configuración de Supabase documentada.
