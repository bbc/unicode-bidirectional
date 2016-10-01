import { Map, Range } from 'immutable';
import matchingPDIForIndex from './matchingPDIForIndex';

function matchingPDIs(codepoints) {
  // [1]: define hashmap mapping: isolate initator |-> matching PDI
  // [2]: define hashmap mapping: matching PDI |-> isolate initiator
  const N = codepoints.size;
  const tuples = Range()
    .zip(Range(0, N)
    .map(i => matchingPDIForIndex(codepoints, i)))
    .filter(([x, y]) => y !== -1);
  const tuplesInverted = tuples.map(([x, y]) => [y, x]);

  const initiatorToPDI = Map(tuples); // [1]
  const initiatorFromPDI = Map(tuplesInverted); // [2]
  return { initiatorToPDI, initiatorFromPDI };
}

export default matchingPDIs;
