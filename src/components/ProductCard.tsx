import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { getProductImage } from '../utils/getProductImage';
import type { ProductItem } from '../engine/types';
import { useTheme } from '../context/ThemeContext';
import { useProductQuantity } from '../store/cartStore';
import { handleAction } from '../actions/actionDispatcher';

interface ProductCardProps {
  product: ProductItem;
  width: number;
  compact?: boolean;
}

function ProductCardComponent({ product, width, compact = false }: ProductCardProps) {
  const theme = useTheme();
  const quantity = useProductQuantity(product.id);

  const onPress = useCallback(() => {
    handleAction(product.action ?? { type: 'ADD_TO_CART', payload: { id: product.id } });
  }, [product.action, product.id]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: theme.surface,
          borderColor: `${theme.primary}33`,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Image source={getProductImage(product.image_url)} style={styles.image} contentFit="cover" />
      {product.badge ? (
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      ) : null}
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={compact ? 1 : 2}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.price, { color: theme.primary }]}>₹{product.price}</Text>
          {quantity > 0 ? (
            <View style={[styles.qtyPill, { backgroundColor: theme.primary }]}>
              <Text style={styles.qtyText}>{quantity}</Text>
            </View>
          ) : (
            <Text style={[styles.addLabel, { color: theme.secondary }]}>ADD</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#F2F2F2',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
    gap: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
  },
  addLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  qtyPill: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  qtyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
