import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage with proper validation
const getCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure - ensure items is an array
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error parsing cart from localStorage:', e);
    localStorage.removeItem('cart');
  }
  return { items: [], totalItems: 0, totalPrice: 0, coupon: null, discount: 0 };
};

const cart = getCartFromStorage();

const initialState = {
  items: cart?.items || [],
  totalItems: cart?.totalItems || 0,
  totalPrice: cart?.totalPrice || 0,
  coupon: cart?.coupon || null,
  discount: cart?.discount || 0,
};

// Calculate cart totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product._id,
          name: product.title,
          image: product.images[0]?.url || '',
          price: product.sellingPrice,
          quantity,
          discount: product.discount,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
    applyCoupon: (state, action) => {
      const { coupon, discount } = action.payload;
      state.coupon = coupon;
      state.discount = discount;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, clearCoupon } = cartSlice.actions;
export default cartSlice.reducer;
