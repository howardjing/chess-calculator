// @flow
type Position = {
  row: number,
  col: number;
};

const LETTERS = ['a', 'b' , 'c', 'd', 'e', 'f', 'g', 'h'];
const NUMBERS = [8, 7, 6, 5, 4, 3, 2, 1];

const LETTERS_TO_COL = LETTERS.reduce((map: {[string]: number }, letter: string, index: number) => {
  map[letter] = index;

  return map;
}, {});

const NUMBERS_TO_ROW = NUMBERS.reduce((map: { [number]: number }, number: number, index: number) => {
  map[number] = index;

  return map;
}, {});

const buildPosition = (row: number, col: number): Position => ({ row, col });

const toLabel = ({ row, col }: Position): string => {
  const letter = LETTERS[col];
  const number = NUMBERS[row];
  return `${letter}${number}`;
};

const positionFromLabel = (label: string): Position => {
  if (label.length < 2) {
    throw new Error(`invalid label: ${label}`);
  }

  const rowNumber = parseInt(label[1], 10);
  const colLetter = label[0];

  const row = NUMBERS_TO_ROW[rowNumber];
  // comparing with undefined because row can be 0 and 0 is falsey
  if (row === undefined) { throw new Error(`invalid label: ${label} with row: ${rowNumber}`)}

  const col = LETTERS_TO_COL[colLetter];
  if (col === undefined) { throw new Error(`invalid label: ${label} with col: ${colLetter}`)}

  return buildPosition(row, col);
}

export {
  buildPosition,
  toLabel,
  positionFromLabel,
};

export type {
  Position,
};
