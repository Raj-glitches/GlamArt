import { useState, useEffect } from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  updateProfile,
  logout,
} from '../../slices/authSlice';

import {
  toast,
} from 'react-toastify';

const Profile = () => {

  const dispatch =
    useDispatch();

  const {
    user,
    isLoading,
  } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] =
    useState({

      name: '',

      email: '',

      phone: '',
    });

  const [errors, setErrors] =
    useState({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {

    if (user) {

      setFormData({

        name:
          user.name || '',

        email:
          user.email || '',

        phone:
          user.phone || '',
      });
    }

  }, [user]);

  /* ============================================
     HANDLE CHANGE
  ============================================ */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    let sanitizedValue =
      value;

    // PHONE VALIDATION
    if (name === 'phone') {

      sanitizedValue =
        value
          .replace(/\D/g, '')
          .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        sanitizedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  /* ============================================
     VALIDATION
  ============================================ */

  const validateForm = () => {

    const newErrors = {};

    // NAME
    if (
      !formData.name ||
      !formData.name.trim()
    ) {

      newErrors.name =
        'Full name is required';

    } else if (
      formData.name
        .trim()
        .length < 3
    ) {

      newErrors.name =
        'Name must be at least 3 characters';
    }

    // PHONE
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      formData.phone &&
      !phoneRegex.test(
        formData.phone
      )
    ) {

      newErrors.phone =
        'Enter valid Indian mobile number';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /* ============================================
     SUBMIT
  ============================================ */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (isSubmitting)
        return;

      const isValid =
        validateForm();

      if (!isValid)
        return;

      try {

        setIsSubmitting(true);

        const payload = {

          name:
            formData.name.trim(),

          phone:
            formData.phone.trim(),
        };

        const result =
          await dispatch(
            updateProfile(
              payload
            )
          );

        if (
          result?.error
        ) {

          toast.error(
            result?.payload ||
            'Profile update failed'
          );

          return;
        }

        toast.success(
          'Profile updated successfully'
        );

      } catch (error) {

        console.error(error);

        toast.error(
          'Something went wrong'
        );

      } finally {

        setIsSubmitting(false);
      }
    };

  /* ============================================
     LOGOUT
  ============================================ */

  const handleLogout = () => {

    // CLEAR STORAGE
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'userInfo'
    );

    // REDUX LOGOUT
    dispatch(logout());

    toast.success(
      'Logged out successfully'
    );

    // REDIRECT
    window.location.href =
      '/login';
  };

  return (

    <div className="container-custom py-8">

      <h1 className="text-3xl font-display font-bold mb-8">
        My Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* SIDEBAR */}
        <div className="lg:col-span-1">

          <div className="bg-white rounded-xl shadow-card p-6">

            <div className="text-center">

              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">

                <span className="text-3xl font-bold text-primary-600">

                  {
                    user?.name
                      ?.charAt(0)
                      ?.toUpperCase()
                  }

                </span>
              </div>

              <h2 className="text-xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-500">
                {user?.email}
              </p>

              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm capitalize">

                {user?.role}

              </span>

              {/* LOGOUT BUTTON */}
              <button
                onClick={
                  handleLogout
                }

                className="
                  mt-6
                  w-full
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-2
                  rounded-lg
                  font-medium
                  transition-all
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-2">

          <div className="bg-white rounded-xl shadow-card p-6">

            <h2 className="text-xl font-bold mb-6">
              Personal Information
            </h2>

            <form
              onSubmit={
                handleSubmit
              }

              className="space-y-4"
            >

              {/* NAME */}
              <div>

                <label className="label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                />

                {
                  errors.name && (

                    <p className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )
                }
              </div>

              {/* EMAIL */}
              <div>

                <label className="label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  className="input bg-gray-100"
                  disabled
                />

                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* PHONE */}
              <div>

                <label className="label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                />

                {
                  errors.phone && (

                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )
                }
              </div>

              {/* BUTTON */}
              <button
                type="submit"

                disabled={
                  isLoading ||
                  isSubmitting
                }

                className={`
                  btn-primary

                  ${
                    isLoading ||
                    isSubmitting
                      ? 'opacity-60 cursor-not-allowed'
                      : ''
                  }
                `}
              >

                {
                  isLoading ||
                  isSubmitting
                    ? 'Updating...'
                    : 'Update Profile'
                }

              </button>
            </form>
          </div>

          {/* SAVED ADDRESSES */}
          <div className="bg-white rounded-xl shadow-card p-6 mt-6">

            <h2 className="text-xl font-bold mb-6">
              Saved Addresses
            </h2>

            {
              user?.addresses
                ?.length > 0 ? (

                <div className="space-y-4">

                  {
                    user.addresses.map(
                      (
                        address,
                        index
                      ) => (

                        <div
                          key={index}

                          className="border rounded-lg p-4"
                        >

                          <p className="font-medium">
                            {address.name}
                          </p>

                          <p className="text-gray-600">
                            {address.street}
                          </p>

                          <p className="text-gray-600">

                            {address.city},
                            {' '}
                            {address.state}
                            {' '}
                            -
                            {' '}
                            {address.pincode}

                          </p>

                          <p className="text-gray-500">
                            {address.phone}
                          </p>
                        </div>
                      )
                    )
                  }
                </div>

              ) : (

                <p className="text-gray-500">
                  No saved addresses
                </p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;