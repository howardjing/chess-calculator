// @flow
import { King } from '../pieces';
import { buildPosition } from '../../position';

describe('King', () => {
  describe('attacking', () => {
    it('returns attacking squares', () => {
      const king = new King('w', buildPosition(3, 4));

      expect(king.attacking()).toEqual([
        // north
        buildPosition(2, 3),
        buildPosition(2, 4),
        buildPosition(2, 5),

        // sides
        buildPosition(3, 3),
        buildPosition(3, 5),

        // south
        buildPosition(4, 3),
        buildPosition(4, 4),
        buildPosition(4, 5),
      ]);
    });
  });
});
