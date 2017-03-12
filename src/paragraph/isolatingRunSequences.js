import includes from 'lodash.includes';
import { Range, List } from 'immutable';
import levelRuns from './levelRuns';
import unzip3 from '../util/unzip3';
import matchingPDIs from './matchingPDIs';
import levelRunFromIndex from './levelRunFromIndex';
import { isX9ControlCharacter } from '../util/constant';
import { RLI, LRI, FSI, PDI } from '../util/constant';
import { Sequence } from '../type';

// BD13.
function isolatingRunSequences(paragraphCodepoints, paragraphBidiTypes, paragraphLevel = 0) {
  // [1]: By X9., we remove control characters that are not
  //      needed at this stage in bidi algorithm
  const { runs, bidiTypes, levels } = levelRuns(paragraphCodepoints, paragraphBidiTypes, paragraphLevel);

  const [codepoints, bidi, pbidi] = unzip3(paragraphCodepoints
    .zip(bidiTypes, paragraphBidiTypes)
    .filter(([__, t, ___]) => isX9ControlCharacter(t) === false)); // [1]

  const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);

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

      // X10.
      // [1]: " If the higher level is odd, the sos or eos is R; otherwise, it is L."
      // [2]: For eos, we set nextLevel to paragraph level if the last character of the
      //      current sequence is an isolate initiator that does not have a matching pop
      const prevLevel = charLevel(from - 1);
      const currLevel = charLevel(from);
      const nextLevel = (__ => { // [2]
        const lastChar = codepoints.get(to - 1);
        const matchingPDI = initiatorToPDI.get(lastChar, -1);
        if (includes([LRI, RLI, FSI], lastChar) && matchingPDI === -1) { return paragraphLevel }
        else return charLevel(to);
      })();
      const sos = (Math.max(prevLevel, currLevel) % 2 === 1) ? 'R' : 'L'; // [1]
      const eos = (Math.max(currLevel, nextLevel) % 2 === 1) ? 'R' : 'L'; // [1, 2]
      return sequence.set('sos', sos).set('eos', eos);
    });
  }

  const sequences = sequencesWithSosEos(runs
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

  return {
    sequences: sequences,
    codepoints: codepoints,
    bidiTypes: bidi,
    paragraphBidiTypes: pbidi,
    levels: levels
  };
}

export default isolatingRunSequences;
