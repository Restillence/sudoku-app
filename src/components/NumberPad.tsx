import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onNumberPress: (n: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
};

export function NumberPad({ onNumberPress, onErase, isNotesMode, onToggleNotes }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.nums}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <TouchableOpacity key={n} style={styles.btn} onPress={() => onNumberPress(n)}>
            <Text style={styles.btnText}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actBtn, isNotesMode && styles.actBtnOn]} 
          onPress={onToggleNotes}
        >
          <Text style={[styles.actTxt, isNotesMode && styles.actTxtOn]}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actBtn} onPress={onErase}>
          <Text style={styles.actTxt}>Erase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
  nums: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 20, fontWeight: '600', color: '#111' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  actBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  actBtnOn: { backgroundColor: '#2563eb' },
  actTxt: { fontSize: 13, fontWeight: '500', color: '#444' },
  actTxtOn: { color: '#fff' },
});
