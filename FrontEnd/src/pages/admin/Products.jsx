import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../slices/productSlice';
import { toast } from 'react-toastify';

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, pagination } = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
  });

  useEffect(() => {
    dispatch(getProducts({ limit: 50 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
      toast.success('Product deleted');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct._id, productData: formData }));
      toast.success('Product updated');
    } else {
      await dispatch(createProduct(formData));
      toast.success('Product created');
    }
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      brand: '',
      category: '',
      price: '',
      discount: '',
      stock: '',
    });
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category?._id || product.category,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Brand</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=50'}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.brand}</td>
                  <td className="py-3 px-4">₹{product.sellingPrice}</td>
                  <td className="py-3 px-4">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-primary-500 hover:text-primary-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
