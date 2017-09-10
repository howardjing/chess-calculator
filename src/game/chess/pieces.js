// @flow
import type { Color } from './index';

type Position = {
  row: number,
  col: number;
};

const buildPosition = (row: number, col: number): Position => ({ row, col });

interface Piece {
  color: Color;
  position: Position;
  attacking(): Position[];
}

const isInBounds = (position: Position, n: number = 8): boolean => (
  position.row >= 0 &&
  position.row < n &&
  position.col >= 0 &&
  position.col < n
);

const validPositions = (positions: Position[]): Position[] => positions.filter(pos => isInBounds(pos));

class Pawn implements Piece {
  color: Color;
  position: Position;

  constructor(color: Color, position: Position) {
    this.color = color;
    this.position = position;
  }

  attacking = () => {
    const { row, col } = this.position;
    const newRow = this._advance(row);
    return validPositions([
      buildPosition(newRow, col - 1),
      buildPosition(newRow, col + 1),
    ]);
  }

  _advance = (n: number): number => this.color === 'w' ? n + 1 : n - 1;
}

// const findThreats = (pieces, player): => {
//   const positions = {};

//   pieces.forEach(piece => {

//   })
// }

export {
  Pawn,
  validPositions,
  buildPosition,
};
