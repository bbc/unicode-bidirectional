import { List } from 'immutable';
import {
  WeakResolutionState,
  resolveWeaksForRun,
} from '../weak';

const AL =  0x0643 // eg. U+0643 ARABIC LETTER KAF
const NSM = 0x0652 // eg. U+0652 ARABIC SUKUN
const LRI = 0x2066 //     U+2066 LEFT‑TO‑RIGHT ISOLATE
const PDI = 0x2069 //     U+2069 POP DIRECTIONAL ISOLATE

describe('Resolving Weak Types - NSM (Non Spacing Mark)', () => {
  it('should change [AL,NSM,NSM] to [AL,AL,AL]', () => {
    const state = new WeakResolutionState({
      points: List.of(AL, NSM, NSM),
      types: List.of('AL', 'NSM', 'NSM')
    });
    expect(resolveWeaksForRun(state).get('types')).to.equal(List.of('AL', 'AL', 'AL'));
  });

  it('should change [sos,NSM] to [sos,R]', () => {
    const state = new WeakResolutionState({
      sos: 'R',
      points: List.of(NSM),
      types: List.of('NSM')
    });
    expect(resolveWeaksForRun(state).get('types')).to.equal(List.of('R'));
  });

  it('should change [LRI,NSM] to [LRI,ON]', () => {
    const state = new WeakResolutionState({
      points: List.of(LRI, NSM),
      types: List.of('LRI', 'NSM')
    });
    expect(resolveWeaksForRun(state).get('types')).to.equal(List.of('LRI', 'ON'));
  });

  it('should change [PDI,NSM] to [PDI,ON]', () => {
    const state = new WeakResolutionState({
      points: List.of(PDI, NSM),
      types: List.of('PDI', 'NSM')
    });
    expect(resolveWeaksForRun(state).get('types')).to.equal(List.of('PDI', 'ON'));
  });

});
