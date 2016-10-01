import { List } from 'immutable';
import { isolatingRunSequences } from '../../src/paragraph/paragraph';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../../src/type';
import { Run } from '../../src/type';

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const E = 0x0045; // U+0044 LATIN CAPITAL LETTER E
const F = 0x0046; // U+0044 LATIN CAPITAL LETTER F
const G = 0x0047; // U+0044 LATIN CAPITAL LETTER G

describe('Paragraph - Isolating Run Sequences', () => {
  it('should find a trivial sequence', () => {
    const codepoints = List.of(A, B, C);
    const bidiTypes = List.of('L', 'L', 'L');
    const sequences = List.of(List.of(new Run({ level: 0, from: 0, to: 3 })));
    expect(isolatingRunSequences(codepoints, bidiTypes)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLI·B·PDI·RLI·C·PDI·D"', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const bidiTypes = List.of('L', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const sequences = List.of(
      List.of(
        new Run({ level: 0, from: 0, to: 2 }), // A, RLI
        new Run({ level: 0, from: 3, to: 5 }), // PDI, RLI
        new Run({ level: 0, from: 6, to: 8 })  // D, PDI
      ),
      List.of(new Run({ level: 1, from: 2, to: 3 })), // B,
      List.of(new Run({ level: 1, from: 5, to: 6 })) // C
    );
    expect(isolatingRunSequences(codepoints, bidiTypes)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLI·B·LRI·C·RLE·D·PDF·E·PDI·F·PDI·G"', () => {
    const codepoints = List.of(
      A, RLI, B, LRI, C, RLE,
      D, PDF, E, PDI, F, PDI, G
    );
    const bidiTypes = List.of(
      'L', 'RLI', 'L', 'LRI', 'D', 'RLE',
      'L', 'PDF', 'L', 'PDI', 'L', 'PDI', 'L'
    );
    const sequences = List.of(
      List.of(
        new Run({ level: 0, from: 0, to: 2 }),  // A, RLI
        new Run({ level: 0, from: 9, to: 11 })  // PDI, G
      ),
      List.of(
        new Run({ level: 1, from: 2, to: 4 }), // B, LRI
        new Run({ level: 1, from: 7, to: 9 })  // PDI, F
      ),
      List.of(new Run({ level: 2, from: 4, to: 5 })), // C
      List.of(new Run({ level: 3, from: 5, to: 6 })), // D
      List.of(new Run({ level: 2, from: 6, to: 7 }))  // E
    );
    expect(isolatingRunSequences(codepoints, bidiTypes)).to.equal(sequences);
  });
});
