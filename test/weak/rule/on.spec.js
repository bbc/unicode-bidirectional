import { List } from 'immutable';
import { Run } from '../../../src/weak/weak';
import on from '../../../src/weak/rule/on';

const L  = 0x006D // U+006D LATIN SMALL LETTER M
const AN = 0x0661 // U+0661 ARABIC-INDIC DIGIT ONE
const ON = 0x0022 // U+0022 QUOTATION MARK
const EN = 0x0033 // U+0033 DIGIT THREE
const ET = 0x00A3 // U+00A3 POUND SIGN
const ES = 0x002B // U+002B PLUS SIGN

describe('Resolving Weak Types - ON (Other Neutral)', () => {

  it('should change [AN,ET] to [AN,ON]', () => {
    const run = new Run({ points: List.of(AN, ET) });
    const types = List.of('AN', 'ET');
    expect(on(types, run)).to.equal(List.of('AN', 'ON'));
  });

  it('should change [L,ES,EN] to [L,ON,EN]', () => {
    const run = new Run({ points: List.of(L, ES, EN) });
    const types = List.of('L', 'ON', 'EN');
    expect(on(types, run)).to.equal(List.of('L', 'ON', 'EN'));
  });

});
