# unicode-bidirectional

*Implementation of Unicode 9.0.0 Bidirectional Algorithm*

The algorithm is a deviation of the explicit algorithm (which forms the normative statement for conformance).
This implementation retains BNs and Explicit Formatting Characters as described in [5.2 Retaining BNs and Explicit Formatting Characters](http://unicode.org/reports/tr9/#Retaining_Explicit_Formatting_Characters).

## Testing

To run the **unit tests**:
```
npm run test
```

To run the **conformance tests** (as [provided by Unicode](http://unicode.org/reports/tr9/#Bidi_Conformance_Testing)):
```
npm run conform
```
