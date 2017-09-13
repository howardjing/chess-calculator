// @flow
import { validPositions } from '../pieces';
import { buildPosition } from '../../position';

describe('validPositions', () => {
  it('filters out invalid positions', () => {
    expect(validPositions([
      buildPosition(1, 2),
      buildPosition(0, 7),
      buildPosition(-1, 1),
      buildPosition(3, 8),
    ])).toEqual([
      buildPosition(1, 2),
      buildPosition(0, 7),
    ]);
  });
});
