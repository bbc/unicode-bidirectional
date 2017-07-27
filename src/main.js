import { resolvedLevelsWithInvisibles } from './resolve/resolvedLevels';
import reorderedLevels, { reorderPermutation as perm } from './resolve/reorderedLevels';
import lookupBidiType from 'unicode-bidiclass';
import punycode from 'punycode';
import { fromJS } from 'immutable';
import openingBrackets from './util/openingBrackets';
import closingBrackets from './util/closingBrackets';
import oppositeBracket from './util/oppositeBracket';
import mirrorMap from 'unicode-9.0.0/Bidi_Mirroring_Glyph';
import mirrorCodepoints from './resolve/mirror';

// Public API
function resolve(codepoints, paragraphLevel, automaticLevel = false) {
  const encoding = punycode.ucs2.encode(codepoints);
  const normalForm = encoding.normalize('NFC');
  const decoding = punycode.ucs2.decode(normalForm);
  const points = fromJS(decoding);
  const bidiTypes = points.map(lookupBidiType);
  return resolvedLevelsWithInvisibles(points, bidiTypes, paragraphLevel, automaticLevel).toJS();
}

// Public API
function reorder(codepoints, levels, automaticLevel = false) {
  return reorderedLevels(fromJS(codepoints), fromJS(levels), automaticLevel).toJS();
}

// Public API
function reorderPermutation(levels) {
  return perm(fromJS(levels)).toJS();
}

// Public API
function mirror(codepoints, levels) {
  return mirrorCodepoints(fromJS(codepoints), fromJS(levels)).toJS();
}

// Public API
const constants = {
  mirrorMap,
  oppositeBracket,
  openingBrackets,
  closingBrackets
};

// Public API
export { resolve, reorder, reorderPermutation, mirror, constants };
