import { Injectable } from '@nestjs/common';

// NOTE: Firebase was removed from the project. This class remains as a
// lightweight compatibility token so older tests/imports don't fail at
// module resolution. It does not perform any Firebase operations. Tests
// should provide a mock for this provider when needed, and application
// code should use SupabaseService / TypeORM repositories instead.

@Injectable()
export class FirebaseService {
  constructor() {}

  // Placeholder methods to allow tests that mock this service to keep working.
  getClient() {
    return null as any;
  }

  handleError(_: any) {
    throw new Error(
      'FirebaseService has been removed; use SupabaseService.handleError instead',
    );
  }
}
