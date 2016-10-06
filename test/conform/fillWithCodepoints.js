import {
  ALM, FSI, LRE, LRI, LRM, LRO, PDF, PDI, RLE, RLI, RLM, RLO,
  L1 as L,
  R1 as R,
  ON1 as ON,
  AN1 as AN,
  EN1 as EN,
  WS1 as WS,
  BN1 as BN
} from '../../src/util/constant';

function fillWithCodepoints(bidiTypes) {
  return bidiTypes.map(t => {
    if (t === 'ALM') return ALM;
    if (t === 'FSI') return FSI;
    if (t === 'LRE') return LRE;
    if (t === 'LRI') return LRI;
    if (t === 'LRM') return LRM;
    if (t === 'PDF') return PDF;
    if (t === 'PDI') return PDI;
    if (t === 'RLE') return RLE;
    if (t === 'RLI') return RLI;
    if (t === 'RLM') return RLM;
    if (t === 'RLO') return RLO;

    if (t === 'L') return L;
    if (t === 'R') return R;
    if (t === 'BN') return BN;
    if (t === 'ON') return ON;
    if (t === 'AN') return AN;
    if (t === 'EN') return EN;
    if (t === 'WS') return WS;

    return t;
  });
}

export default fillWithCodepoints;
