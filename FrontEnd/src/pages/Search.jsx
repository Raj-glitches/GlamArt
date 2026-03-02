import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (query) {
      dispatch(getProducts({ search: query }));
    }
  }, [dispatch, query]);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {products.length} results for "{query}"
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
