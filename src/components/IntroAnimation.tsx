import { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';

/**
 * The landing page's one-time brand moment: the two Logomark circles (same pine +
 * amber as everywhere else — no new colors) spiral around each other, then expand
 * past the edges of the screen, fading out to reveal the real page underneath
 * (already mounted the whole time, so there's no pop-in once this unmounts).
 * Tappable to skip — a splash should never make someone wait on it.
 */

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CIRCLE = 64;
const ORBIT_RADIUS = 34;
const SCALE_TARGET = Math.ceil((Math.sqrt(SCREEN_W * SCREEN_W + SCREEN_H * SCREEN_H) / CIRCLE) * 1.3);

const ORBIT_MS = 1300;
const EXPAND_MS = 650;
const FADE_MS = 450;

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const angle = useSharedValue(0);
  const radius = useSharedValue(ORBIT_RADIUS);
  const scale = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    // Spiral: orbit while the radius collapses toward the center, so the two
    // circles are already together right as the expand phase begins.
    angle.value = withTiming(Math.PI * 4, { duration: ORBIT_MS, easing: Easing.inOut(Easing.ease) });
    radius.value = withTiming(0, { duration: ORBIT_MS, easing: Easing.in(Easing.quad) });
    scale.value = withDelay(ORBIT_MS, withTiming(SCALE_TARGET, { duration: EXPAND_MS, easing: Easing.out(Easing.cubic) }));
    overlayOpacity.value = withDelay(
      ORBIT_MS + EXPAND_MS * 0.6,
      withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished) runOnJS(onDone)();
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    cancelAnimation(angle);
    cancelAnimation(radius);
    cancelAnimation(scale);
    cancelAnimation(overlayOpacity);
    overlayOpacity.value = 0;
    onDone();
  };

  const circleAStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle.value) * radius.value },
      { translateY: Math.sin(angle.value) * radius.value },
      { scale: scale.value },
    ],
  }));
  const circleBStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle.value + Math.PI) * radius.value },
      { translateY: Math.sin(angle.value + Math.PI) * radius.value },
      { scale: scale.value },
    ],
  }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }, overlayStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={skip} />
      <Animated.View
        style={[
          { position: 'absolute', width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2, backgroundColor: colors.accent },
          circleAStyle,
        ]}
      />
      <Animated.View
        style={[
          { position: 'absolute', width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2, backgroundColor: colors.accent2, opacity: 0.92 },
          circleBStyle,
        ]}
      />
    </Animated.View>
  );
}
