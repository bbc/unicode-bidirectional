import { List, Range } from 'immutable';
import isolatingRunSequences from '../paragraph/isolatingRunSequences';
import { isX9ControlCharacter } from '../util/constant';
import unzip from '../util/unzip';
import runOffsets from './runOffsets';

function resolvedLevels(paragraphCodepoints, paragraphBidiTypes, paragraphLevel, autoLTR = false) {
  const level = (autoLTR) ? automaticLevel(paragraphCodepoints) : paragraphLevel;
  const sequences = isolatingRunSequences(paragraphCodepoints, paragraphBidiTypes, level);

  const [codepoints, bidiTypes] = unzip(paragraphCodepoints
    .zip(paragraphBidiTypes)
    .filter(([__, t]) => isX9ControlCharacter(t) === false)); // [1]
  const N = codepoints.size;
  return sequences.reduce(updateLevelsFromRuns, List(Range(0, N)).map(__ => 0));
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
