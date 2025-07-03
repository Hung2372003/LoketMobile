import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const FlyingEmoji = ({ icon }: { icon: string }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width * 0.6 - width * 0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -250,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.flyingEmoji,
        {
          transform: [
            { translateY },
            { translateX },
          ],
          opacity,
        },
      ]}
    >
      <Text style={styles.emojiText}>{icon}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flyingEmoji: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
  },
  emojiText: {
    fontSize: 36,
  },
});

export default FlyingEmoji;
