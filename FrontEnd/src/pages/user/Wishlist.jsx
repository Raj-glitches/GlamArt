import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWishlist, toggleWishlist } from '../../slices/wishlistSlice';
import { addToCart } from '../../slices/cartSlice';
import ProductCard from '../../components/ProductCard';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, isLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Wishlist</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
