// TODO: rename to matchingPDIForIndex
import { List, Map, Range } from 'immutable';
import matchingPDI from './matchingPDI';
import includes from 'lodash.includes';
import levelRuns from './levelRuns';

import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../type';

// TODO: move
const isIsolateInitiator = (codepoint) => includes([LRI, RLI, FSI], lastRunLastChar)
const isX9ControlChar = (c) => includes(['RLE', 'LRE', 'RLO', 'LRO', 'PDF', 'BN'], c);

// TODO: move
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


// BD13.
// [1]: By X9., we remove control characters that are not
//      needed at this stage in bidi algorithm
function isolatingRunSequences(codepointsWithX9, bidiTypesWithX9) {
  const [codepoints, bidiTypes] = unzip(
    codepointsWithX9.zip(bidiTypesWithX9)
    .filter(([codepoint, bidiType]) => isX9ControlChar(bidiType) === false)
  );

  // TODO: move
  // [1]: define hashmap mapping: isolate initator |-> matching PDI
  // [2]: define hashmap mapping: matching PDI |-> isolate initiator
  const N = codepoints.size;
  const tuples = Range()
    .zip(Range(0, N)
    .map(i => matchingPDI(codepoints, i)))
    .filter(([x, y]) => y !== -1);
  const tuplesInverted = tuples.map(([x, y]) => [y, x]);

  const matchingPDIs = Map(tuples); // [1]
  const matchingIsolates = Map(tuplesInverted); // [2]
  const runs = levelRuns(codepointsWithX9, bidiTypesWithX9);

  function getLevelRunByIndex(index) {
    const lookup = runs.filter(run => index >= run.get('from') && index < run.get('to'));
    if (lookup.size > 0) return lookup.last();
    return new Run();
  }

  function findIsolateChain(sequence) {
      // [1]: level run currently last in the sequence
      //      ends with an isolate initiator that has a matching PDI
      // [2]: level run containing the matching PDI to the sequence
      const R = sequence.size - 1;
      const lastRunLastChar = sequence.last().get('to') - 1;
      const matchingInitiator = matchingPDIs.get(lastRunLastChar, -1);
      if (matchingInitiator > -1) { // [1]
        return findIsolateChain(sequence.push(getLevelRunByIndex(matchingInitiator)));
      } else {
        return sequence;
      }
  }

  return runs
    .filter((run) => {
      const from = run.get('from');
      const firstChar = codepoints.get(from);
      const matchingInitiator = matchingIsolates.get(from, -1)
      return (firstChar !== PDI || matchingInitiator === -1);
    })
    .reduce((sequences, run, index) => {
      const sequence = findIsolateChain(List.of(run));
      return sequences.push(sequence);
    }, List.of());
}

export default isolatingRunSequences;
