// Sudoku puzzle generator and solver

type Grid = number[][];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
}

function solveSudoku(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateSolvedGrid(): Grid {
  const grid: Grid = Array(9).fill(null).map(() => Array(9).fill(0));
  solveSudoku(grid);
  return grid;
}

function countSolutions(grid: Grid, limit: number = 2): number {
  let count = 0;
  
  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve()) {
                grid[row][col] = 0;
                if (count >= limit) return true;
              }
            }
          }
          grid[row][col] = 0;
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }
  
  solve();
  return count;
}

export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): { puzzle: Grid; solution: Grid } {
  const solution = generateSolvedGrid();
  const puzzle = solution.map(row => [...row]);
  
  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55
  }[difficulty];
  
  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => ({ row: Math.floor(i / 9), col: i % 9 }))
  );
  
  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;
    
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    
    const testGrid = puzzle.map(r => [...r]);
    if (countSolutions(testGrid, 2) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }
  
  return { puzzle, solution };
}

export function isValidMove(
  puzzle: Grid,
  solution: Grid,
  row: number,
  col: number,
  value: number
): boolean {
  return solution[row][col] === value;
}
