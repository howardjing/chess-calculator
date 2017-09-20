// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Chess from 'chess.js';

class GameLoader extends Component<{
  onNewGame: (chess: Chess) => any,
}, {}> {
  attemptToLoad = (e: SyntheticInputEvent<*>) => {
    const { value } = e.target;

    const chess = new Chess();
    if (chess.load_pgn(value)) {
      const { onNewGame } = this.props;
      onNewGame(chess);
    }
  };
  render() {
    return (
      <div>
        <TextArea
          placeholder="Paste PGN here"
          onChange={this.attemptToLoad}
        />
      </div>
    );
  }
}

const TextArea = styled.textarea`
  width: 100%;
  height: 50px;
`;
export default GameLoader;
