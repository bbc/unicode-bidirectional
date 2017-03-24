# unicode-bidirectional

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
This runs *both* of Unicodes test suites
1. codepoint tests (BidiTest.txt, 91699 test cases) 
2. character class tests (BidiCharacterTest.txt, 490846 test cases),

However, you can use run *just one* of these suites via the following commands:
```bash
npm run conform-codepoint     # run just codepoint tests
npm run conform-bidiclass     # run just the character class suites]
```

**Conformance**: The implementation is informally conformant in the sense that is passes both the conformance tests.
It (currently) is not formally conformant as per definition [UAX9-C1](http://www.unicode.org/reports/tr9/#C1).
Rule L4 has not (yet) been implemented. Definitions BD1–BD16 and steps P1–P3, X1–X10, W1–W7, N0–N2, I1–I2, and L1–L3
have been implemented.
