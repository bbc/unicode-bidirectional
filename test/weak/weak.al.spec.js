import { List } from 'immutable';
import { Run, al } from '../../src/weak/weak';

describe('Resolving Weak Types - AL (Arabic Letter)', () => {

  it('should change all ALs to R', () => {
    const run = new Run({
      points: List.of(
        0x645, // U+0645 ARABIC LETTER MEEM
        0x627, // U+0645 ARABIC LETTER ALEF
        0x631, // U+0645 ARABIC LETTER REH
        0x643, // U+0643 ARABIC LETTER KAF
      )
    });
    const types = List.of('AL','AL', 'AL', 'AL');
    expect(al(types, run)).to.equal(List.of('R', 'R', 'R', 'R'));
  });

});
