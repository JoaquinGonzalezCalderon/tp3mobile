# Evidencias para la entrega

La consigna pide capturas de pantalla o una grabación corta mostrando las cinco pantallas y los flujos de error/éxito más relevantes.

Este archivo sirve como guía para preparar esa evidencia sin llenar el repositorio de capturas repetidas.

## Carpeta sugerida

Crear:

```text
docs/evidencias/
```

Nombres sugeridos:

```text
01-login.png
02-login-error.png
03-registro.png
04-registro-validaciones.png
05-confirmacion.png
06-recuperacion.png
07-recuperacion-enviada.png
08-nueva-password.png
09-home.png
10-dashboard-supabase.png
```

## Capturas mínimas recomendadas

### 1. Login

Debe verse:

- email;
- contraseña;
- botón de iniciar sesión;
- links de registro y recuperación.

Archivo sugerido:

```text
01-login.png
```

### 2. Error de login

Usar credenciales incorrectas y mostrar el mensaje genérico:

```text
Email o contraseña incorrectos.
```

Esto demuestra que no se revela cuál de los dos datos falló.

Archivo sugerido:

```text
02-login-error.png
```

### 3. Registro

Mostrar la pantalla con:

- nombre;
- email;
- contraseña;
- confirmación;
- términos.

Archivo sugerido:

```text
03-registro.png
```

### 4. Validaciones de contraseña

Escribir una contraseña parcialmente válida para que se vea el checklist en tiempo real.

Conviene que en la misma captura se note algún requisito cumplido y otro pendiente.

Archivo sugerido:

```text
04-registro-validaciones.png
```

### 5. Confirmación pendiente

Después de crear la cuenta, mostrar:

- email de destino;
- mensaje “Revisá tu email para continuar”;
- botón “Reenviar email”.

Si es posible, tomar otra captura durante el cooldown.

Archivo sugerido:

```text
05-confirmacion.png
```

### 6. Recuperar contraseña

Mostrar el formulario con el campo email.

Archivo sugerido:

```text
06-recuperacion.png
```

### 7. Recuperación enviada

Después de enviar, capturar el mensaje neutro:

```text
Si el email existe en nuestro sistema, vas a recibir instrucciones.
```

Archivo sugerido:

```text
07-recuperacion-enviada.png
```

### 8. Nueva contraseña

Abrir desde el enlace real recibido por email y mostrar:

- contraseña nueva;
- confirmación;
- checklist;
- botón guardar.

Esta captura es importante porque demuestra que el deep link funciona.

Archivo sugerido:

```text
08-nueva-password.png
```

### 9. Home autenticada

Después de iniciar sesión correctamente, mostrar Home.

Esto demuestra:

- sesión válida;
- ruta protegida;
- lectura de metadata;
- opción de logout.

Archivo sugerido:

```text
09-home.png
```

### 10. Dashboard de Supabase

No es estrictamente una de las cinco pantallas de la app, pero sirve para respaldar la configuración documentada.

Intentar capturar en una o dos imágenes:

- Confirm email.
- Password policy.
- Redirect URLs.
- Rate limits / email frequency si está visible.

Archivo sugerido:

```text
10-dashboard-supabase.png
```

## Pruebas funcionales que conviene realizar

Antes de sacar las capturas finales:

- [ ] Login con credenciales válidas.
- [ ] Login con credenciales inválidas.
- [ ] Registro con contraseña inválida.
- [ ] Registro con contraseña válida.
- [ ] Confirmación de email.
- [ ] Reenvío de confirmación.
- [ ] Recuperación con un email.
- [ ] Apertura del deep link de recuperación.
- [ ] Cambio de contraseña.
- [ ] Login con la contraseña nueva.
- [ ] Persistencia de sesión al cerrar y abrir la app.
- [ ] Logout.
- [ ] Usuario sin sesión no puede entrar a Home.
- [ ] Usuario con sesión no vuelve al Login normal.

## Grabación alternativa

En lugar de muchas capturas se puede entregar una grabación corta.

Orden sugerido:

1. Abrir Login.
2. Mostrar un login incorrecto.
3. Ir a Registro.
4. Mostrar checklist de contraseña.
5. Crear usuario.
6. Mostrar Confirmación pendiente.
7. Confirmar email.
8. Entrar a Home.
9. Cerrar sesión.
10. Ir a Recuperar contraseña.
11. Pedir el email de recuperación.
12. Abrir el enlace.
13. Definir contraseña nueva.
14. Volver a Login e ingresar con la contraseña nueva.

## Nota para el README

Después de probar el proyecto, completar:

```text
Plataforma probada: Android / iOS
Dispositivo / emulador: ...
Resultado: flujo completo validado / observaciones
```
