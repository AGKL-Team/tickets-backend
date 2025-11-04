import { Priority } from '../../../src/module/tickets/domain/models/priority.entity';

describe('Priority entity', () => {
  it('changeNumber and changeDescription should update fields', () => {
    const p = Priority.create(3, 'media');
    expect(p.number).toBe(3);
    expect(p.description).toBe('media');

    p.changeNumber(5);
    expect(p.number).toBe(5);

    p.changeDescription('alta');
    expect(p.description).toBe('alta');
  });

  it('static create builds a Priority', () => {
    const p = Priority.create(1, 'alta');
    expect(p).toBeInstanceOf(Priority);
    expect(p.number).toBe(1);
    expect(p.description).toBe('alta');
  });
});
