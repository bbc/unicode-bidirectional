import { List } from 'immutable';
import resolvedWeaks from '../../../src/weak/resolvedWeaks';
import { AL1 as AL } from '../../../src/util/constant';
import { ON1 as ON } from '../../../src/util/constant';
import { L1 as L } from '../../../src/util/constant';
import { LEFT_PAR, RIGHT_PAR, LEFT_SQUARE, RIGHT_SQUARE } from '../../../src/util/constant';

describe('[Weak] Resolving weak types using rules W1-W7, N0-N2, I1-I2', () => {
  it('should resolve', () => {
    const cs = List.of(AL,AL,LEFT_PAR,AL,AL,LEFT_SQUARE,ON,L,L,RIGHT_SQUARE,ON,RIGHT_PAR, L, L);
    const before = List.of('AL','AL','ON','AL','AL', 'ON','ON','L','L', 'ON','ON','ON','L','L');
    const after = List.of('R','R','R','R','R', 'R','R','L','L','R','R','R', 'L', 'L');
    expect(resolvedWeaks(cs, before, 1)).to.equal(after);
  });
});
