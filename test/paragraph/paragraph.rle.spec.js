import {
  rle,
  push,
  MAX_LEVEL,
  DirectionalStatusStackEntry,
  EmbeddingLevelState
} from '../../src/paragraph/paragraph';

describe('Paragraph Level - Right-to-Left Embedding', () => {
  // cf. 3.3.2 Explicit Levels and Directions, Rule X2

  it('should add a new entry with the level increasing from level = 0 to level 3', () => {
    // because the least odd number greater than 0 is 1
    const before = new EmbeddingLevelState();
    const after = push(before, new DirectionalStatusStackEntry({ level: 1 }));
    expect(rle(before)).to.equal(after);
  });

  it('should add a new entry with the level increasing from level = 1 to level = 3', () => {
    // because the least odd number greater than 1 is 3
    const before = push(new EmbeddingLevelState(), new DirectionalStatusStackEntry({ level: 1 }));
    const after = push(before, new DirectionalStatusStackEntry({ level: 3 }));
    expect(rle(before)).to.equal(after);
  });

  it('should add a new entry with the level increasing from level = 2 to level = 3', () => {
    // because the least odd number greater than 2 is 3
    const before = push(new EmbeddingLevelState(), new DirectionalStatusStackEntry({ level: 1 }));
    const after = push(before, new DirectionalStatusStackEntry({ level: 3 }));
    expect(rle(before)).to.equal(after);
  });

  it('should increment overflow embedding count when overflow isolate count is 0', () => {
    const before = new EmbeddingLevelState({ overflowEmbeddingCount: 20, });
    const after = before.set('overflowEmbeddingCount', 21);
    expect(rle(before)).to.equal(after);
  });

  it('should increment overflow embedding when level == MAX_LEVEL and overflow isolate count > 0', () => {
    const before = push(
      new EmbeddingLevelState(),
      new DirectionalStatusStackEntry({ level: MAX_LEVEL })
    ).set('overflowEmbeddingCount', 20);
    const after = before.set('overflowEmbeddingCount', 21);
    expect(rle(before)).to.equal(after);
  });

});
