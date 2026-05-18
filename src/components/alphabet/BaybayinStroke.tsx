import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { BaybayinCharacter } from "../../types/alphabet";

interface StrokeProps {
  character: BaybayinCharacter;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const BaybayinStroke: React.FC<StrokeProps> = ({ character }) => {
  const strokes = character.strokes || [];
  const animations = useRef(strokes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animations.forEach((anim) => anim.setValue(0));

    const animSequence = strokes.map((_, i) =>
      Animated.timing(animations[i], {
        toValue: 1,
        duration: 800,
        delay: i * 400,
        useNativeDriver: true,
      })
    );
    Animated.sequence(animSequence).start();
  }, [character]);

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 100 100" style={styles.svg}>
        {strokes.map((stroke, i) => (
          <AnimatedPath
            key={stroke.id}
            d={stroke.path}
            fill="transparent"
            stroke="#111827"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={200}
            strokeDashoffset={animations[i].interpolate({
              inputRange: [0, 1],
              outputRange: [200, 0],
            })}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
});
