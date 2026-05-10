import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const location = useLocation();

  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: HomeIcon,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: CubeIcon,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: UsersIcon,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: TagIcon,
    },
  ];

  // Better active route handling
  const isRouteActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className="
          fixed
          top-0
          left-0
          z-40
          w-64
          h-screen
          bg-gray-900
          text-white
          border-r
          border-gray-800
          overflow-y-auto
        "
      >

        {/* LOGO */}
        <div className="p-6 border-b border-gray-800">

          <Link
            to="/"
            className="text-2xl font-display font-bold tracking-wide"
          >
            GlamArt
          </Link>

          <p className="text-sm text-gray-400 mt-1">
            Admin Panel
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-4 pb-6">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active = isRouteActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  mb-2
                  transition-all
                  duration-200
                  font-medium
                  ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />

                <span className="truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="ml-64 min-h-screen flex flex-col">

        {/* HEADER */}
        <header
          className="
            sticky
            top-0
            z-30
            bg-white
            border-b
            border-gray-200
            shadow-sm
          "
        >
          <div
            className="
              px-6
              md:px-8
              py-4
              flex
              items-center
              justify-between
              gap-4
            "
          >

            {/* TITLE */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-500">
                Manage products, orders, users & categories
              </p>
            </div>

            {/* USER */}
            <div className="flex items-center gap-4">

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-gray-500">
                  Logged in as
                </span>

                <span className="font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </span>
              </div>

              <Link
                to="/"
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-primary-500
                  text-primary-500
                  hover:bg-primary-500
                  hover:text-white
                  transition
                  text-sm
                  font-medium
                "
              >
                Go to Website
              </Link>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;