import { List } from 'immutable';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI } from '../../src/util/constant';
import { A, B, C, D, E, F, G } from '../../src/util/constant';
import { Run, Sequence } from '../../src/type';
import isolatingRunSequences from '../../src/paragraph/isolatingRunSequences';

describe('[Paragraph] - Isolating Run Sequences', () => {
  it('should find a trivial sequence', () => {
    const codepoints = List.of(A, B, C);
    const bidiTypes = List.of('L', 'L', 'L');
    const sequences = List.of(
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(
        new Run({ level: 0, from: 0, to: 3 }) // A, B, C
      )})
    );
    expect(isolatingRunSequences(codepoints, bidiTypes)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLI·B·PDI·RLI·C·PDI·D"', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const types = List.of('L', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const sequences = List.of(
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(
        new Run({ level: 0, from: 0, to: 2 }), // A, RLI
        new Run({ level: 0, from: 3, to: 5 }), // PDI, RLI
        new Run({ level: 0, from: 6, to: 8 })  // D, PDI
      )}),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 1, from: 2, to: 3 })), // B,
      }),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 1, from: 5, to: 6 })) // C
      })
    );
    expect(isolatingRunSequences(codepoints, types)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLI·B·LRI·C·RLE·D·PDF·E·PDI·F·PDI·G"', () => {
    const codepoints = List.of(A, RLI, B, LRI, C, RLE, D, PDF, E, PDI, F, PDI, G);
    const ts = List.of('L', 'RLI', 'L', 'LRI', 'L', 'RLE', 'L', 'PDF', 'L', 'PDI', 'L', 'PDI', 'L');
    const sequences = List.of(
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(
        new Run({ level: 0, from: 0, to: 2 }),  // A, RLI
        new Run({ level: 0, from: 9, to: 11 })  // PDI, G
      )}),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 1, from: 2, to: 4 }), // B, LRI
        new Run({ level: 1, from: 7, to: 9 })  // PDI, F
      )}),
      new Sequence({ sos: 'L', eos: 'R', runs: List.of(
        new Run({ level: 2, from: 4, to: 5 })), // C
      }),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 3, from: 5, to: 6 })), // D
      }),
      new Sequence({ sos: 'R', eos: 'L', runs: List.of(
        new Run({ level: 2, from: 6, to: 7 }))  // E
      })
    );
    expect(isolatingRunSequences(codepoints, ts)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLE·B·LRE·C·PDF·D·PDF·RLE·E·PDF·F"', () => {
    const codepoints = List.of(A, RLE, B, LRE, C, PDF, D, PDF, RLE, E, PDF, F);
    const types = List.of('L', 'RLE', 'L', 'LRE', 'L', 'PDF', 'L', 'PDF', 'RLE', 'L', 'PDF', 'L');
    const sequences = List.of(
      new Sequence({ sos: 'L', eos: 'R', runs: List.of(new Run({ level: 0, from: 0, to: 1 })) }),
      new Sequence({ sos: 'R', eos: 'L', runs: List.of(new Run({ level: 1, from: 1, to: 2 })) }),
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(new Run({ level: 2, from: 2, to: 3 })) }),
      new Sequence({ sos: 'L', eos: 'R', runs: List.of(new Run({ level: 1, from: 3, to: 5 }),)}),
      new Sequence({ sos: 'R', eos: 'L', runs: List.of(new Run({ level: 0, from: 5, to: 6 })) }),
    );
    expect(isolatingRunSequences(codepoints, types)).to.equal(sequences);
  });

  it('should find the sequences for "A·RLI·B·LRI·C·PDI·D·PDI·RLI·E·PDI·F"', () => {
    const codepoints = List.of(A, RLI, B, LRI, C, PDI, D, PDI, RLI, E, PDI, F);
    const types = List.of('L', 'LRI', 'L', 'LRI', 'L', 'PDI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'L');
    const sequences = List.of(
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(
        new Run({ level: 0, from: 0, to: 2 }),
        new Run({ level: 0, from: 7, to: 9 }),
        new Run({ level: 0, from: 10, to: 12 }))
      }),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 1, from: 2, to: 4 }),
        new Run({ level: 1, from: 5, to: 7 })),
      }),
      new Sequence({ sos: 'L', eos: 'L', runs: List.of(
        new Run({ level: 2, from: 4, to: 5 }))
      }),
      new Sequence({ sos: 'R', eos: 'R', runs: List.of(
        new Run({ level: 1, from: 9, to: 10 }))
      })
    );
    expect(isolatingRunSequences(codepoints, types)).to.equal(sequences);
  });

});
