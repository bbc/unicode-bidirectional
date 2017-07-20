import { resolvedLevelsWithInvisibles } from '../../../src/resolve/resolvedLevels';
import { reorderPermutation } from '../../../src/resolve/reorderedLevels';
import lookupBidiType from 'unicode-bidiclass';

const fromJS = require('immutable').fromJS;
const fs = require('fs');
const path = require('path');

// punycode is bundled with Node.js but was soft-deprecated in Node v7
// so to make code more future-proof, we use punycode via npm
const punycode = require('punycode');

const parseFile = require('./parser');
const TEST_FILE = 'BidiCharacterTest.txt';
const filepath = path.resolve(__dirname, TEST_FILE);
const TEST_COUNT = 4000;

function runTests() {
  console.log(`[Conformance Test] - codepoint conformance tests (${TEST_FILE})`);
  console.log('Parsing test data...');
  const file = fs.readFileSync(filepath, 'utf8');

  console.log('Running tests...');
  let pass = 0;
  let fail = 0;
  const testCases = parseFile(file);
  const total = testCases.length;

  for (let index = 0; index < total; index++) {
    const test = testCases[index];

    // perform normalization of the codepoints
    const encoding = punycode.ucs2.encode(test.codepoints);
    const normalForm = encoding.normalize('NFC');
    const decoding = punycode.ucs2.decode(normalForm);
    const codepoints = fromJS(decoding);

    const bidiTypes = codepoints.map(lookupBidiType);
    const paragraphLevel = test.direction;
    const autoLTR = (test.direction === 2);

    const actualLevels = resolvedLevelsWithInvisibles(codepoints, bidiTypes, paragraphLevel, autoLTR);
    const actualReorder = reorderPermutation(actualLevels, true);

    const expectedLevels = fromJS(test.expectedLevels);
    const expectedReorder = fromJS(test.expectedReorder);

    const levelPass = actualLevels.equals(expectedLevels);
    // const reorderPass = actualLevels.equals(expectedLevels);

    if (levelPass) {
      pass = pass + 1;
    } else {
      fail = fail + 1;
    }

    const progress = [
      index,
      ' Total: ', total, ' ',
      '\x1b[32m', 'Passing: ', pass, ' ', '\x1b[0m',
      '\x1b[31m', 'Failing: ', fail, ' ', '\x1b[0m',
      '(', Math.floor((index + 1)/total * 100), '%)',
      '\n'
      ].join('');
    process.stdout.clearLine(1);
    process.stdout.cursorTo(0);
    process.stdout.write(progress);

    if (fail > 0) {
      console.log(JSON.stringify(test));
      const serial = String.fromCharCode.apply(null, test.codepoints);
      console.log('INPUT:', test.codepoints, ' = "', serial, '"', `LEVEL = ${paragraphLevel}, AUTO = ${autoLTR}`);
      console.log('INPUT BIDI:', bidiTypes);
      if (!actualLevels.equals(expectedLevels)) {
        console.log('Assertion Failure.')
        console.log('ACTUAL OUTPUT  :', actualLevels);
        console.log('EXPECTED OUTPUT:', expectedLevels);
      }
      break;
    }

  }
}

runTests();
