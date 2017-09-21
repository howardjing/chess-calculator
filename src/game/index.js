// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import { range } from 'lodash';
import Chess from 'chess.js';
import { hsluvToHex, hexToHsluv } from 'hsluv';
import { flatMap } from 'lodash';
import Piece from './piece';
import Log from './log';
import Controls from './controls';
import findThreats from './find-threats';
import { piecesFromBoard, buildPiece, Piece as ChessPiece } from './chess/pieces';
import { buildPosition, toLabel, positionFromLabel } from './position';
import type { Position } from './position';
import type { PieceType as ChessPieceType, Color } from './chess';

// standard algebraic notation
type San = string;

type PositionLabel = string;

type Threats = { [PositionLabel]: number };

// https://github.com/jhlywa/chess.js/blob/master/README.md#history-options
type Move = {
  from: PositionLabel,
  to: PositionLabel,
  san: San,
  piece: ChessPieceType,
  captured?: ChessPieceType,
  color: Color,
};

type Props = {
  chess: Chess,
};

type State = {
  index: number,
  threats: Threats,
  history: Move[],
  pieces: { [PositionLabel]: ?ChessPiece },
};

const ROWS = range(0, 8);
const COLS = range(0, 8);

const COLOR_SPRING_CONFIG = { stiffness: 200, damping: 40 };
const PIECE_SPRING_CONFIG = { stiffness: 400, damping: 40 };

const getPositionLabel = (row: number, col: number): PositionLabel => toLabel(buildPosition(row, col));

const buildGameFrom = (chess: Chess, index: number): Chess => {
  const moves = chess.history().slice(0, index + 1);
  const game = new Chess();
  moves.forEach(move => {
    game.move(move);
  });

  return game;
};

const getPieces = (game: Chess): { [PositionLabel]: ?ChessPiece } => piecesFromBoard(game.board());

// casting to any is a hack, Object.values(...) returns Array<mixed>
// see https://github.com/facebook/flow/issues/2221
const piecesAsList = (pieces: { [PositionLabel]: ?ChessPiece }): ChessPiece[] => (Object.values(pieces).filter(p => !!p): any);

const getThreat = (threats: Threats, position: PositionLabel): number => threats[position] || 0;

const handleCastling = (moves: Move[]): Move[] =>
  flatMap(moves, (move: Move): Move[] => {
    // king side castle
    if (move.san === 'O-O') {
      if (move.color === 'w') {
        return [
          { from: 'e1', to: 'g1', san: 'Kg1', piece: 'k', color: 'w' },
          { from: 'h1', to: 'f1', san: 'Rf1', piece: 'r', color: 'w' },
        ];
      } else {
        return [
          { from: 'e8', to: 'g8', san: 'Kg8', piece: 'k', color: 'b' },
          { from: 'h8', to: 'f8', san: 'Rf8', piece: 'r', color: 'b' },
        ]
      }
    }

    // queen side castle
    if (move.san === 'O-O-O') {
      if (move.color === 'w') {
        return [
          { from: 'e1', to: 'c1', san: 'Kc1', piece: 'k', color: 'w' },
          { from: 'h1', to: 'd1', san: 'Rd1', piece: 'r', color: 'w' },
        ];
      } else {
        return [
          { from: 'e8', to: 'c8', san: 'Kc8', piece: 'k', color: 'b' },
          { from: 'h8', to: 'd8', san: 'Rd8', piece: 'r', color: 'b' },
        ]
      }
    }

    // normal move
    return [move];
  });

const findRelevantMoves = (history: Move[], from: number, to: number): Move[] => {
  if (from === to) { return []; }
  if (from < to) {
    return handleCastling(history.slice(from + 1, to + 1));
  } else {
    return handleCastling(history.slice(to + 1, from + 1).reverse());
  }
};

const INITIAL_CHESS = new Chess();
const INITIAL_PIECES = getPieces(INITIAL_CHESS);
const SQUARE_SIZE = 8;
const PIECE_SIZE = 7;
const OFFSET = (SQUARE_SIZE - PIECE_SIZE) / 2;
const UNITS = 'vh';

const positionToCoords = (position: Position): { x: number, y: number } => {
  const x = SQUARE_SIZE * position.row;
  const y = SQUARE_SIZE * position.col;

  return { x, y };
};

class Game extends Component<Props, State> {
  state = {
    history: [],
    index: -1,
    pieces: INITIAL_PIECES,
    threats: {},
  };

  // TODO: duplication between this and handleChangeIndex,
  handleNewGame = (chess: Chess, index: number) => {
    const board = buildGameFrom(chess, index);
    const pieces = getPieces(board);
    const threats = findThreats(piecesAsList(pieces));
    const history = chess.history({ verbose: true });

    this.setState(() => ({
      // same as long as chess is the same
      history,

      // keys below vary as index changes
      index,
      pieces,
      threats,
    }));
  };

  componentWillMount() {
    const { chess } = this.props;
    const { index } = this.state;
    this.handleNewGame(chess, index);
  }

  componentWillReceiveProps({ chess }: Props) {
    this.handleNewGame(chess, -1);
  }

  handleChangeIndex = (nextIndex: number) => {
    const { history, pieces, index: prevIndex } = this.state;
    const goingForwards = prevIndex < nextIndex;
    const moves: Move[] = findRelevantMoves(history, prevIndex, nextIndex);

    // mutating state :(
    // this method is rough can probably refactor
    moves.forEach(move => {
      if (goingForwards) {
        const piece = pieces[move.from];

        if (piece) {
          piece.position = positionFromLabel(move.to);
        }

        pieces[move.from] = null;
        pieces[move.to] = piece;
      } else {
        // going backwards, gotta restore stuff
        const piece = pieces[move.to];
        if (piece) {
          piece.position = positionFromLabel(move.from);
        }

        const captured = move.captured ? buildPiece(
          move.captured,
          move.color === 'w' ? 'b' : 'w',
          positionFromLabel(move.to),
        ) : null;

        pieces[move.to] = captured;
        pieces[move.from] = piece;
      }
    });

    const threats = findThreats(piecesAsList(pieces))

    this.setState(() => ({
      index: nextIndex,
      threats,
      pieces,
    }));
  }

  renderSquare = ({ threat }: { threat: number }) => {
    return (
      <Square
        style={{ backgroundColor: threatColor(threat) }}
      >
        <Label>{Math.round(threat)}</Label>
      </Square>
    );
  }

  render() {
    const { pieces, threats, index, history } = this.state;  // current point in the game
    const piecesList = piecesAsList(pieces);

    return (
      <div>
        <BoardWrapper>
          <Board>
            {ROWS.map(row =>
              <Row key={row}>
                {COLS.map(col => {
                  const pos = getPositionLabel(row, col);
                  const threat = getThreat(threats, pos);
                  return (
                    <Motion
                      key={pos}
                      style={{ threat: spring(threat, COLOR_SPRING_CONFIG) }}
                    >
                      {this.renderSquare}
                    </Motion>
                  )
              })}
              </Row>
            )}
            {piecesList.map(piece => {
              const coords = positionToCoords(piece.position);
              return (
                <Motion
                  key={piece.id}
                  style={{
                    x: spring(coords.x, PIECE_SPRING_CONFIG),
                    y: spring(coords.y, PIECE_SPRING_CONFIG),
                  }}
                >
                  {({ x, y }) => (
                    <div style={{
                      position: 'absolute',
                      top: `${x + OFFSET}${UNITS}`,
                      left: `${y + OFFSET}${UNITS}`,
                    }}>
                      <Piece
                        width={`${PIECE_SIZE}${UNITS}`}
                        height={`${PIECE_SIZE}${UNITS}`}
                        piece={piece}
                      />
                    </div>
                  )}
                </Motion>
              )
            })}
          </Board>
          <Log history={history} index={index} onChangeIndex={this.handleChangeIndex} />
        </BoardWrapper>
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
const WARNING_COLOR_START = '#feedde'; //  1
const WARNING_COLOR_END   = '#a63603'; //  5
const SAFE_COLOR_START    = '#edf8e9'; // -1
const SAFE_COLOR_END      = '#006d2c'; // -5

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

const BoardWrapper = styled.div`
  display: flex;
`;

const Board = styled.div`
  position: relative;
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
  width: ${SQUARE_SIZE}${UNITS};
  height: ${SQUARE_SIZE}${UNITS};
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
export type {
  Move ,
};
