import { List, Record } from 'immutable';
import { nsm, en, al, es, et, on, enToL } from './rule/rules';
import isolatingRunSequences from '../paragraph/isolatingRunSequences';
import unzip from '../util/unzip';
import resolveIsolates from '../neutral/resolveIsolates';
import resolveBrackets from '../neutral/resolveBrackets';
import resolveRemaining from '../neutral/resolveRemaining';

function resolvedWeaks(paragraphCodepoints, paragraphBidiTypes, paragraphLevel = 0) {
  const sequences = isolatingRunSequences(paragraphCodepoints, paragraphBidiTypes, paragraphLevel);
  return sequences.reduce((types, sequence) => {
    return resolvedWeaksForSequence(paragraphCodepoints, types, sequence);
  }, paragraphBidiTypes);
}

// X10.
// [1]: applying one rule to all the characters in the sequence
//      in the order in which they occur in the sequence
//      before applying another rule to any part of the sequence.
function resolvedWeaksForSequence(codepoints, bidiTypes, sequence) {
  // merge together all the codepoint-slices and bidiType-slices
  // that each run in the sequence take
  const paragraph = codepoints.zip(bidiTypes);
  const [ codepointsFromSequence, bidiTypesFromSequence ] = unzip(
    sequence.get('runs').map(run => {
      const { from, to } = run.toJS();
      return paragraph.slice(from, to);
    }).flatten()
  );

  const rules = [
    nsm, // W1.
    en,  // W2.
    al,  // W3.
    es,  // W4.
    et,  // W5.
    on,  // W6.
    enToL, // W7.
    resolveBrackets, // N0
    resolveBrackets, // N1
    resolveRemaining // N2
  ]; // [1]

  const newTypesFromSequence = rules.reduce((types, rule) => {
    const level = sequence.get('runs').first().get('level');
    return rule(types, codepointsFromSequence, sequence.get('sos'), sequence.get('eos'), level);
  }, bidiTypesFromSequence); // [1]

  const offsets = sequence.get('runs').butLast().reduce((acc, run)  => {
    const { from, to } = run.toJS();
    const size = to - from;
    const lastSize = acc.get(-1);
    return acc.push(size + lastSize);
  }, List.of(0));

  const slices = sequence.get('runs').zip(offsets).map(([run, offset]) => {
    const { from, to } = run.toJS();
    const size = to - from;
    return newTypesFromSequence.slice(offset, offset + size);
  });

  const newTypes = sequence.get('runs').zip(slices).reduce((types, [run, slice]) => {
    const { from, to } = run.toJS();
    return types
      .slice(0, from)
      .concat(slice)
      .concat(types.slice(to));
  }, bidiTypes);

  return newTypes;
}

export default resolvedWeaks;
