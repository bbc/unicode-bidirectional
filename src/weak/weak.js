import { List, Record } from 'immutable';
import identity from 'lodash.identity';
import includes from 'lodash.includes';

// Weak types are now resolved one isolating run sequence at a time.
// At isolating run sequence boundaries where the type of the
// character on the other side of the boundary is required,
// the type assigned to sos or eos is used.

// A given isolating run sequence
var Run = Record({ sos: 'L', eos: 'L', points: List.of() });

// [1]: from BD8. true iff character type is LRI, RLI, or FSI.
// [2]: returns true iff codepoint is U+2069 POP DIRECTIONAL ISOLATE
const isIsolateInitiator = (type) => includes(['LRI', 'RLI', 'FSI'], type); // [1]
const isStrong = (type) => includes(['L', 'R', 'AL'], type);
const isEt = (type) => type === 'ET';
const isPDI = (point) => point === 0x2069; // [2]

// From X10. "Apply rules W1–W7," ([1]) in the order in which they appear below
// applying one rule to all the characters in the sequence in the order
// in which they occur in the sequence before applying another rule to any part of the sequence.
function resolveWeaksForRun(run, types) {
  const rules = [ nsm, en, al, es, et, on, enToL ]; // [1]
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
// [1]: Change all ALs to R.
function al(types, run) {
  return types.map(t => {
    if (t === 'AL') return 'R'; // [1]
    else return t;
  });
}

// http://unicode.org/reports/tr9/#W4
// [1]: A single European separator between two European
//      numbers changes to a European number.
// [2]: A single common separator between two
//      numbers of the same type changes to that type.
// [3]: (Otherwise make no changes)
function es(types, run) {
  if (types.size < 3) return types;

  const first = types.take(1);
  const middle = types.skip(2).zipWith((curr, prevOne, prevTwo) => {
    if (curr === 'EN' && curr === prevTwo && prevOne === 'ES') { // [1]
      return 'EN';
    } else if (prevOne === 'CS' && curr === prevTwo) { // [2]
      return curr;
    } else { // [3]
      return prevOne;
    }
  }, types.skip(1), types);
  const last = types.last();
  return first.concat(middle).push(last);
}

// http://unicode.org/reports/tr9/#W5
// [1]: A sequence of European terminators adjacent
//      to European numbers changes to all European numbers.
// [2]: if slice(index) is some sequence of the form ET, ET, ET, ..., EN
//      of if slice(0, index).reverse() is some sequence the form ET, ET, ET, ..., EN
//      then there is some EN adjacent to the ET sequence
function et(types, run) {
  return types.map((t, index) => {
    if (t !== 'ET') return t;

    const behind = types.slice(0, index).reverse();
    const ahead = types.slice(index);

    const behindAdj = (behind.skipWhile(isEt).first() === 'EN');
    const aheadAdj = (ahead.skipWhile(isEt).first() === 'EN');

    if (behindAdj || aheadAdj) { // [2]
      return 'EN'; // [1]
    } else {
      return t;
    }
  });
}

// http://unicode.org/reports/tr9/#W6
// [1]: separators and terminators change to Other Neutral.
function on(types, run) {
  return types.map((t, index) => {
    if (includes(['ET', 'ES', 'CS', 'B', 'S'], t)) return 'ON'; // [1]
    else return t;
  });
}

// http://unicode.org/reports/tr9/#W7
// [1]: Search backward from each instance of a European number
//      until the first strong type (R, L, or sos) is found.
// [2]: If an L is found, then change the type of the European number to L.
function enToL(types, run) {
  return types.map((t, index) => {
    if (t !== 'EN') return t;

    const prevStrong = types.reverse().find(t => isStrong(t)); // [1]
    if (prevStrong === 'L') { // [2]
      return 'L';
    } else {
      return t;
    }
  });
}


export {
  Run,
  nsm,
  en,
  al,
  es,
  et,
  on,
  enToL,
  resolveWeaksForRun
}
