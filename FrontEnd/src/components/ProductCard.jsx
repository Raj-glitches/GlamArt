import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some(
    (item) => item._id === product._id || item === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product._id));
  };

  const discountPercentage = product.discount > 0 
    ? Math.round(product.discount) 
    : 0;

  return (
    <div className="card group">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-5 h-5 text-primary-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 left-2 right-2 bg-gray-900 text-white py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <ShoppingBagIcon className="w-4 h-4" />
          Add to Bag
        </button>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        
        {/* Title */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-primary-500">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= Math.round(product.ratings || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-lg">₹{Math.round(product.sellingPrice)}</span>
          {product.price > product.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
