import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SudokuBoard } from './src/components/SudokuBoard';
import { NumberPad } from './src/components/NumberPad';
import { Timer } from './src/components/Timer';
import { Cell, Difficulty } from './src/types/sudoku';
import { generatePuzzle, isValidMove } from './src/utils/sudokuGenerator';

type Grid = number[][];

function createEmptyBoard(): Cell[][] {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({ value: 0, isFixed: false, notes: [], isError: false }))
    );
}

function initializeBoard(puzzle: Grid): Cell[][] {
  return puzzle.map((row) =>
    row.map((value) => ({
      value,
      isFixed: value !== 0,
      notes: [],
      isError: false,
    }))
  );
}

export default function App() {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startNewGame = useCallback((diff: Difficulty) => {
    console.log("App: Starting new game:", diff);
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(initializeBoard(puzzle));
    setSolution(sol);
    setDifficulty(diff);
    setSelectedCell(null);
    setIsNotesMode(false);
    setIsComplete(false);
    setMistakes(0);
    setIsPlaying(true);
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    startNewGame('easy');
  }, [startNewGame]);

  const showDifficultySelector = () => {
    console.log("App: New Game button pressed");
    Alert.alert(
      'New Game',
      'Select difficulty:',
      [
        { text: 'Easy', onPress: () => startNewGame('easy') },
        { text: 'Medium', onPress: () => startNewGame('medium') },
        { text: 'Hard', onPress: () => startNewGame('hard') },
      ]
    );
  };

  const handleCellPress = (row: number, col: number) => {
    console.log(`App: Cell pressed: ${row}, ${col}`);
    setSelectedCell({ row, col });
  };

  const handleNumberPress = (num: number) => {
    console.log(`App: Number pressed: ${num}`);
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const cell = board[row][col];
    
    if (cell.isFixed) return;

    if (isNotesMode) {
      setBoard((prev) => {
        const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
        const notes = newBoard[row][col].notes;
        if (notes.includes(num)) {
          newBoard[row][col].notes = notes.filter((n) => n !== num);
        } else {
          newBoard[row][col].notes = [...notes, num].sort();
        }
        newBoard[row][col].value = 0;
        return newBoard;
      });
    } else {
      const isCorrect = isValidMove(
        board.map((r) => r.map((c) => c.value)),
        solution,
        row,
        col,
        num
      );

      setBoard((prev) => {
        const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
        newBoard[row][col] = {
          value: num,
          isFixed: false,
          notes: [],
          isError: !isCorrect,
        };
        return newBoard;
      });

      if (!isCorrect) {
        setMistakes((m) => m + 1);
      }
    }
  };

  const handleErase = () => {
    console.log("App: Erase pressed");
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (board[row][col].isFixed) return;

    setBoard((prev) => {
      const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
      newBoard[row][col] = {
        value: 0,
        isFixed: false,
        notes: [],
        isError: false,
      };
      return newBoard;
    });
  };

  const toggleNotesMode = () => {
    console.log("App: Notes mode toggled, current state:", isNotesMode);
    setIsNotesMode((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Sudoku</Text>
        <TouchableOpacity onPress={showDifficultySelector} style={{ backgroundColor: 'yellow', padding: 5 }}>
          <Text style={styles.newGameButton}>New Game (Debug)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>Difficulty: {difficulty}</Text>
      </View>

      <View style={styles.boardContainer}>
        <SudokuBoard
          board={board}
          selectedCell={selectedCell}
          onCellPress={handleCellPress}
        />
      </View>

      <NumberPad
        onNumberPress={handleNumberPress}
        onErase={handleErase}
        isNotesMode={isNotesMode}
        onToggleNotes={toggleNotesMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0', // Light grey to see container
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 324,
    marginBottom: 16,
    backgroundColor: 'cyan', // Debug
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  newGameButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  statsRow: {
    width: '100%',
    maxWidth: 324,
    marginBottom: 20,
    backgroundColor: 'pink', // Debug
  },
  statText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  boardContainer: {
    alignItems: 'center',
    backgroundColor: 'lime', // Debug
  },
});
