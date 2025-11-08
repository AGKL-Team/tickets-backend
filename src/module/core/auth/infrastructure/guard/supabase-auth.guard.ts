// Backwards-compatibility shim: some modules and tests import
// `SupabaseAuthGuard`. Re-export the new Firebase-based guard under that
// name so the rest of the codebase keeps working while we migrate.
export { FirebaseAuthGuard as SupabaseAuthGuard } from './firebase-auth.guard';
