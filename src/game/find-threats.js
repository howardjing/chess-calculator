// @flow
import type { Color } from './chess';
import type { Piece } from './chess/pieces';
import { toLabel } from './position';
import type { Position } from './position';

const incrementThreat = (player: Color, color: Color, current: number) =>
  player === color ? current - 1 : current + 1;

const findThreats = (pieces: Piece[], player: Color = 'w'): { [string]: number } => {
  const threats = {};
  pieces.forEach((piece: Piece) => {
    piece.attacking().forEach((position: Position) => {
      const key = toLabel(position);
      threats[key] = incrementThreat(player, piece.color, threats[key] || 0);
    })
  });

  return threats;
};

export default findThreats;
