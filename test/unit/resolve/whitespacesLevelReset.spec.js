import { List } from 'immutable';
import whitespacesLevelReset from '../../../src/resolve/whitespacesLevelReset';

describe('[Resolve] - Resetting levels of whitespace characters (L1)', () => {
  it('should reset segment separators to paragraph embedding level', () => {
    const types = List.of('S');
    const levels = List.of(1);
    expect(whitespacesLevelReset(types, levels, 0)).to.equal(List.of(0));
  });

  it('should reset paragraph separators to paragraph embedding level', () => {
    const types = List.of('B');
    const levels = List.of(1);
    expect(whitespacesLevelReset(types, levels, 0)).to.equal(List.of(0));
  });

  it('should reset a sequence of whitespaces/isolate-formatters preceding an S', () => {
    const types = List.of('WS','FSI','RLI','LRI','S');
    const levels = List.of(1,1,1,1,0);
    const reset = List.of(0,0,0,0,0);
    expect(whitespacesLevelReset(types, levels, 0)).to.equal(reset);
  });

  it('should reset a sequence of whitespaces/isolate-formatters preceding an B', () => {
    const types = List.of('WS','FSI','RLI','LRI','B');
    const levels = List.of(1,1,1,1,0);
    const reset = List.of(0,0,0,0,0);
    expect(whitespacesLevelReset(types, levels, 0)).to.equal(reset);
  });

  it('should reset a sequence of whitespaces/isolate-formatters at the end of a line', () => {
    const types = List.of('WS','FSI','RLI','LRI');
    const levels = List.of(1,1,1,1);
    const reset = List.of(0,0,0,0);
    expect(whitespacesLevelReset(types, levels, 0)).to.equal(reset);
  });

});
