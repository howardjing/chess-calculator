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

  attacking = (): Position[] => {
    const { row, col } = this.position;
    const newRow = this._advance(row);
    return validPositions([
      buildPosition(newRow, col - 1),
      buildPosition(newRow, col + 1),
    ]);
  }

  _advance = (n: number): number => this.color === 'w' ? n + 1 : n - 1;
}

class King implements Piece {
  color: Color;
  position: Position;

  constructor(color: Color, position: Position) {
    this.color = color;
    this.position = position;
  }

  attacking = (): Position[] => {
    const { row, col } = this.position;

    const northWest = buildPosition(row - 1, col - 1);
    const north = buildPosition(row - 1, col);
    const northEast = buildPosition(row - 1, col + 1);
    const west = buildPosition(row, col - 1);
    const east = buildPosition(row, col + 1);
    const southWest = buildPosition(row + 1, col - 1);
    const south = buildPosition(row + 1, col);
    const southEast = buildPosition(row + 1, col + 1);

    return validPositions([
      northWest, north, northEast,
      west, east,
      southWest, south, southEast,
    ]);
  }
}

class Knight implements Piece {
  color: Color;
  position: Position;

  constructor(color: Color, position: Position) {
    this.color = color;
    this.position = position;
  }

  attacking = (): Position[] => {
    const { row, col } = this.position;

    const northWestWest = buildPosition(row - 1, col - 2);
    const northWest = buildPosition(row - 2, col - 1);
    const northEast = buildPosition(row - 2, col + 1);
    const northEastEast = buildPosition(row - 1, col + 2);
    const southWestWest = buildPosition(row + 1, col - 2);
    const southWest = buildPosition(row + 2, col - 1);
    const southEast = buildPosition(row + 2, col + 1);
    const southEastEast = buildPosition(row + 1, col + 2);

    return validPositions([
      northWestWest, northWest, northEast, northEastEast,
      southWestWest, southWest, southEast, southEastEast,
    ]);
  }
}

class Bishop implements Piece {
  color: Color;
  position: Position;

  constructor(color: Color, position: Position) {
    this.color = color;
    this.position = position;
  }

  attacking = (): Position[] => {

  }
}

// const findThreats = (pieces, player): => {
//   const positions = {};

//   pieces.forEach(piece => {

//   })
// }

export {
  validPositions,
  buildPosition,
  King,
  Knight,
  Pawn,
};
