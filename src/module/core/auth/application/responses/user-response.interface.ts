import { UserMetadata } from '@supabase/supabase-js';

export interface ApplicationUserResponse {
  access_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    user_metadata?: UserMetadata;
  };
  roles: string[];
}
