import { List, Map, Range } from 'immutable';
import levelRuns from './levelRuns';
import unzip from '../util/unzip';
import matchingPDIs from './matchingPDIs';
import levelRunFromIndex from './levelRunFromIndex';
import { isX9ControlCharacter } from '../util/constant';
import { PDI } from '../util/constant';

function isolatingRunSequences(codepointsWithX9, bidiTypesWithX9) {
  // BD13.
  // [1]: By X9., we remove control characters that are not
  //      needed at this stage in bidi algorithm
  const [codepoints, bidiTypes] = unzip(
    codepointsWithX9.zip(bidiTypesWithX9)
    .filter(([codepoint, bidiType]) => isX9ControlCharacter(bidiType) === false)
  );

  const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);
  const runs = levelRuns(codepointsWithX9, bidiTypesWithX9);

  function isolatingChainFrom(sequence) {
      // [1]: level run currently last in the sequence
      //      ends with an isolate initiator that has a matching PDI
      // [2]: level run containing the matching PDI to the sequence
      const initiator = sequence.last().get('to') - 1;
      const matchingPDI = initiatorToPDI.get(initiator, -1);

      if (matchingPDI > -1) { // [1]
        const runWithMatchingPDI = levelRunFromIndex(runs, matchingPDI);
        return isolatingChainFrom(sequence.push(runWithMatchingPDI));
      } else {
        return sequence;
      }
  }

  return runs
    .filter((run) => {
      const from = run.get('from');
      const firstChar = codepoints.get(from);
      const matchingInitiator = initiatorFromPDI.get(from, -1)
      return (firstChar !== PDI || matchingInitiator === -1);
    })
    .reduce((sequences, run, index) => {
      const sequence = isolatingChainFrom(List.of(run));
      return sequences.push(sequence);
    }, List.of());
}

export default isolatingRunSequences;
