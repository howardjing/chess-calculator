// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import type { Move } from './index';

type Props = {
  history: Move[],
  index: number,
  onChangeIndex: (index: number) => any,
};

const isFirst = (index: number): boolean => index === -1;
const isLast = (history: any[], index: number) => index >= history.length - 1;

class Controls extends Component<Props> {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      this.goBack();
    } else if (e.key === 'ArrowRight') {
      this.goForward();
    }
  }

  goBack = () => {
    const { index, onChangeIndex } = this.props;
    if (isFirst(index)) { return; }
    onChangeIndex(index - 1);
  };

  goForward = () => {
    const { history, index, onChangeIndex } = this.props;
    if (isLast(history, index)) { return; }
    onChangeIndex(index + 1);
  };

  goFirst = () => {
    const { onChangeIndex } = this.props;
    onChangeIndex(-1);
  }

  goLast = () => {
    const { history, onChangeIndex } = this.props;
    onChangeIndex(history.length - 1);
  }

  render() {
    const { history, index } = this.props;
    return (
      <Wrapper>
        <Control
          active={!isFirst(index)}
          onClick={this.goFirst}
        >
          first
        </Control>
        <Control
          active={!isFirst(index)}
          onClick={this.goBack}
        >
          &#xab; prev
        </Control>
        <Control
          active={!isLast(history, index)}
          onClick={this.goForward}
        >
          next &#xbb;
        </Control>
        <Control
          active={!isLast(history, index)}
          onClick={this.goLast}
        >
          last
        </Control>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
`;

type ControlProps = {
  active: boolean,
};

const Control = styled.div`
  margin-right: 10px;
  font-size: 20px;
  user-select: none;
  cursor: ${({ active }: ControlProps) => active ? 'pointer' : 'auto'};
  color: ${({ active }: ControlProps) => active ? '#000' : '#aaa'};
  pointer-events: ${({ active }: ControlProps) => active ? 'auto' : 'none'};
`;

export default Controls;
