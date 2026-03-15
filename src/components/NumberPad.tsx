import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onNumberPress: (num: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
};

export function NumberPad({ onNumberPress, onErase, isNotesMode, onToggleNotes }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.numbersRow}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => onNumberPress(num)}
            activeOpacity={0.7}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, isNotesMode && styles.actionButtonActive]}
          onPress={onToggleNotes}
        >
          <Text style={[styles.actionText, isNotesMode && styles.actionTextActive]}>
            ✏️ Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onErase}>
          <Text style={styles.actionText}>🗑️ Erase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  numbersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  actionTextActive: {
    color: '#ffffff',
  },
});
