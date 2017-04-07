# unicode-bidirectional

[![Code Climate](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/gpa.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional)
[![Test Coverage](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/coverage.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional/coverage)
[![Build Status](https://travis-ci.org/bbc/unicode-bidirectional.svg?branch=master)](https://travis-ci.org/bbc/unicode-bidirectional)     
*A Javascript implementation of the [Unicode 9.0.0 Bidirectional Algorithm](http://www.unicode.org/reports/tr9/)*

## Installation
```
npm install unicode-bidirectional --save
```

## Usage
```javascript
import { resolve, reorder, reorderPermutation } from 'unicode-bidirectional';

const codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
const levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
const reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
```

To find the codepoints of a String, you can use [`String.prototype.charCodeAt`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt) or use 
[`punycode.js`](https://github.com/bestiejs/punycode.js) to get around [UCS2 issues](https://mathiasbynens.be/notes/javascript-unicode) (recommended).

## API

**`resolve(codepoints, paragraphlevel, automaticLevel = false)`**    
Returns the *levels* associated to each codepoint in *codepoints*.
These levels of codepoints describe how they should be reversed when displayed on the screen.
The input codepoints are assumed to be in the same paragraph having a base direction of *paragraphLevel*. 
- **`codepoints`** — an *Array of Numbers* where each number denotes the Unicode codepoint of the character.
- **`paragraphlevel`** — a *Number* that is either 0 or 1. Represents whether the paragraph is left-to-right (0) or right-to-left (1). This is same as the "paragraph embedding level" (see [BD4.](http://unicode.org/reports/tr9/#BD4)).
- **`automaticLevel`** — a *Boolean* that when true, ignores the *paragraphlevel* argument and instead, deduces the paragraph level from the codepoints. This implements rules [P2.](http://unicode.org/reports/tr9/#P2) and [P3](http://unicode.org/reports/tr9/#P3). 
- **returns** — an *Array of Numbers* representing the levels.

**`reorder(codepoints, levels)`**    
Returns the codepoints in *codepoints* reordered (permuted) according `levels` (see [L2.](http://unicode.org/reports/tr9/#L2)).
The original *codepoints* array is not modified.

- **`codepoints`** — an *Array of Numbers* where each number denotes the Unicode codepoint of the character.
- **`levels`** — an *Array of Numbers* where each number is an integer denotes the level of the codepoint.
- **returns** — an *Array of Numbers* representing the reordered codepoints.


Additional Notes:
1. all *levels* arrays are Arrays of Numbers where each number must be an integer between 0 and 127 (inclusive).
2. all *codepoints* arrays are Arrays of Numbers where each number must be an integer between 0x0000-0xFFFF (inclusive).

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

## Extended API

**`reorderPermutation(levels)`**    
Returns the permutation represented by *levels* as an array. 

- **`levels`** — an *Array of Numbers* where each number denotes the level of the codepoint.
- **returns** — an *Array of Numbers* representing a permutation; an element at index i with value j denotes that the codepoint previous positioned at index i is now positioned at index j.

