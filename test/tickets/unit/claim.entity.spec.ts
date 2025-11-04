import { ClaimCancellation } from '../../../src/module/tickets/domain/models/claim-cancellation.entity';
import { ClaimCategory } from '../../../src/module/tickets/domain/models/claim-category.entity';
import { ClaimHistory } from '../../../src/module/tickets/domain/models/claim-history.entity';
import { ClaimState } from '../../../src/module/tickets/domain/models/claim-state.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';
import { Priority } from '../../../src/module/tickets/domain/models/priority.entity';

describe('Claim entity (history)', () => {
  let pending: ClaimState;
  let inProgress: ClaimState;
  let resolved: ClaimState;
  let cancelled: ClaimState;
  let priority: Priority;
  let category: ClaimCategory;

  beforeEach(() => {
    pending = new ClaimState();
    pending.name = 'pending';

    inProgress = new ClaimState();
    inProgress.name = 'in_progress';

    resolved = new ClaimState();
    resolved.name = 'resolved';

    cancelled = new ClaimState();
    cancelled.name = 'cancelled';

    priority = Priority.create(1, 'alta');
    category = ClaimCategory.create('general', 'categoría general');
  });

  it('change* methods add history entries without changing state', () => {
    const claim = Claim.create(
      'Asunto',
      new Date(),
      priority,
      category,
      'NUM-1',
      'client-1',
      'desc',
    );
    claim.state = pending;

    claim.changeIssue('Nuevo asunto');
    expect(claim.history).toBeDefined();
    expect(claim.history!.length).toBe(1);
    const h1 = claim.history![0];
    expect(h1).toBeInstanceOf(ClaimHistory);
    expect(h1.description).toContain('Cambio de asunto');
    // now change* methods include the state in the description
    expect(h1.description).toContain('Estado:');
    expect(h1.state).toBe(pending);

    claim.changeDescription('Nueva descripción');
    expect(claim.history!.length).toBe(2);
    const h2 = claim.history![1];
    expect(h2.description).toContain('Cambio de descripción');
    expect(h2.description).toContain('Estado:');
    expect(h2.state).toBe(pending);

    // changeCategory should add an entry and not change the claim state
    const newCat = ClaimCategory.create('urgente', 'categoría urgente');
    claim.changeCategory(newCat);
    expect(claim.history!.length).toBe(3);
    const h3 = claim.history![2];
    expect(h3.description).toContain('Cambio de categoría');
    expect(h3.description).toContain('Estado:');
    expect(h3.state).toBe(pending);

    // changeDate should add an entry with ISO strings and keep state
    const newDate = new Date('2025-01-01T00:00:00.000Z');
    claim.changeDate(newDate);
    expect(claim.history!.length).toBe(4);
    const h4 = claim.history![3];
    expect(h4.description).toContain('Cambio de fecha');
    expect(h4.description).toContain(newDate.toISOString());
    expect(h4.description).toContain('Estado:');
    expect(h4.state).toBe(pending);

    // changePriority should add an entry and keep state
    const newPriority = Priority.create(2, 'media');
    claim.changePriority(newPriority);
    expect(claim.history!.length).toBe(5);
    const h5 = claim.history![4];
    expect(h5.description).toContain('Cambio de prioridad');
    expect(h5.description).toContain('Estado:');
    expect(h5.state).toBe(pending);

    // state remains unchanged
    expect(claim.state).toBe(pending);
  });

  it('start adds a history entry and updates state when provided', () => {
    const claim = Claim.create(
      'Asunto',
      new Date(),
      priority,
      category,
      'NUM-2',
      'client-2',
    );
    claim.state = pending;

    claim.start(inProgress);
    expect(claim.state).toBe(inProgress);
    expect(claim.history).toBeDefined();
    expect(claim.history!.length).toBe(1);
    expect(claim.history![0].description).toContain('Inicio de gestión');
    expect(claim.history![0].state).toBe(inProgress);
  });

  it('resolve sets resolver id and records history', () => {
    const claim = Claim.create(
      'Asunto',
      new Date(),
      priority,
      category,
      'NUM-3',
      'client-3',
    );
    claim.state = resolved;

    claim.resolve('resolver-1');
    expect(claim.claimResolverId).toBe('resolver-1');
    expect(claim.history).toBeDefined();
    expect(claim.history!.length).toBe(1);
    expect(claim.history![0].description).toContain('Reclamo resuelto');
    expect(claim.history![0].state).toBe(resolved);
  });

  it('cancel records cancellation info and history with motivo', () => {
    const claim = Claim.create(
      'Asunto',
      new Date(),
      priority,
      category,
      'NUM-4',
      'client-4',
    );
    claim.state = pending;

    const canc = new ClaimCancellation();
    canc.name = 'Cliente canceló';
    canc.description = 'Motivo de prueba';

    claim.cancel(canc, cancelled);
    expect(claim.cancellation).toBe(canc);
    expect(claim.state).toBe(cancelled);
    expect(claim.history).toBeDefined();
    expect(claim.history!.length).toBe(1);
    expect(claim.history![0].description).toContain('Reclamo cancelado');
    expect(claim.history![0].description).toContain(canc.name);
    expect(claim.history![0].state).toBe(cancelled);
  });
});
