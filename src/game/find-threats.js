// @flow
import Chess from 'chess.js';

import type { Color } from './chess';

type Move = {
  color: Color,
  from: string,
  to: string,
};

const fenAsPlayer = (fen: string, player: Color): string => {
  // https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
  // second part is the active color
  const parts = fen.split(' ');
  parts[1] = player;
  return parts.join(' ');
}

const asPlayer = (chess: Chess, player: Color): Chess => {
  return new Chess(fenAsPlayer(chess.fen(), player));
}

const asWhite = (chess: Chess): Chess => asPlayer(chess, 'w');
const asBlack = (chess: Chess): Chess => asPlayer(chess, 'b');

const moves = (chess: Chess): Move[] => {
  const whiteMoves = asWhite(chess).moves({ verbose: true });
  const blackMoves = asBlack(chess).moves({ verbose: true });
  return whiteMoves.concat(blackMoves);
};

const _findThreats = (moves: Move[], player: Color): { [string]: number } => {
  const threats = {};

  moves.forEach(({ color, to }) => {
    const level = threats[to] || 0;
    threats[to] = color === player ? level - 1 : level + 1;
  });

  return threats;
};

const findThreats = (chess: Chess, player: Color = 'w'): { [string]: number } =>
  _findThreats(moves(chess), player);

export default findThreats;
