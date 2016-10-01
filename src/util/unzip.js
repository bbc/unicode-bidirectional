import { List } from 'immutable';

// Immutable.js doesnt have unzip
// Unzips a "zipped" Immutable.js List of pairs in O(N) time
// unzip(pairs: List<Array<a,b>>): Array<List<a>, List<b>>
function unzip(pairs) {
  const unzipped = pairs
    .reduce((unzipped, [a, b]) => {
      return unzipped
        .update(0, (as) => as.push(a))
        .update(1, (bs) => bs.push(b))
    }, List.of(List.of(), List.of()));
  return [unzipped.get(0), unzipped.get(1)];
}

export default unzip;
