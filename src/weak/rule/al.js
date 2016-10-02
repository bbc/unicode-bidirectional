// http://unicode.org/reports/tr9/#W3
// [1]: Change all ALs to R.
function al(types) {
  return types.map(t => {
    if (t === 'AL') return 'R'; // [1]
    else return t;
  });
}

export default al;
