import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  toast,
} from 'react-toastify';

const Orders = () => {

  /* ============================================
     STATES
  ============================================ */

  const [orders, setOrders] =
    useState([]);

  const [filteredOrders, setFilteredOrders] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [error, setError] =
    useState('');

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  /* ============================================
     TOKEN
  ============================================ */

  const getToken = () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            'user'
          )
        );

      return (
        user?.token || ''
      );

    } catch {

      return '';
    }
  };

  /* ============================================
     FETCH ORDERS
  ============================================ */

  const fetchOrders =
    async (
      showRefresh = false
    ) => {

      try {

        if (showRefresh) {

          setIsRefreshing(
            true
          );

        } else {

          setIsLoading(
            true
          );
        }

        setError('');

        const token =
          getToken();

        if (!token) {

          setError(
            'Unauthorized access'
          );

          return;
        }

        const response =
          await axios.get(
            'http://localhost:5000/api/orders',
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const safeOrders =
          Array.isArray(
            response?.data?.data
          )
            ? response.data.data.filter(Boolean)
            : [];

        setOrders(
          safeOrders
        );

        setFilteredOrders(
          safeOrders
        );

      } catch (error) {

        console.error(error);

        setError(
          error?.response?.data
            ?.message ||
            'Failed to load orders'
        );

      } finally {

        setIsLoading(
          false
        );

        setIsRefreshing(
          false
        );
      }
    };

  /* ============================================
     INITIAL LOAD
  ============================================ */

  useEffect(() => {

    fetchOrders();

  }, []);

  /* ============================================
     AUTO REFRESH
  ============================================ */

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchOrders(true);

      }, 30000);

    return () =>
      clearInterval(interval);

  }, []);

  /* ============================================
     SEARCH + FILTER
  ============================================ */

  useEffect(() => {

    let filtered =
      [...orders];

    // SEARCH
    if (search.trim()) {

      filtered =
        filtered.filter(
          (order) => {

            const orderId =
              order?._id
                ?.toLowerCase() || '';

            const customer =
              order
                ?.shippingAddress
                ?.name
                ?.toLowerCase() || '';

            return (

              orderId.includes(
                search.toLowerCase()
              ) ||

              customer.includes(
                search.toLowerCase()
              )
            );
          }
        );
    }

    // STATUS FILTER
    if (
      statusFilter !==
      'all'
    ) {

      filtered =
        filtered.filter(
          (order) =>
            order?.orderStatus ===
            statusFilter
        );
    }

    setFilteredOrders(
      filtered
    );

  }, [
    search,
    statusFilter,
    orders,
  ]);

  /* ============================================
     UPDATE STATUS
  ============================================ */

  const updateOrderStatus =
    async (
      orderId,
      status
    ) => {

      try {

        setUpdatingOrderId(
          orderId
        );

        const token =
          getToken();

        if (!token) {

          toast.error(
            'Unauthorized'
          );

          return;
        }

        await axios.put(
          `http://localhost:5000/api/orders/${orderId}/status`,
          {
            orderStatus:
              status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order?._id === orderId
              ? {
                  ...order,
                  orderStatus:
                    status,
                }
              : order
          )
        );

        toast.success(
          'Order updated successfully'
        );

      } catch (error) {

        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            'Failed to update order'
        );

      } finally {

        setUpdatingOrderId(
          null
        );
      }
    };

  /* ============================================
     STATUS COLORS
  ============================================ */

  const getStatusColor =
    (status) => {

      const colors = {

        pending:
          'bg-yellow-100 text-yellow-800',

        confirmed:
          'bg-blue-100 text-blue-800',

        processing:
          'bg-purple-100 text-purple-800',

        shipped:
          'bg-indigo-100 text-indigo-800',

        out_for_delivery:
          'bg-orange-100 text-orange-800',

        delivered:
          'bg-green-100 text-green-800',

        cancelled:
          'bg-red-100 text-red-800',
      };

      return (
        colors[status] ||
        'bg-gray-100 text-gray-700'
      );
    };

  /* ============================================
     PAYMENT COLORS
  ============================================ */

  const getPaymentColor =
    (status) => {

      return status === 'paid'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';
    };

  /* ============================================
     LOADING
  ============================================ */

  if (isLoading) {

    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  /* ============================================
     ERROR
  ============================================ */

  if (error) {

    return (

      <div className="bg-white rounded-2xl p-10 shadow-sm text-center">

        <h2 className="text-2xl font-bold text-red-500 mb-3">
          Orders Error
        </h2>

        <p className="text-gray-500 mb-6">
          {error}
        </p>

        <button
          onClick={() =>
            fetchOrders()
          }
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage customer orders
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}
          <input
            type="text"

            placeholder="Search orders..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
                  .replace(
                    /[^a-zA-Z0-9\s]/g,
                    ''
                  )
                  .slice(0, 50)
              )
            }

            className="input min-w-[250px]"
          />

          {/* FILTER */}
          <select
            value={statusFilter}

            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }

            className="input"
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="out_for_delivery">
              Out for Delivery
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

          {/* REFRESH */}
          <button
            onClick={() =>
              fetchOrders(true)
            }

            className="btn-outline"
          >

            {isRefreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl p-5 shadow-sm border">

          <p className="text-gray-500 text-sm">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {orders.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">

          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-600">

            {
              orders.filter(
                (o) =>
                  o.orderStatus ===
                  'pending'
              ).length
            }

          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">

          <p className="text-gray-500 text-sm">
            Delivered
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">

            {
              orders.filter(
                (o) =>
                  o.orderStatus ===
                  'delivered'
              ).length
            }

          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">

          <p className="text-gray-500 text-sm">
            Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2 text-primary-600">

            ₹
            {orders
              .reduce(
                (
                  acc,
                  item
                ) =>
                  acc +
                  (item.totalPrice || 0),
                0
              )
              .toLocaleString()}

          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left py-4 px-4">
                  Order ID
                </th>

                <th className="text-left py-4 px-4">
                  Customer
                </th>

                <th className="text-left py-4 px-4">
                  Payment
                </th>

                <th className="text-left py-4 px-4">
                  Total
                </th>

                <th className="text-left py-4 px-4">
                  Status
                </th>

                <th className="text-left py-4 px-4">
                  Date
                </th>

                <th className="text-left py-4 px-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredOrders.map(
                (order) => (

                  <tr
                    key={order?._id}

                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="py-4 px-4 font-mono text-sm">

                      #
                      {
                        order?._id
                          ?.slice(-8)
                      }

                    </td>

                    <td className="py-4 px-4">

                      {
                        order
                          ?.shippingAddress
                          ?.name ||
                        'Unknown'
                      }

                    </td>

                    <td className="py-4 px-4">

                      <div className="flex flex-col gap-1">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            capitalize
                            w-fit
                            ${getPaymentColor(
                              order?.paymentStatus
                            )}
                          `}
                        >

                          {
                            order?.paymentStatus ||
                            'pending'
                          }

                        </span>

                        <span className="text-xs text-gray-500 capitalize">

                          {
                            order?.paymentMethod ||
                            'COD'
                          }

                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold">

                      ₹
                      {Number(
                        order?.totalPrice || 0
                      ).toLocaleString()}

                    </td>

                    <td className="py-4 px-4">

                      <select
                        disabled={
                          updatingOrderId ===
                          order?._id
                        }

                        value={
                          order?.orderStatus ||
                          'pending'
                        }

                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }

                        className={`
                          px-3
                          py-2
                          rounded-lg
                          text-xs
                          font-medium
                          capitalize
                          border-0
                          outline-none
                          ${getStatusColor(
                            order?.orderStatus
                          )}
                        `}
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>
                    </td>

                    <td className="py-4 px-4 text-gray-500 text-sm">

                      {order?.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            'en-IN',
                            {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }
                          )
                        : 'N/A'}

                    </td>

                    <td className="py-4 px-4">

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }

                        className="text-primary-500 hover:text-primary-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (

        <div
          onClick={() =>
            setSelectedOrder(
              null
            )
          }

          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }

            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >

            <div className="p-6 border-b flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  Order Details
                </h2>

                <p className="text-gray-500 mt-1">
                  #{selectedOrder?._id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }

                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* CUSTOMER */}
              <div>

                <h3 className="font-semibold mb-3">
                  Customer Information
                </h3>

                <div className="space-y-2 text-sm text-gray-600">

                  <p>
                    <strong>Name:</strong>{' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.name
                    }
                  </p>

                  <p>
                    <strong>Phone:</strong>{' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.phone
                    }
                  </p>

                  <p>
                    <strong>Address:</strong>{' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.street
                    }
                    ,
                    {' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.city
                    }
                  </p>

                  <p>
                    <strong>State:</strong>{' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.state || 'N/A'
                    }
                  </p>

                  <p>
                    <strong>Pincode:</strong>{' '}
                    {
                      selectedOrder
                        ?.shippingAddress
                        ?.pincode || 'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div>

                <h3 className="font-semibold mb-4">
                  Order Items
                </h3>

                <div className="space-y-4">

                  {(selectedOrder
                    ?.orderItems || []
                  ).map((item, index) => (

                    <div
                      key={index}

                      className="flex items-center gap-4 border rounded-xl p-3"
                    >

                      <img
                        src={
                          item?.image ||
                          '/placeholder.png'
                        }

                        alt={
                          item?.name || 'Product'
                        }

                        onError={(e) => {
                          e.target.src =
                            '/placeholder.png';
                        }}

                        className="
                          w-16
                          h-16
                          rounded-lg
                          object-cover
                          border
                        "
                      />

                      <div className="flex-1">

                        <h4 className="font-medium">
                          {item?.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                          Qty:
                          {' '}
                          {item?.quantity}
                        </p>
                      </div>

                      <div className="font-semibold">

                        ₹
                        {Number(
                          (item?.price || 0) *
                          (item?.quantity || 0)
                        ).toLocaleString()}

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL */}
              <div className="border-t pt-5 flex justify-between items-center">

                <h3 className="text-lg font-bold">
                  Total
                </h3>

                <h3 className="text-2xl font-bold text-primary-600">

                  ₹
                  {Number(
                    selectedOrder?.totalPrice || 0
                  ).toLocaleString()}

                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;