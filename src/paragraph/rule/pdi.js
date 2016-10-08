import flow from 'lodash.flow';
import { PDI } from '../../util/constant';
import { decrease } from '../../type';

// http://unicode.org/reports/tr9/#X6a
// [A]: "If the overflow isolate count is greater than zero, this PDI matches an
//      overflow isolate initiator. Decrement the overflow isolate count by one."
// [B]: "Otherwise, if the valid isolate count is zero, this PDI does not match any
//      isolate initiator, valid or overflow. Do nothing."
// [C]: "Otherwise, this PDI matches a valid isolate initiator."
// [C1]: "While the directional isolate status of the last entry on
//      the stack is false, pop the last entry from the directional status stack"
// [D]: "In all cases, look up the last entry on the directional status stack left after the steps above and:
//       - Set the PDI’s level to the entry's embedding level.
//       - If the entry's directional override status is not neutral, reset the current character type from PDI to
//       L if the override status is left-to-right, and to R if the override status is right-to-left."
function pdi(ch, bidiType, index, state) {
  if (ch !== PDI) return state;
  const isolateOverflow = state.get('overflowIsolateCount');
  const validIsolateCount = state.get('validIsolateCount');

  return flow(
    function updateCounts(state) {
      if (isolateOverflow > 0) { // [A]
        return state.update('overflowIsolateCount', decrease);
      } else if (validIsolateCount === 0) { // [B]
        return state;
      } else { // [C]
        return state
          .set('overflowEmbeddingCount', 0)
          .update('directionalStatusStack', (stack) => { // [C1]
            return stack.skipWhile(entry => entry.get('isolate') === false)
          })
          .update('directionalStatusStack', (stack) => stack.pop())
          .update('validIsolateCount', decrease);
      }
    },
    function(state) {
      const lastEntry = state.get('directionalStatusStack').peek();
      const lastLevel = lastEntry.get('level');
      return state.update('embeddingLevels', ls => ls.set(index, lastLevel))
    },
    function checkOverride(state) {
      const lastOverride = state.get('directionalStatusStack').peek().get('override');
      if (lastOverride !== 'neutral') {
        const override = (lastOverride === 'left-to-right') ? 'L' : 'R';
        return state.setIn(['bidiTypes', index], override);
      } else {
        return state;
      }
    }
  )(state);

}

export { pdi }
