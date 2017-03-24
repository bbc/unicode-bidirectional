import mirrorMap from 'unicode-9.0.0/Bidi_Mirroring_Glyph'; // TODO: Map is not in all browsers

// L4. "A character is depicted by a mirrored glyph if and only if
// (a) the resolved directionality of that character is R, and
// (b) the Bidi_Mirrored property value of that character is Yes."
function mirror(codepoints, levels) {
  return codepoints.map((codepoint, index) => {
    const mirroring = mirrorMap.get(codepoint); // (b)
    const mirroredIsYes = (mirroring !== undefined);
    const directionIsR = (levels.get(index) % 2 === 1);
    return (mirroredIsYes && directionIsR) ? mirroring.charCodeAt(0) : codepoint;
  });
}

export default mirror;
