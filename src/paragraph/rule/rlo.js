import { MAX_DEPTH, RLO } from '../../util/constant';
import { DirectionalStatusStackEntry } from '../../type';
import { increase } from '../../type';

function rlo(ch, bidiType, index, state) {
  if (ch !== RLO) return state;

  const lastLevel = state.get('directionalStatusStack').peek().get('level');
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');

  const newLevel = (lastLevel + 1) + (lastLevel % 2); // [1]
  const newLevelInvalid = (newLevel >= MAX_DEPTH); // [2]
  const isCurrentOverflow = (isolate > 0 || embedding > 0); // [2]
  const isOverflowRLE = (newLevelInvalid || isCurrentOverflow); // [2]

  if (isOverflowRLE) {
    if (isolate === 0) {
      return state.update('overflowEmbeddingCount', increase);
    } else {
      return state;
    }
  } else {
    return state.update('directionalStatusStack', (stack) => {
      return stack.push(new DirectionalStatusStackEntry({
        level: newLevel,
        override: 'right-to-left'
      }));
    });
  }
}

export default rlo;
