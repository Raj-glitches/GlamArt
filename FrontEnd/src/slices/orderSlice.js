import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import axios from 'axios';

const API_URL =
  'http://localhost:5000/api/orders/';

const PAYMENT_URL =
  'http://localhost:5000/api/payment';

// ============================================
// HELPERS
// ============================================

const getUserToken = () => {
  try {
    const storedUser =
      localStorage.getItem('user');

    if (!storedUser) return null;

    const parsed =
      JSON.parse(storedUser);

    return parsed?.token || null;

  } catch (error) {

    console.error(
      'TOKEN ERROR:',
      error
    );

    return null;
  }
};

const getAuthConfig = () => {
  const token =
    getUserToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const handleError = (
  error,
  thunkAPI
) => {

  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong';

  return thunkAPI.rejectWithValue(
    message
  );
};

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  orders: [],
  currentOrder: null,

  pagination: null,

  stripeKey: null,
  razorpayKey: null,

  paymentIntent: null,

  isLoading: false,
  success: false,
  error: null,
};

// ============================================
// GET ORDERS
// ============================================

export const getOrders =
  createAsyncThunk(
    'orders/getOrders',

    async (
      params = {},
      thunkAPI
    ) => {
      try {

        const token =
          getUserToken();

        if (!token) {
          return thunkAPI.rejectWithValue(
            'Please login first'
          );
        }

        const query =
          new URLSearchParams(
            params
          ).toString();

        const response =
          await axios.get(
            `${API_URL}?${query}`,
            getAuthConfig()
          );

        return response.data;

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// GET SINGLE ORDER
// ============================================

export const getOrder =
  createAsyncThunk(
    'orders/getOrder',

    async (
      orderId,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.get(
            API_URL + orderId,
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// CREATE ORDER
// ============================================

export const createOrder =
  createAsyncThunk(
    'orders/createOrder',

    async (
      orderData,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            API_URL,
            orderData,
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// CANCEL ORDER
// ============================================

export const cancelOrder =
  createAsyncThunk(
    'orders/cancelOrder',

    async (
      {
        orderId,
        reason,
      },
      thunkAPI
    ) => {
      try {

        const response =
          await axios.put(
            `${API_URL}${orderId}/cancel`,
            { reason },
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// STRIPE
// ============================================

export const createStripePaymentIntent =
  createAsyncThunk(
    'orders/createStripePaymentIntent',

    async (
      {
        amount,
        currency = 'inr',
      },
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            `${PAYMENT_URL}/stripe/create-intent`,
            {
              amount,
              currency,
            },
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

export const verifyStripePayment =
  createAsyncThunk(
    'orders/verifyStripePayment',

    async (
      {
        paymentIntentId,
        orderId,
      },
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            `${PAYMENT_URL}/stripe/verify`,
            {
              paymentIntentId,
              orderId,
            },
            getAuthConfig()
          );

        return response.data;

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

export const getStripeKey =
  createAsyncThunk(
    'orders/getStripeKey',

    async (
      _,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.get(
            `${PAYMENT_URL}/stripe/key`,
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// RAZORPAY
// ============================================

export const createRazorpayOrder =
  createAsyncThunk(
    'orders/createRazorpayOrder',

    async (
      {
        amount,
        currency = 'INR',
      },
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            `${PAYMENT_URL}/razorpay/create`,
            {
              amount,
              currency,
            },
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

export const verifyRazorpayPayment =
  createAsyncThunk(
    'orders/verifyRazorpayPayment',

    async (
      paymentData,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            `${PAYMENT_URL}/razorpay/verify`,
            paymentData,
            getAuthConfig()
          );

        return response.data;

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

export const getRazorpayKey =
  createAsyncThunk(
    'orders/getRazorpayKey',

    async (
      _,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.get(
            `${PAYMENT_URL}/razorpay/key`,
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// COD
// ============================================

export const createCODOrder =
  createAsyncThunk(
    'orders/createCODOrder',

    async (
      orderId,
      thunkAPI
    ) => {
      try {

        const response =
          await axios.post(
            `${PAYMENT_URL}/cod`,
            { orderId },
            getAuthConfig()
          );

        return (
          response?.data?.data
        );

      } catch (error) {

        return handleError(
          error,
          thunkAPI
        );
      }
    }
  );

// ============================================
// SLICE
// ============================================

const orderSlice =
  createSlice({
    name: 'orders',

    initialState,

    reducers: {

      reset: (state) => {
        state.isLoading = false;
        state.error = null;
        state.success = false;
      },

      clearCurrentOrder: (
        state
      ) => {
        state.currentOrder =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {

      builder

        // ============================================
        // GET ORDERS
        // ============================================

        .addCase(
          getOrders.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.orders =
              action?.payload?.data || [];

            state.pagination =
              action?.payload?.pagination || null;
          }
        )

        // ============================================
        // GET ORDER
        // ============================================

        .addCase(
          getOrder.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.currentOrder =
              action.payload;
          }
        )

        // ============================================
        // CREATE ORDER
        // ============================================

        .addCase(
          createOrder.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.success =
              true;

            state.currentOrder =
              action.payload;

            state.orders.unshift(
              action.payload
            );
          }
        )

        // ============================================
        // CANCEL ORDER
        // ============================================

        .addCase(
          cancelOrder.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            const updatedOrder =
              action.payload;

            const index =
              state.orders.findIndex(
                (order) =>
                  order._id ===
                  updatedOrder._id
              );

            if (index !== -1) {

              state.orders[index] =
                updatedOrder;
            }

            if (
              state.currentOrder?._id ===
              updatedOrder._id
            ) {

              state.currentOrder =
                updatedOrder;
            }
          }
        )

        // ============================================
        // STRIPE
        // ============================================

        .addCase(
          createStripePaymentIntent.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.paymentIntent =
              action.payload;
          }
        )

        .addCase(
          getStripeKey.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.stripeKey =
              action.payload?.key || null;
          }
        )

        // ============================================
        // RAZORPAY
        // ============================================

        .addCase(
          getRazorpayKey.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.razorpayKey =
              action.payload?.key || null;
          }
        )

        // ============================================
        // COD
        // ============================================

        .addCase(
          createCODOrder.fulfilled,

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.success =
              true;

            state.currentOrder =
              action.payload;
          }
        )

        // ============================================
        // VERIFY STRIPE
        // ============================================

        .addCase(
          verifyStripePayment.fulfilled,

          (state) => {

            state.isLoading =
              false;

            state.success =
              true;
          }
        )

        // ============================================
        // VERIFY RAZORPAY
        // ============================================

        .addCase(
          verifyRazorpayPayment.fulfilled,

          (state) => {

            state.isLoading =
              false;

            state.success =
              true;
          }
        )

        // ============================================
        // COMMON PENDING
        // ============================================

        .addMatcher(

          (action) =>
            action.type.startsWith(
              'orders/'
            ) &&
            action.type.endsWith(
              '/pending'
            ),

          (state) => {

            state.isLoading =
              true;

            state.error =
              null;
          }
        )

        // ============================================
        // COMMON REJECTED
        // ============================================

        .addMatcher(

          (action) =>
            action.type.startsWith(
              'orders/'
            ) &&
            action.type.endsWith(
              '/rejected'
            ),

          (
            state,
            action
          ) => {

            state.isLoading =
              false;

            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  reset,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;