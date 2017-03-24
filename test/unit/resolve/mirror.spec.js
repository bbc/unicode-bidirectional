import { List, Map } from 'immutable';
import mirror from '../../../src/resolve/mirror';
import { A, AL1, LEFT_PAR, RIGHT_PAR } from '../../../src/util/constant';

describe('[Resolve] - Mirroring glyphs by rule L4.', () => {

  it('should mirror left parenthesis to right parenthesis in a RTL context', () => {
    // "X ( Y" --> "X ) Y", where X and Y have biditype R
    const levels = List.of(1, 1, 1);
    const before = List.of(AL1, LEFT_PAR, AL1);
    const after = List.of(AL1, RIGHT_PAR, AL1);
    expect(mirror(before, levels)).to.equal(after);
  });

  it('should no make changes to a left parenthesis in a LTR context', () => {
    // "x ( y" --> "x ( y", where x and y have biditype L
    const levels = List.of(0, 0, 0);
    const points = List.of(A, LEFT_PAR, A);
    expect(mirror(points, levels)).to.equal(points);
  });

});
