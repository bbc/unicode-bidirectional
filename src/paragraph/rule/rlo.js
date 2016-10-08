import { MAX_DEPTH, RLO } from '../../util/constant';

function rlo(ch, bidiType, index, state) {
  if (ch !== RLO) return state;
  const lastEmbeddingLevel = state.get('directionalStatusStack').peek().get('level');
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');

  const newLevel = (lastEmbeddingLevel + 1) + (lastEmbeddingLevel % 2 === 0); // [1]
  const newLevelInvalid = (newLevel >= MAX_DEPTH); // [2]
  const isCurrentOverflow = (isolate > 0 || embedding > 0); // [2]
  const isOverflowRLE = (newLevelInvalid || isCurrentOverflow); // [2]

  if (isOverflowRLE) {
    if (isolate === 0) {
      return state.update('overflowEmbeddingCount', (c) => c + 1);
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
