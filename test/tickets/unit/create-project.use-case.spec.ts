import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateProject } from '../../../src/module/tickets/application/useCases/create-project.use-case';
import {
  ProjectService,
  UserRoleService,
} from '../../../src/module/tickets/infrastructure/services';

describe('CreateProject use-case', () => {
  let usecase: CreateProject;
  let projectService: Partial<ProjectService>;
  let userRoleService: Partial<UserRoleService>;

  beforeEach(async () => {
    projectService = { save: jest.fn() };
    userRoleService = { findByUserId: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        CreateProject,
        { provide: ProjectService, useValue: projectService },
        { provide: UserRoleService, useValue: userRoleService },
      ],
    }).compile();

    usecase = module.get(CreateProject);
  });

  it('creates a project when user is admin', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      { isAdmin: () => true },
    ]);
    (projectService.save as jest.Mock).mockResolvedValue({ id: 'p1' });

    const res = await usecase.execute('Name', 'Desc', 'user-1');
    expect(res).toEqual({ id: 'p1' });
    expect(projectService.save).toHaveBeenCalled();
  });

  it('throws ForbiddenException when user is not admin', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      { isAdmin: () => false },
    ]);

    await expect(usecase.execute('N', undefined, 'user-2')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
