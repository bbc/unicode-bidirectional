import { List } from 'immutable';
import { L1 as L } from '../../src/util/constant';
import { ON1 as ON } from '../../src/util/constant';
import { R1 as R } from '../../src/util/constant';
import { resolveRemaining } from '../../src/neutral/neutral';

const __ = 'L'; // a bidi type we "dont care" about

describe('[Neutral] Resolving Isolates (N2) - Remaining NIs', () => {

  it('should resolve [R,NI,eos] to [R,e,eos] when eos = L', () => {
    const types = List.of('R','ON');
    const points = List.of(R, ON);
    expect(resolveRemaining(types, points, __, 'L', 0)).to.equal(List.of('R', 'L'));
    expect(resolveRemaining(types, points, __, 'L', 1)).to.equal(List.of('R', 'R'));
  });

  it('should resolve [L,NI,eos] to [L,e,eos] when eos = R', () => {
    const types = List.of('L','ON');
    const points = List.of(L, ON);
    expect(resolveRemaining(types, points, __, 'R', 0)).to.equal(List.of('L', 'L'));
    expect(resolveRemaining(types, points, __, 'R', 1)).to.equal(List.of('L', 'R'));
  });

});
