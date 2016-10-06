import { List } from 'immutable';
import { Pairing } from '../../../src/type';
import { AL1 as AL } from '../../../src/util/constant';
import { ON1 as ON } from '../../../src/util/constant';
import { L1 as L } from '../../../src/util/constant';
import { R1 as R } from '../../../src/util/constant';
import { WS1 as WS } from '../../../src/util/constant';
import { LEFT_PAR, RIGHT_PAR, LEFT_SQUARE, RIGHT_SQUARE } from '../../../src/util/constant';
import resolveBrackets from '../../../src/neutral/resolveBrackets';

describe('[Neutral] Resolving Neutrals (N0) - Bracket Pairs', () => {

  it('should be that brackets enclosing any e-type resolve to paragraph direction', () => {
    const types = List.of('L', 'WS', 'ON', 'L', 'WS', 'R', 'ON', 'WS', 'R');
    const points = List.of(L,WS,LEFT_PAR,L,WS,AL,RIGHT_PAR,WS,R);
    const resolved = List.of('L', 'WS', 'R', 'L', 'WS', 'R', 'R', 'WS', 'R');
    expect(resolveBrackets(types, points, 'R', 'R', 1)).to.equal(resolved);
  });

  it('should be that pairs enclosing only o-types resolve to the opposite direction', () => {
    const types = List.of('R', 'WS', 'L', 'ON', 'L', 'ON');
    const points = List.of(AL,WS,L,LEFT_PAR,L,RIGHT_PAR);
    const resolved = List.of('R', 'WS', 'L', 'L', 'L', 'L');
    expect(resolveBrackets(types, points, 'R', 'R', 1)).to.equal(resolved);
  });

  it('should process brackets sequentially by indices of open brackets', () => {
    const types = List.of('R','ON', 'R', 'ON', 'ON', 'L', 'ON', 'ON', 'ON', 'L');
    const points = List.of(AL,LEFT_PAR,AL,LEFT_SQUARE,ON,L,RIGHT_SQUARE,ON,RIGHT_PAR,L);
    const resolved = List.of('R','R','R','R','ON','L','R','ON','R','L');
    expect(resolveBrackets(types, points, 'R', 'R', 1)).to.equal(resolved);
  });

});
