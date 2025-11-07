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
    const history = claim.history;
    expect(history.length).toBe(1);
    expect(history[0]).toBeDefined();
    const h1 = history[0];
    if (!h1) throw new Error('Missing history entry h1');
    expect(h1).toBeInstanceOf(ClaimHistory);
    expect(h1.description).toContain('Cambio de asunto');
    // now change* methods include the state in the description
    expect(h1.description).toContain('Estado:');
    expect(h1.state).toBe(pending);

    claim.changeDescription('Nueva descripción');
    expect(history.length).toBe(2);
    expect(history[1]).toBeDefined();
    const h2 = history[1];
    if (!h2) throw new Error('Missing history entry h2');
    expect(h2.description).toContain('Cambio de descripción');
    expect(h2.description).toContain('Estado:');
    expect(h2.state).toBe(pending);

    // changeCategory should add an entry and not change the claim state
    const newCat = ClaimCategory.create('urgente', 'categoría urgente');
    claim.changeCategory(newCat);
    expect(history.length).toBe(3);
    expect(history[2]).toBeDefined();
    const h3 = history[2];
    if (!h3) throw new Error('Missing history entry h3');
    expect(h3.description).toContain('Cambio de categoría');
    expect(h3.description).toContain('Estado:');
    expect(h3.state).toBe(pending);

    // changeDate should add an entry with ISO strings and keep state
    const newDate = new Date('2025-01-01T00:00:00.000Z');
    claim.changeDate(newDate);
    expect(history.length).toBe(4);
    expect(history[3]).toBeDefined();
    const h4 = history[3];
    if (!h4) throw new Error('Missing history entry h4');
    expect(h4.description).toContain('Cambio de fecha');
    expect(h4.description).toContain(newDate.toISOString());
    expect(h4.description).toContain('Estado:');
    expect(h4.state).toBe(pending);

    // changePriority should add an entry and keep state
    const newPriority = Priority.create(2, 'media');
    claim.changePriority(newPriority);
    expect(history.length).toBe(5);
    expect(history[4]).toBeDefined();
    const h5 = history[4];
    if (!h5) throw new Error('Missing history entry h5');
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
    const history2 = claim.history;
    expect(history2.length).toBe(1);
    expect(history2[0]).toBeDefined();
    const entry2 = history2[0];
    if (!entry2) throw new Error('Missing history entry entry2');
    expect(entry2.description).toContain('Inicio de gestión');
    expect(entry2.state).toBe(inProgress);
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
    const history3 = claim.history;
    expect(history3.length).toBe(1);
    expect(history3[0]).toBeDefined();
    const entry3 = history3[0];
    if (!entry3) throw new Error('Missing history entry entry3');
    expect(entry3.description).toContain('Reclamo resuelto');
    expect(entry3.state).toBe(resolved);
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
    const history4 = claim.history;
    expect(history4.length).toBe(1);
    expect(history4[0]).toBeDefined();
    const entry4 = history4[0];
    if (!entry4) throw new Error('Missing history entry entry4');
    expect(entry4.description).toContain('Reclamo cancelado');
    expect(entry4.description).toContain(canc.name);
    expect(entry4.state).toBe(cancelled);
  });
});
