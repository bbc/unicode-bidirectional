import { List } from 'immutable';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI } from '../../../src/util/constant';
import { A, B, C, D, E, F, G } from '../../../src/util/constant';
import { Run } from '../../../src/type';
import levelRuns from '../../../src/paragraph/levelRuns';

describe('[Paragraph] - Level Runs', () => {
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
