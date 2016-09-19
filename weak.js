import { List, Record } from 'immutable';
import identity from 'lodash.identity';
import includes from 'lodash.includes';

// Weak types are now resolved one isolating run sequence at a time.
// At isolating run sequence boundaries where the type of the
// character on the other side of the boundary is required,
// the type assigned to sos or eos is used.

// A given isolating run sequence
var Run = Record({ sos: 'L', eos: 'L', points: List.of() });

// BD8. true iff character type is LRI, RLI, or FSI.
// true iff codepoint is U+2069 POP DIRECTIONAL ISOLATE
const isIsolateInitiator = (type) => includes(['LRI', 'RLI', 'FSI'], type)
const isStrong = (type) => includes(['L', 'R', 'AL'], type)
const isPDI = (point) => point === 0x2069;

function resolveWeaksForRun(run, types) {
  const rules = [ nsm, en, al ];
  return rules.reduce((currTypes, rule) => rule(currTypes, run), types);
}

// http://unicode.org/reports/tr9/#W1
// [1]: if the NSM is at the start of the isolating run sequence,
//      it will get the type of sos.
// [2]: change the type of the NSM to Other Neutral if the previous
//      character is an isolate initiator or PDI,
// [3]: change to the type of the previous character otherwise
function nsm(types, run) {
  return types.reduce((acc, t, index) => {
    if (t !== 'NSM') return acc.push(t);
    if (index <= 0) { // [1]
      return acc.push(run.get('sos'));
    } else {
      const prevType = acc.get(index - 1);
      const prevPoint = run.get('points').get(index - 1);

      if (isIsolateInitiator(prevType) || isPDI(prevPoint)) { // [2]
        return acc.push('ON');
      } else {
        return acc.push(prevType);
      }
    }
  }, List.of());
}

// http://unicode.org/reports/tr9/#W2
// [1]: Search backward from each instance of a European number
//      until the first strong type (R, L, AL, or sos) is found.
// [2]: If an AL is found, change the type of the European number
//      to Arabic number.
function en(types, run) {
  return types.map((t) => {
    if (t !== 'EN') return t;
    const prevStrong = types.reverse().find(t => isStrong(t)); // [1]
    if (prevStrong === 'AL') { // [2]
      return 'AN';
    } else {
      return t;
    }
  });
}

// http://unicode.org/reports/tr9/#W3
// Change all ALs to R.
function al(types, run) {
  return types.map(t => {
    if (t === 'AL') return 'R';
    else return t;
  });
}


export {
  Run,
  nsm,
  en,
  al,
  resolveWeaksForRun
}
