import { Stack, List, Record } from 'immutable';
import { DirectionalStatusStackEntry, EmbeddingLevelState } from '../type';
import { increase, decrease } from '../type';
import { MAX_DEPTH } from '../type';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../type';
import { Run } from '../type';
import { rli } from './rli';
import { rle } from './rle';
import { pdf } from './pdf';
import includes from 'lodash.includes';

const push = (state, x) => state.update('directionalStatusStack', (stack) => stack.push(x));
const pop =  (state, x) => state.update('directionalStatusStack', (stack) => stack.pop());

function lre(ch, index, state) {
  return state;
}

function rlo(ch, index, state) {
  if (ch !== RLO) return state;
  const lastEmbeddingLevel = state.get('directionalStatusStack').peek().get('level');
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

function lro(ch, index, state) {
  return state;
}

function isCurrentlyOverflowing(state) {
  const isolate = state.get('overflowIsolateCount');
  const embedding = state.get('overflowEmbeddingCount');
  return (isolate > 0 || embedding > 0); // [2]
}

function lri(ch, index, state) {
  return state;
}

function fsi(ch, index, state) {
  return state;
}

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
function pdi(ch, index, state) {
  if (ch !== PDI) return state;
  const isolateOverflow = state.get('overflowIsolateCount');
  const validIsolateCount = state.get('validIsolateCount');

  function updateCounts() {
    if (isolateOverflow > 0) { // [A]
      return state.update('overflowIsolateCount', decrease);
    } else if (validIsolateCount > 0) { // [B]
      return state;
    } else { // [C]
      return state
        .set('overflowEmbeddingCount', 0)
        .update('directionalStatusStack', (stack) => { // [C1]
          return stack
            .skipWhile(entry => entry.get('isolate') == false)
            .reverse()
        });
    }
  }

  const intermediate = updateCounts().update('characterTypes', (ts) => ts.set(index, overrride)); // [D]
  const lastOverride = intermediate.get('directionalStatusStack').peek().get('override');
  if (lastOverrride !== 'neutral') {
    const override = (lastOverride === 'left-to-right') ? 'L' : 'R';
    return intermediate
      .update('directionalStatusStack', (stack) => {
        return stack.push(new DirectionalStatusStackEntry({
          level: prevLevel,
          override: 'right-to-left'
        }));
      });
  } else {
    return intermediate;
  }
}


// BD7. A level run is a maximal substring of characters that have the same embedding level.
// It is maximal in that no character immediately before or after
// the substring has the same level (a level run is also known as a directional run).
// Apply rules X1-X8 to compute the embedding levels
// Process each character iteratively, applying rules X2 through X8.
// Each rule has type: (Character, Index, EmbeddingLevelState) -> EmbeddingLevelState
// NB. Some rules modify the bidi type.
// const rules = [rle, lre, rlo, lro, rli, lri, pdi, pdf];
function levelRuns(codepoints, bidiTypes) {
  const rules = [rle, rli, pdf];
  const initial = new EmbeddingLevelState()
    .set('bidiTypes', bidiTypes)
    .set('embeddingLevels', codepoints.map(__ => 0));

  const finalState = codepoints.reduce((state, ch, index) => {
    return rules.reduce((beforeRule, rule) => {
      const afterRule = rule(ch, index, beforeRule);
      const level = afterRule.get('directionalStatusStack').peek().get('level');
      return afterRule.update('embeddingLevels', (levels) => levels.set(index, level));
    }, state);
  }, initial);

  return codepoints
    .zip(finalState.get('embeddingLevels'))
    .reduce((runs, [codepoint, level]) => {
      if (includes([RLE, PDF], codepoint)) {
        return runs;
      } else if (!runs.isEmpty() && runs.last().get('level') === level) {
        return runs.updateIn([runs.size - 1, 'codepoints'], (cps) => cps.push(codepoint));
      } else {
        return runs.push(new Run({ codepoints: List.of(codepoint), level }));
      }
    }, List.of());
}

// BD13. Start with an empty set of isolating run sequences.
// For each level run in the paragraph whose first character is not a PDI, or is a PDI that does not match any isolate initiator:
// - Create a new level run sequence, and initialize it to contain just that level run.
// - While the level run currently last in the sequence ends with an isolate initiator that has a matching PDI,
//   append the level run containing the matching PDI to the sequence. (Note that this matching PDI must be the first character of its level run.)
// - Add the resulting sequence of level runs to the set of isolating run sequences.
function isolatingRuns() {
}

export { levelRuns, push, rle, rlo }
