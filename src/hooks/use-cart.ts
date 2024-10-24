import { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
   product: Product;
};

type CartState = {
   items: CartItem[];
   addItem: (product: Product) => void;
   removeItem: (productId: string) => void;
   clearCart: () => void;
};

export const useCart = create<CartState>()(
   persist(
      (set) => ({
         items: [],
         addItem: (product) =>
            set((state) => {
               if (state.items.some((item) => item.product.id === product.id)) {
                  // TODO: Add a toast notification here if the product is already in the cart
                  return state;
               }
               return {
                  items: [...state.items, { product }],
               };
            }),

         removeItem: (id) =>
            set((state) => ({
               items: state.items.filter((item) => item.product.id !== id),
            })),

         clearCart: () => set({ items: [] }),
      }),
      {
         name: "cart-storage",
         storage: createJSONStorage(() => localStorage),
      }
   )
);
