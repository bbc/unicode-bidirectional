# unicode-bidirectional

[![Code Climate](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/gpa.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional)
[![Test Coverage](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/coverage.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional/coverage)
[![Build Status](https://travis-ci.org/bbc/unicode-bidirectional.svg?branch=master)](https://travis-ci.org/bbc/unicode-bidirectional)     
*A Javascript implementation of the [Unicode 9.0.0 Bidirectional Algorithm](http://www.unicode.org/reports/tr9/)*

## Installation
```
npm install unicode-bidirectional --save
```

## API

**`resolve(codepoints, paragraphlevel, automaticLevel = false)`**    
Returns the *levels* associated to each codepoint in *codepoints*.
These levels of codepoints describe how they should be reversed when displayed on the screen.
The input codepoints are in a paragraph with base direction of *paragraphLevel*. 
- `codepoints` — an *Array of Numbers* where each number is an integer between 0x0000-0xFFFF (inclusive) representing the codepoint of the character.
- `paragraphlevel` — a *Number* that is either `0` or `1`. Represents whether the paragraph is left-to-right (`0`) or right-to-left (`1`). This is same as the "paragraph embedding level" (see [BD4.](http://unicode.org/reports/tr9/#BD4)).
- `automaticLevel` — a *Boolean* that when true, ignore the *paragraphlevel* argument and instead, deduce the paragraph level from the codepoints. This implements rules [P2.](http://unicode.org/reports/tr9/#P2) and [P3](http://unicode.org/reports/tr9/#P3). 
- **returns** — an *Array of Numbers* representing the levels.

**`reorder(codepoints, levels)`**    
Returns the codepoints in *codepoints* reordered (permuted) according `levels` (see [L2.](http://unicode.org/reports/tr9/#L2)).
The original *codepoints* array is not modified.

- `codepoints` — an *Array of Numbers* where each number is an integer between 0x0000 and 0xFFFF (inclusive) representing the codepoint of the character.
- `levels` — an *Array of Numbers* where each number is an integer between 0 and 127 (inclusive) representing the level of the codepoint
- **returns** — an *Array of Numbers* representing the reordered codepoints.


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
