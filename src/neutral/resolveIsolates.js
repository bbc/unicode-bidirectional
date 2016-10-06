import { isNI, isR } from '../util/constant';

// http://unicode.org/reports/tr9/#N1
function resolveIsolates(types, codepoints, sos, eos, level) {
  return types.map((t, index) => {
    if (!isNI(t)) return t;

    const behind = types.slice(0, index).reverse().push(sos);
    const ahead = types.slice(index).push(eos);

    const behindAdjacent = behind.skipWhile(isNI).first();
    const aheadAdjacent = ahead.skipWhile(isNI).first();

    if (behindAdjacent === 'L' && aheadAdjacent === 'L') {
      return 'L'; // [1]
    } else if(isR(behindAdjacent) && isR(aheadAdjacent)) {
      return 'R';
    } else {
      return t;
    }
  });
}

export default resolveIsolates;
