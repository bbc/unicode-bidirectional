function parseFile(file) {
  let testCases = [];
  const lines = file.split('\n')
    .filter(line => line.startsWith('#') === false)
    .filter(line => line.length > 0);

  let cursor = 0;
  let EOF = lines.length;
  let levels = [];
  let reorder = [];

  while (cursor < EOF) {
    let line = lines[cursor];
    const data = parseLine(line);
    testCases.push(data);
    cursor++;
  }

  return testCases;
}

function parseLine(line) {
  const fields = line.split(';');
  const parseDec = x => parseInt(x);
  const parseHex = x => parseInt(x, 16);
  const parseLevel = l => {
    if (l === 'x') return 'x';
    return parseDec(l);
  };

  return {
    codepoints: fields[0].split(' ').map(parseHex),
    direction: parseInt(fields[1]),
    expectedParagraphLevel: parseInt(fields[2]),
    expectedLevels: fields[3].split(' ').map(parseLevel),
    expectedReorder: fields[4].split(' ').map(parseDec)
  }
}

module.exports = parseFile;
