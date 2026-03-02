import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getFeaturedProducts, getCategories } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, categories } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const heroSlides = [
    {
      id: 1,
      title: 'Discover Your Beauty',
      subtitle: 'Shop the latest in makeup, skincare & more',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600',
      cta: 'Shop Now',
      link: '/shop',
    },
    {
      id: 2,
      title: 'Summer Collection',
      subtitle: 'Get glowing skin with our summer essentials',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600',
      cta: 'Explore',
      link: '/shop?category=skincare',
    },
    {
      id: 3,
      title: 'Fashion Forward',
      subtitle: 'Trendy accessories for every occasion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600',
      cta: 'Browse',
      link: '/shop?category=fashion',
    },
  ];

  const features = [
    { id: 1, title: 'Free Shipping', desc: 'On orders above ₹500', icon: '📦' },
    { id: 2, title: 'Easy Returns', desc: '30-day return policy', icon: '↩️' },
    { id: 3, title: 'Secure Payment', desc: '100% secure checkout', icon: '🔒' },
    { id: 4, title: 'Store Pickup', desc: 'Click & Collect available', icon: '🏪' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img
          src={heroSlides[0].image}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-fade-in">
                {heroSlides[0].title}
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200">
                {heroSlides[0].subtitle}
              </p>
              <Link to={heroSlides[0].link} className="btn-primary">
                {heroSlides[0].cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-primary-50 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/shop/${category.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={category.image?.url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-center">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-display font-bold">Featured Products</h2>
            <Link to="/shop" className="text-primary-500 hover:text-primary-600 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
                alt="Skincare"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Skincare Essentials</h3>
                  <p className="mb-4">Get radiant skin with our curated collection</p>
                  <Link to="/shop/skincare" className="btn bg-white text-gray-900 hover:bg-gray-100">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800"
                alt="Accessories"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Fashion Accessories</h3>
                  <p className="mb-4">Complete your look with our accessories</p>
                  <Link to="/shop/accessories" className="btn bg-white text-gray-900 hover:bg-gray-100">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl font-display font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 max-w-xl mx-auto">
            Get exclusive offers, beauty tips, and updates on the latest trends directly in your inbox.
          </p>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button type="submit" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
