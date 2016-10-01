import includes from 'lodash.includes';
import { LRI, RLI, FSI, PDI } from '../type';
import { Record } from 'immutable';

// http://www.unicode.org/reports/tr9/#BD9
function matchingPDIForIndex(codepoints, index) {
  if (index >= codepoints.size) { return -1; }
  if (!includes([LRI, RLI, FSI], codepoints.get(index))) { return -1; }

  const after = codepoints.slice(index + 1);
  const BD9State = Record({ counter: 1, index: -1 }, 'BD9State'); // BD9.

  const finalState = after.reduce((state, codepoint, offset) => {
    if (state.get('index') > -1) return state;

    const newCounter = (() => {
      const counter = state.get('counter');
      if (includes([LRI, RLI, FSI], codepoint)) return counter + 1;
      else if (codepoint === PDI) return counter - 1;
      else return counter;
    })();

    if (codepoint === PDI && newCounter === 0) {
      return new BD9State({ counter: newCounter, index: index + (offset + 1) });
    } else {
      return state.set('counter', newCounter);
    }

  }, new BD9State());

  return finalState.get('index');
}

export default matchingPDIForIndex;
