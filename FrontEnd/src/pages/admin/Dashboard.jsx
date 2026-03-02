import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders', config),
          axios.get('http://localhost:5000/api/users', config),
          axios.get('http://localhost:5000/api/products?limit=1', config),
        ]);

        const orders = ordersRes.data.data || [];
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        setStats({
          totalUsers: usersRes.data.data?.length || 0,
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsRes.data.pagination?.total || 0,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    datasets: [
      {
        data: [
          recentOrders.filter(o => o.orderStatus === 'pending').length,
          recentOrders.filter(o => o.orderStatus === 'processing').length,
          recentOrders.filter(o => o.orderStatus === 'shipped').length,
          recentOrders.filter(o => o.orderStatus === 'delivered').length,
        ],
        backgroundColor: ['#FBBF24', '#8B5CF6', '#3B82F6', '#22C55E'],
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: '#EC4899',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <Bar data={revenueData} options={{ responsive: true }} />
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="w-64 mx-auto">
            <Doughnut data={orderStatusData} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4">{order._id.slice(-8)}</td>
                  <td className="py-3 px-4">{order.shippingAddress?.name}</td>
                  <td className="py-3 px-4">₹{order.totalPrice}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
