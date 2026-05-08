import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOrder } from '../../slices/orderSlice';

const OrderDetail = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrder(orderId));
  }, [dispatch, orderId]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center">
          <div className="spinner w-12 h-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Order Details</h1>
        <Link to="/orders" className="btn-outline">Back to Orders</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {currentOrder.orderItems?.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link to={`/product/${item.product}`} className="font-medium hover:text-primary-500">
                      {item.name}
                    </Link>
                    <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <p className="font-medium">{currentOrder.shippingAddress?.name}</p>
            <p className="text-gray-600">{currentOrder.shippingAddress?.street}</p>
            <p className="text-gray-600">
              {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.pincode}
            </p>
            <p className="text-gray-500">{currentOrder.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{currentOrder._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span>{new Date(currentOrder.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(currentOrder.orderStatus)}`}>
                  {currentOrder.orderStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="capitalize">{currentOrder.paymentStatus}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{currentOrder.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{currentOrder.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{currentOrder.taxPrice}</span>
              </div>
              {currentOrder.discountPrice > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{currentOrder.discountPrice}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{currentOrder.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
