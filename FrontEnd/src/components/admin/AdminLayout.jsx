import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomeIcon, CubeIcon, ShoppingCartIcon, UsersIcon, TagIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Products', path: '/admin/products', icon: CubeIcon },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Categories', path: '/admin/categories', icon: TagIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="p-6">
          <Link to="/" className="text-2xl font-display font-bold">GlamArt</Link>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="mt-6 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.name}</span>
              <Link to="/" className="text-primary-500 hover:text-primary-600">
                Go to Website
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
