import { List } from 'immutable';

// Immutable.js doesnt have unzip
// Unzips a "zipped" Immutable.js List of pairs in O(N) time
// unzip(pairs: List<Array<a,b>>): Array<List<a>, List<b>>
function unzip3(pairs) {
  const unzipped = pairs
    .reduce((unzipped, [a, b, c]) => {
      return unzipped
        .update(0, (as) => as.push(a))
        .update(1, (bs) => bs.push(b))
        .update(2, (cs) => cs.push(c))
    }, List.of(List.of(), List.of(), List.of()));
  return [unzipped.get(0), unzipped.get(1), unzipped.get(2)];
}

export default unzip3;
