import { FirebaseService } from '../../../src/module/core/database/services/firebase.service';

export const FirebaseTestProvider = {
  provide: FirebaseService,
  useValue: {
    getClient: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    }),
    handleError: FirebaseService.prototype.handleError,
  },
};
