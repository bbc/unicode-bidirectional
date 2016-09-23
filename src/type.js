import { Record, Stack, List } from 'immutable';

const DirectionalStatusStackEntry = Record({
  level: 0,
  override: 'neutral',
  isolate: false
});
const EmbeddingLevelState = Record({
  directionalStatusStack: List.of(new DirectionalStatusStackEntry()), // [1]
  overflowIsolateCount: 0,
  overflowEmbeddingCount: 0,
  validIsolateCount: 0
}); // [6]



// Used for BD16. to compute bracket pairs
// Usage:
//     const stack = Stack.of(new BracketPairStackEntry())
//     const pairings = List.of(new Pairing())
const BracketPairStackEntry = Record({
  point: 0,
  position: 0
});

const Pairing = Record({
  open: 0,
  close: 0
});

const BracketPairState = Record({
  stack: Stack.of(),
  pairings: List.of()
});

export {
  BracketPairStackEntry,
  Pairing,
  BracketPairState
}
