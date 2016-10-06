import isUndefined from 'lodash.isundefined';
import bracketPairs from '../bracket/bracketPairs';

// http://unicode.org/reports/tr9/#N0
function resolveBrackets(bidiTypes, points, sos, eos, level) {
  // [1]: If any strong type (either L or R) matching the embedding direction
  //      is found, set the type for both brackets in the pair to
  //      match the embedding direction.
  const pairs = bracketPairs(points);
  return pairs.reduce((currTypes, pair) => {
    const open = pair.get('open');
    const close = pair.get('close');
    const enclosing = currTypes.slice(open, close + 1);

    const e = (level % 2 === 0) ? 'L' : 'R';
    const o = (level % 2 === 0) ? 'R' : 'L';
    const hasE = enclosing.find(x => x === e);
    const hasO = enclosing.find(x => x === o);

    if (hasE) { // [1]
      return currTypes.set(open, e).set(close, e);
    } else if (hasO) {
      const context = currTypes.slice(0, open).reverse().find(x => x === o);

      if (!isUndefined(context)) { // [2]
        return currTypes.set(open, o).set(close, o);
      } else { // [3]
        return currTypes.set(open, e).set(close, e);
      }
    } else { // [4]
      return currTypes;
    }
  }, bidiTypes);
}

export default resolveBrackets;
