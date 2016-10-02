import { List } from 'immutable';
import { isIsolateInitiator, isPDI } from '../../util/constant';

// http://unicode.org/reports/tr9/#W1
// [1]: if the NSM is at the start of the isolating run sequence,
//      it will get the type of sos.
// [2]: change the type of the NSM to Other Neutral if the previous
//      character is an isolate initiator or PDI,
// [3]: change to the type of the previous character otherwise
function nsm(types, points, sos, eos) {
  return types.reduce((acc, t, index) => {
    if (t !== 'NSM') return acc.push(t);

    if (index <= 0) { // [1]
      return acc.push(sos);
    } else {
      const prevType = acc.get(index - 1);
      const prevPoint = points.get(index - 1);

      if (isIsolateInitiator(prevType) || isPDI(prevPoint)) { // [2]
        return acc.push('ON');
      } else {
        return acc.push(prevType);
      }
    }
  }, List.of());
}

export default nsm;
