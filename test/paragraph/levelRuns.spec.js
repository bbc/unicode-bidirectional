import { List } from 'immutable';
import levelRuns from '../../src/paragraph/levelRuns';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../../src/type';
import { Run } from '../../src/type';

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const E = 0x0045; // U+0044 LATIN CAPITAL LETTER E
const F = 0x0046; // U+0044 LATIN CAPITAL LETTER F
const G = 0x0047; // U+0044 LATIN CAPITAL LETTER G

describe('Paragraph - Level Runs', () => {
  it('should find a trivial run', () => {
    const codepoints = List.of(A, B, C);
    const bidiTypes = List.of('L', 'L', 'L');
    const runs = List.of(new Run({ level: 0, from: 0, to: 3 }));
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for "A·RLE·B·PDF·RLE·C·PDF·D"', () => {
    const codepoints = List.of(A, RLE, B, PDF, RLE, C, PDF, D);
    const bidiTypes = List.of('L', 'RLE', 'L', 'PDF', 'RLE', 'L', 'PDF', 'L');
    const runs = List.of(
      new Run({ level: 0, from: 0, to: 1 }), // A
      new Run({ level: 1, from: 1, to: 3 }), // B, C
      new Run({ level: 0, from: 3, to: 4 })  // D
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for "A·RLI·B·PDI·RLI·C·PDI·D"', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const bidiTypes = List.of('L', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const runs = List.of(
      new Run({ level: 0, from: 0, to: 2 }), // A, RLI
      new Run({ level: 1, from: 2, to: 3 }), // B
      new Run({ level: 0, from: 3, to: 5 }), // PDI, RLI
      new Run({ level: 1, from: 5, to: 6 }), // C
      new Run({ level: 0, from: 6, to: 8 }) // PDI, D
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

  it('should find level runs for "A·RLI·B·LRI·C·RLE·D·PDF·E·PDI·F·PDI·G"', () => {
    const codepoints = List.of(A, RLI, B, LRI, C, RLE, D, PDF, E, PDI, F, PDI, G);
    const bidiTypes = List.of('L', 'RLI', 'L', 'LRI', 'L', 'RLE', 'L', 'PDF', 'L', 'PDI', 'PDI', 'L', 'PDI', 'L');
    const runs = List.of(
      new Run({ level: 0, from: 0, to: 2 }), // A, RLI
      new Run({ level: 1, from: 2, to: 4 }), // B, LRI
      new Run({ level: 2, from: 4, to: 5 }), // C
      new Run({ level: 3, from: 5, to: 6 }), // D
      new Run({ level: 2, from: 6, to: 7 }), // E
      new Run({ level: 1, from: 7, to: 9 }), // PDI, F
      new Run({ level: 0, from: 9, to: 11 }) // PDI, G
    );
    expect(levelRuns(codepoints, bidiTypes)).to.equal(runs);
  });

});
