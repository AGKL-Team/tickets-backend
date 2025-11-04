import { ClaimHistory } from '../../../src/module/tickets/domain/models/claim-history.entity';
import { ClaimState } from '../../../src/module/tickets/domain/models/claim-state.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';

describe('ClaimHistory entity', () => {
  it('static create builds a ClaimHistory with date and fields', () => {
    const s = new ClaimState();
    s.name = 'pending';
    const claim = Claim.create(
      'X',
      new Date(),
      undefined as any,
      undefined as any,
      'N',
      'u',
    );

    const h = ClaimHistory.create('desc', s, claim as any);
    expect(h).toBeInstanceOf(ClaimHistory);
    expect(h.description).toBe('desc');
    expect(h.state).toBe(s);
    expect(h.claim).toBe(claim);
    expect(h.date).toBeInstanceOf(Date);
  });
});
