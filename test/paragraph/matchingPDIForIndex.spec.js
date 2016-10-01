import matchingPDIForIndex from '../../src/paragraph/matchingPDIForIndex';
import { LRI, RLI, FSI, PDI } from '../../src/type';
import { List } from 'immutable';

const A = 0x0041; // U+0041 LATIN CAPITAL LETTER A
const B = 0x0042; // U+0042 LATIN CAPITAL LETTER B
const C = 0x0043; // U+0043 LATIN CAPITAL LETTER C
const D = 0x0044; // U+0044 LATIN CAPITAL LETTER D
const E = 0x0045; // U+0044 LATIN CAPITAL LETTER E
const F = 0x0046; // U+0044 LATIN CAPITAL LETTER F
const G = 0x0047; // U+0044 LATIN CAPITAL LETTER G

describe('[Paragraph] Matching PDI for given Isolate Initiator', () => {

  it('should match 0 with 1 for [LRI, PDI]', () => {
    expect(matchingPDIForIndex(List.of(LRI, PDI), 0)).to.equal(1);
  });

  it('should match 0 with 1 for [RLI, PDI]', () => {
    expect(matchingPDIForIndex(List.of(RLI, PDI), 0)).to.equal(1);
  });

  it('should match 0 with 1 for [FSI, PDI]', () => {
    expect(matchingPDIForIndex(List.of(FSI, PDI), 0)).to.equal(1);
  });

  it('should match 0 with 4 for [LRI, A, A, A, PDI]', () => {
    const codepoints = List.of(A, LRI, B, LRI, C, PDI, D, PDI, E);
    expect(matchingPDIForIndex(codepoints, 1)).to.equal(7);
  });

  it('should match 0 with 3 for [LRI, LRI, PDI, PDI]', () => {
    const codepoints = List.of(LRI, LRI, PDI, PDI);
    expect(matchingPDIForIndex(codepoints, 0)).to.equal(3);
  });

  it('should match 1 with 7 for [A, LRI, B, LRI, C, PDI, D, PDI, E]', () => {
    const codepoints = List.of(A, LRI, B, LRI, C, PDI, D, PDI, E);
    expect(matchingPDIForIndex(codepoints, 1)).to.equal(7);
  });

  it('should match 3 with 4 for [RLI, RLI, RLI, FSI, PDI, PDI, PDI, PDI]', () => {
    const codepoints = List.of(RLI, RLI, RLI, FSI, PDI, PDI, PDI, PDI);
    expect(matchingPDIForIndex(codepoints, 3)).to.equal(4);
  });

  it('should return -1 when isolator initialor index is out of bounds', () => {
    // 1000 is strictly greater than size = 2
    expect(matchingPDIForIndex(List.of(LRI, PDI), 1000)).to.equal(-1);
  });

  it('should return -1 when item at index is not an isolate initiator', () => {
    // PDI is not an isolate initiator
    expect(matchingPDIForIndex(List.of(LRI, PDI), 1)).to.equal(-1);
  });

  it('should return -1 when a matching PDI cannot be found', () => {
    // the LRI does not have a matching PDI
    expect(matchingPDIForIndex(List.of(LRI, RLI, PDI), 0)).to.equal(-1);
  });

});
