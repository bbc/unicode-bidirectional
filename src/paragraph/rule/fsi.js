import rli from './rli';
import lri from './lri';
import automaticLevel from '../automaticLevel';
import matchingPDIs from '../matchingPDIs';
import { FSI, RLI, LRI } from '../../util/constant';

function fsi(codepoint, bidiType, index, state, codepoints, bidiTypes) {
  if (codepoint !== FSI) return state;

  const { initiatorToPDI } = matchingPDIs(codepoints);
  const matchingPDI = initiatorToPDI.get(index, -1);
  const from = index + 1;
  const to = (matchingPDI > -1) ? matchingPDI : codepoints.size;

  const codepointsSlice = codepoints.slice(from, to);
  const bidiTypesSlice = bidiTypes.slice(from, to);

  if (automaticLevel(codepointsSlice, bidiTypesSlice) === 1) {
    return rli(RLI, bidiType, index, state, codepoints);
  } else {
    return lri(LRI, bidiType, index, state, codepoints);
  }

}

export default fsi;
