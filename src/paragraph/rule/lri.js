import flow from 'lodash.flow';
import { DirectionalStatusStackEntry } from '../../type';
import { increase } from '../../type';
import { LRI, MAX_DEPTH } from '../../util/constant';

function isCurrentlyOverflowing(state) {
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');
  return (isolate > 0 || embedding > 0); // [2]
}

// http://unicode.org/reports/tr9/#X5a
// [1]: "Set the LRI’s embedding level to the embedding level
//      of the last entry on the directional status stack."
// [2]:
function lri(ch, bidiType, index, state) {
  if (ch !== LRI) return state;
  const lastEntry = state.get('directionalStatusStack').peek();
  const lastLevel = lastEntry.get('level');

  return flow(
    function setEmbedding(state) { // [1]
      return state.update('embeddingLevels', ls => ls.set(index, lastLevel))
    },
    function checkOverride(state) {
      const lastOverride = lastEntry.get('override');

      if (lastOverride !== 'neutral') {
        const override = (lastOverride === 'left-to-right') ? 'L' : 'R';
        return state.update('bidiTypes', ts => ts.set(index, 'R'))
      } else {
        return state;
      }
    },
    function increaseLevel(state) {
      const newLevel = (lastLevel + 1) + ((lastLevel + 1) % 2);
      const newLevelInvalid = (newLevel >= MAX_DEPTH); // [2]
      const isOverflow = (newLevelInvalid || isCurrentlyOverflowing(state)); // [2]

      if (isOverflow) return state.update('overflowIsolateCount', increase);
      return state
        .update('validIsolateCount', increase)
        .update('directionalStatusStack', (stack) => {
          return stack.push(new DirectionalStatusStackEntry({
            isolate: true,
            level: newLevel,
          }));
        });
    }
  )(state);
}

export { lri };
