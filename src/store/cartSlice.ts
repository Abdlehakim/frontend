/* ------------------------------------------------------------------
   src/store/cartSlice.ts
   Variant-aware cart with localStorage persistence
   - Merges by (_id + selected attributes)
   - Supports human-readable selectedNames for display (e.g., "Couleur" -> "Blanc")
------------------------------------------------------------------ */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ───────── types ───────── */
export interface CartItem {
  _id: string;
  name: string;
  reference: string;
  price: number;
  tva: number;
  mainImageUrl: string;
  discount?: number;
  slug: string;
  categorie?: { name: string; slug: string };
  subcategorie?: { name: string; slug: string };
  selected?: Record<string, string>;
  selectedNames?: Record<string, string>;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface AddItemPayload {
  item: Omit<CartItem, "quantity">;
  quantity: number;
}

/* ───────── helpers ───────── */
const loadCartState = (): CartState => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) return JSON.parse(saved) as CartState;
    } catch {
      // ignore corrupted storage
    }
  }
  return { items: [] };
};

const saveCartState = (state: CartState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch {
      // storage may be full/blocked; fail silently
    }
  }
};

/** shallow equality for attribute selections */
const sameSelection = (
  a?: Record<string, string>,
  b?: Record<string, string>
) => {
  const A = a ?? {};
  const B = b ?? {};
  const ak = Object.keys(A).sort();
  const bk = Object.keys(B).sort();
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i++) {
    const k = ak[i];
    if (k !== bk[i] || A[k] !== B[k]) return false;
  }
  return true;
};

/* ───────── slice ───────── */
const initialState: CartState = loadCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ------------------------------------ addItem (variant-aware) */
    addItem: (state, action: PayloadAction<AddItemPayload>) => {
      const { item, quantity } = action.payload;

      const existing = state.items.find(
        (i) => i._id === item._id && sameSelection(i.selected, item.selected)
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      saveCartState(state);
    },

    /* ------------------------------------ removeItem
       If `selected` provided → remove only that variant
       Else → remove all lines with this _id (back-compat) */
    removeItem: (
      state,
      action: PayloadAction<{ _id: string; selected?: Record<string, string> }>
    ) => {
      const { _id, selected } = action.payload;
      state.items = state.items.filter((i) =>
        selected
          ? !(i._id === _id && sameSelection(i.selected, selected))
          : i._id !== _id
      );
      saveCartState(state);
    },

    /* ------------------------------------ updateItemQuantity
       If `selected` provided → update that variant line
       Else → update the first matching _id (back-compat) */
    updateItemQuantity: (
      state,
      action: PayloadAction<{
        _id: string;
        quantity: number;
        selected?: Record<string, string>;
      }>
    ) => {
      const { _id, quantity, selected } = action.payload;

      const item = state.items.find((i) =>
        selected
          ? i._id === _id && sameSelection(i.selected, selected)
          : i._id === _id
      );

      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) =>
            selected
              ? !(i._id === _id && sameSelection(i.selected, selected))
              : i._id !== _id
          );
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
