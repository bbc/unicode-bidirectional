import { List, Range } from 'immutable';
import isolatingRunSequences from '../paragraph/isolatingRunSequences';
import { isX9ControlCharacter } from '../util/constant';
import unzip from '../util/unzip';
import runOffsets from './runOffsets';
import automaticLevel from '../paragraph/automaticLevel';
import resolveImplicit from '../implicit/implicit';
import resolvedWeaks from '../weak/resolvedWeaks';
import includes from 'lodash.includes';
import whitespacesLevelReset from './whitespacesLevelReset';

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
  const offsets = runOffsets(runs);
  const levelSlices = runs.zip(offsets).map(([run, offset]) => {
    const { from, to } = run.toJS();
    const level = run.get('level');
    const size = to - from;
    return List(Range(0, size))
      .map(x => level)
      .slice(offset, offset + size);
  });

  const newLevels = runs.zip(levelSlices).reduce((levels, [run, levelSlice]) => {
    const { from, to } = run.toJS();
    return levels.slice(0, from).concat(levelSlice).concat(levels.slice(to));
  }, levels);

  return newLevels;
}

export default resolvedLevels;
