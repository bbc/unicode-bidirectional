import { List } from 'immutable';

function resolveImplicit(types, levels) {
  return types.zipWith((t,level) => {
    if (t === 'L')  { return level + (level % 2) }
    if (t === 'R')  { return level + ((level + 1) % 2) }
    if (t === 'AN' || t === 'EN') { return (level + 1) + ((level + 1) % 2) }
  }, levels);
}

export {
  resolveImplicit
}
