import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders/';

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  success: false,
};

// Get user orders
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (params = {}, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(API_URL + '?' + queryString, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (orderId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(API_URL + orderId, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(API_URL, orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(API_URL + orderId + '/cancel', { reason }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  'orders/createRazorpayOrder',
  async (orderId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { orderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (paymentData, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        'http://localhost:5000/api/payment/verify',
        paymentData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// COD order
export const createCODOrder = createAsyncThunk(
  'orders/createCODOrder',
  async (orderId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        'http://localhost:5000/api/payment/cod',
        { orderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get single order
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      // Razorpay order
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.razorpayOrder = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.success = true;
      })
      // COD order
      .addCase(createCODOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.success = true;
      });
  },
});

export const { reset, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
