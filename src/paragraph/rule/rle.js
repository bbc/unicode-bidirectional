import { RLE, MAX_DEPTH } from '../../util/constant';
import { DirectionalStatusStackEntry } from '../../type';
import flow from 'lodash.flow';

// http://unicode.org/reports/tr9/#X2
// [1]: "Compute the least odd embedding level greater than the embedding level of
//       the last entry on the directional status stack"
// [2]: at max_depth or if either overflow count is non-zero, the level remains the same (overflow RLE).
function rle(ch, index, state) {
  if (ch !== RLE) return state;

  const lastLevel = state.get('directionalStatusStack').peek().get('level');
  return flow(
    function(state) {
      return state.setIn(['embeddingLevels', 'levels', index], lastLevel);
    },
    function(state) {
      const newLevel = (lastLevel + 1) + (lastLevel % 2);
      const newLevelInvalid = (newLevel >= MAX_DEPTH); // [2]

      const isolate = state.get('overflowIsolateCount');
      const embedding = state.get('overflowEmbeddingCount');
      const isCurrentOverflow = (isolate > 0 || embedding > 0); // [2]
      const isOverflowRLE = (newLevelInvalid || isCurrentOverflow); // [2]

      if (isOverflowRLE) {
        if (isolate === 0) {
          return state.update('overflowEmbeddingCount', increase);
        } else {
          return state;
        }
      } else {
        const newEntry = new DirectionalStatusStackEntry({ level: newLevel });
        return state.update('directionalStatusStack', (stack) => stack.push(newEntry));
      }
    }
  )(state);
}

export { rle };
