import { Record, Stack, List } from 'immutable';

const increase = c => c + 1;
const decrease = c => c - 1;

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
  level: -1,
  from: 0,
  to: 0
}, 'Run');

const Sequence = Record({
  runs: List.of(),
  eos: '',
  sos: '',
}, 'Sequence');

// Bracket
// ------------------------------------------
// Used for BD16. to compute bracket pairs
const BracketPairStackEntry = Record({ point: 0, position: 0 });
const Pairing = Record({ open: 0, close: 0 });
const BracketPairState = Record({ stack: Stack.of(), pairings: List.of() });

export {
  increase,
  decrease,
  BracketPairStackEntry,
  BracketPairState,
  DirectionalStatusStackEntry,
  EmbeddingLevelState,
  Pairing,
  Run,
  Sequence
}
