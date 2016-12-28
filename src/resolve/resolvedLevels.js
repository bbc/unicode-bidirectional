import { List, Range, Record } from 'immutable';
import isolatingRunSequences from '../paragraph/isolatingRunSequences';
import { isX9ControlCharacter } from '../util/constant';
import unzip from '../util/unzip';
import runOffsets from './runOffsets';
import automaticLevel from '../paragraph/automaticLevel';
import resolveImplicit from '../implicit/implicit';
import resolvedWeaks from '../weak/resolvedWeaks';
import includes from 'lodash.includes';
import whitespacesLevelReset from './whitespacesLevelReset';

function resolvedLevelsWithInvisibles(paragraphCodepoints, paragraphBidiTypes, paragraphLevel, autoLTR = false) {
  const levels = resolvedLevels(paragraphCodepoints, paragraphBidiTypes, paragraphLevel, autoLTR);

  function merge(bidiTypes, ls, acc) {
    if (bidiTypes.size === 0) return acc;
    if (isX9ControlCharacter(bidiTypes.first())) {
      return merge(bidiTypes.rest(), ls, acc.push('x'))
    } else {
      return merge(bidiTypes.rest(), ls.rest(), acc.push(ls.first()))
    }
  }

  return merge(paragraphBidiTypes, levels, List.of())
}

function resolvedLevels(paragraphCodepoints, paragraphBidiTypes, paragraphLevel, autoLTR = false) {
  const level = (autoLTR === true) ? automaticLevel(paragraphCodepoints, paragraphBidiTypes) : paragraphLevel;
  const {
    sequences, // without embeds
    codepoints, // without embeds
    bidiTypes, // without embeds, with X1-X8 applied
    paragraphBidiTypes: pbidi, // without embeds
    levels // with embeds..
  } = isolatingRunSequences(paragraphCodepoints, paragraphBidiTypes, level);

  const resolvedTypes = resolvedWeaks(codepoints, bidiTypes, sequences);
  const N = bidiTypes.size;
  const sequenceResolved = sequences.reduce(updateLevelsFromRuns, List(Range(0, N)).map(__ => 0));
  const resolvedImplicit = resolveImplicit(resolvedTypes, sequenceResolved);
  return whitespacesLevelReset(pbidi, resolvedImplicit, level);
}

function updateLevelsFromRuns(levels, sequence) {
  const runs = sequence.get('runs');
  const newLevels = runs.reduce((levels, run) => {
    const { from, to } = run.toJS();
    const size = to - from;
    const level = run.get('level');
    const levelSlice = List(Range(0, size)).map(x => level);
    return levels.slice(0, from).concat(levelSlice).concat(levels.slice(to));
  }, levels);

  return newLevels;
}

export { resolvedLevelsWithInvisibles }
export default resolvedLevels;
