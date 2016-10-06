import { List } from 'immutable';

function runOffsets(runs) {
  const offsets = runs.butLast().reduce((acc, run)  => {
    const { from, to } = run.toJS();
    const size = to - from;
    const lastSize = acc.get(-1);
    return acc.push(size + lastSize);
  }, List.of(0));
  return offsets;
}

export default runOffsets;
