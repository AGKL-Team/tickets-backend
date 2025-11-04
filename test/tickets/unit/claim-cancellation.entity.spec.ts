import { ClaimCancellation } from '../../../src/module/tickets/domain/models/claim-cancellation.entity';

describe('ClaimCancellation domain', () => {
  it('changeName and changeDescription update fields', () => {
    const c = new ClaimCancellation();
    c.name = 'Motivo A';
    c.description = 'detalle';

    c.changeName('Motivo B');
    expect(c.name).toBe('Motivo B');

    c.changeDescription('nuevo detalle');
    expect(c.description).toBe('nuevo detalle');
  });
});
