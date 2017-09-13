// @flow
import { Queen } from '../pieces';
import { buildPosition } from '../../position';

describe('Queen', () => {
  describe('attacking', () => {
    it('returns attacking squares', () => {
      const queen = new Queen('w', buildPosition(3, 4));

      expect(queen.attacking()).toEqual([
        // north
        buildPosition(2, 4),
        buildPosition(1, 4),
        buildPosition(0, 4),

        // west
        buildPosition(3, 3),
        buildPosition(3, 2),
        buildPosition(3, 1),
        buildPosition(3, 0),

        // east
        buildPosition(3, 5),
        buildPosition(3, 6),
        buildPosition(3, 7),

        // south
        buildPosition(4, 4),
        buildPosition(5, 4),
        buildPosition(6, 4),
        buildPosition(7, 4),

        // northwest
        buildPosition(2, 3),
        buildPosition(1, 2),
        buildPosition(0, 1),

        // northeast
        buildPosition(2, 5),
        buildPosition(1, 6),
        buildPosition(0, 7),

        // southwest
        buildPosition(4, 3),
        buildPosition(5, 2),
        buildPosition(6, 1),
        buildPosition(7, 0),

        // southeast
        buildPosition(4, 5),
        buildPosition(5, 6),
        buildPosition(6, 7),
      ]);
    });
  });
});
