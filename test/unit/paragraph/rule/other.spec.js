import { DirectionalStatusStackEntry, EmbeddingLevelState } from '../../../../src/type';
import { Stack, List } from 'immutable';
import other from '../../../../src/paragraph/rule/other';
import { B1 as B } from '../../../../src/util/constant';

describe('[Paragraph] X6. Setting the embedding level', () => {

  it('should ignore B when updating the level', () => {
    const stack = Stack.of(new DirectionalStatusStackEntry({ level: 1 }));
    const state = new EmbeddingLevelState()
      .set('directionalStatusStack', stack)
      .set('bidiTypes', List.of(0, 0))
      .set('embeddingLevels', List.of(0, 0))

    expect(other(B, 'B', 0, state).getIn(['embeddingLevels', 0])).to.equal(0);
  });

});
