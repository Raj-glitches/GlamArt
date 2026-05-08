import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

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

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.orderItems?.slice(0, 4).map((item, index) => (
                    <img
                      key={index}
                      src={item.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                  {order.orderItems?.length > 4 && (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">+{order.orderItems.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold">₹{order.totalPrice}</p>
                </div>
                <Link to={`/orders/${order._id}`} className="btn-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
