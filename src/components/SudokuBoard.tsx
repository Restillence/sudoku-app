import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SudokuCell } from './SudokuCell';
import { Cell } from '../types/sudoku';

type Props = {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
};

export function SudokuBoard({ board, selectedCell, onCellPress }: Props) {
  const highlight = (r: number, c: number): boolean => {
    if (!selectedCell) return false;
    const { row: sr, col: sc } = selectedCell;
    if (r === sr || c === sc) return true;
    // same box
    return Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3);
  };

  return (
    <View style={styles.wrap}>
      {board.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => (
            <SudokuCell
              key={`${ri}-${ci}`}
              cell={cell}
              row={ri}
              col={ci}
              isSelected={selectedCell?.row === ri && selectedCell?.col === ci}
              isHighlighted={highlight(ri, ci)}
              onPress={onCellPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 2, borderColor: '#111', borderRadius: 3, overflow: 'hidden' },
  row: { flexDirection: 'row' },
});
