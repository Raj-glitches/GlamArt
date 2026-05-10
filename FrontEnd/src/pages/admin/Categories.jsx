import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // GET USER TOKEN SAFELY
  const getToken = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem('user')
      );

      return user?.token || '';
    } catch {
      return '';
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(API_URL);

      setCategories(
        Array.isArray(response?.data?.data)
          ? response.data.data
          : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to load categories'
      );

      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });

    setEditingCategory(null);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);

    resetForm();
  };

  // OPEN EDIT
  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category?.name || '',
      description:
        category?.description || '',
    });

    setShowModal(true);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.name.trim()) {
      toast.error(
        'Category name is required'
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const token = getToken();

      if (!token) {
        toast.error('Unauthorized');

        return;
      }

      const payload = {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
      };

      // EDIT
      if (editingCategory?._id) {
        await axios.put(
          `${API_URL}/${editingCategory._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          'Category updated successfully'
        );
      }

      // CREATE
      else {
        await axios.post(
          API_URL,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          'Category created successfully'
        );
      }

      closeModal();

      fetchCategories();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          'Failed to save category'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete =
      window.confirm(
        'Delete this category?'
      );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        'Category deleted successfully'
      );

      setCategories((prev) =>
        prev.filter(
          (item) => item?._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          'Failed to delete category'
      );
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          Add Category
        </button>
      </div>

      {/* EMPTY STATE */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">
            No Categories Found
          </h2>

          <p className="text-gray-500 mb-6">
            Start by creating your first
            category.
          </p>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="btn-primary"
          >
            Create Category
          </button>
        </div>
      ) : (

        /* GRID */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {categories.map((category) => (

            <div
              key={category?._id}
              className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                p-6
                hover:shadow-md
                transition
              "
            >

              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {category?.name}
              </h3>

              <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                {category?.description ||
                  'No description available'}
              </p>

              <div className="bg-gray-50 rounded-lg p-2 mb-5 text-xs text-gray-500 break-all">
                Slug: {category?.slug}
              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    handleEdit(category)
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                    hover:bg-blue-100
                    transition
                    text-sm
                    font-medium
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      category?._id
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-red-50
                    text-red-600
                    hover:bg-red-100
                    transition
                    text-sm
                    font-medium
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-xl
              w-full
              max-w-md
              p-6
            "
          >

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {editingCategory
                  ? 'Edit Category'
                  : 'Add Category'}
              </h2>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="label">
                  Category Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                  className="input"
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="label">
                  Description
                </label>

                <textarea
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
                  rows={4}
                  placeholder="Enter category description"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingCategory
                    ? 'Update'
                    : 'Create'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
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

export default Categories;