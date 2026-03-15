import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  onNumberPress: (num: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
};

export function NumberPad({ onNumberPress, onErase, isNotesMode, onToggleNotes }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.numbersRow}>
        {numbers.map((num) => (
          <Pressable pointerEvents="auto" style={{ zIndex: 9999 }}
            key={num}
            style={({ pressed }) => [styles.numberButton, pressed && styles.numberButtonPressed]}
            onPress={() => onNumberPress(num)}
            pointerEvents="auto"
          >
            <Text style={styles.numberText}>{num}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actionsRow} pointerEvents="box-none">
        <Pressable pointerEvents="auto" style={{ zIndex: 9999 }}
          style={({ pressed }) => [styles.actionButton, isNotesMode && styles.actionButtonActive, pressed && styles.actionButtonPressed]}
          onPress={onToggleNotes}
          pointerEvents="auto"
        >
          <Text style={[styles.actionText, isNotesMode && styles.actionTextActive]}>
            ✏️ Notes
          </Text>
        </Pressable>
        <Pressable pointerEvents="auto" style={{ zIndex: 9999 }}
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          onPress={onErase}
          pointerEvents="auto"
        >
          <Text style={styles.actionText}>🗑️ Erase</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    maxWidth: 324,
    zIndex: 100,
  },
  numbersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  numberButtonPressed: {
    backgroundColor: '#f1f5f9',
  },
  numberText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 6,
    zIndex: 10,
  },
  actionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  actionButtonPressed: {
    backgroundColor: '#cbd5e1',
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
