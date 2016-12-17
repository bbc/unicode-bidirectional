import { List } from 'immutable';
import reorderedLevels from '../../../src/resolve/reorderedLevels';

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

});

