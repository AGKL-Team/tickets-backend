import { Controller } from '@nestjs/common';
import { ClientResponse } from '../application/dto/client-response.dto';
import { UserMapper } from '../application/mappers/user-mapper';
import { UserRoleService } from '../infrastructure/services';

@Controller('users')
export class UserController {
  constructor(private readonly userRoleService: UserRoleService) {}

  async getClients(): Promise<ClientResponse[]> {
    const users = await this.userRoleService.findClients();
    return users.map((user) => UserMapper.toResponse(user));
  }
}
