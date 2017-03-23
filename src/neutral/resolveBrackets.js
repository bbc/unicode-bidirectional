import isUndefined from 'lodash.isundefined';
import bracketPairs from './bracketPairs';
import flow from 'lodash.flow';
import includes from 'lodash.includes';

// http://unicode.org/reports/tr9/#N0
function resolveBrackets(bidiTypes, points, sos, eos, level, bidiTypesBeforeW1) {
  // [1]: If any strong type (either L or R) matching the embedding direction
  //      is found, set the type for both brackets in the pair to
  //      match the embedding direction.
  const pairs = bracketPairs(points);
  return flow(
      function() {
        return pairs.reduce((currTypes, pair) => {
          const open = pair.get('open');
          const close = pair.get('close');

          // "Bracket pairs within an isolating run sequence are processed as units so that
          // both the opening and the closing paired bracket in a pair resolve to the SAME DIRECTION."
          if (currTypes.get(open) !== currTypes.get(close)) return currTypes;

          // [*]: "Within this scope, bidirectional types EN and AN are treated as R"
          //       TODO: [performance]: repeatedly calling map inside reduce is O(N^2) where N is |bidiTypes|
          //                            can probably get this to O(N) if we map EN, AN to R _once_ at the start
          const enclosing = currTypes
            .slice(open, close + 1)
            .map(t => (includes(['EN', 'AN'], t)) ? 'R' : t); // [*]

          const e = (level % 2 === 0) ? 'L' : 'R';
          const o = (level % 2 === 0) ? 'R' : 'L';
          const hasE = enclosing.find(x => x === e);
          const hasO = enclosing.find(x => x === o);

          if (hasE) { // [1]
            return currTypes.set(open, e).set(close, e); // N0.b
          } else if (hasO) {

            // search backwards from before `open` "until the first strong type (L, R, or sos) is found"
            const context = currTypes.slice(0, open)
              .map(t => (includes(['EN', 'AN'], t)) ? 'R' : t) // [*]
              .reverse()
              .push(sos)
              .find(x => includes(['L', 'R'], x));
            const established = context === o;

            if (established) { // N0.c.1.
              return currTypes.set(open, o).set(close, o);
            } else { // N0.c.2
              return currTypes.set(open, e).set(close, e);
            }
          } else { // N0.d
            return currTypes;
          }
        }, bidiTypes);
      },
      function (bidiTypesAfterN0) {
        // "Any number of characters that had original bidirectional character type NSM prior
        // to the application of W1 that immediately follow a paired bracket which
        // changed to L or R under N0 should change to match the type of their preceding bracket."
        return pairs.reduce((currTypes, pair) => {
          const open = pair.get('open');
          const close = pair.get('close');
          const openChangedToLorR = includes(['L', 'R'], currTypes.get(open));
          const closeChangedToLorR = includes(['L', 'R'], currTypes.get(close));

          // TODO: fix this so that _a SEQUENCE of NSMs_ are all changed to the strong type
          //       eg. ( NSM NSM NSM NSM ==>  ( L L L L
          //       eg. ) NSM NSM NSM NSM ==>  ) L L L L
          //       right now _ONLY ONE_ NSM that follows is changed to the strong type
          return flow(
              function(currTypes) {
                if (bidiTypesBeforeW1.get(open + 1) === 'NSM' && openChangedToLorR) {
                  return currTypes.set(open + 1, currTypes.get(open));
                } else {
                  return currTypes;
                }
              },
              function(currTypes) {
                if (bidiTypesBeforeW1.get(close + 1) === 'NSM' && closeChangedToLorR) {
                  return currTypes.set(close + 1, currTypes.get(close));
                } else {
                  return currTypes;
                }
              }
          )(currTypes);
        }, bidiTypesAfterN0);
      }
  )();
}

export default resolveBrackets;
