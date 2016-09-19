import { List, Record } from 'immutable';
import identity from 'lodash.identity';
import includes from 'lodash.includes';

// Weak types are now resolved one isolating run sequence at a time.
// At isolating run sequence boundaries where the type of the
// character on the other side of the boundary is required,
// the type assigned to sos or eos is used.

// For a given isolating run sequence...
var WeakResolutionState = Record({
  sos: 'L',
  eos: 'L',
  points: List.of(),
  types: List.of()
});

// BD8. true iff character type is LRI, RLI, or FSI.
const isIsolateInitiator = (type) => includes(['LRI', 'RLI', 'FSI'], type)

// true iff codepoint is U+2069 POP DIRECTIONAL ISOLATE
const isPDI = (point) => point === 0x2069;

function resolveWeaksForRun(initialState) {
  const types = initialState.get('types');
  return types.reduce((state, t, index) => {
    if (t === 'NSM') return nsm(state, index)
    else             return identity(state, index);
  }, initialState);
}


// http://unicode.org/reports/tr9/#W1
// [1]: if the NSM is at the start of the isolating run sequence,
//      it will get the type of sos.
// [2]: change the type of the NSM to Other Neutral if the previous
//      character is an isolate initiator or PDI,
function nsm(state, index) {
  if (index <= 0) { // [1]
    const sos = state.get('sos');
    return state.update('types', (types) => types.set(index, sos));
  } else {
    const prevPoint = state.get('points').get(index - 1);
    const prevType = state.get('types').get(index - 1);

    if (isIsolateInitiator(prevType) || isPDI(prevPoint)) { // [2]
    return state.update('types', (types) => types.set(index, 'ON'));
    } else {
      return state.update('types', (types) => types.set(index, prevType));
    }
  }
}

export {
  WeakResolutionState,
  nsm,
  resolveWeaksForRun
}
