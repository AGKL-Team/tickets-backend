import { User } from '@supabase/supabase-js';
import { ClientResponse } from '../dto/client-response.dto';

export class UserMapper {
  static toResponse(user: User): ClientResponse {
    return {
      id: user.id,
      email: user.email || '',
      phone: user.phone || '',
    };
  }
}
