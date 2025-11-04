import { User } from '@supabase/supabase-js';
import { fakeApplicationUser } from './user.fake';

export const fakeClientUser: User = {
  ...fakeApplicationUser,
  id: 'client-uuid-0001',
  user_metadata: {
    ...(fakeApplicationUser.user_metadata || {}),
    roles: ['client'],
  },
};
