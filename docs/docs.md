# Documentación

## Diagrama de Clases

```mermaid
classDiagram

class Claim {
  - issue: string
  - description: string
  - category: ClaimCategory
  - date: Date
  - history: ClaimHistory[]
  - priority: Priority
  - client: User
  - claimResolver: User
  - cancellation: ClaimCancellation
  - project: Project
  - area: Area
  - subArea: SubArea
  - criticality: ClaimCriticality
  - comments: ClaimComment[]
  - rating: ClaimRating
  - resolvedDate: Date
  - resolvedComment: string
  - addHistoryEntry(entry: ClaimHistory) void
  - assignResolver(resolver: User) void
  + changeIssue(issue: string) void
  + changeDescription(description: string) void
  + changeCategory(category: ClaimCategory) void
  + changeDate(date: Date) void
  + start() void
  + resolve(resolver: User) void
  + cancel() void
  + changePriority(priority: Priority) void
  + changeArea(area: Area) void
  + changeCriticality(criticality: ClaimCriticality) void
  + addComment(comment: ClaimComment) void
  + removeComment(comment: ClaimComment) void
}

class ClaimCriticality {
  - level: string
  - description: string
  + changeLevel(level: string) void
  + changeDescription(description: string) void
}

class ClaimComment {
  - content: string
  - author: User
  - date: Date
  + changeContent(content: string) void
}

class ClaimRating {
  - score: number
  - date: Date
  - category: RatingCategory
  - feedback: string
  + changeScore(score: number) void
  + changeFeedback(feedback: string) void
}

class RatingCategory {
  - name: string
  - description: string
  + changeName(name: string) void
  + changeDescription(description: string) void
}

class ClaimCancellation {
  - name: string
  - description: string
  + changeName(name: string) void
  + changeDescription(description: string) void
}

class Priority {
  - number: number
  - description: string
  + changeNumber(number: number) void
  + changeDescription(description: string) void
}

class Project {
  - name: string
  - description: string
  - areas: Area[]
  + changeName(name: string) void
  + changeDescription(description: string) void
  + addArea(area: Area) void
  + removeArea(area: Area) void
}

class UserProject {
  - user: User
  - project: Project
}

class Area {
  - name: string
  - description: string
  - subAreas: SubArea[]
  + changeName(name: string) void
  + changeDescription(description: string) void
  + addSubArea(subArea: SubArea) void
  + removeSubArea(subArea: SubArea) void
}

class SubArea {
  - name: string
  - description: string
  + changeName(name: string) void
  + changeDescription(description: string) void
}

class ClaimCategory {
  - name: string
  - description: string
  + changeName(name: string) void
  + changeDescription(description: string) void
}

class ClaimState {
  - name: string
  + isPending() bool
  + isInProgress() bool
  + isResolved() bool
  + isCancelled() bool
}

class ClaimHistory {
  - date: Date
  - description: string
  - state: ClaimState
  - changedBy: string
  - isClasified: boolean
}

class Role {
  - name: string
  + changeName(name: string) void
  + isAdmin() bool
  + isAreaManager() bool
  + isResolver() bool
  + isClient() bool
}

class User {
  - userId: string
  - name: string
  - email: string
  - phone: string
  - roles: Role[]
  + changeName(name: string) void
  + assignRole(role: Role) void
  + removeRole(role: Role) void
}

Claim --> "1..*" ClaimHistory
Claim --> "1" ClaimState

ClaimComment --> User
User --> "1..*" Role
User --> "1..*" Claim
User --> "0..*" UserProject

Claim --> "0..1" ClaimRating
ClaimRating --> "1" RatingCategory
ClaimHistory --> "1" ClaimState
Claim --> "1" Priority
Claim --> "0..1" ClaimCancellation
Claim --> "1" ClaimCategory
Claim --> "1" Project
Claim --> "1" Area
Claim --> "0..1" SubArea
Claim --> "1" ClaimCriticality
Claim --> "0..*" ClaimComment

Area --> "0..*" SubArea
Project --> "1..*" Area


note for ClaimHistory "Registra los cambios de estado de una reclamación"
```

## Notas de negocio, alcance y testing

### Reglas de negocio principales

- AreaManager: puede administrar reclamos en sus áreas y sub-áreas (asignar resolvers, cambiar sub-área, transferir entre áreas, cambiar prioridad/criticidad). Estas reglas están aplicadas en los casos de uso:
  - `AssignResolver` (src/module/tickets/application/useCases/assign-resolver.use-case.ts)
  - `AssignSubArea` (src/module/tickets/application/useCases/assign-subarea.use-case.ts)
  - `TransferArea` (src/module/tickets/application/useCases/transfer-area.use-case.ts)
- Resolver: solo puede ejecutar acciones operativas sobre reclamos de su área (iniciar, resolver, cancelar). Los métodos de dominio relevantes residen en `Claim` (start, resolve, cancel).
- Cliente: puede crear y editar su reclamo; en edición sólo puede cambiar descripción y área (política aplicada en `UpdateClaim`).
- `operatorId`: se propaga a los mutadores del agregado `Claim` y se registra en `ClaimHistory` para auditoría.

### Áreas que requieren revisión / lógicas incompletas

- Validación de alcance de `Resolver`: actualmente la autorización de resolver está soportada por `AssignResolver` y por comprobaciones de `UserArea`, pero conviene auditar todos los endpoints que cambian estado para asegurarse de que solo los resolvers autorizados pueden hacerlo.
- CRUD de SubAreas: los controladores y casos de uso existen (`CreateSubArea`, `UpdateSubArea`, etc.), pero conviene verificar en producción que apliquen la restricción "AreaManager gestiona sus sub-areas" en todos los flujos.
- Propagación de `operatorId`: la mayoría de mutadores aceptan `operatorId`, sin embargo revisar los controladores para asegurarse de que siempre pasan `user.id` desde `@UserFromRequest()`.

### Cobertura de testing y próximos pasos

- Ya hay pruebas unitarias amplias (47 suites, 169 tests en la sesión reciente). Añadí factories de roles en `test/shared/helpers/role-fakes.ts` para estandarizar mocks de roles.
- Falta aumentar cobertura de integración end-to-end para flujos clave:
  - Crear reclamo → asignar resolver → iniciar → resolver → calificar
  - Transferencia entre áreas y verificación de auditoría (`ClaimHistory.operatorId`)
  - Casos de error (permiso denegado) en endpoints reales (integración de controladores + servicios)

Recomendación: añadir 3-4 tests de integración que recorran los flujos anteriores usando providers de prueba (mocks/DB en memoria o repositorios fake) para garantizar reglas de negocio end-to-end.
