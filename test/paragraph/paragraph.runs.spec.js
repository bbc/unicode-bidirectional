import { List } from 'immutable';
import { levelRuns } from '../../src/paragraph/paragraph';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../../src/type';
import { Run } from '../../src/type';

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const E = 0x0045; // U+0044 LATIN CAPITAL LETTER E
const F = 0x0046; // U+0044 LATIN CAPITAL LETTER F
const G = 0x0047; // U+0044 LATIN CAPITAL LETTER G
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
      new Run({ level: 0, codepoints: List.of(D) })
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for: [text1·RLI·text2·PDI·RLI·text3·PDI·text4]', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const bidiTypes = List.of('L', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const runs = List.of(
      new Run({ level: 0, codepoints: List.of(A, RLI) }),
      new Run({ level: 1, codepoints: List.of(B) }),
      new Run({ level: 0, codepoints: List.of(PDI, RLI) }),
      new Run({ level: 1, codepoints: List.of(C) }),
      new Run({ level: 0, codepoints: List.of(PDI, D) })
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for: [text1·RLI·text2·PDI·RLI·text3·PDI·text4]', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const bidiTypes = List.of('L', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const runs = List.of(
      new Run({ level: 0, codepoints: List.of(A, RLI) }),
      new Run({ level: 1, codepoints: List.of(B) }),
      new Run({ level: 0, codepoints: List.of(PDI, RLI) }),
      new Run({ level: 1, codepoints: List.of(C) }),
      new Run({ level: 0, codepoints: List.of(PDI, D) })
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for: [t1·RLI·t2·LRI·t3·RLE·t4·PDF·t5·PDI·t6·PDI·t7]', () => {
    const codepoints = List.of(A, RLI, B, LRI, C, RLE, D, PDF, E, PDI, F, PDI, G);
    const bidiTypes = List.of('L', 'RLI', 'L', 'LRI', 'L', 'RLE', 'L', 'PDF', 'L', 'PDI', 'PDI', 'L', 'PDI', 'L');
    const runs = List.of(
      new Run({ level: 0, codepoints: List.of(A, RLI) }),
      new Run({ level: 1, codepoints: List.of(B, LRI) }),
      new Run({ level: 2, codepoints: List.of(C) }),
      new Run({ level: 3, codepoints: List.of(D) }),
      new Run({ level: 2, codepoints: List.of(E) }),
      new Run({ level: 1, codepoints: List.of(PDI, F) }),
      new Run({ level: 0, codepoints: List.of(PDI, G) })
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

});
