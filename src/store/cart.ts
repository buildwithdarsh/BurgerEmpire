import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TZ } from '@/lib/tz';

export interface CartAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  classicName: string;
  healthyName: string;
  classicPrice: number;
  healthyPrice: number;
  quantity: number;
  mode: 'classic' | 'healthy';
  variationId?: string;
  variationName?: string;
  variationPrice?: number;
  addons: CartAddon[];
  image?: string;
  healthyImage?: string;
  diet: string;
  inStock: boolean;
}

export interface AddToCartInput {
  menuItemId: string;
  quantity: number;
  mode: 'classic' | 'healthy';
  classicName: string;
  healthyName: string;
  classicPrice: number;
  healthyPrice: number;
  image?: string;
  healthyImage?: string;
  diet: string;
  inStock: boolean;
  variationId?: string;
  variationName?: string;
  variationPrice?: number;
  addons: { addonId: string; name: string; price: number; quantity: number }[];
}

let nextLocalId = 1;
function generateLocalId(): string {
  return `local_${Date.now()}_${nextLocalId++}`;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  addItem: (data: AddToCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setOpen: (open: boolean) => void;

  totalItems: () => number;
  subtotal: (mode: 'classic' | 'healthy') => number;

  syncToServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      addItem: (data) => {
        const existing = get().items.find(
          (i) =>
            i.menuItemId === data.menuItemId &&
            i.mode === data.mode &&
            i.variationId === data.variationId &&
            JSON.stringify(i.addons.map((a) => ({ addonId: a.addonId, quantity: a.quantity })).sort((a, b) => a.addonId.localeCompare(b.addonId))) ===
            JSON.stringify(data.addons.map((a) => ({ addonId: a.addonId, quantity: a.quantity })).sort((a, b) => a.addonId.localeCompare(b.addonId)))
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + data.quantity } : i
            ),
          });
        } else {
          const newItem: CartItem = {
            id: generateLocalId(),
            menuItemId: data.menuItemId,
            classicName: data.classicName,
            healthyName: data.healthyName,
            classicPrice: data.classicPrice,
            healthyPrice: data.healthyPrice,
            quantity: data.quantity,
            mode: data.mode,
            variationId: data.variationId,
            variationName: data.variationName,
            variationPrice: data.variationPrice,
            addons: data.addons,
            image: data.image,
            healthyImage: data.healthyImage,
            diet: data.diet,
            inStock: data.inStock,
          };
          set({ items: [...get().items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(id);
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: (mode) => {
        return get().items.reduce((sum, item) => {
          const basePrice =
            item.variationPrice !== undefined
              ? item.variationPrice
              : mode === 'healthy'
                ? item.healthyPrice
                : item.classicPrice;
          const addonTotal = item.addons.reduce(
            (a, addon) => a + addon.price * addon.quantity,
            0
          );
          return sum + (basePrice + addonTotal) * item.quantity;
        }, 0);
      },

      syncToServer: async () => {
        const items = get().items;
        if (!items.length) return;
        set({ isLoading: true });
        try {
          // Clear server cart first, then push all local items
          await TZ.storefront.cart.clear().catch(() => {});
          for (const item of items) {
            await TZ.storefront.cart.addItem({
              itemId: item.menuItemId,
              sizeVariationId: item.variationId,
              quantity: item.quantity,
              variantType: item.mode,
              options: item.addons.map((a) => ({ optionId: a.addonId, quantity: a.quantity })),
            });
          }
        } catch (err) {
          console.error('Failed to sync cart to server:', err);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'bb-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
