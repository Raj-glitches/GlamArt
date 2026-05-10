import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import axios from 'axios';

import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../../slices/productSlice';

import { toast } from 'react-toastify';

const initialFormState = {
  title: '',
  description: '',
  brand: '',
  category: '',
  price: '',
  discount: '',
  stock: '',
};

const Products = () => {

  const dispatch = useDispatch();

  const {
    products = [],
    isLoading,
  } = useSelector(
    (state) => state.products || {}
  );

  const [categories, setCategories] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const [formData, setFormData] =
    useState(initialFormState);

  // FETCH PRODUCTS
  useEffect(() => {
    dispatch(
      getProducts({
        limit: 50,
      })
    );

    fetchCategories();
  }, [dispatch]);

  // FETCH CATEGORIES
  const fetchCategories = async () => {

    try {

      const response = await axios.get(
        'http://localhost:5000/api/categories'
      );

      setCategories(
        Array.isArray(
          response?.data?.data
        )
          ? response.data.data
          : []
      );

    } catch (error) {

      console.error(error);

      setCategories([]);
    }
  };

  // SEARCHED PRODUCTS
  const filteredProducts = useMemo(() => {

    return (products || []).filter(
      (product) => {

        if (!product) return false;

        return (
          product?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          product?.brand
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
      }
    );

  }, [products, search]);

  // RESET FORM
  const resetForm = () => {

    setFormData(initialFormState);

    setEditingProduct(null);

    setShowModal(false);
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {

    if (!id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    try {

      const result = await dispatch(
        deleteProduct(id)
      );

      if (
        deleteProduct.fulfilled.match(
          result
        )
      ) {

        toast.success(
          'Product deleted'
        );

      } else {

        toast.error(
          result.payload ||
            'Delete failed'
        );
      }

    } catch (error) {

      toast.error(
        'Failed to delete product'
      );
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (
      !formData.title ||
      !formData.description ||
      !formData.brand ||
      !formData.price ||
      !formData.stock
    ) {

      toast.error(
        'Please fill all required fields'
      );

      return;
    }

    try {

      let result;

      if (editingProduct) {

        result = await dispatch(
          updateProduct({
            id: editingProduct._id,
            productData: formData,
          })
        );

        if (
          updateProduct.fulfilled.match(
            result
          )
        ) {

          toast.success(
            'Product updated'
          );

        } else {

          toast.error(
            result.payload ||
              'Update failed'
          );

          return;
        }

      } else {

        result = await dispatch(
          createProduct(formData)
        );

        if (
          createProduct.fulfilled.match(
            result
          )
        ) {

          toast.success(
            'Product created'
          );

        } else {

          toast.error(
            result.payload ||
              'Creation failed'
          );

          return;
        }
      }

      resetForm();

    } catch (error) {

      console.error(error);

      toast.error(
        'Something went wrong'
      );
    }
  };

  // OPEN EDIT
  const openEditModal = (
    product
  ) => {

    if (!product) return;

    setEditingProduct(product);

    setFormData({
      title:
        product?.title || '',

      description:
        product?.description || '',

      brand:
        product?.brand || '',

      category:
        product?.category?._id ||
        product?.category ||
        '',

      price:
        product?.price || '',

      discount:
        product?.discount || '',

      stock:
        product?.stock || '',
    });

    setShowModal(true);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all products
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="input min-w-[250px]"
          />

          {/* ADD */}
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* LOADING */}
      {isLoading ? (

        <div className="flex justify-center py-20">
          <div className="spinner w-12 h-12"></div>
        </div>

      ) : filteredProducts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

          <h2 className="text-2xl font-semibold mb-2">
            No Products Found
          </h2>

          <p className="text-gray-500">
            Add your first product
          </p>
        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left py-4 px-4">
                    Product
                  </th>

                  <th className="text-left py-4 px-4">
                    Brand
                  </th>

                  <th className="text-left py-4 px-4">
                    Category
                  </th>

                  <th className="text-left py-4 px-4">
                    Price
                  </th>

                  <th className="text-left py-4 px-4">
                    Stock
                  </th>

                  <th className="text-left py-4 px-4">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (

                    <tr
                      key={product?._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* PRODUCT */}
                      <td className="py-4 px-4">

                        <div className="flex items-center gap-4">

                          <img
                            src={
                              product?.images?.[0]
                                ?.url ||
                              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'
                            }

                            alt={
                              product?.title ||
                              'Product'
                            }

                            className="w-14 h-14 rounded-xl object-cover border"
                          />

                          <div>

                            <h3 className="font-medium">
                              {product?.title ||
                                'Untitled'}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              ID:{' '}
                              {product?._id?.slice(
                                -6
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* BRAND */}
                      <td className="py-4 px-4">
                        {product?.brand ||
                          'N/A'}
                      </td>

                      {/* CATEGORY */}
                      <td className="py-4 px-4">
                        {product?.category
                          ?.name ||
                          'N/A'}
                      </td>

                      {/* PRICE */}
                      <td className="py-4 px-4 font-semibold">
                        ₹
                        {Number(
                          product?.sellingPrice ||
                            product?.price ||
                            0
                        ).toLocaleString()}
                      </td>

                      {/* STOCK */}
                      <td className="py-4 px-4">

                        <span
                          className={
                            product?.stock > 0
                              ? 'text-green-600 font-medium'
                              : 'text-red-600 font-medium'
                          }
                        >
                          {product?.stock || 0}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-4">

                        <div className="flex items-center gap-4">

                          <button
                            onClick={() =>
                              openEditModal(
                                product
                              )
                            }

                            className="text-primary-500 hover:text-primary-700 font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }

                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}
            <div className="p-6 border-b">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add Product'}
                </h2>

                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* TITLE */}
              <div>
                <label className="label">
                  Title
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title:
                        e.target.value,
                    })
                  }
                  className="input"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="label">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                  className="input"
                  required
                />
              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-2 gap-4">

                {/* BRAND */}
                <div>
                  <label className="label">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brand:
                          e.target.value,
                      })
                    }
                    className="input"
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="label">
                    Category
                  </label>

                  <select
                    value={
                      formData.category
                    }

                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category:
                          e.target.value,
                      })
                    }

                    className="input"
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (

                        <option
                          key={
                            category?._id
                          }
                          value={
                            category?._id
                          }
                        >
                          {category?.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

              {/* PRICE GRID */}
              <div className="grid md:grid-cols-3 gap-4">

                <div>
                  <label className="label">
                    Price
                  </label>

                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price:
                          e.target.value,
                      })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    Discount %
                  </label>

                  <input
                    type="number"
                    value={
                      formData.discount
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount:
                          e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    Stock
                  </label>

                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock:
                          e.target.value,
                      })
                    }
                    className="input"
                    required
                  />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">

                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingProduct
                    ? 'Update Product'
                    : 'Create Product'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline flex-1"
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