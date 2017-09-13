// @flow
import { Knight } from '../pieces';
import { buildPosition } from '../../position';

describe('Knight', () => {
  describe('attacking', () => {
    it('returns attacking squares', () => {
      const knight = new Knight('w', buildPosition(3, 4));

      expect(knight.attacking()).toEqual([
        // north
        buildPosition(2, 2),
        buildPosition(1, 3),
        buildPosition(1, 5),
        buildPosition(2, 6),

        // south
        buildPosition(4, 2),
        buildPosition(5, 3),
        buildPosition(5, 5),
        buildPosition(4, 6),
      ]);
    });
  });
});
