// http://unicode.org/reports/tr9/#W4
// [1]: A single European separator between two European
//      numbers changes to a European number.
// [2]: A single common separator between two
//      numbers of the same type changes to that type.
// [3]: (Otherwise make no changes)
function es(types, run) {
  if (types.size < 3) return types;

  const first = types.take(1);
  const middle = types.skip(2).zipWith((curr, prevOne, prevTwo) => {
    if (curr === 'EN' && curr === prevTwo && prevOne === 'ES') { // [1]
      return 'EN';
    } else if (prevOne === 'CS' && curr === prevTwo) { // [2]
      return curr;
    } else { // [3]
      return prevOne;
    }
  }, types.skip(1), types);
  const last = types.last();
  return first.concat(middle).push(last);
}

export default es;
