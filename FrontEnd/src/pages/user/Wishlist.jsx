import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getWishlist } from '../../slices/wishlistSlice';

import ProductCard from '../../components/ProductCard';

import {
  HeartIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

const Wishlist = () => {
  const dispatch = useDispatch();

  const { items = [], isLoading = false } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // ONLY VALID FULL PRODUCTS
  const wishlistItems = (items || []).filter(
    (product) =>
      product &&
      typeof product === 'object' &&
      product._id &&
      product.title
  );

  return (
    <div className="container-custom py-8 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            My Wishlist
          </h1>

          <p className="text-gray-500 mt-2">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1
              ? 'Product'
              : 'Products'}{' '}
            saved
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <Link
            to="/shop"
            className="btn-outline inline-flex items-center gap-2"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Continue Shopping
          </Link>
        )}
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-12 h-12 text-primary-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Your Wishlist is Empty
          </h2>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Save your favorite beauty,
            skincare, fashion, and
            lifestyle products here.
          </p>

          <Link
            to="/shop"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Explore Products
          </Link>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-4
              md:gap-6
              items-stretch
            "
          >
            {wishlistItems.map((product, index) => (
              <div
                key={
                  product?._id ||
                  `wishlist-${index}`
                }
                className="w-full h-full min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* BOTTOM BUTTON */}
          <div className="mt-14 text-center">
            <Link
              to="/shop"
              className="btn-outline inline-flex items-center gap-2"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Discover More Products
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;