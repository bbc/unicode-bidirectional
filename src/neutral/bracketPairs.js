import isUndefined from 'lodash.isundefined';
import includes from 'lodash.includes';
import { BracketPairStackEntry, Pairing, BracketPairState } from '../type';
import { LEFT_PAR, RIGHT_PAR } from '../util/constant';
import { LEFT_SQUARE, RIGHT_SQUARE } from '../util/constant';
import { LEFT_CURLY, RIGHT_CURLY } from '../util/constant';
import openingBrackets from '../util/openingBrackets';
import closingBrackets from '../util/closingBrackets';
import oppositeBracket from '../util/oppositeBracket';

// --| bracketPairs(points: List<Int>, types: List<String>): List<Pairing>
// --| Computes the bracket pairs (c.f. BD16) can that occur in an isolating run sequence.
// --| points - sequence of codepoints representing piece of text that may contain brackets
// --| bidiTypes - sequence of bidirectional character types
// --| Note: Bracket pairs can only occur in an isolating run sequence because they
// --| are processed in rule N0 after explicit level resolution

const STACK_MAX_SIZE = 63;

function bracketPairs(points, bidiTypes) {
  // [1]: Sort the list of pairs of text positions in ascending order
  //      based on the text position of the opening paired bracket.
  // [*]: "If an opening paired bracket is found and there is no room in the stack,
  //       stop processing BD16 for the remainder of the isolating run sequence."
  const initialState = new BracketPairState();
  const finalState = points.reduce((state, point, position) => {
    if (state.get('stackoverflow') === true) return state; // [*]

    const stack = state.get('stack');

    if (openingBrackets.has(point)) {
      if (stack.size == 63) { // [*]
        return state.set('stackoverflow', true);
      } else {
        return state.set('stack', stack.push(new BracketPairStackEntry({
          point: oppositeBracket.get(point),
          position
        })));
      }
    } else if (closingBrackets.has(point) && stack.size > 0) {
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
