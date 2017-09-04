// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import type Chess from 'chess.js';
import Piece from './piece';
import findThreats from './find-threats';

const LETTERS = ['a', 'b' , 'c', 'd', 'e', 'f', 'g', 'h'];
const NUMBERS = [8, 7, 6, 5, 4, 3, 2, 1];

type Props = {
  chess: Chess,
};

const position = (row: number, col: string): string => `${col}${row}`;

class Game extends PureComponent<Props> {
  render() {
    const { chess } = this.props;
    const threats = findThreats(chess);
    return (
      <div>
        {NUMBERS.map((row) =>
          <Row key={row}>
            {LETTERS.map((col) => {
              const pos = position(row, col);
              const piece = chess.get(pos);
              const threat = threats[pos] || 0;
              return (
                <Square
                  key={pos}
                  style={{ backgroundColor: threatColor(threat) }}
                >
                  {piece ? <Piece
                    piece={chess.get(pos)}
                    width={40}
                    height={40}
                  /> : null}
                  <Label>{threat}</Label>
                </Square>
              )
          })}
          </Row>
        )}
      </div>
    );
  }
}


// http://colorbrewer2.org/#type=sequential
const THREAT_COLORS = {
  // orange gradient
  '5':  '#a63603',
  '4':  '#e6550d',
  '3':  '#fd8d3c',
  '2':  '#fdbe85',
  '1':  '#feedde',

  // neutral
  '0':  '#ffffff',

  // green gradient
  '-1': '#edf8e9',
  '-2': '#bae4b3',
  '-3': '#74c476',
  '-4': '#31a354',
  '-5': '#006d2c',
};

const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);
const threatColor = (threat: number): string => THREAT_COLORS[clamp(threat, -5, 5)];

const Row = styled.div`
  display: flex;
`;

const Square = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export default Game;
