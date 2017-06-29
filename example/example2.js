// Example 2. CommonJs
// Targeting Node does not require extra tools.
// Targeting Browser requires a bundler e.g. Webpack, browserify, ...

var UnicodeBidirectional = require('unicode-bidirectional');
var resolve = UnicodeBidirectional.resolve;
var reorder = UnicodeBidirectional.reorder;

var codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
var levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
var reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
console.log(levels);
console.log(reordering);
