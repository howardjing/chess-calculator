// @flow
import {
  piecesFromBoard,
  King, Queen, Rook, Knight, Bishop, Pawn,
} from '../pieces';
import { buildPosition } from '../../position';

const toJson = (piece: any) => JSON.stringify({
  color: piece.color,
  position: piece.position,
  type: piece.type,
});

describe('piecesFromBoard', () => {
  it('returns a list of pieces from a board', () => {
    const board = [
      [{ type: 'k', color: 'w' }, { type: 'q', color: 'b' }, { type: 'r', color: 'w'}],
      [null, null, null],
      [{ type: 'n', color: 'b' }, { type: 'b', color: 'w' }, { type: 'p', color: 'b'}],
    ];

    expect(Object.values(piecesFromBoard(board)).map(x => toJson(x))).toEqual([
      new King('w', buildPosition(0, 0)),
      new Queen('b', buildPosition(0, 1)),
      new Rook('w', buildPosition(0, 2)),
      new Knight('b', buildPosition(2, 0)),
      new Bishop('w', buildPosition(2, 1)),
      new Pawn('b', buildPosition(2, 2)),
    ].map(x => toJson(x)));
  })
});
