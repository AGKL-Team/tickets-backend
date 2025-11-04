import { ClaimState } from '../../../src/module/tickets/domain/models/claim-state.entity';

describe('ClaimState helpers', () => {
  it('isPending detects pending', () => {
    const s = new ClaimState();
    s.name = 'pending';
    expect(s.isPending()).toBe(true);
    s.name = 'PENDING';
    expect(s.isPending()).toBe(true);
  });

  it('isInProgress detects in_progress variants', () => {
    const s = new ClaimState();
    s.name = 'in_progress';
    expect(s.isInProgress()).toBe(true);
    s.name = 'in progress';
    expect(s.isInProgress()).toBe(true);
  });

  it('isResolved detects resolved', () => {
    const s = new ClaimState();
    s.name = 'resolved';
    expect(s.isResolved()).toBe(true);
  });

  it('isCancelled detects cancelled and canceled', () => {
    const s = new ClaimState();
    s.name = 'cancelled';
    expect(s.isCancelled()).toBe(true);
    s.name = 'canceled';
    expect(s.isCancelled()).toBe(true);
  });
});
