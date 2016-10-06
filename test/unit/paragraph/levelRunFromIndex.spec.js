import { List } from 'immutable';
import { Run } from '../../../src/type';
import levelRunFromIndex from '../../../src/paragraph/levelRunFromIndex';

describe('[Paragraph] Finding level run from isolating run sequence by index', () => {

  it('should find [0:1] for index = 0 and seq = [[0:1]]', () => {
    const run = new Run({ level: 0, from: 0, to: 1 });
    const sequence = List.of(run);
    expect(levelRunFromIndex(sequence, 0)).to.equal(run);
  });

  it('should find [10:20] for index = 15 and seq = [[0:10],[10:20],[20:30]]', () => {
    const first = new Run({ level: 0, from: 0, to: 10 });
    const second = new Run({ level: 0, from: 10, to: 20 });
    const third = new Run({ level: 0, from: 20, to: 30 });
    const sequence = List.of(first, second, third);
    expect(levelRunFromIndex(sequence, 15)).to.equal(second);
  });

  it('should return an empty run when index does not intersect any runs', () => {
    // e.g. 35 doesnt intersect [[0:10],[10:20],[20:30]]
    const first = new Run({ level: 0, from: 0, to: 10 });
    const second = new Run({ level: 0, from: 10, to: 20 });
    const third = new Run({ level: 0, from: 20, to: 30 });
    const sequence = List.of(first, second, third);
    expect(levelRunFromIndex(sequence, 35)).to.equal(new Run());
  });

});
