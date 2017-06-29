// Node.js
// Browser: Webpack, browserify
import { resolve, reorder } from 'unicode-bidirectional/es6';

const codepoints = [0x28, 0x29, 0x2A, 0x05D0, 0x05D1, 0x05D2]
const levels = resolve(codepoints, 0);  // [0, 0, 0, 1, 1, 1]
const reordering = reorder(codepoints, levels); // [0x28, 0x29, 0x2A, 0x05D2, 0x05D1, 0x05D0]
