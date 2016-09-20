import { List, Record } from 'immutable';

// -------------------------------------------------
// 3.3.2 Explicit Levels and Directions
//
// [1]: the "directional status stack"
// [2]: "At the start of the pass, the directional status stack is initialized to
//       an entry reflecting the paragraph embedding level, ..."
// [6]: Initial value described by X1.
const MAX_DEPTH = 125;
const DirectionalStatusStackEntry = Record({
  characterType: '',
  level: 0,
  override: 'neutral',
  isolate: false
});
const EmbeddingLevelState = Record({
  directionalStatusStack: List.of(new DirectionalStatusStackEntry()), // [1]
  overflowIsolateCount: 0,
  overflowEmbeddingCount: 0,
  validIsolateCount: 0
}); // [6]

function push(state, x) {
  return state.update('directionalStatusStack', (stack) => stack.push(x));
}

// http://unicode.org/reports/tr9/#X2
// [1]: "Compute the least odd embedding level greater than the embedding level of
//       the last entry on the directional status stack"
// [2]: at max_depth or if either overflow count is non-zero, the level remains the same (overflow RLE).
function rle(state) {
  const lastEmbeddingLevel = state.get('directionalStatusStack').last().get('level');
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');

  const newLevel = (lastEmbeddingLevel % 2 === 0) ? lastEmbeddingLevel + 1 : lastEmbeddingLevel + 2; // [1]
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
        level: newLevel
      }));
    });
  }
}

function lre(state) {
}

function rlo(state) {
  const lastEmbeddingLevel = state.get('directionalStatusStack').last().get('level');
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');

  const newLevel = (lastEmbeddingLevel % 2 === 0) ? lastEmbeddingLevel + 1 : lastEmbeddingLevel + 2; // [1]
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

function lro(state) {
}

function rli(state, index=0) {
  const lastEntry = state.get('directionalStatusStack').last();
  const lastLevel = lastEntry.get('level');
  const lastOverride = lastEntry.get('override');

  if (lastOverrride === 'left-to-right') {
    state.update('characterTypes', (characterTypes) => {
      return characterTypes.update(index, (type) => 'L');
    });
  }
  if (lastOverrride === 'right-to-right') {
    state.update('characterTypes', (characterTypes) => {
      return characterTypes.update(index, (type) => 'R');
    });
  }

  const newLevel = (lastLevel % 2 === 0) ? lastLevel + 1 : lastLevel + 2; // [1]
  const newLevelInvalid = (newLevel >= MAX_DEPTH); // [2]
  const isCurrentOverflow = (isolate > 0 || embedding > 0); // [2]
  const isOverflow = (newLevelInvalid || isCurrentOverflow); // [2]

  if (isOverflow) {
    return state.update('overflowIsolateCount', (c) => c + 1);
  } else {
    return state
      .update('validIsolateCount', (c) => c + 1)
      .update('directionalStatusStack', (stack) => {
        return stack.push(new DirectionalStatusStackEntry({
          level: newLevel,
          override: 'right-to-left'
        }));
      });
  }
}

function lri(state) {
}

// [1]: "While the directional isolate status of the last entry on
//      the stack is false, pop the last entry from the directional status stack"
function pdi(state) {
  const isolateOverflow = state.get('overflowIsolateCount');
  const validIsolateCount = state.get('validIsolateCount');

  // in all cases:
  // if (lastOverrride === 'left-to-right') {
  //   state.update('characterTypes', (characterTypes) => {
  //     return characterTypes.update(index, (type) => 'L');
  //   });
  // }
  // if (lastOverrride === 'right-to-right') {
  //   state.update('characterTypes', (characterTypes) => {
  //     return characterTypes.update(index, (type) => 'R');
  //   });
  // }
  // .update('directionalStatusStack', (stack) => {
  //   return stack.push(new DirectionalStatusStackEntry({
  //     level: prevLevel,
  //     override: 'right-to-left'
  //   }));
  // });

  // this PDI matches an overflow isolate initiator.
  // this PDI does not match any isolate initiator, valid or overflow
  // this PDI matches a valid isolate initiator
  if (isolateOverflow > 0) { // []
    return state.update('overflowIsolateCount', (c) => c + 1);
  } else if (validIsolateCount > 0) { // []
    return state;
  } else { // []
    return state
      .set('overflowEmbeddingCount', 0)
      .update('directionalStatusStack', (stack) => {
        return stack
          .reverse()
          .takeWhile(entry => entry.get('isolate') == false)
          .reverse() // [1]
      });
  }
}

// http://unicode.org/reports/tr9/#X7
function pdf(state) {
  if (isolateOverflow > 0) { // []
    return state;
  } else if (embeddingOverflow > 0) {
    return state.update('overflowEmbeddingCount', (c) => c - 1);
  } else if (lastIsolateStatus === 'false' && stack.size() >= 2) {
    return pop(state);
  } else {
    return state;
  }
}


export {
  MAX_DEPTH,
  push,
  DirectionalStatusStackEntry,
  EmbeddingLevelState,
  rle,
  rlo
}
