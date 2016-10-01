import includes from 'lodash.includes';

// http://unicode.org/reports/tr9/#W6
// [1]: separators and terminators change to Other Neutral.
function on(types, run) {
  return types.map((t, index) => {
    if (includes(['ET', 'ES', 'CS', 'B', 'S'], t)) return 'ON'; // [1]
    else return t;
  });
}

export default on;
