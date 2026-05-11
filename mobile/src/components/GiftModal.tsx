import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

interface GiftModalProps {
  visible: boolean;
  type: 'row' | 'column';
  label: string;
  theme: 'kids' | 'cricket';
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const STARS = ['⭐', '🌟', '✨', '💫'];
const CRICKET_ICONS = ['🏏', '⭐', '🌟', '🏆'];

export default function GiftModal({ visible, type, label, theme, onClose }: GiftModalProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const icons = theme === 'cricket' ? CRICKET_ICONS : STARS;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scale.setValue(0);
    }
  }, [visible, scale]);

  const isRow = type === 'row';
  const bgColor = theme === 'cricket' ? '#065F46' : '#4C1D95';
  const accentColor = theme === 'cricket' ? '#10B981' : '#F59E0B';
  const message = isRow
    ? `${label} completed for the day!`
    : `All activities done for ${label}!`;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { backgroundColor: bgColor, transform: [{ scale }] }]}>
          <Text style={styles.floatingIcons}>
            {icons.join(' ')}
          </Text>

          <Text style={styles.trophy}>
            {theme === 'cricket' ? '🏆' : '🎁'}
          </Text>

          <Text style={styles.congrats}>Congratulations!</Text>

          <Text style={[styles.message, { color: accentColor }]}>
            {message}
          </Text>

          <Text style={styles.subtitle}>
            {isRow ? 'All tasks done for this activity!' : 'Perfect day achieved!'}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: accentColor }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Awesome! 🎉</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: Math.min(width - 48, 360),
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingIcons: {
    fontSize: 24,
    marginBottom: 8,
    letterSpacing: 4,
  },
  trophy: {
    fontSize: 64,
    marginBottom: 12,
  },
  congrats: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
});
