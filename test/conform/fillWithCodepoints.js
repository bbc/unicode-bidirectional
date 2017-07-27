import {
  ALM, FSI, LRE, LRI, LRM, LRO, PDF, PDI, RLE, RLI, RLM, RLO,
  B1 as B,
  S1 as S,
  L1 as L,
  R1 as R,
  ON1 as ON,
  AL1 as AL,
  AN1 as AN,
  EN1 as EN,
  WS1 as WS,
  BN1 as BN
} from '../../src/util/constant';

const fillMap = new Map([
  ['ALM', ALM],
  ['AL', AL],
  ['AN', AN],
  ['B', B],
  ['BN', BN],
  ['EN', EN],
  ['FSI', FSI],
  ['L', L],
  ['LRE', LRE],
  ['LRI', LRI],
  ['LRM', LRM],
  ['LRO', LRO],
  ['ON', ON],
  ['PDF', PDF],
  ['PDI', PDI],
  ['R', R],
  ['S', S],
  ['RLE', RLE],
  ['RLI', RLI],
  ['RLM', RLM],
  ['RLO', RLO],
  ['WS', WS]
]);

function fillWithCodepoints(bidiTypes) {
  return bidiTypes.map(t => fillMap.get(t));
}

export default fillWithCodepoints;
