import includes from 'lodash.includes';

import { Stack, Range, Map, List, Record } from 'immutable';
import { DirectionalStatusStackEntry, EmbeddingLevelState } from '../type';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI, LRM, RLM, ALM } from '../type';
import { Run } from '../type';
import { increase } from '../type';

// TODO: rename to matchingPDIForIndex
import matchingPDI from './matchingPDI';

import { rle } from './rle';
import lre from './lre';
import rlo from './rlo';
function lro(ch, index, state) { return state; }
import { rli } from './rli';
import { lri } from './lri';
function fsi(ch, index, state) { return state; }
import other from './other';
import { pdi } from './pdi';
import { pdf } from './pdf';

const isIsolateInitiator = (codepoint) => includes([LRI, RLI, FSI], lastRunLastChar)

// BD7.
// [1]: Apply rules X1-X8 to compute the embedding levels
// [2]: Process each character iteratively, applying rules X2 through X8.
// [3]: Each rule has type: (Character, Index, EmbeddingLevelState) -> EmbeddingLevelState
// [4]: Some rules modify the bidi types list and embedding levels
// [5]: Compute the runs by grouping adjacent characters with same the level numbers
//      with the exception of RLE, LRE and PDF which are stripped from output
function levelRuns(codepoints, bidiTypes) {
  const rules = [
    rle,   // X2.
    lre,   // X3.
    //rlo  // X4.
    //lro  // X5.
    rli,   // X5a.
    lri,   // X5b.
    //fsi  // X5c.
    other, // X6.
    pdi,   // X6a.
    pdf    // X7.
  ]; // [1][3]

  const initial = new EmbeddingLevelState() // [1]
    .set('bidiTypes', bidiTypes) // [4]
    .set('embeddingLevels', codepoints.map(__ => 0)); // [4]

  const finalState = codepoints.reduce((state, ch, index) => { // [2]
    return rules.reduce((s, rule) => rule(ch, index, s), state);
  }, initial);

  return codepoints // [5]
    .zip(finalState.get('embeddingLevels'))
    .filter(([c, __]) => includes([LRE, RLE, PDF], c) === false) // X9.
    .reduce((runs, [codepoint, level], index) => {
      const R = runs.size - 1;
      if (runs.getIn([R, 'level'], -1) === level) {
        return runs.updateIn([R, 'to'], increase);
      } else {
        return runs.push(new Run({ level, from: index, to: index + 1 }));
      }
    }, List.of());
}

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
  const isX9ControlChar = (c) => includes(['RLE', 'LRE', 'RLO', 'LRO', 'PDF', 'BN'], c);
  const [codepoints, bidiTypes] = unzip(
    codepointsWithX9.zip(bidiTypesWithX9)
    .filter(([codepoint, bidiType]) => isX9ControlChar(bidiType) === false)
  );

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

export { levelRuns, isolatingRunSequences }
