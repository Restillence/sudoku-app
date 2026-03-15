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
  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const { row: selRow, col: selCol } = selectedCell;
    
    // Same row or column
    if (row === selRow || col === selCol) return true;
    
    // Same 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const selBoxRow = Math.floor(selRow / 3) * 3;
    const selBoxCol = Math.floor(selCol / 3) * 3;
    
    return boxRow === selBoxRow && boxCol === selBoxCol;
  };

  return (
    <View style={styles.container}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              isHighlighted={isHighlighted(rowIndex, colIndex)}
              onPress={onCellPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
