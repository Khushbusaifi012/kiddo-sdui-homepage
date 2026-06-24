import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CampaignId } from '../store/campaignStore';
import { CAMPAIGN_OPTIONS } from '../store/campaignStore';
import { useTheme } from '../context/ThemeContext';

interface CampaignSwitcherProps {
  activeCampaignId: CampaignId;
  onSelect: (id: CampaignId) => void;
}

function CampaignSwitcherComponent({ activeCampaignId, onSelect }: CampaignSwitcherProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>Live Campaigns (OTA)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CAMPAIGN_OPTIONS.map((option) => {
          const active = option.id === activeCampaignId;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.primary : theme.surface,
                  borderColor: active ? theme.primary : `${theme.text}33`,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? '#FFF' : theme.text }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const CampaignSwitcher = memo(CampaignSwitcherComponent);
CampaignSwitcher.displayName = 'CampaignSwitcher';

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.7,
  },
  row: {
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
