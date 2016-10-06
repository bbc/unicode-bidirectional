function parseFile(file) {
  let testCases = [];
  const lines = file.split('\n').filter(line => line.startsWith('#') === false);

  let cursor = 0;
  let EOF = lines.length;
  let levels = [];
  let reorder = [];

  while (cursor < EOF) {
    let line = lines[cursor];

    if (line.startsWith('@Levels')) { levels = parseLevelsLine(line); }
    else if (line.startsWith('@Reorder')) { reorder = parseReorderLine(line); }
    else if (line.length > 0) {
      const data = parseDataLine(line);

      testCases.push({
        levels: levels.slice(),
        reorder: reorder.slice(),
        bidiTypes: data[0],
        bitSet: data[1]
      });
    }
    cursor++;
  }
  return testCases;
}

function parseLevelsLine(line) {
  const tabIndex = line.indexOf('\t');
  return line.slice(tabIndex + 1).split(' ')
    .filter(x => x !== 'x')
    .filter(x => x !== '')
    .map(x => parseInt(x));
}

function parseReorderLine(line) {
  const tabIndex = line.indexOf('\t');
  return line.slice(tabIndex + 1).split(' ')
    .filter(x => x !== '');
}

function parseDataLine(line) {
  const separator = line.indexOf(';');
  const bidiTypes = line.slice(0, separator).split(' ');
  const bitset = parseInt(line.slice(separator + 1));
  return [bidiTypes, bitset];
}

module.exports = parseFile;
