import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { SudokuBoard } from './src/components/SudokuBoard';
import { NumberPad } from './src/components/NumberPad';
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
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

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
    setShowDifficultyModal(false);
    setShowWinModal(false);
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
      setShowWinModal(true);
    }
  }, [board, isComplete]);

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
        <TouchableOpacity 
          style={styles.newGameButton}
          onPress={() => setShowDifficultyModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Difficulty</Text>
          <Text style={[
            styles.statValue,
            difficulty === 'easy' && styles.easyText,
            difficulty === 'medium' && styles.mediumText,
            difficulty === 'hard' && styles.hardText,
          ]}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>⏱ {formatTime(elapsedTime)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Mistakes</Text>
          <Text style={styles.statValue}>❌ {mistakes}</Text>
        </View>
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

      {/* Difficulty Selection Modal */}
      <Modal
        visible={showDifficultyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDifficultyModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowDifficultyModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Select Difficulty</Text>
            
            <TouchableOpacity
              style={[styles.difficultyButton, styles.easyButton]}
              onPress={() => startNewGame('easy')}
              activeOpacity={0.8}
            >
              <Text style={styles.difficultyButtonText}>🟢 Easy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.difficultyButton, styles.mediumButton]}
              onPress={() => startNewGame('medium')}
              activeOpacity={0.8}
            >
              <Text style={styles.difficultyButtonText}>⚡ Medium</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.difficultyButton, styles.hardButton]}
              onPress={() => startNewGame('hard')}
              activeOpacity={0.8}
            >
              <Text style={styles.difficultyButtonText}>🔥 Hard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDifficultyModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Win Modal */}
      <Modal
        visible={showWinModal}
        transparent
        animationType="fade"
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowWinModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <Text style={styles.winTitle}>🎉 Congratulations!</Text>
            <Text style={styles.winText}>
              You solved the puzzle in {formatTime(elapsedTime)} with {mistakes} mistakes!
            </Text>
            
            <TouchableOpacity
              style={[styles.difficultyButton, styles.playAgainButton]}
              onPress={() => setShowDifficultyModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.difficultyButtonText}>🎮 Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowWinModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    fontSize: 32,
    fontWeight: '800',
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    maxWidth: 324,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
  },
  easyText: {
    color: '#22c55e',
  },
  mediumText: {
    color: '#f59e0b',
  },
  hardText: {
    color: '#ef4444',
  },
  boardContainer: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  difficultyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: '#22c55e',
  },
  mediumButton: {
    backgroundColor: '#f59e0b',
  },
  hardButton: {
    backgroundColor: '#ef4444',
  },
  playAgainButton: {
    backgroundColor: '#8b5cf6',
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  winTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  winText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
});
