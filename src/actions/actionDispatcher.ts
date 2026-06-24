import type { Action } from '../engine/types';
import { useCartStore } from '../store/cartStore';

type ActionHandler = (action: Action) => void;

const handlers: Record<string, ActionHandler> = {
  ADD_TO_CART: (action) => {
    const productId = String(action.payload?.id ?? '');
    if (!productId) {
      console.warn('[Action] ADD_TO_CART missing product id');
      return;
    }
    useCartStore.getState().addToCart(productId);
  },

  DEEP_LINK: (action) => {
    const url = String(action.payload?.url ?? '');
    if (__DEV__) {
      console.log(`[Action] DEEP_LINK → ${url}`);
    }
    useCartStore.setState({ lastActionMessage: `Navigating to ${url}` });
  },

  APPLY_MYSTERY_GIFT_COUPON: () => {
    useCartStore.getState().applyMysteryCoupon();
  },

  BOOK_EVENT: (action) => {
    const eventId = String(action.payload?.event_id ?? 'event');
    const slot = String(action.payload?.slot ?? '');
    useCartStore.setState({
      lastActionMessage: `Booked ${eventId}${slot ? ` @ ${slot}` : ''}`,
    });
  },

  VIEW_CAMPAIGN: (action) => {
    const name = String(action.payload?.name ?? 'campaign');
    if (__DEV__) {
      console.log(`[Action] VIEW_CAMPAIGN → ${name}`);
    }
  },
};

export function handleAction(action: Action | undefined): void {
  if (!action?.type) {
    return;
  }

  const handler = handlers[action.type];
  if (!handler) {
    if (__DEV__) {
      console.warn(`[Action] No handler registered for type: ${action.type}`);
    }
    return;
  }

  try {
    handler(action);
  } catch (error) {
    console.error(`[Action] Handler failed for ${action.type}:`, error);
  }
}
