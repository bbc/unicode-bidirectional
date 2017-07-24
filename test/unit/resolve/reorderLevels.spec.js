import { List, Map } from 'immutable';
import reorderedLevels, { reorderPermutation } from '../../../src/resolve/reorderedLevels';

describe('[Resolve] - Reordering levels by rule L2.', () => {
  // - "Uppercase letters stand for right-to-left characters (such as Arabic or Hebrew)"
  // - "Lowercase letters stand for left-to-right characters (such as English or Russian)."
  // - "LRI, RLI, and PDI are represented with the symbols >, <, and =, respectively"

  it('should reorder a single level', () => {
    const storage = List('car means CAR.');
    const resolvedLevels = List.of(0,0,0,0,0,0,0,0,0,0,1,1,1,0);
    const display = List('car means RAC.');
    expect(reorderedLevels(storage, resolvedLevels)).to.equal(display);
  });

  it('should reorder for a tree of depth two', () => {
    const storage = List('<car MEANS CAR.=');
    const resolvedLevels = List.of(0,2,2,2,1,1,1,1,1,1,1,1,1,1,1,0);
    const display = List('<.RAC SNAEM car=');
    expect(reorderedLevels(storage, resolvedLevels)).to.equal(display);
  });

  it('should reorder for a tree of depth two with two siblings', () => {
    const storage = List('he said “<car MEANS CAR=.” “<IT DOES=,” she agreed.');
    const resolvedLevels = List.of(0,0,0,0,0,0,0,0,0,0,2,2,2,1,1,1,1,1,1,
        1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    const display = List('he said “<RAC SNAEM car=.” “<SEOD TI=,” she agreed.');
    expect(reorderedLevels(storage, resolvedLevels)).to.equal(display);
  });

  it('should reorder for a tree of depth two with two siblings', () => {
    const storage = List('DID YOU SAY ’>he said “<car MEANS CAR=”=‘?');
    const resolvedLevels = List.of(1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,
        2,2,2,2,2,2,4,4,4,3,3,3,3,3,3,3,3,3,3,2,2,1,1,1);
    const display = List('?‘=he said “<RAC SNAEM car=”>’ YAS UOY DID');
    expect(reorderedLevels(storage, resolvedLevels)).to.equal(display);
  });

  it('should be that [2, 1] swaps the first and second elements of display', () => {
    expect(reorderedLevels(List.of(0, 1), List.of(2, 1))).to.equal(List.of(1, 0));
  });

  it('should be that [1, 1] swaps the first and second elements of storage', () => {
    expect(reorderedLevels(List.of(0, 1), List.of(1, 1))).to.equal(List.of(1, 0));
  });

  it('should be that [1, 1, 1] reverses a storage of length 3', () => {
    expect(reorderedLevels(List.of(0, 1, 2), List.of(1, 1, 1))).to.equal(List.of(2, 1, 0));
  });

  it('should be that [1, 1, 1, 1] reverses storage of length 4', () => {
    const storage = List.of(1,2,3,4);
    expect(reorderedLevels(storage, List.of(1, 1, 1, 1))).to.equal(storage.reverse());
  });

  it('should be that [4, 3, 2, 1] performs four reversals', () => {
    const levels = List.of(4,3,2,1);
    const storage = List.of(1,2,3,4);
    // 1234 -> 1234 -> 2134 -> 3124 -> 4213
    const display = List.of(4,2,1,3)
    expect(reorderedLevels(storage, levels)).to.equal(display);
  });
});

describe('[Resolve] - Reorder-Permutations', () => {

  it('should give the identity permutation for levels [0,0]', () => {
    expect(reorderPermutation(List.of(0,0))).to.equal(List.of(0,1));
  });

  it('should give [1,0] permutation for levels [1,1]', () => {
    expect(reorderPermutation(List.of(1,1))).to.equal(List.of(1,0));
  });

  it('should give the reversing permutation for levels [1,1,1,2,1,1,1,1,1,2]', () => {
    const levels = List.of(1,1,1,2,1,1,1,1,1,2);
    const reverse = List.of(9,8,7,6,5,4,3,2,1,0)
    expect(reorderPermutation(levels)).to.equal(reverse);
  });

  // https://github.com/bbc/unicode-bidirectional/issues/23
  it('should handle levels marked as invisible ("x")', () => {
    const x = 'x'; // denotes invisible
    const levels = List.of(x,x,x,x,x,x,x,0);
    const permutation = List.of(0,1,2,3,4,5,6,7);
    expect(reorderPermutation(levels)).to.equal(permutation);
  });

  it('should handle handle RTL reordering across levels marked as invisible ("x")', () => {
    const x = 'x'; // denotes invisible
    const levels = List.of(1,1,1,x,x,x,1,1,1);
    const permutation = List.of(8,7,6,3,4,5,2,1,0);
    expect(reorderPermutation(levels)).to.equal(permutation);
  });

  describe('using IGNORE_INVISIBLE = true', () => {
    const IGNORE_INVISIBLE = true;

    it('should give [] for when all levels are marked as invisible ("x")', () => {
      expect(reorderPermutation(List.of('x','x', 'x'), IGNORE_INVISIBLE)).to.equal(List.of());
    });

    it('should give partial permutations; ignoring all levels marked as invisible ("x")', () => {
      expect(reorderPermutation(List.of(0,'x',1,'x'), IGNORE_INVISIBLE)).to.equal(List.of(0,2));
      expect(reorderPermutation(List.of('x',1,4), IGNORE_INVISIBLE)).to.equal(List.of(2,1));
      expect(reorderPermutation(List.of(2,1,'x',1), IGNORE_INVISIBLE)).to.equal(List.of(3,1,0));
    });

    it('should for larger example give partial permutations; ignoring levels marked as ("x")', () => {
      const x = 'x'; // denotes invisible
      const levels = List.of(0,x,1,1,2,x,3,x,2,1,1,x,0);
      const permutation = List.of(0,10,9,4,6,8,3,2,12)
      expect(reorderPermutation(levels, IGNORE_INVISIBLE)).to.equal(permutation);
    });

    // https://github.com/bbc/unicode-bidirectional/issues/23
    it('should give a parital permutation of [7] for seven zero-width spaces followed by LF', () => {
      const x = 'x'; // denotes invisible
      const levels = List.of(x,x,x,x,x,x,x,0);
      const permutation = List.of(7);
      expect(reorderPermutation(levels, IGNORE_INVISIBLE)).to.equal(permutation);
    });
  })

});

