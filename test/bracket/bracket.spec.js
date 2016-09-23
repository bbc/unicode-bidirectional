import { List } from 'immutable';
import { pairedBrackets } from '../../src/bracket/bracket';
import { Pairing } from '../../src/type';

const LEFT_PAR = 0x0028;
const RIGHT_PAR = 0x0029;
const LEFT_SQUARE = 0x005B;
const RIGHT_SQUARE = 0x005D;
const LEFT_CURLY = 0x007B;
const RIGHT_CURLY = 0x007D;
const A = 0x0061;
const B = 0x0062;
const C = 0x0063;
const D = 0x0064;

describe('Paired Brackes', () => {

  it('should find a single pair from "()"', () => {
    const pairings = List.of(new Pairing({ open: 0, close: 1 }));
    const points = List.of(LEFT_PAR, RIGHT_PAR);
    const bidiTypes = List.of('ON', 'ON');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find two pairs from "()()"', () => {
    const pairings = List.of(
      new Pairing({ open: 0, close: 1 }),
      new Pairing({ open: 2, close: 3 })
    );
    const points = List.of(LEFT_PAR, RIGHT_PAR, LEFT_PAR, RIGHT_PAR);
    const bidiTypes = List.of('ON', 'ON', 'ON', 'ON');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find no pairs from "a)b(c"', () => {
    const pairings = List.of();
    const points = List.of(A, RIGHT_PAR, B, LEFT_PAR, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find no pairs from "a(b]c"', () => {
    const pairings = List.of();
    const points = List.of(A, LEFT_PAR, B, RIGHT_SQUARE, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-3], from "a(b)c"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 3 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_PAR, C);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-5], from "a(b[c)d]"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, LEFT_SQUARE, C, RIGHT_PAR, D, RIGHT_SQUARE);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-5], from "a(b]c)d"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_SQUARE, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-3], from "a(b)c)d"', () => {
    const pairings = List.of(new Pairing({ open: 1, close: 3 }));
    const points = List.of(A, LEFT_PAR, B, RIGHT_PAR, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [3-5], from "a(b(c)d"', () => {
    const pairings = List.of(new Pairing({ open: 3, close: 5 }));
    const points = List.of(A, LEFT_PAR, B, LEFT_PAR, C, RIGHT_PAR, D);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-7, 3-5], from "a(b(c)d)"', () => {
    const pairings = List.of(
      new Pairing({ open: 1, close: 7 }),
      new Pairing({ open: 3, close: 5 })
    );
    const points = List.of(A, LEFT_PAR, B, LEFT_PAR, C, RIGHT_PAR, D, RIGHT_PAR);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

  it('should find pairs [1-7, 3-5], from "a(b{c}d)"', () => {
    const pairings = List.of(
      new Pairing({ open: 1, close: 7 }),
      new Pairing({ open: 3, close: 5 })
    );
    const points = List.of(A, LEFT_PAR, B, LEFT_CURLY, C, RIGHT_CURLY, D, RIGHT_PAR);
    const bidiTypes = List.of('L', 'ON', 'L', 'ON', 'L', 'ON', 'L', 'ON');
    expect(pairedBrackets(points)).to.equal(pairings);
  });

});
