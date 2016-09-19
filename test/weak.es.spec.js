import { List } from 'immutable';
import { Run, es } from '../weak';

const EN = 0x0032 // U+0032 DIGIT TWO
const ES = 0x002B // U+002B PLUS SIGN

describe('Resolving Weak Types - ES (European Number Separator)', () => {

  it('should change [EN,ES,EN] to [EN,EN,EN]', () => {
    const run = new Run({ points: List.of(EN, ES, EN) });
    const types = List.of('ES', 'ES', 'EN');
    expect(es(types, run)).to.equal(List.of('EN', 'EN', 'EN'));
  });

});
