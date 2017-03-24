# unicode-bidirectional

[![Code Climate](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/gpa.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional)
[![Test Coverage](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/coverage.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional/coverage)

*A Javascript implementation of the [Unicode 9.0.0 Bidirectional Algorithm](http://www.unicode.org/reports/tr9/)*


## Testing

To run the **unit tests**:
```
npm run test
```

To run the **conformance tests** (as [provided by Unicode](http://unicode.org/reports/tr9/#Bidi_Conformance_Testing)):
```
npm run conform
```
This runs *both* of Unicode's test suites:
1. Codepoint tests (`BidiTest.txt`, 91699 test cases) 
2. Character class tests (`BidiCharacterTest.txt`, 490846 test cases),

You can use run *just one* of these suites via the following commands:
```bash
npm run conform-codepoint     # run just codepoint suite 
npm run conform-bidiclass     # run just character class suite  
```

**Conformance**: The implementation is conformant as per definition [UAX9-C1](http://www.unicode.org/reports/tr9/#C1).
Definitions BD1–BD16 and steps P1–P3, X1–X10, W1–W7, N0–N2, I1–I2, and L1–L4 have been implemented.
