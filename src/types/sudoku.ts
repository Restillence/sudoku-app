export type Difficulty = 'easy' | 'medium' | 'hard';

export type Cell = {
  value: number;
  isFixed: boolean;
  notes: number[];
  isError: boolean;
};

export type GameState = {
  board: Cell[][];
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  isNotesMode: boolean;
  timer: number;
  isComplete: boolean;
  difficulty: Difficulty;
  mistakes: number;
};
