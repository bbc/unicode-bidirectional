import includes from 'lodash.includes';

const isWhitespaceResettable = (t) => includes(['WS', 'FSI', 'LRI', 'RLI', 'PDI'], t);

// http://unicode.org/reports/tr9/#L1
function whitespacesLevelReset(types, levels, paragraphLevel) {
  return types.zip(levels).map(([type,level], index) => {
    if (includes(['S', 'B'], type)) return paragraphLevel;
    if (!isWhitespaceResettable(type)) return level;

    const ahead = types.slice(index).push('<EOL>');
    const aheadAdj = ahead.skipWhile(isWhitespaceResettable).first();

    if (aheadAdj === '<EOL>' || aheadAdj === 'S') { // L1.3, L1.4
      return paragraphLevel;
    } else {
      return level;
    }
  });
}

export default whitespacesLevelReset;
