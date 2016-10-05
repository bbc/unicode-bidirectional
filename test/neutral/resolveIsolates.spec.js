import { List } from 'immutable';
import { resolveIsolates } from '../../src/neutral/neutral';
import { L1 as L } from '../../src/util/constant';
import { R1 as R } from '../../src/util/constant';
import { ON1 as ON } from '../../src/util/constant';

const __ = 'L'; // a bidi type we "dont care" about

describe('Resolving Neutrals - Neutral Isolates', () => {
  it('should resolve [L,NI,L] to [L,L,L]', () => {
    const bidiTypes = List.of('L', 'ON', 'L');
    const resolved = List.of('L', 'L', 'L');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,R] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'ON', 'R');
    const resolved = List.of('R', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,AN] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'ON', 'AN');
    const resolved = List.of('R', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,EN] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'ON', 'EN');
    const resolved = List.of('R', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,R] to [AN,R,R]', () => {
    const bidiTypes = List.of('AN', 'ON', 'R');
    const resolved = List.of('AN', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,AN] to [AN,R,AN]', () => {
    const bidiTypes = List.of('AN', 'ON', 'AN');
    const resolved = List.of('AN', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,EN] to [AN,R,EN]', () => {
    const bidiTypes = List.of('AN', 'ON', 'EN');
    const resolved = List.of('AN', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,R] to [EN,R,R]', () => {
    const bidiTypes = List.of('EN', 'ON', 'R');
    const resolved = List.of('EN', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,AN] to [EN,R,AN]', () => {
    const bidiTypes = List.of('EN', 'ON', 'AN');
    const resolved = List.of('EN', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,EN] to [EN,R,EN]', () => {
    const bidiTypes = List.of('EN', 'ON', 'EN');
    const resolved = List.of('EN', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [L,NI,eos] to [L,L,eos] when eos = L', () => {
    const types = List.of('L','ON');
    const points = List.of(L, ON);
    expect(resolveIsolates(types, points, __, 'L', 0)).to.equal(List.of('L', 'L'));
  });

  it('should resolve [L,NI,eos] to [L,L,eos] when eos = L', () => {
    const types = List.of('L','ON');
    const points = List.of(L, ON);
    expect(resolveIsolates(types, points, __, 'L', 0)).to.equal(List.of('L', 'L'));
  });

  it('should resolve [sos,NI,R] to [L,L,eos] when sos = R', () => {
    const types = List.of('ON', 'R');
    const points = List.of(ON, R);
    expect(resolveIsolates(types, points, 'R', __, 0)).to.equal(List.of('R', 'R'));
  });

});
