// @flow
import { Pawn } from '../pieces';
import { buildPosition } from '../../position';

describe('Pawn', () => {
  describe('attacking', () => {
    it('returns attacking squares based on color', () => {
      const black = new Pawn('b', buildPosition(3, 4));
      const white = new Pawn('w', buildPosition(3, 4));

      expect(black.attacking()).toEqual([
        buildPosition(4, 3),
        buildPosition(4, 5),
      ]);

      expect(white.attacking()).toEqual([
        buildPosition(2, 3),
        buildPosition(2, 5),
      ]);
    });
  });
});
