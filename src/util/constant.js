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

// Examples of BN (Boundary Neutral)
const BN1 = 0x0000

// Examples of L (Left-to-right)
const L1  = 0x006D // U+006D LATIN SMALL LETTER M

// Examples of R (Right-to-left)
const R1  = 0x05D0 // U+05D0 HEBREW LETTER ALEF

// Examples of ON (Other Neutral)
const ON1 = 0x0022 // U+0022 QUOTATION MARK

// Examples of AN (Arabic Number)
const AN1 = 0x0661 // U+0661 ARABIC-INDIC DIGIT ONE

// Examples of AN (Arabic Letter)
const AL1 =  0x0643 // U+0643 ARABIC LETTER KAF

// Examples of EN (European Number)
const EN1 = 0x0032 // U+0032 DIGIT TWO

// Examples of WS (Whitespace)
const WS1 = 0x0020 // U+0032 SPACE

const LEFT_CURLY = 0x007B;
const LEFT_PAR = 0x0028;
const LEFT_SQUARE = 0x005B;
const RIGHT_CURLY = 0x007D;
const RIGHT_PAR = 0x0029;
const RIGHT_SQUARE = 0x005D;

const bracketType = (p) => {
  if (includes([LEFT_PAR, LEFT_SQUARE, LEFT_CURLY], p)) { return 'Open'; }
  if (includes([RIGHT_PAR, RIGHT_SQUARE, RIGHT_CURLY], p)) { return 'Close'; }
  else { return 'None'; }
};

const isOpeningBracket = (point, bidiType) =>
  bracketType(point) === 'Open'  && bidiType === 'ON';
const isClosingBracket = (point, bidiType) =>
  bracketType(point) === 'Close' && bidiType === 'ON';

const oppositeBracket = (p) => {
  if (p == LEFT_PAR) return RIGHT_PAR;
  if (p == RIGHT_PAR) return LEFT_PAR;
  if (p == LEFT_SQUARE) return RIGHT_SQUARE;
  if (p == RIGHT_SQUARE) return LEFT_SQUARE;
  if (p == LEFT_CURLY) return RIGHT_CURLY;
  if (p == RIGHT_CURLY) return LEFT_CURLY;
  return 'None';
};

const MAX_DEPTH = 125;

const isET = (t) => t === 'ET';
const isNI = (t) => includes(['B', 'S', 'WS', 'ON', 'FSI', 'LRI', 'RLI', 'PDI'], t); // 3.1.4
const isR = (t) => includes(['R', 'AN', 'EN'], t);
const isIsolateInitiator = (t) => includes(['LRI', 'RLI', 'FSI'], t); // [1]
const isPDI = (point) => point === 0x2069; // [2]
const isStrong = (t) => includes(['L', 'R', 'AL'], t);
const isX9ControlCharacter = (t) => includes(['RLE', 'LRE', 'RLO', 'LRO', 'PDF', 'BN'], t);

export {
  ALM, FSI, LRE, LRI, LRM, LRO, PDF, PDI, RLE, RLI, RLM, RLO,
  A, B, C, D, E, F, G,
  L1,
  ON1,
  AN1,
  EN1,
  BN1,
  // ET1,
  WS1,
  LEFT_PAR, RIGHT_PAR, LEFT_SQUARE, RIGHT_SQUARE, LEFT_CURLY, RIGHT_CURLY,
  isOpeningBracket,
  isClosingBracket,
  oppositeBracket,
  MAX_DEPTH,
  isET,
  isNI,
  isR,
  isIsolateInitiator,
  isPDI,
  isStrong,
  isX9ControlCharacter,
}
