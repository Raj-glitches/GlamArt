import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon, ShoppingBagIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { getCategories } from '../../slices/productSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.products);
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const categoryLinks = [
    { name: 'Makeup', slug: 'makeup', subcategories: ['Lipstick', 'Foundation', 'Eyeshadow', 'Mascara'] },
    { name: 'Skincare', slug: 'skincare', subcategories: ['Moisturizers', 'Serums', 'Cleansers', 'Sunscreen'] },
    { name: 'Haircare', slug: 'haircare', subcategories: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Masks'] },
    { name: 'Fashion', slug: 'fashion', subcategories: ['Sarees', 'Kurtas', 'Dresses', 'Tops'] },
    { name: 'Accessories', slug: 'accessories', subcategories: ['Jewelry', 'Bags', 'Watches', 'Sunglasses'] },
    { name: 'Fragrance', slug: 'fragrance', subcategories: ['Perfumes', 'Deodorants', 'Body Mist'] },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      {/* Top Bar */}
      <div className="bg-primary-500 text-white py-2 text-sm">
        <div className="container-custom flex justify-between items-center">
          <p>Free shipping on orders above ₹500 | Get 10% off on first order</p>
          <div className="flex items-center gap-4">
            <Link to="/stores" className="hover:text-primary-100">Store Locator</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-primary-100">Admin Panel</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-display font-bold text-primary-600">
              GlamArt
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands & more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-500 hover:text-primary-600"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:text-primary-500">
              <HeartIcon className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-1 p-2 hover:text-primary-500">
                  <UserIcon className="w-6 h-6" />
                </MenuButton>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                        >
                          My Profile
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/orders"
                          className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                        >
                          My Orders
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/wishlist"
                          className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                        >
                          Wishlist
                        </Link>
                      )}
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem>
                        {({ focus }) => (
                          <Link
                            to="/admin"
                            className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                          >
                            Admin Panel
                          </Link>
                        )}
                      </MenuItem>
                    )}
                  </MenuItems>
                </Transition>
              </Menu>
            ) : (
              <Link to="/login" className="p-2 hover:text-primary-500">
                <UserIcon className="w-6 h-6" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:text-primary-500">
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden lg:block border-t border-gray-200">
        <div className="container-custom">
          <ul className="flex items-center gap-8 py-3">
            <li>
              <Link to="/" className="font-medium hover:text-primary-500">
                Home
              </Link>
            </li>
            {categoryLinks.map((category) => (
              <li key={category.slug} className="relative group">
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center gap-1 font-medium hover:text-primary-500">
                    {category.name}
                    <ChevronDownIcon className="w-4 h-4" />
                  </MenuButton>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                      {category.subcategories.map((sub) => (
                        <MenuItem key={sub}>
                          {({ focus }) => (
                            <Link
                              to={`/shop/${category.slug}?subcategory=${encodeURIComponent(sub)}`}
                              className={`block px-4 py-2 ${focus ? 'bg-gray-100' : ''}`}
                            >
                              {sub}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </li>
            ))}
            <li>
              <Link to="/shop" className="font-medium hover:text-primary-500">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/stores" className="font-medium hover:text-primary-500">
                Stores
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Transition
        show={isMobileMenuOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="lg:hidden bg-white border-t border-gray-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Mobile Nav */}
          <nav className="px-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  All Products
                </Link>
              </li>
              {categoryLinks.map((category) => (
                <li key={category.slug}>
                  <details className="group">
                    <summary className="flex items-center justify-between py-2 font-medium cursor-pointer list-none">
                      {category.name}
                      <ChevronDownIcon className="w-4 h-4 group-open:rotate-180" />
                    </summary>
                    <ul className="pl-4 mt-1 space-y-1">
                      {category.subcategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            to={`/shop/${category.slug}?subcategory=${encodeURIComponent(sub)}`}
                            className="block py-1 text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
              <li>
                <Link to="/stores" className="block py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Stores
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
