import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import type { BlockComponentProps } from '../engine/types';
import { asProductGridData } from '../engine/types';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from './ProductCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const GRID_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

function ProductGrid2x2Component({ block }: BlockComponentProps) {
  const theme = useTheme();
  const data = asProductGridData(block.data);
  const products = useMemo(() => data.products.slice(0, 4), [data.products]);

  return (
    <View style={styles.container}>
      {data.title ? (
        <Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
      ) : null}
      <View style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} width={CARD_WIDTH} />
        ))}
      </View>
    </View>
  );
}

export const ProductGrid2x2 = memo(ProductGrid2x2Component);
ProductGrid2x2.displayName = 'ProductGrid2x2';

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
