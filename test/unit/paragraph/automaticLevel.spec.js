import { List } from 'immutable';
import { L1 as L } from '../../../src/util/constant';
import { R1 as R } from '../../../src/util/constant';
import { AL1 as AL } from '../../../src/util/constant';
import { LRI, RLI, PDI } from '../../../src/util/constant';
import automaticLevel from '../../../src/paragraph/automaticLevel';

describe('[Paragraph] - Finding Paragraph Level via Auto-LTR', () => {

  it('should determine the autolevel to be 0 for []', () => {
    expect(automaticLevel(List.of(), List.of())).to.equal(0);
  });

  it('should determine the autolevel to be 0 for [L]', () => {
    expect(automaticLevel(List.of(L), List.of('L'))).to.equal(0);
  });

  it('should determine the autolevel to be 1 for [R]', () => {
    expect(automaticLevel(List.of(R), List.of('R'))).to.equal(1);
  });

  it('should determine the autolevel to be 1 for [AL]', () => {
    expect(automaticLevel(List.of(AL), List.of('AL'))).to.equal(1);
  });

  it('should determine the autolevel to be 0 for [LRI, ..., PDI, L]', () => {
    // thus skipping over characters between the isolate initiator (LRI) and its matching PDI
    const codepoints = List.of(LRI, R, R, PDI, L);
    const bidiTypes = List.of('LRI', 'R', 'R', 'PDI', 'L');
    expect(automaticLevel(codepoints, bidiTypes)).to.equal(0);
  });

  it('should determine the autolevel to be 1 for [RLI, ..., PDI, R]', () => {
    // thus skipping over characters between the isolate initiator (RLI) and its matching PDI
    const codepoints = List.of(LRI, L, L, PDI, R);
    const bidiTypes = List.of('LRI', 'L', 'L', 'PDI', 'R');
    expect(automaticLevel(codepoints, bidiTypes)).to.equal(1);
  });

  it('should determine the autolevel to be 1 for [LRI, (RLI ... PDI)+, PDI, R]', () => {
    // thus skipping over characters between the isolate initiator (RLI) and its matching PDI
    const codepoints = List.of(LRI, RLI, L, PDI, RLI, L, PDI, PDI, R);
    const bidiTypes = List.of('LRI', 'RLI', 'L', 'PDI', 'RLI', 'L', 'PDI', 'PDI', 'R');
    expect(automaticLevel(codepoints, bidiTypes)).to.equal(1);
  });

  it('should determine the autolevel to be 0 for [PDI, RLI, R]', () => {
    // ignoring the first PDI which has nothing to pop
    // ignoring characters between RLI and the end of the paragraph (RLI has no matching PDI)
    const codepoints = List.of(PDI, RLI, L);
    const bidiTypes = List.of('PDI', 'RLI', 'L');
    expect(automaticLevel(codepoints, bidiTypes)).to.equal(0);
  });

});
