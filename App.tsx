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
import { Cell, Difficulty } from './src/types/sudoku';
import { generatePuzzle, isValidMove } from './src/utils/sudokuGenerator';

type Grid = number[][];

function createEmptyBoard(): Cell[][] {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({ value: 0, isFixed: false, notes: [], isError: false }))
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
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startNewGame = useCallback((diff: Difficulty) => {
    console.log("App: Starting new game:", diff);
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(initializeBoard(puzzle));
    setSolution(sol);
    setDifficulty(diff);
    setSelectedCell(null);
    setIsNotesMode(false);
    setMistakes(0);
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    startNewGame('easy');
  }, [startNewGame]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const check = () => {
      const isFull = board.every((row) => row.every((cell) => cell.value !== 0));
      const hasErrors = board.some((row) => row.some((cell) => cell.isError));
      if (isFull && !hasErrors) {
        Alert.alert('🎉 Congratulations!', `Solved in ${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')} with ${mistakes} mistakes!`);
      }
    };
    if (board.some(r => r.some(c => c.value !== 0))) check();
  }, [board, elapsedTime, mistakes]);

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
      newBoard[row][col] = { value: 0, isFixed: false, notes: [], isError: false };
      return newBoard;
    });
  };

  const toggleNotesMode = () => {
    console.log("App: Notes mode toggled, current:", isNotesMode);
    setIsNotesMode((prev) => !prev);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header} pointerEvents="box-none">
        <Text style={styles.title}>Sudoku</Text>
        <TouchableOpacity 
          onPress={showDifficultySelector} 
          style={styles.newGameButton}
          activeOpacity={0.7}
        >
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow} pointerEvents="box-none">
        <Text style={styles.statText}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Text>
        <Text style={styles.statText}>⏱ {formatTime(elapsedTime)}</Text>
        <Text style={styles.statText}>❌ {mistakes}</Text>
      </View>

      <View style={styles.boardContainer} pointerEvents="box-none">
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
    backgroundColor: '#f8fafc',
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  newGameButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newGameButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 324,
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  boardContainer: {
    alignItems: 'center',
  },
});
