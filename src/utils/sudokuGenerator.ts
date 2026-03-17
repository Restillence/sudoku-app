// generator + solver

type Grid = number[][];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ok(grid: Grid, r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === n || grid[i][c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[br + i][bc + j] === n) return false;
    }
  }
  return true;
}

function solve(g: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
          if (ok(g, r, c, n)) {
            g[r][c] = n;
            if (solve(g)) return true;
            g[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function makeGrid(): Grid {
  const g: Grid = Array(9).fill(null).map(() => Array(9).fill(0));
  solve(g);
  return g;
}

function solutions(g: Grid, limit = 2): number {
  let count = 0;
  
  function go(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (ok(g, r, c, n)) {
              g[r][c] = n;
              if (go()) {
                g[r][c] = 0;
                if (count >= limit) return true;
              }
            }
          }
          g[r][c] = 0;
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }
  
  go();
  return count;
}

export function generatePuzzle(diff: 'easy' | 'medium' | 'hard'): { puzzle: Grid; solution: Grid } {
  const solution = makeGrid();
  const puzzle = solution.map(r => [...r]);
  
  const remove = { easy: 35, medium: 45, hard: 55 }[diff];
  const cells = shuffle([...Array(81)].map((_, i) => ({ r: Math.floor(i / 9), c: i % 9 })));
  
  let gone = 0;
  for (const { r, c } of cells) {
    if (gone >= remove) break;
    const bak = puzzle[r][c];
    puzzle[r][c] = 0;
    if (solutions(puzzle.map(row => [...row]), 2) === 1) {
      gone++;
    } else {
      puzzle[r][c] = bak;
    }
  }
  
  return { puzzle, solution };
}

export function isValidMove(_: Grid, solution: Grid, r: number, c: number, v: number): boolean {
  return solution[r][c] === v;
}
