import { createSlice } from '@reduxjs/toolkit';

// ============================================
// SAFE LOCAL STORAGE GET
// ============================================

const getCartFromStorage = () => {
  try {
    const storedCart =
      localStorage.getItem('cart');

    if (!storedCart) {
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        coupon: null,
        discount: 0,
      };
    }

    const parsed =
      JSON.parse(storedCart);

    return {
      items: Array.isArray(
        parsed?.items
      )
        ? parsed.items
        : [],

      totalItems:
        Number(
          parsed?.totalItems
        ) || 0,

      totalPrice:
        Number(
          parsed?.totalPrice
        ) || 0,

      coupon:
        parsed?.coupon ||
        null,

      discount:
        Number(
          parsed?.discount
        ) || 0,
    };
  } catch (error) {
    console.error(
      'CART STORAGE ERROR:',
      error
    );

    localStorage.removeItem(
      'cart'
    );

    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      coupon: null,
      discount: 0,
    };
  }
};

// ============================================
// SAVE CART
// ============================================

const saveCartToStorage = (
  state
) => {
  localStorage.setItem(
    'cart',
    JSON.stringify({
      items: state.items,
      totalItems:
        state.totalItems,
      totalPrice:
        state.totalPrice,
      coupon: state.coupon,
      discount:
        state.discount,
    })
  );
};

// ============================================
// CALCULATE TOTALS
// ============================================

const calculateTotals = (
  items
) => {
  const totalItems =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  const totalPrice =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  return {
    totalItems,
    totalPrice,
  };
};

// ============================================
// INITIAL STATE
// ============================================

const cart =
  getCartFromStorage();

const initialState = {
  items: cart.items,
  totalItems:
    cart.totalItems,
  totalPrice:
    cart.totalPrice,
  coupon: cart.coupon,
  discount:
    cart.discount,
};

// ============================================
// SLICE
// ============================================

const cartSlice =
  createSlice({
    name: 'cart',

    initialState,

    reducers: {
      // ============================================
      // ADD TO CART
      // ============================================

      addToCart: (
        state,
        action
      ) => {
        const {
          product,
          quantity = 1,
        } = action.payload;

        if (
          !product ||
          !product._id
        ) {
          return;
        }

        const existingItem =
          state.items.find(
            (item) =>
              item.productId ===
              product._id
          );

        const safeQuantity =
          Math.max(
            1,
            Number(quantity)
          );

        if (existingItem) {
          existingItem.quantity +=
            safeQuantity;
        } else {
          state.items.push({
            productId:
              product._id,

            name:
              product.title ||
              'Product',

            image:
              product
                ?.images?.[0]
                ?.url || '',

            price:
              Number(
                product.sellingPrice ||
                  product.price ||
                  0
              ),

            quantity:
              safeQuantity,

            discount:
              Number(
                product.discount ||
                  0
              ),

            stock:
              Number(
                product.stock ||
                  0
              ),
          });
        }

        const totals =
          calculateTotals(
            state.items
          );

        state.totalItems =
          totals.totalItems;

        state.totalPrice =
          totals.totalPrice;

        saveCartToStorage(
          state
        );
      },

      // ============================================
      // REMOVE FROM CART
      // ============================================

      removeFromCart: (
        state,
        action
      ) => {
        state.items =
          state.items.filter(
            (item) =>
              item.productId !==
              action.payload
          );

        const totals =
          calculateTotals(
            state.items
          );

        state.totalItems =
          totals.totalItems;

        state.totalPrice =
          totals.totalPrice;

        saveCartToStorage(
          state
        );
      },

      // ============================================
      // UPDATE QUANTITY
      // ============================================

      updateQuantity: (
        state,
        action
      ) => {
        const {
          productId,
          quantity,
        } = action.payload;

        const item =
          state.items.find(
            (item) =>
              item.productId ===
              productId
          );

        if (!item) return;

        const safeQuantity =
          Number(quantity);

        if (
          safeQuantity <= 0
        ) {
          state.items =
            state.items.filter(
              (i) =>
                i.productId !==
                productId
            );
        } else {
          item.quantity =
            safeQuantity;
        }

        const totals =
          calculateTotals(
            state.items
          );

        state.totalItems =
          totals.totalItems;

        state.totalPrice =
          totals.totalPrice;

        saveCartToStorage(
          state
        );
      },

      // ============================================
      // CLEAR CART
      // ============================================

      clearCart: (
        state
      ) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.coupon = null;
        state.discount = 0;

        localStorage.removeItem(
          'cart'
        );
      },

      // ============================================
      // APPLY COUPON
      // ============================================

      applyCoupon: (
        state,
        action
      ) => {
        const {
          code,
          coupon,
          discount,
          orderTotal,
        } = action.payload;

        let finalDiscount =
          Number(discount) ||
          0;

        // Auto coupon logic fallback
        if (
          !finalDiscount &&
          code
        ) {
          const upperCode =
            code.toUpperCase();

          if (
            upperCode ===
            'SAVE10'
          ) {
            finalDiscount =
              Math.round(
                (Number(
                  orderTotal
                ) || 0) * 0.1
              );
          } else if (
            upperCode ===
            'SAVE20'
          ) {
            finalDiscount =
              Math.round(
                (Number(
                  orderTotal
                ) || 0) * 0.2
              );
          } else if (
            upperCode ===
            'FLAT100'
          ) {
            finalDiscount = 100;
          }
        }

        state.coupon =
          coupon || {
            code:
              code || '',
          };

        state.discount =
          finalDiscount;

        saveCartToStorage(
          state
        );
      },

      // ============================================
      // REMOVE COUPON
      // ============================================

      removeCoupon: (
        state
      ) => {
        state.coupon =
          null;

        state.discount = 0;

        saveCartToStorage(
          state
        );
      },

      // ============================================
      // CLEAR COUPON
      // ============================================

      clearCoupon: (
        state
      ) => {
        state.coupon =
          null;

        state.discount = 0;

        saveCartToStorage(
          state
        );
      },
    },
  });

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  clearCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;