import { User } from '@supabase/supabase-js';
import { fakeApplicationUser } from './user.fake';

export const fakeResolverUser: User = {
  ...fakeApplicationUser,
  id: 'resolver-uuid-0001',
  user_metadata: {
    ...(fakeApplicationUser.user_metadata || {}),
    roles: ['resolver'],
  },
};
