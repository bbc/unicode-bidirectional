import { List } from 'immutable';
import { Run, nsm } from '../weak';

const AL =  0x0643 // eg. U+0643 ARABIC LETTER KAF
const NSM = 0x0652 // eg. U+0652 ARABIC SUKUN
const LRI = 0x2066 //     U+2066 LEFT‑TO‑RIGHT ISOLATE
const PDI = 0x2069 //     U+2069 POP DIRECTIONAL ISOLATE

describe('Resolving Weak Types - NSM (Non Spacing Mark)', () => {

  it('should change [AL,NSM,NSM] to [AL,AL,AL]', () => {
    const run = new Run({ points: List.of(AL, NSM, NSM) });
    const types = List.of('AL', 'NSM', 'NSM');
    expect(nsm(types, run)).to.equal(List.of('AL', 'AL', 'AL'));
  });

  it('should change [sos,NSM] to [sos,R]', () => {
    const run = new Run({ sos: 'R', points: List.of(NSM) });
    const types = List.of('NSM');
    expect(nsm(types, run)).to.equal(List.of('R'));
  });

  it('should change [LRI,NSM] to [LRI,ON]', () => {
    const run = new Run({ points: List.of(LRI, NSM) });
    const types = List.of('LRI', 'ON');
    expect(nsm(types, run)).to.equal(List.of('LRI', 'ON'));
  });

  it('should change [PDI,NSM] to [PDI,ON]', () => {
    const run = new Run({ points: List.of(PDI, NSM) });
    const types = List.of('PDI', 'NSM');
    expect(nsm(types, run)).to.equal(List.of('PDI', 'ON'));
  });

});
