import { List, Map } from 'immutable';
import fillWithCodepoints from '../../conform/fillWithCodepoints';
import { resolvedLevelsWithInvisibles } from '../../../src/resolve/resolvedLevels';

describe('[Resolve] - Resolved levels with Invisibles', () => {

  it('should find levels [LRE, R] as [x,3] when paragraph level is 1', () => {
    const bidiTypes = List.of('LRE', 'R');
    const codepoints = fillWithCodepoints(bidiTypes);
    const display = List.of('x', 3);
    expect(resolvedLevelsWithInvisibles(codepoints, bidiTypes, 1)).to.equal(display);
  });

  it('should find levels [LRE, R] as [x,3] when paragraph level is 1', () => {
    const bidiTypes = List.of('R','R','LRE','AN');
    const codepoints = fillWithCodepoints(bidiTypes);
    const display = List.of(1,1,'x',4);
    expect(resolvedLevelsWithInvisibles(codepoints, bidiTypes, 1)).to.equal(display);
  });

  it('should still find levels even when there is are no invisibles', () => {
    const bidiTypes = List.of('LRI','R','S','R');
    const codepoints = fillWithCodepoints(bidiTypes);
    const display = List.of(1,3,1,3);
    expect(resolvedLevelsWithInvisibles(codepoints, bidiTypes, 1)).to.equal(display);
  });

  it('sould find levels for a large number of codepoints with several invisibles', () => {
    const bidiTypes = List.of('L','L','L','L','LRO','WS','L','L','PDF','PDF','PDF',
        'WS','RLO','WS','L','WS','L','L','L','L','WS','L','L','L','PDF');
    const codepoints = fillWithCodepoints(bidiTypes);
    const levels = List.of(2,2,2,2,'x',2,2,2,'x','x','x',1,'x',3,3,3,3,3,3,3,3,3,3,3,'x');
    expect(resolvedLevelsWithInvisibles(codepoints, bidiTypes, 1)).to.equal(levels);
  })

});

