import { isStrong } from '../../util/constant';

// http://unicode.org/reports/tr9/#W7
// [1]: Search backward from each instance of a European number
//      until the first strong type (R, L, or sos) is found.
// [2]: If an L is found, then change the type of the European number to L.
function enToL(types, run) {
  return types.map((t, index) => {
    if (t !== 'EN') return t;

    const prevStrong = types.reverse().find(t => isStrong(t)); // [1]
    if (prevStrong === 'L') { // [2]
      return 'L';
    } else {
      return t;
    }
  });
}

export default enToL;
