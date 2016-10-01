import includes from 'lodash.includes';
import { LRE, RLE, LRO, RLO, PDF, LRI, RLI, FSI, PDI } from '../../util/constant';

function other(ch, index, state) {
  if (!includes([RLE, LRE, RLO, LRO, RLI, LRI, PDI, PDF], ch)) {
    const lastEntry = state.get('directionalStatusStack').peek();
    const lastLevel = lastEntry.get('level');
    return state.update('embeddingLevels', ls => ls.set(index, lastLevel))
  } else {
    return state;
  }
}

export default other;
