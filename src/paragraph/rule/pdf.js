import { PDF } from '../../type';
import { decrease } from '../../type';
import flow from 'lodash.flow';

// http://unicode.org/reports/tr9/#X7
function pdf(ch, index, state) {
  if (ch !== PDF) return state;

  return flow(
    function(state) {
      const lastLevel = state.get('directionalStatusStack').peek().get('level');
      return state.setIn(['embeddingLevels', 'levels', index], lastLevel);
    },
    function(state) {
      const isolateOverflow = state.get('overflowIsolateCount');
      const embeddingOverflow = state.get('overflowEmbeddingCount');
      const stack = state.get('directionalStatusStack');
      const lastIsolateStatus = stack.peek().get('isolate');

      if (isolateOverflow > 0) {
        return state;
      } else if (embeddingOverflow > 0) {
        return state.update('overflowEmbeddingCount', decrease);
      } else if (lastIsolateStatus === false && stack.size >= 2) {
        return state.set('directionalStatusStack', stack.pop());
      } else {
        return state;
      }
    }
  )(state);
}

export { pdf }
