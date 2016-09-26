import { List } from 'immutable';
import { levelRuns } from '../../src/paragraph/paragraph';

const x = 0x0078; // U+0078 LATIN SMALL LETTER X

describe('Paragraph - Level Runs', () => {
  it.only('should find a trivial run', () => {
    const codepoints = List.of(x, x, x);
    const bidiTypes = List.of('L', 'L', 'L');
    const levels = List.of(x, x, x);
    expect(levelRuns(codepoints, bidiTypes)).to.equal(levels);
  });
});
