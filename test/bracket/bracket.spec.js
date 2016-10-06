import { List } from 'immutable';
import { Pairing } from '../../src/type';
import { A, B, C, D } from '../../src/util/constant'
import { LEFT_PAR, RIGHT_PAR } from '../../src/util/constant'
import { LEFT_SQUARE, RIGHT_SQUARE } from '../../src/util/constant'
import { LEFT_CURLY, RIGHT_CURLY } from '../../src/util/constant'
import bracketPairs from '../../src/neutral/bracketPairs';

describe('Bracket Pairs', () => {

  it('should find a single pair from "()"', () => {
    const pairings = List.of(new Pairing({ open: 0, close: 1 }));
    const points = List.of(LEFT_PAR, RIGHT_PAR);
    const bidiTypes = List.of('ON', 'ON');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find two pairs from "()()"', () => {
    const pairings = List.of(
      new Pairing({ open: 0, close: 1 }),
      new Pairing({ open: 2, close: 3 })
    );
    const points = List.of(LEFT_PAR, RIGHT_PAR, LEFT_PAR, RIGHT_PAR);
    const bidiTypes = List.of('ON', 'ON', 'ON', 'ON');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find no pairs from "a)b(c"', () => {
    const pairings = List.of();
    const points = List.of(A, RIGHT_PAR, B, LEFT_PAR, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find no pairs from "a(b]c"', () => {
    const pairings = List.of();
    const points = List.of(A, LEFT_PAR, B, RIGHT_SQUARE, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-3], from "a(b)c"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 3 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_PAR, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-5], from "a(b[c)d]"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, LEFT_SQUARE, C, RIGHT_PAR, D, RIGHT_SQUARE);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-5], from "a(b]c)d"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_SQUARE, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-3], from "a(b)c)d"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 3 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_PAR, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [3-5], from "a(b(c)d"', () => {
    const pairings = List.of(new Pairing({ open: 3, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, LEFT_PAR, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-7, 3-5], from "a(b(c)d)"', () => {
    const pairings = List.of(
      new Pairing({ open: 1, close: 7 }),
      new Pairing({ open: 3, close: 5 })
    );
    const points = List.of(A, LEFT_PAR, B, LEFT_PAR, C, RIGHT_PAR, D, RIGHT_PAR);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(bracketPairs(points)).to.equal(pairings);
  });

  it('should find pairs [1-7, 3-5], from "a(b{c}d)"', () => {
    const pairings = List.of(
      new Pairing({ open: 1, close: 7 }),
      new Pairing({ open: 3, close: 5 })
    );
    const points = List.of(A, LEFT_PAR, B, LEFT_CURLY, C, RIGHT_CURLY, D, RIGHT_PAR);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(bracketPairs(points)).to.equal(pairings);
  });

});
