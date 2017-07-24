# unicode-bidirectional

[![Code Climate](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/gpa.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional)
[![Test Coverage](https://codeclimate.com/github/bbc/unicode-bidirectional/badges/coverage.svg)](https://codeclimate.com/github/bbc/unicode-bidirectional/coverage)
[![Build Status](https://travis-ci.org/bbc/unicode-bidirectional.svg?branch=master)](https://travis-ci.org/bbc/unicode-bidirectional)     
*A Javascript implementation of the [Unicode 9.0.0 Bidirectional Algorithm](http://www.unicode.org/reports/tr9/)*

This is an implementation of the Unicode Bidirectional Algorithm (UAX #9) that
works in both Browser and Node.js environments. The implementation is conformant as per definition [UAX#9-C1](http://www.unicode.org/reports/tr9/#C1).

## Installation
```
npm install unicode-bidirectional --save
```


## Usage

unicode-bidirectional is declared as a *Universal Module* ([UMD](https://github.com/umdjs/umd)),
meaning it can be used with all conventional Javascript module systems:

#### 1. ES6 [→](https://github.com/bbc/unicode-bidirectional/blob/master/example/example1.js)

```javascript
import { resolve, reorder } from 'unicode-bidirectional';

const codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
const levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
const reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
```

#### 2. CommonJS [→](https://github.com/bbc/unicode-bidirectional/blob/master/example/example2.js)

```javascript
var UnicodeBidirectional = require('unicode-bidirectional');
var resolve = UnicodeBidirectional.resolve;
var reorder = UnicodeBidirectional.reorder;

var codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
var levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
var reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
```

#### 3. RequireJS [→](https://github.com/bbc/unicode-bidirectional/blob/master/example/example3.html)

```javascript
require(['UnicodeBidirectional'], function (UnicodeBidirectional) {
  var resolve = UnicodeBidirectional.resolve;
  var reorder = UnicodeBidirectional.reorder;

  var codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
  var levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
  var reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
});
```


#### 4. HTML5 `<script>` tag [→](https://github.com/bbc/unicode-bidirectional/blob/master/example/example4.html)
```html
<script src="unicode.bidirectional.js" /> <!-- exposes window.UnicodeBidirectional -->
```

```javascript
var resolve = UnicodeBidirectional.resolve;
var reorder = UnicodeBidirectional.reorder;

var codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
var levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
var reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
```

You can download `unicode.bidirectional.js` from [Releases](https://github.com/bbc/unicode-bidirectional/releases).
Using this file with a `<script>` tag will
expose `UnicodeBidirectional` as global variable on the `window` object.


## API





### `resolve(codepoints, paragraphlevel[, automaticLevel = false])`
Returns the resolved levels associated to each codepoint in **`codepoints`**.
This levels array determines: (i) the relative nesting of LTR and RTL characters, and 
hence (ii) how characters should be reversed when displayed on the screen.

The input codepoints are assumed to be all be in one paragraph that has a base direction of **`paragraphLevel`** –
this is a Number that is either 0 or 1 and represents whether the paragraph is *left-to-right* (0) or *right-to-left* (1).
**`automaticLevel`** is an optional Boolean flag that when present and set to true, 
causes this function to ignore the **`paragraphlevel`** argument and instead attempt to deduce the paragraph level from the codepoints. <sup>[1]</sup><sup>[2]</sup>    
Neither of the two input arrays are mutated.

### `reorder(codepoints, levels)`
Returns the codepoints in **`codepoints`** reordered (i.e. permuted) according the `levels` array. <sup>[3]</sup>    
Neither of the two input arrays are mutated.

### `reorderPermutation(levels, IGNORE_INVISIBLE = false)`
Returns the reordering that **`levels`** represents as an permutation array.
When this array has an element at index i with value j, it denotes that the codepoint 
previous positioned at index i is now positioned at index j. <sup>[4]</sup>     
The input array is not mutated. The `IGNORE_INVISIBLE` parameter controls whether or not
invisible characters (characters with a level of 'x' <sup>[5]</sup>)
are to be included in the permutation array. 
By default, they *are* included in the permutation (they are *not* ignored, hence `IGNORE_INVISIBLE` is *false*).

**Additional Notes:**

> For all the above functions, codepoints are represented by an Array of Numbers 
where each Number denotes the Unicode codepoint of the character, that 
is an integer between 0x0 and 0x10FFFF inclusive. levels are represented by an Array of 
Numbers where Number is an integer between 0 and 127 inclusive. One or more entries of levels 
may be the string 'x'. This denotes a character that does not have a level <sup>[5]</sup>.


> **[1]**: This function deduces the paragraph level according to:  [UAX#P1](http://unicode.org/reports/tr9/#P1), [UAX#P2](http://unicode.org/reports/tr9/#P2) and [UAX#P3](http://unicode.org/reports/tr9/#P3).   
**[2]**: Codepoints are automatically converted to [NFC normal form](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) if that are not already in that form.   
**[3]**: This is an implementation of [UAX#9-L2](http://unicode.org/reports/tr9/#L2).      
**[4]**: More formally known as the *one-line notation* for permutations. [See Wikipedia](https://en.wikipedia.org/wiki/Permutation#Definition_and_notations).     
**[5]**: Some characters have a level of x – the levels array has a string 'x' instead of a number.
This is expected behaviour. The reason is because the Unicode Bidirectional algorithm (by rule [X9](http://unicode.org/reports/tr9/#X9).) will not assign a level to certain invisible characters / control characters. 
They are basically completely ignored by the algorithm. 
They are invisible and so have no impact on the visual RTL/LTR ordering of characters. 
Most of the invisible characters that fall into this category are in this [list](https://www.compart.com/en/unicode/bidiclass/BN).


## More Info

For other Javascript Unicode Implementations see:
- [devongovett/grapheme-breaker](https://github.com/devongovett/grapheme-breaker) – Unicode Grapheme Cluster Breaking Algorithm (UAX #29) 
- [devongovett/linebreak](https://github.com/devongovett/linebreak) – Unicode Line Breaking Algorithm (UAX #14)

## License
MIT.    
Copyright (c) 2017 British Broadcasting Corporation
