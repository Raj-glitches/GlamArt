import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, createCODOrder } from '../slices/orderSlice';
import { applyCoupon, clearCoupon } from '../slices/cartSlice';
import PaymentOptions from '../components/payment/PaymentOptions';


// Razorpay loader
const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v3/razorpay.js';
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    }
  });
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const coupon = cart?.coupon || null;
  const discount = cart?.discount || 0;

  const auth = useSelector((state) => state.auth);
  const user = auth?.user || null;

  const orders = useSelector((state) => state.orders);
  const isLoading = orders?.isLoading || false;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    deliveryMethod: 'home_delivery',
    paymentMethod: 'razorpay',
  });
  const [couponCode, setCouponCode] = useState('');

  const finalPrice = totalPrice - (discount || 0);
  const tax = Math.round(finalPrice * 0.18);
  const shipping = finalPrice >= 500 ? 0 : 49;
  const grandTotal = finalPrice + tax + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    if (couponCode) {
      dispatch(applyCoupon({ code: couponCode, orderTotal: finalPrice }));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponCode('');
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderId, amount) => {
    try {
      // Get Razorpay key
      const keyResponse = await fetch('http://localhost:5000/api/payment/key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const keyData = await keyResponse.json();

      if (!keyData.success) {
        alert('Failed to get payment key');
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR'
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert('Failed to create payment order');
        return;
      }

      // Load Razorpay
      const Razorpay = await loadRazorpay();

      const options = {
        key: keyData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'GlamArt',
        description: 'Order Payment',
        order_id: orderData.data.orderId,
        handler: async (response) => {
          // Verify payment
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            }),
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            navigate(`/order-success/${orderId}`);
          } else {
            alert('Payment verification failed');
          }
        },
        theme: {
          color: '#ec4899'
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Handle COD payment
  const handleCODPayment = async (orderId) => {
    try {
      await dispatch(createCODOrder(orderId));
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('COD order error:', error);
      alert('Failed to place COD order. Please try again.');
    }
  };

  const handleProceed = async () => {
    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
        })),
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        itemsPrice: totalPrice,
        taxPrice: tax,
        shippingPrice: shipping,
        discountPrice: discount || 0,
        totalPrice: grandTotal,
      };

      const order = await dispatch(createOrder(orderData));

      if (order.payload) {
        if (formData.paymentMethod === 'razorpay') {
          await handleRazorpayPayment(order.payload._id, grandTotal);
        } else if (formData.paymentMethod === 'cod') {
          await handleCODPayment(order.payload._id);
        }
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    }
  };


  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProceed();
        }}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="home_delivery"
                    checked={formData.deliveryMethod === 'home_delivery'}
                    onChange={handleChange}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-medium">Home Delivery</p>
                    <p className="text-sm text-gray-500">Delivered to your doorstep</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="store_pickup"
                    checked={formData.deliveryMethod === 'store_pickup'}
                    onChange={handleChange}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-medium">Store Pickup</p>
                    <p className="text-sm text-gray-500">Pick from nearest store</p>
                  </div>
                </label>
              </div>
            </div>

            <PaymentOptions
              selectedMethod={formData.paymentMethod}
              onPaymentMethodChange={(method) => setFormData({ ...formData, paymentMethod: method })}
              isLoading={isLoading}
              onProceed={handleProceed}
            />

          </div>

          <div>
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                {!coupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="btn-outline"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-green-600 font-medium">{coupon.code}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-6"
              >
                {isLoading ? 'Processing...' : `Pay ₹${grandTotal}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
