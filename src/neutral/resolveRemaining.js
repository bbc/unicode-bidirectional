import { isNI } from '../util/constant';

// http://unicode.org/reports/tr9/#N2
function resolveRemaining(types, codepoints, sos, eos, level) {
  const newType = (level % 2 === 0) ? 'L' : 'R';
  return types.map((t, index) => {
    if (isNI(t)) { return newType; }
    return t;
  });
}

export default resolveRemaining;
