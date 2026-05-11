import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

interface CheckButtonProps {
  done: boolean;
  onToggle: () => void;
  color?: string;
}

export default function CheckButton({ done, onToggle, color = '#8B5CF6' }: CheckButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          done
            ? { backgroundColor: color, borderColor: color }
            : { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' },
        ]}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, done ? styles.iconDone : styles.iconEmpty]}>
          {done ? '⭐' : '○'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  iconDone: {
    color: '#FFFFFF',
  },
  iconEmpty: {
    color: '#9CA3AF',
  },
});
