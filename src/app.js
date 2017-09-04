// @flow
import React, { Component } from 'react';
import Chess from 'chess.js';

const fen = 'r1bqkbnr/ppp2ppp/2n5/3pp1B1/3PP3/5N2/PPP2PPP/RN1QKB1R b KQkq - 3 4';
// const fen = 'r1bqkbnr/ppp3pp/2n2p2/3pp1B1/3PP3/5N2/PPP2PPP/RN1QKB1R w KQkq - 0 5';
// const fen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
const chess = new Chess(fen);
console.log("CHESS", chess)

type Color = 'w' | 'b';

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

const findSafety = (moves: Move[], player: Color = 'w'): { [string]: number } => {
  const safeZones = {};

  moves.forEach(({ color, to }) => {
    const oldSafety = safeZones[to] || 0;
    const safety = color === player ? oldSafety + 1 : oldSafety - 1;
    safeZones[to] = safety;
  });

  return safeZones;
}

console.log(chess)
console.log(chess.ascii())
console.log(moves(chess))
console.log(findSafety(moves(chess)))


class App extends Component<{}> {
  render() {
    return (
      <div>
        yo
      </div>
    );
  }
}

export default App;
