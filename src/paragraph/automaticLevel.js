import isUndefined from 'lodash.isundefined';
import includes from 'lodash.includes';
import { List, Record } from 'immutable';
import { LRI, RLI, FSI, PDI } from '../util/constant';

// http://unicode.org/reports/tr9/#P2
function automaticLevel(codepoints, bidiTypes) {
  const P2State = Record({ inside: false, counter: 0 }, 'P2State'); // P2.
  const betweenIsolate = codepoints
    .reduce((acc, codepoint) => {
      const counter = acc.get(-1, 0);
      return acc.push((() => {
        if (includes([LRI, RLI, FSI], codepoint)) return counter + 1;
        else if (codepoint === PDI) return counter - 1;
        else return counter;
      })());
    }, List.of())
    .map(counter => (counter > 0) ? true : false);

  const firstStrong = codepoints.zip(bidiTypes, betweenIsolate)
    .filter(([_, __, between]) => between === false)
    .map(([_, bidiType, __]) => bidiType)
    .find(t => includes(['L', 'R', 'AL'], t));

  if (includes(['R', 'AL'], firstStrong)) {
    return 1;
  } else {
    return 0;
  }
}

export default automaticLevel;
