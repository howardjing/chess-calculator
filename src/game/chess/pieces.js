// @flow
import type { Color, PieceType } from './index';

type Position = {
  row: number,
  col: number;
};

const buildPosition = (row: number, col: number): Position => ({ row, col });

class Piece {
  color: Color;
  position: Position;

  constructor(color: Color, position: Position) {
    this.color = color;
    this.position = position;
  }

  attacking = (): Position[] => [];
}

const isInBounds = (position: Position, n: number = 8): boolean => (
  position.row >= 0 &&
  position.row < n &&
  position.col >= 0 &&
  position.col < n
);

const validPositions = (positions: Position[]): Position[] => positions.filter(pos => isInBounds(pos));

class Pawn extends Piece {
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

class King extends Piece {
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

class Knight extends Piece {
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

const attacks = (
  position: Position,
  advance: (pos: Position) => Position,
  positions: Position[] = [],
): Position[] => {
  const next = advance(position);
  if (!isInBounds(next)) { return positions; }

  return attacks(next, advance, positions.concat([next]));
};

class Bishop extends Piece {
  attacking = (): Position[] => {
    const { position } = this;
    // northwest
    return attacks(position, pos => buildPosition(pos.row - 1, pos.col - 1))
      // northeast
      .concat(attacks(position, pos => buildPosition(pos.row - 1, pos.col + 1)))
      // southwest
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col - 1)))
      // southeast
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col + 1)));
  }
}

class Rook extends Piece {
  attacking = (): Position[] => {
    const { position } = this;
    // north
    return attacks(position, pos => buildPosition(pos.row - 1, pos.col))
      // west
      .concat(attacks(position, pos => buildPosition(pos.row, pos.col - 1)))
      // east
      .concat(attacks(position, pos => buildPosition(pos.row, pos.col + 1)))
      // south
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col)))
  }
}

class Queen extends Piece {
  attacking = (): Position[] => {
    const { position } = this;
    // north
    return attacks(position, pos => buildPosition(pos.row - 1, pos.col))
      // west
      .concat(attacks(position, pos => buildPosition(pos.row, pos.col - 1)))
      // east
      .concat(attacks(position, pos => buildPosition(pos.row, pos.col + 1)))
      // south
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col)))
      // northwest
      .concat(attacks(position, pos => buildPosition(pos.row - 1, pos.col - 1)))
      // northeast
      .concat(attacks(position, pos => buildPosition(pos.row - 1, pos.col + 1)))
      // southwest
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col - 1)))
      // southeast
      .concat(attacks(position, pos => buildPosition(pos.row + 1, pos.col + 1)));
  }
}

const buildPiece = (type: PieceType, color: Color, position: Position): Piece => {
  switch(type) {
    case 'b': return new Bishop(color, position);
    case 'k': return new King(color, position);
    case 'n': return new Knight(color, position);
    case 'p': return new Pawn(color, position);
    case 'q': return new Queen(color, position);
    case 'r': return new Rook(color, position);
    default: throw new Error(`Unknown piece type ${type}`);
  };
}

function filterNulls<T>(arr: Array<?T>): Array<T> {
  const result = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] != null) {
      result.push(arr[i]);
    }
  }
  return result;
}

/**
 * board.flatMap((row, i) => row.map((piece, j) => new Piece(...)))
 */
const fromBoard = (board: (?{ type: PieceType, color: Color })[][]): Piece[] =>
  board.map((row, i) =>
    filterNulls(row.map((piece, j) => {
      if (!piece) { return null; }
      return buildPiece(piece.type, piece.color, buildPosition(i, j))
    }))
  ).reduce((accum, row) => accum.concat(row), []);

// const findThreats = (pieces, player): => {
//   const positions = {};
//   pieces.forEach(piece => {

//   })
// }

export {
  validPositions,
  buildPosition,
  fromBoard,
  King,
  Queen,
  Rook,
  Knight,
  Bishop,
  Pawn,
};
