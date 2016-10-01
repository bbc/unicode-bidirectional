import { List, Record } from 'immutable';
import { nsm, en, al, es, et, on, enToL } from './rule/rules';

// From X10. "Apply rules W1–W7," ([1]) in the order in which they appear below
// [1]: applying one rule to all the characters in the sequence
//      in the order in which they occur in the sequence
//      before applying another rule to any part of the sequence.
function resolveWeaksForRun(sequence, types) {
  const rules = [
    nsm, // W1.
    en,  // W2.
    al,  // W3.
    es,  // W4.
    et,  // W5.
    on,  // W6.
    enToL  // W7.
  ]; // [1]
  return rules.reduce((currTypes, rule) => rule(currTypes, sequence), types); // [1]
}

// A given isolating run sequence
var Run = Record({ sos: 'L', eos: 'L', points: List.of() });

export { Run, resolveWeaksForRun }
