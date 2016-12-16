import includes from 'lodash.includes';

const isWhitespaceResettable = t => includes(['WS', 'FSI', 'LRI', 'RLI', 'PDI'], t);

// http://unicode.org/reports/tr9/#L1
function whitespacesLevelReset(types, levels, paragraphLevel) {
  return types.zip(levels).map(([type, level], index) => {
    if (includes(['S', 'B'], type)) return paragraphLevel; // L1.1, L1.2
    if (!isWhitespaceResettable(type)) return level;

    const ahead = types.slice(index).push('<EOL>');
    const aheadAdj = ahead.skipWhile(isWhitespaceResettable).first();

    if (includes(['<EOL>', 'S', 'B'], aheadAdj)) { // L1.3, L1.4
      return paragraphLevel;
    } else {
      return level;
    }
  });
}

export default whitespacesLevelReset;
