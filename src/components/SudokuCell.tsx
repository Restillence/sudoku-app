import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cell } from '../types/sudoku';

type Props = {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  onPress: (row: number, col: number) => void;
};

export function SudokuCell({ cell, row, col, isSelected, isHighlighted, onPress }: Props) {
  const bg = isSelected 
    ? '#2563eb' 
    : isHighlighted 
      ? '#dbeafe' 
      : cell.isFixed 
        ? '#f1f5f9' 
        : '#fff';

  const fg = isSelected 
    ? '#fff' 
    : cell.isError 
      ? '#dc2626' 
      : cell.isFixed 
        ? '#111' 
        : '#2563eb';

  // thick borders on 3x3 box edges
  const bwR = (col + 1) % 3 === 0 && col < 8 ? 2 : 0.5;
  const bwB = (row + 1) % 3 === 0 && row < 8 ? 2 : 0.5;

  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor: bg, borderRightWidth: bwR, borderBottomWidth: bwB }]}
      onPress={() => onPress(row, col)}
    >
      {cell.value !== 0 ? (
        <Text style={[styles.num, { color: fg }]}>{cell.value}</Text>
      ) : cell.notes.length > 0 ? (
        <View style={styles.notes}>
          {cell.notes.map(n => (
            <Text key={n} style={styles.note}>{n}</Text>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#aaa',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  num: { fontSize: 17, fontWeight: '600' },
  notes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: { fontSize: 8, color: '#555', width: 10, textAlign: 'center' },
});
