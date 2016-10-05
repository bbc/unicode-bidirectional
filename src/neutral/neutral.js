import { List } from 'immutable';
import isUndefined from 'lodash.isundefined';
import includes from 'lodash.includes';
import bracketPairs from '../bracket/bracketPairs';
import { isNI } from '../util/constant';

// [1]: If any strong type (either L or R) matching the embedding direction
//      is found, set the type for both brackets in the pair to
//      match the embedding direction.
// function resolveBrackets(bidiTypes, bracketPairs, ltr = true) {
function resolveBrackets(bidiTypes, points, sos, eos, level) {
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

function resolveIsolates(types) {
  return types.map((t, index) => {
    if (t !== 'NI') return t;

    const behind = types.slice(0, index).reverse();
    const ahead = types.slice(index);

    const isNi = (x) => x === 'NI';
    const isR = (x) => includes(['R', 'AN', 'EN'], x);
    const behindAdj = behind.skipWhile(isNi).first();
    const aheadAdj = ahead.skipWhile(isNi).first();

    if (behindAdj === 'L' && aheadAdj === 'L') {
      return 'L'; // [1]
    } else if(isR(behindAdj) && isR(aheadAdj)) {
      return 'R';
    } else {
      return t;
    }
  });
}

function resolveRemaining(types, codepoints, sos, eos, level) {
  const newType = (level % 2 === 0) ? 'L' : 'R';
  return types.map((t, index) => {
    if (isNI(t)) return newType;
    return t;
  });
}

export { resolveBrackets, resolveIsolates, resolveRemaining }
