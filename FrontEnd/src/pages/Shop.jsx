import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, getCategories } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';
import {
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Shop = () => {
  const dispatch = useDispatch();
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products = [],
    isLoading,
    pagination = {},
    categories = [],
  } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const [sortBy, setSortBy] = useState('-createdAt');

  // Load categories once
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Load products
  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 12,
      sort: sortBy,
    };

    if (categorySlug && categories.length > 0) {
      const category = categories.find(
        (c) => c.slug === categorySlug
      );

      if (category) {
        params.category = category._id;
      }
    }

    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.brand) params.brand = filters.brand;
    if (filters.rating) params.rating = filters.rating;

    dispatch(getProducts(params));
  }, [
    dispatch,
    categorySlug,
    categories,
    searchParams,
    sortBy,
    filters,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSearchParams({});
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: '',
    });

    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setSearchParams({
      page: page.toString(),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container-custom py-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold capitalize">
            {categorySlug || 'All Products'}
          </h1>

          <p className="text-gray-500 mt-1">
            {pagination?.total || 0} products found
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden btn-outline flex items-center gap-2"
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2 w-full lg:w-56"
          >
            <option value="-createdAt">
              Newest First
            </option>

            <option value="price">
              Price: Low to High
            </option>

            <option value="-price">
              Price: High to Low
            </option>

            <option value="-ratings">
              Rating: High to Low
            </option>
          </select>
        </div>
      </div>

      <div className="flex gap-8 relative">
        {/* Mobile Overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto
            w-72 lg:w-64
            bg-white z-50 lg:z-0
            p-6 lg:p-0
            overflow-y-auto
            transition-transform duration-300
            border-r lg:border-none
            ${showFilters
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
            }
          `}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold">
              Filters
            </h2>

            <button
              onClick={() => setShowFilters(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Price */}
            <div>
              <h3 className="font-semibold mb-3">
                Price Range
              </h3>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange(
                      'minPrice',
                      e.target.value
                    )
                  }
                  className="input py-2"
                />

                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange(
                      'maxPrice',
                      e.target.value
                    )
                  }
                  className="input py-2"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold mb-3">
                Rating
              </h3>

              <div className="space-y-3">
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={
                        Number(filters.rating) === rating
                      }
                      onChange={() =>
                        handleFilterChange(
                          'rating',
                          rating
                        )
                      }
                    />

                    <div className="flex text-yellow-400">
                      {Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <span key={i}>
                          {i < rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>

                    <span className="text-sm text-gray-500">
                      & above
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear */}
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No products found
              </p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="min-w-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <div className="flex items-center justify-center mt-14 gap-2 flex-wrap">

                  {/* Previous */}
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className={`
        px-4 py-2 rounded-xl border text-sm font-medium transition-all
        ${pagination.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-primary-500 hover:text-white border-gray-300'
                      }
      `}
                  >
                    Prev
                  </button>

                  {/* First Page */}
                  {pagination.page > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 rounded-xl bg-white border hover:bg-primary-500 hover:text-white transition"
                      >
                        1
                      </button>

                      {pagination.page > 4 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}
                    </>
                  )}

                  {/* Dynamic Pages */}
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === pagination.page ||
                        page === pagination.page - 1 ||
                        page === pagination.page + 1
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
            w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300
            ${pagination.page === page
                            ? 'bg-primary-500 text-white shadow-lg scale-110'
                            : 'bg-white border hover:bg-primary-500 hover:text-white'
                          }
          `}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last Page */}
                  {pagination.page < pagination.pages - 2 && (
                    <>
                      {pagination.page < pagination.pages - 3 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}

                      <button
                        onClick={() => handlePageChange(pagination.pages)}
                        className="w-10 h-10 rounded-xl bg-white border hover:bg-primary-500 hover:text-white transition"
                      >
                        {pagination.pages}
                      </button>
                    </>
                  )}

                  {/* Next */}
                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className={`
        px-4 py-2 rounded-xl border text-sm font-medium transition-all
        ${pagination.page === pagination.pages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-primary-500 hover:text-white border-gray-300'
                      }
      `}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;