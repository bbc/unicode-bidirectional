import { List } from 'immutable';
import { resolveIsolates } from '../../src/neutral/neutral';

describe('Resolving Neutrals - Neutral Isolates', () => {
  it('should resolve [L,NI,L] to [L,L,L]', () => {
    const bidiTypes = List.of('L', 'NI', 'L');
    const resolved = List.of('L', 'L', 'L');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,R] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'NI', 'R');
    const resolved = List.of('R', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,AN] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'NI', 'AN');
    const resolved = List.of('R', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [R,NI,EN] to [R,R,R]', () => {
    const bidiTypes = List.of('R', 'NI', 'EN');
    const resolved = List.of('R', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,R] to [AN,R,R]', () => {
    const bidiTypes = List.of('AN', 'NI', 'R');
    const resolved = List.of('AN', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,AN] to [AN,R,AN]', () => {
    const bidiTypes = List.of('AN', 'NI', 'AN');
    const resolved = List.of('AN', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [AN,NI,EN] to [AN,R,EN]', () => {
    const bidiTypes = List.of('AN', 'NI', 'EN');
    const resolved = List.of('AN', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,R] to [EN,R,R]', () => {
    const bidiTypes = List.of('EN', 'NI', 'R');
    const resolved = List.of('EN', 'R', 'R');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,AN] to [EN,R,AN]', () => {
    const bidiTypes = List.of('EN', 'NI', 'AN');
    const resolved = List.of('EN', 'R', 'AN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });

  it('should resolve [EN,NI,EN] to [EN,R,EN]', () => {
    const bidiTypes = List.of('EN', 'NI', 'EN');
    const resolved = List.of('EN', 'R', 'EN');
    expect(resolveIsolates(bidiTypes)).to.equal(resolved);
  });
});
