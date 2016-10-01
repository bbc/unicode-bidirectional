import { List } from 'immutable';
import { Run } from '../../../src/weak/weak';
import es from '../../../src/weak/rule/es';

const EN = 0x0032 // U+0032 DIGIT TWO
const ES = 0x002B // U+002B PLUS SIGN
const CS = 0x002E // U+002E FULL STOP
const AN = 0x0661 // U+0661 ARABIC-INDIC DIGIT ONE

describe('Resolving Weak Types - ES (European Number Separator)', () => {

  it('should change [EN,ES,EN] to [EN,EN,EN]', () => {
    const run = new Run({ points: List.of(EN, ES, EN) });
    const types = List.of('EN', 'ES', 'EN');
    expect(es(types, run)).to.equal(List.of('EN', 'EN', 'EN'));
  });

  it('should change [EN,CS,EN] to [EN,EN,EN]', () => {
    const run = new Run({ points: List.of(EN, CS, EN) });
    const types = List.of('EN', 'CS', 'EN');
    expect(es(types, run)).to.equal(List.of('EN', 'EN', 'EN'));
  });

  it('should change [AN,CS,AN] to [AN,AN,AN]', () => {
    const run = new Run({ points: List.of(AN, CS, AN) });
    const types = List.of('AN', 'CS', 'AN');
    expect(es(types, run)).to.equal(List.of('AN', 'AN', 'AN'));
  });

});
