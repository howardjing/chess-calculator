// @flow
import { Bishop } from '../pieces';
import { buildPosition } from '../../position';

describe('Bishop', () => {
  describe('attacking', () => {
    it('returns attacking squares', () => {
      const bishop = new Bishop('w', buildPosition(3, 4));

      expect(bishop.attacking()).toEqual([
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
