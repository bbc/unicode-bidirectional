const List = require('immutable').List;
const fs = require('fs');
const path = require('path');
// const P = require('parsimmon');
const filepath = path.resolve(__dirname, 'BidiTest.txt');
const file = fs.readFileSync(filepath, 'utf8');
const isUndefined = require('lodash.isundefined');

// [1]: remove comments
const withoutPreamble = file.split('\n')
  .filter(line => line.startsWith('#') === false) // [1]
  .filter(line => line.length > 0);

// console.log(withoutPreamble.slice(0, 100));

function groups(lines) {
  if (!isUndefined(lines) || lines.isEmpty()) return List.of();
  const group = lines.takeUntil(line => line.startsWith('@'));
  const after = lines.skipWhile(line => line.startsWith('@'));
  return List.of(group).push(groups(after));
}

// console.log(groups(withoutPreamble).slice(0, 10));
