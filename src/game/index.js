// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import { range } from 'lodash';
import Chess from 'chess.js';
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
  prevThreats: Threats,
};

const ROWS = range(0, 8);
const COLS = range(0, 8);

const SPRING_CONFIG = { stiffness: 600, damping: 40 };

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

const interpolateColor = (start: string, end: string, interpolation: number): string => {
  if (interpolation <= 0) { return start; }
  if (interpolation >= 1) { return end; }

  return 'cornsilk';
};

class Game extends PureComponent<Props, State> {
  state = {
    index: -1,
    board: new Chess(),
    threats: {},
    prevThreats: {},
  };

  // TODO: duplication between this and handleChangeIndex,
  // only real difference is prevThreats
  componentWillMount() {
    const { chess } = this.props;
    const { index } = this.state;
    const board = buildGameFrom(chess, index);
    const threats = findThreats(board);

    this.setState(() => ({
      index,
      board,
      threats,
      prevThreats: threats,
    }));
  }

  handleChangeIndex = (index: number) => {
    const { chess } = this.props;
    const { threats: prevThreats } = this.state;
    const board = buildGameFrom(chess, index);
    const threats = findThreats(board);

    this.setState(() => ({
      index,
      board,
      threats,
      prevThreats,
    }));
  };

  renderSquare = (pos: string, piece: PiecePojo, threat: number, prevThreat: number) => ({ x }: { x: number }) => {
    return (
      <Square
        style={{ backgroundColor: interpolateColor(threatColor(prevThreat), threatColor(threat), x) }}
      >
        {piece ? <Piece
          piece={piece}
          width={'100%'}
          height={'100%'}
        /> : null}
        <Label>{threat}</Label>
      </Square>
    );
  }

  render() {
    const { chess } = this.props; // completed game
    const { board, threats, prevThreats, index } = this.state;  // current point in the game
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
                  const prevThreat = getThreat(prevThreats, pos);
                  return (
                    <Motion
                      key={pos}
                      style={{ x: spring(threat - prevThreat === 0 ? 0 : 1, SPRING_CONFIG) }}
                    >
                      {this.renderSquare(pos, piece, threat, prevThreat)}
                    </Motion>
                  )
              })}
              </Row>
            )}
          </div>
          <Log history={history} index={index} onChangeIndex={this.handleChangeIndex} />
        </Board>
        <Controls history={history} index={index} onChangeIndex={this.handleChangeIndex} />
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

const Board = styled.div`
  display: flex;
`;

const Row = styled.div`
  display: flex;
`;

const Square = styled.div`
  width: 70px;
  height: 70px;
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export default Game;
