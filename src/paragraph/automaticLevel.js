// http://unicode.org/reports/tr9/#P2
function automaticLevel(paragraphCodepoints, paragraphBidiTypes) {
    const { initiatorToPDI, initiatorFromPDI } = matchingPDIs(codepoints);
    const insideIsolate = insideIsolate(paragraphCodepoints.size, initiatorToPDI);

    const autoDirection = paragraphCodepoints.zip(paragraphBidiTypes)
      .filter(([c, t], index) => insideIsolate(index))
      .takeWhile(([c, t]) => includes(['L', 'R', 'AL'], t));
}

export default automaticLevel;
