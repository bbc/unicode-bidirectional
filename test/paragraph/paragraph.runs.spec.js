import { List } from 'immutable';
import { levelRuns } from '../../src/paragraph/paragraph';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../../src/type';
import { Run } from '../../src/type';

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const x = 0x0078; // U+0078 LATIN SMALL LETTER X

describe('Paragraph - Level Runs', () => {
  it('should find a trivial run', () => {
    const codepoints = List.of(A, B, C);
    const bidiTypes = List.of('L', 'L', 'L');
    const runs = List.of(new Run({ level: 0, codepoints: List.of(A, B, C) }));
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for: [text1·RLE·text2·PDF·RLE·text3·PDF·text4]', () => {
    const codepoints = List.of(A, RLE, B, PDF, RLE, C, PDF, D);
    const bidiTypes = List.of('L', 'RLE', 'L', 'PDF', 'RLE', 'L', 'PDF', 'L');
    const runs = List.of(
      new Run({ level: 0, codepoints: List.of(A) }),
      new Run({ level: 1, codepoints: List.of(B, C) }),
      new Run({ level: 0, codepoints: List.of(D) }),
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });
});
