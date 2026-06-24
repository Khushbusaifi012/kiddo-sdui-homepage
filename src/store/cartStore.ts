import { create } from 'zustand';

interface CartState {
  quantities: Record<string, number>;
  couponApplied: boolean;
  lastActionMessage: string | null;
  addToCart: (productId: string) => void;
  applyMysteryCoupon: () => void;
  clearMessage: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  quantities: {},
  couponApplied: false,
  lastActionMessage: null,

  addToCart: (productId: string) => {
    const current = get().quantities[productId] ?? 0;
    set((state) => ({
      quantities: { ...state.quantities, [productId]: current + 1 },
      lastActionMessage: `Added ${productId} to cart`,
    }));
  },

  applyMysteryCoupon: () => {
    set({
      couponApplied: true,
      lastActionMessage: 'Mystery gift coupon applied! 🎁',
    });
  },

  clearMessage: () => set({ lastActionMessage: null }),
}));

export function useProductQuantity(productId: string): number {
  return useCartStore((state) => state.quantities[productId] ?? 0);
}

export function useCartTotalCount(): number {
  return useCartStore((state) =>
    Object.values(state.quantities).reduce((sum, qty) => sum + qty, 0),
  );
}
