const fs = require('fs');
const path = require('path');
const filepath = path.resolve(__dirname, 'BidiTest.txt');
const parseFile = require('./parser');
const fromJS = require('immutable').fromJS;
// import resolvedWeaks from '../../src/weak/resolvedWeaks';
import resolvedLevels from '../../src/resolve/resolvedLevels';
import fillWithCodepoints from './fillWithCodepoints';

// import chai from 'chai';
// import chaiImmutable from 'chai-immutable';
// chai.use(chaiImmutable);
// const expect = chai.expect;

function runLevelTests() {
  // console.log('[Conformance Test] - Level Tests');
  // console.log('Parsing test data...');
  const file = fs.readFileSync(filepath, 'utf8');
  const testCases = parseFile(file);

  // console.log('Running level tests...');
  let pass = 0;
  let fail = 0;
  const total = testCases.length;

  testCases.forEach(function(test, index) {
    // fill in with arbitrary codepoints matching bidiType
    // const codepoints =
    // const paragraphDirection =
    // const actual = resolvedWeaks(fillWithCodepoints(bidiTypes), bidiTypes, 0);
    const bidiTypes = fromJS(test.bidiTypes);
    const actual = resolvedLevels(fillWithCodepoints(bidiTypes), bidiTypes, 0)
    const expected = fromJS(test.levels);
    if (actual.equals(expected)) {
      pass = pass + 1;
    } else {
      fail = fail + 1;
      // console.log('INPUT:', bidiTypes);
      // console.log('ACTUAL OUTPUT:', actual);
      // console.log('EXPECTED OUTPUT:', expected);
    }

    const progress = [
      index,
      ' Total: ', total, ' ',
      '\x1b[32m', 'Passing: ', pass, ' ', '\x1b[0m',
      '\x1b[31m', 'Failing: ', fail, ' ', '\x1b[0m',
      '(', Math.floor((index+1)/total*100), '%)',
      '\n'
    ].join('');
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
    process.stdout.clearLine(1);
  });
  // console.log('\nTests finished');
  // console.log('Passing: ' + pass + ' Failing: ' + fail);
}

runLevelTests();
