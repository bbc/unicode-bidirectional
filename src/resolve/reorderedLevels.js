import { List, Map, Range, Record } from 'immutable';
import isNumber from 'lodash.isnumber';

const ReorderPair = Record({ level: -1, from: 0, to: 0 }, 'ReorderPair');

const spliceList = (list, from, to, paste) => {
  const left = list.slice(0, from);
  const right = list.slice(to);
  return left.concat(paste).concat(right);
};

// Returns the storage -> display reordering performed by UBA
// representing as a permutation on the set {0, 1, 2, ... n - 1}
// Permutation represented via "one-line notation"
// see: https://en.wikipedia.org/wiki/Permutation#Definition_and_notations
function reorderPermutation(levels, INVISIBLE_MARK = 'x') {
  const storage = List(Range(0, levels.size))
    .map(i => Map({ strip: levels.get(i) === 'x', index: i }))
    .filter(x => x.get('strip') === false)
    .map(x => x.get('index'));

  const levelsWithoutInvisibles = levels.filter(x => x != INVISIBLE_MARK);
  return reorderedLevels(storage, levelsWithoutInvisibles);
}

// http://www.unicode.org/reports/tr9/#L2
// first:   reverse slices at levels:  max
// then:    reverse slices at levels:  max,max-1
// then:    reverse slices at levels:  max,max-1,max-2
// ...
// finally: reverse slices at levels:  max,max-1,max-2,...,1
function reorderedLevels(storage, levels) {
  const slicesByLevel = reorderingSlices(levels, 0)
    .groupBy(slice => slice.get('level'));

  const maxLevel = slicesByLevel.keySeq().max();
  if (!isNumber(maxLevel) || maxLevel < 0) {
    return storage;
  }

  if (maxLevel === 0) {
    return storage;
  } else {
    const slices = slicesByLevel.get(maxLevel);

    const storageAfter = slices.reduce((curr, slice) => {
      const { from, to } = slice.toJS();
      const reversed = curr.slice(from, to).reverse();
      return spliceList(curr, from, to, reversed);
    }, storage)

    const levelsAfter = slices.reduce((curr, slice) => {
      const { from, to } = slice.toJS();
      const nextLevel = List(Range(0, to - from)).map(__ => maxLevel - 1);
      return spliceList(curr, from, to, nextLevel);
    }, levels)

    return reorderedLevels(storageAfter, levelsAfter);
  }
}

function reorderingSlices(levels, offset) {
  const N = levels.size;
  if (N === 0) return List.of();

  const level = levels.first();
  const nextLevelIndex = levels.findKey(v => v != level);
  const size = (nextLevelIndex === undefined) ? N : nextLevelIndex;
  const slice = new ReorderPair({ level, from: offset, to: offset + size });

  return List.of(slice)
    .concat(reorderingSlices(levels.slice(size), offset + size));
}

export { reorderPermutation };
export default reorderedLevels;
