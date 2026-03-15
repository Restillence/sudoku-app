import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
  const backgroundColor = isSelected
    ? '#3b82f6'
    : isHighlighted
    ? '#dbeafe'
    : cell.isFixed
    ? '#f1f5f9'
    : '#ffffff';

  const textColor = isSelected
    ? '#ffffff'
    : cell.isError
    ? '#ef4444'
    : cell.isFixed
    ? '#1e293b'
    : '#3b82f6';

  const borderRight = (col + 1) % 3 === 0 && col < 8 ? 2 : 0.5;
  const borderBottom = (row + 1) % 3 === 0 && row < 8 ? 2 : 0.5;

  return (
    <Pressable pointerEvents="auto" style={{ zIndex: 9999 }}
      style={({ pressed }) => [
        styles.cell,
        {
          backgroundColor: pressed ? '#cbd5e1' : backgroundColor,
          borderRightWidth: borderRight,
          borderBottomWidth: borderBottom,
        },
      ]}
      onPress={() => onPress(row, col)}
      pointerEvents="auto"
    >
      {cell.value !== 0 ? (
        <Text style={[styles.cellText, { color: textColor }]}>
          {cell.value}
        </Text>
      ) : cell.notes.length > 0 ? (
        <View style={styles.notesContainer} pointerEvents="none">
          {cell.notes.map((note) => (
            <Text key={note} style={styles.noteText}>
              {note}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    zIndex: 10,
  },
  cellText: {
    fontSize: 18,
    fontWeight: '600',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 8,
    color: '#64748b',
    width: 10,
    textAlign: 'center',
  },
});
