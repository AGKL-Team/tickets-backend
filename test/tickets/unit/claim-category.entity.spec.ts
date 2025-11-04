import { ClaimCategory } from '../../../src/module/tickets/domain/models/claim-category.entity';

describe('ClaimCategory entity', () => {
  it('changeName and changeDescription should update fields', () => {
    const c = ClaimCategory.create('general', 'descripcion');
    expect(c.name).toBe('general');
    expect(c.description).toBe('descripcion');

    c.changeName('soporte');
    expect(c.name).toBe('soporte');

    c.changeDescription('desc nueva');
    expect(c.description).toBe('desc nueva');
  });

  it('static create builds a ClaimCategory', () => {
    const c = ClaimCategory.create('ventas', 'para ventas');
    expect(c).toBeInstanceOf(ClaimCategory);
    expect(c.name).toBe('ventas');
  });
});
