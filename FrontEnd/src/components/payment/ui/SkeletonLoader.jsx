import { motion } from 'framer-motion';

/**
 * Reusable Skeleton Loader Components
 */

const SkeletonProductCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="animate-pulse"
  >
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
      
      {/* Product Info Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="flex items-center space-x-4 pt-2">
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
          <div className="h-10 bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl w-28 flex items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const SkeletonGrid = ({ columns = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{columns} xl:grid-cols-5 gap-6">
    {[...Array(12)].map((_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

const SkeletonList = ({ items = 5 }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-xl">
        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const SkeletonHero = () => (
  <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
);

const SkeletonNavbar = () => (
  <div className="bg-white shadow-sm border-b animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between h-16">
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
        <div className="flex space-x-4">
          <div className="w-20 h-6 bg-gray-200 rounded"></div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export { 
  SkeletonProductCard, 
  SkeletonGrid, 
  SkeletonList, 
  SkeletonHero, 
  SkeletonNavbar 
};

