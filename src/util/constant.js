import includes from 'lodash.includes';

const ALM = 0x061C;
const FSI = 0x2068;
const LRE = 0x202A;
const LRI = 0x2066;
const LRM = 0x200E;
const LRO = 0x202D;
const PDF = 0x202C;
const PDI = 0x2069;
const RLE = 0x202B;
const RLI = 0x2067;
const RLM = 0x200F;
const RLO = 0x202E;

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const E = 0x0045; // U+0044 LATIN CAPITAL LETTER E
const F = 0x0046; // U+0044 LATIN CAPITAL LETTER F
const G = 0x0047; // U+0044 LATIN CAPITAL LETTER G

const LEFT_CURLY = 0x007B;
const LEFT_PAR = 0x0028;
const LEFT_SQUARE = 0x005B;
const RIGHT_CURLY = 0x007D;
const RIGHT_PAR = 0x0029;
const RIGHT_SQUARE = 0x005D;

const MAX_DEPTH = 125;

const isX9ControlCharacter = (t) => includes(['RLE', 'LRE', 'RLO', 'LRO', 'PDF', 'BN'], t);

export {
  ALM, FSI, LRE, LRI, LRM, LRO, PDF, PDI, RLE, RLI, RLM, RLO,
  A, B, C, D, E, F, G,
  LEFT_PAR, RIGHT_PAR, LEFT_SQUARE, RIGHT_SQUARE, LEFT_CURLY, RIGHT_CURLY,
  MAX_DEPTH,
  isX9ControlCharacter
}
