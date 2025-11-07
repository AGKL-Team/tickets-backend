import { User } from '@supabase/supabase-js';
import { fakeApplicationUser } from './user.fake';

export const fakeAreaManagerUser: User = {
  ...fakeApplicationUser,
  id: 'area-manager-uuid-0001',
  user_metadata: {
    ...(fakeApplicationUser.user_metadata || {}),
    roles: ['areaManager'],
  },
};
