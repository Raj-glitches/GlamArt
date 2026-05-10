import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  createOrder,
  createCODOrder,
} from '../slices/orderSlice';

import {
  applyCoupon,
  clearCoupon,
} from '../slices/cartSlice';

import PaymentOptions from '../components/payment/PaymentOptions';

/* ============================================
   LOAD RAZORPAY SDK
============================================ */

const loadRazorpay = () => {
  return new Promise((resolve, reject) => {

    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script =
      document.createElement('script');

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () =>
      resolve(window.Razorpay);

    script.onerror = () =>
      reject(
        new Error(
          'Failed to load Razorpay SDK'
        )
      );

    document.body.appendChild(script);
  });
};

const Checkout = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const cart =
    useSelector(
      (state) => state.cart || {}
    );

  const auth =
    useSelector(
      (state) => state.auth || {}
    );

  const orders =
    useSelector(
      (state) => state.orders || {}
    );

  const items =
    cart?.items || [];

  const totalPrice =
    Number(
      cart?.totalPrice
    ) || 0;

  const coupon =
    cart?.coupon || null;

  const discount =
    Number(
      cart?.discount
    ) || 0;

  const user =
    auth?.user || null;

  const token =
    user?.token ||
    localStorage.getItem(
      'token'
    );

  const isLoading =
    orders?.isLoading === true;

  /* ============================================
     FORM DATA
  ============================================ */

  const [formData, setFormData] =
    useState({

      name:
        user?.name || '',

      email:
        user?.email || '',

      phone: '',

      street: '',

      city: '',

      state: '',

      pincode: '',

      deliveryMethod:
        'home_delivery',

      paymentMethod:
        'razorpay',
    });

  const [couponCode, setCouponCode] =
    useState('');

  const [errors, setErrors] =
    useState({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* ============================================
     PRICE CALCULATIONS
  ============================================ */

  const finalPrice =
    Math.max(
      totalPrice - discount,
      0
    );

  const tax =
    Math.round(
      finalPrice * 0.18
    );

  const shipping =
    finalPrice >= 500
      ? 0
      : 49;

  const grandTotal =
    finalPrice +
    tax +
    shipping;

  /* ============================================
     INPUT CHANGE
  ============================================ */

  const handleChange = (e) => {

    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === 'phone') {

      sanitizedValue =
        value
          .replace(/\D/g, '')
          .slice(0, 10);
    }

    if (name === 'pincode') {

      sanitizedValue =
        value
          .replace(/\D/g, '')
          .slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  /* ============================================
     VALIDATION
  ============================================ */

  const validateForm = () => {

    const newErrors = {};

    if (
      !formData.name.trim()
    ) {

      newErrors.name =
        'Full name is required';
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email
      )
    ) {

      newErrors.email =
        'Invalid email';
    }

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      !phoneRegex.test(
        formData.phone
      )
    ) {

      newErrors.phone =
        'Invalid phone number';
    }

    if (
      formData.street
        .trim()
        .length < 10
    ) {

      newErrors.street =
        'Address too short';
    }

    if (
      !formData.city.trim()
    ) {

      newErrors.city =
        'City required';
    }

    if (
      !formData.state.trim()
    ) {

      newErrors.state =
        'State required';
    }

    const pincodeRegex =
      /^[1-9][0-9]{5}$/;

    if (
      !pincodeRegex.test(
        formData.pincode
      )
    ) {

      newErrors.pincode =
        'Invalid pincode';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /* ============================================
     APPLY COUPON
  ============================================ */

  const handleApplyCoupon = () => {

    if (!couponCode.trim())
      return;

    dispatch(
      applyCoupon({

        code:
          couponCode.trim(),

        orderTotal:
          finalPrice,
      })
    );
  };

  /* ============================================
     REMOVE COUPON
  ============================================ */

  const handleRemoveCoupon = () => {

    dispatch(clearCoupon());

    setCouponCode('');
  };

  /* ============================================
     RAZORPAY PAYMENT
  ============================================ */

  const handleRazorpayPayment =
    async (orderId) => {

      try {

        await loadRazorpay();

        const keyResponse =
          await fetch(
            'http://localhost:5000/api/payment/razorpay/key',
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const keyData =
          await keyResponse.json();

        if (!keyData?.success) {

          alert(
            'Failed to load Razorpay'
          );

          return;
        }

        const paymentResponse =
          await fetch(
            'http://localhost:5000/api/payment/razorpay/create',
            {
              method: 'POST',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                amount:
                  grandTotal,

                currency:
                  'INR',
              }),
            }
          );

        const paymentData =
          await paymentResponse.json();

        if (
          !paymentData?.success
        ) {

          alert(
            paymentData?.message
          );

          return;
        }

        const options = {

          key:
            keyData?.data?.key,

          amount:
            paymentData?.data?.amount,

          currency:
            paymentData?.data?.currency,

          name:
            'GlamArt',

          description:
            'Beauty Order',

          order_id:
            paymentData?.data?.orderId,

          prefill: {

            name:
              formData.name,

            email:
              formData.email,

            contact:
              formData.phone,
          },

          theme: {
            color:
              '#ec4899',
          },

          handler:
            async function (
              response
            ) {

              const verifyResponse =
                await fetch(
                  'http://localhost:5000/api/payment/razorpay/verify',
                  {
                    method:
                      'POST',

                    headers: {

                      'Content-Type':
                        'application/json',

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,

                      orderId,
                    }),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (
                verifyData?.success
              ) {

                navigate(
                  `/order-success/${orderId}`
                );

              } else {

                alert(
                  verifyData?.message
                );
              }
            },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.error(error);

        alert(
          'Razorpay payment failed'
        );
      }
    };

  /* ============================================
     STRIPE PAYMENT
  ============================================ */

  const handleStripePayment =
    async (orderId) => {

      try {

        const stripeResponse =
          await fetch(
            'http://localhost:5000/api/payment/stripe/create-intent',
            {
              method: 'POST',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                amount:
                  grandTotal,

                currency:
                  'inr',
              }),
            }
          );

        const stripeData =
          await stripeResponse.json();

        if (
          !stripeData?.success
        ) {

          alert(
            stripeData?.message
          );

          return;
        }

        const verifyResponse =
          await fetch(
            'http://localhost:5000/api/payment/stripe/verify',
            {
              method: 'POST',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                paymentIntentId:
                  stripeData?.data?.paymentIntentId,

                orderId,
              }),
            }
          );

        const verifyData =
          await verifyResponse.json();

        if (
          verifyData?.success
        ) {

          navigate(
            `/order-success/${orderId}`
          );

        } else {

          alert(
            verifyData?.message
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          'Stripe payment failed'
        );
      }
    };

  /* ============================================
     COD PAYMENT
  ============================================ */

  const handleCODPayment =
    async (orderId) => {

      try {

        const result =
          await dispatch(
            createCODOrder(
              orderId
            )
          );

        if (
          result?.payload
        ) {

          navigate(
            `/order-success/${orderId}`
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          'COD failed'
        );
      }
    };

  /* ============================================
     PLACE ORDER
  ============================================ */

  const handleProceed =
    async () => {

      if (isSubmitting)
        return;

      try {

        const isValid =
          validateForm();

        if (!isValid)
          return;

        if (!token) {

          alert(
            'Please login again'
          );

          navigate('/login');

          return;
        }

        setIsSubmitting(true);

        const orderData = {

          orderItems:
            items.map(
              (item) => ({

                product:
                  item?.productId ||
                  item?._id,

                name:
                  item?.name,

                image:
                  item?.image,

                price:
                  item?.price,

                quantity:
                  item?.quantity,

                discount:
                  item?.discount || 0,
              })
            ),

          shippingAddress: {

            name:
              formData.name,

            street:
              formData.street,

            city:
              formData.city,

            state:
              formData.state,

            pincode:
              formData.pincode,

            phone:
              formData.phone,
          },

          deliveryMethod:
            formData.deliveryMethod,

          paymentMethod:
            formData.paymentMethod,

          itemsPrice:
            totalPrice,

          taxPrice:
            tax,

          shippingPrice:
            shipping,

          discountPrice:
            discount,

          totalPrice:
            grandTotal,
        };

        const result =
          await dispatch(
            createOrder(
              orderData
            )
          );

        if (
          !result?.payload
        ) {

          alert(
            'Order creation failed'
          );

          return;
        }

        const orderId =
          result.payload._id;

        if (
          formData.paymentMethod ===
          'razorpay'
        ) {

          await handleRazorpayPayment(
            orderId
          );

        } else if (
          formData.paymentMethod ===
          'stripe'
        ) {

          await handleStripePayment(
            orderId
          );

        } else {

          await handleCODPayment(
            orderId
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          'Checkout failed'
        );

      } finally {

        setIsSubmitting(false);
      }
    };

  /* ============================================
     EMPTY CART
  ============================================ */

  if (items.length === 0) {

    navigate('/cart');

    return null;
  }

  return (
    <div className="container-custom py-8">

      <h1 className="text-3xl font-display font-bold mb-8">
        Checkout
      </h1>

      <form
        onSubmit={(e) => {

          e.preventDefault();

          handleProceed();
        }}
      >

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* CONTACT */}
            <div className="bg-white rounded-xl shadow-card p-6">

              <h2 className="text-xl font-bold mb-4">
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />

                  {
                    errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </p>
                    )
                  }
                </div>

                <div>
                  <label className="label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />

                  {
                    errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )
                  }
                </div>

                <div className="md:col-span-2">

                  <label className="label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />

                  {
                    errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )
                  }
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white rounded-xl shadow-card p-6">

              <h2 className="text-xl font-bold mb-4">
                Delivery Address
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="label">
                    Street Address
                  </label>

                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input"
                  />

                  {
                    errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street}
                      </p>
                    )
                  }
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="label">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                    />

                    {
                      errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )
                    }
                  </div>

                  <div>
                    <label className="label">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input"
                    />

                    {
                      errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )
                    }
                  </div>
                </div>

                <div>
                  <label className="label">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input"
                  />

                  {
                    errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )
                  }
                </div>
              </div>
            </div>

            {/* PAYMENT OPTIONS */}
            <PaymentOptions
              selectedMethod={
                formData.paymentMethod
              }

              onPaymentMethodChange={(
                method
              ) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    paymentMethod:
                      method,
                  })
                )
              }

              isLoading={
                isLoading ||
                isSubmitting
              }

              onProceed={
                handleProceed
              }
            />
          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">

                {items.map(
                  (item) => (

                    <div
                      key={
                        item?.productId
                      }
                      className="flex gap-3"
                    >

                      <img
                        src={
                          item?.image
                        }

                        alt={
                          item?.name
                        }

                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">

                        <p className="font-medium text-sm line-clamp-1">
                          {item?.name}
                        </p>

                        <p className="text-gray-500 text-sm">
                          Qty:
                          {' '}
                          {item?.quantity}
                        </p>
                      </div>

                      <p className="font-medium">
                        ₹
                        {
                          item?.price *
                          item?.quantity
                        }
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* COUPON */}
              <div className="border-t pt-4 mb-4">

                {!coupon ? (

                  <div className="flex gap-2">

                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(
                          e.target.value
                        )
                      }
                      className="input flex-1"
                    />

                    <button
                      type="button"
                      onClick={
                        handleApplyCoupon
                      }
                      className="btn-outline"
                    >
                      Apply
                    </button>
                  </div>

                ) : (

                  <div className="flex justify-between items-center bg-green-50 p-2 rounded">

                    <span className="text-green-600 font-medium">
                      {coupon?.code}
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleRemoveCoupon
                      }
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* PRICE DETAILS */}
              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                {discount > 0 && (

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>
                    {
                      shipping === 0
                        ? 'Free'
                        : `₹${shipping}`
                    }
                  </span>
                </div>
              </div>

              {/* TOTAL */}
              <div className="border-t mt-4 pt-4">

                <div className="flex justify-between font-bold text-lg">

                  <span>Total</span>

                  <span>
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;