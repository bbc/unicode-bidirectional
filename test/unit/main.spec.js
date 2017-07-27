import { resolve, reorder, reorderPermutation, mirror, constants } from '../../src/main';
import { LEFT_PAR, RIGHT_PAR } from '../../src/util/constant';

describe('[API] Public API - main', () => {

  it('should expose "resolve()" so consumers can find levels', () => {
    // and then later use those levels to reorder codepoints
    const codepoints = [0x0645, 0x0627, 0x0631, 0x0652, 0x0643];
    const levels = resolve(codepoints, 0);
    expect(levels).to.deep.equal([1,1,1,1,1]);
  });

  it('should expose "reorder()" so consumers can reorder codepoints', () => {
    const codepoints = [0x0645, 0x0627, 0x0631, 0x0652, 0x0643];
    const reordered = reorder(codepoints, [1,1,1,1,1]);
    expect(reordered).to.deep.equal(codepoints.reverse());
  });

  it('should expose "reorderPermutation()" so consumers can convert levels to permutations', () => {
    const levels = [1,1,1,0,0,0];
    const permutation = [2,1,0,3,4,5];
    const reordered = reorderPermutation(levels);
    expect(reordered).to.deep.equal(permutation);
  });

  it('should expose "mirror()" so consumers can mirror codepoints that sgould be mirrored', () => {
    const codepoints = [LEFT_PAR, RIGHT_PAR];
    const levels = [1, 1];
    const mirrored = [RIGHT_PAR, LEFT_PAR];
    expect(mirror(codepoints, levels)).to.deep.equal(mirrored);
  });

  it('should expose the mirror map in constants', () => {
    const mirrorMap = constants.mirrorMap;
    expect(mirrorMap.get(LEFT_PAR)).to.equal(')');
  });

  it('should expose the opening brackets set in constants', () => {
    const openingBrackets = constants.openingBrackets;
    expect(openingBrackets.has(LEFT_PAR)).to.equal(true);
  });

  it('should expose the closing brackets set in constants', () => {
    const closingBrackets = constants.closingBrackets;
    expect(closingBrackets.has(RIGHT_PAR)).to.equal(true);
  });

  it('should expose the opposite bracket map in constants', () => {
    const oppositeBracket = constants.oppositeBracket;
    expect(oppositeBracket.get(LEFT_PAR)).to.equal(RIGHT_PAR);
    expect(oppositeBracket.get(RIGHT_PAR)).to.equal(LEFT_PAR);
  });

});
