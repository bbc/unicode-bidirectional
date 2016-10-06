const fs = require('fs');
const path = require('path');
const filepath = path.resolve(__dirname, 'BidiTest.txt');
const parseFile = require('./parser');
const fromJS = require('immutable').fromJS;
import resolvedWeaks from '../../src/weak/resolvedWeaks';

// import chai from 'chai';
// import chaiImmutable from 'chai-immutable';
// chai.use(chaiImmutable);
// const expect = chai.expect;

function runLevelTests() {
  console.log('[Conformance Test] - Level Tests');
  console.log('Parsing test data...');
  const file = fs.readFileSync(filepath, 'utf8');
  const testCases = parseFile(file);

  console.log('Running level tests...');
  let pass = 0;
  let fail = 0;
  const total = testCases.length;

  testCases.slice(0, 1).forEach(function(test, index) {
    // fill in with arbitrary codepoints matching bidiType
    // const codepoints =
    // const paragraphDirection =
    const bidiTypes = fromJS(test.bidiTypes);
    const actual = resolvedWeaks(fillWithCodepoints(bidiTypes), bidiTypes, 0);
    const expected = fromJS(test.levels);
    console.log('INPUT:', actual);
    console.log('OUTPUT:', expected);
    if (actual.equals(expected)) {
      pass = pass + 1;
    } else {
      fail = fail + 1;
    }

    const progress = [
      'Total: ', total, ' ',
      '\x1b[32m', 'Passing: ', pass, ' ', '\x1b[0m',
      '\x1b[31m', 'Failing: ', fail, ' ', '\x1b[0m',
      '(', Math.floor(index/total*100), '%)'
    ].join('');
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
  });
  console.log('\nTests finished');
  console.log('Passing: ' + pass + ' Failing: ' + fail);
}

function fillWithCodepoints(bidiTypes) {
  return bidiTypes.map(x => 0);
}

runLevelTests();
