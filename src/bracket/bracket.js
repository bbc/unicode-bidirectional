import isUndefined from 'lodash.isundefined';
import includes from 'lodash.includes';
import { BracketPairStackEntry, Pairing, BracketPairState } from '../type';

// --| pairedBrackets(points: List<Int>, types: List<String>): List<Pairing>
// --| Computes the bracket pairs can that occur in an isolating run sequence.
// --| points - sequence of codepoints representing piece of text that may contain brackets
// --| bidiTypes - sequence of bidirectional character type at this point in bidirection algorithm
// --| Note: Bracket pairs can only occur in an isolating run sequence because they
// --| are processed in rule N0 after explicit level resolution
//
// [1]: Sort the list of pairs of text positions in ascending order
//      based on the text position of the opening paired bracket.
const LEFT_PAR = 0x0028;
const RIGHT_PAR = 0x0029;
const LEFT_SQUARE = 0x005B;
const RIGHT_SQUARE = 0x005D;
const LEFT_CURLY = 0x007B;
const RIGHT_CURLY = 0x007D;

function pairedBrackets(points, bidiTypes) {
  const isOpening = (point, bidiType) => bracketType(point) === 'Open'  && bidiType === 'ON';
  const isClosing = (point, bidiType) => bracketType(point) === 'Close' && bidiType === 'ON';

  const bracketType = (p) => {
    if (includes([LEFT_PAR, LEFT_SQUARE, LEFT_CURLY], p)) { return 'Open'; }
    if (includes([RIGHT_PAR, RIGHT_SQUARE, RIGHT_CURLY], p)) { return 'Close'; }
    else { return 'None'; }
  };
  const opposite = (p) => {
    if (p == LEFT_PAR) return RIGHT_PAR;
    if (p == RIGHT_PAR) return LEFT_PAR;
    if (p == LEFT_SQUARE) return RIGHT_SQUARE;
    if (p == RIGHT_SQUARE) return LEFT_SQUARE;
    if (p == LEFT_CURLY) return RIGHT_CURLY;
    if (p == RIGHT_CURLY) return LEFT_CURLY;
    return 'None';
  };

  const initialState = new BracketPairState();
  const finalState = points.reduce((state, point, position) => {
    const stack = state.get('stack');
    if (isOpening(point, 'ON')) {
      return state.update('stack', (stack) => {
        return stack.push(new BracketPairStackEntry({
          point: opposite(point),
          position
        }));
      });
    } else if (isClosing(point, 'ON') && stack.size > 0) {
      const openIndex = stack.findKey((entry) => entry.get('point') === point)
      if (!isUndefined(openIndex)) {
        const openPosition = stack.get(openIndex).get('position');
        return state
          .update('stack', (stack) => stack.slice(openIndex + 1))
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

export { pairedBrackets };
