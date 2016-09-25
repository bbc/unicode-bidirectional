import { List } from 'immutable';
import { resolveBrackets } from '../../src/neutral/neutral';
import { Pairing } from '../../src/type';

describe('Resolving Neutrals - Bracket Pairs', () => {

  it('should be that brackets enclosing any e-type resolve to paragraph direction', () => {
    const bidiTypes = List.of('L', 'WS', 'ON', 'L', 'WS', 'R', 'ON', 'WS', 'R');
    const bracketPairs = List.of(new Pairing({ open: 2, close: 6 }));
    const resolved = List.of('L', 'WS', 'R', 'L', 'WS', 'R', 'R', 'WS', 'R');
    expect(resolveBrackets(bidiTypes, bracketPairs, false)).to.equal(resolved);
  });

  it('should be that pairs enclosing only o-types resolve to the opposite direction', () => {
    const bidiTypes = List.of('R', 'WS', 'L', 'ON', 'L', 'ON');
    const bracketPairs = List.of(new Pairing({ open: 3, close: 5 }));
    const resolved = List.of('R', 'WS', 'L', 'L', 'L', 'L');
    expect(resolveBrackets(bidiTypes, bracketPairs, false)).to.equal(resolved);
  });

  it('should process brackets sequentially by indices of open brackets', () => {
    const bidiTypes = List.of('R', 'ON', 'R', 'ON', 'ON', 'L', 'ON', 'ON', 'ON', 'L');
    const bracketPairs = List.of(
      new Pairing({ open: 1, close: 8 }),
      new Pairing({ open: 3, close: 6 })
    );
    const resolved = List.of('R', 'R', 'R', 'R', 'ON', 'L', 'R', 'ON', 'R', 'L');
    expect(resolveBrackets(bidiTypes, bracketPairs, false)).to.equal(resolved);
  });

});

