// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import { range } from 'lodash';
import Chess from 'chess.js';
import { hsluvToHex, hexToHsluv } from 'hsluv';
import Piece from './piece';
import Log from './log';
import Controls from './controls';
import findThreats from './find-threats';
import { buildPosition, toLabel } from './position';
import type { Color, PieceType } from './chess';

type PiecePojo = {
  color: Color,
  type: PieceType,
};

type Threats = { [string]: number };

type Props = {
  chess: Chess,
};

type State = {
  index: number,
  board: Chess,
  threats: Threats,
};

const ROWS = range(0, 8);
const COLS = range(0, 8);

const SPRING_CONFIG = { stiffness: 300, damping: 40 };

const getPosition = (row: number, col: number): string => toLabel(buildPosition(row, col));

const buildGameFrom = (chess: Chess, index: number) => {
  const moves = chess.history().slice(0, index + 1);
  const game = new Chess();
  moves.forEach(move => {
    game.move(move);
  });

  return game;
};

const getThreat = (threats: Threats, position: string): number => threats[position] || 0;

class Game extends Component<Props, State> {
  state = {
    index: -1,
    board: new Chess(),
    threats: {},
  };

  // TODO: duplication between this and handleChangeIndex,
  componentWillMount() {
    const { chess } = this.props;
    const { index } = this.state;
    const board = buildGameFrom(chess, index);
    const threats = findThreats(board);

    this.setState(() => ({
      index,
      board,
      threats,
    }));
  }

  handleChangeIndex = (index: number) => {
    const { chess } = this.props;
    const board = buildGameFrom(chess, index);
    const threats = findThreats(board);

    this.setState(() => ({
      index,
      board,
      threats,
    }));
  };

  renderSquare = (piece: PiecePojo) => ({ threat }: { threat: number }) => {
    return (
      <Square
        style={{ backgroundColor: threatColor(threat) }}
      >
        {piece ? <Piece
          piece={piece}
          width={'100%'}
          height={'100%'}
        /> : null}
        <Label>{Math.round(threat)}</Label>
      </Square>
    );
  }

  render() {
    const { chess } = this.props; // completed game
    const { board, threats, index } = this.state;  // current point in the game
    const history = chess.history();
    return (
      <div>
        <Board>
          <div>
            {ROWS.map((row) =>
              <Row key={row}>
                {COLS.map((col) => {
                  const pos = getPosition(row, col);
                  const piece = board.get(pos);
                  const threat = getThreat(threats, pos);
                  return (
                    <Motion
                      key={pos}
                      style={{ threat: spring(threat, SPRING_CONFIG) }}
                    >
                      {this.renderSquare(piece)}
                    </Motion>
                  )
              })}
              </Row>
            )}
          </div>
          <Log history={history} index={index} onChangeIndex={this.handleChangeIndex} />
        </Board>
        <Bottom>
          <Controls history={history} index={index} onChangeIndex={this.handleChangeIndex} />
          <Row>
            <Legend style={{ backgroundColor: threatColor(-5) }} />
            <Legend style={{ backgroundColor: threatColor(-4) }} />
            <Legend style={{ backgroundColor: threatColor(-3) }} />
            <Legend style={{ backgroundColor: threatColor(-2) }} />
            <Legend style={{ backgroundColor: threatColor(-1) }} />
            <Legend style={{ backgroundColor: threatColor(0) }} />
            <Legend style={{ backgroundColor: threatColor(1) }} />
            <Legend style={{ backgroundColor: threatColor(2) }} />
            <Legend style={{ backgroundColor: threatColor(3) }} />
            <Legend style={{ backgroundColor: threatColor(4) }} />
            <Legend style={{ backgroundColor: threatColor(5) }} />
          </Row>
        </Bottom>
      </div>
    );
  }
}

// http://colorbrewer2.org/#type=sequential
const WARNING_COLOR_START = '#feedde'; //  0
const WARNING_COLOR_END = '#a63603';   //  5
const SAFE_COLOR_START = '#edf8e9';    // -1
const SAFE_COLOR_END =  '#006d2c';     // -5

// interpolates two hex colors using hsluv
const interpolate = (start: string, end: string, number: number): string => {
  const xs: [number, number, number] = hexToHsluv(start);
  const ys: [number, number, number] = hexToHsluv(end);

  const weightedAverage = ys.map((y: number, i: number) => {
    const x = xs[i];
    return (number * y) + ((1 - number) * x);
  });

  return hsluvToHex(weightedAverage);
}

const findWeight = (start: number, end: number, current: number) => (
  (current - start) / (end - start)
);

const threatColor = (threat: number): string => {
  if (threat > 5) {
    return WARNING_COLOR_END
  }

  if (threat > 1) {
    return interpolate(WARNING_COLOR_START, WARNING_COLOR_END, findWeight(1, 5, threat));
  }

  if (threat > -1) {
    return interpolate(SAFE_COLOR_START, WARNING_COLOR_START, findWeight(-1, 1, threat));
  }

  if (threat > -5) {
    return interpolate(SAFE_COLOR_START, SAFE_COLOR_END, findWeight(-1, -5, threat));
  }

  return SAFE_COLOR_END;
}

const Board = styled.div`
  display: flex;
`;

const Row = styled.div`
  display: flex;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const Square = styled.div`
  width: 70px;
  height: 70px;
  position: relative;
`;

const Legend = styled.div`
  width: 30px;
  height: 30px;
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export default Game;
