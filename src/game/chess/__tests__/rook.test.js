// @flow
import { Rook, buildPosition } from '../pieces';

describe('Rook', () => {
  describe('attacking', () => {
    it('returns attacking squares', () => {
      const rook = new Rook('w', buildPosition(3, 4));

      expect(rook.attacking()).toEqual([
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
      ]);
    });
  });
});
