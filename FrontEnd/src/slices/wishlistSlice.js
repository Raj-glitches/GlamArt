import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/wishlist/';

// Get wishlist from localStorage
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

const initialState = {
  items: wishlist,
  isLoading: false,
  error: null,
};

// Toggle wishlist item
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        // If not logged in, use localStorage
        const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = localWishlist.includes(productId);
        
        if (isInWishlist) {
          const newWishlist = localWishlist.filter(id => id !== productId);
          localStorage.setItem('wishlist', JSON.stringify(newWishlist));
          return { productId, isAdded: false };
        } else {
          localWishlist.push(productId);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
          return { productId, isAdded: true };
        }
      }
      
      const response = await axios.put(API_URL + productId, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return { items: response.data.data, productId, isAdded: response.data.message.includes('Added') };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get wishlist items from server
export const getWishlist = createAsyncThunk(
  'wishlist/get',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
      }
      
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data.wishlist || [];
    } catch (error) {
      return [];
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    initWishlist: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.items && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
          localStorage.setItem('wishlist', JSON.stringify(action.payload.items.map(p => p._id)));
        } else {
          // Handle local wishlist toggle
          const isInWishlist = state.items.some(
            item => item._id === action.payload.productId || item === action.payload.productId
          );
          if (action.payload.isAdded && !isInWishlist) {
            state.items.push({ _id: action.payload.productId });
          } else if (!action.payload.isAdded) {
            state.items = state.items.filter(
              item => item._id !== action.payload.productId && item !== action.payload.productId
            );
          }
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { initWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
