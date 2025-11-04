import { User } from '@supabase/supabase-js';
import { fakeApplicationUser } from './user.fake';

export const fakeAdminUser: User = {
  ...fakeApplicationUser,
  id: 'admin-uuid-0001',
  user_metadata: {
    ...(fakeApplicationUser.user_metadata || {}),
    roles: ['admin'],
  },
};
