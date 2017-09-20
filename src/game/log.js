// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import type { Move } from './index';

type Props = {
  history: Move[],
  index: number,
  onChangeIndex: (index: number) => any,
};

const byTurns = (history: Move[]): [string, string][] => {
  const turns = [];
  let newTurn = true;
  let first = null;
  let second = null;
  history.forEach((move: Move) => {
    if (newTurn) {
      first = move;
      newTurn = false;
    } else {
      second = move;
      newTurn = true;

      if (!first || !second) {
        throw new Error("we done goofed");
      }

      turns.push([first.san, second.san]);
    }
  });

  return turns;
};

const isActive = (x: number, y: number) => x === y;

class Log extends Component<Props> {
  renderTurn = ([a, b]: [string, string], turn: number) => {
    const { index, onChangeIndex } = this.props;
    const aIndex = 2 * turn;
    const bIndex = aIndex + 1;
    return (
      <li key={turn}>
        <MoveComponent
          active={isActive(index, aIndex)}
          onClick={() => onChangeIndex(aIndex)}
        >
          {a || null}
        </MoveComponent>
        <MoveComponent
          active={isActive(index, bIndex)}
          onClick={() => onChangeIndex(bIndex)}
        >
          {b || null}
        </MoveComponent>
      </li>
    );
  }

  render() {
    const { history } = this.props;
    return (
      <Wrapper>
        <Content>
          {byTurns(history).map(this.renderTurn)}
        </Content>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 150px;
  overflow-y: scroll;
`;

const Content = styled.ol`
  position: absolute;
`;

type MoveProps = {
  active: boolean,
};

const MoveComponent = styled.span`
  cursor: pointer;
  font-size: 18px;
  font-weight: ${({ active }: MoveProps) => active ? 'bold': 'normal'};
  &:after {
    content: ' ';
  }
`;

export default Log;
