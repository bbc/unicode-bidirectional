const fs = require('fs');
const path = require('path');
const TEST_FILE = 'BidiTest.txt';
const filepath = path.resolve(__dirname, TEST_FILE);
const parseFile = require('./parser');
const fromJS = require('immutable').fromJS;
import { resolvedLevelsWithInvisibles } from '../../../src/resolve/resolvedLevels';
import { reorderPermutation } from '../../../src/resolve/reorderedLevels';
import fillWithCodepoints from '../fillWithCodepoints';

function runLevelTests() {
  console.log(`[Conformance Test] - bidiclass conformance tests (${TEST_FILE})`);
  console.log('Parsing test data...');
  const file = fs.readFileSync(filepath, 'utf8');
  const testCases = parseFile(file);

  console.log('Running level tests...');
  let pass = 0;
  let fail = 0;
  const total = testCases.length;

  for (let index = 16; index < 17; index++) {
    const test = testCases[index];
    const bidiTypes = fromJS(test.bidiTypes);
    const codepoints = fillWithCodepoints(bidiTypes);

    const bitset = test.bitset;
    const paragraphLevel = ((bitset & 2) > 0) ? 0 : 1;
    const autoLTR = ((bitset & 1) > 0) ? true : false;

    const actualLevels = resolvedLevelsWithInvisibles(codepoints, bidiTypes, paragraphLevel, autoLTR)
    const actualReorder = reorderPermutation(actualLevels);

    const expectedLevels = fromJS(test.levels);
    const expectedReorder = fromJS(test.reorder);

    const levelPass = actualLevels.equals(expectedLevels)
    const reorderPass = actualReorder.equals(expectedReorder)
    if (levelPass && reorderPass) {
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
      // console.log('INPUT:', bidiTypes, `LEVEL = ${paragraphLevel}, AUTO = ${autoLTR}`);
      if (!actualLevels.equals(expectedLevels)) {
        console.log('Assertion Failure. Failure for @Levels.')
        console.log('ACTUAL OUTPUT:', actualLevels);
        console.log('EXPECTED OUTPUT:', expectedLevels);
      } else {
        console.log('Assertion Failure. Failure for @Reorder.')
        console.log('ACTUAL OUTPUT:', actualReorder);
        console.log('EXPECTED OUTPUT:', expectedReorder);
      }
      break;
    }

  }
  // console.log('\nTests finished');
  // console.log('Passing: ' + pass + ' Failing: ' + fail);
}

runLevelTests();
