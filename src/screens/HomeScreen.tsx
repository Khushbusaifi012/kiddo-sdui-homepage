import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import type { BlockNode } from '../engine/types';
import { BlockRenderer } from '../engine/BlockRenderer';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useCampaignStore } from '../store/campaignStore';
import { useCartStore, useCartTotalCount } from '../store/cartStore';
import { CampaignSwitcher } from '../components/CampaignSwitcher';

function CartBadge() {
  const theme = useTheme();
  const total = useCartTotalCount();
  const message = useCartStore((s) => s.lastActionMessage);
  const couponApplied = useCartStore((s) => s.couponApplied);

  return (
    <View style={styles.headerRight}>
      {couponApplied ? (
        <View style={[styles.couponPill, { backgroundColor: theme.accent }]}>
          <Text style={styles.couponText}>COUPON ✓</Text>
        </View>
      ) : null}
      <View style={[styles.cartPill, { backgroundColor: theme.primary }]}>
        <Text style={styles.cartText}>Cart: {total}</Text>
      </View>
      {message ? <Text style={[styles.toast, { color: theme.secondary }]}>{message}</Text> : null}
    </View>
  );
}

function FeedHeader() {
  const theme = useTheme();
  const payload = useCampaignStore((s) => s.payload);
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);
  const setCampaign = useCampaignStore((s) => s.setCampaign);

  return (
    <View style={styles.headerSection}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.brand, { color: theme.primary }]}>Kiddo</Text>
          <Text style={[styles.campaignName, { color: theme.text }]}>{payload.campaign_name}</Text>
        </View>
        <CartBadge />
      </View>
      <CampaignSwitcher activeCampaignId={activeCampaignId} onSelect={setCampaign} />
    </View>
  );
}

function HomeContent() {
  const theme = useTheme();
  const payload = useCampaignStore((s) => s.payload);

  const blocks = useMemo(() => payload.blocks, [payload.blocks]);

  const renderItem = useCallback(({ item }: { item: BlockNode }) => {
    return (
      <View style={styles.blockWrapper}>
        <BlockRenderer block={item} />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: BlockNode) => item.id, []);

  const renderListHeader = useCallback(() => <FeedHeader />, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      <FlashList
        data={blocks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={220}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews
        drawDistance={280}
      />
    </View>
  );
}

export function HomeScreen() {
  const payload = useCampaignStore((s) => s.payload);

  return (
    <ThemeProvider theme={payload.theme}>
      <HomeContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 54,
  },
  headerSection: {
    gap: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  brand: {
    fontSize: 28,
    fontWeight: '900',
  },
  campaignName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 1,
  },
  cartPill: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cartText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  couponPill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  couponText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  toast: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  blockWrapper: {
    marginBottom: 16,
  },
});
