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

// lazy init helper
const emptyCell = (): Cell => ({ value: 0, isFixed: false, notes: [], isError: false });

function createEmptyBoard(): Cell[][] {
  return Array(9).fill(null).map(() => Array(9).fill(null).map(emptyCell));
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
  const [notesMode, setNotesMode] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  const newGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(initializeBoard(puzzle));
    setSolution(sol);
    setDifficulty(diff);
    setSelectedCell(null);
    setNotesMode(false);
    setIsComplete(false);
    setMistakes(0);
    setPlaying(true);
    setTime(0);
    setShowDifficultyModal(false);
    setShowWinModal(false);
  }, []);

  useEffect(() => {
    newGame('easy');
  }, [newGame]);

  // timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing && !isComplete) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [playing, isComplete]);

  // win check
  useEffect(() => {
    if (isComplete) return;
    
    const filled = board.every(row => row.every(c => c.value !== 0));
    const hasErrors = board.some(row => row.some(c => c.isError));
    
    if (filled && !hasErrors) {
      setIsComplete(true);
      setPlaying(false);
      setShowWinModal(true);
    }
  }, [board, isComplete]);

  const selectCell = (row: number, col: number) => setSelectedCell({ row, col });

  const inputNumber = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (board[row][col].isFixed) return;

    if (notesMode) {
      setBoard(prev => {
        const nb = prev.map(r => r.map(c => ({ ...c })));
        const notes = nb[row][col].notes;
        nb[row][col].notes = notes.includes(num) 
          ? notes.filter(n => n !== num) 
          : [...notes, num].sort();
        nb[row][col].value = 0;
        return nb;
      });
    } else {
      const correct = isValidMove(
        board.map(r => r.map(c => c.value)),
        solution,
        row,
        col,
        num
      );

      setBoard(prev => {
        const nb = prev.map(r => r.map(c => ({ ...c })));
        nb[row][col] = { value: num, isFixed: false, notes: [], isError: !correct };
        return nb;
      });

      if (!correct) setMistakes(m => m + 1);
    }
  };

  const eraseCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (board[row][col].isFixed) return;

    setBoard(prev => {
      const nb = prev.map(r => r.map(c => ({ ...c })));
      nb[row][col] = { value: 0, isFixed: false, notes: [], isError: false };
      return nb;
    });
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const difficultyColor = {
    easy: '#16a34a',
    medium: '#d97706', 
    hard: '#dc2626',
  }[difficulty];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Sudoku</Text>
        <TouchableOpacity 
          style={styles.newBtn}
          onPress={() => setShowDifficultyModal(true)}
        >
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={[styles.statVal, { color: difficultyColor }]}>
            {difficulty}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statVal}>⏱️ {fmtTime(time)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Errors</Text>
          <Text style={styles.statVal}>❌ {mistakes}</Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <SudokuBoard
          board={board}
          selectedCell={selectedCell}
          onCellPress={selectCell}
        />
      </View>

      <NumberPad
        onNumberPress={inputNumber}
        onErase={eraseCell}
        isNotesMode={notesMode}
        onToggleNotes={() => setNotesMode(n => !n)}
      />

      {/* difficulty picker */}
      <Modal visible={showDifficultyModal} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowDifficultyModal(false)}>
          <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Pick difficulty</Text>
            
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.diffBtn, { backgroundColor: { easy: '#16a34a', medium: '#d97706', hard: '#dc2626' }[d] }]}
                onPress={() => newGame(d)}
              >
                <Text style={styles.diffBtnText}>
                  {{ easy: '🟢', medium: '⚡', hard: '🔥' }[d]} {d}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity onPress={() => setShowDifficultyModal(false)}>
              <Text style={styles.cancelText}>cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* win screen */}
      <Modal visible={showWinModal} transparent animationType="fade">
        <Pressable style={styles.overlay}>
          <Pressable style={styles.modal}>
            <Text style={styles.winTitle}>🎉 Solved!</Text>
            <Text style={styles.winSub}>
              ⏱️ {fmtTime(time)} · ❌ {mistakes} mistakes
            </Text>
            
            <TouchableOpacity 
              style={[styles.diffBtn, { backgroundColor: '#7c3aed' }]}
              onPress={() => { setShowWinModal(false); setShowDifficultyModal(true); }}
            >
              <Text style={styles.diffBtnText}>🎮 Play again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowWinModal(false)}>
              <Text style={styles.cancelText}>close</Text>
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
    backgroundColor: '#e8ecf0',
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
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  newBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  newBtnText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    maxWidth: 324,
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: 1, backgroundColor: '#ddd', marginHorizontal: 6 },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  statVal: { fontSize: 13, fontWeight: '600', color: '#222' },
  boardWrap: { alignItems: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 280,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#111' },
  diffBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  diffBtnText: { fontSize: 15, fontWeight: '600', color: '#fff', textTransform: 'capitalize' },
  cancelText: { fontSize: 14, color: '#666', marginTop: 8 },
  winTitle: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 8 },
  winSub: { fontSize: 14, color: '#666', marginBottom: 16 },
});
