import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  name: string;
  reference: string;
  price: number;
  mainImageUrl: string;
  discount?: number;
  slug: string;
  categorie?: { name: string; slug: string };
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Load cart state from localStorage or fallback to empty
const loadCartState = (): CartState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    if (saved) return JSON.parse(saved) as CartState;
  }
  return { items: [] };
};

const initialState: CartState = loadCartState();

// Persist helper
const saveCartState = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        item: Omit<CartItem, "quantity">;
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

    removeItem: (state, action: PayloadAction<{ _id: string }>) => {
      state.items = state.items.filter((i) => i._id !== action.payload._id);
      saveCartState(state);
    },

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

    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
