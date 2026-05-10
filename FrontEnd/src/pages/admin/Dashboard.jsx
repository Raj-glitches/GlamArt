import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import {
  Bar,
  Doughnut,
} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // SAFE TOKEN
  const getToken = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem('user')
      );

      return user?.token || '';
    } catch {
      return '';
    }
  };

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {

    try {
      setIsLoading(true);

      setError('');

      const token = getToken();

      if (!token) {
        setError('Unauthorized access');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        ordersRes,
        usersRes,
        productsRes,
      ] = await Promise.all([
        axios.get(
          'http://localhost:5000/api/orders',
          config
        ),

        axios.get(
          'http://localhost:5000/api/users',
          config
        ),

        axios.get(
          'http://localhost:5000/api/products?limit=1',
          config
        ),
      ]);

      // SAFE DATA
      const orders = Array.isArray(
        ordersRes?.data?.data
      )
        ? ordersRes.data.data.filter(Boolean)
        : [];

      const users = Array.isArray(
        usersRes?.data?.data
      )
        ? usersRes.data.data
        : [];

      const totalRevenue = orders.reduce(
        (sum, order) =>
          sum +
          Number(order?.totalPrice || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue,
        totalProducts:
          productsRes?.data?.pagination
            ?.total || 0,
      });

      setRecentOrders(
        orders.slice(0, 5)
      );

    } catch (error) {

      console.error(error);

      setError(
        error?.response?.data?.message ||
          'Failed to load dashboard'
      );

    } finally {

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ORDER STATUS COUNTS
  const orderCounts = useMemo(() => {

    return {
      pending:
        recentOrders.filter(
          (o) =>
            o?.orderStatus === 'pending'
        ).length,

      processing:
        recentOrders.filter(
          (o) =>
            o?.orderStatus ===
            'processing'
        ).length,

      shipped:
        recentOrders.filter(
          (o) =>
            o?.orderStatus === 'shipped'
        ).length,

      delivered:
        recentOrders.filter(
          (o) =>
            o?.orderStatus ===
            'delivered'
        ).length,
    };

  }, [recentOrders]);

  // DOUGHNUT DATA
  const orderStatusData = useMemo(
    () => ({
      labels: [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
      ],

      datasets: [
        {
          data: [
            orderCounts.pending,
            orderCounts.processing,
            orderCounts.shipped,
            orderCounts.delivered,
          ],

          backgroundColor: [
            '#FBBF24',
            '#8B5CF6',
            '#3B82F6',
            '#22C55E',
          ],

          borderWidth: 0,
        },
      ],
    }),
    [orderCounts]
  );

  // REVENUE DATA
  const revenueData = useMemo(
    () => ({
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ],

      datasets: [
        {
          label: 'Revenue',

          data: [
            12000,
            19000,
            15000,
            25000,
            22000,
            30000,
          ],

          backgroundColor: '#EC4899',

          borderRadius: 8,
        },
      ],
    }),
    []
  );

  // LOADING
  if (isLoading) {

    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  // ERROR
  if (error) {

    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

        <h2 className="text-2xl font-bold text-red-500 mb-3">
          Dashboard Error
        </h2>

        <p className="text-gray-500 mb-6">
          {error}
        </p>

        <button
          onClick={fetchDashboard}
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor your store performance
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="btn-outline"
        >
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {/* ORDERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            {stats.totalOrders}
          </h2>
        </div>

        {/* REVENUE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            ₹
            {stats.totalRevenue.toLocaleString()}
          </h2>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Total Products
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            {stats.totalProducts}
          </h2>
        </div>

        {/* USERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Total Users
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            {stats.totalUsers}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid xl:grid-cols-2 gap-6 mb-8">

        {/* BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-semibold mb-5">
            Revenue Overview
          </h2>

          <Bar
            data={revenueData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* DOUGHNUT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-semibold mb-5">
            Order Status
          </h2>

          <div className="max-w-[320px] mx-auto">
            <Doughnut
              data={orderStatusData}
            />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-semibold">
            Recent Orders
          </h2>

          <span className="text-sm text-gray-500">
            Latest 5 orders
          </span>
        </div>

        {recentOrders.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b border-gray-100">

                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Order ID
                  </th>

                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Customer
                  </th>

                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Total
                  </th>

                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>

                {recentOrders.map(
                  (order) => (

                    <tr
                      key={order?._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >

                      <td className="py-4 px-4 font-medium">
                        #
                        {order?._id
                          ?.slice(-8) ||
                          'N/A'}
                      </td>

                      <td className="py-4 px-4">
                        {order
                          ?.shippingAddress
                          ?.name ||
                          'Unknown'}
                      </td>

                      <td className="py-4 px-4 font-semibold">
                        ₹
                        {Number(
                          order?.totalPrice || 0
                        ).toLocaleString()}
                      </td>

                      <td className="py-4 px-4">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            capitalize

                            ${
                              order?.orderStatus ===
                              'delivered'
                                ? 'bg-green-100 text-green-700'

                                : order?.orderStatus ===
                                  'cancelled'
                                ? 'bg-red-100 text-red-700'

                                : order?.orderStatus ===
                                  'processing'
                                ? 'bg-purple-100 text-purple-700'

                                : order?.orderStatus ===
                                  'shipped'
                                ? 'bg-blue-100 text-blue-700'

                                : 'bg-yellow-100 text-yellow-700'
                            }
                          `}
                        >
                          {order?.orderStatus ||
                            'pending'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-500">
                        {order?.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;