import flow from 'lodash.flow';
import includes from 'lodash.includes';
import { isNonFormatting } from '../../util/constant';

// TODO: change name of this function to 'setLevel'
function other(ch, bidiType, index, state) {
  if (isNonFormatting(bidiType)) return state;

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
    }
  )(state);
}

export default other;
