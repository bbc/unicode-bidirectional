import { isET } from '../../util/constant';

// http://unicode.org/reports/tr9/#W5
// [1]: A sequence of European terminators adjacent
//      to European numbers changes to all European numbers.
// [2]: if slice(index) is some sequence of the form ET, ET, ET, ..., EN
//      of if slice(0, index).reverse() is some sequence the form ET, ET, ET, ..., EN
//      then there is some EN adjacent to the ET sequence
function et(types, run) {
  return types.map((t, index) => {
    if (t !== 'ET') return t;

    const behind = types.slice(0, index).reverse();
    const ahead = types.slice(index);

    const behindAdj = (behind.skipWhile(isET).first() === 'EN');
    const aheadAdj = (ahead.skipWhile(isET).first() === 'EN');

    if (behindAdj || aheadAdj) { // [2]
      return 'EN'; // [1]
    } else {
      return t;
    }
  });
}

export default et;
