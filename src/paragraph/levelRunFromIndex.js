import { Run } from '../type';

function levelRunFromIndex(runs, index) {
  const lookup = runs.filter(run => index >= run.get('from') && index < run.get('to'));
  if (lookup.size > 0) return lookup.last();
  return new Run();
}

export default levelRunFromIndex;

