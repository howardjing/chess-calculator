// @flow
type Position = {
  row: number,
  col: number;
};

const LETTERS = ['a', 'b' , 'c', 'd', 'e', 'f', 'g', 'h'];
const NUMBERS = [8, 7, 6, 5, 4, 3, 2, 1];

const buildPosition = (row: number, col: number): Position => ({ row, col });

const toLabel = ({ row, col }: Position): string => {
  const letter = LETTERS[col];
  const number = NUMBERS[row];
  return `${letter}${number}`;
};

export {
  buildPosition,
  toLabel,
};

export type {
  Position,
};
