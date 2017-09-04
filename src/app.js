// @flow
import React, { Component } from 'react';
import Chess from 'chess.js';
import Game from './game';

const fen = 'r1bqkbnr/ppp2ppp/2n5/3pp1B1/3PP3/5N2/PPP2PPP/RN1QKB1R b KQkq - 3 4';
// const fen = 'r1bqkbnr/ppp3pp/2n2p2/3pp1B1/3PP3/5N2/PPP2PPP/RN1QKB1R w KQkq - 0 5';
// const fen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
const chess = new Chess(fen);

class App extends Component<{}> {
  render() {
    return (
      <div>
        <h1>Hello</h1>
        <Game chess={chess} />
      </div>
    );
  }
}

export default App;
