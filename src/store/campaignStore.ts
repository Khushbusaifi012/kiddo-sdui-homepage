import { create } from 'zustand';
import type { HomepagePayload } from '../engine/types';
import backToSchool from '../campaigns/back-to-school.json';
import summerPlayhouse from '../campaigns/summer-playhouse.json';
import mysteryCarnival from '../campaigns/mystery-carnival.json';

export type CampaignId = 'back-to-school' | 'summer-playhouse' | 'mystery-carnival';

const CAMPAIGN_MAP: Record<CampaignId, HomepagePayload> = {
  'back-to-school': backToSchool as HomepagePayload,
  'summer-playhouse': summerPlayhouse as HomepagePayload,
  'mystery-carnival': mysteryCarnival as HomepagePayload,
};

interface CampaignState {
  activeCampaignId: CampaignId;
  payload: HomepagePayload;
  setCampaign: (id: CampaignId) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  activeCampaignId: 'back-to-school',
  payload: CAMPAIGN_MAP['back-to-school'],

  setCampaign: (id: CampaignId) => {
    set({
      activeCampaignId: id,
      payload: CAMPAIGN_MAP[id],
    });
  },
}));

export const CAMPAIGN_OPTIONS: { id: CampaignId; label: string }[] = [
  { id: 'back-to-school', label: 'Back to School' },
  { id: 'summer-playhouse', label: 'Summer Playhouse' },
  { id: 'mystery-carnival', label: 'Mystery Carnival' },
];
