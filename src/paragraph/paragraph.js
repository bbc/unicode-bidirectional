import includes from 'lodash.includes';

import { Stack, List, Record } from 'immutable';
import { DirectionalStatusStackEntry, EmbeddingLevelState } from '../type';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../type';
import { Run } from '../type';

import { rle } from './rle';
import lre from './lre';
import rlo from './rlo';
function lro(ch, index, state) { return state; }
import { rli } from './rli';
import { lri } from './lri';
function fsi(ch, index, state) { return state; }
import other from './other';
import { pdi } from './pdi';
import { pdf } from './pdf';

// BD7. A level run is a maximal substring of characters that have the same embedding level.
// It is maximal in that no character immediately before or after
// the substring has the same level (a level run is also known as a directional run).
// [1]: Apply rules X1-X8 to compute the embedding levels
// [2]: Process each character iteratively, applying rules X2 through X8.
// [3]: Each rule has type: (Character, Index, EmbeddingLevelState) -> EmbeddingLevelState
// NB. Some rules modify the bidi type.
function levelRuns(codepoints, bidiTypes) {
  const rules = [
    rle,   // X2.
    lre,   // X3.
    //rlo  // X4.
    //lro  // X5.
    rli,   // X5a.
    lri,   // X5b.
    //fsi  // X5c.
    other, // X6.
    pdi,   // X6a.
    pdf    // X7.
  ]; // [1][3]
  const initial = new EmbeddingLevelState() // X1.
    .set('bidiTypes', bidiTypes)
    .set('embeddingLevels', codepoints.map(__ => 0));

  const finalState = codepoints.reduce((state, ch, index) => {
    return rules.reduce((s, rule) => rule(ch, index, s), state);
  }, initial);

  return codepoints
    .zip(finalState.get('embeddingLevels'))
    .reduce((runs, [codepoint, level]) => {
      if (includes([RLE, PDF], codepoint)) {
        return runs;
      } else if (!runs.isEmpty() && runs.last().get('level') === level) {
        return runs.updateIn([runs.size - 1, 'codepoints'], cps => cps.push(codepoint));
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

export { levelRuns }
