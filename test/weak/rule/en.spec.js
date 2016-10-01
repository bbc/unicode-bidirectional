import { List } from 'immutable';
import { Run } from '../../../src/weak/weak';
import en from '../../../src/weak/rule/en';

const L  = 0x006D // U+006D LATIN SMALL LETTER M
const R  = 0x05D0 // U+05D0 HEBREW LETTER ALEF
const AL = 0x0643 // U+0643 ARABIC LETTER KAF
const AN = 0x0661 // U+0661 ARABIC-INDIC DIGIT ONE
const EN = 0x0032 // U+0032 DIGIT TWO
const NI = 0x0020 // U+0020 SPACE (e.g. of some Neutral-Isolate)

describe('Resolving Weak Types - EN (European Number)', () => {

  it('should change [AL,EN] to [AL,AN]', () => {
    const run = new Run({ points: List.of(AL, EN) });
    const types = List.of('AL', 'EN');
    expect(en(types, run)).to.equal(List.of('AL', 'AN'));
  });

  it('should change [AL,NI,EN] to [AL,NI,AN]', () => {
    const run = new Run({ points: List.of(AL, NI, EN) });
    const types = List.of('AL', 'NI', 'EN');
    expect(en(types, run)).to.equal(List.of('AL', 'NI', 'AN'));
  });

  it('should change [sos,NI,EN] to [sos,NI,EN]', () => {
    const run = new Run({ points: List.of(NI, EN) });
    const types = List.of('NI','EN');
    expect(en(types, run)).to.equal(List.of('NI', 'EN'));
  });

  it('should change [L,NI,EN] to [L,NI,EN]', () => {
    const run = new Run({ points: List.of(L, NI, EN) });
    const types = List.of('L','NI', 'EN');
    expect(en(types, run)).to.equal(List.of('L', 'NI', 'EN'));
  });

  it('should change [R,NI,EN] to [R,NI,EN]', () => {
    const run = new Run({ points: List.of(R, NI, EN) });
    const types = List.of('R','NI', 'EN');
    expect(en(types, run)).to.equal(List.of('R', 'NI', 'EN'));
  });

});
