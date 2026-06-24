import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Image } from 'expo-image';
import type { OverlayConfig } from '../engine/types';

interface FullScreenOverlayProps {
  overlay: OverlayConfig;
}

const animationCache = new Map<string, string>();

function FullScreenOverlayComponent({ overlay }: FullScreenOverlayProps) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (overlay.media_type !== 'lottie' && !overlay.animation_url.endsWith('.json')) {
      return;
    }
    if (!animationCache.has(overlay.animation_url)) {
      animationCache.set(overlay.animation_url, overlay.animation_url);
    }
    lottieRef.current?.play();
  }, [overlay.animation_url, overlay.media_type]);

  const isWebp =
    overlay.media_type === 'webp' || overlay.animation_url.toLowerCase().includes('.webp');

  return (
    <View style={styles.container} pointerEvents="none">
      {isWebp ? (
        <Image
          source={{ uri: overlay.animation_url }}
          style={styles.media}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <LottieView
          ref={lottieRef}
          source={{ uri: overlay.animation_url }}
          autoPlay
          loop
          style={styles.media}
        />
      )}
    </View>
  );
}

export const FullScreenOverlay = memo(FullScreenOverlayComponent);
FullScreenOverlay.displayName = 'FullScreenOverlay';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    opacity: 0.35,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});
