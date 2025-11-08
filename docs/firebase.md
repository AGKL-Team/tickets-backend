# Migración a Firebase (Supabase → Firebase Admin)

Este documento explica cómo se migró el proyecto de Supabase a Firebase (Firestore + Firebase Auth) y cómo configurar y ejecutar pruebas localmente.

Decisiones de diseño

- Implementamos una clase adaptadora que mantiene el nombre exportado original `SupabaseService` para minimizar cambios en la base de código. Internamente inicializa Firebase Admin y expone un cliente de Firestore y utilidades de Auth.
- La autenticación ahora usa tokens ID de Firebase verificados por Firebase Admin. Para el inicio de sesión (email/contraseña) usamos la API REST de Firebase Auth (requiere `FIREBASE_API_KEY`).
- Para pruebas proporcionamos un mock ligero en tiempo de ejecución para que los tests unitarios sigan ejecutándose sin conectarse a Firebase.

Archivos cambiados / añadidos

- `src/module/core/database/services/supabase.service.ts` — ahora es un adaptador que inicializa Firebase Admin y expone:
  - `getClient()` => cliente de Firestore (`admin.firestore()`)
  - `getUserFromToken(token)` => verifica un ID token y retorna `{ user }` (mantiene una forma similar a `auth.getUser` de Supabase)
  - `getUserByEmail(email)`, `createUser(email,password)` => wrappers alrededor de `admin.auth()`
  - `handleError(error)` => mapea errores de Firebase a `BadRequestException` de NestJS cuando corresponde
- `src/module/core/auth/infrastructure/guard/supabase-auth.guard.ts` — ahora usa `getUserFromToken` para verificar tokens
- `src/module/core/auth/infrastructure/services/auth.service.ts` — `signUp`/`signIn`/`ensureUserNotExists` adaptados a Firebase Admin y la API REST
- `__mocks__/firebase-admin.js` — mock en tiempo de ejecución para Jest, para ejecutar tests sin el SDK real de Firebase Admin
- `src/types/firebase-admin.d.ts` — declaración mínima ambient para TypeScript cuando el SDK real no está instalado

Entorno / credenciales

- Recomendado (producción/desarrollo): establecer `FIREBASE_SERVICE_ACCOUNT` con el JSON del service account, o configurar `GOOGLE_APPLICATION_CREDENTIALS` apuntando al archivo de clave JSON.
- Para el inicio de sesión usando la API REST, establecer `FIREBASE_API_KEY` (la Web API key de tu proyecto Firebase). Esto es necesario para `AuthService.signIn`.

Desarrollo local sin credenciales de Firebase

- Tests unitarios: incluimos `__mocks__/firebase-admin.js` para que Jest haga mock de Firebase Admin y los tests que dependen del adaptador `SupabaseService` se ejecuten.
- Si quieres ejecutar la aplicación localmente contra Firebase real, configura las variables de entorno descritas arriba.

Pruebas y validación

1. Instalar dependencias nuevas:

```bash
npm install
```

2. Verificar tipos del proyecto:

```bash
npx tsc --noEmit
```

3. Ejecutar tests:

```bash
npx jest --runInBand --colors
```

Si algún test falla por diferencias en las expectativas sobre la API del cliente de Supabase, adapta el test correspondiente para usar el helper del adaptador `getUserFromToken` o haz mock directo de los métodos del `SupabaseService`.

Notas de migración y siguientes pasos

- Preservamos el nombre de exportación `SupabaseService` como adaptador para mantener los cambios mínimos. Con el tiempo, puede convenir renombrarlo a `FirebaseService` y actualizar las importaciones para mayor claridad.
- Considerar agregar un `config/firebase.config.ts` para centralizar la configuración y cargarla mediante `@nestjs/config`.
- Algunas funcionalidades (por ejemplo, SQL personalizado vía RPC de Supabase) no tienen equivalentes directos en Firestore — esas rutas de código requieren una migración a medida.
- Opcionalmente, remover `@supabase/supabase-js` de `package.json` cuando estés seguro de que no queda código que lo use.

Si quieres, puedo ahora:

- Guardar esta traducción en `docs/firebase.md` (ya la reemplacé en este archivo).
- Ejecutar la comprobación de tipos (`npx tsc --noEmit`) y la suite de tests (`npx jest --runInBand`) y corregir cualquier fallo restante.

Si quieres que ejecute la validación completa ahora, confirma y la correré.
