
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  name: string;
  ref: string;
  price: number;
  imageUrl?: string;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Load cart state from localStorage or use initialState if not available
const loadCartState = (): CartState => {
  if (typeof window !== "undefined") {
  const savedState = localStorage.getItem("cart");
  if (savedState) {
    return JSON.parse(savedState);
  }
}
  return { items: [] };
};

const initialState: CartState = loadCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ item: Omit<CartItem, 'quantity'>; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find(existingItem => existingItem._id === item._id);

      if (existingItem) {
        existingItem.quantity += quantity; // Increment existing item's quantity by the specified amount
      } else {
        state.items.push({ ...item, quantity }); // Add new item with specified quantity
      }

      saveCartState(state);
    },

    removeItem: (state, action: PayloadAction<{ _id: string }>) => {
      state.items = state.items.filter(item => item._id !== action.payload._id);
      saveCartState(state);
    },

    updateItemQuantity(
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) {
      const { _id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === _id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== _id);
        }
      }
      saveCartState(state);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    },
  },
});

// Save cart state to localStorage
const saveCartState = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

export const { addItem, clearCart, removeItem, updateItemQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
