'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number, size?: string, color?: string) => void;
  updateQuantity: (itemId: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => 
              i.id === item.id && 
              i.size === item.size && 
              i.color === item.color
          );

          if (existingItemIndex !== -1) {
            // If item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          } else {
            // If item doesn't exist, add it
            return { items: [...state.items, item] };
          }
        }),
      removeItem: (itemId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => 
              !(i.id === itemId && i.size === size && i.color === color)
          ),
        })),
      updateQuantity: (itemId, quantity, size, color) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (
              item.id === itemId && 
              item.size === size && 
              item.color === color
            ) {
              return { ...item, quantity };
            }
            return item;
          });
          return { items: updatedItems };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
