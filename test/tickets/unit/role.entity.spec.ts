import { Role } from '../../../src/module/tickets/domain/models/role.entity';

describe('Role domain', () => {
  it('changeName updates the name', () => {
    const r = new Role();
    r.name = 'client';
    r.changeName('user');
    expect(r.name).toBe('user');
  });

  it('isClient returns true for client/user', () => {
    const r = new Role();
    r.name = 'client';
    expect(r.isClient()).toBe(true);
    r.name = 'user';
    expect(r.isClient()).toBe(true);
    r.name = 'other';
    expect(r.isClient()).toBe(false);
  });

  it('isAdmin returns true for admin/administrator', () => {
    const r = new Role();
    r.name = 'admin';
    expect(r.isAdmin()).toBe(true);
    r.name = 'administrator';
    expect(r.isAdmin()).toBe(true);
    r.name = 'notadmin';
    expect(r.isAdmin()).toBe(false);
  });
});
