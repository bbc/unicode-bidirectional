import { List } from 'immutable';
import { resolveImplicit } from '../../src/implicit/implicit';

describe('Resolving Implicit Levels', () => {
  it('should increase ANs at an odd embedding level by one', () => {
    const types = List.of('R', 'AN', 'AN', 'R');
    const levels = List.of(1, 1, 1, 1);
    const resolved = List.of(1, 2, 2, 1);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should increase ENs at odd embedding level by one', () => {
    const types = List.of('EN');
    const levels = List.of(1);
    const resolved = List.of(2);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should increase L at odd embedding level by one', () => {
    const types = List.of('L');
    const levels = List.of(1);
    const resolved = List.of(2);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should not change the level of any Rs at odd embedding levels', () => {
    const types = List.of('R');
    const levels = List.of(1);
    const resolved = List.of(1);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should not change the level of any Rs at odd embedding levels', () => {
    const types = List.of('R');
    const levels = List.of(1);
    const resolved = List.of(1);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should not change the level of any Ls at even embedding levels', () => {
    const types = List.of('L');
    const levels = List.of(0);
    const resolved = List.of(0);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should increase R at even embedding level by one', () => {
    const types = List.of('R');
    const levels = List.of(0);
    const resolved = List.of(1);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should increase AN at even embedding level by two', () => {
    const types = List.of('AN');
    const levels = List.of(0);
    const resolved = List.of(2);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

  it('should increase EN at even embedding level by two', () => {
    const types = List.of('AN');
    const levels = List.of(0);
    const resolved = List.of(2);
    expect(resolveImplicit(types, levels)).to.equal(resolved);
  });

});

