import { List, Map } from 'immutable';
import matchingPDIs from '../../src/paragraph/matchingPDIs';
import { LRI, RLI, PDI } from '../../src/util/constant';
import { A, B, C, D } from '../../src/util/constant';

describe('[Paragraph] Finding matching PDI for a given isolate initiator', () => {

  it('should find empty maps when there are no initator-PDI pairs', () => {
    const codepoints = List.of(A, B, C, D);
    const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);
    expect(initiatorToPDI).to.equal(Map());
    expect(initiatorFromPDI).to.equal(Map());
  });

  it('should find an trivial pair', () => {
    const codepoints = List.of(RLI, PDI);
    const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);
    expect(initiatorToPDI).to.equal(Map([[0,1]]));
    expect(initiatorFromPDI).to.equal(Map([[1,0]]));
  });

  it('should find an initiator-to-pdi map', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const { initiatorToPDI } = matchingPDIs(codepoints);
    expect(initiatorToPDI).to.equal(Map([[1,3], [4,6]]));
  });

  it('should find an pdi-to-initiator map', () => {
    const codepoints = List.of(A, RLI, B, PDI, RLI, C, PDI, D);
    const { initiatorFromPDI } = matchingPDIs(codepoints);
    expect(initiatorFromPDI).to.equal(Map([[3,1], [6,4]]));
  });
});
