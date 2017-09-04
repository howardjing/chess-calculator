// @flow

import React from 'react';
import BlackKing from './black-king';
import BlackQueen from './black-queen';
import BlackRook from './black-rook';
import BlackBishop from './black-bishop';
import BlackKnight from './black-knight';
import BlackPawn from './black-pawn';
import WhiteKing from './white-king';
import WhiteQueen from './white-queen';
import WhiteRook from './white-rook';
import WhiteBishop from './white-bishop';
import WhiteKnight from './white-knight';
import WhitePawn from './white-pawn';
import type { Color, Piece as _Piece } from '../chess';

type Props = {
  piece: {
    color: Color,
    type: _Piece,
  },
  width: number,
  height: number,
};

const MAPPING = {
  b: {
    k: BlackKing,
    q: BlackQueen,
    r: BlackRook,
    b: BlackBishop,
    n: BlackKnight,
    p: BlackPawn,
  },
  w: {
    k: WhiteKing,
    q: WhiteQueen,
    r: WhiteRook,
    b: WhiteBishop,
    n: WhiteKnight,
    p: WhitePawn,
  },
};

// $FlowFixMe - mad about MAPPING[color][type]
const component = (color: Color, type: _Piece) => MAPPING[color][type] || null;

const PieceComponent = ({
  piece,
  width,
  height,
}: Props) => {
  const Piece = component(piece.color, piece.type);
  if (!Piece) { return null; }

  return <Piece width={width} height={height} />;
};

export default PieceComponent;
