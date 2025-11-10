import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UpdateProject } from '../../../src/module/tickets/application/useCases/update-project.use-case';
import {
  ProjectService,
  UserRoleService,
} from '../../../src/module/tickets/infrastructure/services';

describe('UpdateProject use-case', () => {
  let usecase: UpdateProject;
  let projectService: Partial<ProjectService>;
  let userRoleService: Partial<UserRoleService>;

  beforeEach(async () => {
    projectService = { findById: jest.fn(), update: jest.fn() };
    userRoleService = { findByUserId: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        UpdateProject,
        { provide: ProjectService, useValue: projectService },
        { provide: UserRoleService, useValue: userRoleService },
      ],
    }).compile();

    usecase = module.get(UpdateProject);
  });

  it('updates a project when user is admin', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      { isAdmin: () => true },
    ]);
    (projectService.findById as jest.Mock).mockResolvedValue({
      id: 'p1',
      name: 'old',
    });
    (projectService.update as jest.Mock).mockResolvedValue({
      id: 'p1',
      name: 'new',
    });

    const res = await usecase.execute('p1', 'new', 'desc', 'user-1');
    expect(res).toEqual({ id: 'p1', name: 'new' });
    expect(projectService.update).toHaveBeenCalled();
  });

  it('throws ForbiddenException when user is not admin', async () => {
    (userRoleService.findByUserId as jest.Mock).mockResolvedValue([
      { isAdmin: () => false },
    ]);

    await expect(
      usecase.execute('p1', 'n', undefined, 'user-2'),
    ).rejects.toThrow(ForbiddenException);
  });
});
