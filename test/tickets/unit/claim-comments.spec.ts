import { ClaimComment } from '../../../src/module/tickets/domain/models/claim-comment.entity';
import { Claim } from '../../../src/module/tickets/domain/models/claim.entity';

describe('Claim comments', () => {
  it('allows adding and removing comments', () => {
    const claim = new Claim();
    claim.issue = 'issue';
    claim.number = 'n1';
    claim.clientId = 'u1';

    const comment = ClaimComment.create('Great service', 'user-1', claim);

    claim.addComment(comment);
    expect(claim.comments).toBeDefined();
    expect(claim.comments!.length).toBe(1);

    claim.removeComment(comment.id);
    expect(claim.comments!.length).toBe(0);
  });
});
