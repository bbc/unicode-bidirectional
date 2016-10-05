import { Range, List } from 'immutable';
import levelRuns from './levelRuns';
import unzip from '../util/unzip';
import matchingPDIs from './matchingPDIs';
import levelRunFromIndex from './levelRunFromIndex';
import { isX9ControlCharacter } from '../util/constant';
import { PDI } from '../util/constant';
import { Sequence } from '../type';

// BD13.
function isolatingRunSequences(codepointsWithX9, bidiTypesWithX9, paragraphLevel = 0) {
  // [1]: By X9., we remove control characters that are not
  //      needed at this stage in bidi algorithm
  const [codepoints, bidiTypes] = unzip(codepointsWithX9
    .zip(bidiTypesWithX9)
    .filter(([__, t]) => isX9ControlCharacter(t) === false)); // [1]

  const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);
  const runs = levelRuns(codepointsWithX9, bidiTypesWithX9, paragraphLevel);

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

  function sequencesWithSosEos(sequences) {
    return sequences.map((sequence, index) => {
      // TODO: set nextLevel to embeddingLevel if the last character of the
      //       current sequence is an isolate initiator (lacking a matching PDI),
      const N = codepoints.size;
      const from = sequence.get('runs').first().get('from');
      const to = sequence.get('runs').last().get('to');

      const charLevel = i => {
        if (Range(0, N).contains(i)) {
          return levelRunFromIndex(runs, i).get('level');
        } else {
          return paragraphLevel;
        }
      }

      const prevLevel = charLevel(from - 1);
      const currLevel = charLevel(from);
      const nextLevel = charLevel(to);
      const sos = (Math.max(prevLevel, currLevel) % 2 === 1) ? 'R' : 'L';
      const eos = (Math.max(currLevel, nextLevel) % 2 === 1) ? 'R' : 'L';
      return sequence.set('sos', sos).set('eos', eos);
    });
  }

  return sequencesWithSosEos(runs
    .filter(run => {
      const from = run.get('from');
      const firstChar = codepoints.get(from);
      const matchingInitiator = initiatorFromPDI.get(from, -1)
      return (firstChar !== PDI || matchingInitiator === -1);
    })
    .reduce((sequences, run, index) => {
      const sequence = new Sequence({ runs: isolatingChainFrom(List.of(run)) });
      return sequences.push(sequence);
    }, List.of())
  );
}

export default isolatingRunSequences;
