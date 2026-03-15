import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
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

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  // Check for completion
  useEffect(() => {
    if (isComplete) return;
    
    const isFull = board.every((row) => row.every((cell) => cell.value !== 0));
    const hasErrors = board.some((row) => row.some((cell) => cell.isError));
    
    if (isFull && !hasErrors) {
      setIsComplete(true);
      setIsPlaying(false);
      Alert.alert(
        '🎉 Congratulations!',
        `You solved the puzzle in ${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')} with ${mistakes} mistakes!`,
        [{ text: 'New Game', onPress: () => showDifficultySelector() }]
      );
    }
  }, [board, isComplete, mistakes, elapsedTime]);

  const showDifficultySelector = () => {
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
    setSelectedCell({ row, col });
  };

  const handleNumberPress = (num: number) => {
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
    setIsNotesMode((prev) => !prev);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Sudoku</Text>
        <TouchableOpacity onPress={showDifficultySelector}>
          <Text style={styles.newGameButton}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Text>
        <Text style={styles.statText}>⏱ {formatTime(elapsedTime)}</Text>
        <Text style={styles.statText}>❌ {mistakes}</Text>
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
    </SafeAreaView>
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
    fontSize: 16,
    color: '#3b82f6',
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
