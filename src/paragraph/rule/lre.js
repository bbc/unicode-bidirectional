import flow from 'lodash.flow';
import { LRE, MAX_DEPTH } from '../../util/constant';
import { increase, DirectionalStatusStackEntry } from '../../type';

// http://unicode.org/reports/tr9/#X3
function lre(ch, bidiType, index, state) {
  if (ch !== LRE) return state;

  const lastLevel = state.get('directionalStatusStack').peek().get('level');
  return flow(
    function(state) {
      return state.setIn(['embeddingLevels', 'levels', index], lastLevel);
    },
    function(state) {
      const newLevel = (lastLevel + 1) + ((lastLevel + 1) % 2);
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

export default lre;
