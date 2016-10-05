import isUndefined from 'lodash.isundefined';
import includes from 'lodash.includes';
import { BracketPairStackEntry, Pairing, BracketPairState } from '../type';
import { LEFT_PAR, RIGHT_PAR } from '../util/constant';
import { LEFT_SQUARE, RIGHT_SQUARE } from '../util/constant';
import { LEFT_CURLY, RIGHT_CURLY } from '../util/constant';
import { isOpeningBracket, isClosingBracket } from '../util/constant';
import { oppositeBracket } from '../util/constant';

// --| bracketPairs(points: List<Int>, types: List<String>): List<Pairing>
// --| Computes the bracket pairs (c.f. BD16) can that occur in an isolating run sequence.
// --| points - sequence of codepoints representing piece of text that may contain brackets
// --| bidiTypes - sequence of bidirectional character types
// --| Note: Bracket pairs can only occur in an isolating run sequence because they
// --| are processed in rule N0 after explicit level resolution
function bracketPairs(points, bidiTypes) {
  // [1]: Sort the list of pairs of text positions in ascending order
  //      based on the text position of the opening paired bracket.
  const initialState = new BracketPairState();
  const finalState = points.reduce((state, point, position) => {
    const stack = state.get('stack');

    if (isOpeningBracket(point, 'ON')) {
      return state.set('stack', stack.push(new BracketPairStackEntry({
        point: oppositeBracket(point),
        position
      })));
    } else if (isClosingBracket(point, 'ON') && stack.size > 0) {
      const openIndex = stack.findKey((entry) => entry.get('point') === point)

      if (!isUndefined(openIndex)) {
        const openPosition = stack.getIn([openIndex, 'position']);
        return state
          .set('stack', stack.slice(openIndex + 1))
          .update('pairings', (pairings) => pairings.push(new Pairing({
            open: openPosition,
            close: position
          })))
      } else {
        return state;
      }
    } else {
      return state;
    }
  }, initialState);

  return finalState
    .get('pairings')
    .sort((p1, p2) => p1.get('open') - p2.get('open')); // [1]
}

export default bracketPairs;
