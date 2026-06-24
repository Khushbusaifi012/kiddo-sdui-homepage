import React, { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { getProductImage } from '../utils/getProductImage';
import type { BlockComponentProps } from '../engine/types';
import { asEventBookingData } from '../engine/types';
import { useTheme } from '../context/ThemeContext';
import { handleAction } from '../actions/actionDispatcher';

function EventBookingRowComponent({ block }: BlockComponentProps) {
  const theme = useTheme();
  const data = asEventBookingData(block.data);
  const [selectedSlot, setSelectedSlot] = useState(data.slots[0] ?? '');

  const onBook = useCallback(() => {
    handleAction(
      block.action ?? {
        type: 'BOOK_EVENT',
        payload: { event_id: block.id, slot: selectedSlot },
      },
    );
  }, [block.action, block.id, selectedSlot]);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: `${theme.primary}33` }]}>
      <Image source={getProductImage(data.image_url)} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
        <Text style={[styles.description, { color: `${theme.text}AA` }]}>{data.description}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>₹{data.price} / ticket</Text>

        <View style={styles.slots}>
          {data.slots.map((slot) => {
            const active = slot === selectedSlot;
            return (
              <Pressable
                key={slot}
                onPress={() => setSelectedSlot(slot)}
                style={[
                  styles.slot,
                  {
                    borderColor: active ? theme.primary : `${theme.text}33`,
                    backgroundColor: active ? `${theme.primary}18` : 'transparent',
                  },
                ]}
              >
                <Text style={{ color: active ? theme.primary : theme.text, fontWeight: '700', fontSize: 11 }}>
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={onBook} style={[styles.bookBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.bookBtnText}>Book Tickets</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const EventBookingRow = memo(EventBookingRowComponent);
EventBookingRow.displayName = 'EventBookingRow';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: {
    width: 110,
    height: '100%',
    minHeight: 150,
    backgroundColor: '#E8F4FC',
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  slot: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  bookBtn: {
    marginTop: 6,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
