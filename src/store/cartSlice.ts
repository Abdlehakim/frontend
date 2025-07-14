/* ------------------------------------------------------------------
   src/store/cartSlice.ts
------------------------------------------------------------------ */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ───────── types ───────── */
export interface CartItem {
  _id: string;
  name: string;
  reference: string;
  price: number;
  tva: number;                                  // ← TVA now mandatory
  mainImageUrl: string;
  discount?: number;
  slug: string;
  categorie?:    { name: string; slug: string };
  subcategorie?: { name: string; slug: string };
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

/* ───────── helpers ───────── */
const loadCartState = (): CartState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    if (saved) return JSON.parse(saved) as CartState;
  }
  return { items: [] };
};

const saveCartState = (state: CartState) =>
  localStorage.setItem("cart", JSON.stringify(state));

/* ───────── slice ───────── */
const initialState: CartState = loadCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ------------------------------------ addItem */
    addItem: (
      state,
      action: PayloadAction<{
        item: Omit<CartItem, "quantity">; // already contains tva
        quantity: number;
      }>
    ) => {
      const { item, quantity } = action.payload;
      const existing = state.items.find((i) => i._id === item._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      saveCartState(state);
    },

    /* ------------------------------------ removeItem */
    removeItem: (state, action: PayloadAction<{ _id: string }>) => {
      state.items = state.items.filter((i) => i._id !== action.payload._id);
      saveCartState(state);
    },

    /* ------------------------------------ updateItemQuantity */
    updateItemQuantity: (
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === _id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== _id);
        }
        saveCartState(state);
      }
    },

    /* ------------------------------------ clearCart */
    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
