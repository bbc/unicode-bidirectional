import includes from 'lodash.includes';
import { List, Stack } from 'immutable';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI } from '../util/constant';
import { DirectionalStatusStackEntry, EmbeddingLevelState } from '../type';
import { Run } from '../type';
import { increase } from '../type';
import { rle, lre, rlo, lro, rli, lri, fsi, other, pdi, pdf } from './rule/rules';
import { isX9ControlCharacter } from '../util/constant';

// BD7.
// [1]: Apply rules X1-X8 to compute the embedding levels
// [2]: Process each character iteratively, applying rules X2 through X8.
// [3]: Each rule has type: (Character, Index, EmbeddingLevelState) -> EmbeddingLevelState
// [4]: Some rules modify the bidi types list and embedding levels
// [5]: Compute the runs by grouping adjacent characters with same the level numbers
//      with the exception of RLE, LRE and PDF which are stripped from output
function levelRuns(codepoints, bidiTypes, paragraphLevel = 0) {
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

  const initialStack = Stack.of(new DirectionalStatusStackEntry({ level: paragraphLevel }));
  const initial = new EmbeddingLevelState({ directionalStatusStack: initialStack })
    .set('bidiTypes', bidiTypes) // [4]
    .set('embeddingLevels', codepoints.map(__ => paragraphLevel)); // [4]

  const finalState = codepoints.reduce((state, ch, index) => { // [2]
    return rules.reduce((s, rule) => rule(ch, index, s), state);
  }, initial);

  return codepoints // [5]
    .zip(bidiTypes, finalState.get('embeddingLevels'))
    .filter(([__, t, ___]) => isX9ControlCharacter(t) === false) // X9.
    .reduce((runs, [codepoint, bidiTypes, level], index) => {
      const R = runs.size - 1;

      if (runs.getIn([R, 'level'], -1) === level) {
        return runs.updateIn([R, 'to'], increase);
      } else {
        return runs.push(new Run({ level, from: index, to: index + 1 }));
      }
    }, List.of());
}

export default levelRuns;
