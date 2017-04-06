import { resolve, reorder } from '../../src/main';

describe('[API] Public API - main', () => {

  it('should expose "resolve()" so consumers can find levels', () => {
    // and then later use those levels to reorder codepoints
    const codepoints = [0x0645, 0x0627, 0x0631, 0x0652, 0x0643];
    const levels = resolve(codepoints, 0);
    expect(levels).to.deep.equal([1,1,1,1,1]);
  });

  it('should expose "reorder()" so consumers can reorder codepoints', () => {
    const codepoints = [0x0645, 0x0627, 0x0631, 0x0652, 0x0643];
    const reordered = reorder(codepoints, [1,1,1,1,1]);
    expect(reordered).to.deep.equal(codepoints.reverse());
  });

});
