import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/wishlist/';

// Safe localStorage parser
const getWishlistFromStorage = () => {
  try {
    const stored = localStorage.getItem('wishlist');

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error('Wishlist parse error:', error);
    localStorage.removeItem('wishlist');
    return [];
  }
};

const initialState = {
  items: getWishlistFromStorage(),
  isLoading: false,
  error: null,
};

// Toggle wishlist
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // LOCAL WISHLIST
      if (!user?.token) {
        const localWishlist = getWishlistFromStorage();

        const exists = localWishlist.some((item) => {
          if (!item) return false;

          if (typeof item === 'object') {
            return item?._id === productId;
          }

          return item === productId;
        });

        let updatedWishlist = [];

        if (exists) {
          updatedWishlist = localWishlist.filter((item) => {
            if (!item) return false;

            if (typeof item === 'object') {
              return item?._id !== productId;
            }

            return item !== productId;
          });

          localStorage.setItem(
            'wishlist',
            JSON.stringify(updatedWishlist)
          );

          return {
            productId,
            isAdded: false,
          };
        }

        updatedWishlist = [...localWishlist, productId];

        localStorage.setItem(
          'wishlist',
          JSON.stringify(updatedWishlist)
        );

        return {
          productId,
          isAdded: true,
        };
      }

      // SERVER WISHLIST
      const response = await axios.put(
        API_URL + productId,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      return {
        items: response.data.data || [],
        productId,
        isAdded:
          response.data.message?.includes('Added'),
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        'Wishlist error';

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/get',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // LOCAL
      if (!user?.token) {
        return getWishlistFromStorage();
      }

      // SERVER
      const response = await axios.get(
        'http://localhost:5000/api/auth/me',
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      return (
        response?.data?.data?.wishlist?.filter(Boolean) || []
      );
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
      state.items = Array.isArray(action.payload)
        ? action.payload.filter(Boolean)
        : [];
    },

    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },

  extraReducers: (builder) => {
    builder

      // TOGGLE PENDING
      .addCase(toggleWishlist.pending, (state) => {
        state.isLoading = true;
      })

      // TOGGLE SUCCESS
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.isLoading = false;

        // SERVER RESPONSE
        if (
          action.payload.items &&
          Array.isArray(action.payload.items)
        ) {
          state.items = action.payload.items.filter(Boolean);

          localStorage.setItem(
            'wishlist',
            JSON.stringify(
              state.items.map((item) =>
                typeof item === 'object'
                  ? item._id
                  : item
              )
            )
          );

          return;
        }

        // LOCAL RESPONSE
        const exists = state.items.some((item) => {
          if (!item) return false;

          if (typeof item === 'object') {
            return (
              item?._id === action.payload.productId
            );
          }

          return item === action.payload.productId;
        });

        // ADD
        if (action.payload.isAdded && !exists) {
          state.items.push({
            _id: action.payload.productId,
          });
        }

        // REMOVE
        if (!action.payload.isAdded) {
          state.items = state.items.filter((item) => {
            if (!item) return false;

            if (typeof item === 'object') {
              return (
                item?._id !== action.payload.productId
              );
            }

            return item !== action.payload.productId;
          });
        }
      })

      // TOGGLE FAILED
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // GET SUCCESS
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload)
          ? action.payload.filter(Boolean)
          : [];
      });
  },
});

export const {
  initWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;