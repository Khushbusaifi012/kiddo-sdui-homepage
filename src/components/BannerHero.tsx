import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { getProductImage } from '../utils/getProductImage';
import type { BlockComponentProps } from '../engine/types';
import { asBannerHeroData } from '../engine/types';
import { useTheme } from '../context/ThemeContext';
import { handleAction } from '../actions/actionDispatcher';

function BannerHeroComponent({ block }: BlockComponentProps) {
  const theme = useTheme();
  const data = asBannerHeroData(block.data);

  const onPress = useCallback(() => {
    if (block.action) {
      handleAction(block.action);
    }
  }, [block.action]);

  return (
    <Pressable onPress={onPress} style={[styles.container, { backgroundColor: theme.surface }]}>
      <Image source={getProductImage(data.image_url)} style={styles.image} contentFit="cover" />
      <View style={[styles.overlay, { backgroundColor: `${theme.primary}CC` }]}>
        <Text style={styles.title}>{data.title}</Text>
        {data.subtitle ? <Text style={styles.subtitle}>{data.subtitle}</Text> : null}
        {data.cta_label ? (
          <View style={[styles.cta, { backgroundColor: theme.secondary }]}>
            <Text style={styles.ctaText}>{data.cta_label}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export const BannerHero = memo(BannerHeroComponent);
BannerHero.displayName = 'BannerHero';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 180,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    minHeight: 180,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.95,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
