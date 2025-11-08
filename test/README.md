# Tickets - Tests

Este README explica la organización de los tests, convenciones y comandos útiles para ejecutar pruebas en este repositorio.

## Estructura

- `test/` - carpeta raíz de pruebas.
  - `integration/` - tests de integración (flujos end-to-end en memoria). Ej: `test/tickets/integration`.
  - `unit/` - tests unitarios por módulo/use-case.
  - `shared/` - fakes y helpers reutilizables para tests (p. ej. `test/shared/helpers/role-fakes.ts`).

Convención de nombres:

- `*.spec.ts` para archivos de prueba.
- `*.integration.spec.ts` para tests de integración.

## Ejecutar tests

- Ejecutar un test específico:

```bash
npx jest path/to/test/file.spec.ts --runInBand --colors
```

- Ejecutar todos los tests (rápido en CI/local):

```bash
npx jest --runInBand --colors
```

- Ejecutar solo una carpeta (ej. integración de tickets):

```bash
npx jest test/tickets/integration --runInBand --colors
```

## Comprobaciones TypeScript

- Antes de subir cambios o en CI se recomienda ejecutar:

```bash
npx tsc --noEmit
```

Si ves advertencias del tipo "async method has no await" en tests, revisa si la función realmente necesita `async`. En los fakes se prefirió devolver `Promise.resolve(...)` o retornar explícitamente `Promise` para evitar esa advertencia.

## Helpers y fakes recomendados

- `test/shared/helpers/role-fakes.ts`: fábricas para `Role`/`UserRole` usadas por muchos tests. Reutilízalas para crear usuarios con roles (admin, areaManager, resolver, client).
- Si necesitas crear fakes de servicios (p. ej. `ClaimService`, `RatingService`), preferir funciones que devuelvan `Promise` en lugar de `async` sin `await`:

```ts
const fakeService = {
  findById: (id: string) => Promise.resolve(...),
  save: (item) => Promise.resolve(item),
};
```

Esto mantiene las firmas asíncronas y evita advertencias del linter.

## Escribir tests de integración

- Ubicarlos en `test/<module>/integration/` y nombrarlos `*.integration.spec.ts`.
- Los tests de integración en este repo usan fakes en memoria (Maps) para persistencia y llaman a los casos de uso (use-cases) para simular flujos completos.
- Añade documentación encabezando el archivo con un resumen del flujo probado (ver ejemplo: `create-claim-flow.integration.spec.ts`).

## Buenas prácticas

- Usa los helpers de `test/shared` para evitar duplicación.
- Normaliza valores opcionales cuando asertes (ej. `history ?? []`) para evitar non-null assertions repetidas.
- Mantén los fakes pequeños y explícitos: implementa solo los métodos que el use-case necesita.

## Hooks y limpieza

- Para tests que mutan estado global compartido (rare en este repo), asegúrate de limpiar el estado entre pruebas (`beforeEach`, `afterEach`).

## CI / cobertura

- Para añadir cobertura o integrarlo en CI, puedes usar:

```bash
npx jest --coverage
```
