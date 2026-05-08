import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOrder, clearCurrentOrder } from '../slices/orderSlice';
import { clearCart } from '../slices/cartSlice';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrder(orderId));
    dispatch(clearCart());
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, orderId]);

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-2">Thank you for your order.</p>
        <p className="text-gray-500 mb-8">Order ID: {orderId}</p>

        {currentOrder && (
          <div className="bg-white rounded-xl shadow-card p-6 text-left mb-8">
            <h2 className="font-semibold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span>₹{currentOrder.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>₹{currentOrder.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{currentOrder.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{currentOrder.totalPrice}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryMethod === 'store_pickup'
                  ? 'Your order will be available for pickup at the selected store.'
                  : `Delivery to: ${currentOrder.shippingAddress?.street}, ${currentOrder.shippingAddress?.city}, ${currentOrder.shippingAddress?.pincode}`}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link to="/orders" className="btn-primary">
            View Orders
          </Link>
          <Link to="/shop" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
