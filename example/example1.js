// Example 1. ES6
// Targeting Node requires a transpiler e.g. babel, buble, traceur, ...
// Targeting Browser requires a transpiler and a bundler e.g. Webpack, browserify, ...

import { resolve, reorder } from 'unicode-bidirectional';

const codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
const levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
const reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
