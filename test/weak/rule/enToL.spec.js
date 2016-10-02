import { List } from 'immutable';
import enToL from '../../../src/weak/rule/enToL';

const L  = 0x006D // U+006D LATIN SMALL LETTER M
const R  = 0x05D0 // U+05D0 HEBREW LETTER ALEF
const EN = 0x0032 // U+0032 DIGIT TWO
const NI = 0x0020 // U+0020 SPACE (e.g. of some Neutral-Isolate)

describe('Resolving Weak Types - ENs to Ls', () => {

  it('should change [L,NI,EN] to [L,NI,L]', () => {
    const points = List.of(L, NI, EN);
    const types = List.of('L', 'NI', 'EN');
    expect(enToL(types, points)).to.equal(List.of('L', 'NI', 'L'));
  });

  it('should change [R,NI,EN] to [R,NI,EN]', () => {
    const points = List.of(R, NI, EN);
    const types = List.of('R', 'NI', 'EN');
    expect(enToL(types, points)).to.equal(List.of('R', 'NI', 'EN'));
  });

});
