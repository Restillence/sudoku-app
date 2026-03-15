import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  isRunning: boolean;
};

export function Timer({ isRunning }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Text style={styles.timer}>⏱️ {formatTime(seconds)}</Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
});
