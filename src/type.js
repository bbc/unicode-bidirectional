
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
