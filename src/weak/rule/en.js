import { isStrong } from '../../util/constant';

// http://unicode.org/reports/tr9/#W2
// [1]: Search backward from each instance of a European number
//      until the first strong type (R, L, AL, or sos) is found.
// [2]: If an AL is found, change the type of the European number
//      to Arabic number.
function en(types, run) {
  return types.map((t) => {
    if (t !== 'EN') return t;

    const prevStrong = types.reverse().find(t => isStrong(t)); // [1]
    if (prevStrong === 'AL') { // [2]
      return 'AN';
    } else {
      return t;
    }
  });
}

export default en;
