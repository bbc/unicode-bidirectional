import { Record, Stack, List } from 'immutable';

const LRE = 0x202A;
const RLE = 0x202B;
const LRO = 0x202D;
const RLO = 0x202E;
const PDF = 0x202C;
const LRI = 0x2066;
const RLI = 0x2067;
const FSI = 0x2068;
const PDI = 0x2069;
const LRM = 0x200E;
const RLM = 0x200F;
const ALM = 0x061C;

const increase = c => c + 1;
const decrease = c => c - 1;

const MAX_DEPTH = 125;

// Paragraph
// ------------------------------------------
// 3.3.2 Explicit Levels and Directions
// [1]: the "directional status stack"
// [2]: "At the start of the pass, the directional status stack is initialized to
//       an entry reflecting the paragraph embedding level, ..."
// [3]: Initial value described by X1.
const DirectionalStatusStackEntry = Record({
  isolate: false,
  level: 0,
  override: 'neutral'
});
const EmbeddingLevelState = Record({
  directionalStatusStack: Stack.of(new DirectionalStatusStackEntry()), // [1,2]
  bidiTypes: List.of(),
  embeddingLevels: List.of(),
  overflowEmbeddingCount: 0,
  overflowIsolateCount: 0,
  validIsolateCount: 0
}); // [3]

const Run = Record({
  level: 0, // TODO: change to -1
  from: 0,
  to: 0
});

// Bracket
// ------------------------------------------
// Used for BD16. to compute bracket pairs
const BracketPairStackEntry = Record({ point: 0, position: 0 });
const Pairing = Record({ open: 0, close: 0 });
const BracketPairState = Record({ stack: Stack.of(), pairings: List.of() });

export {
  increase,
  decrease,
  MAX_DEPTH,
  LRE,
  RLE,
  LRO,
  RLO,
  PDF,
  LRI,
  RLI,
  FSI,
  PDI,
  LRM,
  RLM,
  ALM,
  BracketPairStackEntry,
  BracketPairState,
  DirectionalStatusStackEntry,
  EmbeddingLevelState,
  Pairing,
  Run
}
