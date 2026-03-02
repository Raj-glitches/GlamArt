import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, getCategories } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Shop = () => {
  const dispatch = useDispatch();
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, isLoading, pagination, categories } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 12,
      sort: sortBy,
    };

    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        params.category = category._id;
      }
    }

    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.brand) params.brand = filters.brand;
    if (filters.rating) params.rating = filters.rating;

    dispatch(getProducts(params));
  }, [dispatch, categorySlug, searchParams, sortBy, filters, categories]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSearchParams({});
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: '',
    });
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold capitalize">
            {categorySlug || 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">
            {pagination.total} products found
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 lg:hidden btn-outline"
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2 w-48"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings">Rating: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className={`hidden lg:block w-64 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white p-6 lg:relative lg:p-0' : ''}`}>
          {showFilters && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input py-2 w-full"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="text-primary-500"
                    />
                    <span className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < rating ? '★' : '☆'}</span>
                      ))}
                    </span>
                    <span className="text-gray-500">& above</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg ${
                        pagination.page === page
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
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
