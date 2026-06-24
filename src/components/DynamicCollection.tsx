import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { BlockComponentProps } from '../engine/types';
import { asDynamicCollectionData, type ProductItem } from '../engine/types';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from './ProductCard';

const ITEM_WIDTH = 156;
const COLLECTION_HEIGHT = 210;

function DynamicCollectionComponent({ block }: BlockComponentProps) {
  const theme = useTheme();
  const data = asDynamicCollectionData(block.data);

  const renderItem = useCallback(
    ({ item }: { item: ProductItem }) => (
      <ProductCard product={item} width={ITEM_WIDTH} compact />
    ),
    [],
  );

  const keyExtractor = useCallback((item: ProductItem) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
          {data.subtitle ? (
            <Text style={[styles.subtitle, { color: `${theme.text}99` }]}>{data.subtitle}</Text>
          ) : null}
        </View>
        {data.theme_tag ? (
          <View style={[styles.tag, { backgroundColor: `${theme.primary}22` }]}>
            <Text style={[styles.tagText, { color: theme.primary }]}>{data.theme_tag}</Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={data.items}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + 10,
          offset: (ITEM_WIDTH + 10) * index,
          index,
        })}
      />
    </View>
  );
}

export const DynamicCollection = memo(DynamicCollectionComponent);
DynamicCollection.displayName = 'DynamicCollection';

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    height: COLLECTION_HEIGHT,
  },
  listContent: {
    gap: 10,
    paddingRight: 8,
  },
});
