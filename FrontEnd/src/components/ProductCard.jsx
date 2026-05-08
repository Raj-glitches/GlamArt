import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  HeartIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

import {
  HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';

import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const { items: wishlistItems = [] } = useSelector(
    (state) => state.wishlist || {}
  );

  // Prevent crashes
  if (
    !product ||
    typeof product !== 'object' ||
    !product?._id
  ) {
    return null;
  }

  // SAFE WISHLIST CHECK
  const isInWishlist = (wishlistItems || []).some(
    (item) => {
      if (!item) return false;

      // Object item
      if (typeof item === 'object') {
        return item?._id === product?._id;
      }

      // String ID item
      return item === product?._id;
    }
  );

  // ADD TO CART
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );
  };

  // TOGGLE WISHLIST
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?._id) return;

    dispatch(toggleWishlist(product._id));
  };

  // DISCOUNT
  const discountPercentage =
    product?.discount > 0
      ? Math.round(product.discount)
      : 0;

  // IMAGE
  const productImage =
    product?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400';

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border border-gray-100
        hover:border-primary-200
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        h-full
        flex
        flex-col
        min-w-0
      "
    >
      {/* IMAGE */}
      <Link
        to={`/product/${product?.slug || product?._id}`}
        className="
          relative
          block
          aspect-[4/5]
          overflow-hidden
          bg-gray-100
          flex-shrink-0
        "
      >
        <img
          src={productImage}
          alt={product?.title || 'Product'}
          loading="lazy"
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* DISCOUNT */}
        {discountPercentage > 0 && (
          <span
            className="
              absolute
              top-3
              left-3
              bg-primary-500
              text-white
              text-xs
              font-semibold
              px-2.5
              py-1
              rounded-lg
              shadow
            "
          >
            {discountPercentage}% OFF
          </span>
        )}

        {/* WISHLIST */}
        <button
          onClick={handleToggleWishlist}
          className="
            absolute
            top-3
            right-3
            p-2
            bg-white/90
            backdrop-blur
            rounded-full
            shadow-md
            hover:scale-110
            transition
          "
        >
          {isInWishlist ? (
            <HeartSolidIcon className="w-5 h-5 text-primary-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* QUICK ADD */}
        <button
          onClick={handleAddToCart}
          className="
            absolute
            bottom-3
            left-3
            right-3
            bg-black
            text-white
            py-2.5
            rounded-xl
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
            opacity-0
            translate-y-3
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-300
          "
        >
          <ShoppingBagIcon className="w-4 h-4" />
          Add to Bag
        </button>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 min-w-0">
        {/* BRAND */}
        <p
          className="
            text-xs
            uppercase
            tracking-wide
            text-gray-500
            mb-1
            truncate
          "
        >
          {product?.brand || 'Brand'}
        </p>

        {/* TITLE */}
        <Link
          to={`/product/${product?.slug || product?._id}`}
        >
          <h3
            className="
              font-semibold
              text-gray-800
              line-clamp-2
              min-h-[48px]
              hover:text-primary-500
              transition
              break-words
            "
          >
            {product?.title || 'Untitled Product'}
          </h3>
        </Link>

        {/* RATINGS */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <=
                  Math.round(product?.ratings || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-xs text-gray-500">
            ({product?.numReviews || 0})
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-lg font-bold text-gray-900">
            ₹
            {Math.round(
              product?.sellingPrice ||
                product?.price ||
                0
            )}
          </span>

          {product?.price >
            product?.sellingPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product?.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;